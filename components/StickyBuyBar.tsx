'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart'
import { formatCOP } from '@/lib/format'
import { FreeShipping } from './FreeShipping'

/**
 * Barra de compra fija, solo en móvil.
 *
 * No duplica ningún CTA visible: la barra superior abre el carrito, esta
 * lleva directo a pagar y muestra el progreso hacia envío gratis, que no
 * aparece en ninguna otra parte de la pantalla. Se monta solo cuando hay algo
 * que pagar, y se desmonta —no se oculta con opacity— cuando no aplica, para
 * que nunca quede alcanzable con el tabulador.
 */
export function StickyBuyBar() {
  const { count, subtotal, isOpen, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 320)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (count === 0 || isOpen || !scrolled) return null

  return (
    <div data-sticky="" className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 shadow-e3 md:hidden">
      <FreeShipping />
      <div className="mt-2 flex items-center gap-3">
        <div className="min-w-0">
          <p className="text-small text-muted">{count} {count === 1 ? 'producto' : 'productos'}</p>
          <p className="text-body font-extrabold leading-tight">{formatCOP(subtotal)}</p>
        </div>
        <button type="button" onClick={openCart} className="btn btn-lg btn-primary ml-auto flex-1">
          Ir a pagar
        </button>
      </div>
    </div>
  )
}
