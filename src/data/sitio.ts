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
    foto: '/seq/stills/f-278.webp',
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
    foto: '/seq/stills/f-238.webp',
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
    foto: '/seq/stills/f-174.webp',
    alt: 'Visualización arquitectónica de obra y acabados',
  },
  {
    codigo: 'O-04',
    area: 'VIDRIO',
    titulo: 'Divisiones de baño',
    descripcion: 'Suministro e instalación de vidrio templado para cerrar el proyecto con precisión.',
    cta: 'Completar mi espacio',
    tipo: 'Divisiones de baño en vidrio',
    foto: '/seq/stills/f-211.webp',
    alt: 'Visualización de un baño con divisiones de vidrio',
  },
];

// 🔶 Cifras pendientes de confirmar con el cliente (el copy pide barra de 4; hay 3 definidas).
export const indicadores = [
  { valor: 50, prefijo: '+', etiqueta: 'Obras ejecutadas' },
  { valor: 6, prefijo: '+', etiqueta: 'Años de experiencia' },
  { valor: 98, sufijo: '%', etiqueta: 'Satisfacción de clientes' },
];

export const proyectos = [
  {
    titulo: 'Acabados apartamento modelo',
    cliente: 'Constructora Bolívar',
    categoria: 'Obra civil y acabados',
    anio: '2025', // 🔶 confirmar año/periodo con el cliente
    descripcion:
      'Ejecutamos los acabados del apartamento modelo para uno de los proyectos de Constructora Bolívar en Barranquilla, cuidando cada detalle de cara al público que lo visita.',
    fotos: [
      {
        src: '/proyecto1/SaveClip.App_611702271_18090193967311608_8180274784776699631_n.jpg',
        alt: 'Sala comedor del apartamento modelo con cocina abierta al fondo',
      },
      {
        src: '/proyecto1/SaveClip.App_613030350_18090193976311608_3936159774360201608_n.jpg',
        alt: 'Comedor y barra de cocina con carpintería en madera y sillas doradas',
      },
      {
        src: '/proyecto1/SaveClip.App_612473026_18090193985311608_8907621496528068029_n.jpg',
        alt: 'Detalle de barra de cocina con estantería en madera y taburetes altos',
      },
      {
        src: '/proyecto1/SaveClip.App_616277671_18090193958311608_8762842745461618806_n.jpg',
        alt: 'Sala con sofá, mesa de centro en madera y estudio con repisas iluminadas',
      },
    ] as { src: string; alt: string }[],
  },
  {
    titulo: 'Alcoba con tocador y mueble de TV',
    cliente: 'Residencial — Barranquilla',
    categoria: 'Carpintería arquitectónica',
    anio: '2025',
    descripcion:
      'Carpintería a medida para alcoba: tocador flotante con espejo retroiluminado y mueble de TV con nicho iluminado, en acabado mate con luz cálida integrada.',
    fotos: [
      {
        src: '/proyecto2/SaveClip.App_733726619_18109273118311608_854908423906778636_n.jpg',
        alt: 'Tocador flotante con espejo circular retroiluminado y poltrona',
      },
      {
        src: '/proyecto2/SaveClip.App_734872156_18109273115311608_7809662825624821597_n.jpg',
        alt: 'Tocador y puertas de alcoba con espejo de luz cálida',
      },
      {
        src: '/proyecto2/SaveClip.App_735178750_18109273127311608_2195169031589428926_n.jpg',
        alt: 'Mueble de TV flotante con nicho vertical iluminado',
      },
    ] as { src: string; alt: string }[],
  },
];

export const proyectoDestacado = proyectos[0];

// Reels reales de @mobi_arquitectura (sección 05). Para cambiar uno: pegar el
// enlace y guardar su portada vertical (9:16, idealmente 720×1280) en
// public/instagram/. Sin cifras de likes ni comentarios: no se inventan métricas.
export const instagramPosts = [
  {
    url: 'https://www.instagram.com/reel/Ddud8nsJFFn/',
    foto: '/instagram/reel-Ddud8nsJFFn.webp',
    ancho: 720,
    alto: 1280,
    etiqueta: 'Barra comercial',
    alt: 'Barra de negocio con iluminación LED cálida, lámparas colgantes y taburetes',
  },
  {
    url: 'https://www.instagram.com/reel/DcjwoW8vidh/',
    foto: '/instagram/reel-DcjwoW8vidh.webp',
    ancho: 720,
    alto: 1280,
    etiqueta: 'Puertas Luxury', // 🔶 confirmar etiqueta con el cliente
    alt: 'Terraza con techo en madera, ventilador, comedor con mesa de mosaico y sala exterior',
  },
  {
    url: 'https://www.instagram.com/reel/DcJ7O2ipseh/',
    foto: '/instagram/reel-DcJ7O2ipseh.webp',
    ancho: 720,
    alto: 1280,
    etiqueta: 'Obra en sitio', // 🔶 confirmar etiqueta con el cliente
    alt: 'Estructura con cubierta rosada ondulada, columnas turquesa y ventanas circulares',
  },
];

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
