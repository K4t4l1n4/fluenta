/* ============================================================
   CONTENIDO DE FLUENTA
   Para agregar algo, copia un bloque y cambia el texto.
   Los ejercicios se generan solos.
   ============================================================ */

const LESSONS = [
  {
    unit: "Repaso A1 · Lo básico", level: "A1",
    lessons: [
      { id: "u1l1", title: "Saludos", icon: "👋",
        tip: "\"How are you?\" casi siempre se responde corto: \"I'm fine, thanks\" o \"Good, and you?\".",
        words: [["hello","hola"],["goodbye","adiós"],["good morning","buenos días"],["good night","buenas noches"],["thank you","gracias"],["please","por favor"]],
        sentences: [["Hello, how are you?","Hola, ¿cómo estás?"],["I am fine, thank you","Estoy bien, gracias"],["Nice to meet you","Encantada de conocerte"],["See you tomorrow","Nos vemos mañana"]] },
      { id: "u1l2", title: "Preséntate", icon: "🙋",
        tip: "\"I am\" se acorta a \"I'm\". Para decir de dónde eres usa \"I'm from…\".",
        words: [["name","nombre"],["country","país"],["city","ciudad"],["friend","amigo"],["student","estudiante"],["job","trabajo"]],
        sentences: [["My name is Ana","Mi nombre es Ana"],["I am from Chile","Soy de Chile"],["I live in a big city","Vivo en una ciudad grande"],["What do you do?","¿A qué te dedicas?"]] },
      { id: "u1l3", title: "Números y colores", icon: "🎨",
        tip: "En inglés el color va ANTES del sustantivo: \"a red car\" = un auto rojo.",
        words: [["one","uno"],["two","dos"],["ten","diez"],["red","rojo"],["blue","azul"],["green","verde"]],
        sentences: [["I have two cats","Tengo dos gatos"],["My car is red","Mi auto es rojo"],["The sky is blue","El cielo es azul"],["How old are you?","¿Cuántos años tienes?"]] }
    ]
  },
  {
    unit: "Repaso A1 · Día a día", level: "A1",
    lessons: [
      { id: "u2l1", title: "Rutina", icon: "⏰",
        tip: "Con he/she/it el verbo lleva -s: \"She works\", \"He wakes up\".",
        words: [["wake up","despertar"],["breakfast","desayuno"],["work","trabajar"],["shower","ducha"],["always","siempre"],["sometimes","a veces"]],
        sentences: [["I wake up at seven","Me despierto a las siete"],["I always eat breakfast","Siempre tomo desayuno"],["She works from home","Ella trabaja desde casa"],["We sometimes go to the gym","A veces vamos al gimnasio"]] },
      { id: "u2l2", title: "Comida", icon: "🍎",
        tip: "Para pedir con educación usa \"Can I have…?\" o \"I'd like…\".",
        words: [["water","agua"],["bread","pan"],["chicken","pollo"],["apple","manzana"],["coffee","café"],["hungry","con hambre"]],
        sentences: [["I am very hungry","Tengo mucha hambre"],["Can I have some water?","¿Me das un poco de agua?"],["I don't like coffee","No me gusta el café"],["This chicken is delicious","Este pollo está delicioso"]] },
      { id: "u2l3", title: "La casa", icon: "🏠",
        tip: "\"There is\" (singular) y \"There are\" (plural) significan \"hay\".",
        words: [["kitchen","cocina"],["bedroom","dormitorio"],["bathroom","baño"],["window","ventana"],["door","puerta"],["table","mesa"]],
        sentences: [["The kitchen is small","La cocina es pequeña"],["Please close the door","Por favor cierra la puerta"],["There are two windows in my bedroom","Hay dos ventanas en mi dormitorio"],["The keys are on the table","Las llaves están en la mesa"]] }
    ]
  },
  {
    unit: "Fuera de casa", level: "A2",
    lessons: [
      { id: "u3l1", title: "La ciudad", icon: "🗺️",
        tip: "Para dar indicaciones: \"turn left/right\" (dobla), \"go straight\" (sigue derecho), \"next to\" (al lado de).",
        words: [["street","calle"],["left","izquierda"],["right","derecha"],["near","cerca"],["far","lejos"],["corner","esquina"]],
        sentences: [["Turn left at the corner","Dobla a la izquierda en la esquina"],["Is it far from here?","¿Está lejos de aquí?"],["The bank is next to the park","El banco está al lado del parque"],["Go straight ahead","Sigue derecho"]] },
      { id: "u3l2", title: "De compras", icon: "🛍️",
        tip: "\"How much is…?\" para una cosa; \"How much are…?\" para varias.",
        words: [["price","precio"],["cheap","barato"],["expensive","caro"],["size","talla"],["cash","efectivo"],["receipt","boleta"]],
        sentences: [["How much is this?","¿Cuánto cuesta esto?"],["It is too expensive","Es demasiado caro"],["Do you have a smaller size?","¿Tiene una talla más pequeña?"],["Can I pay by card?","¿Puedo pagar con tarjeta?"]] },
      { id: "u3l3", title: "De viaje", icon: "✈️",
        tip: "\"Check in\" = registrarse. \"Board\" = abordar el avión.",
        words: [["flight","vuelo"],["luggage","equipaje"],["passport","pasaporte"],["ticket","pasaje"],["gate","puerta de embarque"],["delayed","retrasado"]],
        sentences: [["My flight is delayed","Mi vuelo está retrasado"],["Where is gate five?","¿Dónde está la puerta cinco?"],["I need to check my luggage","Necesito despachar mi equipaje"],["Here is my passport","Aquí está mi pasaporte"]] }
    ]
  },
  {
    unit: "Lo que pasó (pasado)", level: "A2",
    lessons: [
      { id: "u5l1", title: "Ayer", icon: "📅",
        tip: "Pasado regular: agrega -ed. \"work → worked\", \"study → studied\". ¡Es igual para todas las personas!",
        words: [["worked","trabajé"],["played","jugué"],["watched","vi (tele, película)"],["visited","visité"],["cooked","cociné"],["studied","estudié"]],
        sentences: [["I worked until six yesterday","Ayer trabajé hasta las seis"],["We watched a movie last night","Anoche vimos una película"],["She visited her grandmother","Ella visitó a su abuela"],["I studied English for an hour","Estudié inglés por una hora"]] },
      { id: "u5l2", title: "Verbos irregulares", icon: "🔀",
        tip: "Algunos verbos cambian completo en pasado: go → went, eat → ate, see → saw. ¡Hay que memorizarlos!",
        words: [["went","fui"],["ate","comí"],["saw","vi"],["bought","compré"],["had","tuve"],["made","hice"]],
        sentences: [["I went to the beach last summer","Fui a la playa el verano pasado"],["We ate pizza on Friday","Comimos pizza el viernes"],["I saw your sister at the mall","Vi a tu hermana en el mall"],["She bought a new phone","Ella compró un teléfono nuevo"]] },
      { id: "u5l3", title: "Mi fin de semana", icon: "🛋️",
        tip: "Para preguntar en pasado usa \"Did…?\" + verbo normal: \"Did you go?\". Para negar: \"I didn't go\".",
        words: [["last weekend","el fin de semana pasado"],["yesterday","ayer"],["ago","hace (tiempo)"],["relax","descansar"],["stay","quedarse"],["fun","divertido"]],
        sentences: [["Did you have a good weekend?","¿Tuviste un buen fin de semana?"],["I didn't go out on Saturday","No salí el sábado"],["We stayed at home and relaxed","Nos quedamos en casa y descansamos"],["I met my friends two days ago","Vi a mis amigos hace dos días"]] }
    ]
  },
  {
    unit: "Describir y comparar", level: "A2",
    lessons: [
      { id: "u6l1", title: "Personas", icon: "🧑‍🤝‍🧑",
        tip: "\"What is he like?\" pregunta por la personalidad. \"What does he look like?\" pregunta por el aspecto físico.",
        words: [["tall","alto"],["short","bajo"],["friendly","amable"],["funny","chistoso"],["shy","tímido"],["smart","inteligente"]],
        sentences: [["My brother is tall and funny","Mi hermano es alto y chistoso"],["She is very friendly","Ella es muy amable"],["I was shy when I was a child","Era tímida cuando era niña"],["What does he look like?","¿Cómo es él físicamente?"]] },
      { id: "u6l2", title: "Comparaciones", icon: "⚖️",
        tip: "Adjetivos cortos: + -er (cheap → cheaper). Largos: more + adjetivo (more expensive). Para comparar se usa \"than\".",
        words: [["bigger","más grande"],["cheaper","más barato"],["better","mejor"],["worse","peor"],["more expensive","más caro"],["than","que (al comparar)"]],
        sentences: [["My city is bigger than yours","Mi ciudad es más grande que la tuya"],["This phone is cheaper than that one","Este teléfono es más barato que ese"],["Coffee is better than tea","El café es mejor que el té"],["The red bag is more expensive","La cartera roja es más cara"]] },
      { id: "u6l3", title: "Lugares y clima", icon: "🌦️",
        tip: "Para el clima siempre se usa \"It\": \"It's cold\", \"It's raining\".",
        words: [["sunny","soleado"],["rainy","lluvioso"],["cold","frío"],["warm","templado"],["crowded","lleno de gente"],["quiet","tranquilo"]],
        sentences: [["It is sunny today","Hoy está soleado"],["The beach was very crowded","La playa estaba muy llena"],["It is colder in the south","Hace más frío en el sur"],["I prefer quiet places","Prefiero los lugares tranquilos"]] }
    ]
  },
  {
    unit: "Planes y futuro", level: "A2",
    lessons: [
      { id: "u4l3", title: "Mis planes", icon: "🚀",
        tip: "\"Going to\" + verbo = planes que ya decidiste: \"I'm going to study tonight\".",
        words: [["tomorrow","mañana"],["next week","la próxima semana"],["weekend","fin de semana"],["goal","meta"],["maybe","quizás"],["dream","sueño"]],
        sentences: [["I am going to study tonight","Voy a estudiar esta noche"],["What are your plans for the weekend?","¿Cuáles son tus planes para el fin de semana?"],["Maybe I will travel next year","Quizás viaje el próximo año"],["My goal is to speak English fluently","Mi meta es hablar inglés con fluidez"]] },
      { id: "u7l2", title: "Invitaciones", icon: "🎉",
        tip: "\"Would you like to…?\" es la forma más educada de invitar. Responde \"I'd love to!\" o \"Sorry, I can't\".",
        words: [["invite","invitar"],["party","fiesta"],["free","libre"],["busy","ocupado"],["sure","claro"],["join","acompañar"]],
        sentences: [["Would you like to come to my party?","¿Te gustaría venir a mi fiesta?"],["Are you free on Saturday?","¿Estás libre el sábado?"],["Sorry, I am busy tonight","Lo siento, estoy ocupada esta noche"],["Sure, I would love to join you","Claro, me encantaría acompañarte"]] },
      { id: "u7l3", title: "Citas y horarios", icon: "🗓️",
        tip: "\"at\" para horas (at 5), \"on\" para días (on Monday), \"in\" para meses (in May).",
        words: [["appointment","cita"],["early","temprano"],["late","tarde"],["birthday","cumpleaños"],["month","mes"],["half past","y media"]],
        sentences: [["I have an appointment at half past four","Tengo una cita a las cuatro y media"],["My birthday is in May","Mi cumpleaños es en mayo"],["Sorry, I am late","Perdón, llegué tarde"],["The class starts early on Monday","La clase empieza temprano el lunes"]] }
    ]
  },
  {
    unit: "Salud y bienestar", level: "A2",
    lessons: [
      { id: "u8l1", title: "El cuerpo", icon: "🫀",
        tip: "Para dolores: \"My ___ hurts\" o \"I have a ___ache\" (headache, stomachache).",
        words: [["head","cabeza"],["back","espalda"],["stomach","estómago"],["throat","garganta"],["arm","brazo"],["hurt","doler"]],
        sentences: [["My back hurts","Me duele la espalda"],["I have a sore throat","Me duele la garganta"],["She broke her arm","Ella se quebró el brazo"],["I have a stomachache","Tengo dolor de estómago"]] },
      { id: "u8l2", title: "En la farmacia", icon: "💊",
        tip: "\"Should\" sirve para dar consejos: \"You should rest\" = Deberías descansar.",
        words: [["medicine","medicamento"],["pill","pastilla"],["cough","tos"],["cold","resfriado"],["prescription","receta"],["feel better","sentirse mejor"]],
        sentences: [["I need something for a cough","Necesito algo para la tos"],["Take one pill every eight hours","Toma una pastilla cada ocho horas"],["Do I need a prescription?","¿Necesito receta?"],["You should rest and drink water","Deberías descansar y tomar agua"]] },
      { id: "u8l3", title: "Ejercicio", icon: "🏃‍♀️",
        tip: "Frecuencia: \"once a week\" (una vez), \"twice a week\" (dos veces), \"three times a week\".",
        words: [["gym","gimnasio"],["run","correr"],["stretch","elongar"],["healthy","saludable"],["strong","fuerte"],["twice a week","dos veces por semana"]],
        sentences: [["I go to the gym twice a week","Voy al gimnasio dos veces por semana"],["You should stretch before you run","Deberías elongar antes de correr"],["Eating vegetables is healthy","Comer verduras es saludable"],["I feel stronger every day","Me siento más fuerte cada día"]] }
    ]
  },
  {
    unit: "Trabajo y tecnología", level: "A2",
    lessons: [
      { id: "u4l1", title: "En el trabajo", icon: "💼",
        tip: "\"Could you…?\" es más educado que \"Can you…?\" para pedir algo en el trabajo.",
        words: [["meeting","reunión"],["deadline","fecha límite"],["boss","jefe"],["coworker","compañero de trabajo"],["skills","habilidades"],["hire","contratar"]],
        sentences: [["I have a meeting at ten","Tengo una reunión a las diez"],["The deadline is on Friday","La fecha límite es el viernes"],["I am good at solving problems","Soy buena resolviendo problemas"],["Could you send me the file?","¿Podrías enviarme el archivo?"]] },
      { id: "u4l2", title: "Emociones", icon: "😊",
        tip: "Con -ed dices cómo te sientes (I'm bored). Con -ing describes lo que lo causa (It's boring).",
        words: [["happy","feliz"],["tired","cansado"],["worried","preocupado"],["excited","emocionado"],["angry","enojado"],["proud","orgulloso"]],
        sentences: [["I am so tired today","Estoy muy cansada hoy"],["Don't worry about it","No te preocupes por eso"],["I am excited about the trip","Estoy emocionada por el viaje"],["I am proud of you","Estoy orgullosa de ti"]] },
      { id: "u9l3", title: "Tecnología", icon: "💻",
        tip: "Muchos verbos de tecnología llevan una partícula: \"log in\", \"sign up\", \"shut down\".",
        words: [["laptop","notebook"],["website","sitio web"],["download","descargar"],["screen","pantalla"],["battery","batería"],["update","actualizar"]],
        sentences: [["My laptop battery is low","La batería de mi notebook está baja"],["I need to update the app","Necesito actualizar la app"],["Can you send me the link to the website?","¿Me puedes enviar el link del sitio web?"],["The screen is too small","La pantalla es demasiado pequeña"]] }
    ]
  }
];

/* ============================================================
   DIÁLOGOS RAMIFICADOS
   Cada "nodo" es lo que dice el personaje.
   Opciones con "go" = respuestas válidas (llevan a otro nodo).
   Opciones con "fb" = respuestas incorrectas (muestran la explicación).
   Un nodo con "end: true" termina la conversación.
   ============================================================ */
const DIALOGS = [
  { id: "cafe", title: "En la cafetería", icon: "☕", level: "A1", desc: "Pide algo para beber como una local.", start: "a",
    nodes: {
      a: { npc: ["Hi! What can I get for you today?","¡Hola! ¿Qué te sirvo hoy?"], options: [
        { en: "Can I have a latte, please?", es: "¿Me das un latte, por favor?", go: "b" },
        { en: "Do you have any tea?", es: "¿Tienes té?", go: "c" },
        { en: "I am a latte.", es: "Soy un latte.", fb: "Dijiste \"Soy un latte\" 😄. Usa \"Can I have…?\" para pedir." } ] },
      b: { npc: ["Sure. What size would you like?","Claro. ¿De qué tamaño lo quieres?"], options: [
        { en: "A medium one, please.", es: "Uno mediano, por favor.", go: "d" },
        { en: "A large one, please.", es: "Uno grande, por favor.", go: "d" },
        { en: "I am twenty years old.", es: "Tengo veinte años.", fb: "Te preguntan el tamaño, no tu edad." } ] },
      c: { npc: ["Yes, we have green tea and black tea. Which one would you like?","Sí, tenemos té verde y té negro. ¿Cuál quieres?"], options: [
        { en: "Green tea, please.", es: "Té verde, por favor.", go: "d" },
        { en: "Black tea with milk, please.", es: "Té negro con leche, por favor.", go: "d" },
        { en: "Yes, I have a tea.", es: "Sí, tengo un té.", fb: "Te preguntan cuál quieres, no si tienes uno." } ] },
      d: { npc: ["Is that for here or to go?","¿Es para servir o para llevar?"], options: [
        { en: "For here, please.", es: "Para servir, por favor.", go: "e" },
        { en: "To go, please.", es: "Para llevar, por favor.", go: "f" },
        { en: "I go every day.", es: "Voy todos los días.", fb: "\"Voy todos los días\" no responde la pregunta." } ] },
      e: { npc: ["Great, have a seat. Would you like a muffin with that?","Genial, toma asiento. ¿Quieres un muffin con eso?"], options: [
        { en: "Yes, a chocolate muffin, please.", es: "Sí, un muffin de chocolate, por favor.", go: "end" },
        { en: "No, thanks. That's all.", es: "No, gracias. Eso es todo.", go: "end" },
        { en: "Yes, I like to sit.", es: "Sí, me gusta sentarme.", fb: "Te ofrecieron un muffin, no un asiento 😄" } ] },
      f: { npc: ["Okay. That will be four dollars. Cash or card?","Ok. Son cuatro dólares. ¿Efectivo o tarjeta?"], options: [
        { en: "Card, please.", es: "Tarjeta, por favor.", go: "end" },
        { en: "Cash. Here you go.", es: "Efectivo. Aquí tienes.", go: "end" },
        { en: "Four dollars is my name.", es: "Cuatro dólares es mi nombre.", fb: "¡Eso no tiene sentido! 😄 Elige cómo pagar." } ] },
      end: { npc: ["Thank you! Have a great day!","¡Gracias! ¡Que tengas un gran día!"], end: true }
    } },

  { id: "airport", title: "En el aeropuerto", icon: "✈️", level: "A1", desc: "Haz el check-in sin nervios.", start: "a",
    nodes: {
      a: { npc: ["Good morning. Can I see your passport, please?","Buenos días. ¿Puedo ver su pasaporte, por favor?"], options: [
        { en: "Of course, here it is.", es: "Por supuesto, aquí está.", go: "b" },
        { en: "Sure. Here is my passport and my ticket.", es: "Claro. Aquí está mi pasaporte y mi pasaje.", go: "b" },
        { en: "I like your passport.", es: "Me gusta tu pasaporte.", fb: "Dijiste \"Me gusta tu pasaporte\" 😄" } ] },
      b: { npc: ["Where are you flying to today?","¿A dónde vuela hoy?"], options: [
        { en: "I am flying to London.", es: "Vuelo a Londres.", go: "c" },
        { en: "I am going to New York for work.", es: "Voy a Nueva York por trabajo.", go: "c" },
        { en: "I flew yesterday.", es: "Volé ayer.", fb: "Te preguntan por hoy; \"flew\" es pasado." } ] },
      c: { npc: ["Do you have any bags to check?","¿Tiene maletas para despachar?"], options: [
        { en: "Yes, just one suitcase.", es: "Sí, solo una maleta.", go: "d" },
        { en: "No, only this carry-on bag.", es: "No, solo este equipaje de mano.", go: "e" },
        { en: "Yes, I check my phone.", es: "Sí, reviso mi teléfono.", fb: "Aquí \"check\" significa despachar equipaje." } ] },
      d: { npc: ["Please put it on the scale. Would you like a window or an aisle seat?","Póngala en la balanza, por favor. ¿Prefiere ventana o pasillo?"], options: [
        { en: "A window seat, please.", es: "Ventana, por favor.", go: "end" },
        { en: "An aisle seat, please.", es: "Pasillo, por favor.", go: "end" },
        { en: "I would like the scale.", es: "Quisiera la balanza.", fb: "Te preguntan qué asiento prefieres." } ] },
      e: { npc: ["Perfect. Would you like a window or an aisle seat?","Perfecto. ¿Prefiere ventana o pasillo?"], options: [
        { en: "A window seat, please.", es: "Ventana, por favor.", go: "end" },
        { en: "An aisle seat, please.", es: "Pasillo, por favor.", go: "end" },
        { en: "No, I don't like seats.", es: "No, no me gustan los asientos.", fb: "¡Vas a necesitar un asiento! 😄" } ] },
      end: { npc: ["Here is your boarding pass. Your gate is twelve. Have a nice flight!","Aquí está su tarjeta de embarque. Su puerta es la doce. ¡Buen vuelo!"], end: true }
    } },

  { id: "restaurant", title: "En el restaurante", icon: "🍝", level: "A2", desc: "Consigue mesa, pide y elige tu bebida.", start: "a",
    nodes: {
      a: { npc: ["Good evening. Do you have a reservation?","Buenas noches. ¿Tiene reserva?"], options: [
        { en: "Yes, a table for two under Ana.", es: "Sí, una mesa para dos a nombre de Ana.", go: "b" },
        { en: "No, we don't. Do you have a table for two?", es: "No. ¿Tiene una mesa para dos?", go: "c" },
        { en: "Yes, I reserve the food.", es: "Sí, reservo la comida.", fb: "Se reserva una mesa, no la comida." } ] },
      b: { npc: ["Perfect, follow me. Here is the menu. Are you ready to order?","Perfecto, sígame. Aquí está el menú. ¿Está lista para pedir?"], options: [
        { en: "Yes, I'd like the pasta, please.", es: "Sí, quisiera la pasta, por favor.", go: "d" },
        { en: "Not yet. Can we have a few more minutes?", es: "Todavía no. ¿Nos da unos minutos más?", go: "e" },
        { en: "I am ready to sleep.", es: "Estoy lista para dormir.", fb: "Dijiste \"lista para dormir\" 😴" } ] },
      c: { npc: ["Let me check… Yes, we have a table by the window. Is that okay?","Déjeme revisar… Sí, tenemos una mesa junto a la ventana. ¿Está bien?"], options: [
        { en: "That's perfect, thank you.", es: "Perfecto, gracias.", go: "e" },
        { en: "Sure, that's fine.", es: "Claro, está bien.", go: "e" },
        { en: "The window is red.", es: "La ventana es roja.", fb: "Te preguntan si la mesa te sirve." } ] },
      e: { npc: ["So, what would you like to eat?","Entonces, ¿qué le gustaría comer?"], options: [
        { en: "I'd like the chicken salad, please.", es: "Quisiera la ensalada de pollo, por favor.", go: "d" },
        { en: "What do you recommend?", es: "¿Qué me recomienda?", go: "f" },
        { en: "I eat every Tuesday.", es: "Como todos los martes.", fb: "Te preguntan qué quieres comer ahora." } ] },
      f: { npc: ["The salmon is very popular tonight.","El salmón es muy popular esta noche."], options: [
        { en: "Sounds good. I'll have the salmon.", es: "Suena bien. Voy a pedir el salmón.", go: "d" },
        { en: "Hmm, I think I'll have the pasta.", es: "Mmm, creo que pediré la pasta.", go: "d" },
        { en: "I am very popular too.", es: "Yo también soy muy popular.", fb: "😄 ¡Seguro! Pero elige tu plato." } ] },
      d: { npc: ["Great choice. Would you like something to drink?","Buena elección. ¿Le gustaría algo para beber?"], options: [
        { en: "Just water, please.", es: "Solo agua, por favor.", go: "end" },
        { en: "A glass of orange juice, please.", es: "Un vaso de jugo de naranja, por favor.", go: "end" },
        { en: "Yes, something.", es: "Sí, algo.", fb: "Demasiado vago: di qué bebida quieres." } ] },
      end: { npc: ["Perfect. Your food will be ready in fifteen minutes.","Perfecto. Su comida estará lista en quince minutos."], end: true }
    } },

  { id: "hotel", title: "En el hotel", icon: "🏨", level: "A2", desc: "Con reserva o sin reserva: consigue tu pieza.", start: "a",
    nodes: {
      a: { npc: ["Welcome to the Grand Hotel! How can I help you?","¡Bienvenida al Grand Hotel! ¿En qué la puedo ayudar?"], options: [
        { en: "Hi, I have a reservation for three nights.", es: "Hola, tengo una reserva por tres noches.", go: "b" },
        { en: "Hi, do you have a room for tonight?", es: "Hola, ¿tiene una habitación para esta noche?", go: "c" },
        { en: "Help me, I am a hotel.", es: "Ayúdame, soy un hotel.", fb: "Dijiste \"soy un hotel\" 😄" } ] },
      b: { npc: ["Great. Could I have your name, please?","Genial. ¿Me podría dar su nombre, por favor?"], options: [
        { en: "Sure, my name is Ana Pérez.", es: "Claro, mi nombre es Ana Pérez.", go: "d" },
        { en: "It's under Pérez.", es: "Está a nombre de Pérez.", go: "d" },
        { en: "I have your name.", es: "Tengo tu nombre.", fb: "Dijiste \"Tengo tu nombre\". Te piden el tuyo." } ] },
      c: { npc: ["Let me check… Yes, we have a double room. It's ninety dollars per night.","Déjeme revisar… Sí, tenemos una doble. Son noventa dólares por noche."], options: [
        { en: "Perfect, I'll take it.", es: "Perfecto, la tomo.", go: "d" },
        { en: "Is breakfast included?", es: "¿Incluye el desayuno?", go: "e" },
        { en: "Ninety is my favorite number.", es: "Noventa es mi número favorito.", fb: "😄 Responde si quieres la habitación." } ] },
      e: { npc: ["Yes, breakfast is included from seven to ten.","Sí, el desayuno está incluido de siete a diez."], options: [
        { en: "Great, I'll take the room.", es: "Genial, tomo la habitación.", go: "d" },
        { en: "Okay, thank you. I'll take it.", es: "Ok, gracias. La tomo.", go: "d" },
        { en: "I don't eat rooms.", es: "No como habitaciones.", fb: "😄 Eso no tiene sentido aquí." } ] },
      d: { npc: ["Here is your key. Your room is on the fifth floor. Do you need anything else?","Aquí está su llave. Su habitación está en el quinto piso. ¿Necesita algo más?"], options: [
        { en: "Where is the elevator?", es: "¿Dónde está el ascensor?", go: "end1" },
        { en: "What time is check-out?", es: "¿A qué hora es el check-out?", go: "end2" },
        { en: "The fifth floor is my friend.", es: "El quinto piso es mi amigo.", fb: "No tiene sentido 😄" } ] },
      end1: { npc: ["The elevator is on your right. Enjoy your stay!","El ascensor está a su derecha. ¡Disfrute su estadía!"], end: true },
      end2: { npc: ["Check-out is at eleven a.m. Enjoy your stay!","El check-out es a las once de la mañana. ¡Disfrute su estadía!"], end: true }
    } },

  { id: "interview", title: "Entrevista de trabajo", icon: "💼", level: "A2", desc: "Responde como profesional.", start: "a",
    nodes: {
      a: { npc: ["Hi, thanks for coming. Tell me a little about yourself.","Hola, gracias por venir. Cuéntame un poco sobre ti."], options: [
        { en: "I'm a web designer with three years of experience.", es: "Soy diseñadora web con tres años de experiencia.", go: "b" },
        { en: "I'm a programmer, and I love creating websites.", es: "Soy programadora y me encanta crear sitios web.", go: "b" },
        { en: "I am fine, thank you.", es: "Estoy bien, gracias.", fb: "Eso responde \"¿cómo estás?\", no \"háblame de ti\"." } ] },
      b: { npc: ["Interesting! Why do you want to work here?","¡Interesante! ¿Por qué quieres trabajar aquí?"], options: [
        { en: "I love your products and I want to grow with your team.", es: "Me encantan sus productos y quiero crecer con su equipo.", go: "c" },
        { en: "I want to learn new skills and work on big projects.", es: "Quiero aprender nuevas habilidades y trabajar en proyectos grandes.", go: "c" },
        { en: "Because here is a chair.", es: "Porque aquí hay una silla.", fb: "😄 Da una razón profesional." } ] },
      c: { npc: ["What is your biggest strength?","¿Cuál es tu mayor fortaleza?"], options: [
        { en: "I learn fast and I work well in a team.", es: "Aprendo rápido y trabajo bien en equipo.", go: "d" },
        { en: "I'm very creative and I pay attention to details.", es: "Soy muy creativa y pongo atención a los detalles.", go: "d" },
        { en: "My biggest strength is pizza.", es: "Mi mayor fortaleza es la pizza.", fb: "😄 Habla de una habilidad profesional." } ] },
      d: { npc: ["And what is one of your weaknesses?","¿Y cuál es una de tus debilidades?"], options: [
        { en: "Sometimes I'm a perfectionist, but I'm working on it.", es: "A veces soy perfeccionista, pero estoy trabajando en eso.", go: "e" },
        { en: "My English is not perfect yet, but I practice every day.", es: "Mi inglés aún no es perfecto, pero practico todos los días.", go: "e" },
        { en: "I don't have any weaknesses. I'm perfect.", es: "No tengo debilidades. Soy perfecta.", fb: "Suena arrogante. Menciona algo real y cómo lo mejoras." } ] },
      e: { npc: ["Great. Do you have any questions for us?","Muy bien. ¿Tienes alguna pregunta para nosotros?"], options: [
        { en: "Yes, what does a typical day look like here?", es: "Sí, ¿cómo es un día típico aquí?", go: "end" },
        { en: "Yes, when can I expect an answer?", es: "Sí, ¿cuándo puedo esperar una respuesta?", go: "end" },
        { en: "Yes, how old are you?", es: "Sí, ¿cuántos años tienes?", fb: "Pregunta personal inapropiada en una entrevista." } ] },
      end: { npc: ["Thank you for your time. We will contact you next week.","Gracias por tu tiempo. Te contactaremos la próxima semana."], end: true }
    } },

  { id: "doctor", title: "En el médico", icon: "🩺", level: "A2", desc: "Explica qué te pasa y entiende las indicaciones.", start: "a",
    nodes: {
      a: { npc: ["Hello, what seems to be the problem?","Hola, ¿cuál parece ser el problema?"], options: [
        { en: "I have a headache and a sore throat.", es: "Tengo dolor de cabeza y de garganta.", go: "b" },
        { en: "My stomach hurts a lot.", es: "Me duele mucho el estómago.", go: "c" },
        { en: "The problem is very happy.", es: "El problema está muy feliz.", fb: "No tiene sentido 😄" } ] },
      b: { npc: ["I see. Do you have a fever?","Ya veo. ¿Tienes fiebre?"], options: [
        { en: "Yes, a little. I feel hot.", es: "Sí, un poco. Me siento acalorada.", go: "d" },
        { en: "No, I don't think so.", es: "No, no creo.", go: "d" },
        { en: "Fever is my favorite.", es: "La fiebre es mi favorita.", fb: "¡Nadie diría eso! 😄" } ] },
      c: { npc: ["Did you eat anything unusual yesterday?","¿Comiste algo fuera de lo normal ayer?"], options: [
        { en: "Yes, I ate sushi from a new place.", es: "Sí, comí sushi de un lugar nuevo.", go: "d" },
        { en: "No, I ate the same as always.", es: "No, comí lo mismo de siempre.", go: "d" },
        { en: "Yesterday is Monday.", es: "Ayer es lunes.", fb: "Te preguntan qué comiste, no qué día fue." } ] },
      d: { npc: ["How long have you felt this way?","¿Hace cuánto te sientes así?"], options: [
        { en: "Since yesterday morning.", es: "Desde ayer en la mañana.", go: "e" },
        { en: "For about three days.", es: "Hace unos tres días.", go: "e" },
        { en: "About two meters.", es: "Como dos metros.", fb: "Te preguntan por tiempo, no por medida." } ] },
      e: { npc: ["Okay. Take this medicine twice a day and drink a lot of water.","Bien. Toma este medicamento dos veces al día y bebe mucha agua."], options: [
        { en: "Okay, thank you, doctor.", es: "Está bien, gracias, doctor.", go: "end1" },
        { en: "Should I come back next week?", es: "¿Debería volver la próxima semana?", go: "end2" },
        { en: "I take it twice a year.", es: "Lo tomo dos veces al año.", fb: "Dijo dos veces al DÍA, no al año." } ] },
      end1: { npc: ["You're welcome. Get well soon!","De nada. ¡Que te mejores pronto!"], end: true },
      end2: { npc: ["Only if you don't feel better. Get well soon!","Solo si no te sientes mejor. ¡Que te mejores!"], end: true }
    } },

  { id: "directions", title: "Pedir indicaciones", icon: "🧭", level: "A2", desc: "Encuentra la estación o la farmacia.", start: "a",
    nodes: {
      a: { npc: ["Hi! You look lost. Can I help you?","¡Hola! Pareces perdida. ¿Te puedo ayudar?"], options: [
        { en: "Yes, please. Where is the train station?", es: "Sí, por favor. ¿Dónde está la estación de tren?", go: "b" },
        { en: "Yes! Is there a pharmacy near here?", es: "¡Sí! ¿Hay una farmacia cerca de aquí?", go: "c" },
        { en: "No, I am a train.", es: "No, soy un tren.", fb: "Dijiste \"soy un tren\" 😄" } ] },
      b: { npc: ["Go straight for two blocks and turn left.","Sigue derecho dos cuadras y dobla a la izquierda."], options: [
        { en: "Is it far from here?", es: "¿Está lejos de aquí?", go: "d" },
        { en: "Sorry, could you repeat that, please?", es: "Perdón, ¿podrías repetir eso, por favor?", go: "e" },
        { en: "I am two blocks.", es: "Soy dos cuadras.", fb: "No tiene sentido. Pregunta algo o agradece." } ] },
      c: { npc: ["Yes, there's one on the corner, next to the bank.","Sí, hay una en la esquina, al lado del banco."], options: [
        { en: "Great! Is it open now?", es: "¡Genial! ¿Está abierta ahora?", go: "f" },
        { en: "Thank you so much!", es: "¡Muchas gracias!", go: "end1" },
        { en: "The bank is my friend.", es: "El banco es mi amigo.", fb: "😄 Mejor agradece o pregunta algo útil." } ] },
      d: { npc: ["No, it's about a five-minute walk.","No, está a unos cinco minutos caminando."], options: [
        { en: "Perfect, thank you so much!", es: "¡Perfecto, muchas gracias!", go: "end1" },
        { en: "Can I take a bus?", es: "¿Puedo tomar una micro?", go: "end2" },
        { en: "I walked five minutes yesterday.", es: "Caminé cinco minutos ayer.", fb: "No responde a lo que te dijeron." } ] },
      e: { npc: ["Sure. Go straight for two blocks, then turn left.","Claro. Sigue derecho dos cuadras y luego dobla a la izquierda."], options: [
        { en: "Got it. Thank you!", es: "Entendido. ¡Gracias!", go: "end1" },
        { en: "Thanks! Is it far?", es: "¡Gracias! ¿Está lejos?", go: "d" },
        { en: "Left is my favorite color.", es: "Izquierda es mi color favorito.", fb: "\"Left\" es una dirección, no un color 😄" } ] },
      f: { npc: ["Yes, it's open until ten p.m.","Sí, está abierta hasta las diez de la noche."], options: [
        { en: "Great, thanks for your help!", es: "¡Genial, gracias por tu ayuda!", go: "end1" },
        { en: "Thank you! Have a nice day.", es: "¡Gracias! Que tengas un lindo día.", go: "end1" },
        { en: "Ten p.m. is very tall.", es: "Las diez de la noche es muy alta.", fb: "Las horas no son altas 😄" } ] },
      end1: { npc: ["You're welcome! Good luck!","¡De nada! ¡Suerte!"], end: true },
      end2: { npc: ["Yes, bus twenty-one stops right there. Good luck!","Sí, la micro veintiuno para justo ahí. ¡Suerte!"], end: true }
    } },

  { id: "phone", title: "Llamada telefónica", icon: "📞", level: "A2", desc: "Pide una hora o deja un mensaje.", start: "a",
    nodes: {
      a: { npc: ["Hello, Bella Dental Clinic. How can I help you?","Hola, Clínica Dental Bella. ¿En qué la puedo ayudar?"], options: [
        { en: "Hi, I'd like to make an appointment, please.", es: "Hola, quisiera pedir una hora, por favor.", go: "b" },
        { en: "Hi, can I speak to Doctor Smith, please?", es: "Hola, ¿puedo hablar con la doctora Smith, por favor?", go: "c" },
        { en: "Hello, I am a dentist clinic.", es: "Hola, soy una clínica dental.", fb: "😄 La clínica son ellos. Di para qué llamas." } ] },
      b: { npc: ["Sure. What day is good for you?","Claro. ¿Qué día le acomoda?"], options: [
        { en: "Is Thursday afternoon possible?", es: "¿Es posible el jueves en la tarde?", go: "d" },
        { en: "Do you have anything on Monday morning?", es: "¿Tiene algo el lunes en la mañana?", go: "d" },
        { en: "Every day is a good day!", es: "¡Todos los días son buenos días!", fb: "Bonito, pero di un día concreto." } ] },
      c: { npc: ["I'm sorry, she's busy right now. Can I take a message?","Lo siento, está ocupada ahora. ¿Quiere dejar un mensaje?"], options: [
        { en: "Yes, please ask her to call me back.", es: "Sí, por favor pídale que me devuelva la llamada.", go: "e" },
        { en: "No, thanks. I'll call later.", es: "No, gracias. Llamo más tarde.", go: "end2" },
        { en: "Yes, take my phone.", es: "Sí, tome mi teléfono.", fb: "\"Take a message\" es tomar un recado, no tu teléfono." } ] },
      d: { npc: ["We have an opening at three p.m. Does that work for you?","Tenemos una hora a las tres. ¿Le sirve?"], options: [
        { en: "Yes, that works for me.", es: "Sí, me sirve.", go: "f" },
        { en: "Do you have anything later?", es: "¿Tiene algo más tarde?", go: "g" },
        { en: "I work at the dentist.", es: "Trabajo en el dentista.", fb: "\"Does that work for you?\" = ¿le sirve? No pregunta dónde trabajas." } ] },
      g: { npc: ["We also have five p.m.","También tenemos a las cinco."], options: [
        { en: "Perfect, five p.m. is great.", es: "Perfecto, las cinco está genial.", go: "f" },
        { en: "Okay, I'll take it.", es: "Ok, la tomo.", go: "f" },
        { en: "Five is a number.", es: "Cinco es un número.", fb: "Cierto 😄 pero confirma si te sirve." } ] },
      e: { npc: ["Of course. What's your phone number?","Por supuesto. ¿Cuál es su número de teléfono?"], options: [
        { en: "It's five five five, one two three four.", es: "Es cinco cinco cinco, uno dos tres cuatro.", go: "end3" },
        { en: "My number is nine eight seven, six five four.", es: "Mi número es nueve ocho siete, seis cinco cuatro.", go: "end3" },
        { en: "My phone is black.", es: "Mi teléfono es negro.", fb: "Te piden el número, no el color." } ] },
      f: { npc: ["Great. Can I have your name, please?","Muy bien. ¿Me da su nombre, por favor?"], options: [
        { en: "Sure, it's Ana Pérez.", es: "Claro, es Ana Pérez.", go: "end1" },
        { en: "My name is Ana. A, N, A.", es: "Mi nombre es Ana. A, N, A.", go: "end1" },
        { en: "Yes, you can have it.", es: "Sí, puede quedárselo.", fb: "😄 \"Can I have your name?\" significa \"¿me dice su nombre?\"." } ] },
      end1: { npc: ["Perfect, Ana. See you then. Goodbye!","Perfecto, Ana. Nos vemos. ¡Adiós!"], end: true },
      end2: { npc: ["No problem. Have a nice day. Goodbye!","No hay problema. Que tenga buen día. ¡Adiós!"], end: true },
      end3: { npc: ["Got it. She will call you back today. Goodbye!","Anotado. Ella la llamará hoy. ¡Adiós!"], end: true }
    } },

  { id: "meet", title: "Conocer a alguien", icon: "🤝", level: "A2", desc: "Haz conversación en una fiesta.", start: "a",
    nodes: {
      a: { npc: ["Hi! I don't think we've met. I'm Jake.","¡Hola! Creo que no nos conocemos. Soy Jake."], options: [
        { en: "Hi Jake, I'm Ana. Nice to meet you.", es: "Hola Jake, soy Ana. Encantada.", go: "b" },
        { en: "Hello! I'm Ana. How do you know the host?", es: "¡Hola! Soy Ana. ¿De dónde conoces al anfitrión?", go: "c" },
        { en: "Hi Jake, I'm fine.", es: "Hola Jake, estoy bien.", fb: "Jake se presentó: responde con tu nombre." } ] },
      b: { npc: ["Nice to meet you too! Where are you from?","¡Igualmente! ¿De dónde eres?"], options: [
        { en: "I'm from Chile. What about you?", es: "Soy de Chile. ¿Y tú?", go: "d" },
        { en: "I'm from Santiago, in Chile.", es: "Soy de Santiago, en Chile.", go: "e" },
        { en: "I'm from twenty-five.", es: "Soy de veinticinco.", fb: "Te preguntan de dónde eres, no tu edad." } ] },
      c: { npc: ["We work together. And you?","Trabajamos juntos. ¿Y tú?"], options: [
        { en: "We went to school together.", es: "Fuimos juntas al colegio.", go: "b" },
        { en: "She's my cousin.", es: "Es mi prima.", go: "b" },
        { en: "I work at a party.", es: "Trabajo en una fiesta.", fb: "Te preguntan de dónde conoces al anfitrión." } ] },
      d: { npc: ["I'm from Canada. Do you like living in Chile?","Soy de Canadá. ¿Te gusta vivir en Chile?"], options: [
        { en: "Yes, I love it. The food is amazing.", es: "Sí, me encanta. La comida es increíble.", go: "f" },
        { en: "Yes, but I'd like to travel more.", es: "Sí, pero me gustaría viajar más.", go: "f" },
        { en: "Yes, I live in Canada.", es: "Sí, vivo en Canadá.", fb: "Él vive en Canadá; tú cuéntale sobre Chile." } ] },
      e: { npc: ["Wow, I'd love to visit Chile someday! What do you do?","¡Wow, me encantaría visitar Chile algún día! ¿A qué te dedicas?"], options: [
        { en: "I'm a web designer.", es: "Soy diseñadora web.", go: "g" },
        { en: "I work as a programmer.", es: "Trabajo como programadora.", go: "g" },
        { en: "I do my homework.", es: "Hago mi tarea.", fb: "\"What do you do?\" pregunta por tu trabajo." } ] },
      f: { npc: ["Cool! So, what do you do?","¡Genial! Y ¿a qué te dedicas?"], options: [
        { en: "I'm a web designer.", es: "Soy diseñadora web.", go: "g" },
        { en: "I work as a programmer.", es: "Trabajo como programadora.", go: "g" },
        { en: "I do nothing right now.", es: "No hago nada ahora mismo.", fb: "\"What do you do?\" pregunta por tu trabajo, no por este momento." } ] },
      g: { npc: ["That sounds great! Would you like something to drink?","¡Suena genial! ¿Quieres algo para tomar?"], options: [
        { en: "Sure, I'd love some juice.", es: "Claro, me encantaría un jugo.", go: "end" },
        { en: "No, thanks. I'm okay for now.", es: "No, gracias. Por ahora estoy bien.", go: "end" },
        { en: "Yes, I drink programs.", es: "Sí, bebo programas.", fb: "😄 ¡Eso no se bebe!" } ] },
      end: { npc: ["It was great talking to you, Ana!","¡Fue genial conversar contigo, Ana!"], end: true }
    } },

  { id: "supermarket", title: "En el supermercado", icon: "🛒", level: "A2", desc: "Encuentra productos y paga en la caja.", start: "a",
    nodes: {
      a: { npc: ["Hi! Can I help you find something?","¡Hola! ¿Te ayudo a encontrar algo?"], options: [
        { en: "Yes, where can I find the eggs?", es: "Sí, ¿dónde encuentro los huevos?", go: "b" },
        { en: "Do you sell fresh bread?", es: "¿Venden pan fresco?", go: "c" },
        { en: "Yes, find me, please.", es: "Sí, encuéntrame, por favor.", fb: "😄 Di qué producto buscas." } ] },
      b: { npc: ["The eggs are in aisle four, next to the milk.","Los huevos están en el pasillo cuatro, al lado de la leche."], options: [
        { en: "Thanks! And where is the rice?", es: "¡Gracias! ¿Y dónde está el arroz?", go: "d" },
        { en: "Great, thank you!", es: "¡Genial, gracias!", go: "e" },
        { en: "I am in aisle four.", es: "Estoy en el pasillo cuatro.", fb: "No hace falta decir eso. Agradece o pregunta algo más." } ] },
      c: { npc: ["Yes, the bakery is at the back of the store.","Sí, la panadería está al fondo de la tienda."], options: [
        { en: "Perfect, thanks!", es: "¡Perfecto, gracias!", go: "e" },
        { en: "Thanks! And where is the rice?", es: "¡Gracias! ¿Y dónde está el arroz?", go: "d" },
        { en: "The bread is my back.", es: "El pan es mi espalda.", fb: "\"At the back\" = al fondo. ¡No es tu espalda! 😄" } ] },
      d: { npc: ["The rice is in aisle seven.","El arroz está en el pasillo siete."], options: [
        { en: "Thank you very much!", es: "¡Muchas gracias!", go: "e" },
        { en: "Got it, thanks!", es: "¡Entendido, gracias!", go: "e" },
        { en: "Seven is my rice.", es: "Siete es mi arroz.", fb: "No tiene sentido 😄" } ] },
      e: { npc: ["(At the checkout) Hi! Did you find everything you needed?","(En la caja) ¡Hola! ¿Encontraste todo lo que necesitabas?"], options: [
        { en: "Yes, thank you.", es: "Sí, gracias.", go: "f" },
        { en: "Almost. Do you have oat milk?", es: "Casi. ¿Tienen leche de avena?", go: "g" },
        { en: "Yes, I found a dog.", es: "Sí, encontré un perro.", fb: "😄 Te preguntan por tus compras." } ] },
      g: { npc: ["Sorry, we're out of oat milk today.","Lo siento, hoy no nos queda leche de avena."], options: [
        { en: "No problem. Maybe next time.", es: "No hay problema. Quizás la próxima vez.", go: "f" },
        { en: "Oh, okay. Thanks anyway.", es: "Ah, ok. Gracias de todas formas.", go: "f" },
        { en: "I am out too.", es: "Yo también estoy afuera.", fb: "\"We're out of…\" significa \"se nos acabó\"." } ] },
      f: { npc: ["Your total is twenty-three dollars. Do you need a bag?","El total es veintitrés dólares. ¿Necesitas bolsa?"], options: [
        { en: "Yes, please.", es: "Sí, por favor.", go: "end" },
        { en: "No, thanks. I have my own bag.", es: "No, gracias. Traigo mi propia bolsa.", go: "end" },
        { en: "Twenty-three is my age.", es: "Veintitrés es mi edad.", fb: "Te preguntan si necesitas bolsa." } ] },
      end: { npc: ["Here's your receipt. Have a nice day!","Aquí está tu boleta. ¡Que tengas un lindo día!"], end: true }
    } },

  { id: "meeting", title: "Reunión de trabajo", icon: "👩‍💻", level: "A2", desc: "Da un reporte sobre tu proyecto.", start: "a",
    nodes: {
      a: { npc: ["Good morning, everyone. Ana, can you give us an update on the website?","Buenos días a todos. Ana, ¿nos das una actualización del sitio web?"], options: [
        { en: "Sure. The design is almost finished.", es: "Claro. El diseño está casi terminado.", go: "b" },
        { en: "Yes. We had some problems, but we are fixing them.", es: "Sí. Tuvimos algunos problemas, pero los estamos arreglando.", go: "c" },
        { en: "Good morning, I am a website.", es: "Buenos días, soy un sitio web.", fb: "😄 Te piden un reporte del proyecto." } ] },
      b: { npc: ["Great news! When can we see it?","¡Buenas noticias! ¿Cuándo lo podemos ver?"], options: [
        { en: "I can show it to you on Friday.", es: "Se los puedo mostrar el viernes.", go: "d" },
        { en: "Maybe next Monday.", es: "Quizás el próximo lunes.", go: "d" },
        { en: "We saw it yesterday.", es: "Lo vimos ayer.", fb: "Te preguntan cuándo lo podrán ver (futuro)." } ] },
      c: { npc: ["What kind of problems?","¿Qué tipo de problemas?"], options: [
        { en: "The page loads too slowly on phones.", es: "La página carga muy lento en los celulares.", go: "e" },
        { en: "Some images are not working.", es: "Algunas imágenes no funcionan.", go: "e" },
        { en: "Big problems, very big.", es: "Problemas grandes, muy grandes.", fb: "Demasiado vago: explica cuál es el problema." } ] },
      e: { npc: ["I see. Do you need help with that?","Ya veo. ¿Necesitas ayuda con eso?"], options: [
        { en: "Yes, could Tom help me with the code?", es: "Sí, ¿Tom podría ayudarme con el código?", go: "d" },
        { en: "No, thanks. I think I can fix it this week.", es: "No, gracias. Creo que lo puedo arreglar esta semana.", go: "d" },
        { en: "Yes, help is a nice word.", es: "Sí, ayuda es una linda palabra.", fb: "😄 Responde si necesitas ayuda o no." } ] },
      d: { npc: ["Perfect. Any questions before we finish?","Perfecto. ¿Alguna pregunta antes de terminar?"], options: [
        { en: "Yes, what is the deadline for the project?", es: "Sí, ¿cuál es la fecha límite del proyecto?", go: "end1" },
        { en: "No, everything is clear. Thank you.", es: "No, todo está claro. Gracias.", go: "end2" },
        { en: "Yes, can I go home now?", es: "Sí, ¿me puedo ir a la casa?", fb: "😄 Mejor haz una pregunta sobre el proyecto." } ] },
      end1: { npc: ["The deadline is the end of the month. Thanks, everyone!","La fecha límite es fin de mes. ¡Gracias a todos!"], end: true },
      end2: { npc: ["Great. Thanks, everyone. See you tomorrow!","Muy bien. Gracias a todos. ¡Nos vemos mañana!"], end: true }
    } },

  { id: "gym", title: "En el gimnasio", icon: "🏋️‍♀️", level: "A2", desc: "Pide información o haz tu primer recorrido.", start: "a",
    nodes: {
      a: { npc: ["Hi! Welcome to FitZone. Are you a member?","¡Hola! Bienvenida a FitZone. ¿Eres socia?"], options: [
        { en: "Not yet. I'd like some information, please.", es: "Todavía no. Quisiera información, por favor.", go: "b" },
        { en: "Yes, but this is my first time here.", es: "Sí, pero es mi primera vez aquí.", go: "c" },
        { en: "Yes, I am a gym.", es: "Sí, soy un gimnasio.", fb: "Dijiste \"soy un gimnasio\" 😄" } ] },
      b: { npc: ["Sure! A monthly membership is thirty dollars.","¡Claro! La membresía mensual cuesta treinta dólares."], options: [
        { en: "Does that include classes?", es: "¿Eso incluye clases?", go: "d" },
        { en: "Can I try it for free first?", es: "¿Puedo probar gratis primero?", go: "e" },
        { en: "Thirty is too old.", es: "Treinta es muy viejo.", fb: "Hablan del precio, no de una edad 😄" } ] },
      c: { npc: ["Welcome! Do you want me to show you around?","¡Bienvenida! ¿Quieres que te muestre el lugar?"], options: [
        { en: "Yes, please. That would be great.", es: "Sí, por favor. Sería genial.", go: "f" },
        { en: "No, thanks. I just want to use the treadmill.", es: "No, gracias. Solo quiero usar la trotadora.", go: "end1" },
        { en: "Show me your house.", es: "Muéstrame tu casa.", fb: "\"Show you around\" = mostrarte el gimnasio." } ] },
      d: { npc: ["Yes! Yoga and spinning classes are included.","¡Sí! Las clases de yoga y spinning están incluidas."], options: [
        { en: "Perfect, I'd like to sign up.", es: "Perfecto, quiero inscribirme.", go: "end2" },
        { en: "Great. What time is the yoga class?", es: "Genial. ¿A qué hora es la clase de yoga?", go: "g" },
        { en: "I include yoga in my bag.", es: "Incluyo yoga en mi bolso.", fb: "No tiene sentido 😄" } ] },
      e: { npc: ["Of course. You can have a free day pass today.","Por supuesto. Puedes tener un pase gratis por hoy."], options: [
        { en: "Awesome, thank you!", es: "¡Genial, gracias!", go: "f" },
        { en: "Great! Can you show me around?", es: "¡Genial! ¿Me muestras el lugar?", go: "f" },
        { en: "I pass every day.", es: "Paso todos los días.", fb: "\"Day pass\" = pase por un día." } ] },
      f: { npc: ["This is the weights area, and the locker rooms are over there.","Esta es la zona de pesas, y los camarines están por allá."], options: [
        { en: "Thanks! Where can I get water?", es: "¡Gracias! ¿Dónde puedo conseguir agua?", go: "end3" },
        { en: "Cool. Do I need a towel?", es: "Bacán. ¿Necesito toalla?", go: "end4" },
        { en: "The weights are my friends.", es: "Las pesas son mis amigas.", fb: "😄 Mejor haz una pregunta útil." } ] },
      g: { npc: ["It's at seven p.m., Monday to Friday.","Es a las siete de la tarde, de lunes a viernes."], options: [
        { en: "Perfect, sign me up!", es: "¡Perfecto, inscríbeme!", go: "end2" },
        { en: "Great, I'll come tomorrow.", es: "Genial, vengo mañana.", go: "end2" },
        { en: "Seven is my yoga.", es: "Siete es mi yoga.", fb: "No tiene sentido 😄" } ] },
      end1: { npc: ["Sure! The treadmills are on the left. Have a great workout!","¡Claro! Las trotadoras están a la izquierda. ¡Buen entrenamiento!"], end: true },
      end2: { npc: ["Awesome! Welcome to FitZone!","¡Genial! ¡Bienvenida a FitZone!"], end: true },
      end3: { npc: ["There's water next to the reception. Have a great workout!","Hay agua al lado de la recepción. ¡Buen entrenamiento!"], end: true },
      end4: { npc: ["Yes, you can get one at the reception. Have a great workout!","Sí, puedes pedir una en recepción. ¡Buen entrenamiento!"], end: true }
    } }
];

/* ============================================================
   PRONUNCIACIÓN
   ============================================================ */
const PRON = [
  { title: "Sonido TH", icon: "👅", tip: "Pon la punta de la lengua entre los dientes y sopla suave.",
    phrases: ["Think about three things","This is the third Thursday","They thought the weather was nice","Thank you for everything"] },
  { title: "V y B", icon: "🫦", tip: "En la V, los dientes de arriba tocan el labio de abajo. La B se hace con los dos labios.",
    phrases: ["Very good vegetables","I have a big black van","Victor loves his violin","The boat is very beautiful"] },
  { title: "I corta vs EE larga", icon: "🔤", tip: "\"ship\" es corta y relajada; \"sheep\" es larga y con sonrisa.",
    phrases: ["This ship is cheap","Please sit in this seat","I live here, please leave","Is it his key?"] },
  { title: "R inglesa", icon: "🌀", tip: "La R inglesa no vibra: curva la lengua hacia atrás sin tocar el paladar.",
    phrases: ["Red roses are really romantic","The rain in the morning","Rachel reads every Friday","I really like rice"] },
  { title: "Pasado con -ED", icon: "⏪", tip: "Después de T o D suena \"id\" (wanted). Después de P, K, SH, CH suena \"t\" (worked). En los demás, \"d\" (played).",
    phrases: ["I worked and walked all day","She wanted to visit Rome","We played and danced","They watched a movie"] },
  { title: "H aspirada", icon: "💨", tip: "La H inglesa suena como una J muy suave, como cuando echas vaho a un vidrio.",
    phrases: ["Happy holidays to you","He has a huge house","How are you, Helen?","I hope Henry is home"] },
  { title: "SH y CH", icon: "🤫", tip: "SH es suave y continuo, como \"shhh\". CH es corto, como en \"Chile\".",
    phrases: ["She chose a cheap shirt","Check the shop on the corner","Watch the show with me","Shake hands with the chef"] },
  { title: "Frases útiles", icon: "⭐", tip: "Frases que usarás todos los días.",
    phrases: ["Could you repeat that, please?","I would like a cup of coffee","Excuse me, where is the bathroom?","Can you speak more slowly?"] },
  { title: "Trabalenguas", icon: "🎯", tip: "Empieza lento y ve subiendo la velocidad.",
    phrases: ["She sells seashells by the seashore","Red lorry, yellow lorry","Peter Piper picked a peck of pickled peppers","How can a clam cram in a clean cream can?"] }
];
