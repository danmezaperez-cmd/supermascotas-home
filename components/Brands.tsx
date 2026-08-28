import { marcas } from '@/data/site'

/**
 * Marcas. Sin logotipos: no tenemos los archivos autorizados y una imitación
 * dibujada a mano sería una marca falsa. Tipografía honesta sobre superficie.
 */
export function Brands() {
  return (
    <section aria-labelledby="marcas-h" className="shell pt-10 md:pt-14">
      <h2 id="marcas-h" className="mb-3 text-micro font-extrabold uppercase tracking-[0.12em] text-muted">
        Trabajamos con
      </h2>
      <ul className="rail rail-bleed gap-2 md:flex-wrap md:overflow-visible md:[margin-inline:0] md:[padding-inline:0]">
        {marcas.map((m) => (
          <li key={m}>
            <span className="inline-flex h-11 items-center rounded-pill bg-cream px-4 text-body font-extrabold tracking-tight text-ink shadow-inset1">
              {m}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
