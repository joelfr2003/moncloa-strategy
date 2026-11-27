/* INTERFAZ.JS — Pantalla de correlación de fuerzas rediseñada (nombre de la cámara de cada país, hemiciclo escalable, claro),
   menú lateral oculto fuera de la partida y tema claro opcional para todo el juego. */
(function () {
  'use strict';
  const cid = () => (window.CURRENT_COUNTRY && CURRENT_COUNTRY.id) || 'espana';
  const CH = {
    espana: ['CONGRESO DE LOS DIPUTADOS', 'Congreso'], francia: ['ASAMBLEA NACIONAL', 'Asamblea'], alemania: ['BUNDESTAG', 'Bundestag'],
    rusia: ['DUMA ESTATAL', 'Duma'], eeuu: ['CÁMARA DE REPRESENTANTES', 'Cámara'], marruecos: ['CÁMARA DE REPRESENTANTES', 'Cámara'],
    coreanorte: ['ASAMBLEA POPULAR SUPREMA', 'Asamblea']
  };
  const chName = () => (CH[cid()] || CH.espana);

  // ---------- Hemiciclo escalable (cualquier número de escaños) ----------
  function hemi(parties) {
    const T = SEATS_TOTAL, rows = T > 500 ? 9 : T > 380 ? 8 : 7, cx = 300, cy = 290, r0 = 95, r1 = 270, pts = [];
    const rad = [], sumR = (() => { let s = 0; for (let i = 0; i < rows; i++) { const r = r0 + (r1 - r0) * i / (rows - 1); rad.push(r); s += r; } return s; })();
    let left = T;
    rad.forEach((r, i) => { const n = i === rows - 1 ? left : Math.round(T * r / sumR); left -= n; for (let k = 0; k < n; k++) pts.push([Math.PI - Math.PI * (n === 1 ? 0.5 : k / (n - 1)), r]); });
    pts.sort((a, b) => b[0] - a[0] || a[1] - b[1]);
    const cols = []; [...parties].sort((a, b) => a.spectrumOrder - b.spectrumOrder).forEach(p => { for (let i = 0; i < p.seats; i++) cols.push(p.color); });
    const dot = Math.max(3.2, Math.min(6.2, 5.5 * Math.sqrt(350 / T) * 1.0));
    return pts.map((p, i) => '<circle cx="' + (cx + p[1] * Math.cos(p[0])).toFixed(1) + '" cy="' + (cy - p[1] * Math.sin(p[0])).toFixed(1) + '" r="' + dot.toFixed(1) + '" fill="' + (cols[i] || '#cbd5e1') + '"/>').join('');
  }
  window.generateHemicycleSVG = hemi;

  const total = () => gameState.parties.reduce((a, p) => a + p.seats, 0);
  function sync() {
    const t = total(), ok = t === SEATS_TOTAL;
    gameState.parties.forEach((p, i) => {
      const n = document.getElementById('sx-n-' + i); if (n) n.textContent = p.seats;
      const s = document.getElementById('sx-r-' + i); if (s && Number(s.value) !== p.seats) s.value = p.seats;
      const b = document.getElementById('sx-b-' + i); if (b) b.style.width = Math.min(100, p.seats / SEATS_TOTAL * 100 * 1.6) + '%';
    });
    const T = document.getElementById('sx-total'); if (T) { T.textContent = t; T.style.color = ok ? '#047857' : '#b91c1c'; }
    const d = document.getElementById('sx-diff'); if (d) d.textContent = ok ? 'Reparto completo' : (t > SEATS_TOTAL ? 'Sobran ' + (t - SEATS_TOTAL) : 'Faltan ' + (SEATS_TOTAL - t)) + ' escaños';
    const sv = document.getElementById('hemicycle-svg'); if (sv) sv.innerHTML = hemi(gameState.parties) + center();
    const btn = document.getElementById('btn-to-pactometer'); if (btn) { btn.disabled = !ok; btn.style.opacity = ok ? 1 : .45; btn.style.cursor = ok ? 'pointer' : 'not-allowed'; }
  }
  const center = () => '<text x="300" y="262" text-anchor="middle" font-size="46" font-weight="800" fill="#0f172a" font-family="system-ui,sans-serif">' + total() + '</text><text x="300" y="286" text-anchor="middle" font-size="13" fill="#64748b" font-family="system-ui,sans-serif">de ' + SEATS_TOTAL + ' · mayoría ' + SEATS_MAJ + '</text>';
  window.updateSeats = function (idx, val) { gameState.parties[idx].seats = Math.max(0, Math.min(gameState.parties[idx].maxSeats || SEATS_TOTAL, parseInt(val) || 0)); sync(); };
  window.sxStep = function (idx, d) { window.updateSeats(idx, gameState.parties[idx].seats + d); };
  window.sxAuto = function () {
    const P = gameState.parties, t = total(); let diff = SEATS_TOTAL - t, i = 0;
    const order = P.map((p, k) => k).sort((a, b) => P[b].seats - P[a].seats);
    while (diff !== 0 && i < 4000) { const k = order[i % order.length]; if (diff > 0 && P[k].seats < (P[k].maxSeats || SEATS_TOTAL)) { P[k].seats++; diff--; } else if (diff < 0 && P[k].seats > 0) { P[k].seats--; diff++; } i++; }
    sync();
  };

  window.renderSeatAdjuster = function (app) {
    gameState.parties.sort((a, b) => a.spectrumOrder - b.spectrumOrder);
    const nm = chName()[0], t = total(), ok = t === SEATS_TOTAL;
    const year = gameState.scenario && gameState.scenario.startYear ? gameState.scenario.startYear : '';
    app.innerHTML = '<div class="sx">'
      + '<div class="sx-head"><div><div class="sx-kick">PASO 2 DE 3 · ' + (window.MC && MC.t ? MC.t.nation.toUpperCase() : '') + (year ? ' · ' + year : '') + '</div><h2>Correlación de fuerzas en el ' + nm.charAt(0) + nm.slice(1).toLowerCase() + '</h2>'
      + '<p>Reparte los escaños entre los partidos. El hemiciclo está ordenado de izquierda a derecha. Necesitas sumar exactamente <b>' + SEATS_TOTAL + '</b> para continuar.</p></div>'
      + '<div class="sx-tot"><span id="sx-total" style="color:' + (ok ? '#047857' : '#b91c1c') + '">' + t + '</span><small>/ ' + SEATS_TOTAL + '</small><em id="sx-diff">' + (ok ? 'Reparto completo' : '') + '</em><button onclick="sxAuto()">Ajustar automáticamente</button></div></div>'
      + '<div class="sx-body"><div class="sx-hemi"><svg id="hemicycle-svg" viewBox="0 0 600 310">' + hemi(gameState.parties) + center() + '</svg>'
      + '<div class="sx-leg">' + gameState.parties.map(p => '<span><i style="background:' + p.color + '"></i>' + p.name + '</span>').join('') + '</div></div>'
      + '<div class="sx-list">' + gameState.parties.map((p, i) => '<div class="sx-card"><div class="sx-top"><i style="background:' + p.color + '"></i><div><b>' + p.name + '</b><small>' + (p.ideology || '') + '</small></div><strong id="sx-n-' + i + '">' + p.seats + '</strong></div>'
        + '<div class="sx-bar"><div id="sx-b-' + i + '" style="width:' + Math.min(100, p.seats / SEATS_TOTAL * 160) + '%;background:' + p.color + '"></div></div>'
        + '<div class="sx-ctl"><button onclick="sxStep(' + i + ',-5)">−5</button><button onclick="sxStep(' + i + ',-1)">−1</button><input id="sx-r-' + i + '" type="range" min="0" max="' + (p.maxSeats || SEATS_TOTAL) + '" value="' + p.seats + '" oninput="updateSeats(' + i + ',this.value)"><button onclick="sxStep(' + i + ',1)">+1</button><button onclick="sxStep(' + i + ',5)">+5</button></div></div>').join('') + '</div></div>'
      + '<div class="sx-foot"><button class="sx-back" onclick="gameState.step=1;render();">← Volver</button><button id="btn-to-pactometer" class="sx-go" onclick="goToPactometer()" ' + (ok ? '' : 'disabled') + ' style="opacity:' + (ok ? 1 : .45) + '">Avanzar al pactómetro →</button></div></div>';
  };

  // ---------- Estilos ----------
  const css = document.createElement('style');
  css.textContent = `
  body:not(.hud-on):not(.title-screen) header { display: none !important; }
  body:not(.hud-on):not(.title-screen) main#app { margin-left: 0 !important; width: 100% !important; max-width: 1180px !important; margin-right: auto !important; margin-left: auto !important; }
  body.px-setup { background: #f3efe6 !important; background-image: none !important; color: #0f172a; }
  .sx { color: #0f172a; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; }
  .sx-head { display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; align-items: flex-end; margin-bottom: 14px; }
  .sx-kick { font-size: 11px; letter-spacing: .14em; color: #a16207; font-weight: 700; }
  .sx h2 { font-size: 28px; font-weight: 800; margin: 2px 0 4px; color: #0f172a; font-family: inherit; text-transform: none; letter-spacing: -.01em; }
  .sx p { font-size: 13px; color: #475569; max-width: 640px; margin: 0; }
  .sx-tot { background: #fff; border: 1px solid #e2d9c5; border-radius: 14px; padding: 10px 16px; text-align: center; box-shadow: 0 2px 10px rgba(120,90,20,.08); }
  .sx-tot span { font-size: 34px; font-weight: 800; } .sx-tot small { font-size: 15px; color: #64748b; margin-left: 4px; }
  .sx-tot em { display: block; font-size: 11px; color: #64748b; font-style: normal; margin: 2px 0 6px; }
  .sx-tot button { font-size: 11px; background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; border-radius: 8px; padding: 3px 9px; cursor: pointer; }
  .sx-body { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 16px; align-items: start; }
  @media (max-width: 900px) { .sx-body { grid-template-columns: 1fr; } }
  .sx-body > *, .sx-card, .sx-list { min-width: 0; }
  body.px-setup footer { background: transparent !important; color: #64748b !important; border: none !important; }
  body.px-setup footer * { color: #64748b !important; }
  .sx-hemi { background: #fff; border: 1px solid #e2d9c5; border-radius: 18px; padding: 14px; box-shadow: 0 6px 24px rgba(120,90,20,.08); }
  .sx-hemi svg { width: 100%; height: auto; display: block; }
  .sx-leg { display: flex; flex-wrap: wrap; gap: 6px 12px; justify-content: center; margin-top: 8px; font-size: 11px; color: #334155; }
  .sx-leg i, .sx-top i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; }
  .sx-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-height: calc(100vh - 250px); overflow-y: auto; padding: 2px 4px 4px 2px; }
  @media (max-width: 1100px) { .sx-list { grid-template-columns: 1fr; } }
  .sx-card { background: #fff; border: 1px solid #e2d9c5; border-radius: 14px; padding: 10px 12px; box-shadow: 0 2px 8px rgba(120,90,20,.06); }
  .sx-top { display: flex; align-items: center; gap: 8px; } .sx-top i { width: 14px; height: 14px; margin: 0; flex: none; }
  .sx-top div { flex: 1; min-width: 0; } .sx-top b { display: block; font-size: 13px; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sx-top small { font-size: 10px; color: #64748b; } .sx-top strong { font-size: 24px; font-weight: 800; color: #0f172a; }
  .sx-bar { height: 5px; background: #eee7d6; border-radius: 4px; margin: 6px 0 8px; overflow: hidden; } .sx-bar div { height: 100%; border-radius: 4px; transition: width .2s; }
  .sx-ctl { display: flex; align-items: center; gap: 4px; }
  .sx-ctl button { min-width: 30px; height: 26px; border: 1px solid #d6cbb0; background: #faf6ec; color: #334155; border-radius: 7px; font-size: 11px; font-weight: 700; cursor: pointer; }
  .sx-ctl button:hover { background: #f1e7c8; } .sx-ctl input { flex: 1; min-width: 0; accent-color: #d97706; }
  .sx-foot { display: flex; justify-content: space-between; margin-top: 16px; }
  .sx-back { background: #fff; border: 1px solid #d6cbb0; color: #334155; border-radius: 10px; padding: 9px 16px; font-size: 13px; cursor: pointer; }
  .sx-go { background: #b45309; color: #fff; border: none; border-radius: 10px; padding: 10px 22px; font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(180,83,9,.3); }
  /* ===== Tema claro del juego ===== */
  body.theme-light { --hoi-bg: #f3efe6; --hoi-panel: #ffffff; --hoi-border: #d9cfb8; --hoi-gold: #b45309; --hoi-gold-soft: rgba(180,83,9,.1); background: #f3efe6 !important; background-image: none !important; color: #1e293b; }
  body.theme-light header { background: #fbf8f0 !important; box-shadow: 4px 0 16px rgba(120,90,20,.12) !important; border-right: 1px solid #e2d9c5 !important; }
  body.theme-light #top-hud { background: #fbf8f0 !important; border-bottom: 1px solid #e2d9c5 !important; color: #1e293b !important; }
  body.theme-light .hoi-box { background: #ffffff !important; border-color: #e2d9c5 !important; box-shadow: 0 2px 10px rgba(120,90,20,.08) !important; color: #1e293b; }
  body.theme-light #top-hud .hud-lname b { color: #0f172a !important; }
  body.theme-light #top-hud .hud-lname small, body.theme-light #top-hud .hud-label, body.theme-light #top-hud .hud-metric .row { color: #475569 !important; }
  body.theme-light #top-hud .hud-value { color: #0f172a !important; }
  body.theme-light #top-hud .hud-bar { background: #e2e8f0 !important; border-color: #cbd5e1 !important; }
  body.theme-light #top-hud .hud-sep { background: #d6cbb0 !important; }
  body.theme-light #top-hud .hud-face { background: #e9e2d0 !important; } body.theme-light #top-hud .hud-face span { color: #334155 !important; }
  body.theme-light .hoi-button:disabled, body.theme-light .hoi-button[disabled] { color: #64748b !important; opacity: 1 !important; background: #f1ede2 !important; }
  body.theme-light .hoi-box [class*="text-gray-"], body.theme-light .hoi-box [class*="text-slate-"], body.theme-light .hoi-box [class*="text-zinc-"] { color: #475569 !important; }
  body.theme-light .hoi-box .text-white, body.theme-light .hoi-box [class*="text-gray-100"], body.theme-light .hoi-box [class*="text-gray-200"], body.theme-light .hoi-box [class*="text-gray-300"] { color: #0f172a !important; }
  body.theme-light #app :is(h1,h2,h3,h4) { color: #0f172a; }
  body.theme-light #app .text-amber-100, body.theme-light #app .text-yellow-100, body.theme-light #app .text-yellow-200, body.theme-light #app .text-amber-200 { color: #92400e !important; }
  body.theme-light .hoi-button { background: #faf6ec !important; border-color: #d6cbb0 !important; color: #334155 !important; }
  body.theme-light .hoi-button:hover { background: #f1e7c8 !important; }
  body.theme-light .hoi-button-gold { background: #b45309 !important; color: #fff !important; }
  body.theme-light [class*="bg-slate-9"], body.theme-light [class*="bg-slate-8"], body.theme-light [class*="bg-black"], body.theme-light [class*="bg-gray-9"], body.theme-light [class*="bg-gray-8"] { background-color: #ffffff !important; }
  body.theme-light [class*="bg-slate-7"] { background-color: #ece6d6 !important; }
  body.theme-light [class*="text-slate-1"], body.theme-light [class*="text-slate-2"], body.theme-light [class*="text-slate-3"], body.theme-light [class*="text-gray-1"], body.theme-light [class*="text-gray-2"], body.theme-light [class*="text-gray-3"] { color: #1e293b !important; }
  body.theme-light [class*="text-slate-4"], body.theme-light [class*="text-slate-5"], body.theme-light [class*="text-gray-4"], body.theme-light [class*="text-gray-5"] { color: #475569 !important; }
  body.theme-light [class*="text-amber-"] { color: #b45309 !important; } body.theme-light [class*="text-yellow-"] { color: #a16207 !important; }
  body.theme-light [class*="text-emerald-"], body.theme-light [class*="text-green-"] { color: #047857 !important; }
  body.theme-light [class*="text-red-"], body.theme-light [class*="text-rose-"] { color: #b91c1c !important; }
  body.theme-light [class*="text-sky-"], body.theme-light [class*="text-blue-"], body.theme-light [class*="text-cyan-"] { color: #0369a1 !important; }
  body.theme-light [class*="border-slate-"], body.theme-light [class*="border-gray-"] { border-color: #e2d9c5 !important; }
  body.theme-light .font-hoi-header { color: #92400e; }
  body.theme-light input, body.theme-light select, body.theme-light textarea { background: #fff !important; color: #0f172a !important; border-color: #d6cbb0 !important; }
  body.theme-light .nav-tab-btn, body.theme-light header button { color: #334155 !important; }
  body.theme-light #ux-pop, body.theme-light .ux-pop { background: #fffdf7 !important; color: #1e293b !important; }
  /* ===== Tema crepúsculo: tono medio azul pizarra, ni blanco ni negro ===== */
  body.theme-dusk { --hoi-bg: #2a3a4d; --hoi-panel: #34475c; --hoi-border: #4a6078; background: #2a3a4d !important; background-image: none !important; color: #e8eef5; }
  body.theme-dusk header { background: #223142 !important; border-right: 1px solid #3f566e !important; box-shadow: 4px 0 16px rgba(0,0,0,.25) !important; }
  body.theme-dusk #top-hud { background: #223142 !important; border-bottom: 1px solid #3f566e !important; }
  body.theme-dusk #top-hud .hud-lname b, body.theme-dusk #top-hud .hud-value { color: #f8fafc !important; }
  body.theme-dusk #top-hud .hud-lname small, body.theme-dusk #top-hud .hud-label, body.theme-dusk #top-hud .hud-metric .row { color: #b6c4d4 !important; }
  body.theme-dusk #top-hud .hud-bar { background: #1a2634 !important; border-color: #3f566e !important; }
  body.theme-dusk #top-hud .hud-sep { background: #3f566e !important; }
  body.theme-dusk .hoi-box { background: #34475c !important; border-color: #4a6078 !important; box-shadow: 0 4px 16px rgba(0,0,0,.22) !important; color: #e8eef5; }
  body.theme-dusk .hoi-button { background: #3e5369 !important; border-color: #587089 !important; color: #eef3f8 !important; }
  body.theme-dusk .hoi-button:hover { background: #4b627a !important; }
  body.theme-dusk .hoi-button:disabled, body.theme-dusk .hoi-button[disabled] { color: #9fb0c2 !important; opacity: .85 !important; }
  body.theme-dusk [class*="bg-slate-9"], body.theme-dusk [class*="bg-black"], body.theme-dusk [class*="bg-gray-9"] { background-color: #2c3e52 !important; }
  body.theme-dusk [class*="bg-slate-8"], body.theme-dusk [class*="bg-gray-8"] { background-color: #3a4f66 !important; }
  body.theme-dusk [class*="bg-slate-7"] { background-color: #46607a !important; }
  body.theme-dusk [class*="text-slate-5"], body.theme-dusk [class*="text-slate-6"], body.theme-dusk [class*="text-gray-5"], body.theme-dusk [class*="text-gray-6"] { color: #b6c4d4 !important; }
  body.theme-dusk [class*="text-slate-4"], body.theme-dusk [class*="text-gray-4"] { color: #cbd6e2 !important; }
  body.theme-dusk [class*="border-slate-"], body.theme-dusk [class*="border-gray-"] { border-color: #4a6078 !important; }
  body.theme-dusk input, body.theme-dusk select, body.theme-dusk textarea { background: #263648 !important; color: #f1f5f9 !important; border-color: #587089 !important; }
  body.theme-dusk #ux-pop, body.theme-dusk .ux-pop { background: #2c3e52 !important; color: #e8eef5 !important; }
  `;
  document.head.appendChild(css);

  // ---------- Clases de cuerpo según la fase ----------
  function body() {
    const setup = gameState && gameState.step >= 1 && gameState.step <= 3 && !document.body.classList.contains('title-screen');
    document.body.classList.toggle('px-setup', !!setup);
    let th; try { th = localStorage.getItem('moncloa_theme'); } catch (e) { th = null; }
    th = th || 'dusk'; document.body.classList.toggle('theme-light', th === 'light' && !setup); document.body.classList.toggle('theme-dusk', th === 'dusk' && !setup);
  }
  window.themeToggle = function () {
    let th; try { th = localStorage.getItem('moncloa_theme') || 'dusk'; } catch (e) { th = 'dusk'; }
    const n = th === 'dusk' ? 'light' : th === 'light' ? 'dark' : 'dusk'; try { localStorage.setItem('moncloa_theme', n); } catch (e) { /* sin almacenamiento */ }
    body(); try { uxClose(); } catch (e) { /* sin panel */ }
  };
  const app = document.getElementById('app');
  if (app) new MutationObserver(body).observe(app, { childList: true });
  body();

  // Botón de tema en «Ayuda y modo»
  function hook() {
    const pop = document.getElementById('ux-pop'); if (!pop) return setTimeout(hook, 800);
    const mo = new MutationObserver(() => {
      if (pop.querySelector('#theme-box')) return; mo.disconnect();
      const d = document.createElement('div'); d.id = 'theme-box';
      d.innerHTML = '<h4>ASPECTO</h4><button class="ux-mode" style="width:100%" onclick="themeToggle()"><i class="fa-solid fa-circle-half-stroke"></i> Cambiar tema (crepúsculo · claro · oscuro)</button>';
      pop.appendChild(d); mo.observe(pop, { childList: true });
    });
    mo.observe(pop, { childList: true });
  }
  hook();
})();
