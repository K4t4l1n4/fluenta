'use strict';
/* Fluenta · Hablar: diálogos, pronunciación frase por frase y sesiones de pronunciación. */
/* ===== HABLAR: diálogos ramificados y pronunciación ===== */
/* Pronunciación frase por frase (los diálogos y las sesiones están en Lecciones › Hablar) */
function renderTalk() {
  return topBar('🎤 Pronunciación', closeBtn()) + pronHTML();
}
function longestPath(d) {
  const f = (id, seen) => { const n = d.nodes[id]; if (!n || n.end || seen.has(id)) return 0; seen.add(id); let m = 0; n.options.filter(o => o.go).forEach(o => { m = Math.max(m, f(o.go, seen)); }); seen.delete(id); return 1 + m; };
  return f(d.start, new Set());
}
function startDialog(id, mode) {
  const d = DIALOGS.find(x => x.id === id); if (!d) return;
  D = { d, mode, node: null, steps: 0, max: longestPath(d), log: [], opts: [], fb: null, result: null, bonus: 0, showEs: {}, wrong: 0, finished: false };
  const st = S.dlg[id] || (S.dlg[id] = { plays: 0, wrong: {} }); st.plays++; save();
  document.body.classList.add('focus'); window.scrollTo(0, 0);
  enterNode(d.start); renderDialog();
}
function enterNode(id, afterSound) {
  const n = D.d.nodes[id];
  D.node = id; D.fb = null; D.result = null;
  D.log.push({ who: 'npc', en: n.npc[0], es: n.npc[1] });
  D.opts = n.end ? [] : shuffle(n.options);
  if (n.end) D.finished = true;
  (afterSound ? speakAfter : speak)(n.npc[0]);
}
function chooseOption(o, score) {
  D.log.push({ who: 'me', en: o.en, es: o.es, score });
  D.steps++;
  enterNode(o.go, true);
  renderDialog();
  setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50);
}
function renderDialog() {
  const valid = D.opts.filter(o => o.go);
  const chat = D.log.map((m, i) => m.who === 'npc'
    ? `<div class="bubble npc"><div class="row gap-s">${sayBtn(m.en, 'sm')}<span class="grow">${tapText(m.en)}</span></div><button class="tr" data-act="tr" data-i="${i}">${D.showEs[i] ? esc(m.es) : 'Ver traducción'}</button></div>`
    : `<div class="bubble me">${tapText(m.en)}${m.score != null ? `<span class="score-tag">🎤 ${m.score}%</span>` : ''}${m.es ? `<button class="tr" data-act="tr" data-i="${i}">${D.showEs[i] ? esc(m.es) : 'Ver traducción'}</button>` : ''}</div>`).join('');
  let input;
  if (D.finished) {
    input = `<div class="end-card"><b>🎉 ¡Fin de la conversación!</b><p class="muted small">Llegaste a un final. Repite el diálogo y responde distinto para descubrir otros caminos.</p><button class="btn primary wide" data-act="dfinish">Terminar</button></div>`;
  } else if (D.mode === 'choose') {
    input = `<p class="ex-prompt small">Elige tu respuesta:</p><div class="options">${D.opts.map((o, i) => `<button class="opt" data-act="dopt" data-i="${i}">${esc(o.en)}<span class="muted small block">${esc(o.es)}</span></button>`).join('')}</div>${D.fb ? `<div class="fb bad">${esc(D.fb)}</div>` : ''}`;
  } else {
    input = `<p class="ex-prompt small">Di en voz alta <u>una</u> de estas respuestas:</p>
      <div class="stack">${valid.map(o => `<div class="say-card"><div class="row gap-s">${sayBtn(o.en, 'sm')}<b class="grow">${tapText(o.en)}</b></div><span class="muted small block">${esc(o.es)}</span></div>`).join('')}</div>
      ${micControls('', 'dialog')}<div id="micres">${D.result ? pronResultHTML(D.result) : '<p class="muted small center">Cada respuesta lleva la conversación por un camino distinto.</p>'}</div>
      ${D.result && !D.result.error && D.result.score < 60 ? '<p class="muted small center">Necesitas 60% para avanzar. ¡Tú puedes!</p>' : ''}
      <button class="link" data-act="dskip">No puedo hablar ahora (elegir al azar)</button>`;
  }
  view().innerHTML = `<div class="lesson-top"><button class="icon-btn" data-act="quit" aria-label="Salir">${ic('x')}</button><div class="grow"><b>${D.d.icon} ${esc(D.d.title)}</b><div class="bar"><i style="width:${D.finished ? 100 : Math.min(95, pct(D.steps, D.max))}%"></i></div></div>${dictBtn('sm')}</div>
    ${D.log.length === 1 ? '<p class="muted small center">💡 Toca cualquier palabra en inglés para ver qué significa.</p>' : ''}<div class="chat">${chat}</div><div class="dlg-input">${input}</div>`;
}
function finishDialog() {
  const id = D.d.id, firstEnd = !(S.ends[id] || []).includes(D.node);
  const xp = 15 + D.bonus + (firstEnd ? 5 : 0);
  S.dialogs[id] = true;
  S.ends[id] = [...new Set([...(S.ends[id] || []), D.node])];
  if (!D.wrong && S.dlg[id]) S.dlg[id].wrong = {};   /* sin errores esta vez: el diálogo sale del Repaso */
  save(); addXp(xp);
  const total = dialogEnds(D.d).length, found = S.ends[id].length;
  view().innerHTML = summaryHTML({ emoji: '💬', title: '¡Conversación completada!', back: tab,
    stats: [[`+${xp}`, 'XP'], [D.wrong, 'Errores'], [`${found}/${total}`, 'Finales']],
    note: firstEnd ? (found < total ? '¡Descubriste un final nuevo! Aún quedan caminos por explorar 🧭' : '¡Descubriste todos los finales de este diálogo! 🏅') : (D.mode === 'choose' ? 'Desafío: repítelo en modo 🎤 Hablar para ganar XP extra.' : '') });
  D = null;
  celebrate();
}
function onDialogMic(r) {
  if (!D || D.finished) return;
  if (!r.error) trackPron(r);
  const o = !r.error && D.opts.find(x => x.go && x.en === r.target);
  if (o && r.score >= 60) {
    trackType('dialog', true);
    D.bonus += r.score >= 90 ? 5 : 3;
    sfx(r.score >= 90 ? 'great' : 'ok');
    chooseOption(o, r.score);
  } else { if (!r.error) trackType('dialog', false); D.result = r; renderDialog(); }
}
const colorWords = r => r.words.map(w => `<span class="tw ${w.pct != null ? (w.pct >= 85 ? 'w-ok' : w.pct >= 60 ? 'w-mid' : 'w-bad') : w.ok ? 'w-ok' : 'w-bad'}" data-act="word" data-w="${esc(w.w)}">${esc(w.w)}</span>`).join(' ');
function pronHTML() {
  const cur = pronCurrent || PRON[0].phrases[0][0], curEs = PHRASE_ES.get(cur);
  const weakN = weakPhrases(10).length, clN = Math.min(10, claudeSentences().length);
  return `<div class="card practice"><div class="speaker-wrap"><button class="speaker-big" data-act="say" data-t="${esc(cur)}" aria-label="Escuchar">${ic('volume')}</button></div>
    <div class="practice-phrase">${pronResult && !pronResult.error ? colorWords(pronResult) : tapText(cur)}</div>${curEs ? `<p class="muted center">${esc(curEs)}</p>` : ''}${micControls(cur, 'pron')}
    <div id="micres">${pronResult ? voiceResultHTML(pronResult, 'pron') : '<p class="muted center small">Escucha, luego toca el micrófono y repite. Después puedes escuchar tu voz y ver el análisis de cada palabra.</p>'}</div>
    <form class="row gap" data-form="custom" style="margin-top:14px"><input name="phrase" placeholder="Escribe tu propia frase en inglés…" autocomplete="off" autocapitalize="off"><button class="btn ghost">Usar</button></form></div>
    <p class="muted small">ℹ️ Al hablar, la app graba tu voz para que te escuches y te compares con la voz modelo. Con <b>🔍 Analizar</b> ves el % de cada palabra: verde bien, amarillo casi, rojo a practicar. Con <b>▶ Sesión</b> practicas 10 frases seguidas y al final ves tu resumen. Toca cualquier palabra de la frase para ver qué significa.</p>
    ${weakN >= 3 ? `<button class="card action-card" data-act="psession" data-g="weak"><span class="icon-bubble warm">${ic('target')}</span><span class="grow"><b>Sesión de mis errores</b><small class="muted block">${weakN} frases con las palabras que más te cuestan</small></span>${ic('play', 'sm accent')}</button>` : ''}
    ${clN ? `<button class="card action-card" data-act="psession" data-g="claude"><span class="icon-bubble">✨</span><span class="grow"><b>Mis frases de Claude</b><small class="muted block">${clN} ${clN === 1 ? 'frase corregida' : 'frases corregidas'} por Claude</small></span>${ic('play', 'sm accent')}</button>` : ''}` +
    PRON.map(c => `<div class="row between pron-head"><h3>${c.icon} ${esc(c.title)}</h3><button class="add-btn" data-act="psession" data-g="${c.id}">▶ Sesión</button></div><p class="muted small">${esc(c.tip)}</p><div class="phrase-list">${c.phrases.map(([en, es]) =>
      `<button class="phrase ${en === cur ? 'on' : ''}" data-act="pphrase" data-t="${esc(en)}"><span class="grow">${esc(en)}<small class="muted block">${esc(es)}</small></span>${S.pron[en] != null ? `<span class="score-tag">${S.pron[en]}%</span>` : ''}</button>`).join('')}</div>`).join('');
}
function onPronMic(target, r) {
  pronResult = r;
  if (!r.error) {
    trackPron(r); trackType('speak', r.score >= 70);
    S.pron[target] = Math.max(S.pron[target] || 0, r.score); save();
    const xp = r.score >= 90 ? 5 : r.score >= 70 ? 3 : 0;
    if (xp) { addXp(xp); toast(`+${xp} XP 🎤`); sfx(r.score >= 90 ? 'great' : 'ok'); }
  }
  if (tab === 'talk' && !D && !P) { render(); if (!r.error && r.score >= 70) animate($('.pron-result'), 'anim-ok'); }
}

/* ===== Sesión de pronunciación: 10 frases seguidas con resumen ===== */
const PS_TRIES = 2;
function weakPhrases(n) {
  const weak = new Set(weakSounds(20).map(([w]) => w));
  if (!weak.size) return [];
  const hits = PRON.flatMap(c => c.phrases).map(p => ({ p, n: tokens(p[0]).filter(t => weak.has(clean(t))).length })).filter(x => x.n);
  return shuffle(hits).sort((a, b) => b.n - a.n).slice(0, n).map(x => x.p);
}
function startPronSession(gid) {
  let list, title;
  if (gid === 'weak') {
    list = weakPhrases(10); title = 'Mis errores';
    if (list.length < 3) { toast('Aún no hay suficientes palabras difíciles. ¡Sigue practicando!'); return; }
  } else if (gid === 'claude') {   /* tus frases corregidas por Claude, las más nuevas primero */
    list = claudeSentences().slice(0, 10); title = '✨ Mis frases de Claude';
    if (!list.length) { toast('Aún no tienes frases de Claude'); return; }
  } else {
    const g = PRON.find(c => c.id === gid); if (!g) return;
    list = shuffle(g.phrases).slice(0, 10); title = `${g.icon} ${g.title}`;
  }
  P = { gid, title, list, i: 0, tries: 0, result: null, best: [] };
  VS.psession = newVS();
  document.body.classList.add('focus'); window.scrollTo(0, 0);
  renderPronSession(); speak(list[0][0]);
}
function renderPronSession() {
  const [en, es] = P.list[P.i], r = P.result, best = P.best[P.i], left = PS_TRIES - P.tries;
  view().innerHTML = `<div class="lesson-top"><button class="icon-btn" data-act="quit" aria-label="Salir">${ic('x')}</button><div class="bar grow"><i style="width:${pct(P.i, P.list.length)}%"></i></div><span class="muted small">${P.i + 1}/${P.list.length}</span>${dictBtn('sm')}</div>
    <div class="ex"><p class="ex-prompt">${esc(P.title)} <span class="muted small">· Sesión</span></p>
    <div class="card practice"><div class="practice-phrase">${r && !r.error ? colorWords(r) : tapText(en)}</div><p class="muted center">${esc(es)}</p>
      ${left > 0 ? micControls(en, 'psession') : `<div class="speak-controls">${sayBtn(en, 'lg')}</div>`}
      <div id="micres">${r ? voiceResultHTML(r, 'psession') : '<p class="muted center small">Escucha, luego toca el micrófono y repite</p>'}</div>
      <p class="muted center small">${left > 0 ? (P.tries ? `Te queda ${left} intento. Se guarda tu mejor puntaje.` : `Tienes ${PS_TRIES} intentos.`) : 'Usaste tus 2 intentos. ¡Sigue con la próxima!'}</p></div>
    ${!best ? '<button class="link" data-act="psskip">Saltar esta frase</button>' : ''}</div>
    <footer class="ex-foot"><button class="btn primary wide" data-act="psnext" ${best ? '' : 'disabled'}>${P.i + 1 < P.list.length ? 'Siguiente frase' : 'Ver resumen'}</button></footer>`;
}
function onSessionMic(r) {
  if (!P) return;
  P.result = r;
  if (!r.error) {
    trackPron(r); P.tries++;
    const [en, es] = P.list[P.i], prev = P.best[P.i];
    if (!prev || r.score > prev.score) P.best[P.i] = { en, es, score: r.score, words: r.words };
    S.pron[en] = Math.max(S.pron[en] || 0, r.score); save();
    if (r.score >= 70) sfx(r.score >= 90 ? 'great' : 'ok');
  }
  renderPronSession();
  if (!r.error && r.score >= 70) animate($('.pron-result'), 'anim-ok');
}
function nextPronPhrase() {
  const b = P.best[P.i];
  if (b && !b.skipped) trackType('speak', b.score >= 70);
  P.i++; P.tries = 0; P.result = null; VS.psession = newVS(); save();
  if (P.i >= P.list.length) return finishPronSession();
  window.scrollTo(0, 0); renderPronSession(); speak(P.list[P.i][0]);
}
function finishPronSession() {
  const done = P.best.filter(b => b && !b.skipped);
  const avg = done.length ? Math.round(done.reduce((a, b) => a + b.score, 0) / done.length) : 0;
  const words = [...new Set(done.flatMap(b => b.words.filter(w => !w.ok).map(w => clean(w.w))))].filter(Boolean).slice(0, 12);
  const xp = 5 + done.reduce((a, b) => a + (b.score >= 90 ? 3 : b.score >= 70 ? 2 : 1), 0);
  S.pronSessions.push({ t: Date.now(), group: P.title, n: P.list.length, done: done.length, avg, words });
  if (S.pronSessions.length > 60) S.pronSessions.splice(0, S.pronSessions.length - 60);
  addXp(xp);
  const tag = s => `<span class="score-tag ${s >= 70 ? 'good' : 'bad'}">${s}%</span>`;
  view().innerHTML = `<div class="summary"><div class="emoji">${avg >= 90 ? '🏆' : avg >= 70 ? '🎤' : '💪'}</div><h1>¡Sesión terminada!</h1>
    <div class="sum-stats"><div class="stat"><b>+${xp}</b><small>XP</small></div><div class="stat"><b>${done.length ? avg + '%' : '—'}</b><small>Promedio</small></div><div class="stat"><b>${done.length}/${P.list.length}</b><small>Frases</small></div></div></div>
    <section class="card"><h2>Tus frases</h2>${P.list.map(([en, es], k) => { const b = P.best[k]; return `<div class="word-row">${sayBtn(en, 'sm')}<div class="grow"><span>${tapText(en)}</span><span class="muted small block">${esc(es)}</span></div>${b && !b.skipped ? tag(b.score) : '<span class="muted small">Saltada</span>'}</div>`; }).join('')}</section>
    ${words.length ? `<section class="card"><h2>🔴 Palabras para practicar</h2><p class="muted small">Toca una palabra para escucharla y ver qué significa.</p><div class="word-chips">${words.map(w => { const g = gloss(w); return `<button class="word-chip bad" data-act="word" data-w="${esc(w)}"><b>${esc(w)}</b>${g ? `<small>${esc(g)}</small>` : ''}</button>`; }).join('')}</div></section>`
      : done.length ? '<section class="card center"><b>🌟 ¡Pronunciaste bien todas las palabras!</b></section>' : ''}
    <button class="btn primary wide" data-act="tab" data-tab="${tab}">Continuar</button>`;
  P = null;
  celebrate();
}
