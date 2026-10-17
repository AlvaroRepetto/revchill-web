# RevChill — web

Sitio estático (HTML + CSS + JS, sin frameworks ni build). Se abre haciendo doble clic
en `index.html` y se publica subiendo la carpeta tal cual.

---

## 1. Estructura

```
revchill/
├── index.html                  ← la home. ⭐ LOS TEXTOS EN ESPAÑOL VAN AQUÍ
├── weekend.html                ← landing del Weekend Hack. DESPUBLICADA: existe
│                                  pero no se enlaza ni se indexa. Ver sección 13.
├── partners.html               ← ⭐ DOSSIER COMERCIAL. Privado, no se indexa.
├── robots.txt                  ← permisos de rastreo (buscadores e IAs)
├── sitemap.xml                 ← ⚠️ actualiza las fechas al publicar
├── llms.txt                    ← resumen del proyecto para modelos de IA
├── tools/
│   └── fotos.py                ← script para preparar las fotos de un evento
├── assets/
│   ├── css/app.css             ← todo el diseño
│   ├── js/data.js              ← ⭐ EVENTOS, SPONSORS, FOTOS, TESTIMONIOS
│   ├── js/i18n.js              ← ⭐ SOLO LA TRADUCCIÓN AL INGLÉS
│   ├── js/app.js               ← lógica (no hace falta tocarlo)
│   └── img/
│       ├── logo/              ← logotipo (SVG + PNG en todas las versiones)
│       ├── gallery/            ← fotos y vídeos de los eventos
│       ├── sponsors/           ← logos de patrocinadores
│       ├── favicon.svg
│       └── og.jpg              ← ⚠️ pendiente: imagen 1200×630 para redes
└── README.md
```

**Regla:** el 95 % de lo que vas a querer cambiar está en `data.js` y `i18n.js`.

---

## 2. Cómo añadir un evento nuevo

Abre `assets/js/data.js`, copia un bloque del array `events` y edítalo:

```js
{
  id: "barcelona-2026-03",
  date: "2026-03-12T18:30",       // AAAA-MM-DDTHH:MM, hora española
  city: "BARCELONA",
  venue: "Nombre del local",
  address: "Barcelona",
  capacity: 45,                    // aforo total
  registered: 0,                   // inscritos (míralo en Eventbrite)
  eventbrite: "https://...",       // deja "" y sale "Próximamente"
  status: "open",                  // "open" | "full" | "waitlist"
  sponsors: [],
  tags:  { es: ["Afterwork","Gratis"], en: ["Afterwork","Free"] },
  title: { es: "RevChill Social Meet Barcelona", en: "..." },
  blurb: { es: "Texto corto.", en: "Short text." }
}
```

La web decide sola si es **próximo** o **pasado** comparando con la fecha de hoy.
No hay que mover nada de sitio ni borrar los eventos antiguos: pasan solos a la
pestaña "Pasados" y sirven de archivo.

La barra de plazas y el "quedan X" se calculan con `capacity` y `registered`.
Cuando `registered` llega a `capacity`, el botón pasa a rojo y dice "Aforo completo".

---

## 3. Cómo añadir partners

1. Guarda el logo en `assets/img/sponsors/` (PNG o SVG con fondo transparente, ~200 px de alto).
2. Añádelo al array `sponsors` de `data.js`, con su `tier`:

```js
sponsors: [
  { id: "acme", name: "ACME Revenue", tier: "temporada",
    logo: "assets/img/sponsors/acme.svg", url: "https://acme.com" }
]
```

### Qué hace cada `tier`

| `tier` | Dónde sale |
|---|---|
| `"temporada"` | Muro de la home **al doble de tamaño y el primero**, línea de agradecimiento en el pie de todas las páginas, y conviene nombrarlo también en `llms.txt`. |
| `"anfitrion"` | Muro de la home a tamaño normal. |
| `"partner"` | Muro de la home a tamaño normal. |
| `"weekend"` | Banda propia en `weekend.html`. Si *solo* tiene este tier, no sale en la home. |

Se pueden combinar: `tier: ["temporada", "weekend"]`.

### Para que salga en un encuentro concreto

Añade su `id` al array `sponsors` de ese evento, arriba en el mismo archivo:

```js
sponsors: ["acme"]
```

Entonces aparece en la ficha de la agenda y en la barra de "próximo encuentro"
como *"con ACME Revenue"*, con el logo al lado.

Los huecos que sobren hasta `sponsorSlots` se rellenan con "Tu logo aquí" —
que también funciona como reclamo para que alguien pregunte.
Los logos salen en gris y se colorean al pasar el ratón.

### La sección de Empresas es deliberadamente corta

En `index.html` no aparece ni un importe, ni una lista de niveles. La sección
`#empresas` es un párrafo que explica para qué sirve el patrocinio y qué se
lleva una marca, las cuatro cifras, el muro de partners y un botón de
**"Pedir el dossier"**. Nada más. El muro antes era una sección aparte
(`#sponsors`) y ahora vive dentro de Empresas, para no decir dos veces lo
mismo seguido.

El título del muro cambia solo: mientras `sponsors` esté vacío pone *"Aquí
van las marcas que lo hacen posible"*, y en cuanto haya una pasa a *"Ya han
formado parte"*. Así no queda una frase presumiendo de partners encima de
cuatro huecos vacíos.

Las tarifas y los niveles viven solo en `partners.html` y en el PDF, que se
mandan a quien los pide.

Dos motivos: un precio público ancla la conversación antes de que la marca
sepa lo que recibe, y además te impide ajustar la propuesta a cada caso. Si
algún día quieres volver a enseñarlos, se tocan los textos de la sección
`#empresas` y la clave `biz.*` correspondiente en `i18n.js`.

`llms.txt` tampoco lleva importes, por lo mismo: lo leen ChatGPT y Perplexity.

### Las nueve zonas que se venden en el dossier

Están todas implementadas y todas se ocultan solas mientras no haya partners:
muro de la home, barra de próximo encuentro, ficha del encuentro, galería,
banda del Weekend, pie de página, `llms.txt`, enlace saliente a su web y
mención en las notas de prensa. Si prometes una, existe.

---

## 4. Cómo añadir fotos y vídeos

### Lo hace el script, no tú a mano

Cuando tengas las fotos de un encuentro, una sola orden:

```
python3 tools/fotos.py ~/Downloads/fotos-valencia valencia-2027-04 "Valencia" "abr 2027"
```

De cada foto saca dos archivos en `assets/img/gallery/`:

- **`<slug>-NN-t.jpg`** — la miniatura de la rejilla, 760 px de lado mayor.
- **`<slug>-NN.jpg`** — la grande que se abre al pulsar, 1600 px.

Y te imprime en pantalla el bloque de código listo para pegar dentro de
`gallery: [ ... ]` en `data.js`. Necesita Pillow: `pip install pillow`.

### Quédate con pocas

El script procesa todo lo que le eches, pero la web no es un archivo
fotográfico. **Seis o nueve fotos buenas por encuentro** cuentan la historia
mejor que sesenta regulares, y la página carga el doble de rápido. Pega en
`data.js` solo las que elijas y borra de la carpeta los archivos que no uses.

### Por qué dos tamaños y no uno

La rejilla carga las doce miniaturas, que suman unos 750 KB entre todas. La
versión grande de una foto solo se descarga cuando alguien la amplía. Si
pusieras la grande en la rejilla, la galería pesaría cuatro megas y en móvil
tardaría una eternidad.

**Nunca subas el archivo original del fotógrafo.** Pesa entre cinco y veinte
megas, lleva dentro la ubicación GPS y el modelo de cámara, y en pantalla no
se ve mejor que la versión de 1600 px.

### Vídeos

No los metas en el proyecto: un resumen de un minuto pesa entre veinte y
cincuenta megas y hunde la web. Súbelo a YouTube o Vimeo (sin listar si no
quieres que se encuentre) y empotra el reproductor.

Si aun así quieres uno pequeño dentro de la galería, el renderizador lo
admite:

```js
{ type: "video", src: "assets/img/gallery/sevilla.mp4",
  poster: "assets/img/gallery/sevilla.jpg", size: "",
  caption: { es: "RevChill Sevilla", en: "RevChill Sevilla" } }
```

### Los cuatro huecos fijos

Aparte de la galería, hay cuatro imágenes sueltas en `assets/img/`. Para
cambiarlas, sustituye el archivo respetando la proporción:

| Archivo | Tamaño | Dónde sale |
|---|---|---|
| `hero.jpg` | 1200×1500 (4:5) | La foto grande de la portada |
| `manifiesto.jpg` | 1200×900 (4:3) | Dentro del bloque del manifiesto |
| `weekend.jpg` | 900×1200 (3:4) | El bloque del Weekend Hack |
| `og.jpg` | 1200×630 | La miniatura al compartir en WhatsApp y LinkedIn |

### Antes de publicar fotos de gente

Las fotos tienen caras identificables. Conviene una línea en la inscripción
de Eventbrite y otra en la página de privacidad avisando de que se hacen y
se publican fotos, y una dirección donde pedir que se retire una. Es de las
cosas que no cuestan nada antes y son un lío después.

## 5. Cambiar textos

Esto funciona distinto a lo normal, y es a propósito.

**El español vive dentro del HTML.** En `index.html` y `weekend.html` verás elementos así:

```html
<h2 class="h-sec" data-i18n="man.title">Los congresos están bien.<br>Esto es otra cosa.</h2>
```

Para cambiar un texto en español, edítalo ahí directamente, como editarías cualquier web.

**El inglés vive en `assets/js/i18n.js`**, con la misma clave que el atributo `data-i18n`:

```js
"man.title": "Conferences are fine.<br>This is something else.",
```

### Por qué así

Si todos los textos se inyectaran con JavaScript, el HTML llegaría vacío a quien no
ejecute JS. Y eso incluye a buena parte de los rastreadores de IA (los de ChatGPT,
Claude, Perplexity), que leen el HTML crudo. Antes la web tenía 86 textos vacíos y
era literalmente invisible para ellos. Ahora el HTML llega completo y el JavaScript
solo se usa para traducir al inglés.

El idioma se detecta por el navegador, se puede forzar con `?lang=en` y se recuerda
en el navegador del visitante.

---

## 6. Cambiar colores

### La web va siempre en verde oscuro

No hay modo claro. Se quitó a propósito el bloque
`@media (prefers-color-scheme: light)` de `app.css`, y `:root` lleva
`color-scheme: dark` para que los controles del navegador (barra de scroll,
desplegables, autocompletado) salgan oscuros y no desentonen. Da igual que el
móvil o el portátil estén en modo claro: la web se ve igual para todo el mundo.

El único documento claro del proyecto es `partners.html`, y es a propósito:
es un dossier pensado para leerse seguido y para imprimirse en PDF.


Todo el sistema visual está en las primeras 40 líneas de `assets/css/app.css`,
en el bloque `:root`. Cambias ahí y cambia la web entera.

La web tiene **modo claro y modo oscuro**. Sigue la preferencia del sistema del visitante,
sin botón: los mismos colores, invertidos. Los valores del modo claro están justo debajo,
en el bloque `@media (prefers-color-scheme: light)`.

| Variable   | Uso                                      | Valor     |
|------------|------------------------------------------|-----------|
| `--pine`   | Fondo principal (el verde de tu logo)    | `#0E3334` |
| `--pine-2` | Tarjetas y paneles                       | `#15403E` |
| `--cream`  | Texto sobre verde / secciones claras     | `#F2F4EA` |
| `--sage`   | Texto secundario                         | `#9BB3AD` |
| `--spritz` | Acento: botones, subrayados, el símbolo  | `#FF7A4D` |
| `--lima`   | Micro-detalles (punto "en vivo")         | `#D7E86B` |

Tipografías: **Outfit** (titulares y logotipo) + **Hanken Grotesk** (texto). Ambas en Google Fonts.

---

## 7. SEO e indexación

Ya está puesto todo lo que no depende de tener contenido:

| Qué | Dónde | Para qué |
|---|---|---|
| Datos estructurados | `index.html`, `weekend.html` | `Organization`, `WebSite`, `FAQPage` con las seis preguntas y `BreadcrumbList`. Es lo que leen Google y las IAs para entender qué eres. |
| `llms.txt` | raíz | Resumen del proyecto en texto plano para modelos de lenguaje. Convención nueva, barata de mantener. Actualízalo cuando cambie algo de fondo. |
| `robots.txt` | raíz | Permite expresamente a GPTBot, ClaudeBot, PerplexityBot, Google-Extended y compañía. Si algún día quieres bloquear alguno, cambia su `Allow` por `Disallow`. |
| `sitemap.xml` | raíz | Las dos páginas. **Acuérdate de actualizar `lastmod` cuando publiques.** |
| Imágenes para compartir | `assets/img/og.jpg` y `og-weekend.jpg` | 1200×630. Lo que sale al pegar el enlace en LinkedIn o WhatsApp. |

Los eventos generan su propio `Event` en datos estructurados automáticamente, a partir
de `data.js`, en cuanto haya alguno con fecha futura.

**Lo que no está y es una decisión tuya:** el inglés comparte URL con el español, así
que Google solo indexa la versión española. Si alguna vez quieres posicionar en inglés,
haría falta duplicar las páginas en `/en/` y añadir etiquetas `hreflang`.

---

## 8. Pendientes antes de publicar

- [ ] Confirmar emails de contacto y patrocinios en `data.js` → `links`.
- [ ] Confirmar las URLs de LinkedIn e Instagram en `data.js` → `links` (las he puesto
      a partir del nombre de la marca; verifícalas).
- [ ] Crear `privacidad.html`, `cookies.html` y `aviso-legal.html` (enlazados en el footer).
- [ ] Decidir si subes `partners.html` al servidor. Lleva `noindex` y está excluida
      en `robots.txt` para todos los rastreadores, así que es seguro tenerla online
      y mandar el enlace. Si prefieres no subirla, manda solo el PDF.
- [ ] Sustituir los tres testimonios de ejemplo por reseñas reales (`data.js` → `quotes`).
- [ ] Añadir el aviso de fotografías a la privacidad y a la inscripción de Eventbrite.
- [ ] Añadir las próximas fechas en `data.js` (ahora solo están los dos eventos de
      noviembre de 2025, que salen en la pestaña "Pasados").

---

## 9. Publicar

**Opción rápida:** arrastra la carpeta a [app.netlify.com/drop](https://app.netlify.com/drop).
Online en 20 segundos, gratis, HTTPS incluido. Luego apuntas el dominio `revchill.club`.

**Con Git + Vercel/Netlify:** sube la carpeta a un repo de GitHub y conéctalo.
Cada `git push` despliega solo. No hay comando de build: el directorio raíz es el sitio.

**Ver en local:** doble clic en `index.html` funciona. Si prefieres servidor:
`python3 -m http.server 8000` y abre `http://localhost:8000`.

---

## 10. Nota sobre inscripciones

La reserva se hace en **Eventbrite**: el botón abre el evento en pestaña nueva.
Aforo, entradas con QR, emails de confirmación y check-in ya resueltos, sin mantenimiento
ni coste. La web solo muestra el contador de plazas, que actualizas tú en `data.js`.

Si algún día queréis inscripción propia, el punto de cambio es una sola función:
`evHTML()` en `app.js`, donde se construye el botón. El resto de la web no se entera.

---

## 11. El logotipo

Los archivos están en `assets/img/logo/`. Vectoriales (SVG) y PNG con fondo transparente.

El logotipo no tiene símbolo: tiene un gesto. El trazo naranja arranca plano bajo la palabra,
la recorre entera y se levanta al pasarla — el subrayado del logo anterior, convertido en
curva de revenue.

| Archivo | Cuándo se usa |
|---|---|
| `logo.svg` | **Principal.** Sobre fondo verde. Es el que usa la web. |
| `logo-pine.svg` | Sobre crema o blanco. |
| `logo-mono-cream.svg` | Una tinta crema: bordado, serigrafía, grabado sobre oscuro. |
| `logo-mono-pine.svg` | Una tinta verde sobre claro. |
| `trazo.svg` | El gesto suelto, sin fondo. Para componer sobre cualquier color. |
| `avatar.svg` / `-cream` / `-spritz` | Cuadrado redondeado. LinkedIn, Instagram, WhatsApp. |
| `favicon.svg` | Pestaña del navegador e icono de app. |
| `png/` | Los mismos en PNG a 1024 y 1600 px. |

Las letras están vectorizadas (son curvas, no texto), así que el archivo se abre en cualquier
ordenador sin instalar la fuente.

**Reglas:** deja a los lados, como mínimo, la altura de la palabra. Por debajo de 64 px no
encojas el logotipo: usa el trazo solo. No lo estires, no lo rotes, no separes el trazo de la
palabra y no le añadas nada debajo.

---

## 12. Los testimonios

Las tres reseñas de `data.js` -> `quotes` están marcadas con `pending: true`
y hacen que **la sección entera se oculte**. En cuanto quites esa línea de
una y pongas `name`, `role` y `text` reales, la sección aparece sola.

Mejor nada que tres huecos vacíos delante de un patrocinador.

Pídelas en caliente, al día siguiente del encuentro. Pasada una semana ya no
te contestan.

## 13. El Weekend Hack está despublicado

`weekend.html` sigue en el proyecto, entera y funcionando, pero ahora mismo
no se puede llegar a ella: no está en el menú, ni en el pie, ni en el
sitemap, lleva `noindex` y está bloqueada en `robots.txt` para todos los
rastreadores. En la home queda solo el bloque de la sección `#weekend`, que
adelanta el formato y manda a la comunidad de WhatsApp.

**Para publicarla cuando llegue el momento:**

1. Quita `<meta name="robots" content="noindex, nofollow">` de `weekend.html`.
2. Borra las dos líneas `Disallow: /weekend.html` de `robots.txt` (están
   repetidas en cada bloque de rastreador: son 14 en total).
3. Vuelve a añadir la URL en `sitemap.xml`.
4. En `index.html`, recupera el enlace del menú y el del pie, y cambia el
   botón de la sección `#weekend` por uno que apunte a `weekend.html`.

---

## 14. La agenda: pasados y próximos

Los dos listados se construyen solos a partir de la fecha de cada evento en
`data.js`. No hay que marcar nada como pasado.

**En los eventos pasados no se muestra** ni la hora, ni "entrada gratuita",
ni el número de asistentes. Solo fecha, ciudad y local. Es una decisión
deliberada: el historial se lee mejor como una lista limpia de sitios donde
ha habido RevChill, y el aforo de un evento que ya pasó no le dice nada a
nadie. Por eso los eventos pasados de `data.js` no llevan `capacity` ni
`registered`: si los pones, se ignoran.

**En los próximos sí** se muestra la hora, "entrada gratuita" y, si rellenas
`capacity` y `registered`, la barra de plazas que queda.
