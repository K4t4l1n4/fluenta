'use strict';
/* ============================================================
   FLUENTA 2.0 · App para aprender inglés (PWA)
   ============================================================ */

/* ===== Utilidades ===== */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const pad = n => String(n).padStart(2, '0');
const dayStr = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); };
const weekKey = () => { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return dayStr(d); };
const deaccent = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const tokens = s => s.trim().split(/\s+/);
const clean = t => t.toLowerCase().replace(/[^a-z0-9']/g, '');
const stripPunct = t => t.replace(/[.,!?]+$/g, '');
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
/* Convierte un texto en inglés en palabras que se pueden tocar para ver su significado */
const tapText = s => String(s ?? '').split(/([A-Za-z][A-Za-z'’-]*[A-Za-z]|[A-Za-z])/)
  .map((p, i) => i % 2 ? `<span class="tw" data-act="word" data-w="${esc(p)}">${esc(p)}</span>` : esc(p)).join('');

/* ===== Íconos (SVG propios, estilo línea) ===== */
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-6h4v6"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0 0 14 0v-1"/><path d="M12 18v4"/>',
  cards: '<rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/>',
  chart: '<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6" rx="1"/><rect x="12" y="8" width="3" height="10" rx="1"/><rect x="17" y="5" width="3" height="13" rx="1"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
  volume: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  play: '<path d="M7 4v16l13-8z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  upload: '<path d="M12 15V3"/><path d="m7 8 5-5 5 5"/><path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>',
  download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 15h10l1-15"/>',
  dict: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/><circle cx="12" cy="9" r="3"/><path d="m14.2 11.2 2 2"/>'
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

/* ===== Datos guardados (en el teléfono) ===== */
const KEY = 'fluenta-v1';
const DEFAULT = {
  version: 2, xp: 0, weekXp: 0, weekKey: '', streak: 0, lastDay: '', dailyXp: 0, dailyDay: '', goal: 30,
  done: {}, dialogs: {}, ends: {}, dlg: {}, bestPron: 0, pron: {}, cards: {}, reviews: 0, added: 0, ach: {},
  rate: 0.9, name: '', theme: 'light', accent: '',
  items: {}, types: {}, days: {}, pw: {}, log: [], packs: [], lastExport: 0, autoDone: 0, pronSessions: [],
  writing: { texts: [], errs: {} }
};
const fresh = () => JSON.parse(JSON.stringify(DEFAULT));
let S = load();
function load() { try { const raw = localStorage.getItem(KEY); if (raw) return { ...fresh(), ...JSON.parse(raw) }; } catch (e) {} return fresh(); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function rollover() {
  if (S.weekKey !== weekKey()) { S.weekKey = weekKey(); S.weekXp = 0; }
  if (S.dailyDay !== dayStr()) { S.dailyDay = dayStr(); S.dailyXp = 0; }
}
const today = () => S.days[dayStr()] || (S.days[dayStr()] = { xp: 0, ok: 0, fail: 0 });
const currentStreak = () => (S.lastDay === dayStr() || S.lastDay === yesterday()) ? S.streak : 0;
function addXp(n) {
  rollover();
  S.xp += n; S.weekXp += n; S.dailyXp += n; today().xp += n;
  const t = dayStr();
  if (S.lastDay !== t) { S.streak = S.lastDay === yesterday() ? S.streak + 1 : 1; S.lastDay = t; }
  save(); checkAch();
}

/* ===== Historial de aciertos y errores ===== */
const TYPE_LABELS = { meaning: 'Significado', translate: 'Traducir al inglés', listen: 'Escuchar', order: 'Ordenar frases', fill: 'Completar', speak: 'Hablar', card: 'Tarjetas', dialog: 'Diálogos', write: 'Escribir (textos sin errores)' };
function trackType(type, ok) {
  const t = S.types[type] || (S.types[type] = { ok: 0, fail: 0 }); ok ? t.ok++ : t.fail++;
  const d = today(); ok ? d.ok++ : d.fail++;
}
function track(type, en, es, ok) {
  if (!en) return;
  const it = S.items[en] || (S.items[en] = { en, es: es || '', ok: 0, fail: 0, kind: tokens(en).length > 2 ? 's' : 'w', last: 0 });
  if (es && !it.es) it.es = es;
  ok ? it.ok++ : it.fail++; it.last = Date.now();
  trackType(type, ok);
  S.log.push({ t: Date.now(), type, en, ok: ok ? 1 : 0 });
  if (S.log.length > 600) S.log.splice(0, S.log.length - 600);
  save();
}
function trackPron(r) {
  r.words.forEach(w => { const k = clean(w.w); if (!k) return; const p = S.pw[k] || (S.pw[k] = { ok: 0, fail: 0 }); w.ok ? p.ok++ : p.fail++; });
  save();
}
const weakness = i => i.fail - i.ok * 0.5;
function weakItems(n = 10) {
  return Object.values(S.items).filter(i => i.fail > 0 && weakness(i) > 0 && i.es)
    .sort((a, b) => weakness(b) - weakness(a) || b.last - a.last).slice(0, n);
}
function weakSounds(n = 8) {
  return Object.entries(S.pw).filter(([, p]) => p.fail > 0 && p.fail >= p.ok * 0.5)
    .sort((a, b) => (b[1].fail - b[1].ok * .5) - (a[1].fail - a[1].ok * .5)).slice(0, n);
}

/* ===== Niveles y liga ===== */
const lvlThreshold = L => 50 * L * (L - 1);
function levelInfo() {
  let L = 1; while (S.xp >= lvlThreshold(L + 1)) L++;
  const a = lvlThreshold(L), b = lvlThreshold(L + 1);
  return { L, cur: S.xp - a, need: b - a, pct: Math.round((S.xp - a) / (b - a) * 100) };
}
const LEAGUES = ['Bronce', 'Plata', 'Oro', 'Zafiro', 'Rubí', 'Diamante'];
const leagueName = () => LEAGUES[Math.min(Math.floor((levelInfo().L - 1) / 2), LEAGUES.length - 1)];
const RIVALS = ['Sofía', 'Mateo', 'Valentina', 'Lucas', 'Isabella', 'Tomás', 'Martina', 'Benjamín', 'Emilia'];
function hash(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function seeded(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function leagueTable() {
  rollover();
  const rnd = seeded(hash(S.weekKey));
  const start = new Date(S.weekKey + 'T00:00:00').getTime();
  const prog = Math.min(1, Math.max(0, (Date.now() - start) / (7 * 864e5)));
  const L = levelInfo().L;
  const rows = RIVALS.map(name => { const rate = (8 + rnd() * 30) * (1 + L * 0.08); return { name, xp: Math.round(rate * 7 * prog * (0.85 + rnd() * 0.3)), you: false }; });
  rows.push({ name: S.name ? S.name + ' (tú)' : 'Tú', xp: S.weekXp, you: true });
  rows.sort((a, b) => b.xp - a.xp || (a.you ? -1 : 1));
  return rows;
}
function leagueHTML(table, limit) {
  const pos = table.findIndex(r => r.you);
  let rows = table.slice(0, limit);
  if (pos >= limit) rows = [...rows.slice(0, limit - 1), table[pos]];
  return rows.map(r => {
    const i = table.indexOf(r);
    const medal = ['🥇', '🥈', '🥉'][i] || '#' + (i + 1);
    return `<div class="league-row ${r.you ? 'you' : ''}"><span class="rank">${medal}</span><span class="grow">${esc(r.name)}</span><span class="muted">${r.xp} XP</span></div>`;
  }).join('');
}

/* ===== Lecciones: búsqueda ===== */
const allLessons = () => LESSONS.flatMap(u => u.lessons);
const allWords = () => allLessons().flatMap(l => l.words);
const allSentences = () => allLessons().flatMap(l => l.sentences);
const allPhrases = () => PRON.flatMap(c => c.phrases.map(p => p[0]));
const PHRASE_ES = new Map(PRON.flatMap(c => c.phrases));
/* Traducción corta de una palabra suelta: primero el contenido de la app, luego el diccionario */
function gloss(w) {
  const k = String(w).toLowerCase();
  const hit = allWords().find(x => x[0].toLowerCase() === k);
  if (hit) return hit[1];
  const c = Object.values(S.cards).find(x => x.en.toLowerCase() === k);
  if (c) return c.es;
  const r = DICT ? lookup(k) : null;
  return r ? (r.entry || r.base).es.split(/[;,]/)[0] : '';
}
const dialogEnds = d => Object.keys(d.nodes).filter(k => d.nodes[k].end);
function autoLesson() {
  const weak = weakItems(14); if (!weak.length) return null;
  const words = weak.filter(i => i.kind === 'w').slice(0, 6).map(i => [i.en, i.es]);
  const sentences = weak.filter(i => i.kind === 's').slice(0, 4).map(i => [i.en, i.es]);
  if (sentences.length < 2 && words.length) {
    const keys = words.map(w => w[0].toLowerCase());
    const related = shuffle(allSentences()).filter(s => keys.some(k => (' ' + s[0].toLowerCase().replace(/[.,!?]/g, '') + ' ').includes(' ' + k + ' ')) && !sentences.some(x => x[0] === s[0]));
    sentences.push(...related.slice(0, 2 - sentences.length));
  }
  return { id: 'auto', title: 'Mis errores', icon: '🎯', focus: true, count: weak.length,
    tip: 'Esta lección se armó sola con las palabras y frases que más te han costado. Cada palabra aparece de varias formas para que la fijes bien.',
    words, sentences };
}
function findLesson(id) { if (id === 'auto') return autoLesson(); return allLessons().find(l => l.id === id) || S.packs.find(p => p.id === id); }

/* ===== Logros ===== */
const ACH = [
  { id: 'first', icon: '🎯', name: 'Primer paso', desc: 'Completa tu primera lección', test: () => Object.keys(S.done).length >= 1 },
  { id: 'unit', icon: '📘', name: 'Unidad completa', desc: 'Termina una unidad entera', test: () => LESSONS.some(u => u.lessons.every(l => S.done[l.id])) },
  { id: 'a2', icon: '🎓', name: 'Nivel A2', desc: 'Completa tu primera lección A2', test: () => LESSONS.some(u => u.level === 'A2' && u.lessons.some(l => S.done[l.id])) },
  { id: 'streak3', icon: '🔥', name: 'En racha', desc: '3 días seguidos', test: () => currentStreak() >= 3 },
  { id: 'streak7', icon: '⚡', name: 'Imparable', desc: '7 días seguidos', test: () => currentStreak() >= 7 },
  { id: 'xp100', icon: '⭐', name: '100 XP', desc: 'Gana 100 XP', test: () => S.xp >= 100 },
  { id: 'xp1000', icon: '🌟', name: '1000 XP', desc: 'Gana 1000 XP', test: () => S.xp >= 1000 },
  { id: 'talk', icon: '💬', name: 'Conversadora', desc: 'Completa un diálogo', test: () => Object.keys(S.dialogs).length >= 1 },
  { id: 'explorer', icon: '🧭', name: 'Exploradora', desc: 'Descubre todos los finales de un diálogo', test: () => DIALOGS.some(d => (S.ends[d.id] || []).length >= dialogEnds(d).length) },
  { id: 'alltalk', icon: '🧳', name: 'Lista para viajar', desc: 'Completa todos los diálogos', test: () => DIALOGS.every(d => S.dialogs[d.id]) },
  { id: 'pron90', icon: '🎤', name: 'Voz de oro', desc: 'Saca 90% o más hablando', test: () => S.bestPron >= 90 },
  { id: 'review20', icon: '🃏', name: 'Memoria de acero', desc: 'Repasa 20 tarjetas', test: () => S.reviews >= 20 },
  { id: 'words5', icon: '📝', name: 'Coleccionista', desc: 'Agrega 5 palabras propias', test: () => S.added >= 5 },
  { id: 'fix', icon: '🛠️', name: 'Sin miedo al error', desc: 'Completa una lección de refuerzo', test: () => S.autoDone >= 1 },
  { id: 'backup', icon: '💾', name: 'Precavida', desc: 'Exporta tu progreso', test: () => S.lastExport > 0 },
  { id: 'podium', icon: '🏆', name: 'Podio', desc: 'Llega al top 3 de la liga', test: () => S.weekXp > 0 && leagueTable().findIndex(r => r.you) < 3 }
];
function checkAch() {
  for (const a of ACH) {
    if (!S.ach[a.id] && a.test()) { S.ach[a.id] = dayStr(); save(); toast(`${a.icon} Logro desbloqueado: ${a.name}`); }
  }
}

/* ===== Voz: el teléfono lee en inglés ===== */
let voice = null;
function loadVoice() {
  const vs = speechSynthesis.getVoices();
  voice = vs.find(v => v.lang === 'en-US' && /Samantha|Google US|Aaron|Nicky|Ava/i.test(v.name))
    || vs.find(v => v.lang === 'en-US') || vs.find(v => v.lang.startsWith('en')) || null;
}
if ('speechSynthesis' in window) { loadVoice(); speechSynthesis.onvoiceschanged = loadVoice; }
function speak(text, slow) {
  if (!('speechSynthesis' in window) || !text) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/^\(.*?\)\s*/, ''));
  u.lang = 'en-US'; if (voice) u.voice = voice;
  u.rate = slow ? 0.55 : S.rate;
  speechSynthesis.speak(u);
}

/* ===== Reconocimiento de voz: evalúa tu pronunciación ===== */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null;
function listen(targets, cb) {
  targets = [].concat(targets);
  if (!SR) { cb({ error: 'unsupported' }); return; }
  try { rec && rec.abort(); } catch (e) {}
  rec = new SR();
  rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 5; rec.continuous = false;
  let done = false;
  const finish = r => { if (done) return; done = true; cb(r); };
  rec.onresult = e => {
    const res = e.results[0];
    const alts = Array.from({ length: res.length }, (_, i) => res[i].transcript);
    let best = null;
    for (const h of alts) for (const t of targets) { const r = compare(t, h); if (!best || r.score > best.score) best = { ...r, heard: h, target: t }; }
    finish(best);
  };
  rec.onerror = e => finish({ error: e.error });
  rec.onend = () => finish({ error: 'no-speech' });
  try { rec.start(); } catch (e) { finish({ error: 'start' }); }
}
const NUM = { '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten', '11': 'eleven', '12': 'twelve', '15': 'fifteen', '20': 'twenty', '21': 'twenty one', '23': 'twenty three', '25': 'twenty five', '30': 'thirty', '90': 'ninety', '1st': 'first', '2nd': 'second', '3rd': 'third', '5th': 'fifth' };
const CONTR = { "i'm": 'i am', "you're": 'you are', "it's": 'it is', "that's": 'that is', "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "can't": 'can not', 'cannot': 'can not', "i'd": 'i would', "i'll": 'i will', "what's": 'what is', "let's": 'let us', "isn't": 'is not', "we're": 'we are', "they're": 'they are', "there's": 'there is', "here's": 'here is', "she's": 'she is', "he's": 'he is', "won't": 'will not', "i've": 'i have', "we've": 'we have', 'okay': 'ok', 'pm': 'p m', 'am': 'am' };
function norm(s) {
  s = s.toLowerCase().replace(/[’‘]/g, "'").replace(/\$(\d+)/g, '$1 dollars').replace(/(\d+):(\d+)/g, '$1 $2').replace(/-/g, ' ').replace(/[^a-z0-9'\s]/g, ' ');
  return s.split(/\s+/).filter(Boolean).flatMap(x => {
    x = x.replace(/^'+|'+$/g, '');
    if (CONTR[x]) return CONTR[x].split(' ');
    if (NUM[x]) return NUM[x].split(' ');
    return x ? [x] : [];
  });
}
function lev(a, b) {
  const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i, ...new Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
const similar = (a, b) => a === b || (1 - lev(a, b) / Math.max(a.length, b.length)) >= 0.85;
function compare(target, heard) {
  const disp = tokens(target.replace(/^\(.*?\)\s*/, '')), tw = [], owner = [];
  disp.forEach((d, i) => norm(d).forEach(w => { tw.push(w); owner.push(i); }));
  const hw = norm(heard), n = tw.length, m = hw.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++)
    dp[i][j] = similar(tw[i - 1], hw[j - 1]) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  const matched = new Array(n).fill(false);
  let i = n, j = m;
  while (i > 0 && j > 0) {
    if (similar(tw[i - 1], hw[j - 1]) && dp[i][j] === dp[i - 1][j - 1] + 1) { matched[i - 1] = true; i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--;
  }
  const words = disp.map((w, k) => {
    const idx = owner.map((o, t) => o === k ? t : -1).filter(t => t >= 0);
    return { w, ok: idx.length === 0 || idx.every(t => matched[t]) };
  });
  return { score: n ? Math.round(matched.filter(Boolean).length / n * 100) : 0, words };
}
function recError(code) {
  return ({
    unsupported: 'Tu navegador no tiene reconocimiento de voz. En iPhone abre la app en Safari (iOS 14.5 o superior).',
    'not-allowed': 'No hay permiso para el micrófono. Actívalo en Ajustes › Safari › Micrófono y vuelve a intentarlo.',
    'service-not-allowed': 'El reconocimiento de voz está desactivado. Activa el Dictado en Ajustes › General › Teclado › Activar dictado.',
    'no-speech': 'No te escuché. Toca el micrófono y habla cerca del teléfono.',
    aborted: 'Se detuvo la grabación. Inténtalo de nuevo.',
    network: 'El reconocimiento de voz necesita internet.'
  })[code] || `No pude escucharte (${code}). Inténtalo de nuevo.`;
}
function pronResultHTML(r) {
  if (!r) return '';
  if (r.error) return `<p class="err">⚠️ ${esc(recError(r.error))}</p>`;
  const [cls, msg] = r.score >= 90 ? ['great', '¡Excelente pronunciación! 🌟'] : r.score >= 70 ? ['good', '¡Muy bien! Casi perfecto 👏']
    : r.score >= 40 ? ['mid', 'Vas bien, inténtalo otra vez 💪'] : ['low', 'Escucha con 🐢 y repite más lento'];
  return `<div class="pron-result ${cls}"><div class="pron-score">${r.score}%</div><div>${msg}</div>
    <div class="pron-words">${r.words.map(w => `<span class="${w.ok ? 'w-ok' : 'w-bad'}">${esc(w.w)}</span>`).join(' ')}</div>
    <div class="pron-heard">Escuché: “${esc(r.heard)}”</div></div>`;
}
const micControls = (text, ctx) => `<div class="speak-controls">
  ${text ? `<button class="round-btn" data-act="say" data-t="${esc(text)}" aria-label="Escuchar">${ic('volume')}</button>` : '<span class="round-btn ghost"></span>'}
  <button class="mic-btn" data-act="mic" data-ctx="${ctx}" aria-label="Hablar">${ic('mic')}</button>
  ${text ? `<button class="round-btn" data-act="say" data-t="${esc(text)}" data-slow="1" aria-label="Lento">🐢</button>` : '<span class="round-btn ghost"></span>'}</div>`;
const sayBtn = (t, cls = '') => `<button class="say ${cls}" data-act="say" data-t="${esc(t)}" aria-label="Escuchar">${ic('volume')}</button>`;

/* ===== Navegación ===== */
let tab = 'home', talkSeg = 'dialogs', cardSeg = 'review', statSeg = 'week';
let pronCurrent = null, pronResult = null, L = null, D = null, F = null, P = null;
const view = () => $('#view');
function go(t) {
  tab = t; L = null; D = null; F = null; P = null; W = null;
  if (SHEET.open) closeSheet();
  document.body.classList.remove('focus');
  try { rec && rec.abort(); } catch (e) {}
  render(); window.scrollTo(0, 0);
}
function render() {
  rollover();
  document.querySelectorAll('#tabs [data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  view().innerHTML = ({ home: renderHome, lessons: renderLessons, talk: renderTalk, cards: renderCards, stats: renderStats, profile: renderProfile, write: renderWriteTab })[tab]();
}
function renderNav() {
  $('#tabs').innerHTML = `
    <button data-act="tab" data-tab="home">${ic('home')}<span>Inicio</span></button>
    <button data-act="tab" data-tab="lessons">${ic('book')}<span>Lecciones</span></button>
    <button class="fab-tab" data-act="tab" data-tab="talk" aria-label="Hablar"><span class="fab">${ic('mic')}</span></button>
    <button data-act="tab" data-tab="cards">${ic('cards')}<span>Tarjetas</span></button>
    <button data-act="tab" data-tab="stats">${ic('chart')}<span>Progreso</span></button>`;
}
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2800);
}
function summaryHTML({ emoji, title, stats, note, back }) {
  return `<div class="summary"><div class="emoji">${emoji}</div><h1>${title}</h1>
    <div class="sum-stats">${stats.map(([v, l]) => `<div class="stat"><b>${v}</b><small>${l}</small></div>`).join('')}</div>
    ${note ? `<p class="muted">${note}</p>` : ''}
    <button class="btn primary wide" data-act="tab" data-tab="${back}">Continuar</button></div>`;
}
const topBar = (title, right = '') => `<header class="page-top"><h1>${title}</h1>${right}</header>`;
const ring = (p, inner, cls = '') => `<div class="ring ${cls}" style="--p:${p}"><span>${inner}</span></div>`;

/* ===== Tema: claro / oscuro y color principal =====
   El color elegido se convierte en toda una paleta (fondos, botones, degradados)
   para el modo claro y el oscuro, cuidando que el texto blanco siempre se lea. */
const DEFAULT_ACCENT = '#7b5cf0';
const ACCENTS = [['#7b5cf0', 'Lavanda'], ['#3b6fe0', 'Azul'], ['#0d9488', 'Turquesa'], ['#16a34a', 'Verde'], ['#db2777', 'Rosa'], ['#e2574c', 'Coral'], ['#dd6b10', 'Naranja'], ['#8b3fc9', 'Uva']];
const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const relLum = rgb => rgb.map(c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }).reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => { const [x, y] = [relLum(a), relLum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
function rgbHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  let h = 0, s = 0;
  if (mx !== mn) {
    const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = 60 * (mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4);
  }
  return [h, s * 100, l * 100];
}
function hslRgb(h, s, l) {
  s = Math.max(0, Math.min(100, s)) / 100; l = Math.max(0, Math.min(100, l)) / 100; h = (h % 360 + 360) % 360;
  const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  return [0, 8, 4].map(n => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1)))));
}
const hsl = (h, s, l, a) => `rgb(${hslRgb(h, s, l).join(' ')}${a != null ? ` / ${a}` : ''})`;
function accentPalette(hex) {
  const WHITE = [255, 255, 255];
  let [h, s, l] = rgbHsl(hexRgb(hex));
  while (l > 18 && contrast(hslRgb(h, s, l), WHITE) < 3) l -= 2;   /* que se lea el texto blanco de los botones */
  const gray = s < 12, tint = v => gray ? 0 : v;   /* negro, gris o blanco: grises sin ningún tono */
  if (gray) s = 0;
  const light = {
    '--accent': hsl(h, s, l), '--accent2': hsl(h, s, Math.min(l + 12, 78)), '--accent-soft': hsl(h, tint(90), 94), '--accent-ink': hsl(h, s, Math.max(l - 15, 20)),
    '--accent-rgb': hslRgb(h, s, l).join(','), '--shadow-rgb': hslRgb(h, tint(40), 45).join(','),
    '--grad': `linear-gradient(135deg,${hsl(h, s, l + 9)} 0%,${hsl(h, s, l)} 55%,${hsl(h, s, l - 6)} 100%)`,
    '--hero': `linear-gradient(140deg,${hsl(h, s, Math.min(l + 20, 82))} 0%,${hsl(h, s, l + 6)} 45%,${hsl(h, s, l - 3)} 100%)`,
    '--bg1': hsl(h, tint(100), 96), '--bg2': hsl(h - 30, tint(100), 93), '--surface2': hsl(h, tint(100), 98), '--line': hsl(h, tint(70), 93),
    '--text': hsl(h - 15, tint(35), 20), '--muted': hsl(h - 15, tint(20), 56)
  };
  /* Modo oscuro: el fondo negro y las cajas grises vienen de styles.css; aquí solo va el color */
  const surf = [28, 28, 30];
  let ld = Math.max(l + 8, 58); while (ld < 88 && contrast(hslRgb(h, s, ld), surf) < 4) ld += 2;   /* que se lea sobre las cajas grises */
  const sd = gray ? s : Math.max(s, 45) * 0.66, lg = Math.max(l, 38);   /* botones: que no se pierdan en el negro */
  const dark = {
    '--accent': hsl(h, s, ld), '--accent2': hsl(h, s, Math.min(ld + 8, 90)), '--accent-soft': hsl(h, tint(42), 26), '--accent-ink': hsl(h, tint(100), 86),
    '--grad': `linear-gradient(135deg,${hsl(h, s, lg + 9)} 0%,${hsl(h, s, lg)} 55%,${hsl(h, s, lg - 6)} 100%)`,
    '--hero': `linear-gradient(140deg,${hsl(h, sd, 50)} 0%,${hsl(h, sd, 40)} 55%,${hsl(h, sd * 1.05, 30)} 100%)`
  };
  return { light, dark };
}
const currentAccent = () => S.accent && /^#[0-9a-f]{6}$/i.test(S.accent) ? S.accent.toLowerCase() : DEFAULT_ACCENT;
function applyAccent() {
  const hex = currentAccent();
  let st = $('#accentVars');
  if (hex === DEFAULT_ACCENT) { if (st) st.remove(); return; }   /* el lavanda original queda tal cual en styles.css */
  if (!st) { st = document.createElement('style'); st.id = 'accentVars'; document.head.appendChild(st); }
  const { light, dark } = accentPalette(hex), css = o => Object.entries(o).map(([k, v]) => `${k}:${v}`).join(';');
  st.textContent = `:root{${css(light)}}:root[data-theme="dark"]{${css(dark)}}`;
}
const darkMQ = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
function applyTheme() {
  const t = S.theme === 'auto' ? (darkMQ && darkMQ.matches ? 'dark' : 'light') : S.theme;
  document.documentElement.dataset.theme = t;
  applyAccent();
  const m = $('meta[name="theme-color"]'); if (m) m.content = getComputedStyle(document.documentElement).getPropertyValue('--bg1').trim() || (t === 'dark' ? '#13142a' : '#eeebff');
}
if (darkMQ && darkMQ.addEventListener) darkMQ.addEventListener('change', () => S.theme === 'auto' && applyTheme());

/* ===== INICIO ===== */
function greeting() { const h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches'; }
function installTip() {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (!ios || navigator.standalone) return '';
  return `<div class="card tip"><b>📲 Instala la app</b><p class="muted small">En Safari toca Compartir <b>⬆️</b> y luego <b>"Agregar a pantalla de inicio"</b>.</p></div>`;
}
function sectionStats() {
  const ls = allLessons(), phrases = allPhrases(), cards = Object.values(S.cards);
  return [
    { tab: 'lessons', icon: 'book', title: 'Lecciones', p: pct(ls.filter(l => S.done[l.id]).length, ls.length) },
    { tab: 'talk', seg: 'dialogs', icon: 'chat', title: 'Diálogos', p: pct(DIALOGS.filter(d => S.dialogs[d.id]).length, DIALOGS.length) },
    { tab: 'talk', seg: 'pron', icon: 'mic', title: 'Pronunciación', p: pct(phrases.filter(p => (S.pron[p] || 0) >= 70).length, phrases.length) },
    { tab: 'cards', icon: 'cards', title: 'Tarjetas', p: pct(cards.filter(c => c.box >= 4).length, cards.length) }
  ];
}
function renderHome() {
  const lv = levelInfo(), st = currentStreak(), goalPct = Math.min(100, pct(S.dailyXp, S.goal));
  const nx = allLessons().find(l => !S.done[l.id]);
  const table = leagueTable(), pos = table.findIndex(r => r.you);
  const weak = weakItems(20).length;
  const needBackup = S.xp > 0 && Date.now() - (S.lastExport || 0) > 7 * 864e5;
  return `
  <header class="home-top"><div><p class="muted">${greeting()}${S.name ? ', ' + esc(S.name) : ''} 👋</p><p class="small muted">Nivel ${lv.L} · Liga ${leagueName()}</p></div>
    <button class="avatar" data-act="tab" data-tab="profile" aria-label="Perfil">${esc((S.name || '🙂')[0].toUpperCase())}</button></header>
  ${installTip()}
  <section class="hero">
    <div class="hero-pills"><span>🔥 ${st} ${st === 1 ? 'día' : 'días'}</span><span>⭐ ${S.xp} XP</span></div>
    <h1>¡Sigue con<br>tu inglés!</h1>
    <div class="hero-bar"><i style="width:${lv.pct}%"></i></div>
    <p class="hero-sub">${lv.need - lv.cur} XP para el nivel ${lv.L + 1}</p>
    ${nx ? `<button class="hero-btn" data-act="lesson" data-id="${nx.id}"><span class="hero-btn-icon">${nx.icon}</span><span class="grow"><small>${Object.keys(S.done).length ? 'Continuar' : 'Empezar'}</small><b>${esc(nx.title)}</b></span>${ic('play', 'sm')}</button>`
      : `<p class="hero-sub">🎓 ¡Completaste todas las lecciones!</p>`}
  </section>
  <div class="row between section-title"><h2>Tus secciones</h2></div>
  <div class="grid2">${sectionStats().map(s => `
    <button class="sec-card" data-act="tab" data-tab="${s.tab}" ${s.seg ? `data-seg2="${s.seg}"` : ''}>
      <span class="sec-ring" style="--p:${s.p}"><span>${ic(s.icon)}</span></span>
      <b>${s.title}</b><small>${s.p}% completado</small></button>`).join('')}</div>
  <button class="card action-card" data-act="tab" data-tab="write"><span class="icon-bubble">✍️</span><span class="grow"><b>Escribir en inglés</b><small class="muted block">${(S.writing && S.writing.texts.length) ? `${S.writing.texts.length} textos escritos · ` : ''}Temas guiados con corrección en español</small></span>${ic('play', 'sm accent')}</button>
  <section class="card row goal-card">${ring(goalPct, `${S.dailyXp}/${S.goal}`)}<div class="grow"><b>Meta diaria</b><p class="muted small">${goalPct >= 100 ? '¡Cumplida! ✅ Sigue sumando para la liga.' : `Te faltan ${S.goal - S.dailyXp} XP para hoy.`}</p></div></section>
  ${weak >= 3 ? `<button class="card action-card" data-act="lesson" data-id="auto"><span class="icon-bubble warm">${ic('target')}</span><span class="grow"><b>Practica tus errores</b><small class="muted block">${weak} palabras y frases para reforzar</small></span>${ic('play', 'sm accent')}</button>` : ''}
  ${needBackup ? `<button class="card action-card" data-act="export"><span class="icon-bubble">${ic('upload')}</span><span class="grow"><b>Guarda una copia</b><small class="muted block">Exporta tu progreso para respaldarlo y que Claude lo revise</small></span></button>` : ''}
  <section class="card"><div class="row between"><h2>🏆 Liga ${leagueName()}</h2><span class="muted small">Esta semana</span></div>
    ${leagueHTML(table, 5)}<p class="muted small center">Vas en el puesto #${pos + 1} de ${table.length}.</p></section>`;
}

/* ===== LECCIONES ===== */
function lessonUnlocked(id) { const all = allLessons(), i = all.findIndex(l => l.id === id); return i <= 0 || !!S.done[all[i - 1].id]; }
function lessonRow(l, un, extra = '') {
  const st = S.done[l.id] || 0;
  return `<button class="lesson ${un ? '' : 'locked'} ${st ? 'done' : ''}" ${un ? `data-act="lesson" data-id="${l.id}"` : 'disabled'}>
    <span class="lesson-icon">${un ? l.icon : '🔒'}</span>
    <span class="lesson-info grow"><b>${esc(l.title)}</b>${extra || `<span class="stars">${'★'.repeat(st)}${'☆'.repeat(3 - st)}</span>`}</span>
    ${un ? ic('play', 'sm accent') : ''}</button>`;
}
function renderLessons() {
  const auto = autoLesson();
  const refuerzo = (auto || S.packs.length) ? `<section class="unit"><div class="unit-head"><span class="badge warm">Refuerzo</span><h2>Para ti</h2></div><div class="path">
    ${auto ? lessonRow(auto, true, `<span class="muted small">${auto.count} ${auto.count === 1 ? 'palabra o frase' : 'palabras y frases'} para reforzar</span>`) : ''}
    ${S.packs.map(p => `<div class="pack-row">${lessonRow(p, true, `<span class="muted small">${esc(p.note || 'Refuerzo preparado por Claude')}</span>`)}<button class="icon-btn sm" data-act="delpack" data-id="${esc(p.id)}" aria-label="Eliminar">${ic('trash')}</button></div>`).join('')}
  </div></section>` : '';
  return topBar('Lecciones', `<div class="pill">📚 ${allLessons().filter(l => S.done[l.id]).length}/${allLessons().length}</div>`) + refuerzo +
    LESSONS.map(u => {
      const done = u.lessons.filter(l => S.done[l.id]).length;
      return `<section class="unit"><div class="unit-head"><span class="badge">${u.level}</span><h2 class="grow">${esc(u.unit)}</h2><span class="muted small">${done}/${u.lessons.length}</span></div>
      <div class="path">${u.lessons.map(l => lessonRow(l, lessonUnlocked(l.id))).join('')}</div></section>`;
    }).join('');
}
function uniqBy(arr, f) { const s = new Set(); return arr.filter(x => { const k = f(x); if (s.has(k)) return false; s.add(k); return true; }); }
function genExercises(les) {
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
  } else {
    shuffle(words).slice(0, 2).forEach(w => ex.push(mkMeaning(w)));
    if (words.length) { ex.push(mkTranslate(pick(words))); ex.push(mkListen(pick(words))); }
    shuffle(sentences).slice(0, 2).forEach(s => ex.push(mkOrder(s)));
    if (sentences.length) { ex.push(mkFill(pick(sentences))); ex.push(mkSpeak(pick(sentences))); }
  }
  return shuffle(ex);
}
function startLesson(id) {
  const les = findLesson(id);
  if (!les) { toast('Aún no tienes errores para reforzar. ¡Sigue practicando!'); return; }
  const queue = genExercises(les);
  if (!queue.length) { toast('Esta lección no tiene ejercicios.'); return; }
  L = { les, queue, i: 0, first: 0, sel: null, built: [], answered: false, ok: null, result: null, intro: true, tracked: false };
  L.total = L.queue.length;
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
  view().innerHTML = `<div class="lesson-top"><button class="icon-btn" data-act="quit" aria-label="Salir">${ic('x')}</button><div class="grow"></div></div>
    <div class="intro"><div class="intro-icon">${l.icon}</div><h1>${esc(l.title)}</h1>
      ${l.tip ? `<div class="card tip-card"><span class="label">💡 Tip</span><p>${esc(l.tip)}</p></div>` : ''}
      ${l.words.length ? `<p class="label left">Palabras de esta lección</p><div class="word-chips">${l.words.map(w => `<button class="word-chip" data-act="say" data-t="${esc(w[0])}"><b>${esc(w[0])}</b><small>${esc(w[1])}</small></button>`).join('')}</div>` : ''}
    </div>
    <footer class="ex-foot"><button class="btn primary wide" data-act="begin">Empezar · ${L.total} ejercicios</button></footer>`;
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
  const canCheck = L.answered || (ex.type === 'order' ? L.built.length > 0 : L.sel != null);
  let foot = '';
  if (L.answered) {
    const title = L.skipped ? 'Sin problema 👌' : L.ok ? pick(['¡Correcto! 🎉', '¡Excelente! ⭐', '¡Muy bien! 💪', '¡Perfecto! 🙌']) : 'Casi… 😅';
    const pair = `<b>${tapText(ex.en)}</b> = ${esc(ex.es)}`, sentence = ex.type === 'order' || ex.type === 'fill';
    const bodyTxt = L.skipped ? 'La practicarás en otra ocasión.'
      : L.ok ? (sentence ? tapText(ex.say) : ex.type === 'speak' ? '' : pair)
      : `Respuesta correcta: ${sentence ? `<b>${tapText(ex.say)}</b>` : pair}<br><small>La repetirás al final de la lección.</small>`;
    foot = `<div class="fb-title">${title}</div>${bodyTxt ? `<div class="fb-body">${bodyTxt}</div>` : ''}`;
  }
  const showBtn = ex.type !== 'speak' || L.answered;
  view().innerHTML = `<div class="lesson-top"><button class="icon-btn" data-act="quit" aria-label="Salir">${ic('x')}</button><div class="bar grow"><i style="width:${p}%"></i></div><span class="muted small">${L.i + 1}/${L.queue.length}</span></div>
    <div class="ex">${body}</div>
    ${showBtn ? `<footer class="ex-foot ${L.answered ? (L.ok ? 'ok' : 'bad') : ''}">${foot}<button class="btn primary wide" data-act="check" ${canCheck ? '' : 'disabled'}>${L.answered ? 'Continuar' : 'Comprobar'}</button></footer>` : ''}`;
}
function evaluateLesson() {
  const ex = L.queue[L.i];
  let ok;
  if (ex.type === 'order') ok = L.built.map(i => clean(ex.tokens[i])).join(' ') === tokens(ex.answer).map(clean).join(' ');
  else ok = ex.options[L.sel] === ex.answer;
  L.answered = true; L.ok = ok;
  track(ex.track, ex.en, ex.es, ok);
  if (ok) { if (!ex.retry) L.first++; if (ex.type === 'order' || ex.type === 'fill') speak(ex.say); }
  else L.queue.push({ ...ex, retry: true, options: ex.options && shuffle(ex.options), tokens: ex.tokens && shuffle(ex.tokens) });
  renderLesson();
}
function nextExercise() {
  L.i++; L.sel = null; L.built = []; L.answered = false; L.ok = null; L.result = null; L.skipped = false; L.tracked = false;
  if (L.i >= L.queue.length) return finishLesson();
  window.scrollTo(0, 0); renderLesson();
  if (L.queue[L.i].type === 'listen') speak(L.queue[L.i].say);
}
function finishLesson() {
  const les = L.les, acc = pct(L.first, L.total), stars = acc >= 90 ? 3 : acc >= 70 ? 2 : 1;
  const isAuto = les.id === 'auto', firstTime = !isAuto && !S.done[les.id];
  const xp = 10 + L.first * 2 + (firstTime ? 5 : 0) + (isAuto ? 5 : 0);
  if (isAuto) S.autoDone = (S.autoDone || 0) + 1;
  else S.done[les.id] = Math.max(S.done[les.id] || 0, stars);
  let added = 0;
  les.words.forEach(w => { if (!S.cards[w[0]]) { S.cards[w[0]] = { en: w[0], es: w[1], box: 1, due: 0 }; added++; } });
  addXp(xp);
  view().innerHTML = summaryHTML({ emoji: stars === 3 ? '🏆' : '🎉', title: isAuto ? '¡Refuerzo completado!' : '¡Lección completada!', back: 'lessons',
    stats: [[`+${xp}`, 'XP'], [acc + '%', 'A la primera'], ['★'.repeat(stars) + '☆'.repeat(3 - stars), 'Estrellas']],
    note: added ? `Se agregaron ${added} palabras nuevas a tus tarjetas 🃏` : (L.total < L.queue.length ? `Repetiste ${L.queue.length - L.total} ejercicios hasta acertarlos 💪` : '') });
  L = null;
}
function onLessonMic(r) {
  if (!L) return;
  const ex = L.queue[L.i];
  L.result = r;
  if (!r.error) {
    trackPron(r);
    if (!L.tracked) { track('speak', ex.en, ex.es, r.score >= 70); L.tracked = true; }
    if (r.score >= 70 && !L.answered) { L.answered = true; L.ok = true; if (!ex.retry) L.first++; }
  }
  renderLesson();
}

/* ===== HABLAR: diálogos ramificados y pronunciación ===== */
function renderTalk() {
  return topBar('Hablar') +
    `<div class="seg"><button class="${talkSeg === 'dialogs' ? 'on' : ''}" data-act="seg" data-seg="talk:dialogs">💬 Diálogos</button><button class="${talkSeg === 'pron' ? 'on' : ''}" data-act="seg" data-seg="talk:pron">🎤 Pronunciación</button></div>` +
    (talkSeg === 'dialogs' ? dialogListHTML() : pronHTML());
}
function dialogListHTML() {
  return `<p class="muted small">Conversaciones con varios caminos: según lo que respondas, la historia cambia. ¡Descubre todos los finales!</p>` +
    DIALOGS.map(d => {
      const ends = dialogEnds(d).length, found = (S.ends[d.id] || []).length;
      return `<div class="card dlg-card"><div class="row"><span class="dlg-icon">${d.icon}</span><div class="grow"><b>${esc(d.title)} ${S.dialogs[d.id] ? '✅' : ''}</b><p class="muted small">${esc(d.desc)}</p></div><span class="badge soft">${d.level}</span></div>
      <p class="small muted ends">🧭 Finales descubiertos: ${found}/${ends}</p>
      <div class="row gap"><button class="btn ghost grow" data-act="dialog" data-id="${d.id}" data-mode="choose">👆 Elegir</button><button class="btn primary grow" data-act="dialog" data-id="${d.id}" data-mode="speak">🎤 Hablar</button></div></div>`;
    }).join('');
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
function enterNode(id) {
  const n = D.d.nodes[id];
  D.node = id; D.fb = null; D.result = null;
  D.log.push({ who: 'npc', en: n.npc[0], es: n.npc[1] });
  D.opts = n.end ? [] : shuffle(n.options);
  if (n.end) D.finished = true;
  speak(n.npc[0]);
}
function chooseOption(o, score) {
  D.log.push({ who: 'me', en: o.en, es: o.es, score });
  D.steps++;
  enterNode(o.go);
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
  view().innerHTML = `<div class="lesson-top"><button class="icon-btn" data-act="quit" aria-label="Salir">${ic('x')}</button><div class="grow"><b>${D.d.icon} ${esc(D.d.title)}</b><div class="bar"><i style="width:${D.finished ? 100 : Math.min(95, pct(D.steps, D.max))}%"></i></div></div></div>
    ${D.log.length === 1 ? '<p class="muted small center">💡 Toca cualquier palabra en inglés para ver qué significa.</p>' : ''}<div class="chat">${chat}</div><div class="dlg-input">${input}</div>`;
}
function finishDialog() {
  const id = D.d.id, firstEnd = !(S.ends[id] || []).includes(D.node);
  const xp = 15 + D.bonus + (firstEnd ? 5 : 0);
  S.dialogs[id] = true;
  S.ends[id] = [...new Set([...(S.ends[id] || []), D.node])];
  save(); addXp(xp);
  const total = dialogEnds(D.d).length, found = S.ends[id].length;
  view().innerHTML = summaryHTML({ emoji: '💬', title: '¡Conversación completada!', back: 'talk',
    stats: [[`+${xp}`, 'XP'], [D.wrong, 'Errores'], [`${found}/${total}`, 'Finales']],
    note: firstEnd ? (found < total ? '¡Descubriste un final nuevo! Aún quedan caminos por explorar 🧭' : '¡Descubriste todos los finales de este diálogo! 🏅') : (D.mode === 'choose' ? 'Desafío: repítelo en modo 🎤 Hablar para ganar XP extra.' : '') });
  D = null;
}
function onDialogMic(r) {
  if (!D || D.finished) return;
  if (!r.error) trackPron(r);
  const o = !r.error && D.opts.find(x => x.go && x.en === r.target);
  if (o && r.score >= 60) {
    trackType('dialog', true);
    D.bonus += r.score >= 90 ? 5 : 3;
    chooseOption(o, r.score);
  } else { if (!r.error) trackType('dialog', false); D.result = r; renderDialog(); }
}
const colorWords = r => r.words.map(w => `<span class="tw ${w.ok ? 'w-ok' : 'w-bad'}" data-act="word" data-w="${esc(w.w)}">${esc(w.w)}</span>`).join(' ');
function pronHTML() {
  const cur = pronCurrent || PRON[0].phrases[0][0], curEs = PHRASE_ES.get(cur);
  const weakN = weakPhrases(10).length;
  return `<div class="card practice"><div class="speaker-wrap"><button class="speaker-big" data-act="say" data-t="${esc(cur)}" aria-label="Escuchar">${ic('volume')}</button></div>
    <div class="practice-phrase">${pronResult && !pronResult.error ? colorWords(pronResult) : tapText(cur)}</div>${curEs ? `<p class="muted center">${esc(curEs)}</p>` : ''}${micControls(cur, 'pron')}
    <div id="micres">${pronResult ? pronResultHTML(pronResult) : '<p class="muted center small">Escucha, luego toca el micrófono y repite</p>'}</div>
    <form class="row gap" data-form="custom" style="margin-top:14px"><input name="phrase" placeholder="Escribe tu propia frase en inglés…" autocomplete="off" autocapitalize="off"><button class="btn ghost">Usar</button></form></div>
    <p class="muted small">ℹ️ La app compara lo que entiende el reconocimiento de voz con la frase. Las palabras en rojo son las que debes practicar. Con <b>▶ Sesión</b> practicas 10 frases seguidas y al final ves tu resumen. Toca cualquier palabra de la frase para ver qué significa.</p>
    ${weakN >= 3 ? `<button class="card action-card" data-act="psession" data-g="weak"><span class="icon-bubble warm">${ic('target')}</span><span class="grow"><b>Sesión de mis errores</b><small class="muted block">${weakN} frases con las palabras que más te cuestan</small></span>${ic('play', 'sm accent')}</button>` : ''}` +
    PRON.map(c => `<div class="row between pron-head"><h3>${c.icon} ${esc(c.title)}</h3><button class="add-btn" data-act="psession" data-g="${c.id}">▶ Sesión</button></div><p class="muted small">${esc(c.tip)}</p><div class="phrase-list">${c.phrases.map(([en, es]) =>
      `<button class="phrase ${en === cur ? 'on' : ''}" data-act="pphrase" data-t="${esc(en)}"><span class="grow">${esc(en)}<small class="muted block">${esc(es)}</small></span>${S.pron[en] != null ? `<span class="score-tag">${S.pron[en]}%</span>` : ''}</button>`).join('')}</div>`).join('');
}
function onPronMic(target, r) {
  pronResult = r;
  if (!r.error) {
    trackPron(r); trackType('speak', r.score >= 70);
    S.pron[target] = Math.max(S.pron[target] || 0, r.score); save();
    const xp = r.score >= 90 ? 5 : r.score >= 70 ? 3 : 0;
    if (xp) { addXp(xp); toast(`+${xp} XP 🎤`); }
  }
  if (tab === 'talk' && talkSeg === 'pron' && !D && !P) render();
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
  } else {
    const g = PRON.find(c => c.id === gid); if (!g) return;
    list = shuffle(g.phrases).slice(0, 10); title = `${g.icon} ${g.title}`;
  }
  P = { gid, title, list, i: 0, tries: 0, result: null, best: [] };
  document.body.classList.add('focus'); window.scrollTo(0, 0);
  renderPronSession(); speak(list[0][0]);
}
function renderPronSession() {
  const [en, es] = P.list[P.i], r = P.result, best = P.best[P.i], left = PS_TRIES - P.tries;
  view().innerHTML = `<div class="lesson-top"><button class="icon-btn" data-act="quit" aria-label="Salir">${ic('x')}</button><div class="bar grow"><i style="width:${pct(P.i, P.list.length)}%"></i></div><span class="muted small">${P.i + 1}/${P.list.length}</span></div>
    <div class="ex"><p class="ex-prompt">${esc(P.title)} <span class="muted small">· Sesión</span></p>
    <div class="card practice"><div class="practice-phrase">${r && !r.error ? colorWords(r) : tapText(en)}</div><p class="muted center">${esc(es)}</p>
      ${left > 0 ? micControls(en, 'psession') : `<div class="speak-controls">${sayBtn(en, 'lg')}</div>`}
      <div id="micres">${r ? pronResultHTML(r) : '<p class="muted center small">Escucha, luego toca el micrófono y repite</p>'}</div>
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
  }
  renderPronSession();
}
function nextPronPhrase() {
  const b = P.best[P.i];
  if (b && !b.skipped) trackType('speak', b.score >= 70);
  P.i++; P.tries = 0; P.result = null; save();
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
    <button class="btn primary wide" data-act="tab" data-tab="talk" data-seg2="pron">Continuar</button>`;
  P = null;
}

/* ===== TARJETAS (sistema de cajas + repetición en la misma sesión) ===== */
const INTERVALS = [0, 1, 2, 4, 7, 15];
const BOX_NAMES = ['Nueva', 'Fácil', 'Bien', 'Muy bien', 'Dominada'];
const dueCards = () => { const now = Date.now(); return Object.values(S.cards).filter(c => c.due <= now); };
function renderCards() {
  if (F) return reviewHTML();
  return topBar('Tarjetas', `<div class="pill">🃏 ${Object.keys(S.cards).length}</div>`) +
    `<div class="seg"><button class="${cardSeg === 'review' ? 'on' : ''}" data-act="seg" data-seg="cards:review">🔁 Repasar</button><button class="${cardSeg === 'dict' ? 'on' : ''}" data-act="seg" data-seg="cards:dict">📖 Diccionario</button></div>` +
    (cardSeg === 'review' ? reviewHomeHTML() : dictHTML());
}
function reviewHomeHTML() {
  const all = Object.values(S.cards), due = dueCards().length;
  if (!all.length) return `<div class="card center"><p style="font-size:44px;margin:0">🃏</p><b>Aún no tienes tarjetas</b><p class="muted small">Completa una lección o agrega palabras en el Diccionario.</p><button class="btn primary wide" data-act="tab" data-tab="lessons">Ir a lecciones</button></div>`;
  const counts = [1, 2, 3, 4, 5].map(b => all.filter(c => c.box === b).length), max = Math.max(...counts, 1);
  return `<section class="card"><span class="label">Repaso inteligente</span><div class="big-num">${due} <span class="small muted">para hoy</span></div>
    <p class="muted small">Si fallas una tarjeta, vuelve a aparecer en este mismo repaso hasta que la aciertes, y mañana la verás otra vez.</p>
    <div class="boxes">${counts.map((c, i) => `<div><i style="height:${Math.round(c / max * 55) + 4}px"></i>${BOX_NAMES[i]}<br><b>${c}</b></div>`).join('')}</div></section>
    <button class="btn primary wide" data-act="startrev" ${due ? '' : 'disabled'}>${due ? `Empezar repaso (${Math.min(due, 20)})` : 'Todo al día ✅'}</button>
    <button class="btn ghost wide" data-act="startrev" data-all="1">Repasar todas igual</button>`;
}
function startReview(all) {
  const list = all ? Object.values(S.cards) : dueCards();
  if (!list.length) return;
  const q = shuffle(list).slice(0, 20).map(c => c.en);
  F = { queue: q, i: 0, flip: false, unique: q.length, firstRight: 0, failed: new Set() };
  document.body.classList.add('focus'); window.scrollTo(0, 0); render();
}
function reviewHTML() {
  const en = F.queue[F.i], c = S.cards[en], again = F.failed.has(en);
  return `<div class="lesson-top"><button class="icon-btn" data-act="quit" aria-label="Salir">${ic('x')}</button><div class="bar grow"><i style="width:${pct(F.i, F.queue.length)}%"></i></div><span class="muted small">${F.queue.length - F.i} restantes</span></div>
    ${again ? '<p class="center"><span class="retry-tag">🔁 Esta la fallaste: ¡otra vez!</span></p>' : ''}
    <button class="flash ${F.flip ? 'flipped' : ''}" data-act="flip"><div class="flash-inner">
      <div class="face"><span class="label">Inglés</span><b>${esc(c.en)}</b><span class="muted small">Toca para ver la traducción</span></div>
      <div class="face back"><span class="label">Español</span><b>${esc(c.es)}</b><span>${F.flip ? tapText(c.en) : esc(c.en)}</span></div>
    </div></button>
    <div class="row" style="justify-content:center;margin-bottom:16px">${sayBtn(c.en, 'lg')}</div>
    ${F.flip ? `<div class="rate-row"><button class="btn no" data-act="rate" data-v="0">😕 No la sabía</button><button class="btn yes" data-act="rate" data-v="1">😎 La sabía</button></div>` : '<p class="muted center small">¿Recuerdas qué significa? Piénsalo y voltea la tarjeta.</p>'}`;
}
function rateCard(v) {
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
    view().innerHTML = summaryHTML({ emoji: '🧠', title: '¡Repaso terminado!', back: 'cards',
      stats: [[`+${xp}`, 'XP'], [`${right}/${unique}`, 'A la primera'], [fixed, 'Reforzadas']],
      note: fixed ? 'Las tarjetas que fallaste volverán mañana para asegurarte de no olvidarlas.' : '¡Perfecto, ninguna fallada! 🌟' });
  } else render();
}
function dictHTML() {
  const custom = Object.values(S.cards).filter(c => c.custom);
  return `<button class="card action-card" data-act="dict"><span class="icon-bubble">${ic('dict')}</span><span class="grow"><b>Buscar en el diccionario</b><small class="muted block">En inglés o en español · ${DICT ? DICT.words.length.toLocaleString('es-CL') : 'más de 3.000'} palabras, también sin internet</small></span>${ic('play', 'sm accent')}</button>
    <section class="card"><h2>➕ Agregar palabra</h2><form data-form="addword" class="stack"><input name="en" placeholder="Palabra en inglés" required autocapitalize="off" autocomplete="off"><input name="es" placeholder="Traducción al español" required autocomplete="off"><button class="btn primary">Agregar a mis tarjetas</button></form></section>
    ${custom.length ? `<section class="card"><h2>📝 Mis palabras (${custom.length})</h2>${custom.map(c => `<div class="word-row">${sayBtn(c.en, 'sm')}<div class="grow"><b>${tapText(c.en)}</b> <span class="muted">— ${esc(c.es)}</span></div><button class="icon-btn sm" data-act="delword" data-en="${esc(c.en)}" aria-label="Eliminar">${ic('trash')}</button></div>`).join('')}</section>` : ''}`;
}

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
  s.classList.add('open'); document.documentElement.classList.add('noscroll'); placeFab();
}
function setSheet(html) { const b = $('#sheetBody'); if (b) { b.innerHTML = html; b.parentElement.scrollTop = 0; } }
function closeSheet() {
  SHEET.open = false; SHEET.fromSearch = false; SHEET.word = '';
  const s = $('#sheet'); s.classList.remove('open'); s.innerHTML = '';
  document.documentElement.classList.remove('noscroll'); placeFab();
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
    <p class="muted small center">Si sabes qué significa, agrégala con tu traducción en Tarjetas › Diccionario.</p>`);
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

/* ===== Botón flotante: se ubica sobre la barra inferior o sobre "Comprobar/Continuar" ===== */
let typing = false;
function placeFab() {
  const fab = $('#dictFab'); if (!fab) return;
  const foot = $('#view .ex-foot');
  if (foot) fab.style.bottom = `${Math.round(foot.getBoundingClientRect().height) + 12}px`;
  else if (!document.body.classList.contains('focus')) fab.style.bottom = `calc(env(safe-area-inset-bottom) + ${Math.round($('#tabs').getBoundingClientRect().height) + 22}px)`;
  else fab.style.bottom = 'calc(env(safe-area-inset-bottom) + 16px)';
  fab.classList.toggle('hide', SHEET.open || typing);
}

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
  /* Primero mis reglas (explican mejor en español); LanguageTool agrega lo que ellas no ven */
  const all = [], overlaps = a => all.some(b => a.off < b.off + b.len && b.off < a.off + a.len);
  [...local, ...lt].forEach(e => { if (!overlaps(e)) all.push(e); });
  return { errors: online || DICT ? all.sort((a, b) => a.off - b.off) : null, online };
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
      ${m.errors.map(e => `<div class="wfix-item"><span class="tag-type">${esc(e.type)}</span><div><del>${esc(e.wrong)}</del> → <ins>${esc(e.right || '(quitar)')}</ins></div><div class="small">${esc(e.es)}</div></div>`).join('')}
      <div class="wfix-ok"><span class="label">Texto corregido</span><div>${tapText(correctedText(m.text, m.errors))}</div></div>`
    : '<p class="wfix-perfect">✅ ¡Muy bien! No encontré errores.</p>'}
    ${m.online === false ? '<p class="muted small">📴 Sin internet revisé solo lo básico. Con conexión la corrección es más completa.</p>' : ''}</div>`;
}
/* Guarda el texto y suma sus errores al historial (si se revisa de nuevo, reemplaza los anteriores) */
function saveWriting(entry, errors, online) {
  const wr = S.writing || (S.writing = { texts: [], errs: {} });
  const key = e => `${e.wrong.toLowerCase()} → ${(e.right || '').toLowerCase()}`;
  (entry.errors || []).forEach(e => { const it = wr.errs[key(e)]; if (it && --it.n <= 0) delete wr.errs[key(e)]; });
  entry.errors = errors ? errors.map(({ wrong, right, type, es, rule }) => ({ wrong, right, type, es, rule })) : null;
  entry.partial = !!errors && online === false;
  if (!wr.texts.includes(entry)) wr.texts.push(entry);
  if (wr.texts.length > 200) wr.texts.splice(0, wr.texts.length - 200);
  if (errors) {
    errors.forEach(e => {
      const it = wr.errs[key(e)] || (wr.errs[key(e)] = { wrong: e.wrong, right: e.right, type: e.type, es: e.es, n: 0, last: 0 });
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
  view().innerHTML = `<div class="lesson-top"><button class="icon-btn" data-act="quit" aria-label="Salir">${ic('x')}</button><div class="grow"><b>${t.icon} ${esc(t.title)}</b><div class="bar"><i style="width:${W.done ? 100 : pct(W.qi, t.questions.length)}%"></i></div></div></div>
    ${W.log.length === 1 ? '<p class="muted small center">Responde en inglés con frases completas. La app te corrige y te explica cada error en español.</p>' : ''}
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
  if (xp) addXp(xp);
  W = null;
  if (!msgs.length) { go('write'); return; }
  view().innerHTML = `<div class="summary"><div class="emoji">✍️</div><h1>¡Bien escrito!</h1>
    <div class="sum-stats"><div class="stat"><b>${msgs.length}</b><small>Respuestas</small></div><div class="stat"><b>${words}</b><small>Palabras</small></div><div class="stat"><b>${perfect}/${msgs.length}</b><small>Sin errores</small></div></div></div>
    ${errs.length ? `<section class="card"><h2>📝 Para repasar</h2>${errs.map(e => `<div class="wfix-item"><span class="tag-type">${esc(e.type)}</span><div><del>${esc(e.wrong)}</del> → <ins>${esc(e.right || '(quitar)')}</ins></div><div class="small">${esc(e.es)}</div></div>`).join('')}</section>`
      : '<section class="card center"><b>🌟 ¡No tuviste errores en este tema!</b></section>'}
    <p class="muted small center">Tus errores quedaron en Progreso y en el archivo que exportas. Para una revisión más completa, exporta tu progreso y dile a Claude «revisa mi escritura».</p>
    <button class="btn primary wide" data-act="tab" data-tab="write">Continuar</button>`;
}
function renderWriteTab() {
  const wr = S.writing || { texts: [], errs: {} }, texts = wr.texts || [];
  const words = texts.reduce((a, e) => a + (e.words || 0), 0), pending = texts.filter(e => !e.errors || e.partial).length;
  return topBar('Escribir', `<button class="icon-btn" data-act="tab" data-tab="home" aria-label="Cerrar">${ic('x')}</button>`) + `
    <p class="muted small">Elige un tema y responde en inglés. La app corrige tu ortografía y tu gramática, y te explica cada error en español.</p>
    ${texts.length ? `<div class="stats"><div class="stat">📝<b>${texts.length}</b><small>Textos</small></div><div class="stat">🔤<b>${words}</b><small>Palabras</small></div><div class="stat">🎯<b>${Object.keys(wr.errs || {}).length}</b><small>Errores distintos</small></div></div>` : ''}
    <div class="grid2">${WRITE_TOPICS.map(t => `<button class="sec-card topic" data-act="write" data-id="${t.id}"><span class="topic-icon">${t.icon}</span><b>${esc(t.title)}</b><small>${t.id === 'free' ? 'Tú eliges el tema' : `${t.questions.length} preguntas`}</small></button>`).join('')}</div>
    ${texts.length ? `<section class="card"><h2>🕘 Tus últimos textos</h2>${texts.slice(-8).reverse().map(e => { const tp = WRITE_TOPICS.find(x => x.id === e.topic); return `<button class="word-row as-btn" data-act="wview" data-t="${e.t}"><span>${tp ? tp.icon : '✍️'}</span><div class="grow"><span class="small">${esc(e.text.length > 70 ? e.text.slice(0, 70) + '…' : e.text)}</span><span class="muted small block">${new Date(e.t).toLocaleDateString('es-CL')}${tp ? ' · ' + esc(tp.title) : ''}</span></div>${e.errors ? `<span class="score-tag ${e.errors.length ? 'bad' : 'good'}">${e.errors.length ? e.errors.length + ' ✗' : '✓'}</span>` : '<span class="score-tag">Sin revisar</span>'}</button>`; }).join('')}
      ${pending ? `<button class="btn ghost wide" data-act="wpending">Revisar ${pending} ${pending === 1 ? 'texto pendiente' : 'textos pendientes'}</button>` : ''}</section>` : ''}
    <section class="card action-card"><span class="icon-bubble">${ic('upload')}</span><div class="grow"><b>Revisión con Claude</b><p class="muted small">Para una corrección más completa, exporta tu progreso y dile a Claude «revisa mi escritura». Es gratis.</p></div></section>`;
}
function viewWriting(t) {
  const e = ((S.writing || {}).texts || []).find(x => String(x.t) === String(t)); if (!e) return;
  const tp = WRITE_TOPICS.find(x => x.id === e.topic);
  openSheet(`<div class="sheet-top"><b class="grow">${tp ? tp.icon + ' ' + esc(tp.title) : '✍️ Texto'}</b><button class="icon-btn sm" data-act="sheetclose" aria-label="Cerrar">${ic('x')}</button></div>
    ${e.q ? `<p class="muted small">${tapText(e.q)}</p>` : ''}<div class="bubble me wr" style="max-width:100%">${esc(e.text)}</div>${fixHTML({ text: e.text, errors: e.errors, status: 'done', k: -1 })}`, 'word');
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

/* ===== ESTADÍSTICAS ===== */
function optionEs(d, en) {
  if (!d) return '';
  for (const n of Object.values(d.nodes)) for (const o of n.options || []) if (o.en === en) return o.es;
  return '';
}
const WD = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
function chartData() {
  const out = [];
  if (statSeg === 'week') {
    for (let k = 6; k >= 0; k--) { const d = new Date(); d.setDate(d.getDate() - k); const v = S.days[dayStr(d)] || {}; out.push({ label: WD[d.getDay()], xp: v.xp || 0, ok: v.ok || 0, fail: v.fail || 0, now: k === 0 }); }
  } else {
    for (let k = 5; k >= 0; k--) {
      const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - k);
      const pre = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
      const days = Object.entries(S.days).filter(([key]) => key.startsWith(pre)).map(([, v]) => v);
      out.push({ label: MONTHS[d.getMonth()], xp: days.reduce((a, v) => a + (v.xp || 0), 0), ok: days.reduce((a, v) => a + (v.ok || 0), 0), fail: days.reduce((a, v) => a + (v.fail || 0), 0), now: k === 0 });
    }
  }
  return out;
}
function renderStats() {
  const data = chartData(), max = Math.max(10, ...data.map(d => d.xp));
  const pXp = data.reduce((a, d) => a + d.xp, 0), pOk = data.reduce((a, d) => a + d.ok, 0), pFail = data.reduce((a, d) => a + d.fail, 0);
  const types = Object.entries(TYPE_LABELS).filter(([k]) => S.types[k] && (S.types[k].ok + S.types[k].fail) > 0);
  const weak = weakItems(8), sounds = weakSounds(8);
  const mastered = Object.values(S.cards).filter(c => c.box >= 4).length;
  const daysPracticed = Object.values(S.days).filter(d => d.xp > 0).length;
  const dWrong = Object.entries(S.dlg).flatMap(([id, st]) => Object.entries(st.wrong || {}).map(([en, n]) => ({ id, en, n }))).sort((a, b) => b.n - a.n).slice(0, 3);
  const ps = S.pronSessions || [], wTexts = (S.writing && S.writing.texts) || [];
  const wErr = Object.values((S.writing && S.writing.errs) || {}).sort((a, b) => b.n - a.n || b.last - a.last).slice(0, 5);
  return topBar('Progreso') + `
  <div class="seg"><button class="${statSeg === 'week' ? 'on' : ''}" data-act="seg" data-seg="stats:week">Semana</button><button class="${statSeg === 'month' ? 'on' : ''}" data-act="seg" data-seg="stats:month">Meses</button></div>
  <section class="card"><span class="label">XP ganada</span>
    <div class="chart">${data.map(d => `<div class="bar-col ${d.now ? 'now' : ''}"><small>${d.xp || ''}</small><i style="height:${Math.round(d.xp / max * 100)}%"></i><span>${d.label}</span></div>`).join('')}</div></section>
  <div class="grid2">
    <div class="tile t1"><small>XP ${statSeg === 'week' ? 'esta semana' : 'en 6 meses'}</small><b>${pXp}</b></div>
    <div class="tile t2"><small>Precisión</small><b>${pOk + pFail ? pct(pOk, pOk + pFail) + '%' : '—'}</b></div>
  </div>
  <div class="stats">
    <div class="stat">🔥<b>${currentStreak()}</b><small>Racha</small></div>
    <div class="stat">📅<b>${daysPracticed}</b><small>Días practicados</small></div>
    <div class="stat">🧠<b>${mastered}</b><small>Palabras dominadas</small></div>
  </div>
  <section class="card"><h2>🎯 Precisión por ejercicio</h2>
    ${types.length ? types.map(([k, label]) => { const t = S.types[k], p = pct(t.ok, t.ok + t.fail); return `<div class="type-row"><div class="row between"><span>${label}</span><span class="muted small">${p}% · ${t.ok + t.fail} intentos</span></div><div class="bar thin ${p < 60 ? 'low' : ''}"><i style="width:${p}%"></i></div></div>`; }).join('') : '<p class="muted small">Completa una lección para ver tus estadísticas.</p>'}
  </section>
  <section class="card"><h2>🔴 Lo que más te cuesta</h2>
    ${weak.length ? weak.map(i => `<div class="word-row">${sayBtn(i.en, 'sm')}<div class="grow"><b>${tapText(i.en)}</b><span class="muted small block">${esc(i.es)}</span></div><span class="score-tag bad">✗ ${i.fail}</span><span class="score-tag good">✓ ${i.ok}</span></div>`).join('')
      + `<button class="btn primary wide" data-act="lesson" data-id="auto">🎯 Practicar mis errores</button>` : '<p class="muted small">¡Aún no hay errores registrados! 🌟</p>'}
  </section>
  ${sounds.length ? `<section class="card"><h2>🎤 Palabras a mejorar al hablar</h2><div class="word-chips">${sounds.map(([w, p]) => { const g = gloss(w); return `<button class="word-chip bad" data-act="word" data-w="${esc(w)}"><b>${esc(w)}</b>${g ? `<small>${esc(g)}</small>` : ''}<small>${p.fail} ✗ · ${p.ok} ✓</small></button>`; }).join('')}</div></section>` : ''}
  ${ps.length ? `<section class="card"><h2>🎙️ Sesiones de pronunciación</h2><p class="muted small">${ps.length} ${ps.length === 1 ? 'sesión' : 'sesiones'} · promedio ${pct(ps.reduce((a, s) => a + s.avg, 0), ps.length * 100)}%</p>${ps.slice(-4).reverse().map(s => `<div class="word-row"><div class="grow"><span>${esc(s.group)}</span><span class="muted small block">${new Date(s.t).toLocaleDateString('es-CL')} · ${s.done}/${s.n} frases</span></div><span class="score-tag ${s.avg >= 70 ? 'good' : 'bad'}">${s.avg}%</span></div>`).join('')}</section>` : ''}
  ${wTexts.length ? `<section class="card"><h2>✍️ Escritura</h2><p class="muted small">${wTexts.length} ${wTexts.length === 1 ? 'texto' : 'textos'} · ${wTexts.reduce((a, e) => a + (e.words || 0), 0)} palabras · ${wTexts.filter(e => e.errors && !e.errors.length).length} sin errores</p>
    ${wErr.length ? `<span class="label">Tus errores más frecuentes</span>${wErr.map(e => `<div class="wfix-item"><span class="tag-type">${esc(e.type)} · ${e.n}×</span><div><del>${esc(e.wrong)}</del> → <ins>${esc(e.right || '(quitar)')}</ins></div><div class="small">${esc(e.es)}</div></div>`).join('')}` : '<p class="muted small">¡Aún no hay errores de escritura! 🌟</p>'}
    <button class="btn ghost wide" data-act="tab" data-tab="write">✍️ Seguir escribiendo</button></section>` : ''}
  ${dWrong.length ? `<section class="card"><h2>💬 Errores en diálogos</h2>${dWrong.map(x => { const d = DIALOGS.find(y => y.id === x.id), es = optionEs(d, x.en); return `<div class="word-row"><span>${d ? d.icon : '💬'}</span><div class="grow"><span class="small">“${esc(x.en)}”</span>${es ? `<span class="muted small block">${esc(es)}</span>` : ''}<span class="muted small block">${d ? esc(d.title) : ''}</span></div><span class="score-tag bad">${x.n}×</span></div>`; }).join('')}</section>` : ''}
  <section class="card action-card"><span class="icon-bubble">${ic('upload')}</span><div class="grow"><b>Revisión con Claude</b><p class="muted small">Exporta tu progreso, guárdalo en tu PC en <b>APP 2.0\\progreso</b> y dile a Claude "revisa mi progreso".</p></div></section>
  <button class="btn primary wide" data-act="export">${ic('upload', 'sm')} Exportar progreso</button>`;
}

/* ===== Respaldo: exportar e importar ===== */
function buildSummary() {
  const types = {};
  Object.entries(S.types).forEach(([k, t]) => { types[TYPE_LABELS[k] || k] = { aciertos: t.ok, errores: t.fail, precision: pct(t.ok, t.ok + t.fail) + '%' }; });
  return {
    nivel: levelInfo().L, xp: S.xp, racha: currentStreak(),
    lecciones_completadas: allLessons().filter(l => S.done[l.id]).map(l => l.title),
    dialogos_completados: DIALOGS.filter(d => S.dialogs[d.id]).map(d => d.title),
    precision_por_tipo: types,
    palabras_dificiles: weakItems(30).map(i => ({ en: i.en, es: i.es, errores: i.fail, aciertos: i.ok })),
    palabras_a_mejorar_al_hablar: weakSounds(20).map(([w, p]) => ({ palabra: w, errores: p.fail, aciertos: p.ok })),
    sesiones_pronunciacion: (S.pronSessions || []).slice(-15).map(s => ({ fecha: dayStr(new Date(s.t)), grupo: s.group, frases: `${s.done}/${s.n}`, promedio: s.avg + '%', palabras_a_practicar: s.words })),
    escritura: (() => {
      const wr = S.writing || { texts: [], errs: {} };
      return {
        textos: wr.texts.length, palabras: wr.texts.reduce((a, e) => a + (e.words || 0), 0),
        errores_frecuentes: Object.values(wr.errs).sort((a, b) => b.n - a.n).slice(0, 25).map(e => ({ error: e.wrong, correcto: e.right, tipo: e.type, explicacion: e.es, veces: e.n })),
        ultimos_textos: wr.texts.slice(-15).map(e => { const tp = WRITE_TOPICS.find(x => x.id === e.topic); return { fecha: dayStr(new Date(e.t)), tema: tp ? tp.title : e.topic, pregunta: e.q, texto: e.text, revisado: e.errors ? (e.partial ? 'solo lo básico (sin internet)' : 'sí') : 'no', errores: (e.errors || []).map(x => ({ error: x.wrong, correcto: x.right, explicacion: x.es })) }; })
      };
    })(),
    tarjetas: { total: Object.keys(S.cards).length, por_caja: [1, 2, 3, 4, 5].map(b => Object.values(S.cards).filter(c => c.box === b).length) }
  };
}
function exportData() {
  S.lastExport = Date.now(); save(); checkAch();
  const payload = { app: 'fluenta', kind: 'progress', version: 2, exportedAt: new Date().toISOString(), summary: buildSummary(), state: S };
  const name = `fluenta-progreso-${dayStr()}.json`;
  const text = JSON.stringify(payload, null, 1);
  const mobile = /iphone|ipad|ipod|android/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent));
  try {
    const file = new File([text], name, { type: 'application/json' });
    if (mobile && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: 'Progreso Fluenta' }).catch(() => {});
      return;
    }
  } catch (e) {}
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast('📤 Archivo de progreso creado');
}
function validPairs(arr) { return Array.isArray(arr) ? arr.filter(p => Array.isArray(p) && typeof p[0] === 'string' && typeof p[1] === 'string' && p[0].trim()).map(p => [p[0].trim(), p[1].trim()]) : []; }
function importText(text) {
  let data;
  try { data = JSON.parse(text); } catch (e) { toast('⚠️ El archivo no es válido'); return; }
  if (!data || data.app !== 'fluenta') { toast('⚠️ Este archivo no es de Fluenta'); return; }
  if (data.kind === 'progress' && data.state) {
    if (!confirm('¿Restaurar este progreso? Reemplazará el progreso actual de este teléfono.')) return;
    S = { ...fresh(), ...data.state }; save(); applyTheme(); go('home'); toast('✅ Progreso restaurado');
  } else if (data.kind === 'pack') {
    const words = validPairs(data.words), sentences = validPairs(data.sentences);
    if (!words.length && !sentences.length) { toast('⚠️ El refuerzo no tiene contenido'); return; }
    const pack = { id: 'pack-' + (data.id || Date.now()), title: String(data.title || 'Refuerzo de Claude').slice(0, 40), icon: data.icon || '✨', note: String(data.note || '').slice(0, 80), tip: String(data.tip || '').slice(0, 400), words, sentences, focus: true };
    S.packs = S.packs.filter(p => p.id !== pack.id); S.packs.unshift(pack); save();
    go('lessons'); toast(`✨ Nuevo refuerzo: ${pack.title}`);
  } else toast('⚠️ No reconozco este archivo');
}

/* ===== PERFIL ===== */
function renderProfile() {
  const lv = levelInfo();
  const stat = (i, v, l) => `<div class="stat">${i}<b>${v}</b><small>${l}</small></div>`;
  const th = (v, l) => `<button class="${S.theme === v ? 'on' : ''}" data-act="theme" data-v="${v}">${l}</button>`;
  const accent = currentAccent(), preset = ACCENTS.find(a => a[0] === accent);
  return topBar('Perfil', `<button class="icon-btn" data-act="tab" data-tab="home" aria-label="Cerrar">${ic('x')}</button>`) + `
  <section class="card profile-head"><div class="avatar lg">${esc((S.name || '🙂')[0].toUpperCase())}</div><div><b>${esc(S.name || 'Estudiante')}</b><p class="muted small">Nivel ${lv.L} · Liga ${leagueName()} · ${Object.keys(S.ach).length}/${ACH.length} logros</p></div></section>
  <div class="stats">${stat('🔥', currentStreak(), 'Racha')}${stat('⭐', S.xp, 'XP total')}${stat('📚', allLessons().filter(l => S.done[l.id]).length + '/' + allLessons().length, 'Lecciones')}${stat('🃏', Object.keys(S.cards).length, 'Palabras')}${stat('💬', Object.keys(S.dialogs).length + '/' + DIALOGS.length, 'Diálogos')}${stat('🎤', S.bestPron + '%', 'Mejor voz')}</div>
  <section class="card"><h2>🎨 Apariencia</h2>
    <div class="field">Modo<div class="seg mini">${th('light', '☀️ Claro')}${th('dark', '🌙 Oscuro')}${th('auto', '⚙️ Auto')}</div>
      ${S.theme === 'auto' ? '<small class="muted block" style="margin-top:6px">Sigue el modo claro u oscuro de tu iPhone.</small>' : ''}</div>
    <div class="field">Color principal
      <div class="swatches">${ACCENTS.map(([hex, name]) => `<button class="swatch ${accent === hex ? 'on' : ''}" style="--sw:${hex}" data-act="accent" data-v="${hex}" aria-label="${name}"></button>`).join('')}</div>
      <div class="btn ghost wide other-color"><span class="dot" style="--sw:${accent}"></span>🎨 Otro color<input type="color" id="setAccent" value="${accent}" aria-label="Elegir otro color"></div>
      <small class="muted block center" style="margin-top:8px">Color actual: <b>${esc(preset ? preset[1] : 'elegido por ti')}</b>${accent !== DEFAULT_ACCENT ? ' · <button class="link-inline" data-act="accent" data-v="' + DEFAULT_ACCENT + '">volver al original</button>' : ''}</small></div>
  </section>
  <section class="card"><h2>💾 Respaldo</h2>
    <p class="muted small">Exporta un archivo con todo tu progreso. Sirve como copia de seguridad y para que Claude revise tus errores y te prepare refuerzos.${S.lastExport ? ` Última copia: ${new Date(S.lastExport).toLocaleDateString('es-CL')}.` : ''}</p>
    <button class="btn primary wide" data-act="export">${ic('upload', 'sm')} Exportar progreso</button>
    <button class="btn ghost wide" data-act="import">${ic('download', 'sm')} Importar archivo (progreso o refuerzo)</button></section>
  <section class="card"><h2>🏅 Logros</h2><div class="ach-grid">${ACH.map(a => `<div class="ach ${S.ach[a.id] ? 'on' : ''}"><span>${a.icon}</span><b>${a.name}</b><small>${a.desc}</small></div>`).join('')}</div></section>
  <section class="card"><h2>⚙️ Ajustes</h2>
    <label class="field">Tu nombre<input id="setName" value="${esc(S.name)}" placeholder="¿Cómo te llamas?" maxlength="20" autocomplete="off"></label>
    <label class="field">Velocidad de la voz: <b id="rateVal">${S.rate.toFixed(1)}x</b><input id="setRate" type="range" min="0.5" max="1.2" step="0.1" value="${S.rate}"></label>
    <label class="field">Meta diaria<select id="setGoal">${[10, 20, 30, 50, 80].map(g => `<option value="${g}" ${S.goal === g ? 'selected' : ''}>${g} XP al día</option>`).join('')}</select></label>
    <button class="btn ghost wide" data-act="say" data-t="Hello! This is how I sound. Let's practice English together!">🔊 Probar voz</button>
    <button class="btn danger wide" data-act="reset">Reiniciar todo el progreso</button></section>
  <p class="muted small center">Fluenta 2.5 · tu app de inglés, gratis para siempre 💜</p>
  <p class="muted small center">Diccionario basado en la lista NGSL 1.2 (Browne, Culligan y Phillips, licencia CC BY-SA 4.0). Respaldo en internet: Wiktionary.</p>`;
}

/* ===== Acciones (botones) ===== */
const ACTIONS = {
  tab: el => { if (el.dataset.seg2) talkSeg = el.dataset.seg2; go(el.dataset.tab); },
  seg: el => { const [k, v] = el.dataset.seg.split(':'); if (k === 'talk') talkSeg = v; else if (k === 'cards') cardSeg = v; else statSeg = v; render(); },
  say: el => speak(el.dataset.t, !!el.dataset.slow),
  lesson: el => startLesson(el.dataset.id),
  begin: () => { if (!L) return; L.intro = false; renderLesson(); if (L.queue[0].type === 'listen') speak(L.queue[0].say); },
  opt: el => { if (!L || L.answered) return; L.sel = +el.dataset.i; renderLesson(); },
  chip: el => { if (!L || L.answered) return; L.built.push(+el.dataset.i); renderLesson(); },
  chipback: el => { if (!L || L.answered) return; L.built.splice(+el.dataset.k, 1); renderLesson(); },
  check: () => { if (!L) return; if (L.answered) nextExercise(); else evaluateLesson(); },
  speakskip: () => { if (!L) return; L.answered = true; L.ok = true; L.skipped = true; if (!L.queue[L.i].retry) L.first++; renderLesson(); },
  quit: () => {
    const back = L ? 'lessons' : (D || P) ? 'talk' : W ? 'write' : 'cards';
    if (((L && !L.intro) || (D && !D.finished) || (P && P.best.length)) && !confirm('¿Salir? Perderás el progreso de esta actividad.')) return;
    go(back);
  },
  mic: el => {
    const ctx = el.dataset.ctx;
    let targets;
    if (ctx === 'lesson') targets = L.queue[L.i].say;
    else if (ctx === 'dialog') targets = D.opts.filter(o => o.go).map(o => o.en);
    else if (ctx === 'psession') { if (!P || P.tries >= PS_TRIES) return; targets = P.list[P.i][0]; }
    else targets = pronCurrent || PRON[0].phrases[0][0];
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    el.classList.add('listening');
    const res = $('#micres'); if (res) res.innerHTML = '<p class="center listening-txt">🎙️ Escuchando… habla ahora</p>';
    listen(targets, r => {
      el.classList.remove('listening');
      if (!r.error) { S.bestPron = Math.max(S.bestPron, r.score); save(); checkAch(); }
      if (ctx === 'lesson') onLessonMic(r); else if (ctx === 'dialog') onDialogMic(r); else if (ctx === 'psession') onSessionMic(r); else onPronMic(targets, r);
    });
  },
  psession: el => startPronSession(el.dataset.g),
  psnext: () => { if (P && P.best[P.i]) nextPronPhrase(); },
  psskip: () => { if (!P) return; const [en, es] = P.list[P.i]; P.best[P.i] = { en, es, skipped: true }; nextPronPhrase(); },
  dialog: el => startDialog(el.dataset.id, el.dataset.mode),
  dopt: el => {
    if (!D || D.finished) return;
    const o = D.opts[+el.dataset.i];
    if (o.go) { trackType('dialog', true); save(); chooseOption(o); }
    else {
      D.wrong++; trackType('dialog', false);
      const st = S.dlg[D.d.id] || (S.dlg[D.d.id] = { plays: 0, wrong: {} }); st.wrong[o.en] = (st.wrong[o.en] || 0) + 1; save();
      D.fb = o.fb || 'Esa respuesta no encaja aquí. ¡Prueba otra!'; renderDialog();
    }
  },
  dskip: () => { if (!D || D.finished) return; chooseOption(pick(D.opts.filter(o => o.go))); },
  dfinish: () => { if (D) finishDialog(); },
  tr: el => { const i = +el.dataset.i; D.showEs[i] = !D.showEs[i]; renderDialog(); },
  pphrase: el => { pronCurrent = el.dataset.t; pronResult = null; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); speak(pronCurrent); },
  startrev: el => startReview(!!el.dataset.all),
  flip: () => { F.flip = !F.flip; render(); if (F.flip) speak(S.cards[F.queue[F.i]].en); },
  rate: el => rateCard(el.dataset.v === '1'),
  write: el => startWrite(el.dataset.id),
  wsend: () => sendWriting(),
  wskip: () => { if (W && !W.busy) nextWriteQuestion(true); },
  wend: () => { if (W && !W.busy) finishWrite(); },
  wtr: el => { const i = +el.dataset.i; W.showEs[i] = !W.showEs[i]; renderWriteChat(); },
  wretry: async el => {
    const m = W && W.log[+el.dataset.k]; if (!m) return;
    m.status = 'checking'; renderWriteChat();
    const r = await checkWriting(m.text, m.entry.q);
    saveWriting(m.entry, r.errors, r.online);
    m.status = 'done'; m.errors = r.errors; m.online = r.online; if (W) renderWriteChat();
  },
  wview: el => viewWriting(el.dataset.t),
  wpending: () => reviewPending(),
  word: el => openWord(el.dataset.w),
  dict: () => openSearch(),
  sheetclose: () => closeSheet(),
  addcardw: el => {
    const { en, es } = el.dataset; if (S.cards[en]) return;
    S.cards[en] = { en, es, box: 1, due: 0 }; save(); toast('🃏 Agregada a tus tarjetas');
    el.outerHTML = '<p class="center"><span class="add-btn added">✓ Agregada a tus tarjetas</span></p>';
    if (tab === 'cards' && !F && !SHEET.open) render();
  },
  delword: el => { if (!confirm(`¿Eliminar "${el.dataset.en}"?`)) return; delete S.cards[el.dataset.en]; save(); render(); },
  delpack: el => { if (!confirm('¿Eliminar este refuerzo?')) return; S.packs = S.packs.filter(p => p.id !== el.dataset.id); save(); render(); },
  export: () => exportData(),
  import: () => { const f = $('#importFile'); f.value = ''; f.click(); },
  theme: el => { S.theme = el.dataset.v; save(); applyTheme(); render(); },
  accent: el => { const v = el.dataset.v; S.accent = v === DEFAULT_ACCENT ? '' : v; save(); applyTheme(); render(); toast('🎨 Color cambiado'); },
  reset: () => { if (!confirm('¿Seguro? Se borrará todo tu progreso, XP y tarjetas.')) return; S = fresh(); save(); applyTheme(); go('home'); toast('Progreso reiniciado'); }
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = ACTIONS[el.dataset.act];
  if (fn) { e.preventDefault(); fn(el); }
});
document.addEventListener('submit', e => {
  const f = e.target; e.preventDefault();
  if (f.dataset.form === 'addword') {
    const en = f.en.value.trim(), es = f.es.value.trim(); if (!en || !es) return;
    if (S.cards[en]) { toast('Esa palabra ya está en tus tarjetas'); return; }
    S.cards[en] = { en, es, box: 1, due: 0, custom: true }; S.added++; save(); checkAch();
    toast('📝 Palabra agregada'); render();
  } else if (f.dataset.form === 'custom') {
    const p = f.phrase.value.trim(); if (!p) return;
    pronCurrent = p; pronResult = null; render(); speak(p);
  }
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'dq') { dictSearchQ = t.value; renderSearch(); }
  else if (t.id === 'wtext' && W) { W.draft = t.value; const c = $('#wcount'); if (c) c.textContent = `${wordCount(W.draft)} palabras`; }
  else if (t.id === 'setName') { S.name = t.value.trim(); save(); }
  else if (t.id === 'setRate') { S.rate = +t.value; $('#rateVal').textContent = S.rate.toFixed(1) + 'x'; save(); }
  else if (t.id === 'setAccent') { S.accent = t.value; applyTheme(); }   /* se ve al instante mientras eliges */
});
document.addEventListener('change', e => {
  if (e.target.id === 'setGoal') { S.goal = +e.target.value; save(); }
  else if (e.target.id === 'setAccent') { S.accent = e.target.value.toLowerCase() === DEFAULT_ACCENT ? '' : e.target.value.toLowerCase(); save(); applyTheme(); render(); toast('🎨 Color cambiado'); }
  else if (e.target.id === 'importFile') {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    const r = new FileReader(); r.onload = () => importText(String(r.result)); r.readAsText(file);
  }
});

/* ===== Diccionario flotante: botón, hoja emergente y su posición ===== */
document.body.insertAdjacentHTML('beforeend', `<button id="dictFab" class="dict-fab" data-act="dict" aria-label="Diccionario">${ic('dict')}</button><div id="sheet" class="sheet-wrap"></div>`);
new MutationObserver(placeFab).observe($('#view'), { childList: true });
window.addEventListener('resize', placeFab);
const isTyping = el => el && (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && !['range', 'checkbox', 'radio', 'button', 'submit', 'color'].includes(el.type)));
document.addEventListener('focusin', e => { typing = isTyping(e.target) && !e.target.closest('#sheet'); placeFab(); });
document.addEventListener('focusout', () => setTimeout(() => { typing = isTyping(document.activeElement) && !document.activeElement.closest('#sheet'); placeFab(); }, 50));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && SHEET.open) closeSheet(); });

/* ===== Inicio de la app ===== */
applyTheme();
renderNav();
render();
checkAch();
setTimeout(() => loadDict().catch(() => {}), 1200);
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
