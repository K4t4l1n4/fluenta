'use strict';
/* Fluenta · Tiempos verbales y verbos regulares e irregulares. */
/* ===== TIEMPOS VERBALES =====
   El contenido está en verbos.js. Las prácticas no entran en la cadena de desbloqueo:
   siempre están abiertas y no bloquean las lecciones que ya tienes. */
const TENSE_MAP = Object.fromEntries(TENSES.map(t => [t.id, t]));
const tzLesson = (l, extra) => ({ ...l, ...extra, words: l.words || [], sentences: [], noCards: true });
const TENSE_LESSONS = [...TENSES.flatMap(t => t.lessons.map(l => tzLesson(l, { tense: t.id, tip: l.tip || t.tip }))), ...TENSE_MIX.map(l => tzLesson(l, { mix: true }))];
const tenseName = id => TENSE_MAP[id] ? TENSE_MAP[id].title : '';
const tenseLessonsOf = t => TENSE_LESSONS.filter(l => l.tense === t.id && !l.mix);
function tenseStat(id) { const x = S.tense[id]; return x && x.ok + x.fail ? pct(x.ok, x.ok + x.fail) : null; }
const tenseDone = t => tenseLessonsOf(t).filter(l => S.done[l.id]).length;   /* prácticas terminadas de un tiempo (para el respaldo) */
let tenseId = null, tenseForm = 'aff';
/* En Lecciones los tiempos van en 3 secciones. El presente perfecto va en Pasado: sirve para contar experiencias y lo que ya pasó */
const TZ_GROUPS = [
  { id: 'pres', icon: '☀️', title: 'Presente', sub: 'Presente simple y presente continuo', tenses: ['pres', 'prog'], mix: ['tz-mix-pp'] },
  { id: 'past', icon: '⏪', title: 'Pasado', sub: 'Pasado simple, pasado continuo y presente perfecto', tenses: ['past', 'pastprog', 'perf'], mix: ['tz-mix-past', 'tz-mix-perf'] },
  { id: 'fut', icon: '🔮', title: 'Futuro', sub: 'Will y going to', tenses: ['fut'], mix: ['tz-mix-fut'] }
];
const TZ_GROUP_OF = Object.fromEntries(TZ_GROUPS.flatMap(g => g.tenses.map(t => [t, g.id])));
const tzGroupLessons = g => [...g.tenses.flatMap(id => TENSE_LESSONS.filter(l => l.tense === id && !l.mix)), ...g.mix.map(id => TENSE_LESSONS.find(l => l.id === id)).filter(Boolean)];
function tzGroupAcc(ids) { let ok = 0, n = 0; ids.forEach(id => { const x = S.tense[id]; if (x) { ok += x.ok; n += x.ok + x.fail; } }); return n ? pct(ok, n) : null; }
/* La sección donde vas: la primera con prácticas sin hacer */
function tzNextGroup() { const g = TZ_GROUPS.find(x => tzGroupLessons(x).some(l => !S.done[l.id])); return 'tz-' + (g ? g.id : 'pres'); }
/* 20 ejercicios: reconocer las palabras → completar con la forma correcta → escuchar, ordenar y decirlo */
function genTenseExercises(les) {
  const fill = (d, opt) => { const [a, b] = d[0].split('___'); return (a + opt + b).trim(); };
  const tz = d => les.mix ? d[4] : les.tense, why = d => les.mix ? d[5] || TENSE_WHY[d[4]] : d[4] || '';
  const drills = les.drills.map(d => {
    const [a, b] = d[0].split('___'), en = fill(d, d[1]);
    return { type: 'fill', track: 'tense', tense: tz(d), prompt: les.mix ? 'Elige el tiempo correcto' : 'Completa con la forma correcta', hint: d[3],
      before: a.trim(), after: b, say: en, answer: d[1], options: shuffle([d[1], ...d[2]]), en, es: d[3], explain: why(d) };
  });
  const ws = shuffle(les.words), others = (w, k) => shuffle(ws.filter(x => x !== w).map(x => x[k])).slice(0, 3);
  const recog = ws.length >= 5 ? [
    ...ws.slice(0, 2).map(w => ({ type: 'choice', track: 'meaning', tense: les.tense, prompt: '¿Qué significa?', big: w[0], say: w[0], answer: w[1], options: shuffle([w[1], ...others(w, 1)]), en: w[0], es: w[1] })),
    ...ws.slice(2, 4).map(w => ({ type: 'choice', track: 'translate', tense: les.tense, prompt: '¿Cómo se dice en inglés?', big: w[1], say: w[0], answer: w[0], options: shuffle([w[0], ...others(w, 0)]), en: w[0], es: w[1] })),
    { type: 'write', track: 'dictation', tense: les.tense, prompt: 'Escucha y escribe en inglés', say: ws[4][0], answer: ws[4][0], en: ws[4][0], es: ws[4][1] }] : [];
  /* Con las mismas frases: ordenar, escuchar (¿cuál forma oíste?) y leer en voz alta */
  const pool = shuffle(les.drills.filter(d => !d[0].includes('—'))), short = pool.filter(d => tokens(fill(d, d[1])).length <= 10);   /* ordenar: solo frases cortas */
  const order = d => { const en = fill(d, d[1]); return { type: 'order', track: 'order', tense: tz(d), prompt: 'Traduce ordenando las palabras', big: d[3], say: en, answer: en, tokens: shuffle(tokens(en)), en, es: d[3] }; };
  const listen = d => { const en = fill(d, d[1]); return { type: 'listen', track: 'listen', tense: tz(d), prompt: 'Escucha y elige lo que oíste', say: en, answer: en, options: shuffle([en, ...d[2].map(o => fill(d, o))]), en, es: d[3] }; };
  const last = short[short.length - 1] || pool[pool.length - 1], orders = short.filter(d => d !== last).slice(0, 2);
  const rest = pool.filter(d => d !== last && !orders.includes(d)), more = orders.map(order);
  if (les.review) more.splice(0, more.length, ...shuffle([...pool.map(listen), ...short.map(order)]).slice(0, Math.max(0, 19 - drills.length)));   /* repaso: cada frase fallada de varias formas */
  else while (recog.length + drills.length + more.length < 19 && rest.length) more.push(listen(rest.shift()));
  const speak = last ? [{ type: 'speak', track: 'speak', prompt: 'Lee en voz alta', big: fill(last, last[1]), sub: last[3], say: fill(last, last[1]), answer: fill(last, last[1]), en: fill(last, last[1]), es: last[3] }] : [];
  return noRepeats([...shuffle(recog), ...shuffle(drills), ...shuffle(more), ...speak]);
}
/* La ficha de un tiempo (las secciones de los tiempos están en Lecciones) */
function renderTenses() {
  if (!TENSE_MAP[tenseId]) tenseId = 'pres';
  return renderTense(TENSE_MAP[tenseId]);
}
/* Español de la tabla en negativo y en pregunta: «yo trabajo» → «yo no trabajo» / «¿trabajo?» */
function esForm(es, mode) {
  const m = es.match(/^(yo|tú|ella|él|nosotros|ellos) (.*)$/);
  return !m || mode === 'aff' ? es : mode === 'neg' ? `${m[1]} no ${m[2]}` : `¿${m[2]}?`;
}
const tzExampleHTML = (en, es) => `<div class="row gap-s">${sayBtn(en, 'sm')}<div class="grow"><div>${tapText(en)}</div><div class="muted small">${esc(es)}</div></div></div>`;
const mistakeHTML = ([w, r, es]) => `<div class="wfix-item"><div><del>${esc(w)}</del></div><div class="row gap-s"><ins>${esc(r)}</ins>${sayBtn(r, 'sm')}</div><div class="small">${esc(es)}</div></div>`;
function renderTense(t) {
  const modes = [['aff', '✅ Afirmativa'], ['neg', '🚫 Negativa'], ['q', '❓ Pregunta']], col = { aff: 1, neg: 2, q: 3 }[tenseForm], p = tenseStat(t.id);
  return topBar(`${t.icon} ${esc(t.title)}`, `${closeBtn()}`) + `
    <p class="tz-short">${esc(t.short)}</p>
    <div class="card tz-formula"><span class="label">Cómo se forma</span><b>${esc(t.formula)}</b></div>
    <section class="card"><div class="seg mini">${modes.map(([v, l]) => `<button class="${tenseForm === v ? 'on' : ''}" data-act="tform" data-v="${v}">${l}</button>`).join('')}</div>
      ${t.tables.map(tb => `<span class="label tz-label">${esc(tb.title)}</span>${tb.rows.map(r => `<div class="tz-row"><span class="tz-p">${esc(r[0])}</span><span class="grow"><b>${tapText(r[col])}</b><small class="muted block">${esc(esForm(r[4], tenseForm))}</small></span>${sayBtn(r[col].replace('…', ''), 'sm')}</div>`).join('')}${tb.note ? `<p class="small tz-note">💡 ${tipHTML(tb.note)}</p>` : ''}`).join('')}
      <span class="label tz-label">Respuestas cortas</span>${t.answers.map(([q, y, n]) => `<div class="tz-row"><span class="grow"><b>${tapText(q)}</b><small class="muted block">${esc(y)} · ${esc(n)}</small></span>${sayBtn(`${q} ${y} ${n}`, 'sm')}</div>`).join('')}</section>
    <section class="card"><h2>📌 Cuándo se usa</h2>${t.uses.map(([u, en, es]) => `<div class="tz-use"><span class="label">${esc(u)}</span>${tzExampleHTML(en, es)}</div>`).join('')}</section>
    ${t.vs ? `<section class="card"><h2>⚖️ ${esc(t.vs.title)}</h2>${t.vs.rows.map(([q, id, en, es]) => `<div class="tz-use"><span class="label">${esc(q)} → ${esc(tenseName(id))}</span>${tzExampleHTML(en, es)}</div>`).join('')}<p class="small tz-note">💡 ${tipHTML(t.vs.note)}</p></section>` : ''}
    <section class="card"><h2>🔎 Palabras que te dan la pista</h2><div class="word-chips left">${t.signals.map(w => `<button class="word-chip" data-act="say" data-t="${esc(w)}"><b>${esc(w)}</b></button>`).join('')}</div></section>
    <section class="card"><h2>✏️ Cómo se escribe</h2>${t.rules.map(([r, ex]) => `<div class="tz-rule"><b>${esc(r)}</b><span class="muted small block">${esc(ex)}</span></div>`).join('')}</section>
    <section class="card"><h2>⚠️ Errores típicos</h2>${t.mistakes.map(mistakeHTML).join('')}</section>
    <section class="unit"><div class="unit-head"><span class="badge">Práctica</span><h2 class="grow">${t.lessons.length} ${t.lessons.length === 1 ? 'lección' : 'lecciones'} de 20 ejercicios</h2>${p != null ? `<span class="muted small">${p}%</span>` : ''}</div><div class="path">${tenseLessonsOf(t).map(l => lessonRow(l, true)).join('')}</div></section>
    <div class="row gap tz-more">${t.write ? `<button class="btn ghost grow" data-act="write" data-id="${t.write}">✍️ Escríbelo</button>` : ''}${t.pron ? `<button class="btn ghost grow" data-act="psession" data-g="${t.pron}">🎙️ Pronuncia la ${t.pron === 'ed' ? '‑ed' : '‑s'}</button>` : ''}</div>
    <button class="btn ghost wide" data-act="verbs">📒 Ver los verbos regulares e irregulares</button>`;
}
/* Versión corta en una hoja: para abrirla desde Escribir sin perder lo que estás haciendo */
function tenseSheet(id) {
  const t = TENSE_MAP[id]; if (!t) return;
  const tb = t.tables[0];
  openSheet(`${sheetHead(`${t.icon} ${esc(t.title)}`)}<p class="muted small">${esc(t.short)}</p>
    <div class="card tz-formula"><span class="label">Cómo se forma</span><b>${esc(t.formula)}</b></div>
    <span class="label tz-label">${esc(tb.title)}</span>
    ${tb.rows.filter((r, i) => i === 0 || i === 2).map(r => `<div class="tz-row"><span class="tz-p">${esc(r[0])}</span><span class="grow"><b>${tapText(r[1])}</b><small class="muted block">${esc(r[2])} · ${esc(r[3])}</small></span>${sayBtn(r[1], 'sm')}</div>`).join('')}
    <span class="label tz-label">Errores típicos</span>${t.mistakes.slice(0, 3).map(mistakeHTML).join('')}
    ${W || L ? '' : `<button class="btn primary wide" data-act="tense" data-id="${id}">Ver la ficha completa</button>`}`, 'tense');
}
/* Qué tiempo verbal repasar según el error al escribir (reglas de la app o lo que dijo Claude) */
function errTense(e) {
  if (e.tense && TENSE_MAP[e.tense]) return e.tense;
  if (e.rule === 'past-time') return 'past';
  if (e.rule === 'he-s') return 'pres';
  if (e.rule === 'did-base') return /«did/i.test(e.es || '') ? 'past' : 'pres';
  if (/^modal-/.test(e.rule || '')) return /«(will|won't)/i.test(e.es || '') ? 'fut' : '';
  if (e.rule === 'be-agr') return /^(was|were)$/i.test(e.right || '') ? 'past' : 'pres';
  return '';
}
const tenseLink = e => { const t = errTense(e); return t ? `<button class="link-inline small tz-link" data-act="tensesheet" data-id="${t}">📖 Repasa el ${esc(tenseName(t).toLowerCase())}</button>` : ''; };

/* ===== VERBOS REGULARES E IRREGULARES ===== */
const VERB_PATTERNS = {
  aaa: ['Las 3 iguales', 'La base, el pasado y el participio son iguales: cut – cut – cut'],
  abb: ['Pasado = participio', 'El pasado y el participio son iguales: buy – bought – bought'],
  aba: ['Base = participio', 'El participio es igual a la base: come – came – come'],
  abc: ['Las 3 distintas', 'Las tres formas cambian: go – went – gone']
};
const IRR = VERB_IRR.map(([b, past, part, es, ex, exEs]) => {
  const p1 = past.split(' / ')[0], q1 = part.split(' / ')[0];
  return { b, past, part, es, ex, exEs, common: !!ex, both: / \/ /.test(past) && b !== 'be',
    pat: p1 === b && q1 === b ? 'aaa' : p1 === q1 ? 'abb' : q1 === b ? 'aba' : 'abc' };
});
const IRR_MAP = new Map(IRR.map(v => [v.b, v]));
const REG_MAP = new Map(VERB_REG.map(([b, es]) => [b, { b, es, reg: true, common: true }]));
/* Ortografía de los regulares (comprobada con las formas del diccionario) */
const DOUBLE2 = /^(admit|commit|permit|omit|submit|prefer|refer|occur|regret|control|transfer|equip|compel|patrol|propel|rebel|repel|expel|confer|defer|deter|incur|recur|acquit|forbid|begin|forget|upset|format|embed|unplug|kidnap|worship)$/;
const dblLast = w => (/^([^aeiou]*|[^aeiou]*qu)[aeiou][^aeiouwxy]$/.test(w) && !/^[^aeiou]*[aeiou]{2}/.test(w)) || DOUBLE2.test(w);
const edOf = w => w.endsWith('e') ? w + 'd' : /[^aeiou]y$/.test(w) ? w.slice(0, -1) + 'ied' : dblLast(w) ? w + w.slice(-1) + 'ed' : /c$/.test(w) ? w + 'ked' : w + 'ed';
const ingOf = w => w === 'be' ? 'being' : /ie$/.test(w) ? w.slice(0, -2) + 'ying' : /[^eoy]e$/.test(w) ? w.slice(0, -1) + 'ing' : dblLast(w) ? w + w.slice(-1) + 'ing' : /c$/.test(w) ? w + 'king' : w + 'ing';
/* Cómo suena la -ed: «id» después de t / d, «t» después de sonidos sordos, «d» en los demás */
const edSound = w => /[td]e?$/.test(w) ? 'id' : /(p|k|f|sh|ch|x|ss|ce|ke|pe|gh)$/.test(w) ? 't' : /se$/.test(w) ? '' : 'd';
const ED_SOUND = { t: ['«t»', 'worked', 'stopped', 'washed', 'después de p, k, f, s, sh, ch o x'], d: ['«d»', 'played', 'lived', 'cleaned', 'después de los demás sonidos'], id: ['«id»', 'wanted', 'needed', 'visited', 'solo después de t o d: se agrega una sílaba'] };
/* El resto de los regulares viene del diccionario (se carga aparte) */
function regAll() {
  if (!DICT) return null;
  if (regAll.list) return regAll.list;
  const inf = s => /^[a-záéíóúñ]+(ar|er|ir|ír)(se)?\b/i.test(s);
  regAll.list = DICT.words.filter(r => /(^|\/)v(\/|$)/.test(r[1]) && /^[a-z]+$/.test(r[0]) && !DICT.irr[r[0]] && !REG_MAP.has(r[0]) && !IRR_MAP.has(r[0]) && r[0] !== 'underlie')
    .map(r => { const s = r[2].split(/;\s*/).map(x => x.trim()), es = s.find(inf) || (/^v/.test(r[1]) ? s[0] : ''); return es ? { b: r[0], es, reg: true } : null; }).filter(Boolean);
  return regAll.list;
}
const findVerb = b => IRR_MAP.get(b) || REG_MAP.get(b) || (regAll() || []).find(v => v.b === b);
function verbForms(v) {
  if (typeof v === 'string') v = findVerb(v);
  if (!v) return null;
  const reg = !!v.reg;
  return { ...v, reg, third: thirdPerson(v.b), past: reg ? edOf(v.b) : v.past, part: reg ? edOf(v.b) : v.part, ing: ingOf(v.b) };
}
let verbSeg = 'irr', verbPat = '', verbSearch = '';
function renderVerbs() {
  if (verbSeg === 'reg' && !DICT) loadDict().then(() => { const l = $('#verbList'); if (tab === 'verbs' && l) l.innerHTML = verbListHTML(); }).catch(() => {});
  const sounds = Object.values(ED_SOUND);
  return topBar('Verbos', closeBtn()) + `
    <p class="muted small">Cada verbo con todas sus formas: base, he / she, pasado, participio y -ing. Toca uno para escucharlo y verlo en cada tiempo.</p>
    <button class="card action-card" data-act="lesson" data-id="verbs"><span class="icon-bubble warm">${ic('target')}</span><span class="grow"><b>Practicar pasado y participio</b><small class="muted block">20 preguntas con los irregulares más usados${weakVerbs(1).length ? ' · primero los que más te cuestan' : ''}</small></span>${ic('play', 'sm accent')}</button>
    <div class="seg"><button class="${verbSeg === 'irr' ? 'on' : ''}" data-act="vseg" data-v="irr">🔀 Irregulares</button><button class="${verbSeg === 'reg' ? 'on' : ''}" data-act="vseg" data-v="reg">✅ Regulares</button></div>
    ${verbSeg === 'irr' ? `<div class="chips">${[['', 'Todos'], ...Object.entries(VERB_PATTERNS).map(([k, [t]]) => [k, t])].map(([k, t]) => `<button class="lvl-chip ${verbPat === k ? 'on' : ''}" data-act="vpat" data-v="${k}">${t}</button>`).join('')}</div>
      <p class="muted small">${verbPat ? `${esc(VERB_PATTERNS[verbPat][1])}. <button class="link-inline" data-act="lesson" data-id="verbs-${verbPat}">Practicar este grupo</button>` : 'Los irregulares no siguen la regla del -ed: hay que aprenderlos. Agrupados por patrón se memorizan más fácil.'}</p>`
    : `<section class="card"><h2>✏️ Cómo se forma el pasado</h2>${TENSE_MAP.past.rules.slice(0, 4).map(([r, ex]) => `<div class="tz-rule"><b>${esc(r)}</b><span class="muted small block">${esc(ex)}</span></div>`).join('')}
        <p class="small tz-note">💡 En los regulares, el participio es igual al pasado: work – worked – worked.</p></section>
      <section class="card"><h2>🔊 Cómo suena la -ed</h2>${sounds.map(([s, a, b, c, when]) => `<div class="tz-rule"><b>Suena ${s}</b><span class="muted small block">${when}</span><div class="word-chips left">${[a, b, c].map(w => `<button class="word-chip" data-act="say" data-t="${w}"><b>${w}</b></button>`).join('')}</div></div>`).join('')}
        <button class="btn ghost wide" data-act="psession" data-g="ed">🎙️ Practicar la -ed en voz alta</button></section>`}
    <input id="vq" class="v-search" type="search" placeholder="Buscar en inglés o en español…" value="${esc(verbSearch)}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">
    <div id="verbList">${verbListHTML()}</div>`;
}
function verbListHTML() {
  const q = deaccent(verbSearch.trim());
  const list = (verbSeg === 'irr' ? IRR.filter(v => !verbPat || v.pat === verbPat) : [...REG_MAP.values(), ...(regAll() || [])]).map(verbForms)
    .filter(f => !q || f.b.startsWith(q) || f.past.includes(q) || f.part.includes(q) || deaccent(f.es).includes(q));
  if (!list.length) return `<p class="muted center small">No encontré «${esc(verbSearch)}» entre los ${verbSeg === 'irr' ? 'irregulares. Prueba en ✅ Regulares.' : 'regulares. Prueba en 🔀 Irregulares.'}</p>`;
  const head = '<div class="vrow vhead"><span>Base</span><span>Pasado</span><span>Participio</span></div>';
  const row = f => `<button class="vrow" data-act="verb" data-v="${esc(f.b)}"><span><b>${esc(f.b)}</b><small class="muted block">${esc(f.es)}</small></span><span>${esc(f.past)}</span><span>${esc(f.part)}</span></button>`;
  const common = list.filter(f => f.common), rest = list.filter(f => !f.common).sort((a, b) => a.b.localeCompare(b.b));
  return `${common.length ? `<section class="card vcard"><h2>⭐ Los más usados</h2>${head}${common.map(row).join('')}</section>` : ''}
    ${rest.length ? `<section class="card vcard"><h2>${verbSeg === 'irr' ? 'Otros irregulares' : 'Más verbos regulares'} (${rest.length})</h2>${head}${rest.map(row).join('')}</section>`
      : verbSeg === 'reg' && !DICT ? '<p class="muted small center">Cargando más verbos…</p>' : ''}`;
}
/* Hoja de un verbo: sus formas con audio, cómo se usa en cada tiempo y agregarlo a tarjetas */
function openVerb(b) {
  const f = verbForms(b); if (!f) return;
  const p1 = f.past.split(' / ')[0], q1 = f.part.split(' / ')[0], snd = f.reg ? edSound(f.b) : '';
  const uses = f.b === 'be' ? [['pres', 'I am · she is · they are'], ['prog', "I'm being"], ['past', 'I was · they were'], ['pastprog', 'I was being'], ['fut', "I'll be · I'm going to be"], ['perf', "I've been"]]
    : [['pres', `I ${f.b} · she ${f.third}`], ['prog', `I'm ${f.ing}`], ['past', `I ${p1}`], ['pastprog', `I was ${f.ing}`], ['fut', `I'll ${f.b} · I'm going to ${f.b}`], ['perf', `I've ${q1}`]];
  const card = `${f.b} – ${p1} – ${q1}`;
  openSheet(`${sheetHead(`${f.reg ? '✅' : '🔀'} ${esc(f.b)}`)}<p class="wd-es">${esc(f.es)}</p>
    <p class="muted small">${f.reg ? 'Verbo regular: el pasado y el participio terminan en -ed.' : `Verbo irregular · ${esc(VERB_PATTERNS[f.pat][0].toLowerCase())}${f.both ? ' (también se usa la forma regular con -ed)' : ''}.`}</p>
    <div class="vforms">${[['Base', f.b], ['He / she', f.b === 'be' ? 'is' : f.third], ['Pasado', f.past], ['Participio', f.part], ['-ing', f.ing]].map(([l, w]) => `<div class="vform"><small class="muted">${l}</small><b>${esc(w)}</b>${sayBtn(w.replace(' / ', ', '), 'sm')}</div>`).join('')}</div>
    ${snd ? `<p class="small cl-note">🔊 La -ed de «${esc(p1)}» suena ${ED_SOUND[snd][0]}.</p>` : ''}
    ${f.ex ? `<div class="wd-ex">${sayBtn(f.ex, 'sm')}<div class="grow"><div>${tapText(f.ex)}</div><div class="muted small">${esc(f.exEs)}</div></div></div>` : ''}
    <span class="label tz-label">En cada tiempo</span>
    ${uses.map(([t, s]) => `<div class="vt-row"><button class="tz-tag" data-act="tense" data-id="${t}">${esc(tenseName(t).split(':')[0])}</button><span class="grow">${tapText(s)}</span>${sayBtn(s.replace(/ · /g, '. '), 'sm')}</div>`).join('')}
    ${S.cards[card] ? '<p class="center"><span class="add-btn added">✓ Está en tus tarjetas</span></p>' : `<button class="btn ghost wide" data-act="vcard" data-v="${esc(f.b)}">🃏 Agregar a tarjetas: ${esc(card)}</button>`}`, 'verb');
}
/* Práctica: el pasado y el participio de los irregulares, primero los que más fallas */
function weakVerbs(n = 3) {
  const sc = f => f ? f.fail - f.ok * 0.5 : 0;
  return Object.entries(S.verbs).filter(([b]) => IRR_MAP.has(b)).map(([b, v]) => ({ b, w: Math.max(sc(v.past), sc(v.part)), form: sc(v.part) > sc(v.past) ? 'part' : 'past', last: v.last || 0 }))
    .filter(x => x.w > 0).sort((a, b) => b.w - a.w || b.last - a.last).slice(0, n);
}
function verbQ(v, form) {
  const right = form === 'past' ? v.past : v.part, other = form === 'past' ? v.part : v.past;
  const bad = [v.b === 'be' ? 'beed' : edOf(v.b), other, v.b === 'be' ? 'is' : thirdPerson(v.b), v.b, ingOf(v.b)].filter((o, i, a) => o !== right && a.indexOf(o) === i);
  return { type: 'choice', track: 'verbs', verb: v.b, form, prompt: `¿Cuál es el <b>${form === 'past' ? 'pasado' : 'participio'}</b>? <span class="muted small">(${esc(v.es)})</span>`,
    big: v.b, say: v.b, answer: right, options: shuffle([right, ...bad.slice(0, 3)]), en: `${v.b} – ${v.past} – ${v.part}`, es: v.es,
    explain: `${v.b} – ${v.past} – ${v.part}${form === 'part' ? ` · El participio va con have / has: «I have ${v.part.split(' / ')[0]}».` : ''}` };
}
function verbLesson(id) {
  const pat = id.split('-')[1] || '';
  const pool = IRR.filter(v => !v.both && v.b !== 'lie' && (pat ? v.pat === pat : v.common));
  if (!pool.length) return null;
  const weak = new Set(weakVerbs(10).map(x => x.b));
  const pick10 = [...pool.filter(v => weak.has(v.b)), ...shuffle(pool.filter(v => !weak.has(v.b) && !S.verbs[v.b])), ...shuffle(pool.filter(v => !weak.has(v.b) && S.verbs[v.b]))].slice(0, 10);
  return { id, title: pat ? `Irregulares: ${VERB_PATTERNS[pat][0].toLowerCase()}` : 'Pasado y participio', icon: '🔀', noCards: true, words: [], sentences: [],
    tip: 'Elige la forma correcta de cada verbo. Las que fallas se repiten al final, y las que más te cuestan vuelven en Repaso › Verbos irregulares.',
    verbQs: noRepeats(shuffle(pick10.flatMap(v => [verbQ(v, 'past'), verbQ(v, 'part')]))) };
}
/* Verbo del día (en Inicio): uno de los irregulares más usados */
function verbOfDayHTML() {
  const pool = IRR.filter(v => v.common), v = pool[hash('verbo-' + dayStr()) % pool.length];
  return `<div class="daily-part"><div class="row between"><span class="label">🔀 Verbo del día</span><button class="link-inline small" data-act="verb" data-v="${esc(v.b)}">Sus formas ›</button></div>
    <div class="row gap-s"><b class="wod-word vod-word grow">${esc(v.b)} · ${esc(v.past)} · ${esc(v.part)}</b>${sayBtn(`${v.b}, ${v.past.replace(' / ', ', ')}, ${v.part.replace(' / ', ', ')}`)}</div><div class="wd-es">${esc(v.es)} <span class="muted small">· ${esc(VERB_PATTERNS[v.pat][0].toLowerCase())}</span></div>
    <div class="wd-ex">${sayBtn(v.ex, 'sm')}<div class="grow"><div>${tapText(v.ex)}</div><div class="muted small">${esc(v.exEs)}</div></div></div></div>`;
}
