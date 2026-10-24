# Acency · página web

Landing de [Acency](https://play.google.com/store/apps/details?id=com.servicios.acency), la app mexicana que conecta hogares con especialistas verificados: plomería, electricidad, impermeabilización, pintura, jardinería, gas, mudanzas y más.

Sitio estático, sin build ni dependencias.

```
index.html            Marcado, metadatos y datos estructurados (SEO)
css/styles.css        Estilos (original + agregados)
js/main.js            Interacciones y animaciones
js/vendor/qrcode.min.js  Generador de QR (MIT)
assets/               Logos, ícono y capturas de la app
CLAUDE.md             Guía del proyecto para Claude
```

## Ver en local

```bash
python3 -m http.server 8000
```

Abre http://localhost:8000.

## Qué incluye

- Intro animada, navegación con indicador de sección y menú móvil.
- Hero con parallax, rejilla que se ilumina bajo el puntero y aviso de ofertas en vivo.
- Cinta de servicios que reacciona a la velocidad del scroll.
- Manifiesto cuyas palabras se encienden al bajar.
- Buscador "¿Qué te pasa en casa?" que sugiere el especialista y detecta urgencias.
- **Demo interactiva** de la app: pedir, comparar ofertas, seguimiento en vivo, código de seguridad, pago retenido, garantía y calificación mutua, con recorrido automático.
- Sección de seguridad con animaciones (pago protegido, código, garantía de hasta 30 días, chat privado, reseñas de ambos lados).
- Preguntas frecuentes con búsqueda, filtros y apertura suave.
- QR para descargar en Google Play, aviso de privacidad y términos en un modal, botón para recomendar la app.
- Respeta `prefers-reduced-motion` y funciona de 320 px en adelante.

Para cambiar el enlace de Google Play, edita `PLAY_URL` al inicio de `js/main.js`.
