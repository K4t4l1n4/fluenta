'use strict';
/* Fluenta · Escribir: temas guiados, corrector y la corrección con Claude. */
/* ===== ESCRIBIR: temas guiados con corrección automática =====
   1) Reglas propias (sin internet) para errores típicos de hispanohablantes.
   2) LanguageTool (internet, gratis) para ortografía y más gramática.
   Todas las explicaciones están en español. */
const W_AUX = new Set(['do', 'does', 'did', "don't", "doesn't", "didn't", 'dont', 'doesnt', 'didnt', 'can', 'could', 'will', 'would', 'should', 'must', 'may', 'might', "can't", "won't", "couldn't", "shouldn't", "wouldn't", 'to', 'let', 'make', 'help', 'not']);
const W_MODALS = new Set(['can', 'could', 'will', 'would', 'should', 'must', 'may', 'might', "can't", "won't", "couldn't", "shouldn't", "wouldn't", 'cannot']);
const W_ADV = new Set(['never', 'always', 'usually', 'often', 'sometimes', 'also', 'really', 'just', 'still', 'rarely']);
const W_PERSON = /^(brother|sister|mother|father|mom|mum|dad|friend|boss|husband|wife|son|daughter|cousin|uncle|aunt|grandmother|grandfather|grandma|grandpa|teacher|partner|neighbor|boyfriend|girlfriend|dog|cat|family|baby)$/;
const W_PAST_MARK = /\b(yesterday|ago|last (night|week|weekend|month|year|summer|winter|spring|autumn|fall|time|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|in (19|20)\d\d)\b/i;
const W_CAPS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'january', 'february', 'april', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'english', 'spanish', 'french', 'chile', 'chilean', 'peru', 'argentina', 'mexico', 'spain', 'england', 'santiago'];
const W_AN_EXC = /^(uni|use|usu|eu|one|once|ur)/i, W_H_SILENT = /^(hour|honest|honor|heir)/i;
const cap1 = s => s.charAt(0).toUpperCase() + s.slice(1);
function verbBase(w) {
  const e = DICT_IX.w.get(w);
  if (!e || !/(^|\/)v(\/|$)/.test(e.pos) || W_MODALS.has(w)) return false;
  const v = DICT_IX.verbs[w];
  return !(v && v[0].split('/').includes(w));   /* cut, put, hit…: igual en presente y pasado */
}
function thirdPerson(w) {
  if (w === 'have') return 'has'; if (w === 'be') return 'is'; if (w === 'do') return 'does'; if (w === 'go') return 'goes';
  if (/(s|sh|ch|x|z|o)$/.test(w)) return w + 'es';
  if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ies';
  return w + 's';
}
function pastOf(w, subj) {
  if (w === 'be') return ['i', 'he', 'she', 'it'].includes(subj) ? 'was' : 'were';
  const v = DICT_IX.verbs[w]; if (v) return v[0].split('/')[0];
  if (w.endsWith('e')) return w + 'd';
  if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ied';
  if (/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(w) && w.length <= 4) return w + w.slice(-1) + 'ed';
  return w + 'ed';
}
function baseOfForm(w) {
  const ir = DICT_IX.irr.get(w); if (ir && ir.base !== w) return ir.base;
  const h = DICT_IX.form.get(w) || stemGuess(w);
  return h && h !== w && verbBase(h) ? h : null;
}
const W_STATIVE = /^(like|love|hate|think|know|want|need|hope|believe|prefer|mean|understand|remember|recommend|feel)$/;
/* pastCtx: la pregunta habla del pasado ("What did you do…?"), así que la respuesta también */
function localWritingRules(text, pastCtx = false) {
  const out = [], toks = [...text.matchAll(/[A-Za-z][A-Za-z']*/g)].map(m => ({ w: m[0], lw: m[0].toLowerCase(), i: m.index }));
  const add = (off, len, right, rule, es, type = 'Gramática') => out.push({ off, len, wrong: text.substr(off, len), right, rule, es, type });
  const span = (a, b) => [toks[a].i, toks[b].i + toks[b].w.length - toks[a].i];
  const used = new Set();
  /* Verbo en presente en una oración que habla del pasado (si no habla de un hábito) */
  let ctx = pastCtx;
  for (const s of text.matchAll(/[^.!?\n]+[.!?]?/g)) {
    const marked = W_PAST_MARK.test(s[0]), present = /\b(every|usually|always|often|sometimes|now|today|tomorrow|next|going to|will)\b/i.test(s[0]);
    if (present) { ctx = false; continue; }
    if (marked) ctx = true;
    if (!ctx) continue;
    const a = s.index, b = a + s[0].length;
    toks.forEach((t, k) => {
      if (t.i < a || t.i >= b || !['i', 'you', 'we', 'they', 'he', 'she'].includes(t.lw) || !toks[k + 1]) return;
      let j = k + 1; if (W_ADV.has(toks[j].lw) && toks[j + 1]) j++;
      const v = toks[j], base = verbBase(v.lw) ? v.lw : (v.lw.endsWith('s') && baseOfForm(v.lw)) || null;
      if (!base || (base === v.lw && !verbBase(v.lw)) || W_AUX.has(v.lw)) return;
      if (!marked && W_STATIVE.test(base)) return;   /* "I think it was fun" puede ser una opinión de hoy */
      const past = pastOf(base, t.lw); used.add(j);
      add(v.i, v.w.length, past, 'past-time', `Estás contando algo que ya pasó, así que el verbo va en pasado: «${past}», no «${v.w}».`, 'Tiempo verbal');
    });
  }
  toks.forEach((t, k) => {
    const n1 = toks[k + 1];
    /* he/she/it (o "my brother", "her mom"…) + verbo sin -s */
    const third = ['he', 'she', 'it'].includes(t.lw) || (W_PERSON.test(t.lw) && toks[k - 1] && /^(my|his|her|your|our|their|the)$/.test(toks[k - 1].lw));
    if (third && n1 && !(toks[k - 1] && W_AUX.has(toks[k - 1].lw))) {
      let j = k + 1; if (W_ADV.has(toks[j].lw) && toks[j + 1]) j++;
      const v = toks[j];
      if (!used.has(j) && verbBase(v.lw)) { used.add(j); add(v.i, v.w.length, thirdPerson(v.lw), 'he-s', `Con he / she / it el verbo lleva -s: «${t.w} ${thirdPerson(v.lw)}», no «${t.w} ${v.w}».`); }
    }
    /* did / didn't / does / doesn't + verbo en pasado o con -s */
    if (/^(did|didn't|didnt|does|doesn't|doesnt|do|don't|dont)$/.test(t.lw) && n1) {
      let j = k + 1; if (/^(you|i|we|they|he|she|it|not)$/.test(toks[j].lw) && toks[j + 1]) j++;
      const v = toks[j], base = baseOfForm(v.lw);
      if (base && !used.has(j) && !/ing$/.test(v.lw)) { used.add(j); add(v.i, v.w.length, base, 'did-base', `Después de «${t.w}» el verbo va en forma normal: «${base}», no «${v.w}».`); }
    }
    /* can / must / will… + verbo con -s, en pasado, o con "to" */
    if (W_MODALS.has(t.lw) && n1) {
      if (n1.lw === 'to' && toks[k + 2] && verbBase(toks[k + 2].lw) && t.lw !== 'ought') add(n1.i, toks[k + 2].i - n1.i, '', 'modal-to', `Después de «${t.w}» no va «to»: «${t.w} ${toks[k + 2].w}».`);
      else { const base = baseOfForm(n1.lw); if (base && !/ing$/.test(n1.lw) && !used.has(k + 1)) { used.add(k + 1); add(n1.i, n1.w.length, base, 'modal-base', `Después de «${t.w}» el verbo va en forma normal: «${t.w} ${base}».`); } }
    }
    /* am / is / are y was / were según la persona: "they is" → "they are" */
    if (n1 && /^(am|is|are|was|were)$/.test(n1.lw) && /^(i|you|we|they|he|she|it)$/.test(t.lw) && !(toks[k - 1] && /^(if|wish)$/.test(toks[k - 1].lw))) {
      const past = /^(was|were)$/.test(n1.lw), ok = t.lw === 'i' ? (past ? 'was' : 'am') : /^(you|we|they)$/.test(t.lw) ? (past ? 'were' : 'are') : (past ? 'was' : 'is');
      if (ok !== n1.lw) { used.add(k + 1); add(n1.i, n1.w.length, ok, 'be-agr', `Con «${t.w}» se usa «${ok}»: «${t.w} ${ok}», no «${t.w} ${n1.w}».`); }
    }
    /* like / want / need… + verbo sin "to": "I like play" → "I like to play" */
    if (/^(like|likes|liked|love|loves|loved|hate|hates|want|wants|wanted|need|needs|needed|decide|decided|try|tries|tried|prefer|prefers)$/.test(t.lw) && n1 && !used.has(k + 1)) {
      const e = DICT_IX.w.get(n1.lw);
      if (e && /^v/.test(e.pos) && verbBase(n1.lw) && !/^(to|be)$/.test(n1.lw)) { used.add(k + 1); add(n1.i, n1.w.length, 'to ' + n1.w, 'verb-to', `Después de «${t.w}» el otro verbo lleva «to»: «${t.w} to ${n1.w}»${/^(like|love|hate)/.test(t.lw) ? ` (también se puede «${t.w} ${n1.lw.replace(/e$/, '')}ing»)` : ''}.`); }
    }
    /* "i" en minúscula */
    if (/^i('m|'ve|'ll|'d)?$/.test(t.w)) add(t.i, 1, 'I', 'i-upper', 'El pronombre «I» (yo) siempre va con mayúscula.', 'Mayúsculas');
    /* días, meses, idiomas y países en minúscula */
    if (W_CAPS.includes(t.w)) add(t.i, t.w.length, cap1(t.w), 'caps', 'En inglés los días, meses, idiomas y países van con mayúscula.', 'Mayúsculas');
    /* a / an */
    if (t.lw === 'a' && n1 && /^[aeiou]/i.test(n1.w) && !W_AN_EXC.test(n1.w)) add(t.i, 1, t.w === 'A' ? 'An' : 'an', 'a-an', 'Antes de un sonido vocal se usa «an»: «an apple», «an hour».');
    if (t.lw === 'an' && n1 && !/^[aeiou]/i.test(n1.w) && !W_H_SILENT.test(n1.w)) add(t.i, 2, t.w === 'An' ? 'A' : 'a', 'a-an', 'Antes de un sonido consonante se usa «a»: «a car», «a house».');
  });
  /* Expresiones típicas que vienen del español */
  const R = [
    [/\b(i|you|we|they|he|she|(?:my|his|her|your|our|their|the) [a-z]+)\s+(have|has)\s+(\d+|[a-z]+(?:-[a-z]+)?)\s+years(?!\s+old)\b/gi, m => { const s = m[1].toLowerCase(), be = s === 'i' ? 'am' : /^(you|we|they)$/.test(s) || /s$/.test(s) ? 'are' : 'is'; return [m.index + m[1].length + 1, m[0].length - m[1].length - 1, `${be} ${m[3]} years old`, 'La edad se dice con «be»: «I am 30 years old», no «I have 30 years».', 'Expresión']; }],
    [/\bthere is\s+(many|several|a lot of|lots of|two|three|four|five|six|seven|eight|nine|ten)\b/gi, m => [m.index, 8, m[0][0] === 'T' ? 'There are' : 'there are', 'Con plural se usa «there are»: «there are many people».', 'Gramática']],
    [/\bpeople\s+(is|was|has)\b/gi, m => [m.index + m[0].length - m[1].length, m[1].length, { is: 'are', was: 'were', has: 'have' }[m[1].toLowerCase()], '«People» es plural: «people are», «people have».', 'Gramática']],
    [/\bexplain\s+me\b/gi, m => [m.index, m[0].length, 'explain to me', '«Explain» lleva «to»: «explain to me».', 'Expresión']],
    [/\bdepends?\s+of\b/gi, m => [m.index, m[0].length, m[0].replace(/of$/i, 'on'), 'En inglés se dice «depend on», no «depend of».', 'Expresión']],
    [/\bmarried\s+with\b/gi, m => [m.index, m[0].length, 'married to', 'Se dice «married to» (casada con).', 'Expresión']],
    [/\bdiscuss(ed)?\s+about\b/gi, m => [m.index, m[0].length, m[0].replace(/\s+about$/i, ''), '«Discuss» no lleva «about»: «discuss the plan».', 'Expresión']],
    [/\blisten(s|ed|ing)?\s+(?!to\b)(music|the radio|songs?|podcasts?|me|him|her|them|us)\b/gi, m => [m.index, m[0].length - m[2].length - 1, m[0].slice(0, m[0].length - m[2].length - 1) + ' to', '«Listen» lleva «to»: «listen to music».', 'Expresión']],
    [/\barrive(s|d)?\s+to\b/gi, m => [m.index, m[0].length, m[0].replace(/to$/i, 'at'), 'Se dice «arrive at» (un lugar) o «arrive in» (una ciudad), no «arrive to».', 'Expresión']],
    [/\bthink\s+in\b/gi, m => [m.index, m[0].length, 'think about', 'Para «pensar en» se dice «think about».', 'Expresión']],
    [/\bsay\s+me\b/gi, m => [m.index, m[0].length, 'tell me', 'Para «decirme» se usa «tell me».', 'Expresión']],
    [/\bin the night\b/gi, m => [m.index, m[0].length, 'at night', 'Se dice «at night» (en la noche).', 'Expresión']],
    [/\bgo(es)?\s+to\s+home\b/gi, m => [m.index, m[0].length, m[0].replace(/\s+to\s+home$/i, ' home'), 'Con «home» no va «to»: «go home».', 'Expresión']]
  ];
  const calques = [];
  R.forEach(([re, f]) => { for (const m of text.matchAll(re)) { const [off, len, right, es, type] = f(m); calques.push({ off, len, wrong: text.substr(off, len), right, rule: 'es-' + re.source.slice(2, 14), es, type }); } });
  return [...calques, ...out];   /* primero las expresiones del español: son las más seguras */
}
const LT_ES = {
  MORFOLOGIK_RULE_EN_US: e => e.right ? `Se escribe «${e.right}»${gloss(e.right) ? ` (${gloss(e.right)})` : ''}.` : 'Esta palabra está mal escrita.',
  EN_CONTRACTION_SPELLING: e => `La contracción se escribe con apóstrofo: «${e.right}».`,
  UPPERCASE_SENTENCE_START: () => 'La oración empieza con mayúscula.',
  I_LOWERCASE: () => 'El pronombre «I» (yo) siempre va con mayúscula.',
  EN_A_VS_AN: () => 'Usa «an» antes de un sonido vocal (an apple) y «a» antes de un sonido consonante (a car).',
  I_AM_VB: () => 'Después de «am / is / are» no va otro verbo en forma normal: «I agree», no «I am agree».',
  SHORT_COMPARATIVES: e => `Con adjetivos cortos el comparativo termina en -er: «${e.right}», no «${e.wrong}».`,
  OBJECTIVE_CASE: () => 'Después de un verbo o una preposición se usa me, you, him, her, us, them: «with them», no «with they».',
  HE_VERB_AGR: () => 'Con he / she / it el verbo lleva -s o cambia: «he has», «she likes».',
  DID_BASEFORM: () => 'Después de «did / didn\'t» el verbo va en forma normal: «didn\'t go».',
  MD_BASEFORM: () => 'Después de can / must / should / will… el verbo va en forma normal: «can go».',
  HAVE_PART_AGREEMENT: () => 'Después de have / has va el participio: «have gone», «has seen».',
  BEEN_PART_AGREEMENT: () => 'Después de «been» va el participio o la forma -ing.',
  ENGLISH_WORD_REPEAT_RULE: () => 'Repetiste la misma palabra dos veces.',
  COMMA_PARENTHESIS_WHITESPACE: () => 'No va espacio antes de la coma o el punto, y sí va uno después.',
  WHITESPACE_RULE: () => 'Hay espacios de más.',
  DOUBLE_PUNCTUATION: () => 'Hay un signo repetido.',
  EN_SPECIFIC_CASE: () => 'Este nombre va con mayúscula.',
  YOUR_YOU_RE: () => '«your» = tu; «you\'re» = you are (tú eres / estás).',
  TO_TOO: () => '«too» = también o demasiado; «to» = a, para.',
  THEN_THAN: () => 'Para comparar se usa «than» (que); «then» significa «luego».',
  THAN_THEN: () => '«then» significa «luego»; «than» se usa para comparar.',
  PEOPLE_VBZ: () => '«People» es plural: «people are».',
  MANY_NN: () => '«many» va con plurales (many friends); «much» con cosas que no se cuentan (much water).',
  MUCH_COUNTABLE: () => '«much» va con cosas que no se cuentan (much water); con plurales usa «many».',
  EVERY_EACH_SINGULAR: () => '«every / each» va con singular: «every day».',
  A_PLURAL: () => 'No uses «a / an» con palabras en plural.',
  CD_NN: () => 'Después de un número mayor que uno, el sustantivo va en plural.'
};
const LT_CAT = {
  TYPOS: ['Ortografía', 'Revisa cómo se escribe esta palabra.'], GRAMMAR: ['Gramática', 'La forma de esta palabra no calza con el resto de la oración.'],
  CASING: ['Mayúsculas', 'Revisa si va con mayúscula o minúscula.'], PUNCTUATION: ['Puntuación', 'Revisa la coma o el punto.'],
  CONFUSED_WORDS: ['Palabra confundida', 'Esta palabra se parece a otra, pero significa algo distinto.'], COLLOCATIONS: ['Expresión', 'En inglés esto se dice de otra forma.'],
  NONSTANDARD_PHRASES: ['Expresión', 'En inglés esto se dice de otra forma.'], SEMANTICS: ['Sentido', 'Revisa el sentido de esta parte.'], MISC: ['Revisa', 'Revisa esta parte.']
};
async function languageTool(text) {
  const body = new URLSearchParams({ text, language: 'en-US', motherTongue: 'es' });
  const r = await fetch('https://api.languagetool.org/v2/check', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const d = await r.json();
  const OBJ = { i: 'me', he: 'him', she: 'her', we: 'us', they: 'them' };
  /* Se omiten las sugerencias de estilo y la coma opcional antes de "and / but" */
  return d.matches.filter(m => LT_CAT[m.rule.category.id] && m.rule.issueType !== 'style' && !/COMMA_COMPOUND/.test(m.rule.id)).map(m => {
    const e = { off: m.offset, len: m.length, wrong: text.substr(m.offset, m.length), right: (m.replacements[0] || {}).value || '', rule: m.rule.id };
    /* "with they" → "with them" (LanguageTool a veces propone otro pronombre) */
    if (m.rule.id === 'OBJECTIVE_CASE') e.right = e.wrong.replace(/\b(i|he|she|we|they)$/i, p => OBJ[p.toLowerCase()]);
    const [type, generic] = LT_CAT[m.rule.category.id];
    e.type = type;
    e.es = LT_ES[m.rule.id] ? LT_ES[m.rule.id](e) : generic;
    if (e.right && e.right !== e.wrong && e.right.toLowerCase() === e.wrong.toLowerCase()) {   /* solo cambia la mayúscula */
      e.type = 'Mayúsculas';
      if (W_CAPS.includes(e.wrong.toLowerCase())) e.es = `En inglés los días, meses, idiomas y países van con mayúscula: «${e.right}».`;
      else if (m.rule.id.startsWith('MORFOLOGIK')) e.es = `Va con mayúscula: «${e.right}».`;
    }
    return e;
  }).filter(e => !(e.rule.startsWith('MORFOLOGIK') && /^[A-Z]/.test(e.wrong) && e.off > 0));   /* nombres propios */
}
async function checkWriting(text, question = '') {
  try { await loadDict(); } catch (e) {}
  const pastQ = /\b(did|was|were)\b/i.test(question) || W_PAST_MARK.test(question);
  const local = DICT ? localWritingRules(text, pastQ) : [];
  let lt = [], online = true;
  try { lt = await languageTool(text); } catch (e) { online = false; }
  /* Primero lo que ya te corrigió Claude, luego mis reglas (explican mejor en español); LanguageTool agrega lo que ellas no ven */
  const hits = claudeHits(text);
  const all = [], overlaps = a => all.some(b => a.off < b.off + b.len && b.off < a.off + a.len);
  [...hits, ...local, ...lt].forEach(e => { if (!overlaps(e)) all.push(e); });
  return { errors: online || DICT || hits.length ? all.sort((a, b) => a.off - b.off) : null, online };
}
function correctedText(text, errors) {
  let out = text;
  [...errors].sort((a, b) => b.off - a.off).forEach(e => { out = out.slice(0, e.off) + e.right + out.slice(e.off + e.len); });
  return out.replace(/ {2,}/g, ' ');
}
function markedHTML(text, errors) {
  let html = '', pos = 0;
  errors.forEach(e => { html += esc(text.slice(pos, e.off)) + `<del>${esc(e.wrong)}</del>${e.right ? `<ins>${esc(e.right)}</ins>` : ''}`; pos = e.off + e.len; });
  return html + esc(text.slice(pos));
}
function fixHTML(m) {
  if (m.status === 'checking') return '<div class="wfix"><p class="muted small center">🔎 Revisando tu texto…</p></div>';
  if (!m.errors) return `<div class="wfix"><p class="err">⚠️ No pude revisar tu texto. Quedó guardado.</p><button class="btn ghost wide" data-act="wretry" data-k="${m.k}">Revisar otra vez</button></div>`;
  return `<div class="wfix">${m.errors.length ? `<div class="wfix-text">${markedHTML(m.text, m.errors)}</div>
      ${m.errors.map(e => `<div class="wfix-item"><span class="tag-type">${esc(e.type)}</span><div><del>${esc(e.wrong)}</del> → <ins>${esc(e.right || '(quitar)')}</ins></div><div class="small">${esc(e.es)}</div>${e.rule === 'CLAUDE' ? '<div class="small cl-note">✨ Claude ya te había corregido esto</div>' : ''}${tenseLink(e)}</div>`).join('')}
      <div class="wfix-ok"><span class="label">Texto corregido</span><div>${tapText(correctedText(m.text, m.errors))}</div></div>`
    : '<p class="wfix-perfect">✅ ¡Muy bien! No encontré errores.</p>'}
    ${m.online === false ? '<p class="muted small">📴 Sin internet revisé solo lo básico. Con conexión la corrección es más completa.</p>' : ''}</div>`;
}
/* Guarda el texto y suma sus errores al historial (si se revisa de nuevo, reemplaza los anteriores) */
function saveWriting(entry, errors, online) {
  const wr = S.writing || (S.writing = { texts: [], errs: {} });
  const key = e => `${e.wrong.toLowerCase()} → ${(e.right || '').toLowerCase()}`;
  (entry.errors || []).forEach(e => { const it = wr.errs[key(e)]; if (it && --it.n <= 0 && !it.claude) delete wr.errs[key(e)]; });
  entry.errors = errors ? errors.map(({ wrong, right, type, es, rule }) => ({ wrong, right, type, es, rule })) : null;
  entry.partial = !!errors && online === false;
  if (!wr.texts.includes(entry)) wr.texts.push(entry);
  if (wr.texts.length > 200) wr.texts.splice(0, wr.texts.length - 200);
  if (errors) {
    errors.forEach(e => {
      const it = wr.errs[key(e)] || (wr.errs[key(e)] = { wrong: e.wrong, right: e.right, type: e.type, es: e.es, rule: e.rule, n: 0, last: 0 });
      it.n++; it.last = Date.now();
    });
    if (!entry.counted) { entry.counted = true; trackType('write', !errors.length); }
  }
  save();
}
const wordCount = s => (s.match(/[A-Za-z']+/g) || []).length;
let W = null;
function startWrite(id) {
  const topic = WRITE_TOPICS.find(t => t.id === id); if (!topic) return;
  W = { topic, qi: 0, log: [], showEs: {}, draft: '', busy: false, done: false };
  W.log.push({ who: 'app', en: topic.questions[0][0], es: topic.questions[0][1] });
  document.body.classList.add('focus'); window.scrollTo(0, 0); renderWriteChat();
}
function renderWriteChat() {
  const t = W.topic, last = W.log[W.log.length - 1];
  const chat = W.log.map((m, i) => m.who === 'app'
    ? `<div class="bubble npc"><div class="row gap-s">${sayBtn(m.en, 'sm')}<span class="grow">${tapText(m.en)}</span></div><button class="tr" data-act="wtr" data-i="${i}">${W.showEs[i] ? esc(m.es) : 'Ver traducción'}</button></div>`
    : `<div class="bubble me wr">${esc(m.text)}</div>${fixHTML(m)}`).join('');
  const composer = W.done ? `<div class="end-card"><b>🎉 ¡Terminaste este tema!</b><p class="muted small">Respondiste todas las preguntas.</p><button class="btn primary wide" data-act="wend">Ver resumen</button></div>`
    : `<div class="composer card"><textarea id="wtext" rows="4" placeholder="Escribe tu respuesta en inglés…" autocorrect="off" autocapitalize="sentences" spellcheck="false" autocomplete="off" ${W.busy ? 'disabled' : ''}>${esc(W.draft)}</textarea>
      <div class="row between"><small class="muted" id="wcount">${wordCount(W.draft)} palabras</small><button class="btn primary" data-act="wsend" ${W.busy ? 'disabled' : ''}>${W.busy ? 'Revisando…' : 'Revisar ✓'}</button></div></div>
      ${t.words.length && W.qi === 0 ? `<p class="label">Palabras útiles</p><div class="word-chips left">${t.words.map(([en, es]) => `<button class="word-chip" data-act="say" data-t="${esc(en)}"><b>${esc(en)}</b><small>${esc(es)}</small></button>`).join('')}</div>` : ''}
      <div class="row gap" style="margin-top:12px">${t.id === 'free' || last.who !== 'app' ? '' : `<button class="btn ghost grow" data-act="wskip">Saltar pregunta</button>`}<button class="btn ghost grow" data-act="wend">Terminar</button></div>`;
  view().innerHTML = `<div class="lesson-top"><button class="icon-btn" data-act="quit" aria-label="Salir">${ic('x')}</button><div class="grow"><b>${t.icon} ${esc(t.title)}</b><div class="bar"><i style="width:${W.done ? 100 : pct(W.qi, t.questions.length)}%"></i></div></div>${dictBtn('sm')}</div>
    ${W.log.length === 1 ? '<p class="muted small center">Responde en inglés con frases completas. La app te corrige y te explica cada error en español.</p>' : ''}
    ${W.log.length === 1 && t.tense ? `<p class="small center tz-hint">💡 Este tema es para practicar el <b>${esc(tenseName(t.tense).split(':')[0].toLowerCase())}</b>. <button class="link-inline" data-act="tensesheet" data-id="${t.tense}">Ver cómo se forma</button></p>` : ''}
    <div class="chat">${chat}</div><div class="dlg-input">${composer}</div>`;
}
async function sendWriting() {
  if (!W || W.busy) return;
  const text = W.draft.trim();
  if (wordCount(text) < 2) { toast('Escribe al menos una frase corta en inglés'); return; }
  const q = [...W.log].reverse().find(m => m.who === 'app');
  const entry = { t: Date.now(), topic: W.topic.id, q: q ? q.en : '', text, words: wordCount(text) };
  const m = { who: 'me', text, status: 'checking', k: W.log.length, entry };
  W.log.push(m); W.draft = ''; W.busy = true; renderWriteChat();
  setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50);
  const res = await checkWriting(text, entry.q);
  saveWriting(entry, res.errors, res.online);
  if (!W || !W.log.includes(m)) return;
  m.status = 'done'; m.errors = res.errors; m.online = res.online; W.busy = false;
  addXp(res.errors && !res.errors.length ? 5 : 3);
  if (res.errors && !res.errors.length) sfx('ok');
  nextWriteQuestion(false);
}
function nextWriteQuestion(skip) {
  const t = W.topic;
  if (t.id !== 'free') {
    W.qi++;
    if (W.qi < t.questions.length) { const [en, es] = t.questions[W.qi]; W.log.push({ who: 'app', en, es }); speak(en); }
    else W.done = true;
  }
  renderWriteChat();
  setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50);
}
function finishWrite() {
  const msgs = W.log.filter(m => m.who === 'me' && m.errors), errs = msgs.flatMap(m => m.errors);
  const words = msgs.reduce((a, m) => a + wordCount(m.text), 0), perfect = msgs.filter(m => !m.errors.length).length;
  const xp = msgs.length ? 5 : 0, t = W.topic;
  const ids = W.log.filter(m => m.who === 'me').map(m => m.entry.t).join(',');
  if (xp) addXp(xp);
  W = null;
  if (!msgs.length) { go(tab); return; }
  view().innerHTML = `<div class="summary"><div class="emoji">✍️</div><h1>¡Bien escrito!</h1>
    <div class="sum-stats"><div class="stat"><b>${msgs.length}</b><small>Respuestas</small></div><div class="stat"><b>${words}</b><small>Palabras</small></div><div class="stat"><b>${perfect}/${msgs.length}</b><small>Sin errores</small></div></div></div>
    ${errs.length ? `<section class="card"><h2>📝 Para repasar</h2>${errs.map(wfixItemHTML).join('')}</section>`
      : '<section class="card center"><b>🌟 ¡No tuviste errores en este tema!</b></section>'}
    <section class="card"><h2>✨ ¿Una corrección más completa?</h2><p class="muted small">Copia lo que escribiste, pégalo en Claude y trae sus mejoras de vuelta a Fluenta.</p>
      <button class="btn ghost wide" data-act="clcopy" data-ids="${ids}">📋 Copiar para Claude</button></section>
    <p class="muted small center">Tus errores quedaron en Progreso y en el archivo que exportas.</p>
    <button class="btn primary wide" data-act="tab" data-tab="${tab}">Continuar</button>`;
  celebrate();
}
function renderWriteTab() {
  const wr = S.writing || { texts: [], errs: {} }, texts = wr.texts || [];
  const words = texts.reduce((a, e) => a + (e.words || 0), 0), pending = texts.filter(e => !e.errors || e.partial).length;
  const unrev = Math.min(12, texts.filter(e => !e.claude).length);
  const tagHTML = errs => errs ? `<span class="score-tag ${errs.length ? 'bad' : 'good'}">${errs.length ? errs.length + ' ✗' : '✓'}</span>` : '<span class="score-tag">Sin revisar</span>';
  return topBar('Escribir', closeBtn()) + `
    <p class="muted small">Elige un tema y responde en inglés. La app corrige tu ortografía y tu gramática, y te explica cada error en español.</p>
    ${texts.length ? `<div class="stats"><div class="stat">📝<b>${texts.length}</b><small>Textos</small></div><div class="stat">🔤<b>${words}</b><small>Palabras</small></div><div class="stat">🎯<b>${Object.keys(wr.errs || {}).length}</b><small>Errores distintos</small></div></div>` : ''}
    <div class="grid2">${WRITE_TOPICS.map(t => `<button class="sec-card topic" data-act="write" data-id="${t.id}"><span class="topic-icon">${t.icon}</span><b>${esc(t.title)}</b><small>${t.id === 'free' ? 'Tú eliges el tema' : `${t.questions.length} preguntas`}</small>${t.tense ? `<small class="tz-topic">${esc(tenseName(t.tense).split(':')[0])}</small>` : ''}</button>`).join('')}</div>
    <section class="card"><h2>✨ Corrección con Claude</h2>
      <p class="muted small">Claude corrige mucho más que la app. Copia tus textos, pégalos en Claude y trae sus mejoras de vuelta: se vuelven lección, tarjetas y práctica de pronunciación.</p>
      ${unrev ? `<button class="btn primary wide" data-act="clcopy" data-ids="new">📋 Copiar ${unrev === 1 ? 'tu último texto' : `tus ${unrev} textos nuevos`} para Claude</button>` : ''}
      <button class="btn ghost wide" data-act="clpaste">📥 Pegar mejoras de Claude</button>
      <button class="link" data-act="clhelp">¿Cómo configuro Claude?</button></section>
    ${texts.length ? `<section class="card"><h2>🕘 Tus últimos textos</h2>${texts.slice(-8).reverse().map(e => { const tp = WRITE_TOPICS.find(x => x.id === e.topic); return `<button class="word-row as-btn" data-act="wview" data-t="${e.t}"><span>${tp ? tp.icon : '✍️'}</span><div class="grow"><span class="small">${esc(e.text.length > 70 ? e.text.slice(0, 70) + '…' : e.text)}</span><span class="muted small block">${new Date(e.t).toLocaleDateString('es-CL')}${tp ? ' · ' + esc(tp.title) : ''}${e.claude ? ' · ✨ Claude' : ''}</span></div>${tagHTML(e.claude ? e.claude.errors : e.errors)}</button>`; }).join('')}
      ${pending ? `<button class="btn ghost wide" data-act="wpending">Revisar ${pending} ${pending === 1 ? 'texto pendiente' : 'textos pendientes'}</button>` : ''}</section>` : ''}`;
}
function viewWriting(t) {
  const e = ((S.writing || {}).texts || []).find(x => String(x.t) === String(t)); if (!e) return;
  const tp = WRITE_TOPICS.find(x => x.id === e.topic), claudeFound = e.claude && e.claude.errors.length;   /* si Claude encontró errores, no se muestra el «¡Muy bien!» de la app */
  openSheet(`<div class="sheet-top"><b class="grow">${tp ? tp.icon + ' ' + esc(tp.title) : '✍️ Texto'}</b><button class="icon-btn sm" data-act="sheetclose" aria-label="Cerrar">${ic('x')}</button></div>
    ${e.q ? `<p class="muted small">${tapText(e.q)}</p>` : ''}<div class="bubble me wr" style="max-width:100%">${esc(e.text)}</div>${claudeFound && e.errors && !e.errors.length ? '' : fixHTML({ text: e.text, errors: e.errors, status: 'done', k: -1 })}
    ${e.claude ? `<div class="cl-review"><span class="label">✨ Revisado por Claude · ${new Date(e.claude.t).toLocaleDateString('es-CL')}</span>${e.claude.errors.length ? e.claude.errors.map(wfixItemHTML).join('') : '<p class="wfix-perfect">✅ Claude no encontró errores en este texto.</p>'}</div>` : ''}
    <button class="btn ghost wide" data-act="clcopy" data-ids="${e.t}">📋 Copiar para Claude</button>`, 'word');
  SHEET.word = '';
}
async function reviewPending() {
  const list = ((S.writing || {}).texts || []).filter(e => !e.errors || e.partial);
  if (!list.length) return;
  toast('🔎 Revisando…');
  let ok = 0;
  for (const e of list) { const r = await checkWriting(e.text, e.q); if (!r.online) continue; saveWriting(e, r.errors, true); ok++; }
  toast(ok ? `✅ Revisé ${ok} ${ok === 1 ? 'texto' : 'textos'}` : '📴 Necesitas internet para revisar');
  if (tab === 'write' && !W) render();
}

/* ===== Corrección con Claude: copias tus textos, Claude te corrige y pegas sus mejoras =====
   La app no se conecta a tu cuenta: tú copias y pegas. Las mejoras vuelven como un bloque JSON. */
const CLAUDE_RULES = [
  'Eres mi profesor de inglés. Hablo español (de Chile) y estoy aprendiendo inglés con mi app Fluenta. Te voy a pegar textos que escribí en inglés.',
  '',
  'Para cada texto:',
  '1. Explícame en español cada error: lo que escribí, cómo va bien y por qué, con palabras simples.',
  '2. Muéstrame el texto corregido y una versión más natural, como lo diría alguien nativo.',
  '3. Si no tiene errores, dímelo y dame igual una versión más natural.',
  '',
  'Al final de tu respuesta agrega siempre un bloque de código json con el título «Para Fluenta», para copiarlo y pegarlo en mi app. Usa exactamente este formato:',
  '```json',
  '{"app":"fluenta","kind":"claude","v":1,"texts":["id"],"errors":[{"wrong":"","right":"","type":"","es":"","always":false,"tense":""}],"sentences":[["inglés","español"]],"words":[["inglés","español"]],"tip":""}',
  '```',
  'Reglas del bloque:',
  '- texts: los id de los textos que revisaste (van entre corchetes antes de cada texto, por ejemplo [lq3x9a]).',
  '- errors: un objeto por error. wrong: copia exacto lo que yo escribí, solo la palabra o las pocas palabras con el error. right: cómo va bien (vacío si hay que quitarlo). type: Gramática, Ortografía, Vocabulario, Puntuación, Mayúsculas o Expresión. es: la explicación en español, en una o dos frases cortas. always: true solo si eso está mal en cualquier frase (por ejemplo una palabra mal escrita o "more better"); false si depende de la frase. tense: si el error es de tiempo verbal, el tiempo que va: pres (presente simple), prog (presente continuo), past (pasado simple), pastprog (pasado continuo), fut (futuro) o perf (presente perfecto); si no, déjalo vacío.',
  '- sentences: hasta 8 frases en inglés, corregidas o más naturales, basadas en lo que escribí, con su traducción.',
  '- words: hasta 8 palabras o expresiones nuevas que me sirvan para estos temas, con su traducción.',
  '- tip: un consejo corto en español para mi próximo texto.',
  '- Solo JSON válido: comillas dobles, sin comentarios y sin texto extra dentro del bloque.'
].join('\n');
const textId = e => e.t.toString(36);
const sheetHead = t => `<div class="sheet-top"><b class="grow">${t}</b><button class="icon-btn sm" data-act="sheetclose" aria-label="Cerrar">${ic('x')}</button></div>`;
const wfixItemHTML = e => `<div class="wfix-item"><span class="tag-type">${esc(e.type)}</span><div><del>${esc(e.wrong)}</del> → <ins>${esc(e.right || '(quitar)')}</ins></div><div class="small">${esc(e.es)}</div>${tenseLink(e)}</div>`;
const claudeSentences = () => uniqBy(S.packs.filter(p => p.claude).flatMap(p => p.sentences), s => s[0].toLowerCase()).filter(s => tokens(s[0]).length <= 14);
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (e) {}
  /* Respaldo para navegadores sin acceso al portapapeles */
  const ta = document.createElement('textarea');
  ta.value = text; ta.readOnly = true; ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
  document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
  ta.remove(); return ok;
}
/* "new" = los textos que Claude aún no revisa; si no, los textos con esas fechas (t) */
function claudeTexts(ids) {
  const texts = (S.writing && S.writing.texts) || [];
  if (ids === 'new') return texts.filter(e => !e.claude).slice(-12);
  const set = new Set(String(ids).split(','));
  return texts.filter(e => set.has(String(e.t)));
}
function claudeCopyText(list) {
  return CLAUDE_RULES + '\n\nMis textos:\n\n' + list.map(e => {
    const tp = WRITE_TOPICS.find(x => x.id === e.topic);
    return `[${textId(e)}] Tema: ${tp ? tp.title : 'Libre'}${e.q ? `\nPregunta: ${e.q}` : ''}\nMi respuesta: ${e.text}`;
  }).join('\n\n');
}
async function copyForClaude(ids) {
  const list = claudeTexts(ids);
  if (!list.length) { toast('No hay textos para copiar'); return; }
  const text = claudeCopyText(list);
  if (!(await copyText(text))) {
    openSheet(`${sheetHead('📋 Copia este texto')}<p class="muted small">Mantén presionado el cuadro, elige «Seleccionar todo» y luego «Copiar».</p><textarea readonly rows="8">${esc(text)}</textarea>`, 'claude');
    return;
  }
  openSheet(`${sheetHead('📋 ¡Copiado!')}<p>Copié ${list.length === 1 ? 'tu texto' : `tus ${list.length} textos`} con las instrucciones para Claude.</p>
    <ol class="cl-steps"><li>Abre Claude y pégalo en un chat nuevo (o dentro de tu proyecto «Fluenta · Profesor»).</li><li>Al final de su respuesta, toca <b>Copiar</b> en el bloque «Para Fluenta».</li><li>Vuelve aquí y toca <b>📥 Pegar mejoras de Claude</b>.</li></ol>
    <a class="btn primary wide" href="https://claude.ai/new" target="_blank" rel="noopener">Abrir Claude</a>
    <button class="btn ghost wide" data-act="clpaste">📥 Ya tengo las mejoras</button>`, 'claude');
}
function claudeHelp() {
  openSheet(`${sheetHead('✨ Cómo configuro Claude')}
    <p class="muted small">Se hace una sola vez: creas un proyecto en Claude con las instrucciones de Fluenta. Así tus correcciones quedan juntas y Claude siempre te responde igual.</p>
    <ol class="cl-steps"><li>En Claude, entra a <b>Proyectos</b> y crea uno nuevo llamado <b>Fluenta · Profesor</b>.</li>
      <li>Toca el botón de abajo y pega el texto en las <b>instrucciones del proyecto</b>.</li>
      <li>Cuando quieras corregir, toca <b>📋 Copiar para Claude</b> aquí y pégalo en un chat nuevo del proyecto.</li>
      <li>Claude te corrige y al final te da el bloque <b>«Para Fluenta»</b>. Cópialo y tráelo con <b>📥 Pegar mejoras de Claude</b>.</li></ol>
    <button class="btn primary wide" data-act="clproj">📋 Copiar instrucciones del proyecto</button>
    <a class="btn ghost wide" href="https://claude.ai/projects" target="_blank" rel="noopener">Abrir Claude</a>
    <p class="muted small" style="margin-top:12px">Si no quieres crear el proyecto, igual funciona: lo que copias desde Fluenta ya trae las instrucciones. Usa tu plan de Claude, sin costo extra.</p>`, 'claude');
}
/* Busca el bloque «Para Fluenta» aunque pegues la respuesta completa de Claude */
function parseClaude(raw) {
  const s = String(raw || '');
  const blocks = [...s.matchAll(/```[a-z]*\s*([\s\S]*?)```/gi)].map(m => m[1]).filter(x => /fluenta/.test(x));
  const a = s.search(/\{\s*"app"/), b = s.lastIndexOf('}'), f = s.indexOf('{');
  const tries = [...blocks, a >= 0 && b > a ? s.slice(a, b + 1) : '', f >= 0 && b > f ? s.slice(f, b + 1) : ''].filter(Boolean);
  let d = null;
  for (const t of [...tries, ...tries.map(t => t.replace(/[“”]/g, '"'))]) { try { d = JSON.parse(t); break; } catch (e) {} }
  if (!d || typeof d !== 'object') return null;
  if (d.app === 'fluenta' && d.kind === 'pack') return { pack: d };   /* un refuerzo de lección también sirve */
  const str = (v, n) => typeof v === 'string' ? v.trim().slice(0, n) : '';
  const pairs = (v, n) => validPairs(v).slice(0, n).map(([en, es]) => [en.slice(0, 200), es.slice(0, 200)]);
  const errors = (Array.isArray(d.errors) ? d.errors : []).filter(e => e && typeof e === 'object')
    .map(e => ({ wrong: str(e.wrong, 80), right: str(e.right, 120), type: str(e.type, 24) || 'Revisa', es: str(e.es, 300) || 'Claude lo corrigió así.', always: typeof e.always === 'boolean' ? e.always : undefined, tense: TENSE_MAP[e.tense] ? e.tense : undefined }))
    .filter(e => e.wrong && e.wrong !== e.right);
  const out = {
    errors: uniqBy(errors, e => `${e.wrong.toLowerCase()} → ${e.right.toLowerCase()}`), sentences: pairs(d.sentences, 12), words: pairs(d.words, 12),
    texts: (Array.isArray(d.texts) ? d.texts : []).map(x => String(x).replace(/[^a-z0-9]/gi, '').toLowerCase()).filter(Boolean), tip: str(d.tip, 400)
  };
  return out.errors.length || out.sentences.length || out.words.length || out.texts.length ? out : null;
}
const claudeCards = d => [...d.words, ...d.sentences.filter(s => tokens(s[0]).length <= 6)].filter(([en]) => !S.cards[en]);
/* Guarda las mejoras: errores → Repaso y Progreso; frases y palabras → lección, tarjetas y pronunciación */
function applyClaude(d, toCards) {
  const wr = S.writing || (S.writing = { texts: [], errs: {} }), now = Date.now();
  const key = e => `${e.wrong.toLowerCase()} → ${e.right.toLowerCase()}`;
  d.errors.forEach(e => {
    const it = wr.errs[key(e)];
    /* Si la app ya lo había encontrado, se queda con la explicación de Claude (sin contarlo dos veces) */
    if (it) Object.assign(it, { type: e.type, es: e.es, claude: true }, e.always != null ? { always: e.always } : {}, e.tense ? { tense: e.tense } : {});
    else wr.errs[key(e)] = { wrong: e.wrong, right: e.right, type: e.type, es: e.es, n: 1, last: now, claude: true, always: e.always, tense: e.tense };
  });
  /* Textos revisados: los que Claude nombró; si no los nombró, los recientes donde aparece algún error */
  const ids = new Set(d.texts), listed = wr.texts.filter(t => ids.has(textId(t)));
  let marked = 0;
  (listed.length ? listed : wr.texts.slice(-15)).forEach(t => {
    const errs = d.errors.filter(e => t.text.toLowerCase().includes(e.wrong.toLowerCase()));
    if (!listed.includes(t) && !errs.length) return;
    t.claude = { t: now, errors: errs.map(({ wrong, right, type, es, tense }) => ({ wrong, right, type, es, tense })) }; marked++;
  });
  /* Lección con tus frases corregidas, palabras nuevas y tus errores para corregir */
  const fixes = d.errors.filter(e => e.right && e.wrong.toLowerCase() !== e.right.toLowerCase()).slice(0, 6).map(e => ({ key: key(e), wrong: e.wrong, right: e.right, es: e.es }));
  let pack = null;
  if (d.sentences.length || d.words.length || fixes.length) {
    pack = { id: 'pack-claude-' + hash(JSON.stringify([d.errors, d.sentences, d.words])).toString(36), title: 'Mejoras de Claude', icon: '✨',
      note: [new Date(now).toLocaleDateString('es-CL'), d.sentences.length && `${d.sentences.length} frases`, d.words.length && `${d.words.length} palabras`, fixes.length && `${fixes.length} errores`].filter(Boolean).join(' · '), words: d.words, sentences: d.sentences, fixes, focus: true, claude: true,
      tip: d.tip || 'Esta lección se armó con lo que te corrigió Claude: tus frases corregidas, palabras nuevas y tus errores para que los corrijas tú.' };
    S.packs = S.packs.filter(p => p.id !== pack.id); S.packs.unshift(pack);
    const old = S.packs.filter(p => p.claude).slice(8); S.packs = S.packs.filter(p => !old.includes(p));
  }
  let cards = 0;
  if (toCards) claudeCards(d).forEach(([en, es]) => { S.cards[en] = { en, es, box: 1, due: 0, custom: true, claude: true }; cards++; });
  save();
  return { errors: d.errors.length, sentences: d.sentences.length, words: d.words.length, texts: marked, pack, cards, tip: d.tip };
}
const newCL = () => ({ draft: '', data: null, cards: true });
let CL = newCL();
function renderClaude() {
  return topBar('Mejoras de Claude', closeBtn()) + `
    <p class="muted small">En Claude, toca <b>Copiar</b> en el bloque «Para Fluenta» y pégalo aquí. La app guarda tus errores y arma una lección, tarjetas y práctica de pronunciación con tus frases.</p>
    <button class="btn primary wide" data-act="clread">📋 Pegar lo que copiaste</button>
    <textarea id="clIn" class="cl-in" rows="5" placeholder="…o mantén presionado aquí y elige «Pegar»" autocorrect="off" autocapitalize="off" spellcheck="false" autocomplete="off">${esc(CL.draft)}</textarea>
    <div id="clPrev">${claudePreviewHTML()}</div>
    <button class="link" data-act="clhelp">¿Cómo configuro Claude?</button>`;
}
function claudePreviewHTML() {
  const d = CL.data;
  if (!d) return CL.draft.trim() ? '<p class="err">⚠️ No encuentro el bloque «Para Fluenta». Copia el bloque completo, desde la primera { hasta la última }.</p>' : '';
  if (d.pack) return `<section class="card"><b>✨ Encontré un refuerzo de lección</b><p class="muted small">${esc(d.pack.title || 'Refuerzo de Claude')}</p><button class="btn primary wide" data-act="clsave">Guardar refuerzo</button></section>`;
  const n = claudeCards(d).length, num = (v, one, many) => `<b>${v}</b> ${v === 1 ? one : many}`;
  return `<section class="card"><span class="label">Encontré</span>
    <p>${[num(d.errors.length, 'error', 'errores'), num(d.sentences.length, 'frase', 'frases'), num(d.words.length, 'palabra', 'palabras')].join(' · ')}</p>
    ${d.errors.slice(0, 3).map(wfixItemHTML).join('')}${d.errors.length > 3 ? `<p class="muted small">…y ${d.errors.length - 3} más.</p>` : ''}
    ${n ? `<div class="field">Agregar a mis tarjetas (${n} ${n === 1 ? 'nueva' : 'nuevas'})<div class="seg mini"><button class="${CL.cards ? 'on' : ''}" data-act="clcards" data-v="1">🃏 Sí</button><button class="${CL.cards ? '' : 'on'}" data-act="clcards" data-v="0">No</button></div></div>` : ''}
    <button class="btn primary wide" data-act="clsave">✨ Guardar mejoras</button></section>`;
}
function claudeDone(r) {
  addXp(5);
  const row = (i, html) => `<div class="word-row"><span>${i}</span><div class="grow small">${html}</div></div>`;
  view().innerHTML = `<div class="summary"><div class="emoji">✨</div><h1>¡Mejoras guardadas!</h1>
    <div class="sum-stats"><div class="stat"><b>${r.errors}</b><small>Errores</small></div><div class="stat"><b>${r.sentences}</b><small>Frases</small></div><div class="stat"><b>${r.words}</b><small>Palabras</small></div></div></div>
    <section class="card"><h2>📍 Dónde quedaron</h2>
      ${r.errors ? row('🎯', 'Tus errores, en <b>Repaso › Escritura</b> y en Progreso. Si los repites al escribir, la app te avisa al tiro.') : ''}
      ${r.pack ? row('📚', `Una lección nueva, <b>${esc(r.pack.title)}</b>, en <b>Repaso › Claude</b>.`) : ''}
      ${r.cards ? row('🃏', `${r.cards} ${r.cards === 1 ? 'tarjeta nueva' : 'tarjetas nuevas'} para repasar.`) : ''}
      ${r.sentences ? row('🎙️', 'Tus frases corregidas, para decirlas en voz alta en Pronunciación.') : ''}
      ${r.texts ? row('✍️', `${r.texts} ${r.texts === 1 ? 'texto quedó marcado' : 'textos quedaron marcados'} como revisados por Claude.`) : ''}</section>
    ${r.tip ? `<div class="card tip-card"><span class="label">💡 Consejo de Claude</span><p>${tipHTML(r.tip)}</p></div>` : ''}
    ${r.pack ? `<button class="btn primary wide" data-act="lesson" data-id="${esc(r.pack.id)}">📚 Hacer la lección</button>` : ''}
    ${claudeSentences().length ? '<button class="btn ghost wide" data-act="psession" data-g="claude">🎙️ Practicar en voz alta</button>' : ''}
    <button class="btn ghost wide" data-act="tab" data-tab="write">Volver a Escribir</button>`;
  window.scrollTo(0, 0); celebrate();
}
/* Errores que Claude ya te corrigió: se marcan al tiro al escribir, incluso sin internet.
   Solo los que están mal en cualquier frase (Claude lo indica con "always"), o palabras que no existen. */
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function claudeHits(text) {
  const out = [];
  Object.values((S.writing && S.writing.errs) || {}).forEach(it => {
    if (!it.claude || !it.wrong) return;
    const sure = it.always === true || (it.always == null && DICT && /^[a-z']+$/i.test(it.wrong) && !lookup(it.wrong));
    if (!sure) return;
    const caseOnly = it.wrong.toLowerCase() === (it.right || '').toLowerCase();
    const re = new RegExp(`(^|[^A-Za-z'])(${reEsc(it.wrong)})(?=[^A-Za-z']|$)`, caseOnly ? 'g' : 'gi');
    let m;
    while ((m = re.exec(text))) {
      const off = m.index + m[1].length, wrong = m[2];
      const right = !caseOnly && /^[A-Z]/.test(wrong) && it.right ? it.right[0].toUpperCase() + it.right.slice(1) : it.right;
      out.push({ off, len: wrong.length, wrong, right, type: it.type, es: it.es, rule: 'CLAUDE' });
    }
  });
  return out;
}
