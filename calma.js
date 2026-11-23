// MONCLOA STRATEGY · Modo calma: menos ruido, menos pestañas, menos ventanas y una estética más serena.
// Carga después del resto de módulos (ver <script src="calma.js"> al final de index.html).
(function () {
  'use strict';
  const KEY = 'moncloa_calma_v1';
  const S = { theme: 'serena', size: 'normal', welcomed: false };
  try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* sin guardado */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sin almacenamiento */ } };
  const GAP = { completo: 30, esencial: 60, tranquilo: 120 };   // días mínimos entre emergencias aleatorias
  const curMode = () => (document.body.className.match(/calma-m-(\w+)/) || [])[1] || 'esencial';

  // ---------------------------------------------------------------- estilos
  const css = document.createElement('style');
  css.textContent = `
  /* Estética serena: superficies planas, bordes suaves, sin brillos ni mayúsculas gritonas */
  body.calma{--hoi-bg:#12171c;--hoi-panel:#182027;--hoi-border:#27323a;--hoi-gold:#c8aa6e;background-color:#12171c;background-image:none;line-height:1.55}
  body.calma .hoi-box{background:#182027;border:1px solid #27323a;border-radius:14px;box-shadow:none}
  body.calma .hoi-box::before{display:none}
  body.calma .hoi-button{background:#222c34;border:1px solid #2f3b44;border-radius:10px;box-shadow:none;text-shadow:none;letter-spacing:.01em;text-transform:none}
  body.calma .hoi-button:hover:not(:disabled){background:#2b3741;border-color:#3b4a55}
  body.calma .hoi-button-gold{background:#b99a55;color:#15191d;border:1px solid #b99a55;border-radius:10px;box-shadow:none;text-shadow:none;text-transform:none}
  body.calma .hoi-button-gold:hover:not(:disabled){background:#c8aa6e}
  body.calma .font-hoi-tech{font-family:'Inter',sans-serif}
  body.calma .font-hoi-header{letter-spacing:.4px}
  body.calma .uppercase,body.calma .tracking-widest,body.calma .tracking-wider{text-transform:none;letter-spacing:.01em}
  body.calma .animate-pulse,body.calma .animate-bounce,body.calma .animate-ping{animation:none}
  body.calma .nav-tab-btn{background:transparent;border:1px solid transparent;border-radius:10px;box-shadow:none;text-transform:none;letter-spacing:0;font-size:14px;font-weight:500;color:#cbd5e1}
  body.calma .nav-tab-btn:hover{background:rgba(255,255,255,.05)}
  body.calma .nav-tab-btn.active{background:rgba(200,170,110,.14);border-color:rgba(200,170,110,.25);color:#efe2bd}
  body.calma .nav-tab-btn.active::before{display:none}
  body.calma .nav-group-title{letter-spacing:.04em;font-weight:500;color:#8b98a3}
  body.calma ::-webkit-scrollbar-thumb{background:#2b3841;border-color:transparent;border-radius:6px}
  body.calma #ux-pill{background:#182027;border-color:#2f3b44;color:#cbd5e1}
  body.calma #ux-pop{background:#12171c;border-color:#2f3b44;border-radius:14px}
  body.calma #ux-toasts .ux-t{border-width:1px;border-radius:12px;background:#182027;box-shadow:0 4px 18px rgba(0,0,0,.35)}
  body.calma #teletipo-efe-marquee{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
  @media (prefers-reduced-motion:reduce){body *{animation:none !important;transition:none !important}}
  /* Menos pestañas según el modo */
  body.calma-m-esencial #tab-btn-demo{display:none !important}
  body.calma-m-tranquilo #tab-btn-demo,body.calma-m-tranquilo #tab-btn-boe,body.calma-m-tranquilo #tab-btn-proj,body.calma-m-tranquilo #tab-btn-intl,body.calma-m-tranquilo #tab-btn-war{display:none !important}
  /* Bienvenida */
  #calma-wel{position:fixed;inset:0;z-index:100000;background:rgba(8,11,14,.86);display:flex;align-items:center;justify-content:center;padding:16px;font-family:Inter,sans-serif}
  #calma-wel .cw-box{background:#182027;border:1px solid #2f3b44;border-radius:18px;max-width:640px;width:100%;padding:24px;color:#e2e8f0;max-height:92vh;overflow:auto}
  #calma-wel h2{font-size:22px;font-weight:600;color:#efe2bd;margin:0 0 4px}
  #calma-wel p{color:#94a3b8;font-size:13px;margin:0 0 16px}
  #calma-wel .cw-opt{display:block;width:100%;text-align:left;background:#12171c;border:1px solid #2f3b44;border-radius:12px;padding:12px 14px;margin-bottom:10px;cursor:pointer;color:#e2e8f0}
  #calma-wel .cw-opt:hover{border-color:#c8aa6e;background:#1a222a}
  #calma-wel .cw-opt b{display:block;font-size:15px;color:#f1f5f9;margin-bottom:2px}
  #calma-wel .cw-opt span{font-size:12px;color:#94a3b8}
  #calma-wel .cw-skip{color:#64748b;font-size:12px;background:none;border:0;cursor:pointer;margin-top:4px}
  #calma-box{margin-top:12px;border-top:1px solid #27323a;padding-top:8px}
  #calma-box .cb-row{display:flex;gap:6px;margin-top:4px}
  #calma-box button{flex:1;padding:6px 4px;border-radius:8px;border:1px solid #27323a;background:#12171c;color:#cbd5e1;cursor:pointer;font-size:12px}
  #calma-box button.on{border-color:#c8aa6e;background:rgba(200,170,110,.16);color:#efe2bd}`;
  document.head.appendChild(css);

  // ---------------------------------------------------------------- aplicar ajustes
  function groups() {
    document.querySelectorAll('.nav-group').forEach(g => {
      const bs = Array.prototype.slice.call(g.querySelectorAll('.nav-tab-btn'));
      g.style.display = bs.length && bs.every(b => getComputedStyle(b).display === 'none') ? 'none' : '';
    });
  }
  function apply() {
    document.body.classList.toggle('calma', S.theme === 'serena');
    document.documentElement.style.fontSize = S.size === 'grande' ? '17px' : '';
    const m = (window.UX_MODE_NAME || null) || curMode();
    window.UX_GAP = GAP[m] || 30;
    setTimeout(groups, 50);
  }
  function setMode(m) {
    document.body.className = document.body.className.replace(/calma-m-\w+/g, '').trim() + ' calma-m-' + m;
    window.UX_MODE_NAME = m;
    if (typeof window.uxMode === 'function') window.uxMode(m);   // reutiliza el motor de modos existente (avisos y pestañas)
    window.UX_GAP = GAP[m] || 30;
    const hidden = ['demo'].concat(m === 'tranquilo' ? ['boe', 'proj', 'intl', 'war', 'media', 'bde', 'focus', 'soc', 'ue', 'stats', 'cis', 'ach'] : m === 'esencial' ? ['media', 'bde', 'focus', 'soc', 'ue', 'stats', 'cis', 'ach'] : []);
    if (m !== 'completo' && typeof gameState !== 'undefined' && hidden.indexOf(gameState.activeTab) >= 0) { try { switchTab('main'); } catch (e) { /* aún sin partida */ } }
    setTimeout(groups, 80);
  }
  window.calmaSet = (k, v) => { S[k] = v; save(); apply(); const b = document.getElementById('calma-box'); if (b) b.remove(); };
  window.calmaMode = m => { S.mode = m; save(); setMode(m); };

  // ---------------------------------------------------------------- bienvenida (solo la primera vez)
  function welcome() {
    const w = document.createElement('div'); w.id = 'calma-wel';
    w.innerHTML = '<div class="cw-box"><h2>¿Cómo quieres jugar?</h2><p>Puedes cambiarlo en cualquier momento desde «Ayuda y modo», abajo a la derecha.</p>'
      + '<button class="cw-opt" data-k="tranquilo"><b>Tranquilo · recomendado para empezar</b><span>Pocas pestañas, pocas crisis, avisos solo si son urgentes y una imagen más suave. Tú decides sin prisa.</span></button>'
      + '<button class="cw-opt" data-k="esencial"><b>Equilibrado</b><span>Lo importante a mano, crisis más espaciadas y avisos ordenados.</span></button>'
      + '<button class="cw-opt" data-k="completo"><b>Experto · todo el juego</b><span>Todas las pestañas, el ritmo original y la estética clásica.</span></button>'
      + '<button class="cw-skip" data-k="esencial">Decidir más tarde</button></div>';
    w.addEventListener('click', e => {
      const k = e.target.closest('[data-k]'); if (!k) return;
      const m = k.getAttribute('data-k'); S.welcomed = true; S.mode = m; S.theme = m === 'completo' ? 'clasica' : 'serena'; save(); apply(); setMode(m); w.remove();
    });
    document.body.appendChild(w);
  }

  // ---------------------------------------------------------------- controles extra en el panel «Ayuda y modo»
  function hookPanel() {
    const pop = document.getElementById('ux-pop'); if (!pop) return;
    const mo = new MutationObserver(() => {
      if (pop.querySelector('#calma-box')) return;
      mo.disconnect();
      const d = document.createElement('div'); d.id = 'calma-box';
      d.innerHTML = '<h4>ASPECTO</h4><div class="cb-row">'
        + '<button class="' + (S.theme === 'serena' ? 'on' : '') + '" onclick="calmaSet(\'theme\',\'serena\')">Serena</button>'
        + '<button class="' + (S.theme === 'clasica' ? 'on' : '') + '" onclick="calmaSet(\'theme\',\'clasica\')">Clásica</button></div>'
        + '<h4>TAMAÑO DEL TEXTO</h4><div class="cb-row">'
        + '<button class="' + (S.size === 'normal' ? 'on' : '') + '" onclick="calmaSet(\'size\',\'normal\')">Normal</button>'
        + '<button class="' + (S.size === 'grande' ? 'on' : '') + '" onclick="calmaSet(\'size\',\'grande\')">Grande</button></div>';
      pop.appendChild(d);
      mo.observe(pop, { childList: true });
    });
    mo.observe(pop, { childList: true });
  }

  // Los botones de modo del panel existente también deben cambiar las pestañas y el ritmo
  const _um = window.uxMode;
  if (typeof _um === 'function') window.uxMode = function (m) { S.mode = m; save(); _um.call(this, m); document.body.className = document.body.className.replace(/calma-m-\w+/g, '').trim() + ' calma-m-' + m; window.UX_MODE_NAME = m; window.UX_GAP = GAP[m] || 30; setTimeout(groups, 80); };

  // Teletipo quieto: sin texto en movimiento constante
  setInterval(() => { if (S.theme !== 'serena') return; const m = document.getElementById('teletipo-efe-marquee'); if (m && typeof m.stop === 'function') { try { m.stop(); } catch (e) { /* sin marquee */ } } }, 2000);

  apply();
  hookPanel();
  setMode(S.mode || 'esencial');
  if (!S.welcomed) welcome();
})();
