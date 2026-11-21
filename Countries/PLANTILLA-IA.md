# Cómo crear un país nuevo con una IA (MONCLOA STRATEGY)

Adjunta a la IA **este documento**, `plantilla-pais.js` y, como ejemplo de calidad, `francia.js` (o el país más parecido).

## Paso 0 · Instrucción base (pégala tal cual)

> Eres el generador de países de MONCLOA STRATEGY. Crea el fichero `Countries/<id>.js` para **<PAÍS>** siguiendo EXACTAMENTE la estructura de `plantilla-pais.js` (mismos nombres de `const`, mismos campos y mismas claves). Reglas:
> 1. Es JavaScript válido, solo `const` de nivel superior, sin `import`/`export`. Textos en español; nombres propios, cargos e instituciones en el idioma local.
> 2. Datos reales y actuales (usa búsqueda web): partidos, escaños, líderes, ministros, PIB, deuda, población, pirámide de edad, natalidad, fuerzas armadas.
> 3. Métricas válidas: `eco`, `est`, `emp`, `con`, `apr`, `mil`. Efectos inmediatos entre −12 y +12; efectos diarios (`daily`, `run`, `statsPerDay`) entre −0,1 y +0,1.
> 4. **No des dinero gratis**: ni misiones, ni logros, ni focos dan dinero (no uses `cash` positivo). `gain` solo en acciones de recorte, con importes pequeños.
> 5. Los importes están en M€ a escala de juego: usa `COUNTRY_ECON.k` y `budget` coherentes con el PIB del país (España: k=1, budget=100000; Francia: k=1,6, budget=480000).
> 6. Al terminar, valida con `node --check Countries/<id>.js` y cárgalo en el juego.

## Paso 1 · Por bloques (pídelos de uno en uno para que no se corte)

| Orden | Bloques de la plantilla | Qué pedir a la IA |
|---|---|---|
| 1 | `CHAMBER`, `SCENARIOS` | Escaños, mayoría y todos los partidos con escaños (suma exacta = `CHAMBER.seats`), colores, `spectrumOrder` y `redLines`. |
| 2 | `COUNTRY_ECON` | Moneda, términos (`terms`), presupuesto, deuda, PIB, nombres de ministerios y `war` (código ISO del país, vecinos en `add`, relaciones `rel`). |
| 3 | `COUNTRY_DEMO` | Población, franjas de edad, hijos por mujer, migración, mortalidad, nombre de la Seguridad Social y una nota. |
| 4 | `REAL_MINISTERS` | ~5 candidatos reales por cartera (14 carteras). |
| 5 | `DYNAMIC_EVENTS`, `CAMPAIGN_HEADLINES`, `PRESS_NEWS_BANK`, `HOUSING_EVENTS` | 30 eventos / 10 titulares de campaña / 100 noticias / 4 eventos de vivienda, con `loyaltyImpact` usando los `id` de partidos. |
| 6 | `MINISTRY_DECISIONS_BANK` | ~20 decisiones por cada una de las 14 claves fijas. |
| 7 | `GOAL_POOL`, `GOAL_ACTIONS`, `FOCUS_TREE`, `FOCUS_LINKS`, `SHOCK_POOL`, `PROJECTS`, `ACHIEVEMENTS` | Misiones, acciones presidenciales, árbol de focos, crisis, proyectos de Estado y logros propios del país. |
| 8 | `BDE_GOVS`, `BDE_ACTIONS` | Banco central: gobernadores y acciones. |
| 9 | `COUNTRY_INTL`, `INTL_ACTIONS` | ~8 socios exteriores con `base`, `links`, `map` (códigos ISO), acciones y eventos `pop`. |
| 10 | `COUNTRY_DECREES`, `COUNTRY_SOCIETY` | Nombre y lista de decretos; colectivos sociales y escándalos. |
| 11 | `COUNTRY_MAP` | Regiones con paths SVG. Pide que los genere "a escala 0-500 × 0-400" a partir de un mapa real. |

## Paso 2 · Registrar el país

1. Guarda el fichero como `Countries/<id>.js`.
2. Añade al final de la lista de `Countries/index.json`:
   `{ "id": "<id>", "name": "<Nombre>", "flag": "<ISO2>", "file": "<id>.js" }`
3. En `multijugador.js`, línea `const WISO = {...}`, añade `<id>: <código ISO numérico>` (por ejemplo `italia: 380`) para poder atacarse entre jugadores.
4. Sube `VERSION` en `sw.js`.

## Paso 3 · Comprobaciones

- `node --check Countries/<id>.js` sin errores.
- Abre `index.html?pais=<id>`: sin errores rojos en la consola, el selector de país muestra el nuevo país y se ve la pestaña Demografía.
- Mapa de Guerra: el país y sus vecinos están en el mapa (si un vecino sale en gris, falta en `war.add`).
- Tesorería: juega 1 año y comprueba que el dinero no se dispara (no debe multiplicarse por 5).
- Pídele a la IA que revise: "¿hay `cash` positivos, ids duplicados o partidos que no suman los escaños?"
