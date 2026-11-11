'use strict';
/* ============================================================
   FLUENTA · App para aprender inglés (PWA)
   El código está en js/, en este orden (lo carga index.html):
     base.js         Base: utilidades, íconos, tu progreso guardado, errores de la app, aciertos y errores, niveles, liga y logros
     voz.js          Voz y sonidos: la voz en inglés (🔊 y 🐢), los sonidos de la app, las animaciones, el micrófono y el análisis de pronunciación
     inicio.js       Navegación (barra de abajo y ✕), tema claro/oscuro y color, y la pantalla de Inicio
     lecciones.js    Lecciones: secciones que se despliegan, gramática, palabra del día y los ejercicios
     hablar.js       Hablar: diálogos, pronunciación frase por frase y sesiones de pronunciación
     repaso.js       Repaso: tarjetas y tus errores separados por tipo
     diccionario.js  Diccionario: búsqueda sin internet, Wiktionary y la hoja emergente
     escribir.js     Escribir: temas guiados, corrector y la corrección con Claude
     tiempos.js      Tiempos verbales y verbos regulares e irregulares
     progreso.js     Progreso, respaldo (exportar e importar) y Perfil
     acciones.js     Acciones de los botones, eventos y arranque de la app (va al final)
   Todos los archivos comparten las mismas variables: una función de un archivo
   puede usar las de los otros, pero lo que corre al cargar solo puede usar lo de antes.
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
const APP_VERSION = '3.8.1';
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
  dict: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/><circle cx="12" cy="9" r="3"/><path d="m14.2 11.2 2 2"/>',
  review: '<path d="M3 12a9 9 0 0 1 15.4-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.4 6.4L3 16"/><path d="M3 21v-5h5"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  swap: '<path d="M7 7h13l-3-3"/><path d="M17 17H4l3 3"/>'
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

/* ===== Datos guardados (en el teléfono) ===== */
const KEY = 'fluenta-v1';
const DEFAULT = {
  version: 2, xp: 0, weekXp: 0, weekKey: '', streak: 0, lastDay: '', dailyXp: 0, dailyDay: '', goal: 30,
  done: {}, dialogs: {}, ends: {}, dlg: {}, bestPron: 0, pron: {}, cards: {}, reviews: 0, added: 0, ach: {},
  rate: 0.9, name: '', theme: 'light', accent: '', sound: true, soundVol: 0.6,
  resume: null, cardDir: 'en', cardWrite: false, favTip: false, recordVoice: true, autoReplay: true,
  items: {}, types: {}, days: {}, pw: {}, log: [], packs: [], lastExport: 0, autoDone: 0, pronSessions: [],
  writing: { texts: [], errs: {} }, tense: {}, verbs: {}, errors: [],
  extra: {}, tr: [], texts: [], remind: '20:00'   /* 3.8: lecturas, juegos, prueba de nivel · traducciones · textos del lector · hora del recordatorio */
};
const fresh = () => JSON.parse(JSON.stringify(DEFAULT));
let S = load();
function load() { try { const raw = localStorage.getItem(KEY); if (raw) return { ...fresh(), ...JSON.parse(raw) }; } catch (e) {} return fresh(); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
/* ===== Si algo falla: la app avisa y lo anota (va en el archivo de progreso, para que Claude lo revise) ===== */
let lastErrToast = 0;
function logError(err, where = '') {
  try {
    const msg = String((err && (err.message || err.reason)) || err || 'Error').slice(0, 200);
    if (/^Script error\.?$/.test(msg)) return;   /* errores de otras páginas o extensiones: no son de la app */
    const at = String((err && err.stack) || '').split(/\n/).slice(0, 3).map(x => x.trim()).join(' | ').slice(0, 300);
    S.errors = [...(S.errors || []), { t: Date.now(), v: APP_VERSION, where, msg, at }].slice(-20);
    save();
    if (Date.now() - lastErrToast > 4000) { lastErrToast = Date.now(); toast('⚠️ Algo falló. Quedó anotado para revisarlo.'); }
  } catch (e) {}
}
window.addEventListener('error', e => logError(e.error || e.message, 'pantalla'));
window.addEventListener('unhandledrejection', e => logError(e.reason, 'espera'));
function rollover() {
  if (S.weekKey !== weekKey()) { S.weekKey = weekKey(); S.weekXp = 0; }
  if (S.dailyDay !== dayStr()) { S.dailyDay = dayStr(); S.dailyXp = 0; }
}
const today = () => S.days[dayStr()] || (S.days[dayStr()] = { xp: 0, ok: 0, fail: 0 });
const currentStreak = () => (S.lastDay === dayStr() || S.lastDay === yesterday()) ? S.streak : 0;
function addXp(n) {
  rollover();
  const before = S.dailyXp;
  S.xp += n; S.weekXp += n; S.dailyXp += n; today().xp += n;
  if (before < S.goal && S.dailyXp >= S.goal) setTimeout(() => { sfx('star'); toast('🎯 ¡Cumpliste tu meta diaria!'); }, 900);
  const t = dayStr();
  if (S.lastDay !== t) { S.streak = S.lastDay === yesterday() ? S.streak + 1 : 1; S.lastDay = t; }
  save(); checkAch();
}

/* ===== Historial de aciertos y errores ===== */
const TYPE_LABELS = { meaning: 'Significado', translate: 'Traducir al inglés', listen: 'Escuchar', order: 'Ordenar frases', fill: 'Completar', speak: 'Hablar', card: 'Tarjetas', dialog: 'Diálogos', write: 'Escribir (textos sin errores)', dictation: 'Escuchar y escribir', fixwrite: 'Corregir mis errores de escritura', tense: 'Tiempos verbales', verbs: 'Verbos irregulares', read: 'Lecturas', listenq: 'Historias para escuchar', pairs: 'Pares de sonidos', game: 'Juegos' };
function trackType(type, ok) {
  const t = S.types[type] || (S.types[type] = { ok: 0, fail: 0 }); ok ? t.ok++ : t.fail++;
  const d = today(); ok ? d.ok++ : d.fail++;
}
function track(type, en, es, ok) {
  if (!en) return;
  const it = S.items[en] || (S.items[en] = { en, es: es || '', ok: 0, fail: 0, kind: tokens(en).length > 2 ? 's' : 'w', last: 0 });
  if (es && !it.es) it.es = es;
  ok ? it.ok++ : it.fail++; it.last = Date.now();
  if (!ok) { it.f = it.f || {}; it.f[type] = (it.f[type] || 0) + 1; }   /* en qué tipo de ejercicio fallaste, para separar el Repaso */
  trackType(type, ok);
  S.log.push({ t: Date.now(), type, en, ok: ok ? 1 : 0 });
  if (S.log.length > 600) S.log.splice(0, S.log.length - 600);
  save();
}
function trackPron(r) {
  r.words.forEach(w => {
    const k = clean(w.w); if (!k || w.skip) return;
    const p = S.pw[k] || (S.pw[k] = { ok: 0, fail: 0 }), ok = w.pct != null ? w.pct >= 70 : w.ok;
    ok ? p.ok++ : p.fail++;
    if (w.pct != null) { p.sum = (p.sum || 0) + w.pct; p.n = (p.n || 0) + 1; }   /* para el promedio por palabra y por sonido */
  });
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
const LEVELS = [...new Set(LESSONS.map(u => u.level))];
const LESSON_LEVEL = new Map(LESSONS.flatMap(u => u.lessons.map(l => [l.id, u.level])));
/* La lección que sigue: la primera sin hacer desde el nivel donde te dejó la prueba de nivel */
function nextLesson() {
  const open = allLessons().filter(l => !S.done[l.id]), p = placedIdx();
  return open.find(l => LEVELS.indexOf(LESSON_LEVEL.get(l.id)) >= p) || open[0] || null;
}
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
  const weak = weakItems(14), fixes = writingDrills(4), verbs = weakVerbs(3);
  if (!weak.length && !fixes.length && !verbs.length) return null;
  const words = weak.filter(i => i.kind === 'w').slice(0, 6).map(i => [i.en, i.es]);
  const sentences = weak.filter(i => i.kind === 's').slice(0, 4).map(i => [i.en, i.es]);
  if (sentences.length < 2 && words.length) {
    const keys = words.map(w => w[0].toLowerCase());
    const related = shuffle(allSentences()).filter(s => keys.some(k => (' ' + s[0].toLowerCase().replace(/[.,!?]/g, '') + ' ').includes(' ' + k + ' ')) && !sentences.some(x => x[0] === s[0]));
    sentences.push(...related.slice(0, 2 - sentences.length));
  }
  return { id: 'auto', title: 'Mis errores', icon: '🎯', focus: true, count: weak.length + fixes.length + verbs.length,
    tip: 'Esta lección se armó sola con las palabras y frases que más te han costado, con tus errores al escribir y con los verbos irregulares que más fallas. Cada palabra aparece de varias formas para que la fijes bien.',
    words, sentences, fixes, verbs };
}
function findLesson(id) {
  if (id === 'auto') return autoLesson();
  if (/^verbs/.test(id)) return verbLesson(id);
  if (/^rev-/.test(id)) return reviewLesson(id);
  if (/^x-/.test(id)) return extraLesson(id);   /* vocabulario práctico */
  return allLessons().find(l => l.id === id) || TENSE_LESSONS.find(l => l.id === id) || S.packs.find(p => p.id === id);
}

/* ===== Logros ===== */
const ACH = [
  { id: 'first', icon: '🎯', name: 'Primer paso', desc: 'Completa tu primera lección', test: () => Object.keys(S.done).length >= 1 },
  { id: 'unit', icon: '📘', name: 'Unidad completa', desc: 'Termina una unidad entera', test: () => LESSONS.some(u => u.lessons.every(l => S.done[l.id])) },
  { id: 'a2', icon: '🎓', name: 'Nivel A2', desc: 'Completa tu primera lección A2', test: () => LESSONS.some(u => u.level === 'A2' && u.lessons.some(l => S.done[l.id])) },
  ...[['b1', '🥉', 'B1'], ['b2', '🥈', 'B2'], ['c1', '🥇', 'C1'], ['c2', '👑', 'C2']].map(([id, icon, lv]) => (
    { id, icon, name: `Nivel ${lv}`, desc: `Completa tu primera lección ${lv}`, test: () => LESSONS.some(u => u.level === lv && u.lessons.some(l => S.done[l.id])) })),
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
  { id: 'podium', icon: '🏆', name: 'Podio', desc: 'Llega al top 3 de la liga', test: () => S.weekXp > 0 && leagueTable().findIndex(r => r.you) < 3 },
  { id: 'reader', icon: '📖', name: 'Lectora', desc: 'Completa una lectura', test: () => Object.keys((S.extra && S.extra.read) || {}).length >= 1 },
  { id: 'ear', icon: '🎧', name: 'Buen oído', desc: 'Completa una historia de Escuchar', test: () => Object.keys((S.extra && S.extra.listen) || {}).length >= 1 },
  { id: 'gamer', icon: '🎮', name: 'Jugadora', desc: 'Termina un juego de repaso', test: () => Object.keys((S.extra && S.extra.games) || {}).length >= 1 }
];
function checkAch() {
  for (const a of ACH) {
    if (!S.ach[a.id] && a.test()) { S.ach[a.id] = dayStr(); save(); setTimeout(() => sfx('star'), 600); toast(`${a.icon} Logro desbloqueado: ${a.name}`); }
  }
}
