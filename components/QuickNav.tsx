import { accesos } from '@/data/site'
import { Icon, type IconName } from './Icon'

/**
 * Accesos rápidos por categoría. Compacto e iconográfico: tiene que caber en
 * la primera pantalla, encima del riel de ofertas.
 *
 * Aquí vive el único h1 de la página. La auditoría encontró que la portada
 * declaraba dos h1 y ambos eran el logotipo: para Google la página no dice
 * qué vende ni dónde. Este h1 lo dice en una línea.
 */
export function QuickNav() {
  return (
    <section data-sec="accesos" aria-labelledby="accesos-h" className="shell pt-2 md:pt-5">
      <h1 id="accesos-h" className="mb-2 text-body font-bold leading-snug text-ink md:text-subtitle">
        Tienda de mascotas en Cali con clínica veterinaria propia
        <span className="font-medium text-muted"> y urgencias 24 h</span>
      </h1>
      <ul className="rail rail-bleed gap-2 md:grid md:grid-cols-5 md:gap-3 md:overflow-visible md:[margin-inline:0] md:[padding-inline:0]">
        {accesos.map((a) => (
          <li key={a.id} className="w-[5.5rem] md:w-auto">
            <a
              href={a.href}
              className="card card-hover flex h-14 flex-col items-center justify-center gap-0.5 px-2 text-center md:h-auto md:flex-row md:gap-2.5 md:py-2.5"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-pill bg-brand-50 text-brand-600 md:h-9 md:w-9">
                <Icon name={a.icon as IconName} size={19} />
              </span>
              <span className="text-micro font-extrabold md:text-body">{a.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
