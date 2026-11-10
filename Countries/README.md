# Carpeta Countries/

Cada país es **un fichero completo** (formato de `plantilla-pais.js`: `SCENARIOS`,
`DYNAMIC_EVENTS`, `PRESS_NEWS_BANK`… 17 constantes globales). Como todos declaran las
mismas constantes, en cada partida se carga **solo uno**, antes del motor.

## Añadir un país nuevo (lo que haces tú)
1. Abre `plantilla-pais.js` y rellena la **FICHA** (basta con país y año).
2. Súbelo a un chat con Claude y escribe: **"Crea este país"**.
3. Claude te devuelve `Countries/<id>.js` (validado) y el `index.json` actualizado.
4. Copia ambos a `Countries/`, sube `VERSION` en `sw.js` y recarga con Ctrl+F5.

`plantilla-pais.js` lleva dentro las instrucciones para Claude y un validador, así que
no necesita nada más. Los ficheros que empiezan por `_` o `plantilla` no se cargan como países.

## index.json
`{ "default": "espana", "countries": [{ "id", "name", "flag", "file" }] }`
(`node Countries/generate-index.js` lo regenera y conserva lo que ya hayas editado).
Qué país se carga: `?pais=marruecos` en la URL > el último elegido > `default` > el primero.
`"enabled": false` en una entrada la oculta sin borrarla.

## Contenido propio vs. contenido del motor
El motor trae de serie el mazo de decisiones y el mapa de España. Para cualquier otro país:

| Qué | Cómo lo toma |
|---|---|
| Decisiones | `COUNTRY_DECISIONS` si el fichero lo define; si no, `DYNAMIC_EVENTS` |
| Mapa | `COUNTRY_MAP = { title, paths:[...] }` si lo define; si no, «Mapa no disponible» |
| Tesorería inicial | `SCENARIOS.ACTUAL.treasury` (M€); por defecto 75.000 |
| Año de inicio | `SCENARIOS.ACTUAL.startYear`; por defecto 2023 |
