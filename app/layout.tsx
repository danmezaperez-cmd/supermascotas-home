import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart'
import { TopBar } from '@/components/TopBar'
import { CartDrawer } from '@/components/CartDrawer'
import { StickyBuyBar } from '@/components/StickyBuyBar'
import { LiveAnnouncer } from '@/components/LiveAnnouncer'

/**
 * Metadatos con plantilla real. La auditoría encontró que la portada se
 * titulaba literalmente «Supermascotas» y que la meta descripción era la misma
 * palabra: ninguna página contenía el término que el cliente escribe en Google.
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://supermascotas.com.co'),
  title: {
    default: 'Supermascotas · Alimento, arena y clínica veterinaria en Cali · Envío el mismo día',
    template: '%s | Supermascotas Cali',
  },
  description:
    'Tienda de mascotas en Cali con clínica veterinaria propia y urgencias 24 h. Concentrado para perro y gato, arena y salud con envío gratis desde $99.900 y entrega el mismo día.',
  keywords: ['concentrado para perros Cali', 'alimento para gatos Cali', 'veterinaria 24 horas Cali', 'arena para gatos', 'tienda de mascotas Cali'],
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'Supermascotas',
    title: 'Supermascotas · Tienda de mascotas con clínica veterinaria propia en Cali',
    description: 'Concentrado, arena y salud con envío gratis desde $99.900 y entrega el mismo día en Cali. Clínica veterinaria propia con urgencias 24 h.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#173DA0',
  width: 'device-width',
  initialScale: 1,
  // Se permite ampliar hasta 500%: el zoom al 200% es un requisito, no una excepción.
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO">
      <body id="top">
        <CartProvider>
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-pill focus:bg-brand-600 focus:px-5 focus:py-3 focus:text-body focus:font-bold focus:text-white"
          >
            Saltar al contenido
          </a>
          <TopBar />
          <main id="contenido">{children}</main>
          <CartDrawer />
          <StickyBuyBar />
          <LiveAnnouncer />
        </CartProvider>
      </body>
    </html>
  )
}
