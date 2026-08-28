/**
 * Empaqueta la exportación estática en un solo archivo HTML autocontenido.
 * Sirve como respaldo para compartir la maqueta sin servidor: se abre con
 * doble clic y funciona igual, incluidas las fotos (van en data URI).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const OUT = 'out'
const DEST = 'dist/supermascotas-home.html'
mkdirSync('dist', { recursive: true })

let html = readFileSync(join(OUT, 'index.html'), 'utf8')
const leer = (url) => readFileSync(join(OUT, url.replace(/^\//, '').split('?')[0]), 'utf8')

// 1. Hojas de estilo → <style>, guardando la equivalencia ruta → data URI
const cssPorRuta = new Map()
html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (m, href) => {
  if (!href.startsWith('/')) return m
  const css = leer(href)
  cssPorRuta.set(href.split('?')[0], `data:text/css;base64,${Buffer.from(css).toString('base64')}`)
  return `<style>${css}</style>`
})

// 2. Precargas de script: sobran cuando todo va incrustado
html = html.replace(/<link[^>]*rel="preload"[^>]*as="script"[^>]*>/g, '')
html = html.replace(/<link[^>]*rel="preload"[^>]*as="style"[^>]*>/g, '')

// 3. Chunks → <script> en el mismo orden, sin async (el orden importa)
html = html.replace(/<script([^>]*)src="([^"]+)"([^>]*)><\/script>/g, (m, a, src, c) => {
  if (!src.startsWith('/')) return m
  const attrs = `${a} ${c}`.includes('nomodule') ? ' nomodule' : ''
  return `<script${attrs}>${leer(src).replace(/<\/script>/gi, '<\\/script>')}</script>`
})

// 4. La carga diferida de React vuelve a pedir la hoja por su ruta desde el
//    payload en línea. Se sustituye por un data URI para que no falle en file://
for (const [ruta, dataUri] of cssPorRuta) {
  html = html.split(ruta).join(dataUri)
}

writeFileSync(DEST, html)
const kb = (Buffer.byteLength(html) / 1024).toFixed(0)
console.log(`→ ${DEST} · ${kb} KB · sin referencias externas: ${!/(src|href)="\/_next/.test(html)}`)
