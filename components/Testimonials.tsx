import { testimonios } from '@/data/site'
import { Icon } from './Icon'
import { SectionHeader, Stars } from './Bits'

export function Testimonials() {
  return (
    <section aria-labelledby="resenas-h" className="shell pt-10 md:pt-14">
      <SectionHeader id="resenas-h" eyebrow="4,8 sobre 5 · 1.240 reseñas" titulo="Lo que dicen los clientes" />
      <ul className="rail rail-bleed md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:[margin-inline:0] md:[padding-inline:0]">
        {testimonios.map((t) => (
          <li key={t.id} className="w-[17.5rem] sm:w-[21rem] md:w-auto">
            <figure className="card flex h-full flex-col gap-3 p-4 md:p-5">
              <Stars value={t.estrellas} />
              <blockquote className="text-body text-ink">«{t.texto}»</blockquote>
              <figcaption className="mt-auto flex items-center gap-2.5 pt-1">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-pill bg-brand-600 text-micro font-extrabold text-white">
                  {t.nombre.slice(0, 1)}
                </span>
                <span>
                  <span className="block text-body font-bold">{t.nombre}</span>
                  <span className="flex items-center gap-1 text-micro text-muted">
                    <Icon name="check" size={12} className="text-lime-600" /> Compra verificada · sede {t.sede}
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
