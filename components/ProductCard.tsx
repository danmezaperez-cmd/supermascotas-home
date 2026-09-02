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
      className={`btn btn-sm ${done ? 'btn-lime' : 'btn-primary'} ${block ? 'shrink-0 sm:w-full' : ''}`}
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
    <p className="text-small font-bold text-accent-700">
      {p.stock === 0 ? 'Sin existencias' : `Quedan ${p.stock}`}
    </p>
  )
}

/** Sello de descuento sobre la ilustración o el packshot. */
function SelloDescuento({ off }: { off: number }) {
  if (off <= 0) return null
  return (
    <span className="absolute left-0 top-0 rounded-br-md bg-accent-600 px-2 py-1 text-eyebrow font-extrabold leading-none text-white">
      −{off}%
    </span>
  )
}

/**
 * Variante `oferta`: tarjeta horizontal compacta. Densidad alta a propósito —
 * es la que tiene que caber en la primera pantalla con precio y botón.
 *
 * El nombre NO se trunca: se deja envolver. Antes usaba `truncate` y cortaba
 * «Science Diet Adulto 7+ Small Bites Pollo y Cebada» a media palabra.
 */
export function OfertaCard({ p }: { p: Product }) {
  const off = discountPct(p.precio, p.precioAntes)
  const kilo = pricePerKilo(p.precio, p.pesoKg)
  return (
    <article data-card="oferta" className="card card-hover flex h-full w-full flex-col overflow-hidden">
      <div className="flex gap-3 p-3 pb-2">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
          <ProductArt product={p} />
          <SelloDescuento off={off} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Marca y presentación comparten línea: dos renglones de metadato
              seguidos empujaban el botón fuera de la primera pantalla. */}
          <p className="truncate text-small leading-tight">
            <span className="font-bold uppercase tracking-wide text-brand-600">{p.marca}</span>
            <span className="text-muted"> · {p.presentacion}</span>
          </p>
          <h3 className="mt-0.5 text-body font-bold leading-snug">{p.nombre}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <Stars value={p.rating} reviews={p.resenas} size={12} />
            {p.promoHasta && (
              // Sin viñeta inicial: al envolver quedaba un «·» abriendo línea
              <span className="whitespace-nowrap text-small text-muted">Hasta {promoDeadlineShort(p.promoHasta)}</span>
            )}
          </p>
          <StockHint p={p} />
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-line px-3 py-1.5">
        <div className="min-w-0">
          <p data-price="" className="flex items-baseline gap-x-1.5 whitespace-nowrap">
            <span className="text-[1.0625rem] font-extrabold leading-tight tracking-tight">{formatCOP(p.precio)}</span>
            {off > 0 && <s className="text-small text-muted">{formatCOP(p.precioAntes!)}</s>}
          </p>
          {kilo && <p className="text-small leading-tight text-muted">{kilo}</p>}
        </div>
        <AddButton p={p} />
      </div>
    </article>
  )
}

/**
 * Variante completa, para «Más vendidos».
 *
 * Cambia de forma, no solo de tamaño. Por debajo de 640 px reutiliza la
 * estructura compacta de la tarjeta de ofertas —imagen al costado y fila de
 * precio abajo—, que es la que funciona en un ancho de pulgar; desde ahí es
 * vertical con la imagen a todo lo ancho.
 *
 * El nombre no se recorta en ningún ancho: antes un `line-clamp-2` lo cortaba
 * entre 320 y 1100 px. El sello «Suscribible» es un chip en línea y no una
 * etiqueta absoluta sobre la imagen, donde no cabía en la versión estrecha.
 */
export function ProductCard({ p }: { p: Product }) {
  const off = discountPct(p.precio, p.precioAntes)
  return (
    <article data-card="producto" className="card card-hover flex h-full w-full flex-col overflow-hidden">
      <div className="flex gap-3 p-3 pb-2 sm:block sm:p-0">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md sm:aspect-square sm:h-auto sm:w-full sm:rounded-none">
          <ProductArt product={p} />
          <SelloDescuento off={off} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col sm:gap-1 sm:p-4 sm:pb-2">
          <p className="truncate text-small leading-tight">
            <span className="font-bold uppercase tracking-wide text-brand-600">{p.marca}</span>
            <span className="text-muted"> · {p.presentacion}</span>
          </p>
          <h3 className="mt-0.5 text-body font-bold leading-snug">{p.nombre}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <Stars value={p.rating} reviews={p.resenas} size={12} />
            {p.suscribible && (
              <span className="eyebrow-chip bg-brand-50 text-brand-700">
                <Icon name="repeat" size={12} /> Suscribible
              </span>
            )}
          </p>
          <StockHint p={p} />
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-line px-3 py-1.5 sm:flex-col sm:items-stretch sm:gap-2.5 sm:border-t-0 sm:px-4 sm:pb-4 sm:pt-1">
        <div className="min-w-0 sm:w-full">
          <Price p={p} conChipDescuento={false} />
        </div>
        <AddButton p={p} block />
      </div>
    </article>
  )
}
