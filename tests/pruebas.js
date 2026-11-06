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
    tab = 'home'; L = null; D = null; F = null; P = null; W = null; CL = newCL();
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
  const TABS = ['home', 'lessons', 'review', 'stats', 'profile', 'mycards', 'talk', 'write', 'grammar', 'claude', 'verbs', 'tenses'];
  test('Todas las pantallas abren sin progreso', () => { S = fresh(); TABS.forEach(t => { go(t); ok(view().length > 100, `${t} está vacía`); look(t + ' (vacío)'); }); });
  test('Todas las pantallas abren con progreso', () => { rich(); TABS.forEach(t => { go(t); look(t); }); });
  test('Cada sección de Lecciones se despliega', () => {
    rich(); go('lessons');
    const ids = actsIn(view()).length && [...view().matchAll(/data-act="cat" data-page="lessons" data-id="([^"]+)"/g)].map(m => m[1]);
    ok(ids.length >= 7, 'faltan secciones en Lecciones');
    ids.forEach(id => { openCat.lessons = id; render(); ok(view().includes('cat-body'), `la sección ${id} no se abre`); look('Lecciones › ' + id); });
    S.done = {}; courseLevel = 'B2'; openCat.lessons = 'course'; render(); look('Lecciones › curso B2');
  });
  test('Cada sección de Repaso se despliega', () => {
    rich(); go('review');
    const ids = [...view().matchAll(/data-act="cat" data-page="review" data-id="([^"]+)"/g)].map(m => m[1]);
    eq(ids.length, 8, 'Repaso debe tener 8 secciones');
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
