import { chromium } from 'playwright'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
const b = await chromium.launch()
const ctx = await b.newContext({ viewport:{width:390,height:844}, hasTouch:true, deviceScaleFactor:2 })
const p = await ctx.newPage()
const errs=[]
p.on('console', m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(`[${m.type()}] ${m.text()}`) })
p.on('pageerror', e=>errs.push('pageerror: '+e.message))
await p.goto(pathToFileURL(resolve('dist/supermascotas-home.html')).href, { waitUntil:'networkidle' })
await p.waitForTimeout(700)
await p.locator('[data-card] [data-add]').first().click()
await p.waitForTimeout(300)
await p.locator('header button[aria-label^="Abrir carrito"]').click()
await p.waitForTimeout(350)
console.log({ dialogo: await p.locator('[role="dialog"]').count(),
  progreso: await p.locator('[role="progressbar"]').first().getAttribute('aria-valuenow'),
  errores: errs.length? errs.slice(0,6) : 'ninguno' })
await p.keyboard.press('Escape'); await p.waitForTimeout(300)
await p.screenshot({ path:'audit/shots/bundle-fold.png' })
await b.close()
