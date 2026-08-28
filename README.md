# Supermascotas — home orientado a venta

Rediseño de la portada de **Supermascotas** (Surticampo S.A.S., Cali) con un objetivo
único: **enrutar a producto rápido y subir el ticket**. El hero explicativo se sustituye
por un sistema de merchandising, y el diferenciador —clínica veterinaria propia con
urgencias 24 h— pasa de cartel a capa de confianza incrustada en los momentos de decisión.

Next.js 14 (App Router) · TypeScript · Tailwind · exportación estática.

---

## Arranque

```bash
npm install
npm run dev          # http://localhost:4310
```

## Comprobaciones

```bash
npm run typecheck    # tsc --noEmit
npm run build        # exportación estática a out/
npm run bundle       # dist/supermascotas-home.html (un solo archivo, sin servidor)
```

Medición automatizada con Playwright y Chromium (requiere `npm run build` antes):

```bash
node scripts/serve.mjs &   # sirve out/ en :4311
node scripts/audit.mjs     # fold, scroll horizontal, alto de página, flujo de compra
node scripts/a11y.mjs      # contraste AA, áreas táctiles, zoom 200 %, teclado
```

Los resultados quedan en `audit/*.json` y las capturas en `audit/shots/`.

---

## Estructura

```
app/page.tsx            orden de secciones y la intención de cada bloque
components/             BannerSystem, QuickNav, OffersRail, PromiseBand, BestSellers,
                        Subscription, Clinic, Testimonials, Stores, Brands, Newsletter,
                        ProductCard, CartDrawer, StickyBuyBar, FreeShipping
data/banners.ts         sistema publicitario — editar aquí cambia la campaña
data/products.ts        catálogo
data/photos.ts          fotografías en data URI (generado)
data/site.ts            datos de negocio
lib/format.ts           COP, % de ahorro, precio por kilo, vigencia de promoción
lib/cart.tsx            carrito en memoria + progreso hacia envío gratis
scripts/gen-photos.mjs  regenera data/photos.ts desde los originales
```

### Cambiar una campaña

Todo el sistema de banners se arma desde `data/banners.ts`. Un objeto `Banner` declara
su variante (`principal` para el carrusel, `secundario` para los slots del costado),
su propósito (`campana | categoria | marca | servicio`), el CTA y la vigencia real.
No hay JSX repetido: agregar una campaña es agregar un elemento al array.

### Fotografía de producto

`data/products.ts` trae `packshot: null` en todo el catálogo: **no hay fotografía propia
verificada de ningún SKU**. Se renderiza una ilustración de envase con la marca
(`components/ProductArt.tsx`) en lugar de reutilizar el packshot de otro producto —el
bug del catálogo heredado, donde la arena para gatos mostraba una lata y un alimento
propio mostraba una bolsa de la competencia. Cuando llegue el packshot real, basta
poner su data URI en `packshot` y esa foto manda.

Las fotos de `data/photos.ts` son de mascotas y de la clínica, y solo se usan para
retratar eso. Ningún banner muestra un producto.

---

## Publicación

El proyecto exporta estático (`output: 'export'` en `next.config.mjs`) y admite
`NEXT_PUBLIC_BASE_PATH` para servirse bajo un subdirectorio.

### GitHub Pages (lo que está publicado hoy)

```bash
NEXT_PUBLIC_BASE_PATH=/supermascotas-home npm run build
touch out/.nojekyll
npx --yes gh-pages -d out -t   # o el flujo con git worktree de scripts/deploy-pages.sh
```

### Vercel

```bash
npx vercel login
npx vercel --prod
```
Sin `NEXT_PUBLIC_BASE_PATH` (se sirve en la raíz del dominio).

### Netlify

```bash
npx netlify login
npx netlify deploy --prod --dir=out
```

### Cloudflare Pages

```bash
npx wrangler pages deploy out --project-name supermascotas-home
```

### Sin servidor

`npm run bundle` produce `dist/supermascotas-home.html`: un único archivo con el CSS,
el JS y las fotos incrustados. Se abre con doble clic y el flujo de compra funciona
igual. Sirve para compartir por correo o WhatsApp.
