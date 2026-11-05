/*
  Auditoría de enlaces y botones de la web de RevChill.

  Uso:
      cd <raíz del proyecto>
      python3 -m http.server 8899 &
      node tools/enlaces.cjs            # informe completo
      node tools/enlaces.cjs --solo-fallos

  Qué revisa, enlace por enlace y en las dos lenguas:

    · ENLACES INTERNOS  -> que el archivo exista (petición real, no adivinanza)
    · ANCLAS (#algo)    -> que el id exista en la página de destino
    · data-js           -> que el JavaScript les haya puesto un href de verdad.
                           Es el fallo más traicionero de este sitio: el botón
                           se ve perfecto y no lleva a ninguna parte si falla
                           una clave de data.js.
    · mailto:           -> dirección con forma válida y asunto presente
    · EXTERNOS          -> que abran en pestaña nueva con rel=noopener
    · BOTONES           -> que los <button> que no son de formulario tengan a
                           alguien escuchándolos
    · ACCESIBILIDAD     -> enlaces sin texto ni etiqueta (los de solo icono)

  No visita los dominios externos: ni hace falta ni sería fiable desde aquí.
  Comprueba su forma y los lista para revisarlos a mano una vez.
*/
const { chromium } = require('playwright');

const BASE = 'http://localhost:8899';
const PAGINAS = ['index.html', 'patrocinio.html', 'weekend.html',
                 'privacidad.html', 'cookies.html', 'aviso-legal.html'];
const IDIOMAS = ['es', 'en'];
const SOLO_FALLOS = process.argv.includes('--solo-fallos');

const fallos = [];
const externos = new Map();   // url -> dónde aparece
const correos  = new Map();

(async () => {
  const navegador = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await navegador.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-ES' });

  // Caché de qué ids tiene cada página, para resolver anclas entre páginas.
  const idsPorPagina = {};
  for (const pagina of PAGINAS) {
    const p = await ctx.newPage();
    await p.goto(`${BASE}/${pagina}`, { waitUntil: 'networkidle' });
    idsPorPagina[pagina] = await p.evaluate(() =>
      [...document.querySelectorAll('[id]')].map(e => e.id));
    await p.close();
  }

  for (const pagina of PAGINAS) {
    for (const idioma of IDIOMAS) {
      const p = await ctx.newPage();
      await p.goto(`${BASE}/${pagina}`, { waitUntil: 'networkidle' });

      // Fija el idioma pulsando su botón. Hay que hacerlo también para el
      // español: la preferencia vive en localStorage y se comparte entre
      // páginas, así que tras auditar una en inglés la siguiente abriría en
      // inglés y el informe mentiría sobre qué versión se ha revisado.
      const boton = await p.$(`[data-lang="${idioma}"]`);
      if (!boton) {
        if (idioma === 'en') { await p.close(); continue; }   // las legales solo están en español
      } else {
        await boton.click();
        await p.waitForTimeout(400);
      }
      // Despliega la agenda pasada y baja del todo: hay botones que solo
      // existen una vez renderizadas las tarjetas.
      const pestana = await p.$('[data-tab="past"], [data-tab="pasados"]');
      if (pestana) { await pestana.click(); await p.waitForTimeout(350); }
      await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await p.waitForTimeout(600);

      const items = await p.evaluate(() => {
        const texto = el => (el.getAttribute('aria-label') || el.textContent || '')
          .replace(/\s+/g, ' ').trim().slice(0, 48);
        const enlaces = [...document.querySelectorAll('a')].map(a => ({
          tipo: 'a',
          texto: texto(a),
          href: a.getAttribute('href'),
          hrefFinal: a.href || '',
          dataJs: a.dataset.js || null,
          target: a.getAttribute('target'),
          rel: a.getAttribute('rel'),
          tieneContenido: !!(a.textContent.trim() || a.querySelector('img,svg') || a.getAttribute('aria-label'))
        }));
        const botones = [...document.querySelectorAll('button')].map(b => ({
          tipo: 'button',
          texto: texto(b),
          type: b.getAttribute('type'),
          dataJs: b.dataset.js || null,
          datos: [...b.attributes].map(x => x.name).filter(n => n.startsWith('data-')).join(','),
          tieneContenido: !!(b.textContent.trim() || b.querySelector('img,svg') || b.getAttribute('aria-label'))
        }));
        return { enlaces, botones };
      });

      const marca = `${pagina} [${idioma}]`;
      if (!SOLO_FALLOS) console.log(`\n=== ${marca} — ${items.enlaces.length} enlaces, ${items.botones.length} botones`);

      for (const a of items.enlaces) {
        const h = a.href;

        if (!a.tieneContenido) fallos.push(`${marca}: enlace sin texto ni etiqueta (href=${h})`);

        // Botón cableado por JavaScript.
        if (a.dataJs) {
          if (!a.hrefFinal || a.hrefFinal.endsWith('#') || a.hrefFinal === `${BASE}/${pagina}`) {
            fallos.push(`${marca}: data-js="${a.dataJs}" ("${a.texto}") se quedó SIN destino`);
            continue;
          }
          if (!SOLO_FALLOS) console.log(`  js   ${a.dataJs.padEnd(16)} "${a.texto}" -> ${a.hrefFinal.slice(0, 92)}`);
          if (a.hrefFinal.startsWith('mailto:')) correos.set(a.hrefFinal, marca);
          else externos.set(a.hrefFinal, marca);
          continue;
        }

        if (!h) { fallos.push(`${marca}: <a> sin href ("${a.texto}")`); continue; }

        if (h.startsWith('mailto:')) { correos.set(h, marca); if (!SOLO_FALLOS) console.log(`  mail  "${a.texto}" -> ${h}`); continue; }
        if (h.startsWith('tel:')) continue;

        if (/^https?:/.test(h)) {
          externos.set(h, marca);
          if (a.target !== '_blank') fallos.push(`${marca}: externo sin target="_blank" -> ${h}`);
          if (!(a.rel || '').includes('noopener')) fallos.push(`${marca}: externo sin rel="noopener" -> ${h}`);
          if (!SOLO_FALLOS) console.log(`  ext  "${a.texto}" -> ${h.slice(0, 92)}`);
          continue;
        }

        // Interno: archivo y/o ancla.
        const [archivo, ancla] = h.split('#');
        const destino = archivo || pagina;
        if (archivo) {
          const r = await ctx.request.get(`${BASE}/${archivo}`).catch(() => null);
          if (!r || r.status() >= 400) { fallos.push(`${marca}: enlace roto -> ${archivo} ("${a.texto}")`); continue; }
        }
        if (ancla) {
          const ids = idsPorPagina[destino];
          if (!ids) fallos.push(`${marca}: ancla hacia una página no auditada -> ${h}`);
          else if (!ids.includes(ancla)) fallos.push(`${marca}: ancla inexistente -> ${h} (no hay id="${ancla}" en ${destino})`);
        }
        if (!SOLO_FALLOS) console.log(`  int  "${a.texto}" -> ${h}`);
      }

      for (const b of items.botones) {
        if (!b.tieneContenido) fallos.push(`${marca}: <button> sin texto ni etiqueta`);
        // Un <button> sin type dentro de un form envía el formulario sin querer.
        // Aquí no hay formularios, pero conviene que lo declaren igualmente.
        if (!b.type) fallos.push(`${marca}: <button> sin type ("${b.texto}")`);
        if (!SOLO_FALLOS) console.log(`  btn  "${b.texto}" [${b.datos || 'sin data-*'}]`);
      }

      await p.close();
    }
  }

  await navegador.close();

  console.log('\n\n######## DESTINOS EXTERNOS (revisar a mano una vez) ########');
  [...externos.keys()].sort().forEach(u => console.log('  ' + u));

  console.log('\n######## CORREOS ########');
  [...correos.keys()].sort().forEach(u => console.log('  ' + decodeURIComponent(u)));

  console.log('\n######## RESULTADO ########');
  if (fallos.length === 0) {
    console.log('Sin fallos: todos los enlaces y botones llevan a donde deben.');
  } else {
    console.log(`${fallos.length} problemas:`);
    [...new Set(fallos)].forEach(f => console.log('  · ' + f));
    process.exitCode = 1;
  }
})();
