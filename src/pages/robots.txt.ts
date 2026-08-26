import type { APIRoute } from 'astro';

/**
 * robots.txt generado en el build.
 *
 * Se genera en vez de ser estático para que la URL del sitemap salga
 * de `site` en astro.config.mjs. Así el cambio de dominio sigue siendo
 * la edición de una sola línea.
 *
 * Corrige además un desajuste del sitio anterior: el robots.txt
 * apuntaba a /sitemap.xml, pero @astrojs/sitemap genera
 * /sitemap-index.xml. Google recibía un 404 al buscarlo.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;

  const contenido = `# robots.txt — Sergio Maestri, escritor
# Generado automáticamente por Astro en cada build.

User-agent: *
Allow: /

# Panel de administración de contenido (Decap CMS)
Disallow: /admin/

Sitemap: ${sitemap}
`;

  return new Response(contenido, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
