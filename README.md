# Sergio Maestri — Sitio oficial

Sitio del escritor argentino Sergio Maestri.

**Producción:** https://www.sergiomaestri.com.ar
**Panel de contenido:** https://www.sergiomaestri.com.ar/admin

---

## Qué es

Sitio de una sola página construido con **Astro 7**, con salida estática
y sin JavaScript de framework. El menú navega por anclas: al hacer clic
se desplaza dentro de la misma página, no cambia de URL.

El contenido no está escrito en el HTML: vive en `src/content/` como
datos validados, y el cliente lo administra desde `/admin` sin tocar
código.

| | |
|---|---|
| Framework | Astro 7.2 · salida estática |
| Estilos | CSS nativo, sin preprocesador ni framework |
| JavaScript al navegador | ~2.3 KB (menú y visor de imágenes) |
| Carga inicial | ~78 KB |
| Hosting | Netlify, plan gratuito |
| Panel | Decap CMS + DecapBridge |
| Tipografías | Cormorant Garamond y EB Garamond, autoalojadas |

---

## Empezar

Requiere **Node 20 o superior** (Netlify usa la 24).

```bash
npm install
npm run dev          # http://localhost:4321
npm run dev -- --host   # accesible desde el celular en la misma red
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Compila, genera la CSP y valida el SEO |
| `npm run preview` | Sirve el build local para probarlo |
| `npm run check` | Verificación de tipos |

---

## Estructura

```
src/
├── content/            el contenido, administrable desde /admin
│   ├── libros/         12 obras
│   ├── premios/        14 distinciones
│   ├── prensa/         3 bloques
│   ├── blog/           1 bloque
│   ├── otras/          revistas y antologías
│   ├── galerias/       3 galerías, 40 imágenes
│   ├── secciones/      presentación y biografía
│   └── ajustes/        portada, contacto y datos del autor
├── content.config.ts   esquemas Zod de las 8 colecciones
├── components/         15 componentes
├── layouts/Base.astro  head, SEO, Open Graph, datos estructurados
├── pages/              index · 404 · robots.txt
├── styles/             tokens.css y global.css
└── assets/img/         54 imágenes fuente, optimizadas en el build

scripts/
├── csp.mjs             genera dist/_headers con la CSP
└── seo.mjs             informa y valida el SEO del build

public/
├── admin/              panel de contenido (Decap CMS)
└── favicon.svg
```

---

## El build no publica cosas rotas

Tres validaciones abortan el despliegue antes de que salga al aire.
Es lo que permite darle acceso al cliente sin supervisión.

**Esquemas Zod.** Si falta un campo obligatorio o el tipo no coincide,
el build falla nombrando el archivo y el campo:

```
[InvalidContentEntryDataError]  libros → momentos
  alt: Too small: expected string to have >=1 characters
```

**Validación de SEO** (`scripts/seo.mjs`). Verifica el canonical, el
sitemap y los datos estructurados. Aborta si el canonical no usa HTTPS,
apunta a localhost, o si en producción quedó una URL de deploy preview.
Existe porque eso último ya pasó una vez y se publicó.

**Verificación de tipos.** `npm run check` debe dar 0 errores.

---

## El dominio se define en un solo lugar

`astro.config.mjs`:

```js
const DOMINIO_PRODUCCION = 'https://www.sergiomaestri.com.ar';
```

De ahí salen el canonical, Open Graph, Twitter Cards, el JSON-LD, el
sitemap y el robots.txt. **Cambiar de dominio es editar esa línea.**

En Netlify manda `process.env.URL` según el contexto:

| Contexto | URL usada |
|---|---|
| Producción | `URL` — el dominio principal del sitio |
| Deploy preview | `DEPLOY_PRIME_URL` — así no reclama el canonical de producción |
| Local | la constante |

> No usar `DEPLOY_PRIME_URL` en producción: devuelve la URL del branch
> deploy (`main--sitio.netlify.app`), no la del sitio.

---

## Imágenes

Las imágenes van en `src/assets/`, **no en `public/`**. Astro las
optimiza en el build: genera AVIF y WebP, varios anchos, y agrega
`width`/`height` para evitar el salto de layout.

El panel está configurado para escribir ahí. Si el cliente sube una
foto de 8 MB desde el celular, se publica optimizada.

Una imagen en `public/` se publicaría cruda.

---

## Panel de contenido

`/admin` — Decap CMS con autenticación PKCE de DecapBridge.

- Los cambios se guardan como commits en este repositorio
- Netlify reconstruye y publica en aproximadamente un minuto
- Los campos del panel están alineados con los esquemas Zod: un campo
  de más o de menos rompería el build

**Mantenimiento:** el token de GitHub que usa DecapBridge tiene fecha de
vencimiento. Cuando expire, el panel deja de guardar. Conviene tenerlo
agendado.

---

## Despliegue

Netlify construye en cada push a `main`. La configuración está en
`netlify.toml`.

El paso a paso completo —DNS, HTTPS, Search Console— está en
[DESPLIEGUE.md](DESPLIEGUE.md).

---

## Pendiente

El sitio no aparece en Google. Search Console lo marca como
**«Rastreada: actualmente sin indexar»**: la leyó y decidió no
incluirla, con toda probabilidad porque duplica la ficha de
`registrodeescritores.com.ar`, que tiene el mismo contenido y más
antigüedad.

Ninguna mejora técnica ataca esa causa. Lo destraban dos cosas:

1. **Textos originales** — poemas y cuentos completos. Contenido que no
   exista en ningún otro lado.
2. **Backlinks** — editoriales, SADE, Goodreads, Academia Virtual del
   Lunfardo.

La arquitectura está preparada: agregar una sección `/textos/` son unas
pocas líneas de plantilla, porque el contenido ya está modelado como
datos.
