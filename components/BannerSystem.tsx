'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { bannersPrincipales, bannersSecundarios, type Banner } from '@/data/banners'
import { photos } from '@/data/photos'
import { promoDeadlineShort } from '@/lib/format'
import { Icon } from './Icon'

/* ---------------------------------------------------------------------- */
/* Superficies del sistema. Ningún color fuera de la paleta.               */
/* ---------------------------------------------------------------------- */
const SCRIM: Record<string, string> = {
  brand: 'from-brand-900 via-brand-900/86 to-brand-900/5',
  ink: 'from-[#0A1120] via-[#0A1120]/86 to-[#0A1120]/5',
}
const PANEL: Record<string, string> = {
  lime: 'bg-lime-500 text-ink',
  sun: 'bg-sun-400 text-ink',
  brand: 'bg-brand-700 text-white',
  ink: 'bg-ink text-white',
  cream: 'bg-cream text-ink',
}

/* ---------------------------------------------------------------------- */
/* Slot principal (A)                                                      */
/* ---------------------------------------------------------------------- */

function SlidePrincipal({ b, index, total }: { b: Banner; index: number; total: number }) {
  const foto = b.foto ? photos[b.foto] : null
  const scrim = SCRIM[b.tono] ?? SCRIM.brand
  return (
    <li
      className="relative w-full shrink-0 snap-start overflow-hidden rounded-xl bg-brand-800"
      role="group"
      aria-roledescription="diapositiva"
      aria-label={`${index + 1} de ${total}: ${b.titulo}`}
    >
      <div className="relative aspect-[16/9] w-full sm:aspect-[16/7] lg:aspect-[2.6/1]">
        {foto && (
          <img
            src={foto.src} alt={foto.alt} width={foto.width} height={foto.height}
            loading={index === 0 ? 'eager' : 'lazy'} decoding="async" fetchPriority={index === 0 ? 'high' : 'auto'}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${scrim} md:bg-gradient-to-r`} />
        <div className="on-dark absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:justify-center md:p-8 lg:p-10">
          <div className="max-w-[24rem] md:max-w-[26rem]">
            <p className="mb-2 flex flex-wrap items-center gap-1.5">
              <span className="eyebrow-chip bg-sun-400 text-ink">{b.eyebrow}</span>
              {b.vigenteHasta && (
                <span className="eyebrow-chip bg-white/25 text-white backdrop-blur-sm">
                  hasta {promoDeadlineShort(b.vigenteHasta)}
                </span>
              )}
            </p>
            <p className="text-display text-white text-shadow-soft">{b.titulo}</p>
            {b.bajada && (
              <p className="mt-2 hidden max-w-[34ch] text-body-lg text-brand-100 sm:block">{b.bajada}</p>
            )}
            <a href={b.cta.href} className="btn btn-lg btn-primary mt-4 bg-white text-brand-700 hover:bg-brand-50">
              {b.cta.label}
              <Icon name="chevronR" size={18} />
            </a>
          </div>
        </div>
      </div>
    </li>
  )
}

function CarruselPrincipal() {
  const slides = bannersPrincipales
  const trackRef = useRef<HTMLUListElement>(null)
  const [activo, setActivo] = useState(0)
  const [autoOn, setAutoOn] = useState(true)

  const irA = useCallback((i: number) => {
    const t = trackRef.current
    if (!t) return
    t.scrollTo({ left: t.clientWidth * i, behavior: 'smooth' })
  }, [])

  /* El autoavance se detiene DEFINITIVAMENTE con la primera interacción. */
  const detener = useCallback(() => setAutoOn(false), [])

  useEffect(() => {
    if (!autoOn) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setAutoOn(false); return }
    const id = window.setInterval(() => {
      const t = trackRef.current
      if (!t) return
      const next = (Math.round(t.scrollLeft / t.clientWidth) + 1) % slides.length
      t.scrollTo({ left: t.clientWidth * next, behavior: 'smooth' })
    }, 6000)
    return () => window.clearInterval(id)
  }, [autoOn, slides.length])

  useEffect(() => {
    const t = trackRef.current
    if (!t) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setActivo(Math.round(t.scrollLeft / t.clientWidth)))
    }
    t.addEventListener('scroll', onScroll, { passive: true })
    return () => { t.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div
      className="relative"
      role="group"
      aria-roledescription="carrusel"
      aria-label="Campañas destacadas"
      onPointerDown={detener}
      onTouchStart={detener}
      onKeyDown={detener}
      onWheel={detener}
      onFocusCapture={detener}
    >
      <ul ref={trackRef} className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain no-scrollbar">
        {slides.map((b, i) => (
          <SlidePrincipal key={b.id} b={b} index={i} total={slides.length} />
        ))}
      </ul>

      {/* Flechas: control explícito del usuario, solo donde hay sitio para ellas. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-3 lg:flex">
        <button
          type="button" onClick={() => { detener(); irA(Math.max(0, activo - 1)) }} disabled={activo === 0}
          aria-label="Campaña anterior"
          className="pointer-events-auto grid h-11 w-11 place-items-center rounded-pill bg-white text-brand-700 shadow-e3 transition duration-base ease-soft hover:bg-brand-50 disabled:opacity-0"
        >
          <Icon name="chevronL" size={20} />
        </button>
        <button
          type="button" onClick={() => { detener(); irA(Math.min(slides.length - 1, activo + 1)) }} disabled={activo === slides.length - 1}
          aria-label="Campaña siguiente"
          className="pointer-events-auto grid h-11 w-11 place-items-center rounded-pill bg-white text-brand-700 shadow-e3 transition duration-base ease-soft hover:bg-brand-50 disabled:opacity-0"
        >
          <Icon name="chevronR" size={20} />
        </button>
      </div>

      {/* Puntos con área táctil real de 44×44. En escritorio van dentro del
          banner —sobre una píldora opaca— para no gastar altura del fold. */}
      <div className="mt-1.5 flex items-center justify-center gap-1 lg:absolute lg:bottom-3 lg:right-3 lg:mt-0 lg:rounded-pill lg:bg-ink/55 lg:px-1 lg:backdrop-blur-sm">
        {slides.map((b, i) => (
          <button
            key={b.id}
            type="button"
            onClick={() => { detener(); irA(i) }}
            aria-label={`Ir a la campaña ${i + 1}: ${b.titulo}`}
            aria-current={i === activo}
            className="tap relative grid h-6 place-items-center px-2"
          >
            <span
              className={`block h-1.5 rounded-pill transition-[width,background-color] duration-slow ease-soft ${
                i === activo ? 'w-7 bg-brand-600 lg:bg-white' : 'w-2.5 bg-brand-200 lg:bg-white/55'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* Slots secundarios (B y C)                                               */
/* ---------------------------------------------------------------------- */

function BannerSecundario({ b }: { b: Banner }) {
  const foto = b.foto ? photos[b.foto] : null
  return (
    <a
      href={b.cta.href}
      aria-label={`${b.eyebrow}: ${b.titulo}. ${b.cta.label}`}
      className={`group relative flex h-24 w-[16.5rem] shrink-0 snap-start overflow-hidden rounded-xl shadow-inset1 transition-shadow duration-base ease-soft hover:shadow-e2 sm:h-28 sm:w-[19rem] md:w-auto lg:h-full ${PANEL[b.tono]}`}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 p-2.5 sm:gap-1 sm:p-3.5 lg:p-4 xl:p-5">
        <span className="text-eyebrow uppercase opacity-75">{b.eyebrow}</span>
        <span className="line-clamp-2 text-body font-extrabold leading-tight sm:text-[1.0625rem] xl:text-subtitle">{b.titulo}</span>
        <span className="mt-0.5 inline-flex items-center gap-1 text-micro font-extrabold underline-offset-4 group-hover:underline">
          {b.cta.label}
          <Icon name="chevronR" size={14} className="transition-transform duration-base ease-soft group-hover:translate-x-0.5" />
        </span>
      </div>
      {foto && (
        <div className="relative w-24 shrink-0 sm:w-28 lg:w-[38%]">
          <img
            src={foto.src} alt={foto.alt} width={foto.width} height={foto.height} loading="lazy" decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      )}
    </a>
  )
}

/* ---------------------------------------------------------------------- */

export function BannerSystem() {
  return (
    <section data-sec="banners" aria-label="Campañas y ofertas destacadas" className="shell pt-2 md:pt-4">
      <div className="lg:grid lg:grid-cols-3 lg:gap-4">
        <div className="lg:col-span-2">
          <CarruselPrincipal />
        </div>
        <div className="rail rail-bleed mt-1.5 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:[margin-inline:0] md:[padding-inline:0] lg:mt-0 lg:grid-cols-1 lg:grid-rows-2">
          {bannersSecundarios.map((b) => (
            <BannerSecundario key={b.id} b={b} />
          ))}
        </div>
      </div>
    </section>
  )
}
