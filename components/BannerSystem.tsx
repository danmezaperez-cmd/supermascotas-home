'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { bannersPrincipales, bannersSecundarios, type Banner } from '@/data/banners'
import { photos } from '@/data/photos'
import { promoDeadlineShort } from '@/lib/format'
import { Icon } from './Icon'

/* ---------------------------------------------------------------------- */
/* Superficies del sistema. Ningún color fuera de la paleta.               */
/* ---------------------------------------------------------------------- */
/**
 * El banner es PARTIDO desde 768: panel de color a un lado, fotografía al otro.
 * Antes el texto iba sobre la foto con un degradado suave y, medido en píxeles
 * reales, el titular caía a 1,97:1 sobre el pelaje claro del gato. Un panel
 * sólido hace que el contraste no dependa de la foto de turno, y además deja
 * la imagen completa en vez de taparla con un velo.
 *
 * En móvil no hay sitio para dos columnas: la foto va de fondo con un velo
 * que es color pleno donde vive el texto y se abre arriba.
 */
const FONDO: Record<string, string> = {
  brand: 'bg-[#0A1B47]',
  ink: 'bg-[#0A1120]',
}
const VELO_MOVIL: Record<string, string> = {
  brand: 'bg-[linear-gradient(to_top,rgba(10,27,71,0.95)_0%,rgba(10,27,71,0.86)_62%,rgba(10,27,71,0.35)_100%)]',
  ink: 'bg-[linear-gradient(to_top,rgba(10,17,32,0.95)_0%,rgba(10,17,32,0.86)_62%,rgba(10,17,32,0.35)_100%)]',
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
  const fondo = FONDO[b.tono] ?? FONDO.brand
  const velo = VELO_MOVIL[b.tono] ?? VELO_MOVIL.brand
  return (
    <li
      className={`relative w-full shrink-0 snap-start overflow-hidden rounded-xl ${fondo}`}
      role="group"
      aria-roledescription="diapositiva"
      aria-label={`${index + 1} de ${total}: ${b.titulo}`}
    >
      {/* El alto mínimo es un SUELO, no un techo: si la campaña trae más texto,
          la caja crece en vez de recortarlo. Todas las diapositivas quedan a la
          misma altura porque el carril es flex con estirado. */}
      <div className="relative min-h-[11.5rem] w-full sm:min-h-[13rem] md:grid md:min-h-[15rem] md:grid-cols-[54%_46%] lg:min-h-[17rem] lg:grid-cols-[56%_44%]">
        {/* Foto: fondo completo en móvil, columna propia desde 768 */}
        <div className="absolute inset-0 md:relative md:inset-auto md:order-2">
          {foto && (
            <img
              src={foto.src} alt={foto.alt} width={foto.width} height={foto.height}
              loading={index === 0 ? 'eager' : 'lazy'} decoding="async" fetchPriority={index === 0 ? 'high' : 'auto'}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className={`absolute inset-0 ${velo} md:hidden`} />
        </div>

        <div className="on-dark relative flex min-h-full flex-col justify-end p-4 sm:p-5 md:order-1 md:justify-center md:p-6 lg:p-8">
          <div className="max-w-[24rem] md:max-w-none">
            <p className="mb-2 flex flex-wrap items-center gap-1.5">
              <span className="eyebrow-chip bg-sun-400 text-ink">{b.eyebrow}</span>
              {b.vigenteHasta && (
                <span className="eyebrow-chip bg-white/25 text-white backdrop-blur-sm">
                  hasta {promoDeadlineShort(b.vigenteHasta)}
                </span>
              )}
            </p>
            <p data-banner="titulo" className="text-display text-white text-shadow-soft">{b.titulo}</p>
            {b.bajada && (
              <p data-banner="bajada" className="mt-1.5 hidden max-w-[40ch] text-body text-brand-100 sm:block lg:text-body-lg">{b.bajada}</p>
            )}
            <a href={b.cta.href} className="btn btn-lg btn-primary mt-4 self-start bg-white text-brand-700 hover:bg-brand-50">
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

      {/* Control del carrusel: flechas y puntos juntos, fuera del área de texto.
          En escritorio va dentro del banner —sobre una píldora opaca— para no
          gastar altura del fold; en móvil, debajo. */}
      <div className="mt-1.5 flex items-center justify-center gap-1 lg:absolute lg:bottom-3 lg:right-3 lg:mt-0 lg:rounded-pill lg:bg-ink/60 lg:px-1 lg:backdrop-blur-sm">
        <button
          type="button" onClick={() => { detener(); irA(Math.max(0, activo - 1)) }} disabled={activo === 0}
          aria-label="Campaña anterior"
          className="hidden h-9 w-9 place-items-center rounded-pill text-white transition duration-base ease-soft hover:bg-white/20 disabled:opacity-30 lg:grid"
        >
          <Icon name="chevronL" size={18} />
        </button>

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

        <button
          type="button" onClick={() => { detener(); irA(Math.min(slides.length - 1, activo + 1)) }} disabled={activo === slides.length - 1}
          aria-label="Campaña siguiente"
          className="hidden h-9 w-9 place-items-center rounded-pill text-white transition duration-base ease-soft hover:bg-white/20 disabled:opacity-30 lg:grid"
        >
          <Icon name="chevronR" size={18} />
        </button>
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
