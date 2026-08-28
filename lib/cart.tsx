'use client'

import { createContext, useCallback, useContext, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import { byId, type Product } from '@/data/products'
import { site } from '@/data/site'

export type CartLine = { id: string; qty: number; suscripcion?: boolean }

type State = { lines: CartLine[] }
type Action =
  | { type: 'add'; id: string; qty?: number; suscripcion?: boolean }
  | { type: 'setQty'; id: string; qty: number }
  | { type: 'remove'; id: string }
  | { type: 'clear' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const qty = action.qty ?? 1
      const i = state.lines.findIndex((l) => l.id === action.id && !!l.suscripcion === !!action.suscripcion)
      if (i === -1) return { lines: [...state.lines, { id: action.id, qty, suscripcion: action.suscripcion }] }
      const lines = [...state.lines]
      lines[i] = { ...lines[i], qty: Math.min(99, lines[i].qty + qty) }
      return { lines }
    }
    case 'setQty': {
      if (action.qty <= 0) return { lines: state.lines.filter((l) => l.id !== action.id) }
      return { lines: state.lines.map((l) => (l.id === action.id ? { ...l, qty: Math.min(99, action.qty) } : l)) }
    }
    case 'remove':
      return { lines: state.lines.filter((l) => l.id !== action.id) }
    case 'clear':
      return { lines: [] }
  }
}

/** Descuento de la suscripción de alimento. */
export const SUSCRIPCION_OFF = 0.12

export type CartItem = CartLine & { product: Product; unit: number; total: number }

type CartApi = {
  items: CartItem[]
  count: number
  subtotal: number
  faltaParaEnvioGratis: number
  progresoEnvio: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  add: (id: string, opts?: { qty?: number; suscripcion?: boolean; abrirCajon?: boolean }) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  /** id del producto recién agregado, para la confirmación visual de 1,8 s */
  justAdded: string | null
  announcement: string
}

const Ctx = createContext<CartApi | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] })
  const [isOpen, setOpen] = useState(false)
  const [justAdded, setJustAdded] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const items = useMemo<CartItem[]>(
    () =>
      state.lines.flatMap((l) => {
        const product = byId(l.id)
        if (!product) return []
        const unit = Math.round(l.suscripcion ? product.precio * (1 - SUSCRIPCION_OFF) : product.precio)
        return [{ ...l, product, unit, total: unit * l.qty }]
      }),
    [state.lines],
  )

  const subtotal = items.reduce((s, i) => s + i.total, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)
  const faltaParaEnvioGratis = Math.max(0, site.envioGratisDesde - subtotal)
  const progresoEnvio = Math.min(1, subtotal / site.envioGratisDesde)

  const add: CartApi['add'] = useCallback((id, opts) => {
    dispatch({ type: 'add', id, qty: opts?.qty, suscripcion: opts?.suscripcion })
    const p = byId(id)
    setJustAdded(id)
    setAnnouncement(p ? `${p.marca} ${p.nombre} agregado al carrito` : 'Producto agregado al carrito')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setJustAdded(null), 1800)
    if (opts?.abrirCajon) setOpen(true)
  }, [])

  const api: CartApi = {
    items, count, subtotal, faltaParaEnvioGratis, progresoEnvio, isOpen,
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
    add,
    setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
    remove: (id) => dispatch({ type: 'remove', id }),
    justAdded, announcement,
  }

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useCart(): CartApi {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return c
}
