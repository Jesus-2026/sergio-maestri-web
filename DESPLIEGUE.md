# Despliegue — sergiomaestri.com.ar

Pasos para publicar el sitio y migrar el dominio. Seguir en orden:
cada paso depende del anterior.

---

## 1. Conectar Netlify al repositorio

El sitio actual de Netlify **no está vinculado a GitHub** — por eso los
push no disparan despliegues y producción sigue mostrando el sitio viejo.

```
Netlify → el sitio → Site configuration → Build & deploy
  → Continuous deployment → Link repository
  → GitHub → Jesus-2026/sergio-maestri-web
```

El repositorio es privado: Netlify va a pedir autorización. Es normal.

**Usar el sitio que ya existe, no crear uno nuevo.** Conserva la URL
`.netlify.app` que está registrada en Search Console y el historial de
despliegues.

Netlify lee la configuración del `netlify.toml` del repositorio:

```toml
command = "npm run build"
publish = "dist"
NODE_VERSION = "24"
```

**Verificar que la rama de producción sea `main`.**

### Comprobación

El build tiene que terminar en verde y el log mostrar:

```
[csp] _headers generado — N script(s) y N estilo(s) en línea
[seo]  contexto    production
[seo]  canonical   https://sergio-maestri-escritor.netlify.app/
[seo] validaciones OK
```

Si el canonical no aparece, el build falla a propósito: `scripts/seo.mjs`
aborta antes de publicar algo mal configurado.

---

## 2. Apuntar el dominio a Netlify

### 2.1 En Netlify

```
Domain management → Add a domain → sergiomaestri.com.ar
```

Netlify indica los registros DNS a cargar.

### 2.2 En NIC.ar

Entrar a nic.ar con CUIT/CUIL → Mis dominios → sergiomaestri.com.ar →
Delegar.

Hay dos caminos:

**A. Delegar a los servidores de Netlify** (recomendado)
Cargar los cuatro `dnsX.p0X.nsone.net` que indique Netlify. El DNS
completo lo administra Netlify y el certificado se emite solo.

**B. Mantener el DNS de NIC.ar**
Cargar un `CNAME` de `www` apuntando al host de Netlify, y un `ALIAS`
o `ANAME` para la raíz. NIC.ar no siempre ofrece ALIAS; si no está,
usar la opción A.

La propagación tarda entre minutos y 24 horas.

### 2.3 Fijar el dominio principal

```
Domain management → Netlify agrega la raíz y la variante www automáticamente
```

**Este paso no es opcional.** Del dominio principal sale la variable
`DEPLOY_PRIME_URL`, y de ahí el `canonical`, el Open Graph y el sitemap.

Si el dominio queda como alias en lugar de principal, el sitio funciona
y se ve bien, pero le declara a Google que la versión buena está en
`netlify.app`. Es un error silencioso y caro.

### 2.4 HTTPS

```
Domain management → HTTPS → Verify DNS configuration → Provision certificate
```

Netlify emite un certificado Let's Encrypt gratis y lo renueva solo.

### Comprobación

Volver a desplegar (**Trigger deploy → Clear cache and deploy site**) y
confirmar en el log:

```
[seo]  canonical   https://sergiomaestri.com.ar/
```

Y en el navegador:

```
https://www.sergiomaestri.com.ar  → redirige 301 a la raiz
https://sergiomaestri.com.ar      → carga el sitio
```

---

## 3. Actualizar el panel de administración

En decapbridge.com → el sitio → editar **Decap CMS login URL**:

```
https://sergiomaestri.com.ar/admin/index.html
```

Probar el ingreso con `piccone.dev@gmail.com` antes de invitar a Sergio.

---

## 4. Search Console

### 4.1 Dar de alta el dominio nuevo

```
Search Console → Agregar propiedad → Dominio → sergiomaestri.com.ar
```

La verificación por **registro TXT en DNS** cubre el dominio completo
—con y sin www, http y https— y no depende de ningún archivo del sitio.
Si el DNS quedó delegado a Netlify, el TXT se carga en Netlify; si no,
en NIC.ar.

### 4.2 Enviar el sitemap

```
Sitemaps → https://sergiomaestri.com.ar/sitemap-index.xml
```

Es `sitemap-index.xml`, no `sitemap.xml`.

### 4.3 Cambio de dirección

En la propiedad vieja (`sergio-maestri-escritor.netlify.app`):

```
Configuración → Cambio de dirección → sergiomaestri.com.ar
```

**No borrar la propiedad vieja.** Sirve para seguir el traspaso.

### 4.4 Solicitar indexación

Inspección de URLs → la portada → Solicitar indexación. **Una sola vez**;
repetirlo no acelera nada.

---

## 5. Bing

```
Bing Webmaster Tools → importar desde Search Console
```

Bing indexa más rápido y con menos exigencia. Da tráfico propio y
alimenta a DuckDuckGo y a varios asistentes de IA.

---

## Pendiente que no resuelve el despliegue

Google marcó la portada como **«Rastreada: actualmente sin indexar»** —
la leyó y decidió no incluirla, con toda probabilidad porque duplica la
ficha de `registrodeescritores.com.ar`, que tiene el mismo contenido y
más antigüedad.

Ninguna mejora técnica ataca esa causa. Lo destraban dos cosas:

1. **Textos originales** — poemas y cuentos completos. Contenido que no
   exista en ningún otro lado. Es el activo que el autor ya tiene y el
   sitio todavía no muestra.
2. **Backlinks** — editoriales (Prometeo, LeE, Grupo de Escritores
   Argentinos), SADE, Goodreads, Academia Virtual del Lunfardo.

La arquitectura queda preparada: agregar una sección `/textos/` son unas
pocas líneas de plantilla, porque el contenido ya está modelado como datos.
