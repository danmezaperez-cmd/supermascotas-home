'use client'

import { useCart } from '@/lib/cart'
import { discountPct, formatCOP, pricePerKilo, promoDeadlineShort } from '@/lib/format'
import type { Product } from '@/data/products'
import { Icon } from './Icon'
import { Price, Stars } from './Bits'
import { ProductArt } from './ProductArt'

function AddButton({ p, block = false }: { p: Product; block?: boolean }) {
  const { add, justAdded } = useCart()
  const done = justAdded === p.id
  const agotado = p.stock <= 0
  return (
    <button
      type="button"
      disabled={agotado}
      onClick={() => add(p.id)}
      aria-label={`Agregar ${p.marca} ${p.nombre} al carrito`}
      data-add=""
      className={`btn btn-sm ${done ? 'btn-lime' : 'btn-primary'} ${block ? 'w-full' : ''}`}
    >
      {agotado ? (
        'Agotado'
      ) : done ? (
        <>
          <span className="animate-pop"><Icon name="check" size={17} /></span>
          Agregado
        </>
      ) : (
        <>
          <Icon name="cart" size={17} />
          Agregar
        </>
      )}
    </button>
  )
}

/** Aviso de existencias bajas — solo cuando es cierto. */
function StockHint({ p }: { p: Product }) {
  if (p.stock > 12) return null
  return (
    <p className="text-micro font-bold text-accent-700">
      {p.stock === 0 ? 'Sin existencias' : `Quedan ${p.stock}`}
    </p>
  )
}

/**
 * Variante `oferta`: tarjeta horizontal compacta. Densidad alta a propósito —
 * es la que tiene que caber en la primera pantalla con precio y botón.
 */
export function OfertaCard({ p }: { p: Product }) {
  const off = discountPct(p.precio, p.precioAntes)
  const kilo = pricePerKilo(p.precio, p.pesoKg)
  return (
    <article data-card="oferta" className="card card-hover flex h-full w-full flex-col overflow-hidden">
      <div className="flex gap-2.5 p-2.5 pb-2">
        <div className="relative h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-md">
          <ProductArt product={p} />
          {off > 0 && (
            <span className="absolute left-0 top-0 rounded-br-md bg-accent-600 px-1.5 py-0.5 text-[0.625rem] font-extrabold leading-tight text-white">
              −{off}%
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="truncate text-micro font-bold uppercase leading-tight tracking-wide text-brand-600">{p.marca}</p>
          <h3 className="truncate text-body font-bold leading-snug">{p.nombre}</h3>
          <p className="mt-0.5 flex min-w-0 items-center gap-1.5">
            <Stars value={p.rating} reviews={p.resenas} size={12} />
            {p.promoHasta && (
              <span className="whitespace-nowrap text-micro text-muted">· hasta {promoDeadlineShort(p.promoHasta)}</span>
            )}
          </p>
          <p className="truncate text-micro text-muted">
            {p.presentacion}{kilo && ` · ${kilo}`}
          </p>
          <StockHint p={p} />
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-line px-2.5 py-2">
        <p data-price="" className="flex items-baseline gap-x-1.5 whitespace-nowrap">
          <span className="text-[1.0625rem] font-extrabold leading-tight tracking-tight">{formatCOP(p.precio)}</span>
          {off > 0 && <s className="text-micro text-muted">{formatCOP(p.precioAntes!)}</s>}
        </p>
        <AddButton p={p} />
      </div>
    </article>
  )
}

/** Variante completa, para “Más vendidos”. */
export function ProductCard({ p }: { p: Product }) {
  return (
    <article data-card="producto" className="card card-hover flex h-full w-full flex-col overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <ProductArt product={p} />
        {p.suscribible && (
          <span className="absolute left-2 top-2 eyebrow-chip bg-white/92 text-brand-700 shadow-e1">
            <Icon name="repeat" size={12} /> Suscribible
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="min-w-0">
          <p className="truncate text-micro font-bold uppercase tracking-wide text-brand-600">{p.marca}</p>
          <h3 className="line-clamp-2 min-h-[2.6em] text-body font-bold leading-snug">
            {p.nombre} <span className="font-medium text-muted">· {p.presentacion}</span>
          </h3>
        </div>
        <Stars value={p.rating} reviews={p.resenas} size={12} />
        <Price p={p} />
        <StockHint p={p} />
        <div className="mt-auto pt-1">
          <AddButton p={p} block />
        </div>
      </div>
    </article>
  )
}
