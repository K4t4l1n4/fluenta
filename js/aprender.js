'use strict';
/* Fluenta · Lecturas, Escuchar, vocabulario práctico, pares de sonidos y prueba de nivel (el contenido está en extra.js y vocab.js). */

/* ===== Lo que se guarda de estas actividades: S.extra ===== */
function X() {
  const x = S.extra || (S.extra = {});
  ['read', 'listen', 'pairs', 'games', 'diplomas'].forEach(k => { if (!x[k]) x[k] = {}; });
  return x;
}
const starsHTML = n => `<span class="stars">${'★'.repeat(n)}${'☆'.repeat(3 - n)}</span>`;
const starsFor = (right, total) => { const p = pct(right, total); return p >= 90 ? 3 : p >= 60 ? 2 : 1; };

/* ===== Actividad en pantalla (A): lecturas, historias, pares, prueba de nivel y juegos =====
   Igual que las lecciones: ocupa toda la pantalla y la ✕ vuelve a donde estabas. */
let A = null;
const A_VIEWS = {};
function startA(a) { A = a; document.body.classList.add('focus'); window.scrollTo(0, 0); renderA(); }
function renderA() { if (A) view().innerHTML = A_VIEWS[A.kind](); }
const aTop = (title, p) => `<div class="lesson-top"><button class="icon-btn" data-act="quit" aria-label="Salir">${ic('x')}</button><div class="grow"><b>${title}</b>${p != null ? `<div class="bar"><i style="width:${p}%"></i></div>` : ''}</div>${dictBtn('sm')}</div>`;

/* ===== Preguntas de opción múltiple (lecturas, historias y prueba de nivel) ===== */
const mkQuiz = qs => ({ list: qs.map(([q, opts]) => ({ q, ans: opts[0], opts: shuffle(opts) })), i: 0, sel: null, answered: false, right: 0 });
function quizBody(Q, tap) {
  const x = Q.list[Q.i];
  const cls = i => Q.answered ? (x.opts[i] === x.ans ? 'right' : Q.sel === i ? 'wrong' : '') : Q.sel === i ? 'sel' : '';
  return `<p class="ex-prompt">${tap ? tapText(x.q) : esc(x.q)}</p><div class="options">${x.opts.map((o, i) => `<button class="opt ${cls(i)}" data-act="aopt" data-i="${i}">${esc(o)}</button>`).join('')}</div>`;
}
function quizFoot(Q, blind) {
  const x = Q.list[Q.i], ok = Q.answered && x.opts[Q.sel] === x.ans;
  return `<footer class="ex-foot ${Q.answered ? (ok ? 'ok' : 'bad') : ''}">${Q.answered ? `<div class="fb-title">${ok ? '¡Correcto! 🎉' : 'Casi… 😅'}</div>${ok ? '' : `<div class="fb-body">Respuesta correcta: <b>${esc(x.ans)}</b></div>`}` : ''}
    <button class="btn primary wide" data-act="acheck" ${Q.sel == null ? 'disabled' : ''}>${Q.answered || blind ? 'Continuar' : 'Comprobar'}</button></footer>`;
}
/* Resumen de una lectura o historia: estrellas según las respuestas */
function finishQuizA(store, emoji, title, extra = '') {
  const Q = A.Q, n = Q.list.length, st = starsFor(Q.right, n), xp = 5 + Q.right * 3, id = A.r.id;
  X()[store][id] = Math.max(X()[store][id] || 0, st);
  save(); addXp(xp);
  A = null;
  view().innerHTML = summaryHTML({ emoji, title, back: tab, stats: [[`+${xp}`, 'XP'], [`${Q.right}/${n}`, 'Respuestas'], ['★'.repeat(st) + '☆'.repeat(3 - st), 'Estrellas']], note: Q.right === n ? '¡Todas correctas! 🌟' : '' }) + extra;
  window.scrollTo(0, 0); celebrate();
}

/* ===== LECTURAS ===== */
const readingTextHTML = (r, showEs) => r.paras.map(([en, es], i) => `<div class="card rd-para"><div class="row gap-s">${sayBtn(en, 'sm')}<button class="round-btn sm" data-act="say" data-t="${esc(en)}" data-slow="1" aria-label="Lento">🐢</button><span class="grow"></span>${showEs ? `<button class="add-btn" data-act="aes" data-i="${i}">${showEs[i] ? 'Ocultar' : 'Traducción'}</button>` : ''}</div>
  <p class="rd-en">${tapText(en)}</p>${showEs && showEs[i] ? `<p class="rd-es">${esc(es)}</p>` : ''}</div>`).join('');
function startReading(id) {
  const r = READINGS.find(x => x.id === id); if (!r) return;
  startA({ kind: 'read', r, step: 'text', showEs: {}, Q: mkQuiz(r.qs), track: 'read', done: () => finishQuizA('read', '📖', '¡Lectura completada!') });
}
A_VIEWS.read = () => {
  const r = A.r, title = `${r.icon} ${esc(r.title)}`;
  if (A.step === 'text') return aTop(title) + `<div class="ex"><p class="muted small"><span class="badge">${r.level}</span> ${esc(r.es)} · Toca cualquier palabra para ver qué significa.</p>
      ${readingTextHTML(r, A.showEs)}
      <p class="label left">Palabras clave</p><div class="word-chips left">${r.words.map(([en, es]) => `<button class="word-chip" data-act="say" data-t="${esc(en)}"><b>${esc(en)}</b><small>${esc(es)}</small></button>`).join('')}</div></div>
    <footer class="ex-foot"><button class="btn primary wide" data-act="aquiz">Responder ${r.qs.length} preguntas</button></footer>`;
  return aTop(title, pct(A.Q.i, A.Q.list.length)) + `<div class="ex">${quizBody(A.Q, true)}<button class="link" data-act="atext">📖 Volver a ver el texto</button></div>` + quizFoot(A.Q);
};

/* ===== ESCUCHAR: primero se escucha sin leer; el texto aparece al final ===== */
function startListening(id) {
  const r = LISTENINGS.find(x => x.id === id); if (!r) return;
  startA({ kind: 'listen', r, step: 'play', plays: 0, Q: mkQuiz(r.qs), track: 'listenq', done: () => finishQuizA('listen', '🎧', '¡Historia completada!',
    `<section class="card"><h2>📜 La historia</h2>${r.lines.map(([en, es]) => `<div class="word-row">${sayBtn(en, 'sm')}<div class="grow"><span>${tapText(en)}</span><span class="muted small block">${esc(es)}</span></div></div>`).join('')}</section>
     <button class="btn ghost wide" data-act="tab" data-tab="${tab}">Continuar</button>`) });
}
const playBtns = () => `<div class="listen-wrap"><button class="speaker-big" data-act="aplay" aria-label="Escuchar la historia">${ic('volume')}</button><button class="round-btn" data-act="aplay" data-slow="1" aria-label="Lento">🐢</button></div>`;
A_VIEWS.listen = () => {
  const r = A.r, title = `${r.icon} ${esc(r.title)}`;
  if (A.step === 'play') return aTop(title) + `<div class="ex"><p class="ex-prompt">Escucha la historia</p>
      <p class="muted"><span class="badge">${r.level}</span> ${esc(r.es)}. Escúchala las veces que quieras, sin leer. Después respondes ${r.qs.length} preguntas y al final ves el texto.</p>
      ${playBtns()}
      <p class="muted center small">${A.plays ? `La escuchaste ${A.plays} ${A.plays === 1 ? 'vez' : 'veces'}. Con 🐢 va más lento.` : 'Toca el parlante para empezar.'}</p>
      <button class="link" data-act="astop">⏹ Detener</button></div>
    <footer class="ex-foot"><button class="btn primary wide" data-act="aquiz">Responder ${r.qs.length} preguntas</button></footer>`;
  return aTop(title, pct(A.Q.i, A.Q.list.length)) + `<div class="ex">${quizBody(A.Q, false)}<button class="link" data-act="aplay">🔊 Escuchar la historia otra vez</button></div>` + quizFoot(A.Q);
};

/* ===== VOCABULARIO PRÁCTICO: falsos amigos, phrasal verbs y expresiones. Cada grupo se practica como una lección ===== */
let vocabSeg = 'ff';
const vocabSets = () => Object.values(VOCAB).flatMap(g => g.sets);
function extraLesson(id) {
  const s = vocabSets().find(x => x.id === id);
  return s ? { id: s.id, title: s.title, icon: s.icon, tip: s.tip, words: s.items.map(i => [i[0], i[1]]), sentences: s.sentences } : null;
}
function renderVocab() {
  const g = VOCAB[vocabSeg] || VOCAB.ff;
  const item = i => vocabSeg === 'ff'
    ? `<div class="word-row">${sayBtn(i[0], 'sm')}<div class="grow"><b>${esc(i[0])}</b> = ${esc(i[1])}<span class="muted small block">✗ No es «${esc(i[2])}»: eso se dice <b>${esc(i[3])}</b></span></div></div>`
    : `<div class="word-row">${sayBtn(i[0], 'sm')}<div class="grow"><b>${tapText(i[0])}</b><span class="muted small block">${esc(i[1])}</span></div></div>`;
  return topBar('🧩 Vocabulario', closeBtn()) + `
    <div class="seg">${Object.entries(VOCAB).map(([k, v]) => `<button class="${vocabSeg === k ? 'on' : ''}" data-act="vocab" data-seg="${k}">${v.icon} ${esc(v.title)}</button>`).join('')}</div>
    <p class="muted small">${esc(g.intro)}</p>
    ${g.sets.map(s => `<section class="card"><div class="row between"><h2>${s.icon} ${esc(s.title)}</h2>${S.done[s.id] ? starsHTML(S.done[s.id]) : ''}</div>
      ${s.items.map(item).join('')}
      <span class="label tz-label">Ejemplos</span>${s.sentences.map(([en, es]) => `<div class="wd-ex">${sayBtn(en, 'sm')}<div class="grow"><div>${tapText(en)}</div><div class="muted small">${esc(es)}</div></div></div>`).join('')}
      <button class="btn primary wide" data-act="lesson" data-id="${s.id}">🎯 Practicar · 20 ejercicios</button></section>`).join('')}`;
}

/* ===== PARES DE SONIDOS: escuchas una palabra y eliges cuál de las dos fue ===== */
const pairWord = () => A.list[A.i].p[A.list[A.i].say];
function startPairs(id) {
  const g = MIN_PAIRS.find(x => x.id === id); if (!g) return;
  startA({ kind: 'pairs', g, list: shuffle(g.pairs).slice(0, 8).map(p => ({ p, say: Math.random() < 0.5 ? 0 : 2 })), i: 0, sel: null, ok: false, right: 0 });
  speak(pairWord());
}
A_VIEWS.pairs = () => {
  const { p, say } = A.list[A.i], word = p[say], done = A.sel != null;
  const opt = k => `<button class="opt pair-opt ${done ? (k === say ? 'right' : A.sel === k ? 'wrong' : '') : ''}" data-act="apair" data-k="${k}"><b>${esc(p[k])}</b>${done ? `<span class="muted small block">${esc(p[k + 1])}</span>` : ''}</button>`;
  return aTop(`${A.g.icon} ${esc(A.g.title)}`, pct(A.i, A.list.length)) + `<div class="ex"><p class="ex-prompt">¿Cuál escuchaste?</p>
      <div class="listen-wrap"><button class="speaker-big" data-act="say" data-t="${esc(word)}" aria-label="Escuchar">${ic('volume')}</button><button class="round-btn" data-act="say" data-t="${esc(word)}" data-slow="1" aria-label="Lento">🐢</button></div>
      <div class="pair-opts">${opt(0)}${opt(2)}</div>
      ${done ? `<div class="card pair-cmp"><span class="label">Compara los dos sonidos</span><div class="row gap">${[0, 2].map(k => `<button class="btn ghost grow" data-act="say" data-t="${esc(p[k])}">🔊 ${esc(p[k])}</button>`).join('')}</div><p class="small">💡 ${esc(A.g.tip)}</p></div>`
        : '<p class="muted center small">Escucha con atención y elige la palabra.</p>'}</div>
    ${done ? `<footer class="ex-foot ${A.ok ? 'ok' : 'bad'}"><div class="fb-title">${A.ok ? '¡Correcto! 🎉' : `Era «${esc(word)}» 😅`}</div><button class="btn primary wide" data-act="anext">${A.i + 1 < A.list.length ? 'Siguiente' : 'Ver resultado'}</button></footer>` : ''}`;
};
function finishPairs() {
  const g = A.g, n = A.list.length, p = pct(A.right, n), xp = 3 + A.right;
  X().pairs[g.id] = Math.max(X().pairs[g.id] || 0, p);
  save(); addXp(xp);
  A = null;
  view().innerHTML = summaryHTML({ emoji: p >= 90 ? '🏆' : '👂', title: '¡Oído entrenado!', back: tab, stats: [[`+${xp}`, 'XP'], [`${p}%`, 'Aciertos'], [`${n}`, 'Pares']], note: `💡 ${esc(g.tip)}` })
    + `<button class="btn ghost wide" data-act="pairs" data-id="${g.id}">🔁 Otra ronda</button>`;
  celebrate();
}
const pairsRowsHTML = () => MIN_PAIRS.map(g => goRow(`data-act="pairs" data-id="${g.id}"`, g.icon, esc(g.title), X().pairs[g.id] != null ? `Tu mejor resultado: ${X().pairs[g.id]}%` : g.pairs.slice(0, 2).map(p => `${p[0]} / ${p[2]}`).join(' · '))).join('');

/* ===== PRUEBA DE NIVEL: 6 preguntas por nivel; con 4 buenas se pasa al siguiente. No muestra las respuestas ===== */
const placedIdx = () => LEVELS.indexOf((S.extra || {}).placed);
function startPlacement() { startA({ kind: 'place', step: 'intro', bi: 0, res: [], Q: null, blind: true, level: '' }); }
function placeBlockDone() {
  const passed = A.Q.right >= 4;
  A.res.push(A.Q.right);
  if (passed && A.bi + 1 < PLACEMENT.length) { A.bi++; A.Q = mkQuiz(PLACEMENT[A.bi].qs); window.scrollTo(0, 0); renderA(); return; }
  const lv = PLACEMENT[A.bi].level;
  A.level = passed ? LEVELS[Math.min(LEVELS.indexOf(lv) + 1, LEVELS.length - 1)] : lv;
  A.step = 'end'; addXp(10); window.scrollTo(0, 0); renderA(); celebrate();
}
A_VIEWS.place = () => {
  const cur = (S.extra || {}).placed;
  if (A.step === 'intro') return aTop('🧭 Prueba de nivel') + `<div class="intro"><div class="intro-icon">🧭</div><h1>Prueba de nivel</h1>
      <div class="card tip-card"><span class="label">💡 Cómo funciona</span><p>Son hasta 30 preguntas, de más fácil a más difícil (unos 5 a 10 minutos). Se detiene cuando llega a tu nivel. Al final te recomienda desde qué nivel empezar y, si quieres, abre esas lecciones sin tener que hacer las anteriores.</p>
      <p>Responde sin ayuda y sin adivinar: si no sabes una, elige cualquiera y sigue.</p></div>
      ${cur ? `<p class="muted small">Ahora empiezas desde <b>${cur}</b>. <button class="link-inline" data-act="aplaceoff">Volver a empezar desde A1</button></p>` : ''}</div>
    <footer class="ex-foot"><button class="btn primary wide" data-act="aplace">Empezar la prueba</button></footer>`;
  if (A.step === 'end') {
    const up = LEVELS.indexOf(A.level) > Math.max(0, placedIdx());
    return `<div class="summary"><div class="emoji">🧭</div><h1>Tu nivel: ${A.level}</h1>
      <div class="sum-stats">${A.res.map((n, i) => `<div class="stat"><b>${n}/6</b><small>${PLACEMENT[i].level} ${n >= 4 ? '✓' : '✗'}</small></div>`).join('')}</div>
      <p class="muted">${up ? `Puedes empezar directo en ${A.level}: se abren todas las lecciones hasta ese nivel. Las anteriores quedan disponibles por si quieres repasarlas.` : 'Te conviene seguir donde estás: el curso ya va en el orden correcto para ti.'}</p>
      ${up ? `<button class="btn primary wide" data-act="aplaceok">Empezar desde ${A.level}</button><button class="btn ghost wide" data-act="tab" data-tab="${tab}">Seguir donde estoy</button>` : `<button class="btn primary wide" data-act="tab" data-tab="${tab}">Continuar</button>`}</div>`;
  }
  const lv = PLACEMENT[A.bi].level, x = A.Q.list[A.Q.i];
  return aTop(`🧭 Prueba de nivel · ${lv}`, pct(A.bi * 6 + A.Q.i, PLACEMENT.length * 6)) + `<div class="ex"><p class="ex-prompt">Elige la opción correcta</p>
      <div class="ex-sentence">${esc(x.q)}</div><div class="options">${x.opts.map((o, i) => `<button class="opt ${A.Q.sel === i ? 'sel' : ''}" data-act="aopt" data-i="${i}">${esc(o)}</button>`).join('')}</div></div>` + quizFoot(A.Q, true);
};

/* ===== Secciones nuevas de Lecciones: Leer, Escuchar y Vocabulario práctico ===== */
const storyRow = (r, act, st) => `<button class="lesson ${st ? 'done' : ''}" data-act="${act}" data-id="${r.id}"><span class="lesson-icon">${r.icon}</span><span class="lesson-info grow"><b>${esc(r.title)}</b><span class="muted small">${esc(r.es)}</span>${st ? starsHTML(st) : ''}</span>${ic('play', 'sm accent')}</button>`;
const byLevelHTML = (list, act, done) => [...new Set(list.map(r => r.level))].map(lv => subLabel(`Nivel ${lv}`) + `<div class="path">${list.filter(r => r.level === lv).map(r => storyRow(r, act, done[r.id])).join('')}</div>`).join('');
function readCat() {
  const d = X().read, n = READINGS.filter(r => d[r.id]).length, mine = S.texts || [], read = mine.filter(x => x.read).length;
  const cur = rdList().find(x => !x.read && (x.pos || 0) > 0);   /* un cuento a medio leer */
  return catHTML('lessons', 'read', '📖', 'Leer', `Lecturas con preguntas y tus cuentos<br>${n}/${READINGS.length} lecturas${mine.length ? ` · ${mine.length} ${mine.length === 1 ? 'cuento' : 'cuentos'}` : ''}`, pct(n, READINGS.length), () =>
    subLabel('Tus cuentos') + `<div class="path">${goRow('data-act="tab" data-tab="reader"', '📚', 'Mis cuentos', mine.length ? `${mine.length} ${mine.length === 1 ? 'guardado' : 'guardados'} · ${read} ${read === 1 ? 'leído' : 'leídos'}` : 'Pega tus cuentos en inglés y léelos tocando las palabras')}${cur ? goRow(`data-act="rdpick" data-t="${cur.t}"`, '📍', 'Seguir leyendo', `${esc(rdTitleOf(cur))} · vas en ${rdPct(cur)} %`) : ''}</div>` + byLevelHTML(READINGS, 'reading', d));
}
function listenCat() {
  const d = X().listen, n = LISTENINGS.filter(r => d[r.id]).length;
  return catHTML('lessons', 'listen', '🎧', 'Escuchar', `Historias para entrenar el oído<br>${n}/${LISTENINGS.length} historias`, pct(n, LISTENINGS.length), () =>
    '<p class="muted small">Escuchas la historia sin leer, respondes las preguntas y al final ves el texto.</p>' + byLevelHTML(LISTENINGS, 'listening', d));
}
function vocabCat() {
  const sets = vocabSets(), n = sets.filter(s => S.done[s.id]).length;
  return catHTML('lessons', 'vocab', '🧩', 'Vocabulario práctico', `Falsos amigos, phrasal verbs y expresiones<br>${n}/${sets.length} grupos practicados`, pct(n, sets.length), () =>
    `<div class="path">${Object.entries(VOCAB).map(([k, g]) => goRow(`data-act="vocab" data-seg="${k}"`, g.icon, esc(g.title), `${g.sets.reduce((a, s) => a + s.items.length, 0)} en total · ${g.sets.filter(s => S.done[s.id]).length}/${g.sets.length} grupos practicados`)).join('')}</div>`);
}

/* ===== Botones de estas actividades ===== */
const AP_ACTIONS = {
  reading: el => startReading(el.dataset.id),
  listening: el => startListening(el.dataset.id),
  pairs: el => startPairs(el.dataset.id),
  placement: () => startPlacement(),
  vocab: el => { vocabSeg = el.dataset.seg || 'ff'; if (tab === 'vocab') { render(); window.scrollTo(0, 0); } else go('vocab'); },
  aes: el => { if (!A || !A.showEs) return; const i = +el.dataset.i; A.showEs[i] = !A.showEs[i]; renderA(); },
  aquiz: () => { if (!A) return; stopSpeech(); A.step = 'quiz'; window.scrollTo(0, 0); renderA(); },
  atext: () => { if (A && A.r && A.r.paras) openSheet(sheetHead(`${A.r.icon} ${esc(A.r.title)}`) + readingTextHTML(A.r, null), 'text'); },
  aplay: el => { if (!A || !A.r || !A.r.lines) return; A.plays = (A.plays || 0) + 1; speakAll(A.r.lines.map(l => l[0]), !!el.dataset.slow); if (A.step === 'play') renderA(); },
  astop: () => stopSpeech(),
  aopt: el => { const Q = A && A.Q; if (!Q || Q.answered) return; Q.sel = +el.dataset.i; renderA(); },
  acheck: () => {
    const Q = A && A.Q; if (!Q || Q.sel == null) return;
    const next = () => { Q.i++; Q.sel = null; Q.answered = false; if (Q.i >= Q.list.length) (A.blind ? placeBlockDone : A.done)(); else { window.scrollTo(0, 0); renderA(); } };
    const x = Q.list[Q.i], ok = x.opts[Q.sel] === x.ans;
    if (A.blind) { if (ok) Q.right++; next(); return; }
    if (Q.answered) { next(); return; }
    Q.answered = true; if (ok) Q.right++;
    trackType(A.track, ok); save(); sfx(ok ? 'ok' : 'bad'); renderA();
    animate($(`.opt[data-i="${Q.sel}"]`), ok ? 'anim-ok' : 'anim-bad');
  },
  apair: el => {
    if (!A || A.kind !== 'pairs' || A.sel != null) return;
    A.sel = +el.dataset.k; A.ok = A.sel === A.list[A.i].say; if (A.ok) A.right++;
    trackType('pairs', A.ok); save(); sfx(A.ok ? 'ok' : 'bad'); renderA();
  },
  anext: () => {
    if (!A || A.kind !== 'pairs') return;
    A.i++; A.sel = null;
    if (A.i >= A.list.length) { finishPairs(); return; }
    window.scrollTo(0, 0); renderA(); speak(pairWord());
  },
  aplace: () => { if (!A || A.kind !== 'place') return; A.step = 'quiz'; A.bi = 0; A.res = []; A.Q = mkQuiz(PLACEMENT[0].qs); window.scrollTo(0, 0); renderA(); },
  aplaceok: () => { if (!A || !A.level) return; const lv = A.level; X().placed = lv; save(); openCat.lessons = 'course'; courseLevel = lv; go('lessons'); toast(`🧭 Listo: empiezas desde ${lv}`); },
  aplaceoff: () => { delete X().placed; save(); renderA(); toast('Vuelves a empezar desde A1') }
};
