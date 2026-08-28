# Packshots

El nombre del archivo **es el `id` del producto** en `data/products.ts`.
Para añadir un packshot: guarda `<id>.png` aquí y ejecuta

```bash
node scripts/gen-packshots.mjs && npm run build
```

El generador compone sobre blanco (los originales traen canal alfa), recorta el
margen sobrante y normaliza todos los envases al mismo encuadre cuadrado.
Si un original trae elementos ajenos al envase —rótulos de campaña, por
ejemplo— se declara un recorte previo en `RECORTES`, dentro del script.

Un producto sin archivo propio conserva su ilustración de envase. **Nunca** se
le asigna la foto de otro producto: ese era el bug del catálogo heredado, donde
la arena para gatos mostraba una lata y un alimento propio mostraba una bolsa
de la competencia.

## Presentes hoy

| Archivo | Producto |
|---|---|
| `dog-chow-triple-proteina.png` | Dog Chow Triple Proteína 22,7 kg |
| `fancy-feast-casserole-atun-salmon.png` | Fancy Feast Casserole atún y salmón 85 g |
| `fancy-feast-petit-filets-salmon.png` | Fancy Feast Petit Filets salmón 85 g |
| `felix-classic-atun.png` | Felix Classic trocitos jugosos con atún 85 g |
| `hills-science-diet-7plus.png` | Hill's Science Diet Small Bites Adulto 7+ |
| `nutrecan-adultos-medianas-grandes.png` | Nutrecan Premium Adultos medianas y grandes 8 kg |
| `royal-canin-dachshund-puppy.png` | Royal Canin Dachshund Puppy |

El logotipo oficial va en `assets/logo-supermascotas.png` y lo procesa el mismo
script: recorta el fondo claro por inundación desde los bordes —sin tocar los
blancos interiores del corazón ni del texto— y lo deja transparente.
