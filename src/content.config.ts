import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* ═══════════════════════════════════════════════════════════════════
   COLECCIONES DE CONTENIDO — Sergio Maestri

   Cada colección define un esquema con Zod. Si el contenido cargado
   desde el panel no lo cumple (falta la portada, el año no es un
   número, un premio se quedó sin título), el BUILD FALLA y avisa
   con el archivo y el campo exactos.

   Esa es la red de seguridad que permite darle acceso al cliente:
   nunca puede publicar algo roto.
   ═══════════════════════════════════════════════════════════════════ */

const md = (carpeta: string) =>
  glob({ pattern: '**/*.md', base: `./src/content/${carpeta}` });

/* ── LIBROS ─────────────────────────────────────────────────────────
   12 obras. El cuerpo markdown del archivo es la sinopsis.           */
const libros = defineCollection({
  loader: md('libros'),
  schema: ({ image }) =>
    z.object({
      titulo: z.string().min(1),
      tipo: z.string().min(1),          // Novela, Poesía, Cuentos, Infantil…
      anio: z.number().int().min(1900).max(2100),
      meta: z.string().min(1),          // línea que se muestra: "2017 · Ediciones LeE"
      portada: image(),                 // validada y optimizada por Astro
      alt: z.string().min(1),           // obligatorio: sin alt no compila
      orden: z.number().int().positive(),
    }),
});

/* ── PREMIOS ────────────────────────────────────────────────────── */
const premios = defineCollection({
  loader: md('premios'),
  schema: z.object({
    anio: z.number().int().min(1900).max(2100),
    titulo: z.string().min(1),
    detalle: z.string().default(''),
    orden: z.number().int().positive(),
  }),
});

/* ── PRENSA ─────────────────────────────────────────────────────────
   Un archivo por bloque: Presentaciones, Encuentros, Entrevistas.
   Cada item admite markdown (*cursiva* y [enlaces](url)).           */
const prensa = defineCollection({
  loader: md('prensa'),
  schema: z.object({
    titulo: z.string().min(1),
    orden: z.number().int().positive(),
    items: z.array(z.string().min(1)).min(1),
  }),
});

/* ── BLOG ───────────────────────────────────────────────────────── */
const blog = defineCollection({
  loader: md('blog'),
  schema: z.object({
    titulo: z.string().min(1),
    orden: z.number().int().positive(),
    items: z.array(z.string().min(1)).min(1),
  }),
});

/* ── OTRAS PUBLICACIONES ────────────────────────────────────────── */
const otras = defineCollection({
  loader: md('otras'),
  schema: z.object({
    titulo: z.string().min(1),
    subtitulo: z.string().default(''),
    items: z.array(z.string().min(1)).min(1),
  }),
});

/* ── GALERÍAS ───────────────────────────────────────────────────────
   Reemplaza los contadores fijos fill(...,15) / 18 / 7 del sitio
   anterior. Ahora la cantidad sale de la lista: si el cliente sube
   una imagen desde el panel, aparece sin tocar código.

   Además cada imagen lleva su propio `alt`, corrigiendo el alt=""
   que tenían las 40 imágenes de galería.                            */
const galerias = defineCollection({
  loader: md('galerias'),
  schema: ({ image }) =>
    z.object({
      titulo: z.string().min(1),
      nota: z.string().default(''),
      imagenes: z
        .array(
          z.object({
            imagen: image(),
            alt: z.string().min(1),
          })
        )
        .min(1),
    }),
});

export const collections = { libros, premios, prensa, blog, otras, galerias };
