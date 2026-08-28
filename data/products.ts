/**
 * Catálogo. Precios en COP.
 *
 * `packshot: null` en todo el catálogo: no disponemos de fotografía propia de
 * ninguno de estos SKU. Se renderizan con un tratamiento gráfico honesto
 * (silueta de envase + marca sobre color) en lugar de reutilizar la foto de
 * otro producto. Cuando llegue el packshot real, basta poner su data URI aquí.
 */

export type Categoria = 'perro' | 'gato' | 'otras'
export type Familia = 'alimento' | 'arena' | 'salud' | 'snack' | 'juguete'

export type Product = {
  id: string
  nombre: string
  marca: string
  categoria: Categoria
  familia: Familia
  linea: string
  presentacion: string
  pesoKg?: number
  precio: number
  precioAntes?: number
  rating: number
  resenas: number
  suscribible?: boolean
  promoHasta?: string
  stock: number
  packshot: string | null
}

export const products: Product[] = [
  {
    id: 'hills-science-diet-7plus', nombre: "Science Diet Adulto 7+ Pollo y Cebada", marca: "Hill's",
    categoria: 'perro', familia: 'alimento', linea: 'Alimento seco', presentacion: '6,8 kg', pesoKg: 6.8,
    precio: 189900, precioAntes: 229900, rating: 4.8, resenas: 214, suscribible: true,
    promoHasta: '2026-09-14', stock: 24, packshot: null,
  },
  {
    id: 'dog-chow-triple-proteina', nombre: 'Adultos Triple Proteína Razas Medianas', marca: 'Dog Chow',
    categoria: 'perro', familia: 'alimento', linea: 'Alimento seco', presentacion: '8 kg', pesoKg: 8,
    precio: 89900, precioAntes: 109900, rating: 4.6, resenas: 431, suscribible: true,
    promoHasta: '2026-09-07', stock: 62, packshot: null,
  },
  {
    id: 'royal-canin-dachshund-puppy', nombre: 'Dachshund Puppy', marca: 'Royal Canin',
    categoria: 'perro', familia: 'alimento', linea: 'Alimento seco', presentacion: '2,5 kg', pesoKg: 2.5,
    precio: 128900, rating: 4.9, resenas: 96, suscribible: true, stock: 11, packshot: null,
  },
  {
    id: 'nutrecan-adultos-medianas-grandes', nombre: 'Adultos Razas Medianas y Grandes', marca: 'Nutrecan',
    categoria: 'perro', familia: 'alimento', linea: 'Alimento seco', presentacion: '15 kg', pesoKg: 15,
    precio: 129900, precioAntes: 154900, rating: 4.5, resenas: 187, suscribible: true,
    promoHasta: '2026-09-14', stock: 38, packshot: null,
  },
  {
    id: 'proplan-adult-medianas', nombre: 'Adulto Razas Medianas Pollo', marca: 'Pro Plan',
    categoria: 'perro', familia: 'alimento', linea: 'Alimento seco', presentacion: '15 kg', pesoKg: 15,
    precio: 279900, precioAntes: 319900, rating: 4.8, resenas: 302, suscribible: true,
    promoHasta: '2026-09-07', stock: 19, packshot: null,
  },
  {
    id: 'agility-gold-cachorros', nombre: 'Cachorros Primera Fase', marca: 'Agility Gold',
    categoria: 'perro', familia: 'alimento', linea: 'Alimento seco', presentacion: '8 kg', pesoKg: 8,
    precio: 99900, precioAntes: 114900, rating: 4.4, resenas: 128, suscribible: true,
    promoHasta: '2026-09-14', stock: 44, packshot: null,
  },
  {
    id: 'chunky-adultos-25', nombre: 'Adultos Todas las Razas', marca: 'Chunky',
    categoria: 'perro', familia: 'alimento', linea: 'Alimento seco', presentacion: '25 kg', pesoKg: 25,
    precio: 189900, precioAntes: 214900, rating: 4.3, resenas: 156, suscribible: true,
    promoHasta: '2026-09-21', stock: 27, packshot: null,
  },
  {
    id: 'catchow-adultos', nombre: 'Adultos Carne, Pollo e Hígado', marca: 'Cat Chow',
    categoria: 'gato', familia: 'alimento', linea: 'Alimento seco', presentacion: '8 kg', pesoKg: 8,
    precio: 109900, precioAntes: 129900, rating: 4.5, resenas: 268, suscribible: true,
    promoHasta: '2026-09-07', stock: 33, packshot: null,
  },
  {
    id: 'proplan-cat-adult', nombre: 'Gato Adulto Pollo y Arroz', marca: 'Pro Plan',
    categoria: 'gato', familia: 'alimento', linea: 'Alimento seco', presentacion: '7,5 kg', pesoKg: 7.5,
    precio: 189900, rating: 4.7, resenas: 141, suscribible: true, stock: 21, packshot: null,
  },
  {
    id: 'fancy-feast-casserole-atun-salmon', nombre: 'Casserole Atún y Salmón', marca: 'Fancy Feast',
    categoria: 'gato', familia: 'alimento', linea: 'Alimento húmedo', presentacion: '85 g',
    precio: 5900, precioAntes: 6900, rating: 4.9, resenas: 512, promoHasta: '2026-09-07', stock: 240, packshot: null,
  },
  {
    id: 'fancy-feast-petit-filets-salmon', nombre: 'Petit Filets Salmón', marca: 'Fancy Feast',
    categoria: 'gato', familia: 'alimento', linea: 'Alimento húmedo', presentacion: '85 g',
    precio: 6400, rating: 4.8, resenas: 377, stock: 180, packshot: null,
  },
  {
    id: 'whiskas-adulto-carne', nombre: 'Adulto Carne', marca: 'Whiskas',
    categoria: 'gato', familia: 'alimento', linea: 'Alimento seco', presentacion: '1,5 kg', pesoKg: 1.5,
    precio: 28900, precioAntes: 33900, rating: 4.2, resenas: 203, promoHasta: '2026-09-14', stock: 95, packshot: null,
  },
  {
    id: 'fresh-step-aglomerante', nombre: 'Arena aglomerante con carbón activado', marca: 'Fresh Step',
    categoria: 'gato', familia: 'arena', linea: 'Arena sanitaria', presentacion: '11,3 kg', pesoKg: 11.3,
    precio: 79900, precioAntes: 94900, rating: 4.6, resenas: 189, promoHasta: '2026-09-14', stock: 52, packshot: null,
  },
  {
    id: 'cats-best-vegetal', nombre: 'Arena vegetal biodegradable', marca: "Cat's Best",
    categoria: 'gato', familia: 'arena', linea: 'Arena sanitaria', presentacion: '8,6 L',
    precio: 89900, rating: 4.7, resenas: 112, stock: 30, packshot: null,
  },
  {
    id: 'hills-kd-feline', nombre: 'Prescription Diet k/d Felino Renal', marca: "Hill's",
    categoria: 'gato', familia: 'alimento', linea: 'Alimento medicado', presentacion: '1,8 kg', pesoKg: 1.8,
    precio: 164900, rating: 4.9, resenas: 64, suscribible: true, stock: 9, packshot: null,
  },
  {
    id: 'bravecto-perros-10-20', nombre: 'Antipulgas y garrapatas 10–20 kg', marca: 'Bravecto',
    categoria: 'perro', familia: 'salud', linea: 'Antiparasitario', presentacion: '1 tableta · 3 meses',
    precio: 189900, precioAntes: 209900, rating: 4.8, resenas: 231, promoHasta: '2026-09-07', stock: 40, packshot: null,
  },
  {
    id: 'simparica-trio-5-10', nombre: 'Trio antiparasitario 5–10 kg', marca: 'Simparica',
    categoria: 'perro', familia: 'salud', linea: 'Antiparasitario', presentacion: '3 tabletas',
    precio: 189900, rating: 4.7, resenas: 88, stock: 26, packshot: null,
  },
  {
    id: 'dentastix-medianas', nombre: 'Dentastix Razas Medianas', marca: 'Pedigree',
    categoria: 'perro', familia: 'snack', linea: 'Snack dental', presentacion: '7 unidades',
    precio: 19900, precioAntes: 23900, rating: 4.6, resenas: 344, promoHasta: '2026-09-21', stock: 150, packshot: null,
  },
  {
    id: 'kong-classic-m', nombre: 'Classic juguete rellenable talla M', marca: 'Kong',
    categoria: 'perro', familia: 'juguete', linea: 'Juguete', presentacion: 'Talla M',
    precio: 59900, rating: 4.9, resenas: 176, stock: 48, packshot: null,
  },
  {
    id: 'nupec-gato-adulto', nombre: 'Gato Adulto', marca: 'Nupec',
    categoria: 'gato', familia: 'alimento', linea: 'Alimento seco', presentacion: '3 kg', pesoKg: 3,
    precio: 89900, precioAntes: 99900, rating: 4.5, resenas: 74, suscribible: true,
    promoHasta: '2026-09-21', stock: 22, packshot: null,
  },
  {
    id: 'nutrecan-hamster', nombre: 'Alimento para hámster y cobayo', marca: 'Nutrecan',
    categoria: 'otras', familia: 'alimento', linea: 'Alimento pequeñas especies', presentacion: '1 kg', pesoKg: 1,
    precio: 24900, rating: 4.4, resenas: 39, stock: 60, packshot: null,
  },
  {
    id: 'ringo-adultos-25', nombre: 'Adultos Carne', marca: 'Ringo',
    categoria: 'perro', familia: 'alimento', linea: 'Alimento seco', presentacion: '25 kg', pesoKg: 25,
    precio: 159900, rating: 4.1, resenas: 210, suscribible: true, stock: 35, packshot: null,
  },
]

export const byId = (id: string) => products.find((p) => p.id === id)

/** Ofertas ordenadas por ahorro porcentual. */
export const ofertas = products
  .filter((p) => p.precioAntes && p.precioAntes > p.precio)
  .sort((a, b) => (b.precioAntes! - b.precio) / b.precioAntes! - (a.precioAntes! - a.precio) / a.precioAntes!)

/** Más vendidos: prueba social real (reseñas × calificación). */
export const masVendidos = [...products]
  .sort((a, b) => b.resenas * b.rating - a.resenas * a.rating)
  .slice(0, 8)

/** Alimentos suscribibles, para la palanca de recompra. */
export const suscribibles = products.filter((p) => p.suscribible && p.pesoKg)

/** Venta cruzada del carrito: barato, alta rotación, complementa cualquier pedido. */
export const sugeridosCarrito = ['dentastix-medianas', 'fancy-feast-casserole-atun-salmon', 'kong-classic-m']
  .map(byId)
  .filter((p): p is Product => Boolean(p))
