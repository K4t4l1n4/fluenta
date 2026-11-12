/* ============================================================
   PRUEBAS DE FLUENTA · se corren en el PC antes de publicar:
       node tests/run.js
   Cargan la app entera (los mismos archivos y en el mismo orden que index.html)
   en un navegador de mentira, y revisan que cada pantalla y cada actividad funcione.
   No necesitan instalar nada: solo Node.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

/* ===== Un navegador de mentira: lo justo para que la app corra ===== */
class ClassList {
  constructor() { this.set = new Set(); }
  add(...c) { c.forEach(x => this.set.add(x)); }
  remove(...c) { c.forEach(x => this.set.delete(x)); }
  toggle(c, on) { if (on === undefined) on = !this.set.has(c); on ? this.set.add(c) : this.set.delete(c); return on; }
  contains(c) { return this.set.has(c); }
}
class El {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase(); this.innerHTML = ''; this.textContent = ''; this.value = ''; this.files = null;
    this.style = { setProperty() {} }; this.dataset = {}; this.classList = new ClassList(); this.parentElement = {};
  }
  addEventListener() {} removeEventListener() {} appendChild(c) { return c; } remove() {} insertAdjacentHTML() {}
  focus() {} click() {} select() {} setSelectionRange() {} scrollIntoView() {} setAttribute() {} removeAttribute() {}
  getAttribute() { return null; } querySelector() { return null; } querySelectorAll() { return []; } closest() { return null; }
  getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; }
  get offsetWidth() { return 0; } get offsetLeft() { return 0; }
}
const ELS = {};
['#view', '#tabs', '#toast', '#sheet', '#sheetBody', '.sheet', '#importFile', '#dqres', 'meta[name="theme-color"]'].forEach(s => { ELS[s] = new El(); });
const listeners = {};
const document = {
  documentElement: new El('html'), body: new El('body'), head: new El('head'), visibilityState: 'visible', activeElement: null,
  querySelector: s => ELS[s] || null, querySelectorAll: () => [], createElement: t => new El(t),
  addEventListener: (type, fn) => { (listeners[type] = listeners[type] || []).push(fn); }
};
const store = new Map();
const spoken = [];
let timers = [];
const ctx = {
  console, document, Promise, Date, Math, JSON, Intl, URL, Blob, File, URLSearchParams, Map, Set, Array, Object, String, Number, RegExp, Error,
  localStorage: { getItem: k => store.has(k) ? store.get(k) : null, setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) },
  navigator: { userAgent: 'node', onLine: true, maxTouchPoints: 0, clipboard: { writeText: async () => {}, readText: async () => '' } },
  location: { protocol: 'file:', reload() {} },
  matchMedia: () => ({ matches: false, addEventListener() {} }),
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  speechSynthesis: { speak: u => spoken.push(u), cancel() {}, getVoices: () => [], speaking: false, pending: false },
  SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
  setTimeout: (fn, ms) => { timers.push(fn); return timers.length; }, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
  requestAnimationFrame: fn => fn(), scrollTo() {}, confirm: () => true, alert() {}, prompt: () => ctx.__t.promptAnswer, innerHeight: 812,
  addEventListener: (type, fn) => { (listeners['win:' + type] = listeners['win:' + type] || []).push(fn); },
  fetch: async url => {
    const f = String(url);
    if (/^https?:/.test(f)) throw new Error('sin internet en las pruebas');
    const text = read(f);
    return { ok: true, status: 200, json: async () => JSON.parse(text), text: async () => text };
  }
};
ctx.window = ctx; ctx.self = ctx;
vm.createContext(ctx);

/* ===== Herramientas para escribir las pruebas ===== */
const results = [];
let current = '';
ctx.__t = {
  tests: [],
  test(name, fn) { ctx.__t.tests.push([name, fn]); },
  ok(cond, msg) { if (!cond) throw new Error(msg || 'no se cumplió'); },
  eq(a, b, msg) { const A = JSON.stringify(a), B = JSON.stringify(b); if (A !== B) throw new Error(`${msg || 'distinto'}: ${A} ≠ ${B}`); },
  spoken, store, listeners, ELS, el: (data = {}) => Object.assign(new El('button'), { dataset: data }),
  flushTimers() { const t = timers; timers = []; t.forEach(fn => { try { fn(); } catch (e) {} }); },
  clearTimers() { timers = []; },
  pending() { return timers.length; },
  read
};

/* ===== Cargar la app en el mismo orden que index.html ===== */
const html = read('index.html');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
try {
  scripts.forEach(f => vm.runInContext(read(f), ctx, { filename: f }));
} catch (e) {
  console.error(`✗ La app no carga (${e.message})\n${e.stack.split('\n').slice(0, 4).join('\n')}`);
  process.exit(1);
}
vm.runInContext(read('tests/pruebas.js'), ctx, { filename: 'tests/pruebas.js' });

(async () => {
  let fail = 0;
  for (const [name, fn] of ctx.__t.tests) {
    current = name;
    try { await fn(); results.push(['✓', name]); }
    catch (e) { fail++; results.push(['✗', name, e.message, (e.stack || '').split('\n').find(l => /\.js:\d+/.test(l)) || '']); }
    ctx.__t.clearTimers();
  }
  results.forEach(([m, n, err, at]) => console.log(`${m} ${n}${err ? `\n    → ${err}${at ? `\n      ${at.trim()}` : ''}` : ''}`));
  console.log(`\n${ctx.__t.tests.length - fail} de ${ctx.__t.tests.length} pruebas bien${fail ? ` · ${fail} con problemas` : ' ✅'}`);
  process.exit(fail ? 1 : 0);
})();
