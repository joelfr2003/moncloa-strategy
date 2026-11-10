// PLANTILLA DE PAÍS — copia este fichero, renómbralo (p. ej. francia.js)
// y añádelo a index.json (o ejecuta: node Countries/generate-index.js).
// Los ficheros que empiezan por "_" no deben incluirse en el manifiesto.
registerScenario({
  id: 'FRANCIA_ACTUAL',          // único; es la clave de SCENARIOS
  title: 'FRANCIA · V República',
  desc: 'Descripción que aparece en la tarjeta de selección.',
  startYear: 2024,               // opcional (por defecto 2023)
  parties: [
    // Mismo formato que los partidos de pais-espana.js
    // { id: 'XXX', name: '...', color: '#...', seats: 0, maxSeats: 350, spectrumOrder: 1, ideology: '...' },
  ],
  decisions: [
    // opcional: mazo propio. Si se omite, usa el mazo ACTUAL del motor.
  ]
});
