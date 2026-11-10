// Regenera Countries/index.json con todos los .js de esta carpeta.
// Uso:  node Countries/generate-index.js
// (GitHub Pages no puede listar directorios, por eso hace falta el manifiesto.)
const fs = require('fs'), path = require('path');
const files = fs.readdirSync(__dirname)
  .filter(f => f.endsWith('.js') && f !== path.basename(__filename))
  .sort();
const countries = files.map(f => /\.after\.js$/i.test(f) ? { file: f, phase: 'after' } : f);
fs.writeFileSync(path.join(__dirname, 'index.json'), JSON.stringify({ countries }, null, 2) + '\n');
console.log('index.json actualizado con', files.length, 'fichero(s):', files.join(', '));
