// =====================================================================
//  FRANCIA — MONCLOA STRATEGY  (Countries/francia.js)
//  Assemblée nationale: 577 escaños, mayoría 289. Escenario 2026.
//  Escala k ≈ 1.6 respecto a España. Dinero en M€.
// =====================================================================

const CHAMBER = { seats: 577, majority: 289 };
const SCENARIOS = {
  ACTUAL: {
    id: 'ACTUAL', title: 'FRANCIA (2026)', treasury: 98000, startYear: 2026,
    desc: 'Assemblée nationale fragmentada tras un ciclo de disoluciones. El bloque de izquierda (NFP), el centro macronista (Ensemble), la derecha clásica (LR) y la extrema derecha (RN) se disputan Matignon. Pensiones, deuda, suburbios, nuclear y la rivalidad con Rusia marcan la agenda del Elíseo.',
    parties: [
      { id: 'LFI',  name: 'La France Insoumise',     leader: 'Jean-Luc Mélenchon', seats: 74,  baseSeats: 74,  minSeats: 0, maxSeats: 160, basePct: 11.5, color: '#c41e3a', isRegional: false, ideology: 'Izquierda radical',   spectrumOrder: 1, redLines: ['RN', 'LR'] },
      { id: 'PS',   name: 'Parti Socialiste',        leader: 'Olivier Faure',      seats: 68,  baseSeats: 68,  minSeats: 0, maxSeats: 150, basePct: 10.5, color: '#e11d48', isRegional: false, ideology: 'Socialdemocracia',    spectrumOrder: 2, redLines: ['RN'] },
      { id: 'EELV', name: 'Les Écologistes',         leader: 'Marine Tondelier',   seats: 38,  baseSeats: 38,  minSeats: 0, maxSeats: 90,  basePct: 6.0,  color: '#16a34a', isRegional: false, ideology: 'Ecologismo',          spectrumOrder: 3, redLines: ['RN'] },
      { id: 'ENS',  name: 'Ensemble',                leader: 'Gabriel Attal',      seats: 152, baseSeats: 152, minSeats: 0, maxSeats: 280, basePct: 24.0, color: '#f59e0b', isRegional: false, ideology: 'Centro',              spectrumOrder: 4, redLines: ['LFI', 'RN'] },
      { id: 'LR',   name: 'Les Républicains',        leader: 'Laurent Wauquiez',   seats: 68,  baseSeats: 68,  minSeats: 0, maxSeats: 160, basePct: 11.0, color: '#1d4ed8', isRegional: false, ideology: 'Derecha',             spectrumOrder: 5, redLines: ['LFI'] },
      { id: 'RN',   name: 'Rassemblement National',  leader: 'Jordan Bardella',    seats: 142, baseSeats: 142, minSeats: 0, maxSeats: 260, basePct: 28.5, color: '#0f172a', isRegional: false, ideology: 'Extrema derecha',     spectrumOrder: 6, redLines: ['LFI', 'PS', 'EELV', 'ENS'] },
      { id: 'LIOT', name: 'LIOT / Divers',           leader: 'Charles de Courson', seats: 35,  baseSeats: 35,  minSeats: 0, maxSeats: 60,  basePct: 5.5,  color: '#64748b', isRegional: false, ideology: 'Varios',              spectrumOrder: 7, redLines: [] }
    ]
  }
};

const DYNAMIC_EVENTS = [
  { id: 'FR_PENSIONES', category: 'SOCIAL', title: 'REFORMA DE PENSIONES EN LA CALLE',
    desc: 'Sindicatos convocan una jornada de huelga general contra el retraso de la edad de jubilación. Las manifestaciones cortan París, Lyon y Marsella.',
    options: [
      { text: 'Congelar la reforma y abrir una mesa con los sindicatos', stats: { apr: 6, est: 4, eco: -2 }, cost: 4200, loyaltyImpact: { PS: 12, LFI: 10, EELV: 8, ENS: -8, LR: -10, RN: -6 }, news: 'Matignon congela la reforma de pensiones y convoca a los sindicatos.' },
      { text: 'Mantener el calendario y reforzar el orden público', stats: { est: -4, apr: -5, eco: 1 }, cost: 800, loyaltyImpact: { ENS: 8, LR: 10, RN: 4, LFI: -15, PS: -12 }, news: 'El Gobierno mantiene la reforma de pensiones pese a la movilización.' }
    ] },
  { id: 'FR_SUBURBIOS', category: 'SEGURIDAD', title: 'TENSIÓN EN LOS BANLIEUES',
    desc: 'Disturbios nocturnos tras un incidente policial. Queman coches y atacan comisarías en varios departamentos de Île-de-France.',
    options: [
      { text: 'Plan de emergencia social y mediación local', stats: { apr: 4, est: 3, eco: -1 }, cost: 2800, loyaltyImpact: { PS: 10, EELV: 8, LFI: 8, RN: -12, LR: -6 }, news: 'El Gobierno anuncia un plan de emergencia para los barrios sensibles.' },
      { text: 'Estado de emergencia local y más efectivos', stats: { est: 5, apr: -2 }, cost: 1500, loyaltyImpact: { RN: 12, LR: 10, ENS: 4, LFI: -14, PS: -8 }, news: 'Refuerzo policial masivo en los banlieues tras los disturbios.' }
    ] },
  { id: 'FR_NUCLEAR', category: 'ENERGÍA', title: 'PARONES EN REACTORES NUCLEARES',
    desc: 'Varios reactores de EDF se detienen por mantenimiento no programado. El precio de la electricidad se dispara y la industria protesta.',
    options: [
      { text: 'Acelerar el plan nuclear y ayudas a la industria', stats: { eco: 4, apr: 2 }, cost: 6500, loyaltyImpact: { ENS: 8, LR: 6, RN: 4, EELV: -12 }, news: 'París refuerza el programa nuclear y compensa a la gran industria.' },
      { text: 'Priorizar renovables y eficiencia a corto plazo', stats: { apr: 3, eco: -1 }, cost: 3200, loyaltyImpact: { EELV: 14, PS: 6, LFI: 4, LR: -8, RN: -4 }, news: 'El Gobierno apuesta por un shock de renovables ante la crisis nuclear.' }
    ] },
  { id: 'FR_DEUDA', category: 'ECONOMÍA', title: 'BRUSELAS EXIGE AJUSTE FISCAL',
    desc: 'La Comisión Europea abre un procedimiento por déficit excesivo. Los mercados vigilan la prima de riesgo francesa.',
    options: [
      { text: 'Plan de consolidación creíble a tres años', stats: { eco: 3, apr: -4, est: 2 }, cost: 0, loyaltyImpact: { ENS: 6, LR: 8, PS: -6, LFI: -10 }, news: 'Francia presenta un plan de ajuste para satisfacer a Bruselas.' },
      { text: 'Desafiar el marco y priorizar el crecimiento', stats: { apr: 5, eco: -3, est: -2 }, cost: 0, loyaltyImpact: { LFI: 12, PS: 6, RN: 4, ENS: -10, LR: -8 }, news: 'París rechaza un ajuste duro y apuesta por el crecimiento.' }
    ] },
  { id: 'FR_AGRI', category: 'RURAL', title: 'TRACTORES EN LOS CAMPOS ELÍSEOS',
    desc: 'Los agricultores bloquean carreteras y amenazan con entrar en París contra la normativa europea y los precios de la gran distribución.',
    options: [
      { text: 'Ayudas de emergencia y revisión de normas', stats: { apr: 5, eco: -2, est: 2 }, cost: 3800, loyaltyImpact: { LR: 10, RN: 8, ENS: 4, EELV: -8 }, news: 'El Gobierno anuncia un paquete de ayudas al campo francés.' },
      { text: 'Mantener el marco verde y mediación con la UE', stats: { apr: -3, est: -2 }, cost: 400, loyaltyImpact: { EELV: 10, PS: 4, LR: -10, RN: -8 }, news: 'Matignon defiende el Pacto Verde ante la presión agraria.' }
    ] },
  { id: 'FR_SAHEL', category: 'EXTERIOR', title: 'REDEFINIR LA PRESENCIA EN EL SAHEL',
    desc: 'Golpes de Estado y rechazo local obligan a replantear la operación militar francesa en la región.',
    options: [
      { text: 'Retirada ordenada y cooperación civil', stats: { apr: 3, mil: -2 }, cost: 1200, loyaltyImpact: { PS: 6, EELV: 8, LFI: 6, LR: -6, RN: -4 }, news: 'Francia acelera la retirada militar del Sahel.' },
      { text: 'Mantener bases clave y reforzar inteligencia', stats: { mil: 4, apr: -1 }, cost: 2400, loyaltyImpact: { LR: 8, ENS: 6, RN: 4, LFI: -10 }, news: 'El Elíseo mantiene una presencia militar reducida pero estratégica.' }
    ] }
];

const CAMPAIGN_HEADLINES = [
  { id: 1, newspaper: 'LE MONDE', headline: 'EL PODER ADQUISITIVO DOMINA LA CAMPAÑA', desc: 'La inflación de alimentos y energía es el primer tema en los sondeos. ¿Cómo respondes?',
    options: [ { text: 'Cheque energético y control temporal de precios', score: +8, textResult: 'El gesto alivia a las clases medias y te devuelve la iniciativa.' }, { text: 'Confiar en el BCE y hablar de reformas estructurales', score: -2, textResult: 'Suena técnico y lejano; la oposición te acusa de indiferencia.' } ] },
  { id: 2, newspaper: 'LE FIGARO', headline: 'INSEGURIDAD: EL TEMA QUE LO CAMBIA TODO', desc: 'Un crimen mediático reabre el debate sobre inmigración y mano dura.',
    options: [ { text: 'Anunciar más policías y expulsiones exprés', score: +7, textResult: 'Tu base y el centro-derecha aplauden la firmeza.' }, { text: 'Insistir en prevención y justicia restaurativa', score: +2, textResult: 'Proyectas mesura, pero pierdes terreno en los sondeos de seguridad.' } ] },
  { id: 3, newspaper: 'LIBÉRATION', headline: 'DEBATE DECISIVO EN TF1', desc: 'Millones de espectadores. Un desliz puede costar la elección.',
    options: [ { text: 'Atacar el programa económico del rival', score: +6, textResult: 'Logras poner al adversario a la defensiva durante días.' }, { text: 'Mostrar empatía y un relato de unidad nacional', score: +5, textResult: 'Ganas moderados; tu base pide más combatividad.' } ] },
  { id: 4, newspaper: 'LES ÉCHOS', headline: 'LOS MERCADOS MIRAN LA DEUDA FRANCESA', desc: 'La prima frente a Alemania se ensancha. Los inversores piden claridad.',
    options: [ { text: 'Compromiso creíble de déficit y reformas', score: +6, textResult: 'Los mercados respiran y ganas credibilidad económica.' }, { text: 'Hablar solo de inversión y reindustrialización', score: -3, textResult: 'Pareces evitar el problema; la prima sigue alta.' } ] },
  { id: 5, newspaper: 'L\'OPINION', headline: 'LAÍCITÉ Y ESCUELA', desc: 'Una polémica en un instituto reabre el debate sobre el velo y la República.',
    options: [ { text: 'Defensa estricta de la laicidad en clase', score: +5, textResult: 'El mensaje republicano conecta con un electorado amplio.' }, { text: 'Apostar por el diálogo y evitar estigmatizar', score: +2, textResult: 'Calmas un flanco, pero te acusan de debilidad.' } ] },
  { id: 6, newspaper: 'MEDPART', headline: 'ÚLTIMA SEMANA: MOVILIZAR O AMPLIAR', desc: 'Tu equipo debate si endurecer el mensaje o buscar el centro.',
    options: [ { text: 'Movilizar la base con un mensaje claro', score: +7, textResult: 'La participación de tu electorado sube con fuerza.' }, { text: 'Abrirse al centro con gestos moderados', score: +4, textResult: 'Ganas indecisos; parte de tu base se desmoviliza.' } ] }
];

const PRESS_NEWS_BANK = [
  { id: 'FR_P1', cat: 'ECONOMÍA', title: 'INSEE REVISA AL ALZA EL CRECIMIENTO', body: 'El instituto estadístico mejora dos décimas la previsión anual gracias a la industria y el turismo.' },
  { id: 'FR_P2', cat: 'SOCIAL', title: 'HUELGA PARCIAL EN LA SNCF', body: 'Los sindicatos de ferroviarios convocan paros intermitentes por salarios y condiciones.' },
  { id: 'FR_P3', cat: 'INTERNACIONAL', title: 'CUMBRE UE EN BRUSELAS', body: 'Francia presiona por una política industrial común y un presupuesto de defensa europeo.' },
  { id: 'FR_P4', cat: 'ENERGÍA', title: 'EDF ANUNCIA NUEVOS RETRASOS', body: 'La puesta en marcha de un reactor se retrasa seis meses; el Gobierno exige un plan de contingencia.' },
  { id: 'FR_P5', cat: 'POLÍTICA', title: 'MOCIÓN DE CENSURA FALLIDA', body: 'La oposición no reúne los votos necesarios. El primer ministro sale reforzado de momento.' },
  { id: 'FR_P6', cat: 'SOCIEDAD', title: 'RÉCORD DE CALOR EN JULIO', body: 'Ola de calor extremo en el sur. Hospitales en alerta y restricciones de agua en varios departamentos.' }
];

const MINISTRY_DECISIONS_BANK = {
  economia: [
    { title: 'Crédito de impuesto a la reindustrialización', cost: 4200, stats: { eco: 4, emp: 2 } },
    { title: 'Recorte selectivo de gasto público', cost: 0, stats: { eco: 2, apr: -3 } }
  ],
  interior: [
    { title: 'Plan nacional de seguridad en banlieues', cost: 2100, stats: { est: 4, apr: 1 } },
    { title: 'Refuerzo de la policía judicial', cost: 1600, stats: { est: 3 } }
  ],
  defensa: [
    { title: 'Acelerar la Ley de Programación Militar', cost: 5500, stats: { mil: 5, eco: -1 } },
    { title: 'Inversión en ciberdefensa', cost: 2800, stats: { mil: 3, est: 1 } }
  ],
  sanidad: [
    { title: 'Refuerzo de urgencias hospitalarias', cost: 3200, stats: { apr: 4, est: 2 } },
    { title: 'Plan de salud mental juvenil', cost: 1800, stats: { apr: 3, con: 1 } }
  ],
  educacion: [
    { title: 'Más docentes en zonas prioritarias', cost: 2400, stats: { apr: 3, con: 2 } },
    { title: 'Reforma del bachillerato profesional', cost: 1500, stats: { emp: 2, apr: 1 } }
  ],
  exteriores: [
    { title: 'Diplomacia económica en el Indo-Pacífico', cost: 900, stats: { eco: 2, mil: 1 } },
    { title: 'Reforzar el eje franco-alemán', cost: 400, stats: { est: 2, eco: 1 } }
  ],
  transicion_ecologica: [
    { title: 'Acelerar la renovación energética de edificios', cost: 3600, stats: { apr: 3, eco: 1 } },
    { title: 'Apoyo a la industria nuclear de nueva generación', cost: 4800, stats: { eco: 3, mil: 1 } }
  ],
  vivienda: [
    { title: 'Construcción acelerada de vivienda social', cost: 4000, stats: { apr: 4, est: 2 } },
    { title: 'Incentivos fiscales al alquiler asequible', cost: 2200, stats: { apr: 3 } }
  ],
  trabajo: [
    { title: 'Reforma del seguro de desempleo', cost: 0, stats: { eco: 2, apr: -2, emp: 1 } },
    { title: 'Plan de empleo joven en industria verde', cost: 2600, stats: { emp: 3, apr: 2 } }
  ],
  justicia: [
    { title: 'Más plazas en prisiones y jueces de instrucción', cost: 1900, stats: { est: 3 } },
    { title: 'Agilizar juicios por delincuencia reincidente', cost: 1100, stats: { est: 2, apr: 1 } }
  ],
  cultura: [
    { title: 'Pase cultural ampliado para jóvenes', cost: 800, stats: { apr: 2, con: 1 } }
  ],
  igualdad: [
    { title: 'Plan contra la violencia de género', cost: 700, stats: { apr: 3, est: 1 } }
  ],
  infraestructuras: [
    { title: 'Modernización de la red TER', cost: 3500, stats: { eco: 2, apr: 2, emp: 1 } },
    { title: 'Nuevos tramos de tren de alta velocidad', cost: 6000, stats: { eco: 3, emp: 2 } }
  ],
  territorio: [
    { title: 'Fondo de cohesión para la Francia rural', cost: 2000, stats: { apr: 3, est: 1 } }
  ]
};

const HOUSING_EVENTS = [
  { id: 'FR_H1', category: 'VIVIENDA', title: 'CRISIS DEL ALQUILER EN PARÍS Y LYON',
    desc: 'Los precios del alquiler superan el 40 % de la renta media de los jóvenes. Manifestaciones frente a las prefecturas.',
    options: [
      { text: 'Tope temporal de subidas y más vivienda pública', stats: { apr: 5, eco: -1 }, cost: 4500, loyaltyImpact: { PS: 10, LFI: 8, EELV: 6, LR: -6 }, news: 'El Gobierno limita las subidas de alquiler en las grandes ciudades.' },
      { text: 'Liberalizar normas de construcción', stats: { eco: 2, apr: -2 }, cost: 0, loyaltyImpact: { ENS: 6, LR: 8, LFI: -10 }, news: 'París apuesta por construir más y reducir trámites urbanísticos.' }
    ] }
];

const SHOCK_POOL = [
  { id: 'FR_S1', title: 'Huelga general sorpresa', desc: 'Paro de transportes y refinerías durante 48 h.', stats: { eco: -4, est: -3, apr: -2 } },
  { id: 'FR_S2', title: 'Ciberataque a hospitales', desc: 'Un ransomware paraliza varios CHU.', stats: { est: -3, apr: -2 } },
  { id: 'FR_S3', title: 'Rebaja de rating soberano', desc: 'Una agencia cuestiona la senda de deuda.', stats: { eco: -5, apr: -3 } },
  { id: 'FR_S4', title: 'Incidente diplomático con Argelia', desc: 'Crisis verbal y amenazas de represalias migratorias.', stats: { est: -2, mil: -1 } }
];

const REAL_MINISTERS = [
  { id: 'pm', title: 'Premier ministre', name: 'À désigner' },
  { id: 'economie', title: 'Économie et Finances', name: 'À désigner' },
  { id: 'interieur', title: 'Intérieur', name: 'À désigner' },
  { id: 'defense', title: 'Armées', name: 'À désigner' },
  { id: 'affaires', title: 'Europe et Affaires étrangères', name: 'À désigner' },
  { id: 'education', title: 'Éducation nationale', name: 'À désigner' },
  { id: 'sante', title: 'Santé', name: 'À désigner' },
  { id: 'ecologie', title: 'Transition écologique', name: 'À désigner' },
  { id: 'travail', title: 'Travail', name: 'À désigner' },
  { id: 'justice', title: 'Justice', name: 'À désigner' }
];

const GOAL_POOL = [
  { id: 'FR_G1', title: 'Déficit bajo control', desc: 'Reducir el déficit por debajo del 3 % del PIB.', metric: 'eco', target: 70 },
  { id: 'FR_G2', title: 'Orden en las calles', desc: 'Mantener la estabilidad por encima de 60.', metric: 'est', target: 60 },
  { id: 'FR_G3', title: 'Popularidad presidencial', desc: 'Aprobación por encima de 55.', metric: 'apr', target: 55 },
  { id: 'FR_G4', title: 'Empleo industrial', desc: 'Empleo por encima de 65.', metric: 'emp', target: 65 }
];

const GOAL_ACTIONS = [
  { id: 'FR_GA1', title: 'Pacto de estabilidad con Bruselas', cost: 0, stats: { eco: 3, apr: -2 } },
  { id: 'FR_GA2', title: 'Gran discurso de política general', cost: 200, stats: { apr: 4, est: 2 } }
];

const FOCUS_TREE = [
  { id: 'eco1', branch: 'eco', title: 'Reindustrialización', desc: 'Relocalizar cadenas de valor estratégicas.', stats: { eco: 3, emp: 2 }, cost: 3000, req: [] },
  { id: 'eco2', branch: 'eco', title: 'Potencia nuclear', desc: 'Nuevos reactivos y SMR.', stats: { eco: 4, mil: 1 }, cost: 5000, req: ['eco1'] },
  { id: 'soc1', branch: 'soc', title: 'Escuela republicana', desc: 'Reforzar la autoridad y la laicidad en clase.', stats: { con: 3, apr: 2 }, cost: 1500, req: [] },
  { id: 'soc2', branch: 'soc', title: 'Servicios públicos de proximidad', desc: 'Reabrir oficinas en la Francia periférica.', stats: { apr: 3, est: 2 }, cost: 2200, req: ['soc1'] },
  { id: 'seg1', branch: 'seg', title: 'Mano firme', desc: 'Más efectivos y justicia rápida.', stats: { est: 4, apr: 1 }, cost: 2000, req: [] },
  { id: 'seg2', branch: 'seg', title: 'Ciberseguridad nacional', desc: 'Escudo digital para infraestructuras críticas.', stats: { mil: 3, est: 2 }, cost: 2800, req: ['seg1'] },
  { id: 'dip1', branch: 'dip', title: 'Europa potencia', desc: 'Liderar la autonomía estratégica europea.', stats: { mil: 2, eco: 1 }, cost: 1200, req: [] },
  { id: 'dip2', branch: 'dip', title: 'África y Mediterráneo', desc: 'Nueva doctrina de influencia en el Sur.', stats: { mil: 2, est: 1 }, cost: 1600, req: ['dip1'] }
];

const FOCUS_LINKS = [
  { from: 'eco1', to: 'eco2' }, { from: 'soc1', to: 'soc2' },
  { from: 'seg1', to: 'seg2' }, { from: 'dip1', to: 'dip2' }
];

const INTL_ACTIONS = [];

const PROJECTS = [
  { id: 'FR_PR1', title: 'Nuevo reactor EPR2', cost: 12000, days: 120, stats: { eco: 5, mil: 1 }, desc: 'Programa de reactores de nueva generación.' },
  { id: 'FR_PR2', title: 'Línea TGV Atlantique bis', cost: 8000, days: 90, stats: { eco: 3, emp: 2, apr: 2 }, desc: 'Ampliar la alta velocidad hacia el oeste.' },
  { id: 'FR_PR3', title: 'Campus tecnológico de Grenoble', cost: 3500, days: 60, stats: { eco: 2, emp: 2, con: 1 }, desc: 'Polo de semiconductores y deep tech.' }
];

const ACHIEVEMENTS = [
  { id: 'FR_A1', title: 'Matignon estable', desc: 'Completar 365 días sin moción de censura exitosa.' },
  { id: 'FR_A2', title: 'Déficit maestro', desc: 'Bajar el déficit percibido por debajo del umbral europeo.' },
  { id: 'FR_A3', title: 'República ordenada', desc: 'Estabilidad por encima de 70 durante 90 días.' }
];

const BDE_GOVS = [
  { id: 'bdf1', name: 'François Villeroy de Galhau', stance: 'ortodoxo' }
];

const BDE_ACTIONS = [
  { id: 'fr_rate_up', icon: 'fa-arrow-up', label: 'Presionar al BCE al alza', desc: 'Señal de ortodoxia (+2 Economía percibida, −2 Aprobación).', cost: 0, cd: 90, when: () => true, stats: { eco: 2, apr: -2 } },
  { id: 'fr_rate_dn', icon: 'fa-arrow-down', label: 'Pedir tipos más bajos', desc: 'Alivio de deuda (+3 Aprobación, −1 Economía).', cost: 0, cd: 90, when: () => true, stats: { apr: 3, eco: -1 } }
];

const COUNTRY_ECON = {
  currency: '€',
  terms: {
    gov: 'El Gobierno', place: 'Matignon', cabinet: 'Consejo de Ministros', bank: 'Banque de France',
    nation: 'Francia', adj: 'francés', firms: 'francesas', capital: 'París', curName: 'Euro', sovereign: false
  },
  k: 1.6,
  budget: 480000, budgetStep: 4000,
  pib: 2800000, debt: 3100000, macroPib: 2800000, revPct: 0.48, pensPct: 0.14, otherPct: 0.12,
  baseRate: 3.2, debtMax: 900000, cashCap: 150000,
  preset: { sanidad: 90000, educacion: 72000, defensa: 55000, vivienda: 28000, infraestructuras: 35000, deuda: 45000 },
  hint: 'Presupuesto francés a escala de juego: Sanidad y pensiones pesan mucho; Defensa ronda el 2 % del PIB. Ajusta el reparto a tu estrategia.',
  labels: {
    sanidad: 'Santé et Sécurité sociale', educacion: 'Éducation nationale', defensa: 'Armées',
    vivienda: 'Logement', infraestructuras: 'Transports et infrastructures', deuda: 'Charge de la dette'
  },
  pct: { sanidad: 22, educacion: 15, infraestructuras: 8, interior: 7, defensa: 12, economia: 10, vivienda: 6 },
  names: {
    economia: 'Ministère de l\'Économie', interior: 'Ministère de l\'Intérieur', defensa: 'Ministère des Armées',
    vivienda: 'Ministère du Logement', territorio: 'Ministère de la Transition territoriale', sanidad: 'Ministère de la Santé',
    educacion: 'Ministère de l\'Éducation nationale', trabajo: 'Ministère du Travail', justicia: 'Ministère de la Justice',
    exteriores: 'Ministère de l\'Europe et des Affaires étrangères', transicion_ecologica: 'Ministère de la Transition écologique',
    cultura: 'Ministère de la Culture', igualdad: 'Ministère chargé de l\'Égalité', infraestructuras: 'Ministère des Transports'
  },
  descs: {
    sanidad: 'Hospitales, Seguridad Social y salud pública.', educacion: 'Escuela republicana, universidades e investigación.',
    infraestructuras: 'Trenes, carreteras, puertos y red eléctrica.', interior: 'Policía, gendarmería y seguridad interior.',
    defensa: 'Ejércitos, disuasión nuclear e industria de defensa.', economia: 'Tesoro, presupuesto, Bercy e industria.',
    vivienda: 'Vivienda social y regulación del alquiler.', trabajo: 'Empleo, paro y diálogo social.',
    justicia: 'Tribunales, prisiones y ayuda jurisdiccional.', exteriores: 'Diplomacia, UE y red consular.',
    transicion_ecologica: 'Clima, energía y biodiversidad.', cultura: 'Patrimonio, audiovisuales e industrias culturales.',
    igualdad: 'Igualdad de género y lucha contra discriminaciones.', territorio: 'Cohesión territorial y Francia rural.'
  }
};

const COUNTRY_MAP = {
  regions: [
    { id: 'idf', name: 'Île-de-France', x: 52, y: 38 },
    { id: 'hdf', name: 'Hauts-de-France', x: 50, y: 22 },
    { id: 'ges', name: 'Grand Est', x: 68, y: 32 },
    { id: 'bfc', name: 'Bourgogne-Franche-Comté', x: 62, y: 45 },
    { id: 'cvl', name: 'Centre-Val de Loire', x: 48, y: 48 },
    { id: 'nor', name: 'Normandie', x: 38, y: 32 },
    { id: 'bre', name: 'Bretagne', x: 28, y: 38 },
    { id: 'pdl', name: 'Pays de la Loire', x: 36, y: 48 },
    { id: 'naq', name: 'Nouvelle-Aquitaine', x: 38, y: 62 },
    { id: 'occ', name: 'Occitanie', x: 48, y: 72 },
    { id: 'ara', name: 'Auvergne-Rhône-Alpes', x: 62, y: 58 },
    { id: 'pac', name: 'Provence-Alpes-Côte d\'Azur', x: 68, y: 72 },
    { id: 'cor', name: 'Corse', x: 78, y: 82 }
  ]
};

const COUNTRY_INTL = {
  partners: {
    de: { name: 'Alemania', flag: 'DE', base: 72 },
    es: { name: 'España', flag: 'ES', base: 70 },
    it: { name: 'Italia', flag: 'IT', base: 62 },
    uk: { name: 'Reino Unido', flag: 'GB', base: 55 },
    us: { name: 'Estados Unidos', flag: 'US', base: 68 },
    ma: { name: 'Marruecos', flag: 'MA', base: 48 },
    dz: { name: 'Argelia', flag: 'DZ', base: 35 },
    cn: { name: 'China', flag: 'CN', base: 45 },
    ru: { name: 'Rusia', flag: 'RU', base: 22 }
  },
  base: { de: 72, es: 70, it: 62, uk: 55, us: 68, ma: 48, dz: 35, cn: 45, ru: 22 },
  links: {
    de: 'Eje franco-alemán y motor de la UE.',
    es: 'Socios mediterráneos y de la UE.',
    us: 'Aliados OTAN con fricciones comerciales.',
    dz: 'Historia compleja y agenda migratoria.'
  },
  actions: {
    de: [
      { id: 'fr_de_ind', title: 'Pacto industrial franco-alemán', cost: 800, rel: 6, stats: { eco: 2 } }
    ],
    es: [
      { id: 'fr_es_energy', title: 'Interconexiones eléctricas', cost: 1200, rel: 5, stats: { eco: 2, est: 1 } }
    ],
    us: [
      { id: 'fr_us_def', title: 'Cooperación en defensa e IA', cost: 1500, rel: 4, stats: { mil: 2 } }
    ]
  },
  map: {},
  monthly: [],
  pop: []
};

const COUNTRY_DECREES = {
  items: [
    { id: 'FR_ORD_ENERGIA', title: 'Escudo tarifario energético', cost: 5000, desc: '+0.3% Aprobación y +0.2% Estabilidad/día durante 25 días.', cooldown: 60, statsPerDay: { apr: 0.3, est: 0.2 } },
    { id: 'FR_ORD_INDUSTRIA', title: 'Crédito reindustrialización', cost: 4500, desc: '+0.4% Economía y +0.2% Empleo/día durante 30 días.', cooldown: 90, statsPerDay: { eco: 0.4, emp: 0.2 } },
    { id: 'FR_ORD_SEGURIDAD', title: 'Plan anti-violencia urbana', cost: 2200, desc: '+0.4% Estabilidad/día durante 20 días.', cooldown: 45, statsPerDay: { est: 0.4 } },
    { id: 'FR_ORD_JOVEN', title: 'Empleo joven y formación', cost: 2800, desc: '+0.3% Empleo y +0.2% Aprobación/día durante 30 días.', cooldown: 70, statsPerDay: { emp: 0.3, apr: 0.2 } },
    { id: 'FR_ORD_RURAL', title: 'Fondo Francia rural', cost: 1800, desc: '+0.3% Aprobación y +0.1% Estabilidad/día durante 25 días.', cooldown: 55, statsPerDay: { apr: 0.3, est: 0.1 } },
    { id: 'FR_ORD_DEFENSA', title: 'Aceleración de programas de defensa', cost: 3500, desc: '+0.4% Est. Militar/día durante 25 días.', cooldown: 80, statsPerDay: { mil: 0.4 } }
  ]
};
