'use client'

import { useState } from 'react'
import { site } from '@/data/site'
import { Icon } from './Icon'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'listo'>('idle')
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(site.cupon)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1800)
    } catch { /* sin portapapeles: el código sigue visible y seleccionable */ }
  }

  return (
    <section id="cuenta" aria-labelledby="news-h" className="mt-10 md:mt-14">
      <div className="shell">
        <div className="overflow-hidden rounded-2xl bg-brand-700 p-5 text-white md:p-10 on-dark">
          <div className="grid gap-5 md:grid-cols-2 md:items-center md:gap-10">
            <div>
              <p className="mb-2 text-eyebrow uppercase text-sun-300">Primera compra</p>
              <h2 id="news-h" className="text-title text-white">10% de descuento con tu correo</h2>
              <p className="mt-2 max-w-[46ch] text-body text-brand-100">
                Te avisamos de las ofertas de alimento antes que a nadie y te recordamos cuándo toca
                desparasitar. Un correo al mes, no más.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-pill bg-white/12 py-1.5 pl-4 pr-1.5">
                <span className="text-body font-extrabold tracking-[0.14em]">{site.cupon}</span>
                <button type="button" onClick={copiar} className="btn btn-sm bg-white text-brand-700 hover:bg-brand-50">
                  {copiado ? <><Icon name="check" size={15} /> Copiado</> : 'Copiar'}
                </button>
              </div>
            </div>

            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault()
                setEstado('cargando')
                setTimeout(() => setEstado('listo'), 700)
              }}
            >
              {estado === 'listo' ? (
                <p className="flex items-start gap-2.5 rounded-lg bg-lime-500 p-4 text-body font-bold text-ink" role="status">
                  <Icon name="check" size={20} className="mt-0.5 shrink-0" />
                  Listo. Te enviamos el cupón {site.cupon} a {email || 'tu correo'}.
                </p>
              ) : (
                <>
                  <label htmlFor="news-email" className="mb-1.5 block text-micro font-extrabold uppercase tracking-wide text-brand-200">
                    Tu correo
                  </label>
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <input
                      id="news-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@correo.com" autoComplete="email"
                      className="h-12 w-full min-w-0 rounded-pill bg-white px-4 text-body font-medium text-ink placeholder:text-muted sm:flex-1"
                    />
                    <button type="submit" disabled={estado === 'cargando'} className="btn btn-lg bg-sun-400 text-ink hover:bg-sun-300">
                      {estado === 'cargando' ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-pill border-2 border-ink/30 border-t-ink" aria-hidden="true" />
                          Enviando
                        </>
                      ) : 'Quiero el 10%'}
                    </button>
                  </div>
                  <p className="mt-2 text-micro text-brand-200">
                    Válido en tu primera compra sobre $99.900. Puedes darte de baja cuando quieras.
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
