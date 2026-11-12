'use strict';
/* Fluenta · Acciones de los botones, eventos y arranque de la app (va al final). */
/* ===== Acciones (botones) ===== */
const ACTIONS = {
  tab: el => { if (el.dataset.cat) openCat[el.dataset.tab] = el.dataset.cat; go(el.dataset.tab); },
  back: () => go(backOf(tab)),
  /* Abrir o cerrar una sección: solo una abierta a la vez, para que la lista no se alargue */
  cat: el => {
    const p = el.dataset.page, id = el.dataset.id;
    openCat[p] = openCat[p] === id ? null : id; render();
    const c = openCat[p] && $(`#cat-${id}`);
    if (c) window.scrollTo({ top: Math.max(0, c.getBoundingClientRect().top + window.scrollY - 12), behavior: 'smooth' });
  },
  clevel: el => { courseLevel = el.dataset.v; render(); },
  seg: el => { const [k, v] = el.dataset.seg.split(':'); if (k === 'stats') statSeg = v; render(); },
  say: el => speak(el.dataset.t, !!el.dataset.slow),
  voicetest: el => voiceTest(!!el.dataset.slow),
  lesson: el => startLesson(el.dataset.id),
  begin: () => { if (!L) return; L.intro = false; L.i = L.resumeAt || 0; renderLesson(); startExerciseAudio(); },
  restart: () => { if (!L) return; const id = L.les.id; S.resume = null; save(); startLesson(id, true); },
  opt: el => { if (!L || L.answered) return; L.sel = +el.dataset.i; renderLesson(); },
  chip: el => { if (!L || L.answered) return; L.built.push(+el.dataset.i); renderLesson(); },
  chipback: el => { if (!L || L.answered) return; L.built.splice(+el.dataset.k, 1); renderLesson(); },
  check: () => { if (!L) return; if (L.answered) nextExercise(); else evaluateLesson(); },
  speakskip: () => { if (!L) return; L.answered = true; L.ok = true; L.skipped = true; if (!L.queue[L.i].retry) L.first++; saveResume(); renderLesson(); },
  quit: () => {
    /* Siempre se vuelve a la pantalla desde donde empezaste la actividad */
    /* En las lecciones no se pierde nada: el avance queda guardado */
    if (L && !L.intro) { saveResume(); if (S.resume) toast('💾 Guardé tu avance. Continúa cuando quieras.'); go(tab); return; }
    if (((D && !D.finished) || (P && P.best.length)) && !confirm('¿Salir? Perderás el progreso de esta actividad.')) return;
    go(tab);
  },
  mic: el => {
    const ctx = el.dataset.ctx;
    let targets;
    if (ctx === 'lesson') targets = L.queue[L.i].say;
    else if (ctx === 'dialog') targets = D.opts.filter(o => o.go).map(o => o.en);
    else if (ctx === 'psession') { if (!P || P.tries >= PS_TRIES) return; targets = P.list[P.i][0]; }
    else targets = pronCurrent || PRON[0].phrases[0][0];
    stopSpeech();
    try { if (PLAYING) PLAYING.stop(); } catch (e) {}
    el.classList.add('listening');
    const res = $('#micres'); if (res) res.innerHTML = '<p class="center listening-txt">🎙️ Escuchando… habla ahora</p>';
    /* En Pronunciación también se graba tu voz, para que te escuches y para medir tu fluidez */
    const voiceCtx = ctx === 'pron' || ctx === 'psession';
    if (voiceCtx) { clearTimeout(VS[ctx].recTimer); VS[ctx] = newVS(); VS[ctx].capturing = canRecordDevice() && S.recordVoice !== false; startCapture(); }
    listen(targets, async r => {
      el.classList.remove('listening');
      let audio = null;
      if (voiceCtx) {
        const box = $('#micres'); if (box && !r.error) box.innerHTML = '<p class="center listening-txt">🔍 Analizando…</p>';
        const wasRecording = VS[ctx].capturing;
        audio = await finishCapture();
        if (audio && !audio.stats) audio = null;   /* grabación en silencio: no vale la pena escucharla */
        VS[ctx].capturing = false; VS[ctx].audio = audio;
        /* Si el iPhone no deja grabar y reconocer a la vez, se nota así: error de micrófono,
           o tu voz quedó grabada pero el reconocimiento no escuchó nada (dos veces seguidas) */
        const starved = wasRecording && (r.error === 'audio-capture' || (r.error === 'no-speech' && audio));
        voiceFails = starved ? voiceFails + 1 : r.error ? voiceFails : 0;
        if (starved && (r.error === 'audio-capture' || voiceFails >= 2) && S.recordVoice !== false) {
          S.recordVoice = false; save(); voiceFails = 0;
          toast('Tu teléfono no deja grabar y analizar a la vez. Desactivé la grabación: usa «Grabar y escucharme».');
        }
        if (!r.error) {
          if (r.alts && r.alts[0]) r.heard = r.alts[0];   /* lo que entendió primero, igual que en el análisis */
          r.an = analyzePron(r.target, r.alts, audio); r.score = r.an.overall;
          r.words = r.an.words.map(w => ({ w: w.w, ok: w.pct >= 70, pct: w.pct, skip: w.skip }));
        }
      }
      if (!r.error) { S.bestPron = Math.max(S.bestPron, r.score); save(); checkAch(); }
      if (ctx === 'lesson') onLessonMic(r); else if (ctx === 'dialog') onDialogMic(r); else if (ctx === 'psession') onSessionMic(r); else onPronMic(targets, r);
      /* Como en una grabadora: al terminar, la app te repite cómo lo dijiste */
      if (voiceCtx && audio && !r.error && S.autoReplay !== false) setTimeout(() => playVoice(audio.buf), 650);
    });
  },
  psession: el => startPronSession(el.dataset.g),
  psnext: () => { if (P && P.best[P.i]) nextPronPhrase(); },
  psskip: () => { if (!P) return; const [en, es] = P.list[P.i]; P.best[P.i] = { en, es, skipped: true }; nextPronPhrase(); },
  dialog: el => startDialog(el.dataset.id, el.dataset.mode),
  dopt: el => {
    if (!D || D.finished) return;
    const o = D.opts[+el.dataset.i];
    if (o.go) { trackType('dialog', true); save(); sfx('ok'); chooseOption(o); }
    else {
      D.wrong++; trackType('dialog', false); sfx('bad');
      const st = S.dlg[D.d.id] || (S.dlg[D.d.id] = { plays: 0, wrong: {} }); st.wrong[o.en] = (st.wrong[o.en] || 0) + 1; save();
      D.fb = o.fb || 'Esa respuesta no encaja aquí. ¡Prueba otra!'; renderDialog();
      animate($(`.opt[data-i="${el.dataset.i}"]`), 'anim-bad');
    }
  },
  dskip: () => { if (!D || D.finished) return; chooseOption(pick(D.opts.filter(o => o.go))); },
  dfinish: () => { if (D) finishDialog(); },
  tr: el => { const i = +el.dataset.i; D.showEs[i] = !D.showEs[i]; renderDialog(); },
  pphrase: el => { pronCurrent = el.dataset.t; pronResult = null; VS.pron = newVS(); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); speak(pronCurrent); },
  pword: el => { pronCurrent = el.dataset.t; pronResult = null; VS.pron = newVS(); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); speak(pronCurrent, true); },
  analyze: el => { const ctx = el.dataset.ctx; VS[ctx].open = true; rerenderVoice(ctx); const d = $('.an-detail'); if (d) d.scrollIntoView({ behavior: 'smooth', block: 'center' }); },
  anword: el => { const ctx = el.dataset.ctx; VS[ctx].sel = +el.dataset.i; rerenderVoice(ctx); const f = $('.an-focus'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); },
  playme: el => { const a = VS[el.dataset.ctx].audio; if (a) playVoice(a.buf); },
  vcompare: el => {
    const ctx = el.dataset.ctx, a = VS[ctx].audio, r = ctx === 'pron' ? pronResult : P && P.result;
    const text = (r && r.target) || (ctx === 'pron' ? pronCurrent : P && P.list[P.i][0]);
    if (a && text) speakThen(text, () => playVoice(a.buf));
  },
  recordonly: async el => {
    const ctx = el.dataset.ctx, st = VS[ctx];
    if (st.recOnly) {
      st.recOnly = false; clearTimeout(st.recTimer);
      const a = await finishCapture(); st.audio = a;
      rerenderVoice(ctx); if (a) playVoice(a.buf); else toast('No pude grabar tu voz. Revisa el permiso del micrófono.');
      return;
    }
    if (!(await startCapture(true))) { toast('No pude usar el micrófono para grabar.'); return; }
    st.recOnly = true; rerenderVoice(ctx);
    st.recTimer = setTimeout(() => { if (st.recOnly) ACTIONS.recordonly({ dataset: { ctx } }); }, 8000);   /* máximo 8 segundos */
  },
  startrev: el => startReview(el.dataset.all ? 'all' : el.dataset.mode || 'due'),
  flip: () => { F.flip = !F.flip; sfx('flip'); render(); if (F.flip) speakAfter(S.cards[F.queue[F.i]].en); },
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
  tenses: () => { openCat.lessons = tzNextGroup(); go('lessons'); },
  tense: el => { tenseId = el.dataset.id; tenseForm = 'aff'; go('tenses'); },
  tform: el => { tenseForm = el.dataset.v; render(); },
  tensesheet: el => tenseSheet(el.dataset.id),
  verbs: el => { if (el && el.dataset.seg) { verbSeg = el.dataset.seg; verbPat = ''; } go('verbs'); },
  verb: el => openVerb(el.dataset.v),
  vseg: el => { verbSeg = el.dataset.v; verbPat = ''; render(); },
  vpat: el => { verbPat = el.dataset.v; render(); },
  vcard: el => {
    const f = verbForms(el.dataset.v); if (!f) return;
    const en = `${f.b} – ${f.past.split(' / ')[0]} – ${f.part.split(' / ')[0]}`;
    if (!S.cards[en]) { S.cards[en] = { en, es: f.es, box: 1, due: 0, custom: true }; save(); }
    toast('🃏 Agregada a tus tarjetas');
    el.outerHTML = '<p class="center"><span class="add-btn added">✓ Agregada a tus tarjetas</span></p>';
  },
  clcopy: el => copyForClaude(el.dataset.ids),
  clpaste: () => go('claude'),
  clhelp: () => claudeHelp(),
  clproj: async () => toast((await copyText(CLAUDE_RULES)) ? '📋 Instrucciones copiadas. Pégalas en tu proyecto de Claude.' : '⚠️ No pude copiar'),
  clread: async () => {
    let t = '';
    try { t = await navigator.clipboard.readText(); } catch (e) {}
    if (!t.trim()) { toast('Mantén presionado el cuadro y elige «Pegar»'); return; }
    CL.draft = t; CL.data = parseClaude(t); render();
  },
  clcards: el => { CL.cards = el.dataset.v === '1'; const p = $('#clPrev'); if (p) p.innerHTML = claudePreviewHTML(); },
  clsave: () => {
    const d = CL.data, cards = CL.cards; if (!d) return;
    CL = newCL();
    if (d.pack) importText(JSON.stringify(d.pack)); else claudeDone(applyClaude(d, cards));
  },
  word: el => openWord(el.dataset.w),
  dict: () => openSearch(),
  sheetclose: () => closeSheet(),
  addcardw: el => {
    const { en, es } = el.dataset; if (S.cards[en]) return;
    S.cards[en] = { en, es, box: 1, due: 0 }; save(); toast('🃏 Agregada a tus tarjetas');
    el.outerHTML = '<p class="center"><span class="add-btn added">✓ Agregada a tus tarjetas</span></p>';
    if (tab === 'mycards' && !F && !SHEET.open) render();
    if (tab === 'reader') rdDrawWords(readerText());   /* la lista de palabras del cuento */
  },
  delword: el => { if (!confirm(`¿Eliminar "${el.dataset.en}"?`)) return; delete S.cards[el.dataset.en]; save(); render(); },
  delpack: el => { if (!confirm('¿Eliminar este refuerzo?')) return; S.packs = S.packs.filter(p => p.id !== el.dataset.id); save(); render(); },
  export: () => exportData(),
  import: () => { const f = $('#importFile'); f.value = ''; f.click(); },
  theme: el => { S.theme = el.dataset.v; save(); applyTheme(); render(); },
  sound: el => { S.sound = el.dataset.v === '1'; save(); render(); if (S.sound) sfx('ok'); },
  glevel: el => { grammarLevel = el.dataset.v; render(); },
  recvoice: el => { S.recordVoice = el.dataset.v === '1'; save(); render(); },
  autoreplay: el => { S.autoReplay = el.dataset.v === '1'; save(); render(); },
  carddir: el => { S.cardDir = el.dataset.v; save(); render(); },
  cardwrite: el => { S.cardWrite = el.dataset.v === '1'; save(); render(); },
  cardidk: () => checkCardAnswer(true),
  calmove: el => { calOff = Math.min(0, calOff + (+el.dataset.v)); render(); },
  diploma: el => openDiploma(el.dataset.v),
  dipsave: el => saveDiploma(el.dataset.v),
  remind: () => addReminder(),
  clearerr: () => { S.errors = []; save(); render(); },
  reload: () => { if (L && !L.intro) saveResume(); location.reload(); },
  favdone: () => { S.favTip = true; save(); render(); },
  accent: el => { clearTimeout(accentTimer); const v = el.dataset.v; S.accent = v === DEFAULT_ACCENT ? '' : v; save(); applyTheme(); render(); toast('🎨 Color cambiado'); },
  reset: () => { if (!confirm('¿Seguro? Se borrará todo tu progreso, XP y tarjetas.')) return; S = fresh(); save(); applyTheme(); go('home'); toast('Progreso reiniciado'); }
};
/* Los botones del traductor, de las lecturas y actividades nuevas, y de los juegos */
Object.assign(ACTIONS, TR_ACTIONS, ST_ACTIONS, AP_ACTIONS, GAME_ACTIONS);
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const act = el.dataset.act, fn = ACTIONS[act];
  if (!fn) return;
  e.preventDefault();
  try { const p = fn(el); if (p && p.catch) p.catch(err => logError(err, 'botón ' + act)); }
  catch (err) { logError(err, 'botón ' + act); }
});
document.addEventListener('submit', e => {
  const f = e.target; e.preventDefault();
  if (f.dataset.form === 'addword') {
    const en = f.en.value.trim(), es = f.es.value.trim(); if (!en || !es) return;
    if (S.cards[en]) { toast('Esa palabra ya está en tus tarjetas'); return; }
    S.cards[en] = { en, es, box: 1, due: 0, custom: true }; S.added++; save(); checkAch();
    toast('📝 Palabra agregada'); render();
  } else if (f.dataset.form === 'dictation') {
    if (L && !L.answered && L.typed.trim()) evaluateLesson();
  } else if (f.dataset.form === 'cardcheck') {
    checkCardAnswer();
  } else if (f.dataset.form === 'custom') {
    const p = f.phrase.value.trim(); if (!p) return;
    pronCurrent = p; pronResult = null; VS.pron = newVS(); render(); speak(p);
  }
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'dq') { dictSearchQ = t.value; renderSearch(); }
  else if (t.id === 'dictInput' && L) { L.typed = t.value; const b = $('#view [data-act="check"]'); if (b) b.disabled = !t.value.trim(); }
  else if (t.id === 'cardInput' && F) { F.typed = t.value; }
  else if (t.id === 'wtext' && W) { W.draft = t.value; const c = $('#wcount'); if (c) c.textContent = `${wordCount(W.draft)} palabras`; }
  else if (t.id === 'vq') { verbSearch = t.value; const l = $('#verbList'); if (l) l.innerHTML = verbListHTML(); }
  else if (t.id === 'clIn') { CL.draft = t.value; CL.data = parseClaude(t.value); const p = $('#clPrev'); if (p) p.innerHTML = claudePreviewHTML(); }
  else if (t.id === 'trIn') { TR.text = t.value; if (!t.value.trim()) TR.manual = false; }
  else if (t.id === 'rdIn') { rdDraft = t.value; rdCountDraw(); }
  else if (t.id === 'rdTitle') rdTitle = t.value;
  else if (t.id === 'setName') { S.name = t.value.trim(); save(); }
  else if (t.id === 'setRate') { S.rate = +t.value; $('#rateVal').textContent = S.rate.toFixed(1) + 'x'; VT.n = VT.s = 0; voiceTestDraw(); save(); }
  else if (t.id === 'setSlow') { S.slowRate = +t.value; $('#slowVal').textContent = turtleTxt(S.slowRate); VT.s = 0; voiceTestDraw(); save(); }
  else if (t.id === 'setAccent') previewAccent(t.value);   /* se ve al instante mientras eliges */
  else if (t.id === 'setSoundVol') { S.soundVol = +t.value; save(); }
});
document.addEventListener('change', e => {
  if (e.target.id === 'setGoal') { S.goal = +e.target.value; save(); }
  else if (e.target.id === 'setSoundVol') sfx('ok');   /* para escuchar cómo queda el volumen */
  else if (e.target.id === 'setAccent') previewAccent(e.target.value);   /* sin render(): el iPhone manda "change" en cada movimiento */
  else if (e.target.id === 'setRemind') { S.remind = e.target.value || '20:00'; save(); }
  else if (e.target.id === 'trFile') { const f = e.target.files && e.target.files[0]; if (f) readPhoto(f); }
  else if (e.target.id === 'importFile') {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    const r = new FileReader(); r.onload = () => importText(String(r.result)); r.readAsText(file);
  }
});

/* ===== Hoja emergente del diccionario y burbuja de la barra de abajo ===== */
document.body.insertAdjacentHTML('beforeend', '<div id="sheet" class="sheet-wrap"></div>');
window.addEventListener('resize', placeNavPill);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeNavPill).catch(() => {});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && SHEET.open) closeSheet(); });

/* ===== Inicio de la app ===== */
applyTheme();
renderNav();
render();
checkAch();
setTimeout(() => loadDict().catch(() => {}), 1200);
/* Versión nueva: al volver a la app se revisa si hay una; cuando queda lista, aparece un aviso con "Actualizar" */
function showUpdate() {
  if ($('#update')) return;
  document.body.insertAdjacentHTML('beforeend', `<div id="update" class="update" role="status"><span class="grow">✨ Hay una versión nueva de Fluenta</span><button class="btn primary" data-act="reload">Actualizar</button></div>`);
}
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  let hadSW = !!navigator.serviceWorker.controller;   /* la primera vez que se instala no hay nada que avisar */
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadSW) showUpdate(); hadSW = true; });
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').then(reg => {
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
  }).catch(() => {}));
}
