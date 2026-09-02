import { photos } from '@/data/photos'
import { serviciosClinica, site } from '@/data/site'
import { formatCOP } from '@/lib/format'
import { Icon, type IconName } from './Icon'
import { SectionHeader } from './Bits'

const ICONOS: Record<string, IconName> = {
  consulta: 'cross', urgencias: 'bolt', laboratorio: 'lab', imagenes: 'scan', cirugia: 'scissors',
}

/**
 * La clínica, tratada como servicio vendible: precio desde, CTA de
 * agendamiento y disponibilidad real. No es un bloque institucional.
 */
export function Clinic() {
  const foto = photos.clinicaEquipo
  return (
    <section id="clinica" aria-labelledby="clinica-h" className="mt-12 bg-ink py-12 text-white md:mt-20 md:py-20 on-dark">
      <div className="shell">
        <SectionHeader
          id="clinica-h"
          tone="dark"
          eyebrow="Ninguna otra tienda de Cali la tiene"
          titulo="Clínica veterinaria propia, dentro de la tienda"
          bajada="Urgencias 24 horas, laboratorio e imágenes diagnósticas en la misma sede. Compras el alimento y, si algo pasa, no tienes que ir a otro lado."
        />

        <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_1.1fr] lg:gap-6">
          <div className="relative min-w-0 overflow-hidden rounded-xl">
            <div className="relative h-full min-h-[16rem]">
              <img
                src={foto.src} alt={foto.alt} width={foto.width} height={foto.height} loading="lazy" decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 bg-gradient-to-t from-[#0A1120] to-transparent p-4 pt-10">
              <span className="eyebrow-chip min-h-11 bg-accent-600 text-white">
                <Icon name="bolt" size={13} /> Urgencias {site.urgencias}
              </span>
              <a href={`tel:${site.telefonoClinica.replace(/\D/g, '')}`} className="eyebrow-chip min-h-11 bg-white text-ink hover:bg-brand-50">
                <Icon name="phone" size={13} /> {site.telefonoClinica}
              </a>
            </div>
          </div>

          <div className="min-w-0">
            <ul className="divide-y divide-white/12 overflow-hidden rounded-xl bg-white/6">
              {serviciosClinica.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-3.5 p-4 transition-colors duration-base ease-soft hover:bg-white/8">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-white/12 text-sun-300">
                    <Icon name={ICONOS[s.id]} size={20} />
                  </span>
                  <span className="min-w-0 flex-1 basis-32">
                    <span className="block text-body font-bold">{s.titulo}</span>
                    <span className="block text-small text-brand-200">{s.detalle}</span>
                  </span>
                  <span className="ml-auto shrink-0 text-right">
                    <span className="block text-small text-brand-200">desde</span>
                    <span className="block text-body font-extrabold">{formatCOP(s.desde)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <a href="#agendar" className="btn btn-lg btn-primary flex-1 bg-white text-brand-700 hover:bg-brand-50">
                <Icon name="cross" size={19} /> Agendar consulta
              </a>
              <a href={`tel:${site.telefonoClinica.replace(/\D/g, '')}`} className="btn btn-lg flex-1 bg-white/10 text-white hover:bg-white/18">
                <Icon name="phone" size={19} /> Llamar a urgencias
              </a>
            </div>
            <p className="mt-2.5 text-small text-brand-200">
              Consultorios en Paso Ancho y Ciudad Jardín. Urgencias las 24 h en Paso Ancho.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
