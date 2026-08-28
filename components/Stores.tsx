import { sedes } from '@/data/site'
import { Icon } from './Icon'
import { SectionHeader } from './Bits'

export function Stores() {
  return (
    <section id="sedes" aria-labelledby="sedes-h" className="shell pt-10 md:pt-14">
      <SectionHeader
        id="sedes-h"
        eyebrow="Cinco sedes en Cali y Jamundí"
        titulo="Recoge hoy en tienda"
        bajada="Compra en línea y pasa por tu pedido en dos horas, sin costo de envío."
      />
      <ul className="rail rail-bleed md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:[margin-inline:0] md:[padding-inline:0] lg:grid-cols-5">
        {sedes.map((s) => (
          <li key={s.id} className="w-[15.5rem] md:w-auto">
            <div className="card flex h-full flex-col gap-1.5 p-4">
              <p className="flex items-center gap-1.5 text-body font-bold">
                <Icon name="pin" size={16} className="shrink-0 text-brand-600" />
                {s.nombre}
              </p>
              <p className="text-micro text-muted">{s.direccion}</p>
              <p className="text-micro text-muted">{s.horario}</p>
              {s.clinica && (
                <p className="mt-auto pt-1.5">
                  <span className="eyebrow-chip bg-lime-100 text-lime-800">
                    <Icon name="cross" size={12} /> Con clínica
                  </span>
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
