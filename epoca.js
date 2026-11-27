/* EPOCA.JS — Cada época con sus propios hechos: sucesos históricos por país (ETA, Prestige, Katrina, Beslan…),
   filtro de anacronismos en decisiones y eventos, y la relación con la Unión Europea con consecuencias reales. */
(function () {
  'use strict';
  const cid = () => (window.CURRENT_COUNTRY && CURRENT_COUNTRY.id) || 'espana';
  const yr = () => gameState.currentDate ? gameState.currentDate.getFullYear() : 2000;
  const day = () => gameState.daysInOffice || 0;
  const toast = (h, c) => { try { goalsToast(h, c || '#38bdf8'); } catch (e) { /* sin aviso */ } };
  const acc = (k, v) => { try { focusAccum(focusInit(), k, v); } catch (e) { try { focusMetricAdd(k, v); } catch (e2) { /* sin métricas */ } } };
  const cpGet = () => { try { goalsInit(); return gameState.goals.capital || 0; } catch (e) { return 0; } };
  const cpAdd = v => { try { goalsInit(); gameState.goals.capital = Math.max(0, Math.min(100, (gameState.goals.capital || 0) + v)); } catch (e) { /* sin capital */ } };
  const live = () => gameState.step === 4 && gameState.metrics;
  const sc = () => { try { return (MC.budget || 100000) / 100000; } catch (e) { return 1; } };

  // ================= 1) SUCESOS HISTÓRICOS POR PAÍS =================
  // [año, mes, id, título, descripción, opciones[[texto, stats, coste, deuda]], países]
  const EV = [
    // ----- ESPAÑA -----
    [2000, 1, 'x_eta1', 'ETA ROMPE LA TREGUA', 'La banda terrorista anuncia el fin del alto el fuego y vuelve a atentar. Los ciudadanos exigen una respuesta firme.', [['Endurecer la política antiterrorista', { est: 3, apr: 2, mil: 1 }], ['Intentar reabrir el diálogo', { apr: -3, est: -3 }], ['Pacto de Estado con la oposición contra el terrorismo', { est: 4, apr: 3, con: 2 }]], 'espana'],
    [2000, 11, 'x_lluch', 'ETA ASESINA A ERNEST LLUCH', 'El exministro socialista y catedrático muere a tiros en Barcelona. Manifestaciones multitudinarias en toda España.', [['Manifestación de unidad y refuerzo policial', { est: 3, apr: 3 }, 200], ['Ilegalizar el entorno político de ETA', { est: 2, apr: 1, con: -2 }], ['Callar y no inflamar la situación', { apr: -4, est: -2 }]], 'espana'],
    [2002, 6, 'x_20j', 'HUELGA GENERAL CONTRA EL «DECRETAZO»', 'Los sindicatos convocan la huelga general del 20-J contra la reforma de la protección por desempleo.', [['Retirar la reforma', { apr: 4, eco: -2, est: 2 }], ['Mantenerla y negociar al margen', { apr: -5, eco: 2, est: -3 }]], 'espana'],
    [2002, 7, 'x_perejil', 'LA CRISIS DEL PEREJIL', 'Soldados marroquíes ocupan el islote de Perejil. Hay tensión diplomática y militar entre Madrid y Rabat.', [['Operación militar para recuperar el islote', { mil: 3, apr: 3, con: -4 }], ['Mediación de EE. UU. y negociación', { est: 2, apr: 1 }], ['Ignorar la provocación', { apr: -3, mil: -2 }]], 'espana|marruecos'],
    [2002, 11, 'x_prestige', 'NAUFRAGIO DEL «PRESTIGE»', 'El petrolero se parte frente a Galicia y una marea negra cubre la costa. La gestión de la crisis está en el punto de mira.', [['Plan de limpieza y ayudas masivas', { apr: 4, est: 2, eco: -1 }, 900], ['Mantener la gestión actual', { apr: -7, est: -3 }], ['Culpar a las navieras e ir a juicio', { apr: -2, est: 1 }]], 'espana'],
    [2003, 3, 'x_ley_part', 'LEY DE PARTIDOS Y BATASUNA', 'El Estado se plantea ilegalizar el brazo político de ETA mediante la nueva ley de partidos.', [['Ilegalizar a Batasuna', { est: 3, apr: 2, con: -2 }], ['No ilegalizar y vigilar', { apr: -2, est: -2 }]], 'espana'],
    [2004, 10, 'x_ibarretxe', 'PLAN IBARRETXE', 'El lehendakari presenta un plan de libre asociación para Euskadi. El Parlamento vasco lo aprueba por una mayoría mínima.', [['Rechazarlo en el Congreso', { est: 2, apr: 1 }], ['Abrir una negociación política', { est: -2, apr: -1, con: 1 }]], 'espana'],
    [2005, 6, 'x_mat', 'MATRIMONIO IGUALITARIO', 'El Gobierno aprueba abrir el matrimonio a las parejas del mismo sexo. La Iglesia y la oposición convocan protestas.', [['Aprobar la ley', { apr: 3, est: -2, con: 2 }], ['Limitarla a las uniones civiles', { apr: -1, est: 1 }]], 'espana'],
    [2006, 3, 'x_eta_alto', 'ETA DECLARA UN ALTO EL FUEGO PERMANENTE', 'La banda anuncia un alto el fuego. El Gobierno decide cómo gestionar el proceso con desconfianza social.', [['Abrir un proceso de diálogo', { apr: 1, est: 3 }], ['Mantener la presión policial', { est: 2, apr: 2 }]], 'espana'],
    [2006, 6, 'x_estatut', 'REFERÉNDUM DEL ESTATUT DE CATALUÑA', 'Los catalanes votan el nuevo Estatuto. La oposición lo ha recurrido ante el Constitucional.', [['Apoyar el Estatut tal cual', { apr: 2, est: -3 }], ['Pactar un texto más moderado', { est: 2, apr: -1 }]], 'espana'],
    [2006, 12, 'x_t4', 'ATENTADO DE ETA EN LA T4 DE BARAJAS', 'Una furgoneta bomba revienta en el aparcamiento del aeropuerto de Madrid y rompe el alto el fuego.', [['Romper el proceso y perseguir a ETA', { est: 3, apr: 1, mil: 1 }], ['Intentar salvar el diálogo', { apr: -5, est: -3 }]], 'espana'],
    [2010, 5, 'x_recortes', 'EL GOBIERNO ANUNCIA EL MAYOR AJUSTE DE LA DEMOCRACIA', 'Bajada del sueldo a los funcionarios y congelación de pensiones para frenar la prima de riesgo.', [['Aplicar el ajuste completo', { eco: 2, apr: -7, est: -3, con: 3 }], ['Ajuste más suave y apoyo europeo', { eco: 1, apr: -3, est: -1, con: 1 }]], 'espana'],
    [2010, 9, 'x_hgen', 'HUELGA GENERAL DEL 29-S', 'Los sindicatos paralizan el país contra la reforma laboral y los recortes.', [['Negociar cambios con los sindicatos', { apr: 2, est: 2, eco: -1 }], ['Aguantar el pulso', { apr: -3, eco: 1, est: -3 }]], 'espana'],
    [2011, 10, 'x_eta_fin', 'ETA ANUNCIA EL CESE DEFINITIVO DE LA VIOLENCIA', 'Tras más de cuarenta años, la banda anuncia el fin de su actividad armada.', [['Exigir su disolución y desarme', { est: 4, apr: 3 }], ['Abrir vías de reinserción', { est: 2, apr: -2, con: 1 }]], 'espana'],
    [2013, 1, 'x_barcenas', 'EL CASO BÁRCENAS', 'Se publican los papeles de la supuesta contabilidad en B del partido del Gobierno y estalla un escándalo de corrupción.', [['Pedir perdón y colaborar con la justicia', { apr: -2, est: 2 }], ['Negarlo todo', { apr: -6, est: -3 }], ['Destituir a los implicados', { apr: -1, est: 2 }]], 'espana'],
    [2014, 6, 'x_abdica', 'ABDICA JUAN CARLOS I', 'El Rey anuncia su abdicación en favor de Felipe VI tras años de desgaste de la institución.', [['Aprobar la ley de sucesión con rapidez', { est: 3, apr: 1 }], ['Abrir un debate sobre el modelo de Estado', { est: -3, apr: 2 }]], 'espana'],
    [2014, 11, 'x_9n', 'CONSULTA DEL 9-N EN CATALUÑA', 'La Generalitat celebra una consulta sin validez legal sobre el futuro político de Cataluña.', [['Acudir a los tribunales', { est: 1, apr: 1, con: -1 }], ['Ofrecer una negociación fiscal', { est: 2, apr: -1, eco: -1 }, 500]], 'espana'],
    [2018, 5, 'x_eta_disuelve', 'ETA ANUNCIA SU DISOLUCIÓN', 'La banda comunica oficialmente su desaparición con una carta de despedida.', [['Celebrar el fin sin concesiones', { est: 3, apr: 2 }], ['Homenaje a las víctimas del terrorismo', { est: 2, apr: 3 }, 100]], 'espana'],
    [2018, 6, 'x_mocion', 'MOCIÓN DE CENSURA', 'La sentencia del caso Gürtel abre la puerta a una moción de censura contra el Gobierno.', [['Resistir y pedir calma', { est: -2, apr: -2 }], ['Convocar elecciones anticipadas', { est: 1, apr: 1 }]], 'espana'],
    [2019, 10, 'x_sent', 'SENTENCIA DEL PROCÉS', 'El Supremo condena a los líderes independentistas. Hay disturbios y cortes de carreteras en Cataluña.', [['Firmeza y refuerzo policial', { est: 2, apr: -1, con: -2 }], ['Abrir la vía del diálogo y los indultos', { est: -1, apr: 1, con: 2 }]], 'espana'],
    [2021, 9, 'x_palma', 'ERUPCIÓN DEL VOLCÁN DE LA PALMA', 'La lava arrasa cientos de casas y cultivos en la isla. Los vecinos piden ayudas inmediatas.', [['Plan de reconstrucción y ayudas directas', { apr: 3, est: 2, eco: -1 }, 800], ['Gestión mínima con ayudas parciales', { apr: -3, est: -1 }]], 'espana'],
    [2023, 11, 'x_amnistia', 'LEY DE AMNISTÍA', 'La negociación de investidura incluye una amnistía a los implicados en el procés.', [['Aprobar la amnistía', { est: -3, apr: -2, con: 2 }], ['Rechazarla', { est: 1, apr: 1 }]], 'espana'],
    [2024, 10, 'x_dana', 'DANA DEVASTADORA EN VALENCIA', 'Las inundaciones dejan cientos de víctimas y una enorme destrucción. La gestión de emergencias se discute.', [['Activar la emergencia nacional y ayudas', { apr: 3, est: 1, eco: -1 }, 2500], ['Dejar que gestione la región', { apr: -5, est: -3 }]], 'espana'],
    // ----- FRANCIA -----
    [2003, 8, 'x_canicula', 'LA CANÍCULA DE 2003', 'Una ola de calor extrema causa miles de muertes, sobre todo ancianos. El Gobierno es criticado por su lentitud.', [['Plan nacional de emergencia y residencias', { apr: 2, est: 1, eco: -1 }, 400], ['Minimizar la crisis', { apr: -5, est: -2 }]], 'francia'],
    [2010, 10, 'x_retraites', 'PROTESTAS CONTRA LA REFORMA DE PENSIONES', 'Huelgas y bloqueos contra el retraso de la edad de jubilación a los 62 años.', [['Mantener la reforma', { eco: 2, apr: -4, est: -3, con: 2 }], ['Negociar con los sindicatos', { apr: 2, est: 1, eco: -1 }]], 'francia'],
    [2015, 1, 'x_charlie', 'ATENTADO CONTRA «CHARLIE HEBDO»', 'Terroristas yihadistas asesinan a la redacción del semanario. Millones de personas salen a la calle.', [['Refuerzo antiterrorista y marcha republicana', { est: 3, apr: 3, mil: 1 }, 600], ['Debate sobre libertades y seguridad', { est: 1, apr: 1 }]], 'francia'],
    [2018, 11, 'x_chalecos', 'LOS «CHALECOS AMARILLOS»', 'Un movimiento sin líderes bloquea rotondas por la subida del combustible y el coste de la vida.', [['Retirar la subida y subir el salario mínimo', { apr: 4, eco: -2, est: 2 }, 1500, 5000], ['Mantener el rumbo y reforzar la policía', { apr: -4, est: -3, eco: 1 }]], 'francia'],
    [2023, 3, 'x_retraites2', 'REFORMA DE PENSIONES A LOS 64 AÑOS', 'El Gobierno aprueba el retraso de la jubilación sin votación, provocando una oleada de protestas.', [['Mantener y aplicar la reforma', { eco: 2, apr: -5, est: -4 }], ['Retirarla', { apr: 3, est: 2, eco: -2 }]], 'francia'],
    // ----- ALEMANIA -----
    [2002, 8, 'x_elba', 'INUNDACIONES DEL ELBA', 'El desbordamiento del río arrasa el este de Alemania y Dresde queda anegada.', [['Fondo de reconstrucción (subir impuestos un año)', { apr: 2, est: 2, eco: -1 }, 600], ['Pagarlo con deuda', { apr: 1, eco: -1 }, 0, 3000]], 'alemania'],
    [2003, 3, 'x_agenda', 'AGENDA 2010', 'El canciller propone la mayor reforma del mercado laboral y de los subsidios de las últimas décadas.', [['Aplicar la reforma Hartz completa', { eco: 4, emp: 3, apr: -5, est: -2 }], ['Suavizarla con los sindicatos', { eco: 1, emp: 1, apr: -1 }]], 'alemania'],
    [2011, 3, 'x_fukus', 'TRAS FUKUSHIMA: SALIDA DE LA ENERGÍA NUCLEAR', 'El accidente japonés reabre el debate. El Gobierno decide el calendario del cierre de las centrales.', [['Cerrar todas antes de 2022', { apr: 3, eco: -2, est: 1 }, 800], ['Alargar la vida de las centrales', { eco: 2, apr: -3 }]], 'alemania'],
    [2015, 9, 'x_wir', 'LLEGADA MASIVA DE REFUGIADOS', 'Cientos de miles de personas llegan a Alemania desde Siria. La sociedad está dividida.', [['Acoger con un plan de integración', { apr: 1, est: -2, eco: 1 }, 1500], ['Limitar las llegadas y reforzar fronteras', { apr: 2, est: 1, con: -2 }]], 'alemania'],
    [2022, 2, 'x_zeiten', 'ZEITENWENDE: 100.000 MILLONES PARA DEFENSA', 'La invasión de Ucrania obliga a un cambio histórico en la política de seguridad alemana.', [['Fondo especial para la Bundeswehr', { mil: 6, apr: 1, eco: -1 }, 3000, 20000], ['Aumento moderado del gasto', { mil: 2, apr: 1 }, 500]], 'alemania'],
    // ----- RUSIA -----
    [2000, 8, 'x_kursk', 'NAUFRAGIO DEL SUBMARINO «KURSK»', 'El submarino nuclear se hunde en el mar de Barents con toda su tripulación. La gestión del Kremlin es muy criticada.', [['Pedir ayuda internacional y reconocer errores', { apr: 1, mil: -2, con: 2 }], ['Gestionar en secreto', { apr: -5, mil: -3, est: -2 }]], 'rusia'],
    [2002, 10, 'x_nordost', 'TOMA DE REHENES EN EL TEATRO NORD-OST', 'Un comando checheno toma un teatro en Moscú con más de 800 rehenes.', [['Asalto de las fuerzas especiales', { est: 2, apr: 1, mil: 2 }], ['Negociar con los secuestradores', { apr: -3, est: -2 }]], 'rusia'],
    [2004, 9, 'x_beslan', 'MASACRE DE LA ESCUELA DE BESLÁN', 'Terroristas toman una escuela en Osetia del Norte. La tragedia termina con cientos de muertos.', [['Reforzar los poderes de seguridad', { est: 3, apr: 1, con: -3 }], ['Una investigación independiente', { apr: 2, est: 1, mil: -1 }]], 'rusia'],
    [2008, 8, 'x_georgia', 'GUERRA DE OSETIA DEL SUR CON GEORGIA', 'Tropas georgianas atacan Osetia del Sur y Rusia responde con una ofensiva.', [['Reconocer la independencia de Osetia y Abjasia', { mil: 3, apr: 3, con: -6 }], ['Retirarse tras un alto el fuego', { apr: -2, con: 2 }]], 'rusia'],
    [2018, 6, 'x_pension_ru', 'REFORMA DE LA EDAD DE JUBILACIÓN', 'El Gobierno propone elevar la edad de jubilación, algo muy impopular.', [['Aplicarla con una subida menor', { eco: 2, apr: -5, est: -2 }], ['Retirarla', { apr: 3, eco: -1 }]], 'rusia'],
    [2022, 9, 'x_movil', 'MOVILIZACIÓN PARCIAL', 'Para sostener la guerra se decreta la movilización de reservistas. Miles de jóvenes abandonan el país.', [['Mantener la movilización', { mil: 4, apr: -5, est: -4 }], ['Limitarla y apostar por voluntarios', { mil: 1, apr: -2, est: -1 }]], 'rusia'],
    // ----- EE. UU. -----
    [2000, 12, 'x_bush_gore', 'ELECCIONES DISPUTADAS: BUSH CONTRA GORE', 'El recuento en Florida decide la presidencia y acaba en el Tribunal Supremo.', [['Aceptar la decisión de la Corte', { est: 3, apr: -1 }], ['Exigir un recuento completo', { est: -3, apr: 1 }]], 'eeuu'],
    [2005, 8, 'x_katrina', 'HURACÁN KATRINA', 'Nueva Orleans queda anegada. La respuesta federal es duramente criticada.', [['Plan de reconstrucción federal', { apr: 3, est: 2, eco: -1 }, 3000, 8000], ['Dejar la gestión a los estados', { apr: -6, est: -3 }]], 'eeuu'],
    [2010, 3, 'x_aca', 'REFORMA SANITARIA «OBAMACARE»', 'El Congreso debate ampliar el seguro médico a millones de personas.', [['Aprobarla', { apr: 1, est: -2, eco: -1, con: 1 }, 2000, 6000], ['Rechazarla', { apr: -1, est: 1 }]], 'eeuu'],
    [2011, 5, 'x_osama', 'OPERACIÓN CONTRA BIN LADEN', 'Las fuerzas especiales localizan a Bin Laden en Pakistán. ¿Se autoriza el asalto?', [['Autorizar la operación', { mil: 3, apr: 4, con: -1 }], ['Esperar más información', { apr: -1, mil: -1 }]], 'eeuu'],
    [2013, 10, 'x_cierre', 'CIERRE DEL GOBIERNO FEDERAL', 'Sin acuerdo presupuestario, el Gobierno federal suspende sus servicios.', [['Ceder y pactar el presupuesto', { eco: 1, apr: -1, est: 2 }], ['Aguantar el pulso', { apr: -3, eco: -3, est: -2 }]], 'eeuu'],
    [2020, 5, 'x_floyd', 'MUERTE DE GEORGE FLOYD Y PROTESTAS NACIONALES', 'Las protestas contra la violencia policial se extienden por todo el país.', [['Reformas policiales y diálogo', { apr: 2, est: 1, con: 1 }, 500], ['Desplegar a la Guardia Nacional', { est: 1, apr: -4, mil: 1 }]], 'eeuu'],
    // ----- MARRUECOS -----
    [2004, 2, 'x_mudawana', 'REFORMA DEL CÓDIGO DE FAMILIA (MUDAWANA)', 'El Rey impulsa una reforma que amplía los derechos de la mujer, con la oposición de los sectores conservadores.', [['Aprobar la reforma', { apr: 3, est: -1, con: 3 }], ['Aplazarla', { apr: -2, est: 1 }]], 'marruecos'],
    [2005, 5, 'x_indh', 'INICIATIVA NACIONAL PARA EL DESARROLLO HUMANO', 'El Gobierno lanza un gran plan contra la pobreza y la exclusión social.', [['Lanzar el plan con financiación estatal', { apr: 3, est: 2, eco: 1 }, 500], ['Apostar por la inversión privada', { eco: 2, apr: -1 }]], 'marruecos'],
    [2016, 10, 'x_hirak', 'MOVIMIENTO DEL «HIRAK» EN EL RIF', 'Las protestas en el norte tras la muerte de un pescador exigen empleo, hospitales y universidad.', [['Plan de inversión para el Rif', { apr: 3, est: 2 }, 500], ['Reprimir las protestas', { est: 1, apr: -5, con: -2 }]], 'marruecos'],
    [2020, 12, 'x_abraham', 'NORMALIZACIÓN CON ISRAEL Y EL SÁHARA', 'EE. UU. reconoce la soberanía marroquí sobre el Sáhara a cambio de normalizar las relaciones con Israel.', [['Aceptar el acuerdo', { apr: 1, con: 4, est: 1 }], ['Rechazarlo', { apr: 2, con: -3 }]], 'marruecos'],
    [2023, 9, 'x_sismo', 'TERREMOTO EN EL ATLAS', 'Un seísmo devastador golpea la región de Marrakech y las montañas del Atlas.', [['Plan de reconstrucción y ayuda internacional', { apr: 3, est: 2, con: 3 }, 1200], ['Gestión solo con medios propios', { apr: -3, est: -2 }]], 'marruecos'],
    // ----- COREA DEL NORTE -----
    [2000, 6, 'x_cumbre', 'CUMBRE INTERCOREANA DE PIONYANG', 'Los líderes de las dos Coreas se reúnen por primera vez desde la guerra.', [['Abrir cooperación económica con el Sur', { eco: 3, con: 4, est: -1 }], ['Mantener la desconfianza', { est: 1, con: -2 }]], 'coreanorte'],
    [2002, 1, 'x_eje', 'DISCURSO DEL «EJE DEL MAL»', 'Washington incluye a Corea del Norte entre los Estados que amenazan la paz mundial.', [['Responder reanudando el programa nuclear', { mil: 4, con: -6, est: 1 }], ['Buscar un canal diplomático', { con: 3, apr: 1 }]], 'coreanorte'],
    [2010, 11, 'x_yeon', 'INCIDENTE DE YEONPYEONG', 'Artillería norcoreana bombardea una isla surcoreana y aumenta el riesgo de escalada.', [['Mostrar fuerza', { mil: 3, con: -5 }], ['Rebajar la tensión', { con: 2, est: 1 }]], 'coreanorte'],
    [2018, 6, 'x_singapur', 'CUMBRE DE SINGAPUR CON EE. UU.', 'Los líderes de Corea del Norte y EE. UU. se reúnen por primera vez.', [['Ofrecer una desnuclearización gradual', { con: 5, eco: 2, mil: -2 }], ['Negarse a ceder', { mil: 2, con: -2 }]], 'coreanorte']
  ];
  const addEv = () => {
    if (!Array.isArray(window.HIST_TL) || window.__epocaOK) return; window.__epocaOK = true;
    EV.forEach(e => window.HIST_TL.push([e[0], e[1], e[2], '*', e[3], e[4], {}, {}, e[5].map(o => [o[0], o[1] || {}, o[2] || 0, o[3] || 0]), e[6]]));
  };
  addEv();

  // ================= 2) FILTRO DE ANACRONISMOS =================
  const AN = [[/covid|pandemia|coronavirus|confinamiento|vacunas? contra/i, 2020], [/podemos|indignados|15-?M\b/i, 2011], [/\bvox\b|abascal/i, 2013], [/\bsumar\b|frente amplio|Yolanda D[ií]az/i, 2023],
    [/Ucrania|OTAN.{0,20}flanco este/i, 2014], [/Next ?Generation|fondos europeos de recuperaci/i, 2020], [/brexit/i, 2016], [/Trump/i, 2016], [/Biden/i, 2020], [/Feij[oó]o/i, 2022], [/Casado\b/i, 2018], [/S[aá]nchez/i, 2014], [/Rajoy/i, 2004],
    [/bitcoin|criptomoneda|blockchain/i, 2013], [/inteligencia artificial|ChatGPT|algoritmo generativo/i, 2022], [/redes sociales|influencer|streamer|youtuber|TikTok|Instagram/i, 2008], [/teletrabajo/i, 2019], [/\b5G\b/i, 2018], [/Netflix|HBO|streaming/i, 2010],
    [/Estado palestino|genocidio|Gaza/i, 2008], [/Airbnb|pisos tur[ií]sticos|alquiler tur[ií]stico/i, 2013], [/ayuda a la dependencia|ley de dependencia/i, 2006], [/matrimonio igualitario|matrimonio homosexual/i, 2004], [/amnist[ií]a/i, 2019],
    [/cambio clim[aá]tico|emergencia clim[aá]tica|descarbonizaci[oó]n/i, 2005], [/Fridays|Greta/i, 2018], [/\bm[oó]viles?\b|smartphone|\bapps?\b/i, 2007], [/Procés|proc[eé]s/i, 2012], [/Bildu/i, 2011]];
  const bad = o => {
    if (!o || !gameState.scenario || !gameState.scenario.hist) return false;
    if (/^(H_|B_|X_|EU_|GOV_)/.test(o.id || '')) return false;
    const y = yr(), txt = [o.title, o.desc, o.cat, o.text, o.headline].concat((o.options || []).map(p => p.text + ' ' + (p.news || ''))).filter(Boolean).join(' ');
    return AN.some(a => y < a[1] && a[0].test(txt));
  };
  function clean() {
    if (!(gameState.scenario && gameState.scenario.hist)) return;
    if (Array.isArray(gameState.decisions) && gameState.decisions.length) {
      const cur = gameState.decisions[gameState.currentDecisionIdx], keep = gameState.decisions.filter((d, i) => !bad(d) || d === cur);
      if (keep.length !== gameState.decisions.length && keep.length) { const k = keep.indexOf(cur); gameState.decisions = keep; gameState.currentDecisionIdx = k >= 0 ? k : 0; }
    }
    const e = gameState.activeDynamicEvent, n = gameState.activeNewsPopup;
    if (e && bad(e)) { gameState.activeDynamicEvent = null; try { if (e.id && gameState.triggeredDynamicEvents) gameState.triggeredDynamicEvents = gameState.triggeredDynamicEvents.filter(x => x !== e.id); } catch (x) { /* sin lista */ } if (gameState.gameSpeed === 0) gameState.gameSpeed = 1; try { render(); } catch (x) { /* sin render */ } }
    if (n && bad(n)) { gameState.activeNewsPopup = null; if (gameState.gameSpeed === 0) gameState.gameSpeed = 1; try { render(); } catch (x) { /* sin render */ } }
  }

  // ================= 3) UNIÓN EUROPEA =================
  const EU = () => gameState.eu2 || (gameState.eu2 = { inf: 50, cd: {}, funds: 0, strikes: 0, n: 0 });
  const isEU = () => !!(window.MC && MC.eu);
  const ACT = {
    cumbre: { n: 'Cumbre del Consejo Europeo', d: 'Defiende tu agenda en Bruselas: gana influencia y algo de aprobación.', cp: 3, cd: 60, inf: 8, fx: { apr: 2, con: 3 } },
    cohesion: { n: 'Pedir fondos de cohesión', d: 'Solicita ayudas regionales. Más probables si tu influencia es alta y cumples las reglas fiscales.', cp: 2, cd: 120, money: 1800 },
    alinear: { n: 'Alinearte con el eje franco-alemán', d: 'Ganas influencia y buena prensa en Europa, pero pierdes algo de autonomía.', cp: 1, cd: 45, inf: 5, fx: { est: 1, apr: -1 } },
    veto: { n: 'Vetar una directiva', d: 'Bloquea una norma que te perjudica. Gran golpe de efecto, pero cuesta influencia.', cp: 3, cd: 90, inf: -12, fx: { apr: 4, eco: 1 } }
  };
  window.euAct = function (k) {
    const E = EU(), a = ACT[k]; if (!a || !isEU()) return;
    if (day() - (E.cd[k] || -999) < a.cd) return toast('Todavía no puedes repetirlo (' + (a.cd - (day() - E.cd[k])) + ' días).', '#d9a726');
    if (cpGet() < a.cp) return toast('Necesitas ' + a.cp + ' de capital político.', '#ef4444');
    cpAdd(-a.cp); E.cd[k] = day();
    if (a.inf) E.inf = Math.max(0, Math.min(100, E.inf + a.inf));
    if (a.fx) Object.keys(a.fx).forEach(m => acc(m, a.fx[m]));
    if (a.money) {
      const ok = E.inf >= 40 && E.strikes < 2, amt = Math.round(a.money * sc() * (E.inf >= 65 ? 1.4 : 1));
      if (ok) { try { registerFinancialTransaction('Fondos europeos de cohesión', amt); } catch (e) { /* sin libro */ } E.funds += amt; acc('eco', 2); acc('emp', 1); toast('<b>Bruselas aprueba los fondos de cohesión</b><br><span class="text-xs">+' + amt + ' M€ para tu tesoro.</span>', '#10b981'); }
      else toast('<b>Bruselas rechaza tu solicitud</b><br><span class="text-xs">Tu influencia es baja o tienes expedientes abiertos. Mejora tu posición primero.</span>', '#ef4444');
    } else toast('<b>' + a.n + '</b><br><span class="text-xs">Influencia en la UE: ' + Math.round(E.inf) + '</span>', '#10b981');
    try { render(); } catch (e) { /* sin render */ }
  };
  function euMonth() {
    const E = EU(), m = gameState.metrics, debt = gameState.debt && gameState.debt.amount, tr = Number(gameState.treasury) || 0;
    E.inf += (50 - E.inf) * 0.03;
    if (tr < 0) { E.inf -= 1.5; }
    if (E.inf >= 65) { acc('eco', 0.25); acc('con', 0.2); } else if (E.inf <= 30) { acc('eco', -0.25); acc('con', -0.3); }
    E.inf = Math.max(0, Math.min(100, E.inf));
  }
  function euEvent() {
    if (!isEU() || gameState.activeDynamicEvent || gameState.activeNewsPopup || document.getElementById('xm-modal')) return;
    const E = EU(), pool = [
      ['EU_MFP', 'NEGOCIACIÓN DEL MARCO FINANCIERO PLURIANUAL', 'Se reparten los fondos europeos de los próximos siete años. Tu país puede pelear por más fondos o aceptar la propuesta de Bruselas.', [['Plantar cara y exigir más fondos', { eco: 3, apr: 2, con: -3 }, 0, 'inf', -6], ['Aceptar el paquete de la Comisión', { eco: 1, est: 1, con: 2 }, 0, 'inf', 4], ['Pactar con los países del sur', { eco: 2, con: 1 }, 0, 'inf', 2]]],
      ['EU_DEF', 'BRUSELAS ABRE UN EXPEDIENTE POR DÉFICIT EXCESIVO', 'La Comisión considera que tu déficit supera los límites del Pacto de Estabilidad. Debes presentar un plan de ajuste.', [['Plan de ajuste y recortes', { eco: -1, apr: -4, est: 1, con: 3 }, 0, 'inf', 6], ['Negociar más plazo', { apr: -1, con: -1 }, 0, 'inf', -3], ['Desafiar a Bruselas', { apr: 3, eco: -2, con: -5 }, 0, 'inf', -12]], 'def'],
      ['EU_INM', 'CUMBRE EUROPEA SOBRE MIGRACIÓN', 'Los Veintisiete discuten el reparto de refugiados y el control de fronteras exteriores.', [['Apoyar un reparto solidario', { apr: -1, con: 3, est: -1 }, 0, 'inf', 6], ['Exigir más ayuda a los países de la frontera', { apr: 2, est: 1, con: -1 }, 0, 'inf', -2], ['Blindar las fronteras nacionales', { apr: 3, est: 1, con: -3 }, 0, 'inf', -5]]],
      ['EU_ENE', 'CRISIS ENERGÉTICA Y MERCADO ÚNICO', 'Los precios de la energía se disparan y Bruselas plantea medidas comunes de compra y reservas.', [['Respaldar la compra conjunta de gas', { eco: 2, apr: 1, con: 2 }, 0, 'inf', 5], ['Medidas solo nacionales', { eco: 1, apr: 2, con: -2 }, 0, 'inf', -4]]],
      ['EU_SERV', 'DIRECTIVA DE LIBRE CIRCULACIÓN DE SERVICIOS', 'Una norma europea abriría tu mercado a competidores de otros países. Tus empresas protestan.', [['Aprobarla con salvaguardas', { eco: 2, emp: -1, con: 2 }, 0, 'inf', 4], ['Oponerte en el Consejo', { apr: 2, eco: -1, con: -2 }, 0, 'inf', -5]]],
      ['EU_FONDOS', 'BRUSELAS OFRECE FONDOS A CAMBIO DE REFORMAS', 'La Comisión ofrece ayudas si aplicas reformas laborales y de pensiones.', [['Aceptar las reformas y los fondos', { eco: 3, emp: 1, apr: -4, est: -1 }, 0, 'money', 1500], ['Rechazar las condiciones', { apr: 3, eco: -1, con: -2 }, 0, 'inf', -4]]]
    ];
    const deficit = (Number(gameState.treasury) || 0) < 0;
    const list = pool.filter(p => p[5] !== 'def' || deficit);
    if (!list.length || Math.random() > 0.55) return;
    const e = list[Math.floor(Math.random() * list.length)]; gameState.gameSpeed = 0;
    gameState.activeDynamicEvent = { id: e[0] + '_' + day(), cat: 'UNIÓN EUROPEA', title: e[1], desc: e[2], condition: () => true,
      options: e[3].map(o => ({ text: o[0], cost: o[2] || 0, stats: o[1] || {}, loyaltyImpact: {}, news: e[1] + ': ' + o[0] + '.', euk: o[3], euv: o[4] })) };
    try { render(); } catch (x) { /* sin render */ }
  }
  const _md = window.makeDecision;
  if (typeof _md === 'function') makeDecision = function (i) {
    const ev = gameState.activeDynamicEvent, o = ev && ev.options && ev.options[Number(i)];
    const r = _md.apply(this, arguments);
    try {
      if (o && o.euk === 'inf') { const E = EU(); E.inf = Math.max(0, Math.min(100, E.inf + o.euv)); toast('Influencia en la UE: ' + (o.euv >= 0 ? '+' : '') + o.euv, o.euv >= 0 ? '#10b981' : '#ef4444'); }
      if (o && o.euk === 'money') { const amt = Math.round(o.euv * sc()); registerFinancialTransaction('Fondos europeos condicionados', amt); }
    } catch (e) { console.error(e); }
    return r;
  };
  function euBanner() {
    const E = EU(), col = E.inf >= 65 ? '#10b981' : E.inf >= 35 ? '#d9a726' : '#ef4444';
    return '<div class="rounded px-3 py-3 mb-3 font-hoi-tech" style="border:1px solid ' + col + '66;background:' + col + '14"><div class="flex flex-wrap items-center gap-3 text-[12px]"><b style="color:' + col + '"><i class="fa-solid fa-star mr-1"></i>INFLUENCIA EN LA UE ' + Math.round(E.inf) + '/100</b>'
      + '<span>' + (E.inf >= 65 ? 'Con peso en Bruselas: +0,25 economía y +0,2 confianza al mes.' : E.inf <= 30 ? 'Aislado en Europa: −0,25 economía y −0,3 confianza al mes.' : 'Influencia media: sin bonus ni penalización.') + '</span><span>Fondos recibidos: <b>' + Math.round(E.funds) + ' M€</b></span></div>'
      + '<div class="text-[11px] mt-1" style="color:#94a3b8">Cada pocos meses Bruselas te plantea decisiones (fondos, déficit, migración, energía). Lo que decidas sube o baja tu influencia, y de ella dependen los fondos.</div>'
      + '<div class="flex flex-wrap gap-2 mt-2">' + Object.keys(ACT).map(k => { const a = ACT[k], w = Math.max(0, a.cd - (day() - (E.cd[k] || -999))); return '<button onclick="euAct(\'' + k + '\')" class="hoi-button px-2 py-1 rounded text-[11px] cursor-pointer" title="' + a.d + '" ' + (w ? 'style="opacity:.55"' : '') + '>' + a.n + ' · ' + a.cp + ' CP' + (w ? ' (' + w + ' d)' : '') + '</button>'; }).join('') + '</div></div>';
  }

  // ================= Enganches =================
  const _gt = window.gameTick;
  if (typeof _gt === 'function') gameTick = function () {
    const b = day(), r = _gt.apply(this, arguments);
    if (day() !== b && live()) { try { addEv(); clean(); const d = day(); if (isEU() && d % 30 === 20) euMonth(); if (isEU() && d % 80 === 55) euEvent(); } catch (e) { console.error(e); } }
    return r;
  };
  const _rt = window.renderTabContent;
  if (typeof _rt === 'function') renderTabContent = function () {
    const t = gameState.activeTab, h = _rt.apply(this, arguments);
    try { if (t === 'ue' && isEU()) return euBanner() + h; } catch (e) { console.error(e); }
    return h;
  };
  const _ss = window.selectScenario;
  if (typeof _ss === 'function') selectScenario = function () { gameState.eu2 = null; const r = _ss.apply(this, arguments); setTimeout(addEv, 0); return r; };
})();
