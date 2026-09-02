import { ofertas } from '@/data/products'
import { OfertaCard } from './ProductCard'
import { SectionHeader } from './Bits'
import { Icon } from './Icon'

/**
 * Riel de ofertas. Debe asomar en el fold: es el primer producto comprable de
 * la página, con precio tachado, % de ahorro, precio por kilo y botón.
 *
 * Sin antetítulo: en esta sección costaba 23 px de la primera pantalla para
 * repetir lo que ya dicen el titular y los sellos de descuento de cada tarjeta.
 * «Ver todo» cierra el riel en vez de vivir en la cabecera, donde estaba
 * oculto por debajo de 768.
 */
export function OffersRail() {
  return (
    <section id="ofertas" data-sec="ofertas" aria-labelledby="ofertas-h" className="shell pt-4 md:pt-6">
      <SectionHeader id="ofertas-h" titulo="Ofertas con precio por kilo" />
      <ul className="rail rail-bleed gap-4">
        {ofertas.slice(0, 8).map((p) => (
          <li key={p.id} className="w-[20.5rem] sm:w-[22rem]"><OfertaCard p={p} /></li>
        ))}
        <li className="w-[11rem]">
          <a
            href="#mas-vendidos"
            className="card card-hover flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-brand-700"
          >
            <span className="grid h-11 w-11 place-items-center rounded-pill bg-brand-50">
              <Icon name="chevronR" size={20} />
            </span>
            <span className="text-body font-bold">Ver todas las ofertas</span>
          </a>
        </li>
      </ul>
    </section>
  )
}
