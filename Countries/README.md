# Carpeta Countries/

El motor (`index.html`) carga aquí todos los países al arrancar.

1. Cada país es un `.js` de esta carpeta.
2. Lista los ficheros en `index.json` (`node Countries/generate-index.js` lo regenera).
3. Fase de carga:
   - por defecto el fichero se ejecuta **antes** del motor (define escenarios);
   - `{ "file": "x.js", "phase": "after" }` o el nombre `x.after.js` lo ejecuta **después** del motor
     (y antes de `marruecos.js`).
4. Para escenarios nuevos usa `registerScenario({...})` (ver `_plantilla.js`).
   `espana.js` puede seguir definiendo `SCENARIOS` como hasta ahora (debe ir el primero).
5. `"enabled": false` en una entrada del manifiesto la desactiva sin borrarla.

Si falta `Countries/`, el motor usa `pais-espana.js` y `pais-marruecos.js` de la raíz.
