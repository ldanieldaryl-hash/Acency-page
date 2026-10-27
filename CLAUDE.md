# CLAUDE.md · Acency Page

Lee esto antes de hacer cualquier cosa. Está pensado para que no trabajes de más, gastes poco contexto y no te equivoques de proyecto.

## 1. Qué es este repositorio (y qué NO es)

- **Este repo es solo la página web (landing) de Acency.** Sitio estático: un solo `index.html` (CSS y JS van dentro), `assets/` y `js/vendor/qrcode.min.js`. Sin build, sin npm, sin framework.
- **La versión principal es el artifact** https://claude.ai/artifact/9cxfU2MQPDk69HMwFSyGD1 (decisión del dueño, oct 2026). Este repo es su **copia exacta** para publicarla en un dominio propio. Trabaja sobre el artifact y, al terminar, copia el resultado aquí (sección 5). Si el artifact y el repo no coinciden, manda el artifact: léelo antes de tocar nada.
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

`index.html` mide ≈4,300 líneas. Busca la sección con `grep -n` y lee solo ese rango. Va en este orden:

1. **`<head>` y SEO** (líneas 1–100): título, metas, JSON-LD (LocalBusiness, MobileApplication, FAQPage).
2. **`<style>`** · marcadores `/* ---------- Nombre ---------- */`. Al final, bloque `Fase 2 (oct 2026)` con lo agregado: cinta, WebP, sello Gratis, Acency te salva, Como siempre / con Acency, barra fija, videos, demo fiel a la app. Después, `Fase 3 (oct 2026)`: correcciones de diseño (`[hidden]` siempre oculta, panorama en 3 tarjetas completas, botón "volver arriba" que no tapa en celular).
3. **HTML** · marcadores `<!-- ============ NOMBRE ============ -->`: BARRA SUPERIOR, MENÚ, INICIO, CINTA DE SERVICIOS, VISTA 1 · CLIENTES (app, manifiesto, Acency te salva, servicios, cómo funciona, videos, demo, como siempre / con Acency, seguridad, pagos y garantía), VISTA 2 · ESPECIALISTAS (únete, herramientas, cómo unirte, tutoriales, ayuda), SECCIONES COMPARTIDAS (nosotros, descargar, novedades y redes, preguntas), pie y modal legal.
4. **`<script>`** · un IIFE. Arriba: `PLAY_URL`, Google Ads (`ADS_ID`, `ADS_LABEL`, `PLAY_LINK`), `VIDEOS`, `SERVICIOS` (titulares por oficio). Luego bloques `/* ================= Nombre ================= */` (inicio, vistas, menú, revelado, scroll) y módulos `/* ---------- Nombre ---------- */` (buscador, demo, seguridad, FAQ, legales, videos, cinta, manifiesto, barra fija).
- `js/vendor/qrcode.min.js` · librería de QR (MIT, Kazuhiko Arase). No la edites.

## 3. Lo importante del proyecto

- **Enlace de Google Play:** ficha oficial `https://play.google.com/store/apps/details?id=com.servicios.acency`. Vive en la constante `PLAY_URL` al inicio del `<script>`, en los `href` con `data-play` del HTML (respaldo sin JS) y en `url`/`installUrl` del JSON-LD `MobileApplication`. Si cambia, actualiza los tres. Los botones y el QR usan `PLAY_LINK` (= `PLAY_URL` + `referrer` con la fuente del anuncio).
- **Identidad visual (no la cambies):** `--ink #0a0a0a`, `--mint #1aecd1`, `--mint-deep #0b7a6d`, `--paper #efefee`, `--white`. Tipos: *Plus Jakarta Sans* (texto/títulos) y *DM Mono* (etiquetas). Capítulos alternos tinta / papel / menta. Un solo tema claro (es intencional).
- **Preferencia del dueño:** "no cambies lo que ya está, mejóralo". Agrega, no reemplaces. Los estilos nuevos van al final del `<style>`.
- **Datos de ejemplo:** la demo y el bento usan nombres y precios de ejemplo, marcados como "Simulación · datos de ejemplo". No inventes cifras reales (usuarios, servicios hechos, calificación promedio) ni testimonios presentados como reales.
- **Documentos legales:** el texto completo está dentro de la app (sección *Reglamentario*). El pie abre un modal (`#legalModal`, objeto `LEGAL` en el `<script>`) con lo esencial. Si algún día hay URLs públicas, enlázalas ahí.
- **SEO:** JSON-LD (LocalBusiness, MobileApplication, FAQPage) en `<head>`. Si agregas o cambias una pregunta del FAQ, actualiza también el `FAQPage`. `og:image` es relativa: cuando haya dominio, ponla absoluta y agrega `canonical`.
- **Google Ads:** `?servicio=plomeria` (y 14 oficios más, ver `SERVICIOS`) cambia titular, texto, buscador y demo para que coincidan con el anuncio; también vale `#plomeria`. La conversión "clic a Google Play" se activa con `ADS_ID` y `ADS_LABEL`. **El artifact no recibe el `?query` ni carga la etiqueta de Google**: los anuncios deben apuntar a la copia de este repo publicada en un dominio propio.
- **Videos:** se configuran en `VIDEOS`. `archivo` = MP4 propio en `assets/videos/` (se reproduce en la página); `youtube` = ID (abre YouTube en otra pestaña: el artifact no permite incrustar otros sitios). Vacío = "Próximamente".
- **Movimiento:** todo respeta `prefers-reduced-motion` (estado final estático y legible). Las animaciones pesadas se pausan fuera de pantalla con `IntersectionObserver`. Mantén eso en lo que agregues.

### Cómo funciona Acency (fuente de verdad para los textos)

Conecta a personas que necesitan algo en casa con especialistas de confianza, desde el celular. El cliente cuenta qué pasa (con fotos y hasta un video) y elige el tipo de atención: **Urgente** (prioritaria, solo hoy o mañana) o **Agendar** (tiempo estándar). **El cliente no elige la fecha:** el día, la hora de llegada y la duración vienen en cada oferta. Llegan **ofertas de especialistas cercanos** con precio, calificación (o la etiqueta *Nuevo*), materiales, garantía y hora de vencimiento; el cliente compara las veces que quiera antes de aceptar. **Seguimiento en tiempo real** (En camino → En tu puerta → Trabajando → Verificando). Al llegar, el cliente le da un **código de seguridad de 6 caracteres** que solo él tiene en pantalla. **Cada oferta trae su garantía** (el especialista decide los días, máximo 30); si algo no quedó bien, regresa a corregirlo sin costo. Si se paga con **tarjeta, Acency retiene el pago** hasta que el cliente confirma. Todo pasa por el **chat de la app** (sin compartir teléfono ni correo). Al final **se califican los dos** y las reseñas se publican cuando ambos calificaron; quedan en el perfil del especialista. Hoy el cliente solo puede pedir **Hogar** (oficios y favores); **Belleza está oculta al cliente** y se lanza después (`kCategoriasOcultasCliente` en la app): en la página va como *muy pronto*. Cotizar es gratis; la solicitud dura 20 h. App para Android.

El flujo detallado (con archivos de la app) y el plan vigente de la página están en el documento *Plan · Página de Acency que convierte*: https://claude.ai/artifact/3rGQUb8969eV9cVks4M7DS

## 4. Probar cambios

```bash
python3 -m http.server 8000   # y abre http://localhost:8000
```

En sesiones en la nube hay Chromium + Playwright (`require('playwright')`). Revisa al menos 320, 390, 768 y 1440 px: sin scroll horizontal, sin errores en consola, y la demo completa (Pide → Califica).

## 5. Artifact (versión principal) y copia en el repo

Artifact: https://claude.ai/artifact/9cxfU2MQPDk69HMwFSyGD1. Lee siempre la versión publicada antes de editar (puede tener cambios hechos fuera del repo).

- **Del repo al artifact:** el artifact pone su propio esqueleto, así que se publica el contenido sin las 5 primeras líneas (`<!doctype>`, `<html>`, `<head>`, metas charset/viewport) ni el cierre `</body></html>`, y con `<title>Acency</title>` (el título del artifact no cambia). Los archivos de `assets/` y `js/vendor/` van en las mismas rutas.

```bash
python3 - <<'EOF'
s = open('index.html', encoding='utf-8').read()
s = s.split('\n', 5)[5].rsplit('</body>', 1)[0]
s = s.replace('<title>Acency · Plomero, electricista y más a domicilio · Cotiza gratis</title>', '<title>Acency</title>', 1)
open('/tmp/acency-artifact.html', 'w', encoding='utf-8').write(s)
EOF
```

- **Del artifact al repo:** el contenido publicado, con esa cabecera de 5 líneas, el título largo para Google y `</body></html>` al final.

## 6. Git

Trabaja en la rama que te asignen, commits descriptivos en español. No hagas push a otra rama ni abras PR sin que el usuario lo pida.
