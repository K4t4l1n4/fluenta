/* ============================================================
   Las pruebas de Fluenta (las corre tests/run.js).
   Este archivo se carga dentro de la app, así que usa sus funciones directamente.
   ============================================================ */
(() => {
  const { test, ok, eq, el, ELS, spoken } = __t;
  const view = () => ELS['#view'].innerHTML;
  const sheet = () => ELS['#sheet'].innerHTML + ELS['#sheetBody'].innerHTML;

  /* ===== Un progreso "con de todo", para revisar las pantallas con datos ===== */
  function rich() {
    S = fresh();
    tab = 'home'; L = null; D = null; F = null; P = null; W = null; A = null; CL = newCL(); TR = newTR(); RDR = null;
    openCat.lessons = null; openCat.review = null;
    const ls = allLessons();
    ls.slice(0, 5).forEach(l => { S.done[l.id] = 3; });
    S.xp = 420; S.weekXp = 120; S.weekKey = weekKey(); S.streak = 4; S.lastDay = dayStr(); S.dailyXp = 12; S.dailyDay = dayStr(); S.name = 'Kata';
    S.days[dayStr()] = { xp: 12, ok: 8, fail: 3 };
    TENSE_LESSONS.slice(0, 2).forEach(l => { S.done[l.id] = 2; });
    S.tense = { pres: { ok: 10, fail: 4 }, past: { ok: 3, fail: 5 }, fut: { ok: 1, fail: 0 } };
    S.verbs = { go: { past: { ok: 0, fail: 3 }, part: { ok: 1, fail: 2 }, last: Date.now() }, buy: { past: { ok: 2, fail: 0 } } };
    /* errores en palabras, frases y frases de tiempos verbales */
    allWords().slice(0, 8).forEach(([en, es]) => track('meaning', en, es, false));
    allSentences().slice(0, 4).forEach(([en, es]) => track('order', en, es, false));
    [...tzDrills().keys()].slice(0, 5).forEach(en => track('tense', en, tzDrills().get(en).d[3], false));
    track('card', 'only-card-word', 'solo tarjeta', false);
    /* tarjetas: nuevas, falladas y dominadas */
    allWords().slice(10, 16).forEach(([en, es], i) => { S.cards[en] = { en, es, box: i < 2 ? 1 : i < 4 ? 3 : 5, due: i < 2 ? Date.now() - 1000 : i === 2 ? Date.now() + 864e5 : 0 }; });
    S.cards['my word'] = { en: 'my word', es: 'mi palabra', box: 1, due: 0, custom: true };
    /* cuentos: uno guardado antes de la 3.9 (sin título ni palabras) y uno a medio leer */
    S.texts = [{ t: Date.now() - 9000, text: 'An old text saved before. It has two sentences.', tr: {} },
      { t: Date.now() - 500, title: 'The red door', text: 'Anna found a red door in the wall. She opened it slowly.\nBehind it there was a garden.', tr: { 0: 'Anna encontró una puerta roja en la pared.' }, words: ['door', 'slowly'], wm: { door: ['door', 'puerta'] }, pos: 1, read: 0, last: Date.now() - 100 }];
    rdAdd = false; rdDraft = ''; rdTitle = '';
    /* pronunciación */
    S.pw = { three: { ok: 0, fail: 4, sum: 120, n: 4 }, think: { ok: 1, fail: 3, sum: 200, n: 4 }, the: { ok: 1, fail: 2, sum: 150, n: 3 } };
    S.pron[allPhrases()[0]] = 64; S.bestPron = 64;
    S.pronSessions = [{ t: Date.now(), group: 'TH', n: 10, done: 9, avg: 72, words: ['three'] }];
    /* diálogos con una respuesta mal elegida */
    const d = DIALOGS[0], badOpt = Object.values(d.nodes).flatMap(n => n.options || []).find(o => !o.go);
    S.dlg[d.id] = { plays: 2, wrong: badOpt ? { [badOpt.en]: 2 } : {} };
    S.dialogs[d.id] = true; S.ends[d.id] = [dialogEnds(d)[0]];
    /* escritura con errores */
    const t1 = Date.now() - 5000;
    S.writing.texts.push({ t: t1, topic: WRITE_TOPICS[0].id, q: WRITE_TOPICS[0].questions[0][0], text: 'Yesterday I go to the park with my friend.', words: 9, errors: [{ wrong: 'go', right: 'went', type: 'Tiempo verbal', es: 'pasado', rule: 'past-time' }] });
    S.writing.errs['go → went'] = { wrong: 'go', right: 'went', type: 'Tiempo verbal', es: 'Va en pasado.', rule: 'past-time', n: 2, last: t1 };
    S.writing.errs['more better → better'] = { wrong: 'more better', right: 'better', type: 'Gramática', es: 'Sin more.', n: 1, last: t1, claude: true, always: true };
    /* una lección a medias y un error anotado */
    S.errors = [{ t: Date.now(), v: APP_VERSION, where: 'prueba', msg: 'error de prueba', at: '' }];
    save();
  }
  const CLAUDE_REPLY = 'Aquí va tu corrección.\n```json\n{"app":"fluenta","kind":"claude","v":1,"texts":["' + 'x' + '"],"errors":[{"wrong":"go","right":"went","type":"Gramática","es":"Va en pasado.","always":false,"tense":"past"}],"sentences":[["I went to the park.","Fui al parque."],["We had a great time.","Lo pasamos muy bien."]],"words":[["swing","columpio"]],"tip":"Fíjate en \\"yesterday\\"."}\n```';

  /* Responde bien el ejercicio que está en pantalla */
  function answerRight() {
    const ex = L.queue[L.i];
    if (ex.type === 'speak') { ACTIONS.speakskip(); return; }
    if (ex.type === 'order') {
      const used = new Set();
      L.built = tokens(ex.answer).map(t => { const i = ex.tokens.findIndex((x, k) => !used.has(k) && clean(x) === clean(t)); ok(i >= 0, `falta la palabra "${t}" para ordenar`); used.add(i); return i; });
    } else if (ex.type === 'write') L.typed = ex.answer;
    else { L.sel = ex.options.indexOf(ex.answer); ok(L.sel >= 0, `la respuesta "${ex.answer}" no está entre las opciones`); }
    ACTIONS.check();
    ok(L.ok, `respondí bien y no lo aceptó: ${ex.prompt} → ${ex.answer}`);
  }
  function playLesson(id, failFirst) {
    startLesson(id, true);
    ok(L, `no se pudo empezar la lección ${id}`);
    ACTIONS.begin();
    if (failFirst) {   /* una respuesta mala: debe volver al final */
      const ex = L.queue[L.i], n = L.queue.length;
      if (ex.options) { L.sel = ex.options.findIndex(o => o !== ex.answer); ACTIONS.check(); ok(!L.ok && L.queue.length === n + 1, 'la respuesta mala no se repite al final'); ACTIONS.check(); }
    }
    let n = 0;
    while (L && n++ < 300) { answerRight(); ACTIONS.check(); }
    ok(!L, `la lección ${id} no terminó`);
    ok(/completad/i.test(view()), `la lección ${id} no mostró su resumen`);
  }
  const checkExercise = (ex, where) => {
    ok(ex && ex.type && ex.prompt, `${where}: ejercicio sin tipo o sin pregunta`);
    ok(ex.answer != null && String(ex.answer).trim(), `${where}: ejercicio sin respuesta`);
    if (ex.options) {
      ok(ex.options.includes(ex.answer), `${where}: la respuesta "${ex.answer}" no está entre las opciones`);
      ok(new Set(ex.options).size === ex.options.length, `${where}: opciones repetidas (${ex.options.join(' | ')})`);
      ok(ex.options.length >= 2, `${where}: menos de 2 opciones`);
    }
    if (ex.type === 'order') eq([...ex.tokens].map(clean).sort(), tokens(ex.answer).map(clean).sort(), `${where}: las palabras para ordenar no calzan`);
    ['prompt', 'big', 'say', 'hint', 'before', 'after'].forEach(k => ok(!/\bundefined\b/.test(String(ex[k] ?? '')), `${where}: dice "undefined" en ${k}`));
  };
  const BAD_TEXT = /\bundefined\b|\bNaN\b|\[object Object\]/;
  const actsIn = html => [...html.matchAll(/data-act="([^"$]+)"/g)].map(m => m[1]);
  const seenActs = new Set();
  function look(where, html = view() + sheet()) {
    const text = html.replace(/<[^>]+>/g, ' ');
    const m = text.match(BAD_TEXT);
    ok(!m, `${where}: aparece "${m && m[0]}" en la pantalla`);
    actsIn(html).forEach(a => seenActs.add(a + '|' + where));
  }

  /* ============ 1. La base ============ */
  test('Tu progreso se sigue guardando en "fluenta-v1"', () => { eq(KEY, 'fluenta-v1'); });
  test('La app carga sin errores y sin progreso', () => { S = fresh(); go('home'); ok(view().length > 500, 'Inicio está vacío'); look('Inicio vacío'); });
  test('Cada script de index.html está guardado para usar sin internet (sw.js)', () => {
    const sw = __t.read('sw.js'), html = __t.read('index.html');
    const assets = [...sw.matchAll(/'\.\/([^']*)'/g)].map(m => m[1]).filter(Boolean);
    const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
    scripts.concat('styles.css').forEach(f => ok(assets.includes(f), `sw.js no guarda ${f}`));
    assets.forEach(f => { try { __t.read(f.replace(/\?.*/, '')); } catch (e) { throw new Error(`sw.js guarda ${f}, pero ese archivo no existe`); } });
  });
  test('La versión de Perfil es la de la app', () => { go('profile'); ok(view().includes(`Fluenta ${APP_VERSION}`), 'Perfil muestra otra versión'); });

  /* ============ 2. Todas las pantallas, sin progreso y con progreso ============ */
  const TABS = ['home', 'lessons', 'review', 'stats', 'profile', 'mycards', 'talk', 'write', 'grammar', 'claude', 'verbs', 'tenses', 'translate', 'reader', 'vocab'];
  test('Todas las pantallas abren sin progreso', () => { S = fresh(); TABS.forEach(t => { go(t); ok(view().length > 100, `${t} está vacía`); look(t + ' (vacío)'); }); });
  test('Todas las pantallas abren con progreso', () => { rich(); TABS.forEach(t => { go(t); look(t); }); });
  test('Cada sección de Lecciones se despliega', () => {
    rich(); go('lessons');
    const ids = actsIn(view()).length && [...view().matchAll(/data-act="cat" data-page="lessons" data-id="([^"]+)"/g)].map(m => m[1]);
    ok(ids.length >= 10, 'faltan secciones en Lecciones');
    ids.forEach(id => { openCat.lessons = id; render(); ok(view().includes('cat-body'), `la sección ${id} no se abre`); look('Lecciones › ' + id); });
    S.done = {}; courseLevel = 'B2'; openCat.lessons = 'course'; render(); look('Lecciones › curso B2');
  });
  test('Cada sección de Repaso se despliega', () => {
    rich(); go('review');
    const ids = [...view().matchAll(/data-act="cat" data-page="review" data-id="([^"]+)"/g)].map(m => m[1]);
    eq(ids.length, 9, 'Repaso debe tener 9 secciones (8 de errores y Juegos)');
    ids.forEach(id => { openCat.review = id; render(); ok(view().includes('cat-body'), `la sección ${id} no se abre`); look('Repaso › ' + id); });
  });
  test('Repaso: primero lo que tiene errores, después lo que está al día', () => {
    rich(); openCat.review = null; go('review');
    const h = view(), calm = h.indexOf('Al día'), tz = h.indexOf('id="cat-tz"'), cards = h.indexOf('id="cat-cards"');
    ok(calm > 0, 'no aparece el grupo "Al día"');
    ok(tz >= 0 && tz < calm && cards < calm, 'las secciones con errores no van arriba');
    S = fresh(); go('review'); ok(view().includes('Todo al día'), 'sin errores debería decir "Todo al día"');
  });
  test('Cada ficha de tiempo verbal y la tabla de verbos', () => {
    rich();
    TENSES.forEach(t => ['aff', 'neg', 'q'].forEach(f => { tenseId = t.id; tenseForm = f; tab = 'tenses'; render(); look(`ficha ${t.id} ${f}`); }));
    ['irr', 'reg'].forEach(sg => { verbSeg = sg; go('verbs'); look('verbos ' + sg); });
    Object.keys(VERB_PATTERNS).forEach(k => { verbSeg = 'irr'; verbPat = k; render(); look('verbos ' + k); });
    verbPat = ''; verbSearch = 'went'; render(); ok(view().includes('data-v="go"'), 'buscar "went" no encuentra go'); verbSearch = '';
  });
  test('Gramática por nivel y Progreso por semana y meses', () => {
    rich(); ['all', 'A1', 'B1', 'C2'].forEach(l => { grammarLevel = l; go('grammar'); look('gramática ' + l); }); grammarLevel = 'all';
    ['week', 'month'].forEach(sg => { statSeg = sg; go('stats'); look('progreso ' + sg); });
  });

  /* ============ 3. Inicio ============ */
  test('Inicio: la lección a medias aparece una sola vez, en el botón grande', () => {
    rich(); const nx = allLessons().find(l => !S.done[l.id]);
    startLesson(nx.id, true); ACTIONS.begin(); answerRight(); ACTIONS.quit();
    go('home');
    ok(view().includes('Continuar · 2 de'), 'el botón grande no dice "Continuar · 2 de…"');
    ok(!view().includes('Continuar donde quedaste'), 'se repite "Continuar donde quedaste"');
    eq((view().match(/class="sec-mini/g) || []).length, 6, 'deben ser 6 círculos de secciones');
  });
  test('Inicio: sin nombre, el círculo del perfil muestra la carita entera', () => { S = fresh(); eq(initial(), '🙂'); S.name = 'kata'; eq(initial(), 'K'); });

  /* ============ 4. Ejercicios de todas las lecciones ============ */
  test('Todas las lecciones del curso arman 20 ejercicios correctos', () => {
    S = fresh();
    allLessons().forEach(l => { const ex = genExercises(l); ok(ex.length >= 15, `${l.id}: solo ${ex.length} ejercicios`); ex.forEach((e, i) => checkExercise(e, `${l.id} #${i + 1}`)); });
  });
  test('Todas las prácticas de tiempos verbales arman sus ejercicios', () => {
    S = fresh();
    TENSE_LESSONS.forEach(l => { const ex = genExercises(l); ok(ex.length >= 15, `${l.id}: solo ${ex.length} ejercicios`); ex.forEach((e, i) => checkExercise(e, `${l.id} #${i + 1}`)); });
  });
  test('Las prácticas de verbos arman sus ejercicios', () => {
    S = fresh();
    ['verbs', ...Object.keys(VERB_PATTERNS).map(k => 'verbs-' + k)].forEach(id => { const l = findLesson(id); ok(l, `no existe ${id}`); genExercises(l).forEach((e, i) => checkExercise(e, `${id} #${i + 1}`)); });
  });
  test('Los repasos de errores arman sus ejercicios', () => {
    rich();
    ['auto', 'rev-words', 'rev-write', 'rev-tz', ...TZ_GROUPS.map(g => 'rev-tz-' + g.id)].forEach(id => {
      const l = findLesson(id); if (!l) return;
      const ex = genExercises(l); ok(ex.length > 0, `${id} no tiene ejercicios`); ex.forEach((e, i) => checkExercise(e, `${id} #${i + 1}`));
    });
    ok(findLesson('auto') && findLesson('rev-tz') && findLesson('rev-words') && findLesson('rev-write'), 'faltan repasos con el progreso de prueba');
  });

  /* ============ 5. Actividades completas, de principio a fin ============ */
  test('Hacer una lección completa (con un error al principio)', () => { S = fresh(); go('lessons'); playLesson(allLessons()[0].id, true); eq(S.done[allLessons()[0].id] >= 1, true, 'no quedó marcada'); });
  test('Hacer una lección de cada nivel', () => { S = fresh(); go('lessons'); [...new Set(LESSONS.map(u => u.level))].forEach(lv => playLesson(LESSONS.find(u => u.level === lv).lessons[0].id)); });
  test('Hacer prácticas de tiempos verbales (una normal y una mezcla)', () => { S = fresh(); go('lessons'); playLesson(TENSE_LESSONS.find(l => !l.mix).id); playLesson(TENSE_LESSONS.find(l => l.mix).id); });
  test('Hacer la práctica de verbos irregulares', () => { S = fresh(); go('lessons'); playLesson('verbs', true); ok(Object.keys(S.verbs).length > 0, 'no guardó los verbos practicados'); });
  test('Hacer los repasos de errores', () => {
    rich(); go('review');
    ['auto', 'rev-words', 'rev-write', 'rev-tz'].forEach(id => { rich(); go('review'); playLesson(id); });
    ok(S.autoDone >= 1, 'el repaso no se contó');
  });
  test('Salir de una lección guarda el avance y vuelve a donde estabas', () => {
    S = fresh(); go('lessons'); const id = allLessons()[1].id;
    startLesson(id, true); ACTIONS.begin(); answerRight(); ACTIONS.check(); answerRight(); ACTIONS.quit();
    eq(tab, 'lessons', 'no volvió a Lecciones'); ok(savedResume(id), 'no guardó el avance');
    startLesson(id); ok(L.resumeAt === 2, 'no continúa donde quedó'); ACTIONS.quit();
  });
  test('Jugar todos los diálogos hasta un final', () => {
    S = fresh(); go('lessons');
    DIALOGS.forEach(d => {
      startDialog(d.id, 'choose');
      const bad = D.opts.findIndex(o => !o.go);
      if (bad >= 0) { ACTIONS.dopt(el({ i: String(bad) })); ok(D.wrong === 1, `${d.id}: la respuesta mala no se cuenta`); }
      let n = 0;
      while (!D.finished && n++ < 60) { const i = D.opts.findIndex(o => o.go); ok(i >= 0, `${d.id}: un paso sin respuesta que avance`); ACTIONS.dopt(el({ i: String(i) })); }
      ok(D.finished, `${d.id}: no llega a un final`); look('diálogo ' + d.id);
      ACTIONS.dfinish(); ok(S.dialogs[d.id], `${d.id}: no quedó completado`);
    });
  });
  test('Cada diálogo: todas sus respuestas llevan a un paso que existe', () => {
    DIALOGS.forEach(d => Object.entries(d.nodes).forEach(([k, n]) => {
      ok(n.npc && n.npc[0], `${d.id}.${k}: el personaje no dice nada`);
      if (n.end) return;
      ok((n.options || []).some(o => o.go), `${d.id}.${k}: no hay ninguna respuesta que avance`);
      (n.options || []).forEach(o => { if (o.go) ok(d.nodes[o.go], `${d.id}.${k}: "${o.en}" lleva a "${o.go}", que no existe`); });
    }));
  });
  test('Diálogo en modo hablar: avanzar diciendo una respuesta', () => {
    S = fresh(); go('lessons'); const d = DIALOGS[0];
    startDialog(d.id, 'speak'); look('diálogo hablando');
    const o = D.opts.find(x => x.go); onDialogMic({ ...compare(o.en, o.en), heard: o.en, target: o.en });
    ok(D.steps === 1, 'decir la respuesta no hizo avanzar el diálogo');
    ACTIONS.quit(); eq(tab, 'lessons');
  });
  test('Repasar tarjetas (fallando una)', () => {
    rich(); go('review'); startReview('all'); ok(F, 'no empezó el repaso');
    let n = 0, first = true;
    while (F && n++ < 80) { if (!F.flip) ACTIONS.flip(); look('tarjeta'); ACTIONS.rate(el({ v: first ? '0' : '1' })); first = false; }
    ok(!F && /Repaso terminado/.test(view()), 'el repaso no terminó');
  });
  test('Repasar tarjetas escribiendo la respuesta', () => {
    rich(); S.cardWrite = true; S.cardDir = 'mix'; go('review'); startReview('all');
    let n = 0;
    while (F && n++ < 80) { const en = F.queue[F.i], c = S.cards[en]; F.typed = (F.dirOf[en] === 'es' ? c.en : c.es.split(/[,;/]/)[0]); checkCardAnswer(); ok(F.result, `no aceptó "${F.typed}"`); look('tarjeta escrita'); ACTIONS.rate(el({ v: '1' })); }
    ok(!F, 'el repaso escrito no terminó');
  });
  test('Una sesión de pronunciación completa', () => {
    S = fresh(); go('lessons'); startPronSession(PRON[0].id); ok(P, 'no empezó');
    let n = 0;
    while (P && n++ < 30) { const t = P.list[P.i][0]; onSessionMic({ ...compare(t, t), heard: t, target: t }); look('sesión de pronunciación'); ACTIONS.psnext(); }
    ok(!P && /Sesión terminada/.test(view()), 'la sesión no terminó');
  });
  test('Practicar frase por frase y ver el análisis de cada palabra', () => {
    S = fresh(); go('talk'); const t = pronCurrent || PRON[0].phrases[0][0];
    const r = { ...compare(t, t), heard: t, target: t, alts: [t] }; r.an = analyzePron(t, r.alts, null); r.score = r.an.overall;
    onPronMic(t, r); look('pronunciación con resultado');
    ACTIONS.analyze(el({ ctx: 'pron' })); ACTIONS.anword(el({ ctx: 'pron', i: '0' })); look('análisis por palabra');
  });
  test('Escribir: responder un tema, corregir y terminar', async () => {
    S = fresh(); await loadDict(); go('lessons'); startWrite(WRITE_TOPICS[0].id);
    W.draft = 'Yesterday I go to the park with my friend.'; await sendWriting();
    const me = W.log.find(m => m.who === 'me'); ok(me && me.errors, 'no se revisó el texto');
    ok(me.errors.some(e => e.right === 'went'), 'no encontró "go → went"');
    look('escribir con corrección'); ACTIONS.wend(); ok(/Bien escrito/.test(view()), 'no mostró el resumen');
    ok(S.writing.errs['go → went'], 'el error no quedó guardado para el Repaso');
  });
  test('Claude: pegar sus mejoras arma una lección y tarjetas', () => {
    rich(); go('claude');
    const d = parseClaude(CLAUDE_REPLY); ok(d, 'no reconoció el bloque «Para Fluenta»');
    eq(d.errors.length, 1); eq(d.sentences.length, 2);
    CL.draft = CLAUDE_REPLY; CL.data = d; render(); look('Claude con vista previa');
    ACTIONS.clsave(); ok(S.packs.some(p => p.claude), 'no armó la lección de Claude'); look('Claude guardado');
    ok(view().includes('Repaso › Claude'), 'el resumen no dice dónde quedó la lección');
    go('review'); playLesson(S.packs[0].id);
  });

  /* ============ 6. Hojas emergentes y diccionario ============ */
  test('Diccionario: buscar y abrir palabras', async () => {
    S = fresh(); await loadDict();
    eq(lookup('went').note, 'el pasado de “go”'); ok(lookup("don't").note.includes('do not'), "don't");
    ok(lookup('running') && (lookup('running').entry || lookup('running').base), 'running');
    go('home'); ACTIONS.dict(); dictSearchQ = 'casa'; renderSearch(); look('buscador');
    await openWord('went'); ok(/go/.test(sheet()), 'la hoja de "went" no muestra go'); look('hoja de went'); closeSheet();
    openVerb('go'); look('hoja del verbo go'); closeSheet();
    TENSES.forEach(t => { tenseSheet(t.id); look('hoja ' + t.id); closeSheet(); });
    claudeHelp(); look('ayuda de Claude'); closeSheet();
    rich(); viewWriting(S.writing.texts[0].t); look('hoja de un texto'); closeSheet();
  });
  test('Agregar una palabra desde el diccionario actualiza Mis tarjetas', async () => {
    S = fresh(); await loadDict(); go('mycards'); const before = view();
    ACTIONS.addcardw(el({ en: 'house', es: 'casa' })); ok(S.cards.house, 'no se agregó'); ok(view() !== before, 'Mis tarjetas no se actualizó');
  });


  /* ============ 6b. Lo nuevo de la 3.8 ============ */
  const fourOpts = (q, where) => { ok(q[0] && q[1].length === 4 && new Set(q[1]).size === 4, `${where}: debe tener 4 opciones distintas`); };
  test('Contenido nuevo bien armado (lecturas, historias, vocabulario, pares, prueba)', () => {
    const ids = new Set();
    const uniq = id => { ok(!ids.has(id), `id repetido: ${id}`); ids.add(id); };
    READINGS.forEach(x => { uniq(x.id); ok(LEVELS.includes(x.level) && x.title && x.es && x.icon, `${x.id}: faltan datos`); ok(x.paras.length >= 2 && x.paras.every(p => p[0] && p[1]), `${x.id}: párrafos sin traducción`); ok(x.qs.length >= 3, `${x.id}: pocas preguntas`); x.qs.forEach((q, i) => fourOpts(q, `${x.id} pregunta ${i + 1}`)); ok(x.words.every(w => w[0] && w[1]), `${x.id}: palabras`); });
    LISTENINGS.forEach(x => { uniq(x.id); ok(x.lines.length >= 5 && x.lines.every(p => p[0] && p[1]), `${x.id}: frases sin traducción`); ok(x.qs.length >= 3, `${x.id}: pocas preguntas`); x.qs.forEach((q, i) => fourOpts(q, `${x.id} pregunta ${i + 1}`)); });
    vocabSets().forEach(st => { uniq(st.id); ok(/^x-/.test(st.id), `${st.id}: el id debe empezar con x-`); eq(st.items.length, 10, `${st.id}: deben ser 10`); eq(st.sentences.length, 6, `${st.id}: deben ser 6 frases`);
      eq(new Set(st.items.map(i => i[0])).size, 10, `${st.id}: palabras repetidas`); eq(new Set(st.items.map(i => i[1])).size, 10, `${st.id}: traducciones repetidas`); ok(st.tip, `${st.id}: sin tip`); });
    VOCAB.ff.sets.forEach(st => st.items.forEach(i => ok(i[2] && i[3], `${st.id}: a "${i[0]}" le falta el falso amigo`)));
    MIN_PAIRS.forEach(g => { uniq(g.id); ok(g.pairs.length >= 5 && g.tip, `${g.id}: pocos pares`); g.pairs.forEach(p => ok(p.length === 4 && p[0] !== p[2] && p.every(Boolean), `${g.id}: par mal armado (${p[0]})`)); });
    eq(PLACEMENT.map(b => b.level), LEVELS.slice(0, 5), 'la prueba debe tener un bloque por nivel, en orden');
    PLACEMENT.forEach(b => { eq(b.qs.length, 6, `prueba ${b.level}`); b.qs.forEach((q, i) => { fourOpts(q, `prueba ${b.level} ${i + 1}`); ok(q[0].includes('___'), `prueba ${b.level} ${i + 1}: falta el espacio ___`); }); });
  });
  const answerQuiz = wrongFirst => {
    let n = 0;
    while (A && A.Q && A.step === 'quiz' && n++ < 40) {
      const x = A.Q.list[A.Q.i], bad = wrongFirst && n === 1;
      ACTIONS.aopt(el({ i: String(bad ? x.opts.findIndex(o => o !== x.ans) : x.opts.indexOf(x.ans)) }));
      look('pregunta'); ACTIONS.acheck(); ok(A.Q.answered, 'no revisó la respuesta'); look('pregunta revisada'); ACTIONS.acheck();
    }
  };
  test('Hacer todas las lecturas', () => {
    S = fresh(); go('lessons');
    READINGS.forEach((r, k) => {
      ACTIONS.reading(el({ id: r.id })); ok(A && A.kind === 'read', `${r.id} no abre`); look('lectura ' + r.id);
      ACTIONS.aes(el({ i: '0' })); ok(view().includes(esc(r.paras[0][1])), `${r.id}: no muestra la traducción`);
      ACTIONS.aquiz(); ACTIONS.atext(); look('texto en hoja'); closeSheet();
      answerQuiz(k === 0);
      ok(!A && /Lectura completada/.test(view()), `${r.id} no terminó`);
      eq(X().read[r.id], k === 0 ? 2 : 3, `${r.id}: estrellas`);
    });
    ok(S.ach.reader, 'no dio el logro Lectora'); eq(tab, 'lessons');
  });
  test('Hacer todas las historias de Escuchar (la voz se pide en el mismo toque)', () => {
    S = fresh(); go('lessons');
    LISTENINGS.forEach(r => {
      ACTIONS.listening(el({ id: r.id })); ok(A && A.kind === 'listen', `${r.id} no abre`); look('historia ' + r.id);
      ok(!view().includes(esc(r.lines[1][0])), `${r.id}: el texto se ve antes de escuchar`);
      spoken.length = 0; const before = __t.pending();
      ACTIONS.aplay(el({})); eq(spoken.map(u => u.text), r.lines.map(l => l[0]), `${r.id}: no pidió todas las frases`); eq(__t.pending(), before, 'la voz quedó esperando');
      spoken.length = 0; ACTIONS.aplay(el({ slow: '1' })); ok(spoken.length > r.lines.length && spoken.every(u => u.rate === 0.5), `${r.id}: la versión lenta no va por partes`);
      ACTIONS.aquiz(); answerQuiz(false);
      ok(!A && /Historia completada/.test(view()) && view().includes('La historia'), `${r.id} no terminó con su texto`); look('fin de historia');
      eq(X().listen[r.id], 3);
    });
  });
  test('Vocabulario práctico: se ve y cada grupo se practica como lección', () => {
    S = fresh();
    Object.keys(VOCAB).forEach(k => { ACTIONS.vocab(el({ seg: k })); eq(tab, 'vocab'); look('vocabulario ' + k); });
    vocabSets().forEach(st => { const l = findLesson(st.id); ok(l, `no existe la lección ${st.id}`); const ex = genExercises(l); ok(ex.length >= 15, `${st.id}: ${ex.length} ejercicios`); ex.forEach((e, i) => checkExercise(e, `${st.id} #${i + 1}`)); });
    playLesson('x-ff-1'); playLesson('x-pv-2'); playLesson('x-ex-3');
    ok(S.done['x-ff-1'] && S.cards.actually, 'no guardó el grupo o sus tarjetas'); eq(tab, 'vocab');
    ACTIONS.back(); eq(tab, 'lessons', 'la ✕ de Vocabulario debe volver a Lecciones');
  });
  test('Pares de sonidos: todos los grupos', () => {
    S = fresh(); go('lessons');
    MIN_PAIRS.forEach((g, k) => {
      spoken.length = 0; ACTIONS.pairs(el({ id: g.id })); ok(A && A.kind === 'pairs', `${g.id} no abre`); eq(spoken.length, 1, 'no dijo la primera palabra');
      let n = 0;
      while (A && n++ < 20) {
        const say = A.list[A.i].say; look('par');
        ACTIONS.apair(el({ k: String(k === 0 && n === 1 ? (say === 0 ? 2 : 0) : say) })); look('par respondido');
        const before = spoken.length; ACTIONS.anext();
        if (A) eq(spoken.length, before + 1, 'la palabra siguiente no se pidió en el toque');
      }
      ok(!A && /Oído entrenado/.test(view()), `${g.id} no terminó`);
      ok(X().pairs[g.id] === (k === 0 ? pct(Math.min(8, g.pairs.length) - 1, Math.min(8, g.pairs.length)) : 100), `${g.id}: resultado ${X().pairs[g.id]}`);
    });
  });
  const placement = rightUntil => {   /* responde bien los primeros bloques y mal el resto */
    ACTIONS.placement(); look('prueba intro'); ACTIONS.aplace();
    let n = 0;
    while (A && A.step === 'quiz' && n++ < 40) { const x = A.Q.list[A.Q.i]; look('prueba');
      ACTIONS.aopt(el({ i: String(A.bi < rightUntil ? x.opts.indexOf(x.ans) : x.opts.findIndex(o => o !== x.ans)) })); ACTIONS.acheck(); }
    look('prueba resultado'); return A.level;
  };
  test('Prueba de nivel: te ubica y abre las lecciones de tu nivel', () => {
    S = fresh(); go('lessons');
    eq(placement(0), 'A1', 'si fallas el primer bloque quedas en A1'); ok(!view().includes('aplaceok'), 'en A1 no hay nada que abrir'); go('lessons');
    eq(placement(5), 'C2', 'con todo bueno quedas en C2'); go('lessons');
    eq(placement(2), 'B1', 'con A1 y A2 buenos quedas en B1');
    const b1 = LESSONS.find(u => u.level === 'B1').lessons[0], b2 = LESSONS.find(u => u.level === 'B2').lessons[0];
    ok(!lessonUnlocked(b1.id), 'B1 no debería estar abierta todavía');
    ACTIONS.aplaceok(); eq(X().placed, 'B1'); eq(tab, 'lessons'); ok(!A, 'la prueba debe cerrarse');
    ok(lessonUnlocked(b1.id) && !lessonUnlocked(b2.id), 'deben abrirse las lecciones hasta B1, no las de B2');
    eq(nextLesson().id, b1.id, 'la lección que sigue debe ser la primera de B1');
    go('home'); ok(view().includes(esc(b1.title)), 'Inicio no ofrece la primera lección de B1');
    openCat.lessons = 'course'; go('lessons'); ok(view().includes('Empiezas desde B1'), 'el curso no dice desde dónde empiezas'); look('curso con prueba');
    ACTIONS.placement(); ACTIONS.aplaceoff(); ok(!X().placed && !lessonUnlocked(b1.id), 'no volvió a A1'); go('lessons');
  });
  test('Juegos: pareo, ahorcado, letras desordenadas y contra reloj', () => {
    rich(); go('review'); openCat.review = 'games'; render(); look('Repaso › juegos');
    /* pareo: un error y después todas las parejas */
    ACTIONS.game(el({ g: 'match' })); ok(A && A.kind === 'match', 'pareo no abre'); look('pareo');
    const t = A.tiles, wrong = t.findIndex((x, i) => i > 0 && x.en !== t[0].en && x.k !== t[0].k);
    ACTIONS.gtile(el({ i: '0' })); ACTIONS.gtile(el({ i: String(wrong) })); eq(A.miss, 1, 'el error no se contó'); look('pareo con error');
    for (let k = 0; A && k < t.length / 2; k++) { const i = t.findIndex(x => x.k === k && x.en), j = t.findIndex(x => x.k === k && !x.en); ACTIONS.gtile(el({ i: String(i) })); ACTIONS.gtile(el({ i: String(j) })); }
    ok(!A && /Juego terminado/.test(view()), 'pareo no terminó'); look('fin de pareo'); eq(X().games.match.plays, 1);
    /* ahorcado: una palabra perdida y el resto ganadas */
    ACTIONS.game(el({ g: 'hang' })); ok(A && A.kind === 'hang' && A.words.length === 5, 'ahorcado no abre'); look('ahorcado');
    const w0 = A.words[0][0].toLowerCase(); [...'abcdefghijklmnopqrstuvwxyz'].filter(c => !w0.includes(c)).slice(0, 6).forEach(c => ACTIONS.gkey(el({ k: c })));
    eq(A.state, 'lost', 'con 6 letras malas se pierde'); look('ahorcado perdido'); ACTIONS.gnext();
    let n = 0;
    while (A && n++ < 10) { spoken.length = 0; [...new Set(A.words[A.wi][0].toLowerCase())].forEach(c => ACTIONS.gkey(el({ k: c }))); eq(A.state, 'won', 'no ganó adivinando todas las letras'); eq(spoken.length, 1, 'no dijo la palabra'); look('ahorcado ganado'); ACTIONS.gnext(); }
    ok(!A, 'ahorcado no terminó'); eq(X().games.hang.best, 4);
    /* letras: una al revés (mal), una saltada y el resto bien */
    ACTIONS.game(el({ g: 'scr' })); ok(A && A.kind === 'scr', 'letras no abre'); look('letras');
    const build = word => { const used = new Set(); [...word].forEach(c => { const i = A.letters.findIndex((x, k) => x === c && !used.has(k)); used.add(i); ACTIONS.gletter(el({ i: String(i) })); }); };
    const first = A.words[0][0].toLowerCase(), rev = [...first].reverse().join('');
    if (rev !== first) { build(rev); eq(A.state, 'play', 'aceptó la palabra al revés'); eq(A.built.length, 0, 'no limpió las letras'); }
    ACTIONS.gletter(el({ i: '0' })); ACTIONS.gunletter(el({ k: '0' })); eq(A.built.length, 0);
    ACTIONS.gskip(); eq(A.state, 'lost'); look('letras saltada'); ACTIONS.gnext();
    n = 0; while (A && n++ < 10) { build(A.words[A.wi][0].toLowerCase()); eq(A.state, 'won', 'no aceptó la palabra bien ordenada'); look('letras ganada'); ACTIONS.gnext(); }
    ok(!A, 'letras no terminó'); eq(X().games.scr.best, 5);
    /* contra reloj: 3 buenas, 1 mala y se acaba el tiempo */
    ACTIONS.game(el({ g: 'rush' })); ok(A && A.kind === 'rush', 'contra reloj no abre'); look('contra reloj');
    for (let k = 0; k < 3; k++) ACTIONS.grush(el({ i: String(A.cur.opts.indexOf(A.cur.ans)) }));
    ACTIONS.grush(el({ i: String(A.cur.opts.findIndex(o => o !== A.cur.ans)) })); eq([A.score, A.miss], [3, 1]);
    A.end = Date.now() - 1; ACTIONS.grush(el({ i: '0' }));
    ok(!A && /Juego terminado/.test(view()), 'contra reloj no terminó'); eq(X().games.rush.best, 3); ok(S.ach.gamer, 'no dio el logro Jugadora');
    ACTIONS.game(el({ g: 'rush' })); ACTIONS.quit(); ok(!A, 'la ✕ no cerró el juego'); eq(tab, 'review');
  });
  const withFetch = async (fake, fn) => { const real = fetch; fetch = fake; TR_CACHE.clear(); try { await fn(); } finally { fetch = real; TR_CACHE.clear(); } };
  const mm = t => async () => ({ ok: true, json: async () => ({ responseData: { translatedText: t }, responseStatus: 200, quotaFinished: false }) });
  test('Traductor: texto, sentido automático, historial y tarjetas', async () => {
    S = fresh(); await loadDict();
    eq(guessLang('¿Dónde está el baño?'), 'es'); eq(guessLang('Where is the bathroom, please?'), 'en');
    ok(trChunks('This is a sentence. '.repeat(60)).every(c => c.length <= 450), 'un trozo quedó muy largo');
    go('home'); eq((view().match(/class="tool-btn"/g) || []).length, 4, 'Inicio debe tener los 4 botones del traductor');
    ACTIONS.translate(el({ mode: 'text' })); eq(tab, 'translate'); look('traductor');
    await withFetch(mm('Where is the bathroom?'), async () => {
      TR.text = '¿Dónde está el baño?'; await doTranslate();
      eq(TR.res.dst, 'Where is the bathroom?'); ok(!TR.res.offline); look('traducción');
      eq(S.tr.length, 1, 'no guardó el historial'); ACTIONS.trsave(); ok(S.cards['Where is the bathroom?'], 'no guardó la tarjeta');
    });
    await withFetch(mm('Me gusta el caf&#233; &amp; el t&#233;'), async () => {
      TR = newTR(); TR.text = 'I like coffee and tea'; await doTranslate();
      eq(TR.from, 'en', 'no cambió solo el sentido a inglés → español'); eq(TR.res.dst, 'Me gusta el café & el té', 'no limpió los códigos del texto'); look('traducción al español');
    });
    ACTIONS.trswap(); ok(TR.manual && TR.from === 'es'); ACTIONS.truse(el({ i: '0' })); ok(TR.res && TR.res.dst, 'el historial no se puede reusar'); look('traductor con historial');
    ACTIONS.back(); eq(tab, 'home', 'la ✕ del traductor debe volver a Inicio');
  });
  test('Traductor sin internet o sin cupo: palabra por palabra con el diccionario', async () => {
    S = fresh(); await loadDict(); go('translate');
    TR.text = 'The house is big'; TR.from = 'en'; TR.manual = true; await doTranslate();
    ok(TR.res.offline && /casa/.test(TR.res.dst), `sin internet debería traducir con el diccionario (dio: ${TR.res.dst})`); eq((S.tr || []).length, 0, 'lo aproximado no va al historial'); look('traducción sin internet');
    ok(/house|home/.test(roughTranslate('la casa', 'es')), `español → inglés sin internet (dio: ${roughTranslate('la casa', 'es')})`);
    await withFetch(mm('MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS FOR TODAY'), async () => { const r = await translateText('good morning', 'en'); ok(r.offline && r.quota, 'no reconoció que se acabó el cupo'); });
  });
  test('Traductor por voz y por foto: pantallas y avisos', () => {
    S = fresh(); TR = newTR(); ACTIONS.translate(el({ mode: 'voice' })); eq([TR.mode, TR.from], ['voice', 'es']); look('traductor voz');
    ACTIONS.trmic(); ok(TR.micErr && !TR.mic, 'sin reconocimiento de voz debe avisar'); look('traductor voz con aviso');
    ACTIONS.trmode(el({ v: 'photo' })); eq([TR.mode, TR.from], ['photo', 'en'], 'la foto parte de inglés a español'); look('traductor foto');
    eq(cleanOcr('MENU  \n\n\n\nSoup ~~ of the day\n'), 'MENU\n\nSoup   of the day');
    TR.text = 'Soup of the day'; render(); ok(view().includes('id="trIn"') && view().includes('Otra foto'), 'el texto leído debe poder corregirse'); look('traductor foto con texto');
  });
  test('Mis cuentos: guardar con título, modo cuento y frase por frase', async () => {
    S = fresh(); RDR = null; rdAdd = false; rdDraft = ''; rdTitle = ''; go('home'); ACTIONS.tab(el({ tab: 'reader' }));
    ok(view().includes('id="rdIn"') && view().includes('id="rdTitle"'), 'sin cuentos debe mostrar el cuadro para pegar'); look('cuentos vacío');
    rdDraft = 'hi'; ACTIONS.rdopen(); ok(!RDR, 'aceptó un texto demasiado corto');
    const txt = 'My sister lives in London. She works in a hospital!\nDo you want to visit her?';
    eq(readerSentences(txt).length, 3);
    rdDraft = txt; rdTitle = '  My sister  '; ACTIONS.rdopen();
    ok(RDR && S.texts.length === 1, 'no guardó el cuento'); eq(S.texts[0].title, 'My sister'); eq([rdDraft, rdTitle], ['', ''], 'no limpió el cuadro');
    eq((view().match(/class="st-s"/g) || []).length, 3, 'modo cuento: una parte por frase'); eq((view().match(/<p>/g) || []).length, 2, 'modo cuento: un párrafo por cada párrafo pegado');
    ok(!view().includes('data-act="rdtr"'), 'el modo cuento no lleva botones entre frases'); look('cuento');
    ACTIONS.rdmode(el({ v: 'lines' })); eq(S.extra.rdMode, 'lines'); eq((view().match(/class="rd-s"/g) || []).length, 3); look('cuento frase por frase');
    await withFetch(mm('Mi hermana vive en Londres.'), async () => { await readerTranslate([0]); });
    eq(readerText().tr[0], 'Mi hermana vive en Londres.'); ok(view().includes('Mi hermana vive en Londres.'), 'no muestra la traducción');
    ACTIONS.rdmode(el({ v: 'story' })); eq(rdMode(), 'story');
    __t.promptAnswer = ' Mi hermana '; ACTIONS.rdrename(); eq(rdTitleOf(readerText()), 'Mi hermana');
    __t.promptAnswer = null; ACTIONS.rdrename(); eq(rdTitleOf(readerText()), 'Mi hermana', 'cancelar no debe borrar el título');
    ACTIONS.rdclose(); ok(!RDR && view().includes('Agregar un cuento') && view().includes('Mi hermana'), 'la biblioteca no muestra el cuento'); look('biblioteca');
    ACTIONS.rdnew(); ok(view().includes('id="rdIn"') && view().includes('Nuevo cuento')); look('nuevo cuento'); ACTIONS.rdcancel(); ok(view().includes('Agregar un cuento'));
    ACTIONS.rdpick(el({ t: String(S.texts[0].t) })); ok(RDR);
    ACTIONS.tab(el({ tab: 'lessons' })); ok(!RDR, 'al salir de Mis cuentos se debe cerrar el cuento');
    ACTIONS.tab(el({ tab: 'reader' })); ok(view().includes('Agregar un cuento'), 'al volver debe mostrar la biblioteca');
    ACTIONS.rdpick(el({ t: String(S.texts[0].t) })); ACTIONS.rddel(el({ t: String(S.texts[0].t) })); eq(S.texts.length, 0); ok(!RDR);
    ACTIONS.back(); eq(tab, 'lessons', 'la ✕ debe volver a donde estabas');
    TR = newTR(); TR.res = { src: 'This is a text from the translator. It goes to my stories.', from: 'en', dst: 'x' }; ACTIONS.trread(); ok(RDR && S.texts.length === 1, 'el traductor no guardó el texto en Mis cuentos');
  });
  test('Mis cuentos: textos antiguos, límites con aviso y nada se borra solo', () => {
    S = fresh(); RDR = null; rdAdd = false; const toastText = () => ELS['#toast'].textContent;
    S.texts = [{ t: 5, text: 'An old text from before. It has two sentences.', tr: { 0: 'Un texto antiguo de antes.' } }];
    go('reader'); ok(view().includes('An old text from before'), 'no muestra el texto antiguo'); look('biblioteca con texto antiguo');
    ACTIONS.rdpick(el({ t: '5' })); eq(RDR, 5); look('cuento antiguo'); ACTIONS.rdmode(el({ v: 'lines' })); ok(view().includes('Un texto antiguo de antes.')); look('cuento antiguo por frases'); ACTIONS.rdmode(el({ v: 'story' })); ACTIONS.rdclose();
    ok(!openReader('word '.repeat(3200)), 'aceptó un cuento demasiado largo'); eq(S.texts.length, 1); ok(/muy largo/i.test(toastText()), 'no avisó que es muy largo');
    rdDraft = 'word '.repeat(3200); ok(/muy largo/.test(rdCountText()), 'el contador no avisa'); rdDraft = '';
    for (let i = 0; i < ST_MAX - 1; i++) ok(openReader(`Story number ${i} is here. It is short.`), 'no guardó el cuento ' + i);
    eq(S.texts.length, ST_MAX);
    ok(!openReader('One more story for the library. It does not fit.'), 'aceptó más cuentos que el máximo'); ok(/llena/.test(toastText()), 'no avisó que está llena');
    eq(S.texts.length, ST_MAX, 'la biblioteca llena no debe borrar nada'); ok(S.texts.some(x => x.t === 5), 'se borró el cuento más antiguo');
    eq(new Set(S.texts.map(x => x.t)).size, ST_MAX, 'dos cuentos quedaron con el mismo número');
    RDR = null; go('reader'); ACTIONS.rdnew(); ok(!rdAdd, 'con la biblioteca llena no debe abrir el cuadro'); look('biblioteca llena');
    ok(openReader('Story number 3 is here. It is short.'), 'pegar un cuento que ya está debe abrirlo'); eq(S.texts.length, ST_MAX, 'duplicó un cuento');
    S.texts = S.texts.slice(0, 2); RDR = null;
    const setItem = localStorage.setItem; localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
    try { ok(!openReader('There is no room for this story. Sorry about that.'), 'guardó sin espacio'); eq(S.texts.length, 2, 'dejó un cuento que no se pudo guardar'); ok(/espacio/.test(toastText())); }
    finally { localStorage.setItem = setItem; }
    eq(rdClean('The cat sat on\nthe mat.\n\n\nIt was   happy.  '), 'The cat sat on the mat.\nIt was happy.', 'no ordenó el texto pegado');
  });
  test('Mis cuentos: las palabras que tocas quedan anotadas y pasan a tarjetas', async () => {
    S = fresh(); RDR = null; await loadDict();
    openReader('The dog was running in the garden. Then the children walked home.', 'The dog');
    for (const w of ['running', 'Garden', 'garden', 'children']) await ACTIONS.rdword(el({ w }));
    const x = readerText();
    eq(x.words, ['running', 'garden', 'children'], 'no anotó las palabras (sin repetir)');
    ok(x.wm.garden && x.wm.garden[1], 'no guardó el significado'); ok(SHEET.open && SHEET.word === 'children', 'no abrió el significado'); look('hoja de una palabra del cuento'); closeSheet();
    render(); ok(!/class="tw[^"]*seen/.test(view()) && view().includes('class="tw" data-act="rdword" data-w="running"'), 'las palabras tocadas no deben quedar marcadas en el texto'); ok(view().includes('Tus palabras de este cuento (3)')); look('cuento con palabras');
    await ACTIONS.rdcard(el({ w: 'garden' })); ok(S.cards[x.wm.garden[0]], 'no creó la tarjeta');
    await ACTIONS.rdcards(); const n = Object.keys(S.cards).length; ok(n >= 3, 'no pasó todas a tarjetas'); await ACTIONS.rdcards(); eq(Object.keys(S.cards).length, n, 'duplicó tarjetas');
    render(); ok(!view().includes('data-act="rdcard"'), 'ofrece agregar tarjetas que ya están'); look('cuento con tarjetas');
    ACTIONS.rdunword(el({ w: 'running' })); eq(readerText().words, ['garden', 'children']); ok(!readerText().wm.running);
    await ACTIONS.rdword(el({ w: 'zzzqq' })); closeSheet(); ok(readerText().words.includes('zzzqq')); eq(await rdToCard(readerText(), 'zzzqq'), 'miss', 'inventó un significado');
    render(); ok(view().includes('Toca para ver qué significa')); look('cuento con palabra sin significado');
  });
  test('Mis cuentos: dónde quedaste, marcar como leído y el acceso desde Lecciones', () => {
    S = fresh(); RDR = null; const xp0 = S.xp;
    openReader('One. Two. Three. Four. Five. Six. Seven. Eight. Nine. Ten.', 'Numbers'); const x = readerText();
    eq(rdPct(x), 0);
    const qsa = document.querySelectorAll;   /* 4 frases en pantalla: las dos primeras ya quedaron arriba, fuera de la vista */
    document.querySelectorAll = () => [0, 1, 2, 3].map(i => ({ dataset: { s: String(i + 3) }, getBoundingClientRect: () => ({ bottom: i * 100 - 150 }) }));
    try { rdScrolled(); eq(x.pos, 6, 'no anotó la primera frase que se ve'); ok(rdDirty); rdFlush(); ok(!rdDirty); eq(JSON.parse(__t.store.get('fluenta-v1')).texts[0].pos, 6, 'no guardó dónde quedó'); }
    finally { document.querySelectorAll = qsa; }
    x.pos = 5; eq(rdPct(x), 50);
    ACTIONS.tab(el({ tab: 'lessons', cat: 'read' })); ok(view().includes('Mis cuentos') && view().includes('Seguir leyendo') && view().includes('vas en 50 %'), 'Lecciones › Leer no muestra el cuento a medias'); look('Lecciones › Leer con cuentos');
    ACTIONS.rdpick(el({ t: String(x.t) })); eq(tab, 'reader'); eq(RDR, x.t);
    ACTIONS.rdread(); ok(x.read && S.xp > xp0, 'no dio puntos al terminar'); const xp1 = S.xp; eq(S.extra.stories, 1); eq(rdPct(x), 100); ok(view().includes('Leer de nuevo')); look('cuento leído');
    ACTIONS.rdagain(); ok(!x.read && x.pos === 0); ACTIONS.rdread(); eq(S.xp, xp1, 'dio puntos dos veces por el mismo cuento'); eq(S.extra.stories, 1);
    ACTIONS.rdclose(); ok(view().includes('Leído') && view().includes('1 leído'), 'la biblioteca no lo marca como leído'); look('biblioteca con leído');
    ACTIONS.back(); eq(tab, 'lessons', 'la ✕ de Mis cuentos debe volver a Lecciones'); ok(!view().includes('Seguir leyendo'), 'un cuento leído no va en «Seguir leyendo»');
    openCat.lessons = null; go('home'); ok(view().includes('Cuentos'), 'Inicio no muestra el acceso a Cuentos');
    eq(buildSummary().extras.cuentos, { guardados: 1, leidos: 1, palabras_anotadas: 0 });
  });
  test('El diccionario ofrece traducir una frase completa', async () => {
    S = fresh(); await loadDict(); go('home'); ACTIONS.dict(); dictSearchQ = 'how are you today'; renderSearch();
    ok(ELS['#dqres'].innerHTML.includes('data-act="translate"'), 'falta el botón para traducir la frase'); look('buscador con frase', ELS['#dqres'].innerHTML);
    ACTIONS.translate(el({ mode: 'text', t: dictSearchQ })); eq(tab, 'translate'); eq(TR.text, 'how are you today'); dictSearchQ = '';
  });
  test('Calendario de racha, diplomas y recordatorio', () => {
    rich(); go('stats'); ok(view().includes('🗓️ Calendario') && view().includes('class="on today"'), 'el calendario no marca hoy'); look('progreso con calendario');
    ACTIONS.calmove(el({ v: '-1' })); ok(calOff === -1 && !view().includes('class="on today"')); ACTIONS.calmove(el({ v: '1' })); ACTIONS.calmove(el({ v: '1' })); eq(calOff, 0, 'no se puede ir al futuro');
    /* terminar la última lección de A1 da el diploma */
    S = fresh(); go('lessons'); const a1 = levelLessons('A1'); a1.slice(0, -1).forEach(l => { S.done[l.id] = 3; });
    playLesson(a1[a1.length - 1].id); ok(view().includes('Completaste todo el nivel A1'), 'el resumen no avisa del diploma'); eq(X().diplomas.A1, dayStr());
    go('stats'); ok(view().includes('data-act="diploma" data-v="A1"'), 'Progreso no muestra el diploma'); S.name = 'Kata';
    ACTIONS.diploma(el({ v: 'A1' })); ok(/Kata/.test(sheet()) && /A1/.test(sheet()), 'el diploma no trae el nombre y el nivel'); look('diploma'); closeSheet();
    const ics = reminderICS('07:30'); ok(/RRULE:FREQ=DAILY/.test(ics) && /DTSTART:\d{8}T073000/.test(ics) && /BEGIN:VALARM/.test(ics), 'el recordatorio está mal armado');
    go('profile'); ok(view().includes('id="setRemind"'), 'Perfil no tiene el recordatorio'); ok(buildSummary().extras.diplomas.A1, 'los diplomas no van en el respaldo');
  });

  /* ============ 7. Navegación ============ */
  test('La ✕ vuelve a donde estabas y la barra marca la sección correcta', () => {
    S = fresh();
    go('review'); go('mycards'); eq(navOf(tab), 'review'); ACTIONS.back(); eq(tab, 'review');
    go('lessons'); go('write'); go('claude'); eq(navOf(tab), 'lessons'); ACTIONS.back(); eq(tab, 'write'); ACTIONS.back(); eq(tab, 'lessons');
    go('review'); ACTIONS.tab(el({ tab: 'lessons', cat: 'write' })); eq(openCat.lessons, 'write');
    go('home'); ACTIONS.tenses(); eq(tab, 'lessons'); ok(/^tz-/.test(openCat.lessons), 'Tiempos no abre su sección');
  });
  test('Todos los botones que aparecen hacen algo', () => {
    const missing = [...seenActs].map(x => x.split('|')).filter(([a]) => !ACTIONS[a]);
    ok(seenActs.size > 100, 'se revisaron muy pocos botones');
    ok(!missing.length, 'botones sin acción: ' + missing.slice(0, 6).map(([a, w]) => `${a} (en ${w})`).join(', '));
  });

  /* ============ 8. Voz ============ */
  test('🐢 Lento: la frase se dice por partes, todas pedidas en el mismo toque', () => {
    S = fresh(); spoken.length = 0; const before = __t.pending();
    const txt = 'Yesterday I went to the supermarket with my sister.', parts = slowChunks(txt);
    speak(txt, true);
    ok(parts.length > 1, 'no se dividió en partes');
    eq(spoken.map(u => u.text), parts, 'no se pidieron todas las partes al tiro');
    ok(spoken.every(u => u.rate === 0.5), 'las partes no van a la velocidad más lenta');
    eq(__t.pending(), before, 'la voz quedó esperando un temporizador (el iPhone no la dejaría sonar)');
    eq(parts.join(' '), txt, 'las partes no forman la frase completa');
    parts.slice(0, -1).forEach(p => ok(!SLOW_GLUE.has(p.split(' ').pop().toLowerCase().replace(/[^a-z']/g, '')), `una parte termina en "${p.split(' ').pop()}"`));
  });
  test('🔊 Normal: una sola vez y a la velocidad de Ajustes', () => {
    S = fresh(); S.rate = 0.9; spoken.length = 0;
    speak('Good morning, how are you?'); eq(spoken.length, 1); eq(spoken[0].rate, 0.9);
    spoken.length = 0; speak('(formal) Nice to meet you.'); eq(spoken[0].text, 'Nice to meet you.', 'no quita la nota entre paréntesis');
  });

  /* ============ 9. Correcciones y comparaciones ============ */
  test('Respuestas escritas: mayúsculas, tildes y una letra de diferencia', () => {
    ok(sameAnswer('Hello', 'hello').ok); ok(sameAnswer('café', 'cafe').ok);
    const c = sameAnswer('helo', 'hello'); ok(c.ok && c.close, '"helo" debería valer como casi');
    ok(!sameAnswer('cat', 'car').ok, 'en palabras cortas no se acepta una letra distinta'); ok(!sameAnswer('', 'x').ok);
  });
  test('Pronunciación: comparar lo que dijiste con la frase', () => {
    eq(compare('I like coffee', 'i like coffee').score, 100);
    const r = compare('I like coffee', 'i like tea'); ok(r.score > 50 && r.score < 100, 'una palabra distinta no baja el puntaje');
    eq(compare("I'm fine, thanks", 'I am fine thanks').score, 100, 'las contracciones deben contar igual');
    const an = analyzePron('Think about it', ['think about it', 'tink about it'], null);
    ok(an.overall >= 80 && an.words.length === 3, 'el análisis por palabra no funciona');
  });
  test('Corrector de escritura: errores típicos del español', async () => {
    await loadDict();
    const fix = t => localWritingRules(t).map(e => `${e.wrong}→${e.right}`);
    const has = (t, w) => { const f = fix(t); ok(f.includes(w), `"${t}" debería corregir ${w} (encontró: ${f.join(', ') || 'nada'})`); };
    has('Yesterday I go to the park.', 'go→went');
    has('She like coffee.', 'like→likes');
    has('I have 30 years.', 'have 30 years→am 30 years old');
    has('They is happy.', 'is→are');
    has('i am tired.', 'i→I');
    has('I bought an car.', 'an→a');
    has('It depends of you.', 'depends of→depends on');
    eq(fix('She likes coffee. I went home yesterday.'), [], 'marcó errores en un texto correcto');
  });

  /* ============ 10. Respaldo y errores de la app ============ */
  test('Exportar el progreso funciona con tiempos verbales practicados', () => {
    rich(); S.lastExport = 0;
    const sum = buildSummary(); ok(sum.tiempos_verbales && Object.keys(sum.tiempos_verbales).length, 'faltan los tiempos verbales');
    ok(Object.values(sum.tiempos_verbales).every(x => /^\d+\/\d+$/.test(x.practicas)), 'las prácticas no se cuentan bien');
    JSON.stringify(sum);
    exportData(); ok(S.lastExport > 0, 'no anotó la copia');
  });
  test('Importar un progreso y un refuerzo', () => {
    rich(); const copy = JSON.stringify({ app: 'fluenta', kind: 'progress', state: { ...S, name: 'Copia' } });
    S = fresh(); importText(copy); eq(S.name, 'Copia', 'no restauró el progreso'); ok(Object.keys(S.cards).length > 3, 'faltan las tarjetas');
    importText(JSON.stringify({ app: 'fluenta', kind: 'pack', title: 'Refuerzo', words: [['house', 'casa'], ['car', 'auto'], ['dog', 'perro'], ['cat', 'gato']], sentences: [['I have a dog.', 'Tengo un perro.']] }));
    eq(tab, 'review', 'un refuerzo debe abrir Repaso'); eq(openCat.review, 'claude');
    ok(S.packs.some(p => p.title === 'Refuerzo'), 'no guardó el refuerzo');
  });
  test('Si un botón falla, la app avisa y lo anota', () => {
    S = fresh(); ACTIONS.__falla = () => { throw new Error('falla de prueba'); };
    const click = __t.listeners.click[0];
    click({ target: { closest: () => el({ act: '__falla' }) }, preventDefault() {} });
    delete ACTIONS.__falla;
    eq(S.errors.length, 1, 'no anotó el error'); eq(S.errors[0].where, 'botón __falla'); ok(/falla de prueba/.test(S.errors[0].msg));
    ok(/Algo falló/.test(ELS['#toast'].textContent), 'no avisó');
    ok(buildSummary().errores_de_la_app.length === 1, 'el error no va en el archivo de progreso');
    go('profile'); ok(view().includes('La app anotó 1 error'), 'Perfil no muestra el error'); ACTIONS.clearerr(); eq(S.errors.length, 0);
  });
})();
