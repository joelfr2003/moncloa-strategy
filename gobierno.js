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
      + '<span class="flex-1"></span><button onclick="govReform()" class="hoi-button px-2 py-0.5 rounded text-[10px] cursor-pointer"><i class="fa-solid fa-landmark mr-1"></i>Reforma del Estado</button>' + earlyBtn() + '</div>';
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


  // ============ 7) RELACIONES EXTERIORES: descuidarlas trae aranceles y guerras ============
  const T = () => gameState.tariffs || (gameState.tariffs = {});
  const big = c => c.s >= 40;
  function diploMonth() {
    const W = gameState.wr, C = window.WAR_C; if (!W || !W.rel || !C || day() < 90) return;
    const list = C.filter(big), tf = T(); let good = 0, newT = [];
    list.forEach(c => {
      if (W.rel[c.id] == null) W.rel[c.id] = c.r0;
      if (W.war && W.war.id === c.id) return;
      W.rel[c.id] = Math.max(0, W.rel[c.id] - 0.8);            // las relaciones se enfrían si no se cuidan
      const r = W.rel[c.id];
      if (r <= 35 && !tf[c.id]) { tf[c.id] = { n: c.n, pct: r <= 20 ? 25 : 12, s: c.s }; newT.push(c.n); }
      else if (r >= 50 && tf[c.id]) { toast('<i class="fa-solid fa-handshake text-emerald-400"></i> <b>' + tf[c.id].n + ' levanta los aranceles</b>', '#10b981'); delete tf[c.id]; }
      else if (tf[c.id]) tf[c.id].pct = r <= 20 ? 25 : 12;
      if (r >= 70) good++;
    });
    let cost = 0;
    Object.keys(tf).forEach(k => { const t = tf[k]; cost += budget() * 0.0006 * t.pct / 10 * (t.s || 40) / 40; acc('eco', -0.25 * t.pct / 12); acc('emp', -0.12 * t.pct / 12); });
    if (cost > 0) { try { registerFinancialTransaction('Aranceles impuestos por países hostiles', -Math.round(cost), 'economia'); } catch (e) { /* sin libro */ } }
    if (good) acc('eco', Math.min(1, good * 0.12));
    if (newT.length) toast('<i class="fa-solid fa-ban text-red-400"></i> <b>ARANCELES CONTRA ' + (window.MC && MC.t ? MC.t.nation.toUpperCase() : 'TU PAÍS') + '</b><br><span class="text-xs">' + newT.join(', ') + ' te imponen aranceles por la mala relación. Mejora la relación en Relaciones Exteriores (≥ 50 %) para levantarlos. Por debajo del 30 % pueden declararte la guerra.</span>', '#ef4444');
  }
  function diploBanner() {
    const tf = T(), k = Object.keys(tf), W = gameState.wr || {}, C = window.WAR_C || [];
    const hs = C.filter(c => big(c) && W.rel && W.rel[c.id] != null && W.rel[c.id] <= 40).sort((a, b) => W.rel[a.id] - W.rel[b.id]).slice(0, 6);
    return '<div class="text-[11px] border border-red-800/50 bg-red-900/10 rounded px-3 py-1.5 mb-3 font-hoi-tech"><b class="text-red-300"><i class="fa-solid fa-ban mr-1"></i>ARANCELES Y TENSIÓN</b> '
      + (k.length ? k.map(i => tf[i].n + ' (' + tf[i].pct + ' %)').join(' · ') + ' — cuestan economía, empleo y recaudación cada mes. ' : 'Sin aranceles ahora. ')
      + 'Las relaciones se enfrían solas (−0,8 al mes): cuídalas con acciones diplomáticas. ≤ 35 %: aranceles · ≤ 30 %: riesgo de guerra · ≥ 70 %: ventaja comercial.'
      + (hs.length ? '<br>Más tensas: ' + hs.map(c => c.n + ' ' + Math.round(W.rel[c.id]) + ' %').join(' · ') : '') + '</div>';
  }


  // ============ 8) CRISIS SIN SENTIDO EN PAÍSES FUERA DE LA UE / SIN ELECCIONES ============
  const _eu = window.showEuInterventionModal;
  if (typeof _eu === 'function') showEuInterventionModal = function () {
    if (window.MC && MC.eu) return _eu.apply(this, arguments);
    gameState.euInterventionHandled = true;
    const m = gameState.metrics; m.eco = Math.min(100, m.eco + 15); m.apr = Math.max(0, m.apr - 5);
    toast('<i class="fa-solid fa-building-columns text-amber-400"></i> <b>COLAPSO ECONÓMICO</b><br><span class="text-xs">Sin Unión Europea que intervenga, un rescate de emergencia (aliados / organismos) estabiliza la economía a cambio de recortes: +15 economía, −5 aprobación.</span>', '#d9a726');
    try { render(); } catch (e) { /* sin render */ } return;
  };
  const _mc = window.showMilitaryCoupModal;
  if (typeof _mc === 'function') showMilitaryCoupModal = function () {
    const r = _mc.apply(this, arguments);
    if (window.MC && MC.regime && MC.regime.noEarly) {
      document.querySelectorAll('#app button[onclick*="ELECCIONES"]').forEach(b => b.remove());
    }
    return r;
  };
  const _rmc = window.resolveMilitaryCoup;
  if (typeof _rmc === 'function') resolveMilitaryCoup = function (a) {
    if (a === 'ELECCIONES' && window.MC && MC.regime && MC.regime.noEarly) a = 'RESISTIR';
    return _rmc.call(this, a);
  };


  // ============ 9) REFORMA DEL ESTADO: cambiar nombre del país y régimen ============
  const FORMS = {
    monarquia: { n: 'Monarquía parlamentaria', d: 'Jefatura del Estado hereditaria y Parlamento elegido.', dem: true, fx: { est: 4, apr: -2 }, pre: '' },
    republica: { n: 'República', d: 'Presidente de la República y Parlamento elegido. Ruptura institucional: −6 estabilidad.', dem: true, fx: { est: -6, mil: -4, apr: 3 }, pre: 'República' },
    dictadura: { n: 'Dictadura militar', d: 'Junta militar, sin elecciones anticipadas, resultados controlados. Aislamiento internacional.', dem: false, fx: { est: 10, mil: 12, apr: -15, con: -25 }, pre: 'Estado' },
    fascista: { n: 'Régimen fascista', d: 'Partido único y culto al líder. Aislamiento internacional y rechazo democrático.', dem: false, fx: { est: 12, mil: 8, apr: -10, con: -30 }, pre: 'Estado' },
    socialista: { n: 'Estado socialista de partido único', d: 'Planificación estatal y partido único (estilo URSS). Aislamiento de las democracias.', dem: false, fx: { est: 8, mil: 6, apr: -8, con: -20 }, pre: 'Unión' }
  };
  const REG = () => gameState.reg || (gameState.reg = { name: null, form: null, ord: 0, last: -9999 });
  const regime0 = () => (window.__regime0 === undefined ? (window.__regime0 = (window.MC && MC.regime) || null) : window.__regime0);
  const nat0 = () => (window.__nat0 || (window.__nat0 = MC.t.nation));
  function regApply() {
    if (!window.MC || !MC.t) return; const R = REG(); regime0(); nat0();
    MC.t.nation = R.name || window.__nat0;
    if (R.form && FORMS[R.form]) {
      if (FORMS[R.form].dem) MC.regime = window.__regime0 && !window.__regime0.custom ? window.__regime0 : null;
      else if (!MC.regime || !MC.regime.custom) {
        const my = gameState.leaderPartyId, T = (typeof SEATS_TOTAL === 'number' ? SEATS_TOTAL : 350), b = {};
        if (my) b[my] = { minSeats: Math.ceil(T * 0.7), maxSeats: Math.ceil(T * 0.85) };
        MC.regime = { noEarly: true, custom: true, msg: 'El aparato del régimen neutraliza la crisis con purgas y control del Parlamento.', bounds: b };
      }
    }
    const au = !!(R.form && !FORMS[R.form].dem);
    document.body.classList.toggle('reg-auth', au);
    if (au && gameState.parties && !R.stash) {
      R.stash = JSON.parse(JSON.stringify(gameState.parties)); R.stashCoal = (gameState.coalitionIds || []).slice();
      const my = gameState.leaderPartyId, T = (typeof SEATS_TOTAL === 'number' ? SEATS_TOTAL : 350);
      gameState.parties.forEach(p => { p.seats = p.id === my ? T : 0; }); gameState.coalitionIds = [my];
    }
    if (au) { gameState.isMinorityGov = false; if (['opposition', 'cis'].includes(gameState.activeTab)) { try { switchTab('main'); } catch (e) { /* sin pestaña */ } } }
    const tt = document.querySelector('title'); if (tt && R.name) tt.textContent = R.name.toUpperCase() + ' · MONCLOA STRATEGY';
  }
  const ordinal = n => ['Primera', 'Segunda', 'Tercera', 'Cuarta', 'Quinta', 'Sexta', 'Séptima', 'Octava', 'Novena', 'Décima'][n - 1] || (n + 'ª');
  window.govReform = function () {
    const R = REG(), nat = window.__nat0 || MC.t.nation, cur = R.form ? FORMS[R.form].n : 'Régimen original';
    const cd = Math.max(0, 365 - (day() - R.last));
    const d = document.createElement('div'); d.id = 'gov-reform';
    d.style.cssText = 'position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;padding:16px';
    d.innerHTML = '<div style="max-width:620px;width:100%;background:#0f172a;border:2px solid #d9a726;border-radius:12px;padding:18px;color:#e2e8f0;font-family:system-ui,sans-serif;max-height:92vh;overflow:auto">'
      + '<h3 style="font-size:20px;color:#fbbf24;margin:0 0 4px">REFORMA DEL ESTADO</h3><p style="font-size:12px;color:#94a3b8;margin:0 0 10px">Nombre actual: <b style="color:#e2e8f0">' + MC.t.nation + '</b> · Régimen: <b style="color:#e2e8f0">' + cur + '</b>. Cuesta 25 de capital político y solo se puede reformar una vez al año' + (cd ? ' (faltan ' + cd + ' d)' : '') + '.</p>'
      + (R.form && !FORMS[R.form].dem ? '<p style="font-size:12px;color:#6ee7b7;margin:0 0 8px"><b>Transición democrática:</b> elige Monarquía parlamentaria o República. Los partidos vuelven y se convocan elecciones libres.</p>' : '')
      + '<label style="font-size:11px;color:#94a3b8">Nombre del país (déjalo vacío para mantener / restaurar «' + nat + '»)</label>'
      + '<input id="gov-name" value="' + (R.name || '').replace(/"/g, '') + '" placeholder="p. ej. URSS, República Española, Imperio…" style="width:100%;box-sizing:border-box;margin:4px 0 10px;background:#1e293b;border:1px solid #475569;border-radius:6px;padding:7px;color:#f1f5f9">'
      + '<div style="font-size:11px;color:#94a3b8;margin-bottom:4px">Régimen</div>'
      + '<button onclick="govReformDo(\'\')" style="display:block;width:100%;text-align:left;margin-top:6px;background:#1e293b;border:1px solid #475569;border-radius:8px;padding:8px 10px;color:#f1f5f9;cursor:pointer"><b>Solo cambiar el nombre</b><div style="font-size:11px;color:#94a3b8">Sin tocar el régimen.</div></button>'
      + Object.keys(FORMS).map(k => '<button onclick="govReformDo(\'' + k + '\')" style="display:block;width:100%;text-align:left;margin-top:6px;background:#1e293b;border:1px solid ' + (FORMS[k].dem ? '#475569' : '#b91c1c') + ';border-radius:8px;padding:8px 10px;color:#f1f5f9;cursor:pointer"><b>' + FORMS[k].n + '</b><div style="font-size:11px;color:#94a3b8">' + FORMS[k].d + '</div></button>').join('')
      + '<button onclick="document.getElementById(\'gov-reform\').remove()" style="margin-top:12px;background:none;border:1px solid #475569;border-radius:6px;padding:6px 12px;color:#94a3b8;cursor:pointer">Cancelar</button></div>';
    document.body.appendChild(d); try { uxClose(); } catch (e) { /* sin panel */ }
  };
  window.govReformDo = function (k) {
    const R = REG(), nm = (document.getElementById('gov-name').value || '').trim().slice(0, 40);
    const wasAuth = !!(R.form && !FORMS[R.form].dem), trans = wasAuth && k && FORMS[k].dem;
    if (!trans && day() - R.last < 365 && R.last > -9000) { toast('Ya reformaste el Estado hace menos de un año.', '#d9a726'); return; }
    goalsInit(); if ((gameState.goals.capital || 0) < 25) { toast('Necesitas 25 de capital político para una reforma del Estado.', '#ef4444'); return; }
    if (!k && !nm && !R.name) { toast('Escribe un nombre o elige un régimen.', '#d9a726'); return; }
    let name = nm || null;
    if (k === 'republica' && !nm) { const n0 = window.__nat0 || MC.t.nation; name = n0 === 'España' ? 'Tercera República Española' : 'República de ' + n0.replace(/^(el|la|los|las) /i, ''); }
    if (!k && !nm) name = null;
    gameState.goals.capital -= 25; R.last = day();
    if (name !== undefined) R.name = name;
    if (k) { R.form = k; const f = FORMS[k].fx; Object.keys(f).forEach(m => { gameState.metrics[m] = Math.max(0, Math.min(100, (gameState.metrics[m] || 0) + f[m])); }); if (!FORMS[k].dem) { const W = gameState.wr; if (W && W.rel && window.WAR_C) window.WAR_C.forEach(c => { if (/OTAN|UE/.test(c.b || '') && W.rel[c.id] != null) W.rel[c.id] = Math.max(0, W.rel[c.id] - 15); }); } }
    if (trans) {
      if (R.stash) { gameState.parties = R.stash; gameState.coalitionIds = (R.stashCoal && R.stashCoal.length ? R.stashCoal : [gameState.leaderPartyId]); }
      R.stash = null; gameState.oppositionLoyalty = {};
    }
    regApply();
    const el = document.getElementById('gov-reform'); if (el) el.remove();
    toast('<i class="fa-solid fa-landmark text-amber-400"></i> <b>REFORMA DEL ESTADO</b><br><span class="text-xs">' + MC.t.nation + (k ? ' · ' + FORMS[k].n : '') + '</span>', '#d9a726');
    if (trans) { toast('<b>TRANSICIÓN DEMOCRÁTICA</b><br><span class="text-xs">Vuelven los partidos políticos y se convocan elecciones libres.</span>', '#10b981'); window.__earlyElec = true; try { triggerElectionsWithModal('ELECCIONES DE LA TRANSICIÓN DEMOCRÁTICA', 'Se restablecen los partidos y la libertad de voto.'); } finally { setTimeout(() => { window.__earlyElec = false; }, 50); } }
    try { render(); } catch (e) { /* sin render */ }
  };


  // ============ 10) LA SITUACIÓN DEL PAÍS DECIDE QUÉ DECISIONES Y EVENTOS EXISTEN ============
  const st2 = document.createElement('style');
  st2.textContent = 'body.reg-auth #tab-btn-opposition,body.reg-auth #tab-btn-cis{display:none!important}';
  document.head.appendChild(st2);
  const RX_ROYAL = /\bRey\b|Majestad|Zarzuela|Casa Real|\bCorona\b|Príncipe|Princesa/i;
  const RX_PARL = /oposici[oó]n|moci[oó]n de censura|investidura|Congreso|Cortes|elecciones|electoral|socios|coalici[oó]n|\bCIS\b|sondeo|escaños|diputad|Senado|Parlamento/i;
  function incompatible(ev) {
    const R = REG(); if (!R.form || !ev) return false;
    const txt = [ev.cat, ev.title, ev.desc, ev.headline, ev.text].filter(Boolean).join(' ');
    if (R.form !== 'monarquia' && (ev.cat === 'CASA REAL' || RX_ROYAL.test(txt))) return true;
    if (!FORMS[R.form].dem && RX_PARL.test(txt)) return true;
    return false;
  }
  function purgeEvents() {
    const e = gameState.activeDynamicEvent, n = gameState.activeNewsPopup; let hit = false;
    if (e && incompatible(e) && e.id !== 'GOV_TRANS') { gameState.activeDynamicEvent = null; if (e.id && gameState.triggeredDynamicEvents) gameState.triggeredDynamicEvents = gameState.triggeredDynamicEvents.filter(x => x !== e.id); hit = true; }
    if (n && incompatible(n)) { gameState.activeNewsPopup = null; hit = true; }
    if (hit) { if (!gameState.activeDynamicEvent && !gameState.activeNewsPopup && gameState.gameSpeed === 0) gameState.gameSpeed = 1; try { render(); } catch (e2) { /* sin render */ } }
  }
  // Oferta de transición democrática cuando el régimen autoritario se debilita
  function transOffer() {
    const R = REG(); if (!(R.form && !FORMS[R.form].dem) || gameState.activeDynamicEvent || gameState.activeNewsPopup) return;
    const m = gameState.metrics; if (!(m.apr < 38 || m.est < 35 || (m.con != null && m.con < 25)) || (R.offer && day() - R.offer < 240) || Math.random() > 0.35) return;
    R.offer = day(); gameState.gameSpeed = 0;
    gameState.activeDynamicEvent = { id: 'GOV_TRANS', cat: 'RÉGIMEN', title: 'PRESIÓN PARA UNA TRANSICIÓN DEMOCRÁTICA', desc: 'El descontento social y el aislamiento internacional crecen. Sectores del propio régimen y potencias extranjeras piden apertura: legalizar los partidos y convocar elecciones libres.', condition: () => true,
      options: [{ text: 'Abrir la transición democrática', cost: 0, stats: { apr: 6, con: 12 }, loyaltyImpact: {}, news: 'El régimen anuncia la legalización de los partidos y el inicio de una transición.' }, { text: 'Mantener el régimen y reprimir', cost: 0, stats: { est: 3, apr: -6, con: -6 }, loyaltyImpact: {}, news: 'El régimen rechaza cualquier apertura y refuerza el control.' }] };
    try { render(); } catch (e) { /* sin render */ }
  }
  const _md2 = window.makeDecision;
  if (typeof _md2 === 'function') makeDecision = function (i) {
    const tr = gameState.activeDynamicEvent && gameState.activeDynamicEvent.id === 'GOV_TRANS';
    const r = _md2.apply(this, arguments);
    if (tr && Number(i) === 0) setTimeout(() => { try { govReform(); } catch (e) { console.error(e); } }, 200);
    return r;
  };
  const _gt2 = window.gameTick;
  if (typeof _gt2 === 'function') gameTick = function () {
    const b = gameState.daysInOffice, r = _gt2.apply(this, arguments);
    try { if (gameState.reg) { regApply(); purgeEvents(); if (gameState.daysInOffice !== b && live() && day() % 30 === 5) transOffer(); } } catch (e) { console.error(e); }
    return r;
  };
  // En un régimen sin elecciones libres, el fin de legislatura es un plebiscito de adhesión
  const _te2 = window.triggerElectionsWithModal;
  if (typeof _te2 === 'function') triggerElectionsWithModal = function (title) {
    const R = REG();
    if (R.form && !FORMS[R.form].dem && !window.__earlyElec && /FIN DE LA LEGISLATURA|DIMISI/i.test(String(title || ''))) {
      const sw = Math.round((Math.random() - 0.4) * 12), m = gameState.metrics; m.apr = Math.max(5, Math.min(100, m.apr + sw)); m.est = Math.min(100, m.est + 3);
      gameState.daysInOffice = 1;
      toast('<i class="fa-solid fa-landmark text-amber-400"></i> <b>PLEBISCITO DE ADHESIÓN</b><br><span class="text-xs">No hay elecciones libres: el régimen convoca un plebiscito controlado y se prorroga ' + (sw >= 0 ? 'con aparente respaldo' : 'entre protestas') + '.</span>', '#d9a726');
      try { render(); } catch (e) { /* sin render */ } return;
    }
    return _te2.apply(this, arguments);
  };

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
        if (d % 30 === 25) diploMonth();
        debtWatch();
        if (d % 10 === 0) regApply();
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
      if (gameState.reg) regApply();
      if (t === 'main' || t === 'boe' || t === 'media') return bar() + h;
      if (t === 'soc') return socBanner() + h;
      if (t === 'fin') return debtPanel() + h;
      if (t === 'intl' || t === 'war') return diploBanner() + h;
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
        + '<h4>ESTADO</h4><button class="ux-mode" style="width:100%" onclick="govReform()"><i class="fa-solid fa-landmark"></i> Reforma del Estado (nombre y régimen)</button>' + (earlyOk() ? '<h4>ELECCIONES</h4><button class="ux-mode" style="width:100%" onclick="govEarly()"><i class="fa-solid fa-person-booth"></i> Adelantar elecciones</button>' : '');
      pop.appendChild(d);
      mo.observe(pop, { childList: true });
    });
    mo.observe(pop, { childList: true });
  }
  hook();
})();
