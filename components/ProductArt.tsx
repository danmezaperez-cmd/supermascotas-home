import type { Categoria, Product } from '@/data/products'

/**
 * Tratamiento gráfico honesto para SKU sin fotografía propia.
 *
 * Decisión: es preferible una ilustración de envase con la marca —que nadie
 * confunde con una foto— antes que reutilizar el packshot de otro producto.
 * El catálogo heredado hacía lo segundo: la arena para gatos mostraba una lata
 * de comida y un alimento propio mostraba una bolsa de la competencia. Eso es
 * un error de información, no de estilo, y se corrige eliminando los alias.
 *
 * Si `product.packshot` trae una foto real verificada, esa manda.
 */

type Tono = { fondo: string; fondo2: string; pack: string; packSombra: string; tinta: string; banda: string }

const TONOS: Tono[] = [
  { fondo: '#F3F6FD', fondo2: '#DCE4F8', pack: '#173DA0', packSombra: '#0E2666', tinta: '#FFFFFF', banda: '#8AA3E4' },
  { fondo: '#F8FBEF', fondo2: '#EBF4CB', pack: '#6E8426', packSombra: '#52631C', tinta: '#FFFFFF', banda: '#C2DD6B' },
  { fondo: '#FEFDF2', fondo2: '#FDF8C7', pack: '#EFE14B', packSombra: '#DCCB33', tinta: '#111B2E', banda: '#93851F' },
  { fondo: '#EEF2FC', fondo2: '#B6C6F0', pack: '#0E2666', packSombra: '#0A1B47', tinta: '#FFFFFF', banda: '#5877CE' },
  { fondo: '#F6FAE8', fondo2: '#D7E99B', pack: '#A4C33D', packSombra: '#8CA831', tinta: '#111B2E', banda: '#52631C' },
]

/** Hash estable: la misma marca recibe siempre el mismo tono. */
function tonoDe(seed: string): Tono {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return TONOS[h % TONOS.length]
}

/** Silueta de especie, usada como marca de agua al fondo de la ilustración. */
function Silueta({ categoria }: { categoria: Categoria }) {
  if (categoria === 'gato') {
    return <path d="M100 46 90 30l18 6 18-6-10 16c9 5 15 15 15 26 0 16-15 27-33 27S75 88 75 72c0-11 6-21 15-26Z" />
  }
  if (categoria === 'otras') {
    return <path d="M88 48 82 24c-1-6 6-9 10-4l12 18 12-18c4-5 11-2 10 4l-6 24c11 5 18 15 18 27 0 16-15 26-34 26s-34-10-34-26c0-12 7-22 18-27Z" />
  }
  return <path d="M74 38c-8 4-11 15-9 26 1 7 4 12 8 15v2c0 15 12 26 27 26s27-11 27-26v-2c4-3 7-8 8-15 2-11-1-22-9-26-5 12-14 8-26 8s-21 4-26-8Z" />
}

function Envase({ p, t }: { p: Product; t: Tono }) {
  const marca = (
    <>
      <text
        x="100" y="106" textAnchor="middle" fill={t.tinta}
        fontSize={p.marca.length > 10 ? 14 : 17} fontWeight={800} letterSpacing="-0.4"
        fontFamily="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
      >
        {p.marca}
      </text>
      <text
        x="100" y="122" textAnchor="middle" fill={t.tinta} opacity=".7"
        fontSize="9.5" fontWeight={700} letterSpacing="0.7"
        fontFamily="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
      >
        {p.presentacion.toUpperCase()}
      </text>
    </>
  )

  const humedo = p.linea === 'Alimento húmedo'


  if (humedo) {
    return (
      <g>
        <ellipse cx="100" cy="163" rx="48" ry="8" fill={t.packSombra} opacity=".16" />
        <path d="M52 70v76c0 8 21 14 48 14s48-6 48-14V70Z" fill={t.pack} />
        <path d="M124 70v88c14-2 24-7 24-12V70Z" fill={t.packSombra} opacity=".45" />
        <ellipse cx="100" cy="70" rx="48" ry="12" fill={t.pack} />
        <ellipse cx="100" cy="70" rx="48" ry="12" fill="#fff" opacity=".18" />
        <rect x="52" y="96" width="96" height="4" fill={t.banda} opacity=".7" />
        <g transform="translate(0,10)">{marca}</g>
      </g>
    )
  }

  if (p.familia === 'arena') {
    return (
      <g>
        <ellipse cx="100" cy="171" rx="50" ry="8" fill={t.packSombra} opacity=".16" />
        <rect x="82" y="34" width="36" height="16" rx="7" fill={t.packSombra} />
        <path d="M56 50h88a6 6 0 0 1 6 6v104a6 6 0 0 1-6 6H56a6 6 0 0 1-6-6V56a6 6 0 0 1 6-6Z" fill={t.pack} />
        <path d="M128 50h16a6 6 0 0 1 6 6v104a6 6 0 0 1-6 6h-16Z" fill={t.packSombra} opacity=".4" />
        <rect x="50" y="74" width="100" height="4" fill={t.banda} opacity=".7" />
        {marca}
      </g>
    )
  }

  if (p.familia === 'salud') {
    return (
      <g>
        <ellipse cx="100" cy="157" rx="46" ry="7" fill={t.packSombra} opacity=".16" />
        <rect x="48" y="52" width="104" height="98" rx="10" fill={t.pack} />
        <rect x="132" y="52" width="20" height="98" rx="10" fill={t.packSombra} opacity=".4" />
        <rect x="48" y="74" width="104" height="4" fill={t.banda} opacity=".7" />
        <g fill={t.banda} opacity=".9">
          <circle cx="74" cy="136" r="7" /><circle cx="100" cy="136" r="7" /><circle cx="126" cy="136" r="7" />
        </g>
        <g transform="translate(0,-10)">{marca}</g>
      </g>
    )
  }

  if (p.familia === 'juguete') {
    return (
      <g>
        <ellipse cx="100" cy="163" rx="40" ry="7" fill={t.packSombra} opacity=".16" />
        <path d="M100 34c17 0 28 15 28 32 0 11-7 15-7 26s9 15 9 28-13 24-30 24-30-11-30-24 9-15 9-28-7-15-7-26c0-17 11-32 28-32Z" fill={t.pack} />
        <path d="M112 36c9 5 16 17 16 30 0 11-7 15-7 26s9 15 9 28c0 9-6 17-16 21 6-6 9-13 9-21 0-13-9-17-9-28s7-15 7-26c0-13-4-24-9-30Z" fill={t.packSombra} opacity=".4" />
        <circle cx="100" cy="48" r="10" fill={t.fondo} />
        <g transform="translate(0,22)">{marca}</g>
      </g>
    )
  }

  if (p.familia === 'snack') {
    return (
      <g>
        <ellipse cx="100" cy="163" rx="44" ry="7" fill={t.packSombra} opacity=".16" />
        <path d="M60 54h80l-6 12h6l-6 92H66l-6-92h6z" fill={t.pack} />
        <path d="M122 54h18l-6 12h6l-6 92h-18l6-92h-6z" fill={t.packSombra} opacity=".38" />
        <rect x="58" y="82" width="84" height="4" fill={t.banda} opacity=".7" />
        {marca}
      </g>
    )
  }

  // Bolsa de alimento seco — el envase por defecto del catálogo
  return (
    <g>
      <ellipse cx="100" cy="173" rx="50" ry="8" fill={t.packSombra} opacity=".16" />
      <path d="M60 42h80l10 16-10 8v98a6 6 0 0 1-6 6H66a6 6 0 0 1-6-6V66l-10-8z" fill={t.pack} />
      <path d="M126 42h14l10 16-10 8v98a6 6 0 0 1-6 6h-14a6 6 0 0 0 6-6V66l10-8z" fill={t.packSombra} opacity=".4" />
      <path d="M60 42h80l10 16H50z" fill="#fff" opacity=".2" />
      <rect x="50" y="82" width="100" height="4" fill={t.banda} opacity=".7" />
      {marca}
    </g>
  )
}

export function ProductArt({ product, className = '' }: { product: Product; className?: string }) {
  const t = tonoDe(product.marca + product.familia)
  const gid = `sm-art-${product.id}`

  if (product.packshot) {
    return (
      <img
        src={product.packshot} alt={`${product.marca} ${product.nombre}`} loading="lazy" decoding="async"
        className={`h-full w-full object-contain ${className}`}
      />
    )
  }

  return (
    <svg
      viewBox="0 0 200 200" className={`h-full w-full ${className}`} role="img"
      aria-label={`Ilustración de envase de ${product.marca} ${product.nombre}, ${product.presentacion}`}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={t.fondo} />
          <stop offset="100%" stopColor={t.fondo2} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${gid})`} />
      <circle cx="100" cy="96" r="72" fill="#fff" opacity=".5" />
      {/* Silueta de especie al fondo: da contexto de categoría sin fingir una foto. */}
      <g fill={t.pack} opacity=".09" transform="translate(163 44) scale(1.15) translate(-100 -75)">
        <Silueta categoria={product.categoria} />
      </g>
      <Envase p={product} t={t} />
    </svg>
  )
}
