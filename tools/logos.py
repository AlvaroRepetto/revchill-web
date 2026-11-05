#!/usr/bin/env python3
"""
Prepara los logos de partners para el muro de RevChill.

Le das una carpeta con los logos tal y como te los manden (PNG, SVG, WEBP,
JPG) y te devuelve un archivo por marca, todos del mismo tamaño de lienzo y
equilibrados entre sí, listos para `assets/img/sponsors/`.

USO
    python3 tools/logos.py <carpeta_con_logos>

QUÉ RESUELVE

1) EL EQUILIBRIO. Poner todos los logos a la misma altura no funciona: uno
   largo de una línea parece enorme y uno cuadrado parece diminuto. Aquí se
   iguala la masa visual de cada marca, combinando cuánta tinta ocupa con el
   tamaño de su caja. Es lo que hace que un muro parezca ordenado.

2) EL COLOR. El muro va sobre verde oscuro. Un logo negro desaparece, y uno
   gris medio se queda apagado. El script detecta los oscuros y los pasa a
   crema, y los que se quedan a medias los aclara lo justo, mezclando con
   blanco solo lo necesario para que los blancos sigan blancos.

3) EL AIRE SOBRANTE. Muchos archivos traen márgenes transparentes alrededor.
   Si no se recortan, ese logo se dibuja más pequeño que los de al lado sin
   que se entienda por qué.

LO QUE NO ARREGLA

   Un logo vertical con texto diminuto dentro (un sello circular, un escudo)
   no se va a leer a 56 píxeles de alto por mucho que se escale. Para esos,
   pide a la marca su versión horizontal, que casi siempre existe.

REQUISITOS
    pip install pillow cairosvg
"""
import io
import math
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Falta Pillow. Instálalo con:  pip install pillow")

LIENZO_W, LIENZO_H = 1200, 400
MAX_W = int(LIENZO_W * 0.95)
# Alto: se deja generoso porque los logos compactos (un sello, un bloque
# cuadrado) chocan con este tope antes de alcanzar el tamaño de los demás.
MAX_H = int(LIENZO_H * 0.95)
CREMA = (242, 244, 234)
OSCURO = 110        # por debajo de esto, el logo se repinta en crema
APAGADO = 212       # por debajo de esto, se aclara hasta aquí
EXTS = (".png", ".svg", ".webp", ".jpg", ".jpeg")


def carga(ruta):
    if ruta.lower().endswith(".svg"):
        try:
            import cairosvg
        except ImportError:
            sys.exit("Para los SVG hace falta:  pip install cairosvg")
        png = cairosvg.svg2png(url=ruta, output_width=2000)
        return Image.open(io.BytesIO(png)).convert("RGBA")
    return Image.open(ruta).convert("RGBA")


def recorta(im):
    bb = im.getbbox()
    return im.crop(bb) if bb else im


def luminancia(im):
    L, A = im.convert("LA").split()
    px = [v for v, a in zip(L.getdata(), A.getdata()) if a > 120]
    return sum(px) / len(px) if px else 255


def a_crema(im):
    liso = Image.new("RGBA", im.size, CREMA + (0,))
    liso.putalpha(im.split()[3])
    return liso


def aclara(im, objetivo=APAGADO):
    act = luminancia(im)
    if act >= objetivo:
        return im
    k = min(0.62, (objetivo - act) / (255 - act))
    blanco = Image.new("RGBA", im.size, (255, 255, 255, 0))
    blanco.putalpha(im.split()[3])
    return Image.blend(im, blanco, k)


def tinta(im):
    a = im.split()[3]
    return sum(c for v, c in enumerate(a.histogram()) if v > 60)


def slug(nombre):
    base = os.path.splitext(nombre)[0].lower()
    limpio = "".join(c if c.isalnum() else "-" for c in base)
    while "--" in limpio:
        limpio = limpio.replace("--", "-")
    return limpio.strip("-")[:40]


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    origen = os.path.expanduser(sys.argv[1])
    if not os.path.isdir(origen):
        sys.exit("No encuentro la carpeta: " + origen)

    raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    destino = os.path.join(raiz, "assets", "img", "sponsors")
    os.makedirs(destino, exist_ok=True)

    archivos = sorted(f for f in os.listdir(origen)
                      if f.lower().endswith(EXTS) and
                      os.path.isfile(os.path.join(origen, f)))
    if not archivos:
        sys.exit("No hay logos en esa carpeta.")

    piezas = []
    for f in archivos:
        try:
            im = recorta(carga(os.path.join(origen, f)))
        except Exception as e:
            print("  salto %-34s (%s)" % (f, e))
            continue
        nota = ""
        if luminancia(im) < OSCURO:
            im = a_crema(im)
            nota = "era oscuro, pasado a crema"
        piezas.append((slug(f), f, im, tinta(im), nota))

    objetivo_tinta = LIENZO_W * LIENZO_H * 0.105
    objetivo_caja = LIENZO_W * LIENZO_H * 0.33

    print("\n%-26s %-11s %-11s %s" % ("archivo", "original", "en lienzo", "notas"))
    print("-" * 74)
    filas = []

    def mezcla(ancho, alto):
        """Cuánto pesa cada criterio según la forma del logo.

        Un logotipo largo y de trazo fino hay que medirlo por su TINTA, o
        se dibuja gigante. Un sello o un bloque cuadrado hay que medirlo
        por su CAJA: al ser macizo tiene mucha tinta en poco espacio y el
        criterio de tinta lo deja enano. En medio, se mezclan los dos."""
        t = min(1.0, max(0.0, (ancho / alto - 1.2) / 1.8))
        return t * t * (3 - 2 * t)      # transición suave, sin saltos

    for s, f, im, mancha, nota in piezas:
        caja = im.width * im.height
        k_tinta = math.sqrt(objetivo_tinta / mancha) if mancha else 1.0
        k_caja = math.sqrt(objetivo_caja / caja)
        t = mezcla(im.width, im.height)
        k = (k_tinta ** t) * (k_caja ** (1 - t))
        w, h = im.width * k, im.height * k
        k *= min(1.0, MAX_W / w, MAX_H / h)
        w, h = max(1, round(im.width * k)), max(1, round(im.height * k))

        im = aclara(im)
        esc = im.resize((w, h), Image.LANCZOS)
        lienzo = Image.new("RGBA", (LIENZO_W, LIENZO_H), (0, 0, 0, 0))
        lienzo.paste(esc, ((LIENZO_W - w) // 2, (LIENZO_H - h) // 2), esc)
        lienzo.save(os.path.join(destino, s + ".png"), "PNG", optimize=True)

        if h >= MAX_H and w < LIENZO_W * 0.30:
            nota = (nota + " · " if nota else "") + "muy vertical: pide la versión horizontal"
        print("%-26s %4dx%-6d %4dx%-6d %s" % (f[:26], im.width, im.height, w, h, nota))

        filas.append('    { id: "%s", name: "CAMBIA ESTE NOMBRE", tier: "anfitrion",\n'
                     '      logo: "assets/img/sponsors/%s.png", url: "" },' % (s, s))

    print("\n" + "=" * 74)
    print("PEGA ESTO EN  sponsors: [ ... ]  DE assets/js/data.js")
    print("y cambia el name y la url de cada uno")
    print("=" * 74 + "\n")
    print("\n".join(filas))


if __name__ == "__main__":
    main()
