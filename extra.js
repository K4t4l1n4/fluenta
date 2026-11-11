/* ============================================================
   MÁS CONTENIDO DE FLUENTA (3.8)
   Lecturas e historias para escuchar.
   (El vocabulario práctico, los pares de sonidos y la prueba
   de nivel están en vocab.js.)
   Para agregar algo, copia un bloque y cambia el texto.

   - En las preguntas, la PRIMERA opción es siempre la correcta
     (la app las desordena al mostrarlas).
   - No cambies los "id": con ellos se guarda lo que ya hiciste.
   ============================================================ */

/* ===== LECTURAS: paras = párrafos [inglés, español]; words = palabras clave; qs = preguntas [pregunta, [opciones]] ===== */
const READINGS = [
  { id: "rd-a1-1", level: "A1", icon: "🌅", title: "My morning", es: "Mi mañana",
    paras: [
      ["My name is Laura. I live in a small apartment with my cat, Milo. Every day I get up at seven o'clock.", "Me llamo Laura. Vivo en un departamento pequeño con mi gato, Milo. Todos los días me levanto a las siete."],
      ["First, I take a shower. Then I make breakfast. I usually have coffee, bread and an egg. Milo has his food too.", "Primero me ducho. Después preparo el desayuno. Normalmente tomo café y como pan y un huevo. Milo también come su comida."],
      ["At eight o'clock I go to work by bus. The bus is slow, but I like it because I can read my book.", "A las ocho me voy al trabajo en bus. El bus es lento, pero me gusta porque puedo leer mi libro."]
    ],
    words: [["get up", "levantarse"], ["take a shower", "ducharse"], ["breakfast", "desayuno"], ["usually", "normalmente"], ["by bus", "en bus"], ["slow", "lento"]],
    qs: [
      ["Who does Laura live with?", ["Her cat", "Her sister", "Her parents", "Her friend"]],
      ["What does she usually have for breakfast?", ["Coffee, bread and an egg", "Tea and fruit", "Only coffee", "Milk and cereal"]],
      ["Why does she like the bus?", ["Because she can read", "Because it is fast", "Because it is cheap", "Because Milo is there"]]
    ] },
  { id: "rd-a1-2", level: "A1", icon: "🛒", title: "At the supermarket", es: "En el supermercado",
    paras: [
      ["Today is Saturday. Carlos is at the supermarket. He needs milk, apples, rice and chicken for the week.", "Hoy es sábado. Carlos está en el supermercado. Necesita leche, manzanas, arroz y pollo para la semana."],
      ["The apples are red and big. They are cheap today, so he buys six. The chicken is expensive, but he buys it too.", "Las manzanas son rojas y grandes. Hoy están baratas, así que compra seis. El pollo está caro, pero también lo compra."],
      ["At the checkout, the cashier says, \"Twenty dollars, please.\" Carlos pays with his card and goes home happy.", "En la caja, el cajero dice: «Veinte dólares, por favor». Carlos paga con su tarjeta y se va a casa contento."]
    ],
    words: [["needs", "necesita"], ["cheap", "barato"], ["expensive", "caro"], ["checkout", "caja"], ["cashier", "cajero"], ["pays", "paga"]],
    qs: [
      ["What day is it?", ["Saturday", "Sunday", "Monday", "Friday"]],
      ["How many apples does Carlos buy?", ["Six", "Two", "Four", "Ten"]],
      ["How does Carlos pay?", ["With his card", "With cash", "With his phone", "He doesn't pay"]]
    ] },
  { id: "rd-a1-3", level: "A1", icon: "👨‍👩‍👧", title: "My family", es: "Mi familia",
    paras: [
      ["I have a big family. My parents live in Santiago. My father is a doctor and my mother is a teacher.", "Tengo una familia grande. Mis padres viven en Santiago. Mi papá es médico y mi mamá es profesora."],
      ["I have two brothers and one sister. My sister, Ana, is twenty years old. She studies music and she sings very well.", "Tengo dos hermanos y una hermana. Mi hermana, Ana, tiene veinte años. Estudia música y canta muy bien."],
      ["On Sundays we have lunch together at my parents' house. My mother cooks, and we talk and laugh a lot.", "Los domingos almorzamos juntos en la casa de mis padres. Mi mamá cocina, y conversamos y nos reímos mucho."]
    ],
    words: [["parents", "padres"], ["doctor", "médico"], ["teacher", "profesora"], ["studies", "estudia"], ["sings", "canta"], ["together", "juntos"], ["laugh", "reír"]],
    qs: [
      ["What is the father's job?", ["He is a doctor", "He is a teacher", "He is a cook", "He is a student"]],
      ["How old is Ana?", ["Twenty", "Twelve", "Thirty", "Two"]],
      ["When do they have lunch together?", ["On Sundays", "On Saturdays", "Every day", "On Mondays"]]
    ] },
  { id: "rd-a2-1", level: "A2", icon: "🌊", title: "A weekend in Valparaíso", es: "Un fin de semana en Valparaíso",
    paras: [
      ["Last weekend my friend Sofía and I went to Valparaíso. We took the bus early in the morning and arrived at ten o'clock.", "El fin de semana pasado mi amiga Sofía y yo fuimos a Valparaíso. Tomamos el bus temprano en la mañana y llegamos a las diez."],
      ["First, we walked around the hills and took a lot of photos of the colorful houses. Then we had lunch in a small restaurant near the port. I ate fish and Sofía ordered soup.", "Primero caminamos por los cerros y sacamos muchas fotos de las casas de colores. Después almorzamos en un restaurante pequeño cerca del puerto. Yo comí pescado y Sofía pidió sopa."],
      ["In the afternoon it started to rain, so we visited a museum. We didn't go to the beach, but we had a great time. I want to go back in summer.", "En la tarde empezó a llover, así que visitamos un museo. No fuimos a la playa, pero lo pasamos muy bien. Quiero volver en verano."]
    ],
    words: [["went", "fuimos"], ["took", "tomamos"], ["arrived", "llegamos"], ["hills", "cerros"], ["port", "puerto"], ["ordered", "pidió"], ["go back", "volver"]],
    qs: [
      ["How did they travel?", ["By bus", "By car", "By train", "By plane"]],
      ["What did Sofía order?", ["Soup", "Fish", "Pizza", "Salad"]],
      ["Why did they visit a museum?", ["Because it started to rain", "Because the beach was closed", "Because it was free", "Because Sofía loves art"]],
      ["What does the writer want to do?", ["Go back in summer", "Never return", "Move to Valparaíso", "Buy a house there"]]
    ] },
  { id: "rd-a2-2", level: "A2", icon: "✉️", title: "An email to a friend", es: "Un correo a una amiga",
    paras: [
      ["Hi Emma! How are you? I have good news: I'm going to visit you in London next month!", "¡Hola, Emma! ¿Cómo estás? Tengo buenas noticias: ¡voy a visitarte en Londres el próximo mes!"],
      ["My flight arrives on Friday the 12th at six in the evening. I'm going to stay for ten days. I want to see the museums, walk in the parks and try fish and chips.", "Mi vuelo llega el viernes 12 a las seis de la tarde. Me voy a quedar diez días. Quiero ver los museos, caminar por los parques y probar el fish and chips."],
      ["Are you free that weekend? Maybe we can have dinner together on Saturday. I'm also going to bring you a present from Chile. See you soon! Love, Daniela", "¿Estás libre ese fin de semana? Quizás podemos cenar juntas el sábado. También te voy a llevar un regalo de Chile. ¡Nos vemos pronto! Con cariño, Daniela"]
    ],
    words: [["good news", "buenas noticias"], ["flight", "vuelo"], ["stay", "quedarse"], ["try", "probar"], ["free", "libre"], ["bring", "traer / llevar"], ["present", "regalo"]],
    qs: [
      ["When is Daniela going to travel?", ["Next month", "Next week", "Tomorrow", "Next year"]],
      ["How long is she going to stay?", ["Ten days", "Two days", "A month", "A weekend"]],
      ["What does she want to do on Saturday?", ["Have dinner with Emma", "Go to a museum", "Fly back home", "Go shopping alone"]],
      ["What is she going to bring?", ["A present from Chile", "Fish and chips", "Her dog", "A book in Spanish"]]
    ] },
  { id: "rd-a2-3", level: "A2", icon: "🏠", title: "The new neighbor", es: "El vecino nuevo",
    paras: [
      ["Last month a new neighbor moved into the apartment next to mine. His name is Peter and he is from Canada.", "El mes pasado un vecino nuevo se mudó al departamento de al lado. Se llama Peter y es de Canadá."],
      ["At first, I was a little worried because he plays the guitar every evening. But he plays very well, and he always stops at nine o'clock.", "Al principio estaba un poco preocupada porque toca guitarra todas las tardes. Pero toca muy bien, y siempre para a las nueve."],
      ["Yesterday he knocked on my door. He was making pancakes and he didn't have any sugar. I gave him some, and he invited me to eat with him. Now we are friends, and I'm helping him learn Spanish.", "Ayer tocó mi puerta. Estaba haciendo panqueques y no tenía azúcar. Le di un poco, y me invitó a comer con él. Ahora somos amigos, y lo estoy ayudando a aprender español."]
    ],
    words: [["neighbor", "vecino"], ["moved into", "se mudó a"], ["worried", "preocupada"], ["knocked", "tocó (la puerta)"], ["sugar", "azúcar"], ["invited", "invitó"]],
    qs: [
      ["Where is Peter from?", ["Canada", "Chile", "England", "The United States"]],
      ["Why was the writer worried?", ["Because Peter plays the guitar every evening", "Because Peter has a big dog", "Because Peter is rude", "Because Peter smokes"]],
      ["What did Peter need?", ["Sugar", "Eggs", "Milk", "A guitar"]],
      ["What is the writer doing now?", ["Helping Peter learn Spanish", "Learning the guitar", "Moving to Canada", "Looking for a new apartment"]]
    ] },
  { id: "rd-b1-1", level: "B1", icon: "💻", title: "Working from home", es: "Trabajar desde la casa",
    paras: [
      ["Three years ago, Marta started working from home. At first, she loved it. She didn't have to take the crowded subway, and she could have lunch in her own kitchen.", "Hace tres años, Marta empezó a trabajar desde su casa. Al principio le encantó. No tenía que tomar el metro lleno de gente, y podía almorzar en su propia cocina."],
      ["However, after a few months she noticed some problems. She was working more hours than before, and she felt lonely because she rarely saw her coworkers. Some days she didn't even leave the house.", "Sin embargo, después de unos meses notó algunos problemas. Estaba trabajando más horas que antes, y se sentía sola porque rara vez veía a sus compañeros de trabajo. Algunos días ni siquiera salía de la casa."],
      ["So Marta decided to change her routine. Now she starts and finishes work at the same time every day, goes for a walk at lunchtime and works in a café twice a week. She says that working from home is great, but only if you set clear limits.", "Así que Marta decidió cambiar su rutina. Ahora empieza y termina de trabajar a la misma hora todos los días, sale a caminar a la hora de almuerzo y trabaja en un café dos veces a la semana. Dice que trabajar desde la casa es genial, pero solo si pones límites claros."]
    ],
    words: [["crowded", "lleno de gente"], ["however", "sin embargo"], ["noticed", "notó"], ["lonely", "sola"], ["coworkers", "compañeros de trabajo"], ["rarely", "rara vez"], ["set limits", "poner límites"]],
    qs: [
      ["What did Marta like at first?", ["Not taking the subway", "Working more hours", "Seeing her coworkers", "Her new office"]],
      ["What problem did she notice?", ["She felt lonely", "She earned less money", "Her boss was angry", "Her internet was slow"]],
      ["What does she do twice a week?", ["She works in a café", "She goes to the office", "She takes the subway", "She works at night"]],
      ["What is the main idea of the text?", ["Working from home is good if you set limits", "Working from home is always bad", "Offices are better than homes", "Marta wants a new job"]]
    ] },
  { id: "rd-b1-2", level: "B1", icon: "🧳", title: "A trip that went wrong", es: "Un viaje que salió mal",
    paras: [
      ["Last summer, my brother and I were driving to the south when our car broke down in the middle of nowhere. It was getting dark, and there was no phone signal.", "El verano pasado, mi hermano y yo íbamos manejando al sur cuando nuestro auto se averió en medio de la nada. Estaba oscureciendo, y no había señal de teléfono."],
      ["While we were deciding what to do, an old truck stopped next to us. The driver, a farmer called Don Luis, offered to take us to the nearest town. We didn't know him, but we had no choice.", "Mientras decidíamos qué hacer, una camioneta vieja paró al lado nuestro. El conductor, un agricultor llamado don Luis, ofreció llevarnos al pueblo más cercano. No lo conocíamos, pero no teníamos otra opción."],
      ["In the end, everything turned out well. Don Luis's family gave us dinner and a place to sleep, and the next morning a mechanic fixed the car. We missed one day of our vacation, but we made new friends. Sometimes the worst moments become the best stories.", "Al final, todo salió bien. La familia de don Luis nos dio comida y un lugar para dormir, y a la mañana siguiente un mecánico arregló el auto. Perdimos un día de vacaciones, pero hicimos amigos nuevos. A veces los peores momentos se convierten en las mejores historias."]
    ],
    words: [["broke down", "se averió"], ["in the middle of nowhere", "en medio de la nada"], ["signal", "señal"], ["truck", "camioneta / camión"], ["offered", "ofreció"], ["turned out well", "salió bien"], ["missed", "perdimos"]],
    qs: [
      ["What happened to the car?", ["It broke down", "It was stolen", "It ran out of gas", "It had an accident"]],
      ["Who helped them?", ["A farmer", "A police officer", "A tourist", "Nobody"]],
      ["Where did they sleep?", ["At Don Luis's house", "In the car", "In a hotel", "In a tent"]],
      ["What does the last sentence mean?", ["Bad experiences can become good memories", "Trips are always dangerous", "You should never talk to strangers", "Cars are not reliable"]]
    ] },
  { id: "rd-b1-3", level: "B1", icon: "🧠", title: "Why we forget names", es: "Por qué olvidamos los nombres",
    paras: [
      ["Have you ever met someone and forgotten their name two minutes later? Don't worry: it happens to almost everyone, and it doesn't mean you have a bad memory.", "¿Alguna vez conociste a alguien y olvidaste su nombre dos minutos después? No te preocupes: le pasa a casi todo el mundo, y no significa que tengas mala memoria."],
      ["According to psychologists, names are difficult because they don't mean anything. If someone says she is a baker, your brain creates a picture: bread, an oven, a shop. But the name \"Susan\" doesn't give your brain any picture to remember.", "Según los psicólogos, los nombres son difíciles porque no significan nada. Si alguien dice que es panadera, tu cerebro crea una imagen: pan, un horno, una tienda. Pero el nombre «Susan» no le da a tu cerebro ninguna imagen para recordar."],
      ["There are some simple tricks that help. Repeat the name when you hear it (\"Nice to meet you, Susan\"), use it again during the conversation, and connect it with an image. With a little practice, you will remember more names than before.", "Hay algunos trucos simples que ayudan. Repite el nombre cuando lo escuches («Mucho gusto, Susan»), úsalo otra vez durante la conversación y conéctalo con una imagen. Con un poco de práctica, vas a recordar más nombres que antes."]
    ],
    words: [["forgotten", "olvidado"], ["according to", "según"], ["baker", "panadera"], ["oven", "horno"], ["tricks", "trucos"], ["connect", "conectar"]],
    qs: [
      ["Forgetting a name two minutes later…", ["is normal", "means you have a bad memory", "means you are not polite", "only happens when you are tired"]],
      ["Why are names hard to remember?", ["They don't create a picture in the brain", "They are too long", "People say them too fast", "There are too many of them"]],
      ["Which trick is mentioned in the text?", ["Repeating the name", "Writing the name on your hand", "Asking for a business card", "Taking a photo"]],
      ["The word \"baker\" is used as an example of…", ["a job that creates a picture", "a difficult name", "a common last name", "a memory problem"]]
    ] },
  { id: "rd-b2-1", level: "B2", icon: "👕", title: "The price of fast fashion", es: "El precio de la moda rápida",
    paras: [
      ["A T-shirt that costs less than a cup of coffee sounds like a bargain. Yet the real price of fast fashion is rarely shown on the label. Producing a single cotton T-shirt can require around 2,700 liters of water, roughly what one person drinks in two and a half years.", "Una polera que cuesta menos que un café suena como una ganga. Sin embargo, el precio real de la moda rápida rara vez aparece en la etiqueta. Producir una sola polera de algodón puede requerir cerca de 2.700 litros de agua, aproximadamente lo que una persona bebe en dos años y medio."],
      ["The problem is not only environmental. In order to keep prices low, many brands rely on factories where employees work long hours for very low wages. Meanwhile, consumers buy more clothes than ever and wear each item fewer times before throwing it away.", "El problema no es solo ambiental. Para mantener los precios bajos, muchas marcas dependen de fábricas donde los empleados trabajan muchas horas por sueldos muy bajos. Mientras tanto, los consumidores compran más ropa que nunca y usan cada prenda menos veces antes de botarla."],
      ["Fortunately, attitudes are beginning to change. Second-hand shops and clothing swaps have become popular, and some companies now offer repair services. Experts agree that the most sustainable garment is the one you already own, so before buying something new, it is worth asking: do I really need it?", "Por suerte, las actitudes están empezando a cambiar. Las tiendas de segunda mano y los intercambios de ropa se han vuelto populares, y algunas empresas ahora ofrecen servicios de reparación. Los expertos coinciden en que la prenda más sustentable es la que ya tienes, así que antes de comprar algo nuevo vale la pena preguntarse: ¿de verdad lo necesito?"]
    ],
    words: [["bargain", "ganga"], ["label", "etiqueta"], ["roughly", "aproximadamente"], ["rely on", "depender de"], ["wages", "sueldos"], ["throwing away", "botar"], ["second-hand", "de segunda mano"], ["garment", "prenda"], ["it is worth", "vale la pena"]],
    qs: [
      ["According to the text, the real cost of a cheap T-shirt…", ["is not shown on the label", "is always higher in shops", "depends on the color", "is paid by the brand"]],
      ["How do many brands keep prices low?", ["By paying very low wages", "By using less cotton", "By selling only online", "By making fewer clothes"]],
      ["Which change is mentioned?", ["Second-hand shops have become popular", "Clothes are now more expensive", "People buy fewer T-shirts than ever", "Many factories have closed"]],
      ["What do experts say is the most sustainable garment?", ["The one you already own", "A second-hand one", "One made of cotton", "The cheapest one"]]
    ] },
  { id: "rd-b2-2", level: "B2", icon: "🗣️", title: "Learning a language as an adult", es: "Aprender un idioma de adulta",
    paras: [
      ["It is often said that children learn languages effortlessly, while adults are doomed to struggle. Although there is some truth in this, research suggests the picture is more complicated.", "Se suele decir que los niños aprenden idiomas sin esfuerzo, mientras que los adultos están condenados a pasarlo mal. Aunque hay algo de verdad en esto, las investigaciones sugieren que el panorama es más complejo."],
      ["Children do have an advantage when it comes to pronunciation: those who start early are more likely to sound like native speakers. Adults, on the other hand, are better at understanding grammar rules, and they can use learning strategies that children simply don't have. In the first stages, adults often progress faster.", "Los niños sí tienen una ventaja cuando se trata de la pronunciación: los que empiezan temprano tienen más probabilidades de sonar como hablantes nativos. Los adultos, en cambio, entienden mejor las reglas gramaticales, y pueden usar estrategias de aprendizaje que los niños simplemente no tienen. En las primeras etapas, los adultos suelen avanzar más rápido."],
      ["What really makes the difference is not age but exposure and consistency. An adult who practices a little every day, is not afraid of making mistakes and uses the language in real situations will improve steadily. In other words, it is never too late; it just takes patience.", "Lo que realmente marca la diferencia no es la edad, sino el contacto con el idioma y la constancia. Un adulto que practica un poco todos los días, no tiene miedo de equivocarse y usa el idioma en situaciones reales va a mejorar de forma constante. En otras palabras, nunca es demasiado tarde; solo se necesita paciencia."]
    ],
    words: [["effortlessly", "sin esfuerzo"], ["doomed", "condenados"], ["struggle", "pasarlo mal / luchar"], ["when it comes to", "cuando se trata de"], ["likely", "probable"], ["stages", "etapas"], ["exposure", "contacto / exposición"], ["steadily", "de forma constante"]],
    qs: [
      ["What advantage do children have?", ["Pronunciation", "Grammar", "Learning strategies", "Patience"]],
      ["According to the text, adults…", ["often progress faster at first", "can never learn well", "learn only by reading", "always sound like native speakers"]],
      ["What really makes the difference?", ["Exposure and consistency", "Age", "Talent", "Expensive courses"]],
      ["What is the writer's conclusion?", ["It is never too late to learn", "Adults should not try", "Children should start later", "Grammar is not important"]]
    ] },
  { id: "rd-b2-3", level: "B2", icon: "🚲", title: "Cities without cars", es: "Ciudades sin autos",
    paras: [
      ["Imagine a city center where the loudest sounds are footsteps, conversations and bicycle bells. For a growing number of cities, this is no longer a fantasy. Pontevedra, in Spain, banned most traffic from its center in 1999 and has not looked back since.", "Imagina un centro de ciudad donde los sonidos más fuertes son pasos, conversaciones y timbres de bicicleta. Para cada vez más ciudades, esto ya no es una fantasía. Pontevedra, en España, prohibió la mayor parte del tráfico en su centro en 1999 y no ha mirado atrás desde entonces."],
      ["The results have been remarkable. Air pollution has dropped sharply, and no one has died in a traffic accident in the center for over a decade. Many local shop owners, who had feared losing customers, say that business has stayed strong.", "Los resultados han sido notables. La contaminación del aire ha bajado bruscamente, y nadie ha muerto en un accidente de tránsito en el centro en más de una década. Muchos dueños de tiendas locales, que temían perder clientes, dicen que el negocio se ha mantenido firme."],
      ["Of course, the model has its critics. Deliveries are more complicated, and people who live far from the center may depend on their cars. Still, as more cities experiment with car-free zones, the question is slowly shifting from whether we should reduce traffic to how quickly we can do it.", "Por supuesto, el modelo tiene sus críticos. Los repartos son más complicados, y la gente que vive lejos del centro puede depender de su auto. Aun así, a medida que más ciudades experimentan con zonas sin autos, la pregunta está pasando lentamente de si deberíamos reducir el tráfico a qué tan rápido podemos hacerlo."]
    ],
    words: [["footsteps", "pasos"], ["banned", "prohibió"], ["remarkable", "notables"], ["dropped sharply", "bajó bruscamente"], ["feared", "temían"], ["deliveries", "repartos"], ["shifting", "cambiando"]],
    qs: [
      ["What did Pontevedra do in 1999?", ["It banned most traffic from its center", "It built a new highway", "It made public transport free", "It closed its shops"]],
      ["Which result is mentioned?", ["Air pollution has dropped", "More tourists have arrived", "House prices have fallen", "Many shops have closed"]],
      ["What is one criticism of the model?", ["Deliveries are more complicated", "The city is too quiet", "Bicycles are dangerous", "It is too expensive for tourists"]],
      ["How is the question changing?", ["From whether to reduce traffic to how quickly", "From bicycles to buses", "From Spain to other countries", "From shops to offices"]]
    ] }
];

/* ===== ESCUCHAR: lines = frases de la historia [inglés, español]. Primero se escucha sin leer; el texto aparece al final ===== */
const LISTENINGS = [
  { id: "ls-a1-1", level: "A1", icon: "☕", title: "At the café", es: "En el café",
    lines: [
      ["Anna is at a café.", "Anna está en un café."], ["She is very hungry.", "Tiene mucha hambre."],
      ["She orders a cheese sandwich and an orange juice.", "Pide un sándwich de queso y un jugo de naranja."],
      ["The waiter says, \"Six dollars, please.\"", "El mesero dice: «Seis dólares, por favor»."],
      ["Anna looks in her bag.", "Anna mira en su bolso."], ["Oh no! Her money is at home.", "¡Oh, no! Su plata está en la casa."],
      ["Her friend Paul is at the next table.", "Su amigo Paul está en la mesa de al lado."], ["Paul pays for her lunch.", "Paul paga su almuerzo."],
      ["Anna says, \"Thank you! Tomorrow, I pay.\"", "Anna dice: «¡Gracias! Mañana pago yo»."]
    ],
    qs: [
      ["What does Anna order?", ["A cheese sandwich and an orange juice", "A coffee and a cake", "A salad and water", "Soup and bread"]],
      ["Where is her money?", ["At home", "In her bag", "In the car", "At work"]],
      ["Who pays for the lunch?", ["Paul", "Anna", "The waiter", "Nobody"]]
    ] },
  { id: "ls-a1-2", level: "A1", icon: "🛋️", title: "My day off", es: "Mi día libre",
    lines: [
      ["Today is Sunday, and I don't work.", "Hoy es domingo, y no trabajo."], ["I get up late, at ten o'clock.", "Me levanto tarde, a las diez."],
      ["I have breakfast in bed.", "Tomo desayuno en la cama."], ["Then I call my mother.", "Después llamo a mi mamá."],
      ["We talk for an hour.", "Hablamos una hora."], ["In the afternoon, I go to the park with my dog.", "En la tarde voy al parque con mi perro."],
      ["In the evening, I watch a movie and eat pizza.", "En la noche veo una película y como pizza."], ["I love Sundays.", "Me encantan los domingos."]
    ],
    qs: [
      ["What time does she get up?", ["At ten o'clock", "At seven o'clock", "At noon", "At eight o'clock"]],
      ["Who does she call?", ["Her mother", "Her friend", "Her boss", "Her sister"]],
      ["What does she do in the evening?", ["She watches a movie and eats pizza", "She goes to the park", "She works", "She cooks dinner for friends"]]
    ] },
  { id: "ls-a2-1", level: "A2", icon: "🗺️", title: "Lost in the city", es: "Perdido en la ciudad",
    lines: [
      ["Yesterday, Tom visited a new city.", "Ayer, Tom visitó una ciudad nueva."],
      ["He wanted to see the old cathedral, but he got lost.", "Quería ver la catedral antigua, pero se perdió."],
      ["He asked a woman for directions.", "Le pidió indicaciones a una mujer."],
      ["She said, \"Go straight for two blocks and then turn left at the bank.\"", "Ella dijo: «Sigue derecho dos cuadras y después dobla a la izquierda en el banco»."],
      ["Tom walked two blocks, but he turned right.", "Tom caminó dos cuadras, pero dobló a la derecha."],
      ["Ten minutes later, he was at the train station.", "Diez minutos después, estaba en la estación de trenes."],
      ["He asked again, and a young man walked with him to the cathedral.", "Preguntó otra vez, y un joven caminó con él hasta la catedral."],
      ["It was closed, but Tom took some nice photos outside.", "Estaba cerrada, pero Tom sacó unas lindas fotos afuera."]
    ],
    qs: [
      ["What did Tom want to see?", ["The old cathedral", "The train station", "The bank", "A museum"]],
      ["What mistake did he make?", ["He turned right, not left", "He walked ten blocks", "He took the wrong bus", "He forgot his map"]],
      ["Who walked with him to the cathedral?", ["A young man", "A woman", "A police officer", "Nobody"]],
      ["Was the cathedral open?", ["No, it was closed", "Yes, it was open", "Only the tower was open", "The story doesn't say"]]
    ] },
  { id: "ls-a2-2", level: "A2", icon: "📱", title: "A phone message", es: "Un mensaje de voz",
    lines: [
      ["Hi, Kate. This is Mark.", "Hola, Kate. Soy Mark."], ["I'm calling about the party on Saturday.", "Te llamo por la fiesta del sábado."],
      ["It's going to start at eight, not at seven.", "Va a empezar a las ocho, no a las siete."],
      ["Can you bring some drinks? I already have the food.", "¿Puedes traer bebidas? Ya tengo la comida."],
      ["My new address is 25 Green Street, apartment 4.", "Mi nueva dirección es Green Street 25, departamento 4."],
      ["Don't take the bus, because it doesn't run at night.", "No tomes el bus, porque no pasa de noche."],
      ["Call me back if you have any questions.", "Llámame si tienes alguna pregunta."], ["See you on Saturday!", "¡Nos vemos el sábado!"]
    ],
    qs: [
      ["What time does the party start?", ["At eight", "At seven", "At nine", "At six"]],
      ["What should Kate bring?", ["Drinks", "Food", "Music", "A cake"]],
      ["What is Mark's apartment number?", ["Four", "Twenty-five", "Seven", "Eight"]],
      ["Why shouldn't she take the bus?", ["It doesn't run at night", "It is expensive", "It is slow", "The stop is far away"]]
    ] },
  { id: "ls-b1-1", level: "B1", icon: "👔", title: "The job interview", es: "La entrevista de trabajo",
    lines: [
      ["Julia had been looking for a job for three months when she finally got an interview.", "Julia llevaba tres meses buscando trabajo cuando por fin consiguió una entrevista."],
      ["She prepared for days and practiced her answers in front of the mirror.", "Se preparó durante días y practicó sus respuestas frente al espejo."],
      ["On the day of the interview, she left home early, but the subway stopped between two stations for twenty minutes.", "El día de la entrevista salió temprano de su casa, pero el metro se detuvo entre dos estaciones durante veinte minutos."],
      ["She arrived ten minutes late, nervous and out of breath.", "Llegó diez minutos tarde, nerviosa y sin aliento."],
      ["To her surprise, the manager smiled and said that he had been on the same train.", "Para su sorpresa, el gerente sonrió y dijo que él había estado en el mismo tren."],
      ["They laughed about it, and the interview felt more like a conversation.", "Se rieron de eso, y la entrevista pareció más una conversación."],
      ["A week later, Julia received a call: the job was hers.", "Una semana después, Julia recibió una llamada: el trabajo era suyo."]
    ],
    qs: [
      ["How long had Julia been looking for a job?", ["Three months", "Three weeks", "A year", "A week"]],
      ["Why was she late?", ["The subway stopped", "She overslept", "She got lost", "She missed the bus"]],
      ["Why wasn't the manager angry?", ["He had been on the same train", "He didn't notice the time", "Julia had called him", "He was late because of traffic"]],
      ["How did the story end?", ["She got the job", "She had a second interview", "She didn't get the job", "She changed her mind"]]
    ] },
  { id: "ls-b1-2", level: "B1", icon: "⛈️", title: "A change of plans", es: "Un cambio de planes",
    lines: [
      ["We were planning to have a barbecue in the garden on Saturday.", "Estábamos planeando hacer un asado en el jardín el sábado."],
      ["We had bought the meat, invited twelve friends, and even borrowed extra chairs.", "Habíamos comprado la carne, invitado a doce amigos, e incluso conseguido sillas prestadas."],
      ["But on Saturday morning, the sky turned gray, and it started to rain heavily.", "Pero el sábado en la mañana, el cielo se puso gris y empezó a llover fuerte."],
      ["Instead of canceling, we moved everything into the living room.", "En vez de cancelar, trasladamos todo al living."],
      ["We cooked in the oven, pushed the furniture against the walls, and played board games.", "Cocinamos en el horno, corrimos los muebles contra las paredes y jugamos juegos de mesa."],
      ["Everyone said it was the best barbecue they had ever been to, even though there was no fire.", "Todos dijeron que era el mejor asado al que habían ido, aunque no hubo fuego."]
    ],
    qs: [
      ["Where was the barbecue supposed to be?", ["In the garden", "In the living room", "At the beach", "In a park"]],
      ["How many friends were invited?", ["Twelve", "Ten", "Twenty", "Two"]],
      ["What did they do when it rained?", ["They moved everything inside", "They canceled the barbecue", "They waited for the sun", "They went to a restaurant"]],
      ["How did the guests feel?", ["They loved it", "They were disappointed", "They left early", "They were bored"]]
    ] },
  { id: "ls-b2-1", level: "B2", icon: "😴", title: "A podcast about sleep", es: "Un podcast sobre el sueño",
    lines: [
      ["Welcome back to the show. Today we are talking about sleep.", "Bienvenidos de nuevo al programa. Hoy hablamos del sueño."],
      ["Most adults need between seven and nine hours a night, yet about a third of us regularly get less.", "La mayoría de los adultos necesita entre siete y nueve horas por noche, pero cerca de un tercio de nosotros duerme menos habitualmente."],
      ["The consequences go beyond feeling tired: lack of sleep affects memory, mood, and even the immune system.", "Las consecuencias van más allá de sentirse cansado: la falta de sueño afecta la memoria, el ánimo e incluso el sistema inmune."],
      ["Our guest, a sleep researcher, argues that the biggest enemy is not coffee but our screens.", "Nuestra invitada, una investigadora del sueño, sostiene que el mayor enemigo no es el café, sino nuestras pantallas."],
      ["The light from phones delays the hormone that tells the body it is time to rest.", "La luz de los teléfonos retrasa la hormona que le avisa al cuerpo que es hora de descansar."],
      ["Her advice is simple: keep your phone out of the bedroom, and go to bed at the same time every day.", "Su consejo es simple: deja el teléfono fuera del dormitorio y acuéstate a la misma hora todos los días."],
      ["It may sound boring, she admits, but consistency is what the body craves.", "Puede sonar aburrido, reconoce, pero la constancia es lo que el cuerpo pide."]
    ],
    qs: [
      ["How much sleep do most adults need?", ["Seven to nine hours", "Five to six hours", "Exactly eight hours", "Ten hours"]],
      ["What does lack of sleep affect?", ["Memory, mood and the immune system", "Only energy", "Only weight", "Hearing"]],
      ["According to the guest, what is the biggest enemy of sleep?", ["Screens", "Coffee", "Noise", "Work"]],
      ["What is her advice?", ["Keep the phone out of the bedroom", "Drink tea before bed", "Sleep during the day", "Exercise at night"]]
    ] },
  { id: "ls-b2-2", level: "B2", icon: "🔧", title: "The apartment problem", es: "El problema del departamento",
    lines: [
      ["When Diego moved into his new apartment, everything seemed perfect.", "Cuando Diego se mudó a su nuevo departamento, todo parecía perfecto."],
      ["Within a week, however, he discovered that the heating didn't work and that water leaked from the bathroom ceiling.", "En menos de una semana, sin embargo, descubrió que la calefacción no funcionaba y que goteaba agua del techo del baño."],
      ["He emailed the landlord three times without getting a reply.", "Le escribió tres correos al dueño sin recibir respuesta."],
      ["Eventually, he went to the office in person and explained, calmly but firmly, that he would stop paying rent unless the repairs were made.", "Finalmente fue a la oficina en persona y explicó, con calma pero con firmeza, que dejaría de pagar el arriendo a menos que hicieran los arreglos."],
      ["The landlord apologized, blamed a mix-up, and sent a plumber the very next day.", "El dueño se disculpó, le echó la culpa a una confusión y mandó un gásfiter al día siguiente."],
      ["Diego learned that being polite is important, but being persistent is what actually gets results.", "Diego aprendió que ser amable es importante, pero que ser persistente es lo que de verdad da resultados."]
    ],
    qs: [
      ["What problems did Diego find?", ["The heating and a water leak", "Noisy neighbors", "A broken door", "No internet"]],
      ["How many emails did he send?", ["Three", "One", "Five", "None"]],
      ["What did Diego say he would do?", ["Stop paying rent unless the repairs were made", "Move out immediately", "Call the police", "Fix everything himself"]],
      ["What is the lesson of the story?", ["Being persistent gets results", "Emails always work", "Landlords never listen", "It is better to stay quiet"]]
    ] }
];
