/** Datos de negocio de Supermascotas — Surticampo S.A.S., Cali, Colombia. */

export const site = {
  nombre: 'Supermascotas',
  razonSocial: 'Surticampo S.A.S.',
  ciudad: 'Cali',
  anios: 10,
  cupon: 'BIENVENIDO10',
  envioGratisDesde: 99900,
  telefonoClinica: '(602) 485 2020',
  urgencias: '24 h, todos los días',
} as const

/** Promesas de servicio. Orden = importancia para la decisión de compra. */
export const promesas = [
  { id: 'envio', icon: 'truck', titulo: 'Envío gratis desde $99.900', detalle: 'En Cali y Jamundí' },
  { id: 'mismodia', icon: 'clock', titulo: 'Entrega el mismo día', detalle: 'Pedidos antes de las 2 p.m.' },
  { id: 'contraentrega', icon: 'wallet', titulo: 'Pago contra entrega', detalle: 'También PSE y tarjeta' },
  { id: 'devoluciones', icon: 'rotate', titulo: 'Devoluciones a 30 días', detalle: 'Producto sin abrir' },
  { id: 'clinica', icon: 'cross', titulo: 'Asesoría veterinaria incluida', detalle: 'Clínica propia, urgencias 24 h' },
] as const

/** Accesos rápidos. Deben caber en la primera pantalla. */
export const accesos = [
  { id: 'perros', label: 'Perros', icon: 'dog', href: '#mas-vendidos' },
  { id: 'gatos', label: 'Gatos', icon: 'cat', href: '#mas-vendidos' },
  { id: 'otras', label: 'Otras', icon: 'bird', href: '#mas-vendidos' },
  { id: 'ofertas', label: 'Ofertas', icon: 'tag', href: '#ofertas' },
  { id: 'clinica', label: 'Clínica', icon: 'cross', href: '#clinica' },
] as const

export const sedes = [
  { id: 'pasoancho', nombre: 'Paso Ancho', direccion: 'Cra. 42 #13-55', horario: 'Lun a sáb 8 a.m. – 8 p.m. · Dom 9 a.m. – 5 p.m.', clinica: true, destacada: true },
  { id: 'ciudadjardin', nombre: 'Ciudad Jardín', direccion: 'Cra. 105 #16-120', horario: 'Lun a sáb 8 a.m. – 8 p.m.', clinica: true, destacada: false },
  { id: 'norte', nombre: 'Norte · Chipichape', direccion: 'Av. 6N #23DN-51', horario: 'Lun a dom 9 a.m. – 8 p.m.', clinica: false, destacada: false },
  { id: 'sur', nombre: 'Valle del Lili', direccion: 'Cra. 98 #25-70', horario: 'Lun a sáb 8 a.m. – 8 p.m.', clinica: false, destacada: false },
  { id: 'jamundi', nombre: 'Jamundí', direccion: 'Cl. 12 #10-34', horario: 'Lun a sáb 8 a.m. – 7 p.m.', clinica: false, destacada: false },
] as const

/** Servicios de la clínica, tratados como producto vendible. */
export const serviciosClinica = [
  { id: 'consulta', titulo: 'Consulta general', desde: 65000, detalle: 'Valoración completa y plan de manejo.' },
  { id: 'urgencias', titulo: 'Urgencias 24 h', desde: 95000, detalle: 'Atención inmediata, todos los días del año.' },
  { id: 'laboratorio', titulo: 'Laboratorio propio', desde: 78000, detalle: 'Hemograma y química sanguínea el mismo día.' },
  { id: 'imagenes', titulo: 'Imágenes diagnósticas', desde: 120000, detalle: 'Radiografía digital y ecografía.' },
  { id: 'cirugia', titulo: 'Cirugía y esterilización', desde: 240000, detalle: 'Quirófano equipado y hospitalización.' },
] as const

export const marcas = [
  "Hill's", 'Royal Canin', 'Pro Plan', 'Dog Chow', 'Nutrecan',
  'Fancy Feast', 'Whiskas', 'Agility Gold', 'Chunky', "Cat's Best",
] as const

export const testimonios = [
  { id: 't1', nombre: 'Ana María R.', sede: 'Ciudad Jardín', estrellas: 5, texto: 'Pedí a las 11 a.m. y el bulto llegó a las 4 p.m. La veterinaria me llamó después para preguntar cómo le cayó el alimento a Nuba.' },
  { id: 't2', nombre: 'Camilo O.', sede: 'Paso Ancho', estrellas: 5, texto: 'Llevé a mi gato de urgencia un domingo a las 2 a.m. y había veterinario. Eso no lo encuentro en ninguna otra parte de Cali.' },
  { id: 't3', nombre: 'Valentina G.', sede: 'Norte', estrellas: 4, texto: 'La suscripción me quitó el problema de acordarme. Llega sola cada mes y sale más barata que en el supermercado.' },
] as const
