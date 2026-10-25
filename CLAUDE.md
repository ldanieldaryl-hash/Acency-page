# CLAUDE.md · Acency Page

Lee esto antes de hacer cualquier cosa. Está pensado para que no trabajes de más, gastes poco contexto y no te equivoques de proyecto.

## 1. Qué es este repositorio (y qué NO es)

- **Este repo es solo la página web (landing) de Acency.** Sitio estático: `index.html`, `css/styles.css`, `js/main.js`, `assets/`. Sin build, sin npm, sin framework.
- **NO es la app de Acency.** La app móvil, su backend, base de datos, reglas de seguridad (Firestore/Firebase *rules*), notificaciones, pagos dentro de la app y documentos legales de la app viven en **otro repositorio**.

### Cómo decidir a qué proyecto va una petición

| Si el usuario habla de… | Es… | Qué haces |
|---|---|---|
| página, landing, sitio web, "la web de Acency", secciones, animaciones, textos de la página, SEO, botón de Google Play, artifact de la página | **Este repo** | Trabaja aquí. |
| *rules*, reglas, Firebase/Firestore, pantallas de la app, backend, funciones, base de datos, notificaciones, lógica de pagos o de ofertas, código de la app, "Reglamentario" de la app | **La app de Acency** (otro repo) | **No toques este repo.** Dile al usuario que eso es de la app y que esta sesión es de la página. |
| Algo ambiguo o que mezcla web y app | — | Separa las partes y **pregunta** antes de modificar nada. |

### Reglas obligatorias

1. **Nunca modifiques archivos que no correspondan a la petición.** Nada de la app se cambia desde aquí, y nada de la página se cambia desde el repo de la app.
2. **Si la sesión está abierta en otro repositorio** (no `Acency-page`), **avisa al usuario antes de gastar mucho contexto** (leer muchos archivos, explorar carpetas, lanzar agentes). Di en una línea en qué repo estás y qué piensas leer, y espera su confirmación.
3. Si estás en este repo y la petición es de la app: detente, explica que este repo es solo la web y pregunta.

## 2. Ahorra contexto: no leas archivos completos

Los tres archivos son largos (≈1000, 1340 y 1150 líneas). Busca la sección con `grep` y lee solo ese rango.

- `index.html` · marcadores `<!-- ============ NOMBRE ============ -->`: INTRO, NAV, HERO, CINTA DE SERVICIOS, PROPUESTA DE VALOR, MANIFIESTO, SERVICIOS, CÓMO FUNCIONA, DEMO INTERACTIVA, SEGURIDAD, NOSOTROS, ESPECIALISTAS, GOOGLE PLAY, PREGUNTAS, FOOTER, DOCUMENTOS LEGALES.
- `css/styles.css` · marcadores `/* ---------- Nombre ---------- */`. Hasta la línea con `AGREGADOS` está el **CSS original**; debajo, todo lo que se agregó después (arreglos, cinta, buscador, demo, bento, FAQ, modal…).
- `js/main.js` · un solo IIFE. Parte 1 = JS original (intro, nav, pasos, revelado, parallax, cursor, copiar). Debajo de `AGREGADOS`, módulos con marcador `/* ---------- Nombre ---------- */`.
- `js/vendor/qrcode.min.js` · librería de QR (MIT, Kazuhiko Arase). No la edites.

## 3. Lo importante del proyecto

- **Enlace de Google Play:** ficha oficial `https://play.google.com/store/apps/details?id=com.servicios.acency`. Vive en la constante `PLAY_URL` al inicio de `js/main.js`, en los `href` con `data-play` del HTML (respaldo sin JS) y en `url`/`installUrl` del JSON-LD `MobileApplication`. Si cambia, actualiza los tres. El QR de la sección Descargar se genera solo desde `PLAY_URL`.
- **Identidad visual (no la cambies):** `--ink #0a0a0a`, `--mint #1aecd1`, `--mint-deep #0b7a6d`, `--paper #efefee`, `--white`. Tipos: *Plus Jakarta Sans* (texto/títulos) y *DM Mono* (etiquetas). Capítulos alternos tinta / papel / menta. Un solo tema claro (es intencional).
- **Preferencia del dueño:** "no cambies lo que ya está, mejóralo". Agrega, no reemplaces. Los estilos nuevos van debajo de `AGREGADOS`.
- **Datos de ejemplo:** la demo y el bento usan nombres y precios de ejemplo, marcados como "Simulación · datos de ejemplo". No inventes cifras reales (usuarios, servicios hechos, calificación promedio) ni testimonios presentados como reales.
- **Documentos legales:** el texto completo está dentro de la app (sección *Reglamentario*). El pie abre un modal (`#legalModal`, objeto `LEGAL` en `main.js`) con lo esencial. Si algún día hay URLs públicas, enlázalas ahí.
- **SEO:** JSON-LD (LocalBusiness, MobileApplication, FAQPage) en `<head>`. Si agregas o cambias una pregunta del FAQ, actualiza también el `FAQPage`. `og:image` es relativa: cuando haya dominio, ponla absoluta y agrega `canonical`.
- **Movimiento:** todo respeta `prefers-reduced-motion` (estado final estático y legible). Las animaciones pesadas se pausan fuera de pantalla con `IntersectionObserver`. Mantén eso en lo que agregues.

### Cómo funciona Acency (fuente de verdad para los textos)

Conecta a personas que necesitan algo en casa con especialistas de confianza, desde el celular. El cliente cuenta qué pasa (con fotos y hasta un video) y elige el tipo de atención: **Urgente** (prioritaria, solo hoy o mañana) o **Agendar** (tiempo estándar). **El cliente no elige la fecha:** el día, la hora de llegada y la duración vienen en cada oferta. Llegan **ofertas de especialistas cercanos** con precio, calificación (o la etiqueta *Nuevo*), materiales, garantía y hora de vencimiento; el cliente compara las veces que quiera antes de aceptar. **Seguimiento en tiempo real** (En camino → En tu puerta → Trabajando → Verificando). Al llegar, el cliente le da un **código de seguridad de 6 caracteres** que solo él tiene en pantalla. **Cada oferta trae su garantía** (el especialista decide los días, máximo 30); si algo no quedó bien, regresa a corregirlo sin costo. Si se paga con **tarjeta, Acency retiene el pago** hasta que el cliente confirma. Todo pasa por el **chat de la app** (sin compartir teléfono ni correo). Al final **se califican los dos** y las reseñas se publican cuando ambos calificaron; quedan en el perfil del especialista. Hoy el cliente solo puede pedir **Hogar** (oficios y favores); **Belleza está oculta al cliente** y se lanza después (`kCategoriasOcultasCliente` en la app): en la página va como *muy pronto*. Cotizar es gratis; la solicitud dura 20 h. App para Android.

El flujo detallado (con archivos de la app) y el plan vigente de la página están en el documento *Plan · Página de Acency que convierte*: https://claude.ai/artifact/3rGQUb8969eV9cVks4M7DS

## 4. Probar cambios

```bash
python3 -m http.server 8000   # y abre http://localhost:8000
```

En sesiones en la nube hay Chromium + Playwright (`require('playwright')`). Revisa al menos 320, 390, 768 y 1440 px: sin scroll horizontal, sin errores en consola, y la demo completa (Pide → Califica).

## 5. Artifact de la página

La página también vive como artifact: https://claude.ai/artifact/9cxfU2MQPDk69HMwFSyGD1. Para republicarlo, quita `<!doctype>`, `<html>`, `<head>`, `<body>` y los `<meta charset/viewport>` (el artifact pone su propio esqueleto) y publica con los archivos `css/`, `js/` y `assets/` en las mismas rutas.

## 6. Git

Trabaja en la rama que te asignen, commits descriptivos en español. No hagas push a otra rama ni abras PR sin que el usuario lo pida.
