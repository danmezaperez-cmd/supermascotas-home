import { promesas } from '@/data/site'
import { Icon, type IconName } from './Icon'

/**
 * Banda de promesas. Aquí la clínica deja de ser un cartel y se vuelve una
 * señal de confianza junto al resto de la promesa de entrega.
 */
export function PromiseBand() {
  return (
    <section aria-label="Nuestras promesas de servicio" className="mt-10 bg-brand-700 py-4 md:mt-14 md:py-5">
      <div className="shell">
        <ul className="rail rail-bleed on-dark gap-4 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:[margin-inline:0] lg:[padding-inline:0]">
          {promesas.map((p) => (
            <li key={p.id} className="flex w-[15rem] items-center gap-3 md:w-auto">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-brand-600 text-sun-300">
                <Icon name={p.icon as IconName} size={19} />
              </span>
              <span className="min-w-0">
                <span className="block text-small font-extrabold leading-snug text-white">{p.titulo}</span>
                <span className="mt-0.5 block text-micro text-brand-200">{p.detalle}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
