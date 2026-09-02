/**
 * Genera data/photos.ts: fotografías reales embebidas como data URI.
 * Regla del proyecto: una foto solo se usa para lo que realmente muestra.
 * Ningún producto reutiliza la foto de otro producto — no hay mapa de alias.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Originales de gran tamaño. Se excluyen del repositorio: lo que se versiona
// es data/photos.ts ya generado, para que el build funcione en un clon limpio.
const SRC = 'assets/fotos'
const tmp = mkdtempSync(join(tmpdir(), 'smphotos-'))

const sips = (args) => execFileSync('/usr/bin/sips', args, { stdio: ['ignore', 'pipe', 'pipe'] })
const dims = (f) => {
  const out = sips(['-g', 'pixelWidth', '-g', 'pixelHeight', f]).toString()
  return {
    w: +out.match(/pixelWidth:\s*(\d+)/)[1],
    h: +out.match(/pixelHeight:\s*(\d+)/)[1],
  }
}

function cover(srcName, W, H, quality) {
  const src = join(SRC, srcName)
  const work = join(tmp, `${W}x${H}-${srcName}`)
  copyFileSync(src, work)
  const { w, h } = dims(work)
  if (w / h > W / H) sips(['--resampleHeight', String(H), work])
  else sips(['--resampleWidth', String(W), work])
  sips(['-c', String(H), String(W), work])
  sips(['-s', 'format', 'jpeg', '-s', 'formatOptions', String(quality), work])
  const b64 = readFileSync(work).toString('base64')
  return { uri: `data:image/jpeg;base64,${b64}`, bytes: Buffer.byteLength(b64) }
}

// slot, archivo, ancho, alto, calidad, alt honesto sobre lo que la foto muestra
const PLAN = [
  ['bannerOfertas',      'ayla-verschueren-nWKMtmbpxQs-unsplash.jpg',       1200, 800, 62, 'Cachorro border collie descansando en el piso de una casa mientras una mano le ofrece un premio'],
  ['bannerClinica',      'karsten-winegeart-loJL4ijUobg-unsplash.jpg',      1200, 800, 62, 'Bulldog francés sentado sobre la mesa de acero de un consultorio veterinario'],
  ['bannerSuscripcion',  'werzk-luuuuuuu-tDlo2ZPlQlU-unsplash.jpg',         1200, 800, 62, 'Persona sosteniendo en brazos a un gato atigrado tranquilo'],
  ['bannerGatos',        'judy-beth-morris-5Bi6MWlWMbw-unsplash.jpg',        800, 600, 60, 'Gato blanco de pelo largo siendo auscultado con un fonendoscopio'],
  ['bannerAgenda',       'priscilla-du-preez-2hc6ocDAsNY-unsplash.jpg',      800, 600, 60, 'Pug negro con collar isabelino transparente mirando a la cámara'],
  ['clinicaEquipo',      'pexels-gustavo-fring-6816864.jpg',                1000, 667, 62, 'Dos veterinarios con guantes atendiendo a un conejo sobre la mesa de consulta'],
  // Fachadas reales de las sedes. Los originales son de baja resolución: sirven
  // como marcador de posición hasta que llegue la fotografía definitiva.
  ['sede1',              'tienda1.png',                                     360, 216, 68, 'Fachada de una sede de Supermascotas con aviso azul y vitrinas de producto'],
  ['sede2',              'Tienda2.png',                                     360, 216, 68, 'Fachada de una sede de Supermascotas con aviso azul sobre la vitrina'],
  ['sede3',              'Tienda3.png',                                     360, 216, 68, 'Fachada de una sede de Supermascotas de esquina, con entrada de vidrio'],
]

let total = 0
const entries = PLAN.map(([key, file, w, h, q, alt]) => {
  const { uri, bytes } = cover(file, w, h, q)
  total += bytes
  console.log(`${key.padEnd(20)} ${w}x${h}  ${(bytes / 1024).toFixed(0)} KB`)
  return { key, uri, w, h, alt }
})
console.log(`TOTAL ${(total / 1024).toFixed(0)} KB`)

const body = `// GENERADO POR scripts/gen-photos.mjs — no editar a mano.
// Fotografías reales embebidas como data URI para que el build de un solo archivo
// funcione sin servidor. Cada 'alt' describe lo que la foto realmente muestra.
export type Photo = { src: string; width: number; height: number; alt: string }

export const photos = {
${entries.map((e) => `  ${e.key}: {\n    width: ${e.w},\n    height: ${e.h},\n    alt: ${JSON.stringify(e.alt)},\n    src: '${e.uri}',\n  },`).join('\n')}
} satisfies Record<string, Photo>

export type PhotoKey = keyof typeof photos
`
writeFileSync('data/photos.ts', body)
console.log('→ data/photos.ts')
