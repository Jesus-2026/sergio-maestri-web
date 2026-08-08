# Sergio Maestri - Sitio Web Oficial

Sitio web profesional del escritor argentino Sergio Maestri. **One-page website** (sitio de una sola página) estático con diseño literario elegante y minimalista.

## 📋 Descripción

Sitio web personal que presenta la obra, biografía, premios y actividades del escritor Sergio Gabriel Maestri. Diseño responsive optimizado para escritorio y dispositivos móviles.

**Arquitectura:** Sitio estático de una sola página HTML con navegación por anclas (`#biografia`, `#obras`, etc.). No es una SPA (Single Page Application) como React/Vue, sino un sitio tradicional multi-sección en un único archivo HTML.

**URL de producción:** https://sergio-maestri-escritor.netlify.app/

---

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos puros sin frameworks
- **JavaScript Vanilla** - Sin dependencias externas
- **Netlify** - Hosting y despliegue continuo
- **Google Fonts** - Tipografías Cormorant Garamond y EB Garamond

---

## 📁 Estructura del Proyecto

```
sergio-maestri-web/
│
├── index.html                          # Página principal (único HTML)
├── robots.txt                          # Configuración para buscadores
├── sitemap.xml                         # Mapa del sitio para SEO
├── netlify.toml                        # Configuración de Netlify
├── google7a17524129be9fc6.html        # Verificación Google Search Console
│
└── img/                                # Directorio de imágenes
    ├── autor.jpg                       # Foto del autor
    ├── hero.jpg                        # Imagen hero alternativa
    ├── hero2.png                       # Imagen hero principal
    │
    ├── covers/                         # Portadas de libros
    │   ├── momentos.jpg
    │   ├── proceso-interior.jpg
    │   ├── sobre-la-vida.jpg
    │   ├── serrat.jpg
    │   ├── cronicas-winter.jpg
    │   ├── la-raza-de-bronce.jpg
    │   ├── luna-buenos-aires.jpg
    │   ├── cuentos-esotericos.jpg
    │   ├── relatos-trasnochados.jpg
    │   ├── fabulas-selva.jpg
    │   ├── ultimos-dias.jpg
    │   └── el-despertar.jpg
    │
    ├── premios/                        # Diplomas y distinciones (p01.jpg a p15.jpg)
    ├── prensa/                         # Fotos de eventos (r01.jpg a r18.jpg)
    └── otras/                          # Publicaciones en revistas (o01.jpg a o07.jpg)
```

---

## 🎨 Paleta de Colores

El sitio utiliza una paleta de colores literaria y elegante:

```css
:root {
  --crema: #f6f1e7;              /* Fondo principal */
  --crema-2: #efe7d6;            /* Fondo alternativo */
  --tinta: #2b2620;              /* Texto principal */
  --tinta-suave: #534b40;        /* Texto secundario */
  --marron: #6b4f2e;             /* Enlaces y detalles */
  --dorado: #a9863f;             /* Acentos */
  --dorado-claro: #c9a86a;       /* Acentos suaves */
  --linea: #d8cab0;              /* Bordes y separadores */
  --sombra: rgba(43,38,32,.12);  /* Sombras sutiles */
}
```

---

## 📄 Secciones del Sitio

### 1. **Hero Section** (`#inicio`)
- Imagen de fondo con overlay
- Título principal y cita del autor
- CTA (Call to Action) hacia obras

### 2. **Presentación** (`#presentacion`)
- Foto del autor
- Texto de presentación personal
- Filosofía de trabajo

### 3. **Biografía** (`#biografia`)
- Trayectoria educativa y profesional
- Formación literaria
- Experiencia en talleres y círculos de escritores

### 4. **Premios** (`#premios`)
- Lista cronológica de 14 premios literarios (1983-2022)
- Galería de diplomas y distinciones (15 imágenes)
- Lightbox interactivo

### 5. **Obras** (`#obras`)
- Grid de 12 libros publicados con:
  - Portada
  - Tipo (Poesía, Novela, Cuento, etc.)
  - Título, año y editorial
  - Sinopsis
- Otras publicaciones (revistas y antologías)
- Galería de revistas (7 imágenes)

### 6. **Prensa** (`#prensa`)
- Presentaciones de libros
- Encuentros y talleres literarios
- Entrevistas radiales con enlaces a YouTube
- Galería de fotos (18 imágenes)

### 7. **Blog** (`#blog`)
- Notas de opinión
- Enlaces a publicaciones externas
- Cartas de lectores en medios

### 8. **Contacto** (`#contacto`)
- Email de contacto
- Enlaces a redes sociales (Facebook e Instagram)

---

## 🧩 Funcionalidades JavaScript

### Menú de Navegación
```javascript
function cerrar() {
  document.getElementById('menu').classList.remove('open');
}
```
- Menú hamburguesa responsive
- Cierre automático al hacer clic en enlaces

### Generación Dinámica de Galerías
```javascript
function fill(id, dir, prefix, count, ext) {
  // Genera automáticamente imágenes numeradas
}
```
- **Galería de premios:** 15 imágenes (`p01.jpg` a `p15.jpg`)
- **Galería de prensa:** 18 imágenes (`r01.jpg` a `r18.jpg`)
- **Otras publicaciones:** 7 imágenes (`o01.jpg` a `o07.jpg`)

### Lightbox (Visor de Imágenes)
- Navegación con flechas ◀ ▶
- Navegación con teclado (←, →, Esc)
- Soporte para swipe en dispositivos táctiles
- Contador de imágenes (ej: "3 / 15")
- Funciona con galerías y portadas de libros

### Copyright Dinámico
```javascript
document.getElementById('year').textContent = new Date().getFullYear();
```

---

## 🔍 SEO y Metadatos

### Meta Tags Básicos
```html
<title>Sergio Maestri — Escritor Argentino | Poesía, Novela y Cuento</title>
<meta name="description" content="Sitio oficial de Sergio Maestri...">
<meta name="keywords" content="Sergio Maestri, escritor argentino...">
```

### Open Graph (Facebook/WhatsApp)
```html
<meta property="og:type" content="website">
<meta property="og:title" content="Sergio Maestri — Escritor Argentino">
<meta property="og:image" content=".../img/hero2.png">
```

### Twitter Cards
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content=".../img/autor.jpg">
```

### Schema.org (JSON-LD)
Datos estructurados para buscadores:
- **Person:** Información del autor (nombre, fecha de nacimiento, nacionalidad, premios)
- **WebSite:** Información del sitio web

---

## 🚀 Despliegue en Netlify

### Configuración (`netlify.toml`)

**Build:**
```toml
[build]
  publish = "."
  command = ""
```

**Headers de Seguridad:**
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

**Optimización de Caché:**
- HTML: `max-age=0` (siempre actualizado)
- Imágenes: `max-age=31536000` (1 año, inmutable)
- robots.txt/sitemap.xml: `max-age=3600` (1 hora)

### Comandos de Despliegue

El sitio es completamente estático, no requiere proceso de build.

**Despliegue manual:**
```bash
# Subir cambios a Git
git add .
git commit -m "Actualización del sitio"
git push origin main
```

Netlify detecta automáticamente los cambios y despliega.

---

## 📱 Responsive Design

### Breakpoints

**Escritorio:** `> 760px`
- Hero con texto a la derecha
- Menú horizontal
- Portada del autor a la izquierda del texto

**Mobile:** `≤ 760px`
- Hero centrado con overlay más oscuro
- Menú hamburguesa desplegable
- Portada del autor centrada encima del texto
- Galerías adaptativas

---

## 🎯 Características Destacadas

### ✅ Ventajas
- **Sin dependencias:** No requiere npm, webpack ni node_modules
- **Ligero:** Un solo archivo HTML (~39 KB)
- **Rápido despliegue:** Cambios instantáneos
- **SEO optimizado:** Schema markup, Open Graph, sitemap
- **Accesible:** ARIA labels, navegación por teclado
- **Seguro:** Headers de seguridad configurados

### ⚠️ Limitaciones
- **Mantenimiento:** Todo el código en un archivo
- **Escalabilidad:** No tiene sistema de componentes
- **Sin CMS:** Contenido hardcodeado en HTML
- **Rendimiento:** Hero image pesada (2MB)

---

## 📊 Métricas Estimadas

- **Peso total:** ~3-4 MB
- **Requests:** ~45-50
- **First Contentful Paint:** ~1.5-2s
- **Largest Contentful Paint:** ~3-4s

---

## 🔐 Seguridad

### Implementado
- Headers HTTP de seguridad
- HTTPS por defecto (Netlify)
- Sin formularios (no hay ataques XSS/CSRF)

### Recomendaciones Futuras
- Content Security Policy (CSP)
- Subresource Integrity (SRI) para Google Fonts
- Permissions-Policy

---

## 📞 Contacto

**Sergio Gabriel Maestri**
- Email: sgmaestri@yahoo.com.ar
- Facebook: [@sergiomaestri.10](https://www.facebook.com/sergiomaestri.10)
- Instagram: [@sergiogmaestri](https://www.instagram.com/sergiogmaestri/)

---

## 📝 Licencia

© 2026 Sergio Maestri. Todos los derechos reservados.

El código del sitio web es propiedad de Sergio Maestri. Las imágenes, textos y contenido literario están protegidos por derechos de autor.

---

## 🛠️ Mantenimiento y Actualizaciones

### Para agregar un nuevo libro:
1. Subir portada a `img/covers/`
2. Editar `index.html` en la sección `#obras`
3. Agregar un `<article class="obra">` con la misma estructura

### Para agregar imágenes a galerías:
1. Nombrar archivos con numeración secuencial (ej: `p16.jpg`)
2. Actualizar contador en el JavaScript: `fill('gal-premios','img/premios','p',16,'jpg')`

### Para actualizar biografía/premios:
1. Editar directamente el HTML en las secciones correspondientes
2. Mantener la estructura existente para consistencia visual

---

**Última actualización de documentación:** Agosto 2026
