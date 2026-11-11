// =====================================================================
//  MARRUECOS — MONCLOA STRATEGY
//  Contenido unificado de pais-marruecos.js + marruecos.js, adaptado a la
//  estructura exacta de plantilla-pais.js (17 constantes globales).
//  Cárgalo ANTES del script principal con una etiqueta <script> normal.
//
//  NOTAS DE ADAPTACIÓN
//  · cost > 0 gasta tesorería; cost < 0 ingresa (convención de
//    pais-marruecos.js). Todas las cantidades están en M€.
//  · 'palace' (Confianza del Palacio) no existe como métrica base: en
//    eventos, shocks y acciones presidenciales se ha pasado a `con`.
//    En ministros, espíritus y proyectos se ha omitido. VERIFICAR el uso
//    de `con` en el motor.
//  · Los efectos sobre `debt`, `ES` (España) y `rel` bilateral de los
//    eventos no tienen campo en la plantilla y se han omitido.
//  · Cartera ministerial original -> cartera de la lista cerrada:
//    awqaf -> cultura · equipamiento -> transicion_ecologica
//    agricultura -> territorio · industria -> economia
//    energia -> transicion_ecologica
//  · Los ministros «TEC» (técnicos del Palacio) usan el partido 'OTR'.
//  · Titulares (`news`, `textResult`) y cabeceras de diario: redactados
//    al adaptar, porque los archivos originales no los incluían.
// =====================================================================


// =====================================================================
// 1. SCENARIOS
//  · spectrumOrder reescalado de 1–11 (hemiciclo original) a 1–7,
//    conservando el orden relativo.
//  · basePct calculado como escaños / 395 (no es cuota de voto real).
//  · minSeats = 0 (el original solo limitaba 0..max).
// =====================================================================
// Cámara de Representantes: 395 escaños, mayoría absoluta 198
const CHAMBER = { seats: 395, majority: 198 };

const SCENARIOS = {
  ACTUAL: {
    id: 'ACTUAL',
    title: 'MARRUECOS (2021)',
    treasury: 7700,   // M€ iniciales: 4,4 % del PIB (misma proporción que España). PIB ≈ 176.000 M€
    startYear: 2026,
    desc: 'Cámara de Representantes de 395 escaños (mayoría absoluta: 198), dominada por el RNI, el PAM y el Istiqlal tras el hundimiento del PJD. El Palacio conserva los ministerios de soberanía mientras la sequía, la inflación y la protesta juvenil marcan la agenda.',
    parties: [
      { id: 'FGD',  name: 'Federación de la Izquierda Democrática',     leader: 'Candidatura de la FGD', seats: 1,   baseSeats: 1,   minSeats: 0, maxSeats: 60,  basePct: 0.3,  color: '#be185d', isRegional: false, ideology: 'Izquierda',                spectrumOrder: 1, redLines: ['RNI', 'PAM', 'UC', 'PI', 'MP'] },
      { id: 'PPS',  name: 'Partido del Progreso y el Socialismo',       leader: 'Nabil Benabdallah',     seats: 22,  baseSeats: 22,  minSeats: 0, maxSeats: 70,  basePct: 5.6,  color: '#f97316', isRegional: false, ideology: 'Izquierda',                spectrumOrder: 2, redLines: [] },
      { id: 'USFP', name: 'Unión Socialista de Fuerzas Populares',      leader: 'Driss Lachguar',        seats: 34,  baseSeats: 34,  minSeats: 0, maxSeats: 90,  basePct: 8.6,  color: '#f43f5e', isRegional: false, ideology: 'Socialdemocracia',         spectrumOrder: 3, redLines: [] },
      { id: 'PJD',  name: 'Partido Justicia y Desarrollo',              leader: 'Abdelilah Benkirane',   seats: 13,  baseSeats: 13,  minSeats: 0, maxSeats: 130, basePct: 3.3,  color: '#38bdf8', isRegional: false, ideology: 'Islamismo conservador',    spectrumOrder: 4, redLines: ['PAM'] },
      { id: 'MP',   name: 'Movimiento Popular',                         leader: 'Dirección del MP',      seats: 28,  baseSeats: 28,  minSeats: 0, maxSeats: 70,  basePct: 7.1,  color: '#a16207', isRegional: false, ideology: 'Centro rural',             spectrumOrder: 4, redLines: [] },
      { id: 'UC',   name: 'Unión Constitucional',                       leader: 'Mohamed Sajid',         seats: 18,  baseSeats: 18,  minSeats: 0, maxSeats: 60,  basePct: 4.6,  color: '#eab308', isRegional: false, ideology: 'Liberal',                  spectrumOrder: 5, redLines: [] },
      { id: 'PAM',  name: 'Autenticidad y Modernidad',                  leader: 'Abdellatif Ouahbi',     seats: 87,  baseSeats: 87,  minSeats: 0, maxSeats: 130, basePct: 22.0, color: '#16a34a', isRegional: false, ideology: 'Centro modernista',        spectrumOrder: 5, redLines: ['PJD'] },
      { id: 'RNI',  name: 'Agrupación Nacional de Independientes',      leader: 'Aziz Akhannouch',       seats: 102, baseSeats: 102, minSeats: 0, maxSeats: 150, basePct: 25.8, color: '#2563eb', isRegional: false, ideology: 'Liberal / centroderecha',  spectrumOrder: 6, redLines: [] },
      { id: 'PI',   name: 'Istiqlal',                                   leader: 'Nizar Baraka',          seats: 81,  baseSeats: 81,  minSeats: 0, maxSeats: 120, basePct: 20.5, color: '#dc2626', isRegional: false, ideology: 'Nacionalista conservador', spectrumOrder: 6, redLines: [] },
      { id: 'MDS',  name: 'Movimiento Demócrata y Social',              leader: 'Dirección del MDS',     seats: 3,   baseSeats: 3,   minSeats: 0, maxSeats: 25,  basePct: 0.8,  color: '#94a3b8', isRegional: false, ideology: 'Centro',                   spectrumOrder: 4, redLines: [] },
      { id: 'OTR',  name: 'Independientes y otros',                     leader: 'Independiente',         seats: 6,   baseSeats: 6,   minSeats: 0, maxSeats: 30,  basePct: 1.5,  color: '#64748b', isRegional: false, ideology: 'Varios',                   spectrumOrder: 4, redLines: [] }
    ]
  }
};


// =====================================================================
// 2. DYNAMIC_EVENTS — decisiones de gobierno (DECS de marruecos.js)
//    «Estadios frente a hospitales y escuelas» está en HOUSING_EVENTS.
// =====================================================================
const DYNAMIC_EVENTS = [
  {
    id: 'SPECIAL_MUDAWANA',
    category: 'SOCIEDAD',
    title: 'REFORMA DEL CÓDIGO DE FAMILIA (MUDAWANA)',
    desc: 'Las organizaciones de mujeres exigen más derechos en herencia, custodia y matrimonio; los sectores conservadores y religiosos se oponen.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar una reforma profunda e igualitaria', stats: { apr: +4, est: -3, con: -2 }, cost: 0, loyaltyImpact: { USFP: +15, PPS: +20, PJD: -30, MP: -10, PI: -15 }, news: 'El Gobierno aprueba una profunda reforma de la Mudawana; los islamistas la rechazan.' },
      { text: 'Limitarse a retoques técnicos tras consultar al Consejo de Ulemas', stats: { apr: -3, est: +2, con: +3 }, cost: 0, loyaltyImpact: { PJD: +10, PI: +10, USFP: -15, PPS: -20 }, news: 'El Gobierno limita la reforma de la Mudawana a retoques técnicos tras consultar a los ulemas.' }
    ]
  },
  {
    id: 'SPECIAL_CANNABIS_RIF',
    category: 'ECONOMÍA',
    title: 'CANNABIS LEGAL EN EL RIF',
    desc: 'Las cooperativas piden extender la producción legal de cannabis medicinal e industrial y regularizar a miles de agricultores.',
    condition: (m) => true,
    options: [
      { text: 'Ampliar la producción legal a todo el Rif', stats: { eco: +3, apr: +3, est: +2 }, cost: 150, loyaltyImpact: { PAM: +15, PJD: -15, PI: -5 }, news: 'Rabat extiende el cannabis legal a todo el Rif y regulariza a miles de agricultores.' },
      { text: 'Mantener el modelo restrictivo', stats: { apr: -2, est: -2 }, cost: 0, loyaltyImpact: { PAM: -10, PJD: +8 }, news: 'Rabat mantiene el modelo restrictivo y las cooperativas del Rif se sienten abandonadas.' }
    ]
  },
  {
    id: 'GEO_SAHARA_AUTONOMIA',
    category: 'SUR',
    title: 'PROVINCIAS DEL SUR Y PLAN DE AUTONOMÍA',
    desc: 'El Palacio pide reforzar la apuesta por el Sáhara en el plano económico y diplomático.',
    condition: (m) => true,
    options: [
      { text: 'Acelerar inversiones en Dakhla y el puerto atlántico', stats: { eco: +3, apr: +2, con: +4 }, cost: 500, loyaltyImpact: { PI: +10 }, news: 'El Gobierno acelera las inversiones en Dakhla y su puerto atlántico.' },
      { text: 'Ofensiva diplomática en busca de nuevos reconocimientos', stats: { con: +5, apr: +1 }, cost: 120, loyaltyImpact: { PI: +8 }, news: 'La diplomacia marroquí lanza una ofensiva para sumar nuevos reconocimientos sobre el Sáhara.' }
    ]
  },
  {
    id: 'HUELGA_SMIG',
    category: 'LABORAL',
    title: 'SALARIO MÍNIMO Y DIÁLOGO SOCIAL',
    desc: 'Los sindicatos amenazan con huelgas generales si no se actualizan los salarios ante la inflación.',
    condition: (m) => true,
    options: [
      { text: 'Subir el SMIG un 10 % y firmar el acuerdo social', stats: { apr: +6, est: +3, eco: -2 }, cost: 350, loyaltyImpact: { USFP: +15, PPS: +15, UC: -10, RNI: -5 }, news: 'Gobierno y sindicatos firman el acuerdo social con una subida del 10 % del SMIG.' },
      { text: 'Congelar salarios y dar incentivos fiscales a las empresas', stats: { eco: +3, apr: -6, est: -3 }, cost: 0, loyaltyImpact: { RNI: +10, UC: +10, USFP: -15 }, news: 'El Gobierno congela los salarios y premia a las empresas; los sindicatos amenazan con paros.' }
    ]
  },
  {
    id: 'CRISIS_SEQUIA_ESTRUCTURAL',
    category: 'AGUA',
    title: 'SEQUÍA ESTRUCTURAL',
    desc: 'Los embalses están al mínimo histórico. Hay que elegir entre priorizar el consumo humano o el campo exportador.',
    condition: (m) => true,
    options: [
      { text: 'Acelerar desaladoras y restringir cultivos de alto consumo', stats: { eco: +1, est: +3, apr: -1 }, cost: 500, loyaltyImpact: { MP: -10 }, news: 'El Gobierno acelera las desaladoras y restringe los cultivos que más agua consumen.' },
      { text: 'Priorizar la exportación agrícola con trasvases', stats: { eco: +3, est: -4, apr: -2 }, cost: 0, loyaltyImpact: { MP: +10, RNI: +5 }, news: 'El Gobierno prioriza la exportación agrícola con trasvases; protestas por el agua en el interior.' }
    ]
  },
  {
    id: 'CRISIS_CAJA_COMPENSACION',
    category: 'PRECIOS',
    title: 'REFORMA DE LA CAJA DE COMPENSACIÓN',
    desc: 'Los subsidios universales al butano y al pan pesan cada vez más en las cuentas públicas.',
    condition: (m) => true,
    options: [
      { text: 'Sustituirlos por ayuda directa a las familias', stats: { eco: +2, apr: -3, est: -2 }, cost: 300, loyaltyImpact: { RNI: +8, PPS: -8 }, news: 'El Gobierno sustituye los subsidios universales por ayudas directas a las familias.' },
      { text: 'Mantener los subsidios universales', stats: { apr: +4, est: +2, eco: -2 }, cost: 250, loyaltyImpact: { PPS: +8, USFP: +8 }, news: 'El Gobierno mantiene los subsidios al butano y al pan pese al coste para las arcas públicas.' }
    ]
  },
  {
    id: 'SPECIAL_MODERNIZACION_MILITAR',
    category: 'DEFENSA',
    title: 'MODERNIZACIÓN MILITAR',
    desc: 'Las FAR piden renovar drones y defensa antiaérea ante la carrera de armamentos regional.',
    condition: (m) => true,
    options: [
      { text: 'Comprar drones y sistemas antiaéreos en el exterior', stats: { mil: +7, con: +3, apr: -1 }, cost: 600, loyaltyImpact: {}, news: 'Marruecos adquiere drones y defensa antiaérea en el exterior para modernizar las FAR.' },
      { text: 'Producir en Marruecos con socios europeos', stats: { mil: +4, eco: +2 }, cost: 350, loyaltyImpact: {}, news: 'Marruecos fabricará material militar en su territorio junto a socios europeos.' }
    ]
  },
  {
    id: 'GEO_ADUANAS_CEUTA_MELILLA',
    category: 'ESPAÑA',
    title: 'ADUANAS DE CEUTA Y MELILLA',
    desc: 'Los comerciantes del norte piden normalizar el comercio fronterizo con las ciudades autónomas.',
    condition: (m) => true,
    options: [
      { text: 'Abrir aduanas comerciales para reactivar el comercio', stats: { eco: +2 }, cost: 0, loyaltyImpact: {}, news: 'Marruecos abre sus aduanas con Ceuta y Melilla y se reactiva el comercio fronterizo.' },
      { text: 'Mantenerlas cerradas como palanca de presión', stats: { apr: +1 }, cost: 0, loyaltyImpact: {}, news: 'Marruecos mantiene cerradas las aduanas con Ceuta y Melilla como palanca de presión sobre Madrid.' }
    ]
  },
  {
    id: 'REGULACION_REFORMA_FISCAL',
    category: 'FISCAL',
    title: 'REFORMA FISCAL',
    desc: 'El FMI y la oposición reclaman un nuevo reparto de la carga tributaria.',
    condition: (m) => true,
    options: [
      { text: 'Impuestos progresivos y a artículos de lujo', stats: { eco: -1, apr: +3, est: +1 }, cost: -400, loyaltyImpact: { USFP: +10, PPS: +10, UC: -10 }, news: 'El Gobierno aprueba impuestos progresivos y a los artículos de lujo y recauda 400 M€.' },
      { text: 'Bajar el impuesto de sociedades para atraer inversión', stats: { eco: +4, apr: -2 }, cost: 200, loyaltyImpact: { RNI: +10, UC: +10, USFP: -10 }, news: 'El Gobierno baja el impuesto de sociedades para atraer inversión extranjera.' }
    ]
  },
  {
    id: 'ESCANDALO_ENRIQUECIMIENTO_ILICITO',
    category: 'JUSTICIA',
    title: 'LEY CONTRA EL ENRIQUECIMIENTO ILÍCITO',
    desc: 'Un escándalo de contratos públicos reabre el debate sobre una ley anticorrupción.',
    condition: (m) => true,
    options: [
      { text: 'Aprobarla con una agencia independiente', stats: { apr: +6, est: +2, con: -1 }, cost: 0, loyaltyImpact: { PJD: +10, PPS: +10, RNI: -10, PAM: -10 }, news: 'El Gobierno aprueba la ley contra el enriquecimiento ilícito con una agencia independiente.' },
      { text: 'Archivar el proyecto', stats: { apr: -6, est: -2 }, cost: 0, loyaltyImpact: { RNI: +5, PAM: +5 }, news: 'El Gobierno archiva la ley anticorrupción y la oposición clama contra la impunidad.' }
    ]
  },
  {
    id: 'SPECIAL_GIGAFACTORIA_BATERIAS',
    category: 'INVERSIÓN',
    title: 'GIGAFACTORÍA DE BATERÍAS',
    desc: 'Un consorcio internacional quiere instalar una gran fábrica de baterías para coches eléctricos.',
    condition: (m) => true,
    options: [
      { text: 'Ofrecer incentivos generosos al consorcio asiático', stats: { eco: +5, apr: +2, con: +1 }, cost: 250, loyaltyImpact: {}, news: 'Un consorcio asiático levantará en Marruecos una gigafactoría de baterías con incentivos públicos.' },
      { text: 'Exigir contenido local y socios europeos', stats: { eco: +2, apr: +1 }, cost: 0, loyaltyImpact: {}, news: 'Rabat exige contenido local y socios europeos para la gigafactoría de baterías.' }
    ]
  },
  {
    id: 'TENSION_MIGRACION_SUBSAHARIANA',
    category: 'MIGRACIÓN',
    title: 'MIGRACIÓN SUBSAHARIANA',
    desc: 'Miles de migrantes viven sin papeles en las ciudades del norte y presionan hacia Europa.',
    condition: (m) => true,
    options: [
      { text: 'Regularizarlos con permisos de trabajo', stats: { eco: +1, apr: -3, est: +1 }, cost: 100, loyaltyImpact: { PJD: -10, PPS: +10 }, news: 'Marruecos regulariza a miles de migrantes subsaharianos con permisos de trabajo.' },
      { text: 'Endurecer controles y repatriaciones', stats: { apr: +2, est: +1, eco: -1 }, cost: 0, loyaltyImpact: { PJD: +5 }, news: 'Marruecos endurece los controles y acelera las repatriaciones de migrantes.' }
    ]
  },
  {
    id: 'REGULACION_REFORMA_ELECTORAL',
    category: 'POLÍTICA',
    title: 'REFORMA ELECTORAL',
    desc: 'Los grandes partidos quieren cambiar el cociente electoral; los pequeños temen desaparecer.',
    condition: (m) => true,
    options: [
      { text: 'Cambiar el cociente a favor de los grandes partidos', stats: { est: +3, apr: -2 }, cost: 0, loyaltyImpact: { RNI: +15, PAM: +15, PJD: -25, PPS: -15, USFP: -15 }, news: 'La Cámara aprueba un nuevo cociente electoral que favorece a los grandes partidos.' },
      { text: 'Mantener el cociente actual sobre inscritos', stats: { est: -1 }, cost: 0, loyaltyImpact: { PJD: +10, PPS: +10, USFP: +10, RNI: -8 }, news: 'El Gobierno mantiene el cociente actual y calma a los partidos pequeños.' }
    ]
  },
  {
    id: 'PROTESTAS_AMNISTIA_RIF',
    category: 'DERECHOS',
    title: 'AMNISTÍA PARA LAS PROTESTAS DEL RIF',
    desc: 'Se multiplican las peticiones de gracia para condenados por las protestas del norte.',
    condition: (m) => true,
    options: [
      { text: 'Pedir al Rey un indulto amplio', stats: { apr: +5, est: +3, con: -2 }, cost: 0, loyaltyImpact: { USFP: +10, PPS: +10, PJD: +10 }, news: 'El Gobierno pide al Rey un indulto amplio para los condenados por las protestas del Rif.' },
      { text: 'Mantener las condenas', stats: { apr: -3, con: +2 }, cost: 0, loyaltyImpact: {}, news: 'El Gobierno mantiene las condenas de las protestas del Rif y se enfría el diálogo con la región.' }
    ]
  },
  {
    id: 'SPECIAL_GASODUCTO_NIGERIA',
    category: 'ENERGÍA',
    title: 'GASODUCTO NIGERIA–MARRUECOS',
    desc: 'El proyecto energético africano necesita financiación para dar el salto.',
    condition: (m) => true,
    options: [
      { text: 'Financiación pública del tramo marroquí', stats: { eco: +4, apr: +1 }, cost: 700, loyaltyImpact: {}, news: 'El Estado financiará el tramo marroquí del gasoducto Nigeria–Marruecos.' },
      { text: 'Esperar a inversores privados del Golfo', stats: { eco: +1 }, cost: 0, loyaltyImpact: {}, news: 'El Gobierno espera a los inversores del Golfo para financiar el gasoducto africano.' }
    ]
  }
];


// =====================================================================
// 3. CAMPAIGN_HEADLINES — preguntas de campaña (CQ) y debate (cdeb)
//  · score = round(3 × impulso + Δaprobación original), acotado a -5…+15.
//  · El debate original era probabilístico: aquí se usa el valor esperado.
//  · El coste en M€ de las opciones originales no tiene campo aquí.
// =====================================================================
const CAMPAIGN_HEADLINES = [
  {
    id: 1,
    newspaper: 'HESPRESS',
    headline: 'POLÉMICA POR EL PRECIO DEL PAN',
    desc: 'La oposición te acusa de abandonar a las clases populares. ¿Cómo respondes?',
    options: [
      { text: 'Anunciar subsidios', score: +10, textResult: 'El anuncio calma a los barrios populares y te devuelve la iniciativa en campaña.' },
      { text: 'Culpar a la inflación mundial', score: -5, textResult: 'Suena a excusa: la oposición explota tu falta de respuestas.' }
    ]
  },
  {
    id: 2,
    newspaper: 'LE MATIN',
    headline: 'ESCÁNDALO EN UN MINISTERIO',
    desc: 'Un diario revela contratos dudosos en un departamento. ¿Cómo reaccionas?',
    options: [
      { text: 'Cesar al ministro y abrir investigación', score: +5, textResult: 'La rapidez de tu reacción limita el daño y proyecta imagen de firmeza.' },
      { text: 'Negarlo todo', score: -5, textResult: 'Nuevas filtraciones desmienten tu versión y el escándalo se agranda.' }
    ]
  },
  {
    id: 3,
    newspaper: 'AKHBAR AL YAOUM',
    headline: 'HUELGA DE DOCENTES',
    desc: 'Los sindicatos paralizan las escuelas en plena campaña. ¿Qué haces?',
    options: [
      { text: 'Aceptar subida salarial', score: +10, textResult: 'Los docentes vuelven a las aulas y tú sales como el Gobierno que escucha.' },
      { text: 'Mantener la línea dura', score: -5, textResult: 'El conflicto se alarga y las familias te responsabilizan del caos escolar.' }
    ]
  },
  {
    id: 4,
    newspaper: 'TELQUEL',
    headline: 'ENTREVISTA DE LA OPOSICIÓN',
    desc: 'Tu rival arrasa en la televisión nacional. ¿Cómo contraatacas?',
    options: [
      { text: 'Contraprogramar con un gran acto', score: +6, textResult: 'El mitin llena la plaza y desvía la atención de la entrevista de tu rival.' },
      { text: 'Ignorarlo', score: -5, textResult: 'La entrevista domina el debate público durante días sin respuesta tuya.' }
    ]
  },
  {
    id: 5,
    newspaper: 'LE360',
    headline: 'APOYO DE UN LÍDER RELIGIOSO',
    desc: 'Un influyente personaje te ofrece su respaldo público. ¿Lo aceptas?',
    options: [
      { text: 'Aceptar el apoyo', score: +10, textResult: 'El respaldo te abre puertas en el electorado más conservador.' },
      { text: 'Rechazarlo por prudencia', score: 0, textResult: 'Evitas polémicas, pero renuncias a un impulso electoral valioso.' }
    ]
  },
  {
    id: 6,
    newspaper: 'LE MATIN',
    headline: 'ENCUESTA FILTRADA',
    desc: 'Un sondeo interno te da por perdedor. ¿Cómo lo gestionas?',
    options: [
      { text: 'Desmentirlo con datos', score: +3, textResult: 'Tus cifras frenan el rumor, aunque no logran movilizar a tus votantes.' },
      { text: 'Pedir el voto útil', score: +5, textResult: 'El llamamiento al voto útil moviliza a tu electorado, pero alimenta el relato de debilidad.' }
    ]
  },
  {
    id: 7,
    newspaper: 'TELQUEL',
    headline: 'DEBATE CARA A CARA',
    desc: 'Millones de espectadores siguen el debate decisivo. ¿Qué estrategia eliges?',
    options: [
      { text: 'Agresivo: ir a la yugular', score: -1, textResult: 'El tono duro genera titulares, pero divide al público y el resultado es incierto.' },
      { text: 'Presidencial: balance de gestión', score: +4, textResult: 'Proyectas solvencia y los sondeos instantáneos te dan una ligera ventaja.' },
      { text: 'Cercano: hablar de lo cotidiano', score: +3, textResult: 'Conectas con los problemas del día a día y ganas simpatía entre los indecisos.' }
    ]
  }
];


// =====================================================================
// 4. PRESS_NEWS_BANK — sucesos «Última hora» de la pestaña Prensa (EVS)
//    «Protestas juveniles» está en HOUSING_EVENTS.
// =====================================================================
const PRESS_NEWS_BANK = [
  {
    id: 'NEWS_1',
    newspaper: 'HESPRESS',
    headline: 'SEQUÍA Y MALAS COSECHAS',
    desc: 'Seis años de sequía hunden el campo y el pan se encarece.',
    options: [
      { text: 'Importar cereal y subsidiar el pan', stats: { apr: +4, eco: -1 }, cost: 400, news: 'El Gobierno importa cereal y subsidia el pan para contener los precios.' },
      { text: 'Racionar el agua y dejar que ajuste el mercado', stats: { apr: -6, est: -3, eco: +1 }, news: 'El Gobierno raciona el agua y deja que el mercado ajuste: crece el malestar rural.' }
    ]
  },
  {
    id: 'NEWS_2',
    newspaper: 'LE MATIN',
    headline: 'BOOM DE LOS FOSFATOS',
    desc: 'El precio mundial de los fosfatos se dispara.',
    options: [
      { text: 'Contrato preferente con España (+500 M€)', stats: { eco: +2 }, cost: -500, news: 'OCP firma un contrato preferente con España y la relación bilateral sale reforzada.' },
      { text: 'Vender al mejor postor (+800 M€)', stats: { eco: +3 }, cost: -800, news: 'OCP vende al mejor postor y Madrid recibe con frialdad la decisión.' }
    ]
  },
  {
    id: 'NEWS_3',
    newspaper: 'TELQUEL',
    headline: 'PRESIÓN MIGRATORIA EN CEUTA Y MELILLA',
    desc: 'Cientos de personas se concentran junto a la valla.',
    options: [
      { text: 'Reforzar la contención', stats: {}, cost: 200, news: 'Marruecos refuerza la contención en la valla y Madrid agradece la colaboración.' },
      { text: 'Relajar controles para presionar a Madrid', stats: { apr: +3 }, news: 'Marruecos relaja los controles fronterizos y tensa la relación con Madrid.' }
    ]
  },
  {
    id: 'NEWS_4',
    newspaper: 'AKHBAR AL YAOUM',
    headline: 'TERREMOTO EN EL ATLAS',
    desc: 'Un seísmo devasta varias provincias de montaña.',
    options: [
      { text: 'Pedir ayuda urgente a España (+1.000 M€)', stats: { apr: +3 }, cost: -1000, news: 'España envía ayuda urgente a las provincias del Atlas devastadas por el terremoto.' },
      { text: 'Gestionarlo en solitario', stats: { apr: -2, est: -2 }, cost: 700, news: 'El Gobierno afronta en solitario la reconstrucción del Atlas, con críticas por la lentitud.' }
    ]
  }
];


// =====================================================================
// 5. MINISTRY_DECISIONS_BANK
//  · Decisiones tomadas de pais-marruecos.js (secciones y decretos) y de
//    marruecos.js (POL y programas militares PROGS).
//  · Defensa: Δmil = (suma de efectos sobre tierra/mar/aire) / 3.
//  · Decretos reales del Reino (LF 2026, Generación Verde, AMO, Mundial 2030…).
// =====================================================================
const MINISTRY_DECISIONS_BANK = {
  sanidad: [
    { title: 'Generalización de la AMO a toda la población (protección social)', cost: 400, stats: { apr: +5, est: +2 } },
    { title: 'Grupos Sanitarios Territoriales: reforma hospitalaria regional', cost: 300, stats: { apr: +2, est: +1, eco: +1 } },
    { title: 'Plan de choque hospitalario tras las protestas de Agadir', cost: 200, stats: { apr: +4, est: +2 } },
    { title: 'Contratación de médicos y enfermeros (27.000 plazas sociales)', cost: 300, stats: { emp: +2, apr: +2 } },
    { title: 'Nuevos CHU en Agadir, Guelmim y Laâyoune', cost: 350, stats: { apr: +3, est: +1 } },
    { title: 'Industria nacional de medicamentos y vacunas', cost: 250, stats: { eco: +2, est: +1 } }
  ],
  educacion: [
    { title: 'Hoja de ruta 2022-2026: Escuelas Pioneras', cost: 300, stats: { apr: +2, eco: +1 } },
    { title: 'Nuevo estatuto del profesorado', cost: 350, stats: { apr: +1, est: +2, emp: +1 } },
    { title: 'Generalización de la educación preescolar', cost: 250, stats: { apr: +2, emp: +1 } },
    { title: 'Becas universitarias y residencias estudiantiles', cost: 200, stats: { apr: +3, est: +1 } },
    { title: 'Transporte escolar y comedores en el medio rural', cost: 150, stats: { apr: +2, est: +1 } },
    { title: 'Institutos de Alto Rendimiento (Cités d\'Excellence)', cost: 200, stats: { eco: +2, apr: +1 } }
  ],
  infraestructuras: [
    { title: 'Extensión de la alta velocidad Kenitra–Marrakech (Al Boraq)', cost: 500, stats: { eco: +4, apr: +2 } },
    { title: 'Estadios y trenes del Mundial 2030 (con España y Portugal)', cost: 600, stats: { apr: +4, eco: +3, est: -1 } },
    { title: 'Puerto Atlántico de Dakhla', cost: 450, stats: { eco: +3, est: +1 } },
    { title: 'Puerto Nador West Med', cost: 300, stats: { eco: +3 } },
    { title: 'Autopista del Agua: transferencia Sebú–Bou Regreg', cost: 400, stats: { eco: +2, est: +2 } },
    { title: 'Autovía Tiznit–Dakhla y carreteras rurales', cost: 350, stats: { eco: +2, apr: +2 } }
  ],
  interior: [
    { title: 'Refuerzo de la DGSN y la Gendarmería Real', cost: 200, stats: { est: +3, apr: -1 } },
    { title: 'Vigilancia de fronteras y lucha contra la migración irregular', cost: 150, stats: { est: +2, apr: -2 } },
    { title: 'Regionalización avanzada: más competencias a las 12 regiones', cost: 120, stats: { est: +2, apr: +1 } },
    { title: 'Registro Social Unificado y carné nacional electrónico', cost: 150, stats: { eco: +1, est: +1 } },
    { title: 'Reforma electoral: listas regionales y censo digital', cost: 60, stats: { est: +2, apr: +1 } }
  ],
  defensa: [
    { title: 'Servicio militar obligatorio (12 meses)', cost: 100, stats: { mil: +3, apr: -3, est: +1 } },
    { title: 'Caza F-16 Block 70/72 y modernización de la Real Fuerza Aérea', cost: 500, stats: { mil: +3 } },
    { title: 'Helicópteros de ataque AH-64 Apache', cost: 350, stats: { mil: +2 } },
    { title: 'Artillería de precisión HIMARS y carros modernizados', cost: 300, stats: { mil: +2 } },
    { title: 'Drones de combate y defensa antiaérea (Barak MX, Stinger)', cost: 350, stats: { mil: +2, est: +1 } },
    { title: 'Fragatas FREMM y Sigma para la Marina Real', cost: 450, stats: { mil: +3, est: +1 } },
    { title: 'Ciberdefensa e inteligencia (DGED y DGSE)', cost: 200, stats: { mil: +2, est: +1 } },
    { title: 'Polo industrial de defensa en Berrechid (Tata, Embraer)', cost: 400, stats: { mil: +2, eco: +2 } },
    { title: 'Ejercicio African Lion con EE. UU.', cost: 100, stats: { mil: +2 } },
    { title: 'Despliegue de las FAR en el Muro Sur del Sáhara', cost: 150, stats: { mil: +1, est: +1 } }
  ],
  economia: [
    { title: 'Ayuda Social Directa a las familias vulnerables', cost: 400, stats: { apr: +4, est: +2 } },
    { title: 'Fondo Mohammed VI para la inversión y Carta de Inversión', cost: 300, stats: { eco: +3, emp: +2 } },
    { title: 'Reforma gradual de la Caja de Compensación (gas butano)', cost: -200, stats: { eco: +3, apr: -4, est: -1 } },
    { title: 'Reforma fiscal: impuesto de sociedades al 20 % y IRPF más bajo', cost: 150, stats: { eco: +2, apr: +2 } },
    { title: 'Subvención al butano, harina y azúcar', cost: 300, stats: { apr: +3, est: +2 } },
    { title: 'Emisión de bonos soberanos en mercados internacionales', cost: -300, stats: { eco: -1, con: -1 } },
    { title: 'Plan Marruecos Digital 2030', cost: 200, stats: { eco: +3, emp: +2 } }
  ],
  vivienda: [
    { title: 'Programa Ciudades Sin Chabolas', cost: 300, stats: { apr: +3, est: +2 } },
    { title: 'Ayuda directa a la vivienda para la clase media', cost: 250, stats: { apr: +4, emp: +1 } },
    { title: 'Reconstrucción del Alto Atlas tras el terremoto de Al Hauz', cost: 350, stats: { apr: +4, est: +2 } },
    { title: 'Vivienda social en el eje Casablanca–Rabat', cost: 300, stats: { apr: +3, emp: +2 } }
  ],
  territorio: [
    { title: 'Generación Verde 2020-2030: apoyo a la clase media rural', cost: 300, stats: { apr: +3, eco: +2 } },
    { title: 'Plan de reconstitución de la cabaña ganadera tras la sequía', cost: 250, stats: { apr: +3, est: +2 } },
    { title: 'Riego por goteo y ahorro de agua agrícola', cost: 300, stats: { eco: +2, est: +1 } },
    { title: 'Acuerdo de pesca con la UE (renovación)', cost: -50, stats: { eco: +1, est: -1 } },
    { title: 'Cumbre con la oposición', cost: 0, stats: { est: +2, apr: +1 } },
    { title: 'Ronda de contactos con el Istiqlal', cost: 100, stats: { est: +1 } },
    { title: 'Pacto con el grupo UC–MDS', cost: 80, stats: { est: +1 } }
  ],
  trabajo: [
    { title: 'Programa Forsa y Intelaka: crédito y empleo para jóvenes', cost: 250, stats: { emp: +4, apr: +2, est: +1 } },
    { title: 'Subida del SMIG y diálogo social con los sindicatos', cost: 300, stats: { est: +3, apr: +2, eco: -1 } },
    { title: 'Reforma de las pensiones (CMR y RCAR)', cost: 250, stats: { est: +1, apr: -3, eco: +2 } },
    { title: 'Ley orgánica de huelga', cost: 0, stats: { est: +3, apr: -3 } },
    { title: 'Programa Awrach de obras públicas temporales', cost: 200, stats: { emp: +3, apr: +2 } }
  ],
  justicia: [
    { title: 'Reforma del Código Penal y de procedimiento', cost: 80, stats: { est: +2, apr: +1 } },
    { title: 'Digitalización de los tribunales', cost: 120, stats: { est: +1, eco: +1 } },
    { title: 'Ley contra el enriquecimiento ilícito', cost: 0, stats: { apr: +3, est: -1 } },
    { title: 'Reforma de la ley de partidos', cost: 0, stats: { est: +2 } }
  ],
  exteriores: [
    { title: 'Ofensiva diplomática por el Plan de Autonomía del Sáhara', cost: 100, stats: { apr: +3, est: +2 } },
    { title: 'Cooperación Sur-Sur con la Unión Africana', cost: 150, stats: { eco: +2, apr: +1 } },
    { title: 'Cooperación de seguridad con Israel (Acuerdos de Abraham)', cost: 80, stats: { mil: +2, est: -2, apr: -2 } },
    { title: 'Iniciativa Atlántica para los países del Sahel', cost: 120, stats: { eco: +2, est: +1 } },
    { title: 'Acuerdo migratorio y de seguridad con la UE', cost: -150, stats: { est: +1, apr: -1 } }
  ],
  transicion_ecologica: [
    { title: 'Complejo solar Noor Uarzazate: nueva fase', cost: 450, stats: { eco: +3, apr: +1 } },
    { title: 'Oferta Marruecos de hidrógeno verde', cost: 400, stats: { eco: +4 } },
    { title: 'Gasoducto Nigeria–Marruecos', cost: 500, stats: { eco: +3, est: +1 } },
    { title: 'Interconexión eléctrica con España, Portugal y Reino Unido', cost: 400, stats: { eco: +3 } },
    { title: 'Desaladoras de Casablanca y Dajla', cost: 450, stats: { eco: +2, est: +2 } },
    { title: 'Programa Nacional de Agua Potable y Riego 2020-2027', cost: 350, stats: { est: +3, eco: +2 } },
    { title: 'Reserva de emergencia contra la sequía', cost: 250, stats: { est: +3, apr: +2 } }
  ],
  cultura: [
    { title: 'Campaña de comunicación del Gobierno', cost: 60, stats: { apr: +3 } },
    { title: 'Diálogo con la juventud (GenZ 212)', cost: 0, stats: { apr: +4, est: +2 } },
    { title: 'Año Nuevo Amazigh (Yennayer) como fiesta oficial', cost: 40, stats: { apr: +2, est: +1 } },
    { title: 'Fondo de apoyo a la industria audiovisual y festivales', cost: 100, stats: { apr: +1, eco: +1 } }
  ],
  igualdad: [
    { title: 'Reforma de la Moudawana (Código de Familia)', cost: 0, stats: { apr: +3, est: -2 } },
    { title: 'Programa de apoyo a viudas y familias monoparentales', cost: 150, stats: { apr: +3, est: +1 } },
    { title: 'Ley de lucha contra la violencia de género', cost: 50, stats: { apr: +2, est: +1 } }
  ]
};


// =====================================================================
// 6. HOUSING_EVENTS — protestas sociales
// =====================================================================
const HOUSING_EVENTS = [
  {
    id: 'HOUS_1',
    category: 'PROTESTAS SOCIALES',
    title: 'ESTADIOS FRENTE A HOSPITALES Y ESCUELAS',
    desc: 'Los jóvenes protestan: piden que el dinero de las grandes obras deportivas se destine a sanidad y educación.',
    options: [
      { text: 'Reorientar fondos a hospitales y escuelas', stats: { apr: +8, est: +4, eco: -1 }, cost: 600, loyaltyImpact: { USFP: +10, PPS: +10, RNI: -8 }, news: 'El Gobierno reorienta fondos de las obras del Mundial a hospitales y escuelas tras las protestas.' },
      { text: 'Mantener el calendario de obras del Mundial 2030', stats: { apr: -7, est: -4, eco: +3 }, cost: 0, loyaltyImpact: { RNI: +8, PI: +5 }, news: 'El Gobierno mantiene el calendario del Mundial 2030 y las protestas juveniles se endurecen.' }
    ]
  },
  {
    id: 'HOUS_2',
    category: 'PROTESTAS SOCIALES',
    title: 'PROTESTAS JUVENILES',
    desc: 'Miles de jóvenes salen a la calle exigiendo sanidad, educación y empleo.',
    options: [
      { text: 'Abrir diálogo y reformas', stats: { apr: +6, est: +4 }, cost: 300, loyaltyImpact: {}, news: 'El Gobierno abre un diálogo con los jóvenes y anuncia reformas en sanidad, educación y empleo.' },
      { text: 'Mano dura y detenciones', stats: { est: -2, apr: -7, mil: +2 }, cost: 0, loyaltyImpact: {}, news: 'Las fuerzas del orden disuelven las protestas con detenciones y crece la indignación.' }
    ]
  }
];


// =====================================================================
// 7. REAL_MINISTERS
//  · El efecto «Palacio» de los ministros originales se ha omitido.
//  · Sin candidatos para: trabajo, vivienda, igualdad.
// =====================================================================
const REAL_MINISTERS = [
  // --- ECONOMÍA ---
  {
    id: 'fettah_rni', name: 'Nadia Fettah Alaoui', party: 'RNI', portfolio: 'economia',
    desc: '+1.5% Economía',
    pros: '+1.5% Economía',
    cons: '-1.0% Aprobación (ajustes impopulares)',
    effects: { eco: 1.5, apr: -1.0 }
  },
  {
    id: 'mezzour_pi', name: 'Ryad Mezzour', party: 'PI', portfolio: 'economia',
    desc: '+2.0% Economía (automoción y aeronáutica)',
    pros: '+2.0% Economía (automoción y aeronáutica)',
    cons: '-0.5% Aprobación',
    effects: { eco: 2.0, apr: -0.5 }
  },
  // --- INTERIOR ---
  {
    id: 'laftit_otr', name: 'Abdelouafi Laftit', party: 'OTR', portfolio: 'interior',
    desc: '+2.0% Estabilidad',
    pros: '+2.0% Estabilidad',
    cons: '-1.0% Aprobación (mano dura)',
    effects: { est: 2.0, apr: -1.0 }
  },
  // --- DEFENSA ---
  {
    id: 'loudiyi_otr', name: 'Abdellatif Loudiyi', party: 'OTR', portfolio: 'defensa',
    desc: '+2.0% Lealtad militar',
    pros: '+2.0% Lealtad militar',
    cons: 'Sin control parlamentario',
    effects: { mil: 2.0 }
  },
  // --- EXTERIORES ---
  {
    id: 'bourita_otr', name: 'Nasser Bourita', party: 'OTR', portfolio: 'exteriores',
    desc: '+0.5% Economía',
    pros: '+0.5% Economía',
    cons: 'Diplomacia opaca para la coalición',
    effects: { eco: 0.5 }
  },
  // --- JUSTICIA ---
  {
    id: 'ouahbi_pam', name: 'Abdellatif Ouahbi', party: 'PAM', portfolio: 'justicia',
    desc: '+1.0% Estabilidad',
    pros: '+1.0% Estabilidad',
    cons: '-1.0% Aprobación (polémicas constantes)',
    effects: { est: 1.0, apr: -1.0 }
  },
  // --- EDUCACIÓN ---
  {
    id: 'berrada_rni', name: 'Mohamed Saad Berrada', party: 'RNI', portfolio: 'educacion',
    desc: '+1.0% Aprobación (reforma escolar)',
    pros: '+1.0% Aprobación (reforma escolar)',
    cons: '-0.5% Estabilidad (huelgas docentes)',
    effects: { apr: 1.0, est: -0.5 }
  },
  // --- SANIDAD ---
  {
    id: 'aittaleb_rni', name: 'Khalid Aït Taleb', party: 'RNI', portfolio: 'sanidad',
    desc: '+1.5% Aprobación (red hospitalaria)',
    pros: '+1.5% Aprobación (red hospitalaria)',
    cons: '-0.5% Economía (coste del sistema)',
    effects: { apr: 1.5, eco: -0.5 }
  },
  // --- TERRITORIO (Agricultura, Pesca y Desarrollo Rural) ---
  {
    id: 'sadiki_rni', name: 'Mohammed Sadiki', party: 'RNI', portfolio: 'territorio',
    desc: '+1.0% Economía, +0.5% Estabilidad',
    pros: '+1.0% Economía, +0.5% Estabilidad',
    cons: '-0.5% Aprobación (sequía)',
    effects: { eco: 1.0, est: 0.5, apr: -0.5 }
  },
  // --- TRANSICIÓN ECOLÓGICA (Equipamiento y Agua · Transición Energética) ---
  {
    id: 'baraka_pi', name: 'Nizar Baraka', party: 'PI', portfolio: 'transicion_ecologica',
    desc: '+1.5% Economía (obra pública)',
    pros: '+1.5% Economía (obra pública)',
    cons: 'Peso propio del Istiqlal en el Gobierno',
    effects: { eco: 1.5 }
  },
  {
    id: 'benali_otr', name: 'Leila Benali', party: 'OTR', portfolio: 'transicion_ecologica',
    desc: '+1.5% Economía, +0.5% Estabilidad',
    pros: '+1.5% Economía, +0.5% Estabilidad',
    cons: '-0.5% Aprobación',
    effects: { eco: 1.5, est: 0.5, apr: -0.5 }
  },
  // --- CULTURA (Juventud, Cultura y Comunicación · Habices y Asuntos Islámicos) ---
  {
    id: 'bensaid_pam', name: 'Mehdi Bensaid', party: 'PAM', portfolio: 'cultura',
    desc: '+1.0% Aprobación (juventud)',
    pros: '+1.0% Aprobación (juventud)',
    cons: '-0.5% Estabilidad',
    effects: { apr: 1.0, est: -0.5 }
  },
  {
    id: 'toufiq_otr', name: 'Ahmed Toufiq', party: 'OTR', portfolio: 'cultura',
    desc: '+1.0% Estabilidad',
    pros: '+1.0% Estabilidad',
    cons: 'Poco margen para reformas',
    effects: { est: 1.0 }
  }
];


// =====================================================================
// 8. GOAL_POOL
//  · «Deuda Bajo Control» (deuda ≤ 60 % del PIB) omitida: no hay
//    equivalente en el estado de la plantilla.
//  · «Confianza del Palacio» usa la métrica `con`.
// =====================================================================
const GOAL_POOL = [
  { id: 'eco',     icon: 'fa-chart-line',     title: 'Milagro Económico',           desc: 'Mantén la Economía ≥ 70%',             check: s => s.metrics.eco >= 70 },
  { id: 'est',     icon: 'fa-shield-halved',  title: 'Paz Social',                  desc: 'Mantén la Estabilidad ≥ 65%',          check: s => s.metrics.est >= 65 },
  { id: 'apr',     icon: 'fa-heart',          title: 'Jefe de Gobierno Querido',    desc: 'Mantén la Aprobación ≥ 65%',           check: s => s.metrics.apr >= 65 },
  { id: 'emp',     icon: 'fa-briefcase',      title: 'Pleno Empleo',                desc: 'Mantén el Empleo ≥ 70%',               check: s => s.metrics.emp >= 70 },
  { id: 'mil',     icon: 'fa-person-military-pointing', title: 'Cuarteles en Calma', desc: 'Mantén la fuerza de las FAR ≥ 60%',   check: s => s.metrics.mil >= 60 },
  { id: 'caja',    icon: 'fa-vault',          title: 'Superávit',                   desc: 'Acumula una tesorería ≥ 15.000 M€',    check: s => (Number(s.treasury) || 0) >= 15000 },
  { id: 'palacio', icon: 'fa-crown',          title: 'Confianza del Palacio',       desc: 'Confianza del Palacio ≥ 75%',          check: s => s.metrics.con >= 75 },
  { id: 'doble',   icon: 'fa-scale-balanced', title: 'Doble Confianza',             desc: 'Aprobación ≥ 60% y Estabilidad ≥ 60%', check: s => s.metrics.apr >= 60 && s.metrics.est >= 60 },
  { id: 'todo',    icon: 'fa-star',           title: 'Marruecos Equilibrado',       desc: 'Todas las métricas ≥ 55%',             check: s => Object.values(s.metrics).every(v => v >= 55) }
];


// =====================================================================
// 9. GOAL_ACTIONS
//  · Las 7 acciones de gobierno originales + las acciones de ingreso de
//    las secciones Tesorería y Finanzas (cost 0 + gain). Su efecto sobre
//    la deuda (debt) se ha omitido.
//  · La recompensa de misión (goalReward: 10 cap, 300 M€) no tiene campo.
// =====================================================================
const GOAL_ACTIONS = [
  { id: 'tv',        icon: 'fa-tv',                  title: 'Comparecencia televisada',                 cap: 15, cost: 0,   cd: 30,  fx: { apr: 6, est: 2 },         news: 'El Jefe de Gobierno comparece en prime time y remonta en las encuestas.' },
  { id: 'ue',        icon: 'fa-earth-europe',        title: 'Cumbre en Bruselas',                       cap: 20, cost: 0,   cd: 45,  fx: { eco: 6, apr: 2 },         news: 'Bruselas desbloquea fondos y elogia las reformas del Gobierno.' },
  { id: 'pacto',     icon: 'fa-handshake',           title: 'Pacto social y político',                  cap: 25, cost: 0,   cd: 60,  fx: { est: 6, apr: 3 },         news: 'Gobierno, sindicatos y oposición firman un pacto histórico.' },
  { id: 'empleo',    icon: 'fa-hammer',              title: 'Plan de choque del empleo',                cap: 10, cost: 300, cd: 40,  fx: { emp: 8, eco: 3 },         news: 'El Gobierno lanza un plan de choque con 300 M€ contra el paro.' },
  { id: 'army',      icon: 'fa-medal',               title: 'Reforma de las FAR',                       cap: 15, cost: 250, cd: 50,  fx: { mil: 8, apr: -3 },        news: 'Se modernizan las Fuerzas Armadas Reales; el Ejército responde con lealtad.' },
  { id: 'ahorro',    icon: 'fa-piggy-bank',          title: 'Recorte del gasto público',                cap: 0,  cost: 0,   cd: 60,  fx: { apr: -5, est: -2 }, gain: 600,  news: 'Austeridad: el Gobierno recorta gasto y ahorra 600 M€, a costa de la calle.' },
  { id: 'trono',     icon: 'fa-crown',               title: 'Audiencia con el Rey y Discurso del Trono', cap: 12, cost: 0,  cd: 90,  fx: { con: 8, apr: 2 },         news: 'El Rey recibe al Jefe de Gobierno y respalda su hoja de ruta.' },
  { id: 'privatizar', icon: 'fa-building-columns',   title: 'Privatizar participaciones públicas',      cap: 3,  cost: 0,   cd: 120, fx: { apr: -3, eco: 1, con: -1 }, gain: 900,  news: 'El Gobierno vende participaciones de empresas públicas e ingresa 900 M€.' },
  { id: 'amnistia',  icon: 'fa-file-invoice-dollar', title: 'Amnistía fiscal parcial',                  cap: 2,  cost: 0,   cd: 90,  fx: { apr: -2, est: -1 },       gain: 500,  news: 'Una amnistía fiscal parcial hace aflorar capitales y llena las arcas con 500 M€.' },
  { id: 'iva',       icon: 'fa-receipt',             title: 'Cobrar el IVA de forma más estricta',      cap: 2,  cost: 0,   cd: 60,  fx: { apr: -2, eco: -1 },       gain: 350,  news: 'Hacienda refuerza la recaudación del IVA y suma 350 M€.' },
  { id: 'ocp',       icon: 'fa-industry',            title: 'Dividendos de OCP (fosfatos)',             cap: 2,  cost: 0,   cd: 120, fx: { eco: 1, apr: -1 },        gain: 400,  news: 'El Estado exige a OCP un dividendo extraordinario de 400 M€.' },
  { id: 'mre',       icon: 'fa-plane-arrival',       title: 'Remesas de los MRE: plan de atracción',    cap: 3,  cost: 0,   cd: 90,  fx: { eco: 1, con: 1 },         gain: 250,  news: 'Un plan de incentivos atrae 250 M€ de remesas de los marroquíes del exterior.' },
  { id: 'fmi',       icon: 'fa-hand-holding-dollar', title: 'Préstamo del FMI (línea de precaución y liquidez)', cap: 4, cost: 0, cd: 150, fx: { apr: -3, con: -1 }, gain: 1500, news: 'El FMI concede a Marruecos una línea de liquidez de 1.500 M€, con condiciones.' },
  { id: 'reffiscal', icon: 'fa-scale-unbalanced',    title: 'Reforma fiscal (Ley marco 69-19)',         cap: 4,  cost: 0,   cd: 150, fx: { apr: -2, eco: 1 },        gain: 300,  news: 'La reforma fiscal ensancha la base tributaria y recauda 300 M€ más.' }
];


// =====================================================================
// 10. FOCUS_TREE
//  · Se omiten los efectos ES / rel del foco d2.
// =====================================================================
const FOCUS_TREE = [
  { id: 'e1', b: 'eco', title: 'Reforma fiscal (Ley marco 69-19)',           days: 365, now: { eco: 4 },            spirit: { name: 'Hacienda Eficiente',           daily: {},                     money: 120 } },
  { id: 'e2', b: 'eco', title: 'Plan de Aceleración Industrial',             days: 420, req: 'e1', now: { emp: 3 },  spirit: { name: 'Polos Industriales',           daily: { eco: .05, emp: .04 }, money: 0 } },
  { id: 'e3', b: 'eco', title: 'Fondos europeos y del Golfo',                days: 480, req: 'e2', now: { apr: 2 }, cash: 1500, spirit: null },
  { id: 'e4', b: 'eco', title: 'Marca «Maroc»',                              days: 540, req: 'e3', now: {},         spirit: { name: 'Marca Marruecos',              daily: { eco: .06, apr: .03 }, money: 150 } },
  { id: 's1', b: 'soc', title: 'Protección social generalizada',             days: 365, now: { apr: 3 },            spirit: { name: 'Cobertura Universal',          daily: { est: .03 },           money: -80 } },
  { id: 's2', b: 'soc', title: 'Pacto educativo',                            days: 420, req: 's1', now: {},         spirit: { name: 'Capital Humano',               daily: { emp: .04, eco: .02 }, money: -60 } },
  { id: 's3', b: 'soc', title: 'Vivienda y ciudades nuevas',                 days: 480, req: 's2', now: { apr: 4 }, spirit: { name: 'Acceso a la Vivienda',         daily: { apr: .05 },           money: -70 } },
  { id: 's4', b: 'soc', title: 'Estado Social',                              days: 540, req: 's3', now: { est: 4 }, spirit: { name: 'Bienestar Social',             daily: { est: .05, apr: .04 }, money: -110 } },
  { id: 'g1', b: 'seg', title: 'Modernización policial (DGSN)',              days: 365, now: { est: 4 },            spirit: { name: 'Policía Moderna',              daily: { est: .03 },           money: -50 } },
  { id: 'g2', b: 'seg', title: 'Ciberseguridad nacional',                    days: 420, req: 'g1', now: {},         spirit: { name: 'Escudo Digital',               daily: { est: .03, eco: .02 }, money: -50 } },
  { id: 'g3', b: 'seg', title: 'FAR profesionales',                          days: 480, req: 'g2', now: { mil: 6 }, spirit: { name: 'Tropa Profesional',            daily: { mil: .05 },           money: -90 } },
  { id: 'g4', b: 'seg', title: 'Pacto de defensa con EE. UU. (African Lion)', days: 540, req: 'g3', now: { mil: 4 }, spirit: { name: 'Socio Estratégico de EE. UU.', daily: { mil: .04, est: .03 }, money: -100 } },
  { id: 'd1', b: 'dip', title: 'Diplomacia africana',                        days: 365, now: { apr: 2 },            spirit: { name: 'Voz en África',                daily: { apr: .03 },           money: 0 } },
  { id: 'd2', b: 'dip', title: 'Eje con Bruselas y Madrid',                  days: 420, req: 'd1', now: {}, cash: 1000, spirit: { name: 'Socio Fiable',               daily: { eco: .04 },           money: 0 } },
  { id: 'd3', b: 'dip', title: 'Asociación con EE. UU. y el Golfo',          days: 480, req: 'd2', now: { est: 3, mil: 3 }, spirit: null },
  { id: 'd4', b: 'dip', title: 'Iniciativa Atlántica y liderazgo africano',  days: 540, req: 'd3', now: {},         spirit: { name: 'Potencia Regional',            daily: { apr: .05, eco: .04 }, money: 100 } }
];


// =====================================================================
// 11. FOCUS_LINKS
// =====================================================================
const FOCUS_LINKS = [
  { t: 'Economía hundida destruye empleo',   on: s => s.eco < 40, fx: { emp: -.08 } },
  { t: 'Economía fuerte crea empleo',        on: s => s.eco > 65, fx: { emp: .04 } },
  { t: 'Paro alto erosiona la aprobación',   on: s => s.emp < 40, fx: { apr: -.08, est: -.04 } },
  { t: 'Pleno empleo mejora la aprobación',  on: s => s.emp > 65, fx: { apr: .04 } },
  { t: 'Inestabilidad frena la economía',    on: s => s.est < 40, fx: { eco: -.06 } },
  { t: 'Impopularidad alimenta el malestar', on: s => s.apr < 35, fx: { est: -.05 } },
  { t: 'Ejército descontento desestabiliza', on: s => s.mil < 30, fx: { est: -.04 } },
  { t: 'Estabilidad alta atrae inversión',   on: s => s.est > 70, fx: { eco: .03 } }
];


// =====================================================================
// 12. SHOCK_POOL
//  · Efectos sobre `debt` omitidos (prima de riesgo).
// =====================================================================
const SHOCK_POOL = [
  { cat: 'EMERGENCIAS', min: 'interior', title: 'INCENDIOS FORESTALES EN EL RIF', desc: 'Varias provincias del norte arden a la vez y piden ayuda urgente al Estado.',
    options: [
      { text: 'Desplegar medios extraordinarios', cost: 250, stats: { est: 3, apr: 2 },  news: 'El Estado despliega medios extraordinarios y controla los incendios del Rif.' },
      { text: 'Dejar que actúen las provincias',  cost: 0,   stats: { est: -4, apr: -5 }, news: 'Las provincias del norte quedan solas ante las llamas y crece la indignación.' }
    ] },
  { cat: 'LABORAL', min: 'trabajo', title: 'HUELGA GENERAL', desc: 'Los sindicatos convocan un paro nacional contra la política laboral.',
    options: [
      { text: 'Abrir mesa de negociación', cost: 100, stats: { emp: 3, apr: 2, eco: -2 },  news: 'El Gobierno abre una mesa de negociación y se desconvoca el paro general.' },
      { text: 'Mantener la postura',       cost: 0,   stats: { est: -5, apr: -6, eco: -3 }, news: 'El paro general paraliza el país mientras el Gobierno mantiene su postura.' }
    ] },
  { cat: 'CORRUPCIÓN', min: 'justicia', title: 'ESCÁNDALO DE CORRUPCIÓN', desc: 'Un informe de la Cour des comptes señala a un alto cargo de tu entorno.',
    options: [
      { text: 'Cesar al implicado',       cost: 0, stats: { apr: -4 },                 news: 'El Gobierno cesa al alto cargo señalado por la Cour des comptes.' },
      { text: 'Negar y cerrar filas',     cost: 0, stats: { apr: -9, est: -3, con: -2 }, news: 'El Gobierno cierra filas y el escándalo de corrupción llega hasta el Palacio.' }
    ] },
  { cat: 'MERCADOS', min: 'economia', title: 'DISPARO DE LA PRIMA DE RIESGO', desc: 'Los inversores desconfían de la deuda marroquí y exigen intereses más altos.',
    options: [
      { text: 'Anunciar recortes',   cost: 0, stats: { eco: 3, apr: -5, emp: -2 }, news: 'El Gobierno anuncia recortes y los mercados respiran, pero la calle protesta.' },
      { text: 'Aguantar el pulso',   cost: 0, stats: { eco: -6, emp: -2 },          news: 'El Gobierno aguanta el pulso a los mercados y la deuda se encarece.' }
    ] },
  { cat: 'CIBERSEGURIDAD', min: 'defensa', title: 'CIBERATAQUE A MINISTERIOS', desc: 'Atacantes desconocidos paralizan sistemas críticos del Estado.',
    options: [
      { text: 'Contratar respuesta de emergencia', cost: 80, stats: { est: 2, mil: 1 },  news: 'Una respuesta de emergencia restablece los sistemas de los ministerios atacados.' },
      { text: 'Resolverlo con medios propios',     cost: 0,  stats: { eco: -5, est: -3 }, news: 'Los ministerios siguen paralizados días después del ciberataque.' }
    ] },
  { cat: 'ENERGÍA', min: 'transicion_ecologica', title: 'CRISIS ENERGÉTICA Y DEL BUTANO', desc: 'La energía se dispara y las familias no llegan a fin de mes.',
    options: [
      { text: 'Subsidiar la factura', cost: 450, stats: { eco: 2, apr: 3 },         news: 'El Gobierno subsidia la factura energética y alivia a las familias.' },
      { text: 'Dejar actuar al mercado', cost: 0, stats: { eco: -6, emp: -3, apr: -3 }, news: 'Se dispara el precio del butano y las familias recortan gastos básicos.' }
    ] },
  { cat: 'MILITAR', min: 'defensa', title: 'RUIDO DE SABLES', desc: 'Mandos militares critican en privado tu gestión y hay malestar en los cuarteles.',
    options: [
      { text: 'Ascensos y mejoras salariales', cost: 200, stats: { mil: 6, apr: -1 },  news: 'El Gobierno aprueba ascensos y mejoras salariales para calmar los cuarteles.' },
      { text: 'Ignorar el malestar',           cost: 0,   stats: { mil: -8, est: -2 }, news: 'El malestar militar se agranda ante el silencio del Gobierno.' }
    ] },
  { cat: 'ECONOMÍA', min: 'exteriores', title: 'REMESAS RÉCORD DE LOS MRE', desc: 'Los marroquíes del exterior envían cifras históricas de divisas.',
    options: [
      { text: 'Canalizarlas a inversión',  cost: 100,  stats: { eco: 3, emp: 1 }, news: 'El Gobierno canaliza las remesas récord de los MRE hacia proyectos de inversión.' },
      { text: 'Gastarlas en consumo',      cost: -200, stats: { apr: 2 },         news: 'Las remesas récord de los MRE alimentan el consumo de las familias.' }
    ] }
];


// =====================================================================
// 13. INTL_ACTIONS — sección «Unión Europea» (efectos sobre métricas
//     propias y sobre España omitidos). cost < 0 = ingreso.
// =====================================================================
const INTL_ACTIONS = [
  { id: 'pesca',   title: 'Renovar el acuerdo pesquero UE–Marruecos',   cap: 3, cost: -300, rel: 3, cd: 120 },
  { id: 'asoc',    title: 'Asociación avanzada con la UE',              cap: 5, cost: 0,    rel: 4, cd: 180 },
  { id: 'migra',   title: 'Pacto migratorio con Bruselas',              cap: 4, cost: -500, rel: 4, cd: 120 },
  { id: 'energia', title: 'Corredor de energía verde con Europa',       cap: 5, cost: 400,  rel: 3, cd: 150 },
  { id: 'visados', title: 'Negociar visados Schengen',                  cap: 3, cost: 0,    rel: 2, cd: 120 },
  { id: 'cables',  title: 'Conectar los cables eléctricos con España',  cap: 4, cost: 300,  rel: 3, cd: 120 }
];


// =====================================================================
// 14. PROJECTS
//  · Se omite `done: { ES, rel }` del Mundial y el efecto «Palacio».
// =====================================================================
const PROJECTS = [
  { id: 'tgv', icon: 'fa-train', title: 'Alta velocidad Kenitra–Marrakech', spirit: { name: 'Red Ferroviaria Al Boraq', daily: { eco: .04, emp: .02 }, money: 60 },
    phases: [
      { n: 'Estudios, trazado y licitación',      cost: 300,  days: 30,  now: {},                run: {} },
      { n: 'Obra civil y vías',                   cost: 2300, days: 120, now: { emp: 2, eco: 1 }, run: { emp: .02, eco: .01 } },
      { n: 'Material móvil y puesta en servicio', cost: 900,  days: 45,  now: { eco: 2, emp: 1 }, run: {} }
    ] },
  { id: 'nador', icon: 'fa-ship', title: 'Puerto Nador West Med', spirit: { name: 'Hub Mediterráneo', daily: { eco: .05, emp: .02 }, money: 90 },
    phases: [
      { n: 'Licitación y dragado',          cost: 250, days: 30,  now: {},                run: {} },
      { n: 'Diques, muelles y terminales',  cost: 850, days: 110, now: { emp: 1, eco: 1 }, run: { emp: .015, eco: .01 } },
      { n: 'Zona logística y apertura',     cost: 300, days: 40,  now: { eco: 3 },         run: {} }
    ] },
  { id: 'agua', icon: 'fa-droplet', title: 'Desaladoras y Plan Nacional del Agua', spirit: { name: 'Seguridad Hídrica', daily: { est: .03, eco: .02, apr: .01 }, money: -40 },
    phases: [
      { n: 'Estudios y evaluación ambiental',              cost: 200,  days: 30,  now: {},                 run: {} },
      { n: 'Plantas y conducciones (Casablanca, Dakhla)',  cost: 1100, days: 100, now: { emp: 1 },          run: { emp: .012 } },
      { n: 'Interconexión de presas y puesta en marcha',   cost: 350,  days: 45,  now: { est: 3, apr: 2 },  run: {} }
    ] },
  { id: 'solar', icon: 'fa-solar-panel', title: 'Complejo solar Noor y red eléctrica', spirit: { name: 'Independencia Energética', daily: { eco: .05 }, money: 120 },
    phases: [
      { n: 'Concursos y permisos',              cost: 250,  days: 40,  now: {},                run: {} },
      { n: 'Parques solares, eólicos y líneas', cost: 1500, days: 130, now: { eco: 1, emp: 1 }, run: { emp: .015, eco: .01 } },
      { n: 'Almacenamiento y exportación',      cost: 500,  days: 50,  now: { eco: 3 },         run: {} }
    ] },
  { id: 'viv', icon: 'fa-house', title: 'Vivienda social y ciudades nuevas', spirit: { name: 'Parque Público', daily: { apr: .04, est: .02 }, money: -60 },
    phases: [
      { n: 'Cesión de suelo y proyecto',  cost: 150, days: 30,  now: {},         run: {} },
      { n: 'Construcción de viviendas',   cost: 900, days: 100, now: { emp: 1 }, run: { emp: .015 } },
      { n: 'Adjudicación y entrega',      cost: 250, days: 35,  now: { apr: 5 }, run: {} }
    ] },
  { id: 'digi', icon: 'fa-microchip', title: 'Maroc Digital 2030', spirit: { name: 'Estado Digital', daily: { eco: .03, emp: .03 }, money: 40 },
    phases: [
      { n: 'Diseño y contratación',              cost: 120, days: 25, now: {},                run: {} },
      { n: 'Redes, centros de datos y sistemas', cost: 800, days: 80, now: { eco: 1 },         run: { eco: .01 } },
      { n: 'Migración y formación',              cost: 300, days: 40, now: { eco: 2, emp: 2 }, run: {} }
    ] },
  { id: 'mundial', icon: 'fa-futbol', title: 'Estadio Hassan II y Mundial 2030', spirit: { name: 'Legado Mundialista', daily: { apr: .04, eco: .03 }, money: 50 },
    phases: [
      { n: 'Diseño y licitación',          cost: 120, days: 30,  now: {},                run: {} },
      { n: 'Obra del estadio y accesos',   cost: 750, days: 120, now: { emp: 1, apr: 1 }, run: { emp: .015 } },
      { n: 'Pruebas e inauguración',       cost: 200, days: 35,  now: { apr: 5 },         run: {} }
    ] },
  { id: 'dakhla', icon: 'fa-anchor', title: 'Puerto Atlántico de Dakhla', spirit: { name: 'Eje Atlántico', daily: { eco: .04 }, money: 70 },
    phases: [
      { n: 'Estudios y financiación',          cost: 200, days: 30,  now: {},                run: {} },
      { n: 'Obras portuarias y zona franca',   cost: 950, days: 110, now: { emp: 1 },         run: { emp: .015, eco: .01 } },
      { n: 'Conexión viaria y apertura',       cost: 300, days: 40,  now: { eco: 2 },         run: {} }
    ] }
];


// =====================================================================
// 15. ACHIEVEMENTS
//  · «Superviviente» sigue la plantilla (completar una legislatura): la
//    versión original (sobrevivir a una moción de censura) no tiene
//    estado equivalente.
//  · VERIFICAR rutas de estado en 'cred' (banco central) y 'year' (días
//    en el cargo): no aparecen entre las claves que documenta la plantilla.
// =====================================================================
const ACHIEVEMENTS = [
  { id: 'm1',    icon: 'fa-flag',            title: 'Primer Mandato',          desc: 'Cumple tu primera misión',                  ok: s => s.goals && s.goals.done >= 1 },
  { id: 'm5',    icon: 'fa-list-check',      title: 'Gestor Eficaz',           desc: 'Cumple 5 misiones',                         ok: s => s.goals && s.goals.done >= 5 },
  { id: 'f1',    icon: 'fa-diagram-project', title: 'Visión de Estado',        desc: 'Completa un foco nacional',                 ok: s => s.focus && s.focus.done.length >= 1 },
  { id: 'fb',    icon: 'fa-sitemap',         title: 'Doctrina Completa',       desc: 'Completa una rama entera de focos',         ok: s => s.focus && Object.keys(FOCUS_BRANCHES).some(b => FOCUS_TREE.filter(f => f.b === b).every(f => s.focus.done.includes(f.id))) },
  { id: 'p3',    icon: 'fa-helmet-safety',   title: 'Constructor de Marruecos', desc: 'Termina 3 proyectos de Estado',            ok: s => s.proj && s.proj.done.length >= 3 },
  { id: 'rich',  icon: 'fa-vault',           title: 'Caja Fuerte',             desc: 'Llega a 15.000 M€ en Tesorería',            ok: s => (Number(s.treasury) || 0) >= 15000 },
  { id: 'all',   icon: 'fa-star',            title: 'País de Primera',         desc: 'Todas las métricas ≥ 70% a la vez',         ok: s => s.metrics && ['eco', 'est', 'emp', 'apr', 'mil'].every(k => s.metrics[k] >= 70) },
  { id: 'abyss', icon: 'fa-skull',           title: 'Al Borde del Abismo',     desc: 'Emite más de 6.000 M€ de deuda nueva',      ok: s => s.debt && s.debt.amount >= 6000 },
  { id: 'cred',  icon: 'fa-building-columns', title: 'Banco Creíble',          desc: 'Credibilidad de Bank Al-Maghrib ≥ 85%',     ok: s => s.bde && s.bde.cred >= 85 },
  { id: 'surv',  icon: 'fa-shield',          title: 'Superviviente',           desc: 'Completa una legislatura',                  ok: s => s.campaign && s.campaign.history.length >= 1 },
  { id: 'year',  icon: 'fa-calendar-check',  title: 'Primer Año de Mandato',   desc: 'Cumple un año en el poder',                 ok: s => (s.daysInOffice || 0) >= 365 }
];


// =====================================================================
// 16. BDE_GOVS — gobernadores de Bank Al-Maghrib
//     (IDs de la plantilla: Berrada -> tecnico · Jouahri -> indep)
// =====================================================================
const BDE_GOVS = [
  { id: 'tecnico', name: 'Salma Berrada',      tag: 'Tecnócrata ortodoxa',  cred: 10,  desc: 'Prioriza la inflación y el equilibrio exterior. Los mercados la adoran, la calle menos.' },
  { id: 'afin',    name: 'Youssef Tazi',       tag: 'Afín al Gobierno',     cred: -10, desc: 'Informes amables y crédito fácil; los inversores desconfían.' },
  { id: 'indep',   name: 'Abdellatif Jouahri', tag: 'Wali histórico',       cred: 15,  desc: 'Al frente del banco desde 2003: los mercados y el Palacio le respetan; informes sobrios y poco complacientes.' }
];


// =====================================================================
// 17. BDE_ACTIONS — acciones de Bank Al-Maghrib
//  · El tipo director, la banda del dírham y los meses de reservas del
//    original no existen en el estado B de la plantilla: se omiten.
//  · Condiciones `when` originales (rate>1, band<8, res>2, cred>25)
//    sustituidas por () => true.
//  · Las acciones que ingresaban liquidez usan registerFinancialTransaction.
// =====================================================================
const BDE_ACTIONS = [
  { id: 'rate_down', icon: 'fa-arrow-trend-down', label: 'Bajar el tipo director (−25 pb)', desc: 'Abarata el crédito: más actividad y empleo, algo más de inflación.', cost: 0, cd: 45, when: () => true,
    run: B => { B.cred -= 1; focusMetricAdd('eco', 2); focusMetricAdd('emp', 1); } },
  { id: 'rate_up', icon: 'fa-arrow-trend-up', label: 'Subir el tipo director (+25 pb)', desc: 'Frena la inflación y refuerza la moneda, a costa de la actividad.', cost: 0, cd: 45, when: () => true,
    run: B => { B.cred += 2; B.shock -= 10; focusMetricAdd('eco', -1); focusMetricAdd('apr', -1); focusMetricAdd('est', 1); } },
  { id: 'band', icon: 'fa-arrows-left-right', label: 'Flexibilizar la banda del dírham', desc: 'Amplía la banda de fluctuación: más competitividad exterior, algo de volatilidad.', cost: 0, cd: 90, when: () => true,
    run: B => { B.cred += 1; focusMetricAdd('eco', 2); focusMetricAdd('apr', -2); } },
  { id: 'interv', icon: 'fa-vault', label: 'Intervenir con las reservas de divisas', desc: 'Defiende el dírham quemando 0,4 meses de reservas (−300 M€).', cost: 300, cd: 60, when: () => true,
    run: B => { B.cred += 4; B.shock -= 50; focusMetricAdd('est', 2); } },
  { id: 'pymes', icon: 'fa-store', label: 'Programa de finanzas para pymes', desc: 'Crédito garantizado a las pymes (−350 M€).', cost: 350, cd: 75, when: () => true,
    run: B => { B.cred += 1; focusMetricAdd('eco', 2); focusMetricAdd('emp', 3); } },
  { id: 'informe', icon: 'fa-file-lines', label: 'Encargar un informe de solvencia', desc: 'Auditoría externa que calma a los mercados (−150 M€).', cost: 150, cd: 60, when: () => true,
    run: B => { B.cred += 4; B.shock -= 15; } },
  { id: 'dividendo', icon: 'fa-hand-holding-dollar', label: 'Adelantar el beneficio de Bank Al-Maghrib', desc: 'Liquidez inmediata (+500 M€), pero huele a presión política.', cost: 0, cd: 180, when: () => true,
    run: B => { B.cred -= 10; B.shock += 20; registerFinancialTransaction('Adelanto de beneficios de Bank Al-Maghrib', 500, 'economia'); } },
  { id: 'monetiza', icon: 'fa-print', label: 'Que el banco central financie el déficit', desc: 'Financiación monetaria de +900 M€. Inflación y desconfianza garantizadas.', cost: 0, cd: 150, when: () => true,
    run: B => { B.cred -= 15; B.shock += 60; focusMetricAdd('apr', -4); focusMetricAdd('eco', -2); registerFinancialTransaction('Financiación monetaria de Bank Al-Maghrib', 900, 'economia'); } }
];


// =====================================================================
// EXTRA — PERFIL ECONÓMICO, NOMBRES MINISTERIALES Y GUERRA (opcional)
//  Cifras reales del Reino (Ley de Finanzas 2026, 1 € ≈ 10,5 MAD), a la escala del juego:
//  PIB 1.847 mil M MAD ≈ 176.000 M€; deuda pública ≈ 70 % del PIB; déficit 3 % del PIB.
//  LF 2026: Educación 97,1 mil M MAD · Defensa 157,2 · Inversión 114,8 · Salud 42,4 · intereses 41,6.
// =====================================================================
const COUNTRY_ECON = {
  // Términos que el motor usa en titulares y textos (Moncloa / Banco de España en España)
  terms: { gov: 'Rabat', place: 'el Palacio Real', cabinet: 'Gabinete de Gobierno', bank: 'Bank Al-Maghrib', nation: 'Marruecos', adj: 'marroquí', firms: 'marroquíes', capital: 'Rabat' },
  k: 0.10,                       // escala respecto a España (PIB 176.000 / 1.700.000)
  budget: 10000, budgetStep: 100, // PGE a repartir (M€)
  pib: 176000, debt: 123000,      // PIB y deuda pública heredada (≈ 70 % del PIB)
  macroPib: 10030, revPct: 0.30, pensPct: 0.04, otherPct: 0.18,
  baseRate: 3.6,                  // coste medio de financiación (bonos a 10 años ≈ 3,5-4 %)
  debtMax: 30000, cashCap: 9000,
  preset: { sanidad: 800, educacion: 1800, defensa: 3600, vivienda: 500, infraestructuras: 2100, deuda: 1200 },
  hint: 'Referencia real (Ley de Finanzas 2026): Defensa 157,2 · Educación 97,1 · Inversión pública 114,8 · Salud 42,4 · Intereses 41,6 (miles de millones de MAD). Déficit previsto: 3 % del PIB. Se propone un reparto a escala; modifícalo si quieres.',
  labels: { sanidad: 'Salud y Protección Social', educacion: 'Educación Nacional y Enseñanza Superior', defensa: 'Defensa e Interior (FAR, Gendarmería, DGSN)', vivienda: 'Vivienda y Solidaridad Social', infraestructuras: 'Equipamiento, Agua e Industria', deuda: 'Amortización de la Deuda' },
  pct: { sanidad: 8, educacion: 18, infraestructuras: 21, interior: 7, defensa: 29, economia: 12, vivienda: 5 },
  names: {
    economia: 'Ministerio de Economía y Finanzas', interior: 'Ministerio del Interior', defensa: 'Administración de la Defensa Nacional',
    vivienda: 'Ministerio de Ordenación del Territorio, Urbanismo y Vivienda', territorio: 'Ministerio de Agricultura, Pesca y Aguas y Bosques',
    sanidad: 'Ministerio de Salud y Protección Social', educacion: 'Ministerio de Educación Nacional, Preescolar y Deportes',
    trabajo: 'Ministerio de Inclusión Económica, Pequeña Empresa y Empleo', justicia: 'Ministerio de Justicia',
    exteriores: 'Ministerio de Asuntos Exteriores y Cooperación Africana', transicion_ecologica: 'Ministerio de Transición Energética y Desarrollo Sostenible',
    cultura: 'Ministerio de Juventud, Cultura y Comunicación', igualdad: 'Ministerio de Solidaridad, Inserción Social y Familia',
    infraestructuras: 'Ministerio de Equipamiento y Agua'
  },
  descs: {
    sanidad: 'Hospitales públicos, AMO y protección social universal.', educacion: 'Escuela pública, universidad y formación profesional.',
    infraestructuras: 'Alta velocidad Al Boraq, autopistas, presas y puertos.', interior: 'DGSN, Gendarmería Real, Fuerzas Auxiliares y walis.',
    defensa: 'Fuerzas Armadas Reales, adquisiciones y operaciones.', economia: 'Servicio de la deuda, Tesorería General y recaudación (DGI).',
    vivienda: 'Vivienda social, Ciudades Sin Chabolas y ayudas directas.'
  },
  war: {
    id: 504, name: 'Marruecos', lat: 32, lon: -6, allied: '^$', own: { t: 44, m: 26, a: 42 },
    add: [[724, 'España', 48, 'UE·OTAN', 1, 50, 0, 40, -4]],
    drop: [732],
    rel: { 724: 50, 12: 10, 250: 78, 840: 85, 620: 70, 478: 55, 818: 70, 682: 78, 784: 80, 376: 62, 364: 12, 792: 62, 643: 40, 156: 55, 275: 45, 434: 45, 788: 55 }
  }
};

const COUNTRY_MAP = {
  title: 'Mapa de las 12 Regiones de Marruecos',
  paths: [
    { id: 'TTA', name: 'Tánger-Tetuán-Alhucemas', d: 'M 287.5,20.0 L 300.3,18.0 L 330.8,33.8 L 339.1,34.5 L 333.6,43.8 L 311.9,50.0 L 292.3,46.3 L 278.2,38.8 Z', spectrumPref: 5.0, regionalist: false, desc: 'Tánger-Tetuán-Alhucemas · Norte mediterráneo, puerto Tanger Med y frontera con Ceuta' },
    { id: 'ORI', name: 'Oriental', d: 'M 339.1,34.5 L 368.0,37.5 L 374.9,48.0 L 389.5,112.5 L 366.2,125.0 L 342.3,90.0 L 339.1,65.0 L 333.6,43.8 Z', spectrumPref: 4.2, regionalist: false, desc: 'Oriental · Oujda, Nador y la frontera con Argelia' },
    { id: 'FME', name: 'Fez-Mequinez', d: 'M 292.3,46.3 L 311.9,50.0 L 333.6,43.8 L 339.1,65.0 L 342.3,90.0 L 307.5,91.2 L 296.7,82.5 L 288.0,65.0 Z', spectrumPref: 4.6, regionalist: false, desc: 'Fez-Mequinez · Capital espiritual, agricultura y universidades' },
    { id: 'RSK', name: 'Rabat-Salé-Kenitra', d: 'M 278.2,38.8 L 292.3,46.3 L 288.0,65.0 L 296.7,82.5 L 266.2,86.3 L 263.4,68.8 Z', spectrumPref: 4.4, regionalist: false, desc: 'Rabat-Salé-Kenitra · Sede del Gobierno y la Cámara de Representantes' },
    { id: 'BMK', name: 'Beni Mellal-Jenifra', d: 'M 296.7,82.5 L 307.5,91.2 L 296.7,112.5 L 274.9,127.5 L 259.7,122.5 L 259.7,101.3 L 266.2,86.3 Z', spectrumPref: 4.8, regionalist: true, desc: 'Beni Mellal-Jenifra · Agricultura de regadío y fosfatos (Khouribga)' },
    { id: 'CAS', name: 'Casablanca-Settat', d: 'M 263.4,68.8 L 215.1,98.8 L 242.3,102.5 L 259.7,101.3 L 266.2,86.3 Z', spectrumPref: 4.0, regionalist: false, desc: 'Casablanca-Settat · Motor económico y financiero del país' },
    { id: 'MAR', name: 'Marrakech-Safi', d: 'M 204.2,151.3 L 215.1,98.8 L 242.3,102.5 L 259.7,101.3 L 259.7,122.5 L 274.9,127.5 L 255.3,138.8 L 244.5,145.0 L 229.2,145.0 Z', spectrumPref: 4.5, regionalist: false, desc: 'Marrakech-Safi · Turismo, fosfatos (OCP en Safi) y Alto Atlas' },
    { id: 'DRA', name: 'Drâa-Tafilalet', d: 'M 342.3,90.0 L 366.2,125.0 L 338.0,155.0 L 296.7,180.0 L 276.9,190.0 L 266.2,165.0 L 255.3,138.8 L 274.9,127.5 L 296.7,112.5 L 307.5,91.2 Z', spectrumPref: 5.4, regionalist: true, desc: 'Drâa-Tafilalet · Oasis y sur profundo, región con mayor pobreza rural' },
    { id: 'SOU', name: 'Souss-Massa', d: 'M 194.4,181.3 L 204.2,151.3 L 229.2,145.0 L 244.5,145.0 L 255.3,138.8 L 266.2,165.0 L 276.9,190.0 L 253.2,202.5 L 220.5,190.0 Z', spectrumPref: 4.7, regionalist: false, desc: 'Souss-Massa · Agadir, agroexportación y pesca' },
    { id: 'GUE', name: 'Guelmim-Uad Nun', d: 'M 194.4,181.3 L 220.5,190.0 L 253.2,202.5 L 227.7,215.0 L 227.7,223.3 L 135.7,216.3 Z', spectrumPref: 5.2, regionalist: true, desc: 'Guelmim-Uad Nun · Puerta del Sáhara y comercio caravanero' },
    { id: 'LAA', name: 'Laâyoune-Saguia el Hamra', d: 'M 135.7,216.3 L 227.7,223.3 L 227.7,265.0 L 227.7,290.0 L 94.4,287.5 L 100.9,261.8 L 129.2,236.3 Z', spectrumPref: 5.6, regionalist: true, desc: 'Laâyoune-Saguia el Hamra · Provincias del Sur, fosfatos de Bou Craa' },
    { id: 'DAK', name: 'Dakhla-Río de Oro', d: 'M 94.4,287.5 L 227.7,290.0 L 133.5,380.0 L 46.5,381.5 L 69.4,322.5 Z', spectrumPref: 5.8, regionalist: true, desc: 'Dakhla-Río de Oro · Puerto Atlántico de Dakhla, pesca y energía' }
  ]
};


// =====================================================================
//  COUNTRY_INTL — Relaciones Exteriores de Marruecos (sustituye a los socios de España)
//  · partners : socios/bloques. ally (relación >=70) y tense (<=30) dan bonus/penalización
//               diaria a las métricas (daily) y mensual en M€ (money, opcional).
//  · base     : relación inicial (0-100).   · links : efecto bloque (acercarte a X mueve a Y).
//  · map      : códigos numéricos de país (ISO) del mapa de Guerra que sincroniza cada socio.
//  · actions  : acciones diplomáticas por socio. cap=capital político, cost=gasto M€,
//               inc=ingreso M€, cd=días de espera, fx=relaciones que cambia, now=métricas.
//  · monthly  : cada mes, si la métrica m supera gt o baja de lt, mueve relaciones (fx).
//  · pop      : crisis diplomáticas aleatorias (cond recibe el objeto de relaciones).
// =====================================================================
const COUNTRY_INTL = {
  blocksText: 'EEUU↔China, Francia↔Argelia, España↔Bruselas',
  partners: {
    es: { name: 'España',          icon: 'fa-handshake',          ally: { name: 'Frontera Norte Estable',     daily: { est: .04, eco: .02 }, money: 80 },  tense: { name: 'Tensión por Ceuta y Melilla',  daily: { est: -.05 }, money: -40 } },
    fr: { name: 'Francia',         icon: 'fa-landmark',           ally: { name: 'Eje Rabat–París',            daily: { eco: .04, est: .02 }, money: 60 },  tense: { name: 'Distanciamiento con París',    daily: { eco: -.04 }, money: -40 } },
    us: { name: 'Estados Unidos',  icon: 'fa-flag-usa',           ally: { name: 'Aliado Estratégico No-OTAN', daily: { mil: .05, eco: .02 } },            tense: { name: 'Frialdad con Washington',      daily: { mil: -.04 } } },
    dz: { name: 'Argelia',         icon: 'fa-fire-flame-simple',  ally: { name: 'Frontera Oriental Abierta',  daily: { eco: .04, est: .03 }, money: 50 },  tense: { name: 'Frontera Cerrada con Argel',   daily: { est: -.05, mil: -.02 }, money: -40 } },
    ue: { name: 'Unión Europea',   icon: 'fa-earth-europe',       ally: { name: 'Socio Avanzado de Bruselas', daily: { eco: .05 }, money: 120 },        tense: { name: 'Fricción con Bruselas',        daily: { eco: -.05 }, money: -60 } },
    gc: { name: 'Países del Golfo',icon: 'fa-coins',              ally: { name: 'Inversión del Golfo',        daily: { eco: .04, emp: .02 }, money: 100 }, tense: { name: 'Retirada de Inversión del Golfo', daily: { eco: -.04 }, money: -60 } },
    cn: { name: 'China',           icon: 'fa-dragon',             ally: { name: 'Socio Comercial Asiático',   daily: { eco: .04 }, money: 60 },         tense: { name: 'Guerra Comercial con Pekín',   daily: { eco: -.04 }, money: -40 } },
    af: { name: 'África',          icon: 'fa-earth-africa',       ally: { name: 'Liderazgo Africano',         daily: { apr: .03, est: .02 } },            tense: { name: 'Aislamiento Africano',         daily: { apr: -.03 } } }
  },
  base: { es: 50, fr: 78, us: 85, dz: 12, ue: 70, gc: 78, cn: 55, af: 55 },
  links: { us: { cn: -.3 }, cn: { us: -.3 }, fr: { ue: .2, dz: -.1 }, ue: { fr: .15 }, es: { ue: .15 } },
  map: {
    es: [724], fr: [250], us: [840], dz: [12], cn: [156],
    gc: [682, 784, 414, 634, 512, 48],
    af: [478, 434, 788, 818, 686, 384, 566, 288, 404, 716],
    ue: [620, 380, 276, 56, 528, 300, 40, 246, 752, 208, 372, 616, 203, 642, 100, 191, 196, 233, 428, 440, 442, 348, 703, 705, 470]
  },
  actions: {
    es: [
      { id: 'cum', title: 'Cumbre bilateral con Madrid',               cap: 8, cd: 60,  fx: { es: 10, ue: 2 } },
      { id: 'cab', title: 'Conectar los cables eléctricos con España', cost: 300, cap: 4, cd: 120, fx: { es: 8, ue: 1 }, now: { eco: 1 } },
      { id: 'mig', title: 'Pacto de cooperación migratoria',           cost: 30, cd: 60, fx: { es: 10, dz: -2 }, now: { est: 2 } }
    ],
    fr: [
      { id: 'cum', title: 'Cumbre Rabat–París',                        cap: 8, cd: 50,  fx: { fr: 10, ue: 2 } },
      { id: 'inv', title: 'Inversión industrial francesa',             cap: 5, inc: 150, cd: 90, fx: { fr: 8 }, now: { emp: 1 } }
    ],
    us: [
      { id: 'arm', title: 'Comprar material militar',                  cost: 500, cd: 60, fx: { us: 10, cn: -3 }, now: { mil: 3 } },
      { id: 'sah', title: 'Pedir apoyo sobre el Sáhara',               cap: 10, cd: 90, fx: { us: 8, dz: -3 } }
    ],
    dz: [
      { id: 'dia', title: 'Mensaje de distensión a Argel',             cap: 12, cd: 90, fx: { dz: 10, es: -2 }, now: { est: 1 } },
      { id: 'fro', title: 'Reforzar la frontera oriental',             cap: 6, cd: 60,  fx: { dz: -8 }, now: { mil: 2, est: 1 } }
    ],
    ue: [
      { id: 'pesca',   title: 'Renovar el acuerdo pesquero UE–Marruecos', cap: 3, inc: 300, cd: 120, fx: { ue: 3 } },
      { id: 'asoc',    title: 'Asociación avanzada con la UE',            cap: 5, cd: 180, fx: { ue: 4 } },
      { id: 'migra',   title: 'Pacto migratorio con Bruselas',            cap: 4, inc: 500, cd: 120, fx: { ue: 4 } },
      { id: 'energia', title: 'Corredor de energía verde con Europa',     cap: 5, cost: 400, cd: 150, fx: { ue: 3 }, now: { eco: 1 } },
      { id: 'visados', title: 'Negociar visados Schengen',                cap: 3, cd: 120, fx: { ue: 2 } }
    ],
    gc: [
      { id: 'fon', title: 'Fondo de inversión del Golfo',              cap: 6, inc: 250, cd: 90, fx: { gc: 8 }, now: { eco: 1 } },
      { id: 'vis', title: 'Visita de Estado a las monarquías',         cap: 8, cd: 60,  fx: { gc: 12 } }
    ],
    cn: [
      { id: 'inv',  title: 'Atraer fábricas chinas (Tánger Med)',      cap: 8, cd: 60,  fx: { cn: 10, us: -4 }, now: { eco: 2 } },
      { id: 'ruta', title: 'Adhesión a la Ruta de la Seda',            cap: 12, cd: 90, fx: { cn: 12, us: -6, ue: -2 }, now: { emp: 1 } }
    ],
    af: [
      { id: 'gas', title: 'Gasoducto Nigeria–Marruecos',               cost: 300, cd: 90, fx: { af: 12, dz: -3 }, now: { eco: 2 } },
      { id: 'ua',  title: 'Cumbre Atlántica Africana',                 cap: 8, cd: 60,  fx: { af: 10 } }
    ]
  },
  monthly: [
    { m: 'eco', gt: 70, fx: { ue: .8, fr: .6 },   why: 'Credibilidad económica' },
    { m: 'eco', lt: 30, fx: { ue: -1, fr: -.8 },  why: 'Economía débil ante los socios' },
    { m: 'est', lt: 30, fx: { ue: -.8, af: -.5 }, why: 'Inestabilidad interna' },
    { m: 'mil', gt: 70, fx: { us: .5, dz: -.5 },  why: 'Capacidad de disuasión' },
    { m: 'mil', lt: 35, fx: { us: -1, dz: -.8 },  why: 'Ejército debilitado: menos respeto exterior' }
  ],
  pop: [
    { id: 'usb', cond: r => r.us >= 65, title: 'WASHINGTON OFRECE CAZAS Y EJERCICIOS CONJUNTOS', desc: 'Su aliado estratégico propone un gran ejercicio militar y la venta de nuevo material. Argel y Pekín lo miran con recelo.',
      options: [{ text: 'Aceptar el paquete militar', intl: { us: 10, cn: -3, dz: -2 }, cost: 400, stats: { mil: 3, apr: -2 }, news: 'Marruecos acepta nuevo material y ejercicios con Estados Unidos.' }, { text: 'Declinar y mantener el equilibrio', intl: { us: -8, cn: 2 }, stats: { apr: 2 }, news: 'Rabat rechaza ampliar la cooperación militar con Washington.' }] },
    { id: 'dzf', cond: r => r.dz <= 25, title: 'ARGEL ENDURECE LA FRONTERA Y LA RETÓRICA', desc: 'Argelia refuerza sus tropas en la frontera y acusa a Rabat de provocación. Crece la tensión en el Oriental.',
      options: [{ text: 'Proponer una mediación internacional', intl: { dz: 8, ue: 3 }, cost: 100, stats: { est: 2 }, news: 'Marruecos propone una mediación para rebajar la tensión con Argelia.' }, { text: 'Responder con una exhibición de fuerza', intl: { dz: -8, us: 2 }, stats: { mil: 3, est: -3, apr: 2 }, news: 'Rabat responde con maniobras en el Oriental.' }] },
    { id: 'ues', cond: r => r.ue <= 32, title: 'BRUSELAS CUESTIONA EL ACUERDO PESQUERO', desc: 'El Parlamento Europeo amenaza con bloquear el acuerdo y congelar fondos de cooperación.',
      options: [{ text: 'Ofrecer garantías y cooperación migratoria', intl: { ue: 12 }, cost: 200, news: 'Marruecos ofrece garantías a Bruselas para salvar el acuerdo.' }, { text: 'Buscar socios alternativos', intl: { ue: -8, cn: 5, gc: 4 }, stats: { eco: -2, apr: 2 }, news: 'Rabat diversifica socios ante la presión europea.' }] },
    { id: 'esm', cond: r => r.es <= 35, title: 'MADRID ENDURECE EL CONTROL EN CEUTA Y MELILLA', desc: 'España refuerza las vallas y reclama más cooperación policial a Rabat.',
      options: [{ text: 'Reforzar la cooperación policial', intl: { es: 12, dz: -2 }, cost: 150, stats: { est: 2 }, news: 'Marruecos y España refuerzan la cooperación en la frontera.' }, { text: 'Plantar cara y alzar el tono', intl: { es: -8 }, stats: { apr: 3, est: -2 }, news: 'Rabat responde con dureza a las medidas de Madrid.' }] },
    { id: 'gco', cond: r => r.gc >= 70, title: 'EL GOLFO OFRECE UN GRAN FONDO DE INVERSIÓN', desc: 'Las monarquías del Golfo proponen financiar puertos, energía y turismo a cambio de condiciones políticas.',
      options: [{ text: 'Aceptar las condiciones', intl: { gc: 8, us: -1 }, income: 600, stats: { eco: 3, emp: 2, apr: -2 }, news: 'Marruecos recibe una inyección de inversión del Golfo.' }, { text: 'Negociar sin ataduras políticas', intl: { gc: -4 }, income: 200, stats: { eco: 1, apr: 2 }, news: 'Rabat pacta una inversión del Golfo sin condiciones políticas.' }] }
  ]
};
