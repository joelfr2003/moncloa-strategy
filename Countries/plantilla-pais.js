// =====================================================================
//  PLANTILLA DE PAÍS — MONCLOA STRATEGY  (Countries/plantilla-pais.js)
//  Copia este fichero como Countries/<id>.js (p. ej. italia.js), rellénalo y añádelo a Countries/index.json:
//    { "id": "italia", "name": "Italia", "flag": "IT", "file": "italia.js" }
//  Los ficheros que empiezan por "plantilla" o "_" no se cargan como países.
//  Todo son `const` de nivel superior (no uses export/import). Los comentarios //  ⇒ explican cada bloque.
//  Para que una IA te lo genere, usa PLANTILLA-IA.md (instrucciones paso a paso) junto a este fichero.
//  Métricas del juego (siempre estas 6): eco=Economía, est=Estabilidad, emp=Empleo, con=Consenso/Concordia, apr=Aprobación, mil=Lealtad militar.
//  Importes: M€ (millones) a escala de juego. COUNTRY_ECON.k los escala (k=1 → España).
// =====================================================================

// 1) CÁMARA ─ escaños totales y mayoría absoluta
const CHAMBER = { seats: 350, majority: 176 };

// 2) ESCENARIOS ─ clave ACTUAL obligatoria. Los partidos deben sumar `seats` = CHAMBER.seats.
const SCENARIOS = {
  ACTUAL: {
    id: 'ACTUAL', title: 'MI PAÍS (2026)', desc: 'Situación política de partida en dos o tres frases.',
    parties: [
      // id corto en MAYÚSCULAS; ideology: texto libre; spectrumOrder: 1 = izquierda … n = derecha;
      // redLines: partidos con los que NO pactará; isRegional: true si es un partido territorial.
      { id: 'PARTIDO_A', name: 'Nombre del partido A', leader: 'Líder A', seats: 150, baseSeats: 150, minSeats: 40, maxSeats: 350, basePct: 35, color: '#e11d48', isRegional: false, ideology: 'Centroizquierda', spectrumOrder: 2, redLines: ['PARTIDO_C'] },
      { id: 'PARTIDO_B', name: 'Nombre del partido B', leader: 'Líder B', seats: 120, baseSeats: 120, minSeats: 40, maxSeats: 350, basePct: 30, color: '#2563eb', isRegional: false, ideology: 'Centroderecha', spectrumOrder: 4, redLines: [] },
      { id: 'PARTIDO_C', name: 'Nombre del partido C', leader: 'Líder C', seats: 80, baseSeats: 80, minSeats: 10, maxSeats: 350, basePct: 20, color: '#16a34a', isRegional: false, ideology: 'Derecha radical', spectrumOrder: 5, redLines: ['PARTIDO_A'] }
    ]
  }
};

// 3) DECISIONES DE GOBIERNO ─ eventos con opciones (≈ 20-40). Se barajan durante la partida.
//    stats: efecto inmediato en métricas · cost: M€ (negativo = ingreso) · loyaltyImpact: lealtad de cada partido (±) · news: titular.
const DYNAMIC_EVENTS = [
  { id: 'EV_1', category: 'ECONOMÍA', title: 'TÍTULO EN MAYÚSCULAS', desc: 'Descripción del dilema.',
    options: [
      { text: 'Opción 1', stats: { eco: 3, apr: 1 }, cost: 500, loyaltyImpact: { PARTIDO_A: 8, PARTIDO_C: -6 }, news: 'Titular si eliges la opción 1.' },
      { text: 'Opción 2', stats: { eco: -2, apr: 3 }, cost: 0, loyaltyImpact: { PARTIDO_B: 6 }, news: 'Titular si eliges la opción 2.' }
    ] }
];

// 4) TITULARES DE CAMPAÑA ─ preguntas de prensa en campaña electoral. score: puntos de campaña (+/−).
const CAMPAIGN_HEADLINES = [
  { id: 1, newspaper: 'DIARIO NACIONAL', headline: 'TITULAR DE CAMPAÑA', desc: 'Pregunta o situación.',
    options: [ { text: 'Respuesta A', score: +8, textResult: 'Resultado de la respuesta A.' }, { text: 'Respuesta B', score: -6, textResult: 'Resultado de la respuesta B.' } ] }
];

// 5) NOTICIAS DE PRENSA ─ ≈ 100 piezas. Misma estructura que las opciones de arriba, sin coste ni lealtad.
const PRESS_NEWS_BANK = [
  { id: 'NEWS_1', newspaper: 'DIARIO NACIONAL', headline: 'TITULAR', desc: 'Entradilla.',
    options: [ { text: 'Respuesta 1', stats: { eco: 4, apr: 3 }, news: 'Titular posterior.' }, { text: 'Respuesta 2', stats: { eco: 2, est: 2 }, news: 'Otro titular.' } ] }
];

// 6) DECISIONES POR MINISTERIO ─ ≈ 20 por ministerio. Claves FIJAS (no cambies los ids):
//    sanidad, educacion, infraestructuras, interior, defensa, economia, vivienda, territorio, trabajo, justicia, exteriores, transicion_ecologica, cultura, igualdad
const MINISTRY_DECISIONS_BANK = {
  sanidad: [ { title: 'Compra extraordinaria de equipamiento hospitalario', cost: 450, stats: { apr: 2, est: 1 } } ],
  educacion: [ { title: 'Plan de becas y refuerzo escolar', cost: 350, stats: { apr: 2, emp: 1 } } ],
  infraestructuras: [], interior: [], defensa: [], economia: [ { title: 'Auditoría del gasto', cost: -200, stats: { eco: 1 } } ],
  vivienda: [], territorio: [], trabajo: [], justicia: [], exteriores: [], transicion_ecologica: [], cultura: [], igualdad: []
};

// 7) EVENTOS DE VIVIENDA/PROTESTA ─ 3-4 eventos con 3 opciones (mismos campos que DYNAMIC_EVENTS).
const HOUSING_EVENTS = [
  { id: 'HOUS_1', category: 'VIVIENDA & PROTESTAS', title: 'PROTESTAS POR LA VIVIENDA', desc: 'Miles de personas salen a la calle.',
    options: [ { text: 'Congelar alquileres', stats: { apr: 10, eco: -4 }, cost: 1000, loyaltyImpact: { PARTIDO_A: 15, PARTIDO_B: -15 }, news: 'El Gobierno congela alquileres.' } ] }
];

// 8) MINISTROS ─ candidatos reales por cartera (≈ 5 por cartera). portfolio = una de las claves del punto 6.
//    effects: ajuste inicial de métricas; pros/cons: texto de ventajas e inconvenientes.
const REAL_MINISTERS = [
  { id: 'min_economia_1', name: 'Nombre y apellidos', party: 'PARTIDO_A', portfolio: 'economia', desc: '+1.5% Economía', pros: '+1.5% Economía', cons: '-1.0% Aprobación', effects: { eco: 1.5, apr: -1 } }
];

// 9) MISIONES ─ objetivos sostenibles (check recibe el estado `s`). Ya NO dan dinero, solo Capital político y aprobación.
const GOAL_POOL = [
  { id: 'eco', icon: 'fa-chart-line', title: 'Milagro Económico', desc: 'Mantén la Economía ≥ 70%', check: s => s.metrics.eco >= 70 },
  { id: 'caja', icon: 'fa-vault', title: 'Superávit', desc: 'Acumula una tesorería ≥ 120.000 M€', check: s => (Number(s.treasury) || 0) >= 120000 }
];

// 10) ACCIONES PRESIDENCIALES ─ cap: Capital político · cost: M€ · cd: días de enfriamiento · gain: M€ que ahorra (úsalo con moderación).
const GOAL_ACTIONS = [
  { id: 'tv', icon: 'fa-tv', title: 'Comparecencia televisada', cap: 15, cost: 0, cd: 30, fx: { apr: 6, est: 2 }, news: 'El presidente comparece en prime time.' }
];

// 11) FOCOS NACIONALES ─ árbol de reformas. b: rama (eco, soc, ...) · days: duración · now: efecto al terminar
//     spirit: efecto permanente diario (daily) y balance mensual (money). NO pongas `cash` positivo: ya no se cobra.
const FOCUS_TREE = [
  { id: 'e1', b: 'eco', title: 'Reforma Fiscal', days: 365, now: { eco: 4 }, spirit: { name: 'Hacienda Eficiente', daily: { eco: 0.02 }, money: 600 } }
];
// 12) ENLACES ENTRE MÉTRICAS ─ efectos en cadena (on: condición sobre las métricas m, fx: efecto diario)
const FOCUS_LINKS = [ { t: 'Economía hundida destruye empleo', on: m => m.eco < 40, fx: { emp: -0.08 } } ];

// 13) CRISIS ─ shocks externos. min: ministerio implicado.
const SHOCK_POOL = [
  { cat: 'EMERGENCIA', min: 'interior', title: 'INCENDIOS FORESTALES', desc: 'Descripción.',
    options: [ { text: 'Desplegar medios', cost: 400, stats: { est: 3, apr: 2 }, news: 'Titular.' }, { text: 'No actuar', cost: 0, stats: { est: -4, apr: -5 }, news: 'Titular.' } ] }
];

// 14) ACCIONES EXTERIORES BÁSICAS ─ (se suelen dejar así)
const INTL_ACTIONS = [
  { id: 'visit', title: 'Visita oficial', cap: 10, cost: 0, rel: 12, cd: 40 },
  { id: 'trade', title: 'Acuerdo comercial', cap: 0, cost: 80, rel: 8, cd: 30 }
];

// 15) PROYECTOS DE ESTADO ─ ≈ 8. Cada fase cuesta M€ y días; `run` = efecto diario mientras se construye.
const PROJECTS = [
  { id: 'tren', icon: 'fa-train-subway', title: 'Gran proyecto ferroviario', spirit: { name: 'País conectado', daily: { eco: 0.04, emp: 0.02 }, money: 140 },
    phases: [ { n: 'Estudios', cost: 2400, days: 35, now: {}, run: {} }, { n: 'Obras', cost: 14500, days: 120, now: { emp: 2 }, run: { emp: 0.02 } }, { n: 'Puesta en servicio', cost: 6000, days: 50, now: { eco: 2 }, run: {} } ] }
];

// 16) LOGROS ─ persisten en el navegador. ok(s) recibe el estado. Los logros no dan dinero.
const ACHIEVEMENTS = [
  { id: 'm1', icon: 'fa-flag', title: 'Primer Mandato', desc: 'Cumple tu primera misión', ok: s => s.goals && s.goals.done >= 1 }
];

// 17) BANCO CENTRAL ─ gobernadores (cred = credibilidad inicial) y acciones.
const BDE_GOVS = [ { id: 'tecnico', name: 'Nombre', tag: 'Tecnócrata ortodoxo', cred: 15, desc: 'Los mercados lo adoran.' } ];
const BDE_ACTIONS = [
  { id: 'informe', icon: 'fa-file-lines', label: 'Encargar un informe de solvencia', desc: 'Calma a los mercados.', cost: 150, cd: 60, when: () => true, run: B => { B.cred += 4; } }
];

// 18) ECONOMÍA Y TÉRMINOS ─ lo más importante para que el país "suene" propio.
const COUNTRY_ECON = {
  currency: '€',                                   // símbolo (sustituye a M€ → M$ …)
  terms: { gov: 'El Gobierno', place: 'Sede del Gobierno', cabinet: 'Consejo de Ministros', bank: 'Banco Central', nation: 'Mi País',
           adj: 'nacional', firms: 'nacionales', capital: 'Capital', curName: 'Euro', sovereign: true,   // sovereign:false = pertenece a la UE y no controla su moneda
           pollster: 'Instituto demoscópico', pollsterLong: 'Instituto demoscópico nacional',
           oldCur: null },                          // o { name: 'franco', sym: 'FF', rate: 6.55957 } si volvería a su moneda histórica
  eu: { exit: {}, undo: {} },                       // lealtad de cada partido al salir/revertir la salida de la UE (solo si sovereign:false)
  hideMin: [],                                      // ministerios que no existen en este país
  k: 1.0, budget: 100000, budgetStep: 1000,         // k escala los importes; budget = presupuesto mensual de referencia
  pib: 1700000, debt: 1695000, macroPib: 100300, revPct: 0.42, pensPct: 0.12, otherPct: 0.225, baseRate: 1.9, debtMax: 300000, cashCap: 90000,
  preset: { sanidad: 30000, educacion: 20000, defensa: 10000, vivienda: 5000, infraestructuras: 8000, deuda: 20000 },
  hint: 'Una frase sobre cómo es el presupuesto.',
  labels: {}, pct: { sanidad: 22, educacion: 15, infraestructuras: 8, interior: 7, defensa: 12, economia: 10, vivienda: 6 },
  names: {}, descs: {},                             // nombres y descripciones propias de ministerios
  war: {                                            // datos del mapa de Guerra
    id: 380,                                        // código ISO numérico del país en el mapa
    name: 'Mi País', lat: 42, lon: 12, allied: 'OTAN|UE',   // bloques de los socios con los que NO se puede ir a la guerra
    own: { t: 50, m: 40, a: 50 },                   // fuerza inicial Tierra / Armada / Aire (0-100)
    add: [[724, 'España', 48, 'UE·OTAN', 1, 80, 0, 40, -4]],   // países que faltan en el mapa (el vecino que quieras poder atacar): [iso, nombre, fuerza, bloque, proyección, relación, nuclear(0/1), lat, lon]
    drop: [],
    rel: { 724: 80, 250: 76 }                       // relación inicial con otros países (iso: 0-100)
  }
};

// 19) DEMOGRAFÍA ─ la lee demografia.js (pestaña Demografía). Usa datos reales del país.
const COUNTRY_DEMO = {
  pop: 40,                           // millones de habitantes
  sh: [.17, .17, .20, .28, .18],     // franjas 0-14, 15-29, 30-44, 45-64, 65+ (suman 1)
  tfr: 1.5,                          // hijos por mujer
  mig: 100,                          // saldo migratorio neto (miles/año; negativo = emigración)
  mort: 1.0,                         // mortalidad relativa (1 = país rico, 1.3 = menor esperanza de vida)
  ss: 1.0,                           // sensibilidad de la caja a la pirámide (0.6 sistema pequeño … 1.3 muy generoso)
  warScale: 300,                     // soldados por unidad de baja de guerra
  ssName: 'Seguridad Social', retName: 'pensionistas',
  note: 'Dos frases sobre el reto demográfico de este país.'
};

// 20) MAPA ─ regiones (paths SVG en viewBox 0 0 500 400 aprox.). spectrumPref: 1 izquierda … 10 derecha.
const COUNTRY_MAP = {
  title: 'Mapa de las regiones de Mi País',
  paths: [ { id: 'REG1', name: 'Región 1', d: 'M 100,100 L 200,100 L 200,200 L 100,200 Z', spectrumPref: 5, regionalist: false, desc: 'Región 1 · Rasgos políticos y económicos.' } ]
};

// 21) RELACIONES EXTERIORES ─ socios (≈ 8). ally/tense: efecto diario y dinero mensual según relación alta/baja.
const COUNTRY_INTL = {
  blocksText: 'Bloque A↔Bloque B',
  partners: { ue: { name: 'Unión Europea', icon: 'fa-earth-europe', ally: { name: 'Buena sintonía con Bruselas', daily: { eco: 0.05 }, money: 1500 }, tense: { name: 'Choque con Bruselas', daily: { eco: -0.04 }, money: -700 } } },
  base: { ue: 60 },                                  // relación inicial 0-100
  links: { ue: { } },                                // arrastres entre socios: links[a][b] = cuánto mueve a b un cambio en a
  map: { ue: [724, 380, 250] },                      // países ISO que pertenecen a cada socio/bloque
  actions: { ue: [ { id: 'cum', title: 'Cumbre europea', cap: 8, cd: 60, fx: { ue: 10 } } ] },   // fx: cambio de relación · now: efecto inmediato · cost/inc: M€
  monthly: [ { m: 'eco', gt: 70, fx: { ue: .8 }, why: 'Credibilidad económica' } ],
  pop: [ { id: 'ev1', cond: r => r.ue <= 25, title: 'CRISIS CON BRUSELAS', desc: 'Descripción.',
           options: [ { text: 'Negociar', intl: { ue: 8 }, cost: 600, stats: { eco: 1 }, news: 'Titular.' } ] } ]
};

// 22) DECRETOS ─ pestaña de decretos (BOE en España, Órdenes ejecutivas en EE. UU.).
const COUNTRY_DECREES = {
  tab: 'Decretos',
  items: [ { id: 'DEC_1', title: 'Decreto de ejemplo', cost: 5000, desc: '+0.3% Aprobación al día (25 días).', cooldown: 60, statsPerDay: { apr: 0.3 } } ]
};

// 23) SOCIEDAD ─ colectivos (sindicatos, patronal…) y escándalos. tgt: nivel objetivo de cada colectivo según métricas m.
const COUNTRY_SOCIETY = {
  intro: 'Una frase sobre cómo pesa la calle en este país.',
  cols: [ { id: 'syn', name: 'Sindicatos y asalariados', icon: 'fa-hammer', tgt: m => m.emp * .7 + m.apr * .3, hit: { emp: -0.04 }, up: { emp: 0.02 } } ],
  scandals: [ { t: 'Caso de corrupción', d: 'Los medios revelan contratos sospechosos.',
    o: [ { x: 'Dejar actuar a la Justicia', now: { apr: -4 }, cap: 5, later: [40, { est: 3, apr: 2 }, 'La transparencia se recompensa'] },
         { x: 'Cesar a los implicados', now: { apr: -2 }, money: 400, later: [30, { apr: 3 }, 'La auditoría limpia tu imagen'] } ] } ]
};
