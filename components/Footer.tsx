import { sedes, site } from '@/data/site'
import { Icon } from './Icon'
import { Logo } from './Logo'

const PAGOS = ['PSE', 'Nequi', 'Addi', 'Visa', 'Mastercard', 'Contra entrega']

export function Footer() {
  return (
    <footer className="mt-12 border-t border-line bg-cream pb-28 pt-12 md:mt-20 md:pb-12">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 max-w-[34ch] text-body text-muted">
              {site.razonSocial}. {site.anios} años cuidando mascotas en {site.ciudad}, con clínica
              veterinaria propia y urgencias {site.urgencias}.
            </p>
            <a href={`tel:${site.telefonoClinica.replace(/\D/g, '')}`} className="link-tap mt-2 gap-1.5 text-body font-bold text-brand-700 hover:underline">
              <Icon name="phone" size={16} /> {site.telefonoClinica}
            </a>
          </div>

          <nav aria-labelledby="f-tienda">
            <h2 id="f-tienda" className="mb-2.5 text-small font-extrabold uppercase tracking-wide text-ink">Tienda</h2>
            <ul className="text-body text-muted">
              {[['Ofertas', '#ofertas'], ['Más vendidos', '#mas-vendidos'], ['Suscripción', '#suscripcion'], ['Sedes', '#sedes']].map(([l, h]) => (
                <li key={l}><a href={h} className="link-tap hover:text-brand-700 hover:underline">{l}</a></li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="f-clinica">
            <h2 id="f-clinica" className="mb-2.5 text-small font-extrabold uppercase tracking-wide text-ink">Clínica</h2>
            <ul className="text-body text-muted">
              {[['Agendar consulta', '#clinica'], ['Urgencias 24 h', '#clinica'], ['Laboratorio', '#clinica'], ['Imágenes diagnósticas', '#clinica']].map(([l, h]) => (
                <li key={l}><a href={h} className="link-tap hover:text-brand-700 hover:underline">{l}</a></li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-2.5 text-small font-extrabold uppercase tracking-wide text-ink">Sedes</h2>
            <ul className="space-y-1.5 text-body text-muted">
              {sedes.map((s) => (
                <li key={s.id}>{s.nombre} — {s.direccion}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <h2 className="sr-only">Medios de pago</h2>
          <ul className="flex flex-wrap gap-1.5">
            {PAGOS.map((p) => (
              <li key={p}>
                <span className="inline-flex h-8 items-center rounded-sm bg-white px-2.5 text-small font-bold text-ink shadow-inset1">{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-micro text-muted">
            © {new Date().getFullYear()} {site.razonSocial} · NIT 890.399.010-2 · Cali, Colombia ·
            Envío gratis desde $99.900 en Cali y Jamundí · Devoluciones a 30 días.
          </p>
        </div>
      </div>
    </footer>
  )
}
