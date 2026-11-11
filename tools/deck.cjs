/*
  Genera el dossier en PowerPoint, en español y en inglés.

      cd <raíz del proyecto>
      node tools/deck.cjs

  Produce dos .pptx editables con el mismo diseño que el dossier: verde
  oscuro, naranja de marca y las fotos reales de los encuentros.

  Sobre las tipografías: los titulares van en Outfit, que es la de la marca
  y está en Google Fonts, así que al importar el archivo en Google Slides se
  ve correcta. El cuerpo va en Calibri a propósito: si PowerPoint no tiene
  la fuente del cuerpo la sustituye por otra de anchos distintos y el texto
  se desborda. En los titulares, que son cortos, el riesgo es asumible.
*/
const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/67dbd9b2-a531-4762-b2e5-824bf99d5e60_aaae5961-baec-4759-836e-a75d26e59959/pptx/scripts/apply_theme.js');

const IMG = 'assets/img/dossier/';
const LOGO = 'assets/img/sponsors/';

const THEME = {
  name: 'RevChill',
  headFontFace: 'Outfit',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '0E3334',   // verde tinta, el fondo oscuro
    lt1: 'FDFDF8',   // papel
    dk2: '15403E',   // verde un punto más claro, para tarjetas sobre oscuro
    lt2: 'F2F4EA',   // papel teñido
    accent1: 'FF7A4D', // naranja de marca
    accent2: 'C0441A', // naranja impreso, para texto sobre claro
    accent3: 'B9CCC7',
    accent4: '8FA9A4',
    accent5: '55706C',
    accent6: 'E7EBDC',
    hlink: 'C0441A',
    folHlink: '8FA9A4'
  }
};
const K = THEME.colors;

const W = 13.333, H = 7.5, M = 0.75;      // lienzo y margen

/* ------------------------------------------------------------------ */
/* CONTENIDO                                                           */
/* ------------------------------------------------------------------ */
const T = {
  es: {
    archivo: '/home/claude/entregables/Dossier-RevChill-Partners-2027.pptx',
    asunto: 'Dossier de partners 2027',
    autor: 'Alvaro Repetto',
    portadaA: 'Somos pequeños.',
    portadaB: 'Esa es exactamente la propuesta.',
    portadaSub: 'Dossier de colaboración 2027. Dentro están las cifras reales, en qué se gasta cada euro y cuánto cuesta estar.',
    portadaPie: 'Documento privado   ·   Temporada 2027   ·   revchill.org',

    s2eye: 'Qué es esto', s2tit: 'Afterworks de revenue management,\nsin ponencias y sin stands',
    s2p: 'Los mejores aprendizajes del sector no pasan en la sala de plenaria, pasan tomando algo después. Así que quitamos la sala. Encuentros de tarde, gratuitos y con aforo limitado, en terrazas de cinco ciudades.',
    s2p2: 'Nueve encuentros, cinco ciudades y trece marcas que ya han pasado por ellos.',

    s3tit: 'Lo que sí es, y lo que no',
    s3a: 'Lo que sí es', s3al: [
      'Cuarenta profesionales de pie, con una caña, hablando de precios',
      'Entrada gratuita para quien viene, siempre',
      'Máximo tres marcas por encuentro, nunca dos del mismo nicho',
      'Todo el material de la noche, para que lo uses donde quieras'],
    s3b: 'Lo que no es', s3bl: [
      'Un congreso. No hay escenario ni programa',
      'Una feria. Tu marca está dentro de la conversación, no al lado',
      'Una base de datos de la que nadie sabe nada',
      'Un medio con alcance masivo'],

    s4eye: 'Las cifras, sin maquillar', s4tit: 'Estos son los números reales.\nSon pequeños',
    s4f: [['700', 'seguidores en LinkedIn'], ['150', 'en las comunidades de WhatsApp'],
          ['~1.000', 'impresiones por publicación'], ['~40', 'asistentes por encuentro']],
    s4p: 'Preferimos que los veas aquí y no que los descubras después. Todo lo que viene se apoya en esto, y en nada más.',

    s5tit: 'Si buscas alcance, hay sitios mejores',
    s5p: 'Con el presupuesto de un encuentro puesto en publicidad en LinkedIn llegas a mucha más gente que con todo lo que RevChill publica en un trimestre. Si tu objetivo de este año es impresiones, gástalo ahí.',
    s5p2: 'Lo que ese presupuesto no te compra en ningún otro sitio es estar dos horas de pie, con una caña, hablando sin prisa con cuarenta personas que en su gran mayoría son revenue managers.',
    s5a: 'Un encuentro cuesta 1.000 €', s5ad: '25 € por cada persona que entra por la puerta, y casi todas son de tu público exacto.',
    s5b: 'Un stand en una feria', s5bd: 'Cuesta varias veces eso, y la mayoría de quien pasa por delante no es tu cliente.',

    s6eye: 'Quién viene', s6tit: 'Revenue managers, sobre todo.\nSenior y junior en la misma mesa',
    s6p: 'Hay dirección de hotel, distribución, consultoría, producto y estudiantes, pero el núcleo es constante: gente de revenue.',
    s6l: ['Sevilla — la base, donde más encuentros se hacen', 'Madrid — la plaza grande, coincide con las ferias',
          'Barcelona — activa desde 2026', 'Málaga — activa desde 2026', 'Levante — Valencia y Benidorm, en crecimiento'],

    s7eye: 'Los dos formatos', s7tit: 'Uno te pone en la conversación.\nEl otro te mete en el grupo',
    s7h: ['', 'RevChill Afterwork', 'RevChill Weekend'],
    s7r: [['Cuánto dura', 'Dos o tres horas', 'Cuarenta y ocho'],
          ['Cuánta gente', 'Unas 40, viene quien quiere', 'De 15 a 20, seleccionadas'],
          ['Dónde', 'Una terraza de ciudad', 'Una casa en plena naturaleza'],
          ['Tu equipo', 'Asiste a la noche', 'Convive el fin de semana entero'],
          ['Contacto real contigo', 'Minutos por persona', 'Horas por persona'],
          ['Qué compras de verdad', 'Presencia', 'Acceso'],
          ['Marcas en el mismo evento', 'Hasta 3', 'Hasta 3'],
          ['Qué contenido sale', 'Fotos y un vídeo corto', 'Fotos, vídeo largo y entrevistas'],
          ['Cuántos hay al año', '10 a 12', '1 piloto, y hasta 4 o 5 si funciona'],
          ['Aportación orientativa', '1.000 – 1.200 €', '3.000 – 3.500 €']],

    s8eye: 'RevChill Afterwork', s8tit: 'En qué se va el dinero\nde un encuentro',
    s8p: 'Esto no es un margen. El local casi siempre es gratis: lo que aporta el partner se va en que haya algo que comer y beber, y en que de la noche salga material aprovechable.',
    s8h: ['Concepto', 'Coste', 'Nota'],
    s8r: [['Espacio', '0 €', 'Cedido por el local anfitrión'],
          ['Comida y bebida', '600 – 750 €', 'Picoteo para todos y la primera consumición'],
          ['Fotografía y vídeo', '250 – 300 €', 'Un reportaje y un vídeo corto. Es lo que luego usas tú'],
          ['Materiales y merchandising', '80 – 120 €', 'Identificadores y lo que haga falta esa noche'],
          ['Imprevistos', '70 €', 'Siempre hay uno'],
          ['Total', '1.000 – 1.200 €', 'Venga de una marca o de tres']],

    s9tit: 'Tres formas de estar',
    s9p: 'El mismo encuentro, repartido de tres maneras. Cuantas menos marcas haya, más espacio ocupas tú.',
    s9c: [['Tres marcas', 'Compartido', '400 €', 'por marca y encuentro',
           'Tu logo, tu presencia y el material de la noche, compartiendo cartel con dos marcas que no compiten contigo.'],
          ['Dos marcas', 'Acompañado', '600 €', 'por marca y encuentro',
           'El punto de equilibrio: tus cinco minutos sin que la noche parezca un desfile de logos.'],
          ['Una marca', 'En exclusiva', '1.000 €', 'el encuentro entero',
           'Tu logo solo y todo el material asociado únicamente a tu marca. Es el formato que más recuerdan.']],

    s10tit: 'Qué incluye, estés como estés',
    s10l: [['Cinco minutos para presentarte', 'De pie y sin proyector. El único momento en que una marca habla'],
           ['Tu logo en la web', 'En el muro de empresas y en la página de patrocinio, enlazado y permanente'],
           ['Mención en las publicaciones', 'Antes, durante y después, en LinkedIn y en WhatsApp'],
           ['Todo el material de la noche', 'Fotografías y vídeo corto, con derecho de uso propio'],
           ['Dos invitaciones para tu equipo', 'Además de quien presenta'],
           ['Un informe de la noche', 'Cuánta gente vino y qué perfiles había']],

    s11eye: 'Varios encuentros', s11tit: 'No hay descuento por volumen,\ny conviene decir por qué',
    s11p: 'Cada noche cuesta lo que cuesta y el presupuesto está medido al detalle. Rebajar el precio significaría recortar la comida o el reportaje. Lo que sí cambia al cerrar varios es lo que puedes elegir.',
    s11c: [['3 encuentros', 'Eliges ciudad', 'Eliges tú las ciudades, antes que nadie'],
           ['6 encuentros', 'Eliges fecha', 'Media temporada, con las fechas antes de publicarse'],
           ['Temporada completa', 'Logo destacado todo el año', 'Los 10 a 12 encuentros, como partner de temporada'],
           ['Partner fundador', 'Precio congelado para 2028', 'Para quien cierre antes del 31 de enero de 2027']],

    s12tit: 'Tres compromisos y lo que cuestan',
    s12c: [['Probar compartiendo cartel', '3 encuentros · 400 € × 3', '1.200 €', 'Tres ciudades, tres noches, tres reportajes'],
           ['Media temporada con otra marca', '6 encuentros · 600 € × 6', '3.600 €', 'Medio año de presencia continuada'],
           ['Temporada en exclusiva', '12 encuentros · 1.000 € × 12', '12.000 €', 'Un año siendo la única marca de cada noche']],

    s13eye: 'RevChill Weekend · Nuevo en 2027', s13tit: 'Cuarenta y ocho horas con quince\npersonas elegidas una a una',
    s13p: 'La primera edición es un piloto, y se hace en Andalucía. Si sale bien, la intención es llevarlo a otras cuatro o cinco localizaciones a lo largo de 2027.',
    s13c: [['Habrá naturaleza', 'Rutas de sierra por la mañana. Se habla mientras se anda'],
           ['Habrá aprendizaje', 'Sin ponencias: lo que sabe cada uno, contado en el porche'],
           ['Habrá sobremesa', 'Cena al fuego y la conversación que viene después']],
    s13nota: 'Estas tres imágenes son una recreación: el Weekend no se ha celebrado todavía.',

    s14eye: 'RevChill Weekend · A dónde va la inversión', s14tit: 'Qué paga exactamente el patrocinio',
    s14p: 'El asistente paga una entrada que no cubre ni la mitad de lo que cuesta. Sin el patrocinio la entrada se iría al doble, y el grupo lo seleccionaría el bolsillo en vez del perfil.',
    s14a: 'En qué se gasta', s14al: ['La casa, alquilada entera. Es la partida mayor y es fija',
      'Las comidas: bienvenida, desayunos, la comida de la ruta y la barbacoa',
      'El creador de contenido, el fin de semana entero con el grupo',
      'El welcome pack, pensado para que no acabe en un cajón',
      'Un colchón para imprevistos, generoso por ser la primera'],
    s14b: 'Qué compra eso en realidad', s14bl: ['Elegir a los quince o veinte por criterio y no por quién puede permitírselo',
      'Que exista contenido: sin él esto es una escapada privada de la que no se entera nadie',
      'El recuerdo: lo que la gente se lleva puesto y fotografía durante semanas'],

    s15tit: 'Tres formas de entrar en el Weekend',
    s15c: [['Tres marcas', 'Compartido', '1.150 €', 'por marca',
            'Una plaza para tu representante y presencia en el welcome pack.'],
           ['Dos marcas', 'Acompañado', '1.700 €', 'por marca',
            'Plaza, peso real en el welcome pack y la opción de llevar una actividad propia.'],
           ['Una marca', 'En exclusiva', '3.000 €', 'el Weekend entero',
            'La primera edición entera asociada a tu marca, con todo el reportaje bajo tu nombre.']],
    s15nota: 'Cada marca trae un representante como máximo, y su plaza va incluida: duerme, come y camina con el grupo.',

    s16eye: 'RevChill Weekend · Qué compras', s16tit: 'Tu comercial deja de ser\nun comercial durante dos días',
    s16p: 'En un encuentro de tarde tu equipo habla unos minutos con cada persona y se va. Aquí desayuna con ellos, sube un monte con ellos y cena con ellos dos noches seguidas.',
    s16a: 'Lo que te llevas', s16al: ['Una plaza para tu representante, todo cubierto salvo el desplazamiento',
      'Presencia en el welcome pack: tu producto, tu merchandising o ambos',
      'Reportaje, vídeo largo y entrevistas, con derecho de uso propio',
      'Primera opción sobre las ediciones siguientes de 2027'],
    s16b: 'Lo que te pedimos', s16bl: ['Que tu representante venga a convivir, no a trabajar la sala',
      'Que no haya presentación comercial ni folleto en la habitación',
      'Que entiendas que es una primera edición',
      'Que decidas pronto: la casa y el welcome pack se cierran con meses'],

    s17eye: 'Aportaciones en especie', s17tit: 'No todo tiene que ser dinero',
    s17p: 'Buscamos sobre todo tecnológicas del sector hotelero, pero no es un requisito. Varias de las colaboraciones que mejor han funcionado no fueron una transferencia.',
    s17a: 'Qué aceptamos', s17al: ['Producto físico: bebida, muestras, lo que entre en el welcome pack',
      'Merchandising: camisetas, pulseras, mochilas', 'El espacio: un hotel, una terraza, una casa',
      'Servicios: fotografía, vídeo, transporte, catering'],
    s17b: 'Cómo se valora', s17bl: ['Por lo que nos ahorra, no por tu precio de tarifa',
      'Cien camisetas que te cuestan 600 € cuentan 600 €',
      'Las licencias y los códigos de descuento no sustituyen aportación: no pagan la cena ni al fotógrafo'],

    s18eye: 'A medida', s18tit: 'Si se te ocurre una forma mejor\nde que te vean, la escuchamos',
    s18p: 'Todo lo anterior es lo que sabemos hacer, no una carta cerrada. Somos pequeños y eso tiene una ventaja: podemos montar algo que no esté aquí sin pedir permiso a nadie.',
    s18l: ['Un formato que no existe todavía: un encuentro temático, algo en una feria',
      'Contenido conjunto: publicaciones, un vídeo, una conversación grabada con tu equipo',
      'Presencia dentro del material, no solo el logo en una esquina',
      'Un acuerdo que mezcle afterworks y Weekend, con la cuenta a medida',
      'Lo que se te ocurra. Tráelo y lo miramos'],

    s19eye: 'Los límites', s19tit: 'Lo que no vendemos,\npor mucho que se pida',
    s19p: 'Esto protege el valor de todo lo demás. El día que vendamos la lista de asistentes, dejará de venir gente, y entonces no habrá nada que patrocinar.',
    s19c: [['Datos de quien no los ha dado', 'Sí compartimos los contactos de quien lo autoriza al inscribirse, marcando una casilla con tu nombre. Nunca viene marcada por defecto'],
           ['Acceso anticipado a los inscritos', 'Nadie sabe quién va a venir antes de que empiece la noche. Tú tampoco'],
           ['Más de tres marcas por evento', 'Ni en los afterworks ni en el Weekend, y nunca dos del mismo nicho'],
           ['El micrófono', 'Cinco minutos en el afterwork, ninguno en el Weekend'],
           ['Control sobre el contenido', 'Revisas lo que te afecta, pero la comunidad no se edita'],
           ['Exclusividad a perpetuidad', 'Por temporada sí. De por vida cerraría la puerta a media industria']],

    s20eye: 'Hacia dónde va esto', s20tit: 'Entrar ahora cuesta\nlo que cuesta ahora',
    s20a: 'Dónde estamos', s20al: ['700 seguidores en LinkedIn', '150 en las comunidades de WhatsApp',
      '9 encuentros celebrados', '0 ediciones del Weekend: la primera es el piloto'],
    s20b: 'A dónde vamos en 2027', s20bl: ['10 a 12 encuentros, dos por ciudad grande',
      'Hasta 5 Weekends: el piloto andaluz y cuatro más si sale', 'Portugal, en estudio para el final de temporada',
      'Más vídeo: es donde se juega el crecimiento'],
    s20p: 'A los partners fundadores les congelamos el precio para 2028, crezca lo que crezca esto.',

    s21eye: 'Quién ha estado', s21tit: 'Trece marcas han pasado\nya por un RevChill',
    s22tit: 'Media hora de conversación basta\npara saber si tiene sentido',
    s22p: 'Cuéntame a qué te dedicas y qué esperarías sacar de esto, y te digo con franqueza si creo que encajas. Si no encajas, te lo diré: es más barato para los dos que descubrirlo después del primer encuentro.',
    s22pie: 'Alvaro Repetto   ·   hola@revchill.org   ·   revchill.org'
  },

  en: {
    archivo: '/home/claude/entregables/RevChill-Partner-Dossier-2027-EN.pptx',
    asunto: 'Partner dossier 2027',
    autor: 'Alvaro Repetto',
    portadaA: "We're small.",
    portadaB: 'That is precisely the offer.',
    portadaSub: "Partnership dossier 2027. Inside you'll find the real numbers, where every euro goes and what it costs to be there.",
    portadaPie: 'Private document   ·   2027 season   ·   revchill.org',

    s2eye: 'What this is', s2tit: 'Revenue management afterworks,\nno talks and no stands',
    s2p: "The best insights in this industry don't happen in the plenary room, they happen over a drink afterwards. So we got rid of the room. Evening meet-ups, free to attend and capped in size, on rooftops across five cities.",
    s2p2: 'Nine meet-ups, five cities and thirteen brands that have already been through them.',

    s3tit: "What it is, and what it isn't",
    s3a: 'What it is', s3al: [
      'Forty professionals on their feet, beer in hand, talking pricing',
      'Free entry for whoever comes, always',
      'Three brands per meet-up maximum, never two from the same niche',
      "Every piece of material from the night, yours to use"],
    s3b: "What it isn't", s3bl: [
      "A conference. There's no stage and no programme",
      'A trade fair. Your brand sits inside the conversation, not next to it',
      'A database nobody knows anything about',
      'A channel with mass reach'],

    s4eye: 'The numbers, unretouched', s4tit: 'These are the real figures.\nThey are small',
    s4f: [['700', 'followers on LinkedIn'], ['150', 'across the WhatsApp communities'],
          ['~1,000', 'impressions per post'], ['~40', 'attendees per meet-up']],
    s4p: "We'd rather you saw them here than found them out later. Everything that follows rests on this, and on nothing else.",

    s5tit: 'If you want reach, there are better places',
    s5p: "Put one meet-up's budget into LinkedIn advertising and you'll reach far more people than everything RevChill publishes in a quarter. If impressions are your goal this year, spend it there.",
    s5p2: "What that budget doesn't buy you anywhere else is two hours on your feet, beer in hand, talking unhurriedly with forty people who are overwhelmingly revenue managers.",
    s5a: 'A meet-up costs €1,000', s5ad: '€25 for each person who walks through the door, and nearly all of them are your audience.',
    s5b: 'A booth at a trade fair', s5bd: "Costs several times that, and most people walking past aren't your customer.",

    s6eye: 'Who comes', s6tit: 'Revenue managers, mostly.\nSenior and junior at the same table',
    s6p: "There's hotel management, distribution, consulting, product and students, but the core is constant: revenue people.",
    s6l: ['Seville — home base, where most meet-ups happen', 'Madrid — the big one, lines up with the trade fairs',
          'Barcelona — active since 2026', 'Málaga — active since 2026', 'Levante — Valencia and Benidorm, growing'],

    s7eye: 'The two formats', s7tit: 'One puts you in the conversation.\nThe other puts you in the group',
    s7h: ['', 'RevChill Afterwork', 'RevChill Weekend'],
    s7r: [['How long it lasts', 'Two or three hours', 'Forty-eight'],
          ['How many people', 'Around 40, open to whoever comes', '15 to 20, hand-picked'],
          ['Where', 'A city rooftop', 'A house out in the countryside'],
          ['Your team', 'Attends for the evening', 'Lives there the whole weekend'],
          ['Real contact time', 'Minutes per person', 'Hours per person'],
          ["What you're actually buying", 'Presence', 'Access'],
          ['Brands at the same event', 'Up to 3', 'Up to 3'],
          ['What content comes out', 'Photos and a short video', 'Photos, long video and interviews'],
          ['How many per year', '10 to 12', '1 pilot, up to 4 or 5 if it works'],
          ['Indicative contribution', '€1,000 – €1,200', '€3,000 – €3,500']],

    s8eye: 'RevChill Afterwork', s8tit: "Where a meet-up's money\nactually goes",
    s8p: "This isn't margin. The venue is nearly always free: what a partner contributes goes into making sure there's something to eat and drink, and that usable material comes out of the night.",
    s8h: ['Item', 'Cost', 'Note'],
    s8r: [['Venue', '€0', 'Provided by the host venue'],
          ['Food and drink', '€600 – €750', 'Finger food for everyone and the first round'],
          ['Photography and video', '€250 – €300', 'A photo report and a short video. This is what you use'],
          ['Materials and merchandise', '€80 – €120', 'Name badges and whatever the night needs'],
          ['Contingency', '€70', "There's always something"],
          ['Total', '€1,000 – €1,200', 'Whether it comes from one brand or three']],

    s9tit: 'Three ways to be there',
    s9p: 'The same meet-up, split three ways. The fewer brands there are, the more room you take up.',
    s9c: [['Three brands', 'Shared', '€400', 'per brand, per meet-up',
           "Your logo, your presence and the night's material, sharing with two brands that don't compete with you."],
          ['Two brands', 'Shared with one', '€600', 'per brand, per meet-up',
           "The sweet spot: your five minutes without the night looking like a parade of logos."],
          ['One brand', 'Exclusive', '€1,000', 'the whole meet-up',
           'Your logo alone and all the material tied to your brand only. The format attendees remember most.']],

    s10tit: "What's included, whichever way you come in",
    s10l: [['Five minutes to introduce yourself', 'Standing up, no projector. The only moment a brand speaks'],
           ['Your logo on the website', 'On the company wall and the partnership page, linked and permanent'],
           ['A mention in the posts', 'Before, during and after, on LinkedIn and in WhatsApp'],
           ["All of the night's material", 'Photos and a short video, yours to use'],
           ['Two invitations for your team', 'On top of whoever presents'],
           ['A report on the night', 'How many people came and what profiles were there']],

    s11eye: 'Several meet-ups', s11tit: "There's no volume discount,\nand it's worth saying why",
    s11p: "Every night costs what it costs and the budget is measured to the euro. Cutting the price would mean cutting the food or the photo report. What does change when you commit to several is what you get to choose.",
    s11c: [['3 meet-ups', 'You pick the city', 'You choose the cities, before anyone else'],
           ['6 meet-ups', 'You pick the dates', "Half a season, with dates chosen before they're published"],
           ['Full season', 'Featured logo all year', 'All 10 to 12 meet-ups, as season partner'],
           ['Founding partner', 'Price frozen for 2028', 'For anyone signing before 31 January 2027']],

    s12tit: 'Three commitments and what they cost',
    s12c: [['Testing the water, sharing', '3 meet-ups · €400 × 3', '€1,200', 'Three cities, three nights, three photo reports'],
           ['Half a season with one other', '6 meet-ups · €600 × 6', '€3,600', 'Half a year of continuous presence'],
           ['Exclusive season partner', '12 meet-ups · €1,000 × 12', '€12,000', 'A year as the only brand of every night']],

    s13eye: 'RevChill Weekend · New for 2027', s13tit: 'Forty-eight hours with fifteen\npeople chosen one by one',
    s13p: 'The first edition is a pilot, and it happens in Andalusia. If it goes well, the intention is to take it to another four or five locations across 2027.',
    s13c: [["There'll be the outdoors", 'Sierra trails in the morning. You talk while you walk'],
           ["There'll be learning", 'No talks: whatever each of us knows, told on the porch'],
           ["There'll be a long table", 'Dinner over coals, and the talk that comes after']],
    s13nota: "These three images are a recreation: the Weekend hasn't happened yet.",

    s14eye: 'RevChill Weekend · Where the money goes', s14tit: 'What sponsorship actually pays for',
    s14p: "Attendees pay a ticket that doesn't cover half of what it costs. Without sponsorship the ticket would double, and the group would be selected by wallet rather than by profile.",
    s14a: "What it's spent on", s14al: ["The house, rented in full. The biggest line and it's fixed",
      'The meals: welcome dinner, breakfasts, lunch off the trail and the barbecue',
      'The content creator, with the group the whole weekend',
      "The welcome pack, designed not to end up in a drawer",
      'A contingency buffer, generous because it is the first one'],
    s14b: 'What that actually buys', s14bl: ['Picking the fifteen or twenty on merit rather than on who can afford it',
      'That content exists: without it this is a private getaway nobody hears about',
      'The keepsake: what people wear and photograph for weeks afterwards'],

    s15tit: 'Three ways into the Weekend',
    s15c: [['Three brands', 'Shared', '€1,150', 'per brand',
            'A place for your representative and presence in the welcome pack.'],
           ['Two brands', 'Shared with one', '€1,700', 'per brand',
            'A place, real weight in the welcome pack and the option to bring your own activity.'],
           ['One brand', 'Exclusive', '€3,000', 'the whole Weekend',
            'The entire first edition tied to your brand, with the full report under your name.']],
    s15nota: 'Each brand brings one representative at most, and their place is included: they sleep, eat and walk with the group.',

    s16eye: "RevChill Weekend · What you're buying", s16tit: 'Your salesperson stops being\na salesperson for two days',
    s16p: 'At an evening meet-up your team talks to each person for a few minutes and leaves. Here they have breakfast with them, climb a hill with them and have dinner with them two nights running.',
    s16a: 'What you get', s16al: ['A place for your representative, everything covered except travel',
      'Presence in the welcome pack: your product, your merchandise or both',
      'Photo report, long-form video and interviews, yours to use',
      'First refusal on the later 2027 editions'],
    s16b: 'What we ask of you', s16bl: ['That your representative comes to join in, not to work the room',
      'No sales presentation and no brochure in the bedroom',
      'That you understand this is a first edition',
      'That you decide early: the house and the pack close months ahead'],

    s17eye: 'In-kind contributions', s17tit: "It doesn't all have to be money",
    s17p: "We're mainly looking for hotel-tech companies, but it isn't a requirement. Several of the collaborations that worked best weren't a bank transfer.",
    s17a: 'What we accept', s17al: ['Physical product: drinks, samples, anything for the welcome pack',
      'Merchandise: t-shirts, wristbands, backpacks', 'The venue: a hotel, a rooftop, a house',
      'Services: photography, video, transport, catering'],
    s17b: "How it's valued", s17bl: ['At what it saves us, not at your list price',
      'A hundred t-shirts that cost you €600 count as €600',
      "Licences and discount codes don't replace a contribution: they don't pay for dinner or the photographer"],

    s18eye: 'Bespoke', s18tit: 'If you can think of a better way\nto be seen, we’re listening',
    s18p: "Everything above is what we know how to do, not a closed menu. We're small and that has one advantage: we can put together something that isn't here without asking anyone's permission.",
    s18l: ["A format that doesn't exist yet: a themed meet-up, something at a trade fair",
      'Joint content: posts, a video, a recorded conversation with your team',
      'Presence inside the material, not just a logo in the corner',
      'A deal mixing afterworks and the Weekend, with the numbers made to fit',
      "Whatever you come up with. Bring it and we'll look at it"],

    s19eye: 'The limits', s19tit: "What we don't sell,\nhowever hard we're asked",
    s19p: 'This protects the value of everything else. The day we sell the attendee list, people stop coming — and then there is nothing left to sponsor.',
    s19c: [["Details from anyone who didn't give them", 'We do share contacts of attendees who agree at registration, by ticking a box naming you. Never pre-ticked'],
           ['Early access to registrations', "Nobody knows who's coming before the night starts. Not you either"],
           ['More than three brands per event', 'Not at the afterworks, not at the Weekend, never two from one niche'],
           ['The microphone', 'Five minutes at the afterwork, none at the Weekend'],
           ['Control over the content', "You review what concerns you, but the community doesn't get edited"],
           ['Exclusivity in perpetuity', 'Per season yes. Forever would shut the door on half the industry']],

    s20eye: 'Where this is going', s20tit: 'Coming in now costs\nwhat it costs now',
    s20a: 'Where we are', s20al: ['700 followers on LinkedIn', '150 across the WhatsApp communities',
      '9 meet-ups held', '0 Weekend editions: the first one is the pilot'],
    s20b: 'Where we go in 2027', s20bl: ['10 to 12 meet-ups, two per major city',
      'Up to 5 Weekends: the Andalusian pilot and four more if it lands', 'Portugal, under consideration for the end of the season',
      'More video: that is where the growth is'],
    s20p: 'For founding partners we freeze the price for 2028, however much this grows.',

    s21eye: "Who's been here", s21tit: 'Thirteen brands have already\nbeen through a RevChill',
    s22tit: 'Half an hour of conversation is enough\nto know whether this makes sense',
    s22p: "Tell me what you do and what you'd expect to get out of this, and I'll tell you frankly whether I think you fit. If you don't, I'll say so: it's cheaper for both of us than finding out after the first meet-up.",
    s22pie: 'Alvaro Repetto   ·   hola@revchill.org   ·   revchill.org'
  }
};

/* ------------------------------------------------------------------ */
/* PIEZAS REUTILIZABLES                                                */
/* ------------------------------------------------------------------ */
const eyebrow = (s, txt, claro) => s.addText(txt.toUpperCase(), {
  x: M, y: 0.52, w: W - M * 2, h: 0.3, isTextBox: true, margin: 0,
  fontFace: 'Outfit', fontSize: 11, bold: true, charSpacing: 2.2,
  color: claro ? K.accent2 : K.accent1
});

const titulo = (s, txt, claro, y) => s.addText(txt, {
  x: M, y: y === undefined ? 0.92 : y, w: W - M * 2, h: 1.25, isTextBox: true, margin: 0,
  fontFace: 'Outfit', fontSize: 32, bold: true, lineSpacing: 38,
  color: claro ? K.dk1 : K.lt2, valign: 'top'
});

const parrafo = (s, txt, o = {}) => s.addText(txt, Object.assign({
  x: M, y: 2.3, w: 6.4, h: 1.4, isTextBox: true, margin: 0,
  fontSize: 14.5, lineSpacing: 22, color: o.claro === false ? K.accent3 : K.accent5, valign: 'top'
}, (() => { const c = Object.assign({}, o); delete c.claro; return c; })()));

// Lista con viñetas en el naranja de marca, sin usar el carácter "•" a mano.
function lista(s, items, o) {
  const runs = items.map((t, i) => ({
    text: typeof t === 'string' ? t : t[0],
    options: { bullet: { indent: 14 }, breakLine: i < items.length - 1 }
  }));
  s.addText(runs, Object.assign({
    isTextBox: true, margin: 0, fontSize: 13.5, lineSpacing: 20,
    paraSpaceAfter: 8, color: K.accent5, valign: 'top'
  }, o));
}

// Tarjeta: rectángulo de fondo más un bloque de texto encima.
function tarjeta(s, { x, y, w, h, oscuro, radio }) {
  s.addShape(radio ? 'roundRect' : 'rect', {
    x, y, w, h, rectRadius: radio || undefined,
    fill: { color: oscuro ? K.dk2 : K.lt2 },
    line: { color: oscuro ? '2A5553' : K.accent6, width: 1 }
  });
}

/* ------------------------------------------------------------------ */
/* CONSTRUCCIÓN                                                        */
/* ------------------------------------------------------------------ */
async function construye(L) {
  const t = T[L];
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.author = t.autor;
  pres.company = 'RevChill';
  pres.subject = t.asunto;
  pres.title = 'RevChill ' + t.asunto;

  pres.defineSlideMaster({
    title: 'CLARO', background: { color: K.lt1 },
    objects: [{ text: { text: 'RevChill · revchill.org',
      options: { x: M, y: H - 0.52, w: 5, h: 0.28, fontSize: 9, color: K.accent4, isTextBox: true, margin: 0 } } }],
    slideNumber: { x: W - M - 0.6, y: H - 0.52, w: 0.6, h: 0.28, fontSize: 9, color: K.accent4, align: 'right' }
  });
  pres.defineSlideMaster({
    title: 'OSCURO', background: { color: K.dk1 },
    objects: [{ text: { text: 'RevChill · revchill.org',
      options: { x: M, y: H - 0.52, w: 5, h: 0.28, fontSize: 9, color: K.accent4, isTextBox: true, margin: 0 } } }],
    slideNumber: { x: W - M - 0.6, y: H - 0.52, w: 0.6, h: 0.28, fontSize: 9, color: K.accent4, align: 'right' }
  });
  pres.defineSlideMaster({ title: 'PORTADA', background: { color: K.dk1 } });

  const sec = (n) => pres.addSection({ title: n });
  const claro = (s) => pres.addSlide({ masterName: 'CLARO', sectionTitle: s });
  const oscuro = (s) => pres.addSlide({ masterName: 'OSCURO', sectionTitle: s });

  /* ---- 1. portada ---- */
  sec(L === 'es' ? 'Portada' : 'Cover');
  {
    const s = pres.addSlide({ masterName: 'PORTADA', sectionTitle: L === 'es' ? 'Portada' : 'Cover' });
    s.addImage({ path: IMG + 'portada-es.jpg', x: 0, y: 0, w: W, h: H });
    s.addText([{ text: t.portadaA + ' ', options: { color: K.lt2 } }, { text: t.portadaB, options: { color: K.accent1 } }], {
      x: M, y: 2.35, w: 9.6, h: 2.1, isTextBox: true, margin: 0,
      fontFace: 'Outfit', fontSize: 44, bold: true, lineSpacing: 50, valign: 'top'
    });
    s.addText(t.portadaSub, { x: M, y: 4.6, w: 8.2, h: 1.1, isTextBox: true, margin: 0, fontSize: 15, lineSpacing: 23, color: K.accent3 });
    s.addText(t.portadaPie, { x: M, y: H - 1.0, w: 9, h: 0.3, isTextBox: true, margin: 0, fontFace: 'Outfit', fontSize: 10.5, bold: true, charSpacing: 1.6, color: K.accent4 });
    s.addNotes('Dossier de colaboración RevChill 2027.');
  }

  /* ---- 2. qué es ---- */
  sec(L === 'es' ? 'La comunidad' : 'The community');
  const SEC1 = L === 'es' ? 'La comunidad' : 'The community';
  {
    const s = claro(SEC1);
    eyebrow(s, t.s2eye, true); titulo(s, t.s2tit, true);
    parrafo(s, t.s2p, { y: 2.55, w: 5.9, h: 1.8 });
    parrafo(s, t.s2p2, { y: 4.45, w: 5.9, h: 0.8, color: K.dk1 });
    s.addImage({ path: IMG + 'malaga-terraza.jpg', x: 7.25, y: 1.35, w: 5.35, h: 4.0, rounding: false });
    s.addText(L === 'es' ? 'Málaga, abril de 2026. Hotel Málaga Premium.' : 'Málaga, April 2026. Hotel Málaga Premium.',
      { x: 7.25, y: 5.45, w: 5.35, h: 0.3, isTextBox: true, margin: 0, fontSize: 10, color: K.accent4 });
  }

  /* ---- 3. lo que sí / lo que no ---- */
  {
    const s = claro(SEC1);
    titulo(s, t.s3tit, true, 0.72);
    const cw = 5.65, cy = 2.1, ch = 3.5;
    [[t.s3a, t.s3al, M], [t.s3b, t.s3bl, M + cw + 0.55]].forEach(([tit, items, x]) => {
      tarjeta(s, { x, y: cy, w: cw, h: ch });
      s.addText(tit.toUpperCase(), { x: x + 0.42, y: cy + 0.35, w: cw - 0.84, h: 0.3, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 11, bold: true, charSpacing: 2, color: K.accent2 });
      lista(s, items, { x: x + 0.42, y: cy + 0.85, w: cw - 0.84, h: ch - 1.2 });
    });
  }

  /* ---- 4. las cifras ---- */
  sec(L === 'es' ? 'Las cifras' : 'The numbers');
  const SEC2 = L === 'es' ? 'Las cifras' : 'The numbers';
  {
    const s = oscuro(SEC2);
    eyebrow(s, t.s4eye, false); titulo(s, t.s4tit, false);
    parrafo(s, t.s4p, { y: 2.5, w: 7.6, h: 0.8, claro: false });
    const fw = 2.85, fy = 3.35;
    t.s4f.forEach(([n, lab], i) => {
      const x = M + i * (fw + 0.26);
      tarjeta(s, { x, y: fy, w: fw, h: 1.85, oscuro: true });
      s.addText(n, { x: x + 0.3, y: fy + 0.3, w: fw - 0.6, h: 0.7, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 34, bold: true, color: K.accent1 });
      s.addText(lab, { x: x + 0.3, y: fy + 1.02, w: fw - 0.6, h: 0.6, isTextBox: true, margin: 0,
        fontSize: 11.5, lineSpacing: 15, color: K.accent3 });
    });
  }

  /* ---- 5. si buscas alcance ---- */
  {
    const s = oscuro(SEC2);
    titulo(s, t.s5tit, false, 0.72);
    parrafo(s, t.s5p, { y: 2.0, w: 6.0, h: 1.5, claro: false });
    parrafo(s, t.s5p2, { y: 3.6, w: 6.0, h: 1.8, claro: false, color: K.lt2 });
    [[t.s5a, t.s5ad, 2.0], [t.s5b, t.s5bd, 4.05]].forEach(([tit, des, y]) => {
      tarjeta(s, { x: 7.2, y, w: 5.4, h: 1.75, oscuro: true });
      s.addText(tit, { x: 7.55, y: y + 0.28, w: 4.7, h: 0.35, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 15, bold: true, color: K.lt2 });
      s.addText(des, { x: 7.55, y: y + 0.72, w: 4.7, h: 0.85, isTextBox: true, margin: 0,
        fontSize: 12, lineSpacing: 16, color: K.accent3 });
    });
  }

  /* ---- 6. quién viene ---- */
  {
    const s = claro(SEC2);
    eyebrow(s, t.s6eye, true); titulo(s, t.s6tit, true);
    parrafo(s, t.s6p, { y: 2.55, w: 5.9, h: 1.0 });
    lista(s, t.s6l, { x: M, y: 3.7, w: 5.9, h: 2.1 });
    s.addImage({ path: IMG + 'madrid-azotea.jpg', x: 7.25, y: 1.35, w: 5.35, h: 4.0 });
    s.addText(L === 'es' ? 'Madrid, noviembre de 2025. Radisson RED.' : 'Madrid, November 2025. Radisson RED.',
      { x: 7.25, y: 5.45, w: 5.35, h: 0.3, isTextBox: true, margin: 0, fontSize: 10, color: K.accent4 });
  }

  /* ---- 7. los dos formatos ---- */
  sec(L === 'es' ? 'Los formatos' : 'The formats');
  const SEC3 = L === 'es' ? 'Los formatos' : 'The formats';
  {
    const s = claro(SEC3);
    eyebrow(s, t.s7eye, true);
    s.addText(t.s7tit.replace('\n', ' '), { x: M, y: 0.9, w: W - M * 2, h: 0.6, isTextBox: true, margin: 0,
      fontFace: 'Outfit', fontSize: 25, bold: true, color: K.dk1 });
    const filas = [t.s7h.map((h, i) => ({ text: h, options: {
      bold: true, color: K.lt2, fill: { color: K.dk1 }, fontFace: 'Outfit', fontSize: 11,
      align: i ? 'center' : 'left', valign: 'middle' } }))];
    t.s7r.forEach((r, ri) => filas.push(r.map((c, i) => ({ text: c, options: {
      color: i ? K.dk1 : K.accent5, bold: ri === t.s7r.length - 1 && i > 0,
      align: i ? 'center' : 'left', valign: 'middle',
      fill: { color: ri % 2 ? K.lt1 : K.lt2 }, fontSize: 11.5 } }))));
    s.addTable(filas, { x: M, y: 1.75, w: W - M * 2, colW: [4.3, 3.77, 3.76],
      rowH: 0.36, border: { type: 'solid', color: K.accent6, pt: 1 }, margin: 6 });
  }

  /* ---- 8. presupuesto afterwork ---- */
  sec(L === 'es' ? 'Afterwork' : 'Afterwork');
  const SEC4 = 'Afterwork';
  {
    const s = claro(SEC4);
    eyebrow(s, t.s8eye, true);
    s.addText(t.s8tit.replace('\n', ' '), { x: M, y: 0.9, w: 8.5, h: 0.6, isTextBox: true, margin: 0,
      fontFace: 'Outfit', fontSize: 25, bold: true, color: K.dk1 });
    parrafo(s, t.s8p, { y: 1.62, w: 11.8, h: 0.75, fontSize: 13 });
    const filas = [t.s8h.map((h, i) => ({ text: h, options: {
      bold: true, color: K.lt2, fill: { color: K.dk1 }, fontFace: 'Outfit', fontSize: 11,
      align: i === 1 ? 'right' : 'left', valign: 'middle' } }))];
    t.s8r.forEach((r, ri) => {
      const ult = ri === t.s8r.length - 1;
      filas.push(r.map((c, i) => ({ text: c, options: {
        color: i === 2 ? K.accent5 : K.dk1, bold: ult || i === 1,
        align: i === 1 ? 'right' : 'left', valign: 'middle',
        fill: { color: ult ? K.accent6 : (ri % 2 ? K.lt1 : K.lt2) }, fontSize: 11.5 } })));
    });
    s.addTable(filas, { x: M, y: 2.6, w: W - M * 2, colW: [3.6, 2.2, 6.03],
      rowH: 0.42, border: { type: 'solid', color: K.accent6, pt: 1 }, margin: 6 });
  }

  /* ---- 9. tres formas de estar ---- */
  {
    const s = claro(SEC4);
    titulo(s, t.s9tit, true, 0.72);
    parrafo(s, t.s9p, { y: 1.55, w: 9.5, h: 0.5, fontSize: 13 });
    const cw = 3.76, cy = 2.3, ch = 3.5;
    t.s9c.forEach(([flag, nom, precio, uni, des], i) => {
      const x = M + i * (cw + 0.3), medio = i === 1;
      tarjeta(s, { x, y: cy, w: cw, h: ch });
      if (medio) s.addShape('rect', { x, y: cy, w: cw, h: ch, fill: { color: 'FBEDE6' }, line: { color: K.accent6, width: 1 } });
      s.addText(flag.toUpperCase(), { x: x + 0.34, y: cy + 0.3, w: cw - 0.68, h: 0.26, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 9.5, bold: true, charSpacing: 1.8, color: K.accent2 });
      s.addText(nom, { x: x + 0.34, y: cy + 0.62, w: cw - 0.68, h: 0.34, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 16, bold: true, color: K.dk1 });
      s.addText(precio, { x: x + 0.34, y: cy + 1.05, w: cw - 0.68, h: 0.6, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 30, bold: true, color: K.dk1 });
      s.addText(uni, { x: x + 0.34, y: cy + 1.66, w: cw - 0.68, h: 0.26, isTextBox: true, margin: 0,
        fontSize: 10.5, color: K.accent5 });
      s.addText(des, { x: x + 0.34, y: cy + 2.0, w: cw - 0.68, h: 1.25, isTextBox: true, margin: 0,
        fontSize: 11.5, lineSpacing: 15, color: K.accent5 });
    });
  }

  /* ---- 10. qué incluye ---- */
  {
    const s = claro(SEC4);
    titulo(s, t.s10tit, true, 0.72);
    const cw = 5.65;
    t.s10l.forEach(([tit, des], i) => {
      const col = i % 2, fila = Math.floor(i / 2);
      const x = M + col * (cw + 0.55), y = 1.95 + fila * 1.45;
      s.addShape('ellipse', { x, y: y + 0.08, w: 0.16, h: 0.16, fill: { color: K.accent2 }, line: { color: K.accent2, width: 0 } });
      s.addText(tit, { x: x + 0.38, y, w: cw - 0.38, h: 0.32, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 14, bold: true, color: K.dk1 });
      s.addText(des, { x: x + 0.38, y: y + 0.33, w: cw - 0.38, h: 0.66, isTextBox: true, margin: 0,
        fontSize: 11.5, lineSpacing: 15, color: K.accent5 });
    });
  }

  /* ---- 11. varios encuentros ---- */
  {
    const s = claro(SEC4);
    eyebrow(s, t.s11eye, true);
    s.addText(t.s11tit.replace('\n', ' '), { x: M, y: 0.9, w: 10.5, h: 0.6, isTextBox: true, margin: 0,
      fontFace: 'Outfit', fontSize: 25, bold: true, color: K.dk1 });
    parrafo(s, t.s11p, { y: 1.62, w: 11.8, h: 0.8, fontSize: 13 });
    const cw = 5.65, ch = 1.6;
    t.s11c.forEach(([nom, ven, des], i) => {
      const col = i % 2, fila = Math.floor(i / 2);
      const x = M + col * (cw + 0.55), y = 2.75 + fila * (ch + 0.3);
      tarjeta(s, { x, y, w: cw, h: ch });
      s.addText(nom, { x: x + 0.38, y: y + 0.26, w: cw - 0.76, h: 0.3, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 15, bold: true, color: K.dk1 });
      s.addText(ven.toUpperCase(), { x: x + 0.38, y: y + 0.62, w: cw - 0.76, h: 0.26, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 9.5, bold: true, charSpacing: 1.8, color: K.accent2 });
      s.addText(des, { x: x + 0.38, y: y + 0.95, w: cw - 0.76, h: 0.5, isTextBox: true, margin: 0,
        fontSize: 11.5, lineSpacing: 15, color: K.accent5 });
    });
  }

  /* ---- 12. tres compromisos ---- */
  {
    const s = claro(SEC4);
    titulo(s, t.s12tit, true, 0.72);
    const cw = 3.76, cy = 2.0, ch = 3.2;
    t.s12c.forEach(([quien, linea, total, nota], i) => {
      const x = M + i * (cw + 0.3), medio = i === 1;
      tarjeta(s, { x, y: cy, w: cw, h: ch });
      if (medio) s.addShape('rect', { x, y: cy, w: cw, h: ch, fill: { color: 'FBEDE6' }, line: { color: K.accent6, width: 1 } });
      s.addText(quien, { x: x + 0.34, y: cy + 0.32, w: cw - 0.68, h: 0.65, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 14, bold: true, lineSpacing: 18, color: K.dk1 });
      s.addText(linea, { x: x + 0.34, y: cy + 1.05, w: cw - 0.68, h: 0.3, isTextBox: true, margin: 0,
        fontSize: 11, color: K.accent5 });
      s.addText(total, { x: x + 0.34, y: cy + 1.45, w: cw - 0.68, h: 0.62, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 28, bold: true, color: K.accent2 });
      s.addText(nota, { x: x + 0.34, y: cy + 2.15, w: cw - 0.68, h: 0.85, isTextBox: true, margin: 0,
        fontSize: 11.5, lineSpacing: 15, color: K.accent5 });
    });
  }

  /* ---- 13. weekend: qué es ---- */
  sec('RevChill Weekend');
  const SEC5 = 'RevChill Weekend';
  {
    const s = claro(SEC5);
    eyebrow(s, t.s13eye, true);
    s.addText(t.s13tit.replace('\n', ' '), { x: M, y: 0.9, w: 11, h: 0.6, isTextBox: true, margin: 0,
      fontFace: 'Outfit', fontSize: 25, bold: true, color: K.dk1 });
    parrafo(s, t.s13p, { y: 1.62, w: 11.8, h: 0.7, fontSize: 13 });
    const cw = 3.76, iy = 2.5, ih = 2.1;
    const fotos = ['wk-ruta.jpg', 'wk-porche.jpg', 'wk-brasa.jpg'];
    t.s13c.forEach(([tit, des], i) => {
      const x = M + i * (cw + 0.3);
      s.addImage({ path: IMG + fotos[i], x, y: iy, w: cw, h: ih });
      s.addText(tit, { x, y: iy + ih + 0.14, w: cw, h: 0.3, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 14, bold: true, color: K.dk1 });
      s.addText(des, { x, y: iy + ih + 0.48, w: cw, h: 0.65, isTextBox: true, margin: 0,
        fontSize: 11.5, lineSpacing: 15, color: K.accent5 });
    });
    s.addText(t.s13nota, { x: M, y: H - 1.05, w: 11.8, h: 0.3, isTextBox: true, margin: 0,
      fontSize: 10.5, bold: true, color: K.accent2 });
  }

  /* ---- 14. weekend: inversión ---- */
  {
    const s = claro(SEC5);
    eyebrow(s, t.s14eye, true);
    s.addText(t.s14tit, { x: M, y: 0.9, w: 11, h: 0.6, isTextBox: true, margin: 0,
      fontFace: 'Outfit', fontSize: 25, bold: true, color: K.dk1 });
    parrafo(s, t.s14p, { y: 1.62, w: 11.8, h: 0.8, fontSize: 13 });
    const cw = 5.65, cy = 2.65, ch = 3.0;
    [[t.s14a, t.s14al, M], [t.s14b, t.s14bl, M + cw + 0.55]].forEach(([tit, items, x]) => {
      tarjeta(s, { x, y: cy, w: cw, h: ch });
      s.addText(tit.toUpperCase(), { x: x + 0.42, y: cy + 0.3, w: cw - 0.84, h: 0.26, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 10.5, bold: true, charSpacing: 1.8, color: K.accent2 });
      lista(s, items, { x: x + 0.42, y: cy + 0.72, w: cw - 0.84, h: ch - 1.0, fontSize: 12 });
    });
  }

  /* ---- 15. weekend: tres formas ---- */
  {
    const s = claro(SEC5);
    titulo(s, t.s15tit, true, 0.72);
    const cw = 3.76, cy = 1.95, ch = 3.1;
    t.s15c.forEach(([flag, nom, precio, uni, des], i) => {
      const x = M + i * (cw + 0.3), medio = i === 1;
      tarjeta(s, { x, y: cy, w: cw, h: ch });
      if (medio) s.addShape('rect', { x, y: cy, w: cw, h: ch, fill: { color: 'FBEDE6' }, line: { color: K.accent6, width: 1 } });
      s.addText(flag.toUpperCase(), { x: x + 0.34, y: cy + 0.3, w: cw - 0.68, h: 0.26, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 9.5, bold: true, charSpacing: 1.8, color: K.accent2 });
      s.addText(nom, { x: x + 0.34, y: cy + 0.62, w: cw - 0.68, h: 0.34, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 16, bold: true, color: K.dk1 });
      s.addText(precio, { x: x + 0.34, y: cy + 1.05, w: cw - 0.68, h: 0.6, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 30, bold: true, color: K.dk1 });
      s.addText(uni, { x: x + 0.34, y: cy + 1.66, w: cw - 0.68, h: 0.26, isTextBox: true, margin: 0,
        fontSize: 10.5, color: K.accent5 });
      s.addText(des, { x: x + 0.34, y: cy + 1.98, w: cw - 0.68, h: 0.95, isTextBox: true, margin: 0,
        fontSize: 11.5, lineSpacing: 15, color: K.accent5 });
    });
    s.addText(t.s15nota, { x: M, y: 5.3, w: 11.8, h: 0.5, isTextBox: true, margin: 0,
      fontSize: 11, lineSpacing: 15, color: K.accent4 });
  }

  /* ---- 16. weekend: qué compras ---- */
  {
    const s = oscuro(SEC5);
    eyebrow(s, t.s16eye, false);
    s.addText(t.s16tit.replace('\n', ' '), { x: M, y: 0.9, w: 11.5, h: 0.6, isTextBox: true, margin: 0,
      fontFace: 'Outfit', fontSize: 25, bold: true, color: K.lt2 });
    parrafo(s, t.s16p, { y: 1.62, w: 11.8, h: 0.8, fontSize: 13, claro: false });
    const cw = 5.65, cy = 2.65, ch = 3.0;
    [[t.s16a, t.s16al, M], [t.s16b, t.s16bl, M + cw + 0.55]].forEach(([tit, items, x]) => {
      tarjeta(s, { x, y: cy, w: cw, h: ch, oscuro: true });
      s.addText(tit.toUpperCase(), { x: x + 0.42, y: cy + 0.3, w: cw - 0.84, h: 0.26, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 10.5, bold: true, charSpacing: 1.8, color: K.accent1 });
      lista(s, items, { x: x + 0.42, y: cy + 0.72, w: cw - 0.84, h: ch - 1.0, fontSize: 12, color: 'D8E3E0' });
    });
  }

  /* ---- 17. en especie ---- */
  sec(L === 'es' ? 'Cómo colaborar' : 'How to work together');
  const SEC6 = L === 'es' ? 'Cómo colaborar' : 'How to work together';
  {
    const s = claro(SEC6);
    eyebrow(s, t.s17eye, true); titulo(s, t.s17tit, true);
    parrafo(s, t.s17p, { y: 1.95, w: 11.8, h: 0.8, fontSize: 13 });
    const cw = 5.65, cy = 2.95, ch = 2.7;
    [[t.s17a, t.s17al, M], [t.s17b, t.s17bl, M + cw + 0.55]].forEach(([tit, items, x]) => {
      tarjeta(s, { x, y: cy, w: cw, h: ch });
      s.addText(tit.toUpperCase(), { x: x + 0.42, y: cy + 0.3, w: cw - 0.84, h: 0.26, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 10.5, bold: true, charSpacing: 1.8, color: K.accent2 });
      lista(s, items, { x: x + 0.42, y: cy + 0.72, w: cw - 0.84, h: ch - 1.0, fontSize: 12 });
    });
  }

  /* ---- 18. a medida ---- */
  {
    const s = claro(SEC6);
    eyebrow(s, t.s18eye, true); titulo(s, t.s18tit, true);
    parrafo(s, t.s18p, { y: 2.42, w: 6.1, h: 1.6 });
    lista(s, t.s18l, { x: 7.1, y: 2.0, w: 5.5, h: 3.5, fontSize: 12.5 });
  }

  /* ---- 19. lo que no vendemos ---- */
  {
    const s = oscuro(SEC6);
    eyebrow(s, t.s19eye, false); titulo(s, t.s19tit, false);
    parrafo(s, t.s19p, { y: 2.35, w: 11.8, h: 0.6, fontSize: 12.5, claro: false });
    const cw = 3.76, ch = 1.45;
    t.s19c.forEach(([tit, des], i) => {
      const col = i % 3, fila = Math.floor(i / 3);
      const x = M + col * (cw + 0.3), y = 3.15 + fila * (ch + 0.25);
      tarjeta(s, { x, y, w: cw, h: ch, oscuro: true });
      s.addText(tit, { x: x + 0.3, y: y + 0.2, w: cw - 0.6, h: 0.42, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 12.5, bold: true, lineSpacing: 15, color: K.lt2 });
      s.addText(des, { x: x + 0.3, y: y + 0.58, w: cw - 0.6, h: 0.72, isTextBox: true, margin: 0,
        fontSize: 10, lineSpacing: 13, color: '9FB5B1' });
    });
  }

  /* ---- 20. hacia dónde va ---- */
  sec(L === 'es' ? 'Cierre' : 'Closing');
  const SEC7 = L === 'es' ? 'Cierre' : 'Closing';
  {
    const s = claro(SEC7);
    eyebrow(s, t.s20eye, true); titulo(s, t.s20tit, true);
    const cw = 5.65, cy = 2.4, ch = 2.35;
    [[t.s20a, t.s20al, M], [t.s20b, t.s20bl, M + cw + 0.55]].forEach(([tit, items, x]) => {
      tarjeta(s, { x, y: cy, w: cw, h: ch });
      s.addText(tit.toUpperCase(), { x: x + 0.42, y: cy + 0.28, w: cw - 0.84, h: 0.26, isTextBox: true, margin: 0,
        fontFace: 'Outfit', fontSize: 10.5, bold: true, charSpacing: 1.8, color: K.accent2 });
      lista(s, items, { x: x + 0.42, y: cy + 0.68, w: cw - 0.84, h: ch - 0.95, fontSize: 12 });
    });
    s.addText(t.s20p, { x: M, y: 5.15, w: 11.8, h: 0.5, isTextBox: true, margin: 0,
      fontFace: 'Outfit', fontSize: 14, bold: true, color: K.dk1 });
  }

  /* ---- 21. quién ha estado ---- */
  {
    const s = oscuro(SEC7);
    eyebrow(s, t.s21eye, false);
    s.addText(t.s21tit.replace('\n', ' '), { x: M, y: 0.9, w: 11.5, h: 0.6, isTextBox: true, margin: 0,
      fontFace: 'Outfit', fontSize: 25, bold: true, color: K.lt2 });
    const marcas = ['tripresale', 'turneo', 'duetto', 'pricepoint', 'the-net-revenue',
      'grupo-batuta', 'radisson', 'yurbban', 'malaga-premium', 'beonx-spark',
      'dataria', 'habyt', 'global-revenue-forum'];
    // Cinco por fila: trece reparte en 5 + 5 + 3 y la última fila se centra.
    const cw = 2.1, chh = 1.05, gx = 0.28, gy = 0.42, y0 = 2.1;
    marcas.forEach((m, i) => {
      const fila = Math.floor(i / 5), enFila = Math.min(5, marcas.length - fila * 5), col = i % 5;
      const anchoFila = enFila * cw + (enFila - 1) * gx;
      const x = (W - anchoFila) / 2 + col * (cw + gx);
      s.addImage({ path: LOGO + m + '.png', x, y: y0 + fila * (chh + gy), w: cw, h: chh, sizing: { type: 'contain', w: cw, h: chh } });
    });
  }

  /* ---- 22. cierre ---- */
  {
    const s = pres.addSlide({ masterName: 'PORTADA', sectionTitle: SEC7 });
    s.addImage({ path: IMG + 'portada-cierre.jpg', x: 0, y: 0, w: W, h: H });
    s.addText(t.s22tit.replace('\n', ' '), { x: M, y: 2.2, w: 9.8, h: 1.5, isTextBox: true, margin: 0,
      fontFace: 'Outfit', fontSize: 34, bold: true, lineSpacing: 42, color: K.lt2 });
    s.addText(t.s22p, { x: M, y: 3.9, w: 8.4, h: 1.3, isTextBox: true, margin: 0,
      fontSize: 14, lineSpacing: 21, color: K.accent3 });
    s.addShape('roundRect', { x: M, y: 5.35, w: 3.1, h: 0.6, rectRadius: 0.3, fill: { color: K.accent1 }, line: { color: K.accent1, width: 0 } });
    s.addText('hola@revchill.org', { x: M, y: 5.35, w: 3.1, h: 0.6, isTextBox: true, margin: 0,
      fontFace: 'Outfit', fontSize: 13.5, bold: true, color: '07211F', align: 'center', valign: 'middle' });
    s.addText(t.s22pie, { x: M, y: H - 0.95, w: 9, h: 0.3, isTextBox: true, margin: 0,
      fontFace: 'Outfit', fontSize: 10.5, bold: true, charSpacing: 1.4, color: K.accent4 });
  }

  await pres.writeFile({ fileName: t.archivo });
  await applyTheme(t.archivo, THEME);
  console.log('escrito', t.archivo);
}

(async () => { await construye('es'); await construye('en'); })();
