// =====================================================================
//  CONTENIDO DE MARRUECOS: escenario y decisiones, prensa, ministerios, focos,
//  proyectos, logros, Banco Al-Maghrib… (separado del motor principal).
//  Se carga ANTES del script principal.
// =====================================================================

const SCENARIOS = {
  ACTUAL: {
    id: 'ACTUAL',
    title: 'MARRUECOS ACTUAL (2021)',
    desc: 'Cámara de Representantes de 395 escaños (mayoría absoluta: 198). Deberás equilibrar las reformas económicas, la cohesión social, la sequía estructural y la modernización del Reino.',
    parties: [
      { id: 'FGD',  name: 'Federación de la Izquierda Democrática',     leader: 'Candidatura FGD',       seats: 1,   baseSeats: 1,   minSeats: 0, maxSeats: 395, basePct: 0.3,  color: '#be185d', isRegional: false, ideology: 'Izquierda',                spectrumOrder: 1, redLines: ['RNI', 'PAM', 'UC', 'PI', 'MP'] },
      { id: 'PPS',  name: 'Partido del Progreso y el Socialismo',       leader: 'Nabil Benabdallah',     seats: 22,  baseSeats: 22,  minSeats: 0, maxSeats: 395, basePct: 5.6,  color: '#f97316', isRegional: false, ideology: 'Izquierda',                spectrumOrder: 2, redLines: [] },
      { id: 'USFP', name: 'Unión Socialista de Fuerzas Populares',      leader: 'Driss Lachguar',        seats: 34,  baseSeats: 34,  minSeats: 0, maxSeats: 395, basePct: 8.6,  color: '#f43f5e', isRegional: false, ideology: 'Socialdemocracia',         spectrumOrder: 3, redLines: [] },
      { id: 'PJD',  name: 'Partido Justicia y Desarrollo',              leader: 'Abdelilah Benkirane',   seats: 13,  baseSeats: 13,  minSeats: 0, maxSeats: 395, basePct: 3.3,  color: '#38bdf8', isRegional: false, ideology: 'Islamismo conservador',    spectrumOrder: 4, redLines: ['PAM'] },
      { id: 'MP',   name: 'Movimiento Popular',                         leader: 'Mohand Laenser',        seats: 28,  baseSeats: 28,  minSeats: 0, maxSeats: 395, basePct: 7.1,  color: '#a16207', isRegional: false, ideology: 'Centro rural',             spectrumOrder: 4, redLines: [] },
      { id: 'UC',   name: 'Unión Constitucional',                       leader: 'Mohamed Sajid',         seats: 18,  baseSeats: 18,  minSeats: 0, maxSeats: 395, basePct: 4.6,  color: '#eab308', isRegional: false, ideology: 'Liberal',                  spectrumOrder: 5, redLines: [] },
      { id: 'PAM',  name: 'Autenticidad y Modernidad',                  leader: 'Abdellatif Ouahbi',     seats: 87,  baseSeats: 87,  minSeats: 0, maxSeats: 395, basePct: 22.0, color: '#16a34a', isRegional: false, ideology: 'Centro modernista',        spectrumOrder: 5, redLines: ['PJD'] },
      { id: 'RNI',  name: 'Agrupación Nacional de Independientes',      leader: 'Aziz Akhannouch',       seats: 102, baseSeats: 102, minSeats: 0, maxSeats: 395, basePct: 25.8, color: '#2563eb', isRegional: false, ideology: 'Liberal / centroderecha',  spectrumOrder: 6, redLines: [] },
      { id: 'PI',   name: 'Istiqlal',                                   leader: 'Nizar Baraka',          seats: 81,  baseSeats: 81,  minSeats: 0, maxSeats: 395, basePct: 20.5, color: '#dc2626', isRegional: false, ideology: 'Nacionalista conservador', spectrumOrder: 6, redLines: [] },
      { id: 'MDS',  name: 'Movimiento Demócrata y Social',              leader: 'Abdemahdoud Archi',     seats: 3,   baseSeats: 3,   minSeats: 0, maxSeats: 395, basePct: 0.8,  color: '#94a3b8', isRegional: false, ideology: 'Centro',                   spectrumOrder: 4, redLines: [] }
    ]
  }
};

// ==========================================
// 1. EVENTOS DINÁMICOS Y GEOPOLÍTICOS (POPUPS ÚNICOS)
// ==========================================
const DYNAMIC_EVENTS = [
  {
    id: 'SPECIAL_MUDAWANA',
    category: 'SOCIEDAD Y FAMILIA',
    title: 'REFORMA DEL CÓDIGO DE FAMILIA (MUDAWANA)',
    desc: 'Las organizaciones de mujeres exigen avances en custodia, herencia y matrimonio, mientras que los sectores religiosos defienden el marco tradicional.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar una reforma amplia e igualitaria en los tribunales de familia', stats: { apr: +6, est: -3, con: -2 }, cost: 0, loyaltyImpact: { USFP: +20, PPS: +25, PJD: -35, PI: -15, MP: -10 }, news: 'El Ejecutivo impulsa una reforma de la Mudawana enfocada en la igualdad de derechos.' },
      { text: 'Limitar los cambios a ajustes procedimentales tras consultar al Consejo de Ulemas', stats: { apr: -4, est: +3, con: +4 }, cost: 0, loyaltyImpact: { PJD: +20, PI: +15, USFP: -20, PPS: -25 }, news: 'Rabat circunscribe la reforma de la Mudawana a criterios técnicos acordados con los ulemas.' }
    ]
  },
  {
    id: 'SPECIAL_CANNABIS_RIF',
    category: 'ECONOMÍA REGIONAL',
    title: 'CANNABIS LEGAL EN EL RIF Y REGULARIZACIÓN',
    desc: 'Las cooperativas del norte solicitan ampliar las licencias para uso medicinal e industrial y condonar antecedentes a los agricultores.',
    condition: (m) => true,
    options: [
      { text: 'Expandir licencias de cultivo legal e integrar a miles de agricultores', stats: { eco: +5, apr: +4, est: +3 }, cost: 150, loyaltyImpact: { PAM: +20, RNI: +10, PJD: -20 }, news: 'El Gobierno amplía la legalización del cannabis industrial e integra a las cooperativas del Rif.' },
      { text: 'Restringir las cuotas de producción para evitar tensiones de control fiscal', stats: { eco: -2, apr: -3, est: -2 }, cost: 0, loyaltyImpact: { PAM: -15, PJD: +10 }, news: 'Controles estrictos a la producción de cannabis generan malestar en las provincias del norte.' }
    ]
  },
  {
    id: 'GEO_SAHARA_AUTONOMIA',
    category: 'POLÍTICA EXTERIOR',
    title: 'PROYECCIÓN ATLÁNTICA Y PLAN DE AUTONOMÍA EN EL SÁHARA',
    desc: 'Se busca consolidar las inversiones estratégicas en Dakhla y El Aaiún para reforzar la posición diplomática internacional.',
    condition: (m) => true,
    options: [
      { text: 'Acelerar las obras del Puerto Dakhla Atlántico e infraestructuras del Sur', stats: { eco: +6, apr: +3, con: +5 }, cost: 500, loyaltyImpact: { PI: +20, RNI: +15, PAM: +15 }, news: 'Inyección económica récord para impulsar el polo logístico de Dakhla Atlántico.' },
      { text: 'Intensificar la ofensiva diplomática para recabar nuevos reconocimientos formales', stats: { con: +6, apr: +2, est: +2 }, cost: 120, loyaltyImpact: { PI: +15, USFP: +10 }, news: 'Marruecos suma nuevos apoyos internacionales a su propuesta de autonomía.' }
    ]
  },
  {
    id: 'HUELGA_SMIG',
    category: 'TRABAJO Y PENSIONES',
    title: 'ACUERDO SOBRE EL SALARIO MÍNIMO (SMIG Y SMAG)',
    desc: 'Los sindicatos amenazan con paros generales si no se compensa la subida del coste de la vida en el campo y la ciudad.',
    condition: (m) => true,
    options: [
      { text: 'Subir el SMIG un 10% y equiparar progresivamente el salario agrícola', stats: { apr: +8, est: +4, eco: -4 }, cost: 350, loyaltyImpact: { USFP: +20, PPS: +20, RNI: -10, UC: -15 }, news: 'Pacto social de madrugada: subida del 10% del salario mínimo urbano y agrícola.' },
      { text: 'Congelar el salario mínimo ofreciendo deducciones a las pymes contratantes', stats: { eco: +4, apr: -8, est: -5 }, cost: 0, loyaltyImpact: { RNI: +15, UC: +15, USFP: -25, PPS: -25 }, news: 'Las centrales sindicales convocan movilizaciones tras el rechazo a subir el SMIG.' }
    ]
  },
  {
    id: 'CRISIS_SEQUIA_ESTRUCTURAL',
    category: 'MEDIO AMBIENTE & AGUA',
    title: 'SEQUÍA ESTRUCTURAL Y NIVELES DE EMBALSES EN MÍNIMOS',
    desc: 'La falta de precipitaciones amenaza el suministro urbano en el eje Casablanca-Rabat y la viabilidad del regadío.',
    condition: (m) => true,
    options: [
      { text: 'Acelerar la autopista del agua y construir mega-desaladoras de urgencia', stats: { eco: +2, est: +5, apr: +3 }, cost: 600, loyaltyImpact: { PI: +15, RNI: +10, MP: -10 }, news: 'El Gobierno activa el plan de urgencia hídrica con la interconexión de cuencas.' },
      { text: 'Priorizar el agua para la agricultura de exportación recortando riego local', stats: { eco: +5, est: -6, apr: -6 }, cost: 0, loyaltyImpact: { MP: +15, RNI: +10, PPS: -15 }, news: 'Restricciones de agua en ciudades intermedias para salvaguardar las exportaciones agrícolas.' }
    ]
  },
  {
    id: 'CRISIS_CAJA_COMPENSACION',
    category: 'ECONOMÍA NACIONAL',
    title: 'REFORMA DEL SISTEMA DE SUBSIDIOS DE LA CAJA DE COMPENSACIÓN',
    desc: 'El coste de subvencionar el gas butano, la harina y el azúcar presiona el presupuesto del Estado.',
    condition: (m) => true,
    options: [
      { text: 'Sustituir la subvención universal por pagos directos del Registro Social Único', stats: { eco: +5, apr: -4, est: -3 }, cost: 200, loyaltyImpact: { RNI: +15, PAM: +10, PPS: -15, USFP: -15 }, news: 'Despliegue del subsidio directo directo a familias vulnerables tras la reforma de la Caja.' },
      { text: 'Mantener congelados los precios del butano y alimentos básicos sin cambios', stats: { apr: +6, est: +3, eco: -5 }, cost: 400, loyaltyImpact: { PPS: +15, USFP: +15, RNI: -10 }, news: 'El Ejecutivo mantendrá las subvenciones tradicionales al gas y la harina.' }
    ]
  },
  {
    id: 'SPECIAL_MODERNIZACION_MILITAR',
    category: 'DEFENSA Y SEGURIDAD',
    title: 'PLAN DE ADQUISICIÓN Y MODERNIZACIÓN DE LAS FAR',
    desc: 'La cúpula de las Fuerzas Armadas Reales solicita renovar los sistemas de defensa aérea y sistemas no tripulados.',
    condition: (m) => true,
    options: [
      { text: 'Adquirir radares avanzados y sistemas de defensa estratégica de última generación', stats: { mil: +8, con: +4, apr: -2 }, cost: 700, loyaltyImpact: { PI: +10, PAM: +10 }, news: 'Las Fuerzas Armadas Reales firman un importante contrato de equipamiento defensivo.' },
      { text: 'Desarrollar una industria de mantenimiento y ensamblaje militar local', stats: { mil: +5, eco: +4, emp: +3 }, cost: 400, loyaltyImpact: { RNI: +15, PAM: +10 }, news: 'Marruecos aprueba el marco regulatorio para la industria de defensa nacional.' }
    ]
  },
  {
    id: 'GEO_ADUANAS_CEUTA_MELILLA',
    category: 'RELACIONES INTERNACIONALES',
    title: 'RÉGIMEN COMERCIAL Y ADUANAS CON CEUTA Y MELILLA',
    desc: 'Comerciantes y sectores regionales presionan para regularizar la aduana comercial fronteriza.',
    condition: (m) => true,
    options: [
      { text: 'Apertura progresiva y controlada de las aduanas comerciales reguladas', stats: { eco: +4, est: +3, apr: +2 }, cost: 50, loyaltyImpact: { RNI: +10, PAM: +10, PJD: -10 }, news: 'Entra en funcionamiento la prueba piloto de aduana comercial en los pasos del norte.' },
      { text: 'Mantener la restricción del comercio fronterizo directo para favorecer los puertos locales', stats: { eco: +2, est: -2, apr: +2 }, cost: 0, loyaltyImpact: { PI: +10, PJD: +10 }, news: 'Rabat mantiene las limitaciones al paso comercial enfatizando la inversión en Nador.' }
    ]
  },
  {
    id: 'REGULACION_REFORMA_FISCAL',
    category: 'FINANZAS PÚBLICAS',
    title: 'REVISION DEL IMPUESTO DE SOCIEDADES Y TRIBUTACIÓN PROGRESIVA',
    desc: 'Recomendaciones internacionales aconsejan simplificar los tramos fiscales e incentivar el empleo formal.',
    condition: (m) => true,
    options: [
      { text: 'Unificar tipos del Impuesto de Sociedades penalizando sectores oligopólicos', stats: { eco: +5, apr: +4, est: +2 }, cost: 0, loyaltyImpact: { USFP: +15, PPS: +15, RNI: -15 }, news: 'Hacienda aprueba la reestructuración del Impuesto de Sociedades para empresas.' },
      { text: 'Conceder exenciones de 5 años a nuevas inversiones en zonas francas e industriales', stats: { eco: +6, emp: +4, apr: -4 }, cost: 200, loyaltyImpact: { RNI: +20, UC: +15, USFP: -15 }, news: 'Incentivos fiscales agresivos para captar capital internacional en polígonos del norte.' }
    ]
  },
  {
    id: 'ESCANDALO_ENRIQUECIMIENTO_ILICITO',
    category: 'CORRUPCIÓN Y JUSTICIA',
    title: 'PROYECTO DE LEY CONTRA EL ENRIQUECIMIENTO ILÍCITO',
    desc: 'Casos mediáticos de contrataciones irregulares reabren el debate sobre la fiscalización de cargos públicos.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar la ley con confiscación preventiva y auditoría de patrimonio obligatorio', stats: { apr: +8, est: +4, con: -2 }, cost: 0, loyaltyImpact: { PJD: +20, PPS: +15, RNI: -10, PAM: -10 }, news: 'Luz verde a la ley de transparencia patrimonial para la función pública.' },
      { text: 'Retirar la norma del trámite parlamentario para elaborar un texto consensuado', stats: { apr: -8, est: -4, eco: +2 }, cost: 0, loyaltyImpact: { RNI: +10, PAM: +10, PJD: -25 }, news: 'El Gobierno retira la ley de enriquecimiento ilícito levantando ampollas en la oposición.' }
    ]
  },
  {
    id: 'SPECIAL_GIGAFACTORIA_BATERIAS',
    category: 'GEOPOLÍTICA & COMERCIO',
    title: 'INSTALACIÓN DE LA GIGAFACTORÍA DE BATERÍAS EN KÉNITRA',
    desc: 'Consorcios automovilísticos internacionales evalúan implantar la mayor planta de baterías para vehículos eléctricos.',
    condition: (m) => true,
    options: [
      { text: 'Subvencionar el suelo industrial e infraestructuras con 250 M€ de fondos públicos', stats: { eco: +8, emp: +6, apr: +4 }, cost: 250, loyaltyImpact: { RNI: +20, PAM: +15, UC: +10 }, news: 'Marruecos cierra el acuerdo para la gigafactoría de baterías en el eje Kénitra-Tánger.' },
      { text: 'Exigir un 40% de componentes e insumos locales sin aportar subsidios directos', stats: { eco: +3, emp: +2, apr: -2 }, cost: 0, loyaltyImpact: { PI: +10, USFP: +10, RNI: -10 }, news: 'Las multinacionales renegocian los plazos tras las condiciones de integración local.' }
    ]
  },
  {
    id: 'TENSION_MIGRACION_SUBSAHARIANA',
    category: 'DEFENSA Y SEGURIDAD',
    title: 'GESTIÓN MIGRATORIA Y REGULARIZACIÓN EXTRAORDINARIA',
    desc: 'Organizaciones internacionales proponen regularizar la residencia de colectivos subsaharianos integrados.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar la regularización extraordinaria con visado de empleo y residencia', stats: { apr: +4, est: +4, con: -2 }, cost: 100, loyaltyImpact: { PPS: +15, USFP: +15, PJD: -15 }, news: 'Marruecos lanza una nueva fase de regularización de residentes subsaharianos.' },
      { text: 'Reforzar las patrullas en los perímetros fronterizos y trasladar campamentos', stats: { con: +5, mil: +3, apr: -2 }, cost: 50, loyaltyImpact: { PJD: +10, PAM: +5, PPS: -10 }, news: 'Dispositivo especial de seguridad en los accesos del norte para frenar la presión.' }
    ]
  },
  {
    id: 'TERREMOTO_AL_HAOUZ_RECONSTRUCCION',
    category: 'EMERGENCIA NACIONAL',
    title: 'PLAN DE RECONSTRUCCIÓN DE LAS ZONAS AFECTADAS EN EL ALTO ATLAS',
    desc: 'Se requiere agilizar el programa de ayudas para la reconstrucción de viviendas e infraestructuras de montaña.',
    condition: (m) => true,
    options: [
      { text: 'Lanzar un plan de choque con 1.200 M€ para vivienda y escuelas rurales', stats: { apr: +10, est: +6, eco: -4 }, cost: 1200, loyaltyImpact: { PAM: +15, MP: +20, PI: +15 }, news: 'Moncloa moviliza recursos masivos para la reconstrucción de las aldeas del Alto Atlas.' },
      { text: 'Gestionar las ayudas a través de fondos de reconstrucción diferidos a 3 años', stats: { apr: -6, est: -4, eco: +2 }, cost: 300, loyaltyImpact: { MP: -20, PAM: -10 }, news: 'Protestas de los afectados en las zonas de montaña por la lentitud de los pagos.' }
    ]
  },
  {
    id: 'ORGANIZACION_MUNDIAL_2030',
    category: 'INFRAESTRUCTURAS',
    title: 'PROYECTO DEL GRAND STADE DE CASABLANCA Y MUNDIAL 2030',
    desc: 'La preparación de la cita mundialista requiere acelerar la construcción del estadio de Benslimane y redes de transporte.',
    condition: (m) => true,
    options: [
      { text: 'Declarar las obras de interés nacional acelerando las conexiones de TGV y estadios', stats: { eco: +7, emp: +5, apr: +5 }, cost: 1500, loyaltyImpact: { RNI: +20, PAM: +20, PI: +15 }, news: 'Luz verde al plan masivo de infraestructuras deportivas y ferroviarias para el Mundial.' },
      { text: 'Priorizar las partidas sanidad y educación moderando el gasto en estadios', stats: { apr: +6, est: +4, eco: -2 }, cost: 400, loyaltyImpact: { PPS: +20, USFP: +20, RNI: -15 }, news: 'El Ejecutivo reajusta el presupuesto del Mundial para blindar el gasto social.' }
    ]
  },
  {
    id: 'ESTRATEGIA_HIDROGENO_VERDE',
    category: 'ENERGÍA & TRANSICIÓN',
    title: 'OFERTA DE MARRUECOS PARA EL HIDRÓGENO VERDE',
    desc: 'Inversores internacionales solicitan 100.000 hectáreas en las regiones del sur para proyectos eólicos y solares.',
    condition: (m) => true,
    options: [
      { text: 'Adjudicar los terrenos con cláusula de transferencia tecnológica e industrial', stats: { eco: +8, emp: +4, apr: +3 }, cost: 100, loyaltyImpact: { RNI: +15, PAM: +15, PI: +10 }, news: 'Marruecos asigna suelo para grandes proyectos de hidrógeno verde con tecnología local.' },
      { text: 'Limitar la concesión a consorcios mixtos con participación de la empresa pública', stats: { eco: +4, est: +3, apr: +2 }, cost: 0, loyaltyImpact: { PI: +15, USFP: +10, RNI: -10 }, news: 'El Estado participará directamente en el accionariado de las plantas de hidrógeno.' }
    ]
  },
  {
    id: 'REFORMA_SANIDAD_AMO_TAHAMON',
    category: 'SANIDAD Y SOCIAL',
    title: 'GENERALIZACIÓN DEL SEGURO DE ENFERMEDAD OBLIGATORIO (AMO)',
    desc: 'Millones de ciudadanos acceden a la cobertura médica pública requerida por la ley de protección social.',
    condition: (m) => true,
    options: [
      { text: 'Financiar con el presupuesto público la cuota de las familias sin ingresos', stats: { apr: +10, est: +6, eco: -6 }, cost: 900, loyaltyImpact: { PPS: +20, USFP: +20, RNI: +10 }, news: 'Aprobada la cobertura total del seguro médico público AMO Tadamon a familias vulnerables.' },
      { text: 'Imponer una coproporción del 20% en las consultas privadas concertadas', stats: { eco: +2, apr: -6, est: -3 }, cost: 200, loyaltyImpact: { PPS: -15, USFP: -15, RNI: +10 }, news: 'Críticas de los usuarios por el copago en las consultas médicas concertadas.' }
    ]
  },
  {
    id: 'AMPLIACION_TANGER_MED',
    category: 'INFRAESTRUCTURAS',
    title: 'AMPLIACIÓN DE LA TERMINAL DE CONTENEDORES DE TÁNGER MED',
    desc: 'El puerto roza la saturación y exige una nueva fase de expansión para competir en el Mediterráneo.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar la fase III de ampliación mediante concesiones de colaboración público-privada', stats: { eco: +8, emp: +4, apr: +2 }, cost: 800, loyaltyImpact: { RNI: +15, UC: +15, PAM: +10 }, news: 'Tánger Med inicia las obras de ampliación para reforzar su liderazgo logístico.' },
      { text: 'Priorizar el desarrollo del nuevo complejo portuario Nador West Med', stats: { eco: +5, emp: +5, apr: +3 }, cost: 1100, loyaltyImpact: { PAM: +15, MP: +15, RNI: -5 }, news: 'El Ejecutivo concentra las inversiones en el puerto industrial de Nador.' }
    ]
  },
  {
    id: 'CRISIS_ACEITE_ARGAN_OLIVA',
    category: 'AGRICULTURA Y MEDIO AMBIENTE',
    title: 'PRECIOS DEL ACEITE DE OLIVA Y PROTECCIÓN DEL SECTOR',
    desc: 'La baja cosecha de aceituna eleva el precio de la garrafa en los mercados locales.',
    condition: (m) => true,
    options: [
      { text: 'Suspender las exportaciones de aceite de oliva hasta normalizar el mercado interno', stats: { apr: +8, est: +4, eco: -3 }, cost: 0, loyaltyImpact: { PPS: +15, USFP: +15, RNI: -15 }, news: 'El Gobierno restringe las ventas al exterior de aceite de oliva para frenar los precios.' },
      { text: 'Conceder subvenciones a la importación de aceites vegetales alternativos', stats: { eco: -3, apr: +2, est: +2 }, cost: 250, loyaltyImpact: { RNI: +10, PI: +10 }, news: 'Subsidios a la importación de aceites para mantener abastecida la cesta básica.' }
    ]
  },
  {
    id: 'PROGRAMA_VILLES_SANS_BIDONVILLES',
    category: 'INFRAESTRUCTURAS Y VIVIENDA',
    title: 'REINICIO DEL PROGRAMA VILLES SANS BIDONVILLES',
    desc: 'Se busca erradicar los núcleos de chabolas persistentes en la periferia de Casablanca y Salé.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar la entrega de pisos sociales en altura y cheques de realojo', stats: { apr: +8, est: +5, eco: -4 }, cost: 700, loyaltyImpact: { PAM: +20, PPS: +15, RNI: +10 }, news: 'Inyección económica para realojar a 20.000 familias en viviendas dignas.' },
      { text: 'Ofrecer parcelas de autoconstrucción asistida con servicios de agua y luz', stats: { apr: +4, est: +3, eco: -2 }, cost: 350, loyaltyImpact: { MP: +15, PI: +10 }, news: 'Plan de lotes de suelo urbanizado para agilizar el realojo periurbano.' }
    ]
  },
  {
    id: 'SECTOR_PHOSPHATES_OCP',
    category: 'ECONOMÍA NACIONAL',
    title: 'ESTRATEGIAS DE PRODUCCIÓN DE FERTILIZANTES VERDES DE LA OCP',
    desc: 'El grupo estatal OCP solicita respaldo institucional para sus inversiones en amoníaco verde.',
    condition: (m) => true,
    options: [
      { text: 'Garantizar el plan de inversiones de 12.000 M€ con avales públicos', stats: { eco: +9, emp: +4, apr: +3 }, cost: 300, loyaltyImpact: { RNI: +15, PI: +15, PAM: +15 }, news: 'Respaldo del Estado a la OCP para liderar el mercado mundial de fertilizantes sostenibles.' },
      { text: 'Destinar parte de los dividendos de la OCP directamente al presupuesto general', stats: { eco: +5, apr: +4, est: +2 }, cost: -500, loyaltyImpact: { PPS: +15, USFP: +15, RNI: -10 }, news: 'Hacienda capta un dividendo extraordinario de los fosfatos para las arcas públicas.' }
    ]
  }
];

// ==========================================
// BANCO DE TITULARES DE CAMPAÑA ELECTORAL
// ==========================================
const CAMPAIGN_HEADLINES = [
  {
    id: 1,
    newspaper: 'LE MATIN',
    headline: 'DEBATE ELECTORAL: EL MODELO DE CRECIMIENTO ECONÓMICO Y LA INVERSIÓN',
    desc: 'Los candidatos exponen su visión sobre el papel del Estado y el sector privado en la creación de empleo. ¿Cuál es tu propuesta?',
    options: [
      { text: 'Fomentar la inversión privada y las exenciones fiscales al sector productivo', score: +15, textResult: 'Atraes al electorado urbano y al sector empresarial.' },
      { text: 'Aumentar el gasto social público en sanidad y educación básica', score: +15, textResult: 'Mobilizas a las clases populares y a los sindicatos.' },
      { text: 'Mantener el rigor en las cuentas del Estado y reducir el déficit', score: +10, textResult: 'Generas confianza entre los organismos financieros.' }
    ]
  },
  {
    id: 2,
    newspaper: 'L'ÉCONOMISTE',
    headline: 'DISPUTA SOBRE LA REFORMA DE LA CAJA DE COMPENSACIÓN',
    desc: 'El debate económico se centra en la sustitución de las subvenciones tradicionales por ayudas directas.',
    options: [
      { text: 'Defender los pagos directos del Registro Social Único a los hogares', score: +15, textResult: 'Iniciativa vista como moderna y bien focalizada.' },
      { text: 'Mantener el subsidio al pan, azúcar y gas butano para evitar subidas de precios', score: +12, textResult: 'Calmas los temores de pérdida de poder adquisitivo.' }
    ]
  },
  {
    id: 3,
    newspaper: 'HESPRESS',
    headline: 'LA REGIONALIZACIÓN AVANZADA Y LAS PROVINCIAS DEL SUR EN EL CENTRO DE LA CAMPAÑA',
    desc: 'Sectores locales exigen mayor autonomía presupuestaria para las comarcas y regiones.',
    options: [
      { text: 'Prometer la transferencia de competencias y fondos a los consejos regionales', score: +15, textResult: 'Gran acogida en las provincias del Sur y en el ámbito rural.' },
      { text: 'Centralizar los grandes proyectos desde los ministerios en Rabat', score: +5, textResult: 'Discurso de control administrativo estatal.' }
    ]
  },
  {
    id: 4,
    newspaper: 'TELQUEL',
    headline: 'EL ACCESO A LA VIVIENDA Y LA ERRADICACIÓN DE CHABOLAS A DEBATE',
    desc: 'Las organizaciones urbanas reclaman soluciones urgentes para la vivienda social asequible.',
    options: [
      { text: 'Aumentar las subvenciones directas a compradores de primera vivienda social', score: +15, textResult: 'Propuesta estrella muy bien acogida por jóvenes y familias.' },
      { text: 'Incentivar a las promotoras privadas mediante suelo fiscalmente protegido', score: +10, textResult: 'Apoyo firme del sector de la construcción.' }
    ]
  },
  {
    id: 5,
    newspaper: 'MEDIAS24',
    headline: 'LA GESTIÓN DEL AGUA Y LA LUCHA CONTRA LA SEQUÍA EN LA AGENDA',
    desc: 'La crisis hídrica obliga a pronunciarse sobre el modelo de infraestructuras del agua.',
    options: [
      { text: 'Construir una red masiva de plantas desalinizadoras alimentadas por energía solar', score: +15, textResult: 'Puntos extra por aportar una visión tecnológica de largo plazo.' },
      { text: 'Priorizar los trasvases y la protección de los acuíferos subterráneos', score: +10, textResult: 'Propuesta tradicional bien vista por los agricultores.' }
    ]
  },
  {
    id: 6,
    newspaper: 'AL YAOUM 24',
    headline: 'LA REFORMA EDUCATIVA Y LA FORMACIÓN PROFESIONAL DUAL',
    desc: 'Docentes y familias piden mejoras en la escuela pública y salarios de los profesores.',
    options: [
      { text: 'Aumentar los sueldos del profesorado y dignificar el estatus docente', score: +15, textResult: 'Desconvocas tensiones con el colectivo de la enseñanza.' },
      { text: 'Impulsar la Formación Profesional orientada a la industria del motor y aeronáutica', score: +12, textResult: 'Aplaudido por las industrias exportadoras.' }
    ]
  },
  {
    id: 7,
    newspaper: '2M',
    headline: 'LA GENERALIZACIÓN DE LA COBERTURA MÉDICA PÚBLICA (AMO)',
    desc: 'Debate sobre cómo financiar el seguro de enfermedad para toda la población.',
    options: [
      { text: 'Garantizar la gratuidad total de la AMO para las familias con bajos ingresos', score: +15, textResult: 'Enorme reconocimiento de las clases trabajadoras.' },
      { text: 'Incentivar la concertación con la red de clínicas privadas de salud', score: +8, textResult: 'Respaldo del sector médico privado.' }
    ]
  },
  {
    id: 8,
    newspaper: 'SNRT',
    headline: 'EL ROL DE LA DIPLOMACIA Y LA PROYECCIÓN EN ÁFRICA',
    desc: 'Foros internacionales valoran la consolidación del comercio y las rutas transaharianas.',
    options: [
      { text: 'Potenciar la cooperación sur-sur y la presencia bancaria en África subsahariana', score: +15, textResult: 'Sólida imagen de liderazgo continental.' },
      { text: 'Priorizar los acuerdos de libre comercio con la Unión Europea', score: +10, textResult: 'Ganas apoyo en las empresas exportadoras.' }
    ]
  },
  {
    id: 9,
    newspaper: 'LA VIE ÉCO',
    headline: 'LA INTEGRACIÓN DEL SECTOR INFORMAL EN LA ECONOMÍA FORMAL',
    desc: 'Un tercio del empleo no cotiza en la Seguridad Social; la patronal pide incentivos.',
    options: [
      { text: 'Crear el estatus de Autoempresario con cuota fija simbólica e impuestos cero el primer año', score: +15, textResult: 'Propuesta muy popular entre comerciantes y emprendedores.' },
      { text: 'Intensificar las inspecciones del trabajo en los mercados tradicionales', score: +2, textResult: 'Genera rechazo en los pequeños comercios.' }
    ]
  },
  {
    id: 10,
    newspaper: 'LE MATIN',
    headline: 'EL MINUTO DE ORO: LLAMAMIENTO FINAL A LAS URNAS',
    desc: 'Última alocución televisada antes de la jornada de reflexión.',
    options: [
      { text: 'Pedir una mayoría sólida para consolidar el Estado Social y las reformas', score: +15, textResult: 'Transmites estabilidad y vocación de gobierno.' },
      { text: 'Apelar a la unidad nacional y al orgullo del desarrollo del Reino', score: +15, textResult: 'Emocionas a tus simpatizantes en el cierre de campaña.' }
    ]
  }
];

// ==========================================
// BANCO DE NOTICIAS DE PRENSA (NOTICIAS MENSUALES)
// ==========================================
const PRESS_NEWS_BANK = [
  {
    id: 'NEWS_MAR_1',
    newspaper: 'LE MATIN',
    headline: 'RECORD DE EXPORTACIONES DE AUTOMÓVILES Y FOSFATOS',
    desc: 'Los datos de la Oficina de Cambios muestran un crecimiento de las ventas del sector del motor en Europa.',
    options: [
      { text: 'Destacar en rueda de prensa la solidez del tejido industrial', stats: { eco: +4, apr: +3 }, news: 'El Gobierno celebra el impulso industrial y exportador del país.' },
      { text: 'Destinar el superávit comercial a sanear las cuentas de las empresas públicas', stats: { eco: +6, est: +2 }, news: 'Hacienda amortiza deuda de las empresas estatales con el excedente.' }
    ]
  },
  {
    id: 'NEWS_MAR_2',
    newspaper: 'L'ÉCONOMISTE',
    headline: 'LA INFLACIÓN DE ALIMENTOS FRESCOS CEDE TRES PUNTOS',
    desc: 'Las buenas cosechas en el Souss reducen el precio del tomate y las hortalizas en los mercados.',
    options: [
      { text: 'Aprovechar la tregua para fijar acuerdos de precios estables en los zocos', stats: { apr: +5, eco: +2 }, news: 'El Ejecutivo firma un protocolo de precios moderados con distribuidores.' }
    ]
  },
  {
    id: 'NEWS_MAR_3',
    newspaper: 'HESPRESS',
    headline: 'MÁXIMOS HISTÓRICOS EN LA LLEGADA DE TURISTAS A MARRAKECH Y AGADIR',
    desc: 'Los aeropuertos internacionales registran un aumento del 18% en pasajeros durante el trimestre.',
    options: [
      { text: 'Lanzar un plan de inversión para la renovación de las medinas históricas', stats: { apr: +5, eco: +3 }, cost: 100, news: 'Turismo aprueba fondos para embellecer los cascos históricos.' }
    ]
  },
  {
    id: 'NEWS_MAR_4',
    newspaper: 'MEDIAS24',
    headline: 'AVANCES EN LAS OBRAS DE LA DESALADORA DE CASABLANCA',
    desc: 'La mega-instalación hídrica entra en su fase final asegurando el consumo urbano futuro.',
    options: [
      { text: 'Poner en marcha la fase de pruebas acelerando los plazos de entrega', stats: { est: +5, apr: +4 }, cost: 150, news: 'El Gobierno supervisa la llegada del agua desalada al área metropolitana.' }
    ]
  },
  {
    id: 'NEWS_MAR_5',
    newspaper: 'TELQUEL',
    headline: 'SINDICATOS DOCENTES PIDEN LA REVISIÓN DEL ESTATUTO DEL PROFESORADO',
    desc: 'Asociaciones de la enseñanza convocan paros demandando la integración en la función pública.',
    options: [
      { text: 'Firmar el nuevo estatuto unificado equiparando las condiciones del personal regional', stats: { apr: +7, est: +4, eco: -4 }, cost: 500, news: 'Acuerdo histórico entre Educación y los sindicatos docentes.' },
      { text: 'Desestimar las peticiones manteniendo el régimen de contratación regional', stats: { apr: -6, est: -5 }, news: 'Continuidad en las protestas educativas tras no alcanzarse un acuerdo.' }
    ]
  },
  {
    id: 'NEWS_MAR_6',
    newspaper: '2M',
    headline: 'INVERSIÓN MULTIMILLONARIA EN EL PARQUE EÓLICO DE TAZA',
    desc: 'Nuevos aerogeneradores aportan 300 MW limpios a la red eléctrica nacional.',
    options: [
      { text: 'Presumir del éxito en la cuota de energías renovables en la mezcla eléctrica', stats: { apr: +4, eco: +3 }, news: 'Energía destaca la contribución del eólico a la soberanía energética.' }
    ]
  },
  {
    id: 'NEWS_MAR_7',
    newspaper: 'SNRT',
    headline: 'ACUERDO DE COOPERACIÓN TECNOLÓGICA CON LA UNIÓN EUROPEA',
    desc: 'Bruselas aporta 200 M€ en subvenciones para programas de formación digital e inteligencia artificial.',
    options: [
      { text: 'Destinar los fondos a la modernización de los institutos técnicos de FP', stats: { eco: +5, emp: +3 }, news: 'Los fondos europeos impulsarán las aulas de informática en los centros de FP.' }
    ]
  },
  {
    id: 'NEWS_MAR_8',
    newspaper: 'LA VIE ÉCO',
    headline: 'LA OFICINA DE FOSFATOS (OCP) PRESENTA RESULTADOS RECORD DE FACTURACIÓN',
    desc: 'El aumento de la demanda mundial de fertilizantes impulsa la contribución fiscal de la entidad.',
    options: [
      { text: 'Reinvertir el beneficio en la producción de hidrógeno verde para amoníaco', stats: { eco: +6, emp: +2 }, news: 'La OCP acelera su plan de neutralidad en carbono con hidrógeno verde.' }
    ]
  }
];

// ==========================================
// BANCO DE DECISIONES DE MINISTERIOS
// ==========================================
const MINISTRY_DECISIONS_BANK = {
  sanidad: [
    { title: 'Inauguración y equipamiento de centros de salud de proximidad', cost: 250, stats: { apr: +2, est: +1 } },
    { title: 'Suministro urgente de medicamentos para enfermedades crónicas', cost: 200, stats: { apr: +2 } },
    { title: 'Digitalización del expediente médico en el CHU de Rabat', cost: 150, stats: { eco: +1 } },
    { title: 'Programa de unidades médicas móviles para comarcas atlas', cost: 180, stats: { apr: +2, est: +1 } },
    { title: 'Refuerzo de enfermería y personal en las urgencias hospitalarias', cost: 300, stats: { apr: +2, emp: +1 } },
    { title: 'Modernización del parque de ambulancias y transporte sanitario', cost: 120, stats: { est: +1 } },
    { title: 'Ampliación de salas de maternidad en áreas rurales', cost: 210, stats: { apr: +2 } },
    { title: 'Campañas sanitarias de vacunación y nutrición infantil', cost: 100, stats: { est: +1 } }
  ],
  educacion: [
    { title: 'Programa de transporte escolar para evitar el abandono rural', cost: 180, stats: { apr: +2, est: +1 } },
    { title: 'Equipamiento informático en escuelas primarias', cost: 220, stats: { emp: +2 } },
    { title: 'Rehabilitación y climatización de aulas en provincias del sur', cost: 250, stats: { apr: +2 } },
    { title: 'Aumento de la oferta de comedores escolares en preescolar', cost: 190, stats: { apr: +2 } },
    { title: 'Nuevos centros de Formación Profesional en industrias del motor', cost: 310, stats: { emp: +3, eco: +1 } },
    { title: 'Incentivos a docentes destinados en zonas aisladas', cost: 140, stats: { est: +1 } }
  ],
  infraestructuras: [
    { title: 'Refuerzo y reasfaltado de la red de carreteras nacionales', cost: 350, stats: { eco: +2, est: +1 } },
    { title: 'Obras de dragado y mantenimiento en puertos pesqueros', cost: 200, stats: { eco: +1 } },
    { title: 'Construcción de viaductos y desvíos urbanos en Casablanca', cost: 420, stats: { eco: +2, apr: +1 } },
    { title: 'Mantenimiento de las líneas ferroviarias de trenes convencionales', cost: 280, stats: { est: +1 } },
    { title: 'Construcción de pequeñas presas de retención de crecidas', cost: 310, stats: { est: +2, apr: +1 } }
  ],
  interior: [
    { title: 'Modernización de los centros de control de la DGSN', cost: 220, stats: { con: +2, est: +1 } },
    { title: 'Nuevos vehículos e inspección táctica para la Gendarmería Real', cost: 260, stats: { con: +2 } },
    { title: 'Digitalización del padrón e identificación civil', cost: 110, stats: { est: +1 } },
    { title: 'Refuerzo de la protección civil en prevención de inundaciones', cost: 180, stats: { est: +2, apr: +1 } }
  ],
  defensa: [
    { title: 'Mantenimiento de helicópteros de salvamento y patrulla de las FAR', cost: 380, stats: { mil: +2 } },
    { title: 'Partida para maniobras combinadas multinacionales', cost: 300, stats: { mil: +2 } },
    { title: 'Renovación de cuarteles e instalaciones de alojamiento de la tropa', cost: 220, stats: { mil: +2, apr: +1 } },
    { title: 'Sistemas de comunicación e inteligencia en zonas fronterizas', cost: 350, stats: { mil: +2, est: +1 } }
  ],
  economia: [
    { title: 'Línea de créditos ICO/CCG para la modernización de Pymes', cost: 300, stats: { eco: +2, emp: +2 } },
    { title: 'Ventanilla única de facilitación de inversiones extranjeras', cost: 100, stats: { eco: +2 } },
    { title: 'Plan de incentivos a la formalización del comercio en zocos', cost: 150, stats: { eco: +2, apr: +1 } },
    { title: 'Incentivos fiscales a las empresas emergentes innovadoras', cost: 180, stats: { eco: +2 } }
  ],
  vivienda: [
    { title: 'Programa de bonificación a la compra de primera vivienda asequible', cost: 350, stats: { apr: +3 } },
    { title: 'Rehabilitación de fachadas e inmuebles antiguos en las medinas', cost: 200, stats: { apr: +2, eco: +1 } },
    { title: 'Suelo urbanizado con servicios para promociones sociales', cost: 280, stats: { apr: +2, emp: +1 } }
  ],
  territorio: [
    { title: 'Fondo de desarrollo rural para la electrificación de aldeas', cost: 260, stats: { est: +2, apr: +2 } },
    { title: 'Programas de conservación de oasis y lucha contra la desertificación', cost: 220, stats: { est: +2, apr: +1 } },
    { title: 'Planes de desarrollo integrado en las provincias del Sur', cost: 400, stats: { est: +2, eco: +2 } }
  ],
  trabajo: [
    { title: 'Cursos de formación laboral acelerada para jóvenes desempleados', cost: 200, stats: { emp: +3 } },
    { title: 'Inspecciones de seguridad en talleres e industrias textiles', cost: 110, stats: { emp: +2, apr: +1 } },
    { title: 'Incentivos a las pymes que contraten trabajadores indefinidos', cost: 290, stats: { emp: +3, eco: +1 } }
  ],
  justicia: [
    { title: 'Digitalización del sistema judicial y tribunales comerciales', cost: 180, stats: { est: +2, eco: +1 } },
    { title: 'Construcción de nuevas sedes de juzgados de familia', cost: 210, stats: { apr: +2, est: +1 } }
  ],
  exteriores: [
    { title: 'Apertura de nuevos consulados en nodos comerciales estratégicos', cost: 150, stats: { eco: +2, est: +1 } },
    { title: 'Promoción de la cultura marroquí y diplomacia económica', cost: 180, stats: { apr: +2, eco: +1 } }
  ],
  transicion_ecologica: [
    { title: 'Incentivos para la instalación de bombas de agua fotovoltaicas', cost: 250, stats: { eco: +2, apr: +2 } },
    { title: 'Planes de reforestación y conservación de bosques de cedro', cost: 190, stats: { est: +2, apr: +1 } }
  ],
  cultura: [
    { title: 'Apoyo a festivales culturales y artes tradicionales', cost: 150, stats: { apr: +2, eco: +1 } },
    { title: 'Restauración de monumentos y kasbahs históricas', cost: 210, stats: { apr: +2, eco: +1 } }
  ],
  igualdad: [
    { title: 'Centros de acogida y orientación jurídica para mujeres', cost: 140, stats: { apr: +3, est: +1 } },
    { title: 'Programas de fomento del microcrédito y emprendimiento femenino', cost: 180, stats: { emp: +2, apr: +2 } }
  ]
};

// ==========================================
// EVENTOS DE VIVIENDA
// ==========================================
const HOUSING_EVENTS = [
  {
    id: 'HOUS_MAR_1',
    category: 'VIVIENDA Y URBANISMO',
    title: 'PROTESTAS CONTRA LA SUBIDA DE PRECIOS DEL ALQUILER URBANO',
    desc: 'Familias de las periferias de Casablanca y Rabat piden ampliar el parque de vivienda con alquiler moderado.',
    options: [
      { text: 'Aprobar la deducción fiscal para promotores que destinen vivienda al alquiler social', stats: { apr: +8, eco: -2, est: +3 }, cost: 250, loyaltyImpact: { PAM: +15, PPS: +15, RNI: +10 }, news: 'Nuevos incentivos a las promotoras para incrementar la vivienda de alquiler social.' },
      { text: 'Confiar en la autorregulación del mercado mediante la liberación de suelo', stats: { eco: +3, apr: -6, est: -3 }, cost: 0, loyaltyImpact: { RNI: +15, UC: +10, PPS: -15 }, news: 'El Ejecutivo prioriza la liberalización de suelo ante las peticiones del sector residencial.' }
    ]
  },
  {
    id: 'HOUS_MAR_2',
    category: 'REHABILITACIÓN HISTÓRICA',
    title: 'RIESGO DE DERRUMBE DE EDIFICIOS EN LAS MEDINAS ANTIGUAS',
    desc: 'Inmuebles históricos amurallados requieren consolidación urgente tras las lluvias invernales.',
    options: [
      { text: 'Inyectar un fondo público de reconstrucción y seguridad estructural en medinas', stats: { apr: +8, est: +4, eco: -2 }, cost: 300, loyaltyImpact: { PI: +20, USFP: +15, PAM: +10 }, news: 'Lanzado un programa urgente de rehabilitación edilicia en las medinas históricas.' },
      { text: 'Ofrecer créditos blandos a los propietarios particulares para su reparación', stats: { eco: +1, apr: -2, est: +1 }, cost: 80, loyaltyImpact: { RNI: +10, UC: +10 }, news: 'Hacienda habilita préstamos bonificados para el arreglo de fincas privadas.' }
    ]
  }
];

// ==========================================
// MINISTROS REALES
// ==========================================
const REAL_MINISTERS = [
  // --- ECONOMÍA Y HACIENDA ---
  { 
    id: "fettah_rni", name: "Nadia Fettah Alaoui", party: "RNI", portfolio: "economia",
    desc: "+1.5% Crecimiento Económico, +0.5% Rigor Presupuestario",
    pros: "+1.5% Crecimiento Económico, +0.5% Rigor Presupuestario",
    cons: "-1.0% Aprobación Social Popular",
    effects: { eco: 1.5, apr: -1.0 }
  },
  { 
    id: "baraka_pi", name: "Nizar Baraka", party: "PI", portfolio: "economia",
    desc: "+1.5% Equilibrio Regional e Infraestructuras",
    pros: "+1.5% Equilibrio Regional e Infraestructuras",
    cons: "-0.5% Aumento de la Carga del Déficit",
    effects: { eco: 1.5, est: -0.5 }
  },
  { 
    id: "benkirane_pjd", name: "Abdelilah Benkirane", party: "PJD", portfolio: "economia",
    desc: "+1.5% Apoyo de Bases Populares",
    pros: "+1.5% Apoyo Populista y Reforma de Subsidios",
    cons: "-1.5% Tensión con Inversores Privados",
    effects: { apr: 1.5, eco: -1.5 }
  },
  { 
    id: "lachguar_usfp", name: "Driss Lachguar", party: "USFP", portfolio: "economia",
    desc: "+1.5% Empleo y Salarios",
    pros: "+1.5% Fomento del Empleo y Cohesión",
    cons: "-1.0% Confianza Empresarial",
    effects: { emp: 1.5, eco: -1.0 }
  },

  // --- INTERIOR Y SEGURIDAD ---
  { 
    id: "laftit_otr", name: "Abdelouafi Laftit", party: "OTR", portfolio: "interior",
    desc: "+2.0% Control Policial y Orden Público",
    pros: "+2.0% Control Policial, +1.0% Estabilidad Estatal",
    cons: "-1.0% Apertura Político-Social",
    effects: { con: 2.0, est: 1.0, apr: -1.0 }
  },
  { 
    id: "ouahbi_pam", name: "Abdellatif Ouahbi", party: "PAM", portfolio: "interior",
    desc: "+1.5% Modernización Administrativa",
    pros: "+1.5% Modernización e Inserción Local",
    cons: "-1.0% Fricción con Colectivos Religiosos",
    effects: { con: 1.5, apr: -1.0 }
  },
  { 
    id: "benabdallah_pps", name: "Nabil Benabdallah", party: "PPS", portfolio: "interior",
    desc: "+1.5% Mediación Social Urbano-Rural",
    pros: "+1.5% Mediación Social y Concertación",
    cons: "-1.0% Firmeza Policial",
    effects: { apr: 1.5, con: -1.0 }
  },

  // --- DEFENSA NACIONAL ---
  { 
    id: "loudiyi_otr", name: "Abdeltif Loudiyi", party: "OTR", portfolio: "defensa",
    desc: "+2.5% Lealtad y Capacidad de las FAR",
    pros: "+2.5% Lealtad y Capacidad de las FAR",
    cons: "-1.0% Gasto Presupuestario Civil",
    effects: { mil: 2.5, eco: -1.0 }
  },
  { 
    id: "boussaid_rni", name: "Mohamed Boussaid", party: "RNI", portfolio: "defensa",
    desc: "+1.5% Eficiencia de Compras Militares",
    pros: "+1.5% Eficiencia y Contratos Militares",
    cons: "-0.5% Menor Perfil Operativo Táctico",
    effects: { mil: 1.5, eco: -0.5 }
  },

  // --- VIVIENDA Y URBANISMO ---
  { 
    id: "mansouri_pam", name: "Fatima Ezzahra El Mansouri", party: "PAM", portfolio: "vivienda",
    desc: "+2.0% Erradicación de Chabolas y Vivienda Social",
    pros: "+2.0% Avances en Vivienda y Realojo",
    cons: "-1.0% Coste para el Tesoro Público",
    effects: { apr: 2.0, eco: -1.0 }
  },
  { 
    id: "bouchareb_mp", name: "Nouzha Bouchareb", party: "MP", portfolio: "vivienda",
    desc: "+1.5% Desarrollo Urbano en Zonas Rurales",
    pros: "+1.5% Desarrollo Urbano Comarcal",
    cons: "-0.5% Eficiencia en Mega-Proyectos",
    effects: { apr: 1.5, eco: -0.5 }
  },

  // --- POLÍTICA TERRITORIAL ---
  { 
    id: "baraka_territorio", name: "Nizar Baraka", party: "PI", portfolio: "territorio",
    desc: "+2.0% Cohesión Territorial y Provincias del Sur",
    pros: "+2.0% Inversión en Cohesión Territorial",
    cons: "-1.0% Tensión de Reparto de Recursos",
    effects: { est: 2.0, eco: -1.0 }
  },
  { 
    id: "laenser_mp", name: "Mohand Laenser", party: "MP", portfolio: "territorio",
    desc: "+1.5% Respaldo del Ámbito Rural y Montaña",
    pros: "+1.5% Respaldo del Mundo Rural",
    cons: "-0.5% Modernización de Grandes Urbes",
    effects: { est: 1.5, apr: 0.5 }
  },

  // --- SANIDAD Y SALUD PÚBLICA ---
  {
    id: "ait_taleb_otr", name: "Khalid Aït Taleb", party: "OTR", portfolio: "sanidad",
    desc: "+2.0% Despliegue de la Cobertura Médica (AMO)",
    pros: "+2.0% Despliegue de Cobertura Sanitaria Universal",
    cons: "-1.0% Gasto Corriente en Salud",
    effects: { apr: 2.0, eco: -1.0 }
  },
  {
    id: "baitas_rni", name: "Mustafa Baitas", party: "RNI", portfolio: "sanidad",
    desc: "+1.5% Concertación Sanitaria Privada",
    pros: "+1.5% Eficiencia en Concertación Médica",
    cons: "-0.5% Reticencia de Sindicatos Médicos",
    effects: { eco: 1.5, apr: -0.5 }
  },

  // --- EDUCACIÓN Y FORMACIÓN ---
  {
    id: "benmoussa_otr", name: "Chakib Benmoussa", party: "OTR", portfolio: "educacion",
    desc: "+2.0% Reformas Curriculares y Calidad Educativa",
    pros: "+2.0% Calidad y Hoja de Ruta Educativa",
    cons: "-1.0% Resistencia de Gremios de Docentes",
    effects: { emp: 2.0, est: -1.0 }
  },
  {
    id: "amzazi_mp", name: "Saaïd Amzazi", party: "MP", portfolio: "educacion",
    desc: "+1.5% Formación Profesional e Inclusión Rural",
    pros: "+1.5% Impulso a la FP y Cobertura Rural",
    cons: "-0.5% Tensiones de Presupuesto",
    effects: { emp: 1.5, apr: 0.5 }
  },

  // --- TRABAJO Y ECONOMÍA SOCIAL ---
  {
    id: "sekkouri_pam", name: "Younes Sekkouri", party: "PAM", portfolio: "trabajo",
    desc: "+2.0% Empleo Joven y Diálogo Social",
    pros: "+2.0% Diálogo Social y Programas de Empleo",
    cons: "-1.0% Presión sobre las Pymes",
    effects: { emp: 2.0, eco: -1.0 }
  },
  {
    id: "yatim_pjd", name: "Mohamed Yatim", party: "PJD", portfolio: "trabajo",
    desc: "+1.5% Protección Social del Trabajador",
    pros: "+1.5% Cobertura y Subsidios Laborales",
    cons: "-1.0% Flexibilidad Empresarial",
    effects: { apr: 1.5, eco: -1.0 }
  },

  // --- JUSTICIA ---
  {
    id: "ouahbi_justicia", name: "Abdellatif Ouahbi", party: "PAM", portfolio: "justicia",
    desc: "+2.0% Digitalización y Reformas Penales",
    pros: "+2.0% Agilización y Modernización del Penal",
    cons: "-1.0% Choque con Sectores Conservadores",
    effects: { est: 2.0, apr: -1.0 }
  },
  {
    id: "ramid_pjd", name: "Mustafa Ramid", party: "PJD", portfolio: "justicia",
    desc: "+1.5% Rigor Jurídico e Inspecciones",
    pros: "+1.5% Rigor e Inspección de Tribunales",
    cons: "-1.0% Agilidad en Causas Comerciales",
    effects: { est: 1.5, eco: -1.0 }
  },

  // --- ASUNTOS EXTERIORES Y COOPERACIÓN ---
  {
    id: "bourita_otr", name: "Nasser Bourita", party: "OTR", portfolio: "exteriores",
    desc: "+2.5% Éxitos Diplomáticos Internacionales",
    pros: "+2.5% Reconocimientos Internacionales y Firmeza",
    cons: "-0.5% Tensiones con Países Vecinos",
    effects: { est: 2.5, apr: 1.0, eco: 0.5 }
  },
  {
    id: "mezouar_rni", name: "Salaheddine Mezouar", party: "RNI", portfolio: "exteriores",
    desc: "+1.5% Diplomacia Económica y Comercio",
    pros: "+1.5% Atracción de Capital Extranjero",
    cons: "-0.5% Presencia en Foros Multilaterales",
    effects: { eco: 1.5, est: 0.5 }
  },

  // --- TRANSICIÓN ECOLÓGICA Y ENERGÍA ---
  {
    id: "benali_pam", name: "Leila Benali", party: "PAM", portfolio: "transicion_ecologica",
    desc: "+2.0% Despliegue de Renovables y Litio/Baterías",
    pros: "+2.0% Transición Energética e Hidrógeno Verde",
    cons: "-1.0% Transición de la Industria Tradicional",
    effects: { eco: 2.0, apr: 1.0 }
  },
  {
    id: "rabbah_pjd", name: "Aziz Rabbah", party: "PJD", portfolio: "transicion_ecologica",
    desc: "+1.5% Reducción de la Dependencia Energética",
    pros: "+1.5% Soberanía Energética y Minas",
    cons: "-0.5% Ritmo de Inversión Extranjera",
    effects: { eco: 1.5, est: 0.5 }
  },

  // --- CULTURA Y JUVENTUD ---
  {
    id: "bensaid_pam", name: "Mohamed Mehdi Bensaid", party: "PAM", portfolio: "cultura",
    desc: "+2.0% Promoción Cultural e Industria del Videojuego",
    pros: "+2.0% Impulso a la Juventud y Patrimonio Cultural",
    cons: "-0.5% Reparto de Subvenciones en Provincias",
    effects: { apr: 2.0, eco: 0.5 }
  },

  // --- IGUALDAD Y FAMILIA ---
  {
    id: "hayar_pi", name: "Aawatif Hayar", party: "PI", portfolio: "igualdad",
    desc: "+2.0% Inclusión Social y Asistencia a Familias",
    pros: "+2.0% Asistencia a Familias Vulnerables",
    cons: "-0.5% Ritmo de Reformas Legislativas Radicarles",
    effects: { apr: 2.0, est: 0.5 }
  }
];

// ==========================================
// OBJETIVOS DEL GOBIERNO
// ==========================================
const GOAL_POOL = [
  { id: 'eco',   icon: 'fa-chart-line',   title: 'Marruecos Emergente',  desc: 'Mantén la Economía ≥ 70%',            check: s => s.metrics.eco >= 70 },
  { id: 'est',   icon: 'fa-shield-halved',title: 'Estabilidad del Reino',desc: 'Mantén la Estabilidad ≥ 65%',         check: s => s.metrics.est >= 65 },
  { id: 'apr',   icon: 'fa-heart',        title: 'Aprobación Ciudadana', desc: 'Mantén la Aprobación ≥ 65%',          check: s => s.metrics.apr >= 65 },
  { id: 'emp',   icon: 'fa-briefcase',    title: 'Pleno Empleo Industrial',desc: 'Mantén el Empleo ≥ 70%',            check: s => s.metrics.emp >= 70 },
  { id: 'mil',   icon: 'fa-person-military-pointing', title: 'Fuerzas Armadas Leales', desc: 'Mantén la Lealtad Militar ≥ 60%', check: s => s.metrics.mil >= 60 },
  { id: 'caja',  icon: 'fa-vault',        title: 'Superávit en Tesorería',desc: 'Acumula una tesorería ≥ 120.000 M€', check: s => (Number(s.treasury) || 0) >= 120000 },
  { id: 'doble', icon: 'fa-scale-balanced', title: 'Doble Confianza',   desc: 'Aprobación ≥ 60% y Estabilidad ≥ 60%',check: s => s.metrics.apr >= 60 && s.metrics.est >= 60 },
  { id: 'todo',  icon: 'fa-star',         title: 'Reino Equilibrado',   desc: 'Todas las métricas ≥ 55%',            check: s => Object.values(s.metrics).every(v => v >= 55) }
];

const GOAL_ACTIONS = [
  { id: 'tv',     icon: 'fa-tv',           title: 'Alocución al País',        cap: 15, cost: 0,    cd: 30, fx: { apr: 6, est: 2 },        news: 'El Presidente del Gobierno comparece en prime time explicando las reformas.' },
  { id: 'ue',     icon: 'fa-earth-africa', title: 'Cumbre de la Unión Africana',cap: 20, cost: 0,    cd: 45, fx: { eco: 6, apr: 2 },        news: 'Marruecos firma acuerdos bilaterales en la cumbre continental africana.' },
  { id: 'pacto',  icon: 'fa-handshake',    title: 'Pacto Nacional de Inversión',cap: 25, cost: 0,    cd: 60, fx: { est: 6, apr: 3, con: 4 },news: 'Gobierno y agentes económicos firman un histórico Pacto por la Inversión.' },
  { id: 'empleo', icon: 'fa-hammer',       title: 'Plan de Choque AWRAS',      cap: 10, cost: 3000, cd: 40, fx: { emp: 8, eco: 3 },        news: 'El Gobierno moviliza 3.000 M€ para contratos de empleo directo en comarcas.' },
  { id: 'army',   icon: 'fa-medal',        title: 'Modernización de las FAR',  cap: 15, cost: 1500, cd: 50, fx: { mil: 8, apr: -3 },       news: 'Nuevas partidas para equipamiento y condiciones laborales en las Fuerzas Armadas Reales.' },
  { id: 'ahorro', icon: 'fa-piggy-bank',   title: 'Ajuste de Gasto Público',   cap: 0,  cost: 0,    cd: 60, fx: { apr: -5, est: -2 }, gain: 8000, news: 'Consolidación fiscal: contención del gasto que ahorra 8.000 M€ a las arcas.' }
];

// ==========================================
// ÁRBOL DE FOCOS NACIONALES
// ==========================================
const FOCUS_TREE = [
  { id: 'e1', b: 'eco', title: 'Reforma Tributaria',      days: 365, now: { eco: 4 },            spirit: { name: 'Fisco Eficiente',      daily: {},                    money: 600 } },
  { id: 'e2', b: 'eco', title: 'Plan Emergence y OCP',    days: 420, req: 'e1', now: { emp: 3 },  spirit: { name: 'Polos Industriales',   daily: { eco: .05, emp: .04 }, money: 0 } },
  { id: 'e3', b: 'eco', title: 'Proyección Atlántica',    days: 480, req: 'e2', now: { apr: 2 }, cash: 15000, spirit: null },
  { id: 'e4', b: 'eco', title: 'Marca Marruecos',         days: 540, req: 'e3', now: {},          spirit: { name: 'Hub Logístico',        daily: { eco: .06, apr: .03 }, money: 1200 } },
  { id: 's1', b: 'soc', title: 'Generalización AMO',      days: 365, now: { apr: 3 },            spirit: { name: 'Cobertura Sanitaria',  daily: { est: .03 },           money: -500 } },
  { id: 's2', b: 'soc', title: 'Pacto Educativo',         days: 420, req: 's1', now: {},         spirit: { name: 'Capital Humano',       daily: { emp: .04, eco: .02 }, money: -400 } },
  { id: 's3', b: 'soc', title: 'Villes Sans Bidonvilles', days: 480, req: 's2', now: { apr: 4 }, spirit: { name: 'Vivienda Dignificación', daily: { apr: .05 },        money: -600 } },
  { id: 's4', b: 'soc', title: 'Estado Social',           days: 540, req: 's3', now: { est: 4 }, spirit: { name: 'Protección Social',    daily: { est: .05, apr: .04 }, money: -900 } },
  { id: 'g1', b: 'seg', title: 'Modernización DGSN',      days: 365, now: { est: 4 },            spirit: { name: 'Seguridad Ciudadana',  daily: { est: .03 },           money: -300 } },
  { id: 'g2', b: 'seg', title: 'Ciberseguridad Estatal',  days: 420, req: 'g1', now: {},         spirit: { name: 'Escudo Digital',       daily: { est: .03, eco: .02 }, money: -300 } },
  { id: 'g3', b: 'seg', title: 'FAR Profesionales',       days: 480, req: 'g2', now: { mil: 6 }, spirit: { name: 'Tropa Operativa',      daily: { mil: .05 },           money: -600 } },
  { id: 'g4', b: 'seg', title: 'Defensa Estratégica',     days: 540, req: 'g3', now: { mil: 4 }, spirit: { name: 'Escudo Nacional',      daily: { mil: .04, est: .03 }, money: -700 } },
  { id: 'd1', b: 'dip', title: 'Diplomacia Africana',     days: 365, now: { apr: 2 },            spirit: { name: 'Voz Continental',      daily: { apr: .03 },           money: 0 } },
  { id: 'd2', b: 'dip', title: 'Eje con la UE',           days: 420, req: 'd1', now: {}, cash: 8000, spirit: { name: 'Socio Estratégico', daily: { eco: .04 },           money: 0 } },
  { id: 'd3', b: 'dip', title: 'Cumbre de Rabat',         days: 480, req: 'd2', now: { est: 3, mil: 3 }, spirit: null },
  { id: 'd4', b: 'dip', title: 'Potencia Regional',       days: 540, req: 'd3', now: {},         spirit: { name: 'Liderazgo Norteáfrica', daily: { apr: .05, eco: .04 }, money: 800 } }
];

const FOCUS_LINKS = [
  { t: 'Ralentización económica afecta al empleo', on: s => s.eco < 40, fx: { emp: -.08 } },
  { t: 'Economía sólida genera contrataciones',    on: s => s.eco > 65, fx: { emp: .04 } },
  { t: 'Desempleo elevado desgasta la aprobación', on: s => s.emp < 40, fx: { apr: -.08, est: -.04 } },
  { t: 'Pleno empleo refuerza el apoyo popular',   on: s => s.emp > 65, fx: { apr: .04 } },
  { t: 'Tensiones sociales frenan la inversión',   on: s => s.est < 40, fx: { eco: -.06 } },
  { t: 'Baja aprobación alimenta el malestar',     on: s => s.apr < 35, fx: { est: -.05 } },
  { t: 'Descontento en cuarteles afecta a estabilidad', on: s => s.mil < 30, fx: { est: -.04 } },
  { t: 'Estabilidad institucional atrae inversores', on: s => s.est > 70, fx: { eco: .03 } }
];

// ==========================================
// CRISIS Y EVENTOS DE SHOCK
// ==========================================
const SHOCK_POOL = [
  { cat: 'EMERGENCIA', min: 'interior', title: 'TERREMOTO EN EL ALTO ATLAS', desc: 'Varias provincias sufren daños por un sismo; se requiere respuesta coordinada de emergencia.',
    options: [ { text: 'Desplegar logística de las FAR y fondo de emergencia', cost: 500, stats: { est: 4, apr: 3 }, news: 'Marruecos despliega al Ejército y recursos de auxilio en el Atlas.' }, { text: 'Dejar la ayuda en manos de corporaciones provinciales', cost: 0, stats: { est: -5, apr: -6 }, news: 'Lentitud en la asistencia genera descontento en las comarcas afectadas.' } ] },
  { cat: 'LABORAL', min: 'trabajo', title: 'HUELGA GENERAL SECTORIAL', desc: 'Centrales sindicales convocan paros en protesta por la inflación de la cesta alimentaria.',
    options: [ { text: 'Convocar mesa de diálogo social con mejoras en la AMO', cost: 150, stats: { emp: 3, apr: 3, eco: -2 }, news: 'Acuerdo con sindicatos tras conceder mejoras salariales y médicas.' }, { text: 'Mantener la postura sin ceder en la negociación', cost: 0, stats: { est: -5, apr: -6, eco: -3 }, news: 'La huelga paraliza el transporte y los servicios en grandes ciudades.' } ] },
  { cat: 'ESCÁNDALO', min: 'justicia', title: 'INVESTIGACIÓN POR CONTRATOS EN LICITACIONES', desc: 'Informes de auditoría detectan irregularidades en la adjudicación de obras públicas.',
    options: [ { text: 'Cesar de inmediato a los altos cargos investigados', cost: 0, stats: { apr: -2, est: +3 }, news: 'Relevo inmediato de los responsables tras abrir expediente judicial.' }, { text: 'Defender la inocencia de los equipos técnicos', cost: 0, stats: { apr: -8, est: -4 }, news: 'Críticas de la oposición por falta de contundencia ante la corrupción.' } ] },
  { cat: 'MERCADOS', min: 'economia', title: 'ENCARECIMIENTO DE LA DEUDA EXTERNA', desc: 'Variaciones de tipos internacionales elevan el coste de emisión de bonos soberanos.',
    options: [ { text: 'Aprobar contención de gasto secundario para calmar inversores', cost: 0, stats: { eco: 4, apr: -5, emp: -2 }, news: 'Hacienda aprueba contención presupuestaria para proteger el rating soberano.' }, { text: 'Mantener las partidas previstas echando mano de reservas de divisas', cost: 0, stats: { eco: -5, emp: -2 }, news: 'Aumento del déficit soberano genera tensión en el mercado de bonos.' } ] },
  { cat: 'AGUA', min: 'transicion_ecologica', title: 'ESTRÉS HÍDRICO SEVERO EN LA CUENCA DEL UMB ER-RBIA', desc: 'Embalses clave caen por debajo del 12% exigiendo cortar el agua de riego.',
    options: [ { text: 'Alquilar desaladoras portátiles y activar camiones cisterna', cost: 350, stats: { est: 3, apr: +2 }, news: 'El Gobierno instala desaladoras móviles para garantizar el abastecimiento.' }, { text: 'Dejar que las comunas apliquen racionamiento nocturno', cost: 0, stats: { apr: -6, est: -3 }, news: 'Protestas vecinales por los cortes de agua durante la ola de calor.' } ] }
];

const INTL_ACTIONS = [
  { id: 'visit', title: 'Visita Oficial',   cap: 10, cost: 0,    rel: 12, cd: 40 },
  { id: 'trade', title: 'Acuerdo Comercial',cap: 0,  cost: 80, rel: 8,  cd: 30 }
];

// ==========================================
// PROYECTOS DE ESTADO (MEGAPROYECTOS)
// ==========================================
const PROJECTS = [
  { id: 'ave', icon: 'fa-train', title: 'TGV Kénitra-Marrakech-Agadir', spirit: { name: 'Red Ferroviaria TGV', daily: { eco: .04, emp: .02 }, money: 80 },
    phases: [{ n: 'Estudios de trazado y expropiación', cost: 1500, days: 30, now: {}, run: {} }, { n: 'Plataforma, túneles y electrificación', cost: 9500, days: 110, now: { emp: 2, eco: 1 }, run: { emp: .02, eco: .01 } }, { n: 'Adquisición de trenes y pruebas de vía', cost: 4000, days: 45, now: { eco: 2, emp: 1 }, run: {} }] },
  { id: 'hosp', icon: 'fa-hospital', title: 'Red de Complejos Hospitalarios CHU', spirit: { name: 'Red Hospitalaria CHU', daily: { est: .03, apr: .02 }, money: -350 },
    phases: [{ n: 'Proyecto arquitectónico y suelo', cost: 900, days: 25, now: {}, run: {} }, { n: 'Construcción de los centros regionales', cost: 6000, days: 90, now: { emp: 1 }, run: { emp: .015 } }, { n: 'Equipamiento médico e integración de personal', cost: 2100, days: 40, now: { apr: 4 }, run: {} }] },
  { id: 'agua', icon: 'fa-droplet', title: 'Estrategia de Desaladoras y Presas', spirit: { name: 'Independencia Hídrica', daily: { est: .03, eco: .02 }, money: -60 },
    phases: [{ n: 'Estudios hidrológicos e impacto', cost: 1000, days: 35, now: {}, run: {} }, { n: 'Construcción de desaladoras y canalizaciones', cost: 7500, days: 120, now: { emp: 1 }, run: { emp: .012 } }, { n: 'Interconexión de cuencas y puesta en marcha', cost: 2500, days: 45, now: { est: 3 }, run: {} }] },
  { id: 'renov', icon: 'fa-solar-panel', title: 'Complejos Solares Noor y Hidrógeno', spirit: { name: 'Liderazgo Renovable', daily: { eco: .05 }, money: 250 },
    phases: [{ n: 'Licitación de parques y terrenos', cost: 1600, days: 40, now: {}, run: {} }, { n: 'Instalación de paneles, espejos y eólica', cost: 9800, days: 130, now: { eco: 1, emp: 1 }, run: { emp: .015, eco: .01 } }, { n: 'Redes de evacuación e hidrógeno verde', cost: 2600, days: 50, now: { eco: 3 }, run: {} }] },
  { id: 'viv', icon: 'fa-house', title: 'Villes Sans Bidonvilles', spirit: { name: 'Vivienda Social Digna', daily: { apr: .04, est: .02 }, money: -200 },
    phases: [{ n: 'Censo y cesión de parcelas', cost: 800, days: 30, now: {}, run: {} }, { n: 'Edificación de complejos de realojo', cost: 5600, days: 100, now: { emp: 1 }, run: { emp: .015 } }, { n: 'Adjudicación y urbanización completa', cost: 1600, days: 35, now: { apr: 5 }, run: {} }] },
  { id: 'digi', icon: 'fa-ship', title: 'Megapuertos Nador West y Tánger Med', spirit: { name: 'Polos Logísticos Marítimos', daily: { eco: .03, emp: .03 }, money: 150 },
    phases: [{ n: 'Diseño e infraestructura de diques', cost: 700, days: 25, now: {}, run: {} }, { n: 'Terminales de contenedores e hidrocarburos', cost: 5200, days: 80, now: { eco: 1 }, run: { eco: .01 } }, { n: 'Zonas francas y conexión ferroviaria', cost: 2100, days: 40, now: { eco: 2, emp: 2 }, run: {} }] }
];

// ==========================================
// LOGROS DEL JUEGO
// ==========================================
const ACHIEVEMENTS = [
  { id: 'm1', icon: 'fa-flag', title: 'Primer Mandato', desc: 'Cumple tu primera misión al frente del Gobierno', ok: s => s.goals && s.goals.done >= 1 },
  { id: 'm5', icon: 'fa-list-check', title: 'Gestor Eficaz', desc: 'Cumple 5 misiones en una legislatura', ok: s => s.goals && s.goals.done >= 5 },
  { id: 'leg', icon: 'fa-crown', title: 'Legado Histórico', desc: 'Alcanza el Legado Histórico del Reino', ok: s => s.goals && s.goals.legacy },
  { id: 'f1', icon: 'fa-diagram-project', title: 'Visión de Estado', desc: 'Completa un foco nacional estratégico', ok: s => s.focus && s.focus.done.length >= 1 },
  { id: 'fb', icon: 'fa-sitemap', title: 'Doctrina Completa', desc: 'Completa una rama entera del árbol de focos', ok: s => s.focus && typeof FOCUS_BRANCHES !== 'undefined' && Object.keys(FOCUS_BRANCHES).some(b => FOCUS_TREE.filter(f => f.b === b).every(f => s.focus.done.includes(f.id))) },
  { id: 'p3', icon: 'fa-helmet-safety', title: 'Constructor del Reino', desc: 'Termina 3 megaproyectos de Estado', ok: s => s.proj && s.proj.done.length >= 3 },
  { id: 'dip', icon: 'fa-handshake', title: 'Diplomático', desc: 'Consigue la máxima relación con socios internacionales', ok: s => s.intl && Object.values(s.intl.rel).every(r => r >= 70) },
  { id: 'rich', icon: 'fa-vault', title: 'Caja Fuerte', desc: 'Llega a 100.000 M€ en Tesorería', ok: s => (Number(s.treasury) || 0) >= 100000 },
  { id: 'all', icon: 'fa-star', title: 'Potencia Regional', desc: 'Todas las métricas ≥ 70% a la vez', ok: s => s.metrics && ['eco', 'est', 'emp', 'apr', 'mil'].every(k => s.metrics[k] >= 70) },
  { id: 'abyss', icon: 'fa-skull', title: 'Al Borde del Abismo', desc: 'Emite más de 250.000 M€ de deuda pública', ok: s => s.debt && s.debt.amount >= 250000 },
  { id: 'surv', icon: 'fa-shield', title: 'Superviviente', desc: 'Completa una legislatura entera', ok: s => s.campaign && s.campaign.history.length >= 1 },
  { id: 'iron', icon: 'fa-fire', title: 'Veterano de Hierro', desc: 'Llega a la 2.ª legislatura en Crisis Permanente', ok: s => s.campaign && s.campaign.diff === 'extremo' && s.campaign.current >= 2 }
];

// ==========================================
// BANCO CENTRAL (BANK AL-MAGHRIB)
// ==========================================
const BDE_GOVS = [
  { id: 'tecnico', name: 'Abdellatif Jouahri', tag: 'Tecnócrata ortodoxo', cred: 18, desc: 'Muy respetado por organismos internacionales y celoso de la estabilidad de precios.' },
  { id: 'afin', name: 'Karim Zaza', tag: 'Afín al Gobierno', cred: -8, desc: 'Facilita liquidez e informes favorables, aunque los mercados son cautos.' },
  { id: 'indep', name: 'Omar Kabbaj', tag: 'Independiente crítico', cred: 10, desc: 'Analista independiente, muy estricto con los niveles de endeudamiento.' }
];

const BDE_ACTIONS = [
  { id: 'informe', icon: 'fa-file-lines', label: 'Encargar informe de solvencia soberana', desc: 'Auditoría externa de Bank Al-Maghrib que transmite calma a los inversores internacionales.', cost: 150, cd: 60, when: () => true,
    run: B => { const g = typeof bdeGov === 'function' ? bdeGov() : null; B.cred += g && g.id !== 'afin' ? 5 : 2; B.shock -= 15; } },
  { id: 'dividendo', icon: 'fa-hand-holding-dollar', label: 'Adelantar remesa de beneficios de Bank Al-Maghrib', desc: 'Ingreso inmediato de liquidez (+3.000 M€) para las arcas públicas.', cost: 0, cd: 180, when: () => true,
    run: B => { B.cred -= 10; B.shock += 20; if (typeof registerFinancialTransaction === 'function') registerFinancialTransaction('Adelanto de beneficios de Bank Al-Maghrib', 3000, 'economia'); } },
  { id: 'tpi', icon: 'fa-shield-halved', label: 'Solicitar línea de liquidez y precaución al FMI', desc: 'Acuciada necesidad de divisas para contener presiones sobre el dirham.', cost: 0, cd: 150, when: () => true,
    run: B => { B.shock -= 100; B.cred += 3; if (typeof focusMetricAdd === 'function') focusMetricAdd('est', -3); } },
  { id: 'devaluar', icon: 'fa-arrow-trend-down', label: 'Ajustar la banda de flotación del Dirham', desc: 'Mejora la competitividad de las exportaciones (+6 Economía) pero eleva el coste importado (−5 Aprobación).', cost: 0, cd: 180, when: () => true,
    run: B => { B.cred -= 8; B.shock -= 30; if (typeof focusMetricAdd === 'function') { focusMetricAdd('eco', 6); focusMetricAdd('apr', -5); } } },
  { id: 'reservas', icon: 'fa-vault', label: 'Utilizar reservas de divisas', desc: 'Utiliza 4.000 M€ de reservas para estabilizar la moneda nacional y la inflación.', cost: 4000, cd: 90, when: () => true,
    run: B => { B.cred += 6; B.shock -= 50; } },
  { id: 'imprimir', icon: 'fa-print', label: 'Financiación directa del Tesoro', desc: 'Emisión extraordinaria de dirhams (+6.000 M€). Riesgo de presiones inflacionistas.', cost: 0, cd: 120, when: () => true,
    run: B => { B.cred -= 15; B.shock += 45; if (typeof focusMetricAdd === 'function') focusMetricAdd('apr', -4); if (typeof registerFinancialTransaction === 'function') registerFinancialTransaction('Financiación monetaria del Banco Central', 6000, 'economia'); } }
];
