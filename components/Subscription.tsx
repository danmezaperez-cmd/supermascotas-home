'use client'

import { useMemo, useState } from 'react'
import { suscribibles } from '@/data/products'
import { SUSCRIPCION_OFF, useCart } from '@/lib/cart'
import { formatCOP, pricePerKilo } from '@/lib/format'
import { Icon } from './Icon'
import { SectionHeader } from './Bits'
import { ProductArt } from './ProductArt'

const FRECUENCIAS = [
  { dias: 30, label: 'Cada 30 días' },
  { dias: 45, label: 'Cada 45 días' },
] as const

/**
 * Suscripción de alimento. Es la palanca de valor de vida más grande del
 * negocio: un bulto dura 30–45 días y hoy nada captura esa recompra.
 * El ahorro anual se calcula en vivo para que la decisión sea aritmética,
 * no de fe.
 */
export function Subscription() {
  const [id, setId] = useState(suscribibles[0]?.id ?? '')
  const [dias, setDias] = useState<number>(30)
  const { add } = useCart()

  const p = useMemo(() => suscribibles.find((x) => x.id === id) ?? suscribibles[0], [id])
  const entregas = Math.round(365 / dias)
  const precioSusc = Math.round(p.precio * (1 - SUSCRIPCION_OFF))
  const ahorroAnual = (p.precio - precioSusc) * entregas

  return (
    <section id="suscripcion" aria-labelledby="susc-h" className="mt-10 bg-cream py-10 md:mt-14 md:py-14">
      <div className="shell">
        <SectionHeader
          id="susc-h"
          eyebrow="Suscripción de alimento"
          titulo="El bulto llega solo, y 12% más barato"
          bajada="Escoge el alimento y cada cuánto lo necesitas. Cambias la fecha, pausas o cancelas cuando quieras, sin llamar a nadie."
        />

        <div className="grid min-w-0 gap-4 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
          {/* Configurador */}
          <div className="card min-w-0 p-4 md:p-6">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <label htmlFor="susc-producto" className="mb-1.5 block text-micro font-extrabold uppercase tracking-wide text-muted">
                  Alimento
                </label>
                <select
                  id="susc-producto" value={p.id} onChange={(e) => setId(e.target.value)}
                  className="h-11 w-full min-w-0 max-w-full truncate rounded-md bg-white px-3 text-body font-bold shadow-inset1 transition-shadow duration-base ease-soft hover:shadow-e1"
                >
                  {suscribibles.map((s) => (
                    <option key={s.id} value={s.id}>{s.marca} {s.nombre} · {s.presentacion}</option>
                  ))}
                </select>
              </div>
              <div className="min-w-0">
                <span className="mb-1.5 block text-micro font-extrabold uppercase tracking-wide text-muted">Frecuencia</span>
                <div className="flex gap-2" role="group" aria-label="Frecuencia de entrega">
                  {FRECUENCIAS.map((f) => (
                    <button
                      key={f.dias} type="button" onClick={() => setDias(f.dias)} aria-pressed={dias === f.dias}
                      className={`btn btn-sm flex-1 ${dias === f.dias ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-lg bg-cream p-3.5">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md"><ProductArt product={p} /></div>
              <div className="min-w-0">
                <p className="truncate text-body font-bold">{p.marca} {p.nombre}</p>
                <p className="text-micro text-muted">
                  {p.presentacion} · {pricePerKilo(precioSusc, p.pesoKg)} con suscripción
                </p>
              </div>
            </div>

            <dl className="mt-4 space-y-2 text-body">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-muted">Precio normal</dt>
                <dd><s className="text-muted">{formatCOP(p.precio)}</s></dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-bold">Con suscripción</dt>
                <dd className="text-[1.25rem] font-extrabold tracking-tight text-brand-700">{formatCOP(precioSusc)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-line pt-2">
                <dt className="font-bold">Ahorro al año</dt>
                <dd className="rounded-pill bg-lime-500 px-2.5 py-1 text-body font-extrabold text-ink">
                  {formatCOP(ahorroAnual)}
                </dd>
              </div>
            </dl>
            <p className="mt-1.5 text-micro text-muted">
              {entregas} entregas al año, {formatCOP(p.precio - precioSusc)} de ahorro en cada una.
            </p>

            <button
              type="button"
              onClick={() => add(p.id, { suscripcion: true, abrirCajon: true })}
              className="btn btn-lg btn-primary mt-4 w-full"
            >
              <Icon name="repeat" size={19} />
              Suscribirme y ahorrar {formatCOP(ahorroAnual)} al año
            </button>
            <p className="mt-2 text-center text-micro text-muted">Sin permanencia. Primer envío en 24 h.</p>
          </div>

          {/* Por qué conviene */}
          <ul className="grid min-w-0 content-start gap-3">
            {[
              { icon: 'repeat' as const, t: 'No se te acaba el alimento', d: 'Programas la fecha una vez y llega sola. Ajustas o saltas una entrega desde tu cuenta.' },
              { icon: 'cross' as const, t: 'Con recordatorio de la clínica', d: 'Nuestros veterinarios te avisan cuándo toca desparasitar o cambiar de etapa de alimento.' },
              { icon: 'truck' as const, t: 'Siempre con envío gratis', d: 'Toda suscripción supera el umbral, sin importar el monto del pedido.' },
              { icon: 'wallet' as const, t: 'Pagas al recibir si quieres', d: 'Contra entrega, PSE o tarjeta. Cambias el medio de pago cuando quieras.' },
            ].map((b) => (
              <li key={b.t} className="card flex gap-3 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-brand-50 text-brand-600">
                  <Icon name={b.icon} size={20} />
                </span>
                <span>
                  <span className="block text-body font-bold">{b.t}</span>
                  <span className="mt-0.5 block text-body text-muted">{b.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
