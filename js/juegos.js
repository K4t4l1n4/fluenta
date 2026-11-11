'use strict';
/* Fluenta · Juegos de repaso: pareo, ahorcado, letras desordenadas y contra reloj.
   Usan tus tarjetas y las palabras de las lecciones que ya hiciste. Son actividades "A" (ver aprender.js). */

const GAMES = {
  match: ['🧩', 'Pareo', 'Une cada palabra con su significado'],
  hang: ['🪢', 'Ahorcado', 'Adivina la palabra letra por letra'],
  scr: ['🔀', 'Letras desordenadas', 'Ordena las letras para formar la palabra'],
  rush: ['⏱️', 'Contra reloj', '60 segundos: ¿cuántas palabras sabes?']
};
const RUSH_MS = 60000, HANG_LIVES = 6;
/* Palabras para jugar: tus tarjetas y las de las lecciones hechas (si son pocas, se completan con las primeras lecciones) */
function gamePool() {
  const m = new Map(), add = ([en, es]) => { const k = en.toLowerCase(); if (!m.has(k) && en.length <= 22 && es.length <= 30) m.set(k, [en, es]); };
  Object.values(S.cards).forEach(c => add([c.en, c.es]));
  allLessons().filter(l => S.done[l.id]).forEach(l => l.words.forEach(add));
  if (m.size < 16) allLessons().slice(0, 3).forEach(l => l.words.forEach(add));
  return [...m.values()];
}
const singleWords = (min, max) => gamePool().filter(([en]) => new RegExp(`^[a-z]{${min},${max}}$`, 'i').test(en));
const gameBest = g => (X().games[g] || {}).best;
function startGame(g) {
  let a = null;
  if (g === 'match') {
    const ps = uniqBy(shuffle(gamePool()), p => p[1].toLowerCase()).slice(0, 6);
    a = { kind: 'match', tiles: shuffle(ps.flatMap(([en, es], k) => [{ k, en: true, text: en }, { k, en: false, text: es }])), sel: null, bad: null, done: {}, miss: 0, t0: Date.now() };
  } else if (g === 'hang') {
    a = { kind: 'hang', words: shuffle(singleWords(4, 10)).slice(0, 5), wi: 0, hit: {}, lives: HANG_LIVES, won: 0, state: 'play' };
  } else if (g === 'scr') {
    a = { kind: 'scr', words: shuffle(singleWords(4, 9)).slice(0, 6), wi: 0, letters: [], built: [], won: 0, state: 'play' };
    scrLetters(a);
  } else if (g === 'rush') {
    a = { kind: 'rush', pool: uniqBy(gamePool(), p => p[1].toLowerCase()), end: Date.now() + RUSH_MS, score: 0, miss: 0, cur: null, flash: '' };
    rushNext(a);
  }
  if (!a) return;
  if (a.words && a.words.length < 2) { toast('Aún no hay suficientes palabras para este juego. Completa una lección primero.'); return; }
  startA(a);
  if (g === 'rush') A.tick = setInterval(rushTick, 250);
}
/* Fin de un juego: guarda tu mejor resultado (better = función que dice si el nuevo es mejor) */
function finishGame(g, { emoji, stats, note, xp, score, better }) {
  if (A && A.tick) clearInterval(A.tick);
  const rec = X().games[g] || (X().games[g] = { plays: 0 }), isBest = rec.best == null || better(score, rec.best);
  rec.plays++; if (isBest) rec.best = score;
  save(); addXp(xp);
  A = null;
  view().innerHTML = summaryHTML({ emoji, title: isBest && rec.plays > 1 ? '¡Nuevo récord! 🏅' : '¡Juego terminado!', back: tab, stats: [[`+${xp}`, 'XP'], ...stats], note })
    + `<button class="btn ghost wide" data-act="game" data-g="${g}">🔁 Jugar otra vez</button>`;
  window.scrollTo(0, 0); celebrate();
}

/* ===== Pareo ===== */
A_VIEWS.match = () => aTop('🧩 Pareo', pct(Object.keys(A.done).length, A.tiles.length)) + `<div class="ex"><p class="ex-prompt">Une cada palabra con su significado</p>
    <div class="tiles">${A.tiles.map((t, i) => `<button class="tile-btn ${t.en ? 'en' : ''} ${A.done[i] ? 'ok' : A.sel === i ? 'sel' : A.bad && A.bad.includes(i) ? 'bad' : ''}" data-act="gtile" data-i="${i}" ${A.done[i] ? 'disabled' : ''}>${esc(t.text)}</button>`).join('')}</div>
    <p class="muted center small">${A.miss ? `${A.miss} ${A.miss === 1 ? 'error' : 'errores'}` : 'Toca una palabra y después su pareja. Las de color son en inglés.'}</p></div>`;
function matchTap(i) {
  if (!A || A.kind !== 'match' || A.done[i]) return;
  A.bad = null;
  if (A.sel == null || A.sel === i) { A.sel = A.sel === i ? null : i; renderA(); return; }
  const a = A.tiles[A.sel], b = A.tiles[i];
  if (a.en === b.en) { A.sel = i; renderA(); return; }   /* dos del mismo idioma: solo cambia la elegida */
  if (a.k === b.k) {
    A.done[A.sel] = A.done[i] = true; A.sel = null; trackType('game', true); sfx('ok');
    if (Object.keys(A.done).length === A.tiles.length) {
      const secs = Math.round((Date.now() - A.t0) / 1000), miss = A.miss;
      finishGame('match', { emoji: '🧩', stats: [[`${secs} s`, 'Tiempo'], [miss, 'Errores']], xp: 6, score: secs + miss * 5, better: (n, o) => n < o, note: miss ? '' : '¡Sin ningún error! 🌟' });
      return;
    }
  } else { A.bad = [A.sel, i]; A.sel = null; A.miss++; trackType('game', false); sfx('bad'); }
  renderA();
}

/* ===== Ahorcado ===== */
A_VIEWS.hang = () => {
  const [en, es] = A.words[A.wi], w = en.toLowerCase(), over = A.state !== 'play';
  return aTop('🪢 Ahorcado', pct(A.wi, A.words.length)) + `<div class="ex"><p class="ex-prompt">¿Cómo se dice en inglés?</p>
    <div class="ex-big es">${esc(es)}</div>
    <div class="hang-word ${A.state}">${[...w].map(c => `<span>${over || A.hit[c] ? c : ''}</span>`).join('')}</div>
    <p class="center hang-lives" aria-label="${A.lives} vidas">${'❤️'.repeat(A.lives)}${'🤍'.repeat(HANG_LIVES - A.lives)}</p>
    ${over ? `<div class="card center"><b>${A.state === 'won' ? '¡La adivinaste! 🎉' : 'Esta vez no 😅'}</b><p><b>${tapText(en)}</b> = ${esc(es)} ${sayBtn(en, 'sm')}</p></div>`
      : `<div class="kbd">${[...'abcdefghijklmnopqrstuvwxyz'].map(k => `<button class="key ${A.hit[k] || ''}" data-act="gkey" data-k="${k}" ${A.hit[k] ? 'disabled' : ''}>${k}</button>`).join('')}</div>`}</div>
    ${over ? `<footer class="ex-foot ${A.state === 'won' ? 'ok' : 'bad'}"><button class="btn primary wide" data-act="gnext">${A.wi + 1 < A.words.length ? 'Siguiente palabra' : 'Ver resultado'}</button></footer>` : ''}`;
};
function hangKey(k) {
  if (!A || A.kind !== 'hang' || A.state !== 'play' || A.hit[k]) return;
  const w = A.words[A.wi][0].toLowerCase(), ok = w.includes(k);
  A.hit[k] = ok ? 'ok' : 'bad';
  if (!ok) { A.lives--; sfx('bad'); }
  if ([...w].every(c => A.hit[c] === 'ok')) { A.state = 'won'; A.won++; trackType('game', true); save(); speak(w); }
  else if (A.lives <= 0) { A.state = 'lost'; trackType('game', false); save(); }
  renderA();
}

/* ===== Letras desordenadas ===== */
function scrLetters(a) {
  const w = a.words[a.wi][0].toLowerCase();
  let ls = shuffle([...w]);
  for (let k = 0; k < 6 && ls.join('') === w; k++) ls = shuffle([...w]);
  a.letters = ls; a.built = [];
}
A_VIEWS.scr = () => {
  const [en, es] = A.words[A.wi], over = A.state !== 'play', used = new Set(A.built);
  return aTop('🔀 Letras desordenadas', pct(A.wi, A.words.length)) + `<div class="ex"><p class="ex-prompt">Ordena las letras</p>
    <div class="ex-big es">${esc(es)}</div>
    ${over ? `<div class="card center"><b>${A.state === 'won' ? '¡Correcto! 🎉' : 'La palabra era:'}</b><p><b class="scr-word">${tapText(en)}</b> ${sayBtn(en, 'sm')}</p></div>`
      : `<div class="answer-line scr-line">${A.built.map((li, k) => `<button class="chip letter" data-act="gunletter" data-k="${k}">${esc(A.letters[li])}</button>`).join('') || '<span class="muted small">Toca las letras en orden</span>'}</div>
        <div class="bank">${A.letters.map((c, i) => `<button class="chip letter ${used.has(i) ? 'used' : ''}" data-act="gletter" data-i="${i}" ${used.has(i) ? 'disabled' : ''}>${esc(c)}</button>`).join('')}</div>
        <button class="link" data-act="gskip">No la sé: mostrar la palabra</button>`}</div>
    ${over ? `<footer class="ex-foot ${A.state === 'won' ? 'ok' : 'bad'}"><button class="btn primary wide" data-act="gnext">${A.wi + 1 < A.words.length ? 'Siguiente palabra' : 'Ver resultado'}</button></footer>` : ''}`;
};
function scrTap(i) {
  if (!A || A.kind !== 'scr' || A.state !== 'play' || A.built.includes(i)) return;
  A.built.push(i);
  const w = A.words[A.wi][0].toLowerCase();
  if (A.built.length === A.letters.length) {
    if (A.built.map(k => A.letters[k]).join('') === w) { A.state = 'won'; A.won++; trackType('game', true); save(); renderA(); speak(w); return; }
    A.built = []; trackType('game', false); sfx('bad'); renderA(); animate($('.scr-line'), 'anim-bad'); return;
  }
  renderA();
}
/* Siguiente palabra del ahorcado o de las letras */
function gameNextWord() {
  if (!A || (A.kind !== 'hang' && A.kind !== 'scr')) return;
  A.wi++;
  if (A.wi >= A.words.length) {
    const n = A.words.length, won = A.won, g = A.kind;
    finishGame(g, { emoji: won === n ? '🏆' : GAMES[g][0], stats: [[`${won}/${n}`, 'Palabras'], [`${pct(won, n)}%`, 'Aciertos']], xp: 2 + won * 2, score: won, better: (a, b) => a > b, note: won === n ? '¡Todas correctas! 🌟' : '' });
    return;
  }
  A.state = 'play'; A.hit = {}; A.lives = HANG_LIVES;
  if (A.kind === 'scr') scrLetters(A);
  window.scrollTo(0, 0); renderA();
}

/* ===== Contra reloj ===== */
function rushNext(a) {
  let w = pick(a.pool);
  for (let k = 0; k < 5 && a.cur && w[0] === a.cur.en; k++) w = pick(a.pool);
  a.cur = { en: w[0], ans: w[1], opts: shuffle([w[1], ...shuffle(a.pool.filter(x => x[1] !== w[1])).slice(0, 2).map(x => x[1])]) };
}
const rushLeft = () => Math.max(0, A.end - Date.now());
A_VIEWS.rush = () => aTop('⏱️ Contra reloj') + `<div class="ex"><div class="row between"><b id="rushTime">${Math.ceil(rushLeft() / 1000)} s</b><span class="pill">⭐ ${A.score}</span></div>
    <div class="bar"><i id="rushBar" style="width:${pct(rushLeft(), RUSH_MS)}%;transition:none"></i></div>
    <p class="ex-prompt">¿Qué significa?</p><div class="ex-big rush-word ${A.flash}">${esc(A.cur.en)}</div>
    <div class="options">${A.cur.opts.map((o, i) => `<button class="opt" data-act="grush" data-i="${i}">${esc(o)}</button>`).join('')}</div></div>`;
function rushEnd() {
  const score = A.score, miss = A.miss;
  finishGame('rush', { emoji: score >= 20 ? '🏆' : '⏱️', stats: [[score, 'Aciertos'], [miss, 'Errores']], xp: Math.min(15, 2 + Math.floor(score / 2)), score, better: (a, b) => a > b, note: '' });
}
function rushTick() {
  if (!A || A.kind !== 'rush') return;
  if (rushLeft() <= 0) { rushEnd(); return; }
  const b = $('#rushBar'), t = $('#rushTime');
  if (b) b.style.width = pct(rushLeft(), RUSH_MS) + '%';
  if (t) t.textContent = Math.ceil(rushLeft() / 1000) + ' s';
}
function rushTap(i) {
  if (!A || A.kind !== 'rush') return;
  if (rushLeft() <= 0) { rushEnd(); return; }
  const ok = A.cur.opts[i] === A.cur.ans;
  if (ok) A.score++; else A.miss++;
  A.flash = ok ? 'ok' : 'bad'; trackType('game', ok); sfx(ok ? 'ok' : 'bad');
  rushNext(A); renderA();
}

/* ===== Sección Juegos de Repaso ===== */
function gamesCat() {
  const best = { match: v => `Tu récord: ${v} puntos (menos es mejor)`, hang: v => `Tu récord: ${v} de 5`, scr: v => `Tu récord: ${v} de 6`, rush: v => `Tu récord: ${v} aciertos` };
  const n = gamePool().length;
  return catHTML('review', 'games', '🎮', 'Juegos', `Repasa jugando con ${n} palabras tuyas`, null, () =>
    '<p class="muted small">Los juegos usan tus tarjetas y las palabras de las lecciones que ya hiciste.</p><div class="path">'
    + Object.entries(GAMES).map(([g, [icon, title, sub]]) => goRow(`data-act="game" data-g="${g}"`, icon, title, gameBest(g) != null ? best[g](gameBest(g)) : sub)).join('') + '</div>');
}
const GAME_ACTIONS = {
  game: el => startGame(el.dataset.g),
  gtile: el => matchTap(+el.dataset.i),
  gkey: el => hangKey(el.dataset.k),
  gletter: el => scrTap(+el.dataset.i),
  gunletter: el => { if (!A || A.kind !== 'scr' || A.state !== 'play') return; A.built.splice(+el.dataset.k, 1); renderA(); },
  gskip: () => { if (!A || A.kind !== 'scr' || A.state !== 'play') return; A.state = 'lost'; trackType('game', false); save(); renderA(); },
  gnext: () => gameNextWord(),
  grush: el => rushTap(+el.dataset.i)
};
