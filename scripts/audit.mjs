import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'

const URL_BASE = process.env.AUDIT_URL ?? 'http://localhost:4311/'
const OUT = process.env.AUDIT_OUT ?? 'audit'
const LABEL = process.env.AUDIT_LABEL ?? 'despues'
mkdirSync(`${OUT}/shots`, { recursive: true })

const VIEWPORTS = [
  { w: 360, h: 800, mobile: true }, { w: 390, h: 844, mobile: true }, { w: 414, h: 896, mobile: true },
  { w: 768, h: 1024, mobile: false }, { w: 1024, h: 768, mobile: false }, { w: 1280, h: 800, mobile: false },
  { w: 1440, h: 900, mobile: false }, { w: 1920, h: 1080, mobile: false },
]

const browser = await chromium.launch()
const filas = []
const consola = []

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: 2,
    // Sin isMobile: la emulación móvil de Chrome descuadra window.innerHeight
    // respecto del viewport real. hasTouch basta para el swipe.
    hasTouch: vp.mobile,
  })
  const page = await ctx.newPage()
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') consola.push(`${vp.w}px [${m.type()}] ${m.text()}`)
  })
  page.on('pageerror', (e) => consola.push(`${vp.w}px [pageerror] ${e.message}`))

  await page.goto(URL_BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)

  const m = await page.evaluate(() => {
    const vh = document.documentElement.clientHeight
    const de = document.documentElement
    const rectAbs = (el) => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY, h: r.height } }

    const banners = document.querySelector('[data-sec="banners"]')
    const card = document.querySelector('[data-card]')
    const precio = card?.querySelector('[data-price]')
    const boton = card?.querySelector('[data-add]')

    const enFold = (el) => { if (!el) return false; const r = rectAbs(el); return r.bottom <= vh && r.top >= 0 }

    // ¿Hay algún elemento que desborde el ancho del viewport?
    let culpables = []
    if (de.scrollWidth > de.clientWidth) {
      culpables = [...document.querySelectorAll('body *')]
        .filter((el) => el.getBoundingClientRect().width > de.clientWidth + 1)
        .slice(0, 6)
        .map((el) => `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ').slice(0, 3).join('.')} w=${Math.round(el.getBoundingClientRect().width)}`)
    }

    return {
      vh,
      scrollWidth: de.scrollWidth,
      clientWidth: de.clientWidth,
      scrollHorizontal: de.scrollWidth > de.clientWidth,
      culpables,
      altoTotal: Math.round(de.scrollHeight),
      bannersBottom: banners ? Math.round(rectAbs(banners).bottom) : null,
      bannersEnFold: enFold(banners),
      primerProductoTop: card ? Math.round(rectAbs(card).top) : null,
      primerProductoBottom: card ? Math.round(rectAbs(card).bottom) : null,
      precioEnFold: enFold(precio),
      botonEnFold: enFold(boton),
      pantallasHastaProducto: card ? +(rectAbs(card).top / vh).toFixed(2) : null,
      h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim().slice(0, 80)),
      niveles: [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => +h.tagName[1]),
    }
  })

  await page.screenshot({ path: `${OUT}/shots/${LABEL}-fold-${vp.w}.png` })
  if (vp.w === 390 || vp.w === 1440) {
    await page.screenshot({ path: `${OUT}/shots/${LABEL}-full-${vp.w}.png`, fullPage: true })
  }

  filas.push({ ancho: vp.w, ...m })
  await ctx.close()
}

/* ---- flujo de compra completo, en móvil ---- */
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 2 })
const page = await ctx.newPage()
const errFlujo = []
page.on('pageerror', (e) => errFlujo.push(e.message))
await page.goto(URL_BASE, { waitUntil: 'networkidle' })

const flujo = {}
await page.locator('[data-card] [data-add]').first().click()
await page.waitForTimeout(250)
flujo.contadorTrasAgregar = await page.locator('header button[aria-label^="Abrir carrito"] span').first().innerText()
await page.screenshot({ path: `${OUT}/shots/${LABEL}-flujo-1-agregado.png` })

await page.mouse.wheel(0, 900)
await page.waitForTimeout(400)
flujo.barraFijaVisible = await page.locator('[data-sticky]').isVisible().catch(() => false)
await page.screenshot({ path: `${OUT}/shots/${LABEL}-flujo-2-barra.png` })

await page.locator('[data-sticky] button').click()
await page.waitForTimeout(400)
flujo.progresoEnvio = await page.locator('[role="progressbar"]').first().getAttribute('aria-valuenow')
flujo.textoEnvio = await page.locator('[role="dialog"] >> text=/envío gratis/i').first().innerText().catch(() => null)
flujo.crossSell = await page.locator('[role="dialog"] >> text=Suele comprarse junto').isVisible().catch(() => false)
await page.screenshot({ path: `${OUT}/shots/${LABEL}-flujo-3-carrito.png` })

// agregar sugerido → el progreso debe avanzar
await page.locator('[role="dialog"] button:has-text("Agregar")').first().click()
await page.waitForTimeout(350)
flujo.progresoTrasCrossSell = await page.locator('[role="progressbar"]').first().getAttribute('aria-valuenow')
await page.screenshot({ path: `${OUT}/shots/${LABEL}-flujo-4-cross.png` })

/* ---- teclado: nada oculto debe ser alcanzable ---- */
await page.keyboard.press('Escape')
await page.waitForTimeout(300)
const tabs = []
for (let i = 0; i < 26; i++) {
  await page.keyboard.press('Tab')
  tabs.push(await page.evaluate(() => {
    const a = document.activeElement
    if (!a || a === document.body) return 'BODY'
    const r = a.getBoundingClientRect()
    const cs = getComputedStyle(a)
    const oculto = cs.visibility === 'hidden' || cs.display === 'none' || (r.width === 0 && r.height === 0)
    const enAriaHidden = !!a.closest('[aria-hidden="true"]')
    return `${a.tagName.toLowerCase()}|${(a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 34)}|${oculto ? 'OCULTO' : 'ok'}${enAriaHidden ? '|EN-ARIA-HIDDEN' : ''}`
  }))
}
await ctx.close()
await browser.close()

const reporte = { url: URL_BASE, label: LABEL, filas, flujo, errFlujo, consola, tabs }
writeFileSync(`${OUT}/${LABEL}.json`, JSON.stringify(reporte, null, 2))

const p = (b) => (b ? 'sí' : 'NO')
console.log('\nancho  scrollH  altoTotal  bannersEnFold  1erProdTop  pantallas  precioFold  botónFold')
for (const f of filas) {
  console.log(
    String(f.ancho).padEnd(6),
    p(f.scrollHorizontal).padEnd(8),
    String(f.altoTotal).padEnd(10),
    p(f.bannersEnFold).padEnd(14),
    String(f.primerProductoTop).padEnd(11),
    String(f.pantallasHastaProducto).padEnd(10),
    p(f.precioEnFold).padEnd(11),
    p(f.botonEnFold),
  )
  if (f.culpables.length) console.log('   desborde:', f.culpables.join(', '))
}
console.log('\nh1:', filas[0].h1)
console.log('flujo:', flujo)
console.log('errores de flujo:', errFlujo.length ? errFlujo : 'ninguno')
console.log('consola:', consola.length ? consola.slice(0, 10) : 'limpia')
console.log('\nfoco (26 tabulaciones):')
tabs.forEach((t, i) => console.log(' ', String(i + 1).padStart(2), t))
