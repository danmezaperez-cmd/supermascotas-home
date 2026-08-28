import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'

const ROOT = new URL('../out/', import.meta.url).pathname
const PORT = Number(process.env.PORT ?? 4311)
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain',
}

createServer(async (req, res) => {
  try {
    let p = normalize(decodeURIComponent(req.url.split('?')[0]))
    let file = join(ROOT, p)
    try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html') }
    catch { file = file.endsWith('.html') ? file : `${file}.html` }
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' })
    res.end(body)
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }); res.end('404')
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`))
