import { logo } from '@/data/brand'

export function Logo({ className = '', onDark = false }: { className?: string; onDark?: boolean }) {
  // Logotipo oficial en cuanto existe assets/logo-supermascotas.png
  if (logo) {
    return (
      <img
        src={logo.src} width={logo.width} height={logo.height}
        alt="Supermascotas" decoding="async"
        className={`h-11 w-auto shrink-0 md:h-14 ${onDark ? 'brightness-0 invert' : ''} ${className}`}
      />
    )
  }

  const mark = onDark ? '#FFFFFF' : '#173DA0'
  const paw = onDark ? '#173DA0' : '#FFFFFF'
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
        <rect width="40" height="40" rx="12" fill={mark} />
        <g fill={paw}>
          <ellipse cx="13.6" cy="14.8" rx="3.1" ry="4" transform="rotate(-16 13.6 14.8)" />
          <ellipse cx="20" cy="12.6" rx="3.1" ry="4.2" />
          <ellipse cx="26.4" cy="14.8" rx="3.1" ry="4" transform="rotate(16 26.4 14.8)" />
          <path d="M20 19.4c4.3 0 7.8 3 7.8 6.5 0 2.7-2.3 4.3-5 4.3-1.1 0-1.9-.4-2.8-.4s-1.7.4-2.8.4c-2.7 0-5-1.6-5-4.3 0-3.5 3.5-6.5 7.8-6.5Z" />
        </g>
      </svg>
      <span className={`min-w-0 text-[1.0625rem] font-extrabold leading-none tracking-tight ${onDark ? 'text-white' : 'text-brand-700'}`}>
        Supermascotas
      </span>
    </span>
  )
}
