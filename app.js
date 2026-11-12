/* Fluenta 3.7: el código se dividió en la carpeta js/.
   Este archivo queda solo por si el teléfono todavía tiene guardada la página anterior
   (que pedía app.js): carga los archivos nuevos en orden. Se puede borrar en una versión próxima. */
['extra.js', 'vocab.js', ...['base', 'voz', 'inicio', 'lecciones', 'hablar', 'repaso', 'diccionario', 'escribir', 'tiempos', 'progreso', 'traductor', 'cuentos', 'aprender', 'juegos', 'acciones'].map(f => 'js/' + f + '.js')].forEach(src => {
  const s = document.createElement('script');
  s.src = src; s.async = false;
  document.head.appendChild(s);
});
