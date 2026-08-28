import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const URL_BASE = process.env.AUDIT_URL ?? 'http://localhost:4311/'
const browser = await chromium.launch()

/* ---------- contraste y áreas táctiles, en móvil y escritorio ---------- */
const resultados = {}
for (const [w, h, label] of [[390, 844, 'movil'], [1440, 900, 'escritorio']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } })
  const page = await ctx.newPage()
  await page.goto(URL_BASE, { waitUntil: 'networkidle' })

  resultados[label] = await page.evaluate(() => {
    const parse = (c) => {
      const m = c.match(/rgba?\(([^)]+)\)/)
      if (!m) return null
      const [r, g, b, a = 1] = m[1].split(',').map((n) => parseFloat(n))
      return { r, g, b, a }
    }
    const mezcla = (fg, bg) => ({
      r: fg.r * fg.a + bg.r * (1 - fg.a),
      g: fg.g * fg.a + bg.g * (1 - fg.a),
      b: fg.b * fg.a + bg.b * (1 - fg.a),
      a: 1,
    })
    const lum = ({ r, g, b }) => {
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
    }
    const ratio = (a, b) => {
      const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
      return (l1 + 0.05) / (l2 + 0.05)
    }
    const fondoDe = (el) => {
      let acc = null
      for (let n = el; n; n = n.parentElement) {
        const cs = getComputedStyle(n)
        // Texto sobre imagen: no se puede calcular de forma fiable, se marca aparte
        if (cs.backgroundImage !== 'none') return { sobreImagen: true }
        const c = parse(cs.backgroundColor)
        if (c && c.a > 0) {
          acc = acc ? mezcla(acc, c) : c
          if (acc.a >= 0.999) return { color: acc }
        }
      }
      return { color: { r: 255, g: 255, b: 255, a: 1 } }
    }

    const fallos = []
    const sobreImagen = []
    const chicos = []

    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue

      // Área táctil de elementos interactivos
      const interactivo = el.matches('a[href], button, input, select, [tabindex]:not([tabindex="-1"])')
      if (interactivo && !el.querySelector('a[href], button, input, select')) {
        const seudo = el.querySelector('.tap') || el.classList.contains('tap')
        const alto = seudo ? Math.max(r.height, 44) : r.height
        const ancho = seudo ? Math.max(r.width, 44) : r.width
        if (alto < 44 - 0.5 || ancho < 24) {
          chicos.push(`${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30)}" ${Math.round(ancho)}×${Math.round(alto)}`)
        }
      }

      // Contraste de texto propio del elemento
      const texto = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ')
      if (!texto) continue
      const fg = parse(cs.color)
      if (!fg) continue
      const bg = fondoDe(el)
      const px = parseFloat(cs.fontSize)
      const grande = px >= 24 || (px >= 18.66 && +cs.fontWeight >= 700)
      const minimo = grande ? 3 : 4.5
      const etiqueta = `${el.tagName.toLowerCase()} ${px}px/${cs.fontWeight} "${texto.slice(0, 34)}"`
      if (bg.sobreImagen) { sobreImagen.push(etiqueta); continue }
      const cr = ratio(fg.a < 1 ? mezcla(fg, bg.color) : fg, bg.color)
      if (cr < minimo) fallos.push(`${etiqueta} → ${cr.toFixed(2)}:1 (mín ${minimo})`)
    }
    return { fallos, sobreImagen: [...new Set(sobreImagen)], chicos: [...new Set(chicos)] }
  })
  await ctx.close()
}

/* ---------- zoom al 200 % ---------- */
const ctxZ = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
const pz = await ctxZ.newPage()
await pz.goto(URL_BASE, { waitUntil: 'networkidle' })
// 200 % ≈ mitad de ancho CSS con el mismo tamaño de fuente
await pz.setViewportSize({ width: 195, height: 422 })
await pz.waitForTimeout(400)
const zoom = await pz.evaluate(() => {
  const de = document.documentElement
  return { scrollW: de.scrollWidth, clientW: de.clientWidth, desborde: de.scrollWidth > de.clientWidth + 1 }
})
await pz.screenshot({ path: 'audit/shots/zoom-200.png', fullPage: false })
await ctxZ.close()

/* ---------- teclado y elementos ocultos alcanzables ---------- */
const ctxK = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const pk = await ctxK.newPage()
await pk.goto(URL_BASE, { waitUntil: 'networkidle' })
const teclado = { ocultosAlcanzables: [], enAriaHidden: [], sinFocoVisible: [], total: 0 }
for (let i = 0; i < 70; i++) {
  await pk.keyboard.press('Tab')
  const r = await pk.evaluate(() => {
    const a = document.activeElement
    if (!a || a === document.body) return null
    const cs = getComputedStyle(a)
    const rect = a.getBoundingClientRect()
    return {
      etiqueta: `${a.tagName.toLowerCase()} "${(a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 30)}"`,
      oculto: cs.visibility === 'hidden' || cs.display === 'none' || (rect.width === 0 && rect.height === 0),
      ariaHidden: !!a.closest('[aria-hidden="true"]'),
      outline: cs.outlineWidth,
    }
  })
  if (!r) break
  teclado.total++
  if (r.oculto) teclado.ocultosAlcanzables.push(r.etiqueta)
  if (r.ariaHidden) teclado.enAriaHidden.push(r.etiqueta)
  if (r.outline === '0px') teclado.sinFocoVisible.push(r.etiqueta)
}
// carrito cerrado: no debe existir en el DOM
teclado.cajonCerradoEnDom = await pk.locator('[role="dialog"]').count()
await pk.locator('header button[aria-label^="Abrir carrito"]').click()
await pk.waitForTimeout(300)
teclado.cajonAbiertoEnDom = await pk.locator('[role="dialog"]').count()
teclado.focoAlAbrir = await pk.evaluate(() => document.activeElement?.getAttribute('aria-label'))
await pk.keyboard.press('Escape')
await pk.waitForTimeout(300)
teclado.cajonTrasEscape = await pk.locator('[role="dialog"]').count()
teclado.focoRestaurado = await pk.evaluate(() => document.activeElement?.getAttribute('aria-label'))
await ctxK.close()
await browser.close()

const out = { contraste: resultados, zoom200: zoom, teclado }
writeFileSync('audit/a11y.json', JSON.stringify(out, null, 2))
for (const [k, v] of Object.entries(resultados)) {
  console.log(`\n=== ${k} ===`)
  console.log('contraste AA fallos:', v.fallos.length ? v.fallos : 'ninguno')
  console.log('texto sobre imagen (revisión manual):', v.sobreImagen.length ? v.sobreImagen : 'ninguno')
  console.log('áreas táctiles < 44 px:', v.chicos.length ? v.chicos : 'ninguna')
}
console.log('\nzoom 200 %:', zoom)
console.log('teclado:', teclado)
