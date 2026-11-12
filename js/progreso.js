'use strict';
/* Fluenta · Progreso, respaldo (exportar e importar) y Perfil. */
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
  const weak = weakItems(8), sounds = weakSounds(8), snd = soundStats();
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
  ${calendarHTML()}${diplomasHTML()}
  <section class="card"><h2>🎯 Precisión por ejercicio</h2>
    ${types.length ? types.map(([k, label]) => { const t = S.types[k], p = pct(t.ok, t.ok + t.fail); return `<div class="type-row"><div class="row between"><span>${label}</span><span class="muted small">${p}% · ${t.ok + t.fail} intentos</span></div><div class="bar thin ${p < 60 ? 'low' : ''}"><i style="width:${p}%"></i></div></div>`; }).join('') : '<p class="muted small">Completa una lección para ver tus estadísticas.</p>'}
  </section>
  ${tensesStatsHTML()}
  <section class="card"><h2>🔴 Lo que más te cuesta</h2>
    ${weak.length ? weak.map(i => `<div class="word-row">${sayBtn(i.en, 'sm')}<div class="grow"><b>${tapText(i.en)}</b><span class="muted small block">${esc(i.es)}</span></div><span class="score-tag bad">✗ ${i.fail}</span><span class="score-tag good">✓ ${i.ok}</span></div>`).join('')
      + `<button class="btn primary wide" data-act="lesson" data-id="auto">🎯 Practicar mis errores</button>` : '<p class="muted small">¡Aún no hay errores registrados! 🌟</p>'}
  </section>
  ${snd.length ? `<section class="card"><h2>🎯 Tus sonidos</h2><p class="muted small">Promedio de tus palabras al hablar, según el sonido difícil que tienen.</p>
    ${snd.map(x => `<div class="type-row"><div class="row between"><span>${x.grp.icon} ${esc(x.grp.title)}</span><span class="muted small">${x.avg}% · ${x.words} palabras</span></div><div class="bar thin ${x.avg < 60 ? 'low' : ''}"><i style="width:${x.avg}%"></i></div></div>`).join('')}
    ${snd[0].avg < 85 ? `<button class="btn primary wide" data-act="psession" data-g="${snd[0].id}">${snd[0].grp.icon} Practicar «${esc(snd[0].grp.title)}»</button>` : ''}</section>` : ''}
  ${sounds.length ? `<section class="card"><h2>🎤 Palabras a mejorar al hablar</h2><div class="word-chips">${sounds.map(([w, p]) => { const g = gloss(w); return `<button class="word-chip bad" data-act="word" data-w="${esc(w)}"><b>${esc(w)}</b>${g ? `<small>${esc(g)}</small>` : ''}<small>${p.n ? `${Math.round(p.sum / p.n)}% · ` : ''}${p.fail} ✗ · ${p.ok} ✓</small></button>`; }).join('')}</div></section>` : ''}
  ${ps.length ? `<section class="card"><h2>🎙️ Sesiones de pronunciación</h2><p class="muted small">${ps.length} ${ps.length === 1 ? 'sesión' : 'sesiones'} · promedio ${pct(ps.reduce((a, s) => a + s.avg, 0), ps.length * 100)}%</p>${ps.slice(-4).reverse().map(s => `<div class="word-row"><div class="grow"><span>${esc(s.group)}</span><span class="muted small block">${new Date(s.t).toLocaleDateString('es-CL')} · ${s.done}/${s.n} frases</span></div><span class="score-tag ${s.avg >= 70 ? 'good' : 'bad'}">${s.avg}%</span></div>`).join('')}</section>` : ''}
  ${wTexts.length ? `<section class="card"><h2>✍️ Escritura</h2><p class="muted small">${wTexts.length} ${wTexts.length === 1 ? 'texto' : 'textos'} · ${wTexts.reduce((a, e) => a + (e.words || 0), 0)} palabras · ${wTexts.filter(e => e.errors && !e.errors.length).length} sin errores</p>
    ${wErr.length ? `<span class="label">Tus errores más frecuentes</span>${wErr.map(e => `<div class="wfix-item"><span class="tag-type">${esc(e.type)} · ${e.n}×${e.claude ? ' · ✨ Claude' : ''}</span><div><del>${esc(e.wrong)}</del> → <ins>${esc(e.right || '(quitar)')}</ins></div><div class="small">${esc(e.es)}</div>${tenseLink(e)}</div>`).join('')}` : '<p class="muted small">¡Aún no hay errores de escritura! 🌟</p>'}
    <button class="btn ghost wide" data-act="tab" data-tab="write">✍️ Seguir escribiendo</button></section>` : ''}
  ${dWrong.length ? `<section class="card"><h2>💬 Errores en diálogos</h2>${dWrong.map(x => { const d = DIALOGS.find(y => y.id === x.id), es = optionEs(d, x.en); return `<div class="word-row"><span>${d ? d.icon : '💬'}</span><div class="grow"><span class="small">“${esc(x.en)}”</span>${es ? `<span class="muted small block">${esc(es)}</span>` : ''}<span class="muted small block">${d ? esc(d.title) : ''}</span></div><span class="score-tag bad">${x.n}×</span></div>`; }).join('')}</section>` : ''}
  <section class="card action-card"><span class="icon-bubble">${ic('upload')}</span><div class="grow"><b>Revisión con Claude</b><p class="muted small">Exporta tu progreso, guárdalo en tu PC en <b>APP 2.0\\progreso</b> y dile a Claude "revisa mi progreso".</p></div></section>
  <button class="btn primary wide" data-act="export">${ic('upload', 'sm')} Exportar progreso</button>`;
}

/* Progreso: tus tiempos verbales y tus verbos irregulares */
function tensesStatsHTML() {
  const rows = TENSES.map(t => ({ t, p: tenseStat(t.id), n: S.tense[t.id] ? S.tense[t.id].ok + S.tense[t.id].fail : 0 })).filter(x => x.p != null);
  const weakest = rows.filter(x => x.p < 85).sort((a, b) => a.p - b.p)[0];
  const vs = Object.values(S.verbs).flatMap(v => [v.past, v.part].filter(Boolean)), vOk = vs.reduce((a, f) => a + f.ok, 0), vN = vs.reduce((a, f) => a + f.ok + f.fail, 0);
  const bar = (label, p, sub) => `<div class="type-row"><div class="row between"><span>${label}</span><span class="muted small">${p}% · ${sub}</span></div><div class="bar thin ${p < 60 ? 'low' : ''}"><i style="width:${p}%"></i></div></div>`;
  return `<section class="card"><h2>⏳ Tus tiempos verbales</h2>
    ${rows.length ? rows.map(x => bar(`${x.t.icon} ${esc(x.t.title)}`, x.p, `${x.n} respuestas`)).join('') : '<p class="muted small">Aún no practicas los tiempos verbales. Ahí aprendes el presente, el pasado y el futuro con mucha práctica.</p>'}
    ${vN ? bar('🔀 Verbos irregulares', pct(vOk, vN), `${Object.keys(S.verbs).length} verbos`) : ''}
    ${weakest ? `<button class="btn primary wide" data-act="tense" data-id="${weakest.t.id}">${weakest.t.icon} Repasar «${esc(weakest.t.title)}»</button>` : '<button class="btn primary wide" data-act="tenses">⏳ Ir a Tiempos verbales</button>'}
    ${weakVerbs(1).length ? '<button class="btn ghost wide" data-act="lesson" data-id="verbs">🔀 Practicar los irregulares que más te cuestan</button>' : ''}</section>`;
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
    palabras_a_mejorar_al_hablar: weakSounds(20).map(([w, p]) => ({ palabra: w, errores: p.fail, aciertos: p.ok, promedio: p.n ? Math.round(p.sum / p.n) + '%' : undefined })),
    sonidos: soundStats().map(x => ({ sonido: x.grp.title, promedio: x.avg + '%', palabras: x.words })),
    tiempos_verbales: Object.fromEntries(TENSES.filter(t => S.tense[t.id]).map(t => { const x = S.tense[t.id]; return [t.title, { aciertos: x.ok, errores: x.fail, precision: pct(x.ok, x.ok + x.fail) + '%', practicas: `${tenseDone(t)}/${t.lessons.length}` }]; })),
    verbos_irregulares_dificiles: weakVerbs(15).map(x => { const v = IRR_MAP.get(x.b); return { verbo: `${v.b} – ${v.past} – ${v.part}`, significado: v.es, le_cuesta: x.form === 'past' ? 'el pasado' : 'el participio' }; }),
    sesiones_pronunciacion: (S.pronSessions || []).slice(-15).map(s => ({ fecha: dayStr(new Date(s.t)), grupo: s.group, frases: `${s.done}/${s.n}`, promedio: s.avg + '%', palabras_a_practicar: s.words })),
    escritura: (() => {
      const wr = S.writing || { texts: [], errs: {} };
      return {
        textos: wr.texts.length, palabras: wr.texts.reduce((a, e) => a + (e.words || 0), 0),
        errores_frecuentes: Object.values(wr.errs).sort((a, b) => b.n - a.n).slice(0, 25).map(e => ({ error: e.wrong, correcto: e.right, tipo: e.type, explicacion: e.es, veces: e.n, de_claude: e.claude || undefined })),
        ultimos_textos: wr.texts.slice(-15).map(e => { const tp = WRITE_TOPICS.find(x => x.id === e.topic); return { fecha: dayStr(new Date(e.t)), tema: tp ? tp.title : e.topic, pregunta: e.q, texto: e.text, revisado: e.errors ? (e.partial ? 'solo lo básico (sin internet)' : 'sí') : 'no', revisado_por_claude: e.claude ? 'sí' : 'no', errores: (e.errors || []).map(x => ({ error: x.wrong, correcto: x.right, explicacion: x.es })), errores_claude: e.claude ? e.claude.errors.map(x => ({ error: x.wrong, correcto: x.right, explicacion: x.es })) : undefined }; })
      };
    })(),
    tarjetas: { total: Object.keys(S.cards).length, por_caja: [1, 2, 3, 4, 5].map(b => Object.values(S.cards).filter(c => c.box === b).length) },
    extras: { lecturas_hechas: Object.keys(X().read).length, historias_escuchadas: Object.keys(X().listen).length, pares_de_sonidos: X().pairs, juegos: X().games,
      prueba_de_nivel: X().placed || 'no hecha', diplomas: X().diplomas, traducciones_guardadas: (S.tr || []).length,
      cuentos: { guardados: (S.texts || []).length, leidos: (S.texts || []).filter(x => x.read).length, palabras_anotadas: (S.texts || []).reduce((a, x) => a + (x.words || []).length, 0) } },
    version_app: APP_VERSION,
    errores_de_la_app: (S.errors || []).slice(-10).map(e => ({ fecha: new Date(e.t).toLocaleString('es-CL'), version: e.v, donde: e.where, error: e.msg, detalle: e.at }))
  };
}
function exportData() {
  const summary = buildSummary();   /* primero se arma el archivo: la copia se anota solo si salió bien */
  S.lastExport = Date.now(); save(); checkAch();
  const payload = { app: 'fluenta', kind: 'progress', version: 2, exportedAt: new Date().toISOString(), summary, state: S };
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
    openCat.review = 'claude'; go('review'); toast(`✨ Nuevo refuerzo: ${pack.title}`);
  } else toast('⚠️ No reconozco este archivo');
}

/* ===== PERFIL ===== */
function renderProfile() {
  const lv = levelInfo();
  const stat = (i, v, l) => `<div class="stat">${i}<b>${v}</b><small>${l}</small></div>`;
  const th = (v, l) => `<button class="${S.theme === v ? 'on' : ''}" data-act="theme" data-v="${v}">${l}</button>`;
  const accent = currentAccent();
  return topBar('Perfil', `<button class="icon-btn" data-act="tab" data-tab="home" aria-label="Cerrar">${ic('x')}</button>`) + `
  <section class="card profile-head"><div class="avatar lg">${esc(initial())}</div><div><b>${esc(S.name || 'Estudiante')}</b><p class="muted small">Nivel ${lv.L} · Liga ${leagueName()} · ${Object.keys(S.ach).length}/${ACH.length} logros</p></div></section>
  <div class="stats">${stat('🔥', currentStreak(), 'Racha')}${stat('⭐', S.xp, 'XP total')}${stat('📚', allLessons().filter(l => S.done[l.id]).length + '/' + allLessons().length, 'Lecciones')}${stat('🃏', Object.keys(S.cards).length, 'Palabras')}${stat('💬', Object.keys(S.dialogs).length + '/' + DIALOGS.length, 'Diálogos')}${stat('🎤', S.bestPron + '%', 'Mejor voz')}</div>
  <section class="card"><h2>🎨 Apariencia</h2>
    <div class="field">Modo<div class="seg mini">${th('light', '☀️ Claro')}${th('dark', '🌙 Oscuro')}${th('auto', '⚙️ Auto')}</div>
      ${S.theme === 'auto' ? '<small class="muted block" style="margin-top:6px">Sigue el modo claro u oscuro de tu iPhone.</small>' : ''}</div>
    <div class="field">Color principal
      <div class="swatches">${ACCENTS.map(([hex, name]) => `<button class="swatch ${accent === hex ? 'on' : ''}" style="--sw:${hex}" data-act="accent" data-v="${hex}" aria-label="${name}"></button>`).join('')}</div>
      <div class="btn ghost wide other-color"><span class="dot" style="--sw:${accent}"></span>🎨 Otro color<input type="color" id="setAccent" value="${accent}" aria-label="Elegir otro color"></div>
      <small id="accentNow" class="muted block center" style="margin-top:8px">${accentNowHTML(accent)}</small></div>
  </section>
  <section class="card"><h2>💾 Respaldo</h2>
    <p class="muted small">Exporta un archivo con todo tu progreso. Sirve como copia de seguridad y para que Claude revise tus errores y te prepare refuerzos.${S.lastExport ? ` Última copia: ${new Date(S.lastExport).toLocaleDateString('es-CL')}.` : ''}</p>
    <button class="btn primary wide" data-act="export">${ic('upload', 'sm')} Exportar progreso</button>
    <button class="btn ghost wide" data-act="import">${ic('download', 'sm')} Importar archivo (progreso o refuerzo)</button></section>
  <section class="card"><h2>🏅 Logros</h2><div class="ach-grid">${ACH.map(a => `<div class="ach ${S.ach[a.id] ? 'on' : ''}"><span>${a.icon}</span><b>${a.name}</b><small>${a.desc}</small></div>`).join('')}</div></section>
  <section class="card"><h2>⚙️ Ajustes</h2>
    <label class="field">Tu nombre<input id="setName" value="${esc(S.name)}" placeholder="¿Cómo te llamas?" maxlength="20" autocomplete="off"></label>
    <div class="field">Sonidos de la app<div class="seg mini"><button class="${S.sound !== false ? 'on' : ''}" data-act="sound" data-v="1">🔊 Sí</button><button class="${S.sound === false ? 'on' : ''}" data-act="sound" data-v="0">🔇 No</button></div>
      <small class="muted block" style="margin-top:6px">Si tu iPhone está en silencio, no suenan.</small></div>
    ${S.sound !== false ? `<label class="field">Volumen de los sonidos<input id="setSoundVol" type="range" min="0.1" max="1" step="0.1" value="${S.soundVol ?? 0.6}"></label>` : ''}
    <div class="field">Grabar mi voz en Pronunciación<div class="seg mini"><button class="${S.recordVoice !== false ? 'on' : ''}" data-act="recvoice" data-v="1">🎙️ Sí</button><button class="${S.recordVoice === false ? 'on' : ''}" data-act="recvoice" data-v="0">No</button></div>
      <small class="muted block" style="margin-top:6px">Para escucharte, comparar con la voz modelo y medir tu fluidez. La grabación no se guarda.</small></div>
    ${S.recordVoice !== false ? `<div class="field">Repetir mi voz al terminar<div class="seg mini"><button class="${S.autoReplay !== false ? 'on' : ''}" data-act="autoreplay" data-v="1">🔁 Sí</button><button class="${S.autoReplay === false ? 'on' : ''}" data-act="autoreplay" data-v="0">No</button></div></div>` : ''}
    <label class="field">Velocidad de la voz 🔊: <b id="rateVal">${S.rate.toFixed(1)}x</b><input id="setRate" type="range" min="0.5" max="1.2" step="0.1" value="${S.rate}"></label>
    <label class="field">Velocidad de la tortuga 🐢: <b id="slowVal">${turtlePick().toFixed(1)}x</b><input id="setSlow" type="range" min="0.1" max="0.5" step="0.1" value="${turtlePick()}"></label>
    <div class="field">Escucha la diferencia
      <div class="row gap" style="margin-top:6px"><button class="btn ghost grow" data-act="voicetest">🔊 Normal</button><button class="btn ghost grow" data-act="voicetest" data-slow="1">🐢 Lenta</button></div>
      <small class="muted block" id="voiceCmp" style="margin-top:6px">${esc(voiceTestText())}</small></div>
    <label class="field">Meta diaria<select id="setGoal">${[10, 20, 30, 50, 80].map(g => `<option value="${g}" ${S.goal === g ? 'selected' : ''}>${g} XP al día</option>`).join('')}</select></label>
    <div class="field">⏰ Recordatorio diario
      <div class="row gap" style="margin-top:6px"><input id="setRemind" type="time" value="${esc(S.remind || '20:00')}" style="flex:1"><button class="btn ghost" data-act="remind">Agregar al calendario</button></div>
      <small class="muted block" style="margin-top:6px">Crea un evento que se repite todos los días en el calendario de tu iPhone, con aviso a esa hora.</small></div>
    <button class="btn danger wide" data-act="reset">Reiniciar todo el progreso</button></section>
  ${(S.errors || []).length ? `<p class="muted small center">⚠️ La app anotó ${S.errors.length} ${S.errors.length === 1 ? 'error' : 'errores'}: van en tu archivo de progreso para que Claude los revise. <button class="link-inline" data-act="clearerr">Borrarlos</button></p>` : ''}
  <p class="muted small center">Fluenta ${APP_VERSION} · tu app de inglés, gratis para siempre 💜</p>
  <p class="muted small center">Diccionario basado en la lista NGSL 1.2 (Browne, Culligan y Phillips, licencia CC BY-SA 4.0). Respaldo en internet: Wiktionary.</p>`;
}

/* ===== Calendario de racha (en Progreso): los días que practicaste ===== */
const MONTHS_FULL = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
let calOff = 0;   /* 0 = este mes, -1 = el anterior… */
function calendarHTML() {
  const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + calOff);
  const y = d.getFullYear(), m = d.getMonth(), first = (d.getDay() + 6) % 7, n = new Date(y, m + 1, 0).getDate(), now = dayStr();
  let cells = '<i></i>'.repeat(first), active = 0;
  for (let k = 1; k <= n; k++) {
    const key = `${y}-${pad(m + 1)}-${pad(k)}`, on = S.days[key] && S.days[key].xp > 0;
    if (on) active++;
    cells += `<span class="${on ? 'on' : ''} ${key === now ? 'today' : ''}">${k}</span>`;
  }
  return `<section class="card"><div class="row between cal-head"><h2>🗓️ Calendario</h2><div class="row gap-s"><button class="icon-btn sm" data-act="calmove" data-v="-1" aria-label="Mes anterior">‹</button><b class="cal-title">${MONTHS_FULL[m]} ${y}</b><button class="icon-btn sm" data-act="calmove" data-v="1" aria-label="Mes siguiente" ${calOff >= 0 ? 'disabled' : ''}>›</button></div></div>
    <div class="cal">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(x => `<b>${x}</b>`).join('')}${cells}</div>
    <p class="muted small center">${active} ${active === 1 ? 'día practicado' : 'días practicados'} en ${MONTHS_FULL[m].toLowerCase()} · racha actual: ${currentStreak()} 🔥</p></section>`;
}

/* ===== Diplomas: uno por cada nivel completo ===== */
const levelLessons = lv => LESSONS.filter(u => u.level === lv).flatMap(u => u.lessons);
const levelDone = lv => levelLessons(lv).every(l => S.done[l.id]);
/* Al terminar una lección: si con ella se completó el nivel, anota la fecha y devuelve el nivel */
function newDiploma(id) {
  const lv = LESSON_LEVEL.get(id);
  if (!lv || X().diplomas[lv] || !levelDone(lv)) return '';
  X().diplomas[lv] = dayStr(); save();
  return lv;
}
function diplomasHTML() {
  LEVELS.forEach(lv => { if (levelDone(lv) && !X().diplomas[lv]) X().diplomas[lv] = dayStr(); });   /* niveles terminados antes de la 3.8 */
  return `<section class="card"><h2>🎓 Tus diplomas</h2><div class="dips">${LEVELS.map(lv => {
    const ls = levelLessons(lv), n = ls.filter(l => S.done[l.id]).length, got = X().diplomas[lv] && n === ls.length;
    return got ? `<button class="dip on" data-act="diploma" data-v="${lv}"><span>🎓</span><b>${lv}</b><small>Ver</small></button>` : `<div class="dip"><span>🔒</span><b>${lv}</b><small>${n}/${ls.length}</small></div>`;
  }).join('')}</div><p class="muted small center">Completa todas las lecciones de un nivel para ganar su diploma.</p></section>`;
}
const longDate = day => new Date(day + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
function openDiploma(lv) {
  const day = X().diplomas[lv]; if (!day) return;
  openSheet(`${sheetHead('🎓 Tu diploma')}<div class="diploma"><span class="dip-brand">Fluenta</span><div class="dip-emoji">🎓</div><p>Este diploma certifica que</p>
    <b class="dip-name">${esc(S.name || 'Estudiante de Fluenta')}</b><p>completó todas las lecciones de inglés del nivel</p><b class="dip-level">${lv}</b><p class="dip-date">${esc(longDate(day))}</p></div>
    <button class="btn primary wide" data-act="dipsave" data-v="${lv}">📤 Guardar o compartir como imagen</button>`, 'diploma');
}
/* El diploma como imagen (para guardarlo o compartirlo) */
function saveDiploma(lv) {
  const day = X().diplomas[lv]; if (!day) return;
  const c = document.createElement('canvas'), W = c.width = 1080, H = c.height = 1350, g = c.getContext('2d');
  const css = getComputedStyle(document.documentElement), accent = css.getPropertyValue('--accent').trim() || '#7b5cf0', accent2 = css.getPropertyValue('--accent2').trim() || '#9d86ff';
  const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, accent2); bg.addColorStop(1, accent);
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.fillStyle = '#fff'; g.beginPath();
  if (g.roundRect) g.roundRect(70, 70, W - 140, H - 140, 60); else g.rect(70, 70, W - 140, H - 140);
  g.fill();
  g.textAlign = 'center';
  const text = (t, y, size, color, weight = '400') => { g.font = `${weight} ${size}px Poppins, system-ui, sans-serif`; g.fillStyle = color; g.fillText(t, W / 2, y, W - 240); };
  text('FLUENTA', 220, 44, accent, '700');
  text('🎓', 420, 170, '#000');
  text('Este diploma certifica que', 540, 40, '#5e648d');
  text(S.name || 'Estudiante de Fluenta', 650, 84, '#24254a', '700');
  text('completó todas las lecciones', 750, 40, '#5e648d');
  text('de inglés del nivel', 805, 40, '#5e648d');
  text(lv, 990, 190, accent, '700');
  text(longDate(day), 1130, 38, '#5e648d');
  text('k4t4l1n4.github.io/fluenta', 1210, 28, '#8a8eb2');
  c.toBlob(blob => {
    if (!blob) { toast('⚠️ No pude crear la imagen'); return; }
    const name = `fluenta-diploma-${lv}.png`;
    try {
      const file = new File([blob], name, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: `Diploma ${lv} · Fluenta` }).catch(() => {}); return; }
    } catch (e) {}
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast('📥 Diploma guardado');
  }, 'image/png');
}

/* ===== Recordatorio diario: un evento que se repite cada día en el calendario del teléfono ===== */
function reminderICS(time) {
  const [h, m] = (/^\d\d:\d\d$/.test(time || '') ? time : '20:00').split(':').map(Number);
  const d = new Date(); d.setHours(h, m, 0, 0);
  if (d < new Date()) d.setDate(d.getDate() + 1);
  const local = x => `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`;
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Fluenta//Recordatorio//ES', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:fluenta-recordatorio-${Date.now()}@fluenta`, `DTSTAMP:${stamp}`,
    `DTSTART:${local(d)}`, 'DURATION:PT15M', 'RRULE:FREQ=DAILY', 'SUMMARY:Practicar inglés en Fluenta 💜', 'DESCRIPTION:Unos minutos al día hacen la diferencia.\\nhttps://k4t4l1n4.github.io/fluenta/', 'URL:https://k4t4l1n4.github.io/fluenta/',
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Practicar inglés en Fluenta', 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}
function addReminder() {
  const ics = reminderICS(S.remind), a = document.createElement('a');
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent));
  if (ios) { a.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics); a.target = '_blank'; a.rel = 'noopener'; }   /* Safari abre el evento con «Agregar al calendario» */
  else { a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'fluenta-recordatorio.ics'; }
  document.body.appendChild(a); a.click(); a.remove();
  toast('📅 Abre el evento y toca «Agregar»');
}
