import type { PhotoKey } from '@/data/photos'

/**
 * Sistema publicitario. El layout se arma desde estos datos, no desde JSX.
 * Cambiar la campaña = editar este array.
 *
 * Regla de fotografía: un banner solo muestra fotografía de lo que realmente
 * retrata (una mascota, la clínica). Ningún banner muestra el packshot de un
 * producto, porque hoy no tenemos packshots propios verificados.
 */
export type BannerVariante = 'principal' | 'secundario'
export type BannerTono = 'brand' | 'ink' | 'lime' | 'sun' | 'cream'

export type Banner = {
  id: string
  variante: BannerVariante
  /** Sirve para campaña, marca aliada, categoría en oferta o servicio de clínica. */
  proposito: 'campana' | 'categoria' | 'marca' | 'servicio'
  eyebrow: string
  titulo: string
  bajada?: string
  cta: { label: string; href: string }
  foto?: PhotoKey
  tono: BannerTono
  /** Sello de urgencia honesta: fecha real de fin. */
  vigenteHasta?: string
}

export const banners: Banner[] = [
  {
    id: 'ofertas-alimento',
    variante: 'principal',
    proposito: 'campana',
    eyebrow: 'Ofertas de septiembre',
    titulo: 'Hasta 25% en alimento para perro',
    bajada: 'Precio por kilo a la vista, para comparar de verdad.',
    cta: { label: 'Ver ofertas', href: '#ofertas' },
    foto: 'bannerOfertas',
    tono: 'brand',
    vigenteHasta: '2026-09-14',
  },
  {
    id: 'clinica-24h',
    variante: 'principal',
    proposito: 'servicio',
    eyebrow: 'Solo en Supermascotas',
    titulo: 'Clínica veterinaria propia, urgencias 24 h',
    bajada: 'Laboratorio e imágenes en la misma sede.',
    cta: { label: 'Agendar consulta', href: '#clinica' },
    foto: 'bannerClinica',
    tono: 'ink',
  },
  {
    id: 'suscripcion',
    variante: 'principal',
    proposito: 'campana',
    eyebrow: 'Suscripción de alimento',
    titulo: '12% menos en cada bulto, siempre',
    bajada: 'Llega solo cada 30 o 45 días. Cancelas cuando quieras.',
    cta: { label: 'Calcular mi ahorro', href: '#suscripcion' },
    foto: 'bannerSuscripcion',
    tono: 'brand',
  },
  {
    id: 'mundo-gato',
    variante: 'secundario',
    proposito: 'categoria',
    eyebrow: 'Mundo gato',
    titulo: 'Alimento y arena hasta 20% menos',
    cta: { label: 'Ver gatos', href: '#mas-vendidos' },
    foto: 'bannerGatos',
    tono: 'lime',
    vigenteHasta: '2026-09-14',
  },
  {
    id: 'agenda-cita',
    variante: 'secundario',
    proposito: 'servicio',
    eyebrow: 'Clínica',
    titulo: 'Agenda hoy y te atendemos hoy',
    cta: { label: 'Pedir cita', href: '#clinica' },
    foto: 'bannerAgenda',
    tono: 'sun',
  },
]

export const bannersPrincipales = banners.filter((b) => b.variante === 'principal')
export const bannersSecundarios = banners.filter((b) => b.variante === 'secundario')
