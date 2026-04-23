# Dr Sax - Publicacion desde `static`

Web en Astro sin CMS.
Cada carpeta dentro de `static/` se convierte automaticamente en un post.

## Arranque

```bash
npm install
npm run dev
```

Web: `http://localhost:4321`

## Como publicar un post

1. Crea una carpeta nueva dentro de `static/`, por ejemplo: `static/2026-04-24/`
2. Mete las fotos (`.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`).
3. Opcional: agrega `post.txt` (o `post.md`) con la descripcion general.
4. Opcional: agrega `captions.txt` para pie de foto por imagen.
5. Opcional: agrega `meta.json` para titulo/fecha/modelo/tags.

Sin hacer nada mas, al recargar la web aparece publicado.
Si una imagen no tiene linea en `captions.txt`, se usa automaticamente su nombre de archivo como descripcion breve.

## Formato de `captions.txt`

Una linea por imagen:

```txt
IMG_20260423_094551.jpg|Vista general antes del ajuste.
IMG_20260423_103121.jpg|Detalle de mecanismo tras limpieza.
```

## Formato de `meta.json` (opcional)

```json
{
  "title": "Revision general de saxo alto",
  "excerpt": "Diagnostico, limpieza y ajuste mecanico.",
  "date": "2026-04-23T18:00:00.000Z",
  "workType": "Puesta a punto",
  "model": "Saxo alto",
  "tags": [
    "instrumento:saxo-alto",
    "marca:evette-buffet-crampon",
    "trabajo:ajuste",
    "fase:calibracion",
    "estado:entregado"
  ]
}
```

## Sistema de tags recomendado

- Formato: `prefijo:valor`
- Ejemplos de prefijo: `instrumento:`, `marca:`, `modelo:`, `trabajo:`, `fase:`, `estado:`
- En portada puedes filtrar por tag.
- En portada tambien tienes buscador de tags (`q`) para buscar coincidencias parciales.
- En el detalle, al pulsar un tag vuelves a portada filtrada por ese tag.
