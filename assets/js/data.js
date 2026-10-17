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
      id: "sevilla-2025-09",
      date: "2025-09-10T19:00",
      city: "SEVILLA",
      venue: "Terraza Pura Vida",
      address: "Sevilla",
      eventbrite: "",
      sponsors: [],
      tags: { es: ["Afterwork", "Terraza"], en: ["Afterwork", "Rooftop"] },
      title: { es: "RevChill Sevilla", en: "RevChill Sevilla" },
      blurb: { es: "El primero de todos.", en: "The very first one." }
    },
    {
      id: "sevilla-2025-10",
      date: "2025-10-15T19:00",
      city: "SEVILLA",
      venue: "Terraza Chile",
      address: "Sevilla",
      eventbrite: "",
      sponsors: [],
      tags: { es: ["Afterwork", "Terraza"], en: ["Afterwork", "Rooftop"] },
      title: { es: "RevChill Sevilla", en: "RevChill Sevilla" },
      blurb: { es: "Revenue, cañas y conexiones que suman.", en: "Revenue, beers and connections that add up." }
    },
    {
      id: "sevilla-2025-11",
      date: "2025-11-19T19:00",
      city: "SEVILLA",
      venue: "Terraza Chile",
      address: "Sevilla",
      eventbrite: "https://www.eventbrite.com/e/entradas-revchill-social-meet-sevilla-revenue-canas-y-conexiones-que-suman-1961219072039",
      sponsors: [],
      tags: { es: ["Afterwork", "Terraza"], en: ["Afterwork", "Rooftop"] },
      title: { es: "RevChill Social Meet Sevilla", en: "RevChill Social Meet Sevilla" },
      blurb: { es: "Revenue, cañas y conexiones que suman.", en: "Revenue, beers and connections that add up." }
    },
    {
      id: "madrid-2025-11",
      date: "2025-11-26T19:00",
      city: "MADRID",
      venue: "Terraza Martini · Radisson RED",
      address: "Madrid",
      eventbrite: "https://www.eventbrite.com/e/entradas-revchill-social-meet-madrid-revenue-beers-and-meaningful-connections-1963620643203",
      sponsors: [],
      tags: { es: ["Afterwork", "Rooftop"], en: ["Afterwork", "Rooftop"] },
      title: { es: "RevChill Social Meet Madrid", en: "RevChill Social Meet Madrid" },
      blurb: { es: "Revenue, beers and meaningful connections.", en: "Revenue, beers and meaningful connections." }
    },
    {
      id: "sevilla-2026-02",
      date: "2026-02-19T19:00",
      city: "SEVILLA",
      venue: "California Dreams Bar",
      address: "Sevilla",
      eventbrite: "",
      sponsors: [],
      tags: { es: ["Afterwork"], en: ["Afterwork"] },
      title: { es: "RevChill Sevilla", en: "RevChill Sevilla" },
      blurb: { es: "Primera parada del año.", en: "First stop of the year." }
    },
    {
      id: "benidorm-2026-03",
      date: "2026-03-11T19:00",
      city: "BENIDORM",
      venue: "Hotel Brasil",
      address: "Benidorm",
      eventbrite: "",
      sponsors: [],
      tags: { es: ["Afterwork", "Levante"], en: ["Afterwork", "Levante"] },
      title: { es: "RevChill Benidorm", en: "RevChill Benidorm" },
      blurb: { es: "Estreno en el Levante.", en: "First one on the east coast." }
    },
    {
      id: "malaga-2026-04",
      date: "2026-04-15T19:00",
      city: "MÁLAGA",
      venue: "La Terraza de San Juan · Hotel Málaga Premium",
      address: "Málaga",
      eventbrite: "",
      sponsors: [],
      tags: { es: ["Afterwork", "Rooftop"], en: ["Afterwork", "Rooftop"] },
      title: { es: "RevChill Málaga", en: "RevChill Málaga" },
      blurb: { es: "Estreno en la Costa del Sol.", en: "First one on the Costa del Sol." }
    },
    {
      id: "barcelona-2026-05",
      date: "2026-05-20T19:00",
      city: "BARCELONA",
      venue: "Rooftop Yurbban Passage Hotel",
      address: "Barcelona",
      eventbrite: "",
      sponsors: [],
      tags: { es: ["Afterwork", "Rooftop"], en: ["Afterwork", "Rooftop"] },
      title: { es: "RevChill Barcelona", en: "RevChill Barcelona" },
      blurb: { es: "Estreno en Barcelona.", en: "First one in Barcelona." }
    },
    {
      id: "madrid-2026-06",
      date: "2026-06-10T19:00",
      city: "MADRID",
      venue: "Hotel Atípico",
      address: "Madrid",
      eventbrite: "",
      sponsors: [],
      tags: { es: ["Afterwork"], en: ["Afterwork"] },
      title: { es: "RevChill Madrid", en: "RevChill Madrid" },
      blurb: { es: "Cierre antes del verano.", en: "Last one before summer." }
    }

    /* --- PLANTILLA PARA UN EVENTO NUEVO ---------------------------------
       Descomenta este bloque y edita los valores. Para un evento futuro
       añade capacity y registered si quieres que salga la barra de plazas,
       y el enlace de Eventbrite. En los pasados no hace falta ninguna de
       las tres cosas: no se muestran.

    ,{
      id: "valencia-2027-04",
      date: "2027-04-15T19:00",
      city: "VALENCIA",
      venue: "Nombre del local",
      address: "Valencia",
      capacity: 45,
      registered: 0,
      eventbrite: "",
      status: "open",
      sponsors: ["id-del-partner"],
      tags: { es: ["Afterwork"], en: ["Afterwork"] },
      title: { es: "RevChill Valencia", en: "RevChill Valencia" },
      blurb: { es: "Texto corto.", en: "Short text." }
    }
    --------------------------------------------------------------------- */
  ],

  /* ---------------------------------------------------------------------
     2) CIUDADES DEL MARQUEE
     soon: true  -> se muestra en gris (“próximamente”)
     --------------------------------------------------------------------- */
  cities: [
    { name: "SEVILLA" },
    { name: "MADRID" },
    { name: "BARCELONA" },
    { name: "MÁLAGA" },
    { name: "BENIDORM" },
    { name: "VALENCIA", soon: true },
    { name: "PALMA", soon: true },
    { name: "BILBAO", soon: true },
    { name: "CANARIAS", soon: true },
    { name: "LISBOA", soon: true }
  ],

  /* ---------------------------------------------------------------------
     3) PARTNERS
     ---------------------------------------------------------------------
     Pon el logo en assets/img/sponsors/ y referencia el archivo.
     Formato ideal: PNG o SVG con fondo transparente, alto ~200px.
     Deja el array vacío [] y saldrán huecos "Tu logo aquí".

     tier -> decide dónde y cómo de grande aparece la marca:
       "temporada"  Partner de temporada. Logo al doble de tamaño, el primero
                    del muro, y sale nombrado en el pie y en llms.txt.
       "anfitrion"  Anfitrión de uno o varios encuentros. Logo normal.
       "partner"    Partner de encuentro. Logo normal.
       "weekend"    Patrocinador del Weekend Hack. Sale en weekend.html.
                    (Puedes poner varios: tier: ["temporada", "weekend"])

     Para que una marca salga en la ficha de un encuentro concreto, añade su
     id al array "sponsors" de ese evento, arriba.
     --------------------------------------------------------------------- */
  sponsorSlots: 12, // nº de huecos del muro (3 filas de 4 en escritorio)
  sponsors: [
    // { id: "sponsor-1", name: "Nombre S.L.", tier: "anfitrion",
    //   logo: "assets/img/sponsors/ejemplo.svg", url: "https://ejemplo.com" }
  ],

  /* ---------------------------------------------------------------------
     4) GALERÍA
     ---------------------------------------------------------------------
     Cada foto necesita dos archivos:
       src  -> la miniatura de la rejilla   (-t.jpg, 760 px de lado mayor)
       full -> la grande que se abre al pulsar (1600 px de lado mayor)
     size -> "tall" para las verticales, "wide" para las horizontales.
             Solo afecta al orden de lectura; el alto lo pone la propia foto.
     Las dos versiones las genera el script de fotos; no subas aquí el
     archivo original del fotógrafo, que pesa veinte veces más.
     --------------------------------------------------------------------- */
  gallery: [
    { src: "assets/img/gallery/madrid-2025-11-grupo-t.jpg",
      full: "assets/img/gallery/madrid-2025-11-grupo.jpg",
      size: "wide",
      caption: { es: "RevChill Madrid · nov 2025", en: "RevChill Madrid · nov 2025" } },
    { src: "assets/img/gallery/barcelona-2026-05-charla-t.jpg",
      full: "assets/img/gallery/barcelona-2026-05-charla.jpg",
      size: "tall",
      caption: { es: "RevChill Barcelona · may 2026", en: "RevChill Barcelona · may 2026" } },
    { src: "assets/img/gallery/sevilla-2025-grupo-t.jpg",
      full: "assets/img/gallery/sevilla-2025-grupo.jpg",
      size: "wide",
      caption: { es: "RevChill Sevilla · 2025", en: "RevChill Sevilla · 2025" } },
    { src: "assets/img/gallery/madrid-2026-06-risas-t.jpg",
      full: "assets/img/gallery/madrid-2026-06-risas.jpg",
      size: "tall",
      caption: { es: "RevChill Madrid · jun 2026", en: "RevChill Madrid · jun 2026" } },
    { src: "assets/img/gallery/madrid-2025-11-azotea-t.jpg",
      full: "assets/img/gallery/madrid-2025-11-azotea.jpg",
      size: "wide",
      caption: { es: "RevChill Madrid · nov 2025", en: "RevChill Madrid · nov 2025" } },
    { src: "assets/img/gallery/barcelona-2026-05-azotea-t.jpg",
      full: "assets/img/gallery/barcelona-2026-05-azotea.jpg",
      size: "tall",
      caption: { es: "RevChill Barcelona · may 2026", en: "RevChill Barcelona · may 2026" } },
    { src: "assets/img/gallery/malaga-2026-04-terraza-t.jpg",
      full: "assets/img/gallery/malaga-2026-04-terraza.jpg",
      size: "wide",
      caption: { es: "RevChill Málaga · abr 2026", en: "RevChill Málaga · abr 2026" } },
    { src: "assets/img/gallery/madrid-2025-11-charla-t.jpg",
      full: "assets/img/gallery/madrid-2025-11-charla.jpg",
      size: "tall",
      caption: { es: "RevChill Madrid · nov 2025", en: "RevChill Madrid · nov 2025" } },
    { src: "assets/img/gallery/barcelona-2026-05-vista-t.jpg",
      full: "assets/img/gallery/barcelona-2026-05-vista.jpg",
      size: "wide",
      caption: { es: "RevChill Barcelona · may 2026", en: "RevChill Barcelona · may 2026" } },
    { src: "assets/img/gallery/madrid-2026-06-patio-t.jpg",
      full: "assets/img/gallery/madrid-2026-06-patio.jpg",
      size: "tall",
      caption: { es: "RevChill Madrid · jun 2026", en: "RevChill Madrid · jun 2026" } },
    { src: "assets/img/gallery/malaga-2026-04-partner-t.jpg",
      full: "assets/img/gallery/malaga-2026-04-partner.jpg",
      size: "wide",
      caption: { es: "RevChill Málaga · abr 2026", en: "RevChill Málaga · abr 2026" } },
    { src: "assets/img/gallery/madrid-2025-11-movil-t.jpg",
      full: "assets/img/gallery/madrid-2025-11-movil.jpg",
      size: "tall",
      caption: { es: "RevChill Madrid · nov 2025", en: "RevChill Madrid · nov 2025" } },
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
    { value: "5", label: { es: "comunidades activas", en: "active communities" } },
    { value: "~40", label: { es: "asistentes por encuentro", en: "attendees per meet-up" } },
    { value: "700+", label: { es: "siguiendo en LinkedIn", en: "following on LinkedIn" } },
    { value: "0 €", label: { es: "para el asistente", en: "for attendees" } }
  ]
};
