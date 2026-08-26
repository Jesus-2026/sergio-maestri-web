// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/* ═══════════════════════════════════════════════════════════════════
   ⚠️  ÚNICO LUGAR DONDE SE DEFINE EL DOMINIO DEL SITIO
   ═══════════════════════════════════════════════════════════════════
   El canonical, Open Graph, Twitter Cards, JSON-LD y el sitemap.xml
   se derivan TODOS de esta constante.

   Para migrar el dominio (Fase 8): cambiar esta única línea.
   Antes había 12 URLs hardcodeadas repartidas por el proyecto.
   ═══════════════════════════════════════════════════════════════════ */
const DOMINIO_PRODUCCION = 'https://www.sergiomaestri.com.ar';

// En deploy previews de Netlify usa la URL temporal, así las previews
// nunca reclaman el canonical de producción.
const SITE = process.env.DEPLOY_PRIME_URL || DOMINIO_PRODUCCION;

export default defineConfig({
  site: SITE,

  // Genera /biografia/index.html en vez de /biografia.html
  build: { format: 'directory' },

  integrations: [
    sitemap(),
  ],

  // Astro no envía JavaScript al navegador salvo que se lo pida
  // explícitamente. El sitio queda como HTML estático puro.
});
