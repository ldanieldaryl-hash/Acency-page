# -*- coding: utf-8 -*-
"""Cambia el dominio del sitio en TODOS los archivos con un solo comando.

Uso (desde la raíz del repo):
    python3 herramientas/dominio.py https://www.tudominio.com

Qué hace:
  1. Guarda el dominio nuevo en herramientas/config.json.
  2. Reemplaza el dominio anterior en index.html (canonical, og:url, og:image,
     datos estructurados), en las páginas de cada oficio, 404.html, sitemap.xml
     y robots.txt.
  3. Vuelve a generar las páginas y el sitemap (herramientas/generar.py).

No toca los enlaces de Google Play, redes sociales ni documentos legales.
"""
import json
import os
import re
import subprocess
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RUTA_CONFIG = os.path.join(RAIZ, 'herramientas', 'config.json')


def main():
    if len(sys.argv) != 2 or not re.match(r'^https?://[a-z0-9.-]+\.[a-z]{2,}(:\d+)?$', sys.argv[1].rstrip('/'), re.I):
        sys.exit('Uso: python3 herramientas/dominio.py https://www.tudominio.com   (sin / al final ni rutas)')
    nuevo = sys.argv[1].rstrip('/')
    config = json.load(open(RUTA_CONFIG, encoding='utf-8'))
    viejo = config['dominio'].rstrip('/')
    if viejo == nuevo:
        sys.exit('El sitio ya usa %s' % nuevo)

    cambiados = []
    for carpeta, _, archivos in os.walk(RAIZ):
        if '/.git' in carpeta or carpeta.endswith('herramientas'):
            continue
        for nombre in archivos:
            if not nombre.endswith(('.html', '.xml', '.txt', '.webmanifest')):
                continue
            ruta = os.path.join(carpeta, nombre)
            texto = open(ruta, encoding='utf-8').read()
            if viejo in texto:
                open(ruta, 'w', encoding='utf-8').write(texto.replace(viejo, nuevo))
                cambiados.append(os.path.relpath(ruta, RAIZ))

    config['dominio'] = nuevo
    json.dump(config, open(RUTA_CONFIG, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    open(RUTA_CONFIG, 'a', encoding='utf-8').write('\n')
    subprocess.check_call([sys.executable, os.path.join(RAIZ, 'herramientas', 'generar.py')])
    print('Dominio cambiado de %s a %s en %d archivos.' % (viejo, nuevo, len(cambiados)))
    print('Siguiente paso: sube el sitio y envía %s/sitemap.xml en Google Search Console.' % nuevo)


if __name__ == '__main__':
    main()
