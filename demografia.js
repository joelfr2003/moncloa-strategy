// Demografía de MONCLOA STRATEGY: población, franjas de edad, natalidad, mortalidad, migración y Seguridad Social.
// Se aplica a todos los países. Para ajustar uno, define COUNTRY_ECON.demo = { pop, sh, tfr, mig, mort } en su fichero de país.
(function () {
  'use strict';
  const BANDS = [['0-14', 15, 7.5], ['15-29', 15, 22.5], ['30-44', 15, 37.5], ['45-64', 20, 55], ['65+', 0, 75]];
  // pop: millones · sh: reparto por franjas · tfr: hijos por mujer · mig: saldo migratorio anual (miles) · mort: multiplicador de mortalidad
  const DEMO = {
    espana:    { pop: 49.0, sh: [.13, .17, .22, .29, .19], tfr: 1.12, mig: 300, mort: 1.0 },
    marruecos: { pop: 37.5, sh: [.25, .26, .23, .19, .07], tfr: 2.2,  mig: -40, mort: 1.25 },
    eeuu:      { pop: 335,  sh: [.18, .20, .20, .26, .17], tfr: 1.62, mig: 1000, mort: 1.1 },
    francia:   { pop: 68.5, sh: [.17, .17, .18, .27, .21], tfr: 1.65, mig: 150, mort: 1.0 },
    _generico: { pop: 40,   sh: [.20, .20, .21, .27, .12], tfr: 1.8,  mig: 0,   mort: 1.1 },
    TRANSICION: { pop: 36.0, sh: [.27, .19, .19, .22, .13], tfr: 2.8,  mig: -20, mort: 1.5 }   // España 1977
  };
  const MORT = [.0004, .0006, .0015, .008, .037];   // mortalidad anual por franja
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const fmt = n => Math.round(n).toLocaleString('es-ES');
  const f1 = n => (Math.round(n * 10) / 10).toLocaleString('es-ES');
  const K = () => { try { return (window.MC && MC.k) || 1; } catch (e) { return 1; } };
  const budget = () => { try { return (window.MC && MC.budget) || 100000; } catch (e) { return 100000; } };
  const day = () => gameState.daysInOffice || 0;
  const mil = pop => (pop >= 1 ? f1(pop) + ' M' : fmt(pop * 1e6) + ' hab.');

  function profile() {
    const id = (window.CURRENT_COUNTRY && CURRENT_COUNTRY.id) || 'espana';
    let p = DEMO[id] || DEMO._generico;
    if (id === 'espana' && gameState.scenario && gameState.scenario.id === 'TRANSICION') p = DEMO.TRANSICION;
    try { if (typeof COUNTRY_DEMO !== 'undefined' && !(id === 'espana' && gameState.scenario && gameState.scenario.id === 'TRANSICION')) p = Object.assign({}, p, COUNTRY_DEMO); } catch (e) { /* sin datos propios */ }
    return p;
  }
  function init() {
    const p = profile();
    const D = gameState.demo = {
      b: p.sh.map(s => s * p.pop), tfr: p.tfr, mig: p.mig, mort: p.mort, ss: p.ss || 1, ws: p.warScale || 300, ssName: p.ssName || 'Seguridad Social', retName: p.retName || 'pensionistas', note: p.note || '', pop0: p.pop, sh0: p.sh.slice(),
      born: 0, died: 0, lostWar: 0, lostNuke: 0, mourn: 0, nukeUntil: 0, lastBaj: 0, cd: {}, hist: [[day(), p.pop]], log: [], r0: 0
    };
    D.r0 = ratio(D);
    return D;
  }
  const get = () => { const D = gameState.demo; if (D && D.hist.length && D.hist[D.hist.length - 1][0] <= day() + 5) return D; return init(); };
  const total = D => D.b.reduce((a, b) => a + b, 0);
  const ratio = D => (D.b[0] + D.b[4]) / Math.max(0.0001, D.b[1] + D.b[2] + D.b[3]);
  const age = D => D.b.reduce((a, b, i) => a + b * BANDS[i][2], 0) / Math.max(0.0001, total(D));
  function addLog(D, t) { D.log.unshift('Día ' + day() + ': ' + t); D.log = D.log.slice(0, 8); }
  function accum(stat, v) { try { focusAccum(focusInit(), stat, v); } catch (e) { try { focusMetricAdd(stat, v); } catch (e2) { /* sin métricas */ } } }
  function cash(v, why) { try { registerFinancialTransaction(why, v); } catch (e) { gameState.treasury = (Number(gameState.treasury) || 0) + v; } }
  function kill(D, n, wShares) {   // n millones repartidos entre franjas según wShares
    const tot = wShares.reduce((a, b) => a + b, 0) || 1;
    D.b = D.b.map((v, i) => Math.max(0, v - n * wShares[i] / tot));
  }

  function step() {
    const D = get(), pop = total(D), d = day();
    // 1) Envejecimiento: cada franja cede 1/(años·365) de su población a la siguiente
    const mv = BANDS.map((x, i) => i < 4 ? D.b[i] / (x[1] * 365) : 0);
    // 2) Nacimientos: mujeres de 15-44 años × hijos por mujer ÷ 30 años fértiles
    const births = (D.b[1] + D.b[2]) * 0.5 * D.tfr / 30 / 365;
    // 3) Mortalidad (mejor con Sanidad fuerte)
    const san = 1 - ((gameState.metrics && gameState.metrics.est) || 50) / 800;
    const deaths = D.b.map((v, i) => v * MORT[i] * D.mort * san / 365);
    D.b = D.b.map((v, i) => v - mv[i] + (i ? mv[i - 1] : 0) - deaths[i]);
    D.b[0] += births;
    D.b[1] += D.mig / 2000 / 365; D.b[2] += D.mig / 2000 / 365;   // miles → millones, entre jóvenes adultos
    D.born += births; D.died += deaths.reduce((a, b) => a + b, 0);
    // 4) Guerra: cada baja del frente es población joven que desaparece
    const w = gameState.wr && gameState.wr.war;
    if (w && w.baj != null) {
      const db = Math.max(0, w.baj - (D.lastBaj || 0)); D.lastBaj = w.baj;
      const lost = db * D.ws * (pop / 49) / 1e6;   // 1 unidad de baja del Estado Mayor ≈ 300 soldados (a escala de España)
      if (lost > 0) { kill(D, lost, [0, 6, 4, 0.5, 0]); D.lostWar += lost; D.mourn += lost; }
    } else D.lastBaj = 0;
    // 5) Duelo nacional y secuelas: erosionan aprobación y estabilidad mientras duran
    const pm = D.mourn / Math.max(0.1, pop) * 1000;   // fallecidos en guerra/ataque por cada mil habitantes
    if (pm > 0.001) { accum('apr', -Math.min(0.3, pm * 0.05)); accum('est', -Math.min(0.15, pm * 0.02)); D.mourn *= 0.995; }
    if (D.nukeUntil > d) { accum('eco', -0.05); accum('est', -0.04); accum('apr', -0.03); }
    // 6) Envejecimiento y economía: cotizantes frente a pensionistas
    const dev = ratio(D) / D.r0 - 1;
    accum('eco', -dev * 0.01);
    if (d % 30 === 0 && d > 0) {
      const ss = Math.round(-dev * 5 * 0.03 * D.ss * budget());
      if (Math.abs(ss) >= 1) cash(Math.max(-0.04 * budget(), Math.min(0.04 * budget(), ss)), 'Seguridad Social: efecto demográfico');
      D.hist.push([d, total(D)]); if (D.hist.length > 60) D.hist.shift();
    }
    if (d % 365 === 0 && d > 0) {
      const g = (total(D) / (D.hist.length > 12 ? D.hist[D.hist.length - 13][1] : D.pop0) - 1) * 100;
      addLog(D, 'Balance anual: ' + (g >= 0 ? '+' : '') + f1(g) + ' % de población, edad media ' + f1(age(D)) + ' años.');
    }
  }

  // Ataque nuclear recibido (lo llama el motor de Guerra)
  window.demoNuke = function (nombre) {
    const D = get(), pop = total(D), frac = 0.06 + Math.random() * 0.06, dead = pop * frac;
    kill(D, dead, D.b.slice()); D.lostNuke += dead; D.mourn += dead; D.nukeUntil = day() + 365; D.tfr = Math.max(0.6, D.tfr - 0.25);
    cash(-0.5 * budget(), 'Reconstrucción tras el ataque nuclear');
    addLog(D, 'Ataque nuclear de ' + nombre + ': ' + mil(dead) + ' de víctimas (' + f1(frac * 100) + ' % de la población).');
    try { goalsToast('<b>' + mil(dead) + ' de víctimas</b> (' + f1(frac * 100) + ' % de la población). Duelo nacional, éxodo y reconstrucción: la natalidad se hunde.', '#ef4444'); } catch (e) { /* sin aviso */ }
  };

  window.demoAct = function (k) {
    const D = get(), d = day(), c = Math.round({ nat: 1500, inm: 600, res: 400 }[k] * K());
    if ((D.cd[k] || 0) > d) return goalsToast('Medida en vigor: espera ' + (D.cd[k] - d) + ' días.', '#d9a726');
    if ((Number(gameState.treasury) || 0) < c) return goalsToast('Tesorería insuficiente (' + fmt(c) + ' M€).', '#ef4444');
    cash(-c, k === 'nat' ? 'Plan de natalidad' : k === 'inm' ? 'Plan de integración y acogida' : 'Control fronterizo');
    D.cd[k] = d + 180;
    if (k === 'nat') { D.tfr += 0.08; addLog(D, 'Plan de natalidad: ayudas por hijo y conciliación (+0,08 hijos por mujer).'); accum('apr', 0.4); }
    if (k === 'inm') { D.mig += 120; addLog(D, 'Apertura migratoria: +120.000 llegadas netas al año.'); focusMetricAdd('apr', -1); focusMetricAdd('eco', 1); }
    if (k === 'res') { D.mig = Math.max(-200, D.mig - 100); addLog(D, 'Control fronterizo: −100.000 llegadas netas al año.'); focusMetricAdd('apr', 1); focusMetricAdd('eco', -1); }
    try { render(); } catch (e) { /* sin render */ }
  };

  function spark(h) {
    if (h.length < 2) return '<div class="text-[10px] text-slate-500">Se dibujará con el paso de los meses.</div>';
    const xs = h.map(p => p[0]), ys = h.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs) || 1, y0 = Math.min(...ys), y1 = Math.max(...ys);
    const pts = h.map(p => ((p[0] - x0) / Math.max(1, x1 - x0) * 300).toFixed(1) + ',' + (50 - (p[1] - y0) / Math.max(1e-9, y1 - y0) * 44 - 3).toFixed(1)).join(' ');
    return '<svg viewBox="0 0 300 50" class="w-full h-14"><polyline fill="none" stroke="#fbbf24" stroke-width="2" points="' + pts + '"/></svg>';
  }
  function renderDemo() {
    const D = get(), pop = total(D), yr = pop * 1; const nat = D.tfr * (D.b[1] + D.b[2]) * 0.5 / 30 / pop * 1000;
    const mor = D.b.reduce((a, v, i) => a + v * MORT[i] * D.mort, 0) / pop * 1000;
    const growth = (nat - mor) / 10 + D.mig / 1000 / pop * 100;
    const dev = ratio(D) / D.r0 - 1, workers = D.b[1] + D.b[2] + D.b[3], emp = ((gameState.metrics && gameState.metrics.emp) || 50) / 100;
    const cot = workers * (0.55 + 0.35 * emp), pen = D.b[4], d = day();
    const chip = (t, v, c) => '<div class="bg-slate-950 border border-slate-800 rounded p-2"><div class="text-[10px] text-slate-400 font-sans">' + t + '</div><div class="font-hoi-header text-lg ' + (c || 'text-amber-400') + '">' + v + '</div></div>';
    const rows = BANDS.map((b, i) => {
      const sh = D.b[i] / pop * 100, s0 = D.sh0[i] * 100, df = sh - s0;
      return '<div class="space-y-0.5"><div class="flex justify-between text-[11px]"><span class="text-slate-200">' + b[0] + ' años</span><span>' + f1(sh) + ' % · ' + mil(D.b[i]) + ' <b class="' + (df > 0.05 ? 'text-emerald-400' : df < -0.05 ? 'text-red-400' : 'text-slate-500') + '">' + (df >= 0 ? '+' : '') + f1(df) + '</b></span></div><div class="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800"><div class="h-full ' + (i === 4 ? 'bg-purple-500' : i === 0 ? 'bg-sky-500' : 'bg-emerald-500') + '" style="width:' + Math.min(100, sh * 2.2) + '%"></div></div></div>';
    }).join('');
    const act = (k, t, sub, c) => { const cd = (D.cd[k] || 0) - d; return '<button onclick="demoAct(\'' + k + '\')" class="hoi-button w-full text-left px-3 py-2 rounded text-xs ' + (cd > 0 ? 'opacity-50' : '') + '"><b>' + t + '</b> · ' + fmt(Math.round(c * K())) + ' M€' + (cd > 0 ? ' · ' + cd + ' d' : '') + '<div class="text-[10px] text-slate-400 font-sans">' + sub + '</div></button>'; };
    return '<div class="space-y-4"><h2 class="font-hoi-header text-2xl text-amber-400"><i class="fa-solid fa-people-group mr-2"></i>DEMOGRAFÍA Y POBLACIÓN</h2>'
      + (D.note ? '<p class="text-[11px] text-slate-400 font-sans">' + esc(D.note) + '</p>' : '') + '<div class="grid grid-cols-2 md:grid-cols-6 gap-2 text-center">' + chip('POBLACIÓN', mil(pop)) + chip('NATALIDAD', f1(nat) + ' ‰') + chip('MORTALIDAD', f1(mor) + ' ‰', 'text-slate-200') + chip('CRECIMIENTO', (growth >= 0 ? '+' : '') + f1(growth) + ' %', growth >= 0 ? 'text-emerald-400' : 'text-red-400') + chip('EDAD MEDIA', f1(age(D)) + ' años', 'text-slate-200') + chip('HIJOS/MUJER', D.tfr.toFixed(2).replace('.', ','), D.tfr < 1.6 ? 'text-red-400' : 'text-emerald-400') + '</div>'
      + '<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">'
      + '<div class="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2"><b class="text-sm text-slate-100">Franjas de edad</b>' + rows + '<p class="text-[10px] text-slate-500 font-sans">Entre paréntesis, puntos de diferencia con el inicio de la partida. Cada franja envejece hacia la siguiente con los años.</p></div>'
      + '<div class="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2"><b class="text-sm text-slate-100">' + esc(D.ssName) + '</b><div class="text-[11px] text-slate-300 space-y-1 font-sans"><div>Cotizantes: <b>' + mil(cot) + '</b></div><div>' + esc(D.retName.charAt(0).toUpperCase() + D.retName.slice(1)) + ' (65+): <b>' + mil(pen) + '</b></div><div>Cotizantes por jubilado: <b class="' + (cot / pen < 2 ? 'text-red-400' : 'text-emerald-400') + '">' + (cot / pen).toFixed(2).replace('.', ',') + '</b></div><div>Dependencia: <b>' + f1(ratio(D) * 100) + ' %</b> (' + (dev >= 0 ? '+' : '') + f1(dev * 100) + ' % desde el inicio)</div><div>Efecto mensual en caja: <b class="' + (dev > 0 ? 'text-red-400' : 'text-emerald-400') + '">' + (dev > 0 ? '−' : '+') + fmt(Math.min(0.04 * budget(), Math.abs(dev * 5 * 0.03 * D.ss * budget()))) + ' M€</b></div></div>'
      + '<b class="text-sm text-slate-100 block pt-1">Política demográfica</b>' + act('nat', 'Plan de natalidad', '+0,08 hijos por mujer; más cotizantes a largo plazo.', 1500) + act('inm', 'Apertura migratoria', '+120.000 llegadas al año: rejuvenece, pero cuesta apoyo.', 600) + act('res', 'Control fronterizo', '−100.000 llegadas al año: gana apoyo, envejece.', 400) + '</div>'
      + '<div class="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2"><b class="text-sm text-slate-100">Evolución y registro</b>' + spark(D.hist)
      + '<div class="text-[11px] text-slate-300 font-sans space-y-1"><div>Nacidos: <b>' + mil(D.born) + '</b> · Fallecidos: <b>' + mil(D.died) + '</b></div><div>Muertos en guerra: <b class="text-red-300">' + mil(D.lostWar) + '</b>' + (D.lostNuke ? ' · ataque nuclear: <b class="text-red-400">' + mil(D.lostNuke) + '</b>' : '') + '</div>'
      + (D.mourn / pop * 1000 > 0.05 ? '<div class="text-red-300">Duelo nacional: ' + f1(D.mourn / pop * 1000) + ' fallecidos por mil hab. pesan en la aprobación y la estabilidad.</div>' : '') + '</div>'
      + '<div class="text-[10px] text-slate-400 font-sans space-y-0.5">' + (D.log.length ? D.log.map(esc).map(x => '<div>' + x + '</div>').join('') : 'Sin sucesos demográficos todavía.') + '</div></div></div></div>';
  }

  // Integración: pestaña lateral, render y avance diario
  const nav = document.getElementById('tab-btn-goals');
  if (nav && !document.getElementById('tab-btn-demo')) {
    const b = document.createElement('button'); b.id = 'tab-btn-demo'; b.className = 'nav-tab-btn'; b.setAttribute('onclick', "switchTab('demo')");
    b.innerHTML = '<i class="fa-solid fa-people-group w-4 text-center text-sky-400"></i><span>Demografía</span>'; nav.parentNode.insertBefore(b, nav);
  }
  const _rtc = renderTabContent; renderTabContent = function () { return gameState.activeTab === 'demo' ? renderDemo() : _rtc.apply(this, arguments); };
  const _t = gameTick; gameTick = function () { const b = gameState.daysInOffice; _t.apply(this, arguments); if (gameState.daysInOffice !== b && gameState.step === 4) { try { step(); } catch (e) { console.error('[demografia]', e); } } };
})();
