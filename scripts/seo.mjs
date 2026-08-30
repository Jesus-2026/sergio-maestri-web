/**
 * Informe y validacion de SEO posterior al build.
 *
 * Existe por un riesgo concreto: el canonical se deriva de
 * DEPLOY_PRIME_URL, asi que depende de como este configurado Netlify.
 * Si el dominio se agrega como alias en vez de como principal, el sitio
 * funciona y se ve bien, pero le declara a Google que la version buena
 * esta en otra URL. Es un error silencioso.
 *
 * Este script lo vuelve visible en cada despliegue, y frena el build
 * cuando detecta algo que no deberia publicarse.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const leer = (p) => (existsSync(join(DIST, p)) ? readFileSync(join(DIST, p), 'utf8') : null);

const html = leer('index.html');
if (!html) {
  console.error('[seo] no existe dist/index.html');
  process.exit(1);
}

const uno = (re) => { const m = html.match(re); return m ? m[1] : null; };

const canonical = uno(/rel="canonical" href="([^"]+)"/);
const ogImagen  = uno(/property="og:image" content="([^"]+)"/);
const titulo    = uno(/<title>([^<]*)<\/title>/);
const descr     = uno(/name="description" content="([^"]*)"/);

const sitemap = leer('sitemap-0.xml') || '';
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
let entidades = {};
if (ld) {
  try {
    const g = JSON.parse(ld[1].replace(/\u003c/g, '<'))['@graph'] || [];
    g.forEach((e) => { entidades[e['@type']] = (entidades[e['@type']] || 0) + 1; });
  } catch { entidades = { 'JSON-LD invalido': 1 }; }
}

const contexto = process.env.CONTEXT || 'local';

console.log('');
console.log('[seo] ─────────────────────────────────────────────');
console.log('[seo]  contexto    ' + contexto);
console.log('[seo]  canonical   ' + canonical);
console.log('[seo]  sitemap     ' + urls.length + ' URL(s): ' + urls.join(', '));
console.log('[seo]  og:image    ' + (ogImagen || '').replace(/^https?:\/\/[^/]+/, ''));
console.log('[seo]  title       ' + (titulo || '').length + ' caracteres');
console.log('[seo]  description ' + (descr || '').length + ' caracteres');
console.log('[seo]  schema.org  ' + Object.entries(entidades).map(([k, v]) => k + ':' + v).join('  '));
console.log('[seo] ─────────────────────────────────────────────');

/* ── Validaciones que frenan el build ─────────────────────────── */
const errores = [];

if (!canonical) errores.push('falta el canonical');
if (canonical && !canonical.startsWith('https://')) errores.push('el canonical no usa https');
if (canonical && /localhost|127\.0\.0\.1/.test(canonical)) errores.push('el canonical apunta a localhost');
if (!urls.length) errores.push('el sitemap quedo vacio');
if (urls.length && canonical && !urls[0].startsWith(new URL(canonical).origin))
  errores.push('el sitemap y el canonical apuntan a dominios distintos');
if (!Object.keys(entidades).length) errores.push('no se genero el JSON-LD');

// En produccion, una URL de preview en el canonical seria un error grave.
if (contexto === 'production' && canonical && /deploy-preview|--/.test(new URL(canonical).hostname))
  errores.push('produccion con un canonical de deploy preview');

if (errores.length) {
  console.error('');
  errores.forEach((e) => console.error('[seo] ✗ ' + e));
  console.error('');
  process.exit(1);
}

console.log('[seo] validaciones OK');
console.log('');
