/* ARMAMENTO.JS — Árbol de mejoras militares, servicio militar y piloto automático de guerra para MONCLOA STRATEGY.
   · Barra de guerra con estado claro, siguiente paso recomendado y dos interruptores: decisiones automáticas y operaciones automáticas.
   · Pestañas "Mejoras" (árbol de armamento) y "Reclutamiento" (voluntario / obligatorio / profesional) dentro de Militar y Guerra. */
(function () {
  'use strict';
  const K = () => (window.COUNTRY_ECON && COUNTRY_ECON.k) || 1;
  const WR = () => gameState.wr || (gameState.wr = {});
  const day = () => gameState.daysInOffice || 0;
  const fmt = n => Math.round(n).toLocaleString('es-ES');
  const tg = (m, c) => { try { goalsToast(m, c || '#d9a726'); } catch (e) { /* sin aviso */ } };
  const M = (k, v) => { try { focusMetricAdd(k, v); } catch (e) { /* sin métrica */ } };
  const money = () => Number(gameState.treasury) || 0;
  const cash = (t, v) => { try { registerFinancialTransaction(t, v); } catch (e) { /* sin tesorería */ } };
  function A() {
    const g = gameState; if (!g.arm) g.arm = { dec: false, ops: false, done: {}, rs: null, svc: 'vol', svcCd: 0, acc: {}, lastBaj: 0, hist: [] };
    return g.arm;
  }
  const acc = (k, v) => { const a = A().acc; a[k] = (a[k] || 0) + v; if (Math.abs(a[k]) >= 1) { const q = Math.trunc(a[k]); M(k, q); a[k] -= q; } };

  /* ---------- árbol de mejoras ---------- */
  // [id, rama, nombre, descripción, requisitos, coste, días, efectos {t,m,a,off,cas,sup,mun}]
  const TREE = [
    ['t1', 'Tierra', 'Blindados modernos', 'Carros de combate de nueva generación.', [], 2500, 20, { t: 4 }],
    ['t2', 'Tierra', 'Artillería de precisión', 'Fuego guiado sobre el frente.', ['t1'], 3500, 30, { t: 5, off: .05 }],
    ['t3', 'Tierra', 'Protección y armadura reactiva', 'Menos bajas en combate terrestre.', ['t2'], 4500, 35, { cas: .10 }],
    ['t4', 'Tierra', 'Fuerzas especiales', 'Unidades de élite para romper líneas.', ['t2'], 4000, 35, { t: 3, off: .08 }],
    ['m1', 'Mar', 'Submarinos de ataque', 'Dominio bajo el agua.', [], 3000, 25, { m: 5 }],
    ['m2', 'Mar', 'Misiles antibuque', 'Negación del mar al enemigo.', ['m1'], 3500, 30, { m: 4, off: .04 }],
    ['m3', 'Mar', 'Grupo de combate naval', 'Proyección de poder en alta mar.', ['m2'], 6000, 45, { m: 6, off: .05 }],
    ['a1', 'Aire', 'Cazas de nueva generación', 'Superioridad en el aire.', [], 3200, 25, { a: 5 }],
    ['a2', 'Aire', 'Defensa antiaérea integrada', 'Protege tropas y ciudades: menos bajas.', ['a1'], 3500, 30, { cas: .08 }],
    ['a3', 'Aire', 'Drones de ataque', 'Ataques baratos y constantes.', ['a1'], 3800, 30, { off: .07 }],
    ['a4', 'Aire', 'Dominio total del espacio aéreo', 'La cima de tu fuerza aérea.', ['a2', 'a3'], 6500, 50, { a: 6, off: .06 }],
    ['l1', 'Logística', 'Depósitos y trenes de abastecimiento', 'Las tropas consumen menos suministros.', [], 2000, 20, { sup: .10 }],
    ['l2', 'Logística', 'Inteligencia y guerra electrónica', 'Ventaja informativa sobre el enemigo.', ['l1'], 3000, 30, { off: .05 }],
    ['l3', 'Logística', 'Sanidad de campaña', 'Más soldados sobreviven a las heridas.', ['l1'], 3000, 25, { cas: .12 }],
    ['l4', 'Logística', 'Economía de guerra', 'Reservas de munición y producción acelerada.', ['l2'], 4500, 40, { mun: 20, sup: .08 }]
  ];
  const T = id => TREE.filter(n => n[0] === id)[0];
  const bonus = k => TREE.reduce((s, n) => s + (A().done[n[0]] ? (n[7][k] || 0) : 0), 0);
  const cost = n => Math.round(n[5] * K() / 50) * 50 || 50;
  const BR = { 'Tierra': '#34d399', 'Mar': '#38bdf8', 'Aire': '#fbbf24', 'Logística': '#c084fc' };
  const fxText = e => [e.t && '+' + e.t + ' Tierra', e.m && '+' + e.m + ' Armada', e.a && '+' + e.a + ' Aire', e.off && '+' + Math.round(e.off * 100) / 100 + ' al frente/día', e.cas && '−' + Math.round(e.cas * 100) + ' % bajas', e.sup && '−' + Math.round(e.sup * 100) + ' % consumo', e.mun && '+' + e.mun + ' munición'].filter(Boolean).join(' · ');
  window.armResearch = function (id) {
    const a = A(), n = T(id), W = WR(); if (!n || a.done[id]) return;
    if (a.rs) return tg('Ya hay una investigación en curso.');
    if (n[4].some(r => !a.done[r])) return tg('Faltan mejoras previas.', '#ef4444');
    if (money() < cost(n)) return tg('Tesorería insuficiente (' + fmt(cost(n)) + ' M).', '#ef4444');
    cash('Investigación militar: ' + n[2], -cost(n)); a.rs = { id, end: day() + n[6] }; tg('<b>Investigación iniciada:</b> ' + n[2] + ' (' + n[6] + ' días)'); render();
  };
  function finish(id) {
    const a = A(), n = T(id), W = WR(), e = n[7]; a.done[id] = 1; a.rs = null;
    ['t', 'm', 'a'].forEach(k => { if (e[k]) W[k] = Math.min(100, (W[k] || 0) + e[k]); });
    if (e.sup) W.genSup = (W.genSup || 0) + e.sup; if (e.mun) W.mun = Math.min(100, (W.mun || 0) + e.mun);
    M('mil', 1); try { fxPlay('ok'); } catch (x) { /* sin audio */ }
    tg('<i class="fa-solid fa-flask text-sky-400"></i> <b>MEJORA COMPLETADA:</b> ' + n[2] + '<br><span class="text-xs">' + fxText(e) + '</span>', '#10b981');
  }
  window.armTree = function () {
    const a = A(), d = day();
    const card = n => {
      const done = a.done[n[0]], ing = a.rs && a.rs.id === n[0], lock = n[4].some(r => !a.done[r]), col = BR[n[1]];
      const st = done ? '<b style="color:#34d399">✔ Completada</b>' : ing ? '<b style="color:#fbbf24">Investigando… ' + Math.max(0, a.rs.end - d) + ' d</b>' : lock ? '<span style="color:#64748b">Bloqueada · requiere ' + n[4].map(r => T(r)[2]).join(' + ') + '</span>'
        : `<button onclick="armResearch('${n[0]}')" style="background:#1e293b;border:1px solid ${col};color:#f1f5f9;border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer">Investigar · ${fmt(cost(n))} M · ${n[6]} d</button>`;
      return `<div style="background:#0f172a;border:1px solid ${done ? '#065f46' : '#1e293b'};border-left:4px solid ${col};border-radius:8px;padding:8px;opacity:${lock ? .55 : 1}"><b style="font-size:12px;color:#f1f5f9">${n[2]}</b><div style="font-size:10px;color:#94a3b8;margin:2px 0">${n[3]}</div><div style="font-size:10px;color:${col};margin-bottom:4px">${fxText(n[7])}</div>${st}</div>`;
    };
    const cols = Object.keys(BR).map(b => `<div style="display:flex;flex-direction:column;gap:8px"><b style="color:${BR[b]};font-size:13px;letter-spacing:.06em">${b.toUpperCase()}</b>${TREE.filter(n => n[1] === b).map(card).join('')}</div>`).join('');
    const sum = `Mejoras activas: <b>${Object.keys(a.done).length}/${TREE.length}</b> · Ventaja en el frente: <b>+${bonus('off').toFixed(2)}/día</b> · Bajas reducidas: <b>${Math.round(Math.min(.5, bonus('cas')) * 100)} %</b> · Consumo de suministros: <b>−${Math.round(bonus('sup') * 100)} %</b>`;
    return `<div style="display:flex;flex-direction:column;gap:10px"><div style="background:#0b1220;border:1px solid #1e293b;border-radius:10px;padding:10px;font-size:12px;color:#cbd5e1">Árbol de mejoras del armamento. Se investiga una mejora cada vez. Suben tus ejércitos y dan ventajas reales en la guerra. ${sum}</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px">${cols}</div></div>`;
  };

  /* ---------- servicio militar ---------- */
  const SVC = {
    vol: { n: 'Voluntario', d: 'Ejército pequeño pero motivado. Sin impacto político.', t: 0, apr: 0, mil: 0, mo: 0 },
    obl: { n: 'Obligatorio (reemplazo)', d: 'Mucha tropa y más barata, pero impopular entre los jóvenes y las familias.', t: 8, apr: -.03, mil: .02, mo: 250 },
    pro: { n: 'Profesional', d: 'Tropas muy preparadas y bien pagadas: caro, pero popular y eficaz.', t: 3, apr: .01, mil: .03, mo: -350 }
  };
  window.armSvc = function () {
    const a = A(), d = day(), cd = Math.max(0, a.svcCd - d);
    const cards = Object.keys(SVC).map(k => { const s = SVC[k], on = a.svc === k;
      return `<div style="background:#0f172a;border:1px solid ${on ? '#d9a726' : '#1e293b'};border-radius:10px;padding:12px"><b style="color:${on ? '#fbbf24' : '#f1f5f9'};font-size:14px">${s.n}${on ? ' · ACTIVO' : ''}</b><div style="font-size:11px;color:#94a3b8;margin:4px 0">${s.d}</div>
        <div style="font-size:11px;color:#cbd5e1">Ejército de Tierra: <b>+${s.t}</b> · Aprobación: <b>${s.apr > 0 ? 'sube' : s.apr < 0 ? 'baja' : 'neutra'}</b> · Coste mensual: <b>${s.mo > 0 ? 'ahorras ' + fmt(s.mo * K()) : s.mo < 0 ? 'cuesta ' + fmt(-s.mo * K()) : 'normal'} M</b></div>
        ${on ? '' : `<button onclick="armSvcSet('${k}')" style="margin-top:8px;background:#1e293b;border:1px solid #d9a726;color:#f1f5f9;border-radius:6px;padding:5px 10px;font-size:11px;cursor:pointer">Cambiar a este modelo · 5 de capital político</button>`}</div>`; }).join('');
    return `<div style="display:flex;flex-direction:column;gap:10px"><div style="background:#0b1220;border:1px solid #1e293b;border-radius:10px;padding:10px;font-size:12px;color:#cbd5e1">Decide cómo reclutas a tus soldados. El cambio cuesta capital político y no puede repetirse durante 120 días${cd ? ' (disponible en ' + cd + ' d)' : ''}.</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px">${cards}</div></div>`;
  };
  window.armSvcSet = function (k) {
    const a = A(), d = day(), W = WR(); if (a.svc === k) return;
    if (a.svcCd > d) return tg('Cambio no disponible durante ' + (a.svcCd - d) + ' días.', '#ef4444');
    try { if (gameState.goals.capital < 5) return tg('Capital político insuficiente (5).', '#ef4444'); gameState.goals.capital -= 5; } catch (e) { /* sin capital */ }
    W.t = Math.max(0, Math.min(100, (W.t || 0) - SVC[a.svc].t + SVC[k].t)); a.svc = k; a.svcCd = d + 120;
    M('apr', k === 'obl' ? -4 : k === 'pro' ? 1 : 2); tg('<b>Servicio militar:</b> ' + SVC[k].n); render();
  };

  /* ---------- barra de guerra y piloto automático ---------- */
  const OPS = { air: 500, sea: 400, land: 700, cyber: 300, log: 300, prop: 200 };
  const ready = (w, id) => (w.cd && w.cd[id] || 0) <= day() && money() >= OPS[id] * 1.5 && !(id === 'cyber' && !(WR().tech && WR().tech.cyber));
  function advice(w) {
    if (w.sup != null && w.sup < 40 && ready(w, 'log')) return ['log', 'Los suministros están bajos: manda un convoy logístico.'];
    if (ready(w, 'air')) return ['air', w.prog < 0 ? 'Vas perdiendo terreno: un ataque aéreo puede equilibrar el frente.' : 'Aprovecha tu ventaja con un ataque aéreo.'];
    if (w.prog > 10 && ready(w, 'land') && (w.sup == null || w.sup > 45)) return ['land', 'Tienes ventaja y suministros: una ofensiva terrestre puede acelerar la victoria (riesgo alto).'];
    if (ready(w, 'sea')) return ['sea', 'El bloqueo naval debilita al enemigo poco a poco.'];
    if (ready(w, 'cyber')) return ['cyber', 'Un ciberataque debilita al enemigo.'];
    return [null, 'No hay operaciones disponibles ahora: espera a que se enfríen.'];
  }
  window.armBar = function (w) {
    const a = A(), p = w.prog, sup = w.sup == null ? 80 : w.sup, ad = advice(w);
    const st = p > 40 ? ['#34d399', 'VAS GANANDO'] : p > 5 ? ['#a7f3d0', 'Ligera ventaja'] : p > -5 ? ['#fbbf24', 'Frente equilibrado'] : p > -40 ? ['#fb923c', 'Vas perdiendo'] : ['#ef4444', 'EN PELIGRO'];
    const sw = (k, t, h) => `<button onclick="armToggle('${k}')" title="${h}" style="display:flex;align-items:center;gap:6px;background:${a[k] ? '#064e3b' : '#1e293b'};border:1px solid ${a[k] ? '#34d399' : '#475569'};color:#f1f5f9;border-radius:999px;padding:5px 11px;font-size:11px;cursor:pointer"><span style="width:26px;height:14px;border-radius:999px;background:${a[k] ? '#34d399' : '#475569'};position:relative;display:inline-block"><i style="position:absolute;top:2px;${a[k] ? 'right' : 'left'}:2px;width:10px;height:10px;border-radius:50%;background:#0f172a"></i></span>${t}</button>`;
    return `<div style="background:#0b1220;border:1px solid #92400e;border-radius:10px;padding:10px;margin-bottom:10px;display:flex;flex-direction:column;gap:8px">
      <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between"><b style="color:${st[0]};font-size:15px">● ${st[1]} <span style="color:#94a3b8;font-size:11px;font-weight:400">· frente ${Math.round(p)}% · suministros ${Math.round(sup)}%${sup < 30 ? ' ⚠' : ''}</span></b>
        <span style="display:flex;gap:8px;flex-wrap:wrap">${sw('dec', 'Decisiones automáticas', 'Mientras haya guerra, los avisos y eventos se resuelven solos con la opción más equilibrada')}${sw('ops', 'Operaciones automáticas', 'El Estado Mayor lanza operaciones y convoyes por ti')}</span></div>
      <div style="font-size:12px;color:#cbd5e1;display:flex;gap:8px;align-items:center;flex-wrap:wrap"><i class="fa-solid fa-lightbulb" style="color:#fbbf24"></i> <span>${ad[1]}</span>${ad[0] ? `<button onclick="warOp('${ad[0]}')" style="background:#7f1d1d;border:1px solid #ef4444;color:#fff;border-radius:6px;padding:4px 10px;font-size:11px;cursor:pointer">Hacerlo ahora</button>` : ''}</div></div>`;
  };
  window.armToggle = function (k) { const a = A(); a[k] = !a[k]; tg(k === 'dec' ? 'Decisiones automáticas: <b>' + (a.dec ? 'ACTIVADAS' : 'desactivadas') + '</b>' : 'Operaciones automáticas: <b>' + (a.ops ? 'ACTIVADAS' : 'desactivadas') + '</b>'); render(); };

  function score(o) {
    const st = o.stats || {}, w = { eco: 1, est: 1.2, emp: .8, apr: 1.2, mil: .6, con: .5 };
    let s = Object.keys(w).reduce((t, k) => t + (st[k] || 0) * w[k], 0) - (o.cost || 0) / (1500 * K());
    if ((o.cost || 0) > money()) s -= 99; return s;
  }
  function best(opts) { let bi = 0, bs = -1e9; (opts || []).forEach((o, i) => { const s = score(o) + Math.random() * .1; if (s > bs) { bs = s; bi = i; } }); return bi; }
  function autoDecide() {
    const a = A(), w = WR().war; if (!a.dec || !w) return;
    try {
      const ev = gameState.activeDynamicEvent;
      if (ev && ev.options && ev.options.length) { const i = best(ev.options); makeDecision(i); return; }
      const nw = gameState.activeNewsPopup;
      if (nw && nw.options && nw.options.length) { const i = best(nw.options); resolveNewsOption(i); return; }
      const m = document.getElementById('xm-modal');
      if (m && /Parte de operaciones/.test(m.textContent) && typeof window.warOpen === 'function') window.warOpen();
    } catch (e) { console.error('[armamento] auto', e); }
  }
  setInterval(autoDecide, 700);

  function step() {
    const a = A(), W = WR(), w = W.war, d = day();
    if (a.rs && d >= a.rs.end) finish(a.rs.id);
    const s = SVC[a.svc]; if (s.apr) acc('apr', s.apr); if (s.mil) acc('mil', s.mil);
    if (d % 30 === 0 && s.mo) cash('Servicio militar: ' + s.n.toLowerCase(), Math.round(s.mo * K()));
    if (w) {
      if (a.lastBaj > (w.baj || 0)) a.lastBaj = 0;
      const dB = Math.max(0, (w.baj || 0) - a.lastBaj), red = Math.min(.5, bonus('cas'));
      if (red && dB) w.baj -= dB * red;
      w.prog = Math.max(-100, Math.min(100, w.prog + bonus('off')));
      a.lastBaj = w.baj || 0;
      if (a.ops && !document.getElementById('xm-modal') && !gameState.activeDynamicEvent) { const o = advice(w)[0]; if (o && d % 2 === 0) { try { window.warOp(o); } catch (e) { /* sin operación */ } } }
    } else a.lastBaj = 0;
  }
  const _rtc = renderTabContent;
  renderTabContent = function () { const out = _rtc.apply(this, arguments), w = WR().war; return (gameState.activeTab === 'war' && w) ? window.armBar(w) + out : out; };
  const _t = gameTick;
  gameTick = function () { const b = gameState.daysInOffice; _t.apply(this, arguments); if (gameState.daysInOffice !== b && gameState.step === 4) { try { step(); } catch (e) { console.error('[armamento]', e); } } };
})();
