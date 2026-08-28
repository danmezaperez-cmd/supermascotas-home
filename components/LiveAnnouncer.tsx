'use client'

import { useCart } from '@/lib/cart'

/** Confirmación audible para lectores de pantalla al agregar al carrito. */
export function LiveAnnouncer() {
  const { announcement } = useCart()
  return <p role="status" aria-live="polite" className="sr-only">{announcement}</p>
}
