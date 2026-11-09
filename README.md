# Moncloa Strategy

Simulador político y estratégico: gobierna España durante una legislatura (deuda real heredada, salida de la UE, peseta…).
Es una web estática: no necesita servidor ni compilar nada.

## Subirlo a GitHub y publicarlo (GitHub Pages)

1. Crea un repositorio nuevo en github.com (por ejemplo `moncloa-strategy`), público.
2. Sube **todo el contenido de esta carpeta** (arrastrando los archivos en «Add file → Upload files», o con git):
   ```bash
   cd moncloa-strategy
   git init
   git add .
   git commit -m "Moncloa Strategy"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/moncloa-strategy.git
   git push -u origin main
   ```
3. En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
4. En 1-2 minutos estará en `https://TU_USUARIO.github.io/moncloa-strategy/`.

> Hace falta HTTPS para instalar la app; GitHub Pages ya lo da.

## Instalarlo como app

- **Ordenador (Chrome / Edge):** abre la URL y pulsa el icono de instalar en la barra de direcciones (o el botón ⬇ del juego, abajo a la derecha).
- **Android (Chrome):** menú ⋮ → *Instalar aplicación* (o *Añadir a pantalla de inicio*).
- **iPhone / iPad (Safari):** botón Compartir → *Añadir a pantalla de inicio*.

Una vez instalada funciona también sin conexión (la primera vez necesita internet para descargar Tailwind, iconos y fuentes, que luego quedan en caché).

## Tu progreso

- Se **autoguarda** cada mes de juego y al cerrar o cambiar de pestaña. En la pantalla de inicio aparece **Continuar partida**.
- Se guarda en el navegador de cada dispositivo (`localStorage`). Si borras los datos del navegador, se pierde.
- Para **pasar la partida del ordenador al móvil** (o hacer copia de seguridad) usa los botones de la esquina inferior derecha: **exportar** a un archivo `.json` e **importar** en el otro dispositivo.

## Música

Por defecto suena una música ambiental generada por el propio juego. Para usar la tuya, guarda un archivo `music/theme.mp3` (con licencia que permita publicarla). El botón ♪ de la esquina la activa o la silencia; el altavoz controla el volumen. El navegador solo deja sonar tras tu primer clic o toque.

## Himnos de partido

Al elegir partido en el pactómetro suena su himno, y en la noche electoral suena el del partido ganador. El interruptor es la banderita de la esquina inferior derecha.

Por defecto el juego genera una fanfarria original para cada partido (no son los himnos reales). Para usar los reales, guarda `music/himnos/ID.mp3` (por ejemplo `PSOE.mp3`, `PP.mp3`, `VOX.mp3`). Los IDs están en `music/himnos/LEEME.txt`. Los himnos suelen tener derechos de autor: piénsalo antes de subirlos a un repositorio público.

## Modo sin límite

En la pantalla de inicio, la cuarta tarjeta, **Sin límite**: las mismas reglas y riesgos que el resto (moción de censura, golpe, intervención), pero sin legislatura final. Gobiernas hasta que te echen y la dificultad sube con cada legislatura.

## Economía a escala

Todas las cifras se miden contra el presupuesto inicial de **100.000 M€**: la deuda heredada es de 100.000 M€ (99,7 % del PIB), el límite de nueva deuda es de 100.000 M€ y los grandes proyectos cuestan entre 8.000 y 14.000 M€.

## Militar y Guerra

Pestaña **Militar y Guerra** (grupo Exterior): mapamundi por países, fuerzas de tierra, mar y aire, diplomacia (pactos y sanciones), declaración de guerra, conflicto día a día y ultimátums de otros países. El mapa se descarga una vez de jsDelivr y queda en caché; sin conexión se ve un mapa simplificado.

## Efectos de sonido propios

Coloca archivos `.mp3` en `musica/efectos/`: `crisis`, `victoria`, `derrota`, `guerra`, `paz` y `disturbios`. Si no existen, el juego usa sonidos generados.

## Modo multijugador

Al abrir el juego aparece la **pantalla de inicio**: escribes tu nombre de usuario, eliges país y modo. España: *Un jugador* o *Crear partida multijugador* (online con código/enlace, o mismo dispositivo, con sala de espera). Otro país (Marruecos): entras con el código de sala del anfitrión. La portada se genera sola; si quieres una foto de fondo, guarda `img/portada.jpg` y se superpone automáticamente.

El modo «Transición democrática» se ha eliminado: el juego se centra en la actualidad.

Dos jugadores, en el mismo dispositivo **o en línea** (cada uno en el suyo: el anfitrión crea una sala con un código de 5 letras y el otro pulsa «Unirme a una sala»; conexión directa por WebRTC con PeerJS, sin servidor propio; el anfitrión debe mantener su pestaña abierta y en primer plano): uno gobierna **España** y el otro **Marruecos** (se activa con la casilla de la pantalla de inicio o desde la pestaña **Multijugador**, grupo Exterior). Se pasan el mando (la partida se pausa), se proponen pactos (comercial, fronterizo, defensa), se envían ayuda económica o se hacen presión diplomática y cierre de fronteras. Marruecos tiene su propia gestión: presupuesto por ministerios (educación, sanidad, defensa, infraestructuras, seguridad, agricultura), decretos propios, economía, tesoro y sucesos. Todo afecta a la relación bilateral de la partida.

**Añadir más países:** en `multijugador.js`, añade una entrada a `COUNTRIES` (estadísticas iniciales, ingresos y sucesos).

### Online más fiable con Supabase (opcional, gratis)

Por defecto el online usa PeerJS (sin cuentas), que a veces no conecta en redes móviles o de empresa. Para mayor fiabilidad:
1. Crea una cuenta gratuita en supabase.com y un proyecto nuevo (no hace falta crear tablas).
2. En **Project Settings → API** copia **Project URL** y la clave **anon public**.
3. Pégalas en `RELAY` al principio de `multijugador.js` (`url` y `key`) y sube el archivo. Esos dos datos son públicos, es seguro ponerlos en GitHub.

Con ellas rellenas, las salas pasan por Supabase Realtime; vacías, vuelve a PeerJS. Los proyectos gratuitos se pausan tras una semana sin uso (se reactivan desde el panel).

## Publicar cambios

Cuando cambies `index.html`, sube también un `VERSION` nuevo en `sw.js` (`'v2'`, `'v3'`…) para que los dispositivos que ya lo tienen instalado reciban la actualización.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | El juego completo |
| `manifest.webmanifest` | Datos de la app instalable (nombre, iconos, colores) |
| `multijugador.js` | Modo multijugador (países ampliables) |
| `sw.js` | Service worker: modo sin conexión |
| `icons/` | Iconos de la app |
| `music/` | Aquí va `theme.mp3` si quieres tu propia música |
