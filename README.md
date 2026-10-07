# RevChill — web

Sitio estático (HTML + CSS + JS, sin frameworks ni build). Se abre haciendo doble clic
en `index.html` y se publica subiendo la carpeta tal cual.

---

## 1. Estructura

```
revchill/
├── index.html                  ← la web entera (estructura)
├── assets/
│   ├── css/app.css             ← todo el diseño
│   ├── js/data.js              ← ⭐ EVENTOS, SPONSORS, FOTOS, TESTIMONIOS
│   ├── js/i18n.js              ← ⭐ TODOS LOS TEXTOS (ES / EN)
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

Todo en `assets/js/i18n.js`. Cada texto tiene una clave (`"hero.title"`, `"faq.a1"`…) y
dos versiones: `es` y `en`. Si cambias uno, cambia también el otro.
Se admite HTML dentro del texto (`<b>`, `<em>`, `<br>`).

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

## 7. Pendientes antes de publicar

- [ ] `assets/img/og.jpg` — imagen 1200×630 para cuando se comparta el enlace.
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

## 8. Publicar

**Opción rápida:** arrastra la carpeta a [app.netlify.com/drop](https://app.netlify.com/drop).
Online en 20 segundos, gratis, HTTPS incluido. Luego apuntas el dominio `revchill.club`.

**Con Git + Vercel/Netlify:** sube la carpeta a un repo de GitHub y conéctalo.
Cada `git push` despliega solo. No hay comando de build: el directorio raíz es el sitio.

**Ver en local:** doble clic en `index.html` funciona. Si prefieres servidor:
`python3 -m http.server 8000` y abre `http://localhost:8000`.

---

## 9. Nota sobre inscripciones

La reserva se hace en **Eventbrite**: el botón abre el evento en pestaña nueva.
Aforo, entradas con QR, emails de confirmación y check-in ya resueltos, sin mantenimiento
ni coste. La web solo muestra el contador de plazas, que actualizas tú en `data.js`.

Si algún día queréis inscripción propia, el punto de cambio es una sola función:
`evHTML()` en `app.js`, donde se construye el botón. El resto de la web no se entera.

---

## 11. Los huecos de foto y los testimonios

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
`pending: true` y se dibuja como una tarjeta de trazo discontinuo que dice "Reseña pendiente".
Cuando tengas la reseña real, borra esa línea y rellena `name`, `role` y `text`.
Así es imposible publicar una reseña inventada por descuido.


---

## 10. El logotipo

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
