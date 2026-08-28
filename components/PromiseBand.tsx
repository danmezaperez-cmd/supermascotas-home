import { promesas } from '@/data/site'
import { Icon, type IconName } from './Icon'

/**
 * Banda de promesas. Aquí la clínica deja de ser un cartel y se vuelve una
 * señal de confianza junto al resto de la promesa de entrega.
 */
export function PromiseBand() {
  return (
    <section aria-label="Nuestras promesas de servicio" className="mt-6 bg-brand-700 py-3.5 md:mt-10 md:py-4">
      <div className="shell">
        <ul className="rail rail-bleed on-dark gap-2.5 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:[margin-inline:0] lg:[padding-inline:0]">
          {promesas.map((p) => (
            <li key={p.id} className="flex w-[13.5rem] items-center gap-2.5 md:w-auto">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-pill bg-brand-600 text-sun-300">
                <Icon name={p.icon as IconName} size={19} />
              </span>
              <span className="min-w-0">
                <span className="block text-micro font-extrabold leading-tight text-white">{p.titulo}</span>
                <span className="block text-micro text-brand-200">{p.detalle}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
