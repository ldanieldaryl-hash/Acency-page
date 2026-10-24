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
- **Comparador** "por tu cuenta vs Acency" con interruptor.
- **Calculadora de esfuerzo** que usa los propios números del visitante (sin estadísticas inventadas).
- **Centro de transparencia**: qué ya está disponible y qué sigue en desarrollo.
- **Perfil del especialista con reseñas** dentro de la demo: toca "Ver perfil y reseñas" en una oferta para abrir el perfil (reseñas con filtro por estrellas, proyectos, promociones y "Contratar ahora").
- **Novedades y comunidad**: canal de WhatsApp, Instagram, TikTok, Facebook y lista de acceso anticipado (cliente/especialista) con consentimiento.
- Espacio de **tutoriales para especialistas** ("Próximamente") y CTA de referido que lleva a Google Play.
- Sección de seguridad con animaciones (pago protegido, código, garantía de hasta 30 días, chat privado, reseñas de ambos lados).
- Preguntas frecuentes con búsqueda, filtros y apertura suave.
- QR para descargar en Google Play, aviso de privacidad y términos en un modal, botón para recomendar la app.
- Respeta `prefers-reduced-motion` y funciona de 320 px en adelante.

## Configuración (un solo lugar)

Todo lo editable vive en el objeto **`ACENCY`** al inicio de `js/main.js`:

| Campo | Para qué |
|---|---|
| `PLAY_URL` | Ficha oficial en Google Play (botones, QR y datos SEO). |
| `WHATSAPP_CHANNEL`, `INSTAGRAM`, `TIKTOK`, `FACEBOOK` | Enlaces de redes. Se aplican solos a todo `[data-link="…"]`. |
| `LAUNCH_DATE` | `''` = sin cuenta regresiva. O una fecha real (`'2026-12-01T09:00:00'`, hora de México) para mostrar el contador en Novedades. |
| `FORM_ENDPOINT` | `''` = la lista de acceso anticipado guarda en el navegador y sugiere el canal de WhatsApp. Pon la URL de un Google Apps Script para recibir los registros. |

Si cambias el enlace de Google Play, actualiza también los `href` con `data-play` del HTML (respaldo sin JS) y `url`/`installUrl` del JSON-LD, como indica `CLAUDE.md`.

## Cómo cambiar o agregar imágenes

Las imágenes viven en `assets/` y se referencian por ruta en `index.html`.

- **Reemplazar una imagen existente:** sube un archivo con **el mismo nombre** (p. ej. `assets/shot-cotizaciones.jpg`) y listo, no hay que tocar código. Usa el mismo formato y una proporción parecida para no romper el diseño. Las capturas de teléfono usan 720 × 1558.
- **Orden de las capturas del hero:** en la sección HERO de `index.html`, las tres figuras son, en orden, `shot-servicios.jpg` (ya casi tienes la solución), el teléfono central `shot-cotizaciones.jpg` y `shot-categorias.jpg` (todos los servicios). La galería de la sección Descargar sigue el mismo orden.
- **Agregar una imagen nueva:** colócala en `assets/` y apúntala con `<img src="assets/mi-imagen.jpg" alt="…" width="…" height="…" loading="lazy">`. Indica siempre `width`/`height` reales y un `alt` descriptivo.

## Backend opcional para la lista de acceso anticipado (Google Apps Script)

La lista funciona sin backend (guarda en el navegador). Para recibir los registros por correo o en una hoja de cálculo:

1. Crea una Hoja de cálculo de Google.
2. Extensiones → Apps Script, y pega:

   ```js
   function doPost(e) {
     var sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
     var p = e.parameter;
     sh.appendRow([new Date(), p.name, p.email, p.role, p.source]);
     return ContentService.createTextOutput('ok');
   }
   ```

3. Implementar → Nueva implementación → tipo "Aplicación web", acceso "Cualquier usuario". Copia la URL.
4. Pega esa URL en `ACENCY.FORM_ENDPOINT` en `js/main.js`.

Pide solo nombre y correo, con consentimiento explícito, y respeta la baja. No recopiles datos innecesarios.
