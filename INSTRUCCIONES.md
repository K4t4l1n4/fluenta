# Fluenta 2.0: instrucciones

## 1. Actualizar la app en GitHub Pages

**Si ya subiste la versión 1:**
1. Entra a tu repositorio `fluenta` en github.com.
2. Toca **Add file › Upload files**.
3. Arrastra **todos los archivos de esta carpeta** (incluida la carpeta `icons`). GitHub reemplaza los antiguos.
4. Toca **Commit changes** y espera 1 o 2 minutos.
5. En el iPhone, cierra la app y vuelve a abrirla dos veces para que cargue la versión nueva.

Tu progreso se mantiene: la versión 2.0 lee los datos de la 1.0.

**Si es la primera vez:**
1. En github.com toca **+ › New repository**, ponle de nombre `fluenta`, déjalo en **Public** y toca **Create repository**.
2. Toca **"uploading an existing file"**, arrastra todo el contenido de esta carpeta y toca **Commit changes**.
3. Ve a **Settings › Pages**, elige la rama **main**, la carpeta **/(root)** y toca **Save**.
4. Tu app quedará en `https://TU-USUARIO.github.io/fluenta/`.
5. Ábrela en **Safari** en el iPhone, toca **Compartir ⬆️** y luego **"Agregar a pantalla de inicio"**.

## 2. Que Claude revise tu progreso

1. En la app, entra a **Progreso** (o a Perfil) y toca **📤 Exportar progreso**.
2. En el iPhone se abre el menú de compartir. Elige una de estas opciones:
   - **Guardar en Archivos › iCloud Drive**, si tienes iCloud en el PC, o
   - **Mail o WhatsApp**, para enviártelo a ti misma.
3. En el PC, guarda el archivo `fluenta-progreso-FECHA.json` en:
   `C:\Users\catal\Desktop\APP 2.0\progreso`
4. Escríbele a Claude: **"revisa mi progreso"**.
5. Claude te entrega tus estadísticas, tus puntos débiles y un archivo de **refuerzo** (`fluenta-refuerzo-....json`).
6. Pasa ese archivo al iPhone y en la app toca **Perfil › 📥 Importar archivo**. Aparecerá en **Lecciones › Para ti**.

El mismo archivo exportado sirve de respaldo: si cambias de celular, impórtalo y recuperas todo.

## 3. Qué hay de nuevo en la 2.0

- **Diseño claro** con modo oscuro opcional (en Perfil › Apariencia).
- **Tarjetas:** si fallas una, vuelve a aparecer en el mismo repaso hasta que la aciertes.
- **12 diálogos ramificados:** según lo que respondas, la conversación cambia. Hay varios finales por descubrir.
- **24 lecciones:** 6 de repaso A1 y 18 de nivel A2, cada una con un tip de gramática.
- **Progreso 📊:** gráfico semanal y mensual, precisión por tipo de ejercicio, tus palabras más difíciles y las palabras que más te cuesta pronunciar.
- **Lección "Mis errores":** se arma sola con lo que más fallas.
- **Exportar e importar** tu progreso y los refuerzos.

## 4. Micrófono

- La primera vez que lo uses, toca **Permitir**.
- Si aparece un error de dictado, actívalo en **Ajustes › General › Teclado › Activar dictado**.
- Necesita internet. Las lecciones, las tarjetas y el modo "Elegir" de los diálogos funcionan sin conexión.

## 5. Editar contenido

- Todo el contenido está en **data.js**: lecciones, diálogos y frases. Copia un bloque, cambia el texto y súbelo a GitHub.
- Los colores están al principio de **styles.css**.
