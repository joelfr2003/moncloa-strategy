/* ECONOMIA.JS — Base realista 2000-2026 (crecimiento y población reales por año) sobre la que influyen tus decisiones,
   palancas de política económica estilo Hearts of Iron (empleo público, salarios, mínimo, vivienda, pensiones, impuestos)
   y las grandes decisiones económicas de cada país (liberalizaciones, rescates, reformas). */
(function () {
  'use strict';
  const cid = () => (window.CURRENT_COUNTRY && CURRENT_COUNTRY.id) || 'espana';
  const day = () => gameState.daysInOffice || 0;
  const M = () => gameState.metrics;
  const budget = () => { try { return (window.MC && MC.budget) || 100000; } catch (e) { return 100000; } };
  const toast = (h, c) => { try { goalsToast(h, c || '#d9a726'); } catch (e) { /* sin aviso */ } };
  const acc = (k, v) => { try { focusAccum(focusInit(), k, v); } catch (e) { try { focusMetricAdd(k, v); } catch (e2) { /* sin métricas */ } } };
  const cpGet = () => { try { goalsInit(); return gameState.goals.capital || 0; } catch (e) { return 0; } };
  const cpAdd = v => { try { goalsInit(); gameState.goals.capital = Math.max(0, Math.min(100, (gameState.goals.capital || 0) + v)); } catch (e) { /* sin capital */ } };
  const live = () => gameState.step === 4 && M() && gameState.scenario && gameState.currentDate;
  const year = () => gameState.currentDate.getFullYear();

  // ---------- Crecimiento real del PIB por año (2000 → 2026), % ----------
  const G = {
    espana: [5.0, 4.0, 2.9, 3.2, 3.2, 3.7, 4.2, 3.8, 1.1, -3.8, 0.2, -0.8, -3.0, -1.4, 1.4, 3.8, 3.0, 3.0, 2.3, 2.0, -11.2, 6.4, 5.8, 2.5, 3.2, 2.8, 2.0],
    francia: [3.9, 2.0, 1.1, 0.8, 2.8, 1.6, 2.4, 2.4, 0.2, -2.9, 2.0, 2.1, 0.2, 0.6, 1.0, 1.1, 1.1, 2.3, 1.9, 1.8, -7.5, 6.4, 2.5, 1.4, 1.1, 0.8, 1.0],
    alemania: [3.0, 1.7, 0.0, -0.7, 1.2, 0.7, 3.8, 3.0, 1.0, -5.7, 4.2, 3.9, 0.4, 0.4, 2.2, 1.5, 2.2, 2.7, 1.0, 1.1, -3.7, 3.2, 1.8, -0.3, -0.2, 0.2, 1.0],
    rusia: [10.0, 5.1, 4.7, 7.3, 7.2, 6.4, 8.2, 8.5, 5.2, -7.8, 4.5, 5.1, 4.0, 1.8, 0.7, -2.0, 0.2, 1.8, 2.8, 2.2, -2.7, 5.9, -1.2, 3.6, 4.3, 1.0, 1.0],
    eeuu: [4.1, 1.0, 1.7, 2.8, 3.9, 3.5, 2.8, 2.0, 0.1, -2.6, 2.7, 1.6, 2.3, 2.1, 2.5, 2.9, 1.8, 2.5, 3.0, 2.5, -2.2, 6.1, 2.5, 2.9, 2.8, 2.0, 2.0],
    marruecos: [1.6, 7.6, 3.3, 6.3, 3.0, 3.0, 7.8, 3.5, 5.6, 4.2, 3.8, 5.2, 3.0, 4.5, 2.7, 4.5, 1.2, 4.2, 3.1, 2.9, -7.2, 8.0, 1.3, 3.4, 3.2, 4.0, 3.5],
    coreanorte: [0.4, 3.8, 1.2, 1.8, 2.1, 3.8, -1.1, -1.2, 3.1, -0.9, -0.5, 0.8, 1.3, 1.1, 1.0, -1.1, 3.9, -3.5, -4.1, 0.4, -4.5, -0.1, -0.2, 3.1, 3.7, 2.0, 2.0]
  };
  // ---------- Saldo migratorio real (miles/año) ----------
  const MIG = {
    espana: [200, 350, 450, 600, 600, 700, 500, 700, 500, 150, 60, 20, -100, -250, -100, 50, 100, 200, 400, 600, 100, 200, 600, 700, 600, 500, 400],
    francia: [90, 90, 90, 90, 90, 90, 100, 100, 100, 100, 100, 100, 100, 100, 110, 120, 130, 140, 150, 160, 80, 140, 180, 150, 150, 140, 130],
    alemania: [170, 200, 220, 140, 110, 80, 40, 40, 30, 60, 130, 280, 370, 430, 550, 1140, 500, 400, 400, 350, 200, 300, 1500, 700, 400, 350, 300],
    rusia: [220, 220, 200, 180, 180, 180, 200, 200, 200, 200, 200, 200, 300, 300, 280, 100, 100, 100, 100, 100, 50, 0, -500, -300, -100, 0, 50],
    eeuu: [900, 1000, 1000, 900, 1000, 1000, 1000, 900, 800, 700, 700, 800, 900, 900, 1000, 1000, 1000, 800, 800, 800, 500, 400, 1000, 1500, 1200, 900, 800],
    marruecos: [-40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40],
    coreanorte: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };
  // población del año 2000 respecto a la base actual
  const POP0 = { espana: 0.83, francia: 0.89, alemania: 0.98, rusia: 1.02, eeuu: 0.84, marruecos: 0.77, coreanorte: 0.88 };
  const EN = { espana: 3.4, francia: 3.0, alemania: 3.0, rusia: 2.5, eeuu: 3.0, marruecos: 3.0, coreanorte: 2.0 };   // crecimiento «normal»

  function macro() {
    const i = Math.max(0, Math.min(26, year() - 2000)), g = (G[cid()] || G.espana)[i], norm = 2.2;
    acc('eco', (g - norm) * 0.05); acc('emp', (g - norm) * 0.03);
    gameState.ecoMacro = { y: year(), g };
    const D = gameState.demo; if (D) D.mig = (MIG[cid()] || MIG.espana)[i];
  }
  function popInit() {
    const E = gameState.ec; if (E.pop) return; const D = gameState.demo; if (!D) return;
    const f = POP0[cid()] || 0.85; E.pop = true;
    D.b = D.b.map(v => v * f); if (D.pop0) D.pop0 *= f; if (D.hist && D.hist[0]) D.hist[0][1] *= f;
  }

  // ---------- Palancas de política económica ----------
  const LV = {
    jobs: { n: 'Empleo público', d: 'Contratar (+) o amortizar plazas (−): más empleo y servicios, más gasto.', eff: { emp: 0.06, eco: 0.015, apr: 0.02 }, cost: 0.0009 },
    wage: { n: 'Salarios de funcionarios', d: 'Subir (+) o bajar (−) los sueldos públicos: consumo y apoyo frente a coste.', eff: { apr: 0.05, eco: 0.025, est: 0.02 }, cost: 0.0010 },
    minw: { n: 'Salario mínimo', d: 'Sube ingresos y apoyo, pero frena algo el empleo.', eff: { apr: 0.04, emp: -0.035, eco: 0.01 }, cost: 0 },
    rent: { n: 'Mercado de la vivienda', d: '+ intervenir (alquiler regulado, vivienda pública) · − liberalizar suelo y alquiler.', eff: { apr: 0.05, est: 0.02, eco: -0.03 }, cost: 0.0004 },
    pens: { n: 'Pensiones', d: 'Revalorizar (+) o congelar/recortar (−).', eff: { apr: 0.05, est: 0.03, eco: 0.01 }, cost: 0.0010 },
    tax: { n: 'Presión fiscal', d: '+ subir impuestos (más ingresos, menos apoyo) · − bajarlos.', eff: { apr: -0.05, eco: -0.02, emp: -0.01 }, cost: -0.0012 }
    ,fdi: { n: 'Atracción de inversión extranjera', d: '+ incentivos, zonas francas y menos trabas para que vengan empresas de fuera · − endurecer condiciones.', eff: { eco: 0.04, emp: 0.04, est: -0.005 }, cost: 0.0007 },
    champ: { n: 'Apoyo a empresas nacionales', d: '+ ayudas y garantías a nuestras grandes empresas · − dejar que compitan solas.', eff: { emp: 0.035, eco: 0.02, apr: 0.02 }, cost: 0.0009 },
    rnd: { n: 'I+D y tejido empresarial', d: '+ inversión en innovación, parques tecnológicos y pymes · − recortes.', eff: { eco: 0.045, emp: 0.015, apr: 0.005 }, cost: 0.0008 }
  };
  const EC = () => gameState.ec || (gameState.ec = { jobs: 0, wage: 0, minw: 0, rent: 0, pens: 0, tax: 0, cd: {}, pop: false });
  function flows() {
    const E = EC(); let net = 0;
    Object.keys(LV).forEach(k => { const L = E[k] || 0; if (!L) return; Object.keys(LV[k].eff).forEach(m => acc(m, LV[k].eff[m] * L)); net += LV[k].cost * L; });
    if (net) { try { registerFinancialTransaction('Política económica (empleo, salarios, pensiones, vivienda, impuestos)', -Math.round(budget() * net), 'economia'); } catch (e) { /* sin libro */ } }
  }
  window.ecoSet = function (k, d) {
    const E = EC(), L = LV[k]; if (!L) return;
    const nv = Math.max(-2, Math.min(2, (E[k] || 0) + d)); if (nv === E[k]) return;
    if (day() - (E.cd[k] || -999) < 30) { toast('Esta política se cambió hace menos de 30 días.', '#d9a726'); return; }
    if (cpGet() < 2) { toast('Necesitas 2 de capital político para cambiar una política.', '#ef4444'); return; }
    cpAdd(-2); E[k] = nv; E.cd[k] = day();
    toast('<b>' + L.n + '</b>: nivel ' + (nv > 0 ? '+' : '') + nv, '#10b981'); window.ecoOpen();
  };
  const CHAMP = { espana: 'SEAT, Telefónica, Iberdrola o Inditex', francia: 'Renault, Airbus, TotalEnergies o L\'Oréal', alemania: 'Volkswagen, Siemens, BASF o Bosch', rusia: 'Gazprom, Rosneft, Sberbank o Rostec', eeuu: 'Ford, Boeing, Intel o Apple', marruecos: 'OCP, Attijariwafa, Renault Tánger o Maroc Telecom', coreanorte: 'las empresas estatales y las zonas económicas especiales' };
  window.ecoOpen = function () {
    LV.champ.d = '+ ayudas y garantías a ' + (CHAMP[cid()] || CHAMP.espana) + ' · − dejar que compitan solas.';
    const E = EC(), old = document.getElementById('eco-modal'); if (old) old.remove();
    const g = gameState.ecoMacro ? gameState.ecoMacro.g : 0;
    const d = document.createElement('div'); d.id = 'eco-modal';
    d.style.cssText = 'position:fixed;inset:0;z-index:9997;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;padding:16px';
    d.innerHTML = '<div style="max-width:680px;width:100%;background:#0f172a;border:2px solid #d9a726;border-radius:12px;padding:18px;color:#e2e8f0;font-family:system-ui,sans-serif;max-height:92vh;overflow:auto">'
      + '<h3 style="font-size:20px;color:#fbbf24;margin:0 0 4px">POLÍTICA ECONÓMICA</h3><p style="font-size:12px;color:#94a3b8;margin:0 0 10px">Coyuntura real de ' + (gameState.currentDate ? year() : '') + ': PIB <b style="color:' + (g >= 0 ? '#6ee7b7' : '#fca5a5') + '">' + (g >= 0 ? '+' : '') + g + ' %</b>. Cada palanca va de −2 a +2 y actúa cada mes sobre economía, empleo, estabilidad, apoyo y Tesorería. Cambiar una cuesta 2 de capital político (tienes ' + Math.round(cpGet()) + ').</p>'
      + Object.keys(LV).map(k => { const L = LV[k], v = E[k] || 0; return '<div style="display:flex;align-items:center;gap:10px;margin-top:8px;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:8px 10px"><div style="flex:1"><b>' + L.n + '</b><div style="font-size:11px;color:#94a3b8">' + L.d + '</div></div>'
        + '<button onclick="ecoSet(\'' + k + '\',-1)" style="width:28px;height:28px;border-radius:6px;background:#0f172a;border:1px solid #475569;color:#f1f5f9;cursor:pointer">−</button><b style="min-width:28px;text-align:center;color:' + (v > 0 ? '#6ee7b7' : v < 0 ? '#fca5a5' : '#e2e8f0') + '">' + (v > 0 ? '+' : '') + v + '</b>'
        + '<button onclick="ecoSet(\'' + k + '\',1)" style="width:28px;height:28px;border-radius:6px;background:#0f172a;border:1px solid #475569;color:#f1f5f9;cursor:pointer">+</button></div>'; }).join('')
      + '<button onclick="document.getElementById(\'eco-modal\').remove()" style="margin-top:14px;background:none;border:1px solid #475569;border-radius:6px;padding:6px 12px;color:#94a3b8;cursor:pointer">Cerrar</button></div>';
    document.body.appendChild(d); try { uxClose(); } catch (e) { /* sin panel */ }
  };

  // ---------- Decisiones económicas y políticas de cada país, 2000-2026 ----------
  /* [año, mes, id, '*', título, descripción, {}, {}, [[texto, stats, coste, deuda M€]], países] */
  const DEC = [
    // ESPAÑA
    [2000, 4, 'e_tel', '*', 'LIBERALIZACIÓN DE LAS TELECOMUNICACIONES', 'Bruselas empuja a abrir el mercado de telefonía fija y móvil a la competencia. Telefónica pierde su posición dominante.', {}, {}, [['Liberalizar del todo y bajar precios', { eco: 3, apr: 3, est: -1 }], ['Proteger al operador histórico', { eco: -1, apr: -2, con: -2 }]], 'espana'],
    [2000, 6, 'e_suelo', '*', 'LEY DEL SUELO · TODO EL SUELO ES URBANIZABLE', 'El sector pide liberalizar el suelo para abaratar la vivienda y alimentar el boom de la construcción.', {}, {}, [['Liberalizar el suelo', { eco: 5, emp: 4, apr: 2, est: -1 }], ['Mantener la protección y planificar', { eco: -1, apr: -1, est: 2 }]], 'espana'],
    [2003, 12, 'e_energia', '*', 'LIBERALIZACIÓN ENERGÉTICA', 'Se abre el mercado eléctrico y del gas a nuevos operadores.', {}, {}, [['Liberalizar y privatizar', { eco: 3, apr: -2, con: 2 }], ['Mantener tarifas reguladas', { apr: 2, eco: -1 }]], 'espana'],
    [2008, 12, 'e_plane', '*', 'PLAN DE ESTÍMULO PÚBLICO', 'El desempleo se dispara. Se propone un plan masivo de obra pública y ayudas municipales.', {}, {}, [['Plan de estímulo (déficit)', { eco: 4, emp: 5, apr: 2 }, 0, 8000], ['No gastar más: confiar en el mercado', { eco: -2, emp: -3, apr: -3 }]], 'espana'],
    [2009, 6, 'e_frob', '*', 'REESTRUCTURACIÓN DE LAS CAJAS DE AHORROS', 'Las cajas, muy expuestas al ladrillo, necesitan un fondo público de reestructuración (FROB).', {}, {}, [['Crear el FROB y fusionar cajas', { eco: 2, est: 2, apr: -3 }, 0, 9000], ['Dejar que se arreglen solas', { eco: -3, est: -3 }]], 'espana'],
    [2010, 6, 'e_laboral', '*', 'REFORMA LABORAL', 'Hay que decidir si se abarata el despido y se flexibiliza la negociación colectiva.', {}, {}, [['Reforma laboral profunda', { eco: 3, emp: 3, apr: -6, est: -3 }], ['Reforma moderada pactada con sindicatos', { eco: 1, apr: 1, est: 2 }], ['No tocar el mercado laboral', { emp: -2, apr: 1 }]], 'espana'],
    [2012, 6, 'e_rescate', '*', 'RESCATE BANCARIO', 'Bankia y otras entidades se hunden. La prima de riesgo roza los 600 puntos. ¿Pides el rescate a Europa?', {}, {}, [['Pedir el rescate europeo para la banca (hasta 100.000 M€)', { eco: 6, est: 3, apr: -5, con: -3 }, 0, 41000], ['Rescatar con fondos nacionales', { eco: 4, apr: -8, est: 1 }, 0, 70000], ['Dejar caer a los bancos y garantizar solo los depósitos', { eco: -9, emp: -6, est: -5, apr: -4 }]], 'espana', EU_FLAG()],
    [2012, 9, 'e_iva', '*', 'SUBIDA DEL IVA Y AJUSTE FISCAL', 'Para cumplir el déficit comprometido con Bruselas hay que ingresar más o recortar más.', {}, {}, [['Subir el IVA', { apr: -5, eco: -2, est: -1 }, 0, -6000], ['Recortar servicios públicos', { apr: -6, est: -3, emp: -2 }, 0, -7000], ['Negociar más plazo con Bruselas', { con: -3, apr: 1 }, 0, 4000]], 'espana'],
    [2021, 5, 'e_ngeu', '*', 'FONDOS EUROPEOS NEXT GENERATION', 'Bruselas ofrece un gran paquete de recuperación. Hay que decidir el reparto y las reformas asociadas.', {}, {}, [['Reformas ambiciosas y fondos a las empresas', { eco: 5, emp: 3, apr: 1 }, 0, -8000], ['Repartir entre administraciones sin condiciones', { apr: 2, eco: 2 }, 0, -3000]], 'espana', EU_FLAG()],
    [2022, 5, 'e_tope', '*', 'EXCEPCIÓN IBÉRICA · TOPE AL GAS', 'Los precios de la electricidad se disparan y se propone limitar el precio del gas en la generación.', {}, {}, [['Poner el tope al gas', { apr: 3, eco: 1 }, 0, 3000], ['Dejar que funcione el mercado', { apr: -4, eco: -2 }]], 'espana'],
    // FRANCIA
    [2000, 2, 'f_35h', '*', 'LA SEMANA DE 35 HORAS', 'El gobierno de la izquierda plural debate generalizar la reducción de la jornada laboral.', {}, {}, [['Generalizar las 35 horas', { emp: 3, apr: 3, eco: -3 }, 0, 2000], ['Aplicarlas solo a grandes empresas', { eco: 1, emp: 1 }]], 'francia'],
    [2003, 6, 'f_retraites', '*', 'REFORMA DE PENSIONES', 'El envejecimiento obliga a alargar las cotizaciones. Los sindicatos amenazan con huelgas.', {}, {}, [['Alargar la edad y las cotizaciones', { eco: 2, apr: -5, est: -3 }, 0, -3000], ['Mantener el sistema actual', { apr: 2, eco: -1 }, 0, 3000]], 'francia'],
    [2008, 10, 'f_banques', '*', 'RESCATE DE LA BANCA FRANCESA', 'Dexia y otras entidades se tambalean tras Lehman.', {}, {}, [['Inyectar capital público', { eco: 4, est: 2, apr: -2 }, 0, 20000], ['Dejar que absorba el sector privado', { eco: -3, est: -2 }]], 'francia'],
    [2010, 10, 'f_62', '*', 'EDAD DE JUBILACIÓN A LOS 62', 'Nueva reforma de pensiones con huelgas masivas.', {}, {}, [['Aprobar la reforma', { eco: 2, apr: -5, est: -3 }, 0, -4000], ['Retirarla', { apr: 3, eco: -1 }]], 'francia'],
    [2018, 11, 'f_chalecos', '*', 'CHALECOS AMARILLOS', 'La subida del impuesto sobre los carburantes enciende las calles.', {}, {}, [['Retirar el impuesto y subir el salario mínimo', { apr: 5, est: 3, eco: -2 }, 0, 6000], ['Mantener la tasa ecológica', { est: -4, apr: -4 }]], 'francia'],
    // ALEMANIA
    [2003, 3, 'a_hartz', '*', 'AGENDA 2010 · REFORMAS HARTZ', 'El «enfermo de Europa» necesita reformar el mercado de trabajo y el subsidio de desempleo.', {}, {}, [['Reformas Hartz profundas', { eco: 4, emp: 4, apr: -5, est: -2 }], ['Reformas suaves', { eco: 1, apr: -1 }], ['Rechazar los recortes', { apr: 2, eco: -2 }]], 'alemania'],
    [2008, 10, 'a_banken', '*', 'RESCATE DE LOS BANCOS ALEMANES', 'Hypo Real Estate y varios Landesbanken necesitan ayuda pública urgente.', {}, {}, [['Rescate con fondo de estabilización', { eco: 4, est: 2, apr: -3 }, 0, 25000], ['Insolvencia ordenada', { eco: -4, emp: -3 }]], 'alemania'],
    [2011, 3, 'a_atom', '*', 'ABANDONO DE LA ENERGÍA NUCLEAR', 'Tras Fukushima se plantea cerrar todas las centrales.', {}, {}, [['Cerrar la nuclear (Energiewende)', { apr: 3, eco: -2, est: 1 }, 0, 4000], ['Mantener las nucleares', { eco: 1, apr: -2 }]], 'alemania'],
    [2015, 1, 'a_minimo', '*', 'SALARIO MÍNIMO NACIONAL', 'Se debate introducir por primera vez un salario mínimo general.', {}, {}, [['Introducir 8,50 €/hora', { apr: 4, emp: -1, eco: 0 }], ['Rechazarlo', { eco: 1, apr: -2 }]], 'alemania'],
    // RUSIA
    [2001, 1, 'r_flat', '*', 'IMPUESTO ÚNICO DEL 13 %', 'Se propone sustituir el sistema fiscal por un tipo único bajo para aumentar la recaudación.', {}, {}, [['Aprobar el impuesto único', { eco: 4, apr: 2 }, 0, -2000], ['Mantener la escala progresiva', { apr: 1 }]], 'rusia'],
    [2003, 10, 'r_yukos', '*', 'EL CASO YUKOS', 'El mayor petrolero privado es acusado de fraude; el Estado puede recuperar el control de la energía.', {}, {}, [['Nacionalizar de facto el petróleo', { eco: 2, est: 3, con: -6, mil: 2 }, 0, -8000], ['Respetar a los oligarcas', { eco: 3, con: 3, est: -2 }]], 'rusia'],
    [2008, 9, 'r_bancos', '*', 'INYECCIÓN DE LIQUIDEZ A LA BANCA', 'La caída del petróleo y del rublo amenaza al sistema bancario.', {}, {}, [['Rescatar con reservas', { eco: 3, est: 2 }, 0, 6000], ['Dejar caer a los bancos débiles', { eco: -4, emp: -3 }]], 'rusia'],
    [2018, 6, 'r_pensiones', '*', 'REFORMA DE LA EDAD DE JUBILACIÓN', 'Se propone elevar la edad de jubilación para sostener las cuentas.', {}, {}, [['Subir la edad', { eco: 2, apr: -8, est: -3 }, 0, -3000], ['Mantenerla', { apr: 2 }]], 'rusia'],
    // EEUU
    [2001, 5, 'u_taxcuts', '*', 'RECORTES DE IMPUESTOS', 'Se propone una gran rebaja fiscal.', {}, {}, [['Bajar impuestos a todos', { eco: 3, apr: 3 }, 0, 10000], ['Mantener el superávit', { eco: -1, con: 2 }]], 'eeuu'],
    [2008, 10, 'u_tarp', '*', 'RESCATE BANCARIO (TARP)', 'Wall Street se hunde. El Tesoro propone un rescate de 700.000 millones.', {}, {}, [['Aprobar el TARP', { eco: 5, est: 3, apr: -6 }, 0, 60000], ['Dejar caer a los bancos', { eco: -10, emp: -8, est: -5 }]], 'eeuu'],
    [2010, 3, 'u_salud', '*', 'REFORMA SANITARIA', 'Se debate extender el seguro médico a millones de personas.', {}, {}, [['Aprobar el seguro universal (Obamacare)', { apr: 3, est: 2, eco: -2 }, 0, 15000], ['Rechazar la reforma', { apr: -1, eco: 1 }]], 'eeuu'],
    [2017, 12, 'u_taxact', '*', 'GRAN REFORMA FISCAL', 'Se propone bajar el impuesto de sociedades al 21 %.', {}, {}, [['Aprobar la rebaja', { eco: 3, apr: 1 }, 0, 15000], ['Rechazarla', { apr: 1, eco: -1 }]], 'eeuu'],
    // MARRUECOS
    [2003, 5, 'm_telecom', '*', 'PRIVATIZACIÓN DE LAS TELECOMUNICACIONES', 'Se abre el capital de Maroc Telecom.', {}, {}, [['Privatizar', { eco: 3, apr: -1 }, 0, -2000], ['Mantenerlo público', { apr: 1 }]], 'marruecos'],
    [2004, 2, 'm_moudawana', '*', 'REFORMA DEL CÓDIGO DE FAMILIA', 'Se plantea reformar la Mudawana.', {}, {}, [['Aprobar la reforma', { apr: 3, est: -1, con: 3 }], ['Aplazarla', { apr: -1, est: 1 }]], 'marruecos'],
    [2012, 6, 'm_compensa', '*', 'REFORMA DE LA CAJA DE COMPENSACIÓN', 'Los subsidios a combustibles y alimentos pesan demasiado en las cuentas.', {}, {}, [['Retirar los subsidios gradualmente', { eco: 3, apr: -5, est: -2 }, 0, -4000], ['Mantenerlos', { apr: 2, eco: -1 }, 0, 4000]], 'marruecos'],
    [2021, 6, 'm_fiscal', '*', 'REFORMA FISCAL Y NUEVO MODELO DE DESARROLLO', 'Se plantea ampliar la protección social con una nueva fiscalidad.', {}, {}, [['Ampliar la cobertura social', { apr: 4, est: 2, eco: -1 }, 0, 4000], ['Priorizar la inversión', { eco: 2, apr: -1 }]], 'marruecos'],
    // COREA DEL NORTE
    [2002, 7, 'n_reforma', '*', 'MEDIDAS DE GESTIÓN ECONÓMICA', 'Se plantea permitir mercados y precios y salarios más flexibles.', {}, {}, [['Abrir mercados y precios', { eco: 4, apr: 2, est: -2 }], ['Mantener la economía planificada', { est: 2, eco: -2 }]], 'coreanorte'],
    [2009, 11, 'n_moneda', '*', 'REFORMA MONETARIA', 'El Estado quiere recuperar el control de los mercados con una reforma de la moneda.', {}, {}, [['Reforma monetaria', { est: -3, eco: -3, mil: 1 }], ['Tolerar el mercado informal', { eco: 2, est: -1 }]], 'coreanorte'],
    [2013, 3, 'n_zonas', '*', 'ZONAS ECONÓMICAS ESPECIALES', 'Se propone crear zonas francas para atraer divisas.', {}, {}, [['Crear zonas económicas especiales', { eco: 4, con: 2 }], ['Mantener el aislamiento', { est: 2, eco: -1 }]], 'coreanorte']
  ];
  function EU_FLAG() { return 'eu'; }

  // ---------- Enganches ----------
  const _md = window.makeDecision;
  if (typeof _md === 'function') makeDecision = function (i) {
    const ev = gameState.activeDynamicEvent, o = ev && ev.options && ev.options[Number(i)];
    const r = _md.apply(this, arguments);
    if (o && o.debt && gameState.debt) { gameState.debt.amount = Math.max(0, (gameState.debt.amount || 0) + o.debt); try { registerFinancialTransaction('Decisión económica: ' + ev.title, o.debt > 0 ? o.debt : -o.debt, 'economia'); } catch (e) { /* sin libro */ } }
    return r;
  };
  const _gt = window.gameTick;
  if (typeof _gt === 'function') gameTick = function () {
    const b = gameState.daysInOffice, r = _gt.apply(this, arguments);
    if (gameState.daysInOffice !== b && live() && gameState.scenario.hist) {
      try { const E = EC(); popInit(); if (day() % 30 === 3) { macro(); flows(); } } catch (e) { console.error(e); }
    }
    return r;
  };
  // se añaden las decisiones a la línea temporal histórica
  if (Array.isArray(window.HIST_TL)) DEC.forEach(e => window.HIST_TL.push(e));

  // botón de acceso en «Ayuda y modo» y en la barra de gobierno
  function hook() {
    const pop = document.getElementById('ux-pop'); if (!pop) return setTimeout(hook, 800);
    const mo = new MutationObserver(() => {
      if (pop.querySelector('#eco-box')) return; mo.disconnect();
      const d = document.createElement('div'); d.id = 'eco-box';
      d.innerHTML = '<h4>ECONOMÍA</h4><button class="ux-mode" style="width:100%" onclick="ecoOpen()"><i class="fa-solid fa-sack-dollar"></i> Política económica (empleo, salarios, vivienda…)</button>';
      pop.appendChild(d); mo.observe(pop, { childList: true });
    });
    mo.observe(pop, { childList: true });
  }
  hook();
  const _rt = window.renderTabContent;
  if (typeof _rt === 'function') renderTabContent = function () {
    const t = gameState.activeTab, h = _rt.apply(this, arguments);
    if ((t === 'main' || t === 'budget' || t === 'fin') && gameState.scenario && gameState.scenario.hist) {
      return '<div class="mb-2"><button onclick="ecoOpen()" class="hoi-button px-3 py-1 rounded text-xs cursor-pointer"><i class="fa-solid fa-sack-dollar mr-1"></i>POLÍTICA ECONÓMICA · empleo público, salarios, mínimo, vivienda, pensiones, impuestos</button></div>' + h;
    }
    return h;
  };
})();
