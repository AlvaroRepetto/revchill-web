/* =========================================================================
   RevChill — DATOS DE LA WEB
   -------------------------------------------------------------------------
   ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS TOCAR PARA EL DÍA A DÍA.
   Añade eventos, sponsors, fotos y testimonios aquí. Nada más.
   ========================================================================= */

window.REVCHILL = {

  /* ---------------------------------------------------------------------
     1) EVENTOS
     ---------------------------------------------------------------------
     Copia un bloque entero para crear uno nuevo.

     date       -> "AAAA-MM-DDTHH:MM" (hora local española). Se usa para
                   ordenar y para decidir si es próximo o pasado. Automático.
     city       -> Nombre de la ciudad en mayúsculas.
     venue      -> Local.
     address    -> Ciudad o dirección (opcional).
     capacity   -> Nº total de plazas.
     registered -> Inscritos actuales (míralo en Eventbrite y actualiza).
                   Si lo dejas en null, no se muestra la barra de plazas.
     eventbrite -> URL completa del evento en Eventbrite. Si la dejas en "",
                   el botón se convierte en "Próximamente".
     status     -> "open" | "full" | "waitlist"  (por defecto "open")
     --------------------------------------------------------------------- */
  events: [
    {
      id: "sevilla-2025-11",
      date: "2025-11-19T18:30",
      city: "SEVILLA",
      venue: "Terraza Chile",
      address: "Sevilla",
      capacity: 40,
      registered: 30,
      eventbrite: "https://www.eventbrite.com/e/entradas-revchill-social-meet-sevilla-revenue-canas-y-conexiones-que-suman-1961219072039",
      status: "open",
      sponsors: [],
      tags: { es: ["Afterwork", "Terraza", "Gratis"], en: ["Afterwork", "Rooftop", "Free"] },
      title: { es: "RevChill Social Meet Sevilla", en: "RevChill Social Meet Sevilla" },
      blurb: {
        es: "Revenue, cañas y conexiones que suman.",
        en: "Revenue, beers and connections that add up."
      }
    },
    {
      id: "madrid-2025-11",
      date: "2025-11-26T18:30",
      city: "MADRID",
      venue: "Terraza Martini · Radisson RED",
      address: "Madrid",
      capacity: 50,
      registered: 21,
      eventbrite: "https://www.eventbrite.com/e/entradas-revchill-social-meet-madrid-revenue-beers-and-meaningful-connections-1963620643203",
      status: "open",
      sponsors: [],
      tags: { es: ["Afterwork", "Rooftop", "Gratis"], en: ["Afterwork", "Rooftop", "Free"] },
      title: { es: "RevChill Social Meet Madrid", en: "RevChill Social Meet Madrid" },
      blurb: {
        es: "Revenue, beers and meaningful connections.",
        en: "Revenue, beers and meaningful connections."
      }
    }

    /* --- PLANTILLA PARA UN EVENTO NUEVO ---------------------------------
       Descomenta este bloque (quita las marcas de comentario de alrededor)
       y edita los valores.

    ,{
      id: "barcelona-2026-03",
      date: "2026-03-12T18:30",
      city: "BARCELONA",
      venue: "Nombre del local",
      address: "Barcelona",
      capacity: 45,
      registered: 0,
      eventbrite: "",
      status: "open",
      sponsors: ["sponsor-1"],
      tags: { es: ["Afterwork", "Gratis"], en: ["Afterwork", "Free"] },
      title: { es: "RevChill Social Meet Barcelona", en: "RevChill Social Meet Barcelona" },
      blurb: { es: "Texto corto.", en: "Short text." }
    }
    --------------------------------------------------------------------- */
  ],

  /* ---------------------------------------------------------------------
     2) CIUDADES DEL MARQUEE
     soon: true  -> se muestra en gris (“próximamente”)
     --------------------------------------------------------------------- */
  cities: [
    { name: "MADRID" },
    { name: "SEVILLA" },
    { name: "BARCELONA", soon: true },
    { name: "VALENCIA", soon: true },
    { name: "MÁLAGA", soon: true },
    { name: "PALMA", soon: true },
    { name: "BILBAO", soon: true },
    { name: "CANARIAS", soon: true }
  ],

  /* ---------------------------------------------------------------------
     3) SPONSORS
     Pon el logo en assets/img/sponsors/ y referencia el archivo.
     Formato ideal: PNG o SVG con fondo transparente, alto ~200px.
     Deja el array vacío [] y saldrán huecos "Tu logo aquí".
     --------------------------------------------------------------------- */
  sponsorSlots: 4, // nº de huecos que se muestran si faltan sponsors
  sponsors: [
    // { id: "sponsor-1", name: "Nombre S.L.", logo: "assets/img/sponsors/ejemplo.svg", url: "https://ejemplo.com" }
  ],

  /* ---------------------------------------------------------------------
     4) GALERÍA
     type: "image" | "video"
     src : ruta al archivo (assets/img/gallery/...) o URL
     size: "wide" | "tall" | "" (normal)
     Deja el array vacío y salen placeholders.
     --------------------------------------------------------------------- */
  gallery: [
    // { type: "image", src: "assets/img/gallery/madrid-01.jpg", size: "wide",
    //   caption: { es: "RevChill Madrid · Nov 25", en: "RevChill Madrid · Nov 25" } },
    // { type: "video", src: "assets/img/gallery/sevilla.mp4", poster: "assets/img/gallery/sevilla.jpg", size: "",
    //   caption: { es: "RevChill Sevilla", en: "RevChill Sevilla" } }
  ],

  /* ---------------------------------------------------------------------
     5) TESTIMONIOS
     --------------------------------------------------------------------- */
  /* pending: true  -> la tarjeta se ve como un hueco por rellenar.
     Cuando tengas la reseña real, borra esa línea y pon name, role y text. */
  quotes: [
    {
      pending: true,
      name: "",
      role: { es: "Asistente · Madrid", en: "Attendee · Madrid" },
      text: {
        es: "Pide una reseña a alguien que vino a Madrid y pégala aquí.",
        en: "Ask someone who came to Madrid for a review and paste it here."
      }
    },
    {
      pending: true,
      name: "",
      role: { es: "Asistente · Sevilla", en: "Attendee · Sevilla" },
      text: {
        es: "Lo mismo con alguien de Sevilla. Dos o tres líneas bastan.",
        en: "Same with someone from Sevilla. Two or three lines are enough."
      }
    },
    {
      pending: true,
      name: "",
      role: { es: "Patrocinador", en: "Sponsor" },
      text: {
        es: "Y una de un patrocinador: es la que más pesa en la sección de empresas.",
        en: "And one from a sponsor: it carries the most weight in the companies section."
      }
    }
  ],

  /* ---------------------------------------------------------------------
     6) ENLACES Y CONTACTO  — ⚠️ revisa que sean correctos
     --------------------------------------------------------------------- */
  links: {
    whatsapp: "https://chat.whatsapp.com/DxFWFO7E0ou4b3jA0Odzch",
    linkedin: "https://www.linkedin.com/company/revchill/",
    instagram: "https://www.instagram.com/revchill.club/",
    email: "hola@revchill.club",
    emailSponsors: "sponsors@revchill.club"
  },

  /* ---------------------------------------------------------------------
     7) CIFRAS (sección empresas). Actualízalas cuando crezcáis.
     --------------------------------------------------------------------- */
  figures: [
    { value: "2", label: { es: "ciudades activas", en: "active cities" } },
    { value: "50+", label: { es: "profesionales inscritos", en: "professionals signed up" } },
    { value: "95%", label: { es: "del tiempo, networking", en: "of the time, networking" } },
    { value: "0 €", label: { es: "para el asistente", en: "for attendees" } }
  ]
};
