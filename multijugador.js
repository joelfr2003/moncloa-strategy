// =====================================================================
//  MODO MULTIJUGADOR (online)
//  Cada jugador corre su PROPIA partida completa con su país (?pais=espana, ?pais=marruecos…).
//  Por la red solo viajan mensajes de diplomacia: propuestas, aceptaciones/rechazos, ayudas,
//  acciones hostiles y el valor de la relación bilateral. Nunca se envían estadísticas,
//  escaños, tesorería ni coaliciones del otro jugador.
// =====================================================================
(function () {
  'use strict';
  // ---------------- RELÉ ONLINE OPCIONAL (Supabase Realtime, plan gratuito) ----------------
  // Déjalo vacío para usar conexión directa PeerJS.
  const RELAY = { url: 'https://yvqhhgtwuzytpbttqxem.supabase.co/rest/v1/', key: 'sb_publishable_VpXQABhAAWy5slgKgxk5pw_1tSvVHrl' };
  const useRelay = () => !!(RELAY.url && RELAY.key);

  const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------------- PAÍSES ----------------
  // Para añadir un país: su fichero en Countries/ y, si quieres, su bandera y clave INTL aquí.
  const FLAGS = { espana: '🇪🇸', marruecos: '🇲🇦' };
  const INTL_KEY = { espana: 'es', marruecos: 'ma' };   // clave de la relación bilateral en gameState.intl.rel (si existe)
  const myC = () => window.CURRENT_COUNTRY || { id: 'espana', name: 'España' };
  const flagOf = id => FLAGS[id] || '🏳️';
  const nameOf = id => { const c = (window.COUNTRIES || []).filter(x => x.id === id)[0]; return c ? c.name : id; };

  // ---------------- ACCIONES DIPLOMÁTICAS ----------------
  // A = quien actúa/propone, B = el otro. Cada lado aplica SOLO sus propios efectos en su partida.
  // k:'prop' = el otro debe aceptar · k:'now' = efecto inmediato (hostil) · pact = pacto estable
  const ACTIONS = [
    { id: 'aid', t: 'Ofrecer ayuda económica', ic: 'fa-hand-holding-dollar', k: 'prop', cap: 5, escrow: 500, A: { cash: -500, apr: -1 }, B: { cash: 500, eco: 3, apr: 2 }, rel: 7,
      d: 'Envías 500 M€ al otro país (se descuentan al proponer; se devuelven si lo rechaza). Mejora su economía y la relación.' },
    { id: 'aidreq', t: 'Solicitar ayuda económica', ic: 'fa-hand-holding-heart', k: 'prop', cap: 3, A: { cash: 500, eco: 3, apr: 2 }, B: { cash: -500, apr: -1 }, rel: 6,
      d: 'Pides 500 M€ al otro país. Solo se transfiere si acepta y tiene fondos.' },
    { id: 'trade', t: 'Acuerdo comercial', ic: 'fa-ship', k: 'prop', pact: true, cap: 5, A: { eco: 1 }, B: { eco: 1 }, rel: 5,
      d: 'Pacto estable: ambos ganan economía e ingresos cada mes.' },
    { id: 'border', t: 'Pacto fronterizo y migratorio', ic: 'fa-shield-halved', k: 'prop', pact: true, cap: 5, A: { est: 2 }, B: { est: 2 }, rel: 5,
      d: 'Cooperación en las fronteras: ambos ganan estabilidad.' },
    { id: 'defense', t: 'Alianza de defensa', ic: 'fa-jet-fighter', k: 'prop', pact: true, cap: 7, A: { mil: 2 }, B: { mil: 2 }, rel: 4,
      d: 'Maniobras e inteligencia conjuntas: ambos ganan poder militar.' },
    { id: 'press', t: 'Presión diplomática', ic: 'fa-bullhorn', k: 'now', cap: 4, A: { apr: 2 }, B: { apr: -3, est: -3 }, rel: -9,
      d: 'Presionas al otro gobierno: baja su aprobación y estabilidad; la relación se resiente.' },
    { id: 'embargo', t: 'Cierre de frontera y aranceles', ic: 'fa-ban', k: 'now', cap: 6, A: { eco: -2 }, B: { eco: -5 }, rel: -14, breaks: ['trade', 'border'],
      d: 'Golpe económico al otro (y algo a ti). Rompe los pactos comercial y fronterizo.' }
  ];
  const ACT = id => ACTIONS.filter(x => x.id === id)[0];
  const PACT_FX = { trade: ['eco', 0.02], border: ['est', 0.025], defense: ['mil', 0.025] };
  const STAT = { eco: 1, est: 1, apr: 1, mil: 1, emp: 1, con: 1 };

  // ---------------- ESTADO ----------------
  let peer = null, link = null, USER = '';
  try { USER = localStorage.getItem('moncloa_user') || ''; } catch (e) { /* sin almacenamiento */ }
  const blank = () => ({ on: true, role: null, code: '', other: null, linked: false, rel: 50, pacts: { trade: false, border: false, defense: false }, inbox: [], log: [], cd: {} });
  const S = () => gameState.mp;
  function ensure() {
    if (!gameState.mp) gameState.mp = blank();
    return gameState.mp;
  }
  const oname = () => { const m = S(); return m && m.other ? m.other.name : 'el otro país'; };
  const oflag = () => { const m = S(); return m && m.other ? flagOf(m.other.id) : '🏳️'; };
  const toast = (t, c) => { try { goalsToast(t, c || '#ef4444'); } catch (e) { console.log(t); } };
  const fmt = n => Math.round(n).toLocaleString('es-ES');

  // ---------------- EFECTOS EN MI PROPIA PARTIDA ----------------
  const treas = () => Number(gameState.treasury) || 0;
  const cap = () => { goalsInit(); return gameState.goals.capital; };
  const spendCap = v => { goalsInit(); gameState.goals.capital -= v; };
  function cash(v, why) { try { registerFinancialTransaction(why || 'Cooperación con ' + oname(), v); } catch (e) { gameState.treasury = treas() + v; } }
  function fx(o, why) {
    Object.keys(o || {}).forEach(k => {
      if (k === 'cash') cash(o.cash, why);
      else if (STAT[k]) { try { focusAccum(focusInit(), k, o[k]); } catch (e) { focusMetricAdd(k, o[k]); } }
    });
  }
  function setRel(v) {
    const m = S(); if (!m) return; m.rel = clamp(Number(v) || 0);
    try { const k = m.other && INTL_KEY[m.other.id], I = intlInit(); if (k && I.rel && I.rel[k] != null) I.rel[k] = m.rel; } catch (e) { /* sin INTL */ }
  }
  function log(t) {
    const m = S(); if (!m) return;
    m.log.unshift({ d: gameState.daysInOffice || 0, t }); m.log.length = Math.min(m.log.length, 12);
    try { addNewsToTicker(t, 'Cooperación'); } catch (e) { /* sin ticker */ }
  }

  // ---------------- MENSAJES (lo único que viaja por la red) ----------------
  const tx = o => { const m = S(); if (link && link.open) link.send(Object.assign({ rel: m ? Math.round(m.rel * 100) / 100 : undefined, p: m ? m.pacts : undefined }, o)); };
  const adopt = d => {   // confirma la relación y los pactos con los valores del emisor
    const m = S(); if (!m || !d) return;
    if (typeof d.rel === 'number' && isFinite(d.rel)) setRel(d.rel);
    if (d.p && typeof d.p === 'object') Object.keys(m.pacts).forEach(k => { if (typeof d.p[k] === 'boolean') m.pacts[k] = d.p[k]; });
  };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  // ---------------- LÓGICA DIPLOMÁTICA ----------------
  function act(id) {
    const m = S(), x = ACT(id);
    if (!m || !x) return;
    if (!m.linked) return toast('No hay conexión con el otro jugador.');
    if ((x.pact && m.pacts[id]) || (m.cd[id] || 0) > 0) return;
    if (cap() < x.cap) return toast('Capital político insuficiente.');
    if (x.k === 'prop') {
      if (m.inbox.some(i => i.mine && i.id === id)) return toast('Ya hay una propuesta pendiente.');
      if (x.escrow && treas() < x.escrow) return toast('Fondos insuficientes.');
      spendCap(x.cap);
      if (x.escrow) cash(-x.escrow, 'Ayuda a ' + oname());
      const u = uid(); m.inbox.push({ uid: u, id, mine: true });
      tx({ t: 'prop', uid: u, id });
      log('Propones a ' + oname() + ': ' + x.t + '.');
    } else {
      spendCap(x.cap); m.cd[id] = 20;
      fx(x.A); (x.breaks || []).forEach(k => { m.pacts[k] = false; }); setRel(m.rel + x.rel);
      tx({ t: 'now', id });
      log('Acción contra ' + oname() + ': ' + x.t + '.');
    }
    render();
  }
  function answer(u, ok) {
    const m = S(), it = m && m.inbox.filter(i => i.uid === u && !i.mine)[0], x = it && ACT(it.id);
    if (!it || !x) return;
    if (ok) {
      if (x.B.cash < 0 && treas() < -x.B.cash) return toast('Fondos insuficientes para aceptar.');
      fx(x.B, (x.B.cash < 0 ? 'Ayuda a ' : 'Ayuda recibida de ') + oname());
      if (x.pact) m.pacts[x.id] = true; else m.cd[x.id] = 20;
      setRel(m.rel + x.rel);
      log('Aceptas «' + x.t + '» de ' + oname() + '.');
    } else { setRel(m.rel - 2); log('Rechazas «' + x.t + '» de ' + oname() + '.'); }
    m.inbox = m.inbox.filter(i => i.uid !== u);
    tx({ t: 'res', uid: u, id: x.id, ok: !!ok });
    render();
  }
  function onData(d) {
    const m = S(); if (!m || !d || typeof d.t !== 'string') return;
    if (d.t === 'hello') {
      m.other = { id: String(d.c || '').slice(0, 24), name: String(d.n || d.c || 'Otro país').slice(0, 30), user: String(d.u || '').slice(0, 16) };
      if (m.role === 'host') {   // el anfitrión arbitra el valor inicial de la relación (el de su propia partida, si existe)
        try { const k = INTL_KEY[m.other.id], I = intlInit(); if (k && I.rel && I.rel[k] != null) m.rel = clamp(I.rel[k]); } catch (e) { /* sin INTL */ }
        tx({ t: 'sync', auth: true });
      }
      if (m.other.id === myC().id) toast('Los dos jugadores tenéis el mismo país: uno debe cambiarlo.', '#d9a726');
      else toast(esc(m.other.user || m.other.name) + ' (' + esc(m.other.name) + ') se ha conectado.', '#10b981');
      render(); return;
    }
    if (d.t === 'sync') { if (d.auth && m.role === 'guest') adopt(d); render(); return; }
    const x = ACT(d.id);
    if (d.t === 'prop' && x && x.k === 'prop' && typeof d.uid === 'string') {
      if (m.inbox.some(i => i.uid === d.uid)) return;
      m.inbox.push({ uid: d.uid, id: x.id, mine: false });
      log(oname() + ' te propone: ' + x.t + '.'); toast(oflag() + ' ' + esc(oname()) + ' te propone: ' + esc(x.t), '#d9a726');
    } else if (d.t === 'res' && x) {
      const it = m.inbox.filter(i => i.uid === d.uid && i.mine)[0]; if (!it) return;
      m.inbox = m.inbox.filter(i => i.uid !== d.uid);
      if (d.ok) {
        const a = Object.assign({}, x.A); if (x.escrow) delete a.cash;   // la ayuda ya se pagó al proponer
        fx(a, 'Ayuda de ' + oname()); if (!x.pact) m.cd[x.id] = 20;
        log(oname() + ' acepta «' + x.t + '».'); toast(oflag() + ' ' + esc(oname()) + ' acepta: ' + esc(x.t), '#10b981');
      } else {
        if (x.escrow) cash(x.escrow, 'Ayuda devuelta por ' + oname());
        log(oname() + ' rechaza «' + x.t + '».'); toast(oflag() + ' ' + esc(oname()) + ' rechaza: ' + esc(x.t));
      }
      adopt(d);
    } else if (d.t === 'now' && x && x.k === 'now') {
      fx(x.B); (x.breaks || []).forEach(k => { m.pacts[k] = false; }); adopt(d);
      log(oname() + ' aplica contra ti: ' + x.t + '.'); toast(oflag() + ' ' + esc(oname()) + ': ' + esc(x.t));
    }
    render();
  }
  // Cada día: efectos propios de los pactos. La deriva de la relación solo la calcula el anfitrión y la confirma al otro.
  function daily() {
    const m = S(); if (!m) return;
    const d = gameState.daysInOffice || 0, pk = Object.keys(m.pacts).filter(k => m.pacts[k]);
    Object.keys(m.cd).forEach(k => { if (m.cd[k] > 0) m.cd[k]--; });
    pk.forEach(k => fx({ [PACT_FX[k][0]]: PACT_FX[k][1] }));
    if (m.pacts.trade && d % 30 === 0) cash(150, 'Pacto comercial con ' + oname());
    if (m.role === 'host' && m.linked && pk.length) { setRel(m.rel + 0.05 * pk.length); if (d % 10 === 0) tx({ t: 'sync', auth: true }); }
  }


  // ---------------- ONLINE (PeerJS directo o relé Supabase) ----------------
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
    // Normaliza y valida los datos antes de conectar, para dar un error claro
    RELAY.url = (RELAY.url || '').trim().replace(/^(https?:\/\/[^\/]+).*$/i, '$1').replace(/^http:/i, 'https:'); RELAY.key = (RELAY.key || '').trim();
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/i.test(RELAY.url)) toast('La URL debe ser la «Project URL», tipo https://xxxx.supabase.co (sin /rest/v1).');
    if (/^sb_secret_/.test(RELAY.key)) toast('Has pegado una clave SECRETA. Usa la «anon» (eyJ…) o la «publishable».');
    const sb = window.supabase.createClient(RELAY.url, RELAY.key), other = role === 'host' ? 'guest' : 'host';
    const ch = sb.channel('moncloa-' + code, { config: { broadcast: { self: false }, presence: { key: role + Math.random().toString(36).slice(2, 7) } } });
    const L = { open: false, h: {}, on(e, f) { this.h[e] = f; }, send(d) { ch.send({ type: 'broadcast', event: 'm', payload: { from: role, d } }); }, close() { L.open = false; try { sb.removeChannel(ch); } catch (e) { /* ya cerrado */ } } };
    ch.on('broadcast', { event: 'm' }, ({ payload }) => { if (payload && payload.from !== role && L.h.data) L.h.data(payload.d); });
    ch.on('presence', { event: 'sync' }, () => {
      const has = Object.keys(ch.presenceState()).some(k => k.indexOf(other) === 0);
      if (has && !L.open) { L.open = true; if (L.h.open) L.h.open(); }
      else if (!has && L.open) { L.open = false; if (L.h.close) L.h.close(); }
    });
    let ok = false;
    setTimeout(() => { if (!ok) toast('Supabase no responde tras 10 s: ¿proyecto pausado, URL mal o websockets bloqueados?'); }, 10000);
    ch.subscribe((st, err) => {
      if (st === 'SUBSCRIBED') { ok = true; ch.track({ role }); }
      else if (st === 'CHANNEL_ERROR' || st === 'TIMED_OUT' || st === 'CLOSED') { console.error('Supabase Realtime:', st, err); toast('Supabase: ' + st + (err && err.message ? ' — ' + err.message : '') + '. Revisa la URL y la clave (consola F12 para más detalle).'); }
    });
    return L;
  }

  // ---------------- CONEXIÓN ----------------
  function wire(c) {
    link = c;
    const hello = () => { const m = ensure(); m.linked = true; tx({ t: 'hello', c: myC().id, n: myC().name, u: USER }); render(); };
    c.on('open', hello);
    c.on('data', onData);
    c.on('close', () => { const m = S(); if (m) { m.linked = false; log('Conexión con ' + oname() + ' perdida.'); } link = null; render(); });
  }
  function closeNet() { try { if (link) link.close(); if (peer) peer.destroy(); } catch (e) { /* ya cerrado */ } link = peer = null; const m = S(); if (m) { m.linked = false; m.role = null; m.code = ''; } }
  function host() {
    if (!userOk()) return need();
    (useRelay() ? loadSb : loadPeer)(() => {
      closeNet(); const m = ensure(); m.role = 'host'; m.other = null; m.code = Math.random().toString(36).slice(2, 7).toUpperCase();
      if (useRelay()) { const L = relayLink(m.code, 'host'); peer = { destroy: () => L.close() }; wire(L); render(); return; }
      peer = new Peer('moncloa-' + m.code);
      peer.on('open', () => render());
      peer.on('error', e => { toast('Error de conexión: ' + e.type); peer = null; render(); });
      peer.on('connection', c => { if (link && link.open) { c.close(); return; } wire(c); });
      render();
    });
  }
  function join(code) {
    code = (code || '').trim().toUpperCase(); if (!code) return;
    if (!userOk()) return need();
    (useRelay() ? loadSb : loadPeer)(() => {
      closeNet(); const m = ensure(); m.role = 'guest'; m.code = code; m.other = null;
      if (useRelay()) { const L = relayLink(code, 'guest'); peer = { destroy: () => L.close() }; wire(L); render(); return; }
      peer = new Peer();
      peer.on('error', e => { toast('No se pudo conectar: ' + e.type); closeNet(); render(); });
      peer.on('open', () => { wire(peer.connect('moncloa-' + code, { reliable: true })); });
      render();
    });
  }

  // ---------------- PESTAÑA «MULTIJUGADOR» DENTRO DE LA PARTIDA ----------------
  function connPanel() {
    const m = S() || {};
    if (m.linked) return '';
    if (m.role === 'host') return `<div class="hoi-box p-4 rounded-xl space-y-2 font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">SALA CREADA · ESPERANDO AL OTRO JUGADOR</div>
      <div class="text-3xl tracking-[.35em] text-amber-300 font-bold">${esc(m.code)}</div>
      <button onclick="MP.copy('${esc(location.origin + location.pathname)}#sala=${esc(m.code)}')" class="hoi-button px-3 py-1.5 rounded text-xs"><i class="fa-solid fa-link mr-1"></i>Copiar enlace de invitación</button>
      <button onclick="MP.leave()" class="hoi-button px-3 py-1.5 rounded text-xs ml-2">Cancelar</button></div>`;
    if (m.role === 'guest') return `<div class="hoi-box p-4 rounded-xl font-hoi-tech text-xs text-slate-300">Conectando con la sala <b class="text-amber-300">${esc(m.code)}</b>… <button onclick="MP.leave()" class="hoi-button px-3 py-1.5 rounded text-xs ml-2">Cancelar</button></div>`;
    return `<div class="hoi-box p-4 rounded-xl space-y-3 font-hoi-tech"><div class="text-[11px] text-amber-400 tracking-wider">CONEXIÓN</div>
      <div class="flex gap-2 flex-wrap items-center"><button onclick="MP.host()" class="hoi-button-gold px-4 py-2 rounded text-sm"><i class="fa-solid fa-globe mr-1"></i>Crear sala</button>
      <input id="mp-code2" maxlength="5" placeholder="CÓDIGO" class="lb-input" style="width:130px;text-transform:uppercase;letter-spacing:.2em">
      <button onclick="MP.enter(document.getElementById('mp-code2').value)" class="hoi-button px-4 py-2 rounded text-sm">Unirse</button></div></div>`;
  }
  function renderMulti() {
    const head = `<div class="border-b border-slate-800 pb-3"><h3 class="font-hoi-header text-2xl text-amber-400"><i class="fa-solid fa-people-arrows mr-2"></i>MULTIJUGADOR</h3></div>`;
    const m = S(), me = myC();
    const sub = `<p class="text-xs text-slate-400 font-sans">Gobiernas ${flagOf(me.id)} <b class="text-amber-300">${esc(me.name)}</b> con tu propia partida completa. Solo se comparte la diplomacia: propuestas, pactos, ayudas y la relación; el otro jugador nunca ve tus estadísticas.</p>`;
    if (!m || !m.linked) return `<div class="hoi-box p-5 rounded-xl space-y-3 font-hoi-tech">${head}${sub}</div>${connPanel()}${m && m.log.length ? logHtml(m) : ''}`;
    const r = Math.round(m.rel), same = m.other && m.other.id === me.id;
    const inbox = m.inbox.filter(i => !i.mine).map(it => { const x = ACT(it.id); if (!x) return '';
      return `<div class="bg-slate-900 border border-amber-500/40 rounded p-2 text-[11px] space-y-1"><div><b>${oflag()} ${esc(oname())}</b> te propone: <b class="text-amber-300">${x.t}</b></div><div class="text-slate-400">${x.d}</div>
      <div class="flex gap-2"><button onclick="MP.answer('${it.uid}',true)" class="hoi-button-gold px-3 py-1 rounded">Aceptar</button><button onclick="MP.answer('${it.uid}',false)" class="hoi-button px-3 py-1 rounded">Rechazar</button></div></div>`; }).join('');
    const acts = ACTIONS.map(x => {
      const on = x.pact && m.pacts[x.id], cd = m.cd[x.id] || 0, pend = m.inbox.some(i => i.mine && i.id === x.id), off = on || cd > 0 || pend || cap() < x.cap;
      return `<button ${off ? 'disabled' : ''} onclick="MP.act('${x.id}')" class="hoi-button p-2 rounded text-[11px] text-left ${off ? 'opacity-50' : ''} ${x.k === 'now' ? 'border-red-500/40' : ''}"><div><i class="fa-solid ${x.ic} mr-1"></i><b>${x.t}</b> <span class="text-slate-500">· ${x.cap} cap.</span></div><div class="text-slate-400 mt-0.5">${x.d}</div><div class="text-[10px] mt-1 ${on ? 'text-emerald-400' : 'text-slate-500'}">${on ? '✔ ACTIVO' : pend ? 'Propuesta pendiente' : cd > 0 ? 'Disponible en ' + cd + ' días' : x.k === 'prop' ? 'Requiere aceptación' : 'Efecto inmediato'}</div></button>`; }).join('');
    const pk = [['trade', 'Comercio'], ['border', 'Frontera'], ['defense', 'Defensa']].map(([k, l]) => `<span class="text-[10px] px-2 py-0.5 rounded border ${m.pacts[k] ? 'border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-500'}">${l}</span>`).join(' ');
    return `<div class="hoi-box p-5 rounded-xl space-y-3 font-hoi-tech">${head}${sub}</div>
      ${same ? '<div class="hoi-box p-3 rounded-xl text-xs text-amber-300 font-hoi-tech">⚠ Los dos jugadores gobernáis el mismo país. Uno debe cambiar de país desde el menú principal.</div>' : ''}
      <div class="bg-slate-950 border border-amber-500/40 rounded-lg p-3 space-y-2 font-hoi-tech">
        <div class="flex justify-between items-center"><b class="text-sm text-slate-100">${oflag()} ${esc(oname())}</b><span class="text-[10px] text-emerald-400">● ${esc(m.other.user || 'conectado')}</span></div>
        <div class="flex justify-between text-[11px] text-slate-300"><span>Relación ${esc(me.name)} – ${esc(oname())}</span><span class="font-mono">${r}/100</span></div>
        <div class="h-1.5 bg-slate-900 rounded overflow-hidden"><div class="h-full ${r >= 60 ? 'bg-emerald-500' : r >= 35 ? 'bg-amber-500' : 'bg-red-500'}" style="width:${r}%"></div></div>
        <div class="flex gap-1 flex-wrap">${pk}</div>
        <div class="flex justify-between text-[11px] text-slate-400"><span>Tu capital político: <b class="text-slate-200">${Math.floor(cap())}</b></span><span>Tu tesorería: <b class="text-slate-200">${fmt(treas())} M€</b></span></div>
        <button onclick="MP.leave()" class="hoi-button px-3 py-1 rounded text-[10px]">Desconectar</button></div>
      ${inbox ? `<div class="space-y-2"><div class="text-[11px] text-amber-400 tracking-wider">PROPUESTAS RECIBIDAS</div>${inbox}</div>` : ''}
      <div class="hoi-box p-4 rounded-xl space-y-2"><div class="text-[11px] text-amber-400 tracking-wider font-hoi-tech">DIPLOMACIA CON ${esc(oname()).toUpperCase()}</div><div class="grid grid-cols-1 md:grid-cols-2 gap-2">${acts}</div></div>
      ${logHtml(m)}`;
  }
  const logHtml = m => `<div class="hoi-box p-4 rounded-xl space-y-1"><div class="text-[11px] text-amber-400 tracking-wider font-hoi-tech">REGISTRO</div>${m.log.map(l => `<div class="text-[11px] text-slate-400"><span class="text-slate-600 font-mono">día ${l.d}</span> · ${esc(l.t)}</div>`).join('') || '<div class="text-[11px] text-slate-600">Sin movimientos.</div>'}</div>`;

  // ---------------- ENGANCHES CON EL JUEGO ----------------
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
    const b = gameState.daysInOffice;
    _t.apply(this, arguments);
    if (gameState.daysInOffice !== b && S()) { try { daily(); } catch (e) { console.error(e); } }
  };

  // ---------------- PANTALLA DE INICIO (LOBBY) ----------------
  const css = document.createElement('style');
  css.textContent = `
  body.mp-lobby header, body.mp-lobby footer, body.mp-lobby #top-hud { display: none !important; }
  body.mp-lobby main#app { margin: 0 !important; width: 100% !important; max-width: none !important; padding: 0 !important; }
  .lb-root { position: fixed; inset: 0; overflow-y: auto; background: #050b14; z-index: 5; }
  .lb-bg, .lb-photo, .lb-shade { position: absolute; inset: 0; width: 100%; height: 100%; }
  .lb-photo { background: url(img/portada.jpg) center / cover no-repeat; opacity: .6; }
  .lb-shade { background: radial-gradient(ellipse at 50% 35%, rgba(5,11,20,.05), rgba(5,11,20,.82) 78%); }
  .lb-far { animation: lbdrift 90s linear infinite alternate; } .lb-near { animation: lbdrift 55s linear infinite alternate-reverse; }
  .lb-star { animation: lbtw 4s ease-in-out infinite; }
  @keyframes lbdrift { from { transform: translateX(-30px); } to { transform: translateX(30px); } }
  @keyframes lbtw { 50% { opacity: .25; } }
  .lb-wrap { position: relative; min-height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 28px 14px; gap: 18px; }
  .lb-title { font-family: 'Teko', sans-serif; font-weight: 700; font-size: clamp(52px, 10vw, 104px); letter-spacing: .14em; line-height: .88; text-align: center; background: linear-gradient(180deg, #f8dc82, #b88a19); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 6px 24px rgba(217,167,38,.28)); }
  .lb-sub { font-family: 'Chakra Petch', sans-serif; font-size: 12px; letter-spacing: .38em; color: #94a3b8; text-transform: uppercase; text-align: center; }
  .lb-card { width: min(780px, 100%); background: rgba(10,16,22,.76); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); border: 1px solid rgba(217,167,38,.35); border-radius: 14px; padding: 22px; box-shadow: 0 30px 80px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.06); display: flex; flex-direction: column; gap: 16px; font-family: 'Chakra Petch', sans-serif; }
  .lb-label { font-size: 11px; letter-spacing: .25em; color: #d9a726; text-transform: uppercase; }
  .lb-input { width: 100%; background: rgba(2,6,10,.7); border: 1px solid #2c3940; border-radius: 8px; padding: 12px 14px; color: #f1f5f9; font-size: 17px; outline: none; }
  .lb-input:focus { border-color: #d9a726; box-shadow: 0 0 0 3px rgba(217,167,38,.18); }
  .lb-countries { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; }
  .lb-country { cursor: pointer; border: 1px solid #2c3940; border-radius: 10px; padding: 14px; background: rgba(15,23,30,.8); transition: all .15s; text-align: left; }
  .lb-country:hover { border-color: #d9a726; transform: translateY(-2px); }
  .lb-country.sel { border-color: #f5cf68; background: linear-gradient(180deg, rgba(217,167,38,.2), rgba(15,23,30,.85)); box-shadow: 0 0 22px rgba(217,167,38,.22); }
  .lb-flag { font-size: 40px; line-height: 1; } .lb-cn { font-family: 'Teko', sans-serif; font-size: 26px; letter-spacing: .06em; color: #f1f5f9; line-height: 1.1; }
  .lb-tag { display: inline-block; font-size: 10px; letter-spacing: .12em; padding: 2px 8px; border-radius: 999px; border: 1px solid #3d4f59; color: #94a3b8; }
  .lb-err { color: #f87171; font-size: 12px; min-height: 16px; }
  .lb-foot { font-size: 10px; letter-spacing: .2em; color: #64748b; text-align: center; }`;
  document.head.appendChild(css);

  function bgSvg() {   // portada generada: cielo, estrellas, siluetas de ciudad y un enlace España–Marruecos
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    let stars = ''; for (let i = 0; i < 90; i++) stars += `<circle class="lb-star" style="animation-delay:${(rnd() * 4).toFixed(1)}s" cx="${(rnd() * 1600).toFixed(0)}" cy="${(rnd() * 480).toFixed(0)}" r="${(rnd() * 1.3 + .3).toFixed(1)}" fill="#e2e8f0" opacity="${(rnd() * .6 + .3).toFixed(2)}"/>`;
    const sky = (base, amp, w, fill, op) => { let x = -60, d = ''; while (x < 1700) { const h = base + rnd() * amp, ww = w + rnd() * w; d += `<rect x="${x.toFixed(0)}" y="${(900 - h).toFixed(0)}" width="${ww.toFixed(0)}" height="${h.toFixed(0)}"/>`; x += ww + rnd() * 6; } return `<g fill="${fill}" opacity="${op}">${d}</g>`; };
    const columns = [0, 1, 2, 3, 4, 5].map(i => `<rect x="${150 + i * 34}" y="620" width="14" height="140"/>`).join('');
    return `<svg class="lb-bg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>
      <linearGradient id="lbs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03070d"/><stop offset=".55" stop-color="#0e2035"/><stop offset=".82" stop-color="#3b2b1d"/><stop offset="1" stop-color="#7a5418"/></linearGradient>
      <radialGradient id="lbg" cx=".5" cy=".86" r=".55"><stop offset="0" stop-color="#f5cf68" stop-opacity=".45"/><stop offset="1" stop-color="#f5cf68" stop-opacity="0"/></radialGradient></defs>
      <rect width="1600" height="900" fill="url(#lbs)"/><rect width="1600" height="900" fill="url(#lbg)"/>${stars}
      <path d="M470 330 Q800 150 1130 330" fill="none" stroke="#f5cf68" stroke-width="1.5" stroke-dasharray="6 8" opacity=".55"/><circle cx="470" cy="330" r="6" fill="#ef4444"/><circle cx="1130" cy="330" r="6" fill="#22c55e"/><circle cx="470" cy="330" r="16" fill="none" stroke="#ef4444" opacity=".5"/><circle cx="1130" cy="330" r="16" fill="none" stroke="#22c55e" opacity=".5"/>
      <g class="lb-far">${sky(120, 150, 28, '#13243a', .9)}</g><g class="lb-near">${sky(60, 110, 34, '#0a1522', 1)}</g>
      <g fill="#070e17"><rect x="120" y="760" width="260" height="140"/>${columns}<polygon points="130,620 250,560 370,620"/><rect x="120" y="760" width="260" height="14" fill="#0c1826"/>
      <rect x="1230" y="540" width="70" height="360"/><rect x="1215" y="525" width="100" height="22"/><path d="M1248 640 a17 22 0 0 1 34 0 v40 h-34z" fill="#f5cf68" opacity=".35"/><rect x="1180" y="780" width="170" height="120"/></g>
      <rect y="860" width="1600" height="40" fill="#04080e"/></svg>`;
  }

  const L = { on: true, view: 'home', err: '', code: '' };
  try { const c = sessionStorage.getItem('mp_code'); if (c) { L.code = c; sessionStorage.removeItem('mp_code'); } } catch (e) { /* nada */ }
  function userOk() { return USER.trim().length >= 2; }
  function need() { if (userOk()) return true; L.err = 'Escribe un nombre de usuario (mínimo 2 caracteres).'; render(); const i = document.getElementById('lb-user'); if (i) i.focus(); return false; }
  const btn = (c, ic, t, f, dis) => `<button ${dis ? 'disabled' : `onclick="${f}"`} class="${c} px-5 py-2.5 rounded-lg text-sm ${dis ? 'opacity-50' : ''}"><i class="fa-solid ${ic} mr-2"></i>${t}</button>`;

  function lobbyCard() {
    const m = S(), me = myC();
    if (m && m.role && peer) {   // sala de espera
      const ok = m.linked, url = location.origin + location.pathname + '#sala=' + m.code;
      return `<div class="text-center space-y-1"><div class="lb-label">${m.role === 'host' ? 'Código de sala' : 'Conectando a la sala'}</div><div class="lb-cn" style="font-size:60px;letter-spacing:.35em;color:#f5cf68">${esc(m.code)}</div>
        ${m.role === 'host' ? `<button onclick="MP.copy('${esc(url)}')" class="hoi-button px-3 py-1.5 rounded text-xs"><i class="fa-solid fa-link mr-1"></i>Copiar enlace de invitación</button>` : ''}</div>
        <div class="lb-countries"><div class="lb-country sel"><div class="lb-flag">${flagOf(me.id)}</div><div class="lb-cn">${esc(me.name)}</div><div class="text-xs text-emerald-400">${esc(USER)} · tú</div></div>
        <div class="lb-country ${ok ? 'sel' : ''}"><div class="lb-flag">${ok ? oflag() : '⏳'}</div><div class="lb-cn">${ok ? esc(oname()) : 'Esperando…'}</div><div class="text-xs ${ok ? 'text-emerald-400' : 'text-slate-500'}">${ok ? esc(m.other && m.other.user || 'conectado') : 'sin conectar'}</div></div></div>
        ${ok && m.other && m.other.id === me.id ? '<div class="lb-err">Los dos tenéis el mismo país. Uno debe cancelar y elegir otro.</div>' : ''}
        <p class="text-[11px] text-slate-500 font-sans text-center">Cada jugador empieza su propia partida con su país; solo se comparte la diplomacia. No hace falta empezar a la vez.</p>
        <div class="flex gap-2 justify-center flex-wrap">${btn('hoi-button-gold', 'fa-play', 'Empezar mi partida', 'MP.begin()', !ok)}${btn('hoi-button', 'fa-xmark', 'Cancelar', 'MP.cancel()')}</div>`;
    }
    let has = false; try { has = !!localStorage.getItem(SAVE_KEY); } catch (e) { /* sin guardado */ }
    const cards = (window.COUNTRIES || []).map(c => `<div class="lb-country ${me.id === c.id ? 'sel' : ''}" onclick="MP.country('${esc(c.id)}')"><div class="lb-flag">${flagOf(c.id)}</div><div class="lb-cn">${esc(c.name)}</div><div class="lb-tag">${me.id === c.id ? 'Tu país' : 'Cambiar a este país'}</div></div>`).join('');
    return `<div><div class="lb-label mb-1">1 · Nombre de usuario</div><input id="lb-user" class="lb-input" maxlength="16" placeholder="Ej.: Presidente_Moncloa" value="${esc(USER)}" oninput="MP.user(this.value)"></div>
      <div><div class="lb-label mb-2">2 · Elige tu país</div><div class="lb-countries">${cards}</div></div>
      <div><div class="lb-label mb-2">3 · Cómo jugar</div><div class="flex gap-2 flex-wrap items-center">
        ${btn('hoi-button-gold', 'fa-user', 'Un jugador', 'MP.single()')}${btn('hoi-button', 'fa-globe', 'Crear sala online', 'MP.host()')}
        <input id="mp-code" maxlength="5" value="${esc(L.code)}" placeholder="CÓDIGO DE SALA" class="lb-input" style="width:190px;text-transform:uppercase;letter-spacing:.2em" oninput="MP.codeIn(this.value)">
        ${btn('hoi-button', 'fa-right-to-bracket', 'Unirse', "MP.enter(document.getElementById('mp-code').value)")}</div></div>
      <div class="lb-err">${esc(L.err)}</div>
      ${has ? '<div class="text-center">' + btn('hoi-button', 'fa-folder-open', 'Continuar partida guardada', 'MP.cont()') + '</div>' : ''}`;
  }

  window.MP = {
    host, act, answer,
    join: c => join(c), enter: c => { L.code = (c || '').toUpperCase(); join(L.code); },
    leave: () => { closeNet(); gameState.mp = null; render(); },
    cancel: () => { closeNet(); gameState.mp = null; L.err = ''; render(); },
    codeIn: v => { L.code = v.toUpperCase(); },
    user: v => { USER = v.slice(0, 16); L.err = ''; try { localStorage.setItem('moncloa_user', USER); } catch (e) { /* nada */ } },
    country: id => {   // cambiar de país recarga la página (cada país carga su propio fichero); la conexión debe crearse después
      if (id === myC().id) return;
      try { if (L.code) sessionStorage.setItem('mp_code', L.code); } catch (e) { /* nada */ }
      if (typeof window.switchCountry === 'function') window.switchCountry(id);
    },
    single: () => { if (need()) { closeNet(); gameState.mp = null; L.on = false; render(); } },
    begin: () => { L.on = false; render(); },
    cont: () => { L.on = false; loadGame(); },
    copy: u => { try { navigator.clipboard.writeText(u); goalsToast('Enlace copiado.', '#10b981'); } catch (e) { prompt('Copia el enlace:', u); } },
    rel: () => (S() ? S().rel : null), pacts: () => (S() ? Object.assign({}, S().pacts) : {}), isLinked: () => !!(S() && S().linked),
    tab: () => render(), toast
  };

  const _rs = renderScenarioSelect;
  renderScenarioSelect = function (app) {
    if (!L.on) { _rs(app); return; }
    app.innerHTML = `<div class="lb-root"><div class="lb-photo"></div>${bgSvg()}<div class="lb-shade"></div><div class="lb-wrap">
      <div><div class="lb-title">MONCLOA<br>STRATEGY</div></div><div class="lb-sub">Simulador político y estratégico · Siglo XXI</div>
      <div class="lb-card">${lobbyCard()}</div><div class="lb-foot">MONCLOA STRATEGY © 2026 · @joelfr302003</div></div></div>`;
  };
  const hm = location.hash.match(/sala=([A-Za-z0-9]{5})/);
  if (hm) { L.code = hm[1].toUpperCase(); if (userOk()) setTimeout(() => join(L.code), 400); else L.err = 'Escribe tu nombre de usuario y pulsa «Unirse».'; }
  let lastStep = 1;

  const _r = render;
  render = function () {
    if (gameState.step === 1 && lastStep > 1) { L.on = true; L.view = 'home'; if (gameState.mp) { closeNet(); gameState.mp = null; } }
    lastStep = gameState.step;
    document.body.classList.toggle('mp-lobby', gameState.step === 1 && L.on);
    const mm = S(); if (mm && mm.linked && !(link && link.open)) mm.linked = false;   // partida cargada: sin conexión viva
    const r = _r.apply(this, arguments);
    const b = document.getElementById('tab-btn-mp');
    if (b) {
      b.style.display = gameState.step === 4 ? '' : 'none';
      const n = mm ? mm.inbox.filter(i => !i.mine).length : 0;
      b.querySelector('span').textContent = 'Multijugador' + (n ? ' (' + n + ')' : '');
    }
    return r;
  };
})();
