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

## Modo libre

En la pantalla de inicio, la cuarta tarjeta, **Modo libre**: no hay moción de censura, golpe, intervención ni fin automático de legislatura. Aparece una pestaña **Modo libre** para ajustar métricas, tesorería y deuda heredada, congelar valores, regular la frecuencia de crisis y **convocar elecciones cuando quieras**.

## Publicar cambios

Cuando cambies `index.html`, sube también un `VERSION` nuevo en `sw.js` (`'v2'`, `'v3'`…) para que los dispositivos que ya lo tienen instalado reciban la actualización.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | El juego completo |
| `manifest.webmanifest` | Datos de la app instalable (nombre, iconos, colores) |
| `sw.js` | Service worker: modo sin conexión |
| `icons/` | Iconos de la app |
| `music/` | Aquí va `theme.mp3` si quieres tu propia música |
