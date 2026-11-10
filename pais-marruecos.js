// =====================================================================
//  CONTENIDO DE MARRUECOS (secciones del menú, igual que en España)
//  Cada acción: id, t(ítulo), d(escripción), cost (M€; negativo = ingreso),
//  cap (capital político), cd (días de espera), P (efectos propios),
//  ES (efectos en España), rel (relación bilateral), loy (lealtad de socios).
// =====================================================================
(function () {
  const I = (id, t, d, cost, cap, cd, P, x) => Object.assign({ id, t, d, cost, cap, cd, P }, x || {});
  window.MA_DATA = { sections: {
    tes: { title: 'Tesorería', ic: 'fa-vault', intro: 'Gestiona la caja del Estado: ingresos extraordinarios y gasto de emergencia.', items: [
      I('tes1', 'Privatizar participaciones públicas', 'Vende parte de empresas del Estado (+900 M€).', -900, 3, 120, { apr: -3, eco: 1, palace: -1 }),
      I('tes2', 'Amnistía fiscal parcial', 'Aflora capitales no declarados (+500 M€).', -500, 2, 90, { apr: -2, est: -1 }),
      I('tes3', 'Fondo Hassan II de inversión', 'Inyecta capital en sectores estratégicos (−600 M€).', 600, 3, 90, { eco: 3, emp: 2 }),
      I('tes4', 'Reserva de emergencia contra la sequía', 'Fondos para campo y agua (−400 M€).', 400, 2, 60, { est: 3, apr: 2 }),
      I('tes5', 'Cobrar el IVA de forma más estricta', 'Refuerza la recaudación (+350 M€).', -350, 2, 60, { apr: -2, eco: -1 }),
      I('tes6', 'Subvención al butano y al trigo', 'Contiene precios (−450 M€).', 450, 2, 45, { apr: 4, est: 2 })] },
    fin: { title: 'Finanzas y deuda', ic: 'fa-scale-unbalanced', intro: 'La deuda pública y la prima de riesgo condicionan la economía.', items: [
      I('fin1', 'Plan de consolidación fiscal', 'Recorta gasto y reduce la deuda.', 0, 4, 90, { debt: -4, apr: -4, eco: -1 }),
      I('fin2', 'Emisión de deuda en los mercados', 'Consigue liquidez a cambio de deuda (+1.000 M€).', -1000, 2, 60, { debt: 3, eco: 1 }),
      I('fin3', 'Préstamo del FMI (línea de precaución)', 'Liquidez con condiciones (+1.500 M€).', -1500, 4, 150, { debt: 2, apr: -3, palace: -1 }),
      I('fin4', 'Reestructurar deuda con acreedores', 'Alarga plazos y baja intereses.', 0, 5, 150, { debt: -2, eco: 1 }),
      I('fin5', 'Fondo soberano para la deuda', 'Destina ahorro a amortizar (−500 M€).', 500, 3, 90, { debt: -3 })] },
    bank: { title: 'Bank Al-Maghrib', ic: 'fa-building-columns', intro: 'El banco central controla los tipos y el dírham.', items: [
      I('bank1', 'Bajar el tipo director', 'Abarata el crédito.', 0, 2, 45, { eco: 2, emp: 1, debt: 0.5 }),
      I('bank2', 'Subir el tipo director', 'Frena la inflación.', 0, 2, 45, { eco: -1, est: 1, apr: -1 }),
      I('bank3', 'Flexibilizar la banda del dírham', 'Más competitividad exterior.', 0, 3, 90, { eco: 2, apr: -2 }),
      I('bank4', 'Intervenir con las reservas de divisas', 'Defiende la moneda (−300 M€).', 300, 2, 60, { est: 2 }),
      I('bank5', 'Programa de finanzas para pymes', 'Crédito garantizado (−350 M€).', 350, 3, 75, { eco: 2, emp: 3 })] },
    proj: { title: 'Proyectos de Estado', ic: 'fa-helmet-safety', intro: 'Grandes obras que dan beneficios permanentes.', items: [
      I('proj1', 'Puerto Nador West Med', 'Nuevo hub mediterráneo (−1.200 M€).', 1200, 6, 180, { eco: 5, emp: 3 }),
      I('proj2', 'Desaladora de Casablanca', 'Seguridad hídrica (−900 M€).', 900, 5, 150, { est: 4, eco: 2, apr: 2 }),
      I('proj3', 'Tren Marrakech–Agadir', 'Alta velocidad al sur (−1.000 M€).', 1000, 5, 150, { eco: 3, apr: 3, emp: 2 }),
      I('proj4', 'Ciudad tecnológica de Dakhla', 'Polo atlántico (−700 M€).', 700, 4, 120, { eco: 3, palace: 4 }),
      I('proj5', 'Gigafábrica de baterías en Kenitra', 'Industria verde (−800 M€).', 800, 5, 150, { eco: 4, emp: 4 }),
      I('proj6', 'Estadio Hassan II (Mundial 2030)', 'Sede compartida con España (−900 M€).', 900, 6, 180, { apr: 4, eco: 3 }, { ES: { eco: 1 }, rel: 3 })] },
    neg: { title: 'Negociación u oposición', ic: 'fa-handshake', intro: 'Compra apoyos o desactiva a la oposición.', items: [
      I('neg1', 'Pacto social con los sindicatos', 'Calma el frente laboral (−250 M€).', 250, 4, 90, { est: 3, apr: 2 }, { loy: { USFP: 8, PPS: 8 } }),
      I('neg2', 'Concesiones al PJD en materia religiosa', 'Gana a los islamistas.', 0, 3, 90, { palace: 1, apr: -1 }, { loy: { PJD: 12 } }),
      I('neg3', 'Fondo regional para el MP', 'Obras en el medio rural (−200 M€).', 200, 3, 75, { apr: 1 }, { loy: { MP: 12 } }),
      I('neg4', 'Reforma de la ley de partidos', 'Más transparencia y control.', 0, 4, 120, { est: 2, palace: -1 }, { loy: { PAM: -5, PI: 5 } }),
      I('neg5', 'Cumbre con la oposición', 'Rebaja la tensión parlamentaria.', 0, 2, 60, { est: 2, apr: 1 })] },
    obj: { title: 'Mandato y objetivos', ic: 'fa-flag-checkered', intro: 'Hoja de ruta del Gobierno: cada plan se activa una vez.', items: [
      I('obj1', 'Nuevo Modelo de Desarrollo', 'Plan estratégico a 10 años.', 300, 6, 240, { eco: 4, apr: 2, emp: 2 }),
      I('obj2', 'Plan Marruecos Digital', 'Administración y empresas conectadas (−250 M€).', 250, 4, 180, { eco: 3, emp: 2 }),
      I('obj3', 'Plan de empleo juvenil', 'Respuesta a la protesta juvenil (−350 M€).', 350, 5, 150, { emp: 5, apr: 3, est: 2 }),
      I('obj4', 'Estrategia nacional del agua', 'Gestión integral hídrica (−400 M€).', 400, 5, 180, { est: 3, eco: 2 }),
      I('obj5', 'Marruecos, hub energético verde', 'Hidrógeno y renovables (−500 M€).', 500, 6, 240, { eco: 5, palace: 2 })] },
    soc: { title: 'Sociedad y opinión', ic: 'fa-people-group', intro: 'Mide el pulso social y actúa sobre la opinión.', items: [
      I('soc1', 'Campaña de comunicación del Gobierno', 'Mejora la imagen (−80 M€).', 80, 2, 45, { apr: 3 }),
      I('soc2', 'Diálogo con la juventud (GenZ 212)', 'Escucha a los jóvenes.', 0, 3, 90, { apr: 4, est: 2 }),
      I('soc3', 'Reforma de la Moudawana', 'Derechos de familia.', 0, 5, 150, { apr: 3, est: -2, palace: -1 }, { loy: { USFP: 10, PPS: 12, PJD: -15 } }),
      I('soc4', 'Plan de vivienda social', 'Acceso a la vivienda (−450 M€).', 450, 4, 120, { apr: 5, emp: 2 }),
      I('soc5', 'Programa de protección social universal', 'Cobertura sanitaria y ayudas (−600 M€).', 600, 5, 150, { apr: 6, est: 3 })] },
    foc: { title: 'Focos nacionales', ic: 'fa-bullseye', intro: 'Prioridades de largo plazo: concentra el esfuerzo del Estado.', items: [
      I('foc1', 'Foco: agua y agricultura', 'Prioridad hídrica y rural (−300 M€).', 300, 4, 200, { est: 4, eco: 2 }),
      I('foc2', 'Foco: energías renovables', 'Solar y eólica (−400 M€).', 400, 5, 200, { eco: 4, palace: 1 }),
      I('foc3', 'Foco: automoción e industria', 'Tánger y Kenitra (−350 M€).', 350, 4, 200, { eco: 4, emp: 3 }),
      I('foc4', 'Foco: turismo', 'Camino al 2030 (−250 M€).', 250, 3, 200, { eco: 3, emp: 2, apr: 1 }),
      I('foc5', 'Foco: Sáhara y provincias del sur', 'Desarrollo y presencia (−350 M€).', 350, 5, 200, { palace: 5, est: 2 }),
      I('foc6', 'Foco: educación y formación', 'Formación profesional (−300 M€).', 300, 4, 200, { emp: 3, apr: 2 })] },
    ue: { title: 'Unión Europea', ic: 'fa-star', intro: 'Relación con Bruselas: comercio, pesca, migración y energía.', items: [
      I('ue1', 'Renovar el acuerdo pesquero UE–Marruecos', 'Ingresos y relación (+300 M€).', -300, 3, 120, { eco: 2, palace: 1 }, { ES: { eco: 1 }, rel: 3 }),
      I('ue2', 'Asociación avanzada con la UE', 'Más acceso al mercado europeo.', 0, 5, 180, { eco: 4, apr: 1 }, { ES: { eco: 1 }, rel: 4 }),
      I('ue3', 'Pacto migratorio con Bruselas', 'Contención a cambio de fondos (+500 M€).', -500, 4, 120, { est: 1, apr: -2 }, { ES: { est: 2 }, rel: 4 }),
      I('ue4', 'Corredor de energía verde con Europa', 'Exportar renovables (−400 M€).', 400, 5, 150, { eco: 4 }, { ES: { eco: 2 }, rel: 3 }),
      I('ue5', 'Negociar visados Schengen', 'Movilidad para estudiantes y empresarios.', 0, 3, 120, { apr: 3 }, { rel: 2 })] }
  },
  readonly: { inf: ['Informes', 'fa-file-lines'], cis: ['Informes (CIS)', 'fa-square-poll-vertical'], logros: ['Logros', 'fa-trophy'] } };
})();
