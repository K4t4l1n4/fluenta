'use strict';
/* Fluenta · Diccionario: búsqueda sin internet, Wiktionary y la hoja emergente. */
/* ===== DICCIONARIO: más de 3.000 palabras sin internet, y Wiktionary como respaldo ===== */
const POS = { s: 'sustantivo', v: 'verbo', adj: 'adjetivo', adv: 'adverbio', prep: 'preposición', pron: 'pronombre', conj: 'conjunción', det: 'determinante', interj: 'interjección', num: 'número', modal: 'verbo modal' };
const posLabel = p => (p || '').split('/').map(x => POS[x] || x).join(' · ');
const CONTRACTIONS = {
  "i'm": ['I am', 'yo soy / yo estoy'], "you're": ['you are', 'tú eres / tú estás'], "he's": ['he is', 'él es / él está'], "she's": ['she is', 'ella es / ella está'],
  "it's": ['it is', 'es / está'], "we're": ['we are', 'somos / estamos'], "they're": ['they are', 'ellos son / están'], "that's": ['that is', 'eso es'],
  "what's": ['what is', '¿qué es? / ¿cuál es?'], "there's": ['there is', 'hay'], "here's": ['here is', 'aquí está'], "let's": ['let us', 'hagamos… / vamos a…'],
  "i've": ['I have', 'he / tengo'], "we've": ['we have', 'hemos / tenemos'], "i'll": ['I will', 'yo (futuro): voy a…'], "you'll": ['you will', 'tú (futuro)'], "we'll": ['we will', 'nosotros (futuro)'],
  "i'd": ['I would', 'yo (condicional): quisiera, me gustaría…'], "don't": ['do not', 'no (+ verbo)'], "doesn't": ['does not', 'no (+ verbo, con he/she/it)'], "didn't": ['did not', 'no (en pasado)'],
  "isn't": ['is not', 'no es / no está'], "aren't": ['are not', 'no son / no están'], "wasn't": ['was not', 'no era / no estaba'], "weren't": ['were not', 'no eran / no estaban'],
  "can't": ['cannot', 'no puedo / no puede'], "couldn't": ['could not', 'no pude / no podría'], "won't": ['will not', 'no (en futuro)'], "wouldn't": ['would not', 'no (condicional)'],
  "shouldn't": ['should not', 'no debería'], "haven't": ['have not', 'no he / no tengo'], "hasn't": ['has not', 'no ha / no tiene']
};
const DICT_IX = { w: new Map(), form: new Map(), irr: new Map(), verbs: {} };
let DICT = null, dictLoading = null, dictSearchQ = '';
function loadDict() {
  if (DICT) return Promise.resolve(DICT);
  if (!dictLoading) dictLoading = fetch('dict.json').then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).then(d => {
    d.words.forEach(([w, pos, es, ex, exEs, forms]) => {
      DICT_IX.w.set(w, { w, pos, es, ex, exEs });
      if (forms) forms.split('|').forEach(f => { if (!DICT_IX.form.has(f)) DICT_IX.form.set(f, w); });
    });
    Object.entries(d.irr).forEach(([base, [past, part]]) => {
      DICT_IX.verbs[base] = [past, part];
      const pp = part.split('/');
      past.split('/').forEach(f => DICT_IX.irr.set(f, { base, kind: pp.includes(f) ? 'both' : 'past' }));
      pp.forEach(f => { if (!DICT_IX.irr.has(f)) DICT_IX.irr.set(f, { base, kind: 'part' }); });
    });
    return (DICT = d);
  }).catch(e => { dictLoading = null; throw e; });
  return dictLoading;
}
/* Palabras de las lecciones y de tus tarjetas (incluye expresiones como "wake up") */
function appEntries() {
  const m = new Map();
  [...allWords(), ...WRITE_TOPICS.flatMap(t => t.words)].forEach(([en, es]) => { const k = en.toLowerCase(); if (!m.has(k)) m.set(k, { w: k, es, pos: '' }); });
  Object.values(S.cards).forEach(c => { const k = c.en.toLowerCase(); if (!m.has(k)) m.set(k, { w: k, es: c.es, pos: '' }); });
  return m;
}
let SENTENCES = null;
function appSentences() {
  if (!SENTENCES) SENTENCES = uniqBy([...allSentences(), ...PRON.flatMap(c => c.phrases), ...WRITE_TOPICS.flatMap(t => t.questions),
    ...DIALOGS.flatMap(d => Object.values(d.nodes).flatMap(n => [n.npc, ...(n.options || []).filter(o => o.go).map(o => [o.en, o.es])]))], s => s[0]);
  return SENTENCES;
}
const normWord = t => String(t).toLowerCase().replace(/[’‘]/g, "'").replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
const getEntry = (w, app) => DICT_IX.w.get(w) || app.get(w) || null;
function stemGuess(w) {
  const tries = [], add = (suf, rep = '') => { if (w.length > suf.length + 1 && w.endsWith(suf)) tries.push(w.slice(0, -suf.length) + rep); };
  add("'s"); add('ies', 'y'); add('ied', 'y'); add('ier', 'y'); add('iest', 'y'); add('es'); add('s'); add('ed'); add('ed', 'e'); add('ing'); add('ing', 'e'); add('er'); add('est'); add('ly');
  tries.slice().forEach(t => { if (/([b-df-hj-np-tv-z])\1$/.test(t)) tries.push(t.slice(0, -1)); });
  return tries.find(t => DICT_IX.w.has(t)) || null;
}
function formLabel(w, h) {
  const base = DICT_IX.w.get(h), noun = base && /(^|\/)s(\/|$)/.test(base.pos) && !/(^|\/)v(\/|$)/.test(base.pos);
  if (noun && !/(ing|ed|er|est|ly)$/.test(w)) return `el plural de “${h}”`;
  if (w.endsWith('ing')) return `la forma -ing de “${h}”`;
  if (w.endsWith('ed')) return `el pasado de “${h}”`;
  if (w.endsWith('est')) return `el superlativo de “${h}” (el más…)`;
  if (w.endsWith('er')) return `el comparativo de “${h}” (más…)`;
  if (w.endsWith('ly')) return `el adverbio de “${h}”`;
  if (w.endsWith('s')) return `el plural o la forma con he/she/it de “${h}”`;
  return `una forma de “${h}”`;
}
const IRR_KIND = { past: 'el pasado', part: 'el participio', both: 'el pasado y el participio' };
function lookup(raw) {
  const w = normWord(raw); if (!w) return null;
  if (CONTRACTIONS[w]) { const [full, es] = CONTRACTIONS[w]; return { w, entry: { w, es, pos: '' }, base: null, note: `la forma corta de “${full}”` }; }
  const app = appEntries(), r = { w, entry: getEntry(w, app), base: null, note: '' };
  const ir = DICT_IX.irr.get(w);
  if (ir && ir.base !== w) { r.base = getEntry(ir.base, app); r.note = `${IRR_KIND[ir.kind]} de “${ir.base}”`; }
  else if (!r.entry || !DICT_IX.w.has(w)) {
    const h = DICT_IX.form.get(w) || stemGuess(w);
    if (h && h !== w) { r.base = getEntry(h, app); r.note = formLabel(w, h); }
  }
  if (!r.entry && !r.base && w.includes('-')) {
    const parts = w.split('-').map(lookup).filter(Boolean);
    if (parts.length) r.entry = { w, es: parts.map(p => `${p.w}: ${(p.entry || p.base).es}`).join(' · '), pos: '' };
  }
  return r.entry || r.base ? r : null;
}
/* Qué se guarda en tarjetas: la palabra tocada, o la forma base si es un plural o un -ing */
function cardFor(r) {
  if (r.entry) return { en: r.w, es: r.entry.es };
  if (DICT_IX.irr.has(r.w)) return { en: r.w, es: `${r.note} (${r.base.es})` };
  return { en: r.base.w, es: r.base.es };
}
function examplesFor(r) {
  const out = [], add = s => { if (s && out.length < 2 && !out.some(o => o[0] === s[0])) out.push(s); };
  const has = k => ([en]) => tokens(en).some(t => normWord(t) === k);
  if (r.entry && r.entry.ex) add([r.entry.ex, r.entry.exEs]);
  add(appSentences().find(has(r.w)));
  if (r.base && r.base.ex) add([r.base.ex, r.base.exEs]);
  if (r.base) add(appSentences().find(has(r.base.w)));
  return out;
}
const exampleHTML = ([en, es]) => `<div class="wd-ex">${sayBtn(en, 'sm')}<div class="grow"><div>${tapText(en)}</div><div class="muted small">${esc(es)}</div></div></div>`;
const showWord = w => w.replace(/^i(?=$|')/, 'I');
function wordHeadHTML(w, pos) {
  return `<div class="wd-head"><div class="grow"><div class="wd-word">${esc(showWord(w))}</div>${pos ? `<span class="label">${esc(posLabel(pos))}</span>` : ''}</div>
    <button class="say lg" data-act="say" data-t="${esc(w)}" aria-label="Escuchar">${ic('volume')}</button><button class="round-btn" data-act="say" data-t="${esc(w)}" data-slow="1" aria-label="Lento">🐢</button></div>`;
}
function wordDetailHTML(r, extra = '') {
  const main = r.entry || r.base, card = cardFor(r), exs = examplesFor(r);
  const vb = [r.base && r.base.w, r.entry && r.entry.w].find(k => k && DICT_IX.verbs[k]);
  return wordHeadHTML(r.w, main.pos)
    + (r.entry ? `<div class="wd-es">${esc(r.entry.es)}</div>` : '')
    + (r.note ? `<div class="wd-note">“${esc(r.w)}” es ${esc(r.note)}${r.base ? `: <button class="link-inline" data-act="word" data-w="${esc(r.base.w)}">${esc(r.base.w)}</button> = ${esc(r.base.es)}` : ''}</div>` : '')
    + (vb ? `<div class="wd-forms"><span class="label">Verbo irregular</span><div><b>${esc(vb)}</b> → <b>${esc(DICT_IX.verbs[vb][0].replace('/', ' / '))}</b> → <b>${esc(DICT_IX.verbs[vb][1].replace('/', ' / '))}</b></div><small class="muted">presente → pasado → participio</small></div>` : '')
    + (exs.length ? `<div class="wd-exs"><span class="label">Ejemplos</span>${exs.map(exampleHTML).join('')}</div>` : '')
    + (S.cards[card.en] ? '<p class="center"><span class="add-btn added">✓ Ya está en tus tarjetas</span></p>'
      : `<button class="btn primary wide" data-act="addcardw" data-en="${esc(card.en)}" data-es="${esc(card.es)}">+ Agregar a tarjetas</button>`)
    + extra;
}
const WIKI = new Map();
async function wikiLookup(word) {
  if (WIKI.has(word)) return WIKI.get(word);
  const r = await fetch(`https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(word)}&prop=wikitext&format=json&origin=*&redirects=1`);
  const d = await r.json(), t = d && d.parse && d.parse.wikitext && d.parse.wikitext['*'];
  let res = null;
  const en = t && (t.split(/^==\s*English\s*==\s*$/m)[1] || '').split(/^==[^=\n]+==\s*$/m)[0];
  if (en) {
    const trans = [...new Set([...en.matchAll(/^\*\s*Spanish:(.*)$/gm)].flatMap(m => [...m[1].matchAll(/\{\{t{1,2}\+?\|es\|([^|}]+)/g)].map(x => x[1].trim())))].slice(0, 3);
    const lm = en.match(/\{\{(?:en-)?[a-z -]*?of\|(?:en\|)?([^|}]+)/i);
    res = { trans, lemma: lm ? lm[1].trim().toLowerCase() : null };
  }
  WIKI.set(word, res);
  return res;
}

/* ===== Hoja emergente (pop-up) para palabras y para el buscador ===== */
const SHEET = { open: false, mode: '', word: '', fromSearch: false };
function openSheet(html, mode) {
  if (!SHEET.open) SHEET.fromSearch = mode === 'search';
  SHEET.open = true; SHEET.mode = mode;
  const s = $('#sheet');
  s.innerHTML = `<div class="sheet-bg" data-act="sheetclose"></div><div class="sheet ${mode === 'search' ? 'tall' : ''}" role="dialog" aria-modal="true"><div id="sheetBody">${html}</div></div>`;
  s.classList.add('open'); document.documentElement.classList.add('noscroll');
}
function setSheet(html) { const b = $('#sheetBody'); if (b) { b.innerHTML = html; b.parentElement.scrollTop = 0; } }
function closeSheet() {
  SHEET.open = false; SHEET.fromSearch = false; SHEET.word = '';
  const s = $('#sheet'); s.classList.remove('open'); s.innerHTML = '';
  document.documentElement.classList.remove('noscroll');
}
const sheetTop = () => `<div class="sheet-top">${SHEET.fromSearch ? '<button class="link-inline" data-act="dict">‹ Volver a buscar</button>' : ''}<span class="grow"></span><button class="icon-btn sm" data-act="sheetclose" aria-label="Cerrar">${ic('x')}</button></div>`;
async function openWord(raw) {
  const w = normWord(raw); if (!w) return;
  const still = () => SHEET.open && SHEET.mode === 'word' && SHEET.word === w;
  if (SHEET.open) { SHEET.mode = 'word'; $('.sheet').classList.remove('tall'); } else openSheet('', 'word');
  SHEET.word = w;
  setSheet(sheetTop() + wordHeadHTML(w) + '<p class="muted center small">Buscando…</p>');
  try { await loadDict(); } catch (e) {}
  if (!still()) return;
  const r = lookup(w);
  if (r) return setSheet(sheetTop() + wordDetailHTML(r));
  setSheet(sheetTop() + wordHeadHTML(w) + '<p class="muted center small">🌐 No está en el diccionario de la app. Buscando en internet…</p>');
  let found = null;
  try {
    const wk = await wikiLookup(w);
    if (wk && wk.lemma && !wk.trans.length) {
      const lr = lookup(wk.lemma), wk2 = lr ? null : await wikiLookup(wk.lemma);
      const base = lr ? (lr.entry || lr.base) : wk2 && wk2.trans.length ? { w: wk.lemma, es: wk2.trans.join(', '), pos: '' } : null;
      if (base) found = { w, entry: null, base, note: `una forma de “${wk.lemma}”` };
    } else if (wk && wk.trans.length) found = { w, entry: { w, es: wk.trans.join(', '), pos: '' }, base: null, note: '' };
  } catch (e) {}
  if (!still()) return;
  if (found) return setSheet(sheetTop() + wordDetailHTML(found, '<p class="muted small center">🌐 Traducción de Wiktionary (internet).</p>'));
  setSheet(sheetTop() + wordHeadHTML(w) + `<p class="muted center">${navigator.onLine === false ? 'No está en el diccionario de la app. Conéctate a internet para buscarla.' : 'No encontré esta palabra.'}</p>
    <p class="muted small center">Si sabes qué significa, agrégala con tu traducción en Repaso › Tarjetas › Mis tarjetas.</p>`);
}
function openSearch() {
  const html = `<div class="sheet-top"><input id="dq" type="search" placeholder="Busca en inglés o en español…" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="search" value="${esc(dictSearchQ)}"><button class="icon-btn sm" data-act="sheetclose" aria-label="Cerrar">${ic('x')}</button></div><div id="dqres"><p class="muted center small">Cargando el diccionario…</p></div>`;
  if (SHEET.open) { SHEET.mode = 'search'; $('.sheet').classList.add('tall'); setSheet(html); } else openSheet(html, 'search');
  SHEET.word = '';
  loadDict().then(renderSearch, renderSearch);
  setTimeout(() => { const i = $('#dq'); if (i) i.focus(); }, 60);
}
function searchWords(q) {
  const n = deaccent(q.trim()); if (!n || !DICT) return [];
  const app = appEntries(), pool = [...DICT_IX.w.values(), ...[...app.values()].filter(e => !DICT_IX.w.has(e.w))];
  const out = [], seen = new Set(), push = (e, note) => { if (e && !seen.has(e.w)) { seen.add(e.w); out.push({ e, note }); } };
  const r = lookup(n); if (r) { push(r.entry); push(r.base, `“${r.w}” viene de aquí`); }
  pool.filter(e => e.w.startsWith(n)).sort((a, b) => a.w.length - b.w.length).slice(0, 12).forEach(e => push(e));
  const meanings = e => deaccent(e.es).split(/[,;/()·]+/).map(x => x.trim());
  pool.filter(e => meanings(e).includes(n)).forEach(e => push(e));
  pool.filter(e => meanings(e).some(m => m.startsWith(n))).slice(0, 15).forEach(e => push(e));
  if (n.length > 3) pool.filter(e => deaccent(e.es).includes(n)).slice(0, 10).forEach(e => push(e));
  return out.slice(0, 25);
}
function renderSearch() {
  const box = $('#dqres'); if (!box) return;
  const q = dictSearchQ.trim(), n = deaccent(q);
  if (!q) { box.innerHTML = `<p class="muted center small">Escribe una palabra en inglés o en español.${DICT ? ` Hay ${DICT.words.length.toLocaleString('es-CL')} palabras disponibles, también sin internet.` : ''}</p>`; return; }
  const res = searchWords(q), english = /^[a-z' -]+$/i.test(q);
  const sents = n.length < 2 ? [] : appSentences().filter(([en, es]) => tokens(en).some(t => normWord(t) === n) || (n.length > 3 && (deaccent(en).includes(n) || deaccent(es).includes(n)))).slice(0, 4);
  box.innerHTML = (res.length ? `<div class="dq-list">${res.map(({ e, note }) => `<button class="dq-row" data-act="word" data-w="${esc(e.w)}"><b>${esc(e.w)}</b><span class="muted grow">${esc(note ? `${e.es} · ${note}` : e.es)}</span>${S.cards[e.w] ? '<span class="add-btn added">✓</span>' : ''}</button>`).join('')}</div>` : '')
    + (sents.length ? `<span class="label">En tus lecciones, frases y diálogos</span>${sents.map(exampleHTML).join('')}` : '')
    + (!res.length && english ? `<button class="btn ghost wide" data-act="word" data-w="${esc(q)}">🌐 Buscar “${esc(q)}” en internet</button>` : '')
    + (!res.length && !sents.length && !english ? '<p class="muted center small">No encontré esa palabra. Prueba con otra forma, por ejemplo el infinitivo ("comer").</p>' : '');
}
