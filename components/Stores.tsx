import { photos } from '@/data/photos'
import { sedes } from '@/data/site'
import { Icon } from './Icon'
import { SectionHeader } from './Bits'

/**
 * Sedes con fotografía de fachada. Las imágenes que hay hoy son de baja
 * resolución y se repiten entre sedes: son un marcador de posición declarado
 * hasta que llegue la fotografía definitiva de cada punto.
 */
const FACHADAS = [photos.sede1, photos.sede2, photos.sede3] as const

export function Stores() {
  return (
    <section id="sedes" aria-labelledby="sedes-h" className="shell pt-12 md:pt-20">
      <SectionHeader
        id="sedes-h"
        eyebrow="Cinco sedes en Cali y Jamundí"
        titulo="Recoge hoy en tienda"
        bajada="Compra en línea y pasa por tu pedido en dos horas, sin costo de envío."
      />
      <ul className="rail rail-bleed gap-4 md:grid md:grid-cols-3 md:overflow-visible md:[margin-inline:0] md:[padding-inline:0] lg:grid-cols-5">
        {sedes.map((s, i) => {
          const foto = FACHADAS[i % FACHADAS.length]
          return (
            <li key={s.id} className="w-[16rem] md:w-auto">
              <div className="card flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[5/3] bg-brand-50">
                  <img
                    src={foto.src} alt={`Fachada de la sede ${s.nombre}`}
                    width={foto.width} height={foto.height} loading="lazy" decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  {s.clinica && (
                    <span className="absolute left-3 top-3 eyebrow-chip bg-white/95 text-brand-700 shadow-e1">
                      <Icon name="cross" size={13} /> Con clínica
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <h3 className="flex items-start gap-1.5 text-body font-bold">
                    <Icon name="pin" size={17} className="mt-0.5 shrink-0 text-brand-600" />
                    {s.nombre}
                  </h3>
                  <p className="text-small text-muted">{s.direccion}</p>
                  <p className="mt-auto pt-1 text-small text-muted">{s.horario}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
