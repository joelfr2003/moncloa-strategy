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
  const PARTIES = [['RNI', 'Agrupación Nacional de Independientes'], ['PAM', 'Autenticidad y Modernidad'], ['IST', 'Istiqlal']];


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
  const M = () => { const s = gameState.mp; return s && s.partner === 'MA' && s.P && s.P.army ? wrap(s.P) : null; };
  const UI = { tab: 'main', sel: null };   // estado de pantalla (local de cada jugador, no se sincroniza)

  // Crea la partida de Marruecos. Empieza en el mismo día que España.
  function initMorocco(name) {
    const day = gameState.daysInOffice || 1;
    const m = {
      name: name || 'Jefe de Gobierno', day, eco: 52, est: 60, apr: 55, tes: 9000, cap: 30, palace: 60,
      bud: Object.fromEntries(BUD.map(b => [b.id, 50])),
      army: { tierra: 55, mar: 35, aire: 40 }, coal: { RNI: 70, PAM: 62, IST: 55 },
      reg: REG.map(() => ({ est: 50 + Math.floor(Math.random() * 25), crisis: 0 })),
      cd: {}, evt: null, next: day + 25, log: ['Comienza tu mandato al frente del Gobierno de Marruecos.']
    };
    wrap(m);
    gameState.morocco = m;
    return m;
  }
  const lg = (m, t) => { m.log.unshift('Día ' + m.day + ' · ' + t); m.log.length = Math.min(m.log.length, 12); };
  const diff = () => { try { return diffCfg(); } catch (e) { return { mult: 1, attr: 0, expense: 0 }; } };

  // ---------------- ACCIONES (se ejecutan SIEMPRE en el anfitrión) ----------------
  const toast = t => { try { MP.toast(t); } catch (e) { console.log(t); } };
  const need = (m, cap, cost) => { if (m.cap < cap) { toast('Capital político insuficiente.'); return false; } if (m.tes < cost) { toast('Fondos insuficientes.'); return false; } return true; };
  const redraw = () => { try { render(); } catch (e) { /* sin pantalla */ } };
  const R = {
    invest: i => { const m = M(); if (!m || !m.reg[i] || !need(m, 2, 250)) return; m.tes -= 250; m.cap -= 2; m.reg[i].est = clamp(m.reg[i].est + 15); lg(m, 'Plan de inversión en ' + REG[i][1] + '.'); redraw(); },
    repress: i => { const m = M(); if (!m || !m.reg[i]) return; m.reg[i].est = clamp(m.reg[i].est + 10); m.reg[i].crisis = 0; m.apr = clamp(m.apr - 3); lg(m, 'Las fuerzas del orden toman ' + REG[i][1] + '.'); redraw(); },
    neg: p => { const m = M(), k = 'n' + p; if (!m || !(p in m.coal) || (m.cd[k] || 0) > 0 || !need(m, 4, 0)) return; m.cap -= 4; m.cd[k] = 20; m.coal[p] = clamp(m.coal[p] + 18); lg(m, 'Negociación con ' + p + ': refuerza su apoyo.'); redraw(); },
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
      if (!MP.canAct()) return toast(M() && gameState.mp.mode === 'online' ? 'Marruecos lo gestiona el jugador 2.' : 'Ahora es el turno de España: pasa el mando.');
      R[f](...a);
    };
  });
  A.tab = t => { UI.tab = t; repaint(); };
  A.reg = i => { UI.sel = i; repaint(); };
  A.exec = (f, a) => { if (R.hasOwnProperty(f) && Array.isArray(a)) R[f](...a); };   // órdenes del jugador 2 (en el anfitrión)

  // ---------------- INTERFAZ ----------------
  // m = estado de Marruecos (del anfitrión, o la copia que recibe el jugador 2)
  function renderMoroccoTab(m, ctx) {
    ctx = ctx || {};
    if (!m) m = M();
    if (!m || !m.army) return '<div class="hoi-box p-8 text-center text-slate-400 font-hoi-tech">Marruecos solo está disponible en el modo multijugador.</div>';
    const bar = (l, v) => { v = Math.round(v); return `<div><div class="flex justify-between text-[10px] text-slate-400"><span>${l}</span><span class="font-mono">${v}</span></div><div class="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800"><div class="h-full ${v >= 60 ? 'bg-emerald-500' : v >= 35 ? 'bg-amber-500' : 'bg-red-500'}" style="width:${v}%"></div></div></div>`; };
    const box = (t, inner) => `<div class="hoi-box p-4 rounded-xl space-y-2 font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">${t}</div>${inner}</div>`;
    const btn = (f, t, off) => `<button ${off ? 'disabled' : `onclick="${f}"`} class="hoi-button px-3 py-1.5 rounded text-[11px] ${off ? 'opacity-50' : ''}">${t}</button>`;
    const cdl = k => (m.cd || {})[k] || 0;
    const mil = Math.round((m.army.tierra + m.army.mar + m.army.aire) / 3);

    const map = REG.map((r, i) => { const g = m.reg[i], col = g.est < 35 ? '#ef4444' : g.est < 55 ? '#d9a726' : '#22c55e'; return `<polygon points="${pts(r[2])}" fill="${col}" fill-opacity=".5" stroke="${UI.sel === i ? '#fff' : '#0b0f12'}" stroke-width="${UI.sel === i ? 2.5 : 1}" class="${g.crisis ? 'ma-pulse' : ''}" style="cursor:pointer" onclick="MA.reg(${i})"><title>${r[1]}</title></polygon>`; }).join('');
    const tabs = [['main', 'Mando y mapa'], ['gov', 'Gobierno'], ['eco', 'Economía'], ['mil', 'Militar'], ['dip', 'Diplomacia']].map(([k, l]) => `<button onclick="MA.tab('${k}')" class="${UI.tab === k ? 'hoi-button-gold' : 'hoi-button'} px-3 py-1.5 rounded text-xs">${l}</button>`).join('');

    let body = '';
    if (UI.tab === 'gov') {
      const co = PARTIES.map(([p, n]) => `<div class="flex items-center gap-3"><div class="flex-1">${bar(p + ' · ' + n, m.coal[p])}</div>${btn("MA.neg('" + p + "')", cdl('n' + p) ? cdl('n' + p) + 'd' : 'Negociar · 4 cap.', cdl('n' + p) > 0)}</div>`).join('');
      const pol = POL.map(x => { const off = cdl('p' + x.id) > 0; return `<button ${off ? 'disabled' : `onclick="MA.pol('${x.id}')"`} class="hoi-button p-2 rounded text-[11px] text-left ${off ? 'opacity-50' : ''}"><div><b>${x.t}</b> <span class="text-slate-400">· ${x.cost} M€ · ${x.cap} cap.</span></div><div class="text-slate-400 font-sans">${x.d}</div><div class="text-[10px] text-slate-500">${off ? 'Disponible en ' + cdl('p' + x.id) + ' días' : Object.keys(x.P).map(k => k + ' ' + (x.P[k] > 0 ? '+' : '') + x.P[k]).join(' · ') + (x.ES ? ' · efecto en España' : '')}</div></button>`; }).join('');
      body = box('COALICIÓN DE GOBIERNO (si un socio cae por debajo de 20, el Gobierno se rompe)', co + `<div class="flex items-center gap-3"><div class="flex-1">${bar('Palacio Real', m.palace)}</div>${btn('MA.aud()', cdl('aud') ? cdl('aud') + 'd' : 'Audiencia · 5 cap.', cdl('aud') > 0)}</div>`) + '<div class="h-3"></div>' + box('DECRETOS', `<div class="grid grid-cols-1 md:grid-cols-2 gap-2">${pol}</div>`);
    } else if (UI.tab === 'eco') {
      const inc = 10 * (0.6 + m.eco / 100) - 1 - m.army.tierra / 50 * 1.5, out = BUD.reduce((t, b) => t + m.bud[b.id] / 50 * b.cost, 0), bal = inc - out;
      body = box('PRESUPUESTO', `<div class="flex justify-between text-xs"><span>Ingresos ${inc.toFixed(1)} M€/día</span><span>Gastos ${out.toFixed(1)} M€/día</span><b class="${bal >= 0 ? 'text-emerald-400' : 'text-red-400'}">Balance ${bal >= 0 ? '+' : ''}${bal.toFixed(1)}</b></div>` + BUD.map(b => `<div><div class="flex justify-between text-[11px]"><span><i class="fa-solid ${b.ic} mr-1 text-amber-400"></i>${b.t}</span><span class="font-mono">${m.bud[b.id]}% · ${(m.bud[b.id] / 50 * b.cost).toFixed(1)} M€/día</span></div><input type="range" min="0" max="100" value="${m.bud[b.id]}" class="w-full" onchange="MA.bud('${b.id}',this.value)"><div class="text-[10px] text-slate-500 font-sans">${b.d}</div></div>`).join(''));
    } else if (UI.tab === 'mil') {
      const nm = { tierra: ['fa-person-rifle', 'Ejército de Tierra'], mar: ['fa-ship', 'Marina Real'], aire: ['fa-jet-fighter', 'Fuerza Aérea'] };
      body = box('FUERZAS ARMADAS REALES · poder ' + mil, Object.keys(m.army).map(b => `<div class="flex items-center gap-3"><div class="flex-1">${bar('<i class="fa-solid ' + nm[b][0] + ' mr-1"></i>' + nm[b][1], m.army[b])}</div>${btn("MA.army('" + b + "')", cdl('a' + b) ? cdl('a' + b) + 'd' : 'Modernizar · 400 M€ · 3 cap.', cdl('a' + b) > 0)}</div>`).join('') + '<p class="text-[11px] text-slate-500 font-sans">Tu poder militar pesa en las relaciones con España. Sin mantenimiento, las fuerzas pierden nivel poco a poco.</p>');
    } else if (UI.tab === 'dip') {
      body = MP.renderMulti();
    } else {
      const i = UI.sel, sel = i == null ? '<div class="text-[11px] text-slate-500">Pulsa una región del mapa para gestionarla.</div>' : `<div class="text-sm text-slate-100"><b>${REG[i][1]}</b></div>${bar('Estabilidad regional', m.reg[i].est)}${m.reg[i].crisis ? '<div class="text-[11px] text-red-400">⚠ Disturbios en curso</div>' : ''}<div class="flex gap-2 flex-wrap">${btn('MA.invest(' + i + ')', 'Invertir 250 M€ · 2 cap.')}${m.reg[i].crisis ? btn('MA.repress(' + i + ')', 'Reprimir (−3 aprobación)') : ''}</div>`;
      const e = m.evt != null ? EVS[m.evt] : null;
      body = `<div class="grid grid-cols-1 md:grid-cols-2 gap-3"><div>${box('MAPA DE MARRUECOS', `<svg viewBox="0 0 340 330" class="w-full" style="max-height:440px">${map}</svg>`)}</div>
        <div class="space-y-3">${box('ESTADO DEL PAÍS', bar('Economía', m.eco) + bar('Estabilidad', m.est) + bar('Aprobación', m.apr) + bar('Poder militar', mil) + bar('Confianza del Palacio', m.palace))}
        ${box('REGIÓN', sel)}
        ${e ? `<div class="hoi-box p-4 rounded-xl border-sky-500/60 space-y-2"><b class="text-sky-300 text-sm">${e.title}</b><p class="text-[11px] text-slate-400 font-sans">${e.desc}</p>${e.opts.map((o, k) => `<button onclick="MA.evt(${k})" class="hoi-button w-full p-2 rounded text-[11px] text-left">${o.t}</button>`).join('')}</div>` : ''}
        ${box('REGISTRO', m.log.map(l => `<div class="text-[11px] text-slate-400">${l}</div>`).join(''))}</div></div>`;
    }

    const spectator = !ctx.guest && !MP.canAct()
      ? `<div class="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded p-2 font-hoi-tech">${gameState.mp && gameState.mp.mode === 'online' ? 'Modo espectador: Marruecos lo gobierna el jugador 2.' : 'Ahora manda España. Pasa el mando desde la pestaña Multijugador para gestionar Marruecos.'}</div>` : '';
    return `<div class="space-y-3">
      <div class="flex flex-wrap items-center gap-3 p-2 bg-slate-900/90 border border-slate-800 rounded font-hoi-tech text-xs">
        <b class="text-amber-400 text-lg font-hoi-header">🇲🇦 MARRUECOS</b>
        <span class="text-slate-400">${m.name}</span>
        <span>Día ${m.day}</span>
        <span>💰 ${Math.round(m.tes)} M€</span>
        <span>🏛 ${Math.floor(m.cap)}</span>
      </div>
      ${spectator}
      <div class="flex gap-2 flex-wrap">${tabs}</div>
      ${body}
    </div>`;
  }

  // ---------------- SIMULACIÓN DIARIA (la llama multijugador.js una vez por día de España) ----------------
  function moroccoTick() {
    const m = M();
    if (!m || gameState.step !== 4) return;
    const cfg = diff();
    m.day = gameState.daysInOffice || m.day + 1;   // mismo calendario que España
    m.cap = Math.min(60, m.cap + 0.3);
    m.tes += 10 * (0.6 + m.eco / 100) - 1 - m.army.tierra / 50 * 1.5;
    if (cfg.expense && m.day % 30 === 0) m.tes -= cfg.expense * 0.25;   // gasto corriente según dificultad
    BUD.forEach(b => { const l = m.bud[b.id]; m.tes -= l / 50 * b.cost; Object.keys(b.fx).forEach(k => { m[k] = clamp(m[k] + (l - 50) * b.fx[k]); }); });
    if (m.tes < 0) { m.eco = clamp(m.eco - 0.08); m.apr = clamp(m.apr - 0.06); }
    m.apr = clamp(m.apr + (m.eco - 50) * 0.002 + (m.est - 50) * 0.002 - 0.01 - (cfg.attr || 0) * 0.5 - m.reg.filter(r => r.crisis).length * 0.04);
    m.est = clamp(m.est + (m.apr - 50) * 0.002 + (m.palace - 50) * 0.0004 - (m.apr < 35 ? 0.05 : 0));
    m.eco = clamp(m.eco + (Math.random() - 0.5) * 0.1 + (50 - m.eco) * 0.001);
    m.palace = clamp(m.palace + (m.apr - 50) * 0.002 - 0.005);
    Object.keys(m.army).forEach(k => { m.army[k] = clamp(m.army[k] - 0.01); });
    PARTIES.forEach(([p]) => { m.coal[p] = clamp(m.coal[p] + (m.apr - 50) * 0.003 - 0.02); });
    m.reg.forEach((r, i) => { r.est = clamp(r.est + (m.est - r.est) * 0.01 + (Math.random() - 0.5) * 0.6); if (!r.crisis && r.est < 35 && Math.random() < 0.02) { r.crisis = 1; lg(m, 'Disturbios en ' + REG[i][1] + '.'); } if (r.crisis && r.est > 50) r.crisis = 0; });
    Object.keys(m.cd).forEach(k => { if (m.cd[k] > 0) m.cd[k]--; });
    if (m.evt == null && m.day >= m.next) { m.evt = Math.floor(Math.random() * EVS.length); m.next = m.day + Math.round((40 + Math.floor(Math.random() * 40)) / Math.max(1, cfg.mult || 1)); lg(m, 'Suceso: ' + EVS[m.evt].title + '.'); }
    if (Math.min(m.coal.RNI, m.coal.PAM, m.coal.IST) < 20) {
      PARTIES.forEach(([p]) => { m.coal[p] = 50; }); m.palace = clamp(m.palace - 10); m.apr = clamp(m.apr - 8); m.est = clamp(m.est - 6);
      lg(m, 'CRISIS DE GOBIERNO: la coalición se rompe y se reforma tras la mediación del Palacio.'); toast('Marruecos: crisis de gobierno, la coalición se ha roto.');
    }
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

  const _r = render;
  render = function () {
    if (gameState.activeTab === 'morocco' && !M()) gameState.activeTab = 'main';
    const r = _r.apply(this, arguments);
    try { syncTab(); } catch (e) { console.error(e); }
    return r;
  };

  window.MA = A;
  window.initMorocco = initMorocco;
  window.renderMoroccoTab = renderMoroccoTab;
  window.moroccoTick = moroccoTick;
})();
