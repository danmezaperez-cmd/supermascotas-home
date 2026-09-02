'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { products } from '@/data/products'
import { accesos, site } from '@/data/site'
import { useCart } from '@/lib/cart'
import { formatCOP } from '@/lib/format'
import { Icon, type IconName } from './Icon'
import { Logo } from './Logo'
import { ProductArt } from './ProductArt'

function useOutside(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const down = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', down)
    document.addEventListener('keydown', key)
    return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key) }
  }, [onClose])
  return ref
}

function Buscador({ id }: { id: string }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const { add } = useCart()
  const listId = `${id}-resultados`

  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (t.length < 2) return []
    return products
      .filter((p) => `${p.marca} ${p.nombre} ${p.linea} ${p.categoria}`.toLowerCase().includes(t))
      .slice(0, 6)
  }, [q])

  const wrap = useOutside(() => setOpen(false))
  const showPanel = open && q.trim().length >= 2

  return (
    <div ref={wrap} className="relative w-full">
      <label htmlFor={id} className="sr-only">Buscar en el catálogo</label>
      <div className="relative">
        <Icon name="search" size={19} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500" />
        <input
          id={id}
          type="search"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar alimento, arena, marca…"
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          className="h-11 w-full rounded-pill bg-cream pl-11 pr-4 text-body font-medium text-ink shadow-inset1
                     transition-[box-shadow,background-color] duration-base ease-soft
                     placeholder:text-muted hover:bg-white focus:bg-white focus:shadow-e1"
        />
      </div>

      {showPanel && (
        <div
          id={listId}
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[62vh] overflow-y-auto rounded-lg bg-white p-1.5 shadow-e3 animate-risein"
        >
          <p aria-live="polite" className="px-2.5 py-1.5 text-small text-muted">
            {results.length === 0 ? 'Sin resultados para esa búsqueda' : `${results.length} resultados`}
          </p>
          {results.length === 0 ? (
            <p className="px-2.5 pb-2.5 text-body text-muted">
              Prueba con una marca —Hill&apos;s, Pro Plan— o con «arena», «cachorro», «gato».
            </p>
          ) : (
            <ul className="space-y-0.5">
              {results.map((p) => (
                <li key={p.id}>
                  <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-brand-50">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-sm"><ProductArt product={p} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-body font-bold">{p.marca} {p.nombre}</p>
                      <p className="text-small text-muted">{p.presentacion} · {formatCOP(p.precio)}</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost shrink-0"
                      onClick={() => { add(p.id); setOpen(false) }}
                    >
                      Agregar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function Categorias({ compacto = false }: { compacto?: boolean }) {
  const [open, setOpen] = useState(false)
  const wrap = useOutside(() => setOpen(false))
  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={compacto ? 'Abrir categorías' : undefined}
        className={`btn btn-sm btn-ghost whitespace-nowrap ${compacto ? 'w-11 px-0' : ''}`}
      >
        <Icon name="menu" size={18} />
        {!compacto && 'Categorías'}
      </button>
      {open && (
        <div className={`absolute top-[calc(100%+8px)] z-50 w-60 rounded-lg bg-white p-1.5 shadow-e3 animate-risein ${compacto ? 'left-0' : 'right-0'}`}>
          <ul>
            {accesos.map((a) => (
              <li key={a.id}>
                <a
                  href={a.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-body font-bold hover:bg-brand-50"
                >
                  <Icon name={a.icon as IconName} size={18} className="text-brand-600" />
                  {a.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function TopBar() {
  const { count, openCart, subtotal } = useCart()
  const searchId = useId()
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="shell">
        {/* Fila 1 — identidad y accesos. 52 px. */}
        <div className="flex min-h-[52px] flex-wrap items-center gap-2 md:h-[72px] md:flex-nowrap md:gap-4">
          <a href="#top" className="link-tap min-w-0 shrink" aria-label={`${site.nombre}, inicio`}>
            <Logo />
          </a>

          {/* En escritorio el buscador vive en la misma fila: una sola barra de 72 px. */}
          <div className="ml-auto hidden min-w-0 flex-1 md:block md:max-w-[34rem]">
            <Buscador id={`${searchId}-desktop`} />
          </div>

          <div className="ml-auto flex items-center gap-1 md:ml-0 md:gap-2">
            <div className="hidden md:block"><Categorias /></div>
            <a
              href="#cuenta"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-pill text-ink transition-colors duration-base ease-soft hover:bg-brand-50"
              aria-label="Mi cuenta"
            >
              <Icon name="user" size={21} />
            </a>
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-11 items-center gap-2 rounded-pill bg-brand-600 px-3 text-white transition-colors duration-base ease-soft hover:bg-brand-700"
              aria-label={`Abrir carrito, ${count} ${count === 1 ? 'producto' : 'productos'}`}
            >
              <Icon name="cart" size={20} />
              <span
                key={count}
                className="min-w-[1.375rem] rounded-pill bg-white px-1 text-center text-small font-extrabold text-brand-700 animate-pop"
              >
                {count}
              </span>
              {subtotal > 0 && (
                <span className="hidden text-body font-bold lg:inline">{formatCOP(subtotal)}</span>
              )}
            </button>
          </div>
        </div>

        {/* Fila 2 en móvil: acceso a categorías + buscador a ancho completo.
            El botón de categorías vive aquí y no en la fila de arriba porque
            allí no cabe; lo que no puede es faltar, que era lo que pasaba. */}
        <div className="flex items-center gap-2 pb-2 md:hidden">
          <Categorias compacto />
          <div className="min-w-0 flex-1">
            <Buscador id={`${searchId}-mobile`} />
          </div>
        </div>
      </div>
    </header>
  )
}
