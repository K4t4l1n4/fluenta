/* ============================================================
   MÁS CONTENIDO DE FLUENTA (3.8)
   Vocabulario práctico, pares de sonidos y prueba de nivel.

   - Cada grupo de VOCAB funciona como una lección: 10 palabras o
     expresiones y 6 frases; la app arma sola los 20 ejercicios.
   - No cambies los "id": con ellos se guarda lo que ya hiciste.
   ============================================================ */

const VOCAB = {
  /* Falsos amigos: [inglés, lo que SÍ significa, lo que parece (falso), cómo se dice eso en inglés] */
  ff: { title: "Falsos amigos", icon: "🚫",
    intro: "Palabras en inglés que se parecen a una palabra en español, pero significan otra cosa. Son la trampa más común para quienes hablamos español.",
    sets: [
      { id: "x-ff-1", title: "Falsos amigos 1", icon: "🚫",
        tip: "Un falso amigo se parece a una palabra del español, pero significa otra cosa. \"Actually\" (en realidad) no es «actualmente»: eso se dice \"currently\" (actualmente).",
        items: [
          ["actually", "en realidad", "actualmente", "currently"], ["embarrassed", "avergonzada", "embarazada", "pregnant"],
          ["carpet", "alfombra", "carpeta", "folder"], ["library", "biblioteca", "librería", "bookstore"],
          ["exit", "salida", "éxito", "success"], ["sensible", "sensato", "sensible", "sensitive"],
          ["realize", "darse cuenta", "realizar", "carry out"], ["assist", "ayudar", "asistir", "attend"],
          ["parents", "padres", "parientes", "relatives"], ["lecture", "charla", "lectura", "reading"]
        ],
        sentences: [
          ["Actually, I don't like coffee.", "En realidad, no me gusta el café."], ["I was so embarrassed that my face turned red.", "Estaba tan avergonzada que me puse roja."],
          ["There is a red carpet in the living room.", "Hay una alfombra roja en el living."], ["I study at the library every afternoon.", "Estudio en la biblioteca todas las tardes."],
          ["I didn't realize it was so late.", "No me di cuenta de que era tan tarde."], ["My parents live near the exit of the subway.", "Mis padres viven cerca de la salida del metro."]
        ] },
      { id: "x-ff-2", title: "Falsos amigos 2", icon: "🚫",
        tip: "\"Large\" (grande) no es «largo»: eso se dice \"long\" (largo). Y \"eventually\" (finalmente, con el tiempo) no es «eventualmente».",
        items: [
          ["fabric", "tela", "fábrica", "factory"], ["large", "grande", "largo", "long"],
          ["constipated", "estreñida", "constipada (resfriada)", "to have a cold"], ["pretend", "fingir", "pretender", "intend"],
          ["eventually", "finalmente", "eventualmente", "possibly"], ["argument", "discusión", "argumento (de una película)", "plot"],
          ["attend", "asistir", "atender", "take care of"], ["rope", "cuerda", "ropa", "clothes"],
          ["soap", "jabón", "sopa", "soup"], ["success", "éxito", "suceso", "event"]
        ],
        sentences: [
          ["This fabric is very soft.", "Esta tela es muy suave."], ["They live in a large house.", "Viven en una casa grande."],
          ["The kids pretend to be asleep.", "Los niños fingen estar dormidos."], ["Eventually, she found a good job.", "Finalmente encontró un buen trabajo."],
          ["We had an argument about money.", "Tuvimos una discusión por plata."], ["I can't attend the meeting tomorrow.", "No puedo asistir a la reunión mañana."]
        ] },
      { id: "x-ff-3", title: "Falsos amigos 3", icon: "🚫",
        tip: "\"Support\" (apoyar) no es «soportar»: eso se dice \"stand\" (soportar), como en \"I can't stand the noise\" (No soporto el ruido).",
        items: [
          ["introduce", "presentar (a alguien)", "introducir", "insert"], ["record", "grabar", "recordar", "remember"],
          ["remove", "quitar", "remover (revolver)", "stir"], ["support", "apoyar", "soportar", "stand"],
          ["resume", "reanudar", "resumir", "summarize"], ["advertisement", "anuncio", "advertencia", "warning"],
          ["casualty", "víctima", "casualidad", "coincidence"], ["compromise", "acuerdo (cediendo ambos)", "compromiso", "commitment"],
          ["disgust", "asco", "disgusto", "upset"], ["bland", "soso", "blando", "soft"]
        ],
        sentences: [
          ["Let me introduce you to my sister.", "Déjame presentarte a mi hermana."], ["Can I record the class?", "¿Puedo grabar la clase?"],
          ["Please remove your shoes.", "Por favor, quítate los zapatos."], ["My family always supports me.", "Mi familia siempre me apoya."],
          ["We will resume the class after lunch.", "Vamos a reanudar la clase después de almuerzo."], ["The soup is a little bland.", "La sopa está un poco sosa."]
        ] }
    ] },

  /* Phrasal verbs: [inglés, español] */
  pv: { title: "Phrasal verbs", icon: "🔤",
    intro: "Un verbo más una palabrita (up, off, out…) que juntos significan algo nuevo. Se usan muchísimo al hablar.",
    sets: [
      { id: "x-pv-1", title: "En el día a día", icon: "🏡",
        tip: "Un phrasal verb es un verbo más una palabrita, y juntos cambian de significado: \"give\" (dar), pero \"give up\" (rendirse). Hay que aprenderlos como una sola palabra.",
        items: [["wake up", "despertarse"], ["get up", "levantarse"], ["turn on", "encender"], ["turn off", "apagar"], ["put on", "ponerse (ropa)"],
          ["take off", "quitarse (ropa)"], ["pick up", "recoger"], ["look for", "buscar"], ["find out", "averiguar"], ["give up", "rendirse"]],
        sentences: [
          ["I wake up at six every day.", "Me despierto a las seis todos los días."], ["Can you turn off the lights, please?", "¿Puedes apagar las luces, por favor?"],
          ["Put on your jacket. It's cold.", "Ponte la chaqueta. Hace frío."], ["I'm looking for my keys.", "Estoy buscando mis llaves."],
          ["I'll pick you up at eight.", "Te paso a buscar a las ocho."], ["Don't give up. You can do it.", "No te rindas. Tú puedes."]
        ] },
      { id: "x-pv-2", title: "Amigos y planes", icon: "👯",
        tip: "Después de \"look forward to\" (tener muchas ganas de) el verbo va con -ing: \"I'm looking forward to seeing you\" (Tengo muchas ganas de verte).",
        items: [["look forward to", "tener muchas ganas de"], ["get along with", "llevarse bien con"], ["hang out", "pasar el rato"], ["run into", "encontrarse con (por casualidad)"], ["break up", "terminar (una relación)"],
          ["make up", "reconciliarse"], ["ask out", "invitar a salir"], ["count on", "contar con"], ["catch up", "ponerse al día"], ["show up", "aparecer"]],
        sentences: [
          ["I'm looking forward to seeing you.", "Tengo muchas ganas de verte."], ["I get along with my coworkers.", "Me llevo bien con mis compañeros de trabajo."],
          ["We hang out on Fridays.", "Pasamos el rato juntos los viernes."], ["I ran into my teacher at the supermarket.", "Me encontré con mi profesora en el supermercado."],
          ["You can count on me.", "Puedes contar conmigo."], ["He didn't show up at the party.", "No apareció en la fiesta."]
        ] },
      { id: "x-pv-3", title: "Trabajo y estudio", icon: "💼",
        tip: "\"Run out of\" (quedarse sin) se usa con cosas que se acaban: \"We ran out of time\" (Nos quedamos sin tiempo).",
        items: [["figure out", "resolver"], ["carry on", "seguir"], ["put off", "postergar"], ["run out of", "quedarse sin"], ["deal with", "tratar con"],
          ["set up", "organizar"], ["fill out", "llenar (un formulario)"], ["hand in", "entregar"], ["look up", "buscar (información)"], ["take over", "hacerse cargo"]],
        sentences: [
          ["I can't figure out this problem.", "No logro resolver este problema."], ["Don't put off your homework.", "No postergues tu tarea."],
          ["We ran out of milk.", "Nos quedamos sin leche."], ["Please fill out this form.", "Por favor, llene este formulario."],
          ["I need to look up this word.", "Necesito buscar esta palabra."], ["She has to deal with many clients.", "Tiene que tratar con muchos clientes."]
        ] },
      { id: "x-pv-4", title: "Viajes y problemas", icon: "🧳",
        tip: "\"Get on\" (subirse) y \"get off\" (bajarse) se usan con bus, tren y avión. Con auto y taxi se dice \"get in\" (subirse) y \"get out\" (bajarse).",
        items: [["check in", "registrarse"], ["set off", "partir"], ["get on", "subirse"], ["get off", "bajarse"], ["come back", "volver"],
          ["break down", "averiarse"], ["hold on", "esperar un momento"], ["work out", "hacer ejercicio"], ["calm down", "calmarse"], ["go on", "continuar"]],
        sentences: [
          ["We need to check in before noon.", "Tenemos que registrarnos antes del mediodía."], ["Get off the bus at the next stop.", "Bájate del bus en la próxima parada."],
          ["The car broke down on the highway.", "El auto se averió en la carretera."], ["Hold on, I'm almost ready.", "Espera, ya casi estoy lista."],
          ["I work out three times a week.", "Hago ejercicio tres veces a la semana."], ["When are you coming back?", "¿Cuándo vuelves?"]
        ] }
    ] },

  /* Expresiones: [inglés, español] */
  ex: { title: "Expresiones", icon: "💬",
    intro: "Frases hechas que la gente usa todos los días. No se traducen palabra por palabra: se aprenden completas.",
    sets: [
      { id: "x-ex-1", title: "Para conversar", icon: "💬",
        tip: "Estas frases se dicen completas, tal cual. \"It's up to you\" (tú decides) sirve cuando te da lo mismo cualquiera de las opciones.",
        items: [["no worries", "no te preocupes"], ["it's up to you", "tú decides"], ["I'm on my way", "voy en camino"], ["never mind", "olvídalo"], ["take your time", "tómate tu tiempo"],
          ["it depends", "depende"], ["sounds good", "suena bien"], ["I have no idea", "no tengo idea"], ["by the way", "por cierto"], ["long time no see", "tanto tiempo sin verte"]],
        sentences: [
          ["It's up to you. I like both.", "Tú decides. Me gustan los dos."], ["I'm on my way. See you soon.", "Voy en camino. Nos vemos pronto."],
          ["Take your time. There's no hurry.", "Tómate tu tiempo. No hay apuro."], ["By the way, how is your mother?", "Por cierto, ¿cómo está tu mamá?"],
          ["Never mind, I found my phone.", "Olvídalo, encontré mi teléfono."], ["Pizza tonight? Sounds good!", "¿Pizza esta noche? ¡Suena bien!"]
        ] },
      { id: "x-ex-2", title: "Opinar y reaccionar", icon: "🙋",
        tip: "\"No way!\" (¡no puede ser!) muestra sorpresa. \"Fair enough\" (me parece justo) sirve para aceptar lo que dice la otra persona, aunque no pienses igual.",
        items: [["to be honest", "para ser sincera"], ["that makes sense", "tiene sentido"], ["I'm not sure", "no estoy segura"], ["you're right", "tienes razón"], ["no way", "no puede ser"],
          ["I guess so", "supongo que sí"], ["what a pity", "qué lástima"], ["fair enough", "me parece justo"], ["it's not a big deal", "no es para tanto"], ["good for you", "bien por ti"]],
        sentences: [
          ["To be honest, I didn't like the movie.", "Para ser sincera, no me gustó la película."], ["That makes sense. Thanks for explaining.", "Tiene sentido. Gracias por explicar."],
          ["You're right. I made a mistake.", "Tienes razón. Me equivoqué."], ["No way! You won the prize?", "¡No puede ser! ¿Ganaste el premio?"],
          ["Don't worry, it's not a big deal.", "No te preocupes, no es para tanto."], ["You passed the exam? Good for you!", "¿Pasaste el examen? ¡Bien por ti!"]
        ] },
      { id: "x-ex-3", title: "Modismos comunes", icon: "🌙",
        tip: "Los modismos no se pueden traducir palabra por palabra: \"a piece of cake\" (pan comido) no habla de torta, sino de algo muy fácil.",
        items: [["a piece of cake", "pan comido"], ["under the weather", "medio enferma"], ["once in a blue moon", "muy de vez en cuando"], ["break the ice", "romper el hielo"], ["cost an arm and a leg", "costar un ojo de la cara"],
          ["hit the road", "ponerse en marcha"], ["call it a day", "dar por terminado el día"], ["keep an eye on", "echarle un ojo a"], ["on the same page", "en la misma sintonía"], ["make up your mind", "decídete"]],
        sentences: [
          ["The test was a piece of cake.", "La prueba fue pan comido."], ["I'm feeling a bit under the weather today.", "Hoy me siento medio enferma."],
          ["We go to the cinema once in a blue moon.", "Vamos al cine muy de vez en cuando."], ["That phone costs an arm and a leg.", "Ese teléfono cuesta un ojo de la cara."],
          ["It's late. Let's call it a day.", "Es tarde. Dejémoslo hasta aquí por hoy."], ["Can you keep an eye on my bag?", "¿Puedes echarle un ojo a mi bolso?"]
        ] }
    ] }
};

/* ===== PARES DE SONIDOS: dos palabras que suenan casi igual. Cada par: [palabra A, español, palabra B, español] ===== */
const MIN_PAIRS = [
  { id: "mp-i", icon: "🐑", title: "i corta / i larga", tip: "En «ship» la i es corta y relajada, casi una «e». En «sheep» es larga y con la boca estirada, como sonriendo.",
    pairs: [["ship", "barco", "sheep", "oveja"], ["sit", "sentarse", "seat", "asiento"], ["fill", "llenar", "feel", "sentir"], ["bit", "pedacito", "beat", "golpear / ritmo"],
      ["chip", "papa frita", "cheap", "barato"], ["slip", "resbalar", "sleep", "dormir"], ["hit", "golpear", "heat", "calor"], ["rich", "rico", "reach", "alcanzar"]] },
  { id: "mp-ae", icon: "🐱", title: "cat / cut", tip: "En «cat» la boca se abre hacia los lados, entre «a» y «e». En «cut» es una «a» corta, seca y relajada.",
    pairs: [["cat", "gato", "cut", "cortar"], ["cap", "gorra", "cup", "taza"], ["ran", "corrió", "run", "correr"], ["hat", "sombrero", "hut", "choza"],
      ["bag", "bolso", "bug", "bicho"], ["fan", "ventilador", "fun", "diversión"], ["match", "partido / fósforo", "much", "mucho"], ["sang", "cantó", "sung", "cantado"]] },
  { id: "mp-e", icon: "🛏️", title: "bed / bad", tip: "«Bed» suena como nuestra «e». En «bad» la boca se abre más, entre «a» y «e».",
    pairs: [["bed", "cama", "bad", "malo"], ["men", "hombres", "man", "hombre"], ["pen", "lápiz", "pan", "sartén"], ["said", "dijo", "sad", "triste"],
      ["head", "cabeza", "had", "tuvo"], ["send", "enviar", "sand", "arena"], ["guess", "adivinar", "gas", "gas"], ["set", "poner / conjunto", "sat", "se sentó"]] },
  { id: "mp-o", icon: "📝", title: "not / note", tip: "En «not» la o es corta y abierta, casi una «a». En «note» suena «ou», con dos sonidos.",
    pairs: [["not", "no", "note", "nota"], ["hop", "saltar", "hope", "esperanza"], ["want", "querer", "won't", "no (futuro)"], ["cot", "catre", "coat", "abrigo"],
      ["rod", "vara", "road", "camino"], ["sock", "calcetín", "soak", "remojar"]] },
  { id: "mp-bv", icon: "🚐", title: "b / v", tip: "La «b» se hace juntando los labios. La «v» se hace con los dientes de arriba tocando el labio de abajo, y vibra.",
    pairs: [["berry", "baya", "very", "muy"], ["boat", "bote", "vote", "votar"], ["ban", "prohibir", "van", "furgón"], ["best", "el mejor", "vest", "chaleco"],
      ["bet", "apostar", "vet", "veterinario"], ["base", "base", "vase", "florero"], ["curb", "cuneta", "curve", "curva"]] },
  { id: "mp-shch", icon: "🪑", title: "sh / ch", tip: "«Sh» es el sonido de pedir silencio: shhh, largo y suave. «Ch» es como nuestra «ch», corta y con golpe.",
    pairs: [["ship", "barco", "chip", "papa frita"], ["share", "compartir", "chair", "silla"], ["shoe", "zapato", "chew", "masticar"], ["sheep", "oveja", "cheap", "barato"],
      ["wash", "lavar", "watch", "mirar / reloj"], ["cash", "efectivo", "catch", "atrapar"], ["shop", "tienda", "chop", "picar"], ["wish", "desear", "witch", "bruja"]] },
  { id: "mp-th", icon: "🌳", title: "th / t, s, d", tip: "Para la «th» la lengua va entre los dientes. Si no la sacas, «three» suena como «tree» y «think» como «sink».",
    pairs: [["three", "tres", "tree", "árbol"], ["think", "pensar", "sink", "lavaplatos / hundirse"], ["thank", "agradecer", "tank", "tanque"], ["thin", "delgado", "tin", "lata"],
      ["mouth", "boca", "mouse", "ratón"], ["path", "sendero", "pass", "pasar"], ["then", "entonces", "den", "guarida"], ["they", "ellos", "day", "día"]] },
  { id: "mp-sz", icon: "🐝", title: "s / z", tip: "La «z» inglesa vibra como el zumbido de una abeja: zzz. La «s» es solo aire, sin vibración.",
    pairs: [["ice", "hielo", "eyes", "ojos"], ["price", "precio", "prize", "premio"], ["rice", "arroz", "rise", "subir"], ["bus", "bus", "buzz", "zumbido"],
      ["place", "lugar", "plays", "juega"], ["peace", "paz", "peas", "arvejas"]] },
  { id: "mp-jy", icon: "✈️", title: "y / j", tip: "La «y» inglesa es suave, como una «i» rápida. La «j» es fuerte, como «dch»: «jet» suena «dchet».",
    pairs: [["yet", "todavía", "jet", "avión a chorro"], ["yellow", "amarillo", "jello", "jalea"], ["yam", "camote", "jam", "mermelada"], ["yolk", "yema", "joke", "chiste"], ["year", "año", "jeer", "burlarse"]] },
  { id: "mp-h", icon: "💇", title: "con h / sin h", tip: "La «h» inglesa se sopla suavemente, como echar vaho en un vidrio. No es nuestra «j» fuerte, y casi nunca es muda.",
    pairs: [["hair", "pelo", "air", "aire"], ["heat", "calor", "eat", "comer"], ["hand", "mano", "and", "y"], ["hear", "oír", "ear", "oreja"],
      ["hold", "sostener", "old", "viejo"], ["hate", "odiar", "eight", "ocho"], ["hill", "cerro", "ill", "enfermo"], ["his", "su (de él)", "is", "es / está"]] }
];

/* ===== PRUEBA DE NIVEL: 6 preguntas por nivel. Se pasa un nivel con 4 de 6. [frase con ___, [opciones]] (la primera es la correcta) ===== */
const PLACEMENT = [
  { level: "A1", qs: [
    ["She ___ a teacher.", ["is", "are", "am", "be"]],
    ["I ___ coffee every morning.", ["drink", "drinks", "drinking", "am drink"]],
    ["___ you like pizza?", ["Do", "Does", "Are", "Is"]],
    ["There ___ two books on the table.", ["are", "is", "be", "am"]],
    ["This is my brother. ___ name is Tom.", ["His", "Her", "He", "Him"]],
    ["I ___ speak English very well, but I'm learning.", ["can't", "don't can", "not can", "am not"]]
  ] },
  { level: "A2", qs: [
    ["Yesterday we ___ to the beach.", ["went", "go", "gone", "going"]],
    ["She is ___ than her sister.", ["taller", "more tall", "tallest", "tall"]],
    ["I ___ TV when you called.", ["was watching", "watched", "am watching", "watch"]],
    ["We ___ visit my grandmother next weekend.", ["are going to", "going to", "will to", "go to"]],
    ["How ___ money do you have?", ["much", "many", "long", "often"]],
    ["I have ___ been to London. It's my first time!", ["never", "ever", "yet", "already"]]
  ] },
  { level: "B1", qs: [
    ["I have lived here ___ 2019.", ["since", "for", "from", "during"]],
    ["If it rains tomorrow, we ___ at home.", ["will stay", "stay", "would stay", "stayed"]],
    ["This house ___ in 1950.", ["was built", "built", "is built", "has built"]],
    ["You ___ wear a seatbelt. It's the law.", ["must", "might", "would", "could"]],
    ["She told me that she ___ tired.", ["was", "is", "be", "has"]],
    ["I'm looking forward to ___ you soon.", ["seeing", "see", "saw", "seen"]]
  ] },
  { level: "B2", qs: [
    ["If I ___ more time, I would learn to play the piano.", ["had", "have", "would have", "had had"]],
    ["By the time we arrived, the movie ___.", ["had already started", "already starts", "has already started", "was already start"]],
    ["I wish I ___ so much last night.", ["hadn't eaten", "didn't eat", "haven't eaten", "wouldn't eat"]],
    ["He denied ___ the window.", ["breaking", "to break", "break", "broke"]],
    ["The report ___ by Friday, so don't worry.", ["will have been finished", "will finishing", "has finished", "is finish"]],
    ["___ it was raining, we went for a walk.", ["Although", "Despite", "However", "In spite"]]
  ] },
  { level: "C1", qs: [
    ["Hardly ___ the door when the phone rang.", ["had I opened", "I had opened", "I opened", "did I opened"]],
    ["She's not used to ___ up so early.", ["getting", "get", "got", "be getting"]],
    ["Had I known about the traffic, I ___ earlier.", ["would have left", "would leave", "had left", "will have left"]],
    ["The project was a failure; ___, we learned a lot.", ["nevertheless", "although", "despite", "whereas"]],
    ["It's high time you ___ looking for a job.", ["started", "start", "will start", "have started"]],
    ["Not only ___ late, but he also forgot the documents.", ["did he arrive", "he arrived", "he did arrive", "arrived he"]]
  ] }
];
