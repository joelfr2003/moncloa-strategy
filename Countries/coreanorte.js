// =====================================================================
//  COREA DEL NORTE — MONCLOA STRATEGY (Countries/coreanorte.js)
//  Generado con plantilla-pais.js; edítalo con libertad. Registro: Countries/index.json
// =====================================================================

// ---- 1. CÁMARA Y ESCENARIOS ----
const CHAMBER = { seats: 687, majority: 344 };
const SCENARIOS = {
  ACTUAL: {
    id: "ACTUAL",
    title: "COREA DEL NORTE (2026)",
    desc: "Un Estado de partido único, nuclearizado y aislado, que depende de China y Rusia mientras sostiene la economía de planificación estatal bajo sanciones.",
    parties: [
      {
        id: "SDP",
        name: "Partido Socialdemócrata de Corea",
        leader: "Kim Yong Dae",
        seats: 50,
        baseSeats: 50,
        minSeats: 40,
        maxSeats: 150,
        basePct: 7.9,
        color: "#ef4444",
        isRegional: false,
        ideology: "Frente aliado",
        spectrumOrder: 1,
        redLines: []
      },
      {
        id: "CHON",
        name: "Partido Chondoísta Chongu",
        leader: "Ryu Mi Yong",
        seats: 22,
        baseSeats: 22,
        minSeats: 0,
        maxSeats: 66,
        basePct: 3.5,
        color: "#22c55e",
        isRegional: false,
        ideology: "Frente aliado",
        spectrumOrder: 2,
        redLines: []
      },
      {
        id: "PTC",
        name: "Partido del Trabajo de Corea",
        leader: "Kim Jong Un",
        seats: 607,
        baseSeats: 607,
        minSeats: 40,
        maxSeats: 1821,
        basePct: 96.3,
        color: "#b91c1c",
        isRegional: false,
        ideology: "Juche / Songun",
        spectrumOrder: 3,
        redLines: []
      },
      {
        id: "IND",
        name: "Diputados sin partido",
        leader: "Bloque sin partido",
        seats: 8,
        baseSeats: 8,
        minSeats: 0,
        maxSeats: 24,
        basePct: 1.3,
        color: "#64748b",
        isRegional: true,
        ideology: "Independientes",
        spectrumOrder: 3,
        redLines: []
      }
    ]
  }
};


// ---- 2. EVENTOS DE GOBIERNO ----
const DYNAMIC_EVENTS = [
  {
    id: "KP_DEFICIT",
    category: "ECONOMÍA",
    title: "AGUJERO EN LAS CUENTAS PÚBLICAS",
    desc: "Hacienda advierte de que el déficit se desvía de lo previsto y los mercados piden un plan creíble de ajuste.",
    condition: m => true,
    options: [
      { text: "Recortar gasto corriente", stats: { eco: 3, apr: -3, est: -1 }, cost: 1, loyaltyImpact: { PTC: 8, SDP: -6, CHON: -6 }, news: "El Partido y el Estado anuncia un recorte del gasto para contener el déficit." },
      { text: "Subir impuestos a las rentas altas", stats: { eco: -1, apr: 2 }, cost: 1, loyaltyImpact: { SDP: 8, CHON: 8, PTC: -6 }, news: "El Partido y el Estado sube la presión fiscal a las grandes rentas." },
      { text: "Emitir más deuda y aplazar el ajuste", stats: { eco: 1, apr: 1, est: -2 }, cost: 1, loyaltyImpact: {}, news: "El Tesoro emite deuda extra y los inversores exigen más intereses." }
    ]
  },
  {
    id: "KP_HUELGA",
    category: "SOCIEDAD",
    title: "PARO EN EL TRANSPORTE Y LA INDUSTRIA",
    desc: "Los sindicatos convocan paros que amenazan con bloquear puertos, trenes y fábricas durante semanas.",
    condition: m => true,
    options: [
      { text: "Negociar una subida salarial", stats: { emp: 3, eco: -2, apr: 3 }, cost: 90, loyaltyImpact: { SDP: 8, CHON: 8, PTC: -6 }, news: "Acuerdo salarial pone fin a los paros." },
      { text: "Declarar servicios mínimos estrictos", stats: { est: 2, apr: -3, emp: -1 }, cost: 1, loyaltyImpact: { PTC: 8, SDP: -6, CHON: -6 }, news: "El Gobierno impone servicios mínimos y los sindicatos protestan." }
    ]
  },
  {
    id: "KP_ENERGIA",
    category: "ECONOMÍA",
    title: "DISPARO DEL PRECIO DE LA ENERGÍA",
    desc: "La factura de la luz y el gas se dispara y hogares e industria reclaman ayudas urgentes.",
    condition: m => true,
    options: [
      { text: "Subsidiar la factura energética", stats: { apr: 4, eco: -1, est: 1 }, cost: 225, loyaltyImpact: { SDP: 8, CHON: 8, PTC: -6 }, news: "El Partido y el Estado subvenciona la factura energética." },
      { text: "Dejar actuar al mercado y apostar por la eficiencia", stats: { eco: 1, apr: -4, est: -2 }, cost: 1, loyaltyImpact: { PTC: 8, SDP: -6, CHON: -6 }, news: "El Gobierno rechaza intervenir los precios energéticos." }
    ]
  },
  {
    id: "KP_CIBER",
    category: "SEGURIDAD",
    title: "CIBERATAQUE A INFRAESTRUCTURAS CRÍTICAS",
    desc: "Un ataque informático paraliza hospitales, bancos y redes eléctricas durante horas.",
    condition: m => true,
    options: [
      { text: "Plan nacional de ciberdefensa", stats: { est: 3, mil: 2, apr: 1 }, cost: 120, loyaltyImpact: {}, news: "Se crea un plan de ciberdefensa tras el ataque." },
      { text: "Culpar al extranjero y reforzar la vigilancia", stats: { est: 1, apr: -2, mil: 1 }, cost: 30, loyaltyImpact: { PTC: 6, SDP: -5, CHON: -5 }, news: "El Gobierno atribuye el ataque a un actor extranjero." }
    ]
  },
  {
    id: "KP_PENSIONES",
    category: "SOCIEDAD",
    title: "PRESIÓN SOBRE LAS PENSIONES",
    desc: "El envejecimiento tensiona el sistema de pensiones y los expertos piden reformarlo.",
    condition: m => true,
    options: [
      { text: "Retrasar gradualmente la edad de jubilación", stats: { eco: 3, apr: -5, est: -1 }, cost: 1, loyaltyImpact: { PTC: 8, SDP: -6, CHON: -6 }, news: "Se aprueba retrasar la edad de jubilación." },
      { text: "Blindar las pensiones con más cotizaciones", stats: { apr: 3, eco: -2 }, cost: 150, loyaltyImpact: { SDP: 8, CHON: 8, PTC: -6 }, news: "Se blindan las pensiones con un aumento de las cotizaciones." }
    ]
  },
  {
    id: "KP_SEQUIA",
    category: "SOCIEDAD",
    title: "SEQUÍA Y OLA DE CALOR",
    desc: "Una sequía prolongada daña el campo, los embalses y el abastecimiento de varias regiones.",
    condition: m => true,
    options: [
      { text: "Declarar emergencia y ayudar al campo", stats: { apr: 3, est: 2, eco: -1 }, cost: 180, loyaltyImpact: {}, news: "Se declara emergencia por sequía y se aprueban ayudas." },
      { text: "Pedir ahorro voluntario", stats: { apr: -3, est: -2 }, cost: 1, loyaltyImpact: {}, news: "El Gobierno apela al ahorro voluntario de agua." }
    ]
  },
  {
    id: "KP_HAMBRUNA",
    category: "ECONOMÍA",
    title: "MALAS COSECHAS Y ESCASEZ DE ALIMENTOS",
    desc: "Las inundaciones y el cierre de fronteras provocan escasez de grano en las provincias del norte.",
    condition: m => true,
    options: [
      { text: "Importar grano de China y Rusia", stats: { est: 3, eco: -1, apr: 2 }, cost: 600, loyaltyImpact: {}, news: "Pionyang importa grano para evitar la hambruna." },
      { text: "Movilizar a la población al campo", stats: { est: 1, eco: 1, apr: -2 }, cost: 0, loyaltyImpact: { PTC: 4 }, news: "Se moviliza a la población para la campaña de cosecha." }
    ]
  },
  {
    id: "KP_MISILES",
    category: "SEGURIDAD",
    title: "PRUEBA DE UN NUEVO MISIL INTERCONTINENTAL",
    desc: "Los científicos del programa estratégico piden autorización para una nueva prueba de largo alcance.",
    condition: m => true,
    options: [
      { text: "Autorizar la prueba", stats: { mil: 5, est: 2, apr: 2, eco: -1 }, cost: 600, loyaltyImpact: {}, news: "Corea del Norte prueba un nuevo misil intercontinental." },
      { text: "Aplazar para negociar con China", stats: { mil: -1, eco: 2 }, cost: 0, loyaltyImpact: {}, news: "Pionyang aplaza la prueba tras una petición de Pekín." }
    ]
  },
  {
    id: "KP_DESERCION",
    category: "SOCIEDAD",
    title: "AUMENTAN LAS DESERCIONES EN LA FRONTERA",
    desc: "Más ciudadanos intentan cruzar a China en busca de comida y trabajo.",
    condition: m => true,
    options: [
      { text: "Reforzar la frontera y las patrullas", stats: { est: 3, apr: -2, con: -2 }, cost: 300, loyaltyImpact: {}, news: "Pionyang refuerza la vigilancia de la frontera." },
      { text: "Ampliar la distribución de alimentos", stats: { est: 2, apr: 3, eco: -1 }, cost: 450, loyaltyImpact: {}, news: "Se amplía el reparto de alimentos en las provincias fronterizas." }
    ]
  },
  {
    id: "KP_RUSIA",
    category: "EXTERIOR",
    title: "ACUERDO DE COOPERACIÓN CON MOSCÚ",
    desc: "Rusia ofrece petróleo, alimentos y tecnología a cambio de munición y apoyo militar.",
    condition: m => true,
    options: [
      { text: "Firmar el acuerdo", stats: { eco: 3, mil: 3, est: 1 }, cost: 0, loyaltyImpact: {}, news: "Pionyang y Moscú firman un acuerdo de cooperación militar y económica." },
      { text: "Mantener la distancia con Rusia y China", stats: { eco: -2, apr: 1 }, cost: 0, loyaltyImpact: {}, news: "Pionyang rechaza ligarse a Moscú." }
    ]
  },
  {
    id: "KP_MERCADOS",
    category: "ECONOMÍA",
    title: "EXPANDEN LOS MERCADOS Y EL COMERCIO INFORMAL",
    desc: "Los jangmadang, los mercados locales, crecen y erosionan el control estatal sobre la economía.",
    condition: m => true,
    options: [
      { text: "Tolerarlos y gravarlos", stats: { eco: 3, emp: 2, con: -2 }, cost: 0, loyaltyImpact: { PTC: 0 }, news: "El Estado tolera y grava los mercados locales." },
      { text: "Reprimirlos y reforzar el racionamiento", stats: { eco: -3, est: 2, apr: -3 }, cost: 300, loyaltyImpact: { PTC: 4 }, news: "Pionyang reprime los mercados informales." }
    ]
  }
];
const CAMPAIGN_HEADLINES = [
  {
    id: 1,
    newspaper: "RODONG SINMUN",
    headline: "LA ECONOMÍA, EL TEMA DE LA CAMPAÑA",
    desc: "Los precios y el empleo dominan el debate. ¿Cómo respondes?",
    options: [
      { text: "Presentar un plan económico detallado", score: 9, textResult: "El plan transmite solvencia y refuerza tu campaña." },
      { text: "Atacar a los rivales sin propuestas", score: -4, textResult: "Suena a excusa y los rivales lo explotan." }
    ]
  },
  {
    id: 2,
    newspaper: "RODONG SINMUN",
    headline: "DEBATE ELECTORAL CARA A CARA",
    desc: "Los líderes se miden en el gran debate televisado.",
    options: [
      { text: "Mostrar serenidad y datos", score: 7, textResult: "Se te ve presidencial y ganas el debate." },
      { text: "Subir el tono y atacar", score: -5, textResult: "La agresividad se vuelve en tu contra." }
    ]
  },
  {
    id: 3,
    newspaper: "KOREAN CENTRAL NEWS AGENCY",
    headline: "EL CONGRESO DEL PARTIDO FIJA LA LÍNEA DEL PRÓXIMO QUINQUENIO",
    desc: "El Partido define sus objetivos económicos y militares.",
    options: [
      { text: "Priorizar la economía de planificación", score: 6, textResult: "El Congreso respalda un giro económico moderado." },
      { text: "Priorizar el programa nuclear", score: -2, textResult: "La línea dura se impone, pero hunde el bienestar." }
    ]
  }
];


// ---- 3. PRENSA, MINISTERIOS Y CRISIS ----
const PRESS_NEWS_BANK = [
  {
    id: "KP_N1",
    newspaper: "RODONG SINMUN",
    headline: "LAS AGENCIAS DE CALIFICACIÓN REVISAN LA NOTA",
    desc: "Los analistas evalúan la solvencia del país tras los últimos datos.",
    options: [
      { text: "Presumir de reformas", stats: { eco: 2, apr: 1 }, cost: 0, news: "El Gobierno defiende sus reformas ante los analistas." },
      { text: "Restar importancia", stats: { eco: -1, apr: -1 }, news: "El Gobierno resta importancia a la revisión." }
    ]
  },
  {
    id: "KP_N2",
    newspaper: "RODONG SINMUN",
    headline: "NUEVA ENCUESTA DE INTENCIÓN DE VOTO",
    desc: "El sondeo muestra un electorado dividido y volátil.",
    options: [
      { text: "Hacer campaña permanente", stats: { apr: 2, est: -1 }, cost: 0, news: "El Gobierno se vuelca en la calle." },
      { text: "Ignorar los sondeos", stats: { apr: -1, est: 1 }, news: "El Gobierno dice gobernar sin mirar las encuestas." }
    ]
  },
  {
    id: "KP_N3",
    newspaper: "RODONG SINMUN",
    headline: "EL PAÍS CELEBRA UN ÉXITO DEPORTIVO",
    desc: "Un triunfo internacional llena las calles de alegría.",
    options: [
      { text: "Recibir a los campeones", stats: { apr: 3, est: 1 }, cost: 0, news: "El Gobierno recibe a los campeones en un acto multitudinario." },
      { text: "Mantener la agenda", stats: { apr: -1 }, news: "El Gobierno se desmarca de las celebraciones." }
    ]
  },
  {
    id: "KP_N4",
    newspaper: "RODONG SINMUN",
    headline: "LA PRODUCCIÓN INDUSTRIAL SORPRENDE",
    desc: "Los datos de industria superan o decepcionan a los analistas.",
    options: [
      { text: "Anunciar un plan industrial", stats: { eco: 3, emp: 2 }, cost: 0, news: "El Gobierno lanza un plan de impulso industrial." },
      { text: "Esperar a más datos", stats: { eco: 0, apr: -1 }, news: "El Gobierno pide prudencia con los datos." }
    ]
  },
  {
    id: "KP_N5",
    newspaper: "RODONG SINMUN",
    headline: "UN INFORME CRITICA LA GESTIÓN PÚBLICA",
    desc: "Un organismo independiente señala ineficiencias en la administración.",
    options: [
      { text: "Aceptar las críticas y reformar", stats: { apr: 2, eco: 1 }, cost: 0, news: "El Gobierno anuncia una reforma administrativa." },
      { text: "Desacreditar el informe", stats: { apr: -2, est: -1 }, news: "El Gobierno cuestiona el informe." }
    ]
  },
  {
    id: "KP_N6",
    newspaper: "RODONG SINMUN",
    headline: "GRAN FERIA DE INVERSIÓN INTERNACIONAL",
    desc: "Inversores extranjeros evalúan nuevos proyectos en el país.",
    options: [
      { text: "Ofrecer incentivos fiscales", stats: { eco: 3, emp: 1 }, cost: 0, news: "El Gobierno ofrece incentivos para atraer inversión." },
      { text: "Mantener las condiciones", stats: { eco: 1 }, news: "El Gobierno mantiene el marco actual." }
    ]
  },
  {
    id: "KP_N7",
    newspaper: "KCNA",
    headline: "SE INAUGURA UN NUEVO COMPLEJO INDUSTRIAL",
    desc: "La prensa oficial celebra la inauguración de una gran fábrica.",
    options: [
      { text: "Presumir de la planificación estatal", stats: { eco: 2, apr: 2 }, cost: 0, news: "El Partido celebra la nueva fábrica como un triunfo del Juche." },
      { text: "Pasar de puntillas", stats: { apr: -1 }, news: "El Gobierno no hace gran ruido sobre la fábrica." }
    ]
  }
];
const MINISTRY_DECISIONS_BANK = {
  sanidad: [
    { title: "Reforzar hospitales y atención primaria", cost: 225, stats: { apr: 4, est: 2 } },
    { title: "Plan de salud pública y prevención", cost: 150, stats: { apr: 3, est: 1 } }
  ],
  educacion: [
    { title: "Plan de becas y refuerzo escolar", cost: 175, stats: { apr: 3, emp: 1 } },
    { title: "Formación profesional y empleo joven", cost: 200, stats: { emp: 3, eco: 1 } }
  ],
  infraestructuras: [
    { title: "Modernizar carreteras y ferrocarril", cost: 350, stats: { eco: 2, emp: 2 } },
    { title: "Conectar regiones aisladas", cost: 225, stats: { est: 2, apr: 2 } }
  ],
  interior: [
    { title: "Reforzar la seguridad ciudadana", cost: 125, stats: { est: 3, apr: 1 } },
    { title: "Modernizar fronteras y control migratorio", cost: 150, stats: { est: 2 } }
  ],
  defensa: [
    { title: "Modernizar equipos y flota", cost: 325, stats: { mil: 4, eco: -1 } },
    { title: "Mejorar la paga y la formación de las tropas", cost: 140, stats: { mil: 3 } },
    { title: "Programa de armas estratégicas", cost: 300, stats: { mil: 5, eco: -2 } }
  ],
  economia: [
    { title: "Auditoría y racionalización del gasto", cost: 1, stats: { eco: 1, apr: -1 } },
    { title: "Incentivos a la inversión empresarial", cost: 150, stats: { eco: 3, emp: 1 } }
  ],
  vivienda: [
    { title: "Plan de vivienda asequible", cost: 200, stats: { apr: 3, est: 2 } },
    { title: "Facilitar suelo para construir", cost: 75, stats: { eco: 1, apr: 2 } }
  ],
  territorio: [
    { title: "Plan de desarrollo regional", cost: 175, stats: { est: 2, apr: 2 } },
    { title: "Ayudas a las zonas rurales", cost: 150, stats: { emp: 2, apr: 1 } }
  ],
  trabajo: [
    { title: "Programa de empleo y formación", cost: 160, stats: { emp: 3 } },
    { title: "Mejorar la protección de los trabajadores", cost: 125, stats: { apr: 3, eco: -1 } }
  ],
  justicia: [
    { title: "Agilizar los tribunales", cost: 90, stats: { est: 2, apr: 1 } },
    { title: "Reforzar la lucha anticorrupción", cost: 75, stats: { apr: 3, est: 1 } }
  ],
  exteriores: [
    { title: "Ofensiva diplomática en organismos internacionales", cost: 45, stats: { apr: 1, mil: 1 } },
    { title: "Promover exportaciones y comercio", cost: 75, stats: { eco: 2 } }
  ],
  transicion_ecologica: [
    { title: "Apoyar energías renovables", cost: 225, stats: { eco: 2, apr: 1 } },
    { title: "Plan de eficiencia energética", cost: 140, stats: { eco: 1, est: 1 } }
  ],
  cultura: [
    { title: "Apoyo a la cultura y el patrimonio", cost: 60, stats: { apr: 2 } },
    { title: "Promoción del deporte", cost: 70, stats: { apr: 2, est: 1 } }
  ],
  igualdad: [
    { title: "Plan de conciliación familiar", cost: 125, stats: { apr: 3, est: 1 } },
    { title: "Servicios sociales de proximidad", cost: 110, stats: { apr: 2, est: 1 } }
  ]
};
const HOUSING_EVENTS = [
  {
    id: "KP_HOUS",
    category: "SOCIEDAD",
    title: "LA VIVIENDA EN LAS PROVINCIAS SE DETERIORA",
    desc: "Faltan casas y electricidad fuera de Pionyang.",
    options: [
      { text: "Campaña de construcción provincial", stats: { apr: 5, est: 3, eco: -1 }, cost: 150, loyaltyImpact: {}, news: "El Partido lanza una campaña de vivienda en las provincias." },
      { text: "Priorizar la capital", stats: { apr: -2, est: 1 }, cost: 0, loyaltyImpact: {}, news: "El Partido concentra la inversión en Pionyang." }
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
      { text: "Desplegar todos los medios y el ejército", cost: 120, stats: { est: 3, apr: 2 }, news: "El Gobierno despliega todos los medios contra los incendios." },
      { text: "Dejar la gestión a las autoridades locales", cost: 0, stats: { est: -4, apr: -5 }, news: "Críticas por la lenta respuesta a los incendios." }
    ]
  },
  {
    cat: "ECONOMÍA",
    min: "economia",
    title: "QUIEBRA DE UN GRAN BANCO REGIONAL",
    desc: "Un banco de tamaño medio se declara insolvente y el pánico amenaza con contagiarse.",
    options: [
      { text: "Rescate público con garantías", cost: 300, stats: { eco: 3, apr: -3 }, news: "El Estado rescata al banco para evitar el contagio." },
      { text: "Dejar quebrar y proteger a los depositantes", cost: 100, stats: { eco: -3, apr: 1 }, news: "El banco quiebra y se protege solo a los pequeños ahorradores." }
    ]
  },
  {
    cat: "SANIDAD",
    min: "sanidad",
    title: "BROTE EPIDÉMICO",
    desc: "Un brote de gripe grave satura los hospitales en pleno invierno.",
    options: [
      { text: "Plan de contingencia y refuerzo sanitario", cost: 150, stats: { est: 3, apr: 2 }, news: "Plan de contingencia sanitaria contra el brote." },
      { text: "Medidas mínimas", cost: 0, stats: { est: -3, apr: -4 }, news: "Los hospitales se saturan ante el brote." }
    ]
  },
  {
    cat: "EMERGENCIAS",
    min: "interior",
    title: "INUNDACIONES EN LA FRONTERA NORTE",
    desc: "Las lluvias torrenciales destruyen casas y cultivos en las provincias fronterizas.",
    options: [
      { text: "Movilizar al ejército para reconstruir", cost: 120, stats: { est: 3, apr: 2 }, news: "El ejército reconstruye las zonas inundadas." },
      { text: "Pedir ayuda a China", cost: 0, stats: { est: -1, apr: -2 }, news: "Pionyang pide ayuda a China tras las inundaciones." }
    ]
  }
];


// ---- 4. MINISTROS ----
const REAL_MINISTERS = [
  {
    id: "song_ptc",
    name: "Pak Thae Song",
    party: "PTC",
    portfolio: "economia",
    desc: "+1.5% Economía, +0.5% Aprobación",
    pros: "+1.5% Economía, +0.5% Aprobación",
    cons: "Ninguno",
    effects: { eco: 1.5, apr: 0.5 }
  },
  {
    id: "hui_ptc",
    name: "Choe Son Hui",
    party: "PTC",
    portfolio: "exteriores",
    desc: "+1.0% Aprobación, +1.0% Lealtad militar",
    pros: "+1.0% Aprobación, +1.0% Lealtad militar",
    cons: "Ninguno",
    effects: { apr: 1, mil: 1 }
  },
  {
    id: "chol_ptc",
    name: "No Kwang Chol",
    party: "PTC",
    portfolio: "defensa",
    desc: "+2.0% Lealtad militar, +0.5% Aprobación",
    pros: "+2.0% Lealtad militar, +0.5% Aprobación",
    cons: "Ninguno",
    effects: { mil: 2, apr: 0.5 }
  },
  {
    id: "sop_ptc",
    name: "Ri Thae Sop",
    party: "PTC",
    portfolio: "interior",
    desc: "+2.0% Estabilidad",
    pros: "+2.0% Estabilidad",
    cons: "-1.0% Aprobación",
    effects: { est: 2, apr: -1 }
  },
  {
    id: "won_ptc",
    name: "Jo Yong Won",
    party: "PTC",
    portfolio: "trabajo",
    desc: "+1.5% Empleo, +0.5% Aprobación",
    pros: "+1.5% Empleo, +0.5% Aprobación",
    cons: "Ninguno",
    effects: { emp: 1.5, apr: 0.5 }
  },
  {
    id: "jong_ptc",
    name: "Kim Yo Jong",
    party: "PTC",
    portfolio: "cultura",
    desc: "+2.0% Aprobación, +0.5% Estabilidad",
    pros: "+2.0% Aprobación, +0.5% Estabilidad",
    cons: "Ninguno",
    effects: { apr: 2, est: 0.5 }
  }
];


// ---- 5. MISIONES, ACCIONES, FOCOS, PROYECTOS Y LOGROS ----
const GOAL_POOL = [
  { id: "eco", icon: "fa-chart-line", title: "Milagro Económico", desc: "Mantén la Economía ≥ 70%", check: s => s.metrics.eco >= 70 },
  { id: "est", icon: "fa-shield-halved", title: "Unidad Nacional", desc: "Mantén la Estabilidad ≥ 65%", check: s => s.metrics.est >= 65 },
  { id: "emp", icon: "fa-people-roof", title: "Pleno Empleo", desc: "Mantén el Empleo ≥ 70%", check: s => s.metrics.emp >= 70 },
  { id: "apr", icon: "fa-thumbs-up", title: "Líder Querido", desc: "Mantén la Aprobación ≥ 60%", check: s => s.metrics.apr >= 60 },
  { id: "mil", icon: "fa-shield", title: "Fuerzas Armadas Leales", desc: "Mantén la lealtad militar ≥ 70%", check: s => s.metrics.mil >= 70 },
  { id: "caja", icon: "fa-vault", title: "Caja Saneada", desc: "Acumula una tesorería ≥ 5000 M", check: s => (Number(s.treasury) || 0) >= 5000 },
  { id: "songun", icon: "fa-shield", title: "Songun: el Ejército Primero", desc: "Mantén la lealtad militar ≥ 80%", check: s => s.metrics.mil >= 80 },
  { id: "juche", icon: "fa-people-group", title: "Juche Consolidado", desc: "Mantén la Estabilidad ≥ 70%", check: s => s.metrics.est >= 70 }
];
const GOAL_ACTIONS = [
  {
    id: "tv",
    icon: "fa-tv",
    title: "Discurso del Líder Supremo",
    cap: 15,
    cost: 0,
    cd: 30,
    fx: { apr: 6, est: 2 },
    news: "El Líder Supremo se dirige al pueblo desde Pionyang."
  },
  {
    id: "gira",
    icon: "fa-bus",
    title: "Gira por las regiones",
    cap: 10,
    cost: 30,
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
    id: "orient",
    icon: "fa-bullhorn",
    title: "Orientación práctica del Líder Supremo",
    cap: 10,
    cost: 0,
    cd: 45,
    fx: { apr: 5, eco: 2 },
    news: "El Líder visita una fábrica y da instrucciones prácticas."
  }
];
const FOCUS_TREE = [
  { id: "e1", b: "eco", title: "Plan quinquenal de desarrollo", days: 300, now: { eco: 3 }, spirit: { name: "Economía de Planificación", daily: { eco: 0.02 }, money: 45 } },
  { id: "e2", b: "eco", title: "Granjas colectivas y cosecha", days: 360, req: "e1", now: { eco: 4 }, spirit: { name: "Cosecha Segura", daily: { eco: 0.03 }, money: 90 } },
  { id: "e3", b: "eco", title: "Zonas económicas especiales", days: 420, req: "e2", now: { eco: 5 }, spirit: { name: "Zonas Francas", daily: { eco: 0.04 }, money: 135 } },
  { id: "s1", b: "soc", title: "Campaña de vivienda en Pionyang", days: 300, now: { apr: 3 }, spirit: { name: "Ciudad de Pionyang", daily: { apr: 0.02 }, money: 1 } },
  { id: "s2", b: "soc", title: "Salud y educación gratuitas", days: 360, req: "s1", now: { apr: 4 }, spirit: { name: "Pueblo Sano", daily: { apr: 0.03 }, money: 1 } },
  { id: "s3", b: "soc", title: "Movilización política", days: 420, req: "s2", now: { apr: 5 }, spirit: { name: "Fervor Colectivo", daily: { apr: 0.04 }, money: 1 } },
  { id: "g1", b: "seg", title: "Fuerzas estratégicas nucleares", days: 300, now: { est: 3 }, spirit: { name: "Disuasión Nuclear", daily: { est: 0.02 }, money: 1 } },
  { id: "g2", b: "seg", title: "Ejército Popular modernizado", days: 360, req: "g1", now: { est: 4 }, spirit: { name: "Songun Moderno", daily: { est: 0.03 }, money: 1 } },
  { id: "g3", b: "seg", title: "Seguridad del Estado", days: 420, req: "g2", now: { est: 5 }, spirit: { name: "Estado Vigilante", daily: { est: 0.04 }, money: 1 } },
  { id: "d1", b: "dip", title: "Alianza con China y Rusia", days: 300, now: { mil: 3 }, spirit: { name: "Alianza del Norte", daily: { mil: 0.02 }, money: 1 } },
  { id: "d2", b: "dip", title: "Comercio fronterizo", days: 360, req: "d1", now: { mil: 4 }, spirit: { name: "Frontera Productiva", daily: { mil: 0.03 }, money: 1 } },
  { id: "d3", b: "dip", title: "Diplomacia nuclear", days: 420, req: "d2", now: { mil: 5 }, spirit: { name: "Mesa de Negociación", daily: { mil: 0.04 }, money: 1 } }
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
    id: "pyong",
    icon: "fa-city",
    title: "Construcción de 50.000 viviendas en Pionyang",
    spirit: { name: "Pionyang Resplandeciente", daily: { eco: 0.04, emp: 0.02 }, money: 45 },
    phases: [
      { n: "Estudios y permisos", cost: 150, days: 40, now: {}, run: {} },
      { n: "Obras y construcción", cost: 1100, days: 150, now: { emp: 2, eco: 1 }, run: { emp: 0.02, eco: 0.01 } },
      { n: "Puesta en servicio", cost: 450, days: 60, now: { eco: 2 }, run: {} }
    ]
  },
  {
    id: "agri",
    icon: "fa-wheat-awn",
    title: "Modernización de granjas y regadío",
    spirit: { name: "Granero del Norte", daily: { eco: 0.04, emp: 0.02 }, money: 45 },
    phases: [
      { n: "Estudios y permisos", cost: 125, days: 40, now: {}, run: {} },
      { n: "Obras y construcción", cost: 900, days: 150, now: { emp: 2, eco: 1 }, run: { emp: 0.02, eco: 0.01 } },
      { n: "Puesta en servicio", cost: 350, days: 60, now: { eco: 2 }, run: {} }
    ]
  },
  {
    id: "zona",
    icon: "fa-industry",
    title: "Zonas económicas especiales de la frontera",
    spirit: { name: "Puerta de China", daily: { eco: 0.04, emp: 0.02 }, money: 45 },
    phases: [
      { n: "Estudios y permisos", cost: 175, days: 40, now: {}, run: {} },
      { n: "Obras y construcción", cost: 1250, days: 150, now: { emp: 2, eco: 1 }, run: { emp: 0.02, eco: 0.01 } },
      { n: "Puesta en servicio", cost: 500, days: 60, now: { eco: 2 }, run: {} }
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
  { id: "tecnico", name: "Kim Tok Hun", tag: "Tecnócrata del Partido", cred: 10, desc: "Prioriza la estabilidad de precios. Los mercados le respetan." },
  { id: "afin", name: "Pak Thae Song", tag: "Economista del Gabinete", cred: -10, desc: "Más dispuesto a facilitar crédito; los inversores recelan." }
];
const BDE_ACTIONS = [
  {
    id: "informe",
    icon: "fa-file-lines",
    label: "Encargar un informe de solvencia",
    desc: "Calma a los mercados.",
    cost: 8,
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
  currency: "₩",
  terms: {
    leader: "Líder Supremo",
    gov: "El Partido y el Estado",
    place: "el Palacio del Sol de Kumsusan",
    cabinet: "Gabinete de la RPDC",
    bank: "Banco Central de la RPDC",
    nation: "Corea del Norte",
    adj: "norcoreano",
    firms: "norcoreanas",
    capital: "Pionyang",
    curName: "Won norcoreano",
    sovereign: true,
    pollster: "Oficina de la Línea Política",
    pollsterLong: "Departamento de Propaganda del Partido"
  },
  hideMin: [
    "igualdad",
    "vivienda",
    "transicion_ecologica",
    "cultura"
  ],
  k: 0.05,
  budget: 4000,
  budgetStep: 40,
  pib: 30000,
  debt: 20000,
  macroPib: 30000,
  revPct: 0.5,
  pensPct: 0.1,
  otherPct: 0.1,
  baseRate: 3,
  debtMax: 15000,
  cashCap: 3000,
  preset: { sanidad: 350, educacion: 300, defensa: 1000, vivienda: 100, infraestructuras: 250, deuda: 100 },
  hint: "Economía de planificación estatal a escala de juego: el gasto militar y de seguridad domina el presupuesto y los recursos son escasos.",
  labels: { sanidad: "Salud pública", educacion: "Educación", defensa: "Songun: Fuerzas Armadas y programa estratégico", vivienda: "Construcción", infraestructuras: "Energía y transporte", deuda: "Pagos externos" },
  pct: { sanidad: 9, educacion: 7, infraestructuras: 8, interior: 14, defensa: 40, economia: 12, vivienda: 3 },
  names: {
    economia: "Comisión Estatal de Planificación",
    interior: "Ministerio de Seguridad del Estado",
    defensa: "Ministerio de las Fuerzas Armadas del Pueblo",
    territorio: "Ministerio de Agricultura",
    sanidad: "Ministerio de Salud Pública",
    educacion: "Ministerio de Educación",
    trabajo: "Ministerio de Trabajo",
    justicia: "Fiscalía Central",
    exteriores: "Ministerio de Asuntos Exteriores",
    infraestructuras: "Ministerio de Ferrocarriles y Energía"
  },
  descs: { defensa: "Ejército Popular, programa nuclear y misilístico, fuerzas estratégicas.", economia: "Planificación central, racionamiento y comercio exterior." },
  war: {
    id: 408,
    name: "Corea del Norte",
    lat: 40,
    lon: 127,
    allied: "—",
    own: { t: 72, m: 28, a: 30 },
    add: [
      [
        724,
        "España",
        48,
        "UE·OTAN",
        1,
        5,
        0,
        40,
        -4
      ]
    ],
    drop: [],
    rel: {
      "724": 8,
      "840": 2,
      "410": 2,
      "392": 3,
      "156": 75,
      "643": 85,
      "364": 60,
      "826": 4,
      "250": 5,
      "276": 4,
      "380": 6,
      "616": 4,
      "804": 2,
      "356": 25,
      "704": 55,
      "418": 40
    }
  }
};
const COUNTRY_MAP = {
  title: "Mapa de las provincias de Corea del Norte",
  paths: [
    { id: "PYO", name: "Pionyang", d: "M 208.1,279.6 L 149.7,312.1 L 106.0,297.8 L 99.9,273.9 L 91.3,258.2 L 93.9,257.2 L 205.4,266.1 Z", spectrumPref: 4.5, regionalist: false, desc: "Pionyang · Capital, élite del Partido y escaparate del régimen" },
    { id: "SPY", name: "Pyongan del Sur", d: "M 211.9,221.5 L 205.4,266.1 L 93.9,257.2 L 171.4,197.8 L 206.3,213.4 Z", spectrumPref: 5.0, regionalist: false, desc: "Pyongan del Sur · Industria y minería cerca de la capital" },
    { id: "NPY", name: "Pyongan del Norte", d: "M 93.9,257.2 L 91.3,258.2 L 71.6,222.2 L 105.6,207.4 L 155.7,171.7 L 171.4,197.8 Z", spectrumPref: 5.0, regionalist: false, desc: "Pyongan del Norte · Frontera con China y comercio" },
    { id: "CHA", name: "Chagang", d: "M 167.9,163.0 L 214.6,81.8 L 237.3,134.1 L 206.3,213.4 L 171.4,197.8 L 155.7,171.7 Z", spectrumPref: 5.4, regionalist: false, desc: "Chagang · Industria militar y montañas" },
    { id: "NHW", name: "Hwanghae del Norte", d: "M 262.7,344.6 L 207.5,362.6 L 173.5,370.0 L 168.0,368.2 L 149.7,312.1 L 208.1,279.6 Z", spectrumPref: 5.0, regionalist: false, desc: "Hwanghae del Norte · Agricultura y frontera sur" },
    { id: "SHW", name: "Hwanghae del Sur", d: "M 111.3,318.3 L 106.0,297.8 L 149.7,312.1 L 168.0,368.2 L 128.2,355.2 Z", spectrumPref: 5.0, regionalist: false, desc: "Hwanghae del Sur · Granero del país" },
    { id: "KAN", name: "Kangwon", d: "M 208.1,279.6 L 205.4,266.1 L 211.9,221.5 L 264.4,217.9 L 258.5,222.2 L 303.8,310.9 L 298.1,333.0 L 262.7,344.6 Z", spectrumPref: 4.8, regionalist: false, desc: "Kangwon · Costa este y turismo de Wonsan-Kalma" },
    { id: "SHA", name: "Hamgyong del Sur", d: "M 211.9,221.5 L 206.3,213.4 L 237.3,134.1 L 323.3,175.2 L 264.4,217.9 Z", spectrumPref: 5.2, regionalist: false, desc: "Hamgyong del Sur · Industria química y puerto de Hamhung" },
    { id: "RYA", name: "Ryanggang", d: "M 323.3,175.2 L 237.3,134.1 L 214.6,81.8 L 218.9,74.3 L 281.1,59.6 L 289.4,57.0 L 352.6,153.9 Z", spectrumPref: 5.4, regionalist: false, desc: "Ryanggang · Frontera norte y montaña Paektu" },
    { id: "NHA", name: "Hamgyong del Norte", d: "M 352.6,153.9 L 289.4,57.0 L 366.8,33.3 L 395.0,80.7 L 360.4,148.3 Z", spectrumPref: 5.2, regionalist: false, desc: "Hamgyong del Norte · Minería, puerto de Chongjin y frontera con Rusia" },
    { id: "RAS", name: "Rason", d: "M 366.8,33.3 L 377.4,30.0 L 428.4,30.0 L 405.7,59.6 L 395.0,80.7 Z", spectrumPref: 4.4, regionalist: false, desc: "Rason · Zona económica especial junto a China y Rusia" }
  ]
};


// ---- 8. RELACIONES EXTERIORES ----
const COUNTRY_INTL = {
  blocksText: "China↔Rusia, EE. UU.↔Corea del Sur↔Japón",
  partners: {
    cn: { name: "China", icon: "fa-dragon", ally: { name: "Salvavidas de Pekín", daily: { eco: 0.05, est: 0.02 }, money: 600 }, tense: { name: "Pekín pierde la paciencia", daily: { eco: -0.05 }, money: -450 } },
    ru: { name: "Rusia", icon: "fa-bear", ally: { name: "Eje con Moscú", daily: { eco: 0.04, mil: 0.03 }, money: 450 }, tense: { name: "Moscú se distancia", daily: { eco: -0.03 }, money: -300 } },
    kr: {
      name: "Corea del Sur",
      icon: "fa-flag",
      ally: { name: "Deshielo intercoreano", daily: { est: 0.03, eco: 0.02 }, money: 150 },
      tense: { name: "Tensión en la frontera coreana", daily: { mil: -0.02, est: -0.03 }, money: -150 }
    },
    us: {
      name: "Estados Unidos",
      icon: "fa-flag-usa",
      ally: { name: "Diálogo con Washington", daily: { est: 0.03, eco: 0.03 }, money: 300 },
      tense: { name: "Amenaza de EE. UU.", daily: { mil: -0.03, est: -0.03 }, money: -450 }
    },
    jp: { name: "Japón", icon: "fa-torii-gate", ally: { name: "Contactos con Tokio", daily: { eco: 0.02 }, money: 150 }, tense: { name: "Misiles sobre Japón", daily: { est: -0.02 }, money: -150 } },
    ir: { name: "Irán y Oriente Medio", icon: "fa-mosque", ally: { name: "Mercado de armas", daily: { eco: 0.02, mil: 0.02 }, money: 150 }, tense: { name: "Compradores reticentes", daily: { eco: -0.01 }, money: -75 } }
  },
  base: { cn: 75, ru: 85, kr: 2, us: 2, jp: 3, ir: 60 },
  links: { cn: { ru: 0.2 }, ru: { cn: 0.2 }, us: { kr: 0.3, jp: 0.3 } },
  map: { cn: [
      156
    ], ru: [
      643
    ], kr: [
      410
    ], us: [
      840
    ], jp: [
      392
    ], ir: [
      364,
      760,
      368
    ] },
  actions: {
    cn: [
      { id: "cum", title: "Visita del Líder a Pekín", cap: 8, cd: 60, fx: { cn: 10, us: -2 }, now: { eco: 1 } },
      { id: "grn", title: "Ayuda alimentaria china", cap: 4, cd: 90, fx: { cn: 6 }, now: { est: 2 }, inc: 300 }
    ],
    ru: [
      { id: "mil", title: "Cumbre y cooperación militar", cap: 6, cd: 60, fx: { ru: 10, us: -3 }, now: { mil: 2 }, inc: 300 }
    ],
    kr: [
      { id: "dia", title: "Línea directa intercoreana", cap: 8, cd: 90, fx: { kr: 8 }, now: { est: 1 } }
    ],
    us: [
      { id: "sum", title: "Cumbre con Washington", cap: 15, cd: 120, fx: { us: 10, kr: 2 }, now: { eco: 1 } }
    ],
    jp: [
      { id: "ton", title: "Contactos secretos con Tokio", cap: 6, cd: 90, fx: { jp: 8 } }
    ],
    ir: [
      { id: "arm", title: "Venta de tecnología balística", cap: 4, cd: 60, fx: { ir: 10, us: -3 }, now: { eco: 1 }, inc: 300 }
    ]
  },
  monthly: [
    { m: "mil", gt: 80, fx: { us: -0.5, kr: -0.5, ru: 0.5 }, why: "Disuasión nuclear norcoreana" },
    { m: "eco", lt: 30, fx: { cn: -0.8, ru: -0.5 }, why: "Economía norcoreana colapsada" },
    { m: "est", gt: 70, fx: { cn: 0.5 }, why: "Régimen estable" }
  ],
  pop: [
    {
      id: "cnx",
      cond: r => r.cn <= 35,
      title: "PEKÍN FRENA EL COMERCIO FRONTERIZO",
      desc: "China restringe la entrada de combustible y alimentos por presiones de la ONU.",
      options: [
        { text: "Moderar el programa nuclear", intl: { cn: 10, us: 3 }, stats: { mil: -2, eco: 2 }, news: "Pionyang cede ante Pekín y modera su programa." },
        { text: "Resistir y buscar a Rusia", intl: { cn: -6, ru: 8 }, stats: { eco: -2, mil: 2 }, news: "Pionyang busca a Moscú tras el enfado de Pekín." }
      ]
    },
    {
      id: "usd",
      cond: r => r.us >= 20,
      title: "WASHINGTON OFRECE UNA CUMBRE",
      desc: "La Casa Blanca propone una cumbre sobre desnuclearización a cambio de alivio de sanciones.",
      options: [
        { text: "Aceptar la cumbre", intl: { us: 10, kr: 3 }, stats: { eco: 3, apr: 1 }, news: "Pionyang acepta una cumbre con Washington." },
        { text: "Rechazar y mantener el programa", intl: { us: -6 }, stats: { mil: 2 }, news: "Pionyang rechaza el diálogo con Washington." }
      ]
    }
  ]
};


// ---- 9. DECRETOS Y SOCIEDAD ----
const COUNTRY_DECREES = {
  tab: "Directivas del Partido",
  title: "COMITÉ CENTRAL — DIRECTIVAS DEL PARTIDO",
  sub: "Las directivas se aplican desde su aprobación por el Comité Central.",
  pending: "DECRETOS EN TRÁMITE",
  btn: "FIRMAR",
  pub: "¡PUBLICADO! Entra en vigor",
  logPrefix: "Decreto enviado",
  list: [
    { id: "DEC_ALIVIO", title: "Alivio fiscal a las familias", cost: 75, desc: "Economía +0.3 y Aprobación +0.1 por día durante 25 días.", cooldown: 60, statsPerDay: { eco: 0.3, apr: 0.1 } },
    { id: "DEC_EMPLEO", title: "Programa nacional de empleo juvenil", cost: 100, desc: "Empleo +0.4 y Estabilidad +0.2 por día durante 25 días.", cooldown: 90, statsPerDay: { emp: 0.4, est: 0.2 } },
    { id: "DEC_PAGA", title: "Bonificación a las Fuerzas Armadas", cost: 50, desc: "Lealtad militar +0.5 por día durante 25 días.", cooldown: 45, statsPerDay: { mil: 0.5 } },
    { id: "DEC_VIVIENDA", title: "Ayuda a la vivienda", cost: 40, desc: "Estabilidad +0.3 y Aprobación +0.2 por día durante 25 días.", cooldown: 50, statsPerDay: { est: 0.3, apr: 0.2 } },
    { id: "DEC_SALUD", title: "Refuerzo de la salud pública", cost: 90, desc: "Estabilidad +0.4 y Aprobación +0.3 por día durante 25 días.", cooldown: 75, statsPerDay: { est: 0.4, apr: 0.3 } },
    { id: "DEC_POLICIA", title: "Plan de apoyo a la policía", cost: 60, desc: "Estabilidad +0.5 por día durante 25 días.", cooldown: 45, statsPerDay: { est: 0.5 } },
    { id: "DEC_INFRA", title: "Modernización de infraestructuras", cost: 150, desc: "Economía +0.6 y Empleo +0.3 por día durante 25 días.", cooldown: 100, statsPerDay: { eco: 0.6, emp: 0.3 } },
    { id: "DEC_PYMES", title: "Rescate a la pequeña empresa", cost: 80, desc: "Economía +0.4 y Empleo +0.3 por día durante 25 días.", cooldown: 70, statsPerDay: { eco: 0.4, emp: 0.3 } },
    { id: "DEC_DEFENSA", title: "Modernización de las Fuerzas Armadas", cost: 140, desc: "Lealtad militar +0.8 por día durante 25 días.", cooldown: 90, statsPerDay: { mil: 0.8 } },
    { id: "DEC_DIPLO", title: "Fondo de diplomacia pública", cost: 15, desc: "Aprobación +0.3 por día durante 25 días.", cooldown: 40, statsPerDay: { apr: 0.3 } }
  ]
};
const COUNTRY_SOCIETY = {
  intro: "En Corea del Norte pesan la escasez, el aislamiento internacional y el control político del Partido.",
  cols: [
    { id: "mil", name: "Ejército Popular y Songun", icon: "fa-shield-halved", tgt: m => m.mil * .7 + m.est * .3, hit: { mil: -0.04 }, up: { mil: 0.02 } },
    { id: "eli", name: "Élite del Partido en Pionyang", icon: "fa-landmark", tgt: m => m.apr * .5 + m.est * .5, hit: { est: -0.04 }, up: { est: 0.02 } },
    { id: "cam", name: "Campesinado y provincias", icon: "fa-wheat-awn", tgt: m => m.eco * .6 + m.est * .4, hit: { est: -0.03, eco: -0.03 }, up: { eco: 0.02 } },
    { id: "mer", name: "Comerciantes de los mercados", icon: "fa-store", tgt: m => m.eco * .7 + m.emp * .3, hit: { eco: -0.04 }, up: { eco: 0.02 } },
    { id: "jov", name: "Jóvenes del Partido", icon: "fa-graduation-cap", tgt: m => m.apr * .6 + m.emp * .4, hit: { apr: -0.04 }, up: { apr: 0.03 } }
  ],
  scandals: [
    {
      t: "Purga en el aparato del Partido",
      d: "Se detecta una red de funcionarios corruptos y se prepara una purga.",
      o: [
        { x: "Ejecutar la purga", now: { est: 1, apr: -2 }, later: [
            30,
            { est: 3 },
            "El Partido cierra filas"
          ], cap: -3 },
        { x: "Amnistía y reforma interna", now: { apr: 2, est: -1 }, later: [
            40,
            { apr: 2, est: -2 },
            "Se perciben signos de debilidad"
          ], cap: 3 }
      ]
    },
    {
      t: "Fuga de información sobre las condiciones en las provincias",
      d: "Imágenes del hambre en las provincias llegan al exterior.",
      o: [
        { x: "Negarlo y reforzar la censura", now: { apr: -1, con: -2 }, later: [
            30,
            { est: -2 },
            "Aumenta la desconfianza"
          ], cap: -2 },
        { x: "Enviar ayuda urgente", now: { apr: 2, eco: -1 }, later: [
            30,
            { apr: 3 },
            "El pueblo agradece la ayuda"
          ], cap: 3, money: 250 }
      ]
    }
  ]
};


// ---- 10. DEMOGRAFÍA ----
const COUNTRY_DEMO = {
  pop: 26,
  sh: [
    0.19,
    0.2,
    0.22,
    0.29,
    0.11
  ],
  tfr: 1.8,
  mig: -5,
  mort: 1.5,
  ss: 0.4,
  warScale: 250,
  ssName: "Sistema estatal de pensiones",
  retName: "jubilados",
  note: "Corea del Norte tiene una población joven pero con baja esperanza de vida y desnutrición; la economía estatal y el ejército absorben gran parte de la mano de obra."
};
