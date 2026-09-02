'use client'

import { useCart } from '@/lib/cart'
import { formatCOP } from '@/lib/format'
import { site } from '@/data/site'
import { Icon } from './Icon'

/**
 * Progreso hacia envío gratis. La palanca de ticket promedio más directa que
 * existe: convierte «me faltan $12.400» en un motivo concreto para agregar algo.
 */
export function FreeShipping({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { faltaParaEnvioGratis, progresoEnvio, subtotal } = useCart()
  const logrado = faltaParaEnvioGratis === 0 && subtotal > 0
  const pct = Math.round(progresoEnvio * 100)

  return (
    <div>
      <p className={`flex items-center gap-1.5 text-small font-bold ${tone === 'dark' ? 'text-white' : 'text-ink'}`}>
        <Icon name="truck" size={15} className={logrado ? 'text-lime-600' : 'text-brand-600'} />
        {logrado ? (
          <span>¡Listo! Tu envío es <strong>gratis</strong>.</span>
        ) : subtotal === 0 ? (
          <span>Envío gratis desde {formatCOP(site.envioGratisDesde)}</span>
        ) : (
          <span>Te faltan <strong>{formatCOP(faltaParaEnvioGratis)}</strong> para envío gratis</span>
        )}
      </p>
      <div
        className={`mt-1.5 h-1.5 w-full overflow-hidden rounded-pill ${tone === 'dark' ? 'bg-white/20' : 'bg-brand-100'}`}
        role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
        aria-label="Progreso hacia envío gratis"
      >
        <div
          className={`h-full rounded-pill transition-[width] duration-slow ease-soft ${logrado ? 'bg-lime-500' : 'bg-brand-600'}`}
          style={{ width: `${Math.max(pct, subtotal > 0 ? 6 : 0)}%` }}
        />
      </div>
    </div>
  )
}
