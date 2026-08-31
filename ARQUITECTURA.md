# Anatomía de sergiomaestri.com.ar

Qué cambió en el sitio, por qué, y cómo funciona cada pieza.
Escrito para leerse sin saber programar — y para poder explicárselo
a alguien que sí sabe.

---

## 1. Qué había antes

El sitio original era **un solo archivo** llamado `index.html`: 581 líneas
que contenían todo mezclado — el texto, el diseño y el poco código que
hacía funcionar el menú y el visor de fotos.

Eso funciona, y de hecho funcionó durante meses. El problema aparece
cuando el sitio crece o cuando alguien más tiene que mantenerlo.

**El problema**

- Para cambiar la sinopsis de un libro había que abrir el archivo y
  buscar entre 581 líneas
- Los 12 libros estaban escritos a mano, uno debajo del otro,
  repitiendo la misma estructura
- Sergio no podía tocar nada sin riesgo de romper el sitio
- La foto principal pesaba 2 MB y se enviaba igual a un celular que a
  una computadora

**Lo que se buscaba**

- Que el contenido esté separado del diseño
- Que agregar un libro no signifique escribir HTML
- Que el autor pueda editar su propio sitio
- Que las imágenes se optimicen solas

Ninguna de esas cuatro cosas se resuelve con un archivo único. Por eso
el cambio de estructura.

---

## 2. Qué es Astro

Astro es **un programa que escribe páginas HTML por vos**.

No corre en el sitio. No corre cuando alguien lo visita. Corre *antes*:
toma unas plantillas y un montón de contenido, los combina, y escribe
los archivos finales. Después desaparece.

```
  plantillas  +  contenido
        │
        ▼
      ASTRO           ← corre una sola vez, al publicar
        │
        ▼
   index.html         ← un archivo común y corriente
        │
        ▼
    el visitante
```

Lo que recibe la persona que entra al sitio es **exactamente el mismo
tipo de archivo que antes**: HTML plano. La diferencia es que ya no lo
escribimos a mano — lo escribe Astro cada vez que hay un cambio.

> **La analogía útil:** es como la página maestra de un programa de
> diseño editorial. Definís el encabezado una vez, y todas las páginas
> lo heredan. Si lo cambiás, cambia en todas.

Sin Astro, un sitio de 25 páginas significa copiar el mismo menú 25
veces. Cuando querés agregar un ítem, editás 25 archivos y te olvidás
de uno.

---

## 3. ¿Hace falta una base de datos?

**No.** Y vale la pena entender por qué, porque es la pregunta que más
rápido va a hacer cualquier desarrollador.

Una base de datos hace falta cuando el contenido *cambia mientras la
gente navega*: usuarios que inician sesión, comentarios, stock que
baja, precios que se actualizan. En esos casos el servidor tiene que
consultar algo en el momento exacto de cada visita.

Acá no pasa nada de eso. El contenido cambia **cuando Sergio lo edita**,
y en ese momento el sitio se vuelve a construir. Entre una edición y la
siguiente, las páginas son archivos quietos en un disco.

| Con base de datos | Sitio estático |
|---|---|
| Alguien entra → el servidor se despierta → consulta la base → arma la página → la envía | Alguien entra → se le envía un archivo que ya estaba escrito |
| **Cada visita repite todo el trabajo** | **El trabajo se hizo una sola vez** |

Por eso el sitio carga en 250 milisegundos y el hosting es gratis: no
hay servidor haciendo nada, no hay base que mantener, no hay nada que
se pueda caer.

---

## 4. Para qué sirve cada archivo

Esta es la parte que más intimida al abrir el proyecto. Pero cada
carpeta tiene un rol y son pocos.

```
package.json        la ficha del proyecto
package-lock.json   las versiones exactas de cada herramienta
astro.config.mjs    la configuración: dominio, integraciones
tsconfig.json       reglas para detectar errores antes de publicar
netlify.toml        instrucciones para el hosting
node_modules/       las herramientas descargadas
src/                el proyecto de verdad
public/             archivos que se copian tal cual
scripts/            dos verificaciones que corren al publicar
dist/               el resultado final
```

### package.json

Es **la ficha del proyecto y su lista de compras**. Dice cómo se llama,
qué herramientas necesita para funcionar, y define atajos: cuando
escribís `npm run build`, este archivo es el que sabe qué significa eso.

### node_modules

Es donde viven las herramientas descargadas — unos 200 MB, cientos de
carpetas. **Nunca se guarda en el repositorio.** Se puede borrar entera
y regenerarla con un comando, porque `package.json` tiene la lista de
qué hay que descargar.

### src — el proyecto

Todo lo que escribimos nosotros. Astro lo lee, lo procesa y lo
transforma.

```
content/     el contenido: 12 libros, 14 premios, galerías…
components/  las piezas visuales reutilizables (15)
layouts/     el molde común a todas las páginas
pages/       cada archivo acá se convierte en una URL
styles/      colores y tipografías
assets/      las 54 imágenes originales
```

### public vs src — la diferencia que importa

| `public/` | `src/assets/` |
|---|---|
| Se copia **tal cual**, sin tocar | Astro la **procesa**: la comprime, genera formatos modernos y varios tamaños |
| Una foto de 8 MB se publica con sus 8 MB | La misma foto se publica pesando una fracción |

Por eso el panel de administración está configurado para escribir las
imágenes en `src/assets/`. Si Sergio sube una foto pesada desde el
celular, se publica optimizada sin que él haga nada.

### dist

El resultado: los archivos que Astro escribió. **Es lo único que Netlify
publica.** Tampoco se guarda en el repositorio — se regenera en cada
publicación.

---

## 5. El contenido dejó de ser código

Este es el cambio de fondo, más importante que la elección de Astro.

Antes, un libro era esto dentro del archivo grande:

```html
<article class="obra">
  <div class="cover"><img src="img/covers/winter.jpg"></div>
  <div class="body">
    <span class="tipo">Novela</span>
    <h3>Crónicas del doctor Winter</h3>
    <div class="meta">2017 · Ediciones LeE</div>
    <p>Novela en 23 capítulos…</p>
  </div>
</article>
```

Doce veces lo mismo, con la estructura repetida. Ahora un libro es esto:

```yaml
titulo:    "Crónicas del doctor Winter"
tipo:      novela
anio:      2017
editorial: "Ediciones LeE"
portada:   winter.jpg

Novela en 23 capítulos…
```

Sin etiquetas, sin estructura. Solo la información. El diseño vive
aparte, escrito una sola vez, y se aplica a los doce.

> **Esto es lo que hace posible el panel.** Un editor visual puede
> mostrar campos con nombres —«Título», «Año», «Editorial»— porque son
> datos. Sobre HTML crudo no podría: cualquier error de tipeo rompería
> la página.

### La red de seguridad

Cada tipo de contenido tiene un **esquema**: una definición de qué
campos existen y de qué tipo son. El año tiene que ser un número. El
texto alternativo de la portada no puede estar vacío.

Si algo no cumple, **la publicación se detiene y avisa exactamente qué
está mal**:

```
libros → momentos
  alt: Too small: expected string to have >=1 characters
  Archivo: src/content/libros/momentos.md
```

Es la razón por la que se le puede dar acceso a Sergio sin supervisión:
no puede publicar algo roto, porque el sitio no llega a construirse.

---

## 6. Cómo funciona el panel

El panel está en `/admin` y lo hacen dos piezas.

| Pieza | Qué hace |
|---|---|
| **Decap CMS** | La interfaz. Muestra los formularios, el editor de texto y el subidor de imágenes. Es solo una página web: vive en el navegador de Sergio, no en un servidor. |
| **DecapBridge** | El portero. Verifica quién entra y guarda el permiso para escribir en el repositorio. |

### Por qué hace falta un portero

Acá está el detalle que un desarrollador va a querer entender.

El panel corre **en el navegador**, sin servidor propio. Para guardar un
cambio tiene que escribir en GitHub, y GitHub exige una credencial. Pero
esa credencial **no puede vivir en el navegador**: cualquiera que abriera
el código de la página podría copiarla.

DecapBridge resuelve eso: guarda la credencial en su propio servidor,
verifica que quien pide escribir esté autorizado, y recién entonces
reenvía el cambio a GitHub.

```
Sergio edita en el navegador
        │
        ▼
   DecapBridge         ¿es quién dice ser?
        │              (tiene guardada la credencial)
        ▼
     GitHub            se guarda el cambio
        │
        ▼
     Netlify           detecta el cambio y reconstruye
        │
        ▼
  sitio actualizado    ~1 minuto
```

Cada cambio queda firmado con el nombre de quien lo hizo, así que el
historial muestra quién editó qué:

```
Actualizar libros "el-despertar" - Sergio Maestri
```

> **Punto de mantenimiento:** la credencial de GitHub que usa
> DecapBridge tiene fecha de vencimiento. Cuando expire, el panel deja
> de guardar. Conviene tener anotada esa fecha.

---

## 7. El circuito completo

Desde que se toca algo hasta que se ve publicado.

1. **Alguien hace un cambio.** Sergio desde el panel, o vos editando un
   archivo directamente.
2. **El cambio se guarda en GitHub.** Que es el archivo histórico del
   proyecto: guarda cada versión y quién la hizo.
3. **Netlify se entera.** Está conectado al repositorio y reacciona a
   cada cambio.
4. **Netlify construye.** Descarga las herramientas, corre Astro,
   optimiza las imágenes.
5. **Corren las verificaciones.** Si el contenido no cumple los
   esquemas, o el SEO quedó mal configurado, **se detiene acá** y no
   publica.
6. **Se publica.** Los archivos van a la red de Netlify y el sitio queda
   actualizado.

El paso 5 es el que evita accidentes. Un sitio roto nunca llega a
publicarse: la construcción falla antes.

---

## 8. Resultado

| | Antes | Ahora |
|---|---|---|
| Estructura | 1 archivo, 581 líneas | 15 componentes, 37 archivos de contenido |
| Carga inicial | ~2 MB | 78 KB |
| Imagen principal | 1.998 KB | 50 KB |
| Accesibilidad | 91 / 100 | 100 / 100 |
| Edición por el autor | imposible | panel en `/admin` |
| Costo de hosting | $0 | $0 |

Y se corrigieron ocho defectos que ya existían en el sitio anterior sin
que nadie los hubiera detectado — entre ellos, que los datos
estructurados le declaraban a Google que *una fotografía de una
biblioteca* era el retrato del autor.

---

## 9. Glosario

Los términos que van a aparecer en una conversación con un desarrollador.

| Término | Qué significa |
|---|---|
| **Astro** | El programa que **escribe las páginas HTML** a partir de plantillas y contenido. Corre al publicar, no cuando alguien visita. |
| **sitio estático** | Un sitio donde las páginas **ya están escritas** como archivos. Lo contrario: un sitio que arma cada página en el momento de la visita. |
| **build** | La **construcción**: el momento en que Astro corre y produce los archivos finales. |
| **npm** | El **gestor de paquetes**: descarga las herramientas que el proyecto necesita. |
| **package.json** | La **ficha del proyecto**: nombre, herramientas necesarias y atajos de comandos. |
| **node_modules** | La carpeta con las **herramientas descargadas**. No se guarda en el repositorio: se regenera. |
| **repositorio** | El **archivo histórico** del proyecto en GitHub. Guarda cada versión y quién la hizo. |
| **commit** | Una **versión guardada**, con su descripción y su autor. |
| **push** | **Subir** las versiones guardadas al repositorio en internet. |
| **deploy** | **Publicar**: que el resultado del build quede accesible en el dominio. |
| **CMS** | **Panel de contenido**. El de este proyecto es Decap CMS. |
| **CSP** | Una **lista de permisos** que el sitio le da al navegador: qué puede cargar y desde dónde. Bloquea código que no debería estar ahí. |
| **canonical** | Una etiqueta que le dice a Google **cuál es la dirección oficial** de una página, cuando podría llegarse por varias. |
| **301** | Una **redirección permanente**. Le avisa a los buscadores que el contenido se mudó de dirección. |
| **datos estructurados** | Información oculta en la página que le explica a Google **qué es cada cosa**: que esto es una persona, aquello un libro, ese otro un premio. |

---

*Documento técnico del proyecto sergiomaestri.com.ar. El detalle
operativo del despliegue está en `DESPLIEGUE.md`; la documentación para
desarrollo, en `README.md`.*
