// =====================================================================
//  CONTENIDO DE ESPAÑA: escenario y decisiones, prensa, ministerios, focos,
//  proyectos, logros, Banco de España… (separado del motor de index.html).
//  Se carga ANTES del script principal. Cada país tendrá su archivo igual.
// =====================================================================

const SCENARIOS = {
ACTUAL: {
    id: 'ACTUAL',
    title: 'ESPAÑA ACTUAL (2023)',
    desc: 'Un Congreso hiperfragmentado de 350 escaños. Deberás equilibrar tensiones territoriales, reformas sociales y demandas presupuestarias.',
    parties: [
      { id: 'PODEMOS', name: 'Podemos', leader: 'Irene Montero', seats: 10, baseSeats: 10, minSeats: 2, maxSeats: 350, basePct: 4.5, color: '#a855f7', isRegional: false, ideology: 'Extrema Izquierda', spectrumOrder: 1, redLines: ['VOX', 'PP'] },
      { id: 'SUMAR', name: 'Frente Amplio', leader: 'Yolanda Díaz', seats: 30, baseSeats: 30, minSeats: 12, maxSeats: 45, basePct: 10.5, color: '#ec4899', isRegional: false, ideology: 'Izquierda', spectrumOrder: 2, redLines: ['VOX'] },
      { id: 'BNG', name: 'BNG', leader: 'Ana Pontón', seats: 3, baseSeats: 3, minSeats: 1, maxSeats: 350, basePct: 0.9, color: '#38bdf8', isRegional: true, ideology: 'Izquierda Galega', spectrumOrder: 2, redLines: ['VOX', 'PP'] },
      { id: 'BILDU', name: 'EH Bildu', leader: 'Arnaldo Otegi', seats: 7, baseSeats: 7, minSeats: 4, maxSeats: 350, basePct: 1.6, color: '#84cc16', isRegional: true, ideology: 'Izquierda Soberanista', spectrumOrder: 2, redLines: ['VOX', 'PP'] },
      { id: 'ERC', name: 'ERC', leader: 'Gabriel Rufián', seats: 9, baseSeats: 9, minSeats: 4, maxSeats: 350, basePct: 2.5, color: '#f97316', isRegional: true, ideology: 'Centroizquierda Catalana', spectrumOrder: 3, redLines: ['VOX', 'PP'] },
      { id: 'PSOE', name: 'PSOE', leader: 'Pedro Sánchez', seats: 105, baseSeats: 105, minSeats: 80, maxSeats: 350, basePct: 31.0, color: '#ef4444', isRegional: false, ideology: 'Centroizquierda', spectrumOrder: 3, redLines: ['VOX'] },
      { id: 'PNV', name: 'EAJ-PNV', leader: 'Aitor Esteban', seats: 5, baseSeats: 5, minSeats: 3, maxSeats: 350, basePct: 1.3, color: '#10b981', isRegional: true, ideology: 'Centroderecha Vasco', spectrumOrder: 5, redLines: ['VOX'] },
      { id: 'JUNTS', name: 'Junts per Catalunya', leader: 'Míriam Nogueras', seats: 9, baseSeats: 9, minSeats: 4, maxSeats: 350, basePct: 2.0, color: '#06b6d4', isRegional: true, ideology: 'Centroderecha Soberanista', spectrumOrder: 5, redLines: ['VOX'] },
      { id: 'PP', name: 'PP', leader: 'Alberto Núñez Feijóo', seats: 137, baseSeats: 137, minSeats: 85, maxSeats: 350, basePct: 33.0, color: '#3b82f6', isRegional: false, ideology: 'Derecha', spectrumOrder: 6, redLines: ['BILDU', 'PODEMOS'] },
      { id: 'VOX', name: 'VOX', leader: 'Santiago Abascal', seats: 35, baseSeats: 35, minSeats: 18, maxSeats: 350, basePct: 12.5, color: '#22c55e', isRegional: false, ideology: 'Extrema Derecha', spectrumOrder: 7, redLines: ['SUMAR', 'PODEMOS', 'BILDU', 'ERC', 'BNG', 'JUNTS'] }
    ]
  },
    };

// ==========================================
    // 1. EVENTOS DINÁMICOS Y GEOPOLÍTICOS (POPUPS ÚNICOS)
    // ==========================================
    const DYNAMIC_EVENTS = [
      {
        id: 'CRISIS_INFLACION',
        category: 'ECONOMÍA NACIONAL',
        title: 'ESPIRAL INFLACIONISTA Y CRISIS DE PRECIOS',
        desc: 'La inflación desbocada dispara el coste de la cesta básica. Sindicatos y patronal exigen pactos de rentas inmediatos.',
        condition: (m) => m.eco < 35,
        options: [
          { text: 'Topar precios de alimentos básicos e inyectar subsidios', stats: { eco: -8, est: +6, apr: +10 }, cost: 2000, loyaltyImpact: { PP: -30, VOX: -40, PNV: -25, SUMAR: +20 }, news: 'El Ejecutivo aprueba un paquete de ayuda urgente contra la inflación.' },
          { text: 'Subir tipos de interés y recortar gasto en empresas públicas', stats: { eco: +8, est: -10, apr: -12 }, cost: 0, loyaltyImpact: { SUMAR: -35, PODEMOS: -45, PP: +20, VOX: +25 }, news: 'El plan de contención fiscal frena la inflación pero causa gran malestar social.' }
        ]
      },
      {
        id: 'GEO_ARANCELES_EEUU',
        category: 'GEOPOLÍTICA & COMERCIO',
        title: 'EE. UU. IMPONE ARANCELES AGROALIMENTARIOS',
        desc: 'La administración estadounidense aprueba gravámenes masivos del 25% a las exportaciones agrícolas y vinícolas españolas.',
        condition: (m) => true,
        options: [
          { text: 'Aprobar aranceles de represalia a productos de EE. UU.', stats: { eco: -6, est: +3, apr: +6, con: -6 }, cost: 0, loyaltyImpact: { PP: -25, VOX: -30, SUMAR: +20, PODEMOS: +25 }, news: 'España responde con aranceles a Washington desatando un conflicto comercial.' },
          { text: 'Ofrecer exenciones fiscales bilaterales a multinacionales tecnológicas de EE. UU.', stats: { eco: +5, emp: +3, apr: -10 }, cost: 1500, loyaltyImpact: { SUMAR: -30, PODEMOS: -45, PP: +25, VOX: +20 }, news: 'Moncloa firma un pacto bilateral de inversión con EE. UU. criticado por la oposición.' }
        ]
      },
      {
    id: 'SPECIAL_VITO_QUILES_UAB',
    category: 'ORDEN PÚBLICO',
    title: 'ALTERCADOS EN LA UAB POR UN ACTO NO AUTORIZADO DE VITO QUILES',
    desc: 'El activista y agitador mediático Vito Quiles ha intentado impartir una charla no autorizada en el campus de la Universitat Autònoma de Barcelona (UAB). Su presencia ha provocado graves enfrentamientos entre sus simpatizantes y grupos de estudiantes antifascistas, requiriendo un despliegue policial en el campus.',
    // Octubre es el mes 9 en JavaScript (0 = Enero, 9 = Octubre)
    condition: (m) => gameState.currentDate && gameState.currentDate.getMonth() === 9,
    options: [
      {
        text: 'Enviar a la policía a intervenir en el campus y desalojar la zona para restaurar el orden',
        stats: { con: +8, apr: -6, est: -4 },
        cost: 150,
        loyaltyImpact: { VOX: +40, PP: +25, SUMAR: -45, PODEMOS: -55, ERC: -50 },
        news: 'Cargas policiales y varios detenidos en la UAB tras los altercados por el acto de Vito Quiles.'
      },
      {
        text: 'Respetar la autonomía universitaria y dejar la gestión en manos del rectorado',
        stats: { con: -7, apr: +4, est: +3 },
        cost: 0,
        loyaltyImpact: { SUMAR: +30, PODEMOS: +40, ERC: +40, PP: -35, VOX: -50 },
        news: 'Duras críticas de la oposición por la "pasividad" del Gobierno ante la tensión en la UAB.'
      }
    ]
      },      
      {
        id: 'GEO_TRATADO_CHINA',
        category: 'RELACIONES INTERNACIONALES',
        title: 'TRATADO DE LIBRE COMERCIO UE-CHINA',
        desc: 'Bruselas ultima la firma de un acuerdo comercial estratégico con Pekín que divide a los sectores industriales.',
        condition: (m) => true,
        options: [
          { text: 'Ratificar el acuerdo para abaratar componentes tecnológicos', stats: { eco: +7, emp: -6, apr: -6 }, cost: 0, loyaltyImpact: { BNG: -30, VOX: -35, PNV: +20 }, news: 'España respalda el Tratado UE-China para potenciar el sector tecnológico.' },
          { text: 'Exigir cláusulas de salvaguardia para proteger la industria manufacturera local', stats: { eco: -5, emp: +5, apr: +7 }, cost: 1000, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, VOX: +15, PNV: -20 }, news: 'El Gobierno exige vetos industriales a China para defender el empleo nacional.' }
        ]
      },
      {
        id: 'GEO_SHOCK_PETROLEO',
        category: 'ENERGÍA & INTERNACIONAL',
        title: 'CRISIS ENERGÉTICA Y BLOQUEO DEL ESTRECHO DE ORMUZ',
        desc: 'Tensiones bélicas internacionales disparan el precio del barril de petróleo un 40% en apenas semanas.',
        condition: (m) => true,
        options: [
          { text: 'Inyectar un cheque carburante directo a transportistas y familias', stats: { eco: -9, apr: +12, est: +5 }, cost: 3500, loyaltyImpact: { SUMAR: +20, PODEMOS: +25, PP: -25, VOX: -20 }, news: 'Moncloa moviliza 3.500 M€ de fondos para frenar la subida del combustible.' },
          { text: 'Acelerar la transición ecológica sin subvencionar hidrocarburos', stats: { eco: +6, est: -12, apr: -15 }, cost: 0, loyaltyImpact: { SUMAR: -30, PODEMOS: -35, VOX: -50, PP: -35 }, news: 'El Gobierno rechaza subvencionar fósiles provocando paros masivos en el transporte.' }
        ]
      },
      {
        id: 'GEO_TIPOS_BCE',
        category: 'FINANZAS EUROPEAS',
        title: 'SUBIDA ENDURECIDA DE TIPOS POR EL BCE',
        desc: 'El Banco Central Europeo eleva los tipos de interés para contener la masa monetaria, encareciendo el servicio de la deuda.',
        condition: (m) => true,
        options: [
          { text: 'Amortizar anticipadamente deuda pública utilizando la Tesorería del Estado', stats: { eco: +8, est: +4, apr: -6 }, cost: 4500, loyaltyImpact: { SUMAR: -25, PODEMOS: -35, PP: +25, PNV: +20 }, news: 'España destina 4.500 M€ a amortizar deuda y blindarse frente a Fráncfort.' },
          { text: 'Aplicar recortes preventivos en empresas y agencias estatales', stats: { eco: +5, emp: -9, apr: -14 }, cost: 0, loyaltyImpact: { SUMAR: -40, PODEMOS: -50, BNG: -30, PP: +20 }, news: 'El plan de contención fiscal del Gobierno provoca huelgas en el sector público.' }
        ]
      },
      {
        id: 'GEO_DEFICIT_UE',
        category: 'UNIÓN EUROPEA',
        title: 'PROCEDIMIENTO DE DÉFICIT EXCESIVO DE LA COMISIÓN EUROPEA',
        desc: 'Bruselas exige un ajuste fiscal inmediato de 5.000 M€ bajo amenaza de congelar los fondos de recuperación comunitarios.',
        condition: (m) => true,
        options: [
          { text: 'Aceptar el recorte fiscal exigido por Bruselas recortando partidas no prioritarias', stats: { eco: +10, est: -8, apr: -12 }, cost: 0, loyaltyImpact: { SUMAR: -40, PODEMOS: -50, PP: +25, PNV: +20 }, news: 'Moncloa aprueba el plan de ajuste exigido por la UE para blindar los fondos.' },
          { text: 'Desafiar la Directiva de Bruselas manteniendo el nivel de gasto público', stats: { eco: -8, est: +4, apr: +8, con: -10 }, cost: 0, loyaltyImpact: { SUMAR: +25, PODEMOS: +35, PP: -40, VOX: -30 }, news: 'España rechaza el ultimátum de Bruselas abriendo un pulso diplomático comunitario.' }
        ]
      },
  {
    id: 'CRISIS_SEQUIA_NACIONAL',
    category: 'MEDIO AMBIENTE & AGUA',
    title: 'EMBALSES EN MÍNIMOS Y RESTRICCIONES DE AGUA',
    desc: 'La sequía extrema deja las cuencas fluviales por debajo del 20%. Agricultura y consumo urbano compiten por las reservas.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar trasvases de emergencia y plantas desalinizadoras masivas', stats: { eco: -6, est: +5, apr: +8 }, cost: 2500, loyaltyImpact: { PP: +15, VOX: +20, ERC: -25, BNG: -20 }, news: 'Moncloa moviliza fondos para infraestructuras hídricas urgentes.' },
      { text: 'Imponer cortes de riego agrícola y priorizar consumo doméstico', stats: { eco: -10, est: -5, apr: -8 }, cost: 0, loyaltyImpact: { SUMAR: +15, PODEMOS: +20, PP: -30, VOX: -35 }, news: 'El Gobierno restringe el agua al campo provocando movilizaciones agrarias.' }
    ]
  },
  {
    id: 'TENSION_MARRUECOS_CEUTA',
    category: 'DEFENSA Y EXTERIORES',
    title: 'PRESIÓN MIGRATORIA Y DIPLOMÁTICA EN CEUTA Y MELILLA',
    desc: 'Rabat suspende unilateralmente la aduana comercial y se registran entradas masivas en la frontera.',
    condition: (m) => m.est < 50,
    options: [
      { text: 'Desplegar al Ejército en la frontera y endurecer la política exterior', stats: { eco: -2, est: +8, apr: +10, con: -8 }, cost: 150, loyaltyImpact: { VOX: +35, PP: +25, SUMAR: -30, PODEMOS: -40 }, news: 'El Defensa moviliza unidades militares para reforzar el vallado de Ceuta.' },
      { text: 'Aumentar la cooperación económica con Rabat para destensar', stats: { eco: -5, est: -4, apr: -12 }, cost: 1200, loyaltyImpact: { SUMAR: +10, PODEMOS: +10, VOX: -45, PP: -30 }, news: 'España aprueba una línea de crédito a Marruecos tras el choque fronterizo.' }
    ]
  },
  {
    id: 'HUELGA_TRANSPORTE_CARRETERA',
    category: 'INFRAESTRUCTURAS',
    title: 'PARO PATRONAL DEL TRANSPORTE POR CARRETERA',
    desc: 'Los camioneros colapsan los accesos a las grandes ciudades exigiendo topes al precio del diésel.',
    condition: (m) => m.eco < 40,
    options: [
      { text: 'Bonificar el combustible profesional y pausar los peajes en autopistas', stats: { eco: -7, est: +8, apr: +10 }, cost: 1800, loyaltyImpact: { PP: +20, VOX: +25, SUMAR: -20, PODEMOS: -25 }, news: 'Pacto de madrugada entre Fomento y transportistas para desconvocar el paro.' },
      { text: 'Movilizar a las Fuerzas de Seguridad para garantizar la cadena de suministro', stats: { eco: +3, est: -10, apr: -14 }, cost: 0, loyaltyImpact: { VOX: -30, PP: -20, SUMAR: +15, PODEMOS: +20 }, news: 'Antidisturbios escoltan los convoyes de abastecimiento en los mercas.' }
    ]
  },
  {
    id: 'CIBERATAQUE_SEPE',
    category: 'CIBERSEGURIDAD',
    title: 'SECUESTRO DIGITAL DE LA RED DE EMPLEO E INSTITUCIONES',
    desc: 'Un ciberataque internacional paraliza el cobro de prestaciones de desempleo e invalidez en todo el país.',
    condition: (m) => true,
    options: [
      { text: 'Pagar rescate encubierto y renovar los servidores estatales', stats: { eco: -4, est: +4, apr: -6 }, cost: 800, loyaltyImpact: { PP: -20, VOX: -25, PNV: +10 }, news: 'El SEPE recupera la operatividad tras semanas de colapso administrativo.' },
      { text: 'Reconstruir el sistema desde cero auditando la brecha de seguridad', stats: { eco: -2, est: -8, apr: -12 }, cost: 300, loyaltyImpact: { SUMAR: -25, PODEMOS: -30, PP: +15 }, news: 'Retrasos masivos en el pago de subsidios por la reconstrucción del sistema.' }
    ]
  },
  {
    id: 'CRISIS_VIVIENDA_ALQUILER',
    category: 'INFRAESTRUCTURAS Y VIVIENDA',
    title: 'DISPARO DEL ALQUILER EN ZONAS TENSIONADAS',
    desc: 'El precio medio del alquiler sube un 18% anual, expulsando a jóvenes y familias de los núcleos urbanos.',
    condition: (m) => m.apr < 50,
    options: [
      { text: 'Topar por ley las rentas e imponer recargos IBI a pisos vacíos', stats: { eco: -4, est: -6, apr: +12 }, cost: 200, loyaltyImpact: { SUMAR: +35, PODEMOS: +40, PP: -40, VOX: -45 }, news: 'Aprobado el tope obligatorio a los precios del alquiler en áreas tensionadas.' },
      { text: 'Dar avales públicos al 20% de hipotecas y liberalizar suelo construible', stats: { eco: +4, est: +4, apr: -8 }, cost: 1200, loyaltyImpact: { PP: +30, VOX: +25, PNV: +20, SUMAR: -35 }, news: 'El Gobierno apuesta por la construcción masiva y avales a compradores.' }
    ]
  },
  {
    id: 'CONFLICTO_GIBRALTAR_POSTBREXIT',
    category: 'RELACIONES INTERNACIONALES',
    title: 'RUPTURA DE NEGOCIACIONES SOBRE LA VERJA DE GIBRALTAR',
    desc: 'Londres rechaza el control aduanero conjunto de Frontex y España restablece controles severos en La Línea.',
    condition: (m) => true,
    options: [
      { text: 'Aplicar el código Schengen estricto bloqueando el paso de trabajadores', stats: { eco: -5, est: -4, apr: +6 }, cost: 0, loyaltyImpact: { VOX: +30, PP: +20, SUMAR: -20, PODEMOS: -25 }, news: 'Colas kilométricas en La Línea tras endurecerse el paso con Gibraltar.' },
      { text: 'Ofrecer un estatus especial transitorio sin control fronterizo riguroso', stats: { eco: +3, est: +5, apr: -8 }, cost: 100, loyaltyImpact: { SUMAR: +15, PNV: +15, VOX: -40, PP: -25 }, news: 'España flexibiliza el tránsito en el Peñón mientras sigue negociando.' }
    ]
  },
  {
    id: 'CIERRE_CENTRAL_NUCLEAR',
    category: 'ENERGÍA & TRANSICIÓN',
    title: 'DEBATE SOBRE EL PRÓRROGA DE CENTRALES NUCLEARES',
    desc: 'El calendario fija el cierre inminente de dos reactores; el sector eléctrico advierte de subidas en la luz.',
    condition: (m) => true,
    options: [
      { text: 'Prorrogar 10 años la vida útil de los reactores mediante tasa energética', stats: { eco: +8, est: +6, apr: -8 }, cost: 0, loyaltyImpact: { PP: +30, VOX: +35, PNV: +20, SUMAR: -40 }, news: 'El Ejecutivo prorroga la energía nuclear para abaratar la factura del pool.' },
      { text: 'Confirmar el cierre definitivo e inyectar fondos en eólica y solar', stats: { eco: -6, est: -4, apr: +8 }, cost: 3000, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -30, VOX: -40 }, news: 'Confirmado el apagón nuclear programado con un plan masivo renovable.' }
    ]
  },
  {
    id: 'ESCANDALO_CORRUPCION_MASIVA',
    category: 'CORRUPCIÓN Y JUSTICIA',
    title: 'INVESTIGACIÓN JUDICIAL POR MORDIDAS EN CONTRATOS PÚBLICOS',
    desc: 'La Guardia Civil detiene a altos cargos de la administración por comisiones ilegales en licitaciones.',
    condition: (m) => m.est < 45,
    options: [
      { text: 'Cesar de inmediato a toda la cúpula implicada y someterse a auditoría', stats: { eco: 0, est: +5, apr: -5 }, cost: 0, loyaltyImpact: { SUMAR: +15, PP: -20, VOX: -20, PODEMOS: +10 }, news: 'Purga en el ministerio tras destaparse la red de comisiones ilegales.' },
      { text: 'Denunciar conspiración judicial y defender la inocencia del equipo', stats: { eco: 0, est: -12, apr: -18 }, cost: 0, loyaltyImpact: { PP: -35, VOX: -45, SUMAR: -30, PODEMOS: -35 }, news: 'Moncloa enroca a sus altos cargos ante las acusaciones de corrupción.' }
    ]
  },
  {
    id: 'OTAN_GASTO_DEFENSA',
    category: 'DEFENSA Y SEGURIDAD',
    title: 'EXIGENCIA DE LA OTAN DE ALCANZAR EL 2% DEL PIB EN DEFENSA',
    desc: 'La Alianza Atlántica remite una carta formal urgiendo a España a incrementar el presupuesto militar.',
    condition: (m) => true,
    options: [
      { text: 'Aumentar la partida de Defensa comprando fragatas y cazas europeos', stats: { eco: -8, est: +8, apr: -10 }, cost: 4000, loyaltyImpact: { PP: +30, VOX: +35, PNV: +15, SUMAR: -45 }, news: 'España aprueba un aumento histórico en Defensa para cumplir con la OTAN.' },
      { text: 'Computar gasto en ciberseguridad e infraestructuras dobles sin subir armas', stats: { eco: +2, est: -5, apr: +5 }, cost: 500, loyaltyImpact: { SUMAR: +20, PODEMOS: +30, PP: -25, VOX: -35 }, news: 'Moncloa maquilla la cifra de Defensa con partidas civiles levantando recelos.' }
    ]
  },
  {
    id: 'CRISIS_SECTOR_AUTOMOVIL',
    category: 'ECONOMÍA NACIONAL',
    title: 'AMENAZA DE CIERRE DE GRANDES PLANTAS DE AUTOMOCIÓN',
    desc: 'La baja demanda del vehículo eléctrico amenaza 20.000 empleos directos en fábricas automovilísticas.',
    condition: (m) => m.eco < 45,
    options: [
      { text: 'Lanzar un Plan Moves masivo y subvencionar la compra de coches diésel/gasolina', stats: { eco: -5, est: +6, apr: +8 }, cost: 1500, loyaltyImpact: { PP: +20, VOX: +25, UPN: +20, SUMAR: -25 }, news: 'Plan de choque para la industria del motor con ayudas a la renovación de flotas.' },
      { text: 'Exigir la reconversión 100% eléctrica conditioned a no destruir plantilla', stats: { eco: +2, est: -8, apr: -8 }, cost: 0, loyaltyImpact: { SUMAR: +25, PODEMOS: +25, PP: -25, VOX: -30 }, news: 'Las automovilísticas anuncian ERTEs tras rechazar las condiciones de Moncloa.' }
    ]
  },
  {
    id: 'SABOTAJE_CABLE_SUBMARINO',
    category: 'GEOPOLÍTICA & COMERCIO',
    title: 'CORTE ACCIDENTAL O SABOTAJE DE CABLES SUBMARINOS',
    desc: 'Una avería en las conexiones del Mediterráneo ralentiza el tráfico de datos y operaciones bancarias.',
    condition: (m) => true,
    options: [
      { text: 'Reparación de urgencia con escolta de la Armada e infraestructura alternativa', stats: { eco: -3, est: +6, apr: +4 }, cost: 300, loyaltyImpact: { PP: +15, VOX: +15, PNV: +10 }, news: 'La Armada escolta los buques de reparación del cableado de telecomunicaciones.' },
      { text: 'Restringir ancho de banda comercial y dar prioridad a servicios esenciales', stats: { eco: -6, est: -4, apr: -10 }, cost: 0, loyaltyImpact: { SUMAR: -20, PODEMOS: -20, PP: -15 }, news: 'Caos en servicios de streaming y banca por el racionamiento de datos.' }
    ]
  },
  {
    id: 'PROTESTAS_CAMPESINAS_TRACTORADA',
    category: 'AGRICULTURA Y MEDIO AMBIENTE',
    title: 'TRACTORADAS MASIVAS EN LAS CAPITALES',
    desc: 'Los agricultores colapsan autovías exigiendo cláusulas espejo a las importaciones de terceros países.',
    condition: (m) => true,
    options: [
      { text: 'Flexible la normativa verde comunitaria y dar ayudas directas al gasóleo agrícola', stats: { eco: -4, est: +7, apr: +9 }, cost: 1100, loyaltyImpact: { VOX: +30, PP: +25, SUMAR: -25, PODEMOS: -30 }, news: 'El Gobierno cede ante los agricultores y rebaja exigencias medioambientales.' },
      { text: 'Mantener exigencias medioambientales y sancionar el bloqueo de autovías', stats: { eco: +1, est: -9, apr: -12 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, VOX: -45, PP: -35 }, news: 'Cargas policiales contra agricultores que bloqueaban la red de autovías.' }
    ]
  },
  {
    id: 'SENTENCIA_TRIBUNAL_CONSTITUCIONAL',
    category: 'CORRUPCIÓN Y JUSTICIA',
    title: 'EL TRIBUNAL CONSTITUCIONAL ANULA LEY CLAVE DEL GOBIERNO',
    desc: 'El TC declara inconstitucional un decreto económico troncal por invasión de competencias autonómicas.',
    condition: (m) => true,
    options: [
      { text: 'Acatar la sentencia y tramitar la norma como Ley Orgánica mediante pactos', stats: { eco: -2, est: +5, apr: -4 }, cost: 0, loyaltyImpact: { PP: +20, PNV: +25, JUNTS: +20, PODEMOS: -20 }, news: 'Moncloa rearma su reforma parlamentaria tras el revés del Constitucional.' },
      { text: 'Criticar al TC y aprobar un Real Decreto Ley puente de aplicación inmediata', stats: { eco: +2, est: -10, apr: +4 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +25, PP: -40, VOX: -45 }, news: 'Duro choque institucional tras esquivar el Gobierno el fallo del Constitucional.' }
    ]
  },
  {
    id: 'HUELGA_MEDICOS_ATENCION_PRIMARIA',
    category: 'SANIDAD Y SOCIAL',
    title: 'COLAPSO EN LA ATENCIÓN PRIMARIA Y HUELGA MÉDICA',
    desc: 'Los profesionales de la salud convocan paros indefinidos ante las listas de espera en consultas de barrio.',
    condition: (m) => m.apr < 55,
    options: [
      { text: 'Aprobar una transferencia extraordinaria a las CCAA para contratar 10.000 médicos', stats: { eco: -6, est: +8, apr: +12 }, cost: 2200, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: +15, PNV: +15 }, news: 'Inyección millonaria de Moncloa a las autonomías para sanidad pública.' },
      { text: 'Aumentar horas extra obligatorias y derivar pacientes a clínicas privadas', stats: { eco: -2, est: -6, apr: -14 }, cost: 600, loyaltyImpact: { PP: +20, VOX: +15, SUMAR: -40, PODEMOS: -45 }, news: 'Protestas masivas tras la derivación de consultas públicas a la privada.' }
    ]
  },
  {
    id: 'TENSION_CATALUNA_FINANCIACION',
    category: 'POLÍTICA TERRITORIAL',
    title: 'EXIGENCIA DE UN CONCIERTO ECONÓMICO PROPIO PARA CATALUÑA',
    desc: 'El Govern condiciona la aprobación de los Presupuestos Generales a la cesión del 100% de los impuestos.',
    condition: (m) => true,
    options: [
      { text: 'Pactar una financiación singular para Cataluña con cupo propio', stats: { eco: -8, est: +4, apr: -15 }, cost: 3000, loyaltyImpact: { ERC: +40, JUNTS: +35, PP: -45, VOX: -50, BNG: -20 }, news: 'Acuerdo histórico sobre financiación catalana que desata críticas regionales.' },
      { text: 'Rechazar la propuesta y negociar un nuevo modelo multilaterial para todas las CCAA', stats: { eco: +4, est: -8, apr: +8 }, cost: 0, loyaltyImpact: { PP: +20, VOX: +20, ERC: -45, JUNTS: -50 }, news: 'Ruptura con los socios independentistas al rechazar el concierto exclusivo.' }
    ]
  },
  {
    id: 'CASO_ESPIONAJE_POLITICO',
    category: 'DEFENSA Y SEGURIDAD',
    title: 'SE DESTAPA ESPIONAJE A LÍDERES POLÍTICOS CON SOFTWARE ESPÍA',
    desc: 'Un informe forense confirma la infección de móviles de ministros y mandatarios de la oposición.',
    condition: (m) => m.est < 50,
    options: [
      { text: 'Desclasificar documentos del CNI y destituir a la dirección de inteligencia', stats: { eco: 0, est: +4, apr: -6 }, cost: 0, loyaltyImpact: { ERC: +30, EH_BILDU: +30, SUMAR: +20, PP: -20 }, news: 'El Gobierno releva a la cúpula del CNI para apaciguar a sus aliados.' },
      { text: 'Invocar la Ley de Secretos Oficiales y cerrar filas con los servicios secretos', stats: { eco: 0, est: -10, apr: -10 }, cost: 0, loyaltyImpact: { PP: +15, VOX: +20, ERC: -40, JUNTS: -45 }, news: 'Moncloa blinda al CNI provocando la ira de los partidos soberanistas.' }
    ]
  },
  {
    id: 'FUSION_BANCARIA_SISTEMICA',
    category: 'ECONOMÍA NACIONAL',
    title: 'OPA HOSTIL O FUSIÓN ENTRE DOS GRANDES BANCOS',
    desc: 'La fusión de dos gigantes financieros crearía un monopolio de crédito y el cierre de 1.500 oficinas.',
    condition: (m) => true,
    options: [
      { text: 'Vetar la operación alegando riesgo de exclusión financiera y monopolio', stats: { eco: -3, est: +5, apr: +10 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -25, VOX: -20 }, news: 'El Gobierno bloquea la fusión bancaria para proteger el empleo y oficinas.' },
      { text: 'Autorizar la operación exigiendo mantener el crédito a pequeñas empresas', stats: { eco: +6, est: -4, apr: -12 }, cost: 0, loyaltyImpact: { PP: +25, PNV: +20, SUMAR: -35, PODEMOS: -40 }, news: 'Luz verde a la gran fusión bancaria con duras críticas sindicales.' }
    ]
  },
  {
    id: 'INVASION_TEXTIL_CHINA',
    category: 'GEOPOLÍTICA & COMERCIO',
    title: 'AVALANCHA DE PAQUETERÍA ULTRA-BARATA DESDE ASIA',
    desc: 'Plataformas de comercio electrónico de Asia arruinan al comercio minorista local libres de aranceles.',
    condition: (m) => true,
    options: [
      { text: 'Imponer una tasa de inspección y aduana a cada paquete individual de fuera de la UE', stats: { eco: +4, est: +3, apr: -5 }, cost: 100, loyaltyImpact: { PP: +15, VOX: +20, SUMAR: +10 }, news: 'España fija la Tasa de Inspección Postal al e-commerce extracomunitario.' },
      { text: 'Mantener la exención aduanera para controlar el impacto en el IPC de las familias', stats: { eco: -2, est: -4, apr: +4 }, cost: 0, loyaltyImpact: { PP: -15, VOX: -15, SUMAR: -10 }, news: 'El pequeño comercio se moviliza contra la inacción frente al e-commerce asiático.' }
    ]
  },
  {
    id: 'REFORMA_PENSIONES_EDAD',
    category: 'TRABAJO Y PENSIONES',
    title: 'RECOMENDACIÓN DE LA AIREF DE RETRASAR LA JUBILACIÓN A LOS 68',
    desc: 'La Autoridad Fiscal advierte de que el envejecimiento hunda la hucha de las pensiones en tres años.',
    condition: (m) => m.eco < 40,
    options: [
      { text: 'Elevar voluntariamente el cómputo de años ampliando incentivos de demora', stats: { eco: +7, est: +4, apr: -10 }, cost: 0, loyaltyImpact: { PP: +25, PNV: +20, SUMAR: -35, PODEMOS: -40 }, news: 'Aprobada la reforma de pensiones con nuevos incentivos a la jubilación tardía.' },
      { text: 'Rechazar la recomendación y subir la cotización a las rentas más altas', stats: { eco: -4, est: -5, apr: +8 }, cost: 800, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -30, VOX: -30 }, news: 'El Gobierno descarta alargar la jubilación y eleva la cuota de solidaridad.' }
    ]
  },
  {
    id: 'CONFLICTO_DIPLOMATICO_ARGENTINA',
    category: 'RELACIONES INTERNACIONALES',
    title: 'CRISIS DIPLOMÁTICA Y RETIRADA DE EMBAJADORES EN SUDAMÉRICA',
    desc: 'Declaraciones cruzadas entre mandatarios provocan un choque político con riesgo para inversiones españolas.',
    condition: (m) => true,
    options: [
      { text: 'Retirar al embajador de forma indefinida y exigir disculpas públicas', stats: { eco: -3, est: -3, apr: +5 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +25, PP: -25, VOX: -35 }, news: 'España escala la tensión diplomática al retirar a su embajador.' },
      { text: 'Restablecer relaciones por vías discrecionales priorizando a las IBEX 35', stats: { eco: +4, est: +3, apr: -8 }, cost: 0, loyaltyImpact: { PP: +25, VOX: +20, SUMAR: -20, PODEMOS: -25 }, news: 'Moncloa suaviza el tono exterior para proteger la inversión empresarial.' }
    ]
  },
  {
    id: 'BROTE_FIEBRE_PORCINA',
    category: 'AGRICULTURA Y MEDIO AMBIENTE',
    title: 'ALERTA SANITARIA POR BROTE EN LA INDUSTRIA PORCINA',
    desc: 'Se detectan casos de fiebre porcina en explotaciones del noreste; China amenaza con vetar el jamón español.',
    condition: (m) => true,
    options: [
      { text: 'Sacrificio masivo preventivo y cuarentena de transportes con indemnización', stats: { eco: -5, est: +5, apr: -4 }, cost: 1200, loyaltyImpact: { PP: +15, PNV: +15, SUMAR: +10 }, news: 'España decreta la cuarentena ganadera para salvar las exportaciones a Asia.' },
      { text: 'Aislar solo las granjas infectadas evitando el sacrificio sistemático', stats: { eco: -8, est: -8, apr: -8 }, cost: 300, loyaltyImpact: { VOX: -25, PP: -20, SUMAR: -15 }, news: 'Pekín suspende compras de carne española tras dudar del control sanitario.' }
    ]
  },
  {
    id: 'PLAGA_INCENDIOS_VERANO',
    category: 'MEDIO AMBIENTE & AGUA',
    title: 'OLEADA DE INCENDIOS DE CUARTA GENERACIÓN',
    desc: 'Las olas de calor simultáneas arrasan 100.000 hectáreas en varias comunidades autónomas.',
    condition: (m) => true,
    options: [
      { text: 'Desplegar la UME al completo y decretar Zona de Catástrofe con ayudas', stats: { eco: -4, est: +8, apr: +10 }, cost: 1600, loyaltyImpact: { SUMAR: +20, PP: +20, VOX: +15, BNG: +20 }, news: 'Despliegue histórico militar y civil para sofocar la ola de incendios.' },
      { text: 'Transferir la responsabilidad del operativo a los presupuestos de las CCAA', stats: { eco: +1, est: -10, apr: -16 }, cost: 0, loyaltyImpact: { PP: -35, VOX: -30, BNG: -40, ERC: -30 }, news: 'Duras críticas al Gobierno por el reparto de cargas contra el fuego.' }
    ]
  },
  {
    id: 'APAGON_DIGITAL_RED_TELEFONICA',
    category: 'TECNOLOGÍA Y DIGITAL',
    title: 'CAÍDA NACIONAL DE LAS REDES DE FIBRA Y 5G',
    desc: 'Un fallo en el nodo central de comunicaciones deja a media España sin internet ni telefonía durante 18 horas.',
    condition: (m) => true,
    options: [
      { text: 'Sancionar severamente a las operadoras e imponer auditorías estatales', stats: { eco: +2, est: +4, apr: +8 }, cost: 0, loyaltyImpact: { SUMAR: +25, PODEMOS: +30, PP: -15 }, news: 'El Gobierno abre expediente sancionador récord a las grandes operadoras.' },
      { text: 'Crear una Red Nacional Digital de Emergencias bajo mando directo del Estado', stats: { eco: -4, est: +6, apr: +2 }, cost: 1400, loyaltyImpact: { VOX: +15, PP: +10, PNV: -15 }, news: 'Moncloa anuncia una red de comunicación crítica blindada por el Estado.' }
    ]
  },
  {
    id: 'LEGALIZACION_CANNABIS_DEBATE',
    category: 'SANIDAD Y SOCIAL',
    title: 'PROPUESTA DE REGULACIÓN DEL CANNABIS MEDICIONAL Y RECREATIVO',
    desc: 'Un grupo parlamentario lleva al pleno la legalización del consumo adulto para recaudar impuestos.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar la venta regulada en farmacias con estanco e impuesto especial', stats: { eco: +6, est: -4, apr: +4 }, cost: 0, loyaltyImpact: { SUMAR: +35, PODEMOS: +40, ERC: +30, PP: -45, VOX: -50 }, news: 'España aprueba la regularización del cannabis con fines fiscales y sanitarios.' },
      { text: 'Rechazar la iniciativa y limitar la norma únicamente al uso estrictamente farmacéutico', stats: { eco: 0, est: +4, apr: -4 }, cost: 0, loyaltyImpact: { PP: +25, VOX: +30, SUMAR: -30, PODEMOS: -35 }, news: 'Freno a la regulación recreativa del cannabis en el Congreso.' }
    ]
  },
  {
    id: 'DESABASTECIMIENTO_MEDICAMENTOS',
    category: 'SANIDAD Y SOCIAL',
    title: 'FALTA DE STOCK DE FÁRMACOS BÁSICOS EN FARMACIAS',
    desc: 'Problemas en las cadenas de producción en India y China cortan el suministro de antibióticos e insulina.',
    condition: (m) => true,
    options: [
      { text: 'Producir medicamentos esenciales mediante la reserva estratégica pública', stats: { eco: -5, est: +8, apr: +10 }, cost: 1100, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: +10 }, news: 'El Gobierno encarga a laboratorios públicos la fabricación de fármacos.' },
      { text: 'Pagar un sobreprecio internacional para conseguir partidas de emergencia', stats: { eco: -6, est: +2, apr: +2 }, cost: 1500, loyaltyImpact: { PP: -10, VOX: -15, SUMAR: -10 }, news: 'España adquiere fármacos a precio de saldo en el mercado internacional.' }
    ]
  },
  {
    id: 'EXCESO_MORTALIDAD_CALOR',
    category: 'SANIDAD Y SOCIAL',
    title: 'RECORD DE MUESTRAS POR OLAS DE CALOR EXTREMAS',
    desc: 'Las temperaturas persistentes de 44°C provocan una crisis en urgencias entre la población anciana.',
    condition: (m) => true,
    options: [
      { text: 'Decretar refugios climáticos obligatorios y subvencionar aire acondicionado social', stats: { eco: -4, est: +5, apr: +8 }, cost: 900, loyaltyImpact: { SUMAR: +25, PODEMOS: +30, PP: -15 }, news: 'Plan climático de choque con ayudas a la climatización de hogares vulnerables.' },
      { text: 'Modificar horarios laborales y recomendar autocuidado sin ayudas fiscales', stats: { eco: 0, est: -4, apr: -8 }, cost: 0, loyaltyImpact: { SUMAR: -20, PODEMOS: -25, VOX: -10 }, news: 'Sanidad limita el trabajo al aire libre en horas de sol sin dotación presupuestaria.' }
    ]
  },
  {
    id: 'PROTESTAS_TAXISTAS_VTC',
    category: 'INFRAESTRUCTURAS',
    title: 'BLOQUEO DE AEROPUERTOS POR LA GUERRA TAXI VS VTC',
    desc: 'Los taxistas colapsan los accesos a Barajas y El Prat exigiendo limitar las licencias de plataformas.',
    condition: (m) => true,
    options: [
      { text: 'Aumentar las exigencias regulatorias y días de descanso a las VTC', stats: { eco: -2, est: +4, apr: +4 }, cost: 0, loyaltyImpact: { SUMAR: +25, PODEMOS: +25, PP: -25, VOX: -20 }, news: 'Fomento impone normas estrictas a las licencias VTC en apoyo al taxi.' },
      { text: 'Liberalizar el sector del transporte urbano garantizando la libre competencia', stats: { eco: +4, est: -8, apr: -8 }, cost: 0, loyaltyImpact: { PP: +30, VOX: +25, SUMAR: -35, PODEMOS: -40 }, news: 'Los taxistas declaran huelga indefinida tras la liberalización de las VTC.' }
    ]
  },
  {
    id: 'CRISIS_PESQUERA_NORTE',
    category: 'AGRICULTURA Y MEDIO AMBIENTE',
    title: 'RECORTES DE CUOTAS DE PESCA EN EL ATLÁNTICO POR LA UE',
    desc: 'Bruselas reduce un 30% la cuota de merluza y jurel, amenazando a la flota del Cantábrico y Galicia.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar un subsidio de paro biológico a los marineros afectados', stats: { eco: -4, est: +5, apr: +7 }, cost: 700, loyaltyImpact: { BNG: +35, PNV: +25, PP: +15, SUMAR: +15 }, news: 'Ayudas directas a la flota pesquera damnificada por los recortes de la UE.' },
      { text: 'Impugnar el dictamen ante el Tribunal de Justicia de la Unión Europea', stats: { eco: 0, est: -3, apr: +2 }, cost: 100, loyaltyImpact: { BNG: -15, PNV: -10, PP: -10 }, news: 'España recurre a los tribunales europeos mientras la flota sigue amarrada.' }
    ]
  },
  {
    id: 'AMPLIACION_AEROPUERTO_BARAJAS',
    category: 'INFRAESTRUCTURAS',
    title: 'PROYECTO DE AMPLIACIÓN DEL AEROPUERTO DE MADRID',
    desc: 'Empresarios y Gobierno regional reclaman 2.400 M€ de inversión para convertir Barajas en hub con Asia.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar la inversión aeroportuaria declarándola obra de interés general', stats: { eco: +8, est: -3, apr: -4 }, cost: 2400, loyaltyImpact: { PP: +30, VOX: +25, PNV: +15, SUMAR: -40 }, news: 'Luz verde a la expansión de Barajas pese a las protestas ecologistas.' },
      { text: 'Paralizar el proyecto y potenciar la red de ferrocarril nocturno europeo', stats: { eco: -2, est: +2, apr: +5 }, cost: 600, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -30, VOX: -30 }, news: 'Moncloa frena la ampliación del aeropuerto por motivos de sostenibilidad.' }
    ]
  },
  {
    id: 'HUELGA_JUZGADOS_LETRADOS',
    category: 'CORRUPCIÓN Y JUSTICIA',
    title: 'PARO INDEFINIDO EN LA ADMINISTRACIÓN DE JUSTICIA',
    desc: 'Funcionarios y letrados de la Administración de Justicia paralizan miles de juicios exigiendo mejoras salariales.',
    condition: (m) => true,
    options: [
      { text: 'Pactar una subida salarial vinculada a la digitalización del expediente judicial', stats: { eco: -3, est: +7, apr: +5 }, cost: 450, loyaltyImpact: { SUMAR: +15, PP: +15, PNV: +10 }, news: 'Acuerdo con los funcionarios de Justicia para desbloquear los juzgados.' },
      { text: 'Decretar servicios mínimos del 80% y rechazar subidas en el ejercicio fiscal', stats: { eco: +1, est: -8, apr: -10 }, cost: 0, loyaltyImpact: { PP: -20, VOX: -20, SUMAR: -25 }, news: 'Colapso judicial tras enquistarse la negociación con los sindicatos.' }
    ]
  },
  {
    id: 'CRISIS_INDUSTRIA_AZULEJERA',
    category: 'ECONOMÍA NACIONAL',
    title: 'RIESGO DE CIERRE EN EL CLÚSTER CERÁMICO DE CASTELLÓN',
    desc: 'Los altos costes del gas natural ponen en peligro el empleo de 15.000 trabajadores azulejeros.',
    condition: (m) => m.eco < 40,
    options: [
      { text: 'Conceder subvenciones directas por uso intensivo de gas industrial', stats: { eco: -4, est: +5, apr: +6 }, cost: 800, loyaltyImpact: { PP: +20, VOX: +20, SUMAR: -15 }, news: 'Inyección de ayudas al sector cerámico para paliar la factura energética.' },
      { text: 'Forzar la reconversión a hornos eléctricos de inducción sin ayudas a fósiles', stats: { eco: +2, est: -6, apr: -8 }, cost: 0, loyaltyImpact: { SUMAR: +20, PP: -25, VOX: -30 }, news: 'Cierres en la industria cerámica al rechazar el Gobierno subsidios al gas.' }
    ]
  },
  {
    id: 'CONFLEX_SINDICATOS_PATRONAL_SMI',
    category: 'TRABAJO Y PENSIONES',
    title: 'RUPTURA DE LA MESA SOCIAL SOBRE EL SALARIO MÍNIMO',
    desc: 'Sindicatos exigen una subida del SMI del 7% mientras la patronal rechaza cualquier incremento por encima del IPC.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar unilateralmente la subida del 7% exigida por los sindicatos', stats: { eco: -3, est: -4, apr: +12 }, cost: 0, loyaltyImpact: { SUMAR: +40, PODEMOS: +45, PP: -40, VOX: -45 }, news: 'Decreto para subir el SMI un 7% sin el consenso de los empresarios.' },
      { text: 'Pactar un 3% intermedio congelando cotizaciones mínimas a las pymes', stats: { eco: +3, est: +5, apr: -4 }, cost: 200, loyaltyImpact: { PP: +20, PNV: +25, SUMAR: -25, PODEMOS: -30 }, news: 'Subida moderada del SMI consensuada con la patronal a cambio de rebajas.' }
    ]
  },
  {
    id: 'ESCANDALO_APUESTAS_DEPORTIVAS',
    category: 'SANIDAD Y SOCIAL',
    title: 'AUMENTO DE LA LUDOPATÍA EN JÓVENES POR CASINOS ONLINE',
    desc: 'Asociaciones médicas alertan de un repunte de adicciones al juego en menores de 25 años.',
    condition: (m) => true,
    options: [
      { text: 'Prohibir totalmente la publicidad de casas de apuestas y el patrocinio deportivo', stats: { eco: -2, est: +4, apr: +10 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -15, VOX: -20 }, news: 'Veto radical a los anuncios de apuestas y juego en televisión y camisetas.' },
      { text: 'Imponer un impuesto especial del 30% a las operadoras destinándolo a Sanidad', stats: { eco: +5, est: +2, apr: +4 }, cost: 0, loyaltyImpact: { PP: +15, PNV: +15, SUMAR: -10 }, news: 'Tasa fiscal a las casas de apuestas para financiar el tratamiento de adicciones.' }
    ]
  },
  {
    id: 'FUGA_DE_CABEZAS_CIENTIFICAS',
    category: 'TECNOLOGÍA Y DIGITAL',
    title: 'EXODO DE INVESTIGADORES Y TALENTO UNIVERSITARIO',
    desc: 'La precariedad del sistema nacional de I+D expulsa a miles de doctores hacia Europa y EE. UU.',
    condition: (m) => true,
    options: [
      { text: 'Crear la Beca Retorno de Talento con contratos estables en el CSIC', stats: { eco: -5, est: +6, apr: +8 }, cost: 1300, loyaltyImpact: { SUMAR: +25, PODEMOS: +25, PP: +10 }, news: 'Moncloa moviliza 1.300 M€ para estabilizar a los científicos e investigadores.' },
      { text: 'Bonificar las cotizaciones de I+D a las empresas privadas que los contraten', stats: { eco: +3, est: +2, apr: -4 }, cost: 400, loyaltyImpact: { PP: +20, PNV: +20, SUMAR: -15 }, news: 'Incentivos fiscales a las empresas para frenar la fuga de científicos.' }
    ]
  },
  {
    id: 'TENSION_RELIGION_AULAS',
    category: 'SANIDAD Y SOCIAL',
    title: 'DEBATE SOBRE LA ASIGNATURA DE RELIGIÓN Y LAICIDAD',
    desc: 'Propuesta parlamentaria para eliminar la asignatura de religión de la nota media académica.',
    condition: (m) => true,
    options: [
      { text: 'Eliminar la materia de la nota ponderada de acceso a la universidad', stats: { eco: 0, est: -3, apr: +6 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -40, VOX: -45 }, news: 'La asignatura de religión deja de computar para la nota de la EBAU.' },
      { text: 'Mantener el estatus de la materia respetando los acuerdos con el Vaticano', stats: { eco: 0, est: +4, apr: -8 }, cost: 0, loyaltyImpact: { PP: +30, VOX: +35, SUMAR: -30, PODEMOS: -35 }, news: 'El Ejecutivo blinda el peso de la clase de religión en los colegios.' }
    ]
  },
  {
    id: 'CRISIS_VIVIENDA_TURISTICA',
    category: 'INFRAESTRUCTURAS Y VIVIENDA',
    title: 'PROLIFERACIÓN DE PISOS TURÍSTICOS ILEGALES',
    desc: 'Vecinos de cascos históricos se movilizan contra la conversión de fincas residenciales en apartamentos turísticos.',
    condition: (m) => true,
    options: [
      { text: 'Prohibir las licencias de alquiler vacacional en edificios de vecinos', stats: { eco: -3, est: +4, apr: +10 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, ERC: +20, PP: -30 }, news: 'Moncloa capacita a las comunidades de vecinos para vetar pisos turísticos.' },
      { text: 'Crear una licencia fiscal única estatal cobrando IVA reducido', stats: { eco: +5, est: -4, apr: -6 }, cost: 0, loyaltyImpact: { PP: +20, VOX: +20, SUMAR: -25 }, news: 'Regulación fiscal de las viviendas de uso turístico sin limitar licencias.' }
    ]
  },
  {
    id: 'ARANCELES_CHINA_VEHICULO_ELECTRICO',
    category: 'GEOPOLÍTICA & COMERCIO',
    title: 'VOTO EN BRUSELAS SOBRE ARANCELES A COCHES CHINOS',
    desc: 'La Comisión propuesta subir al 35% los impuestos a los vehículos eléctricos producidos en China.',
    condition: (m) => true,
    options: [
      { text: 'Votar a favor del arancel europeo para proteger la industria automotriz europea', stats: { eco: -3, est: +4, apr: +2 }, cost: 0, loyaltyImpact: { PP: +15, PNV: +15, VOX: -10 }, news: 'España apoya el escudo arancelario europeo contra el coche eléctrico chino.' },
      { text: 'Abstenerse o votar en contra para atraer megafábricas de baterías chinas a España', stats: { eco: +6, est: -2, apr: +4 }, cost: 0, loyaltyImpact: { SUMAR: +15, VOX: +15, PP: -15 }, news: 'España se descuelga del arancel para no poner en riesgo inversiones asiáticas.' }
    ]
  },
  {
    id: 'ESCANDALO_LFP_DERECHOS_TV',
    category: 'CORRUPCIÓN Y JUSTICIA',
    title: 'INVESTIGACIÓN POR FRAUDE EN LOS DERECHOS DEL FÚTBOL',
    desc: 'Anticorrupción investiga comisiones irregulares en la venta de los derechos de retransmisión televisiva.',
    condition: (m) => true,
    options: [
      { text: 'Intervenir el Consejo Superior de Deportes y obligar a una licitación abierta', stats: { eco: 0, est: +4, apr: +6 }, cost: 0, loyaltyImpact: { SUMAR: +15, PODEMOS: +20, PP: -10 }, news: 'El CSD toma el control de los concursos audiovisuales del fútbol.' },
      { text: 'Dejar que los tribunales decidan sin intervención de la administración deportiva', stats: { eco: 0, est: -3, apr: -4 }, cost: 0, loyaltyImpact: { PP: +10, VOX: +10, SUMAR: -15 }, news: 'Moncloa evita intervenir en el conflicto por los derechos televisivos.' }
    ]
  },
  {
    id: 'PAGO_POR_USO_AUTOVIAS',
    category: 'INFRAESTRUCTURAS',
    title: 'EXIGENCIA DE LA UE DE IMPLANTAR PEAJES EN AUTOVÍAS',
    desc: 'Bruselas recuerda el compromiso firmado de tarificar las autovías para el mantenimiento de la red.',
    condition: (m) => true,
    options: [
      { text: 'Poner una viñeta anual de pago por uso eximiendo los desplazamientos laborales', stats: { eco: +5, est: -6, apr: -14 }, cost: 0, loyaltyImpact: { PP: -25, VOX: -35, SUMAR: -30, PODEMOS: -40 }, news: 'Polémica aprobación de la viñeta de conservación de la red de autovías.' },
      { text: 'Renegociar con Bruselas sustituyendo peajes por inversiones en tren de mercancías', stats: { eco: -4, est: +5, apr: +8 }, cost: 1200, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, PP: +15 }, news: 'España esquiva los peajes en autovías a cambio de impulsar el ferrocarril.' }
    ]
  },
  {
    id: 'CRISIS_ACEITE_DE_OLIVA',
    category: 'ECONOMÍA NACIONAL',
    title: 'PRECIO DEL ACEITE DE OLIVA EN MÁXIMOS HISTÓRICOS',
    desc: 'La mala cosecha dispara el precio en origen a 9€ el litro, impactando de lleno en la cesta de la compra.',
    condition: (m) => true,
    options: [
      { text: 'Rebajar el IVA del aceite al 0% y dar ayudas directas a los olivareros', stats: { eco: -4, est: +5, apr: +10 }, cost: 600, loyaltyImpact: { PP: +20, VOX: +25, SUMAR: +15 }, news: 'El Ejecutivo elimina el IVA del aceite para frenar el impacto en la cesta.' },
      { text: 'Prohibir la exportación fuera de la UE hasta recuperar el stock nacional', stats: { eco: -7, est: -5, apr: +5 }, cost: 0, loyaltyImpact: { VOX: +15, PP: -30, SUMAR: -15 }, news: 'Intervención del mercado del aceite limitando las ventas al extranjero.' }
    ]
  },
  {
    id: 'ACCIDENTE_FERROVIARIO_AVE',
    category: 'INFRAESTRUCTURAS',
    title: 'AVERÍA GRAVE Y DESCARRILAMIENTO EN LA RED DE ALTA VELOCIDAD',
    desc: 'La falta de mantenimiento en el corredor sur provoca un caos ferroviario durante la operación salida.',
    condition: (m) => true,
    options: [
      { text: 'Destinar 1.500 M€ de urgencia a la renovación de vías de Adif', stats: { eco: -5, est: +8, apr: +4 }, cost: 1500, loyaltyImpact: { PP: +15, SUMAR: +15, PNV: +10 }, news: 'Inyección masiva para la auditoría y reparación de la red de AVE.' },
      { text: 'Exigir responsabilidades a los fabricantes de los trenes y suspender líneas', stats: { eco: +1, est: -8, apr: -12 }, cost: 0, loyaltyImpact: { PP: -20, VOX: -25, SUMAR: -20 }, news: 'Cancelaciones masivas en el AVE tras la decisión de Fomento de paralizar la flota.' }
    ]
  },
  {
    id: 'TENSION_IGLESIA_ABUSOS',
    category: 'SANIDAD Y SOCIAL',
    title: 'INFORME DEL DEFENSOR DEL PUEBLO SOBRE ABUSOS EN LA IGLESIA',
    desc: 'El informe oficial plantea la creación de un fondo estatal de indemnización a las víctimas.',
    condition: (m) => true,
    options: [
      { text: 'Obligar por ley a la Conferencia Episcopal a financiar el fondo de reparación', stats: { eco: 0, est: -2, apr: +8 }, cost: 0, loyaltyImpact: { SUMAR: +35, PODEMOS: +40, PP: -35, VOX: -45 }, news: 'El Congreso aprueba que la Iglesia pague las indemnizaciones a las víctimas.' },
      { text: 'Crear un fondo mixto con aportación de las arcas públicas', stats: { eco: -2, est: +3, apr: -6 }, cost: 300, loyaltyImpact: { PP: +15, VOX: +20, SUMAR: -25, PODEMOS: -30 }, news: 'El Estado aportará fondos públicos para indemnizar a las víctimas de abusos.' }
    ]
  },
  {
    id: 'CRECIMIENTO_DEUDA_AUTONOMICA',
    category: 'FINANZAS EUROPEAS',
    title: 'DESCONTROL DEL DÉFICIT EN TRES COMUNIDADES AUTÓNOMAS',
    desc: 'Hacienda detecta un desvío presupuestario del 3% en las cuentas de varias regiones.',
    condition: (m) => m.eco < 50,
    options: [
      { text: 'Intervenir las cuentas autonómicas mediante la Ley de Estabilidad', stats: { eco: +4, est: -8, apr: -10 }, cost: 0, loyaltyImpact: { PP: -30, VOX: +20, ERC: -40, JUNTS: -45 }, news: 'Hacienda toma el control financiero de las autonomías incumplidoras.' },
      { text: 'Kitar la deuda mediante el Fondo de Liquidez Autonómico (FLA)', stats: { eco: -6, est: +4, apr: -2 }, cost: 2000, loyaltyImpact: { ERC: +30, JUNTS: +25, PP: -35, VOX: -40 }, news: 'Moncloa asume la deuda autonómica para evitar el colapso financiero regional.' }
    ]
  },
  {
    id: 'NUCLEARES_FRANCIA_FUSION',
    category: 'ENERGÍA & TRANSICIÓN',
    title: 'FRANCIA OFRECE ENERGÍA NUCLEAR BARATA A CAMBIO DE INTERCONEXIÓN',
    desc: 'París propone cofinanciar el tubo de hidrógeno si España compra electricidad nuclear francesa.',
    condition: (m) => true,
    options: [
      { text: 'Aceptar el acuerdo comercial y acelerar el tubo BarMar', stats: { eco: +6, est: +4, apr: -6 }, cost: 1000, loyaltyImpact: { PP: +20, PNV: +20, SUMAR: -25, PODEMOS: -30 }, news: 'España pacta la interconexión energética con Francia reduciendo el pool.' },
      { text: 'Rechazar la oferta priorizando la independencia energética renovable nacional', stats: { eco: -4, est: -3, apr: +6 }, cost: 0, loyaltyImpact: { SUMAR: +25, PODEMOS: +30, PP: -20 }, news: 'El Ejecutivo rechaza la electricidad nuclear francesa defendiendo el modelo verde.' }
    ]
  },
  {
    id: 'CASO_WHATSAPP_PRIVACIDAD',
    category: 'TECNOLOGÍA Y DIGITAL',
    title: 'MULTA HISTÓRICA DE LA AGENCIA DE PROTECCIÓN DE DATOS',
    desc: 'La AEPD impone una sanción de 300 M€ a la matriz de las redes sociales por rastreo sin consentimiento.',
    condition: (m) => true,
    options: [
      { text: 'Confirmar la multa y exigir la instalación de servidores locales en Europa', stats: { eco: +3, est: +3, apr: +6 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, PP: +10 }, news: 'Duro revés fiscal a las Big Tech por infracción de privacidad.' },
      { text: 'Reducir la sanción a cambio de centros de procesamiento de datos en España', stats: { eco: +5, est: -2, apr: -4 }, cost: 0, loyaltyImpact: { PP: +20, VOX: +15, SUMAR: -20 }, news: 'España pacta con las tecnológicas la exención parcial a cambio de empleos.' }
    ]
  },
  {
    id: 'PROTESTAS_ESTUDIANTILES_EBAU',
    category: 'SANIDAD Y SOCIAL',
    title: 'EXIGENCIA DE UNA PRUEBA DE ACCESO A LA UNIVERSIDAD ÚNICA',
    desc: 'Plataformas de estudiantes convocan paros pidiendo la misma prueba de SELECTIVIDAD en toda España.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar un examen único unificado para todo el territorio nacional', stats: { eco: 0, est: +5, apr: +8 }, cost: 0, loyaltyImpact: { PP: +35, VOX: +40, ERC: -45, JUNTS: -45, PNV: -35 }, news: 'El Gobierno aprueba la EBAU unificada para garantizar la igualdad de acceso.' },
      { text: 'Mantener las competencias autonómicas fijando criterios de corrección comunes', stats: { eco: 0, est: -3, apr: -6 }, cost: 0, loyaltyImpact: { ERC: +25, PNV: +25, PP: -30, VOX: -35 }, news: 'Sanidad y Educación mantienen el modelo descentralizado de la EBAU.' }
    ]
  },
  {
    id: 'CRISIS_INDUSTRIA_DEFENSA_SANTA_BARBARA',
    category: 'DEFENSA Y SEGURIDAD',
    title: 'RETRACCIÓN DE ENCARGOS EN LAS FÁBRICAS DE ARMAMENTO',
    desc: 'El retraso en los programas de vehículos blindados amenaza puestos de trabajo en Asturias y Andalucía.',
    condition: (m) => true,
    options: [
      { text: 'Inyectar un encargo de urgencia de 500 blindados para las FFAA', stats: { eco: -4, est: +5, apr: -4 }, cost: 1200, loyaltyImpact: { PP: +20, VOX: +25, BNG: -20, PODEMOS: -35 }, news: 'Inyección pública para blindar el empleo militar en los astilleros y fábricas.' },
      { text: 'Exigir la reconversión de las plantas hacia maquinaria pesada civil', stats: { eco: -2, est: -6, apr: +2 }, cost: 50, loyaltyImpact: { SUMAR: +20, PODEMOS: +25, PP: -25, VOX: -30 }, news: 'Protestas obreras ante el plan de reconversión civil de la industria militar.' }
    ]
  },
  {
    id: 'INVASION_AVISPA_ASIATICA',
    category: 'AGRICULTURA Y MEDIO AMBIENTE',
    title: 'PLAGA DE ESPECIES INVASORAS EN EL SECTOR APÍCOLA',
    desc: 'La avispa asiática destroza el 40% de las colmenas del norte, poniendo en riesgo la polinización.',
    condition: (m) => true,
    options: [
      { text: 'Lanzar un plan de choque con trampeo biológico y ayudas al apicultor', stats: { eco: -2, est: +3, apr: +4 }, cost: 300, loyaltyImpact: { BNG: +20, PNV: +20, PP: +10 }, news: 'Plan biológico urgente para frenar la expansión de la avispa invasora.' },
      { text: 'Dejar el control en manos de los servicios de protección civil autonómicos', stats: { eco: 0, est: -4, apr: -4 }, cost: 0, loyaltyImpact: { BNG: -15, PNV: -15, PP: -10 }, news: 'Los apicultores denuncian el abandono institucional ante la plaga del norte.' }
    ]
  },
  {
    id: 'SABOTAJE_LINEA_TREN_MERCANCIAS',
    category: 'INFRAESTRUCTURAS',
    title: 'ACTOS DE SABOTAJE EN EL CORREDOR MEDITERRÁNEO',
    desc: 'El robo reiterado de cable de cobre paraliza el transporte de mercancías entre Valencia y Barcelona.',
    condition: (m) => true,
    options: [
      { text: 'Desplegar a la Guardia Civil con drones para la vigilancia de vías', stats: { eco: -2, est: +6, apr: +5 }, cost: 200, loyaltyImpact: { PP: +15, VOX: +20, SUMAR: -10 }, news: 'Vigilancia militarizada de las vías del Corredor Mediterráneo tras los sabotajes.' },
      { text: 'Reemplazar el cableado de cobre por fibra sin conducción de alto valor', stats: { eco: -5, est: +2, apr: +2 }, cost: 800, loyaltyImpact: { PNV: +10, ERC: +10, PP: +5 }, news: 'Plan de sustitución de materiales en Adif para erradicar el robo de cobre.' }
    ]
  },
  {
    id: 'ESCANDALO_BOLSAS_PLASTICO',
    category: 'MEDIO AMBIENTE & AGUA',
    title: 'INFRACCION EUROPEA POR EL RECIEN PAGO DEL IMPUESTO AL PLÁSTICO',
    desc: 'La patronal del envase solicita la suspensión del impuesto especial aduciendo pérdida de competitividad.',
    condition: (m) => true,
    options: [
      { text: 'Mantener el impuesto ecológico al plástico no reutilizable', stats: { eco: +3, est: -3, apr: +4 }, cost: 0, loyaltyImpact: { SUMAR: +25, PODEMOS: +30, PP: -25, VOX: -30 }, news: 'El Gobierno ratifica el impuesto verde sobre los envases de plástico.' },
      { text: 'Suspender temporalmente la tasa fiscal para dar respiro a las pymes', stats: { eco: -2, est: +3, apr: -4 }, cost: 0, loyaltyImpact: { PP: +20, VOX: +25, SUMAR: -30, PODEMOS: -35 }, news: 'Pausa fiscal al impuesto del plástico tras la presión de la industria.' }
    ]
  },
  {
    id: 'CRISIS_SECTOR_AUDIOVISUAL',
    category: 'TECNOLOGÍA Y DIGITAL',
    title: 'EXIGENCIA DE CUOTA DE CINE EN LENGUAS COOFICIALES',
    desc: 'Partidos autonómicos exigen que el 6% del catálogo de plataformas de streaming sea en catalán, euskera y gallego.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar por ley la cuota del 6% obligatoria para las multinacionales', stats: { eco: -1, est: -3, apr: +4 }, cost: 0, loyaltyImpact: { ERC: +35, JUNTS: +30, PNV: +30, BNG: +30, PP: -30, VOX: -40 }, news: 'Las plataformas de streaming deberán incluir cuotas en lenguas cooficiales.' },
      { text: 'Subvencionar el doblaje sin imponer cuotas mínimas a las empresas', stats: { eco: -3, est: +2, apr: -2 }, cost: 250, loyaltyImpact: { PP: +15, VOX: +15, ERC: -25, JUNTS: -30 }, news: 'Moncloa ofrecerá ayudas al doblaje descartando sanciones a las plataformas.' }
    ]
  },
  {
    id: 'REGULACION_IA_ALGORITMOS',
    category: 'TECNOLOGÍA Y DIGITAL',
    title: 'PIONERA LEY DE REGULACIÓN DE LA INTELIGENCIA ARTIFICIAL',
    desc: 'España busca crear la primera Agencia de Supervisión de la IA para auditar sesgos y despidos automáticos.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar la Agencia Estatal de IA con capacidad de sancionar a empresas', stats: { eco: -2, est: +5, apr: +6 }, cost: 100, loyaltyImpact: { SUMAR: +25, PODEMOS: +30, PP: -15, VOX: -20 }, news: 'Nace la Agencia de Inteligencia Artificial para auditar los algoritmos.' },
      { text: 'Crear un marco de autorregulación blanda para no ahuyentar a las startups', stats: { eco: +4, est: -2, apr: -4 }, cost: 0, loyaltyImpact: { PP: +20, VOX: +15, SUMAR: -20, PODEMOS: -25 }, news: 'España opta por un código ético voluntario para las empresas de IA.' }
    ]
  },
  {
    id: 'CRISIS_TURISMO_MASIFICACION',
    category: 'ECONOMÍA NACIONAL',
    title: 'PROTESTAS CONTRA EL TURISMO MASIVO EN BALEARES Y CANARIAS',
    desc: 'Manifestaciones multitudinarias piden frenar la llegada de cruceros y fijar la tasa turística.',
    condition: (m) => true,
    options: [
      { text: 'Imponer una Ecotasa estatal a los cruceros y limitar vuelos insulares', stats: { eco: -5, est: -3, apr: +8 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, CC: +25, PP: -35, VOX: -40 }, news: 'Tasa turística para cruceristas e itinerarios insulares saturados.' },
      { text: 'Promocionar el turismo de lujo desincentivando el bajo coste sin tasas', stats: { eco: +5, est: +2, apr: -8 }, cost: 100, loyaltyImpact: { PP: +25, VOX: +20, SUMAR: -25 }, news: 'Plan de reposicionamiento hacia el turismo de alto poder adquisitivo.' }
    ]
  },
  {
    id: 'DESERTIFICACION_SUR_ESPANA',
    category: 'MEDIO AMBIENTE & AGUA',
    title: 'AVANCE DE LA DESERTIFICACIÓN EN ANDALUCÍA Y MURCIA',
    desc: 'Un informe de la ONU advierte que el 30% del territorio del sur corre riesgo inminente de desertización.',
    condition: (m) => true,
    options: [
      { text: 'Plan de reforestación masiva y reconversión de regadíos a secano', stats: { eco: -6, est: +6, apr: +6 }, cost: 2000, loyaltyImpact: { SUMAR: +25, PODEMOS: +30, PP: -25, VOX: -35 }, news: 'Moncloa presenta el Gran Cinturón Verde para frenar el avance del desierto.' },
      { text: 'Subvencionar el riego por goteo fotovoltaico manteniendo los cultivos', stats: { eco: -3, est: +2, apr: -2 }, cost: 1200, loyaltyImpact: { PP: +20, VOX: +25, SUMAR: -20 }, news: 'Subsidios a la eficiencia hídrica en la agricultura de regadío del sur.' }
    ]
  },
  {
    id: 'CONFLICTO_DIPLOMATICO_ALGERIA',
    category: 'GEOPOLÍTICA & COMERCIO',
    title: 'BLOQUEO DEL GASODUCTO MEDGAZ POR ARGELIA',
    desc: 'Argel suspende el tratado de amistad y reduce el flujo de gas por desencuentros en política exterior.',
    condition: (m) => true,
    options: [
      { text: 'Comprar gas natural licuado (GNL) a EE. UU. y Qatar para suplir la falta', stats: { eco: -7, est: +4, apr: -6 }, cost: 2200, loyaltyImpact: { PP: +15, VOX: +15, SUMAR: -20 }, news: 'España recurre a metaneros de EE. UU. para garantizar el suministro de gas.' },
      { text: 'Rectificar el giro diplomático en el Sáhara Occidental para calmar a Argel', stats: { eco: +4, est: -6, apr: +4 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -30, VOX: -35 }, news: 'Giro de Moncloa en política exterior para reabrir el gasoducto argelino.' }
    ]
  },
  {
    id: 'TENSION_CARRERA_MILITAR_MUJERES',
    category: 'DEFENSA Y SEGURIDAD',
    title: 'CUOTAS DE GÉNERO EN LA CÚPULA DE LAS FUERZAS ARMADAS',
    desc: 'El Ministerio propone reservar un 25% de los ascensos a la escala de oficiales para mujeres.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar las cuotas obligatorias en la carrera militar', stats: { eco: 0, est: -2, apr: +6 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -30, VOX: -50 }, news: 'Las Fuerzas Armadas aplicarán cuotas para fomentar la paridad en mandos.' },
      { text: 'Incentivar la entrada sin modificar el sistema de méritos y antigüedad', stats: { eco: 0, est: +4, apr: -4 }, cost: 0, loyaltyImpact: { PP: +25, VOX: +35, SUMAR: -25, PODEMOS: -30 }, news: 'Defensa descarta las cuotas fijas de ascenso en los mandos militares.' }
    ]
  },
  {
    id: 'CRISIS_GANADERIA_EXTENSIVA',
    category: 'AGRICULTURA Y MEDIO AMBIENTE',
    title: 'CONFLICTO POR LA PROTECCIÓN STRICTA DEL LOBO',
    desc: 'Ganaderos del norte se rebelan por el aumento de ataques a rebaños tras incluir al lobo en el LESPRE.',
    condition: (m) => true,
    options: [
      { text: 'Sacar al lobo del listado de protección especial permitiendo batidas controladas', stats: { eco: 0, est: +5, apr: +4 }, cost: 0, loyaltyImpact: { PP: +30, VOX: +35, PNV: +20, SUMAR: -35, PODEMOS: -40 }, news: 'El Gobierno autoriza extracciones de lobos para proteger a la ganadería.' },
      { text: 'Mantener la protección e indemnizar el 100% del valor de las reses atacadas', stats: { eco: -3, est: -3, apr: -2 }, cost: 400, loyaltyImpact: { SUMAR: +25, PODEMOS: +30, PP: -25, VOX: -30 }, news: 'Moncloa incrementa el fondo de pago directo por daños de fauna salvaje.' }
    ]
  },
  {
    id: 'AMPLIACION_PUERTO_VALENCIA',
    category: 'INFRAESTRUCTURAS',
    title: 'POLEMICA POR LA MACROAMPLIACIÓN DE LA TERMINAL DE CRUCEROS',
    desc: 'El sector logístico exige la ampliación del puerto mientras los colectivos vecinales alegan daño ambiental a la Albufera.',
    condition: (m) => true,
    options: [
      { text: 'Autorizar la ampliación norte del Puerto declarándola de interés prioritario', stats: { eco: +7, est: -3, apr: -5 }, cost: 1100, loyaltyImpact: { PP: +25, VOX: +25, PNV: +15, SUMAR: -35 }, news: 'Luz verde a la macroampliación del Puerto de Valencia.' },
      { text: 'Exigir una nueva Declaración de Impacto Ambiental congelando las obras', stats: { eco: -3, est: +3, apr: +5 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -25, VOX: -25 }, news: 'El Ejecutivo paraliza la ampliación del puerto hasta evaluar la Albufera.' }
    ]
  },
  {
    id: 'CRISIS_CENTROS_MENORES',
    category: 'SANIDAD Y SOCIAL',
    title: 'COLAPSO EN LA RED DE ACOGIDA DE MENORES NO ACOMPAÑADOS',
    desc: 'Canarias exige el reparto obligatorio de menores inmigrantes entre todas las comunidades autónomas.',
    condition: (m) => true,
    options: [
      { text: 'Decretar el reparto vinculante por cuotas poblacionales en todas las CCAA', stats: { eco: -2, est: -4, apr: -4 }, cost: 500, loyaltyImpact: { CC: +40, SUMAR: +20, PP: -30, VOX: -50 }, news: 'Decreto para el traslado obligatorio de menores no acompañados a las regiones.' },
      { text: 'Financiar la permanencia y crear centros de acogida masivos en origen e islas', stats: { eco: -5, est: +2, apr: -2 }, cost: 900, loyaltyImpact: { VOX: +15, PP: +15, CC: -35, SUMAR: -20 }, news: 'Moncloa inyecta fondos para ampliar los campamentos insulares.' }
    ]
  },
  {
    id: 'CAIDA_TURISMO_REINO_UNIDO',
    category: 'ECONOMÍA NACIONAL',
    title: 'TASAS DEL LONDRES A LOS VIAJES AL EXTRANJERO',
    desc: 'El Reino Unido aplica un impuesto de salida a sus ciudadanos reduciendo las reservas en las costas españolas.',
    condition: (m) => true,
    options: [
      { text: 'Lanzar una campaña de promoción en Europa Central y EEUU para diversificar', stats: { eco: -3, est: +2, apr: +2 }, cost: 60, loyaltyImpact: { PP: +10, SUMAR: +10 }, news: 'España busca captar turismo asiático y americano ante el bajón británico.' },
      { text: 'Bajar las tasas aeroportuarias de AENA para abaratarse frente a Grecia y Turquía', stats: { eco: +3, est: -2, apr: -2 }, cost: 0, loyaltyImpact: { PP: +20, VOX: +15, SUMAR: -15 }, news: 'AENA reduce las tarifas para no perder la llegada de aerolíneas low-cost.' }
    ]
  },
  {
    id: 'REGULACION_INFLUENCERS_PUBLICIDAD',
    category: 'TECNOLOGÍA Y DIGITAL',
    title: 'LEY DE TRANSPARENCIA EN CONTENIDOS DE CREADORES DIGITALES',
    desc: 'Sanidad exige etiquetar con la palabra "Publicidad" o "Filtro" cada publicación patrocinada en redes.',
    condition: (m) => true,
    options: [
      { text: 'Imponer el Registro de Creadores y multas de hasta 600.000€ por ocultar promociones', stats: { eco: +2, est: +3, apr: +6 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, PP: -10 }, news: 'Entra en vigor la Ley de Creadores Digitales con duras sanciones por fraude.' },
      { text: 'Establecer un código de buenas prácticas voluntario sin régimen sancionador duro', stats: { eco: 0, est: -2, apr: -4 }, cost: 0, loyaltyImpact: { PP: +10, VOX: +10, SUMAR: -15 }, news: 'Cultura se limita a pedir autorregulación a las agencias de influencers.' }
    ]
  },
  {
    id: 'POLEMICA_SECTORES_ELECTRIFICA',
    category: 'ENERGÍA & TRANSICIÓN',
    title: 'SOBRECARGA EN LA RED ELECTRICA POR CENTROS DE DATOS',
    desc: 'Los nuevos centros de computación de la nube absorben el 10% de la energía de la zona centro.',
    condition: (m) => true,
    options: [
      { text: 'Exigir que los Data Centers instalen su propia planta solar/eólica para operar', stats: { eco: -2, est: +4, apr: +4 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, PP: -15 }, news: 'Las Big Tech deberán autoproveerse de energía limpia para construir data centers.' },
      { text: 'Priorizar el suministro a los datos frente a la industria pesada tradicional', stats: { eco: +5, est: -5, apr: -8 }, cost: 0, loyaltyImpact: { PP: +20, PNV: +15, SUMAR: -25 }, news: 'Prioridad a la economía digital desatando críticas del sector metalúrgico.' }
    ]
  },
  {
    id: 'CONFLICTO_DERECHOS_DE_AUTOR_AI',
    category: 'TECNOLOGÍA Y DIGITAL',
    title: 'DEMANDA DE CREADORES CONTRA EMPRESAS DE INTELIGENCIA ARTIFICIAL',
    desc: 'Autores y artistas acusan a las Big Tech de entrenar modelos de IA con su obra sin pagar derechos.',
    condition: (m) => true,
    options: [
      { text: 'Fijar el Canon Digital de Inteligencia Artificial para remunerar a los creadores', stats: { eco: +2, est: +2, apr: +6 }, cost: 0, loyaltyImpact: { SUMAR: +25, PODEMOS: +25, PP: -20 }, news: 'España aprueba el canon de IA para compensar a los artistas locales.' },
      { text: 'Proteger la minería de datos libre para atraer inversiones tecnológicas', stats: { eco: +4, est: -3, apr: -6 }, cost: 0, loyaltyImpact: { PP: +20, VOX: +15, SUMAR: -25 }, news: 'El Ejecutivo prioriza la innovación tecnológica frente al canon de autor.' }
    ]
  },
  {
    id: 'CRISIS_MEDICAMENTOS_GENERICOS',
    category: 'SANIDAD Y SOCIAL',
    title: 'RIESGO DE DESABASTECIMIENTO DE GENÉRICOS POR PRECIOS BAJOS',
    desc: 'Las farmacéuticas amenazan con dejar de fabricar paracetamol o ibuprofeno a 1€ por falta de margen.',
    condition: (m) => true,
    options: [
      { text: 'Actualizar un 10% el precio de venta de genéricos básicos para evitar el desabastecimiento', stats: { eco: -2, est: +4, apr: -4 }, cost: 200, loyaltyImpact: { PP: +15, PNV: +15, SUMAR: -15 }, news: 'Ajuste de precio en los genéricos básicos para garantizar el suministro.' },
      { text: 'Mantener congelados los precios obligando al suministro por ley', stats: { eco: 0, est: -6, apr: +4 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +25, PP: -20 }, news: 'Tensión con la industria farmacéutica tras congelar los precios de los genéricos.' }
    ]
  },
  {
    id: 'INCUMPLIMIENTO_LEY_PARIDAD',
    category: 'SANIDAD Y SOCIAL',
    title: 'SANCIONES A EMPRESAS DEL IBEX POR FALTA DE MUJERES EN CONSEJOS',
    desc: 'El 40% de las cotizadas incumple el umbral obligatorio de presencia femenina en la directiva.',
    condition: (m) => true,
    options: [
      { text: 'Imponer las multas máximas y vetar su acceso a contratos públicos', stats: { eco: -1, est: -2, apr: +8 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -30, VOX: -45 }, news: 'Moncloa veta en las licitaciones a las empresas que incumplan la paridad.' },
      { text: 'Ampliar dos años el plazo de adaptación para evitar litigios internacionales', stats: { eco: +2, est: +3, apr: -6 }, cost: 0, loyaltyImpact: { PP: +25, VOX: +25, SUMAR: -30, PODEMOS: -35 }, news: 'Mórratoria de dos años para cumplir la directiva de paridad en cotizadas.' }
    ]
  },
  {
    id: 'DESERTIZACION_ESCUELAS_RURALES',
    category: 'SANIDAD Y SOCIAL',
    title: 'CIERRE DE COLEGIOS EN LA ESPAÑA VACIEDAD POR FALTA DE NIÑOS',
    desc: 'Decenas de pueblos pierden sus aulas al no alcanzar el mínimo de tres alumnos matriculados.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar la Beca Pauta Rural asegurando el transporte y comedor gratuito', stats: { eco: -3, est: +5, apr: +8 }, cost: 400, loyaltyImpact: { TeruelExiste: +40, PP: +15, SUMAR: +15 }, news: 'Plan de choque para sostener las escuelas en los pueblos en riesgo de despoblación.' },
      { text: 'Agrupar a los alumnos en concentraciones escolares en las cabeceras de comarca', stats: { eco: +2, est: -4, apr: -8 }, cost: 0, loyaltyImpact: { PP: -15, VOX: -15, TeruelExiste: -40 }, news: 'Protestas rurales por la clausura de pequeñas aulas comarcales.' }
    ]
  },
  {
    id: 'CRISIS_PESCA_MARRUECOS',
    category: 'GEOPOLÍTICA & COMERCIO',
    title: 'ANULACIÓN DEL ACUERDO PESQUERO UE-MARRUECOS POR LA JUSTICIA EUROPEA',
    desc: 'El TJUE anula el tratado por incluir aguas del Sáhara; 120 barcos andaluces y canarios quedan amarrados.',
    condition: (m) => true,
    options: [
      { text: 'Subvencionar el amarre de la flota mientras se negocia un pacto bilateral', stats: { eco: -4, est: +3, apr: +4 }, cost: 600, loyaltyImpact: { PP: +15, CC: +20, SUMAR: +10 }, news: 'Ayudas directas a la flota pesquera tras el varapalo judicial europeo.' },
      { text: 'Redistribuir las licencias hacia aguas del caladero nacional y la UE', stats: { eco: -2, est: -2, apr: -2 }, cost: 100, loyaltyImpact: { VOX: +10, BNG: +10, CC: -20 }, news: 'Reubicación compleja de la flota tras la cancelación del acuerdo pesquero.' }
    ]
  },
  {
    id: 'POLEMICA_SECTOR_JUEGO_LOTERIAS',
    category: 'ECONOMÍA NACIONAL',
    title: 'CAÍDA EN LA RECAUDACIÓN DE LA LOTERÍA NACIONAL',
    desc: 'Loterías del Estado pierde un 12% de ventas frente a las apuestas deportivas y el juego online.',
    condition: (m) => true,
    options: [
      { text: 'Modernizar los sorteos permitiendo la compra por Bizum y apps móviles', stats: { eco: +4, est: +2, apr: +2 }, cost: 100, loyaltyImpact: { PP: +10, PNV: +10 }, news: 'Loterías del Estado se digitaliza para competir en el mercado de juego.' },
      { text: 'Subir la cuantía de los premios eximiéndolos del impuesto del 20%', stats: { eco: -5, est: +2, apr: +6 }, cost: 500, loyaltyImpact: { SUMAR: +10, PP: +10 }, news: 'Moncloa rebaja el gravamen a los premios gordos de la Lotería.' }
    ]
  },
  {
    id: 'CRISIS_CEMENTERIOS_NUCLEARES',
    category: 'ENERGÍA & TRANSICIÓN',
    title: 'RECHAZO AUTONÓMICO AL ALMACÉN TEMPORAL INDIVIDUALIZADO (ATI)',
    desc: 'Las regiones se niegan a albergar los residuos radioactivos de las centrales en proceso de desmantelamiento.',
    condition: (m) => true,
    options: [
      { text: 'Construir el Almacén Temporal Centralizado (ATC) único en una zona despoblada', stats: { eco: -6, est: +4, apr: -8 }, cost: 1800, loyaltyImpact: { PP: -20, SUMAR: -20, VOX: +15 }, news: 'Moncloa impone la ubicación del Almacén Centralizado de Residuos Nucleares.' },
      { text: 'Pagar a Francia para que custodie el combustible gastado temporalmente', stats: { eco: -8, est: -2, apr: -2 }, cost: 2500, loyaltyImpact: { SUMAR: -15, PP: -15, VOX: -20 }, news: 'España pagará un canon millonario a París por albergar sus residuos nucleares.' }
    ]
  },
  {
    id: 'TENSION_PAGOS_EN_EFECTIVO',
    category: 'ECONOMÍA NACIONAL',
    title: 'PROPUESTA DE ELIMINAR EL EFECTIVO EN COMPRAS SUPERIORES A 500€',
    desc: 'El Ministerio de Hacienda busca estrechar el cerco sobre la economía sumergida reduciendo el límite de pago en metálico.',
    condition: (m) => true,
    options: [
      { text: 'Fijar el límite de pago en efectivo en 500€ de forma obligatoria', stats: { eco: +5, est: -4, apr: -8 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, PP: -30, VOX: -45 }, news: 'Nuevas restricciones al uso del dinero en efectivo para combatir el fraude.' },
      { text: 'Mantener el límite en 1.000€ protegiendo el dinero físico como medio legal', stats: { eco: -2, est: +3, apr: +5 }, cost: 0, loyaltyImpact: { PP: +25, VOX: +35, SUMAR: -20 }, news: 'Hacienda mantendrá los límites actuales del pago en dinero metálico.' }
    ]
  },
  {
    id: 'REVIU_SISTEMA_ADOPCIONES',
    category: 'SANIDAD Y SOCIAL',
    title: 'AGILIZACIÓN POR LEY DE LOS PROCESOS DE ADOPCIÓN Y ACOGIDA',
    desc: 'Se busca reducir los plazos de espera de 5 años para las familias demandantes de adopción.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar la Ley de Tramitación Rápida con silencio administrativo positivo', stats: { eco: -1, est: +5, apr: +10 }, cost: 30, loyaltyImpact: { PP: +20, SUMAR: +20, VOX: +15 }, news: 'Reforma histórica del sistema de acogida para acelerar las adopciones.' },
      { text: 'Aumentar las inspecciones psicosociales previas sin acortar plazos formales', stats: { eco: 0, est: -2, apr: -4 }, cost: 0, loyaltyImpact: { PODEMOS: +10, SUMAR: -10 }, news: 'El Ejecutivo prioriza las garantías de protección frente a la rapidez.' }
    ]
  },
  {
    id: 'CONFLICTO_TAXIS_AEROPUERTO_MADRID',
    category: 'INFRAESTRUCTURAS',
    title: 'COBRO RECARGO TARIFA FIJA AEROPUERTO',
    desc: 'Asociaciones de consumidores denuncian la tarifa plana de 33€ por considerarla abusiva para trayectos cortos.',
    condition: (m) => true,
    options: [
      { text: 'Sustituir la tarifa fija por taxímetro obligatorio con precio máximo', stats: { eco: 0, est: +2, apr: +6 }, cost: 0, loyaltyImpact: { SUMAR: +15, PP: -15, VOX: -15 }, news: 'Fomento eliminará la tarifa fija de taxi al aeropuerto e impondrá taxímetro.' },
      { text: 'Mantener la tarifa plana para evitar sorpresas a los turistas internacionales', stats: { eco: +1, est: -2, apr: -4 }, cost: 0, loyaltyImpact: { PP: +15, VOX: +15, SUMAR: -15 }, news: 'Confirmada la validez de la tarifa plana de taxi hacia el aeropuerto.' }
    ]
  },
  {
    id: 'CRISIS_RECALIFICACION_TERRENOS',
    category: 'CORRUPCIÓN Y JUSTICIA',
    title: 'INVESTIGACIÓN POR RECALIFICACIÓN DE SUELO TRAS INCENDIOS',
    desc: 'Sospechas de especulación urbanística en montes quemados hace tres años en el litoral mediterráneo.',
    condition: (m) => true,
    options: [
      { text: 'Prohibir por ley la recalificación de suelos forestales en 50 años', stats: { eco: -2, est: +6, apr: +10 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -25, VOX: -30 }, news: 'Blindaje total a los montes quemados frente al ladrillo y la especulación.' },
      { text: 'Permitir excepciones para proyectos industriales de interés público estratégico', stats: { eco: +4, est: -6, apr: -8 }, cost: 0, loyaltyImpact: { PP: +20, VOX: +20, SUMAR: -30 }, news: 'Aprobadas exenciones urbanísticas en zonas forestales no regeneradas.' }
    ]
  },
  {
    id: 'FUGA_DE_EMPRESAS_PAIS_VASCO',
    category: 'POLÍTICA TERRITORIAL',
    title: 'QUEJAS POR LA REVISIÓN DEL CONVENIO ECONÓMICO VASCO',
    desc: 'Otras regiones acusan al País Vasco de "dumping fiscal" por sus deducciones al IRPF a grandes fortunas.',
    condition: (m) => true,
    options: [
      { text: 'Defender el Convenio Económico y el Cupo Vasco sin modificaciones', stats: { eco: -2, est: +4, apr: -8 }, cost: 0, loyaltyImpact: { PNV: +40, EH_BILDU: +30, PP: -25, VOX: -45 }, news: 'Moncloa respalda la autonomía fiscal vasca rechazando los ataques.' },
      { text: 'Establecer un suelo fiscal mínimo de IRPF y Patrimonio para todas las CCAA', stats: { eco: +5, est: -6, apr: +6 }, cost: 0, loyaltyImpact: { SUMAR: +20, PP: +15, PNV: -45, EH_BILDU: -40 }, news: 'Hacienda fijará topes mínimos fiscales para erradicar la competencia regional.' }
    ]
  },
  {
    id: 'PROTESTAS_PERSONAL_CABINA_AVION',
    category: 'INFRAESTRUCTURAS',
    title: 'HUELGA DE TRIPULANTES EN AEROLÍNEAS LOW-COST',
    desc: 'Cancelaciones masivas de vuelos en verano por protestas de la plantilla contra la legislación laboral extranjera.',
    condition: (m) => true,
    options: [
      { text: 'Obligar a las aerolíneas a aplicar la legislación laboral española a sus bases aquí', stats: { eco: -2, est: +5, apr: +8 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -20 }, news: 'Trabajo exige a las aerolíneas extranjeras cumplir con el Estatuto de los Trabajadores.' },
      { text: 'Fijar servicios mínimos del 85% para proteger la campaña turística', stats: { eco: +3, est: -5, apr: -6 }, cost: 0, loyaltyImpact: { PP: +20, VOX: +20, SUMAR: -25, PODEMOS: -30 }, news: 'Servicios mínimos del 85% en las huelgas de aerolíneas para salvar las vacaciones.' }
    ]
  },
  {
    id: 'POLEMICA_SECTOR_CARNICO',
    category: 'AGRICULTURA Y MEDIO AMBIENTE',
    title: 'DECLARACIONES SOBRE LAS MACROGRANJAS Y LA EXPORTACIÓN DE CARNE',
    desc: 'Un ministro cuestiona la sostenibilidad de las macrogranjas provocando la ira de la patronal cárnica.',
    condition: (m) => true,
    options: [
      { text: 'Prohibir la concesión de licencias a nuevas macrogranjas intensivas', stats: { eco: -3, est: -4, apr: +8 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -35, VOX: -45 }, news: 'Moncloa aprueba la moratoria nacional contra las macrogranjas cárnicas.' },
      { text: 'Rectificar las declaraciones y lanzar un plan de promoción del sector porcino', stats: { eco: +3, est: +4, apr: -8 }, cost: 40, loyaltyImpact: { PP: +25, VOX: +30, SUMAR: -30, PODEMOS: -35 }, news: 'Campaña institucional de apoyo a la ganadería e industria cárnica.' }
    ]
  },
  {
    id: 'CRISIS_INSTITUTO_CERVANTES',
    category: 'RELACIONES INTERNACIONALES',
    title: 'RECORTE DE SEDES DEL INSTITUTO CERVANTES EN LATINOAMÉRICA',
    desc: 'La falta de presupuesto amenaza el cierre de diez centros de difusión del español en el exterior.',
    condition: (m) => true,
    options: [
      { text: 'Aumentar la dotación para expansión del español en India y África', stats: { eco: -2, est: +3, apr: +4 }, cost: 250, loyaltyImpact: { PP: +15, SUMAR: +10, VOX: +10 }, news: 'Refuerzo presupuestario para la acción cultural del Instituto Cervantes.' },
      { text: 'Autofinanciar las sedes cobrando matrículas de mercado por las actividades', stats: { eco: +2, est: -2, apr: -2 }, cost: 0, loyaltyImpact: { PP: -10, SUMAR: -10 }, news: 'El Cervantes pasa a un modelo de cobro comercial para sostener sus sedes.' }
    ]
  },
  {
    id: 'AMPLIACION_EDAD_EDUCACION_OBLIGATORIA',
    category: 'SANIDAD Y SOCIAL',
    title: 'PROPUESTA DE AMPLIAR LA ESCOLARIZACIÓN OBLIGATORIA A LOS 18 AÑOS',
    desc: 'Educación busca reducir el abandono escolar temprano igualando el estándar de los países nórdicos.',
    condition: (m) => true,
    options: [
      { text: 'Extender la enseñanza obligatoria e integrar la FP Dual', stats: { eco: -5, est: +6, apr: +6 }, cost: 1800, loyaltyImpact: { SUMAR: +25, PODEMOS: +25, PP: -15, VOX: -20 }, news: 'Reforma educativa para mantener la escolarización formal hasta los 18 años.' },
      { text: 'Fomentar escuelas taller voluntarias desde los 15 años sin ampliar la etapa obligatoria', stats: { eco: +1, est: +2, apr: -2 }, cost: 300, loyaltyImpact: { PP: +20, PNV: +15, SUMAR: -15 }, news: 'Plan de Escuelas Taller alternativas para frenar el abandono escolar.' }
    ]
  },
  {
    id: 'COMPRA_CEMENTERAS_ESTATALES',
    category: 'INFRAESTRUCTURAS',
    title: 'ENCARECIMIENTO DEL CEMENTO POR EL CO2',
    desc: 'Las obras públicas se paralizan ante la subida del 40% en el precio de los materiales de construcción.',
    condition: (m) => m.eco < 45,
    options: [
      { text: 'Indexar los contratos públicos de obra a la inflación de materiales', stats: { eco: -6, est: +5, apr: -2 }, cost: 1500, loyaltyImpact: { PP: +20, PNV: +20, SUMAR: -20 }, news: 'El Gobierno compensará a las constructoras por el sobrecoste de materiales.' },
      { text: 'Obligar a las licitadoras a asumir el riesgo de precios bajo amenaza de rescisión', stats: { eco: +2, est: -8, apr: -6 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, PP: -30 }, news: 'Ola de renuncias en la licitación de obras públicas por la rigidez de costes.' }
    ]
  },
  {
    id: 'CRISIS_ENERGIA_EOLICA_GALICIA',
    category: 'ENERGÍA & TRANSICIÓN',
    title: 'PARALIZACIÓN JUDICIAL DE MACROPARQUES EÓLICOS',
    desc: 'El Tribunal Superior paraliza 40 parques eólicos por su impacto en la biodiversidad y el paisaje rural.',
    condition: (m) => true,
    options: [
      { text: 'Modificar la Ley de Evaluación Ambiental para blindar los proyectos renovables', stats: { eco: +6, est: -5, apr: -8 }, cost: 0, loyaltyImpact: { PP: +25, VOX: +20, BNG: -45, SUMAR: -30 }, news: 'Moncloa simplifica la tramitación ambiental para desatascar la eólica.' },
      { text: 'Acatar las sentencias y reubicar las turbinas en zonas marinas (offshore)', stats: { eco: -4, est: +4, apr: +6 }, cost: 1200, loyaltyImpact: { BNG: +35, SUMAR: +20, PP: -20, VOX: -20 }, news: 'Apuesta por la eólica marina tras el frenazo judicial en los montes.' }
    ]
  },
  {
    id: 'TENSION_EMBAJADA_ISRAEL',
    category: 'RELACIONES INTERNACIONALES',
    title: 'ROMPIMIENTO TEMPORAL DE RELACIONES DIPLOMÁTICAS',
    desc: 'El reconocimiento formal del Estado de Palestina genera una fuerte crisis diplomática y llamada a consultas.',
    condition: (m) => true,
    options: [
      { text: 'Mantener el reconocimiento firme liderando la posición en la Unión Europea', stats: { eco: -2, est: +2, apr: +10 }, cost: 0, loyaltyImpact: { SUMAR: +40, PODEMOS: +45, ERC: +30, PP: -35, VOX: -50 }, news: 'España reafirma su postura internacional reconociendo formalmente a Palestina.' },
      { text: 'Pausar los trámites hasta alcanzar una posición común respaldada por los 27', stats: { eco: 0, est: +2, apr: -8 }, cost: 0, loyaltyImpact: { PP: +25, VOX: +30, SUMAR: -35, PODEMOS: -40 }, news: 'Moncloa supedita el paso diplomático al consenso unánime de la UE.' }
    ]
  },
  {
    id: 'REGULACION_PATINETES_ELECTRICOS',
    category: 'INFRAESTRUCTURAS',
    title: 'ALTO ÍNDICE DE ACCIDENTES POR VEHÍCULOS DE MOBILIDAD PERSONAL',
    desc: 'Aumento de atropellos en aceras empuja a pedir seguro obligatorio y casco para los patinetes.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar la matriculación y seguro de responsabilidad civil obligatorio', stats: { eco: +1, est: +4, apr: +8 }, cost: 0, loyaltyImpact: { PP: +20, VOX: +20, SUMAR: +10 }, news: 'Seguro obligatorio y matrícula para todos los patinetes eléctricos.' },
      { text: 'Dejar la regulación en manos de las ordenanzas de tráfico municipales', stats: { eco: 0, est: -2, apr: -4 }, cost: 0, loyaltyImpact: { SUMAR: -10, PP: -10 }, news: 'Moncloa delega en los ayuntamientos el control de la movilidad en patinete.' }
    ]
  },
  {
    id: 'CRISIS_CONSUMO_CARNE_VEGETAL',
    category: 'AGRICULTURA Y MEDIO AMBIENTE',
    title: 'DISPUTA POR EL ETIQUETADO DE PRODUCTOS VEGANOS',
    desc: 'La industria cárnica exige prohibir términos como "hamburguesa" o "salchicha" en alimentos vegetales.',
    condition: (m) => true,
    options: [
      { text: 'Reservar las denominaciones tradicionales exclusivamente a la carne animal', stats: { eco: 0, est: +3, apr: -2 }, cost: 0, loyaltyImpact: { PP: +25, VOX: +30, SUMAR: -25, PODEMOS: -30 }, news: 'Prohibido usar nombres cárnicos en la publicidad de productos veganos.' },
      { text: 'Permitir las denominaciones si se especifica claramente el origen vegetal', stats: { eco: 0, est: -2, apr: +4 }, cost: 0, loyaltyImpact: { SUMAR: +25, PODEMOS: +30, PP: -20, VOX: -25 }, news: 'Luz verde al etiquetado vegetal siempre que aclare el origen del alimento.' }
    ]
  },
  {
    id: 'CAIDA_PORTALES_INMOBILIARIOS',
    category: 'TECNOLOGÍA Y DIGITAL',
    title: 'INVESTIGACIÓN POR PACTO DE PRECIOS EN ALQUILERES',
    desc: 'Competencia investiga a los grandes portales de la propiedad por usar algoritmos para inflar rentas.',
    condition: (m) => true,
    options: [
      { text: 'Multa ejemplar del 10% del volumen de negocio y prohibir los algoritmos de precios', stats: { eco: +3, est: +4, apr: +10 }, cost: 0, loyaltyImpact: { SUMAR: +35, PODEMOS: +40, PP: -20, VOX: -20 }, news: 'Dura sanción de la CNMC a los portales por la fijación algorítmica del alquiler.' },
      { text: 'Obligar a la apertura del código fuente de las plataformas para auditorías públicas', stats: { eco: -1, est: +2, apr: +4 }, cost: 100, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, PP: -10 }, news: 'Obligatoriedad de auditar los códigos informáticos del sector inmobiliario.' }
    ]
  },
  {
    id: 'DESBORDAMIENTO_RIVERAS_EBRO',
    category: 'MEDIO AMBIENTE & AGUA',
    title: 'CRECIDA HISTÓRICA DEL RÍO EBRO Y ENCHANCAMIENTOS',
    desc: 'Inundaciones masivas anegan miles de hectáreas agrícolas en Aragón y Navarra.',
    condition: (m) => true,
    options: [
      { text: 'Limpiar el cauce del río y dragar las motas con plan especial de obras', stats: { eco: -4, est: +6, apr: +8 }, cost: 600, loyaltyImpact: { PP: +25, VOX: +30, SUMAR: -20 }, news: 'Obras de emergencia para la limpieza y dragado del cauce del Ebro.' },
      { text: 'Comprar terrenos inundables a los agricultores para crear zonas de laminación natural', stats: { eco: -5, est: +2, apr: +2 }, cost: 900, loyaltyImpact: { SUMAR: +25, PODEMOS: +25, PP: -20, VOX: -25 }, news: 'Compra de suelo inundable para permitir el cauce natural de las crecidas.' }
    ]
  },
  {
    id: 'CRISIS_PROFESORADO_SECUNDARIA',
    category: 'SANIDAD Y SOCIAL',
    title: 'FALTA DE PROFESORES DE MATEMÁTICAS Y TECNOLOGÍA',
    desc: 'Los graduados prefieren la industria privada, dejando vacías cientos de plazas en los institutos.',
    condition: (m) => true,
    options: [
      { text: 'Crear un plus salarial STEM para atraer profesionales a la enseñanza pública', stats: { eco: -3, est: +5, apr: +6 }, cost: 400, loyaltyImpact: { PP: +15, SUMAR: +15, PNV: +10 }, news: 'Incentivos económicos para cubrir las plazas docentes de ciencias y tecnología.' },
      { text: 'Permitir la docencia a graduados sin el Máster de Profesorado de forma interina', stats: { eco: 0, est: -5, apr: -6 }, cost: 0, loyaltyImpact: { SUMAR: -20, PODEMOS: -25, PP: +10 }, news: 'Flexibilización de los requisitos para dar clase en secundaria levantando críticas.' }
    ]
  },
  {
    id: 'POLEMICA_SECTOR_PEAJE_HORMIGON',
    category: 'INFRAESTRUCTURAS',
    title: 'RESCATE DE OBLIGACIONES EN LAS AUTOPISTAS RADIALES',
    desc: 'Sentencias judiciales obligan al Estado a pagar la Responsabilidad Patrimonial de la Administración (RPA).',
    condition: (m) => true,
    options: [
      { text: 'Abonar la indemnización de la RPA e integrar las autovías en la red gratuita pública', stats: { eco: -8, est: +4, apr: +4 }, cost: 3200, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, PP: -25, VOX: -25 }, news: 'El Estado asume las radiales rescatadas eliminando los peajes directos.' },
      { text: 'Licitarlas de nuevo a concesionarias privadas para recuperar el coste del rescate', stats: { eco: +6, est: -6, apr: -10 }, cost: 0, loyaltyImpact: { PP: +25, VOX: +25, SUMAR: -35, PODEMOS: -40 }, news: 'Privatización de la gestión de las radiales para no elevar el déficit público.' }
    ]
  },
  {
    id: 'CRISIS_LITIO_EXTREMADURA',
    category: 'ENERGÍA & TRANSICIÓN',
    title: 'CONFLICTO POR LA APERTURA DE MINAS DE LITIO A CIELO ABIERTO',
    desc: 'Empresas mineras solicitan la extracción del mineral clave para baterías ante la oposición vecinal.',
    condition: (m) => true,
    options: [
      { text: 'Declarar el Litio como Recurso Estratégico de Interés Nacional autorizando la mina', stats: { eco: +8, est: -5, apr: -8 }, cost: 0, loyaltyImpact: { PP: +25, VOX: +20, SUMAR: -40, PODEMOS: -45 }, news: 'Luz verde a la mina de litio amparándose en el interés estratégico nacional.' },
      { text: 'Exigir que el procesado y fabricación de baterías se quede íntegramente en la región', stats: { eco: +3, est: +4, apr: +6 }, cost: 500, loyaltyImpact: { SUMAR: +25, PODEMOS: +20, PP: -15 }, news: 'La mina de litio solo operará si se construye la fábrica de baterías anexa.' }
    ]
  },
  {
    id: 'POLEMICA_TASA_BEBIDAS_AZUCARADAS',
    category: 'SANIDAD Y SOCIAL',
    title: 'DISPARO DE LA OBESIDAD INFANTIL Y TASA AL AZÚCAR',
    desc: 'Sanidad plantea extender el impuesto sobre bebidas carbonatadas a los bollos e hiperprocesados.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar el impuesto del 20% a la bollería industrial y bebidas azucaradas', stats: { eco: +4, est: -2, apr: +4 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -30, VOX: -35 }, news: 'Nuevo gravamen sobre la bollería e hiperprocesados para combatir la obesidad.' },
      { text: 'Sustituir impuestos por un código de reducción voluntaria de azúcares con la industria', stats: { eco: 0, est: +2, apr: -4 }, cost: 0, loyaltyImpact: { PP: +20, VOX: +25, SUMAR: -25, PODEMOS: -30 }, news: 'Pacto voluntario con la industria alimentaria desechando la nueva tasa fiscal.' }
    ]
  },
  {
    id: 'TENSION_COMPRAS_INTELIGENCIA_ARTIFICIAL_DEFENSA',
    category: 'DEFENSA Y SEGURIDAD',
    title: 'USO DE SISTEMAS AUTÓNOMOS ARMADOS EN EL EJÉRCITO',
    desc: 'El Ejército de Tierra prueba drones autónomos con capacidad de fuego dirigida por algoritmos.',
    condition: (m) => true,
    options: [
      { text: 'Prohibir por completo el uso de armas letales autónomas sin supervisión humana', stats: { eco: 0, est: +3, apr: +8 }, cost: 0, loyaltyImpact: { SUMAR: +35, PODEMOS: +40, PP: -20, VOX: -30 }, news: 'España prohíbe el uso de armamento totalmente autónomo en las FFAA.' },
      { text: 'Financiar la investigación militar en IA para no quedar rezagados frente a la OTAN', stats: { eco: -3, est: +5, apr: -6 }, cost: 700, loyaltyImpact: { PP: +25, VOX: +30, SUMAR: -30, PODEMOS: -35 }, news: 'Inversión estratégica en robótica e inteligencia artificial de uso militar.' }
    ]
  },
  {
    id: 'CRISIS_DEL_SECTOR_DEL_CALZADO',
    category: 'ECONOMÍA NACIONAL',
    title: 'COMPETENCIA DESLEAL EN LA INDUSTRIA DE LA PIEL EN ALICANTE',
    desc: 'Las empresas de calzado pierden cuota de mercado frente a productos importados de bajo coste sin trazabilidad.',
    condition: (m) => m.eco < 45,
    options: [
      { text: 'Imponer el Sello de Calidad "Hecho en España" obligando a trazar el 100% del curtido', stats: { eco: +2, est: +3, apr: +6 }, cost: 100, loyaltyImpact: { PP: +20, VOX: +20, SUMAR: +10 }, news: 'Moncloa crea el sello protegido de la piel y el calzado español.' },
      { text: 'Conceder un plan de reconversión con fondos de formación y despidos indemnizados', stats: { eco: -3, est: -2, apr: -2 }, cost: 400, loyaltyImpact: { SUMAR: +15, PP: -10 }, news: 'Plan de reconversión industrial para las comarcas del calzado.' }
    ]
  },
  {
    id: 'REFORMA_METODO_CALCULO_IPC',
    category: 'ECONOMÍA NACIONAL',
    title: 'ACUSACIONES DE MANIPULACIÓN EN LA CESTA DE LA COMPRA DEL INE',
    desc: 'El Instituto de Estadística cambia la ponderación de la electricidad rebajando artificialmente el IPC.',
    condition: (m) => true,
    options: [
      { text: 'Restablecer el modelo de cálculo tradicional para dar transparencia', stats: { eco: -3, est: +4, apr: +5 }, cost: 0, loyaltyImpact: { SUMAR: +15, PP: +15, VOX: +15 }, news: 'El INE rectifica el cálculo del IPC incorporando todas las tarifas del mercado.' },
      { text: 'Mantener la nueva metodología avalada por la oficina estadística Eurostat', stats: { eco: +3, est: -4, apr: -8 }, cost: 0, loyaltyImpact: { PP: -20, VOX: -25, SUMAR: -20 }, news: 'Críticas de la oposición a la metodología del INE en la medición de precios.' }
    ]
  },
  {
    id: 'CONFLICTO_REGADIO_DONANA',
    category: 'AGRICULTURA Y MEDIO AMBIENTE',
    title: 'AMENAZA DE SANCIONES DE LA UE POR LOS POZOS ILEGALES EN DOÑANA',
    desc: 'Bruselas exige la clausura inmediata de regadíos sin concesión alrededor del Parque Nacional.',
    condition: (m) => true,
    options: [
      { text: 'Cerrar por la fuerza los pozos ilegales e indemnizar la reconversión a secano', stats: { eco: -3, est: +6, apr: +8 }, cost: 500, loyaltyImpact: { SUMAR: +35, PODEMOS: +40, PP: -35, VOX: -45 }, news: 'Clausura de los pozos clandestinos en el entorno protegido de Doñana.' },
      { text: 'Aprobar una ley de regularización de fincas con agua trasvasada de otras cuencas', stats: { eco: +2, est: -8, apr: -10 }, cost: 800, loyaltyImpact: { PP: +30, VOX: +35, SUMAR: -40, PODEMOS: -45 }, news: 'Legalización de regadíos en Doñana mediante la llegada de agua trasvasada.' }
    ]
  },
  {
    id: 'CRISIS_CENTROS_DE_CONTENCION_JUVENIL',
    category: 'SANIDAD Y SOCIAL',
    title: 'DENUNCIAS POR CONDICIONES EN CENTROS DE MENORES INFRACCIONALES',
    desc: 'Organizaciones de Derechos Humanos piden el cierre de instalaciones privadas de internamiento.',
    condition: (m) => true,
    options: [
      { text: 'Públicar la gestión de los centros de menores retirando las concesiones a fundaciones', stats: { eco: -3, est: +4, apr: +6 }, cost: 350, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -20 }, news: 'Paso a control 100% público de los centros de internamiento de menores.' },
      { text: 'Incrementar las inspecciones de la Fiscalía manteniendo la gestión concertada', stats: { eco: 0, est: -2, apr: -2 }, cost: 0, loyaltyImpact: { PP: +15, VOX: +15, SUMAR: -15 }, news: 'Refuerzo de las inspecciones en los centros de menores sin cambios de modelo.' }
    ]
  },
  {
    id: 'SABOTAJE_REDE_FIBRA_OPTICA_RURAL',
    category: 'TECNOLOGÍA Y DIGITAL',
    title: 'DESTROZO DE ARQUETAS DE TELECOMUNICACIONES EN PUEBLOS',
    desc: 'Cortes intencionados dejan sin TPV ni cajeros a tres comarcas rurales durante días.',
    condition: (m) => true,
    options: [
      { text: 'Declarar la red de fibra rural como Infraestructura de Seguridad Nacional', stats: { eco: -2, est: +5, apr: +4 }, cost: 20, loyaltyImpact: { TeruelExiste: +25, PP: +15, VOX: +15 }, news: 'Blindaje policial para las telecomunicaciones en el medio rural.' },
      { text: 'Obligar a las operadoras a mantener enlaces por satélite de respaldo', stats: { eco: -1, est: +2, apr: +2 }, cost: 0, loyaltyImpact: { SUMAR: +10, PP: +10 }, news: 'Respaldo por satélite obligatorio para no dejar a los pueblos incomunicados.' }
    ]
  },
  {
    id: 'POLEMICA_IMPUESTO_GRANDES_FORTUNAS',
    category: 'ECONOMÍA NACIONAL',
    title: 'CADUCIDAD DEL IMPUESTO TEMPORAL DE SOLIDARIDAD A LAS FORTUNAS',
    desc: 'El gravamen sobre patrimonios superiores a 3 M€ llega a la fecha de revisión estipulada.',
    condition: (m) => true,
    options: [
      { text: 'Hacer permanente el Impuesto a las Grandes Fortunas en todo el Estado', stats: { eco: +6, est: -5, apr: +10 }, cost: 0, loyaltyImpact: { SUMAR: +40, PODEMOS: +45, PP: -45, VOX: -50 }, news: 'El Gobierno consolida el impuesto permanente sobre el gran patrimonio.' },
      { text: 'Dejarlo caducar para evitar la deslocalización fiscal de inversores a Portugal o Andorra', stats: { eco: -4, est: +4, apr: -12 }, cost: 0, loyaltyImpact: { PP: +35, VOX: +40, SUMAR: -40, PODEMOS: -45 }, news: 'Supresión del impuesto a las grandes fortunas para atraer patrimonio.' }
    ]
  },
  {
    id: 'CRISIS_PROFESION_ENFERMERIA',
    category: 'SANIDAD Y SOCIAL',
    title: 'EMIGRACIÓN DE ENFERMERAS A REINO UNIDO Y ALEMANIA',
    desc: 'Los colegios oficiales alertan de la fuga de 5.000 profesionales graduadas cada año por temporalidad.',
    condition: (m) => true,
    options: [
      { text: 'Consolidar por ley las plazas interinas fijando contratos mínimos de 3 años', stats: { eco: -4, est: +6, apr: +10 }, cost: 1200, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: +15 }, news: 'Plan de estabilización laboral masivo para la enfermería pública.' },
      { text: 'Aumentar las plazas en las facultades para suplir la fuga de profesionales', stats: { eco: -1, est: -4, apr: -6 }, cost: 150, loyaltyImpact: { SUMAR: -20, PODEMOS: -20, PP: +10 }, news: 'Más plazas universitarias de enfermería sin corregir la precariedad contractual.' }
    ]
  },
  {
    id: 'COMPRA_CORNISA_CANTABRICA_MADERA',
    category: 'AGRICULTURA Y MEDIO AMBIENTE',
    title: 'PROLIFERACIÓN SIN CONTROL DEL EUCALIPTO EN EL NORTE',
    desc: 'El monocultivo de madereras arruina la biodiversidad del bosque autóctono en Asturias y Galicia.',
    condition: (m) => true,
    options: [
      { text: 'Fijar una moratoria total a las nuevas plantaciones de eucalipto', stats: { eco: -2, est: +3, apr: +6 }, cost: 0, loyaltyImpact: { BNG: +35, SUMAR: +20, PP: -25, VOX: -25 }, news: 'Prohibición de plantar eucaliptos en suelos forestales protegidos.' },
      { text: 'Permitir la corta y replantación si se suministra a la industria papelera nacional', stats: { eco: +3, est: -3, apr: -4 }, cost: 0, loyaltyImpact: { PP: +20, VOX: +20, BNG: -35 }, news: 'Respaldo a la industria papelera autorizando las plantaciones madereras.' }
    ]
  },
  {
    id: 'TENSION_CONSTITUCIONAL_INDULTOS',
    category: 'CORRUPCIÓN Y JUSTICIA',
    title: 'PETICIÓN DE INDULTO A CONDENADOS POR MALVERSACIÓN',
    desc: 'El Supremo emite un informe contrario a la medida de gracia a ex-cargos condenados.',
    condition: (m) => true,
    options: [
      { text: 'Conceder el indulto por razones de utilidad pública y convivencia política', stats: { eco: 0, est: -8, apr: -14 }, cost: 0, loyaltyImpact: { ERC: +40, JUNTS: +35, PP: -50, VOX: -50, SUMAR: +10 }, news: 'El Gobierno aprueba los indultos en contra del criterio del Supremo.' },
      { text: 'Acatar el informe del Tribunal Supremo denegando la medida de gracia', stats: { eco: 0, est: +5, apr: +8 }, cost: 0, loyaltyImpact: { PP: +30, VOX: +35, ERC: -45, JUNTS: -50 }, news: 'Denegados los indultos políticos en acatamiento de la posición del Supremo.' }
    ]
  },
  {
    id: 'CRISIS_LITIGIOS_SISTEMA_SOLAR',
    category: 'ENERGÍA & TRANSICIÓN',
    title: 'LAUDOS INTERNACIONALES POR EL RECORTE A LAS RENOVABLES',
    desc: 'Tribunales de arbitraje exigen a España pagar 1.200 M€ a fondos extranjeros por cambios regulatorios pasados.',
    condition: (m) => true,
    options: [
      { text: 'Negociar una quita ofreciendo derechos de emisión de CO2 a los fondos', stats: { eco: -3, est: +3, apr: 0 }, cost: 600, loyaltyImpact: { PP: +15, PNV: +15, SUMAR: -10 }, news: 'Acuerdo de pagos diferidos con los fondos de inversión por el hachazo solar.' },
      { text: 'Rechazar el pago alegando la soberanía de los tribunales españoles', stats: { eco: -5, est: -6, apr: +2 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +25, PP: -30, VOX: -30 }, news: 'Riesgo de embargo de bienes públicos españoles tras el impago del laudo.' }
    ]
  },
  {
    id: 'REGULACION_VAPEADORES_JUVENIL',
    category: 'SANIDAD Y SOCIAL',
    title: 'BOOM DEL CONSUMO DE CIGARRILLOS ELECTRÓNICOS EN INSTITUTOS',
    desc: 'Sanidad detecta el inicio al tabaquismo a los 13 años debido a los vapers de sabores atractivos.',
    condition: (m) => true,
    options: [
      { text: 'Prohibir los vapeadores desechables y los aromatizantes de fruta/caramelo', stats: { eco: -1, est: +3, apr: +8 }, cost: 0, loyaltyImpact: { SUMAR: +25, PODEMOS: +25, PP: +10 }, news: 'Veto a los vapeadores desechables y sabores de caramelo o frutas.' },
      { text: 'Equiparar fiscalmente el vapeo al tabaco tradicional subiendo el estanco', stats: { eco: +4, est: 0, apr: +2 }, cost: 0, loyaltyImpact: { PP: +15, VOX: +15, SUMAR: -10 }, news: 'Impuesto especial al vapeo para desincentivar la compra en jóvenes.' }
    ]
  },
  {
    id: 'ACCESO_A_LA_UNIVERSIDAD_GRATUITA',
    category: 'SANIDAD Y SOCIAL',
    title: 'PROPUESTA DE GRATUIDAD DE MATRÍCULA PARA APROBADOS A LA PRIMERA',
    desc: 'Se busca bonificar el 100% de las tasas universitarias a quienes aprueben todas las materias.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar la gratuidad de matrícula en primera convocatoria universitaria', stats: { eco: -5, est: +5, apr: +12 }, cost: 1100, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -20 }, news: 'Matrícula universitaria gratuita para todos los estudiantes que aprueben.' },
      { text: 'Concentrar los fondos únicamente en becas de renta para familias vulnerables', stats: { eco: -2, est: +3, apr: +2 }, cost: 500, loyaltyImpact: { PP: +20, PNV: +15, SUMAR: -15 }, news: 'Inyección en las becas salario según renta desechando la gratuidad general.' }
    ]
  },
  {
    id: 'DESBORDAMIENTO_SISTEMA_ASILO',
    category: 'SANIDAD Y SOCIAL',
    title: 'COLAPSO EN LAS CITAS PARA SOLICITANTES DE ASILO',
    desc: 'Mafias revenden por internet las citas gratuitas de extranjería dejando en la ilegalidad a miles de personas.',
    condition: (m) => true,
    options: [
      { text: 'Regularizar de forma extraordinaria a los migrantes residentes con contrato de trabajo', stats: { eco: +3, est: -8, apr: +8 }, cost: 100, loyaltyImpact: { SUMAR: +40, PODEMOS: +45, BNG: +30, PP: -45, VOX: -50 }, news: 'Regularización extraordinaria de extranjeros con oferta de empleo.' },
      { text: 'Digitalizar el sistema mediante DNI electrónico reforzando la red de comisarías', stats: { eco: -2, est: +4, apr: -4 }, cost: 300, loyaltyImpact: { PP: +25, VOX: +30, SUMAR: -25, PODEMOS: -30 }, news: 'Plan informático anticorrupción para blindar las citas de extranjería.' }
    ]
  },
  {
    id: 'TENSION_CONSTITUCIONAL_BANDERA',
    category: 'POLÍTICA TERRITORIAL',
    title: 'CONFLICTO POR EL RETIRO DE BANDERAS OFICIALES EN AYUNTAMIENTOS',
    desc: 'Alcaldes insumisos retiran la bandera de España de las fachadas municipales.',
    condition: (m) => true,
    options: [
      { text: 'Llevar a los tribunales a los alcaldes incoando expediente de inhabilitación', stats: { eco: 0, est: +4, apr: +6 }, cost: 0, loyaltyImpact: { VOX: +35, PP: +25, ERC: -35, EH_BILDU: -40 }, news: 'Querella de la Fiscalía contra los regidores que retiraron la bandera oficial.' },
      { text: 'Ignorar los gestos simbólicos para evitar crispación social en los municipios', stats: { eco: 0, est: -4, apr: -8 }, cost: 0, loyaltyImpact: { ERC: +20, EH_BILDU: +20, PP: -35, VOX: -45 }, news: 'Moncloa evita judicializar el retiro de los símbolos en los ayuntamientos.' }
    ]
  },
  {
    id: 'CRISIS_MEDIO_AMBIENTE_MAR_MENOR',
    category: 'MEDIO AMBIENTE & AGUA',
    title: 'NUEVA ANXIA Y MORTALIDAD DE PECES EN EL MAR MENOR',
    desc: 'La entrada de nitratos agrícolas vuelve a colapsar el ecosistema de la laguna salada.',
    condition: (m) => true,
    options: [
      { text: 'Crear una franja de protección sin fertilizantes de 1,5 km alrededor de la laguna', stats: { eco: -4, est: +5, apr: +8 }, cost: 400, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -30, VOX: -40 }, news: 'Prohibidos los fertilizantes nitratados en el perímetro del Mar Menor.' },
      { text: 'Construir un canal de drenaje de salobres hacia la depuradora regional', stats: { eco: -3, est: +1, apr: -2 }, cost: 700, loyaltyImpact: { PP: +20, VOX: +25, SUMAR: -25 }, news: 'Plan de ingeniería de canalización para frenar el deterioro del Mar Menor.' }
    ]
  },
  {
    id: 'POLEMICA_SECTOR_SIDERURGICO',
    category: 'ECONOMÍA NACIONAL',
    title: 'DESCARBONIZACIÓN EN LAS GRANDES ACERÍAS DEL NORTE',
    desc: 'ArcelorMittal supedita sus inversiones en Asturias al cobro del 50% en subvenciones de descarbonización.',
    condition: (m) => true,
    options: [
      { text: 'Entregar los 450 M€ de ayuda pública para garantizar la producción de acero verde', stats: { eco: -4, est: +5, apr: +4 }, cost: 450, loyaltyImpact: { PP: +20, PNV: +20, SUMAR: +10 }, news: 'Subvención millonaria a la siderurgia para liderar el acero verde en Europa.' },
      { text: 'Exigir la entrada del Estado en el accionariado como condición para el rescate', stats: { eco: -1, est: -4, apr: +6 }, cost: 450, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -30, VOX: -30 }, news: 'Moncloa condiciona la ayuda a la siderurgia a entrar en su consejo.' }
    ]
  },
  {
    id: 'POLEMICA_JORNADA_37_HORAS',
    category: 'TRABAJO Y PENSIONES',
    title: 'REDUCCIÓN DE LA JORNADA LABORAL A 37,5 HORAS SIN BAJADA DE SUELDO',
    desc: 'El Ministerio de Trabajo tramita la reducción del tiempo de trabajo por ley frente a la oposición patronal.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar la ley de 37,5 horas semanales con régimen de fichaje digital obligatorio', stats: { eco: -4, est: -5, apr: +15 }, cost: 0, loyaltyImpact: { SUMAR: +45, PODEMOS: +45, PP: -45, VOX: -50 }, news: 'Histórica aprobación de la reducción de la jornada laboral a 37,5 horas.' },
      { text: 'Dejar la reducción de jornada a la negociación colectiva por sectores', stats: { eco: +4, est: +5, apr: -12 }, cost: 0, loyaltyImpact: { PP: +35, VOX: +30, PNV: +20, SUMAR: -45 }, news: 'La reducción de jornada queda sujeta a los convenios colectivos.' }
    ]
  },
  {
    id: 'CRISIS_INMIGRACION_CANARIAS',
    category: 'DEFENSA Y SEGURIDAD',
    title: 'LLEGADA RRECORD DE CAYUCOS A EL HIERRO Y TENERIFE',
    desc: 'Las infraestructuras de primera acogida de la Ruta Canaria se encuentran al 300% de capacidad.',
    condition: (m) => true,
    options: [
      { text: 'Instalar buques de asistencia de la Armada e instalar campamentos de urgencia', stats: { eco: -3, est: +5, apr: -2 }, cost: 600, loyaltyImpact: { CC: +25, VOX: +15, PP: +15, SUMAR: -10 }, news: 'Despliegue de logística militar para paliar el colapso asistencial en Canarias.' },
      { text: 'Solicitar la intervención directa de la agencia Frontex en las costas de África', stats: { eco: -1, est: +3, apr: +4 }, cost: 100, loyaltyImpact: { PP: +20, VOX: +25, CC: +20, SUMAR: -20 }, news: 'España pide ayuda a Frontex para patrullar las aguas internacionales.' }
    ]
  },
  {
    id: 'CRISIS_HOGARES_MONOPARENTALES',
    category: 'SANIDAD Y SOCIAL',
    title: 'EQUIPARACIÓN FISCAL DE LAS FAMILIAS MONOPARENTALES',
    desc: 'Ley de Familias busca equiparar los beneficios de un progenitor solo con dos hijos a la familia numerosa.',
    condition: (m) => true,
    options: [
      { text: 'Garantizar el estatus de Familia Numerosa a los hogares monoparentales con 2 hijos', stats: { eco: -3, est: +4, apr: +8 }, cost: 500, loyaltyImpact: { SUMAR: +30, PODEMOS: +30, PP: -10 }, news: 'Beneficios de familia numerosa para los hogares monoparentales.' },
      { text: 'Ofrecer únicamente una deducción en la declaración del IRPF de 1.200€', stats: { eco: -1, est: +2, apr: +2 }, cost: 60, loyaltyImpact: { PP: +15, PNV: +10, SUMAR: -15 }, news: 'Deducción fiscal aprobada para madres y padres solos sin cambiar estatus.' }
    ]
  },
  {
    id: 'HACKEO_RED_CATASTRO_ESTATAL',
    category: 'TECNOLOGÍA Y DIGITAL',
    title: 'FILTRACIÓN MUNDIAL DE DATOS DEL CATASTRO Y PROPIEDADES',
    desc: 'Un grupo de ciberdelincuentes publica el valor e historial Inmobiliario de todos los ciudadanos.',
    condition: (m) => true,
    options: [
      { text: 'Sustituir el sistema informático por una red de contabilidad Blockchain blindada', stats: { eco: -4, est: +4, apr: +2 }, cost: 700, loyaltyImpact: { PP: +10, VOX: +10, SUMAR: +10 }, news: 'El Catastro reconstruye sus bases de datos con tecnología criptográfica.' },
      { text: 'Ofrecer protección legal gratuita a los afectados por posible fraude fiscal', stats: { eco: -2, est: -4, apr: -6 }, cost: 15, loyaltyImpact: { SUMAR: -15, PP: -15 }, news: 'Moncloa asume responsabilidades legales tras la filtración catastral.' }
    ]
  },
  {
    id: 'PROTESTAS_PERSONAL_LIMPIEZA_HOSPITALES',
    category: 'SANIDAD Y SOCIAL',
    title: 'HUELGA DE SERVICIOS AUXILIARES EN LA SANIDAD PÚBLICA',
    desc: 'El personal de limpieza y cocina de los hospitales protesta por la subcontratación precaria.',
    condition: (m) => true,
    options: [
      { text: 'Internalizar el servicio en la red pública de salud', stats: { eco: -5, est: +6, apr: +10 }, cost: 1100, loyaltyImpact: { SUMAR: +35, PODEMOS: +40, PP: -30, VOX: -30 }, news: 'Los servicios de limpieza hospitalaria pasan a ser plantilla pública.' },
      { text: 'Obligar a las concesionarias a aplicar el convenio colectivo de sanidad', stats: { eco: 0, est: +2, apr: -2 }, cost: 0, loyaltyImpact: { PP: +15, PNV: +15, SUMAR: -20 }, news: 'Fuerzan a las empresas contratistas a elevar los sueldos del personal hospitalario.' }
    ]
  },
  {
    id: 'AMPLIACION_PEAJES_CATALUNA',
    category: 'INFRAESTRUCTURAS',
    title: 'EXIGENCIA DE LEVANTAR LAS CONCESIONES DE AUTOPISTAS AUTONÓMICAS',
    desc: 'Reclamación popular para eliminar el peaje residual en los túneles y accesos regionales.',
    condition: (m) => true,
    options: [
      { text: 'Abonar el rescate de las concesiones eliminando todos los peajes directos', stats: { eco: -5, est: +5, apr: +8 }, cost: 1300, loyaltyImpact: { ERC: +30, JUNTS: +30, PP: -20, VOX: -25 }, news: 'Liberados los últimos peajes directos de las autopistas catalanas.' },
      { text: 'Mantener las bonificaciones existentes a los residentes habituales sin rescatar', stats: { eco: +1, est: -2, apr: -4 }, cost: 100, loyaltyImpact: { PP: +15, VOX: +15, ERC: -25, JUNTS: -30 }, news: 'El Gobierno mantendrá las peajes con descuentos únicamente a residentes.' }
    ]
  },
  {
    id: 'POLEMICA_PLAN_CINEMATOGRAFICO',
    category: 'TECNOLOGÍA Y DIGITAL',
    title: 'SUBVENCIONES AL CINE ESPAÑOL Y TAQUILLAJES',
    desc: 'Un informe revela que varias películas subvencionadas apenas recaudaron 1.000€ en taquilla.',
    condition: (m) => true,
    options: [
      { text: 'Condicionar la ayuda futura a la audiencia real y visualizaciones en plataformas', stats: { eco: +2, est: +3, apr: +6 }, cost: 0, loyaltyImpact: { PP: +25, VOX: +35, SUMAR: -30, PODEMOS: -35 }, news: 'Reforma de las ayudas al cine que primará la taquilla y visualizaciones.' },
      { text: 'Mantener las subvenciones como inversión cultural no sujeta a rentabilidad', stats: { eco: -2, est: -3, apr: -4 }, cost: 100, loyaltyImpact: { SUMAR: +25, PODEMOS: +30, PP: -30, VOX: -40 }, news: 'Cultura defiende el cine independiente frente a los criterios comerciales.' }
    ]
  },
  {
    id: 'TENSION_PRESUPUESTOS_EJERCITO',
    category: 'DEFENSA Y SEGURIDAD',
    title: 'OBSOLESCENCIA DE LA FLOTA DE CAZAS HARRIER EN LA ARMADA',
    desc: 'La Marina advierte de que el portaaeronaves se quedará sin aviación si no se compran F-35 a EE. UU.',
    condition: (m) => true,
    options: [
      { text: 'Comprar 20 cazas F-35B estadounidenses asegurando el portaviones', stats: { eco: -7, est: +5, apr: -8 }, cost: 3100, loyaltyImpact: { PP: +30, VOX: +35, SUMAR: -45, PODEMOS: -50 }, news: 'España adquiere los cazas F-35 para la Armada garantizando el liderazgo naval.' },
      { text: 'Renunciar a los cazas embarcados y transformar el barco en buque anfibio', stats: { eco: +4, est: -6, apr: +4 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -35, VOX: -40 }, news: 'La Armada retirará los aviones de despegue vertical para reducir gasto.' }
    ]
  },
  {
    id: 'CRISIS_PESCA_MEDITERRANEO',
    category: 'AGRICULTURA Y MEDIO AMBIENTE',
    title: 'REDUCCIÓN DE DÍAS DE TRABAJO EN EL MEDITERRÁNEO POR LA UE',
    desc: 'Bruselas impone amarrar la flota de arrastre 120 días al año para recuperar los caladeros.',
    condition: (m) => true,
    options: [
      { text: 'Financiar la desguace voluntario de barcos indemnizando a los patronos', stats: { eco: -4, est: +2, apr: +2 }, cost: 600, loyaltyImpact: { PP: +10, ERC: +15, SUMAR: +10 }, news: 'Plan de reconversión y desguace para la flota de arrastre del Mediterráneo.' },
      { text: 'Impugnar la norma europea y permitir la pesca en reservas marítimas lejanas', stats: { eco: +1, est: -4, apr: -2 }, cost: 0, loyaltyImpact: { VOX: +20, PP: +15, SUMAR: -20 }, news: 'España desoye los días de paro europeos provocando expediente en Bruselas.' }
    ]
  },
  {
    id: 'PROTESTAS_BOMBEROS_FORESTALES',
    category: 'MEDIO AMBIENTE & AGUA',
    title: 'EXIGENCIA DE UN ESTATUTO BÁSICO DE BOMBEROS FORESTALES',
    desc: 'Los brigadistas exigen el reconocimiento de enfermedades profesionales y plantilla fija todo el año.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar por ley el Estatuto Marco garantizando la contratación los 12 meses', stats: { eco: -4, est: +6, apr: +10 }, cost: 800, loyaltyImpact: { SUMAR: +35, PODEMOS: +40, PP: +10 }, news: 'Aprobado el Estatuto del Bombero Forestal con estabilidad laboral fija.' },
      { text: 'Mantener la competencia en las autonomías apoyando con convenios puntuales', stats: { eco: 0, est: -4, apr: -6 }, cost: 0, loyaltyImpact: { PP: -15, VOX: -15, SUMAR: -25 }, news: 'Protestas del colectivo de bomberos forestales tras naufragar la ley estatal.' }
    ]
  },
  {
    id: 'AMPLIACION_REGIMEN_AUTONOMOS',
    category: 'TRABAJO Y PENSIONES',
    title: 'TENSIONES CON LAS ASOCIACIONES POR LA CUOTA DE AUTÓNOMOS',
    desc: 'Entra en vigor el tramo del sistema de cotización por ingresos reales con subidas a rentas medias.',
    condition: (m) => true,
    options: [
      { text: 'Congelar las cuotas a los autónomos que ganen menos de 30.000€ netos', stats: { eco: -3, est: +4, apr: +8 }, cost: 500, loyaltyImpact: { PP: +25, VOX: +30, SUMAR: -15 }, news: 'Moncloa congela la subida de cuotas a los autónomos de rentas medias.' },
      { text: 'Aplicar la tabla progresiva prevista para sostener las cuentas de la Seguridad Social', stats: { eco: +5, est: -5, apr: -14 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, PP: -40, VOX: -45 }, news: 'Subida de la cuota de autónomos para ajustar la cotización por ingresos reales.' }
    ]
  },
  {
    id: 'TENSION_EN_CEUTA_PAGO_HIPOTECAS',
    category: 'ECONOMÍA NACIONAL',
    title: 'BONIFICACIÓN DEL IRPF A RESIDENTES EN CEUTA Y MELILLA',
    desc: 'Debate en el Congreso sobre recortar el beneficio fiscal del 60% a las rentas altas en las ciudades autónomas.',
    condition: (m) => true,
    options: [
      { text: 'Mantener intacta la bonificación fiscal del 60% para fijar población', stats: { eco: -2, est: +4, apr: +4 }, cost: 150, loyaltyImpact: { PP: +25, VOX: +30, SUMAR: -15 }, news: 'Se mantiene el blindaje fiscal de Ceuta y Melilla en el impuesto de la renta.' },
      { text: 'Limitar la bonificación solo a rentas inferiores a 45.000€ anuales', stats: { eco: +3, est: -3, apr: -4 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, PP: -25, VOX: -30 }, news: 'Recorte de la deducción fiscal en las ciudades autónomas para rentas altas.' }
    ]
  },
  {
    id: 'RESTRUCTURACION_CORREOS',
    category: 'INFRAESTRUCTURAS',
    title: 'DÉFICIT HISTÓRICO DE LA EMPRESA POSTAL PÚBLICA',
    desc: 'Correos acumula 1.000 M€ de pérdidas por la caída del envío de cartas tradicionales.',
    condition: (m) => true,
    options: [
      { text: 'Inyectar un plan de rescate público convirtiendo oficinas en sucursales bancarias', stats: { eco: -5, est: +4, apr: +6 }, cost: 1000, loyaltyImpact: { SUMAR: +25, PODEMOS: +30, PP: -20, VOX: -25 }, news: 'Plan de choque para Correos ofreciendo servicios bancarios en el ámbito rural.' },
      { text: 'Reducir la plantilla mediante prejubilaciones y cerrar sucursales deficitarias', stats: { eco: +4, est: -6, apr: -10 }, cost: 0, loyaltyImpact: { PP: +20, VOX: +20, SUMAR: -35, PODEMOS: -40 }, news: 'Recortes severos en la empresa pública Correos provocando paros sindicales.' }
    ]
  },
  {
    id: 'CRISIS_EXPLOTACION_PETROLEO_CANARIAS',
    category: 'ENERGÍA & TRANSICIÓN',
    title: 'PROSPECCIONES PETROLÍFERAS EN AGUAS CERCANAS A CANARIAS',
    desc: 'Marruecos autoriza sondeos petrolíferos cerca de las costas insulares generando alarma ecológica.',
    condition: (m) => true,
    options: [
      { text: 'Presentar una queja formal en la ONU exigiéndole una delimitación de la plataforma continental', stats: { eco: 0, est: +4, apr: +6 }, cost: 0, loyaltyImpact: { CC: +30, PP: +15, SUMAR: +15 }, news: 'España eleva a la ONU la queja por los sondeos marroquíes cerca de Canarias.' },
      { text: 'Llegar a un acuerdo de exploración compartida con petroleras internacionales', stats: { eco: +6, est: -6, apr: -10 }, cost: 0, loyaltyImpact: { PP: +15, CC: -40, SUMAR: -30, PODEMOS: -35 }, news: 'Protestas insulares ante la posiblidad de un pacto de catas petrolíferas.' }
    ]
  },
  {
    id: 'REGULACION_CASINO_MADRID_BARCELONA',
    category: 'ECONOMÍA NACIONAL',
    title: 'PROYECTO DEL MACROCOMPLEJO DE OCIO Y CASINOS HARD ROCK',
    desc: 'Inversores exigen rebajar los impuestos sobre el juego del 55% al 10% para construir el complejo.',
    condition: (m) => true,
    options: [
      { text: 'Rechazar las exenciones fiscales manteniendo los tributos sobre el juego', stats: { eco: -2, est: +3, apr: +6 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, ERC: +20, PP: -25 }, news: 'Moncloa rechaza privilegios fiscales al macrocomplejo de casinos.' },
      { text: 'Conceder la rebaja de tasas a cambio de una inversión privada de 2.000 M€', stats: { eco: +7, est: -5, apr: -8 }, cost: 0, loyaltyImpact: { PP: +25, VOX: +20, SUMAR: -35, PODEMOS: -40 }, news: 'Luz verde al megaproyecto de ocio y juego tras la rebaja de impuestos.' }
    ]
  },
  {
    id: 'ESCANDALO_COMPRA_VOTOS_CORREO',
    category: 'CORRUPCIÓN Y JUSTICIA',
    title: 'RED DE COMPRA DE VOTO POR CORREO EN ELECCIONES MUNICIPALES',
    desc: 'Investigación judicial destapa el pago de dinero a personas vulnerables por papeletas en varios municipios.',
    condition: (m) => true,
    options: [
      { text: 'Exigir la entrega personal del DNI en el momento de depositar el voto en Correos', stats: { eco: 0, est: +6, apr: +8 }, cost: 0, loyaltyImpact: { PP: +20, VOX: +25, SUMAR: +15 }, news: 'Padrón reforzado: el DNI será obligatorio para depositar la papeleta por correo.' },
      { text: 'Anular las mesas electorales afectadas y convocar repetición de comicios', stats: { eco: -1, est: +2, apr: -2 }, cost: 50, loyaltyImpact: { PP: -10, VOX: -10, SUMAR: -10 }, news: 'Anulados los resultados en los municipios salpicados por el fraude electoral.' }
    ]
  },
  {
    id: 'NUEVA_PANDEMIA_ALERTA_GLOBAL',
    category: 'SANIDAD Y SOCIAL',
    title: 'ALERTA OMS POR BROTE DE VIRUS RESPIRATORIO EMERGENTE',
    desc: 'El Ministerio de Sanidad debe decidir sobre el restablecimiento del uso obligatorio de mascarillas.',
    condition: (m) => true,
    options: [
      { text: 'Imponer la mascarilla obligatoria en transporte y centros sanitarios preventivamente', stats: { eco: -2, est: +5, apr: -2 }, cost: 20, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, PP: -20, VOX: -45 }, news: 'Vuelve la mascarilla obligatoria en hospitales y transportes por prudencia.' },
      { text: 'Mantener la recomendación voluntaria sin imponer restricciones a la actividad', stats: { eco: +2, est: -4, apr: +2 }, cost: 0, loyaltyImpact: { PP: +20, VOX: +35, SUMAR: -25, PODEMOS: -30 }, news: 'Sanidad descarta la obligatoriedad de la mascarilla apostando por el autocuidado.' }
    ]
  },
  {
    id: 'REGULACION_PROSTITUCION_ABOLICION',
    category: 'SANIDAD Y SOCIAL',
    title: 'DEBATE PARLAMENTARIO SOBRE LA LEY ABOLICIONISTA DE LA PROSTITUCIÓN',
    desc: 'La norma busca sancionar al putero y a los dueños de los locales de alterne.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar la penalización estricta del cliente y el tercerismo locativo', stats: { eco: 0, est: -2, apr: +6 }, cost: 0, loyaltyImpact: { SUMAR: +25, PODEMOS: -20, PP: +15, VOX: -30 }, news: 'El Congreso aprueba perseguir penalmente a los clientes de la prostitución.' },
      { text: 'Desestimar la vía penal y crear un plan de alternativas laborales e inserción', stats: { eco: -2, est: +2, apr: +2 }, cost: 300, loyaltyImpact: { PODEMOS: +25, SUMAR: -15, PP: -15 }, news: 'Rechazada la vía penal; se priorizan los subsidios de inserción para las mujeres.' }
    ]
  },
  {
    id: 'AMPLIACION_PARQUE_DONANA_COMPRA',
    category: 'MEDIO AMBIENTE & AGUA',
    title: 'COMPRA DE FINCAS PRIVADAS PARA AMPLIAR EL PARQUE NACIONAL',
    desc: 'Ecologistas proponen adquirir 10.000 hectáreas de cultivo para restaurar el acuífero.',
    condition: (m) => true,
    options: [
      { text: 'Comprar los terrenos con Fondos Europeos ampliando la reserva protegida', stats: { eco: -3, est: +5, apr: +8 }, cost: 700, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -15, VOX: -25 }, news: 'Ampliación histórica de Doñana tras la adquisición pública de hectáreas agrícolas.' },
      { text: 'Llegar a acuerdos voluntarios de custodia del territorio sin comprar el suelo', stats: { eco: -1, est: +1, apr: -2 }, cost: 100, loyaltyImpact: { PP: +15, VOX: +15, SUMAR: -20 }, news: 'Convenios de buenas prácticas con los propietarios en la linde del parque.' }
    ]
  },
  {
    id: 'CRISIS_ABASTECIMIENTO_ACERO',
    category: 'GEOPOLÍTICA & COMERCIO',
    title: 'BLOQUEO A LA IMPORTACIÓN DE ACERO TURCO Y ROJO',
    desc: 'Medidas antidumping de la UE paralizan los fletes de tubos y vigas para el sector naval.',
    condition: (m) => true,
    options: [
      { text: 'Eximir temporalmente a los astilleros españoles para cumplir sus encargos militares', stats: { eco: +4, est: +2, apr: 0 }, cost: 0, loyaltyImpact: { PP: +15, PNV: +15, SUMAR: -10 }, news: 'Exención arancelaria al acero para no paralizar la construcción naval.' },
      { text: 'Acatar las cuotas de la UE comprando insumos a productores comunitarios', stats: { eco: -4, est: +2, apr: -2 }, cost: 0, loyaltyImpact: { PP: -10, VOX: -10, SUMAR: +10 }, news: 'Los astilleros sufren retrasos por la obligación de comprar acero en la UE.' }
    ]
  },
  {
    id: 'PROTESTAS_REPARTIDORES_DELIVERY',
    category: 'TRABAJO Y PENSIONES',
    title: 'INFLUENCIA DE LAS PLATAFORMAS EN EL CUMPLIMIENTO DE LA LEY RIDER',
    desc: 'Inspección de Trabajo multa a grandes empresas por seguir utilizando falsos autónomos.',
    condition: (m) => true,
    options: [
      { text: 'Retirar la licencia de operación en España a las plataformas reincidentes', stats: { eco: -3, est: -4, apr: +10 }, cost: 0, loyaltyImpact: { SUMAR: +35, PODEMOS: +40, PP: -30, VOX: -35 }, news: 'Ultimátum del Gobierno con cierre directo a las apps que incumplan la Ley Rider.' },
      { text: 'Sustituir la vía de cierre por multas progresivas sobre la facturación global', stats: { eco: +4, est: +2, apr: -4 }, cost: 0, loyaltyImpact: { PP: +20, VOX: +20, SUMAR: -25, PODEMOS: -30 }, news: 'Nuevas sanciones económicas a las plataformas de reparto a domicilio.' }
    ]
  },
  {
    id: 'INCENDIO_CENTRO_DE_DATOS_BANCO',
    category: 'TECNOLOGÍA Y DIGITAL',
    title: 'SINIESTRO EN EL NODO BANCARIO PRINCIPAL',
    desc: 'Un incendio en la sede central de procesamiento imposibilita los pagos con tarjeta en todo el país durante 10 horas.',
    condition: (m) => true,
    options: [
      { text: 'Obligar a las entidades a indemnizar automáticamente con 50€ a cada tarjeta afectada', stats: { eco: +1, est: +4, apr: +10 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -25, VOX: -20 }, news: 'Moncloa exige una indemnización directa a los bancos por la caída de pagos.' },
      { text: 'Dar un margen de 48 horas a los bancos para restablecer el servicio sin penalización', stats: { eco: 0, est: -4, apr: -8 }, cost: 0, loyaltyImpact: { PP: +15, VOX: +10, SUMAR: -25 }, news: 'Comprensión gubernamental tras el fallo técnico masivo en las tarjetas.' }
    ]
  },
  {
    id: 'PEAJE_CONTAMINACION_CIUDADES',
    category: 'MEDIO AMBIENTE & AGUA',
    title: 'PEAJE DE ACCESO A ZONAS DE BAJAS EMISIONES (ZBE)',
    desc: 'Grandes municipios proponen cobrar una tasa de 5€ a los coches sin etiqueta medioambiental.',
    condition: (m) => true,
    options: [
      { text: 'Autorizar por ley la tasa de ZBE destinada a financiar el transporte público', stats: { eco: +3, est: -3, apr: +4 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +30, PP: -35, VOX: -50 }, news: 'Luz verde al peaje urbano para vehículos contaminantes en áreas ZBE.' },
      { text: 'Prohibir las tasas de circulación urbana garantizando el acceso a trabajar', stats: { eco: -2, est: +3, apr: -4 }, cost: 0, loyaltyImpact: { PP: +30, VOX: +40, SUMAR: -35, PODEMOS: -40 }, news: 'Moncloa veta los peajes urbanos alegando que perjudican a las rentas bajas.' }
    ]
  },
  {
    id: 'CRISIS_CENTROS_COMERCIALES',
    category: 'ECONOMÍA NACIONAL',
    title: 'QUIEBRA Y ABANDONO DE GRANDES SUPERFICIES DE COMPRA',
    desc: 'El auge de las compras por internet vacía los grandes centros comerciales periurbanos.',
    condition: (m) => m.eco < 40,
    options: [
      { text: 'Reconvertir las fincas comerciales en viviendas públicas de protección oficial', stats: { eco: -4, est: +6, apr: +8 }, cost: 1200, loyaltyImpact: { SUMAR: +25, PODEMOS: +30, PP: -10 }, news: 'Plan para transformar centros comerciales en desuso en vivienda social.' },
      { text: 'Bonificar a las empresas que instalen hub logísticos de última milla', stats: { eco: +3, est: +1, apr: -2 }, cost: 200, loyaltyImpact: { PP: +20, PNV: +15, SUMAR: -15 }, news: 'Ayudas para convertir viejas galerías comerciales en almacenes logísticos.' }
    ]
  },
  {
    id: 'TENSION_ISLAS_CHAFARINAS',
    category: 'DEFENSA Y SEGURIDAD',
    title: 'DESPLIEGUE DE EMBARCACIONES EN PLAZAS DE SOBERANÍA',
    desc: 'Aparición de patorulleras no identificadas cerca de las Chafarinas y Alhucemas.',
    condition: (m) => true,
    options: [
      { text: 'Reforzar los destacamentos militares en los peñones e islas del norte de África', stats: { eco: -2, est: +6, apr: +6 }, cost: 120, loyaltyImpact: { VOX: +35, PP: +25, SUMAR: -25 }, news: 'Defensa incrementa el contingente en las Plazas de Soberanía.' },
      { text: 'Resolver la situación mediante contacto directo por canales de inteligencia', stats: { eco: 0, est: -2, apr: -4 }, cost: 0, loyaltyImpact: { SUMAR: +10, VOX: -30, PP: -20 }, news: 'Contactos discretos para evitar la escalada militar en los peñones.' }
    ]
  },
  {
    id: 'POLEMICA_SECTOR_VINO_EXCEDENTES',
    category: 'AGRICULTURA Y MEDIO AMBIENTE',
    title: 'EXCEDENTE DE PRODUCCIÓN Y CRISIS EN LA RIOJA Y RIBERA',
    desc: 'La caída de consumo mundial deja millones de litros de vino almacenados sin salida comercial.',
    condition: (m) => true,
    options: [
      { text: 'Financiar la destilación de crisis para alcohol industrial retirando stock', stats: { eco: -3, est: +4, apr: +4 }, cost: 400, loyaltyImpact: { PP: +20, PNV: +25, SUMAR: +10 }, news: 'Aprobados fondos para la destilación de crisis del vino almacenado.' },
      { text: 'Subvencionar el arranque definitivo de viñedos para reducir el potencial productivo', stats: { eco: -4, est: -3, apr: -6 }, cost: 500, loyaltyImpact: { PP: -20, VOX: -20, SUMAR: +10 }, news: 'Plan de arranque de viñas para equilibrar la oferta y demanda vitivinícola.' }
    ]
  },
  {
    id: 'CRISIS_SISTEMA_DENTISTA_PUBLICO',
    category: 'SANIDAD Y SOCIAL',
    title: 'INCLUSIÓN DE LA SALUD BUCODENTAL EN LA SEGURIDAD SOCIAL',
    desc: 'Exigencia parlamentaria para cubrir empastes y endodoncias gratis a menores y mayores de 65.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar la Cartera Bucodental Pública ampliando el servicio en ambulatorios', stats: { eco: -5, est: +6, apr: +12 }, cost: 1400, loyaltyImpact: { SUMAR: +35, PODEMOS: +40, PP: -15 }, news: 'La Seguridad Social cubrirá los tratamientos dentales a colectivos prioritarios.' },
      { text: 'Conceder un cheque dentista anual de 100€ para gastar en clínicas privadas', stats: { eco: -3, est: +2, apr: +2 }, cost: 600, loyaltyImpact: { PP: +20, VOX: +15, SUMAR: -25 }, news: 'Cheque dentista para la atención privada en lugar de ampliar la red pública.' }
    ]
  },
  {
    id: 'PEAJE_CARBONO_FRONTERA_UE',
    category: 'GEOPOLÍTICA & COMERCIO',
    title: 'APLICACIÓN DEL MECANISMO DE AJUSTE DE CARBONO EN FRONTERA (CBAM)',
    desc: 'La UE empieza a cobrar por las emisiones de acero y cemento importado de fuera de la Unión.',
    condition: (m) => true,
    options: [
      { text: 'Apoyar el arancel climático protegiendo a la siderurgia e industria pesada nacional', stats: { eco: +4, est: +3, apr: +4 }, cost: 0, loyaltyImpact: { PP: +20, PNV: +20, SUMAR: +15 }, news: 'España respalda el arancel climático de la UE frente a países contaminantes.' },
      { text: 'Solicitar excepciones transitorias para no encarecer la obra pública de vivienda', stats: { eco: -2, est: -2, apr: -2 }, cost: 0, loyaltyImpact: { SUMAR: -10, PP: -10 }, news: 'Moncloa pide prórrogas en el arancel para no encarecer los materiales.' }
    ]
  },
  {
    id: 'REFORMA_CODIGO_PENAL_HURTOS',
    category: 'CORRUPCIÓN Y JUSTICIA',
    title: 'REINCIDENCIA EN HURTOS EN ZONAS TURÍSTICAS Y COMERCIOS',
    desc: 'Comerciantes denuncian la impunidad de los hurtos leves de menos de 400€ por falta de penas de prisión.',
    condition: (m) => true,
    options: [
      { text: 'Endurecer el Código Penal imponiendo prisión de 6 a 18 meses a multireincidentes', stats: { eco: 0, est: +6, apr: +10 }, cost: 0, loyaltyImpact: { PP: +35, VOX: +40, SUMAR: -25, PODEMOS: -35 }, news: 'Reforma penal para castigar con prisión los hurtos leves reincidentes.' },
      { text: 'Aumentar las multas administrativas y el personal de vigilancia en juzgados', stats: { eco: -2, est: +2, apr: -2 }, cost: 150, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, PP: -20, VOX: -30 }, news: 'Refuerzo de las sanciones administrativas sin endurecer las penas de cárcel.' }
    ]
  },
  {
    id: 'FUGA_DE_OFICINAS_GIBRALTAR',
    category: 'ECONOMÍA NACIONAL',
    title: 'ATRACCIÓN DE EMPRESAS FINANCIERAS DESDE EL PEÑÓN',
    desc: 'La incertidumbre del Brexit anima a firmas de inversión a trasladar su sede social a Andalucía.',
    condition: (m) => true,
    options: [
      { text: 'Ofrecer una tarifa plana del 15% en el Impuesto de Sociedades a las empresas reubicadas', stats: { eco: +5, est: +2, apr: -4 }, cost: 0, loyaltyImpact: { PP: +25, VOX: +20, SUMAR: -30, PODEMOS: -35 }, news: 'Incentivos fiscales para atraer a las financieras asentadas en Gibraltar.' },
      { text: 'Exigir el régimen fiscal ordinario sin conceder trajes a medida', stats: { eco: -1, est: +1, apr: +4 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +25, PP: -15 }, news: 'Moncloa rechaza privilegios tributarios para las empresas procedentes del Peñón.' }
    ]
  },
  {
    id: 'CRISIS_PERSONAL_CORRECCIONAL',
    category: 'DEFENSA Y SEGURIDAD',
    title: 'AGRESIONES Y HUELGA EN LAS PRISIONES ESPAÑOLAS',
    desc: 'Funcionarios de prisiones exigen la consideración de Agentes de la Autoridad y mejoras en plantilla.',
    condition: (m) => true,
    options: [
      { text: 'Reconocer el estatus de Agentes de la Autoridad e incrementar los complementos', stats: { eco: -3, est: +6, apr: +6 }, cost: 350, loyaltyImpact: { PP: +25, VOX: +30, SUMAR: -15 }, news: 'Reconocimiento legal como Agentes de la Autoridad a los funcionarios de prisiones.' },
      { text: 'Instalar cámaras individuales de grabación obligatoria sin cambiar su estatus jurídico', stats: { eco: -1, est: -2, apr: -2 }, cost: 80, loyaltyImpact: { SUMAR: +15, PODEMOS: +15, PP: -20, VOX: -25 }, news: 'Equipamiento de videovigilancia individual en centros penitenciarios.' }
    ]
  },
  {
    id: 'DESABASTECIMIENTO_PLASTICOS_AGRICOLAS',
    category: 'AGRICULTURA Y MEDIO AMBIENTE',
    title: 'ENC ARECIMIENTO DE LAS LOMAS Y INVERNADEROS EN ALMERÍA',
    desc: 'La escasez de polímeros paraliza la reposición de plásticos en las explotaciones bajo plásticos.',
    condition: (m) => true,
    options: [
      { text: 'Subvencionar el 30% de la compra de cubiertas plásticas biodegradables', stats: { eco: -3, est: +4, apr: +4 }, cost: 350, loyaltyImpact: { PP: +20, VOX: +20, SUMAR: +15 }, news: 'Subsidios para renovar los invernaderos con plásticos sostenibles.' },
      { text: 'Aprobar la importación libre de polímeros sin aranceles de la UE', stats: { eco: +2, est: -2, apr: -2 }, cost: 0, loyaltyImpact: { VOX: +15, PP: +10, SUMAR: -15 }, news: 'Luz verde a la importación de plásticos agrícolas sin gravámenes.' }
    ]
  },
  {
    id: 'REGULACION_DOPAJEDIGITAL_VIDEOJUEGOS',
    category: 'TECNOLOGÍA Y DIGITAL',
    title: 'REGULACIÓN DE LAS CAJAS DE BOTÍN (LOOT BOXES) EN JUEGOS',
    desc: 'Consumo busca prohibir la compra aleatoria dentro de videojuegos para menores por considerarlo juego.',
    condition: (m) => true,
    options: [
      { text: 'Prohibir las cajas de botín de pago equiparándolas legalmente a las tragaperras', stats: { eco: 0, est: +3, apr: +8 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: +10 }, news: 'España se convierte en país pionero al prohibir las "loot boxes" en juegos.' },
      { text: 'Obligar a mostrar el porcentaje exacto de probabilidad de cada recompensa', stats: { eco: 0, est: -1, apr: -2 }, cost: 0, loyaltyImpact: { PP: +15, VOX: +15, SUMAR: -20 }, news: 'Las empresas de videojuegos deberán hacer pública la probabilidad de premio.' }
    ]
  },
  {
    id: 'CONFLICTO_DIPLOMATICO_MÉXICO',
    category: 'RELACIONES INTERNACIONALES',
    title: 'PAUSA EN LAS RELACIONES BILATERALES Y RECLAMACIONES HISTÓRICAS',
    desc: 'El Gobierno mexicano exige disculpas institucionales por los acontecimientos de la Conquista.',
    condition: (m) => true,
    options: [
      { text: 'Enviar una carta poniendo el foco en los lazos de fraternidad del exilio republicano', stats: { eco: 0, est: +2, apr: +2 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +25, PP: -25, VOX: -40 }, news: 'Moncloa apuesta por el diálogo cultural destacando el refugio del exilio.' },
      { text: 'Rechazar tajantemente cualquier tipo de disculpa exigiendo respeto a la historia', stats: { eco: -2, est: -3, apr: +6 }, cost: 0, loyaltyImpact: { PP: +35, VOX: +45, SUMAR: -30, PODEMOS: -35 }, news: 'España rechaza la exigencia de disculpas del Gobierno mexicano.' }
    ]
  },
  {
    id: 'CRISIS_ACREDITACIONES_PRENSA',
    category: 'CORRUPCIÓN Y JUSTICIA',
    title: 'EXPULSIÓN DE MEDIOS EXTREMOS DE LAS RUEDAS DE PRENSA DE MONCLOA',
    desc: 'Secretaría de Estado frena el acceso a pseudomedios que propagan bulos sin firma periodística.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar un Código Deontológico exigiendo firma en el FAPE para entrar en Moncloa', stats: { eco: 0, est: -4, apr: +6 }, cost: 0, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -35, VOX: -50 }, news: 'Nuevos requisitos profesionales para las ruedas de prensa del Ejecutivo.' },
      { text: 'Mantener el acceso libre a todas las entidades registradas como medios digitales', stats: { eco: 0, est: +3, apr: -6 }, cost: 0, loyaltyImpact: { PP: +25, VOX: +35, SUMAR: -30, PODEMOS: -35 }, news: 'Moncloa renuncia a restringir el paso a los medios digitales polémicos.' }
    ]
  },
  {
    id: 'AMPLIACION_SISTEMA_METRO_MADRID_BARCELONA',
    category: 'INFRAESTRUCTURAS',
    title: 'COFINANCIACIÓN ESTATAL DE LAS LÍNEAS SUBTERRÁNEAS URBANAS',
    desc: 'Las grandes capitales solicitan 1.000 M€ de los fondos europeos para llevar el metro a los suburbios.',
    condition: (m) => true,
    options: [
      { text: 'Aprobar la partida de cofinanciación para descarbonizar la movilidad metropolitana', stats: { eco: -5, est: +6, apr: +8 }, cost: 1000, loyaltyImpact: { PP: +20, ERC: +20, SUMAR: +20 }, news: 'Moncloa cofinanciará las ampliaciones del metro en Madrid y Barcelona.' },
      { text: 'Exigir que las CCAA financien las obras mediante sus propios impuestos regionales', stats: { eco: +2, est: -4, apr: -6 }, cost: 0, loyaltyImpact: { PP: -25, ERC: -25, JUNTS: -25 }, news: 'Rechazada la subvención estatal para las redes de metro metropolitano.' }
    ]
  },
  {
    id: 'CRISIS_INSTITUTOS_FP_DUAL',
    category: 'SANIDAD Y SOCIAL',
    title: 'COLAPSO EN LAS PLAZAS DE PRACTICAS DE FORMACIÓN PROFESIONAL',
    desc: 'Más de 30.000 alumnos de FP se quedan sin poder graduarse por falta de ofertas en empresas.',
    condition: (m) => true,
    options: [
      { text: 'Bonificar el 100% de la cotización de los alumnos en prácticas a las pymes', stats: { eco: -3, est: +5, apr: +8 }, cost: 450, loyaltyImpact: { PP: +20, PNV: +20, SUMAR: +15 }, news: 'El Estado asumirá las cotizaciones sociales de los estudiantes de FP.' },
      { text: 'Crear módulos de prácticas simuladas dentro de las instalaciones públicas', stats: { eco: -2, est: -2, apr: -4 }, cost: 200, loyaltyImpact: { SUMAR: -15, PODEMOS: -15 }, news: 'Prácticas internas en los centros educativos para paliar el colapso de plazas.' }
    ]
  },
  {
    id: 'TENSION_PRECIOS_FARMACIA_PESO',
    category: 'SANIDAD Y SOCIAL',
    title: 'DESABASTECIMIENTO DE MEDICAMENTOS PARA LA DIABETES USADOS PARA ADELGAZAR',
    desc: 'El uso estético de fármacos agonistas del GLP-1 deja sin suministro a los pacientes diabéticos.',
    condition: (m) => true,
    options: [
      { text: 'Restringir la receta exclusivamente a endocrinos de la red pública de salud', stats: { eco: 0, est: +4, apr: +6 }, cost: 0, loyaltyImpact: { SUMAR: +25, PODEMOS: +25, PP: -10 }, news: 'Sanidad limita el expendio de fármacos inyectables a diabéticos diagnosticados.' },
      { text: 'Permitir la importación paralela con precio libre en la red privada de farmacias', stats: { eco: +2, est: -3, apr: -6 }, cost: 0, loyaltyImpact: { PP: +15, VOX: +15, SUMAR: -25 }, news: 'Luz verde al mercado libre de inyectables para adelgazar sin subvención.' }
    ]
  },
  {
    id: 'CRISIS_DE_LA_INDUSTRIA_DEL_JABON',
    category: 'ECONOMÍA NACIONAL',
    title: 'ENC ARECIMIENTO DE LAS GRASAS Y ACEITES INDUSTRIALES',
    desc: 'La escasez de materias primas amenaza la producción de detergentes y cosmética nacional.',
    condition: (m) => m.eco < 45,
    options: [
      { text: 'Aprobar una línea de avales ICO para la compra de insumos químicos', stats: { eco: -3, est: +2, apr: +2 }, cost: 300, loyaltyImpact: { PP: +15, PNV: +15 }, news: 'Línea de créditos ICO para amortiguar el sobrecoste en la industria química.' },
      { text: 'Exigir el reciclaje obligatorio de aceites usados para uso industrial doméstico', stats: { eco: +1, est: +3, apr: +4 }, cost: 50, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, PP: -10 }, news: 'Obligatoriedad de reciclar el aceite usado de hostelería para la industria.' }
    ]
  },
  {
    id: 'TENSION_CONCESIONES_MARITIMO_TERRESTRES',
    category: 'MEDIO AMBIENTE & AGUA',
    title: 'DERRIBO DE CHIRINGUITOS Y HOTELES EN PRIMERA LÍNEA DE PLAYA',
    desc: 'La Ley de Costas exige caducar las concesiones antiguas por la subida del nivel del mar.',
    condition: (m) => true,
    options: [
      { text: 'Aplicar la Ley de Costas recuperando el dominio público y demoliendo construcciones', stats: { eco: -3, est: -3, apr: +6 }, cost: 200, loyaltyImpact: { SUMAR: +30, PODEMOS: +35, PP: -35, VOX: -45 }, news: 'Medio Ambiente inicia el derribo de construcciones en el dominio marítimo.' },
      { text: 'Conceder prórrogas extraordinarias de 30 años a los establecimientos turísticos', stats: { eco: +4, est: +3, apr: -8 }, cost: 0, loyaltyImpact: { PP: +30, VOX: +35, SUMAR: -35, PODEMOS: -40 }, news: 'Prórroga masiva a las concesiones de establecimientos en primera línea de playa.' }
    ]
  },
  {
    id: 'SABOTAJE_TORRES_ALTA_TENSION',
    category: 'ENERGÍA & TRANSICIÓN',
    title: 'DERRIBO INTENCIONADO DE TORRES ELÉCTRICAS EN ARAGÓN',
    desc: 'Grupos radicales atentan contra la línea de evacuación de un parque eólico en protesta por el impacto visual.',
    condition: (m) => true,
    options: [
      { text: 'Endurecer las penas por sabotaje a redes críticas elevándolo al Código Penal', stats: { eco: 0, est: +5, apr: +4 }, cost: 0, loyaltyImpact: { PP: +25, VOX: +30, SUMAR: -20, PODEMOS: -25 }, news: 'El Ejecutivo equipara el sabotaje a redes eléctricas con delitos de terrorismo.' },
      { text: 'Crear mesas de negociación territoriales para pausar los proyectos en disputa', stats: { eco: -2, est: -3, apr: +2 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, PP: -25, VOX: -30 }, news: 'Mesa de diálogo con las plataformas vecinales contrarias a las macroLíneas.' }
    ]
  },
  {
    id: 'REGULACION_IA_EN_LA_JUSTICIA',
    category: 'TECNOLOGÍA Y DIGITAL',
    title: 'USO DE ALGORITMOS PARA REDACTAR SENTENCIAS EN JUZGADOS',
    desc: 'Planta judicial propone usar modelos de lenguaje para agilizar la resolución de multas y pleitos sencillos.',
    condition: (m) => true,
    options: [
      { text: 'Prohibir el dictamen algorítmico reservando la resolución exclusivamente a jueces', stats: { eco: 0, est: +3, apr: +6 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +25, PP: +15 }, news: 'Justicia prohíbe el uso de inteligencia artificial en la redacción de sentencias.' },
      { text: 'Permitir el borrador automático de resoluciones bajo firma y revisión del magistrado', stats: { eco: +3, est: -2, apr: -4 }, cost: 100, loyaltyImpact: { PP: +15, PNV: +15, SUMAR: -15 }, news: 'Luz verde a la Inteligencia Artificial de apoyo para desatascar los juzgados.' }
    ]
  }
    ];
    // ==========================================
    // BANCO DE TITULARES DE CAMPAÑA ELECTORAL (10 PREGUNTAS)
    // ==========================================
    const CAMPAIGN_HEADLINES = [
      {
        id: 1,
        newspaper: 'EL PAÍS',
        headline: 'DEBATE CRUCIAL EN TVE: EL CANDIDATO RESPONDE SOBRE EL MODELO ECONÓMICO Y FISCAL',
        desc: 'El primer gran debate televisado centra su atención en los impuestos y las prestaciones públicas. ¿Qué mensaje trasladas a los electores?',
        options: [
          { text: 'Prometer una bajada masiva de impuestos e incentivos a empresas', score: +15, textResult: 'Captas el voto conservador y liberal preocupado por la carga fiscal.' },
          { text: 'Garantizar el blindaje de las pensiones y el gasto social público', score: +15, textResult: 'Movilizas al electorado de izquierdas y al colectivo de pensionistas.' },
          { text: 'Proponer equilibrio presupuestario y rigor en las cuentas del Estado', score: +10, textResult: 'Atraes al electorado moderado y de centro.' }
        ]
      },
      {
        id: 2,
        newspaper: 'EL MUNDO',
        headline: 'FILTRACIÓN DE AUDIOS DE CAMPAÑA SACUDE LA RECTA FINAL DE LOS COMICIOS',
        desc: 'Un medio digital filtra conversaciones privadas sobre posibles pactos de gobierno secretos tras las elecciones.',
        options: [
          { text: 'Desmentir rotundamente los audios y denunciar una campaña de guerra sucia', score: +5, textResult: 'Contienes el daño mediático entre tus filas.' },
          { text: 'Admitir conversaciones informales justificando el diálogo entre partidos', score: -5, textResult: 'La oposición aprovecha para acusarte de falta de transparencia.' },
          { text: 'Atacar a la oposición recordando sus propios escándalos del pasado', score: +10, textResult: 'Polarizas la campaña reforzando a tus votantes más fieles.' }
        ]
      },
      {
        id: 3,
        newspaper: 'ABC',
        headline: 'LA POLÍTICA TERRITORIAL Y LOS PACTOS REGIONALES CENTRAN EL MITIN CENTRAL',
        desc: 'Sectores conservadores exigen garantías contra las cesiones a partidos independentistas o regionalistas.',
        options: [
          { text: 'Garantizar la unidad de España y rechazar cualquier pacto soberanista', score: +15, textResult: 'Frenas la fuga de votos hacia la derecha nacionalista.' },
          { text: 'Defender la España plural y la pluralidad lingüística y autonómica', score: +10, textResult: 'Refuerzas tus apoyos en Cataluña, País Vasco y Galicia.' },
          { text: 'Evitar el tema y centrar el mitin exclusivamente en propuestas de empleo', score: 0, textResult: 'Pansas de largo sin arriesgar, pero la prensa critica la ambigüedad.' }
        ]
      },
      {
        id: 4,
        newspaper: 'LA VANGUARDIA',
        headline: 'EL FINANCIAMIENTO AUTONÓMICO Y LA VIVIENDA TENSAN EL DEBATE CATALÁN',
        desc: 'Las grandes ciudades reclaman soluciones inmediatas al precio del alquiler y la saturación de servicios.',
        options: [
          { text: 'Prometer regulación estricta del alquiler e inversión masiva en vivienda', score: +10, textResult: 'Logras una gran acogida en núcleos urbanos y jóvenes.' },
          { text: 'Proponer deducciones fiscales para propietarios y liberalización de suelo', score: +10, textResult: 'Ganas apoyos en el sector inmobiliario y clases medias urbanas.' }
        ]
      },
      {
        id: 5,
        newspaper: 'EL CONFIDENCIAL',
        headline: 'ENCUESTAS PREELECTORALES MUESTRAN UN EMPATE TÉCNICO EN EL HEMICICLO',
        desc: 'Los últimos sondeos sitúan la gobernabilidad en un puñado de escaños en provincias medianas. ¿Dónde concentras la caravana electoral?',
        options: [
          { text: 'Centrar los esfuerzos en las provincias de la España Vaciada', score: +15, textResult: 'Optimizar la ley D\'Hondt en circunscripciones pequeñas.' },
          { text: 'Realizar grandes actos multitudinarios en Madrid, Barcelona y Valencia', score: +10, textResult: 'Aumentas la visibilidad mediática nacional en prime time.' }
        ]
      },
      {
        id: 6,
        newspaper: 'elDiario.es',
        headline: 'COLECTIVOS SOCIALES Y SINDICATOS EXIGEN COMPROMISOS FIRMES EN SANIDAD',
        desc: 'Manifestaciones en vísperas electorales piden blindar la sanidad pública y reducir listas de espera.',
        options: [
          { text: 'Prometer un plan de choque inmediato financiado con deuda o impuestos', score: +12, textResult: 'Entusiasmas a las bases progresistas.' },
          { text: 'Defender la colaboración público-privada para agilizar el sistema', score: +8, textResult: 'Respaldo del sector sanitario privado y patronales.' }
        ]
      },
      {
        id: 7,
        newspaper: 'OKDIARIO',
        headline: 'CONTROVERSIA POR LAS ALIANZAS POSTELECTORALES: ¿CON QUIÉN GOBERNARÁS?',
        desc: 'Los periodistas presionan al candidato para que aclare sus líneas rojas de cara a la investidura.',
        options: [
          { text: 'Anunciar la intención de gobernar en solitario sin bloques cerrados', score: +5, textResult: 'Mensaje institucional que atrae al votante indeciso.' },
          { text: 'Reconocer abiertamente que pactarás con tus socios naturales de bloque', score: +10, textResult: 'Transmites certidumbre y fidelizas el voto utilitario.' }
        ]
      },
      {
        id: 8,
        newspaper: 'LA RAZÓN',
        headline: 'EL VOTO INDECISO DE CENTRO SE PERFILA COMO LA CLAVE DE LAS URNAS',
        desc: 'Un 20% de los electores admite que decidirá su papeleta en las últimas 48 horas.',
        options: [
          { text: 'Lanzar un discurso moderado enfocado en la estabilidad institucional', score: +15, textResult: 'Atraes al votante centrista y moderado.' },
          { text: 'Hacer una llamada al voto masivo frente a la amenaza de la oposición', score: +10, textResult: 'Movilizas el voto del miedo en tu espacio político.' }
        ]
      },
      {
        id: 9,
        newspaper: 'EXPANSIÓN',
        headline: 'LA PATRONAL Y LOS MERCADOS ALERTAN SOBRE LA INCERTIDUMBRE POLÍTICA',
        desc: 'Foros empresariales piden certezas económicas y seguridad jurídica para no frenar inversiones.',
        options: [
          { text: 'Garantizar seguridad jurídica, contención del déficit y competitividad', score: +12, textResult: 'Tranquilizas a los mercados financieros y a los inversores.' },
          { text: 'Reivindicar la redistribución de la riqueza por encima de los mercados', score: +8, textResult: 'Reafirmas tu perfil ideológico combativo.' }
        ]
      },
      {
        id: 10,
        newspaper: 'RTVE',
        headline: 'EL MINUTO DE ORO: ÚLTIMA APELACIÓN AL VOTO EN EL CIERRE DE CAMPAÑA',
        desc: 'Última intervención ante las cámaras antes de que arranque la jornada de reflexión.',
        options: [
          { text: 'Pedir una mayoría amplia para garantizar un gobierno fuerte y estable', score: +15, textResult: 'Cierras la campaña proyectando liderazgo de Estado.' },
          { text: 'Apelar a la ilusión y al cambio de época que necesita el país', score: +15, textResult: 'Emocionas a tus simpatizantes en el último aliento.' }
        ]
      },
  {
    id: 11,
    newspaper: 'EL PAÍS',
    headline: 'PROUESTA DE JORNADA LABORAL DE 37,5 HORAS DIVIDE A LA PATRONAL Y SINDICATOS',
    desc: 'Los sindicatos presionan para que la reducción de la jornada por ley sea un compromiso irrenunciable en la próxima legislatura.',
    options: [
      { text: 'Prometer la implantación por ley sin reducción salarial en el primer año', score: +15, textResult: 'Entusiasmas a las clases trabajadoras y sindicatos.' },
      { text: 'Dejar la reducción en manos de la negociación colectiva por sectores', score: +8, textResult: 'Tranquilizas a las pymes y al sector empresarial.' },
      { text: 'Rechazar la medida por considerar que restará competitividad a la economía', score: -5, textResult: 'Te posicionas del lado patronal, pero pierdes voto obrero.' }
    ]
  },
  {
    id: 12,
    newspaper: 'EL MUNDO',
    headline: 'EL TOP EN LOS ALQUILERES CENTRA EL DEBATE EN LOS NÚCLEOS URBANOS',
    desc: 'Plataformas de afectados por la vivienda organizan escaches en actos de campaña exigiendo el control de precios.',
    options: [
      { text: 'Prometer la intervención directa del mercado y topes obligatorios al alquiler', score: +12, textResult: 'Movilizas al electorado joven e inquilinos en grandes ciudades.' },
      { text: 'Proponer incentivos fiscales a propietarios para que bajen los precios voluntariamente', score: +10, textResult: 'Captas el voto conservador y propietarios de clase media.' },
      { text: 'Promover la construcción masiva de Vivienda de Protección Oficial (VPO)', score: +10, textResult: 'Propuesta pragmática bien valorada por los moderados.' }
    ]
  },
  {
    id: 13,
    newspaper: 'ABC',
    headline: 'DEBATE SOBRE LA FINANCIACIÓN SINGULAR Y EL CUPO AUTONÓMICO',
    desc: 'Los partidos regionalistas e independentistas exigen la cesión del 100% de los impuestos recaudados en sus territorios.',
    options: [
      { text: 'Rechazar cualquier modelo singular y defender un reparto multilateral equitativo', score: +15, textResult: 'Refuerzas tu apoyo en la mayoría de comunidades autónomas.' },
      { text: 'Aceptar negociaciones bilaterales con regiones con estatuto especial', score: +5, textResult: 'Consigues guiños de socios territoriales pero sufres desgaste nacional.' }
    ]
  },
  {
    id: 14,
    newspaper: 'LA VANGUARDIA',
    headline: 'EL TRASPASO COMPLETO DE LA RED DE TRENES DE CERCANÍAS A EXAMEN',
    desc: 'Los constantes retrasos e incidencias en los trenes de la periferia se convierten en arma arrojadiza de la campaña.',
    options: [
      { text: 'Prometer la transferencia total de la infraestructura y presupuestos a las CCAA', score: +12, textResult: 'Aumentas la popularidad en Cataluña, Valencia y País Vasco.' },
      { text: 'Defender la gestión centralizada del Estado con un plan masivo de inversión', score: +10, textResult: 'Proyectas imagen de Estado fuerte e infraestructuras coordinadas.' }
    ]
  },
  {
    id: 15,
    newspaper: 'EXPANSIÓN',
    headline: 'LA DEFLACTACIÓN DEL IRPF FRENTE A LA INFLACIÓN ENTRA EN LA LIZA ELECTORAL',
    desc: 'Economistas sugieren ajustar los tramos del IRPF al coste de vida para evitar que los ciudadanos pierdan poder adquisitivo.',
    options: [
      { text: 'Comprometer la deflactación inmediata de la tarifa del IRPF para todos los tramos', score: +15, textResult: 'Gran acogida entre las rentas medias y trabajadores asalariados.' },
      { text: 'Aumentar el gasto social en lugar de bajar impuestos para corregir desigualdades', score: +10, textResult: 'Reafirmas tu perfil progresista frente al modelo liberal.' }
    ]
  },
  {
    id: 16,
    newspaper: 'CADENA SER',
    headline: 'LA ATENCIÓN PRIMARIA Y LAS LISTAS DE ESPERA MARCAN LA PANTALLA SOCIAL',
    desc: 'Marea Blanca convoca manifestaciones masivas en pleno ecuador de la campaña electoral.',
    options: [
      { text: 'Inyectar un fondo extraordinario para la contratación de 15.000 médicos de familia', score: +15, textResult: 'Gran impacto positivo entre usuarios de la sanidad pública.' },
      { text: 'Proponer la derivación a la sanidad concertada para amortiguar las esperas', score: 0, textResult: 'Genera controversia entre partidarios y detractores del modelo mixto.' }
    ]
  },
  {
    id: 17,
    newspaper: 'EL CONFIDENCIAL',
    headline: 'LA SUBIDA DE LAS CUOTAS DE AUTÓNOMOS GENERA MAREJADA EN EL SECTOR',
    desc: 'Asociaciones de trabajadores por cuenta propia reclaman la congelación de las tablas de cotización.',
    options: [
      { text: 'Aprobar tarifa plana ampliada y cuota cero el primer año para nuevos emprendedores', score: +15, textResult: 'Respaldo masivo del sector de pequeños negocios y autónomos.' },
      { text: 'Mantener la cotización por ingresos reales para sostener las pensiones', score: +5, textResult: 'Discurso de responsabilidad fiscal que agrada a tu ala económica.' }
    ]
  },
  {
    id: 18,
    newspaper: 'LA RAZÓN',
    headline: 'CUESTIONAN EL CUMPLIMIENTO DEL COMPROMISO DEL 2% DEL PIB EN DEFENSA',
    desc: 'Sectores diplomáticos y la OTAN presionan para que el próximo Gobierno detalle sus partidas militares.',
    options: [
      { text: 'Garantizar el 2% en Defensa mediante la compra de armamento y fragatas', score: +12, textResult: 'Mejoras la imagen internacional y el perfil de estadista.' },
      { text: 'Priorizar la inversión social reconduciendo el gasto militar hacia ciberseguridad', score: +10, textResult: 'Mantienes intacto el apoyo de las fuerzas pacifistas y de izquierda.' }
    ]
  },
  {
    id: 19,
    newspaper: 'elDiario.es',
    headline: 'PRESIONES PARA PERMANECER O DEROGAR EL IMPUESTO A LAS GRANDES FORTUNAS',
    desc: 'El gravamen sobre los patrimonios de más de 3 millones de euros vence al término del mandato.',
    options: [
      { text: 'Convertir el impuesto a las grandes fortunas en una tasa permanente', score: +12, textResult: 'Consolidas el voto de la izquierda redistributiva.' },
      { text: 'Suprimir el tributo para evitar la fuga de capitales hacia otros países', score: +10, textResult: 'Atraes a inversores y al electorado de perfil conservador.' }
    ]
  },
  {
    id: 20,
    newspaper: 'OKDIARIO',
    headline: 'POLÉMICA EN REDES SOCIALES POR EL COMPORTAMIENTO DE UN CANDIDATO',
    desc: 'Un vídeo antiguo del candidato en un entorno festivo se vuelve viral a 48 horas de votar.',
    options: [
      { text: 'Pedir disculpas con naturalidad restando trascendencia al asunto', score: +5, textResult: 'Frenas el impacto de la polémica proyectando humildad.' },
      { text: 'Atacar a la prensa denunciando una conspiración de manipulación digital', score: +8, textResult: 'Fidelizas al votante acérrimo pero pierdes entre los indecisos.' }
    ]
  },
  {
    id: 21,
    newspaper: 'EL ECONOMISTA',
    headline: 'LA EDAD DE JUBILACIÓN Y EL SOSTENIMIENTO DE LAS PENSIONES A DEBATE',
    desc: 'El envejecimiento poblacional fuerza al candidato a posicionarse sobre la edad de retiro.',
    options: [
      { text: 'Rechazar tajantemente retrasar la jubilación e incrementar ingresos por cuotas', score: +15, textResult: 'Aseguras el apoyo en el gran granero de votos de los pensionistas.' },
      { text: 'Ofrecer incentivos a la jubilación demorada de forma voluntaria', score: +10, textResult: 'Propuesta equilibrada aplaudida por los organismos financieros.' }
    ]
  },
  {
    id: 22,
    newspaper: 'RTVE',
    headline: 'ENTREVISTA EN PRIME TIME: EL CANDIDATO SE ENFRENTA A LAS PREGUNTAS CIUDADANAS',
    desc: 'Un formato con votantes indecisos pone a prueba la soltura y propuestas del aspirante.',
    options: [
      { text: 'Mostrar cercanía con respuestas empáticas centradas en el día a día', score: +15, textResult: 'Gran victoria mediática que convence a la audiencia indecisa.' },
      { text: 'Abusar de cifras y datos técnicos para transmitir rigor y solvencia', score: +5, textResult: 'Demuestras preparación, pero resulta un discurso frío para el espectador.' }
    ]
  },
  {
    id: 23,
    newspaper: 'EL PAÍS',
    headline: 'LA REGULACIÓN DE LOS PISOS TURÍSTICOS DIVIDE A LAS COMUNIDADES AUNÓNOMAS',
    desc: 'Las plataformas de alquiler vacacional se cuelan en la agenda política de las comarcas turísticas.',
    options: [
      { text: 'Prohibir la conversión de pisos residenciales en alojamientos turísticos', score: +12, textResult: 'Satisface a los vecinos de centros históricos colapsados.' },
      { text: 'Dejar la regulación en manos de la libre oferta y demanda de los propietarios', score: +8, textResult: 'Apoyo del sector turístico y propietarios de apartamentos.' }
    ]
  },
  {
    id: 24,
    newspaper: 'EL MUNDO',
    headline: 'TENSIONES EN EL MITIN SOBRE LA POLÍTICA DE SEGURIDAD CIUDADANA',
    desc: 'Sindicatos policiales exigen el endurecimiento de penas para los delitos de multirreincidencia.',
    options: [
      { text: 'Prometer la reforma penal para castigar con cárcel la reincidencia en hurtos', score: +15, textResult: 'Captas el voto preocupado por la seguridad e incivismo.' },
      { text: 'Aumentar la inversión en servicios sociales y mediación comunitaria', score: +8, textResult: 'Coherencia con las posiciones progresistas en materia social.' }
    ]
  },
  {
    id: 25,
    newspaper: 'ABC',
    headline: 'EL FUTURO DE LA ENERGÍA NUCLEAR ANTE EL CALENDARIO DE CIERRE PROGRAMADO',
    desc: 'El debate energético sitúa a España entre la prórroga de los reactores o la apuesta 100% renovable.',
    options: [
      { text: 'Prorrogar la vida útil de las centrales nucleares para abaratar la electricidad', score: +12, textResult: 'Respaldo del sector industrial y votantes conservadores.' },
      { text: 'Mantener el apagón nuclear acelerando la implantación de eólica y solar', score: +12, textResult: 'Apoyo firme del movimiento ecologista y la izquierda.' }
    ]
  },
  {
    id: 26,
    newspaper: 'LA VANGUARDIA',
    headline: 'EXIGENCIA DE UNA LEY DE GRATUIDAD EN LA ETAPA EDUCATIVA DE 0 A 3 AÑOS',
    desc: 'Las familias reclaman la universalización de las guarderías públicas para favorecer la conciliación.',
    options: [
      { text: 'Garantizar plazas gratuitas de guardería pública en todo el territorio estatal', score: +15, textResult: 'Propuesta estrella muy aclamada por las familias jóvenes.' },
      { text: 'Dar un cheque de deducción fiscal para que las familias elijan centro privado', score: +8, textResult: 'Satisface al sector de la educación concertada y privada.' }
    ]
  },
  {
    id: 27,
    newspaper: 'CADENA SER',
    headline: 'INICIATIVA PARLAMENTARIA PARA REDUCIR LAS PERMUTAS Y PEAJES EN AUTOVÍAS',
    desc: 'Bruselas exige mecanismos de pago por uso en las autovías mientras los conductores se oponen.',
    options: [
      { text: 'Rechazar frontalmente los peajes en la red de autovías del Estado', score: +15, textResult: 'Evitas una medida tremendamente impopular en la recta final.' },
      { text: 'Poner una tasa reducida a vehículos pesados para el mantenimiento de la red', score: +5, textResult: 'Posición de compromiso que cumple a medias con la UE.' }
    ]
  },
  {
    id: 28,
    newspaper: 'elDiario.es',
    headline: 'REFORMAS PENDIENTES EN LA LEY ELECTORAL Y LA LEY D’HONDT',
    desc: 'Partidos minoritarios piden corregir la sobrerrepresentación de las circunscripciones pequeñas.',
    options: [
      { text: 'Aprobar la circunscripción única o proporcionalidad pura en el Congreso', score: +10, textResult: 'Atraes a los votantes de fuerzas emergentes y minoritarias.' },
      { text: 'Defender el sistema provincial actual que garantiza la estabilidad de gobierno', score: +10, textResult: 'Consolidas el apoyo en las provincias de menor población.' }
    ]
  },
  {
    id: 29,
    newspaper: 'THE OBJECTIVE',
    headline: 'SOSPECHAS DE DESVÍO EN LA GESTIÓN DE LOS FONDOS EUROPEOS NEXT GEN',
    desc: 'Un informe europeo critica el ritmo de ejecución de las partidas de recuperación económica.',
    options: [
      { text: 'Crear una Agencia Estatal de Auditoría Independiente para el reparto', score: +12, textResult: 'Transmitirías transparencia y regeneración democrática.' },
      { text: 'Desmentir los retrasos mostrando el aumento en las licitaciones públicas', score: +5, textResult: 'Defiendes la gestión institucional sin grandes cambios.' }
    ]
  },
  {
    id: 30,
    newspaper: 'EL CONFIDENCIAL',
    headline: 'EL BONO CULTURAL JOVEN A EXAMEN POR SUS RESULTADOS',
    desc: 'Sectores críticos cuestionan si las ayudas directas a jóvenes influyen verdaderamente en el voto.',
    options: [
      { text: 'Mantener y ampliar la cuantía del bono cultural para jóvenes de 18 años', score: +12, textResult: 'Fidelizas a los nuevos votantes que se estrenan en las urnas.' },
      { text: 'Reorientar las ayudas a becas de estudio y vivienda para jóvenes', score: +10, textResult: 'Propuesta vista como más pragmática por la opinión pública.' }
    ]
  },
  {
    id: 31,
    newspaper: 'LA RAZÓN',
    headline: 'CRECIENTE PREOCUPACIÓN POR EL AUMENTO DE LA DEUDA PÚBLICA NACIONAL',
    desc: 'Organismos de control advierten que la deuda roza cotas históricas tras los planes de ayuda.',
    options: [
      { text: 'Comprometer un plan de consolidación fiscal con recortes de gasto superfluo', score: +15, textResult: 'Calmas los recelos de los mercados y votantes de centro-derecha.' },
      { text: 'Sostener la inversión para no frenar el crecimiento económico del PIB', score: +8, textResult: 'Perfil keynesiano apoyado por colectivos sociales.' }
    ]
  },
  {
    id: 32,
    newspaper: 'OKDIARIO',
    headline: 'CRÍTICAS POR LA UTILIZACIÓN DE MEDIOS PÚBLICOS EN ACTOS DE CAMPAÑA',
    desc: 'La oposición denuncia la agenda institucional por coincidir sospechosamente con mítines.',
    options: [
      { text: 'Publicar de forma transparente todos los gastos de la caravana de campaña', score: +8, textResult: 'Desarmas la acusación mostrando apertura informativa.' },
      { text: 'Restar importancia a la denuncia acusando a la oposición de sobreactuar', score: -2, textResult: 'Un conato de fricción que no llega a mayores.' }
    ]
  },
  {
    id: 33,
    newspaper: 'VOZPÓPULI',
    headline: 'EL INCENTIVO A LA NATALIDAD Y EL APOYO A LAS FAMILIAS EN EL FOCO',
    desc: 'Propuestas de deducciones por hijo se abren paso frente al declive demográfico nacional.',
    options: [
      { text: 'Prometer una ayuda mensual de 200€ por hijo a cargo hasta los 18 años', score: +15, textResult: 'Anuncio estrella con gran acogida en las familias.' },
      { text: 'Fomentar la equiparación completa de permisos de maternidad y paternidad', score: +10, textResult: 'Ganas apoyo en el electorado progresista e igualitario.' }
    ]
  },
  {
    id: 34,
    newspaper: 'PÚBLICO',
    headline: 'EXIGENCIA DE UNA LEY DE EUTANASIA Y DERECHOS AL FINAL DE LA VIDA',
    desc: 'Colectivos sociales exigen que el acceso a la prestación de ayuda a morir no tenga trabas autonómicas.',
    options: [
      { text: 'Garantizar la aplicación uniforme de la eutanasia en todas las redes públicas', score: +12, textResult: 'Movilizas al votante progresista y progresivo.' },
      { text: 'Priorizar una Ley de Cuidados Paliativos frente a la eutanasia', score: +10, textResult: 'Captas al electorado de convicciones éticas tradicionales.' }
    ]
  },
  {
    id: 35,
    newspaper: 'EL ECONOMISTA',
    headline: 'LA REGULACIÓN DEL SECTOR DEL AUTOMÓVIL Y EL COCHE ELÉCTRICO',
    desc: 'FÁBRICAS de coches piden mantener la venta de vehículos de combustión e híbridos hasta 2040.',
    options: [
      { text: 'Aprobar moratorias para los motores de combustión para proteger el empleo industrial', score: +12, textResult: 'Gran acogida entre los obreros de las plantas automovilísticas.' },
      { text: 'Acelerar la prohibición de coches contaminantes mediante subsidios al eléctrico', score: +10, textResult: 'Liderazgo en la agenda verde e impulso a las renovables.' }
    ]
  },
  {
    id: 36,
    newspaper: 'RTVE',
    headline: 'EL ROL DE ESPAÑA EN LAS RELACIONES EXTERIORES Y AMÉRICA LATINA',
    desc: 'Foros diplomáticos cuestionan el papel de liderazgo de España en la comunidad hispanoamericana.',
    options: [
      { text: 'Impulsar una cumbre iberoamericana de inversión y libre comercio', score: +10, textResult: 'Proyección institucional sólida y moderada.' },
      { text: 'Liderar la posición en la UE exigiendo clausulas medioambientales a Mercosur', score: +8, textResult: 'Respaldo del sector primario y agrícola local.' }
    ]
  },
  {
    id: 37,
    newspaper: 'EL PAÍS',
    headline: 'MEDIDAS CONTRA LA SEQUÍA Y EL REPARTO DEL AGUA EN EL SUR',
    desc: 'Los regantes andaluces y levantinos se movilizan exigiendo trasvases de cuenca e infraestructuras.',
    options: [
      { text: 'Garantizar el mantenimiento de los trasvases y construir desalinizadoras', score: +15, textResult: 'Imprescindible para rascar escaños en Andalucía y Levante.' },
      { text: 'Apoyar la transición hacia cultivos de secano restringiendo el regadío', score: +5, textResult: 'Posición ecologista que penaliza en zonas agrarias.' }
    ]
  },
  {
    id: 38,
    newspaper: 'EL MUNDO',
    headline: 'POLEMICA SOBRE EL MODELO DE EXÁMENES Y LA EBAU ÚNICA NACIONAL',
    desc: 'Familias y estudiantes piden la igualación de contenidos y dificultad en la Selectividad.',
    options: [
      { text: 'Prometer una prueba de EBAU común y centralizada para todas las CCAA', score: +15, textResult: 'Amplio apoyo entre clases medias urbanas y estudiantes.' },
      { text: 'Respetar las competencias educativas autonómicas adaptadas a cada territorio', score: +8, textResult: 'Proteges el modelo descentralizado respaldado por nacionalistas.' }
    ]
  },
  {
    id: 39,
    newspaper: 'ABC',
    headline: 'LA PROTECCIÓN DEL PATRIMONIO HISTÓRICO Y LA TAUROMAQUIA',
    desc: 'Sectores taurinos piden el blindaje de la fiesta nacional como Bien de Interés Cultural.',
    options: [
      { text: 'Prometer ayudas a la cría del toro de lidia y fomento de los festejos taurinos', score: +12, textResult: 'Fidelizas el voto rural tradicional.' },
      { text: 'Eliminar las subvenciones públicas a la tauromaquia orientándolas a la fauna silvestre', score: +12, textResult: 'Fuerte movilización del voto joven y animalista.' }
    ]
  },
  {
    id: 40,
    newspaper: 'LA VANGUARDIA',
    headline: 'LA DIGITALIZACIÓN RURAL Y EL TRABAJO EN LA ESPAÑA DESPOBLADA',
    desc: 'Alcaldes de pequeñas comarcas piden incentivos para fijar población en los municipios rurales.',
    options: [
      { text: 'Ofrecer una cuota fiscal reducida al 10% a quienes teletrabajen desde municipios rurales', score: +15, textResult: 'Medida muy elogiada para frenar el despoblamiento.' },
      { text: 'Mejorar la red de carreteras secundarias e infraestructuras comarcales', score: +10, textResult: 'Respuesta clásica de inversión en obra pública.' }
    ]
  },
  {
    id: 41,
    newspaper: 'INFOLIBRE',
    headline: 'LA TRANSPARENCIA Y EL AFORAMIENTO DE LOS POLÍTICOS A DEBATE',
    desc: 'Plataformas ciudadanas exigen la supresión total del aforamiento para los representantes públicos.',
    options: [
      { text: 'Prometer la reforma constitucional para eliminar los aforamientos políticos', score: +15, textResult: 'Proyectas regeneración e igualdad ante la ley.' },
      { text: 'Mantener la protección jurídica solo para las intervenciones parlamentarias', score: +5, textResult: 'Posición de cautela institucional.' }
    ]
  },
  {
    id: 42,
    newspaper: 'EXPANSIÓN',
    headline: 'LA FISCALIDAD SOBRE LAS PYMES EN EL FOCO DE LAS PROPUESTAS',
    desc: 'La pequeña empresa reclama la bajada del Impuesto sobre Sociedades para reinversiones.',
    options: [
      { text: 'Rebajar el tipo del Impuesto de Sociedades al 15% para las pymes que creen empleo', score: +15, textResult: 'Incentivo que entusiasma al tejido empresarial pequeño.' },
      { text: 'Condicionar cualquier rebaja fiscal a la subida de los salarios más bajos', score: +8, textResult: 'Equilibrio entre competitividad y demanda salarial.' }
    ]
  },
  {
    id: 43,
    newspaper: 'CADENA SER',
    headline: 'LA INCLUSIÓN DE LA SALUD MENTAL EN LA COBERTURA SANITARIA PÚBLICA',
    desc: 'El aumento de trastornos en jóvenes convierte la salud mental en prioridad electoral.',
    options: [
      { text: 'Aprobar la contratación masiva de psicólogos en los centros de salud públicos', score: +15, textResult: 'Puntos extra por dar respuesta a una demanda social clave.' },
      { text: 'Conceder cheques de ayuda psicológica para la consulta privada', score: +5, textResult: 'Solución rápida que despierta recelos sobre la privatización.' }
    ]
  },
  {
    id: 44,
    newspaper: 'EL CONFIDENCIAL',
    headline: 'LA REFORMA DEL SISTEMA PENITENCIARIO Y EL RECONOCIMIENTO DE SUS TRABAJADORES',
    desc: 'Funcionarios de prisiones se concentran ante el Ministerio reclamando el estatus de agentes de autoridad.',
    options: [
      { text: 'Conceder la condición de agentes de la autoridad e incrementar las plantillas', score: +10, textResult: 'Respaldo del colectivo de seguridad y funcionarios.' },
      { text: 'Digitalizar los controles de seguridad en prisiones sin aumentos salariales', score: 0, textResult: 'Medida técnica que no aplaca las reivindicaciones laboral.' }
    ]
  },
  {
    id: 45,
    newspaper: 'elDiario.es',
    headline: 'LA PROTECCIÓN DE LAS MACROGRANJAS O LA APUESTA POR LA GANADERÍA TRADICIONAL',
    desc: 'El modelo intensivo de ganadería enfrenta a colectivos ecologistas y exportadores industriales.',
    options: [
      { text: 'Fijar una moratoria nacional a la apertura de nuevas macrogranjas', score: +12, textResult: 'Conquistas el voto ecologista y rural de pequeñas granjas.' },
      { text: 'Defender la ganadería intensiva como motor de empleo y exportaciones', score: +8, textResult: 'Respaldo del sector agroindustrial exportador.' }
    ]
  },
  {
    id: 46,
    newspaper: 'LA RAZÓN',
    headline: 'EL DIÁLOGO SOCIAL CON LA IGLESIA SOBRE LA ASIGNATURA DE RELIGIÓN',
    desc: 'El peso académico de la materia confesional vuelve a colarse en los programas políticos.',
    options: [
      { text: 'Mantener la asignatura de religión como optativa evaluable en el expediente', score: +10, textResult: 'Fidelizas al electorado católico conservador.' },
      { text: 'Sustituir la religión por una materia obligatoria de Valores Éticos y Civiles', score: +12, textResult: 'Respaldado por los defensores de la escuela laica.' }
    ]
  },
  {
    id: 47,
    newspaper: 'OKDIARIO',
    headline: 'LA PRESIÓN MIGRATORIA EN LAS FRONTERAS DE CEUTA Y MELILLA',
    desc: 'Episodios de presión en los vallados fronterizos tensan las propuestas sobre inmigración.',
    options: [
      { text: 'Desplegar a las Fuerzas Armadas en las fronteras y endurecer las devoluciones', score: +15, textResult: 'Movilizas al votante de mano dura en fronteras.' },
      { text: 'Aumentar las vías de migración legal mediante contratación en origen', score: +8, textResult: 'Defiendes un enfoque ordenado y respetuoso de los DDHH.' }
    ]
  },
  {
    id: 48,
    newspaper: 'EL ECONOMISTA',
    headline: 'EL SECTOR DE LAS ENERGÍAS RENOVABLES ALERTA SOBRE LA SEGURIDAD JURÍDICA',
    desc: 'Empresas fotovoltaicas piden no modificar las primas ni los impuestos especiales al sector.',
    options: [
      { text: 'Garantizar un marco regulatorio estable durante 20 años a las renovables', score: +15, textResult: 'Aumentas la confianza de los fondos de inversión internacionales.' },
      { text: 'Aplicar un gravamen especial a los beneficios caídos del cielo de las eléctricas', score: +10, textResult: 'Respaldo entre quienes piden controlar las tarifas de la luz.' }
    ]
  },
  {
    id: 49,
    newspaper: 'RTVE',
    headline: 'LA PROMOCIÓN DEL CINE Y LA CULTURA EN LAS LENGUAS COOFICIALES',
    desc: 'Sectores de la cultura reclaman cuotas de pantalla para el catalán, euskera y gallego.',
    options: [
      { text: 'Aprobar cuotas obligatorias de emisión en lenguas cooficiales para plataformas', score: +12, textResult: 'Refuerzas alianzas territoriales en regiones con lengua propia.' },
      { text: 'Promover la cultura en español como gran activo internacional en el mundo', score: +10, textResult: 'Sintoniza con el votante nacional y conservador.' }
    ]
  },
  {
    id: 50,
    newspaper: 'EL PAÍS',
    headline: 'LA REGULACIÓN DE LAS APUESTAS ONLINE Y CASINOS CERCA DE COLEGIOS',
    desc: 'Asociaciones de vecinos piden alejar las casas de apuestas de las zonas escolares.',
    options: [
      { text: 'Prohibir la publicidad de casas de apuestas y su ubicación cerca de institutos', score: +15, textResult: 'Gran apoyo social de familias y educadores.' },
      { text: 'Establecer licencias estrictas sin prohibiciones totales de ubicación', score: +5, textResult: 'Apostar por el libre mercado regulado sin convencer del todo.' }
    ]
  },
  {
    id: 51,
    newspaper: 'EL MUNDO',
    headline: 'EL DEBATE SOBRE LA PRÁCTICA DE LA GESTACIÓN SUBROGADA',
    desc: 'Casos recientes en los medios reabren la controversia ética sobre la maternidad subrogada.',
    options: [
      { text: 'Prohibir taxativamente la gestación subrogada sancionando agencias', score: +10, textResult: 'Posición firme aplaudida por el feminismo mayoritario.' },
      { text: 'Regular la gestación subrogada garantizando que sea altruista y no comercial', score: +8, textResult: 'Captas el respaldo del electorado de perfil liberal.' }
    ]
  },
  {
    id: 52,
    newspaper: 'ABC',
    headline: 'LA REFORMA DEL TRIBUNAL CONSTITUCIONAL Y EL PODER JUDICIAL',
    desc: 'El bloqueo en los órganos de gobierno de los jueces se arrastra como problema institucional.',
    options: [
      { text: 'Prometer que los jueces elijan directamente a los vocales del CGPJ', score: +15, textResult: 'Aplaudido por las asociaciones judiciales y el centro-derecha.' },
      { text: 'Mantener la elección parlamentaria por tres quintas partes del Congreso', score: +5, textResult: 'Fidelizas al votante alineado con la soberanía popular.' }
    ]
  },
  {
    id: 53,
    newspaper: 'LA VANGUARDIA',
    headline: 'LA FINANCIACIÓN DE LA RED DE TRANSPORTE PÚBLICO METROPOLITANO',
    desc: 'Usuarios piden extender la bonificación del 50% en los abonos de tren y metro permanentemente.',
    options: [
      { text: 'Hacer gratuita la red de Cercanías y tranvías para todos los ciudadanos', score: +15, textResult: 'Medida popularísima de fuerte impacto social.' },
      { text: 'Limitar la gratuidad únicamente a estudiantes, desempleados y jubilados', score: +10, textResult: 'Ajuste presupuestario prudente y lógico.' }
    ]
  },
  {
    id: 54,
    newspaper: 'CADENA SER',
    headline: 'EL ACCESO A LA EUTANASIA Y DERECHO A UNA MUERTE DIGNA',
    desc: 'La objeción de conciencia de médicos frena la aplicación de la ley en algunas autonomías.',
    options: [
      { text: 'Garantizar que todos los hospitales públicos cuenten con personal no objetor', score: +12, textResult: 'Respaldo absoluto de las organizaciones en defensa del derecho a morir.' },
      { text: 'Proteger el derecho inalienable a la objeción de conciencia de los facultativos', score: +8, textResult: 'Apoyo de las asociaciones médicas confesionales.' }
    ]
  },
  {
    id: 55,
    newspaper: 'elDiario.es',
    headline: 'EL RECALCULO DE LAS INDEMNIZACIONES POR DESPIDO EN EL ESTATUTO',
    desc: 'Propuesta para elevar la indemnización por despido improcedente a 45 días por año.',
    options: [
      { text: 'Recuperar la indemnización de 45 días por año con un tope de 42 mensualidades', score: +12, textResult: 'Mueve el voto obrero y sindicalista tradicional.' },
      { text: 'Mantener la indemnización de 33 días para no desincentivar la contratación', score: +10, textResult: 'Valorado positivamente por la patronal y pymes.' }
    ]
  },
  {
    id: 56,
    newspaper: 'EL CONFIDENCIAL',
    headline: 'LA ATRACCIÓN DE TALENTO Y EL RÉGIMEN FISCAL PARA TRABAJADORES REMOTOS',
    desc: 'La Ley de Startups busca convertir a España en un polo de nómadas digitales e inversores.',
    options: [
      { text: 'Rebajar la fiscalidad al 15% para profesionales internacionales que se instalen aquí', score: +12, textResult: 'Posiciona a España como hub innovador y tecnológico.' },
      { text: 'Exigir que tributen al tipo ordinario para no generar discriminación fiscal', score: +8, textResult: 'Defiendes la equidad fiscal entre residentes y extranjeros.' }
    ]
  },
  {
    id: 57,
    newspaper: 'LA RAZÓN',
    headline: 'EL RECONOCIMIENTO DE LAS VÍCTIMAS DEL TERRORISMO EN EL DISCURSO',
    desc: 'Asociaciones de víctimas piden no pactar la gobernabilidad con partidos que no condenen explícitamente la violencia.',
    options: [
      { text: 'Firmar un compromiso explícito de no pactar la investidura con esas fuerzas', score: +15, textResult: 'Mensaje rotundo muy valorado por el electorado constitucionalista.' },
      { text: 'Defender la pluralidad del Congreso y la legalidad de todas las fuerzas votadas', score: +5, textResult: 'Resguardas tu margen de maniobra para pactos tras las urnas.' }
    ]
  },
  {
    id: 58,
    newspaper: 'OKDIARIO',
    headline: 'LA LEY DE SEGURIDAD NACIONAL Y EL CONTROL DE INFRAESTRUCTURAS CRÍTICAS',
    desc: 'Polémica por la venta de puertos o terminales logísticas a capitales extranjeros estatales.',
    options: [
      { text: 'Vetar la presencia de empresas estatales extranjeras en puertos y redes energéticas', score: +12, textResult: 'Imagen de firmeza y protección de la soberanía nacional.' },
      { text: 'Fomentar la atracción de inversiones internacionales sin restricciones ideológicas', score: +5, textResult: 'Defensa de la libertad de capitales desatando recelos geopolíticos.' }
    ]
  },
  {
    id: 59,
    newspaper: 'EXPANSIÓN',
    headline: 'LA REGULACIÓN DE LAS CRIPTOMONEDAS Y LOS ACTIVOS DIGITALES',
    desc: 'El auge de las inversiones cripto entre los jóvenes plantea dudas sobre la supervisión de la CNMV.',
    options: [
      { text: 'Imponer un registro obligatorio y retenciones fiscales estrictas sobre plusvalías cripto', score: +10, textResult: 'Demuestras control del fraude financiero.' },
      { text: 'Crear un entorno regulatorio suave (sandbox) para atraer fintechs de activos digitales', score: +8, textResult: 'Atraes al sector de jóvenes inversores dinámicos.' }
    ]
  },
  {
    id: 60,
    newspaper: 'RTVE',
    headline: 'EL PLAN DE ALFABETIZACIÓN DIGITAL PARA PERSONAS MAYORES',
    desc: 'La brecha digital bancaria y administrativa solivianta a la tercera edad.',
    options: [
      { text: 'Obligar a bancos y administraciones a mantener la atención presencial sin cita', score: +15, textResult: 'Enorme reconocimiento de los colectivos de personas mayores.' },
      { text: 'Aumentar los cursos de formación digital gratuita para mayores de 65 años', score: +8, textResult: 'Propuesta enfocada a la modernización sin obligaciones legales.' }
    ]
  },
  {
    id: 61,
    newspaper: 'EL PAÍS',
    headline: 'LA LEY DE MEMORIA DEMOCRÁTICA Y LA REPARACIÓN DE LAS VÍCTIMAS',
    desc: 'Debate sobre la retirada de simbología y la exhumación de fosas de la Guerra Civil.',
    options: [
      { text: 'Poner fondos públicos para exhumar la totalidad de las fosas comunes', score: +15, textResult: 'Movilizas al electorado progresista y defensor de la memoria.' },
      { text: 'Dejar la memoria en el ámbito privado evitando reabrir heridas del pasado', score: +10, textResult: 'Línea conservadora que evita la crispación ideológica.' }
    ]
  },
  {
    id: 62,
    newspaper: 'EL MUNDO',
    headline: 'LA POLITIZACIÓN DE LAS TELEVISIONES PÚBLICAS Y ÓRGANOS REGULADORES',
    desc: 'Periodistas reclaman la elección por concurso público independiente de la dirección de RTVE.',
    options: [
      { text: 'Garantizar por ley el concurso público sin cuotas de partidos para la directiva', score: +15, textResult: 'Medida regeneradora aplaudida por los profesionales de la información.' },
      { text: 'Mantener la elección parlamentaria proporcional de los consejeros', score: +2, textResult: 'Mantienes el esquema de control político habitual.' }
    ]
  },
  {
    id: 63,
    newspaper: 'ABC',
    headline: 'EL COMPROMISO CON LA UNIDAD LINGÜÍSTICA Y EL CASTELLANO COMO LENGUA VEHICULAR',
    desc: 'Asociaciones de familias piden garantizar el 25% de clases en español en regiones bilingües.',
    options: [
      { text: 'Garantizar por ley el 25% de enseñanza en castellano en todo el Estado', score: +15, textResult: 'Respaldo total del electorado defensor de la hispanofonía.' },
      { text: 'Respetar los modelos de inmersión lingüística decididos por las regiones', score: +8, textResult: 'Consolidas apoyos en partidos autonómicos bilingües.' }
    ]
  },
  {
    id: 64,
    newspaper: 'LA VANGUARDIA',
    headline: 'LA AMPLIACIÓN O REMODELACIÓN DE LOS GRANDES AEROPUERTOS NACIONALES',
    desc: 'Los proyectos de expansión de terminales chocan con los compromisos climáticos de la UE.',
    options: [
      { text: 'Autorizar las ampliaciones aeroportuarias para liderar las conexiones mundiales', score: +12, textResult: 'Entusiasma al sector empresarial e inmobiliario.' },
      { text: 'Paralizar las ampliaciones y potenciar la red de tren de alta velocidad', score: +10, textResult: 'Coherencia medioambiental celebrada por colectivos ecologistas.' }
    ]
  },
  {
    id: 65,
    newspaper: 'CADENA SER',
    headline: 'EL RECONOCIMIENTO DEL TELETRABAJO Y EL DERECHO A LA DESCONEXIÓN DIGITAL',
    desc: 'Sindicatos denuncian la prolongación abusiva de la jornada mediante correos y chats de empresa.',
    options: [
      { text: 'Sancionar duramente a las empresas que envíen comunicaciones fuera del horario', score: +12, textResult: 'Proteges los derechos de los asalariados y la salud mental.' },
      { text: 'Fomentar pactos voluntarios de flexibilidad laboral entre partes', score: +8, textResult: 'Favoreces la adaptación de las pymes al entorno digital.' }
    ]
  },
  {
    id: 66,
    newspaper: 'elDiario.es',
    headline: 'LA TASA GOOGLE Y LA FISCALIDAD A LAS MULTINACIONALES TECNOLÓGICAS',
    desc: 'Organizaciones exigen que las grandes tecnológicas tributen por los beneficios reales que generan en el país.',
    options: [
      { text: 'Aplicar un impuesto del 5% a la facturación digital de las grandes multinacionales', score: +15, textResult: 'Mensaje directo de justicia fiscal de gran éxito.' },
      { text: 'Alinear la fiscalidad digital a los acuerdos globales que decida la OCDE', score: +8, textResult: 'Prudencia internacional para no desatar represalias comerciales.' }
    ]
  },
  {
    id: 67,
    newspaper: 'EL CONFIDENCIAL',
    headline: 'EL INCENTIVO A LA COMPRA DE VIVIENDA PARA JÓVENES MEDIANTE AVALES ICO',
    desc: 'El Estado estudia avalar la entrada de la hipoteca a menores de 35 años.',
    options: [
      { text: 'Aprobar avales públicos del 20% para que los jóvenes compren su primera vivienda', score: +15, textResult: 'Medida muy atractiva para los jóvenes que buscan independizarse.' },
      { text: 'Destinar ese presupuesto a construir vivienda en alquiler social', score: +10, textResult: 'Apuesta por el modelo europeo de parque público de alquiler.' }
    ]
  },
  {
    id: 68,
    newspaper: 'LA RAZÓN',
    headline: 'LA POLÍTICA DE BECAS Y LA EXIGENCIA DE NOTA MEDIA PARA SU CONCESIÓN',
    desc: 'Debate sobre si el acceso a las becas públicas debe basarse solo en la renta o también en el rendimiento académico.',
    options: [
      { text: 'Exigir un aprobado general elevando el requisito académico para mantener la beca', score: +10, textResult: 'Ganas apoyos en los defensores de la cultura del esfuerzo.' },
      { text: 'Garantizar la beca basándose únicamente en el nivel de renta familiar', score: +12, textResult: 'Garantizas la equidad en el acceso a los estudios para familias humildes.' }
    ]
  },
  {
    id: 69,
    newspaper: 'OKDIARIO',
    headline: 'LA REGULACIÓN Y OCUPACIÓN ILEGAL DE VIVIENDAS',
    desc: 'Plataformas de afectados reclaman desalojos exprés en un plazo máximo de 24 horas.',
    options: [
      { text: 'Prometer desalojos exprés en 24 horas y endurecer las penas por okupación', score: +15, textResult: 'Muy efectivo entre propietarios y votantes conservadores.' },
      { text: 'Distinguir entre mafias de ocupación y familias en situación de vulnerabilidad social', score: +5, textResult: 'Matiz social que evita soluciones de fuerza indiscriminadas.' }
    ]
  },
  {
    id: 70,
    newspaper: 'EXPANSIÓN',
    headline: 'LA PRIVATIZACIÓN O PERMANENCIA DE EMPRESAS PÚBLICAS DEFICITARIAS',
    desc: 'Foros liberales piden la venta o reconversión de entidades estatales con pérdidas recurrentes.',
    options: [
      { text: 'Privatizar o cerrar las sociedades públicas sin viabilidad económica', score: +10, textResult: 'Sintonizas con la ortodoxia fiscal y los mercados.' },
      { text: 'Mantener la titularidad pública garantizando su función social y estratégica', score: +10, textResult: 'Mantienes la defensa del sector público e industrial del Estado.' }
    ]
  },
  {
    id: 71,
    newspaper: 'RTVE',
    headline: 'LA SOSTENIBILIDAD DEL SECTOR PESQUERO Y LAS CUOTAS DE LA UE',
    desc: 'Barcos de pesca amarran en los puertos del Cantábrico por los recortes en los días de faena.',
    options: [
      { text: 'Ofrecer ayudas de estado para paliar las paradas biológicas de los pescadores', score: +12, textResult: 'Gran acogida en las villas marineras y comarcas costeras.' },
      { text: 'Exigir a Bruselas la revisión al alza de las cuotas para la flota nacional', score: +10, textResult: 'Imagen de firmeza en la negociación comunitaria.' }
    ]
  },
  {
    id: 72,
    newspaper: 'EL PAÍS',
    headline: 'LA LEY DE PARIDAD EN LOS CONSEJOS DE ADMINISTRACIÓN Y EL GOBIERNO',
    desc: 'Obligatoriedad de contar con al menos un 40% de mujeres en los órganos directivos.',
    options: [
      { text: 'Aprobar por ley la cuota de paridad obligatoria en empresas cotizadas y gobierno', score: +12, textResult: 'Refuerzas tu perfil feminista y de igualdad de género.' },
      { text: 'Recomendar la paridad mediante sellos de excelencia sin impositivas legales', score: +8, textResult: 'Defiendes la autonomía organizativa de las empresas.' }
    ]
  },
  {
    id: 73,
    newspaper: 'EL MUNDO',
    headline: 'LA REFORMA DEL DELITO DE MALVERSACIÓN Y SEDICIÓN EN EL CÓDIGO PENAL',
    desc: 'Las modificaciones penales previas siguen en el foco de las críticas de la oposición.',
    options: [
      { text: 'Agravar las penas por malversación pública eliminando modalidades atenuadas', score: +15, textResult: 'Proyectas intransigencia total ante la corrupción política.' },
      { text: 'Defender la armonización del Código Penal con los estándares de la Unión Europea', score: +5, textResult: 'Resguardas las reformas legales aprobadas con tus socios.' }
    ]
  },
  {
    id: 74,
    newspaper: 'ABC',
    headline: 'EL COMPROMISO CON LAS INFRAESTRUCTURAS DEL CORREDOR MEDITERRÁNEO',
    desc: 'Empresarios levantinos y catalanes reclaman la aceleración de las obras ferroviarias de mercancías.',
    options: [
      { text: 'Declarar el Corredor Mediterráneo como obra prioritaria del Estado', score: +15, textResult: 'Consigues apoyos clave en Valencia, Murcia, Cataluña y Andalucía.' },
      { text: 'Repartir el presupuesto de infraestructuras equilibradamente con el interior', score: +8, textResult: 'Evitas recelos en las comunidades autónomas del interior peninsular.' }
    ]
  },
  {
    id: 75,
    newspaper: 'LA VANGUARDIA',
    headline: 'LA DIVERSIFICACIÓN DEL MODELO TURÍSTICO HACIA EL TURISMO DE CALIDAD',
    desc: 'Comunidades insulares buscan limitar el turismo masivo de bajo coste para evitar la saturación.',
    options: [
      { text: 'Aprobar ecotasas al turismo de cruceros para reinvertir en medio ambiente', score: +12, textResult: 'Satisface a los residentes en Baleares y Canarias.' },
      { text: 'Rechazar cualquier tasa turística para no perder competitividad en Europa', score: +8, textResult: 'Tranquilizas a las patronales hoteleras y de restauración.' }
    ]
  },
  {
    id: 76,
    newspaper: 'CADENA SER',
    headline: 'EL ACCESO A LA VIVIENDA MEDIANTE LA REGULACIÓN DEL PRECIO DE LOS SUELOS',
    desc: 'Propuesta para destinar el 50% del suelo urbanizable libre a vivienda de protección pública.',
    options: [
      { text: 'Obligar por ley a reservar la mitad de cada nueva promoción a VPO', score: +15, textResult: 'Propuesta contundente contra la especulación inmobiliaria.' },
      { text: 'Fomentar la permuta de suelo público a promotoras para construir alquiler asequible', score: +10, textResult: 'Modelo de colaboración público-privada bien visto en el sector.' }
    ]
  },
  {
    id: 77,
    newspaper: 'elDiario.es',
    headline: 'LA PROTECCIÓN DE LOS DERECHOS LGTBI Y LA LEY TRANS',
    desc: 'La autodeterminación de género centra el debate entre defensores de la norma y detractores.',
    options: [
      { text: 'Blindar la Ley Trans garantizando el libre desarrollo de la personalidad', score: +15, textResult: 'Movilizas al colectivo LGTBI y a las fuerzas progresistas.' },
      { text: 'Revisar la norma exigiendo informe médico en la rectificación registral', score: +8, textResult: 'Atraes al feminismo clásico e ideologías moderadas.' }
    ]
  },
  {
    id: 78,
    newspaper: 'EL CONFIDENCIAL',
    headline: 'EL AUMENTO DEL COSTE DE LAS HIPOTECAS A TIPO VARIABLE',
    desc: 'Asociaciones de consumidores piden congelar las cuotas hipotecarias a familias vulnerables.',
    options: [
      { text: 'Obligar a la banca a crear un fondo de rescate para hipotecas de familias con bajos ingresos', score: +15, textResult: 'Enorme acogida entre las familias ahogadas por la subida de tipos.' },
      { text: 'Aumentar las deducciones fiscales por vivienda habitual en la Renta', score: +10, textResult: 'Alivio fiscal directo apreciado por las clases medias.' }
    ]
  },
  {
    id: 79,
    newspaper: 'LA RAZÓN',
    headline: 'EL CUMPLIMIENTO DE LA LEY DE BANDERAS Y SÍMBOLOS NACIONALES',
    desc: 'Querellas por la ausencia de la bandera de España en algunos ayuntamientos del norte.',
    options: [
      { text: 'Exigir el cumplimiento estricto de la ley inhabilitando a alcaldes insumisos', score: +15, textResult: 'Firmeza constitucional bien vista en el electorado patriótico.' },
      { text: 'Evitar la judicialización de los símbolos favoreciendo el diálogo político', score: +5, textResult: 'Evitas encender ánimos territoriales pero sufres críticas nacionalistas.' }
    ]
  },
  {
    id: 80,
    newspaper: 'OKDIARIO',
    headline: 'EL COSTA Y GASTO DE LOS ASESORES Y MINISTERIOS DEL GOBIERNO',
    desc: 'Críticas a la estructura del Ejecutivo por contar con un número récord de carteras.',
    options: [
      { text: 'Comprometer la reducción a un máximo de 12 ministerios y la mitad de asesores', score: +15, textResult: 'Mensaje de austeridad política que cala muy bien en la opinión pública.' },
      { text: 'Defender la estructura ministerial actual para dar respuesta a todos los retos', score: +2, textResult: 'Justificación institucional recibida con frialdad por los electores.' }
    ]
  },
  {
    id: 81,
    newspaper: 'EXPANSIÓN',
    headline: 'LA REGULACIÓN DEL SECTOR FARMACÉUTICO Y EL PRECIO DE LOS MEDICAMENTOS',
    desc: 'Conflicto por el margen comercial de las farmacias y la subasta de medicamentos.',
    options: [
      { text: 'Promover la compra centralizada de genéricos para abaratar la factura farmacéutica', score: +12, textResult: 'Ahorro público celebrado por los gestores sanitarios.' },
      { text: 'Proteger el modelo de farmacia comunitaria tradicional de proximidad', score: +10, textResult: 'Aseguras el respaldo del potente colectivo farmacéutico.' }
    ]
  },
  {
    id: 82,
    newspaper: 'RTVE',
    headline: 'EL ACCESO A LA CULTURA Y LA GRATUIDAD DE MUSEOS NACIONALES',
    desc: 'Propuesta para liberalizar las entradas a los grandes museos del Estado para residentes.',
    options: [
      { text: 'Hacer gratuitos los museos nacionales para todos los ciudadanos españoles', score: +12, textResult: 'Apoyo entusiasta de la comunidad cultural y docente.' },
      { text: 'Mantener las tarifas reducidas destinando la recaudación a restauración', score: +5, textResult: 'Criterio de sostenibilidad presupuestaria en la gestión de cultura.' }
    ]
  },
  {
    id: 83,
    newspaper: 'EL PAÍS',
    headline: 'LA REFORMA DEL TRÁFICO Y LAS RESTRICCIONES EN ZONAS DE BAJAS EMISIONES (ZBE)',
    desc: 'Municipios de más de 50.000 habitantes obligados a restringir los coches más contaminantes.',
    options: [
      { text: 'Exigir la implantación estricta de las ZBE sancionando a municipios incumplidores', score: +12, textResult: 'Coherencia medioambiental con la directiva europea.' },
      { text: 'Dar moratorias a trabajadores e incentivos para la renovación de vehículos', score: +10, textResult: 'Comprensión con las familias que no pueden comprar coche eléctrico.' }
    ]
  },
  {
    id: 84,
    newspaper: 'EL MUNDO',
    headline: 'LA POLITIZACIÓN DE LAS COMISIONES DE INVESTIGACIÓN EN EL CONGRESO',
    desc: 'Oposición y gobierno cruzando solicitudes de comparecencia por casos de presunta corrupción.',
    options: [
      { text: 'Aceptar todas las comparecencias solicitadas incluidas las de los propios ministros', score: +12, textResult: 'Demuestras ejemplaridad y valentía mediática.' },
      { text: 'Denunciar el uso partidista del Congreso bloqueando interrogatorios espectáculos', score: +5, textResult: 'Proteges a tu equipo a costa de acusaciones de oscurantismo.' }
    ]
  },
  {
    id: 85,
    newspaper: 'ABC',
    headline: 'LA ATENCIÓN Y PROTECCIÓN A LAS FAMILIAS NUMEROSAS',
    desc: 'Asociaciones de familias piden que los beneficios fiscales no dependan de la renta.',
    options: [
      { text: 'Mantener la condición de familia numerosa de forma universal sin tope de renta', score: +15, textResult: 'Iniciativa muy aplaudida por las familias numerosas.' },
      { text: 'Graduar las ayudas públicas según los ingresos reales del hogar', score: +8, textResult: 'Criterio de equidad distributiva apoyado por el centro-izquierda.' }
    ]
  },
  {
    id: 86,
    newspaper: 'LA VANGUARDIA',
    headline: 'EL TRATAMIENTO DE LA VIOLENCIA MACHISTA Y LAS MEDIDAS DE PREVENCIÓN',
    desc: 'Episodios trágicos de violencia vicaria reabren la urgencia de renovar el Pacto de Estado.',
    options: [
      { text: 'Inyectar más recursos en los juzgados especializados e incrementar las pulseras telemáticas', score: +15, textResult: 'Repuesta contundente respaldada por toda la sociedad.' },
      { text: 'Focalizar la prevención en la educación afectiva en las aulas desde primaria', score: +10, textResult: 'Modelo de prevención a largo plazo de fuerte calado social.' }
    ]
  },
  {
    id: 87,
    newspaper: 'CADENA SER',
    headline: 'EL PLAN NACIONAL CONTRA EL FRACASO Y ABANDONO ESCOLAR TEMPRANO',
    desc: 'Un 13% de los estudiantes abandona la secundaria sin título técnico o bachillerato.',
    options: [
      { text: 'Potenciar la Formación Profesional Dual con prácticas remuneradas garantizadas', score: +15, textResult: 'Aclamado por el sector educativo e industrial.' },
      { text: 'Reducir el número de alumnos por aula a un máximo de 20 estudiantes', score: +12, textResult: 'Gran valoración de la comunidad docente y sindicatos.' }
    ]
  },
  {
    id: 88,
    newspaper: 'elDiario.es',
    headline: 'LA REGULACIÓN DE LAS PLATAFORMAS DE REPARTIDORES Y LA LEY RIDER',
    desc: 'Inspección de Trabajo vuelve a sancionar a plataformas que eluden la contratación directa.',
    options: [
      { text: 'Endurecer las sanciones penales para directivos de plataformas infractoras', score: +12, textResult: 'Contundente defensa de los derechos laborales digitales.' },
      { text: 'Permitir un modelo mixto de autónomos con protecciones sociales garantizadas', score: +5, textResult: 'Flexibilidad laboral apreciada por algunas empresas tecnológicas.' }
    ]
  },
  {
    id: 89,
    newspaper: 'EL CONFIDENCIAL',
    headline: 'EL PLAN DE INVERSIÓN EN LA RED DE CARRETERAS Y CONSERVACIÓN',
    desc: 'Asociaciones del motor denuncian el mal estado del firme en miles de kilómetros de la red secundaria.',
    options: [
      { text: 'Lanzar un Plan Nacional de Conservación de Carreteras prioritario', score: +12, textResult: 'Satisface a los conductores y a las empresas de transporte.' },
      { text: 'Priorizar la inversión en la red ferroviaria para retirar camiones de las autovías', score: +10, textResult: 'Estrategia de transporte sostenible y eficiente.' }
    ]
  },
  {
    id: 90,
    newspaper: 'LA RAZÓN',
    headline: 'LA PROTECCIÓN DE LA PROPIEDAD PRIVADA Y LA SEGURIDAD JURÍDICA INMOBILIARIA',
    desc: 'Empresarios extranjeros expresan dudas sobre la seguridad de las inversiones inmobiliarias.',
    options: [
      { text: 'Garantizar el blindaje de la propiedad privada en la Constitución', score: +15, textResult: 'Envías un mensaje de máxima seguridad a los inversores.' },
      { text: 'Recordar la función social de la propiedad consagrada en la ley fundamental', score: +8, textResult: 'Coherencia con las posturas redistributivas del Estado.' }
    ]
  },
  {
    id: 91,
    newspaper: 'OKDIARIO',
    headline: 'LA POLÍTICA DE PACTOS POSTELECTORALES Y LAS LÍNEAS ROJAS',
    desc: 'Los entrevistadores exigen saber si se aceptará entrar en gobiernos de coalición con los extremos.',
    options: [
      { text: 'Asegurar que solo se aceptarán pactos sobre contenidos y programas transparentes', score: +10, textResult: 'Liderazgo maduro que da tranquilidad a los moderados.' },
      { text: 'Pedir el voto masivo para no depender de ninguna fuerza minoritaria', score: +12, textResult: 'Apelación clásica al voto útil con gran arrastre.' }
    ]
  },
  {
    id: 92,
    newspaper: 'EXPANSIÓN',
    headline: 'LA ATRACCIÓN DE MEGAPROYECTOS DE FÁBRICAS DE CHIPS Y BATERÍAS',
    desc: 'España compite con otros países europeos por la radicación de gigafactorías tecnológicas.',
    options: [
      { text: 'Ofrecer subsidios directos y exenciones fiscales para captar la inversión industrial', score: +15, textResult: 'Consigues colocar a España en el mapa de la alta tecnología.' },
      { text: 'Exigir participaciones del Estado en las empresas instaladas a cambio de las ayudas', score: +5, textResult: 'Apuesta por el capitalismo de estado que retrae a multinacionales.' }
    ]
  },
  {
    id: 93,
    newspaper: 'RTVE',
    headline: 'LA PLANIFICACIÓN DE LA COBERTURA DE ATENCIÓN A LA DEPENDENCIA',
    desc: 'Listas de espera para recibir las prestaciones del sistema de dependencia soliviantan a las familias.',
    options: [
      { text: 'Aumentar en 2.000 millones la aportación estatal al sistema de Dependencia', score: +15, textResult: 'Medida humana de gran calado muy bien recibida.' },
      { text: 'Agilizar la tramitación burocrática mediante la declaración responsable', score: +10, textResult: 'Solución administrativa apreciada para acelerar los cobros.' }
    ]
  },
  {
    id: 94,
    newspaper: 'EL PAÍS',
    headline: 'LA REFORMA DEL MODELO FISCAL Y EL TRIBUTO A LA BEBIDA Y ALIMENTOS AZUCARADOS',
    desc: 'Sanidad sugiere elevar los impuestos sobre la bollería industrial y refrescos para combatir la obesidad.',
    options: [
      { text: 'Aprobar el impuesto especial a los alimentos ultraprocesados y azucarados', score: +10, textResult: 'Respaldo de organizaciones médicas y de salud pública.' },
      { text: 'Rechazar la subida de impuestos apostando por la educación nutricional en colegios', score: +10, textResult: 'Evitas encarecer la cesta de la compra familiar.' }
    ]
  },
  {
    id: 95,
    newspaper: 'EL MUNDO',
    headline: 'EL ACCESO A LAS OPOSICIONES Y LA DIGITALIZACIÓN DE LA ADMINISTRACIÓN',
    desc: 'Jóvenes opositores reclaman la simplificación y descentralización de las pruebas selectivas.',
    options: [
      { text: 'Reformar las oposiciones hacia un modelo por competencias más ágil y descentralizado', score: +12, textResult: 'Modernización del empleo público aclamada por los opositores.' },
      { text: 'Mantener el sistema tradicional memorístico para garantizar la igualdad meritocrática', score: +8, textResult: 'Defiendes la tradición y rigor en el acceso a la función pública.' }
    ]
  },
  {
    id: 96,
    newspaper: 'ABC',
    headline: 'EL REFORZAMIENTO DE LAS RELACIONES CON LA UNIÓN EUROPEA Y LA ALIANZA ATLÁNTICA',
    desc: 'Foros internacionales valoran la fiabilidad de España como socio prioritario militar y diplomático.',
    options: [
      { text: 'Reafirmar el compromiso atlantista de España en las misiones internacionales', score: +12, textResult: 'Liderazgo exterior alineado con los aliados occidentales.' },
      { text: 'Promover la autonomía estratégica europea reduciendo la dependencia de EEUU', score: +10, textResult: 'Perfil europetista que gusta en el electorado de centro-izquierda.' }
    ]
  },
  {
    id: 97,
    newspaper: 'LA VANGUARDIA',
    headline: 'LA PROTECCIÓN DEL MEDIO MARINO Y EL COMBATE A LOS PLÁSTICOS',
    desc: 'Colectivos ecologistas piden prohibir los envases de plástico de un solo uso en supermercados.',
    options: [
      { text: 'Prohibir la comercialización de fruta y verdura empaquetada en plástico', score: +12, textResult: 'Victoria legislativa muy valorada por la conciencia ecológica.' },
      { text: 'Imponer un sistema de devolución y retorno de envases (SDDR) con incentivo económico', score: +10, textResult: 'Modelo de reciclaje circular respaldado por las familias.' }
    ]
  },
  {
    id: 98,
    newspaper: 'CADENA SER',
    headline: 'LA REESTRUCTURACIÓN DEL SECTOR POSTAL PÚBLICO Y CORREOS',
    desc: 'Sindicatos postales se movilizan exigiendo un plan de viabilidad y mantenimiento de plantilla.',
    options: [
      { text: 'Garantizar la financiación pública de Correos como servicio postal universal', score: +12, textResult: 'Ganas el respaldo de los trabajadores postales y zonas rurales.' },
      { text: 'Diversificar el negocio de Correos hacia la logística comercial y bancaria', score: +10, textResult: 'Estrategia de modernización del operador estatal.' }
    ]
  },
  {
    id: 99,
    newspaper: 'elDiario.es',
    headline: 'LA REGULACIÓN DE LAS EMPRESAS DE TRABAJO TEMPORAL (ETT)',
    desc: 'Sindicatos piden limitar el uso de las ETTs en la contratación de las administraciones públicas.',
    options: [
      { text: 'Prohibir la contratación a través de ETTs en la red pública de servicios', score: +12, textResult: 'Duro golpe a la temporalidad apreciado por las bases de izquierda.' },
      { text: 'Mantener las ETTs para cubrir sustituciones urgentes en picos de demanda', score: +8, textResult: 'Defiendes la flexibilidad organizativa para situaciones de sustitución.' }
    ]
  },
  {
    id: 100,
    newspaper: 'EL CONFIDENCIAL',
    headline: 'EL ACCESO A LA JUSTICIA Y EL AUMENTO DE LAS TASAS JUDICIALES',
    desc: 'Plataformas de abogados piden la gratuidad total de la justicia gratuita para las pymes.',
    options: [
      { text: 'Ampliar la justicia gratuita a microempresas y trabajadores autónomos', score: +12, textResult: 'Medida muy apreciada por pequeños empresarios en apuros legales.' },
      { text: 'Concentrar la justicia gratuita exclusivamente en personas vulnerables', score: +8, textResult: 'Uso responsable de los fondos de la administración de justicia.' }
    ]
  },
  {
    id: 101,
    newspaper: 'LA RAZÓN',
    headline: 'LA REFORMA DEL ESTATUTO DE LOS TRABAJADORES Y LA MOVILIDAD GEOGRÁFICA',
    desc: 'Debate sobre los traslados obligatorios de plantilla sin compensaciones suficientes.',
    options: [
      { text: 'Exigir la conformidad del trabajador o indemnización máxima en caso de traslado', score: +12, textResult: 'Protección de la conciliación familiar de los trabajadores.' },
      { text: 'Mantener la causa organizativa de empresa para traslados con preaviso', score: +8, textResult: 'Favoreces la movilidad y necesidades operativas de las empresas.' }
    ]
  },
  {
    id: 102,
    newspaper: 'OKDIARIO',
    headline: 'LA LEY DE PROPIEDAD INTELECTUAL Y LAS DESCARGAS DIGITALES',
    desc: 'Asociaciones de creadores piden el cierre cautelar en 24 horas de webs pirateadas.',
    options: [
      { text: 'Aprobar el cierre administrativo ágil de portales de descargas ilícitas', score: +12, textResult: 'Firme defensa del sector cultural y derechos de autor.' },
      { text: 'Exigir siempre autorización judicial previa para cerrar cualquier página web', score: +8, textResult: 'Protección estricta de la libertad de información y la red libre.' }
    ]
  },
  {
    id: 103,
    newspaper: 'EXPANSIÓN',
    headline: 'LA BONIFICACIÓN DEL IMPUESTO DE SUCESIONES Y DONACIONES',
    desc: 'El debate sobre el "impuesto a la muerte" enfrenta a autonomías que lo eliminan con las que lo mantienen.',
    options: [
      { text: 'Bonificar al 99% el Impuesto de Sucesiones entre padres e hijos en todo el Estado', score: +15, textResult: 'Propuesta de enorme éxito en el electorado de centro y centro-derecha.' },
      { text: 'Mantener el tributo para herencias superiores a 1 millón de euros', score: +8, textResult: 'Criterio de justicia redistributiva defensora de la igualdad de oportunidades.' }
    ]
  },
  {
    id: 104,
    newspaper: 'RTVE',
    headline: 'LA PROTECCIÓN DE LAS ESPECIES AMENAZADAS Y LA FAUNA SALVAGED',
    desc: 'La inclusión o exclusión del lobo ibérico del listado de especies protegidas solivianta al campo.',
    options: [
      { text: 'Permitir batidas controladas del lobo para proteger a la ganadería extensiva', score: +12, textResult: 'Conquistas el voto rural de ganaderos y agricultores del norte.' },
      { text: 'Mantener la protección del lobo e indemnizar al 100% las bajas del ganado', score: +12, textResult: 'Apoyo entusiasta de colectivos ecologistas y urbanos.' }
    ]
  },
  {
    id: 105,
    newspaper: 'EL PAÍS',
    headline: 'LA FINANCIACIÓN DEL SISTEMA DE ATENCIÓN A LAS PERSONAS SIN HOGAR',
    desc: 'El aumento de la exclusión social en grandes urbes pide un compromiso estatal de alojamiento.',
    options: [
      { text: 'Aprobar el Plan "Housing First" garantizando techo público a personas sin hogar', score: +12, textResult: 'Medida solidaria aclamada por ONGs y servicios sociales.' },
      { text: 'Transferir la partida a las organizaciones del tercer sector y Cáritas', score: +8, textResult: 'Confianza en la vertebración social a través de entidades privadas.' }
    ]
  },
  {
    id: 106,
    newspaper: 'EL MUNDO',
    headline: 'LA EXIGENCIA DE RESPONSABILIDAD PENAL A LOS SINDICATOS Y PATRONALES',
    desc: 'Propuesta para someter la financiación de agentes sociales a la auditoría del Tribunal de Cuentas.',
    options: [
      { text: 'Auditar públicamente cada euro recibido por sindicatos y patronales', score: +15, textResult: 'Proyectas máxima transparencia y lucha contra los privilegios.' },
      { text: 'Respetar la autonomía constitucional de representación de los agentes sociales', score: +5, textResult: 'Mantienes las buenas relaciones tradicionales con la cúpula sindical.' }
    ]
  },
  {
    id: 107,
    newspaper: 'ABC',
    headline: 'LA DEFENSA DEL IDIOMA ESPAÑOL Y LA REAL ACADEMIA ESPAÑOLA (RAE)',
    desc: 'Debate sobre la adaptación del lenguaje inclusivo en los documentos de la administración.',
    options: [
      { text: 'Acatar estrictamente las normas gramaticales fijadas por la RAE en la administración', score: +12, textResult: 'Ganas el respaldo de los puristas de la lengua y conservadores.' },
      { text: 'Fomentar el uso del lenguaje inclusivo no sexista en la redacción de leyes', score: +12, textResult: 'Coherencia con las políticas de visibilización e igualdad de género.' }
    ]
  },
  {
    id: 108,
    newspaper: 'LA VANGUARDIA',
    headline: 'LA ATENCIÓN Y CUIDADOS DE LOS ANCIANOS EN LA RED DE RESIDENCIAS',
    desc: 'Inspecciones en centros de mayores exigen un aumento del ratio de personal de enfermería.',
    options: [
      { text: 'Públicar las inspecciones e imponer un ratio obligatorio de 1 cuidador por cada 5 residentes', score: +15, textResult: 'Puntos clave por la calidad de cuidados en la vejez.' },
      { text: 'Fomentar el modelo de cheques residencia para que las familias elijan centro', score: +8, textResult: 'Solución mixta bien recibida por el sector privado asistencial.' }
    ]
  },
  {
    id: 109,
    newspaper: 'elDiario.es',
    headline: 'LA PROHIBICIÓN DE LOS VUELOS CORTOS QUE TENGAN ALTERNATIVA EN TREN',
    desc: 'Propuesta de suspender los vuelos nacionales con trayectoria inferior a 2,5 horas en AVE.',
    options: [
      { text: 'Suprimir los vuelos domésticos con alternativa en AVE de menos de tres horas', score: +12, textResult: 'Medida vanguardista de impacto climático muy celebrada.' },
      { text: 'Dejar que los viajeros elijan medio de transporte en libre competencia', score: +10, textResult: 'Respaldo del sector de las aerolíneas y turismo.' }
    ]
  },
  {
    id: 110,
    newspaper: 'EL CONFIDENCIAL',
    headline: 'EL MINUTO FINAL: ÚLTIMO LLAMAMIENTO A LAS URNAS ANTES DEL CIERRE',
    desc: 'Los sondeos reflejan que un 15% de los votantes decidirá su voto dentro de la cabina electoral.',
    options: [
      { text: 'Pedir la concentración del voto para garantizar la gobernabilidad y el progreso', score: +15, textResult: 'Cierras la campaña apelando a la máxima responsabilidad cívica.' },
      { text: 'Pedir el voto valiente y con ilusión frente al miedo y la resignación', score: +15, textResult: 'Terminas la carrera electoral contagiando entusiasmo y motivación.' }
    ]
}
    ];

const PRESS_NEWS_BANK = [
  {
    id: 'NEWS_1',
    newspaper: 'EL PAÍS',
    headline: 'RÉCORD HISTÓRICO DE EXPORTACIONES AGRÍCOLAS Y TURISMO',
    desc: 'Los datos trimestrales reflejan un tirón en el sector exterior que impulsa las cuentas públicas.',
    options: [
      { text: 'Sacar pecho en rueda de prensa del Consejo de Ministros', stats: { eco: +4, apr: +3 }, news: 'Moncloa presume del crecimiento económico exterior.' },
      { text: 'Destinar el superávit comercial a reducir la deuda estatal', stats: { eco: +6, est: +2 }, news: 'Hacienda amortiza deuda con el excedente comercial.' }
    ]
  },
  {
    id: 'NEWS_2',
    newspaper: 'EL MUNDO',
    headline: 'FILTRACIÓN DE AUDIOS COMPROMETEDORES EN UN MINISTERIO',
    desc: 'Grabaciones anónimas revelan conversaciones informales sobre presiones en contrataciones públicas.',
    options: [
      { text: 'Abrir una investigación interna y prometer transparencia total', stats: { apr: -2, est: +3 }, news: 'El Gobierno anuncia una auditoría tras la filtración.' },
      { text: 'Denunciar una operación mediática de guerra sucia contra el Ejecutivo', stats: { apr: -5, est: -2 }, news: 'El Gabinete acusa a la oposición de guerra mediática.' }
    ]
  },
  {
    id: 'NEWS_3',
    newspaper: 'ABC',
    headline: 'TENSIONES EN LA FRONTERA SUR Y ALERTAS EN SEGURIDAD',
    desc: 'Asociaciones policiales denuncian saturación de medios y escasez de personal en puestos fronterizos.',
    options: [
      { text: 'Aprobar un turno extraordinario retribuido para los agentes', stats: { con: +6, mil: +3, eco: -2 }, cost: 500, news: 'Reforzado el dispositivo policial en la frontera sur.' },
      { text: 'Rechazar las críticas atribuyéndolas a consignas de la oposición', stats: { con: -4, apr: -3 }, news: 'Malestar en las Fuerzas de Seguridad por la falta de refuerzos.' }
    ]
  },
  {
    id: 'NEWS_4',
    newspaper: 'LA VANGUARDIA',
    headline: 'PARO PATRONAL DE TRANSPORTISTAS POR EL COSTE DEL COMBUSTIBLE',
    desc: 'Asociaciones del transporte de mercancías amenazan con bloquear nodos de distribución logísticos.',
    options: [
      { text: 'Subvencionar temporalmente el litro de diésel profesional', stats: { eco: -4, est: +6, apr: +4 }, cost: 1200, news: 'Moncloa desconvoca el paro del transporte con bonificaciones.' },
      { text: 'Mantener la fiscalidad verde exigiendo el cumplimiento de la ley', stats: { eco: +2, est: -8, apr: -6 }, news: 'Riesgo de desabastecimiento por el paro del transporte.' }
    ]
  },
  {
    id: 'NEWS_5',
    newspaper: 'RTVE',
    headline: 'BRUSELAS ELEVA A BUENA NOTA EL RIGOR FISCAL DE ESPAÑA',
    desc: 'La Comisión Europea publica su informe trimestral avalando la estabilidad macroeconómica del país.',
    options: [
      { text: 'Celebrar el respaldo de la Comisión Europea', stats: { eco: +5, apr: +4, est: +2 }, news: 'Bruselas respalda la senda fiscal del Gobierno.' }
    ]
  },
  {
    id: 'NEWS_6',
    newspaper: 'EL CONFIDENCIAL',
    headline: 'REBOTAN LOS PRECIOS EN LOS SUPERMERCADOS Y LA CESTA BÁSICA',
    desc: 'El IPC de los alimentos se encarece dos dígitos generando malestar entre las familias de rentas medias.',
    options: [
      { text: 'Aprobar un cheque directo para familias vulnerables', stats: { apr: +8, eco: -5 }, cost: 1000, news: 'Lanzada una ayuda directa contra la inflación alimentaria.' },
      { text: 'Confiar en que la competencia de mercado autorregule los precios', stats: { apr: -8, eco: +2 }, news: 'Críticas por la pasividad ante la subida de los alimentos.' }
    ]
  },
  {
    id: 'NEWS_7',
    newspaper: 'CADENA SER',
    headline: 'OLA DE CALOR EXTREMA PROVOCA CORTES EN LA RED ELÉCTRICA',
    desc: 'El pico de consumo por aire acondicionado colapsa subestaciones y exige medidas de contingencia.',
    options: [
      { text: 'Aprobar compensaciones para los comercios e industrias afectados', stats: { eco: -3, apr: +4 }, cost: 400, news: 'El Ejecutivo aprueba ayudas inmediatas por el apagón eléctrico.' },
      { text: 'Pedir contención en el consumo eléctrico a familias y empresas', stats: { apr: -4, est: -2 }, news: 'Críticas de la oposición por falta de previsiones en la red eléctrica.' }
    ]
  },
  {
    id: 'NEWS_8',
    newspaper: 'elDiario.es',
    headline: 'INFORME REVELA BRECHA SALARIAL RECORD EN EMPRESAS COTIZADAS',
    desc: 'Los sueldos de los altos directivos duplican la media nacional mientras las clases bajas pierden poder adquisitivo.',
    options: [
      { text: 'Tramitar un tope a la retribución de directivos de empresas con contratos públicos', stats: { apr: +6, eco: -2, est: -3 }, news: 'Medida contra los sueldos millonarios desata malestar en el sector privado.' },
      { text: 'Recomendar buenas prácticas de responsabilidad corporativa sin imponer leyes', stats: { apr: -5, est: +2 }, news: 'Sindicatos acusan al Gobierno de tibieza frente a la brecha salarial.' }
    ]
  },
  {
    id: 'NEWS_9',
    newspaper: 'LA RAZÓN',
    headline: 'DESARTICULADA UNA CÉLULA DE CIBERDELINCUENCIA INTERNACIONAL EN MADRID',
    desc: 'Policía Nacional y Guardia Civil logran detener a una red que estafó millones a pequeñas empresas.',
    options: [
      { text: 'Felicitar públicamente a los cuerpos de seguridad e incrementar su partida de tecnología', stats: { con: +5, mil: +3, eco: -2 }, cost: 5, news: 'El Ministerio del Interior refuerza la unidad de ciberdelincuencia.' }
    ]
  },
  {
    id: 'NEWS_10',
    newspaper: 'EXPANSIÓN',
    headline: 'LA SUBIDA DE TIPOS DEL BCE ENFRÍA EL MERCADO INMOBILIARIO',
    desc: 'La firma de hipotecas cae un 20% y los analistas prevén un parón en la construcción de nueva vivienda.',
    options: [
      { text: 'Lanzar un plan de avales públicos para la compra de vivienda joven', stats: { apr: +6, eco: -4 }, cost: 800, news: 'Anunciados avales estatales para amortiguar el encarecimiento hipotecario.' },
      { text: 'Dejar que el mercado ajuste los precios de los inmuebles a la baja', stats: { eco: +3, apr: -4 }, news: 'Jóvenes e inquilinos lamentan la falta de medidas ante el crédito caro.' }
    ]
  },
  {
    id: 'NEWS_11',
    newspaper: 'OKDIARIO',
    headline: 'POLÉMICA POR LA CESIÓN DE UN EDIFICIO PÚBLICO A COLECTIVOS SOCIALES',
    desc: 'Sectores de la oposición denuncian trato de favor y adjudicación a dedo sin concurso transparente.',
    options: [
      { text: 'Revocar la concesión e iniciar un proceso de licitación pública', stats: { est: +3, apr: +2 }, news: 'El Ministerio rectifica y sacará a concurso el inmueble de la polémica.' },
      { text: 'Mantener la cesión respaldando la labor comunitaria del colectivo', stats: { apr: -4, est: -3 }, news: 'La oposición anuncia acciones legales por la cesión del edificio.' }
    ]
  },
  {
    id: 'NEWS_12',
    newspaper: 'THE OBJECTIVE',
    headline: 'EL DÉFICIT DE LAS PENSIONES SE DISPARA TRAS LA PAGA EXTRA',
    desc: 'La Seguridad Social necesita una inyección urgente del Tesoro para mantener el nivel de liquidez.',
    options: [
      { text: 'Transferir fondos de contingencia de las cuentas generales del Estado', stats: { eco: -5, est: +4 }, cost: 1500, news: 'Hacienda rescata las cuentas de las pensiones con fondos de contingencia.' },
      { text: 'Plantear un recargo temporal a las rentas salariales más elevadas', stats: { eco: -3, apr: -6, est: +2 }, news: 'Rechazo de las patronales ante la propuesta de elevar las cotizaciones.' }
    ]
  },
  {
    id: 'NEWS_13',
    newspaper: 'EL PAÍS',
    headline: 'ACUERDO HISTÓRICO PARA LA PROTECCIÓN DE LOS PARQUES NACIONALES',
    desc: 'El Gobierno y las Comunidades Autónomas firman un pacto para reforestar 50.000 hectáreas.',
    options: [
      { text: 'Financiar íntegramente el plan ambiental con fondos europeos', stats: { apr: +5, est: +3 }, news: 'Gran acogida social tras el acuerdo para la conservación de bosques.' }
    ]
  },
  {
    id: 'NEWS_14',
    newspaper: 'EL MUNDO',
    headline: 'PROTESTAS DE AGRICULTORES CONTRA EL PRECIO DEL AGUA DE REGADÍO',
    desc: 'Decenas de tractores cortan autovías en el Levante exigiendo tarifas reducidas para la cuenca.',
    options: [
      { text: 'Aprobar una tarifa plana reducida para el agua desalada', stats: { eco: -3, apr: +5 }, cost: 350, news: 'Los agricultores desconvocan las protestas tras la rebaja del agua.' },
      { text: 'Exigir el cumplimiento de los caudales ecológicos fijados por ley', stats: { apr: -5, est: -3 }, news: 'Crece la tensión en el campo por la falta de ayudas al regadío.' }
    ]
  },
  {
    id: 'NEWS_15',
    newspaper: 'ABC',
    headline: 'INCIDENTE DIPLOMÁTICO POR DECLARACIONES DE UN MINISTRO EN UN PODCAST',
    desc: 'El embajador de un país socio pide explicaciones por críticas a su modelo de gobernanza.',
    options: [
      { text: 'Emitir una nota oficial matizando las palabras del ministro', stats: { est: +2, apr: -2 }, news: 'Exteriores da por zanjado el choque diplomático con un comunicado.' },
      { text: 'Defender la libertad de expresión de los miembros del Gabinete', stats: { apr: +3, est: -5 }, news: 'Tensión diplomática al mantener el Gobierno la postura del ministro.' }
    ]
  },
  {
    id: 'NEWS_16',
    newspaper: 'LA VANGUARDIA',
    headline: 'EL SECTOR TEXTIL RECLAMA AYUDAS CONTRA LA COMPETENCIA ASIÁTICA',
    desc: 'Las fábricas locales advierten del riesgo de cierre por la entrada masiva de ropa ultra barata.',
    options: [
      { text: 'Aprobar un plan de modernización y aranceles a envíos individuales', stats: { eco: -2, apr: +4 }, cost: 250, news: 'Aprobadas ayudas a la industria textil para incentivar el consumo local.' },
      { text: 'Rechazar barreras comerciales por cumplir con la libertad de mercado', stats: { eco: +2, apr: -3 }, news: 'El sector textil critica la inacción estatal frente a las plataformas chinas.' }
    ]
  },
  {
    id: 'NEWS_17',
    newspaper: 'INFOLIBRE',
    headline: 'DENUNCIAN CONDICIONES PRECARIAS EN LAS RESIDENCIAS DE ANCIANOS',
    desc: 'Inspección de Trabajo detecta falta de personal de enfermería en más de 40 centros privados.',
    options: [
      { text: 'Multar severamente a los centros infractores y subir la ratio obligatoria', stats: { apr: +7, est: +2 }, news: 'Sanidad endurece las inspecciones en residencias de la tercera edad.' },
      { text: 'Conceder un plazo de adaptación sin sanciones económicas inmediatas', stats: { apr: -6, est: -2 }, news: 'Organizaciones de familiares critican la permisividad con las residencias.' }
    ]
  },
  {
    id: 'NEWS_18',
    newspaper: 'EL ECONOMISTA',
    headline: 'LA INVERSIÓN EXTRANJERA DIRECTA CAE UN 12% EN EL ÚLTIMO TRIMESTRE',
    desc: 'Los analistas señalan la incertidumbre regulatoria y la carga fiscal como factores clave.',
    options: [
      { text: 'Anunciar deducciones fiscales a proyectos de I+D de multinacionales', stats: { eco: +5, apr: -3 }, news: 'El Ministerio de Economía busca relanzar la atracción de capitales.' },
      { text: 'Desestimar los datos asegurando que la economía mantiene bases sólidas', stats: { eco: -2, apr: -3 }, news: 'Inversores piden certezas tras el freno del capital extranjero.' }
    ]
  },
  {
    id: 'NEWS_19',
    newspaper: 'CADENA SER',
    headline: 'SINDICATOS DOCENTES EXIGEN LA REDUCCIÓN DE ALUMNOS POR AULA',
    desc: 'Convocan huelga en la enseñanza pública para reclamar un máximo de 20 estudiantes por clase.',
    options: [
      { text: 'Comprometer la contratación de 5.000 nuevos profesores el próximo curso', stats: { apr: +8, eco: -6 }, cost: 1100, news: 'Educación desconvoca la huelga docente con una bajada de ratios.' },
      { text: 'Rechazar la propuesta alegando falta de margen en los presupuestos', stats: { apr: -7, est: -4 }, news: 'Paros en los colegios públicos tras el portazo de Educación.' }
    ]
  },
  {
    id: 'NEWS_20',
    newspaper: 'PÚBLICO',
    headline: 'JUEZ IMPUTA A EXALTOS CARGOS POR IRREGULARIDADES EN OBRAS PÚBLICAS',
    desc: 'Se investigan presuntas mordidas en la adjudicación de tramos ferroviarios hace una década.',
    options: [
      { text: 'Personar al Estado como acusación particular para recuperar lo defraudado', stats: { apr: +6, est: +3 }, news: 'El Gobierno se persona en la causa judicial de las obras ferroviarias.' },
      { text: 'Pedir prudencia y respetar la presunción de inocencia de los investigados', stats: { apr: -5, est: -2 }, news: 'Críticas de la oposición por falta de contundencia ante la corrupción.' }
    ]
  },
  {
    id: 'NEWS_21',
    newspaper: 'RTVE',
    headline: 'ESPAÑA LIDERA LA FABRICACIÓN DE VEHÍCULOS ELÉCTRICOS EN EUROPA',
    desc: 'Las multinacionales del motor aumentan la producción en las plantas nacionales.',
    options: [
      { text: 'Poner en marcha una campaña internacional de promoción de la marca país', stats: { eco: +4, apr: +3 }, cost: 100, news: 'El Gobierno potencia la industria del motor eléctrico español.' }
    ]
  },
  {
    id: 'NEWS_22',
    newspaper: 'EL CONFIDENCIAL',
    headline: 'SATURACIÓN EN LAS URGENCIAS HOSPITALARIAS POR EL BROTE DE GRIPE',
    desc: 'Los hospitales de varias comunidades autónomas rozan el colapso por falta de camas libres.',
    options: [
      { text: 'Habilitar un fondo de refuerzo sanitario de emergencia para contrataciones', stats: { apr: +7, eco: -4 }, cost: 600, news: 'Lanzadas ayudas de emergencia para reforzar las urgencias sanitarias.' },
      { text: 'Recordar que la competencia sanitaria corresponde a las Comunidades Autónomas', stats: { apr: -6, est: -3 }, news: 'Malestar en las autonomías por la falta de apoyo financiero estatal.' }
    ]
  },
  {
    id: 'NEWS_23',
    newspaper: 'LA RAZÓN',
    headline: 'ALERTA EN LA ARMADA POR LA OBSOLESCENCIA DE BUQUES PATRULLEROS',
    desc: 'Mandos militares advierten de problemas de cobertura en las aguas jurisdiccionales.',
    options: [
      { text: 'Aprobar la licitación urgente para construir dos nuevas corbetas', stats: { mil: +6, con: +4, eco: -5 }, cost: 900, news: 'Defensa encarga nuevos buques para renovar la flota naval.' },
      { text: 'Posponer la renovación naval al próximo ejercicio presupuestario', stats: { mil: -4, eco: +2 }, news: 'Preocupación en los mandos navales por el aplazamiento de las patrulleras.' }
    ]
  },
  {
    id: 'NEWS_24',
    newspaper: 'elDiario.es',
    headline: 'MULTA HISTÓRICA A MULTINACIONAL POR PUBLICIDAD ENGAÑOSA A CONSUMIDORES',
    desc: 'La Secretaría de Estado de Consumo impone una sanción ejemplar de 20 millones de euros.',
    options: [
      { text: 'Ratificar la multa y anunciar mayores controles en el comercio electrónico', stats: { apr: +6, eco: +2 }, news: 'Consumo muestra mano dura contra el fraude a los compradores.' }
    ]
  },
  {
    id: 'NEWS_25',
    newspaper: 'EL PAÍS',
    headline: 'EL PRECIO DE LA LUZ CAE A MÍNIMOS GRACIAS A LAS RENOVABLES',
    desc: 'La producción eólica y fotovoltaica cubre más del 70% de la demanda diaria nacional.',
    options: [
      { text: 'Presumir del éxito del plan de transición ecológica nacional', stats: { apr: +5, eco: +3 }, news: 'El Ministerio de Transición Ecológica celebra la bajada del recibo.' }
    ]
  },
  {
    id: 'NEWS_26',
    newspaper: 'EL MUNDO',
    headline: 'CONFLICTO COLECTIVO EN EL SECTOR DE LA HOSTELERÍA EN PLENA TEMPORADA',
    desc: 'Sindicatos amenazan con paros en verano si no se pacta una subida salarial del 5%.',
    options: [
      { text: 'Mediar entre patronal y sindicatos para lograr un pacto salarial razonable', stats: { est: +4, apr: +3 }, news: 'Trabajo logra sentar a hosteleros y sindicatos para evitar paros.' },
      { text: 'Evitar intervenir en un conflicto de negociación puramente privada', stats: { est: -4, apr: -4 }, news: 'Riesgo de huelga en la hostelería ante la inacción del Gobierno.' }
    ]
  },
  {
    id: 'NEWS_27',
    newspaper: 'ABC',
    headline: 'REVOLTOSOS PROVOCAN DISTURBIOS EN EL CENTRO DE UNA GRANDE CIUDAD',
    desc: 'Protestas radicales acaban con quema de contenedores y cargas policiales al caer la noche.',
    options: [
      { text: 'Reforzar la presencia policial y aplicar tolerancia cero con los vándalos', stats: { con: +6, apr: +3, est: +2 }, news: 'Interior despliega unidades antidisturbios tras los destrozos.' },
      { text: 'Llamar a la calma y pedir una investigación sobre la actuación policial', stats: { con: -5, apr: -4 }, news: 'Sindicatos policiales afean al Gobierno sus dudas sobre los agentes.' }
    ]
  },
  {
    id: 'NEWS_28',
    newspaper: 'LA VANGUARDIA',
    headline: 'EL AUMENTO DEL TURISMO DE CRUCEROS TENSA LOS PUERTOS MEDITERRÁNEOS',
    desc: 'Plataformas vecinales reclaman limitar la llegada simultánea de grandes buques turísticos.',
    options: [
      { text: 'Imponer una ecotasa portuaria a los pasajeros de cruceros', stats: { apr: +5, eco: +2 }, news: 'Aprobado un gravamen a los cruceros para mitigar su impacto medioambiental.' },
      { text: 'Rechazar limitaciones para no perjudicar la recaudación del sector comercial', stats: { eco: +3, apr: -5 }, news: 'Vecinos de las zonas portuarias anuncian marchas contra la masificación.' }
    ]
  },
  {
    id: 29,
    newspaper: 'EXPANSIÓN',
    headline: 'LA INFLACIÓN SUBYACENTE DA UN RESPIRO Y SE SITÚA EN EL 2,1%',
    desc: 'Los datos del INE muestran una clara estabilización en los costes de bienes y servicios.',
    options: [
      { text: 'Aprovechar la moderación del IPC para reducir impuestos indirectos', stats: { eco: +4, apr: +4 }, news: 'Economía atribuye la bajada de la inflación a sus medidas de contención.' }
    ]
  },
  {
    id: 'NEWS_30',
    newspaper: 'OKDIARIO',
    headline: 'GABINETE GASTA MÁS DE UN MILLÓN DE EUROS EN REFORMAR UNA SEDE MINISTERIAL',
    desc: 'Informaciones periodísticas critican la renovación de mobiliario en época de ajustes.',
    options: [
      { text: 'Justificar el gasto por razones de eficiencia energética y accesibilidad', stats: { apr: -3, est: -2 }, news: 'El Gobierno defiende la reforma de la sede por criterios de eficiencia.' },
      { text: 'Cancelar las obras no prioritarias y congelar el presupuesto de reformas', stats: { apr: +4, est: +2 }, news: 'Paralizadas las obras tras las críticas por el gasto de la sede.' }
    ]
  },
  {
    id: 'NEWS_31',
    newspaper: 'THE OBJECTIVE',
    headline: 'SABOTAJE EN UNA LÍNEA DE ALTA VELOCIDAD PROVOCA RETRASOS MASIVOS',
    desc: 'El robo de cable de cobre paraliza a decenas de trenes de pasajeros durante más de ocho horas.',
    options: [
      { text: 'Desplegar patrullas de la Guardia Civil para vigilar la infraestructura de vías', stats: { con: +5, eco: -2 }, cost: 150, news: 'Vigilancia reforzada en las líneas del AVE tras los robos de cable.' },
      { text: 'Exigir a la compañía ferroviaria responsabilidades en la seguridad de las vías', stats: { apr: -4, est: -2 }, news: 'Usuarios indignados por los retrasos y el cruce de acusaciones.' }
    ]
  },
  {
    id: 'NEWS_32',
    newspaper: 'VOZPÓPULI',
    headline: 'EL AUMENTO DE LA DEUDA DE LAS COMUNIDADES PREOCUPA A HACIENDA',
    desc: 'Tres autonomías incumplen las reglas de gasto e incrementan su volumen de endeudamiento.',
    options: [
      { text: 'Intervenir las cuentas autonómicas e imponer un plan de ajuste fiscal', stats: { est: +4, eco: +3, apr: -5 }, news: 'Hacienda exige planes de saneamiento a las autonomías descarriadas.' },
      { text: 'Flexibilizar los objetivos de déficit para no ahogar los servicios básicos', stats: { eco: -4, apr: +3 }, news: 'Hacienda da aire a las autonomías ampliando el margen de gasto.' }
    ]
  },
  {
    id: 'NEWS_33',
    newspaper: 'CADENA SER',
    headline: 'CRECE EL NÚMERO DE JÓVENES QUE NI ESTUDIAN NI TRABAJAN SEGUNDO EL INE',
    desc: 'La tasa de desempleo juvenil se estanca situando a España a la cabeza de la zona euro.',
    options: [
      { text: 'Lanzar un programa de empleo garantizado con prácticas tutorizadas', stats: { apr: +7, eco: -5 }, cost: 850, news: 'El Gobierno presenta un plan de choque contra el desempleo juvenil.' },
      { text: 'Confiar en que las becas de formación profesional absorban a los jóvenes', stats: { apr: -4, eco: +1 }, news: 'Expertos piden reformas estructurales para frenar el paro juvenil.' }
    ]
  },
  {
    id: 'NEWS_34',
    newspaper: 'elDiario.es',
    headline: 'DENUNCIAN VERTIDOS ILEGALES DE UNA PETROQUÍMICA EN UN RÍO NACIONAL',
    desc: 'Grupos ecologistas aportan análisis de agua con altos niveles de contaminantes pesados.',
    options: [
      { text: 'Clausurar cautelarmente la planta e iniciar expediente sancionador', stats: { apr: +6, eco: -3, est: +2 }, news: 'Medio Ambiente paraliza la actividad de la fábrica por los vertidos.' },
      { text: 'Dar un plazo de alegaciones a la empresa antes de adoptar medidas cautelares', stats: { apr: -6, est: -3 }, news: 'Colectivos ecologistas acusan al Ministerio de proteger a la papelera.' }
    ]
  },
  {
    id: 'NEWS_35',
    newspaper: 'EL PAÍS',
    headline: 'ESPAÑA CONSIGUE UN AUMENTO EN LOS FONDOS EUROPEOS PARA DIGITALIZACIÓN',
    desc: 'Bruselas aprueba el desembolso de una nueva partida económica tras verificar los hitos.',
    options: [
      { text: 'Destinar los fondos a la formación digital de pequeñas pymes y autónomos', stats: { eco: +6, apr: +4 }, news: 'El Plan Digital repartirá ayudas a la modernización de pequeñas pymes.' }
    ]
  },
  {
    id: 'NEWS_36',
    newspaper: 'EL MUNDO',
    headline: 'FUERTE RECHAZO VECINAL A LA INSTALACIÓN DE UN MACROPARQUE FOTOVOLTAICO',
    desc: 'Plataformas rurales denuncian la destrucción del paisaje y la pérdida de tierras agrícolas.',
    options: [
      { text: 'Paralizar la licencia e imponer mediación con las comunidades locales', stats: { apr: +5, eco: -2 }, news: 'Transición Ecológica revisará el proyecto fotovoltaico tras las quejas.' },
      { text: 'Mantener la tramitación priorizando los objetivos de generación limpia', stats: { eco: +4, apr: -6 }, news: 'Vecinos anuncian recursos judiciales contra la planta solar.' }
    ]
  },
  {
    id: 'NEWS_37',
    newspaper: 'ABC',
    headline: 'EL EJÉRCITO COLABORA EN EL EXTINCIÓN DE UN SEVERO INCENDIO FORESTAL',
    desc: 'La Unidad Militar de Emergencias se despliega para proteger varios municipios amenazados.',
    options: [
      { text: 'Felicitar el trabajo de la UME y prometer fondos para la reconstrucción', stats: { con: +5, apr: +4, eco: -2 }, cost: 5, news: 'El Gobierno promete ayudas inmediatas a las zonas devastadas por el fuego.' }
    ]
  },
  {
    id: 'NEWS_38',
    newspaper: 'LA VANGUARDIA',
    headline: 'CAOS EN EL AEROPUERTO POR UNA HUELGA DE TRABAJADORES DE EQUIPAJES',
    desc: 'Miles de maletas acumuladas y decenas de vuelos cancelados en plena operación salida.',
    options: [
      { text: 'Decretar servicios mínimos del 80% para desbloquear la operatividad', stats: { est: +5, apr: +2, con: -3 }, news: 'El Ministerio impone servicios mínimos para garantizar los vuelos.' },
      { text: 'Exigir a la gestora aeroportuaria un acuerdo rápido con los huelguistas', stats: { apr: -4, est: -4 }, news: 'Pasajeros atrapados critican el caos en las terminales aeroportuarias.' }
    ]
  },
  {
    id: 'NEWS_39',
    newspaper: 'RTVE',
    headline: 'EL TEATRO REAL Y EL MUSEO DEL PRADO BATTEN RÉCORD DE VISITANTES',
    desc: 'El turismo cultural experimenta un crecimiento del 18% posicionando a la capital.',
    options: [
      { text: 'Invertir en la restauración de monumentos en provincias con menos turismo', stats: { apr: +4, eco: +2 }, cost: 150, news: 'Cultura anuncia un plan de conservación del patrimonio histórico.' }
    ]
  },
  {
    id: 'NEWS_40',
    newspaper: 'EL CONFIDENCIAL',
    headline: 'HACIENDA INICIA UNA CAMPAÑA DE INSPECCIÓN SOBRE LAS CRIPTOMONEDAS',
    desc: 'La Agencia Tributaria envía miles de avisos a contribuyentes con activos digitales.',
    options: [
      { text: 'Aprobar la regulación para frenar el fraude en divisas digitales', stats: { eco: +4, est: +2 }, news: 'Hacienda intensifica la vigilancia sobre las ganancias en criptomonedas.' },
      { text: 'Reducir la presión sancionadora para no ahuyentar la innovación fintech', stats: { eco: -2, apr: -2 }, news: 'Asociaciones de inversores critican la persecución fiscal al sector cripto.' }
    ]
  },
  {
    id: 'NEWS_41',
    newspaper: 'LA RAZÓN',
    headline: 'PREOCUPANTE DESCENSO EN LAS VOCACIONES PARA LA POLICÍA Y GUARDIA CIVIL',
    desc: 'Las solicitudes de ingreso en las academias caen un 15% respecto al año anterior.',
    options: [
      { text: 'Aumentar las retribuciones de entrada y mejorar las condiciones laborales', stats: { con: +6, mil: +3, eco: -3 }, cost: 400, news: 'Interior aprueba una subida salarial para los nuevos agentes.' },
      { text: 'Mantener las escalas retributivas vigentes en la función pública', stats: { con: -4, eco: +1 }, news: 'Sindicatos de clase advierten del envejecimiento de las plantillas.' }
    ]
  },
  {
    id: 'NEWS_42',
    newspaper: 'elDiario.es',
    headline: 'INVESTIGAN A UNA CADENA DE SUPERMERCADOS POR ACAPARAMIENTO',
    desc: 'Se acusa a la distribuidora de retener productos básicos para elevar artificialmente los precios.',
    options: [
      { text: 'Abrir expediente sancionador a través de la Comisión de la Competencia', stats: { apr: +6, est: +2 }, news: 'Competencia investiga a la cadena por presunta alteración de precios.' },
      { text: 'Aguardar a la resolución de los informes técnicos antes de juzgar', stats: { apr: -5, est: -2 }, news: 'Consumidores critican la lentitud frente a las prácticas abusivas.' }
    ]
  },
  {
    id: 'NEWS_43',
    newspaper: 'EXPANSIÓN',
    headline: 'LA BANCA AUMENTA UN 25% SUS BENEFICIOS POR LA SUBIDA DE TIPOS',
    desc: 'Las principales entidades cotizadas registran resultados récord en el primer semestre.',
    options: [
      { text: 'Exigir que la banca traslade la subida de tipos a la remuneración de depósitos', stats: { apr: +7, eco: -2 }, news: 'El Ministerio presiona a las entidades para que paguen por los ahorros.' },
      { text: 'Respetar los márgenes del sector bancario para reforzar su solvencia', stats: { eco: +3, apr: -6 }, news: 'Críticas de la oposición ante los beneficios multimillonarios de la banca.' }
    ]
  },
  {
    id: 'NEWS_44',
    newspaper: 'CADENA SER',
    headline: 'CRECE EL USO DEL TRANSPORTE PÚBLICO TRAS LAS BONIFICACIONES',
    desc: 'Los viajes en trenes y autobuses crecen un 30% reduciendo el tráfico en los accesos urbanos.',
    options: [
      { text: 'Prorrogar las bonificaciones del transporte durante todo el año', stats: { apr: +8, eco: -6 }, cost: 1200, news: 'Prorrogados los descuentos en el abono de transporte público.' },
      { text: 'Retirar progresivamente las subvenciones para volver a la tarifa ordinaria', stats: { eco: +4, apr: -7 }, news: 'Usuarios protestan por el fin de las ayudas al abono de transporte.' }
    ]
  },
  {
    id: 'NEWS_45',
    newspaper: 'OKDIARIO',
    headline: 'REVELAN ERRORES EN LA TRAMITACIÓN DE UNA LEY ESTRELLA DEL GOBIERNO',
    desc: 'Un informe del Consejo de Estado señala vacíos legales que podrían generar indefensión.',
    options: [
      { text: 'Paralizar el trámite parlamentario y enmendar el texto legislativo', stats: { est: +4, apr: -2 }, news: 'El Gobierno retoca el proyecto de ley para subsanar los fallos señalados.' },
      { text: 'Someter la ley a votación tal como está desestimando el informe', stats: { apr: -6, est: -5 }, news: 'Duras críticas por la prisa en aprobar una norma con dudas jurídicas.' }
    ]
  },
  {
    id: 'NEWS_46',
    newspaper: 'THE OBJECTIVE',
    headline: 'EL DEFENSOR DEL PUEBLO ALERT DE RETRASOS EN LA CONCESIÓN DEL IMV',
    desc: 'Miles de familias en situación de vulnerabilidad esperan más de ocho meses para cobrar el subsidio.',
    options: [
      { text: 'Contratar personal de refuerzo urgente para agilizar los expedientes', stats: { apr: +6, eco: -3 }, cost: 200, news: 'Seguridad Social refuerza la plantilla para desbloquear el Ingreso Mínimo.' },
      { text: 'Atribuir la demora al elevado volumen de solicitudes fraudulentas', stats: { apr: -5, est: -3 }, news: 'Plataformas sociales tachan de insensible la respuesta oficial.' }
    ]
  },
  {
    id: 'NEWS_47',
    newspaper: 'EL PAÍS',
    headline: 'LA COMPRAVENTA DE COCHES ELÉCTRICOS CRECE A RITMO RECORD',
    desc: 'Las ayudas directas a la adquisición de vehículos limpios empiezan a dar sus frutos.',
    options: [
      { text: 'Ampliar la red de cargadores públicos en las principales autovías', stats: { eco: +3, apr: +4 }, cost: 300, news: 'Fomento invertirá en electrolineras públicas en toda la red vial.' }
    ]
  },
  {
    id: 'NEWS_48',
    newspaper: 'EL MUNDO',
    headline: 'JUECES ALERTAN DEL COLAPSO DE LOS JUZGADOS DE LO SOCIAL',
    desc: 'Los juicios por despido e impagos se señalan a dos años vista ante la falta de magistrados.',
    options: [
      { text: 'Crear 100 nuevas plazas de jueces y secretarios judiciales', stats: { est: +6, apr: +4, eco: -4 }, cost: 500, news: 'Justicia anuncia la creación de nuevas plazas para agilizar juicios.' },
      { text: 'Fomentar la mediación obligatoria antes de recurrir a la vía judicial', stats: { est: +2, apr: -3 }, news: 'Abogados expresan dudas sobre la eficacia de la mediación forzosa.' }
    ]
  },
  {
    id: 'NEWS_49',
    newspaper: 'ABC',
    headline: 'EL GOBIERNO FIRMA UN ACUERDO DE COOPERACIÓN CON PAÍSES DEL NORTE DE ÁFRICA',
    desc: 'Pacto bilateral para reforzar la lucha contra las mafias de la inmigración ilegal.',
    options: [
      { text: 'Destinar una partida de cooperación al desarrollo e infraestructura fronteriza', stats: { con: +5, mil: +3, eco: -4 }, cost: 600, news: 'Firmado el convenio internacional para el control migratorio.' }
    ]
  },
  {
    id: 'NEWS_50',
    newspaper: 'LA VANGUARDIA',
    headline: 'EL TURISMO DE SALUD CRECE Y ATRAE A CLIENTES DE ALTO PODER ADQUISITIVO',
    desc: 'Clínicas privadas españolas atienden a miles de pacientes extranjeros para tratamientos complejos.',
    options: [
      { text: 'Promocionar a España como destino médico internacional de referencia', stats: { eco: +4, apr: +2 }, news: 'El Ministerio apoya el crecimiento del turismo sanitario privado.' }
    ]
  },
  {
    id: 'NEWS_51',
    newspaper: 'INFOLIBRE',
    headline: 'DENUNCIAN EL AUMENTO DE CASOS DE TRABAJO A TIEMPO PARCIAL INVOLUNTARIO',
    desc: 'Sindicatos advierten que la pobreza laboral afecta especialmente a las mujeres jóvenes.',
    options: [
      { text: 'Inspeccionar a las empresas con alta tasa de contratos parciales sospechosos', stats: { apr: +6, est: +2 }, news: 'Trabajo perseguirá el uso fraudulento de la jornada parcial.' },
      { text: 'Confiar en la flexibilidad laboral para adaptar la demanda productiva', stats: { apr: -5, eco: +2 }, news: 'Sindicatos critican la inacción ante la precariedad salarial.' }
    ]
  },
  {
    id: 'NEWS_52',
    newspaper: 'EL ECONOMISTA',
    headline: 'EL PRECIO DEL M2 INDUSTRIAL ALCANZA MÁXIMOS EN LOS PRINCIPALES POLÍGONOS',
    desc: 'La escasez de suelo logístico frena la implantación de nuevos centros de distribución.',
    options: [
      { text: 'Liberar suelo público y agilizar las licencias urbanísticas industriales', stats: { eco: +6, apr: -2 }, news: 'Fomento facilita la creación de nuevos polígonos logísticos.' },
      { text: 'Priorizar la rehabilitación de naves abandonadas antes de urbanizar más', stats: { apr: +3, eco: +2 }, news: 'Empresarios consideran insuficiente el plan de reciclaje industrial.' }
    ]
  },
  {
    id: 'NEWS_53',
    newspaper: 'CADENA SER',
    headline: 'EXPOSICIÓN MASIVA DE DATOS PERSONALES POR UN FALLO EN UNA WEB OFICIAL',
    desc: 'La brecha de seguridad deja al descubierto miles de DNI de opositores durante horas.',
    options: [
      { text: 'Pedir disculpas públicas y encargar una auditoría de ciberseguridad', stats: { apr: -2, est: +3 }, news: 'El Ministerio corrige el fallo de seguridad y audita sus sistemas.' },
      { text: 'Minimizar el incidente alegando que los datos no fueron descargados', stats: { apr: -6, est: -3 }, news: 'Asociaciones de usuarios anuncian demandas por la filtración de datos.' }
    ]
  },
  {
    id: 'NEWS_54',
    newspaper: 'público',
    headline: 'ORGANIZACIONES ECOLÓGICAS EXIGEN CERRAR LAS GRANJAS DE PIEL DE VISÓN',
    desc: 'Alertan de riesgos sanitarios y de bienestar animal en las instalaciones existentes.',
    options: [
      { text: 'Prohibir la cría de animales para la industria peletera con indemnizaciones', stats: { apr: +6, eco: -2 }, cost: 150, news: 'El Gobierno aprueba el cierre progresivo de las granjas peleteras.' },
      { text: 'Mantener la actividad con inspecciones veterinarias reforzadas', stats: { apr: -4, est: +1 }, news: 'Protestas de colectivos ecologistas ante las granjas de visones.' }
    ]
  },
  {
    id: 'NEWS_55',
    newspaper: 'RTVE',
    headline: 'INVESTIGADORES ESPAÑOLES LOGRAN UN AVANCE CLAVE EN LA LUCHA CONTRA EL CÁNCER',
    desc: 'Un equipo del CSIC ensaya con éxito una terapia dirigida en modelos preclínicos.',
    options: [
      { text: 'Aumentar en 100 millones la partida presupuestaria para la ciencia pública', stats: { apr: +8, eco: -3 }, cost: 100, news: 'Inyección económica para el CSIC tras el hallazgo contra el cáncer.' }
    ]
  },
  {
    id: 'NEWS_56',
    newspaper: 'EL CONFIDENCIAL',
    headline: 'LA RECAUDACIÓN POR IVA SE DISPARA UN 8% POR EL CONSUMO TURÍSTICO',
    desc: 'Las arcas públicas reciben un balón de oxígeno gracias al gasto de los visitantes.',
    options: [
      { text: 'Destinar el exceso de recaudación a reducir el déficit del Estado', stats: { eco: +6, est: +3 }, news: 'Hacienda aprovecha la bonanza del IVA para sanear cuentas.' },
      { text: 'Bajar temporalmente los tipos del IVA en productos culturales y escolares', stats: { apr: +7, eco: -3 }, news: 'Rebajada la tasa del IVA para el material escolar y la cultura.' }
    ]
  },
  {
    id: 'NEWS_57',
    newspaper: 'LA RAZÓN',
    headline: 'POLÉMICA EN EL CONGRESO POR LA RETRIBUCIÓN DE LOS EXPRESIDENTES',
    desc: 'Iniciativa parlamentaria plantea suprimir la asignación de por vida a los antiguos jefes del Ejecutivo.',
    options: [
      { text: 'Apoyar la eliminación de la pensión vitalicia a expresidentes', stats: { apr: +8, est: -2 }, news: 'El Congreso aprueba estudiar el fin de las asignaciones a expresidentes.' },
      { text: 'Defender el estatus institucional del cargo y mantener las prestaciones', stats: { apr: -6, est: +2 }, news: 'El Ejecutivo mantiene las indemnizaciones a expresidentes.' }
    ]
  },
  {
    id: 'NEWS_58',
    newspaper: 'elDiario.es',
    headline: 'DENUNCIAN FALSOS AUTÓNOMOS EN EL SECTOR DE LAS EMPRESAS DE LOGÍSTICA',
    desc: 'Inspección de Trabajo multa a tres grandes plataformas por encubrir relaciones laborales.',
    options: [
      { text: 'Exigir la laboralización inmediata de todos los repartidores y chóferes', stats: { apr: +7, eco: -2 }, news: 'Mano dura de Trabajo contra los falsos autónomos en la logística.' },
      { text: 'Establecer un estatuto del trabajador autónomo digital con protecciones intermedias', stats: { eco: +3, apr: -4 }, news: 'Sindicatos rechazan la figura del autónomo digital regulado.' }
    ]
  },
  {
    id: 'NEWS_59',
    newspaper: 'EL PAÍS',
    headline: 'ACUERDO CON LAS AROLINEAS PARA REDUCIR LAS EMISIONES EN VUELOS INTERNOS',
    desc: 'Las compañías se comprometen a utilizar un 10% de combustible sostenible para 2030.',
    options: [
      { text: 'Subvencionar la compra de biocombustibles para la aviación comercial', stats: { apr: +4, eco: -3 }, cost: 200, news: 'El Gobierno acuerda ayudas para la descarbonización del sector aéreo.' }
    ]
  },
  {
    id: 'NEWS_60',
    newspaper: 'EL MUNDO',
    headline: 'EL PRECIO DEL ACEITE DE OLIVA SUBE UN 40% POR LA FALTA DE COSECHA',
    desc: 'La sequía reduce la producción a la mitad encareciendo un producto básico de la dieta.',
    options: [
      { text: 'Aprobar ayudas directas a los olivicultores golpeados por la sequía', stats: { apr: +6, eco: -3 }, cost: 400, news: 'Aprobado un paquete de ayudas para el sector del aceite de oliva.' },
      { text: 'Confiar en que las importaciones de terceros países estabilicen los precios', stats: { apr: -5, eco: +2 }, news: 'Agricultores critican la falta de apoyos ante la ruina de la cosecha.' }
    ]
  },
  {
    id: 'NEWS_61',
    newspaper: 'ABC',
    headline: 'INCIDENTE CON UN DRON NO IDENTIFICADO CERCA DE UN AEROPUERTO MILITAR',
    desc: 'El tráfico aéreo de la zona se interrumpe durante dos horas por razones de seguridad.',
    options: [
      { text: 'Adquirir sistemas anti-dron avanzadas para las bases aéreas', stats: { mil: +5, con: +3, eco: -2 }, cost: 180, news: 'Defensa refuerza la seguridad aérea con equipos inhibidores.' }
    ]
  },
  {
    id: 'NEWS_62',
    newspaper: 'LA VANGUARDIA',
    headline: 'PLANTEAN EXIMIR DEL IMPUESTO DE SUCESIONES A LAS PYMES FAMILIARES',
    desc: 'Asociaciones empresariales piden evitar el cierre de negocios en el relevo generacional.',
    options: [
      { text: 'Aprobar la exención fiscal para el traspaso familiar de pequeñas empresas', stats: { eco: +5, apr: +3 }, news: 'Hacienda exime del impuesto de sucesiones a los pequeños negocios.' },
      { text: 'Mantener la tributación para garantizar la equidad fiscal de las rentas', stats: { eco: -2, apr: -4 }, news: 'Empresarios lamentan la traba fiscal al relevo de las pymes.' }
    ]
  },
  {
    id: 'NEWS_63',
    newspaper: 'EXPANSIÓN',
    headline: 'EL MERCADO DE TRABAJO CREA 80.000 EMPLEOS EN EL MEJOR MES DEL AÑO',
    desc: 'La contratación indefinida lidera el crecimiento de la afiliación a la Seguridad Social.',
    options: [
      { text: 'Destacar las cifras de empleo como reflejo de las reformas aprobadas', stats: { apr: +6, eco: +4 }, news: 'El Gobierno presume de los datos récord de afiliación a la Seguridad Social.' }
    ]
  },
  {
    id: 'NEWS_64',
    newspaper: 'OKDIARIO',
    headline: 'CRÍTICAS POR EL VIAJE DE UNA DELEGACIÓN OFICIAL A UN FORO INTERNACIONAL',
    desc: 'Oposición tacha de excesiva la comitiva de más de 40 personas enviada al congreso.',
    options: [
      { text: 'Publicar el desglose detallado de los gastos del viaje oficial', stats: { est: +3, apr: +2 }, news: 'Transparencia publica las facturas de la comitiva internacional.' },
      { text: 'Defender la importancia diplomática de la representación nacional', stats: { apr: -4, est: -2 }, news: 'La oposición exige explicaciones por el coste de la comitiva.' }
    ]
  },
  {
    id: 'NEWS_65',
    newspaper: 'THE OBJECTIVE',
    headline: 'SABOTAJE EN LA RED DE FIBRA ÓPTICA DEJA SIN INTERNET A VARIAS COMARCAS',
    desc: 'Un corte intencionado de cables paraliza la actividad comercial y bancaria durante todo el día.',
    options: [
      { text: 'Declarar la fibra óptica como infraestructura crítica y reforzar la vigilancia', stats: { con: +4, eco: -2 }, cost: 120, news: 'El Estado eleva la protección de las redes de telecomunicaciones.' }
    ]
  },
  {
    id: 'NEWS_66',
    newspaper: 'CADENA SER',
    headline: 'AUMENTA LA DEMANDA DE ATENCIÓN EN SALUD MENTAL EN ADOLESCENTES',
    desc: 'Unidades de psiquiatría infantil alertan de listas de espera de más de seis meses.',
    options: [
      { text: 'Lanzar un Plan Nacional de Salud Mental Juvenil con más psicólogos', stats: { apr: +8, eco: -4 }, cost: 450, news: 'Sanidad crea 1.000 plazas de psicólogos para la red pública.' },
      { text: 'Coordinar recursos con los gabinetes de orientación de los colegios', stats: { apr: +2, eco: 0 }, news: 'Educación y Sanidad presentan una guía de prevención escolar.' }
    ]
  },
  {
    id: 'NEWS_67',
    newspaper: 'elDiario.es',
    headline: 'DENUNCIAN VERTIMIENTOS TÓXICOS DE UNA BUQUE CARGUERO EN AGUAS COSTERA',
    desc: 'Servicios de Guardacostas interceptan al buque tras la mancha detectada por satélite.',
    options: [
      { text: 'Retener el barco e imponer una fianza millonaria a la armadora', stats: { apr: +6, con: +3 }, news: 'Fomento inmoviliza al carguero infractor e impone una severa sanción.' }
    ]
  },
  {
    id: 'NEWS_68',
    newspaper: 'EL PAÍS',
    headline: 'LA PRODUCCIÓN CIENTÍFICA ESPAÑOLA AUMENTA UN 15% EN REVISTAS INTERNACIONALES',
    desc: 'Los grupos de investigación nacionales destacan en biomedicina y energías renovables.',
    options: [
      { text: 'Conceder un bono de consolidación a los jóvenes investigadores con proyección', stats: { apr: +5, eco: -2 }, cost: 100, news: 'Ciencia aprueba becas de retención de talento para jóvenes investigadores.' }
    ]
  },
  {
    id: 'NEWS_69',
    newspaper: 'EL MUNDO',
    headline: 'PROTESTA DE GANADEROS CONTRA EL AUMENTO DE ATAQUES DEL LOBO',
    desc: 'Asociaciones del norte peninsular reclaman sacar al cánido del catálogo de especies protegidas.',
    options: [
      { text: 'Permitir controles poblacionales del lobo en zonas con alta densidad', stats: { apr: +5, est: -3 }, news: 'Medio Ambiente autoriza extracciones controladas de lobos en el norte.' },
      { text: 'Incrementar las indemnizaciones por cabeza de ganado atacada', stats: { apr: -2, eco: -2 }, cost: 80, news: 'Ganaderos rechazan los cobros por bajas y exigen proteger sus explotaciones.' }
    ]
  },
  {
    id: 'NEWS_70',
    newspaper: 'ABC',
    headline: 'POLÉMICA POR LA RETIRADA DE MONUMENTOS HISTÓRICOS EN MUNICIPALIDADES',
    desc: 'Vecinos convocan concentraciones en contra de la eliminación de estatuas centenarias.',
    options: [
      { text: 'Crear un comité de expertos para evaluar el valor patrimonial antes de retirar', stats: { est: +3, apr: +2 }, news: 'Cultura frenará la retirada de estatuas hasta contar con informes técnicos.' },
      { text: 'Dejar la decisión en manos de las corporaciones municipales competentes', stats: { est: -3, apr: -3 }, news: 'Tensión en varios municipios por las actuaciones sobre el patrimonio.' }
    ]
  },
  {
    id: 'NEWS_71',
    newspaper: 'LA VANGUARDIA',
    headline: 'EL SECTOR DE LA MODA RECLAMA AYUDAS PARA LA DIGITALIZACIÓN DE TIENDAS',
    desc: 'Comerciantes de barrio sufren el desvío de las ventas hacia plataformas de venta online.',
    options: [
      { text: 'Conceder cheques de digitalización para el pequeño comercio urbano', stats: { eco: +3, apr: +4 }, cost: 200, news: 'Lanzadas ayudas directas para la venta online del pequeño comercio.' }
    ]
  },
  {
    id: 'NEWS_72',
    newspaper: 'RTVE',
    headline: 'ESPAÑA ES ELEGIDA SEDE PARA LA PRÓXIMA CUMBRE MUNDIAL SOBRE EL CLIMA',
    desc: 'Representantes de más de 180 países se darán cita en Madrid para negociar acuerdos climáticos.',
    options: [
      { text: 'Organizar la cumbre destacando la posición de liderazgo en renovables', stats: { apr: +6, est: +3 }, cost: 120, news: 'El Gobierno celebra la designación de España como sede climática.' }
    ]
  },
  {
    id: 'NEWS_73',
    newspaper: 'EL CONFIDENCIAL',
    headline: 'EL AUMENTO DE ALQUILERES TURÍSTICOS LLEGA A LAS CIUDADES DE SEGUNDO ORDEN',
    desc: 'Capitales de provincia experimentan subidas del 15% en los precios del arrendamiento residencial.',
    options: [
      { text: 'Extender la Ley de Vivienda a todas las capitales con precios tensionados', stats: { apr: +6, eco: -3 }, news: 'Vivienda aplicará topes de alquiler en más de veinte ciudades.' },
      { text: 'Incentivar la oferta privada reduciendo el IRPF a los arrendadores', stats: { eco: +3, apr: -4 }, news: 'Propietarios aplauden las reducciones fiscales para el alquiler.' }
    ]
  },
  {
    id: 'NEWS_74',
    newspaper: 'LA RAZÓN',
    headline: 'SINDICATOS POLICIALES EXIGEN MÁS CHALECOS Y MEDIOS DE PROTECCIÓN',
    desc: 'Denuncian que muchos agentes deben compartir material defensivo durante los turnos.',
    options: [
      { text: 'Aprobar una partida urgente para la compra de chalecos individuales', stats: { con: +6, mil: +3 }, cost: 150, news: 'Interior equipará a todos los agentes con chalecos de protección personal.' }
    ]
  },
  {
    id: 'NEWS_75',
    newspaper: 'elDiario.es',
    headline: 'INVESTIGAN A UN FONDO DE INVERSIÓN POR COMPRA MASIVA DE VIVIENDAS PROTEGIDAS',
    desc: 'Organizaciones de inquilinos acusan al fondo de elevar los precios tras la adquisición.',
    options: [
      { text: 'Bloquear la venta de VPO a fondos de inversión mediante reforma legal', stats: { apr: +7, eco: -2 }, news: 'El Gobierno blindará las viviendas públicas frente a fondos buitre.' },
      { text: 'Revisar únicamente las condiciones de los contratos celebrados', stats: { apr: -4, est: -2 }, news: 'Críticas por no prohibir de forma tajante las ventas a fondos.' }
    ]
  },
  {
    id: 'NEWS_76',
    newspaper: 'EXPANSIÓN',
    headline: 'EL CONSUMO DE HOGARES CRECE UN 2,8% IMPULSADO POR LA SUBIDA SALARIAL',
    desc: 'Los indicadores de ventas en grandes superficies reflejan la reactivación del comercio.',
    options: [
      { text: 'Destacar que la mejora salarial dinamiza la demanda interna nacional', stats: { apr: +5, eco: +4 }, news: 'Economía relaciona el crecimiento del consumo con la mejora salarial.' }
    ]
  },
  {
    id: 'NEWS_77',
    newspaper: 'OKDIARIO',
    headline: 'INSPECTORES DE TRABAJO DENUNCIAN FALTA DE EFECTIVOS EN LAS PROVINCIAS',
    desc: 'Aseguran que no pueden dar abasto ante el aumento de expedientes de fraude salarial.',
    options: [
      { text: 'Convocatoria extraordinaria de 300 plazas de inspectores de trabajo', stats: { apr: +5, eco: -2 }, cost: 100, news: 'Trabajo reforzará la plantilla de la Inspección con nuevas plazas.' },
      { text: 'Reorganizar el personal existente priorizando las grandes empresas', stats: { apr: -3, est: -2 }, news: 'Sindicatos de la Inspección consideran insuficiente la reorganización.' }
    ]
  },
  {
    id: 'NEWS_78',
    newspaper: 'THE OBJECTIVE',
    headline: 'FALTAS DE PROFESORES DE CIENCIAS EN LOS INSTITUTOS DE SECUNDARIA',
    desc: 'Decenas de aulas permanecen semanas sin docentes de matemáticas o física por falta de bolsa.',
    options: [
      { text: 'Permitir el acceso a la docencia a graduados sin el máster de formación', stats: { apr: +3, est: -3 }, news: 'Educación flexibiliza los requisitos para cubrir vacantes de ciencias.' },
      { text: 'Aumentar el complemento salarial para las especialidades deficitarias', stats: { apr: +5, eco: -3 }, cost: 120, news: 'Creado un incentivo para atraer profesores a las materias de ciencias.' }
    ]
  },
  {
    id: 'NEWS_79',
    newspaper: 'CADENA SER',
    headline: 'EL NÚMERO DE PERSONAS EN RIESGO DE POBREZA CAE DOS PUNTOS',
    desc: 'El informe de condiciones de vida del INE refleja el impacto de las prestaciones sociales.',
    options: [
      { text: 'Atribuir la mejora al incremento del SMI y las ayudas públicas', stats: { apr: +6, eco: +2 }, news: 'El Ministerio destaca la reducción de la pobreza como logro clave.' }
    ]
  },
  {
    id: 'NEWS_80',
    newspaper: 'EL PAÍS',
    headline: 'ESPAÑA SUPERA A FRANCIA EN PRODUCCIÓN DE ENERGÍA SOLAR FOTOVOLTAICA',
    desc: 'Los nuevos parques solares consolida el liderazgo del país en el sur de Europa.',
    options: [
      { text: 'Fomentar la instalación de baterías industriales para almacenar los excedentes', stats: { eco: +4, apr: +3 }, cost: 350, news: 'El Gobierno subvencionará baterías masivas para la red fotovoltaica.' }
    ]
  },
  {
    id: 'NEWS_81',
    newspaper: 'EL MUNDO',
    headline: 'TENSIONES ENTRE SANIDAD Y LAS COMUNIDADES POR EL REPARTO DE FÁRMACOS',
    desc: 'Varias regiones protestan por el retraso en la llegada de medicamentos de alto coste.',
    options: [
      { text: 'Crear un fondo centralizado para la compra de fármacos oncológicos', stats: { apr: +6, eco: -4 }, cost: 500, news: 'Sanidad crea una partida central para financiar fármacos complejos.' },
      { text: 'Instar a las autonomías a gestionar sus presupuestos farmacéuticos', stats: { apr: -5, est: -3 }, news: 'Las autonomías acusan al Ministerio de eludir responsabilidades.' }
    ]
  },
  {
    id: 'NEWS_82',
    newspaper: 'ABC',
    headline: 'SECTOR EDITORIAL ADVIERTE DE LA CAÍDA DE VENTAS EN LIBRERÍAS DE BARRIO',
    desc: 'El auge del libro electrónico y las compras online perjudica al comercio cultural tradicional.',
    options: [
      { text: 'Lanzar un Bono Libro para compras exclusivas en librerías independientes', stats: { apr: +5, eco: -2 }, cost: 80, news: 'Cultura crea el Bono Libro para dinamizar las librerías locales.' }
    ]
  },
  {
    id: 'NEWS_83',
    newspaper: 'LA VANGUARDIA',
    headline: 'EL AUMENTO DE FRECUENCIAS DEL AVE MULTIPLICA EL TRÁFICO DE PASAJEROS',
    desc: 'La entrada de nuevos operadores de trenes abarata los billetes entre las grandes ciudades.',
    options: [
      { text: 'Celebrar la liberalización ferroviaria como modelo de éxito en la movilidad', stats: { eco: +5, apr: +4 }, news: 'Fomento destaca la bajada del billete de AVE gracias a la competencia.' }
    ]
  },
  {
    id: 'NEWS_84',
    newspaper: 'INFOLIBRE',
    headline: 'ALERTA POR EL INCREMENTO DE APUESTAS DEPORTIVAS ENTRE MENORES DE EDAD',
    desc: 'Asociaciones de padres piden bloquear las aplicaciones en las proximidades de colegios.',
    options: [
      { text: 'Exigir verificación por DNI electrónico y geolocalización a las casas de apuestas', stats: { apr: +7, est: +2 }, news: 'Consumo impone férreos controles de edad a las plataformas de apuestas.' },
      { text: 'Reforzar las campañas de concienciación en los centros educativos', stats: { apr: +3, eco: 0 }, news: 'Educación lanza charlas sobre los riesgos del juego en adolescentes.' }
    ]
  },
  {
    id: 'NEWS_85',
    newspaper: 'EL ECONOMISTA',
    headline: 'LA DÉCIMA FERIA DE STARTUPS ATRAE A MÁS DE 500 INVERSORES EN MADRID',
    desc: 'Empresas tecnológicas españolas captan más de 300 millones de euros en rondas de financiación.',
    options: [
      { text: 'Facilitar la tramitación de visados para trabajadores altamente cualificados', stats: { eco: +5, apr: +2 }, news: 'El Gobierno agilizará las autorizaciones para talento tecnológico.' }
    ]
  },
  {
    id: 'NEWS_86',
    newspaper: 'CADENA SER',
    headline: 'CRECE LA ADOPCIÓN DE ANIMALES TRAS LA ENTRADA EN VIGOR DE LA LEY DE BIENESTAR',
    desc: 'Las protectoras destacan una reducción del 15% en las cifras de abandono de perros y gatos.',
    options: [
      { text: 'Aumentar las subvenciones a los refugios y protectoras municipales', stats: { apr: +6, eco: -2 }, cost: 60, news: 'Derechos de los Animales destinará fondos a la red de refugios.' }
    ]
  },
  {
    id: 'NEWS_87',
    newspaper: 'público',
    headline: 'SINDICATOS DENUNCIAN EL USO DE ALGORITMOS PARA EVALUAR A LOS TRABAJADORES',
    desc: 'Aseguran que algunas empresas aplican despidos automáticos basados en datos de rendimiento.',
    options: [
      { text: 'Prohibir las decisiones de despido automatizadas sin revisión humana obligatoria', stats: { apr: +7, est: +2 }, news: 'Trabajo sancionará el uso de algoritmos para ejecutar despidos.' },
      { text: 'Estudiar la creación de un marco ético voluntario para la inteligencia artificial', stats: { apr: -4, eco: +2 }, news: 'Sindicatos critican la falta de regulación sobre la IA en el trabajo.' }
    ]
  },
  {
    id: 'NEWS_88',
    newspaper: 'RTVE',
    headline: 'EL PUERTO DE VALENCIA REGISTRA UN AUMENTO EN EL TRÁFICO DE CONTENEDORES',
    desc: 'Se consolida como la principal puerta de entrada del comercio marítimo en el Mediterráneo.',
    options: [
      { text: 'Aprobar la ampliación norte del puerto con medidas de amortiguación ambiental', stats: { eco: +6, apr: -3 }, cost: 400, news: 'Aprobada la inversión para la expansión del Puerto de Valencia.' }
    ]
  },
  {
    id: 'NEWS_89',
    newspaper: 'EL CONFIDENCIAL',
    headline: 'ALERTA EN EL SECTOR AÍSLA POR EL ENCARECIMIENTO DE LA MADERA Y EL ACERO',
    desc: 'Constructoras advierten del riesgo de paralización de obras públicas de infraestructura.',
    options: [
      { text: 'Permitir la revisión de precios en las licitaciones de obras del Estado', stats: { eco: -4, est: +4 }, cost: 600, news: 'Fomento actualizará los contratos de obra para evitar suspensiones.' },
      { text: 'Exigir a las adjudicatarias el cumplimiento de las condiciones pactadas', stats: { eco: +2, est: -5 }, news: 'Empresas amenazan con abandonar las obras públicas por sobrecostes.' }
    ]
  },
  {
    id: 'NEWS_90',
    newspaper: 'LA RAZÓN',
    headline: 'EXIGEN UN PLAN NACIONAL CONTRA EL ROBO EN EXPLOTACIONES AGRÍCOLAS',
    desc: 'Sustracciones de maquinaria y cosechas generan pérdidas millonarias en el campo.',
    options: [
      { text: 'Desplegar equipos ROCA de la Guardia Civil dedicados en exclusiva al campo', stats: { con: +6, mil: +3, eco: -2 }, cost: 150, news: 'Reforzada la presencia de la Guardia Civil en comarcas agrarias.' }
    ]
  },
  {
    id: 'NEWS_91',
    newspaper: 'elDiario.es',
    headline: 'REVELAN QUE TRES MULTINACIONALES ELUDÍAN IMPUESTOS MEDIANTE FILIALES',
    desc: 'Auditoría de Hacienda descubre maniobras de precios de transferencia no declaradas.',
    options: [
      { text: 'Exigir la devolución inmediata del dinero con un recargo del 50%', stats: { apr: +7, eco: +4 }, news: 'Hacienda reclama 150 millones a las multinacionales por elusión fiscal.' }
    ]
  },
  {
    id: 'NEWS_92',
    newspaper: 'EL PAÍS',
    headline: 'NUEVO TRATADO DE LIBRE COMERCIO CON PAÍSES DE AMÉRICA LATINA',
    desc: 'Facilitará la exportación de productos industriales españoles sin aranceles.',
    options: [
      { text: 'Celebrar el pacto comercial destacando las oportunidades exportadoras', stats: { eco: +5, apr: +3 }, news: 'El Ministerio de Comercio valora la apertura del mercado americano.' }
    ]
  },
  {
    id: 'NEWS_93',
    newspaper: 'EL MUNDO',
    headline: 'CORTES DE TRÁFICO POR PROTESTAS CONTRA LA IMPLANTACIÓN DE LA ZBE',
    desc: 'Conductores se movilizan contra las restricciones de circulación a coches sin etiqueta.',
    options: [
      { text: 'Crear una línea de subvenciones para achatarrar los vehículos más viejos', stats: { apr: +5, eco: -3 }, cost: 300, news: 'Anunciadas ayudas directas para cambiar los vehículos sin etiqueta.' },
      { text: 'Respaldar las Zonas de Bajas Emisiones para cumplir las normas medioambientales', stats: { apr: -5, est: -2 }, news: 'El Ejecutivo mantiene las restricciones a los coches contaminantes.' }
    ]
  },
  {
    id: 'NEWS_94',
    newspaper: 'ABC',
    headline: 'EL CONSEJO DE ESTADO AVALA LA REFORMA DE LA LEY DE RETRIBUCIONES JUDICIALES',
    desc: 'El informe da luz verde al incremento salarial acordado con las asociaciones de jueces.',
    options: [
      { text: 'Aprobar la subida salarial para garantizar la paz en la Administración de Justicia', stats: { est: +5, eco: -3 }, cost: 90, news: 'Justicia ratifica la mejora retributiva de jueces y fiscales.' }
    ]
  },
  {
    id: 'NEWS_95',
    newspaper: 'LA VANGUARDIA',
    headline: 'EL TURISMO RURAL ALCANZA UNA OCUPACIÓN DEL 85% DURANTE EL PUENTE',
    desc: 'Las comarcas del interior registran niveles de ocupación sin precedentes en la temporada.',
    options: [
      { text: 'Aumentar la inversión en la red de caminos y patrimonio de pueblos pequeños', stats: { apr: +5, eco: +2 }, cost: 100, news: 'Turismo destinará fondos a dinamizar los destinos de interior.' }
    ]
  },
  {
    id: 'NEWS_96',
    newspaper: 'EXPANSIÓN',
    headline: 'LAS EXPORTACIONES DE BIENES TECNOLÓGICOS CRECEN UN 12%',
    desc: 'Componentes electrónicos y software nacional ganan cuota de mercado en el exterior.',
    options: [
      { text: 'Impulsar la presencia de empresas tecnológicas en ferias internacionales', stats: { eco: +4, apr: +2 }, cost: 80, news: 'Comercio apoyará la internacionalización del sector tecnológico.' }
    ]
  },
  {
    id: 'NEWS_97',
    newspaper: 'OKDIARIO',
    headline: 'POLÉMICA POR LA ADJUDICACIÓN DE UN CONTRATO DE MANTENIMIENTO EN DEFENSA',
    desc: 'Un grupo rival denuncia irregularidades en los pliegos de condiciones de la licitación.',
    options: [
      { text: 'Suspender la licitación y encargar un informe a la Abogacía del Estado', stats: { est: +3, apr: +2 }, news: 'Defensa paraliza el contrato para revisar los pliegos tras la denuncia.' },
      { text: 'Mantener la adjudicación alegando necesidades operativas militares', stats: { apr: -5, mil: -2 }, news: 'La oposición exige comparecencias por la adjudicación militar.' }
    ]
  },
  {
    id: 'NEWS_98',
    newspaper: 'THE OBJECTIVE',
    headline: 'CRECE EL NÚMERO DE JUBILACIONES ANTICIPADAS EN LA INDUSTRIA PESADA',
    desc: 'Sindicatos piden flexibilizar los coeficientes reductores para los trabajos penosos.',
    options: [
      { text: 'Reconocer coeficientes reductores para los sectores industriales más penosos', stats: { apr: +6, eco: -4 }, news: 'Seguridad Social permitirá la jubilación anticipada en actividades penosas.' },
      { text: 'Incentivar la prolongación de la vida laboral mediante bonificaciones', stats: { eco: +3, apr: -5 }, news: 'Sindicatos critican el desinterés por la penosidad en la industria.' }
    ]
  },
  {
    id: 'NEWS_99',
    newspaper: 'CADENA SER',
    headline: 'LA RED DE BIBLIOTECAS PÚBLICAS RECLAMA UN PLAN DE ACTUALIZACIÓN',
    desc: 'Solicitan fondos para adquirir licencias de libros electrónicos y renovar equipamientos.',
    options: [
      { text: 'Destinar 30 millones de euros a la compra de catálogo digital para bibliotecas', stats: { apr: +5, eco: -1 }, cost: 30, news: 'Cultura financiará la ampliación del catálogo de e-books públicos.' }
    ]
  },
  {
    id: 'NEWS_100',
    newspaper: 'elDiario.es',
    headline: 'DENUNCIAN ELUSIÓN DE IMPUESTOS EN PLATAFORMAS DE APARTAMENTOS TURÍSTICOS',
    desc: 'Hacienda detecta miles de anuncios sin la obligatoria referencia catastral declarada.',
    options: [
      { text: 'Obligar a las plataformas a retener el IRPF directamente a los anfitriones', stats: { apr: +6, eco: +3 }, news: 'Hacienda exigirá a las webs de alquiler turistico la retención directa.' }
    ]
  },
  {
    id: 'NEWS_101',
    newspaper: 'EL PAÍS',
    headline: 'ESPAÑA SE UNE AL PROYECTO EUROPEO DE SUPERCOMPUTACIÓN',
    desc: 'Se instalará un nuevo nodo de procesamiento de datos en el Barcelona Supercomputing Center.',
    options: [
      { text: 'Financiar el 50% del proyecto con fondos para la transformación digital', stats: { eco: +5, apr: +3 }, cost: 200, news: 'Aprobada la aportación estatal para el supercomputador europeo.' }
    ]
  },
  {
    id: 'NEWS_102',
    newspaper: 'EL MUNDO',
    headline: 'SINDICATOS DE TRANSPORTE AMENAZAN CON PAROS EN LOS FERROCARRILES',
    desc: 'Reclaman la homologación salarial y el aumento de las plantillas de mantenimiento.',
    options: [
      { text: 'Firmar el convenio colectivo con una subida salarial progresiva a tres años', stats: { est: +5, apr: +3, eco: -3 }, cost: 300, news: 'Transportes cierra el acuerdo salarial y desconvoca los paros ferroviarios.' },
      { text: 'Resistir la presión sindical alegando moderación en el gasto público', stats: { est: -5, apr: -4 }, news: 'Convocados paros de trenes ante la falta de pacto salarial.' }
    ]
  },
  {
    id: 'NEWS_103',
    newspaper: 'ABC',
    headline: 'EL AUMENTO DE LA CIBERDELINCUENCIA SUPONE EL 20% DE LOS DELITOS',
    desc: 'El balance de criminalidad refleja un desplazamiento de los hurtos hacia los fraudes online.',
    options: [
      { text: 'Lanzar una campaña nacional de prevención contra las estafas telefónicas', stats: { con: +4, apr: +3 }, cost: 50, news: 'Interior inicia una campaña informativa contra las estafas virtuales.' }
    ]
  },
  {
    id: 'NEWS_104',
    newspaper: 'LA VANGUARDIA',
    headline: 'LA CONSTRUCCIÓN EN MADERA MACIZA GANA TERRENO EN LA ARQUITECTURA',
    desc: 'Nuevos edificios sostenibles reducen un 40% la huella de carbono de la edificación.',
    options: [
      { text: 'Incentivar el uso de materiales de baja huella ecológica en la licitación pública', stats: { apr: +5, eco: +2 }, news: 'Fomento primará los materiales sostenibles en los edificios del Estado.' }
    ]
  },
  {
    id: 'NEWS_105',
    newspaper: 'INFOLIBRE',
    headline: 'DENUNCIAN DESPIDOS DISCRIMINATORIOS TRAS SOLICITAR BAJAS POR MATERNIDAD',
    desc: 'Sindicatos llevan ante la Fiscalía casos de discriminación laboral en pymes.',
    options: [
      { text: 'Endurecer las inspecciones y elevar las sanciones por discriminación de género', stats: { apr: +7, est: +2 }, news: 'Trabajo sancionará de forma ejemplar los despidos por maternidad.' }
    ]
  },
  {
    id: 'NEWS_106',
    newspaper: 'EL ECONOMISTA',
    headline: 'LA INVERSIÓN EN CAPITAL RIESGO ALCANZA UN NUEVO RECORD NACIONAL',
    desc: 'Fondos internacionales invierten en empresas emergentes de biotecnología y logística.',
    options: [
      { text: 'Agilizar los incentivos fiscales previstos en la Ley de Startups', stats: { eco: +5, apr: +2 }, news: 'Economía facilita los trámites para las inversiones de capital riesgo.' }
    ]
  },
  {
    id: 'NEWS_107',
    newspaper: 'CADENA SER',
    headline: 'LA RED DE CENTROS DE SALUD MENTAL ATIENDE A MÁS DE UN MILLÓN DE PERSONAS',
    desc: 'Asociaciones médicas reclaman doblar el número de especialistas para reducir demoras.',
    options: [
      { text: 'Aprobar la incorporación prioritaria de 500 psiquiatras y psicólogos al SNS', stats: { apr: +7, eco: -3 }, cost: 350, news: 'Sanidad reforzará las áreas de salud mental en la atención primaria.' }
    ]
  },
  {
    id: 'NEWS_108',
    newspaper: 'público',
    headline: 'RECLAMAN LA PROHIBICIÓN DE LOS PLAGUICIDAS MÁS NOCIVOS PARA LAS ABEJAS',
    desc: 'Apicultores advierten del colapso de las colmenas y la pérdida de polinización.',
    options: [
      { text: 'Prohibir los insecticidas neonicotinoides siguiendo las recomendaciones científicas', stats: { apr: +6, eco: -2 }, news: 'Agricultura retira del mercado los plaguicidas peligrosos para las abejas.' },
      { text: 'Conceder moratorias a los agricultores para la sustitución de productos', stats: { apr: -4, est: +1 }, news: 'Ecologistas protestan por la moratoria en el uso de insecticidas.' }
    ]
  },
  {
    id: 'NEWS_109',
    newspaper: 'RTVE',
    headline: 'EL SECTOR DEL CINE ALCANZA SU MEJOR DATO DE RECAUDACIÓN EN DÉCADAS',
    desc: 'Las películas nacionales superan el 25% de la cuota de pantalla en las salas comerciales.',
    options: [
      { text: 'Mantener las lógicas de incentivo fiscal a las producciones cinematográficas', stats: { apr: +5, eco: +2 }, news: 'Cultura celebra el éxito del cine español y ratifica las ayudas.' }
    ]
  },
  {
    id: 'NEWS_110',
    newspaper: 'EL CONFIDENCIAL',
    headline: 'LA DEUDA FAMILIAR CAE A NIVELES PREVIOS A LA CRISIS FINANCIERA',
    desc: 'El desendeudamiento de los hogares mejora la capacidad de resistencia ante crisis.',
    options: [
      { text: 'Destacar la responsabilidad financiera de las familias como signo de solidez', stats: { apr: +4, eco: +3 }, news: 'Economía valora positivamente la reducción de la deuda familiar.' }
    ]
  },
  {
    id: 'NEWS_111',
    newspaper: 'LA RAZÓN',
    headline: 'ALERTAN DEL AUMENTO DE CASOS DE OCUPACIÓN DE LOCALES COMERCIALES',
    desc: 'Asociaciones de comerciantes piden agilizar los juicios para recuperar la posesión.',
    options: [
      { text: 'Promover un protocolo policial para el desalojo rápido de locales comerciales', stats: { con: +6, apr: +4, est: +2 }, news: 'Interior aprueba un procedimiento agilizado para recuperar inmuebles.' },
      { text: 'Remitir las denuncias al cauce judicial ordinario sin protocolos especiales', stats: { apr: -5, est: -3 }, news: 'Comerciantes critican la falta de soluciones ante la ocupación de locales.' }
    ]
  },
  {
    id: 'NEWS_112',
    newspaper: 'elDiario.es',
    headline: 'INVESTIGAN A DOS GRANDES EMPRESAS POR PACTAR PRECIOS EN LICITACIONES',
    desc: 'La CNMC abre expediente por presunta constitución de un cártel en servicios de limpieza.',
    options: [
      { text: 'Prohibir la contratación pública a las empresas sancionadas por la CNMC', stats: { apr: +7, est: +3 }, news: 'El Estado vetará en sus contratos a las empresas que pacten precios.' }
    ]
  },
  {
    id: 'NEWS_113',
    newspaper: 'EL PAÍS',
    headline: 'EL PROGRAMA DE BECAS DE MOVILIDAD INTERNACIONAL SUPERA LOS 50.000 BENEFICIARIOS',
    desc: 'Estudiantes de universidades públicas realizan estancias académicas en el extranjero.',
    options: [
      { text: 'Aumentar la cuantía individual de la beca para cubrir el coste de vida', stats: { apr: +6, eco: -3 }, cost: 150, news: 'Educación incrementará la dotación mensual de las becas internacionales.' }
    ]
  },
  {
    id: 'NEWS_114',
    newspaper: 'EL MUNDO',
    headline: 'NUEVAS TENSIONES ENTRE SINDICATOS Y PATRONAL POR EL SUBSIDIO DE DESEMPLEO',
    desc: 'Discrepancias sobre los tramos de cuantía y la obligación de aceptar ofertas de trabajo.',
    options: [
      { text: 'Aprobar la reforma del subsidio garantizando el 80% del IPREM los primeros meses', stats: { apr: +6, eco: -3 }, news: 'Aprobada la reforma del subsidio con el respaldo de los sindicatos.' },
      { text: 'Condicionar el cobro de la prestación a la aceptación inmediata de cursos', stats: { eco: +3, apr: -5 }, news: 'Sindicatos rechazan el modelo de penalizaciones en el subsidio.' }
    ]
  },
  {
    id: 'NEWS_115',
    newspaper: 'ABC',
    headline: 'EL CENTRO DE ADIESTRAMIENTO MILITAR ACOGE UN EJERCICIO CONJUNTO DE LA OTAN',
    desc: 'Más de 3.000 efectivos de diez países aliados participan en maniobras tácticas.',
    options: [
      { text: 'Destacar el compromiso de España con la seguridad atlántica y europea', stats: { mil: +5, con: +3 }, news: 'Defensa valora el éxito del ejercicio conjunto de la OTAN.' }
    ]
  },
  {
    id: 'NEWS_116',
    newspaper: 'LA VANGUARDIA',
    headline: 'LA CONEXIÓN DE REDES HÍDRICAS PERMITE ENVIAR AGUA A ZONAS EN SEQUÍA',
    desc: 'Obras de emergencia conectan tuberías comarcales para asegurar el suministro a núcleos urbanos.',
    options: [
      { text: 'Financiar la extensión de la red de tuberías de interconexión regional', stats: { apr: +5, eco: -3 }, cost: 250, news: 'Medio Ambiente apoyará las obras de interconexión hídrica urgente.' }
    ]
  },
  {
    id: 'NEWS_117',
    newspaper: 'EXPANSIÓN',
    headline: 'EL SECTOR DE LA BIOTECNOLOGÍA DUPLICA SU FACTURACIÓN EN CINCO AÑOS',
    desc: 'Empresas nacionales desarrollan patentes en diagnósticos genéticos y tratamientos.',
    options: [
      { text: 'Lanzar un fondo de co-inversión pública para empresas del sector biotech', stats: { eco: +5, apr: +3 }, cost: 180, news: 'Economía creará un fondo público para apoyar a las biotecnológicas.' }
    ]
  },
  {
    id: 'NEWS_118',
    newspaper: 'OKDIARIO',
    headline: 'DENUNCIAN EL RETRASO EN LA ENTREGA DE VIVIENDAS DE PROTECCIÓN OFICIAL',
    desc: 'Familias adjudicatarias llevan dos años esperando la entrega de llaves de sus pisos.',
    options: [
      { text: 'Agilizar la expedición de licencias de habitabilidad y auditar a la constructora', stats: { apr: +5, est: +2 }, news: 'Vivienda desbloqueará la entrega de los pisos protegidos tras las quejas.' },
      { text: 'Atribuir los retrasos a los trámites administrativos de los ayuntamientos', stats: { apr: -4, est: -2 }, news: 'Adjudicatarios protestan ante el Ministerio por los demoras de las VPO.' }
    ]
  },
  {
    id: 'NEWS_119',
    newspaper: 'THE OBJECTIVE',
    headline: 'ALERTA POR LA ESCASEZ DE COBERTURA MÓVIL EN ZONAS DE MONTAÑA',
    desc: 'Alcaldes rurales reclaman la instalación de antenas para evitar situaciones de aislamiento.',
    options: [
      { text: 'Obligar a las operadoras a dar cobertura en el 98% del territorio por ley', stats: { apr: +6, eco: -2 }, news: 'Aprobada la obligación de cobertura móvil total para zonas aisladas.' },
      { text: 'Subvencionar el despliegue de antenas satelitales en pueblos pequeños', stats: { apr: +4, eco: -2 }, cost: 90, news: 'El Estado financiará conexión satelital para municipios sin cobertura.' }
    ]
  },
  {
    id: 'NEWS_120',
    newspaper: 'CADENA SER',
    headline: 'LA TASA DE MIGRACIÓN NETA POSITIVA COMPENSA EL ENVEJECIMIENTO POBLACIONAL',
    desc: 'Los nuevos residentes aportan dinamismo al mercado laboral y sostienen la natalidad.',
    options: [
      { text: 'Destacar el valor de la inmigración en la sostenibilidad de las pensiones', stats: { apr: +5, eco: +4, est: +2 }, news: 'El Gobierno pone en valor el aporte migratorio a las cuentas públicas.' },
      { text: 'Reforzar los programas de integración socio-laboral para los nuevos residentes', stats: { apr: +4, eco: -2 }, cost: 120, news: 'Aprobado un fondo para la integración laboral de los inmigrantes.' }
    ]
  }
];

const MINISTRY_DECISIONS_BANK = {
  sanidad: [
    { title: 'Compra extraordinaria de equipamiento hospitalario', cost: 450, stats: { apr: +2, est: +1 } },
    { title: 'Partida urgente de renovación de fármacos e insumos', cost: 300, stats: { apr: +1 } },
    { title: 'Programa de digitalización de historial clínico único', cost: 200, stats: { eco: +1 } },
    { title: 'Plan de choque contra listas de espera quirúrgicas', cost: 600, stats: { apr: +3, est: +1 } },
    { title: 'Refuerzo de atención primaria y unidades de salud mental', cost: 250, stats: { apr: +2 } },
    { title: 'Modernización de las Unidades de Cuidados Intensivos (UCI)', cost: 400, stats: { est: +2 } },
    { title: 'Estabilización de plazas para personal sanitario y médico', cost: 500, stats: { emp: +2, apr: +2 } },
    { title: 'Adquisición de unidades móviles de diagnóstico precoz', cost: 180, stats: { apr: +1 } },
    { title: 'Campaña preventiva y vacunación estacional intensiva', cost: 150, stats: { est: +1, apr: +1 } },
    { title: 'Fondo de investigación y tratamientos oncológicos', cost: 350, stats: { apr: +2, eco: +1 } },
    { title: 'Ampliación de la cobertura odontológica pública', cost: 480, stats: { apr: +3 } },
    { title: 'Garantía de urgencias 24h en zonas rurales y despobladas', cost: 220, stats: { est: +1, apr: +1 } },
    { title: 'Creación de la Agencia Estatal de Salud Pública', cost: 270, stats: { est: +2 } },
    { title: 'Plan nacional de prevención del suicidio y atención telefónica', cost: 190, stats: { apr: +2 } },
    { title: 'Renovación completa de la flota de ambulancias y soporte vital', cost: 320, stats: { apr: +1, est: +1 } },
    { title: 'Reducción del copago farmacéutico en colectivos vulnerables', cost: 410, stats: { apr: +3, eco: -1 } },
    { title: 'Unidades especializadas en diagnóstico de enfermedades raras', cost: 230, stats: { apr: +2 } },
    { title: 'Ampliar la oferta de plazas MIR en especialidades deficitarias', cost: 360, stats: { emp: +2, est: +1 } },
    { title: 'Subvenciones e investigación en terapias avanzadas CAR-T', cost: 290, stats: { eco: +1, apr: +1 } },
    { title: 'Estrategia nacional de salud cardiovascular y nutrición', cost: 140, stats: { apr: +1 } }
  ],

  educacion: [
    { title: 'Convocatoria extraordinaria de becas de movilidad', cost: 350, stats: { apr: +2 } },
    { title: 'Modernización tecnológica y equipos en centros FP', cost: 280, stats: { emp: +2 } },
    { title: 'Programa de refuerzo educativo y tutorías públicas', cost: 180, stats: { apr: +1 } },
    { title: 'Climatización y eficiencia energética en escuelas públicas', cost: 400, stats: { apr: +2, est: +1 } },
    { title: 'Red pública de escuelas infantiles públicas de 0 a 3 años', cost: 520, stats: { emp: +2, apr: +3 } },
    { title: 'Incorporación de orientadores psicopedagógicos en institutos', cost: 210, stats: { est: +1, apr: +1 } },
    { title: 'Fondo de excelencia universitaria y retención de talento', cost: 380, stats: { eco: +2, apr: +1 } },
    { title: 'Refuerzo de becas de comedor e inclusión infantil', cost: 260, stats: { apr: +2 } },
    { title: 'Rehabilitación y mejora de aulas e instalaciones universitarias', cost: 310, stats: { est: +1 } },
    { title: 'Programa de capacitación digital avanzada para estudiantes', cost: 240, stats: { emp: +2 } },
    { title: 'Plan de choque para la reducción de la tasa de abandono escolar', cost: 290, stats: { emp: +1, apr: +1 } },
    { title: 'Incentivos y becas para estudiantes en disciplinas STEM', cost: 220, stats: { eco: +1, emp: +1 } },
    { title: 'Modernización de instalaciones en Centros de Educación Especial', cost: 250, stats: { apr: +2 } },
    { title: 'Programa de intercambios lingüísticos públicos e inmersión', cost: 330, stats: { apr: +2, eco: +1 } },
    { title: 'Plan nacional de banco de libros de texto y material escolar gratuito', cost: 450, stats: { apr: +3 } },
    { title: 'Reducción de tasas matriculares universitarias en grados y másteres', cost: 390, stats: { apr: +3, eco: -1 } },
    { title: 'Contratación de docentes de apoyo en aulas con alta diversidad', cost: 270, stats: { emp: +2, apr: +1 } },
    { title: 'Digitalización de bibliotecas escolares y libre acceso a contenidos', cost: 160, stats: { apr: +1 } },
    { title: 'Plan de convivencia escolar y mediación contra el acoso', cost: 130, stats: { est: +1, apr: +1 } },
    { title: 'Becas de especialización y formación universitaria en IA', cost: 310, stats: { eco: +2, emp: +1 } }
  ],

  infraestructuras: [
    { title: 'Mantenimiento urgente en tramos de alta velocidad ferroviaria', cost: 500, stats: { eco: +1, est: +1 } },
    { title: 'Obras de reparación en puertos de interconexión logística', cost: 400, stats: { eco: +2 } },
    { title: 'Plan de conservación de la red autonómica de carreteras', cost: 300, stats: { est: +1 } },
    { title: 'Soterramiento de vías ferroviarias en grandes cascos urbanos', cost: 650, stats: { apr: +3, est: +1 } },
    { title: 'Expansión y mejora de la red de Cercanías y Rodalies', cost: 550, stats: { apr: +3, eco: +1 } },
    { title: 'Construcción y acondicionamiento de desaladoras e infraestructuras hídricas', cost: 480, stats: { est: +2, eco: +1 } },
    { title: 'Adecuación de la red eléctrica para la integración de renovables', cost: 380, stats: { eco: +2 } },
    { title: 'Creación de plataformas logísticas de mercancías intermodales', cost: 420, stats: { eco: +2, emp: +2 } },
    { title: 'Plan de asfaltado, señalización y seguridad en autovías', cost: 250, stats: { est: +1 } },
    { title: 'Programa de subvenciones para descarbonización del transporte pesado', cost: 320, stats: { eco: +1 } },
    { title: 'Enlace ferroviario directo con las terminales aeroportuarias', cost: 460, stats: { eco: +2 } },
    { title: 'Gestión inteligente del tráfico y sensores de velocidad en corredores clave', cost: 180, stats: { est: +1 } },
    { title: 'Electrificación y modernización de líneas ferroviarias regionales', cost: 410, stats: { est: +1, eco: +1 } },
    { title: 'Construcción de variantes urbanas para desviar el tráfico pesado', cost: 370, stats: { eco: +1, est: +1 } },
    { title: 'Plan de rehabilitación y conservación de viaductos e infraestructuras estratégicas', cost: 290, stats: { est: +2 } },
    { title: 'Ampliación de accesos ferroviarios a terminales marítimas de contenedores', cost: 330, stats: { eco: +2 } },
    { title: 'Plan de extensión de banda ancha e internet ultrarrápido rural', cost: 270, stats: { apr: +2, est: +1 } },
    { title: 'Creación de plataformas de carril bus-VAO en accesos metropolitanos', cost: 210, stats: { eco: +1, apr: +1 } },
    { title: 'Bonificación peajes en autopistas para evitar colapsos urbanos', cost: -150, stats: { eco: +2, apr: -1 } },
    { title: 'Obras de prevención de avenidas de agua y encauzamiento de ríos', cost: 440, stats: { est: +2, apr: +1 } }
  ],

  interior: [
    { title: 'Renovación del parque móvil de las Fuerzas de Seguridad', cost: 250, stats: { con: +2 } },
    { title: 'Refuerzo de personal en puestos y controles fronterizos', cost: 320, stats: { con: +3 } },
    { title: 'Inversión en ciberseguridad e infraestructuras críticas del Estado', cost: 220, stats: { est: +2 } },
    { title: 'Equipamiento táctico y protección avanzada para agentes de policía', cost: 190, stats: { con: +2, est: +1 } },
    { title: 'Construcción y rehabilitación de comisarías y cuarteles de la Guardia Civil', cost: 340, stats: { est: +2, con: +1 } },
    { title: 'Unidades de apoyo contra el crimen organizado y narcotráfico', cost: 280, stats: { con: +3, est: +1 } },
    { title: 'Sistemas de inteligencia y detección temprana antiterrorista', cost: 310, stats: { est: +2, con: +2 } },
    { title: 'Plan de choque para agilizar tramitaciones de DNI y extranjería', cost: 120, stats: { apr: +1 } },
    { title: 'Refuerzo de patrulleras y medios marítimos de vigilancia costera', cost: 260, stats: { con: +3 } },
    { title: 'Modernización y digitalización de la red de centros penitenciarios', cost: 210, stats: { est: +1 } },
    { title: 'Programas de formación en protección civil y gestión de emergencias', cost: 160, stats: { est: +1 } },
    { title: 'Dispositivo especial de seguridad para grandes concentraciones y eventos', cost: 140, stats: { est: +1, con: +1 } },
    { title: 'Plan específico de intervención contra las redes de ocupación ilegal', cost: 180, stats: { con: +2, apr: +1 } },
    { title: 'Oferta de empleo público masiva para Policía Nacional y Guardia Civil', cost: 420, stats: { con: +3, emp: +1 } },
    { title: 'Renovación de helicópteros y lanchas de rescate del Servicio Marítimo', cost: 230, stats: { est: +1, apr: +1 } },
    { title: 'Unidad de investigación de delitos telemáticos y estafas online', cost: 290, stats: { con: +2, eco: +1 } },
    { title: 'Actualización y digitalización del Centro de Control de Tráfico DGT', cost: 150, stats: { est: +1 } },
    { title: 'Dotación de cámaras unipersonales para intervención policial', cost: 200, stats: { con: +2 } },
    { title: 'Programas de inserción laboral para la población penitenciaria', cost: 170, stats: { apr: +1, est: +1 } },
    { title: 'Sistema público de alertas sísmicas y meteorológicas extremas', cost: 130, stats: { est: +2 } }
  ],

  defensa: [
    { title: 'Mantenimiento y revisión técnica de aeronaves tácticas', cost: 600, stats: { mil: +3 } },
    { title: 'Partida para maniobras y adiestramiento conjunto de la OTAN', cost: 450, stats: { mil: +2 } },
    { title: 'Actualización de sistemas de radar, alerta y comunicaciones', cost: 380, stats: { mil: +2 } },
    { title: 'Adquisición de reservas estratégicas de munición de artillería', cost: 520, stats: { mil: +3 } },
    { title: 'Mantenimiento e inspección de fragatas y submarinos de la Armada', cost: 680, stats: { mil: +4 } },
    { title: 'Adecuación de habitabilidad e instalaciones en bases militares', cost: 290, stats: { mil: +2, apr: +1 } },
    { title: 'Refuerzo del Mando de Ciberdefensa y protección satelital', cost: 340, stats: { mil: +2, est: +1 } },
    { title: 'Adquisición de vehículos blindados de transporte terrestre', cost: 510, stats: { mil: +3 } },
    { title: 'Desarrollo de capacidades tácticas de interceptación de drones', cost: 270, stats: { mil: +2 } },
    { title: 'Equipamiento hospitalario e insumos para misiones internacionales', cost: 220, stats: { mil: +1, apr: +1 } },
    { title: 'Modernización de helicópteros de transporte y evacuación médica', cost: 410, stats: { mil: +2 } },
    { title: 'Complemento retributivo extraordinario para la escala de tropa', cost: 330, stats: { mil: +2 } },
    { title: 'Encargo de buques de acción marítima de nueva generación', cost: 750, stats: { mil: +4 } },
    { title: 'Modernización de baterías de defensa antiaérea y de costa', cost: 620, stats: { mil: +3, est: +1 } },
    { title: 'Despliegue de patrulla no tripulada con drones marítimos', cost: 390, stats: { mil: +3 } },
    { title: 'Construcción de galerías y simuladores tácticos de última generación', cost: 310, stats: { mil: +2, eco: +1 } },
    { title: 'Ampliación de programas de formación avanzada en cibercombate', cost: 180, stats: { mil: +1 } },
    { title: 'Adquisición de aviones de transporte logístico y repostaje en vuelo', cost: 580, stats: { mil: +3 } },
    { title: 'Refuerzo de destacamentos de permanencia en plazas soberanas', cost: 350, stats: { mil: +2, est: +1 } },
    { title: 'Participación en consorcio europeo para el desarrollo del caza del futuro', cost: 800, stats: { mil: +4, eco: +1 } }
  ],

  economia: [
    { title: 'Auditoría y optimización del servicio de la deuda pública', cost: -200, stats: { eco: +3 } },
    { title: 'Fondo de incentivos a la innovación y empresas tecnológicas', cost: 300, stats: { eco: +2, emp: +2 } },
    { title: 'Plan de simplificación de trámites tributarios y licencias', cost: 150, stats: { eco: +1 } },
    { title: 'Programa de digitalización y modernización para PYMES', cost: 380, stats: { eco: +2, emp: +2 } },
    { title: 'Ventanilla única y facilitación fiscal para inversión extranjera', cost: -100, stats: { eco: +2 } },
    { title: 'Plan de choque contra el fraude fiscal e inspección tributaria', cost: -350, stats: { eco: +3, est: +1 } },
    { title: 'Líneas de ayuda a la internacionalización del tejido empresarial', cost: 260, stats: { eco: +2 } },
    { title: 'Reorganización y supresión de organismos estatales obsoletos', cost: -180, stats: { eco: +2, apr: -1 } },
    { title: 'Estrategia de atracción de emprendedores y profesionales cualificados', cost: 120, stats: { eco: +1, emp: +1 } },
    { title: 'Fondo de garantía para microcréditos a nuevos emprendedores', cost: 210, stats: { emp: +2, apr: +1 } },
    { title: 'Incentivos a la transición ecológica y economía circular industrial', cost: 290, stats: { eco: +1, apr: +1 } },
    { title: 'Inyección de fondos en vehículos públicos de capital riesgo', cost: 400, stats: { eco: +2, emp: +1 } },
    { title: 'Plan especial de deducciones fiscales para startups estratégicas', cost: 220, stats: { eco: +3 } },
    { title: 'Ventanilla rápida para constitución de empresas en 24 horas', cost: 90, stats: { eco: +2, emp: +1 } },
    { title: 'Línea de avales públicos para la financiación bancaria industrial', cost: 310, stats: { eco: +2, emp: +1 } },
    { title: 'Incentivos a la repatriación de capitales y grandes patrimonios', cost: -120, stats: { eco: +2 } },
    { title: 'Subvenciones para auditorías energéticas en polígonos industriales', cost: 270, stats: { eco: +1, apr: +1 } },
    { title: 'Refuerzo institucional de la Comisión de Competencia', cost: 140, stats: { est: +2, eco: +1 } },
    { title: 'Plan de promoción de la marca país en ferias internacionales', cost: 230, stats: { eco: +2 } },
    { title: 'Fondo estatal de inversión en la industria de los microchips', cost: 490, stats: { eco: +3, emp: +2 } }
  ],

  vivienda: [
    { title: 'Adquisición de suelo urbano para parque público de vivienda', cost: 500, stats: { apr: +3, eco: -1 } },
    { title: 'Plan de rehabilitación de edificios antiguos y aislamiento térmico', cost: 350, stats: { eco: +2, apr: +1 } },
    { title: 'Bono social de ayuda directa al alquiler para jóvenes', cost: 280, stats: { apr: +3 } },
    { title: 'Incentivos fiscales a propietarios para bajar el precio de renta', cost: 190, stats: { eco: +2, apr: +1 } },
    { title: 'Recargo del IBI sobre viviendas desocupadas de grandes tenedores', cost: -120, stats: { apr: +2, est: -1 } },
    { title: 'Construcción directa de promociones de vivienda protegida (VPO)', cost: 600, stats: { apr: +3, emp: +2 } },
    { title: 'Programa de avales públicos para la entrada de la primera vivienda', cost: 320, stats: { apr: +2, eco: +1 } },
    { title: 'Subvenciones para la instalación de ascensores y accesibilidad', cost: 220, stats: { apr: +2 } },
    { title: 'Creación del índice estatal de precios de referencia del alquiler', cost: 150, stats: { est: +1, apr: +1 } },
    { title: 'Líneas de crédito para cooperativas de vivienda en cesión de uso', cost: 240, stats: { apr: +2 } },
    { title: 'Inspecciones masivas sobre pisos turísticos sin licencia', cost: 130, stats: { apr: +2, est: +1 } },
    { title: 'Oficina de arbitraje rápido en conflictos de arrendamiento', cost: 110, stats: { est: +2 } },
    { title: 'Plan de erradicación de infravivienda y poblados chabolistas', cost: 290, stats: { apr: +2, est: +1 } },
    { title: 'Regulación del registro de grandes tenedores e inmobiliarias', cost: 100, stats: { apr: +1 } },
    { title: 'Convenio con la SAREB para la cesión de pisos a uso social', cost: 170, stats: { apr: +3, eco: +1 } },
    { title: 'Financiación de residencias públicas para estudiantes', cost: 310, stats: { apr: +2, emp: +1 } },
    { title: 'Plan de climatización y eficiencia energética en barrios vulnerables', cost: 260, stats: { apr: +2 } },
    { title: 'Seguro público contra impagos para pequeños arrendadores', cost: 180, stats: { eco: +1, apr: +1 } },
    { title: 'Simplificación de licencias de obra de cambio de uso comercial a residencial', cost: 90, stats: { eco: +2 } },
    { title: 'Subvención a la reforma de techos e impermeabilización comunitarios', cost: 210, stats: { apr: +1 } }
  ],

  territorio: [
    { title: 'Fondo de compensación interterritorial para regiones periféricas', cost: 400, stats: { est: +2, apr: +1 } },
    { title: 'Transferencia de nuevas competencias ejecutivas acordadas', cost: 150, stats: { est: +2, apr: -1 } },
    { title: 'Plan de choque para el mantenimiento de servicios en la España vaciada', cost: 320, stats: { est: +2, apr: +2 } },
    { title: 'Digitalización integral de las subdelegaciones del Gobierno', cost: 110, stats: { est: +1 } },
    { title: 'Subvenciones a la conectividad y transporte interinsular', cost: 280, stats: { apr: +2, est: +1 } },
    { title: 'Convocatoria de la Conferencia de Presidentes de Autonomías', cost: 80, stats: { est: +2 } },
    { title: 'Deslocalización de sedes de organismos estatales a otras provincias', cost: 230, stats: { apr: +2, est: +1 } },
    { title: 'Fondo de ayuda para municipios en riesgo de despoblación', cost: 250, stats: { est: +1, apr: +1 } },
    { title: 'Plan de simplificación de convenios Estado-Comunidades Autónomas', cost: 130, stats: { est: +2 } },
    { title: 'Incentivos fiscales a la radicación de empresas en zonas rurales', cost: 210, stats: { eco: +2, emp: +1 } },
    { title: 'Modernización del catastro y coordinación con los municipios', cost: 160, stats: { eco: +1, est: +1 } },
    { title: 'Financiación de consorcios comarcales de bomberos y emergencias', cost: 190, stats: { est: +2 } },
    { title: 'Actualización del modelo de financiación autonómica pendiente', cost: 500, stats: { est: +3, apr: -1 } },
    { title: 'Programa de becas de empleo público para jóvenes en comarcas rurales', cost: 170, stats: { emp: +2 } },
    { title: 'Refuerzo de secretarios e interventores en pequeños ayuntamientos', cost: 140, stats: { est: +2 } },
    { title: 'Estrategia de promoción de las lenguas cooficiales', cost: 120, stats: { apr: +1, est: -1 } },
    { title: 'Fondo de prevención de catástrofes y riesgos comarcales', cost: 220, stats: { est: +2 } },
    { title: 'Programa de modernización tecnológica en diputaciones provinciales', cost: 180, stats: { est: +1 } },
    { title: 'Apoyo a proyectos de desarrollo transfronterizo con Portugal y Francia', cost: 200, stats: { eco: +1, est: +1 } },
    { title: 'Plan de accesibilidad en oficinas de atención al ciudadano autonómicas', cost: 95, stats: { apr: +1 } }
  ],

  trabajo: [
    { title: 'Plan de choque contra la siniestralidad laboral', cost: 150, stats: { emp: +2, apr: +1 } },
    { title: 'Inspecciones masivas a horas extraordinarias no pagadas', cost: 120, stats: { emp: +3, eco: +1 } },
    { title: 'Programa de recualificación digital para desempleados maduros', cost: 280, stats: { emp: +3 } },
    { title: 'Incentivos a la conciliación y racionalización de horarios', cost: 200, stats: { apr: +2 } },
    { title: 'Subvenciones a la contratación indefinida de jóvenes', cost: 350, stats: { emp: +4, eco: -1 } },
    { title: 'Modernización del SEPE y algoritmos de intermediación', cost: 190, stats: { emp: +2 } },
    { title: 'Fondo de apoyo a la economía social y cooperativas de trabajo', cost: 210, stats: { emp: +2, apr: +1 } },
    { title: 'Bonificación de cuotas para emprendedores autónomos rurales', cost: 160, stats: { emp: +2, eco: +1 } },
    { title: 'Plan de inspección contra los falsos autónomos y plataformas digitales', cost: 140, stats: { emp: +2, apr: +2 } },
    { title: 'Subvenciones para la adaptación de puestos de trabajo inclusivos', cost: 130, stats: { apr: +2 } },
    { title: 'Refuerzo del cuerpo de Inspectores de Trabajo y Seguridad Social', cost: 220, stats: { emp: +2, est: +1 } },
    { title: 'Plan de choque contra la brecha salarial de género', cost: 170, stats: { apr: +2, emp: +1 } },
    { title: 'Programa de formación dual en alternancia con empresas', cost: 310, stats: { emp: +3, eco: +1 } },
    { title: 'Subvenciones para la reducción voluntaria de la jornada laboral', cost: 380, stats: { apr: +3, eco: -1 } },
    { title: 'Línea de ayudas para la prevención de riesgos psicosociales', cost: 110, stats: { apr: +1 } },
    { title: 'Fondo de garantía salarial (FOGASA) de cobertura acelerada', cost: 240, stats: { est: +1, apr: +1 } },
    { title: 'Estrategia de reincorporación laboral para desempleados de larga duración', cost: 260, stats: { emp: +3 } },
    { title: 'Programa de orientación e itinerarios personalizados de empleo', cost: 180, stats: { emp: +2 } },
    { title: 'Campañas de erradicación del trabajo no declarado e informal', cost: 130, stats: { eco: +2, emp: +1 } },
    { title: 'Plan de acreditación oficial de competencias profesionales por experiencia', cost: 100, stats: { emp: +2 } }
  ],

  justicia: [
    { title: 'Digitalización integral y expediente judicial electrónico', cost: 250, stats: { est: +2, eco: +1 } },
    { title: 'Creación de juzgados especializados en violencia machista', cost: 180, stats: { apr: +2, est: +1 } },
    { title: 'Plan de choque contra el colapso en registros civiles', cost: 140, stats: { apr: +1, est: +1 } },
    { title: 'Refuerzo del turno de oficio y asistencia jurídica gratuita', cost: 160, stats: { apr: +2 } },
    { title: 'Ampliar la plantilla de fiscales y magistrados de carrera', cost: 310, stats: { est: +3 } },
    { title: 'Construcción y renovación de sedes judiciales y Palacios de Justicia', cost: 330, stats: { est: +2 } },
    { title: 'Despliegue de la mediación y arbitraje como vía extrajudicial', cost: 120, stats: { est: +2 } },
    { title: 'Modernización del Instituto de Medicina Legal y Ciencias Forenses', cost: 150, stats: { est: +1 } },
    { title: 'Refuerzo de juzgados de lo mercantil para concursos de acreedores', cost: 200, stats: { eco: +2, est: +1 } },
    { title: 'Agilización del procedimiento de concesión de nacionalidad', cost: 110, stats: { apr: +1 } },
    { title: 'Implantación de IA para la gestión de trámites procesales menores', cost: 170, stats: { est: +2, eco: +1 } },
    { title: 'Creación de juzgados de lo social para agilizar despidos', cost: 220, stats: { emp: +1, est: +1 } },
    { title: 'Plan de choque para la ejecución rápida de sentencias', cost: 190, stats: { est: +2 } },
    { title: 'Actualización de complementos para el personal de la Administración de Justicia', cost: 240, stats: { est: +1, apr: +1 } },
    { title: 'Oficinas de atención e información directa a víctimas de delitos', cost: 130, stats: { apr: +2 } },
    { title: 'Reforma y modernización de la gestión del Registro Mercantil', cost: 160, stats: { eco: +2 } },
    { title: 'Comisiones de apoyo para macrocausas anticorrupción', cost: 210, stats: { est: +2, apr: +2 } },
    { title: 'Plan de digitalización y custodia segura de archivos históricos de juzgados', cost: 90, stats: { est: +1 } },
    { title: 'Unidades de peritaje informático forense para el Ministerio Fiscal', cost: 175, stats: { est: +2 } },
    { title: 'Equipamiento de salas de vista preparadas para videoconferencia total', cost: 105, stats: { est: +1 } }
  ],

  exteriores: [
    { title: 'Refuerzo de la red consular en nodos comerciales estratégicos', cost: 190, stats: { eco: +2 } },
    { title: 'Fondo de cooperación internacional para el desarrollo iberoamericano', cost: 300, stats: { apr: +2, est: +1 } },
    { title: 'Campaña diplomática de atracción de sedes de organismos multilaterales', cost: 220, stats: { est: +2, eco: +1 } },
    { title: 'Plan de modernización de las infraestructuras embajadoras', cost: 150, stats: { est: +1 } },
    { title: 'Promoción de la cultura e idioma mediante el Instituto Cervantes', cost: 210, stats: { apr: +2, est: +1 } },
    { title: 'Plan de asistencia rápida a ciudadanos españoles en el extranjero', cost: 130, stats: { apr: +2 } },
    { title: 'Refuerzo de la diplomacia climática y cumplimiento del Tratado de París', cost: 180, stats: { apr: +1, est: +1 } },
    { title: 'Estrategia de diplomacia económica en el sudeste asiático y África', cost: 250, stats: { eco: +2 } },
    { title: 'Fondo de ayuda humanitaria de emergencia ante catástrofes globales', cost: 270, stats: { apr: +2 } },
    { title: 'Programa de atracción de talento diplomático e investigación exterior', cost: 140, stats: { est: +1 } },
    { title: 'Fortalecimiento de las cumbres e intercambios bilatelares con la UE', cost: 160, stats: { est: +2 } },
    { title: 'Digitalización de visados y gestiones consulares para turistas', cost: 110, stats: { eco: +1, apr: +1 } },
    { title: 'Línea de apoyo diplomático a empresas exportadoras nacionales', cost: 230, stats: { eco: +2 } },
    { title: 'Campañas de imagen internacional del país en mercados emisores', cost: 200, stats: { eco: +2 } },
    { title: 'Convenios bilaterales de doble nacionalidad y reciprocidad', cost: 125, stats: { est: +1, apr: +1 } },
    { title: 'Refuerzo de las misiones de observación electoral internacional', cost: 95, stats: { est: +1 } },
    { title: 'Plataforma de atención 24/7 a la colectividad en el exterior', cost: 105, stats: { apr: +1 } },
    { title: 'Fondo de apoyo a científicos e investigadores expatriados', cost: 175, stats: { eco: +1, apr: +1 } },
    { title: 'Fomento del multilateralismo en los organismos de la ONU', cost: 220, stats: { est: +2 } },
    { title: 'Estrategia de ciberdiplomacia y protección de delegaciones en el exterior', cost: 165, stats: { est: +1 } }
  ],

  transicion_ecologica: [
    { title: 'Ayudas a la instalación masiva de placas autoconsumo en comunidades', cost: 420, stats: { eco: +2, apr: +2 } },
    { title: 'Reforestación masiva de cuencas hidrográficas contra la erosión', cost: 260, stats: { est: +2, apr: +1 } },
    { title: 'Subvención al despliegue de puntos de recarga ultrarrápida', cost: 310, stats: { eco: +3 } },
    { title: 'Plan de restauración de zonas mineras degradadas', cost: 210, stats: { apr: +2 } },
    { title: 'Protección y regeneración de la franja costera e industrias marinas', cost: 350, stats: { est: +2, apr: +1 } },
    { title: 'Fondo de garantía para el reciclaje y economía circular industrial', cost: 280, stats: { eco: +2 } },
    { title: 'Construcción de infraestructuras para el aprovechamiento del hidrógeno verde', cost: 520, stats: { eco: +3, emp: +1 } },
    { title: 'Estrategia nacional de prevención e extinción de incendios forestales', cost: 390, stats: { est: +2, apr: +2 } },
    { title: 'Plan de digitalización y eficiencia en el uso del agua de regadío', cost: 270, stats: { eco: +2, est: +1 } },
    { title: 'Subvenciones para el aislamiento térmico en viviendas rurales', cost: 230, stats: { apr: +2 } },
    { title: 'Red de seguimiento del cambio climático y observatorios ambientales', cost: 140, stats: { est: +1 } },
    { title: 'Rehabilitación ecológica de humedales y parques nacionales', cost: 190, stats: { apr: +2 } },
    { title: 'Programa de erradicación de especies invasoras en ecosistemas clave', cost: 160, stats: { est: +1 } },
    { title: 'Subvenciones a la compra de vehículos eléctricos urbanos', cost: 450, stats: { eco: +2, apr: +2 } },
    { title: 'Instalación de almacenamiento de energía por baterías a gran escala', cost: 480, stats: { eco: +2, est: +1 } },
    { title: 'Modernización y control de vertederos y residuos urbanos', cost: 220, stats: { est: +1 } },
    { title: 'Plan de fomento de las comunidades energéticas locales', cost: 175, stats: { apr: +2 } },
    { title: 'Recuperación del cauce natural de ríos e infraestructuras verdes', cost: 240, stats: { est: +2 } },
    { title: 'Incentivos a la producción de biogas e instalaciones de biomasa', cost: 300, stats: { eco: +2 } },
    { title: 'Campañas de concienciación sobre el ahorro de agua y residuos', cost: 85, stats: { apr: +1 } }
  ],

  cultura: [
    { title: 'Fondo de ayudas a la producción cinematográfica e independiente', cost: 180, stats: { apr: +2 } },
    { title: 'Restauración del patrimonio histórico y monumentos singulares', cost: 240, stats: { apr: +2, eco: +1 } },
    { title: 'Bono cultural para jóvenes y digitalización de archivos de estado', cost: 200, stats: { apr: +3 } },
    { title: 'Programa de apoyo a la edición de libros y red de bibliotecas públicas', cost: 140, stats: { apr: +2 } },
    { title: 'Subvenciones a las artes escénicas, danza y salas de teatro', cost: 160, stats: { apr: +2 } },
    { title: 'Plan de digitalización y acceso abierto a museos nacionales', cost: 120, stats: { eco: +1, apr: +1 } },
    { title: 'Promoción internacional del sector de los videojuegos y animación', cost: 220, stats: { eco: +2, emp: +1 } },
    { title: 'Ayudas directas al estatuto del artista y creadores independientes', cost: 170, stats: { apr: +2 } },
    { title: 'Restauración y catalogación de bienes de interés cultural en pueblos', cost: 190, stats: { est: +1, apr: +1 } },
    { title: 'Fondo de protección de la música en vivo y festivales de música', cost: 210, stats: { apr: +2, eco: +1 } },
    { title: 'Plan de modernización de infraestructuras deportivas públicas', cost: 250, stats: { apr: +2, est: +1 } },
    { title: 'Becas de tecnificación para deportistas de alto rendimiento y olímpicos', cost: 150, stats: { apr: +2 } },
    { title: 'Programa de fomento del deporte base y escolar en municipios', cost: 130, stats: { apr: +2 } },
    { title: 'Plan de protección contra la piratería de contenidos digitales', cost: 110, stats: { eco: +1, est: +1 } },
    { title: 'Fondo de adquisición de obras de arte para colecciones públicas', cost: 165, stats: { apr: +1 } },
    { title: 'Subvención para la proyección y subtitulado de obras audiovisuales', cost: 95, stats: { apr: +1 } },
    { title: 'Incentivos fiscales a la atracción de grandes rodajes internacionales', cost: -80, stats: { eco: +2, emp: +1 } },
    { title: 'Rehabilitación de espacios industriales para uso creativo y cultural', cost: 230, stats: { apr: +2, eco: +1 } },
    { title: 'Fomento del turismo cultural de rutas patrimonio de la humanidad', cost: 200, stats: { eco: +2 } },
    { title: 'Apoyo al circuito de galerías de arte y ferias de arte contemporáneo', cost: 125, stats: { apr: +1 } }
  ],

  igualdad: [
    { title: 'Pacto de Estado contra la Violencia de Género y recursos de acogida', cost: 250, stats: { apr: +3, est: +1 } },
    { title: 'Campañas de sensibilización contra la discriminación e inoperancia', cost: 120, stats: { apr: +2 } },
    { title: 'Creación del observatorio estatal de brecha salarial e igualdad', cost: 90, stats: { emp: +1, apr: +1 } },
    { title: 'Puntos violeta y red de atención a víctimas en eventos públicos', cost: 110, stats: { apr: +2 } },
    { title: 'Subvenciones para la implantación de planes de igualdad en PYMES', cost: 160, stats: { emp: +1, apr: +1 } },
    { title: 'Programa de asistencia integral e inserción para víctimas de trata', cost: 180, stats: { apr: +2, est: +1 } },
    { title: 'Refuerzo de la línea de atención 016 y cobertura psicológica 24h', cost: 140, stats: { apr: +3 } },
    { title: 'Estudios e investigaciones sobre sesgos de género en la Inteligencia Artificial', cost: 80, stats: { apr: +1 } },
    { title: 'Programa Corresponsables para la conciliación en familias monomarentales', cost: 230, stats: { apr: +3, emp: +1 } },
    { title: 'Formación especializada en igualdad para personal judicial y policial', cost: 130, stats: { est: +1, apr: +1 } },
    { title: 'Campañas contra el acoso en redes sociales y entornos digitales', cost: 100, stats: { apr: +2 } },
    { title: 'Red de centros de atención integral 24 horas a víctimas de violencia sexual', cost: 210, stats: { apr: +3 } },
    { title: 'Plan de sensibilización sobre la diversidad LGTBI+ en el ámbito laboral', cost: 95, stats: { apr: +2 } },
    { title: 'Apoyo e inclusión de colectivos de mujeres con discapacidad', cost: 125, stats: { apr: +2 } },
    { title: 'Becas de formación para mujeres en carreras de baja presencia femenina', cost: 150, stats: { emp: +2, apr: +1 } },
    { title: 'Estrategia estatal para la erradicación de la violencia vicaria', cost: 170, stats: { apr: +2, est: +1 } },
    { title: 'Publicación del informe anual de brecha salarial por sectores', cost: 70, stats: { est: +1 } },
    { title: 'Subvenciones a organizaciones y redes de apoyo a la diversidad social', cost: 140, stats: { apr: +2 } },
    { title: 'Plan de emprendimiento femenino en el medio rural', cost: 190, stats: { emp: +2, apr: +2 } },
    { title: 'Incentivos a la implantación del permiso de paternidad y maternidad ampliado', cost: 320, stats: { apr: +3, eco: -1 } }
  ]
};

const HOUSING_EVENTS = [
  {
    id: 'HOUS_1',
    category: 'VIVIENDA & PROTESTAS',
    title: 'MANIFESTACIÓN MASIVA POR EL DERECHO A LA VIVIENDA',
    desc: 'Decenas de miles de personas toman las calles exigiendo la congelación inmediata de los alquileres y la paralización de desahucios.',
    options: [
      { text: 'Aprobar la congelación del precio de alquileres en zonas tensionadas', stats: { apr: +12, est: +5, eco: -5 }, cost: 1200, loyaltyImpact: { SUMAR: +20, PODEMOS: +25, PP: -20, JUNTS: -15 }, news: 'El Gobierno congela los alquileres tras la gran marea por la vivienda.' },
      { text: 'Desplegar fuerzas de seguridad para disolver los cortes de tráfico en la capital', stats: { apr: -12, est: -8, con: +5 }, cost: 0, loyaltyImpact: { SUMAR: -25, PODEMOS: -30, PP: +15, VOX: +20 }, news: 'Cargas policiales en las protestas por la vivienda desatan duras críticas.' },
      { text: 'Lanzar un plan de avales públicos para la compra de vivienda joven', stats: { apr: +5, est: +2, eco: -8 }, cost: 2000, loyaltyImpact: { PP: +10, PNV: +12, SUMAR: -10 }, news: 'Moncloa aprueba avales para jóvenes ante las críticas de la izquierda.' }
    ]
  },
  {
    id: 'HOUS_2',
    category: 'TENSIONES SOCIALES',
    title: 'HUELGA DE IMPAGO DE ALQUILERES',
    desc: 'Sindicatos de inquilinos convocan una huelga de impago masivo frente a los grandes fondos inmobiliarios.',
    options: [
      { text: 'Aprobar un bono de emergencia social para el pago de alquileres vulnerables', stats: { apr: +10, eco: -6, est: +4 }, cost: 1500, loyaltyImpact: { SUMAR: +15, PODEMOS: +20, PP: -15 }, news: 'Aprobado un subsidio directo de vivienda para frenar la huelga de inquilinos.' },
      { text: 'Sancionar a las organizaciones convocantes e instar la vía judicial', stats: { apr: -15, est: -10, eco: +4 }, cost: 0, loyaltyImpact: { SUMAR: -30, PODEMOS: -35, PP: +20, VOX: +25 }, news: 'El Ejecutivo declara ilegal la huelga de alquileres elevando la tensión social.' }
    ]
  },
  {
    id: 'HOUS_3',
    category: 'EMERGENCIA RESIDENCIAL',
    title: 'DESAHUCIO CONFLICTIVO EN BLOQUE SOCIAL',
    desc: 'Colectivos antidesahucios bloquean el desalojo de 30 familias en un inmueble propiedad de un fondo buitre.',
    options: [
      { text: 'Expropiar temporalmente el uso del edificio compensando al propietario', stats: { apr: +14, eco: -4, est: +6 }, cost: 1000, loyaltyImpact: { SUMAR: +25, PODEMOS: +30, PP: -25, PNV: -15 }, news: 'Expropiación temporal del bloque residencial para evitar el desahucio masivo.' },
      { text: 'Ejecutar la orden judicial de desalojo con las Fuerzas de Seguridad', stats: { apr: -14, est: -12, con: +8 }, cost: 0, loyaltyImpact: { SUMAR: -25, PODEMOS: -35, PP: +18, VOX: +20 }, news: 'Duros altercados durante la ejecución del desalojo del bloque social.' }
    ]
  },
  {
    id: 'HOUS_4',
    category: 'TURISTIFICACIÓN',
    title: 'PROTESTAS VECINALES CONTRA PISOS TURÍSTICOS',
    desc: 'Ciudades costeras y turísticas se movilizan contra la proliferación de alojamientos vacacionales ilícitos.',
    options: [
      { text: 'Prohibir por Ley estatal la concesión de licencias en cascos históricos', stats: { apr: +10, est: +5, eco: -3 }, cost: 0, loyaltyImpact: { SUMAR: +20, PODEMOS: +20, BNG: +15, PNV: -10, JUNTS: -15 }, news: 'Prohibidas las nuevas licencias de pisos turísticos en zonas tensionadas.' },
      { text: 'Delegar la regulación exclusivamente a las Comunidades Autónomas', stats: { apr: -8, est: -4, eco: +3 }, cost: 0, loyaltyImpact: { PP: +15, JUNTS: +10, SUMAR: -15, PODEMOS: -20 }, news: 'El Gobierno delega los pisos turísticos a las autonómicas desatando la indignación.' }
    ]
  }
];

const REAL_MINISTERS = [
  // --- ECONOMÍA Y HACIENDA ---
  { 
    id: "calvino_psoe", name: "Nadia Calviño", party: "PSOE", portfolio: "economia",
    desc: "+1.5% Crecimiento Económico, +0.5% Confianza UE",
    pros: "+1.5% Crecimiento Económico, +0.5% Confianza UE",
    cons: "-1.0% Sintonía con Socios de Izquierda",
    effects: { eco: 1.5, apr: -1.0 }
  },
  { 
    id: "cuerpo_psoe", name: "Carlos Cuerpo", party: "PSOE", portfolio: "economia",
    desc: "+1.5% Estabilidad Económica",
    pros: "+1.5% Estabilidad Económica",
    cons: "-0.5% Presión Fiscal y Control de Gasto",
    effects: { eco: 1.5, est: -0.5 }
  },
  { 
    id: "bravo_pp", name: "Juan Bravo", party: "PP", portfolio: "economia",
    desc: "+1.5% Confianza Empresarial",
    pros: "+1.5% Confianza Empresarial, +1.0% Inversión",
    cons: "-1.0% Aprobación Sindicatos y Empleo Público",
    effects: { eco: 1.5, emp: -1.0 }
  },
  { 
    id: "espinosa_vox", name: "Iván Espinosa de los Monteros", party: "VOX", portfolio: "economia",
    desc: "+1.5% Recorte de Gasto Público",
    pros: "+1.5% Recorte de Gasto Público",
    cons: "-1.5% Aprobación Popular General",
    effects: { eco: 1.5, apr: -1.5 }
  },
  { 
    id: "martin_sumar", name: "Carlos Martín Urriza", party: "SUMAR", portfolio: "economia",
    desc: "+1.5% Salarios y Empleo",
    pros: "+1.5% Salarios y Empleo",
    cons: "-1.0% Confianza Empresarial",
    effects: { emp: 1.5, eco: -1.0 }
  },
  { 
    id: "alvarez_podemos", name: "Nacho Álvarez", party: "PODEMOS", portfolio: "economia",
    desc: "+2.0% Inversión Social",
    pros: "+2.0% Inversión Social",
    cons: "-1.5% Déficit Público y Crecimiento",
    effects: { emp: 2.0, eco: -1.5 }
  },
  { 
    id: "salvado_erc", name: "Lluís Salvadó", party: "ERC", portfolio: "economia",
    desc: "+1.0% Hacienda Propia",
    pros: "+1.0% Hacienda Propia",
    cons: "-1.0% Estabilidad Estatal",
    effects: { eco: 1.0, est: -1.0 }
  },
  { 
    id: "giro_junts", name: "Jaume Giró", party: "JUNTS", portfolio: "economia",
    desc: "+1.5% Competitividad Empresarial",
    pros: "+1.5% Competitividad Empresarial",
    cons: "-1.0% Sintonía con Formaciones de Izquierda",
    effects: { eco: 1.5, apr: -1.0 }
  },
  { 
    id: "matute_bildu", name: "Oskar Matute", party: "BILDU", portfolio: "economia",
    desc: "+1.5% Protecciones Laborales",
    pros: "+1.5% Protecciones Laborales",
    cons: "-1.5% Confianza Inversora",
    effects: { emp: 1.5, eco: -1.5 }
  },
  { 
    id: "sagastizabal_pnv", name: "Idoia Sagastizabal", party: "PNV", portfolio: "economia",
    desc: "+1.5% Concierto Económico",
    pros: "+1.5% Concierto Económico y Rigor Fiscal",
    cons: "-0.5% Tensión de Reparto Territorial",
    effects: { eco: 1.5, est: -0.5 }
  },
  { 
    id: "rego_bng", name: "Néstor Rego", party: "BNG", portfolio: "economia",
    desc: "+1.5% Apoyo al Sector Primario",
    pros: "+1.5% Apoyo al Sector Primario e Industria",
    cons: "-1.0% Inversión de Grandes Corporaciones",
    effects: { eco: 1.5, apr: -1.0 }
  },

  // --- INTERIOR Y SEGURIDAD ---
  { 
    id: "marlaska_psoe", name: "Fernando Grande-Marlaska", party: "PSOE", portfolio: "interior",
    desc: "+1.5% Control Policial",
    pros: "+1.5% Control Policial y Orden Público",
    cons: "-1.0% Aprobación Social e Izquierda",
    effects: { con: 1.5, apr: -1.0 }
  },
  { 
    id: "sayas_pp", name: "Sergio Sayas", party: "PP", portfolio: "interior",
    desc: "+1.5% Firmeza Penal",
    pros: "+1.5% Control Policial, +1.0% Firmeza Penal",
    cons: "-1.0% Tolerancia de la Oposición",
    effects: { con: 1.5, apr: -1.0 }
  },
  { 
    id: "buxade_vox", name: "Jorge Buxadé", party: "VOX", portfolio: "interior",
    desc: "+2.5% Control de Fronteras",
    pros: "+2.5% Control de Fronteras e Inmigración",
    cons: "-2.0% Aprobación Internacional y UE",
    effects: { con: 2.5, apr: -2.0 }
  },
  { 
    id: "santiago_sumar", name: "Enrique Santiago", party: "SUMAR", portfolio: "interior",
    desc: "+1.5% Derechos Ciudadanos",
    pros: "+1.5% Garantías y Derechos Ciudadanos",
    cons: "-1.0% Control Policial en Protestas",
    effects: { apr: 1.5, con: -1.0 }
  },
  { 
    id: "mayoral_podemos", name: "Rafa Mayoral", party: "PODEMOS", portfolio: "interior",
    desc: "+1.5% Protecciones y Derechos Civiles",
    pros: "+1.5% Protecciones y Derechos Civiles",
    cons: "-1.5% Respaldo de los Cuerpos Policiales",
    effects: { apr: 1.5, con: -1.5 }
  },
  { 
    id: "elena_erc", name: "Joan Ignasi Elena", party: "ERC", portfolio: "interior",
    desc: "+1.0% Seguridad Autonómica",
    pros: "+1.0% Seguridad Autonómica",
    cons: "-1.0% Coordinación con Fuerzas Estatales",
    effects: { con: 1.0, est: -1.0 }
  },
  { 
    id: "inarritu_bildu", name: "Jon Iñarritu", party: "BILDU", portfolio: "interior",
    desc: "+1.5% Transparencia Policial",
    pros: "+1.5% Transparencia y Fiscalización Policial",
    cons: "-1.5% Tensión con Mandos de Seguridad",
    effects: { apr: 1.5, con: -1.5 }
  },
  { 
    id: "legarda_pnv", name: "Mikel Legarda", party: "PNV", portfolio: "interior",
    desc: "+1.0% Coordinación Policial",
    pros: "+1.0% Coordinación Policial",
    cons: "-0.5% Tensiones de Competencias",
    effects: { con: 1.0, est: -0.5 }
  },

  // --- DEFENSA NACIONAL ---
  { 
    id: "robles_psoe", name: "Margarita Robles", party: "PSOE", portfolio: "defensa",
    desc: "+1.5% Estabilidad Militar",
    pros: "+1.5% Estabilidad Militar y Vínculo OTAN",
    cons: "-1.0% Aprobación en la Base Progresista",
    effects: { mil: 1.5, apr: -1.0 }
  },
  { 
    id: "echaniz_pp", name: "José Ignacio Echániz", party: "PP", portfolio: "defensa",
    desc: "+2.0% Respaldo Militar",
    pros: "+2.0% Respaldo a las Fuerzas Armadas",
    cons: "-1.0% Presión sobre el Presupuesto Civil",
    effects: { mil: 2.0, eco: -1.0 }
  },
  { 
    id: "ortega_vox", name: "Javier Ortega Smith", party: "VOX", portfolio: "defensa",
    desc: "+2.5% Integridad Nacional",
    pros: "+2.5% Integridad y Defensa Nacional",
    cons: "-2.0% Estabilidad y Relaciones Autonómicas",
    effects: { mil: 2.5, est: -2.0 }
  },
  { 
    id: "santos_sumar", name: "Agustín Santos Maraver", party: "SUMAR", portfolio: "defensa",
    desc: "+1.5% Diplomacia",
    pros: "+1.5% Diplomacia e Pacifismo",
    cons: "-1.0% Estabilidad en Fuerzas Armadas",
    effects: { apr: 1.5, mil: -1.0 }
  },
  { 
    id: "rodriguez_podemos", name: "Julio Rodríguez", party: "PODEMOS", portfolio: "defensa",
    desc: "+1.0% Modernización Democrática",
    pros: "+1.0% Modernización Democrática",
    cons: "-1.0% Recelo en la Cúpula Castrense",
    effects: { mil: 1.0, est: -1.0 }
  },
  { 
    id: "aizpurua_bildu", name: "Mertxe Aizpurua", party: "BILDU", portfolio: "defensa",
    desc: "+1.0% Orientación a Políticas de Paz",
    pros: "+1.0% Orientación Hacia Políticas de Paz",
    cons: "-2.0% Rechazo Directo en Fuerzas Armadas",
    effects: { apr: 1.0, mil: -2.0 }
  },
  { 
    id: "agirretxea_pnv", name: "Joseba Agirretxea", party: "PNV", portfolio: "defensa",
    desc: "+1.0% Mediación Institucional",
    pros: "+1.0% Mediación Institucional",
    cons: "-0.5% Menor Perfil en Defensa Estatal",
    effects: { est: 1.0, mil: -0.5 }
  },

  // --- VIVIENDA Y SERVICIOS SOCIALES ---
  { 
    id: "diaz_sumar", name: "Yolanda Díaz", party: "SUMAR", portfolio: "vivienda",
    desc: "+2.0% Protecciones Sociales",
    pros: "+2.0% Protecciones Sociales, +1.0% Empleo",
    cons: "-1.0% Confianza de la Patronal e Inversores",
    effects: { apr: 2.0, emp: 1.0, eco: -1.0 }
  },
  { 
    id: "belarra_podemos", name: "Ione Belarra", party: "PODEMOS", portfolio: "vivienda",
    desc: "+2.5% Regulación del Alquiler",
    pros: "+2.5% Regulación del Alquiler y Vivienda Social",
    cons: "-2.0% Oferta e Inversión Inmobiliaria Privada",
    effects: { apr: 2.5, eco: -2.0 }
  },
  { 
    id: "rodriguez_psoe", name: "Isabel Rodríguez", party: "PSOE", portfolio: "vivienda",
    desc: "+1.0% Ayudas al Alquiler",
    pros: "+1.0% Ayudas al Alquiler, +0.5% Estabilidad",
    cons: "-0.5% Ritmo de Reformas Estructurales",
    effects: { apr: 1.0, est: 0.5, eco: -0.5 }
  },
  { 
    id: "martin_pp", name: "Paloma Martín", party: "PP", portfolio: "vivienda",
    desc: "+1.5% Estímulo Inmobiliario",
    pros: "+1.5% Estímulo a la Oferta Inmobiliaria",
    cons: "-1.0% Cobertura Social a Inquilinos Vulnerables",
    effects: { eco: 1.5, apr: -1.0 }
  },
  { 
    id: "monasterio_vox", name: "Rocío Monasterio", party: "VOX", portfolio: "vivienda",
    desc: "+1.5% Liberalización del Suelo",
    pros: "+1.5% Liberalización de Suelo",
    cons: "-1.5% Protección del Alquiler Social",
    effects: { eco: 1.5, apr: -1.5 }
  },
  { 
    id: "jorda_erc", name: "Teresa Jordà", party: "ERC", portfolio: "vivienda",
    desc: "+1.5% Control Público de Precios",
    pros: "+1.5% Control Público de Precios",
    cons: "-1.0% Fricción Jurídica Estatal",
    effects: { apr: 1.5, est: -1.0 }
  },

  // --- POLÍTICA TERRITORIAL ---
  { 
    id: "torres_psoe", name: "Ángel Víctor Torres", party: "PSOE", portfolio: "territorio",
    desc: "+1.5% Diálogo Autonómico",
    pros: "+1.5% Diálogo Autonómico",
    cons: "-1.0% Críticas Centralistas de Oposición",
    effects: { est: 1.5, apr: -1.0 }
  },
  { 
    id: "gamarra_pp", name: "Cuca Gamarra", party: "PP", portfolio: "territorio",
    desc: "+1.5% Cohesión Institucional",
    pros: "+1.5% Cohesión Institucional",
    cons: "-1.0% Tensiones con Partidos Nacionalistas",
    effects: { est: 1.5, apr: -1.0 }
  },
  { 
    id: "garriga_vox", name: "Ignacio Garriga", party: "VOX", portfolio: "territorio",
    desc: "+1.5% Centralización",
    pros: "+1.5% Centralización Administrativa",
    cons: "-2.0% Oposición Total en las CCAA",
    effects: { est: 1.0, apr: -2.0 }
  },
  { 
    id: "esteban_pnv", name: "Aitor Esteban", party: "PNV", portfolio: "territorio",
    desc: "+2.5% Pactos Parlamentarios",
    pros: "+2.5% Estabilidad y Pactos Parlamentarios",
    cons: "-1.5% Coste Financiero en Transferencias",
    effects: { est: 2.5, eco: -1.5 }
  },
  { 
    id: "rufian_erc", name: "Gabriel Rufián", party: "ERC", portfolio: "territorio",
    desc: "+2.0% Apoyo Soberanista",
    pros: "+2.0% Apoyo de Formaciones Soberanistas",
    cons: "-1.5% Estabilidad Institucional Estatal",
    effects: { apr: 2.0, est: -1.5 }
  },
  { 
    id: "nogueras_junts", name: "Míriam Nogueras", party: "JUNTS", portfolio: "territorio",
    desc: "+1.5% Autogobierno Fiscal",
    pros: "+1.5% Autogobierno y Balanza Fiscal",
    cons: "-1.0% Estabilidad Presupuestaria del Estado",
    effects: { est: 1.5, eco: -1.0 }
  },
  { 
    id: "rodriguez_bildu", name: "Arkaitz Rodríguez", party: "BILDU", portfolio: "territorio",
    desc: "+1.5% Cohesión Plurinacional",
    pros: "+1.5% Cohesión del Bloque Plurinacional",
    cons: "-1.5% Tensión con Sectores Constitucionalistas",
    effects: { est: 1.5, apr: -1.5 }
  },
  { 
    id: "ponton_bng", name: "Ana Pontón", party: "BNG", portfolio: "territorio",
    desc: "+1.5% Autogobierno Regional",
    pros: "+1.5% Autogobierno Regional",
    cons: "-0.5% Tensiones con la Administración Central",
    effects: { est: 1.5, apr: -0.5 }
  },
  // --- SANIDAD Y CONSUMO ---
  {
    id: "darias_psoe", name: "Carolina Darias", party: "PSOE", portfolio: "sanidad",
    desc: "+1.5% Gestión del Sistema Público",
    pros: "+1.5% Gestión del Sistema Público",
    cons: "-0.5% Presión sobre el Presupuesto Fiscal",
    effects: { apr: 1.5, eco: -0.5 }
  },
  {
    id: "escudero_pp", name: "Enrique Ruiz Escudero", party: "PP", portfolio: "sanidad",
    desc: "+1.0% Eficiencia Operativa y Gestión Privada",
    pros: "+1.0% Eficiencia Operativa",
    cons: "-0.5% Reticencia de Marea Blanca y Sindicatos",
    effects: { eco: 1.0, apr: -0.5 }
  },
  {
    id: "garcia_sumar", name: "Mónica García", party: "SUMAR", portfolio: "sanidad",
    desc: "+2.0% Refuerzo Sanitario Público",
    pros: "+2.0% Refuerzo Sanitario Público y Salud Mental",
    cons: "-1.0% Gasto Operativo Sanitario",
    effects: { apr: 2.0, eco: -1.0 }
  },
  {
    id: "steegmann_vox", name: "Juan Luis Steegmann", party: "VOX", portfolio: "sanidad",
    desc: "+1.0% Reorganización Central de Sanidad",
    pros: "+1.0% Reorganización y Eficiencia de Recursos",
    cons: "-1.0% Fricción Colectiva e Institucional",
    effects: { eco: 1.0, apr: -1.0 }
  },
  {
    id: "ubera_bildu", name: "Rebeka Ubera", party: "BILDU", portfolio: "sanidad",
    desc: "+1.5% Descentralización y Cobertura Local",
    pros: "+1.5% Cobertura Comunitaria Local",
    cons: "-0.5% Coordinación con el Ministerio Central",
    effects: { apr: 1.5, est: -0.5 }
  },

  // --- EDUCACIÓN Y FORMACIÓN PROFESIONAL ---
  {
    id: "alegria_psoe", name: "Pilar Alegría", party: "PSOE", portfolio: "educacion",
    desc: "+1.5% Consenso Educativo Público",
    pros: "+1.5% Bekas y Consenso Público",
    cons: "-0.5% Descontento en la Escuela Concertada",
    effects: { apr: 1.5, est: 0.5 }
  },
  {
    id: "gamarra_edu_pp", name: "Cuca Gamarra", party: "PP", portfolio: "educacion",
    desc: "+1.5% Exigencia Curricular y Concertada",
    pros: "+1.5% Libertad de Elección y Conciertos",
    cons: "-1.0% Oposición de Sindicatos de Enseñanza",
    effects: { est: 1.5, apr: -1.0 }
  },
  {
    id: "sierra_sumar", name: "Francisco Sierra", party: "SUMAR", portfolio: "educacion",
    desc: "+1.5% Gratuidad de Ciclos e Inclusión",
    pros: "+1.5% Inclusión y Gratuidad Educativa",
    cons: "-1.0% Impacto en las Cuentas Públicas",
    effects: { apr: 1.5, eco: -1.0 }
  },
  {
    id: "robles_vox", name: "Joaquín Robles", party: "VOX", portfolio: "educacion",
    desc: "+1.0% Temario Nacional Unificado",
    pros: "+1.0% Unificación Curricular de contenidos",
    cons: "-1.5% Rechazo Abierto en Comunitats Autonómicas",
    effects: { est: 1.0, apr: -1.5 }
  },
  {
    id: "simo_erc", name: "Anna Simó", party: "ERC", portfolio: "educacion",
    desc: "+1.5% Blindaje Lingüístico Educativo",
    pros: "+1.5% Modelo Lingüístico Propio",
    cons: "-1.0% Fricciones Judiciales y Estatales",
    effects: { apr: 1.5, est: -1.0 }
  },

  // --- TRABAJO Y ECONOMÍA SOCIAL ---
  {
    id: "escriva_psoe", name: "José Luis Escrivá", party: "PSOE", portfolio: "trabajo",
    desc: "+1.5% Creación de Empleo Estable",
    pros: "+1.5% Empleo Estable y Sostenibilidad",
    cons: "-0.5% Presión en Cotizaciones Patronales",
    effects: { emp: 1.5, eco: -0.5 }
  },
  {
    id: "garces_pp", name: "Mario Garcés", party: "PP", portfolio: "trabajo",
    desc: "+1.5% Flexibilidad Laboral",
    pros: "+1.5% Flexibilidad y Contratación Empresarial",
    cons: "-1.0% Respuesta de las Centrales Sindicales",
    effects: { eco: 1.5, emp: -1.0 }
  },
  {
    id: "diaz_trabajo_sumar", name: "Yolanda Díaz", party: "SUMAR", portfolio: "trabajo",
    desc: "+2.0% Subida Salarial y Protección Laboral",
    pros: "+2.0% Subida del SMI y Reducción Jornada",
    cons: "-1.0% Inconformidad Patronal",
    effects: { emp: 2.0, apr: 1.0, eco: -1.0 }
  },
  {
    id: "miralles_vox", name: "Onofre Miralles", party: "VOX", portfolio: "trabajo",
    desc: "+1.0% Prioridad Nacional en el Empleo",
    pros: "+1.0% Bonificación a la Contratación Nacional",
    cons: "-1.0% Rechazo Internacional de Normativas",
    effects: { eco: 1.0, emp: -1.0 }
  },
  {
    id: "otxandiano_bildu", name: "Pello Otxandiano", party: "BILDU", portfolio: "trabajo",
    desc: "+1.5% Marcos Autonómicos de Negociación",
    pros: "+1.5% Convenios Autonómicos Prioritarios",
    cons: "-1.0% Flexibilidad Empresarial",
    effects: { emp: 1.5, eco: -1.0 }
  },

  // --- JUSTICIA ---
  {
    id: "bolanos_psoe", name: "Félix Bolaños", party: "PSOE", portfolio: "justicia",
    desc: "+1.5% Acuerdos de Reforma Judicial",
    pros: "+1.5% Renovación del CGPJ y Consenso",
    cons: "-0.5% Recelo de la Oposición",
    effects: { est: 1.5, apr: -0.5 }
  },
  {
    id: "sanchez_pp", name: "José María Sánchez", party: "PP", portfolio: "justicia",
    desc: "+1.5% Independencia Judicial y Despolitización",
    pros: "+1.5% Modelo de Elección por Jueces",
    cons: "-1.0% Desbloqueo Legislativo Progresista",
    effects: { est: 1.5, apr: -1.0 }
  },
  {
    id: "pisarello_sumar", name: "Gerardo Pisarello", party: "SUMAR", portfolio: "justicia",
    desc: "+1.5% Democratización de la Justicia",
    pros: "+1.5% Acceso Gratuito y Reformas Penales",
    cons: "-1.0% Tensión con Asociaciones de Jueces",
    effects: { apr: 1.5, est: -1.0 }
  },
  {
    id: "sanchez_vox", name: "José María Sánchez García", party: "VOX", portfolio: "justicia",
    desc: "+1.0% Endurecimiento del Código Penal",
    pros: "+1.0% Agravamiento de Penas",
    cons: "-1.5% Controversia en Tribunales Europeos",
    effects: { est: 1.0, apr: -1.5 }
  },
  {
    id: "capella_erc", name: "Ester Capella", party: "ERC", portfolio: "justicia",
    desc: "+1.0% Justicia Proximity y Amnistía",
    pros: "+1.0% Pacificación de Causas Político-Judiciales",
    cons: "-1.0% Tensión con la Alta Magistratura",
    effects: { apr: 1.0, est: -1.0 }
  },

  // --- ASUNTOS EXTERIORES Y UE ---
  {
    id: "albares_psoe", name: "José Manuel Albares", party: "PSOE", portfolio: "exteriores",
    desc: "+1.5% Alineación Estratégica UE",
    pros: "+1.5% Peso e Influencia en Bruselas",
    cons: "-0.5% Tensión Diplomática en el Norte de África",
    effects: { est: 1.5, apr: 0.5 }
  },
  {
    id: "fidalgo_pp", name: "José María Fidalgo", party: "PP", portfolio: "exteriores",
    desc: "+1.5% Relaciones Transatlánticas",
    pros: "+1.5% Vínculo Comercial con EE.UU. y la OTAN",
    cons: "-0.5% Sintonía con Bloques Progresistas",
    effects: { eco: 1.5, est: 0.5 }
  },
  {
    id: "espinosa_ext_vox", name: "Iván Espinosa de los Monteros", party: "VOX", portfolio: "exteriores",
    desc: "+1.0% Soberanía Nacional en Tratados",
    pros: "+1.0% Defensa de Intereses Agrícolas Nacionales",
    cons: "-1.5% Fricción Directa con la Comisión Europea",
    effects: { est: 1.0, apr: -1.5 }
  },

  // --- TRANSICIÓN ECOLÓGICA Y RETO DEMOGRÁFICO ---
  {
    id: "ribera_psoe", name: "Teresa Ribera", party: "PSOE", portfolio: "transicion_ecologica",
    desc: "+1.5% Liderazgo Renovable Europeo",
    pros: "+1.5% Despliegue Renovable y Fondos UE",
    cons: "-0.5% Coste de Transición Sector Primario",
    effects: { apr: 1.5, eco: -0.5 }
  },
  {
    id: "gago_pp", name: "Diego Gago", party: "PP", portfolio: "transicion_ecologica",
    desc: "+1.5% Neutralidad Tecnológica y Energía",
    pros: "+1.5% Apoyo a la Industria y Nuclear",
    cons: "-1.0% Crítica de Plataformas Ecologistas",
    effects: { eco: 1.5, apr: -1.0 }
  },
  {
    id: "urtasun_sumar", name: "Ernest Urtasun", party: "SUMAR", portfolio: "transicion_ecologica",
    desc: "+2.0% Objetivos de Descarbonización",
    pros: "+2.0% Cierre Acelerado de Contaminantes",
    cons: "-1.0% Oposición de la Industria Pesada",
    effects: { apr: 2.0, eco: -1.0 }
  },
  {
    id: "chamorro_vox", name: "Ricardo Chamorro", party: "VOX", portfolio: "transicion_ecologica",
    desc: "+1.0% Protección del Sector Agropecuario",
    pros: "+1.0% Flexibilización del Plan Verde",
    cons: "-1.5% Sanciones y Compromisos Comunitarios",
    effects: { eco: 1.0, apr: -1.5 }
  },

  // --- CULTURA Y DEPORTE ---
  {
    id: "iceta_psoe", name: "Miquel Iceta", party: "PSOE", portfolio: "cultura",
    desc: "+1.5% Promoción Cultural Integral",
    pros: "+1.5% Bono Cultural y Becas a la Creación",
    cons: "-0.5% Disparidad Regional de Fondos",
    effects: { apr: 1.5, est: 0.5 }
  },
  {
    id: "semper_pp", name: "Borja Sémper", party: "PP", portfolio: "cultura",
    desc: "+1.5% Mecenazgo e Industria Cultural",
    pros: "+1.5% Incentivos Fiscales al Mecenazgo",
    cons: "-0.5% Inconformidad en Sectores Subvencionados",
    effects: { apr: 1.5, est: 0.5 }
  },
  {
    id: "borras_junts", name: "Laura Borràs", party: "JUNTS", portfolio: "cultura",
    desc: "+1.5% Fomento de las Artes e Identidad",
    pros: "+1.5% Proyección Internacional del Patrimonio",
    cons: "-1.0% Recelo Institucional Estatal",
    effects: { apr: 1.5, est: -1.0 }
  },

  // --- IGUALDAD ---
  {
    id: "calvo_psoe", name: "Carmen Calvo", party: "PSOE", portfolio: "igualdad",
    desc: "+1.5% Legislación Institucional de Igualdad",
    pros: "+1.5% Marco Normativo de Cohesión Social",
    cons: "-0.5% Tensiones en los Colectivos Trans y LGTBI",
    effects: { apr: 1.5, est: 0.5 }
  },
  {
    id: "duval_sumar", name: "Elizabeth Duval", party: "SUMAR", portfolio: "igualdad",
    desc: "+2.0% Ampliación de Derechos LGTBI+",
    pros: "+2.0% Avance en Derechos Diversos e Inclusión",
    cons: "-1.0% Oposición de Sectores Conservadores",
    effects: { apr: 2.0, est: -1.0 }
  },
  {
    id: "montero_podemos", name: "Irene Montero", party: "PODEMOS", portfolio: "igualdad",
    desc: "+2.5% Transformación Feminista Estructural",
    pros: "+2.5% Leyes de Impacto e Igualdad de Género",
    cons: "-1.5% Fricción Judicial y Choque Político",
    effects: { apr: 2.5, est: -1.5 }
  },
  {
    id: "toscano_vox", name: "Carla Toscano", party: "VOX", portfolio: "igualdad",
    desc: "+1.0% Reducción de Estructura de Ministerio",
    pros: "+1.0% Ahorro Presupuestario y Eficiencia",
    cons: "-2.0% Fuerte Oposición Social y Movilización",
    effects: { eco: 1.0, apr: -2.0 }
  }
];

const GOAL_POOL = [
  { id: 'eco',   icon: 'fa-chart-line',   title: 'Milagro Económico',   desc: 'Mantén la Economía ≥ 70%',            check: s => s.metrics.eco >= 70 },
  { id: 'est',   icon: 'fa-shield-halved',title: 'Paz Social',          desc: 'Mantén la Estabilidad ≥ 65%',         check: s => s.metrics.est >= 65 },
  { id: 'apr',   icon: 'fa-heart',        title: 'Presidente Querido',  desc: 'Mantén la Aprobación ≥ 65%',          check: s => s.metrics.apr >= 65 },
  { id: 'emp',   icon: 'fa-briefcase',    title: 'Pleno Empleo',        desc: 'Mantén el Empleo ≥ 70%',              check: s => s.metrics.emp >= 70 },
  { id: 'mil',   icon: 'fa-person-military-pointing', title: 'Cuarteles en Calma', desc: 'Mantén la Lealtad Militar ≥ 60%', check: s => s.metrics.mil >= 60 },
  { id: 'caja',  icon: 'fa-vault',        title: 'Superávit',           desc: 'Acumula una tesorería ≥ 120.000 M€',  check: s => (Number(s.treasury) || 0) >= 120000 },
  { id: 'doble', icon: 'fa-scale-balanced', title: 'Doble Confianza',   desc: 'Aprobación ≥ 60% y Estabilidad ≥ 60%',check: s => s.metrics.apr >= 60 && s.metrics.est >= 60 },
  { id: 'todo',  icon: 'fa-star',         title: 'España Equilibrada',  desc: 'Todas las métricas ≥ 55%',            check: s => Object.values(s.metrics).every(v => v >= 55) }
];

const GOAL_ACTIONS = [
  { id: 'tv',     icon: 'fa-tv',           title: 'Comparecencia televisada', cap: 15, cost: 0,    cd: 30, fx: { apr: 6, est: 2 },        news: 'El Presidente comparece en prime time y remonta en las encuestas.' },
  { id: 'ue',     icon: 'fa-earth-europe', title: 'Cumbre en Bruselas',       cap: 20, cost: 0,    cd: 45, fx: { eco: 6, apr: 2 },        news: 'Bruselas desbloquea fondos y elogia las reformas del Gobierno.' },
  { id: 'pacto',  icon: 'fa-handshake',    title: 'Pacto de Estado',          cap: 25, cost: 0,    cd: 60, fx: { est: 6, apr: 3, con: 4 },news: 'Gobierno y oposición firman un Pacto de Estado histórico.' },
  { id: 'empleo', icon: 'fa-hammer',       title: 'Plan de Choque del Empleo',cap: 10, cost: 3000, cd: 40, fx: { emp: 8, eco: 3 },        news: 'Moncloa lanza un plan de choque con 3.000 M€ contra el paro.' },
  { id: 'army',   icon: 'fa-medal',        title: 'Reforma de las FAS',       cap: 15, cost: 1500, cd: 50, fx: { mil: 8, apr: -3 },       news: 'El Gobierno moderniza las Fuerzas Armadas; el Ejército responde con lealtad.' },
  { id: 'ahorro', icon: 'fa-piggy-bank',   title: 'Recorte del Gasto Público',cap: 0,  cost: 0,    cd: 60, fx: { apr: -5, est: -2 }, gain: 8000, news: 'Austeridad: el Gobierno recorta gasto y ahorra 8.000 M€, a costa de la calle.' }
];

const FOCUS_TREE = [
  { id: 'e1', b: 'eco', title: 'Reforma Fiscal',          days: 365, now: { eco: 4 },            spirit: { name: 'Hacienda Eficiente',   daily: {},                    money: 600 } },
  { id: 'e2', b: 'eco', title: 'Plan Industrial',         days: 420, req: 'e1', now: { emp: 3 },  spirit: { name: 'Polos Industriales',   daily: { eco: .05, emp: .04 }, money: 0 } },
  { id: 'e3', b: 'eco', title: 'Fondos Europeos',         days: 480, req: 'e2', now: { apr: 2 }, cash: 15000, spirit: null },
  { id: 'e4', b: 'eco', title: 'Marca España',            days: 540, req: 'e3', now: {},          spirit: { name: 'Marca España',         daily: { eco: .06, apr: .03 }, money: 1200 } },
  { id: 's1', b: 'soc', title: 'Sanidad Reforzada',       days: 365, now: { apr: 3 },            spirit: { name: 'Sanidad Universal',    daily: { est: .03 },           money: -500 } },
  { id: 's2', b: 'soc', title: 'Pacto Educativo',         days: 420, req: 's1', now: {},         spirit: { name: 'Capital Humano',       daily: { emp: .04, eco: .02 }, money: -400 } },
  { id: 's3', b: 'soc', title: 'Vivienda Joven',          days: 480, req: 's2', now: { apr: 4 }, spirit: { name: 'Acceso a la Vivienda', daily: { apr: .05 },          money: -600 } },
  { id: 's4', b: 'soc', title: 'Estado del Bienestar',    days: 540, req: 's3', now: { est: 4 }, spirit: { name: 'Bienestar Social',     daily: { est: .05, apr: .04 }, money: -900 } },
  { id: 'g1', b: 'seg', title: 'Modernización Policial',  days: 365, now: { est: 4 },            spirit: { name: 'Policía Moderna',      daily: { est: .03 },           money: -300 } },
  { id: 'g2', b: 'seg', title: 'Ciberseguridad Nacional', days: 420, req: 'g1', now: {},         spirit: { name: 'Escudo Digital',       daily: { est: .03, eco: .02 }, money: -300 } },
  { id: 'g3', b: 'seg', title: 'Ejército Profesional',    days: 480, req: 'g2', now: { mil: 6 }, spirit: { name: 'Tropa Profesional',    daily: { mil: .05 },           money: -600 } },
  { id: 'g4', b: 'seg', title: 'Pacto de Defensa',        days: 540, req: 'g3', now: { mil: 4 }, spirit: { name: 'Paraguas OTAN',        daily: { mil: .04, est: .03 }, money: -700 } },
  { id: 'd1', b: 'dip', title: 'Diplomacia Activa',       days: 365, now: { apr: 2 },            spirit: { name: 'Voz en el Mundo',      daily: { apr: .03 },           money: 0 } },
  { id: 'd2', b: 'dip', title: 'Eje con Bruselas',        days: 420, req: 'd1', now: {}, cash: 8000, spirit: { name: 'Socio Fiable',       daily: { eco: .04 },           money: 0 } },
  { id: 'd3', b: 'dip', title: 'Cumbre de Seguridad',     days: 480, req: 'd2', now: { est: 3, mil: 3 }, spirit: null },
  { id: 'd4', b: 'dip', title: 'Liderazgo Internacional', days: 540, req: 'd3', now: {},         spirit: { name: 'Potencia Media',       daily: { apr: .05, eco: .04 }, money: 800 } }
];

const FOCUS_LINKS = [
  { t: 'Economía hundida destruye empleo',      on: s => s.eco < 40, fx: { emp: -.08 } },
  { t: 'Economía fuerte crea empleo',           on: s => s.eco > 65, fx: { emp: .04 } },
  { t: 'Paro alto erosiona la aprobación',      on: s => s.emp < 40, fx: { apr: -.08, est: -.04 } },
  { t: 'Pleno empleo mejora la aprobación',     on: s => s.emp > 65, fx: { apr: .04 } },
  { t: 'Inestabilidad frena la economía',       on: s => s.est < 40, fx: { eco: -.06 } },
  { t: 'Impopularidad alimenta el malestar',    on: s => s.apr < 35, fx: { est: -.05 } },
  { t: 'Ejército descontento desestabiliza',    on: s => s.mil < 30, fx: { est: -.04 } },
  { t: 'Estabilidad alta atrae inversión',      on: s => s.est > 70, fx: { eco: .03 } }
];

const SHOCK_POOL = [
  { cat: 'EMERGENCIA', min: 'interior', title: 'INCENDIOS FORESTALES', desc: 'Varias comunidades arden a la vez y piden ayuda urgente al Estado.',
    options: [ { text: 'Desplegar medios extraordinarios', cost: 400, stats: { est: 3, apr: 2 }, news: 'El Gobierno moviliza todos los medios contra los incendios.' }, { text: 'Dejar que actúen las comunidades', cost: 0, stats: { est: -4, apr: -5 }, news: 'Críticas por la lentitud del Gobierno ante los incendios.' } ] },
  { cat: 'LABORAL', min: 'trabajo', title: 'HUELGA GENERAL', desc: 'Los sindicatos convocan un paro nacional contra tu política laboral.',
    options: [ { text: 'Abrir mesa de negociación', cost: 10, stats: { emp: 3, apr: 2, eco: -2 }, news: 'Acuerdo con los sindicatos tras una jornada de huelga.' }, { text: 'Mantener la postura', cost: 0, stats: { est: -5, apr: -6, eco: -3 }, news: 'La huelga general paraliza el país.' } ] },
  { cat: 'ESCÁNDALO', min: 'justicia', title: 'ESCÁNDALO DE CORRUPCIÓN', desc: 'Un informe judicial señala a un alto cargo de tu entorno.',
    options: [ { text: 'Cesar al implicado', cost: 0, stats: { apr: -4 }, news: 'El Presidente cesa al implicado y promete transparencia.' }, { text: 'Negar y cerrar filas', cost: 0, stats: { apr: -9, est: -3 }, news: 'El Gobierno niega todo; la oposición pide dimisiones.' } ] },
  { cat: 'MERCADOS', min: 'economia', title: 'DISPARO DE LA PRIMA DE RIESGO', desc: 'Los inversores desconfían de la deuda española y exigen intereses más altos.',
    options: [ { text: 'Anunciar recortes', cost: 0, stats: { eco: 3, apr: -5, emp: -2 }, news: 'Moncloa anuncia un plan de ajuste para calmar a los mercados.' }, { text: 'Aguantar el pulso', cost: 0, stats: { eco: -6, emp: -2 }, news: 'La prima de riesgo se dispara sin respuesta del Gobierno.' } ] },
  { cat: 'MIGRACIÓN', min: 'interior', title: 'PRESIÓN MIGRATORIA', desc: 'Llegan miles de personas a las costas y los servicios se saturan.',
    options: [ { text: 'Plan de acogida y refuerzo fronterizo', cost: 900, stats: { est: 3, apr: -1 }, news: 'Se activa un plan de emergencia migratoria.' }, { text: 'Endurecer fronteras sin más inversión', cost: 0, stats: { apr: -5, est: 1 }, news: 'Polémica por la gestión de la llegada de migrantes.' } ] },
  { cat: 'CIBERSEGURIDAD', min: 'defensa', title: 'CIBERATAQUE A MINISTERIOS', desc: 'Atacantes desconocidos paralizan sistemas críticos del Estado.',
    options: [ { text: 'Contratar respuesta de emergencia', cost: 120, stats: { est: 2, mil: 1 }, news: 'El Estado contiene el ciberataque con ayuda externa.' }, { text: 'Resolverlo con medios propios', cost: 0, stats: { eco: -5, est: -3 }, news: 'El ciberataque deja semanas de caos administrativo.' } ] },
  { cat: 'ENERGÍA', min: 'transicion_ecologica', title: 'CRISIS ENERGÉTICA', desc: 'La luz y el gas se disparan y las familias no llegan a fin de mes.',
    options: [ { text: 'Subsidiar la factura energética', cost: 3000, stats: { eco: 2, apr: 3 }, news: 'El Gobierno subvenciona la factura de la luz.' }, { text: 'Dejar actuar al mercado', cost: 0, stats: { eco: -6, emp: -3, apr: -3 }, news: 'La escalada energética golpea a hogares y empresas.' } ] },
  { cat: 'DEFENSA', min: 'defensa', title: 'RUIDO DE SABLES', desc: 'Mandos militares critican en privado tu gestión y hay malestar en los cuarteles.',
    options: [ { text: 'Ascensos y mejoras salariales', cost: 700, stats: { mil: 6, apr: -1 }, news: 'El Gobierno apacigua a los cuarteles con mejoras para la tropa.' }, { text: 'Ignorar el malestar', cost: 0, stats: { mil: -8, est: -2 }, news: 'Crece el descontento en las Fuerzas Armadas.' } ] }
];

const INTL_ACTIONS = [
  { id: 'visit', title: 'Visita oficial',   cap: 10, cost: 0,    rel: 12, cd: 40 },
  { id: 'trade', title: 'Acuerdo comercial',cap: 0,  cost: 80, rel: 8,  cd: 30 }
];

const PROJECTS = [
  { id: 'ave', icon: 'fa-train', title: 'Alta Velocidad y Cercanías', spirit: { name: 'Red Ferroviaria', daily: { eco: .04, emp: .02 }, money: 80 },
    phases: [{ n: 'Estudios, trazado y licitación', cost: 1500, days: 30, now: {}, run: {} }, { n: 'Obra civil y vías', cost: 9500, days: 110, now: { emp: 2, eco: 1 }, run: { emp: .02, eco: .01 } }, { n: 'Material móvil y puesta en servicio', cost: 4000, days: 45, now: { eco: 2, emp: 1 }, run: {} }] },
  { id: 'hosp', icon: 'fa-hospital', title: 'Red de Hospitales', spirit: { name: 'Sanidad Moderna', daily: { est: .03, apr: .02 }, money: -350 },
    phases: [{ n: 'Planificación y suelo', cost: 900, days: 25, now: {}, run: {} }, { n: 'Construcción de los centros', cost: 6000, days: 90, now: { emp: 1 }, run: { emp: .015 } }, { n: 'Equipamiento y contratación de personal', cost: 2100, days: 40, now: { apr: 4 }, run: {} }] },
  { id: 'agua', icon: 'fa-droplet', title: 'Plan Hidrológico', spirit: { name: 'Seguridad Hídrica', daily: { est: .03, eco: .02 }, money: -60 },
    phases: [{ n: 'Estudios y evaluación ambiental', cost: 1000, days: 35, now: {}, run: {} }, { n: 'Presas, desaladoras y conducciones', cost: 7500, days: 120, now: { emp: 1 }, run: { emp: .012 } }, { n: 'Interconexión y puesta en marcha', cost: 2500, days: 45, now: { est: 3 }, run: {} }] },
  { id: 'renov', icon: 'fa-solar-panel', title: 'Energías Renovables', spirit: { name: 'Independencia Energética', daily: { eco: .05 }, money: 250 },
    phases: [{ n: 'Concursos y permisos', cost: 1600, days: 40, now: {}, run: {} }, { n: 'Parques solares, eólicos y redes', cost: 9800, days: 130, now: { eco: 1, emp: 1 }, run: { emp: .015, eco: .01 } }, { n: 'Almacenamiento y conexión a red', cost: 2600, days: 50, now: { eco: 3 }, run: {} }] },
  { id: 'viv', icon: 'fa-house', title: 'Vivienda Pública', spirit: { name: 'Parque Público', daily: { apr: .04, est: .02 }, money: -200 },
    phases: [{ n: 'Cesión de suelo y proyecto', cost: 800, days: 30, now: {}, run: {} }, { n: 'Construcción de viviendas', cost: 5600, days: 100, now: { emp: 1 }, run: { emp: .015 } }, { n: 'Adjudicación y entrega', cost: 1600, days: 35, now: { apr: 5 }, run: {} }] },
  { id: 'digi', icon: 'fa-microchip', title: 'Transformación Digital', spirit: { name: 'Estado Digital', daily: { eco: .03, emp: .03 }, money: 150 },
    phases: [{ n: 'Diseño y contratación', cost: 700, days: 25, now: {}, run: {} }, { n: 'Despliegue de redes y sistemas', cost: 5200, days: 80, now: { eco: 1 }, run: { eco: .01 } }, { n: 'Migración y formación', cost: 2100, days: 40, now: { eco: 2, emp: 2 }, run: {} }] }
];

const ACHIEVEMENTS = [
  { id: 'm1', icon: 'fa-flag', title: 'Primer Mandato', desc: 'Cumple tu primera misión', ok: s => s.goals && s.goals.done >= 1 },
  { id: 'm5', icon: 'fa-list-check', title: 'Gestor Eficaz', desc: 'Cumple 5 misiones en una legislatura', ok: s => s.goals && s.goals.done >= 5 },
  { id: 'leg', icon: 'fa-crown', title: 'Legado Histórico', desc: 'Alcanza el Legado Histórico', ok: s => s.goals && s.goals.legacy },
  { id: 'f1', icon: 'fa-diagram-project', title: 'Visión de Estado', desc: 'Completa un foco nacional', ok: s => s.focus && s.focus.done.length >= 1 },
  { id: 'fb', icon: 'fa-sitemap', title: 'Doctrina Completa', desc: 'Completa una rama entera de focos', ok: s => s.focus && Object.keys(FOCUS_BRANCHES).some(b => FOCUS_TREE.filter(f => f.b === b).every(f => s.focus.done.includes(f.id))) },
  { id: 'p3', icon: 'fa-helmet-safety', title: 'Constructor de España', desc: 'Termina 3 proyectos de Estado', ok: s => s.proj && s.proj.done.length >= 3 },
  { id: 'dip', icon: 'fa-handshake', title: 'Diplomático', desc: 'Sé aliado de los 4 socios exteriores a la vez', ok: s => s.intl && Object.values(s.intl.rel).every(r => r >= 70) },
  { id: 'rich', icon: 'fa-vault', title: 'Caja Fuerte', desc: 'Llega a 100.000 M€ en Tesorería', ok: s => (Number(s.treasury) || 0) >= 100000 },
  { id: 'all', icon: 'fa-star', title: 'País de Primera', desc: 'Todas las métricas ≥ 70% a la vez', ok: s => s.metrics && ['eco', 'est', 'emp', 'apr', 'mil'].every(k => s.metrics[k] >= 70) },
  { id: 'abyss', icon: 'fa-skull', title: 'Al Borde del Abismo', desc: 'Emite más de 250.000 M€ de deuda nueva', ok: s => s.debt && s.debt.amount >= 250000 },
  { id: 'surv', icon: 'fa-shield', title: 'Superviviente', desc: 'Completa una legislatura', ok: s => s.campaign && s.campaign.history.length >= 1 },
  { id: 'iron', icon: 'fa-fire', title: 'Veterano de Hierro', desc: 'Llega a la 2.ª legislatura en Crisis Permanente', ok: s => s.campaign && s.campaign.diff === 'extremo' && s.campaign.current >= 2 }
];

const BDE_GOVS = [
  { id: 'tecnico', name: 'Elena Márquez', tag: 'Tecnócrata ortodoxa', cred: 15, desc: 'Los mercados la adoran, pero sus informes son duros con el gasto.' },
  { id: 'afin', name: 'Joaquín Rivas', tag: 'Afín al Gobierno', cred: -10, desc: 'Informes amables y dividendos fáciles; los inversores desconfían.' },
  { id: 'indep', name: 'Carlos Beltrán', tag: 'Independiente crítico', cred: 8, desc: 'Incómodo e impredecible, pero muy respetado en Fráncfort.' }
];

const BDE_ACTIONS = [
  { id: 'informe', icon: 'fa-file-lines', label: 'Encargar un informe de solvencia', desc: 'Auditoría externa que calma a los mercados (más efecto con un gobernador creíble).', cost: 150, cd: 60, when: () => true,
    run: B => { const g = bdeGov(); B.cred += g && g.id !== 'afin' ? 5 : 2; B.shock -= 15; } },
  { id: 'dividendo', icon: 'fa-hand-holding-dollar', label: 'Adelantar el beneficio del Banco de España', desc: 'Liquidez inmediata (+3.000 M€), pero huele a presión política.', cost: 0, cd: 180, when: () => !bdePeseta(),
    run: B => { B.cred -= 10; B.shock += 20; registerFinancialTransaction('Adelanto de beneficios del Banco de España', 3000, 'economia'); } },
  { id: 'tpi', icon: 'fa-shield-halved', label: 'Pedir al BCE el escudo antifragmentación', desc: 'Exige prima ≥ 250 pb. Recorta la prima, pero Fráncfort impone condiciones.', cost: 0, cd: 150, when: () => !bdePeseta() && bdePrima() >= 250,
    run: B => { B.shock -= 120; B.cred += 2; focusMetricAdd('est', -3); } },
  { id: 'devaluar', icon: 'fa-arrow-trend-down', label: 'Devaluar la peseta', desc: 'Impulsa exportaciones (+6 Economía) pero dispara la inflación (−5 Aprobación).', cost: 0, cd: 180, when: () => bdePeseta(),
    run: B => { B.cred -= 10; B.shock -= 40; focusMetricAdd('eco', 6); focusMetricAdd('apr', -5); } },
  { id: 'reservas', icon: 'fa-vault', label: 'Defender la peseta con reservas', desc: 'Quema 4.000 M€ de reservas para frenar la fuga de capitales.', cost: 4000, cd: 90, when: () => bdePeseta(),
    run: B => { B.cred += 6; B.shock -= 60; } },
  { id: 'imprimir', icon: 'fa-print', label: 'Que el Banco de España financie el déficit', desc: 'Imprime +6.000 M€ de pesetas. Inflación y desconfianza garantizadas.', cost: 0, cd: 120, when: () => bdePeseta(),
    run: B => { B.cred -= 15; B.shock += 50; focusMetricAdd('apr', -4); registerFinancialTransaction('Financiación monetaria del Banco de España', 6000, 'economia'); } }
];
