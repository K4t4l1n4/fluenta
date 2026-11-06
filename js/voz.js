'use strict';
/* Fluenta · Voz y sonidos: la voz en inglés (🔊 y 🐢), los sonidos de la app, las animaciones, el micrófono y el análisis de pronunciación. */
/* ===== Voz: el teléfono lee en inglés ===== */
let voice = null;
function loadVoice() {
  const vs = speechSynthesis.getVoices();
  voice = vs.find(v => v.lang === 'en-US' && /Samantha|Google US|Aaron|Nicky|Ava/i.test(v.name))
    || vs.find(v => v.lang === 'en-US') || vs.find(v => v.lang.startsWith('en')) || null;
}
if ('speechSynthesis' in window) { loadVoice(); speechSynthesis.onvoiceschanged = loadVoice; }
/* 🐢 Lento: en el iPhone, bajar solo la velocidad casi no se nota (y Safari no acepta menos de 0.5),
   así que la frase se dice por partes cortas: entre una parte y otra queda una pausa. Las partes no
   terminan en "a", "the", "to"…: dichas solas se pronuncian distinto. */
const SLOW_GLUE = new Set(['a', 'an', 'the', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'from', 'by', 'about', 'my', 'your', 'his', 'her', 'our', 'their', 'its', 'and', 'or', 'but', 'is', 'are', 'am', 'was', 'were', 'be', 'been', 'i', 'you', 'he', 'she', 'we', 'they', 'it', 'do', 'does', 'did', "don't", "doesn't", "didn't", 'will', "won't", 'can', "can't", 'have', 'has', 'had', 'not', 'very', 'this', 'that', 'some', 'any', 'going']);
function slowChunks(text) {
  const tk = text.split(/\s+/).filter(Boolean), out = [];
  let cur = [];
  tk.forEach((t, i) => {
    cur.push(t);
    const w = t.toLowerCase().replace(/[^a-z']/g, ''), stop = /[,.;:!?]$/.test(t), last = i === tk.length - 1;
    if (last || stop || cur.length >= 5 || (cur.length >= 3 && !SLOW_GLUE.has(w))) { out.push(cur.join(' ')); cur = []; }
  });
  return out;
}
function stopSpeech() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }
function speak(text, slow) {
  if (!('speechSynthesis' in window) || !text) return;
  speechSynthesis.cancel();
  const say = text.replace(/^\(.*?\)\s*/, '');
  /* Todas las partes se piden en el mismo momento en que se toca el botón (quedan en fila):
     si la voz se pide después, con una espera, el iPhone no la deja sonar. */
  (slow ? slowChunks(say) : [say]).forEach(p => {
    const u = new SpeechSynthesisUtterance(p);
    u.lang = 'en-US'; if (voice) u.voice = voice;
    u.rate = slow ? 0.5 : S.rate;
    speechSynthesis.speak(u);
  });
}

/* ===== Sonidos: los "toca" un mini sintetizador (sin archivos, funcionan sin internet) ===== */
let AC = null, MASTER = null, listening = false;
function audioCtx() {
  if (!AC) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); MASTER = AC.createGain(); MASTER.connect(AC.destination); }
  if (AC.state === 'suspended') AC.resume().catch(() => {});
  return AC;
}
function tone(ac, freq, start, dur, { type = 'triangle', vol = 0.25, slide = 0 } = {}) {
  const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + start;
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(MASTER); o.start(t); o.stop(t + dur + 0.05);
}
function swish(ac) {   /* ruido suave que sube y baja, como pasar una hoja */
  const len = Math.floor(ac.sampleRate * 0.18), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / len);
  const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
  f.type = 'bandpass'; f.frequency.setValueAtTime(900, ac.currentTime); f.frequency.exponentialRampToValueAtTime(2600, ac.currentTime + 0.18);
  g.gain.value = 0.35; src.buffer = buf; src.connect(f); f.connect(g); g.connect(MASTER); src.start();
}
const SOUNDS = {
  ok: ac => { tone(ac, 659.25, 0, 0.14); tone(ac, 987.77, 0.08, 0.3); },                                        /* ding-ding */
  great: ac => { tone(ac, 659.25, 0, 0.14); tone(ac, 830.61, 0.07, 0.16); tone(ac, 1318.5, 0.14, 0.45, { vol: 0.2 }); },
  bad: ac => { tone(ac, 233.08, 0, 0.2, { type: 'sine', vol: 0.3, slide: 0.85 }); tone(ac, 174.61, 0.12, 0.3, { type: 'sine', vol: 0.25, slide: 0.85 }); },
  win: ac => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(ac, f, i * 0.11, i === 3 ? 0.55 : 0.16)),     /* fanfarria */
  star: ac => [1318.5, 1567.98, 2093, 2637].forEach((f, i) => tone(ac, f, i * 0.055, 0.25, { type: 'sine', vol: 0.14 })),
  flip: ac => swish(ac)
};
function sfx(name) {
  if (S.sound === false || listening || !SOUNDS[name]) return;
  const ac = audioCtx(); if (!ac) return;
  MASTER.gain.value = Math.max(0, Math.min(1, S.soundVol ?? 0.6));
  try { SOUNDS[name](ac); } catch (e) {}
}
/* Después de un sonido, la voz espera un poquito para no mezclarse */
const speakAfter = (text, slow) => setTimeout(() => speak(text, slow), S.sound === false ? 0 : 420);
/* El iPhone solo deja sonar audio después de tocar la pantalla: se activa con el primer toque */
document.addEventListener('pointerdown', () => { if (S.sound !== false) audioCtx(); }, { passive: true });

/* ===== Animaciones: salto, "no" con la cabeza y confeti ===== */
const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
function animate(el, cls) { if (!el || reduceMotion()) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
function confetti() {
  if (reduceMotion()) return;
  const cs = getComputedStyle(document.documentElement), colors = ['--accent', '--accent2', '--gold', '--ok', '--sky', '--bad'].map(v => cs.getPropertyValue(v).trim());
  const box = document.createElement('div'); box.className = 'confetti';
  box.innerHTML = Array.from({ length: 46 }, () => `<i style="left:${Math.random() * 100}%;background:${pick(colors)};--x:${Math.round(Math.random() * 160 - 80)}px;--r:${Math.round(Math.random() * 720 - 360)}deg;--d:${(1.6 + Math.random() * 1.4).toFixed(2)}s;animation-delay:${(Math.random() * 0.35).toFixed(2)}s"></i>`).join('');
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 3600);
}
const celebrate = () => { sfx('win'); confetti(); };

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
  const finish = r => { if (done) return; done = true; listening = false; cb(r); };
  listening = true;   /* mientras escucha, la app no hace sonidos */
  rec.onresult = e => {
    const res = e.results[0];
    const alts = Array.from({ length: res.length }, (_, i) => res[i].transcript);
    let best = null;
    for (const h of alts) for (const t of targets) { const r = compare(t, h); if (!best || r.score > best.score) best = { ...r, heard: h, target: t }; }
    finish({ ...best, alts });   /* alts: todas las versiones que entendió, para el análisis por palabra */
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
    'audio-capture': 'El micrófono estaba ocupado. Inténtalo de nuevo.',
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
/* ===== Análisis de pronunciación: tu voz grabada + % por palabra =====
   El reconocimiento de voz del iPhone entrega hasta 5 versiones de lo que entendió.
   Cada palabra de la frase se compara con esas versiones: si siempre la entiende igual,
   100 %; si entiende algo parecido ("tink" por "think"), un % intermedio. Es una estimación,
   no una medición del sonido. La fluidez sale de tu grabación (ritmo y pausas). */
const RELAXED = { wanna: ['want', 'to'], gonna: ['going', 'to'], gotta: ['got', 'to'], kinda: ['kind', 'of'], sorta: ['sort', 'of'], lemme: ['let', 'me'], gimme: ['give', 'me'], dunno: ['do', 'not', 'know'], outta: ['out', 'of'], lotta: ['lot', 'of'], ya: ['you'], cuz: ['because'] };
const wsim = (a, b) => a === b ? 1 : 1 - lev(a, b) / Math.max(a.length, b.length);
/* "wanna" cuenta como "want to": son formas naturales, no errores */
/* "lets" sin apóstrofo cuenta como "let's" si la frase lo trae */
const heardTokens = (h, contr = {}) => norm(h).flatMap(t => contr[t] ? contr[t].map(w => ({ w, natural: false }))
  : RELAXED[t] ? RELAXED[t].map(w => ({ w, natural: true })) : [{ w: t, natural: false }]);
function alignWords(tw, hw) {
  const n = tw.length, m = hw.length, dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  const s = (i, j) => { const v = wsim(tw[i], hw[j].w); return v >= 0.5 ? v : -1; };
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) { const v = s(i - 1, j - 1); dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1], v > 0 ? dp[i - 1][j - 1] + v : -Infinity); }
  const out = new Array(n).fill(null);
  let i = n, j = m;
  while (i > 0 && j > 0) {
    const v = s(i - 1, j - 1);
    if (v > 0 && Math.abs(dp[i][j] - (dp[i - 1][j - 1] + v)) < 1e-9) { out[i - 1] = { sim: v, heard: hw[j - 1].w, natural: hw[j - 1].natural }; i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--;
  }
  return out;
}
/* Ritmo y pausas a partir del volumen de la grabación (cada 20 ms) */
function speechStats(buf) {
  const d = buf.getChannelData(0), hop = Math.max(1, Math.round(buf.sampleRate * 0.02)), rms = [];
  for (let i = 0; i + hop <= d.length; i += hop) { let s = 0; for (let j = i; j < i + hop; j++) s += d[j] * d[j]; rms.push(Math.sqrt(s / hop)); }
  if (!rms.length) return null;
  const sorted = [...rms].sort((a, b) => a - b), floor = sorted[Math.floor(sorted.length * 0.2)], peak = sorted[sorted.length - 1];
  const thr = Math.max(Math.min(floor * 3, peak * 0.5), peak * 0.12, 0.004), on = rms.map(v => v > thr), first = on.indexOf(true), last = on.lastIndexOf(true);
  if (first < 0) return null;
  let pauses = 0, run = 0;
  for (let k = first; k <= last; k++) { if (!on[k]) run++; else { if (run * 0.02 >= 0.45) pauses++; run = 0; } }
  return { dur: (last - first + 1) * 0.02, pauses };
}
function analyzePron(target, alts, audio) {
  const disp = tokens(target.replace(/^\(.*?\)\s*/, '')), tw = [], owner = [];
  disp.forEach((d, i) => norm(d).forEach(w => { tw.push(w); owner.push(i); }));
  const contr = {};
  (target.toLowerCase().replace(/[’‘]/g, "'").match(/[a-z]+'[a-z]+/g) || []).forEach(c => { if (CONTR[c]) contr[c.replace("'", '')] = CONTR[c].split(' '); });
  const runs = (alts && alts.length ? alts : ['']).slice(0, 5).map(h => alignWords(tw, heardTokens(h, contr)));
  const curve = v => Math.pow(v, 1.5);   /* "tree" por "three" se parece, pero no es lo mismo: baja más */
  const per = tw.map((_, k) => {
    const top = runs[0][k], s0 = top ? curve(top.sim) : 0, rest = runs.slice(1).map(r => r[k] ? curve(r[k].sim) : 0);
    let s = rest.length ? 0.75 * s0 + 0.25 * rest.reduce((a, b) => a + b, 0) / rest.length : s0;
    if (s0 === 1) s = Math.max(s, 0.9);   /* bien dicha en la versión principal: las otras no la castigan tanto */
    return { pct: Math.round(100 * s), heard: top ? top.heard : '', natural: !!(top && top.natural), found: !!top };
  });
  const words = disp.map((w, i) => {
    const ps = owner.map((o, t) => o === i ? per[t] : null).filter(Boolean);
    if (!ps.length) return { w, pct: 100, heard: '', natural: false, skip: true };
    return { w, pct: Math.round(ps.reduce((a, p) => a + p.pct, 0) / ps.length), heard: ps.map(p => p.heard).filter(Boolean).join(' '), natural: ps.some(p => p.natural) };
  });
  const scored = words.filter(w => !w.skip);
  const accuracy = scored.length ? Math.round(scored.reduce((a, w) => a + w.pct, 0) / scored.length) : 0;
  const completeness = tw.length ? Math.round(per.filter(p => p.found).length / tw.length * 100) : 0;   /* cuántas palabras alcancé a escuchar */
  let fluency = null, wpm = null, pauses = null;
  if (audio && audio.stats) {
    wpm = Math.round(tw.length / Math.max(audio.stats.dur, 0.4) * 60); pauses = audio.stats.pauses;
    fluency = Math.round(Math.max(30, Math.min(100, 100 - pauses * 12 - (tw.length > 3 && wpm < 80 ? (80 - wpm) * 0.8 : 0))));
  }
  const overall = Math.round(fluency == null ? accuracy * 0.75 + completeness * 0.25 : accuracy * 0.6 + completeness * 0.2 + fluency * 0.2);
  return { overall, accuracy, completeness, fluency, wpm, pauses, words };
}
/* Qué sonido difícil tiene cada palabra (para dar el consejo y el progreso por sonido) */
const SOUND_RULES = [
  ['th', w => w.includes('th')], ['s', w => /^s[cklmnpqtw]/.test(w)], ['mute', w => /^(kn|wr)|mb$|alk$|stle|ght|^hour|^hon/.test(w)],
  ['vb', w => /[vb]/.test(w)], ['ed', w => /ed$/.test(w) && w.length > 3], ['shch', w => /sh|ch/.test(w)], ['jy', w => /^[jy]|dge|ge$/.test(w)],
  ['h', w => /^h/.test(w)], ['r', w => /r/.test(w)], ['z', w => /z|[aeiou]s[aeiou]/.test(w)], ['es', w => /(es|[^s]s)$/.test(w) && w.length > 3],
  ['iee', w => /ee|ea|^[^aeiou]*i[^aeiou]*$/.test(w)], ['aeu', w => /^[^aeiou]*[au][^aeiou]*$/.test(w)]
];
const soundGroup = w => { const r = SOUND_RULES.find(([, t]) => t(w)); return r ? r[0] : null; };
/* Tu voz: se graba mientras el reconocimiento escucha. No se guarda: solo queda la última. */
const newVS = () => ({ audio: null, open: false, sel: -1, capturing: false, recOnly: false });
const VS = { pron: newVS(), psession: newVS() };
let VOICE = null, PLAYING = null, voiceFails = 0;
const canRecordDevice = () => !!(window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
async function startCapture(force) {
  if (!canRecordDevice() || (!force && S.recordVoice === false)) return false;
  if (VOICE) { const old = VOICE; try { old.rec && old.rec.state !== 'inactive' && old.rec.stop(); } catch (e) {} if (old.stream) old.stream.getTracks().forEach(t => t.stop()); }
  const v = VOICE = { chunks: [] };
  try {
    v.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    if (VOICE !== v) { v.stream.getTracks().forEach(t => t.stop()); return false; }
    v.rec = new MediaRecorder(v.stream);
    v.rec.ondataavailable = e => { if (e.data && e.data.size) v.chunks.push(e.data); };
    v.rec.start();
    return true;
  } catch (e) { v.failed = true; return false; }
}
async function finishCapture() {
  const v = VOICE; VOICE = null;
  if (!v) return null;
  try {
    if (v.rec && v.rec.state !== 'inactive') await new Promise(res => { v.rec.onstop = res; setTimeout(() => { try { v.rec.stop(); } catch (e) { res(); } }, 250); });
    if (v.stream) v.stream.getTracks().forEach(t => t.stop());
    if (!v.chunks.length) return null;
    const ac = audioCtx(); if (!ac) return null;
    const arr = await new Blob(v.chunks, { type: (v.rec && v.rec.mimeType) || 'audio/mp4' }).arrayBuffer();
    const buf = await new Promise((res, rej) => { const p = ac.decodeAudioData(arr, res, rej); if (p && p.then) p.then(res, rej); });
    return { buf, stats: speechStats(buf) };
  } catch (e) { if (v.stream) v.stream.getTracks().forEach(t => t.stop()); return null; }
}
/* Se reproduce con Web Audio: así el iPhone deja escucharla aunque no acabes de tocar nada */
function playVoice(buf) {
  const ac = audioCtx(); if (!ac || !buf) return;
  try { if (PLAYING) PLAYING.stop(); } catch (e) {}
  const src = ac.createBufferSource(); src.buffer = buf; src.connect(ac.destination); src.start(); PLAYING = src;
}
/* Primero la voz modelo y, al terminar, tu voz */
function speakThen(text, cb) {
  if (!('speechSynthesis' in window)) return cb();
  stopSpeech();
  const u = new SpeechSynthesisUtterance(text.replace(/^\(.*?\)\s*/, ''));
  u.lang = 'en-US'; if (voice) u.voice = voice; u.rate = S.rate;
  let done = false; const next = () => { if (!done) { done = true; setTimeout(cb, 300); } };
  u.onend = next; u.onerror = next;
  setTimeout(next, 1200 + tokens(text).length * 650 / S.rate);
  speechSynthesis.speak(u);
}
const recordOnlyBtn = ctx => canRecordDevice() ? `<button class="btn ghost wide" data-act="recordonly" data-ctx="${ctx}">${VS[ctx].recOnly ? '⏹ Detener grabación' : '🎙️ Grabar y escucharme'}</button>` : '';
function voiceResultHTML(r, ctx) {
  if (!r) return '';
  const st = VS[ctx];
  const play = st.audio ? `<div class="row gap an-actions"><button class="btn ghost grow" data-act="playme" data-ctx="${ctx}">🎧 Escúchate</button><button class="btn ghost grow" data-act="vcompare" data-ctx="${ctx}">🔁 Comparar</button></div>` : '';
  if (r.error || !r.an) return pronResultHTML(r) + (play || recordOnlyBtn(ctx));
  const an = r.an, toFix = an.words.filter(w => !w.skip && w.pct < 85).length;
  const [cls, msg] = an.overall >= 90 && !toFix ? ['great', '¡Excelente pronunciación! 🌟'] : an.overall >= 70 ? ['good', '¡Muy bien! Casi perfecto 👏']
    : an.overall >= 40 ? ['mid', 'Vas bien, inténtalo otra vez 💪'] : ['low', 'Escucha con 🐢 y repite más lento'];
  const bar = (label, v) => `<div class="an-bar"><span>${label}</span><div class="bar thin ${v != null && v < 60 ? 'low' : ''}"><i style="width:${v || 0}%"></i></div><b>${v == null ? '—' : v + '%'}</b></div>`;
  return `<div class="pron-result ${cls} an"><div class="pron-score">${an.overall}%</div><div>${msg}</div>
    <div class="pron-heard">Escuché: “${esc(r.heard)}”</div>
    <div class="an-bars">${bar('Precisión', an.accuracy)}${bar('Completitud', an.completeness)}${bar('Fluidez', an.fluency)}</div>
    ${play || (st.capturing ? '' : recordOnlyBtn(ctx))}
    ${st.open ? analysisDetailHTML(r, ctx) : `${toFix ? `<p class="small an-hint">👀 ${toFix} ${toFix === 1 ? 'palabra' : 'palabras'} para mejorar</p>` : '<p class="small an-hint">✨ Todas las palabras se entendieron bien</p>'}<button class="btn primary wide" data-act="analyze" data-ctx="${ctx}">🔍 Analizar cada palabra</button>`}</div>`;
}
function analysisDetailHTML(r, ctx) {
  const an = r.an, sel = an.words[VS[ctx].sel], cls = p => p >= 85 ? 'good' : p >= 60 ? 'mid' : 'bad';
  const tip = an.pauses ? 'Trata de no detenerte entre palabras.' : an.wpm && an.wpm < 80 && an.words.length > 3 ? 'Intenta decirla un poco más seguida, como una sola idea.' : 'Buen ritmo 👏';
  return `<div class="an-detail"><span class="label">Palabra por palabra</span>
    <div class="an-words">${an.words.map((w, i) => w.skip ? '' : `<button class="an-word ${cls(w.pct)} ${i === VS[ctx].sel ? 'on' : ''}" data-act="anword" data-ctx="${ctx}" data-i="${i}"><b>${esc(stripPunct(w.w))}</b><span>${w.pct}%</span>${w.natural ? '<small>natural</small>' : ''}</button>`).join('')}</div>
    ${sel ? wordFocusHTML(sel, ctx) : '<p class="muted small">Toca una palabra para ver el detalle y practicarla.</p>'}
    ${an.fluency != null ? `<p class="small an-flu">⏱️ Hablaste a <b>${an.wpm}</b> palabras por minuto${an.pauses ? `, con <b>${an.pauses}</b> ${an.pauses === 1 ? 'pausa larga' : 'pausas largas'}` : ', sin pausas largas'}. ${tip}</p>` : ''}
    <p class="muted small">El % de cada palabra es una estimación según lo que entendió el reconocimiento de voz.</p></div>`;
}
function wordFocusHTML(w, ctx) {
  const word = stripPunct(w.w).replace(/^[“"¿¡(]+/, ''), g = soundGroup(word.toLowerCase()), grp = g && PRON.find(p => p.id === g), weak = w.pct < 85;
  const said = w.natural ? '✅ Usaste una forma natural, como hablan los nativos.' : !w.heard ? '❌ No alcancé a escuchar esta palabra.'
    : normAns(w.heard) === normAns(norm(word).join(' ')) ? '✅ Te entendí perfecto.' : `Escuché: <b>${esc(w.heard)}</b>`;
  return `<div class="an-focus"><div class="row gap-s"><b class="grow an-fw">${esc(word)}</b><span class="score-tag ${w.pct >= 85 ? 'good' : w.pct >= 60 ? 'mid' : 'bad'}">${w.pct}%</span>${sayBtn(word, 'sm')}<button class="round-btn sm" data-act="say" data-t="${esc(word)}" data-slow="1" aria-label="Lento">🐢</button></div>
    <p class="small">${said}</p>
    ${grp && weak ? `<p class="small">${grp.icon} <b>${esc(grp.title)}:</b> ${esc(grp.tip)}</p>` : ''}
    <div class="row gap">${ctx === 'pron' ? `<button class="btn ghost grow" data-act="pword" data-t="${esc(word)}">🎙️ Practicarla</button>` : ''}
      ${grp && weak && ctx === 'pron' ? `<button class="btn ghost grow" data-act="psession" data-g="${grp.id}">${grp.icon} Sesión</button>` : `<button class="btn ghost grow" data-act="word" data-w="${esc(word)}">📖 Significado</button>`}</div></div>`;
}
function rerenderVoice(ctx) {
  if (ctx === 'psession') { if (P) renderPronSession(); }
  else if (tab === 'talk' && !D && !P) render();
}
/* Promedio de tus palabras en cada sonido difícil */
function soundStats() {
  const g = {};
  Object.entries(S.pw).forEach(([w, p]) => { if (!p.n) return; const id = soundGroup(w); if (!id) return; const x = g[id] || (g[id] = { sum: 0, n: 0, words: 0 }); x.sum += p.sum; x.n += p.n; x.words++; });
  return Object.entries(g).map(([id, x]) => ({ id, avg: Math.round(x.sum / x.n), words: x.words, grp: PRON.find(p => p.id === id) })).filter(x => x.grp && x.words >= 2).sort((a, b) => a.avg - b.avg);
}
const micControls = (text, ctx) => `<div class="speak-controls">
  ${text ? `<button class="round-btn" data-act="say" data-t="${esc(text)}" aria-label="Escuchar">${ic('volume')}</button>` : '<span class="round-btn ghost"></span>'}
  <button class="mic-btn" data-act="mic" data-ctx="${ctx}" aria-label="Hablar">${ic('mic')}</button>
  ${text ? `<button class="round-btn" data-act="say" data-t="${esc(text)}" data-slow="1" aria-label="Lento">🐢</button>` : '<span class="round-btn ghost"></span>'}</div>`;
const sayBtn = (t, cls = '') => `<button class="say ${cls}" data-act="say" data-t="${esc(t)}" aria-label="Escuchar">${ic('volume')}</button>`;
