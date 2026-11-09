// =====================================================================
//  MODO MULTIJUGADOR (local, por turnos en el mismo dispositivo)
//  Un jugador gobierna España y otro, un país socio. Se influyen y se ayudan.
//  PARA AÑADIR MÁS PAÍSES: añade una entrada a COUNTRIES (más abajo).
// =====================================================================
(function () {
  'use strict';
  // ---------------- RELÉ ONLINE OPCIONAL (Supabase Realtime, plan gratuito) ----------------
  // Déjalo vacío para usar conexión directa PeerJS. Para más fiabilidad pega aquí los dos datos
  // de tu proyecto de Supabase (Settings → API): «Project URL» y la clave «anon public». Son públicos.
  const RELAY = { url: '', key: '' };
  const useRelay = () => !!(RELAY.url && RELAY.key);

  const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));

  // ---------------- REGISTRO DE PAÍSES ----------------
  // intl: clave del país en INTL (relación bilateral con España). income: ingresos base en M€/día.
  // events[].opts[]: tes (±M€), P (efectos en el país), ES (efectos en España), rel (relación), ask (pide ayuda a España)
  const COUNTRIES = {
    MA: {
      name: 'Marruecos', flag: '🇲🇦', intl: 'ma', income: 10,
      // Presupuesto: cada partida cuesta (nivel/50 × cost) M€/día y aplica (nivel−50) × fx a las estadísticas cada día
      budget: [
        { id: 'edu', t: 'Educación', ic: 'fa-graduation-cap', cost: 1.5, d: 'Mejora la aprobación y, a largo plazo, la economía.', fx: { apr: 0.0003, eco: 0.0002 } },
        { id: 'san', t: 'Sanidad', ic: 'fa-heart-pulse', cost: 1.5, d: 'Sube la aprobación y algo la estabilidad.', fx: { apr: 0.0004, est: 0.0001 } },
        { id: 'def', t: 'Defensa y FAR', ic: 'fa-shield', cost: 1.5, d: 'Refuerza el poder militar.', fx: { mil: 0.0006 } },
        { id: 'inf', t: 'Infraestructuras', ic: 'fa-road', cost: 1.5, d: 'Puertos, carreteras y energía: impulsa la economía.', fx: { eco: 0.0005 } },
        { id: 'seg', t: 'Seguridad e Interior', ic: 'fa-user-shield', cost: 1.5, d: 'Más estabilidad interna.', fx: { est: 0.0005 } },
        { id: 'agr', t: 'Agricultura y agua', ic: 'fa-wheat-awn', cost: 1.5, d: 'Campo y recursos hídricos: ayuda a economía, aprobación y estabilidad.', fx: { eco: 0.0002, apr: 0.0002, est: 0.0002 } }
      ],
      // Decretos: coste en M€ y capital político; cd = días de espera; P/ES = efectos; rel = relación bilateral
      policies: [
        { id: 'green', t: 'Plan Generación Verde', cost: 600, cap: 5, cd: 60, P: { eco: 3, apr: 2 }, d: 'Renovables e industria verde.' },
        { id: 'edu', t: 'Reforma educativa', cost: 400, cap: 4, cd: 60, P: { apr: 3, eco: 1 }, d: 'Nuevo modelo escolar y universitario.' },
        { id: 'agua', t: 'Desaladoras y trasvases', cost: 500, cap: 4, cd: 60, P: { eco: 2, est: 2 }, d: 'Seguridad hídrica frente a la sequía.' },
        { id: 'tgv', t: 'Alta velocidad Tánger–Marrakech', cost: 900, cap: 6, cd: 90, P: { eco: 4, apr: 2 }, d: 'Gran obra ferroviaria.' },
        { id: 'mundial', t: 'Preparar el Mundial 2030 con España', cost: 800, cap: 6, cd: 90, P: { apr: 4, eco: 3 }, ES: { eco: 1 }, rel: 4, d: 'Sede compartida: beneficia a ambos.' },
        { id: 'pan', t: 'Subsidio al pan y al butano', cost: 300, cap: 3, cd: 45, P: { apr: 4, est: 2 }, d: 'Alivio de precios para las familias.' },
        { id: 'far', t: 'Modernización de las FAR', cost: 500, cap: 5, cd: 60, P: { mil: 5, apr: -1 }, d: 'Compra de equipamiento militar.' },
        { id: 'gas', t: 'Gasoducto con España', cost: 700, cap: 6, cd: 90, P: { eco: 3 }, ES: { eco: 2 }, rel: 5, d: 'Energía compartida: beneficia a ambos.' }
      ],
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
  let peer = null, link = null, guest = null, tab = 'res';
  const G = () => guest && guest.s;
  const S = () => (G() ? G().m : gameState.mp);
  const C = () => COUNTRIES[S().partner];
  const oth = s => (s === 'ES' ? 'P' : 'ES');
  const nm = s => (s === 'ES' ? 'España' : C().name);
  const flag = s => (s === 'ES' ? '🇪🇸' : C().flag);
  const fmt = n => Math.round(n).toLocaleString('es-ES');
  const toast = t => { try { goalsToast(t, '#ef4444'); } catch (e) { console.log(t); } };
  const stat = (s, k) => (s === 'ES' ? (G() ? G().ES[k] : (gameState.metrics || {})[k]) : S().P[k]);
  function st(s, k, v) {
    if (s === 'ES') { try { focusAccum(focusInit(), k, v); } catch (e) { focusMetricAdd(k, v); } }
    else S().P[k] = clamp((S().P[k] || 0) + v);
  }
  const treas = s => (s === 'ES' ? (G() ? G().ES.tes : Number(gameState.treasury) || 0) : S().P.tes);
  function cash(s, v, why) { if (s === 'ES') registerFinancialTransaction(why || 'Cooperación con ' + C().name, v); else S().P.tes += v; }
  function cap(s) { if (G() && s === 'ES') return G().ES.cap; if (s === 'ES') { goalsInit(); return gameState.goals.capital; } return S().P.cap; }
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
    gameState.mp = { on: true, partner, turn: 'ES', P: Object.assign({}, c.start, { bud: Object.fromEntries(c.budget.map(b => [b.id, 50])) }), pacts: { trade: false, border: false, defense: false },
      inbox: [], log: [], cd: {}, evt: null, next: (gameState.daysInOffice || 0) + 30 };
    log('Modo multijugador: España y ' + c.name + ' empiezan a gobernar en paralelo.');
  }
  function stop() { closeNet(); gameState.mp = null; render(); }
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
  function setBud(id, v) { const m = S(); v = Math.round(Number(v)); if (m && C().budget.some(b => b.id === id) && v >= 0 && v <= 100) m.P.bud[id] = v; }
  function pol(id) {
    const m = S(), x = C().policies.find(z => z.id === id), k = 'Ppol' + id;
    if (!x || (m.cd[k] || 0) > 0) return;
    if (cap('P') < x.cap) return toast('Capital político insuficiente.');
    if (m.P.tes < x.cost) return toast('Fondos insuficientes.');
    spendCap('P', x.cap); m.P.tes -= x.cost; m.cd[k] = x.cd; applyFx('P', x.P); applyFx('ES', x.ES); if (x.rel) rel(x.rel);
    log(C().name + ' aprueba: ' + x.t + '.'); render();
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
    if (!P.bud) P.bud = Object.fromEntries(c.budget.map(b => [b.id, 50]));
    c.budget.forEach(b => { const l = P.bud[b.id]; P.tes -= l / 50 * b.cost; Object.keys(b.fx).forEach(k => { P[k] = clamp(P[k] + (l - 50) * b.fx[k]); }); });
    P.tes += c.income * (0.6 + P.eco / 100) - 1;
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

  // ---------------- ONLINE (PeerJS: WebRTC directo entre navegadores) ----------------
  function loadPeer(cb) {
    if (window.Peer) return cb();
    const el = document.createElement('script'); el.src = 'https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js';
    el.onload = cb; el.onerror = () => toast('No se pudo cargar PeerJS (¿sin conexión?).'); document.head.appendChild(el);
  }
  function loadSb(cb) {
    if (window.supabase) return cb();
    const el = document.createElement('script'); el.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
    el.onload = cb; el.onerror = () => toast('No se pudo cargar Supabase (¿sin conexión?).'); document.head.appendChild(el);
  }
  // Canal de Supabase con la misma interfaz que una conexión PeerJS (open, send, on, close)
  function relayLink(code, role) {
    const sb = window.supabase.createClient(RELAY.url, RELAY.key), other = role === 'host' ? 'guest' : 'host';
    const ch = sb.channel('moncloa-' + code, { config: { broadcast: { self: false }, presence: { key: role + Math.random().toString(36).slice(2, 7) } } });
    const L = { open: false, h: {}, on(e, f) { this.h[e] = f; }, send(d) { ch.send({ type: 'broadcast', event: 'm', payload: { from: role, d } }); }, close() { L.open = false; try { sb.removeChannel(ch); } catch (e) { /* ya cerrado */ } } };
    ch.on('broadcast', { event: 'm' }, ({ payload }) => { if (payload && payload.from !== role && L.h.data) L.h.data(payload.d); });
    ch.on('presence', { event: 'sync' }, () => {
      const has = Object.keys(ch.presenceState()).some(k => k.indexOf(other) === 0);
      if (has && !L.open) { L.open = true; if (L.h.open) L.h.open(); }
      else if (!has && L.open) { L.open = false; if (L.h.close) L.h.close(); }
    });
    ch.subscribe(st => { if (st === 'SUBSCRIBED') ch.track({ role }); else if (st === 'CHANNEL_ERROR' || st === 'TIMED_OUT') toast('No se pudo conectar con Supabase. Revisa la URL y la clave.'); });
    return L;
  }
  function wireHost(c) {
    link = c;
    c.on('open', () => { log(nm('P') + ': jugador conectado.'); push(); render(); });
    c.on('data', onCmd);
    c.on('close', () => { link = null; log(nm('P') + ': jugador desconectado.'); render(); });
  }
  function closeNet() { try { if (link) link.close(); if (peer) peer.destroy(); } catch (e) { /* ya cerrado */ } link = peer = null; guest = null; paintGuest(); }
  function host(partner) {
    (useRelay() ? loadSb : loadPeer)(() => {
      if (peer) { try { peer.destroy(); } catch (e) { /* nada */ } }
      if (!S()) start(partner);
      const m = S(); m.mode = 'online'; m.turn = 'ES'; m.code = Math.random().toString(36).slice(2, 7).toUpperCase();
      if (useRelay()) { const L = relayLink(m.code, 'host'); peer = { destroy: () => L.close() }; wireHost(L); render(); return; }
      peer = new Peer('moncloa-' + m.code);
      peer.on('open', () => render());
      peer.on('error', e => { toast('Error de conexión: ' + e.type); peer = null; render(); });
      peer.on('connection', c => {
        if (link && link.open) { c.close(); return; }
        wireHost(c);
      });
      render();
    });
  }
  function join(code) {
    code = (code || '').trim().toUpperCase(); if (!code) return;
    (useRelay() ? loadSb : loadPeer)(() => {
      closeNet();
      if (useRelay()) {
        const L = relayLink(code, 'guest'); link = L; peer = { destroy: () => L.close() };
        L.on('open', () => { guest = { code, s: null, ok: true }; paintGuest(); });
        L.on('data', d => { if (guest && d && d.t === 's') { guest.s = d.s; paintGuest(); } });
        L.on('close', () => { if (guest) { guest.ok = false; paintGuest(); } });
        return;
      }
      peer = new Peer();
      peer.on('error', e => { toast('No se pudo conectar: ' + e.type); closeNet(); });
      peer.on('open', () => {
        const c = peer.connect('moncloa-' + code, { reliable: true }); link = c;
        c.on('open', () => { guest = { code, s: null, ok: true }; paintGuest(); });
        c.on('data', d => { if (guest && d && d.t === 's') { guest.s = d.s; paintGuest(); } });
        c.on('close', () => { if (guest) { guest.ok = false; paintGuest(); } });
      });
    });
  }
  const gsend = o => { if (link && link.open) link.send(o); };
  function snap() {
    const m = S(), me = { eco: 0, est: 0, apr: 0, mil: 0, tes: 0, cap: 0 }, wait = gameState.step !== 4;
    if (!wait) { STATS.forEach(([k]) => { me[k] = stat('ES', k); }); me.tes = treas('ES'); me.cap = cap('ES'); }
    const cd = {}; Object.keys(m.cd).forEach(k => { if (k[0] === 'P') cd[k] = m.cd[k]; });
    return { wait, day: gameState.daysInOffice || 0, pause: wait || !gameState.gameSpeed, ES: me, rel: wait ? 45 : intlInit().rel[C().intl],
      m: { partner: m.partner, turn: 'P', P: m.P, pacts: m.pacts, inbox: m.inbox, log: m.log, cd, evt: m.evt, mode: 'online', code: m.code } };
  }
  let lastPush = 0;
  function push() { if (!guest && link && link.open && S()) { lastPush = Date.now(); link.send({ t: 's', s: snap() }); } }
  function onCmd(d) {   // órdenes del jugador 2 (se ejecutan en la partida del anfitrión)
    const m = S(); if (!m || !d) return;
    const prev = m.turn; m.turn = 'P';
    try {
      if (d.t === 'act' && ACTIONS.some(x => x.id === d.id)) act(d.id);
      else if (d.t === 'ans' && Number.isInteger(d.i)) answer(d.i, !!d.ok);
      else if (d.t === 'evt' && Number.isInteger(d.i)) resolveEvt(d.i);
      else if (d.t === 'bud') setBud(d.id, d.v);
      else if (d.t === 'pol') pol(d.id);
    } finally { m.turn = prev; }
    push();
  }
  function paintGuest() {
    let el = document.getElementById('mp-guest');
    if (!guest) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement('div'); el.id = 'mp-guest'; el.className = 'fixed inset-0 overflow-y-auto p-4'; el.style.zIndex = 100000; el.style.background = '#0b0f12'; document.body.appendChild(el); }
    const s = guest.s;
    el.innerHTML = `<div class="flex justify-between items-center mb-3 font-hoi-tech text-xs text-slate-300"><span>Sala <b class="text-amber-300">${guest.code}</b>${s ? ' · Día ' + s.day + (s.pause ? ' · <span class="text-amber-400">PARTIDA EN PAUSA</span>' : '') : ''}${guest.ok ? '' : ' · <span class="text-red-400">CONEXIÓN PERDIDA</span>'}</span><button onclick="MP.leave()" class="hoi-button px-3 py-1 rounded">Salir de la sala</button></div><div class="max-w-3xl mx-auto space-y-3">${s && s.wait ? '<div class="hoi-box p-8 rounded-xl text-center font-hoi-tech text-slate-300"><div class="text-3xl mb-2">' + flag('P') + '</div>Estás dentro de la sala. Esperando a que el anfitrión empiece la partida…</div>' : renderMulti()}</div>`;
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

  function budgetHtml() {
    const m = S(), c = C(), P = m.P;
    const inc = c.income * (0.6 + P.eco / 100) - 1, out = c.budget.reduce((t, b) => t + (P.bud[b.id] / 50) * b.cost, 0), bal = inc - out;
    const rows = c.budget.map(b => { const v = P.bud[b.id]; return `<div class="space-y-1"><div class="flex justify-between text-[11px]"><span><i class="fa-solid ${b.ic} mr-1 text-amber-400"></i>${b.t}</span><span class="font-mono">${v}% · ${(v / 50 * b.cost).toFixed(1)} M€/día</span></div><input type="range" min="0" max="100" value="${v}" class="w-full" onchange="MP.bud('${b.id}',this.value)"><div class="text-[10px] text-slate-500 font-sans">${b.d}</div></div>`; }).join('');
    return `<div class="hoi-box p-4 rounded-xl space-y-3 font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">PRESUPUESTO DE ${nm('P').toUpperCase()}</div>
      <div class="flex justify-between text-xs"><span>Ingresos ${inc.toFixed(1)} M€/día</span><span>Gastos ${out.toFixed(1)} M€/día</span><b class="${bal >= 0 ? 'text-emerald-400' : 'text-red-400'}">Balance ${bal >= 0 ? '+' : ''}${bal.toFixed(1)}</b></div>${rows}</div>`;
  }
  function policiesHtml() {
    const m = S(), c = C();
    const btns = c.policies.map(x => { const cd = m.cd['Ppol' + x.id] || 0, off = cd > 0 || cap('P') < x.cap || m.P.tes < x.cost;
      return `<button ${off ? 'disabled' : ''} onclick="MP.pol('${x.id}')" class="hoi-button p-2 rounded text-[11px] text-left ${off ? 'opacity-50' : ''}"><div><b>${x.t}</b> <span class="text-slate-400">· ${x.cost} M€ · ${x.cap} cap.</span></div><div class="text-slate-400 font-sans">${x.d}</div><div class="text-[10px] text-slate-500">${cd ? 'Disponible en ' + cd + ' días' : Object.keys(x.P).map(k => k + ' ' + (x.P[k] > 0 ? '+' : '') + x.P[k]).join(' · ') + (x.ES ? ' · efecto en España' : '')}</div></button>`; }).join('');
    return `<div class="hoi-box p-4 rounded-xl space-y-2 font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">DECRETOS DE ${nm('P').toUpperCase()}</div><div class="grid grid-cols-1 md:grid-cols-2 gap-2">${btns}</div></div>`;
  }
  function renderMulti() {
    const head = `<div class="border-b border-slate-800 pb-3"><h3 class="font-hoi-header text-2xl text-amber-400"><i class="fa-solid fa-people-arrows mr-2"></i>MODO MULTIJUGADOR</h3>`;
    if (guest && !guest.s) return '<div class="hoi-box p-5 rounded-xl font-hoi-tech text-slate-300">Conectado a la sala. Esperando datos del anfitrión…</div>';
    if (!S()) {
      const opts = Object.keys(COUNTRIES).map(k => `<button onclick="MP.start('${k}');render()" class="hoi-button px-4 py-2 rounded text-sm">${COUNTRIES[k].flag} Mismo dispositivo con ${COUNTRIES[k].name}</button> <button onclick="MP.host('${k}')" class="hoi-button-gold px-4 py-2 rounded text-sm">${COUNTRIES[k].flag} Crear sala online con ${COUNTRIES[k].name}</button>`).join(' ') + `<div class="flex gap-2 items-center mt-3"><input id="mp-code" maxlength="5" placeholder="CÓDIGO" class="bg-slate-900 border border-slate-700 rounded px-2 py-1 w-28 uppercase text-sm"><button onclick="MP.join(document.getElementById('mp-code').value)" class="hoi-button px-3 py-2 rounded text-sm">Unirme a una sala</button></div>`;
      return `<div class="hoi-box p-5 rounded-xl space-y-4 font-hoi-tech">${head}<p class="text-xs text-slate-400 font-sans">Dos jugadores en el mismo dispositivo: uno gobierna España y otro un país socio. Os pasáis el mando, os proponéis pactos, os enviáis ayuda… o os hacéis la guerra económica. Todo repercute en las relaciones bilaterales de la partida.</p></div>${opts}</div>`;
    }
    const m = S(), me = m.turn, ot = oth(me), c = C();
    const online = m.mode === 'online', isG = !!guest;
    const ctl = isG ? '' : online
      ? `<div class="text-xs text-slate-300 flex items-center gap-3 flex-wrap">Sala <b class="text-amber-300 text-lg tracking-widest">${m.code}</b> ${link && link.open ? '<span class="text-emerald-400">● ' + nm('P') + ' conectado</span>' : '<span class="text-amber-400">○ esperando al jugador…</span>'}${peer ? '' : ' <button onclick="MP.host(\'' + m.partner + '\')" class="hoi-button px-3 py-1 rounded">Reabrir sala</button>'}<button onclick="if(confirm('¿Desactivar el modo multijugador?'))MP.stop()" class="hoi-button px-3 py-1 rounded text-slate-400">Desactivar</button></div>`
      : `<button onclick="MP.swap()" class="hoi-button-gold px-4 py-2 rounded text-sm"><i class="fa-solid fa-repeat mr-1"></i>Pasar el mando a ${flag(ot)} ${nm(ot)}</button><button onclick="if(confirm('¿Desactivar el modo multijugador?'))MP.stop()" class="hoi-button px-3 py-2 rounded text-xs text-slate-400">Desactivar</button>`;
    const sub = isG ? 'Eres el gobierno de <b class="text-amber-300">' + flag('P') + ' ' + nm('P') + '</b>. Tus decisiones se aplican en la partida del anfitrión.' : online ? 'Controlas <b class="text-amber-300">' + flag('ES') + ' España</b>. ' + nm('P') + ' la lleva otro jugador desde su dispositivo.' : 'Controla ahora: <b class="text-amber-300">' + flag(me) + ' ' + nm(me) + '</b>. Al pasar el mando la partida se pausa.';
    const r = Math.round(G() ? G().rel : (intlInit().rel[c.intl] || 0));
    const tabs = me === 'P' ? '<div class="flex gap-2 flex-wrap">' + [['res', 'Resumen y diplomacia'], ['bud', 'Presupuesto'], ['pol', 'Decretos']].map(([k, l]) => `<button onclick="MP.tab('${k}')" class="${tab === k ? 'hoi-button-gold' : 'hoi-button'} px-3 py-1.5 rounded text-xs">${l}</button>`).join('') + '</div>' : '';
    const top = `<div class="hoi-box p-5 rounded-xl space-y-4 font-hoi-tech">${head}<p class="text-xs text-slate-400 font-sans">${sub}</p></div>`;
    if (me === 'P' && tab === 'bud') return top + tabs + budgetHtml();
    if (me === 'P' && tab === 'pol') return top + tabs + policiesHtml();
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
    return `<div class="hoi-box p-5 rounded-xl space-y-4 font-hoi-tech">${head}<p class="text-xs text-slate-400 font-sans">${sub}</p></div>${tabs}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">${card('ES')}${card('P')}</div>
      <div><div class="flex justify-between text-[11px] text-slate-300"><span>Relación ${nm('ES')} – ${nm('P')}</span><span class="font-mono">${r}/100</span></div><div class="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800"><div class="h-full ${r >= 70 ? 'bg-emerald-500' : r <= 30 ? 'bg-red-500' : 'bg-amber-500'}" style="width:${r}%"></div></div></div>
      <div class="flex gap-2 flex-wrap">${ctl}</div>
      ${inbox ? `<div class="space-y-2"><div class="text-[11px] text-amber-400 tracking-wider">PROPUESTAS RECIBIDAS</div>${inbox}</div>` : ''}${evt}
      <div class="hoi-box p-4 rounded-xl space-y-2"><div class="text-[11px] text-amber-400 tracking-wider">ACCIONES DE ${nm(me).toUpperCase()}</div><div class="grid grid-cols-1 md:grid-cols-2 gap-2">${acts}</div></div>
      <div class="hoi-box p-4 rounded-xl space-y-1"><div class="text-[11px] text-amber-400 tracking-wider">REGISTRO</div>${lg}</div>`;
  }

  // ---------------- ENGANCHES CON EL JUEGO ----------------
  window.MP = { start, stop, swap, host, join, leave: closeNet, COUNTRIES,
    act: id => (guest ? gsend({ t: 'act', id }) : act(id)),
    answer: (i, ok) => (guest ? gsend({ t: 'ans', i, ok }) : answer(i, ok)),
    evt: i => (guest ? gsend({ t: 'evt', i }) : resolveEvt(i)),
    bud: (id, v) => (guest ? gsend({ t: 'bud', id, v: +v }) : (setBud(id, v), render())),
    pol: id => (guest ? gsend({ t: 'pol', id }) : pol(id)),
    tab: k => { tab = k; guest ? paintGuest() : render(); } };

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
    if (gameState.daysInOffice !== b) { try { daily(); push(); } catch (e) { console.error(e); } }
  };

  const _s = selectScenario;
  selectScenario = function (id) { if (!(gameState.mp && gameState.mp.mode === 'online')) gameState.mp = null; _s(id); };

  // ---------------- PANTALLA DE INICIO (LOBBY) ----------------
  const L = { on: true, view: 'home', partner: Object.keys(COUNTRIES)[0] };
  const tile = (ic, t, d, click, dis) => `<div ${dis ? '' : `onclick="${click}"`} class="hoi-box p-4 rounded ${dis ? 'opacity-50' : 'cursor-pointer hover:border-amber-400'} flex flex-col gap-2 text-left"><div class="text-2xl text-amber-400">${ic}</div><h3 class="font-hoi-header text-xl text-slate-100">${t}</h3><p class="text-xs text-slate-400 font-sans">${d}</p></div>`;
  const back = '<button onclick="MP.lobby(\'home\')" class="hoi-button px-3 py-1.5 rounded text-xs text-slate-300 self-start"><i class="fa-solid fa-chevron-left mr-1"></i>Volver</button>';
  function lobbyBody() {
    const m = gameState.mp;
    if (m && m.mode === 'online' && peer) {   // sala de espera del anfitrión
      const ok = link && link.open, url = location.origin + location.pathname + '#sala=' + m.code;
      return `<div class="hoi-box p-5 rounded-xl space-y-4 text-center font-hoi-tech"><div class="text-[11px] text-slate-400 tracking-widest">CÓDIGO DE SALA</div><div class="font-hoi-header text-5xl text-amber-400 tracking-[0.4em]">${m.code}</div>
        <button onclick="MP.copy('${url}')" class="hoi-button px-3 py-1.5 rounded text-xs"><i class="fa-solid fa-link mr-1"></i>Copiar enlace de invitación</button>
        <div class="grid grid-cols-2 gap-3 text-sm"><div class="bg-slate-950 border border-emerald-500/50 rounded p-3">🇪🇸 España<div class="text-[11px] text-emerald-400">Tú · anfitrión ✔</div></div>
        <div class="bg-slate-950 border ${ok ? 'border-emerald-500/50' : 'border-slate-700'} rounded p-3">${flag('P')} ${nm('P')}<div class="text-[11px] ${ok ? 'text-emerald-400' : 'text-amber-400'}">${ok ? 'Jugador 2 conectado ✔' : 'Esperando al jugador 2…'}</div></div></div>
        <div class="flex gap-2 justify-center"><button ${ok ? '' : 'disabled'} onclick="MP.begin()" class="hoi-button-gold px-5 py-2 rounded text-sm ${ok ? '' : 'opacity-50'}">Empezar partida</button><button onclick="MP.cancel()" class="hoi-button px-4 py-2 rounded text-sm">Cancelar sala</button></div></div>`;
    }
    if (L.view === 'single') return `<div class="space-y-3">${back}<div class="text-center text-xs text-slate-400 font-hoi-tech tracking-widest">ESCOGE EL PAÍS QUE VAS A GOBERNAR</div><div class="grid grid-cols-1 md:grid-cols-3 gap-3">${tile('🇪🇸', 'España', 'Elige después la época: España actual o la Transición.', 'MP.single()')}${Object.keys(COUNTRIES).map(k => tile(COUNTRIES[k].flag, COUNTRIES[k].name, 'Solo disponible en multijugador (lo lleva el jugador 2).', '', true)).join('')}</div></div>`;
    if (L.view === 'create') {
      const opts = Object.keys(COUNTRIES).map(k => `<button onclick="MP.partner('${k}')" class="${L.partner === k ? 'hoi-button-gold' : 'hoi-button'} px-4 py-3 rounded text-sm">${COUNTRIES[k].flag} ${COUNTRIES[k].name}</button>`).join(' ');
      return `<div class="hoi-box p-5 rounded-xl space-y-4 font-hoi-tech">${back}<div class="text-sm text-slate-200">Tú gobiernas <b class="text-amber-300">🇪🇸 España</b> y el jugador 2 gobierna:</div><div class="flex gap-2 flex-wrap">${opts}</div>
        <div class="flex gap-2 flex-wrap"><button onclick="MP.create()" class="hoi-button-gold px-4 py-2 rounded text-sm"><i class="fa-solid fa-globe mr-1"></i>Crear sala online</button><button onclick="MP.local()" class="hoi-button px-4 py-2 rounded text-sm"><i class="fa-solid fa-desktop mr-1"></i>Mismo dispositivo (por turnos)</button></div>
        <p class="text-[11px] text-slate-500 font-sans">Online: recibirás un código para tu amigo. El anfitrión siempre lleva España porque su navegador ejecuta la simulación.</p></div>`;
    }
    if (L.view === 'join') return `<div class="hoi-box p-5 rounded-xl space-y-4 font-hoi-tech">${back}<div class="text-sm text-slate-200">Introduce el código de la sala del anfitrión:</div><div class="flex gap-2"><input id="mp-code" maxlength="5" placeholder="CÓDIGO" class="bg-slate-900 border border-slate-700 rounded px-3 py-2 w-40 uppercase text-lg tracking-widest"><button onclick="MP.join(document.getElementById('mp-code').value)" class="hoi-button-gold px-4 py-2 rounded text-sm">Entrar</button></div></div>`;
    let has = false; try { has = !!localStorage.getItem(SAVE_KEY); } catch (e) { /* sin guardado */ }
    return `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">${tile('<i class="fa-solid fa-user"></i>', 'Un jugador', 'Escoge país y época y gobierna en solitario.', "MP.lobby('single')")}${tile('<i class="fa-solid fa-people-arrows"></i>', 'Crear partida', 'Tú llevas España y otro jugador, otro país. Por internet o en el mismo dispositivo.', "MP.lobby('create')")}${tile('<i class="fa-solid fa-right-to-bracket"></i>', 'Unirme a una partida', 'Entra con el código de sala que te pase el anfitrión.', "MP.lobby('join')")}</div>
      ${has ? '<div class="text-center"><button onclick="MP.cont()" class="hoi-button-gold px-8 py-2.5 rounded font-hoi-tech text-xs"><i class="fa-solid fa-play mr-1.5"></i>CONTINUAR PARTIDA GUARDADA</button></div>' : ''}`;
  }
  const lob = v => { L.view = v; render(); };
  Object.assign(window.MP, {
    lobby: lob, partner: k => { L.partner = k; render(); }, single: () => { L.on = false; render(); },
    create: () => host(L.partner), local: () => { window.__mpStart = L.partner; L.on = false; render(); },
    begin: () => { L.on = false; render(); }, cancel: () => { L.view = 'create'; stop(); },
    cont: () => { L.on = false; loadGame(); },
    copy: u => { try { navigator.clipboard.writeText(u); goalsToast('Enlace copiado.', '#10b981'); } catch (e) { prompt('Copia el enlace:', u); } }
  });
  const _rs = renderScenarioSelect;
  renderScenarioSelect = function (app) {
    if (!L.on) return _rs(app);
    app.innerHTML = `<div class="max-w-4xl mx-auto space-y-5 my-4"><div class="text-center space-y-1 border-b border-slate-800 pb-4"><div class="text-4xl text-amber-400"><i class="fa-solid fa-landmark"></i></div><h2 class="font-hoi-header text-4xl text-amber-400 tracking-wider">MONCLOA STRATEGY</h2><p class="font-hoi-tech text-[11px] text-slate-400 uppercase tracking-widest">Simulador político y estratégico</p></div>${lobbyBody()}</div>`;
  };
  const hm = location.hash.match(/sala=([A-Za-z0-9]{5})/);
  if (hm) { L.view = 'join'; setTimeout(() => join(hm[1]), 400); }
  let lastStep = 1;

  const _r = render;
  render = function () {
    if (gameState.step === 1 && lastStep > 1) { L.on = true; L.view = 'home'; if (gameState.mp) { closeNet(); gameState.mp = null; } }
    lastStep = gameState.step;
    if (gameState.step === 4 && window.__mpStart && !gameState.mp) { const k = window.__mpStart, net = window.__mpNet; window.__mpStart = null; start(k); if (net) host(k); }
    const r = _r.apply(this, arguments);
    const b = document.getElementById('tab-btn-mp');
    if (b) {
      b.style.display = gameState.step === 4 ? '' : 'none';
      const n = gameState.mp ? gameState.mp.inbox.length + (gameState.mp.evt != null ? 1 : 0) : 0;
      b.querySelector('span').textContent = 'Multijugador' + (n ? ' (' + n + ')' : '');
    }
    if (Date.now() - lastPush > 400) push();
    return r;
  };
})();
