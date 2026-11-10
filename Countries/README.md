# Carpeta Countries/

Cada país es **un fichero completo** (el formato de `plantilla-pais.js`: `SCENARIOS`,
`DYNAMIC_EVENTS`, `PRESS_NEWS_BANK`, … 17 constantes globales). Como todos declaran las
mismas constantes, en cada partida se carga **solo uno**, antes del motor.

- `index.json` lista los países: `{ "default": "espana", "countries": [{ "id", "name", "flag", "file" }] }`
  (`node Countries/generate-index.js` lo regenera y conserva lo que ya hayas editado).
- Qué país se carga: `?pais=marruecos` en la URL > el último elegido > `default` > el primero.
- El selector «ELIGE EL PAÍS» de la pantalla de inicio guarda la elección y recarga la página.
- `"enabled": false` en una entrada la oculta sin borrarla.

## Contenido propio vs. contenido del motor
El motor trae de serie el **mazo de decisiones** (`DECISION_BANK`) y el **mapa provincial** de
España. Para cualquier otro país:

| Qué | Cómo lo toma |
|---|---|
| Decisiones | `COUNTRY_DECISIONS` si el fichero lo define (array, u objeto por id de escenario); si no, `DYNAMIC_EVENTS` |
| Mapa | `COUNTRY_MAP = { title, paths:[{id,name,d,desc,spectrumPref}] }` si lo define; si no, un aviso «mapa no disponible» |

Si falta `Countries/`, el motor usa `pais-espana.js` de la raíz.
