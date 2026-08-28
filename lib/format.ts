/** Formato de moneda, ahorro y precio por kilo. Colombia, COP sin decimales. */

const cop = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/**
 * $189.900 — sin espacio tras el signo. Intl inserta un espacio duro que, en
 * cajas estrechas, empujaba el «$» a una línea propia dentro de la tarjeta.
 */
export function formatCOP(value: number): string {
  return cop.format(Math.round(value)).replace(/\s+/g, '')
}

/** Porcentaje entero de ahorro. Devuelve 0 si no hay precio anterior válido. */
export function discountPct(price: number, compareAt?: number): number {
  if (!compareAt || compareAt <= price) return 0
  return Math.round(((compareAt - price) / compareAt) * 100)
}

/** Ahorro absoluto en pesos. */
export function savings(price: number, compareAt?: number): number {
  if (!compareAt || compareAt <= price) return 0
  return compareAt - price
}

/**
 * Precio por kilo — el dato con el que un dueño de mascota realmente compara.
 * Se muestra en TODO alimento, tenga o no descuento.
 */
export function pricePerKilo(price: number, weightKg?: number): string | null {
  if (!weightKg || weightKg <= 0) return null
  return `${formatCOP(price / weightKg)}/kg`
}

/** "14 de septiembre" — urgencia honesta, con fecha real. */
export function promoDeadline(iso: string): string {
  const d = new Date(`${iso}T12:00:00-05:00`)
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })
}

/** "14 sep" — la misma fecha real, para cajas estrechas. */
export function promoDeadlineShort(iso: string): string {
  const d = new Date(`${iso}T12:00:00-05:00`)
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }).replace('.', '').replace(' de ', ' ')
}

/** Días que faltan para una fecha ISO, contra una fecha de referencia fija. */
export function daysUntil(iso: string, today = '2026-08-28'): number {
  const a = new Date(`${today}T12:00:00-05:00`).getTime()
  const b = new Date(`${iso}T12:00:00-05:00`).getTime()
  return Math.max(0, Math.round((b - a) / 86400000))
}
