// =====================================================================
//  PLANTILLA DE PAÍS — MONCLOA STRATEGY
//  Copia este fichero como Countries/<pais>.js (sin "pais-" ni "_" delante: los
//  ficheros que empiezan por "_" se ignoran) y rellénalo. Marruecos es el ejemplo completo.
//
//  PASOS
//  1. Rellena las constantes de abajo (todas son `const` globales, sin import/export).
//  2. Ejecuta:  node Countries/generate-index.js   (añade el país a index.json)
//  3. Edita en index.json el nombre, "flag" (ISO-2) y, si quieres, "default".
//  4. Sube VERSION en sw.js (v28 -> v29) y recarga con Ctrl+F5.
//
//  REGLAS DE FORMATO
//  · Métricas del motor: eco, est, emp, con, apr, mil (0-100). Todo `stats` usa solo esas.
//  · Dinero en M€ a escala del país. cost > 0 gasta Tesorería; income > 0 ingresa.
//  · Ministerios (lista cerrada): sanidad, educacion, infraestructuras, interior, defensa,
//    economia, vivienda, territorio, trabajo, justicia, exteriores, transicion_ecologica,
//    cultura, igualdad.
//  · loyaltyImpact usa los id de partido de SCENARIOS (+ sube lealtad, - baja).
//  · Funciones (condition, check, ok, on, when, cond) son flechas JS normales.
//  · Todo texto en español. Si falta una constante opcional, el motor usa un valor neutro.
// =====================================================================

// ---- 1. CÁMARA Y PARTIDOS ----------------------------------------------------------
const CHAMBER = { seats: 300, majority: 151 };
const SCENARIOS = {
  ACTUAL: {
    id: 'ACTUAL', title: 'NOMBRE DEL PAÍS (2026)', treasury: 5000, startYear: 2026,
    desc: 'Contexto político inicial en 2-3 frases.',
    parties: [
      // spectrumOrder 1 (izquierda) a 7 (derecha). redLines = partidos con los que NO pactará.
      // La suma de baseSeats debe ser igual a CHAMBER.seats.
      { id: 'AAA', name: 'Partido A', leader: 'Líder A', seats: 150, baseSeats: 150, minSeats: 0, maxSeats: 200,
        basePct: 50, color: '#2563eb', isRegional: false, ideology: 'Centroderecha', spectrumOrder: 5, redLines: ['BBB'] },
      { id: 'BBB', name: 'Partido B', leader: 'Líder B', seats: 150, baseSeats: 150, minSeats: 0, maxSeats: 200,
        basePct: 50, color: '#dc2626', isRegional: false, ideology: 'Izquierda', spectrumOrder: 2, redLines: ['AAA'] }
    ]
  }
};

// ---- 2. EVENTOS Y DECISIONES (todos: { options: [ {text, stats, cost, loyaltyImpact, news} ] }) ----
const DYNAMIC_EVENTS = [   // decisiones de gobierno
  { id: 'EV_1', category: 'ECONOMÍA', title: 'TÍTULO', desc: 'Descripción.', condition: m => true,
    options: [ { text: 'Opción 1', stats: { eco: 3, apr: -2 }, cost: 0, loyaltyImpact: { AAA: 10, BBB: -10 }, news: 'Titular.' },
               { text: 'Opción 2', stats: { apr: 2 }, cost: 200, loyaltyImpact: { BBB: 10 }, news: 'Titular.' } ] }
];
const CAMPAIGN_HEADLINES = [   // preguntas de campaña: score suma/resta puntos de campaña
  { id: 1, newspaper: 'PERIÓDICO', headline: 'TITULAR', desc: 'Pregunta.',
    options: [ { text: 'Respuesta A', score: 10, textResult: 'Resultado.' }, { text: 'Respuesta B', score: -5, textResult: 'Resultado.' } ] }
];
const PRESS_NEWS_BANK = [      // «Última hora» de la pestaña Prensa
  { id: 'NEWS_1', newspaper: 'PERIÓDICO', headline: 'TITULAR', desc: 'Descripción.',
    options: [ { text: 'Opción', stats: { apr: 3 }, cost: 100, news: 'Titular.' }, { text: 'Otra', stats: { apr: -3 }, news: 'Titular.' } ] }
];
const MINISTRY_DECISIONS_BANK = {   // 2-4 decisiones por ministerio de la lista cerrada
  sanidad: [ { title: 'Decisión de Sanidad', cost: 400, stats: { apr: 5, est: 2 } } ],
  educacion: [], infraestructuras: [], interior: [], defensa: [], economia: [], vivienda: [], territorio: [],
  trabajo: [], justicia: [], exteriores: [], transicion_ecologica: [], cultura: [], igualdad: []
};
const HOUSING_EVENTS = [       // protestas sociales (misma forma que DYNAMIC_EVENTS, con category 'PROTESTAS SOCIALES')
  { id: 'HOUS_1', category: 'PROTESTAS SOCIALES', title: 'TÍTULO', desc: 'Descripción.',
    options: [ { text: 'Opción', stats: { apr: 6 }, cost: 300, loyaltyImpact: {}, news: 'Titular.' }, { text: 'Otra', stats: { apr: -6, est: -3 }, news: 'Titular.' } ] }
];
const SHOCK_POOL = [           // emergencias aleatorias; min = ministerio responsable
  { cat: 'EMERGENCIAS', min: 'interior', title: 'TÍTULO', desc: 'Descripción.',
    options: [ { text: 'Actuar', cost: 250, stats: { est: 3 }, news: 'Titular.' }, { text: 'No actuar', cost: 0, stats: { est: -4, apr: -4 }, news: 'Titular.' } ] }
];

// ---- 3. GOBIERNO Y MISIONES ---------------------------------------------------------
const REAL_MINISTERS = [       // 1-2 por cartera. effects: cambios permanentes en métricas
  { id: 'min_1', name: 'Nombre Apellido', party: 'AAA', portfolio: 'economia', desc: '+1.5% Economía',
    pros: '+1.5% Economía', cons: '-1.0% Aprobación', effects: { eco: 1.5, apr: -1 } }
];
const GOAL_POOL = [            // misiones del mandato
  { id: 'eco', icon: 'fa-chart-line', title: 'Milagro Económico', desc: 'Mantén la Economía ≥ 70%', check: s => s.metrics.eco >= 70 }
];
const GOAL_ACTIONS = [         // acciones presidenciales (cap = capital político, cd = días de espera)
  { id: 'tv', icon: 'fa-tv', title: 'Comparecencia televisada', cap: 15, cost: 0, cd: 30, fx: { apr: 6, est: 2 }, news: 'Titular.' }
];
const FOCUS_TREE = [           // focos nacionales; b = rama (eco, est, emp, con, apr, mil)
  { id: 'e1', b: 'eco', title: 'Reforma fiscal', days: 365, now: { eco: 4 }, spirit: { name: 'Hacienda Eficiente', daily: {}, money: 120 } }
];
const FOCUS_LINKS = [          // efectos en cadena entre métricas (s = métricas)
  { t: 'Economía hundida destruye empleo', on: s => s.eco < 40, fx: { emp: -0.08 } }
];
const INTL_ACTIONS = [];       // (heredado) déjalo vacío: las acciones exteriores van en COUNTRY_INTL

// ---- 4. PROYECTOS, LOGROS Y BANCO CENTRAL ---------------------------------------------
const PROJECTS = [             // 3 fases por proyecto; spirit = bonus permanente al terminar
  { id: 'tgv', icon: 'fa-train', title: 'Alta velocidad', spirit: { name: 'Red Ferroviaria', daily: { eco: 0.04 }, money: 60 },
    phases: [ { n: 'Estudios', cost: 300, days: 30, now: {}, run: {} },
              { n: 'Obra civil', cost: 2000, days: 120, now: { emp: 2 }, run: { emp: 0.02 } },
              { n: 'Puesta en servicio', cost: 800, days: 45, now: { eco: 2 }, run: {} } ] }
];
const ACHIEVEMENTS = [
  { id: 'm1', icon: 'fa-flag', title: 'Primer Mandato', desc: 'Cumple tu primera misión', ok: s => s.goals && s.goals.done >= 1 }
];
const BDE_GOVS = [             // gobernadores del banco central; cred = credibilidad inicial
  { id: 'tecnico', name: 'Nombre Apellido', tag: 'Tecnócrata ortodoxo', cred: 10, desc: 'Descripción.' }
];
const BDE_ACTIONS = [          // acciones del banco central; B = estado del banco
  { id: 'rate_down', icon: 'fa-arrow-trend-down', label: 'Bajar el tipo director', desc: 'Efecto.', cost: 0, cd: 45,
    when: () => true, run: B => { B.cred -= 1; focusMetricAdd('eco', 2); } }
];

// ---- 5. ECONOMÍA Y TEXTOS DEL PAÍS ----------------------------------------------------
const COUNTRY_ECON = {
  // Cómo se nombran en titulares y textos del motor (España: Moncloa / Banco de España)
  terms: { gov: 'El Gobierno', place: 'el Palacio de Gobierno', cabinet: 'Gabinete de Gobierno', bank: 'Banco Central',
           nation: 'Nombre del país', adj: 'nacional', firms: 'nacionales', capital: 'Capital' },
  k: 0.10,                        // escala respecto a España (PIB país / 1.700.000)
  budget: 10000, budgetStep: 100, // PGE a repartir (M€) y salto del selector
  pib: 176000, debt: 123000, macroPib: 10030, revPct: 0.30, pensPct: 0.04, otherPct: 0.18,
  baseRate: 3.6, debtMax: 30000, cashCap: 9000,
  preset: { sanidad: 800, educacion: 1800, defensa: 3600, vivienda: 500, infraestructuras: 2100, deuda: 1200 },
  hint: 'Referencia real del presupuesto del país.',
  labels: { sanidad: 'Nombre de la partida de sanidad' },          // nombres de partidas PGE (opcional)
  pct: { sanidad: 8, educacion: 18, infraestructuras: 21, interior: 7, defensa: 29, economia: 12, vivienda: 5 }, // suma ≈ 100
  names: { economia: 'Ministerio de Economía', defensa: 'Ministerio de Defensa' },   // nombre de cada cartera
  descs: { sanidad: 'Qué gestiona este ministerio.' },
  // war: configuración del mapa de Guerra (id ISO numérico del país, aliados, relaciones con el mundo)
  war: { id: 504, name: 'País', lat: 32, lon: -6, allied: '^$', own: { t: 44, m: 26, a: 42 },
         add: [], drop: [], rel: { 724: 50, 840: 85 } }
};

// ---- 6. MAPA DE REGIONES -------------------------------------------------------------
const COUNTRY_MAP = {
  title: 'Mapa de las regiones de ...',
  paths: [   // d = trazado SVG en viewBox 0 0 500 400 aprox.; spectrumPref 1-7 = ideología dominante
    { id: 'REG', name: 'Región', d: 'M 100,100 L 200,100 L 200,200 L 100,200 Z', spectrumPref: 4.5, regionalist: false, desc: 'Descripción.' }
  ]
};

// ---- 7. RELACIONES EXTERIORES (sustituye a los socios de España) ---------------------------
//  Define 5-9 socios o bloques. TODAS las claves (partners, base, links, map, actions, fx) deben
//  usar los mismos id de socio. Sin COUNTRY_INTL la pestaña sale vacía (nunca con socios de España).
const COUNTRY_INTL = {
  blocksText: 'A↔B, C↔D',   // frase de ejemplo de efecto bloque para el texto de la pestaña
  partners: {
    xx: { name: 'Socio X', icon: 'fa-handshake',
          ally:  { name: 'Aliado de X',  daily: { eco: .04 }, money: 60 },   // relación >= 70 (money = M€/mes, opcional)
          tense: { name: 'Tensión con X', daily: { eco: -.04 }, money: -40 } } // relación <= 30
  },
  base:  { xx: 50 },                          // relación inicial 0-100
  links: { xx: { yy: -.3 } },                 // acercarte a xx mueve yy
  map:   { xx: [724] },                       // códigos ISO numéricos del mapa de Guerra
  actions: { xx: [ { id: 'cum', title: 'Cumbre bilateral', cap: 8, cd: 60, fx: { xx: 10 }, now: { apr: 1 } } ] }, // cost = gasta, inc = ingresa
  monthly: [ { m: 'eco', gt: 70, fx: { xx: .8 }, why: 'Credibilidad económica' } ],  // m: métrica; gt/lt: umbral
  pop: [ { id: 'x1', cond: r => r.xx >= 65, title: 'CRISIS DIPLOMÁTICA', desc: 'Descripción.',
           options: [ { text: 'Opción', intl: { xx: 10 }, cost: 100, stats: { apr: 2 }, news: 'Titular.' },
                      { text: 'Otra', intl: { xx: -8 }, income: 200, stats: { est: -1 }, news: 'Titular.' } ] } ]
};

// =====================================================================
//  PROMPT PARA PEDIR UN PAÍS A UNA IA (pégalo en un chat nuevo junto a este fichero)
//  «Rellena esta plantilla para <PAÍS>, año 2026, con datos reales y actuales
//   (partidos y escaños, ministros, presupuesto, PIB y deuda, socios exteriores).
//   Respeta exactamente las claves, métricas y ministerios. Mínimos: 8 DYNAMIC_EVENTS,
//   6 CAMPAIGN_HEADLINES, 6 PRESS_NEWS_BANK, 2-3 decisiones por ministerio, 13 REAL_MINISTERS,
//   8 GOAL_POOL, 12 GOAL_ACTIONS, 16 FOCUS_TREE, 8 PROJECTS, 6 SHOCK_POOL, 8 socios en COUNTRY_INTL
//   con 2 acciones cada uno y 4 eventos pop. Devuélvelo como un único fichero .js.»
// =====================================================================
