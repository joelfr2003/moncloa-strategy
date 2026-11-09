// =====================================================================
//  JUEGO DE MARRUECOS (partida propia e independiente del jugador 2).
//  Mapa por regiones, coalición, decretos, presupuesto y Fuerzas Armadas.
//  Se comunica con el juego de España mediante multijugador.js (window.MP).
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

  let G = null, timer = null, root = null;
  const mil = () => Math.round((G.army.tierra + G.army.mar + G.army.aire) / 3);
  const lg = t => { G.log.unshift('Día ' + G.day + ' · ' + t); G.log.length = Math.min(G.log.length, 12); };
  const toast = t => { const e = document.createElement('div'); e.style.cssText = 'position:fixed;right:14px;bottom:14px;z-index:100003;background:#111b22;border:1px solid #d9a726;color:#e2e8f0;padding:10px 14px;border-radius:8px;font-size:13px;max-width:320px'; e.textContent = t; document.body.appendChild(e); setTimeout(() => e.remove(), 4200); };
  const AD = { me: 'MA', name: 'Marruecos', flag: '🇲🇦', tes: () => G.tes, pay: v => { G.tes -= v; }, gain: v => { G.tes += v; }, cap: () => G.cap, spendCap: v => { G.cap -= v; }, mil,
    st: (k, v) => { if (k === 'mil') Object.keys(G.army).forEach(b => { G.army[b] = clamp(G.army[b] + v); }); else if (G[k] != null) G[k] = clamp(G[k] + v); },
    pause: () => { if (G) G.speed = 0; }, hit: () => { const i = Math.floor(Math.random() * REG.length); G.reg[i].est = clamp(G.reg[i].est - 25); G.reg[i].crisis = 1; lg('Daños de guerra en ' + REG[i][1] + '.'); },
    toast: t => { if (G) lg(t); toast(t); }, redraw: () => draw() };
  const fx = o => Object.keys(o || {}).forEach(k => AD.st(k, o[k]));

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
  function stop() { if (timer) clearInterval(timer); timer = null; if (root) root.remove(); root = null; G = null; }
  function loop() {
    if (!G || !G.speed || document.getElementById('mp-modal')) return;
    for (let i = 0; i < [0, 1, 2, 4][G.speed]; i++) tick();
    draw();
  }
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
  function bodyGov() {
    const co = PARTIES.map(([p, n]) => `<div class="flex items-center gap-3"><div class="flex-1">${bar(p + ' · ' + n, G.coal[p])}</div>${btn("MA.neg('" + p + "')", cdl('n' + p) ? cdl('n' + p) + 'd' : 'Negociar · 4 cap.', cdl('n' + p) > 0)}</div>`).join('');
    const pol = POL.map(x => { const off = cdl('p' + x.id) > 0; return `<button ${off ? 'disabled' : `onclick="MA.pol('${x.id}')"`} class="hoi-button p-2 rounded text-[11px] text-left ${off ? 'opacity-50' : ''}"><div><b>${x.t}</b> <span class="text-slate-400">· ${x.cost} M€ · ${x.cap} cap.</span></div><div class="text-slate-400 font-sans">${x.d}</div><div class="text-[10px] text-slate-500">${off ? 'Disponible en ' + cdl('p' + x.id) + ' días' : Object.keys(x.P).map(k => k + ' ' + (x.P[k] > 0 ? '+' : '') + x.P[k]).join(' · ') + (x.ES ? ' · efecto en España' : '')}</div></button>`; }).join('');
    return box('COALICIÓN DE GOBIERNO (si un socio cae por debajo de 20, el Gobierno se rompe)', co + `<div class="flex items-center gap-3"><div class="flex-1">${bar('Palacio Real', G.palace)}</div>${btn('MA.aud()', cdl('aud') ? cdl('aud') + 'd' : 'Audiencia · 5 cap.', cdl('aud') > 0)}</div>`) + '<div class="h-3"></div>' + box('DECRETOS', `<div class="grid grid-cols-1 md:grid-cols-2 gap-2">${pol}</div>`);
  }
  function bodyEco() {
    const inc = 10 * (0.6 + G.eco / 100) - 1 - mil() / 50 * 1.5, out = BUD.reduce((t, b) => t + G.bud[b.id] / 50 * b.cost, 0), bal = inc - out;
    return box('PRESUPUESTO', `<div class="flex justify-between text-xs"><span>Ingresos ${inc.toFixed(1)} M€/día</span><span>Gastos ${out.toFixed(1)} M€/día</span><b class="${bal >= 0 ? 'text-emerald-400' : 'text-red-400'}">Balance ${bal >= 0 ? '+' : ''}${bal.toFixed(1)}</b></div>` +
      BUD.map(b => `<div><div class="flex justify-between text-[11px]"><span><i class="fa-solid ${b.ic} mr-1 text-amber-400"></i>${b.t}</span><span class="font-mono">${G.bud[b.id]}% · ${(G.bud[b.id] / 50 * b.cost).toFixed(1)} M€/día</span></div><input type="range" min="0" max="100" value="${G.bud[b.id]}" class="w-full" onchange="MA.bud('${b.id}',this.value)"><div class="text-[10px] text-slate-500 font-sans">${b.d}</div></div>`).join(''));
  }
  function bodyMil() {
    const nm = { tierra: ['fa-person-rifle', 'Ejército de Tierra'], mar: ['fa-ship', 'Marina Real'], aire: ['fa-jet-fighter', 'Fuerza Aérea'] };
    return box('FUERZAS ARMADAS REALES · poder ' + mil(), Object.keys(G.army).map(b => `<div class="flex items-center gap-3"><div class="flex-1">${bar('<i class="fa-solid ' + nm[b][0] + ' mr-1"></i>' + nm[b][1], G.army[b])}</div>${btn("MA.army('" + b + "')", cdl('a' + b) ? cdl('a' + b) + 'd' : 'Modernizar · 400 M€ · 3 cap.', cdl('a' + b) > 0)}</div>`).join('') +
      '<p class="text-[11px] text-slate-500 font-sans">Tu poder militar decide los ataques que lances y cómo resistes los que recibas. Si te atacan, verás una alerta y elegirás cómo defenderte. Sin mantenimiento, las fuerzas pierden nivel poco a poco.</p>');
  }
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
  window.MA = A;
})();
