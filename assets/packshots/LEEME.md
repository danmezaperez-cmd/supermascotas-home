# Packshots y logotipo

Guarda aquí los archivos con **exactamente** estos nombres y luego ejecuta:

```bash
node scripts/gen-packshots.mjs && npm run build
```

## Packshots (PNG o JPG, fondo blanco o transparente)

| Archivo | Producto |
|---|---|
| `royal-canin-dachshund-puppy.png` | Royal Canin Dachshund Puppy |
| `hills-science-diet-7plus.png` | Hill's Science Diet Small Bites Adulto 7+ |
| `nutrecan-adultos-medianas-grandes.png` | Nutrecan Premium Adultos razas medianas y grandes 8 kg |
| `dog-chow-triple-proteina.png` | Dog Chow Triple Proteína 22,7 kg |
| `fancy-feast-casserole-atun-salmon.png` | Fancy Feast Casserole atún y salmón 85 g |
| `fancy-feast-petit-filets-salmon.png` | Fancy Feast Petit Filets salmón 85 g |
| `felix-classic-atun.png` | Felix Classic con atún 85 g |

El nombre del archivo es el `id` del producto en `data/products.ts`. Para sumar
más packshots basta con guardar `<id>.png` aquí y volver a ejecutar el script.

Un producto sin archivo propio conserva la ilustración de envase. **Nunca** se le
asigna la foto de otro producto: ese era el bug del catálogo heredado.

## Logotipo

| Archivo | Uso |
|---|---|
| `../logo-supermascotas.png` | Logotipo oficial, en `assets/` (no en esta carpeta) |
