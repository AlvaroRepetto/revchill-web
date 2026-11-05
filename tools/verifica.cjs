/*
  Verificador de la web de RevChill.
  Vive dentro del proyecto a propósito: si el entorno se reinicia, viaja
  dentro del zip y no hay que reescribirlo.

  Uso:
      cd <raíz del proyecto>
      python3 -m http.server 8899 &        # hace falta un servidor: file://
      node tools/verifica.cjs              # rompe los módulos y el fetch

  Comprueba, en cada página y en tres anchuras:
    · desbordamiento horizontal (la causa número uno de que una web
      se vea mal en móvil, y la que menos se nota en el escritorio)
    · elementos con data-i18n vacíos, que delatan una clave que falta
    · imágenes rotas o que no cargan
    · enlaces internos que apuntan a un archivo que no existe
    · peticiones a dominios de terceros, que deben ser cero
    · que la home no enlace a la página despublicada del Weekend
*/
const { chromium } = require('playwright');

const BASE = 'http://localhost:8899';
const PAGINAS = ['index.html', 'patrocinio.html', 'weekend.html',
                 'privacidad.html', 'cookies.html', 'aviso-legal.html'];
const ANCHURAS = [[1280, 'escritorio'], [820, 'tableta'], [390, 'móvil']];

(async () => {
  const navegador = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const problemas = [];
  const enlacesVistos = new Set();

  for (const pagina of PAGINAS) {
    for (const [ancho, nombreAncho] of ANCHURAS) {
      const p = await navegador.newPage({ viewport: { width: ancho, height: 900 }, locale: 'es-ES' });
      const externas = [];
      p.on('request', r => {
        const u = r.url();
        if (!u.startsWith(BASE) && !u.startsWith('data:')) externas.push(u);
      });

      await p.goto(`${BASE}/${pagina}`, { waitUntil: 'networkidle' });
      // Baja del todo para disparar las imágenes diferidas y los reveal.
      await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await p.waitForTimeout(700);

      const r = await p.evaluate(() => {
        const d = document.documentElement;
        const vacios = [...document.querySelectorAll('[data-i18n]')]
          .filter(e => !e.textContent.trim() && !e.querySelector('img,svg')).length;
        // La <img> del visor de fotos nace sin src y se rellena al abrirlo,
        // así que una imagen sin src no es un fallo: es una que aún no toca.
        const rotas = [...document.images]
          .filter(i => i.getAttribute('src'))
          .filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute('src'));
        const enlaces = [...document.querySelectorAll('a[href]')]
          .map(a => a.getAttribute('href'))
          .filter(h => h && !/^(https?:|mailto:|tel:|#)/.test(h));
        return {
          desborde: d.scrollWidth - d.clientWidth,
          vacios, rotas, enlaces,
          fondo: getComputedStyle(document.body).backgroundColor
        };
      });

      if (r.desborde > 0) problemas.push(`${pagina} @${nombreAncho}: desborda ${r.desborde}px a lo ancho`);
      if (r.vacios > 0)   problemas.push(`${pagina} @${nombreAncho}: ${r.vacios} elementos data-i18n sin texto`);
      for (const src of r.rotas) problemas.push(`${pagina} @${nombreAncho}: imagen rota ${src}`);
      for (const u of externas)  problemas.push(`${pagina} @${nombreAncho}: petición a un tercero ${u}`);
      for (const h of r.enlaces) enlacesVistos.add(`${pagina}|${h}`);

      console.log(`ok   ${pagina.padEnd(18)} ${nombreAncho.padEnd(11)} desborde:${r.desborde} i18n:${r.vacios} fondo:${r.fondo}`);
      await p.close();
    }
  }

  // Enlaces internos: que el archivo exista de verdad.
  const comprobador = await navegador.newPage();
  for (const entrada of enlacesVistos) {
    const [pagina, href] = entrada.split('|');
    const destino = href.split('#')[0];
    if (!destino) continue;
    const resp = await comprobador.goto(`${BASE}/${destino}`, { waitUntil: 'commit' }).catch(() => null);
    if (!resp || resp.status() >= 400) problemas.push(`${pagina}: enlace roto a ${destino}`);
  }

  // La página del Weekend está despublicada: la home no debe enlazarla.
  const home = await navegador.newPage();
  await home.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  const fugas = await home.evaluate(() =>
    [...document.querySelectorAll('a[href*="weekend.html"]')].length);
  if (fugas > 0) problemas.push(`index.html: ${fugas} enlaces a weekend.html, que está despublicada`);

  await navegador.close();

  console.log('');
  if (problemas.length === 0) {
    console.log('== TODO CORRECTO ==');
  } else {
    console.log(`== ${problemas.length} PROBLEMAS ==`);
    problemas.forEach(x => console.log('   ' + x));
    process.exitCode = 1;
  }
})();
