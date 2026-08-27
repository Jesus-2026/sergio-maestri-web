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

/* ── SECCIONES DE PROSA ─────────────────────────────────────────────
   presentacion.md y biografia.md. El cuerpo markdown es el texto
   corrido; el panel le muestra a Sergio un editor enriquecido.       */
const secciones = defineCollection({
  loader: md('secciones'),
  schema: ({ image }) =>
    z.object({
      antetitulo: z.string().min(1),
      titulo: z.string().min(1),
      orden: z.number().int().positive(),
      // solo presentación
      retrato: image().optional(),
      retratoAlt: z.string().optional(),
      epigrafe: z.string().optional(),
      parrafosLead: z.array(z.string()).optional(),
      cita: z.string().optional(),
      firma: z.string().optional(),
    }),
});

/* ── AJUSTES DEL SITIO ──────────────────────────────────────────────
   Textos cortos: hero, rótulos de sección, contacto y redes.         */
const ajustes = defineCollection({
  loader: md('ajustes'),
  schema: z.object({
    heroTagline: z.string().min(1),
    heroTitulo: z.string().min(1),
    heroFrase: z.string().min(1),
    heroCta: z.string().min(1),
    heroCtaDestino: z.string().min(1),

    premiosAntetitulo: z.string(), premiosTitulo: z.string(),
    obrasAntetitulo: z.string(),   obrasTitulo: z.string(),
    prensaAntetitulo: z.string(),  prensaTitulo: z.string(),
    blogAntetitulo: z.string(),    blogTitulo: z.string(),
    blogPie: z.string().default(''),

    contactoAntetitulo: z.string(),
    contactoTitulo: z.string(),
    contactoIntro: z.string(),
    email: z.string().email(),
    redes: z.array(z.object({ nombre: z.string().min(1), url: z.string().url() })),
  }),
});

export const collections = { libros, premios, prensa, blog, otras, galerias, secciones, ajustes };
