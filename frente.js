/* FRENTE.JS — Teatro de operaciones estilo Hearts of Iron para MONCLOA STRATEGY.
   Muestra, dentro de "Militar y Guerra", el avance del frente por sectores, divisiones, suministros,
   bajas propias/enemigas/civiles, gráfico del frente y parte de batallas. Funciona en solitario y en multijugador. */
(function () {
  'use strict';
  const FX_KEY = 'moncloa_frente_fx';
  const SEC = ['Sector Norte', 'Cuña Noroeste', 'Eje Central', 'Cuña Sudeste', 'Sector Sur', 'Flanco Costero'];
  const fmt = n => Math.round(n).toLocaleString('es-ES');
  const fx = () => { try { return localStorage.getItem(FX_KEY) !== '0'; } catch (e) { return true; } };
  const W = () => gameState && gameState.wr, WAR = () => (W() && W().war) || null;
  const enemy = w => (window.WAR_C || []).filter(c => c.id === w.id)[0] || { n: 'Enemigo', s: 30 };
  const ownName = () => (window.COUNTRY_ECON && ((COUNTRY_ECON.terms && COUNTRY_ECON.terms.nation) || (COUNTRY_ECON.war && COUNTRY_ECON.war.name))) || 'Tu país';
  const isPvp = w => { try { const r = window.mpRival && window.mpRival(); return !!(r && r.id === w.id); } catch (e) { return false; } };
  const css = document.createElement('style');
  css.textContent = `
  .th{background:linear-gradient(#0b1220,#060a12);border:1px solid #7f1d1d;border-radius:10px;padding:10px;margin-bottom:12px;box-shadow:0 0 24px rgba(220,38,38,.15)}
  .th svg{width:100%;height:auto;display:block;border-radius:6px;background:#0a0f1a}
  .th-flow{stroke-dasharray:6 6;animation:thflow 1s linear infinite}@keyframes thflow{to{stroke-dashoffset:-12}}
  .th-line{stroke-dasharray:10 5;animation:thflow 1.4s linear infinite}
  .th-arr{animation:tharr 1.1s ease-in-out infinite}@keyframes tharr{50%{transform:translateX(6px)}}
  .th-arr.l{animation-name:tharl}@keyframes tharl{50%{transform:translateX(-6px)}}
  .th-stat{background:#0f172a;border:1px solid #1e293b;border-radius:6px;padding:6px 8px;text-align:center}
  .th-stat b{display:block;font-size:17px;line-height:1.1;font-variant-numeric:tabular-nums}.th-stat span{font-size:9px;letter-spacing:.06em;color:#94a3b8;text-transform:uppercase}
  .th-pill{position:fixed;left:12px;bottom:12px;z-index:60;background:#450a0a;border:1px solid #ef4444;color:#fecaca;font-size:11px;padding:6px 10px;border-radius:999px;cursor:pointer;box-shadow:0 0 14px rgba(239,68,68,.45);animation:thpulse 2s infinite}
  @keyframes thpulse{50%{box-shadow:0 0 22px rgba(239,68,68,.9)}}
  body.th-war.th-fx::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:40;box-shadow:inset 0 0 130px rgba(185,28,28,.30);animation:thvig 4s ease-in-out infinite}
  @keyframes thvig{50%{box-shadow:inset 0 0 200px rgba(185,28,28,.42)}}
  .th-g6{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-top:8px}.th-g3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}@media(max-width:760px){.th-g6{grid-template-columns:repeat(3,1fr)}.th-g3{grid-template-columns:1fr}}
  .th-feed div{font-size:11px;padding:3px 0;border-bottom:1px solid #1e293b;color:#cbd5e1}`;
  document.head.appendChild(css);

  function init(w) {
    if (w.th) return w.th;
    const off = SEC.map(() => 0);
    return (w.th = { off, dir: SEC.map(() => 0), h: [w.prog || 0], dk: [], dok: [], ok: 0, ek: 0, civ: 0, pow: 0, feed: [], last: gameState.daysInOffice || 0, boomN: 0 });
  }

  /* ---- simulación diaria (se engancha al motor sin tocarlo) ---- */
  function step() {
    const w = WAR(), Wr = W(); if (!w || !Wr) return;
    const th = init(w), day = gameState.daysInOffice || 0; if (day === th.last) return; th.last = day;
    const c = enemy(w), mine = (Wr.t + Wr.m + Wr.a) / 3;
    const ownDead = Math.round((w.baj || 0) * 180), dOwn = Math.max(0, ownDead - th.ok);
    const dEn = Math.round((0.4 + mine / 55) * (w.prog > 0 ? 1.5 : 0.9) * 180 * (0.8 + Math.random() * 0.5) * ((w.sup != null && w.sup < 25) ? .8 : 1));
    th.ok = ownDead; th.ek += dEn; th.civ += Math.round((w.prog < 0 ? dOwn * 0.15 : 0) + dEn * 0.1);
    th.h.push(w.prog); th.dk.push(dEn); th.dok.push(dOwn); ['h', 'dk', 'dok'].forEach(k => { if (th[k].length > 90) th[k].shift(); });
    const prev = th.h[th.h.length - 2] != null ? th.h[th.h.length - 2] : w.prog, mv = w.prog - prev;
    SEC.forEach((s, i) => { const o0 = th.off[i]; th.off[i] = Math.max(-18, Math.min(18, th.off[i] * 0.85 + (Math.random() - .5) * 7)); th.dir[i] = mv + (th.off[i] - o0) * .3; });
    if (Math.random() < 0.45) {
      const i = Math.floor(Math.random() * SEC.length), win = th.dir[i] + (Math.random() - .5) > 0;
      const n = Math.round(300 + Math.random() * 1400);
      th.feed.unshift({ d: day, ok: win, t: (win ? 'Avance en ' : 'Retroceso en ') + SEC[i] + ' · ' + fmt(n) + ' bajas ' + (win ? 'enemigas' : 'propias') });
      th.feed = th.feed.slice(0, 12);
    }
    upd();
  }

  /* ---- dibujo ---- */
  function frontPts(w, th) { return SEC.map((s, i) => [450 + w.prog * 3.8 + th.off[i], 45 + i * 66]); }
  function upd() {
    const w = WAR(), Wr = W(), g = document.getElementById('th-g'); document.body.classList.toggle('th-war', !!w); document.body.classList.toggle('th-fx', !!w && fx());
    pill(w);
    if (!w || !g) return;
    const th = init(w), c = enemy(w), pts = frontPts(w, th), sup = w.sup == null ? 80 : w.sup;
    const ownDiv = Math.max(1, Math.round((Wr.t || 40) / 3.5) - Math.floor(th.ok / 9000)), enDiv = Math.max(1, Math.round((c.s || 30) / 3.2) - Math.floor(th.ek / 9000));
    const per = SEC.map((s, i) => ({ o: Math.max(1, Math.round(ownDiv / SEC.length + (i % 2))), e: Math.max(1, Math.round(enDiv / SEC.length + ((i + 1) % 2))) }));
    const poly = pts.map(p => p.join(',')).join(' ');
    let h = `<polygon points="0,0 ${poly.replace(/^(\S+)/, '$1')} 0,420" fill="rgba(16,185,129,.13)"/><polygon points="900,0 ${pts.map(p => p.join(',')).join(' ')} 900,420" fill="rgba(220,38,38,.14)"/>`;
    h += `<polyline points="${poly}" fill="none" stroke="#fbbf24" stroke-width="3" class="th-line"/>`;
    pts.forEach((p, i) => {
      const adv = th.dir[i] > 0.15, ret = th.dir[i] < -0.15, y = p[1], sc = sup < 25 ? '#ef4444' : sup < 50 ? '#f59e0b' : '#38bdf8';
      h += `<line x1="70" y1="210" x2="${p[0] - 46}" y2="${y}" stroke="${sc}" stroke-width="1.4" opacity=".75" class="th-flow"/>`;
      h += `<g><rect x="${p[0] - 62}" y="${y - 11}" width="34" height="22" rx="2" fill="#064e3b" stroke="#34d399"/><text x="${p[0] - 45}" y="${y + 5}" font-size="12" fill="#ecfdf5" text-anchor="middle" font-weight="700">${per[i].o}</text></g>`;
      h += `<g><rect x="${p[0] + 28}" y="${y - 11}" width="34" height="22" rx="2" fill="#7f1d1d" stroke="#f87171"/><text x="${p[0] + 45}" y="${y + 5}" font-size="12" fill="#fef2f2" text-anchor="middle" font-weight="700">${per[i].e}</text></g>`;
      if (adv) h += `<path class="th-arr" d="M${p[0] - 24} ${y - 5} h26 v-6 l14 11 l-14 11 v-6 h-26z" fill="#10b981" opacity=".85"/>`;
      if (ret) h += `<path class="th-arr l" d="M${p[0] + 24} ${y - 5} h-26 v-6 l-14 11 l14 11 v-6 h26z" fill="#ef4444" opacity=".85"/>`;
      h += `<text x="${p[0]}" y="${y + 24}" font-size="8" fill="#94a3b8" text-anchor="middle">${SEC[i]}</text>`;
    });
    h += `<g><circle cx="60" cy="210" r="9" fill="#10b981"/><text x="60" y="196" font-size="10" fill="#6ee7b7" text-anchor="middle">${ownName()}</text></g><g><circle cx="842" cy="210" r="9" fill="#ef4444"/><text x="842" y="196" font-size="10" fill="#fca5a5" text-anchor="middle">${c.n}</text></g>`;
    g.innerHTML = h;
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.dataset.v = v; };
    set('th-ok', th.ok); set('th-ek', th.ek); set('th-civ', th.civ); set('th-wd', Math.round(th.ok * 2.4)); set('th-od', ownDiv); set('th-ed', enDiv);
    const sp = document.getElementById('th-spark'); if (sp) { const a = th.h, n = Math.max(1, a.length - 1); sp.setAttribute('points', a.map((v, i) => (i / n * 300).toFixed(1) + ',' + (40 - v * .38).toFixed(1)).join(' ')); }
    const bars = document.getElementById('th-bars'); if (bars) { const m = Math.max(500, ...th.dk, ...th.dok), a = th.dk.slice(-30), b = th.dok.slice(-30); bars.innerHTML = a.map((v, i) => `<rect x="${i * 10}" y="${40 - v / m * 38}" width="4" height="${v / m * 38}" fill="#f87171"/><rect x="${i * 10 + 4}" y="${40 - (b[i] || 0) / m * 38}" width="4" height="${(b[i] || 0) / m * 38}" fill="#34d399"/>`).join(''); }
    const ratio = document.getElementById('th-ratio'); if (ratio) ratio.textContent = th.ok ? (th.ek / th.ok).toFixed(2) + ' : 1' : '—';
    const feed = document.getElementById('th-feed'); if (feed) feed.innerHTML = th.feed.map(f => `<div><i class="fa-solid ${f.ok ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}" style="color:${f.ok ? '#34d399' : '#f87171'}"></i> <span style="color:#64748b">Día ${f.d}</span> · ${f.t}</div>`).join('') || '<div>Sin combates relevantes todavía.</div>';
    const sb = document.getElementById('th-sup'); if (sb) { sb.style.width = sup + '%'; sb.style.background = sup < 25 ? '#ef4444' : sup < 50 ? '#f59e0b' : '#38bdf8'; }
    const pb = document.getElementById('th-prog'); if (pb) { pb.style.width = ((w.prog + 100) / 2) + '%'; }
    const pl = document.getElementById('th-pl'); if (pl) pl.textContent = Math.round(w.prog) + '%';
  }

  function theater(w) {
    const th = init(w), c = enemy(w), pvp = isPvp(w), day = gameState.daysInOffice || 0;
    const stat = (id, lab, col) => `<div class="th-stat"><b id="${id}" data-v="0" style="color:${col}">0</b><span>${lab}</span></div>`;
    return `<div class="th" id="th-root">
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px"><b class="font-hoi-header text-lg text-red-400"><i class="fa-solid fa-map-location-dot mr-2"></i>TEATRO DE OPERACIONES · ${ownName()} vs ${c.n}</b>
        <span class="text-[10px] text-slate-400">${pvp ? '<span class="bg-red-600 text-black px-2 py-0.5 rounded font-bold animate-pulse mr-2">MULTIJUGADOR · EN VIVO</span>' : ''}Día ${day - w.start} de guerra <button onclick="THfx()" class="ml-2 px-2 py-0.5 rounded bg-slate-800 border border-slate-600 cursor-pointer">Efectos: ${fx() ? 'sí' : 'no'}</button></span></div>
      <svg viewBox="0 0 900 420" preserveAspectRatio="xMidYMid meet"><defs><pattern id="thg" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#16223a" stroke-width="1"/></pattern></defs>
        <rect width="900" height="420" fill="url(#thg)"/><g id="th-g"></g><g id="th-boom"></g></svg>
      <div style="margin-top:8px"><div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8"><span>Derrota</span><span>Frente <b id="th-pl" class="text-amber-300">0%</b></span><span>Victoria total</span></div><div class="h-2.5 bg-slate-800 rounded overflow-hidden"><div id="th-prog" style="height:100%;background:linear-gradient(90deg,#ef4444,#f59e0b,#10b981);width:50%"></div></div></div>
      <div class="th-g6">${stat('th-ok', 'Bajas propias (KIA)', '#34d399')}${stat('th-wd', 'Heridos propios', '#a7f3d0')}${stat('th-ek', 'Bajas enemigas', '#f87171')}${stat('th-civ', 'Civiles muertos', '#fbbf24')}${stat('th-od', 'Divisiones propias', '#e2e8f0')}${stat('th-ed', 'Divisiones enemigas', '#fca5a5')}</div>
      <div class="th-g3">
        <div class="th-stat" style="text-align:left"><span>Evolución del frente (90 días)</span><svg viewBox="0 0 300 80" style="background:none;height:70px"><line x1="0" y1="40" x2="300" y2="40" stroke="#334155" stroke-dasharray="3 3"/><polyline id="th-spark" fill="none" stroke="#fbbf24" stroke-width="2" points=""/></svg></div>
        <div class="th-stat" style="text-align:left"><span>Bajas diarias (rojo enemigo · verde propias) · ratio <b id="th-ratio" class="text-amber-300">—</b></span><svg viewBox="0 0 300 42" style="background:none;height:56px"><g id="th-bars"></g></svg>
          <span>Suministros</span><div class="h-2 bg-slate-800 rounded overflow-hidden"><div id="th-sup" style="height:100%;width:80%;background:#38bdf8"></div></div></div>
        <div class="th-stat th-feed" style="text-align:left"><span>Parte de batallas</span><div id="th-feed" style="max-height:100px;overflow:auto"></div></div></div></div>`;
  }

  /* contadores animados + explosiones (sin re-renderizar el juego) */
  const cur = {};
  setInterval(() => {
    const w = WAR(), root = document.getElementById('th-root'); pill(w);
    if (!w || !root) return;
    ['th-ok', 'th-wd', 'th-ek', 'th-civ', 'th-od', 'th-ed'].forEach(id => { const e = document.getElementById(id); if (!e) return; const t = +e.dataset.v || 0; cur[id] = (cur[id] || 0) + (t - (cur[id] || 0)) * 0.25; if (Math.abs(t - cur[id]) < 1) cur[id] = t; e.textContent = fmt(cur[id]); });
    if (!fx()) return;
    const th = init(w), b = document.getElementById('th-boom'); if (!b || Math.random() > 0.7) return;
    const i = Math.floor(Math.random() * SEC.length), p = frontPts(w, th)[i], x = p[0] + (Math.random() - .5) * 90, y = p[1] + (Math.random() - .5) * 40, e = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    e.setAttribute('cx', x); e.setAttribute('cy', y); e.setAttribute('r', 2); e.setAttribute('fill', '#fb923c');
    e.innerHTML = '<animate attributeName="r" from="2" to="18" dur="1s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" dur="1s" fill="freeze"/>';
    b.appendChild(e); setTimeout(() => e.remove(), 1100);
  }, 700);

  function pill(w) {
    let p = document.getElementById('th-pill');
    if (!w || gameState.activeTab === 'war') { if (p) p.remove(); return; }
    if (!p) { p = document.createElement('div'); p.id = 'th-pill'; p.className = 'th-pill'; p.onclick = () => switchTab('war'); document.body.appendChild(p); }
    const th = w.th;
    p.innerHTML = '<i class="fa-solid fa-crosshairs mr-1"></i> GUERRA · frente ' + Math.round(w.prog) + '% · bajas ' + fmt(th ? th.ok : (w.baj || 0) * 180);
  }
  window.THfx = () => { try { localStorage.setItem(FX_KEY, fx() ? '0' : '1'); } catch (e) { /* sin almacenamiento */ } render(); };

  const _rtc = renderTabContent;
  renderTabContent = function () {
    const out = _rtc.apply(this, arguments), w = WAR();
    if (gameState.activeTab === 'war' && w && (W().pane || 'op') === 'op') { setTimeout(upd, 30); return theater(w) + out; }
    setTimeout(upd, 30); return out;
  };
  const _t = gameTick;
  gameTick = function () { const b = gameState.daysInOffice; _t.apply(this, arguments); if (gameState.daysInOffice !== b && gameState.step === 4) { try { step(); } catch (e) { console.error('[frente]', e); } } };
})();
