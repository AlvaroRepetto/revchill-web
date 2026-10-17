#!/usr/bin/env python3
"""
Prepara las fotos de un encuentro para la galería de RevChill.

Le das la carpeta tal cual te la pasa el fotógrafo y te devuelve, por cada
foto, dos versiones ya optimizadas: la miniatura de la rejilla y la grande
que se abre al pulsar. Además te escribe el bloque de código listo para
pegar en assets/js/data.js.

USO
    python3 tools/fotos.py <carpeta_de_origen> <slug-del-evento> "<Ciudad>" "<mes año>"

EJEMPLO
    python3 tools/fotos.py ~/Downloads/fotos-valencia valencia-2027-04 "Valencia" "abr 2027"

Deja las fotos en assets/img/gallery/ y el bloque de código en pantalla.

NOTA SOBRE METADATOS
    Las fotos de móvil llevan dentro la ubicación GPS y el modelo de cámara.
    Este script guarda las copias sin ningún metadato, así que eso no se
    publica. Es una de las razones para no subir nunca el archivo original.

REQUISITOS
    pip install pillow
"""
import os
import sys

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Falta Pillow. Instálalo con:  pip install pillow")

ANCHO_MINI = 760      # lado mayor de la miniatura de la rejilla
ANCHO_GRANDE = 1600   # lado mayor de la versión ampliada
CALIDAD_MINI = 76
CALIDAD_GRANDE = 82
EXTS = (".jpg", ".jpeg", ".png", ".webp", ".heic")


def main():
    if len(sys.argv) < 5:
        sys.exit(__doc__)
    origen, slug, ciudad, cuando = sys.argv[1:5]
    origen = os.path.expanduser(origen)
    if not os.path.isdir(origen):
        sys.exit("No encuentro la carpeta: " + origen)

    raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    destino = os.path.join(raiz, "assets", "img", "gallery")
    os.makedirs(destino, exist_ok=True)

    fotos = sorted(f for f in os.listdir(origen)
                   if f.lower().endswith(EXTS) and
                   os.path.isfile(os.path.join(origen, f)))
    if not fotos:
        sys.exit("No hay fotos en esa carpeta.")

    print("%d fotos en %s\n" % (len(fotos), origen))
    bloque = []

    for i, nombre in enumerate(fotos, 1):
        ruta = os.path.join(origen, nombre)
        try:
            im = Image.open(ruta)
        except Exception as e:
            print("  salto %-34s (%s)" % (nombre, e))
            continue

        # exif_transpose respeta cómo se hizo la foto: sin esto, las
        # verticales de móvil salen tumbadas.
        im = ImageOps.exif_transpose(im).convert("RGB")
        base = "%s-%02d" % (slug, i)

        mini = im.copy()
        mini.thumbnail((ANCHO_MINI, ANCHO_MINI), Image.LANCZOS)
        p_mini = os.path.join(destino, base + "-t.jpg")
        mini.save(p_mini, "JPEG", quality=CALIDAD_MINI,
                  optimize=True, progressive=True)

        grande = im.copy()
        grande.thumbnail((ANCHO_GRANDE, ANCHO_GRANDE), Image.LANCZOS)
        p_grande = os.path.join(destino, base + ".jpg")
        grande.save(p_grande, "JPEG", quality=CALIDAD_GRANDE,
                    optimize=True, progressive=True)

        vertical = im.height > im.width
        print("  %-36s %5dx%-5d  ->  mini %4d KB · grande %4d KB"
              % (nombre, im.width, im.height,
                 os.path.getsize(p_mini) // 1024,
                 os.path.getsize(p_grande) // 1024))

        pie = "RevChill %s · %s" % (ciudad, cuando)
        bloque.append(
            '    { src: "assets/img/gallery/%s-t.jpg",\n'
            '      full: "assets/img/gallery/%s.jpg",\n'
            '      size: "%s",\n'
            '      caption: { es: "%s", en: "%s" } },'
            % (base, base, "tall" if vertical else "wide", pie, pie))

    print("\n" + "=" * 66)
    print("PEGA ESTO DENTRO DE  gallery: [ ... ]  EN assets/js/data.js")
    print("=" * 66 + "\n")
    print("\n".join(bloque))
    print("\nConsejo: no las pegues todas. Quédate con las seis o nueve")
    print("mejores del encuentro y borra del data.js las que sobren.")
    print("Los archivos que no referencies puedes borrarlos de la carpeta.")


if __name__ == "__main__":
    main()
