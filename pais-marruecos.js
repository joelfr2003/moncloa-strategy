// =====================================================================
//  CONTENIDO DE MARRUECOS (equivalente a pais-espana.js, adaptado al modelo marroquí)
//  Se carga ANTES de marruecos.js, que pinta y simula todo esto.
//
//  Estructura (igual que España):
//   · sections  → listas de acciones sueltas (Tesorería, Finanzas, Negociación, Sociedad, UE…)
//   · projects  → Proyectos de Estado en 3 fases (cada fase se aprueba y se paga aparte)
//   · bank      → Bank Al-Maghrib: wali (gobernador), tipo director, dírham, reservas
//   · focus     → árbol de Focos nacionales (4 ramas con espíritus permanentes)
//   · goals     → Mandato y objetivos: misiones con recompensa + acciones de gobierno
//   · shocks    → sucesos aleatorios (se añaden a los de marruecos.js)
//   · achievements → logros
//   · censure   → reglas de la moción de censura marroquí (art. 105 de la Constitución de 2011)
//  Convención de signos: cost > 0 gasta Tesorería; cost < 0 ingresa. money (espíritus) > 0 ingresa al mes.
//  Efectos: eco, est, apr, emp, mil, palace, debt (puntos). ES = efecto en España; rel = relación bilateral.
// =====================================================================
(function () {
  const I = (id, t, d, cost, cap, cd, P, x) => Object.assign({ id, t, d, cost, cap, cd, P }, x || {});

  window.MA_DATA = {
    // ------------------------------------------------------------------
    //  Referencia macroeconómica (el motor la ajusta con los indicadores de la partida)
    // ------------------------------------------------------------------
    macro: {
      pibMeur: 140000,          // PIB aproximado en M€ (≈ 1,5 billones de dírhams)
      growth: 3.2, inflation: 1.5, unemployment: 13, deficit: 4.0,
      rate: 2.25,               // tipo director de Bank Al-Maghrib (%)
      resMonths: 5.3,           // reservas de divisas, en meses de importaciones
      basket: '60 % euro / 40 % dólar', band: 5   // dírham: cesta de divisas y banda de fluctuación (±5 %)
    },

    // ------------------------------------------------------------------
    //  Reglas de la moción de censura (art. 105 de la Constitución de 2011)
    // ------------------------------------------------------------------
    censure: {
      name: 'Moción de censura (Chambre des représentants)',
      sign: 79,                 // admisible si la firma al menos 1/5 de los 395 diputados
      majority: 198,            // aprobada solo por mayoría absoluta de los miembros de la Cámara
      lockDays: 365,            // si prospera, no cabe otra moción durante un año
      effect: 'La censura aprobada implica la dimisión colectiva del Gobierno.',
      note: 'Además, la Cámara de Consejeros (120) puede interpelar al Gobierno con una moción firmada por 1/5 de sus miembros (art. 106).'
    },

    sections: {
      // ---------------- TESORERÍA ----------------
      tes: { title: 'Tesorería', ic: 'fa-vault', intro: 'Gestiona la caja del Estado: ingresos extraordinarios y gasto de emergencia.', items: [
        I('tes1', 'Privatizar participaciones públicas', 'Vende parte de empresas del Estado (+900 M€).', -900, 3, 120, { apr: -3, eco: 1, palace: -1 }),
        I('tes2', 'Amnistía fiscal parcial', 'Aflora capitales no declarados (+500 M€).', -500, 2, 90, { apr: -2, est: -1 }),
        I('tes3', 'Fondo Mohammed VI de inversión', 'Inyecta capital en sectores estratégicos (−600 M€).', 600, 3, 90, { eco: 3, emp: 2 }),
        I('tes4', 'Reserva de emergencia contra la sequía', 'Fondos para campo y agua (−400 M€).', 400, 2, 60, { est: 3, apr: 2 }),
        I('tes5', 'Cobrar el IVA de forma más estricta', 'Refuerza la recaudación (+350 M€).', -350, 2, 60, { apr: -2, eco: -1 }),
        I('tes6', 'Subvención al butano y al trigo (Caja de Compensación)', 'Contiene precios (−450 M€).', 450, 2, 45, { apr: 4, est: 2 }),
        I('tes7', 'Dividendos de OCP (fosfatos)', 'El Estado exige a OCP un dividendo extraordinario (+400 M€).', -400, 2, 120, { eco: 1, apr: -1 }),
        I('tes8', 'Remesas de los MRE: plan de atracción', 'Incentivos a los marroquíes del exterior (+250 M€).', -250, 3, 90, { eco: 1, palace: 1 })] },

      // ---------------- FINANZAS Y DEUDA (el panel macro + emitir/amortizar lo pinta el motor) ----------------
      fin: { title: 'Finanzas y deuda', ic: 'fa-scale-unbalanced', intro: 'Macroeconomía de Marruecos, deuda pública y prima de riesgo. Emite o amortiza deuda y ajusta las cuentas.', items: [
        I('fin1', 'Plan de consolidación fiscal', 'Recorta gasto y reduce la deuda.', 0, 4, 90, { debt: -4, apr: -4, eco: -1 }),
        I('fin3', 'Préstamo del FMI (línea de precaución y liquidez)', 'Liquidez con condiciones (+1.500 M€).', -1500, 4, 150, { debt: 2, apr: -3, palace: -1 }),
        I('fin4', 'Reestructurar deuda con acreedores (Club de París, BEI, Banco Mundial)', 'Alarga plazos y baja intereses.', 0, 5, 150, { debt: -2, eco: 1 }),
        I('fin5', 'Fondo soberano para la deuda', 'Destina ahorro a amortizar (−500 M€).', 500, 3, 90, { debt: -3 }),
        I('fin6', 'Reforma fiscal (Ley marco 69-19)', 'Ensancha la base tributaria y recauda más (+300 M€).', -300, 4, 150, { apr: -2, eco: 1, debt: -1 })] },

      // ---------------- BANK AL-MAGHRIB (el panel del banco central lo pinta el motor) ----------------
      bank: { title: 'Bank Al-Maghrib', ic: 'fa-building-columns', intro: 'El banco central marroquí controla el tipo director y la banda del dírham. Está nominalmente independiente, pero el Palacio y la Hacienda le marcan la agenda.', items: [] },

      // ---------------- PROYECTOS DE ESTADO (3 fases; el motor pinta las tarjetas desde MA_DATA.projects) ----------------
      proj: { title: 'Proyectos de Estado', ic: 'fa-helmet-safety', intro: 'Grandes obras en 3 fases: cada una se aprueba y se paga por separado.', items: [] },

      // ---------------- NEGOCIACIÓN Y OPOSICIÓN (el panel de oposición y censura lo pinta el motor) ----------------
      neg: { title: 'Negociación y oposición', ic: 'fa-handshake', intro: 'Compra apoyos o desactiva a la oposición. La oposición puede presentar una moción de censura si pasa de 79 firmas y logra 198 votos.', items: [
        I('neg1', 'Pacto social con los sindicatos (UMT, UGTM, CDT, UNMT)', 'Calma el frente laboral (−250 M€).', 250, 4, 90, { est: 3, apr: 2 }, { loy: { USFP: 8, PPS: 8 } }),
        I('neg2', 'Concesiones al PJD en materia religiosa', 'Gana a los islamistas.', 0, 3, 90, { palace: 1, apr: -1 }, { loy: { PJD: 12 } }),
        I('neg3', 'Fondo regional para el MP', 'Obras en el medio rural (−200 M€).', 200, 3, 75, { apr: 1 }, { loy: { MP: 12 } }),
        I('neg4', 'Reforma de la ley de partidos', 'Más transparencia y control.', 0, 4, 120, { est: 2, palace: -1 }, { loy: { PAM: -5, PI: 5 } }),
        I('neg5', 'Cumbre con la oposición', 'Rebaja la tensión parlamentaria.', 0, 2, 60, { est: 2, apr: 1 }),
        I('neg6', 'Ronda de contactos con el Istiqlal', 'Compromisos a cambio de lealtad (−150 M€).', 150, 3, 75, { est: 1 }, { loy: { PI: 10 } }),
        I('neg7', 'Pacto con el grupo UC–MDS', 'Cargos y fondos para los liberales y centristas (−120 M€).', 120, 3, 75, { est: 1 }, { loy: { UC: 10, MDS: 10 } })] },

      // ---------------- MANDATO Y OBJETIVOS (misiones + planes; las misiones las pinta el motor) ----------------
      obj: { title: 'Mandato y objetivos', ic: 'fa-flag-checkered', intro: 'Hoja de ruta del Gobierno: misiones con recompensa y planes que se activan una vez.', items: [
        I('obj1', 'Nuevo Modelo de Desarrollo', 'Plan estratégico a 10 años.', 300, 6, 240, { eco: 4, apr: 2, emp: 2 }),
        I('obj2', 'Plan Marruecos Digital', 'Administración y empresas conectadas (−250 M€).', 250, 4, 180, { eco: 3, emp: 2 }),
        I('obj3', 'Plan de empleo juvenil', 'Respuesta a la protesta juvenil (−350 M€).', 350, 5, 150, { emp: 5, apr: 3, est: 2 }),
        I('obj4', 'Estrategia nacional del agua', 'Gestión integral hídrica (−400 M€).', 400, 5, 180, { est: 3, eco: 2 }),
        I('obj5', 'Marruecos, hub energético verde', 'Hidrógeno y renovables (−500 M€).', 500, 6, 240, { eco: 5, palace: 2 })] },

      // ---------------- SOCIEDAD Y OPINIÓN ----------------
      soc: { title: 'Sociedad y opinión', ic: 'fa-people-group', intro: 'Mide el pulso social y actúa sobre la opinión.', items: [
        I('soc1', 'Campaña de comunicación del Gobierno', 'Mejora la imagen (−80 M€).', 80, 2, 45, { apr: 3 }),
        I('soc2', 'Diálogo con la juventud (GenZ 212)', 'Escucha a los jóvenes.', 0, 3, 90, { apr: 4, est: 2 }),
        I('soc3', 'Reforma de la Moudawana', 'Derechos de familia.', 0, 5, 150, { apr: 3, est: -2, palace: -1 }, { loy: { USFP: 10, PPS: 12, PJD: -15 } }),
        I('soc4', 'Plan de vivienda social', 'Acceso a la vivienda (−450 M€).', 450, 4, 120, { apr: 5, emp: 2 }),
        I('soc5', 'Programa de protección social universal (AMO)', 'Cobertura sanitaria y ayudas (−600 M€).', 600, 5, 150, { apr: 6, est: 3 }),
        I('soc6', 'Ayuda directa a las familias rurales', 'Transferencias en el medio rural (−300 M€).', 300, 3, 90, { apr: 4, est: 2 })] },

      // ---------------- FOCOS NACIONALES (el árbol lo pinta el motor desde MA_DATA.focus) ----------------
      foc: { title: 'Focos nacionales', ic: 'fa-bullseye', intro: 'Prioridades de largo plazo: cada foco tarda meses y deja un espíritu permanente.', items: [] },

      // ---------------- UNIÓN EUROPEA ----------------
      ue: { title: 'Unión Europea', ic: 'fa-star', intro: 'Relación con Bruselas: comercio, pesca, migración y energía.', items: [
        I('ue1', 'Renovar el acuerdo pesquero UE–Marruecos', 'Ingresos y relación (+300 M€).', -300, 3, 120, { eco: 2, palace: 1 }, { ES: { eco: 1 }, rel: 3 }),
        I('ue2', 'Asociación avanzada con la UE', 'Más acceso al mercado europeo.', 0, 5, 180, { eco: 4, apr: 1 }, { ES: { eco: 1 }, rel: 4 }),
        I('ue3', 'Pacto migratorio con Bruselas', 'Contención a cambio de fondos (+500 M€).', -500, 4, 120, { est: 1, apr: -2 }, { ES: { est: 2 }, rel: 4 }),
        I('ue4', 'Corredor de energía verde con Europa', 'Exportar renovables (−400 M€).', 400, 5, 150, { eco: 4 }, { ES: { eco: 2 }, rel: 3 }),
        I('ue5', 'Negociar visados Schengen', 'Movilidad para estudiantes y empresarios.', 0, 3, 120, { apr: 3 }, { rel: 2 }),
        I('ue6', 'Conectar los cables eléctricos con España', 'Interconexión eléctrica Marruecos–España (−300 M€).', 300, 4, 120, { eco: 2 }, { ES: { eco: 1 }, rel: 3 })] }
    },

    // ------------------------------------------------------------------
    //  BANK AL-MAGHRIB
    // ------------------------------------------------------------------
    bank: {
      govs: [
        { id: 'jouahri', name: 'Abdellatif Jouahri', tag: 'Wali histórico', cred: 15, desc: 'Al frente del banco desde 2003: los mercados y el Palacio le respetan; informes sobrios y poco complacientes.' },
        { id: 'tecnica', name: 'Salma Berrada', tag: 'Tecnócrata ortodoxa', cred: 10, desc: 'Prioriza la inflación y el equilibrio exterior. Los mercados la adoran, la calle menos.' },
        { id: 'afin', name: 'Youssef Tazi', tag: 'Afín al Gobierno', cred: -10, desc: 'Informes amables y crédito fácil; los inversores desconfían.' }
      ],
      // fx: cred (credibilidad), shock (prima de riesgo en pb), st (indicadores), tes (M€ ingreso+/gasto−), rate (pp), band (pp), res (meses de reservas)
      actions: [
        { id: 'rate_down', icon: 'fa-arrow-trend-down', label: 'Bajar el tipo director (−25 pb)', desc: 'Abarata el crédito: más actividad y empleo, algo más de inflación.', cost: 0, cd: 45, when: 'rate>1', fx: { rate: -0.25, st: { eco: 2, emp: 1 }, cred: -1 } },
        { id: 'rate_up', icon: 'fa-arrow-trend-up', label: 'Subir el tipo director (+25 pb)', desc: 'Frena la inflación y refuerza la moneda, a costa de la actividad.', cost: 0, cd: 45, when: 'rate<6', fx: { rate: 0.25, st: { eco: -1, apr: -1, est: 1 }, cred: 2, shock: -10 } },
        { id: 'band', icon: 'fa-arrows-left-right', label: 'Flexibilizar la banda del dírham', desc: 'Amplía la banda de fluctuación: más competitividad exterior, algo de volatilidad.', cost: 0, cd: 90, when: 'band<8', fx: { band: 1, st: { eco: 2, apr: -2 }, cred: 1 } },
        { id: 'interv', icon: 'fa-vault', label: 'Intervenir con las reservas de divisas', desc: 'Defiende el dírham quemando 0,4 meses de reservas (−300 M€).', cost: 300, cd: 60, when: 'res>2', fx: { res: -0.4, shock: -50, cred: 4, st: { est: 2 } } },
        { id: 'pymes', icon: 'fa-store', label: 'Programa de finanzas para pymes', desc: 'Crédito garantizado a las pymes (−350 M€).', cost: 350, cd: 75, when: '', fx: { st: { eco: 2, emp: 3 }, cred: 1 } },
        { id: 'informe', icon: 'fa-file-lines', label: 'Encargar un informe de solvencia', desc: 'Auditoría externa que calma a los mercados (−150 M€).', cost: 150, cd: 60, when: '', fx: { cred: 4, shock: -15 } },
        { id: 'dividendo', icon: 'fa-hand-holding-dollar', label: 'Adelantar el beneficio de Bank Al-Maghrib', desc: 'Liquidez inmediata (+500 M€), pero huele a presión política.', cost: -500, cd: 180, when: '', fx: { cred: -10, shock: 20 } },
        { id: 'monetiza', icon: 'fa-print', label: 'Que el banco central financie el déficit', desc: 'Financiación monetaria de +900 M€. Inflación y desconfianza garantizadas.', cost: -900, cd: 150, when: 'cred>25', fx: { cred: -15, shock: 60, st: { apr: -4, eco: -2 } } }
      ]
    },

    // ------------------------------------------------------------------
    //  PROYECTOS DE ESTADO (3 fases cada uno)
    // ------------------------------------------------------------------
    projects: [
      { id: 'tgv', icon: 'fa-train', title: 'Alta velocidad Kenitra–Marrakech', spirit: { name: 'Red Ferroviaria Al Boraq', daily: { eco: .04, emp: .02 }, money: 60 },
        phases: [{ n: 'Estudios, trazado y licitación', cost: 300, days: 30, now: {}, run: {} }, { n: 'Obra civil y vías', cost: 2300, days: 120, now: { emp: 2, eco: 1 }, run: { emp: .02, eco: .01 } }, { n: 'Material móvil y puesta en servicio', cost: 900, days: 45, now: { eco: 2, emp: 1 }, run: {} }] },
      { id: 'nador', icon: 'fa-ship', title: 'Puerto Nador West Med', spirit: { name: 'Hub Mediterráneo', daily: { eco: .05, emp: .02 }, money: 90 },
        phases: [{ n: 'Licitación y dragado', cost: 250, days: 30, now: {}, run: {} }, { n: 'Diques, muelles y terminales', cost: 850, days: 110, now: { emp: 1, eco: 1 }, run: { emp: .015, eco: .01 } }, { n: 'Zona logística y apertura', cost: 300, days: 40, now: { eco: 3 }, run: {} }] },
      { id: 'agua', icon: 'fa-droplet', title: 'Desaladoras y Plan Nacional del Agua', spirit: { name: 'Seguridad Hídrica', daily: { est: .03, eco: .02, apr: .01 }, money: -40 },
        phases: [{ n: 'Estudios y evaluación ambiental', cost: 200, days: 30, now: {}, run: {} }, { n: 'Plantas y conducciones (Casablanca, Dakhla)', cost: 1100, days: 100, now: { emp: 1 }, run: { emp: .012 } }, { n: 'Interconexión de presas y puesta en marcha', cost: 350, days: 45, now: { est: 3, apr: 2 }, run: {} }] },
      { id: 'solar', icon: 'fa-solar-panel', title: 'Complejo solar Noor y red eléctrica', spirit: { name: 'Independencia Energética', daily: { eco: .05, palace: .01 }, money: 120 },
        phases: [{ n: 'Concursos y permisos', cost: 250, days: 40, now: {}, run: {} }, { n: 'Parques solares, eólicos y líneas', cost: 1500, days: 130, now: { eco: 1, emp: 1 }, run: { emp: .015, eco: .01 } }, { n: 'Almacenamiento y exportación', cost: 500, days: 50, now: { eco: 3 }, run: {} }] },
      { id: 'viv', icon: 'fa-house', title: 'Vivienda social y ciudades nuevas', spirit: { name: 'Parque Público', daily: { apr: .04, est: .02 }, money: -60 },
        phases: [{ n: 'Cesión de suelo y proyecto', cost: 150, days: 30, now: {}, run: {} }, { n: 'Construcción de viviendas', cost: 900, days: 100, now: { emp: 1 }, run: { emp: .015 } }, { n: 'Adjudicación y entrega', cost: 250, days: 35, now: { apr: 5 }, run: {} }] },
      { id: 'digi', icon: 'fa-microchip', title: 'Maroc Digital 2030', spirit: { name: 'Estado Digital', daily: { eco: .03, emp: .03 }, money: 40 },
        phases: [{ n: 'Diseño y contratación', cost: 120, days: 25, now: {}, run: {} }, { n: 'Redes, centros de datos y sistemas', cost: 800, days: 80, now: { eco: 1 }, run: { eco: .01 } }, { n: 'Migración y formación', cost: 300, days: 40, now: { eco: 2, emp: 2 }, run: {} }] },
      { id: 'mundial', icon: 'fa-futbol', title: 'Estadio Hassan II y Mundial 2030', spirit: { name: 'Legado Mundialista', daily: { apr: .04, eco: .03 }, money: 50 }, done: { ES: { eco: 1 }, rel: 3 },
        phases: [{ n: 'Diseño y licitación', cost: 120, days: 30, now: {}, run: {} }, { n: 'Obra del estadio y accesos', cost: 750, days: 120, now: { emp: 1, apr: 1 }, run: { emp: .015 } }, { n: 'Pruebas e inauguración', cost: 200, days: 35, now: { apr: 5 }, run: {} }] },
      { id: 'dakhla', icon: 'fa-anchor', title: 'Puerto Atlántico de Dakhla', spirit: { name: 'Eje Atlántico', daily: { eco: .04, palace: .02 }, money: 70 },
        phases: [{ n: 'Estudios y financiación', cost: 200, days: 30, now: {}, run: {} }, { n: 'Obras portuarias y zona franca', cost: 950, days: 110, now: { emp: 1, palace: 1 }, run: { emp: .015, eco: .01 } }, { n: 'Conexión viaria y apertura', cost: 300, days: 40, now: { eco: 2, palace: 2 }, run: {} }] }
    ],

    // ------------------------------------------------------------------
    //  FOCOS NACIONALES (4 ramas × 4 focos, encadenados)
    // ------------------------------------------------------------------
    focusBranches: { eco: ['Economía', 'fa-chart-line'], soc: ['Sociedad', 'fa-people-group'], seg: ['Seguridad', 'fa-shield-halved'], dip: ['Diplomacia', 'fa-earth-africa'] },
    focus: [
      { id: 'e1', b: 'eco', title: 'Reforma fiscal (Ley marco 69-19)', days: 365, now: { eco: 4 }, spirit: { name: 'Hacienda Eficiente', daily: {}, money: 120 } },
      { id: 'e2', b: 'eco', title: 'Plan de Aceleración Industrial', days: 420, req: 'e1', now: { emp: 3 }, spirit: { name: 'Polos Industriales', daily: { eco: .05, emp: .04 }, money: 0 } },
      { id: 'e3', b: 'eco', title: 'Fondos europeos y del Golfo', days: 480, req: 'e2', now: { apr: 2 }, cash: 1500, spirit: null },
      { id: 'e4', b: 'eco', title: 'Marca «Maroc»', days: 540, req: 'e3', now: {}, spirit: { name: 'Marca Marruecos', daily: { eco: .06, apr: .03 }, money: 150 } },
      { id: 's1', b: 'soc', title: 'Protección social generalizada', days: 365, now: { apr: 3 }, spirit: { name: 'Cobertura Universal', daily: { est: .03 }, money: -80 } },
      { id: 's2', b: 'soc', title: 'Pacto educativo', days: 420, req: 's1', now: {}, spirit: { name: 'Capital Humano', daily: { emp: .04, eco: .02 }, money: -60 } },
      { id: 's3', b: 'soc', title: 'Vivienda y ciudades nuevas', days: 480, req: 's2', now: { apr: 4 }, spirit: { name: 'Acceso a la Vivienda', daily: { apr: .05 }, money: -70 } },
      { id: 's4', b: 'soc', title: 'Estado Social', days: 540, req: 's3', now: { est: 4 }, spirit: { name: 'Bienestar Social', daily: { est: .05, apr: .04 }, money: -110 } },
      { id: 'g1', b: 'seg', title: 'Modernización policial (DGSN)', days: 365, now: { est: 4 }, spirit: { name: 'Policía Moderna', daily: { est: .03 }, money: -50 } },
      { id: 'g2', b: 'seg', title: 'Ciberseguridad nacional', days: 420, req: 'g1', now: {}, spirit: { name: 'Escudo Digital', daily: { est: .03, eco: .02 }, money: -50 } },
      { id: 'g3', b: 'seg', title: 'FAR profesionales', days: 480, req: 'g2', now: { mil: 6 }, spirit: { name: 'Tropa Profesional', daily: { mil: .05 }, money: -90 } },
      { id: 'g4', b: 'seg', title: 'Pacto de defensa con EE. UU. (African Lion)', days: 540, req: 'g3', now: { mil: 4 }, spirit: { name: 'Socio Estratégico de EE. UU.', daily: { mil: .04, est: .03 }, money: -100 } },
      { id: 'd1', b: 'dip', title: 'Diplomacia africana', days: 365, now: { apr: 2 }, spirit: { name: 'Voz en África', daily: { apr: .03 }, money: 0 } },
      { id: 'd2', b: 'dip', title: 'Eje con Bruselas y Madrid', days: 420, req: 'd1', now: {}, cash: 1000, spirit: { name: 'Socio Fiable', daily: { eco: .04 }, money: 0 }, ES: { eco: 1 }, rel: 4 },
      { id: 'd3', b: 'dip', title: 'Asociación con EE. UU. y el Golfo', days: 480, req: 'd2', now: { est: 3, mil: 3 }, spirit: null },
      { id: 'd4', b: 'dip', title: 'Iniciativa Atlántica y liderazgo africano', days: 540, req: 'd3', now: {}, spirit: { name: 'Potencia Regional', daily: { apr: .05, eco: .04 }, money: 100 } }
    ],
    // Interacciones entre indicadores (se aplican cada día)
    focusLinks: [
      { t: 'Economía hundida destruye empleo', on: m => m.eco < 40, fx: { emp: -.08 } },
      { t: 'Economía fuerte crea empleo', on: m => m.eco > 65, fx: { emp: .04 } },
      { t: 'Paro alto erosiona la aprobación', on: m => m.emp < 40, fx: { apr: -.08, est: -.04 } },
      { t: 'Pleno empleo mejora la aprobación', on: m => m.emp > 65, fx: { apr: .04 } },
      { t: 'Inestabilidad frena la economía', on: m => m.est < 40, fx: { eco: -.06 } },
      { t: 'Impopularidad alimenta el malestar', on: m => m.apr < 35, fx: { est: -.05 } },
      { t: 'Ejército descontento desestabiliza', on: m => m.mil < 30, fx: { est: -.04 } },
      { t: 'Estabilidad alta atrae inversión', on: m => m.est > 70, fx: { eco: .03 } }
    ],

    // ------------------------------------------------------------------
    //  MANDATO Y OBJETIVOS: misiones (se activan 3 a la vez) y acciones de gobierno
    // ------------------------------------------------------------------
    goalPool: [
      { id: 'eco', icon: 'fa-chart-line', title: 'Milagro Económico', desc: 'Mantén la Economía ≥ 70%', check: m => m.eco >= 70 },
      { id: 'est', icon: 'fa-shield-halved', title: 'Paz Social', desc: 'Mantén la Estabilidad ≥ 65%', check: m => m.est >= 65 },
      { id: 'apr', icon: 'fa-heart', title: 'Jefe de Gobierno Querido', desc: 'Mantén la Aprobación ≥ 65%', check: m => m.apr >= 65 },
      { id: 'emp', icon: 'fa-briefcase', title: 'Pleno Empleo', desc: 'Mantén el Empleo ≥ 70%', check: m => m.emp >= 70 },
      { id: 'mil', icon: 'fa-person-military-pointing', title: 'Cuarteles en Calma', desc: 'Mantén la fuerza de las FAR ≥ 60%', check: m => m.mil >= 60 },
      { id: 'caja', icon: 'fa-vault', title: 'Superávit', desc: 'Acumula una tesorería ≥ 15.000 M€', check: m => m.tes >= 15000 },
      { id: 'palacio', icon: 'fa-crown', title: 'Confianza del Palacio', desc: 'Confianza del Palacio ≥ 75%', check: m => m.palace >= 75 },
      { id: 'doble', icon: 'fa-scale-balanced', title: 'Doble Confianza', desc: 'Aprobación ≥ 60% y Estabilidad ≥ 60%', check: m => m.apr >= 60 && m.est >= 60 },
      { id: 'deuda', icon: 'fa-file-invoice-dollar', title: 'Deuda Bajo Control', desc: 'Deuda pública ≤ 60% del PIB', check: m => m.debt <= 60 },
      { id: 'todo', icon: 'fa-star', title: 'Marruecos Equilibrado', desc: 'Todas las métricas ≥ 55%', check: m => m.eco >= 55 && m.est >= 55 && m.apr >= 55 && m.emp >= 55 && m.mil >= 55 }
    ],
    goalReward: { cap: 10, tes: 300 },
    goalActions: [
      { id: 'tv', icon: 'fa-tv', title: 'Comparecencia televisada', cap: 15, cost: 0, cd: 30, fx: { apr: 6, est: 2 }, news: 'El Jefe de Gobierno comparece en prime time y remonta en las encuestas.' },
      { id: 'ue', icon: 'fa-earth-europe', title: 'Cumbre en Bruselas', cap: 20, cost: 0, cd: 45, fx: { eco: 6, apr: 2 }, ES: { eco: 1 }, rel: 3, news: 'Bruselas desbloquea fondos y elogia las reformas del Gobierno.' },
      { id: 'pacto', icon: 'fa-handshake', title: 'Pacto social y político', cap: 25, cost: 0, cd: 60, fx: { est: 6, apr: 3 }, news: 'Gobierno, sindicatos y oposición firman un pacto histórico.' },
      { id: 'empleo', icon: 'fa-hammer', title: 'Plan de choque del empleo', cap: 10, cost: 300, cd: 40, fx: { emp: 8, eco: 3 }, news: 'El Gobierno lanza un plan de choque con 300 M€ contra el paro.' },
      { id: 'army', icon: 'fa-medal', title: 'Reforma de las FAR', cap: 15, cost: 250, cd: 50, fx: { mil: 8, apr: -3 }, news: 'Se moderniza las Fuerzas Armadas Reales; el Ejército responde con lealtad.' },
      { id: 'ahorro', icon: 'fa-piggy-bank', title: 'Recorte del gasto público', cap: 0, cost: -600, cd: 60, fx: { apr: -5, est: -2 }, news: 'Austeridad: el Gobierno recorta gasto y ahorra 600 M€, a costa de la calle.' },
      { id: 'trono', icon: 'fa-crown', title: 'Audiencia con el Rey y Discurso del Trono', cap: 12, cost: 0, cd: 90, fx: { palace: 8, apr: 2 }, news: 'El Rey recibe al Jefe de Gobierno y respalda su hoja de ruta.' }
    ],

    // ------------------------------------------------------------------
    //  SUCESOS ALEATORIOS (mismo formato que los de marruecos.js; tes < 0 = gasto)
    // ------------------------------------------------------------------
    shocks: [
      { title: 'Incendios forestales en el Rif', desc: 'Varias provincias del norte arden a la vez y piden ayuda urgente al Estado.', opts: [
        { t: 'Desplegar medios extraordinarios (−250 M€)', tes: -250, P: { est: 3, apr: 2 } }, { t: 'Dejar que actúen las provincias', P: { est: -4, apr: -5 } }] },
      { title: 'Huelga general', desc: 'Los sindicatos convocan un paro nacional contra la política laboral.', opts: [
        { t: 'Abrir mesa de negociación (−100 M€)', tes: -100, P: { emp: 3, apr: 2, eco: -2 } }, { t: 'Mantener la postura', P: { est: -5, apr: -6, eco: -3 } }] },
      { title: 'Escándalo de corrupción', desc: 'Un informe de la Cour des comptes señala a un alto cargo de tu entorno.', opts: [
        { t: 'Cesar al implicado', P: { apr: -4 } }, { t: 'Negar y cerrar filas', P: { apr: -9, est: -3, palace: -2 } }] },
      { title: 'Disparo de la prima de riesgo', desc: 'Los inversores desconfían de la deuda marroquí y exigen intereses más altos.', opts: [
        { t: 'Anunciar recortes', P: { eco: 3, apr: -5, emp: -2, debt: -2 } }, { t: 'Aguantar el pulso', P: { eco: -6, emp: -2, debt: 2 } }] },
      { title: 'Ciberataque a ministerios', desc: 'Atacantes desconocidos paralizan sistemas críticos del Estado.', opts: [
        { t: 'Contratar respuesta de emergencia (−80 M€)', tes: -80, P: { est: 2, mil: 1 } }, { t: 'Resolverlo con medios propios', P: { eco: -5, est: -3 } }] },
      { title: 'Crisis energética y del butano', desc: 'La energía se dispara y las familias no llegan a fin de mes.', opts: [
        { t: 'Subsidiar la factura (−450 M€)', tes: -450, P: { eco: 2, apr: 3 } }, { t: 'Dejar actuar al mercado', P: { eco: -6, emp: -3, apr: -3 } }] },
      { title: 'Ruido de sables', desc: 'Mandos militares critican en privado tu gestión y hay malestar en los cuarteles.', opts: [
        { t: 'Ascensos y mejoras salariales (−200 M€)', tes: -200, P: { mil: 6, apr: -1 } }, { t: 'Ignorar el malestar', P: { mil: -8, est: -2 } }] },
      { title: 'Remesas récord de los MRE', desc: 'Los marroquíes del exterior envían cifras históricas de divisas.', opts: [
        { t: 'Canalizarlas a inversión (−100 M€)', tes: -100, P: { eco: 3, emp: 1 } }, { t: 'Gastarlas en consumo (+200 M€)', tes: 200, P: { apr: 2 } }] }
    ],

    // ------------------------------------------------------------------
    //  LOGROS
    // ------------------------------------------------------------------
    achievements: [
      { id: 'm1', icon: 'fa-flag', title: 'Primer Mandato', desc: 'Cumple tu primera misión', ok: m => m.goals && m.goals.done >= 1 },
      { id: 'm5', icon: 'fa-list-check', title: 'Gestor Eficaz', desc: 'Cumple 5 misiones', ok: m => m.goals && m.goals.done >= 5 },
      { id: 'f1', icon: 'fa-diagram-project', title: 'Visión de Estado', desc: 'Completa un foco nacional', ok: m => m.foc && m.foc.done.length >= 1 },
      { id: 'fb', icon: 'fa-sitemap', title: 'Doctrina Completa', desc: 'Completa una rama entera de focos', ok: m => m.foc && ['eco', 'soc', 'seg', 'dip'].some(b => window.MA_DATA.focus.filter(f => f.b === b).every(f => m.foc.done.includes(f.id))) },
      { id: 'p3', icon: 'fa-helmet-safety', title: 'Constructor de Marruecos', desc: 'Termina 3 proyectos de Estado', ok: m => m.proj && m.proj.done.length >= 3 },
      { id: 'rich', icon: 'fa-vault', title: 'Caja Fuerte', desc: 'Llega a 15.000 M€ en Tesorería', ok: m => m.tes >= 15000 },
      { id: 'all', icon: 'fa-star', title: 'País de Primera', desc: 'Todas las métricas ≥ 70% a la vez', ok: m => ['eco', 'est', 'emp', 'apr'].every(k => m[k] >= 70) && m.mil >= 70 },
      { id: 'abyss', icon: 'fa-skull', title: 'Al Borde del Abismo', desc: 'Emite más de 6.000 M€ de deuda nueva', ok: m => m.dbt && m.dbt.issued >= 6000 },
      { id: 'cred', icon: 'fa-building-columns', title: 'Banco Creíble', desc: 'Credibilidad de Bank Al-Maghrib ≥ 85%', ok: m => m.bam && m.bam.cred >= 85 },
      { id: 'surv', icon: 'fa-shield', title: 'Superviviente', desc: 'Sobrevive a una moción de censura', ok: m => m.survived >= 1 },
      { id: 'year', icon: 'fa-calendar-check', title: 'Primer Año de Mandato', desc: 'Cumple un año en el poder', ok: m => m.day >= 365 }
    ]
  };

  // Compatibilidad: secciones de solo lectura del menú (igual que en España)
  window.MA_DATA.readonly = { inf: ['Informes', 'fa-file-lines'], cis: ['Informes (CIS)', 'fa-square-poll-vertical'], logros: ['Logros', 'fa-trophy'] };
})();
