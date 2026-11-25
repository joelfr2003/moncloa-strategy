/* GOBIERNO.JS — Incentivos de gobierno, impacto de demografía y sociedad, anexiones con recursos, elecciones anticipadas,
   aviso de deuda y acceso a Mandato/Logros desde «Ayuda y modo». */
(function () {
  'use strict';
  const day = () => gameState.daysInOffice || 0;
  const M = () => gameState.metrics;
  const budget = () => { try { return (window.MC && MC.budget) || 100000; } catch (e) { return 100000; } };
  const fmt = n => Math.round(n).toLocaleString('es-ES');
  const toast = (h, c) => { try { goalsToast(h, c || '#d9a726'); } catch (e) { /* sin aviso */ } };
  const acc = (k, v) => { try { focusAccum(focusInit(), k, v); } catch (e) { try { focusMetricAdd(k, v); } catch (e2) { /* sin métricas */ } } };
  const cp = v => { try { goalsInit(); gameState.goals.capital = Math.max(0, Math.min(100, (gameState.goals.capital || 0) + v)); } catch (e) { /* sin capital */ } };
  const live = () => gameState.step === 4 && M() && !gameState.coupActive;

  // ============ 1) INICIATIVA DE GOBIERNO: gobernar activamente se recompensa (sin dinero) ============
  const ini = () => gameState.ini || (gameState.ini = { d: 0, b: 0, p: 0, streak: 0, idle: 0, wk: 0, tot: 0, last: -1 });
  const QUOTA = { d: 3, b: 1, p: 1 };
  function act(k) {
    const I = ini(); I[k]++; I.tot++;
    cp(k === 'b' ? 2 : 1);
    acc(k === 'b' ? 'est' : 'apr', k === 'b' ? 0.6 : 0.4);
    if (I[k] === QUOTA[k]) toast('<i class="fa-solid fa-circle-check text-emerald-400"></i> <b>Objetivo semanal cumplido</b>: ' + { d: 'decisiones', b: 'decretos', p: 'prensa' }[k], '#10b981');
  }
  function weekly() {
    const I = ini(); let met = 0;
    Object.keys(QUOTA).forEach(k => { if (I[k] >= QUOTA[k]) met++; });
    const total = I.d + I.b + I.p;
    if (met === 3) {
      I.streak++; I.idle = 0; cp(4); acc('apr', 2); acc('est', 1.5);
      toast('<i class="fa-solid fa-gears text-amber-400"></i> <b>SEMANA DE GOBIERNO ACTIVO</b> · racha ' + I.streak + '<br><span class="text-xs">+4 capital político · +2 aprobación · +1,5 estabilidad' + (I.streak >= 3 ? ' · impulso reformista activo (+economía diaria)' : '') + '</span>', '#10b981');
    } else if (total === 0) {
      I.streak = 0; I.idle++;
      if (I.idle >= 2) { acc('apr', -2); acc('est', -1.5); toast('<i class="fa-solid fa-hourglass text-red-400"></i> <b>PARÁLISIS DE GOBIERNO</b><br><span class="text-xs">Llevas ' + I.idle + ' semanas sin decidir nada: −2 aprobación, −1,5 estabilidad.</span>', '#ef4444'); }
    } else { I.idle = 0; if (met < 2) I.streak = 0; }
    I.d = I.b = I.p = 0; I.wk++;
  }
  function bar() {
    const I = ini(), c = (k, n) => '<span class="' + (I[k] >= QUOTA[k] ? 'text-emerald-300' : 'text-slate-300') + '">' + n + ' <b>' + Math.min(I[k], 99) + '/' + QUOTA[k] + '</b></span>';
    const nxt = 7 - (day() % 7 || 7) + 0;
    return '<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] border border-amber-700/40 bg-amber-900/10 rounded px-3 py-1.5 mb-3 font-hoi-tech">'
      + '<b class="text-amber-400"><i class="fa-solid fa-gears mr-1"></i>INICIATIVA DE GOBIERNO</b>' + c('d', 'Decisiones') + c('b', 'Decretos') + c('p', 'Prensa')
      + '<span class="text-sky-300">Racha <b>' + I.streak + '</b></span><span class="text-slate-500">cierra en ' + nxt + ' d · cada decisión da +1 capital político y algo de aprobación; semana completa: bonus; semanas en blanco: parálisis</span>'
      + '<span class="flex-1"></span>' + earlyBtn() + '</div>';
  }

  // ============ 2) ELECCIONES ANTICIPADAS ============
  function earlyOk() { const r = window.MC && MC.regime; return !(r && r.noEarly); }
  function earlyBtn() {
    if (!earlyOk()) return '';
    return '<button onclick="govEarly()" class="hoi-button px-2 py-0.5 rounded text-[10px] cursor-pointer"><i class="fa-solid fa-person-booth mr-1"></i>Adelantar elecciones</button>';
  }
  window.govEarly = function () {
    if (!earlyOk()) { toast('En este régimen no se pueden convocar elecciones anticipadas.', '#ef4444'); return; }
    if (day() < 120) { toast('Es demasiado pronto para convocar elecciones (mínimo 120 días de mandato).', '#d9a726'); return; }
    const apr = Math.round((M() || {}).apr || 0);
    if (!confirm('¿Adelantar las elecciones?\n\nTu aprobación actual es ' + apr + '. Se disolverán las Cortes y se abrirá campaña ya: si estás en buen momento puedes ganar ventaja; si no, puedes perder el poder.')) return;
    try { closeUx(); } catch (e) { /* sin panel */ }
    window.__earlyElec = true;
    try { triggerElectionsWithModal('ELECCIONES ANTICIPADAS', 'Has decidido adelantar las elecciones y disolver las Cortes.'); } finally { setTimeout(() => { window.__earlyElec = false; }, 50); }
  };
  const closeUx = () => { if (typeof uxClose === 'function') uxClose(); };

  // ============ 3) DEMOGRAFÍA CON EFECTO DIRECTO ============
  function demoMonth() {
    const D = gameState.demo; if (!D || !D.b) return;
    const pop = D.b.reduce((a, b) => a + b, 0) || 1, old = D.b[4] / pop, young = D.b[0] / pop, work = (D.b[1] + D.b[2] + D.b[3]) / pop;
    const d1 = (work - 0.62) * 6, d2 = -Math.max(0, old - 0.19) * 14 - Math.max(0, young - 0.26) * 8;
    const g = D.hist && D.hist.length > 12 ? (pop / D.hist[D.hist.length - 13][1] - 1) * 100 : 0;
    const eco = Math.max(-1.2, Math.min(0.8, d1 + (g < -0.3 ? g * 0.8 : g > 0.2 ? Math.min(g, 1) * 0.5 : 0)));
    const est = Math.max(-1.2, Math.min(0.3, d2 + (g > 1.5 ? -0.5 : 0)));
    const emp = Math.max(-0.8, Math.min(0.6, (work - 0.62) * 4 - Math.max(0, young - 0.27) * 6));
    const apr = Math.max(-0.8, Math.min(0.2, -Math.max(0, old - 0.22) * 6));
    acc('eco', eco); acc('est', est); acc('emp', emp); acc('apr', apr);
    gameState.demoFx = { eco, est, emp, apr, old, young, work, g };
    if (day() % 90 === 40 && (eco < -0.25 || est < -0.25)) toast('<i class="fa-solid fa-users text-sky-400"></i> <b>Presión demográfica</b><br><span class="text-xs">' + (old > 0.2 ? 'El envejecimiento tensiona pensiones y estabilidad. ' : '') + (young > 0.27 ? 'La población joven presiona el empleo. ' : '') + (g < -0.3 ? 'La población cae y resta economía.' : '') + '</span>', '#38bdf8');
  }

  // ============ 4) SOCIEDAD Y OPINIÓN CON CONSECUENCIAS ============
  function socMonth() {
    const S = gameState.soc; if (!S || !S.sat) return;
    const ids = Object.keys(S.sat), avg = ids.reduce((a, k) => a + S.sat[k], 0) / Math.max(1, ids.length);
    const apr = (avg - 50) * 0.05, est = (avg - 50) * 0.04, eco = (avg - 50) * 0.02;
    acc('apr', apr); acc('est', est); acc('eco', eco);
    if ((S.press || 0) > 65) acc('apr', -1.2);
    if ((S.mom || 0) > 60) acc('apr', 0.8);
    gameState.socFx = { apr, est, eco, avg };
    const low = ids.filter(k => S.sat[k] <= 20);
    if (low.length && Math.random() < 0.5) {
      const k = low[Math.floor(Math.random() * low.length)]; acc('eco', -2); acc('emp', -1.5); acc('est', -1.5);
      S.sat[k] = Math.min(100, S.sat[k] + 8);
      toast('<i class="fa-solid fa-bullhorn text-red-400"></i> <b>HUELGA Y PROTESTAS</b><br><span class="text-xs">El malestar de un colectivo paraliza el país: −2 economía, −1,5 empleo, −1,5 estabilidad.</span>', '#ef4444');
    }
    const hi = ids.filter(k => S.sat[k] >= 80);
    if (hi.length >= 2) { acc('apr', 1.2); acc('est', 0.8); }
  }
  function socBanner() {
    const f = gameState.socFx; if (!f) return '';
    const s = (v, n) => '<b class="' + (v >= 0 ? 'text-emerald-300' : 'text-red-300') + '">' + (v >= 0 ? '+' : '') + v.toFixed(1) + '</b> ' + n;
    return '<div class="text-[11px] border border-sky-700/40 bg-sky-900/10 rounded px-3 py-1.5 mb-3 font-hoi-tech">Impacto mensual de la opinión (satisfacción media ' + Math.round(f.avg) + '): ' + s(f.apr, 'aprobación') + ' · ' + s(f.est, 'estabilidad') + ' · ' + s(f.eco, 'economía') + ' · con colectivos &lt; 20: huelgas; con ≥ 2 colectivos por encima de 80: bonus de apoyo.</div>';
  }
  function demoBanner() {
    const f = gameState.demoFx; if (!f) return '';
    const s = (v, n) => '<b class="' + (v >= 0 ? 'text-emerald-300' : 'text-red-300') + '">' + (v >= 0 ? '+' : '') + v.toFixed(2) + '</b> ' + n;
    return '<div class="text-[11px] border border-sky-700/40 bg-sky-900/10 rounded px-3 py-1.5 mb-3 font-hoi-tech">Impacto demográfico mensual: ' + s(f.eco, 'economía') + ' · ' + s(f.est, 'estabilidad') + ' · ' + s(f.emp, 'empleo') + ' · ' + s(f.apr, 'aprobación') + ' — población activa ' + Math.round(f.work * 100) + ' %, mayores de 65 ' + Math.round(f.old * 100) + ' %, menores de 15 ' + Math.round(f.young * 100) + ' %.</div>';
  }

  // ============ 5) ANEXIÓN: los recursos del país anexionado son tuyos hasta las elecciones ============
  function annexMonth() {
    const W = gameState.wr; if (!W || !W.terr || !W.terr.length) return;
    let tot = 0;
    W.terr.forEach(t => { if (!t.from) t.from = day(); tot += Math.round(budget() * 0.0012 * (t.s || 40) / 10); });
    if (tot > 0) { try { registerFinancialTransaction('Recursos de países anexionados (control hasta las elecciones)', tot, 'economia'); } catch (e) { /* sin libro */ } acc('eco', 0.4 * W.terr.length); }
  }
  function annexRelease(why) {
    const W = gameState.wr; if (!W || !W.terr || !W.terr.length) return;
    const n = W.terr.map(t => t.n).join(', '); W.terr = [];
    toast('<i class="fa-solid fa-flag text-amber-400"></i> <b>Fin de la anexión</b><br><span class="text-xs">' + n + ' recupera su gobierno ' + why + ' y dejas de controlar sus recursos.</span>', '#d9a726');
  }

  // ============ 6) DEUDA: avisar antes de que el Tesoro emita ============
  function debtWatch() {
    const t = Number(gameState.treasury) || 0;
    if (gameState.autoDebt === false) { if (t < 0 && day() % 30 === 5) toast('<i class="fa-solid fa-triangle-exclamation text-red-400"></i> <b>Tesorería en negativo</b><br><span class="text-xs">Tienes desactivada la emisión automática: recorta gasto o actívala en Finanzas.</span>', '#ef4444'); return; }
    if (t < 40000 && t >= 30000 && day() % 30 === 1) toast('<i class="fa-solid fa-landmark text-amber-400"></i> <b>Tesorería baja</b><br><span class="text-xs">Si cae de 30.000 M€ el Tesoro emitirá deuda por sí solo (es la única forma en que la deuda crece sin que pulses nada).</span>', '#d9a726');
  }
  window.govAutoDebt = function (on) { gameState.autoDebt = !!on; try { render(); } catch (e) { /* sin render */ } };
  function debtPanel() {
    const on = gameState.autoDebt !== false;
    return '<div class="text-[11px] border border-slate-700 bg-slate-900/60 rounded px-3 py-2 mb-3 font-hoi-tech flex flex-wrap items-center gap-3"><b class="text-amber-400"><i class="fa-solid fa-landmark mr-1"></i>EMISIÓN AUTOMÁTICA DE DEUDA</b>'
      + '<span class="text-slate-400">La deuda solo crece por (1) emisiones que tú pulses y (2) el Tesoro cuando la Tesorería baja de 30.000 M€ (se avisa antes). Los intereses salen de la Tesorería, no suman a la deuda.</span>'
      + '<button onclick="govAutoDebt(' + (on ? 'false' : 'true') + ')" class="hoi-button px-2 py-0.5 rounded text-[10px] cursor-pointer">' + (on ? 'Desactivar' : 'Activar') + ' (ahora: ' + (on ? 'ACTIVADA' : 'DESACTIVADA') + ')</button></div>';
  }

  // ============ ENGANCHES ============
  const _md = window.makeDecision;
  if (typeof _md === 'function') makeDecision = function () {
    const blocked = gameState.gameSpeed === 0 && !gameState.activeDynamicEvent;
    const r = _md.apply(this, arguments); if (!blocked) { try { act('d'); } catch (e) { console.error(e); } } return r;
  };
  const _ep = window.enactPolicy;
  if (typeof _ep === 'function') enactPolicy = function () {
    const n = (gameState.pendingPolicies || []).length, r = _ep.apply(this, arguments);
    if ((gameState.pendingPolicies || []).length > n) { try { act('b'); } catch (e) { console.error(e); } } return r;
  };
  const _rn = window.resolveNewsOption;
  if (typeof _rn === 'function') resolveNewsOption = function () {
    const had = !!gameState.activeNewsPopup, r = _rn.apply(this, arguments); if (had) { try { act('p'); } catch (e) { console.error(e); } } return r;
  };
  const _gt = window.gameTick;
  if (typeof _gt === 'function') gameTick = function () {
    const b = gameState.daysInOffice; const r = _gt.apply(this, arguments);
    if (gameState.daysInOffice !== b && live()) {
      const d = day();
      try {
        if (d % 7 === 0 && d > 0) weekly();
        const I = ini(); if (I.streak >= 3) { acc('eco', 0.03); acc('apr', 0.02); }
        if (d % 30 === 10) demoMonth();
        if (d % 30 === 15) socMonth();
        if (d % 30 === 20) annexMonth();
        debtWatch();
      } catch (e) { console.error(e); }
    }
    return r;
  };
  const _te = window.triggerElectionsWithModal;
  if (typeof _te === 'function') triggerElectionsWithModal = function (title) {
    const r = window.MC && MC.regime, blocked = r && r.noEarly && !window.__earlyElec && !/FIN DE LA LEGISLATURA/i.test(String(title || ''));
    if (!blocked) { try { annexRelease('al convocarse elecciones'); } catch (e) { /* sin guerra */ } }
    return _te.apply(this, arguments);
  };
  const _wt = window.warTerm;
  if (typeof _wt === 'function') window.warTerm = function (k) {
    const r = _wt.apply(this, arguments);
    if (k === 'anex') { const t = (gameState.wr.terr || []).slice(-1)[0]; if (t) { t.from = day(); toast('<i class="fa-solid fa-flag text-amber-400"></i> <b>' + t.n + ' ANEXIONADO</b><br><span class="text-xs">Controlas sus recursos (ingresos mensuales) hasta las próximas elecciones.</span>', '#a16207'); } }
    return r;
  };
  const _rt = window.renderTabContent;
  if (typeof _rt === 'function') renderTabContent = function () {
    const t = gameState.activeTab, h = _rt.apply(this, arguments);
    try {
      if (t === 'main' || t === 'boe' || t === 'media') return bar() + h;
      if (t === 'soc') return socBanner() + h;
      if (t === 'fin') return debtPanel() + h;
      if (t === 'demo') return demoBanner() + h;
    } catch (e) { console.error(e); }
    return h;
  };

  // «Mandato y objetivos» y «Logros» salen del menú de decisiones y pasan a «Ayuda y modo»
  const st = document.createElement('style');
  st.textContent = '#tab-btn-goals,#tab-btn-ach{display:none!important}';
  document.head.appendChild(st);
  function hook() {
    const pop = document.getElementById('ux-pop'); if (!pop) return setTimeout(hook, 800);
    const mo = new MutationObserver(() => {
      if (pop.querySelector('#gob-box')) return;
      mo.disconnect();
      const d = document.createElement('div'); d.id = 'gob-box';
      d.innerHTML = '<h4>LOGROS Y MANDATO</h4><div style="display:flex;gap:6px;flex-wrap:wrap">'
        + '<button class="ux-mode" onclick="switchTab(\'goals\');uxClose()"><i class="fa-solid fa-bullseye"></i> Mandato y objetivos</button>'
        + '<button class="ux-mode" onclick="switchTab(\'ach\');uxClose()"><i class="fa-solid fa-trophy"></i> Logros</button></div>'
        + (earlyOk() ? '<h4>ELECCIONES</h4><button class="ux-mode" style="width:100%" onclick="govEarly()"><i class="fa-solid fa-person-booth"></i> Adelantar elecciones</button>' : '');
      pop.appendChild(d);
      mo.observe(pop, { childList: true });
    });
    mo.observe(pop, { childList: true });
  }
  hook();
})();
