'use strict';
/* Fluenta · Lecciones: secciones que se despliegan, gramática, palabra del día y los ejercicios. */
/* ===== LECCIONES ===== */
function lessonUnlocked(id) { const all = allLessons(), i = all.findIndex(l => l.id === id); return i <= 0 || !!S.done[all[i - 1].id]; }
const starsOf = l => { const st = S.done[l.id] || 0; return `<span class="stars">${'★'.repeat(st)}${'☆'.repeat(3 - st)}</span>`; };
const hereTag = '<span class="here-tag">📍 Sigues aquí</span>';
function lessonRow(l, un, extra = '', here = false) {
  const st = S.done[l.id] || 0;
  return `<button class="lesson ${un ? '' : 'locked'} ${st ? 'done' : ''} ${here && un ? 'here' : ''}" ${un ? `data-act="lesson" data-id="${l.id}"` : 'disabled'}>
    <span class="lesson-icon">${un ? l.icon : '🔒'}</span>
    <span class="lesson-info grow">${here && un ? hereTag : ''}<b>${esc(l.title)}</b>${extra || starsOf(l)}</span>
    ${un ? ic('play', 'sm accent') : ''}</button>`;
}
/* Una sección que se despliega: cerrada muestra tu avance, abierta muestra todo su contenido */
function catHTML(page, id, icon, title, sub, p, body) {
  const open = openCat[page] === id;
  return `<section class="cat ${open ? 'open' : ''}" id="cat-${id}"><button class="cat-head" data-act="cat" data-page="${page}" data-id="${id}" aria-expanded="${open}">
    <span class="cat-icon">${icon}</span><span class="grow"><b>${title}</b><small class="muted block">${sub}</small>${p != null ? `<span class="bar thin"><i style="width:${p}%"></i></span>` : ''}</span>${ic('chev', 'cat-chev')}</button>
    ${open ? `<div class="cat-body">${body()}</div>` : ''}</section>`;
}
const catLink = (attrs, icon, title, sub) => `<section class="cat"><button class="cat-head" ${attrs}><span class="cat-icon">${icon}</span><span class="grow"><b>${title}</b><small class="muted block">${sub}</small></span>${ic('play', 'sm accent')}</button></section>`;
const subLabel = t => `<span class="label cat-label">${t}</span>`;
/* Una fila que lleva a otra pantalla o empieza una actividad */
const goRow = (attrs, icon, title, sub) => `<button class="lesson go-row" ${attrs}><span class="lesson-icon">${icon}</span><span class="lesson-info grow"><b>${title}</b>${sub ? `<span class="muted small">${sub}</span>` : ''}</span>${ic('play', 'sm accent')}</button>`;
let courseLevel = null;
function renderLessons() {
  const ls = allLessons();
  return topBar('Lecciones', `<div class="pill">📚 ${ls.filter(l => S.done[l.id]).length}/${ls.length}</div>`) + resumeCard()
    + `<div class="cats">${courseCat()}${TZ_GROUPS.map(tzGroupCat).join('')}${tzMixCat()}${verbsCat()}${talkCat()}${writeCat()}
      ${catLink('data-act="tab" data-tab="grammar"', '📖', 'Gramática', 'Todos los tips de las lecciones y de los tiempos verbales')}</div>`;
}
/* Curso: se elige el nivel arriba y se ven sus unidades; se abre solo en el nivel donde vas */
function courseCat() {
  const ls = allLessons(), done = ls.filter(l => S.done[l.id]).length, nx = ls.find(l => !S.done[l.id]);
  const nu = nx && LESSONS.find(u => u.lessons.includes(nx));
  return catHTML('lessons', 'course', '📚', 'Curso por niveles', nx ? `${done}/${ls.length} lecciones · vas en ${nu.level}: ${esc(nu.unit)}` : '🎓 ¡Completaste todas las lecciones!', pct(done, ls.length), () => {
    const levels = [...new Set(LESSONS.map(u => u.level))], lv = levels.includes(courseLevel) ? courseLevel : nu ? nu.level : levels[levels.length - 1];
    return `<div class="chips">${levels.map(l => { const full = LESSONS.filter(u => u.level === l).every(u => u.lessons.every(x => S.done[x.id])); return `<button class="lvl-chip ${l === lv ? 'on' : ''}" data-act="clevel" data-v="${l}">${l}${full ? ' ✓' : ''}</button>`; }).join('')}</div>`
      + LESSONS.filter(u => u.level === lv).map(u => `<div class="unit-head cat-unit"><span class="badge">${u.level}</span><h3 class="grow">${esc(u.unit)}</h3><span class="muted small">${u.lessons.filter(l => S.done[l.id]).length}/${u.lessons.length}</span></div>
        <div class="path">${u.lessons.map(l => lessonRow(l, lessonUnlocked(l.id), '', l === nx)).join('')}</div>`).join('');
  });
}
/* Presente, pasado y futuro: sus fichas y todas sus prácticas juntas */
function tzGroupCat(g) {
  const les = tzGroupLessons(g), done = les.filter(l => S.done[l.id]).length, acc = tzGroupAcc(g.tenses), nx = les.find(l => !S.done[l.id]);
  return catHTML('lessons', 'tz-' + g.id, g.icon, g.title, `${g.sub}<br>${done}/${les.length} prácticas${acc != null ? ` · ${acc}% de aciertos` : ''}`, pct(done, les.length), () =>
    subLabel('📖 Fichas de cada tiempo')
    + `<div class="path">${g.tenses.map(id => { const t = TENSE_MAP[id], p = tenseStat(id); return goRow(`data-act="tense" data-id="${id}"`, t.icon, esc(t.title), `Tabla, usos y errores típicos${p != null ? ` · ${p}% de aciertos` : ''}`); }).join('')}</div>`
    + subLabel('🎯 Prácticas de 20 ejercicios')
    + `<div class="path">${les.map(l => lessonRow(l, true, l.mix ? `${starsOf(l)} <span class="muted small">· 🔀 Mezcla</span>` : '', l === nx)).join('')}</div>`);
}
function tzMixCat() {
  const all = TENSE_LESSONS.find(l => l.id === 'tz-mix-all');
  return catHTML('lessons', 'tz-mix', '🔀', 'Mezclar los tiempos', `¿Qué tiempo uso? y práctica con presente, pasado y futuro juntos${all && S.done[all.id] ? ' · ✅' : ''}`, null, () =>
    (all ? `<div class="path">${lessonRow(all, true, '', !S.done[all.id])}</div>` : '')
    + subLabel('🧭 ¿Qué tiempo uso?') + '<p class="muted small">Pregúntate esto sobre lo que quieres decir:</p>'
    + TENSE_GUIDE.map(([q, id, ex]) => `<button class="tz-guide" data-act="tense" data-id="${id}"><span class="grow"><b>${esc(q)}</b><small class="block">→ ${esc(tenseName(id))} · <i>${esc(ex)}</i></small></span>${ic('play', 'sm accent')}</button>`).join('')
    + subLabel('🔁 Un verbo en todos los tiempos')
    + TENSE_COMPARE.map(([id, en, es]) => `<div class="word-row">${sayBtn(en.replace(' · ', '. '), 'sm')}<div class="grow"><b>${tapText(en)}</b><span class="muted small block">${esc(es)}</span></div><button class="tz-tag" data-act="tense" data-id="${id}">${esc(tenseName(id).split(':')[0])}</button></div>`).join(''));
}
function verbsCat() {
  const vs = Object.values(S.verbs).flatMap(v => [v.past, v.part].filter(Boolean)), ok = vs.reduce((a, f) => a + f.ok, 0), n = vs.reduce((a, f) => a + f.ok + f.fail, 0);
  const practiced = Object.keys(S.verbs).filter(b => IRR_MAP.has(b)).length;
  return catHTML('lessons', 'verbs', '📒', 'Verbos', `Regulares e irregulares · ${practiced}/${IRR.length} irregulares practicados${n ? ` · ${pct(ok, n)}% de aciertos` : ''}`, pct(practiced, IRR.length), () =>
    `<div class="path">${goRow('data-act="verbs" data-seg="irr"', '🔀', 'Tabla de verbos irregulares', `Los ${IRR.length} irregulares con sus formas, agrupados por patrón`)}
      ${goRow('data-act="verbs" data-seg="reg"', '✅', 'Verbos regulares', 'Cómo se forma el pasado con -ed y cómo suena')}</div>`
    + subLabel('🎯 Practicar pasado y participio')
    + `<div class="path">${lessonRow({ id: 'verbs', icon: '🎯', title: 'Los irregulares más usados' }, true, '<span class="muted small">20 preguntas · primero los que más fallas</span>')}
      ${Object.entries(VERB_PATTERNS).map(([k, [t, d]]) => lessonRow({ id: 'verbs-' + k, icon: '🔀', title: t }, true, `<span class="muted small">${esc(d.split(': ').pop())}</span>`)).join('')}</div>`);
}
function talkCat() {
  const dDone = DIALOGS.filter(d => S.dialogs[d.id]).length, phrases = allPhrases(), pGood = phrases.filter(p => (S.pron[p] || 0) >= 70).length;
  const snd = Object.fromEntries(soundStats().map(x => [x.id, x.avg])), nx = DIALOGS.find(d => !S.dialogs[d.id]);
  return catHTML('lessons', 'talk', '💬', 'Hablar', `Diálogos y pronunciación<br>${dDone}/${DIALOGS.length} diálogos · ${pGood}/${phrases.length} frases bien dichas`, pct(dDone, DIALOGS.length), () =>
    subLabel('💬 Diálogos') + '<p class="muted small">Según lo que respondas, la historia cambia. ¡Descubre todos los finales!</p><div class="path">'
    + DIALOGS.map(d => { const here = d === nx, ok = S.dialogs[d.id];
      return `<div class="lesson dlg-row ${ok ? 'done' : ''} ${here ? 'here' : ''}"><span class="lesson-icon">${d.icon}</span><span class="lesson-info grow">${here ? hereTag : ''}<b>${esc(d.title)}${ok ? ' ✅' : ''}</b><span class="muted small">${d.level} · 🧭 Finales ${(S.ends[d.id] || []).length}/${dialogEnds(d).length}</span>
        <span class="dlg-btns"><button class="add-btn" data-act="dialog" data-id="${d.id}" data-mode="choose">👆 Elegir</button><button class="add-btn strong" data-act="dialog" data-id="${d.id}" data-mode="speak">🎤 Hablar</button></span></span></div>`; }).join('') + '</div>'
    + subLabel('🎤 Pronunciación')
    + `<div class="path">${goRow('data-act="tab" data-tab="talk"', '🎙️', 'Practicar frase por frase', 'Escucha, repite y mira el % de cada palabra')}
      ${PRON.map(c => goRow(`data-act="psession" data-g="${c.id}"`, c.icon, esc(c.title), `Sesión de 10 frases${snd[c.id] != null ? ` · tu promedio ${snd[c.id]}%` : ''}`)).join('')}</div>`);
}
function writeCat() {
  const texts = (S.writing && S.writing.texts) || [], by = {};
  texts.forEach(e => { by[e.topic] = (by[e.topic] || 0) + 1; });
  const used = WRITE_TOPICS.filter(t => by[t.id]).length;
  return catHTML('lessons', 'write', '✍️', 'Escribir', `Temas guiados con corrección en español<br>${texts.length} ${texts.length === 1 ? 'texto escrito' : 'textos escritos'} · ${used}/${WRITE_TOPICS.length} temas`, pct(used, WRITE_TOPICS.length), () =>
    '<p class="muted small">Elige un tema y responde en inglés. La app corrige tu ortografía y tu gramática, y te explica cada error en español.</p>'
    + `<div class="path">${goRow('data-act="tab" data-tab="write"', '✨', 'Tus textos y la corrección con Claude', texts.length ? `${texts.length} ${texts.length === 1 ? 'texto' : 'textos'} · copia, pega y trae las mejoras` : 'Copia tus textos, pégalos en Claude y trae sus mejoras')}</div>`
    + subLabel('📝 Temas')
    + `<div class="path">${WRITE_TOPICS.map(t => goRow(`data-act="write" data-id="${t.id}"`, t.icon, esc(t.title),
      [t.tense ? esc(tenseName(t.tense)) : t.id === 'free' ? 'Tú eliges el tema' : '', by[t.id] ? `✓ ${by[t.id]} ${by[t.id] === 1 ? 'texto' : 'textos'}` : ''].filter(Boolean).join(' · '))).join('')}</div>`);
}
/* Tips: lo que está entre comillas es inglés y se puede tocar */
const tipHTML = t => String(t || '').split(/("[^"]+")/).map((p, i) => i % 2 ? `“${tapText(p.slice(1, -1))}”` : esc(p)).join('');
let grammarLevel = 'all';
function renderGrammar() {
  const levels = [...new Set(LESSONS.map(u => u.level))];
  return topBar('Gramática', closeBtn())
    + `<p class="muted small">Todos los tips de las lecciones. Toca las palabras en inglés para ver qué significan.</p>
    <div class="chips">${['all', ...levels].map(l => `<button class="lvl-chip ${grammarLevel === l ? 'on' : ''}" data-act="glevel" data-v="${l}">${l === 'all' ? 'Todos' : l}</button>`).join('')}</div>`
    + (grammarLevel === 'all' ? `<section class="unit"><div class="unit-head"><span class="badge warm">Tiempos</span><h2 class="grow">Tiempos verbales</h2></div>
      ${TENSES.map(t => `<div class="card tip-card gram"><span class="label">${t.icon} ${esc(t.title)}</span><p>${tipHTML(t.tip)}</p><button class="link-inline small" data-act="tense" data-id="${t.id}">Ver la ficha completa →</button></div>`).join('')}</section>` : '')
    + LESSONS.filter(u => grammarLevel === 'all' || u.level === grammarLevel).map(u => `<section class="unit"><div class="unit-head"><span class="badge">${u.level}</span><h2 class="grow">${esc(u.unit)}</h2></div>
      ${u.lessons.map(l => `<div class="card tip-card gram"><span class="label">${l.icon} ${esc(l.title)}</span><p>${tipHTML(l.tip)}</p></div>`).join('')}</section>`).join('');
}
/* Palabra del día: cambia cada día, sale del diccionario */
function wordOfDay() {
  if (!DICT) return null;
  const pool = DICT.words.filter(r => r[0].length >= 4 && /^[a-z]+$/.test(r[0]) && !/^(det|pron|prep|conj|num|interj|modal)/.test(r[1]));
  const [w, pos, es, ex, exEs] = pool[hash(dayStr()) % pool.length];
  return { w, pos, es, ex, exEs };
}
function fillWod() {
  const box = $('#wod'); if (!box) return;
  if (!DICT) { loadDict().then(fillWod).catch(() => {}); return; }
  const d = wordOfDay(); if (!d) return;
  box.innerHTML = `<div class="row between"><span class="label">✨ Palabra del día</span><button class="link-inline small" data-act="word" data-w="${esc(d.w)}">Ver más ›</button></div>
    <div class="row gap-s"><b class="wod-word grow">${esc(d.w)}</b>${sayBtn(d.w)}</div><div class="wd-es">${esc(d.es)} <span class="muted small">· ${esc(posLabel(d.pos))}</span></div>
    ${d.ex ? `<div class="wd-ex">${sayBtn(d.ex, 'sm')}<div class="grow"><div>${tapText(d.ex)}</div><div class="muted small">${esc(d.exEs)}</div></div></div>` : ''}`;
}
function uniqBy(arr, f) { const s = new Set(); return arr.filter(x => { const k = f(x); if (s.has(k)) return false; s.add(k); return true; }); }
function genExercises(les) {
  if (les.verbQs) return les.verbQs;               /* práctica de verbos irregulares */
  if (les.drills) return genTenseExercises(les);   /* tiempos verbales */
  const words = les.words || [], sentences = les.sentences || [];
  const others = (correct, f) => {
    const local = shuffle(words.map(w => w[f])), global = shuffle(allWords().map(w => w[f]));
    return [...new Set([...local, ...global])].filter(x => x !== correct).slice(0, 3);
  };
  const mkMeaning = w => ({ type: 'choice', track: 'meaning', prompt: '¿Qué significa?', big: w[0], say: w[0], answer: w[1], options: shuffle([w[1], ...others(w[1], 1)]), en: w[0], es: w[1] });
  const mkTranslate = w => ({ type: 'choice', track: 'translate', prompt: '¿Cómo se dice en inglés?', big: w[1], say: w[0], answer: w[0], options: shuffle([w[0], ...others(w[0], 0)]), en: w[0], es: w[1] });
  const mkListen = w => ({ type: 'listen', track: 'listen', prompt: 'Escucha y elige lo que oíste', say: w[0], answer: w[0], options: shuffle([w[0], ...others(w[0], 0)]), en: w[0], es: w[1] });
  const mkOrder = s => ({ type: 'order', track: 'order', prompt: 'Traduce ordenando las palabras', big: s[1], say: s[0], answer: s[0], tokens: shuffle(tokens(s[0])), en: s[0], es: s[1] });
  const mkSpeak = s => ({ type: 'speak', track: 'speak', prompt: 'Lee en voz alta', big: s[0], sub: s[1], say: s[0], answer: s[0], en: s[0], es: s[1] });
  const mkWrite = w => ({ type: 'write', track: 'dictation', prompt: 'Escucha y escribe en inglés', say: w[0], answer: w[0], en: w[0], es: w[1] });
  const mkFill = s => {
    const tk = tokens(s[0]);
    const cand = tk.map((t, i) => i).filter(i => clean(tk[i]).length > 2);
    const bi = pick(cand.length ? cand : [0]);
    const correct = stripPunct(tk[bi]), trail = tk[bi].slice(correct.length);
    const seen = new Set([correct.toLowerCase()]);
    const pool = shuffle([...sentences, ...shuffle(allSentences()).slice(0, 12)].flatMap(x => tokens(x[0])).map(stripPunct))
      .filter(t => clean(t).length > 1 && !seen.has(t.toLowerCase()) && seen.add(t.toLowerCase()));
    return { type: 'fill', track: 'fill', prompt: 'Completa la frase', hint: s[1], before: tk.slice(0, bi).join(' '), after: trail + ' ' + tk.slice(bi + 1).join(' '),
      say: s[0], answer: correct, options: shuffle([correct, ...pool.slice(0, 3)]), en: s[0], es: s[1] };
  };
  const ex = [];
  if (les.focus) {
    const pairs = [[mkMeaning, mkListen], [mkTranslate, mkMeaning], [mkListen, mkTranslate]];
    words.forEach((w, i) => pairs[i % 3].forEach(mk => ex.push(mk(w))));
    sentences.forEach((s, i) => ex.push(i % 2 ? mkFill(s) : mkOrder(s)));
    if (sentences.length) ex.push(mkSpeak(sentences[0]));
    else if (words.length) ex.push(mkSpeak(words[0]));
    (les.fixes || []).forEach(f => ex.push(mkFix(f)));   /* tus errores de escritura */
    (les.verbs || []).forEach(x => { const v = IRR_MAP.get(x.b); if (v) ex.push(verbQ(v, x.form)); });   /* verbos irregulares que fallas */
  } else {
    /* 20 ejercicios, de más fácil a más difícil: reconocer → producir → frases completas.
       take() elige primero las palabras y frases menos usadas, para que salgan todas. */
    const uw = new Map(), us = new Map();
    const take = (list, used, n) => shuffle(list).sort((a, b) => (used.get(a) || 0) - (used.get(b) || 0)).slice(0, Math.min(n, list.length)).map(x => (used.set(x, (used.get(x) || 0) + 1), x));
    const tw = n => take(words, uw, n), ts = n => take(sentences, us, n);
    const recognize = [...tw(6).map(mkMeaning), ...tw(3).map(mkListen)];                          /* 6 + 3 */
    const produce = [...tw(3).map(mkTranslate), ...tw(2).map(mkWrite), ...ts(2).map(mkFill)];     /* 3 + 2 + 2 */
    const build = [...ts(3).map(mkOrder), ...ts(1).map(mkSpeak)];                                  /* 3 + 1 */
    return noRepeats([recognize, produce, build].flatMap(shuffle));
  }
  return shuffle(ex);
}
/* Respuestas escritas: sin mayúsculas, tildes ni signos; se acepta 1 letra de diferencia en palabras largas */
const normAns = s => deaccent(String(s || '')).replace(/[’‘]/g, "'").replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();
function sameAnswer(typed, right) {
  const a = normAns(typed), b = normAns(right);
  if (!a) return { ok: false };
  if (a === b) return { ok: true, close: false };
  return { ok: b.length >= 5 && lev(a, b) <= 1, close: true };
}
/* Tus errores de escritura más frecuentes, para practicarlos en Repaso */
function writingDrills(n = 4) {
  const errs = Object.entries((S.writing && S.writing.errs) || {}).map(([key, e]) => ({ key, ...e }))
    .filter(e => e.wrong && e.right && e.wrong.toLowerCase() !== e.right.toLowerCase() && e.n - (e.ok || 0) * 0.5 > 0);
  return errs.sort((a, b) => (b.n - (b.ok || 0) * 0.5) - (a.n - (a.ok || 0) * 0.5) || b.last - a.last).slice(0, n);
}
function mkFix(e) {
  /* Busca la frase donde cometiste el error y lo convierte en "completa con la forma correcta" */
  const texts = ((S.writing && S.writing.texts) || []).slice().reverse();
  const src = texts.find(t => t.text.toLowerCase().includes(e.wrong.toLowerCase()));
  const sentence = src ? (src.text.match(/[^.!?\n]+[.!?]?/g) || [src.text]).find(s => s.toLowerCase().includes(e.wrong.toLowerCase())).trim() : '';
  const at = sentence.toLowerCase().indexOf(e.wrong.toLowerCase());
  /* Los otros errores de ese mismo texto ya van corregidos, para no practicar con una frase que tiene errores */
  const others = src ? [...(src.errors || []), ...((src.claude && src.claude.errors) || [])].filter(x => x.wrong && x.right && x.wrong.toLowerCase() !== e.wrong.toLowerCase()) : [];
  const fixCtx = s => others.reduce((acc, x) => acc.replace(new RegExp(`(^|[^A-Za-z'])${reEsc(x.wrong)}(?=[^A-Za-z']|$)`, 'i'), (m, p) => p + x.right), s);
  const before = at >= 0 ? fixCtx(sentence.slice(0, at)) : '', after = at >= 0 ? fixCtx(sentence.slice(at + e.wrong.length)) : '';
  /* Tercera opción creíble: otra forma del mismo verbo (went → goes, likes → liking) */
  const r = e.right, base = DICT && /^[a-z]+$/i.test(r) ? baseOfForm(r.toLowerCase()) || (verbBase(r.toLowerCase()) ? r.toLowerCase() : null) : null;
  const variants = [base, base && thirdPerson(base), base && base.replace(/e$/, '') + 'ing', r.endsWith('s') ? r.slice(0, -1) : null];
  const third = variants.find(v => v && v.toLowerCase() !== r.toLowerCase() && v.toLowerCase() !== e.wrong.toLowerCase());
  return { type: 'fill', track: 'fixwrite', fixKey: e.key, prompt: 'Corrige tu error', hint: 'Esta frase la escribiste tú. Elige la forma correcta.',
    before: before.trim(), after: after, say: (before + r + after).trim() || r, answer: r, options: shuffle([r, e.wrong, third].filter(Boolean)), en: r, es: e.es, explain: e.es };
}
/* Que la misma palabra o frase no salga dos veces seguidas */
function noRepeats(a) {
  const clash = k => k > 0 && k < a.length && a[k].en === a[k - 1].en;
  for (let i = 1; i < a.length; i++) {
    if (!clash(i)) continue;
    /* busca con quién cambiarlo: primero más adelante, para respetar el orden de fácil a difícil */
    const order = [...Array(a.length).keys()].filter(j => j > i).concat([...Array(i).keys()]);
    for (const j of order) {
      [a[i], a[j]] = [a[j], a[i]];
      if (![i, i + 1, j, j + 1].some(clash)) break;
      [a[i], a[j]] = [a[j], a[i]];
    }
  }
  return a;
}
/* Lección a medias: se guarda después de cada ejercicio para poder continuar después */
function savedResume(id) {
  const r = S.resume;
  return r && r.id === id && Array.isArray(r.queue) && r.i > 0 && r.i < r.queue.length && Date.now() - r.t < 14 * 864e5 ? r : null;
}
function saveResume() {
  if (!L || L.intro) return;
  const i = L.answered ? L.i + 1 : L.i;
  S.resume = i > 0 && i < L.queue.length ? { id: L.les.id, title: L.les.title, icon: L.les.icon, queue: L.queue, i, first: L.first, total: L.total, t: Date.now() } : null;
  save();
}
function startLesson(id, fresh) {
  const les = findLesson(id);
  if (!les) { toast('Aún no tienes errores para reforzar. ¡Sigue practicando!'); return; }
  const r = fresh ? null : savedResume(id);
  const queue = r ? r.queue : genExercises(les);
  if (!queue.length) { toast('Esta lección no tiene ejercicios.'); return; }
  L = { les, queue, i: 0, first: r ? r.first : 0, sel: null, built: [], typed: '', answered: false, ok: null, result: null, intro: true, tracked: false, resumeAt: r ? r.i : 0 };
  L.total = r ? r.total : L.queue.length;
  document.body.classList.add('focus'); window.scrollTo(0, 0);
  renderLesson();
}
function optClass(ex, i) {
  let c = L.sel === i ? 'sel' : '';
  if (L.answered) { if (ex.options[i] === ex.answer) c = 'right'; else if (L.sel === i) c = 'wrong'; }
  return c;
}
function optionsHTML(ex) { return `<div class="options">${ex.options.map((o, i) => `<button class="opt ${optClass(ex, i)}" data-act="opt" data-i="${i}">${esc(o)}</button>`).join('')}</div>`; }
function renderIntro() {
  const l = L.les;
  view().innerHTML = `<div class="lesson-top"><button class="icon-btn" data-act="quit" aria-label="Salir">${ic('x')}</button><div class="grow"></div>${dictBtn('sm')}</div>
    <div class="intro"><div class="intro-icon">${l.icon}</div><h1>${esc(l.title)}</h1>
      ${l.tip ? `<div class="card tip-card"><span class="label">💡 Tip</span><p>${tipHTML(l.tip)}</p></div>` : ''}
      ${l.words.length ? `<p class="label left">Palabras de esta lección</p><div class="word-chips">${l.words.map(w => `<button class="word-chip" data-act="say" data-t="${esc(w[0])}"><b>${esc(w[0])}</b><small>${esc(w[1])}</small></button>`).join('')}</div>` : ''}
    </div>
    <footer class="ex-foot">${L.resumeAt ? `<button class="btn primary wide" data-act="begin">▶ Continuar · ejercicio ${L.resumeAt + 1} de ${L.queue.length}</button><button class="btn ghost wide" data-act="restart">Empezar de nuevo</button>`
      : `<button class="btn primary wide" data-act="begin">Empezar · ${L.total} ejercicios</button>`}</footer>`;
}
function renderLesson() {
  if (L.intro) return renderIntro();
  const ex = L.queue[L.i], p = Math.round(L.i / L.queue.length * 100);
  let body = `<p class="ex-prompt">${ex.prompt}${ex.retry ? ' <span class="retry-tag">🔁 Otra vez</span>' : ''}</p>`;
  if (ex.type === 'choice') {
    /* La palabra evaluada solo se puede tocar después de responder, para no revelar la respuesta */
    body += `<div class="ex-big">${L.answered && ex.big === ex.say ? tapText(ex.big) : esc(ex.big)}${ex.big === ex.say ? ' ' + sayBtn(ex.say) : ''}</div>${optionsHTML(ex)}`;
  } else if (ex.type === 'listen') {
    body += `<div class="listen-wrap"><button class="speaker-big" data-act="say" data-t="${esc(ex.say)}" aria-label="Escuchar">${ic('volume')}</button><button class="round-btn" data-act="say" data-t="${esc(ex.say)}" data-slow="1" aria-label="Lento">🐢</button></div>${optionsHTML(ex)}`;
  } else if (ex.type === 'write') {
    body += `<div class="listen-wrap"><button class="speaker-big" data-act="say" data-t="${esc(ex.say)}" aria-label="Escuchar">${ic('volume')}</button><button class="round-btn" data-act="say" data-t="${esc(ex.say)}" data-slow="1" aria-label="Lento">🐢</button></div>
      <form data-form="dictation"><input id="dictInput" class="dict-input ${L.answered ? (L.ok ? 'right' : 'wrong') : ''}" placeholder="Escribe lo que escuchas…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" value="${esc(L.typed)}" ${L.answered ? 'disabled' : ''}></form>
      ${L.answered && L.ok && L.close ? `<p class="muted small">Casi perfecto: se escribe <b>${esc(ex.answer)}</b>.</p>` : ''}`;
  } else if (ex.type === 'fill') {
    body += `<p class="muted">${esc(ex.hint)}</p><div class="ex-sentence">${tapText(ex.before)} <span class="blank">${L.sel != null ? esc(ex.options[L.sel]) : '&nbsp;'}</span>${tapText(ex.after)}</div>${optionsHTML(ex)}`;
  } else if (ex.type === 'order') {
    const used = new Set(L.built);
    body += `<div class="ex-big es">${esc(ex.big)}</div>
      <div class="answer-line">${L.built.map((ti, k) => `<button class="chip" data-act="chipback" data-k="${k}">${esc(ex.tokens[ti])}</button>`).join('') || '<span class="muted small">Toca las palabras en orden</span>'}</div>
      <div class="bank">${ex.tokens.map((t, i) => `<button class="chip ${used.has(i) ? 'used' : ''}" data-act="chip" data-i="${i}" ${used.has(i) ? 'disabled' : ''}>${esc(t)}</button>`).join('')}</div>`;
  } else if (ex.type === 'speak') {
    body += `<div class="speak-card card"><div class="ex-big center-big">${tapText(ex.big)}</div><p class="muted center">${esc(ex.sub)}</p>${micControls(ex.say, 'lesson')}
      <div id="micres">${L.result ? pronResultHTML(L.result) : '<p class="muted center small">Escucha, luego toca el micrófono y lee la frase</p>'}</div></div>
      ${!L.answered ? '<button class="link" data-act="speakskip">No puedo hablar ahora</button>' : ''}`;
  }
  const canCheck = L.answered || (ex.type === 'order' ? L.built.length > 0 : ex.type === 'write' ? !!L.typed.trim() : L.sel != null);
  let foot = '';
  if (L.answered) {
    const title = L.skipped ? 'Sin problema 👌' : L.ok ? pick(['¡Correcto! 🎉', '¡Excelente! ⭐', '¡Muy bien! 💪', '¡Perfecto! 🙌']) : 'Casi… 😅';
    const pair = `<b>${tapText(ex.en)}</b> = ${esc(ex.es)}`, sentence = ex.type === 'order' || ex.type === 'fill';
    const bodyTxt = L.skipped ? 'La practicarás en otra ocasión.'
      : L.ok ? (sentence ? tapText(ex.say) : ex.type === 'speak' ? '' : pair)
      : `Respuesta correcta: ${sentence ? `<b>${tapText(ex.say)}</b>` : pair}<br><small>La repetirás al final de la lección.</small>`;
    const explain = ex.explain ? `<div class="fb-body small">💡 ${esc(ex.explain)}</div>` : '';
    foot = `<div class="fb-title">${title}</div>${bodyTxt ? `<div class="fb-body">${bodyTxt}</div>` : ''}${explain}`;
  }
  const showBtn = ex.type !== 'speak' || L.answered;
  view().innerHTML = `<div class="lesson-top"><button class="icon-btn" data-act="quit" aria-label="Salir">${ic('x')}</button><div class="bar grow"><i style="width:${p}%"></i></div><span class="muted small">${L.i + 1}/${L.queue.length}</span>${dictBtn('sm')}</div>
    <div class="ex">${body}</div>
    ${showBtn ? `<footer class="ex-foot ${L.answered ? (L.ok ? 'ok' : 'bad') : ''}">${foot}<button class="btn primary wide" data-act="check" ${canCheck ? '' : 'disabled'}>${L.answered ? 'Continuar' : 'Comprobar'}</button></footer>` : ''}`;
}
function evaluateLesson() {
  const ex = L.queue[L.i];
  let ok;
  if (ex.type === 'order') ok = L.built.map(i => clean(ex.tokens[i])).join(' ') === tokens(ex.answer).map(clean).join(' ');
  else if (ex.type === 'write') { const r = sameAnswer(L.typed, ex.answer); ok = r.ok; L.close = r.close; }
  else ok = ex.options[L.sel] === ex.answer;
  L.answered = true; L.ok = ok;
  if (ex.fixKey) {   /* error de escritura: se descuenta cuando lo corriges */
    const it = S.writing && S.writing.errs[ex.fixKey];
    if (it) { if (ok) it.ok = (it.ok || 0) + 1; else it.n++; }
    trackType('fixwrite', ok); save();
  } else if (ex.verb) {   /* verbo irregular: aciertos y errores por forma (pasado o participio) */
    const v = S.verbs[ex.verb] || (S.verbs[ex.verb] = {}), f = v[ex.form] || (v[ex.form] = { ok: 0, fail: 0 });
    ok ? f.ok++ : f.fail++; v.last = Date.now();
    trackType('verbs', ok); save();
  } else track(ex.track, ex.en, ex.es, ok);
  if (ex.tense) { const t = S.tense[ex.tense] || (S.tense[ex.tense] = { ok: 0, fail: 0 }); ok ? t.ok++ : t.fail++; save(); }
  if (ok) { if (!ex.retry) L.first++; sfx('ok'); if (ex.type === 'order' || ex.type === 'fill' || ex.type === 'write') speakAfter(ex.say); }
  else { sfx('bad'); L.queue.push({ ...ex, retry: true, options: ex.options && shuffle(ex.options), tokens: ex.tokens && shuffle(ex.tokens) }); }
  saveResume();
  renderLesson();
  animate(ex.type === 'order' ? $('.answer-line') : ex.type === 'write' ? $('#dictInput') : $(`.opt[data-i="${L.sel}"]`), ok ? 'anim-ok' : 'anim-bad');
}
function nextExercise() {
  L.i++; L.sel = null; L.built = []; L.typed = ''; L.close = false; L.answered = false; L.ok = null; L.result = null; L.skipped = false; L.tracked = false;
  if (L.i >= L.queue.length) return finishLesson();
  window.scrollTo(0, 0); renderLesson();
  startExerciseAudio();
}
/* Al empezar un ejercicio de escuchar, la app dice la palabra (y abre el teclado si hay que escribir) */
function startExerciseAudio() {
  const ex = L.queue[L.i];
  if (ex.type === 'listen' || ex.type === 'write') speak(ex.say);
  if (ex.type === 'write') { const i = $('#dictInput'); if (i) i.focus(); }
}
function finishLesson() {
  S.resume = null;
  const les = L.les, acc = pct(L.first, L.total), stars = acc >= 90 ? 3 : acc >= 70 ? 2 : 1;
  const isAuto = les.id === 'auto' || !!les.review, firstTime = !isAuto && !S.done[les.id];
  const xp = 10 + L.first * 2 + (firstTime ? 5 : 0) + (isAuto ? 5 : 0);
  if (isAuto) S.autoDone = (S.autoDone || 0) + 1;
  else S.done[les.id] = Math.max(S.done[les.id] || 0, stars);
  let added = 0;
  if (!les.noCards) les.words.forEach(w => { if (!S.cards[w[0]]) { S.cards[w[0]] = { en: w[0], es: w[1], box: 1, due: 0 }; added++; } });
  addXp(xp);
  view().innerHTML = summaryHTML({ emoji: stars === 3 ? '🏆' : '🎉', title: isAuto ? '¡Refuerzo completado!' : '¡Lección completada!', back: tab,
    stats: [[`+${xp}`, 'XP'], [acc + '%', 'A la primera'], ['★'.repeat(stars) + '☆'.repeat(3 - stars), 'Estrellas']],
    note: added ? `Se agregaron ${added} palabras nuevas a tus tarjetas 🃏` : (L.total < L.queue.length ? `Repetiste ${L.queue.length - L.total} ejercicios hasta acertarlos 💪` : '') });
  L = null;
  celebrate();
}
function onLessonMic(r) {
  if (!L) return;
  const ex = L.queue[L.i];
  L.result = r;
  let won = false;
  if (!r.error) {
    trackPron(r);
    if (!L.tracked) { track('speak', ex.en, ex.es, r.score >= 70); L.tracked = true; }
    if (r.score >= 70 && !L.answered) { L.answered = true; L.ok = true; won = true; if (!ex.retry) L.first++; sfx(r.score >= 90 ? 'great' : 'ok'); saveResume(); }
  }
  renderLesson();
  if (won) animate($('.speak-card'), 'anim-ok');
}
