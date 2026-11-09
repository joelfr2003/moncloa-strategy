@@ -1,401 +1,172 @@
// =====================================================================
//  DOS JUEGOS INTERCONECTADOS: tú gobiernas España (juego completo) y tu amigo gobierna
//  Marruecos (juego completo propio: mapa, gobierno, decretos, ejército). Cada navegador ejecuta
//  su propia simulación; entre los dos solo viajan mensajes: dinero, tratados, ataques y avisos.
//  JUEGO DE MARRUECOS (partida propia e independiente del jugador 2).
//  Mapa por regiones, coalición, decretos, presupuesto y Fuerzas Armadas.
//  Se comunica con el juego de España mediante multijugador.js (window.MP).
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

  // =====================================================================
  //  MARRUECOS (juego completo del invitado)
  // =====================================================================
  const REGIONS = [
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
  const UNITS = [
    { id: 'inf', t: 'Infantería (FAR)', ic: 'fa-person-rifle', w: 1, cost: 8, up: 0.02 },
    { id: 'blind', t: 'Blindados', ic: 'fa-truck-monster', w: 3, cost: 25, up: 0.05 },
    { id: 'air', t: 'Aviación', ic: 'fa-jet-fighter', w: 5, cost: 60, up: 0.1 },
    { id: 'aa', t: 'Defensa antiaérea', ic: 'fa-satellite-dish', w: 2, cost: 30, up: 0.04 },
    { id: 'nav', t: 'Marina Real', ic: 'fa-anchor', w: 3, cost: 40, up: 0.06 }
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
    { id: 'edu', t: 'Educación', ic: 'fa-graduation-cap', cost: 1.5, fx: { apr: 0.0003, eco: 0.0002 } },
    { id: 'san', t: 'Sanidad', ic: 'fa-heart-pulse', cost: 1.5, fx: { apr: 0.0004, est: 0.0001 } },
    { id: 'seg', t: 'Seguridad e Interior', ic: 'fa-user-shield', cost: 1.5, fx: { est: 0.0005 } },
    { id: 'inf', t: 'Infraestructuras', ic: 'fa-road', cost: 1.5, fx: { eco: 0.0005 } },
    { id: 'agr', t: 'Agricultura y agua', ic: 'fa-wheat-awn', cost: 1.5, fx: { eco: 0.0002, apr: 0.0002, est: 0.0002 } },
    { id: 'pal', t: 'Casa Real y protocolo', ic: 'fa-crown', cost: 1.0, fx: { pal: 0.0006 } }
  ];
  const DECREES = [
    { id: 'green', t: 'Plan Generación Verde', cost: 600, cap: 5, cd: 60, fx: { eco: 3, apr: 2 }, d: 'Renovables e industria verde.' },
    { id: 'edu', t: 'Reforma educativa', cost: 400, cap: 4, cd: 60, fx: { apr: 3, eco: 1 }, d: 'Nuevo modelo escolar.' },
    { id: 'agua', t: 'Desaladoras y trasvases', cost: 500, cap: 4, cd: 60, fx: { eco: 2, est: 2 }, d: 'Seguridad hídrica.' },
    { id: 'tgv', t: 'Alta velocidad Tánger–Marrakech', cost: 900, cap: 6, cd: 90, fx: { eco: 4, apr: 2 }, d: 'Gran obra ferroviaria.' },
    { id: 'pan', t: 'Subsidio al pan y al butano', cost: 300, cap: 3, cd: 45, fx: { apr: 4, est: 2 }, d: 'Alivio de precios.' },
    { id: 'coal', t: 'Pacto de gobierno con el Istiqlal', cost: 0, cap: 6, cd: 90, fx: { coh: 15, apr: -2 }, d: 'Refuerza la coalición a costa de popularidad.' },
    { id: 'rey', t: 'Discurso del Trono y gesto al Palacio', cost: 100, cap: 4, cd: 60, fx: { pal: 10 }, d: 'Gana la confianza del Rey.' },
    { id: 'reg', t: 'Plan de regionalización avanzada', cost: 700, cap: 6, cd: 90, fx: { est: 3, eco: 2 }, regAll: { est: 5 }, d: 'Más autonomía y estabilidad en todas las regiones.' }
  ];
  const EVENTS = [
    { t: 'Sequía y malas cosechas', d: 'Seis años de sequía hunden el campo y el pan se encarece.', o: [{ t: 'Importar cereal y subsidiar (−400 M€)', tes: -400, fx: { apr: 4, eco: -1 } }, { t: 'Racionar agua y dejar que ajuste el mercado', fx: { apr: -6, est: -3 }, reg: -8 }] },
    { t: 'Protestas juveniles', d: 'Miles de jóvenes exigen sanidad, educación y empleo.', o: [{ t: 'Diálogo y reformas (−300 M€)', tes: -300, fx: { apr: 6, est: 4 } }, { t: 'Mano dura y detenciones', fx: { est: -2, apr: -7, pal: 3 }, reg: -5 }] },
    { t: 'Boom de los fosfatos', d: 'El precio mundial de los fosfatos se dispara.', o: [{ t: 'Vender al mejor postor (+800 M€)', tes: 800, fx: { eco: 3 } }, { t: 'Reinvertir en la industria (+300 M€)', tes: 300, fx: { eco: 4, apr: 2 } }] },
    { t: 'Crisis en la coalición', d: 'Un socio de gobierno amenaza con romper el pacto.', o: [{ t: 'Ceder carteras (−150 M€)', tes: -150, fx: { coh: 18, apr: -2 } }, { t: 'Resistir y arriesgar la mayoría', fx: { coh: -15, apr: 2 } }] },
    { t: 'Terremoto en el Atlas', d: 'Un seísmo devasta varias provincias de montaña.', o: [{ t: 'Pedir ayuda urgente a España', fx: { apr: 3 }, ask: 500 }, { t: 'Gestionarlo en solitario (−700 M€)', tes: -700, fx: { apr: -2, est: -2 }, reg: 6 }] },
    { t: 'El Rey exige resultados', d: 'Palacio presiona al gobierno por el ritmo de las reformas.', o: [{ t: 'Presentar un plan ambicioso (−250 M€)', tes: -250, fx: { pal: 12, apr: -1 } }, { t: 'Defender la autonomía del gobierno', fx: { pal: -12, apr: 3 } }] }
  ];
  const CRISES = ['Protestas sociales', 'Sequía local', 'Contrabando y crimen', 'Huelga general regional'];

  const MORO = { S: null, tab: 'map', sel: null, tmr: null, up: false, C: null };
  const newS = () => ({
    day: 1, date: new Date(2023, 0, 1), speed: 1, tes: 9000, cap: 30, rel: 50,
    m: { eco: 52, est: 60, apr: 55, coh: 60, pal: 65 }, bud: Object.fromEntries(BUD.map(b => [b.id, 50])), cd: {},
    units: { inf: 60, blind: 20, air: 10, aa: 8, nav: 6 }, ready: 70, tr: {}, log: [], news: [], evt: null, nextEvt: 30, over: 0,
    reg: Object.fromEntries(REGIONS.map(r => [r.id, { est: 55 + Math.round(Math.random() * 15), eco: 40 + Math.round(Math.random() * 20), gar: 0, crisis: null }])), peer: null
  });
  const power = S => UNITS.reduce((t, u) => t + S.units[u.id] * u.w, 0) * S.ready / 100 * (S.tr.def ? 1.1 : 1);
  const milOf = S => clamp(power(S) / 3);
  const mlog = t => { const S = MORO.S; S.log.unshift({ d: S.day, t }); S.log.length = Math.min(S.log.length, 30); };
  const mtoast = t => { try { goalsToast(t, '#ef4444'); } catch (e) { /* sin toast */ } const e = $('moro-toast'); if (e) { e.textContent = t; e.style.opacity = 1; setTimeout(() => { e.style.opacity = 0; }, 2500); } };
  function mreg(f) { REGIONS.forEach(r => { const g = MORO.S.reg[r.id]; g.est = clamp(g.est + f); }); }
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
  const PARTIES = [['RNI', 'Agrupación Nacional de Independientes'], ['PAM', 'Autenticidad y Modernidad'], ['IST', 'Istiqlal']];

  const ADAPT_MO = {
    name: 'Marruecos', other: 'España', get tr() { return MORO.S.tr; }, set peer(v) { MORO.S.peer = v; },
    mil: () => milOf(MORO.S), tes: () => MORO.S.tes, day: () => MORO.S.day, toast: mtoast,
    cash: (v, why) => { MORO.S.tes += v; },
    add: (k, v) => { const S = MORO.S; if (k === 'mil') { S.ready = clamp(S.ready + v * 1.5); } else if (S.m[k] !== undefined) S.m[k] = clamp(S.m[k] + v); },
    hit: f => { const S = MORO.S; UNITS.forEach(u => { S.units[u.id] = Math.max(0, Math.round(S.units[u.id] * (1 - f))); }); },
    log: mlog, news: t => { MORO.S.news.unshift({ d: MORO.S.day, t }); MORO.S.news.length = 12; },
    pause: () => { MORO.S.speed = 0; mclock(); }, resume: () => { MORO.S.speed = 1; mclock(); }, refresh: () => mrender(), light: () => mlight(),
    sound: () => { try { playSound('riot'); } catch (e) { /* sin sonido */ } }
  };
  const sendOut = o => { try { if (window.MP && MP.sendX) MP.sendX(o); } catch (e) { /* sin enlace */ } };
  let G = null, timer = null, root = null;
  const mil = () => Math.round((G.army.tierra + G.army.mar + G.army.aire) / 3);
  const lg = t => { G.log.unshift('Día ' + G.day + ' · ' + t); G.log.length = Math.min(G.log.length, 12); };
  const toast = t => { const e = document.createElement('div'); e.style.cssText = 'position:fixed;right:14px;bottom:14px;z-index:100003;background:#111b22;border:1px solid #d9a726;color:#e2e8f0;padding:10px 14px;border-radius:8px;font-size:13px;max-width:320px'; e.textContent = t; document.body.appendChild(e); setTimeout(() => e.remove(), 4200); };
  const AD = { me: 'MA', name: 'Marruecos', flag: '🇲🇦', tes: () => G.tes, pay: v => { G.tes -= v; }, gain: v => { G.tes += v; }, cap: () => G.cap, spendCap: v => { G.cap -= v; }, mil,
    st: (k, v) => { if (k === 'mil') Object.keys(G.army).forEach(b => { G.army[b] = clamp(G.army[b] + v); }); else if (G[k] != null) G[k] = clamp(G[k] + v); },
    pause: () => { if (G) G.speed = 0; }, hit: () => { const i = Math.floor(Math.random() * REG.length); G.reg[i].est = clamp(G.reg[i].est - 25); G.reg[i].crisis = 1; lg('Daños de guerra en ' + REG[i][1] + '.'); },
    toast: t => { if (G) lg(t); toast(t); }, redraw: () => draw() };
  const fx = o => Object.keys(o || {}).forEach(k => AD.st(k, o[k]));

  function mclock() {
    if (MORO.tmr) { clearInterval(MORO.tmr); MORO.tmr = null; }
    const S = MORO.S; if (S && S.speed > 0 && !S.over) MORO.tmr = setInterval(mtick, S.speed === 1 ? 1000 : S.speed === 2 ? 500 : 250);
    mrender();
  function start(name) {
    stop();
    G = { name: name || 'Jefe de Gobierno', day: 0, speed: 1, tab: 'main', sel: null, eco: 52, est: 60, apr: 55, tes: 9000, cap: 30, palace: 60,
      bud: Object.fromEntries(BUD.map(b => [b.id, 50])), army: { tierra: 55, mar: 35, aire: 40 }, coal: { RNI: 70, PAM: 62, IST: 55 },
      reg: REG.map(() => ({ est: 50 + Math.floor(Math.random() * 25), crisis: 0 })), cd: {}, evt: null, next: 25, log: ['Comienza tu mandato al frente del Gobierno de Marruecos.'] };
    root = document.createElement('div'); root.id = 'ma-root';
    root.style.cssText = 'position:fixed;inset:0;z-index:100000;overflow-y:auto;background:#0b0f12;color:#e2e8f0';
    const st = document.createElement('style'); st.textContent = '.ma-pulse{animation:mapulse 1.1s infinite}@keyframes mapulse{50%{fill-opacity:.95}}'; root.appendChild(st);
    document.body.appendChild(root); MP.setAdapter(AD); document.body.classList.remove('mp-lobby');
    timer = setInterval(loop, 1000); draw();
  }
  function mtick() {
    const S = MORO.S; if (!S || S.evt != null || $('x-alert')) return;
    S.day++; S.date.setDate(S.date.getDate() + 1);
    const m = S.m;
    BUD.forEach(b => { const l = S.bud[b.id]; S.tes -= l / 50 * b.cost; Object.keys(b.fx).forEach(k => { m[k] = clamp(m[k] + (l - 50) * b.fx[k]); }); });
    S.tes += 16 * (0.6 + m.eco / 100) - 1 - UNITS.reduce((t, u) => t + S.units[u.id] * u.up, 0);
    if (S.tr.trade) { S.tes += 4; m.eco = clamp(m.eco + 0.01); } if (S.tr.border) m.est = clamp(m.est + 0.012);
    if (S.tes < 0) { m.eco = clamp(m.eco - 0.08); m.apr = clamp(m.apr - 0.06); S.ready = clamp(S.ready - 0.05); }
    S.cap = Math.min(60, S.cap + 0.3); S.ready = clamp(S.ready + (S.ready < 70 ? 0.03 : 0));
    // regiones
    let avg = 0;
    REGIONS.forEach(r => { const g = S.reg[r.id]; g.est = clamp(g.est + g.gar * 0.04 - (g.crisis ? 0.35 : 0) + (m.apr - 50) * 0.002 + (50 - g.est) * 0.002); g.eco = clamp(g.eco + (m.eco - g.eco) * 0.003); avg += g.est; });
    avg /= REGIONS.length; m.est = clamp(m.est + (avg - m.est) * 0.02);
    m.apr = clamp(m.apr + (m.eco - 50) * 0.002 + (m.est - 50) * 0.002 - 0.01); m.coh = clamp(m.coh + (m.apr - 55) * 0.003 - 0.005);
    m.pal = clamp(m.pal + (m.est - 50) * 0.002 - (m.coh < 30 ? 0.03 : 0));
    m.eco = clamp(m.eco + (Math.random() - 0.5) * 0.1 + (50 - m.eco) * 0.001);
    Object.keys(S.cd).forEach(k => { if (S.cd[k] > 0) S.cd[k]--; });
    if (Math.random() < 0.008 + (m.est < 40 ? 0.01 : 0)) { const r = REGIONS[Math.floor(Math.random() * REGIONS.length)], g = S.reg[r.id]; if (!g.crisis) { g.crisis = CRISES[Math.floor(Math.random() * CRISES.length)]; mlog('Crisis en ' + r.n + ': ' + g.crisis + '.'); } }
    if (S.evt == null && S.day >= S.nextEvt) { S.evt = Math.floor(Math.random() * EVENTS.length); S.nextEvt = S.day + 45 + Math.floor(Math.random() * 40); mlog('Suceso: ' + EVENTS[S.evt].t + '.'); mrender(); }
    if (m.est <= 0 || m.apr <= 0 || m.pal <= 0) { mfall(); return; }
    if (S.day % 5 === 0) mlight();
    if (S.day % 30 === 0) mrender();
  function stop() { if (timer) clearInterval(timer); timer = null; if (root) root.remove(); root = null; G = null; }
  function loop() {
    if (!G || !G.speed || document.getElementById('mp-modal')) return;
    for (let i = 0; i < [0, 1, 2, 4][G.speed]; i++) tick();
    draw();
  }
  function mfall() {
    const S = MORO.S; S.over++; S.speed = 0; mclock();
    alertBox('CAÍDA DEL GOBIERNO', 'El Palacio y la calle han acabado con tu Ejecutivo. Se forma un gobierno de transición: pierdes capital político y parte de la Tesorería.', [['Empezar de nuevo desde la crisis', () => { Object.assign(S.m, { est: 45, apr: 45, pal: 50, coh: 45 }); S.cap = 5; S.tes -= 1000; S.speed = 1; mlog('Nuevo gobierno de transición.'); mclock(); }]], 'border-amber-500');
  function tick() {
    const c = G; c.day++; c.cap = Math.min(60, c.cap + 0.3);
    c.tes += 10 * (0.6 + c.eco / 100) - 1 - mil() / 50 * 1.5;
    BUD.forEach(b => { const l = c.bud[b.id]; c.tes -= l / 50 * b.cost; Object.keys(b.fx).forEach(k => AD.st(k, (l - 50) * b.fx[k])); });
    const crises = c.reg.filter(r => r.crisis).length;
    if (c.tes < 0) { c.eco = clamp(c.eco - 0.08); c.apr = clamp(c.apr - 0.06); }
    c.apr = clamp(c.apr + (c.eco - 50) * 0.002 + (c.est - 50) * 0.002 - 0.01 - crises * 0.04);
    c.est = clamp(c.est + (c.apr - 50) * 0.002 + (c.palace - 50) * 0.0004 - (c.apr < 35 ? 0.05 : 0));
    c.eco = clamp(c.eco + (Math.random() - 0.5) * 0.1 + (50 - c.eco) * 0.001);
    c.palace = clamp(c.palace + (c.apr - 50) * 0.002 - 0.005);
    Object.keys(c.army).forEach(k => { c.army[k] = clamp(c.army[k] - 0.01); });
    PARTIES.forEach(([p]) => { c.coal[p] = clamp(c.coal[p] + (c.apr - 50) * 0.003 - 0.02); });
    c.reg.forEach((r, i) => {
      r.est = clamp(r.est + (c.est - r.est) * 0.01 + (Math.random() - 0.5) * 0.6);
      if (!r.crisis && r.est < 35 && Math.random() < 0.02) { r.crisis = 1; lg('Disturbios en ' + REG[i][1] + '.'); }
      if (r.crisis && r.est > 50) r.crisis = 0;
    });
    Object.keys(c.cd).forEach(k => { if (c.cd[k] > 0) c.cd[k]--; });
    try { MP.daily(AD, c.day); } catch (e) { /* sin sala */ }
    if (c.evt == null && c.day >= c.next) { c.evt = Math.floor(Math.random() * EVS.length); c.next = c.day + 40 + Math.floor(Math.random() * 40); lg('Suceso: ' + EVS[c.evt].title + '.'); }
    if (Math.min(c.coal.RNI, c.coal.PAM, c.coal.IST) < 20) {
      PARTIES.forEach(([p]) => { c.coal[p] = 50; }); c.palace = clamp(c.palace - 10); c.apr = clamp(c.apr - 8); c.est = clamp(c.est - 6);
      lg('CRISIS DE GOBIERNO: la coalición se rompe y se reforma tras la mediación del Palacio.'); toast('Crisis de gobierno: la coalición se ha roto.');
    }
  }
  // acciones
  const act = {
    spd: n => { MORO.S.speed = n; mclock(); },
    tab: k => { MORO.tab = k; mrender(); },
    sel: id => { MORO.sel = id; mrender(); },
    bud: (id, v) => { MORO.S.bud[id] = Math.round(+v); const e = $('bv-' + id); if (e) e.textContent = Math.round(+v) + '%'; },
    dec: id => {
      const S = MORO.S, x = DECREES.find(z => z.id === id); if (!x || (S.cd[id] || 0) > 0) return;
      if (S.cap < x.cap) return mtoast('Capital político insuficiente.'); if (S.tes < x.cost) return mtoast('Fondos insuficientes.');
      S.cap -= x.cap; S.tes -= x.cost; S.cd[id] = x.cd; Object.keys(x.fx).forEach(k => { S.m[k] = clamp(S.m[k] + x.fx[k]); });
      if (x.regAll) mreg(x.regAll.est); mlog('Decreto aprobado: ' + x.t + '.'); mrender();
    },
    buy: (id, n) => {
      const S = MORO.S, u = UNITS.find(z => z.id === id), c = u.cost * n; if (S.tes < c) return mtoast('Fondos insuficientes.');
      S.tes -= c; S.units[id] += n; S.ready = clamp(S.ready - 1); mlog('Reclutas/compras: +' + n + ' ' + u.t + '.'); mrender();
    },
    train: () => { const S = MORO.S; if (S.tes < 200 || (S.cd.train || 0) > 0) return mtoast('No disponible.'); S.tes -= 200; S.cd.train = 30; S.ready = clamp(S.ready + 12); mlog('Maniobras: la disponibilidad operativa sube.'); mrender(); },
    gar: (id, n) => {
      const S = MORO.S, g = S.reg[id]; if (n > 0 && S.units.inf - REGIONS.reduce((t, r) => t + S.reg[r.id].gar, 0) < n) return mtoast('No quedan soldados libres.');
      g.gar = Math.max(0, g.gar + n); mrender();
    },
    fix: (id, how) => {
      const S = MORO.S, g = S.reg[id]; if (!g.crisis) return;
      if (how === 'inv') { if (S.tes < 200) return mtoast('Fondos insuficientes.'); S.tes -= 200; g.est = clamp(g.est + 8); S.m.apr = clamp(S.m.apr + 0.5); }
      else { if (g.gar < 3) return mtoast('Despliega al menos 3 soldados en la región.'); g.est = clamp(g.est + 5); S.m.apr = clamp(S.m.apr - 1); }
      g.crisis = null; mlog('Crisis resuelta en ' + REGIONS.find(r => r.id === id).n + '.'); mrender();
    },
    evt: i => {
      const S = MORO.S, e = EVENTS[S.evt], o = e && e.o[i]; if (!o) return;
      if (o.tes) S.tes += o.tes; Object.keys(o.fx || {}).forEach(k => { S.m[k] = clamp(S.m[k] + o.fx[k]); }); if (o.reg) mreg(o.reg);
      if (o.ask) MORO.C.request(o.ask); mlog(e.t + ' → ' + o.t.replace(/ \(.*\)$/, '') + '.'); S.evt = null; mrender();
    },
    money: v => MORO.C.money(v), req: v => MORO.C.request(v), tr: id => MORO.C.treaty(id), atk: k => MORO.C.launch(k)

  // ---------- acciones ----------
  const need = (cap, cost) => { if (G.cap < cap) { toast('Capital político insuficiente.'); return false; } if (G.tes < cost) { toast('Fondos insuficientes.'); return false; } return true; };
  const A = {
    speed: s => { G.speed = s; draw(); }, tab: t => { G.tab = t; draw(); }, reg: i => { G.sel = i; draw(); },
    invest: i => { if (!need(2, 250)) return; G.tes -= 250; G.cap -= 2; G.reg[i].est = clamp(G.reg[i].est + 15); lg('Plan de inversión en ' + REG[i][1] + '.'); draw(); },
    repress: i => { G.reg[i].est = clamp(G.reg[i].est + 10); G.reg[i].crisis = 0; AD.st('apr', -3); lg('Las fuerzas del orden toman ' + REG[i][1] + '.'); draw(); },
    neg: p => { const k = 'n' + p; if ((G.cd[k] || 0) > 0 || !need(4, 0)) return; G.cap -= 4; G.cd[k] = 20; G.coal[p] = clamp(G.coal[p] + 18); lg('Negociación con ' + p + ': refuerza su apoyo.'); draw(); },
    aud: () => { if ((G.cd.aud || 0) > 0 || !need(5, 0)) return; G.cap -= 5; G.cd.aud = 40; G.palace = clamp(G.palace + 10); lg('Audiencia con el Rey: sube la confianza del Palacio.'); draw(); },
    pol: id => { const x = POL.find(p => p.id === id), k = 'p' + id; if (!x || (G.cd[k] || 0) > 0 || !need(x.cap, x.cost)) return; G.cap -= x.cap; G.tes -= x.cost; G.cd[k] = x.cd; fx(x.P);
      if (x.ES || x.rel) MP.send({ t: 'd', k: 'fx', fx: x.ES || {}, rel: x.rel || 0, txt: 'Marruecos aprueba: ' + x.t + '.' }); if (x.rel) MP.rel(x.rel); lg('Decreto: ' + x.t + '.'); draw(); },
    bud: (id, v) => { G.bud[id] = clamp(Math.round(+v)); draw(); },
    army: b => { if ((G.cd['a' + b] || 0) > 0 || !need(3, 400)) return; G.cap -= 3; G.tes -= 400; G.cd['a' + b] = 30; G.army[b] = clamp(G.army[b] + 6); lg('Modernización de las fuerzas: ' + b + '.'); draw(); },
    evt: i => { const e = EVS[G.evt], o = e && e.opts[i]; if (!o) return; if (o.tes) G.tes += o.tes; fx(o.P);
      if (o.ES || o.rel) MP.send({ t: 'd', k: 'fx', fx: o.ES || {}, rel: o.rel || 0, txt: 'Marruecos: ' + e.title + '.' }); if (o.rel) MP.rel(o.rel);
      lg(e.title + ' → ' + o.t.replace(/ \(.*\)$/, '') + '.'); G.evt = null; if (o.ask) { MP.amt = 1000; MP.act('ask'); } draw(); },
    start, stop, running: () => !!G
  };

  // ---------------- INTERFAZ DE MARRUECOS ----------------
  const bar = (v, c) => `<div class="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800"><div class="h-full ${c || (v >= 60 ? 'bg-emerald-500' : v >= 35 ? 'bg-amber-500' : 'bg-red-500')}" style="width:${clamp(v)}%"></div></div>`;
  function head() {
    const S = MORO.S, m = S.m, sp = S.speed;
    const b = n => `<button onclick="MORO.a.spd(${n})" class="${sp === n ? 'hoi-button-gold' : 'hoi-button'} px-2.5 py-1 rounded text-xs">${['⏸', '▶', '▶▶', '▶▶▶'][n]}</button>`;
    const st = [['Economía', 'eco'], ['Estabilidad', 'est'], ['Aprobación', 'apr'], ['Coalición', 'coh'], ['Palacio', 'pal']].map(([l, k]) => `<div class="min-w-[90px]"><div class="flex justify-between text-[10px] text-slate-400"><span>${l}</span><span id="h-${k}" class="font-mono">${Math.round(m[k])}</span></div>${bar(m[k])}</div>`).join('');
    return `<div class="hoi-box p-3 rounded space-y-2 font-hoi-tech">
      <div class="flex justify-between items-center flex-wrap gap-2"><span class="font-hoi-header text-2xl text-amber-400">🇲🇦 REINO DE MARRUECOS</span>
      <span class="text-xs text-slate-300"><span id="h-date">${dstr(S.date)}</span> · Tesoro <b id="h-tes" class="text-amber-300">${fm(S.tes)}</b> M€ · Capital <b id="h-cap">${Math.floor(S.cap)}</b> · Poder militar <b id="h-mil">${Math.round(milOf(S))}</b></span>
      <span class="flex gap-1">${[0, 1, 2, 3].map(b).join('')}</span></div>
      <div class="flex gap-3 flex-wrap">${st}</div></div>`;
  }
  function tabs() {
    const T = [['map', 'Mapa y regiones', 'fa-map'], ['gov', 'Gobierno y decretos', 'fa-landmark'], ['army', 'Ejército', 'fa-shield'], ['dip', 'Diplomacia con España', 'fa-flag'], ['news', 'Registro', 'fa-newspaper']];
    return `<div class="flex gap-2 flex-wrap">${T.map(([k, l, i]) => `<button onclick="MORO.a.tab('${k}')" class="${MORO.tab === k ? 'hoi-button-gold' : 'hoi-button'} px-3 py-1.5 rounded text-xs"><i class="fa-solid ${i} mr-1"></i>${l}</button>`).join('')}</div>`;
  }
  function tMap() {
    const S = MORO.S, sel = MORO.sel, col = v => v >= 60 ? '#10b981' : v >= 35 ? '#d9a726' : '#ef4444';
    const polys = REGIONS.map(r => { const g = S.reg[r.id]; return `<polygon points="${r.p}" fill="${col(g.est)}" fill-opacity="${sel === r.id ? .85 : .5}" stroke="${sel === r.id ? '#fff' : '#0b0f12'}" stroke-width="${sel === r.id ? 2.5 : 1.5}" style="cursor:pointer" onclick="MORO.a.sel('${r.id}')"/>${g.crisis ? `<text x="${r.x}" y="${r.y}" text-anchor="middle" font-size="18">⚠</text>` : ''}`; }).join('');
    let pan = '<div class="text-[11px] text-slate-500">Pulsa una región para ver su estado, desplegar tropas o gestionar crisis. Esquema estratégico, no a escala.</div>';
    if (sel) {
      const r = REGIONS.find(z => z.id === sel), g = S.reg[sel], free = S.units.inf - REGIONS.reduce((t, z) => t + S.reg[z.id].gar, 0);
      pan = `<div class="space-y-2"><b class="text-sm text-amber-300">${r.n}</b>
        <div class="text-[11px] flex justify-between"><span>Estabilidad</span><span class="font-mono">${Math.round(g.est)}</span></div>${bar(g.est)}
        <div class="text-[11px] flex justify-between"><span>Economía</span><span class="font-mono">${Math.round(g.eco)}</span></div>${bar(g.eco)}
        <div class="text-[11px] flex justify-between items-center"><span>Tropas desplegadas: <b>${g.gar}</b> (libres ${free})</span><span class="flex gap-1"><button onclick="MORO.a.gar('${sel}',-5)" class="hoi-button px-2 rounded">−5</button><button onclick="MORO.a.gar('${sel}',5)" class="hoi-button px-2 rounded">+5</button></span></div>
        ${g.crisis ? `<div class="bg-red-950/50 border border-red-500/40 p-2 rounded text-[11px] space-y-1"><b class="text-red-300">⚠ ${g.crisis}</b><div class="flex gap-2"><button onclick="MORO.a.fix('${sel}','inv')" class="hoi-button px-2 py-1 rounded">Diálogo e inversión (200 M€)</button><button onclick="MORO.a.fix('${sel}','mil')" class="hoi-button px-2 py-1 rounded">Mano dura (≥3 tropas)</button></div></div>` : '<div class="text-[11px] text-emerald-400">Sin crisis activas.</div>'}</div>`;
    }
    return `<div class="grid grid-cols-1 md:grid-cols-2 gap-3"><div class="hoi-box p-3 rounded"><svg viewBox="0 0 320 465" class="w-full max-h-[480px]">${polys}</svg></div><div class="hoi-box p-4 rounded font-hoi-tech">${pan}</div></div>`;
  }
  function tGov() {
    const S = MORO.S;
    const inc = 16 * (0.6 + S.m.eco / 100) - 1, out = BUD.reduce((t, b) => t + S.bud[b.id] / 50 * b.cost, 0) + UNITS.reduce((t, u) => t + S.units[u.id] * u.up, 0);
    const bud = BUD.map(b => `<div><div class="flex justify-between text-[11px]"><span><i class="fa-solid ${b.ic} mr-1 text-amber-400"></i>${b.t}</span><span id="bv-${b.id}" class="font-mono">${S.bud[b.id]}%</span></div><input type="range" min="0" max="100" value="${S.bud[b.id]}" oninput="MORO.a.bud('${b.id}',this.value)" class="w-full"></div>`).join('');
    const dec = DECREES.map(x => { const cd = S.cd[x.id] || 0, off = cd > 0 || S.cap < x.cap || S.tes < x.cost; return `<button ${off ? 'disabled' : ''} onclick="MORO.a.dec('${x.id}')" class="hoi-button p-2 rounded text-[11px] text-left ${off ? 'opacity-50' : ''}"><div><b>${x.t}</b> <span class="text-slate-400">· ${x.cost} M€ · ${x.cap} cap.${cd ? ' · espera ' + cd + ' d' : ''}</span></div><div class="text-slate-400 font-sans">${x.d}</div></button>`; }).join('');
    return `<div class="hoi-box p-4 rounded space-y-2 font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">PRESUPUESTO · Ingresos ${inc.toFixed(1)} − Gastos ${out.toFixed(1)} = <b class="${inc - out >= 0 ? 'text-emerald-400' : 'text-red-400'}">${(inc - out).toFixed(1)} M€/día</b></div><div class="grid grid-cols-1 md:grid-cols-2 gap-3">${bud}</div></div>
      <div class="hoi-box p-4 rounded space-y-2 font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">DECRETOS (Primer ministro y Palacio)</div><div class="grid grid-cols-1 md:grid-cols-2 gap-2">${dec}</div></div>`;
  }
  function tArmy() {
    const S = MORO.S, deployed = REGIONS.reduce((t, r) => t + S.reg[r.id].gar, 0);
    const rows = UNITS.map(u => `<div class="flex justify-between items-center text-[11px] bg-slate-950 border border-slate-800 rounded p-2"><span><i class="fa-solid ${u.ic} mr-1 text-amber-400"></i><b>${u.t}</b> · ${S.units[u.id]} uds · ${u.cost} M€/ud</span><span class="flex gap-1"><button onclick="MORO.a.buy('${u.id}',1)" class="hoi-button px-2 rounded">+1</button><button onclick="MORO.a.buy('${u.id}',5)" class="hoi-button px-2 rounded">+5</button></span></div>`).join('');
    return `<div class="hoi-box p-4 rounded space-y-2 font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">FUERZAS ARMADAS REALES (FAR) · Poder ${Math.round(power(S))} · Disponibilidad ${Math.round(S.ready)}% · Desplegados ${deployed}/${S.units.inf}</div>${rows}
      <button onclick="MORO.a.train()" class="hoi-button p-2 rounded text-xs ${(S.cd.train || 0) > 0 || S.tes < 200 ? 'opacity-50' : ''}">Maniobras (200 M€): +12% disponibilidad${(S.cd.train || 0) > 0 ? ' · espera ' + S.cd.train + ' d' : ''}</button></div>`;
  }
  function tDip() {
    const S = MORO.S, p = S.peer, up = MORO.up;
    const es = p ? `<div class="grid grid-cols-2 md:grid-cols-5 gap-2 text-[11px]">${[['Economía', 'eco'], ['Estabilidad', 'est'], ['Aprobación', 'apr'], ['Militar', 'mil'], ['Tesoro', 'tes']].map(([l, k]) => `<div class="bg-slate-950 border border-slate-800 rounded p-2"><div class="text-slate-400">${l}</div><b>${fm(p[k])}</b></div>`).join('')}</div>` : '<div class="text-[11px] text-slate-500">Esperando datos de España…</div>';
    const trs = Object.keys(TR).map(id => `<button ${S.tr[id] ? 'disabled' : ''} onclick="MORO.a.tr('${id}')" class="hoi-button p-2 rounded text-[11px] text-left ${S.tr[id] ? 'opacity-50' : ''}"><i class="fa-solid ${TR[id].ic} mr-1 text-emerald-400"></i><b>${TR[id].t}</b> ${S.tr[id] ? '· ACTIVO' : ''}<div class="text-slate-400 font-sans">${TR[id].d}</div></button>`).join('');
    const atk = Object.keys(KINDS).map(k => `<button onclick="MORO.a.atk('${k}')" class="hoi-button p-2 rounded text-[11px] text-left border-red-500/40"><i class="fa-solid ${KINDS[k].ic} mr-1 text-red-400"></i><b>${KINDS[k].t}</b> <span class="text-slate-400">· ${KINDS[k].cost} M€</span><div class="text-slate-400 font-sans">${KINDS[k].d}</div></button>`).join('');
    return `<div class="hoi-box p-4 rounded space-y-2 font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">🇪🇸 ESPAÑA ${up ? '<span class="text-emerald-400">● conectado</span>' : '<span class="text-red-400">○ sin conexión</span>'}</div><div id="dip-es">${es}</div></div>
      <div class="hoi-box p-4 rounded space-y-2 font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">AYUDA ECONÓMICA</div><div class="flex gap-2 flex-wrap">${[250, 500, 1000].map(v => `<button onclick="MORO.a.money(${v})" class="hoi-button px-3 py-1.5 rounded text-xs">Enviar ${v} M€</button>`).join('')}${[500, 1000].map(v => `<button onclick="MORO.a.req(${v})" class="hoi-button px-3 py-1.5 rounded text-xs">Pedir ${v} M€</button>`).join('')}</div></div>
      <div class="hoi-box p-4 rounded space-y-2 font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">TRATADOS (requieren aceptación)</div><div class="grid grid-cols-1 md:grid-cols-3 gap-2">${trs}</div></div>
      <div class="hoi-box p-4 rounded space-y-2 font-hoi-tech"><div class="text-[11px] text-red-400 tracking-wider">OPERACIONES HOSTILES (España recibirá el aviso y podrá defenderse)</div><div class="grid grid-cols-1 md:grid-cols-2 gap-2">${atk}</div></div>`;
  // ---------- interfaz ----------
  const bar = (l, v) => { v = Math.round(v); return `<div><div class="flex justify-between text-[10px] text-slate-400"><span>${l}</span><span class="font-mono">${v}</span></div><div class="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800"><div class="h-full ${v >= 60 ? 'bg-emerald-500' : v >= 35 ? 'bg-amber-500' : 'bg-red-500'}" style="width:${v}%"></div></div></div>`; };
  const btn = (f, t, off, c) => `<button ${off ? 'disabled' : `onclick="${f}"`} class="${c || 'hoi-button'} px-3 py-1.5 rounded text-[11px] ${off ? 'opacity-50' : ''}">${t}</button>`;
  const box = (t, inner) => `<div class="hoi-box p-4 rounded-xl space-y-2 font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">${t}</div>${inner}</div>`;
  const cdl = k => G.cd[k] || 0;

  function bodyMain() {
    const map = REG.map((r, i) => { const g = G.reg[i], col = g.est < 35 ? '#ef4444' : g.est < 55 ? '#d9a726' : '#22c55e';
      return `<polygon points="${pts(r[2])}" fill="${col}" fill-opacity=".5" stroke="${G.sel === i ? '#fff' : '#0b0f12'}" stroke-width="${G.sel === i ? 2.5 : 1}" class="${g.crisis ? 'ma-pulse' : ''}" style="cursor:pointer" onclick="MA.reg(${i})"><title>${r[1]}</title></polygon>`; }).join('');
    const i = G.sel, sel = i == null ? '<div class="text-[11px] text-slate-500">Pulsa una región del mapa para gestionarla.</div>' : `<div class="text-sm text-slate-100"><b>${REG[i][1]}</b></div>${bar('Estabilidad regional', G.reg[i].est)}${G.reg[i].crisis ? '<div class="text-[11px] text-red-400">⚠ Disturbios en curso</div>' : ''}<div class="flex gap-2 flex-wrap">${btn('MA.invest(' + i + ')', 'Invertir 250 M€ · 2 cap.')}${G.reg[i].crisis ? btn('MA.repress(' + i + ')', 'Reprimir (−3 aprobación)') : ''}</div>`;
    const e = G.evt != null ? EVS[G.evt] : null;
    return `<div class="grid grid-cols-1 md:grid-cols-2 gap-3"><div>${box('MAPA DE MARRUECOS', `<svg viewBox="0 0 340 330" class="w-full" style="max-height:440px">${map}</svg>`)}</div>
      <div class="space-y-3">${box('ESTADO DEL PAÍS', bar('Economía', G.eco) + bar('Estabilidad', G.est) + bar('Aprobación', G.apr) + bar('Poder militar', mil()) + bar('Confianza del Palacio', G.palace))}
      ${box('REGIÓN', sel)}
      ${e ? `<div class="hoi-box p-4 rounded-xl border-sky-500/60 space-y-2"><b class="text-sky-300 text-sm">${e.title}</b><p class="text-[11px] text-slate-400 font-sans">${e.desc}</p>${e.opts.map((o, k) => `<button onclick="MA.evt(${k})" class="hoi-button w-full p-2 rounded text-[11px] text-left">${o.t}</button>`).join('')}</div>` : ''}
      ${box('REGISTRO', G.log.map(l => `<div class="text-[11px] text-slate-400">${l}</div>`).join(''))}</div></div>`;
  }
  function tNews() {
    const S = MORO.S, l = S.log.map(x => `<div class="text-[11px] text-slate-400"><span class="text-slate-600 font-mono">día ${x.d}</span> · ${x.t}</div>`).join('') || '<div class="text-[11px] text-slate-600">Sin movimientos.</div>';
    return `<div class="hoi-box p-4 rounded space-y-1 font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">REGISTRO DEL GOBIERNO</div>${l}</div>`;
  function bodyGov() {
    const co = PARTIES.map(([p, n]) => `<div class="flex items-center gap-3"><div class="flex-1">${bar(p + ' · ' + n, G.coal[p])}</div>${btn("MA.neg('" + p + "')", cdl('n' + p) ? cdl('n' + p) + 'd' : 'Negociar · 4 cap.', cdl('n' + p) > 0)}</div>`).join('');
    const pol = POL.map(x => { const off = cdl('p' + x.id) > 0; return `<button ${off ? 'disabled' : `onclick="MA.pol('${x.id}')"`} class="hoi-button p-2 rounded text-[11px] text-left ${off ? 'opacity-50' : ''}"><div><b>${x.t}</b> <span class="text-slate-400">· ${x.cost} M€ · ${x.cap} cap.</span></div><div class="text-slate-400 font-sans">${x.d}</div><div class="text-[10px] text-slate-500">${off ? 'Disponible en ' + cdl('p' + x.id) + ' días' : Object.keys(x.P).map(k => k + ' ' + (x.P[k] > 0 ? '+' : '') + x.P[k]).join(' · ') + (x.ES ? ' · efecto en España' : '')}</div></button>`; }).join('');
    return box('COALICIÓN DE GOBIERNO (si un socio cae por debajo de 20, el Gobierno se rompe)', co + `<div class="flex items-center gap-3"><div class="flex-1">${bar('Palacio Real', G.palace)}</div>${btn('MA.aud()', cdl('aud') ? cdl('aud') + 'd' : 'Audiencia · 5 cap.', cdl('aud') > 0)}</div>`) + '<div class="h-3"></div>' + box('DECRETOS', `<div class="grid grid-cols-1 md:grid-cols-2 gap-2">${pol}</div>`);
  }
  function evtCard() {
    const S = MORO.S; if (S.evt == null) return '';
    const e = EVENTS[S.evt];
    return `<div class="hoi-box p-4 rounded space-y-2 border border-sky-500/50 font-hoi-tech"><b class="text-lg text-sky-300">${e.t}</b><p class="text-[11px] text-slate-300 font-sans">${e.d}</p>${e.o.map((o, i) => `<button onclick="MORO.a.evt(${i})" class="hoi-button w-full p-2 rounded text-[11px] text-left">${o.t}</button>`).join('')}</div>`;
  function bodyEco() {
    const inc = 10 * (0.6 + G.eco / 100) - 1 - mil() / 50 * 1.5, out = BUD.reduce((t, b) => t + G.bud[b.id] / 50 * b.cost, 0), bal = inc - out;
    return box('PRESUPUESTO', `<div class="flex justify-between text-xs"><span>Ingresos ${inc.toFixed(1)} M€/día</span><span>Gastos ${out.toFixed(1)} M€/día</span><b class="${bal >= 0 ? 'text-emerald-400' : 'text-red-400'}">Balance ${bal >= 0 ? '+' : ''}${bal.toFixed(1)}</b></div>` +
      BUD.map(b => `<div><div class="flex justify-between text-[11px]"><span><i class="fa-solid ${b.ic} mr-1 text-amber-400"></i>${b.t}</span><span class="font-mono">${G.bud[b.id]}% · ${(G.bud[b.id] / 50 * b.cost).toFixed(1)} M€/día</span></div><input type="range" min="0" max="100" value="${G.bud[b.id]}" class="w-full" onchange="MA.bud('${b.id}',this.value)"><div class="text-[10px] text-slate-500 font-sans">${b.d}</div></div>`).join(''));
  }
  function mrender() {
    const r = $('moro-root'); if (!r || !MORO.S) return;
    const T = { map: tMap, gov: tGov, army: tArmy, dip: tDip, news: tNews }[MORO.tab];
    const top = r.querySelector && r.querySelector('#moro-top');
    r.innerHTML = `<div id="moro-top" class="flex justify-between items-center mb-2 font-hoi-tech text-xs text-slate-300"><span>Sala <b class="text-amber-300">${MORO.code || ''}</b> · ${MORO.up ? '<span class="text-emerald-400">conectado con España</span>' : '<span class="text-red-400">CONEXIÓN PERDIDA</span>'}</span><button onclick="MP.leave()" class="hoi-button px-3 py-1 rounded">Salir de la sala</button></div>
      <div class="max-w-5xl mx-auto space-y-3">${head()}${evtCard()}${tabs()}${T()}</div><div id="moro-toast" style="position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:#7f1d1d;color:#fff;padding:8px 14px;border-radius:8px;font-size:12px;opacity:0;transition:opacity .3s;z-index:100060"></div>`;
  function bodyMil() {
    const nm = { tierra: ['fa-person-rifle', 'Ejército de Tierra'], mar: ['fa-ship', 'Marina Real'], aire: ['fa-jet-fighter', 'Fuerza Aérea'] };
    return box('FUERZAS ARMADAS REALES · poder ' + mil(), Object.keys(G.army).map(b => `<div class="flex items-center gap-3"><div class="flex-1">${bar('<i class="fa-solid ' + nm[b][0] + ' mr-1"></i>' + nm[b][1], G.army[b])}</div>${btn("MA.army('" + b + "')", cdl('a' + b) ? cdl('a' + b) + 'd' : 'Modernizar · 400 M€ · 3 cap.', cdl('a' + b) > 0)}</div>`).join('') +
      '<p class="text-[11px] text-slate-500 font-sans">Tu poder militar decide los ataques que lances y cómo resistes los que recibas. Si te atacan, verás una alerta y elegirás cómo defenderte. Sin mantenimiento, las fuerzas pierden nivel poco a poco.</p>');
  }
  function mlight() {
    const S = MORO.S, set = (id, v) => { const e = $(id); if (e) e.textContent = v; };
    set('h-date', dstr(S.date)); set('h-tes', fm(S.tes)); set('h-cap', Math.floor(S.cap)); set('h-mil', Math.round(milOf(S)));
    ['eco', 'est', 'apr', 'coh', 'pal'].forEach(k => set('h-' + k, Math.round(S.m[k])));
    if (MORO.tab === 'dip' && S.peer) { const e = $('dip-es'); if (e) mrender(); }
  function draw() {
    if (!root || !G) return;
    const d = new Date(2024, 0, 1 + G.day).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    const tabs = [['main', 'Mando y mapa'], ['gov', 'Gobierno'], ['eco', 'Economía'], ['mil', 'Militar'], ['dip', 'Diplomacia']].map(([k, l]) => `<button onclick="MA.tab('${k}')" class="${G.tab === k ? 'hoi-button-gold' : 'hoi-button'} px-3 py-1.5 rounded text-xs">${l}</button>`).join('');
    const body = { main: bodyMain, gov: bodyGov, eco: bodyEco, mil: bodyMil, dip: () => MP.panel() }[G.tab]();
    const keep = root.scrollTop, st = root.firstChild;
    root.innerHTML = '';
    root.appendChild(st);
    root.insertAdjacentHTML('beforeend', `<div class="flex flex-wrap items-center gap-3 p-3 border-b border-slate-800 bg-slate-950 font-hoi-tech text-xs sticky top-0 z-10"><b class="text-amber-400 text-lg font-hoi-header">🇲🇦 MARRUECOS</b><span class="text-slate-400">${G.name}</span><span>${d}</span>
      <span class="flex gap-1">${['⏸', '▶', '▶▶', '▶▶▶'].map((s, i) => `<button onclick="MA.speed(${i})" class="${G.speed === i ? 'hoi-button-gold' : 'hoi-button'} px-2 py-1 rounded">${s}</button>`).join('')}</span>
      <span>💰 ${Math.round(G.tes)} M€</span><span>🏛 ${Math.floor(G.cap)}</span><button onclick="MP.leave()" class="hoi-button px-2 py-1 rounded text-slate-400 ml-auto">Salir</button></div>
      <div class="max-w-5xl mx-auto p-3 space-y-3"><div class="flex gap-2 flex-wrap">${tabs}</div>${body}</div>`);
    root.scrollTop = keep;
  }
  MORO.a = act;
  MORO.onMsg = d => { if (d && MORO.C) MORO.C.onMsg(d); };
  MORO.show = function (guest) {
    MORO.code = guest && guest.code; MORO.up = !!(guest && guest.ok);
    let el = $('moro-root');
    if (!el) {
      el = document.createElement('div'); el.id = 'moro-root'; el.className = 'fixed inset-0 overflow-y-auto p-3'; el.style.cssText = 'z-index:100000;background:#0b0f12;';
      document.body.appendChild(el);
      MORO.S = newS(); MORO.C = core(ADAPT_MO, sendOut); mlog('Asumes el gobierno del Reino de Marruecos.'); mclock();
      MORO.sync = setInterval(() => { if (MORO.up) sendOut({ k: 'sync', s: { eco: MORO.S.m.eco, est: MORO.S.m.est, apr: MORO.S.m.apr, mil: milOf(MORO.S), tes: MORO.S.tes } }); }, 4000);
    } else mrender();
  };
  MORO.hide = function () {
    if (MORO.tmr) clearInterval(MORO.tmr); if (MORO.sync) clearInterval(MORO.sync); MORO.tmr = MORO.sync = null; MORO.S = null;
    const el = $('moro-root'); if (el) el.remove(); const a = $('x-alert'); if (a) a.remove();
  };
  window.MORO = MORO;

  // =====================================================================
  //  ESPAÑA (juego completo del anfitrión) — panel de diplomacia + avisos
  // =====================================================================
  const ESX = { up: false, peer: null, log: [], tr: {}, C: null };
  const clampM = (k, v) => { const m = gameState.metrics; if (m && m[k] !== undefined) m[k] = clamp(m[k] + v); };
  const ADAPT_ES = {
    name: 'España', other: 'Marruecos', get tr() { return ESX.tr; }, set peer(v) { ESX.peer = v; },
    mil: () => (gameState.metrics ? gameState.metrics.mil : 50), tes: () => Number(gameState.treasury) || 0, day: () => gameState.daysInOffice || 0,
    toast: t => { try { goalsToast(t, '#ef4444'); } catch (e) { /* sin toast */ } },
    cash: (v, why) => registerFinancialTransaction(why, v, 'economia'),
    add: (k, v) => clampM(k, v), hit: f => clampM('mil', -f * 20),
    log: t => { ESX.log.unshift({ d: gameState.daysInOffice || 0, t }); ESX.log.length = Math.min(ESX.log.length, 25); try { addNewsToTicker(t, 'Marruecos'); } catch (e) { /* sin teletipo */ } },
    news: () => {}, pause: () => { ESX.speed = gameState.gameSpeed || 1; try { setGameSpeed(0); } catch (e) { /* ya en pausa */ } },
    resume: () => { try { setGameSpeed(ESX.speed || 1); } catch (e) { /* sin reloj */ } },
    refresh: () => { if (gameState.activeTab === 'mp') render(); }, light: () => { if (gameState.activeTab === 'mp') render(); },
    sound: () => { try { playSound('riot'); } catch (e) { /* sin sonido */ } }
  };
  ESX.C = core(ADAPT_ES, sendOut);
  ESX.onMsg = d => { ESX.C.onMsg(d); };
  ESX.linked = up => { ESX.up = up; if (up) ADAPT_ES.log('Marruecos se ha conectado: ya puedes interactuar con su gobierno.'); else ESX.peer = null; ADAPT_ES.refresh(); };
  const esReinforce = () => {
    const c = ESX.C; if ((c.cd.reinf || 0) > ADAPT_ES.day()) return ADAPT_ES.toast('Aún en enfriamiento.');
    if (ADAPT_ES.tes() < 300) return ADAPT_ES.toast('Fondos insuficientes.');
    ADAPT_ES.cash(-300, 'Refuerzo de las Fuerzas Armadas'); clampM('mil', 3); c.cd.reinf = ADAPT_ES.day() + 15; ADAPT_ES.refresh();
  };
  ESX.panel = function () {
    const p = ESX.peer, code = (gameState.mp && gameState.mp.code) || '';
    const b = (cls, f, ic, t, d, off) => `<button ${off ? 'disabled' : ''} onclick="${f}" class="hoi-button p-2 rounded text-[11px] text-left ${cls} ${off ? 'opacity-50' : ''}"><i class="fa-solid ${ic} mr-1"></i><b>${t}</b><div class="text-slate-400 font-sans">${d}</div></button>`;
    const peer = p ? `<div class="grid grid-cols-2 md:grid-cols-5 gap-2 text-[11px]">${[['Economía', 'eco'], ['Estabilidad', 'est'], ['Aprobación', 'apr'], ['Militar', 'mil'], ['Tesoro (M€)', 'tes']].map(([l, k]) => `<div class="bg-slate-950 border border-slate-800 rounded p-2"><div class="text-slate-400">${l}</div><b>${fm(p[k])}</b></div>`).join('')}</div>` : '<div class="text-[11px] text-slate-500">Sin datos de Marruecos todavía.</div>';
    const day = ADAPT_ES.day();
    const lg = ESX.log.map(l => `<div class="text-[11px] text-slate-400"><span class="text-slate-600 font-mono">día ${l.d}</span> · ${l.t}</div>`).join('') || '<div class="text-[11px] text-slate-600">Sin movimientos.</div>';
    return `<div class="hoi-box p-5 rounded-xl space-y-2 font-hoi-tech"><h3 class="font-hoi-header text-2xl text-amber-400"><i class="fa-solid fa-people-arrows mr-2"></i>DIPLOMACIA CON MARRUECOS</h3>
      <div class="text-xs text-slate-300 flex items-center gap-3 flex-wrap">Sala <b class="text-amber-300 text-lg tracking-widest">${code}</b> ${ESX.up ? '<span class="text-emerald-400">● 🇲🇦 Marruecos conectado (gobierna su propio país)</span>' : '<span class="text-amber-400">○ esperando a tu amigo: que pegue este código en «Unirse»</span>'}
      <button onclick="if(confirm('¿Cerrar la sala?'))MP.stop()" class="hoi-button px-3 py-1 rounded">Cerrar sala</button></div>
      <p class="text-[11px] text-slate-400 font-sans">Tú gobiernas España con el juego completo; tu amigo gobierna Marruecos en su pantalla con el suyo. Aquí solo se cruzan dinero, tratados y ataques.</p></div>
      <div class="hoi-box p-4 rounded space-y-2"><div class="text-[11px] text-amber-400 tracking-wider">ESTADO DE 🇲🇦 MARRUECOS</div>${peer}</div>
      <div class="hoi-box p-4 rounded space-y-2"><div class="text-[11px] text-amber-400 tracking-wider">AYUDA ECONÓMICA</div><div class="flex gap-2 flex-wrap">${[250, 500, 1000].map(v => `<button onclick="ESX.C.money(${v})" class="hoi-button px-3 py-1.5 rounded text-xs">Enviar ${v} M€</button>`).join('')}${[500, 1000].map(v => `<button onclick="ESX.C.request(${v})" class="hoi-button px-3 py-1.5 rounded text-xs">Pedir ${v} M€</button>`).join('')}</div></div>
      <div class="hoi-box p-4 rounded space-y-2"><div class="text-[11px] text-amber-400 tracking-wider">TRATADOS (requieren aceptación)</div><div class="grid grid-cols-1 md:grid-cols-3 gap-2">${Object.keys(TR).map(id => b('', `ESX.C.treaty('${id}')`, TR[id].ic, TR[id].t + (ESX.tr[id] ? ' · ACTIVO' : ''), TR[id].d, ESX.tr[id])).join('')}</div></div>
      <div class="hoi-box p-4 rounded space-y-2"><div class="text-[11px] text-red-400 tracking-wider">OPERACIONES HOSTILES (Marruecos recibirá el aviso y podrá defenderse)</div><div class="grid grid-cols-1 md:grid-cols-2 gap-2">${Object.keys(KINDS).map(k => b('border-red-500/40', `ESX.C.launch('${k}')`, KINDS[k].ic, KINDS[k].t + ' · ' + KINDS[k].cost + ' M€', KINDS[k].d, day < (ESX.C.cd[k] || 0))).join('')}</div></div>
      <div class="hoi-box p-4 rounded space-y-2"><div class="text-[11px] text-amber-400 tracking-wider">TUS FUERZAS ARMADAS</div><div class="text-[11px] text-slate-300">Poder militar: <b>${Math.round(ADAPT_ES.mil())}</b> (el que defiende y el que ataca)</div>${b('', 'ESX.reinforce()', 'fa-shield', 'Reforzar las Fuerzas Armadas · 300 M€', '+3 de poder militar. Espera 15 días.', day < (ESX.C.cd.reinf || 0))}</div>
      <div class="hoi-box p-4 rounded space-y-1"><div class="text-[11px] text-amber-400 tracking-wider">REGISTRO</div>${lg}</div>`;
  };
  ESX.reinforce = esReinforce;
  window.ESX = ESX;

  const _rtc = renderTabContent;
  renderTabContent = function () { return gameState.activeTab === 'mp' && gameState.mp && gameState.mp.mode === 'online' ? ESX.panel() : _rtc(); };
  // efectos diarios de los tratados y sincronización (lado España)
  const _gt = gameTick;
  gameTick = function () {
    const b = gameState.daysInOffice; _gt.apply(this, arguments);
    if (gameState.daysInOffice !== b && ESX.up) {
      if (ESX.tr.trade && b % 30 === 0) ADAPT_ES.cash(120, 'Acuerdo comercial con Marruecos');
      if (ESX.tr.border) clampM('est', 0.012);
      if (ESX.tr.def) clampM('mil', 0.01);
    }
  };
  setInterval(() => { if (ESX.up && window.gameState && gameState.metrics) { const m = gameState.metrics; sendOut({ k: 'sync', s: { eco: m.eco, est: m.est, apr: m.apr, mil: m.mil, tes: Number(gameState.treasury) || 0 } }); } }, 4000);
  ESX.core = core; ESX.A = ADAPT_ES;
  window.MA = A;
})();
