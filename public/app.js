(function () {
  const { CATEGORIES, GENRES, roundsFor, SONG_BY_ID } = window.Game;
  const $ = (id) => document.getElementById(id);
  const TYPE_LABEL = { br: 'Só Brasil', gr: 'Só gringa', mix: 'Misturado' };

  // ---------- armazenamento local (id do jogador e últimas escolhas) ----------
  function load(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sem armazenamento: segue o jogo */ }
  }
  function newId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }
  let voterId = load('salvauma:voter', null);
  if (!voterId) { voterId = newId(); save('salvauma:voter', voterId); }
  const myPicks = load('salvauma:picks', {});

  // ---------- estado ----------
  const state = { cat: null, rounds: [], index: 0, results: {}, picks: [] };

  // ---------- navegação ----------
  const VIEWS = ['home', 'decade', 'round', 'summary', 'how'];
  function show(view) {
    if (view !== 'round' && typeof endIntro === 'function') { endIntro(); stopAudio(false); }
    VIEWS.forEach((v) => { $('view-' + v).hidden = v !== view; });
    window.scrollTo(0, 0);
    if (view === 'home') loadTop();
  }
  document.addEventListener('click', (e) => {
    const go = e.target.closest('[data-go]');
    if (go) show(go.dataset.go);
  });
  $('logo').addEventListener('click', () => show('home'));
  $('quit').addEventListener('click', () => show('home'));

  // ---------- helpers ----------
  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else n.setAttribute(k, v);
    });
    (children || []).forEach((c) => c && n.append(c));
    return n;
  }
  function originPill(origin) {
    return el('span', { class: 'pill ' + (origin === 'br' ? 'pill-br' : 'pill-gr'), text: origin === 'br' ? 'BR' : 'GRINGA' });
  }
  function ytLink(song) {
    const q = encodeURIComponent(song.artist + ' ' + song.title);
    return el('a', { class: 'listen', href: 'https://www.youtube.com/results?search_query=' + q, target: '_blank', rel: 'noopener', text: 'Ouvir ↗' });
  }
  // Capa do álbum (Deezer). Sem capa conhecida, mostra as iniciais do artista.
  // window.COVERS[id] = [hash da capa, id da faixa no Deezer]
  const COVERS = window.COVERS || {};
  function coverUrl(song, size) {
    const c = COVERS[song.id];
    const md5 = Array.isArray(c) ? c[0] : c;
    return md5 ? 'https://cdn-images.dzcdn.net/images/cover/' + md5 + '/' + size + 'x' + size + '-000000-80-0-0.jpg' : null;
  }
  function initials(artist) {
    return artist.replace(/\(.*?\)/g, '').split(/[\s&,]+/).filter((w) => /^[\p{L}\d]/u.test(w)).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  }
  function cover(song, cls, size) {
    const box = el('span', { class: 'cover ' + (cls || '') + ' cover-' + song.origin, 'aria-hidden': 'true' }, [
      el('span', { class: 'cover-initials', text: initials(song.artist) })
    ]);
    const url = coverUrl(song, size || 250);
    if (url) {
      const img = el('img', { src: url, alt: '', loading: 'lazy', decoding: 'async' });
      img.addEventListener('error', () => img.remove());
      box.append(img);
    }
    return box;
  }
  function preloadCovers(round) {
    if (round) round.options.forEach((s) => { const u = coverUrl(s, 250); if (u) new Image().src = u; });
  }
  function yearsLabel(rounds) {
    if (!rounds.length) return 'sem anos';
    const a = rounds[0].year, b = rounds[rounds.length - 1].year;
    return rounds.length + (rounds.length === 1 ? ' ano' : ' anos') + ' · ' + (a === b ? a : a + '–' + b);
  }
  async function api(url, opts) {
    const res = await fetch(url, opts);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || 'Não foi possível falar com o servidor.');
    return body;
  }

  // ---------- home ----------
  function renderCategories() {
    ['br', 'gr', 'mix'].forEach((type) => {
      const grid = $('cats-' + type);
      grid.replaceChildren();
      CATEGORIES.filter((c) => c.type === type).forEach((cat) => {
        const rounds = roundsFor(cat.key);
        if (!rounds.length) return;
        const btn = el('button', { type: 'button', class: 'cat', 'data-type': type }, [
          el('span', { class: 'cat-name', text: cat.name }),
          el('span', { class: 'cat-meta', text: yearsLabel(rounds) })
        ]);
        btn.addEventListener('click', () => openDecades(cat));
        grid.append(btn);
      });
    });
  }

  async function loadTop() {
    const list = $('top-list');
    try {
      const { top } = await api('/api/top');
      list.replaceChildren();
      if (!top.length) {
        list.append(el('li', { class: 'muted', text: 'Ainda não tem votos. Jogue uma categoria e seja a primeira pessoa a salvar uma música.' }));
        return;
      }
      top.forEach((s) => list.append(el('li', {}, [
        cover(s, 'cover-sm', 56),
        el('span', { class: 'top-title' }, [document.createTextNode(s.title), el('small', { text: s.artist + ' · ' + s.year })]),
        el('span', { class: 'top-votes', text: s.votes + (s.votes === 1 ? ' voto' : ' votos') })
      ])));
    } catch (e) {
      list.replaceChildren(el('li', { class: 'muted', text: 'Não deu para carregar o ranking agora.' }));
    }
  }

  // ---------- escolha da década ----------
  function openDecades(cat) {
    state.cat = cat;
    const all = roundsFor(cat.key);
    $('decade-type').textContent = TYPE_LABEL[cat.type];
    $('decade-title').textContent = cat.name;
    const grid = $('decade-grid');
    grid.replaceChildren();

    const addBtn = (label, rounds, cls) => {
      const b = el('button', { type: 'button', class: 'decade' + (cls ? ' ' + cls : '') }, [
        el('strong', { text: label }),
        el('span', { text: rounds.length + (rounds.length === 1 ? ' rodada' : ' rodadas') })
      ]);
      b.addEventListener('click', () => startGame(rounds));
      grid.append(b);
    };
    addBtn('Todos', all, 'all');
    const decades = {};
    all.forEach((r) => { const d = Math.floor(r.year / 10) * 10; (decades[d] = decades[d] || []).push(r); });
    Object.keys(decades).sort().forEach((d) => {
      const label = d >= 2000 ? 'Anos ' + d : 'Anos ' + String(d).slice(2);
      addBtn(label, decades[d]);
    });
    show('decade');
  }

  // ---------- jogo ----------
  async function startGame(rounds) {
    state.rounds = rounds;
    state.index = 0;
    state.picks = [];
    state.results = {};
    show('round');
    renderRound();
    try {
      const { results } = await api('/api/results?cat=' + encodeURIComponent(state.cat.key));
      state.results = results;
    } catch { /* os resultados chegam junto com o voto */ }
  }

  // ---------- áudio: trechos de 30 s do Deezer ----------
  // As músicas aparecem uma por vez e cada uma toca um trechinho (SNIPPET_MS).
  // O botão de play de cada card continua a música de onde parou, ou pausa.
  const SNIPPET_MS = 5000;
  const NO_AUDIO_MS = 900; // sem trecho (ou som desligado): tempo até a próxima aparecer
  const audio = new Audio();
  audio.preload = 'auto';
  const player = {
    id: null,           // música carregada no <audio>
    positions: {},      // onde cada música parou, para o play continuar dali
    previews: {},       // id -> link do trecho (null = sem trecho)
    soundOn: load('salvauma:sound', true)
  };
  const intro = { token: 0, running: false, wake: null };
  let audioGen = 0; // muda a cada play/pausa: fades antigos não mexem no som novo

  async function loadPreviews(round) {
    const ids = round.options.map((s) => s.id).filter((id) => !(id in player.previews));
    if (!ids.length) return;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 4000);
      const { previews } = await api('/api/preview?ids=' + ids.map(encodeURIComponent).join(','), { signal: ctrl.signal });
      clearTimeout(timer);
      Object.assign(player.previews, previews);
    } catch { ids.forEach((id) => { if (!(id in player.previews)) player.previews[id] = null; }); }
  }

  function fade(to, ms) {
    const from = audio.volume, start = performance.now(), gen = audioGen;
    return new Promise((done) => {
      function step(now) {
        if (gen !== audioGen) return done();
        const t = Math.min(1, (now - start) / ms);
        audio.volume = Math.min(1, Math.max(0, from + (to - from) * t));
        if (t < 1) requestAnimationFrame(step); else done();
      }
      requestAnimationFrame(step);
    });
  }

  async function playSong(id, fromStart) {
    const url = player.previews[id];
    if (!url) return false;
    audioGen++;
    if (player.id !== id) {
      if (player.id) player.positions[player.id] = audio.currentTime;
      audio.src = url;
      player.id = id;
    }
    const pos = fromStart ? 0 : (player.positions[id] || 0);
    if (pos >= 29) player.positions[id] = 0;
    try {
      if (audio.readyState > 0) audio.currentTime = pos >= 29 ? 0 : pos;
      else audio.addEventListener('loadedmetadata', () => { audio.currentTime = pos >= 29 ? 0 : pos; }, { once: true });
      audio.volume = 0;
      await audio.play();
      fade(1, 250);
      return true;
    } catch { return false; } // navegador bloqueou o som ou o link falhou
  }

  async function stopAudio(smooth) {
    if (audio.paused) return;
    const gen = audioGen;
    if (smooth) {
      await fade(0, 300);
      if (gen !== audioGen) return; // outra música começou durante o fade
    }
    audioGen++;
    if (player.id) player.positions[player.id] = audio.currentTime;
    audio.pause();
  }

  function syncPlayButtons() {
    document.querySelectorAll('.opt').forEach((card) => {
      const on = card.dataset.id === player.id && !audio.paused;
      card.classList.toggle('playing', on);
      const b = card.querySelector('.play');
      if (b) {
        b.setAttribute('aria-label', (on ? 'Pausar ' : 'Tocar ') + b.dataset.title);
        b.dataset.state = on ? 'pause' : 'play';
      }
    });
  }
  ['play', 'pause', 'ended'].forEach((ev) => audio.addEventListener(ev, syncPlayButtons));
  audio.addEventListener('timeupdate', () => {
    const card = player.id && document.querySelector('.opt[data-id="' + CSS.escape(player.id) + '"] .playbar span');
    if (card && audio.duration) card.style.width = (audio.currentTime / audio.duration * 100) + '%';
  });

  function wait(ms) {
    return new Promise((resolve) => {
      const t = setTimeout(resolve, ms);
      intro.wake = () => { clearTimeout(t); resolve(); };
    });
  }

  // Mostra as músicas uma a uma, tocando um trechinho de cada.
  async function runIntro(round) {
    const token = ++intro.token;
    intro.running = true;
    $('skip').hidden = false;
    await loadPreviews(round);
    const cards = [...$('options').querySelectorAll('.opt')];
    for (const card of cards) {
      if (token !== intro.token) return;
      showCard(card);
      // no celular os cards ficam em coluna: acompanha a música que acabou de entrar
      if (card.getBoundingClientRect().bottom > window.innerHeight) card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      const id = card.dataset.id;
      const playing = player.soundOn && await playSong(id, true);
      if (token !== intro.token) return;
      await wait(playing ? SNIPPET_MS : NO_AUDIO_MS);
      if (token !== intro.token) return;
      if (playing) await stopAudio(true);
    }
    if (token === intro.token) endIntro();
  }

  function showCard(card) {
    card.classList.remove('pending');
    card.querySelector('.opt-pick').disabled = false;
  }

  // Encerra a apresentação: mostra o que faltava e para o trecho automático.
  function endIntro(keepAudio) {
    intro.token++;
    if (intro.wake) intro.wake();
    if (intro.running && !keepAudio) stopAudio(true);
    intro.running = false;
    $('skip').hidden = true;
    $('options').querySelectorAll('.opt.pending').forEach(showCard);
  }

  function togglePlay(song) {
    if (intro.running) endIntro(true);
    if (player.id === song.id && !audio.paused) { stopAudio(false); return; }
    playSong(song.id, false).then((ok) => { if (!ok) setNote('Não deu para tocar o trecho dessa música.', true); });
  }

  function renderSoundToggle() {
    const b = $('sound');
    b.textContent = player.soundOn ? 'Som ligado' : 'Som desligado';
    b.setAttribute('aria-pressed', String(player.soundOn));
  }
  $('sound').addEventListener('click', () => {
    player.soundOn = !player.soundOn;
    save('salvauma:sound', player.soundOn);
    renderSoundToggle();
    if (!player.soundOn) stopAudio(true);
  });
  $('skip').addEventListener('click', () => endIntro());
  renderSoundToggle();

  function renderRound() {
    const round = state.rounds[state.index];
    const total = state.rounds.length;
    $('progress').textContent = 'Ano ' + (state.index + 1) + ' de ' + total;
    $('progress-fill').style.width = (state.index / total * 100) + '%';
    $('year').textContent = round.year;
    $('round-cat').textContent = state.cat.name;
    $('round-q').textContent = 'Qual você salva?';
    const prev = myPicks[round.id] && SONG_BY_ID[myPicks[round.id]];
    setNote(prev ? 'Da última vez você salvou "' + prev.title + '". Se votar de novo, o voto novo substitui o antigo.' : '');
    $('next').hidden = true;

    endIntro();
    stopAudio(false);
    const box = $('options');
    box.replaceChildren();
    round.options.forEach((song) => {
      const pickBtn = el('button', { type: 'button', class: 'opt-pick', 'aria-label': 'Salvar ' + song.title + ', de ' + song.artist, disabled: '' });
      pickBtn.addEventListener('click', () => pick(round, song));
      const playBtn = el('button', { type: 'button', class: 'play', 'data-state': 'play', 'data-title': song.title, 'aria-label': 'Tocar ' + song.title });
      playBtn.addEventListener('click', () => togglePlay(song));
      const card = el('div', { class: 'opt pending', 'data-id': song.id }, [
        el('span', { class: 'fill' }),
        pickBtn,
        el('div', { class: 'opt-media' }, [cover(song, 'opt-cover', 250), playBtn, el('span', { class: 'playbar' }, [el('span')])]),
        el('div', { class: 'opt-body' }, [
          el('div', { class: 'opt-tags' }, [originPill(song.origin), el('span', { class: 'opt-genre', text: GENRES[song.genre] })]),
          el('div', { class: 'opt-title', text: song.title }),
          el('div', { class: 'opt-artist', text: song.artist }),
          el('div', { class: 'opt-bottom' }, [ytLink(song), el('span', { class: 'pct' })])
        ])
      ]);
      box.append(card);
    });
    runIntro(round);
    const nextRound = state.rounds[state.index + 1];
    preloadCovers(nextRound);
    if (nextRound) loadPreviews(nextRound);
  }

  function setNote(text, isError) {
    const n = $('round-note');
    n.textContent = text;
    n.classList.toggle('error', !!isError);
  }

  async function pick(round, song) {
    endIntro(!intro.running); // se o trecho automático estava tocando, para; se a pessoa deu play, continua
    const cards = [...$('options').querySelectorAll('.opt')];
    cards.forEach((c) => { c.classList.add('done'); c.querySelector('.opt-pick').disabled = true; });
    $('round-q').textContent = 'Você salvou ' + song.title + '.';
    setNote('Contando os votos…');

    const previous = myPicks[round.id];
    myPicks[round.id] = song.id;
    save('salvauma:picks', myPicks);

    let counts = Object.assign({}, state.results[round.id] || {});
    try {
      const res = await api('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterId, roundId: round.id, songId: song.id })
      });
      counts = res.counts;
      state.results[round.id] = counts;
      setNote('');
    } catch (e) {
      // sem servidor: mostra o que já sabemos e conta o voto só localmente
      if (previous && counts[previous]) counts[previous]--;
      counts[song.id] = (counts[song.id] || 0) + 1;
      setNote(e.message + ' Seu voto não foi registrado.', true);
    }
    reveal(round, song, counts);
  }

  function reveal(round, song, counts) {
    const total = round.options.reduce((acc, s) => acc + (counts[s.id] || 0), 0) || 1;
    const max = Math.max(...round.options.map((s) => counts[s.id] || 0));
    let topSong = null;
    [...$('options').querySelectorAll('.opt')].forEach((card) => {
      const id = card.dataset.id;
      const n = counts[id] || 0;
      const pct = Math.round(n / total * 100);
      card.classList.toggle('saved', id === song.id);
      card.classList.toggle('gone', id !== song.id);
      const tags = card.querySelector('.opt-tags');
      if (id === song.id) tags.append(el('span', { class: 'badge badge-saved', text: 'Você salvou' }));
      if (n === max && n > 0 && !topSong) { topSong = id; tags.append(el('span', { class: 'badge badge-top', text: 'Mais salva' })); }
      const pctEl = card.querySelector('.pct');
      pctEl.replaceChildren(document.createTextNode(pct + '%'), el('small', { text: n + (n === 1 ? ' voto' : ' votos') }));
      requestAnimationFrame(() => { card.querySelector('.fill').style.width = pct + '%'; });
    });

    state.picks.push({ round, song, matched: topSong === song.id, pct: Math.round((counts[song.id] || 0) / total * 100) });
    const last = state.index === state.rounds.length - 1;
    const next = $('next');
    next.textContent = last ? 'Ver minha lista →' : 'Próximo ano →';
    next.hidden = false;
    next.focus({ preventScroll: true });
  }

  $('next').addEventListener('click', () => {
    if (state.index < state.rounds.length - 1) { state.index++; renderRound(); window.scrollTo(0, 0); }
    else renderSummary();
  });

  // ---------- resumo ----------
  function renderSummary() {
    const picks = state.picks;
    const matched = picks.filter((p) => p.matched).length;
    $('sum-cat').textContent = TYPE_LABEL[state.cat.type] + ' · ' + state.cat.name;
    $('sum-title').textContent = picks.length + (picks.length === 1 ? ' música salva' : ' músicas salvas');
    const pctMatch = picks.length ? Math.round(matched / picks.length * 100) : 0;
    $('sum-lede').textContent = 'Você concordou com a maioria em ' + matched + ' de ' + picks.length + ' anos (' + pctMatch + '%).';
    const list = $('sum-list');
    list.replaceChildren();
    picks.forEach((p) => list.append(el('li', {}, [
      el('span', { class: 'sum-year', text: String(p.round.year) }),
      cover(p.song, 'cover-sm', 56),
      el('span', { class: 'sum-song' }, [document.createTextNode(p.song.title), el('small', { text: p.song.artist })]),
      el('span', { class: 'sum-tag' + (p.matched ? ' match' : ''), text: p.matched ? 'com a maioria · ' + p.pct + '%' : p.pct + '% salvaram' })
    ])));
    $('share-fallback').hidden = true;
    $('share').textContent = 'Copiar minha lista';
    show('summary');
  }

  $('share').addEventListener('click', async () => {
    const lines = ['Salva Uma: ' + state.cat.name, ''];
    state.picks.forEach((p) => lines.push(p.round.year + ': ' + p.song.title + ' (' + p.song.artist + ')'));
    lines.push('', 'Concordei com a maioria em ' + state.picks.filter((p) => p.matched).length + ' de ' + state.picks.length + ' anos.');
    lines.push(location.origin);
    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      $('share').textContent = 'Copiado';
    } catch {
      const ta = $('share-fallback');
      ta.value = text;
      ta.hidden = false;
      ta.select();
      $('share').textContent = 'Copie o texto abaixo';
    }
  });

  renderCategories();
  show('home');
})();
