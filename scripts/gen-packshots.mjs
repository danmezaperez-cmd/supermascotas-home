/**
 * Genera data/packshots.ts y data/brand.ts desde assets/.
 *
 * El nombre del archivo ES el id del producto. Un producto sin archivo propio
 * conserva su ilustración de envase; nunca hereda la foto de otro.
 *
 * El procesado va por Chromium porque los originales traen canal alfa y hay
 * que componerlos sobre blanco —sips los pondría sobre negro—, recortar el
 * margen sobrante y normalizar todos los envases al mismo encuadre.
 */
import { chromium } from 'playwright'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, extname, join } from 'node:path'

const DIR = 'assets/packshots'
const LOGO = 'assets/logo-supermascotas.png'

/**
 * Recortes previos, en fracción de ancho/alto. Solo para originales que traen
 * elementos ajenos al envase: la pieza de Royal Canin viene con los rótulos
 * de beneficios a la izquierda, que a 80 px son ruido ilegible.
 */
const RECORTES = {
  'royal-canin-dachshund-puppy': { x0: 0.4, y0: 0, x1: 1, y1: 1 },
}

const LADO = 440
const MARGEN = 0.05

const browser = await chromium.launch()
const page = await (await browser.newContext()).newPage()
await page.goto('about:blank')

const dataUri = (file) => {
  const ext = extname(file).slice(1).toLowerCase()
  const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
  return `data:${mime};base64,${readFileSync(file).toString('base64')}`
}

/** Compone sobre blanco, recorta el margen claro y centra en un cuadrado. */
async function packshot(file, recorte) {
  return page.evaluate(async ({ uri, recorte, LADO, MARGEN }) => {
    const img = new Image()
    img.src = uri
    await img.decode()

    // 1. Sobre blanco, con el recorte previo si lo hay
    const r = recorte ?? { x0: 0, y0: 0, x1: 1, y1: 1 }
    const sx = Math.round(img.width * r.x0), sy = Math.round(img.height * r.y0)
    const sw = Math.round(img.width * (r.x1 - r.x0)), sh = Math.round(img.height * (r.y1 - r.y0))
    const base = document.createElement('canvas')
    base.width = sw; base.height = sh
    const bc = base.getContext('2d')
    bc.fillStyle = '#fff'; bc.fillRect(0, 0, sw, sh)
    bc.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh)

    // 2. Caja del contenido: se descarta el margen casi blanco
    const d = bc.getImageData(0, 0, sw, sh).data
    let x0 = sw, y0 = sh, x1 = 0, y1 = 0
    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const i = (y * sw + x) * 4
        if (d[i] > 246 && d[i + 1] > 246 && d[i + 2] > 246) continue
        if (x < x0) x0 = x; if (x > x1) x1 = x
        if (y < y0) y0 = y; if (y > y1) y1 = y
      }
    }
    if (x1 <= x0 || y1 <= y0) { x0 = 0; y0 = 0; x1 = sw - 1; y1 = sh - 1 }
    const cw = x1 - x0 + 1, ch = y1 - y0 + 1

    // 3. Centrado en un cuadrado blanco, sin deformar
    const out = document.createElement('canvas')
    out.width = LADO; out.height = LADO
    const oc = out.getContext('2d')
    oc.fillStyle = '#fff'; oc.fillRect(0, 0, LADO, LADO)
    oc.imageSmoothingQuality = 'high'
    const util = LADO * (1 - MARGEN * 2)
    const escala = Math.min(util / cw, util / ch)
    const dw = cw * escala, dh = ch * escala
    oc.drawImage(base, x0, y0, cw, ch, (LADO - dw) / 2, (LADO - dh) / 2, dw, dh)

    return { uri: out.toDataURL('image/jpeg', 0.82), recortado: `${cw}×${ch}` }
  }, { uri: dataUri(file), recorte, LADO, MARGEN })
}

/* ---------------- packshots ---------------- */
const archivos = existsSync(DIR)
  ? readdirSync(DIR).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort()
  : []

const entradas = []
for (const f of archivos) {
  const id = basename(f, extname(f))
  const { uri, recortado } = await packshot(join(DIR, f), RECORTES[id])
  entradas.push({ id, uri })
  console.log(`${id.padEnd(36)} contenido ${recortado.padEnd(9)} ${(Buffer.byteLength(uri) / 1024).toFixed(0)} KB`)
}

writeFileSync('data/packshots.ts', `// GENERADO POR scripts/gen-packshots.mjs — no editar a mano.
// Fotografía propia y verificada de cada SKU. La clave es el id del producto:
// si un id no aparece aquí, ese producto se dibuja con su ilustración de envase.
export const packshots: Record<string, string> = {
${entradas.map((e) => `  '${e.id}':\n    '${e.uri}',`).join('\n')}
}
`)
console.log(`→ data/packshots.ts · ${entradas.length} packshots`)

/* ---------------- logotipo ---------------- */
if (existsSync(LOGO)) {
  const r = await page.evaluate(async ({ uri }) => {
    const img = new Image()
    img.src = uri
    await img.decode()
    const c = document.createElement('canvas')
    c.width = img.width; c.height = img.height
    const ctx = c.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const im = ctx.getImageData(0, 0, c.width, c.height)
    const d = im.data
    const W = c.width, H = c.height

    // Relleno por inundación desde los bordes: vuelve transparente el fondo
    // claro SIN tocar los blancos interiores del logotipo (el corazón, el texto).
    const claro = (i) => d[i] > 240 && d[i + 1] > 240 && d[i + 2] > 240
    const vistos = new Uint8Array(W * H)
    const cola = []
    for (let x = 0; x < W; x++) { cola.push([x, 0], [x, H - 1]) }
    for (let y = 0; y < H; y++) { cola.push([0, y], [W - 1, y]) }
    while (cola.length) {
      const [x, y] = cola.pop()
      if (x < 0 || y < 0 || x >= W || y >= H) continue
      const p = y * W + x
      if (vistos[p]) continue
      const i = p * 4
      if (!claro(i)) continue
      vistos[p] = 1
      d[i + 3] = 0
      cola.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
    }
    ctx.putImageData(im, 0, 0)

    // Recorte a la caja de lo que quedó opaco
    let x0 = W, y0 = H, x1 = 0, y1 = 0
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (d[(y * W + x) * 4 + 3] < 16) continue
      if (x < x0) x0 = x; if (x > x1) x1 = x
      if (y < y0) y0 = y; if (y > y1) y1 = y
    }
    const cw = x1 - x0 + 1, ch = y1 - y0 + 1
    const alto = 120
    const out = document.createElement('canvas')
    out.width = Math.round(cw * (alto / ch)); out.height = alto
    const oc = out.getContext('2d')
    oc.imageSmoothingQuality = 'high'
    oc.drawImage(c, x0, y0, cw, ch, 0, 0, out.width, out.height)
    return { uri: out.toDataURL('image/png'), w: out.width, h: out.height }
  }, { uri: dataUri(LOGO) })

  writeFileSync('data/brand.ts', `// GENERADO POR scripts/gen-packshots.mjs — no editar a mano.
export const logo: { src: string; width: number; height: number } | null = {
  width: ${r.w},
  height: ${r.h},
  src: '${r.uri}',
}
`)
  console.log(`→ data/brand.ts · logotipo ${r.w}×${r.h} · ${(Buffer.byteLength(r.uri) / 1024).toFixed(0)} KB`)
} else {
  console.log(`(sin ${LOGO}: se conserva el logotipo vectorial de respaldo)`)
}

await browser.close()
