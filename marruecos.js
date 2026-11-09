// =====================================================================
//  JUEGO DE MARRUECOS · integrado en la interfaz principal
//  - Ya no crea una pantalla propia: es una pestaña más del menú lateral
//    y usa las mismas clases visuales que España (hoi-box, hoi-button…).
//  - El estado vive en gameState.mp.P (= gameState.morocco), así que se
//    guarda, se sincroniza con el jugador 2 y comparte día con España.
//  - La simulación la ejecuta SOLO el anfitrión (multijugador.js llama a
//    moroccoTick() una vez por cada día de España). El jugador 2 envía
//    órdenes y recibe el estado, igual que ya hacía el resto del modo.
// =====================================================================
(function () {
  'use strict';
  const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));

  // Regiones (polígonos esquemáticos en lon/lat) – se proyectan a un SVG de 340x330
  const REG = [
    ['TTA', 'Tánger-Tetuán-Alhucemas', [[-6, 35.8], [-5.3, 35.9], [-3.9, 35.2], [-4.3, 34.7], [-5.5, 34.6], [-6.1, 35]]],
    ['ORI', 'Oriental', [[-3.9, 35.2], [-2.2, 35.1], [-1.2, 32.5], [-1.2, 31.9], [-3, 32], [-4, 33.2], [-4.3, 34.7]]],
    ['FEM', 'Fez-Meknes', [[-5.5, 34.6], [-4.3, 34.7], [-4, 33.2], [-4.4, 32.6], [-5.3, 32.8], [-6, 33.6]]],
    ['RSK', 'Rabat-Salé-Kénitra', [[-6.1, 35], [-5.5, 34.6], [-6, 33.6], [-6.9, 33.5], [-7, 34.3], [-6.5, 34.6]]],
    ['CAS', 'Casablanca-Settat', [[-6.9, 33.5], [-6, 33.6], [-6.2, 32.6], [-7.5, 32.3], [-8.8, 32.9], [-7.7, 33.6]]],
    ['BMK', 'Béni Mellal-Khénifra', [[-6, 33.6], [-5.3, 32.8], [-5.5, 32], [-6.5, 31.7], [-6.2, 32.6]]],
    ['MAR', 'Marrakech-Safi', [[-7.5, 32.3], [-6.2, 32.6], [-6.5, 31.7], [-7.5, 30.8], [-9, 30.6], [-9.9, 31.5], [-9.2, 32.5]]],
    ['DRA', 'Drâa-Tafilalet', [[-4.4, 32.6], [-3, 32], [-2, 30.8], [-4, 29.2], [-6.2, 29.8], [-7.5, 30.8], [-6.5, 31.7], [-5.5, 32]]],
    ['SOU', 'Souss-Massa', [[-9, 30.6], [-7.5, 30.8], [-6.2, 29.8], [-8.7, 28.7], [-9.9, 29.4]]],
    ['GUE', 'Guelmim-Oued Noun', [[-10.2, 29.2], [-8.7, 28.7], [-8.7, 27.7], [-11.1, 27.8]]],
    ['LAA', 'Laâyoune-Sakia El Hamra', [[-11.1, 27.8], [-8.7, 27.7], [-8.7, 25], [-14.5, 26], [-13.2, 27.7]]],
    ['DAK', 'Dakhla-Oued Ed-Dahab', [[-14.5, 26], [-8.7, 25], [-8.7, 21.4], [-17, 21.4], [-16, 23.7], [-15, 25]]]
  ];
  const pts = p => p.map(([lo, la]) => ((lo + 17) * 20).toFixed(0) + ',' + ((36 - la) * 22).toFixed(0)).join(' ');
  const BUD = [
    { id: 'edu', t: 'Educación', ic: 'fa-graduation-cap', cost: 1.5, d: 'Mejora la aprobación y, a largo plazo, la economía.', fx: { apr: 0.0003, eco: 0.0002 } },
    { id: 'san', t: 'Sanidad', ic: 'fa-heart-pulse', cost: 1.5, d: 'Sube la aprobación y algo la estabilidad.', fx: { apr: 0.0004, est: 0.0001 } },
    { id: 'def', t: 'Defensa', ic: 'fa-shield', cost: 1.5, d: 'Mantiene la preparación de las FAR.', fx: { mil: 0.0006 } },
    { id: 'inf', t: 'Infraestructuras', ic: 'fa-road', cost: 1.5, d: 'Puertos, carreteras y energía: impulsa la economía.', fx: { eco: 0.0005 } },
    { id: 'seg', t: 'Seguridad e Interior', ic: 'fa-user-shield', cost: 1.5, d: 'Más estabilidad interna.', fx: { est: 0.0005 } },
    { id: 'agr', t: 'Agricultura y agua', ic: 'fa-wheat-awn', cost: 1.5, d: 'Campo y agua: ayuda a economía, aprobación y estabilidad.', fx: { eco: 0.0002, apr: 0.0002, est: 0.0002 } }];
  const POL = [
    { id: 'green', t: 'Plan Generación Verde', cost: 600, cap: 5, cd: 60, P: { eco: 3, apr: 2 }, d: 'Renovables e industria verde.' },
    { id: 'edu', t: 'Reforma educativa', cost: 400, cap: 4, cd: 60, P: { apr: 3, eco: 1 }, d: 'Nuevo modelo escolar y universitario.' },
    { id: 'agua', t: 'Desaladoras y trasvases', cost: 500, cap: 4, cd: 60, P: { eco: 2, est: 2 }, d: 'Seguridad hídrica frente a la sequía.' },
    { id: 'tgv', t: 'Alta velocidad Tánger–Marrakech', cost: 900, cap: 6, cd: 90, P: { eco: 4, apr: 2 }, d: 'Gran obra ferroviaria.' },
    { id: 'mundial', t: 'Mundial 2030 con España', cost: 800, cap: 6, cd: 90, P: { apr: 4, eco: 3 }, ES: { eco: 1 }, rel: 4, d: 'Sede compartida: beneficia a ambos.' },
    { id: 'pan', t: 'Subsidio al pan y al butano', cost: 300, cap: 3, cd: 45, P: { apr: 4, est: 2 }, d: 'Alivio de precios para las familias.' },
    { id: 'gas', t: 'Gasoducto con España', cost: 700, cap: 6, cd: 90, P: { eco: 3 }, ES: { eco: 2 }, rel: 5, d: 'Energía compartida: beneficia a ambos.' }];
  const EVS = [
    { title: 'Sequía y malas cosechas', desc: 'Seis años de sequía hunden el campo y el pan se encarece.', opts: [
      { t: 'Importar cereal y subsidiar el pan (−400 M€)', tes: -400, P: { apr: 4, eco: -1 } }, { t: 'Racionar el agua y dejar que ajuste el mercado', P: { apr: -6, est: -3, eco: 1 } }] },
    { title: 'Protestas juveniles', desc: 'Miles de jóvenes salen a la calle exigiendo sanidad, educación y empleo.', opts: [
      { t: 'Abrir diálogo y reformas (−300 M€)', tes: -300, P: { apr: 6, est: 4 } }, { t: 'Mano dura y detenciones', P: { est: -2, apr: -7, mil: 2 } }] },
    { title: 'Boom de los fosfatos', desc: 'El precio mundial de los fosfatos se dispara.', opts: [
      { t: 'Contrato preferente con España (+500 M€)', tes: 500, P: { eco: 2 }, ES: { eco: 2 }, rel: 5 }, { t: 'Vender al mejor postor (+800 M€)', tes: 800, P: { eco: 3 }, rel: -4 }] },
    { title: 'Presión migratoria en Ceuta y Melilla', desc: 'Cientos de personas se concentran junto a la valla.', opts: [
      { t: 'Reforzar la contención (−200 M€)', tes: -200, ES: { est: 2 }, rel: 4 }, { t: 'Relajar controles para presionar a Madrid', P: { apr: 3 }, ES: { est: -5, apr: -3 }, rel: -10 }] },
    { title: 'Terremoto en el Atlas', desc: 'Un seísmo devasta varias provincias de montaña.', opts: [
      { t: 'Pedir ayuda urgente a España (1.000 M€)', P: { apr: 3 }, ask: 1, rel: 2 }, { t: 'Gestionarlo en solitario (−700 M€)', tes: -700, P: { apr: -2, est: -2 } }] }];

  // ---------------- CÁMARA DE REPRESENTANTES (395 escaños, mayoría 198) ----------------
  const TOTAL = 395, MAJ = 198;
  // order = posición en el espectro (para el hemiciclo y la votación de investidura); red = líneas rojas
  const MPARTIES = [
    { id: 'FGD', name: 'Federación de la Izquierda Democrática', color: '#be185d', ideo: 'Izquierda', order: 1, seats: 1, max: 60, leader: 'Candidatura de la FGD', red: ['RNI', 'PAM', 'UC', 'PI', 'MP'] },
    { id: 'PPS', name: 'Partido del Progreso y el Socialismo', color: '#f97316', ideo: 'Izquierda', order: 2, seats: 22, max: 70, leader: 'Nabil Benabdallah', red: [] },
    { id: 'USFP', name: 'Unión Socialista de Fuerzas Populares', color: '#f43f5e', ideo: 'Socialdemocracia', order: 3, seats: 34, max: 90, leader: 'Driss Lachguar', red: [] },
    { id: 'PJD', name: 'Partido Justicia y Desarrollo', color: '#38bdf8', ideo: 'Islamismo conservador', order: 4, seats: 13, max: 130, leader: 'Abdelilah Benkirane', red: ['PAM'] },
    { id: 'MP', name: 'Movimiento Popular', color: '#a16207', ideo: 'Centro rural', order: 5, seats: 28, max: 70, leader: 'Dirección del MP', red: [] },
    { id: 'UC', name: 'Unión Constitucional', color: '#eab308', ideo: 'Liberal', order: 6, seats: 18, max: 60, leader: 'Mohamed Sajid', red: [] },
    { id: 'PAM', name: 'Autenticidad y Modernidad', color: '#16a34a', ideo: 'Centro modernista', order: 7, seats: 87, max: 130, leader: 'Abdellatif Ouahbi', red: ['PJD'] },
    { id: 'RNI', name: 'Agrupación Nacional de Independientes', color: '#2563eb', ideo: 'Liberal / centroderecha', order: 8, seats: 102, max: 150, leader: 'Aziz Akhannouch', red: [] },
    { id: 'PI', name: 'Istiqlal', color: '#dc2626', ideo: 'Nacionalista conservador', order: 9, seats: 81, max: 120, leader: 'Nizar Baraka', red: [] },
    { id: 'MDS', name: 'Movimiento Demócrata y Social', color: '#94a3b8', ideo: 'Centro', order: 10, seats: 3, max: 25, leader: 'Dirección del MDS', red: [] },
    { id: 'OTR', name: 'Independientes y otros', color: '#64748b', ideo: 'Varios', order: 11, seats: 6, max: 30, leader: 'Independiente', red: [] }
  ];
  const PBY = id => MPARTIES.find(p => p.id === id);
  const pname = id => (id === 'TEC' ? 'Técnico' : (PBY(id) ? PBY(id).id : id));

  // ---------------- MINISTERIOS Y MINISTROS ----------------
  // sov: ministerio de soberanía (el Palacio prefiere un técnico de su confianza)
  const MINISTRIES = [
    { id: 'economia', title: 'Ministerio de Economía y Finanzas', icon: 'fa-chart-pie' },
    { id: 'interior', title: 'Ministerio del Interior', icon: 'fa-user-shield', sov: 1 },
    { id: 'defensa', title: 'Administración de Defensa Nacional', icon: 'fa-person-military-rifle', sov: 1 },
    { id: 'exteriores', title: 'Asuntos Exteriores y Cooperación Africana', icon: 'fa-earth-africa', sov: 1 },
    { id: 'awqaf', title: 'Habices y Asuntos Islámicos', icon: 'fa-mosque', sov: 1 },
    { id: 'justicia', title: 'Ministerio de Justicia', icon: 'fa-scale-balanced' },
    { id: 'educacion', title: 'Educación Nacional y Deportes', icon: 'fa-graduation-cap' },
    { id: 'sanidad', title: 'Sanidad y Protección Social', icon: 'fa-hospital' },
    { id: 'equipamiento', title: 'Equipamiento y Agua', icon: 'fa-road' },
    { id: 'agricultura', title: 'Agricultura, Pesca y Desarrollo Rural', icon: 'fa-wheat-awn' },
    { id: 'industria', title: 'Industria y Comercio', icon: 'fa-industry' },
    { id: 'energia', title: 'Transición Energética y Desarrollo Sostenible', icon: 'fa-bolt' },
    { id: 'cultura', title: 'Juventud, Cultura y Comunicación', icon: 'fa-masks-theater' }
  ];
  const MIN = [
    { id: 'nadia', name: 'Nadia Fettah Alaoui', party: 'RNI', portfolio: 'economia', pros: '+1,5 Economía', cons: '−1 Aprobación (ajustes impopulares)', effects: { eco: 1.5, apr: -1 } },
    { id: 'laftit', name: 'Abdelouafi Laftit', party: 'TEC', portfolio: 'interior', pros: '+2 Estabilidad, +1 Palacio', cons: '−1 Aprobación (mano dura)', effects: { est: 2, palace: 1, apr: -1 } },
    { id: 'loudiyi', name: 'Abdellatif Loudiyi', party: 'TEC', portfolio: 'defensa', pros: '+2 Poder militar, +1 Palacio', cons: 'Sin control parlamentario', effects: { mil: 2, palace: 1 } },
    { id: 'bourita', name: 'Nasser Bourita', party: 'TEC', portfolio: 'exteriores', pros: '+1,5 Palacio, +0,5 Economía', cons: 'Diplomacia opaca para la coalición', effects: { palace: 1.5, eco: 0.5 } },
    { id: 'toufiq', name: 'Ahmed Toufiq', party: 'TEC', portfolio: 'awqaf', pros: '+1,5 Palacio, +1 Estabilidad', cons: 'Poco margen para reformas', effects: { palace: 1.5, est: 1 } },
    { id: 'ouahbi', name: 'Abdellatif Ouahbi', party: 'PAM', portfolio: 'justicia', pros: '+1 Estabilidad', cons: '−1 Aprobación (polémicas constantes)', effects: { est: 1, apr: -1 } },
    { id: 'berrada', name: 'Mohamed Saad Berrada', party: 'RNI', portfolio: 'educacion', pros: '+1 Aprobación (reforma escolar)', cons: '−0,5 Estabilidad (huelgas docentes)', effects: { apr: 1, est: -0.5 } },
    { id: 'aittaleb', name: 'Khalid Aït Taleb', party: 'RNI', portfolio: 'sanidad', pros: '+1,5 Aprobación (red hospitalaria)', cons: '−0,5 Economía (coste del sistema)', effects: { apr: 1.5, eco: -0.5 } },
    { id: 'baraka', name: 'Nizar Baraka', party: 'PI', portfolio: 'equipamiento', pros: '+1,5 Economía (obra pública)', cons: '−0,5 Palacio (peso propio del Istiqlal)', effects: { eco: 1.5, palace: -0.5 } },
    { id: 'sadiki', name: 'Mohammed Sadiki', party: 'RNI', portfolio: 'agricultura', pros: '+1 Economía, +0,5 Estabilidad', cons: '−0,5 Aprobación (sequía)', effects: { eco: 1, est: 0.5, apr: -0.5 } },
    { id: 'mezzour', name: 'Ryad Mezzour', party: 'PI', portfolio: 'industria', pros: '+2 Economía (automoción y aeronáutica)', cons: '−0,5 Aprobación', effects: { eco: 2, apr: -0.5 } },
    { id: 'benali', name: 'Leila Benali', party: 'TEC', portfolio: 'energia', pros: '+1,5 Economía, +0,5 Estabilidad', cons: '−0,5 Aprobación', effects: { eco: 1.5, est: 0.5, apr: -0.5 } },
    { id: 'bensaid', name: 'Mehdi Bensaid', party: 'PAM', portfolio: 'cultura', pros: '+1 Aprobación (juventud)', cons: '−0,5 Estabilidad', effects: { apr: 1, est: -0.5 } }
  ];
  const shadowOf = (party, pf) => ({ id: 'shadow_' + party + '_' + pf, name: 'Portavoz sectorial', party, portfolio: pf, pros: '+1 Estabilidad y representación de la coalición', cons: '−0,5 Aprobación por falta de perfil técnico', effects: { est: 1, apr: -0.5 } });
  const tecOf = pf => ({ id: 'tec_' + pf, name: 'Técnico de confianza del Palacio', party: 'TEC', portfolio: pf, pros: '+1 Palacio, +0,5 Estabilidad', cons: '−0,5 Aprobación: sin base parlamentaria', effects: { palace: 1, est: 0.5, apr: -0.5 } });
  function minOf(id) {
    if (!id) return null;
    const x = MIN.find(a => a.id === id); if (x) return x;
    const p = String(id).split('_');
    if (p[0] === 'shadow' && PBY(p[1])) return shadowOf(p[1], p[2]);
    if (p[0] === 'tec') return tecOf(p[1]);
    return null;
  }
  function availMin(m, pf) {
    const co = m.coalIds || [];
    const list = MIN.filter(x => x.portfolio === pf && (co.includes(x.party) || x.party === 'TEC'));
    co.forEach(p => { if (!list.some(x => x.party === p)) list.push(shadowOf(p, pf)); });
    if (!list.some(x => x.party === 'TEC')) list.push(tecOf(pf));
    return list;
  }

  // ---------------- DECISIONES DE GOBIERNO (equivalentes a las de España, con sus propios dilemas) ----------------
  // t: texto · tes: M€ (− gasto, + ingreso) · P: efectos · ES: efectos en España · rel: relación bilateral · loy: lealtad de socios
  const DECS = [
    { cat: 'SOCIEDAD', title: 'REFORMA DEL CÓDIGO DE FAMILIA (MUDAWANA)', desc: 'Las organizaciones de mujeres exigen más derechos en herencia, custodia y matrimonio; los sectores conservadores y religiosos se oponen.', opts: [
      { t: 'Aprobar una reforma profunda e igualitaria', P: { apr: 4, est: -3, palace: -2 }, loy: { USFP: 15, PPS: 20, PJD: -30, MP: -10, PI: -15 } },
      { t: 'Limitarse a retoques técnicos tras consultar al Consejo de Ulemas', P: { apr: -3, est: 2, palace: 3 }, loy: { PJD: 10, PI: 10, USFP: -15, PPS: -20 } }] },
    { cat: 'ECONOMÍA', title: 'CANNABIS LEGAL EN EL RIF', desc: 'Las cooperativas piden extender la producción legal de cannabis medicinal e industrial y regularizar a miles de agricultores.', opts: [
      { t: 'Ampliar la producción legal a todo el Rif (−150 M€)', tes: -150, P: { eco: 3, apr: 3, est: 2 }, loy: { PAM: 15, PJD: -15, PI: -5 } },
      { t: 'Mantener el modelo restrictivo', P: { apr: -2, est: -2 }, loy: { PAM: -10, PJD: 8 } }] },
    { cat: 'PROTESTAS', title: 'ESTADIOS FRENTE A HOSPITALES Y ESCUELAS', desc: 'Los jóvenes protestan: piden que el dinero de las grandes obras deportivas se destine a sanidad y educación.', opts: [
      { t: 'Reorientar fondos a hospitales y escuelas (−600 M€)', tes: -600, P: { apr: 8, est: 4, eco: -1 }, loy: { USFP: 10, PPS: 10, RNI: -8 } },
      { t: 'Mantener el calendario de obras del Mundial 2030', P: { apr: -7, est: -4, eco: 3 }, ES: { eco: 1 }, rel: 2, loy: { RNI: 8, PI: 5 } }] },
    { cat: 'SUR', title: 'PROVINCIAS DEL SUR Y PLAN DE AUTONOMÍA', desc: 'El Palacio pide reforzar la apuesta por el Sáhara en el plano económico y diplomático.', opts: [
      { t: 'Acelerar inversiones en Dakhla y el puerto atlántico (−500 M€)', tes: -500, P: { eco: 3, apr: 2, palace: 4 }, loy: { PI: 10 } },
      { t: 'Ofensiva diplomática en busca de nuevos reconocimientos (−120 M€)', tes: -120, P: { palace: 5, apr: 1 }, loy: { PI: 8 } }] },
    { cat: 'LABORAL', title: 'SALARIO MÍNIMO Y DIÁLOGO SOCIAL', desc: 'Los sindicatos amenazan con huelgas generales si no se actualizan los salarios ante la inflación.', opts: [
      { t: 'Subir el SMIG un 10 % y firmar el acuerdo social (−350 M€)', tes: -350, P: { apr: 6, est: 3, eco: -2 }, loy: { USFP: 15, PPS: 15, UC: -10, RNI: -5 } },
      { t: 'Congelar salarios y dar incentivos fiscales a las empresas', P: { eco: 3, apr: -6, est: -3 }, loy: { RNI: 10, UC: 10, USFP: -15 } }] },
    { cat: 'AGUA', title: 'SEQUÍA ESTRUCTURAL', desc: 'Los embalses están al mínimo histórico. Hay que elegir entre priorizar el consumo humano o el campo exportador.', opts: [
      { t: 'Acelerar desaladoras y restringir cultivos de alto consumo (−500 M€)', tes: -500, P: { eco: 1, est: 3, apr: -1 }, loy: { MP: -10 } },
      { t: 'Priorizar la exportación agrícola con trasvases', P: { eco: 3, est: -4, apr: -2 }, loy: { MP: 10, RNI: 5 } }] },
    { cat: 'PRECIOS', title: 'REFORMA DE LA CAJA DE COMPENSACIÓN', desc: 'Los subsidios universales al butano y al pan pesan cada vez más en las cuentas públicas.', opts: [
      { t: 'Sustituirlos por ayuda directa a las familias (−300 M€)', tes: -300, P: { eco: 2, apr: -3, est: -2 }, loy: { RNI: 8, PPS: -8 } },
      { t: 'Mantener los subsidios universales (−250 M€)', tes: -250, P: { apr: 4, est: 2, eco: -2 }, loy: { PPS: 8, USFP: 8 } }] },
    { cat: 'DEFENSA', title: 'MODERNIZACIÓN MILITAR', desc: 'Las FAR piden renovar drones y defensa antiaérea ante la carrera de armamentos regional.', opts: [
      { t: 'Comprar drones y sistemas antiaéreos en el exterior (−600 M€)', tes: -600, P: { mil: 7, palace: 3, apr: -1 } },
      { t: 'Producir en Marruecos con socios europeos (−350 M€)', tes: -350, P: { mil: 4, eco: 2 }, ES: { eco: 1 }, rel: 3 }] },
    { cat: 'ESPAÑA', title: 'ADUANAS DE CEUTA Y MELILLA', desc: 'Los comerciantes del norte piden normalizar el comercio fronterizo con las ciudades autónomas.', opts: [
      { t: 'Abrir aduanas comerciales para reactivar el comercio', P: { eco: 2 }, ES: { eco: 1 }, rel: 6 },
      { t: 'Mantenerlas cerradas como palanca de presión', P: { apr: 1 }, ES: { est: -2 }, rel: -6 }] },
    { cat: 'FISCAL', title: 'REFORMA FISCAL', desc: 'El FMI y la oposición reclaman un nuevo reparto de la carga tributaria.', opts: [
      { t: 'Impuestos progresivos y a artículos de lujo (+400 M€)', tes: 400, P: { eco: -1, apr: 3, est: 1 }, loy: { USFP: 10, PPS: 10, UC: -10 } },
      { t: 'Bajar el impuesto de sociedades para atraer inversión (−200 M€)', tes: -200, P: { eco: 4, apr: -2 }, loy: { RNI: 10, UC: 10, USFP: -10 } }] },
    { cat: 'JUSTICIA', title: 'LEY CONTRA EL ENRIQUECIMIENTO ILÍCITO', desc: 'Un escándalo de contratos públicos reabre el debate sobre una ley anticorrupción.', opts: [
      { t: 'Aprobarla con una agencia independiente', P: { apr: 6, est: 2, palace: -1 }, loy: { PJD: 10, PPS: 10, RNI: -10, PAM: -10 } },
      { t: 'Archivar el proyecto', P: { apr: -6, est: -2 }, loy: { RNI: 5, PAM: 5 } }] },
    { cat: 'INVERSIÓN', title: 'GIGAFACTORÍA DE BATERÍAS', desc: 'Un consorcio internacional quiere instalar una gran fábrica de baterías para coches eléctricos.', opts: [
      { t: 'Ofrecer incentivos generosos al consorcio asiático (−250 M€)', tes: -250, P: { eco: 5, apr: 2, palace: 1 } },
      { t: 'Exigir contenido local y socios europeos', P: { eco: 2, apr: 1 }, ES: { eco: 1 }, rel: 3 }] },
    { cat: 'MIGRACIÓN', title: 'MIGRACIÓN SUBSAHARIANA', desc: 'Miles de migrantes viven sin papeles en las ciudades del norte y presionan hacia Europa.', opts: [
      { t: 'Regularizarlos con permisos de trabajo (−100 M€)', tes: -100, P: { eco: 1, apr: -3, est: 1 }, ES: { est: 2 }, rel: 4, loy: { PJD: -10, PPS: 10 } },
      { t: 'Endurecer controles y repatriaciones', P: { apr: 2, est: 1, eco: -1 }, loy: { PJD: 5 } }] },
    { cat: 'POLÍTICA', title: 'REFORMA ELECTORAL', desc: 'Los grandes partidos quieren cambiar el cociente electoral; los pequeños temen desaparecer.', opts: [
      { t: 'Cambiar el cociente a favor de los grandes partidos', P: { est: 3, apr: -2 }, loy: { RNI: 15, PAM: 15, PJD: -25, PPS: -15, USFP: -15 } },
      { t: 'Mantener el cociente actual sobre inscritos', P: { est: -1 }, loy: { PJD: 10, PPS: 10, USFP: 10, RNI: -8 } }] },
    { cat: 'DERECHOS', title: 'AMNISTÍA PARA LAS PROTESTAS DEL RIF', desc: 'Se multiplican las peticiones de gracia para condenados por las protestas del norte.', opts: [
      { t: 'Pedir al Rey un indulto amplio', P: { apr: 5, est: 3, palace: -2 }, loy: { USFP: 10, PPS: 10, PJD: 10 } },
      { t: 'Mantener las condenas', P: { apr: -3, palace: 2 } }] },
    { cat: 'ENERGÍA', title: 'GASODUCTO NIGERIA–MARRUECOS', desc: 'El proyecto energético africano necesita financiación para dar el salto.', opts: [
      { t: 'Financiación pública del tramo marroquí (−700 M€)', tes: -700, P: { eco: 4, apr: 1 }, ES: { eco: 1 }, rel: 3 },
      { t: 'Esperar a inversores privados del Golfo', P: { eco: 1 } }] }
  ];
  const STN = { eco: 'Eco', est: 'Estab', apr: 'Aprob', mil: 'Mil', palace: 'Palacio' };

  const shuffle = n => { const a = Array.from({ length: n }, (_, i) => i); for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function nextDec(m) {
    if (!m.deck || !m.deck.length) m.deck = shuffle(DECS.length);
    m.dec = m.deck.pop();
  }

  // ---------------- ESTADO ----------------
  // «mil» es un valor derivado de las tres armas (así funciona con el resto del modo multijugador)
  function wrap(m) {
    const d = Object.getOwnPropertyDescriptor(m, 'mil');
    if (d && d.get) return m;
    delete m.mil;
    Object.defineProperty(m, 'mil', {
      enumerable: true, configurable: true,
      get() { return Math.round((this.army.tierra + this.army.mar + this.army.aire) / 3); },
      set(v) { const a = this.army, dl = v - (a.tierra + a.mar + a.aire) / 3; Object.keys(a).forEach(b => { a[b] = clamp(a[b] + dl); }); }
    });
    return m;
  }
  // Datos extra para que Marruecos tenga los mismos indicadores que España
  function ex(m) {
    if (m.emp == null) m.emp = 48; if (m.debt == null) m.debt = 68; if (m.leg == null) m.leg = 1;
    if (!m.wk) m.wk = { w: Math.floor((m.day || 1) / 7), n: 0 }; if (m.decN == null) m.decN = 0;
    return m;
  }
  const prima = m => Math.round(Math.max(20, Math.min(900, 40 + (55 - m.eco) * 2.4 + Math.max(0, m.debt - 60) * 1.5 + (50 - m.est) * 0.9)));
  const M = () => { const s = gameState.mp; return s && s.partner === 'MA' && s.P && s.P.army ? wrap(s.P) : null; };
  const UI = { tab: 'main', sel: null };   // estado de pantalla (local de cada jugador, no se sincroniza)
  const pending = m => !!(m && m.setup && !m.setup.done);
  const localMode = () => !!(gameState.mp && gameState.mp.mode !== 'online');

  const addSt = (m, k, v) => { if (k === 'mil') Object.keys(m.army).forEach(b => { m.army[b] = clamp(m.army[b] + v); }); else if (m[k] != null) m[k] = clamp(m[k] + v); };

  // Crea la partida de Marruecos. Empieza en el mismo día que España.
  function initMorocco(name) {
    const day = gameState.daysInOffice || 1;
    const seats = {}; MPARTIES.forEach(p => { seats[p.id] = p.seats; });
    const m = {
      name: name || 'Jefe de Gobierno', day, eco: 52, est: 60, apr: 55, tes: 9000, cap: 30, palace: 60,
      bud: Object.fromEntries(BUD.map(b => [b.id, 50])),
      army: { tierra: 55, mar: 35, aire: 40 },
      // formación de Gobierno: 1) escaños, 2) pactómetro. Hasta que termina, la partida no arranca.
      setup: { phase: 'seats', seats, leader: 'RNI', coal: ['RNI'], done: false },
      seats: Object.assign({}, seats), leader: 'RNI', coalIds: ['RNI'], coal: {}, min: {}, minority: false,
      deck: [], dec: null, decCd: 0,
      reg: REG.map(() => ({ est: 50 + Math.floor(Math.random() * 25), crisis: 0 })),
      cd: {}, evt: null, next: day + 25, log: ['Comienza tu mandato al frente del Gobierno de Marruecos.']
    };
    wrap(m); ex(m);
    gameState.morocco = m;
    if (window.MP && typeof MP.setAdapter === 'function') {
      MP.setAdapter({
        me: 'MA', name: 'Marruecos', flag: '🇲🇦',
        tes: () => m.tes, pay: v => { m.tes -= v; }, gain: v => { m.tes += v; },
        cap: () => m.cap, spendCap: v => { m.cap -= v; },
        mil: () => Math.round((m.army.tierra + m.army.mar + m.army.aire) / 3),
        st: (k, v) => addSt(m, k, v),
        pause: () => { if (typeof setGameSpeed === 'function') setGameSpeed(0); },
        toast: t => { lg(m, t); if (gameState.activeTab === 'morocco') render(); },
        redraw: () => { if (gameState.activeTab === 'morocco') render(); }
      });
    }
    return m;
  }
  const lg = (m, t) => { m.log.unshift('Día ' + m.day + ' · ' + t); m.log.length = Math.min(m.log.length, 12); };
  const diff = () => { try { return diffCfg(); } catch (e) { return { mult: 1, attr: 0, expense: 0 }; } };
  const coalSeats = m => (m.coalIds || []).reduce((t, id) => t + ((m.seats || {})[id] || 0), 0);

  // ---------------- INVESTIDURA (igual que la de España, con 395 escaños y mayoría de 198) ----------------
  const seatTotal = s => MPARTIES.reduce((t, p) => t + (s.seats[p.id] || 0), 0);
  function redOk(s, id) {
    const c = PBY(id); if (!c) return { ok: false };
    for (const mid of s.coal) {
      const mem = PBY(mid); if (!mem) continue;
      if ((c.red || []).includes(mid)) return { ok: false, why: c.id + ' rechaza pactar con ' + mem.id };
      if ((mem.red || []).includes(id)) return { ok: false, why: mem.id + ' se niega a gobernar junto a ' + c.id };
    }
    return { ok: true };
  }
  function votes(s) {
    const lead = PBY(s.leader); let yes = 0, no = 0, abst = 0;
    MPARTIES.forEach(p => {
      const n = s.seats[p.id] || 0;
      if (s.coal.includes(p.id)) { yes += n; return; }
      const hostile = lead && ((p.red || []).includes(lead.id) || (lead.red || []).includes(p.id) || Math.abs(p.order - lead.order) >= 5);
      if (hostile) no += n; else abst += n;
    });
    return { yes, no, abst, first: yes >= MAJ, second: yes > no };
  }

  // ---------------- ACCIONES (se ejecutan SIEMPRE en el anfitrión) ----------------
  const toast = t => { try { MP.toast(t); } catch (e) { console.log(t); } };
  const need = (m, cap, cost) => { if (m.cap < cap) { toast('Capital político insuficiente.'); return false; } if (m.tes < cost) { toast('Fondos insuficientes.'); return false; } return true; };
  const redraw = () => { try { render(); } catch (e) { /* sin pantalla */ } };
  const SETUP_FNS = ['seat', 'sphase', 'leader', 'coalTog', 'govStart'];

  function breakCoalition(m, p) {
    delete m.coal[p]; m.coalIds = (m.coalIds || []).filter(x => x !== p);
    Object.keys(m.min || {}).forEach(pf => { const mi = minOf(m.min[pf]); if (mi && mi.party === p) m.min[pf] = null; });
    addSt(m, 'apr', -4); addSt(m, 'est', -3); addSt(m, 'palace', -4);
    m.minority = coalSeats(m) < MAJ;
    lg(m, 'CRISIS DE GOBIERNO: ' + p + ' abandona la coalición y sus ministros son cesados.');
    toast('Marruecos: ' + p + ' rompe la coalición de gobierno.');
  }

  const R = {
    // --- formación de Gobierno ---
    seat: (id, v) => { const m = M(), s = m && m.setup, p = PBY(id); if (!s || s.done || !p) return; s.seats[id] = clamp(Math.round(+v) || 0, 0, p.max); redraw(); },
    sphase: ph => {
      const m = M(), s = m && m.setup; if (!s || s.done) return;
      if (ph === 'coal') { if (seatTotal(s) !== TOTAL) return toast('Los escaños deben sumar ' + TOTAL + '.'); s.phase = 'coal'; }
      else s.phase = 'seats';
      redraw();
    },
    leader: id => {
      const m = M(), s = m && m.setup; if (!s || s.done || !PBY(id)) return;
      s.leader = id; s.coal = s.coal.filter(x => x === id || (!(PBY(x).red || []).includes(id) && !(PBY(id).red || []).includes(x)));
      if (!s.coal.includes(id)) s.coal.unshift(id);
      redraw();
    },
    coalTog: id => {
      const m = M(), s = m && m.setup; if (!s || s.done || !PBY(id) || id === s.leader) return;
      if (s.coal.includes(id)) s.coal = s.coal.filter(x => x !== id);
      else if (redOk(s, id).ok) s.coal.push(id);
      redraw();
    },
    govStart: () => {
      const m = M(), s = m && m.setup; if (!s || s.done) return;
      if (seatTotal(s) !== TOTAL) return toast('Los escaños deben sumar ' + TOTAL + '.');
      const v = votes(s); if (!(v.first || v.second)) return toast('Investidura fallida: busca más apoyos.');
      m.seats = Object.assign({}, s.seats); m.leader = s.leader;
      const order = [s.leader].concat(s.coal.filter(x => x !== s.leader));
      m.coalIds = order.slice(); m.coal = {}; order.forEach(id => { if (id !== s.leader) m.coal[id] = 80; });
      const biggest = MPARTIES.slice().sort((a, b) => (s.seats[b.id] || 0) - (s.seats[a.id] || 0))[0].id;
      m.palace = s.leader === biggest ? 60 : 48;       // el Rey prefiere encargar el Gobierno al partido más votado
      m.minority = coalSeats(m) < MAJ;
      const sov = { interior: 'laftit', exteriores: 'bourita', defensa: 'loudiyi', awqaf: 'toufiq' };
      m.min = {}; let k = 0;
      MINISTRIES.forEach(x => {
        if (sov[x.id]) { m.min[x.id] = sov[x.id]; return; }
        const party = order[k % order.length]; k++;
        const av = availMin(m, x.id).filter(a => a.party === party);
        m.min[x.id] = av.length ? av[0].id : null;
      });
      m.deck = shuffle(DECS.length); m.dec = null; m.decCd = 4;
      s.done = true; s.phase = 'done';
      lg(m, PBY(s.leader).leader + ' (' + s.leader + ') forma Gobierno' + (m.minority ? ' en minoría' : ' con mayoría') + ' (' + coalSeats(m) + '/' + TOTAL + ').');
      toast('Marruecos ha formado Gobierno.');
      redraw();
    },
    // --- gobierno ---
    minister: (pf, id) => {
      const m = M(); if (!m || !m.min || !MINISTRIES.some(x => x.id === pf)) return;
      if (!id) { m.min[pf] = null; return redraw(); }
      const mi = availMin(m, pf).find(x => x.id === id); if (!mi) return;
      const sov = MINISTRIES.find(x => x.id === pf).sov, old = minOf(m.min[pf]);
      if (sov && mi.party !== 'TEC' && !(old && old.party !== 'TEC')) { addSt(m, 'palace', -4); lg(m, 'El Palacio ve con recelo un ministro de partido en ' + MINISTRIES.find(x => x.id === pf).title + '.'); }
      else if (sov && mi.party === 'TEC' && old && old.party !== 'TEC') addSt(m, 'palace', 2);
      m.min[pf] = id; lg(m, 'Nombramiento: ' + mi.name + ' (' + pname(mi.party) + ') en ' + MINISTRIES.find(x => x.id === pf).title + '.'); redraw();
    },
    pick: i => {
      const m = M(), d = m && m.dec != null ? DECS[m.dec] : null, o = d && d.opts[i]; if (!o) return;
      if (o.tes && o.tes < 0 && m.tes < -o.tes) return toast('Fondos insuficientes.');
      if (o.tes) m.tes += o.tes;
      Object.keys(o.P || {}).forEach(k => addSt(m, k, o.P[k]));
      Object.keys(o.loy || {}).forEach(p => { if (p in m.coal) m.coal[p] = clamp(m.coal[p] + o.loy[p]); });
      if (o.ES || o.rel) MP.cross(o.ES, o.rel, 'Marruecos: ' + d.title.toLowerCase() + '.');
      lg(m, d.title + ' → ' + o.t.replace(/ \(.*\)$/, '') + '.'); m.dec = null; m.decCd = 4; ex(m); m.decN++; m.wk.n++; redraw();
    },
    invest: i => { const m = M(); if (!m || !m.reg[i] || !need(m, 2, 250)) return; m.tes -= 250; m.cap -= 2; m.reg[i].est = clamp(m.reg[i].est + 15); lg(m, 'Plan de inversión en ' + REG[i][1] + '.'); redraw(); },
    repress: i => { const m = M(); if (!m || !m.reg[i]) return; m.reg[i].est = clamp(m.reg[i].est + 10); m.reg[i].crisis = 0; m.apr = clamp(m.apr - 3); lg(m, 'Las fuerzas del orden toman ' + REG[i][1] + '.'); redraw(); },
    neg: p => { const m = M(), k = 'n' + p; if (!m || !m.coal || !(p in m.coal) || (m.cd[k] || 0) > 0 || !need(m, 4, 0)) return; m.cap -= 4; m.cd[k] = 20; m.coal[p] = clamp(m.coal[p] + 18); lg(m, 'Negociación con ' + p + ': refuerza su apoyo.'); redraw(); },
    aud: () => { const m = M(); if (!m || (m.cd.aud || 0) > 0 || !need(m, 5, 0)) return; m.cap -= 5; m.cd.aud = 40; m.palace = clamp(m.palace + 10); lg(m, 'Audiencia con el Rey: sube la confianza del Palacio.'); redraw(); },
    pol: id => {
      const m = M(), x = POL.find(p => p.id === id), k = 'p' + id;
      if (!m || !x || (m.cd[k] || 0) > 0 || !need(m, x.cap, x.cost)) return;
      m.cap -= x.cap; m.tes -= x.cost; m.cd[k] = x.cd; Object.keys(x.P).forEach(s => { m[s] = clamp(m[s] + x.P[s]); });
      if (x.ES || x.rel) MP.cross(x.ES, x.rel, 'Marruecos aprueba: ' + x.t + '.');
      lg(m, 'Decreto: ' + x.t + '.'); redraw();
    },
    bud: (id, v) => { const m = M(); if (!m || !(id in m.bud)) return; m.bud[id] = clamp(Math.round(+v)); redraw(); },
    army: b => { const m = M(); if (!m || !(b in m.army) || (m.cd['a' + b] || 0) > 0 || !need(m, 3, 400)) return; m.cap -= 3; m.tes -= 400; m.cd['a' + b] = 30; m.army[b] = clamp(m.army[b] + 6); lg(m, 'Modernización de las fuerzas: ' + b + '.'); redraw(); },
    evt: i => {
      const m = M(), e = m && m.evt != null ? EVS[m.evt] : null, o = e && e.opts[i]; if (!o) return;
      if (o.tes) m.tes += o.tes;
      Object.keys(o.P || {}).forEach(s => { m[s] = clamp(m[s] + o.P[s]); });
      if (o.ES || o.rel || o.ask) MP.cross(o.ES, o.rel, 'Marruecos: ' + e.title + '.', o.ask);
      lg(m, e.title + ' → ' + o.t.replace(/ \(.*\)$/, '') + '.'); m.evt = null; redraw();
    }
  };

  // Envoltorio de la interfaz: el jugador 2 reenvía la orden al anfitrión; el anfitrión solo
  // puede actuar si es el turno de Marruecos (modo mismo dispositivo).
  const repaint = () => { if (MP.isGuest()) MP.repaint(); else redraw(); };
  const A = {};
  Object.keys(R).forEach(f => {
    A[f] = (...a) => {
      if (MP.isGuest()) return MP.sendMA(f, a);
      if (SETUP_FNS.indexOf(f) >= 0) {   // la formación de Gobierno no depende del turno en el mismo dispositivo
        if (!localMode()) return toast('Marruecos lo gestiona el jugador 2.');
        return R[f](...a);
      }
      if (!MP.canAct()) return toast(M() && gameState.mp.mode === 'online' ? 'Marruecos lo gestiona el jugador 2.' : 'Ahora es el turno de España: pasa el mando.');
      R[f](...a);
    };
  });
  A.tab = t => { UI.tab = t; repaint(); };
  A.reg = i => { UI.sel = i; repaint(); };
  A.seatLive = (id, v) => { const el = document.getElementById('mseat-' + id); if (el) el.textContent = v + ' ESCAÑOS'; };
  A.exec = (f, a) => { if (R.hasOwnProperty(f) && Array.isArray(a)) R[f](...a); };   // órdenes del jugador 2 (en el anfitrión)

  // ---------------- INTERFAZ ----------------
  const bar = (l, v) => { v = Math.round(v); return `<div><div class="flex justify-between text-[10px] text-slate-400"><span>${l}</span><span class="font-mono">${v}</span></div><div class="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800"><div class="h-full ${v >= 60 ? 'bg-emerald-500' : v >= 35 ? 'bg-amber-500' : 'bg-red-500'}" style="width:${v}%"></div></div></div>`; };
  const box = (t, inner) => `<div class="hoi-box p-4 rounded-xl space-y-2 font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">${t}</div>${inner}</div>`;
  const btn = (f, t, off) => `<button ${off ? 'disabled' : `onclick="${f}"`} class="hoi-button px-3 py-1.5 rounded text-[11px] ${off ? 'opacity-50' : ''}">${t}</button>`;

  // Hemiciclo de 395 escaños: los puntos se reparten por ángulo, de izquierda a derecha
  function hemi(seats) {
    const counts = [32, 46, 59, 73, 86, 99], radii = [60, 85, 110, 135, 160, 185], pos = [];
    radii.forEach((r, ri) => { const n = counts[ri]; for (let i = 0; i < n; i++) { const a = Math.PI - Math.PI * i / (n - 1); pos.push({ a, x: 250 + r * Math.cos(a), y: 230 - r * Math.sin(a) }); } });
    pos.sort((p, q) => q.a - p.a);
    const colors = []; MPARTIES.slice().sort((p, q) => p.order - q.order).forEach(p => { for (let i = 0; i < (seats[p.id] || 0); i++) colors.push(p.color); });
    return pos.map((p, i) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.3" fill="${colors[i] || '#3d4f59'}"/>`).join('');
  }

  // Pantalla de formación de Gobierno: 1) escaños · 2) pactómetro
  function renderSetup(m, ctx) {
    const s = m.setup, can = !!ctx.guest || localMode(), total = seatTotal(s), valid = total === TOTAL;
    const dis = can ? '' : 'disabled';
    const step = n => `<span class="px-2 py-0.5 rounded text-[10px] ${s.phase === n[0] ? 'bg-amber-500 text-black font-bold' : 'bg-slate-900 text-slate-400 border border-slate-700'}">${n[1]}</span>`;
    const head = `<div class="border-b border-slate-800 pb-2 flex flex-wrap justify-between items-center gap-2"><div><h2 class="font-hoi-header text-2xl text-amber-400">🇲🇦 FORMACIÓN DEL GOBIERNO DE MARRUECOS</h2><p class="font-hoi-tech text-[11px] text-slate-400 uppercase">Cámara de Representantes · ${TOTAL} escaños · mayoría absoluta ${MAJ}</p></div><div class="flex gap-1.5">${step(['seats', '1 · Escaños'])}${step(['coal', '2 · Pactómetro'])}</div></div>`;
    const spect = can ? '' : `<div class="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded p-2 font-hoi-tech">Marruecos está formando Gobierno (lo gestiona el jugador 2). La partida empezará cuando termine.</div>`;
    if (s.phase !== 'coal') {
      const legend = MPARTIES.map(p => `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-900/90 rounded border border-slate-800 text-[11px]"><span class="w-2 h-2 rounded-full" style="background:${p.color}"></span><span class="text-slate-300">${p.id}:</span><b class="text-slate-100">${s.seats[p.id]}</b></span>`).join('');
      const sliders = MPARTIES.map(p => `<div class="bg-slate-900/80 p-2 rounded border border-slate-800 space-y-1"><div class="flex justify-between items-center text-[11px] font-hoi-tech"><span class="font-bold flex items-center gap-1.5"><span class="w-2 h-2 rounded-full" style="background:${p.color}"></span><span class="text-slate-200">${p.name}</span><span class="text-[9px] text-amber-400/80 font-normal">(${p.ideo})</span></span><span id="mseat-${p.id}" class="font-bold text-amber-400">${s.seats[p.id]} ESCAÑOS</span></div><input type="range" min="0" max="${p.max}" value="${s.seats[p.id]}" ${dis} oninput="MA.seatLive('${p.id}',this.value)" onchange="MA.seat('${p.id}',this.value)" class="w-full accent-amber-500 h-1 cursor-pointer"></div>`).join('');
      return `<div class="space-y-4">${head}${spect}
        <div class="flex justify-end"><div class="bg-slate-900 border border-slate-700 px-3 py-1 rounded font-hoi-tech text-xs"><span class="text-slate-400">TOTAL ESCAÑOS: </span><b class="text-lg ${valid ? 'text-emerald-400' : 'text-red-500'}">${total} / ${TOTAL}</b></div></div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center hoi-box p-4 rounded">
          <div class="lg:col-span-6 flex flex-col items-center"><svg viewBox="0 0 500 250" class="w-full max-w-sm">${hemi(s.seats)}</svg><div class="flex flex-wrap gap-1.5 justify-center mt-3 max-w-md font-hoi-tech">${legend}</div></div>
          <div class="lg:col-span-6 space-y-2 max-h-[340px] overflow-y-auto pr-1">${sliders}</div></div>
        <div class="flex justify-end"><button ${valid && can ? '' : 'disabled'} onclick="MA.sphase('coal')" class="${valid && can ? 'hoi-button-gold' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'} px-5 py-1.5 text-xs font-hoi-tech rounded">AVANZAR AL PACTÓMETRO <i class="fa-solid fa-arrow-right ml-1.5"></i></button></div></div>`;
    }
    const v = votes(s), cs = s.coal.reduce((t, id) => t + (s.seats[id] || 0), 0), blocked = !v.first && !v.second;
    const stTxt = v.first ? '¡MAYORÍA ABSOLUTA ALCANZADA!' : v.second ? `SEGUNDA VOTACIÓN: ${v.yes} SÍ vs ${v.no} NO (${v.abst} abst.)` : `INVESTIDURA FALLIDA: ${v.yes} SÍ vs ${v.no} NO`;
    const stCls = v.first ? 'text-emerald-400' : v.second ? 'text-amber-400' : 'text-red-400';
    const lead = MPARTIES.map(p => `<div ${can ? `onclick="MA.leader('${p.id}')"` : ''} class="p-2 rounded border ${can ? 'cursor-pointer' : ''} flex items-center justify-between ${s.leader === p.id ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-900 border-slate-800'}"><div class="flex items-center gap-2 font-hoi-tech"><span class="w-2 h-2 rounded-full" style="background:${p.color}"></span><div><p class="font-bold text-xs text-slate-100">${p.leader}</p><p class="text-[9px] text-slate-400">${p.name} (${s.seats[p.id]} escaños) — <span class="text-amber-400/80">${p.ideo}</span></p></div></div>${s.leader === p.id ? '<i class="fa-solid fa-circle-check text-amber-400 text-xs"></i>' : ''}</div>`).join('');
    const part = MPARTIES.map(p => {
      const isL = p.id === s.leader, on = s.coal.includes(p.id), rc = redOk(s, p.id), blk = !on && !rc.ok;
      return `<div ${can && !isL && !blk ? `onclick="MA.coalTog('${p.id}')"` : ''} class="p-2 rounded border flex items-center justify-between ${isL ? 'opacity-40 bg-slate-900 border-slate-800' : blk ? 'bg-red-950/20 border-red-900/40 opacity-60' : on ? 'bg-amber-500/10 border-amber-500 cursor-pointer' : 'bg-slate-900 border-slate-800 cursor-pointer'}"><div class="flex items-center gap-2 font-hoi-tech"><input type="checkbox" ${on ? 'checked' : ''} disabled class="accent-amber-500"><div><span class="font-bold text-xs text-slate-200">${p.name}</span>${blk ? `<p class="text-[8px] text-red-400 font-bold">LÍNEA ROJA: ${rc.why}</p>` : ''}</div></div><span class="text-xs font-hoi-tech font-bold ${blk ? 'text-slate-600' : 'text-amber-400'}">+${s.seats[p.id]} escaños</span></div>`;
    }).join('');
    return `<div class="space-y-4">${head}${spect}
      <div class="hoi-box p-3 rounded space-y-1.5"><p class="text-[10px] font-hoi-tech text-slate-400">El Rey nombra al Jefe de Gobierno; puede ser cualquier partido, pero el Palacio ve mejor al más votado. 1ª votación: mayoría absoluta (${MAJ}). 2ª votación: más síes que noes (los partidos hostiles al candidato votan no; el resto se abstiene). Después repartirás los ministerios en el Consejo de Ministros.</p>
        <div class="flex justify-between items-center text-xs font-hoi-tech"><span>SUMA DE LA COALICIÓN: <b class="text-amber-400 text-sm">${cs}</b> / ${TOTAL}</span><span class="${stCls} font-bold">${stTxt}</span></div>
        <div class="relative w-full h-2.5 bg-slate-900 rounded overflow-hidden border border-slate-700"><div class="h-full bg-gradient-to-r from-amber-600 to-amber-400" style="width:${cs / TOTAL * 100}%"></div><div class="absolute top-0 bottom-0 w-0.5 bg-red-500" style="left:${MAJ / TOTAL * 100}%"></div></div></div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="hoi-box p-3 rounded space-y-2"><h3 class="font-hoi-header text-lg text-slate-200 border-b border-slate-800 pb-1">1. CANDIDATO A JEFE DE GOBIERNO</h3><div class="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">${lead}</div></div>
        <div class="hoi-box p-3 rounded space-y-2"><h3 class="font-hoi-header text-lg text-slate-200 border-b border-slate-800 pb-1">2. SOCIOS DE GOBIERNO</h3><div class="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">${part}</div></div></div>
      <div class="flex flex-wrap justify-between items-center gap-2"><button ${can ? '' : 'disabled'} onclick="MA.sphase('seats')" class="hoi-button px-4 py-1.5 text-xs font-hoi-tech text-slate-300 rounded"><i class="fa-solid fa-arrow-left mr-1.5"></i> AJUSTAR ESCAÑOS</button>
        <button ${blocked || !can ? 'disabled' : ''} onclick="MA.govStart()" class="${blocked || !can ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' : v.first ? 'hoi-button-gold' : 'bg-amber-600 text-white border border-amber-400 font-bold'} px-5 py-1.5 text-xs font-hoi-tech rounded">${v.first ? 'SOMETER A INVESTIDURA (MAYORÍA ABSOLUTA)' : v.second ? 'GOBERNAR EN MINORÍA (SEGUNDA VOTACIÓN)' : 'SIN MAYORÍA DE INVESTIDURA'}</button></div></div>`;
  }

  function cabinetHtml(m) {
    const can = MP.canAct();
    const cards = MINISTRIES.map(x => {
      const cur = m.min[x.id] || '', av = availMin(m, x.id), sel = minOf(cur);
      return `<div class="bg-slate-900/90 p-3 rounded border border-slate-800 space-y-2"><div class="text-xs text-amber-400 font-bold flex items-center gap-2"><i class="fa-solid ${x.icon}"></i> ${x.title}${x.sov ? ' <span class="text-[9px] text-sky-300 font-normal">· soberanía</span>' : ''}</div>
        <select ${can ? '' : 'disabled'} onchange="MA.minister('${x.id}',this.value)" class="w-full bg-slate-950 border border-slate-700 p-2 rounded text-xs text-slate-200"><option value="">-- Sin ministro asignado --</option>${av.map(a => `<option value="${a.id}" ${cur === a.id ? 'selected' : ''}>${a.name} (${pname(a.party)})</option>`).join('')}</select>
        ${sel ? `<div class="bg-slate-950 p-2.5 rounded border border-slate-800/80 space-y-1"><div class="flex justify-between border-b border-slate-800/60 pb-1"><span class="text-xs text-amber-400 font-bold">${sel.name}</span><span class="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-bold">${pname(sel.party)}</span></div><div class="text-[11px] font-sans"><div class="text-emerald-400">✔ ${sel.pros}</div><div class="text-rose-400">✖ ${sel.cons}</div></div></div>` : `<div class="text-[10px] text-slate-500 italic text-center font-sans">Asigna un ministro para ver pros y contras.</div>`}${x.sov ? '<div class="text-[10px] text-slate-500 font-sans">El Palacio prefiere un técnico de su confianza.</div>' : ''}</div>`;
    }).join('');
    return box('CONSEJO DE MINISTROS DEL GOBIERNO', `<p class="text-[11px] text-slate-400 font-sans">Cada mes los ministros aplican sus efectos de forma atenuada. Los socios con ministerios ganan lealtad; los que no tienen ninguno, la pierden.</p><div class="grid grid-cols-1 md:grid-cols-2 gap-3">${cards}</div>`);
  }

  function decisionHtml(m) {
    ex(m);
    const wk = `<span class="text-[10px] bg-slate-900 border border-slate-700 px-2 py-1 text-slate-300"><i class="fa-regular fa-calendar mr-1"></i>SEMANA: ${m.wk.n} / 10 DECISIONES</span>`;
    if (m.dec == null) return `<div class="hoi-box p-5 rounded-xl space-y-3 font-hoi-tech"><div class="flex justify-between items-center"><span class="text-[11px] bg-slate-900 border border-amber-500/60 px-2 py-1 text-amber-400">DECISIÓN N.º ${m.decN + 1}</span>${wk}</div><div class="text-xs text-slate-500 py-8 text-center">${m.decCd > 0 ? 'Próxima decisión en ' + m.decCd + ' días.' : 'Sin decisiones pendientes.'}</div></div>`;
    const d = DECS[m.dec], can = MP.canAct();
    const chips = o => Object.keys(o.P || {}).map(k => `<span class="${o.P[k] > 0 ? 'text-emerald-400' : 'text-red-400'}">${STN[k] || k} ${o.P[k] > 0 ? '+' : ''}${o.P[k]}</span>`).join(' · ') + (o.ES ? ' · <span class="text-sky-300">efecto en España</span>' : '');
    return `<div class="hoi-box p-5 rounded-xl space-y-3 font-hoi-tech"><div class="flex justify-between items-center"><span class="text-[11px] bg-slate-900 border border-amber-500/60 px-2 py-1 text-amber-400">DECISIÓN N.º ${m.decN + 1}</span>${wk}</div>
      <h3 class="font-hoi-header text-xl text-slate-100 uppercase leading-tight">${d.title}</h3>
      <div class="text-xs text-slate-300 font-sans bg-slate-950 border border-slate-800 rounded p-3">${d.desc}</div>
      ${d.opts.map((o, i) => `<button ${can ? '' : 'disabled'} onclick="MA.pick(${i})" class="hoi-button w-full p-3 rounded text-xs text-left ${can ? '' : 'opacity-50'}"><div class="flex justify-between gap-2"><span>${o.t}</span>${can ? '' : '<span class="text-[10px] text-red-400">ESPERA TU TURNO</span>'}</div><div class="text-[10px] text-slate-400 mt-1">${chips(o)}${o.tes ? ' · <span class="' + (o.tes > 0 ? 'text-emerald-400' : 'text-red-400') + '">' + (o.tes > 0 ? '+' : '−') + Math.abs(o.tes) + ' M€</span>' : ''}</div></button>`).join('')}</div>`;
  }

  // ---------- Interfaz idéntica a la de España: barra superior, menú lateral, contenido ----------
  const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const mdate = m => { const d = m.date ? new Date(m.date) : new Date(2023, 0, Math.max(1, m.day || 1)); return d.getDate() + ' ' + MESES[d.getMonth()] + ' ' + d.getFullYear(); };
  const tcol = v => v >= 60 ? 'text-emerald-400' : v >= 35 ? 'text-amber-400' : 'text-red-400';
  const bcol = v => v >= 60 ? 'bg-emerald-500' : v >= 35 ? 'bg-amber-500' : 'bg-red-500';
  function hud(m, mil) {
    const hs = (ic, l, v) => `<div class="min-w-[74px]"><div class="flex justify-between items-center gap-2 text-[11px]"><span class="text-slate-300"><i class="fa-solid ${ic} mr-1 text-slate-400"></i>${l}</span><b class="${tcol(v)}">${Math.round(v)}%</b></div><div class="h-0.5 bg-slate-800 mt-1"><div class="h-full ${bcol(v)}" style="width:${clamp(v)}%"></div></div></div>`;
    const kv = (l, v, c) => `<div><div class="text-[9px] tracking-widest text-slate-500">${l}</div><div class="text-base font-bold ${c || 'text-slate-100'}">${v}</div></div>`;
    return `<div class="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 bg-slate-950/95 border-b border-slate-800 font-hoi-tech">
      ${kv('FECHA', mdate(m))}${kv('TESORERÍA', Math.round(m.tes).toLocaleString('es-ES') + ' M€', 'text-amber-300')}${kv('LEGISLATURA', m.leg + '/3')}
      <div class="flex gap-4 flex-wrap">${hs('fa-chart-line', 'Econ.', m.eco)}${hs('fa-shield-halved', 'Esta.', m.est)}${hs('fa-briefcase', 'Empl.', m.emp)}${hs('fa-heart', 'Apro.', m.apr)}${hs('fa-person-military-rifle', 'Ejér.', mil)}</div>
      <div class="flex gap-5 ml-auto">${kv('PRIMA', prima(m) + ' pb', prima(m) > 300 ? 'text-red-400' : 'text-amber-300')}${kv('DEUDA/PIB', m.debt.toFixed(1) + ' %', m.debt > 90 ? 'text-red-400' : 'text-amber-300')}</div></div>`;
  }
  function sidebar(m) {
    const it = (k, ic, l, dot) => `<button onclick="MA.tab('${k}')" class="w-full flex items-center gap-2 px-3 py-2.5 text-[11px] font-bold tracking-wider uppercase rounded border ${UI.tab === k ? 'border-amber-500 text-amber-300 bg-amber-500/10' : 'border-slate-800 text-slate-300 bg-slate-900/80 hover:border-slate-600'}"><i class="fa-solid ${ic} w-4 text-center ${UI.tab === k ? 'text-amber-400' : 'text-sky-400'}"></i>${l}${dot ? ' <span class="text-amber-400">●</span>' : ''}</button>`;
    const gp = t => `<div class="px-1 pt-3 pb-1 text-[10px] font-bold tracking-[.2em] text-slate-400">${t}</div>`;
    return `<div class="space-y-1.5">
      <div class="flex items-center gap-2 mb-2"><div class="w-9 h-9 border-2 border-amber-500 rounded flex items-center justify-center text-lg">🇲🇦</div><div><div class="font-hoi-header text-amber-400 text-base leading-none">MAROC STRATEGY</div><div class="text-[9px] text-slate-500 tracking-widest">STRATEGY SIMULATOR</div></div></div>
      <div class="text-center text-[11px] text-amber-300 border border-slate-800 bg-slate-900/80 rounded py-1.5"><i class="fa-solid fa-landmark mr-1"></i>LEGISLATURA ${m.leg} / 3</div>
      <div class="border border-slate-800 bg-slate-900/80 rounded p-2"><div class="flex justify-between text-[10px] text-sky-300"><span><i class="fa-solid fa-star mr-1"></i>CAPITAL POLÍTICO</span><b>${Math.floor(m.cap)}/100</b></div><div class="h-1 bg-slate-800 mt-1"><div class="h-full bg-sky-500" style="width:${clamp(m.cap)}%"></div></div></div>
      ${gp('GOBIERNO')}${it('main', 'fa-landmark', 'Decisiones', m.dec != null)}${it('dec', 'fa-scroll', 'Dahires (Decretos)')}${it('cab', 'fa-users', 'Ministros')}${it('press', 'fa-bullhorn', 'Prensa', m.evt != null)}
      ${gp('ECONOMÍA')}${it('eco', 'fa-coins', 'Presupuesto')}
      ${gp('POLÍTICA')}${it('gov', 'fa-scale-balanced', 'Parlamento y coalición')}
      ${gp('EXTERIOR')}${it('dip', 'fa-earth-africa', 'Diplomacia')}${it('mil', 'fa-shield', 'Fuerzas armadas')}
      ${gp('ANÁLISIS')}${it('stats', 'fa-chart-pie', 'Estadísticas')}</div>`;
  }
  function situation(m) {
    const loy = Object.keys(m.coal || {}).map(p => m.coal[p]), mn = loy.length ? Math.round(Math.min.apply(null, loy)) : 100;
    return `<details class="hoi-box rounded-xl font-hoi-tech"><summary class="cursor-pointer px-4 py-3 flex items-center justify-between text-xs tracking-widest text-amber-400">SITUACIÓN DEL GOBIERNO<span class="flex gap-2 text-[10px] tracking-normal"><span class="px-2 py-0.5 rounded-full border ${mn < 50 ? 'border-red-500/60 text-red-300' : 'border-emerald-500/60 text-emerald-300'}">Socios: mín. ${mn}%</span><span class="px-2 py-0.5 rounded-full border ${m.minority ? 'border-red-500/60 text-red-300' : 'border-emerald-500/60 text-emerald-300'}">${m.minority ? 'GOBIERNO EN MINORÍA' : 'GOBIERNO CON MAYORÍA'}</span></span></summary>
      <div class="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-3">${bar('Confianza del Palacio', m.palace)}${bar('Aprobación', m.apr)}${Object.keys(m.coal || {}).map(p => bar('Socio ' + p, m.coal[p])).join('')}</div></details>`;
  }

  // m = estado de Marruecos (del anfitrión, o la copia que recibe el jugador 2)
  function renderMoroccoTab(m, ctx) {
    ctx = ctx || {};
    if (!m) m = M();
    if (!m || !m.army) return '<div class="hoi-box p-8 text-center text-slate-400 font-hoi-tech">Marruecos solo está disponible en el modo multijugador.</div>';
    if (pending(m)) return renderSetup(m, ctx);
    const cdl = k => (m.cd || {})[k] || 0;
    ex(m);
    const mil = Math.round((m.army.tierra + m.army.mar + m.army.aire) / 3);

    const map = REG.map((r, i) => { const g = m.reg[i], col = g.est < 35 ? '#ef4444' : g.est < 55 ? '#d9a726' : '#22c55e'; return `<polygon points="${pts(r[2])}" fill="${col}" fill-opacity=".5" stroke="${UI.sel === i ? '#fff' : '#0b0f12'}" stroke-width="${UI.sel === i ? 2.5 : 1}" class="${g.crisis ? 'ma-pulse' : ''}" style="cursor:pointer" onclick="MA.reg(${i})"><title>${r[1]}</title></polygon>`; }).join('');
    const tabs = [['main', 'Mando y mapa' + (m.dec != null ? ' ●' : '')], ['gov', 'Gobierno'], ['cab', 'Consejo de Ministros'], ['eco', 'Economía'], ['mil', 'Militar'], ['dip', 'Diplomacia']].map(([k, l]) => `<button onclick="MA.tab('${k}')" class="${UI.tab === k ? 'hoi-button-gold' : 'hoi-button'} px-3 py-1.5 rounded text-xs">${l}</button>`).join('');

    let body = '';
    if (UI.tab === 'gov') {
      const lead = PBY(m.leader), cs = coalSeats(m);
      const co = Object.keys(m.coal).map(p => `<div class="flex items-center gap-3"><div class="flex-1">${bar(p + ' · ' + (PBY(p) ? PBY(p).name : p) + ' (' + (m.seats[p] || 0) + ')', m.coal[p])}</div>${btn("MA.neg('" + p + "')", cdl('n' + p) ? cdl('n' + p) + 'd' : 'Negociar · 4 cap.', cdl('n' + p) > 0)}</div>`).join('') || '<div class="text-[11px] text-slate-500">Gobierno de un solo partido.</div>';
      const pol = POL.map(x => { const off = cdl('p' + x.id) > 0; return `<button ${off ? 'disabled' : `onclick="MA.pol('${x.id}')"`} class="hoi-button p-2 rounded text-[11px] text-left ${off ? 'opacity-50' : ''}"><div><b>${x.t}</b> <span class="text-slate-400">· ${x.cost} M€ · ${x.cap} cap.</span></div><div class="text-slate-400 font-sans">${x.d}</div><div class="text-[10px] text-slate-500">${off ? 'Disponible en ' + cdl('p' + x.id) + ' días' : Object.keys(x.P).map(k => k + ' ' + (x.P[k] > 0 ? '+' : '') + x.P[k]).join(' · ') + (x.ES ? ' · efecto en España' : '')}</div></button>`; }).join('');
      body = box('CÁMARA DE REPRESENTANTES', `<div class="grid grid-cols-1 md:grid-cols-2 gap-3 items-center"><svg viewBox="0 0 500 250" class="w-full max-w-sm mx-auto">${hemi(m.seats)}</svg><div class="text-[11px] text-slate-300 space-y-1"><div>Jefe de Gobierno: <b class="text-amber-300">${lead ? lead.leader : ''}</b> (${m.leader})</div><div>Coalición: <b>${cs}</b> / ${TOTAL} escaños ${m.minority ? '<span class="text-red-400">· GOBIERNO EN MINORÍA</span>' : '<span class="text-emerald-400">· mayoría</span>'}</div><div class="flex flex-wrap gap-1">${MPARTIES.map(p => `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800"><span class="w-2 h-2 rounded-full" style="background:${p.color}"></span>${p.id} ${m.seats[p.id]}</span>`).join('')}</div></div></div>`)
        + '<div class="h-3"></div>' + box('COALICIÓN DE GOBIERNO (si un socio cae por debajo de 20, abandona el Gobierno)', co + `<div class="flex items-center gap-3"><div class="flex-1">${bar('Palacio Real', m.palace)}</div>${btn('MA.aud()', cdl('aud') ? cdl('aud') + 'd' : 'Audiencia · 5 cap.', cdl('aud') > 0)}</div>`) + '<div class="h-3"></div>' + box('DECRETOS', `<div class="grid grid-cols-1 md:grid-cols-2 gap-2">${pol}</div>`);
    } else if (UI.tab === 'dec') {
      const pol = POL.map(x => { const off = cdl('p' + x.id) > 0; return `<button ${off ? 'disabled' : `onclick="MA.pol('${x.id}')"`} class="hoi-button p-3 rounded text-[11px] text-left ${off ? 'opacity-50' : ''}"><div><b>${x.t}</b> <span class="text-slate-400">· ${x.cost} M€ · ${x.cap} cap.</span></div><div class="text-slate-400 font-sans">${x.d}</div><div class="text-[10px] text-slate-500">${off ? 'Disponible en ' + cdl('p' + x.id) + ' días' : Object.keys(x.P).map(k => (STN[k] || k) + ' ' + (x.P[k] > 0 ? '+' : '') + x.P[k]).join(' · ') + (x.ES ? ' · efecto en España' : '')}</div></button>`; }).join('');
      body = box('DAHIRES Y DECRETOS DEL GOBIERNO (Boletín Oficial)', `<div class="grid grid-cols-1 md:grid-cols-2 gap-2">${pol}</div>`);
    } else if (UI.tab === 'press') {
      const e = m.evt != null ? EVS[m.evt] : null;
      body = (e ? `<div class="hoi-box p-5 rounded-xl border-sky-500/60 space-y-2 font-hoi-tech"><span class="text-[10px] text-sky-300 tracking-widest">ÚLTIMA HORA</span><b class="block text-sky-300 text-lg">${e.title}</b><p class="text-[11px] text-slate-400 font-sans">${e.desc}</p>${e.opts.map((o, k) => `<button onclick="MA.evt(${k})" class="hoi-button w-full p-3 rounded text-xs text-left">${o.t}</button>`).join('')}</div>` : '')
        + box('TELETIPO · REGISTRO DE PRENSA', m.log.map(l => `<div class="text-[11px] text-slate-300 border-b border-slate-800/60 py-1"><i class="fa-solid fa-newspaper text-slate-500 mr-2"></i>${l}</div>`).join('') || '<div class="text-[11px] text-slate-500">Sin noticias.</div>');
    } else if (UI.tab === 'stats') {
      const regs = REG.map((r, i) => [r[1], m.reg[i].est, m.reg[i].crisis]).sort((a, b) => a[1] - b[1]);
      body = `<div class="grid grid-cols-1 md:grid-cols-2 gap-3">${box('INDICADORES NACIONALES', bar('Economía', m.eco) + bar('Estabilidad', m.est) + bar('Empleo', m.emp) + bar('Aprobación', m.apr) + bar('Ejército', mil) + bar('Confianza del Palacio', m.palace) + `<div class="text-[11px] text-slate-300 pt-1">Prima de riesgo <b>${prima(m)} pb</b> · Deuda/PIB <b>${m.debt.toFixed(1)}%</b></div>`)}
        ${box('ESTABILIDAD POR REGIÓN (de peor a mejor)', regs.map(r => bar((r[2] ? '⚠ ' : '') + r[0], r[1])).join(''))}</div>`;
    } else if (UI.tab === 'cab') {
      body = cabinetHtml(m);
    } else if (UI.tab === 'eco') {
      const inc = 10 * (0.6 + m.eco / 100) - 1 - m.army.tierra / 50 * 1.5, out = BUD.reduce((t, b) => t + m.bud[b.id] / 50 * b.cost, 0), bal = inc - out;
      body = box('PRESUPUESTO', `<div class="flex justify-between text-xs"><span>Ingresos ${inc.toFixed(1)} M€/día</span><span>Gastos ${out.toFixed(1)} M€/día</span><b class="${bal >= 0 ? 'text-emerald-400' : 'text-red-400'}">Balance ${bal >= 0 ? '+' : ''}${bal.toFixed(1)}</b></div>` + BUD.map(b => `<div><div class="flex justify-between text-[11px]"><span><i class="fa-solid ${b.ic} mr-1 text-amber-400"></i>${b.t}</span><span class="font-mono">${m.bud[b.id]}% · ${(m.bud[b.id] / 50 * b.cost).toFixed(1)} M€/día</span></div><input type="range" min="0" max="100" value="${m.bud[b.id]}" class="w-full" onchange="MA.bud('${b.id}',this.value)"><div class="text-[10px] text-slate-500 font-sans">${b.d}</div></div>`).join(''));
    } else if (UI.tab === 'mil') {
      const nm = { tierra: ['fa-person-rifle', 'Ejército de Tierra'], mar: ['fa-ship', 'Marina Real'], aire: ['fa-jet-fighter', 'Fuerza Aérea'] };
      body = box('FUERZAS ARMADAS REALES · poder ' + mil, Object.keys(m.army).map(b => `<div class="flex items-center gap-3"><div class="flex-1">${bar('<i class="fa-solid ' + nm[b][0] + ' mr-1"></i>' + nm[b][1], m.army[b])}</div>${btn("MA.army('" + b + "')", cdl('a' + b) ? cdl('a' + b) + 'd' : 'Modernizar · 400 M€ · 3 cap.', cdl('a' + b) > 0)}</div>`).join('') + '<p class="text-[11px] text-slate-500 font-sans">Tu poder militar pesa en las relaciones con España. Sin mantenimiento, las fuerzas pierden nivel poco a poco.</p>');
    } else if (UI.tab === 'dip') {
      body = MP.renderMulti();
    } else {
      const i = UI.sel, sel = i == null ? '' : `<div class="bg-slate-950 border border-slate-800 rounded p-3 space-y-2"><div class="text-sm text-slate-100"><b>${REG[i][1]}</b></div>${bar('Estabilidad regional', m.reg[i].est)}${m.reg[i].crisis ? '<div class="text-[11px] text-red-400">⚠ Disturbios en curso</div>' : ''}<div class="flex gap-2 flex-wrap">${btn('MA.invest(' + i + ')', 'Invertir 250 M€ · 2 cap.')}${m.reg[i].crisis ? btn('MA.repress(' + i + ')', 'Reprimir (−3 aprobación)') : ''}</div></div>`;
      const e = m.evt != null ? EVS[m.evt] : null, alerts = m.reg.filter(r => r.est < 35).length;
      body = `<div class="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <div class="hoi-box p-4 rounded-xl space-y-2 font-hoi-tech"><div class="flex justify-between items-center text-xs flex-wrap gap-1"><span class="text-amber-400"><i class="fa-solid fa-map-location-dot mr-1"></i>Mapa Provincial de Marruecos</span><span class="text-[10px] text-slate-300">${i == null ? 'PULSA UNA REGIÓN' : REG[i][1].toUpperCase() + ': ' + Math.round(m.reg[i].est) + '% ESTABILIDAD'}</span></div>
          <div class="bg-slate-950 rounded border border-slate-800"><svg viewBox="0 0 340 330" class="w-full" style="max-height:400px">${map}</svg></div>
          <div class="flex justify-between text-[10px] bg-slate-900/90 border border-slate-800 rounded px-3 py-2"><span class="text-slate-300">ESTADO TERRITORIAL:</span><b class="${alerts ? 'text-red-400' : 'text-emerald-400'}">${alerts} REGIONES EN ALERTA</b></div>${sel}</div>
        <div class="space-y-3">${e ? `<div class="hoi-box p-4 rounded-xl border-sky-500/60 space-y-2 font-hoi-tech"><span class="text-[10px] text-sky-300 tracking-widest">ÚLTIMA HORA</span><b class="block text-sky-300 text-sm">${e.title}</b><p class="text-[11px] text-slate-400 font-sans">${e.desc}</p>${e.opts.map((o, k) => `<button onclick="MA.evt(${k})" class="hoi-button w-full p-2 rounded text-[11px] text-left">${o.t}</button>`).join('')}</div>` : ''}${decisionHtml(m)}</div></div>`;
    }

    const spectator = !ctx.guest && !MP.canAct()
      ? `<div class="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded p-2 font-hoi-tech">${gameState.mp && gameState.mp.mode === 'online' ? 'Modo espectador: Marruecos lo gobierna el jugador 2.' : 'Ahora manda España. Pasa el mando desde la pestaña Multijugador para gestionar Marruecos.'}</div>` : '';
    const strip = `<div class="flex flex-wrap items-center justify-between gap-2 hoi-box rounded-xl px-3 py-2 font-hoi-tech"><div class="flex gap-2 text-[11px]"><span class="border border-amber-500/60 text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded"><i class="fa-regular fa-calendar mr-1"></i>${mdate(m).toUpperCase()}</span><span class="border border-slate-700 text-slate-300 px-3 py-1.5 rounded">DÍAS EN EL PODER: <b>${m.day}</b></span></div><span class="text-[10px] text-slate-500"><i class="fa-regular fa-clock mr-1"></i>Reloj sincronizado con la partida de España</span></div>
      <div class="flex items-center gap-3 hoi-box rounded-xl px-3 py-2 font-hoi-tech text-[11px]"><span class="bg-red-600 text-white px-2 py-0.5 rounded font-bold"><i class="fa-solid fa-tower-broadcast mr-1"></i>TELETIPO MAP</span><span class="text-slate-300 truncate">${m.log[0] || 'Esperando teletipo de noticias…'}</span></div>`;
    return `${hud(m, mil)}
      <div class="p-3 grid grid-cols-1 md:grid-cols-[215px_1fr] gap-3">
        ${sidebar(m)}
        <div class="space-y-3 min-w-0">${spectator}${strip}${body}${situation(m)}</div></div>`;
  }

  // ---------------- SIMULACIÓN DIARIA (la llama multijugador.js una vez por día de España) ----------------
  function monthly(m) {   // efectos mensuales de los ministros y lealtad de los socios
    const cnt = {};
    Object.keys(m.min || {}).forEach(pf => {
      const mi = minOf(m.min[pf]); if (!mi) return;
      cnt[mi.party] = (cnt[mi.party] || 0) + 1;
      Object.keys(mi.effects || {}).forEach(k => addSt(m, k, mi.effects[k] * 0.15));
    });
    Object.keys(m.coal).forEach(p => { m.coal[p] = clamp(m.coal[p] + (cnt[p] ? Math.min(3, cnt[p]) * 0.8 : -1.5)); });
  }
  function moroccoTick() {
    const m = M();
    if (!m || gameState.step !== 4) return;
    if (pending(m)) return;                        // el Gobierno marroquí aún no se ha formado
    const cfg = diff();
    m.day = gameState.daysInOffice || m.day + 1;   // mismo calendario que España
    ex(m); m.date = gameState.currentDate ? +gameState.currentDate : m.date;
    { const w = Math.floor(m.day / 7); if (m.wk.w !== w) { m.wk.w = w; m.wk.n = 0; } }
    m.cap = Math.min(100, m.cap + 0.3);
    m.tes += 10 * (0.6 + m.eco / 100) - 1 - m.army.tierra / 50 * 1.5;
    if (cfg.expense && m.day % 30 === 0) m.tes -= cfg.expense * 0.25;   // gasto corriente según dificultad
    BUD.forEach(b => { const l = m.bud[b.id]; m.tes -= l / 50 * b.cost; Object.keys(b.fx).forEach(k => { m[k] = clamp(m[k] + (l - 50) * b.fx[k]); }); });
    if (m.tes < 0) { m.eco = clamp(m.eco - 0.08); m.apr = clamp(m.apr - 0.06); }
    m.apr = clamp(m.apr + (m.eco - 50) * 0.002 + (m.est - 50) * 0.002 - 0.01 - (cfg.attr || 0) * 0.5 - m.reg.filter(r => r.crisis).length * 0.04);
    m.est = clamp(m.est + (m.apr - 50) * 0.002 + (m.palace - 50) * 0.0004 - (m.apr < 35 ? 0.05 : 0) - (m.minority ? 0.02 : 0));
    m.eco = clamp(m.eco + (Math.random() - 0.5) * 0.1 + (50 - m.eco) * 0.001);
    m.emp = clamp(m.emp + (m.eco - 50) * 0.002 + (m.est - 50) * 0.0006 + (m.bud.inf - 50) * 0.0004 + (m.bud.agr - 50) * 0.0002 - 0.001);
    m.apr = clamp(m.apr + (m.emp - 50) * 0.001);
    m.debt = Math.max(20, Math.min(200, m.debt + (m.tes < 0 ? 0.03 : -0.002) + (prima(m) - 250) / 50000));
    m.tes -= Math.max(0, prima(m) - 150) / 400;          // coste de la deuda: intereses por prima de riesgo
    m.palace = clamp(m.palace + (m.apr - 50) * 0.002 - 0.005);
    Object.keys(m.army).forEach(k => { m.army[k] = clamp(m.army[k] - 0.01); });
    Object.keys(m.coal).forEach(p => { m.coal[p] = clamp(m.coal[p] + (m.apr - 50) * 0.003 - 0.02); });
    m.reg.forEach((r, i) => { r.est = clamp(r.est + (m.est - r.est) * 0.01 + (Math.random() - 0.5) * 0.6); if (!r.crisis && r.est < 35 && Math.random() < 0.02) { r.crisis = 1; lg(m, 'Disturbios en ' + REG[i][1] + '.'); } if (r.crisis && r.est > 50) r.crisis = 0; });
    Object.keys(m.cd).forEach(k => { if (m.cd[k] > 0) m.cd[k]--; });
    if (m.day % 30 === 0) monthly(m);
    if (m.dec == null) { if (m.decCd > 0) m.decCd--; if (m.decCd <= 0) { nextDec(m); lg(m, 'Nueva decisión de gobierno: ' + DECS[m.dec].title + '.'); } }
    if (m.evt == null && m.day >= m.next) { m.evt = Math.floor(Math.random() * EVS.length); m.next = m.day + Math.round((40 + Math.floor(Math.random() * 40)) / Math.max(1, cfg.mult || 1)); lg(m, 'Suceso: ' + EVS[m.evt].title + '.'); }
    Object.keys(m.coal).filter(p => m.coal[p] < 20).forEach(p => breakCoalition(m, p));
    if (m.palace < 10) { m.palace = 30; m.apr = clamp(m.apr - 6); m.est = clamp(m.est - 5); lg(m, 'CRISIS CON EL PALACIO: el Rey reprende públicamente al Gobierno.'); toast('Marruecos: crisis con el Palacio.'); }
  }

  // ---------------- ENGANCHES CON index.html ----------------
  const css = document.createElement('style');
  css.textContent = '.ma-pulse{animation:mapulse 1.1s infinite}@keyframes mapulse{50%{fill-opacity:.95}}';
  document.head.appendChild(css);

  function syncTab() {   // pestaña «Marruecos» en el menú lateral (solo si hay partida multijugador con Marruecos)
    const on = !!M() && gameState.step === 4;
    let b = document.getElementById('tab-btn-morocco');
    if (on && !b) {
      const mp = document.getElementById('tab-btn-mp'), goals = document.getElementById('tab-btn-goals');
      const ref = mp || goals; if (!ref || !ref.parentNode) return;
      b = document.createElement('button'); b.id = 'tab-btn-morocco'; b.className = 'nav-tab-btn'; b.setAttribute('onclick', "switchTab('morocco')");
      b.innerHTML = '<i class="fa-solid fa-flag text-amber-400 w-4 text-center"></i><span>Marruecos</span>';
      ref.parentNode.insertBefore(b, ref);
      const g = ref.closest && ref.closest('.nav-group'); if (g && g.dataset.ids && g.dataset.ids.indexOf('morocco') < 0) g.dataset.ids += ',morocco';
    }
    if (b) { b.style.display = on ? '' : 'none'; b.classList.toggle('active', on && gameState.activeTab === 'morocco'); }
  }

  const _rtc = renderTabContent;
  renderTabContent = function () { return gameState.activeTab === 'morocco' && M() ? renderMoroccoTab(M(), {}) : _rtc.apply(this, arguments); };

  // La partida no avanza mientras Marruecos forma Gobierno (el reloj se queda en pausa)
  const _gt = gameTick; let lastWarn = 0;
  gameTick = function () {
    const m = M();
    if (m && pending(m) && gameState.step === 4 && gameState.gameSpeed) {
      try { setGameSpeed(0); } catch (e) { /* ya en pausa */ }
      if (Date.now() - lastWarn > 2500) { lastWarn = Date.now(); toast('Marruecos aún está formando Gobierno: la partida empieza cuando termine.'); }
    }
    return _gt.apply(this, arguments);
  };

  const _r = render;
  // Mismo dispositivo: al llegar a la partida, Marruecos forma su Gobierno en su pestaña antes de empezar
  const forceSetup = () => {
    const m = M();
    if (m && pending(m) && gameState.step === 4 && localMode()) { const ch = gameState.activeTab !== 'morocco'; gameState.activeTab = 'morocco'; gameState.mp.turn = 'P'; return ch; }
    return false;
  };
  render = function () {
    forceSetup();
    if (gameState.activeTab === 'morocco' && !M()) gameState.activeTab = 'main';
    let r = _r.apply(this, arguments);
    if (forceSetup()) r = _r.apply(this, arguments);   // la partida local se crea dentro del primer render: se repinta ya en la pestaña de Marruecos
    try { syncTab(); } catch (e) { console.error(e); }
    return r;
  };

  window.MA = A;
  window.initMorocco = initMorocco;
  window.renderMoroccoTab = renderMoroccoTab;
  window.moroccoTick = moroccoTick;
})();
