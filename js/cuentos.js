/* ============================================================
   MIS CUENTOS (3.9) · la biblioteca de textos en inglés de Kata.
   Ella pega un cuento, lo lee en inglés y toca las palabras que no entiende.
   Cada cuento se guarda en S.texts:
     { t, title, text, tr: {nº de frase: traducción}, words: [palabras tocadas], wm: {palabra: [inglés, español]},
       pos: frase donde quedó, read: cuándo lo terminó, last: última vez abierto, xp: puntos ya dados }
   Los textos guardados antes de la 3.9 solo traen { t, text, tr }: todo lo demás es opcional.
   ============================================================ */
const ST_MAX = 30, ST_CHARS = 15000, ST_WORDS = 300;   /* cuentos · letras por cuento (unas 2.500 palabras) · palabras anotadas por cuento */
let RDR = null, rdDraft = '', rdTitle = '', rdAdd = false, rdDirty = false, rdTimer = 0, rdSaveT = 0;

const readerSentences = text => text.split(/\n+/).flatMap(p => (p.match(/[^.!?]+[.!?]+["”’')\]]*|[^.!?]+$/g) || []).map(s => s.trim()).filter(Boolean));
const readerText = () => (S.texts || []).find(x => x.t === RDR) || null;
const rdParas = text => text.split(/\n+/).map(p => readerSentences(p)).filter(p => p.length);
const rdTitleOf = x => x.title || (ws => ws.slice(0, 6).join(' ').replace(/[.,;:!?"“”]+$/, '') + (ws.length > 6 ? '…' : ''))(tokens(x.text));
const rdLen = x => tokens(x.text).length;
const rdPct = x => { const n = readerSentences(x.text).length; return x.read ? 100 : n ? Math.min(99, Math.round((x.pos || 0) / n * 100)) : 0; };
const rdList = () => [...(S.texts || [])].sort((a, b) => (b.last || b.t) - (a.last || a.t));
const rdMode = () => (S.extra && S.extra.rdMode) === 'lines' ? 'lines' : 'story';
const rdWordsN = n => `${n.toLocaleString('es-CL')} ${n === 1 ? 'palabra' : 'palabras'}`;
const rdFull = () => `Tu biblioteca está llena (${ST_MAX} cuentos). Elimina uno para agregar otro.`;
/* Ordena lo pegado: quita espacios de sobra y une las líneas cortadas a mitad de frase (pasa al copiar de un PDF) */
const rdClean = text => String(text || '').replace(/\r/g, '').replace(/[ \t ]+/g, ' ').replace(/ ?\n ?/g, '\n').replace(/\n{2,}/g, '\n').replace(/([^.!?:"”’)\n])\n(?=[a-z])/g, '$1 ').trim();

/* ===== Guardar un cuento y abrirlo ===== */
function openReader(text, title) {
  const clean = rdClean(text), all = S.texts || (S.texts = []);
  if (tokens(clean).length < 3) { toast('Pega un texto en inglés de al menos una frase'); return false; }
  const old = all.find(x => x.text === clean);
  if (old) { rdDraft = ''; rdTitle = ''; rdAdd = false; openStory(old.t); return true; }
  if (clean.length > ST_CHARS) { toast(`Es muy largo: tiene ${rdWordsN(tokens(clean).length)} y caben unas 2.500. Pégalo en dos partes.`); return false; }
  if (all.length >= ST_MAX) { toast(rdFull()); return false; }
  const item = { t: Date.now(), title: String(title || '').trim().slice(0, 60), text: clean, tr: {}, words: [], wm: {}, pos: 0, read: 0, last: Date.now() };
  while (all.some(x => x.t === item.t)) item.t++;
  all.unshift(item);
  if (!save()) {   /* el teléfono no tiene más espacio: no se pierde nada de lo anterior */
    S.texts = all.filter(x => x !== item); save();
    toast('⚠️ No queda espacio en el teléfono para guardar este cuento'); return false;
  }
  rdDraft = ''; rdTitle = ''; rdAdd = false;
  openStory(item.t);
  return true;
}
function openStory(t) {
  const x = (S.texts || []).find(s => s.t === +t); if (!x) return;
  RDR = x.t; x.last = Date.now(); save();
  if (tab === 'reader') render(); else go('reader');
  rdJump(x.read ? 0 : x.pos || 0, true);
}

/* ===== Dónde quedaste: la primera frase que se ve arriba de la pantalla ===== */
function rdJump(i, flash) {
  const e = i ? $(`#view [data-s="${i}"]`) : null;
  if (!e) { window.scrollTo(0, 0); return; }
  window.scrollTo(0, Math.max(0, e.getBoundingClientRect().top + window.scrollY - 78));
  if (flash) { e.classList.add('here'); toast('📍 Sigues donde quedaste'); }
}
function rdFlush() { if (rdDirty) { rdDirty = false; save(); } }
function rdScrolled() {
  rdTimer = 0;
  const x = tab === 'reader' && !A && !SHEET.open ? readerText() : null; if (!x) return;
  const els = [...document.querySelectorAll('#view [data-s]')]; if (!els.length) return;
  const hit = els.find(e => e.getBoundingClientRect().bottom > 84) || els[els.length - 1], pos = +hit.dataset.s || 0;
  if (pos === (x.pos || 0)) return;
  x.pos = pos; rdDirty = true;
  clearTimeout(rdSaveT); rdSaveT = setTimeout(rdFlush, 1500);   /* se guarda cuando dejas de mover la pantalla */
}
window.addEventListener('scroll', () => { if (RDR != null && !rdTimer) rdTimer = setTimeout(rdScrolled, 400); }, { passive: true });
window.addEventListener('pagehide', rdFlush);
document.addEventListener('visibilitychange', () => { if (document.visibilityState !== 'visible') rdFlush(); });

/* ===== Pantallas ===== */
const rdTap = (s, seen) => String(s).split(/([A-Za-z][A-Za-z'’-]*[A-Za-z]|[A-Za-z])/)
  .map((p, i) => i % 2 ? `<span class="tw${seen.has(normWord(p)) ? ' seen' : ''}" data-act="rdword" data-w="${esc(p)}">${esc(p)}</span>` : esc(p)).join('');
const rdRow = x => {
  const p = rdPct(x), n = (x.words || []).length;
  return `<button class="lesson ${x.read ? 'done' : ''}" data-act="rdpick" data-t="${x.t}"><span class="lesson-icon">${x.read ? '✅' : p ? '📍' : '📖'}</span><span class="lesson-info grow"><b>${esc(rdTitleOf(x))}</b><span class="muted small">${rdWordsN(rdLen(x))} · ${x.read ? 'Leído' : p ? `Vas en ${p} %` : 'Sin leer'}${n ? ` · 🔖 ${n}` : ''}</span></span>${ic('play', 'sm accent')}</button>`;
};
const rdCountText = () => { const n = rdDraft.trim() ? tokens(rdDraft).length : 0; return rdWordsN(n) + (rdDraft.length > ST_CHARS ? ' · muy largo (caben unas 2.500)' : ''); };
function rdCountDraw() { const c = $('#rdCount'); if (c) { c.textContent = rdCountText(); c.classList.toggle('bad-text', rdDraft.length > ST_CHARS); } }
function rdFormHTML(has) {
  return topBar(has ? '📚 Nuevo cuento' : '📚 Mis cuentos', has ? `<button class="icon-btn" data-act="rdcancel" aria-label="Volver a mis cuentos">${ic('x')}</button>` : closeBtn()) + `
    <p class="muted small">${has ? 'Pega el cuento en inglés. Queda guardado en tu biblioteca.' : 'Aquí guardas tus cuentos e historias en inglés. Los lees en inglés y, si no entiendes una palabra, la tocas para ver qué significa.'}</p>
    <div class="st-form"><input id="rdTitle" value="${esc(rdTitle)}" placeholder="Título (opcional)" maxlength="60" autocomplete="off">
    <textarea id="rdIn" rows="9" placeholder="Pega aquí el cuento en inglés…" autocomplete="off" autocapitalize="off" spellcheck="false">${esc(rdDraft)}</textarea>
    <div class="row between st-count"><button class="add-btn" data-act="rdpaste">📋 Pegar</button><span id="rdCount" class="small muted ${rdDraft.length > ST_CHARS ? 'bad-text' : ''}">${rdCountText()}</span></div></div>
    <button class="btn primary wide" data-act="rdopen">📖 Guardar y leer</button>
    <p class="muted small st-note">💡 Caben ${ST_MAX} cuentos de hasta unas 2.500 palabras cada uno. Van incluidos en tu copia de «Exportar progreso».</p>`;
}
function rdWordsHTML(x) {
  const ws = x.words || [], wm = x.wm || {};
  if (!ws.length) return '<h2>🔖 Tus palabras de este cuento</h2><p class="muted small">Cada palabra que toques queda anotada aquí, para que después la pases a tus tarjetas.</p>';
  const has = w => !!S.cards[wm[w] ? wm[w][0] : w], todo = ws.filter(w => !has(w)).length;
  return `<h2>🔖 Tus palabras de este cuento (${ws.length})</h2>
    ${ws.map(w => `<div class="word-row"><button class="grow as-btn" data-act="word" data-w="${esc(w)}"><b>${esc(showWord(w))}</b><span class="muted small block">${esc(wm[w] ? wm[w][1] : gloss(w) || 'Toca para ver qué significa')}</span></button>${has(w) ? '<span class="add-btn added">✓ Tarjeta</span>' : `<button class="add-btn" data-act="rdcard" data-w="${esc(w)}">+ Tarjeta</button>`}<button class="icon-btn sm" data-act="rdunword" data-w="${esc(w)}" aria-label="Quitar de la lista">${ic('x')}</button></div>`).join('')}
    ${todo > 1 ? `<button class="btn ghost wide" data-act="rdcards">🃏 Pasar las ${todo} a mis tarjetas</button>` : ''}`;
}
function rdDrawWords(x) { const b = x && $('#rdWords'); if (b) b.innerHTML = rdWordsHTML(x); }
function rdStoryHTML(x) {
  const mode = rdMode(), seen = new Set(x.words || []), ss = readerSentences(x.text), left = ss.filter((s, i) => !x.tr[i]).length;
  let k = 0;
  const body = mode === 'story'
    ? `<article class="card st-text">${rdParas(x.text).map(p => `<p>${p.map(s => `<span class="st-s" data-s="${k++}">${rdTap(s, seen)}</span>`).join(' ')}</p>`).join('')}</article>`
    : `<section class="card rd-text">${ss.map((s, i) => `<div class="rd-s" data-s="${i}"><div class="rd-en">${rdTap(s, seen)}</div>${x.tr[i] ? `<div class="rd-es">${esc(x.tr[i])}</div>` : ''}
      <div class="rd-btns">${sayBtn(s, 'sm')}<button class="round-btn sm" data-act="say" data-t="${esc(s)}" data-slow="1" aria-label="Lento">🐢</button>${x.tr[i] ? '' : `<button class="add-btn" data-act="rdtr" data-i="${i}">Traducir</button>`}</div></div>`).join('')}</section>
      ${left ? `<button class="btn ghost wide" data-act="rdall">🌐 Traducir todo (${left} ${left === 1 ? 'frase' : 'frases'})</button>` : ''}`;
  return `<div class="lesson-top st-top"><button class="icon-btn" data-act="rdclose" aria-label="Volver a mis cuentos">${ic('x')}</button><b class="grow st-name">${esc(rdTitleOf(x))}</b>${dictBtn('sm')}</div>
    <div class="seg"><button class="${mode === 'story' ? 'on' : ''}" data-act="rdmode" data-v="story">📖 Cuento</button><button class="${mode === 'lines' ? 'on' : ''}" data-act="rdmode" data-v="lines">🔎 Frase por frase</button></div>
    <p class="muted small">${mode === 'story' ? 'Lee en inglés. Si no entiendes una palabra, tócala para ver qué significa.' : 'Escucha cada frase y, si la necesitas, mira su traducción. Las palabras también se pueden tocar.'}</p>
    ${body}
    ${x.read ? `<p class="center st-done">✅ Leído el ${new Date(x.read).toLocaleDateString('es-CL')}</p><button class="btn ghost wide" data-act="rdagain">↩︎ Leer de nuevo</button>`
      : '<button class="btn primary wide" data-act="rdread">✅ Ya lo leí</button>'}
    <section class="card st-words" id="rdWords">${rdWordsHTML(x)}</section>
    <div class="row st-foot"><button class="link-inline small" data-act="rdrename">✏️ Cambiar título</button><span class="grow"></span><button class="link-inline small" data-act="rddel" data-t="${x.t}">🗑️ Eliminar cuento</button></div>`;
}
function renderReader() {
  const cur = readerText(), list = rdList();
  if (cur) return rdStoryHTML(cur);
  if (rdAdd || !list.length) return rdFormHTML(list.length);
  const read = list.filter(x => x.read).length;
  return topBar('📚 Mis cuentos', closeBtn()) + `
    <p class="muted small">Tus cuentos en inglés. Léelos sin traducir y toca cualquier palabra que no entiendas para ver qué significa.</p>
    <button class="btn primary wide" data-act="rdnew">＋ Agregar un cuento</button>
    <div class="path st-list">${list.map(rdRow).join('')}</div>
    <p class="muted small center st-note">${list.length} de ${ST_MAX} cuentos · ${read} ${read === 1 ? 'leído' : 'leídos'}</p>`;
}

/* ===== Traducir frases (modo «Frase por frase») ===== */
async function readerTranslate(indexes) {
  const cur = readerText(); if (!cur) return;
  const ss = readerSentences(cur.text);
  let rough = false;
  for (const i of indexes.slice(0, 40)) {
    if (cur.tr[i] || !ss[i]) continue;
    const r = await translateText(ss[i], 'en');
    if (!r.dst) { toast('⚠️ No pude traducir. Revisa tu conexión a internet.'); break; }
    if (r.offline) { rough = true; cur.tr[i] = '≈ ' + r.dst; break; }   /* sin internet: una frase aproximada y se detiene */
    cur.tr[i] = r.dst;
  }
  save();
  if (rough) toast('📴 Sin internet o sin cupo: traducción aproximada');
  if (tab === 'reader' && readerText() === cur) render();
}

/* ===== Palabras tocadas: quedan anotadas en el cuento, con su significado ===== */
async function rdMeaning(w) {   /* qué tarjeta le corresponde: diccionario de la app o, con internet, Wiktionary */
  try { await loadDict(); } catch (e) {}
  const r = DICT ? lookup(w) : null;
  if (r) return cardFor(r);
  try {
    const wk = await wikiLookup(w);
    if (wk && wk.trans.length) return { en: w, es: wk.trans.join(', ') };
    if (wk && wk.lemma) {
      const lr = DICT ? lookup(wk.lemma) : null; if (lr) return cardFor(lr);
      const w2 = await wikiLookup(wk.lemma);
      if (w2 && w2.trans.length) return { en: wk.lemma, es: w2.trans.join(', ') };
    }
  } catch (e) {}
  return null;
}
function rdMarkSeen(w, on = true) { document.querySelectorAll('#view .tw').forEach(e => { if (normWord(e.dataset.w || '') === w) e.classList.toggle('seen', on); }); }
async function rdWord(el) {
  const x = readerText(), raw = el.dataset.w, w = normWord(raw);
  if (x && w) {
    const ws = x.words || (x.words = []);
    if (!ws.includes(w) && ws.length < ST_WORDS) { ws.push(w); save(); rdMarkSeen(w); rdDrawWords(x); }
  }
  await openWord(raw);
  if (!x || !w || !(x.words || []).includes(w) || (x.wm || {})[w]) return;
  const m = await rdMeaning(w);
  if (m && (x.words || []).includes(w)) { (x.wm || (x.wm = {}))[w] = [m.en, m.es]; save(); if (readerText() === x) rdDrawWords(x); }
}
async function rdToCard(x, w) {   /* 'new' = tarjeta nueva · 'had' = ya estaba · 'miss' = no se encontró el significado */
  const known = (x.wm || {})[w], m = known ? { en: known[0], es: known[1] } : await rdMeaning(w);
  if (!m) return 'miss';
  (x.wm || (x.wm = {}))[w] = [m.en, m.es];
  if (S.cards[m.en]) return 'had';
  S.cards[m.en] = { en: m.en, es: m.es, box: 1, due: 0 };
  return 'new';
}

/* ===== Botones de «Mis cuentos» ===== */
const ST_ACTIONS = {
  rdnew: () => { if ((S.texts || []).length >= ST_MAX) { toast(rdFull()); return; } rdAdd = true; render(); window.scrollTo(0, 0); },
  rdcancel: () => { rdAdd = false; render(); window.scrollTo(0, 0); },
  rdpaste: async () => {
    let t = '';
    try { t = await navigator.clipboard.readText(); } catch (e) {}
    if (!t.trim()) { toast('Mantén presionado el cuadro y elige «Pegar»'); return; }
    rdDraft = t; render();
  },
  rdopen: () => { openReader(rdDraft, rdTitle); },
  rdpick: el => openStory(el.dataset.t),
  rdclose: () => { rdFlush(); RDR = null; rdAdd = false; render(); window.scrollTo(0, 0); },
  rdmode: el => { const x = readerText(); X().rdMode = el.dataset.v === 'lines' ? 'lines' : 'story'; save(); render(); rdJump(x ? x.pos || 0 : 0); },
  rdword: el => rdWord(el),
  rdunword: el => {
    const x = readerText(), w = el.dataset.w; if (!x) return;
    x.words = (x.words || []).filter(k => k !== w); if (x.wm) delete x.wm[w];
    save(); rdMarkSeen(w, false); rdDrawWords(x);
  },
  rdcard: async el => {
    const x = readerText(); if (!x) return;
    const r = await rdToCard(x, el.dataset.w);
    save(); toast(r === 'miss' ? 'No encontré qué significa. Tócala con internet para buscarla.' : '🃏 Agregada a tus tarjetas');
    if (readerText() === x) rdDrawWords(x);
  },
  rdcards: async () => {
    const x = readerText(); if (!x) return;
    let added = 0, miss = 0;
    for (const w of [...(x.words || [])]) { const r = await rdToCard(x, w); if (r === 'new') added++; else if (r === 'miss') miss++; }
    save(); checkAch();
    toast(`🃏 ${added} ${added === 1 ? 'tarjeta nueva' : 'tarjetas nuevas'}${miss ? ` · ${miss} sin significado` : ''}`);
    if (readerText() === x) rdDrawWords(x);
  },
  rdread: () => {
    const x = readerText(); if (!x) return;
    let xp = 0;
    x.read = Date.now();
    if (!x.xp) { xp = x.xp = Math.max(5, Math.min(40, Math.round(rdLen(x) / 50))); X().stories = (X().stories || 0) + 1; addXp(xp); }
    save(); render();
    if (xp) { celebrate(); toast(`🎉 ¡Cuento leído! +${xp} XP`); } else toast('✅ Marcado como leído');
  },
  rdagain: () => { const x = readerText(); if (!x) return; x.read = 0; x.pos = 0; save(); render(); window.scrollTo(0, 0); },
  rdrename: () => {
    const x = readerText(); if (!x) return;
    const t = prompt('Título del cuento', rdTitleOf(x)); if (t == null) return;
    x.title = t.trim().slice(0, 60); save(); render();
  },
  rddel: el => {
    if (!confirm('¿Eliminar este cuento? No se puede deshacer.')) return;
    S.texts = (S.texts || []).filter(x => String(x.t) !== el.dataset.t);
    if (String(RDR) === el.dataset.t) RDR = null;
    save(); render(); window.scrollTo(0, 0);
  },
  rdtr: el => readerTranslate([+el.dataset.i]),
  rdall: () => { const cur = readerText(); if (!cur) return; toast('🌐 Traduciendo…'); return readerTranslate(readerSentences(cur.text).map((s, i) => i)); }
};
