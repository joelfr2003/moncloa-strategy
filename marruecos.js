// =====================================================================
//  MOTOR DE LOS DOS PAÍSES (España y Marruecos): mismo juego, cada uno con su vocabulario.
//  Mapa de regiones/comunidades, presupuesto, decretos, Fuerzas Armadas, sucesos y diplomacia.
//  Entre los dos jugadores solo viajan mensajes: dinero, tratados, ataques, avisos y beneficios mutuos.
// =====================================================================
(function () {
  'use strict';
  const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const fm = n => Math.round(n).toLocaleString('es-ES');
  const dstr = d => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  const $ = id => document.getElementById(id);

  // ---------------- DATOS COMUNES ----------------
  const KINDS = {
    cyber:  { t: 'Ciberataque', ic: 'fa-bug', cost: 150, base: 35, fx: { eco: -3, est: -2, apr: -1 }, d: 'Paraliza servicios e infraestructuras digitales.' },
    naval:  { t: 'Bloqueo naval y aduanero', ic: 'fa-ship', cost: 250, base: 45, fx: { eco: -6, est: -1, apr: -2 }, d: 'Asfixia el comercio marítimo del rival.' },
    air:    { t: 'Ataque aéreo limitado', ic: 'fa-jet-fighter', cost: 600, base: 70, fx: { mil: -6, est: -4, apr: -3, eco: -2 }, units: 0.08, d: 'Golpe a instalaciones militares. Causa bajas.' },
    ground: { t: 'Incursión fronteriza', ic: 'fa-person-rifle', cost: 400, base: 60, fx: { est: -5, apr: -4, mil: -3 }, units: 0.1, d: 'Operación terrestre en la frontera.' }
  };
  const TR = {
    trade:  { t: 'Acuerdo comercial', ic: 'fa-handshake', d: 'Ambos ingresan 4 M€/día y ganan algo de economía.' },
    border: { t: 'Pacto fronterizo y migratorio', ic: 'fa-shield-halved', d: 'Ambos ganan estabilidad cada día.' },
    def:    { t: 'Alianza de defensa', ic: 'fa-jet-fighter-up', d: 'Maniobras conjuntas: ambos refuerzan su poder militar.' }
  };
  const LEVEL = { heavy: 1, mod: 0.5, rep: 0, tribute: 0.2 };
  const LTXT = { heavy: 'devastador', mod: 'moderado', rep: 'repelido', tribute: 'amortiguado con tributo' };

  // Aviso modal genérico (vive en <body>, no lo borra ningún render)
  window.__xb = [];
  function alertBox(title, html, buttons, color) {
    const old = $('x-alert'); if (old) old.remove();
    window.__xb = buttons.map(b => () => { const e = $('x-alert'); if (e) e.remove(); b[1](); });
    const o = document.createElement('div'); o.id = 'x-alert';
    o.style.cssText = 'position:fixed;inset:0;z-index:100050;background:rgba(0,0,0,.88);display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;';
    o.innerHTML = `<div class="hoi-box border-2 ${color || 'border-red-500'} max-w-lg w-full p-5 rounded space-y-3 shadow-2xl font-hoi-tech">
      <h2 class="font-hoi-header text-2xl ${color ? 'text-amber-400' : 'text-red-400'} uppercase tracking-wider">${title}</h2>
      <p class="text-xs text-slate-300 font-sans leading-relaxed">${html}</p>
      ${buttons.map((b, i) => `<button onclick="__xb[${i}]()" class="hoi-button w-full p-2.5 rounded text-xs text-left">${b[0]}</button>`).join('')}</div>`;
    document.body.appendChild(o);
  }

  // ---------------- NÚCLEO COMPARTIDO (lo usan España y Marruecos con su "adaptador") ----------------
  function core(A, send) {
    const C = { pend: {}, inc: {}, cd: {} };
    C.money = v => {
      if (A.tes() < v) return A.toast('Fondos insuficientes.');
      A.cash(-v, 'Ayuda a ' + A.other); send({ k: 'money', v }); A.log('Envías ' + fm(v) + ' M€ a ' + A.other + '.'); A.refresh();
    };
    C.request = v => { send({ k: 'req', v }); A.log('Solicitas ' + fm(v) + ' M€ de ayuda a ' + A.other + '.'); A.refresh(); };
    C.treaty = id => { if (A.tr[id]) return; send({ k: 'tr', id, st: 'prop' }); A.log('Propones a ' + A.other + ': ' + TR[id].t + '.'); A.refresh(); };
    C.launch = (kind, free) => {
      const K = KINDS[kind], id = Math.random().toString(36).slice(2, 7), power = K.base * (0.6 + A.mil() / 100);
      if (!free) {
        if (A.day() < (C.cd[kind] || 0)) return A.toast('Operación en enfriamiento.');
        if (A.tes() < K.cost) return A.toast('Fondos insuficientes (' + K.cost + ' M€).');
        A.cash(-K.cost, K.t + ' contra ' + A.other); C.cd[kind] = A.day() + 20;
      }
      send({ k: 'atk', id, kind, power }); A.log((free ? 'Contraataque: ' : 'Lanzas: ') + K.t + ' contra ' + A.other + '.'); A.refresh();
    };
    C.defend = (id, choice) => {
      const inc = C.inc[id]; if (!inc) return; delete C.inc[id];
      const K = KINDS[inc.kind], m = A.mil();
      if (choice === 'resist') { if (A.tes() >= 200) A.cash(-200, 'Refuerzo defensivo urgente'); else choice = 'passive'; }
      const defense = { resist: m + 30, passive: m * 0.5, counter: m * 0.8, pay: 0 }[choice];
      let level;
      if (choice === 'pay') { level = 'tribute'; A.cash(-300, 'Tributo a ' + A.other); }
      else { const r = inc.power / (defense + 10) * (0.8 + Math.random() * 0.4); level = r > 1.2 ? 'heavy' : r > 0.8 ? 'mod' : 'rep'; }
      const f = LEVEL[level];
      Object.keys(K.fx).forEach(s => A.add(s, K.fx[s] * f)); if (K.units) A.hit(K.units * f);
      A.log(K.t + ' de ' + A.other + ': impacto ' + LTXT[level] + '.');
      send({ k: 'res', id, kind: inc.kind, level, choice });
      if (choice === 'counter') C.launch(inc.kind, true);
      A.resume(); A.refresh();
    };
    C.onMsg = d => {
      if (d.k === 'money') { A.cash(d.v, 'Ayuda recibida de ' + A.other); A.log(A.other + ' te envía ' + fm(d.v) + ' M€.'); A.news('Ayuda de ' + A.other + ': +' + fm(d.v) + ' M€'); }
      else if (d.k === 'req') { A.pause(); alertBox('Petición de ayuda', A.other + ' solicita <b>' + fm(d.v) + ' M€</b> de ayuda económica.', [['Enviar ' + fm(d.v) + ' M€', () => { C.money(d.v); A.resume(); }], ['Rechazar', () => { A.log('Rechazas la petición de ' + A.other + '.'); A.resume(); A.refresh(); }]], 'border-amber-500'); }
      else if (d.k === 'tr' && TR[d.id]) {
        if (d.st === 'prop') { A.pause(); alertBox('Propuesta de tratado', A.other + ' propone: <b>' + TR[d.id].t + '</b>.<br>' + TR[d.id].d, [['Aceptar', () => { A.tr[d.id] = true; send({ k: 'tr', id: d.id, st: 'yes' }); A.log('Firmas: ' + TR[d.id].t + '.'); A.resume(); A.refresh(); }], ['Rechazar', () => { send({ k: 'tr', id: d.id, st: 'no' }); A.resume(); A.refresh(); }]], 'border-amber-500'); }
        else if (d.st === 'yes') { A.tr[d.id] = true; A.log(A.other + ' acepta: ' + TR[d.id].t + '.'); A.refresh(); }
        else A.log(A.other + ' rechaza: ' + TR[d.id].t + '.'), A.refresh();
      }
      else if (d.k === 'atk' && KINDS[d.kind]) {
        const K = KINDS[d.kind]; C.inc[d.id] = { kind: d.kind, power: d.power }; A.pause();
        if (A.sound) A.sound();
        alertBox('⚠ ' + A.other + ' TE ATACA', '<b>' + K.t + '</b>: ' + K.d + '<br>Potencia estimada del ataque: <b>' + Math.round(d.power) + '</b> · Tu defensa base: <b>' + Math.round(A.mil()) + '</b>. Decide ya:', [
          ['🛡 Resistir con todo (200 M€): defensa máxima', () => C.defend(d.id, 'resist')],
          ['😐 Aguantar sin gastar: defensa débil', () => C.defend(d.id, 'passive')],
          ['⚔ Contraatacar: defensa media y respondes gratis con lo mismo', () => C.defend(d.id, 'counter')],
          ['💰 Pagar tributo (300 M€): reduces el daño al mínimo', () => C.defend(d.id, 'pay')]]);
      }
      else if (d.k === 'res') {
        const K = KINDS[d.kind] || { t: 'Ataque' };
        if (d.level === 'rep') { A.add('mil', -3); A.add('apr', -2); A.log('Tu ' + K.t + ' fue REPELIDO por ' + A.other + ': pierdes prestigio.'); }
        else if (d.level === 'tribute') { A.cash(300, 'Tributo de ' + A.other); A.add('apr', 1); A.log(A.other + ' paga 300 M€ de tributo.'); }
        else { A.add('apr', d.level === 'heavy' ? 2 : 1); A.log('Tu ' + K.t + ' tuvo un impacto ' + LTXT[d.level] + ' sobre ' + A.other + '.'); }
        A.refresh();
      }
      else if (d.k === 'sync') { A.peer = d.s; A.light(); }
    };
    return C;
  }


  const REG_MA = [
    { id: 'tt', n: 'Tánger-Tetuán-Alhucemas', p: '90,10 150,8 165,40 100,48', x: 125, y: 30 },
    { id: 'or', n: 'Oriental', p: '165,40 150,8 240,15 300,70 285,160 215,140 190,95', x: 235, y: 80 },
    { id: 'fm', n: 'Fez-Mequinez', p: '100,48 165,40 190,95 215,140 170,150 110,110', x: 150, y: 100 },
    { id: 'rs', n: 'Rabat-Salé-Kenitra', p: '60,70 100,48 110,110 90,135 50,110', x: 78, y: 98 },
    { id: 'cs', n: 'Casablanca-Settat', p: '50,110 90,135 100,185 40,175', x: 68, y: 150 },
    { id: 'bm', n: 'Beni Mellal-Jenifra', p: '90,135 110,110 170,150 175,200 100,185', x: 128, y: 160 },
    { id: 'mk', n: 'Marrakech-Safi', p: '40,175 100,185 175,200 170,245 95,260 20,230', x: 100, y: 220 },
    { id: 'dt', n: 'Draa-Tafilalet', p: '170,150 215,140 285,160 270,250 170,245 175,200', x: 220, y: 200 },
    { id: 'sm', n: 'Souss-Massa', p: '20,230 95,260 170,245 160,295 70,300', x: 100, y: 275 },
    { id: 'gn', n: 'Guelmim-Uad Nun', p: '70,300 160,295 170,245 270,250 250,320 100,345', x: 170, y: 305 },
    { id: 'ly', n: 'El Aaiún-Saguía el Hamra', p: '100,345 250,320 235,400 40,410', x: 140, y: 372 },
    { id: 'dk', n: 'Dajla-Río de Oro', p: '40,410 235,400 215,455 20,455', x: 125, y: 430 }
  ];

  // =====================================================================
  //  DATOS DE CADA PAÍS (misma estructura, cada uno con su vocabulario)
  // =====================================================================
  const UN = n => [
    { id: 'inf', t: n[0], ic: 'fa-person-rifle', w: 1, cost: 8, up: 0.02 },
    { id: 'blind', t: n[1], ic: 'fa-truck-monster', w: 3, cost: 25, up: 0.05 },
    { id: 'air', t: n[2], ic: 'fa-jet-fighter', w: 5, cost: 60, up: 0.1 },
    { id: 'aa', t: n[3], ic: 'fa-satellite-dish', w: 2, cost: 30, up: 0.04 },
    { id: 'nav', t: n[4], ic: 'fa-anchor', w: 3, cost: 40, up: 0.06 }];
  const mkBud = (n, ic6) => [
    { id: 'edu', t: n[0], ic: 'fa-graduation-cap', cost: 1.5, fx: { apr: 0.0003, eco: 0.0002 } },
    { id: 'san', t: n[1], ic: 'fa-heart-pulse', cost: 1.5, fx: { apr: 0.0004, est: 0.0001 } },
    { id: 'seg', t: n[2], ic: 'fa-user-shield', cost: 1.5, fx: { est: 0.0005 } },
    { id: 'inf', t: n[3], ic: 'fa-road', cost: 1.5, fx: { eco: 0.0005 } },
    { id: 'agr', t: n[4], ic: 'fa-wheat-awn', cost: 1.5, fx: { eco: 0.0002, apr: 0.0002, est: 0.0002 } },
    { id: 'x6', t: n[5], ic: ic6, cost: 1.0, fx: { pal: 0.0006 } }];
  const DECS = [   // id, coste M€, capital, espera (días), efectos, efecto en todas las regiones, regalo al otro país
    ['green', 600, 5, 60, { eco: 3, apr: 2 }], ['edu', 400, 4, 60, { apr: 3, eco: 1 }], ['agua', 500, 4, 60, { eco: 2, est: 2 }],
    ['tren', 900, 6, 90, { eco: 4, apr: 2 }], ['vivi', 300, 3, 45, { apr: 4, est: 2 }], ['coal', 0, 6, 90, { coh: 15, apr: -2 }],
    ['inst', 100, 4, 60, { pal: 10 }], ['reg', 700, 6, 90, { est: 3, eco: 2 }, { est: 5 }],
    ['mundial', 800, 6, 90, { apr: 4, eco: 3 }, null, { eco: 1 }], ['gas', 700, 6, 90, { eco: 3 }, null, { eco: 2 }]];
  const mkDec = x => DECS.map(r => ({ id: r[0], cost: r[1], cap: r[2], cd: r[3], fx: r[4], regAll: r[5], give: r[6], t: x[r[0]][0], d: x[r[0]][1] }));
  const mkEv = x => x.map(e => ({ t: e[0], d: e[1], o: e[2] }));

  const R_ES = [['gal', 'Galicia', 'GAL', 0, 0], ['ast', 'Asturias', 'AST', 1, 0], ['cnt', 'Cantabria', 'CAN', 2, 0], ['pv', 'País Vasco', 'PV', 3, 0], ['nav', 'Navarra', 'NAV', 4, 0], ['cat', 'Cataluña', 'CAT', 6, 0],
    ['cyl', 'Castilla y León', 'CYL', 1, 1], ['rio', 'La Rioja', 'RIO', 3, 1], ['ara', 'Aragón', 'ARA', 5, 1], ['ext', 'Extremadura', 'EXT', 0, 2], ['mad', 'Comunidad de Madrid', 'MAD', 2, 2],
    ['clm', 'Castilla-La Mancha', 'CLM', 3, 2], ['val', 'Comunitat Valenciana', 'VAL', 5, 2], ['bal', 'Illes Balears', 'BAL', 6, 2], ['and', 'Andalucía', 'AND', 1, 3], ['mur', 'Región de Murcia', 'MUR', 4, 3],
    ['can', 'Canarias', 'CNR', 0, 4]].map(r => ({ id: r[0], n: r[1], s: r[2], g: [r[3], r[4]] }));

  const CFG = {
    MA: {
      key: 'ma', id: 'MA', name: 'Marruecos', other: 'España', flag: '🇲🇦', oflag: '🇪🇸', title: 'REINO DE MARRUECOS', coupled: false, income: 16,
      st: { eco: 'Economía', est: 'Estabilidad', apr: 'Aprobación', coh: 'Coalición', pal: 'Palacio' },
      tabs: { dec: 'Decisiones', dcr: 'Decretos y dahires', min: 'Consejo de Ministros', tes: 'Tesorería', fin: 'Finanzas y Bank Al-Maghrib', army: 'Militar (FAR)', dip: 'Relaciones exteriores', news: 'Prensa y registro' },
      decTitle: 'DECRETOS (Jefe del Gobierno y Palacio)', armyTitle: 'FUERZAS ARMADAS REALES (FAR)', mapHint: 'Pulsa una región para ver su estado, desplegar tropas o gestionar crisis. Esquema estratégico, no a escala.',
      fix: ['Diálogo e inversión (200 M€)', 'Desplegar fuerzas de seguridad'], vb: '0 0 320 465', regions: REG_MA,
      start: 'Asumes el gobierno del Reino de Marruecos.',
      fall: ['CAÍDA DEL GOBIERNO', 'El Palacio y la calle han acabado con tu Ejecutivo. Se forma un gobierno de transición: pierdes capital político y parte de la Tesorería.'],
      crises: ['Protestas sociales', 'Sequía local', 'Contrabando y crimen', 'Huelga general regional'],
      units: UN(['Infantería (FAR)', 'Blindados', 'Aviación (Fuerzas Aéreas Reales)', 'Defensa antiaérea', 'Marina Real']), u0: { inf: 60, blind: 20, air: 10, aa: 8, nav: 6 },
      bud: mkBud(['Educación', 'Sanidad (AMO)', 'Seguridad e Interior', 'Infraestructuras', 'Agricultura y agua (Plan Marruecos Verde)', 'Casa Real y protocolo'], 'fa-crown'),
      dec: mkDec({
        green: ['Plan Generación Verde', 'Renovables e industria verde.'], edu: ['Reforma educativa', 'Nuevo modelo escolar y universitario.'], agua: ['Desaladoras y trasvases', 'Seguridad hídrica frente a la sequía.'],
        tren: ['Alta velocidad Tánger–Marrakech', 'Gran obra ferroviaria (ONCF).'], vivi: ['Subsidio al pan y al butano', 'Caja de Compensación: alivio de precios.'],
        coal: ['Pacto de gobierno con el Istiqlal', 'Refuerza la coalición a costa de popularidad.'], inst: ['Discurso del Trono y gesto al Palacio', 'Gana la confianza del Rey.'],
        reg: ['Plan de regionalización avanzada', 'Más autonomía y estabilidad en todas las regiones.'], mundial: ['Preparar el Mundial 2030 con España', 'Sede compartida: beneficia a ambos.'],
        gas: ['Gasoducto Magreb–Europa con España', 'Energía compartida: beneficia a ambos.'] }),
      events: mkEv([
        ['Sequía y malas cosechas', 'Seis años de sequía hunden el campo y el pan se encarece.', [{ t: 'Importar cereal y subsidiar el pan (−400 M€)', tes: -400, fx: { apr: 4, eco: -1 } }, { t: 'Racionar el agua y dejar que ajuste el mercado', fx: { apr: -6, est: -3 }, reg: -8 }]],
        ['Protestas juveniles', 'Miles de jóvenes exigen sanidad, educación y empleo.', [{ t: 'Diálogo y reformas sociales (−300 M€)', tes: -300, fx: { apr: 6, est: 4 } }, { t: 'Mano dura y detenciones', fx: { est: -2, apr: -7, pal: 3 }, reg: -5 }]],
        ['Boom de los fosfatos', 'El precio mundial de los fosfatos y fertilizantes se dispara.', [{ t: 'Vender al mejor postor (+800 M€)', tes: 800, fx: { eco: 3 } }, { t: 'Reinvertir en la industria (+300 M€)', tes: 300, fx: { eco: 4, apr: 2 } }]],
        ['Crisis en la coalición', 'Un socio de gobierno amenaza con romper el pacto.', [{ t: 'Ceder carteras (−150 M€)', tes: -150, fx: { coh: 18, apr: -2 } }, { t: 'Resistir y arriesgar la mayoría', fx: { coh: -15, apr: 2 } }]],
        ['Terremoto en el Atlas', 'Un seísmo devasta varias provincias de montaña.', [{ t: 'Pedir ayuda urgente a España', fx: { apr: 3 }, ask: 500 }, { t: 'Gestionarlo en solitario (−700 M€)', tes: -700, fx: { apr: -2, est: -2 }, reg: 6 }]],
        ['El Rey exige resultados', 'Palacio presiona al Gobierno por el ritmo de las reformas.', [{ t: 'Presentar un plan ambicioso (−250 M€)', tes: -250, fx: { pal: 12, apr: -1 } }, { t: 'Defender la autonomía del Gobierno', fx: { pal: -12, apr: 3 } }]]])
    },
    ES: {
      key: 'es', id: 'ES', name: 'España', other: 'Marruecos', flag: '🇪🇸', oflag: '🇲🇦', title: 'REINO DE ESPAÑA', coupled: true, income: 0,
      st: { eco: 'Economía', est: 'Estabilidad', apr: 'Aprobación', coh: 'Apoyo parlamentario', pal: 'Confianza de la UE' },
      tabs: { dec: 'Decisiones', dcr: 'Reales Decretos', tes: 'Tesorería', army: 'Fuerzas Armadas', dip: 'Diplomacia con Marruecos', news: 'Registro' },
      decTitle: 'REALES DECRETOS (Consejo de Ministros)', armyTitle: 'FUERZAS ARMADAS (FAS)', mapHint: 'Pulsa una comunidad autónoma para ver su estado, desplegar efectivos o gestionar crisis. Esquema, no a escala.',
      fix: ['Mesa de diálogo y fondos autonómicos (200 M€)', 'Desplegar UME y fuerzas de seguridad'], vb: '0 0 320 230', regions: R_ES,
      start: 'Asumes la Presidencia del Gobierno del Reino de España.',
      fall: ['MOCIÓN DE CENSURA', 'El Congreso y la calle han acabado con tu Ejecutivo. Se forma un gobierno de transición: pierdes capital político.'],
      crises: ['Protestas sociales', 'Incendio forestal', 'Huelga general autonómica', 'Tensión territorial'],
      units: UN(['Infantería (Ejército de Tierra)', 'Carros de combate Leopard 2E', 'Ejército del Aire y del Espacio', 'Defensa antiaérea', 'Armada']), u0: { inf: 60, blind: 20, air: 10, aa: 8, nav: 6 },
      bud: mkBud(['Educación y FP', 'Sanidad (SNS)', 'Interior (Policía Nacional y Guardia Civil)', 'Infraestructuras (Fomento)', 'Agricultura y agua', 'Acción exterior y Unión Europea'], 'fa-earth-europe'),
      dec: mkDec({
        green: ['Plan de Transición Ecológica (PERTE)', 'Renovables e industria verde con fondos europeos.'], edu: ['Pacto de Estado por la Educación', 'Nuevo modelo escolar y universitario.'], agua: ['Plan Hidrológico y desaladoras', 'Seguridad hídrica frente a la sequía.'],
        tren: ['Corredor Mediterráneo y alta velocidad', 'Gran obra ferroviaria (Adif).'], vivi: ['Plan Estatal de Vivienda', 'Alquiler asequible y vivienda protegida.'],
        coal: ['Pacto de legislatura con los socios del Congreso', 'Refuerza la mayoría parlamentaria a costa de popularidad.'], inst: ['Cumbre en Bruselas y fondos Next Generation', 'Gana la confianza de las instituciones europeas.'],
        reg: ['Conferencia de Presidentes autonómicos', 'Nueva financiación autonómica: más estabilidad en todas las comunidades.'], mundial: ['Preparar el Mundial 2030 con Marruecos', 'Sede compartida: beneficia a ambos.'],
        gas: ['Gasoducto Medgaz con Marruecos', 'Energía compartida: beneficia a ambos.'] }),
      events: mkEv([
        ['Sequía e incendios forestales', 'Años de sequía y un verano de fuego arrasan el campo y varias comarcas.', [{ t: 'Declarar zona catastrófica y aprobar ayudas (−400 M€)', tes: -400, fx: { apr: 4, eco: -1 } }, { t: 'Dejar que actúen las comunidades por su cuenta', fx: { apr: -6, est: -3 }, reg: -8 }]],
        ['Protestas por la vivienda', 'Miles de jóvenes salen a la calle exigiendo vivienda, sanidad y empleo.', [{ t: 'Diálogo y reformas sociales (−300 M€)', tes: -300, fx: { apr: 6, est: 4 } }, { t: 'Mano dura y multas', fx: { est: -2, apr: -7, pal: -2 }, reg: -5 }]],
        ['Récord de turismo y energía solar', 'Llegada récord de visitantes y excedentes de energía renovable.', [{ t: 'Tasa turística y vender excedentes (+800 M€)', tes: 800, fx: { eco: 3 } }, { t: 'Reinvertir en la industria (+300 M€)', tes: 300, fx: { eco: 4, apr: 2 } }]],
        ['Crisis en el Gobierno de coalición', 'Un socio de gobierno amenaza con romper el pacto de legislatura.', [{ t: 'Ceder carteras (−150 M€)', tes: -150, fx: { coh: 18, apr: -2 } }, { t: 'Resistir y arriesgar la mayoría', fx: { coh: -15, apr: 2 } }]],
        ['DANA e inundaciones', 'Una gota fría devasta varias provincias mediterráneas.', [{ t: 'Pedir ayuda urgente a Marruecos', fx: { apr: 3 }, ask: 500 }, { t: 'Gestionarlo con el Fondo de Contingencia (−700 M€)', tes: -700, fx: { apr: -2, est: -2 }, reg: 6 }]],
        ['Bruselas exige ajustes', 'La Comisión Europea presiona por el déficit y el ritmo de las reformas.', [{ t: 'Presentar un plan de ajuste ambicioso (−250 M€)', tes: -250, fx: { pal: 12, apr: -1 } }, { t: 'Defender la autonomía fiscal', fx: { pal: -12, apr: 3 } }]]])
    }
  };

  // Las mismas crisis que en el juego español (SHOCK_POOL), adaptadas a Marruecos y a su escala de gasto
  CFG.MA.events = CFG.MA.events.concat(mkEv([
    ['Incendios en el Rif y el Medio Atlas', 'Varias provincias arden a la vez y piden ayuda urgente al Estado.', [{ t: 'Desplegar Protección Civil y las FAR (−120 M€)', tes: -120, fx: { est: 3, apr: 2 } }, { t: 'Dejar que actúen las provincias por su cuenta', fx: { est: -4, apr: -5 } }]],
    ['Huelga general', 'Las centrales sindicales convocan un paro nacional contra tu política laboral.', [{ t: 'Abrir el diálogo social (−10 M€)', tes: -10, fx: { apr: 2, eco: -2 } }, { t: 'Mantener la postura', fx: { est: -5, apr: -6, eco: -3 } }]],
    ['Escándalo de corrupción', 'Un informe del Tribunal de Cuentas señala a un alto cargo de tu entorno.', [{ t: 'Cesar al implicado', fx: { apr: -4 } }, { t: 'Negar y cerrar filas', fx: { apr: -9, est: -3, coh: -6 } }]],
    ['Inflación y presión sobre el dírham', 'Los precios se disparan y los inversores desconfían de la economía marroquí.', [{ t: 'Anunciar un plan de ajuste', fx: { eco: 3, apr: -5 } }, { t: 'Aguantar el pulso', fx: { eco: -6, apr: -2 } }]],
    ['Presión migratoria', 'Miles de personas se concentran en el norte y los servicios se saturan.', [{ t: 'Plan de acogida y refuerzo fronterizo (−270 M€)', tes: -270, fx: { est: 3, apr: -1 }, give: { est: 2 } }, { t: 'Relajar los controles sin más inversión', fx: { apr: 3, est: 1 }, give: { est: -4, apr: -2 } }]],
    ['Ciberataque a ministerios', 'Atacantes desconocidos paralizan sistemas críticos del Estado.', [{ t: 'Contratar respuesta de emergencia (−40 M€)', tes: -40, fx: { est: 2, mil: 1 } }, { t: 'Resolverlo con medios propios', fx: { eco: -5, est: -3 } }]],
    ['Crisis del butano y la energía', 'El gas y la luz se disparan y las familias no llegan a fin de mes.', [{ t: 'Subsidiar la factura energética (−900 M€)', tes: -900, fx: { eco: 2, apr: 3 } }, { t: 'Dejar actuar al mercado', fx: { eco: -6, apr: -3 } }]],
    ['Malestar en los cuarteles', 'Mandos de las FAR critican en privado tu gestión y hay descontento en la tropa.', [{ t: 'Ascensos y mejoras salariales (−210 M€)', tes: -210, fx: { mil: 6, apr: -1 } }, { t: 'Ignorar el malestar', fx: { mil: -8, est: -2, pal: -3 } }]]
  ]));

  Object.keys(CFG).forEach(k => CFG[k].events.forEach(e => { e.em = true; }));   // los sucesos anteriores son «eventos emergentes»
  CFG.MA.gap = [3, 6];   // como en España: una decisión de gobierno cada pocos días

  // Consejo de Ministros de Marruecos: ministerios de soberanía (el Palacio prefiere técnicos) y ministerios de coalición
  const PARTIES = ['RNI', 'PAM', 'Istiqlal', 'USFP', 'MP', 'PPS', 'UC', 'PJD'];
  const MIN = (id, t, ic, sov, stat, label, techs, defParty) => {
    if (!techs.some(x => x.p === 'Técnico')) techs = techs.concat([{ n: 'Técnico independiente', p: 'Técnico', fx: { [stat]: 1, pal: 1 }, pro: ['+1 ' + label + ', +1 Palacio'], con: ['Poca representación de la coalición'] }]);
    const cands = techs.concat(PARTIES.map(p => ({ n: 'Portavoz sectorial', p, fx: Object.assign({ coh: 1, apr: -0.5 }, { [stat]: 0.5 }, sov ? { pal: -1 } : {}),
      pro: ['+1 Coalición (representación)', '+0,5 ' + label], con: ['−0,5 Aprobación por falta de perfil técnico'].concat(sov ? ['−1 Palacio: no es de su confianza'] : []) })));
    return { id, t, ic, sov, cands, def: defParty ? cands.findIndex(c => c.n === 'Portavoz sectorial' && c.p === defParty) : 0 };
  };
  CFG.MA.ministers = [
    MIN('eco', 'Ministerio de Economía y Finanzas', 'fa-chart-pie', false, 'eco', 'Economía', [
      { n: 'Nadia Fettah Alaoui', p: 'RNI', fx: { eco: 1.5, apr: -1 }, pro: ['+1,5 Economía'], con: ['−1 Aprobación (ajustes impopulares)'] },
      { n: 'Técnico del Bank Al-Maghrib', p: 'Técnico', fx: { eco: 1, pal: 1 }, pro: ['+1 Economía, +1 Palacio'], con: ['Poco tirón político'] }]),
    MIN('int', 'Ministerio del Interior', 'fa-user-shield', true, 'est', 'Estabilidad', [
      { n: 'Abdelouafi Laftit', p: 'Técnico', fx: { est: 2, pal: 1, apr: -1 }, pro: ['+2 Estabilidad, +1 Palacio'], con: ['−1 Aprobación (mano dura)'] }]),
    MIN('def', 'Administración de Defensa Nacional', 'fa-shield', true, 'mil', 'Poder militar', [
      { n: 'Abdellatif Loudiyi', p: 'Técnico', fx: { mil: 2, pal: 1 }, pro: ['+2 Poder militar, +1 Palacio'], con: ['Sin control parlamentario'] }]),
    MIN('ext', 'Asuntos Exteriores y Cooperación Africana', 'fa-earth-africa', true, 'eco', 'Economía', [
      { n: 'Nasser Bourita', p: 'Técnico', fx: { pal: 1.5, eco: 0.5 }, pro: ['+1,5 Palacio, +0,5 Economía'], con: ['Diplomacia opaca para la coalición'] }]),
    MIN('hab', 'Habices y Asuntos Islámicos', 'fa-mosque', true, 'est', 'Estabilidad', [
      { n: 'Ahmed Toufiq', p: 'Técnico', fx: { pal: 1.5, est: 1 }, pro: ['+1,5 Palacio, +1 Estabilidad'], con: ['Poco margen para reformas'] }]),
    MIN('jus', 'Ministerio de Justicia', 'fa-scale-balanced', false, 'est', 'Estabilidad', [
      { n: 'Abdellatif Ouahbi', p: 'PAM', fx: { est: 1, coh: 1, apr: -0.5 }, pro: ['+1 Estabilidad y representación de la coalición'], con: ['−0,5 Aprobación por polémicas'] }]),
    MIN('edu', 'Educación Nacional y Deportes', 'fa-graduation-cap', false, 'apr', 'Aprobación', [
      { n: 'Mohamed Saad Berrada', p: 'Técnico', fx: { apr: 1, eco: 0.5 }, pro: ['+1 Aprobación, +0,5 Economía'], con: ['Poca base en la coalición'] }]),
    MIN('san', 'Sanidad y Protección Social', 'fa-hospital', false, 'apr', 'Aprobación', [
      { n: 'Amine Tahraoui', p: 'Técnico', fx: { apr: 1.5, est: 0.5 }, pro: ['+1,5 Aprobación, +0,5 Estabilidad'], con: ['Presupuesto limitado'] }])
  ];
  CFG.MA.parties = PARTIES;

  // Decisiones de gobierno (equivalentes a las «Decisión n.º» de España: dos salidas cada una)
  CFG.MA.events = CFG.MA.events.concat(mkEv([
    ['Déficit de la caja de pensiones (CMR)', 'Las alertas presupuestarias crecen: el sistema de jubilación de los funcionarios se acerca al agotamiento de sus reservas.', [{ t: 'Elevar progresivamente la edad de jubilación', fx: { eco: 3, apr: -5, coh: -3 } }, { t: 'Inyectar fondos públicos al sistema (−300 M€)', tes: -300, fx: { apr: 2, eco: -1 } }]],
    ['Reforma de la Mudawana (código de familia)', 'El Palacio y la sociedad civil debaten la actualización del derecho de familia.', [{ t: 'Impulsar una reforma amplia', fx: { apr: 4, pal: -3, coh: -4 } }, { t: 'Reforma parcial consensuada con los ulemas', fx: { apr: 1, pal: 2 } }]],
    ['Subida del salario mínimo (SMIG)', 'Los sindicatos piden recuperar poder adquisitivo tras la inflación.', [{ t: 'Subir el SMIG un 10%', fx: { apr: 4, eco: -2 } }, { t: 'Mantener el salario mínimo', fx: { apr: -3, eco: 1 } }]],
    ['Iniciativa de autonomía para el Sáhara', 'Madrid, París y Washington respaldan la propuesta marroquí. Hay que decidir cómo capitalizarla.', [{ t: 'Impulsarla con una ofensiva diplomática (−100 M€)', tes: -100, fx: { pal: 4, apr: 1 } }, { t: 'Mantener un perfil bajo', fx: { pal: -1 } }]],
    ['Obras del Mundial 2030', 'Los estadios y las infraestructuras de la sede compartida con España y Portugal van con retraso.', [{ t: 'Acelerar las obras (−500 M€)', tes: -500, fx: { eco: 3, apr: 2 } }, { t: 'Mantener un ritmo prudente', fx: { apr: -2, pal: -2 } }]],
    ['Refinería de La Samir', 'El país depende del exterior para abastecerse de combustible y la refinería lleva años parada.', [{ t: 'Reabrir con inversión pública (−400 M€)', tes: -400, fx: { eco: 3, est: 1 } }, { t: 'Seguir importando combustible', fx: { eco: -2, apr: -1 } }]],
    ['Gigafactorías de baterías en Kenitra', 'Un consorcio asiático ofrece instalar una planta de baterías para vehículos eléctricos.', [{ t: 'Aprobar incentivos fiscales (−200 M€)', tes: -200, fx: { eco: 4, apr: 1 } }, { t: 'Rechazar el proyecto', fx: { eco: -1, pal: 1 } }]],
    ['Regionalización avanzada', 'Las regiones reclaman competencias y fondos de los consejos regionales.', [{ t: 'Transferir competencias y presupuesto (−250 M€)', tes: -250, fx: { est: 2, coh: -2 }, reg: 6 }, { t: 'Mantener el control desde Rabat', fx: { coh: 2 }, reg: -5 }]],
    ['Instancia de Probidad y lucha anticorrupción', 'La sociedad exige transparencia tras varios casos de malversación.', [{ t: 'Reforzar la Instancia y publicar informes', fx: { apr: 3, coh: -3, pal: -1 } }, { t: 'Dejarlo como está', fx: { apr: -3 } }]],
    ['Protestas de la Generación Z', 'Jóvenes convocados por redes sociales exigen hospitales y escuelas antes que estadios.', [{ t: 'Reorientar gasto a sanidad y educación (−350 M€)', tes: -350, fx: { apr: 6, est: 3, pal: -1 } }, { t: 'Contención policial y detenciones', fx: { apr: -6, est: -2, pal: 2 } }]],
    ['Ley de huelga y diálogo social', 'Las centrales sindicales rechazan el proyecto de ley orgánica sobre el derecho de huelga.', [{ t: 'Retirarlo y negociar de nuevo', fx: { apr: 3, coh: -2 } }, { t: 'Aprobarlo en el Parlamento', fx: { apr: -4, eco: 1, coh: 3 } }]],
    ['Desalación y agua para el campo', 'Las reservas de las presas siguen bajo mínimos y los agricultores presionan.', [{ t: 'Acelerar las plantas desaladoras (−400 M€)', tes: -400, fx: { eco: 2, est: 2 } }, { t: 'Restringir el riego en las zonas más secas', fx: { est: -2, apr: -3, eco: 1 }, reg: -4 }]]
  ]));

  // =====================================================================
  //  MOTOR ÚNICO: el mismo juego para España y Marruecos
  //  ext = true → el reloj lo marca el juego principal; false → reloj propio (invitado online)
  // =====================================================================
  const DG = {};
  const bar = (v, c) => `<div class="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800"><div class="h-full ${c || (v >= 60 ? 'bg-emerald-500' : v >= 35 ? 'bg-amber-500' : 'bg-red-500')}" style="width:${clamp(v)}%"></div></div>`;

  function makeGame(cfg, ext, opt) {
    const key = cfg.key, H = 'DG.' + key + '.a.', U = cfg.units, cp = cfg.coupled;
    const g = { cfg, key, tab: 'dec', sel: null, up: false, tmr: null, syn: null, send: () => {}, refresh: () => {}, light: () => {}, a: {} };
    const S = g.S = {
      day: 1, date: new Date(2023, 0, 1), speed: 1, tes: 9000, cap: 30, m: { eco: 52, est: 60, apr: 55, coh: 60, pal: 65 },
      bud: Object.fromEntries(cfg.bud.map(b => [b.id, 50])), cd: {}, units: Object.assign({}, cfg.u0), ready: 70, tr: {}, log: [], evt: null, nextEvt: cfg.gap ? cfg.gap[0] : 30, lastEvt: -1, nDec: 0, debt: 98000, rate: 2.5, min: Object.fromEntries((cfg.ministers || []).map(m => [m.id, m.def])), over: 0, peer: null,
      reg: Object.fromEntries(cfg.regions.map(r => [r.id, { est: 55 + Math.round(Math.random() * 15), eco: 40 + Math.round(Math.random() * 20), gar: 0, crisis: null }]))
    };
    if (opt && opt.coal) { S.coal = opt.coal; S.m.coh = opt.coh; Object.assign(S.min, opt.mins); }
    // España comparte economía, estabilidad, aprobación, tesoro y capital con la partida principal
    const lk = k => cp && (k === 'eco' || k === 'est' || k === 'apr');
    const io = {
      get: k => (lk(k) ? ((gameState.metrics || {})[k] || 0) : S.m[k]),
      add: (k, v) => { if (lk(k)) { try { focusAccum(focusInit(), k, v); } catch (e) { focusMetricAdd(k, v); } } else S.m[k] = clamp(S.m[k] + v); },
      tes: () => (cp ? Number(gameState.treasury) || 0 : S.tes),
      pay: (v, why) => { if (!cp) S.tes += v; else if (why) registerFinancialTransaction(why, v, 'economia'); else gameState.treasury = (Number(gameState.treasury) || 0) + v; },
      cap: () => { if (!cp) return S.cap; goalsInit(); return gameState.goals.capital; },
      spend: v => { if (!cp) S.cap -= v; else { goalsInit(); gameState.goals.capital -= v; } }
    };
    g.io = io;
    const power = () => U.reduce((t, u) => t + S.units[u.id] * u.w, 0) * S.ready / 100 * (S.tr.def ? 1.1 : 1);
    const mil = () => clamp(power() / 3);
    g.mil = mil;
    const log = t => { S.log.unshift({ d: S.day, t }); S.log.length = Math.min(S.log.length, 30); if (cp) { try { addNewsToTicker(t, cfg.other); } catch (e) { /* sin teletipo */ } } };
    const toast = t => { const e = $('moro-toast'); if (!ext && e) { e.textContent = t; e.style.opacity = 1; setTimeout(() => { e.style.opacity = 0; }, 2500); } else { try { goalsToast(t, '#ef4444'); } catch (x) { /* sin toast */ } } };
    let sp = 1;
    const A = {
      name: cfg.name, other: cfg.other, get tr() { return S.tr; }, set peer(v) { S.peer = v; },
      mil, tes: io.tes, day: () => S.day, toast, cash: (v, why) => io.pay(v, why),
      add: (k, v) => { if (k === 'mil') S.ready = clamp(S.ready + v * 1.5); else io.add(k, v); },
      hit: f => { U.forEach(u => { S.units[u.id] = Math.max(0, Math.round(S.units[u.id] * (1 - f))); }); },
      log, news: () => {},
      pause: () => { if (!ext) { S.speed = 0; g.clock(); } else if (cp) { if ((gameState.gameSpeed || 0) > 0) sp = gameState.gameSpeed; try { setGameSpeed(0); } catch (e) { /* ya en pausa */ } } },
      resume: () => { if (!ext) { S.speed = 1; g.clock(); } else if (cp) { try { setGameSpeed(sp); } catch (e) { /* sin reloj */ } } },
      refresh: () => g.refresh(), light: () => g.light(), sound: () => { try { playSound('riot'); } catch (e) { /* sin sonido */ } }
    };
    g.A = A;
    const C = g.C = core(A, o => g.send(o));
    const baseMsg = C.onMsg;
    C.onMsg = d => {
      if (d.k === 'fx' && d.fx) { Object.keys(d.fx).forEach(k => A.add(k, +d.fx[k] || 0)); log(cfg.other + ': ' + (d.why || 'acuerdo') + ' te afecta.'); g.refresh(); } else baseMsg(d);
    };

    g.clock = () => {
      if (g.tmr) { clearInterval(g.tmr); g.tmr = null; }
      if (!ext && S.speed > 0 && !S.over) g.tmr = setInterval(g.tick, S.speed === 1 ? 1000 : S.speed === 2 ? 500 : 250);
      g.refresh();
    };
    g.stop = () => { if (g.tmr) clearInterval(g.tmr); if (g.syn) clearInterval(g.syn); g.tmr = g.syn = null; };
    g.syn = setInterval(() => { if (g.up) g.send({ k: 'sync', s: { eco: io.get('eco'), est: io.get('est'), apr: io.get('apr'), mil: mil(), tes: io.tes() } }); }, 4000);

    const regAll = f => cfg.regions.forEach(r => { S.reg[r.id].est = clamp(S.reg[r.id].est + f); });
    g.tick = () => {
      if (!ext && (S.evt != null || $('x-alert'))) return;
      S.day++; S.date.setDate(S.date.getDate() + 1);
      const m = S.m;
      cfg.bud.forEach(b => { const l = S.bud[b.id]; io.pay(-l / 50 * b.cost); Object.keys(b.fx).forEach(k => io.add(k, (l - 50) * b.fx[k])); });
      io.pay((cp ? 0 : cfg.income * (0.6 + m.eco / 100) - 1) - U.reduce((t, u) => t + S.units[u.id] * u.up, 0) * (cp ? 0.5 : 1));
      if (S.tr.trade) { io.pay(4); io.add('eco', 0.01); }
      if (S.tr.border) io.add('est', 0.012);
      if (!cp) { if (io.tes() < 0) { m.eco = clamp(m.eco - 0.08); m.apr = clamp(m.apr - 0.06); S.ready = clamp(S.ready - 0.05); } S.cap = Math.min(60, S.cap + 0.3); }
      S.ready = clamp(S.ready + (S.ready < 70 ? 0.03 : 0));
      let avg = 0;
      cfg.regions.forEach(r => { const q = S.reg[r.id]; q.est = clamp(q.est + q.gar * 0.04 - (q.crisis ? 0.35 : 0) + (io.get('apr') - 50) * 0.002 + (50 - q.est) * 0.002); q.eco = clamp(q.eco + (io.get('eco') - q.eco) * 0.003); avg += q.est; });
      avg /= cfg.regions.length; io.add('est', (avg - io.get('est')) * 0.02);
      if (!cp) { m.apr = clamp(m.apr + (m.eco - 50) * 0.002 + (m.est - 50) * 0.002 - 0.01); m.eco = clamp(m.eco + (Math.random() - 0.5) * 0.1 + (50 - m.eco) * 0.001); }
      m.coh = clamp(m.coh + (io.get('apr') - 55) * 0.003 - 0.005);
      m.pal = clamp(m.pal + (io.get('est') - 50) * 0.002 - (m.coh < 30 ? 0.03 : 0));
      Object.keys(S.cd).forEach(k => { if (S.cd[k] > 0) S.cd[k]--; });
      if (Math.random() < 0.008 + (io.get('est') < 40 ? 0.01 : 0)) {
        const r = cfg.regions[Math.floor(Math.random() * cfg.regions.length)], q = S.reg[r.id];
        if (!q.crisis) { q.crisis = cfg.crises[Math.floor(Math.random() * cfg.crises.length)]; log('Crisis en ' + r.n + ': ' + q.crisis + '.'); }
      }
      if (S.evt == null && S.day >= S.nextEvt) { const dp = cfg.events.map((x, i) => (x.em ? -1 : i)).filter(i => i >= 0), ep = cfg.events.map((x, i) => (x.em ? i : -1)).filter(i => i >= 0), pool = dp.length && Math.random() > 0.25 ? dp : ep; let pick; do { pick = pool[Math.floor(Math.random() * pool.length)]; } while (pick === S.lastEvt && pool.length > 1); S.evt = S.lastEvt = pick; if (!cfg.events[pick].em) S.nDec++; S.nextEvt = S.day + (cfg.gap ? cfg.gap[0] + Math.floor(Math.random() * (cfg.gap[1] - cfg.gap[0])) : 45 + Math.floor(Math.random() * 40)); log('Suceso: ' + cfg.events[S.evt].t + '.'); toast('Nuevo suceso en ' + cfg.name + ': ' + cfg.events[S.evt].t); g.refresh(); }
      if (m.coh <= 0 || m.pal <= 0 || (!cp && (m.est <= 0 || m.apr <= 0))) { fall(); return; }
      if (cfg.ministers) {
        io.pay(-S.debt * S.rate / 100 / 365 * 0.3);
        if (S.day % 30 === 0) {
          const present = {};
          cfg.ministers.forEach(mi => { const c = mi.cands[S.min[mi.id]]; present[c.p] = 1; Object.keys(c.fx).forEach(k => A.add(k, c.fx[k] * 0.3)); });
          (S.coal || cfg.parties).forEach(pt => { m.coh = clamp(m.coh + (present[pt] ? 0.4 : -0.4)); });
          io.add('eco', (3 - S.rate) * 0.1); io.add('apr', (3 - S.rate) * 0.05);
        }
      }
      if (S.day % 5 === 0) g.light();
      if (S.day % 30 === 0) g.refresh();
    };
    function fall() {
      S.over++; if (!ext) { S.speed = 0; g.clock(); }
      alertBox(cfg.fall[0], cfg.fall[1], [['Empezar de nuevo desde la crisis', () => {
        S.m.coh = 45; S.m.pal = 50; if (!cp) { S.m.est = 45; S.m.apr = 45; S.tes -= Math.min(Math.max(S.tes, 0), 1500); S.cap = 5; } else { io.add('apr', -6); io.spend(Math.max(0, io.cap() - 5)); }
        log('Se forma un gobierno de transición.'); if (!ext) { S.speed = 1; g.clock(); } else g.refresh();
      }]]);
    }

    // ---------- acciones ----------
    const a = g.a;
    a.spd = n => { S.speed = n; g.clock(); };
    a.tab = k => { g.tab = k; g.refresh(); };
    a.sel = id => { g.sel = id; g.refresh(); };
    a.bud = (id, v) => { S.bud[id] = Math.round(+v); const e = $('bv-' + key + '-' + id); if (e) e.textContent = Math.round(+v) + '%'; };
    a.dec = id => {
      const x = cfg.dec.find(z => z.id === id); if (!x || (S.cd[id] || 0) > 0) return;
      if (io.cap() < x.cap) return toast('Capital político insuficiente.'); if (io.tes() < x.cost) return toast('Fondos insuficientes.');
      io.spend(x.cap); io.pay(-x.cost, x.cost ? x.t : null); S.cd[id] = x.cd;
      Object.keys(x.fx).forEach(k => { if (k === 'coh' || k === 'pal') S.m[k] = clamp(S.m[k] + x.fx[k]); else io.add(k, x.fx[k]); });
      if (x.regAll) regAll(x.regAll.est); if (x.give) g.send({ k: 'fx', fx: x.give, why: x.t });
      log('Aprobado: ' + x.t + '.'); g.refresh();
    };
    a.buy = (id, n) => {
      const u = U.find(z => z.id === id), c = u.cost * n; if (io.tes() < c) return toast('Fondos insuficientes.');
      io.pay(-c); S.units[id] += n; S.ready = clamp(S.ready - 1); log('Reclutas/compras: +' + n + ' ' + u.t + '.'); g.refresh();
    };
    a.train = () => { if (io.tes() < 200 || (S.cd.train || 0) > 0) return toast('No disponible.'); io.pay(-200); S.cd.train = 30; S.ready = clamp(S.ready + 12); log('Maniobras: la disponibilidad operativa sube.'); g.refresh(); };
    a.gar = (id, n) => {
      const q = S.reg[id]; if (n > 0 && S.units.inf - cfg.regions.reduce((t, r) => t + S.reg[r.id].gar, 0) < n) return toast('No quedan efectivos libres.');
      q.gar = Math.max(0, q.gar + n); g.refresh();
    };
    a.fix = (id, how) => {
      const q = S.reg[id]; if (!q.crisis) return;
      if (how === 'inv') { if (io.tes() < 200) return toast('Fondos insuficientes.'); io.pay(-200); q.est = clamp(q.est + 8); io.add('apr', 0.5); }
      else { if (q.gar < 3) return toast('Despliega al menos 3 efectivos en la zona.'); q.est = clamp(q.est + 5); io.add('apr', -1); }
      q.crisis = null; log('Crisis resuelta en ' + cfg.regions.find(r => r.id === id).n + '.'); g.refresh();
    };
    a.evt = i => {
      const e = cfg.events[S.evt], o = e && e.o[i]; if (!o) return;
      if (o.tes) io.pay(o.tes, e.t); Object.keys(o.fx || {}).forEach(k => A.add(k, o.fx[k])); if (o.reg) regAll(o.reg);
      if (o.give) g.send({ k: 'fx', fx: o.give, why: e.t }); if (o.ask) C.request(o.ask); log(e.t + ' → ' + o.t.replace(/ \(.*\)$/, '') + '.'); S.evt = null; g.refresh();
    };
    a.min = (id, i) => { S.min[id] = +i; log('Cambio en el Consejo de Ministros: ' + cfg.ministers.find(m => m.id === id).t + '.'); g.refresh(); };
    a.rate = v => { S.rate = +v; const e = $('rate-' + key); if (e) e.textContent = (+v).toFixed(2) + ' %'; };
    a.debt = n => {
      if (n > 0) { S.debt += n; io.pay(n, 'Emisión de deuda'); log('Emites ' + fm(n) + ' M€ de deuda.'); }
      else { if (io.tes() < -n) return toast('Fondos insuficientes.'); S.debt = Math.max(0, S.debt + n); io.pay(n, 'Amortización de deuda'); log('Amortizas ' + fm(-n) + ' M€ de deuda.'); }
      g.refresh();
    };
    a.money = v => C.money(v); a.req = v => C.request(v); a.tr = id => C.treaty(id); a.atk = k => C.launch(k);

    // ---------- interfaz ----------
    const box = (t, inner, col) => `<div class="hoi-box p-4 rounded space-y-2 font-hoi-tech"><div class="text-[11px] ${col || 'text-amber-400'} tracking-wider">${t}</div>${inner}</div>`;
    g.head = () => {
      const b = n => `<button onclick="${H}spd(${n})" class="${S.speed === n ? 'hoi-button-gold' : 'hoi-button'} px-2.5 py-1 rounded text-xs">${['⏸', '▶', '▶▶', '▶▶▶'][n]}</button>`;
      const st = Object.keys(cfg.st).map(k => `<div class="min-w-[90px]"><div class="flex justify-between text-[10px] text-slate-400"><span>${cfg.st[k]}</span><span id="h-${key}-${k}" class="font-mono">${Math.round(io.get(k))}</span></div>${bar(io.get(k))}</div>`).join('');
      return `<div class="hoi-box p-3 rounded space-y-2 font-hoi-tech"><div class="flex justify-between items-center flex-wrap gap-2"><span class="font-hoi-header text-2xl text-amber-400">${cfg.flag} ${cfg.title}</span>
        <span class="text-xs text-slate-300">${ext ? 'Día ' + S.day : '<span id="h-' + key + '-date">' + dstr(S.date) + '</span>'} · Tesoro <b id="h-${key}-tes" class="text-amber-300">${fm(io.tes())}</b> M€ · Capital <b id="h-${key}-cap">${Math.floor(io.cap())}</b> · Poder militar <b id="h-${key}-mil">${Math.round(mil())}</b></span>
        ${ext ? '' : '<span class="flex gap-1">' + [0, 1, 2, 3].map(b).join('') + '</span>'}</div><div class="flex gap-3 flex-wrap">${st}</div></div>`;
    };
    g.light = () => {
      const set = (id, v) => { const e = $('h-' + key + '-' + id); if (e) e.textContent = v; };
      set('date', dstr(S.date)); set('tes', fm(io.tes())); set('cap', Math.floor(io.cap())); set('mil', Math.round(mil()));
      Object.keys(cfg.st).forEach(k => set(k, Math.round(io.get(k))));
      if (g.tab === 'dip' && S.peer) g.refresh();
    };
    const TI = { dec: 'fa-gavel', dcr: 'fa-scroll', min: 'fa-users', tes: 'fa-coins', fin: 'fa-building-columns', army: 'fa-shield', dip: 'fa-globe', news: 'fa-newspaper' };
    g.tabs = () => `<div class="flex md:flex-col gap-1.5 flex-wrap">${Object.keys(cfg.tabs).map(k => `<button onclick="${H}tab('${k}')" class="${g.tab === k ? 'hoi-button-gold' : 'hoi-button'} px-3 py-2 rounded text-xs text-left md:w-full"><i class="fa-solid ${TI[k]} mr-2 w-4 text-center"></i>${cfg.tabs[k]}${k === 'dec' && S.evt != null ? ' <span class="text-red-400">●</span>' : ''}</button>`).join('')}</div>`;
    g.evtCard = () => {
      if (S.evt == null) return `<div class="hoi-box p-3 rounded font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">DECISIÓN DE GOBIERNO</div><div class="text-[11px] text-slate-500">Próxima decisión en ${Math.max(1, S.nextEvt - S.day)} días.</div></div>`; const e = cfg.events[S.evt];
      return `<div class="hoi-box p-4 rounded space-y-2 border border-sky-500/50 font-hoi-tech"><span class="self-start text-[11px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-bold">${e.em ? 'EVENTO EMERGENTE' : 'DECISIÓN N.º ' + S.nDec}</span><b class="block text-lg text-sky-300 uppercase">${e.t}</b><p class="text-[11px] text-slate-300 font-sans">${e.d}</p>${e.o.map((o, i) => `<button onclick="${H}evt(${i})" class="hoi-button w-full p-2 rounded text-[11px] text-left">${o.t}</button>`).join('')}</div>`;
    };
    const tMap = () => {
      const col = v => (v >= 60 ? '#10b981' : v >= 35 ? '#d9a726' : '#ef4444');
      const polys = cfg.regions.map(r => {
        const q = S.reg[r.id], on = g.sel === r.id, f = col(q.est), st = on ? '#fff' : '#0b0f12', sw = on ? 2.5 : 1.5, op = on ? 0.85 : 0.5;
        const dot = q.crisis ? `<text x="${r.g ? r.g[0] * 44 + 38 : r.x + 10}" y="${r.g ? r.g[1] * 44 + 20 : r.y - 8}" font-size="12" pointer-events="none">⚠</text>` : '';
        if (r.g) { const x = r.g[0] * 44 + 6, y = r.g[1] * 44 + 6; return `<rect x="${x}" y="${y}" width="40" height="40" rx="6" fill="${f}" fill-opacity="${op}" stroke="${st}" stroke-width="${sw}" style="cursor:pointer" onclick="${H}sel('${r.id}')"/><text x="${x + 20}" y="${y + 24}" text-anchor="middle" font-size="10" fill="#fff" pointer-events="none">${r.s}</text>${dot}`; }
        return `<polygon points="${r.p}" fill="${f}" fill-opacity="${op}" stroke="${st}" stroke-width="${sw}" style="cursor:pointer" onclick="${H}sel('${r.id}')"/>${dot}`;
      }).join('');
      let pan = `<div class="text-[11px] text-slate-500">${cfg.mapHint}</div>`;
      if (g.sel) {
        const r = cfg.regions.find(z => z.id === g.sel), q = S.reg[g.sel], free = S.units.inf - cfg.regions.reduce((t, z) => t + S.reg[z.id].gar, 0);
        pan = `<div class="space-y-2"><b class="text-sm text-amber-300">${r.n}</b>
          <div class="text-[11px] flex justify-between"><span>Estabilidad</span><span class="font-mono">${Math.round(q.est)}</span></div>${bar(q.est)}
          <div class="text-[11px] flex justify-between"><span>Economía</span><span class="font-mono">${Math.round(q.eco)}</span></div>${bar(q.eco)}
          <div class="text-[11px] flex justify-between items-center"><span>Efectivos desplegados: <b>${q.gar}</b> (libres ${free})</span><span class="flex gap-1"><button onclick="${H}gar('${g.sel}',-5)" class="hoi-button px-2 rounded">−5</button><button onclick="${H}gar('${g.sel}',5)" class="hoi-button px-2 rounded">+5</button></span></div>
          ${q.crisis ? `<div class="bg-red-950/50 border border-red-500/40 p-2 rounded text-[11px] space-y-1"><b class="text-red-300">⚠ ${q.crisis}</b><div class="flex gap-2 flex-wrap"><button onclick="${H}fix('${g.sel}','inv')" class="hoi-button px-2 py-1 rounded">${cfg.fix[0]}</button><button onclick="${H}fix('${g.sel}','tro')" class="hoi-button px-2 py-1 rounded">${cfg.fix[1]}</button></div></div>` : '<div class="text-[11px] text-emerald-400">Sin crisis activas.</div>'}</div>`;
      }
      return `<div class="grid grid-cols-1 md:grid-cols-2 gap-3"><div class="hoi-box p-3 rounded"><svg viewBox="${cfg.vb}" class="w-full max-h-[480px]">${polys}</svg></div><div class="space-y-3">${g.evtCard()}<div class="hoi-box p-4 rounded font-hoi-tech">${pan}</div></div></div>`;
    };
    const tTes = () => {
      const inc = cp ? 0 : cfg.income * (0.6 + io.get('eco') / 100) - 1, out = cfg.bud.reduce((t, b) => t + S.bud[b.id] / 50 * b.cost, 0) + U.reduce((t, u) => t + S.units[u.id] * u.up, 0) * (cp ? 0.5 : 1);
      const bud = cfg.bud.map(b => `<div><div class="flex justify-between text-[11px]"><span><i class="fa-solid ${b.ic} mr-1 text-amber-400"></i>${b.t}</span><span id="bv-${key}-${b.id}" class="font-mono">${S.bud[b.id]}%</span></div><input type="range" min="0" max="100" value="${S.bud[b.id]}" class="w-full" oninput="${H}bud('${b.id}',this.value)"></div>`).join('');
      return box('PRESUPUESTO · ' + (cp ? 'Gastos de este módulo ' + out.toFixed(1) + ' M€/día (los ingresos los gestiona la partida principal)' : 'Ingresos ' + inc.toFixed(1) + ' − Gastos ' + out.toFixed(1) + ' = <b class="' + (inc - out >= 0 ? 'text-emerald-400' : 'text-red-400') + '">' + (inc - out).toFixed(1) + ' M€/día</b>'), `<div class="space-y-2">${bud}</div>`);
    };
    const tDcr = () => {
      const dec = cfg.dec.map(x => { const cd = S.cd[x.id] || 0, off = cd > 0 || io.cap() < x.cap || io.tes() < x.cost; return `<button ${off ? 'disabled' : ''} onclick="${H}dec('${x.id}')" class="hoi-button p-2 rounded text-[11px] text-left ${off ? 'opacity-50' : ''}"><div><b>${x.t}</b> <span class="text-slate-400">· ${x.cost} M€ · ${x.cap} cap.</span></div><div class="text-slate-400 font-sans">${x.d}</div><div class="text-[10px] text-slate-500">${cd ? 'Disponible en ' + cd + ' días' : Object.keys(x.fx).map(k => (cfg.st[k] || k) + ' ' + (x.fx[k] > 0 ? '+' : '') + x.fx[k]).join(' · ')}${x.give ? ' · beneficia también a ' + cfg.other : ''}</div></button>`; }).join('');
      return box(cfg.decTitle, `<div class="grid grid-cols-1 md:grid-cols-2 gap-2">${dec}</div>`);
    };
    const tMin = () => {
      const cards = cfg.ministers.map(mi => {
        const sel = S.min[mi.id], c = mi.cands[sel];
        const opts = mi.cands.map((x, i) => (i === sel || x.p === 'Técnico' || (S.coal || cfg.parties).includes(x.p) ? `<option value="${i}" ${i === sel ? 'selected' : ''}>${x.n} (${x.p})</option>` : '')).join('');
        return `<div class="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2"><div class="text-[12px] text-amber-400 font-bold"><i class="fa-solid ${mi.ic} mr-1"></i>${mi.t} ${mi.sov ? '<span class="text-[9px] text-sky-300 font-normal">· soberanía</span>' : ''}</div>
          <select class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-[12px]" onchange="${H}min('${mi.id}',this.value)">${opts}</select>
          <div class="bg-slate-900 border border-slate-800 rounded p-2 text-[11px] space-y-1"><div class="flex justify-between"><b class="text-amber-300">${c.n}</b><span class="text-[9px] bg-slate-800 px-1.5 rounded">${c.p}</span></div>${c.pro.map(t => `<div class="text-emerald-400">✓ ${t}</div>`).join('')}${c.con.map(t => `<div class="text-red-400">✗ ${t}</div>`).join('')}</div>
          ${mi.sov ? '<div class="text-[10px] text-slate-500">El Palacio prefiere un técnico de su confianza.</div>' : ''}</div>`;
      }).join('');
      return box('CONSEJO DE MINISTROS DEL GOBIERNO', `<p class="text-[11px] text-slate-400 font-sans">Cada mes los ministros aplican sus efectos de forma atenuada. Los socios con ministerios ganan lealtad; los que no tienen ninguno, la pierden.</p><div class="grid grid-cols-1 md:grid-cols-2 gap-3">${cards}</div>`);
    };
    const tFin = () => {
      const ratio = S.debt / 1400, daily = S.debt * S.rate / 100 / 365 * 0.3;
      const bt = (n, l) => `<button onclick="${H}debt(${n})" class="hoi-button px-3 py-1.5 rounded text-xs">${l}</button>`;
      return box('FINANZAS Y DEUDA PÚBLICA', `<div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">${[['Deuda', fm(S.debt) + ' M€'], ['Deuda/PIB', ratio.toFixed(1) + ' %'], ['Intereses', daily.toFixed(1) + ' M€/día'], ['Tesoro', fm(io.tes()) + ' M€']].map(([l, v]) => `<div class="bg-slate-950 border border-slate-800 rounded p-2"><div class="text-slate-400">${l}</div><b class="font-mono ${l === 'Deuda/PIB' && ratio > 85 ? 'text-red-400' : ''}">${v}</b></div>`).join('')}</div>
        <div class="flex gap-2 flex-wrap">${bt(500, 'Emitir 500 M€')}${bt(1000, 'Emitir 1.000 M€')}${bt(-500, 'Amortizar 500 M€')}${bt(-1000, 'Amortizar 1.000 M€')}</div>`)
        + box('BANK AL-MAGHRIB · TIPO DIRECTOR', `<div class="flex justify-between text-[11px]"><span>Tipo de interés</span><b id="rate-${key}" class="font-mono">${S.rate.toFixed(2)} %</b></div><input type="range" min="1" max="6" step="0.25" value="${S.rate}" class="w-full" oninput="${H}rate(this.value)"><div class="text-[10px] text-slate-500 font-sans">Tipos bajos impulsan la economía y la aprobación pero encarecen el ahorro; el banco central actúa con autonomía, así que cada mes el efecto es pequeño. Los intereses de la deuda dependen del tipo.</div>`);
    };
    const tArmy = () => {
      const dep = cfg.regions.reduce((t, r) => t + S.reg[r.id].gar, 0);
      const rows = U.map(u => `<div class="flex justify-between items-center text-[11px] bg-slate-950 border border-slate-800 rounded p-2"><span><i class="fa-solid ${u.ic} mr-1 text-amber-400"></i><b>${u.t}</b> · ${S.units[u.id]} uds · ${u.cost} M€/ud</span><span class="flex gap-1"><button onclick="${H}buy('${u.id}',1)" class="hoi-button px-2 rounded">+1</button><button onclick="${H}buy('${u.id}',5)" class="hoi-button px-2 rounded">+5</button></span></div>`).join('');
      return box(cfg.armyTitle + ' · Poder ' + Math.round(power()) + ' · Disponibilidad ' + Math.round(S.ready) + '% · Desplegados ' + dep + '/' + S.units.inf,
        `${rows}<button onclick="${H}train()" class="hoi-button p-2 rounded text-xs ${(S.cd.train || 0) > 0 || io.tes() < 200 ? 'opacity-50' : ''}">Maniobras (200 M€): +12% disponibilidad${(S.cd.train || 0) > 0 ? ' · espera ' + S.cd.train + ' d' : ''}</button>`);
    };
    const tDip = () => {
      const p = S.peer;
      const st = p ? `<div class="grid grid-cols-2 md:grid-cols-5 gap-2 text-[11px]">${[['Economía', 'eco'], ['Estabilidad', 'est'], ['Aprobación', 'apr'], ['Militar', 'mil'], ['Tesoro (M€)', 'tes']].map(([l, k]) => `<div class="bg-slate-950 border border-slate-800 rounded p-2"><div class="text-slate-400">${l}</div><b class="font-mono">${fm(p[k] || 0)}</b></div>`).join('')}</div>` : '<div class="text-[11px] text-slate-500">Sin datos de ' + cfg.other + ' todavía…</div>';
      const trs = Object.keys(TR).map(id => `<button ${S.tr[id] ? 'disabled' : ''} onclick="${H}tr('${id}')" class="hoi-button p-2 rounded text-[11px] text-left ${S.tr[id] ? 'opacity-50' : ''}"><i class="fa-solid ${TR[id].ic} mr-1 text-emerald-400"></i><b>${TR[id].t}</b> ${S.tr[id] ? '· ACTIVO' : ''}<div class="text-slate-400 font-sans">${TR[id].d}</div></button>`).join('');
      const atk = Object.keys(KINDS).map(k => `<button onclick="${H}atk('${k}')" class="hoi-button p-2 rounded text-[11px] text-left border-red-500/40"><i class="fa-solid ${KINDS[k].ic} mr-1 text-red-400"></i><b>${KINDS[k].t}</b> <span class="text-slate-400">· ${KINDS[k].cost} M€</span><div class="text-slate-400 font-sans">${KINDS[k].d}</div></button>`).join('');
      const aid = [250, 500, 1000].map(v => `<button onclick="${H}money(${v})" class="hoi-button px-3 py-1.5 rounded text-xs">Enviar ${v} M€</button><button onclick="${H}req(${v})" class="hoi-button px-3 py-1.5 rounded text-xs text-sky-300">Pedir ${v} M€</button>`).join('');
      return box(cfg.oflag + ' ' + cfg.other.toUpperCase() + ' ' + (g.up ? '<span class="text-emerald-400">● conectado</span>' : '<span class="text-red-400">○ sin conexión</span>'), `<div id="dip-${key}">${st}</div>`)
        + box('AYUDA ECONÓMICA', `<div class="flex gap-2 flex-wrap">${aid}</div>`) + box('TRATADOS (requieren aceptación)', `<div class="grid grid-cols-1 md:grid-cols-3 gap-2">${trs}</div>`)
        + box('OPERACIONES HOSTILES (' + cfg.other + ' recibirá el aviso y podrá defenderse)', `<div class="grid grid-cols-1 md:grid-cols-2 gap-2">${atk}</div>`, 'text-red-400');
    };
    const tNews = () => box('REGISTRO DEL GOBIERNO', S.log.map(x => `<div class="text-[11px] text-slate-400"><span class="text-slate-600 font-mono">día ${x.d}</span> · ${x.t}</div>`).join('') || '<div class="text-[11px] text-slate-600">Sin movimientos.</div>');
    g.render = () => {
      const T = { dec: tMap, dcr: tDcr, min: cfg.ministers && tMin, tes: tTes, fin: cfg.ministers && tFin, army: tArmy, dip: tDip, news: tNews };
      if (!T[g.tab]) g.tab = 'dec';
      const pend = S.evt != null && g.tab !== 'dec' ? `<div class="hoi-box p-2 rounded border border-red-500/50 text-[11px] font-hoi-tech flex justify-between items-center"><span class="text-red-300">⚠ Tienes una decisión de gobierno pendiente.</span><button onclick="${H}tab('dec')" class="hoi-button px-2 py-1 rounded">Ir a Decisiones</button></div>` : '';
      return `<div class="max-w-6xl mx-auto space-y-3">${g.head()}${pend}<div class="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3"><div>${g.tabs()}</div><div class="space-y-3">${T[g.tab]()}</div></div></div>`;
    };
    log((opt && opt.msg) || cfg.start);
    return g;
  }

  // =====================================================================
  //  DUEL: une los dos juegos (en línea o en el mismo dispositivo)
  // =====================================================================

  // Cámara de Representantes (395 escaños, resultados de 2021): la mayoría absoluta está en 198
  const SEATS = [['RNI', 102, '#1d6fd1'], ['PAM', 87, '#8a5a2b'], ['Istiqlal', 81, '#c0392b'], ['USFP', 34, '#e84a5f'], ['MP', 28, '#2e9e5b'], ['PPS', 22, '#d4a017'], ['UC', 18, '#7f8c8d'], ['PJD', 13, '#16a085'], ['Otros', 10, '#475569']];
  const SEAT = Object.fromEntries(SEATS.map(x => [x[0], x[1]]));
  function mkCoal(names) {
    const seats = SEAT.RNI + names.reduce((t, n) => t + (SEAT[n] || 0), 0), maj = seats >= 198;
    const coh = clamp(maj ? 55 + (seats - 198) / 197 * 25 : 25 + seats / 198 * 25), pref = { jus: 'PAM', edu: 'PJD', san: 'USFP' }, mins = {};
    CFG.MA.ministers.forEach(mi => {
      let idx = mi.def;
      if (pref[mi.id]) { const want = names.includes(pref[mi.id]) ? pref[mi.id] : names[0], i = want ? mi.cands.findIndex(c => c.p === want) : -1; idx = i >= 0 ? i : mi.cands.findIndex(c => c.p === 'Técnico'); }
      mins[mi.id] = idx;
    });
    return { coal: ['RNI'].concat(names), seats, coh, mins,
      msg: maj ? 'Aziz Akhannouch (RNI) forma un Gobierno de coalición con ' + names.join(', ') + ' (' + seats + '/395).' : 'Aziz Akhannouch (RNI) forma Gobierno en minoría (' + seats + '/395): la coalición arranca débil.' };
  }

  const sendOut = o => { try { if (window.MP && MP.sendX) MP.sendX(o); } catch (e) { /* sin enlace */ } };
  const DUEL = { mode: null, turn: 'es', q: { es: [], ma: [] } };
  const redraw = () => { if (window.gameState && gameState.activeTab === 'mp') { try { render(); } catch (e) { /* aún no */ } } };
  function mkES() {
    if (DG.es) return DG.es;
    const g = DG.es = makeGame(CFG.ES, true); g.send = sendOut; g.refresh = redraw; g.light = redraw; return g;
  }
  function deliver(to, o) {
    if (DUEL.turn === to) DG[to].C.onMsg(o);
    else { if (o.k === 'sync') DUEL.q[to] = DUEL.q[to].filter(x => x.k !== 'sync'); DUEL.q[to].push(o); }
  }
  DUEL.startOnline = () => { DUEL.reset(); DUEL.mode = 'online'; mkES(); };
  DUEL.startLocal = () => {
    DUEL.reset(); DUEL.mode = 'local'; DUEL.turn = 'es';
    const e = mkES(), m = DG.ma = makeGame(CFG.MA, true, mkCoal(['PAM', 'Istiqlal'])); m.refresh = redraw; m.light = redraw;
    e.up = m.up = true; e.send = o => deliver('ma', o); m.send = o => deliver('es', o);
  };
  DUEL.ensure = () => { if (!DUEL.mode && window.gameState && gameState.mp) { if (gameState.mp.mode === 'local') DUEL.startLocal(); else DUEL.startOnline(); } };
  DUEL.swap = () => {
    const was = DUEL.turn; DUEL.turn = was === 'es' ? 'ma' : 'es';
    const q = DUEL.q[DUEL.turn]; DUEL.q[DUEL.turn] = []; setTimeout(() => q.forEach(o => DG[DUEL.turn].C.onMsg(o)), 300);
    return CFG[DUEL.turn.toUpperCase()];
  };
  DUEL.reset = () => { Object.keys(DG).forEach(k => { if (DG[k] && DG[k].stop) DG[k].stop(); delete DG[k]; }); DUEL.mode = null; DUEL.turn = 'es'; DUEL.q = { es: [], ma: [] }; };
  DUEL.active = () => { DUEL.ensure(); return DUEL.mode === 'local' ? DG[DUEL.turn] : mkES(); };
  DUEL.panel = top => top + DUEL.active().render();
  DUEL.pending = () => (DUEL.mode ? Object.keys(DG).reduce((n, k) => n + (DG[k].S.evt != null ? 1 : 0), 0) : 0);
  DUEL.daily = () => { try { mkES().tick(); if (DUEL.mode === 'local' && DG.ma) DG.ma.tick(); } catch (e) { console.error(e); } };
  window.DUEL = DUEL; window.DG = DG;

  // Lado anfitrión (España) en una sala en línea
  window.ESX = {
    get up() { return !!(DG.es && DG.es.up); },
    linked: up => { const g = mkES(); g.up = up; if (up) g.A.log('Marruecos se ha conectado: ya podéis interactuar.'); else g.S.peer = null; g.refresh(); },
    onMsg: d => { if (DUEL.mode === 'online') mkES().C.onMsg(d); }
  };

  // Lado invitado (Marruecos) en una sala en línea: pantalla propia a pantalla completa
  const MORO = window.MORO = {};
  function mrender() {
    const r = $('moro-root'), g = DG.ma; if (!r || !g) return;
    r.innerHTML = `<div class="flex justify-between items-center mb-2 font-hoi-tech text-xs text-slate-300"><span>Sala <b class="text-amber-300">${MORO.code || ''}</b> · ${g.up ? '<span class="text-emerald-400">conectado con España</span>' : '<span class="text-red-400">CONEXIÓN PERDIDA</span>'}</span><button onclick="MP.leave()" class="hoi-button px-3 py-1 rounded">Salir</button></div>${g.render()}<div id="moro-toast" style="position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:#7f1d1d;color:#fff;padding:8px 14px;border-radius:8px;font-size:12px;opacity:0;transition:opacity .3s;z-index:100060"></div>`;
  }
  MORO.coal = { PAM: 1, Istiqlal: 1 };
  function msetup() {
    const r = $('moro-root'); if (!r) return;
    const names = Object.keys(MORO.coal).filter(k => MORO.coal[k]), c = mkCoal(names), maj = c.seats >= 198;
    const bar = SEATS.map(([n, v, col]) => `<div title="${n}: ${v}" style="width:${v / 395 * 100}%;background:${col};opacity:${n === 'RNI' || MORO.coal[n] ? 1 : 0.35}" class="h-8 flex items-center justify-center text-[10px] font-bold overflow-hidden">${v >= 18 ? n : ''}</div>`).join('');
    const rows = SEATS.filter(x => x[0] !== 'Otros').map(([n, v, col]) => `<label class="flex items-center justify-between bg-slate-950 border ${MORO.coal[n] || n === 'RNI' ? 'border-amber-500/60' : 'border-slate-800'} rounded p-2 text-[12px] ${n === 'RNI' ? '' : 'cursor-pointer'}"><span class="flex items-center gap-2"><input type="checkbox" ${n === 'RNI' ? 'checked disabled' : MORO.coal[n] ? 'checked' : ''} onchange="MORO.tog('${n}')"><i style="background:${col}" class="inline-block w-3 h-3 rounded-full"></i><b>${n}</b>${n === 'RNI' ? '<span class="text-[10px] text-amber-400">partido del Jefe del Gobierno</span>' : ''}</span><span class="font-mono">${v} escaños</span></label>`).join('');
    r.innerHTML = `<div class="flex justify-between items-center mb-2 font-hoi-tech text-xs text-slate-300"><span>Sala <b class="text-amber-300">${MORO.code || ''}</b> · ${MORO.ok ? '<span class="text-emerald-400">conectado con España</span>' : '<span class="text-red-400">CONEXIÓN PERDIDA</span>'}</span><button onclick="MP.leave()" class="hoi-button px-3 py-1 rounded">Salir</button></div>
      <div class="max-w-3xl mx-auto hoi-box p-5 rounded-xl space-y-4 font-hoi-tech"><h2 class="font-hoi-header text-2xl text-amber-400">🇲🇦 REPARTO DE ESCAÑOS · CÁMARA DE REPRESENTANTES</h2>
        <p class="text-[11px] text-slate-400 font-sans">Tras las elecciones, el Rey encarga formar Gobierno al jefe del partido más votado. Elige con qué partidos gobiernas: hacen falta 198 de 395 escaños para tener mayoría. Un Gobierno en minoría arranca con una coalición muy débil.</p>
        <div class="flex rounded overflow-hidden border border-slate-700">${bar}</div>
        <div class="space-y-1.5">${rows}</div>
        <div class="flex justify-between items-center flex-wrap gap-2 bg-slate-950 border ${maj ? 'border-emerald-500/50' : 'border-red-500/50'} rounded p-3 text-[12px]"><span>Tu coalición: <b class="font-mono">${c.seats}</b> / 395 escaños · mayoría en 198</span><b class="${maj ? 'text-emerald-400' : 'text-red-400'}">${maj ? 'GOBIERNO CON MAYORÍA' : 'GOBIERNO EN MINORÍA'}</b></div>
        <button onclick="MORO.begin()" class="hoi-button-gold px-5 py-2.5 rounded-lg text-sm"><i class="fa-solid fa-landmark mr-2"></i>Formar Gobierno y empezar</button></div>`;
  }
  MORO.tog = p => { if (p === 'RNI') return; MORO.coal[p] = !MORO.coal[p]; msetup(); };
  MORO.begin = () => {
    if (DG.ma) return;
    const g = DG.ma = makeGame(CFG.MA, false, mkCoal(Object.keys(MORO.coal).filter(k => MORO.coal[k])));
    g.send = sendOut; g.refresh = mrender; g.up = !!MORO.ok; MORO.stage = 'play'; g.clock();
  };
  MORO.show = function (guest) {
    MORO.code = guest && guest.code; MORO.ok = !!(guest && guest.ok);
    let el = $('moro-root');
    if (!el) { el = document.createElement('div'); el.id = 'moro-root'; el.className = 'fixed inset-0 overflow-y-auto p-3'; el.style.cssText = 'z-index:100000;background:#0b0f12;'; document.body.appendChild(el); MORO.stage = 'setup'; }
    if (MORO.stage === 'setup') msetup(); else if (DG.ma) { DG.ma.up = MORO.ok; mrender(); }
  };
  MORO.hide = function () {
    if (DG.ma && DUEL.mode !== 'local') { DG.ma.stop(); delete DG.ma; }
    MORO.stage = null; MORO.coal = { PAM: 1, Istiqlal: 1 };
    const el = $('moro-root'); if (el) el.remove(); const a = $('x-alert'); if (a) a.remove();
  };
  MORO.onMsg = d => { if (d && DG.ma && DUEL.mode !== 'local') DG.ma.C.onMsg(d); };

  const _gt = gameTick;
  gameTick = function () {
    const b = gameState.daysInOffice; _gt.apply(this, arguments);
    if (gameState.daysInOffice !== b && DUEL.mode) DUEL.daily();
  };
})();
