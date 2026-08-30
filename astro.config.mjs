// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/* ═══════════════════════════════════════════════════════════════════
   ⚠️  ÚNICO LUGAR DONDE SE DEFINE EL DOMINIO DEL SITIO
   ═══════════════════════════════════════════════════════════════════
   El canonical, Open Graph, Twitter Cards, JSON-LD y el sitemap.xml
   se derivan TODOS de esta constante.

   Para migrar el dominio (Fase 8): cambiar esta única línea.
   Antes había 12 URLs hardcodeadas repartidas por el proyecto.
   ═══════════════════════════════════════════════════════════════════ */
const DOMINIO_PRODUCCION = 'https://sergiomaestri.com.ar';

// En deploy previews de Netlify usa la URL temporal, así las previews
// nunca reclaman el canonical de producción.
/* Netlify expone varias URLs y elegir mal tiene consecuencias reales:
   en el primer despliegue, DEPLOY_PRIME_URL devolvio
   main--sergio-maestri-escritor.netlify.app — la URL del branch
   deploy — y el canonical apunto ahi en produccion.

     URL               el dominio principal del sitio
     DEPLOY_PRIME_URL  la URL propia de ese despliegue
     CONTEXT           production | deploy-preview | branch-deploy

   En produccion mandan URL o la constante. En previews se usa
   DEPLOY_PRIME_URL para que no reclamen el canonical de produccion. */
const esProduccion = process.env.CONTEXT === 'production';

const SITE = esProduccion
  ? (process.env.URL || DOMINIO_PRODUCCION)
  : (process.env.DEPLOY_PRIME_URL || process.env.URL || DOMINIO_PRODUCCION);

export default defineConfig({
  site: SITE,

  // Genera /biografia/index.html en vez de /biografia.html
  build: { format: 'directory' },

  /* Tipografías autoalojadas.
     Antes se cargaban desde fonts.googleapis.com con un <link>, que
     bloquea el render: Lighthouse medía 1.830 ms de bloqueo.
     Astro las descarga en el build, las sirve desde el propio dominio
     y precarga los archivos exactos que la página usa.
     Beneficio extra: se elimina la dependencia con un tercero. */
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Cormorant Garamond',
      cssVariable: '--fuente-titulos',
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'EB Garamond',
      cssVariable: '--fuente-texto',
      weights: [400, 500],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
  ],

  integrations: [
    sitemap(),
  ],

  // Astro no envía JavaScript al navegador salvo que se lo pida
  // explícitamente. El sitio queda como HTML estático puro.
});
