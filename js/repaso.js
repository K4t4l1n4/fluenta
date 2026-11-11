'use strict';
/* Fluenta · Repaso: tarjetas y tus errores separados por tipo. */
/* ===== TARJETAS (sistema de cajas + repetición en la misma sesión) ===== */
const INTERVALS = [0, 1, 2, 4, 7, 15];
const BOX_NAMES = ['Nueva', 'Fácil', 'Bien', 'Muy bien', 'Dominada'];
const dueCards = () => { const now = Date.now(); return Object.values(S.cards).filter(c => c.due <= now); };
/* Las que fallaste en el último repaso: quedan en la caja 1 con fecha de vuelta */
const failedCards = () => Object.values(S.cards).filter(c => c.box === 1 && c.due > 0);
function renderMyCards() {
  if (F) return reviewHTML();
  return topBar('🃏 Mis tarjetas', closeBtn()) + reviewHomeHTML() + '<div class="gap-v"></div>' + dictHTML();
}

/* ===== REPASO: todos tus errores, separados por tipo =====
   Cada error sale de la lista cuando lo aciertas más veces de las que lo fallaste. */
const revSub = (n, one, many) => n ? `${n} ${n === 1 ? one : many} para repasar` : '✅ Sin errores por ahora';
const revEmpty = t => `<p class="rev-empty">✅ ${t}</p>`;
const revWord = (en, es, right = '') => `<div class="word-row">${sayBtn(en, 'sm')}<div class="grow"><b>${tapText(en)}</b><span class="muted small block">${esc(es)}</span></div>${right}</div>`;
/* Cada frase de las prácticas de tiempos verbales, para reconocerla entre tus errores */
let TZ_DRILLS = null;
function tzDrills() {
  if (TZ_DRILLS) return TZ_DRILLS;
  TZ_DRILLS = new Map();
  TENSE_LESSONS.forEach(l => l.drills.forEach(d => {
    const tz = l.mix ? d[4] : l.tense, why = l.mix ? d[5] || '' : d[4] || '', en = d[0].replace('___', d[1]).trim();
    if (!TZ_DRILLS.has(en)) TZ_DRILLS.set(en, { d: [d[0], d[1], d[2], d[3], tz, why], tense: tz, grp: TZ_GROUP_OF[tz] });
  }));
  return TZ_DRILLS;
}
const byWeak = (a, b) => weakness(b) - weakness(a) || b.last - a.last;
const weakTense = () => { const m = tzDrills(); return Object.values(S.items).filter(i => i.fail > 0 && weakness(i) > 0 && m.has(i.en)).sort(byWeak).map(i => ({ it: i, ...m.get(i.en) })); };
/* Palabras y frases de las lecciones (sin las de tiempos verbales ni las que solo fallaste en Tarjetas) */
function weakPlain() {
  const tz = tzDrills(), ft = new Map();
  S.log.forEach(x => { if (!x.ok) (ft.get(x.en) || ft.set(x.en, new Set()).get(x.en)).add(x.type); });
  const onlyCard = i => { const t = new Set([...Object.keys(i.f || {}), ...(ft.get(i.en) || [])]); return t.size > 0 && [...t].every(x => x === 'card'); };
  return Object.values(S.items).filter(i => i.fail > 0 && weakness(i) > 0 && i.es && !tz.has(i.en) && !(S.cards[i.en] && onlyCard(i))).sort(byWeak);
}
function reviewLesson(id) {
  if (id === 'rev-words') {
    const w = weakPlain(); if (!w.length) return null;
    return { id, title: 'Repaso de palabras y frases', icon: '📚', focus: true, review: true, noCards: true,
      words: w.filter(i => i.kind === 'w').slice(0, 8).map(i => [i.en, i.es]), sentences: w.filter(i => i.kind === 's').slice(0, 5).map(i => [i.en, i.es]),
      tip: 'Las palabras y frases de las lecciones que más te han costado. Cada una aparece de varias formas para que la fijes bien.' };
  }
  if (id === 'rev-write') {
    const fixes = writingDrills(10); if (!fixes.length) return null;
    return { id, title: 'Repaso de tus errores al escribir', icon: '✍️', focus: true, review: true, noCards: true, words: [], sentences: [], fixes,
      tip: 'Las frases que escribiste con errores, para que elijas la forma correcta y la fijes.' };
  }
  if (/^rev-tz/.test(id)) {
    const g = id.split('-')[2] || '', G = TZ_GROUPS.find(x => x.id === g), list = weakTense().filter(x => !g || x.grp === g).slice(0, 12);
    if (!list.length) return null;
    return { id, title: G ? `Repaso del ${G.title.toLowerCase()}` : 'Repaso de tiempos verbales', icon: G ? G.icon : '⏳', review: true, mix: true, noCards: true, words: [], sentences: [], drills: list.map(x => x.d),
      tip: 'Estas son las frases de tiempos verbales que fallaste. Antes de responder, busca la palabra que te da la pista: "yesterday", "now", "tomorrow", "already"…' };
  }
  return null;
}
function renderReview() {
  if (F) return reviewHTML();
  const auto = autoLesson(), r = S.resume, mine = r && /^(auto|rev-|verbs)/.test(r.id);
  return topBar('Repaso') + (mine ? resumeCard() : '')
    + '<p class="muted small">Aquí están tus errores, separados por tipo. Cuando los practicas y los aciertas, van saliendo de la lista.</p>'
    + (auto ? `<button class="card action-card" data-act="lesson" data-id="auto"><span class="icon-bubble warm">${ic('target')}</span><span class="grow"><b>Repasar todo junto</b><small class="muted block">${auto.count} errores mezclados: palabras, frases, escritura y verbos</small></span>${ic('play', 'sm accent')}</button>`
      : '<div class="card center"><b>✅ No tienes errores pendientes</b><p class="muted small">Cuando te equivoques en algo, aparecerá aquí para que lo repases.</p></div>')
    + revCatsHTML();
}
/* Arriba las secciones que tienen algo para repasar (en su orden de siempre); las que están al día van juntas al final */
function revCatsHTML() {
  const dlgN = DIALOGS.reduce((a, d) => a + Object.keys((S.dlg[d.id] || {}).wrong || {}).length, 0);
  const cats = [[weakTense().length, revTenseCat], [weakVerbs(99).length, revVerbsCat], [weakPlain().length, revWordsCat], [dueCards().length + failedCards().length, revCardsCat],
    [weakSounds(12).length, revPronCat], [dlgN, revDlgCat], [writingDrills(99).length, revWriteCat], [S.packs.length + claudeSentences().length, revClaudeCat]];
  const busy = cats.filter(([n]) => n), calm = cats.filter(([n]) => !n);
  return (busy.length ? `<div class="cats">${busy.map(([, f]) => f()).join('')}</div>` : '')
    + (calm.length ? subLabel(busy.length ? '✅ Al día' : '✅ Todo al día') + `<div class="cats calm">${calm.map(([, f]) => f()).join('')}</div>` : '')
    + subLabel('🎮 Para jugar') + `<div class="cats">${gamesCat()}</div>`;
}
function revTenseCat() {
  const all = weakTense(), acc = TENSES.map(t => [t, tenseStat(t.id)]).filter(([, p]) => p != null);
  const accHTML = acc.length ? subLabel('🎯 Tus aciertos por tiempo') + acc.map(([t, p]) => `<button class="tz-guide" data-act="tense" data-id="${t.id}"><span class="grow">${t.icon} ${esc(t.title)}</span><span class="score-tag ${p >= 85 ? 'good' : p >= 60 ? 'mid' : 'bad'}">${p}%</span>${ic('play', 'sm accent')}</button>`).join('') : '';
  return catHTML('review', 'tz', '⏳', 'Tiempos verbales', revSub(all.length, 'frase', 'frases'), null, () => !all.length ? revEmpty('No tienes frases de tiempos verbales falladas.') + accHTML
    : `<div class="path">${TZ_GROUPS.map(g => { const n = all.filter(x => x.grp === g.id).length; return n ? lessonRow({ id: 'rev-tz-' + g.id, icon: g.icon, title: g.title }, true, `<span class="muted small">${n} ${n === 1 ? 'frase' : 'frases'} para repasar</span>`) : ''; }).join('')}
      ${all.length > 1 && new Set(all.map(x => x.grp)).size > 1 ? lessonRow({ id: 'rev-tz', icon: '🔀', title: 'Los 3 tiempos mezclados' }, true, `<span class="muted small">${Math.min(all.length, 12)} frases de presente, pasado y futuro</span>`) : ''}</div>`
      + subLabel('📝 Las frases que fallaste') + all.slice(0, 6).map(x => revWord(x.it.en, x.it.es, `<button class="tz-tag" data-act="tense" data-id="${x.tense}">${esc(tenseName(x.tense).split(':')[0])}</button>`)).join('') + accHTML);
}
function revVerbsCat() {
  const w = weakVerbs(99);
  return catHTML('review', 'verbs', '📒', 'Verbos irregulares', revSub(w.length, 'verbo', 'verbos'), null, () => !w.length
    ? revEmpty('No tienes verbos irregulares fallados.') + `<div class="path">${goRow('data-act="verbs" data-seg="irr"', '🔀', 'Ver la tabla de irregulares', '')}</div>`
    : `<div class="path">${lessonRow({ id: 'verbs', icon: '🎯', title: 'Practicar pasado y participio' }, true, '<span class="muted small">Empieza por los que más fallas</span>')}</div>`
      + subLabel('📝 Los que más fallas') + w.slice(0, 8).map(x => { const v = IRR_MAP.get(x.b); return `<div class="word-row">${sayBtn(`${v.b}, ${v.past.replace(' / ', ', ')}, ${v.part.replace(' / ', ', ')}`, 'sm')}<div class="grow"><b>${esc(v.b)} · ${esc(v.past)} · ${esc(v.part)}</b><span class="muted small block">${esc(v.es)} · te cuesta el ${x.form === 'past' ? 'pasado' : 'participio'}</span></div><button class="add-btn" data-act="verb" data-v="${esc(v.b)}">Ver</button></div>`; }).join(''));
}
function revWordsCat() {
  const w = weakPlain(), nw = Math.min(8, w.filter(i => i.kind === 'w').length) + Math.min(5, w.filter(i => i.kind === 's').length);
  return catHTML('review', 'words', '📚', 'Palabras y frases', revSub(w.length, 'palabra o frase', 'palabras y frases'), null, () => !w.length ? revEmpty('No tienes palabras ni frases falladas en las lecciones.')
    : `<div class="path">${lessonRow({ id: 'rev-words', icon: '📚', title: 'Practicar palabras y frases' }, true, `<span class="muted small">Las ${nw} que más te cuestan, de varias formas</span>`)}</div>`
      + subLabel('📝 Las que más te cuestan') + w.slice(0, 8).map(i => revWord(i.en, i.es, `<span class="score-tag bad">${i.fail} ✗</span>`)).join(''));
}
function revCardsCat() {
  const due = dueCards().length, failed = failedCards(), total = Object.keys(S.cards).length;
  const sub = !total ? 'Aún no tienes tarjetas' : [due ? `${due} para hoy` : 'Las de hoy, al día ✅', failed.length ? `${failed.length} ${failed.length === 1 ? 'fallada' : 'falladas'}` : ''].filter(Boolean).join(' · ');
  return catHTML('review', 'cards', '🃏', 'Tarjetas', sub, null, () =>
    `<div class="path">${due ? goRow('data-act="startrev"', '🔁', `Repasar las de hoy (${Math.min(due, 20)})`, 'Si fallas una, vuelve a salir hasta que la aciertes') : ''}
      ${failed.length ? goRow('data-act="startrev" data-mode="failed"', '🎯', `Repasar las que fallaste (${Math.min(failed.length, 20)})`, 'Las que no supiste en el último repaso') : ''}
      ${goRow('data-act="tab" data-tab="mycards"', '🗂️', 'Mis tarjetas', `${total} ${total === 1 ? 'tarjeta' : 'tarjetas'} · agregar palabras y cómo repasar`)}</div>`
    + (total && !due ? revEmpty('Ya repasaste las tarjetas de hoy.') : '')
    + (failed.length ? subLabel('📝 Las que fallaste') + failed.slice(0, 6).map(c => revWord(c.en, c.es)).join('') : ''));
}
function revPronCat() {
  const words = weakSounds(12), snd = soundStats().filter(x => x.avg < 80), wp = weakPhrases(10).length;
  return catHTML('review', 'pron', '🎤', 'Pronunciación', revSub(words.length, 'palabra', 'palabras'), null, () => !words.length && !snd.length ? revEmpty('No tienes palabras difíciles de pronunciar.')
    : `<div class="path">${wp >= 3 ? goRow('data-act="psession" data-g="weak"', '🎯', 'Sesión de mis errores', `${wp} frases con las palabras que más te cuestan`) : ''}
      ${snd.map(x => goRow(`data-act="psession" data-g="${x.id}"`, x.grp.icon, esc(x.grp.title), `Tu promedio: ${x.avg}%`)).join('')}</div>`
      + (words.length ? subLabel('🔴 Palabras para practicar') + `<p class="muted small">Toca una para escucharla.</p><div class="word-chips left">${words.map(([w]) => `<button class="word-chip bad" data-act="say" data-t="${esc(w)}"><b>${esc(w)}</b></button>`).join('')}</div>` : ''));
}
function revDlgCat() {
  const list = DIALOGS.map(d => ({ d, wrong: Object.entries((S.dlg[d.id] || {}).wrong || {}).sort((a, b) => b[1] - a[1]) })).filter(x => x.wrong.length);
  const n = list.reduce((a, x) => a + x.wrong.length, 0);
  return catHTML('review', 'dlg', '💬', 'Diálogos', revSub(n, 'respuesta', 'respuestas'), null, () => !list.length ? revEmpty('No tienes errores en los diálogos.')
    : '<p class="muted small">Respuestas que elegiste mal. Si juegas el diálogo otra vez sin errores, sale de esta lista.</p><div class="path">'
      + list.map(({ d, wrong }) => `<div class="lesson dlg-row"><span class="lesson-icon">${d.icon}</span><span class="lesson-info grow"><b>${esc(d.title)}</b>${wrong.slice(0, 2).map(([en]) => { const es = optionEs(d, en); return `<span class="muted small block">✗ “${esc(en)}”${es ? ` · ${esc(es)}` : ''}</span>`; }).join('')}
        <span class="dlg-btns"><button class="add-btn" data-act="dialog" data-id="${d.id}" data-mode="choose">👆 Elegir</button><button class="add-btn strong" data-act="dialog" data-id="${d.id}" data-mode="speak">🎤 Hablar</button></span></span></div>`).join('') + '</div>');
}
function revWriteCat() {
  const fx = writingDrills(99);
  return catHTML('review', 'write', '✍️', 'Escritura', revSub(fx.length, 'error', 'errores'), null, () => !fx.length
    ? revEmpty('No tienes errores de escritura pendientes.') + `<div class="path">${goRow('data-act="tab" data-tab="lessons" data-cat="write"', '✍️', 'Escribir un texto', 'Temas guiados con corrección en español')}</div>`
    : `<div class="path">${lessonRow({ id: 'rev-write', icon: '✍️', title: 'Practicar mis errores al escribir' }, true, `<span class="muted small">${Math.min(fx.length, 10)} ${fx.length === 1 ? 'frase' : 'frases'} para corregir</span>`)}</div>`
      + subLabel('📝 Tus errores más repetidos') + fx.slice(0, 6).map(e => `<div class="wfix-item"><div><del>${esc(e.wrong)}</del>${e.claude ? ' <span class="muted small">✨ Claude</span>' : ''}</div><div class="row gap-s"><ins>${esc(e.right)}</ins>${sayBtn(e.right, 'sm')}</div>${e.es ? `<div class="small">${esc(e.es)}</div>` : ''}${tenseLink(e)}</div>`).join(''));
}
function revClaudeCat() {
  const packs = S.packs, cl = claudeSentences().length;
  const sub = packs.length || cl ? [packs.length ? `${packs.length} ${packs.length === 1 ? 'refuerzo' : 'refuerzos'}` : '', cl ? `${cl} ${cl === 1 ? 'frase corregida' : 'frases corregidas'}` : ''].filter(Boolean).join(' · ') : 'Lo que te prepara Claude con tus textos';
  return catHTML('review', 'claude', '✨', 'Claude', sub, null, () =>
    (packs.length ? subLabel('📦 Refuerzos preparados por Claude') + `<div class="path">${packs.map(p => `<div class="pack-row">${lessonRow(p, true, `<span class="muted small">${esc(p.note || 'Refuerzo preparado por Claude')}</span>`)}<button class="icon-btn sm" data-act="delpack" data-id="${esc(p.id)}" aria-label="Eliminar">${ic('trash')}</button></div>`).join('')}</div>` : '')
    + (!packs.length && !cl ? '<p class="muted small">Cuando Claude revise tus textos, aquí aparecerán sus refuerzos y las frases que te corrigió.</p>' : '')
    + `<div class="path">${cl ? goRow('data-act="psession" data-g="claude"', '🎤', 'Mis frases de Claude', `Pronuncia las ${Math.min(10, cl)} últimas frases que te corrigió`) : ''}
      ${goRow('data-act="clpaste"', '📥', 'Pegar mejoras de Claude', 'Trae las correcciones de Claude a Fluenta')}</div>`);
}
function reviewHomeHTML() {
  const all = Object.values(S.cards), due = dueCards().length;
  if (!all.length) return `<div class="card center"><p style="font-size:44px;margin:0">🃏</p><b>Aún no tienes tarjetas</b><p class="muted small">Completa una lección o agrega palabras en el Diccionario.</p><button class="btn primary wide" data-act="tab" data-tab="lessons">Ir a lecciones</button></div>`;
  const counts = [1, 2, 3, 4, 5].map(b => all.filter(c => c.box === b).length), max = Math.max(...counts, 1);
  return `<section class="card"><span class="label">Repaso inteligente</span><div class="big-num">${due} <span class="small muted">para hoy</span></div>
    <p class="muted small">Si fallas una tarjeta, vuelve a aparecer en este mismo repaso hasta que la aciertes, y mañana la verás otra vez.</p>
    <div class="boxes">${counts.map((c, i) => `<div><i style="height:${Math.round(c / max * 55) + 4}px"></i>${BOX_NAMES[i]}<br><b>${c}</b></div>`).join('')}</div></section>
    <button class="btn primary wide" data-act="startrev" ${due ? '' : 'disabled'}>${due ? `Empezar repaso (${Math.min(due, 20)})` : 'Todo al día ✅'}</button>
    <button class="btn ghost wide" data-act="startrev" data-all="1">Repasar todas igual</button>
    <section class="card" style="margin-top:14px"><h2>⚙️ Cómo repasar</h2>
      <div class="field">Mostrar primero<div class="seg mini">${[['en', '🇬🇧 Inglés'], ['es', '🇪🇸 Español'], ['mix', '🔀 Mezclado']].map(([v, l]) => `<button class="${(S.cardDir || 'en') === v ? 'on' : ''}" data-act="carddir" data-v="${v}">${l}</button>`).join('')}</div></div>
      <div class="field">Responder<div class="seg mini"><button class="${S.cardWrite ? '' : 'on'}" data-act="cardwrite" data-v="0">👆 Volteando</button><button class="${S.cardWrite ? 'on' : ''}" data-act="cardwrite" data-v="1">⌨️ Escribiendo</button></div>
        <small class="muted block" style="margin-top:6px">${S.cardWrite ? 'Escribes la respuesta y la app la revisa. Acepta errores de tildes y una letra de diferencia.' : 'Piensas la respuesta, volteas la tarjeta y dices si la sabías.'}</small></div></section>`;
}
function startReview(mode) {
  const list = mode === 'all' ? Object.values(S.cards) : mode === 'failed' ? failedCards() : dueCards();
  if (!list.length) return;
  const q = shuffle(list).slice(0, 20).map(c => c.en), dir = S.cardDir || 'en';
  F = { queue: q, i: 0, flip: false, unique: q.length, firstRight: 0, failed: new Set(), typed: '', result: null, close: false,
    dirOf: Object.fromEntries(q.map(en => [en, dir === 'mix' ? pick(['en', 'es']) : dir])) };
  document.body.classList.add('focus'); window.scrollTo(0, 0); render();
  if (S.cardWrite) focusCardInput();
}
/* Al abrirse el teclado, el iPhone sube la pantalla y la palabra quedaba escondida: se vuelve arriba */
function focusCardInput() {
  const i = $('#cardInput'); if (!i) return;
  try { i.focus({ preventScroll: true }); } catch (e) { i.focus(); }
  const top = () => { if (document.activeElement === i) window.scrollTo(0, 0); };
  [60, 300, 600].forEach(ms => setTimeout(top, ms));
  if (window.visualViewport) {
    const onResize = () => top();
    visualViewport.addEventListener('resize', onResize);
    setTimeout(() => visualViewport.removeEventListener('resize', onResize), 1200);
  }
}
function reviewHTML() {
  const en = F.queue[F.i], c = S.cards[en], again = F.failed.has(en), d = F.dirOf[en] || 'en', write = !!S.cardWrite;
  const front = d === 'en' ? c.en : c.es, back = d === 'en' ? c.es : c.en;
  /* Lo que está en inglés se puede tocar, pero solo cuando ya se ve la respuesta */
  const show = (txt, isEn) => isEn && F.flip ? tapText(txt) : esc(txt);
  const answer = write
    ? (F.flip ? `<div class="card-res ${F.result ? 'ok' : 'bad'}"><b>${F.result ? (F.close ? '✅ ¡Correcto! Revisa cómo se escribe.' : '✅ ¡Correcto!') : '❌ Esta vez no'}</b>${F.typed ? `<span class="small block">Escribiste: ${esc(F.typed)}</span>` : ''}</div>
        <button class="btn primary wide" data-act="rate" data-v="${F.result ? 1 : 0}">Continuar</button>`
      : `<form data-form="cardcheck" class="stack"><input id="cardInput" placeholder="Escribe en ${d === 'en' ? 'español' : 'inglés'}…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" value="${esc(F.typed)}">
        <div class="row gap"><button type="button" class="btn ghost grow" data-act="cardidk">No sé</button><button class="btn primary grow">Comprobar</button></div></form>`)
    : (F.flip ? `<div class="rate-row"><button class="btn no" data-act="rate" data-v="0">😕 No la sabía</button><button class="btn yes" data-act="rate" data-v="1">😎 La sabía</button></div>` : '<p class="muted center small">¿Recuerdas la respuesta? Piénsala y voltea la tarjeta.</p>');
  return `<div class="lesson-top"><button class="icon-btn" data-act="quit" aria-label="Salir">${ic('x')}</button><div class="bar grow"><i style="width:${pct(F.i, F.queue.length)}%"></i></div><span class="muted small">${F.queue.length - F.i} restantes</span>${dictBtn('sm')}</div>
    ${again ? '<p class="center"><span class="retry-tag">🔁 Esta la fallaste: ¡otra vez!</span></p>' : ''}
    <${write ? 'div' : 'button'} class="flash ${write ? 'write' : ''} ${F.flip ? 'flipped' : ''}" ${write ? '' : 'data-act="flip"'}><div class="flash-inner">
      <div class="face">${write && d === 'en' ? `<span class="face-say">${sayBtn(c.en)}</span>` : ''}<span class="label">${d === 'en' ? 'Inglés' : 'Español'}</span><b class="${front.length > 22 ? 'long' : ''}">${esc(front)}</b><span class="muted small">${write ? (d === 'en' ? '¿Qué significa?' : '¿Cómo se dice en inglés?') : 'Toca para ver la respuesta'}</span></div>
      <div class="face back"><span class="label">${d === 'en' ? 'Español' : 'Inglés'}</span><b class="${back.length > 22 ? 'long' : ''}">${show(back, d === 'es')}</b><span>${show(front, d === 'en')}</span></div>
    </div></${write ? 'div' : 'button'}>
    ${(write ? F.flip : d === 'en' || F.flip) ? `<div class="row" style="justify-content:center;margin-bottom:16px">${sayBtn(c.en, 'lg')}</div>` : ''}
    ${answer}`;
}
function checkCardAnswer(idk) {
  if (!F || F.flip) return;
  const en = F.queue[F.i], c = S.cards[en], d = F.dirOf[en] || 'en', typed = (F.typed || '').trim();
  if (!typed && !idk) return;
  let r = { ok: false, close: false };
  if (!idk) r = d === 'es' ? sameAnswer(typed, c.en)
    : [c.es, ...c.es.split(/[,;/()]+/)].map(x => x.trim()).filter(Boolean).map(o => sameAnswer(typed, o)).find(x => x.ok) || r;
  F.result = r.ok; F.close = r.close; F.flip = true;
  sfx(r.ok ? 'ok' : idk ? 'flip' : 'bad'); render(); speakAfter(c.en);
  animate($('.flash'), r.ok ? 'anim-ok' : 'anim-bad');
}
function rateCard(v) {
  F.typed = ''; F.result = null; F.close = false;
  const en = F.queue[F.i], c = S.cards[en], again = F.failed.has(en);
  if (v) {
    if (again) { c.box = 1; c.due = Date.now() + 864e5; }
    else { c.box = Math.min(5, c.box + 1); c.due = Date.now() + INTERVALS[c.box] * 864e5; F.firstRight++; }
  } else {
    c.box = 1; c.due = Date.now() + 10 * 60e3; F.failed.add(en);
    F.queue.splice(Math.min(F.queue.length, F.i + 4), 0, en);
  }
  track('card', c.en, c.es, v); S.reviews++; save();
  F.i++; F.flip = false;
  if (F.i >= F.queue.length) {
    const xp = 2 + F.firstRight + F.failed.size, unique = F.unique, right = F.firstRight, fixed = F.failed.size;
    F = null; addXp(xp);
    view().innerHTML = summaryHTML({ emoji: '🧠', title: '¡Repaso terminado!', back: tab,
      stats: [[`+${xp}`, 'XP'], [`${right}/${unique}`, 'A la primera'], [fixed, 'Reforzadas']],
      note: fixed ? 'Las tarjetas que fallaste volverán mañana para asegurarte de no olvidarlas.' : '¡Perfecto, ninguna fallada! 🌟' });
    celebrate();
  } else { render(); if (S.cardWrite) focusCardInput(); }
}
function dictHTML() {
  const custom = Object.values(S.cards).filter(c => c.custom);
  return `<button class="card action-card" data-act="dict"><span class="icon-bubble">${ic('dict')}</span><span class="grow"><b>Buscar en el diccionario</b><small class="muted block">En inglés o en español · ${DICT ? DICT.words.length.toLocaleString('es-CL') : 'más de 3.000'} palabras, también sin internet</small></span>${ic('play', 'sm accent')}</button>
    <section class="card"><h2>➕ Agregar palabra</h2><form data-form="addword" class="stack"><input name="en" placeholder="Palabra en inglés" required autocapitalize="off" autocomplete="off"><input name="es" placeholder="Traducción al español" required autocomplete="off"><button class="btn primary">Agregar a mis tarjetas</button></form></section>
    ${custom.length ? `<section class="card"><h2>📝 Mis palabras (${custom.length})</h2>${custom.map(c => `<div class="word-row">${sayBtn(c.en, 'sm')}<div class="grow"><b>${tapText(c.en)}</b> <span class="muted">— ${esc(c.es)}${c.claude ? ' · ✨' : ''}</span></div><button class="icon-btn sm" data-act="delword" data-en="${esc(c.en)}" aria-label="Eliminar">${ic('trash')}</button></div>`).join('')}</section>` : ''}`;
}
