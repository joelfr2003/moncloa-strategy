// =====================================================================
//  MARRUECOS — VISTA DEL JUGADOR SOCIO (reloj compartido con España)
//  No tiene temporizador propio: recibe latidos del host vía MP.
//  La UI replica la de España adaptada a Marruecos (dashboard, gobierno,
//  economía, militar, diplomacia). Todas las acciones viajan por red.
// =====================================================================
(function () {
  'use strict';
  const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const fmt = n => Math.round(n).toLocaleString('es-ES');

  // El estado del socio llega en guest.s.m.P (lo envía multijugador.js)
  let guest = null, root = null, lastSnap = null;

  // ---------------- Helpers de lectura ----------------
  const S = () => (guest && guest.s ? guest.s.m : null);
  const P = () => (S() ? S().P : null);
  const C = () => (typeof MP !== 'undefined' ? MP.COUNTRIES[S() ? S().partner : 'MA'] : null);
  const stat = (k) => (P() ? Math.round(P()[k] || 0) : 0);
  const tes = () => (P() ? Math.round(P().tes || 0) : 0);
  const cap = () => (P() ? Math.floor(P().cap || 0) : 0);
  const day = () => (guest && guest.s ? guest.s.day : 0);
  const paused = () => !!(guest && guest.s && (guest.s.pause || !guest.s.speed));
  const speed = () => (guest && guest.s ? (guest.s.speed || 0) : 0);

  const bar = (l, v) => { v = Math.round(v); return `<div><div class="flex justify-between text-[10px] text-slate-400"><span>${l}</span><span class="font-mono">${v}</span></div><div class="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800"><div class="h-full ${v >= 60 ? 'bg-emerald-500' : v >= 35 ? 'bg-amber-500' : 'bg-red-500'}" style="width:${v}%"></div></div></div>`; };
  const btn = (f, t, off, c) => `<button ${off ? 'disabled' : `onclick="${f}"`} class="${c || 'hoi-button'} px-3 py-1.5 rounded text-[11px] ${off ? 'opacity-50' : ''}">${t}</button>`;
  const box = (t, inner) => `<div class="hoi-box p-4 rounded-xl space-y-2 font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">${t}</div>${inner}</div>`;

  // ---------------- Vistas ----------------
  function viewMain() {
    const p = P(); if (!p) return '';
    const c = C();
    return `<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>${box('ESTADO DEL PAÍS', bar('Economía', p.eco) + bar('Estabilidad', p.est) + bar('Aprobación', p.apr) + bar('Poder militar', p.mil || 50) + bar('Empleo', p.emp || 50))}
        ${box('MARRUECOS', `<p class="text-[11px] text-slate-300 font-sans">Gobiernas ${c.name}. Compartes día, fecha y velocidad con España. Tus decisiones se aplican en la partida del anfitrión y afectan a la relación bilateral.</p>`)}</div>
      <div>${box('TESORERÍA Y CAPITAL', `<div class="flex justify-between text-xs"><span>Fondos</span><b class="text-amber-300">${fmt(tes())} M€</b></div><div class="flex justify-between text-xs"><span>Capital político</span><b class="text-sky-300">${cap()}/60</b></div>`)}
        ${box('RELACIÓN CON ESPAÑA', `<div class="flex justify-between text-xs"><span>Relación bilateral</span><b class="text-emerald-300">${Math.round(guest.s.rel || 0)}/100</b></div><div class="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800"><div class="h-full bg-emerald-500" style="width:${Math.round(guest.s.rel || 0)}%"></div></div>`)}
        ${box('REGISTRO', (S().log || []).map(l => `<div class="text-[11px] text-slate-400"><span class="text-slate-600 font-mono">día ${l.d}</span> · ${l.t}</div>`).join('') || '<div class="text-[11px] text-slate-600">Sin movimientos todavía.</div>')}</div></div>`;
  }
  function viewGov() {
    const m = S(), c = C();
    const pol = c.policies.map(x => { const cd = (m.cd['Ppol' + x.id] || 0), off = cd > 0 || cap() < x.cap || tes() < x.cost;
      return `<button ${off ? 'disabled' : ''} onclick="MORO.pol('${x.id}')" class="hoi-button p-2 rounded text-[11px] text-left ${off ? 'opacity-50' : ''}"><div><b>${x.t}</b> <span class="text-slate-400">· ${x.cost} M€ · ${x.cap} cap.</span></div><div class="text-slate-400 font-sans">${x.d}</div><div class="text-[10px] text-slate-500">${cd ? 'Disponible en ' + cd + ' días' : Object.keys(x.P).map(k => k + ' ' + (x.P[k] > 0 ? '+' : '') + x.P[k]).join(' · ') + (x.ES ? ' · efecto en España' : '')}</div></button>`; }).join('');
    return box('DECRETOS DE MARRUECOS', `<div class="grid grid-cols-1 md:grid-cols-2 gap-2">${pol}</div>`);
  }
  function viewEco() {
    const m = S(), c = C(), P = m.P;
    const inc = c.income * (0.6 + P.eco / 100) - 1, out = c.budget.reduce((t, b) => t + (P.bud[b.id] / 50) * b.cost, 0), bal = inc - out;
    const rows = c.budget.map(b => { const v = P.bud[b.id]; return `<div class="space-y-1"><div class="flex justify-between text-[11px]"><span><i class="fa-solid ${b.ic} mr-1 text-amber-400"></i>${b.t}</span><span class="font-mono">${v}% · ${(v / 50 * b.cost).toFixed(1)} M€/día</span></div><input type="range" min="0" max="100" value="${v}" class="w-full" onchange="MORO.bud('${b.id}',this.value)"><div class="text-[10px] text-slate-500 font-sans">${b.d}</div></div>`; }).join('');
    return box('PRESUPUESTO DE MARRUECOS', `<div class="flex justify-between text-xs"><span>Ingresos ${inc.toFixed(1)} M€/día</span><span>Gastos ${out.toFixed(1)} M€/día</span><b class="${bal >= 0 ? 'text-emerald-400' : 'text-red-400'}">Balance ${bal >= 0 ? '+' : ''}${bal.toFixed(1)}</b></div>${rows}`);
  }
  function viewMil() {
    const p = P();
    return box('FUERZAS ARMADAS REALES', bar('Poder militar', p.mil || 50) + `<p class="text-[11px] text-slate-500 font-sans">Mismo estilo que España: la lealtad militar decide ataques y defensas. Las operaciones militares aún no están activas en el lado socio.</p>`);
  }

  function draw() {
    if (!root || !guest || !guest.s) return;
    const s = guest.s, m = s.m, c = C();
    const tabs = [['main', 'Mando y mapa'], ['gov', 'Gobierno'], ['eco', 'Economía'], ['mil', 'Militar'], ['dip', 'Diplomacia']].map(([k, l]) => `<button onclick="MORO.tab('${k}')" class="${m.tab === k ? 'hoi-button-gold' : 'hoi-button'} px-3 py-1.5 rounded text-xs">${l}</button>`).join('');
    const body = { main: viewMain, gov: viewGov, eco: viewEco, mil: viewMil, dip: () => '' }[m.tab || 'main']();
    const sp = s.speed || 0;
    const speedBtns = [0, 1, 2, 3].map(n => `<button onclick="MP.speed(${n})" class="${sp === n ? 'hoi-button-gold' : 'hoi-button'} px-2 py-1 rounded">${['⏸', '▶', '▶▶', '▶▶▶'][n]}</button>`).join('');
    root.innerHTML = `<div class="flex flex-wrap items-center gap-3 p-3 border-b border-slate-800 bg-slate-950 font-hoi-tech text-xs sticky top-0 z-10"><b class="text-amber-400 text-lg font-hoi-header">${c.flag} ${c.name.toUpperCase()}</b><span class="text-slate-400">${m.gn || 'Jugador 2'}</span><span>Día ${s.day}</span><span class="flex gap-1">${speedBtns}</span><span>💰 ${fmt(tes())} M€</span><span>🏛 ${cap()}</span><button onclick="MP.leave()" class="hoi-button px-2 py-1 rounded text-slate-400 ml-auto">Salir</button></div>
      <div class="max-w-5xl mx-auto p-3 space-y-3"><div class="flex gap-2 flex-wrap">${tabs}</div>${body}</div>`;
  }

  // ---------------- API expuesta ----------------
  window.MORO = {
    show(g) { guest = g; if (!root) { root = document.createElement('div'); root.id = 'moro-root'; root.style.cssText = 'position:fixed;inset:0;z-index:100000;overflow-y:auto;background:#0b0f12;color:#e2e8f0'; document.body.appendChild(root); } draw(); },
    hide() { if (root) { root.remove(); root = null; } },
    tab(k) { if (guest && guest.s) { guest.s.m.tab = k; draw(); } },
    pol(id) { if (guest) MP.sendX({ kind: 'pol', id }); },
    bud(id, v) { if (guest) MP.sendX({ kind: 'bud', id, v }); },
    onMsg(d) { if (d && d.kind === 'snap') { if (guest) { guest.s = d.s; draw(); } } }
  };
})();
