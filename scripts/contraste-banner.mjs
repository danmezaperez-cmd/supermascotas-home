/**
 * Contraste del texto que va SOBRE fotografía. No se puede calcular desde el CSS:
 * se mide el píxel realmente pintado detrás de cada bloque de texto.
 */
import { chromium } from 'playwright'

const URL_BASE = process.env.AUDIT_URL ?? 'http://localhost:4311/'
const b = await chromium.launch()

const lum = ([r, g, b_]) => {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b_)
}
const contra = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

const lector = await (await b.newContext()).newPage()
async function peorLuminancia(pngBuffer) {
  return lector.evaluate(async (b64) => {
    const img = new Image()
    img.src = `data:image/png;base64,${b64}`
    await img.decode()
    const c = document.createElement('canvas')
    c.width = img.width; c.height = img.height
    const ctx = c.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const d = ctx.getImageData(0, 0, c.width, c.height).data
    const px = []
    for (let i = 0; i < d.length; i += 4) px.push([d[i], d[i + 1], d[i + 2]])
    return px
  }, pngBuffer.toString('base64'))
}

for (const [w, h, etiqueta] of [[390, 844, 'móvil'], [1024, 768, 'tableta'], [1440, 900, 'escritorio']]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } })
  const page = await ctx.newPage()
  await page.goto(URL_BASE, { waitUntil: 'networkidle' })
  const track = page.locator('[aria-roledescription="carrusel"] ul')

  for (let i = 0; i < 3; i++) {
    await track.evaluate((el, i) => el.scrollTo({ left: el.clientWidth * i, behavior: 'instant' }), i)
    await page.waitForTimeout(300)

    const cajas = await page.evaluate((i) => {
      const li = document.querySelectorAll('[aria-roledescription="diapositiva"]')[i]
      const t = li.querySelector('.text-display')
      const p = li.querySelector('.text-body-lg')
      const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, height: b.height } }
      return { titulo: r(t), bajada: r(p) }
    }, i)

    // Se oculta la capa de texto para fotografiar solo el fondo real
    await page.evaluate((i) => {
      const li = document.querySelectorAll('[aria-roledescription="diapositiva"]')[i]
      li.querySelector('.on-dark').style.visibility = 'hidden'
    }, i)

    for (const [nombre, caja] of Object.entries(cajas)) {
      if (!caja || caja.width < 2 || caja.height < 2) continue
      const png = await page.screenshot({ clip: caja })
      const px = await peorLuminancia(png)
      const peor = px.map(lum).reduce((a, v) => Math.max(a, v), 0)
      const cr = contra(1, peor) // texto blanco
      const grande = nombre === 'titulo'
      const minimo = grande ? 3 : 4.5
      console.log(
        `${etiqueta.padEnd(11)} diapositiva ${i + 1} ${nombre.padEnd(7)} ` +
        `peor contraste ${cr.toFixed(2)}:1 (mín ${minimo}) ${cr >= minimo ? 'OK' : '✗ FALLA'}`,
      )
    }

    await page.evaluate((i) => {
      const li = document.querySelectorAll('[aria-roledescription="diapositiva"]')[i]
      li.querySelector('.on-dark').style.visibility = ''
    }, i)
  }
  await ctx.close()
}
await b.close()
