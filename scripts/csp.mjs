/**
 * Genera dist/_headers con una Content-Security-Policy basada en hashes.
 *
 * Astro incrusta los scripts de componente en línea. Permitirlos con
 * 'unsafe-inline' dejaría la política decorativa: ese es justamente el
 * vector que la CSP debería bloquear.
 *
 * En cambio se calcula el SHA-256 de cada bloque en línea y se lo
 * declara. Como el hash cambia en cada build, este script corre
 * después de `astro build` y regenera el archivo.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
if (!existsSync(DIST)) {
  console.error('[csp] no existe dist/ — ¿corriste astro build?');
  process.exit(1);
}

/** Todos los .html de dist, recursivo */
function htmls(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? htmls(p) : p.endsWith('.html') ? [p] : [];
  });
}

const sha = (s) => `'sha256-${createHash('sha256').update(s, 'utf8').digest('base64')}'`;

const scripts = new Set();
const estilos = new Set();

for (const f of htmls(DIST)) {
  const html = readFileSync(f, 'utf8');
  // <script> sin src = en línea
  for (const m of html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    if (m[1].trim()) scripts.add(sha(m[1]));
  }
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    if (m[1].trim()) estilos.add(sha(m[1]));
  }
}

const politica = [
  `default-src 'self'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  `frame-ancestors 'self'`,
  `form-action 'self'`,
  `script-src 'self' ${[...scripts].join(' ')}`.trim(),
  `style-src 'self' ${[...estilos].join(' ')}`.trim(),
  `font-src 'self'`,
  `img-src 'self' data:`,
  `connect-src 'self'`,
  `manifest-src 'self'`,
  `upgrade-insecure-requests`,
].join('; ');

const contenido = `# Generado por scripts/csp.mjs en cada build. No editar a mano.
# Los hashes corresponden a los scripts y estilos en línea de esta compilación.

/*
  Content-Security-Policy: ${politica}
`;

writeFileSync(join(DIST, '_headers'), contenido, 'utf8');

console.log(`[csp] _headers generado — ${scripts.size} script(s) y ${estilos.size} estilo(s) en línea`);
