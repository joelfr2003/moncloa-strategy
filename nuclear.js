/* NUCLEAR.JS — Arsenal y disuasión nuclear para MONCLOA STRATEGY.
   Solo aparece en los países con bomba (Francia, EE. UU., Rusia, Corea del Norte). Pestaña "Arsenal nuclear" dentro de Militar y Guerra:
   modernizar, probar, alerta, amenazar, atacar; y amenazas nucleares que recibes de potencias nucleares hostiles. */
(function () {
  'use strict';
  const NUK = { 250: 290, 840: 5044, 643: 5580, 408: 50 };   // ojivas del país propio (id ISO)
  const K = () => (window.COUNTRY_ECON && COUNTRY_ECON.k) || 1;
  const ownIso = () => (window.MC && !MC.builtin && MC.war) ? MC.war.id : 724;
  const WARS = () => gameState.wr || (gameState.wr = {});
  const C = () => window.WAR_C || [];
  const by = id => C().filter(c => c.id === id)[0];
  const day = () => gameState.daysInOffice || 0;
  const fmt = n => Math.round(n).toLocaleString('es-ES');
  const rnd = () => Math.random();
  const tg = (m, c) => { try { goalsToast(m, c || '#ef4444'); } catch (e) { alert(m.replace(/<[^>]+>/g, '')); } };
  const snd = k => { try { fxPlay(k); } catch (e) { /* sin audio */ } };
  const M = (k, v) => { try { focusMetricAdd(k, v); } catch (e) { /* sin métrica */ } };
  const cash = (t, v) => { try { registerFinancialTransaction(t, v); } catch (e) { /* sin tesorería */ } };
  const rival = () => { try { return window.mpRival && window.mpRival(); } catch (e) { return null; } };
  const relOf = c => { const r = WARS().rel; return (r && r[c.id] != null) ? r[c.id] : c.r0; };
  const setRel = (c, v) => { const W = WARS(); W.rel = W.rel || {}; W.rel[c.id] = Math.max(0, Math.min(100, v)); };
  const name = () => (window.COUNTRY_ECON && COUNTRY_ECON.terms && COUNTRY_ECON.terms.nation) || (window.MC && MC.war && MC.war.name) || 'España';

  window.nucHas = () => !!NUK[ownIso()];
  function N() {
    const g = gameState; if (!g.nuc) g.nuc = { wh: NUK[ownIso()] || 0, ready: 80, alert: 5, tests: 0, threats: 0, strikes: 0, kills: 0, cd: {}, sel: null, hist: [], lastIn: 0 };
    return g.nuc;
  }
  const det = n => Math.min(1, Math.log10(1 + n.wh) / 3.5) * (0.5 + 0.5 * n.ready / 100);
  const hist = (n, t) => { n.hist.unshift('Día ' + day() + ' · ' + t); n.hist = n.hist.slice(0, 10); };

  /* ---- ventana propia (no depende del motor) ---- */
  let prevSpeed = null;
  function ov(html) {
    cl(); prevSpeed = gameState.gameSpeed; gameState.gameSpeed = 0;
    const d = document.createElement('div'); d.id = 'nuc-ov'; d.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;padding:16px';
    d.innerHTML = '<div style="max-width:560px;width:100%;background:#0f172a;border:2px solid #b91c1c;border-radius:12px;padding:18px;box-shadow:0 0 40px rgba(220,38,38,.5);color:#e2e8f0;font-family:system-ui,sans-serif;max-height:90vh;overflow:auto">' + html + '</div>';
    document.body.appendChild(d);
  }
  function cl() { const d = document.getElementById('nuc-ov'); if (d) d.remove(); if (prevSpeed != null) { gameState.gameSpeed = prevSpeed; prevSpeed = null; } }
  const opt = (fn, t, h) => `<button onclick="${fn}" style="display:block;width:100%;text-align:left;margin-top:8px;background:#1e293b;border:1px solid #475569;border-radius:8px;padding:9px 11px;color:#f1f5f9;cursor:pointer"><b style="font-size:13px">${t}</b><div style="font-size:11px;color:#94a3b8;margin-top:2px">${h || ''}</div></button>`;
  const head = (tag, t, d) => `<span style="background:#dc2626;color:#000;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px">${tag}</span><h3 style="font-size:22px;color:#f87171;margin:8px 0 4px">${t}</h3><p style="font-size:12px;color:#cbd5e1;line-height:1.4">${d}</p>`;
  window.nucClose = () => { cl(); render(); };

  /* ---- acciones propias ---- */
  const COST = { mod: () => Math.round(3000 * K()), test: () => Math.round(900 * K()) };
  window.nucAct = function (k) {
    const n = N(), d = day();
    if ((n.cd[k] || 0) > d) return tg('Disponible en ' + (n.cd[k] - d) + ' días.', '#d9a726');
    if (k === 'mod') {
      if ((Number(gameState.treasury) || 0) < COST.mod()) return tg('Tesorería insuficiente.');
      cash('Modernización del arsenal nuclear', -COST.mod()); n.wh = Math.round(n.wh * 1.05 + 2); n.ready = Math.min(100, n.ready + 10); n.cd.mod = d + 45; M('mil', 1.5); hist(n, 'Modernización del arsenal'); tg('<b>Arsenal modernizado</b>: más ojivas y mayor preparación.', '#d9a726');
    } else if (k === 'test') {
      if ((Number(gameState.treasury) || 0) < COST.test()) return tg('Tesorería insuficiente.');
      cash('Prueba nuclear', -COST.test()); n.tests++; n.ready = Math.min(100, n.ready + 6); n.cd.test = d + 60; M('apr', -2); M('mil', 2);
      C().forEach(c => { if (!c.b || !/UE|OTAN/.test(c.b) || c.id !== ownIso()) setRel(c, relOf(c) - (c.nuke ? 4 : 7)); });
      hist(n, 'Prueba nuclear'); snd('guerra'); tg('<b>PRUEBA NUCLEAR</b>: condena internacional, pero tu disuasión sube.');
    } else if (k === 'alert') {
      n.alert = n.alert === 1 ? 5 : n.alert - 1; M('est', n.alert < 3 ? -1.5 : 0.5); hist(n, 'Nivel de alerta: ' + n.alert); tg('Nivel de alerta nuclear: <b>' + n.alert + '</b>', n.alert < 3 ? '#ef4444' : '#d9a726');
    }
    render();
  };
  window.nucSel = id => { N().sel = +id; };
  function target() { const n = N(), c = by(n.sel); return c || null; }
  function guard(c) { if (!c) { tg('Elige un país objetivo.'); return false; } const r = rival(); if (r && r.id === c.id) { tg('No puedes usar armas nucleares contra el otro jugador.'); return false; } return true; }

  /* AMENAZA */
  window.nucThreat = function () {
    const n = N(), c = target(), d = day(); if (!guard(c)) return;
    if ((n.cd.thr || 0) > d) return tg('Debes esperar ' + (n.cd.thr - d) + ' días para otra amenaza.', '#d9a726');
    n.cd.thr = d + 30; n.threats++;
    const p = Math.max(.08, Math.min(.85, .25 + .5 * det(n) - (c.nuke ? .3 : 0) - c.s / 220 + (relOf(c) < 30 ? 0 : .05))), r = rnd();
    let t, col = '#d9a726';
    if (r < p) { const amt = Math.round(1500 * K() * (1 + c.s / 60)); cash('Concesión de ' + c.n + ' bajo amenaza nuclear', amt); setRel(c, relOf(c) - 15); M('apr', c.nuke ? 1 : -1); M('mil', 2); t = c.n + ' cede a tu presión y te entrega <b>' + fmt(amt) + ' M</b> en concesiones.'; col = '#10b981'; }
    else if (r < p + (c.nuke ? .4 : .2)) { setRel(c, relOf(c) - 25); n.alert = Math.max(1, n.alert - 1); M('est', -2); M('apr', -2); t = c.n + ' responde con una contraamenaza. La tensión se dispara: alerta nuclear <b>' + n.alert + '</b>.'; }
    else { M('apr', -3); n.ready = Math.max(20, n.ready - 5); t = 'Tu amenaza se queda en un farol: ' + c.n + ' no se inmuta y tu credibilidad cae.'; }
    hist(n, 'Amenaza a ' + c.n); snd('crisis'); tg('<b>AMENAZA NUCLEAR A ' + c.n.toUpperCase() + '</b><br>' + t, col); render();
  };

  /* ATAQUE */
  window.nucStrikeAsk = function () {
    const n = N(), c = target(); if (!guard(c)) return;
    const dead = Math.round((0.6 + c.s / 20) * 1e6);
    ov(head('ORDEN DE LANZAMIENTO', 'Ataque nuclear contra ' + c.n, 'Estimación: unos <b>' + fmt(dead) + '</b> de víctimas. El mundo te condenará: sanciones, ruptura diplomática y una caída enorme de la aprobación. ' + (c.nuke ? c.n + ' es potencia nuclear y puede contraatacar.' : '') + '<br><b style="color:#f87171">Esta decisión no se puede deshacer.</b>')
      + opt('nucStrike()', 'Confirmar el lanzamiento', 'Sin vuelta atrás') + opt('nucClose()', 'Abortar la orden', 'Mantienes la disuasión'));
  };
  window.nucStrike = function () {
    const n = N(), c = target(); cl(); if (!c) return;
    const W = WARS(), w = W.war, dead = Math.round((0.6 + c.s / 20) * 1e6 * (0.8 + rnd() * 0.5));
    n.strikes++; n.kills += dead; n.wh = Math.max(0, n.wh - Math.round(3 + c.s / 15)); hist(n, 'Ataque nuclear a ' + c.n + ' (' + fmt(dead) + ' víctimas)');
    C().forEach(x => setRel(x, relOf(x) - 45)); setRel(c, 0); W.sanc = day() + 360;
    M('apr', -18); M('est', -6); M('eco', -5); M('mil', 3); try { gameState.goals.capital = Math.max(0, gameState.goals.capital - 20); } catch (e) { /* sin capital */ }
    snd('guerra');
    let extra = '';
    if (c.nuke && rnd() < 0.7 - 0.3 * det(n)) { extra = '<br><b style="color:#fecaca">' + c.n + ' contraataca con sus armas nucleares.</b>'; try { window.demoNuke && window.demoNuke(c.n); } catch (e) { /* sin demografía */ } M('eco', -20); M('est', -15); M('apr', -10); }
    if (w && w.id === c.id) w.prog = 100;
    ov(head('ATAQUE NUCLEAR', c.n + ' ha sido devastado', fmt(dead) + ' víctimas. Sanciones internacionales durante un año, rechazo mundial y una caída de la aprobación.' + extra) + opt('nucClose()', 'Aceptar las consecuencias'));
  };

  /* ---- amenazas nucleares que recibes ---- */
  let inC = null;
  function incoming(c, atWar) {
    const n = N(); inC = c; n.lastIn = day(); snd('crisis');
    const umb = C().some(x => /OTAN|UE/.test(x.b || '') && x.nuke && relOf(x) >= 70), has = window.nucHas();
    ov(head('AMENAZA NUCLEAR', c.n + ' amenaza a ' + name() + ' con armas nucleares', 'Un ultimátum nuclear' + (atWar ? ' en plena guerra' : '') + ': exigen que cedas o habrá un ataque. ¿Cómo respondes?')
      + opt('nucIn(0)', 'Pagarles para calmarlos', 'Les entregas ' + fmt(Math.round(2500 * K())) + ' M. Baja la tensión, pero pierdes imagen (−4 Aprobación).')
      + opt('nucIn(1)', 'Ceder a sus exigencias políticas', 'Una concesión pública: −8 Aprobación, relación con ' + c.n + ' +25' + (atWar ? ' y alto el fuego' : '') + '.')
      + opt('nucIn(2)', 'Apelar a la ONU y a tus aliados', umb ? 'Tus aliados nucleares te respaldan: buena probabilidad de que se eche atrás.' : 'Sin un paraguas nuclear aliado, el respaldo es débil.')
      + (has ? opt('nucIn(3)', 'Responder con tu disuasión nuclear', 'Si tu arsenal es creíble, se retira; si no, puede estallar una guerra nuclear.') : '')
      + opt('nucIn(4)', 'No ceder: «no hay que empezar una guerra»', 'Mantienes la dignidad, pero corres el riesgo de que cumplan la amenaza.'));
  }
  window.nucIn = function (o) {
    const c = inC, n = N(); cl(); if (!c) return; let ok = false, t = '';
    const strike = () => { try { window.demoNuke && window.demoNuke(c.n); } catch (e) { /* sin demografía */ } M('eco', -15); M('est', -12); M('apr', -10); snd('derrota'); n.hist.unshift('Día ' + day() + ' · Ataque nuclear recibido de ' + c.n); };
    if (o === 0) { cash('Pago a ' + c.n + ' bajo amenaza nuclear', -Math.round(2500 * K())); M('apr', -4); setRel(c, relOf(c) + 10); ok = true; t = 'Pagas y ' + c.n + ' baja el tono.'; }
    else if (o === 1) { M('apr', -8); M('est', -2); setRel(c, relOf(c) + 25); ok = true; t = 'Cedes a las exigencias de ' + c.n + '.'; try { const w = WARS().war; if (w && w.id === c.id) window.warPeace(); } catch (e) { /* sin guerra */ } }
    else if (o === 2) { const umb = C().some(x => /OTAN|UE/.test(x.b || '') && x.nuke && relOf(x) >= 70); try { gameState.goals.capital = Math.max(0, gameState.goals.capital - 5); } catch (e) { /* sin capital */ } if (rnd() < (umb ? .75 : .35)) { ok = true; t = 'La presión internacional obliga a ' + c.n + ' a retirar la amenaza.'; setRel(c, relOf(c) + 5); } else { if (rnd() < .3) { strike(); t = c.n + ' cumple la amenaza.'; } else { t = 'La mediación fracasa, pero ' + c.n + ' no se atreve a atacar.'; M('apr', -3); } } }
    else if (o === 3) { if (rnd() < det(n) * .85) { ok = true; t = c.n + ' se echa atrás ante tu disuasión.'; M('mil', 3); M('apr', 2); setRel(c, relOf(c) - 10); } else { strike(); t = 'La disuasión falla: ' + c.n + ' lanza un ataque nuclear.'; } }
    else { if (rnd() < (window.nucHas() ? .12 : .22)) { strike(); t = c.n + ' cumple la amenaza y ataca.'; } else { ok = true; t = c.n + ' se echa atrás y la amenaza queda en nada.'; M('apr', 3); M('mil', 2); } }
    n.cd.in = day() + 90;
    ov(head(ok ? 'CRISIS ENFRIADA' : 'CONSECUENCIAS', ok ? 'La amenaza se disipa' : 'La amenaza se materializa', t) + opt('nucClose()', 'Continuar'));
  };
  function step() {
    const n = N(), d = day(), w = WARS().war, r = rival(); if (d < 30 || document.getElementById('nuc-ov') || (n.cd.in || 0) > d) return;
    const hs = C().filter(c => c.nuke && c.id !== ownIso() && !(r && r.id === c.id) && (relOf(c) <= 20 || (w && w.id === c.id)));
    if (!hs.length) return;
    if (rnd() < (w && hs.some(c => c.id === w.id) ? .012 : .004)) incoming(hs[Math.floor(rnd() * hs.length)], !!w);
  }

  /* ---- panel ---- */
  window.nucPanel = function () {
    const n = N(), d = day(), cd = k => (n.cd[k] || 0) > d ? (n.cd[k] - d) + ' d' : '';
    const chip = (l, v, c) => `<div style="background:#0f172a;border:1px solid #1e293b;border-radius:6px;padding:8px;text-align:center;flex:1;min-width:120px"><b style="display:block;font-size:20px;color:${c}">${v}</b><span style="font-size:9px;color:#94a3b8;letter-spacing:.06em">${l}</span></div>`;
    const B = (fn, t, sub, dis, col) => `<button ${dis ? 'disabled' : ''} onclick="${fn}" style="text-align:left;background:${dis ? '#111827' : '#1e293b'};border:1px solid ${col || '#475569'};border-radius:8px;padding:9px;color:#f1f5f9;cursor:${dis ? 'default' : 'pointer'};opacity:${dis ? .5 : 1}"><b style="font-size:12px">${t}</b><div style="font-size:10px;color:#94a3b8">${dis || sub}</div></button>`;
    const al = ['', 'DEFCON 1 · guerra inminente', 'DEFCON 2', 'DEFCON 3', 'DEFCON 4', 'DEFCON 5 · normalidad'][n.alert];
    const sorted = C().filter(c => c.id !== ownIso()).sort((a, b) => a.n.localeCompare(b.n, 'es'));
    if (!n.sel && sorted.length) n.sel = sorted[0].id;
    const sel = `<select onchange="nucSel(this.value)" style="background:#0f172a;border:1px solid #475569;color:#e2e8f0;border-radius:6px;padding:6px;width:100%">${sorted.map(c => `<option value="${c.id}" ${c.id === n.sel ? 'selected' : ''}>${c.n}${c.nuke ? ' ☢' : ''}</option>`).join('')}</select>`;
    return `<div style="display:flex;flex-direction:column;gap:10px">
      <div style="background:linear-gradient(90deg,#450a0a,#0f172a);border:1px solid #b91c1c;border-radius:10px;padding:12px"><b style="font-size:18px;color:#fca5a5">☢ ARSENAL NUCLEAR DE ${name().toUpperCase()}</b>
        <div style="font-size:12px;color:#cbd5e1;margin-top:4px">${al} · La disuasión nuclear influye en las amenazas, los ultimátums y la capacidad de presión sobre otros países.</div></div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${chip('OJIVAS', fmt(n.wh), '#fbbf24')}${chip('PREPARACIÓN', Math.round(n.ready) + '%', '#34d399')}${chip('DISUASIÓN', Math.round(det(n) * 100) + '%', '#f87171')}${chip('PRUEBAS', n.tests, '#e2e8f0')}${chip('AMENAZAS', n.threats, '#e2e8f0')}${chip('ATAQUES', n.strikes, '#ef4444')}</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px">
        ${B("nucAct('mod')", 'Modernizar el arsenal · ' + fmt(COST.mod()) + ' M', '+5 % de ojivas y +10 de preparación', cd('mod'))}
        ${B("nucAct('test')", 'Prueba nuclear · ' + fmt(COST.test()) + ' M', '+6 preparación; condena internacional', cd('test'))}
        ${B("nucAct('alert')", 'Cambiar alerta (' + n.alert + ')', 'Alerta alta: más disuasión, menos estabilidad')}</div>
      <div style="background:#0b1220;border:1px solid #7f1d1d;border-radius:10px;padding:12px"><b style="color:#f87171;font-size:13px">Coacción y ataque</b><div style="margin:8px 0">${sel}</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px">${B('nucThreat()', 'Amenazar con armas nucleares', 'Puede ceder, contraamenazar o ignorarte', cd('thr'), '#d9a726')}${B('nucStrikeAsk()', 'ATAQUE NUCLEAR', 'Devastación total y condena mundial', '', '#dc2626')}</div></div>
      <div style="background:#0b1220;border:1px solid #1e293b;border-radius:10px;padding:12px"><b style="color:#e2e8f0;font-size:13px">Registro nuclear</b>${n.hist.length ? n.hist.map(h => `<div style="font-size:11px;color:#cbd5e1;padding:2px 0">• ${h}</div>`).join('') : '<div style="font-size:11px;color:#64748b">Sin incidentes.</div>'}</div></div>`;
  };

  const _t = gameTick;
  gameTick = function () { const b = gameState.daysInOffice; _t.apply(this, arguments); if (window.nucHas() && gameState.daysInOffice !== b && gameState.step === 4) { try { step(); } catch (e) { console.error('[nuclear]', e); } } };
})();
