# 🔧 Plan de Correcciones y Mejoras - Sitio Web Sergio Maestri

Este documento detalla las correcciones necesarias organizadas por prioridad para optimizar el rendimiento, SEO, accesibilidad y mantenibilidad del sitio web.

---

## 🔴 PRIORIDAD CRÍTICA (Implementar inmediatamente)

### 1. Optimización de Imágenes

**Problema:**
- `hero2.png` pesa **2 MB** (demasiado para web)
- Las imágenes no están optimizadas para web
- Impacto negativo en LCP (Largest Contentful Paint)

**Solución:**
```bash
# Convertir hero2.png a WebP/AVIF
# Objetivo: reducir de 2MB a < 300KB

# Usando herramientas online:
- Squoosh.app
- TinyPNG.com
- ImageOptim (Mac)

# O con línea de comandos:
cwebp -q 85 hero2.png -o hero2.webp
```

**Implementación en HTML:**
```html
<picture>
  <source srcset="img/hero2.avif" type="image/avif">
  <source srcset="img/hero2.webp" type="image/webp">
  <img src="img/hero2.png" alt="Sergio Maestri escritor">
</picture>
```

**Resultado esperado:**
- Reducción del 70-80% en peso
- Mejora en LCP de ~4s a ~1.5s
- Mejor experiencia en móviles

---

### 2. Separar CSS y JavaScript en Archivos Externos

**Problema:**
- 38,654 bytes en un solo archivo HTML
- CSS y JS inline no son cacheables
- Dificulta el mantenimiento

**Solución:**

**Estructura propuesta:**
```
sergio-maestri-web/
├── index.html (reducido a ~15 KB)
├── css/
│   └── styles.css (extraído del <style>)
└── js/
    └── main.js (extraído del <script>)
```

**Crear `css/styles.css`:**
```css
/* Mover todo el contenido del <style> aquí */
:root {
  --crema: #f6f1e7;
  /* ... */
}
/* ... resto del CSS ... */
```

**Crear `js/main.js`:**
```javascript
// Mover todo el contenido del <script> aquí
function cerrar() {
  document.getElementById('menu').classList.remove('open');
}
// ... resto del JS ...
```

**Actualizar `index.html`:**
```html
<head>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <!-- contenido -->
  <script src="js/main.js"></script>
</body>
```

**Resultado esperado:**
- Archivos cacheables (mejor rendimiento)
- Código más mantenible
- Posibilidad de minificar archivos

---

### 3. Minificar HTML, CSS y JavaScript

**Problema:**
- Código sin minificar desperdicia ancho de banda
- ~10-30% de reducción posible

**Solución:**

**Opción A: Herramientas online**
- [HTML Minifier](https://www.willpeavy.com/tools/minifier/)
- [CSS Minifier](https://cssminifier.com/)
- [JavaScript Minifier](https://javascript-minifier.com/)

**Opción B: Automatización con npm scripts**
```bash
npm init -y
npm install --save-dev html-minifier clean-css-cli terser
```

**Crear `package.json` scripts:**
```json
{
  "scripts": {
    "minify:html": "html-minifier --collapse-whitespace --remove-comments --minify-css --minify-js index.html -o dist/index.html",
    "minify:css": "cleancss -o dist/css/styles.min.css css/styles.css",
    "minify:js": "terser js/main.js -o dist/js/main.min.js --compress --mangle",
    "build": "npm run minify:html && npm run minify:css && npm run minify:js"
  }
}
```

**Actualizar `netlify.toml`:**
```toml
[build]
  publish = "dist"
  command = "npm run build"
```

**Resultado esperado:**
- Reducción de 20-30% en tamaño de archivos
- Mejora en tiempo de carga
- Build automático en Netlify

---

### 4. Agregar Favicon y Meta Theme-Color

**Problema:**
- No hay favicon (mala imagen profesional)
- Falta meta theme-color para navegadores móviles

**Solución:**

**1. Crear favicon:**
- Diseñar icono 512×512px (inicial "SM" o logo)
- Usar [RealFaviconGenerator](https://realfavicongenerator.net/)

**2. Agregar archivos:**
```
sergio-maestri-web/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
└── site.webmanifest
```

**3. Actualizar `<head>` en `index.html`:**
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#6b4f2e">
<meta name="msapplication-TileColor" content="#f6f1e7">
```

**Resultado esperado:**
- Identidad visual en pestañas del navegador
- Mejor aspecto al guardar en marcadores
- Icono en pantalla de inicio móvil

---

### 5. Optimizar Carga de Google Fonts

**Problema:**
- Fuentes bloquean el renderizado inicial (render-blocking)
- 2 familias × múltiples pesos = ~50-80 KB

**Solución:**

**Actual (problemático):**
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
```

**Optimizado:**
```html
<!-- Preconnect para reducir latencia DNS -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Preload de fuentes críticas -->
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=EB+Garamond:wght@400&display=swap" as="style">

<!-- Carga asíncrona -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" media="print" onload="this.media='all'">

<!-- Fallback -->
<noscript>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
</noscript>
```

**Alternativa (mejor rendimiento):**
```css
/* Usar font-display: swap en CSS */
@font-face {
  font-family: 'EB Garamond';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/eb-garamond-v400.woff2') format('woff2');
}
```

**Resultado esperado:**
- Reducción de tiempo de bloqueo del renderizado
- Mejora en FCP (First Contentful Paint)

---

## 🟡 PRIORIDAD ALTA (Implementar en corto plazo)

### 6. Implementar Lazy Loading Inteligente

**Problema:**
- Todas las imágenes de galerías se cargan al inicio
- ~40 imágenes innecesarias en la primera carga

**Solución:**

**Actualizar generación de galerías en JavaScript:**
```javascript
function fill(id, dir, prefix, count, ext) {
  var g = document.getElementById(id);
  if (!g) return;

  for (var i = 1; i <= count; i++) {
    var n = (i < 10 ? '0' : '') + i;
    var im = document.createElement('img');
    im.src = dir + '/' + prefix + n + '.' + ext;
    im.loading = 'lazy'; // ✅ Ya existe
    im.alt = 'Imagen ' + i + ' de ' + count; // ✅ Agregar alt descriptivo

    // Agregar Intersection Observer para carga diferida
    if ('IntersectionObserver' in window) {
      im.dataset.src = im.src;
      im.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // placeholder transparente

      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '50px' });

      observer.observe(im);
    }

    g.appendChild(im);
  }
}
```

**Resultado esperado:**
- Reducción de ~2MB en carga inicial
- Mejora en tiempo de carga de la página

---

### 7. Mejorar Accesibilidad (a11y)

**Problema:**
- Múltiples `<h1>` por página (debería ser único)
- Contraste de colores insuficiente en algunos textos
- Falta "skip to content" link
- Imágenes generadas sin alt descriptivo

**Solución:**

**A. Jerarquía de encabezados:**
```html
<!-- Actual (incorrecto): -->
<h1>Sergio Maestri</h1>
<!-- ... -->
<h2>Mi mundo</h2>
<h2>Biografía</h2>

<!-- Correcto: -->
<h1>Sergio Maestri — Escritor Argentino</h1>
<!-- En secciones usar h2, h3, h4 -->
<section id="biografia">
  <h2>Biografía</h2>
  <h3>Formación</h3>
</section>
```

**B. Skip to content:**
```html
<body>
  <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
  <!-- ... header ... -->
  <main id="main-content">
    <!-- contenido -->
  </main>
</body>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--marron);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}
.skip-link:focus {
  top: 0;
}
```

**C. Contraste de colores:**
```css
/* Revisar combinaciones con ratio mínimo 4.5:1 */
/* Usar herramienta: https://webaim.org/resources/contrastchecker/ */

/* Ejemplo de mejora: */
.premio .det span {
  color: #3d3529; /* en lugar de var(--tinta-suave) */
}
```

**D. Links externos:**
```html
<a href="..." target="_blank" rel="noopener" aria-label="Abre en nueva pestaña">
  Ver en YouTube
  <span aria-hidden="true">↗</span>
</a>
```

**Resultado esperado:**
- Mejor experiencia para usuarios con lectores de pantalla
- Cumplimiento de WCAG 2.1 nivel AA

---

### 8. Agregar Content Security Policy (CSP)

**Problema:**
- No hay CSP configurado (riesgo de XSS)
- Google Fonts sin Subresource Integrity

**Solución:**

**Actualizar `netlify.toml`:**
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = """
      default-src 'self';
      script-src 'self' 'unsafe-inline';
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https:;
      connect-src 'self';
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    """
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

**Resultado esperado:**
- Mayor seguridad contra ataques XSS
- Restricción de recursos externos no autorizados

---

### 9. Implementar Formulario de Contacto

**Problema:**
- Solo hay email público (spam, privacidad)
- No hay formulario de contacto

**Solución:**

**Agregar en sección `#contacto`:**
```html
<form name="contacto" method="POST" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="contacto">
  <p style="display:none">
    <label>No llenar: <input name="bot-field"></label>
  </p>

  <div class="form-group">
    <label for="nombre">Nombre completo *</label>
    <input type="text" id="nombre" name="nombre" required>
  </div>

  <div class="form-group">
    <label for="email">Email *</label>
    <input type="email" id="email" name="email" required>
  </div>

  <div class="form-group">
    <label for="mensaje">Mensaje *</label>
    <textarea id="mensaje" name="mensaje" rows="6" required></textarea>
  </div>

  <button type="submit">Enviar mensaje</button>
</form>
```

**Agregar CSS:**
```css
.contacto form {
  max-width: 600px;
  margin: 2rem auto;
  text-align: left;
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  margin-bottom: .4rem;
  font-weight: 500;
  color: var(--tinta);
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: .7rem 1rem;
  border: 1px solid var(--linea);
  border-radius: 3px;
  font-family: inherit;
  font-size: 1rem;
  background: #fff;
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--marron);
  box-shadow: 0 0 0 3px rgba(107, 79, 46, 0.1);
}
button[type="submit"] {
  background: var(--marron);
  color: var(--crema);
  border: none;
  padding: .8rem 2rem;
  font-size: .9rem;
  letter-spacing: .08em;
  text-transform: uppercase;
  border-radius: 3px;
  cursor: pointer;
  transition: background .2s;
}
button[type="submit"]:hover {
  background: var(--dorado);
}
```

**Resultado esperado:**
- Formulario funcional sin backend (Netlify Forms)
- Protección contra spam con honeypot
- Mejor experiencia de usuario

---

### 10. Mejorar sitemap.xml

**Problema:**
- Sitemap solo tiene 1 URL
- No incluye anclas de secciones importantes

**Solución:**

**Actualizar `sitemap.xml`:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://sergio-maestri-escritor.netlify.app/</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://sergio-maestri-escritor.netlify.app/#biografia</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://sergio-maestri-escritor.netlify.app/#premios</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://sergio-maestri-escritor.netlify.app/#obras</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://sergio-maestri-escritor.netlify.app/#prensa</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://sergio-maestri-escritor.netlify.app/#blog</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://sergio-maestri-escritor.netlify.app/#contacto</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>

</urlset>
```

**Resultado esperado:**
- Mejor indexación de secciones por buscadores
- Mayor visibilidad en resultados de búsqueda

---

## 🟢 PRIORIDAD MEDIA (Implementar en mediano plazo)

### 11. Botones de Compartir en Redes Sociales

**Solución:**
```html
<!-- En sección de cada obra -->
<div class="social-share">
  <button onclick="share('twitter', 'Crónicas del doctor Winter')">
    <svg><!-- icono Twitter --></svg> Twitter
  </button>
  <button onclick="share('facebook', 'Crónicas del doctor Winter')">
    <svg><!-- icono Facebook --></svg> Facebook
  </button>
  <button onclick="share('whatsapp', 'Crónicas del doctor Winter')">
    <svg><!-- icono WhatsApp --></svg> WhatsApp
  </button>
</div>
```

```javascript
function share(platform, title) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(title + ' - Sergio Maestri');

  const urls = {
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    whatsapp: `https://wa.me/?text=${text}%20${url}`
  };

  window.open(urls[platform], '_blank', 'width=600,height=400');
}
```

---

### 12. Indicador de Sección Activa en Menú

**Solución:**
```javascript
// Detectar sección visible y marcar en menú
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});
```

```css
nav a.active {
  color: var(--marron);
  border-bottom: 2px solid var(--dorado);
}
```

---

### 13. Animaciones de Entrada (Scroll Reveal)

**Solución:**
```javascript
// Intersection Observer para animaciones
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.obra, .premio, .prensa-block').forEach(el => {
  el.classList.add('hidden');
  observer.observe(el);
});
```

```css
.hidden {
  opacity: 0;
  transform: translateY(30px);
}
.reveal {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.6s ease-out;
}
```

---

### 14. Google Analytics o Plausible Analytics

**Solución (Plausible - más privado):**
```html
<script defer data-domain="sergio-maestri-escritor.netlify.app" src="https://plausible.io/js/script.js"></script>
```

**O Google Analytics 4:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

### 15. Enlaces de Compra de Libros

**Solución:**
```html
<!-- En cada obra -->
<div class="obra-actions">
  <a href="#" class="btn-buy" target="_blank" rel="noopener">
    Comprar en Mercado Libre
  </a>
  <a href="#" class="btn-buy" target="_blank" rel="noopener">
    Ver en Amazon
  </a>
  <a href="mailto:sgmaestri@yahoo.com.ar?subject=Consulta sobre [LIBRO]" class="btn-contact">
    Consultar al autor
  </a>
</div>
```

---

## 🔵 PRIORIDAD BAJA (Mejoras futuras)

### 16. Sistema de Blog con Generador Estático
- Considerar **11ty** o **Hugo**
- Separar contenido de presentación

### 17. Modo Oscuro/Claro
```javascript
// Toggle de tema
const themeToggle = document.createElement('button');
themeToggle.innerHTML = '🌓';
themeToggle.onclick = () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
};
```

### 18. Progressive Web App (PWA)
- Crear `manifest.json`
- Implementar Service Worker
- Permitir instalación como app

### 19. Testimonios de Lectores
- Sección con reseñas
- Integración con Goodreads

### 20. Newsletter con Mailchimp/ConvertKit
- Formulario de suscripción
- Avisos de nuevas publicaciones

---

## 📈 Checklist de Implementación

### Semana 1: Crítico
- [ ] Optimizar `hero2.png` (2MB → <300KB)
- [ ] Separar CSS en `css/styles.css`
- [ ] Separar JS en `js/main.js`
- [ ] Agregar favicon
- [ ] Optimizar carga de Google Fonts

### Semana 2: Alto
- [ ] Implementar lazy loading inteligente
- [ ] Minificar archivos (HTML/CSS/JS)
- [ ] Mejorar jerarquía de encabezados
- [ ] Agregar CSP en `netlify.toml`
- [ ] Implementar formulario de contacto

### Semana 3: Medio
- [ ] Actualizar sitemap.xml
- [ ] Agregar botones de compartir
- [ ] Indicador de sección activa
- [ ] Animaciones scroll reveal
- [ ] Configurar analytics

### Semana 4: Bajo
- [ ] Enlaces de compra de libros
- [ ] Modo oscuro
- [ ] Testimonios
- [ ] Newsletter

---

## 🎯 Métricas de Éxito

### Antes:
- **LCP:** ~4s
- **FCP:** ~2s
- **Peso:** ~4MB
- **Score Lighthouse:** ~70/100

### Después (objetivo):
- **LCP:** <1.5s ✅
- **FCP:** <1s ✅
- **Peso:** <800KB ✅
- **Score Lighthouse:** >90/100 ✅

---

## 📞 Recursos y Herramientas

### Testing:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse (Chrome DevTools)](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)

### Accesibilidad:
- [WAVE](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

### SEO:
- [Google Search Console](https://search.google.com/search-console)
- [Schema Markup Validator](https://validator.schema.org/)

### Imágenes:
- [Squoosh](https://squoosh.app/)
- [TinyPNG](https://tinypng.com/)
- [ImageOptim](https://imageoptim.com/)

---

**Documento actualizado:** Agosto 2026
**Autor:** Análisis técnico de ingeniero de software
