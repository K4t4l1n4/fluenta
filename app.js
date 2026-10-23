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
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 15h10l1-15"/>'
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

/* ===== Datos guardados (en el teléfono) ===== */
const KEY = 'fluenta-v1';
const DEFAULT = {
  version: 2, xp: 0, weekXp: 0, weekKey: '', streak: 0, lastDay: '', dailyXp: 0, dailyDay: '', goal: 30,
  done: {}, dialogs: {}, ends: {}, dlg: {}, bestPron: 0, pron: {}, cards: {}, reviews: 0, added: 0, ach: {},
  rate: 0.9, name: '', theme: 'light',
  items: {}, types: {}, days: {}, pw: {}, log: [], packs: [], lastExport: 0, autoDone: 0
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
const TYPE_LABELS = { meaning: 'Significado', translate: 'Traducir al inglés', listen: 'Escuchar', order: 'Ordenar frases', fill: 'Completar', speak: 'Hablar', card: 'Tarjetas', dialog: 'Diálogos' };
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
const allPhrases = () => PRON.flatMap(c => c.phrases);
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
let tab = 'home', talkSeg = 'dialogs', cardSeg = 'review', statSeg = 'week', dictQ = '';
let pronCurrent = null, pronResult = null, L = null, D = null, F = null;
const view = () => $('#view');
function go(t) {
  tab = t; L = null; D = null; F = null;
  document.body.classList.remove('focus');
  try { rec && rec.abort(); } catch (e) {}
  render(); window.scrollTo(0, 0);
}
function render() {
  rollover();
  document.querySelectorAll('#tabs [data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  view().innerHTML = ({ home: renderHome, lessons: renderLessons, talk: renderTalk, cards: renderCards, stats: renderStats, profile: renderProfile })[tab]();
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

/* ===== Tema claro / oscuro ===== */
const darkMQ = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
function applyTheme() {
  const t = S.theme === 'auto' ? (darkMQ && darkMQ.matches ? 'dark' : 'light') : S.theme;
  document.documentElement.dataset.theme = t;
  const m = $('meta[name="theme-color"]'); if (m) m.content = t === 'dark' ? '#14152b' : '#ece9ff';
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
    body += `<div class="ex-big">${esc(ex.big)}${ex.big === ex.say ? ' ' + sayBtn(ex.say) : ''}</div>${optionsHTML(ex)}`;
  } else if (ex.type === 'listen') {
    body += `<div class="listen-wrap"><button class="speaker-big" data-act="say" data-t="${esc(ex.say)}" aria-label="Escuchar">${ic('volume')}</button><button class="round-btn" data-act="say" data-t="${esc(ex.say)}" data-slow="1" aria-label="Lento">🐢</button></div>${optionsHTML(ex)}`;
  } else if (ex.type === 'fill') {
    body += `<p class="muted">${esc(ex.hint)}</p><div class="ex-sentence">${esc(ex.before)} <span class="blank">${L.sel != null ? esc(ex.options[L.sel]) : '&nbsp;'}</span>${esc(ex.after)}</div>${optionsHTML(ex)}`;
  } else if (ex.type === 'order') {
    const used = new Set(L.built);
    body += `<div class="ex-big es">${esc(ex.big)}</div>
      <div class="answer-line">${L.built.map((ti, k) => `<button class="chip" data-act="chipback" data-k="${k}">${esc(ex.tokens[ti])}</button>`).join('') || '<span class="muted small">Toca las palabras en orden</span>'}</div>
      <div class="bank">${ex.tokens.map((t, i) => `<button class="chip ${used.has(i) ? 'used' : ''}" data-act="chip" data-i="${i}" ${used.has(i) ? 'disabled' : ''}>${esc(t)}</button>`).join('')}</div>`;
  } else if (ex.type === 'speak') {
    body += `<div class="speak-card card"><div class="ex-big center-big">${esc(ex.big)}</div><p class="muted center">${esc(ex.sub)}</p>${micControls(ex.say, 'lesson')}
      <div id="micres">${L.result ? pronResultHTML(L.result) : '<p class="muted center small">Escucha, luego toca el micrófono y lee la frase</p>'}</div></div>
      ${!L.answered ? '<button class="link" data-act="speakskip">No puedo hablar ahora</button>' : ''}`;
  }
  const canCheck = L.answered || (ex.type === 'order' ? L.built.length > 0 : L.sel != null);
  let foot = '';
  if (L.answered) {
    const title = L.skipped ? 'Sin problema 👌' : L.ok ? pick(['¡Correcto! 🎉', '¡Excelente! ⭐', '¡Muy bien! 💪', '¡Perfecto! 🙌']) : 'Casi… 😅';
    const bodyTxt = L.skipped ? 'La practicarás en otra ocasión.' : L.ok ? (ex.type === 'order' || ex.type === 'fill' ? esc(ex.say) : '')
      : `Respuesta correcta: <b>${esc(ex.type === 'fill' ? ex.say : ex.answer)}</b><br><small>La repetirás al final de la lección.</small>`;
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
  D.log.push({ who: 'me', en: o.en, score });
  D.steps++;
  enterNode(o.go);
  renderDialog();
  setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50);
}
function renderDialog() {
  const valid = D.opts.filter(o => o.go);
  const chat = D.log.map((m, i) => m.who === 'npc'
    ? `<div class="bubble npc"><div class="row gap-s">${sayBtn(m.en, 'sm')}<span class="grow">${esc(m.en)}</span></div><button class="tr" data-act="tr" data-i="${i}">${D.showEs[i] ? esc(m.es) : 'Ver traducción'}</button></div>`
    : `<div class="bubble me">${esc(m.en)}${m.score != null ? `<span class="score-tag">🎤 ${m.score}%</span>` : ''}</div>`).join('');
  let input;
  if (D.finished) {
    input = `<div class="end-card"><b>🎉 ¡Fin de la conversación!</b><p class="muted small">Llegaste a un final. Repite el diálogo y responde distinto para descubrir otros caminos.</p><button class="btn primary wide" data-act="dfinish">Terminar</button></div>`;
  } else if (D.mode === 'choose') {
    input = `<p class="ex-prompt small">Elige tu respuesta:</p><div class="options">${D.opts.map((o, i) => `<button class="opt" data-act="dopt" data-i="${i}">${esc(o.en)}<span class="muted small block">${esc(o.es)}</span></button>`).join('')}</div>${D.fb ? `<div class="fb bad">${esc(D.fb)}</div>` : ''}`;
  } else {
    input = `<p class="ex-prompt small">Di en voz alta <u>una</u> de estas respuestas:</p>
      <div class="stack">${valid.map(o => `<div class="say-card"><div class="row gap-s">${sayBtn(o.en, 'sm')}<b class="grow">${esc(o.en)}</b></div><span class="muted small block">${esc(o.es)}</span></div>`).join('')}</div>
      ${micControls('', 'dialog')}<div id="micres">${D.result ? pronResultHTML(D.result) : '<p class="muted small center">Cada respuesta lleva la conversación por un camino distinto.</p>'}</div>
      ${D.result && !D.result.error && D.result.score < 60 ? '<p class="muted small center">Necesitas 60% para avanzar. ¡Tú puedes!</p>' : ''}
      <button class="link" data-act="dskip">No puedo hablar ahora (elegir al azar)</button>`;
  }
  view().innerHTML = `<div class="lesson-top"><button class="icon-btn" data-act="quit" aria-label="Salir">${ic('x')}</button><div class="grow"><b>${D.d.icon} ${esc(D.d.title)}</b><div class="bar"><i style="width:${D.finished ? 100 : Math.min(95, pct(D.steps, D.max))}%"></i></div></div></div>
    <div class="chat">${chat}</div><div class="dlg-input">${input}</div>`;
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
function pronHTML() {
  const cur = pronCurrent || PRON[0].phrases[0];
  const wordsHTML = pronResult && !pronResult.error ? pronResult.words.map(w => `<span class="${w.ok ? 'w-ok' : 'w-bad'}">${esc(w.w)}</span>`).join(' ') : esc(cur);
  return `<div class="card practice"><div class="speaker-wrap"><button class="speaker-big" data-act="say" data-t="${esc(cur)}" aria-label="Escuchar">${ic('volume')}</button></div>
    <div class="practice-phrase">${wordsHTML}</div>${micControls(cur, 'pron')}
    <div id="micres">${pronResult ? pronResultHTML(pronResult) : '<p class="muted center small">Escucha, luego toca el micrófono y repite</p>'}</div>
    <form class="row gap" data-form="custom" style="margin-top:14px"><input name="phrase" placeholder="Escribe tu propia frase en inglés…" autocomplete="off" autocapitalize="off"><button class="btn ghost">Usar</button></form></div>
    <p class="muted small">ℹ️ La app compara lo que entiende el reconocimiento de voz con la frase. Las palabras en rojo son las que debes practicar.</p>` +
    PRON.map(c => `<h3>${c.icon} ${esc(c.title)}</h3><p class="muted small">${esc(c.tip)}</p><div class="phrase-list">${c.phrases.map(p =>
      `<button class="phrase ${p === cur ? 'on' : ''}" data-act="pphrase" data-t="${esc(p)}"><span>${esc(p)}</span>${S.pron[p] != null ? `<span class="score-tag">${S.pron[p]}%</span>` : ''}</button>`).join('')}</div>`).join('');
}
function onPronMic(target, r) {
  pronResult = r;
  if (!r.error) {
    trackPron(r); trackType('speak', r.score >= 70);
    S.pron[target] = Math.max(S.pron[target] || 0, r.score); save();
    const xp = r.score >= 90 ? 5 : r.score >= 70 ? 3 : 0;
    if (xp) { addXp(xp); toast(`+${xp} XP 🎤`); }
  }
  if (tab === 'talk' && talkSeg === 'pron' && !D) render();
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
      <div class="face back"><span class="label">Español</span><b>${esc(c.es)}</b><span>${esc(c.en)}</span></div>
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
function dictionaryWords() {
  const map = new Map();
  allLessons().forEach(l => l.words.forEach(w => map.set(w[0], w[1])));
  Object.values(S.cards).forEach(c => map.set(c.en, c.es));
  return [...map.entries()];
}
function dictHTML() {
  const custom = Object.values(S.cards).filter(c => c.custom);
  return `<div class="search"><input id="dictq" type="search" placeholder="Busca en inglés o español…" autocomplete="off" autocapitalize="off" value="${esc(dictQ)}"></div>
    <div id="dictres">${dictResultsHTML()}</div>
    <section class="card"><h2>➕ Agregar palabra</h2><form data-form="addword" class="stack"><input name="en" placeholder="Palabra en inglés" required autocapitalize="off" autocomplete="off"><input name="es" placeholder="Traducción al español" required autocomplete="off"><button class="btn primary">Agregar a mis tarjetas</button></form></section>
    ${custom.length ? `<section class="card"><h2>📝 Mis palabras (${custom.length})</h2>${custom.map(c => `<div class="word-row">${sayBtn(c.en, 'sm')}<div class="grow"><b>${esc(c.en)}</b> <span class="muted">— ${esc(c.es)}</span></div><button class="icon-btn sm" data-act="delword" data-en="${esc(c.en)}" aria-label="Eliminar">${ic('trash')}</button></div>`).join('')}</section>` : ''}`;
}
function dictResultsHTML() {
  const q = deaccent(dictQ.trim());
  if (!q) return `<p class="muted small center">Escribe una palabra para buscarla. Puedes ver su definición en inglés y agregarla a tus tarjetas.</p>`;
  const res = dictionaryWords().filter(([en, es]) => deaccent(en).includes(q) || deaccent(es).includes(q)).slice(0, 20);
  const isEnglish = /^[a-z' -]+$/i.test(dictQ.trim());
  return `<section class="card">${res.length ? res.map(([en, es]) => `<div class="word-row">${sayBtn(en, 'sm')}<div class="grow"><b>${esc(en)}</b> <span class="muted">— ${esc(es)}</span></div>${S.cards[en] ? '<span class="add-btn added">✓ En tarjetas</span>' : `<button class="add-btn" data-act="addcard" data-en="${esc(en)}" data-es="${esc(es)}">+ Tarjeta</button>`}</div>`).join('') : '<p class="muted small">No está en el diccionario de la app.</p>'}
    ${isEnglish ? `<button class="btn ghost wide" data-act="define">📖 Definición en inglés de “${esc(dictQ.trim())}”</button>` : ''}<div id="defbox"></div></section>`;
}
async function defineWord() {
  const word = dictQ.trim().toLowerCase(), box = $('#defbox'); if (!box || !word) return;
  box.innerHTML = '<p class="muted small center">Buscando…</p>';
  try {
    const r = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(word));
    if (!r.ok) { box.innerHTML = '<p class="muted small">No encontré esa palabra en el diccionario de inglés.</p>'; return; }
    const data = await r.json(), e = data[0];
    const phon = e.phonetic || (e.phonetics.find(p => p.text) || {}).text || '';
    box.innerHTML = `<div style="margin-top:12px"><b style="font-size:20px">${esc(e.word)}</b> <span class="muted">${esc(phon)}</span> ${sayBtn(e.word, 'sm')}
      ${e.meanings.slice(0, 3).map(m => `<div class="def-pos">${esc(m.partOfSpeech)}</div>${m.definitions.slice(0, 2).map(d => `<div class="def-item">• ${esc(d.definition)}${d.example ? `<div class="def-ex">“${esc(d.example)}”</div>` : ''}</div>`).join('')}`).join('')}</div>`;
  } catch (err) { box.innerHTML = '<p class="muted small">Necesitas internet para ver definiciones.</p>'; }
}

/* ===== ESTADÍSTICAS ===== */
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
    ${weak.length ? weak.map(i => `<div class="word-row">${sayBtn(i.en, 'sm')}<div class="grow"><b>${esc(i.en)}</b><span class="muted small block">${esc(i.es)}</span></div><span class="score-tag bad">✗ ${i.fail}</span><span class="score-tag good">✓ ${i.ok}</span></div>`).join('')
      + `<button class="btn primary wide" data-act="lesson" data-id="auto">🎯 Practicar mis errores</button>` : '<p class="muted small">¡Aún no hay errores registrados! 🌟</p>'}
  </section>
  ${sounds.length ? `<section class="card"><h2>🎤 Palabras a mejorar al hablar</h2><div class="word-chips">${sounds.map(([w, p]) => `<button class="word-chip bad" data-act="say" data-t="${esc(w)}"><b>${esc(w)}</b><small>${p.fail} ✗ · ${p.ok} ✓</small></button>`).join('')}</div></section>` : ''}
  ${dWrong.length ? `<section class="card"><h2>💬 Errores en diálogos</h2>${dWrong.map(x => { const d = DIALOGS.find(y => y.id === x.id); return `<div class="word-row"><span>${d ? d.icon : '💬'}</span><div class="grow"><span class="small">“${esc(x.en)}”</span><span class="muted small block">${d ? esc(d.title) : ''}</span></div><span class="score-tag bad">${x.n}×</span></div>`; }).join('')}</section>` : ''}
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
  return topBar('Perfil', `<button class="icon-btn" data-act="tab" data-tab="home" aria-label="Cerrar">${ic('x')}</button>`) + `
  <section class="card profile-head"><div class="avatar lg">${esc((S.name || '🙂')[0].toUpperCase())}</div><div><b>${esc(S.name || 'Estudiante')}</b><p class="muted small">Nivel ${lv.L} · Liga ${leagueName()} · ${Object.keys(S.ach).length}/${ACH.length} logros</p></div></section>
  <div class="stats">${stat('🔥', currentStreak(), 'Racha')}${stat('⭐', S.xp, 'XP total')}${stat('📚', allLessons().filter(l => S.done[l.id]).length + '/' + allLessons().length, 'Lecciones')}${stat('🃏', Object.keys(S.cards).length, 'Palabras')}${stat('💬', Object.keys(S.dialogs).length + '/' + DIALOGS.length, 'Diálogos')}${stat('🎤', S.bestPron + '%', 'Mejor voz')}</div>
  <section class="card"><h2>💾 Respaldo</h2>
    <p class="muted small">Exporta un archivo con todo tu progreso. Sirve como copia de seguridad y para que Claude revise tus errores y te prepare refuerzos.${S.lastExport ? ` Última copia: ${new Date(S.lastExport).toLocaleDateString('es-CL')}.` : ''}</p>
    <button class="btn primary wide" data-act="export">${ic('upload', 'sm')} Exportar progreso</button>
    <button class="btn ghost wide" data-act="import">${ic('download', 'sm')} Importar archivo (progreso o refuerzo)</button></section>
  <section class="card"><h2>🏅 Logros</h2><div class="ach-grid">${ACH.map(a => `<div class="ach ${S.ach[a.id] ? 'on' : ''}"><span>${a.icon}</span><b>${a.name}</b><small>${a.desc}</small></div>`).join('')}</div></section>
  <section class="card"><h2>⚙️ Ajustes</h2>
    <label class="field">Tu nombre<input id="setName" value="${esc(S.name)}" placeholder="¿Cómo te llamas?" maxlength="20" autocomplete="off"></label>
    <div class="field">Apariencia<div class="seg mini">${th('light', '☀️ Claro')}${th('dark', '🌙 Oscuro')}${th('auto', '⚙️ Auto')}</div></div>
    <label class="field">Velocidad de la voz: <b id="rateVal">${S.rate.toFixed(1)}x</b><input id="setRate" type="range" min="0.5" max="1.2" step="0.1" value="${S.rate}"></label>
    <label class="field">Meta diaria<select id="setGoal">${[10, 20, 30, 50, 80].map(g => `<option value="${g}" ${S.goal === g ? 'selected' : ''}>${g} XP al día</option>`).join('')}</select></label>
    <button class="btn ghost wide" data-act="say" data-t="Hello! This is how I sound. Let's practice English together!">🔊 Probar voz</button>
    <button class="btn danger wide" data-act="reset">Reiniciar todo el progreso</button></section>
  <p class="muted small center">Fluenta 2.0 · tu app de inglés, gratis para siempre 💜</p>`;
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
    const back = L ? 'lessons' : D ? 'talk' : 'cards';
    if (((L && !L.intro) || (D && !D.finished)) && !confirm('¿Salir? Perderás el progreso de esta actividad.')) return;
    go(back);
  },
  mic: el => {
    const ctx = el.dataset.ctx;
    let targets;
    if (ctx === 'lesson') targets = L.queue[L.i].say;
    else if (ctx === 'dialog') targets = D.opts.filter(o => o.go).map(o => o.en);
    else targets = pronCurrent || PRON[0].phrases[0];
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    el.classList.add('listening');
    const res = $('#micres'); if (res) res.innerHTML = '<p class="center listening-txt">🎙️ Escuchando… habla ahora</p>';
    listen(targets, r => {
      el.classList.remove('listening');
      if (!r.error) { S.bestPron = Math.max(S.bestPron, r.score); save(); checkAch(); }
      if (ctx === 'lesson') onLessonMic(r); else if (ctx === 'dialog') onDialogMic(r); else onPronMic(targets, r);
    });
  },
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
  addcard: el => { S.cards[el.dataset.en] = { en: el.dataset.en, es: el.dataset.es, box: 1, due: 0 }; save(); toast('🃏 Agregada a tus tarjetas'); $('#dictres').innerHTML = dictResultsHTML(); },
  define: () => defineWord(),
  delword: el => { if (!confirm(`¿Eliminar "${el.dataset.en}"?`)) return; delete S.cards[el.dataset.en]; save(); render(); },
  delpack: el => { if (!confirm('¿Eliminar este refuerzo?')) return; S.packs = S.packs.filter(p => p.id !== el.dataset.id); save(); render(); },
  export: () => exportData(),
  import: () => { const f = $('#importFile'); f.value = ''; f.click(); },
  theme: el => { S.theme = el.dataset.v; save(); applyTheme(); render(); },
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
  if (t.id === 'dictq') { dictQ = t.value; $('#dictres').innerHTML = dictResultsHTML(); }
  else if (t.id === 'setName') { S.name = t.value.trim(); save(); }
  else if (t.id === 'setRate') { S.rate = +t.value; $('#rateVal').textContent = S.rate.toFixed(1) + 'x'; save(); }
});
document.addEventListener('change', e => {
  if (e.target.id === 'setGoal') { S.goal = +e.target.value; save(); }
  else if (e.target.id === 'importFile') {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    const r = new FileReader(); r.onload = () => importText(String(r.result)); r.readAsText(file);
  }
});

/* ===== Inicio de la app ===== */
applyTheme();
renderNav();
render();
checkAch();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
