import { masVendidos } from '@/data/products'
import { ProductCard } from './ProductCard'
import { SectionHeader } from './Bits'

export function BestSellers() {
  return (
    <section id="mas-vendidos" aria-labelledby="mv-h" className="shell pt-12 md:pt-20">
      <SectionHeader
        id="mv-h"
        eyebrow="Lo que más se lleva Cali"
        titulo="Más vendidos"
        bajada="Calificación y número de reseñas de clientes verificados de nuestras cinco sedes."
      />
      <ul className="rail rail-bleed gap-4 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:[margin-inline:0] md:[padding-inline:0]">
        {masVendidos.map((p) => (
          <li key={p.id} className="w-[11.5rem] sm:w-[13rem] md:w-auto"><ProductCard p={p} /></li>
        ))}
      </ul>
    </section>
  )
}
