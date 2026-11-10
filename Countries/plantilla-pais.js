/* =====================================================================
   PLANTILLA DE PAÍS · MONCLOA STRATEGY
   =====================================================================

   ╔═══════════════════════════════════════════════════════════════════╗
   ║ PARTE A · CÓMO USARLA (para ti)                                   ║
   ╚═══════════════════════════════════════════════════════════════════╝
   1. Rellena la FICHA (Parte B). Con PAÍS y AÑO basta: lo demás lo
      investigo/estimo yo. Cuanto más rellenes, más fiel saldrá.
   2. Sube este fichero a un chat con Claude y escribe:
         "Crea este país"
      (si quieres, sube también tu Countries/index.json actual).
   3. Claude te devuelve:
         · Countries/<id>.js        el país completo y validado
         · Countries/index.json     con el país nuevo añadido
         · un resumen con lo que se inventó o estimó
   4. Copia esos ficheros a la carpeta Countries/ de tu web, sube la
      versión de sw.js (VERSION) y recarga con Ctrl+F5. El país aparece
      en «ELIGE EL PAÍS» en la pantalla de inicio.
   Nota: no hace falta tocar index.html. Mientras no haya mapa propio, el
   país mostrará «Mapa no disponible» (ver COUNTRY_MAP al final).

   ╔═══════════════════════════════════════════════════════════════════╗
   ║ PARTE B · FICHA DEL PAÍS (rellena lo que quieras tras los «:»)    ║
   ╚═══════════════════════════════════════════════════════════════════╝
   PAÍS (obligatorio) ...................:
   AÑO / MOMENTO POLÍTICO (obligatorio) .:
   ID (minúsculas, sin tildes; p. ej. francia) ..:
   BANDERA (2 letras; p. ej. FR) ........:
   TÍTULO DEL JEFE DE GOBIERNO ..........:   (p. ej. Primer Ministro)
   PARLAMENTO (nombre y nº de escaños) ..:
   TESORERÍA INICIAL (M€) ...............:   (si no, la estimo)
   PARTIDOS (uno por línea: siglas · nombre · líder · escaños · ideología · ¿regional?):
      -
      -
      -
   MINISTROS REALES (nombre · partido · cartera):
      -
      -
   MEDIOS / PERIÓDICOS (3-6) ............:
   BANCO CENTRAL Y GOBERNADORES (3) .....:
   MEGAPROYECTOS DEL PAÍS (4-6) .........:
   SOCIOS Y RELACIONES EXTERIORES .......:
   TEMAS CALIENTES DE LA AGENDA .........:
   QUÉ ES LA «CONFIANZA» (métrica con) ..:   (Corona, Palacio, Presidencia, Ejército…)
   NOTAS EXTRA ..........................:

   ╔═══════════════════════════════════════════════════════════════════╗
   ║ PARTE C · INSTRUCCIONES PARA CLAUDE (obligatorias, en este orden) ║
   ╚═══════════════════════════════════════════════════════════════════╝
   CONTEXTO
   «Moncloa Strategy» es un simulador político en HTML/JS. Cada país es
   UN fichero JS plano que declara 17 constantes globales y que el motor
   carga ANTES de su script principal (solo se carga un país por partida).
   Este fichero es la plantilla; el usuario lo sube con la FICHA rellena
   (o casi vacía). Tu trabajo es producir el país completo.

   ENTREGABLES (siempre los tres)
   a) Countries/<id>.js ........ país completo. Créalo copiando las
      secciones 1-17 de abajo (desde «const SCENARIOS» hasta
      «const BDE_ACTIONS» incluidas) y sustituyendo TODO el contenido de
      ejemplo («Ejemplandia», «EJ…»). No dejes nada de ejemplo. Quita esta
      cabecera y pon en su lugar 3-5 líneas con país, año y fecha.
   b) Countries/index.json ..... añade {"id","name","flag","file"} al array
      "countries" sin quitar los que ya existan. Si el usuario no subió su
      index.json, entrega solo el bloque a añadir.
   c) Resumen breve ............ partidos y escaños, qué datos estimaste o
      inventaste, y los avisos del validador que queden.

   PASOS
   1. Lee la FICHA. Si tienes búsqueda web, úsala para completar lo que
      falte para ese año (partidos y escaños reales, líderes, ministros,
      medios, banco central, proyectos, agenda). Si no, usa tu
      conocimiento y dilo en el resumen. Si PAÍS o AÑO están vacíos,
      pregunta una sola vez; para todo lo demás, no preguntes: decide.
   2. Escribe el fichero respetando REGLAS DE FORMATO y de CONTENIDO.
   3. VALIDA: guarda el código de la Parte D como validar-pais.js y ejecuta
         node validar-pais.js Countries/<id>.js
      Corrige TODOS los errores (✗) y repite hasta ver «✓ Fichero válido».
      Cumple también los mínimos de la tabla (los avisos «recomendado»).
   4. Entrega con present_files. Sin postámbulo largo.

   REGLAS DE FORMATO
   · JavaScript plano. Exactamente estas 17 `const`, en este orden:
     SCENARIOS, DYNAMIC_EVENTS, CAMPAIGN_HEADLINES, PRESS_NEWS_BANK,
     MINISTRY_DECISIONS_BANK, HOUSING_EVENTS, REAL_MINISTERS, GOAL_POOL,
     GOAL_ACTIONS, FOCUS_TREE, FOCUS_LINKS, SHOCK_POOL, INTL_ACTIONS,
     PROJECTS, ACHIEVEMENTS, BDE_GOVS, BDE_ACTIONS.
     Sin import/export, sin otras declaraciones de primer nivel, sin
     HTML ni markdown dentro de las cadenas. (Opcionales al final:
     COUNTRY_DECISIONS y COUNTRY_MAP, solo si procede.)
   · Texto en español, comillas simples, apóstrofes escapados (\'),
     cadenas en una sola línea. Iconos: nombres FontAwesome 6 free
     («fa-landmark»…).
   · IDs únicos dentro de cada constante.

   REGLAS DE CONTENIDO (listas cerradas: no inventes valores nuevos)
   · Métricas (claves de stats/fx/now/daily/run/effects): eco, est, emp,
     con, apr, mil  (Economía, Estabilidad, Empleo, Confianza,
     Aprobación, Ejército).
   · Carteras (portfolio y SHOCK_POOL.min): economia, interior, defensa,
     vivienda, territorio, sanidad, educacion, trabajo, justicia,
     exteriores, transicion_ecologica, cultura, igualdad. Adapta cada
     nombre real (p. ej. «agricultura» → territorio). MINISTRY_DECISIONS_BANK
     admite además la clave infraestructuras.
   · Ramas de FOCUS_TREE: eco, soc, seg, dip (4 focos cada una = 16).
   · BDE_GOVS: ids exactos tecnico, afin, indep (nombres y textos del
     banco central del país).
   · Partidos: id en MAYÚSCULAS sin espacios; spectrumOrder 1
     (izquierda) a 7 (derecha); seats = baseSeats; minSeats ≤ seats ≤
     maxSeats; los escaños suman el total del parlamento; basePct suma
     ≈ 100; redLines = ids de SCENARIOS. Incluye un partido 'OTR'
     (independientes/otros) para ministros técnicos.
   · loyaltyImpact: solo ids de partidos de SCENARIOS, entre ±5 y ±35.
   · Cantidades de dinero en M€ equivalentes, aunque la moneda sea otra.
     cost > 0 gasta; cost < 0 ingresa. ESCALA todo a la tesorería
     inicial (campo treasury): decisión normal 1-5 %, grande 5-10 %;
     un proyecto completo 15-50 %. (España ≈ 75.000, Marruecos ≈ 9.000.)
   · stats de una opción: lo normal ±1 a ±10 por métrica, 2-4 métricas.
     Cada opción debe tener ventajas y costes reales (nunca una opción
     claramente mejor que la otra).
   · DYNAMIC_EVENTS son las DECISIONES DE GOBIERNO del país (el motor las
     usa como mazo y también como crisis): condition: (m) => true en la
     mayoría; en unas pocas, una condición sobre las métricas.
   · Nombres reales de políticos solo si la ficha o el contexto histórico
     los exigen; los textos deben ser sobrios y realistas.
   · Campos opcionales de SCENARIOS.<id>: treasury (M€ iniciales) y
     startYear (año del calendario). Ponlos siempre.

   TABLA DE MÍNIMOS (el validador avisa si no se cumplen)
   SCENARIOS: 8-12 partidos · DYNAMIC_EVENTS ≥ 15 · CAMPAIGN_HEADLINES ≥ 8
   PRESS_NEWS_BANK ≥ 8 · MINISTRY_DECISIONS_BANK ≥ 8 carteras con ≥ 1 ·
   HOUSING_EVENTS ≥ 2 · REAL_MINISTERS ≥ 12 (cubre las 13 carteras) ·
   GOAL_POOL 9 · GOAL_ACTIONS ≥ 8 · FOCUS_TREE = 16 · FOCUS_LINKS ≥ 6 ·
   SHOCK_POOL ≥ 8 · INTL_ACTIONS ≥ 4 · PROJECTS ≥ 4 · ACHIEVEMENTS ≥ 8
   · BDE_GOVS = 3 · BDE_ACTIONS ≥ 6.

   LIMITACIONES CONOCIDAS (díselas al usuario si preguntan)
   · El motor no permite cambiar la lista de países «socios» de la pestaña
     Exterior (INTL_ACTIONS solo define los tipos de acción).
   · Mapa: sin COUNTRY_MAP el país muestra «Mapa no disponible».
   · Algunos textos fijos del motor (p. ej. «Congreso», «Moncloa») no
     dependen de este fichero.

   ╔═══════════════════════════════════════════════════════════════════╗
   ║ PARTE D · VALIDADOR (guárdalo como validar-pais.js y ejecútalo)   ║
   ╚═══════════════════════════════════════════════════════════════════╝
   Copia SOLO las líneas entre los dos marcadores.
=====VALIDADOR-INICIO=====
// Validador de ficheros de país. Uso: node validar-pais.js ruta/al/pais.js
const fs = require('fs'), vm = require('vm');
const file = process.argv[2];
if (!file) { console.log('Uso: node validar-pais.js Countries/pais.js'); process.exit(2); }
const code = fs.readFileSync(file, 'utf8');
const NAMES = ['SCENARIOS','DYNAMIC_EVENTS','CAMPAIGN_HEADLINES','PRESS_NEWS_BANK','MINISTRY_DECISIONS_BANK','HOUSING_EVENTS','REAL_MINISTERS','GOAL_POOL','GOAL_ACTIONS','FOCUS_TREE','FOCUS_LINKS','SHOCK_POOL','INTL_ACTIONS','PROJECTS','ACHIEVEMENTS','BDE_GOVS','BDE_ACTIONS'];
const ctx = { console, gameState: { metrics: { eco: 50, est: 50, emp: 50, con: 50, apr: 50, mil: 50 }, daysInOffice: 0, treasury: 5000, coalitionIds: [], parties: [], triggeredDynamicEvents: [], leaderPartyId: '' } };
vm.createContext(ctx);
const err = [], warn = [];
const E = m => err.push(m), W = m => warn.push(m);
try { vm.runInContext(code + '\n;this.__ALL = {' + NAMES.map(n => `${n}: typeof ${n} === "undefined" ? undefined : ${n}`).join(',') + '};', ctx); }
catch (e) { console.log('ERROR DE SINTAXIS/EJECUCIÓN:', e.message); process.exit(1); }
const A = ctx.__ALL;
const METRICS = ['eco','est','emp','con','apr','mil'];
const PORTFOLIOS = ['economia','interior','defensa','vivienda','territorio','sanidad','educacion','trabajo','justicia','exteriores','transicion_ecologica','cultura','igualdad'];
const MINKEYS = PORTFOLIOS.concat(['infraestructuras']);
const BRANCHES = ['eco','soc','seg','dip'];
const isStr = v => typeof v === 'string' && v.trim().length > 0, isNum = v => typeof v === 'number' && isFinite(v);
const isFn = v => typeof v === 'function', isObj = v => v && typeof v === 'object' && !Array.isArray(v);
function need(cond, msg) { if (!cond) E(msg); return cond; }
function metricsObj(o, where, keys) { if (!need(isObj(o), where + ': debe ser un objeto')) return; Object.keys(o).forEach(k => { if (!(keys || METRICS).includes(k)) E(`${where}: métrica desconocida "${k}"`); else if (!isNum(o[k])) E(`${where}.${k}: debe ser número`); }); }
function uniq(arr, key, where) { const s = new Set(); arr.forEach(x => { if (s.has(x[key])) E(`${where}: id duplicado "${x[key]}"`); s.add(x[key]); }); }
function count(name, arr, min, max) { if (max && min === max) { if (arr.length !== max) E(`${name}: debe tener exactamente ${max} elementos (tiene ${arr.length})`); } else { if (arr.length < min) W(`${name}: ${arr.length} elementos (recomendado >= ${min})`); if (max && arr.length > max) E(`${name}: ${arr.length} elementos (máximo ${max})`); } }

NAMES.forEach(n => need(A[n] !== undefined, `Falta la constante ${n}`));
if (err.length) { report(); }

// 1. SCENARIOS
const partyIds = new Set();
need(isObj(A.SCENARIOS) && Object.keys(A.SCENARIOS).length, 'SCENARIOS debe tener al menos un escenario');
Object.entries(A.SCENARIOS).forEach(([k, sc]) => {
  const w = `SCENARIOS.${k}`;
  need(sc.id === k, `${w}.id debe ser "${k}"`); need(isStr(sc.title), `${w}.title`); need(isStr(sc.desc), `${w}.desc`);
  if (!need(Array.isArray(sc.parties), `${w}.parties debe ser array`)) return;
  count(w + '.parties', sc.parties, 6, 16); uniq(sc.parties, 'id', w + '.parties');
  let total = 0, pct = 0;
  sc.parties.forEach(p => {
    partyIds.add(p.id);
    ['id','name','leader','color','ideology'].forEach(f => need(isStr(p[f]), `${w}.parties[${p.id}].${f}`));
    ['seats','baseSeats','minSeats','maxSeats','basePct','spectrumOrder'].forEach(f => need(isNum(p[f]), `${w}.parties[${p.id}].${f} debe ser número`));
    need(typeof p.isRegional === 'boolean', `${w}.parties[${p.id}].isRegional debe ser true/false`);
    need(Array.isArray(p.redLines), `${w}.parties[${p.id}].redLines debe ser array`);
    if (p.spectrumOrder < 1 || p.spectrumOrder > 7) E(`${w}.parties[${p.id}].spectrumOrder debe estar entre 1 y 7`);
    if (p.seats !== p.baseSeats) W(`${w}.parties[${p.id}]: seats != baseSeats`);
    if (p.minSeats > p.seats || p.seats > p.maxSeats) E(`${w}.parties[${p.id}]: se exige minSeats <= seats <= maxSeats`);
    if (!/^#[0-9a-fA-F]{6}$/.test(p.color || '')) E(`${w}.parties[${p.id}].color debe ser #rrggbb`);
    total += p.seats; pct += p.basePct;
  });
  sc.parties.forEach(p => (p.redLines || []).forEach(r => { if (!sc.parties.some(q => q.id === r)) E(`${w}.parties[${p.id}].redLines: partido inexistente "${r}"`); }));
  console.log(`  ${k}: ${sc.parties.length} partidos, ${total} escaños, mayoría absoluta ${Math.floor(total / 2) + 1}, basePct suma ${pct.toFixed(1)}`);
  if (Math.abs(pct - 100) > 6) W(`${w}: basePct suma ${pct.toFixed(1)} (lo normal es ~100)`);
});
function loyalty(o, where) { if (o === undefined) return; if (!isObj(o)) return E(where + '.loyaltyImpact debe ser objeto'); Object.entries(o).forEach(([k, v]) => { if (!partyIds.has(k)) W(`${where}.loyaltyImpact: partido inexistente "${k}" (el motor lo ignora; usa solo ids de SCENARIOS)`); if (!isNum(v)) E(`${where}.loyaltyImpact.${k} debe ser número`); }); }
function options(opts, where, o) {
  o = o || {};
  if (!Array.isArray(opts) || !opts.length) { E(`${where}.options debe ser un array con opciones`); return; }
  if (opts.length < 2 || opts.length > 4) W(`${where}.options: ${opts.length} opciones (recomendado 2-4)`);
  opts.forEach((op, i) => {
    const w = `${where}.options[${i}]`;
    need(isStr(op.text), w + '.text');
    if (o.score) { need(isNum(op.score), w + '.score'); need(isStr(op.textResult), w + '.textResult'); return; }
    metricsObj(op.stats, w + '.stats'); need(isStr(op.news), w + '.news');
    if (op.cost !== undefined) need(isNum(op.cost), w + '.cost debe ser número');
    loyalty(op.loyaltyImpact, w);
  });
}
// 2-4, 6. eventos
const evGroups = [['DYNAMIC_EVENTS', true, 12], ['HOUSING_EVENTS', false, 2], ['PRESS_NEWS_BANK', false, 8]];
evGroups.forEach(([n, cond, min]) => { const a = A[n]; count(n, a, min); uniq(a, 'id', n);
  a.forEach(ev => { const w = `${n}[${ev.id}]`; need(isStr(ev.id) || isNum(ev.id), w + '.id'); need(isStr(ev.title || ev.headline), w + '.title/headline'); need(isStr(ev.desc), w + '.desc');
    if (n !== 'PRESS_NEWS_BANK') need(isStr(ev.category), w + '.category'); else need(isStr(ev.newspaper), w + '.newspaper');
    if (cond) { if (need(isFn(ev.condition), w + '.condition debe ser función (m)=>...')) { try { ev.condition({ eco: 50, est: 50, emp: 50, con: 50, apr: 50, mil: 50 }); } catch (e) { W(w + '.condition lanza error con un estado de prueba: ' + e.message); } } }
    options(ev.options, w); }); });
count('CAMPAIGN_HEADLINES', A.CAMPAIGN_HEADLINES, 8); uniq(A.CAMPAIGN_HEADLINES, 'id', 'CAMPAIGN_HEADLINES');
A.CAMPAIGN_HEADLINES.forEach(h => { const w = `CAMPAIGN_HEADLINES[${h.id}]`; need(isNum(h.id), w + '.id debe ser número'); ['newspaper','headline','desc'].forEach(f => need(isStr(h[f]), `${w}.${f}`)); options(h.options, w, { score: true }); });
// 5. MINISTRY_DECISIONS_BANK
Object.entries(A.MINISTRY_DECISIONS_BANK).forEach(([k, arr]) => { if (!MINKEYS.includes(k)) E(`MINISTRY_DECISIONS_BANK: clave no permitida "${k}"`); if (!Array.isArray(arr)) E(`MINISTRY_DECISIONS_BANK.${k} debe ser un array`); else if (!arr.length) W(`MINISTRY_DECISIONS_BANK.${k} está vacío (el motor lo salta; mejor añade decisiones)`); (arr || []).forEach((d, i) => { need(isStr(d.title), `MINISTRY_DECISIONS_BANK.${k}[${i}].title`); need(isNum(d.cost), `MINISTRY_DECISIONS_BANK.${k}[${i}].cost`); metricsObj(d.stats, `MINISTRY_DECISIONS_BANK.${k}[${i}].stats`); }); });
if (Object.values(A.MINISTRY_DECISIONS_BANK).filter(a => a.length).length < 8) W('MINISTRY_DECISIONS_BANK: recomendado >= 8 carteras con decisiones');
// 7. REAL_MINISTERS
count('REAL_MINISTERS', A.REAL_MINISTERS, 12); uniq(A.REAL_MINISTERS, 'id', 'REAL_MINISTERS');
const covered = new Set();
A.REAL_MINISTERS.forEach(m => { const w = `REAL_MINISTERS[${m.id}]`; ['id','name','party','portfolio','desc','pros','cons'].forEach(f => need(isStr(m[f]), `${w}.${f}`));
  if (!partyIds.has(m.party)) E(`${w}.party: partido inexistente "${m.party}"`); if (!PORTFOLIOS.includes(m.portfolio)) E(`${w}.portfolio: cartera no permitida "${m.portfolio}"`); covered.add(m.portfolio); metricsObj(m.effects, w + '.effects'); });
PORTFOLIOS.forEach(p => { if (!covered.has(p)) W(`REAL_MINISTERS: ninguna persona para la cartera "${p}" (el motor generará un ministro genérico)`); });
// 8-9 objetivos
const S = { metrics: { eco: 50, est: 50, emp: 50, con: 50, apr: 50, mil: 50 }, treasury: 5000, goals: { done: 0 }, focus: { done: [] }, proj: { done: [] }, debt: { amount: 0 }, bde: { cred: 50 }, campaign: { history: [] }, daysInOffice: 0 };
count('GOAL_POOL', A.GOAL_POOL, 9); uniq(A.GOAL_POOL, 'id', 'GOAL_POOL');
A.GOAL_POOL.forEach(g => { ['id','icon','title','desc'].forEach(f => need(isStr(g[f]), `GOAL_POOL[${g.id}].${f}`)); if (need(isFn(g.check), `GOAL_POOL[${g.id}].check debe ser función (s)=>...`)) try { g.check(S); } catch (e) { E(`GOAL_POOL[${g.id}].check lanza error: ${e.message}`); } });
count('GOAL_ACTIONS', A.GOAL_ACTIONS, 8); uniq(A.GOAL_ACTIONS, 'id', 'GOAL_ACTIONS');
A.GOAL_ACTIONS.forEach(a => { const w = `GOAL_ACTIONS[${a.id}]`; ['id','icon','title','news'].forEach(f => need(isStr(a[f]), `${w}.${f}`)); ['cap','cost','cd'].forEach(f => need(isNum(a[f]), `${w}.${f} debe ser número`)); metricsObj(a.fx, w + '.fx'); if (a.gain !== undefined) need(isNum(a.gain), w + '.gain'); });
// 10-11 focos
count('FOCUS_TREE', A.FOCUS_TREE, 16, 16); uniq(A.FOCUS_TREE, 'id', 'FOCUS_TREE');
BRANCHES.forEach(b => { if (A.FOCUS_TREE.filter(f => f.b === b).length !== 4) E(`FOCUS_TREE: la rama "${b}" debe tener exactamente 4 focos`); });
A.FOCUS_TREE.forEach(f => { const w = `FOCUS_TREE[${f.id}]`; need(BRANCHES.includes(f.b), `${w}.b debe ser eco|soc|seg|dip`); need(isStr(f.title), w + '.title'); need(isNum(f.days), w + '.days'); metricsObj(f.now, w + '.now');
  if (f.req !== undefined) { const r = A.FOCUS_TREE.find(x => x.id === f.req); if (!r) E(`${w}.req: foco inexistente "${f.req}"`); else if (r.b !== f.b) E(`${w}.req debe ser de la misma rama`); }
  if (f.cash !== undefined) need(isNum(f.cash), w + '.cash');
  if (f.spirit !== null && f.spirit !== undefined) { need(isStr(f.spirit.name), w + '.spirit.name'); metricsObj(f.spirit.daily, w + '.spirit.daily'); need(isNum(f.spirit.money), w + '.spirit.money'); } else if (f.spirit === undefined) E(w + '.spirit debe ser objeto o null'); });
count('FOCUS_LINKS', A.FOCUS_LINKS, 6);
A.FOCUS_LINKS.forEach((l, i) => { need(isStr(l.t), `FOCUS_LINKS[${i}].t`); if (need(isFn(l.on), `FOCUS_LINKS[${i}].on debe ser función (s)=>...`)) try { l.on(S.metrics); } catch (e) { E(`FOCUS_LINKS[${i}].on lanza error`); } metricsObj(l.fx, `FOCUS_LINKS[${i}].fx`); });
// 12 shocks
count('SHOCK_POOL', A.SHOCK_POOL, 8);
A.SHOCK_POOL.forEach((x, i) => { const w = `SHOCK_POOL[${i}]`; ['cat','title','desc'].forEach(f => need(isStr(x[f]), `${w}.${f}`)); if (!PORTFOLIOS.includes(x.min)) E(`${w}.min: cartera no permitida "${x.min}"`); options(x.options, w); });
// 13 intl
count('INTL_ACTIONS', A.INTL_ACTIONS, 4); uniq(A.INTL_ACTIONS, 'id', 'INTL_ACTIONS');
A.INTL_ACTIONS.forEach(a => { need(isStr(a.id) && isStr(a.title), `INTL_ACTIONS[${a.id}] id/title`); ['cap','cost','rel','cd'].forEach(f => need(isNum(a[f]), `INTL_ACTIONS[${a.id}].${f} debe ser número`)); });
// 14 proyectos
count('PROJECTS', A.PROJECTS, 4); uniq(A.PROJECTS, 'id', 'PROJECTS');
A.PROJECTS.forEach(p => { const w = `PROJECTS[${p.id}]`; ['id','icon','title'].forEach(f => need(isStr(p[f]), `${w}.${f}`)); if (need(isObj(p.spirit), w + '.spirit')) { need(isStr(p.spirit.name), w + '.spirit.name'); metricsObj(p.spirit.daily, w + '.spirit.daily'); need(isNum(p.spirit.money), w + '.spirit.money'); }
  if (need(Array.isArray(p.phases) && p.phases.length >= 2 && p.phases.length <= 4, w + '.phases: entre 2 y 4 fases')) p.phases.forEach((f, i) => { need(isStr(f.n), `${w}.phases[${i}].n`); need(isNum(f.cost) && isNum(f.days), `${w}.phases[${i}] cost/days`); metricsObj(f.now, `${w}.phases[${i}].now`); metricsObj(f.run, `${w}.phases[${i}].run`); }); });
// 15 logros
count('ACHIEVEMENTS', A.ACHIEVEMENTS, 8); uniq(A.ACHIEVEMENTS, 'id', 'ACHIEVEMENTS');
A.ACHIEVEMENTS.forEach(a => { ['id','icon','title','desc'].forEach(f => need(isStr(a[f]), `ACHIEVEMENTS[${a.id}].${f}`)); if (need(isFn(a.ok), `ACHIEVEMENTS[${a.id}].ok debe ser función (s)=>...`)) try { a.ok(S); } catch (e) { if (!/FOCUS_BRANCHES|FOCUS_TREE/.test(e.message)) E(`ACHIEVEMENTS[${a.id}].ok lanza error: ${e.message}`); } });
// 16-17 banco central
need(JSON.stringify(A.BDE_GOVS.map(g => g.id).sort()) === JSON.stringify(['afin','indep','tecnico']), 'BDE_GOVS: los ids deben ser exactamente tecnico, afin, indep');
A.BDE_GOVS.forEach(g => { ['id','name','tag','desc'].forEach(f => need(isStr(g[f]), `BDE_GOVS[${g.id}].${f}`)); need(isNum(g.cred), `BDE_GOVS[${g.id}].cred`); });
count('BDE_ACTIONS', A.BDE_ACTIONS, 6); uniq(A.BDE_ACTIONS, 'id', 'BDE_ACTIONS');
A.BDE_ACTIONS.forEach(a => { const w = `BDE_ACTIONS[${a.id}]`; ['id','icon','label','desc'].forEach(f => need(isStr(a[f]), `${w}.${f}`)); ['cost','cd'].forEach(f => need(isNum(a[f]), `${w}.${f}`));
  if (need(isFn(a.when) && isFn(a.run), `${w}.when y .run deben ser funciones`)) { global.focusMetricAdd = () => {}; global.registerFinancialTransaction = () => {}; ctx.focusMetricAdd = () => {}; ctx.registerFinancialTransaction = () => {};
    try { a.when(); a.run({ cred: 50, shock: 0 }); } catch (e) { if (/is not defined/.test(e.message)) W(`${w}: usa algo del motor que el validador no simula (${e.message})`); else E(`${w}: when/run lanza error: ${e.message}`); } } });
report();
function report() {
  warn.forEach(m => console.log('  AVISO:', m));
  if (err.length) { console.log(`\n✗ ${err.length} error(es):`); err.forEach(m => console.log('  -', m)); process.exit(1); }
  console.log('\n✓ Fichero válido' + (warn.length ? ` (${warn.length} aviso/s)` : ''));
}
=====VALIDADOR-FIN=====
   ===================================================================== */

// =====================================================================
// 1. SCENARIOS — el país, su parlamento y sus partidos
//  · Clave y id del escenario: 'ACTUAL' (un escenario por país basta).
//  · Campos del escenario: id, title, desc (obligatorios);
//    treasury (M€ iniciales) y startYear (año del calendario) opcionales.
//  · Campos de partido (todos obligatorios): id, name, leader, seats,
//    baseSeats (= seats), minSeats, maxSeats (rango al que puede oscilar),
//    basePct (% de voto, suma ≈ 100), color (#rrggbb), isRegional
//    (true/false), ideology (texto), spectrumOrder (1 izq. … 7 der.),
//    redLines (ids de partidos con los que NO pactará, [] si ninguno).
// =====================================================================
const SCENARIOS = {
  ACTUAL: {
    id: 'ACTUAL',
    title: 'EJEMPLANDIA (2024)',
    desc: 'Parlamento de 300 escaños (mayoría absoluta: 151). Una frase o dos con el contexto político, económico y social que arranca la partida.',
    treasury: 20000,
    startYear: 2024,
    parties: [
      { id: 'PSO', name: 'Partido Socialista de Ejemplandia', leader: 'Líder Uno',    seats: 60,  baseSeats: 60,  minSeats: 30, maxSeats: 100, basePct: 20.0, color: '#ef4444', isRegional: false, ideology: 'Centroizquierda', spectrumOrder: 2, redLines: ['DER'] },
      { id: 'VER', name: 'Verdes Unidos',                     leader: 'Líder Dos',    seats: 25,  baseSeats: 25,  minSeats: 8,  maxSeats: 45,  basePct: 8.5,  color: '#22c55e', isRegional: false, ideology: 'Ecologismo',      spectrumOrder: 1, redLines: ['DER'] },
      { id: 'CEN', name: 'Centro Liberal',                    leader: 'Líder Tres',   seats: 70,  baseSeats: 70,  minSeats: 35, maxSeats: 110, basePct: 23.0, color: '#f59e0b', isRegional: false, ideology: 'Liberal',         spectrumOrder: 4, redLines: [] },
      { id: 'DER', name: 'Alianza Conservadora',              leader: 'Líder Cuatro', seats: 90,  baseSeats: 90,  minSeats: 45, maxSeats: 130, basePct: 30.0, color: '#3b82f6', isRegional: false, ideology: 'Derecha',         spectrumOrder: 6, redLines: ['VER'] },
      { id: 'REG', name: 'Frente Regional del Norte',         leader: 'Líder Cinco',  seats: 35,  baseSeats: 35,  minSeats: 15, maxSeats: 55,  basePct: 12.0, color: '#06b6d4', isRegional: true,  ideology: 'Regionalismo',    spectrumOrder: 3, redLines: [] },
      { id: 'OTR', name: 'Independientes y otros',            leader: 'Independiente', seats: 20, baseSeats: 20,  minSeats: 5,  maxSeats: 40,  basePct: 6.5,  color: '#64748b', isRegional: false, ideology: 'Varios',          spectrumOrder: 4, redLines: [] }
    ]
  }
};


// =====================================================================
// 2. DYNAMIC_EVENTS — decisiones de gobierno del país (≥ 15)
//  · id (texto único, MAYÚSCULAS_CON_GUIONES), category (texto libre),
//    title (MAYÚSCULAS), desc, condition: (m) => boolean donde m tiene
//    eco, est, emp, con, apr, mil (la mayoría: () => true), options (2-4).
//  · Opción: text, stats {métrica: ±n}, cost (M€; >0 gasta, <0 ingresa;
//    opcional), loyaltyImpact {idPartido: ±n}, news (titular de prensa).
// =====================================================================
const DYNAMIC_EVENTS = [
  {
    id: 'EJ_REFORMA_FISCAL',
    category: 'ECONOMÍA',
    title: 'REFORMA FISCAL INTEGRAL',
    desc: 'El Ministerio de Hacienda propone unificar los tramos del impuesto sobre la renta. Empresarios y sindicatos se enfrentan.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar la reforma con un tipo único', stats: { eco: +4, apr: -3, est: -2 }, cost: 0, loyaltyImpact: { CEN: +15, DER: +10, PSO: -20, VER: -15 }, news: 'El Gobierno aprueba la reforma fiscal con un tipo único entre protestas sindicales.' },
      { text: 'Mantener los tramos y subir las cotizaciones altas', stats: { eco: -2, apr: +4, est: +2 }, cost: 0, loyaltyImpact: { PSO: +15, VER: +10, DER: -20, CEN: -10 }, news: 'El Gobierno mantiene los tramos y grava más las rentas altas.' }
    ]
  },
  {
    id: 'EJ_CRISIS_PRECIOS',
    category: 'PRECIOS',
    title: 'ESPIRAL DE PRECIOS DE LA ALIMENTACIÓN',
    desc: 'Los precios de la cesta básica se disparan. Ejemplo de decisión que solo aparece si la economía va mal.',
    condition: (m) => m.eco < 40,
    options: [
      { text: 'Subsidiar los alimentos básicos', stats: { apr: +5, eco: -2 }, cost: 400, loyaltyImpact: { PSO: +10, REG: +5 }, news: 'El Gobierno subsidia la cesta básica para frenar la inflación.' },
      { text: 'Dejar actuar al mercado', stats: { apr: -6, est: -3, eco: +1 }, cost: 0, loyaltyImpact: { CEN: +10, DER: +5 }, news: 'El Gobierno rechaza intervenir los precios y crece el malestar.' }
    ]
  }
  // … añade hasta ≥ 15 decisiones variadas (economía, sociedad, exteriores, defensa, agua, energía, justicia…)
];


// =====================================================================
// 3. CAMPAIGN_HEADLINES — titulares de campaña electoral (≥ 8)
//  · id NUMÉRICO único, newspaper (medio del país, MAYÚSCULAS), headline
//    (MAYÚSCULAS), desc, options (2-3): { text, score (+5…+20),
//    textResult (qué ocurre al elegirla) }.
// =====================================================================
const CAMPAIGN_HEADLINES = [
  {
    id: 1,
    newspaper: 'EL DIARIO DE EJEMPLANDIA',
    headline: 'POLÉMICA POR EL PRECIO DE LA VIVIENDA',
    desc: 'La oposición te acusa de abandonar a los jóvenes. ¿Cómo respondes?',
    options: [
      { text: 'Prometer un plan de vivienda pública', score: +12, textResult: 'Tu promesa conecta con los jóvenes, aunque los economistas dudan de su coste.' },
      { text: 'Apelar a la libertad de mercado', score: +10, textResult: 'Respaldo de propietarios y empresarios, críticas de la calle.' }
    ]
  }
  // … hasta ≥ 8
];


// =====================================================================
// 4. PRESS_NEWS_BANK — noticias de prensa que obligan a decidir (≥ 8)
//  · id (texto único: 'NEWS_1'…), newspaper, headline, desc,
//    options (2-3): { text, stats, cost (opcional), news }.
// =====================================================================
const PRESS_NEWS_BANK = [
  {
    id: 'NEWS_1',
    newspaper: 'EL DIARIO DE EJEMPLANDIA',
    headline: 'SEQUÍA Y MALAS COSECHAS',
    desc: 'Varios años de sequía hunden el campo y el pan se encarece.',
    options: [
      { text: 'Importar cereal y subsidiar el pan', stats: { apr: +4, eco: -1 }, cost: 300, news: 'El Gobierno importa cereal y subsidia el pan para contener los precios.' },
      { text: 'Racionar el agua y dejar que ajuste el mercado', stats: { apr: -6, est: -3, eco: +1 }, news: 'El Gobierno raciona el agua y crece el malestar rural.' }
    ]
  }
  // … hasta ≥ 8
];


// =====================================================================
// 5. MINISTRY_DECISIONS_BANK — partidas que cada ministerio ejecuta solo
//  · Claves permitidas: las 13 carteras + infraestructuras.
//  · Cada una: array NO VACÍO de { title, cost (M€ >0), stats {…} }.
//  · ≥ 8 carteras con decisiones; defensa/economía/trabajo suelen llevar 3-6.
// =====================================================================
const MINISTRY_DECISIONS_BANK = {
  sanidad: [
    { title: 'Plan de refuerzo de la atención primaria', cost: 300, stats: { apr: +4, est: +2 } }
  ],
  educacion: [
    { title: 'Reforma curricular y becas', cost: 250, stats: { apr: +3, emp: +1 } }
  ],
  interior: [
    { title: 'Modernización de la policía', cost: 200, stats: { est: +3 } }
  ],
  defensa: [
    { title: 'Modernización de material militar', cost: 400, stats: { mil: +3, apr: -1 } }
  ],
  economia: [
    { title: 'Fondo de inversión nacional', cost: 350, stats: { eco: +3, emp: +2 } }
  ],
  trabajo: [
    { title: 'Plan de empleo juvenil', cost: 250, stats: { emp: +5, apr: +2 } }
  ],
  justicia: [
    { title: 'Digitalización de los tribunales', cost: 150, stats: { apr: +2, est: +1 } }
  ],
  exteriores: [
    { title: 'Ronda de cumbres bilaterales', cost: 100, stats: { eco: +1, apr: +1 } }
  ]
  // vivienda, territorio, transicion_ecologica, cultura, igualdad, infraestructuras: opcionales
};


// =====================================================================
// 6. HOUSING_EVENTS — protestas y tensiones sociales (≥ 2)
//  · Igual que DYNAMIC_EVENTS pero SIN condition. id texto ('HOUS_1'…).
//    Suelen tratar vivienda, protestas juveniles, turismo, desahucios…
// =====================================================================
const HOUSING_EVENTS = [
  {
    id: 'HOUS_1',
    category: 'PROTESTAS SOCIALES',
    title: 'JÓVENES EXIGEN VIVIENDA ASEQUIBLE',
    desc: 'Miles de jóvenes se manifiestan en la capital: los alquileres consumen la mitad de sus sueldos.',
    options: [
      { text: 'Lanzar un plan de vivienda pública', stats: { apr: +6, est: +3, eco: -1 }, cost: 500, loyaltyImpact: { PSO: +10, VER: +10, DER: -8 }, news: 'El Gobierno lanza un plan de vivienda pública tras las protestas.' },
      { text: 'Confiar en la oferta privada', stats: { apr: -6, est: -3, eco: +2 }, cost: 0, loyaltyImpact: { DER: +8, CEN: +5 }, news: 'El Gobierno descarta intervenir el mercado y las protestas se endurecen.' }
    ]
  },
  {
    id: 'HOUS_2',
    category: 'TENSIONES SOCIALES',
    title: 'EJEMPLO: DESAHUCIOS MASIVOS',
    desc: 'Segundo evento de ejemplo; sustitúyelo por uno del país.',
    options: [
      { text: 'Moratoria de desahucios', stats: { apr: +4, eco: -2 }, cost: 150, loyaltyImpact: { PSO: +8 }, news: 'El Gobierno decreta una moratoria de desahucios.' },
      { text: 'Dejar que decidan los tribunales', stats: { apr: -4, est: -2 }, cost: 0, loyaltyImpact: { DER: +6 }, news: 'El Gobierno deja los desahucios en manos de los tribunales.' }
    ]
  }
];


// =====================================================================
// 7. REAL_MINISTERS — personas reales (o creíbles) por cartera (≥ 12)
//  · id único (apellido_partido), name, party (id de SCENARIOS),
//    portfolio (una de las 13 carteras), desc, pros, cons (textos cortos
//    con el efecto) y effects { métrica: ±n } (normalmente ±0.5…±2.5).
//  · Cubre las 13 carteras; varias personas por cartera si hay partidos
//    distintos en la coalición. Los técnicos sin partido usan 'OTR'.
// =====================================================================
const REAL_MINISTERS = [
  // --- ECONOMÍA ---
  { id: 'perez_cen', name: 'Ana Pérez', party: 'CEN', portfolio: 'economia',
    desc: '+1.5% Economía',
    pros: '+1.5% Economía',
    cons: '-1.0% Aprobación (ajustes impopulares)',
    effects: { eco: 1.5, apr: -1.0 } },
  // --- DEFENSA ---
  { id: 'garcia_otr', name: 'Luis García', party: 'OTR', portfolio: 'defensa',
    desc: '+2.0% Ejército',
    pros: '+2.0% Ejército',
    cons: '-0.5% Aprobación',
    effects: { mil: 2.0, apr: -0.5 } }
  // … interior, sanidad, educacion, trabajo, justicia, exteriores, vivienda, territorio,
  //   transicion_ecologica, cultura, igualdad
];


// =====================================================================
// 8. GOAL_POOL — misiones del mandato (9, ids fijos recomendados)
//  · id, icon, title, desc, check: (s) => boolean
//    con s.metrics.{eco,est,emp,con,apr,mil} y s.treasury (M€).
//  · Ajusta títulos al país y el umbral de caja a su tesorería inicial.
// =====================================================================
const GOAL_POOL = [
  { id: 'eco',     icon: 'fa-chart-line',     title: 'Milagro Económico',        desc: 'Mantén la Economía ≥ 70%',             check: s => s.metrics.eco >= 70 },
  { id: 'est',     icon: 'fa-shield-halved',  title: 'Paz Social',               desc: 'Mantén la Estabilidad ≥ 65%',          check: s => s.metrics.est >= 65 },
  { id: 'apr',     icon: 'fa-heart',          title: 'Gobierno Querido',         desc: 'Mantén la Aprobación ≥ 65%',           check: s => s.metrics.apr >= 65 },
  { id: 'emp',     icon: 'fa-briefcase',      title: 'Pleno Empleo',             desc: 'Mantén el Empleo ≥ 70%',               check: s => s.metrics.emp >= 70 },
  { id: 'mil',     icon: 'fa-person-military-pointing', title: 'Cuarteles en Calma', desc: 'Mantén la fuerza del Ejército ≥ 60%', check: s => s.metrics.mil >= 60 },
  { id: 'caja',    icon: 'fa-vault',          title: 'Superávit',                desc: 'Acumula una tesorería ≥ 30.000 M€',    check: s => (Number(s.treasury) || 0) >= 30000 },
  { id: 'confia',  icon: 'fa-crown',          title: 'Confianza Institucional',  desc: 'Confianza ≥ 75%',                      check: s => s.metrics.con >= 75 },
  { id: 'doble',   icon: 'fa-scale-balanced', title: 'Doble Confianza',          desc: 'Aprobación ≥ 60% y Estabilidad ≥ 60%', check: s => s.metrics.apr >= 60 && s.metrics.est >= 60 },
  { id: 'todo',    icon: 'fa-star',           title: 'Ejemplandia Equilibrada',  desc: 'Todas las métricas ≥ 55%',             check: s => Object.values(s.metrics).every(v => v >= 55) }
];


// =====================================================================
// 9. GOAL_ACTIONS — acciones de gobierno (≥ 8)
//  · id, icon, title, cap (capital político que cuesta, 0-30), cost (M€),
//    cd (días de espera), fx {métrica: ±n}, news; gain (M€ que ingresa,
//    opcional: acciones de recorte/ingreso con cost 0).
// =====================================================================
const GOAL_ACTIONS = [
  { id: 'tv',     icon: 'fa-tv',        title: 'Comparecencia televisada', cap: 15, cost: 0,   cd: 30, fx: { apr: 6, est: 2 }, news: 'El jefe de Gobierno comparece en prime time y remonta en las encuestas.' },
  { id: 'pacto',  icon: 'fa-handshake', title: 'Pacto social y político',  cap: 25, cost: 0,   cd: 60, fx: { est: 6, apr: 3 }, news: 'Gobierno, sindicatos y oposición firman un pacto histórico.' },
  { id: 'empleo', icon: 'fa-hammer',    title: 'Plan de choque del empleo', cap: 10, cost: 200, cd: 40, fx: { emp: 8, eco: 3 }, news: 'El Gobierno lanza un plan de choque contra el paro.' },
  { id: 'ahorro', icon: 'fa-piggy-bank', title: 'Recorte del gasto público', cap: 0, cost: 0,  cd: 60, fx: { apr: -5, est: -2 }, gain: 400, news: 'Austeridad: el Gobierno recorta gasto y ahorra 400 M€, a costa de la calle.' }
  // … hasta ≥ 8 (Bruselas/cumbre exterior, reforma del ejército, etc.)
];


// =====================================================================
// 10. FOCUS_TREE — árbol de focos nacionales (EXACTAMENTE 16: 4 ramas × 4)
//  · id, b (eco|soc|seg|dip), title, days (duración), req (id del foco
//    anterior de la MISMA rama; el primero de cada rama no lleva),
//    now {métrica: ±n} (efecto inmediato), cash (M€ al completarlo,
//    opcional), spirit: null | { name, daily {métrica: 0.01-0.06 por día},
//    money (M€ al MES; + ingresa, − gasta) }.
//  · Una cadena de 4 por rama: 365, 420, 480, 540 días.
// =====================================================================
const FOCUS_TREE = [
  { id: 'e1', b: 'eco', title: 'Reforma fiscal',            days: 365, now: { eco: 4 },            spirit: { name: 'Hacienda Eficiente', daily: {},                     money: 100 } },
  { id: 'e2', b: 'eco', title: 'Plan industrial',           days: 420, req: 'e1', now: { emp: 3 },  spirit: { name: 'Polos Industriales', daily: { eco: .05, emp: .04 }, money: 0 } },
  { id: 'e3', b: 'eco', title: 'Fondos exteriores',         days: 480, req: 'e2', now: { apr: 2 }, cash: 1000, spirit: null },
  { id: 'e4', b: 'eco', title: 'Marca país',                days: 540, req: 'e3', now: {},         spirit: { name: 'Marca Ejemplandia',  daily: { eco: .06, apr: .03 }, money: 120 } },
  { id: 's1', b: 'soc', title: 'Protección social',         days: 365, now: { apr: 3 },            spirit: { name: 'Cobertura Universal', daily: { est: .03 },          money: -60 } },
  { id: 's2', b: 'soc', title: 'Pacto educativo',           days: 420, req: 's1', now: {},         spirit: { name: 'Capital Humano',      daily: { emp: .04, eco: .02 }, money: -50 } },
  { id: 's3', b: 'soc', title: 'Vivienda y ciudades',       days: 480, req: 's2', now: { apr: 4 }, spirit: { name: 'Acceso a la Vivienda', daily: { apr: .05 },         money: -60 } },
  { id: 's4', b: 'soc', title: 'Estado social',             days: 540, req: 's3', now: { est: 4 }, spirit: { name: 'Bienestar Social',    daily: { est: .05, apr: .04 }, money: -90 } },
  { id: 'g1', b: 'seg', title: 'Modernización policial',    days: 365, now: { est: 4 },            spirit: { name: 'Policía Moderna',     daily: { est: .03 },          money: -40 } },
  { id: 'g2', b: 'seg', title: 'Ciberseguridad nacional',   days: 420, req: 'g1', now: {},         spirit: { name: 'Escudo Digital',      daily: { est: .03, eco: .02 }, money: -40 } },
  { id: 'g3', b: 'seg', title: 'Fuerzas armadas profesionales', days: 480, req: 'g2', now: { mil: 6 }, spirit: { name: 'Tropa Profesional', daily: { mil: .05 },         money: -70 } },
  { id: 'g4', b: 'seg', title: 'Pacto de defensa con un aliado', days: 540, req: 'g3', now: { mil: 4 }, spirit: { name: 'Socio Estratégico', daily: { mil: .04, est: .03 }, money: -80 } },
  { id: 'd1', b: 'dip', title: 'Diplomacia regional',       days: 365, now: { apr: 2 },            spirit: { name: 'Voz Regional',        daily: { apr: .03 },          money: 0 } },
  { id: 'd2', b: 'dip', title: 'Eje con los vecinos',       days: 420, req: 'd1', now: {}, cash: 800, spirit: { name: 'Socio Fiable',       daily: { eco: .04 },          money: 0 } },
  { id: 'd3', b: 'dip', title: 'Asociación con grandes potencias', days: 480, req: 'd2', now: { est: 3, mil: 3 }, spirit: null },
  { id: 'd4', b: 'dip', title: 'Liderazgo internacional',   days: 540, req: 'd3', now: {},         spirit: { name: 'Potencia Regional',   daily: { apr: .05, eco: .04 }, money: 80 } }
];


// =====================================================================
// 11. FOCUS_LINKS — efectos automáticos entre métricas (≥ 6; son genéricos)
//  · t (texto), on: (s) => boolean con s = métricas {eco,est,emp,con,apr,mil},
//    fx {métrica: ±0.03-0.08 por día}.
// =====================================================================
const FOCUS_LINKS = [
  { t: 'Economía hundida destruye empleo',   on: s => s.eco < 40, fx: { emp: -.08 } },
  { t: 'Economía fuerte crea empleo',        on: s => s.eco > 65, fx: { emp: .04 } },
  { t: 'Paro alto erosiona la aprobación',   on: s => s.emp < 40, fx: { apr: -.08, est: -.04 } },
  { t: 'Pleno empleo mejora la aprobación',  on: s => s.emp > 65, fx: { apr: .04 } },
  { t: 'Inestabilidad frena la economía',    on: s => s.est < 40, fx: { eco: -.06 } },
  { t: 'Impopularidad alimenta el malestar', on: s => s.apr < 35, fx: { est: -.05 } },
  { t: 'Ejército descontento desestabiliza', on: s => s.mil < 30, fx: { est: -.04 } },
  { t: 'Estabilidad alta atrae inversión',   on: s => s.est > 70, fx: { eco: .03 } }
];


// =====================================================================
// 12. SHOCK_POOL — crisis externas (≥ 8)
//  · cat (categoría), min (cartera que gestiona la crisis: una de las 13),
//    title (MAYÚSCULAS), desc, options (2): { text, cost, stats, news }.
// =====================================================================
const SHOCK_POOL = [
  { cat: 'EMERGENCIAS', min: 'interior', title: 'INCENDIOS FORESTALES', desc: 'Varias provincias arden a la vez y piden ayuda urgente al Estado.',
    options: [
      { text: 'Desplegar medios extraordinarios', cost: 200, stats: { est: 3, apr: 2 },  news: 'El Estado despliega medios extraordinarios y controla los incendios.' },
      { text: 'Dejar que actúen las provincias',  cost: 0,   stats: { est: -4, apr: -5 }, news: 'Las provincias quedan solas ante las llamas y crece la indignación.' }
    ] },
  { cat: 'LABORAL', min: 'trabajo', title: 'HUELGA GENERAL', desc: 'Los sindicatos convocan un paro nacional contra la política laboral.',
    options: [
      { text: 'Abrir mesa de negociación', cost: 100, stats: { emp: 3, apr: 2, eco: -2 },  news: 'El Gobierno abre una mesa de negociación y se desconvoca el paro.' },
      { text: 'Mantener la postura',       cost: 0,   stats: { est: -5, apr: -6, eco: -3 }, news: 'El paro general paraliza el país mientras el Gobierno mantiene su postura.' }
    ] }
  // … hasta ≥ 8 (corrupción/justicia, mercados/economia, militar/defensa, energía/transicion_ecologica, cibernética…)
];


// =====================================================================
// 13. INTL_ACTIONS — acciones de relación exterior (≥ 4)
//  · id, title, cap (capital político), cost (M€; negativo = ingresa),
//    rel (puntos de relación que gana el país destino, 2-12), cd (días).
// =====================================================================
const INTL_ACTIONS = [
  { id: 'visit',  title: 'Visita oficial',            cap: 10, cost: 0,    rel: 12, cd: 40 },
  { id: 'trade',  title: 'Acuerdo comercial',         cap: 0,  cost: 80,   rel: 8,  cd: 30 },
  { id: 'pesca',  title: 'Renovar un acuerdo sectorial', cap: 3, cost: -300, rel: 3, cd: 120 },
  { id: 'visados', title: 'Negociar visados',         cap: 3,  cost: 0,    rel: 2,  cd: 120 }
];


// =====================================================================
// 14. PROJECTS — megaproyectos de Estado (≥ 4)
//  · id, icon, title, spirit { name, daily {métrica}, money (M€/mes) }
//    (el espíritu se activa al terminar), phases (2-4): { n (nombre),
//    cost (M€), days, now {efecto al terminar la fase}, run {efecto
//    diario mientras dura} }.
//  · Coste total de un proyecto: 15-50 % de la tesorería inicial.
// =====================================================================
const PROJECTS = [
  { id: 'tren', icon: 'fa-train', title: 'Alta velocidad entre las dos mayores ciudades', spirit: { name: 'Red Ferroviaria', daily: { eco: .04, emp: .02 }, money: 40 },
    phases: [
      { n: 'Estudios, trazado y licitación',      cost: 200,  days: 30,  now: {},                 run: {} },
      { n: 'Obra civil y vías',                   cost: 1500, days: 120, now: { emp: 2, eco: 1 }, run: { emp: .02, eco: .01 } },
      { n: 'Material móvil y puesta en servicio', cost: 600,  days: 45,  now: { eco: 2, emp: 1 }, run: {} }
    ] },
  { id: 'puerto', icon: 'fa-ship', title: 'Gran puerto de aguas profundas', spirit: { name: 'Hub Marítimo', daily: { eco: .05, emp: .02 }, money: 60 },
    phases: [
      { n: 'Licitación y dragado',         cost: 150, days: 30,  now: {},                run: {} },
      { n: 'Diques, muelles y terminales', cost: 700, days: 110, now: { emp: 1, eco: 1 }, run: { emp: .015, eco: .01 } }
    ] }
  // … hasta ≥ 4 (agua/energía, digital, vivienda, deporte/Mundial, aeropuerto…)
];


// =====================================================================
// 15. ACHIEVEMENTS — logros (≥ 8; casi todos son genéricos)
//  · id, icon, title, desc, ok: (s) => boolean. Estado disponible:
//    s.goals.done (nº misiones), s.focus.done (array ids), s.proj.done
//    (array), s.treasury (M€), s.metrics {…}, s.debt.amount, s.bde.cred,
//    s.campaign.history (array), s.daysInOffice. Global: FOCUS_BRANCHES.
// =====================================================================
const ACHIEVEMENTS = [
  { id: 'm1',   icon: 'fa-flag',            title: 'Primer Mandato',        desc: 'Cumple tu primera misión',             ok: s => s.goals && s.goals.done >= 1 },
  { id: 'm5',   icon: 'fa-list-check',      title: 'Gestor Eficaz',         desc: 'Cumple 5 misiones',                    ok: s => s.goals && s.goals.done >= 5 },
  { id: 'f1',   icon: 'fa-diagram-project', title: 'Visión de Estado',      desc: 'Completa un foco nacional',            ok: s => s.focus && s.focus.done.length >= 1 },
  { id: 'fb',   icon: 'fa-sitemap',         title: 'Doctrina Completa',     desc: 'Completa una rama entera de focos',    ok: s => s.focus && Object.keys(FOCUS_BRANCHES).some(b => FOCUS_TREE.filter(f => f.b === b).every(f => s.focus.done.includes(f.id))) },
  { id: 'p3',   icon: 'fa-helmet-safety',   title: 'Constructor del País',  desc: 'Termina 3 proyectos de Estado',        ok: s => s.proj && s.proj.done.length >= 3 },
  { id: 'rich', icon: 'fa-vault',           title: 'Caja Fuerte',           desc: 'Llega a 30.000 M€ en Tesorería',       ok: s => (Number(s.treasury) || 0) >= 30000 },
  { id: 'all',  icon: 'fa-star',            title: 'País de Primera',       desc: 'Todas las métricas ≥ 70% a la vez',    ok: s => s.metrics && ['eco', 'est', 'emp', 'apr', 'mil'].every(k => s.metrics[k] >= 70) },
  { id: 'cred', icon: 'fa-building-columns', title: 'Banco Creíble',        desc: 'Credibilidad del banco central ≥ 85%', ok: s => s.bde && s.bde.cred >= 85 },
  { id: 'surv', icon: 'fa-shield',          title: 'Superviviente',         desc: 'Completa una legislatura',             ok: s => s.campaign && s.campaign.history.length >= 1 },
  { id: 'year', icon: 'fa-calendar-check',  title: 'Primer Año de Mandato', desc: 'Cumple un año en el poder',            ok: s => (s.daysInOffice || 0) >= 365 }
];


// =====================================================================
// 16. BDE_GOVS — gobernadores del banco central (EXACTAMENTE 3, ids fijos)
//  · id: tecnico | afin | indep. name, tag (etiqueta corta), cred
//    (credibilidad inicial: ≈ +10 / −10 / +15), desc.
// =====================================================================
const BDE_GOVS = [
  { id: 'tecnico', name: 'Gobernadora Técnica', tag: 'Tecnócrata ortodoxa', cred: 10,  desc: 'Prioriza la inflación y el equilibrio exterior. Los mercados la adoran, la calle menos.' },
  { id: 'afin',    name: 'Gobernador Afín',     tag: 'Afín al Gobierno',    cred: -10, desc: 'Informes amables y crédito fácil; los inversores desconfían.' },
  { id: 'indep',   name: 'Gobernador Histórico', tag: 'Independiente',      cred: 15,  desc: 'Lleva años al frente del banco; los mercados le respetan y sus informes son sobrios.' }
];


// =====================================================================
// 17. BDE_ACTIONS — acciones del banco central (≥ 6)
//  · id, icon, label, desc, cost (M€), cd (días), when: () => true,
//    run: B => {…}. Dentro de run se puede usar:
//      B.cred (credibilidad 0-100), B.shock (presión de mercado),
//      focusMetricAdd('eco', n)  → suma n puntos a una métrica,
//      registerFinancialTransaction('concepto', M€, 'economia') → ingresa
//      (+) o gasta (−) dinero.
// =====================================================================
const BDE_ACTIONS = [
  { id: 'rate_down', icon: 'fa-arrow-trend-down', label: 'Bajar el tipo director (−25 pb)', desc: 'Abarata el crédito: más actividad y empleo, algo más de inflación.', cost: 0, cd: 45, when: () => true,
    run: B => { B.cred -= 1; focusMetricAdd('eco', 2); focusMetricAdd('emp', 1); } },
  { id: 'rate_up', icon: 'fa-arrow-trend-up', label: 'Subir el tipo director (+25 pb)', desc: 'Frena la inflación y refuerza la moneda, a costa de la actividad.', cost: 0, cd: 45, when: () => true,
    run: B => { B.cred += 2; B.shock -= 10; focusMetricAdd('eco', -1); focusMetricAdd('apr', -1); focusMetricAdd('est', 1); } },
  { id: 'pymes', icon: 'fa-store', label: 'Programa de finanzas para pymes', desc: 'Crédito garantizado a las pymes (−300 M€).', cost: 300, cd: 75, when: () => true,
    run: B => { B.cred += 1; focusMetricAdd('eco', 2); focusMetricAdd('emp', 3); } },
  { id: 'informe', icon: 'fa-file-lines', label: 'Encargar un informe de solvencia', desc: 'Auditoría externa que calma a los mercados (−150 M€).', cost: 150, cd: 60, when: () => true,
    run: B => { B.cred += 4; B.shock -= 15; } },
  { id: 'dividendo', icon: 'fa-hand-holding-dollar', label: 'Adelantar el beneficio del banco central', desc: 'Liquidez inmediata (+500 M€), pero huele a presión política.', cost: 0, cd: 180, when: () => true,
    run: B => { B.cred -= 10; B.shock += 20; registerFinancialTransaction('Adelanto de beneficios del banco central', 500, 'economia'); } },
  { id: 'monetiza', icon: 'fa-print', label: 'Que el banco central financie el déficit', desc: 'Financiación monetaria de +900 M€. Inflación y desconfianza garantizadas.', cost: 0, cd: 150, when: () => true,
    run: B => { B.cred -= 15; B.shock += 60; focusMetricAdd('apr', -4); focusMetricAdd('eco', -2); registerFinancialTransaction('Financiación monetaria del banco central', 900, 'economia'); } }
];


// =====================================================================
// OPCIONAL (bórralo si no lo usas) — globales extra que el motor reconoce
//
// COUNTRY_DECISIONS — mazo propio de «Decisión N.º x». Si no existe, el
//   motor usa DYNAMIC_EVENTS. Formato: array de decisiones como las de
//   DYNAMIC_EVENTS (id, category, title, desc, options) u objeto
//   { ACTUAL: [ ... ] } por id de escenario.
//
// COUNTRY_MAP — mapa del país (solo si hay trazados SVG reales):
//   const COUNTRY_MAP = { title: 'Mapa de Regiones de Ejemplandia',
//     paths: [ { id: 'R1', name: 'Región 1', d: 'M10 10 L ... Z',
//                desc: 'Texto del tooltip', spectrumPref: 3 } ] };
//   (spectrumPref 1-7: ideología que predomina; viewBox fijo 0 0 500 400)
// =====================================================================
