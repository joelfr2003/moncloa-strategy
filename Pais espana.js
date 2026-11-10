// =====================================================================
//  CONTENIDO DE ESPAÑA (separado del motor de index.html)
//  Se carga antes del script principal. Cada país tendrá su archivo igual.
// =====================================================================

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
