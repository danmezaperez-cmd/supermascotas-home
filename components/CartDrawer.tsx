'use client'

import { useEffect, useRef } from 'react'
import { sugeridosCarrito } from '@/data/products'
import { SUSCRIPCION_OFF, useCart } from '@/lib/cart'
import { formatCOP } from '@/lib/format'
import { Icon } from './Icon'
import { FreeShipping } from './FreeShipping'
import { ProductArt } from './ProductArt'

/**
 * Cajón de carrito.
 *
 * Se DESMONTA cuando está cerrado. `opacity-0` y `translate-x-full` no sacan
 * nada del orden de foco: con esa técnica el usuario de teclado tabula dentro
 * de un panel invisible. Ese era uno de los bugs conocidos.
 */
export function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, count, setQty, remove, add } = useCart()
  const panel = useRef<HTMLDivElement>(null)
  const cerrar = useRef<HTMLButtonElement>(null)
  const previo = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    previo.current = document.activeElement as HTMLElement
    cerrar.current?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); closeCart(); return }
      if (e.key !== 'Tab' || !panel.current) return
      const focusables = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previo.current?.focus()
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  const sugeridos = sugeridosCarrito.filter((s) => !items.some((i) => i.id === s.id)).slice(0, 3)

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button" onClick={closeCart} aria-label="Cerrar el carrito"
        className="absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-[2px]"
      />
      <div
        ref={panel} role="dialog" aria-modal="true" aria-labelledby="carrito-h"
        className="absolute right-0 top-0 flex h-full w-full max-w-[26rem] flex-col bg-white shadow-e3 animate-slidein"
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <h2 id="carrito-h" className="text-subtitle">
            Tu carrito {count > 0 && <span className="text-muted">({count})</span>}
          </h2>
          <button
            ref={cerrar} type="button" onClick={closeCart} aria-label="Cerrar el carrito"
            className="ml-auto grid h-11 w-11 place-items-center rounded-pill text-ink transition-colors duration-base ease-soft hover:bg-brand-50"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="border-b border-line px-4 py-3">
          <FreeShipping />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="py-10 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-pill bg-brand-50 text-brand-500">
                <Icon name="bag" size={28} />
              </span>
              <p className="mt-3 text-subtitle">Tu carrito está vacío</p>
              <p className="mx-auto mt-1.5 max-w-[30ch] text-body text-muted">
                Empieza por las ofertas de la semana: todas traen el precio por kilo a la vista.
              </p>
              <button type="button" onClick={closeCart} className="btn btn-primary mt-4">Ver ofertas</button>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((i) => (
                <li key={`${i.id}-${i.suscripcion ? 's' : 'u'}`} className="flex gap-3 py-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md"><ProductArt product={i.product} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-body font-bold leading-snug">
                      {i.product.marca} {i.product.nombre}
                    </p>
                    <p className="text-small text-muted">{i.product.presentacion}</p>
                    {i.suscripcion && (
                      <span className="mt-1 inline-flex eyebrow-chip bg-lime-100 text-lime-800">
                        <Icon name="repeat" size={12} /> Suscripción −{Math.round(SUSCRIPCION_OFF * 100)}%
                      </span>
                    )}
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="inline-flex items-center rounded-pill shadow-inset1">
                        <button
                          type="button" onClick={() => setQty(i.id, i.qty - 1)}
                          aria-label={`Quitar una unidad de ${i.product.nombre}`}
                          className="grid h-9 w-9 place-items-center rounded-pill hover:bg-brand-50"
                        >
                          <Icon name="minus" size={15} />
                        </button>
                        <span className="w-7 text-center text-body font-bold" aria-live="polite">{i.qty}</span>
                        <button
                          type="button" onClick={() => setQty(i.id, i.qty + 1)}
                          aria-label={`Agregar una unidad de ${i.product.nombre}`}
                          className="grid h-9 w-9 place-items-center rounded-pill hover:bg-brand-50"
                        >
                          <Icon name="plus" size={15} />
                        </button>
                      </div>
                      <span className="ml-auto text-body font-extrabold">{formatCOP(i.total)}</span>
                      <button
                        type="button" onClick={() => remove(i.id)} aria-label={`Eliminar ${i.product.nombre} del carrito`}
                        className="grid h-9 w-9 place-items-center rounded-pill text-muted hover:bg-accent-50 hover:text-accent-700"
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Venta cruzada: sube el ticket y acerca el umbral de envío gratis. */}
          {sugeridos.length > 0 && (
            <section aria-labelledby="cross-h" className="border-t border-line py-4">
              <h3 id="cross-h" className="mb-2.5 text-small font-extrabold uppercase tracking-wide text-muted">
                Suele comprarse junto
              </h3>
              <ul className="space-y-2">
                {sugeridos.map((s) => (
                  <li key={s.id} className="flex items-center gap-2.5">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-sm"><ProductArt product={s} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-body font-bold">{s.marca} {s.nombre}</p>
                      <p className="text-small text-muted">{s.presentacion} · {formatCOP(s.precio)}</p>
                    </div>
                    <button type="button" onClick={() => add(s.id)} className="btn btn-sm btn-ghost shrink-0">
                      <Icon name="plus" size={15} /> Agregar
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="border-t border-line bg-cream px-4 py-3.5">
          <div className="flex items-baseline justify-between">
            <span className="text-body font-bold">Subtotal</span>
            <span className="text-[1.25rem] font-extrabold tracking-tight">{formatCOP(subtotal)}</span>
          </div>
          <p className="mt-0.5 text-small text-muted">Impuestos incluidos. El envío se calcula al pagar.</p>
          <button type="button" disabled={items.length === 0} className="btn btn-lg btn-primary mt-3 w-full">
            Finalizar compra
          </button>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-small text-muted">
            <Icon name="shield" size={14} className="text-lime-600" /> Pago seguro · PSE, tarjeta o contra entrega
          </p>
        </div>
      </div>
    </div>
  )
}
