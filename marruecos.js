// =====================================================================
//  JUEGO DE MARRUECOS (integrado en la interfaz principal)
//  Utiliza la misma estructura visual que España.
// =====================================================================
(function () {
  'use strict';
  const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));

  // ... (Aquí irían las constantes REG, BUD, POL, EVS, PARTIES, etc., que ya tenías. Las mantenemos igual) ...

  // El estado G ahora es parte de gameState para que sea persistente y compartido
  const M = () => gameState.morocco;
  
  // Función de inicialización, llamada desde el lobby
  function initMorocco(name) {
    gameState.morocco = {
      name: name || 'Jefe de Gobierno',
      day: 1,
      eco: 52, est: 60, apr: 55, tes: 9000, cap: 30, palace: 60,
      bud: Object.fromEntries(BUD.map(b => [b.id, 50])),
      army: { tierra: 55, mar: 35, aire: 40 },
      coal: { RNI: 70, PAM: 62, IST: 55 },
      reg: REG.map(() => ({ est: 50 + Math.floor(Math.random() * 25), crisis: 0 })),
      cd: {}, evt: null, next: 25, log: ['Comienza tu mandato al frente del Gobierno de Marruecos.']
    };
    // Adaptador para el sistema de multijugador
    MP.setAdapter({
      me: 'MA', name: 'Marruecos', flag: '🇲🇦',
      tes: () => M().tes, pay: v => { M().tes -= v; }, gain: v => { M().tes += v; },
      cap: () => M().cap, spendCap: v => { M().cap -= v; },
      mil: () => Math.round((M().army.tierra + M().army.mar + M().army.aire) / 3),
      st: (k, v) => { if (k === 'mil') Object.keys(M().army).forEach(b => { M().army[b] = clamp(M().army[b] + v); }); else if (M()[k] != null) M()[k] = clamp(M()[k] + v); },
      pause: () => setGameSpeed(0), // Pausa el juego principal
      toast: t => { M().log.unshift('Día ' + M().day + ' · ' + t); if (gameState.activeTab === 'morocco') render(); },
      redraw: () => { if (gameState.activeTab === 'morocco') render(); }
    });
  }

  // Funciones de acción (ahora modifican gameState.morocco)
  const A = {
    tab: t => { gameState.morocco.activeTab = t; render(); },
    reg: i => { gameState.morocco.sel = i; render(); },
    invest: i => { if (M().cap < 2 || M().tes < 250) return; M().tes -= 250; M().cap -= 2; M().reg[i].est = clamp(M().reg[i].est + 15); M().log.unshift('Plan de inversión en ' + REG[i][1] + '.'); render(); },
    repress: i => { M().reg[i].est = clamp(M().reg[i].est + 10); M().reg[i].crisis = 0; M().apr = clamp(M().apr - 3); M().log.unshift('Las fuerzas del orden toman ' + REG[i][1] + '.'); render(); },
    neg: p => { const k = 'n' + p; if ((M().cd[k] || 0) > 0 || M().cap < 4) return; M().cap -= 4; M().cd[k] = 20; M().coal[p] = clamp(M().coal[p] + 18); M().log.unshift('Negociación con ' + p + ': refuerza su apoyo.'); render(); },
    aud: () => { if ((M().cd.aud || 0) > 0 || M().cap < 5) return; M().cap -= 5; M().cd.aud = 40; M().palace = clamp(M().palace + 10); M().log.unshift('Audiencia con el Rey: sube la confianza del Palacio.'); render(); },
    pol: id => { const x = POL.find(p => p.id === id), k = 'p' + id; if (!x || (M().cd[k] || 0) > 0 || M().cap < x.cap || M().tes < x.cost) return; M().cap -= x.cap; M().tes -= x.cost; M().cd[k] = x.cd; Object.keys(x.P).forEach(k => { M()[k] = clamp(M()[k] + x.P[k]); }); if (x.ES || x.rel) MP.send({ t: 'd', k: 'fx', fx: x.ES || {}, rel: x.rel || 0, txt: 'Marruecos aprueba: ' + x.t + '.' }); if (x.rel) MP.rel(x.rel); M().log.unshift('Decreto: ' + x.t + '.'); render(); },
    bud: (id, v) => { M().bud[id] = clamp(Math.round(+v)); render(); },
    army: b => { if ((M().cd['a' + b] || 0) > 0 || M().cap < 3 || M().tes < 400) return; M().cap -= 3; M().tes -= 400; M().cd['a' + b] = 30; M().army[b] = clamp(M().army[b] + 6); M().log.unshift('Modernización de las fuerzas: ' + b + '.'); render(); },
    evt: i => { const e = EVS[M().evt], o = e && e.opts[i]; if (!o) return; if (o.tes) M().tes += o.tes; Object.keys(o.P || {}).forEach(k => { M()[k] = clamp(M()[k] + o.P[k]); }); if (o.ES || o.rel) MP.send({ t: 'd', k: 'fx', fx: o.ES || {}, rel: o.rel || 0, txt: 'Marruecos: ' + e.title + '.' }); if (o.rel) MP.rel(o.rel); M().log.unshift(e.title + ' → ' + o.t.replace(/ \(.*\)$/, '') + '.'); M().evt = null; render(); }
  };

  // --- Renderizado de la interfaz (se llamará desde renderTabContent) ---
  function renderMoroccoTab() {
    const m = M();
    if (!m) return '<div class="hoi-box p-8 text-center text-slate-400">Cargando Marruecos...</div>';

    const bar = (l, v) => { v = Math.round(v); return `<div><div class="flex justify-between text-[10px] text-slate-400"><span>${l}</span><span class="font-mono">${v}</span></div><div class="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800"><div class="h-full ${v >= 60 ? 'bg-emerald-500' : v >= 35 ? 'bg-amber-500' : 'bg-red-500'}" style="width:${v}%"></div></div></div>`; };
    const box = (t, inner) => `<div class="hoi-box p-4 rounded-xl space-y-2 font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">${t}</div>${inner}</div>`;
    const btn = (f, t, off) => `<button ${off ? 'disabled' : `onclick="${f}"`} class="hoi-button px-3 py-1.5 rounded text-[11px] ${off ? 'opacity-50' : ''}">${t}</button>`;
    const cdl = k => m.cd[k] || 0;

    // Mapa de regiones
    const map = REG.map((r, i) => { const g = m.reg[i], col = g.est < 35 ? '#ef4444' : g.est < 55 ? '#d9a726' : '#22c55e'; return `<polygon points="${pts(r[2])}" fill="${col}" fill-opacity=".5" stroke="${m.sel === i ? '#fff' : '#0b0f12'}" stroke-width="${m.sel === i ? 2.5 : 1}" class="${g.crisis ? 'ma-pulse' : ''}" style="cursor:pointer" onclick="MA.reg(${i})"><title>${r[1]}</title></polygon>`; }).join('');

    // Pestañas
    const tabs = [['main', 'Mando y mapa'], ['gov', 'Gobierno'], ['eco', 'Economía'], ['mil', 'Militar'], ['dip', 'Diplomacia']].map(([k, l]) => `<button onclick="MA.tab('${k}')" class="${m.activeTab === k ? 'hoi-button-gold' : 'hoi-button'} px-3 py-1.5 rounded text-xs">${l}</button>`).join('');

    let body = '';
    if (m.activeTab === 'gov') {
        const co = PARTIES.map(([p, n]) => `<div class="flex items-center gap-3"><div class="flex-1">${bar(p + ' · ' + n, m.coal[p])}</div>${btn("MA.neg('" + p + "')", cdl('n' + p) ? cdl('n' + p) + 'd' : 'Negociar · 4 cap.', cdl('n' + p) > 0)}</div>`).join('');
        const pol = POL.map(x => { const off = cdl('p' + x.id) > 0; return `<button ${off ? 'disabled' : `onclick="MA.pol('${x.id}')"`} class="hoi-button p-2 rounded text-[11px] text-left ${off ? 'opacity-50' : ''}"><div><b>${x.t}</b> <span class="text-slate-400">· ${x.cost} M€ · ${x.cap} cap.</span></div><div class="text-slate-400 font-sans">${x.d}</div><div class="text-[10px] text-slate-500">${off ? 'Disponible en ' + cdl('p' + x.id) + ' días' : Object.keys(x.P).map(k => k + ' ' + (x.P[k] > 0 ? '+' : '') + x.P[k]).join(' · ')}</div></button>`; }).join('');
        body = box('COALICIÓN DE GOBIERNO (si un socio cae por debajo de 20, el Gobierno se rompe)', co + `<div class="flex items-center gap-3"><div class="flex-1">${bar('Palacio Real', m.palace)}</div>${btn('MA.aud()', cdl('aud') ? cdl('aud') + 'd' : 'Audiencia · 5 cap.', cdl('aud') > 0)}</div>`) + '<div class="h-3"></div>' + box('DECRETOS', `<div class="grid grid-cols-1 md:grid-cols-2 gap-2">${pol}</div>`);
    } else if (m.activeTab === 'eco') {
        const inc = 10 * (0.6 + m.eco / 100) - 1 - m.army.tierra/50*1.5, out = BUD.reduce((t, b) => t + m.bud[b.id] / 50 * b.cost, 0), bal = inc - out;
        body = box('PRESUPUESTO', `<div class="flex justify-between text-xs"><span>Ingresos ${inc.toFixed(1)} M€/día</span><span>Gastos ${out.toFixed(1)} M€/día</span><b class="${bal >= 0 ? 'text-emerald-400' : 'text-red-400'}">Balance ${bal >= 0 ? '+' : ''}${bal.toFixed(1)}</b></div>` + BUD.map(b => `<div><div class="flex justify-between text-[11px]"><span><i class="fa-solid ${b.ic} mr-1 text-amber-400"></i>${b.t}</span><span class="font-mono">${m.bud[b.id]}% · ${(m.bud[b.id] / 50 * b.cost).toFixed(1)} M€/día</span></div><input type="range" min="0" max="100" value="${m.bud[b.id]}" class="w-full" onchange="MA.bud('${b.id}',this.value)"><div class="text-[10px] text-slate-500 font-sans">${b.d}</div></div>`).join(''));
    } else if (m.activeTab === 'mil') {
        const nm = { tierra: ['fa-person-rifle', 'Ejército de Tierra'], mar: ['fa-ship', 'Marina Real'], aire: ['fa-jet-fighter', 'Fuerza Aérea'] };
        body = box('FUERZAS ARMADAS REALES · poder ' + MP.adapter().mil(), Object.keys(m.army).map(b => `<div class="flex items-center gap-3"><div class="flex-1">${bar('<i class="fa-solid ' + nm[b][0] + ' mr-1"></i>' + nm[b][1], m.army[b])}</div>${btn("MA.army('" + b + "')", cdl('a' + b) ? cdl('a' + b) + 'd' : 'Modernizar · 400 M€ · 3 cap.', cdl('a' + b) > 0)}</div>`).join('') + '<p class="text-[11px] text-slate-500 font-sans">Tu poder militar decide los ataques que lances y cómo resistes los que recibas. Sin mantenimiento, las fuerzas pierden nivel poco a poco.</p>');
    } else if (m.activeTab === 'dip') {
        body = MP.panel();
    } else { // 'main'
        const i = m.sel, sel = i == null ? '<div class="text-[11px] text-slate-500">Pulsa una región del mapa para gestionarla.</div>' : `<div class="text-sm text-slate-100"><b>${REG[i][1]}</b></div>${bar('Estabilidad regional', m.reg[i].est)}${m.reg[i].crisis ? '<div class="text-[11px] text-red-400">⚠ Disturbios en curso</div>' : ''}<div class="flex gap-2 flex-wrap">${btn('MA.invest(' + i + ')', 'Invertir 250 M€ · 2 cap.')}${m.reg[i].crisis ? btn('MA.repress(' + i + ')', 'Reprimir (−3 aprobación)') : ''}</div>`;
        const e = m.evt != null ? EVS[m.evt] : null;
        body = `<div class="grid grid-cols-1 md:grid-cols-2 gap-3"><div>${box('MAPA DE MARRUECOS', `<svg viewBox="0 0 340 330" class="w-full" style="max-height:440px">${map}</svg>`)}</div>
          <div class="space-y-3">${box('ESTADO DEL PAÍS', bar('Economía', m.eco) + bar('Estabilidad', m.est) + bar('Aprobación', m.apr) + bar('Poder militar', MP.adapter().mil()) + bar('Confianza del Palacio', m.palace))}
          ${box('REGIÓN', sel)}
          ${e ? `<div class="hoi-box p-4 rounded-xl border-sky-500/60 space-y-2"><b class="text-sky-300 text-sm">${e.title}</b><p class="text-[11px] text-slate-400 font-sans">${e.desc}</p>${e.opts.map((o, k) => `<button onclick="MA.evt(${k})" class="hoi-button w-full p-2 rounded text-[11px] text-left">${o.t}</button>`).join('')}</div>` : ''}
          ${box('REGISTRO', m.log.map(l => `<div class="text-[11px] text-slate-400">${l}</div>`).join(''))}</div></div>`;
    }

    return `<div class="space-y-3">
      <div class="flex items-center gap-3 p-2 bg-slate-900/90 border border-slate-800 rounded font-hoi-tech text-xs">
        <b class="text-amber-400 text-lg font-hoi-header">🇲🇦 MARRUECOS</b>
        <span class="text-slate-400">${m.name}</span>
        <span>Día ${m.day}</span>
        <span>💰 ${Math.round(m.tes)} M€</span>
        <span>🏛 ${Math.floor(m.cap)}</span>
      </div>
      <div class="flex gap-2 flex-wrap">${tabs}</div>
      ${body}
    </div>`;
  }

  // Exportar funciones para el objeto global
  window.MA = A;
  window.initMorocco = initMorocco;
  window.renderMoroccoTab = renderMoroccoTab;

  // El bucle de Marruecos ahora se llama desde el bucle principal de gameTick
  window.moroccoTick = function() {
    const m = M();
    if (!m || gameState.step !== 4) return;
    m.day++;
    m.cap = Math.min(60, m.cap + 0.3);
    m.tes += 10 * (0.6 + m.eco / 100) - 1 - m.army.tierra / 50 * 1.5;
    BUD.forEach(b => { const l = m.bud[b.id]; m.tes -= l / 50 * b.cost; Object.keys(b.fx).forEach(k => { m[k] = clamp(m[k] + (l - 50) * b.fx[k]); }); });
    if (m.tes < 0) { m.eco = clamp(m.eco - 0.08); m.apr = clamp(m.apr - 0.06); }
    m.apr = clamp(m.apr + (m.eco - 50) * 0.002 + (m.est - 50) * 0.002 - 0.01 - m.reg.filter(r => r.crisis).length * 0.04);
    m.est = clamp(m.est + (m.apr - 50) * 0.002 + (m.palace - 50) * 0.0004 - (m.apr < 35 ? 0.05 : 0));
    m.eco = clamp(m.eco + (Math.random() - 0.5) * 0.1 + (50 - m.eco) * 0.001);
    m.palace = clamp(m.palace + (m.apr - 50) * 0.002 - 0.005);
    Object.keys(m.army).forEach(k => { m.army[k] = clamp(m.army[k] - 0.01); });
    PARTIES.forEach(([p]) => { m.coal[p] = clamp(m.coal[p] + (m.apr - 50) * 0.003 - 0.02); });
    m.reg.forEach((r, i) => { r.est = clamp(r.est + (m.est - r.est) * 0.01 + (Math.random() - 0.5) * 0.6); if (!r.crisis && r.est < 35 && Math.random() < 0.02) { r.crisis = 1; m.log.unshift('Disturbios en ' + REG[i][1] + '.'); } if (r.crisis && r.est > 50) r.crisis = 0; });
    Object.keys(m.cd).forEach(k => { if (m.cd[k] > 0) m.cd[k]--; });
    try { MP.daily(gameState.mp.adapter, m.day); } catch (e) { /* sin sala */ }
    if (m.evt == null && m.day >= m.next) { m.evt = Math.floor(Math.random() * EVS.length); m.next = m.day + 40 + Math.floor(Math.random() * 40); m.log.unshift('Suceso: ' + EVS[m.evt].title + '.'); }
    if (Math.min(m.coal.RNI, m.coal.PAM, m.coal.IST) < 20) { PARTIES.forEach(([p]) => { m.coal[p] = 50; }); m.palace = clamp(m.palace - 10); m.apr = clamp(m.apr - 8); m.est = clamp(m.est - 6); m.log.unshift('CRISIS DE GOBIERNO: la coalición se rompe y se reforma tras la mediación del Palacio.'); MP.adapter().toast('Crisis de gobierno: la coalición se ha roto.'); }
    if (gameState.activeTab === 'morocco') render();
  };
})();
