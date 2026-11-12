'use strict';
/* Fluenta · Traductor (texto, voz y foto) y lector de textos pegados. Todo gratis:
   - Frases: MyMemory (internet). Sin internet o sin cupo: palabra por palabra con el diccionario de la app.
   - Fotos: Tesseract (lee el texto dentro del teléfono; se descarga la primera vez que se usa).
   - Voz: el mismo reconocimiento de voz de Pronunciación. */

/* ===== Traducir una frase ===== */
const TR_LIMIT = 450;   /* MyMemory acepta hasta 500 letras por consulta */
const TR_CACHE = new Map();
const ES_HINT = /[áéíóúñ¿¡]|\b(el|la|los|las|un|una|que|de|en|y|es|está|estoy|por|para|con|sí|muy|pero|como|qué|dónde|cuándo|quiero|tengo|hola|gracias|yo|tú|mi|me|se|lo|del|al|hay|soy|eres|más)\b/gi;
const EN_HINT = /\b(the|a|an|is|are|am|and|of|to|in|it|you|i|he|she|we|they|this|that|with|for|on|not|do|does|did|have|has|what|where|when|my|your|was|were|will|can|hello|thanks|please|there)\b/gi;
/* ¿El texto está en español o en inglés? (vacío si no se sabe) */
function guessLang(text) {
  const es = (text.match(ES_HINT) || []).length, en = (text.match(EN_HINT) || []).length;
  return es > en ? 'es' : en > es ? 'en' : '';
}
const unEntity = s => s.replace(/&#(\d+);/g, (m, n) => String.fromCharCode(+n)).replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
/* Parte un párrafo en trozos que caben en una consulta, cortando entre oraciones */
function trChunks(line) {
  const out = [];
  let cur = '';
  (line.match(/[^.!?]+[.!?]*\s*/g) || [line]).forEach(s => {
    if (cur && (cur + s).length > TR_LIMIT) { out.push(cur); cur = ''; }
    while (s.length > TR_LIMIT) { out.push(s.slice(0, TR_LIMIT)); s = s.slice(TR_LIMIT); }
    cur += s;
  });
  if (cur.trim()) out.push(cur);
  return out.map(x => x.trim()).filter(Boolean);
}
async function myMemory(q, from, to) {
  const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${from}|${to}`);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const d = await r.json(), t = d && d.responseData && d.responseData.translatedText;
  if (!t || /MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(t) || d.quotaFinished) throw new Error(d.quotaFinished || /MYMEMORY WARNING/i.test(t || '') ? 'quota' : 'bad');
  if (String(d.responseStatus) !== '200') throw new Error('bad');
  return unEntity(t);
}
/* Español → inglés sin internet: el diccionario de la app leído al revés */
let ES_IX = null;
function esIndex() {
  if (ES_IX || !DICT) return ES_IX;
  ES_IX = new Map();
  const add = (es, en) => { const k = deaccent(es).replace(/\(.*?\)/g, '').replace(/^(el|la|los|las|un|una) /, '').trim(); if (k && !ES_IX.has(k)) ES_IX.set(k, en); };
  DICT.words.forEach(([w, , es]) => es.split(/[;,/]+/).forEach(m => add(m, w)));
  appEntries().forEach(e => e.es.split(/[;,/]+/).forEach(m => add(m, e.w)));
  return ES_IX;
}
/* Palabra por palabra: aproximada; lo que no se encuentra queda entre [ ] */
function roughTranslate(text, from) {
  const ix = from === 'es' ? esIndex() : null;
  return text.split(/(\s+)/).map(tok => {
    const core = tok.replace(/^[^A-Za-zÀ-ÿ']+|[^A-Za-zÀ-ÿ']+$/g, '');
    if (!core) return tok;
    let out = '';
    if (from === 'en') { const r = lookup(core); out = r ? (r.entry || r.base).es.split(/[;,(]/)[0].trim() : ''; }
    else if (ix) { const k = deaccent(core); out = ix.get(k) || ix.get(k.replace(/(es|s)$/, '')) || ''; }
    return tok.replace(core, out || `[${core}]`);
  }).join('');
}
/* from: 'es' o 'en'. Devuelve { dst, offline, quota } */
async function translateText(text, from) {
  const to = from === 'en' ? 'es' : 'en';
  try {
    const lines = [];
    for (const line of text.split(/\n/)) {
      if (!line.trim()) { lines.push(''); continue; }
      const parts = [];
      for (const c of trChunks(line)) {
        const k = from + '|' + c;
        if (!TR_CACHE.has(k)) TR_CACHE.set(k, await myMemory(c, from, to));
        parts.push(TR_CACHE.get(k));
      }
      lines.push(parts.join(' '));
    }
    return { dst: lines.join('\n').trim(), offline: false };
  } catch (e) {
    try { await loadDict(); } catch (x) {}
    if (!DICT) return { dst: '', offline: true };
    return { dst: roughTranslate(text, from), offline: true, quota: e.message === 'quota' };
  }
}

/* ===== Pantalla del traductor ===== */
const LANG_NAME = { es: 'Español', en: 'Inglés' };
const newTR = () => ({ mode: 'text', from: 'es', manual: false, text: '', busy: false, res: null, mic: false, micErr: '', ocr: null, ocrErr: '' });
let TR = newTR();
const rerenderTR = () => { if (tab === 'translate' && !A) render(); };
function openTranslate(mode, text) {
  if (mode && mode !== TR.mode) { TR.mode = mode; if (!TR.manual) TR.from = mode === 'photo' ? 'en' : 'es'; }
  if (text != null) { TR.text = text; TR.res = null; }
  TR.micErr = ''; TR.ocrErr = '';
  go('translate');
}
function trResultHTML() {
  if (TR.busy) return '<p class="muted center small tr-wait">🌐 Traduciendo…</p>';
  const r = TR.res;
  if (!r) return '';
  if (!r.dst) return '<p class="err">⚠️ No pude traducir. Revisa tu conexión a internet e inténtalo de nuevo.</p>';
  const en = r.from === 'en' ? r.src : r.dst, short = tokens(en).length <= 12;
  return `<section class="card tr-res"><span class="label">En ${LANG_NAME[r.from === 'en' ? 'es' : 'en'].toLowerCase()}</span>
    <div class="tr-out">${r.from === 'en' ? esc(r.dst) : tapText(r.dst)}</div>
    ${r.from === 'en' ? `<span class="label tz-label">Tu texto en inglés</span><div class="tr-src">${tapText(r.src)}</div>` : ''}
    <div class="row gap-s tr-say">${sayBtn(en)}<button class="round-btn" data-act="say" data-t="${esc(en)}" data-slow="1" aria-label="Lento">🐢</button><span class="muted small grow">Escucha el inglés. Toca una palabra para ver qué significa.</span></div>
    ${r.offline ? `<p class="muted small">📴 ${r.quota ? 'Se acabaron las traducciones gratis de hoy' : 'Sin internet'}: esta es una traducción palabra por palabra, aproximada. Lo que va entre [ ] no lo encontré.</p>` : ''}
    <div class="row gap">${!short ? '' : S.cards[en] ? '<span class="add-btn added grow center">✓ En tus tarjetas</span>' : '<button class="btn ghost grow" data-act="trsave">🃏 Guardar</button>'}<button class="btn ghost grow" data-act="trcopy">📋 Copiar</button></div>
    ${r.from === 'en' && !short ? '<button class="btn ghost wide" data-act="trread">📚 Guardar en mis cuentos</button>' : ''}</section>`;
}
function renderTranslate() {
  const to = TR.from === 'en' ? 'es' : 'en', hist = S.tr || [];
  const modes = [['text', '✏️ Texto'], ['voice', '🗣️ Voz'], ['photo', '📷 Foto']];
  const box = `<textarea id="trIn" rows="${TR.mode === 'text' ? 4 : 3}" placeholder="${TR.from === 'es' ? 'Escribe o pega en español…' : 'Escribe o pega en inglés…'}" autocomplete="off" autocapitalize="sentences" spellcheck="false">${esc(TR.text)}</textarea>
    <button class="btn primary wide" data-act="trgo" ${TR.busy ? 'disabled' : ''}>🌐 Traducir</button>`;
  let body;
  if (TR.mode === 'voice') {
    body = `<div class="speak-controls"><button class="mic-btn ${TR.mic ? 'listening' : ''}" data-act="trmic" aria-label="Hablar">${ic('mic')}</button></div>
      <p class="center ${TR.mic ? 'listening-txt' : 'muted small'}">${TR.mic ? '🎙️ Escuchando… habla ahora' : `Toca el micrófono y habla en ${LANG_NAME[TR.from].toLowerCase()}. La app lo traduce${TR.from === 'es' ? ' y lo dice en inglés' : ''}.`}</p>
      ${TR.micErr ? `<p class="err">⚠️ ${esc(TR.micErr)}</p>` : ''}${TR.text ? `<p class="center tr-heard">“${esc(TR.text)}”</p>` : ''}`;
  } else if (TR.mode === 'photo') {
    body = (TR.ocr ? `<p class="center listening-txt" id="ocrMsg">${esc(TR.ocr.msg)}</p><div class="bar"><i id="ocrBar" style="width:${TR.ocr.pct}%"></i></div>`
      : `<button class="btn ${TR.text ? 'ghost' : 'primary'} wide" data-act="trphoto">📷 ${TR.text ? 'Otra foto' : 'Tomar o elegir una foto'}</button>
        ${TR.ocrErr ? `<p class="err">⚠️ ${esc(TR.ocrErr)}</p>` : ''}
        ${TR.text ? `<p class="muted small">Esto leí en la foto. Corrígelo si hace falta y toca Traducir.</p>${box}`
          : `<p class="muted small">La app lee el texto en ${LANG_NAME[TR.from].toLowerCase()} de la foto (un menú, un cartel, una página) y lo traduce. Funciona mejor con letra impresa, buena luz y la foto derecha. La primera vez descarga el lector (unos 7 MB).</p>
            <p class="muted small">💡 En el iPhone también puedes mantener presionado el texto de cualquier foto, tocar «Copiar» y pegarlo en ✏️ Texto.</p>`}`);
  } else body = box;
  return topBar('🌐 Traductor', closeBtn()) + `
    <div class="seg">${modes.map(([v, l]) => `<button class="${TR.mode === v ? 'on' : ''}" data-act="trmode" data-v="${v}">${l}</button>`).join('')}</div>
    <button class="tr-dir" data-act="trswap" aria-label="Cambiar el sentido de la traducción"><b>${LANG_NAME[TR.from]}</b>${ic('swap')}<b>${LANG_NAME[to]}</b></button>
    <section class="card">${body}</section>
    <div id="trRes">${trResultHTML()}</div>
    ${hist.length ? `<section class="card"><div class="row between"><h2>🕘 Lo último que tradujiste</h2><button class="link-inline small" data-act="trclear">Borrar</button></div>
      ${hist.slice(0, 8).map((h, i) => `<button class="word-row as-btn" data-act="truse" data-i="${i}"><div class="grow"><span class="small">${esc(h.src)}</span><span class="muted small block">${esc(h.dst)}</span></div></button>`).join('')}</section>` : ''}
    <p class="muted small">ℹ️ Las frases las traduce MyMemory, un servicio gratis de internet: no escribas datos privados. Tiene un límite diario; si se acaba, o sin internet, la app traduce palabra por palabra con su diccionario.</p>
    <input type="file" id="trFile" accept="image/*" hidden>`;
}
async function doTranslate(noGuess) {
  const text = TR.text.trim();
  if (!text || TR.busy) return;
  const g = guessLang(text);
  if (!noGuess && g && g !== TR.from && !TR.manual && tokens(text).length >= 2) { TR.from = g; toast(`Parece ${LANG_NAME[g].toLowerCase()}: cambié el sentido de la traducción`); }
  TR.busy = true; TR.res = null; rerenderTR();
  const from = TR.from, r = await translateText(text, from);
  TR.busy = false; TR.res = { src: text, from, ...r };
  if (r.dst && !r.offline) {
    const src = text.slice(0, 300);
    S.tr = [{ t: Date.now(), src, dst: r.dst.slice(0, 300), from }, ...(S.tr || []).filter(h => h.src !== src)].slice(0, 30);
    save();
  }
  rerenderTR();
}
/* Dictado: escucha una frase en el idioma indicado y entrega el texto */
const esLang = () => /^es/i.test(navigator.language || '') ? navigator.language : 'es-ES';
function dictate(lang, cb) {
  if (!SR) { cb({ error: 'unsupported' }); return; }
  try { rec && rec.abort(); } catch (e) {}
  rec = new SR();
  rec.lang = lang; rec.interimResults = false; rec.maxAlternatives = 1; rec.continuous = false;
  let done = false;
  const finish = r => { if (done) return; done = true; listening = false; cb(r); };
  listening = true;
  rec.onresult = e => finish({ text: e.results[0][0].transcript });
  rec.onerror = e => finish({ error: e.error });
  rec.onend = () => finish({ error: 'no-speech' });
  try { rec.start(); } catch (e) { finish({ error: 'start' }); }
}
function translateVoice() {
  if (TR.mic) return;
  stopSpeech();
  TR.mic = true; TR.micErr = ''; TR.res = null; rerenderTR();
  dictate(TR.from === 'es' ? esLang() : 'en-US', async r => {
    TR.mic = false;
    if (r.error) { TR.micErr = recError(r.error); rerenderTR(); return; }
    TR.text = r.text;
    await doTranslate(true);   /* ya elegiste el idioma al hablar: no se adivina */
    if (TR.res && TR.res.dst && !TR.res.offline && TR.res.from === 'es' && tab === 'translate') speak(TR.res.dst);
  });
}

/* ===== Foto: leer el texto con Tesseract (se carga solo cuando se usa) ===== */
const OCR_SRC = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
let ocrLib = null;
function loadOcr() {
  if (window.Tesseract) return Promise.resolve();
  if (!ocrLib) ocrLib = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = OCR_SRC; s.onload = () => res(); s.onerror = () => { ocrLib = null; rej(new Error('ocr')); };
    document.head.appendChild(s);
  });
  return ocrLib;
}
/* Las fotos del iPhone son enormes: se achican para leerlas más rápido */
function shrinkImage(file, max = 1800) {
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); res(c);
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('img')); };
    img.src = url;
  });
}
const cleanOcr = t => String(t || '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/[|~_^]{2,}/g, ' ').trim();
async function readPhoto(file) {
  if (!file || TR.ocr) return;
  TR.ocr = { msg: 'Preparando el lector de fotos…', pct: 3 }; TR.ocrErr = ''; TR.text = ''; TR.res = null; rerenderTR();
  const show = (msg, pct) => {
    if (!TR.ocr) return;
    TR.ocr.msg = msg; TR.ocr.pct = pct;
    const m = $('#ocrMsg'), b = $('#ocrBar'); if (m) m.textContent = msg; if (b) b.style.width = pct + '%';
  };
  try {
    await loadOcr();
    const canvas = await shrinkImage(file);
    const worker = await Tesseract.createWorker(TR.from === 'en' ? 'eng' : 'spa', 1, { logger: m => {
      const p = Math.round((m.progress || 0) * 100);
      if (m.status === 'recognizing text') show(`Leyendo el texto… ${p}%`, 40 + p * 0.6);
      else show('Descargando el lector (solo la primera vez)…', Math.min(38, 5 + p * 0.33));
    } });
    const { data } = await worker.recognize(canvas);
    await worker.terminate();
    const text = cleanOcr(data && data.text);
    TR.ocr = null;
    if (text) TR.text = text.slice(0, 2500);
    else TR.ocrErr = 'No encontré texto en la foto. Prueba con más luz, la letra enfocada y la foto derecha.';
  } catch (e) {
    TR.ocr = null;
    TR.ocrErr = navigator.onLine === false ? 'El lector de fotos necesita internet la primera vez que se usa.' : 'No pude leer la foto. Inténtalo de nuevo.';
  }
  rerenderTR();
}

/* ===== Botones del traductor (el lector ahora es «Mis cuentos», en js/cuentos.js) ===== */
const TR_ACTIONS = {
  translate: el => openTranslate(el.dataset.mode || 'text', el.dataset.t != null ? el.dataset.t : null),
  trmode: el => { TR.mode = el.dataset.v; if (!TR.manual) TR.from = TR.mode === 'photo' ? 'en' : 'es'; TR.micErr = ''; TR.ocrErr = ''; render(); },
  trswap: () => { TR.from = TR.from === 'en' ? 'es' : 'en'; TR.manual = true; TR.res = null; render(); },
  trgo: () => doTranslate(),
  trmic: () => translateVoice(),
  trphoto: () => { const f = $('#trFile'); if (f) { f.value = ''; f.click(); } },
  trsave: () => {
    const r = TR.res; if (!r || !r.dst) return;
    const en = r.from === 'en' ? r.src : r.dst, es = r.from === 'en' ? r.dst : r.src;
    if (!S.cards[en]) { S.cards[en] = { en, es, box: 1, due: 0, custom: true }; S.added++; save(); checkAch(); }
    toast('🃏 Guardada en tus tarjetas'); render();
  },
  trcopy: async () => toast(TR.res && (await copyText(TR.res.dst)) ? '📋 Traducción copiada' : '⚠️ No pude copiar'),
  trread: () => { if (TR.res) openReader(TR.res.src); },
  truse: el => { const h = (S.tr || [])[+el.dataset.i]; if (!h) return; TR.text = h.src; TR.from = h.from; TR.manual = true; TR.mode = 'text'; TR.res = { src: h.src, from: h.from, dst: h.dst, offline: false }; render(); window.scrollTo(0, 0); },
  trclear: () => { if (!confirm('¿Borrar lo que has traducido?')) return; S.tr = []; save(); render(); },
};
