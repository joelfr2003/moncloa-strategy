/* PANTALLA.JS — Interfaz de pantalla completa (F11) para MONCLOA STRATEGY.
   · Portada: todo a la vista sin hacer scroll (7 países en una fila).
   · Partida: menú de pestañas a la izquierda, barra de estado fija y el contenido ocupa el resto de la pantalla; solo se desplaza
     el panel de dentro. Militar y Guerra va a dos columnas (teatro de operaciones | pestañas de gestión). */
(function () {
  'use strict';
  const css = document.createElement('style');
  css.textContent = `
  /* ============ PORTADA ============ */
  @media (min-width: 821px) {
    .lb-wrap { box-sizing: border-box !important; padding: 10px 16px !important; gap: 8px !important; justify-content: center; }
    .lb-title { font-size: clamp(40px, 8.5vh, 88px) !important; }
    .lb-sub { font-size: 11px !important; letter-spacing: .34em !important; }
    .lb-card { width: min(1240px, 100%) !important; padding: 14px 22px !important; gap: 8px !important; }
    .lb-input { box-sizing: border-box !important; padding: 9px 14px !important; font-size: 15px !important; }
    .lb-countries { grid-template-columns: repeat(auto-fit, minmax(128px, 1fr)) !important; gap: 10px !important; }
    .lb-cc { padding: 8px 8px 10px !important; }
    .lb-cc .lb-cn { margin-top: 6px !important; font-size: 21px !important; }
    .lb-cc .lb-tag { font-size: 9px !important; padding: 2px 7px !important; }
    .lb-fimg { aspect-ratio: 3 / 2 !important; }
  }
  @media (min-width: 821px) and (max-height: 820px) {
    .lb-title { font-size: clamp(32px, 7vh, 56px) !important; }
    .lb-fimg { aspect-ratio: 2 / 1 !important; }
  }

  /* ============ PARTIDA: pantalla fija ============ */
  @media (min-width: 821px) {
    html, body.hud-on { height: 100%; overflow: hidden !important; }
    body.hud-on { display: block !important; min-height: 0 !important; }
    body.hud-on main#app { position: fixed !important; top: 56px !important; left: 260px !important; right: 0 !important; bottom: 0 !important;
      width: auto !important; max-width: none !important; margin: 0 !important; padding: 8px 14px !important; box-sizing: border-box !important; overflow: hidden !important; }
    body.hud-on footer { display: none !important; }
    body.hud-on #app > div.space-y-3 { height: 100%; display: flex; flex-direction: column; gap: 8px; overflow: hidden; }
    body.hud-on #app > div.space-y-3 > * { margin: 0 !important; flex: none; }
    body.hud-on .px-body { flex: 1 1 0 !important; min-height: 0; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; gap: 8px; padding-right: 4px; }
    body.hud-on .px-body > * { margin: 0 !important; flex: none; }
    /* Militar y Guerra: dos columnas, sin scroll de página */
    body.hud-on .px-body.px-2col { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 10px; overflow: hidden; padding: 0; }
    body.hud-on .px-col { min-height: 0; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; gap: 8px; padding-right: 4px; }
    body.hud-on .px-col > * { margin: 0 !important; flex: none; }
    body.px-war .px-ticker, body.px-war .sit-panel { display: none !important; }
    body.hud-on .th svg { max-height: 44vh; }
  }`;
  document.head.appendChild(css);

  function organize() {
    const app = document.getElementById('app'), w = app && app.firstElementChild;
    if (!w || w.dataset.px === '1' || !w.classList.contains('space-y-3')) return;
    w.dataset.px = '1';
    const kids = [...w.children]; let n = 0;
    while (n < kids.length && n < 3 && (kids[n].matches('.sit-panel') || String(kids[n].className).includes('bg-slate-900/90'))) n++;
    if (n === 2 || n === 3) kids[1].classList.add('px-ticker');
    const rest = kids.slice(n);
    const body = document.createElement('div'); body.className = 'px-body';
    const t = rest.findIndex(k => k.id === 'th-root');
    document.body.classList.toggle('px-war', t >= 0);
    if (t >= 0 && t < rest.length - 1) {
      body.classList.add('px-2col');
      const l = document.createElement('div'), r = document.createElement('div'); l.className = r.className = 'px-col';
      rest.slice(0, t + 1).forEach(k => l.appendChild(k)); rest.slice(t + 1).forEach(k => r.appendChild(k));
      body.append(l, r);
    } else rest.forEach(k => body.appendChild(k));
    w.appendChild(body);
  }
  function boot() {
    const app = document.getElementById('app'); if (!app) return;
    new MutationObserver(() => { try { organize(); } catch (e) { console.error('[pantalla]', e); } }).observe(app, { childList: true });
    organize();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
