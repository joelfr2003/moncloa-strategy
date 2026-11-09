// =====================================================================
//  MODO MULTIJUGADOR: España y Marruecos juegan el MISMO juego (ver marruecos.js):
//  mapa, presupuesto, decretos, Fuerzas Armadas, sucesos y diplomacia, cada uno con su vocabulario.
//  Se puede jugar en línea (cada uno en su dispositivo) o por turnos en el mismo dispositivo.
//  PARA AÑADIR MÁS PAÍSES: añade su configuración en CFG (marruecos.js) y una entrada en COUNTRIES (aquí).
// =====================================================================
(function () {
  'use strict';
  // ---------------- RELÉ ONLINE OPCIONAL (Supabase Realtime, plan gratuito) ----------------
  // Déjalo vacío para usar conexión directa PeerJS. Son datos públicos (Project URL + clave anon/publishable).
  const RELAY = { url: 'https://yvqhhgtwuzytpbttqxem.supabase.co', key: 'sb_publishable_VpXQABhAAWy5slgKgxk5pw_1tSvVHrl' };
  const useRelay = () => !!(RELAY.url && RELAY.key);

  const COUNTRIES = { MA: { name: 'Marruecos', flag: '🇲🇦' } };
  let peer = null, link = null, guest = null, USER = '';
  try { USER = localStorage.getItem('moncloa_user') || ''; } catch (e) { /* sin almacenamiento */ }
  const toast = t => { try { goalsToast(t, '#ef4444'); } catch (e) { console.log(t); } };
  const mp = () => gameState.mp;
  const pc = () => COUNTRIES[(mp() && mp().partner) || L.partner] || COUNTRIES.MA;
  const flag = s => (s === 'ES' ? '🇪🇸' : pc().flag);
  const nm = s => (s === 'ES' ? 'España' : pc().name);

  // ---------------- LÓGICA ----------------
  function start(partner) {
    if (!COUNTRIES[partner]) return;
    gameState.mp = { on: true, partner, mode: 'local', turn: 'ES' };
    DUEL.startLocal();
  }
  function stop() { closeNet(); if (window.DUEL) DUEL.reset(); gameState.mp = null; render(); }
  function swap() {
    const c = DUEL.swap(); mp().turn = DUEL.turn === 'es' ? 'ES' : 'MA';
    try { setGameSpeed(0); } catch (e) { /* ya en pausa */ }
    goalsToast('Mando para ' + c.flag + ' ' + c.name + '. Partida en pausa.', '#d9a726'); render();
  }

  // ---------------- ONLINE (Supabase Realtime o PeerJS) ----------------
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
    RELAY.url = (RELAY.url || '').trim().replace(/^(https?:\/\/[^\/]+).*$/i, '$1').replace(/^http:/i, 'https:'); RELAY.key = (RELAY.key || '').trim();
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/i.test(RELAY.url)) toast('La URL debe ser la «Project URL», tipo https://xxxx.supabase.co (sin /rest/v1).');
    if (/^sb_secret_/.test(RELAY.key)) toast('Has pegado una clave SECRETA. Usa la «anon» (eyJ…) o la «publishable».');
    const sb = window.supabase.createClient(RELAY.url, RELAY.key), other = role === 'host' ? 'guest' : 'host';
    const ch = sb.channel('moncloa-' + code, { config: { broadcast: { self: false }, presence: { key: role + Math.random().toString(36).slice(2, 7) } } });
    const Lk = { open: false, h: {}, on(e, f) { this.h[e] = f; }, send(d) { ch.send({ type: 'broadcast', event: 'm', payload: { from: role, d } }); }, close() { Lk.open = false; try { sb.removeChannel(ch); } catch (e) { /* ya cerrado */ } } };
    ch.on('broadcast', { event: 'm' }, ({ payload }) => { if (payload && payload.from !== role && Lk.h.data) Lk.h.data(payload.d); });
    ch.on('presence', { event: 'sync' }, () => {
      const has = Object.keys(ch.presenceState()).some(k => k.indexOf(other) === 0);
      if (has && !Lk.open) { Lk.open = true; if (Lk.h.open) Lk.h.open(); }
      else if (!has && Lk.open) { Lk.open = false; if (Lk.h.close) Lk.h.close(); }
    });
    let ok = false;
    setTimeout(() => { if (!ok) toast('Supabase no responde tras 10 s: ¿proyecto pausado, URL mal o websockets bloqueados?'); }, 10000);
    if (role === 'guest') setTimeout(() => { if (ok && !Lk.open) toast('No se encuentra la sala ' + code + '. Comprueba el código y que el anfitrión la tenga abierta.'); }, 12000);
    ch.subscribe((st, err) => {
      if (st === 'SUBSCRIBED') { ok = true; ch.track({ role }); }
      else if (st === 'CHANNEL_ERROR' || st === 'TIMED_OUT' || st === 'CLOSED') { console.error('Supabase Realtime:', st, err); toast('Supabase: ' + st + (err && err.message ? ' — ' + err.message : '') + '. Revisa la URL y la clave.'); }
    });
    return Lk;
  }
  function wireHost(c) {
    link = c;
    c.on('open', () => { if (window.ESX) ESX.linked(true); render(); });
    c.on('data', onCmd);
    c.on('close', () => { link = null; if (window.ESX) ESX.linked(false); render(); });
  }
  function closeNet() { try { if (link) link.close(); if (peer) peer.destroy(); } catch (e) { /* ya cerrado */ } link = peer = null; guest = null; paintGuest(); }
  function host(partner) {
    (useRelay() ? loadSb : loadPeer)(() => {
      if (peer) { try { peer.destroy(); } catch (e) { /* nada */ } }
      gameState.mp = { on: true, partner, mode: 'online', turn: 'ES', code: Math.random().toString(36).slice(2, 7).toUpperCase(), gn: '' };
      DUEL.startOnline();
      const m = mp();
      if (useRelay()) { const Lk = relayLink(m.code, 'host'); peer = { destroy: () => Lk.close() }; wireHost(Lk); render(); return; }
      peer = new Peer('moncloa-' + m.code);
      peer.on('open', () => render());
      peer.on('error', e => { toast('Error de conexión: ' + e.type); peer = null; render(); });
      peer.on('connection', c => { if (link && link.open) { c.close(); return; } wireHost(c); });
      render();
    });
  }
  function join(code) {
    code = (code || '').trim().toUpperCase(); if (!code) return;
    (useRelay() ? loadSb : loadPeer)(() => {
      closeNet();
      const opened = () => { guest = { code, ok: true }; gsend({ t: 'hello', n: USER }); paintGuest(); };
      const data = d => { if (d && d.t === 'x' && window.MORO) MORO.onMsg(d); };
      const closed = () => { if (guest) { guest.ok = false; paintGuest(); } };
      if (useRelay()) {
        const Lk = relayLink(code, 'guest'); link = Lk; peer = { destroy: () => Lk.close() };
        Lk.on('open', opened); Lk.on('data', data); Lk.on('close', closed); return;
      }
      peer = new Peer();
      peer.on('error', e => { toast(e.type === 'peer-unavailable' ? 'No existe la sala ' + code + ' (revisa el código o que el anfitrión la tenga abierta).' : 'No se pudo conectar: ' + e.type); closeNet(); });
      peer.on('open', () => { const c = peer.connect('moncloa-' + code, { reliable: true }); link = c; c.on('open', opened); c.on('data', data); c.on('close', closed); });
    });
  }
  const gsend = o => { if (link && link.open) link.send(o); };
  function onCmd(d) {   // mensajes del jugador 2
    if (!d) return;
    if (d.t === 'x') { if (window.ESX) ESX.onMsg(d); return; }
    if (d.t === 'hello' && mp()) { mp().gn = String(d.n || '').slice(0, 16); render(); }
  }
  function paintGuest() {
    if (!guest) { if (window.MORO) MORO.hide(); return; }
    if (window.MORO) MORO.show(guest);
  }

  // ---------------- INTERFAZ DE LA PESTAÑA «MULTIJUGADOR» ----------------
  function renderMulti() {
    const head = '<h3 class="font-hoi-header text-2xl text-amber-400"><i class="fa-solid fa-people-arrows mr-2"></i>MODO MULTIJUGADOR</h3>';
    if (!mp()) {
      const opts = Object.keys(COUNTRIES).map(k => `<button onclick="MP.start('${k}');render()" class="hoi-button px-4 py-2 rounded text-sm">${COUNTRIES[k].flag} Mismo dispositivo con ${COUNTRIES[k].name}</button> <button onclick="MP.host('${k}')" class="hoi-button-gold px-4 py-2 rounded text-sm">${COUNTRIES[k].flag} Crear sala online con ${COUNTRIES[k].name}</button>`).join(' ');
      return `<div class="hoi-box p-5 rounded-xl space-y-4 font-hoi-tech">${head}<p class="text-xs text-slate-400 font-sans">Dos países, el mismo juego: cada uno gestiona su mapa, presupuesto, decretos, Fuerzas Armadas y sucesos con su propio vocabulario, y se relacionan por ayuda, tratados y operaciones hostiles.</p><div class="flex gap-2 flex-wrap">${opts}</div></div>`;
    }
    const m = mp(), online = m.mode === 'online', me = DUEL.turn === 'es' ? 'ES' : 'MA', ot = me === 'ES' ? 'MA' : 'ES';
    const ctl = online
      ? `<div class="text-xs text-slate-300 flex items-center gap-3 flex-wrap">Sala <b class="text-amber-300 text-lg tracking-widest">${m.code}</b> ${link && link.open ? '<span class="text-emerald-400">● ' + nm('MA') + ' conectado' + (m.gn ? ' (' + m.gn + ')' : '') + '</span>' : '<span class="text-amber-400">○ esperando al jugador…</span>'}${peer ? '' : ' <button onclick="MP.host(\'' + m.partner + '\')" class="hoi-button px-3 py-1 rounded">Reabrir sala</button>'}<button onclick="if(confirm('¿Cerrar la sala y desactivar el multijugador?'))MP.stop()" class="hoi-button px-3 py-1 rounded text-slate-400">Cerrar sala</button></div>`
      : `<div class="flex gap-2 flex-wrap items-center"><button onclick="MP.swap()" class="hoi-button-gold px-4 py-2 rounded text-sm"><i class="fa-solid fa-repeat mr-1"></i>Pasar el mando a ${flag(ot)} ${nm(ot)}</button><button onclick="if(confirm('¿Desactivar el modo multijugador?'))MP.stop()" class="hoi-button px-3 py-2 rounded text-xs text-slate-400">Desactivar</button></div>`;
    const sub = online ? 'Gobiernas <b class="text-amber-300">🇪🇸 España</b>. ' + nm('MA') + ' la lleva otro jugador desde su dispositivo, con su propio juego completo.' : 'Controla ahora: <b class="text-amber-300">' + flag(me) + ' ' + nm(me) + '</b>. Al pasar el mando la partida se pausa y el otro país recibe lo pendiente.';
    return DUEL.panel(`<div class="hoi-box p-5 rounded-xl space-y-3 font-hoi-tech mb-3">${head}<p class="text-xs text-slate-400 font-sans">${sub}</p>${ctl}</div>`);
  }

  window.MP = { start, stop, swap, host, join, leave: closeNet, COUNTRIES, sendX: o => { if (link && link.open) link.send(Object.assign({ t: 'x' }, o)); } };

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

  const _s = selectScenario;
  selectScenario = function (id) { if (!(gameState.mp && gameState.mp.mode === 'online')) { gameState.mp = null; if (window.DUEL) DUEL.reset(); } _s(id); };


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

  const L = { on: true, view: 'home', country: 'ES', partner: 'MA', err: '', code: '' };
  const CL = () => [{ id: 'ES', name: 'España', flag: '🇪🇸', tag: 'Gobierno · Anfitrión', sub: 'Presidente del Gobierno: Consejo de Ministros, comunidades, Fuerzas Armadas y diplomacia.' }]
    .concat(Object.keys(COUNTRIES).map(k => ({ id: k, name: COUNTRIES[k].name, flag: COUNTRIES[k].flag, tag: 'Solo multijugador', sub: 'Jefe del Gobierno en Rabat: regiones, decretos, FAR y diplomacia, con tu propio juego.' })));
  const userOk = () => USER.trim().length >= 2;
  function need() { if (userOk()) return true; L.err = 'Escribe un nombre de usuario (mínimo 2 caracteres).'; render(); const i = document.getElementById('lb-user'); if (i) i.focus(); return false; }
  const btn = (c, ic, t, f, dis) => `<button ${dis ? 'disabled' : `onclick="${f}"`} class="${c} px-5 py-2.5 rounded-lg text-sm ${dis ? 'opacity-50' : ''}"><i class="fa-solid ${ic} mr-2"></i>${t}</button>`;
  const back = '<button onclick="MP.lobby(\'home\')" class="hoi-button px-3 py-1.5 rounded text-xs text-slate-300 self-start"><i class="fa-solid fa-chevron-left mr-1"></i>Volver</button>';

  function lobbyCard() {
    const m = gameState.mp;
    if (m && m.mode === 'online' && peer) {   // sala de espera del anfitrión
      const ok = link && link.open, url = location.origin + location.pathname + '#sala=' + m.code;
      return `<div class="text-center space-y-1"><div class="lb-label">Código de sala</div><div class="lb-cn" style="font-size:60px;letter-spacing:.35em;color:#f5cf68">${m.code}</div>
        <button onclick="MP.copy('${url}')" class="hoi-button px-3 py-1.5 rounded text-xs"><i class="fa-solid fa-link mr-1"></i>Copiar enlace de invitación</button></div>
        <div class="lb-countries"><div class="lb-country sel"><div class="lb-flag">🇪🇸</div><div class="lb-cn">España</div><div class="text-xs text-emerald-400">${USER} · anfitrión ✔</div></div>
        <div class="lb-country ${ok ? 'sel' : ''}"><div class="lb-flag">${flag('MA')}</div><div class="lb-cn">${nm('MA')}</div><div class="text-xs ${ok ? 'text-emerald-400' : 'text-amber-400'}">${ok ? (m.gn || 'Jugador 2') + ' conectado ✔' : 'Esperando al jugador 2…'}</div></div></div>
        <div class="flex gap-2 justify-center flex-wrap">${btn('hoi-button-gold', 'fa-play', 'Empezar partida', 'MP.begin()', !ok)}${btn('hoi-button', 'fa-xmark', 'Cancelar sala', 'MP.cancel()')}</div>`;
    }
    if (L.view === 'create') {
      const opts = Object.keys(COUNTRIES).map(k => `<button onclick="MP.partner('${k}')" class="${L.partner === k ? 'hoi-button-gold' : 'hoi-button'} px-4 py-3 rounded-lg text-sm">${COUNTRIES[k].flag} ${COUNTRIES[k].name}</button>`).join(' ');
      return `${back}<div class="lb-label">Tú gobiernas 🇪🇸 España · el jugador 2 gobierna</div><div class="flex gap-2 flex-wrap">${opts}</div>
        <div class="flex gap-2 flex-wrap">${btn('hoi-button-gold', 'fa-globe', 'Crear sala online', 'MP.create()')}${btn('hoi-button', 'fa-desktop', 'Mismo dispositivo (por turnos)', 'MP.local()')}</div>
        <p class="text-[11px] text-slate-500 font-sans">Online: recibirás un código para tu amigo. Los dos jugáis el mismo juego, cada uno con su país: tú en tu partida de España y él en la de Marruecos.</p>`;
    }
    let has = false; try { has = !!localStorage.getItem(SAVE_KEY); } catch (e) { /* sin guardado */ }
    const cards = CL().map(c => `<div class="lb-country ${L.country === c.id ? 'sel' : ''}" onclick="MP.country('${c.id}')"><div class="lb-flag">${c.flag}</div><div class="lb-cn">${c.name}</div><span class="lb-tag">${c.tag}</span><p class="text-[11px] text-slate-400 font-sans mt-2">${c.sub}</p></div>`).join('');
    const acts = L.country === 'ES'
      ? btn('hoi-button-gold', 'fa-user', 'Un jugador', 'MP.single()') + btn('hoi-button', 'fa-people-arrows', 'Crear partida multijugador', "MP.lobby('create')")
      : `<input id="mp-code" maxlength="5" value="${L.code}" placeholder="CÓDIGO DE SALA" class="lb-input" style="width:190px;text-transform:uppercase;letter-spacing:.2em">${btn('hoi-button-gold', 'fa-right-to-bracket', 'Entrar a la sala', "MP.enter(document.getElementById('mp-code').value)")}`;
    return `<div><div class="lb-label mb-1">1 · Nombre de usuario</div><input id="lb-user" class="lb-input" maxlength="16" placeholder="Ej.: Presidente_Moncloa" value="${USER.replace(/"/g, '')}" oninput="MP.user(this.value)"><div class="lb-err mt-1">${L.err}</div></div>
      <div><div class="lb-label mb-2">2 · Elige tu país</div><div class="lb-countries">${cards}</div></div>
      <div><div class="lb-label mb-2">3 · ${L.country === 'ES' ? 'Elige cómo jugar' : 'Únete a la partida de un anfitrión'}</div><div class="flex gap-2 flex-wrap items-center">${acts}</div></div>
      ${has ? '<div class="text-center">' + btn('hoi-button', 'fa-folder-open', 'Continuar partida guardada', 'MP.cont()') + '</div>' : ''}`;
  }
  const lob = v => { L.view = v; L.err = ''; render(); };
  Object.assign(window.MP, {
    lobby: lob, partner: k => { L.partner = k; render(); }, country: k => { L.country = k; L.err = ''; render(); },
    user: v => { USER = v.slice(0, 16); L.err = ''; try { localStorage.setItem('moncloa_user', USER); } catch (e) { /* nada */ } },
    single: () => { if (need()) { L.on = false; render(); } },
    create: () => { if (need()) host(L.partner); },
    local: () => { if (need()) { window.__mpStart = L.partner; L.on = false; render(); } },
    enter: c => { if (need()) { L.code = (c || '').toUpperCase(); join(L.code); } },
    begin: () => { L.on = false; render(); }, cancel: () => { L.view = 'create'; stop(); },
    cont: () => { L.on = false; loadGame(); },
    copy: u => { try { navigator.clipboard.writeText(u); goalsToast('Enlace copiado.', '#10b981'); } catch (e) { prompt('Copia el enlace:', u); } }
  });
  const _rs = renderScenarioSelect;
  renderScenarioSelect = function (app) {
    if (!L.on) return _rs(app);
    app.innerHTML = `<div class="lb-root"><div class="lb-photo"></div>${bgSvg()}<div class="lb-shade"></div><div class="lb-wrap">
      <div><div class="lb-title">MONCLOA<br>STRATEGY</div></div><div class="lb-sub">Simulador político y estratégico · Siglo XXI</div>
      <div class="lb-card">${lobbyCard()}</div><div class="lb-foot">MONCLOA STRATEGY © 2026 · @joelfr302003</div></div></div>`;
  };
  const hm = location.hash.match(/sala=([A-Za-z0-9]{5})/);
  if (hm) { L.country = 'MA'; L.code = hm[1].toUpperCase(); if (userOk()) setTimeout(() => join(L.code), 400); else L.err = 'Escribe tu nombre de usuario y pulsa «Entrar a la sala».'; }
  let lastStep = 1;

  const _r = render;
  render = function () {
    if (gameState.step === 1 && lastStep > 1) { L.on = true; L.view = 'home'; if (gameState.mp) { closeNet(); if (window.DUEL) DUEL.reset(); gameState.mp = null; } }
    lastStep = gameState.step;
    document.body.classList.toggle('mp-lobby', gameState.step === 1 && L.on);
    if (gameState.step === 4 && window.__mpStart && !gameState.mp) { const k = window.__mpStart, net = window.__mpNet; window.__mpStart = null; start(k); if (net) host(k); }
    const r = _r.apply(this, arguments);
    const b = document.getElementById('tab-btn-mp');
    if (b) {
      b.style.display = gameState.step === 4 ? '' : 'none';
      const n = gameState.mp && window.DUEL ? DUEL.pending() : 0;
      b.querySelector('span').textContent = 'Multijugador' + (n ? ' (' + n + ')' : '');
    }
    return r;
  };
})();
