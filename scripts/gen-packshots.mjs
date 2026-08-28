/**
 * Genera data/packshots.ts y data/brand.ts a partir de los archivos de
 * assets/. Las imágenes van en data URI para que el build de un solo archivo
 * siga funcionando sin servidor.
 *
 * El nombre del archivo ES el id del producto. Un producto sin archivo propio
 * conserva su ilustración de envase; nunca hereda la foto de otro.
 */
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, extname, join } from 'node:path'

const DIR = 'assets/packshots'
const LOGO = 'assets/logo-supermascotas.png'
const tmp = mkdtempSync(join(tmpdir(), 'smpack-'))
const sips = (args) => execFileSync('/usr/bin/sips', args, { stdio: ['ignore', 'pipe', 'pipe'] })

/** Encaja la imagen en un lienzo cuadrado blanco, sin deformarla ni recortarla. */
function cuadrado(src, lado, calidad) {
  const work = join(tmp, `${lado}-${basename(src)}.jpg`)
  copyFileSync(src, work)
  sips(['-s', 'format', 'jpeg', work])
  sips(['-Z', String(lado), work])
  sips(['--padToHeightWidth', String(lado), String(lado), '--padColor', 'FFFFFF', work])
  sips(['-s', 'formatOptions', String(calidad), work])
  return `data:image/jpeg;base64,${readFileSync(work).toString('base64')}`
}

/* ---------------- packshots ---------------- */
const archivos = existsSync(DIR)
  ? readdirSync(DIR).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  : []

const entradas = archivos.map((f) => {
  const id = basename(f, extname(f))
  const uri = cuadrado(join(DIR, f), 460, 80)
  console.log(`${id.padEnd(36)} ${(Buffer.byteLength(uri) / 1024).toFixed(0)} KB`)
  return { id, uri }
})

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
  const work = join(tmp, 'logo.png')
  copyFileSync(LOGO, work)
  sips(['-Z', '320', work])
  const uri = `data:image/png;base64,${readFileSync(work).toString('base64')}`
  const dims = sips(['-g', 'pixelWidth', '-g', 'pixelHeight', work]).toString()
  const w = +dims.match(/pixelWidth:\s*(\d+)/)[1]
  const h = +dims.match(/pixelHeight:\s*(\d+)/)[1]
  writeFileSync('data/brand.ts', `// GENERADO POR scripts/gen-packshots.mjs — no editar a mano.
export const logo: { src: string; width: number; height: number } | null = {
  width: ${w},
  height: ${h},
  src: '${uri}',
}
`)
  console.log(`→ data/brand.ts · logotipo ${w}×${h} · ${(Buffer.byteLength(uri) / 1024).toFixed(0)} KB`)
} else {
  console.log(`(sin ${LOGO}: se conserva el logotipo vectorial de respaldo)`)
}
