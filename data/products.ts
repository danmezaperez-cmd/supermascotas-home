/**
 * Catálogo. Precios en COP.
 *
 * El packshot NO se declara aquí: se resuelve por id contra data/packshots.ts,
 * que genera scripts/gen-packshots.mjs a partir de assets/packshots/<id>.png.
 * Un SKU sin archivo propio se dibuja con su ilustración de envase; nunca
 * hereda la foto de otro producto —el bug del catálogo heredado, donde la
 * arena para gatos mostraba una lata y un alimento propio mostraba una bolsa
 * de la competencia.
 */
import { packshots } from './packshots'

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
  /** Resuelto por id contra data/packshots.ts. `null` = sin foto propia. */
  packshot: string | null
}

type Catalogo = Omit<Product, 'packshot'>

const catalogo: Catalogo[] = [
  {
    id: 'hills-science-diet-7plus', nombre: 'Science Diet Adulto 7+ Small Bites Pollo y Cebada', marca: "Hill's",
    categoria: 'perro', familia: 'alimento', linea: 'Alimento seco', presentacion: '6,8 kg', pesoKg: 6.8,
    precio: 189900, precioAntes: 229900, rating: 4.8, resenas: 214, suscribible: true,
    promoHasta: '2026-09-14', stock: 24,
  },
  {
    id: 'dog-chow-triple-proteina', nombre: 'Adultos Triple Proteína Carne, Pollo y Pescado', marca: 'Dog Chow',
    categoria: 'perro', familia: 'alimento', linea: 'Alimento seco', presentacion: '22,7 kg', pesoKg: 22.7,
    precio: 219900, precioAntes: 259900, rating: 4.6, resenas: 431, suscribible: true,
    promoHasta: '2026-09-07', stock: 62,
  },
  {
    id: 'royal-canin-dachshund-puppy', nombre: 'Dachshund Puppy', marca: 'Royal Canin',
    categoria: 'perro', familia: 'alimento', linea: 'Alimento seco', presentacion: '2,5 kg', pesoKg: 2.5,
    precio: 128900, rating: 4.9, resenas: 96, suscribible: true, stock: 11,
  },
  {
    id: 'nutrecan-adultos-medianas-grandes', nombre: 'Premium Adultos Razas Medianas y Grandes', marca: 'Nutrecan',
    categoria: 'perro', familia: 'alimento', linea: 'Alimento seco', presentacion: '8 kg', pesoKg: 8,
    precio: 89900, precioAntes: 104900, rating: 4.5, resenas: 187, suscribible: true,
    promoHasta: '2026-09-14', stock: 38,
  },
  {
    id: 'proplan-adult-medianas', nombre: 'Adulto Razas Medianas Pollo', marca: 'Pro Plan',
    categoria: 'perro', familia: 'alimento', linea: 'Alimento seco', presentacion: '15 kg', pesoKg: 15,
    precio: 279900, precioAntes: 319900, rating: 4.8, resenas: 302, suscribible: true,
    promoHasta: '2026-09-07', stock: 19,
  },
  {
    id: 'agility-gold-cachorros', nombre: 'Cachorros Primera Fase', marca: 'Agility Gold',
    categoria: 'perro', familia: 'alimento', linea: 'Alimento seco', presentacion: '8 kg', pesoKg: 8,
    precio: 99900, precioAntes: 114900, rating: 4.4, resenas: 128, suscribible: true,
    promoHasta: '2026-09-14', stock: 44,
  },
  {
    id: 'chunky-adultos-25', nombre: 'Adultos Todas las Razas', marca: 'Chunky',
    categoria: 'perro', familia: 'alimento', linea: 'Alimento seco', presentacion: '25 kg', pesoKg: 25,
    precio: 189900, precioAntes: 214900, rating: 4.3, resenas: 156, suscribible: true,
    promoHasta: '2026-09-21', stock: 27,
  },
  {
    id: 'catchow-adultos', nombre: 'Adultos Carne, Pollo e Hígado', marca: 'Cat Chow',
    categoria: 'gato', familia: 'alimento', linea: 'Alimento seco', presentacion: '8 kg', pesoKg: 8,
    precio: 109900, precioAntes: 129900, rating: 4.5, resenas: 268, suscribible: true,
    promoHasta: '2026-09-07', stock: 33,
  },
  {
    id: 'proplan-cat-adult', nombre: 'Gato Adulto Pollo y Arroz', marca: 'Pro Plan',
    categoria: 'gato', familia: 'alimento', linea: 'Alimento seco', presentacion: '7,5 kg', pesoKg: 7.5,
    precio: 189900, rating: 4.7, resenas: 141, suscribible: true, stock: 21,
  },
  {
    id: 'fancy-feast-casserole-atun-salmon', nombre: 'Casserole Atún y Salmón', marca: 'Fancy Feast',
    categoria: 'gato', familia: 'alimento', linea: 'Alimento húmedo', presentacion: '85 g',
    precio: 5900, precioAntes: 6900, rating: 4.9, resenas: 512, promoHasta: '2026-09-07', stock: 240,
  },
  {
    id: 'fancy-feast-petit-filets-salmon', nombre: 'Petit Filets Salmón', marca: 'Fancy Feast',
    categoria: 'gato', familia: 'alimento', linea: 'Alimento húmedo', presentacion: '85 g',
    precio: 6400, rating: 4.8, resenas: 377, stock: 180,
  },
  {
    id: 'felix-classic-atun', nombre: 'Classic trocitos jugosos con atún', marca: 'Felix',
    categoria: 'gato', familia: 'alimento', linea: 'Alimento húmedo', presentacion: '85 g',
    precio: 4900, precioAntes: 5600, rating: 4.7, resenas: 289, promoHasta: '2026-09-14', stock: 320,
  },
  {
    id: 'whiskas-adulto-carne', nombre: 'Adulto Carne', marca: 'Whiskas',
    categoria: 'gato', familia: 'alimento', linea: 'Alimento seco', presentacion: '1,5 kg', pesoKg: 1.5,
    precio: 28900, precioAntes: 33900, rating: 4.2, resenas: 203, promoHasta: '2026-09-14', stock: 95,
  },
  {
    id: 'fresh-step-aglomerante', nombre: 'Arena aglomerante con carbón activado', marca: 'Fresh Step',
    categoria: 'gato', familia: 'arena', linea: 'Arena sanitaria', presentacion: '11,3 kg', pesoKg: 11.3,
    precio: 79900, precioAntes: 94900, rating: 4.6, resenas: 189, promoHasta: '2026-09-14', stock: 52,
  },
  {
    id: 'cats-best-vegetal', nombre: 'Arena vegetal biodegradable', marca: "Cat's Best",
    categoria: 'gato', familia: 'arena', linea: 'Arena sanitaria', presentacion: '8,6 L',
    precio: 89900, rating: 4.7, resenas: 112, stock: 30,
  },
  {
    id: 'hills-kd-feline', nombre: 'Prescription Diet k/d Felino Renal', marca: "Hill's",
    categoria: 'gato', familia: 'alimento', linea: 'Alimento medicado', presentacion: '1,8 kg', pesoKg: 1.8,
    precio: 164900, rating: 4.9, resenas: 64, suscribible: true, stock: 9,
  },
  {
    id: 'bravecto-perros-10-20', nombre: 'Antipulgas y garrapatas 10–20 kg', marca: 'Bravecto',
    categoria: 'perro', familia: 'salud', linea: 'Antiparasitario', presentacion: '1 tableta · 3 meses',
    precio: 189900, precioAntes: 209900, rating: 4.8, resenas: 231, promoHasta: '2026-09-07', stock: 40,
  },
  {
    id: 'simparica-trio-5-10', nombre: 'Trio antiparasitario 5–10 kg', marca: 'Simparica',
    categoria: 'perro', familia: 'salud', linea: 'Antiparasitario', presentacion: '3 tabletas',
    precio: 189900, rating: 4.7, resenas: 88, stock: 26,
  },
  {
    id: 'dentastix-medianas', nombre: 'Dentastix Razas Medianas', marca: 'Pedigree',
    categoria: 'perro', familia: 'snack', linea: 'Snack dental', presentacion: '7 unidades',
    precio: 19900, precioAntes: 23900, rating: 4.6, resenas: 344, promoHasta: '2026-09-21', stock: 150,
  },
  {
    id: 'kong-classic-m', nombre: 'Classic juguete rellenable talla M', marca: 'Kong',
    categoria: 'perro', familia: 'juguete', linea: 'Juguete', presentacion: 'Talla M',
    precio: 59900, rating: 4.9, resenas: 176, stock: 48,
  },
  {
    id: 'nupec-gato-adulto', nombre: 'Gato Adulto', marca: 'Nupec',
    categoria: 'gato', familia: 'alimento', linea: 'Alimento seco', presentacion: '3 kg', pesoKg: 3,
    precio: 89900, precioAntes: 99900, rating: 4.5, resenas: 74, suscribible: true,
    promoHasta: '2026-09-21', stock: 22,
  },
  {
    id: 'nutrecan-hamster', nombre: 'Alimento para hámster y cobayo', marca: 'Nutrecan',
    categoria: 'otras', familia: 'alimento', linea: 'Alimento pequeñas especies', presentacion: '1 kg', pesoKg: 1,
    precio: 24900, rating: 4.4, resenas: 39, stock: 60,
  },
  {
    id: 'ringo-adultos-25', nombre: 'Adultos Carne', marca: 'Ringo',
    categoria: 'perro', familia: 'alimento', linea: 'Alimento seco', presentacion: '25 kg', pesoKg: 25,
    precio: 159900, rating: 4.1, resenas: 210, suscribible: true, stock: 35,
  },
]

/** El catálogo con su fotografía resuelta. Añadir un packshot = añadir un archivo. */
export const products: Product[] = catalogo.map((p) => ({ ...p, packshot: packshots[p.id] ?? null }))

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
