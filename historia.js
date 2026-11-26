/* HISTORIA.JS — Escenario «2000 · HISTORIA»: empieza en el año 2000 con el parlamento de la época y hace que
   aparezcan las grandes crisis y cambios políticos reales (11-S, 2008, Podemos, Vox, Trump, COVID, Ucrania…).
   Tus decisiones cambian la respuesta y las consecuencias, pero la historia del mundo avanza. */
(function () {
  'use strict';
  const cid = () => (window.CURRENT_COUNTRY && CURRENT_COUNTRY.id) || 'espana';
  const TOTAL = () => (typeof CHAMBER !== 'undefined' && CHAMBER.seats) || 350;

  // ---------- Parlamento de partida en el año 2000 (pesos; se normalizan al total de escaños) ----------
  const ERA = {
    espana: { w: { PP: 183, PSOE: 125, JUNTS: 15, SUMAR: 8, PNV: 7, BNG: 3, ERC: 2, BILDU: 1, PODEMOS: 0, VOX: 0 },
      L: { PP: 'José María Aznar', PSOE: 'Joaquín Almunia', SUMAR: 'Francisco Frutos', JUNTS: 'Artur Mas', PNV: 'Xabier Arzalluz', BNG: 'Xosé Manuel Beiras', ERC: 'Josep-Lluís Carod-Rovira', BILDU: 'Eusko Alkartasuna', PODEMOS: '—', VOX: '—' } },
    francia: { w: { PS: 250, LR: 250, LFI: 36, EELV: 8, LIOT: 25, RN: 1, ENS: 0 },
      L: { PS: 'Lionel Jospin', LR: 'Jacques Chirac · RPR-UDF', LFI: 'Robert Hue (PCF)', EELV: 'Dominique Voynet', RN: 'Jean-Marie Le Pen (FN)', ENS: '—', LIOT: 'Radicaux y divers' } },
    alemania: { w: { SPD: 298, CDU: 245, GRU: 47, LIN: 36, AFD: 0, SSW: 1 },
      L: { SPD: 'Gerhard Schröder', CDU: 'Wolfgang Schäuble · CDU/CSU', GRU: 'Joschka Fischer', LIN: 'Gregor Gysi (PDS)', AFD: '—' } },
    rusia: { w: { KPRF: 113, ER: 140, LDPR: 17, IND: 100, SR: 0, NL: 0 },
      L: { ER: 'Vladímir Putin · Unidad', KPRF: 'Gennadi Ziugánov', LDPR: 'Vladímir Zhirinovski', IND: 'Yábloko / SPS', SR: '—', NL: '—' } },
    eeuu: { w: { GOPT: 221, DEMM: 211, IND: 1, MAGA: 0, DEMP: 0, VER: 0, LIB: 0 },
      L: { DEMM: 'Bill Clinton · Al Gore', GOPT: 'George W. Bush · Dennis Hastert', MAGA: '—', DEMP: '—' } },
    marruecos: { w: { USFP: 57, PI: 32, UC: 50, RNI: 46, MP: 40, PPS: 9, PJD: 9, OTR: 40, PAM: 0, FGD: 0, MDS: 0 },
      L: { USFP: 'Abderramán Yusufi', PI: 'Abbas El Fassi', PJD: 'Abdelilah Benkirán', PAM: '—', MDS: '—', FGD: '—' } },
    coreanorte: { w: { PTC: 607, SDP: 50, CHON: 22, IND: 8 }, L: {} }
  };
  const DEBT0 = { espana: 0.55, francia: 0.52, alemania: 0.95, eeuu: 0.46 };
  const NAMES = { espana: 'ESPAÑA', francia: 'FRANCIA', alemania: 'ALEMANIA', rusia: 'RUSIA', eeuu: 'ESTADOS UNIDOS', marruecos: 'MARRUECOS', coreanorte: 'COREA DEL NORTE' };

  function normalize(parties, w) {
    const T = TOTAL(), ids = parties.map(p => p.id), tot = ids.reduce((a, i) => a + (w[i] || 0), 0) || 1;
    const raw = ids.map(i => (w[i] || 0) / tot * T), fl = raw.map(Math.floor); let rest = T - fl.reduce((a, b) => a + b, 0);
    raw.map((r, k) => [r - fl[k], k]).sort((a, b) => b[0] - a[0]).forEach(([, k]) => { if (rest > 0) { fl[k]++; rest--; } });
    parties.forEach((p, k) => { p.seats = fl[k]; p.baseSeats = fl[k]; p.basePct = +(fl[k] / T * 100).toFixed(1); p.minSeats = 0; p.maxSeats = T; });
  }
  function injectScenarios() {
    if (typeof SCENARIOS === 'undefined') return;
    const era = ERA[cid()], base = SCENARIOS.ACTUAL; if (!era || !base || SCENARIOS.H2000) return;
    const sc = JSON.parse(JSON.stringify(base));
    sc.id = 'H2000'; sc.hist = true; sc.startYear = 2000;
    sc.title = (NAMES[cid()] || 'PAÍS') + ' · AÑO 2000 · HISTORIA';
    sc.desc = 'Empieza en el año 2000 con el parlamento de la época. Irán apareciendo las crisis y cambios reales (11-S, crisis de 2008, nuevos partidos, pandemia, guerra de Ucrania…) y tú decides cómo responder: la historia del país puede cambiar, pero el mundo sigue su curso.';
    normalize(sc.parties, era.w);
    sc.parties.forEach(p => { if (era.L[p.id]) p.leader = era.L[p.id]; });
    SCENARIOS.H2000 = sc;
  }

  // ---------- Línea temporal ----------
  const ALL = '*', EU = 'eu';
  /* [año, mes, id, quién, título, descripción, efectos, cambios de escaños, opciones[[texto, stats, coste]]] */
  const TL = [
    [2001, 9, 'h_911', '*', 'ATENTADOS DEL 11-S', 'Los atentados contra las Torres Gemelas y el Pentágono cambian el orden mundial. Se dispara la seguridad, cae la confianza y aparece la «guerra contra el terror».', { eco: -3, est: -3, con: -2 }, {}, [['Reforzar la seguridad y alinearte con EE. UU.', { est: 3, con: 3, apr: 2 }], ['Priorizar la diplomacia y el derecho internacional', { apr: 2, con: -1 }]], 'espana|francia|alemania|rusia|eeuu|marruecos'],
    [2002, 1, 'h_euro', '*', 'LLEGA EL EURO', 'Los billetes y monedas en euros sustituyen a las divisas nacionales. Comercio y turismo se aceleran, pero suben los precios.', { eco: 4, apr: -1 }, {}, [['Celebrar la entrada del euro', { apr: 2, con: 2 }], ['Vigilar los precios y los abusos', { apr: 3, eco: -1 }]], 'espana|francia|alemania', EU],
    [2002, 4, 'h_lepen', '*', 'LE PEN EN LA SEGUNDA VUELTA', 'El Frente Nacional se cuela en la segunda vuelta presidencial y sacude el sistema.', { est: -3 }, { RN: 12 }, [['Cordón sanitario y frente republicano', { est: 3, apr: 1 }], ['Endurecer el discurso sobre seguridad', { apr: 3, est: -1 }]], 'francia'],
    [2003, 3, 'h_irak', '*', 'GUERRA DE IRAK', 'EE. UU. y sus aliados invaden Irak sin respaldo claro de la ONU. La calle se divide.', { apr: -3, est: -2 }, {}, [['Apoyar la intervención', { con: 4, apr: -5, mil: 2 }], ['Oponerte y defender a la ONU', { apr: 4, con: -2 }]], 'espana|francia|alemania|rusia|eeuu|marruecos'],
    [2003, 5, 'h_casa', '*', 'ATENTADOS DE CASABLANCA', 'Atentados suicidas golpean Casablanca y abren una ofensiva antiterrorista.', { est: -5, apr: -2 }, { PJD: -4 }, [['Ley antiterrorista y mano dura', { est: 4, mil: 3, apr: -2 }], ['Reformas sociales y religiosas', { est: 2, apr: 2, eco: -1 }]], 'marruecos'],
    [2004, 3, 'h_11m', '*', 'ATENTADOS DEL 11-M', 'Los trenes de Madrid sufren el mayor atentado de la historia de España, tres días antes de unas elecciones generales.', { est: -6, apr: -3, eco: -1 }, {}, [['Gestionar con transparencia y unidad', { est: 4, apr: 3 }], ['Controlar el relato político', { apr: -6, est: -2 }]], 'espana'],
    [2005, 5, 'h_ue', '*', 'REFERÉNDUM DE LA CONSTITUCIÓN EUROPEA', 'Francia y Países Bajos rechazan el Tratado Constitucional y abren una crisis europea.', { est: -2, apr: -2 }, { RN: 6, LFI: 6 }, [['Pedir una Europa más social', { apr: 3 }], ['Defender el proyecto europeo', { con: 2, apr: -2 }]], 'francia', EU],
    [2005, 11, 'h_merkel', '*', 'ANGELA MERKEL, CANCILLER', 'Tras unas elecciones muy ajustadas, Alemania entra en una era de grandes coaliciones.', { est: 3 }, { CDU: 15, SPD: -15 }, [['Gran coalición de estabilidad', { est: 4, eco: 1 }], ['Gobierno de partido', { apr: 2, est: -2 }]], 'alemania'],
    [2005, 10, 'h_banlieues', '*', 'REVUELTA EN LAS BANLIEUES', 'Semanas de disturbios en los suburbios franceses tras la muerte de dos jóvenes.', { est: -5, apr: -3 }, { RN: 5 }, [['Estado de emergencia y orden', { est: 3, apr: -2 }], ['Plan de inversión urbana', { apr: 2, eco: -2, est: 1 }]], 'francia'],
    [2006, 10, 'h_nuke', '*', 'PRIMER ENSAYO NUCLEAR', 'Corea del Norte detona su primer artefacto nuclear. La ONU impone sanciones.', { eco: -5, con: -10, mil: 5 }, {}, [['Desafiar las sanciones', { mil: 5, apr: 3, eco: -3 }], ['Ofrecer negociar a cambio de ayuda', { eco: 3, con: 4, mil: -2 }]], 'coreanorte'],
    [2007, 12, 'h_burbuja', '*', 'SE PINCHA LA BURBUJA INMOBILIARIA', 'Caen las ventas, se frena la construcción y el crédito se seca. La crisis financiera global empieza a ser inevitable.', { eco: -5, emp: -4, est: -2 }, {}, [['Inyectar liquidez al sector', { eco: 3, apr: -2 }, 3000], ['Dejar que el mercado se corrija', { eco: -2, apr: -3 }]], 'espana|eeuu'],
    [2008, 9, 'h_lehman', '*', 'QUIEBRA DE LEHMAN BROTHERS · CRISIS FINANCIERA', 'La mayor crisis desde 1929: quiebran bancos, se hunde el crédito y se dispara el desempleo.', { eco: -12, emp: -8, est: -5, apr: -4 }, {}, [['Plan de estímulo y rescate bancario', { eco: 5, emp: 3, apr: -3 }, 8000], ['Austeridad y control del déficit', { eco: -3, est: -3, con: 3 }], ['Nacionalizar y proteger a los afectados', { apr: 4, eco: 2, con: -3 }, 5000]], 'espana|francia|alemania|eeuu|rusia|marruecos'],
    [2008, 11, 'h_obama', '*', 'OBAMA GANA LAS ELECCIONES', 'La esperanza de cambio arrastra a los demócratas y a los jóvenes votantes.', { apr: 2 }, { DEMM: 25, DEMP: 15, GOPT: -40 }, [['Aprovechar el impulso reformista', { apr: 3, est: 2 }], ['Pactar con la oposición', { est: 3 }]], 'eeuu'],
    [2010, 5, 'h_prima', '*', 'CRISIS DE LA DEUDA SOBERANA', 'La prima de riesgo se dispara, Grecia es rescatada y los mercados atacan a la periferia del euro.', { eco: -6, est: -4, emp: -3, apr: -4 }, {}, [['Recortes y reformas laborales', { eco: 3, apr: -7, est: -3, con: 4 }], ['Pedir un rescate europeo', { eco: 4, apr: -4, con: -3 }], ['Rechazar la austeridad', { apr: 5, eco: -5, con: -6 }]], 'espana|francia|alemania', EU],
    [2011, 2, 'h_20f', '*', 'PRIMAVERA ÁRABE · MOVIMIENTO 20 DE FEBRERO', 'Las revueltas en el mundo árabe llegan a Marruecos: la calle exige reformas y dignidad.', { est: -7, apr: -4 }, { PJD: 12 }, [['Nueva Constitución y reformas', { est: 5, apr: 4, eco: -2 }], ['Reprimir las protestas', { est: 2, apr: -6, con: -4 }]], 'marruecos'],
    [2011, 5, 'h_15m', '*', 'MOVIMIENTO 15-M · INDIGNADOS', 'Miles de personas ocupan las plazas al grito de «no nos representan». Nace una nueva izquierda.', { est: -4, apr: -3 }, { SUMAR: 4 }, [['Dialogar y abrir reformas políticas', { apr: 4, est: 2 }], ['Mantener el orden', { est: 2, apr: -4 }]], 'espana'],
    [2011, 11, 'h_pjd', '*', 'EL PJD GANA LAS ELECCIONES', 'Los islamistas moderados ganan los comicios tras la reforma constitucional.', { apr: 1 }, { PJD: 80, USFP: -20, PI: -15, UC: -15, PAM: -10 }, [['Cohabitar con el nuevo bloque', { est: 3 }], ['Mantener el control desde Palacio', { est: -2, mil: 2 }]], 'marruecos'],
    [2011, 12, 'h_dumas', '*', 'PROTESTAS POR EL FRAUDE ELECTORAL', 'Decenas de miles salen a la calle en Moscú por las irregularidades en las legislativas.', { est: -6, apr: -5 }, { KPRF: 15, ER: -45 }, [['Concesiones políticas', { apr: 3, est: 2, con: 2 }], ['Reforzar el control', { est: 3, apr: -3, mil: 2 }]], 'rusia'],
    [2011, 12, 'h_kim', '*', 'MUERE KIM JONG-IL', 'Kim Jong-un asume el poder en Pionyang.', { est: -3, mil: 3 }, {}, [['Consolidar al nuevo líder', { est: 4, mil: 4 }], ['Abrir un poco la economía', { eco: 4, est: -1 }]], 'coreanorte'],
    [2014, 3, 'h_crimea', '*', 'ANEXIÓN DE CRIMEA', 'Rusia se anexiona Crimea. Occidente responde con sanciones económicas.', { eco: -6, con: -8, apr: 8, mil: 5 }, {}, [['Mantener el pulso con Occidente', { apr: 4, eco: -3, mil: 3 }], ['Buscar un acuerdo y rebajar sanciones', { eco: 3, apr: -4, con: 4 }]], 'rusia'],
    [2014, 5, 'h_podemos', '*', 'PODEMOS IRRUMPE EN EUROPA', 'Un partido nacido meses antes consigue cinco eurodiputados. Las encuestas empiezan a moverse.', { est: -3 }, { PODEMOS: 30, PSOE: -12, PP: -10, SUMAR: -8 }, [['Atender el malestar con reformas', { apr: 3, est: 1 }], ['Minimizar el fenómeno', { apr: -3 }]], 'espana'],
    [2015, 6, 'h_refugiados', '*', 'CRISIS DE REFUGIADOS', 'Cientos de miles de refugiados llegan a Europa. Se abre un debate sobre fronteras y acogida.', { est: -3, apr: -2 }, { AFD: 35, RN: 12, GRU: 6 }, [['Acoger con cuotas europeas', { apr: -1, con: 4, est: -1 }], ['Cerrar fronteras', { apr: 3, con: -4, est: 1 }]], 'alemania|francia|espana', EU],
    [2015, 12, 'h_podemos2', '*', 'EL FIN DEL BIPARTIDISMO', 'Podemos y las nuevas fuerzas rompen el bipartidismo en las generales.', { est: -4, apr: -2 }, { PODEMOS: 45, PSOE: -20, PP: -22, SUMAR: 2 }, [['Abrir negociaciones con todas las fuerzas', { est: 3, apr: 1 }], ['Defender un gobierno en solitario', { est: -3 }]], 'espana'],
    [2015, 11, 'h_bataclan', '*', 'ATENTADOS DE PARÍS', 'Los atentados de noviembre estremecen a Francia y a Europa y activan el estado de emergencia.', { est: -6, apr: -3, mil: 3 }, { RN: 20 }, [['Estado de emergencia y operaciones militares', { est: 3, mil: 4 }], ['Reforzar la cohesión y la inteligencia', { apr: 3, est: 2 }]], 'francia'],
    [2016, 6, 'h_brexit', '*', 'BREXIT', 'El Reino Unido vota abandonar la UE. Se abre una crisis de confianza en la integración europea.', { eco: -3, est: -3 }, { RN: 8, AFD: 8 }, [['Reforzar la unidad europea', { con: 3 }], ['Pedir reformas a Bruselas', { apr: 3, con: -2 }]], 'espana|francia|alemania', EU],
    [2016, 11, 'h_trump', '*', 'TRUMP GANA LAS ELECCIONES', 'Donald Trump rompe todos los pronósticos y transforma el Partido Republicano.', { est: -4, apr: -1 }, { MAGA: 80, GOPT: -50, DEMM: -20 }, [['Tender puentes con la nueva Administración', { con: 3, apr: 1 }], ['Plantar cara', { apr: 3, con: -3 }]], 'eeuu'],
    [2017, 6, 'h_macron', '*', 'MACRON Y LA RUPTURA DEL SISTEMA', 'Un movimiento nuevo, En Marcha, arrasa y hunde a los partidos tradicionales.', { est: 2 }, { ENS: 250, PS: -200, LR: -80, LFI: 30 }, [['Reformas liberales ambiciosas', { eco: 3, apr: -3 }], ['Pactar con los sindicatos', { apr: 3, est: 2 }]], 'francia'],
    [2017, 10, 'h_proces', '*', 'REFERÉNDUM Y CRISIS EN CATALUÑA', 'El desafío independentista llega a su punto álgido y se aplica una intervención institucional.', { est: -7, eco: -2 }, { ERC: 12, JUNTS: 10, PSOE: -5, PP: -5 }, [['Aplicar la ley con firmeza', { est: 2, apr: -2, mil: 2 }], ['Abrir una mesa de diálogo', { apr: 2, est: 3 }]], 'espana'],
    [2017, 9, 'h_afd', '*', 'LA AFD ENTRA EN EL BUNDESTAG', 'La extrema derecha logra representación por primera vez en décadas.', { est: -3 }, { AFD: 75, CDU: -35, SPD: -25 }, [['Mantener el cordón sanitario', { est: 3 }], ['Endurecer el discurso migratorio', { apr: 3, con: -2 }]], 'alemania'],
    [2018, 12, 'h_vox', '*', 'VOX IRRUMPE EN ANDALUCÍA', 'La extrema derecha consigue su primer gran resultado en unas elecciones regionales.', { est: -3 }, { VOX: 12, PP: -6, PSOE: -4 }, [['Aislar a Vox', { est: 3, apr: 1 }], ['Competir por su electorado', { apr: 3, est: -2 }]], 'espana'],
    [2019, 4, 'h_vox2', '*', 'VOX ENTRA EN EL CONGRESO', 'Vox entra en el Parlamento y sube en las encuestas: el sistema de partidos se fragmenta del todo.', { est: -3 }, { VOX: 40, PP: -20, PSOE: -10, PODEMOS: -10 }, [['Gobierno de coalición con la izquierda', { est: 2, apr: 1 }], ['Buscar acuerdos de Estado', { est: 3 }]], 'espana'],
    [2020, 3, 'h_covid', '*', 'PANDEMIA DE COVID-19', 'Confinamientos, hospitales al límite y economía parada: un shock sanitario y económico sin precedentes.', { eco: -10, emp: -7, est: -5, apr: -3 }, {}, [['Confinamiento estricto y ayudas masivas', { est: 3, eco: -3, apr: 3 }, 6000], ['Medidas selectivas para proteger la economía', { eco: 3, apr: -4, est: -3 }], ['Priorizar la vacunación y los ERTE', { apr: 3, emp: 3, eco: -1 }, 4000]], 'espana|francia|alemania|rusia|eeuu|marruecos|coreanorte'],
    [2020, 7, 'h_const', '*', 'REFORMA CONSTITUCIONAL', 'Un paquete de enmiendas permite perpetuar el liderazgo y refuerza el control del Estado.', { est: 3, apr: -3 }, {}, [['Blindar el sistema', { est: 4, mil: 2 }], ['Frenar la reforma', { apr: 3, est: -3 }]], 'rusia'],
    [2021, 1, 'h_capitolio', '*', 'ASALTO AL CAPITOLIO', 'Seguidores de Trump asaltan el Congreso y sacuden la democracia estadounidense.', { est: -6, apr: -3 }, {}, [['Responder con firmeza judicial', { est: 3, apr: 1 }], ['Rebajar la tensión política', { est: 2, apr: -1 }]], 'eeuu'],
    [2021, 9, 'h_pjd2', '*', 'HUNDIMIENTO DEL PJD', 'El partido islamista gobernante colapsa en las urnas y el RNI lidera el Parlamento.', { est: -1 }, { PJD: -95, RNI: 70, PAM: 20 }, [['Aceptar el nuevo mapa', { est: 3 }], ['Cuestionar el resultado', { est: -2, apr: -1 }]], 'marruecos'],
    [2022, 2, 'h_ucrania', '*', 'INVASIÓN RUSA DE UCRANIA', 'La guerra regresa a Europa. Sanciones, crisis energética y una inflación disparada.', { eco: -7, est: -4, apr: -2 }, {}, [['Apoyar a Ucrania y sancionar a Moscú', { con: 5, eco: -3, apr: -2 }], ['Neutralidad y priorizar la energía', { eco: 2, con: -4, apr: 1 }], ['Defender la ofensiva (Rusia)', { apr: 4, eco: -4, con: -8, mil: 4 }]], 'espana|francia|alemania|rusia|eeuu|marruecos'],
    [2022, 6, 'h_rn', '*', 'LA EXTREMA DERECHA DISPARA SU REPRESENTACIÓN', 'El RN logra un resultado histórico en las legislativas y entra con fuerza en la Asamblea.', { est: -4 }, { RN: 90, ENS: -90, LR: -20 }, [['Pactos puntuales con la oposición', { est: 3 }], ['Gobernar por decreto', { est: -3, apr: -2 }]], 'francia'],
    [2022, 10, 'h_inflacion', '*', 'INFLACIÓN Y CRISIS ENERGÉTICA', 'La inflación alcanza máximos de décadas y el recibo de la luz y de la compra se dispara.', { eco: -4, apr: -4, est: -2 }, {}, [['Topes de precios y ayudas', { apr: 3, eco: -2 }, 5000], ['Subida de tipos y contención', { eco: 2, apr: -4, emp: -2 }]], 'espana|francia|alemania|eeuu|marruecos|rusia'],
    [2024, 9, 'h_afd2', '*', 'AUMENTO DE LA AFD EN EL ESTE', 'La AfD gana por primera vez unas elecciones regionales y rompe el consenso político alemán.', { est: -3 }, { AFD: 40, SPD: -20, GRU: -15, CDU: -5 }, [['Reforzar el cordón sanitario', { est: 3 }], ['Endurecer la política migratoria', { apr: 3, con: -2 }]], 'alemania']
  ];
  // Cambios de líderes (solo nombre en el parlamento)
  const LD = {
    espana: [[2000, 7, 'PSOE', 'José Luis Rodríguez Zapatero'], [2004, 4, 'PP', 'Mariano Rajoy'], [2012, 2, 'PSOE', 'Alfredo Pérez Rubalcaba'], [2014, 7, 'PSOE', 'Pedro Sánchez'], [2014, 5, 'PODEMOS', 'Pablo Iglesias'], [2018, 7, 'PP', 'Pablo Casado'], [2018, 12, 'VOX', 'Santiago Abascal'], [2022, 4, 'PP', 'Alberto Núñez Feijóo']],
    francia: [[2002, 5, 'RN', 'Jean-Marie Le Pen'], [2011, 5, 'RN', 'Marine Le Pen'], [2017, 6, 'ENS', 'Emmanuel Macron'], [2012, 5, 'PS', 'François Hollande']],
    alemania: [[2005, 11, 'CDU', 'Angela Merkel'], [2013, 5, 'AFD', 'Bernd Lucke'], [2021, 12, 'SPD', 'Olaf Scholz'], [2022, 1, 'CDU', 'Friedrich Merz']],
    rusia: [[2008, 5, 'ER', 'Dmitri Medvédev · Putin'], [2012, 5, 'ER', 'Vladímir Putin']],
    eeuu: [[2009, 1, 'DEMM', 'Barack Obama'], [2017, 1, 'GOPT', 'Donald Trump'], [2021, 1, 'DEMM', 'Joe Biden'], [2025, 1, 'MAGA', 'Donald Trump']],
    marruecos: [[2011, 11, 'PJD', 'Abdelilah Benkirán'], [2021, 9, 'RNI', 'Aziz Ajanuch']],
    coreanorte: []
  };

  const H = () => gameState.hist || (gameState.hist = { done: {}, init: false });
  const clamp = v => Math.max(0, Math.min(100, v));
  function shift(sh) {
    const P = gameState.parties; if (!P) return;
    Object.keys(sh || {}).forEach(id => {
      const p = P.find(x => x.id === id); if (!p) return;
      let d = sh[id], others = P.filter(x => x.id !== id && (x.seats || 0) > 0);
      if (d > 0) { const pool = others.reduce((a, x) => a + x.seats, 0); d = Math.min(d, pool); }
      else d = -Math.min(-d, p.seats || 0);
      if (!d) return;
      // quien gana escaños se los quita al resto en proporción; quien pierde los reparte al resto
      const pool = others.reduce((a, x) => a + x.seats, 0) || 1; let left = Math.abs(d);
      others.forEach((x, k) => { const t = k === others.length - 1 ? left : Math.min(left, Math.round(Math.abs(d) * x.seats / pool)); const q = d > 0 ? -Math.min(x.seats, t) : t; x.seats += q; left -= Math.abs(q); });
      p.seats = Math.max(0, p.seats + d - (left && d > 0 ? 0 : 0));
    });
    const T = TOTAL(), sum = P.reduce((a, x) => a + (x.seats || 0), 0);
    if (sum !== T) { const big = P.slice().sort((a, b) => b.seats - a.seats)[0]; big.seats += T - sum; }
    P.forEach(x => { x.baseSeats = x.seats; x.basePct = +(x.seats / T * 100).toFixed(1); });
  }
  const vis = id => { const e = document.getElementById(id); return !!(e && e.offsetParent !== null && e.innerHTML.trim()); };
  function ready() { return gameState.step === 4 && gameState.metrics && !gameState.activeDynamicEvent && !gameState.activeNewsPopup && !document.getElementById('nuc-ov') && !vis('xm-modal') && !vis('gov-reform'); }
  function fire(e) {
    const H0 = H(), [, , id, , title, desc, fx, sh, opts, , ] = e;
    H0.done[id] = true;
    Object.keys(fx).forEach(k => { gameState.metrics[k] = clamp((gameState.metrics[k] || 0) + fx[k]); });
    shift(sh);
    try { if (typeof fxPlay === 'function') fxPlay('crisis'); } catch (x) { /* sin audio */ }
    gameState.gameSpeed = 0;
    const when = gameState.currentDate ? gameState.currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : '';
    gameState.activeDynamicEvent = {
      id: 'H_' + id, cat: 'HISTORIA · ' + when.toUpperCase(), title, desc, condition: () => true,
      options: opts.map(o => ({ text: o[0], cost: o[2] || 0, stats: o[1] || {}, loyaltyImpact: {}, news: title + ': ' + o[0] + '.' }))
    };
    try { render(); } catch (x) { /* sin render */ }
  }
  function leaders() {
    const H0 = H(), L = LD[cid()] || [], d = gameState.currentDate; if (!d) return;
    L.forEach((l, i) => { const k = 'L' + i; if (H0.done[k]) return; if (d >= new Date(l[0], l[1] - 1, 1)) { H0.done[k] = true; const p = (gameState.parties || []).find(x => x.id === l[2]); if (p) p.leader = l[3]; } });
  }
  function check() {
    if (!(gameState.scenario && gameState.scenario.hist) || !gameState.currentDate) return;
    const H0 = H();
    if (!H0.init) { const f = DEBT0[cid()]; if (!f) H0.init = true; else if (gameState.debt && gameState.debt.amount) { H0.init = true; gameState.debt.amount = Math.round(gameState.debt.amount * f); if (gameState.debt.legacy != null) gameState.debt.legacy = Math.round(gameState.debt.legacy * f); } }
    leaders();
    if (!ready()) return;
    const d = gameState.currentDate, me = cid(), eu = !!(window.MC && MC.eu);
    for (const e of TL) {
      if (H0.done[e[2]] || d < new Date(e[0], e[1] - 1, 1)) continue;
      if (e[9] && !e[9].split('|').includes(me)) { H0.done[e[2]] = true; continue; }
      if (e[10] === EU && !eu) { H0.done[e[2]] = true; continue; }
      if (d - new Date(e[0], e[1] - 1, 1) > 120 * 864e5) { H0.done[e[2]] = true; shift(e[7]); continue; }  // si llega tarde, aplica solo el cambio político
      fire(e); return;
    }
  }
  window.histCheck = check;
  const _gt = window.gameTick;
  if (typeof _gt === 'function') gameTick = function () {
    const b = gameState.daysInOffice, r = _gt.apply(this, arguments);
    if (gameState.daysInOffice !== b) { try { check(); } catch (e) { console.error(e); } }
    return r;
  };
  ['renderScenarioSelect', 'selectScenario'].forEach(n => {
    const f = window[n]; if (typeof f !== 'function') return;
    window[n] = function () { try { injectScenarios(); } catch (e) { console.error(e); } return f.apply(this, arguments); };
  });
  try { injectScenarios(); } catch (e) { /* los datos aún no están */ }
})();
