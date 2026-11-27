/* EMPRESA.JS — Prensa con consecuencias reales (imagen mediática y campañas), empresas e industria
   (decisiones sobre SEAT y demás grandes empresas de cada país) y fuerzas productivas ligadas a la demografía. */
(function () {
  'use strict';
  const cid = () => (window.CURRENT_COUNTRY && CURRENT_COUNTRY.id) || 'espana';
  const day = () => gameState.daysInOffice || 0;
  const M = () => gameState.metrics;
  const budget = () => { try { return (window.MC && MC.budget) || 100000; } catch (e) { return 100000; } };
  const toast = (h, c) => { try { goalsToast(h, c || '#d9a726'); } catch (e) { /* sin aviso */ } };
  const acc = (k, v) => { try { focusAccum(focusInit(), k, v); } catch (e) { try { focusMetricAdd(k, v); } catch (e2) { /* sin métricas */ } } };
  const cpGet = () => { try { goalsInit(); return gameState.goals.capital || 0; } catch (e) { return 0; } };
  const cpAdd = v => { try { goalsInit(); gameState.goals.capital = Math.max(0, Math.min(100, (gameState.goals.capital || 0) + v)); } catch (e) { /* sin capital */ } };
  const live = () => gameState.step === 4 && M();
  const money = (t, v) => { try { registerFinancialTransaction(t, v, 'economia'); } catch (e) { /* sin libro */ } };
  const clamp = v => Math.max(0, Math.min(100, v));

  // ================= PRENSA =================
  const PR = () => gameState.pr || (gameState.pr = { img: 50, cd: {}, n: 0 });
  const ACTS = {
    entrevista: { n: 'Entrevista en horario de máxima audiencia', d: 'Llegas a millones de hogares: sube tu imagen y tu aprobación.', cp: 3, cd: 20, img: 8, apr: 2 },
    rueda: { n: 'Rueda de prensa', d: 'Gratis, pero arriesgada: puedes lucirte o cometer un error.', cp: 0, cd: 10, img: 2, apr: 0.6, risk: 0.2 },
    campana: { n: 'Campaña institucional', d: 'Publicidad oficial sobre tus logros. Cuesta dinero pero mejora la imagen durante meses.', cp: 0, cd: 45, img: 6, apr: 2, eur: 600 },
    filtracion: { n: 'Filtración a medios afines', d: 'Sube tu apoyo al instante, pero si te pillan es un escándalo.', cp: 2, cd: 30, img: 3, apr: 3, risk: 0.3 },
    desmentido: { n: 'Desmentir una polémica', d: 'Contrarresta una mala racha de prensa: recupera imagen si está baja.', cp: 2, cd: 25, img: 10, apr: 0, only: 'low' }
  };
  window.prAct = function (k) {
    const P = PR(), a = ACTS[k]; if (!a) return;
    if (day() - (P.cd[k] || -999) < a.cd) { toast('Todavía no puedes repetir «' + a.n + '» (' + (a.cd - (day() - P.cd[k])) + ' días).', '#d9a726'); return; }
    if (a.cp && cpGet() < a.cp) { toast('Necesitas ' + a.cp + ' de capital político.', '#ef4444'); return; }
    if (a.only === 'low' && P.img >= 45) { toast('Tu imagen no está tan dañada como para desmentir nada.', '#d9a726'); return; }
    if (a.cp) cpAdd(-a.cp); if (a.eur) money('Campaña institucional de comunicación', -Math.round(a.eur * budget() / 100000));
    P.cd[k] = day(); P.n++;
    let img = a.img, apr = a.apr, bad = a.risk && Math.random() < a.risk;
    if (bad) { img = -a.img * 2; apr = -2; if (k === 'filtracion') acc('est', -2); }
    P.img = clamp(P.img + img); acc('apr', apr);
    try { const I = gameState.ini; if (I) { I.p++; I.tot++; } } catch (e) { /* sin iniciativa */ }
    toast(bad ? '<i class="fa-solid fa-circle-exclamation text-red-400"></i> <b>La jugada sale mal</b><br><span class="text-xs">' + a.n + ': la prensa lo vuelve en tu contra (imagen ' + Math.round(img) + ').</span>'
      : '<i class="fa-solid fa-newspaper text-emerald-400"></i> <b>' + a.n + '</b><br><span class="text-xs">Imagen +' + Math.round(img) + (apr ? ' · aprobación +' + apr : '') + '</span>', bad ? '#ef4444' : '#10b981');
    try { render(); } catch (e) { /* sin render */ }
  };
  function prMonth() {
    const P = PR(), eff = (P.img - 50) * 0.05;
    acc('apr', eff); if (P.img < 30) { acc('est', -0.6); acc('apr', -0.8); }
    if (P.img > 75) acc('est', 0.4);
    P.img = clamp(P.img + (50 - P.img) * 0.06);   // el recuerdo se desvanece
    if (P.img < 30 && day() % 90 === 30) toast('<i class="fa-solid fa-newspaper text-red-400"></i> <b>CRISIS DE IMAGEN</b><br><span class="text-xs">La prensa te es hostil: pierdes aprobación y estabilidad cada mes. Usa entrevistas, ruedas de prensa o desmentidos.</span>', '#ef4444');
  }
  function prBanner() {
    const P = PR(), eff = (P.img - 50) * 0.05, col = P.img >= 55 ? '#10b981' : P.img >= 35 ? '#d9a726' : '#ef4444';
    return '<div class="rounded px-3 py-2 mb-3 font-hoi-tech" style="border:1px solid ' + col + '66;background:' + col + '14"><div class="flex flex-wrap items-center gap-3 text-[11px]"><b style="color:' + col + '"><i class="fa-solid fa-newspaper mr-1"></i>IMAGEN EN PRENSA ' + Math.round(P.img) + '/100</b>'
      + '<span>efecto mensual en aprobación: <b>' + (eff >= 0 ? '+' : '') + eff.toFixed(2) + '</b>' + (P.img < 30 ? ' · <b style="color:#ef4444">crisis de imagen</b>' : '') + '</span></div>'
      + '<div class="flex flex-wrap gap-2 mt-2">' + Object.keys(ACTS).map(k => { const a = ACTS[k], w = Math.max(0, a.cd - (day() - (P.cd[k] || -999))); return '<button onclick="prAct(\'' + k + '\')" class="hoi-button px-2 py-1 rounded text-[10px] cursor-pointer" title="' + a.d + '" ' + (w ? 'style="opacity:.5"' : '') + '>' + a.n + (a.cp ? ' · ' + a.cp + ' CP' : '') + (a.eur ? ' · ' + a.eur + ' M€' : '') + (w ? ' (' + w + ' d)' : '') + '</button>'; }).join('') + '</div></div>';
  }

  // ================= EMPRESAS: decisiones sobre grandes empresas =================
  /* [id, título, descripción, opciones[[texto, stats, coste M€]]] */
  const BIZ = {
    espana: [
      ['b_seat', 'SEAT ANUNCIA UN AJUSTE DE PLANTILLA', 'La matriz amenaza con recortar producción y empleo en Martorell si no hay ayudas ni compromiso con la fábrica.', [['Plan de ayudas y compromiso de producción', { emp: 4, eco: 2, apr: 2 }, 900], ['Dejar que la empresa decida', { emp: -4, eco: -2, apr: -3 }, 0], ['Pactar un ERTE con los sindicatos', { emp: 1, apr: 1, est: 2 }, 300]]],
      ['b_vw', 'GIGAFACTORÍA DE BATERÍAS', 'Un gran grupo europeo quiere instalar una fábrica de baterías y pide suelo, energía barata y ayudas.', [['Aprobar las ayudas y la energía', { emp: 5, eco: 4, apr: 2 }, 1200], ['Pedir contrapartidas de empleo local', { emp: 2, eco: 1 }, 400], ['Rechazar: no a las subvenciones', { apr: 1, eco: -1 }, 0]]],
      ['b_ford', 'FORD ESTUDIA CERRAR ALMUSSAFES', 'La multinacional amenaza con deslocalizar la producción a otro país.', [['Ofrecer incentivos fiscales', { emp: 3, eco: 2 }, 700], ['Negociar un traspaso a otro fabricante', { emp: 1, eco: 1, apr: 1 }, 200], ['Dejar marchar la planta', { emp: -5, eco: -3, apr: -4 }, 0]]],
      ['b_tel', 'LA TELEFÓNICA Y LAS TELECOS PIDEN AYUDAS PARA LA FIBRA', 'El despliegue de fibra y 5G exige inversión masiva; el sector pide apoyo público.', [['Cofinanciar el despliegue', { eco: 3, emp: 2, apr: 1 }, 800], ['Dejarlo al mercado', { eco: 1, apr: -1 }, 0]]],
      ['b_inditex', 'MULTINACIONALES ESPAÑOLAS PIDEN SEGURIDAD JURÍDICA', 'Las grandes empresas con sede en España piden estabilidad fiscal para seguir invirtiendo aquí.', [['Pacto de estabilidad fiscal', { eco: 3, emp: 1 }, 0], ['Subir impuestos a grandes empresas', { apr: 3, eco: -3, emp: -1 }, 0]]]
    ],
    francia: [
      ['b_renault', 'RENAULT ANUNCIA CIERRES DE PLANTAS', 'La automoción francesa pierde cuota frente a la competencia extranjera.', [['Plan estatal de apoyo al coche eléctrico', { emp: 4, eco: 2, apr: 1 }, 1500], ['Aceptar el ajuste', { emp: -4, eco: -2, apr: -4 }, 0]]],
      ['b_airbus', 'AIRBUS PIDE APOYO PARA SU PRÓXIMO PROGRAMA', 'El gigante aeronáutico necesita financiación para nuevos aviones.', [['Financiar el programa con fondos públicos', { eco: 4, emp: 3, mil: 1 }, 1800], ['Dejar que lo financie el mercado', { eco: -1 }, 0]]],
      ['b_total', 'LAS PETROLERAS REPATRIAN BENEFICIOS', 'Los grandes grupos energéticos obtienen beneficios récord mientras suben los precios.', [['Impuesto extraordinario', { apr: 4, eco: -1 }, 0], ['Mantener las condiciones', { eco: 2, apr: -3 }, 0]]]
    ],
    alemania: [
      ['b_vw', 'CRISIS EN VOLKSWAGEN', 'El grupo plantea cerrar fábricas por la caída de ventas y la competencia asiática.', [['Rescate con avales públicos', { emp: 4, eco: 2, apr: 2 }, 2000], ['Pactar una reducción de jornada', { emp: 2, est: 2 }, 500], ['No intervenir', { emp: -5, eco: -3, apr: -4 }, 0]]],
      ['b_intel', 'INTEL Y LAS FÁBRICAS DE CHIPS', 'Una multinacional quiere construir una gran fábrica de semiconductores y pide subvenciones.', [['Conceder la subvención', { eco: 4, emp: 3 }, 2500], ['Rechazar el coste', { eco: -1 }, 0]]],
      ['b_siemens', 'EL MITTELSTAND PIDE ALIVIO ENERGÉTICO', 'Las pymes industriales alertan de que los precios de la energía las expulsan del mercado.', [['Precio industrial de la energía', { eco: 3, emp: 2, apr: 1 }, 1500], ['Mantener el mercado', { eco: -3, emp: -2 }, 0]]]
    ],
    rusia: [
      ['b_gazprom', 'GAZPROM Y LAS EXPORTACIONES DE ENERGÍA', 'El monopolio plantea subir precios del gas o priorizar el mercado interior.', [['Priorizar ingresos exteriores', { eco: 4, apr: -2, con: -3 }, 0], ['Gas barato para el consumo interno', { apr: 4, eco: -2 }, 0]]],
      ['b_avtovaz', 'AVTOVAZ PIDE UN RESCATE', 'El mayor fabricante de coches nacional pierde socios extranjeros.', [['Inyección de capital estatal', { emp: 4, eco: 1, apr: 2 }, 800], ['Dejar que se reestructure', { emp: -3, eco: -1 }, 0]]],
      ['b_oligarcas', 'LOS GRANDES EMPRESARIOS PIDEN GARANTÍAS', 'Los magnates del sector exigen seguridad para sus activos.', [['Pactar con ellos', { eco: 3, est: 1, apr: -2 }, 0], ['Recuperar el control estatal', { apr: 4, est: 1, eco: -3 }, 0]]]
    ],
    eeuu: [
      ['b_chips', 'LEY DE CHIPS E INDUSTRIA', 'Intel, TSMC y otros piden subvenciones para fabricar semiconductores en el país.', [['Aprobar el paquete de subvenciones', { eco: 4, emp: 3, mil: 1 }, 3000], ['Dejar el mercado libre', { eco: 1 }, 0]]],
      ['b_ford', 'DETROIT PIDE PROTECCIÓN FRENTE A LAS IMPORTACIONES', 'Ford, GM y Stellantis alertan de una competencia exterior desigual.', [['Aranceles al automóvil importado', { emp: 3, eco: 1, apr: 2, con: -3 }, 0], ['Libre comercio', { eco: 2, emp: -2, con: 2 }, 0]]],
      ['b_boeing', 'BOEING EN DIFICULTADES', 'Problemas de seguridad y producción amenazan al mayor exportador industrial.', [['Rescate y supervisión estatal', { eco: 2, emp: 2, apr: -1 }, 1500], ['No intervenir', { eco: -2, emp: -2, apr: 1 }, 0]]]
    ],
    marruecos: [
      ['b_renault', 'RENAULT Y LA INDUSTRIA DEL AUTOMÓVIL', 'Las plantas de Tánger y Kenitra piden más incentivos para ampliar su producción.', [['Ampliar zonas francas y ayudas', { emp: 5, eco: 4, apr: 2 }, 600], ['Mantener las condiciones', { eco: 1 }, 0]]],
      ['b_ocp', 'OCP Y LA INDUSTRIA DE LOS FOSFATOS', 'El gran grupo público propone invertir en fertilizantes y energías limpias.', [['Respaldar la inversión', { eco: 4, emp: 2 }, 700], ['Priorizar los dividendos al Estado', { eco: 1, apr: 1 }, 0]]],
      ['b_pymes', 'EL TEJIDO DE PYMES PIDE CRÉDITO', 'Los pequeños negocios piden acceso al crédito y menos burocracia.', [['Plan nacional de pymes', { emp: 4, eco: 2, apr: 2 }, 300], ['No intervenir', { emp: -1 }, 0]]]
    ],
    coreanorte: [
      ['b_zonas', 'EMPRESAS EXTRANJERAS EXPLORAN LAS ZONAS ESPECIALES', 'Inversores asiáticos tantean abrir fábricas a cambio de divisas y garantías.', [['Abrir una zona económica especial', { eco: 4, emp: 2, con: 3, est: -1 }, 0], ['Mantener el aislamiento', { est: 2, eco: -1 }, 0]]],
      ['b_minas', 'LAS EMPRESAS MINERAS DEL ESTADO PIDEN MODERNIZACIÓN', 'Carbón y minerales son la principal fuente de divisas.', [['Invertir en modernización', { eco: 3, emp: 2 }, 300], ['Exprimir la capacidad actual', { eco: 1, emp: -1 }, 0]]]
    ]
  };
  function bizEvent() {
    if (gameState.activeDynamicEvent || gameState.activeNewsPopup || document.getElementById('nuc-ov')) return;
    const pool = (BIZ[cid()] || BIZ.espana), B = gameState.biz || (gameState.biz = { seen: {} });
    if (Math.random() > 0.5) return;
    const left = pool.filter(e => !B.seen[e[0]]); const e = (left.length ? left : pool)[Math.floor(Math.random() * (left.length || pool.length))];
    if (!left.length) B.seen = {}; B.seen[e[0]] = true; gameState.gameSpeed = 0;
    const sc = budget() / 100000;
    gameState.activeDynamicEvent = { id: 'B_' + e[0], cat: 'EMPRESAS E INDUSTRIA', title: e[1], desc: e[2], condition: () => true,
      options: e[3].map(o => ({ text: o[0] + (o[2] ? ' (' + Math.round(o[2] * sc) + ' M€)' : ''), cost: Math.round((o[2] || 0) * sc), stats: o[1] || {}, loyaltyImpact: {}, news: e[1] + ': ' + o[0] + '.' })) };
    try { render(); } catch (x) { /* sin render */ }
  }

  // ================= FUERZAS PRODUCTIVAS (demografía → producción) =================
  function prod() {
    const D = gameState.demo; if (!D || !D.b) return;
    const pop = D.b.reduce((a, b) => a + b, 0) || 1, work = (D.b[1] + D.b[2] + D.b[3]) / pop, E = gameState.ec || {};
    const act = D.b[1] + D.b[2] + D.b[3];
    const tech = 1 + 0.06 * ((E.rnd || 0) + (E.fdi || 0) * 0.7 + (E.champ || 0) * 0.4);
    const pc = act * tech; if (!gameState.pc0) gameState.pc0 = pc;
    const rel = pc / gameState.pc0 - 1;
    const eco = Math.max(-1.5, Math.min(1.2, rel * 5)), emp = Math.max(-1, Math.min(0.8, (work - 0.62) * 5 + rel * 2)), est = Math.max(-0.8, Math.min(0.4, rel * 2 - Math.max(0, D.b[4] / pop - 0.2) * 5));
    acc('eco', eco); acc('emp', emp); acc('est', est);
    gameState.prodFx = { rel, eco, emp, est, act, tech, work };
  }
  function prodBanner() {
    const f = gameState.prodFx; if (!f) return '';
    const s = (v, n) => '<b style="color:' + (v >= 0 ? '#10b981' : '#ef4444') + '">' + (v >= 0 ? '+' : '') + v.toFixed(2) + '</b> ' + n;
    return '<div class="rounded px-3 py-2 mb-3 font-hoi-tech text-[11px]" style="border:1px solid #0ea5e966;background:#0ea5e914"><b style="color:#0ea5e9"><i class="fa-solid fa-industry mr-1"></i>FUERZAS PRODUCTIVAS</b> población activa ' + f.act.toFixed(1) + ' M (' + Math.round(f.work * 100) + ' %) · tecnología ×' + f.tech.toFixed(2) + ' · capacidad productiva ' + (f.rel >= 0 ? '+' : '') + (f.rel * 100).toFixed(1) + ' % → cada mes: ' + s(f.eco, 'economía') + ' · ' + s(f.emp, 'empleo') + ' · ' + s(f.est, 'estabilidad') + '<br><span style="color:#94a3b8">Si la población activa crece (natalidad, inmigración) y la invertes en I+D, inversión extranjera y empresas, el país produce más; si envejece o se queda sin trabajadores, la producción cae.</span></div>';
  }

  // ================= Enganches =================
  const _gt = window.gameTick;
  if (typeof _gt === 'function') gameTick = function () {
    const b = gameState.daysInOffice, r = _gt.apply(this, arguments);
    if (gameState.daysInOffice !== b && live()) {
      try { const d = day(); if (d % 30 === 7) prMonth(); if (d % 30 === 12) prod(); if (d % 75 === 40) bizEvent(); } catch (e) { console.error(e); }
    }
    return r;
  };
  const _rt = window.renderTabContent;
  if (typeof _rt === 'function') renderTabContent = function () {
    const t = gameState.activeTab, h = _rt.apply(this, arguments);
    try {
      if (t === 'media') return prBanner() + h;
      if (t === 'demo') return prodBanner() + h;
    } catch (e) { console.error(e); }
    return h;
  };
  // «Empresas e industria» como acceso rápido
  const hookEco = () => {
    const pop = document.getElementById('ux-pop'); if (!pop) return setTimeout(hookEco, 900);
    const mo = new MutationObserver(() => {
      if (pop.querySelector('#biz-box')) return; mo.disconnect();
      const d = document.createElement('div'); d.id = 'biz-box';
      d.innerHTML = '<button class="ux-mode" style="width:100%;margin-top:6px" onclick="ecoOpen()"><i class="fa-solid fa-industry"></i> Empresas e industria</button>';
      pop.appendChild(d); mo.observe(pop, { childList: true });
    });
    mo.observe(pop, { childList: true });
  };
  hookEco();
})();
