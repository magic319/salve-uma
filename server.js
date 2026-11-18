const path = require('path');
const fs = require('fs');
const express = require('express');
const Game = require('./shared/game');

const PORT = process.env.PORT || 3000;
const app = express();
app.set('trust proxy', 1); // Railway fica atrás de um proxy
app.use(express.json({ limit: '2kb' }));

// ---------------------------------------------------------------------------
// Armazenamento: Postgres quando DATABASE_URL existe (Railway), senão arquivo JSON.
// Cada pessoa tem 1 voto por rodada; votar de novo troca o voto.
// ---------------------------------------------------------------------------
function createPgStore(url) {
  const { Pool } = require('pg');
  const ssl = /localhost|127\.0\.0\.1|\.railway\.internal/.test(url) ? false : { rejectUnauthorized: false };
  const pool = new Pool({ connectionString: url, ssl });
  return {
    kind: 'postgres',
    async init() {
      await pool.query(`CREATE TABLE IF NOT EXISTS votes (
        voter_id   TEXT NOT NULL,
        round_id   TEXT NOT NULL,
        song_id    TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        PRIMARY KEY (voter_id, round_id)
      )`);
      await pool.query('CREATE INDEX IF NOT EXISTS votes_round_idx ON votes (round_id)');
    },
    async vote(voterId, roundId, songId) {
      await pool.query(
        `INSERT INTO votes (voter_id, round_id, song_id) VALUES ($1, $2, $3)
         ON CONFLICT (voter_id, round_id) DO UPDATE SET song_id = EXCLUDED.song_id, updated_at = now()`,
        [voterId, roundId, songId]
      );
    },
    async counts(roundPrefix) {
      const { rows } = await pool.query(
        'SELECT round_id, song_id, COUNT(*)::int AS n FROM votes WHERE round_id LIKE $1 GROUP BY round_id, song_id',
        [roundPrefix + '%']
      );
      return rows;
    }
  };
}

function createFileStore(file) {
  let votes = {}; // { voterId: { roundId: songId } }
  let saving = Promise.resolve();
  return {
    kind: 'arquivo ' + path.relative(process.cwd(), file),
    async init() {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      if (fs.existsSync(file)) votes = JSON.parse(fs.readFileSync(file, 'utf8'));
    },
    async vote(voterId, roundId, songId) {
      (votes[voterId] = votes[voterId] || {})[roundId] = songId;
      const snapshot = JSON.stringify(votes);
      saving = saving.then(() => fs.promises.writeFile(file, snapshot));
      await saving;
    },
    async counts(roundPrefix) {
      const map = {};
      for (const picks of Object.values(votes)) {
        for (const [roundId, songId] of Object.entries(picks)) {
          if (!roundId.startsWith(roundPrefix)) continue;
          const k = roundId + '|' + songId;
          map[k] = (map[k] || 0) + 1;
        }
      }
      return Object.entries(map).map(([k, n]) => {
        const [round_id, song_id] = k.split('|');
        return { round_id, song_id, n };
      });
    }
  };
}

const store = process.env.DATABASE_URL
  ? createPgStore(process.env.DATABASE_URL)
  : createFileStore(path.join(__dirname, 'data', 'votes.json'));

// ---------------------------------------------------------------------------
// Limite simples de votos por IP (evita spam óbvio)
// ---------------------------------------------------------------------------
const hits = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip;
  const entry = hits.get(key);
  if (!entry || now - entry.start > 60_000) hits.set(key, { start: now, n: 1 });
  else if (++entry.n > 90) return res.status(429).json({ error: 'Muitos votos em pouco tempo. Espere um minuto.' });
  next();
}
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of hits) if (now - v.start > 60_000) hits.delete(k);
}, 60_000).unref();

function toResults(rows) {
  const out = {};
  for (const r of rows) {
    const round = Game.ROUNDS[r.round_id];
    // ignora votos em músicas que saíram da lista
    if (!round || !round.options.some((s) => s.id === r.song_id)) continue;
    (out[r.round_id] = out[r.round_id] || {})[r.song_id] = r.n;
  }
  return out;
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------
const VOTER_RE = /^[a-zA-Z0-9-]{16,64}$/;

app.get('/api/results', async (req, res, next) => {
  try {
    const cat = String(req.query.cat || '');
    if (!Game.CATEGORIES.some((c) => c.key === cat)) return res.status(400).json({ error: 'Categoria inválida.' });
    res.json({ results: toResults(await store.counts(cat + ':')) });
  } catch (e) { next(e); }
});

app.post('/api/vote', rateLimit, async (req, res, next) => {
  try {
    const { voterId, roundId, songId } = req.body || {};
    if (typeof voterId !== 'string' || !VOTER_RE.test(voterId)) return res.status(400).json({ error: 'Identificador de jogador inválido.' });
    const round = Game.ROUNDS[roundId];
    if (!round) return res.status(400).json({ error: 'Rodada inválida.' });
    if (!round.options.some((s) => s.id === songId)) return res.status(400).json({ error: 'Essa música não está nesta rodada.' });
    await store.vote(voterId, roundId, songId);
    const results = toResults(await store.counts(roundId));
    res.json({ ok: true, counts: results[roundId] || {} });
  } catch (e) { next(e); }
});

// Ranking das músicas mais salvas (geral ou por categoria)
app.get('/api/top', async (req, res, next) => {
  try {
    const cat = String(req.query.cat || '');
    if (cat && !Game.CATEGORIES.some((c) => c.key === cat)) return res.status(400).json({ error: 'Categoria inválida.' });
    const results = toResults(await store.counts(cat ? cat + ':' : ''));
    const totals = {};
    for (const counts of Object.values(results)) for (const [id, n] of Object.entries(counts)) totals[id] = (totals[id] || 0) + n;
    const top = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 10)
      .map(([id, votes]) => ({ ...Game.SONG_BY_ID[id], votes }));
    res.json({ top });
  } catch (e) { next(e); }
});

// ---------------------------------------------------------------------------
// Trechos de 30 s do Deezer. O link do trecho expira depois de algumas horas,
// então o servidor pega um link novo pelo id da faixa (salvo em public/covers.js)
// e guarda em cache até perto de expirar.
// ---------------------------------------------------------------------------
const COVERS_FILE = path.join(__dirname, 'public', 'covers.js');
let covers = {};
let coversMtime = 0;
function trackIdFor(songId) {
  try {
    const mtime = fs.statSync(COVERS_FILE).mtimeMs;
    if (mtime !== coversMtime) {
      const m = fs.readFileSync(COVERS_FILE, 'utf8').match(/=\s*(\{[\s\S]*\});?\s*$/);
      covers = m ? JSON.parse(m[1]) : {};
      coversMtime = mtime;
    }
  } catch { /* sem arquivo de capas: sem trechos */ }
  const c = covers[songId];
  return Array.isArray(c) ? c[1] : null;
}

// O Deezer limita ~50 requisições a cada 5 s por IP. Esta fila segura no máximo
// 4 ao mesmo tempo, e um erro de limite espera e tenta de novo (sem guardar "sem trecho").
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let deezerBusy = 0;
const deezerQueue = [];
async function deezerTrack(trackId) {
  if (deezerBusy >= 4) await new Promise((r) => deezerQueue.push(r));
  deezerBusy++;
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetch('https://api.deezer.com/track/' + trackId, { signal: AbortSignal.timeout(5000) });
      const body = await res.json();
      if (!body.error) return body;
      await sleep(1200 * (attempt + 1));
    }
    throw new Error('Deezer ocupado');
  } finally {
    deezerBusy--;
    const next = deezerQueue.shift();
    if (next) next();
  }
}

const previewCache = new Map(); // songId -> { url, until }
async function previewFor(songId) {
  const hit = previewCache.get(songId);
  if (hit && hit.until > Date.now()) return hit.url;
  const trackId = trackIdFor(songId);
  if (!trackId) return null;
  const body = await deezerTrack(trackId); // erro aqui não entra no cache: tenta de novo na próxima vez
  const url = (body && body.preview) || null;
  const exp = url && Number((url.match(/exp=(\d+)/) || [])[1]);
  // guarda até 10 min antes de expirar (ou 1 h se o link não disser quando expira)
  const until = exp ? exp * 1000 - 10 * 60_000 : Date.now() + 60 * 60_000;
  previewCache.set(songId, { url, until: url ? until : Date.now() + 10 * 60_000 });
  return url;
}

app.get('/api/preview', async (req, res, next) => {
  try {
    const ids = String(req.query.ids || '').split(',').filter((id) => Game.SONG_BY_ID[id]).slice(0, 8);
    const out = {};
    await Promise.all(ids.map(async (id) => {
      try { out[id] = await previewFor(id); } catch { out[id] = null; }
    }));
    res.json({ previews: out });
  } catch (e) { next(e); }
});

app.get('/health', (req, res) => res.json({ ok: true, store: store.kind }));

// ---------------------------------------------------------------------------
// Arquivos do site
// ---------------------------------------------------------------------------
// Sem cache longo: o navegador confere (ETag) a cada carregamento, então uma versão nova
// do jogo aparece no próximo F5 em vez de ficar até 1 h presa no cache.
app.get('/game.js', (req, res) => res.sendFile(path.join(__dirname, 'shared', 'game.js'), { maxAge: 0 }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0 }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro no servidor. Tente de novo.' });
});

store.init()
  .then(() => app.listen(PORT, () => console.log(`Salve Uma rodando em http://localhost:${PORT} (votos: ${store.kind})`)))
  .catch((e) => { console.error('Falha ao iniciar o banco:', e); process.exit(1); });
