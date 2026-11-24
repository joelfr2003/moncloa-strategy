// =====================================================================
//  ALEMANIA — MONCLOA STRATEGY (Countries/alemania.js)
//  Generado con plantilla-pais.js; edítalo con libertad. Registro: Countries/index.json
// =====================================================================

// ---- 1. CÁMARA Y ESCENARIOS ----
const CHAMBER = { seats: 630, majority: 316 };
const SCENARIOS = {
  ACTUAL: {
    id: "ACTUAL",
    title: "ALEMANIA (2026)",
    desc: "La coalición negra-roja de Merz gobierna con una mayoría estrecha, con la economía estancada, el auge de AfD y una gran inversión en defensa e infraestructuras.",
    parties: [
      {
        id: "LIN",
        name: "Die Linke",
        leader: "Jan van Aken",
        seats: 64,
        baseSeats: 64,
        minSeats: 40,
        maxSeats: 192,
        basePct: 10.2,
        color: "#a21caf",
        isRegional: false,
        ideology: "Izquierda",
        spectrumOrder: 1,
        redLines: [
          "AFD"
        ]
      },
      {
        id: "GRU",
        name: "Alianza 90/Los Verdes",
        leader: "Franziska Brantner",
        seats: 85,
        baseSeats: 85,
        minSeats: 40,
        maxSeats: 255,
        basePct: 13.5,
        color: "#16a34a",
        isRegional: false,
        ideology: "Ecologismo / centroizquierda",
        spectrumOrder: 2,
        redLines: [
          "AFD"
        ]
      },
      {
        id: "SPD",
        name: "Partido Socialdemócrata (SPD)",
        leader: "Lars Klingbeil",
        seats: 120,
        baseSeats: 120,
        minSeats: 40,
        maxSeats: 360,
        basePct: 19.0,
        color: "#e11d48",
        isRegional: false,
        ideology: "Socialdemocracia",
        spectrumOrder: 3,
        redLines: [
          "AFD"
        ]
      },
      {
        id: "SSW",
        name: "Asociación del Electorado de Schleswig del Sur",
        leader: "Stefan Seidler",
        seats: 1,
        baseSeats: 1,
        minSeats: 0,
        maxSeats: 3,
        basePct: 0.2,
        color: "#1d4ed8",
        isRegional: true,
        ideology: "Minoría danesa",
        spectrumOrder: 3,
        redLines: []
      },
      {
        id: "CDU",
        name: "CDU/CSU",
        leader: "Friedrich Merz",
        seats: 208,
        baseSeats: 208,
        minSeats: 40,
        maxSeats: 624,
        basePct: 33.0,
        color: "#111827",
        isRegional: false,
        ideology: "Democristianos",
        spectrumOrder: 4,
        redLines: [
          "AFD",
          "LIN"
        ]
      },
      {
        id: "AFD",
        name: "Alternativa para Alemania (AfD)",
        leader: "Alice Weidel",
        seats: 152,
        baseSeats: 152,
        minSeats: 40,
        maxSeats: 456,
        basePct: 24.1,
        color: "#0ea5e9",
        isRegional: false,
        ideology: "Derecha radical",
        spectrumOrder: 5,
        redLines: [
          "GRU",
          "SPD",
          "LIN"
        ]
      }
    ]
  }
};


// ---- 2. EVENTOS DE GOBIERNO ----
const DYNAMIC_EVENTS = [
  {
    id: "DE_DEFICIT",
    category: "ECONOMÍA",
    title: "AGUJERO EN LAS CUENTAS PÚBLICAS",
    desc: "Hacienda advierte de que el déficit se desvía de lo previsto y los mercados piden un plan creíble de ajuste.",
    condition: m => true,
    options: [
      { text: "Recortar gasto corriente", stats: { eco: 3, apr: -3, est: -1 }, cost: 1, loyaltyImpact: { CDU: 8, AFD: 8, SPD: -6, GRU: -6, LIN: -6 }, news: "El Gobierno federal anuncia un recorte del gasto para contener el déficit." },
      { text: "Subir impuestos a las rentas altas", stats: { eco: -1, apr: 2 }, cost: 1, loyaltyImpact: { SPD: 8, GRU: 8, LIN: 8, CDU: -6, AFD: -6 }, news: "El Gobierno federal sube la presión fiscal a las grandes rentas." },
      { text: "Emitir más deuda y aplazar el ajuste", stats: { eco: 1, apr: 1, est: -2 }, cost: 1, loyaltyImpact: {}, news: "El Tesoro emite deuda extra y los inversores exigen más intereses." }
    ]
  },
  {
    id: "DE_HUELGA",
    category: "SOCIEDAD",
    title: "PARO EN EL TRANSPORTE Y LA INDUSTRIA",
    desc: "Los sindicatos convocan paros que amenazan con bloquear puertos, trenes y fábricas durante semanas.",
    condition: m => true,
    options: [
      { text: "Negociar una subida salarial", stats: { emp: 3, eco: -2, apr: 3 }, cost: 4700, loyaltyImpact: { SPD: 8, GRU: 8, LIN: 8, CDU: -6, AFD: -6 }, news: "Acuerdo salarial pone fin a los paros." },
      { text: "Declarar servicios mínimos estrictos", stats: { est: 2, apr: -3, emp: -1 }, cost: 1, loyaltyImpact: { CDU: 8, AFD: 8, SPD: -6, GRU: -6, LIN: -6 }, news: "El Gobierno impone servicios mínimos y los sindicatos protestan." }
    ]
  },
  {
    id: "DE_ENERGIA",
    category: "ECONOMÍA",
    title: "DISPARO DEL PRECIO DE LA ENERGÍA",
    desc: "La factura de la luz y el gas se dispara y hogares e industria reclaman ayudas urgentes.",
    condition: m => true,
    options: [
      { text: "Subsidiar la factura energética", stats: { apr: 4, eco: -1, est: 1 }, cost: 11750, loyaltyImpact: { SPD: 8, GRU: 8, LIN: 8, CDU: -6, AFD: -6 }, news: "El Gobierno federal subvenciona la factura energética." },
      { text: "Dejar actuar al mercado y apostar por la eficiencia", stats: { eco: 1, apr: -4, est: -2 }, cost: 1, loyaltyImpact: { CDU: 8, AFD: 8, SPD: -6, GRU: -6, LIN: -6 }, news: "El Gobierno rechaza intervenir los precios energéticos." }
    ]
  },
  {
    id: "DE_CIBER",
    category: "SEGURIDAD",
    title: "CIBERATAQUE A INFRAESTRUCTURAS CRÍTICAS",
    desc: "Un ataque informático paraliza hospitales, bancos y redes eléctricas durante horas.",
    condition: m => true,
    options: [
      { text: "Plan nacional de ciberdefensa", stats: { est: 3, mil: 2, apr: 1 }, cost: 6250, loyaltyImpact: {}, news: "Se crea un plan de ciberdefensa tras el ataque." },
      { text: "Culpar al extranjero y reforzar la vigilancia", stats: { est: 1, apr: -2, mil: 1 }, cost: 1550, loyaltyImpact: { CDU: 6, AFD: 6, SPD: -5, GRU: -5, LIN: -5 }, news: "El Gobierno atribuye el ataque a un actor extranjero." }
    ]
  },
  {
    id: "DE_PENSIONES",
    category: "SOCIEDAD",
    title: "PRESIÓN SOBRE LAS PENSIONES",
    desc: "El envejecimiento tensiona el sistema de pensiones y los expertos piden reformarlo.",
    condition: m => true,
    options: [
      { text: "Retrasar gradualmente la edad de jubilación", stats: { eco: 3, apr: -5, est: -1 }, cost: 1, loyaltyImpact: { CDU: 8, AFD: 8, SPD: -6, GRU: -6, LIN: -6 }, news: "Se aprueba retrasar la edad de jubilación." },
      { text: "Blindar las pensiones con más cotizaciones", stats: { apr: 3, eco: -2 }, cost: 7750, loyaltyImpact: { SPD: 8, GRU: 8, LIN: 8, CDU: -6, AFD: -6 }, news: "Se blindan las pensiones con un aumento de las cotizaciones." }
    ]
  },
  {
    id: "DE_SEQUIA",
    category: "SOCIEDAD",
    title: "SEQUÍA Y OLA DE CALOR",
    desc: "Una sequía prolongada daña el campo, los embalses y el abastecimiento de varias regiones.",
    condition: m => true,
    options: [
      { text: "Declarar emergencia y ayudar al campo", stats: { apr: 3, est: 2, eco: -1 }, cost: 9250, loyaltyImpact: {}, news: "Se declara emergencia por sequía y se aprueban ayudas." },
      { text: "Pedir ahorro voluntario", stats: { apr: -3, est: -2 }, cost: 1, loyaltyImpact: {}, news: "El Gobierno apela al ahorro voluntario de agua." }
    ]
  },
  {
    id: "DE_FRENO",
    category: "ECONOMÍA",
    title: "EL FRENO DE LA DEUDA BLOQUEA LAS INVERSIONES",
    desc: "Puentes, ferrocarril y escuelas piden dinero, pero el freno de la deuda limita el endeudamiento. Hay que decidir si se reforma.",
    condition: m => true,
    options: [
      { text: "Reformar el freno y crear un fondo de infraestructuras", stats: { eco: 3, emp: 2, apr: 2 }, cost: 9000, loyaltyImpact: { SPD: 8, GRU: 8, LIN: 8, AFD: -8 }, news: "Berlín aprueba un fondo especial para infraestructuras." },
      { text: "Mantener el freno y priorizar gastos", stats: { eco: -1, apr: -3 }, cost: 0, loyaltyImpact: { CDU: 6, AFD: 6, SPD: -5, GRU: -5, LIN: -5 }, news: "La coalición mantiene el freno de la deuda." }
    ]
  },
  {
    id: "DE_AUTO",
    category: "ECONOMÍA",
    title: "CRISIS DEL AUTOMÓVIL ALEMÁN",
    desc: "Volkswagen, Mercedes y los proveedores anuncian despidos por la competencia china y los costes de la electrificación.",
    condition: m => true,
    options: [
      { text: "Subvencionar el coche eléctrico y proteger empleos", stats: { emp: 3, eco: -1, apr: 3 }, cost: 6500, loyaltyImpact: { SPD: 6, GRU: 6, LIN: 6, AFD: -4 }, news: "El Gobierno rescata la industria del automóvil con ayudas." },
      { text: "Dejar que la industria se reestructure", stats: { eco: 1, emp: -4, apr: -4 }, cost: 0, loyaltyImpact: { CDU: 5, SPD: -6, GRU: -6, LIN: -6 }, news: "Se aceleran los despidos en el automóvil." }
    ]
  },
  {
    id: "DE_BUNDESWEHR",
    category: "SEGURIDAD",
    title: "LA BUNDESWEHR NECESITA UN SALTO CUALITATIVO",
    desc: "Sin servicio militar y con falta de material, el ejército pide un plan masivo de reclutamiento y compras.",
    condition: m => true,
    options: [
      { text: "Reintroducir el servicio militar parcial", stats: { mil: 5, apr: -3, est: 1 }, cost: 3000, loyaltyImpact: { CDU: 6, AFD: 6, GRU: -8, LIN: -8 }, news: "Alemania reintroduce un servicio militar parcial." },
      { text: "Fuerza profesional con grandes compras", stats: { mil: 4, eco: -1 }, cost: 9000, loyaltyImpact: { CDU: 4, SPD: 4, LIN: -6 }, news: "La Bundeswehr recibe un plan de rearme." }
    ]
  },
  {
    id: "DE_AFDBAN",
    category: "POLÍTICA",
    title: "DEBATE SOBRE PROHIBIR A LA AfD",
    desc: "El Verfassungsschutz califica a la AfD de extremista y se debate pedir su ilegalización ante el Tribunal Constitucional.",
    condition: m => true,
    options: [
      { text: "Promover el procedimiento de prohibición", stats: { est: -3, apr: -1, con: -2 }, cost: 300, loyaltyImpact: { GRU: 6, LIN: 6, SPD: 6, AFD: -15 }, news: "Se impulsa una petición de ilegalización de la AfD." },
      { text: "Combatirla con política y no con tribunales", stats: { est: 1, apr: 1 }, cost: 0, loyaltyImpact: { CDU: 4, LIN: -4 }, news: "El Gobierno rechaza prohibir la AfD y apuesta por el debate." }
    ]
  },
  {
    id: "DE_ENERGIA",
    category: "ECONOMÍA",
    title: "TRANSICIÓN ENERGÉTICA Y PRECIO DEL GAS",
    desc: "Sin nuclear ni gas ruso, la industria pide energía barata. ¿Qué rumbo toma la Energiewende?",
    condition: m => true,
    options: [
      { text: "Acelerar renovables y redes eléctricas", stats: { eco: 2, est: 1, apr: 1 }, cost: 7500, loyaltyImpact: { GRU: 8, SPD: 8, LIN: 8, AFD: -6 }, news: "Alemania acelera las renovables y las redes." },
      { text: "Reabrir la discusión nuclear y el gas", stats: { eco: 2, apr: -2, est: -1 }, cost: 3000, loyaltyImpact: { CDU: 8, AFD: 8, GRU: -10 }, news: "Berlín reabre el debate nuclear y del gas." }
    ]
  }
];
const CAMPAIGN_HEADLINES = [
  {
    id: 1,
    newspaper: "FRANKFURTER ALLGEMEINE",
    headline: "LA ECONOMÍA, EL TEMA DE LA CAMPAÑA",
    desc: "Los precios y el empleo dominan el debate. ¿Cómo respondes?",
    options: [
      { text: "Presentar un plan económico detallado", score: 9, textResult: "El plan transmite solvencia y refuerza tu campaña." },
      { text: "Atacar a los rivales sin propuestas", score: -4, textResult: "Suena a excusa y los rivales lo explotan." }
    ]
  },
  {
    id: 2,
    newspaper: "FRANKFURTER ALLGEMEINE",
    headline: "DEBATE ELECTORAL CARA A CARA",
    desc: "Los líderes se miden en el gran debate televisado.",
    options: [
      { text: "Mostrar serenidad y datos", score: 7, textResult: "Se te ve presidencial y ganas el debate." },
      { text: "Subir el tono y atacar", score: -5, textResult: "La agresividad se vuelve en tu contra." }
    ]
  },
  {
    id: 3,
    newspaper: "DER SPIEGEL",
    headline: "MIGRACIÓN Y SEGURIDAD EN EL CENTRO DEL DEBATE",
    desc: "Tras un atentado, la inmigración domina la campaña.",
    options: [
      { text: "Control de fronteras con respeto a la ley", score: 8, textResult: "Equilibras firmeza y legalidad y calmas el debate." },
      { text: "Endurecer sin matices", score: -3, textResult: "Se te acusa de seguir la agenda de la AfD." }
    ]
  }
];


// ---- 3. PRENSA, MINISTERIOS Y CRISIS ----
const PRESS_NEWS_BANK = [
  {
    id: "DE_N1",
    newspaper: "FRANKFURTER ALLGEMEINE",
    headline: "LAS AGENCIAS DE CALIFICACIÓN REVISAN LA NOTA",
    desc: "Los analistas evalúan la solvencia del país tras los últimos datos.",
    options: [
      { text: "Presumir de reformas", stats: { eco: 2, apr: 1 }, cost: 0, news: "El Gobierno defiende sus reformas ante los analistas." },
      { text: "Restar importancia", stats: { eco: -1, apr: -1 }, news: "El Gobierno resta importancia a la revisión." }
    ]
  },
  {
    id: "DE_N2",
    newspaper: "FRANKFURTER ALLGEMEINE",
    headline: "NUEVA ENCUESTA DE INTENCIÓN DE VOTO",
    desc: "El sondeo muestra un electorado dividido y volátil.",
    options: [
      { text: "Hacer campaña permanente", stats: { apr: 2, est: -1 }, cost: 0, news: "El Gobierno se vuelca en la calle." },
      { text: "Ignorar los sondeos", stats: { apr: -1, est: 1 }, news: "El Gobierno dice gobernar sin mirar las encuestas." }
    ]
  },
  {
    id: "DE_N3",
    newspaper: "FRANKFURTER ALLGEMEINE",
    headline: "EL PAÍS CELEBRA UN ÉXITO DEPORTIVO",
    desc: "Un triunfo internacional llena las calles de alegría.",
    options: [
      { text: "Recibir a los campeones", stats: { apr: 3, est: 1 }, cost: 0, news: "El Gobierno recibe a los campeones en un acto multitudinario." },
      { text: "Mantener la agenda", stats: { apr: -1 }, news: "El Gobierno se desmarca de las celebraciones." }
    ]
  },
  {
    id: "DE_N4",
    newspaper: "FRANKFURTER ALLGEMEINE",
    headline: "LA PRODUCCIÓN INDUSTRIAL SORPRENDE",
    desc: "Los datos de industria superan o decepcionan a los analistas.",
    options: [
      { text: "Anunciar un plan industrial", stats: { eco: 3, emp: 2 }, cost: 0, news: "El Gobierno lanza un plan de impulso industrial." },
      { text: "Esperar a más datos", stats: { eco: 0, apr: -1 }, news: "El Gobierno pide prudencia con los datos." }
    ]
  },
  {
    id: "DE_N5",
    newspaper: "FRANKFURTER ALLGEMEINE",
    headline: "UN INFORME CRITICA LA GESTIÓN PÚBLICA",
    desc: "Un organismo independiente señala ineficiencias en la administración.",
    options: [
      { text: "Aceptar las críticas y reformar", stats: { apr: 2, eco: 1 }, cost: 0, news: "El Gobierno anuncia una reforma administrativa." },
      { text: "Desacreditar el informe", stats: { apr: -2, est: -1 }, news: "El Gobierno cuestiona el informe." }
    ]
  },
  {
    id: "DE_N6",
    newspaper: "FRANKFURTER ALLGEMEINE",
    headline: "GRAN FERIA DE INVERSIÓN INTERNACIONAL",
    desc: "Inversores extranjeros evalúan nuevos proyectos en el país.",
    options: [
      { text: "Ofrecer incentivos fiscales", stats: { eco: 3, emp: 1 }, cost: 0, news: "El Gobierno ofrece incentivos para atraer inversión." },
      { text: "Mantener las condiciones", stats: { eco: 1 }, news: "El Gobierno mantiene el marco actual." }
    ]
  },
  {
    id: "DE_N7",
    newspaper: "BILD",
    headline: "EL BUNDESBANK RECORTA LA PREVISIÓN DE CRECIMIENTO",
    desc: "La mayor economía europea se estanca por tercer año.",
    options: [
      { text: "Anunciar un paquete de competitividad", stats: { eco: 3, apr: 1 }, cost: 0, news: "Berlín anuncia un paquete de competitividad." },
      { text: "Pedir paciencia", stats: { eco: -1, apr: -2 }, news: "El Gobierno pide paciencia ante el estancamiento." }
    ]
  }
];
const MINISTRY_DECISIONS_BANK = {
  sanidad: [
    { title: "Reforzar hospitales y atención primaria", cost: 11750, stats: { apr: 4, est: 2 } },
    { title: "Plan de salud pública y prevención", cost: 7750, stats: { apr: 3, est: 1 } }
  ],
  educacion: [
    { title: "Plan de becas y refuerzo escolar", cost: 9000, stats: { apr: 3, emp: 1 } },
    { title: "Formación profesional y empleo joven", cost: 10500, stats: { emp: 3, eco: 1 } }
  ],
  infraestructuras: [
    { title: "Modernizar carreteras y ferrocarril", cost: 18250, stats: { eco: 2, emp: 2 } },
    { title: "Conectar regiones aisladas", cost: 11750, stats: { est: 2, apr: 2 } },
    { title: "Renovar la red ferroviaria de Deutsche Bahn", cost: 23500, stats: { eco: 2, apr: 2, emp: 1 } }
  ],
  interior: [
    { title: "Reforzar la seguridad ciudadana", cost: 6500, stats: { est: 3, apr: 1 } },
    { title: "Modernizar fronteras y control migratorio", cost: 7750, stats: { est: 2 } }
  ],
  defensa: [
    { title: "Modernizar equipos y flota", cost: 17000, stats: { mil: 4, eco: -1 } },
    { title: "Mejorar la paga y la formación de las tropas", cost: 7250, stats: { mil: 3 } },
    { title: "Contratos para el Sondervermögen de defensa", cost: 23500, stats: { mil: 5, eco: 1 } }
  ],
  economia: [
    { title: "Auditoría y racionalización del gasto", cost: 1, stats: { eco: 1, apr: -1 } },
    { title: "Incentivos a la inversión empresarial", cost: 7750, stats: { eco: 3, emp: 1 } }
  ],
  vivienda: [
    { title: "Plan de vivienda asequible", cost: 10500, stats: { apr: 3, est: 2 } },
    { title: "Facilitar suelo para construir", cost: 3900, stats: { eco: 1, apr: 2 } }
  ],
  territorio: [
    { title: "Plan de desarrollo regional", cost: 9000, stats: { est: 2, apr: 2 } },
    { title: "Ayudas a las zonas rurales", cost: 7750, stats: { emp: 2, apr: 1 } }
  ],
  trabajo: [
    { title: "Programa de empleo y formación", cost: 8250, stats: { emp: 3 } },
    { title: "Mejorar la protección de los trabajadores", cost: 6500, stats: { apr: 3, eco: -1 } }
  ],
  justicia: [
    { title: "Agilizar los tribunales", cost: 4700, stats: { est: 2, apr: 1 } },
    { title: "Reforzar la lucha anticorrupción", cost: 3900, stats: { apr: 3, est: 1 } }
  ],
  exteriores: [
    { title: "Ofensiva diplomática en organismos internacionales", cost: 2350, stats: { apr: 1, mil: 1 } },
    { title: "Promover exportaciones y comercio", cost: 3900, stats: { eco: 2 } }
  ],
  transicion_ecologica: [
    { title: "Apoyar energías renovables", cost: 11750, stats: { eco: 2, apr: 1 } },
    { title: "Plan de eficiencia energética", cost: 7250, stats: { eco: 1, est: 1 } }
  ],
  cultura: [
    { title: "Apoyo a la cultura y el patrimonio", cost: 3100, stats: { apr: 2 } },
    { title: "Promoción del deporte", cost: 3650, stats: { apr: 2, est: 1 } }
  ],
  igualdad: [
    { title: "Plan de conciliación familiar", cost: 6500, stats: { apr: 3, est: 1 } },
    { title: "Servicios sociales de proximidad", cost: 5750, stats: { apr: 2, est: 1 } }
  ]
};
const HOUSING_EVENTS = [
  {
    id: "DE_HOUS",
    category: "VIVIENDA & PROTESTAS",
    title: "ALQUILERES DISPARADOS EN BERLÍN, MÚNICH Y HAMBURGO",
    desc: "Manifestaciones piden controlar los alquileres y construir más vivienda.",
    options: [
      { text: "Reforzar el freno de alquileres y construir", stats: { apr: 6, est: 3, eco: -1 }, cost: 20750, loyaltyImpact: { SPD: 10, GRU: 10, LIN: 10, CDU: -8, AFD: -8 }, news: "Berlín refuerza el freno de alquileres y lanza un plan de construcción." },
      { text: "Facilitar la construcción privada", stats: { apr: -3, eco: 2 }, cost: 0, loyaltyImpact: { CDU: 8, LIN: -8, SPD: -8 }, news: "El Gobierno facilita la construcción privada y rechaza topes." }
    ]
  }
];
const SHOCK_POOL = [
  {
    cat: "EMERGENCIAS",
    min: "interior",
    title: "INCENDIOS FORESTALES DE GRAN ESCALA",
    desc: "Varios frentes de fuego obligan a evacuar pueblos y colapsan los servicios de emergencia.",
    options: [
      { text: "Desplegar todos los medios y el ejército", cost: 6250, stats: { est: 3, apr: 2 }, news: "El Gobierno despliega todos los medios contra los incendios." },
      { text: "Dejar la gestión a las autoridades locales", cost: 0, stats: { est: -4, apr: -5 }, news: "Críticas por la lenta respuesta a los incendios." }
    ]
  },
  {
    cat: "ECONOMÍA",
    min: "economia",
    title: "QUIEBRA DE UN GRAN BANCO REGIONAL",
    desc: "Un banco de tamaño medio se declara insolvente y el pánico amenaza con contagiarse.",
    options: [
      { text: "Rescate público con garantías", cost: 15500, stats: { eco: 3, apr: -3 }, news: "El Estado rescata al banco para evitar el contagio." },
      { text: "Dejar quebrar y proteger a los depositantes", cost: 5250, stats: { eco: -3, apr: 1 }, news: "El banco quiebra y se protege solo a los pequeños ahorradores." }
    ]
  },
  {
    cat: "SANIDAD",
    min: "sanidad",
    title: "BROTE EPIDÉMICO",
    desc: "Un brote de gripe grave satura los hospitales en pleno invierno.",
    options: [
      { text: "Plan de contingencia y refuerzo sanitario", cost: 7750, stats: { est: 3, apr: 2 }, news: "Plan de contingencia sanitaria contra el brote." },
      { text: "Medidas mínimas", cost: 0, stats: { est: -3, apr: -4 }, news: "Los hospitales se saturan ante el brote." }
    ]
  },
  {
    cat: "EMERGENCIAS",
    min: "interior",
    title: "INUNDACIONES EN EL VALLE DEL RIN",
    desc: "Lluvias torrenciales inundan localidades de Renania y Baviera.",
    options: [
      { text: "Fondo federal de reconstrucción", cost: 11750, stats: { est: 3, apr: 3 }, news: "Berlín aprueba un fondo para las zonas inundadas." },
      { text: "Dejar la gestión a los Länder", cost: 0, stats: { est: -3, apr: -4 }, news: "Críticas por la respuesta federal a las inundaciones." }
    ]
  }
];


// ---- 4. MINISTROS ----
const REAL_MINISTERS = [
  {
    id: "klingbeil_spd",
    name: "Lars Klingbeil",
    party: "SPD",
    portfolio: "economia",
    desc: "+1.5% Economía",
    pros: "+1.5% Economía",
    cons: "-0.5% Aprobación",
    effects: { eco: 1.5, apr: -0.5 }
  },
  {
    id: "reiche_cdu",
    name: "Katherina Reiche",
    party: "CDU",
    portfolio: "economia",
    desc: "+1.5% Economía, +0.5% Estabilidad",
    pros: "+1.5% Economía, +0.5% Estabilidad",
    cons: "-1.0% Aprobación",
    effects: { eco: 1.5, est: 0.5, apr: -1 }
  },
  {
    id: "habeck_gru",
    name: "Robert Habeck",
    party: "GRU",
    portfolio: "economia",
    desc: "+1.0% Economía, +1.0% Aprobación",
    pros: "+1.0% Economía, +1.0% Aprobación",
    cons: "-0.5% Estabilidad",
    effects: { eco: 1, apr: 1, est: -0.5 }
  },
  {
    id: "dobrindt_cdu",
    name: "Alexander Dobrindt",
    party: "CDU",
    portfolio: "interior",
    desc: "+1.5% Estabilidad",
    pros: "+1.5% Estabilidad",
    cons: "-1.0% Aprobación",
    effects: { est: 1.5, apr: -1 }
  },
  {
    id: "faeser_spd",
    name: "Nancy Faeser",
    party: "SPD",
    portfolio: "interior",
    desc: "+1.0% Estabilidad, +0.5% Aprobación",
    pros: "+1.0% Estabilidad, +0.5% Aprobación",
    cons: "-0.5% Lealtad militar",
    effects: { est: 1, apr: 0.5, mil: -0.5 }
  },
  {
    id: "pistorius_spd",
    name: "Boris Pistorius",
    party: "SPD",
    portfolio: "defensa",
    desc: "+2.0% Lealtad militar, +1.0% Aprobación",
    pros: "+2.0% Lealtad militar, +1.0% Aprobación",
    cons: "Ninguno",
    effects: { mil: 2, apr: 1 }
  },
  {
    id: "kramp-karrenbauer_cdu",
    name: "Annegret Kramp-Karrenbauer",
    party: "CDU",
    portfolio: "defensa",
    desc: "+1.5% Lealtad militar",
    pros: "+1.5% Lealtad militar",
    cons: "-0.5% Aprobación",
    effects: { mil: 1.5, apr: -0.5 }
  },
  {
    id: "wadephul_cdu",
    name: "Johann Wadephul",
    party: "CDU",
    portfolio: "exteriores",
    desc: "+1.0% Aprobación, +1.0% Lealtad militar",
    pros: "+1.0% Aprobación, +1.0% Lealtad militar",
    cons: "Ninguno",
    effects: { apr: 1, mil: 1 }
  },
  {
    id: "baerbock_gru",
    name: "Annalena Baerbock",
    party: "GRU",
    portfolio: "exteriores",
    desc: "+0.5% Aprobación, +1.0% Lealtad militar, +0.5% Estabilidad",
    pros: "+0.5% Aprobación, +1.0% Lealtad militar, +0.5% Estabilidad",
    cons: "Ninguno",
    effects: { apr: 0.5, mil: 1, est: 0.5 }
  },
  {
    id: "warken_cdu",
    name: "Nina Warken",
    party: "CDU",
    portfolio: "sanidad",
    desc: "+1.0% Estabilidad",
    pros: "+1.0% Estabilidad",
    cons: "-0.5% Aprobación",
    effects: { est: 1, apr: -0.5 }
  },
  {
    id: "lauterbach_spd",
    name: "Karl Lauterbach",
    party: "SPD",
    portfolio: "sanidad",
    desc: "+1.5% Estabilidad",
    pros: "+1.5% Estabilidad",
    cons: "-1.0% Aprobación",
    effects: { est: 1.5, apr: -1 }
  },
  {
    id: "prien_cdu",
    name: "Karin Prien",
    party: "CDU",
    portfolio: "educacion",
    desc: "+1.0% Aprobación, +0.5% Empleo",
    pros: "+1.0% Aprobación, +0.5% Empleo",
    cons: "Ninguno",
    effects: { apr: 1, emp: 0.5 }
  },
  {
    id: "bas_spd",
    name: "Bärbel Bas",
    party: "SPD",
    portfolio: "trabajo",
    desc: "+1.5% Empleo, +0.5% Aprobación",
    pros: "+1.5% Empleo, +0.5% Aprobación",
    cons: "-0.5% Economía",
    effects: { emp: 1.5, apr: 0.5, eco: -0.5 }
  },
  {
    id: "hubig_spd",
    name: "Stefanie Hubig",
    party: "SPD",
    portfolio: "justicia",
    desc: "+1.0% Estabilidad, +0.5% Aprobación",
    pros: "+1.0% Estabilidad, +0.5% Aprobación",
    cons: "Ninguno",
    effects: { est: 1, apr: 0.5 }
  },
  {
    id: "schnieder_cdu",
    name: "Patrick Schnieder",
    party: "CDU",
    portfolio: "infraestructuras",
    desc: "+1.0% Economía, +1.0% Empleo",
    pros: "+1.0% Economía, +1.0% Empleo",
    cons: "Ninguno",
    effects: { eco: 1, emp: 1 }
  },
  {
    id: "schneider_spd",
    name: "Carsten Schneider",
    party: "SPD",
    portfolio: "transicion_ecologica",
    desc: "+0.5% Economía, +1.0% Estabilidad",
    pros: "+0.5% Economía, +1.0% Estabilidad",
    cons: "Ninguno",
    effects: { eco: 0.5, est: 1 }
  },
  {
    id: "hubertz_spd",
    name: "Verena Hubertz",
    party: "SPD",
    portfolio: "vivienda",
    desc: "+1.5% Aprobación, +0.5% Estabilidad",
    pros: "+1.5% Aprobación, +0.5% Estabilidad",
    cons: "Ninguno",
    effects: { apr: 1.5, est: 0.5 }
  },
  {
    id: "weimer_cdu",
    name: "Wolfram Weimer",
    party: "CDU",
    portfolio: "cultura",
    desc: "+1.5% Aprobación",
    pros: "+1.5% Aprobación",
    cons: "Ninguno",
    effects: { apr: 1.5 }
  },
  {
    id: "rainer_cdu",
    name: "Alois Rainer",
    party: "CDU",
    portfolio: "territorio",
    desc: "+1.0% Empleo, +0.5% Estabilidad",
    pros: "+1.0% Empleo, +0.5% Estabilidad",
    cons: "Ninguno",
    effects: { emp: 1, est: 0.5 }
  },
  {
    id: "prien_cdu",
    name: "Karin Prien",
    party: "CDU",
    portfolio: "igualdad",
    desc: "+1.0% Aprobación, +0.5% Estabilidad",
    pros: "+1.0% Aprobación, +0.5% Estabilidad",
    cons: "Ninguno",
    effects: { apr: 1, est: 0.5 }
  }
];


// ---- 5. MISIONES, ACCIONES, FOCOS, PROYECTOS Y LOGROS ----
const GOAL_POOL = [
  { id: "eco", icon: "fa-chart-line", title: "Milagro Económico", desc: "Mantén la Economía ≥ 70%", check: s => s.metrics.eco >= 70 },
  { id: "est", icon: "fa-shield-halved", title: "Unidad Nacional", desc: "Mantén la Estabilidad ≥ 65%", check: s => s.metrics.est >= 65 },
  { id: "emp", icon: "fa-people-roof", title: "Pleno Empleo", desc: "Mantén el Empleo ≥ 70%", check: s => s.metrics.emp >= 70 },
  { id: "apr", icon: "fa-thumbs-up", title: "Líder Querido", desc: "Mantén la Aprobación ≥ 60%", check: s => s.metrics.apr >= 60 },
  { id: "mil", icon: "fa-shield", title: "Fuerzas Armadas Leales", desc: "Mantén la lealtad militar ≥ 70%", check: s => s.metrics.mil >= 70 },
  { id: "caja", icon: "fa-vault", title: "Caja Saneada", desc: "Acumula una tesorería ≥ 260000 M", check: s => (Number(s.treasury) || 0) >= 260000 },
  { id: "bun", icon: "fa-shield", title: "Bundeswehr Operativa", desc: "Mantén la lealtad militar ≥ 75%", check: s => s.metrics.mil >= 75 }
];
const GOAL_ACTIONS = [
  {
    id: "tv",
    icon: "fa-tv",
    title: "Discurso a la nación desde la Cancillería",
    cap: 15,
    cost: 0,
    cd: 30,
    fx: { apr: 6, est: 2 },
    news: "El canciller se dirige a los alemanes y remonta en las encuestas."
  },
  {
    id: "gira",
    icon: "fa-bus",
    title: "Gira por las regiones",
    cap: 10,
    cost: 1550,
    cd: 40,
    fx: { apr: 4, est: 3 },
    news: "El líder recorre el país y recupera la calle."
  },
  {
    id: "cumbre",
    icon: "fa-handshake",
    title: "Cumbre con empresarios y sindicatos",
    cap: 15,
    cost: 0,
    cd: 60,
    fx: { eco: 4, emp: 2 },
    news: "Se firma un pacto social con empresarios y sindicatos."
  },
  {
    id: "mil",
    icon: "fa-medal",
    title: "Visita a las tropas",
    cap: 10,
    cost: 0,
    cd: 45,
    fx: { mil: 5, apr: 1 },
    news: "El líder visita a las tropas y refuerza su lealtad."
  },
  {
    id: "bund",
    icon: "fa-landmark",
    title: "Declaración en el Bundestag",
    cap: 12,
    cost: 0,
    cd: 40,
    fx: { apr: 3, est: 2, con: 3 },
    news: "El canciller presenta su agenda en el Bundestag."
  }
];
const FOCUS_TREE = [
  { id: "e1", b: "eco", title: "Reforma del freno de la deuda", days: 300, now: { eco: 3 }, spirit: { name: "Finanzas Sólidas", daily: { eco: 0.02 }, money: 2350 } },
  { id: "e2", b: "eco", title: "Fondo de infraestructuras y digitalización", days: 360, req: "e1", now: { eco: 4 }, spirit: { name: "Digitalización Nacional", daily: { eco: 0.03 }, money: 4700 } },
  { id: "e3", b: "eco", title: "Reindustrialización y economía verde", days: 420, req: "e2", now: { eco: 5 }, spirit: { name: "Mittelstand Reforzado", daily: { eco: 0.04 }, money: 7000 } },
  { id: "s1", b: "soc", title: "Reforma de las pensiones", days: 300, now: { apr: 3 }, spirit: { name: "Pacto Generacional", daily: { apr: 0.02 }, money: 1 } },
  { id: "s2", b: "soc", title: "Integración y política de migración", days: 360, req: "s1", now: { apr: 4 }, spirit: { name: "Sociedad Integrada", daily: { apr: 0.03 }, money: 1 } },
  { id: "s3", b: "soc", title: "Vivienda y alquiler asequibles", days: 420, req: "s2", now: { apr: 5 }, spirit: { name: "Hogares Asequibles", daily: { apr: 0.04 }, money: 1 } },
  { id: "g1", b: "seg", title: "Rearme y modernización de la Bundeswehr", days: 300, now: { est: 3 }, spirit: { name: "Bundeswehr Moderna", daily: { est: 0.02 }, money: 1 } },
  { id: "g2", b: "seg", title: "Ciberseguridad y protección civil", days: 360, req: "g1", now: { est: 4 }, spirit: { name: "Escudo Digital", daily: { est: 0.03 }, money: 1 } },
  { id: "g3", b: "seg", title: "Seguridad en las fronteras", days: 420, req: "g2", now: { est: 5 }, spirit: { name: "Fronteras Seguras", daily: { est: 0.04 }, money: 1 } },
  { id: "d1", b: "dip", title: "Liderazgo en la Unión Europea", days: 300, now: { mil: 3 }, spirit: { name: "Motor de Europa", daily: { mil: 0.02 }, money: 1 } },
  { id: "d2", b: "dip", title: "Defensa del flanco oriental", days: 360, req: "d1", now: { mil: 4 }, spirit: { name: "Flanco Oriental Firme", daily: { mil: 0.03 }, money: 1 } },
  { id: "d3", b: "dip", title: "Relación con EE. UU. y China", days: 420, req: "d2", now: { mil: 5 }, spirit: { name: "Socio Fiable", daily: { mil: 0.04 }, money: 1 } }
];
const FOCUS_LINKS = [
  { t: "Economía hundida destruye empleo", on: s => s.eco < 40, fx: { emp: -0.08 } },
  { t: "Economía fuerte crea empleo", on: s => s.eco > 65, fx: { emp: 0.04 } },
  { t: "Estabilidad baja erosiona la aprobación", on: s => s.est < 35, fx: { apr: -0.06 } },
  { t: "Ejército leal refuerza la estabilidad", on: s => s.mil > 70, fx: { est: 0.03 } }
];
const INTL_ACTIONS = [];
const PROJECTS = [
  {
    id: "sbahn",
    icon: "fa-train",
    title: "Modernización de Deutsche Bahn",
    spirit: { name: "Red Ferroviaria Puntual", daily: { eco: 0.04, emp: 0.02 }, money: 2350 },
    phases: [
      { n: "Estudios y permisos", cost: 15500, days: 40, now: {}, run: {} },
      { n: "Obras y construcción", cost: 117000, days: 150, now: { emp: 2, eco: 1 }, run: { emp: 0.02, eco: 0.01 } },
      { n: "Puesta en servicio", cost: 46750, days: 60, now: { eco: 2 }, run: {} }
    ]
  },
  {
    id: "h2",
    icon: "fa-bolt",
    title: "Red nacional de hidrógeno y renovables",
    spirit: { name: "Energiewende Completa", daily: { eco: 0.04, emp: 0.02 }, money: 2350 },
    phases: [
      { n: "Estudios y permisos", cost: 18250, days: 40, now: {}, run: {} },
      { n: "Obras y construcción", cost: 135250, days: 150, now: { emp: 2, eco: 1 }, run: { emp: 0.02, eco: 0.01 } },
      { n: "Puesta en servicio", cost: 52000, days: 60, now: { eco: 2 }, run: {} }
    ]
  },
  {
    id: "digi",
    icon: "fa-wifi",
    title: "Fibra óptica en todo el país",
    spirit: { name: "Alemania Digital", daily: { eco: 0.04, emp: 0.02 }, money: 2350 },
    phases: [
      { n: "Estudios y permisos", cost: 13000, days: 40, now: {}, run: {} },
      { n: "Obras y construcción", cost: 98750, days: 150, now: { emp: 2, eco: 1 }, run: { emp: 0.02, eco: 0.01 } },
      { n: "Puesta en servicio", cost: 36500, days: 60, now: { eco: 2 }, run: {} }
    ]
  }
];
const ACHIEVEMENTS = [
  { id: "m1", icon: "fa-flag", title: "Primer Mandato", desc: "Cumple tu primera misión", ok: s => s.goals && s.goals.done >= 1 },
  { id: "m5", icon: "fa-list-check", title: "Gestor Eficaz", desc: "Cumple 5 misiones", ok: s => s.goals && s.goals.done >= 5 },
  { id: "e80", icon: "fa-chart-line", title: "Auge Económico", desc: "Llega al 80% de Economía", ok: s => s.metrics && s.metrics.eco >= 80 },
  { id: "a80", icon: "fa-star", title: "Gran Popularidad", desc: "Llega al 80% de Aprobación", ok: s => s.metrics && s.metrics.apr >= 80 },
  { id: "s80", icon: "fa-shield-halved", title: "País en Calma", desc: "Llega al 80% de Estabilidad", ok: s => s.metrics && s.metrics.est >= 80 },
  { id: "j80", icon: "fa-people-roof", title: "Pleno Empleo", desc: "Llega al 80% de Empleo", ok: s => s.metrics && s.metrics.emp >= 80 }
];


// ---- 6. BANCO CENTRAL ----
const BDE_GOVS = [
  { id: "tecnico", name: "Joachim Nagel", tag: "Halcón del Bundesbank", cred: 10, desc: "Prioriza la estabilidad de precios. Los mercados le respetan." },
  { id: "afin", name: "Isabel Schnabel", tag: "Pragmática del BCE", cred: -10, desc: "Más dispuesto a facilitar crédito; los inversores recelan." }
];
const BDE_ACTIONS = [
  {
    id: "informe",
    icon: "fa-file-lines",
    label: "Encargar un informe de solvencia",
    desc: "Calma a los mercados.",
    cost: 390,
    cd: 60,
    when: () => true,
    run: B => { B.cred += 4; focusMetricAdd('eco', 1); }
  },
  {
    id: "bajar",
    icon: "fa-arrow-trend-down",
    label: "Bajar el tipo oficial (−25 pb)",
    desc: "Abarata el crédito: más actividad, algo más de inflación.",
    cost: 0,
    cd: 45,
    when: () => true,
    run: B => { B.cred -= 1; focusMetricAdd('eco', 2); focusMetricAdd('emp', 1); }
  },
  {
    id: "subir",
    icon: "fa-arrow-trend-up",
    label: "Subir el tipo oficial (+25 pb)",
    desc: "Frena la inflación a costa de la actividad.",
    cost: 0,
    cd: 45,
    when: () => true,
    run: B => { B.cred += 2; focusMetricAdd('eco', -1); }
  }
];


// ---- 7. ECONOMÍA Y MAPA ----
const COUNTRY_ECON = {
  currency: "€",
  terms: {
    leader: "Canciller federal",
    gov: "El Gobierno federal",
    place: "la Cancillería",
    cabinet: "Bundeskabinett",
    bank: "Bundesbank",
    nation: "Alemania",
    adj: "alemán",
    firms: "alemanas",
    capital: "Berlín",
    curName: "Euro",
    sovereign: false,
    pollster: "Forsa",
    pollsterLong: "Forsa (Institut für Sozialforschung)",
    oldCur: { name: "marco", sym: "DM", rate: 1.956 }
  },
  eu: { exit: { AFD: 15, LIN: 3, CDU: -25, SPD: -25, GRU: -30 }, undo: { AFD: -15, LIN: -3, CDU: 12, SPD: 12, GRU: 15 } },
  hideMin: [
    "igualdad"
  ],
  k: 2.6,
  budget: 780000,
  budgetStep: 6000,
  pib: 4500000,
  debt: 2700000,
  macroPib: 4500000,
  revPct: 0.46,
  pensPct: 0.11,
  otherPct: 0.13,
  baseRate: 2.9,
  debtMax: 1100000,
  cashCap: 250000,
  preset: { sanidad: 165000, educacion: 60000, defensa: 95000, vivienda: 20000, infraestructuras: 75000, deuda: 45000 },
  hint: "Presupuesto federal a escala de juego: pensiones y sanidad pesan mucho; la Bundeswehr crece con el fondo especial de defensa.",
  labels: { sanidad: "Gesundheit", educacion: "Bildung und Forschung", defensa: "Bundeswehr", vivienda: "Bauen und Wohnen", infraestructuras: "Verkehr und digitale Infrastruktur", deuda: "Intereses de la deuda federal" },
  pct: { sanidad: 20, educacion: 7, infraestructuras: 9, interior: 6, defensa: 12, economia: 14, vivienda: 3 },
  names: {
    economia: "Ministerio de Finanzas",
    interior: "Ministerio del Interior",
    defensa: "Ministerio de Defensa",
    vivienda: "Ministerio de Vivienda",
    territorio: "Ministerio de Agricultura",
    sanidad: "Ministerio de Sanidad",
    educacion: "Ministerio de Educación e Investigación",
    trabajo: "Ministerio de Trabajo y Asuntos Sociales",
    justicia: "Ministerio de Justicia",
    exteriores: "Auswärtiges Amt",
    transicion_ecologica: "Ministerio de Medio Ambiente",
    cultura: "Comisionado de Cultura",
    infraestructuras: "Ministerio de Transportes"
  },
  descs: { economia: "Hacienda, Presupuestos y política económica federal.", defensa: "Bundeswehr, compras y alianza OTAN.", interior: "Policía federal, migración y protección civil." },
  war: {
    id: 276,
    name: "Alemania",
    lat: 51,
    lon: 10,
    allied: "OTAN|UE",
    own: { t: 50, m: 34, a: 56 }, gens: [{"id": "tg", "n": "Generalleutnant Klaus-Dieter Hartmann", "t": "Inspector del Heer (Ejército de Tierra)", "d": "Estratega de maniobra terrestre; doctrina clásica y disciplina de hierro.", "fx": {"t": 6}, "pow": 1.05, "sup": 0, "mil": 3, "tag": "+6 Tierra · +5 % poder · +3 Estab. Militar"}, {"id": "mg", "n": "Vizeadmiral Jens Thorsten Brandvold", "t": "Inspector de la Marine", "d": "Controla el Báltico y el mar del Norte.", "fx": {"m": 8}, "pow": 1.02, "sup": 0.05, "mil": 2, "tag": "+8 Armada · +2 % poder · −5 % consumo de suministros"}, {"id": "ag", "n": "Generalleutnant Annette Vogelsang", "t": "Inspectora de la Luftwaffe", "d": "Superioridad aérea y guerra tecnológica.", "fx": {"a": 8}, "pow": 1.03, "sup": 0, "mil": 2, "tag": "+8 Aire · +3 % poder"}, {"id": "lg", "n": "Generalmajor Stefan Reichenbach", "t": "Jefe del Mando de Apoyo", "d": "Gana guerras de desgaste: las tropas aguantan más sin suministros.", "fx": {"t": 2, "m": 2, "a": 2}, "pow": 1, "sup": 0.25, "mil": 2, "tag": "+2 a cada ejército · −25 % consumo de suministros"}, {"id": "pg", "n": "General Matthias Eberhardt", "t": "Generalinspekteur afín a la Cancillería", "d": "Leal al poder civil. Menos brillante en combate, pero calma los cuarteles.", "fx": {}, "pow": 0.97, "sup": 0.05, "mil": 10, "tag": "+10 Estab. Militar · −3 % poder"}],
    add: [
      [
        724,
        "España",
        48,
        "UE·OTAN",
        1,
        80,
        0,
        40,
        -4
      ]
    ],
    drop: [],
    rel: {
      "724": 80,
      "250": 88,
      "826": 76,
      "380": 78,
      "840": 72,
      "643": 5,
      "156": 38,
      "616": 70,
      "804": 82,
      "792": 52,
      "376": 55,
      "408": 3,
      "364": 6,
      "356": 60,
      "392": 72,
      "484": 60
    }
  }
};
const COUNTRY_MAP = {
  title: "Mapa de los Länder de Alemania",
  paths: [
    { id: "SHH", name: "Schleswig-Holstein y Hamburgo", d: "M 271.5,52.2 L 267.7,114.8 L 265.7,115.8 L 180.4,87.0 L 195.2,75.9 L 195.2,30.0 L 232.7,34.6 L 264.4,53.0 Z", spectrumPref: 4.0, regionalist: false, desc: "Schleswig-Holstein y Hamburgo · Puertos, astilleros y minoría danesa" },
    { id: "NIB", name: "Baja Sajonia y Bremen", d: "M 207.6,179.2 L 144.7,124.5 L 152.0,108.1 L 180.4,87.0 L 265.7,115.8 L 236.1,173.9 L 225.9,180.3 Z", spectrumPref: 4.0, regionalist: false, desc: "Baja Sajonia y Bremen · Volkswagen, agricultura y puertos" },
    { id: "MV", name: "Mecklemburgo-Pomerania", d: "M 289.7,120.3 L 267.7,114.8 L 271.5,52.2 L 345.1,43.8 L 356.6,75.9 L 359.3,97.0 Z", spectrumPref: 4.6, regionalist: true, desc: "Mecklemburgo-Pomerania Occidental · Costa báltica y turismo, fuerte voto AfD" },
    { id: "BBB", name: "Berlín y Brandeburgo", d: "M 362.4,121.9 L 371.0,172.4 L 372.1,177.0 L 317.9,177.0 L 289.7,120.3 L 359.3,97.0 Z", spectrumPref: 3.6, regionalist: false, desc: "Berlín y Brandeburgo · Capital federal, tecnología y energía" },
    { id: "ST", name: "Sajonia-Anhalt", d: "M 317.9,177.0 L 296.8,200.6 L 236.1,173.9 L 265.7,115.8 L 267.7,114.8 L 289.7,120.3 Z", spectrumPref: 4.8, regionalist: false, desc: "Sajonia-Anhalt · Industria química y desindustrialización" },
    { id: "NRW", name: "Renania del Norte-Westfalia", d: "M 166.7,230.5 L 120.7,227.1 L 123.2,172.4 L 144.7,124.5 L 207.6,179.2 Z", spectrumPref: 3.8, regionalist: false, desc: "Renania del Norte-Westfalia · El mayor Land: Ruhr, industria y universidades" },
    { id: "HE", name: "Hesse", d: "M 225.9,180.3 L 245.9,263.8 L 232.8,275.8 L 202.8,275.8 L 166.7,230.5 L 207.6,179.2 Z", spectrumPref: 3.8, regionalist: false, desc: "Hesse · Fráncfort, banca y el BCE" },
    { id: "TH", name: "Turingia", d: "M 245.9,263.8 L 225.9,180.3 L 236.1,173.9 L 296.8,200.6 L 299.9,245.5 L 299.0,245.9 L 300.0,247.4 L 300.6,255.2 Z", spectrumPref: 5.0, regionalist: true, desc: "Turingia · Industria media y gran peso de la AfD" },
    { id: "SN", name: "Sajonia", d: "M 300.6,255.2 L 296.8,200.6 L 317.9,177.0 L 372.1,177.0 L 379.7,209.2 L 299.9,245.5 L 300.0,247.4 L 308.8,259.6 Z", spectrumPref: 5.0, regionalist: true, desc: "Sajonia · Dresde y Leipzig: tecnología y gran voto AfD" },
    { id: "RPS", name: "Renania-Palatinado y Sarre", d: "M 166.4,305.7 L 172.9,304.0 L 178.4,298.7 L 131.8,278.1 L 120.3,236.8 L 120.7,227.1 L 166.7,230.5 L 202.8,275.8 L 166.4,310.0 Z", spectrumPref: 4.2, regionalist: false, desc: "Renania-Palatinado y Sarre · Vinos, química y antigua minería" },
    { id: "BW", name: "Baden-Wurtemberg", d: "M 166.4,310.0 L 172.9,304.0 L 183.7,301.1 L 178.4,298.7 L 202.8,275.8 L 232.8,275.8 L 256.7,369.4 L 224.1,365.4 L 166.4,365.4 Z", spectrumPref: 4.4, regionalist: false, desc: "Baden-Wurtemberg · Motor industrial: Bosch, Mercedes y Porsche" },
    { id: "BY", name: "Baviera", d: "M 232.8,275.8 L 245.9,263.8 L 300.6,255.2 L 308.8,259.6 L 345.1,310.3 L 322.0,370.0 L 261.5,370.0 L 256.7,369.4 Z", spectrumPref: 5.4, regionalist: true, desc: "Baviera · CSU, Múnich, automoción y fuerte identidad propia" }
  ]
};


// ---- 8. RELACIONES EXTERIORES ----
const COUNTRY_INTL = {
  blocksText: "UE↔Rusia, EE. UU.↔China, Francia↔Reino Unido",
  partners: {
    ue: { name: "Unión Europea", icon: "fa-earth-europe", ally: { name: "Motor de Europa", daily: { eco: 0.05, mil: 0.02 }, money: 2400 }, tense: { name: "Berlín aislada en Bruselas", daily: { eco: -0.05 }, money: -1200 } },
    us: {
      name: "Estados Unidos",
      icon: "fa-flag-usa",
      ally: { name: "Alianza Atlántica Sólida", daily: { mil: 0.04, eco: 0.02 }, money: 1500 },
      tense: { name: "Fricción transatlántica", daily: { mil: -0.03, eco: -0.03 }, money: -900 }
    },
    ru: {
      name: "Rusia",
      icon: "fa-bear",
      ally: { name: "Distensión con Moscú", daily: { eco: 0.03, est: 0.02 }, money: 900 },
      tense: { name: "Amenaza rusa en el este", daily: { mil: -0.02, est: -0.04 }, money: -1200 }
    },
    cn: {
      name: "China",
      icon: "fa-dragon",
      ally: { name: "Socio comercial de China", daily: { eco: 0.05 }, money: 2100 },
      tense: { name: "Guerra comercial con Pekín", daily: { eco: -0.05, emp: -0.02 }, money: -1500 }
    },
    fr: { name: "Francia y Reino Unido", icon: "fa-handshake", ally: { name: "Eje franco-alemán", daily: { eco: 0.03, mil: 0.02 }, money: 900 }, tense: { name: "Eje roto con París", daily: { eco: -0.03 }, money: -600 } },
    ea: { name: "Polonia, Ucrania y flanco este", icon: "fa-shield-halved", ally: { name: "Flanco oriental firme", daily: { mil: 0.03, est: 0.02 }, money: 600 }, tense: { name: "Desconfianza del este", daily: { mil: -0.02 }, money: -450 } }
  },
  base: { ue: 78, us: 72, ru: 6, cn: 38, fr: 88, ea: 64 },
  links: { ru: { ea: -0.3, ue: -0.1 }, us: { cn: -0.2 }, cn: { us: -0.1 } },
  map: {
    ue: [
      250,
      380,
      724,
      620,
      56,
      528,
      40,
      246,
      752,
      208,
      372,
      300,
      191,
      100,
      642,
      705,
      703,
      233,
      428,
      440,
      442,
      348,
      196,
      470
    ],
    us: [
      840,
      124
    ],
    ru: [
      643,
      112
    ],
    cn: [
      156
    ],
    fr: [
      250,
      826
    ],
    ea: [
      616,
      804,
      203,
      703,
      233,
      428,
      440,
      498
    ]
  },
  actions: {
    ue: [
      { id: "cum", title: "Cumbre europea en Bruselas", cap: 8, cd: 60, fx: { ue: 10, fr: 2 } },
      { id: "pac", title: "Pacto europeo de competitividad", cap: 5, cd: 90, fx: { ue: 8 }, now: { eco: 1 }, inc: 1800 }
    ],
    us: [
      { id: "otan", title: "Reforzar el compromiso con la OTAN", cap: 6, cd: 60, fx: { us: 10, ru: -3 }, now: { mil: 2 }, cost: 1200 },
      { id: "gnl", title: "Compras de gas natural licuado", cap: 4, cd: 90, fx: { us: 6, ru: -2 }, now: { eco: 1 }, inc: 1500 }
    ],
    ru: [
      { id: "san", title: "Nuevo paquete de sanciones", cap: 6, cd: 60, fx: { ru: -10, ea: 4 }, now: { mil: 1 } },
      { id: "dia", title: "Canal de diálogo diplomático", cap: 10, cd: 90, fx: { ru: 8, ea: -3 }, now: { est: 1 } }
    ],
    cn: [
      { id: "com", title: "Cumbre económica con Pekín", cap: 10, cd: 90, fx: { cn: 10, us: -2 }, now: { eco: 2 }, inc: 1800 },
      { id: "chi", title: "Reducir la dependencia de China", cap: 6, cd: 60, fx: { cn: -8, us: 3 }, now: { eco: -1, mil: 1 }, cost: 900 }
    ],
    fr: [
      { id: "par", title: "Cumbre franco-alemana", cap: 8, cd: 60, fx: { fr: 10, ue: 2 } }
    ],
    ea: [
      { id: "bri", title: "Brigada alemana en Lituania", cap: 6, cd: 60, fx: { ea: 10, ru: -3 }, now: { mil: 2 }, cost: 1500 }
    ]
  },
  monthly: [
    { m: "eco", gt: 70, fx: { ue: 0.8, fr: 0.6, ea: 0.4 }, why: "Solidez económica alemana" },
    { m: "eco", lt: 30, fx: { ue: -1, fr: -0.8 }, why: "Estancamiento económico de Alemania" },
    { m: "mil", gt: 70, fx: { ea: 0.8, us: 0.6, ru: -0.4 }, why: "Bundeswehr creíble" },
    { m: "mil", lt: 40, fx: { ea: -1, us: -0.8 }, why: "Dudas sobre la Bundeswehr" }
  ],
  pop: [
    {
      id: "ruw",
      cond: r => r.ru <= 12,
      title: "AMENAZA RUSA EN EL BÁLTICO",
      desc: "Rusia realiza maniobras cerca de la frontera de la OTAN y los vecinos piden presencia alemana.",
      options: [
        { text: "Desplegar tropas alemanas", intl: { ea: 10, ru: -6 }, stats: { mil: 2, est: -1 }, news: "Alemania despliega tropas en el flanco este.", cost: 7750 },
        { text: "Apostar por la diplomacia", intl: { ru: 6, ea: -4 }, stats: { est: 1 }, news: "Berlín prefiere la vía diplomática ante Moscú." }
      ]
    },
    {
      id: "cnt",
      cond: r => r.cn <= 25,
      title: "PEKÍN AMENAZA A LA INDUSTRIA ALEMANA",
      desc: "China restringe materias primas críticas y presiona a las empresas alemanas.",
      options: [
        { text: "Negociar y ceder", intl: { cn: 10, us: -2 }, stats: { eco: 2, apr: -2 }, news: "Berlín cede ante Pekín para proteger a la industria." },
        { text: "Diversificar proveedores", intl: { cn: -6, us: 3 }, stats: { eco: -1, mil: 1 }, news: "Alemania diversifica su cadena de suministro.", cost: 7750 }
      ]
    }
  ]
};


// ---- 9. DECRETOS Y SOCIEDAD ----
const COUNTRY_DECREES = {
  tab: "Verordnungen",
  title: "BUNDESGESETZBLATT — VERORDNUNGEN DEL GOBIERNO",
  sub: "El Gobierno aprueba reglamentos que el Bundesrat y el Bundestag deben publicar antes de entrar en vigor.",
  pending: "DECRETOS EN TRÁMITE",
  btn: "FIRMAR",
  pub: "¡PUBLICADO! Entra en vigor",
  logPrefix: "Decreto enviado",
  list: [
    { id: "DEC_ALIVIO", title: "Alivio fiscal a las familias", cost: 3800, desc: "Economía +0.3 y Aprobación +0.1 por día durante 25 días.", cooldown: 60, statsPerDay: { eco: 0.3, apr: 0.1 } },
    { id: "DEC_EMPLEO", title: "Programa nacional de empleo juvenil", cost: 5250, desc: "Empleo +0.4 y Estabilidad +0.2 por día durante 25 días.", cooldown: 90, statsPerDay: { emp: 0.4, est: 0.2 } },
    { id: "DEC_PAGA", title: "Bonificación a las Fuerzas Armadas", cost: 2600, desc: "Lealtad militar +0.5 por día durante 25 días.", cooldown: 45, statsPerDay: { mil: 0.5 } },
    { id: "DEC_VIVIENDA", title: "Ayuda a la vivienda", cost: 2100, desc: "Estabilidad +0.3 y Aprobación +0.2 por día durante 25 días.", cooldown: 50, statsPerDay: { est: 0.3, apr: 0.2 } },
    { id: "DEC_SALUD", title: "Refuerzo de la salud pública", cost: 4700, desc: "Estabilidad +0.4 y Aprobación +0.3 por día durante 25 días.", cooldown: 75, statsPerDay: { est: 0.4, apr: 0.3 } },
    { id: "DEC_POLICIA", title: "Plan de apoyo a la policía", cost: 3100, desc: "Estabilidad +0.5 por día durante 25 días.", cooldown: 45, statsPerDay: { est: 0.5 } },
    { id: "DEC_INFRA", title: "Modernización de infraestructuras", cost: 7750, desc: "Economía +0.6 y Empleo +0.3 por día durante 25 días.", cooldown: 100, statsPerDay: { eco: 0.6, emp: 0.3 } },
    { id: "DEC_PYMES", title: "Rescate a la pequeña empresa", cost: 4150, desc: "Economía +0.4 y Empleo +0.3 por día durante 25 días.", cooldown: 70, statsPerDay: { eco: 0.4, emp: 0.3 } },
    { id: "DEC_DEFENSA", title: "Modernización de las Fuerzas Armadas", cost: 7250, desc: "Lealtad militar +0.8 por día durante 25 días.", cooldown: 90, statsPerDay: { mil: 0.8 } },
    { id: "DEC_DIPLO", title: "Fondo de diplomacia pública", cost: 800, desc: "Aprobación +0.3 por día durante 25 días.", cooldown: 40, statsPerDay: { apr: 0.3 } }
  ]
};
const COUNTRY_SOCIETY = {
  crises: [{"id": "apagon", "ic": "fa-bolt", "t": "APAGÓN NACIONAL", "col": "emp", "st": [["Un apagón masivo deja a media Alemania sin luz, sin trenes y sin comunicaciones.", [["Declarar la emergencia y movilizar al THW y a la Bundeswehr", 2, {"est": -1}, 1050, "Respuesta firme"], ["Pedir calma por televisión y esperar a los operadores de red", 1, {"apr": 1}, 0, "Prudente"], ["Cargar contra los operadores de red ante las cámaras", 0, {"apr": 3, "eco": -2}, 0, "Populista"]]], ["Pasadas 12 horas, los hospitales funcionan con generadores y hay saqueos en algunas ciudades.", [["Desplegar la policía federal y priorizar hospitales", 2, {}, 800, "Orden"], ["Pactar con los operadores un restablecimiento por fases", 2, {"eco": -1}, 0, "Negociación"], ["Importar energía de Francia y Polonia", 1, {"eco": 1}, 1550, "Costoso"]]], ["Vuelve la luz. Toca decidir cómo cerrar la crisis.", [["Comisión de investigación del Bundestag", 1, {"apr": 2}, 0, "Transparencia"], ["Plan de refuerzo de la red eléctrica", 2, {"eco": 2}, 2600, "Inversión"], ["Pasar página rápidamente", 0, {"apr": -1}, 0, "Barato"]]]]}, {"id": "fuego", "ic": "fa-fire", "t": "OLA DE INCENDIOS", "col": "rur", "st": [["Decenas de incendios simultáneos arrasan miles de hectáreas de bosque en varios Länder.", [["Activar el mecanismo europeo de protección civil", 2, {}, 0, "Cooperación"], ["Movilizar a la Bundeswehr y a los bomberos de todo el país", 2, {"mil": 1}, 1050, "Fuerza"], ["Culpar a los Länder", 0, {"apr": 2, "est": -2}, 0, "Confrontación"]]], ["El fuego amenaza núcleos urbanos y hay evacuaciones.", [["Evacuación preventiva masiva", 2, {}, 800, "Seguridad"], ["Concentrar los medios en los pueblos", 1, {}, 0, "Selectivo"], ["Esperar a que cambie el viento", 0, {"est": -2}, 0, "Pasivo"]]], ["Con el fuego extinguido, queda reconstruir.", [["Ayudas directas a los afectados", 2, {"apr": 2}, 3100, "Generoso"], ["Plan de reforestación y prevención", 2, {"est": 2}, 2100, "A largo plazo"], ["Declarar zona catastrófica y esperar fondos", 1, {}, 0, "Lento"]]]]}, {"id": "huelga", "ic": "fa-bullhorn", "t": "HUELGA GENERAL", "col": "obr", "st": [["ver.di e IG Metall convocan una huelga general contra la política del Gobierno.", [["Convocar a patronal y sindicatos a una mesa", 2, {}, 500, "Diálogo"], ["Decretar servicios mínimos estrictos", 0, {"est": -2}, 0, "Dureza"], ["Ignorar la convocatoria", 0, {}, 0, "Indiferencia"]]], ["La huelga paraliza puertos, trenes y fábricas; la calle está dividida.", [["Ofrecer una subida del salario mínimo", 2, {"emp": 1}, 1300, "Cesión"], ["Apelar a la ciudadanía por televisión", 1, {"apr": 1}, 0, "Comunicación"], ["Mantener la firmeza", 0, {"est": -2}, 0, "Firmeza"]]], ["Hay un preacuerdo sobre la mesa.", [["Firmarlo con foto de familia", 2, {"apr": 2}, 0, "Acuerdo"], ["Rebajarlo con letra pequeña", 1, {"eco": 1}, 0, "Astuto"], ["Romper la mesa", 0, {"est": -3}, 0, "Ruptura"]]]]}],
  intro: "En Alemania pesan la economía estancada, la migración, el auge de la AfD y el rearme.",
  cols: [
    { id: "ind", name: "Industria y sindicatos (IG Metall)", icon: "fa-industry", tgt: m => m.emp * .6 + m.eco * .4, hit: { emp: -0.04 }, up: { emp: 0.02 } },
    { id: "mit", name: "Mittelstand (pymes)", icon: "fa-briefcase", tgt: m => m.eco * .8 + m.est * .2, hit: { eco: -0.05 }, up: { eco: 0.03 } },
    { id: "jub", name: "Jubilados", icon: "fa-person-cane", tgt: m => m.est * .6 + m.eco * .4, hit: { est: -0.04 }, up: { est: 0.02 } },
    { id: "jov", name: "Jóvenes y estudiantes", icon: "fa-graduation-cap", tgt: m => m.emp * .5 + m.apr * .5, hit: { apr: -0.04 }, up: { apr: 0.03 } },
    { id: "ost", name: "Estados federados del este", icon: "fa-location-dot", tgt: m => m.apr * .5 + m.est * .5, hit: { est: -0.03, apr: -0.03 }, up: { apr: 0.02 } }
  ],
  scandals: [
    {
      t: "Escándalo en las compras del Ministerio de Defensa",
      d: "La prensa revela sobrecostes y retrasos en contratos de armamento.",
      o: [
        { x: "Abrir una investigación parlamentaria", now: { apr: -2 }, later: [
            30,
            { mil: 3 },
            "Mayor transparencia en las compras"
          ], cap: 4 },
        { x: "Defender al ministerio", now: { apr: -3, mil: 1 }, later: [
            40,
            { apr: -3 },
            "Crece la presión de la oposición"
          ], cap: -3 }
      ]
    },
    {
      t: "Bloqueo presupuestario en el Bundestag",
      d: "La coalición no logra aprobar a tiempo el presupuesto federal.",
      o: [
        { x: "Pactar con la oposición", now: { eco: -1 }, later: [
            30,
            { eco: 2, est: 2 },
            "Se aprueba el presupuesto"
          ], cap: 6 },
        { x: "Forzar el voto de confianza", now: { apr: -3, est: -2 }, later: [
            35,
            { est: -3 },
            "La coalición queda tocada"
          ], cap: -4 }
      ]
    }
  ]
};


// ---- 10. DEMOGRAFÍA ----
const COUNTRY_DEMO = {
  pop: 84.5,
  sh: [
    0.14,
    0.16,
    0.19,
    0.3,
    0.21
  ],
  tfr: 1.35,
  mig: 300,
  mort: 1.0,
  ss: 1.3,
  warScale: 300,
  ssName: "Deutsche Rentenversicherung",
  retName: "jubilados",
  note: "Alemania tiene una de las poblaciones más envejecidas del mundo: la generación del baby boom se jubila y sostener las pensiones depende de la inmigración y del empleo."
};
