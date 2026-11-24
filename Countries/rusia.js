// =====================================================================
//  RUSIA — MONCLOA STRATEGY (Countries/rusia.js)
//  Generado con plantilla-pais.js; edítalo con libertad. Registro: Countries/index.json
// =====================================================================

// ---- 1. CÁMARA Y ESCENARIOS ----
const CHAMBER = { seats: 450, majority: 226 };
const SCENARIOS = {
  ACTUAL: {
    id: "ACTUAL",
    title: "RUSIA (2026)",
    desc: "Una economía de guerra, sanciones occidentales y un poder fuertemente presidencialista: el Kremlin gobierna con una Duma dominada por Rusia Unida y una oposición tolerada que rara vez rompe el guion.",
    parties: [
      {
        id: "KPRF",
        name: "Partido Comunista de la Federación Rusa",
        leader: "Guennadi Ziugánov",
        seats: 57,
        baseSeats: 57,
        minSeats: 40,
        maxSeats: 171,
        basePct: 9.0,
        color: "#dc2626",
        isRegional: false,
        ideology: "Izquierda comunista",
        spectrumOrder: 1,
        redLines: []
      },
      {
        id: "SR",
        name: "Rusia Justa – Por la Verdad",
        leader: "Serguéi Mironov",
        seats: 28,
        baseSeats: 28,
        minSeats: 0,
        maxSeats: 84,
        basePct: 4.4,
        color: "#f59e0b",
        isRegional: false,
        ideology: "Socialdemocracia patriótica",
        spectrumOrder: 2,
        redLines: []
      },
      {
        id: "NL",
        name: "Gente Nueva",
        leader: "Alexéi Nechaev",
        seats: 13,
        baseSeats: 13,
        minSeats: 0,
        maxSeats: 39,
        basePct: 2.1,
        color: "#06b6d4",
        isRegional: false,
        ideology: "Liberalismo moderado",
        spectrumOrder: 3,
        redLines: []
      },
      {
        id: "ER",
        name: "Rusia Unida",
        leader: "Vladímir Putin",
        seats: 324,
        baseSeats: 324,
        minSeats: 40,
        maxSeats: 972,
        basePct: 51.4,
        color: "#2563eb",
        isRegional: false,
        ideology: "Conservadurismo estatista",
        spectrumOrder: 4,
        redLines: []
      },
      {
        id: "LDPR",
        name: "Partido Liberal Demócrata de Rusia",
        leader: "Leonid Slutski",
        seats: 21,
        baseSeats: 21,
        minSeats: 0,
        maxSeats: 63,
        basePct: 3.3,
        color: "#1e3a8a",
        isRegional: false,
        ideology: "Nacionalismo",
        spectrumOrder: 5,
        redLines: []
      },
      {
        id: "IND",
        name: "Diputados independientes",
        leader: "Bloque independiente",
        seats: 7,
        baseSeats: 7,
        minSeats: 0,
        maxSeats: 21,
        basePct: 1.1,
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
    id: "RU_DEFICIT",
    category: "ECONOMÍA",
    title: "AGUJERO EN LAS CUENTAS PÚBLICAS",
    desc: "Hacienda advierte de que el déficit se desvía de lo previsto y los mercados piden un plan creíble de ajuste.",
    condition: m => true,
    options: [
      { text: "Recortar gasto corriente", stats: { eco: 3, apr: -3, est: -1 }, cost: 1, loyaltyImpact: { ER: 8, LDPR: 8, KPRF: -6, SR: -6 }, news: "El Kremlin anuncia un recorte del gasto para contener el déficit." },
      { text: "Subir impuestos a las rentas altas", stats: { eco: -1, apr: 2 }, cost: 1, loyaltyImpact: { KPRF: 8, SR: 8, ER: -6, LDPR: -6 }, news: "El Kremlin sube la presión fiscal a las grandes rentas." },
      { text: "Emitir más deuda y aplazar el ajuste", stats: { eco: 1, apr: 1, est: -2 }, cost: 1, loyaltyImpact: {}, news: "El Tesoro emite deuda extra y los inversores exigen más intereses." }
    ]
  },
  {
    id: "RU_HUELGA",
    category: "SOCIEDAD",
    title: "PARO EN EL TRANSPORTE Y LA INDUSTRIA",
    desc: "Los sindicatos convocan paros que amenazan con bloquear puertos, trenes y fábricas durante semanas.",
    condition: m => true,
    options: [
      { text: "Negociar una subida salarial", stats: { emp: 3, eco: -2, apr: 3 }, cost: 2150, loyaltyImpact: { KPRF: 8, SR: 8, ER: -6, LDPR: -6 }, news: "Acuerdo salarial pone fin a los paros." },
      { text: "Declarar servicios mínimos estrictos", stats: { est: 2, apr: -3, emp: -1 }, cost: 1, loyaltyImpact: { ER: 8, LDPR: 8, KPRF: -6, SR: -6 }, news: "El Gobierno impone servicios mínimos y los sindicatos protestan." }
    ]
  },
  {
    id: "RU_ENERGIA",
    category: "ECONOMÍA",
    title: "DISPARO DEL PRECIO DE LA ENERGÍA",
    desc: "La factura de la luz y el gas se dispara y hogares e industria reclaman ayudas urgentes.",
    condition: m => true,
    options: [
      { text: "Subsidiar la factura energética", stats: { apr: 4, eco: -1, est: 1 }, cost: 5500, loyaltyImpact: { KPRF: 8, SR: 8, ER: -6, LDPR: -6 }, news: "El Kremlin subvenciona la factura energética." },
      { text: "Dejar actuar al mercado y apostar por la eficiencia", stats: { eco: 1, apr: -4, est: -2 }, cost: 1, loyaltyImpact: { ER: 8, LDPR: 8, KPRF: -6, SR: -6 }, news: "El Gobierno rechaza intervenir los precios energéticos." }
    ]
  },
  {
    id: "RU_CIBER",
    category: "SEGURIDAD",
    title: "CIBERATAQUE A INFRAESTRUCTURAS CRÍTICAS",
    desc: "Un ataque informático paraliza hospitales, bancos y redes eléctricas durante horas.",
    condition: m => true,
    options: [
      { text: "Plan nacional de ciberdefensa", stats: { est: 3, mil: 2, apr: 1 }, cost: 2900, loyaltyImpact: {}, news: "Se crea un plan de ciberdefensa tras el ataque." },
      { text: "Culpar al extranjero y reforzar la vigilancia", stats: { est: 1, apr: -2, mil: 1 }, cost: 700, loyaltyImpact: { ER: 6, LDPR: 6, KPRF: -5, SR: -5 }, news: "El Gobierno atribuye el ataque a un actor extranjero." }
    ]
  },
  {
    id: "RU_PENSIONES",
    category: "SOCIEDAD",
    title: "PRESIÓN SOBRE LAS PENSIONES",
    desc: "El envejecimiento tensiona el sistema de pensiones y los expertos piden reformarlo.",
    condition: m => true,
    options: [
      { text: "Retrasar gradualmente la edad de jubilación", stats: { eco: 3, apr: -5, est: -1 }, cost: 1, loyaltyImpact: { ER: 8, LDPR: 8, KPRF: -6, SR: -6 }, news: "Se aprueba retrasar la edad de jubilación." },
      { text: "Blindar las pensiones con más cotizaciones", stats: { apr: 3, eco: -2 }, cost: 3600, loyaltyImpact: { KPRF: 8, SR: 8, ER: -6, LDPR: -6 }, news: "Se blindan las pensiones con un aumento de las cotizaciones." }
    ]
  },
  {
    id: "RU_SEQUIA",
    category: "SOCIEDAD",
    title: "SEQUÍA Y OLA DE CALOR",
    desc: "Una sequía prolongada daña el campo, los embalses y el abastecimiento de varias regiones.",
    condition: m => true,
    options: [
      { text: "Declarar emergencia y ayudar al campo", stats: { apr: 3, est: 2, eco: -1 }, cost: 4300, loyaltyImpact: {}, news: "Se declara emergencia por sequía y se aprueban ayudas." },
      { text: "Pedir ahorro voluntario", stats: { apr: -3, est: -2 }, cost: 1, loyaltyImpact: {}, news: "El Gobierno apela al ahorro voluntario de agua." }
    ]
  },
  {
    id: "RU_SANCIONES",
    category: "ECONOMÍA",
    title: "NUEVO PAQUETE DE SANCIONES OCCIDENTALES",
    desc: "Bruselas y Washington endurecen las sanciones: banca, petróleo y tecnología duales quedan aún más limitados.",
    condition: m => true,
    options: [
      { text: "Reorientar el comercio hacia Asia", stats: { eco: 2, apr: 1, mil: 1 }, cost: 3000, loyaltyImpact: { ER: 5, LDPR: 5 }, news: "Moscú acelera su reorientación comercial hacia Asia." },
      { text: "Sustitución de importaciones a toda costa", stats: { eco: 1, emp: 2, apr: -1 }, cost: 6000, loyaltyImpact: { ER: 6, KPRF: 6, NL: -6 }, news: "El Kremlin lanza un plan masivo de sustitución de importaciones." }
    ]
  },
  {
    id: "RU_MOVILIZACION",
    category: "SEGURIDAD",
    title: "NECESIDAD DE NUEVOS REEMPLAZOS PARA EL FRENTE",
    desc: "El Estado Mayor pide más reclutas y reservistas para sostener las operaciones militares.",
    condition: m => true,
    options: [
      { text: "Reclutamiento voluntario con altas primas", stats: { mil: 4, eco: -1, apr: 1 }, cost: 6000, loyaltyImpact: { ER: 5, LDPR: 5 }, news: "El Kremlin refuerza el reclutamiento con primas y contratos." },
      { text: "Nueva movilización parcial", stats: { mil: 5, apr: -6, est: -3 }, cost: 1800, loyaltyImpact: { LDPR: 5, SR: -6, NL: -6 }, news: "Rusia anuncia una nueva movilización parcial." }
    ]
  },
  {
    id: "RU_PETROLEO",
    category: "ECONOMÍA",
    title: "EL TECHO DE PRECIO AL PETRÓLEO RUSO",
    desc: "Los ingresos de los hidrocarburos caen por el tope de precio y los descuentos a los compradores asiáticos.",
    condition: m => true,
    options: [
      { text: "Ampliar la flota en la sombra y los pagos en monedas locales", stats: { eco: 3, est: 1 }, cost: 1800, loyaltyImpact: {}, news: "Rusia amplía su flota en la sombra para eludir el tope." },
      { text: "Recortar la producción para sostener precios", stats: { eco: -1, apr: -1 }, cost: 0, loyaltyImpact: {}, news: "Moscú recorta la producción de crudo." }
    ]
  },
  {
    id: "RU_REGIONES",
    category: "POLÍTICA",
    title: "TENSIONES EN LAS REGIONES POR LOS RECORTES",
    desc: "Gobernadores de regiones pobres reclaman fondos federales mientras el gasto militar absorbe el presupuesto.",
    condition: m => true,
    options: [
      { text: "Transferencias a las regiones leales", stats: { est: 3, apr: 2, eco: -1 }, cost: 3600, loyaltyImpact: { ER: 4 }, news: "Moscú transfiere fondos a las regiones leales." },
      { text: "Sustituir gobernadores críticos", stats: { est: 2, apr: -2, con: -3 }, cost: 0, loyaltyImpact: { ER: 4, KPRF: -6, SR: -6 }, news: "El Kremlin sustituye a varios gobernadores." }
    ]
  },
  {
    id: "RU_DRONES",
    category: "SEGURIDAD",
    title: "ATAQUES DE DRONES CONTRA REFINERÍAS Y AEROPUERTOS",
    desc: "Drones golpean refinerías, depósitos y aeropuertos en el interior del país.",
    condition: m => true,
    options: [
      { text: "Reforzar la defensa antiaérea nacional", stats: { est: 3, mil: 2, eco: -1 }, cost: 5400, loyaltyImpact: {}, news: "Rusia refuerza su defensa antiaérea interior." },
      { text: "Represalias contundentes", stats: { mil: 3, apr: 2, est: -2 }, cost: 3000, loyaltyImpact: { LDPR: 5, ER: 5, NL: -5 }, news: "Moscú responde con ataques de represalia." }
    ]
  }
];
const CAMPAIGN_HEADLINES = [
  {
    id: 1,
    newspaper: "KOMMERSANT",
    headline: "LA ECONOMÍA, EL TEMA DE LA CAMPAÑA",
    desc: "Los precios y el empleo dominan el debate. ¿Cómo respondes?",
    options: [
      { text: "Presentar un plan económico detallado", score: 9, textResult: "El plan transmite solvencia y refuerza tu campaña." },
      { text: "Atacar a los rivales sin propuestas", score: -4, textResult: "Suena a excusa y los rivales lo explotan." }
    ]
  },
  {
    id: 2,
    newspaper: "KOMMERSANT",
    headline: "DEBATE ELECTORAL CARA A CARA",
    desc: "Los líderes se miden en el gran debate televisado.",
    options: [
      { text: "Mostrar serenidad y datos", score: 7, textResult: "Se te ve presidencial y ganas el debate." },
      { text: "Subir el tono y atacar", score: -5, textResult: "La agresividad se vuelve en tu contra." }
    ]
  },
  {
    id: 3,
    newspaper: "RIA NOVOSTI",
    headline: "ELECCIONES A LA DUMA EN UN PAÍS EN GUERRA",
    desc: "La campaña gira en torno a la seguridad, los precios y la estabilidad.",
    options: [
      { text: "Presentarte como garante de estabilidad", score: 8, textResult: "El mensaje de continuidad calma al electorado." },
      { text: "Prometer cambios drásticos", score: -4, textResult: "La promesa genera inquietud." }
    ]
  }
];


// ---- 3. PRENSA, MINISTERIOS Y CRISIS ----
const PRESS_NEWS_BANK = [
  {
    id: "RU_N1",
    newspaper: "KOMMERSANT",
    headline: "LAS AGENCIAS DE CALIFICACIÓN REVISAN LA NOTA",
    desc: "Los analistas evalúan la solvencia del país tras los últimos datos.",
    options: [
      { text: "Presumir de reformas", stats: { eco: 2, apr: 1 }, cost: 0, news: "El Gobierno defiende sus reformas ante los analistas." },
      { text: "Restar importancia", stats: { eco: -1, apr: -1 }, news: "El Gobierno resta importancia a la revisión." }
    ]
  },
  {
    id: "RU_N2",
    newspaper: "KOMMERSANT",
    headline: "NUEVA ENCUESTA DE INTENCIÓN DE VOTO",
    desc: "El sondeo muestra un electorado dividido y volátil.",
    options: [
      { text: "Hacer campaña permanente", stats: { apr: 2, est: -1 }, cost: 0, news: "El Gobierno se vuelca en la calle." },
      { text: "Ignorar los sondeos", stats: { apr: -1, est: 1 }, news: "El Gobierno dice gobernar sin mirar las encuestas." }
    ]
  },
  {
    id: "RU_N3",
    newspaper: "KOMMERSANT",
    headline: "EL PAÍS CELEBRA UN ÉXITO DEPORTIVO",
    desc: "Un triunfo internacional llena las calles de alegría.",
    options: [
      { text: "Recibir a los campeones", stats: { apr: 3, est: 1 }, cost: 0, news: "El Gobierno recibe a los campeones en un acto multitudinario." },
      { text: "Mantener la agenda", stats: { apr: -1 }, news: "El Gobierno se desmarca de las celebraciones." }
    ]
  },
  {
    id: "RU_N4",
    newspaper: "KOMMERSANT",
    headline: "LA PRODUCCIÓN INDUSTRIAL SORPRENDE",
    desc: "Los datos de industria superan o decepcionan a los analistas.",
    options: [
      { text: "Anunciar un plan industrial", stats: { eco: 3, emp: 2 }, cost: 0, news: "El Gobierno lanza un plan de impulso industrial." },
      { text: "Esperar a más datos", stats: { eco: 0, apr: -1 }, news: "El Gobierno pide prudencia con los datos." }
    ]
  },
  {
    id: "RU_N5",
    newspaper: "KOMMERSANT",
    headline: "UN INFORME CRITICA LA GESTIÓN PÚBLICA",
    desc: "Un organismo independiente señala ineficiencias en la administración.",
    options: [
      { text: "Aceptar las críticas y reformar", stats: { apr: 2, eco: 1 }, cost: 0, news: "El Gobierno anuncia una reforma administrativa." },
      { text: "Desacreditar el informe", stats: { apr: -2, est: -1 }, news: "El Gobierno cuestiona el informe." }
    ]
  },
  {
    id: "RU_N6",
    newspaper: "KOMMERSANT",
    headline: "GRAN FERIA DE INVERSIÓN INTERNACIONAL",
    desc: "Inversores extranjeros evalúan nuevos proyectos en el país.",
    options: [
      { text: "Ofrecer incentivos fiscales", stats: { eco: 3, emp: 1 }, cost: 0, news: "El Gobierno ofrece incentivos para atraer inversión." },
      { text: "Mantener las condiciones", stats: { eco: 1 }, news: "El Gobierno mantiene el marco actual." }
    ]
  },
  {
    id: "RU_N7",
    newspaper: "VEDOMOSTI",
    headline: "EL BANCO CENTRAL MANTIENE EL TIPO CLAVE MUY ALTO",
    desc: "La inflación sigue elevada y el crédito se encarece para empresas y familias.",
    options: [
      { text: "Pedir ayudas para la industria", stats: { eco: 2, apr: 1 }, cost: 0, news: "El Gobierno anuncia ayudas para empresas afectadas por los tipos." },
      { text: "Respaldar al banco central", stats: { eco: -1, est: 1 }, news: "El Kremlin respalda la política monetaria del banco central." }
    ]
  }
];
const MINISTRY_DECISIONS_BANK = {
  sanidad: [
    { title: "Reforzar hospitales y atención primaria", cost: 5500, stats: { apr: 4, est: 2 } },
    { title: "Plan de salud pública y prevención", cost: 3600, stats: { apr: 3, est: 1 } }
  ],
  educacion: [
    { title: "Plan de becas y refuerzo escolar", cost: 4200, stats: { apr: 3, emp: 1 } },
    { title: "Formación profesional y empleo joven", cost: 4800, stats: { emp: 3, eco: 1 } }
  ],
  infraestructuras: [
    { title: "Modernizar carreteras y ferrocarril", cost: 8500, stats: { eco: 2, emp: 2 } },
    { title: "Conectar regiones aisladas", cost: 5500, stats: { est: 2, apr: 2 } }
  ],
  interior: [
    { title: "Reforzar la seguridad ciudadana", cost: 3000, stats: { est: 3, apr: 1 } },
    { title: "Modernizar fronteras y control migratorio", cost: 3600, stats: { est: 2 } }
  ],
  defensa: [
    { title: "Modernizar equipos y flota", cost: 7750, stats: { mil: 4, eco: -1 } },
    { title: "Mejorar la paga y la formación de las tropas", cost: 3350, stats: { mil: 3 } },
    { title: "Contratos de producción de municiones y drones", cost: 10750, stats: { mil: 5, eco: 1, apr: -1 } }
  ],
  economia: [
    { title: "Auditoría y racionalización del gasto", cost: 1, stats: { eco: 1, apr: -1 } },
    { title: "Incentivos a la inversión empresarial", cost: 3600, stats: { eco: 3, emp: 1 } },
    { title: "Fondo de bienestar nacional: usar reservas", cost: 7250, stats: { eco: 2, est: 2 } }
  ],
  vivienda: [
    { title: "Plan de vivienda asequible", cost: 4800, stats: { apr: 3, est: 2 } },
    { title: "Facilitar suelo para construir", cost: 1800, stats: { eco: 1, apr: 2 } }
  ],
  territorio: [
    { title: "Plan de desarrollo regional", cost: 4200, stats: { est: 2, apr: 2 } },
    { title: "Ayudas a las zonas rurales", cost: 3600, stats: { emp: 2, apr: 1 } }
  ],
  trabajo: [
    { title: "Programa de empleo y formación", cost: 3850, stats: { emp: 3 } },
    { title: "Mejorar la protección de los trabajadores", cost: 3000, stats: { apr: 3, eco: -1 } }
  ],
  justicia: [
    { title: "Agilizar los tribunales", cost: 2150, stats: { est: 2, apr: 1 } },
    { title: "Reforzar la lucha anticorrupción", cost: 1800, stats: { apr: 3, est: 1 } }
  ],
  exteriores: [
    { title: "Ofensiva diplomática en organismos internacionales", cost: 1100, stats: { apr: 1, mil: 1 } },
    { title: "Promover exportaciones y comercio", cost: 1800, stats: { eco: 2 } }
  ],
  transicion_ecologica: [
    { title: "Apoyar energías renovables", cost: 5500, stats: { eco: 2, apr: 1 } },
    { title: "Plan de eficiencia energética", cost: 3350, stats: { eco: 1, est: 1 } }
  ],
  cultura: [
    { title: "Apoyo a la cultura y el patrimonio", cost: 1450, stats: { apr: 2 } },
    { title: "Promoción del deporte", cost: 1700, stats: { apr: 2, est: 1 } }
  ],
  igualdad: [
    { title: "Plan de conciliación familiar", cost: 3000, stats: { apr: 3, est: 1 } },
    { title: "Servicios sociales de proximidad", cost: 2650, stats: { apr: 2, est: 1 } }
  ]
};
const HOUSING_EVENTS = [
  {
    id: "RU_HOUS",
    category: "VIVIENDA & PROTESTAS",
    title: "LA HIPOTECA SE DISPARA CON LOS TIPOS ALTOS",
    desc: "Familias jóvenes no pueden acceder a la vivienda por el coste del crédito.",
    options: [
      { text: "Hipoteca familiar subvencionada", stats: { apr: 6, est: 3, eco: -1 }, cost: 6000, loyaltyImpact: { ER: 6, SR: 6 }, news: "El Kremlin amplía la hipoteca familiar subvencionada." },
      { text: "No intervenir", stats: { apr: -3, eco: 1 }, cost: 0, loyaltyImpact: { NL: 5, KPRF: -5 }, news: "El Gobierno rechaza subsidiar las hipotecas." }
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
      { text: "Desplegar todos los medios y el ejército", cost: 2900, stats: { est: 3, apr: 2 }, news: "El Gobierno despliega todos los medios contra los incendios." },
      { text: "Dejar la gestión a las autoridades locales", cost: 0, stats: { est: -4, apr: -5 }, news: "Críticas por la lenta respuesta a los incendios." }
    ]
  },
  {
    cat: "ECONOMÍA",
    min: "economia",
    title: "QUIEBRA DE UN GRAN BANCO REGIONAL",
    desc: "Un banco de tamaño medio se declara insolvente y el pánico amenaza con contagiarse.",
    options: [
      { text: "Rescate público con garantías", cost: 7250, stats: { eco: 3, apr: -3 }, news: "El Estado rescata al banco para evitar el contagio." },
      { text: "Dejar quebrar y proteger a los depositantes", cost: 2400, stats: { eco: -3, apr: 1 }, news: "El banco quiebra y se protege solo a los pequeños ahorradores." }
    ]
  },
  {
    cat: "SANIDAD",
    min: "sanidad",
    title: "BROTE EPIDÉMICO",
    desc: "Un brote de gripe grave satura los hospitales en pleno invierno.",
    options: [
      { text: "Plan de contingencia y refuerzo sanitario", cost: 3600, stats: { est: 3, apr: 2 }, news: "Plan de contingencia sanitaria contra el brote." },
      { text: "Medidas mínimas", cost: 0, stats: { est: -3, apr: -4 }, news: "Los hospitales se saturan ante el brote." }
    ]
  },
  {
    cat: "EMERGENCIAS",
    min: "interior",
    title: "INCENDIOS EN LA TAIGA Y DESHIELO DEL PERMAFROST",
    desc: "Miles de hectáreas arden en Siberia y el deshielo daña infraestructuras del norte.",
    options: [
      { text: "Movilizar al Ministerio de Emergencias", cost: 3600, stats: { est: 3, apr: 2 }, news: "El Ministerio de Emergencias combate los incendios de la taiga." },
      { text: "Dejar la gestión a las regiones", cost: 0, stats: { est: -3, apr: -4 }, news: "Críticas por la lenta respuesta a los incendios." }
    ]
  }
];


// ---- 4. MINISTROS ----
const REAL_MINISTERS = [
  {
    id: "siluánov_er",
    name: "Anton Siluánov",
    party: "ER",
    portfolio: "economia",
    desc: "+1.5% Economía, +0.5% Estabilidad",
    pros: "+1.5% Economía, +0.5% Estabilidad",
    cons: "-1.0% Aprobación",
    effects: { eco: 1.5, est: 0.5, apr: -1 }
  },
  {
    id: "reshetnikov_er",
    name: "Maksim Reshetnikov",
    party: "ER",
    portfolio: "economia",
    desc: "+1.0% Economía, +0.5% Aprobación",
    pros: "+1.0% Economía, +0.5% Aprobación",
    cons: "Ninguno",
    effects: { eco: 1, apr: 0.5 }
  },
  {
    id: "kolokoltsev_er",
    name: "Vladímir Kolokoltsev",
    party: "ER",
    portfolio: "interior",
    desc: "+1.5% Estabilidad",
    pros: "+1.5% Estabilidad",
    cons: "-0.5% Aprobación",
    effects: { est: 1.5, apr: -0.5 }
  },
  {
    id: "belousov_er",
    name: "Andréi Belousov",
    party: "ER",
    portfolio: "defensa",
    desc: "+2.0% Lealtad militar, +0.5% Economía",
    pros: "+2.0% Lealtad militar, +0.5% Economía",
    cons: "-0.5% Aprobación",
    effects: { mil: 2, eco: 0.5, apr: -0.5 }
  },
  {
    id: "shoigú_er",
    name: "Serguéi Shoigú",
    party: "ER",
    portfolio: "defensa",
    desc: "+1.5% Lealtad militar",
    pros: "+1.5% Lealtad militar",
    cons: "-1.0% Aprobación",
    effects: { mil: 1.5, apr: -1 }
  },
  {
    id: "lavrov_er",
    name: "Serguéi Lavrov",
    party: "ER",
    portfolio: "exteriores",
    desc: "+1.0% Aprobación, +1.0% Lealtad militar",
    pros: "+1.0% Aprobación, +1.0% Lealtad militar",
    cons: "Ninguno",
    effects: { apr: 1, mil: 1 }
  },
  {
    id: "murashko_er",
    name: "Mijaíl Murashko",
    party: "ER",
    portfolio: "sanidad",
    desc: "+1.0% Estabilidad, +0.5% Aprobación",
    pros: "+1.0% Estabilidad, +0.5% Aprobación",
    cons: "Ninguno",
    effects: { est: 1, apr: 0.5 }
  },
  {
    id: "kravtsov_er",
    name: "Serguéi Kravtsov",
    party: "ER",
    portfolio: "educacion",
    desc: "+1.0% Aprobación, +0.5% Empleo",
    pros: "+1.0% Aprobación, +0.5% Empleo",
    cons: "Ninguno",
    effects: { apr: 1, emp: 0.5 }
  },
  {
    id: "kotiakov_er",
    name: "Anton Kotiakov",
    party: "ER",
    portfolio: "trabajo",
    desc: "+1.5% Empleo, +0.5% Aprobación",
    pros: "+1.5% Empleo, +0.5% Aprobación",
    cons: "Ninguno",
    effects: { emp: 1.5, apr: 0.5 }
  },
  {
    id: "chuichenko_er",
    name: "Konstantín Chuichenko",
    party: "ER",
    portfolio: "justicia",
    desc: "+1.5% Estabilidad",
    pros: "+1.5% Estabilidad",
    cons: "-1.0% Aprobación",
    effects: { est: 1.5, apr: -1 }
  },
  {
    id: "nikitin_er",
    name: "Andréi Nikitin",
    party: "ER",
    portfolio: "infraestructuras",
    desc: "+1.0% Economía, +1.0% Empleo",
    pros: "+1.0% Economía, +1.0% Empleo",
    cons: "Ninguno",
    effects: { eco: 1, emp: 1 }
  },
  {
    id: "tsivilev_er",
    name: "Serguéi Tsivilev",
    party: "ER",
    portfolio: "transicion_ecologica",
    desc: "+1.5% Economía, +0.5% Estabilidad",
    pros: "+1.5% Economía, +0.5% Estabilidad",
    cons: "Ninguno",
    effects: { eco: 1.5, est: 0.5 }
  },
  {
    id: "liubímova_er",
    name: "Olga Liubímova",
    party: "ER",
    portfolio: "cultura",
    desc: "+1.5% Aprobación",
    pros: "+1.5% Aprobación",
    cons: "Ninguno",
    effects: { apr: 1.5 }
  },
  {
    id: "lut_er",
    name: "Oksana Lut",
    party: "ER",
    portfolio: "territorio",
    desc: "+1.0% Empleo, +0.5% Estabilidad",
    pros: "+1.0% Empleo, +0.5% Estabilidad",
    cons: "Ninguno",
    effects: { emp: 1, est: 0.5 }
  }
];


// ---- 5. MISIONES, ACCIONES, FOCOS, PROYECTOS Y LOGROS ----
const GOAL_POOL = [
  { id: "eco", icon: "fa-chart-line", title: "Milagro Económico", desc: "Mantén la Economía ≥ 70%", check: s => s.metrics.eco >= 70 },
  { id: "est", icon: "fa-shield-halved", title: "Unidad Nacional", desc: "Mantén la Estabilidad ≥ 65%", check: s => s.metrics.est >= 65 },
  { id: "emp", icon: "fa-people-roof", title: "Pleno Empleo", desc: "Mantén el Empleo ≥ 70%", check: s => s.metrics.emp >= 70 },
  { id: "apr", icon: "fa-thumbs-up", title: "Líder Querido", desc: "Mantén la Aprobación ≥ 60%", check: s => s.metrics.apr >= 60 },
  { id: "mil", icon: "fa-shield", title: "Fuerzas Armadas Leales", desc: "Mantén la lealtad militar ≥ 70%", check: s => s.metrics.mil >= 70 },
  { id: "caja", icon: "fa-vault", title: "Caja Saneada", desc: "Acumula una tesorería ≥ 120000 M", check: s => (Number(s.treasury) || 0) >= 120000 },
  { id: "frente", icon: "fa-shield", title: "Retaguardia Firme", desc: "Mantén la lealtad militar ≥ 75%", check: s => s.metrics.mil >= 75 },
  { id: "unidad", icon: "fa-people-group", title: "Consenso Patriótico", desc: "Mantén el Consenso ≥ 60%", check: s => s.metrics.con >= 60 }
];
const GOAL_ACTIONS = [
  {
    id: "tv",
    icon: "fa-tv",
    title: "Mensaje televisado a la nación",
    cap: 15,
    cost: 0,
    cd: 30,
    fx: { apr: 6, est: 2 },
    news: "El presidente se dirige a la nación y consolida su respaldo."
  },
  {
    id: "gira",
    icon: "fa-bus",
    title: "Gira por las regiones",
    cap: 10,
    cost: 700,
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
    id: "lineadirecta",
    icon: "fa-phone",
    title: "«Línea directa» con la ciudadanía",
    cap: 10,
    cost: 0,
    cd: 60,
    fx: { apr: 5, est: 2 },
    news: "El presidente responde preguntas de ciudadanos en directo."
  }
];
const FOCUS_TREE = [
  { id: "e1", b: "eco", title: "Sustitución de importaciones", days: 300, now: { eco: 3 }, spirit: { name: "Fortaleza Económica", daily: { eco: 0.02 }, money: 1100 } },
  { id: "e2", b: "eco", title: "Soberanía tecnológica e industrial", days: 360, req: "e1", now: { eco: 4 }, spirit: { name: "Industria Soberana", daily: { eco: 0.03 }, money: 2150 } },
  { id: "e3", b: "eco", title: "Reorientación energética hacia Asia", days: 420, req: "e2", now: { eco: 5 }, spirit: { name: "Gasoducto de Siberia", daily: { eco: 0.04 }, money: 3250 } },
  { id: "s1", b: "soc", title: "Plan demográfico y de natalidad", days: 300, now: { apr: 3 }, spirit: { name: "Natalidad Nacional", daily: { apr: 0.02 }, money: 1 } },
  { id: "s2", b: "soc", title: "Programa de vivienda familiar", days: 360, req: "s1", now: { apr: 4 }, spirit: { name: "Hogar Familiar", daily: { apr: 0.03 }, money: 1 } },
  { id: "s3", b: "soc", title: "Pensiones y ayudas a veteranos", days: 420, req: "s2", now: { apr: 5 }, spirit: { name: "Orgullo de los Veteranos", daily: { apr: 0.04 }, money: 1 } },
  { id: "g1", b: "seg", title: "Complejo militar-industrial", days: 300, now: { est: 3 }, spirit: { name: "Escudo Militar", daily: { est: 0.02 }, money: 1 } },
  { id: "g2", b: "seg", title: "Defensa aérea y ciberdefensa", days: 360, req: "g1", now: { est: 4 }, spirit: { name: "Cielo Protegido", daily: { est: 0.03 }, money: 1 } },
  { id: "g3", b: "seg", title: "Control de las regiones", days: 420, req: "g2", now: { est: 5 }, spirit: { name: "Vertical del Poder", daily: { est: 0.04 }, money: 1 } },
  { id: "d1", b: "dip", title: "Giro hacia el Sur Global", days: 300, now: { mil: 3 }, spirit: { name: "Mundo Multipolar", daily: { mil: 0.02 }, money: 1 } },
  { id: "d2", b: "dip", title: "Corredor de transporte Norte-Sur", days: 360, req: "d1", now: { mil: 4 }, spirit: { name: "Corredor Norte-Sur", daily: { mil: 0.03 }, money: 1 } },
  { id: "d3", b: "dip", title: "Arquitectura de seguridad euroasiática", days: 420, req: "d2", now: { mil: 5 }, spirit: { name: "Bloque Euroasiático", daily: { mil: 0.04 }, money: 1 } }
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
    id: "transib",
    icon: "fa-train",
    title: "Modernización del Transiberiano y la ruta Norte-Sur",
    spirit: { name: "Ruta Euroasiática", daily: { eco: 0.04, emp: 0.02 }, money: 1100 },
    phases: [
      { n: "Estudios y permisos", cost: 6000, days: 40, now: {}, run: {} },
      { n: "Obras y construcción", cost: 45500, days: 150, now: { emp: 2, eco: 1 }, run: { emp: 0.02, eco: 0.01 } },
      { n: "Puesta en servicio", cost: 16750, days: 60, now: { eco: 2 }, run: {} }
    ]
  },
  {
    id: "arctic",
    icon: "fa-snowflake",
    title: "Ruta Marítima del Norte y puertos árticos",
    spirit: { name: "Potencia Ártica", daily: { eco: 0.04, emp: 0.02 }, money: 1100 },
    phases: [
      { n: "Estudios y permisos", cost: 5500, days: 40, now: {}, run: {} },
      { n: "Obras y construcción", cost: 39500, days: 150, now: { emp: 2, eco: 1 }, run: { emp: 0.02, eco: 0.01 } },
      { n: "Puesta en servicio", cost: 14500, days: 60, now: { eco: 2 }, run: {} }
    ]
  },
  {
    id: "siberia",
    icon: "fa-oil-well",
    title: "Gasoducto Fuerza de Siberia 2",
    spirit: { name: "Gas hacia Asia", daily: { eco: 0.04, emp: 0.02 }, money: 1100 },
    phases: [
      { n: "Estudios y permisos", cost: 7250, days: 40, now: {}, run: {} },
      { n: "Obras y construcción", cost: 54000, days: 150, now: { emp: 2, eco: 1 }, run: { emp: 0.02, eco: 0.01 } },
      { n: "Puesta en servicio", cost: 19250, days: 60, now: { eco: 2 }, run: {} }
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
  { id: "tecnico", name: "Elvira Nabiullina", tag: "Tecnócrata ortodoxa", cred: 10, desc: "Prioriza la estabilidad de precios. Los mercados le respetan." },
  { id: "afin", name: "Serguéi Glázyev", tag: "Heterodoxo soberanista", cred: -10, desc: "Más dispuesto a facilitar crédito; los inversores recelan." }
];
const BDE_ACTIONS = [
  {
    id: "informe",
    icon: "fa-file-lines",
    label: "Encargar un informe de solvencia",
    desc: "Calma a los mercados.",
    cost: 180,
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
  regime: { noEarly: true, msg: 'El Kremlin neutraliza la crisis con purgas y control de la Duma.', bounds: { ER: { minSeats: 300, maxSeats: 345 }, KPRF: { minSeats: 50, maxSeats: 65 }, LDPR: { minSeats: 15, maxSeats: 30 }, SR: { minSeats: 20, maxSeats: 35 }, NL: { minSeats: 8, maxSeats: 20 }, IND: { minSeats: 2, maxSeats: 10 } } },
  currency: "₽",
  terms: {
    leader: "Presidente de la Federación de Rusia",
    gov: "El Kremlin",
    place: "el Kremlin",
    cabinet: "Gobierno de la Federación",
    bank: "Banco de Rusia",
    nation: "Rusia",
    adj: "ruso",
    firms: "rusas",
    capital: "Moscú",
    curName: "Rublo",
    sovereign: true,
    pollster: "VCIOM",
    pollsterLong: "VCIOM (Centro Panruso de Estudio de la Opinión Pública)"
  },
  hideMin: [
    "igualdad"
  ],
  k: 1.2,
  budget: 300000,
  budgetStep: 2500,
  pib: 2000000,
  debt: 330000,
  macroPib: 2000000,
  revPct: 0.38,
  pensPct: 0.12,
  otherPct: 0.12,
  baseRate: 12,
  debtMax: 400000,
  cashCap: 120000,
  preset: { sanidad: 40000, educacion: 22000, defensa: 95000, vivienda: 10000, infraestructuras: 22000, deuda: 15000 },
  hint: "Presupuesto ruso a escala de juego: el gasto militar y de seguridad es la mayor partida; la sanidad y la educación son secundarias.",
  labels: { sanidad: "Salud pública", educacion: "Educación y ciencia", defensa: "Defensa y seguridad nacional", vivienda: "Vivienda y servicios comunales", infraestructuras: "Transporte y energía", deuda: "Servicio de la deuda" },
  pct: { sanidad: 10, educacion: 5, infraestructuras: 7, interior: 10, defensa: 32, economia: 10, vivienda: 3 },
  names: {
    economia: "Ministerio de Finanzas",
    interior: "Ministerio del Interior",
    defensa: "Ministerio de Defensa",
    vivienda: "Ministerio de Construcción",
    territorio: "Ministerio de Agricultura",
    sanidad: "Ministerio de Sanidad",
    educacion: "Ministerio de Educación",
    trabajo: "Ministerio de Trabajo",
    justicia: "Ministerio de Justicia",
    exteriores: "Ministerio de Asuntos Exteriores",
    transicion_ecologica: "Ministerio de Energía",
    cultura: "Ministerio de Cultura",
    infraestructuras: "Ministerio de Transportes"
  },
  descs: { defensa: "Fuerzas Armadas, complejo militar-industrial y seguridad nacional.", economia: "Finanzas, reservas y política económica." },
  war: {
    id: 643,
    name: "Rusia",
    lat: 61,
    lon: 100,
    allied: "BRICS",
    own: { t: 82, m: 54, a: 70 }, gens: [{"id": "tg", "n": "Gral. de Ejército Vladímir Aleksándrovich Zhdánov", "t": "Comandante en jefe de las Fuerzas Terrestres", "d": "Estratega de maniobra terrestre; doctrina clásica y disciplina de hierro.", "fx": {"t": 6}, "pow": 1.05, "sup": 0, "mil": 3, "tag": "+6 Tierra · +5 % poder · +3 Estab. Militar"}, {"id": "mg", "n": "Almirante Yevgueni Pávlovich Sorokin", "t": "Comandante en jefe de la Armada", "d": "Domina el Báltico, el mar Negro y la Flota del Norte.", "fx": {"m": 8}, "pow": 1.02, "sup": 0.05, "mil": 2, "tag": "+8 Armada · +2 % poder · −5 % consumo de suministros"}, {"id": "ag", "n": "Gral. Larisa Nikoláyevna Bogdánova", "t": "Comandante de las Fuerzas Aeroespaciales", "d": "Superioridad aérea y guerra tecnológica.", "fx": {"a": 8}, "pow": 1.03, "sup": 0, "mil": 2, "tag": "+8 Aire · +3 % poder"}, {"id": "lg", "n": "Gral. Anatoli Ígorievich Kozlov", "t": "Jefe de Logística de las Fuerzas Armadas", "d": "Gana guerras de desgaste: las tropas aguantan más sin suministros.", "fx": {"t": 2, "m": 2, "a": 2}, "pow": 1, "sup": 0.25, "mil": 2, "tag": "+2 a cada ejército · −25 % consumo de suministros"}, {"id": "pg", "n": "Gral. Dmitri Serguéyevich Lébedev", "t": "Jefe del Estado Mayor afín al Kremlin", "d": "Leal al poder civil. Menos brillante en combate, pero calma los cuarteles.", "fx": {}, "pow": 0.97, "sup": 0.05, "mil": 10, "tag": "+10 Estab. Militar · −3 % poder"}],
    add: [
      [
        724,
        "España",
        48,
        "UE·OTAN",
        1,
        15,
        0,
        40,
        -4
      ]
    ],
    drop: [],
    rel: {
      "724": 12,
      "840": 6,
      "826": 5,
      "250": 6,
      "276": 5,
      "380": 12,
      "156": 82,
      "356": 70,
      "408": 80,
      "364": 72,
      "112": 90,
      "398": 60,
      "792": 40,
      "804": 2,
      "616": 4,
      "392": 20,
      "410": 10,
      "376": 25,
      "682": 45,
      "784": 55
    }
  }
};
const COUNTRY_MAP = {
  title: "Mapa de los distritos federales de Rusia",
  paths: [
    { id: "CEN", name: "Distrito Central", d: "M 32.1,235.8 L 32.1,219.3 L 20.0,213.8 L 20.0,210.7 L 69.9,198.0 L 69.9,241.9 L 49.3,247.2 L 41.2,241.3 Z", spectrumPref: 4.6, regionalist: false, desc: "Moscú y centro · Capital, finanzas y poder político" },
    { id: "NOR", name: "Distrito Noroeste", d: "M 69.9,198.0 L 20.0,210.7 L 20.0,197.2 L 26.1,142.2 L 68.4,153.2 L 92.9,150.4 L 90.6,170.0 Z", spectrumPref: 4.0, regionalist: false, desc: "San Petersburgo, Carelia y Múrmansk · Flota del Norte y puertos" },
    { id: "SUR", name: "Distrito Sur", d: "M 50.3,268.8 L 56.3,252.3 L 49.3,247.2 L 69.9,241.9 L 84.1,250.2 L 78.0,272.4 L 55.2,286.8 Z", spectrumPref: 5.0, regionalist: false, desc: "Rostov, Crimea y Krasnodar · Frente sur y mar Negro" },
    { id: "CAU", name: "Cáucaso Norte", d: "M 80.5,296.3 L 56.3,290.8 L 55.2,286.8 L 99.3,259.0 L 99.3,259.0 L 78.0,272.4 L 77.5,274.3 Z", spectrumPref: 5.6, regionalist: true, desc: "Chechenia, Daguestán y vecinas · Fuerte lealtad a sus líderes" },
    { id: "VOL", name: "Distrito del Volga", d: "M 86.6,241.3 L 84.1,250.2 L 69.9,241.9 L 69.9,198.0 L 90.6,170.0 L 126.7,236.0 L 119.9,241.3 Z", spectrumPref: 4.8, regionalist: true, desc: "Tatarstán, Bashkortostán y el Volga · Industria y petróleo" },
    { id: "URA", name: "Distrito de los Urales", d: "M 141.1,224.8 L 126.7,236.0 L 90.6,170.0 L 92.9,150.4 L 116.8,147.7 L 177.4,125.7 L 189.1,121.4 L 173.6,244.5 Z", spectrumPref: 5.0, regionalist: false, desc: "Yekaterimburgo, Tiumén y Siberia occidental · Gas y petróleo" },
    { id: "SIB", name: "Distrito Siberiano", d: "M 286.8,241.1 L 262.1,252.3 L 231.8,252.3 L 201.6,257.8 L 177.4,246.8 L 173.6,244.5 L 189.1,121.4 L 237.9,103.7 L 276.0,122.1 Z", spectrumPref: 4.2, regionalist: false, desc: "Novosibirsk, Krasnoyarsk e Irkutsk · Minería e industria pesada" },
    { id: "FAR", name: "Extremo Oriente", d: "M 480.0,153.2 L 480.0,169.7 L 449.7,197.2 L 419.5,235.8 L 407.4,246.8 L 404.3,208.3 L 368.0,202.8 L 343.8,230.3 L 358.9,263.3 L 331.7,290.8 L 340.8,263.3 L 298.4,235.8 L 286.8,241.1 L 276.0,122.1 L 283.3,125.7 L 358.9,131.2 L 419.5,147.7 Z", spectrumPref: 4.4, regionalist: true, desc: "Vladivostok, Yakutia y Kamchatka · Puertos del Pacífico y recursos" }
  ]
};


// ---- 8. RELACIONES EXTERIORES ----
const COUNTRY_INTL = {
  blocksText: "OTAN↔Rusia, China↔Rusia, India↔Occidente",
  partners: {
    cn: {
      name: "China",
      icon: "fa-dragon",
      ally: { name: "Socio estratégico sin límites", daily: { eco: 0.05, mil: 0.02 }, money: 2400 },
      tense: { name: "Enfriamiento con Pekín", daily: { eco: -0.05 }, money: -1500 }
    },
    inn: { name: "India", icon: "fa-globe-asia", ally: { name: "Gran comprador de petróleo", daily: { eco: 0.04 }, money: 1500 }, tense: { name: "Distancia con Nueva Delhi", daily: { eco: -0.03 }, money: -750 } },
    ue: {
      name: "Unión Europea",
      icon: "fa-earth-europe",
      ally: { name: "Deshielo con Europa", daily: { eco: 0.04, est: 0.02 }, money: 1200 },
      tense: { name: "Bloqueo económico europeo", daily: { eco: -0.05, est: -0.02 }, money: -1500 }
    },
    us: {
      name: "Estados Unidos",
      icon: "fa-flag-usa",
      ally: { name: "Distensión con Washington", daily: { est: 0.03, eco: 0.02 }, money: 900 },
      tense: { name: "Tensión con Washington", daily: { mil: -0.02, est: -0.03 }, money: -900 }
    },
    cei: {
      name: "Bielorrusia y CEI",
      icon: "fa-handshake",
      ally: { name: "Espacio postsoviético leal", daily: { mil: 0.03, est: 0.02 }, money: 600 },
      tense: { name: "Fisuras en el espacio postsoviético", daily: { mil: -0.02 }, money: -450 }
    },
    ir: { name: "Irán y Corea del Norte", icon: "fa-shield-halved", ally: { name: "Eje de los sancionados", daily: { mil: 0.04 }, money: 450 }, tense: { name: "Aliados incómodos", daily: { mil: -0.02 }, money: -300 } }
  },
  base: { cn: 82, inn: 70, ue: 6, us: 6, cei: 80, ir: 76 },
  links: { cn: { inn: 0.1 }, ue: { us: 0.2 }, us: { ue: 0.2 } },
  map: {
    cn: [
      156
    ],
    inn: [
      356
    ],
    ue: [
      250,
      276,
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
      470,
      616,
      203
    ],
    us: [
      840,
      124,
      826
    ],
    cei: [
      112,
      398,
      51,
      417,
      762,
      860,
      795
    ],
    ir: [
      364,
      408
    ]
  },
  actions: {
    cn: [
      { id: "cum", title: "Cumbre con Pekín", cap: 8, cd: 60, fx: { cn: 10, inn: -2 }, now: { eco: 1 } },
      { id: "gas", title: "Contrato de gas a largo plazo", cap: 5, cd: 90, fx: { cn: 6 }, now: { eco: 1 }, inc: 2400 }
    ],
    inn: [
      { id: "pet", title: "Descuento al petróleo para India", cap: 5, cd: 60, fx: { inn: 10 }, now: { eco: 1 }, inc: 1800 }
    ],
    ue: [
      { id: "dia", title: "Sondeo diplomático con Europa", cap: 8, cd: 90, fx: { ue: 8, us: -1 }, now: { est: 1 } }
    ],
    us: [
      { id: "arm", title: "Canal de control de armas", cap: 10, cd: 90, fx: { us: 8, ue: -1 }, now: { est: 1 } }
    ],
    cei: [
      { id: "uni", title: "Cumbre de la CEI y la Unión Económica Euroasiática", cap: 6, cd: 60, fx: { cei: 10 }, now: { mil: 1 } }
    ],
    ir: [
      { id: "dron", title: "Cooperación técnico-militar", cap: 5, cd: 60, fx: { ir: 10, us: -3 }, now: { mil: 2 }, inc: 900 }
    ]
  },
  monthly: [
    { m: "eco", gt: 70, fx: { cn: 0.8, inn: 0.6 }, why: "Economía de guerra resistente" },
    { m: "eco", lt: 30, fx: { cn: -1, inn: -0.8 }, why: "Economía rusa débil" },
    { m: "mil", gt: 80, fx: { cei: 0.8, ir: 0.5, ue: -0.4 }, why: "Poder militar ruso" },
    { m: "est", lt: 30, fx: { cn: -0.8, cei: -0.5 }, why: "Inestabilidad interna en Rusia" }
  ],
  pop: [
    {
      id: "chn",
      cond: r => r.cn <= 40,
      title: "PEKÍN EXIGE MEJORES CONDICIONES",
      desc: "China aprovecha las sanciones para pedir descuentos en gas y petróleo.",
      options: [
        { text: "Aceptar y firmar el contrato", intl: { cn: 10, inn: -2 }, stats: { eco: 2, apr: -2 }, news: "Moscú acepta las condiciones de Pekín.", income: 3600 },
        { text: "Rechazar y buscar otros compradores", intl: { cn: -6, inn: 4 }, stats: { eco: -1, apr: 1 }, news: "Rusia rechaza las condiciones chinas." }
      ]
    },
    {
      id: "ues",
      cond: r => r.ue >= 25,
      title: "UN SONDEO DE DISTENSIÓN LLEGA DESDE EUROPA",
      desc: "Varios países europeos exploran reabrir canales diplomáticos y comerciales.",
      options: [
        { text: "Abrir el diálogo", intl: { ue: 10, us: 2 }, stats: { eco: 1, est: 1 }, news: "Moscú acepta reabrir canales con Europa." },
        { text: "Rechazar el contacto", intl: { ue: -6 }, stats: { mil: 1, apr: 1 }, news: "Moscú rechaza los contactos con Europa." }
      ]
    }
  ]
};


// ---- 9. DECRETOS Y SOCIEDAD ----
const COUNTRY_DECREES = {
  tab: "Ukaz presidenciales",
  title: "UKAZ PRESIDENCIALES — DECRETOS DEL PRESIDENTE",
  sub: "Los ukaz entran en vigor al ser firmados y publicados en el boletín oficial.",
  pending: "DECRETOS EN TRÁMITE",
  btn: "FIRMAR",
  pub: "¡PUBLICADO! Entra en vigor",
  logPrefix: "Decreto enviado",
  list: [
    { id: "DEC_ALIVIO", title: "Alivio fiscal a las familias", cost: 1750, desc: "Economía +0.3 y Aprobación +0.1 por día durante 25 días.", cooldown: 60, statsPerDay: { eco: 0.3, apr: 0.1 } },
    { id: "DEC_EMPLEO", title: "Programa nacional de empleo juvenil", cost: 2400, desc: "Empleo +0.4 y Estabilidad +0.2 por día durante 25 días.", cooldown: 90, statsPerDay: { emp: 0.4, est: 0.2 } },
    { id: "DEC_PAGA", title: "Bonificación a las Fuerzas Armadas", cost: 1200, desc: "Lealtad militar +0.5 por día durante 25 días.", cooldown: 45, statsPerDay: { mil: 0.5 } },
    { id: "DEC_VIVIENDA", title: "Ayuda a la vivienda", cost: 950, desc: "Estabilidad +0.3 y Aprobación +0.2 por día durante 25 días.", cooldown: 50, statsPerDay: { est: 0.3, apr: 0.2 } },
    { id: "DEC_SALUD", title: "Refuerzo de la salud pública", cost: 2150, desc: "Estabilidad +0.4 y Aprobación +0.3 por día durante 25 días.", cooldown: 75, statsPerDay: { est: 0.4, apr: 0.3 } },
    { id: "DEC_POLICIA", title: "Plan de apoyo a la policía", cost: 1450, desc: "Estabilidad +0.5 por día durante 25 días.", cooldown: 45, statsPerDay: { est: 0.5 } },
    { id: "DEC_INFRA", title: "Modernización de infraestructuras", cost: 3600, desc: "Economía +0.6 y Empleo +0.3 por día durante 25 días.", cooldown: 100, statsPerDay: { eco: 0.6, emp: 0.3 } },
    { id: "DEC_PYMES", title: "Rescate a la pequeña empresa", cost: 1900, desc: "Economía +0.4 y Empleo +0.3 por día durante 25 días.", cooldown: 70, statsPerDay: { eco: 0.4, emp: 0.3 } },
    { id: "DEC_DEFENSA", title: "Modernización de las Fuerzas Armadas", cost: 3350, desc: "Lealtad militar +0.8 por día durante 25 días.", cooldown: 90, statsPerDay: { mil: 0.8 } },
    { id: "DEC_DIPLO", title: "Fondo de diplomacia pública", cost: 360, desc: "Aprobación +0.3 por día durante 25 días.", cooldown: 40, statsPerDay: { apr: 0.3 } }
  ]
};
const COUNTRY_SOCIETY = {
  crises: [{"id": "apagon", "ic": "fa-bolt", "t": "APAGÓN NACIONAL", "col": "emp", "st": [["Un apagón masivo deja sin luz a varias regiones rusas en pleno invierno.", [["Declarar la emergencia y movilizar al Ministerio de Emergencias", 2, {"est": -1}, 480, "Respuesta firme"], ["Pedir calma por televisión y esperar a las compañías eléctricas", 1, {"apr": 1}, 0, "Prudente"], ["Cargar contra los gobernadores regionales", 0, {"apr": 3, "eco": -2}, 0, "Populista"]]], ["Pasadas 12 horas, los hospitales funcionan con generadores y la calefacción falla.", [["Desplegar a la Guardia Nacional y priorizar hospitales", 2, {}, 360, "Orden"], ["Pactar con las eléctricas un restablecimiento por fases", 2, {"eco": -1}, 0, "Negociación"], ["Importar energía de Bielorrusia y Kazajistán", 1, {"eco": 1}, 700, "Costoso"]]], ["Vuelve la luz. Toca decidir cómo cerrar la crisis.", [["Comisión de investigación del Kremlin", 1, {"apr": 2}, 0, "Transparencia"], ["Plan de refuerzo de la red eléctrica", 2, {"eco": 2}, 1200, "Inversión"], ["Pasar página rápidamente", 0, {"apr": -1}, 0, "Barato"]]]]}, {"id": "fuego", "ic": "fa-fire", "t": "INCENDIOS EN LA TAIGA", "col": "rur", "st": [["Decenas de incendios simultáneos arrasan millones de hectáreas de taiga en Siberia.", [["Pedir aviones cisterna a Bielorrusia y China", 2, {}, 0, "Cooperación"], ["Movilizar al Ministerio de Emergencias y al Ejército", 2, {"mil": 1}, 480, "Fuerza"], ["Culpar a los gobernadores regionales", 0, {"apr": 2, "est": -2}, 0, "Confrontación"]]], ["El fuego amenaza núcleos urbanos y hay evacuaciones.", [["Evacuación preventiva masiva", 2, {}, 360, "Seguridad"], ["Concentrar los medios en los pueblos", 1, {}, 0, "Selectivo"], ["Esperar a que cambie el viento", 0, {"est": -2}, 0, "Pasivo"]]], ["Con el fuego extinguido, queda reconstruir.", [["Ayudas directas a los afectados", 2, {"apr": 2}, 1450, "Generoso"], ["Plan de reforestación y prevención", 2, {"est": 2}, 950, "A largo plazo"], ["Declarar zona catastrófica y esperar fondos", 1, {}, 0, "Lento"]]]]}, {"id": "huelga", "ic": "fa-bullhorn", "t": "PARO DE TRANSPORTISTAS", "col": "obr", "st": [["Los camioneros y los mineros convocan un paro nacional por los precios y los salarios.", [["Convocar a empresarios y sindicatos oficiales a una mesa", 2, {}, 240, "Diálogo"], ["Decretar servicios mínimos estrictos", 0, {"est": -2}, 0, "Dureza"], ["Ignorar la convocatoria", 0, {}, 0, "Indiferencia"]]], ["El paro bloquea carreteras y minas; los precios suben.", [["Ofrecer una subida salarial en el sector público", 2, {"emp": 1}, 600, "Cesión"], ["Apelar a la ciudadanía por televisión", 1, {"apr": 1}, 0, "Comunicación"], ["Mantener la firmeza", 0, {"est": -2}, 0, "Firmeza"]]], ["Hay un preacuerdo sobre la mesa.", [["Firmarlo con foto de familia", 2, {"apr": 2}, 0, "Acuerdo"], ["Rebajarlo con letra pequeña", 1, {"eco": 1}, 0, "Astuto"], ["Romper la mesa", 0, {"est": -3}, 0, "Ruptura"]]]]}],
  intro: "En Rusia pesan la guerra, la inflación, las sanciones y un sistema político muy centralizado.",
  cols: [
    { id: "sil", name: "Siloviki y fuerzas de seguridad", icon: "fa-shield-halved", tgt: m => m.mil * .6 + m.est * .4, hit: { mil: -0.04 }, up: { mil: 0.02 } },
    { id: "olig", name: "Oligarcas y empresarios cercanos al Kremlin", icon: "fa-briefcase", tgt: m => m.eco * .8 + m.est * .2, hit: { eco: -0.05 }, up: { eco: 0.03 } },
    { id: "jub", name: "Jubilados y funcionarios", icon: "fa-person-cane", tgt: m => m.est * .5 + m.eco * .5, hit: { est: -0.04 }, up: { est: 0.02 } },
    { id: "urb", name: "Clase media urbana (Moscú y San Petersburgo)", icon: "fa-city", tgt: m => m.eco * .5 + m.apr * .5, hit: { apr: -0.04 }, up: { apr: 0.03 } },
    { id: "reg", name: "Regiones y repúblicas", icon: "fa-location-dot", tgt: m => m.est * .6 + m.apr * .4, hit: { est: -0.03, apr: -0.03 }, up: { apr: 0.02 } }
  ],
  scandals: [
    {
      t: "Corrupción en contratos de defensa",
      d: "La prensa independiente revela sobornos en contratos de armamento.",
      o: [
        { x: "Detener a los implicados", now: { apr: 1, est: -1 }, later: [
            30,
            { mil: 3, apr: 2 },
            "La purga refuerza al Estado"
          ], cap: 4 },
        { x: "Silenciar a la prensa", now: { apr: -2, con: -3 }, later: [
            40,
            { est: -2 },
            "Crece el descontento entre las élites"
          ], cap: -3 }
      ]
    },
    {
      t: "Rebelión de un caudillo regional",
      d: "Un gobernador desafía las órdenes de Moscú.",
      o: [
        { x: "Negociar un pacto de lealtad", now: { est: -1 }, later: [
            30,
            { est: 3 },
            "La región vuelve a la disciplina"
          ], cap: 3 },
        { x: "Intervención de la Guardia Nacional", now: { est: -3, mil: 2 }, later: [
            35,
            { est: 2 },
            "El orden se restablece"
          ], cap: -2 }
      ]
    }
  ]
};


// ---- 10. DEMOGRAFÍA ----
const COUNTRY_DEMO = {
  pop: 144,
  sh: [
    0.18,
    0.15,
    0.22,
    0.28,
    0.17
  ],
  tfr: 1.45,
  mig: 100,
  mort: 1.3,
  ss: 1.0,
  warScale: 350,
  ssName: "Fondo de Pensiones de Rusia",
  retName: "pensionistas",
  note: "Rusia afronta un declive demográfico acelerado: baja natalidad, alta mortalidad masculina, bajas militares y emigración de jóvenes cualificados."
};
