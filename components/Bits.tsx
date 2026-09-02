import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { discountPct, formatCOP, pricePerKilo } from '@/lib/format'
import type { Product } from '@/data/products'

/** Prueba social. Estrellas en amarillo del sistema, siempre sobre texto oscuro. */
export function Stars({ value, reviews, size = 13 }: { value: number; reviews?: number; size?: number }) {
  const full = Math.round(value)
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <span className="flex" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Icon key={i} name="star" size={size} filled className={i < full ? 'text-sun-500' : 'text-brand-100'} />
        ))}
      </span>
      <span className="text-small font-bold text-ink">{value.toFixed(1)}</span>
      {reviews !== undefined && <span className="text-small text-muted">({reviews})</span>}
      <span className="sr-only">
        {value.toFixed(1)} de 5 estrellas{reviews !== undefined ? `, ${reviews} reseñas` : ''}
      </span>
    </span>
  )
}

/** Precio tachado + % de ahorro + precio por kilo. Nunca "precio regular" a secas. */
export function Price({ p, compact = false }: { p: Product; compact?: boolean }) {
  const off = discountPct(p.precio, p.precioAntes)
  const kilo = pricePerKilo(p.precio, p.pesoKg)
  return (
    <div data-price="">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 [&>*]:whitespace-nowrap">
        <span className={compact ? 'text-[1.0625rem] font-extrabold tracking-tight' : 'text-[1.25rem] font-extrabold tracking-tight'}>
          {formatCOP(p.precio)}
        </span>
        {off > 0 && (
          <>
            <s className="text-small text-muted">{formatCOP(p.precioAntes!)}</s>
            <span className="rounded-pill bg-accent-50 px-2 py-0.5 text-small font-extrabold text-accent-700">
              −{off}%
            </span>
          </>
        )}
      </div>
      {kilo && <p className="mt-1 text-small text-muted">{kilo}</p>}
    </div>
  )
}

export function SectionHeader({
  id, eyebrow, titulo, bajada, accion, tone = 'light',
}: {
  id?: string; eyebrow?: string; titulo: string; bajada?: string
  accion?: ReactNode; tone?: 'light' | 'dark'
}) {
  return (
    <div className="mb-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-5">
      <div className="min-w-0">
        {eyebrow && (
          <p className={`mb-2 text-eyebrow uppercase ${tone === 'dark' ? 'text-brand-200' : 'text-brand-600'}`}>
            {eyebrow}
          </p>
        )}
        <h2 id={id} className={`text-title ${tone === 'dark' ? 'text-white' : 'text-ink'}`}>{titulo}</h2>
        {bajada && (
          <p className={`mt-2 max-w-[54ch] text-body ${tone === 'dark' ? 'text-brand-100' : 'text-muted'}`}>{bajada}</p>
        )}
      </div>
      {accion}
    </div>
  )
}

/** Sello de urgencia honesta: fecha real, sin contadores falsos. */
export function VigenciaChip({ children, tone = 'sun' }: { children: ReactNode; tone?: 'sun' | 'accent' | 'white' }) {
  const cls =
    tone === 'accent' ? 'bg-accent-50 text-accent-700'
    : tone === 'white' ? 'bg-white/90 text-ink'
    : 'bg-sun-300 text-ink'
  return (
    <span className={`eyebrow-chip ${cls}`}>
      <Icon name="clock" size={13} />
      {children}
    </span>
  )
}
