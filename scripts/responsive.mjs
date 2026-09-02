/**
 * Barrido responsive. Busca dos fallos que una captura suelta no delata:
 *   · texto recortado por una caja de alto o ancho fijo
 *   · etiquetas de texto cuyas cajas se solapan entre sí
 * Se recorre un abanico ancho de anchos, no solo los ocho de control.
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const URL_BASE = process.env.AUDIT_URL ?? 'http://localhost:4311/'
const ANCHOS = [320, 360, 375, 390, 414, 430, 480, 540, 600, 640, 700, 768, 820, 900, 960, 1024, 1100, 1180, 1280, 1366, 1440, 1600, 1920]

const browser = await chromium.launch()
const informe = {}

for (const w of ANCHOS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(URL_BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(250)

  informe[w] = await page.evaluate(() => {
    /**
     * Un elemento arrastrado fuera de vista por un contenedor con scroll
     * (las diapositivas 2 y 3 del carrusel, las tarjetas de un riel) tiene
     * geometría real pero no se ve: comparar sus cajas produce solapes falsos.
     */
    const visibleEnSusScrollers = (el) => {
      const r = el.getBoundingClientRect()
      for (let n = el.parentElement; n; n = n.parentElement) {
        const cs = getComputedStyle(n)
        if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue
        const rn = n.getBoundingClientRect()
        const ix = Math.min(r.right, rn.right) - Math.max(r.left, rn.left)
        const iy = Math.min(r.bottom, rn.bottom) - Math.max(r.top, rn.top)
        if (ix < r.width * 0.6 || iy < r.height * 0.6) return false
      }
      return true
    }

    /** El texto recortado por un line-clamp ancestro reporta geometría irreal. */
    const dentroDeClamp = (el) => {
      for (let n = el.parentElement; n; n = n.parentElement) {
        const cs = getComputedStyle(n)
        if (cs.webkitLineClamp && cs.webkitLineClamp !== 'none') return true
      }
      return false
    }

    const idOf = (el) => {
      const cls = (el.className || '').toString().split(' ').filter(Boolean).slice(0, 3).join('.')
      return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}`
    }
    const textoDe = (el) => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40)

    /* ---- 1. recortes ---- */
    const recortes = []
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden') continue
      if (el.classList.contains('sr-only') || el.closest('.sr-only')) continue
      const clipY = cs.overflowY === 'hidden' || cs.overflow === 'hidden'
      const clipX = cs.overflowX === 'hidden' || cs.overflow === 'hidden'
      const r = el.getBoundingClientRect()
      if (r.height === 0 || r.width === 0) continue
      const tieneTexto = (el.textContent || '').trim().length > 0
      if (!tieneTexto) continue
      if (!visibleEnSusScrollers(el)) continue

      const clamp = cs.webkitLineClamp && cs.webkitLineClamp !== 'none'
      if (clamp) {
        // Un clamp que de verdad corta texto también es un recorte visible
        if (el.scrollHeight > el.clientHeight + 2) {
          recortes.push({ tipo: 'line-clamp corta', el: idOf(el), texto: textoDe(el), exceso: el.scrollHeight - el.clientHeight })
        }
        continue
      }
      if (clipY && el.scrollHeight > el.clientHeight + 2) {
        recortes.push({ tipo: 'alto', el: idOf(el), texto: textoDe(el), exceso: el.scrollHeight - el.clientHeight })
      }
      if (clipX && el.scrollWidth > el.clientWidth + 2 && cs.textOverflow !== 'ellipsis') {
        recortes.push({ tipo: 'ancho', el: idOf(el), texto: textoDe(el), exceso: el.scrollWidth - el.clientWidth })
      }
    }

    /* ---- 2. solapes entre cajas de texto hermanas ---- */
    const hojas = [...document.querySelectorAll('body *')].filter((el) => {
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'absolute' || cs.position === 'fixed') return false
      if (el.classList.contains('sr-only') || el.closest('.sr-only')) return false
      const propio = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
      if (!propio) return false
      if (dentroDeClamp(el) || !visibleEnSusScrollers(el)) return false
      const r = el.getBoundingClientRect()
      return r.width > 2 && r.height > 2
    })
    const solapes = []
    for (let i = 0; i < hojas.length; i++) {
      for (let j = i + 1; j < hojas.length; j++) {
        const a = hojas[i], b = hojas[j]
        if (a.contains(b) || b.contains(a)) continue
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect()
        const ix = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left)
        const iy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top)
        if (ix > 2 && iy > 2) {
          solapes.push({ a: `${idOf(a)} «${textoDe(a)}»`, b: `${idOf(b)} «${textoDe(b)}»`, area: Math.round(ix * iy) })
        }
      }
    }

    const de = document.documentElement
    return {
      desbordeHorizontal: de.scrollWidth > de.clientWidth + 1,
      recortes: recortes.slice(0, 12),
      solapes: solapes.slice(0, 12),
    }
  })
  await ctx.close()
}
await browser.close()

writeFileSync('audit/responsive.json', JSON.stringify(informe, null, 2))
let fallos = 0
for (const [w, r] of Object.entries(informe)) {
  const lineas = []
  if (r.desbordeHorizontal) lineas.push('  ✗ scroll horizontal')
  r.recortes.forEach((x) => lineas.push(`  ✗ recorte ${x.tipo} +${x.exceso}px · ${x.el} «${x.texto}»`))
  r.solapes.forEach((x) => lineas.push(`  ✗ solape ${x.area}px² · ${x.a}  ×  ${x.b}`))
  if (lineas.length) { fallos += lineas.length; console.log(`\n=== ${w}px ===`); lineas.forEach((l) => console.log(l)) }
}
console.log(fallos === 0 ? '\nSin recortes ni solapes en ningún ancho.' : `\nTotal: ${fallos} incidencias.`)
