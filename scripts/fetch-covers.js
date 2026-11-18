/*
 * Busca a capa e o id da faixa de cada música na API pública do Deezer e grava em
 * public/covers.js como  id da música -> [hash da capa, id da faixa no Deezer].
 * O id da faixa serve para o servidor pegar o trecho de 30 s (o link do trecho expira,
 * então ele é buscado na hora, em /api/preview).
 *   node scripts/fetch-covers.js          -> busca só as que ainda não têm capa
 *   node scripts/fetch-covers.js --all    -> busca tudo de novo
 * As músicas que não forem encontradas aparecem no fim e ficam com a capa padrão.
 */
const fs = require('fs');
const path = require('path');
const Game = require('../shared/game');

const OUT = path.join(__dirname, '..', 'public', 'covers.js');
const REFRESH = process.argv.includes('--all');

function loadExisting() {
  if (REFRESH || !fs.existsSync(OUT)) return {};
  const m = fs.readFileSync(OUT, 'utf8').match(/=\s*(\{[\s\S]*\});?\s*$/);
  return m ? JSON.parse(m[1]) : {};
}

function norm(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/\(.*?\)|\[.*?\]/g, ' ').replace(/&/g, ' e ')
    .replace(/\b(parte?|pt)\.?\s*(ii|2)\b/g, 'pt 2').replace(/\b(parte?|pt)\.?\s*(i|1)\b/g, 'pt 1')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}
const squash = (s) => norm(s).replace(/ /g, '');
// "Henrique & Juliano feat. X" -> ["henrique juliano", "henrique", "juliano", "x"]
function artistParts(a) {
  const main = a.split(/\s+(?:feat\.?|ft\.?|part\.?|com)\s+/i)[0];
  const parts = a.split(/\s*(?:,|&|\be\b|\bx\b|feat\.?|ft\.?|part\.?)\s*/i).map(norm).filter((p) => p.length > 1);
  return [norm(main), ...parts];
}
// Trechos entre parênteses (ou depois de " - ") que indicam a própria gravação do sucesso,
// só com outro corte ou remasterização: "Radio Edit", "Single Version", "Remastered 2009"...
const CANON_WORDS = /\b(?:original|us|uk|radio|single|album|lp|main|video|short|7["”]?|7-inch|soundtrack|edit|version|mix|remaster(?:ed)?|remasterizad[oa]|em|mono|stereo|\d{4})\b/gi;
const isCanon = (x) => !x.replace(CANON_WORDS, '').replace(/[\s;,/&.'’-]+/g, '');
// Versões que não são a gravação conhecida. Só valem se o próprio título no jogo pedir.
const ALTERED = /\b(re-?mix|rmx|mix(?:ed)?|medley|mashup|extended|sped ?up|slowed|reverb|karaok\w*|instrumental|a ?cc?app?ella|cover|tribute|lullaby|8.?bit|piano|orchestral|orquestra\w*|bootleg|edit|dub|lo-?fi|ac[uú]stic[oa]|acoustic|unplugged|demo|re-?recorded|remake|reimagined|reprise|powermix|club|bonus|rehe?arsal|taylor.s version|vers[aã]o|version|ensaio|vs\.?|incidenta(?:l|is))\b/i;
const LIVE = /\b(ao vivo|live|en vivo|en directo|sessions?|multishow|dvd|mtv|gravad[oa] na deezer|el[eé]trico|ac[uú]stico|acoustic|unplugged)\b/i;
// Coletâneas de festa/remix costumam trazer outra gravação da faixa (coletânea de
// sucessos com a gravação original não perde nada).
const PARTY = /festeja|na pista|arrocha|pancad[aã]o|esquenta|bail[aã]o|flashback|ploc|remix|fitness|workout|sped up|slowed|dj mix|megamix|\bmixed\b|a ?cc?app?ella|karaok|babies go|by request/i;
// Regravações de terceiros disfarçadas (artista "Made famous by X", "In the style of X"...)
const FAKE = /made famous|in the style|originally|tribute|karaok|cover|sax|lullaby|8.?bit|performed by|as made|emulation/i;

// Título igual, ou o título do jogo inteiro dentro do título do Deezer como palavras
// (ex.: "Bonde Passou" x "O Bonde Passou"), mas nunca com número a mais
// ("Poesia Acústica 1" não aceita "Poesia Acústica 13") nem título de 1 palavra curta.
function titleScore(want, got) {
  if (got === want) return 6;
  const [short, long] = want.length <= got.length ? [want, got] : [got, want];
  if (short.length < 4) return -Infinity;
  const i = (' ' + long + ' ').indexOf(' ' + short + ' ');
  if (i < 0) return -Infinity;
  const rest = (long.slice(0, i) + ' ' + long.slice(i + short.length)).trim();
  if (/\b\d{1,2}\b/.test(rest) || rest.split(' ').length > 3) return -Infinity;
  return 2;
}

function score(song, t, anyArtist) {
  const want = norm(song.title);
  const got = norm(t.title_short || t.title);
  const ts = titleScore(want, got);
  if (ts < 0) return -Infinity;
  let s = ts;
  const artistName = (t.artist && t.artist.name) || '';
  const album = (t.album && t.album.title) || '';
  if ((FAKE.test(artistName) || FAKE.test(t.title)) && !FAKE.test(song.artist + ' ' + song.title)) return -Infinity;
  // "Grupo Revelação" = "Revelação", "MC Kevin o Chris" = "Kevin o Chris"; mas "Hello I'm Adele" não é Adele
  const bare = (x) => x.replace(/^(grupo|the|os|as|mc|dj|banda)(?=.{3})/, '');
  const an = bare(squash(artistName));
  const parts = artistParts(song.artist).map((p) => bare(p.replace(/ /g, ''))).filter(Boolean);
  if (an && parts.some((p) => an.startsWith(p) || p.startsWith(an))) s += 4; // nome igual (ou "X e Y" começando por X)
  else if (!anyArtist || got !== want || (t.rank || 0) < 300000) return -Infinity; // outro nome: só faixa muito ouvida
  // Tira os parênteses que não mudam a gravação: cortes/remasterizações ("Radio Edit") e
  // créditos de quem está na música ("feat. Sean Paul", "Cardi B Version").
  const credit = (x) => /^\s*(feat|ft|with|com|part)\b/i.test(x) ||
    (parts.some((p) => p.length > 2 && squash(x).includes(p)) && /^[^;]*\b(version|vs\.?|x)\b[^;]*$/i.test(x) && x.split(/\s+/).length <= 6);
  const full = [t.title, t.title_version].filter(Boolean).join(' ')
    .replace(/\s+-\s+([^()[\]]+)$/, ' ($1)')
    .replace(/[([]([^)\]]*)[)\]]/g, (m, x) => (isCanon(x) || credit(x) ? ' ' : m));
  // o que o título do jogo traz entre parênteses ("PNAU Remix", "This Time for Africa")
  // tem que estar na versão do Deezer
  const wantParen = (song.title.match(/\(([^)]*)\)/) || [])[1];
  if (wantParen && !norm(t.title + ' ' + (t.title_version || '')).includes(norm(wantParen))) s -= 6;
  if (ALTERED.test(full) && !ALTERED.test(song.title)) s -= 10;
  if ((LIVE.test(full) || LIVE.test(album)) && !LIVE.test(song.title)) {
    // no sertanejo e no pagode o sucesso costuma ser a gravação ao vivo
    s -= song.genre === 'sert' || song.genre === 'pag' ? 1 : 4;
  }
  if ((PARTY.test(album) && !PARTY.test(song.title)) || FAKE.test(album)) s -= 4;
  s += Math.min(4, (t.rank || 0) / 200000);
  return s;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let searchImpl = searchDeezer;
const search = (q) => searchImpl(q);
async function searchDeezer(q) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch('https://api.deezer.com/search?limit=15&q=' + encodeURIComponent(q));
      const body = await res.json();
      if (body.error) { await sleep(1500 * (attempt + 1)); continue; } // limite de requisições
      return body.data || [];
    } catch { await sleep(1500 * (attempt + 1)); }
  }
  return [];
}

async function findTrack(song) {
  const main = song.artist.split(/\s+(?:feat\.?|ft\.?)\s+/i)[0];
  const title = song.title.replace(/\(.*?\)/g, '').trim();
  const queries = [
    [`artist:"${main}" track:"${title}"`, false],
    [`${main} ${title}`, false],
    [`${title} ${artistParts(song.artist)[1] || ''}`, false],
    [`${main} ${title}`, true] // último recurso: mesmo título, artista com outro nome no Deezer
  ];
  // As duas primeiras buscas entram juntas na disputa (a 1ª às vezes só traz remix);
  // as outras só se nada servir.
  let best = null, bestScore = -Infinity;
  for (let i = 0; i < queries.length; i++) {
    const [q, anyArtist] = queries[i];
    const results = await search(q);
    for (const t of results.slice(0, anyArtist ? 3 : 15)) {
      const sc = score(song, t, anyArtist);
      if (sc === -Infinity || !t.md5_image || !t.preview || t.readable === false) continue; // tem que ter trecho
      if (sc > bestScore) { best = t; bestScore = sc; }
    }
    if (best && i >= 1) break;
  }
  return best;
}

async function findCover(song) {
  const t = await findTrack(song);
  return t ? [t.md5_image, t.id] : null;
}

async function main() {
  const covers = loadExisting();
  const todo = Game.SONGS.filter((s) => !Array.isArray(covers[s.id]));
  console.log(`${Game.SONGS.length} músicas, ${todo.length} para buscar`);
  const missing = [];
  let done = 0;
  const CONCURRENCY = 6;
  let next = 0;
  async function worker() {
    while (next < todo.length) {
      const song = todo[next++];
      const found = await findCover(song);
      if (found) covers[song.id] = found; else { delete covers[song.id]; missing.push(song); }
      if (++done % 100 === 0) { console.log(`  ${done}/${todo.length}`); save(covers); }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  // remove capas de músicas que saíram da lista
  for (const id of Object.keys(covers)) if (!Game.SONG_BY_ID[id]) delete covers[id];
  save(covers);
  console.log(`Pronto: ${Object.keys(covers).length} capas.`);
  if (missing.length) {
    console.log(`Sem capa (${missing.length}):`);
    missing.forEach((s) => console.log(`  ${s.year}|${s.genre}|${s.artist}|${s.title}`));
  }
}

function save(covers) {
  const sorted = Object.fromEntries(Object.keys(covers).sort().map((k) => [k, covers[k]]));
  fs.writeFileSync(OUT,
    '// Gerado por scripts/fetch-covers.js. id da música -> [hash da capa, id da faixa no Deezer]\n' +
    'window.COVERS = ' + JSON.stringify(sorted).replace(/\],"/g, '],\n"') + ';\n');
}

// node scripts/fetch-covers.js roda a busca; require() só exporta a função de busca
if (require.main === module) main();
else module.exports = { findCover, findTrack, score, search: searchDeezer, setSearch: (f) => { searchImpl = f; } };
