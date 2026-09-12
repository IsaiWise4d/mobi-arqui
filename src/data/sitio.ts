// Datos editables del sitio Mobi Arquitectura.
// 🔶 = pendiente de confirmar con el cliente. Editar SOLO este archivo.

export const marca = {
  nombre: 'Mobi Arquitectura',
  ciudad: 'Barranquilla, Colombia',
  instagram: 'https://instagram.com/mobi_arquitectura',
  instagramHandle: '@mobi_arquitectura',
};

export const whatsapp = {
  numero: '573104063602',
  mensajeGeneral: 'Hola, encontré Mobi Arquitectura en su sitio web y me gustaría cotizar un proyecto.',
};

export function waLink(mensaje: string = whatsapp.mensajeGeneral) {
  return `https://wa.me/${whatsapp.numero}?text=${encodeURIComponent(mensaje)}`;
}

export const servicios = [
  {
    codigo: 'A-01',
    area: 'CARPINTERÍA',
    titulo: 'Carpintería arquitectónica',
    descripcion:
      'Diseñamos y fabricamos mobiliario y carpintería a medida en Barranquilla, integrados a la arquitectura del espacio.',
    cta: 'Hablar de mi espacio',
    tipo: 'Carpintería a medida',
    foto: '/frames/ezgif-frame-278.jpg',
    alt: 'Visualización de interior con carpintería en madera',
  },
  {
    codigo: 'D-02',
    area: 'MOBILIARIO',
    titulo: 'Diseño de mobiliario',
    descripcion:
      'Convertimos tus ideas en propuestas funcionales, proporcionales y listas para fabricarse en nuestro taller.',
    cta: 'Cuéntanos tu idea',
    tipo: 'Diseño de mobiliario',
    foto: '/frames/ezgif-frame-238.jpg',
    alt: 'Visualización de mobiliario integrado en un espacio cálido',
  },
  {
    codigo: 'C-03',
    area: 'OBRA',
    titulo: 'Obra civil y acabados',
    descripcion:
      'Ejecutamos la obra en Barranquilla y cuidamos cada encuentro, textura y remate hasta la entrega.',
    cta: 'Planear una remodelación',
    tipo: 'Obra civil y acabados',
    foto: '/frames/ezgif-frame-174.jpg',
    alt: 'Visualización arquitectónica de obra y acabados',
  },
  {
    codigo: 'O-04',
    area: 'VIDRIO',
    titulo: 'Divisiones de baño',
    descripcion: 'Suministro e instalación de vidrio templado para cerrar el proyecto con precisión.',
    cta: 'Completar mi espacio',
    tipo: 'Divisiones de baño en vidrio',
    foto: '/frames/ezgif-frame-211.jpg',
    alt: 'Visualización de un baño con divisiones de vidrio',
  },
];

// 🔶 Cifras pendientes de confirmar con el cliente (el copy pide barra de 4; hay 3 definidas).
export const indicadores = [
  { valor: 50, prefijo: '+', etiqueta: 'Obras ejecutadas' },
  { valor: 6, prefijo: '+', etiqueta: 'Años de experiencia' },
  { valor: 98, sufijo: '%', etiqueta: 'Satisfacción de clientes' },
];

export const proyectoDestacado = {
  titulo: 'Acabados apartamento modelo',
  cliente: 'Constructora Bolívar',
  categoria: 'Obra civil y acabados',
  anio: '2025', // 🔶 confirmar año/periodo con el cliente
  descripcion:
    'Ejecutamos los acabados del apartamento modelo para uno de los proyectos de Constructora Bolívar en Barranquilla, cuidando cada detalle de cara al público que lo visita.',
  fotos: [] as { src: string; alt: string }[], // 🔶 pendiente: fotos reales de obra
};

export const faq = [
  {
    q: '¿Mobi solo diseña o también ejecuta la obra?',
    a: 'Hacemos las dos cosas: diseñamos el proyecto y lo ejecutamos con nuestro propio equipo, de principio a fin.',
  },
  {
    q: '¿En qué zonas de Barranquilla trabajan?',
    a: 'Trabajamos en toda Barranquilla y su área metropolitana.', // 🔶 confirmar cobertura exacta con el cliente
  },
  {
    q: '¿Cuánto se demora un proyecto de carpintería a medida?',
    a: 'Depende del alcance: un mobiliario puntual suele tomar semanas, una obra completa algunos meses. Te damos un tiempo concreto después de la visita técnica.', // 🔶 confirmar tiempos típicos con el cliente
  },
  {
    q: '¿La cotización tiene costo?',
    a: 'No. Cuéntanos tu proyecto por WhatsApp y te damos una primera orientación sin costo.',
  },
  {
    q: '¿Trabajan también con constructoras o solo con particulares?',
    a: 'Con ambos. Trabajamos proyectos residenciales y también acabados para constructoras aliadas, como en apartamentos modelo.',
  },
  {
    q: '¿Cómo empiezo?',
    a: 'Escríbenos por WhatsApp contándonos tu idea, o usa el formulario de cotización rápida — te respondemos directamente desde el equipo.',
  },
];

// 🔶 Placeholder hasta confirmar la historia real con el cliente.
export const nosotros = {
  statement: 'Mobi Arquitectura nace en Barranquilla con la idea de que el diseño, la obra y el mobiliario',
  enfasis: 'deberían hablar el mismo idioma.',
  anotacion: 'Del primer trazo a la última pieza instalada',
};

export const cotizador = {
  // 🔶 Confirmar con el cliente si el paso de zona aplica o se omite.
  zonas: ['Norte', 'Alto Prado', 'Centro', 'Sur', 'Otro'],
  tipos: [
    'Carpintería a medida',
    'Diseño de mobiliario',
    'Obra civil y acabados',
    'Remodelación',
    'Divisiones de baño en vidrio',
    'Otro',
  ],
  estados: ['Solo tengo la idea', 'Tengo el espacio', 'Tengo planos', 'Obra en curso'],
  tiempos: ['Lo antes posible', 'En 1 a 3 meses', 'Este año', 'Solo estoy explorando'],
  notaConfianza: 'No pedimos datos de pago ni documentos. La cotización formal se entrega después de la visita técnica.',
};
