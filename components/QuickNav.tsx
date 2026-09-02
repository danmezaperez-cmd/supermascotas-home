import { accesos } from '@/data/site'
import { Icon, type IconName } from './Icon'

/**
 * Accesos rápidos por categoría. Fila de píldoras: cabe en la primera pantalla
 * sin apretar la tipografía —la versión apilada gastaba 24 px de alto para
 * meter el mismo texto en dos líneas—. Desde 1024 comparte fila con el h1,
 * que ahí sí tiene sitio al costado.
 *
 * Aquí vive el único h1 de la página. La auditoría encontró que la portada
 * declaraba dos h1 y ambos eran el logotipo: para Google la página no decía
 * qué vende ni dónde. Este h1 lo dice en una línea.
 */
export function QuickNav() {
  return (
    <section data-sec="accesos" aria-labelledby="accesos-h" className="shell pt-3 md:pt-7">
      {/* Desde 1024 el h1 comparte fila con las píldoras, pero solo si caben:
          `flex-wrap` con una base explícita las devuelve a su propia línea antes
          de provocar desborde horizontal. */}
      <div className="lg:flex lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-8 lg:gap-y-3">
        <h1
          id="accesos-h"
          className="mb-3 text-body font-bold leading-snug text-ink md:text-subtitle lg:mb-0 lg:max-w-[32rem] lg:flex-1 lg:basis-72"
        >
          Tienda de mascotas en Cali con clínica veterinaria propia
          <span className="font-medium text-muted"> y urgencias 24 h</span>
        </h1>

        <ul className="rail rail-bleed gap-2.5 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:[margin-inline:0] md:[padding-inline:0] lg:flex lg:flex-1 lg:basis-[41rem] lg:justify-end">
          {accesos.map((a) => (
            <li key={a.id}>
              <a
                href={a.href}
                className="card card-hover flex h-12 items-center gap-2 pl-2.5 pr-3.5 md:h-auto md:justify-center md:gap-2.5 md:py-3 lg:h-12 lg:py-0"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-pill bg-brand-50 text-brand-600 md:h-9 md:w-9">
                  <Icon name={a.icon as IconName} size={19} />
                </span>
                <span className="whitespace-nowrap text-body font-bold">{a.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
