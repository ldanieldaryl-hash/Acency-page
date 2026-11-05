# -*- coding: utf-8 -*-
"""Genera las páginas por oficio y los archivos de SEO del sitio.

Uso (desde la raíz del repo):   python3 herramientas/generar.py

Qué escribe:
  <oficio>/index.html   una página por servicio (datos en herramientas/oficios.py)
  sitemap.xml           todas las URLs públicas, con el dominio de config.json
  robots.txt            permite todo menos /stripe/ y apunta al sitemap
  404.html              página de "no encontrada" (noindex)
  stripe/return/ y stripe/refresh/   regreso del alta de pagos de especialistas
  index.html            SOLO el bloque <script type="application/ld+json">:
                        Organization, WebSite, MobileApplication y FAQPage (las
                        preguntas se leen de las que se ven en la página, así
                        nunca se desincronizan).

No hace falta correrlo para publicar: lo generado ya está en el repo. Córrelo
cuando cambies textos de oficios.py, agregues una pregunta al FAQ del inicio o
cambies de dominio (eso lo hace herramientas/dominio.py).
"""
import html
import json
import os
import re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = json.load(open(os.path.join(RAIZ, 'herramientas', 'config.json'), encoding='utf-8'))
D = CONFIG['dominio'].rstrip('/')
FECHA = CONFIG['fecha']

import sys
sys.path.insert(0, os.path.join(RAIZ, 'herramientas'))
from oficios import OFICIOS  # noqa: E402

PLAY = 'https://play.google.com/store/apps/details?id=com.servicios.acency'
LEGAL = 'https://acency-legal.web.app'
FUENTES = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap'
POR_SLUG = {o['slug']: o for o in OFICIOS}

e = html.escape


def leer(ruta):
    return open(os.path.join(RAIZ, ruta), encoding='utf-8').read()


def escribir(ruta, texto):
    completa = os.path.join(RAIZ, ruta)
    os.makedirs(os.path.dirname(completa), exist_ok=True)
    with open(completa, 'w', encoding='utf-8') as f:
        f.write(texto)


INDEX = leer('index.html')


def simbolos(ids):
    """Copia los íconos del inicio (una sola fuente de verdad del trazo)."""
    out = []
    for i in ids:
        m = re.search(r'<symbol id="%s".*?</symbol>' % re.escape(i), INDEX, re.S)
        if not m:
            raise SystemExit('Falta el ícono %s en index.html' % i)
        out.append('    ' + m.group(0))
    return ('<svg width="0" height="0" style="position:absolute" aria-hidden="true">\n  <defs>\n'
            + '\n'.join(out) + '\n  </defs>\n</svg>')


def ld(obj):
    return ('<script type="application/ld+json">\n'
            + json.dumps(obj, ensure_ascii=False, indent=1)
            + '\n</script>')


# ---------------------------------------------------------------------------
# Estilos de las páginas de oficio (mismos tokens que el inicio)
# ---------------------------------------------------------------------------
CSS = r"""
:root{--ink:#0a0a0a;--mint:#1aecd1;--mint-deep:#0b7a6d;--paper:#efefee;--white:#fff;--fg:#0a0a0a;--fg-2:#4c5150;--fg-3:#7a7f7e;--line:rgba(10,10,10,.1);--on-ink:#efefee;--on-ink-2:rgba(239,239,238,.68);--on-ink-3:rgba(239,239,238,.42);--on-ink-line:rgba(239,239,238,.12);--f-sans:"Plus Jakarta Sans",ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;--f-mono:"DM Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;--ease:cubic-bezier(.22,1,.36,1);color-scheme:light}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--fg);font-family:var(--f-sans);font-size:1.0625rem;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{max-width:100%;height:auto;display:block}
a{color:inherit;text-decoration:none}
h1,h2,h3,p,ul,ol{margin:0}
ul,ol{padding:0;list-style:none}
h1,h2,h3{text-wrap:balance;font-weight:700}
::selection{background:var(--mint);color:var(--ink)}
:focus-visible{outline:2px solid var(--mint);outline-offset:3px;border-radius:8px}
[hidden]{display:none!important}
button{font:inherit;border:0;cursor:pointer;-webkit-appearance:none;appearance:none}
.wrap{max-width:1180px;margin-inline:auto;padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px))}
.ico{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
.ico-fill{fill:currentColor;stroke:none}
.label{font-family:var(--f-mono);font-size:.75rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--fg-2);display:inline-flex;align-items:center;gap:10px}
.label::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--mint);box-shadow:0 0 0 4px rgba(26,236,209,.18)}
.dark .label{color:var(--on-ink-2)}
.h2{font-size:clamp(1.75rem,3.6vw,2.75rem);line-height:1.08;letter-spacing:-.035em}
.accent{color:var(--mint-deep)}
.dark .accent,.o-hero .accent{color:var(--mint)}
.lead{font-size:clamp(1.0625rem,1.3vw,1.1875rem);color:var(--fg-2);max-width:62ch}
.dark .lead{color:var(--on-ink-2)}
.sec{padding-block:88px}
.sec-head{display:flex;flex-direction:column;gap:16px;max-width:760px;margin-bottom:40px}
.dark{background:var(--ink);color:var(--on-ink)}
.white{background:var(--white)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:54px;padding:0 26px;border-radius:999px;background:var(--mint);color:var(--ink);font-weight:700;font-size:.9375rem;white-space:nowrap;transition:transform .4s var(--ease),box-shadow .4s var(--ease)}
.btn:hover{box-shadow:0 14px 40px -12px rgba(26,236,209,.6);transform:translateY(-1px)}
.btn .ico{width:18px;height:18px}
.btn-dark{background:var(--ink);color:var(--white)}
.btn-dark:hover{box-shadow:0 18px 40px -14px rgba(10,10,10,.6)}
.btn-line{background:transparent;color:var(--on-ink);box-shadow:inset 0 0 0 1px var(--on-ink-line)}
.btn-line:hover{box-shadow:inset 0 0 0 1px var(--mint)}
/* Barra superior */
.o-top{position:sticky;top:0;z-index:50;background:rgba(10,10,10,.92);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);color:var(--on-ink);border-bottom:1px solid var(--on-ink-line)}
.o-top .wrap{display:flex;align-items:center;gap:20px;min-height:64px}
.o-top nav{display:flex;gap:22px;margin-left:auto;font-size:.875rem;color:var(--on-ink-2)}
.o-top nav a:hover{color:var(--mint)}
.o-top .btn{min-height:42px;padding:0 18px;font-size:.875rem;gap:8px}
.o-top .btn .ico{width:15px;height:15px}
@media (max-width:720px){.o-top nav{display:none}.o-top .btn{margin-left:auto}}
/* Inicio de la página */
.o-hero{position:relative;overflow:hidden;background:var(--ink);color:var(--on-ink);padding-block:56px 80px}
.o-hero::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(239,239,238,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(239,239,238,.05) 1px,transparent 1px);background-size:48px 48px;-webkit-mask-image:radial-gradient(ellipse at 70% 0%,#000 20%,transparent 70%);mask-image:radial-gradient(ellipse at 70% 0%,#000 20%,transparent 70%)}
.o-hero::after{content:"";position:absolute;right:-160px;top:-260px;width:640px;height:640px;border-radius:50%;background:radial-gradient(circle,rgba(26,236,209,.26),transparent 62%);pointer-events:none}
.o-hero .wrap{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:56px;align-items:center}
.o-hero-copy{display:flex;flex-direction:column;gap:22px;align-items:flex-start;min-width:0}
.o-hero-img{display:none;margin:0}
@media (min-width:961px){.o-hero-img{display:block;width:280px;border-radius:28px;overflow:hidden;background:#1b1f1e;box-shadow:0 0 0 8px #1b1f1e,0 50px 90px -40px rgba(26,236,209,.55)}.o-hero-img img{width:100%}}
@media (max-width:960px){.o-hero .wrap{grid-template-columns:1fr}}
.crumbs{display:flex;flex-wrap:wrap;gap:8px;font-size:.8125rem;color:var(--on-ink-3)}
.crumbs a{color:var(--on-ink-2)}
.crumbs a:hover{color:var(--mint)}
.o-hero h1{font-size:clamp(2.1rem,5.4vw,4rem);line-height:1.02;letter-spacing:-.045em;font-weight:800;max-width:16ch}
.o-hero .lead{color:var(--on-ink-2)}
.o-cta{display:flex;flex-wrap:wrap;align-items:center;gap:14px 20px}
.o-free{font-size:.875rem;color:var(--on-ink-2)}
.o-free b{display:inline-block;margin-right:8px;padding:3px 10px;border-radius:999px;background:var(--mint);color:var(--ink);font-family:var(--f-mono);font-size:.6875rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase}
.o-promo{display:inline-flex;align-items:center;gap:12px;max-width:100%;padding:8px 16px 8px 8px;border-radius:999px;background:rgba(26,236,209,.08);box-shadow:inset 0 0 0 1px rgba(26,236,209,.35);font-size:.875rem;line-height:1.35}
.o-promo b{flex-shrink:0;padding:5px 10px;border-radius:999px;background:var(--mint);color:var(--ink);font-weight:800}
.o-promo:hover{background:rgba(26,236,209,.16)}
.trust{display:flex;flex-wrap:wrap;gap:10px;margin-top:6px}
.trust li{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--on-ink-line);font-size:.8125rem;color:var(--on-ink-2)}
.trust .ico{width:16px;height:16px;color:var(--mint)}
/* Problemas */
.intro{font-size:1.0625rem;color:var(--fg-2);max-width:70ch;margin-top:-16px;margin-bottom:36px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}
.card{display:flex;gap:14px;padding:22px;border-radius:20px;background:var(--white);box-shadow:0 0 0 1px var(--line)}
.card .ico{width:20px;height:20px;margin-top:3px;color:var(--mint-deep)}
.card h3{font-size:1.0625rem;letter-spacing:-.02em;line-height:1.3;margin-bottom:4px}
.card p{font-size:.9375rem;line-height:1.5;color:var(--fg-2)}
/* Trabajos y frases */
.split{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:48px;align-items:start}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chips li{padding:9px 16px;border-radius:999px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);font-size:.9375rem;font-weight:600;color:var(--fg)}
.quotes{display:flex;flex-direction:column;gap:12px}
.quotes li{position:relative;padding:18px 20px 18px 48px;border-radius:18px 18px 18px 4px;background:var(--ink);color:var(--on-ink);font-size:.9688rem;line-height:1.45}
.quotes li::before{content:"“";position:absolute;left:18px;top:8px;font-size:2.2rem;line-height:1;color:var(--mint);font-weight:800}
.quotes-note{margin-top:10px;font-size:.8125rem;color:var(--fg-3)}
.h3{font-size:1.25rem;letter-spacing:-.02em;line-height:1.3;margin-bottom:18px}
/* Precio */
.price{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px;align-items:start}
.factors{display:flex;flex-direction:column;gap:12px}
.factors li{display:flex;gap:12px;padding:16px 18px;border-radius:16px;background:var(--white);box-shadow:0 0 0 1px var(--line);font-size:.9688rem;line-height:1.5}
.factors .ico{width:18px;height:18px;margin-top:3px;color:var(--mint-deep)}
.note{display:flex;gap:12px;margin-top:22px;padding:16px 18px;border-radius:16px;background:rgba(26,236,209,.14);font-size:.9375rem;line-height:1.5}
.note .ico{width:20px;height:20px;margin-top:2px;color:var(--mint-deep)}
.alert{display:flex;gap:14px;margin-top:28px;padding:18px 20px;border-radius:16px;background:#fff4f2;box-shadow:inset 0 0 0 1px rgba(196,71,58,.28);font-size:.9375rem;line-height:1.55}
.alert .ico{width:22px;height:22px;margin-top:1px;color:#c4473a}
/* Cómo funciona */
.how{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);gap:56px;align-items:center}
.steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;counter-reset:st}
.steps li{padding:22px;border-radius:20px;background:rgba(239,239,238,.04);box-shadow:inset 0 0 0 1px var(--on-ink-line);counter-increment:st}
.steps li::before{content:"Paso " counter(st);display:block;margin-bottom:10px;font-family:var(--f-mono);font-size:.6875rem;letter-spacing:.14em;text-transform:uppercase;color:var(--mint)}
.steps h3{font-size:1.0625rem;letter-spacing:-.02em;margin-bottom:6px}
.steps p{font-size:.9375rem;line-height:1.5;color:var(--on-ink-2)}
.how-img{justify-self:center;width:min(300px,100%);border-radius:30px;overflow:hidden;box-shadow:0 0 0 8px #1b1f1e,0 50px 90px -40px rgba(26,236,209,.5)}
.how-img img{width:100%}
.how-img figcaption{padding:10px 14px;background:#1b1f1e;font-family:var(--f-mono);font-size:.625rem;letter-spacing:.12em;text-transform:uppercase;color:var(--on-ink-3);text-align:center}
/* Promoción */
.promo{background:var(--mint);color:var(--ink)}
.promo .wrap{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:28px 40px;align-items:center}
.promo .promo-pct{font-size:clamp(3.6rem,8vw,5.4rem);color:var(--ink);max-width:none;font-weight:800;line-height:.9;letter-spacing:-.05em}
.promo-pct small{font-size:.5em}
.promo h2{font-size:clamp(1.5rem,2.6vw,2rem);letter-spacing:-.03em;line-height:1.15;margin-bottom:8px}
.promo p{font-size:.9688rem;color:rgba(10,10,10,.78);max-width:60ch}
.promo .fine{margin-top:10px;font-size:.75rem;color:rgba(10,10,10,.62)}
/* Seguridad */
.safe{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.safe li{padding:24px;border-radius:20px;background:var(--paper)}
.safe .ico{width:26px;height:26px;color:var(--mint-deep);margin-bottom:12px}
.safe h3{font-size:1.0625rem;letter-spacing:-.02em;margin-bottom:6px}
.safe p{font-size:.9375rem;line-height:1.5;color:var(--fg-2)}
/* Preguntas */
.faq{display:flex;flex-direction:column;gap:10px;max-width:860px}
.faq details{border-radius:18px;background:var(--white);box-shadow:0 0 0 1px var(--line)}
.faq summary{display:flex;justify-content:space-between;gap:16px;padding:20px 22px;cursor:pointer;list-style:none;font-weight:700;letter-spacing:-.01em;line-height:1.4}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";flex-shrink:0;display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--paper);font-weight:600;transition:transform .3s var(--ease)}
.faq details[open] summary::after{transform:rotate(45deg);background:var(--mint)}
.faq .answer{padding:0 22px 22px;font-size:.9688rem;color:var(--fg-2)}
/* Especialistas */
.pro .wrap{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:24px}
.pro h2{font-size:clamp(1.4rem,2.6vw,1.9rem);letter-spacing:-.03em;line-height:1.2;margin-bottom:8px}
.pro p{color:var(--on-ink-2);max-width:60ch;font-size:.9688rem}
/* Otros servicios */
.rel{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.rel a{display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:18px;background:var(--paper);box-shadow:0 0 0 1px var(--line);transition:transform .4s var(--ease),box-shadow .4s var(--ease)}
.rel a:hover{transform:translateY(-3px);box-shadow:0 0 0 1px var(--mint-deep)}
.rel i{display:grid;place-items:center;width:44px;height:44px;border-radius:14px;background:var(--ink);color:var(--mint);flex-shrink:0}
.rel b{display:block;letter-spacing:-.01em;line-height:1.3}
.rel small{display:block;font-size:.8125rem;color:var(--fg-3);line-height:1.4}
.all{margin-top:36px;padding-top:28px;border-top:1px solid var(--line)}
.all p{font-family:var(--f-mono);font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;color:var(--fg-3);margin-bottom:14px}
.all ul{display:flex;flex-wrap:wrap;gap:8px}
.all a{display:inline-flex;align-items:center;min-height:36px;padding:0 14px;border-radius:999px;background:var(--paper);font-size:.875rem;font-weight:600;color:var(--fg-2)}
.all a:hover,.all a[aria-current]{background:var(--ink);color:var(--white)}
/* Cierre y pie */
.final{text-align:center}
.final .wrap{display:flex;flex-direction:column;align-items:center;gap:20px}
.final .lead{margin-inline:auto}
.foot{background:var(--ink);color:var(--on-ink-2);padding-block:56px calc(env(safe-area-inset-bottom,0px) + 40px);border-top:1px solid var(--on-ink-line);font-size:.875rem}
.foot .wrap{display:grid;grid-template-columns:minmax(0,1.3fr) repeat(2,minmax(0,1fr));gap:36px}
.foot img{width:120px;margin-bottom:14px}
.foot h4{margin:0 0 14px;font-family:var(--f-mono);font-size:.6875rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--mint)}
.foot ul{display:flex;flex-direction:column;gap:9px}
.foot a:hover{color:var(--mint)}
.foot .legal{grid-column:1/-1;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 24px;padding-top:24px;border-top:1px solid var(--on-ink-line);font-size:.8125rem}
.foot .legal nav{display:flex;flex-wrap:wrap;gap:8px 20px}
/* Barra fija de descarga (celular) */
.dock{display:none}
@media (max-width:860px){
  .dock{position:fixed;z-index:60;left:12px;right:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 12px);display:flex;align-items:center;gap:12px;padding:10px 10px 10px 12px;border-radius:20px;background:rgba(10,10,10,.94);color:var(--on-ink);box-shadow:0 18px 40px -16px rgba(0,0,0,.7),inset 0 0 0 1px rgba(239,239,238,.1);transform:translateY(calc(100% + 24px));visibility:hidden;transition:transform .5s var(--ease),visibility 0s .5s}
  .dock.show{transform:none;visibility:visible;transition:transform .5s var(--ease),visibility 0s}
  .dock img{width:40px;height:40px;border-radius:12px}
  .dock span{display:flex;flex-direction:column;min-width:0;flex:1;line-height:1.2}
  .dock b{font-size:.9375rem}
  .dock small{font-size:.75rem;color:var(--on-ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .dock .btn{min-height:44px;padding:0 18px;font-size:.875rem;gap:8px}
  .foot{padding-bottom:calc(env(safe-area-inset-bottom,0px) + 110px)}
}
@media (max-width:960px){
  .split,.price,.how{grid-template-columns:1fr;gap:36px}
  .safe{grid-template-columns:repeat(2,minmax(0,1fr))}
  .promo .wrap{grid-template-columns:1fr;text-align:left}
  .foot .wrap{grid-template-columns:1fr 1fr}
  .foot .brand{grid-column:1/-1}
}
@media (max-width:600px){
  .sec{padding-block:64px}
  .steps,.safe{grid-template-columns:1fr}
  .o-hero{padding-block:40px 64px}
  .o-cta .btn{width:100%}
  .foot .wrap{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}}
"""

ICONOS = ['i-play', 'i-arrow', 'i-check', 'i-shield', 'i-lock', 'i-card', 'i-award', 'i-chat',
          'i-star', 'i-clock', 'i-alert', 'i-gift', 'i-users', 'i-tag', 'i-camera',
          's-plomeria', 's-electricidad', 's-imper', 's-albanil', 's-herreria', 's-pintura',
          's-jardin', 's-gas', 's-cisterna', 's-mudanza', 's-mandados', 's-mascotas',
          's-drenaje', 's-carpinteria']


def head(title, desc, url, extra_ld, prefijo, robots='index,follow,max-image-preview:large', canonical=True):
    can = ('<link rel="canonical" href="%s">\n' % url) if canonical else ''
    return f'''<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
{can}<meta name="robots" content="{robots}">
<meta name="theme-color" content="#0a0a0a">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_MX">
<meta property="og:site_name" content="Acency">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:image" content="{D}/assets/og-acency.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{prefijo}assets/favicon.png">
<link rel="apple-touch-icon" href="{prefijo}assets/icon.png">
<link rel="manifest" href="{prefijo}site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="{FUENTES}">
<link rel="stylesheet" href="{FUENTES}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="{FUENTES}"></noscript>
{extra_ld}
<style>{CSS}</style>
</head>
'''


def barra(prefijo, local=True):
    como, preg = ('#como', '#preguntas') if local else (prefijo + '#como-funciona', prefijo + '#preguntas')
    return f'''<header class="o-top">
  <div class="wrap">
    <a href="{prefijo or './'}" aria-label="Acency, ir al inicio"><img src="{prefijo}assets/logo-white-sm.png" alt="Acency" width="57" height="26"></a>
    <nav aria-label="Principal"><a href="{prefijo}#servicios">Servicios</a><a href="{como}">Cómo funciona</a><a href="{preg}">Preguntas</a><a href="{prefijo}#especialistas">Especialistas</a></nav>
    <a class="btn" data-play href="{PLAY}" target="_blank" rel="noopener"><svg class="ico ico-fill"><use href="#i-play"/></svg>Descargar</a>
  </div>
</header>
'''


def pie(prefijo, actual=None):
    servicios = ''.join('<li><a href="%s%s/"%s>%s</a></li>' % (prefijo, o['slug'], ' aria-current="page"' if o['slug'] == actual else '', e(nombre_corto(o))) for o in OFICIOS)
    return f'''<footer class="foot">
  <div class="wrap">
    <div class="brand">
      <img src="{prefijo}assets/logo-mint.png" alt="Acency" width="900" height="413" loading="lazy">
      <p>El único lugar donde contratar y trabajar al fin se sienten justos. Hecho en México.</p>
      <p style="margin-top:14px"><a href="mailto:soporte@acencyservicios.com">soporte@acencyservicios.com</a><br><a href="tel:+525522443381">+52 55 2244 3381</a></p>
    </div>
    <div>
      <h4>Servicios</h4>
      <ul>{servicios}</ul>
    </div>
    <div>
      <h4>Acency</h4>
      <ul>
        <li><a href="{prefijo or './'}">Inicio</a></li>
        <li><a href="{prefijo}#como-funciona">Cómo funciona</a></li>
        <li><a href="{prefijo}#promo">−12% en tu primer servicio</a></li>
        <li><a href="{prefijo}#especialistas">Trabaja como especialista</a></li>
        <li><a href="{prefijo}#preguntas">Preguntas frecuentes</a></li>
        <li><a href="https://www.instagram.com/acency_mx" target="_blank" rel="noopener">Instagram</a></li>
        <li><a href="https://www.tiktok.com/@acency0" target="_blank" rel="noopener">TikTok</a></li>
        <li><a href="https://www.facebook.com/share/1DomhKjQq3/" target="_blank" rel="noopener">Facebook</a></li>
      </ul>
    </div>
    <div class="legal">
      <span>© 2026 Acency. Hecho en México.</span>
      <nav aria-label="Legal"><a href="{LEGAL}/aviso_de_privacidad_acency.html" target="_blank" rel="noopener">Aviso de privacidad</a><a href="{LEGAL}/terminos_y_condiciones.html" target="_blank" rel="noopener">Términos y condiciones</a><a href="{LEGAL}/politica_de_reembolsos_acency.html" target="_blank" rel="noopener">Reembolsos</a><a href="{LEGAL}/politica_de_cookies_acency.html" target="_blank" rel="noopener">Cookies</a><a href="{LEGAL}/contacto_y_soporte_acency.html" target="_blank" rel="noopener">Contacto y soporte</a></nav>
    </div>
  </div>
</footer>
'''


def nombre_corto(o):
    return {
        'plomero': 'Plomero', 'electricista': 'Electricista', 'desazolve': 'Desazolve de drenajes',
        'impermeabilizacion': 'Impermeabilización', 'instalacion-de-gas': 'Instalación de gas',
        'albanil': 'Albañil', 'pintor': 'Pintor', 'herrero': 'Herrero', 'carpintero': 'Carpintero',
        'jardinero': 'Jardinero', 'limpieza-de-cisternas': 'Cisternas y tinacos', 'mudanzas': 'Ayudantes de mudanza',
        'armado-de-muebles': 'Armado de muebles', 'mandados': 'Mandados y filas', 'paseador-de-perros': 'Paseador de perros',
    }[o['slug']]


def dock(prefijo):
    return f'''<aside class="dock" id="dock" aria-label="Descargar Acency">
  <img src="{prefijo}assets/icon.png" alt="" width="40" height="40" loading="lazy">
  <span><b>Acency</b><small>Cotiza gratis · −12% en tu 1.er servicio</small></span>
  <a class="btn" data-play href="{PLAY}" target="_blank" rel="noopener"><svg class="ico ico-fill"><use href="#i-play"/></svg>Descargar</a>
</aside>
'''


PROMO_FAQ = ['¿Hay descuento en mi primer servicio?', 'Sí. En tu primer servicio pagado con tarjeta, Acency te descuenta el 12% de lo que pagas por la mano de obra, hasta $1,000 MXN. No vence: lo usas cuando lo necesites. Necesitas tu identidad verificada y no aplica en efectivo. Tu especialista cobra exactamente lo mismo: el descuento sale de Acency. Si ese servicio se cancela, el descuento vuelve a quedar disponible.']

# Servicios donde la app NO permite ofrecer corrección sin costo
# (lib/core/categorias.dart → kSubcategoriasSinCorreccion).
SIN_CORRECCION = {'mudanzas', 'mandados', 'paseador-de-perros'}


def con_correccion(o):
    return o['slug'] not in SIN_CORRECCION


def faqs_de(o):
    nombre = o['nombre']
    fs = [[o['precio_titulo'], o['precio']]] + o['faqs']
    if o['diagnostico']:
        solo = ' (en carpintería, solo para reparaciones)' if o['slug'] == 'carpintero' else ''
        fs.append(['¿Puedo pedir solo una revisión?', 'Sí. En %s%s un especialista puede ofrecerte primero una visita de diagnóstico. Pagas solo esa visita; después recibes un dictamen con fotos y, si hace falta reparar, una cotización con precio firme. Tú decides si la contratas. La visita de diagnóstico no incluye materiales ni corrección sin costo.' % (nombre.lower(), solo)])
    fs.append(['¿Cotizar tiene costo?', 'No. Pides cotizaciones sin costo a todos los especialistas que quieras. Solo pagas cuando eliges y confirmas una oferta. Tu solicitud está activa 20 horas.'])
    if con_correccion(o):
        fs.append(['¿Qué pasa si el trabajo quedó mal?', 'Depende de la oferta. Si incluía corrección sin costo (opcional; el especialista elige los días, hasta 30), dentro de ese plazo la pides desde Mi actividad con un video y tu especialista regresa a corregirlo sin cobrarte; puedes pedirla hasta 2 veces por servicio. Si no la incluía, tienes 24 horas después de terminado para reportar que quedó mal con un video de 1 a 2 minutos: tu especialista decide si regresa a corregirlo sin costo y, si no regresa, se te devuelve el 30% de la mano de obra. En cualquier caso conservas tus derechos como consumidor.'])
    else:
        fs.append(['¿Qué pasa si algo sale mal?', 'Este servicio no incluye corrección sin costo (en la app no se ofrece en mudanzas, mandados, paseo de mascotas ni hacer fila). Si algo sale mal, repórtalo desde la app y Acency revisa el caso con la evidencia de ambas partes.'])
    fs += [
        ['¿Tengo que estar presente cuando termina?', 'No es obligatorio. Al terminar, tu especialista toma fotos y video como evidencia y cierra el servicio desde su app: tú no tienes que confirmar nada. Si estás ahí, revisa con él y dile en ese momento si algo no quedó bien.'],
        ['¿Cómo puedo pagar?', 'Con tarjeta de crédito o débito, o en efectivo. Con tarjeta, Acency retiene el pago y se lo deposita a tu especialista entre 48 y 72 horas después de completar el servicio; si reportas un problema, se pausa. En efectivo le pagas en mano a tu especialista antes de que empiece, sin protección de pago digital.'],
        PROMO_FAQ,
    ]
    return fs


def pagina(o):
    slug = o['slug']
    url = '%s/%s/' % (D, slug)
    p = '../'
    fs = faqs_de(o)
    datos = {
        '@context': 'https://schema.org',
        '@graph': [
            {'@type': 'Organization', '@id': D + '/#acency', 'name': 'Acency', 'url': D + '/', 'logo': D + '/assets/icon.png'},
            {'@type': 'WebPage', '@id': url + '#pagina', 'url': url, 'name': o['title'], 'description': o['description'], 'inLanguage': 'es-MX',
             'isPartOf': {'@id': D + '/#web'}, 'breadcrumb': {'@id': url + '#migas'}, 'about': {'@id': url + '#servicio'}},
            {'@type': 'BreadcrumbList', '@id': url + '#migas', 'itemListElement': [
                {'@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': D + '/'},
                {'@type': 'ListItem', 'position': 2, 'name': o['nombre'], 'item': url}]},
            {'@type': 'Service', '@id': url + '#servicio', 'name': o['nombre'] + ' a domicilio', 'serviceType': o['nombre'],
             'description': o['description'], 'url': url, 'provider': {'@id': D + '/#acency'},
             'areaServed': {'@type': 'Country', 'name': 'México'},
             'hasOfferCatalog': {'@type': 'OfferCatalog', 'name': o['trabajos_titulo'],
                                 'itemListElement': [{'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': t}} for t in o['trabajos']]}},
            {'@type': 'FAQPage', '@id': url + '#preguntas', 'mainEntity': [
                {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in fs]},
        ],
    }
    problemas = '\n'.join('      <li class="card"><svg class="ico"><use href="#i-check"/></svg><div><h3>%s</h3><p>%s</p></div></li>' % (e(t), e(d)) for t, d in o['problemas'])
    trabajos = ''.join('<li>%s</li>' % e(t) for t in o['trabajos'])
    frases = ''.join('<li>%s</li>' % e(f) for f in o['frases'])
    factores = '\n'.join('        <li><svg class="ico"><use href="#i-check"/></svg><span>%s</span></li>' % e(f) for f in o['factores'])
    alerta = ''
    if o.get('seguridad'):
        alerta = '      <p class="alert" role="note"><svg class="ico"><use href="#i-alert"/></svg><span>%s</span></p>\n' % e(o['seguridad'])
    preguntas = '\n'.join('      <details%s><summary>%s</summary><div class="answer">%s</div></details>' % (' open' if i == 0 else '', e(q), e(a)) for i, (q, a) in enumerate(fs))
    rel = '\n'.join('      <li><a href="../%s/"><i><svg class="ico"><use href="#%s"/></svg></i><span><b>%s</b><small>%s</small></span></a></li>' % (
        r, POR_SLUG[r]['icono'], e(nombre_corto(POR_SLUG[r])), e(POR_SLUG[r]['problemas_titulo'])) for r in o['relacionados'])
    todos = ''.join('<li><a href="../%s/"%s>%s</a></li>' % (x['slug'], ' aria-current="page"' if x['slug'] == slug else '', e(nombre_corto(x))) for x in OFICIOS)
    cc = con_correccion(o)
    chip2 = '<li><svg class="ico"><use href="#i-award"/></svg>Corrección sin costo opcional</li>' if cc else '<li><svg class="ico"><use href="#i-lock"/></svg>Código de seguridad al llegar</li>'
    compara = 'materiales, días de corrección y hora de vencimiento' if cc else 'materiales y hora de vencimiento'
    seguro5 = ('<li><svg class="ico"><use href="#i-award"/></svg><h3>Corrección sin costo</h3><p>Opcional, hasta 30 días: si el trabajo falla en ese plazo, tu especialista regresa sin cobrarte. Lo ves en la oferta antes de elegir.</p></li>' if cc else
               '<li><svg class="ico"><use href="#i-alert"/></svg><h3>Si algo sale mal</h3><p>Lo reportas desde la app y Acency revisa el caso con la evidencia de ambas partes.</p></li>')
    diag = ''
    if o['diagnostico']:
        diag = '      <p class="note"><svg class="ico"><use href="#i-shield"/></svg><span><b>¿No sabes qué tiene?</b> ' + ('En reparaciones, un' if o['slug'] == 'carpintero' else 'Un') + ' especialista puede ofrecerte primero una visita de diagnóstico: pagas solo esa visita y recibes un dictamen con fotos y, si hace falta, una cotización con precio firme.</span></p>\n'

    cuerpo = f'''<body data-oficio="{slug}">
{simbolos(ICONOS)}
{barra(p)}
<main>
<section class="o-hero" aria-labelledby="titulo">
  <div class="wrap">
   <div class="o-hero-copy">
    <nav class="crumbs" aria-label="Estás en"><a href="../">Inicio</a><span aria-hidden="true">/</span><a href="../#servicios">Servicios</a><span aria-hidden="true">/</span><span aria-current="page">{e(o['nombre'])}</span></nav>
    <span class="label">Servicio a domicilio · Cotiza gratis</span>
    <h1 id="titulo">{e(o['h1'][0])} <span class="accent">{e(o['h1'][1])}</span></h1>
    <p class="lead">{e(o['lead'])}</p>
    <div class="o-cta">
      <a class="btn" data-play href="{PLAY}" target="_blank" rel="noopener"><svg class="ico ico-fill"><use href="#i-play"/></svg> Descargar en Google Play</a>
      <p class="o-free"><b>Gratis</b>Cotizar no cuesta nada · App para Android</p>
    </div>
    <a class="o-promo" href="#promo"><b>−12%</b><span>en tu primer servicio pagado con tarjeta · no vence</span></a>
    <ul class="trust" aria-label="Por qué Acency">
      <li><svg class="ico"><use href="#i-shield"/></svg>{e(o['oficio_pl'].capitalize())} verificados</li>
      {chip2}
      <li><svg class="ico"><use href="#i-card"/></svg>Pago protegido con tarjeta</li>
      <li><svg class="ico"><use href="#i-chat"/></svg>Chat sin dar tu teléfono</li>
    </ul>
   </div>
    <figure class="o-hero-img"><picture><source srcset="../assets/promo-cotizaciones-600.webp" type="image/webp"><img src="../assets/promo-cotizaciones.jpg" alt="Acency: recibe diferentes cotizaciones y elige la mejor para ti" width="900" height="1948" loading="lazy" decoding="async"></picture></figure>
  </div>
</section>

<section class="sec" aria-labelledby="problemas">
  <div class="wrap">
    <div class="sec-head">
      <span class="label">{e(o['nombre'])}</span>
      <h2 class="h2" id="problemas">{e(o['problemas_titulo'])}</h2>
    </div>
    <p class="intro">{e(o['intro'])}</p>
    <ul class="cards">
{problemas}
    </ul>
{alerta}  </div>
</section>

<section class="sec white" aria-labelledby="trabajos">
  <div class="wrap split">
    <div>
      <h2 class="h3" id="trabajos">{e(o['trabajos_titulo'])}</h2>
      <ul class="chips">{trabajos}</ul>
    </div>
    <div>
      <h2 class="h3">Así lo piden en la app</h2>
      <ul class="quotes">{frases}</ul>
      <p class="quotes-note">Escríbelo con tus palabras y agrega fotos y video: al menos 1 de cada uno.</p>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="precio">
  <div class="wrap price">
    <div class="sec-head" style="margin-bottom:0">
      <span class="label">Precios</span>
      <h2 class="h2" id="precio">{e(o['precio_titulo'])}</h2>
      <p class="lead">{e(o['precio'])}</p>
      <p class="note"><svg class="ico"><use href="#i-tag"/></svg><span>El precio de cada oferta ya incluye mano de obra, comisión de Acency e impuestos. Si no incluye materiales, los apruebas tú antes de que se compren.</span></p>
    </div>
    <div>
      <h3 class="h3">Lo que más cambia el precio</h3>
      <ul class="factors">
{factores}
      </ul>
{diag}    </div>
  </div>
</section>

<section class="sec dark" id="como" aria-labelledby="como-t">
  <div class="wrap how">
    <div>
      <div class="sec-head">
        <span class="label">Cómo funciona</span>
        <h2 class="h2" id="como-t">Recibe ofertas y <span class="accent">elige la mejor</span> para ti.</h2>
      </div>
      <ol class="steps">
        <li><h3>Cuenta qué pasa</h3><p>Describe el problema, agrega fotos y video (al menos 1 de cada uno) e indica tu zona.</p></li>
        <li><h3>Urgente o Agendar</h3><p>Urgente: ofertas para hoy o mañana. Agendar: tiempo estándar. El día, la hora de llegada y la duración vienen en cada oferta.</p></li>
        <li><h3>Compara ofertas</h3><p>Precio, calificación o la etiqueta <b>Nuevo</b>, {compara}. Compara las veces que quieras.</p></li>
        <li><h3>Sigue el servicio y califica</h3><p>En camino, En tu puerta y Trabajando, en tiempo real. Al terminar, tu especialista sube fotos y video y cierra el servicio; luego se califican los dos.</p></li>
      </ol>
    </div>
    <figure class="how-img">
      <picture><source srcset="../assets/app-puerta.webp" type="image/webp"><img src="../assets/app-puerta.jpg" alt="Pantalla de la app de Acency cuando tu especialista llega a tu puerta y pide el código de seguridad" width="540" height="1244" loading="lazy" decoding="async"></picture>
      <figcaption>Al llegar, tu especialista te pide el código</figcaption>
    </figure>
  </div>
</section>

<section class="sec promo" id="promo" aria-labelledby="promo-t">
  <div class="wrap">
    <p class="promo-pct" aria-hidden="true">12<small>%</small></p>
    <div>
      <h2 id="promo-t">Tu primer servicio con 12% de descuento.</h2>
      <p>En tu primer servicio pagado con tarjeta, Acency te descuenta el 12% de lo que pagas por la mano de obra, hasta $1,000 MXN. No vence. Tu especialista cobra lo mismo: el descuento sale de Acency.</p>
      <p class="fine">Necesitas tu identidad verificada y tu cuenta activa; no aplica en efectivo. Si ese servicio se cancela, el descuento vuelve a quedar disponible. El ahorro exacto lo ves en la pantalla de pago antes de confirmar.</p>
    </div>
    <a class="btn btn-dark" data-play href="{PLAY}" target="_blank" rel="noopener"><svg class="ico ico-fill"><use href="#i-play"/></svg> Usar mi 12%</a>
  </div>
</section>

<section class="sec white" aria-labelledby="seguro">
  <div class="wrap">
    <div class="sec-head">
      <span class="label">Contrata tranquilo</span>
      <h2 class="h2" id="seguro">Seguridad en <span class="accent">cada visita.</span></h2>
    </div>
    <ul class="safe">
      <li><svg class="ico"><use href="#i-shield"/></svg><h3>Especialistas verificados</h3><p>INE y selfie, teléfono, oficio, experiencia y datos fiscales. El equipo de Acency aprueba cada perfil.</p></li>
      <li><svg class="ico"><use href="#i-lock"/></svg><h3>Código de seguridad</h3><p>Un código de 6 caracteres que solo tú ves. Se lo das a tu especialista al llegar.</p></li>
      <li><svg class="ico"><use href="#i-card"/></svg><h3>Pago retenido</h3><p>Con tarjeta, Acency retiene el pago y se lo deposita a tu especialista entre 48 y 72 horas después de completar. Si reportas un problema, se pausa.</p></li>
      {seguro5}
      <li><svg class="ico"><use href="#i-chat"/></svg><h3>Chat privado</h3><p>Todo pasa por el chat de la app, sin compartir tu teléfono ni tu correo.</p></li>
      <li><svg class="ico"><use href="#i-star"/></svg><h3>Reseñas de ambos lados</h3><p>Se publican al mismo tiempo cuando los dos calificaron o vence el plazo, para que sean honestas.</p></li>
    </ul>
  </div>
</section>

<section class="sec" id="preguntas" aria-labelledby="faq-t">
  <div class="wrap">
    <div class="sec-head">
      <span class="label">Preguntas frecuentes</span>
      <h2 class="h2" id="faq-t">Lo que más nos preguntan sobre {e(o['nombre'].lower())}</h2>
    </div>
    <div class="faq">
{preguntas}
    </div>
  </div>
</section>

<section class="sec dark pro" aria-labelledby="pro-t">
  <div class="wrap">
    <div>
      <h2 id="pro-t">¿Eres {e(o['oficio'])}? Recibe clientes cerca de ti.</h2>
      <p>Regístrate como especialista desde la misma app, completa tu verificación y empieza a recibir solicitudes de tu zona.</p>
    </div>
    <a class="btn btn-line" href="../#especialistas">Quiero trabajar con Acency <svg class="ico"><use href="#i-arrow"/></svg></a>
  </div>
</section>

<section class="sec white" aria-labelledby="rel-t">
  <div class="wrap">
    <div class="sec-head">
      <span class="label">Más servicios</span>
      <h2 class="h2" id="rel-t">Otros servicios para tu hogar</h2>
    </div>
    <ul class="rel">
{rel}
    </ul>
    <nav class="all" aria-label="Todos los servicios"><p>Todos los servicios a domicilio</p><ul>{todos}</ul></nav>
  </div>
</section>

<section class="sec dark final" id="final" aria-labelledby="final-t">
  <div class="wrap">
    <span class="label">Descarga gratis</span>
    <h2 class="h2" id="final-t">Resuélvelo desde <span class="accent">tu celular.</span></h2>
    <p class="lead">Descarga Acency, cuenta qué pasa y recibe ofertas de {e(o['oficio_pl'])} cerca de ti. Cotizar es gratis y tu primer servicio pagado con tarjeta tiene 12% de descuento en la mano de obra.</p>
    <a class="btn" data-play href="{PLAY}" target="_blank" rel="noopener"><svg class="ico ico-fill"><use href="#i-play"/></svg> Descargar en Google Play</a>
  </div>
</section>
</main>

{pie(p, slug)}{dock(p)}
<script src="../js/anuncios.js"></script>
<script src="../js/oficio.js"></script>
</body>
</html>
'''
    return head(o['title'], o['description'], url, ld(datos), p) + cuerpo


def pagina_simple(ruta_rel, title, h1, texto, botones, prefijo='/', extra_js=''):
    """404 y regreso de Stripe: sin indexar, con rutas absolutas (/) porque se sirven en cualquier ruta."""
    cuerpo = f'''<body data-oficio="{e(ruta_rel)}">
{simbolos(['i-play', 'i-arrow'])}
{barra(prefijo, local=False)}
<main>
<section class="o-hero" style="min-height:62vh;display:flex;align-items:center">
  <div class="wrap" style="width:100%">
   <div class="o-hero-copy">
    <span class="label">Acency</span>
    <h1>{h1}</h1>
    <p class="lead">{texto}</p>
    <div class="o-cta">{botones}</div>
   </div>
  </div>
</section>
</main>
{pie(prefijo)}{extra_js}<script src="{prefijo}js/anuncios.js"></script>
<script src="{prefijo}js/oficio.js"></script>
</body>
</html>
'''
    return head(title, texto, D + '/', '', prefijo, robots='noindex,follow', canonical=False) + cuerpo


# La app comparte enlaces https://<dominio>/r/<código> (invitación) y /p/<id>
# (promoción) — lib/core/tarifas.dart kEnlaceReferidoBase / kEnlacePromoBase y
# lib/main.dart _manejarDeepLink. Con la app instalada y el dominio verificado
# (/.well-known/assetlinks.json) Android abre la app directo; si no, el hosting
# sirve esta 404 y aquí se muestra qué hacer en vez de "no existe".
JS_ENLACES_APP = r"""<script>
(function () {
  var m = location.pathname.match(/^\/(r|p)\/([^\/?#]+)/);
  if (!m) return;
  function codigo(v) {
    try { v = decodeURIComponent(v || ''); } catch (e) { return ''; }
    v = v.toUpperCase().replace(/\s+/g, '');
    return /^ACY-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{4,8}$/.test(v) ? v : '';
  }
  var esInvitacion = m[1] === 'r';
  var cod = esInvitacion ? codigo(m[2]) : codigo(new URLSearchParams(location.search).get('ref'));
  if (esInvitacion && !cod) return;
  var h1 = document.querySelector('.o-hero h1'), lead = document.querySelector('.o-hero .lead'), cta = document.querySelector('.o-hero .o-cta');
  if (!h1 || !lead || !cta) return;
  document.body.setAttribute('data-oficio', esInvitacion ? 'invitacion' : 'promo');
  document.title = esInvitacion ? 'Te invitaron a Acency' : 'Promoción de Acency';
  h1.innerHTML = esInvitacion ? 'Te invitaron a <span class="accent">Acency.</span>' : 'Esta promoción se abre <span class="accent">en la app.</span>';
  lead.textContent = esInvitacion
    ? 'Descarga la app y, al crear tu cuenta, escribe este código en “¿Tienes código de invitación?”.'
    : 'Si ya tienes Acency en tu Android, abre este enlace desde tu celular y se abre la promoción. Si no, descárgala gratis.' + (cod ? ' Al crear tu cuenta, usa el código de invitación de quien te la compartió.' : '');
  var play = '<a class="btn" data-play href="https://play.google.com/store/apps/details?id=com.servicios.acency" target="_blank" rel="noopener"><svg class="ico ico-fill"><use href="#i-play"/></svg> Descargar en Google Play</a>';
  cta.innerHTML = (cod ? '<button class="btn btn-line" type="button" id="copiarCodigo">Código: ' + cod + ' · Copiar</button>' : '') + play;
  var b = document.getElementById('copiarCodigo');
  if (b) b.addEventListener('click', function () {
    var ok = function () { b.textContent = 'Código ' + cod + ' copiado'; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(cod).then(ok, function () { b.textContent = 'Tu código: ' + cod; });
    else b.textContent = 'Tu código: ' + cod;
  });
})();
</script>
"""


def faq_visible(texto):
    out = []
    for q, a in re.findall(r'<details class="faq-item"[^>]*><summary>(.*?)<i aria-hidden="true"></i></summary><div class="answer">(.*?)</div></details>', texto, re.S):
        limpia = lambda s: html.unescape(re.sub(r'<[^>]+>', '', s)).strip()
        out.append([limpia(q), limpia(a)])
    return out


def ld_inicio():
    sl = ['https://www.instagram.com/acency_mx', 'https://www.tiktok.com/@acency0',
          'https://www.facebook.com/share/1DomhKjQq3/', 'https://whatsapp.com/channel/0029VbE9G6J9MF91uqs7NX2t']
    fs = faq_visible(INDEX)
    if len(fs) < 10:
        raise SystemExit('No se leyeron las preguntas del inicio (%d)' % len(fs))
    datos = {
        '@context': 'https://schema.org',
        '@graph': [
            {'@type': 'Organization', '@id': D + '/#acency', 'name': 'Acency', 'url': D + '/',
             'logo': D + '/assets/icon.png', 'image': D + '/assets/og-acency.jpg',
             'slogan': 'El único lugar donde contratar y trabajar al fin se sienten justos',
             'description': 'App mexicana que conecta hogares con especialistas verificados: plomero, electricista, desazolve, impermeabilización, instalación de gas, albañil, pintor, herrero, carpintero, jardinero, limpieza de cisternas, ayudantes de mudanza, armado de muebles, mandados y paseador de perros.',
             'email': 'soporte@acencyservicios.com', 'telephone': '+52 55 2244 3381',
             'contactPoint': {'@type': 'ContactPoint', 'contactType': 'customer support', 'email': 'soporte@acencyservicios.com',
                              'telephone': '+52-55-2244-3381', 'areaServed': 'MX', 'availableLanguage': 'es'},
             'areaServed': {'@type': 'Country', 'name': 'México'}, 'sameAs': sl,
             'hasOfferCatalog': {'@type': 'OfferCatalog', 'name': 'Servicios para el hogar a domicilio',
                                 'itemListElement': [{'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': o['nombre'] + ' a domicilio', 'url': '%s/%s/' % (D, o['slug'])}} for o in OFICIOS]}},
            {'@type': 'WebSite', '@id': D + '/#web', 'url': D + '/', 'name': 'Acency', 'inLanguage': 'es-MX', 'publisher': {'@id': D + '/#acency'}},
            {'@type': 'MobileApplication', 'name': 'Acency', 'operatingSystem': 'Android', 'applicationCategory': 'LifestyleApplication',
             'url': PLAY, 'installUrl': PLAY, 'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'MXN'}, 'publisher': {'@id': D + '/#acency'}},
            {'@type': 'FAQPage', '@id': D + '/#preguntas', 'mainEntity': [
                {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in fs]},
        ],
    }
    return ld(datos), len(fs)


def main():
    global INDEX
    # 1) Páginas por oficio
    for o in OFICIOS:
        escribir('%s/index.html' % o['slug'], pagina(o))
    # 2) Datos estructurados del inicio (las preguntas salen del FAQ visible)
    bloque, n = ld_inicio()
    INDEX = re.sub(r'<script type="application/ld\+json">.*?</script>', lambda m: bloque, INDEX, count=1, flags=re.S)
    escribir('index.html', INDEX)
    # 3) Sitemap y robots
    urls = [D + '/'] + ['%s/%s/' % (D, o['slug']) for o in OFICIOS]
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        sm.append('  <url><loc>%s</loc><lastmod>%s</lastmod></url>' % (u, FECHA))
    sm.append('</urlset>')
    escribir('sitemap.xml', '\n'.join(sm) + '\n')
    escribir('robots.txt', 'User-agent: *\nAllow: /\nDisallow: /stripe/\nDisallow: /r/\nDisallow: /p/\n\nSitemap: %s/sitemap.xml\n' % D)
    # 4) 404 y regreso de Stripe (especialistas)
    escribir('404.html', pagina_simple('404', 'Página no encontrada · Acency', 'Esta página <span class="accent">no existe.</span>',
                                       'Puede que el enlace esté mal escrito o que la página ya no exista. Desde el inicio encuentras todos los servicios.',
                                       '<a class="btn" href="/">Ir al inicio <svg class="ico"><use href="#i-arrow"/></svg></a><a class="btn btn-line" href="/#servicios">Ver servicios</a>',
                                       extra_js=JS_ENLACES_APP))
    for r in ('return', 'refresh'):
        escribir('stripe/%s/index.html' % r, pagina_simple('stripe-' + r, 'Regresa a la app · Acency', 'Listo, <span class="accent">regresa a la app.</span>',
                                                          'Ya puedes volver a Acency para terminar de configurar tus pagos. Si la app no se abrió sola, ábrela desde tu celular.',
                                                          '<a class="btn" href="/">Ir al inicio <svg class="ico"><use href="#i-arrow"/></svg></a>'))
    print('Listo: %d páginas de oficio, %d preguntas en el FAQPage del inicio, %d URLs en el sitemap. Dominio: %s' % (len(OFICIOS), n, len(urls), D))


if __name__ == '__main__':
    main()
