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
        tip: "\"How are you?\" (¿Cómo estás?) casi siempre se responde corto: \"I'm fine, thanks\" (Bien, gracias) o \"Good, and you?\" (Bien, ¿y tú?).",
        words: [["hello","hola"],["goodbye","adiós"],["good morning","buenos días"],["good night","buenas noches"],["thank you","gracias"],["please","por favor"],["good afternoon","buenas tardes"],["see you later","nos vemos"],["welcome","bienvenido"],["excuse me","disculpe"]],
        sentences: [["Hello, how are you?","Hola, ¿cómo estás?"],["I am fine, thank you","Estoy bien, gracias"],["Nice to meet you","Encantada de conocerte"],["See you tomorrow","Nos vemos mañana"],["Good afternoon, nice to see you","Buenas tardes, qué gusto verte"],["Excuse me, what is your name?","Disculpe, ¿cuál es su nombre?"]] },
      { id: "u1l2", title: "Preséntate", icon: "🙋",
        tip: "\"I am\" (yo soy / yo estoy) se acorta a \"I'm\". Para decir de dónde eres usa \"I'm from…\" (Soy de…).",
        words: [["name","nombre"],["country","país"],["city","ciudad"],["friend","amigo"],["student","estudiante"],["job","trabajo"],["age","edad"],["married","casada"],["teacher","profesor"],["live","vivir"]],
        sentences: [["My name is Ana","Mi nombre es Ana"],["I am from Chile","Soy de Chile"],["I live in a big city","Vivo en una ciudad grande"],["What do you do?","¿A qué te dedicas?"],["I am thirty years old","Tengo treinta años"],["I work as a designer","Trabajo como diseñadora"]] },
      { id: "u1l3", title: "Números y colores", icon: "🎨",
        tip: "En inglés el color va ANTES del sustantivo: \"a red car\" = un auto rojo.",
        words: [["one","uno"],["two","dos"],["ten","diez"],["red","rojo"],["blue","azul"],["green","verde"],["three","tres"],["twenty","veinte"],["black","negro"],["white","blanco"]],
        sentences: [["I have two cats","Tengo dos gatos"],["My car is red","Mi auto es rojo"],["The sky is blue","El cielo es azul"],["How old are you?","¿Cuántos años tienes?"],["I have a white car","Tengo un auto blanco"],["There are twenty students in my class","Hay veinte estudiantes en mi clase"]] }
    ]
  },
  {
    unit: "Repaso A1 · Día a día", level: "A1",
    lessons: [
      { id: "u2l1", title: "Rutina", icon: "⏰",
        tip: "Con he/she/it (él/ella/eso) el verbo lleva -s: \"She works\" (Ella trabaja), \"He wakes up\" (Él se despierta).",
        words: [["wake up","despertar"],["breakfast","desayuno"],["work","trabajar"],["shower","ducha"],["always","siempre"],["sometimes","a veces"],["lunch","almuerzo"],["dinner","cena"],["usually","normalmente"],["never","nunca"]],
        sentences: [["I wake up at seven","Me despierto a las siete"],["I always eat breakfast","Siempre tomo desayuno"],["She works from home","Ella trabaja desde casa"],["We sometimes go to the gym","A veces vamos al gimnasio"],["I usually have lunch at one","Normalmente almuerzo a la una"],["He never drinks coffee at night","Él nunca toma café en la noche"]] },
      { id: "u2l2", title: "Comida", icon: "🍎",
        tip: "Para pedir con educación usa \"Can I have…?\" (¿Me da…?) o \"I'd like…\" (Quisiera…).",
        words: [["water","agua"],["bread","pan"],["chicken","pollo"],["apple","manzana"],["coffee","café"],["hungry","con hambre"],["rice","arroz"],["cheese","queso"],["juice","jugo"],["thirsty","con sed"]],
        sentences: [["I am very hungry","Tengo mucha hambre"],["Can I have some water?","¿Me das un poco de agua?"],["I don't like coffee","No me gusta el café"],["This chicken is delicious","Este pollo está delicioso"],["I would like an orange juice","Quisiera un jugo de naranja"],["We eat rice with chicken","Comemos arroz con pollo"]] },
      { id: "u2l3", title: "La casa", icon: "🏠",
        tip: "\"There is\" (singular) y \"There are\" (plural) significan \"hay\".",
        words: [["kitchen","cocina"],["bedroom","dormitorio"],["bathroom","baño"],["window","ventana"],["door","puerta"],["table","mesa"],["living room","living, sala de estar"],["stairs","escaleras"],["garden","jardín"],["chair","silla"]],
        sentences: [["The kitchen is small","La cocina es pequeña"],["Please close the door","Por favor cierra la puerta"],["There are two windows in my bedroom","Hay dos ventanas en mi dormitorio"],["The keys are on the table","Las llaves están en la mesa"],["The garden is behind the house","El jardín está detrás de la casa"],["Is there a bathroom upstairs?","¿Hay un baño arriba?"]] }
    ]
  },
  {
    unit: "Fuera de casa", level: "A2",
    lessons: [
      { id: "u3l1", title: "La ciudad", icon: "🗺️",
        tip: "Para dar indicaciones: \"turn left/right\" (dobla), \"go straight\" (sigue derecho), \"next to\" (al lado de).",
        words: [["street","calle"],["left","izquierda"],["right","derecha"],["near","cerca"],["far","lejos"],["corner","esquina"],["bank","banco"],["park","parque"],["straight","derecho"],["block","cuadra"]],
        sentences: [["Turn left at the corner","Dobla a la izquierda en la esquina"],["Is it far from here?","¿Está lejos de aquí?"],["The bank is next to the park","El banco está al lado del parque"],["Go straight ahead","Sigue derecho"],["Walk two blocks and turn right","Camina dos cuadras y dobla a la derecha"],["The museum is near the station","El museo está cerca de la estación"]] },
      { id: "u3l2", title: "De compras", icon: "🛍️",
        tip: "\"How much is…?\" (¿Cuánto cuesta…?) para una cosa; \"How much are…?\" (¿Cuánto cuestan…?) para varias.",
        words: [["price","precio"],["cheap","barato"],["expensive","caro"],["size","talla"],["cash","efectivo"],["receipt","boleta"],["discount","descuento"],["card","tarjeta"],["try on","probarse"],["change","vuelto"]],
        sentences: [["How much is this?","¿Cuánto cuesta esto?"],["It is too expensive","Es demasiado caro"],["Do you have a smaller size?","¿Tiene una talla más pequeña?"],["Can I pay by card?","¿Puedo pagar con tarjeta?"],["Can I try on this jacket?","¿Me puedo probar esta chaqueta?"],["Is there a discount today?","¿Hay descuento hoy?"]] },
      { id: "u3l3", title: "De viaje", icon: "✈️",
        tip: "\"Check in\" = registrarse. \"Board\" = abordar el avión.",
        words: [["flight","vuelo"],["luggage","equipaje"],["passport","pasaporte"],["ticket","pasaje"],["gate","puerta de embarque"],["delayed","retrasado"],["suitcase","maleta"],["seat","asiento"],["airport","aeropuerto"],["boarding pass","tarjeta de embarque"]],
        sentences: [["My flight is delayed","Mi vuelo está retrasado"],["Where is gate five?","¿Dónde está la puerta cinco?"],["I need to check my luggage","Necesito despachar mi equipaje"],["Here is my passport","Aquí está mi pasaporte"],["I would like a window seat","Quisiera un asiento de ventana"],["The airport is far from the city","El aeropuerto está lejos de la ciudad"]] }
    ]
  },
  {
    unit: "Lo que pasó (pasado)", level: "A2",
    lessons: [
      { id: "u5l1", title: "Ayer", icon: "📅",
        tip: "Pasado regular: agrega -ed. \"work → worked\" (trabajar → trabajé), \"study → studied\" (estudiar → estudié). ¡Es igual para todas las personas!",
        words: [["worked","trabajé"],["played","jugué"],["watched","vi (tele, película)"],["visited","visité"],["cooked","cociné"],["studied","estudié"],["walked","caminé"],["called","llamé"],["cleaned","limpié"],["listened","escuché"]],
        sentences: [["I worked until six yesterday","Ayer trabajé hasta las seis"],["We watched a movie last night","Anoche vimos una película"],["She visited her grandmother","Ella visitó a su abuela"],["I studied English for an hour","Estudié inglés por una hora"],["I called my mother last night","Anoche llamé a mi mamá"],["We walked in the park on Sunday","Caminamos en el parque el domingo"]] },
      { id: "u5l2", title: "Verbos irregulares", icon: "🔀",
        tip: "Algunos verbos cambian completo en pasado: go → went (ir → fui), eat → ate (comer → comí), see → saw (ver → vi). ¡Hay que memorizarlos!",
        words: [["went","fui"],["ate","comí"],["saw","vi"],["bought","compré"],["had","tuve"],["made","hice"],["took","tomé"],["came","vine"],["wrote","escribí"],["slept","dormí"]],
        sentences: [["I went to the beach last summer","Fui a la playa el verano pasado"],["We ate pizza on Friday","Comimos pizza el viernes"],["I saw your sister at the mall","Vi a tu hermana en el mall"],["She bought a new phone","Ella compró un teléfono nuevo"],["I slept eight hours last night","Anoche dormí ocho horas"],["She came to my house yesterday","Ella vino a mi casa ayer"]] },
      { id: "u5l3", title: "Mi fin de semana", icon: "🛋️",
        tip: "Para preguntar en pasado usa \"Did…?\" + verbo normal: \"Did you go?\" (¿Fuiste?). Para negar: \"I didn't go\" (No fui).",
        words: [["last weekend","el fin de semana pasado"],["yesterday","ayer"],["ago","hace (tiempo)"],["relax","descansar"],["stay","quedarse"],["fun","divertido"],["Saturday","sábado"],["Sunday","domingo"],["went out","salí"],["met","me junté con"]],
        sentences: [["Did you have a good weekend?","¿Tuviste un buen fin de semana?"],["I didn't go out on Saturday","No salí el sábado"],["We stayed at home and relaxed","Nos quedamos en casa y descansamos"],["I met my friends two days ago","Vi a mis amigos hace dos días"],["What did you do on Sunday?","¿Qué hiciste el domingo?"],["We had dinner with my family","Cenamos con mi familia"]] }
    ]
  },
  {
    unit: "Describir y comparar", level: "A2",
    lessons: [
      { id: "u6l1", title: "Personas", icon: "🧑‍🤝‍🧑",
        tip: "\"What is he like?\" pregunta por la personalidad. \"What does he look like?\" pregunta por el aspecto físico.",
        words: [["tall","alto"],["short","bajo"],["friendly","amable"],["funny","chistoso"],["shy","tímido"],["smart","inteligente"],["kind","amable"],["lazy","flojo"],["young","joven"],["old","mayor, viejo"]],
        sentences: [["My brother is tall and funny","Mi hermano es alto y chistoso"],["She is very friendly","Ella es muy amable"],["I was shy when I was a child","Era tímida cuando era niña"],["What does he look like?","¿Cómo es él físicamente?"],["My grandmother is very kind","Mi abuela es muy amable"],["He has short black hair","Él tiene el pelo negro y corto"]] },
      { id: "u6l2", title: "Comparaciones", icon: "⚖️",
        tip: "Adjetivos cortos: + -er (cheap → cheaper: barato → más barato). Largos: more + adjetivo (more expensive: más caro). Para comparar se usa \"than\" (que).",
        words: [["bigger","más grande"],["cheaper","más barato"],["better","mejor"],["worse","peor"],["more expensive","más caro"],["than","que (al comparar)"],["smaller","más pequeño"],["faster","más rápido"],["the best","el mejor"],["the biggest","el más grande"]],
        sentences: [["My city is bigger than yours","Mi ciudad es más grande que la tuya"],["This phone is cheaper than that one","Este teléfono es más barato que ese"],["Coffee is better than tea","El café es mejor que el té"],["The red bag is more expensive","La cartera roja es más cara"],["This is the best restaurant in the city","Este es el mejor restaurante de la ciudad"],["My sister is as tall as me","Mi hermana es tan alta como yo"]] },
      { id: "u6l3", title: "Lugares y clima", icon: "🌦️",
        tip: "Para el clima siempre se usa \"It\": \"It's cold\" (Hace frío), \"It's raining\" (Está lloviendo).",
        words: [["sunny","soleado"],["rainy","lluvioso"],["cold","frío"],["warm","templado"],["crowded","lleno de gente"],["quiet","tranquilo"],["windy","ventoso"],["snow","nieve"],["hot","caluroso"],["beach","playa"]],
        sentences: [["It is sunny today","Hoy está soleado"],["The beach was very crowded","La playa estaba muy llena"],["It is colder in the south","Hace más frío en el sur"],["I prefer quiet places","Prefiero los lugares tranquilos"],["It is very windy today","Hoy hay mucho viento"],["It snows in the mountains in winter","Nieva en la cordillera en invierno"]] }
    ]
  },
  {
    unit: "Planes y futuro", level: "A2",
    lessons: [
      { id: "u4l3", title: "Mis planes", icon: "🚀",
        tip: "\"Going to\" + verbo = planes que ya decidiste: \"I'm going to study tonight\" (Voy a estudiar esta noche).",
        words: [["tomorrow","mañana"],["next week","la próxima semana"],["weekend","fin de semana"],["goal","meta"],["maybe","quizás"],["dream","sueño"],["tonight","esta noche"],["next year","el próximo año"],["travel","viajar"],["plan","plan"]],
        sentences: [["I am going to study tonight","Voy a estudiar esta noche"],["What are your plans for the weekend?","¿Cuáles son tus planes para el fin de semana?"],["Maybe I will travel next year","Quizás viaje el próximo año"],["My goal is to speak English fluently","Mi meta es hablar inglés con fluidez"],["We are going to travel to Peru next year","Vamos a viajar a Perú el próximo año"],["I am going to cook tonight","Voy a cocinar esta noche"]] },
      { id: "u7l2", title: "Invitaciones", icon: "🎉",
        tip: "\"Would you like to…?\" (¿Te gustaría…?) es la forma más educada de invitar. Responde \"I'd love to!\" (¡Me encantaría!) o \"Sorry, I can't\" (Lo siento, no puedo).",
        words: [["invite","invitar"],["party","fiesta"],["free","libre"],["busy","ocupado"],["sure","claro"],["join","acompañar"],["concert","concierto"],["movie","película"],["maybe next time","quizás la próxima vez"],["accept","aceptar"]],
        sentences: [["Would you like to come to my party?","¿Te gustaría venir a mi fiesta?"],["Are you free on Saturday?","¿Estás libre el sábado?"],["Sorry, I am busy tonight","Lo siento, estoy ocupada esta noche"],["Sure, I would love to join you","Claro, me encantaría acompañarte"],["Would you like to have dinner with us?","¿Te gustaría cenar con nosotros?"],["Maybe next time, thank you","Quizás la próxima vez, gracias"]] },
      { id: "u7l3", title: "Citas y horarios", icon: "🗓️",
        tip: "\"at\" para horas (at 5: a las 5), \"on\" para días (on Monday: el lunes), \"in\" para meses (in May: en mayo).",
        words: [["appointment","cita"],["early","temprano"],["late","tarde"],["birthday","cumpleaños"],["month","mes"],["half past","y media"],["o'clock","en punto"],["quarter past","y cuarto"],["weekday","día de semana"],["schedule","horario"]],
        sentences: [["I have an appointment at half past four","Tengo una cita a las cuatro y media"],["My birthday is in May","Mi cumpleaños es en mayo"],["Sorry, I am late","Perdón, llegué tarde"],["The class starts early on Monday","La clase empieza temprano el lunes"],["The meeting is at three o'clock","La reunión es a las tres en punto"],["What is your schedule on Friday?","¿Cuál es tu horario el viernes?"]] }
    ]
  },
  {
    unit: "Salud y bienestar", level: "A2",
    lessons: [
      { id: "u8l1", title: "El cuerpo", icon: "🫀",
        tip: "Para dolores: \"My ___ hurts\" (Me duele el/la ___) o \"I have a ___ache\" (Tengo dolor de ___): headache (dolor de cabeza), stomachache (dolor de estómago).",
        words: [["head","cabeza"],["back","espalda"],["stomach","estómago"],["throat","garganta"],["arm","brazo"],["hurt","doler"],["leg","pierna"],["hand","mano"],["tooth","diente, muela"],["sore","adolorido"]],
        sentences: [["My back hurts","Me duele la espalda"],["I have a sore throat","Me duele la garganta"],["She broke her arm","Ella se quebró el brazo"],["I have a stomachache","Tengo dolor de estómago"],["I have a toothache","Tengo dolor de muelas"],["My legs hurt after the gym","Me duelen las piernas después del gimnasio"]] },
      { id: "u8l2", title: "En la farmacia", icon: "💊",
        tip: "\"Should\" sirve para dar consejos: \"You should rest\" = Deberías descansar.",
        words: [["medicine","medicamento"],["pill","pastilla"],["cough","tos"],["cold","resfriado"],["prescription","receta"],["feel better","sentirse mejor"],["headache","dolor de cabeza"],["fever","fiebre"],["allergy","alergia"],["rest","descansar"]],
        sentences: [["I need something for a cough","Necesito algo para la tos"],["Take one pill every eight hours","Toma una pastilla cada ocho horas"],["Do I need a prescription?","¿Necesito receta?"],["You should rest and drink water","Deberías descansar y tomar agua"],["Do you have something for a headache?","¿Tiene algo para el dolor de cabeza?"],["I have a fever and a cough","Tengo fiebre y tos"]] },
      { id: "u8l3", title: "Ejercicio", icon: "🏃‍♀️",
        tip: "Frecuencia: \"once a week\" (una vez), \"twice a week\" (dos veces), \"three times a week\".",
        words: [["gym","gimnasio"],["run","correr"],["stretch","elongar"],["healthy","saludable"],["strong","fuerte"],["twice a week","dos veces por semana"],["swim","nadar"],["walk","caminar"],["once a week","una vez por semana"],["stay in shape","mantenerse en forma"]],
        sentences: [["I go to the gym twice a week","Voy al gimnasio dos veces por semana"],["You should stretch before you run","Deberías elongar antes de correr"],["Eating vegetables is healthy","Comer verduras es saludable"],["I feel stronger every day","Me siento más fuerte cada día"],["I swim once a week","Nado una vez por semana"],["I walk thirty minutes every day","Camino treinta minutos todos los días"]] }
    ]
  },
  {
    unit: "Trabajo y tecnología", level: "A2",
    lessons: [
      { id: "u4l1", title: "En el trabajo", icon: "💼",
        tip: "\"Could you…?\" (¿Podrías…?) es más educado que \"Can you…?\" (¿Puedes…?) para pedir algo en el trabajo.",
        words: [["meeting","reunión"],["deadline","fecha límite"],["boss","jefe"],["coworker","compañero de trabajo"],["skills","habilidades"],["hire","contratar"],["office","oficina"],["email","correo"],["project","proyecto"],["salary","sueldo"]],
        sentences: [["I have a meeting at ten","Tengo una reunión a las diez"],["The deadline is on Friday","La fecha límite es el viernes"],["I am good at solving problems","Soy buena resolviendo problemas"],["Could you send me the file?","¿Podrías enviarme el archivo?"],["I work in an office downtown","Trabajo en una oficina en el centro"],["I sent you an email this morning","Te envié un correo esta mañana"]] },
      { id: "u4l2", title: "Emociones", icon: "😊",
        tip: "Con -ed dices cómo te sientes: \"I'm bored\" (Estoy aburrida). Con -ing describes lo que lo causa: \"It's boring\" (Es aburrido).",
        words: [["happy","feliz"],["tired","cansado"],["worried","preocupado"],["excited","emocionado"],["angry","enojado"],["proud","orgulloso"],["sad","triste"],["bored","aburrido"],["nervous","nervioso"],["scared","asustado"]],
        sentences: [["I am so tired today","Estoy muy cansada hoy"],["Don't worry about it","No te preocupes por eso"],["I am excited about the trip","Estoy emocionada por el viaje"],["I am proud of you","Estoy orgullosa de ti"],["I feel nervous before an exam","Me siento nerviosa antes de un examen"],["Why are you sad?","¿Por qué estás triste?"]] },
      { id: "u9l3", title: "Tecnología", icon: "💻",
        tip: "Muchos verbos de tecnología llevan una partícula: \"log in\" (iniciar sesión), \"sign up\" (registrarse), \"shut down\" (apagar).",
        words: [["laptop","notebook"],["website","sitio web"],["download","descargar"],["screen","pantalla"],["battery","batería"],["update","actualizar"],["password","contraseña"],["log in","iniciar sesión"],["charger","cargador"],["app","app, aplicación"]],
        sentences: [["My laptop battery is low","La batería de mi notebook está baja"],["I need to update the app","Necesito actualizar la app"],["Can you send me the link to the website?","¿Me puedes enviar el link del sitio web?"],["The screen is too small","La pantalla es demasiado pequeña"],["I forgot my password","Se me olvidó la contraseña"],["Can I borrow your charger?","¿Me prestas tu cargador?"]] }
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
        { en: "Yes, a chocolate muffin, please.", es: "Sí, un muffin de chocolate, por favor.", go: "end2" },
        { en: "No, thanks. That's all.", es: "No, gracias. Eso es todo.", go: "end" },
        { en: "Yes, I like to sit.", es: "Sí, me gusta sentarme.", fb: "Te ofrecieron un muffin, no un asiento 😄" } ] },
      f: { npc: ["Okay. That will be four dollars. Cash or card?","Ok. Son cuatro dólares. ¿Efectivo o tarjeta?"], options: [
        { en: "Card, please.", es: "Tarjeta, por favor.", go: "end3" },
        { en: "Cash. Here you go.", es: "Efectivo. Aquí tienes.", go: "end4" },
        { en: "Four dollars is my name.", es: "Cuatro dólares es mi nombre.", fb: "¡Eso no tiene sentido! 😄 Elige cómo pagar." } ] },
      end: { npc: ["Thank you! Have a great day!","¡Gracias! ¡Que tengas un gran día!"], end: true },
      end2: { npc: ["Here's your drink and your chocolate muffin. Enjoy!","Aquí está tu bebida y tu muffin de chocolate. ¡Que lo disfrutes!"], end: true },
      end3: { npc: ["Please tap your card here. Thank you, have a great day!","Por favor acerca tu tarjeta aquí. ¡Gracias, que tengas un gran día!"], end: true },
      end4: { npc: ["Here's your change: one dollar. See you tomorrow!","Aquí está tu vuelto: un dólar. ¡Nos vemos mañana!"], end: true }
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
        { en: "An aisle seat, please.", es: "Pasillo, por favor.", go: "end2" },
        { en: "Is my bag too heavy?", es: "¿Mi maleta pesa demasiado?", go: "end3" },
        { en: "I would like the scale.", es: "Quisiera la balanza.", fb: "Te preguntan qué asiento prefieres." } ] },
      e: { npc: ["Perfect. Would you like a window or an aisle seat?","Perfecto. ¿Prefiere ventana o pasillo?"], options: [
        { en: "A window seat, please.", es: "Ventana, por favor.", go: "end" },
        { en: "An aisle seat, please.", es: "Pasillo, por favor.", go: "end2" },
        { en: "No, I don't like seats.", es: "No, no me gustan los asientos.", fb: "¡Vas a necesitar un asiento! 😄" } ] },
      end: { npc: ["Here is your boarding pass. Your gate is twelve. Have a nice flight!","Aquí está su tarjeta de embarque. Su puerta es la doce. ¡Buen vuelo!"], end: true },
      end2: { npc: ["Here is your boarding pass. You have an aisle seat in row twenty. Boarding starts at ten. Have a nice flight!","Aquí está su tarjeta de embarque. Tiene pasillo en la fila veinte. El embarque empieza a las diez. ¡Buen vuelo!"], end: true },
      end3: { npc: ["It's twenty-five kilos, so you need to pay an extra fee. Here is your boarding pass.","Pesa veinticinco kilos, así que debe pagar un cargo extra. Aquí está su tarjeta de embarque."], end: true }
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
        { en: "A glass of orange juice, please.", es: "Un vaso de jugo de naranja, por favor.", go: "end2" },
        { en: "Can I see the wine list, please?", es: "¿Me muestra la carta de vinos, por favor?", go: "end3" },
        { en: "Yes, something.", es: "Sí, algo.", fb: "Demasiado vago: di qué bebida quieres." } ] },
      end: { npc: ["Perfect. Your food will be ready in fifteen minutes.","Perfecto. Su comida estará lista en quince minutos."], end: true },
      end2: { npc: ["Perfect. Your juice is coming right now, and your food will be ready soon.","Perfecto. Su jugo viene enseguida y su comida estará lista pronto."], end: true },
      end3: { npc: ["Of course. I recommend a Chilean red wine. Here you go!","Por supuesto. Le recomiendo un vino tinto chileno. ¡Aquí tiene!"], end: true }
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
        { en: "Yes, what does a typical day look like here?", es: "Sí, ¿cómo es un día típico aquí?", go: "end2" },
        { en: "Yes, when can I expect an answer?", es: "Sí, ¿cuándo puedo esperar una respuesta?", go: "end" },
        { en: "No, I think everything is clear. Thank you!", es: "No, creo que todo está claro. ¡Gracias!", go: "end3" },
        { en: "Yes, how old are you?", es: "Sí, ¿cuántos años tienes?", fb: "Pregunta personal inapropiada en una entrevista." } ] },
      end: { npc: ["Thank you for your time. We will contact you next week.","Gracias por tu tiempo. Te contactaremos la próxima semana."], end: true },
      end2: { npc: ["You start at nine, work with the design team and have a meeting every Monday. We will call you soon!","Empiezas a las nueve, trabajas con el equipo de diseño y hay una reunión cada lunes. ¡Te llamaremos pronto!"], end: true },
      end3: { npc: ["Perfect. Actually, we really liked you. Can you start next month?","Perfecto. La verdad, nos gustaste mucho. ¿Puedes empezar el próximo mes?"], end: true }
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
        { en: "Sure, I'd love some juice.", es: "Claro, me encantaría un jugo.", go: "end2" },
        { en: "No, thanks. I'm okay for now.", es: "No, gracias. Por ahora estoy bien.", go: "end" },
        { en: "Actually, I have to go. It was nice to meet you!", es: "La verdad, me tengo que ir. ¡Fue un gusto conocerte!", go: "end3" },
        { en: "Yes, I drink programs.", es: "Sí, bebo programas.", fb: "😄 ¡Eso no se bebe!" } ] },
      end: { npc: ["It was great talking to you, Ana!","¡Fue genial conversar contigo, Ana!"], end: true },
      end2: { npc: ["Here you go! Come with me, I'll introduce you to my friends.","¡Aquí tienes! Ven conmigo, te presento a mis amigos."], end: true },
      end3: { npc: ["Oh, okay! Can I have your number? Let's meet again soon.","¡Ah, ok! ¿Me das tu número? Juntémonos otra vez pronto."], end: true }
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
        { en: "No, thanks. I have my own bag.", es: "No, gracias. Traigo mi propia bolsa.", go: "end2" },
        { en: "Can I pay by card?", es: "¿Puedo pagar con tarjeta?", go: "end3" },
        { en: "Twenty-three is my age.", es: "Veintitrés es mi edad.", fb: "Te preguntan si necesitas bolsa." } ] },
      end: { npc: ["Here's your receipt. Have a nice day!","Aquí está tu boleta. ¡Que tengas un lindo día!"], end: true },
      end2: { npc: ["Great, thanks for helping the planet! Here's your receipt.","¡Genial, gracias por ayudar al planeta! Aquí está tu boleta."], end: true },
      end3: { npc: ["Of course. Insert your card, please… Done! Here's your receipt.","Por supuesto. Inserta tu tarjeta, por favor… ¡Listo! Aquí está tu boleta."], end: true }
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
   ESCRIBIR: temas guiados de nivel A2
   "questions" son las preguntas que hace la app, en orden.
   "words" son palabras útiles para el tema.
   ============================================================ */
const WRITE_TOPICS = [
  { id: "weekend", icon: "🛋️", title: "Mi fin de semana",
    questions: [["What did you do last weekend?","¿Qué hiciste el fin de semana pasado?"],["Who were you with?","¿Con quién estabas?"],["What was the best part?","¿Qué fue lo mejor?"],["What are you going to do next weekend?","¿Qué vas a hacer el próximo fin de semana?"]],
    words: [["went","fui"],["visited","visité"],["stayed at home","me quedé en casa"],["watched","vi (tele, película)"],["it was fun","fue divertido"]] },
  { id: "routine", icon: "⏰", title: "Mi rutina",
    questions: [["What time do you usually wake up?","¿A qué hora te despiertas normalmente?"],["What do you do in the morning?","¿Qué haces en la mañana?"],["What do you do after work?","¿Qué haces después del trabajo?"],["What do you do before you go to bed?","¿Qué haces antes de acostarte?"]],
    words: [["usually","normalmente"],["always","siempre"],["then","luego"],["after that","después de eso"],["go to bed","acostarse"]] },
  { id: "family", icon: "👨‍👩‍👧", title: "Mi familia",
    questions: [["How many people are there in your family?","¿Cuántas personas hay en tu familia?"],["What is your mother or father like?","¿Cómo es tu mamá o tu papá?"],["Do you have brothers or sisters?","¿Tienes hermanos o hermanas?"],["What do you like to do together?","¿Qué les gusta hacer juntos?"]],
    words: [["older","mayor"],["younger","menor"],["kind","amable"],["funny","chistoso"],["we often","a menudo nosotros"]] },
  { id: "food", icon: "🍝", title: "Mi comida favorita",
    questions: [["What is your favorite food?","¿Cuál es tu comida favorita?"],["Can you cook it? How?","¿Sabes cocinarla? ¿Cómo?"],["What do you usually eat for breakfast?","¿Qué tomas normalmente al desayuno?"],["Describe a restaurant you like.","Describe un restaurante que te guste."]],
    words: [["delicious","delicioso"],["spicy","picante"],["I usually have","normalmente como"],["my favorite dish","mi plato favorito"],["recipe","receta"]] },
  { id: "trip", icon: "✈️", title: "Mi último viaje",
    questions: [["Where did you go on your last trip?","¿A dónde fuiste en tu último viaje?"],["How did you travel?","¿Cómo viajaste?"],["What did you see there?","¿Qué viste ahí?"],["Would you like to go back? Why?","¿Te gustaría volver? ¿Por qué?"]],
    words: [["by plane","en avión"],["by bus","en bus"],["beautiful","precioso"],["the best thing was","lo mejor fue"],["because","porque"]] },
  { id: "plans", icon: "🚀", title: "Mis planes",
    questions: [["What are you going to do this year?","¿Qué vas a hacer este año?"],["Where would you like to travel?","¿A dónde te gustaría viajar?"],["What do you want to learn?","¿Qué quieres aprender?"],["What is your biggest dream?","¿Cuál es tu sueño más grande?"]],
    words: [["I'm going to","voy a"],["I would like to","me gustaría"],["I hope","espero"],["someday","algún día"],["goal","meta"]] },
  { id: "work", icon: "💼", title: "Mi trabajo",
    questions: [["What do you do?","¿A qué te dedicas?"],["What do you like about your job?","¿Qué te gusta de tu trabajo?"],["What is difficult about it?","¿Qué es lo difícil?"],["Describe a typical day at work.","Describe un día típico en el trabajo."]],
    words: [["I work as","trabajo como"],["coworkers","compañeros de trabajo"],["meeting","reunión"],["deadline","fecha límite"],["I'm good at","soy buena para"]] },
  { id: "city", icon: "🏙️", title: "Mi ciudad",
    questions: [["Where do you live?","¿Dónde vives?"],["What is your neighborhood like?","¿Cómo es tu barrio?"],["What is the best place in your city?","¿Cuál es el mejor lugar de tu ciudad?"],["What would you change in your city?","¿Qué cambiarías de tu ciudad?"]],
    words: [["there is / there are","hay"],["quiet","tranquilo"],["crowded","lleno de gente"],["near","cerca"],["traffic","tráfico"]] },
  { id: "friend", icon: "🤝", title: "Mi mejor amiga o amigo",
    questions: [["Who is your best friend?","¿Quién es tu mejor amiga o amigo?"],["How did you meet?","¿Cómo se conocieron?"],["What is he or she like?","¿Cómo es él o ella?"],["What do you do together?","¿Qué hacen juntos?"]],
    words: [["we met","nos conocimos"],["at school","en el colegio"],["honest","honesto"],["we laugh a lot","nos reímos mucho"],["since","desde"]] },
  { id: "movie", icon: "🎬", title: "Una película o serie",
    questions: [["What movie or series did you watch recently?","¿Qué película o serie viste hace poco?"],["What is it about?","¿De qué se trata?"],["Who is your favorite character? Why?","¿Quién es tu personaje favorito? ¿Por qué?"],["Do you recommend it? Why?","¿La recomiendas? ¿Por qué?"]],
    words: [["it's about","se trata de"],["funny","chistosa"],["boring","aburrida"],["the ending","el final"],["I recommend it","la recomiendo"]] },
  { id: "health", icon: "🏃‍♀️", title: "Salud y ejercicio",
    questions: [["What do you do to stay healthy?","¿Qué haces para mantenerte sana?"],["How often do you exercise?","¿Con qué frecuencia haces ejercicio?"],["What healthy food do you like?","¿Qué comida saludable te gusta?"],["What would you like to change?","¿Qué te gustaría cambiar?"]],
    words: [["twice a week","dos veces por semana"],["I try to","trato de"],["vegetables","verduras"],["sleep","dormir"],["I should","debería"]] },
  { id: "childhood", icon: "🧸", title: "Cuando era niña",
    questions: [["Where did you live when you were a child?","¿Dónde vivías cuando eras niña?"],["What did you like to play?","¿A qué te gustaba jugar?"],["Who was your best friend?","¿Quién era tu mejor amiga o amigo?"],["What was your favorite food?","¿Cuál era tu comida favorita?"]],
    words: [["when I was a child","cuando era niña"],["I used to","solía"],["played","jugaba"],["my grandmother","mi abuela"],["every summer","cada verano"]] },
  { id: "hobbies", icon: "🎨", title: "Mis pasatiempos",
    questions: [["What do you do in your free time?","¿Qué haces en tu tiempo libre?"],["When did you start?","¿Cuándo empezaste?"],["Why do you like it?","¿Por qué te gusta?"],["What new hobby would you like to try?","¿Qué pasatiempo nuevo te gustaría probar?"]],
    words: [["free time","tiempo libre"],["I enjoy","disfruto"],["relaxing","relajante"],["I started","empecé"],["try","probar"]] },
  { id: "home", icon: "🏠", title: "Mi casa",
    questions: [["Describe your house or apartment.","Describe tu casa o departamento."],["What is your favorite room? Why?","¿Cuál es tu pieza favorita? ¿Por qué?"],["What is there in your bedroom?","¿Qué hay en tu dormitorio?"],["What would you like to change?","¿Qué te gustaría cambiar?"]],
    words: [["there is","hay (singular)"],["there are","hay (plural)"],["big","grande"],["bright","luminoso"],["next to","al lado de"]] },
  { id: "shopping", icon: "🛍️", title: "De compras",
    questions: [["What was the last thing you bought?","¿Qué fue lo último que compraste?"],["Do you prefer shopping online or in stores?","¿Prefieres comprar en línea o en tiendas?"],["What is too expensive in your city?","¿Qué es demasiado caro en tu ciudad?"],["Describe your favorite clothes.","Describe tu ropa favorita."]],
    words: [["I bought","compré"],["cheap","barato"],["expensive","caro"],["online","en línea"],["comfortable","cómodo"]] },
  { id: "tech", icon: "💻", title: "Tecnología",
    questions: [["What apps do you use every day?","¿Qué apps usas todos los días?"],["How much time do you spend on your phone?","¿Cuánto tiempo pasas en el teléfono?"],["What is the best invention? Why?","¿Cuál es el mejor invento? ¿Por qué?"],["Could you live without the internet?","¿Podrías vivir sin internet?"]],
    words: [["I use","uso"],["hours a day","horas al día"],["useful","útil"],["without","sin"],["I couldn't","no podría"]] },
  { id: "english", icon: "📚", title: "Aprender inglés",
    questions: [["Why are you learning English?","¿Por qué estás aprendiendo inglés?"],["What is difficult for you?","¿Qué te cuesta?"],["How do you practice?","¿Cómo practicas?"],["What do you want to do in English in the future?","¿Qué quieres hacer en inglés en el futuro?"]],
    words: [["because","porque"],["pronunciation","pronunciación"],["every day","todos los días"],["I want to","quiero"],["fluently","con fluidez"]] },
  { id: "free", icon: "✍️", title: "Escritura libre",
    questions: [["Write about anything you want.","Escribe sobre lo que quieras."]],
    words: [] }
];

/* ============================================================
   PRONUNCIACIÓN
   Cada frase es ["inglés", "español"].
   ============================================================ */
const PRON = [
  { id: "th", title: "Sonido TH", icon: "👅", tip: "Pon la punta de la lengua entre los dientes y sopla suave.",
    phrases: [["Think about three things","Piensa en tres cosas"],["This is the third Thursday","Este es el tercer jueves"],["They thought the weather was nice","Pensaron que el clima estaba agradable"],["Thank you for everything","Gracias por todo"],
      ["My brother is thirty years old","Mi hermano tiene treinta años"],["I think that is my mother","Creo que esa es mi mamá"],["There are three bathrooms in this house","Hay tres baños en esta casa"],["The weather is better than yesterday","El clima está mejor que ayer"],
      ["Those clothes are from my father","Esa ropa es de mi papá"],["Both of them think it's true","Los dos creen que es verdad"],["I need something to drink","Necesito algo para tomar"],["We go there together every month","Vamos ahí juntos todos los meses"]] },
  { id: "vb", title: "V y B", icon: "🫦", tip: "En la V, los dientes de arriba tocan el labio de abajo. La B se hace con los dos labios.",
    phrases: [["Very good vegetables","Verduras muy buenas"],["I have a big black van","Tengo una camioneta negra grande"],["Victor loves his violin","Víctor ama su violín"],["The boat is very beautiful","El bote es muy bonito"],
      ["I visited my best friend in November","Visité a mi mejor amiga en noviembre"],["We have a very busy evening","Tenemos una tarde muy ocupada"],["The bus leaves at seven","La micro sale a las siete"],["Have you ever been to Brazil?","¿Alguna vez has ido a Brasil?"],
      ["I bought a new bike last November","Compré una bicicleta nueva el noviembre pasado"],["Her voice is very soft","Su voz es muy suave"],["Bring the bread to the table","Trae el pan a la mesa"],["I believe you, Valentina","Te creo, Valentina"]] },
  { id: "iee", title: "I corta vs EE larga", icon: "🔤", tip: "\"ship\" (barco) es corta y relajada; \"sheep\" (oveja) es larga y con sonrisa.",
    phrases: [["This ship is cheap","Este barco es barato"],["Please sit in this seat","Por favor siéntate en este asiento"],["I live here, please leave","Vivo aquí, por favor vete"],["Is it his key?","¿Es su llave?"],
      ["Eat this fish with me","Come este pescado conmigo"],["Did you see the big tree?","¿Viste el árbol grande?"],["She feels sick this week","Ella se siente enferma esta semana"],["Keep it in the kitchen","Guárdalo en la cocina"],
      ["Is this seat free?","¿Está libre este asiento?"],["I meet Tim at the gym","Me junto con Tim en el gimnasio"],["The tea is a little sweet","El té está un poco dulce"],["We will speak English in this meeting","Vamos a hablar inglés en esta reunión"]] },
  { id: "r", title: "R inglesa", icon: "🌀", tip: "La R inglesa no vibra: curva la lengua hacia atrás sin tocar el paladar.",
    phrases: [["Red roses are really romantic","Las rosas rojas son muy románticas"],["The rain in the morning","La lluvia en la mañana"],["Rachel reads every Friday","Rachel lee todos los viernes"],["I really like rice","Me gusta mucho el arroz"],
      ["Turn right at the river","Dobla a la derecha en el río"],["We arrived at the restaurant early","Llegamos temprano al restaurante"],["Are you ready for the trip?","¿Estás lista para el viaje?"],["The room is on the third floor","La habitación está en el tercer piso"],
      ["My friend runs every morning","Mi amiga corre todas las mañanas"],["I remember your brother","Me acuerdo de tu hermano"],["Can you repeat the price, please?","¿Puede repetir el precio, por favor?"],["Her car is red and very fast","Su auto es rojo y muy rápido"]] },
  { id: "ed", title: "Pasado con -ED", icon: "⏪", tip: "Después de T o D suena \"id\" (wanted: quería). Después de P, K, SH, CH suena \"t\" (worked: trabajé). En los demás, \"d\" (played: jugué).",
    phrases: [["I worked and walked all day","Trabajé y caminé todo el día"],["She wanted to visit Rome","Ella quería visitar Roma"],["We played and danced","Jugamos y bailamos"],["They watched a movie","Vieron una película"],
      ["I needed more time","Necesité más tiempo"],["He cooked dinner and washed the dishes","Él cocinó la cena y lavó los platos"],["We stayed at home and relaxed","Nos quedamos en casa y descansamos"],["She started a new job","Ella empezó un trabajo nuevo"],
      ["I called my mother yesterday","Llamé a mi mamá ayer"],["They decided to travel by bus","Decidieron viajar en bus"],["I helped my friend move","Ayudé a mi amiga a mudarse"],["The class finished at nine","La clase terminó a las nueve"]] },
  { id: "h", title: "H aspirada", icon: "💨", tip: "La H inglesa suena como una J muy suave, como cuando echas vaho a un vidrio.",
    phrases: [["Happy holidays to you","Felices fiestas para ti"],["He has a huge house","Él tiene una casa enorme"],["How are you, Helen?","¿Cómo estás, Helen?"],["I hope Henry is home","Espero que Henry esté en casa"],
      ["Can you help me, please?","¿Me puedes ayudar, por favor?"],["My head hurts a lot","Me duele mucho la cabeza"],["Her husband is from Holland","Su esposo es de Holanda"],["We had a hot lunch","Almorzamos algo caliente"],
      ["How much is this hat?","¿Cuánto cuesta este sombrero?"],["I am happy to be here","Estoy feliz de estar aquí"],["The hotel is behind the hospital","El hotel está detrás del hospital"],["Hold my hand","Toma mi mano"]] },
  { id: "shch", title: "SH y CH", icon: "🤫", tip: "SH es suave y continuo, como \"shhh\". CH es corto, como en \"Chile\".",
    phrases: [["She chose a cheap shirt","Ella eligió una camisa barata"],["Check the shop on the corner","Revisa la tienda de la esquina"],["Watch the show with me","Mira el programa conmigo"],["Shake hands with the chef","Dale la mano al chef"],
      ["I should wash my shoes","Debería lavar mis zapatos"],["The children eat chicken for lunch","Los niños comen pollo al almuerzo"],["Take a short shower","Date una ducha corta"],["Can I change my chair?","¿Puedo cambiar mi silla?"],
      ["She teaches English in March","Ella enseña inglés en marzo"],["I wish I had more cash","Ojalá tuviera más efectivo"],["Each kitchen has a dishwasher","Cada cocina tiene lavavajillas"],["Show me the chocolate, please","Muéstrame el chocolate, por favor"]] },
  { id: "s", title: "S + consonante", icon: "🐍", tip: "No agregues una \"e\" al principio: di \"school\", no \"eschool\". Empieza directo con un sonido de serpiente: sss…",
    phrases: [["I go to school by bus","Voy al colegio en bus"],["My sister studies in Spain","Mi hermana estudia en España"],["Please stop the car here","Por favor detén el auto aquí"],["The store is small","La tienda es pequeña"],
      ["I speak a little Spanish","Hablo un poco de español"],["Start the class at six","Empieza la clase a las seis"],["She is a smart student","Ella es una estudiante inteligente"],["The sky is full of stars","El cielo está lleno de estrellas"],
      ["We stayed at a nice hotel","Nos quedamos en un buen hotel"],["Sleep well and smile","Duerme bien y sonríe"],["Don't eat too many snacks","No comas demasiados snacks"],["Spring is my favorite season","La primavera es mi estación favorita"]] },
  { id: "jy", title: "J y Y", icon: "🍯", tip: "La J inglesa suena como una \"ch\" que vibra (\"dj\"), como en \"jam\" (mermelada). La Y es suave, como la \"i\" de \"hielo\": \"yes\".",
    phrases: [["Yes, I like jam","Sí, me gusta la mermelada"],["I got a new job in July","Conseguí un trabajo nuevo en julio"],["Your jacket is yellow","Tu chaqueta es amarilla"],["John is younger than me","John es menor que yo"],
      ["Enjoy your journey","Disfruta tu viaje"],["Have you eaten yet?","¿Ya comiste?"],["I drink orange juice every day","Tomo jugo de naranja todos los días"],["She just told me a joke","Ella me acaba de contar un chiste"],
      ["The year starts in January","El año empieza en enero"],["Did you join the gym?","¿Te inscribiste en el gimnasio?"],["I usually walk to the gym","Normalmente camino al gimnasio"],["Jake works in Japan","Jake trabaja en Japón"]] },
  { id: "aeu", title: "Vocales de cat, cut y car", icon: "🐱", tip: "\"cat\" (gato): abre la boca como sonriendo, entre A y E. \"cut\" (cortar): una A corta y relajada. \"car\" (auto): una A larga y profunda.",
    phrases: [["The black cat is sad","El gato negro está triste"],["I love my mother and my brother","Amo a mi mamá y a mi hermano"],["My car is in the park","Mi auto está en el parque"],["Can you pass me the map?","¿Me pasas el mapa?"],
      ["The bus is coming","La micro viene llegando"],["My father has a farm","Mi papá tiene una granja"],["Thanks for the lunch","Gracias por el almuerzo"],["The hat is in my bag","El sombrero está en mi bolso"],
      ["It's fun to run in the sun","Es divertido correr al sol"],["Let's walk to the market","Caminemos al mercado"],["My uncle is very funny","Mi tío es muy chistoso"],["Sam and Anna are happy","Sam y Anna están felices"]] },
  { id: "es", title: "Finales -S y -ES", icon: "➕", tip: "Después de P, T, K, F suena \"s\" (cats). Después de sonidos suaves suena \"z\" (dogs). Después de S, Z, SH, CH suena \"iz\" (buses). ¡No te comas la S final!",
    phrases: [["I have two cats and three dogs","Tengo dos gatos y tres perros"],["She works and lives in Lima","Ella trabaja y vive en Lima"],["The buses are very slow","Las micros son muy lentas"],["He watches movies on weekends","Él ve películas los fines de semana"],
      ["My friends like pizza","A mis amigos les gusta la pizza"],["She washes the dishes","Ella lava los platos"],["These books are cheap","Estos libros son baratos"],["He plays tennis on Mondays","Él juega tenis los lunes"],
      ["The classes start at eight","Las clases empiezan a las ocho"],["My mom makes great cakes","Mi mamá hace pasteles ricos"],["It costs ten dollars","Cuesta diez dólares"],["He goes to the gym twice a week","Él va al gimnasio dos veces por semana"]] },
  { id: "mute", title: "Letras mudas", icon: "🔇", tip: "Algunas letras se escriben pero no se pronuncian: la K de \"knife\" (cuchillo), la W de \"write\" (escribir), la T de \"listen\" (escuchar), la L de \"walk\" (caminar).",
    phrases: [["I need a knife and a fork","Necesito un cuchillo y un tenedor"],["Please write your name","Por favor escribe tu nombre"],["Listen to the music","Escucha la música"],["We walk and talk every day","Caminamos y conversamos todos los días"],
      ["I'll see you on Wednesday","Te veo el miércoles"],["Do you know the answer?","¿Sabes la respuesta?"],["I'll be there in half an hour","Estaré ahí en media hora"],["My daughter is eight","Mi hija tiene ocho años"],
      ["I could not sleep last night","No pude dormir anoche"],["Wrap the gift, please","Envuelve el regalo, por favor"],["The island is beautiful","La isla es preciosa"],["Should I call the doctor?","¿Debería llamar al doctor?"]] },
  { id: "z", title: "Z con zumbido", icon: "🐝", tip: "En inglés la Z (y muchas S entre vocales) vibra como una abeja: zzz. Junta los dientes y deja que la garganta vibre. En español este sonido no existe.",
    phrases: [["The zoo is open on Tuesdays","El zoológico abre los martes"],["This exercise is easy","Este ejercicio es fácil"],["I love music","Me encanta la música"],["Please close the door","Por favor cierra la puerta"],
      ["Is this your size?","¿Es esta tu talla?"],["She is busy today","Ella está ocupada hoy"],["My cousin is crazy about pizza","Mi primo está loco por la pizza"],["His eyes are blue","Sus ojos son azules"],
      ["Zero is a number","Cero es un número"],["These roses are amazing","Estas rosas son increíbles"],["I was surprised","Me sorprendí"],["Choose a prize","Elige un premio"]] },
  { id: "useful", title: "Frases útiles", icon: "⭐", tip: "Frases que usarás todos los días.",
    phrases: [["Could you repeat that, please?","¿Podrías repetir eso, por favor?"],["I would like a cup of coffee","Quisiera una taza de café"],["Excuse me, where is the bathroom?","Disculpe, ¿dónde está el baño?"],["Can you speak more slowly?","¿Puedes hablar más lento?"],
      ["What does this word mean?","¿Qué significa esta palabra?"],["How do you say this in English?","¿Cómo se dice esto en inglés?"],["I'm sorry, I don't understand","Lo siento, no entiendo"],["Can I pay by card?","¿Puedo pagar con tarjeta?"],
      ["It was nice to meet you","Fue un gusto conocerte"],["See you later","Nos vemos más tarde"],["I'm looking for the train station","Estoy buscando la estación de tren"],["Have a nice day!","¡Que tengas un lindo día!"]] },
  { id: "tongue", title: "Trabalenguas", icon: "🎯", tip: "Empieza lento y ve subiendo la velocidad. No son de nivel A2: son para jugar con los sonidos.",
    phrases: [["She sells seashells by the seashore","Ella vende conchas en la orilla del mar"],["Red lorry, yellow lorry","Camión rojo, camión amarillo"],["Peter Piper picked a peck of pickled peppers","Peter Piper recogió un montón de ajíes en vinagre"],["How can a clam cram in a clean cream can?","¿Cómo puede una almeja meterse en una lata limpia de crema?"],
      ["Fuzzy Wuzzy was a bear","Fuzzy Wuzzy era un oso"],["I scream, you scream, we all scream for ice cream","Yo grito, tú gritas, todos gritamos por helado"],["Six sticky skeletons","Seis esqueletos pegajosos"],["A big black bug bit a big black bear","Un gran bicho negro mordió a un gran oso negro"],
      ["Fresh French fried fish","Pescado francés frito y fresco"],["Truly rural","Verdaderamente rural"]] }
];
