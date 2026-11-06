'use strict';
/* Fluenta · Navegación (barra de abajo y ✕), tema claro/oscuro y color, y la pantalla de Inicio. */
/* ===== Navegación ===== */
let tab = 'home', statSeg = 'week';
let pronCurrent = null, pronResult = null, L = null, D = null, F = null, P = null;
const view = () => $('#view');
/* Cada pantalla interna pertenece a un botón de la barra, para que siempre se vea dónde estás */
const NAV_OF = { home: 'home', profile: 'home', lessons: 'lessons', review: 'review', stats: 'stats' };
/* La ✕ de una pantalla interna vuelve a donde estabas antes de entrar */
const PAGE_BACK = { tenses: 'lessons', verbs: 'lessons', grammar: 'lessons', talk: 'lessons', write: 'lessons', claude: 'write', mycards: 'review' };
const pageBack = {};
const backOf = t => pageBack[t] || PAGE_BACK[t] || 'home';
/* Una pantalla interna se marca en el botón desde donde entraste (Escribir desde Lecciones, Mejoras de Claude desde Repaso…) */
const navOf = (t, n = 0) => NAV_OF[t] || (n < 6 ? navOf(backOf(t), n + 1) : 'home');
const closeBtn = () => `<button class="icon-btn" data-act="back" aria-label="Cerrar">${ic('x')}</button>`;
/* Secciones que se despliegan en Lecciones y en Repaso: queda abierta la última que tocaste */
const openCat = { lessons: null, review: null };
function go(t) {
  if (t === 'cards') t = 'review';
  if (PAGE_BACK[t] && t !== tab && pageBack[tab] !== t) pageBack[t] = tab;
  tab = t; L = null; D = null; F = null; P = null; W = null;
  if (SHEET.open) closeSheet();
  document.body.classList.remove('focus');
  try { rec && rec.abort(); } catch (e) {}
  render();
  const c = openCat[t] && $(`#cat-${openCat[t]}`);
  window.scrollTo(0, c ? Math.max(0, c.getBoundingClientRect().top + window.scrollY - 12) : 0);
}
function render() {
  rollover();
  markNav(navOf(tab));
  view().innerHTML = ({ home: renderHome, lessons: renderLessons, talk: renderTalk, review: renderReview, mycards: renderMyCards, stats: renderStats, profile: renderProfile, write: renderWriteTab, grammar: renderGrammar, claude: renderClaude, tenses: renderTenses, verbs: renderVerbs })[tab]();
  if (tab === 'home') fillWod();
}
/* Barra de abajo: una burbuja de color se desliza hasta el botón marcado y su ícono da un saltito */
let navNow = '';
function placeNavPill() {
  const b = $('#tabs button.active'), pill = $('#tabs .tab-pill');
  if (!pill) return;
  if (!b || !b.offsetWidth) { pill.style.opacity = '0'; return; }   /* barra escondida (en una actividad) */
  pill.style.opacity = '1';
  pill.style.width = b.offsetWidth + 'px';
  pill.style.transform = `translateX(${b.offsetLeft}px)`;
  if (!pill.classList.contains('ready')) requestAnimationFrame(() => pill.classList.add('ready'));   /* la primera vez aparece sin deslizarse */
}
function markNav(nav) {
  document.querySelectorAll('#tabs [data-tab]').forEach(b => {
    const on = b.dataset.tab === nav;
    b.classList.toggle('active', on);
    if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  placeNavPill();
  if (nav !== navNow) {
    const b = $(`#tabs [data-tab="${nav}"] .ic`);
    if (navNow && b) animate(b, 'tab-hop');
    navNow = nav;
  }
}
function renderNav() {
  $('#tabs').innerHTML = `<span class="tab-pill" aria-hidden="true"></span>
    <button data-act="tab" data-tab="home">${ic('home')}<span>Inicio</span></button>
    <button data-act="tab" data-tab="lessons">${ic('book')}<span>Lecciones</span></button>
    <button data-act="tab" data-tab="review">${ic('review')}<span>Repaso</span></button>
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
/* El diccionario se abre desde arriba en todas las pantallas (antes era un botón flotante que tapaba las opciones) */
const dictBtn = (cls = '') => `<button class="icon-btn ${cls}" data-act="dict" aria-label="Buscar en el diccionario">${ic('dict')}</button>`;
const topBar = (title, right = '') => `<header class="page-top"><h1>${title}</h1><div class="top-btns">${dictBtn()}${right}</div></header>`;
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
    '--text': hsl(h - 15, tint(35), 20), '--muted': hsl(h - 15, tint(20), 46)
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
function accentNowHTML(accent) {
  const preset = ACCENTS.find(a => a[0] === accent);
  return `Color actual: <b>${esc(preset ? preset[1] : 'elegido por ti')}</b>${accent !== DEFAULT_ACCENT ? ` · <button class="link-inline" data-act="accent" data-v="${DEFAULT_ACCENT}">volver al original</button>` : ''}`;
}
/* "Otro color": mientras deslizas en el selector del iPhone llegan muchos cambios seguidos.
   El color se aplica sin redibujar Perfil: si el selector se reemplaza, el iPhone deja de seguir tu dedo. */
let accentTimer = 0;
function previewAccent(v) {
  v = String(v).toLowerCase(); if (!/^#[0-9a-f]{6}$/.test(v)) return;
  if (v === currentAccent()) return;   /* llegan "input" y "change" juntos con el mismo color */
  S.accent = v === DEFAULT_ACCENT ? '' : v;
  applyTheme();
  document.querySelectorAll('.swatch').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  const dot = $('.other-color .dot'); if (dot) dot.style.setProperty('--sw', v);
  const now = $('#accentNow'); if (now) now.innerHTML = accentNowHTML(v);
  clearTimeout(accentTimer); accentTimer = setTimeout(() => { save(); toast('🎨 Color cambiado'); }, 800);   /* se guarda cuando sueltas */
}

/* ===== INICIO ===== */
/* La inicial del círculo del perfil (sin nombre, una carita; [...] para no cortar un emoji por la mitad) */
const initial = () => ([...(S.name || '')][0] || '🙂').toUpperCase();
function greeting() { const h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches'; }
/* Se usa desde Safari (en el ícono de inicio el micrófono no funciona), así que se sugiere Favoritos */
function installTip() {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (!ios || navigator.standalone || S.favTip) return '';
  return `<div class="card tip"><b>⭐ Guarda Fluenta en Favoritos</b><p class="muted small">En Safari toca el libro <b>📖</b> (o Compartir <b>⬆️</b>) y elige <b>"Agregar a Favoritos"</b>. Así la abres con un toque y el micrófono funciona.</p><button class="btn ghost wide" data-act="favdone">Listo, ya la guardé</button></div>`;
}
/* Tu avance en cada sección (los círculos de Inicio): al tocar uno se abre esa sección */
function sectionStats() {
  const ls = allLessons(), phrases = allPhrases(), cards = Object.values(S.cards);
  const topics = new Set(((S.writing && S.writing.texts) || []).map(e => e.topic));
  return [
    { attrs: 'data-act="tab" data-tab="lessons" data-cat="course"', icon: 'book', title: 'Lecciones', p: pct(ls.filter(l => S.done[l.id]).length, ls.length) },
    { attrs: 'data-act="tenses"', icon: 'clock', title: 'Tiempos', p: pct(TENSE_LESSONS.filter(l => S.done[l.id]).length, TENSE_LESSONS.length) },
    { attrs: 'data-act="tab" data-tab="lessons" data-cat="talk"', icon: 'chat', title: 'Diálogos', p: pct(DIALOGS.filter(d => S.dialogs[d.id]).length, DIALOGS.length) },
    { attrs: 'data-act="tab" data-tab="lessons" data-cat="talk"', icon: 'mic', title: 'Pronunciación', p: pct(phrases.filter(p => (S.pron[p] || 0) >= 70).length, phrases.length) },
    { attrs: 'data-act="tab" data-tab="lessons" data-cat="write"', icon: 'pen', title: 'Escribir', p: pct(WRITE_TOPICS.filter(t => topics.has(t.id)).length, WRITE_TOPICS.length) },
    { attrs: 'data-act="tab" data-tab="review" data-cat="cards"', icon: 'cards', title: 'Tarjetas', p: pct(cards.filter(c => c.box >= 4).length, cards.length) }
  ];
}
function resumeCard() {
  const r = S.resume && savedResume(S.resume.id);
  return r ? `<button class="card action-card resume-card" data-act="lesson" data-id="${esc(r.id)}"><span class="icon-bubble">${esc(r.icon || '📘')}</span><span class="grow"><b>Continuar donde quedaste</b><small class="muted block">${esc(r.title || 'Lección')} · ejercicio ${r.i + 1} de ${r.queue.length}</small></span>${ic('play', 'sm accent')}</button>` : '';
}
function renderHome() {
  const lv = levelInfo(), st = currentStreak(), goalPct = Math.min(100, pct(S.dailyXp, S.goal));
  const nx = allLessons().find(l => !S.done[l.id]);
  /* Si la lección a medias es la misma del botón grande, el botón dice "Continuar" y no se repite abajo */
  const rs = S.resume && savedResume(S.resume.id), heroResume = rs && nx && rs.id === nx.id;
  const table = leagueTable(), pos = table.findIndex(r => r.you);
  const weak = weakItems(20).length + writingDrills(4).length + weakVerbs(3).length;
  const needBackup = S.xp > 0 && Date.now() - (S.lastExport || 0) > 7 * 864e5;
  return `
  <header class="home-top"><div><p class="muted">${greeting()}${S.name ? ', ' + esc(S.name) : ''} 👋</p><p class="small muted">Nivel ${lv.L} · Liga ${leagueName()}</p></div>
    <div class="top-btns">${dictBtn()}<button class="avatar" data-act="tab" data-tab="profile" aria-label="Perfil">${esc(initial())}</button></div></header>
  ${installTip()}
  <section class="hero">
    <div class="hero-pills"><span>🔥 ${st} ${st === 1 ? 'día' : 'días'}</span><span>⭐ ${S.xp} XP</span></div>
    <h1>¡Sigue con<br>tu inglés!</h1>
    <div class="hero-bar"><i style="width:${lv.pct}%"></i></div>
    <p class="hero-sub">${lv.need - lv.cur} XP para el nivel ${lv.L + 1}</p>
    ${nx ? `<button class="hero-btn" data-act="lesson" data-id="${nx.id}"><span class="hero-btn-icon">${nx.icon}</span><span class="grow"><small>${heroResume ? `Continuar · ${rs.i + 1} de ${rs.queue.length}` : Object.keys(S.done).length ? 'Continuar' : 'Empezar'}</small><b>${esc(nx.title)}</b></span>${ic('play', 'sm')}</button>`
      : `<p class="hero-sub">🎓 ¡Completaste todas las lecciones!</p>`}
  </section>
  ${heroResume ? '' : resumeCard()}
  <section class="card daily"><div id="wod"></div>${verbOfDayHTML()}</section>
  <section class="card sec-box"><h2>Tus secciones</h2>
    <div class="grid3">${sectionStats().map((s, i) => `
      <button class="sec-mini c${i + 1}" ${s.attrs}><span class="sec-ring" style="--p:${s.p}"><span>${ic(s.icon)}</span></span><b>${s.title}</b><small>${s.p}%</small></button>`).join('')}</div></section>
  <section class="card row goal-card">${ring(goalPct, `${S.dailyXp}/${S.goal}`)}<div class="grow"><b>Meta diaria</b><p class="muted small">${goalPct >= 100 ? '¡Cumplida! ✅ Sigue sumando para la liga.' : `Te faltan ${S.goal - S.dailyXp} XP para hoy.`}</p></div></section>
  ${weak >= 3 ? `<button class="card action-card" data-act="lesson" data-id="auto"><span class="icon-bubble warm">${ic('target')}</span><span class="grow"><b>Practica tus errores</b><small class="muted block">${weak} palabras y frases para reforzar</small></span>${ic('play', 'sm accent')}</button>` : ''}
  ${needBackup ? `<button class="card action-card" data-act="export"><span class="icon-bubble">${ic('upload')}</span><span class="grow"><b>Guarda una copia</b><small class="muted block">Exporta tu progreso para respaldarlo y que Claude lo revise</small></span></button>` : ''}
  <section class="card"><div class="row between"><h2>🏆 Liga ${leagueName()}</h2><span class="muted small">Esta semana</span></div>
    ${leagueHTML(table, 5)}<p class="muted small center">Vas en el puesto #${pos + 1} de ${table.length}.</p></section>`;
}
