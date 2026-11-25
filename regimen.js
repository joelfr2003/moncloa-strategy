/* REGIMEN.JS — Regímenes políticos distintos: en los países donde el Gobierno no puede caer por moción de censura
   ni por elecciones anticipadas (EE. UU., Rusia, Corea del Norte), esas crisis se sofocan en vez de echar al presidente.
   Las elecciones de fin de legislatura sí se celebran, con resultados acordes al régimen (topes de escaños en COUNTRY_ECON.regime.bounds). */
(function () {
  'use strict';
  const R = () => (window.MC && MC.regime) || null;
  let blocked = false, lastMsg = -999;
  const _tw = window.triggerElectionsWithModal;
  if (typeof _tw === 'function') triggerElectionsWithModal = function (title) {
    const r = R();
    if (r && r.noEarly && !window.__earlyElec && !/FIN DE LA LEGISLATURA/i.test(String(title || ''))) { blocked = true; return; }
    return _tw.apply(this, arguments);
  };
  const _ct = window.checkTermEnd;
  if (typeof _ct === 'function') checkTermEnd = function () {
    const r = R(); blocked = false;
    const res = _ct.apply(this, arguments);
    if (r && r.noEarly && blocked) {
      blocked = false; const m = gameState.metrics || {};
      ['est', 'apr'].forEach(k => { if (m[k] != null && m[k] < 12) m[k] = 12; });
      const d = gameState.daysInOffice || 0;
      if (d - lastMsg > 60) { lastMsg = d; try { goalsToast('<b>CRISIS POLÍTICA CONTROLADA</b><br><span class="text-xs">' + (r.msg || 'El Gobierno resiste la presión.') + '</span>', '#d9a726'); } catch (e) { /* sin aviso */ } }
      return false;
    }
    return res;
  };
  // Intervención/expedientes de la UE: no existen en países que no son miembros
  const _eu = window.showEuInterventionModal;
  if (typeof _eu === 'function') showEuInterventionModal = function () { if (window.MC && !MC.eu && !MC.builtin) return; return _eu.apply(this, arguments); };
})();
