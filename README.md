# RevChill — web

Sitio estático (HTML + CSS + JS, sin frameworks ni build). Se abre haciendo doble clic
en `index.html` y se publica subiendo la carpeta tal cual.

---

## 1. Estructura

```
revchill/
├── index.html                  ← la home. ⭐ LOS TEXTOS EN ESPAÑOL VAN AQUÍ
├── weekend.html                ← landing del Weekend Hack (ídem)
├── robots.txt                  ← permisos de rastreo (buscadores e IAs)
├── sitemap.xml                 ← ⚠️ actualiza las fechas al publicar
├── llms.txt                    ← resumen del proyecto para modelos de IA
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

## 3. Cómo añadir sponsors

1. Guarda el logo en `assets/img/sponsors/` (PNG o SVG con fondo transparente, ~200 px de alto).
2. Añádelo al array `sponsors` de `data.js`:

```js
sponsors: [
  { id: "acme", name: "ACME Revenue", logo: "assets/img/sponsors/acme.svg", url: "https://acme.com" }
]
```

Los huecos que sobren hasta `sponsorSlots` se rellenan con "Tu logo aquí" —
que también funciona como reclamo para que alguien pregunte.
Los logos salen en gris y se colorean al pasar el ratón.

---

## 4. Cómo añadir fotos y vídeos

Mete los archivos en `assets/img/gallery/` y añádelos al array `gallery`:

```js
gallery: [
  { type: "image", src: "assets/img/gallery/madrid-01.jpg", size: "wide",
    caption: { es: "RevChill Madrid · Nov 25", en: "RevChill Madrid · Nov 25" } },
  { type: "video", src: "assets/img/gallery/sevilla.mp4",
    poster: "assets/img/gallery/sevilla.jpg", size: "",
    caption: { es: "RevChill Sevilla", en: "RevChill Sevilla" } }
]
```

`size` puede ser `"wide"` (doble ancho), `"tall"` (vertical) o `""` (normal).
Comprime las fotos antes de subirlas (1600 px de ancho basta, <300 kB) o la web irá lenta.

---

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
- [ ] El botón "Descargar dossier" apunta a `assets/revchill-dossier.pdf`. Sube el PDF o
      quita el botón en `index.html`.
- [ ] Sustituir los tres testimonios de ejemplo por reseñas reales (`data.js` → `quotes`).
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

## 12. Los huecos de foto y los testimonios

La web tiene ocho huecos marcados con rayas diagonales y el texto de lo que va dentro.
No son un error: están esperando tus fotos.

- **Hero**, vertical 4:5 (1200×1500). Es la más importante: es lo primero que se ve.
- **Manifiesto**, horizontal 4:3 (1200×900). Gente hablando, no un plano general vacío.
- **Galería**, seis huecos. Se rellenan desde el array `gallery` de `data.js` (punto 4).

Para el hero y el manifiesto, sustituye el comentario de `index.html` por un `<img>`:

```html
<figure class="hero__shot ph" data-ph-key="hero.photo">
  <img src="assets/img/hero.jpg" alt="" fetchpriority="high">
</figure>
```

Los **testimonios** funcionan igual. En `data.js`, cada entrada de `quotes` lleva
`pending: true`. Mientras **todas** estén pendientes, la sección entera no se muestra:
mejor no tener testimonios que enseñar tres huecos vacíos a un patrocinador. En cuanto
quites el `pending: true` de una y rellenes `name`, `role` y `text`, la sección aparece
sola. Así es imposible publicar una reseña inventada por descuido.


---

