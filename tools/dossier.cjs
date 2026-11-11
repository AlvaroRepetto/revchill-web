/*
  Genera el PDF del dossier a partir de partners.html.

  Vive dentro del proyecto para que viaje en el zip: la versión anterior de
  este script se perdió al reiniciarse el entorno y hubo que reescribirla.

  Uso:
      cd <raíz del proyecto>
      python3 -m http.server 8899 &
      node tools/dossier.cjs [ruta/de/salida.pdf]

  Además del PDF, avisa de los dos fallos de maquetación que más cuesta ver
  a ojo en un documento largo: páginas casi en blanco por un salto mal
  colocado, y texto que se sale del ancho útil.
*/
const { chromium } = require('playwright');
const fs = require('fs');

// Admite las dos versiones:  node tools/dossier.cjs [es|en] [salida.pdf]
const IDIOMA = (process.argv[2] === 'en') ? 'en' : 'es';
const PAGINA = IDIOMA === 'en' ? 'partners-en.html' : 'partners.html';
const POR_DEFECTO = IDIOMA === 'en'
  ? '/home/claude/entregables/RevChill-Partner-Dossier-2027-EN.pdf'
  : '/home/claude/entregables/Dossier-RevChill-Partners-2027.pdf';
const SALIDA = process.argv[3] || POR_DEFECTO;
const URL = 'http://localhost:8899/' + PAGINA;

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

  // --- PDF ---
  const ctx = await b.newContext({ colorScheme: 'light' });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.emulateMedia({ media: 'print' });
  await p.waitForTimeout(500);
  await p.pdf({
    path: SALIDA,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true
  });
  const kb = Math.round(fs.statSync(SALIDA).size / 1024);
  console.log(`PDF: ${SALIDA}  (${kb} KB)`);

  // --- Control de maquetación en pantalla ---
  await p.emulateMedia({ media: 'screen' });
  const esc = await p.evaluate(() => {
    const d = document.documentElement;
    const anchas = [...document.querySelectorAll('.wrap > *')]
      .filter(e => e.scrollWidth > e.clientWidth + 2)
      .map(e => e.className || e.tagName);
    return { alto: d.scrollHeight, desborde: d.scrollWidth - d.clientWidth, anchas };
  });
  console.log(`pantalla: alto ${esc.alto}px, desborde ${esc.desborde}px` +
              (esc.anchas.length ? `, elementos que se salen: ${esc.anchas.join(', ')}` : ''));

  // --- Control en móvil ---
  const m = await b.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(URL, { waitUntil: 'networkidle' });
  const mov = await m.evaluate(() => {
    const d = document.documentElement;
    return { alto: d.scrollHeight, desborde: d.scrollWidth - d.clientWidth };
  });
  console.log(`móvil: alto ${mov.alto}px, desborde horizontal ${mov.desborde}px`);
  if (mov.desborde > 0) console.log('  ¡OJO! el dossier desborda en móvil');

  await b.close();
})();
