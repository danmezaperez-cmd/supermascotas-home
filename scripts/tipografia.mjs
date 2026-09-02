/** Censo de tamaños de texto realmente pintados, para verificar la escala. */
import { chromium } from 'playwright'
const b = await chromium.launch()
for (const [w, h, label] of [[390, 844, 'móvil'], [1440, 900, 'escritorio']]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } })
  const p = await ctx.newPage()
  await p.goto(process.env.AUDIT_URL ?? 'http://localhost:4311/', { waitUntil: 'networkidle' })
  const censo = await p.evaluate(() => {
    const conteo = {}
    for (const el of document.querySelectorAll('body *')) {
      if (el.classList.contains('sr-only') || el.closest('.sr-only')) continue
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden') continue
      const texto = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).length
      if (!texto) continue
      const px = Math.round(parseFloat(cs.fontSize) * 10) / 10
      const clave = `${px}px`
      conteo[clave] = conteo[clave] ?? { veces: 0, muestra: '' }
      conteo[clave].veces++
      if (!conteo[clave].muestra) conteo[clave].muestra = el.textContent.trim().slice(0, 34)
    }
    return conteo
  })
  console.log(`\n=== ${label} ===`)
  Object.entries(censo)
    .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
    .forEach(([px, v]) => console.log(`  ${px.padStart(7)} × ${String(v.veces).padStart(3)}  «${v.muestra}»`))
  await ctx.close()
}
await b.close()
