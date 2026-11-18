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
const LIVE = /ao vivo|live|ac[uú]stic|acoustic|remix|karaok|instrumental|cover|vers[aã]o/i;

function score(song, t, anyArtist) {
  const want = norm(song.title);
  const got = norm(t.title_short || t.title);
  let s = 0;
  if (got === want) s += 6;
  else if (got.includes(want) || want.includes(got)) s += 3;
  else return -1;
  const an = squash(t.artist && t.artist.name);
  const artistOk = artistParts(song.artist).some((p) => { p = p.replace(/ /g, ''); return p && an && (an.includes(p) || p.includes(an)); });
  if (artistOk) s += 4;
  else if (!anyArtist || got !== want || /karaok|originally|tribute|made famous/i.test(t.title + ' ' + t.artist.name)) return -1;
  if (LIVE.test(t.title) || LIVE.test((t.album && t.album.title) || '')) s -= 3;
  s += Math.min(3, (t.rank || 0) / 300000);
  return s;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function search(q) {
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

async function findCover(song) {
  const main = song.artist.split(/\s+(?:feat\.?|ft\.?)\s+/i)[0];
  const title = song.title.replace(/\(.*?\)/g, '').trim();
  const queries = [
    [`artist:"${main}" track:"${title}"`, false],
    [`${main} ${title}`, false],
    [`${title} ${artistParts(song.artist)[1] || ''}`, false],
    [`${main} ${title}`, true] // último recurso: mesmo título, artista com outro nome no Deezer
  ];
  for (const [q, anyArtist] of queries) {
    const results = await search(q);
    let best = null, bestScore = -1;
    for (const t of results.slice(0, anyArtist ? 3 : 15)) {
      const sc = score(song, t, anyArtist);
      if (sc < 0 || !t.md5_image) continue;
      const withPreview = sc + (t.preview && t.readable !== false ? 2 : 0); // prefere faixa com trecho
      if (withPreview > bestScore) { best = t; bestScore = withPreview; }
    }
    if (best) return [best.md5_image, best.id];
  }
  return null;
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
else module.exports = { findCover, score, search };
