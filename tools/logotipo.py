#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera el kit de logotipos de RevChill a partir del símbolo que vive dentro
de index.html, que es la única versión canónica que hay.

    python3 tools/logotipo.py

Saca el SVG en cuatro variantes de color más los PNG a varios tamaños, y
un par de composiciones cuadradas para fotos de perfil. El SVG es el que
hay que usar siempre que el sitio lo acepte: es vectorial, pesa nada y se
puede ampliar a una lona de diez metros sin perder un pelo de nitidez.
"""
import re, pathlib, subprocess, sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SAL = RAIZ.parent / "logos-revchill"
SAL.mkdir(exist_ok=True)

TINTA   = "#0E3334"   # verde RevChill
NARANJA = "#FF7A4D"   # naranja de marca
CREMA   = "#F2F4EA"

# --- 1. sacar el símbolo de la web -----------------------------------------
html = (RAIZ / "index.html").read_text(encoding="utf-8")
m = re.search(r'<symbol id="rc-logo" viewBox="([^"]+)">(.*?)</symbol>', html, re.S)
if not m:
    sys.exit("No se encuentra el símbolo rc-logo en index.html")
viewbox, cuerpo = m.group(1), m.group(2)

# En la web el trazo naranja se pinta con var(--accent) y las letras con
# currentColor. Fuera de la web eso no existe, así que se fija el color.
def pinta(letras, trazo):
    c = cuerpo.replace('fill="currentColor"', f'fill="{letras}"')
    c = c.replace('stroke="var(--accent)"', f'stroke="{trazo}"')
    return c

VARIANTES = {
    "revchill-color-sobre-oscuro": (CREMA, NARANJA,
        "Letras crema y trazo naranja. La principal: para fondos oscuros."),
    "revchill-color-sobre-claro":  (TINTA, NARANJA,
        "Letras verde tinta y trazo naranja. Para fondos claros."),
    "revchill-blanco":             ("#FFFFFF", "#FFFFFF",
        "Todo blanco, de una tinta. Para fondos de color o fotografías."),
    "revchill-negro":              ("#000000", "#000000",
        "Todo negro, de una tinta. Para prensa, sellos y faxes del siglo pasado."),
}

ANCHOS = [600, 1200, 2400, 4800]

def svg(letras, trazo, ancho=None):
    dims = f' width="{ancho}" height="{round(ancho * 154.0 / 454.9)}"' if ancho else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}"{dims} '
            f'role="img" aria-label="RevChill">\n<title>RevChill</title>\n'
            f'{pinta(letras, trazo)}\n</svg>\n')

hechos = []
for nombre, (letras, trazo, _) in VARIANTES.items():
    d = SAL / f"{nombre}.svg"
    d.write_text(svg(letras, trazo), encoding="utf-8")
    hechos.append(d)

# --- 2. PNG con fondo transparente -----------------------------------------
try:
    import cairosvg
except ImportError:
    subprocess.run([sys.executable, "-m", "pip", "install", "cairosvg",
                    "--break-system-packages", "-q"], check=True)
    import cairosvg

for nombre, (letras, trazo, _) in VARIANTES.items():
    for a in ANCHOS:
        d = SAL / f"{nombre}-{a}px.png"
        cairosvg.svg2png(bytestring=svg(letras, trazo, a).encode("utf-8"),
                         write_to=str(d), output_width=a)
        hechos.append(d)

# --- 3. cuadrados para foto de perfil --------------------------------------
# Un logotipo horizontal dentro de un círculo de red social se ve diminuto.
# Estas dos piezas resuelven ese caso concreto sin inventar un isotipo que
# la marca no tiene.
def cuadrado(fondo, letras, trazo, radio):
    # el logotipo ocupa el 68 % del ancho y va centrado
    esc = 0.68
    vb = [float(x) for x in viewbox.split()]
    w, h = vb[2], vb[3]
    k = (1000 * esc) / w
    tx = (1000 - w * k) / 2 - vb[0] * k
    ty = (1000 - h * k) / 2 - vb[1] * k
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" '
            f'role="img" aria-label="RevChill">\n<title>RevChill</title>\n'
            f'<rect width="1000" height="1000" rx="{radio}" fill="{fondo}"/>\n'
            f'<g transform="translate({tx:.2f},{ty:.2f}) scale({k:.5f})">'
            f'{pinta(letras, trazo)}</g>\n</svg>\n')

CUADRADOS = {
    "revchill-cuadrado-verde":  (TINTA, CREMA, NARANJA, 0,
        "Cuadrado con fondo verde. Para avatar de LinkedIn, Instagram o WhatsApp."),
    "revchill-redondeado-verde": (TINTA, CREMA, NARANJA, 180,
        "El mismo con las esquinas redondeadas, por si el sitio no las redondea solo."),
    "revchill-cuadrado-crema":  (CREMA, TINTA, NARANJA, 0,
        "Versión clara del cuadrado, para fondos oscuros o impresos."),
}
for nombre, (fondo, letras, trazo, radio, _) in CUADRADOS.items():
    (SAL / f"{nombre}.svg").write_text(cuadrado(fondo, letras, trazo, radio), encoding="utf-8")
    hechos.append(SAL / f"{nombre}.svg")
    for a in (512, 1024, 2048):
        d = SAL / f"{nombre}-{a}px.png"
        cairosvg.svg2png(bytestring=cuadrado(fondo, letras, trazo, radio).encode("utf-8"),
                         write_to=str(d), output_width=a, output_height=a)
        hechos.append(d)

# --- 4. favicon y marca de agua --------------------------------------------
(SAL / "revchill-favicon.svg").write_text(
    (RAIZ / "assets/img/favicon.svg").read_text(encoding="utf-8"), encoding="utf-8")
hechos.append(SAL / "revchill-favicon.svg")

print(f"{len(hechos)} archivos en {SAL}")
for d in sorted(hechos):
    print(f"  {d.name:44} {d.stat().st_size//1024:>5} KB")
