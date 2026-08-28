import { BannerSystem } from '@/components/BannerSystem'
import { QuickNav } from '@/components/QuickNav'
import { OffersRail } from '@/components/OffersRail'
import { PromiseBand } from '@/components/PromiseBand'
import { BestSellers } from '@/components/BestSellers'
import { Subscription } from '@/components/Subscription'
import { Clinic } from '@/components/Clinic'
import { Testimonials } from '@/components/Testimonials'
import { Stores } from '@/components/Stores'
import { Brands } from '@/components/Brands'
import { Newsletter } from '@/components/Newsletter'
import { Footer } from '@/components/Footer'

/**
 * Orden del home. La intención de cada bloque:
 *  1. Banners      — el mejor espacio de la página vende campañas, no explica la marca.
 *  2. Accesos      — atajo a categoría para quien llega con una tarea concreta.
 *  3. Ofertas      — primer producto comprable, dentro de la primera pantalla.
 *  4. Promesas     — envío, pago y clínica como señales de confianza, no como cartel.
 *  5. Más vendidos — prueba social visible.
 *  6. Suscripción  — la palanca de valor de vida más grande del negocio.
 *  7. Clínica      — el diferenciador, tratado como servicio vendible.
 *  8. Reseñas · Sedes · Marcas · Newsletter.
 */
export default function Home() {
  return (
    <>
      <BannerSystem />
      <QuickNav />
      <OffersRail />
      <PromiseBand />
      <BestSellers />
      <Subscription />
      <Clinic />
      <Testimonials />
      <Stores />
      <Brands />
      <Newsletter />
      <Footer />
    </>
  )
}
