// =====================================================================
//  MARRUECOS — MONCLOA STRATEGY (versión con datos reales a 10-nov-2026)
//  Basado en pais-marruecos.js + marruecos.js, adaptado a plantilla-pais.js.
//  Cárgalo ANTES del script principal con una etiqueta <script> normal.
//
//  QUÉ CAMBIA RESPECTO A LA VERSIÓN ANTERIOR
//  · Escenario ACTUAL = elecciones del 23-09-2026 (PAM 97, RNI 66, PI 65,
//    PJD 54, MP 29, USFP 26, PPS 19, UC 17, MDS 8, Alianza de la Izquierda 8,
//    otros 6). Mayoría del Gobierno: PAM+PI+USFP+PPS = 207. El escenario de
//    2021 se conserva como ELECCIONES_2021.
//  · Tesorería = cargas totales del Estado (LF 2026) en M€ a 10,988 MAD/€.
//  · Decretos (DYNAMIC_EVENTS), decisiones ministeriales y noticias
//    reescritos con medidas reales (PLF 2027, Sáhara, GenZ 212, etc.).
//  · Ministros = Gobierno El Mansouri (16-10-2026). Partidos marcados OTR
//    cuando no están confirmados (Koukouss, Rahhou) o son técnicos del
//    Palacio: VERIFICAR.
//  · Constantes nuevas: COUNTRY_PROFILE, FISCAL_BASELINE, MAP_MARRUECOS,
//    MILITARY_MAP y renderMapaMarruecos() (ver sección 0).
//  · cost > 0 gasta tesorería; cost < 0 ingresa. Todas las cantidades en M€.
//  · 'palace' no existe como métrica base: se usa `con` (VERIFICAR en el motor).
//  · Cartera ministerial -> lista cerrada: Equipamiento/Energía -> transicion_ecologica ·
//    Industria/Digital -> economia · Agricultura -> territorio · Transporte -> infraestructuras ·
//    Empleo -> trabajo · Ordenación del territorio/Vivienda -> vivienda · Familia -> igualdad ·
//    Habices -> cultura.
// =====================================================================

// =====================================================================
// 0. PERFIL DEL PAÍS, DATOS FISCALES REALES, MAPA Y MAPA MILITAR
//    (constantes nuevas; el motor debe LEERLAS para dejar de mostrar
//     «España» y «UE». Ver notas de integración al final del archivo.)
// =====================================================================
const COUNTRY_PROFILE = {
  id: 'MA',
  name: 'Marruecos',
  demonym: 'marroquí',
  capital: 'Rabat',
  headOfState: 'Rey Mohammed VI',
  headOfGovernmentTitle: 'Jefa del Gobierno',        // Fatima Ezzahra El Mansouri (PAM), desde el 29-09-2026
  parliament: 'Cámara de Representantes (395 escaños; mayoría absoluta: 198)',
  armedForces: 'Fuerzas Armadas Reales (FAR)',
  currency: 'MAD',
  eurToMad: 10.988,                                   // Bank Al-Maghrib, 4-nov-2026
  inEU: false,                                        // Marruecos NO es miembro de la UE
  euStatus: 'Estatuto avanzado y acuerdos de asociación con la UE (no miembro)',
  intlSectionTitle: 'Relaciones con la UE',
  mapId: 'MA',
  militaryMapId: 'MA'
};

// Datos reales (fuentes: Ley de Finanzas 2026, TGR, Bank Al-Maghrib, PLF 2027).
// M MAD = millones de dírhams; M€ = millones de euros a 10,988 MAD/€. Cifras de PIB y deuda: aproximadas.
const FISCAL_BASELINE = {
  asOf: '2026-11-10',
  eurToMad: 10.988,
  lf2026: {
    cargasTotales_MMAD: 761300,   cargasTotales_Meur: 69284,
    presupuestoGeneral_MMAD: 527600, presupuestoGeneral_Meur: 48016,
    cuentasEspecialesTesoro_MMAD: 167500, cuentasEspecialesTesoro_Meur: 15243,
    amortizacionDeudaMLT_MMAD: 64200, amortizacionDeudaMLT_Meur: 5843,
    ingresosOrdinarios_MMAD: 432800, ingresosOrdinarios_Meur: 39388,
    inversionPresupuestoGeneral_MMAD: 114800, inversionPresupuestoGeneral_Meur: 10447,
    deficitObjetivo_pctPIB: 3.0
  },
  pibAprox_Meur: 165800,          // ≈ 1.822.000 M MAD (inversión 114.800 M MAD = 6,3 % del PIB)
  deudaTesoro: { pctPIB_2026: 65.9, pctPIB_2027_obj: 65.0, pctPIB_2029_obj: 63.0, importeAprox_Meur: 109265 },
  deficit: { cierre2025_MMAD: 61600, finSep2026_MMAD: 33300, finSep2026_Meur: 3030 },
  reservasOficiales_MMAD: 496800, // 24-jul-2026
  tipoInterbancario_pct: 2.27,
  crecimiento: { pib2026_est_pct: 5.3, pib2027_hip_pct: 4.1 },
  plf2027: {
    reformaIRPF_MMAD: 5500, ayudaSocialMinima_DH: [500, 600, 1000], ayudaSocialExtra_MMAD: 3000,
    pensionMinima_DH: 1700, facturaElectricidad_MMAD: 2800, compensacion_MMAD: 19400,
    salud_MMAD: 45400, nuevosPuestos: 34454, ayudasSocioeconomicas_MMAD: 62000
  }
};

const MAP_MARRUECOS = {
"viewBox": [
0,
0,
678,
722
],
"regions": [
{
"id": "TTA",
"name": "Tánger-Tetuán-Alhucemas",
"capital": "Tánger",
"d": "M470.3,18.9 L494.3,13.8 L507.7,19.3 L540.2,45.1 L570.6,46.0 L566.6,59.8 L519.9,64.4 L495.5,66.7 L459.0,55.2 L463.0,41.4 Z"
},
{
"id": "ORI",
"name": "Oriental",
"capital": "Uchda",
"d": "M570.6,46.0 L591.8,41.4 L620.6,50.6 L639.7,72.7 L641.7,133.4 L660.0,188.6 L609.2,188.6 L588.9,170.2 L560.5,147.2 L560.5,92.0 L566.6,59.8 Z"
},
{
"id": "FME",
"name": "Fez-Mequínez",
"capital": "Fez",
"d": "M519.9,64.4 L566.6,59.8 L560.5,92.0 L560.5,147.2 L548.3,156.4 L511.8,151.8 L487.4,135.7 L471.1,115.0 L475.2,87.4 L495.5,66.7 Z"
},
{
"id": "RSK",
"name": "Rabat-Salé-Kenitra",
"capital": "Rabat",
"d": "M459.0,55.2 L495.5,66.7 L475.2,87.4 L471.1,115.0 L450.8,121.9 L422.4,118.7 L422.4,108.1 L432.6,99.8 L439.9,89.2 Z"
},
{
"id": "BMK",
"name": "Beni Mellal-Jenifra",
"capital": "Beni Mellal",
"d": "M450.8,121.9 L471.1,115.0 L487.4,135.7 L511.8,151.8 L499.6,179.4 L475.2,197.8 L450.8,207.0 L422.4,193.2 L410.2,170.2 L418.3,149.5 L430.5,138.0 Z"
},
{
"id": "CAS",
"name": "Casablanca-Settat",
"capital": "Casablanca",
"d": "M422.4,108.1 L422.4,118.7 L450.8,121.9 L430.5,138.0 L418.3,149.5 L410.2,170.2 L385.8,172.5 L357.4,172.5 L340.4,164.7 L365.5,135.7 L401.3,119.6 Z"
},
{
"id": "MAR",
"name": "Marrakech-Safí",
"capital": "Marrakech",
"d": "M340.4,164.7 L357.4,172.5 L385.8,172.5 L410.2,170.2 L422.4,193.2 L450.8,207.0 L430.5,225.4 L414.3,239.2 L369.6,239.2 L345.2,236.9 L314.8,236.9 L314.0,216.2 L335.5,179.4 Z"
},
{
"id": "DRT",
"name": "Draa-Tafilalet",
"capital": "Errachidia",
"d": "M450.8,207.0 L475.2,197.8 L499.6,179.4 L511.8,151.8 L548.3,156.4 L560.5,147.2 L588.9,170.2 L609.2,188.6 L660.0,188.6 L641.7,239.2 L588.9,280.6 L532.1,280.6 L491.4,292.1 L434.6,289.8 L430.5,266.8 L414.3,239.2 L430.5,225.4 Z"
},
{
"id": "SMA",
"name": "Souss-Masa",
"capital": "Agadir",
"d": "M314.8,236.9 L345.2,236.9 L369.6,239.2 L414.3,239.2 L430.5,266.8 L434.6,289.8 L442.7,308.2 L402.1,322.0 L358.6,344.1 L329.0,322.0 L306.6,305.9 L309.9,256.2 Z"
},
{
"id": "GUE",
"name": "Guelmim-Uad Nun",
"capital": "Guelmim",
"d": "M306.6,305.9 L329.0,322.0 L358.6,344.1 L358.6,392.4 L320.9,377.2 L264.0,368.0 L243.7,368.0 L259.9,358.8 L297.7,313.7 Z"
},
{
"id": "LAA",
"name": "El Aaiún-Saguia el Hamra",
"capital": "El Aaiún",
"d": "M243.7,368.0 L264.0,368.0 L320.9,377.2 L358.6,392.4 L358.6,409.4 L223.4,515.2 L182.8,492.2 L109.7,483.0 L121.8,464.6 L174.6,416.3 L185.6,380.0 Z"
},
{
"id": "DAK",
"name": "Dajla-Río de Oro",
"capital": "Dajla",
"d": "M109.7,483.0 L182.8,492.2 L223.4,515.2 L178.7,517.5 L178.7,684.0 L18.3,684.0 L40.6,630.2 L63.8,575.0 L101.5,515.2 Z"
}
],
"cities": [
{
"name": "Rabat",
"x": 433.0,
"y": 100.3
},
{
"name": "Casablanca",
"x": 402.5,
"y": 121.0
},
{
"name": "Marrakech",
"x": 385.8,
"y": 210.2
},
{
"name": "Tánger",
"x": 475.2,
"y": 20.2
},
{
"name": "Fez",
"x": 507.7,
"y": 99.8
},
{
"name": "Agadir",
"x": 320.9,
"y": 265.9
},
{
"name": "El Aaiún",
"x": 174.6,
"y": 416.3
},
{
"name": "Dajla",
"x": 63.8,
"y": 575.0
},
{
"name": "Uchda",
"x": 633.6,
"y": 69.9
},
{
"name": "Errachidia",
"x": 530.8,
"y": 196.4
},
{
"name": "Guelmim",
"x": 302.2,
"y": 332.1
},
{
"name": "Ceuta (ES)",
"x": 494.7,
"y": 14.3
},
{
"name": "Melilla (ES)",
"x": 591.4,
"y": 41.9
}
]
};

// Capa militar (esquemática, sin valor cartográfico: VERIFICAR antes de usar como dato real).
const MILITARY_MAP = {
"berma": "M349.3,381.8 L316.8,407.1 L272.1,446.2 L223.4,496.8 L178.7,538.2 L174.6,625.6 L32.5,680.8",
"fronteraArgelia": "M620.6,50.6 L639.7,72.7 L641.7,133.4 L660.0,188.6 L641.7,239.2 L588.9,280.6 L532.1,280.6 L491.4,292.1 L434.6,289.8 L442.7,308.2 L402.1,322.0 L358.6,344.1 L358.6,392.4",
"puntos": [
{
"id": "ESTRECHO",
"name": "Estrecho de Gibraltar y Tánger Med",
"kind": "puerto",
"x": 487.4,
"y": 14.3,
"note": "Control marítimo del Estrecho; enlace con la UE."
},
{
"id": "CEUTA",
"name": "Ceuta (administración española)",
"kind": "enclave",
"x": 494.7,
"y": 14.3,
"note": "Frontera terrestre con España."
},
{
"id": "MELILLA",
"name": "Melilla (administración española)",
"kind": "enclave",
"x": 591.4,
"y": 41.9,
"note": "Frontera terrestre con España."
},
{
"id": "GUERGUERAT",
"name": "Paso de Guerguerat",
"kind": "frontera",
"x": 22.3,
"y": 684.0,
"note": "Frontera con Mauritania."
},
{
"id": "BENGUERIR",
"name": "Base aérea de Ben Guerir",
"kind": "base_aerea",
"x": 387.9,
"y": 182.6,
"note": "Uso en ejercicios como African Lion. VERIFICAR."
},
{
"id": "DAKHLA",
"name": "Puerto atlántico de Dajla",
"kind": "puerto",
"x": 63.8,
"y": 575.0,
"note": "Proyecto estratégico del Sur."
}
]
};

// Renderiza el mapa de Marruecos como SVG (regiones, ciudades y, opcionalmente, la capa militar).
function renderMapaMarruecos(opts) {
  opts = opts || {};
  const vb = MAP_MARRUECOS.viewBox;
  const fill = opts.fills || {};
  let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + vb[2] + ' ' + vb[3] + '" role="img" aria-label="Mapa de Marruecos">';
  MAP_MARRUECOS.regions.forEach(function (r) {
    s += '<path data-region="' + r.id + '" d="' + r.d + '" fill="' + (fill[r.id] || '#cbd5e1') + '" stroke="#0f172a" stroke-width="1" stroke-linejoin="round"><title>' + r.name + ' (' + r.capital + ')</title></path>';
  });
  if (opts.cities !== false) MAP_MARRUECOS.cities.forEach(function (c) {
    s += '<circle cx="' + c.x + '" cy="' + c.y + '" r="2.5" fill="#0f172a"/><text x="' + (c.x + 5) + '" y="' + (c.y + 3) + '" font-size="9" fill="#0f172a">' + c.name + '</text>';
  });
  if (opts.military) {
    s += '<path d="' + MILITARY_MAP.fronteraArgelia + '" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6 3"><title>Frontera con Argelia (cerrada desde 1994)</title></path>';
    s += '<path d="' + MILITARY_MAP.berma + '" fill="none" stroke="#b45309" stroke-width="2.5" stroke-dasharray="2 3"><title>Muro defensivo (trazado esquemático)</title></path>';
    MILITARY_MAP.puntos.forEach(function (p) {
      s += '<rect x="' + (p.x - 4) + '" y="' + (p.y - 4) + '" width="8" height="8" fill="#1d4ed8" stroke="#fff"><title>' + p.name + '</title></rect>';
    });
  }
  return s + '</svg>';
}


// =====================================================================
// 1. SCENARIOS
//  · spectrumOrder reescalado de 1–11 (hemiciclo original) a 1–7,
//    conservando el orden relativo.
//  · basePct calculado como escaños / 395 (no es cuota de voto real).
//  · minSeats = 0 (el original solo limitaba 0..max).
// =====================================================================
const SCENARIOS = {
  ACTUAL: {
    id: 'ACTUAL',
    title: 'MARRUECOS (2026)',
    // Tesorería inicial = cargas totales del Estado de la Ley de Finanzas 2026:
    // 761.300 M MAD (527.600 presupuesto general + 167.500 cuentas especiales + ~2.000 SEGMA)
    // ÷ 10,988 MAD/€ (cambio de referencia de Bank Al-Maghrib, 4-nov-2026) ≈ 69.284 M€.
    treasury: 69284,
    desc: 'Tras las elecciones del 23 de septiembre de 2026 (participación del 38 %, la más baja desde 2007), el PAM de Fatima Ezzahra El Mansouri —primera mujer al frente del Gobierno— gobierna con el Istiqlal, la USFP y el PPS (207 de 395 escaños; mayoría absoluta: 198), sin el RNI. El Gobierno hereda el PLF 2027, un déficit objetivo del 3 % del PIB, la presión social de la Generación Z 212 y la cuenta atrás del Mundial 2030.',
    parties: [
      { id: 'FGD',  name: 'Alianza de la Izquierda (FGD)',              leader: 'Dirección de la Alianza', seats: 8,   baseSeats: 8,   minSeats: 0, maxSeats: 60,  basePct: 2.0,  color: '#be185d', isRegional: false, ideology: 'Izquierda',                spectrumOrder: 1, redLines: ['RNI', 'PAM', 'UC', 'PI', 'MP'] },
      { id: 'PPS',  name: 'Partido del Progreso y el Socialismo',       leader: 'Nabil Benabdallah',     seats: 19,  baseSeats: 19,  minSeats: 0, maxSeats: 70,  basePct: 4.8,  color: '#f97316', isRegional: false, ideology: 'Izquierda',                spectrumOrder: 2, redLines: [] },
      { id: 'USFP', name: 'Unión Socialista de Fuerzas Populares',      leader: 'Driss Lachguar',        seats: 26,  baseSeats: 26,  minSeats: 0, maxSeats: 90,  basePct: 6.6,  color: '#f43f5e', isRegional: false, ideology: 'Socialdemocracia',         spectrumOrder: 3, redLines: [] },
      { id: 'PJD',  name: 'Partido Justicia y Desarrollo',              leader: 'Abdelilah Benkirane',   seats: 54,  baseSeats: 54,  minSeats: 0, maxSeats: 130, basePct: 13.7, color: '#38bdf8', isRegional: false, ideology: 'Islamismo conservador',    spectrumOrder: 4, redLines: ['PAM'] },
      { id: 'MP',   name: 'Movimiento Popular',                         leader: 'Dirección del MP',      seats: 29,  baseSeats: 29,  minSeats: 0, maxSeats: 70,  basePct: 7.3,  color: '#a16207', isRegional: false, ideology: 'Centro rural',             spectrumOrder: 4, redLines: [] },
      { id: 'UC',   name: 'Unión Constitucional',                       leader: 'Mohamed Sajid',         seats: 17,  baseSeats: 17,  minSeats: 0, maxSeats: 60,  basePct: 4.3,  color: '#eab308', isRegional: false, ideology: 'Liberal',                  spectrumOrder: 5, redLines: [] },
      { id: 'PAM',  name: 'Autenticidad y Modernidad',                  leader: 'Fatima Ezzahra El Mansouri', seats: 97, baseSeats: 97, minSeats: 0, maxSeats: 140, basePct: 24.6, color: '#16a34a', isRegional: false, ideology: 'Centro modernista (social-liberal)', spectrumOrder: 5, redLines: ['PJD'] },
      { id: 'RNI',  name: 'Agrupación Nacional de Independientes',      leader: 'Aziz Akhannouch',       seats: 66,  baseSeats: 66,  minSeats: 0, maxSeats: 150, basePct: 16.7, color: '#2563eb', isRegional: false, ideology: 'Liberal / centroderecha',  spectrumOrder: 6, redLines: [] },
      { id: 'PI',   name: 'Istiqlal',                                   leader: 'Nizar Baraka',          seats: 65,  baseSeats: 65,  minSeats: 0, maxSeats: 120, basePct: 16.5, color: '#dc2626', isRegional: false, ideology: 'Nacionalista conservador', spectrumOrder: 6, redLines: [] },
      { id: 'MDS',  name: 'Movimiento Demócrata y Social',              leader: 'Dirección del MDS',     seats: 8,   baseSeats: 8,   minSeats: 0, maxSeats: 25,  basePct: 2.0,  color: '#94a3b8', isRegional: false, ideology: 'Centro',                   spectrumOrder: 4, redLines: [] },
      { id: 'OTR',  name: 'FFD, Partido de la Equidad y otros',         leader: 'Varios',                seats: 6,   baseSeats: 6,   minSeats: 0, maxSeats: 30,  basePct: 1.5,  color: '#64748b', isRegional: false, ideology: 'Varios',                   spectrumOrder: 4, redLines: [] }
    ]
  },
  ELECCIONES_2021: {
    id: 'ELECCIONES_2021',
    title: 'MARRUECOS (2021) · histórico',
    treasury: 9000,   // M€ iniciales (opcional; por defecto el motor usa 75.000)
    desc: 'Cámara de Representantes de 395 escaños (mayoría absoluta: 198), dominada por el RNI, el PAM y el Istiqlal tras el hundimiento del PJD. El Palacio conserva los ministerios de soberanía mientras la sequía, la inflación y la protesta juvenil marcan la agenda.',
    parties: [
      { id: 'FGD',  name: 'Federación de la Izquierda Democrática',     leader: 'Candidatura de la FGD', seats: 1,   baseSeats: 1,   minSeats: 0, maxSeats: 60,  basePct: 0.3,  color: '#be185d', isRegional: false, ideology: 'Izquierda',                spectrumOrder: 1, redLines: ['RNI', 'PAM', 'UC', 'PI', 'MP'] },
      { id: 'PPS',  name: 'Partido del Progreso y el Socialismo',       leader: 'Nabil Benabdallah',     seats: 22,  baseSeats: 22,  minSeats: 0, maxSeats: 70,  basePct: 5.6,  color: '#f97316', isRegional: false, ideology: 'Izquierda',                spectrumOrder: 2, redLines: [] },
      { id: 'USFP', name: 'Unión Socialista de Fuerzas Populares',      leader: 'Driss Lachguar',        seats: 34,  baseSeats: 34,  minSeats: 0, maxSeats: 90,  basePct: 8.6,  color: '#f43f5e', isRegional: false, ideology: 'Socialdemocracia',         spectrumOrder: 3, redLines: [] },
      { id: 'PJD',  name: 'Partido Justicia y Desarrollo',              leader: 'Abdelilah Benkirane',   seats: 13,  baseSeats: 13,  minSeats: 0, maxSeats: 130, basePct: 3.3,  color: '#38bdf8', isRegional: false, ideology: 'Islamismo conservador',    spectrumOrder: 4, redLines: ['PAM'] },
      { id: 'MP',   name: 'Movimiento Popular',                         leader: 'Dirección del MP',      seats: 28,  baseSeats: 28,  minSeats: 0, maxSeats: 70,  basePct: 7.1,  color: '#a16207', isRegional: false, ideology: 'Centro rural',             spectrumOrder: 4, redLines: [] },
      { id: 'UC',   name: 'Unión Constitucional',                       leader: 'Mohamed Sajid',         seats: 18,  baseSeats: 18,  minSeats: 0, maxSeats: 60,  basePct: 4.6,  color: '#eab308', isRegional: false, ideology: 'Liberal',                  spectrumOrder: 5, redLines: [] },
      { id: 'PAM',  name: 'Autenticidad y Modernidad',                  leader: 'Abdellatif Ouahbi',     seats: 87,  baseSeats: 87,  minSeats: 0, maxSeats: 130, basePct: 22.0, color: '#16a34a', isRegional: false, ideology: 'Centro modernista',        spectrumOrder: 5, redLines: ['PJD'] },
      { id: 'RNI',  name: 'Agrupación Nacional de Independientes',      leader: 'Aziz Akhannouch',       seats: 102, baseSeats: 102, minSeats: 0, maxSeats: 150, basePct: 25.8, color: '#2563eb', isRegional: false, ideology: 'Liberal / centroderecha',  spectrumOrder: 6, redLines: [] },
      { id: 'PI',   name: 'Istiqlal',                                   leader: 'Nizar Baraka',          seats: 81,  baseSeats: 81,  minSeats: 0, maxSeats: 120, basePct: 20.5, color: '#dc2626', isRegional: false, ideology: 'Nacionalista conservador', spectrumOrder: 6, redLines: [] },
      { id: 'MDS',  name: 'Movimiento Demócrata y Social',              leader: 'Dirección del MDS',     seats: 3,   baseSeats: 3,   minSeats: 0, maxSeats: 25,  basePct: 0.8,  color: '#94a3b8', isRegional: false, ideology: 'Centro',                   spectrumOrder: 4, redLines: [] },
      { id: 'OTR',  name: 'Independientes y otros',                     leader: 'Independiente',         seats: 6,   baseSeats: 6,   minSeats: 0, maxSeats: 30,  basePct: 1.5,  color: '#64748b', isRegional: false, ideology: 'Varios',                   spectrumOrder: 4, redLines: [] }
    ]
  }
};


// =====================================================================
// 2. DYNAMIC_EVENTS — decisiones de gobierno (DECS de marruecos.js)
//    «Estadios frente a hospitales y escuelas» está en HOUSING_EVENTS.
// =====================================================================
const DYNAMIC_EVENTS = [
  // ---- Medidas del PLF 2027 y de la agenda social (cifras en M€; 1 € = 10,988 MAD) ----
  {
    id: 'FISCAL_REFORMA_IRPF_2027',
    category: 'FISCAL',
    title: 'REFORMA DEL IMPUESTO SOBRE LA RENTA (PLF 2027)',
    desc: 'El PLF 2027 propone elevar el umbral exento del IRPF de 40.000 a 60.000 DH, subir la deducción por gastos profesionales del 25 % al 45 % y pasar de cinco a tres tramos (10, 20 y 30 %). Coste estimado en 2027: 5.500 M DH.',
    condition: (m) => true,
    options: [
      { text: 'Aplicar la reforma completa desde enero de 2027', stats: { apr: +5, eco: +1, est: +1 }, cost: 500, loyaltyImpact: { PAM: +10, USFP: +8, PPS: +8, PI: +5, RNI: -5 }, news: 'El Gobierno aplica desde enero la reforma del IRPF: los sueldos de menos de 10.000 DH netos al mes dejan de tributar.' },
      { text: 'Aplazar y priorizar el objetivo de déficit del 3 % del PIB', stats: { eco: +1, apr: -3, est: -1 }, cost: 0, loyaltyImpact: { PAM: -8, USFP: -10, PPS: -10, PI: +3 }, news: 'El Gobierno aplaza la rebaja del IRPF para no desviarse del déficit del 3 % del PIB.' }
    ]
  },
  {
    id: 'SOCIAL_AYUDA_DIRECTA',
    category: 'PROTECCIÓN SOCIAL',
    title: 'AYUDA SOCIAL DIRECTA',
    desc: 'La ayuda mensual mínima del programa de ayuda social directa es de 500 DH. El PLF 2027 prevé subirla a 600 DH como primer paso hacia 1.000 DH (3.000 M DH adicionales) y no retirarla cuando un miembro del hogar consiga empleo.',
    condition: (m) => true,
    options: [
      { text: 'Subir a 600 DH y fijar la senda hacia 1.000 DH', stats: { apr: +5, est: +2, eco: -1 }, cost: 273, loyaltyImpact: { USFP: +10, PPS: +10, PAM: +8, PI: +5 }, news: 'La ayuda social directa mínima sube a 600 DH y el Gobierno fija la senda hacia los 1.000 DH.' },
      { text: 'Mantener 500 DH y reforzar la focalización', stats: { apr: -2, eco: +1 }, cost: 0, loyaltyImpact: { USFP: -8, PPS: -8, RNI: +4 }, news: 'El Gobierno mantiene la ayuda en 500 DH y afina el reparto con el nuevo criterio de renta disponible.' }
    ]
  },
  {
    id: 'SOCIAL_PENSIONES_MINIMAS',
    category: 'PENSIONES',
    title: 'PENSIÓN MÍNIMA Y PENSIÓN DE VIUDEDAD',
    desc: 'El Gobierno prometió llevar la pensión mínima a 1.700 DH al mes en 2027 (hasta 3.000 DH al final de la legislatura) y elevar la pensión de viudedad del 50 % al 100 %. Beneficiaría a unas 500.000 personas y a 431.000 viudas.',
    condition: (m) => true,
    options: [
      { text: 'Aplicar ya la pensión mínima de 1.700 DH y la viudedad al 100 %', stats: { apr: +6, est: +3, eco: -1 }, cost: 400, loyaltyImpact: { USFP: +10, PPS: +10, PAM: +8, PI: +6 }, news: 'El Gobierno sube la pensión mínima a 1.700 DH y duplica la pensión de viudedad.' },
      { text: 'Escalonarlo según el equilibrio financiero de cada caja', stats: { apr: +2, est: +1 }, cost: 150, loyaltyImpact: { USFP: -5, PPS: -5, RNI: +3 }, news: 'El Gobierno escalona las pensiones mínimas según el equilibrio de cada régimen de jubilación.' }
    ]
  },
  {
    id: 'ENERGIA_FACTURA_100DH',
    category: 'ENERGÍA',
    title: 'FACTURAS DE ELECTRICIDAD DE HASTA 100 DH',
    desc: 'El PLF 2027 prevé que desde enero el Estado asuma las facturas mensuales de hasta 100 DH (unos 6 millones de clientes, 2.800 M DH al año). La ONEE, además, recibió un protocolo de 6.500 M DH en 2026.',
    condition: (m) => true,
    options: [
      { text: 'Asumir las facturas de hasta 100 DH desde enero', stats: { apr: +4, est: +1 }, cost: 255, loyaltyImpact: { PAM: +8, USFP: +6, PPS: +6 }, news: 'El Estado pagará desde enero las facturas de electricidad de hasta 100 DH de unos 6 millones de hogares.' },
      { text: 'Reforzar el saneamiento financiero de la ONEE y congelar tarifas', stats: { eco: +1, est: +1, apr: +1 }, cost: 592, loyaltyImpact: { PI: +6 }, news: 'El Gobierno refuerza el plan de saneamiento de la ONEE para mantener las tarifas.' }
    ]
  },
  {
    id: 'PRECIOS_COMPENSACION_BASE',
    category: 'PRECIOS',
    title: 'COMPENSACIÓN DE BUTANO, AZÚCAR Y HARINA',
    desc: 'El PLF 2027 reserva 19.400 M DH para compensar el butano, el azúcar y la harina de trigo blando (en 2026 se amplió a 22.000 M DH con créditos suplementarios). Con Ormuz alterado, la subvención media por bombona de 12 kg subió un 15,75 % hasta unos 62 DH.',
    condition: (m) => true,
    options: [
      { text: 'Mantener la compensación universal (19.400 M DH)', stats: { apr: +3, est: +2, eco: -2 }, cost: 1765, loyaltyImpact: { USFP: +8, PPS: +8, PJD: +5, PAM: +4 }, news: 'El Gobierno mantiene 19.400 M DH para compensar el butano, el azúcar y la harina.' },
      { text: 'Reducirla gradualmente y compensar con ayuda directa', stats: { eco: +2, apr: -3, est: -1 }, cost: 1100, loyaltyImpact: { RNI: +6, UC: +6, USFP: -8, PPS: -8 }, news: 'El Gobierno recorta de forma gradual la compensación y la sustituye por ayudas directas.' }
    ]
  },
  {
    id: 'ECONOMIA_MILLON_EMPLEOS',
    category: 'EMPLEO',
    title: 'PROMESA DE UN MILLÓN DE EMPLEOS',
    desc: 'El programa del PAM prometió crear un millón de empleos y unos 70.000 M DH anuales de medidas, con un PLF 2027 casi cerrado y poco margen. La presión juvenil de la Generación Z 212 exige resultados.',
    condition: (m) => true,
    options: [
      { text: 'Lanzar el plan con una primera dotación fuerte', stats: { emp: +6, apr: +4, eco: +1 }, cost: 1500, loyaltyImpact: { PAM: +10, USFP: +5, PPS: +5 }, news: 'El Gobierno lanza el plan del millón de empleos con una primera dotación de 1.500 M€.' },
      { text: 'Escalonarlo con prioridad a la formación en alternancia', stats: { emp: +3, apr: +2 }, cost: 700, loyaltyImpact: { PAM: +3, RNI: +3 }, news: 'El Gobierno escalona el plan de empleo y prioriza la formación en alternancia.' }
    ]
  },
  {
    id: 'SALUD_REFORMA_SISTEMA',
    category: 'SANIDAD',
    title: 'ACELERAR LA REFORMA SANITARIA',
    desc: 'El PLF 2027 destina 45.400 M DH a la reforma del sistema de salud: nuevos hospitales universitarios (Agadir, Guelmim, Laâyoune) y consolidación del AMO, una de las demandas centrales de la Generación Z 212.',
    condition: (m) => true,
    options: [
      { text: 'Adelantar los hospitales universitarios y la contratación de personal', stats: { apr: +6, est: +3, eco: -1 }, cost: 800, loyaltyImpact: { USFP: +10, PPS: +8, PAM: +5 }, news: 'El Gobierno adelanta los nuevos hospitales universitarios y refuerza las plantillas sanitarias.' },
      { text: 'Mantener el calendario previsto', stats: { apr: +1, est: +1 }, cost: 300, loyaltyImpact: {}, news: 'El Gobierno mantiene el calendario de la reforma sanitaria.' }
    ]
  },
  {
    id: 'EDUCACION_BECAS_INTERNADOS',
    category: 'EDUCACIÓN',
    title: 'BECAS, INTERNADOS Y FORMACIÓN EN ALTERNANCIA',
    desc: 'El ministro de Educación Nabil Benabdallah (PPS) hereda la reforma escolar y un PLF 2027 que prevé becas, nuevos internados y formación en alternancia, mientras el profesorado vigila sus salarios.',
    condition: (m) => true,
    options: [
      { text: 'Ampliar becas e internados, sobre todo en el medio rural', stats: { apr: +4, emp: +2, est: +1 }, cost: 500, loyaltyImpact: { PPS: +10, USFP: +6, MP: +4 }, news: 'El Gobierno amplía las becas y construye nuevos internados en el medio rural.' },
      { text: 'Concentrar el esfuerzo en las escuelas pioneras y en el profesorado', stats: { apr: +3, est: +1 }, cost: 400, loyaltyImpact: { PPS: +4 }, news: 'El Gobierno concentra el esfuerzo educativo en las escuelas pioneras y en el profesorado.' }
    ]
  },
  {
    id: 'TRANSPORTE_MOVILIDAD_URBANA',
    category: 'TRANSPORTE',
    title: 'PLAN DE MOVILIDAD URBANA',
    desc: 'Rabat, Casablanca, Marrakech y Tánger necesitan transporte público para el Mundial 2030. El plan de movilidad urbana ronda los 11.000 M DH.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar el plan completo de 11.000 M DH', stats: { eco: +3, apr: +3, emp: +1 }, cost: 1001, loyaltyImpact: { PI: +8, PAM: +6 }, news: 'El Gobierno aprueba un plan de movilidad urbana de 11.000 M DH para las grandes ciudades.' },
      { text: 'Priorizar Casablanca y Rabat y diferir el resto', stats: { eco: +1, apr: +1 }, cost: 450, loyaltyImpact: { MP: -5 }, news: 'El Gobierno prioriza la movilidad en Casablanca y Rabat y difiere el resto de ciudades.' }
    ]
  },
  // ---- Política y sociedad ----
  {
    id: 'SPECIAL_MUDAWANA',
    category: 'SOCIEDAD',
    title: 'REFORMA DEL CÓDIGO DE FAMILIA (MUDAWANA)',
    desc: 'La coalición con el PPS y la USFP reabre el debate sobre las propuestas de reforma de la Mudawana (herencia, custodia, matrimonio de menores, poligamia). Los sectores conservadores y el PJD, de vuelta con 54 escaños, vigilan cada paso.',
    condition: (m) => true,
    options: [
      { text: 'Presentar un proyecto de ley que desarrolle las propuestas de reforma', stats: { apr: +4, est: -3, con: -2 }, cost: 0, loyaltyImpact: { USFP: +15, PPS: +20, PAM: +8, PJD: -30, MP: -10, PI: -15 }, news: 'El Gobierno presenta el proyecto de reforma de la Mudawana; el PJD y los sectores religiosos lo rechazan.' },
      { text: 'Limitarse a retoques técnicos tras consultar al Consejo de Ulemas', stats: { apr: -3, est: +2, con: +3 }, cost: 0, loyaltyImpact: { PJD: +10, PI: +10, USFP: -15, PPS: -20 }, news: 'El Gobierno limita la reforma de la Mudawana a retoques técnicos tras consultar a los ulemas.' }
    ]
  },
  {
    id: 'SOCIAL_GENZ212_JUSTICIA',
    category: 'DERECHOS',
    title: 'INDULTO PARA JÓVENES DE LA GENERACIÓN Z 212',
    desc: 'Las protestas juveniles de 2025 dejaron detenidos y condenados. La Generación Z 212 y la oposición piden gracia, mientras Interior defiende el orden público.',
    condition: (m) => true,
    options: [
      { text: 'Pedir al Rey un indulto para los jóvenes condenados', stats: { apr: +5, est: +3, con: -2 }, cost: 0, loyaltyImpact: { USFP: +10, PPS: +10, PJD: +10, PAM: +4 }, news: 'El Gobierno pide al Rey un indulto para los jóvenes condenados tras las protestas de la Generación Z 212.' },
      { text: 'Mantener las condenas y reforzar el diálogo con la juventud', stats: { apr: -3, con: +2, est: +1 }, cost: 0, loyaltyImpact: { PI: +4 }, news: 'El Gobierno mantiene las condenas y propone un diálogo con la juventud.' }
    ]
  },
  {
    id: 'REGULACION_REFORMA_ELECTORAL',
    category: 'POLÍTICA',
    title: 'REFORMA ELECTORAL TRAS LA ABSTENCIÓN',
    desc: 'Con un 38 % de participación y el cociente calculado sobre los inscritos, los partidos discuten si cambiar de nuevo el método de reparto de escaños y cómo atraer a los jóvenes, que son solo el 4 % del censo.',
    condition: (m) => true,
    options: [
      { text: 'Mantener el cociente sobre inscritos y facilitar el voto joven', stats: { est: +2, apr: +1 }, cost: 40, loyaltyImpact: { PAM: +6, PI: +4, PJD: -8, RNI: -8 }, news: 'El Gobierno mantiene el cociente electoral sobre inscritos y facilita la inscripción de los jóvenes.' },
      { text: 'Volver al reparto sobre votos emitidos', stats: { est: -1 }, cost: 0, loyaltyImpact: { PJD: +10, RNI: +8, PAM: -8, USFP: -6 }, news: 'La Cámara vuelve al reparto de escaños sobre votos emitidos.' }
    ]
  },
  // ---- Sur, exterior y defensa ----
  {
    id: 'GEO_SAHARA_AUTONOMIA',
    category: 'SUR',
    title: 'PROVINCIAS DEL SUR Y PLAN DE AUTONOMÍA',
    desc: 'Tras la Resolución 2797 del Consejo de Seguridad (octubre de 2025), que respalda la autonomía como base de la negociación, el Palacio pide traducir el apoyo en negociación diplomática e inversión en Dajla y Laâyoune.',
    condition: (m) => true,
    options: [
      { text: 'Acelerar el puerto atlántico de Dajla y las inversiones del Sur', stats: { eco: +3, apr: +2, con: +4 }, cost: 300, loyaltyImpact: { PI: +10, PAM: +5 }, news: 'El Gobierno acelera el puerto atlántico de Dajla y las inversiones en las provincias del Sur.' },
      { text: 'Ofensiva diplomática para negociar sobre el plan de autonomía', stats: { con: +5, apr: +1 }, cost: 120, loyaltyImpact: { PI: +8 }, news: 'La diplomacia marroquí impulsa la negociación sobre el plan de autonomía.' }
    ]
  },
  {
    id: 'GEO_ADUANAS_CEUTA_MELILLA',
    category: 'ESPAÑA',
    title: 'ADUANAS DE CEUTA Y MELILLA',
    desc: 'Los comerciantes del norte piden normalizar el comercio fronterizo con las ciudades autónomas. España defiende el plan de autonomía para el Sáhara y niega cualquier «trueque» con Rabat.',
    condition: (m) => true,
    options: [
      { text: 'Ampliar la apertura de aduanas comerciales', stats: { eco: +2 }, cost: 0, loyaltyImpact: {}, news: 'Marruecos amplía la apertura de sus aduanas con Ceuta y Melilla y se reactiva el comercio fronterizo.' },
      { text: 'Mantener la apertura limitada como palanca de presión', stats: { apr: +1 }, cost: 0, loyaltyImpact: {}, news: 'Marruecos mantiene limitada la apertura de las aduanas con Ceuta y Melilla.' }
    ]
  },
  {
    id: 'SPECIAL_DEFENSA_ISRAEL',
    category: 'DEFENSA',
    title: 'COOPERACIÓN MILITAR CON ISRAEL',
    desc: 'Israel ha inaugurado locales permanentes para su agregado militar en Rabat y el director general de su Ministerio de Defensa ha visitado Marruecos. Las FAR buscan drones y defensa antiaérea; la USFP, el PPS y el PJD se oponen a la normalización.',
    condition: (m) => true,
    options: [
      { text: 'Profundizar la cooperación en drones, ciberdefensa y antiaérea', stats: { mil: +6, con: +2, est: -2 }, cost: 700, loyaltyImpact: { PAM: +3, PI: +3, USFP: -10, PPS: -12, PJD: -10 }, news: 'Marruecos profundiza su cooperación militar con Israel en drones, ciberdefensa y antiaérea.' },
      { text: 'Cooperación discreta y diversificar proveedores (EE. UU., Turquía, Corea)', stats: { mil: +4 }, cost: 500, loyaltyImpact: { USFP: +2, PPS: +2 }, news: 'Marruecos diversifica sus proveedores militares y mantiene discreta la cooperación con Israel.' }
    ]
  },
  {
    id: 'SPECIAL_MODERNIZACION_MILITAR',
    category: 'DEFENSA',
    title: 'MODERNIZACIÓN DE LAS FAR',
    desc: 'Las FAR piden renovar la aviación, los drones y la defensa antiaérea ante la carrera de armamentos con Argelia, con la frontera cerrada desde 1994.',
    condition: (m) => true,
    options: [
      { text: 'Comprar drones y sistemas antiaéreos en el exterior', stats: { mil: +7, con: +3, apr: -1 }, cost: 600, loyaltyImpact: {}, news: 'Marruecos adquiere drones y defensa antiaérea en el exterior para modernizar las FAR.' },
      { text: 'Producir en Marruecos con socios extranjeros', stats: { mil: +4, eco: +2 }, cost: 350, loyaltyImpact: {}, news: 'Marruecos fabricará material militar en su territorio junto a socios extranjeros.' }
    ]
  },
  // ---- Economía, agua e inversión ----
  {
    id: 'CRISIS_SEQUIA_ESTRUCTURAL',
    category: 'AGUA',
    title: 'SEQUÍA ESTRUCTURAL',
    desc: 'Aunque la campaña 2025/2026 mejoró, los embalses siguen frágiles. El Programa Nacional de Agua Potable y Riego 2020-2027 supera los 143.000 M DH: hay que elegir entre consumo humano y campo exportador.',
    condition: (m) => true,
    options: [
      { text: 'Acelerar desaladoras y restringir cultivos de alto consumo', stats: { eco: +1, est: +3, apr: -1 }, cost: 1600, loyaltyImpact: { MP: -10 }, news: 'El Gobierno acelera las desaladoras y restringe los cultivos que más agua consumen.' },
      { text: 'Priorizar la exportación agrícola con trasvases', stats: { eco: +3, est: -4, apr: -2 }, cost: 0, loyaltyImpact: { MP: +10, RNI: +5 }, news: 'El Gobierno prioriza la exportación agrícola con trasvases; protestas por el agua en el interior.' }
    ]
  },
  {
    id: 'ENERGIA_LA_SAMIR',
    category: 'ENERGÍA',
    title: 'LA REFINERÍA DE LA SAMIR',
    desc: 'La oposición del PJD cuestiona la subida de los carburantes y el bloqueo de La Samir, la refinería de Mohammedia parada desde 2015, mientras se tensa el mercado con Ormuz.',
    condition: (m) => true,
    options: [
      { text: 'Desbloquear La Samir con un inversor y reabrir el refino', stats: { eco: +2, apr: +1, est: +1 }, cost: 400, loyaltyImpact: { PJD: +6, PI: +4 }, news: 'El Gobierno busca desbloquear La Samir con un inversor para reabrir el refino nacional.' },
      { text: 'Mantener las importaciones de productos refinados', stats: { eco: -1, apr: -1 }, cost: 0, loyaltyImpact: { PJD: -4 }, news: 'El Gobierno mantiene las importaciones de refinados y deja La Samir en el limbo.' }
    ]
  },
  {
    id: 'SPECIAL_GIGAFACTORIA_BATERIAS',
    category: 'INVERSIÓN',
    title: 'GIGAFACTORÍA DE BATERÍAS (KENITRA)',
    desc: 'La fábrica de Gotion en Kenitra necesita suministro eléctrico renovable y apoyo público; el Banco Africano de Desarrollo concedió 100 M€ para acelerar el proyecto.',
    condition: (m) => true,
    options: [
      { text: 'Ofrecer incentivos y energía verde garantizada', stats: { eco: +5, apr: +2, con: +1 }, cost: 250, loyaltyImpact: { PI: +5, PAM: +4 }, news: 'Marruecos refuerza los incentivos y la energía verde para la gigafactoría de baterías de Kenitra.' },
      { text: 'Exigir contenido local y transferencia tecnológica', stats: { eco: +2, apr: +1 }, cost: 0, loyaltyImpact: {}, news: 'Rabat exige contenido local y transferencia de tecnología a la gigafactoría de baterías.' }
    ]
  },
  {
    id: 'SPECIAL_GASODUCTO_NIGERIA',
    category: 'ENERGÍA',
    title: 'GASODUCTO NIGERIA–MARRUECOS',
    desc: 'El gasoducto atlántico africano necesita financiación para dar el salto. El Estado puede asumir el tramo marroquí o esperar a los inversores del Golfo.',
    condition: (m) => true,
    options: [
      { text: 'Financiación pública del tramo marroquí', stats: { eco: +4, apr: +1 }, cost: 700, loyaltyImpact: { PI: +6 }, news: 'El Estado financiará el tramo marroquí del gasoducto Nigeria–Marruecos.' },
      { text: 'Esperar a inversores privados del Golfo', stats: { eco: +1 }, cost: 0, loyaltyImpact: {}, news: 'El Gobierno espera a los inversores del Golfo para financiar el gasoducto africano.' }
    ]
  },
  {
    id: 'SPECIAL_CANNABIS_RIF',
    category: 'ECONOMÍA',
    title: 'CANNABIS LEGAL EN EL RIF',
    desc: 'Con la ley 13-21 en vigor, las cooperativas piden ampliar la producción legal de cannabis medicinal e industrial y regularizar a miles de agricultores.',
    condition: (m) => true,
    options: [
      { text: 'Ampliar la producción legal a más provincias del Rif', stats: { eco: +3, apr: +3, est: +2 }, cost: 150, loyaltyImpact: { PAM: +10, PJD: -15, PI: -5 }, news: 'Rabat amplía el cannabis legal en el Rif y regulariza a más agricultores.' },
      { text: 'Mantener el modelo restrictivo', stats: { apr: -2, est: -2 }, cost: 0, loyaltyImpact: { PAM: -6, PJD: +8 }, news: 'Rabat mantiene el modelo restrictivo y las cooperativas del Rif se sienten abandonadas.' }
    ]
  },
  {
    id: 'TENSION_MIGRACION_SUBSAHARIANA',
    category: 'MIGRACIÓN',
    title: 'MIGRACIÓN SUBSAHARIANA',
    desc: 'Miles de migrantes viven sin papeles en las ciudades del norte y presionan hacia Europa. La UE, con España a la cabeza, reclama control de fronteras.',
    condition: (m) => true,
    options: [
      { text: 'Regularizarlos con permisos de trabajo', stats: { eco: +1, apr: -3, est: +1 }, cost: 100, loyaltyImpact: { PJD: -10, PPS: +10, USFP: +6 }, news: 'Marruecos regulariza a miles de migrantes subsaharianos con permisos de trabajo.' },
      { text: 'Endurecer controles y repatriaciones', stats: { apr: +2, est: +1, eco: -1 }, cost: 0, loyaltyImpact: { PJD: +5, PPS: -6, USFP: -6 }, news: 'Marruecos endurece los controles y acelera las repatriaciones de migrantes.' }
    ]
  },
  {
    id: 'REGULACION_REFORMA_FISCAL',
    category: 'FISCAL',
    title: 'AMPLIAR LA BASE TRIBUTARIA',
    desc: 'Con la rebaja del IRPF en marcha, el Gobierno debe compensar ingresos. La Ley Marco 69-19 apunta a ampliar la base y combatir el fraude.',
    condition: (m) => true,
    options: [
      { text: 'Reforzar la lucha contra el fraude y gravar rentas altas y artículos de lujo', stats: { eco: -1, apr: +3, est: +1 }, cost: -400, loyaltyImpact: { USFP: +10, PPS: +10, RNI: -10, UC: -10 }, news: 'El Gobierno refuerza la lucha contra el fraude y grava las rentas altas y los artículos de lujo.' },
      { text: 'Bajar el impuesto de sociedades para atraer inversión', stats: { eco: +4, apr: -2 }, cost: 200, loyaltyImpact: { RNI: +10, UC: +10, USFP: -10, PPS: -10 }, news: 'El Gobierno baja el impuesto de sociedades para atraer inversión extranjera.' }
    ]
  },
  {
    id: 'ESCANDALO_ENRIQUECIMIENTO_ILICITO',
    category: 'JUSTICIA',
    title: 'LEY CONTRA EL ENRIQUECIMIENTO ILÍCITO',
    desc: 'Un escándalo de contratos públicos reabre el debate sobre una ley anticorrupción y una agencia independiente.',
    condition: (m) => true,
    options: [
      { text: 'Aprobarla con una agencia independiente', stats: { apr: +6, est: +2, con: -1 }, cost: 0, loyaltyImpact: { PJD: +10, PPS: +10, USFP: +6, PAM: -6 }, news: 'El Gobierno aprueba la ley contra el enriquecimiento ilícito con una agencia independiente.' },
      { text: 'Archivar el proyecto', stats: { apr: -6, est: -2 }, cost: 0, loyaltyImpact: { PAM: +3, PI: +3, PPS: -8, USFP: -8 }, news: 'El Gobierno archiva la ley anticorrupción y la oposición clama contra la impunidad.' }
    ]
  },
  {
    id: 'HUELGA_SMIG',
    category: 'LABORAL',
    title: 'SALARIO MÍNIMO Y DIÁLOGO SOCIAL',
    desc: 'El ministro de Empleo, Abderrahim Chahid (USFP), abre el diálogo social de otoño: los sindicatos amenazan con huelgas si no se actualizan los salarios ante la inflación.',
    condition: (m) => true,
    options: [
      { text: 'Subir el SMIG y firmar un acuerdo social', stats: { apr: +6, est: +3, eco: -2 }, cost: 350, loyaltyImpact: { USFP: +15, PPS: +15, UC: -10, RNI: -5 }, news: 'Gobierno y sindicatos firman un acuerdo social con subida del SMIG.' },
      { text: 'Congelar salarios y dar incentivos fiscales a las empresas', stats: { eco: +3, apr: -6, est: -3 }, cost: 0, loyaltyImpact: { RNI: +10, UC: +10, USFP: -15, PPS: -15 }, news: 'El Gobierno congela los salarios y premia a las empresas; los sindicatos amenazan con paros.' }
    ]
  }
];


// =====================================================================
// 3. CAMPAIGN_HEADLINES — preguntas de campaña (CQ) y debate (cdeb)
//  · score = round(3 × impulso + Δaprobación original), acotado a -5…+15.
//  · El debate original era probabilístico: aquí se usa el valor esperado.
//  · El coste en M€ de las opciones originales no tiene campo aquí.
// =====================================================================
const CAMPAIGN_HEADLINES = [
  {
    id: 1,
    newspaper: 'HESPRESS',
    headline: 'POLÉMICA POR EL PRECIO DEL PAN',
    desc: 'La oposición te acusa de abandonar a las clases populares. ¿Cómo respondes?',
    options: [
      { text: 'Anunciar subsidios', score: +10, textResult: 'El anuncio calma a los barrios populares y te devuelve la iniciativa en campaña.' },
      { text: 'Culpar a la inflación mundial', score: -5, textResult: 'Suena a excusa: la oposición explota tu falta de respuestas.' }
    ]
  },
  {
    id: 2,
    newspaper: 'LE MATIN',
    headline: 'ESCÁNDALO EN UN MINISTERIO',
    desc: 'Un diario revela contratos dudosos en un departamento. ¿Cómo reaccionas?',
    options: [
      { text: 'Cesar al ministro y abrir investigación', score: +5, textResult: 'La rapidez de tu reacción limita el daño y proyecta imagen de firmeza.' },
      { text: 'Negarlo todo', score: -5, textResult: 'Nuevas filtraciones desmienten tu versión y el escándalo se agranda.' }
    ]
  },
  {
    id: 3,
    newspaper: 'AKHBAR AL YAOUM',
    headline: 'HUELGA DE DOCENTES',
    desc: 'Los sindicatos paralizan las escuelas en plena campaña. ¿Qué haces?',
    options: [
      { text: 'Aceptar subida salarial', score: +10, textResult: 'Los docentes vuelven a las aulas y tú sales como el Gobierno que escucha.' },
      { text: 'Mantener la línea dura', score: -5, textResult: 'El conflicto se alarga y las familias te responsabilizan del caos escolar.' }
    ]
  },
  {
    id: 4,
    newspaper: 'TELQUEL',
    headline: 'ENTREVISTA DE LA OPOSICIÓN',
    desc: 'Tu rival arrasa en la televisión nacional. ¿Cómo contraatacas?',
    options: [
      { text: 'Contraprogramar con un gran acto', score: +6, textResult: 'El mitin llena la plaza y desvía la atención de la entrevista de tu rival.' },
      { text: 'Ignorarlo', score: -5, textResult: 'La entrevista domina el debate público durante días sin respuesta tuya.' }
    ]
  },
  {
    id: 5,
    newspaper: 'LE360',
    headline: 'APOYO DE UN LÍDER RELIGIOSO',
    desc: 'Un influyente personaje te ofrece su respaldo público. ¿Lo aceptas?',
    options: [
      { text: 'Aceptar el apoyo', score: +10, textResult: 'El respaldo te abre puertas en el electorado más conservador.' },
      { text: 'Rechazarlo por prudencia', score: 0, textResult: 'Evitas polémicas, pero renuncias a un impulso electoral valioso.' }
    ]
  },
  {
    id: 6,
    newspaper: 'LE MATIN',
    headline: 'ENCUESTA FILTRADA',
    desc: 'Un sondeo interno te da por perdedor. ¿Cómo lo gestionas?',
    options: [
      { text: 'Desmentirlo con datos', score: +3, textResult: 'Tus cifras frenan el rumor, aunque no logran movilizar a tus votantes.' },
      { text: 'Pedir el voto útil', score: +5, textResult: 'El llamamiento al voto útil moviliza a tu electorado, pero alimenta el relato de debilidad.' }
    ]
  },
  {
    id: 7,
    newspaper: 'TELQUEL',
    headline: 'DEBATE CARA A CARA',
    desc: 'Millones de espectadores siguen el debate decisivo. ¿Qué estrategia eliges?',
    options: [
      { text: 'Agresivo: ir a la yugular', score: -1, textResult: 'El tono duro genera titulares, pero divide al público y el resultado es incierto.' },
      { text: 'Presidencial: balance de gestión', score: +4, textResult: 'Proyectas solvencia y los sondeos instantáneos te dan una ligera ventaja.' },
      { text: 'Cercano: hablar de lo cotidiano', score: +3, textResult: 'Conectas con los problemas del día a día y ganas simpatía entre los indecisos.' }
    ]
  }
];


// =====================================================================
// 4. PRESS_NEWS_BANK — sucesos «Última hora» de la pestaña Prensa (EVS)
//    «Protestas juveniles» está en HOUSING_EVENTS.
// =====================================================================
const PRESS_NEWS_BANK = [
  {
    id: 'NEWS_1',
    newspaper: 'HESPRESS',
    headline: 'SEQUÍA Y PRECIO DEL PAN',
    desc: 'Años de sequía han hundido el campo y los precios de los alimentos básicos siguen altos.',
    options: [
      { text: 'Importar cereal y subsidiar el pan', stats: { apr: +4, eco: -1 }, cost: 400, news: 'El Gobierno importa cereal y subsidia el pan para contener los precios.' },
      { text: 'Racionar el agua y dejar que ajuste el mercado', stats: { apr: -6, est: -3, eco: +1 }, news: 'El Gobierno raciona el agua y deja que el mercado ajuste: crece el malestar rural.' }
    ]
  },
  {
    id: 'NEWS_2',
    newspaper: 'LE MATIN',
    headline: 'OCP Y EL COSTE DEL AZUFRE',
    desc: 'El grupo de fosfatos OCP afronta un fuerte encarecimiento del azufre, su insumo clave, mientras el precio de los fosfatos se mantiene alto.',
    options: [
      { text: 'Contrato preferente con España (+500 M€)', stats: { eco: +2 }, cost: -500, news: 'OCP firma un contrato preferente con España y la relación bilateral sale reforzada.' },
      { text: 'Vender al mejor postor (+800 M€)', stats: { eco: +3 }, cost: -800, news: 'OCP vende al mejor postor y Madrid recibe con frialdad la decisión.' }
    ]
  },
  {
    id: 'NEWS_3',
    newspaper: 'TELQUEL',
    headline: 'PRESIÓN MIGRATORIA EN CEUTA Y MELILLA',
    desc: 'Cientos de personas se concentran junto a la valla.',
    options: [
      { text: 'Reforzar la contención', stats: {}, cost: 200, news: 'Marruecos refuerza la contención en la valla y Madrid agradece la colaboración.' },
      { text: 'Relajar controles para presionar a Madrid', stats: { apr: +3 }, news: 'Marruecos relaja los controles fronterizos y tensa la relación con Madrid.' }
    ]
  },
  {
    id: 'NEWS_4',
    newspaper: 'AKHBAR AL YAOUM',
    headline: 'TERREMOTO EN EL ATLAS',
    desc: 'Un seísmo devasta varias provincias de montaña.',
    options: [
      { text: 'Aceptar ayuda exterior selectiva (+1.000 M€)', stats: { apr: +3 }, cost: -1000, news: 'Marruecos acepta ayuda exterior selectiva para las provincias del Atlas devastadas por el terremoto.' },
      { text: 'Gestionarlo en solitario', stats: { apr: -2, est: -2 }, cost: 700, news: 'El Gobierno afronta en solitario la reconstrucción del Atlas, con críticas por la lentitud.' }
    ]
  },
  {
    id: 'NEWS_5',
    newspaper: 'LE360',
    headline: 'ORMUZ Y EL PRECIO DEL BUTANO',
    desc: 'Las perturbaciones en el estrecho de Ormuz encarecen la energía y la subvención por bombona de butano ha subido en torno a un 16 % en un año.',
    options: [
      { text: 'Créditos suplementarios para la compensación (+728 M€)', stats: { apr: +3, eco: -1 }, cost: 728, news: 'El Gobierno abre créditos suplementarios para sostener la compensación del butano.' },
      { text: 'Trasladar parte del coste al precio final', stats: { apr: -4, eco: +1 }, cost: 0, news: 'El Gobierno traslada parte del encarecimiento del butano al precio final.' }
    ]
  },
  {
    id: 'NEWS_6',
    newspaper: 'HESPRESS',
    headline: 'INUNDACIONES EN EL NORTE',
    desc: 'Las lluvias torrenciales anegan varias provincias y dejan pueblos aislados.',
    options: [
      { text: 'Créditos de emergencia y ayuda a los afectados', stats: { est: +3, apr: +3 }, cost: 500, news: 'El Gobierno aprueba créditos de emergencia para las provincias inundadas.' },
      { text: 'Gestionarlo con medios ordinarios', stats: { est: -3, apr: -4 }, cost: 0, news: 'El Gobierno gestiona las inundaciones con medios ordinarios y crecen las críticas.' }
    ]
  }
];


// =====================================================================
// 5. MINISTRY_DECISIONS_BANK
//  · Decisiones tomadas de pais-marruecos.js (secciones y decretos) y de
//    marruecos.js (POL y programas militares PROGS).
//  · Defensa: Δmil = (suma de efectos sobre tierra/mar/aire) / 3.
//  · interior y exteriores: SIN CONTENIDO en los archivos originales.
// =====================================================================
const MINISTRY_DECISIONS_BANK = {
  sanidad: [
    { title: 'Programa de protección social universal (AMO)', cost: 600, stats: { apr: +6, est: +3 } },
    { title: 'Nuevos hospitales universitarios (Agadir, Guelmim, Laâyoune)', cost: 800, stats: { apr: +5, est: +2 } }
  ],
  educacion: [
    { title: 'Escuelas pioneras', cost: 450, stats: { apr: +3, eco: +1 } },
    { title: 'Becas e internados (PLF 2027)', cost: 400, stats: { apr: +3, emp: +1 } },
    { title: 'Mundial 2030 con España y Portugal', cost: 800, stats: { apr: +4, eco: +3 } }
  ],
  infraestructuras: [
    { title: 'Alta velocidad Kenitra–Marrakech', cost: 900, stats: { eco: +4, apr: +2 } },
    { title: 'Plan de movilidad urbana (11.000 M DH)', cost: 1001, stats: { eco: +3, apr: +3 } }
  ],
  interior: [],
  defensa: [
    { title: 'Servicio militar obligatorio', cost: 150, stats: { mil: +3, apr: -3, est: +1 } },
    { title: 'Profesionalización de la tropa', cost: 500, stats: { mil: +2, apr: +1 } },
    { title: 'Modernizar carros y artillería', cost: 450, stats: { mil: +2 } },
    { title: 'Flota y guardia costera', cost: 600, stats: { mil: +3, est: +1 } },
    { title: 'Aviación de combate', cost: 900, stats: { mil: +3 } },
    { title: 'Drones y defensa antiaérea', cost: 500, stats: { mil: +2 } },
    { title: 'Ciberdefensa e inteligencia', cost: 300, stats: { mil: +2, est: +1 } },
    { title: 'Industria nacional de defensa', cost: 700, stats: { mil: +2, eco: +2 } },
    { title: 'Maniobras African Lion con EE. UU.', cost: 200, stats: { mil: +2 } },
    { title: 'Despliegue reforzado en la frontera con Argelia y el Sáhara', cost: 250, stats: { mil: +1 } }
  ],
  economia: [
    { title: 'Reforma del IRPF (umbral exento de 60.000 DH)', cost: 500, stats: { apr: +4, eco: +1 } },
    { title: 'Compensación de butano, azúcar y harina (19.400 M DH)', cost: 1765, stats: { apr: +4, est: +2 } },
    { title: 'Facturas de electricidad de hasta 100 DH', cost: 255, stats: { apr: +3, est: +1 } },
    { title: 'Fondo Mohammed VI de inversión', cost: 600, stats: { eco: +3, emp: +2 } },
    { title: 'Nuevo Modelo de Desarrollo', cost: 300, stats: { eco: +4, apr: +2, emp: +2 } },
    { title: 'Plan Marruecos Digital', cost: 250, stats: { eco: +3, emp: +2 } }
  ],
  vivienda: [
    { title: 'Plan de vivienda social', cost: 450, stats: { apr: +5, emp: +2 } }
  ],
  territorio: [
    { title: 'Ayuda directa a las familias rurales', cost: 300, stats: { apr: +4, est: +2 } },
    { title: 'Plan de abastecimiento estacional de alimentos básicos', cost: 300, stats: { apr: +3, est: +1 } },
    { title: 'Cumbre con la oposición (RNI y PJD)', cost: 0, stats: { est: +2, apr: +1 } },
    { title: 'Reunión de la mayoría (PAM, PI, USFP, PPS)', cost: 0, stats: { est: +2 } },
    { title: 'Pacto con el grupo UC–MDS', cost: 120, stats: { est: +1 } }
  ],
  trabajo: [
    { title: 'Plan de empleo juvenil', cost: 350, stats: { emp: +5, apr: +3, est: +2 } },
    { title: 'Pensión mínima de 1.700 DH', cost: 400, stats: { apr: +5, est: +2 } },
    { title: 'Pacto social con los sindicatos (UMT, UGTM, CDT, UNMT)', cost: 250, stats: { est: +3, apr: +2 } }
  ],
  justicia: [
    { title: 'Reforma de la ley de partidos', cost: 0, stats: { est: +2 } }
  ],
  exteriores: [],
  transicion_ecologica: [
    { title: 'Plan Generación Verde', cost: 600, stats: { eco: +3, apr: +2 } },
    { title: 'Desaladoras y plan nacional del agua', cost: 1600, stats: { eco: +2, est: +3 } },
    { title: 'Saneamiento de la ONEE (6.500 M DH)', cost: 592, stats: { eco: +2, est: +1 } },
    { title: 'Estrategia nacional del agua', cost: 400, stats: { est: +3, eco: +2 } },
    { title: 'Marruecos, hub energético verde', cost: 500, stats: { eco: +5 } },
    { title: 'Reserva de emergencia contra la sequía', cost: 400, stats: { est: +3, apr: +2 } }
  ],
  cultura: [
    { title: 'Campaña de comunicación del Gobierno', cost: 80, stats: { apr: +3 } },
    { title: 'Diálogo con la juventud (Generación Z 212)', cost: 0, stats: { apr: +4, est: +2 } }
  ],
  igualdad: [
    { title: 'Reforma de la Mudawana', cost: 0, stats: { apr: +3, est: -2 } }
  ]
};


// =====================================================================
// 6. HOUSING_EVENTS — protestas sociales
// =====================================================================
const HOUSING_EVENTS = [
  {
    id: 'HOUS_1',
    category: 'PROTESTAS SOCIALES',
    title: 'ESTADIOS FRENTE A HOSPITALES Y ESCUELAS',
    desc: 'Los jóvenes protestan: piden que el dinero de las grandes obras deportivas se destine a sanidad y educación.',
    options: [
      { text: 'Reorientar fondos a hospitales y escuelas', stats: { apr: +8, est: +4, eco: -1 }, cost: 600, loyaltyImpact: { USFP: +10, PPS: +10, RNI: -8 }, news: 'El Gobierno reorienta fondos de las obras del Mundial a hospitales y escuelas tras las protestas.' },
      { text: 'Mantener el calendario de obras del Mundial 2030', stats: { apr: -7, est: -4, eco: +3 }, cost: 0, loyaltyImpact: { RNI: +8, PI: +5 }, news: 'El Gobierno mantiene el calendario del Mundial 2030 y las protestas juveniles se endurecen.' }
    ]
  },
  {
    id: 'HOUS_2',
    category: 'PROTESTAS SOCIALES',
    title: 'PROTESTAS JUVENILES',
    desc: 'Miles de jóvenes salen a la calle exigiendo sanidad, educación y empleo.',
    options: [
      { text: 'Abrir diálogo y reformas', stats: { apr: +6, est: +4 }, cost: 300, loyaltyImpact: {}, news: 'El Gobierno abre un diálogo con los jóvenes y anuncia reformas en sanidad, educación y empleo.' },
      { text: 'Mano dura y detenciones', stats: { est: -2, apr: -7, mil: +2 }, cost: 0, loyaltyImpact: {}, news: 'Las fuerzas del orden disuelven las protestas con detenciones y crece la indignación.' }
    ]
  }
];


// =====================================================================
// 7. REAL_MINISTERS
//  · El efecto «Palacio» de los ministros originales se ha omitido.
//  · Sin candidatos para: trabajo, vivienda, igualdad.
// =====================================================================
const REAL_MINISTERS = [
  // --- ECONOMÍA (Economía, Finanzas y Performance Pública · Industria y Comercio · IA y Transformación Digital) ---
  {
    id: 'lekjaa_pam', name: 'Fouzi Lekjaa', party: 'PAM', portfolio: 'economia',
    desc: '+1.5% Economía (ejecución presupuestaria)',
    pros: '+1.5% Economía (ejecución presupuestaria)',
    cons: '-0.5% Estabilidad (choque abierto con el RNI)',
    effects: { eco: 1.5, est: -0.5 }
  },
  {
    id: 'mezzour_pi', name: 'Ryad Mezzour', party: 'PI', portfolio: 'economia',
    desc: '+2.0% Economía (automoción y aeronáutica)',
    pros: '+2.0% Economía (automoción y aeronáutica)',
    cons: '-0.5% Aprobación',
    effects: { eco: 2.0, apr: -0.5 }
  },
  {
    id: 'rahhou_otr', name: 'Ahmed Rahhou', party: 'OTR', portfolio: 'economia',
    desc: '+1.0% Economía (Estado digital)',
    pros: '+1.0% Economía (Estado digital)',
    cons: 'Perfil técnico sin base política',
    effects: { eco: 1.0 }
  },
  // --- INTERIOR ---
  {
    id: 'laftit_otr', name: 'Abdelouafi Laftit', party: 'OTR', portfolio: 'interior',
    desc: '+2.0% Estabilidad',
    pros: '+2.0% Estabilidad',
    cons: '-1.0% Aprobación (mano dura)',
    effects: { est: 2.0, apr: -1.0 }
  },
  // --- DEFENSA ---
  {
    id: 'loudiyi_otr', name: 'Abdellatif Loudiyi', party: 'OTR', portfolio: 'defensa',
    desc: '+2.0% Lealtad militar',
    pros: '+2.0% Lealtad militar',
    cons: 'Sin control parlamentario',
    effects: { mil: 2.0 }
  },
  // --- EXTERIORES ---
  {
    id: 'bourita_otr', name: 'Nasser Bourita', party: 'OTR', portfolio: 'exteriores',
    desc: '+0.5% Economía, +0.5% Confianza del Palacio',
    pros: '+0.5% Economía, +0.5% Confianza del Palacio',
    cons: 'Diplomacia opaca para la coalición',
    effects: { eco: 0.5, con: 0.5 }
  },
  // --- JUSTICIA ---
  {
    id: 'ouahbi_pam', name: 'Abdellatif Ouahbi', party: 'PAM', portfolio: 'justicia',
    desc: '+1.0% Estabilidad',
    pros: '+1.0% Estabilidad',
    cons: '-1.0% Aprobación (polémicas constantes)',
    effects: { est: 1.0, apr: -1.0 }
  },
  // --- EDUCACIÓN (Educación Nacional y FP · Enseñanza Superior) ---
  {
    id: 'benabdallah_pps', name: 'Nabil Benabdallah', party: 'PPS', portfolio: 'educacion',
    desc: '+1.0% Aprobación (reforma escolar)',
    pros: '+1.0% Aprobación (reforma escolar)',
    cons: '-0.5% Estabilidad (huelgas docentes)',
    effects: { apr: 1.0, est: -0.5 }
  },
  {
    id: 'elmidaoui_pam', name: 'Azzeddine El Midaoui', party: 'PAM', portfolio: 'educacion',
    desc: '+1.0% Empleo (universidad e innovación)',
    pros: '+1.0% Empleo (universidad e innovación)',
    cons: '-0.5% Aprobación',
    effects: { emp: 1.0, apr: -0.5 }
  },
  // --- SANIDAD ---
  {
    id: 'bjijou_usfp', name: 'Youns Bjijou', party: 'USFP', portfolio: 'sanidad',
    desc: '+1.5% Aprobación (reforma hospitalaria y AMO)',
    pros: '+1.5% Aprobación (reforma hospitalaria y AMO)',
    cons: '-0.5% Economía (coste del sistema)',
    effects: { apr: 1.5, eco: -0.5 }
  },
  // --- TERRITORIO (Agricultura, Pesca y Soberanía Alimentaria) ---
  {
    id: 'hatimy_pam', name: 'Khalid Hatimy', party: 'PAM', portfolio: 'territorio',
    desc: '+1.0% Economía, +0.5% Estabilidad',
    pros: '+1.0% Economía, +0.5% Estabilidad',
    cons: '-0.5% Aprobación (precios de los alimentos)',
    effects: { eco: 1.0, est: 0.5, apr: -0.5 }
  },
  // --- INFRAESTRUCTURAS (Transporte y Logística) ---
  {
    id: 'kayouh_pi', name: 'Abdessamad Kayouh', party: 'PI', portfolio: 'infraestructuras',
    desc: '+1.5% Economía (logística y obra pública)',
    pros: '+1.5% Economía (logística y obra pública)',
    cons: 'Peso propio del Istiqlal en el Gobierno',
    effects: { eco: 1.5 }
  },
  // --- TRANSICIÓN ECOLÓGICA (Equipamiento y Agua · Energía, Minas y Desarrollo Sostenible) ---
  {
    id: 'baraka_pi', name: 'Nizar Baraka', party: 'PI', portfolio: 'transicion_ecologica',
    desc: '+1.5% Economía (obra pública y agua)',
    pros: '+1.5% Economía (obra pública y agua)',
    cons: 'Peso propio del Istiqlal en el Gobierno',
    effects: { eco: 1.5 }
  },
  {
    id: 'afailal_pps', name: 'Charafat Afailal', party: 'PPS', portfolio: 'transicion_ecologica',
    desc: '+1.5% Economía, +0.5% Estabilidad (agua y energía)',
    pros: '+1.5% Economía, +0.5% Estabilidad (agua y energía)',
    cons: '-0.5% Aprobación',
    effects: { eco: 1.5, est: 0.5, apr: -0.5 }
  },
  // --- CULTURA (Juventud, Cultura y Deportes · Habices y Asuntos Islámicos) ---
  {
    id: 'bensaid_pam', name: 'Mohamed Mehdi Bensaid', party: 'PAM', portfolio: 'cultura',
    desc: '+1.0% Aprobación (juventud y Mundial)',
    pros: '+1.0% Aprobación (juventud y Mundial)',
    cons: '-0.5% Estabilidad',
    effects: { apr: 1.0, est: -0.5 }
  },
  {
    id: 'toufiq_otr', name: 'Ahmed Toufiq', party: 'OTR', portfolio: 'cultura',
    desc: '+1.0% Estabilidad',
    pros: '+1.0% Estabilidad',
    cons: 'Poco margen para reformas',
    effects: { est: 1.0 }
  },
  // --- TRABAJO (Empleo y Diálogo Social) ---
  {
    id: 'chahid_usfp', name: 'Abderrahim Chahid', party: 'USFP', portfolio: 'trabajo',
    desc: '+1.5% Empleo, +0.5% Estabilidad (diálogo social)',
    pros: '+1.5% Empleo, +0.5% Estabilidad (diálogo social)',
    cons: '-0.5% Economía',
    effects: { emp: 1.5, est: 0.5, eco: -0.5 }
  },
  // --- VIVIENDA (Ordenación del Territorio, Urbanismo, Vivienda y Política de la Ciudad) ---
  {
    id: 'belfkih_pam', name: 'Samir Belfkih', party: 'PAM', portfolio: 'vivienda',
    desc: '+1.0% Aprobación (vivienda y ciudades)',
    pros: '+1.0% Aprobación (vivienda y ciudades)',
    cons: '-0.5% Economía',
    effects: { apr: 1.0, eco: -0.5 }
  },
  // --- IGUALDAD (Familia, Desarrollo Social e Igualdad) ---
  {
    id: 'koukouss_otr', name: 'Najwa Koukouss', party: 'OTR', portfolio: 'igualdad',
    desc: '+1.0% Aprobación, +0.5% Estabilidad (política familiar)',
    pros: '+1.0% Aprobación, +0.5% Estabilidad (política familiar)',
    cons: 'Margen limitado ante el sector conservador',
    effects: { apr: 1.0, est: 0.5 }
  }
];


// =====================================================================
// 8. GOAL_POOL
//  · «Deuda Bajo Control» (deuda ≤ 60 % del PIB) omitida: no hay
//    equivalente en el estado de la plantilla.
//  · «Confianza del Palacio» usa la métrica `con`.
// =====================================================================
const GOAL_POOL = [
  { id: 'eco',     icon: 'fa-chart-line',     title: 'Milagro Económico',           desc: 'Mantén la Economía ≥ 70%',             check: s => s.metrics.eco >= 70 },
  { id: 'est',     icon: 'fa-shield-halved',  title: 'Paz Social',                  desc: 'Mantén la Estabilidad ≥ 65%',          check: s => s.metrics.est >= 65 },
  { id: 'apr',     icon: 'fa-heart',          title: 'Jefe de Gobierno Querido',    desc: 'Mantén la Aprobación ≥ 65%',           check: s => s.metrics.apr >= 65 },
  { id: 'emp',     icon: 'fa-briefcase',      title: 'Pleno Empleo',                desc: 'Mantén el Empleo ≥ 70%',               check: s => s.metrics.emp >= 70 },
  { id: 'mil',     icon: 'fa-person-military-pointing', title: 'Cuarteles en Calma', desc: 'Mantén la fuerza de las FAR ≥ 60%',   check: s => s.metrics.mil >= 60 },
  { id: 'caja',    icon: 'fa-vault',          title: 'Superávit',                   desc: 'Acumula una tesorería ≥ 80.000 M€',    check: s => (Number(s.treasury) || 0) >= 80000 },
  { id: 'palacio', icon: 'fa-crown',          title: 'Confianza del Palacio',       desc: 'Confianza del Palacio ≥ 75%',          check: s => s.metrics.con >= 75 },
  { id: 'doble',   icon: 'fa-scale-balanced', title: 'Doble Confianza',             desc: 'Aprobación ≥ 60% y Estabilidad ≥ 60%', check: s => s.metrics.apr >= 60 && s.metrics.est >= 60 },
  { id: 'todo',    icon: 'fa-star',           title: 'Marruecos Equilibrado',       desc: 'Todas las métricas ≥ 55%',             check: s => Object.values(s.metrics).every(v => v >= 55) }
];


// =====================================================================
// 9. GOAL_ACTIONS
//  · Las 7 acciones de gobierno originales + las acciones de ingreso de
//    las secciones Tesorería y Finanzas (cost 0 + gain). Su efecto sobre
//    la deuda (debt) se ha omitido.
//  · La recompensa de misión (goalReward: 10 cap, 300 M€) no tiene campo.
// =====================================================================
const GOAL_ACTIONS = [
  { id: 'tv',        icon: 'fa-tv',                  title: 'Comparecencia televisada',                 cap: 15, cost: 0,   cd: 30,  fx: { apr: 6, est: 2 },         news: 'El Jefe de Gobierno comparece en prime time y remonta en las encuestas.' },
  { id: 'ue',        icon: 'fa-earth-europe',        title: 'Cumbre UE–Marruecos (Asociación)',          cap: 20, cost: 0,   cd: 45,  fx: { eco: 6, apr: 2 },         news: 'Bruselas desbloquea fondos de la asociación con Marruecos y elogia las reformas del Gobierno.' },
  { id: 'pacto',     icon: 'fa-handshake',           title: 'Pacto social y político',                  cap: 25, cost: 0,   cd: 60,  fx: { est: 6, apr: 3 },         news: 'Gobierno, sindicatos y oposición firman un pacto histórico.' },
  { id: 'empleo',    icon: 'fa-hammer',              title: 'Plan de choque del empleo',                cap: 10, cost: 300, cd: 40,  fx: { emp: 8, eco: 3 },         news: 'El Gobierno lanza un plan de choque con 300 M€ contra el paro.' },
  { id: 'army',      icon: 'fa-medal',               title: 'Reforma de las FAR',                       cap: 15, cost: 250, cd: 50,  fx: { mil: 8, apr: -3 },        news: 'Se modernizan las Fuerzas Armadas Reales; el Ejército responde con lealtad.' },
  { id: 'ahorro',    icon: 'fa-piggy-bank',          title: 'Recorte del gasto público',                cap: 0,  cost: 0,   cd: 60,  fx: { apr: -5, est: -2 }, gain: 600,  news: 'Austeridad: el Gobierno recorta gasto y ahorra 600 M€, a costa de la calle.' },
  { id: 'trono',     icon: 'fa-crown',               title: 'Audiencia con el Rey y Discurso del Trono', cap: 12, cost: 0,  cd: 90,  fx: { con: 8, apr: 2 },         news: 'El Rey recibe al Jefe de Gobierno y respalda su hoja de ruta.' },
  { id: 'privatizar', icon: 'fa-building-columns',   title: 'Privatizar participaciones públicas',      cap: 3,  cost: 0,   cd: 120, fx: { apr: -3, eco: 1, con: -1 }, gain: 900,  news: 'El Gobierno vende participaciones de empresas públicas e ingresa 900 M€.' },
  { id: 'amnistia',  icon: 'fa-file-invoice-dollar', title: 'Amnistía fiscal parcial',                  cap: 2,  cost: 0,   cd: 90,  fx: { apr: -2, est: -1 },       gain: 500,  news: 'Una amnistía fiscal parcial hace aflorar capitales y llena las arcas con 500 M€.' },
  { id: 'iva',       icon: 'fa-receipt',             title: 'Cobrar el IVA de forma más estricta',      cap: 2,  cost: 0,   cd: 60,  fx: { apr: -2, eco: -1 },       gain: 350,  news: 'Hacienda refuerza la recaudación del IVA y suma 350 M€.' },
  { id: 'ocp',       icon: 'fa-industry',            title: 'Dividendos de OCP (fosfatos)',             cap: 2,  cost: 0,   cd: 120, fx: { eco: 1, apr: -1 },        gain: 400,  news: 'El Estado exige a OCP un dividendo extraordinario de 400 M€.' },
  { id: 'mre',       icon: 'fa-plane-arrival',       title: 'Remesas de los MRE: plan de atracción',    cap: 3,  cost: 0,   cd: 90,  fx: { eco: 1, con: 1 },         gain: 250,  news: 'Un plan de incentivos atrae 250 M€ de remesas de los marroquíes del exterior.' },
  { id: 'bonos',     icon: 'fa-hand-holding-dollar', title: 'Emisión soberana en mercados internacionales',      cap: 4, cost: 0, cd: 150, fx: { apr: -1, con: -1 }, gain: 1500, news: 'Marruecos emite deuda soberana en los mercados internacionales y capta 1.500 M€.' },
  { id: 'reffiscal', icon: 'fa-scale-unbalanced',    title: 'Reforma fiscal (Ley marco 69-19)',         cap: 4,  cost: 0,   cd: 150, fx: { apr: -2, eco: 1 },        gain: 300,  news: 'La reforma fiscal ensancha la base tributaria y recauda 300 M€ más.' }
];


// =====================================================================
// 10. FOCUS_TREE
//  · Se omiten los efectos ES / rel del foco d2.
// =====================================================================
const FOCUS_TREE = [
  { id: 'e1', b: 'eco', title: 'Reforma fiscal (Ley marco 69-19)',           days: 365, now: { eco: 4 },            spirit: { name: 'Hacienda Eficiente',           daily: {},                     money: 120 } },
  { id: 'e2', b: 'eco', title: 'Plan de Aceleración Industrial',             days: 420, req: 'e1', now: { emp: 3 },  spirit: { name: 'Polos Industriales',           daily: { eco: .05, emp: .04 }, money: 0 } },
  { id: 'e3', b: 'eco', title: 'Fondos europeos y del Golfo',                days: 480, req: 'e2', now: { apr: 2 }, cash: 1500, spirit: null },
  { id: 'e4', b: 'eco', title: 'Marca «Maroc»',                              days: 540, req: 'e3', now: {},         spirit: { name: 'Marca Marruecos',              daily: { eco: .06, apr: .03 }, money: 150 } },
  { id: 's1', b: 'soc', title: 'Protección social generalizada',             days: 365, now: { apr: 3 },            spirit: { name: 'Cobertura Universal',          daily: { est: .03 },           money: -80 } },
  { id: 's2', b: 'soc', title: 'Pacto educativo',                            days: 420, req: 's1', now: {},         spirit: { name: 'Capital Humano',               daily: { emp: .04, eco: .02 }, money: -60 } },
  { id: 's3', b: 'soc', title: 'Vivienda y ciudades nuevas',                 days: 480, req: 's2', now: { apr: 4 }, spirit: { name: 'Acceso a la Vivienda',         daily: { apr: .05 },           money: -70 } },
  { id: 's4', b: 'soc', title: 'Estado Social',                              days: 540, req: 's3', now: { est: 4 }, spirit: { name: 'Bienestar Social',             daily: { est: .05, apr: .04 }, money: -110 } },
  { id: 'g1', b: 'seg', title: 'Modernización policial (DGSN)',              days: 365, now: { est: 4 },            spirit: { name: 'Policía Moderna',              daily: { est: .03 },           money: -50 } },
  { id: 'g2', b: 'seg', title: 'Ciberseguridad nacional',                    days: 420, req: 'g1', now: {},         spirit: { name: 'Escudo Digital',               daily: { est: .03, eco: .02 }, money: -50 } },
  { id: 'g3', b: 'seg', title: 'FAR profesionales',                          days: 480, req: 'g2', now: { mil: 6 }, spirit: { name: 'Tropa Profesional',            daily: { mil: .05 },           money: -90 } },
  { id: 'g4', b: 'seg', title: 'Pacto de defensa con EE. UU. (African Lion)', days: 540, req: 'g3', now: { mil: 4 }, spirit: { name: 'Socio Estratégico de EE. UU.', daily: { mil: .04, est: .03 }, money: -100 } },
  { id: 'd1', b: 'dip', title: 'Diplomacia africana',                        days: 365, now: { apr: 2 },            spirit: { name: 'Voz en África',                daily: { apr: .03 },           money: 0 } },
  { id: 'd2', b: 'dip', title: 'Eje con Bruselas y Madrid',                  days: 420, req: 'd1', now: {}, cash: 1000, spirit: { name: 'Socio Fiable',               daily: { eco: .04 },           money: 0 } },
  { id: 'd3', b: 'dip', title: 'Asociación con EE. UU. y el Golfo',          days: 480, req: 'd2', now: { est: 3, mil: 3 }, spirit: null },
  { id: 'd4', b: 'dip', title: 'Iniciativa Atlántica y liderazgo africano',  days: 540, req: 'd3', now: {},         spirit: { name: 'Potencia Regional',            daily: { apr: .05, eco: .04 }, money: 100 } }
];


// =====================================================================
// 11. FOCUS_LINKS
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
// 12. SHOCK_POOL
//  · Efectos sobre `debt` omitidos (prima de riesgo).
// =====================================================================
const SHOCK_POOL = [
  { cat: 'EMERGENCIAS', min: 'interior', title: 'INCENDIOS FORESTALES EN EL RIF', desc: 'Varias provincias del norte arden a la vez y piden ayuda urgente al Estado.',
    options: [
      { text: 'Desplegar medios extraordinarios', cost: 250, stats: { est: 3, apr: 2 },  news: 'El Estado despliega medios extraordinarios y controla los incendios del Rif.' },
      { text: 'Dejar que actúen las provincias',  cost: 0,   stats: { est: -4, apr: -5 }, news: 'Las provincias del norte quedan solas ante las llamas y crece la indignación.' }
    ] },
  { cat: 'LABORAL', min: 'trabajo', title: 'HUELGA GENERAL', desc: 'Los sindicatos convocan un paro nacional contra la política laboral.',
    options: [
      { text: 'Abrir mesa de negociación', cost: 100, stats: { emp: 3, apr: 2, eco: -2 },  news: 'El Gobierno abre una mesa de negociación y se desconvoca el paro general.' },
      { text: 'Mantener la postura',       cost: 0,   stats: { est: -5, apr: -6, eco: -3 }, news: 'El paro general paraliza el país mientras el Gobierno mantiene su postura.' }
    ] },
  { cat: 'CORRUPCIÓN', min: 'justicia', title: 'ESCÁNDALO DE CORRUPCIÓN', desc: 'Un informe de la Cour des comptes señala a un alto cargo de tu entorno.',
    options: [
      { text: 'Cesar al implicado',       cost: 0, stats: { apr: -4 },                 news: 'El Gobierno cesa al alto cargo señalado por la Cour des comptes.' },
      { text: 'Negar y cerrar filas',     cost: 0, stats: { apr: -9, est: -3, con: -2 }, news: 'El Gobierno cierra filas y el escándalo de corrupción llega hasta el Palacio.' }
    ] },
  { cat: 'MERCADOS', min: 'economia', title: 'DISPARO DE LA PRIMA DE RIESGO', desc: 'Los inversores desconfían de la deuda marroquí y exigen intereses más altos.',
    options: [
      { text: 'Anunciar recortes',   cost: 0, stats: { eco: 3, apr: -5, emp: -2 }, news: 'El Gobierno anuncia recortes y los mercados respiran, pero la calle protesta.' },
      { text: 'Aguantar el pulso',   cost: 0, stats: { eco: -6, emp: -2 },          news: 'El Gobierno aguanta el pulso a los mercados y la deuda se encarece.' }
    ] },
  { cat: 'CIBERSEGURIDAD', min: 'defensa', title: 'CIBERATAQUE A MINISTERIOS', desc: 'Atacantes desconocidos paralizan sistemas críticos del Estado.',
    options: [
      { text: 'Contratar respuesta de emergencia', cost: 80, stats: { est: 2, mil: 1 },  news: 'Una respuesta de emergencia restablece los sistemas de los ministerios atacados.' },
      { text: 'Resolverlo con medios propios',     cost: 0,  stats: { eco: -5, est: -3 }, news: 'Los ministerios siguen paralizados días después del ciberataque.' }
    ] },
  { cat: 'ENERGÍA', min: 'transicion_ecologica', title: 'CRISIS ENERGÉTICA Y DEL BUTANO', desc: 'La energía se dispara y las familias no llegan a fin de mes.',
    options: [
      { text: 'Subsidiar la factura', cost: 450, stats: { eco: 2, apr: 3 },         news: 'El Gobierno subsidia la factura energética y alivia a las familias.' },
      { text: 'Dejar actuar al mercado', cost: 0, stats: { eco: -6, emp: -3, apr: -3 }, news: 'Se dispara el precio del butano y las familias recortan gastos básicos.' }
    ] },
  { cat: 'MILITAR', min: 'defensa', title: 'RUIDO DE SABLES', desc: 'Mandos militares critican en privado tu gestión y hay malestar en los cuarteles.',
    options: [
      { text: 'Ascensos y mejoras salariales', cost: 200, stats: { mil: 6, apr: -1 },  news: 'El Gobierno aprueba ascensos y mejoras salariales para calmar los cuarteles.' },
      { text: 'Ignorar el malestar',           cost: 0,   stats: { mil: -8, est: -2 }, news: 'El malestar militar se agranda ante el silencio del Gobierno.' }
    ] },
  { cat: 'ECONOMÍA', min: 'exteriores', title: 'REMESAS RÉCORD DE LOS MRE', desc: 'Los marroquíes del exterior envían cifras históricas de divisas.',
    options: [
      { text: 'Canalizarlas a inversión',  cost: 100,  stats: { eco: 3, emp: 1 }, news: 'El Gobierno canaliza las remesas récord de los MRE hacia proyectos de inversión.' },
      { text: 'Gastarlas en consumo',      cost: -200, stats: { apr: 2 },         news: 'Las remesas récord de los MRE alimentan el consumo de las familias.' }
    ] }
];


// =====================================================================
// 13. INTL_ACTIONS — sección de relaciones con la UE. Marruecos NO es
//     miembro de la UE: son acuerdos de asociación con Bruselas y Madrid
//     (efectos sobre España omitidos). cost < 0 = ingreso.
// =====================================================================
const INTL_ACTIONS = [
  { id: 'pesca',   title: 'Renovar el acuerdo pesquero UE–Marruecos',   cap: 3, cost: -300, rel: 3, cd: 120 },
  { id: 'asoc',    title: 'Asociación avanzada con la UE',              cap: 5, cost: 0,    rel: 4, cd: 180 },
  { id: 'migra',   title: 'Pacto migratorio con Bruselas',              cap: 4, cost: -500, rel: 4, cd: 120 },
  { id: 'energia', title: 'Corredor de energía verde con Europa',       cap: 5, cost: 400,  rel: 3, cd: 150 },
  { id: 'visados', title: 'Negociar visados Schengen',                  cap: 3, cost: 0,    rel: 2, cd: 120 },
  { id: 'cables',  title: 'Conectar los cables eléctricos con España',  cap: 4, cost: 300,  rel: 3, cd: 120 }
];


// =====================================================================
// 14. PROJECTS
//  · Se omite `done: { ES, rel }` del Mundial y el efecto «Palacio».
// =====================================================================
const PROJECTS = [
  { id: 'tgv', icon: 'fa-train', title: 'Alta velocidad Kenitra–Marrakech', spirit: { name: 'Red Ferroviaria Al Boraq', daily: { eco: .04, emp: .02 }, money: 60 },
    phases: [
      { n: 'Estudios, trazado y licitación',      cost: 400,  days: 30,  now: {},                run: {} },
      { n: 'Obra civil y vías',                   cost: 3500, days: 120, now: { emp: 2, eco: 1 }, run: { emp: .02, eco: .01 } },
      { n: 'Material móvil y puesta en servicio', cost: 900,  days: 45,  now: { eco: 2, emp: 1 }, run: {} }
    ] },
  { id: 'nador', icon: 'fa-ship', title: 'Puerto Nador West Med', spirit: { name: 'Hub Mediterráneo', daily: { eco: .05, emp: .02 }, money: 90 },
    phases: [
      { n: 'Licitación y dragado',          cost: 150, days: 30,  now: {},                run: {} },
      { n: 'Diques, muelles y terminales',  cost: 750, days: 110, now: { emp: 1, eco: 1 }, run: { emp: .015, eco: .01 } },
      { n: 'Zona logística y apertura',     cost: 200, days: 40,  now: { eco: 3 },         run: {} }
    ] },
  { id: 'agua', icon: 'fa-droplet', title: 'Desaladoras y Plan Nacional del Agua', spirit: { name: 'Seguridad Hídrica', daily: { est: .03, eco: .02, apr: .01 }, money: -40 },
    phases: [
      { n: 'Estudios y evaluación ambiental',              cost: 200,  days: 30,  now: {},                 run: {} },
      { n: 'Plantas y conducciones (Casablanca, Dakhla)',  cost: 1100, days: 100, now: { emp: 1 },          run: { emp: .012 } },
      { n: 'Interconexión de presas y puesta en marcha',   cost: 350,  days: 45,  now: { est: 3, apr: 2 },  run: {} }
    ] },
  { id: 'solar', icon: 'fa-solar-panel', title: 'Complejo solar Noor y red eléctrica', spirit: { name: 'Independencia Energética', daily: { eco: .05 }, money: 120 },
    phases: [
      { n: 'Concursos y permisos',              cost: 250,  days: 40,  now: {},                run: {} },
      { n: 'Parques solares, eólicos y líneas', cost: 1500, days: 130, now: { eco: 1, emp: 1 }, run: { emp: .015, eco: .01 } },
      { n: 'Almacenamiento y exportación',      cost: 500,  days: 50,  now: { eco: 3 },         run: {} }
    ] },
  { id: 'viv', icon: 'fa-house', title: 'Vivienda social y ciudades nuevas', spirit: { name: 'Parque Público', daily: { apr: .04, est: .02 }, money: -60 },
    phases: [
      { n: 'Cesión de suelo y proyecto',  cost: 150, days: 30,  now: {},         run: {} },
      { n: 'Construcción de viviendas',   cost: 900, days: 100, now: { emp: 1 }, run: { emp: .015 } },
      { n: 'Adjudicación y entrega',      cost: 250, days: 35,  now: { apr: 5 }, run: {} }
    ] },
  { id: 'digi', icon: 'fa-microchip', title: 'Maroc Digital 2030', spirit: { name: 'Estado Digital', daily: { eco: .03, emp: .03 }, money: 40 },
    phases: [
      { n: 'Diseño y contratación',              cost: 120, days: 25, now: {},                run: {} },
      { n: 'Redes, centros de datos y sistemas', cost: 800, days: 80, now: { eco: 1 },         run: { eco: .01 } },
      { n: 'Migración y formación',              cost: 300, days: 40, now: { eco: 2, emp: 2 }, run: {} }
    ] },
  { id: 'mundial', icon: 'fa-futbol', title: 'Estadio Hassan II y Mundial 2030', spirit: { name: 'Legado Mundialista', daily: { apr: .04, eco: .03 }, money: 50 },
    phases: [
      { n: 'Diseño y licitación',          cost: 60, days: 30,  now: {},                run: {} },
      { n: 'Obra del estadio y accesos',   cost: 340, days: 120, now: { emp: 1, apr: 1 }, run: { emp: .015 } },
      { n: 'Pruebas e inauguración',       cost: 100, days: 35,  now: { apr: 5 },         run: {} }
    ] },
  { id: 'dakhla', icon: 'fa-anchor', title: 'Puerto Atlántico de Dakhla', spirit: { name: 'Eje Atlántico', daily: { eco: .04 }, money: 70 },
    phases: [
      { n: 'Estudios y financiación',          cost: 150, days: 30,  now: {},                run: {} },
      { n: 'Obras portuarias y zona franca',   cost: 800, days: 110, now: { emp: 1 },         run: { emp: .015, eco: .01 } },
      { n: 'Conexión viaria y apertura',       cost: 200, days: 40,  now: { eco: 2 },         run: {} }
    ] }
];


// =====================================================================
// 15. ACHIEVEMENTS
//  · «Superviviente» sigue la plantilla (completar una legislatura): la
//    versión original (sobrevivir a una moción de censura) no tiene
//    estado equivalente.
//  · VERIFICAR rutas de estado en 'cred' (banco central) y 'year' (días
//    en el cargo): no aparecen entre las claves que documenta la plantilla.
// =====================================================================
const ACHIEVEMENTS = [
  { id: 'm1',    icon: 'fa-flag',            title: 'Primer Mandato',          desc: 'Cumple tu primera misión',                  ok: s => s.goals && s.goals.done >= 1 },
  { id: 'm5',    icon: 'fa-list-check',      title: 'Gestor Eficaz',           desc: 'Cumple 5 misiones',                         ok: s => s.goals && s.goals.done >= 5 },
  { id: 'f1',    icon: 'fa-diagram-project', title: 'Visión de Estado',        desc: 'Completa un foco nacional',                 ok: s => s.focus && s.focus.done.length >= 1 },
  { id: 'fb',    icon: 'fa-sitemap',         title: 'Doctrina Completa',       desc: 'Completa una rama entera de focos',         ok: s => s.focus && Object.keys(FOCUS_BRANCHES).some(b => FOCUS_TREE.filter(f => f.b === b).every(f => s.focus.done.includes(f.id))) },
  { id: 'p3',    icon: 'fa-helmet-safety',   title: 'Constructor de Marruecos', desc: 'Termina 3 proyectos de Estado',            ok: s => s.proj && s.proj.done.length >= 3 },
  { id: 'rich',  icon: 'fa-vault',           title: 'Caja Fuerte',             desc: 'Llega a 80.000 M€ en Tesorería',            ok: s => (Number(s.treasury) || 0) >= 80000 },
  { id: 'all',   icon: 'fa-star',            title: 'País de Primera',         desc: 'Todas las métricas ≥ 70% a la vez',         ok: s => s.metrics && ['eco', 'est', 'emp', 'apr', 'mil'].every(k => s.metrics[k] >= 70) },
  { id: 'abyss', icon: 'fa-skull',           title: 'Al Borde del Abismo',     desc: 'Emite más de 6.000 M€ de deuda nueva',      ok: s => s.debt && s.debt.amount >= 6000 },
  { id: 'cred',  icon: 'fa-building-columns', title: 'Banco Creíble',          desc: 'Credibilidad de Bank Al-Maghrib ≥ 85%',     ok: s => s.bde && s.bde.cred >= 85 },
  { id: 'surv',  icon: 'fa-shield',          title: 'Superviviente',           desc: 'Completa una legislatura',                  ok: s => s.campaign && s.campaign.history.length >= 1 },
  { id: 'year',  icon: 'fa-calendar-check',  title: 'Primer Año de Mandato',   desc: 'Cumple un año en el poder',                 ok: s => (s.daysInOffice || 0) >= 365 }
];


// =====================================================================
// 16. BDE_GOVS — gobernadores de Bank Al-Maghrib
//     (IDs de la plantilla: Berrada -> tecnico · Jouahri -> indep)
// =====================================================================
const BDE_GOVS = [
  { id: 'tecnico', name: 'Salma Berrada',      tag: 'Tecnócrata ortodoxa',  cred: 10,  desc: 'Prioriza la inflación y el equilibrio exterior. Los mercados la adoran, la calle menos.' },
  { id: 'afin',    name: 'Youssef Tazi',       tag: 'Afín al Gobierno',     cred: -10, desc: 'Informes amables y crédito fácil; los inversores desconfían.' },
  { id: 'indep',   name: 'Abdellatif Jouahri', tag: 'Wali histórico',       cred: 15,  desc: 'Al frente del banco desde 2003: los mercados y el Palacio le respetan; informes sobrios y poco complacientes.' }
];


// =====================================================================
// 17. BDE_ACTIONS — acciones de Bank Al-Maghrib
//  · El tipo director, la banda del dírham y los meses de reservas del
//    original no existen en el estado B de la plantilla: se omiten.
//  · Condiciones `when` originales (rate>1, band<8, res>2, cred>25)
//    sustituidas por () => true.
//  · Las acciones que ingresaban liquidez usan registerFinancialTransaction.
// =====================================================================
const BDE_ACTIONS = [
  { id: 'rate_down', icon: 'fa-arrow-trend-down', label: 'Bajar el tipo director (−25 pb)', desc: 'Abarata el crédito: más actividad y empleo, algo más de inflación.', cost: 0, cd: 45, when: () => true,
    run: B => { B.cred -= 1; focusMetricAdd('eco', 2); focusMetricAdd('emp', 1); } },
  { id: 'rate_up', icon: 'fa-arrow-trend-up', label: 'Subir el tipo director (+25 pb)', desc: 'Frena la inflación y refuerza la moneda, a costa de la actividad.', cost: 0, cd: 45, when: () => true,
    run: B => { B.cred += 2; B.shock -= 10; focusMetricAdd('eco', -1); focusMetricAdd('apr', -1); focusMetricAdd('est', 1); } },
  { id: 'band', icon: 'fa-arrows-left-right', label: 'Flexibilizar la banda del dírham', desc: 'Amplía la banda de fluctuación: más competitividad exterior, algo de volatilidad.', cost: 0, cd: 90, when: () => true,
    run: B => { B.cred += 1; focusMetricAdd('eco', 2); focusMetricAdd('apr', -2); } },
  { id: 'interv', icon: 'fa-vault', label: 'Intervenir con las reservas de divisas', desc: 'Defiende el dírham quemando 0,4 meses de reservas (−300 M€).', cost: 300, cd: 60, when: () => true,
    run: B => { B.cred += 4; B.shock -= 50; focusMetricAdd('est', 2); } },
  { id: 'pymes', icon: 'fa-store', label: 'Programa de finanzas para pymes', desc: 'Crédito garantizado a las pymes (−350 M€).', cost: 350, cd: 75, when: () => true,
    run: B => { B.cred += 1; focusMetricAdd('eco', 2); focusMetricAdd('emp', 3); } },
  { id: 'informe', icon: 'fa-file-lines', label: 'Encargar un informe de solvencia', desc: 'Auditoría externa que calma a los mercados (−150 M€).', cost: 150, cd: 60, when: () => true,
    run: B => { B.cred += 4; B.shock -= 15; } },
  { id: 'dividendo', icon: 'fa-hand-holding-dollar', label: 'Adelantar el beneficio de Bank Al-Maghrib', desc: 'Liquidez inmediata (+500 M€), pero huele a presión política.', cost: 0, cd: 180, when: () => true,
    run: B => { B.cred -= 10; B.shock += 20; registerFinancialTransaction('Adelanto de beneficios de Bank Al-Maghrib', 500, 'economia'); } },
  { id: 'monetiza', icon: 'fa-print', label: 'Que el banco central financie el déficit', desc: 'Financiación monetaria de +900 M€. Inflación y desconfianza garantizadas.', cost: 0, cd: 150, when: () => true,
    run: B => { B.cred -= 15; B.shock += 60; focusMetricAdd('apr', -4); focusMetricAdd('eco', -2); registerFinancialTransaction('Financiación monetaria de Bank Al-Maghrib', 900, 'economia'); } }
];


// =====================================================================
// NOTAS DE INTEGRACIÓN (para el motor principal)
//  · El motor muestra «España» y «UE» porque esas etiquetas y el mapa
//    militar están escritos dentro del script principal, no en este archivo.
//    Hay que sustituirlos por COUNTRY_PROFILE (name, inEU, intlSectionTitle,
//    militaryMapId) y dibujar renderMapaMarruecos({ military: true }) en la
//    pestaña «Militar y guerra».
// =====================================================================
