// Regenera Countries/index.json con todos los .js de esta carpeta.
// Conserva nombre/flag/default de las entradas que ya existían; las nuevas se
// añaden con el id sacado del nombre del fichero (edítalas a mano si quieres).
// Uso:  node Countries/generate-index.js
// (GitHub Pages no puede listar directorios, por eso hace falta el manifiesto.)
const fs = require('fs'), path = require('path');
const file = path.join(__dirname, 'index.json');
let old = { countries: [] };
try { old = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (_) {}
const prev = Object.fromEntries((old.countries || []).map(c => [typeof c === 'string' ? c : c.file, typeof c === 'string' ? { file: c } : c]));
const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.js') && f !== path.basename(__filename) && !f.startsWith('_')).sort();
const countries = files.map(f => {
  if (prev[f]) return prev[f];
  const id = f.replace(/\.js$/i, '').replace(/^pais-/, '');
  return { id, name: id.charAt(0).toUpperCase() + id.slice(1), file: f };
});
const out = { default: (countries.find(c => c.id === old.default) || countries[0] || {}).id, countries };
fs.writeFileSync(file, JSON.stringify(out, null, 2) + '\n');
console.log('index.json actualizado:', countries.map(c => c.id).join(', '));
