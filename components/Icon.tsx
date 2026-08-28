import type { SVGProps } from 'react'

/** Set de iconos propio, trazo 1.75, caja 24. Un solo lenguaje gráfico. */
const paths: Record<string, JSX.Element> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  cart: <><path d="M3 5h2.2l2.3 10.2a2 2 0 0 0 2 1.6h7.3a2 2 0 0 0 2-1.5L20.5 8H6" /><circle cx="10" cy="20" r="1.4" /><circle cx="17.5" cy="20" r="1.4" /></>,
  user: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  truck: <><path d="M3 7h10v9H3z" /><path d="M13 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>,
  clock: <><circle cx="12" cy="12" r="8.2" /><path d="M12 7.5V12l3 1.8" /></>,
  wallet: <><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H18v3" /><path d="M4 8.5V17a2 2 0 0 0 2 2h13v-4.5" /><path d="M20 9v6h-3.6a3 3 0 0 1 0-6z" /></>,
  rotate: <><path d="M20 12a8 8 0 1 1-2.6-5.9" /><path d="M20 4v4.5h-4.5" /></>,
  cross: <><path d="M12 3.8c3.1 0 5.6.8 7.2 1.4v6.2c0 4.4-3 7.5-7.2 8.8-4.2-1.3-7.2-4.4-7.2-8.8V5.2C6.4 4.6 8.9 3.8 12 3.8Z" /><path d="M12 8.6v5.2M9.4 11.2h5.2" /></>,
  dog: <><path d="M6.7 6.3c-1.7.5-2.5 2.3-2.3 4.5.2 2.3 1.1 3.7 2.3 4.2" /><path d="M17.3 6.3c1.7.5 2.5 2.3 2.3 4.5-.2 2.3-1.1 3.7-2.3 4.2" /><path d="M12 5.4c3.1 0 5.4 2.5 5.4 6.2 0 4.2-2.3 7.3-5.4 7.3s-5.4-3.1-5.4-7.3c0-3.7 2.3-6.2 5.4-6.2Z" /><path d="M10.1 11.6h.01M13.9 11.6h.01" /><path d="M12 14.3c-.9 0-1.5.5-1.5 1.1 0 .7.7 1.2 1.5 1.2s1.5-.5 1.5-1.2c0-.6-.6-1.1-1.5-1.1Z" /></>,
  cat: <><path d="m6.3 10.3-1-5.6 4.4 2.7" /><path d="m17.7 10.3 1-5.6-4.4 2.7" /><path d="M12 6.7c3.3 0 5.9 2.8 5.9 6.3S15.3 19 12 19s-5.9-2.5-5.9-6 2.6-6.3 5.9-6.3Z" /><path d="M9.9 12.3h.01M14.1 12.3h.01" /><path d="M12 14.4v1.2M10 15.5c.5.7 1.2 1 2 1s1.5-.3 2-1" /><path d="M3.9 12.9h2.3M17.8 12.9h2.3" /></>,
  bird: <><path d="M9.6 9.4 8.3 4.6c-.3-1.1 1-1.8 1.7-.9l2.2 3.1" /><path d="m14.4 9.4 1.3-4.8c.3-1.1-1-1.8-1.7-.9l-2.2 3.1" /><path d="M12 8.9c3.1 0 5.5 2.3 5.5 5.3s-2.4 5-5.5 5-5.5-2-5.5-5 2.4-5.3 5.5-5.3Z" /><path d="M10.2 13.5h.01M13.8 13.5h.01" /><path d="M12 15.4v1" /></>,
  tag: <><path d="M4 11.4V5.2A1.2 1.2 0 0 1 5.2 4h6.2a2 2 0 0 1 1.4.6l6.6 6.6a2 2 0 0 1 0 2.8l-5 5a2 2 0 0 1-2.8 0l-6.6-6.6a2 2 0 0 1-.6-1.4Z" /><path d="M8.3 8.3h.01" /></>,
  star: <path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.7l5.8-.8z" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  chevronL: <path d="M14.5 5 8 12l6.5 7" />,
  chevronR: <path d="M9.5 5 16 12l-6.5 7" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5.5v13M5.5 12h13" />,
  minus: <path d="M5.5 12h13" />,
  trash: <><path d="M4.5 7h15M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7" /><path d="M6.5 7l.9 11.2A1.9 1.9 0 0 0 9.3 20h5.4a1.9 1.9 0 0 0 1.9-1.8L17.5 7" /></>,
  phone: <path d="M6.4 4h3l1.4 3.5-2 1.5a11 11 0 0 0 5.2 5.2l1.5-2 3.5 1.4v3a2 2 0 0 1-2.2 2A15.6 15.6 0 0 1 4.4 6.2 2 2 0 0 1 6.4 4Z" />,
  pin: <><path d="M12 21c4-4.4 6-7.6 6-10a6 6 0 1 0-12 0c0 2.4 2 5.6 6 10Z" /><circle cx="12" cy="10.6" r="2.3" /></>,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4.5 7.5 7.5 5 7.5-5" /></>,
  shield: <><path d="M12 3.5 19 6v5.6c0 4.2-2.8 7.3-7 8.9-4.2-1.6-7-4.7-7-8.9V6z" /><path d="m9 12 2.2 2.2L15.2 10" /></>,
  lab: <><path d="M10 3.5v6L5.4 17a2 2 0 0 0 1.7 3h9.8a2 2 0 0 0 1.7-3L14 9.5v-6" /><path d="M9 3.5h6M7.6 14.5h8.8" /></>,
  scan: <><path d="M4 8.5V6a2 2 0 0 1 2-2h2.5M20 8.5V6a2 2 0 0 0-2-2h-2.5M4 15.5V18a2 2 0 0 0 2 2h2.5M20 15.5V18a2 2 0 0 1-2 2h-2.5" /><path d="M8 12h8" /></>,
  scissors: <><circle cx="6.5" cy="6.5" r="2.3" /><circle cx="6.5" cy="17.5" r="2.3" /><path d="M8.4 7.9 19 17M19 7 8.4 16.1" /></>,
  bolt: <path d="M13.5 3.5 6 13.2h5l-.5 7.3L18 10.8h-5z" />,
  bag: <><path d="M6 8h12l-1 11.2a2 2 0 0 1-2 1.8H9a2 2 0 0 1-2-1.8z" /><path d="M9 8V6.5a3 3 0 1 1 6 0V8" /></>,
  repeat: <><path d="M4 9.5A3.5 3.5 0 0 1 7.5 6H18" /><path d="m15.5 3.5 2.8 2.5-2.8 2.5" /><path d="M20 14.5a3.5 3.5 0 0 1-3.5 3.5H6" /><path d="m8.5 20.5-2.8-2.5 2.8-2.5" /></>,
  sparkle: <path d="M12 3.5c.7 3.6 1.7 4.7 5.3 5.5-3.6.8-4.6 1.8-5.3 5.4-.7-3.6-1.7-4.6-5.3-5.4 3.6-.8 4.6-1.9 5.3-5.5ZM17.8 15.4c.4 1.8.9 2.3 2.7 2.7-1.8.4-2.3.9-2.7 2.6-.4-1.7-.9-2.2-2.6-2.6 1.7-.4 2.2-.9 2.6-2.7Z" />,
}

export type IconName = keyof typeof paths

export function Icon({
  name, size = 20, filled = false, ...rest
}: { name: IconName; size?: number; filled?: boolean } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false"
      fill={filled ? 'currentColor' : 'none'} stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...rest}
    >
      {paths[name]}
    </svg>
  )
}
