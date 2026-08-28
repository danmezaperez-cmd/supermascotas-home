import { ofertas } from '@/data/products'
import { OfertaCard } from './ProductCard'
import { SectionHeader } from './Bits'
import { Icon } from './Icon'

/**
 * Riel de ofertas. Debe asomar en el fold: es el primer producto comprable de
 * la página, con precio tachado, % de ahorro, precio por kilo y botón.
 */
export function OffersRail() {
  return (
    <section id="ofertas" data-sec="ofertas" aria-labelledby="ofertas-h" className="shell pt-3 md:pt-5">
      <SectionHeader
        id="ofertas-h"
        eyebrow="Ahorra esta semana"
        titulo="Ofertas con precio por kilo"
        accion={
          <a href="#mas-vendidos" className="hidden text-body font-bold text-brand-700 underline-offset-4 hover:underline md:link-tap md:gap-1">
            Ver todo <Icon name="chevronR" size={16} />
          </a>
        }
      />
      <ul className="rail rail-bleed">
        {ofertas.slice(0, 8).map((p) => (
          <li key={p.id} className="w-[19.5rem] sm:w-[21rem]"><OfertaCard p={p} /></li>
        ))}
      </ul>
    </section>
  )
}
