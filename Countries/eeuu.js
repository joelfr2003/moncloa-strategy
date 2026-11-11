// =====================================================================
//  ESTADOS UNIDOS — MONCLOA STRATEGY  (Countries/eeuu.js)
//  Escala: k = 15 respecto a España (PIB ≈ 27.000.000 M€). Dinero en M€.
//  Cámara de Representantes: 435 escaños, mayoría 218. Escenario ficticio 2026.
//  Después de copiarlo: node Countries/generate-index.js  ·  subir VERSION de sw.js  ·  Ctrl+F5
// =====================================================================

// ---- 1. CÁMARA Y PARTIDOS ----------------------------------------------------------
const CHAMBER = { seats: 435, majority: 218 };
const SCENARIOS = {
  ACTUAL: {
    id: 'ACTUAL', title: 'ESTADOS UNIDOS (2026)', treasury: 1188000, startYear: 2026,
    desc: 'Cámara de Representantes de 435 escaños (mayoría: 218), partida entre un ala republicana populista, los republicanos tradicionales y dos familias demócratas. Aranceles, inmigración, deuda récord, inteligencia artificial y la rivalidad con China marcan la agenda de la Casa Blanca.',
    parties: [
      { id: 'DEMP', name: 'Demócratas Progresistas', leader: 'Caucus Progresista', seats: 100, baseSeats: 100, minSeats: 0, maxSeats: 190, basePct: 23.0, color: '#7c3aed', isRegional: false, ideology: 'Izquierda', spectrumOrder: 1, redLines: ['MAGA'] },
      { id: 'DEMM', name: 'Demócratas Moderados', leader: 'Hakeem Jeffries', seats: 115, baseSeats: 115, minSeats: 0, maxSeats: 210, basePct: 26.4, color: '#2563eb', isRegional: false, ideology: 'Centroizquierda', spectrumOrder: 3, redLines: ['MAGA'] },
      { id: 'GOPT', name: 'Republicanos Tradicionales', leader: 'Mike Johnson', seats: 70, baseSeats: 70, minSeats: 0, maxSeats: 160, basePct: 16.1, color: '#dc2626', isRegional: false, ideology: 'Centroderecha', spectrumOrder: 5, redLines: ['DEMP'] },
      { id: 'MAGA', name: 'Republicanos MAGA', leader: 'Freedom Caucus y aliados', seats: 150, baseSeats: 150, minSeats: 0, maxSeats: 230, basePct: 34.5, color: '#b91c1c', isRegional: false, ideology: 'Derecha populista', spectrumOrder: 7, redLines: ['DEMP', 'DEMM'] }
    ]
  }
};

// ---- 2. EVENTOS Y DECISIONES ---------------------------------------------------------
const DYNAMIC_EVENTS = [
  { id: 'US_ARANCELES', category: 'ECONOMÍA', title: 'GUERRA ARANCELARIA CON CHINA', desc: 'Los fabricantes piden protección frente a las importaciones chinas, mientras minoristas y agricultores advierten de una subida de precios y de represalias.', condition: m => true,
    options: [
      { text: 'Aranceles generalizados a productos chinos', stats: { eco: -2, emp: 3, apr: 1, mil: 1 }, cost: 0, loyaltyImpact: { MAGA: 12, GOPT: 3, DEMP: -6, DEMM: -6 }, news: 'La Casa Blanca impone nuevos aranceles a China y Pekín promete represalias.' },
      { text: 'Aranceles selectivos y negociación comercial', stats: { eco: 2, apr: 1 }, cost: 6000, loyaltyImpact: { GOPT: 8, DEMM: 6, MAGA: -6 }, news: 'Washington y Pekín abren una mesa de negociación con aranceles selectivos.' },
      { text: 'Rebajar aranceles para frenar la inflación', stats: { eco: 3, emp: -2, apr: 2 }, cost: 0, loyaltyImpact: { DEMM: 8, DEMP: 4, MAGA: -12 }, news: 'La Casa Blanca rebaja los aranceles para contener los precios al consumo.' } ] },
  { id: 'US_FRONTERA', category: 'SEGURIDAD', title: 'CRISIS EN LA FRONTERA SUR', desc: 'Las llegadas irregulares se disparan y los gobernadores de Texas y Arizona exigen medidas urgentes. Las organizaciones de derechos civiles piden garantías.', condition: m => true,
    options: [
      { text: 'Reforzar el muro y las deportaciones masivas', stats: { est: 2, mil: 2, apr: -1, con: 3 }, cost: 15000, loyaltyImpact: { MAGA: 14, GOPT: 6, DEMP: -14, DEMM: -8 }, news: 'La Casa Blanca anuncia un plan de deportaciones y refuerzo del muro fronterizo.' },
      { text: 'Reforma migratoria con vía de regularización', stats: { eco: 2, emp: 1, apr: 2, con: -3 }, cost: 9000, loyaltyImpact: { DEMM: 10, DEMP: 8, GOPT: 2, MAGA: -14 }, news: 'El Gobierno propone una reforma migratoria con regularización y más controles.' },
      { text: 'Acuerdo con México para contener los flujos', stats: { est: 1, apr: 1, mil: -1 }, cost: 4500, loyaltyImpact: { GOPT: 6, DEMM: 4 }, news: 'Washington y Ciudad de México pactan medidas conjuntas en la frontera.' } ] },
  { id: 'US_DEUDA', category: 'ECONOMÍA', title: 'TECHO DE DEUDA Y CIERRE DEL GOBIERNO', desc: 'El Tesoro se acerca al límite legal de endeudamiento. Sin acuerdo, las agencias federales cerrarán y las agencias de calificación amenazan con rebajar la nota.', condition: m => true,
    options: [
      { text: 'Pactar subir el techo con recortes moderados', stats: { eco: 3, apr: -3, est: 2 }, cost: 0, loyaltyImpact: { GOPT: 8, DEMM: 8, MAGA: -10, DEMP: -8 }, news: 'Congreso y Casa Blanca evitan el impago con un pacto de recortes.' },
      { text: 'Subir el techo sin condiciones', stats: { eco: 2, apr: 2, est: 1 }, cost: 0, loyaltyImpact: { DEMM: 10, DEMP: 6, MAGA: -15, GOPT: -6 }, news: 'El techo de deuda se eleva sin condiciones tras una dura votación.' },
      { text: 'Resistir: cierre parcial del Gobierno federal', stats: { eco: -5, est: -4, apr: -5, mil: -2 }, cost: 0, loyaltyImpact: { MAGA: 12, DEMP: -4 }, news: 'El Gobierno federal cierra parcialmente por falta de acuerdo presupuestario.' } ] },
  { id: 'US_MEDICAID', category: 'SANIDAD', title: 'REFORMA DE MEDICAID Y OBAMACARE', desc: 'El déficit sanitario crece. Republicanos quieren recortar Medicaid; demócratas exigen blindar los subsidios del seguro médico.', condition: m => true,
    options: [
      { text: 'Recortar Medicaid y fijar requisitos laborales', stats: { eco: 2, apr: -5, est: -1 }, cost: 0, loyaltyImpact: { MAGA: 10, GOPT: 8, DEMP: -16, DEMM: -10 }, news: 'El Gobierno recorta Medicaid: millones de personas podrían perder cobertura.' },
      { text: 'Blindar los subsidios del seguro médico', stats: { eco: -2, apr: 5, est: 2 }, cost: 30000, loyaltyImpact: { DEMP: 12, DEMM: 10, MAGA: -12, GOPT: -6 }, news: 'La Casa Blanca blinda los subsidios sanitarios y amplía la cobertura.' },
      { text: 'Reforma gradual con competencia entre aseguradoras', stats: { eco: 1, apr: 1 }, cost: 6000, loyaltyImpact: { GOPT: 8, DEMM: 4 }, news: 'Se aprueba una reforma sanitaria gradual con más competencia.' } ] },
  { id: 'US_IA', category: 'TECNOLOGÍA', title: 'REGULACIÓN DE LA INTELIGENCIA ARTIFICIAL', desc: 'Silicon Valley presiona contra cualquier norma, mientras sindicatos y expertos piden límites ante la pérdida de empleos y los riesgos de seguridad.', condition: m => true,
    options: [
      { text: 'Desregular y apostar por el liderazgo tecnológico', stats: { eco: 4, emp: -2, apr: 1 }, cost: 0, loyaltyImpact: { MAGA: 6, GOPT: 6, DEMP: -8 }, news: 'El Gobierno apuesta por desregular la IA para liderar frente a China.' },
      { text: 'Aprobar una ley federal de seguridad en IA', stats: { eco: -1, emp: 2, apr: 2, est: 2 }, cost: 3000, loyaltyImpact: { DEMM: 8, DEMP: 10, MAGA: -6 }, news: 'Washington aprueba una ley federal de seguridad para la inteligencia artificial.' },
      { text: 'Fondo de transición para trabajadores desplazados', stats: { emp: 3, apr: 3, eco: -1 }, cost: 12000, loyaltyImpact: { DEMP: 10, DEMM: 6, GOPT: -4 }, news: 'Un fondo federal ayudará a los trabajadores desplazados por la IA.' } ] },
  { id: 'US_CORTE', category: 'JUSTICIA', title: 'FALLO DEL TRIBUNAL SUPREMO SOBRE EL ABORTO', desc: 'Un nuevo caso llega al Supremo y los estados se dividen entre prohibiciones y refugios legales. Las calles se llenan de manifestantes.', condition: m => true,
    options: [
      { text: 'Apoyar una norma federal que fije límites', stats: { con: 4, est: -2, apr: -2 }, cost: 0, loyaltyImpact: { MAGA: 10, GOPT: 6, DEMP: -14, DEMM: -8 }, news: 'La Casa Blanca respalda una norma federal restrictiva sobre el aborto.' },
      { text: 'Proteger el derecho por ley federal', stats: { con: -4, apr: 2, est: -1 }, cost: 0, loyaltyImpact: { DEMP: 12, DEMM: 10, MAGA: -14, GOPT: -6 }, news: 'El Gobierno impulsa una ley federal que protege el derecho al aborto.' },
      { text: 'Dejar la decisión a cada estado', stats: { est: 1, apr: -1 }, cost: 0, loyaltyImpact: { GOPT: 6, MAGA: 2 }, news: 'La Casa Blanca deja la regulación del aborto en manos de los estados.' } ] },
  { id: 'US_UCRANIA', category: 'EXTERIOR', title: 'AYUDA MILITAR A UCRANIA Y COMPROMISO CON LA OTAN', desc: 'Los aliados europeos piden que Washington mantenga el apoyo a Kiev y la defensa colectiva, mientras el Congreso discute el coste.', condition: m => true,
    options: [
      { text: 'Mantener y ampliar la ayuda militar', stats: { mil: 3, eco: -1, apr: -1 }, cost: 18000, loyaltyImpact: { GOPT: 6, DEMM: 8, DEMP: -2, MAGA: -12 }, news: 'EE. UU. amplía la ayuda militar a Ucrania y reafirma su compromiso con la OTAN.' },
      { text: 'Condicionar la ayuda a una negociación de paz', stats: { apr: 1, est: 1 }, cost: 6000, loyaltyImpact: { MAGA: 6, GOPT: 3, DEMM: -4 }, news: 'Washington condiciona su ayuda a Kiev a una mesa de negociación con Moscú.' },
      { text: 'Retirar el apoyo y reducir el gasto', stats: { eco: 1, mil: -3, apr: -1 }, cost: 0, loyaltyImpact: { MAGA: 12, DEMM: -10, DEMP: 2 }, news: 'La Casa Blanca recorta la ayuda a Ucrania y presiona a los aliados europeos.' } ] },
  { id: 'US_ENERGIA', category: 'ENERGÍA', title: 'PERFORACIÓN, FRACKING Y TRANSICIÓN VERDE', desc: 'Los precios de la gasolina suben y la industria petrolera pide más permisos. Los ecologistas reclaman acelerar las renovables.', condition: m => true,
    options: [
      { text: 'Más permisos de perforación y exportación de gas', stats: { eco: 3, emp: 2, con: 1, apr: -1 }, cost: 0, loyaltyImpact: { MAGA: 10, GOPT: 8, DEMP: -12 }, news: 'EE. UU. dispara los permisos de perforación y la exportación de gas natural.' },
      { text: 'Subsidios a renovables y redes eléctricas', stats: { eco: -1, emp: 2, apr: 2, est: 1 }, cost: 24000, loyaltyImpact: { DEMP: 12, DEMM: 8, MAGA: -10 }, news: 'Un gran plan federal acelera las renovables y modernizar la red eléctrica.' },
      { text: 'Estrategia «todo lo anterior»: gas, nuclear y renovables', stats: { eco: 2, emp: 1, apr: 1 }, cost: 15000, loyaltyImpact: { GOPT: 8, DEMM: 6, DEMP: -3 }, news: 'La Casa Blanca presenta una estrategia energética mixta con nuclear y gas.' } ] }
];
const CAMPAIGN_HEADLINES = [
  { id: 1, newspaper: 'THE NEW YORK TIMES', headline: 'INFLACIÓN Y PRECIO DE LA CESTA DE LA COMPRA', desc: 'Los votantes culpan a la Casa Blanca de los precios en los supermercados. ¿Cómo respondes?',
    options: [ { text: 'Anunciar rebajas de aranceles y ayudas', score: +9, textResult: 'El anuncio alivia a las familias y te devuelve la iniciativa en campaña.' }, { text: 'Culpar a la Reserva Federal', score: -4, textResult: 'Suena a excusa y la oposición lo explota durante días.' } ] },
  { id: 2, newspaper: 'FOX NEWS', headline: 'POLÉMICA EN LA FRONTERA', desc: 'Las imágenes de la frontera dominan los programas de máxima audiencia. ¿Qué haces?',
    options: [ { text: 'Visitar la frontera y anunciar más agentes', score: +8, textResult: 'Tu mensaje de firmeza moviliza a tu electorado.' }, { text: 'Pedir calma y una reforma pactada', score: +2, textResult: 'Proyectas moderación, pero tu base lo ve tibio.' } ] },
  { id: 3, newspaper: 'THE WALL STREET JOURNAL', headline: 'LOS MERCADOS DUDAN DE LA DEUDA', desc: 'Los bonos del Tesoro caen y se habla de un déficit fuera de control.',
    options: [ { text: 'Prometer un plan creíble de consolidación', score: +6, textResult: 'Los mercados respiran y ganas credibilidad entre los votantes moderados.' }, { text: 'Ignorarlo y hablar de crecimiento', score: -3, textResult: 'Parece que no entiendes la preocupación y pierdes terreno.' } ] },
  { id: 4, newspaper: 'THE WASHINGTON POST', headline: 'ESCÁNDALO POR FILTRACIONES EN LA ADMINISTRACIÓN', desc: 'Una filtración deja en evidencia desacuerdos internos en el Gabinete.',
    options: [ { text: 'Abrir una investigación interna', score: +4, textResult: 'La respuesta contiene el daño, aunque alimenta el relato de caos.' }, { text: 'Desmentirlo y atacar a la prensa', score: -2, textResult: 'Tu base aplaude, pero el resto desconfía.' } ] },
  { id: 5, newspaper: 'CNN', headline: 'MUERTES POR ARMAS DE FUEGO', desc: 'Un nuevo tiroteo conmociona al país y se reabre el debate sobre las armas.',
    options: [ { text: 'Ampliar controles de antecedentes', score: +5, textResult: 'El gesto conecta con los suburbios, pero la NRA reacciona con dureza.' }, { text: 'Defender la Segunda Enmienda y reforzar la seguridad escolar', score: +4, textResult: 'Tu electorado rural lo celebra; los medios te critican.' } ] },
  { id: 6, newspaper: 'POLITICO', headline: 'DEBATE CARA A CARA', desc: 'Decenas de millones de espectadores siguen el debate decisivo. ¿Qué estrategia eliges?',
    options: [ { text: 'Agresivo: ir a la yugular', score: -1, textResult: 'Genera titulares, pero divide a los indecisos.' }, { text: 'Presidencial: balance de gestión', score: +4, textResult: 'Proyectas solvencia y los sondeos te dan una ligera ventaja.' }, { text: 'Cercano: hablar de lo cotidiano', score: +3, textResult: 'Conectas con las familias y ganas simpatía.' } ] }
];
const PRESS_NEWS_BANK = [
  { id: 'NEWS_FED', newspaper: 'BLOOMBERG', headline: 'LA RESERVA FEDERAL MANTIENE LOS TIPOS', desc: 'Los mercados reaccionan con volatilidad y el presidente critica en redes la decisión del banco central.',
    options: [ { text: 'Respetar la independencia de la Fed', stats: { eco: 2, apr: -1 }, cost: 0, news: 'La Casa Blanca respeta la independencia de la Reserva Federal.' }, { text: 'Presionar públicamente para bajar tipos', stats: { eco: -1, apr: 2 }, news: 'El presidente presiona a la Fed y los mercados se inquietan.' } ] },
  { id: 'NEWS_TECH', newspaper: 'THE VERGE', headline: 'BIG TECH, EN EL PUNTO DE MIRA', desc: 'Una demanda antimonopolio amenaza con trocear a un gigante tecnológico.',
    options: [ { text: 'Apoyar la demanda antimonopolio', stats: { apr: 3, eco: -1 }, cost: 600, news: 'La Administración respalda la demanda para fragmentar a la gran tecnológica.' }, { text: 'Negociar un acuerdo con la empresa', stats: { eco: 2, apr: -2 }, news: 'El Gobierno pacta con la tecnológica y evita el juicio.' } ] },
  { id: 'NEWS_HURRICANE', newspaper: 'ASSOCIATED PRESS', headline: 'HURACÁN EN EL GOLFO DE MÉXICO', desc: 'Un huracán de categoría 4 amenaza Luisiana y Texas. Piden ayuda federal urgente.',
    options: [ { text: 'Declarar emergencia y enviar a la FEMA', stats: { apr: 4, est: 2 }, cost: 6000, news: 'La Casa Blanca declara la emergencia y moviliza a la FEMA.' }, { text: 'Dejar que respondan los estados', stats: { apr: -5, est: -3 }, news: 'Críticas por la lentitud de la respuesta federal ante el huracán.' } ] },
  { id: 'NEWS_CAMPUS', newspaper: 'THE ATLANTIC', headline: 'PROTESTAS EN LAS UNIVERSIDADES', desc: 'Los campus se llenan de manifestaciones por la guerra en Oriente Medio y los costes de la matrícula.',
    options: [ { text: 'Condicionar fondos federales a medidas de orden', stats: { est: 2, con: 2, apr: -1 }, news: 'Washington condiciona los fondos a las universidades que no controlen las protestas.' }, { text: 'Abrir un diálogo con los rectores', stats: { apr: 2, est: 1 }, cost: 300, news: 'La Casa Blanca abre un diálogo con las universidades.' } ] },
  { id: 'NEWS_FENTANILO', newspaper: 'USA TODAY', headline: 'CRISIS DEL FENTANILO', desc: 'Las muertes por sobredosis siguen cobrándose miles de vidas al año.',
    options: [ { text: 'Ofensiva contra los cárteles', stats: { est: 2, mil: 1, apr: 1 }, cost: 4500, news: 'EE. UU. lanza una ofensiva contra los cárteles del fentanilo.' }, { text: 'Plan de tratamiento y prevención', stats: { apr: 3, est: 2 }, cost: 9000, news: 'Un plan federal de tratamiento busca frenar las sobredosis.' } ] },
  { id: 'NEWS_NASA', newspaper: 'SPACE NEWS', headline: 'CARRERA ESPACIAL CON CHINA', desc: 'Pekín anuncia un nuevo hito lunar y se reabre el debate sobre el presupuesto de la NASA.',
    options: [ { text: 'Aumentar el presupuesto espacial', stats: { eco: 1, apr: 2, mil: 1 }, cost: 7500, news: 'Washington refuerza el programa lunar para no perder la carrera espacial.' }, { text: 'Priorizar la inversión privada', stats: { eco: 1, apr: 0 }, news: 'La Casa Blanca confía en las empresas privadas para el programa espacial.' } ] }
];
const MINISTRY_DECISIONS_BANK = {
  sanidad: [ { title: 'Ampliar la cobertura de salud mental y adicciones', cost: 9000, stats: { apr: 5, est: 2 } }, { title: 'Plan de reducción de precios de medicamentos', cost: 6000, stats: { apr: 4, eco: -1 } }, { title: 'Reforzar la preparación ante pandemias', cost: 7500, stats: { est: 2, apr: 2 } } ],
  educacion: [ { title: 'Condonar parte de la deuda estudiantil', cost: 30000, stats: { apr: 6, eco: -2 } }, { title: 'Plan de formación profesional y aprendices', cost: 7500, stats: { emp: 3, eco: 1 } }, { title: 'Becas por mérito para universidades públicas', cost: 6000, stats: { apr: 3 } } ],
  infraestructuras: [ { title: 'Renovar puentes, carreteras y aeropuertos', cost: 24000, stats: { emp: 3, eco: 2 } }, { title: 'Banda ancha rural universal', cost: 12000, stats: { eco: 2, apr: 3 } }, { title: 'Modernizar el control del tráfico aéreo', cost: 9000, stats: { est: 2, eco: 1 } } ],
  interior: [ { title: 'Contratar miles de agentes de frontera', cost: 9000, stats: { est: 3, mil: 1 } }, { title: 'Reforma policial y cámaras corporales', cost: 4500, stats: { apr: 3, est: 1 } }, { title: 'Reforzar la ciberseguridad de infraestructuras críticas', cost: 7500, stats: { est: 3, mil: 1 } } ],
  defensa: [ { title: 'Modernizar la flota naval y los submarinos', cost: 45000, stats: { mil: 5, eco: 1 } }, { title: 'Escudo antimisiles de nueva generación', cost: 60000, stats: { mil: 4, est: 2 } }, { title: 'Aumentar la paga y la vivienda militar', cost: 9000, stats: { mil: 3, apr: 2 } } ],
  economia: [ { title: 'Rebaja fiscal para clases medias', cost: 30000, stats: { apr: 5, eco: 2 } }, { title: 'Recortar el déficit con una agencia de eficiencia', cost: 0, stats: { eco: 2, apr: -3 } }, { title: 'Incentivos para fabricar semiconductores en EE. UU.', cost: 27000, stats: { eco: 3, emp: 2 } } ],
  vivienda: [ { title: 'Plan de construcción de vivienda asequible', cost: 18000, stats: { apr: 5, emp: 2 } }, { title: 'Subsidios al alquiler en grandes ciudades', cost: 9000, stats: { apr: 4, est: 1 } }, { title: 'Reformar la zonificación para construir más', cost: 1500, stats: { eco: 2, apr: 1 } } ],
  territorio: [ { title: 'Subsidios a agricultores afectados por aranceles', cost: 12000, stats: { apr: 3, eco: 1 } }, { title: 'Plan de gestión de incendios forestales', cost: 9000, stats: { est: 2, apr: 2 } }, { title: 'Gestión del agua en el río Colorado', cost: 6000, stats: { est: 2, eco: 1 } } ],
  trabajo: [ { title: 'Subir el salario mínimo federal', cost: 6000, stats: { emp: 2, apr: 4, eco: -1 } }, { title: 'Permiso familiar remunerado', cost: 15000, stats: { apr: 5, eco: -1 } }, { title: 'Programa de reciclaje laboral ante la IA', cost: 9000, stats: { emp: 3, eco: 1 } } ],
  justicia: [ { title: 'Reforma de la justicia penal y sentencias', cost: 3000, stats: { apr: 2, est: 1 } }, { title: 'Reforzar la lucha contra el crimen organizado', cost: 6000, stats: { est: 3, apr: 1 } }, { title: 'Reformar el proceso de nombramiento de jueces', cost: 0, stats: { con: 2, est: -1 } } ],
  exteriores: [ { title: 'Cumbre con los aliados del G7', cost: 600, stats: { apr: 2, est: 1 } }, { title: 'Ampliar la ayuda al desarrollo y la diplomacia pública', cost: 6000, stats: { apr: 1, mil: 1 } }, { title: 'Reforzar la alianza del Indo-Pacífico', cost: 4500, stats: { mil: 2, est: 1 } } ],
  transicion_ecologica: [ { title: 'Crédito fiscal a coches eléctricos y baterías', cost: 15000, stats: { eco: 2, emp: 2, apr: 1 } }, { title: 'Acelerar los permisos de nuevos reactores nucleares', cost: 12000, stats: { eco: 3, est: 1 } }, { title: 'Reservas estratégicas de minerales críticos', cost: 9000, stats: { eco: 2, mil: 1 } } ],
  cultura: [ { title: 'Mantener la financiación de museos y medios públicos', cost: 1500, stats: { apr: 2 } }, { title: 'Campaña de impulso del turismo internacional', cost: 4500, stats: { eco: 2, apr: 1 } }, { title: 'Plan de apoyo a Hollywood y a la producción local', cost: 3000, stats: { emp: 1, eco: 1 } } ],
  igualdad: [ { title: 'Ley federal contra la brecha salarial', cost: 3000, stats: { apr: 3, con: -2 } }, { title: 'Reforzar la protección de los derechos civiles', cost: 2400, stats: { apr: 2, est: 1 } }, { title: 'Programa de apoyo a veteranos y familias', cost: 7500, stats: { apr: 4, mil: 1 } } ]
};
const HOUSING_EVENTS = [
  { id: 'HOUS_1', category: 'PROTESTAS SOCIALES', title: 'EL ALQUILER ASFIXIA A LAS GRANDES CIUDADES', desc: 'Miles de inquilinos se manifiestan en Nueva York, Los Ángeles y San Francisco por la subida de las rentas.',
    options: [ { text: 'Subsidios al alquiler y fondo federal de vivienda', stats: { apr: 6, est: 3, eco: -1 }, cost: 18000, loyaltyImpact: { DEMP: 10, DEMM: 6, MAGA: -6 }, news: 'La Casa Blanca lanza un fondo federal para abaratar el alquiler.' }, { text: 'Liberalizar el suelo y confiar en el mercado', stats: { apr: -4, est: -2, eco: 1 }, cost: 0, loyaltyImpact: { GOPT: 8, MAGA: 6, DEMP: -10 }, news: 'El Gobierno rechaza intervenir los alquileres y apuesta por construir más.' } ] },
  { id: 'HOUS_2', category: 'PROTESTAS SOCIALES', title: 'CRISIS DE LOS SIN HOGAR', desc: 'Los campamentos de personas sin hogar crecen en las costas y las autoridades locales piden ayuda federal.',
    options: [ { text: 'Programa «Vivienda primero» con financiación federal', stats: { apr: 5, est: 2 }, cost: 12000, loyaltyImpact: { DEMP: 10, DEMM: 6, MAGA: -8 }, news: 'Washington financia viviendas permanentes para personas sin hogar.' }, { text: 'Apoyar la prohibición de acampar en la calle', stats: { est: 2, apr: -3 }, cost: 600, loyaltyImpact: { MAGA: 8, GOPT: 6, DEMP: -12 }, news: 'El Gobierno respalda la prohibición de acampar en espacios públicos.' } ] },
  { id: 'HOUS_3', category: 'PROTESTAS SOCIALES', title: 'PROTESTAS POR LA DEUDA ESTUDIANTIL', desc: 'Una generación de graduados reclama alivio de una deuda de 1,7 billones de dólares.',
    options: [ { text: 'Condonación parcial y topes de interés', stats: { apr: 6, eco: -2 }, cost: 24000, loyaltyImpact: { DEMP: 12, DEMM: 6, GOPT: -10, MAGA: -10 }, news: 'La Casa Blanca anuncia una condonación parcial de la deuda estudiantil.' }, { text: 'Negarse y proponer más becas', stats: { apr: -4, eco: 1 }, cost: 3000, loyaltyImpact: { GOPT: 6, MAGA: 6, DEMP: -10 }, news: 'El Gobierno rechaza condonar la deuda estudiantil.' } ] }
];
const SHOCK_POOL = [
  { cat: 'EMERGENCIAS', min: 'interior', title: 'HURACÁN DE CATEGORÍA 5 EN FLORIDA', desc: 'Un huracán devastador toca tierra y deja millones de personas sin electricidad.',
    options: [ { text: 'Respuesta federal masiva con la FEMA', cost: 12000, stats: { est: 3, apr: 3 }, news: 'La FEMA despliega una respuesta masiva tras el huracán en Florida.' }, { text: 'Limitarse a coordinar con los estados', cost: 0, stats: { est: -4, apr: -5 }, news: 'Críticas por la débil respuesta federal al huracán.' } ] },
  { cat: 'SEGURIDAD', min: 'interior', title: 'CIBERATAQUE A LA RED ELÉCTRICA', desc: 'Hackers vinculados a un Estado hostil dejan sin luz a varias ciudades.',
    options: [ { text: 'Respuesta ciberofensiva y blindaje de la red', cost: 9000, stats: { est: 2, mil: 2 }, news: 'EE. UU. responde con una ofensiva cibernética al ataque a la red eléctrica.' }, { text: 'Solo reparar y aplicar sanciones', cost: 3000, stats: { est: -2, apr: -2 }, news: 'Washington repara la red y sanciona a los responsables.' } ] },
  { cat: 'ECONOMÍA', min: 'economia', title: 'QUIEBRA DE UN GRAN BANCO REGIONAL', desc: 'Una retirada masiva de depósitos hunde a un banco regional y amenaza con contagio.',
    options: [ { text: 'Garantizar todos los depósitos', cost: 30000, stats: { eco: 3, est: 2, apr: -2 }, news: 'El Tesoro garantiza los depósitos para frenar el pánico bancario.' }, { text: 'Dejar que el mercado absorba la pérdida', cost: 0, stats: { eco: -5, est: -3 }, news: 'Se hunde un banco regional y las bolsas caen con fuerza.' } ] },
  { cat: 'SEGURIDAD', min: 'justicia', title: 'TIROTEO MASIVO EN UN CENTRO COMERCIAL', desc: 'Un atentado deja decenas de víctimas y reabre el debate sobre las armas.',
    options: [ { text: 'Ampliar controles y prohibir armas de asalto', cost: 1500, stats: { apr: 3, est: 2, con: -2 }, news: 'La Casa Blanca impulsa una ley de armas tras el tiroteo.' }, { text: 'Reforzar la seguridad y la salud mental', cost: 4500, stats: { apr: 1, est: 2 }, news: 'El Gobierno apuesta por seguridad y salud mental tras el tiroteo.' } ] },
  { cat: 'EMERGENCIAS', min: 'territorio', title: 'INCENDIOS FORESTALES EN CALIFORNIA', desc: 'Las llamas arrasan barrios enteros y obligan a evacuar a cientos de miles de personas.',
    options: [ { text: 'Ayuda federal y plan de prevención', cost: 15000, stats: { est: 3, apr: 3 }, news: 'Washington moviliza ayuda y un plan de prevención para los incendios de California.' }, { text: 'Condicionar la ayuda a reformas de gestión', cost: 3000, stats: { est: -2, apr: -3 }, news: 'La Casa Blanca condiciona la ayuda y recibe duras críticas.' } ] },
  { cat: 'EXTERIOR', min: 'defensa', title: 'INCIDENTE NAVAL EN EL ESTRECHO DE TAIWÁN', desc: 'Buques chinos y estadounidenses se enfrentan a pocos metros. Las bolsas tiemblan.',
    options: [ { text: 'Enviar un grupo de combate al estrecho', cost: 9000, stats: { mil: 3, est: -1 }, news: 'EE. UU. envía un portaaviones al estrecho de Taiwán.' }, { text: 'Línea directa con Pekín y desescalada', cost: 300, stats: { est: 2, apr: -1 }, news: 'Washington y Pekín desescalan tras el incidente naval.' } ] }
];

// ---- 3. GOBIERNO Y MISIONES ---------------------------------------------------------
const REAL_MINISTERS = [
  { id: 'bessent_gopt', name: 'Scott Bessent', party: 'GOPT', portfolio: 'economia', desc: '+1.5% Economía', pros: '+1.5% Economía', cons: '-1.0% Aprobación', effects: { eco: 1.5, apr: -1 } },
  { id: 'yellen_demm', name: 'Janet Yellen', party: 'DEMM', portfolio: 'economia', desc: '+1.5% Economía, +0.5% Estabilidad', pros: '+1.5% Economía', cons: '-0.5% Aprobación', effects: { eco: 1.5, est: 0.5, apr: -0.5 } },
  { id: 'rubio_gopt', name: 'Marco Rubio', party: 'GOPT', portfolio: 'exteriores', desc: '+1.0% Estabilidad, +0.5% Militar', pros: '+1.0% Estabilidad', cons: '-0.5% Aprobación', effects: { est: 1, mil: 0.5, apr: -0.5 } },
  { id: 'blinken_demm', name: 'Antony Blinken', party: 'DEMM', portfolio: 'exteriores', desc: '+1.5% Estabilidad', pros: '+1.5% Estabilidad', cons: '-1.0% Aprobación', effects: { est: 1.5, apr: -1 } },
  { id: 'hegseth_maga', name: 'Pete Hegseth', party: 'MAGA', portfolio: 'defensa', desc: '+2.0% Militar', pros: '+2.0% Militar', cons: '-1.5% Estabilidad', effects: { mil: 2, est: -1.5 } },
  { id: 'austin_demm', name: 'Lloyd Austin', party: 'DEMM', portfolio: 'defensa', desc: '+1.5% Militar, +0.5% Estabilidad', pros: '+1.5% Militar', cons: '-0.5% Aprobación', effects: { mil: 1.5, est: 0.5, apr: -0.5 } },
  { id: 'bondi_maga', name: 'Pam Bondi', party: 'MAGA', portfolio: 'justicia', desc: '+1.0% Estabilidad', pros: '+1.0% Estabilidad', cons: '-1.0% Aprobación', effects: { est: 1, apr: -1 } },
  { id: 'garland_demm', name: 'Merrick Garland', party: 'DEMM', portfolio: 'justicia', desc: '+1.5% Estabilidad', pros: '+1.5% Estabilidad', cons: '-0.5% Militar', effects: { est: 1.5, mil: -0.5 } },
  { id: 'noem_maga', name: 'Kristi Noem', party: 'MAGA', portfolio: 'interior', desc: '+1.5% Estabilidad', pros: '+1.5% Estabilidad', cons: '-1.0% Aprobación', effects: { est: 1.5, apr: -1 } },
  { id: 'mayorkas_demm', name: 'Alejandro Mayorkas', party: 'DEMM', portfolio: 'interior', desc: '+1.0% Estabilidad, +0.5% Aprobación', pros: '+1.0% Estabilidad', cons: '-0.5% Militar', effects: { est: 1, apr: 0.5, mil: -0.5 } },
  { id: 'rfk_maga', name: 'Robert F. Kennedy Jr.', party: 'MAGA', portfolio: 'sanidad', desc: '+1.0% Aprobación', pros: '+1.0% Aprobación', cons: '-1.0% Estabilidad', effects: { apr: 1, est: -1 } },
  { id: 'becerra_demm', name: 'Xavier Becerra', party: 'DEMM', portfolio: 'sanidad', desc: '+1.5% Aprobación', pros: '+1.5% Aprobación', cons: '-0.5% Economía', effects: { apr: 1.5, eco: -0.5 } },
  { id: 'mcmahon_gopt', name: 'Linda McMahon', party: 'GOPT', portfolio: 'educacion', desc: '+1.0% Economía', pros: '+1.0% Economía', cons: '-1.0% Aprobación', effects: { eco: 1, apr: -1 } },
  { id: 'cardona_demm', name: 'Miguel Cardona', party: 'DEMM', portfolio: 'educacion', desc: '+1.5% Aprobación', pros: '+1.5% Aprobación', cons: '-0.5% Economía', effects: { apr: 1.5, eco: -0.5 } },
  { id: 'chavez_gopt', name: 'Lori Chavez-DeRemer', party: 'GOPT', portfolio: 'trabajo', desc: '+1.5% Empleo', pros: '+1.5% Empleo', cons: '-0.5% Economía', effects: { emp: 1.5, eco: -0.5 } },
  { id: 'su_demp', name: 'Julie Su', party: 'DEMP', portfolio: 'trabajo', desc: '+2.0% Empleo', pros: '+2.0% Empleo', cons: '-1.0% Economía', effects: { emp: 2, eco: -1 } },
  { id: 'turner_gopt', name: 'Scott Turner', party: 'GOPT', portfolio: 'vivienda', desc: '+1.0% Economía, +0.5% Aprobación', pros: '+1.0% Economía', cons: '-0.5% Estabilidad', effects: { eco: 1, apr: 0.5, est: -0.5 } },
  { id: 'fudge_demp', name: 'Marcia Fudge', party: 'DEMP', portfolio: 'vivienda', desc: '+1.5% Aprobación', pros: '+1.5% Aprobación', cons: '-1.0% Economía', effects: { apr: 1.5, eco: -1 } },
  { id: 'duffy_maga', name: 'Sean Duffy', party: 'MAGA', portfolio: 'infraestructuras', desc: '+1.0% Economía, +0.5% Empleo', pros: '+1.0% Economía', cons: '-0.5% Aprobación', effects: { eco: 1, emp: 0.5, apr: -0.5 } },
  { id: 'buttigieg_demm', name: 'Pete Buttigieg', party: 'DEMM', portfolio: 'infraestructuras', desc: '+1.5% Economía', pros: '+1.5% Economía', cons: '-0.5% Estabilidad', effects: { eco: 1.5, est: -0.5 } },
  { id: 'rollins_gopt', name: 'Brooke Rollins', party: 'GOPT', portfolio: 'territorio', desc: '+1.0% Empleo, +0.5% Estabilidad', pros: '+1.0% Empleo', cons: '-0.5% Aprobación', effects: { emp: 1, est: 0.5, apr: -0.5 } },
  { id: 'vilsack_demm', name: 'Tom Vilsack', party: 'DEMM', portfolio: 'territorio', desc: '+1.0% Estabilidad, +0.5% Economía', pros: '+1.0% Estabilidad', cons: '-0.5% Empleo', effects: { est: 1, eco: 0.5, emp: -0.5 } },
  { id: 'wright_gopt', name: 'Chris Wright', party: 'GOPT', portfolio: 'transicion_ecologica', desc: '+1.5% Economía', pros: '+1.5% Economía', cons: '-1.0% Aprobación', effects: { eco: 1.5, apr: -1 } },
  { id: 'granholm_demp', name: 'Jennifer Granholm', party: 'DEMP', portfolio: 'transicion_ecologica', desc: '+1.0% Aprobación, +1.0% Empleo', pros: '+1.0% Aprobación', cons: '-1.0% Economía', effects: { apr: 1, emp: 1, eco: -1 } },
  { id: 'carr_maga', name: 'Brendan Carr', party: 'MAGA', portfolio: 'cultura', desc: '+1.0% Aprobación', pros: '+1.0% Aprobación', cons: '-1.0% Estabilidad', effects: { apr: 1, est: -1 } },
  { id: 'rosenworcel_demm', name: 'Jessica Rosenworcel', party: 'DEMM', portfolio: 'cultura', desc: '+1.0% Aprobación, +0.5% Estabilidad', pros: '+1.0% Aprobación', cons: '-0.5% Economía', effects: { apr: 1, est: 0.5, eco: -0.5 } },
  { id: 'dhillon_maga', name: 'Harmeet Dhillon', party: 'MAGA', portfolio: 'igualdad', desc: '+1.0% Estabilidad', pros: '+1.0% Estabilidad', cons: '-1.0% Aprobación', effects: { est: 1, apr: -1 } },
  { id: 'clarke_demp', name: 'Kristen Clarke', party: 'DEMP', portfolio: 'igualdad', desc: '+1.5% Aprobación', pros: '+1.5% Aprobación', cons: '-0.5% Estabilidad', effects: { apr: 1.5, est: -0.5 } }
];
const GOAL_POOL = [
  { id: 'eco', icon: 'fa-chart-line', title: 'Milagro Económico', desc: 'Mantén la Economía ≥ 70%', check: s => s.metrics.eco >= 70 },
  { id: 'est', icon: 'fa-shield-halved', title: 'Unidad Nacional', desc: 'Mantén la Estabilidad ≥ 65%', check: s => s.metrics.est >= 65 },
  { id: 'apr', icon: 'fa-heart', title: 'Presidente Querido', desc: 'Mantén la Aprobación ≥ 65%', check: s => s.metrics.apr >= 65 },
  { id: 'emp', icon: 'fa-briefcase', title: 'Pleno Empleo', desc: 'Mantén el Empleo ≥ 70%', check: s => s.metrics.emp >= 70 },
  { id: 'mil', icon: 'fa-jet-fighter', title: 'Superpotencia Militar', desc: 'Mantén el poder Militar ≥ 75%', check: s => s.metrics.mil >= 75 },
  { id: 'con', icon: 'fa-scale-balanced', title: 'Consenso Político', desc: 'Mantén el Consenso ≥ 55%', check: s => s.metrics.con >= 55 },
  { id: 'cash', icon: 'fa-vault', title: 'Tesoro Saneado', desc: 'Ten al menos 1.200.000 M€ en Tesorería', check: s => (Number(s.treasury) || 0) >= 1200000 },
  { id: 'tri', icon: 'fa-star', title: 'Éxito Total', desc: 'Economía, Estabilidad y Aprobación ≥ 60%', check: s => s.metrics.eco >= 60 && s.metrics.est >= 60 && s.metrics.apr >= 60 }
];
const GOAL_ACTIONS = [
  { id: 'tv', icon: 'fa-tv', title: 'Discurso desde el Despacho Oval', cap: 15, cost: 0, cd: 30, fx: { apr: 6, est: 2 }, news: 'El presidente se dirige al país desde el Despacho Oval y remonta en las encuestas.' },
  { id: 'g7', icon: 'fa-earth-americas', title: 'Cumbre del G7', cap: 20, cost: 0, cd: 45, fx: { eco: 5, apr: 2 }, news: 'Los líderes del G7 respaldan el plan económico de la Casa Blanca.' },
  { id: 'rally', icon: 'fa-flag-usa', title: 'Gira de mítines por los estados clave', cap: 12, cost: 3000, cd: 40, fx: { apr: 5, con: -1 }, news: 'El presidente recorre los estados decisivos y moviliza a su electorado.' },
  { id: 'fed', icon: 'fa-building-columns', title: 'Reunión con el presidente de la Reserva Federal', cap: 10, cost: 0, cd: 60, fx: { eco: 4 }, news: 'La Casa Blanca y la Fed coordinan mensajes sobre inflación y tipos.' },
  { id: 'tech', icon: 'fa-microchip', title: 'Cumbre con las grandes tecnológicas', cap: 10, cost: 0, cd: 50, fx: { eco: 3, emp: 2 }, news: 'Las tecnológicas prometen inversiones multimillonarias en suelo estadounidense.' },
  { id: 'gov', icon: 'fa-landmark-flag', title: 'Reunión con los gobernadores', cap: 8, cost: 0, cd: 45, fx: { est: 4, con: 2 }, news: 'Casa Blanca y gobernadores pactan una agenda común.' },
  { id: 'vet', icon: 'fa-medal', title: 'Homenaje a los veteranos', cap: 6, cost: 600, cd: 40, fx: { mil: 4, apr: 3 }, news: 'El presidente rinde homenaje a los veteranos en Arlington.' },
  { id: 'otan', icon: 'fa-shield', title: 'Cumbre de la OTAN', cap: 18, cost: 0, cd: 90, fx: { mil: 4, est: 2 }, news: 'La OTAN refuerza su defensa colectiva tras la cumbre.' },
  { id: 'pod', icon: 'fa-microphone', title: 'Entrevista en un podcast popular', cap: 5, cost: 0, cd: 25, fx: { apr: 3 }, news: 'Una entrevista en un podcast viral conecta con el voto joven.' },
  { id: 'ley', icon: 'fa-file-signature', title: 'Firma de una gran ley bipartidista', cap: 20, cost: 0, cd: 120, fx: { con: 5, apr: 3, est: 3 }, news: 'El presidente firma una ley bipartidista con ambos partidos en el Capitolio.' },
  { id: 'sos', icon: 'fa-triangle-exclamation', title: 'Visita a una zona de catástrofe', cap: 8, cost: 1500, cd: 45, fx: { apr: 4, est: 2 }, news: 'El presidente visita la zona afectada y promete ayuda federal.' },
  { id: 'chi', icon: 'fa-handshake', title: 'Cumbre con el presidente chino', cap: 22, cost: 0, cd: 120, fx: { eco: 6, mil: -1 }, news: 'Washington y Pekín acuerdan una tregua comercial tras la cumbre.' }
];
const FOCUS_TREE = [
  { id: 'e1', b: 'eco', title: 'Reforma fiscal federal', days: 365, now: { eco: 4 }, spirit: { name: 'Hacienda Eficiente', daily: {}, money: 1800 } },
  { id: 'e2', b: 'eco', title: 'Reindustrialización y semiconductores', days: 420, req: 'e1', now: { emp: 3 }, spirit: { name: 'Fábricas en EE. UU.', daily: { eco: .05, emp: .04 }, money: 0 } },
  { id: 'e3', b: 'eco', title: 'Liderazgo en inteligencia artificial', days: 400, req: 'e2', now: { eco: 3 }, spirit: { name: 'Potencia Tecnológica', daily: { eco: .06 }, money: 2400 } },
  { id: 's1', b: 'est', title: 'Modernizar la ciberseguridad', days: 300, now: { est: 3 }, spirit: { name: 'Escudo Cibernético', daily: { est: .04 }, money: 0 } },
  { id: 's2', b: 'est', title: 'Reforma de las agencias de seguridad', days: 360, req: 's1', now: { est: 3, con: 1 }, spirit: { name: 'Seguridad Coordinada', daily: { est: .05 }, money: -600 } },
  { id: 'm1', b: 'emp', title: 'Programa nacional de aprendices', days: 300, now: { emp: 3 }, spirit: { name: 'Cantera de Oficios', daily: { emp: .04 }, money: 0 } },
  { id: 'm2', b: 'emp', title: 'Pacto con los sindicatos', days: 380, req: 'm1', now: { emp: 2, est: 2 }, spirit: { name: 'Paz Laboral', daily: { emp: .03, est: .03 }, money: 0 } },
  { id: 'c1', b: 'con', title: 'Bipartidismo en el Congreso', days: 330, now: { con: 4 }, spirit: { name: 'Cooperación Legislativa', daily: { con: .04 }, money: 0 } },
  { id: 'c2', b: 'con', title: 'Reforma del proceso electoral', days: 400, req: 'c1', now: { con: 3, apr: 1 }, spirit: { name: 'Confianza en las Urnas', daily: { con: .05, est: .02 }, money: 0 } },
  { id: 'a1', b: 'apr', title: 'Agenda para la clase media', days: 320, now: { apr: 4 }, spirit: { name: 'Clase Media Fuerte', daily: { apr: .04 }, money: -900 } },
  { id: 'a2', b: 'apr', title: 'Plan de vivienda asequible', days: 380, req: 'a1', now: { apr: 3, emp: 1 }, spirit: { name: 'Hogar para Todos', daily: { apr: .04, est: .02 }, money: -1200 } },
  { id: 'a3', b: 'apr', title: 'Sanidad más barata', days: 420, req: 'a2', now: { apr: 3 }, spirit: { name: 'Salud Accesible', daily: { apr: .05 }, money: -1500 } },
  { id: 'k1', b: 'mil', title: 'Modernización de las Fuerzas Armadas', days: 400, now: { mil: 4 }, spirit: { name: 'Ejército del Siglo XXI', daily: { mil: .05 }, money: -1800 } },
  { id: 'k2', b: 'mil', title: 'Escudo antimisiles y fuerza espacial', days: 450, req: 'k1', now: { mil: 3, est: 1 }, spirit: { name: 'Dominio Espacial', daily: { mil: .05, est: .02 }, money: -2400 } },
  { id: 'k3', b: 'mil', title: 'Alianzas del Indo-Pacífico', days: 360, req: 'k1', now: { mil: 2, eco: 1 }, spirit: { name: 'Arco de Aliados', daily: { mil: .04, eco: .02 }, money: 0 } },
  { id: 'k4', b: 'est', title: 'Resiliencia frente a catástrofes', days: 340, req: 's1', now: { est: 3, apr: 1 }, spirit: { name: 'País Preparado', daily: { est: .04 }, money: -600 } }
];
const FOCUS_LINKS = [
  { t: 'Economía hundida destruye empleo', on: s => s.eco < 40, fx: { emp: -.08 } },
  { t: 'Economía fuerte crea empleo', on: s => s.eco > 65, fx: { emp: .04 } },
  { t: 'Inestabilidad erosiona la aprobación', on: s => s.est < 35, fx: { apr: -.06 } },
  { t: 'Desempleo alto desgasta al Gobierno', on: s => s.emp < 40, fx: { apr: -.06 } }
];
const INTL_ACTIONS = [];

// ---- 4. PROYECTOS, LOGROS Y BANCO CENTRAL ---------------------------------------------
const PROJECTS = [
  { id: 'tgv', icon: 'fa-train', title: 'Alta velocidad ferroviaria nacional', spirit: { name: 'Red Ferroviaria Moderna', daily: { eco: .04, emp: .02 }, money: 900 },
    phases: [ { n: 'Estudios y derechos de paso', cost: 6000, days: 40, now: {}, run: {} }, { n: 'Obra civil y vías', cost: 45000, days: 150, now: { emp: 2, eco: 1 }, run: { emp: .02, eco: .01 } }, { n: 'Material móvil y servicio', cost: 18000, days: 60, now: { eco: 2 }, run: {} } ] },
  { id: 'chips', icon: 'fa-microchip', title: 'Fábricas de semiconductores', spirit: { name: 'Silicon Heartland', daily: { eco: .05, emp: .03 }, money: 1500 },
    phases: [ { n: 'Incentivos y suelo industrial', cost: 9000, days: 40, now: {}, run: {} }, { n: 'Construcción de plantas', cost: 60000, days: 160, now: { emp: 3, eco: 1 }, run: { eco: .02 } }, { n: 'Producción en serie', cost: 18000, days: 60, now: { eco: 3 }, run: {} } ] },
  { id: 'red', icon: 'fa-bolt', title: 'Red eléctrica nacional inteligente', spirit: { name: 'Red Eléctrica Resiliente', daily: { est: .04, eco: .03 }, money: 600 },
    phases: [ { n: 'Diseño y permisos', cost: 4500, days: 40, now: {}, run: {} }, { n: 'Líneas de alta tensión', cost: 42000, days: 150, now: { emp: 2, est: 1 }, run: { emp: .02 } }, { n: 'Almacenamiento y control', cost: 15000, days: 60, now: { est: 2 }, run: {} } ] },
  { id: 'nuc', icon: 'fa-atom', title: 'Nueva generación de reactores nucleares', spirit: { name: 'Energía Nuclear Limpia', daily: { eco: .04 }, money: 1200 },
    phases: [ { n: 'Licencias y diseño', cost: 7500, days: 50, now: {}, run: {} }, { n: 'Construcción', cost: 54000, days: 180, now: { emp: 2, eco: 1 }, run: { emp: .02 } }, { n: 'Conexión a la red', cost: 12000, days: 50, now: { eco: 2 }, run: {} } ] },
  { id: 'esp', icon: 'fa-rocket', title: 'Programa lunar y estación espacial', spirit: { name: 'Líderes del Espacio', daily: { apr: .03, mil: .02 }, money: 300 },
    phases: [ { n: 'Diseño de la misión', cost: 12000, days: 60, now: {}, run: {} }, { n: 'Cohetes y módulos', cost: 45000, days: 160, now: { emp: 1, apr: 1 }, run: { apr: .01 } }, { n: 'Lanzamiento', cost: 18000, days: 50, now: { apr: 3 }, run: {} } ] },
  { id: 'wat', icon: 'fa-water', title: 'Plan hídrico del Oeste', spirit: { name: 'Agua Asegurada', daily: { est: .04, eco: .02 }, money: 300 },
    phases: [ { n: 'Estudios y acuerdos entre estados', cost: 3000, days: 40, now: {}, run: {} }, { n: 'Desalación y presas', cost: 27000, days: 140, now: { emp: 2, est: 1 }, run: { emp: .01 } }, { n: 'Redes de distribución', cost: 9000, days: 50, now: { est: 2 }, run: {} } ] },
  { id: 'hosp', icon: 'fa-hospital', title: 'Red nacional de salud rural', spirit: { name: 'Salud en Todo el País', daily: { apr: .04 }, money: -300 },
    phases: [ { n: 'Estudio de necesidades', cost: 1500, days: 30, now: {}, run: {} }, { n: 'Construcción de clínicas', cost: 24000, days: 130, now: { apr: 2, emp: 1 }, run: { apr: .01 } }, { n: 'Dotación y personal', cost: 12000, days: 50, now: { apr: 3 }, run: {} } ] },
  { id: 'bro', icon: 'fa-wifi', title: 'Banda ancha universal', spirit: { name: 'País Conectado', daily: { eco: .03, emp: .02 }, money: 450 },
    phases: [ { n: 'Mapa de cobertura', cost: 1500, days: 30, now: {}, run: {} }, { n: 'Fibra y satélite', cost: 21000, days: 130, now: { emp: 2, eco: 1 }, run: { eco: .01 } }, { n: 'Conexión de hogares', cost: 7500, days: 45, now: { apr: 2, eco: 1 }, run: {} } ] }
];
const ACHIEVEMENTS = [
  { id: 'm1', icon: 'fa-flag', title: 'Primer Mandato', desc: 'Cumple tu primera misión', ok: s => s.goals && s.goals.done >= 1 },
  { id: 'm5', icon: 'fa-list-check', title: 'Gestor Eficaz', desc: 'Cumple 5 misiones', ok: s => s.goals && s.goals.done >= 5 },
  { id: 'eco80', icon: 'fa-chart-line', title: 'Wall Street Aplaude', desc: 'Alcanza una Economía ≥ 80%', ok: s => s.metrics && s.metrics.eco >= 80 },
  { id: 'apr80', icon: 'fa-heart', title: 'Landslide', desc: 'Alcanza una Aprobación ≥ 80%', ok: s => s.metrics && s.metrics.apr >= 80 },
  { id: 'mil85', icon: 'fa-jet-fighter', title: 'Pax Americana', desc: 'Alcanza un poder Militar ≥ 85%', ok: s => s.metrics && s.metrics.mil >= 85 },
  { id: 'emp80', icon: 'fa-briefcase', title: 'Sueño Americano', desc: 'Alcanza un Empleo ≥ 80%', ok: s => s.metrics && s.metrics.emp >= 80 },
  { id: 'cash', icon: 'fa-vault', title: 'Tesoro Rebosante', desc: 'Acumula 2.000.000 M€ en Tesorería', ok: s => (Number(s.treasury) || 0) >= 2000000 },
  { id: 'trip', icon: 'fa-star', title: 'Estado de la Unión', desc: 'Economía, Estabilidad y Aprobación ≥ 70% a la vez', ok: s => s.metrics && s.metrics.eco >= 70 && s.metrics.est >= 70 && s.metrics.apr >= 70 }
];
const BDE_GOVS = [
  { id: 'tecnico', name: 'Christopher Waller', tag: 'Halcón moderado', cred: 10, desc: 'Prioriza la inflación. Los mercados le respetan; el Gobierno sufre con tipos altos.' },
  { id: 'afin', name: 'Kevin Hassett', tag: 'Afín a la Casa Blanca', cred: -10, desc: 'Más dispuesto a bajar tipos; crédito fácil, pero los inversores recelan.' },
  { id: 'indep', name: 'Jerome Powell', tag: 'Independiente histórico', cred: 15, desc: 'Presidente de la Reserva Federal con enorme credibilidad: informes sobrios y poco complacientes.' }
];
const BDE_ACTIONS = [
  { id: 'rate_down', icon: 'fa-arrow-trend-down', label: 'Bajar el tipo de los fondos federales (−25 pb)', desc: 'Abarata el crédito: más actividad y empleo, algo más de inflación.', cost: 0, cd: 45, when: () => true,
    run: B => { B.cred -= 1; focusMetricAdd('eco', 2); focusMetricAdd('emp', 1); } },
  { id: 'rate_up', icon: 'fa-arrow-trend-up', label: 'Subir el tipo de los fondos federales (+25 pb)', desc: 'Frena la inflación y refuerza el dólar, a costa de la actividad.', cost: 0, cd: 45, when: () => true,
    run: B => { B.cred += 2; B.shock -= 10; focusMetricAdd('eco', -1); focusMetricAdd('apr', -1); focusMetricAdd('est', 1); } },
  { id: 'qe', icon: 'fa-money-bill-wave', label: 'Relajación cuantitativa (compra de bonos)', desc: 'Inyecta liquidez y sostiene los mercados, pero erosiona la credibilidad.', cost: 0, cd: 90, when: () => true,
    run: B => { B.cred -= 3; focusMetricAdd('eco', 3); focusMetricAdd('emp', 1); } },
  { id: 'qt', icon: 'fa-scissors', label: 'Reducir el balance de la Fed', desc: 'Retira liquidez del sistema: más credibilidad, menos crecimiento.', cost: 0, cd: 90, when: () => true,
    run: B => { B.cred += 2; focusMetricAdd('eco', -2); focusMetricAdd('est', 1); } },
  { id: 'guide', icon: 'fa-comments', label: 'Reforzar la comunicación (forward guidance)', desc: 'Calma a los mercados con un mensaje claro sobre los tipos.', cost: 0, cd: 60, when: () => true,
    run: B => { B.cred += 2; B.shock -= 8; focusMetricAdd('apr', 1); } }
];

// ---- 5. ECONOMÍA Y TEXTOS DEL PAÍS ----------------------------------------------------
const COUNTRY_ECON = {
  terms: { gov: 'La Casa Blanca', place: 'la Casa Blanca', cabinet: 'Gabinete presidencial', bank: 'Reserva Federal',
           nation: 'Estados Unidos', adj: 'estadounidense', firms: 'estadounidenses', capital: 'Washington' },
  k: 15,
  budget: 1500000, budgetStep: 15000,
  pib: 27000000, debt: 33000000, macroPib: 1504500, revPct: 0.30, pensPct: 0.09, otherPct: 0.15,
  baseRate: 4.1, debtMax: 6000000, cashCap: 1350000,
  preset: { sanidad: 270000, educacion: 90000, defensa: 600000, vivienda: 90000, infraestructuras: 150000, deuda: 300000 },
  hint: 'Referencia aproximada del presupuesto federal estadounidense: Defensa ≈ 40 % del gasto discrecional, Sanidad y Seguridad Social aparte, intereses de la deuda ≈ 3,5 % del PIB. Se propone un reparto a escala; modifícalo si quieres.',
  labels: { sanidad: 'Salud (HHS, Medicare y Medicaid)', educacion: 'Educación y Ciencia', defensa: 'Defensa (Pentágono y Seguridad Nacional)', vivienda: 'Vivienda y Desarrollo Urbano', infraestructuras: 'Transporte y Energía', deuda: 'Intereses de la deuda' },
  pct: { sanidad: 18, educacion: 6, infraestructuras: 10, interior: 8, defensa: 40, economia: 12, vivienda: 6 },
  names: {
    economia: 'Departamento del Tesoro', interior: 'Departamento de Seguridad Nacional', defensa: 'Departamento de Defensa',
    vivienda: 'Departamento de Vivienda y Desarrollo Urbano', territorio: 'Departamento de Agricultura e Interior', sanidad: 'Departamento de Salud y Servicios Humanos',
    educacion: 'Departamento de Educación', trabajo: 'Departamento de Trabajo', justicia: 'Departamento de Justicia',
    exteriores: 'Departamento de Estado', transicion_ecologica: 'Departamento de Energía y Agencia de Protección Ambiental',
    cultura: 'Comisión de Comunicaciones y Cultura', igualdad: 'División de Derechos Civiles', infraestructuras: 'Departamento de Transporte'
  },
  descs: {
    sanidad: 'Medicare, Medicaid, salud pública y agencias sanitarias.', educacion: 'Escuela pública, universidades y ayudas a los estudiantes.',
    infraestructuras: 'Carreteras, puentes, aeropuertos y transporte ferroviario.', interior: 'Fronteras, FBI federal, FEMA y ciberseguridad.',
    defensa: 'Fuerzas Armadas, Pentágono, adquisiciones y operaciones en el exterior.', economia: 'Tesoro, deuda, recaudación fiscal (IRS) y política económica.',
    vivienda: 'Vivienda social, ayudas al alquiler y créditos hipotecarios.'
  },
  war: {
    id: 840, name: 'Estados Unidos', lat: 39, lon: -98, allied: 'OTAN|UE', own: { t: 66, m: 92, a: 95 },
    add: [[724, 'España', 48, 'UE·OTAN', 1, 75, 0, 40, -4]],
    drop: [],
    rel: { 724: 75, 826: 92, 250: 76, 276: 78, 380: 76, 392: 88, 410: 88, 376: 88, 616: 80, 124: 90, 484: 55, 643: 6, 156: 28, 364: 4, 408: 3, 192: 8, 862: 10, 682: 70, 784: 74, 792: 55, 356: 55, 504: 80, 12: 40 }
  }
};

// ---- 6. MAPA DE REGIONES -------------------------------------------------------------
const COUNTRY_MAP = {
  title: 'Mapa de las 12 regiones de Estados Unidos',
  paths: [
    { id: 'PNW', name: 'Noroeste del Pacífico', d: 'M 32.1,50.1 L 44.0,44.6 L 86.0,44.6 L 86.0,72.2 L 86.0,109.0 L 34.2,109.0 Z', spectrumPref: 3.0, regionalist: false, desc: 'Washington y Oregón · Tecnología, aviación y puertos del Pacífico' },
    { id: 'CAL', name: 'California', d: 'M 34.2,109.0 L 65.0,109.0 L 65.0,136.6 L 102.8,173.4 L 102.1,194.6 L 85.3,196.4 L 61.5,178.0 L 34.2,125.6 Z', spectrumPref: 2.2, regionalist: true, desc: 'California · Silicon Valley, Hollywood y la mayor economía estatal' },
    { id: 'MTN', name: 'Montañas del Oeste', d: 'M 86.0,44.6 L 177.0,44.6 L 177.0,155.0 L 184.0,155.0 L 184.0,201.0 L 158.8,201.0 L 147.6,202.8 L 128.0,207.4 L 102.1,194.6 L 102.8,173.4 L 65.0,136.6 L 65.0,109.0 L 86.0,109.0 L 86.0,72.2 Z', spectrumPref: 5.0, regionalist: false, desc: 'Montana, Idaho, Wyoming, Utah, Colorado, Nevada, Arizona y Nuevo México · Minería, energía y turismo' },
    { id: 'TEX', name: 'Texas', d: 'M 158.8,201.0 L 184.0,201.0 L 184.0,159.6 L 205.0,159.6 L 205.0,178.0 L 244.2,186.3 L 247.0,222.2 L 226.0,256.2 L 208.5,242.4 L 194.5,221.2 L 173.5,223.1 Z', spectrumPref: 5.7, regionalist: true, desc: 'Texas · Petróleo, gas, frontera sur y fuerte identidad propia' },
    { id: 'PLA', name: 'Grandes Llanuras', d: 'M 177.0,44.6 L 224.6,44.6 L 229.5,76.8 L 229.5,95.2 L 236.5,122.8 L 242.8,135.7 L 242.8,159.6 L 244.2,186.3 L 205.0,178.0 L 205.0,159.6 L 184.0,159.6 L 184.0,155.0 L 177.0,155.0 Z', spectrumPref: 5.9, regionalist: false, desc: 'Dakotas, Nebraska, Kansas y Oklahoma · Cereales, ganadería y energía' },
    { id: 'MWS', name: 'Medio Oeste y Grandes Lagos', d: 'M 224.6,44.6 L 278.5,53.8 L 313.5,67.6 L 324.0,72.2 L 327.5,99.8 L 320.5,111.8 L 341.5,109.9 L 341.5,121.9 L 311.4,136.6 L 289.0,155.0 L 280.6,159.6 L 242.8,159.6 L 242.8,135.7 L 236.5,122.8 L 229.5,95.2 L 229.5,76.8 Z', spectrumPref: 4.2, regionalist: false, desc: 'Minnesota, Iowa, Misuri, Wisconsin, Illinois, Indiana, Ohio y Míchigan · Industria, agricultura y estados decisivos' },
    { id: 'SOU', name: 'Sur Profundo', d: 'M 242.8,159.6 L 280.6,159.6 L 289.0,155.0 L 311.4,136.6 L 326.8,142.1 L 333.1,153.2 L 333.1,158.7 L 314.9,173.4 L 305.8,173.4 L 310.0,201.0 L 310.0,210.2 L 291.8,215.7 L 278.5,217.6 L 278.5,226.8 L 248.4,222.2 L 247.0,186.3 L 244.2,186.3 Z', spectrumPref: 5.8, regionalist: false, desc: 'Kentucky, Tennessee, Arkansas, Luisiana, Misisipi y Alabama · Tradición, base militar y Golfo de México' },
    { id: 'SAT', name: 'Atlántico Sur', d: 'M 326.8,142.1 L 341.5,130.2 L 374.4,130.2 L 380.0,142.1 L 374.4,155.0 L 376.5,171.6 L 355.5,184.4 L 338.7,201.0 L 335.2,213.0 L 310.0,213.0 L 310.0,201.0 L 305.8,173.4 L 314.9,173.4 L 333.1,158.7 L 333.1,153.2 Z', spectrumPref: 4.8, regionalist: false, desc: 'Virginia, las Carolinas, Georgia, Virginia Occidental, Maryland y Washington D. C. · Bases militares, banca y la capital' },
    { id: 'FLO', name: 'Florida', d: 'M 291.8,215.7 L 310.0,213.0 L 335.2,213.0 L 343.6,247.0 L 342.2,263.6 L 332.4,256.2 L 325.4,239.6 L 317.0,219.4 L 307.9,222.2 Z', spectrumPref: 5.2, regionalist: false, desc: 'Florida · Turismo, jubilados, huracanes y voto latino' },
    { id: 'MAT', name: 'Atlántico Medio', d: 'M 341.5,109.9 L 352.0,104.4 L 352.0,97.0 L 369.5,94.3 L 380.0,81.4 L 391.2,81.4 L 391.9,104.4 L 389.1,118.2 L 387.0,122.8 L 378.6,130.2 L 341.5,130.2 Z', spectrumPref: 3.2, regionalist: false, desc: 'Nueva York, Nueva Jersey y Pensilvania · Wall Street, la ONU y los grandes puertos' },
    { id: 'NEN', name: 'Nueva Inglaterra', d: 'M 391.9,81.4 L 404.5,81.4 L 409.4,59.3 L 420.6,59.3 L 430.4,63.0 L 436.0,83.2 L 413.6,95.2 L 409.4,102.6 L 415.0,111.8 L 404.5,115.4 L 389.1,118.2 L 391.9,104.4 Z', spectrumPref: 2.6, regionalist: false, desc: 'Maine, Vermont, Nuevo Hampshire, Massachusetts, Rhode Island y Connecticut · Universidades, biotecnología y finanzas' },
    { id: 'ALH', name: 'Alaska y Hawái', d: 'M 30,300 L 70,292 L 118,300 L 126,322 L 96,346 L 62,338 L 38,326 Z M 150,338 L 172,330 L 184,346 L 160,354 Z', spectrumPref: 4.5, regionalist: true, desc: 'Alaska y Hawái · Petróleo, pesca, turismo y bases del Pacífico' }
  ]
};

// ---- 7. RELACIONES EXTERIORES ---------------------------------------------------------
const COUNTRY_INTL = {
  blocksText: 'China↔Rusia, UE↔Reino Unido, Japón↔Corea',
  partners: {
    ue: { name: 'Unión Europea', icon: 'fa-earth-europe', ally: { name: 'Alianza Atlántica Sólida', daily: { eco: .05, mil: .02 }, money: 1800 }, tense: { name: 'Fricción Transatlántica', daily: { eco: -.05 }, money: -900 } },
    uk: { name: 'Reino Unido', icon: 'fa-crown', ally: { name: 'Relación Especial', daily: { mil: .04, eco: .03 }, money: 900 }, tense: { name: 'Enfriamiento con Londres', daily: { mil: -.03 }, money: -450 } },
    cn: { name: 'China', icon: 'fa-dragon', ally: { name: 'Tregua Comercial con Pekín', daily: { eco: .05 }, money: 2400 }, tense: { name: 'Guerra Comercial con China', daily: { eco: -.05, emp: -.02 }, money: -1500 } },
    ru: { name: 'Rusia', icon: 'fa-bear', ally: { name: 'Distensión con Moscú', daily: { est: .03 }, money: 450 }, tense: { name: 'Tensión con Moscú', daily: { mil: -.02, est: -.03 }, money: -600 } },
    mx: { name: 'México y Canadá', icon: 'fa-handshake', ally: { name: 'Norteamérica Integrada', daily: { eco: .04, emp: .02 }, money: 1500 }, tense: { name: 'Frontera Tensa', daily: { est: -.04, eco: -.03 }, money: -750 } },
    jp: { name: 'Japón y Corea del Sur', icon: 'fa-torii-gate', ally: { name: 'Arco de Aliados del Pacífico', daily: { mil: .04, eco: .03 }, money: 1200 }, tense: { name: 'Aliados Distantes', daily: { mil: -.03 }, money: -600 } },
    il: { name: 'Israel y Oriente Medio', icon: 'fa-mosque', ally: { name: 'Estabilidad en Oriente Medio', daily: { est: .03, mil: .02 }, money: 600 }, tense: { name: 'Crisis en Oriente Medio', daily: { est: -.04, eco: -.02 }, money: -750 } },
    es: { name: 'España', icon: 'fa-flag', ally: { name: 'Bases de Rota y Morón', daily: { mil: .03, est: .02 }, money: 450 }, tense: { name: 'Fricción con Madrid', daily: { mil: -.02 }, money: -300 } },
    ma: { name: 'Marruecos', icon: 'fa-globe-africa', ally: { name: 'Aliado Norteafricano', daily: { mil: .03, est: .02 }, money: 300 }, tense: { name: 'Frialdad con Rabat', daily: { mil: -.02 }, money: -150 } }
  },
  base: { ue: 74, uk: 90, cn: 28, ru: 6, mx: 55, jp: 88, il: 86, es: 75, ma: 80 },
  links: { cn: { ru: .3, jp: -.2 }, ru: { cn: .3, ue: -.3 }, ue: { uk: .2, ru: -.2 }, jp: { cn: -.2 }, il: { ue: -.1 } },
  map: {
    ue: [250, 276, 380, 616, 300, 620, 56, 528, 40, 246, 752, 208, 372, 203, 642, 100, 191, 196, 233, 428, 440, 442, 348, 703, 705, 470],
    uk: [826], cn: [156], ru: [643, 112], mx: [484, 124], jp: [392, 410], il: [376, 682, 784, 368, 400], es: [724], ma: [504]
  },
  actions: {
    ue: [ { id: 'cum', title: 'Cumbre transatlántica UE–EE. UU.', cap: 8, cd: 60, fx: { ue: 10, uk: 2 } },
          { id: 'gas', title: 'Acuerdo de exportación de gas natural licuado', cap: 5, inc: 3000, cd: 120, fx: { ue: 5, ru: -3 }, now: { eco: 1 } } ],
    uk: [ { id: 'cum', title: 'Visita de Estado a Londres', cap: 8, cd: 60, fx: { uk: 10, ue: 2 } },
          { id: 'ai', title: 'Pacto de inteligencia y tecnología', cap: 5, cd: 90, fx: { uk: 8 }, now: { eco: 1, mil: 1 } } ],
    cn: [ { id: 'tre', title: 'Cumbre comercial con Pekín', cap: 12, cd: 90, fx: { cn: 12, jp: -2 }, now: { eco: 2 } },
          { id: 'chi', title: 'Restringir exportaciones de chips a China', cap: 6, cd: 60, fx: { cn: -10, jp: 3 }, now: { mil: 2, eco: -1 } } ],
    ru: [ { id: 'dia', title: 'Canal de diálogo con el Kremlin', cap: 10, cd: 90, fx: { ru: 10, ue: -2 }, now: { est: 1 } },
          { id: 'san', title: 'Nuevo paquete de sanciones a Rusia', cap: 6, cd: 60, fx: { ru: -10, ue: 4 }, now: { mil: 1 } } ],
    mx: [ { id: 'usmca', title: 'Revisar el tratado comercial T-MEC', cap: 8, cd: 90, fx: { mx: 10 }, now: { eco: 2, emp: 1 } },
          { id: 'fro', title: 'Cooperación fronteriza y contra los cárteles', cost: 3000, cap: 5, cd: 60, fx: { mx: 8 }, now: { est: 2 } } ],
    jp: [ { id: 'alq', title: 'Ejercicios navales conjuntos en el Pacífico', cost: 1500, cap: 5, cd: 60, fx: { jp: 10, cn: -3 }, now: { mil: 3 } },
          { id: 'inv', title: 'Inversión japonesa en fábricas estadounidenses', cap: 5, inc: 2400, cd: 90, fx: { jp: 8 }, now: { emp: 1 } } ],
    il: [ { id: 'arm', title: 'Paquete de ayuda militar', cost: 4500, cap: 6, cd: 60, fx: { il: 10, ue: -2 }, now: { mil: 2 } },
          { id: 'pea', title: 'Mediación de paz en Oriente Medio', cap: 12, cd: 120, fx: { il: -4, ue: 4 }, now: { apr: 2, est: 1 } } ],
    es: [ { id: 'bas', title: 'Renovar el uso de las bases de Rota y Morón', cap: 5, cd: 90, fx: { es: 10 }, now: { mil: 2 } },
          { id: 'cum', title: 'Cumbre bilateral con Madrid', cap: 6, cd: 60, fx: { es: 8, ue: 1 } } ],
    ma: [ { id: 'arm', title: 'Venta de material militar a Marruecos', cost: 900, cap: 4, cd: 60, fx: { ma: 10, es: -2 }, now: { mil: 1 } },
          { id: 'lib', title: 'Acuerdo de libre comercio con Rabat', cap: 5, cd: 90, fx: { ma: 8 }, now: { eco: 1 } } ]
  },
  monthly: [
    { m: 'eco', gt: 70, fx: { ue: .8, jp: .6, uk: .6 }, why: 'Credibilidad económica de Washington' },
    { m: 'eco', lt: 30, fx: { ue: -1, jp: -.8 }, why: 'Economía débil ante los aliados' },
    { m: 'mil', gt: 80, fx: { cn: -.5, ru: -.5, jp: .5 }, why: 'Disuasión militar estadounidense' },
    { m: 'mil', lt: 40, fx: { jp: -1, ue: -.8, il: -.8 }, why: 'Dudas sobre el paraguas militar de EE. UU.' },
    { m: 'est', lt: 30, fx: { ue: -.8, mx: -.5 }, why: 'Inestabilidad interna en EE. UU.' }
  ],
  pop: [
    { id: 'cnt', cond: r => r.cn <= 22, title: 'PEKÍN AMENAZA CON RESTRINGIR LAS TIERRAS RARAS', desc: 'China advierte de que frenará la exportación de minerales críticos si Washington no levanta los aranceles.',
      options: [{ text: 'Negociar y rebajar los aranceles', intl: { cn: 10, jp: -2 }, cost: 0, stats: { eco: 2, apr: -2 }, news: 'Washington cede ante Pekín y rebaja aranceles a cambio de tierras raras.' }, { text: 'Responder con aranceles y reservas estratégicas', intl: { cn: -8 }, cost: 6000, stats: { eco: -2, mil: 2, apr: 2 }, news: 'EE. UU. responde con aranceles y crea reservas de minerales críticos.' }] },
    { id: 'rus', cond: r => r.ru <= 12, title: 'RUSIA RECLAMA UNA NUEVA CUMBRE', desc: 'El Kremlin ofrece una cumbre bilateral sobre control de armas a cambio de levantar sanciones.',
      options: [{ text: 'Aceptar la cumbre', intl: { ru: 10, ue: -4 }, cost: 600, stats: { est: 2, apr: 1 }, news: 'Washington y Moscú acuerdan una cumbre sobre control de armas.' }, { text: 'Rechazar y reforzar el flanco este de la OTAN', intl: { ru: -6, ue: 6 }, cost: 4500, stats: { mil: 2, est: -1 }, news: 'EE. UU. refuerza el flanco este de la OTAN y rechaza la cumbre.' }] },
    { id: 'ues', cond: r => r.ue <= 35, title: 'BRUSELAS ESTUDIA REPRESALIAS COMERCIALES', desc: 'La Comisión Europea prepara aranceles contra productos estadounidenses y presiona por las normas digitales.',
      options: [{ text: 'Acordar un pacto comercial transatlántico', intl: { ue: 12 }, cost: 3000, stats: { eco: 2 }, news: 'Washington y Bruselas pactan un acuerdo comercial para evitar la escalada.' }, { text: 'Responder con nuevos aranceles', intl: { ue: -8, cn: 2 }, stats: { eco: -2, apr: 2 }, news: 'EE. UU. responde con aranceles a las medidas europeas.' }] },
    { id: 'jpo', cond: r => r.jp >= 80, title: 'TOKIO Y SEÚL OFRECEN INVERTIR EN LA INDUSTRIA ESTADOUNIDENSE', desc: 'Japón y Corea del Sur proponen un gran fondo para fábricas de baterías y chips a cambio de garantías de seguridad.',
      options: [{ text: 'Aceptar y reforzar la alianza', intl: { jp: 8, cn: -3 }, income: 9000, stats: { eco: 3, emp: 2, apr: 1 }, news: 'Japón y Corea invertirán miles de millones en la industria estadounidense.' }, { text: 'Negociar sin compromisos de seguridad', intl: { jp: -4 }, income: 3000, stats: { eco: 1 }, news: 'Washington pacta la inversión asiática sin nuevas garantías de seguridad.' }] },
    { id: 'mex', cond: r => r.mx <= 35, title: 'MÉXICO ENDURECE EL TONO POR LOS ARANCELES', desc: 'La presidenta mexicana amenaza con represalias comerciales y con frenar la cooperación fronteriza.',
      options: [{ text: 'Ofrecer un acuerdo de seguridad y comercio', intl: { mx: 10 }, cost: 1800, stats: { est: 1, eco: 1 }, news: 'EE. UU. y México pactan un acuerdo de seguridad y comercio.' }, { text: 'Mantener la presión', intl: { mx: -8 }, stats: { est: -2, apr: 2 }, news: 'Washington mantiene la presión sobre México por el comercio y la frontera.' }] }
  ]
};
