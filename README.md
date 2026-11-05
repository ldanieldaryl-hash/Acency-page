# Acency · página web

Landing de [Acency](https://play.google.com/store/apps/details?id=com.servicios.acency), la app mexicana que conecta hogares con especialistas verificados: plomero, electricista, desazolve, impermeabilización, gas, albañil, pintor, herrero, carpintero, jardinero, cisternas, mudanzas, armado de muebles, mandados y paseador de perros.

Sitio estático: se sube tal cual a cualquier hosting. Sin build ni dependencias.

```
index.html                 Página principal (CSS y JS van dentro)
plomero/ electricista/ …   Una página por oficio (15), pensadas para Google y para anuncios
404.html                   Página de "no encontrada"
stripe/return|refresh/     Regreso del alta de pagos de especialistas (la app abre esas rutas)
sitemap.xml  robots.txt    Para Google
site.webmanifest           Ícono y colores al guardar la página en el celular
js/anuncios.js             ← AQUÍ va el ID de Google Ads (un solo lugar para todo el sitio)
js/oficio.js               Lógica de las páginas de oficio
js/vendor/qrcode.min.js    Generador de QR (MIT)
assets/                    Logos, capturas de la app e imagen para compartir (og-acency.jpg)
herramientas/              Scripts opcionales: generar páginas y cambiar de dominio
```

## Ver en local

```bash
python3 -m http.server 8000
```

Abre http://localhost:8000 (y http://localhost:8000/plomero/, etc.).

## Publicar en tu dominio

El sitio ya está preparado para **https://acencyservicios.com** (el dominio que usa la app). Si vas a usar otro, cámbialo en todos los archivos con un solo comando:

```bash
python3 herramientas/dominio.py https://www.tudominio.com
```

Después sube la carpeta completa a cualquiera de estos (todos tienen plan gratis y HTTPS):

- **Cloudflare Pages o Netlify:** arrastra la carpeta del repo, o conéctalos a este repo de GitHub. Luego agrega tu dominio en su panel.
- **GitHub Pages:** Settings → Pages → rama `main`, carpeta `/` y escribe tu dominio en *Custom domain*.
- **Firebase Hosting:** el mismo proyecto de la app ya usa Hosting para los documentos legales; se puede crear otro sitio para la página.

> Si apuntas `acencyservicios.com` a esta página, las rutas `/stripe/return` y `/stripe/refresh` ya existen aquí, así el alta de pagos de los especialistas no cae en un error 404.
>
> La app también comparte enlaces `acencyservicios.com/r/ACY-…` (invitaciones) y `/p/…` (promociones). La `404.html` los reconoce y muestra el código para copiar y el botón de Google Play. **Antes de cambiar el hosting**, copia el archivo `/.well-known/assetlinks.json` que tenga hoy el dominio (o descárgalo de Play Console → Integridad de la app → Vinculación de apps) a la carpeta `.well-known/` de este repo: sin él, Android no abre la app directo desde esos enlaces.

## Google Ads (antes de poner dinero)

1. En Google Ads crea la conversión **"Clic a Google Play"** (tipo: clic en enlace / página web).
2. Abre `js/anuncios.js` y pega el ID (`AW-…`) y la etiqueta de la conversión. Vale para todas las páginas.
3. Usa como **URL final** de cada grupo de anuncios la página de su oficio. Así el anuncio, la palabra clave y la página dicen lo mismo (sube el Nivel de calidad y baja el costo por clic):

| Grupo de anuncios | URL final |
|---|---|
| Plomero | `/plomero/` |
| Electricista | `/electricista/` |
| Drenaje tapado / desazolve | `/desazolve/` |
| Impermeabilización | `/impermeabilizacion/` |
| Instalación de gas | `/instalacion-de-gas/` |
| Albañil | `/albanil/` |
| Pintor | `/pintor/` |
| Herrero | `/herrero/` |
| Carpintero | `/carpintero/` |
| Jardinero | `/jardinero/` |
| Cisternas y tinacos | `/limpieza-de-cisternas/` |
| Mudanzas | `/mudanzas/` |
| Armado de muebles | `/armado-de-muebles/` |
| Mandados y filas | `/mandados/` |
| Paseador de perros | `/paseador-de-perros/` |

La página principal también acepta `?servicio=plomeria` (y los demás oficios) y cambia el titular según el anuncio. La fuente del anuncio (`gclid`, `utm_*`) viaja a Google Play en el `referrer`, y Play Console la muestra en *Adquisición de usuarios*.

## Para aparecer en Google (fuera del código)

1. **Google Search Console:** agrega el dominio, verifícalo por DNS y envía `https://tudominio.com/sitemap.xml`.
2. **Perfil de Negocio de Google (Google Maps):** es lo que más pesa en búsquedas "cerca de mí". Créalo como negocio *de área de servicio* (sin mostrar dirección), con categorías de servicios del hogar, tus zonas, horario, fotos y el enlace a esta página. Pide reseñas y respóndelas.
3. **Misma información en todos lados:** nombre, teléfono y página iguales en Google, Facebook, Instagram, TikTok y directorios.
4. **Velocidad:** la página ya carga sin bloquear fuentes, con imágenes WebP y sin scripts de terceros si no hay ID de Ads. Revísala en PageSpeed Insights cuando esté publicada.

## Cambiar textos de las páginas de oficio

Los textos están en `herramientas/oficios.py` (sacados de los formularios reales de la app). Edita y corre:

```bash
python3 herramientas/generar.py
```

Eso regenera las 15 páginas, el `sitemap.xml`, el `robots.txt`, la `404.html` y los datos estructurados del inicio (las preguntas frecuentes se leen de las que se ven en la página).
