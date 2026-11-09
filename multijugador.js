// =====================================================================
//  MODO MULTIJUGADOR (local, por turnos en el mismo dispositivo)
//  Un jugador gobierna España y otro, un país socio. Se influyen y se ayudan.
//  PARA AÑADIR MÁS PAÍSES: añade una entrada a COUNTRIES (más abajo).
// =====================================================================
(function () {
  'use strict';
  const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));

  // ---------------- REGISTRO DE PAÍSES ----------------
  // intl: clave del país en INTL (relación bilateral con España). income: ingresos base en M€/día.
  // events[].opts[]: tes (±M€), P (efectos en el país), ES (efectos en España), rel (relación), ask (pide ayuda a España)
  const COUNTRIES = {
    MA: {
      name: 'Marruecos', flag: '🇲🇦', intl: 'ma', income: 9,
      start: { eco: 52, est: 60, apr: 55, mil: 58, tes: 9000, cap: 30 },
      events: [
        { title: 'Sequía y malas cosechas', desc: 'Seis años de sequía hunden el campo y el precio del pan se dispara.', opts: [
          { t: 'Importar cereal y subsidiar el pan (−400 M€)', tes: -400, P: { apr: 4, eco: -1 } },
          { t: 'Racionar el agua y dejar que ajuste el mercado', P: { apr: -6, est: -3, eco: 1 } }] },
        { title: 'Protestas juveniles', desc: 'Miles de jóvenes salen a la calle exigiendo sanidad, educación y empleo.', opts: [
          { t: 'Abrir diálogo y reformas sociales (−300 M€)', tes: -300, P: { apr: 6, est: 4 } },
          { t: 'Mano dura y detenciones', P: { est: -2, apr: -7, mil: 2 } }] },
        { title: 'Boom de los fosfatos', desc: 'El precio mundial de los fosfatos y fertilizantes se dispara.', opts: [
          { t: 'Contrato preferente con España (+500 M€)', tes: 500, P: { eco: 2 }, ES: { eco: 2 }, rel: 5 },
          { t: 'Vender al mejor postor (+800 M€)', tes: 800, P: { eco: 3 }, rel: -4 }] },
        { title: 'Presión migratoria en Ceuta y Melilla', desc: 'Cientos de personas se concentran junto a la valla.', opts: [
          { t: 'Reforzar la contención en la frontera (−200 M€)', tes: -200, ES: { est: 2 }, rel: 4 },
          { t: 'Relajar los controles para presionar a Madrid', P: { apr: 3 }, ES: { est: -5, apr: -3 }, rel: -10 }] },
        { title: 'Terremoto en el Atlas', desc: 'Un seísmo devasta varias provincias de montaña.', opts: [
          { t: 'Pedir ayuda urgente a España', P: { apr: 3 }, ask: true, rel: 2 },
          { t: 'Gestionarlo en solitario (−700 M€)', tes: -700, P: { apr: -2, est: -2 } }] }
      ]
    }
  };

  // ---------------- ACCIONES ENTRE PAÍSES ----------------
  // k:'prop' = el otro jugador debe aceptar; k:'now' = efecto inmediato (hostil). a = quien actúa, b = el otro.
  const ACTIONS = [
    { id: 'aid', t: 'Paquete de ayuda', ic: 'fa-hand-holding-dollar', k: 'prop', cap: 5, d: 'Transfiere 500 M€ al otro país: mejora su economía y la relación.',
      run(a, b, it) {
        const p = it && it.asks ? b : a, r = oth(p);
        if (treas(p) < 500) { toast(nm(p) + ' no tiene fondos suficientes.'); return false; }
        cash(p, -500, 'Ayuda a ' + nm(r)); cash(r, 500, 'Ayuda recibida de ' + nm(p));
        st(r, 'eco', 3); st(r, 'apr', 2); st(p, 'apr', -1); rel(7);
        return nm(p) + ' envía 500 M€ de ayuda a ' + nm(r) + '.';
      } },
    { id: 'trade', t: 'Acuerdo comercial', ic: 'fa-ship', k: 'prop', pact: true, cap: 5, d: 'Pacto estable: ambos ganan economía e ingresos cada mes.',
      run() { S().pacts.trade = true; st('ES', 'eco', 1); st('P', 'eco', 1); rel(5); return 'España y ' + C().name + ' firman un acuerdo comercial.'; } },
    { id: 'border', t: 'Pacto fronterizo y migratorio', ic: 'fa-shield-halved', k: 'prop', pact: true, cap: 5, d: 'Cooperación en las fronteras: ambos ganan estabilidad.',
      run() { S().pacts.border = true; st('ES', 'est', 2); st('P', 'est', 2); rel(5); return 'Se activa el pacto de cooperación fronteriza.'; } },
    { id: 'defense', t: 'Alianza de defensa', ic: 'fa-jet-fighter', k: 'prop', pact: true, cap: 7, d: 'Maniobras e inteligencia conjuntas: ambos ganan poder militar.',
      run() { S().pacts.defense = true; st('ES', 'mil', 2); st('P', 'mil', 2); rel(4); return 'Alianza de defensa firmada entre ambos países.'; } },
    { id: 'press', t: 'Presión diplomática', ic: 'fa-bullhorn', k: 'now', cap: 4, d: 'Presionas al otro gobierno: baja su aprobación y estabilidad; la relación se resiente.',
      run(a, b) { st(b, 'apr', -3); st(b, 'est', -3); st(a, 'apr', 2); rel(-9); return nm(a) + ' presiona diplomáticamente a ' + nm(b) + '.'; } },
    { id: 'embargo', t: 'Cierre de frontera y aranceles', ic: 'fa-ban', k: 'now', cap: 6, d: 'Golpe económico al otro (y algo a ti). Rompe los pactos comercial y fronterizo.',
      run(a, b) { st(b, 'eco', -5); st(a, 'eco', -2); S().pacts.trade = false; S().pacts.border = false; rel(-14); return nm(a) + ' cierra la frontera y sube aranceles a ' + nm(b) + '.'; } }
  ];
  const STATS = [['eco', 'Economía'], ['est', 'Estabilidad'], ['apr', 'Aprobación'], ['mil', 'Militar']];

  // ---------------- UTILIDADES ----------------
  const S = () => gameState.mp;
  const C = () => COUNTRIES[S().partner];
  const oth = s => (s === 'ES' ? 'P' : 'ES');
  const nm = s => (s === 'ES' ? 'España' : C().name);
  const flag = s => (s === 'ES' ? '🇪🇸' : C().flag);
  const fmt = n => Math.round(n).toLocaleString('es-ES');
  const toast = t => { try { goalsToast(t, '#ef4444'); } catch (e) { console.log(t); } };
  const stat = (s, k) => (s === 'ES' ? (gameState.metrics || {})[k] : S().P[k]);
  function st(s, k, v) {
    if (s === 'ES') { try { focusAccum(focusInit(), k, v); } catch (e) { focusMetricAdd(k, v); } }
    else S().P[k] = clamp((S().P[k] || 0) + v);
  }
  const treas = s => (s === 'ES' ? Number(gameState.treasury) || 0 : S().P.tes);
  function cash(s, v, why) { if (s === 'ES') registerFinancialTransaction(why || 'Cooperación con ' + C().name, v); else S().P.tes += v; }
  function cap(s) { if (s === 'ES') { goalsInit(); return gameState.goals.capital; } return S().P.cap; }
  function spendCap(s, v) { if (s === 'ES') gameState.goals.capital -= v; else S().P.cap -= v; }
  function rel(v) { const I = intlInit(), k = C().intl; I.rel[k] = clamp((I.rel[k] == null ? 50 : I.rel[k]) + v); }
  function log(t) {
    const m = S(); m.log.unshift({ d: gameState.daysInOffice || 0, t }); m.log.length = Math.min(m.log.length, 12);
    try { addNewsToTicker(t, 'Cooperación'); } catch (e) { /* sin ticker */ }
  }
  function applyFx(s, o) { Object.keys(o || {}).forEach(k => st(s, k, o[k])); }

  // ---------------- LÓGICA ----------------
  function start(partner) {
    const c = COUNTRIES[partner]; if (!c) return;
    gameState.mp = { on: true, partner, turn: 'ES', P: Object.assign({}, c.start), pacts: { trade: false, border: false, defense: false },
      inbox: [], log: [], cd: {}, evt: null, next: (gameState.daysInOffice || 0) + 30 };
    log('Modo multijugador: España y ' + c.name + ' empiezan a gobernar en paralelo.');
  }
  function stop() { gameState.mp = null; render(); }
  function swap() {
    const m = S(); m.turn = oth(m.turn);
    try { setGameSpeed(0); } catch (e) { /* ya en pausa */ }
    goalsToast('Mando para ' + nm(m.turn) + '. Partida en pausa.', '#d9a726'); render();
  }
  function act(id) {
    const m = S(), a = m.turn, b = oth(a), x = ACTIONS.find(z => z.id === id);
    if (!x || (x.pact && m.pacts[id]) || (m.cd[a + id] || 0) > 0) return;
    if (cap(a) < x.cap) return toast('Capital político insuficiente.');
    if (x.k === 'prop') {
      if (m.inbox.some(i => i.from === a && i.id === id)) return toast('Ya hay una propuesta pendiente.');
      spendCap(a, x.cap); m.inbox.push({ from: a, id }); log(nm(a) + ' propone a ' + nm(b) + ': ' + x.t + '.');
    } else {
      spendCap(a, x.cap); m.cd[a + id] = 20; const r = x.run(a, b); if (r) log(r);
    }
    render();
  }
  function answer(i, ok) {
    const m = S(), it = m.inbox[i]; if (!it || it.from === m.turn) return;
    const x = ACTIONS.find(z => z.id === it.id); m.inbox.splice(i, 1);
    if (ok) { const r = x.run(it.from, m.turn, it); log(r || 'La propuesta «' + x.t + '» no se pudo ejecutar.'); }
    else { rel(-2); log(nm(m.turn) + ' rechaza la propuesta «' + x.t + '».'); }
    render();
  }
  function resolveEvt(i) {
    const m = S(), e = C().events[m.evt], o = e && e.opts[i]; if (!o) return;
    if (o.tes) cash('P', o.tes);
    applyFx('P', o.P); applyFx('ES', o.ES); if (o.rel) rel(o.rel);
    if (o.ask) m.inbox.push({ from: 'P', id: 'aid', asks: true });
    log(C().name + ': ' + e.title + ' → ' + o.t.replace(/ \(.*\)$/, '') + '.'); m.evt = null; render();
  }

  function daily() {
    const m = S(); if (!m || !m.on) return;
    const P = m.P, c = C(), d = gameState.daysInOffice || 0;
    P.cap = Math.min(60, P.cap + 0.3);
    P.tes += c.income * (0.6 + P.eco / 100) - 3 - Math.max(0, P.mil - 50) * 0.05;
    if (P.tes < 0) { P.eco = clamp(P.eco - 0.08); P.apr = clamp(P.apr - 0.06); }
    P.apr = clamp(P.apr + (P.eco - 50) * 0.002 + (P.est - 50) * 0.002 - 0.01);
    P.est = clamp(P.est + (P.apr - 50) * 0.002 - (P.apr < 35 ? 0.05 : 0));
    P.eco = clamp(P.eco + (Math.random() - 0.5) * 0.1 + (50 - P.eco) * 0.001);
    Object.keys(m.cd).forEach(k => { if (m.cd[k] > 0) m.cd[k]--; });
    const pk = Object.keys(m.pacts).filter(k => m.pacts[k]);
    if (pk.length) {
      const e = { trade: ['eco', 0.02], border: ['est', 0.025], defense: ['mil', 0.025] };
      rel(0.05 * pk.length);
      pk.forEach(k => { st('ES', e[k][0], e[k][1]); st('P', e[k][0], e[k][1]); });
      if (m.pacts.trade && d % 30 === 0) { cash('ES', 150, 'Pacto comercial con ' + c.name); cash('P', 150); }
    }
    if (m.evt == null && d >= m.next && c.events.length) {
      m.evt = Math.floor(Math.random() * c.events.length); m.next = d + 45 + Math.floor(Math.random() * 40);
      log('Suceso en ' + c.name + ': ' + c.events[m.evt].title + '.');
    }
  }

  // ---------------- INTERFAZ ----------------
  function card(s) {
    const m = S(), me = m.turn === s;
    const rows = STATS.map(([k, l]) => {
      const v = Math.round(stat(s, k) || 0);
      return `<div><div class="flex justify-between text-[10px] text-slate-400"><span>${l}</span><span class="font-mono">${v}</span></div><div class="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800"><div class="h-full ${v >= 60 ? 'bg-emerald-500' : v >= 35 ? 'bg-amber-500' : 'bg-red-500'}" style="width:${v}%"></div></div></div>`;
    }).join('');
    return `<div class="bg-slate-950 border ${me ? 'border-amber-500' : 'border-slate-800'} rounded-lg p-3 space-y-2">
      <div class="flex justify-between items-center"><b class="text-sm text-slate-100">${flag(s)} ${nm(s)}</b>${me ? '<span class="text-[10px] text-amber-400">▶ TURNO</span>' : ''}</div>${rows}
      <div class="flex justify-between text-[11px] text-slate-300"><span>Tesoro</span><span class="font-mono">${fmt(treas(s))} M€</span></div>
      <div class="flex justify-between text-[11px] text-slate-300"><span>Capital político</span><span class="font-mono">${Math.floor(cap(s))}</span></div></div>`;
  }

  function renderMulti() {
    const head = `<div class="border-b border-slate-800 pb-3"><h3 class="font-hoi-header text-2xl text-amber-400"><i class="fa-solid fa-people-arrows mr-2"></i>MODO MULTIJUGADOR</h3>`;
    if (!S()) {
      const opts = Object.keys(COUNTRIES).map(k => `<button onclick="MP.start('${k}');render()" class="hoi-button-gold px-4 py-2 rounded text-sm">${COUNTRIES[k].flag} Activar con ${COUNTRIES[k].name}</button>`).join(' ');
      return `<div class="hoi-box p-5 rounded-xl space-y-4 font-hoi-tech">${head}<p class="text-xs text-slate-400 font-sans">Dos jugadores en el mismo dispositivo: uno gobierna España y otro un país socio. Os pasáis el mando, os proponéis pactos, os enviáis ayuda… o os hacéis la guerra económica. Todo repercute en las relaciones bilaterales de la partida.</p></div>${opts}</div>`;
    }
    const m = S(), me = m.turn, ot = oth(me), c = C();
    const r = Math.round(intlInit().rel[c.intl] || 0);
    const inbox = m.inbox.map((it, i) => ({ it, i })).filter(o => o.it.from !== me).map(({ it, i }) => {
      const x = ACTIONS.find(z => z.id === it.id);
      return `<div class="bg-slate-900 border border-amber-500/40 rounded p-2 text-[11px] space-y-1"><div><b>${flag(it.from)} ${nm(it.from)}</b> ${it.asks ? 'solicita' : 'propone'}: <b class="text-amber-300">${x.t}</b></div><div class="flex gap-2"><button onclick="MP.answer(${i},true)" class="hoi-button px-2 py-1 rounded text-emerald-300">Aceptar</button><button onclick="MP.answer(${i},false)" class="hoi-button px-2 py-1 rounded text-red-300">Rechazar</button></div></div>`;
    }).join('');
    const evt = me === 'P' && m.evt != null ? (e => `<div class="bg-slate-900 border border-sky-500/40 rounded p-3 space-y-2"><b class="text-sm text-sky-300">${e.title}</b><p class="text-[11px] text-slate-400 font-sans">${e.desc}</p>${e.opts.map((o, i) => `<button onclick="MP.evt(${i})" class="hoi-button w-full p-2 rounded text-[11px] text-left">${o.t}</button>`).join('')}</div>`)(c.events[m.evt]) : '';
    const acts = ACTIONS.map(x => {
      const on = x.pact && m.pacts[x.id], cd = m.cd[me + x.id] || 0, pend = m.inbox.some(i => i.from === me && i.id === x.id);
      const off = on || cd > 0 || pend || cap(me) < x.cap;
      return `<button ${off ? 'disabled' : ''} onclick="MP.act('${x.id}')" class="hoi-button p-2 rounded text-[11px] text-left ${off ? 'opacity-50' : ''} ${x.k === 'now' ? 'border-red-500/40' : ''}"><div><i class="fa-solid ${x.ic} mr-1 ${x.k === 'now' ? 'text-red-400' : 'text-emerald-400'}"></i><b>${x.t}</b> <span class="text-slate-400">· ${x.cap} cap.</span></div><div class="text-slate-400 font-sans">${x.d}</div><div class="text-[10px] ${on ? 'text-emerald-300' : 'text-slate-500'}">${on ? '✔ Pacto activo' : pend ? 'Propuesta pendiente…' : cd ? 'Disponible en ' + cd + ' días' : x.k === 'prop' ? 'Requiere aceptación de ' + nm(ot) : 'Efecto inmediato'}</div></button>`;
    }).join('');
    const lg = m.log.map(l => `<div class="text-[11px] text-slate-400"><span class="text-slate-600 font-mono">día ${l.d}</span> · ${l.t}</div>`).join('') || '<div class="text-[11px] text-slate-600">Sin movimientos todavía.</div>';
    return `<div class="hoi-box p-5 rounded-xl space-y-4 font-hoi-tech">${head}<p class="text-xs text-slate-400 font-sans">Controla ahora: <b class="text-amber-300">${flag(me)} ${nm(me)}</b>. Al pasar el mando la partida se pausa.</p></div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">${card('ES')}${card('P')}</div>
      <div><div class="flex justify-between text-[11px] text-slate-300"><span>Relación ${nm('ES')} – ${nm('P')}</span><span class="font-mono">${r}/100</span></div><div class="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800"><div class="h-full ${r >= 70 ? 'bg-emerald-500' : r <= 30 ? 'bg-red-500' : 'bg-amber-500'}" style="width:${r}%"></div></div></div>
      <div class="flex gap-2 flex-wrap"><button onclick="MP.swap()" class="hoi-button-gold px-4 py-2 rounded text-sm"><i class="fa-solid fa-repeat mr-1"></i>Pasar el mando a ${flag(ot)} ${nm(ot)}</button><button onclick="if(confirm('¿Desactivar el modo multijugador?'))MP.stop()" class="hoi-button px-3 py-2 rounded text-xs text-slate-400">Desactivar</button></div>
      ${inbox ? `<div class="space-y-2"><div class="text-[11px] text-amber-400 tracking-wider">PROPUESTAS RECIBIDAS</div>${inbox}</div>` : ''}${evt}
      <div class="hoi-box p-4 rounded-xl space-y-2"><div class="text-[11px] text-amber-400 tracking-wider">ACCIONES DE ${nm(me).toUpperCase()}</div><div class="grid grid-cols-1 md:grid-cols-2 gap-2">${acts}</div></div>
      <div class="hoi-box p-4 rounded-xl space-y-1"><div class="text-[11px] text-amber-400 tracking-wider">REGISTRO</div>${lg}</div>`;
  }

  // ---------------- ENGANCHES CON EL JUEGO ----------------
  window.MP = { start, stop, swap, act, answer, evt: resolveEvt, COUNTRIES };

  function addTab() {
    if (document.getElementById('tab-btn-mp')) return;
    const b = document.createElement('button'); b.id = 'tab-btn-mp'; b.className = 'nav-tab-btn'; b.setAttribute('onclick', "switchTab('mp')");
    b.innerHTML = '<i class="fa-solid fa-people-arrows text-sky-400 w-4 text-center"></i><span>Multijugador</span>';
    const g = document.querySelector('.nav-group[data-ids*="war"]');
    if (g) { g.querySelector('.nav-group-body').appendChild(b); g.dataset.ids += ',mp'; }
    else { const l = document.querySelector('.sidebar-nav-list'); if (l) l.appendChild(b); }
  }
  addTab();

  const _rtc = renderTabContent;
  renderTabContent = function () { return gameState.activeTab === 'mp' ? renderMulti() : _rtc(); };

  const _t = gameTick;
  gameTick = function () {
    const b = gameState.daysInOffice; _t.apply(this, arguments);
    if (gameState.daysInOffice !== b) { try { daily(); } catch (e) { console.error(e); } }
  };

  const _s = selectScenario;
  selectScenario = function (id) { gameState.mp = null; _s(id); };

  const _rs = renderScenarioSelect;
  renderScenarioSelect = function (app) {
    _rs(app);
    const keys = Object.keys(COUNTRIES), d = document.createElement('div');
    d.className = 'hoi-box p-3 rounded mt-3 flex flex-wrap items-center gap-3 font-hoi-tech text-xs text-slate-300';
    d.innerHTML = '<i class="fa-solid fa-people-arrows text-sky-400"></i><label class="flex items-center gap-2"><input type="checkbox" id="mp-start-chk"' + (window.__mpStart ? ' checked' : '') + '> MODO MULTIJUGADOR (2 jugadores)</label><select id="mp-start-sel" class="bg-slate-900 border border-slate-700 rounded px-2 py-1">' + keys.map(k => '<option value="' + k + '"' + (window.__mpStart === k ? ' selected' : '') + '>' + COUNTRIES[k].flag + ' España + ' + COUNTRIES[k].name + '</option>').join('') + '</select>';
    app.appendChild(d);
    const chk = d.querySelector('input'), sel = d.querySelector('select');
    const upd = () => { window.__mpStart = chk.checked ? sel.value : null; };
    chk.onchange = sel.onchange = upd; upd();
  };

  const _r = render;
  render = function () {
    if (gameState.step === 4 && window.__mpStart && !gameState.mp) { start(window.__mpStart); window.__mpStart = null; }
    const r = _r.apply(this, arguments);
    const b = document.getElementById('tab-btn-mp');
    if (b) {
      b.style.display = gameState.step === 4 ? '' : 'none';
      const n = gameState.mp ? gameState.mp.inbox.length + (gameState.mp.evt != null ? 1 : 0) : 0;
      b.querySelector('span').textContent = 'Multijugador' + (n ? ' (' + n + ')' : '');
    }
    return r;
  };
})();
