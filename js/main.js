/* Acency · interacciones de la landing.
   Parte 1 (original): intro, navegación, pasos, revelado, parallax, botones, cursor, copiar código.
   Parte 2 (agregados): progreso, capítulos, cinta, manifiesto, buscador, demo, seguridad, FAQ,
   QR, documentos legales, compartir y detalles de movimiento. */
(function () {
  'use strict';
  /* Cambia este enlace por el de la ficha oficial de Acency en Google Play */
  var PLAY_URL = 'https://play.google.com/store/apps/details?id=com.servicios.acency';

  /* ---------- Google Ads: medición y atribución ----------
     ADS_ID es el ID de la cuenta (AW-XXXXXXXXXX) y ADS_LABEL la etiqueta de la
     conversión "Clic a Google Play". Vacíos = no se carga nada de Google. */
  var ADS_ID = '';
  var ADS_LABEL = '';
  var qs = new URLSearchParams(location.search);
  /* La fuente del anuncio viaja a Google Play en `referrer` (Play Console la muestra
     en Adquisición). Sin anuncio, se marca como tráfico de la página. */
  var PLAY_LINK = (function () {
    var keep = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid'], ref = [];
    keep.forEach(function (k) { var v = qs.get(k); if (v) ref.push(k + '=' + encodeURIComponent(v.slice(0, 100))); });
    if (!qs.get('utm_source')) ref.unshift('utm_source=' + (qs.get('gclid') || qs.get('gbraid') || qs.get('wbraid') ? 'google' : 'acency_web'), 'utm_medium=' + (qs.get('gclid') ? 'cpc' : 'landing'));
    return PLAY_URL + '&referrer=' + encodeURIComponent(ref.join('&'));
  })();
  document.querySelectorAll('[data-play]').forEach(function (a) { a.href = PLAY_LINK; });
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  if (ADS_ID) {
    gtag('js', new Date()); gtag('config', ADS_ID);
    var loadTag = function () { var t = document.createElement('script'); t.async = true; t.src = 'https://www.googletagmanager.com/gtag/js?id=' + ADS_ID; document.head.appendChild(t); };
    if (document.readyState === 'complete') loadTag(); else window.addEventListener('load', loadTag);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-play]');
    if (!a) return;
    window.dataLayer.push({ event: 'clic_google_play', ubicacion: (a.closest('[id]') || {}).id || '' });
    if (ADS_ID && ADS_LABEL) gtag('event', 'conversion', { send_to: ADS_ID + '/' + ADS_LABEL });
  });

  /* ---------- Videos introductorios ----------
     Pega aquí el ID de YouTube (lo que va después de v= o de /shorts/) o la ruta
     de un MP4 en assets/videos/. Vacío = la tarjeta dice "Próximamente". */
  var VIDEOS = {
    intro: { youtube: '', archivo: '', poster: '', duracion: '' },
    pedir: { youtube: '', archivo: '', poster: '', duracion: '' },
    elegir: { youtube: '', archivo: '', poster: '', duracion: '' },
    seguridad: { youtube: '', archivo: '', poster: '', duracion: '' }
  };

  /* ---------- Titular según el anuncio: ?servicio=plomeria ----------
     Cada campaña de búsqueda aterriza con su oficio y el hero repite lo que la
     persona buscó. *palabra* = palabra en menta. */
  var SERVICIOS = {
    plomeria: ['¿Necesitas un *plomero* *hoy?*', 'Fugas, llaves que gotean, drenajes tapados o un WC que no funciona. Cuenta qué pasa, recibe ofertas de plomeros verificados cerca de ti y elige la que más te convenga. Cotizar es gratis.', 'fuga de agua', 'plomeria'],
    electricidad: ['¿Necesitas un *electricista* *hoy?*', 'Un cuarto sin luz, contactos, apagadores o un tablero que falla. Recibe ofertas de electricistas verificados cerca de ti, compara y elige. Cotizar es gratis.', 'se fue la luz', 'electricidad'],
    impermeabilizacion: ['Impermeabiliza tu techo *antes* *de* *que* *llueva.*', 'Graba un video de tu azotea y recibe cotizaciones de especialistas cerca de ti, cada una con su precio y su garantía. Cotizar es gratis.', 'gotera en el techo', 'impermeabilizacion'],
    drenaje: ['¿Drenaje tapado? *Resuélvelo* *ya.*', 'Desazolve de drenajes, cañerías y registros a domicilio. Manda fotos o un video, recibe ofertas de especialistas cercanos y elige. Cotizar es gratis.', 'drenaje tapado', 'desazolve'],
    gas: ['Instalación de gas *segura,* *a* *domicilio.*', 'Instalación y conexión de líneas y aparatos de gas con especialistas verificados de tu zona. Compara ofertas antes de contratar. Cotizar es gratis.', 'instalacion de gas', ''],
    pintura: ['Pinta tu casa *sin* *batallar.*', 'Interiores y fachadas. Recibe ofertas de pintores verificados cerca de ti con precio, día de visita y garantía. Cotizar es gratis.', 'pintar mi casa', 'pintura'],
    albanileria: ['Albañil a domicilio, *cerca* *de* *ti.*', 'Paredes cuarteadas, pisos, azulejos y reparaciones. Manda fotos, recibe ofertas y elige con calificaciones reales. Cotizar es gratis.', 'pared cuarteada', 'albanileria'],
    herreria: ['Herrero a domicilio, *cerca* *de* *ti.*', 'Rejas, portones, protecciones y soldadura. Compara ofertas de herreros verificados antes de contratar. Cotizar es gratis.', 'rejas', ''],
    carpinteria: ['Carpintero a domicilio, *cerca* *de* *ti.*', 'Muebles, puertas y madera. Recibe ofertas con precio, día de visita y garantía, y elige la que más te convenga. Cotizar es gratis.', '', ''],
    jardineria: ['Jardinero a domicilio, *cuando* *lo* *necesites.*', 'Poda, corte de pasto y mantenimiento. Agenda y recibe ofertas de jardineros cerca de ti. Cotizar es gratis.', 'podar el jardin', 'jardineria'],
    cisternas: ['Limpieza de cisternas *y* *tinacos.*', 'Lavado y desinfección a domicilio con especialistas verificados de tu zona. Compara ofertas antes de contratar. Cotizar es gratis.', 'limpiar cisterna', ''],
    mudanzas: ['¿Te mudas? *Consigue* *ayuda.*', 'Ayudantes para cargar, mover y acomodar, y armado o desarmado de muebles. El día y la hora vienen en cada oferta. Cotizar es gratis.', 'mudanza', ''],
    muebles: ['Armado de muebles *a* *domicilio.*', 'Closets, camas, mesas y más. Recibe ofertas de especialistas cerca de ti y elige. Cotizar es gratis.', 'armar muebles', ''],
    mandados: ['Mandados y trámites, *sin* *salir.*', 'Compras, pagos, trámites, entregas o hacer fila por ti. Compara ofertas de personas verificadas cerca de ti. Cotizar es gratis.', 'mandados', ''],
    mascotas: ['Paseador de mascotas *cerca* *de* *ti.*', 'Paseo, ejercicio y cuidado breve de tu mascota con personas verificadas de tu zona. Cotizar es gratis.', 'pasear a mi perro', '']
  };
  var ALIAS = { plomero: 'plomeria', electricista: 'electricidad', impermeabilizar: 'impermeabilizacion', desazolve: 'drenaje', pintor: 'pintura', albanil: 'albanileria', herrero: 'herreria', carpintero: 'carpinteria', jardin: 'jardineria', jardinero: 'jardineria', tinacos: 'cisternas', mudanza: 'mudanzas', paseador: 'mascotas' };
  var servicioSlug = (qs.get('servicio') || '').toLowerCase().normalize('NFD').replace(/[^a-z]/g, '');
  servicioSlug = ALIAS[servicioSlug] || servicioSlug;
  var servicio = SERVICIOS.hasOwnProperty(servicioSlug) ? SERVICIOS[servicioSlug] : null;
  if (servicio) (function () {
    var h1 = document.getElementById('hero-title'), lead = document.getElementById('heroLead');
    if (h1) {
      h1.textContent = '';
      servicio[0].split(' ').forEach(function (word, i) {
        if (i) h1.appendChild(document.createTextNode(' '));
        var w = document.createElement('span'), acc = /^\*.*\*$/.test(word);
        w.className = acc ? 'w accent' : 'w';
        w.textContent = acc ? word.slice(1, -1) : word;
        h1.appendChild(w);
      });
    }
    if (lead) lead.textContent = servicio[1];
    document.title = h1.textContent + ' · Acency';
  })();

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var scrollHooks = [];

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/g, ' '); }

  /* ---------- Intro ---------- */
  var intro = document.getElementById('intro');
  function finishIntro() {
    if (!root.classList.contains('intro-on')) { root.classList.add('ready'); return; }
    intro.classList.add('s3');
    root.classList.add('ready');
    try { sessionStorage.setItem('acency-intro', '1'); } catch (e) {}
    setTimeout(function () { root.classList.remove('intro-on'); intro.remove(); }, 1000);
  }
  if (root.classList.contains('intro-on')) {
    var count = document.getElementById('introCount'), bar = document.getElementById('introBar');
    var start = null, DUR = 1500, done = false;
    requestAnimationFrame(function () { intro.classList.add('s1'); });
    setTimeout(function () { intro.classList.add('s2'); }, 750);
    function tick(t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / DUR), e = 1 - Math.pow(1 - p, 3);
      count.textContent = Math.round(e * 100);
      bar.style.transform = 'scaleX(' + e + ')';
      if (p < 1) requestAnimationFrame(tick);
      else if (!done) { done = true; setTimeout(finishIntro, 380); }
    }
    requestAnimationFrame(tick);
    document.getElementById('introSkip').addEventListener('click', function () { done = true; finishIntro(); });
    setTimeout(function () { if (!done) { done = true; finishIntro(); } }, 4000);
  } else {
    root.classList.add('ready');
  }

  /* Escalonado de palabras del titular */
  document.querySelectorAll('.hero h1 .w').forEach(function (w, i) { w.style.transitionDelay = (0.12 + i * 0.06) + 's'; });

  /* ---------- Navegación ---------- */
  var nav = document.getElementById('nav');
  var links = Array.prototype.slice.call(document.querySelectorAll('#navLinks a'));
  var pill = document.getElementById('navPill');
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });

  function movePill(a) {
    if (!a) { pill.style.opacity = 0; links.forEach(function (l) { l.classList.remove('active'); }); return; }
    links.forEach(function (l) { l.classList.toggle('active', l === a); });
    pill.style.width = a.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    pill.style.opacity = 1;
  }
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 24);
    var mid = window.innerHeight * 0.35, current = null;
    sections.forEach(function (s, i) {
      if (!s) return;
      var r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) current = links[i];
    });
    movePill(current);
    updateSteps();
    /* Respaldo: nada queda oculto si el usuario salta rápido a una sección */
    document.querySelectorAll('.pending, .split-pending').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.remove('pending', 'split-pending');
    });
    scrollHooks.forEach(function (fn) { fn(y); });
  }

  /* Menú móvil */
  var sheet = document.getElementById('sheet'), menuBtn = document.getElementById('menuBtn');
  function setMenu(open) {
    sheet.classList.toggle('open', open);
    sheet.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menuBtn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) setTimeout(function () { var f = sheet.querySelector('a'); if (f) f.focus({ preventScroll: true }); }, 350);
  }
  menuBtn.addEventListener('click', function () { setMenu(!sheet.classList.contains('open')); });
  sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });

  /* ---------- Pasos con progreso ---------- */
  var steps = Array.prototype.slice.call(document.querySelectorAll('#steps .step'));
  var stepsEl = document.getElementById('steps'), prog = document.getElementById('stepsProgress');
  function updateSteps() {
    var r = stepsEl.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.min(1, Math.max(0, (vh * 0.62 - r.top) / r.height));
    prog.style.setProperty('--p', p.toFixed(3));
    var idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
    steps.forEach(function (s, i) { s.classList.toggle('on', i === idx); });
  }

  /* ---------- Revelado ---------- */
  var rvEls = document.querySelectorAll('.rv, .rv-group');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove('pending'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    rvEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.92) { el.classList.add('pending'); io.observe(el); }
    });
  }

  /* ---------- Parallax ---------- */
  var speedEls = Array.prototype.slice.call(document.querySelectorAll('[data-speed]'));
  var mouseEls = Array.prototype.slice.call(document.querySelectorAll('#stage .layer, [data-mouse]'));
  var mx = 0, my = 0, cx = 0, cy = 0;
  var heroEl = document.getElementById('inicio');
  if (!reduce) {
    if (fine) {
      heroEl.addEventListener('mousemove', function (e) {
        mx = e.clientX / window.innerWidth - 0.5;
        my = e.clientY / window.innerHeight - 0.5;
      });
      heroEl.addEventListener('mouseleave', function () { mx = 0; my = 0; });
    }
    (function loop() {
      cx += (mx - cx) * 0.07; cy += (my - cy) * 0.07;
      var vh = window.innerHeight, heroBottom = heroEl.getBoundingClientRect().bottom;
      if (heroBottom > 0) {
        var sy = Math.max(0, -heroEl.getBoundingClientRect().top);
        mouseEls.forEach(function (el) {
          var d = parseFloat(el.dataset.depth || el.dataset.mouse || 10);
          el.style.transform = 'translate3d(' + (cx * d).toFixed(2) + 'px,' + (cy * d - sy * d * 0.012).toFixed(2) + 'px,0)';
        });
      }
      if (window.innerWidth > 860) {
        speedEls.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) return;
          var off = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.speed);
          el.style.translate = '0 ' + off.toFixed(1) + 'px';
        });
      } else {
        speedEls.forEach(function (el) { el.style.translate = ''; });
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Botones magnéticos y brillo interno ---------- */
  document.querySelectorAll('.btn').forEach(function (b) {
    b.addEventListener('pointermove', function (e) {
      var r = b.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      b.style.setProperty('--mx', x + 'px'); b.style.setProperty('--my', y + 'px');
      if (fine && !reduce && b.hasAttribute('data-magnetic')) {
        b.style.transform = 'translate(' + ((x - r.width / 2) * 0.18).toFixed(1) + 'px,' + ((y - r.height / 2) * 0.28).toFixed(1) + 'px) scale(1.03)';
      }
    });
    b.addEventListener('pointerleave', function () { b.style.transform = ''; });
  });

  /* ---------- Cursor (con etiqueta contextual) ---------- */
  if (fine && !reduce) {
    root.classList.add('has-cursor');
    var ring = document.querySelector('.cursor'), dot = document.querySelector('.cursor-dot'), ringLabel = ring.querySelector('.cursor-label');
    var tx = -100, ty = -100, rx = -100, ry = -100;
    window.addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; dot.style.transform = 'translate(' + tx + 'px,' + ty + 'px)'; });
    window.addEventListener('pointerdown', function () { ring.classList.add('is-down'); });
    window.addEventListener('pointerup', function () { ring.classList.remove('is-down'); });
    document.addEventListener('mouseover', function (e) {
      ring.classList.toggle('is-hover', !!e.target.closest('a, button, summary, .svc, .value-card, .tile, input, textarea'));
      var lab = e.target.closest('[data-cursor]');
      ring.classList.toggle('has-label', !!lab);
      ringLabel.textContent = lab ? lab.getAttribute('data-cursor') : '';
    });
    document.addEventListener('mouseleave', function () { tx = ty = -100; });
    (function follow() { rx += (tx - rx) * 0.2; ry += (ty - ry) * 0.2; ring.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px)'; requestAnimationFrame(follow); })();
  }

  /* ---------- Avisos y portapapeles ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2800);
  }
  function copyText(text, ok, fail) {
    try { navigator.clipboard.writeText(text).then(ok, fail); } catch (e) { fail(); }
  }

  /* ---------- Copiar código de ejemplo ---------- */
  var copyBtn = document.getElementById('copyBtn'), code = document.getElementById('refCode');
  copyBtn.addEventListener('click', function () {
    var label = copyBtn.querySelector('span');
    function ok() { copyBtn.classList.add('done'); label.textContent = 'Copiado'; toast('Código copiado. El tuyo lo recibes al registrarte en la app.'); setTimeout(function () { copyBtn.classList.remove('done'); label.textContent = 'Copiar'; }, 1800); }
    function fallback() { var sel = window.getSelection(), rg = document.createRange(); rg.selectNodeContents(code); sel.removeAllRanges(); sel.addRange(rg); label.textContent = 'Seleccionado'; }
    copyText(code.textContent, ok, fallback);
  });

  /* =====================================================================
     AGREGADOS
     ===================================================================== */

  /* ---------- Texto que se descifra (etiquetas en mono) ---------- */
  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+';
  function scramble(el, text, dur) {
    text = text == null ? el.textContent : text;
    if (reduce) { el.textContent = text; return; }
    dur = dur || 700;
    var t0 = null, id = (el._scr = (el._scr || 0) + 1);
    function frame(t) {
      if (el._scr !== id) return;
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), out = '';
      for (var i = 0; i < text.length; i++) {
        var ch = text.charAt(i);
        out += (ch === ' ' || i < p * text.length) ? ch : GLYPHS.charAt((Math.random() * GLYPHS.length) | 0);
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if (!reduce && 'IntersectionObserver' in window) {
    var lio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { scramble(e.target, e.target.getAttribute('data-text'), 900); lio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    $$('main .label').forEach(function (l) { l.setAttribute('data-text', l.textContent.trim()); lio.observe(l); });
  }
  code.addEventListener('mouseenter', function () { scramble(code, 'ACENCY-LUIS24', 600); });

  /* ---------- Envolver palabras (titulares y manifiesto) ---------- */
  function wrapWords(el, cls, innerCls) {
    var words = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement('span'); s.className = cls;
            if (innerCls) { var i = document.createElement('span'); i.className = innerCls; i.textContent = part; s.appendChild(i); }
            else s.textContent = part;
            frag.appendChild(s); words.push(s);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
    return words;
  }
  if (!reduce && 'IntersectionObserver' in window) {
    var hio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('split-pending'); hio.unobserve(e.target); } });
    }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
    $$('h2.h2').forEach(function (h) {
      if (h.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      wrapWords(h, 'wm', 'wi').forEach(function (w, i) { w.firstChild.style.transitionDelay = (0.06 + i * 0.045).toFixed(3) + 's'; });
      h.classList.add('split-pending');
      hio.observe(h);
    });
  }

  /* ---------- Barra de progreso y volver arriba ---------- */
  var progBar = $('#progressBar'), toTop = $('#toTop'), toTopRing = $('#toTopRing');
  scrollHooks.push(function (y) {
    var max = root.scrollHeight - window.innerHeight, p = max > 0 ? clamp(y / max, 0, 1) : 0;
    progBar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    toTopRing.style.strokeDashoffset = (131.95 * (1 - p)).toFixed(1);
    toTop.classList.toggle('show', y > window.innerHeight * 0.9);
  });

  /* ---------- Barra fija de descarga (celular) ---------- */
  var dock = $('#dock'), heroEl = $('#inicio'), sheetEl = $('#sheet');
  var dockHide = [$('#descargar'), $('.footer'), $('#phone')];
  if (dock) scrollHooks.push(function () {
    var vh = window.innerHeight, past = heroEl && heroEl.getBoundingClientRect().bottom < vh * 0.35;
    var near = dockHide.some(function (el) { if (!el) return false; var r = el.getBoundingClientRect(); return r.top < vh && r.bottom > 0; });
    var on = !!past && !near && !(sheetEl && sheetEl.classList.contains('open'));
    dock.classList.toggle('show', on);
    root.classList.toggle('dock-on', on && window.innerWidth <= 860);
  });

  /* ---------- Capítulo actual (pantallas anchas) ---------- */
  var chapters = [['inicio', 'Inicio'], ['te-salva', 'Te salva'], ['servicios', 'Servicios'], ['como-funciona', 'Cómo funciona'], ['videos', 'Videos'], ['demo', 'Pruébalo'], ['diferencia', 'La diferencia'], ['seguridad', 'Seguridad'], ['nosotros', 'Nosotros'], ['especialistas', 'Especialistas'], ['descargar', 'Descargar'], ['preguntas', 'Preguntas']]
    .map(function (c) { return { el: document.getElementById(c[0]), name: c[1] }; });
  var tones = $$('main > section, .ticker, .footer').map(function (el) {
    var ink = el.classList.contains('on-ink') || el.classList.contains('ticker') || el.classList.contains('footer');
    return { el: el, tone: el.classList.contains('store') ? 'mint' : ink ? 'ink' : 'paper' };
  });
  var chapterEl = $('#chapter'), chNum = $('#chapterNum'), chName = $('#chapterName'), lastCh = -1;
  scrollHooks.push(function () {
    if (window.innerWidth < 1360) return;
    var mid = window.innerHeight / 2, idx = 0, tone = 'ink';
    chapters.forEach(function (c, i) { if (c.el && c.el.getBoundingClientRect().top <= mid) idx = i; });
    if (idx !== lastCh) { lastCh = idx; chNum.textContent = ('0' + (idx + 1)).slice(-2); scramble(chName, chapters[idx].name, 500); }
    tones.forEach(function (t) { var r = t.el.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) tone = t.tone; });
    chapterEl.setAttribute('data-tone', tone);
  });

  /* ---------- Hero: rejilla que se enciende bajo el puntero ---------- */
  var glow = $('#gridGlow');
  if (fine && glow) heroEl.addEventListener('pointermove', function (e) {
    var r = heroEl.getBoundingClientRect();
    glow.style.setProperty('--gx', (e.clientX - r.left) + 'px');
    glow.style.setProperty('--gy', (e.clientY - r.top) + 'px');
  });

  /* Hero: el aviso de ofertas cuenta en vivo */
  var chipO = $('#chipOffers'), chipAgo = $('#chipOffersAgo');
  if (chipO && !reduce) {
    var chipN = 3, chipCats = ['Plomería', 'Electricidad', 'Pintura', 'Jardinería'], chipCi = 0;
    setInterval(function () {
      if (document.hidden || heroEl.getBoundingClientRect().bottom < 0) return;
      chipN = chipN >= 3 ? 1 : chipN + 1;
      if (chipN === 1) chipCi = (chipCi + 1) % chipCats.length;
      chipO.textContent = chipN + (chipN === 1 ? ' oferta recibida' : ' ofertas recibidas');
      chipAgo.textContent = chipCats[chipCi] + ' · ' + (chipN === 1 ? 'ahora' : 'hace ' + (chipN - 1) + ' min');
      chipO.classList.remove('bump'); void chipO.offsetWidth; chipO.classList.add('bump');
    }, 2600);
  }

  /* ---------- Cinta de servicios: responde a la velocidad del scroll ---------- */
  var tickRows = $$('.ticker-row').map(function (row) {
    return { row: row, track: row.querySelector('.ticker-track'), dir: parseFloat(row.getAttribute('data-dir')) || -1, x: 0, w: 0 };
  });
  function fillTicker() {
    tickRows.forEach(function (t) {
      $$('.ticker-track', t.row).slice(1).forEach(function (n) { n.remove(); });
      t.w = t.track.getBoundingClientRect().width;
      if (!t.w) return;
      var copies = Math.max(2, Math.ceil((window.innerWidth * 2) / t.w) + 1);
      for (var i = 1; i < copies; i++) t.row.appendChild(t.track.cloneNode(true));
    });
  }
  if (tickRows.length && !reduce) {
    var tickOn = true, lastY = window.scrollY, vel = 0, sign = 1;
    fillTicker();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fillTicker);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { tickOn = es[0].isIntersecting; }).observe($('.ticker'));
    (function spin() {
      var y = window.scrollY, dy = y - lastY; lastY = y;
      vel += (dy - vel) * 0.12;
      if (Math.abs(dy) > 0.5) sign = dy > 0 ? 1 : -1;
      if (tickOn) {
        var speed = 0.55 + Math.min(Math.abs(vel) * 0.35, 14), skew = clamp(-vel * 0.18, -9, 9);
        tickRows.forEach(function (t) {
          if (!t.w) return;
          t.x += speed * t.dir * sign;
          if (t.x <= -t.w) t.x += t.w;
          if (t.x > 0) t.x -= t.w;
          t.row.style.transform = 'translate3d(' + t.x.toFixed(1) + 'px,0,0) skewX(' + skew.toFixed(2) + 'deg)';
        });
      }
      requestAnimationFrame(spin);
    })();
  }

  /* ---------- Manifiesto: las palabras se encienden al bajar ---------- */
  var man = $('#manifesto');
  if (man && !reduce) {
    var manWords = wrapWords(man, 'mw'), manK = -1;
    scrollHooks.push(function () {
      var r = man.getBoundingClientRect(), vh = window.innerHeight;
      var p = clamp((vh * 0.88 - r.top) / (r.height + vh * 0.3), 0, 1), k = Math.round(p * manWords.length);
      if (k === manK) return;
      manK = k;
      manWords.forEach(function (w, i) { w.classList.toggle('lit', i < k); });
    });
  }

  /* ---------- Precio de ejemplo que cuenta hasta $300 ---------- */
  function countTo(el, to, dur, fmt) {
    var t0 = null;
    function f(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(Math.round(to * e)); if (p < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  var priceEl = $('#priceCount');
  if (priceEl && !reduce && 'IntersectionObserver' in window) {
    var pio = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      pio.disconnect();
      countTo(priceEl, 300, 1500, function (v) { return '$' + v + ' MXN'; });
    }, { threshold: 0.8 });
    pio.observe(priceEl);
  }

  /* ---------- Luz que sigue al puntero en tarjetas ---------- */
  if (fine) $$('.spot').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--sx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--sy', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Buscador: "¿Qué te pasa en casa?" ---------- */
  var finder = $('#finder');
  if (finder) (function () {
    var svcs = $$('#svcList .svc'), clearB = $('#finderClear'), hint = $('#finderHint'), empty = $('#svcEmpty');
    var defaultHint = hint.textContent;
    var STOP = ' que una uno unos unas las los del por para con mis tus esta este esto tengo hay muy casa necesito quiero ayuda algo como donde cuando fue ' +
      'mas mucho poco tiene tienen todo toda ahi aqui hace hoy manana ';
    var URGENT = ['fuga', 'gas', 'huele', 'olor', 'corto', 'chispa', 'luz', 'apagon', 'inund', 'tapad', 'tapo', 'urgente', 'gotea', 'quemado'];
    var index = svcs.map(function (li, i) {
      return { li: li, i: i, title: li.querySelector('h3').textContent, k: norm(li.getAttribute('data-k') + ' ' + li.querySelector('h3').textContent).split(/\s+/).filter(Boolean) };
    });
    function score(entry, toks) {
      var s = 0;
      toks.forEach(function (t) {
        for (var j = 0; j < entry.k.length; j++) {
          var k = entry.k[j];
          if (k === t) { s += 3; return; }
          if (k.indexOf(t) === 0 || (k.length >= 4 && t.indexOf(k) === 0)) { s += 2; return; }
        }
      });
      return s;
    }
    function setHint(urgent, best) {
      hint.textContent = '';
      if (urgent) { var u = document.createElement('span'); u.className = 'urg'; u.textContent = 'Parece urgente'; hint.appendChild(u); }
      hint.appendChild(document.createTextNode('Te conviene: '));
      var s = document.createElement('strong'); s.textContent = best; hint.appendChild(s);
      hint.appendChild(document.createTextNode(urgent ? '. En la app puedes pedirlo para hoy mismo.' : '. Pídelo en la app y compara ofertas.'));
    }
    function run() {
      clearB.hidden = !finder.value;
      var toks = norm(finder.value).split(/\s+/).filter(function (t) { return t.length > 2 && STOP.indexOf(' ' + t + ' ') < 0; });
      if (!toks.length) {
        svcs.forEach(function (li) { li.classList.remove('is-out', 'is-in', 'is-best'); li.style.order = ''; });
        empty.hidden = true; hint.textContent = defaultHint;
        return;
      }
      var res = index.map(function (e) { return { e: e, s: score(e, toks) }; });
      var max = Math.max.apply(null, res.map(function (r) { return r.s; })), shown = 0, best = null;
      res.forEach(function (r) {
        var on = r.s > 0, li = r.e.li;
        li.classList.toggle('is-out', !on);
        li.classList.toggle('is-in', on);
        li.classList.toggle('is-best', on && r.s === max);
        li.style.order = on ? String(-r.s) : '';
        if (on) { shown++; if (r.s === max && !best) best = r.e.title; }
      });
      empty.hidden = shown > 0;
      if (!shown) { hint.textContent = 'Sin coincidencias en esta lista.'; return; }
      setHint(toks.some(function (t) { return URGENT.some(function (u) { return t.indexOf(u) === 0; }); }), best);
    }
    finder.addEventListener('input', run);
    clearB.addEventListener('click', function () { finder.value = ''; run(); finder.focus(); });
    $$('.finder-chips button').forEach(function (b) { b.addEventListener('click', function () { finder.value = b.getAttribute('data-q'); run(); }); });

    /* Si llegó desde un anuncio de un oficio, el buscador ya muestra ese oficio */
    if (servicio && servicio[2]) { finder.value = servicio[2]; run(); }

    /* Ejemplos que se escriben solos en el campo vacío */
    if (!reduce) {
      var EX = ['Ej. se tapó el drenaje', 'Ej. no hay luz en la cocina', 'Ej. gotea la regadera', 'Ej. quiero pintar mi cuarto', 'Ej. podar el jardín', 'Ej. huele a gas'];
      var ei = 0, ci = 3, del = false;
      (function type() {
        var ex = EX[ei], wait = del ? 28 : 65;
        if (document.activeElement !== finder && !finder.value) {
          ci += del ? -1 : 1;
          finder.placeholder = ex.slice(0, ci);
          if (!del && ci >= ex.length) { del = true; wait = 1800; }
          else if (del && ci <= 4) { del = false; ei = (ei + 1) % EX.length; wait = 350; }
        }
        setTimeout(type, wait);
      })();
    }
  })();

  /* ---------- Videos: YouTube solo carga al tocar play ---------- */
  var vidsSec = $('#videos');
  if (vidsSec) {
    $$('.vid', vidsSec).forEach(function (li) {
      var cfg = VIDEOS[li.getAttribute('data-video')] || {}, frame = $('.vid-frame', li), badge = $('.vid-badge', li);
      var yt = (cfg.youtube || '').trim(), file = (cfg.archivo || '').trim();
      if (!yt && !file) {
        frame.addEventListener('click', function () {
          toast('Este video llega muy pronto. Mientras, pruébalo aquí mismo.');
          var d = $('#demo'); if (d) d.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
        });
        return;
      }
      li.classList.add('has-video');
      badge.textContent = cfg.duracion || 'Video';
      var poster = cfg.poster || (yt ? 'https://i.ytimg.com/vi/' + encodeURIComponent(yt) + '/hqdefault.jpg' : '');
      if (poster) { var im = new Image(); im.alt = ''; im.loading = 'lazy'; im.src = poster; frame.insertBefore(im, frame.firstChild); }
      frame.addEventListener('click', function () {
        if (li.classList.contains('playing')) return;
        li.classList.add('playing');
        var el;
        if (yt) {
          el = document.createElement('iframe');
          el.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(yt) + '?autoplay=1&playsinline=1&rel=0';
          el.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
          el.title = $('h3', li).textContent;
        } else {
          el = document.createElement('video');
          el.src = file; el.controls = true; el.autoplay = true; el.playsInline = true;
          if (cfg.poster) el.poster = cfg.poster;
        }
        /* Un iframe no puede vivir dentro de un botón: el reproductor toma su lugar */
        var box = document.createElement('div'); box.className = 'vid-frame';
        box.appendChild(el); frame.replaceWith(box);
      });
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
      vidsSec.classList.toggle('in-view', es[0].isIntersecting && !reduce);
    }, { threshold: 0.2 }).observe(vidsSec);
  }

  /* ---------- Confeti ---------- */
  var cv = $('#confetti'), cctx = cv.getContext && cv.getContext('2d'), parts = [], confRaf = 0;
  function confetti(x, y, n) {
    if (reduce || !cctx) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    if (!confRaf) { cv.width = window.innerWidth * dpr; cv.height = window.innerHeight * dpr; cctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    var cols = ['#1aecd1', '#0b7a6d', '#ffffff', '#0a0a0a', '#f2b632'];
    for (var i = 0; i < (n || 90); i++) {
      parts.push({ x: x, y: y, vx: (Math.random() - 0.5) * 13, vy: -Math.random() * 12 - 4, g: 0.3 + Math.random() * 0.12, w: 5 + Math.random() * 6, h: 8 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: cols[i % cols.length], t: 0 });
    }
    if (!confRaf) confRaf = requestAnimationFrame(drawConfetti);
  }
  function drawConfetti() {
    cctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    parts = parts.filter(function (p) { return p.y < window.innerHeight + 40 && p.t < 240; });
    parts.forEach(function (p) {
      p.vy += p.g; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.t++;
      cctx.save(); cctx.translate(p.x, p.y); cctx.rotate(p.r); cctx.fillStyle = p.c;
      cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.t * 0.1)) + 1); cctx.restore();
    });
    confRaf = parts.length ? requestAnimationFrame(drawConfetti) : 0;
  }
  function burstFrom(el, n) { var r = el.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + r.height / 2, n); }

  /* ---------- Fechas ---------- */
  var DOW = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  var MON = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var MONL = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  function addDays(n) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n); return d; }
  function longDate(d) { return d.getDate() + ' de ' + MONL[d.getMonth()]; }
  function hhmm(d) { var m = d.getMinutes(); return d.getHours() + ':' + (m < 10 ? '0' : '') + m; }
  function money(n) { return n.toLocaleString('es-MX'); }

  /* ---------- Demo interactiva ----------
     Copia el flujo real de la app (repo ACENCY, solo lectura):
     crear_solicitud/ (tipo → describir → detalle → fotos → revisión),
     pantalla_de_espera/ofertas_sheet.dart (tarjeta de oferta), detalle_oferta_sheet.dart,
     metodos_pago/ (tarjeta retenida o efectivo) y la agenda del cliente
     (En camino → En tu puerta → Trabajando → Verificando). Datos de ejemplo. */
  var demoEl = $('#demo');
  if (demoEl) (function () {
    var screens = $$('.scr', demoEl), stepBtns = $$('#demoSteps button'), note = $('#demoNote'), sheet = $('#revSheet');
    var NOTES = [
      'Así se pide en la app: eliges el oficio y si lo quieres Agendar (tiempo estándar) o Urgente (hoy o mañana, sujeto a disponibilidad), cuentas qué pasa con tus palabras o con opciones rápidas, contestas un par de preguntas y mandas fotos y video. Tú no eliges la fecha: el día y la hora vienen en cada oferta.',
      'Tu solicitud queda abierta 20 horas y las ofertas aparecen en tiempo real. Cada tarjeta trae precio, día y hora de llegada, duración, si incluye materiales, días de garantía y cuándo vence la oferta. Si ninguna te convence, no aceptes ninguna: cotizar es gratis.',
      'Toca una oferta para ver el detalle: desglose del precio, la nota del especialista, su garantía, sus reseñas y fotos de sus proyectos. En algunos oficios también llegan ofertas de diagnóstico: pagas solo la visita de revisión y después recibes un precio firme.',
      'Eliges cómo pagar. Con tarjeta, Acency retiene el pago y tu especialista no recibe nada hasta que confirmas que quedó bien. En efectivo le pagas en mano antes de empezar, sin protección de pago digital.',
      'Al confirmar se abre un chat con tu especialista y el servicio entra a tu agenda. Sigues cada estado en tiempo real: en camino, en tu puerta, trabajando. Todo se habla por el chat, sin compartir tu teléfono.',
      'Cuando llega, revisa que sea la persona de la foto y el nombre del perfil, y entrégale tu código de 6 caracteres. Tu especialista lo escribe en su app y el servicio empieza oficialmente. Prueba también qué pasa si llega alguien que no es.',
      'Al terminar, el estado pasa a Verificando: revisas que funcione, el acabado y las fotos. Al confirmar se libera el pago (si fue con tarjeta) y empieza a contar la garantía de la oferta.',
      'Al final se califican los dos. Las reseñas son a doble ciego: se publican al mismo tiempo cuando ambos calificaron y quedan en el perfil del especialista.'
    ];
    /* Opciones rápidas copiadas de servicios/models.dart. d = tarifa de diagnóstico (solo oficios que lo permiten). */
    var CATS = {
      plomeria: { name: 'Plomería', quick: ['Tengo una fuga de agua que no para', 'Mi llave del baño gotea constantemente', 'Se tapó el drenaje de la cocina'], p: [350, 300, 290, 420], mat: 120, d: 200, fix: 650, dur: ['1 h', '1 h 30 min', '45 min', '1 h'] },
      electricidad: { name: 'Electricidad', quick: ['Se fue la luz de un cuarto y no regresa', 'Quiero instalar contactos e interruptores nuevos', 'Mi tablero de luz está fallando'], p: [450, 380, 420, 520], mat: 180, d: 250, fix: 780, dur: ['1 h 30 min', '2 h', '1 h', '1 h 30 min'] },
      desazolve: { name: 'Desazolve', quick: ['Mi drenaje está tapado y el agua no baja', 'Necesito desazolvar la cañería principal de mi casa', 'Los registros de mi patio están tapados'], p: [550, 480, 500, 620], mat: 150, d: 250, fix: 900, dur: ['1 h 30 min', '2 h', '1 h 30 min', '2 h'] },
      pintura: { name: 'Pintura', quick: ['Necesito pintar dos habitaciones interiores', 'Quiero pintar toda la fachada de mi casa', 'La pintura de mi sala está descascarada'], p: [1800, 1500, 1650, 2050], mat: 900, d: 0, dur: ['1 día', '1 día', '1 día', '2 días'] },
      jardineria: { name: 'Jardinería', quick: ['Necesito podar el pasto y los arbustos de mi jardín', 'Quiero mantenimiento general de mi jardín', 'Busco diseño y plantación de área verde nueva'], p: [500, 420, 450, 580], mat: 150, d: 0, dur: ['2 h', '2 h 30 min', '2 h', '3 h'] },
      albanileria: { name: 'Albañilería', quick: ['Tengo una pared cuarteada que necesita reparación', 'Quiero colocar azulejos en el baño', 'Necesito nivelar el piso de una habitación'], p: [950, 800, 880, 1100], mat: 350, d: 250, fix: 1400, dur: ['4 h', '5 h', '4 h', '1 día'] }
    };
    var PROS = [
      { id: 'dg', name: 'Daniel García', ini: 'DG', v: '', rating: 4.6, reviews: 128 },
      { id: 'mt', name: 'Miguel Torres', ini: 'MT', v: 'v2', rating: 4.8, reviews: 86 },
      { id: 'ls', name: 'Laura Sánchez', ini: 'LS', v: 'v4', rating: 0, reviews: 0 },
      { id: 'cm', name: 'Carlos Mendoza', ini: 'CM', v: 'v3', rating: 4.5, reviews: 203 }
    ];
    var REVIEWS = {
      dg: [['Ana', 5, 'Llegó a tiempo, explicó todo y dejó limpio.'], ['Jorge', 4, 'Buen trabajo y respetó el precio de la oferta.']],
      mt: [['Rocío', 5, 'Trajo los materiales y me enseñó el ticket.'], ['Luis', 5, 'Muy profesional, regresó a revisar sin costo.']],
      ls: [],
      cm: [['Paty', 5, 'Me explicó qué tenía antes de cotizar.'], ['Óscar', 4, 'Su dictamen fue muy claro, con fotos.']]
    };
    var NOTE = [
      'Llevo mi herramienta. Si hace falta material, te mando la lista y el precio por la app antes de comprar.',
      'Ya incluyo los materiales; te muestro el ticket al llegar.',
      'Soy nueva en Acency, pero llevo años en el oficio. Llego puntual.',
      'Primero reviso con calma y te mando mi dictamen con fotos; después te doy precio firme de la reparación.'
    ];
    var GAR = [15, 30, 0, 7];
    var CHECKS = ['Prueba que funcione de verdad', 'Revisa el acabado con buena luz', 'Que no quedaron herramientas ni escombro', 'Compara sus fotos con lo que ves'];
    var PAY_HOW = {
      tarjeta: ['Al confirmar se cobra el total: servicio, comisión de Acency e IVA.', 'Acency retiene el pago: tu especialista no recibe nada todavía.', 'Cuando confirmas que quedó bien, se libera el pago a tu especialista.', 'Si algo salió mal, el equipo de Acency revisa tu caso y gestiona el reembolso a tu tarjeta.'],
      efectivo: ['Le pagas el monto completo en mano, antes de que empiece. Ten el efectivo exacto.', 'Sin cargo de procesamiento y pago directo a tu especialista.', 'Sin protección de pago digital: un reembolso depende de la revisión del equipo de Acency.']
    };
    var DOWL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    var CODE_CH = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    var ARRIVE = [900, 1900, 3000, 4100];
    var st, timers = [], raf = 0;

    function fresh() {
      var cat = servicio && CATS[servicio[3]] ? servicio[3] : 'plomeria';
      return { stage: 0, cat: cat, mode: 'urgente', text: CATS[cat].quick[0], acc: 'si', mat: 'no', offers: [], shown: 0, needOffers: true, sentAt: Date.now(), picked: null, pay: 'tarjeta', code: '', impostor: false, verified: false, released: false, rating: 0, theirDone: false, sent: false };
    }
    st = fresh();
    function later(fn, ms) { timers.push(setTimeout(fn, reduce ? Math.min(ms, 80) : ms)); }
    function clearTimers() { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); }
    function first(name) { return name.split(' ')[0]; }
    function stars(r) { var f = Math.round(r); return '★★★★★'.slice(0, f) + '☆☆☆☆☆'.slice(0, 5 - f); }
    function bump(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
    function fmtHora(d) { var h = d.getHours(), m = d.getMinutes(), ap = h < 12 ? 'AM' : 'PM'; return (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m + ' ' + ap; }
    function dayLabel(d) {
      var a = new Date(), b = new Date(d); a.setHours(0, 0, 0, 0); b.setHours(0, 0, 0, 0);
      var diff = Math.round((b - a) / 864e5);
      return diff === 0 ? 'Hoy' : diff === 1 ? 'Mañana' : DOWL[b.getDay()] + ' ' + b.getDate();
    }
    function rateHtml(p, long) {
      return p.reviews ? '<span class="gold">' + stars(p.rating) + '</span> ' + p.rating.toFixed(1) + ' · ' + p.reviews + (long ? ' reseñas' : '') : '<span class="oc-new">Nuevo</span>' + (long ? ' Sin reseñas aún' : '');
    }

    /* Ofertas: el día y la hora los propone cada especialista */
    function slots() {
      var now = new Date(), out = [];
      if (st.mode === 'urgente') {
        var base = new Date(now); base.setSeconds(0, 0); base.setMinutes(base.getMinutes() < 30 ? 30 : 60);
        [90, 120, 60, 150].forEach(function (mins, i) {
          var d = new Date(base.getTime() + mins * 60000);
          if (d.getHours() >= 20 || d.getHours() < 8 || d.getDate() !== now.getDate()) { d = new Date(now); d.setDate(d.getDate() + 1); d.setHours(9 + i, i % 2 ? 30 : 0, 0, 0); }
          out.push(d);
        });
      } else {
        [[1, 10, 0], [2, 9, 0], [1, 16, 30], [3, 11, 0]].forEach(function (a) { var d = new Date(now); d.setDate(d.getDate() + a[0]); d.setHours(a[1], a[2], 0, 0); out.push(d); });
      }
      return out;
    }
    function buildOffers() {
      var c = CATS[st.cat], sl = slots(), now = Date.now();
      st.offers = PROS.map(function (p, i) {
        var diag = i === 3 && c.d > 0, mano = diag ? c.d : c.p[i], mat = !diag && i === 1 && st.mat === 'no' ? c.mat : 0;
        var exp = new Date(st.mode === 'urgente' ? sl[i].getTime() - 45 * 60000 : Math.max(now + 3 * 3600000, sl[i].getTime() - 13 * 3600000));
        exp.setMinutes(Math.round(exp.getMinutes() / 15) * 15, 0, 0);
        return { p: p, diag: diag, mano: mano, mat: mat, total: mano + mat, when: sl[i], exp: exp, dur: diag ? '30 min' : c.dur[i], gar: diag ? 0 : GAR[i], note: NOTE[diag ? 3 : i === 3 ? 0 : i] };
      });
      st.needOffers = false; st.shown = 0; st.picked = null;
      $('#offers').innerHTML = '';
    }
    function picked() {
      for (var i = 0; i < st.offers.length; i++) if (st.offers[i].p.id === st.picked) return st.offers[i];
      return null;
    }
    function ensurePicked() {
      if (st.needOffers) buildOffers();
      if (st.shown < st.offers.length) st.shown = st.offers.length;
      if (!st.picked) st.picked = st.offers[0].p.id;
    }
    function offerNode(o) {
      var li = document.createElement('li'), p = o.p;
      li.className = 'ocard' + (o.diag ? ' diag' : ''); li.setAttribute('data-id', p.id);
      var rows = [['Llegaría el día', dayLabel(o.when)], ['A la hora', fmtHora(o.when)], ['La duración del trabajo será', o.dur]];
      if (o.diag) rows.push(['Diagnóstico', 'El precio de la reparación te lo cotiza después de revisar.', 'wide']);
      else { rows.push(['Incluye materiales', o.mat ? 'Sí' : 'No', o.mat ? 'yes' : 'no']); rows.push(['Garantía', o.gar ? o.gar + ' días' : 'Sin garantía', o.gar ? 'blue' : 'mute']); }
      rows.push(['Oferta vence', dayLabel(o.exp) + ', ' + fmtHora(o.exp), 'orange']);
      li.innerHTML = '<button type="button"><span class="oc-top"><span class="av ' + p.v + '">' + p.ini + '</span>' +
        '<span class="oc-who"><b>' + p.name + '</b><span class="oc-rate">' + rateHtml(p) + '</span></span>' +
        '<span class="oc-price">' + (o.diag ? '<small>Tarifa de diagnóstico</small>' : '') + '<b>$' + money(o.total) + '</b><small>MXN' + (o.mat ? ' · incl. mat.' : '') + '</small></span></span>' +
        (o.diag ? '<span class="oc-diag"><b>Diagnóstico</b>Visita de revisión. Después recibes un dictamen con fotos y un precio en firme.</span>' : '') +
        '<span class="oc-info">' + rows.map(function (r) { return '<span' + (r[2] === 'wide' ? ' class="wide"' : '') + '><i>' + r[0] + '</i><em class="' + (r[2] || '') + '">' + r[1] + '</em></span>'; }).join('') + '</span></button>';
      li.addEventListener('animationend', function () { li.classList.add('settled'); }, { once: true });
      return li;
    }
    function renderOffers() {
      var ul = $('#offers'), have = {};
      $$('.ocard', ul).forEach(function (li) { have[li.getAttribute('data-id')] = 1; });
      st.offers.slice(0, st.shown).forEach(function (o) { if (!have[o.p.id]) ul.appendChild(offerNode(o)); });
      $('#offersHint').hidden = !st.shown;
    }
    function updateCount(animate) {
      var b = $('#offerCount');
      b.textContent = st.shown;
      $('#offerWord').textContent = st.shown === 1 ? 'oferta recibida' : 'ofertas recibidas';
      if (animate) bump(b, 'bump');
    }
    function tickAvail() {
      var left = Math.max(0, 20 * 3600000 - (Date.now() - st.sentAt)), h = Math.floor(left / 3600000), m = Math.floor(left % 3600000 / 60000);
      $('#avail').textContent = 'Disponible por ' + h + 'h ' + m + 'm más';
      later(tickAvail, 20000);
    }

    /* Paso 1: pide */
    function renderCats() { $$('#catGrid button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === st.cat)); }); }
    function renderWhen() {
      $$('#whenSeg button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === st.mode)); });
      $('#whenHint').textContent = st.mode === 'urgente'
        ? 'Atención prioritaria, sujeta a disponibilidad: los especialistas solo pueden ofrecerte hoy o mañana.'
        : 'Atención bajo tiempo estándar. El día y la hora te los propone cada especialista en su oferta.';
    }
    function renderQuick() {
      var box = $('#quick'); box.innerHTML = '';
      CATS[st.cat].quick.forEach(function (q) {
        var b = document.createElement('button'); b.type = 'button'; b.textContent = q;
        b.setAttribute('aria-pressed', String(q === st.text)); box.appendChild(b);
      });
    }
    function renderChips() {
      $$('.chips', screens[0]).forEach(function (g) {
        var cur = st[g.getAttribute('data-q') === 'acceso' ? 'acc' : 'mat'];
        $$('button', g).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === cur)); });
      });
    }
    function openReview() {
      var c = CATS[st.cat];
      $('#revSvc').textContent = c.name + ' · ' + (st.mode === 'urgente' ? 'Urgente' : 'Agendar');
      $('#revDesc').textContent = $('#demoText').value.trim() || 'Sin descripción';
      $('#revAcc').textContent = st.acc === 'si' ? 'Visible / fácil acceso' : 'Oculto / difícil acceso';
      $('#revMat').textContent = st.mat === 'si' ? 'Sí, cuento con materiales' : 'Tu especialista comprará los materiales';
      sheet.hidden = false;
    }

    var ENTER = [];
    ENTER[0] = function () {
      renderCats(); renderWhen(); renderQuick(); renderChips();
      $('#demoText').value = st.text;
    };
    ENTER[1] = function () {
      if (st.needOffers) buildOffers();
      $('#offersCat').textContent = CATS[st.cat].name + ' · ' + (st.mode === 'urgente' ? 'Urgente' : 'Agendar');
      var box = $('.radar-box', screens[1]);
      updateCount(false); renderOffers(); tickAvail();
      if (st.shown < st.offers.length) {
        box.classList.remove('done');
        ARRIVE.slice(st.shown).forEach(function (ms) {
          later(function () {
            st.shown++; renderOffers(); updateCount(true);
            if (st.shown === st.offers.length) box.classList.add('done');
          }, ms);
        });
      } else box.classList.add('done');
    };
    function showTab(name) {
      $$('#detTabs button').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-tab') === name)); });
      $$('.tabp', screens[2]).forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== name; });
    }
    ENTER[2] = function () {
      ensurePicked();
      var o = picked(), p = o.p, av = $('#detAv');
      av.textContent = p.ini; av.className = 'av ' + p.v;
      $('#detName').textContent = p.name;
      $('#detRate').innerHTML = rateHtml(p, true);
      $('#detDiag').hidden = !o.diag;
      var bill = [[o.diag ? 'Tarifa de diagnóstico' : 'Mano de obra', o.mano]];
      if (o.mat) bill.push(['Precio de materiales', o.mat]);
      $('#detBill').innerHTML = bill.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>$' + money(r[1]) + '</dd></div>'; }).join('') +
        '<div class="tot"><dt>Total a pagar</dt><dd>$' + money(o.total) + ' MXN</dd></div>';
      $('#detNote').textContent = o.note;
      var gar = $('#detGar'), mat = $('#detMat');
      if (o.diag) gar.innerHTML = '<b><svg class="ico"><use href="#i-shield"/></svg>Visita de diagnóstico</b><p>No lleva materiales ni garantía. Si hace falta reparar, te llega una cotización aparte con precio firme y tú decides si la contratas.</p>';
      else if (o.gar) gar.innerHTML = '<b><svg class="ico"><use href="#i-shield"/></svg>Garantía: ' + o.gar + ' días</b><p>Si el trabajo realizado presenta fallas relacionadas directamente con el servicio, tu especialista podrá regresar para corregirlo o repararlo sin costo adicional.</p>';
      else gar.innerHTML = '<b><svg class="ico"><use href="#i-shield"/></svg>Sin garantía</b><p>Esta oferta no incluye días de garantía. Si el trabajo quedó mal, puedes reportarlo con un video dentro de las 24 horas después de terminado.</p>';
      mat.hidden = o.diag;
      if (o.mat) mat.innerHTML = '<b>¿Qué significa que incluye materiales?</b><p>Pagas la mano de obra y los materiales juntos, así es menos probable que haya pausas, y puedes ver el comprobante de lo que compró.</p>';
      else if (st.mat === 'si') mat.innerHTML = '<b>Tú tienes los materiales</b><p>Tu especialista llega directo a trabajar con tus materiales. No va a comprar nada.</p>';
      else mat.innerHTML = '<b>¿Qué significa sin materiales?</b><p>Durante el servicio, tu especialista te informará el costo de los materiales para que los apruebes. Nunca pagas un material que no autorizaste.</p>';
      var revs = REVIEWS[p.id];
      $('#detRevs').innerHTML = revs.length ? revs.map(function (r) { return '<li><b>' + r[0] + '</b><span class="gold">' + stars(r[1]) + '</span><p>“' + r[2] + '”</p></li>'; }).join('') : '<li class="empty"><b>Sin reseñas aún</b><p>Las reseñas se publican cuando cliente y especialista ya calificaron.</p></li>';
      $('#detProjs').innerHTML = p.reviews ? '<span class="pj a"></span><span class="pj b"></span><span class="pj c"></span><small>Fotos de trabajos anteriores · ejemplo</small>' : '<p class="empty"><b>Sin proyectos aún</b>Este especialista no ha subido fotos de proyectos todavía.</p>';
      showTab('info');
    };
    function renderPay() {
      var o = picked();
      $$('#payOpts button').forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-pay') === st.pay)); });
      $('#payHow').innerHTML = PAY_HOW[st.pay].map(function (t) { return '<li>' + t + '</li>'; }).join('');
      $('#payTotal').innerHTML = '$' + money(o.total) + '<small>MXN</small>';
      $('#payFee').textContent = st.pay === 'efectivo' ? 'Ten listo el efectivo exacto cuando llegue tu especialista.'
        : o.mano >= 1500 ? 'En servicios de $1,500 MXN o más, Acency absorbe el cargo de procesamiento de la tarjeta.'
        : 'Con tarjeta se suma un cargo de procesamiento; Acency lo absorbe en servicios de $1,500 MXN o más.';
    }
    ENTER[3] = function () {
      ensurePicked();
      $('#payWho').textContent = picked().p.name + ' · ' + CATS[st.cat].name;
      renderPay();
    };
    ENTER[4] = function () {
      ensurePicked();
      var o = picked(), fn = first(o.p.name), now = new Date();
      var lis = $$('#track li'), title = $('#trackTitle'), btn = $('#arrivedBtn');
      lis.forEach(function (li) { li.className = ''; li.querySelector('time').textContent = ''; });
      lis[0].className = 'done'; lis[0].querySelector('time').textContent = hhmm(now);
      lis[1].className = 'now';
      $('#trackSub').textContent = 'Servicio confirmado · ' + (st.pay === 'tarjeta' ? 'pago retenido' : 'pago en efectivo');
      title.textContent = fn + ' va en camino';
      btn.disabled = true; btn.textContent = 'Esperando llegada…'; btn.classList.remove('mint');

      var route = $('#route'), car = $('#car'), eta = $('#eta'), L = route.getTotalLength(), t0 = null, DUR = reduce ? 1 : 5200;
      route.style.strokeDasharray = L; route.style.strokeDashoffset = L;
      car.setAttribute('transform', 'translate(30 113)');
      eta.textContent = '12';
      function frame(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / DUR), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2, pt = route.getPointAtLength(L * e);
        car.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
        route.style.strokeDashoffset = (L * (1 - e)).toFixed(1);
        eta.textContent = Math.max(0, Math.ceil(12 * (1 - e)));
        if (p < 1) { raf = requestAnimationFrame(frame); return; }
        lis[1].className = 'done'; lis[1].querySelector('time').textContent = hhmm(now);
        lis[2].className = 'now'; lis[2].querySelector('time').textContent = hhmm(new Date(now.getTime() + 12 * 60000));
        title.textContent = fn + ' está en tu puerta';
        btn.disabled = false; btn.textContent = 'Ver mi código de seguridad'; btn.classList.add('mint');
      }
      raf = requestAnimationFrame(frame);

      var body = $('#chatBody');
      body.innerHTML = '';
      function typing() { var t = document.createElement('div'); t.className = 'msg them typing'; t.innerHTML = '<i></i><i></i><i></i>'; body.appendChild(t); }
      function say(who, text) { var ty = $('.typing', body); if (ty) ty.remove(); var m = document.createElement('div'); m.className = 'msg ' + who; m.textContent = text; body.appendChild(m); }
      say('sys', 'Pedido confirmado. Este chat es privado: no compartas tu teléfono.');
      later(typing, 700);
      later(function () { say('them', 'Hola, soy ' + fn + '. Ya voy para allá. ¿Es la casa del portón gris?'); }, 1700);
      later(function () { say('me', 'Sí, es esa. ¡Gracias!'); }, 3300);
    };
    function setBubble() {
      var o = picked(), av = $('#doorAv'), b = $('#doorBubble');
      av.textContent = st.impostor ? '?' : o.p.ini;
      av.className = 'av ' + (st.impostor ? 'v0' : o.p.v);
      b.textContent = st.impostor ? 'Buenas, vengo de parte de Acency a hacer el trabajo. ¿Me pasa el código?' : 'Hola, soy ' + first(o.p.name) + ', de Acency. ¿Me das tu código?';
      bump(b, 'swap');
    }
    function codeResult(kind, text) {
      var box = $('#codeResult');
      box.innerHTML = '<p class="' + kind + '"><svg class="ico"><use href="#' + (kind === 'good' ? 'i-check' : 'i-alert') + '"/></svg><span></span></p>';
      box.querySelector('span').textContent = text;
    }
    ENTER[5] = function () {
      ensurePicked();
      var o = picked(), pav = $('#profAv');
      st.code = ''; for (var i = 0; i < 6; i++) st.code += CODE_CH.charAt(Math.floor(Math.random() * CODE_CH.length));
      st.impostor = false; st.verified = false;
      $$('#codeDigits b').forEach(function (b, i) { b.textContent = st.code.charAt(i); });
      pav.textContent = o.p.ini; pav.className = 'av ' + o.p.v;
      $('#profName').textContent = o.p.name;
      setBubble();
      $('#codeResult').innerHTML = '';
      $('#work').hidden = true; $('#workBar').style.transform = 'scaleX(0)';
      $('#doneBtn').hidden = true;
      $('#codeOk').disabled = false; $('#codeBad').disabled = false;
      var imp = $('#impostorBtn'); imp.hidden = false; imp.textContent = 'Simular a alguien que no es';
    };
    ENTER[6] = function () {
      ensurePicked();
      var o = picked(), c = CATS[st.cat], fn = first(o.p.name);
      var lis = $$('#track li');
      lis.forEach(function (li) { li.className = 'done'; });
      $('#escName').textContent = fn;
      $('#verSub').textContent = 'Estado: Verificando';
      var checks = $('#checks'), dict = $('#dict'), wbox = $('#warrantyBox');
      if (o.diag) {
        $('#verTitle').textContent = 'Recibiste tu dictamen';
        $('#phA').textContent = 'Lo que encontró'; $('#phB').textContent = 'Detalle';
        checks.hidden = true; dict.hidden = false; wbox.hidden = true;
        dict.innerHTML = '<b>Dictamen de ' + fn + '</b><p>Revisé la instalación y encontré el origen de la falla. Te dejo fotos y lo que hay que hacer para repararla.</p>' +
          '<div class="dict-q"><span>Cotización de la reparación</span><strong>$' + money(c.fix) + ' MXN</strong><small>Precio en firme. Es el mismo especialista que realizó tu diagnóstico. Tú decides si lo contratas.</small></div>';
      } else {
        $('#verTitle').textContent = '¿Quedó como esperabas?';
        $('#phA').textContent = 'Antes'; $('#phB').textContent = 'Después';
        checks.hidden = false; dict.hidden = true; wbox.hidden = false;
        checks.innerHTML = CHECKS.map(function (t) { return '<li><button type="button" aria-pressed="false"><i></i>' + t + '</button></li>'; }).join('');
        $('#warrantyDays').textContent = o.gar ? o.gar + ' días de garantía' : 'Sin garantía';
        $('#warrantyUntil').textContent = o.gar ? (st.released ? 'Activa hasta el ' + longDate(addDays(o.gar)) : 'Empieza a contar cuando confirmes') : 'Si quedó mal, repórtalo con un video dentro de 24 h';
        var ringEl = $('#warrantyRing');
        ringEl.style.strokeDashoffset = '113.1';
        if (o.gar && st.released) later(function () { ringEl.style.strokeDashoffset = (113.1 * (1 - o.gar / 30)).toFixed(1); }, 250);
      }
      var esc = $('#escrow'), s = $('#escStatus');
      esc.hidden = st.pay !== 'tarjeta';
      esc.setAttribute('data-state', st.released ? 'released' : 'held');
      s.classList.toggle('ok', st.released || st.pay !== 'tarjeta');
      s.lastChild.textContent = statusText(o);
      var btn = $('#confirmBtn');
      btn.textContent = st.released ? 'Calificar a ' + fn : o.diag ? 'Confirmar visita terminada' : 'Confirmar trabajo terminado';
      btn.classList.add('mint');
      var cn = $('#claimNote'); cn.hidden = true;
      cn.textContent = o.diag ? 'Si el dictamen no te convence, no tienes que contratar la reparación. También puedes reportar el servicio desde la app.'
        : 'Díselo a ' + fn + ' antes de confirmar: este es el momento de pedir que lo corrija. Si ya confirmaste y la oferta trae garantía, la activas desde Mi actividad.';
    };
    function statusText(o) {
      var fn = first(o.p.name);
      if (st.pay !== 'tarjeta') return 'Pagaste en efectivo antes de que empezara. Con efectivo no hay pago retenido.';
      if (!st.released) return 'Pagaste con tarjeta. Acency retiene el pago hasta que confirmes.';
      return 'Confirmaste y Acency liberó el pago a ' + fn + ' (suele tardar unas 48 h en llegar a su cuenta).';
    }
    function renderStars() {
      $$('#rateStars button').forEach(function (b) {
        var v = +b.getAttribute('data-v');
        b.classList.toggle('on', v <= st.rating);
        b.setAttribute('aria-checked', String(v === st.rating));
      });
    }
    function mineText() {
      var tags = $$('#rateTags button[aria-pressed="true"]').map(function (b) { return b.textContent; });
      return stars(st.rating) + (tags.length ? ' · ' + tags.join(', ') : '');
    }
    ENTER[7] = function () {
      ensurePicked();
      var fn = first(picked().p.name);
      $('#rateTitle').textContent = 'Califica a ' + fn;
      $('#theirLabel').textContent = fn + ' sobre ti';
      st.rating = 0; st.theirDone = false; st.sent = false;
      renderStars();
      $$('#rateTags button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      $('#sealed').classList.remove('open');
      $('#mineText').textContent = 'Aún no calificas';
      $('#theirText').textContent = 'Calificando…';
      var nt = $('#sealNote'); nt.classList.remove('ok'); nt.textContent = 'Las reseñas son a doble ciego: se publican al mismo tiempo cuando los dos calificaron.';
      var send = $('#sendRate'); send.hidden = false; send.disabled = true; send.classList.remove('mint');
      $('#demoEnd').hidden = true;
      later(function () {
        st.theirDone = true;
        $('#theirText').textContent = '★★★★★ “Muy claro con lo que necesitaba y súper amable.”';
        if (!st.sent) nt.textContent = fn + ' ya te calificó. Su reseña se publica cuando tú también califiques.';
        else reveal();
      }, 2200);
    };
    function reveal() {
      var fn = first(picked().p.name), nt = $('#sealNote');
      $('#sealed').classList.add('open');
      nt.classList.add('ok');
      nt.textContent = 'Listo: las dos reseñas se publicaron al mismo tiempo y quedan en el perfil de ' + fn + '.';
      $('#sendRate').hidden = true;
      $('#demoEnd').hidden = false;
      stepBtns.forEach(function (b) { b.classList.add('done'); });
      burstFrom($('#sealed'), 110);
    }

    function go(n) {
      clearTimers();
      sheet.hidden = true;
      st.stage = n;
      screens.forEach(function (s, i) {
        s.classList.toggle('is-on', i === n);
        s.classList.toggle('is-past', i < n);
        s.setAttribute('aria-hidden', String(i !== n));
        if ('inert' in s) s.inert = i !== n;
      });
      stepBtns.forEach(function (b, i) {
        if (i === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
        b.classList.toggle('done', i < n);
      });
      note.textContent = NOTES[n];
      bump(note, 'swap');
      screens[n].scrollTop = 0;
      ENTER[n]();
    }

    /* Controles dentro del teléfono */
    $('#catGrid').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      st.cat = b.getAttribute('data-cat'); st.needOffers = true; st.text = CATS[st.cat].quick[0];
      renderCats(); renderQuick(); $('#demoText').value = st.text;
    });
    $('#whenSeg').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      st.mode = b.getAttribute('data-mode'); st.needOffers = true; renderWhen();
    });
    $('#quick').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      st.text = b.textContent; $('#demoText').value = st.text; renderQuick();
    });
    $('#demoText').addEventListener('input', function () { st.text = this.value; renderQuick(); });
    $$('.chips', screens[0]).forEach(function (g) {
      g.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        st[g.getAttribute('data-q') === 'acceso' ? 'acc' : 'mat'] = b.getAttribute('data-v');
        st.needOffers = true; renderChips();
      });
    });
    $('#reviewBtn').addEventListener('click', openReview);
    $('#revBack').addEventListener('click', function () { sheet.hidden = true; });
    $('#publishBtn').addEventListener('click', function () { st.needOffers = true; st.sentAt = Date.now(); go(1); });
    $('#offers').addEventListener('click', function (e) {
      var li = e.target.closest('.ocard'); if (!li) return;
      st.picked = li.getAttribute('data-id'); go(2);
    });
    $('#backOffers').addEventListener('click', function () { go(1); });
    $('#detTabs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) showTab(b.getAttribute('data-tab')); });
    $('#hireBtn').addEventListener('click', function () { burstFrom($('#hireBtn'), 70); st.released = false; go(3); });
    $('#payOpts').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; st.pay = b.getAttribute('data-pay'); renderPay(); });
    $('#payBtn').addEventListener('click', function () { st.released = false; go(4); });
    $('#arrivedBtn').addEventListener('click', function () { go(5); });
    $('#codeOk').addEventListener('click', function () {
      if (st.verified) return;
      if (st.impostor) { codeResult('warn', '¡Ojo! No es la persona del perfil. No le des tu código ni le abras la puerta; repórtalo desde la app.'); bump($('#codeDigits'), 'shake'); return; }
      st.verified = true;
      var fn = first(picked().p.name);
      codeResult('good', 'Le diste tu código y ' + fn + ' lo escribió en su app: el servicio empezó.' + (st.pay === 'efectivo' ? ' Como elegiste efectivo, le pagas antes de que empiece.' : ''));
      $('#codeOk').disabled = true; $('#codeBad').disabled = true; $('#impostorBtn').hidden = true;
      var lis = $$('#track li'); lis[2].className = 'done'; lis[3].className = 'done'; lis[3].querySelector('time').textContent = hhmm(new Date());
      var w = $('#work'), wb = $('#workBar'); w.hidden = false;
      w.querySelector('span').textContent = 'Trabajando en tu servicio…';
      if (wb.animate && !reduce) wb.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 2600, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
      else wb.style.transform = 'scaleX(1)';
      later(function () { w.querySelector('span').textContent = 'Terminó: ahora revisa su trabajo'; $('#doneBtn').hidden = false; }, 2700);
    });
    $('#codeBad').addEventListener('click', function () {
      if (st.verified) return;
      if (st.impostor) codeResult('good', 'Bien visto: no le des tu código ni le abras la puerta, y repórtalo desde la app.');
      else { codeResult('warn', 'Compara otra vez con la foto y el nombre del perfil: sí es la persona asignada.'); bump($('#codeDigits'), 'shake'); }
    });
    $('#impostorBtn').addEventListener('click', function () {
      st.impostor = !st.impostor;
      this.textContent = st.impostor ? 'Volver con el especialista real' : 'Simular a alguien que no es';
      $('#codeResult').innerHTML = '';
      setBubble();
    });
    $('#doneBtn').addEventListener('click', function () { go(6); });
    $('#checks').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (b) b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
    });
    $('#confirmBtn').addEventListener('click', function () {
      if (st.released) { go(7); return; }
      st.released = true;
      var o = picked(), s = $('#escStatus');
      $('#escrow').setAttribute('data-state', 'released');
      s.classList.add('ok');
      s.lastChild.textContent = o.diag && st.pay !== 'tarjeta' ? 'Visita confirmada. La reparación te llega como una oferta nueva: tú decides si la contratas.' : statusText(o);
      if (!o.diag && o.gar) {
        $('#warrantyUntil').textContent = 'Activa hasta el ' + longDate(addDays(o.gar));
        $('#warrantyRing').style.strokeDashoffset = (113.1 * (1 - o.gar / 30)).toFixed(1);
      }
      this.textContent = 'Calificar a ' + first(o.p.name);
      $('#claimNote').hidden = true;
    });
    $('#claimBtn').addEventListener('click', function () { var c = $('#claimNote'); c.hidden = !c.hidden; });
    $('#rateStars').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || st.sent) return;
      st.rating = +b.getAttribute('data-v'); renderStars();
      $('#mineText').textContent = mineText();
      var send = $('#sendRate'); send.disabled = false; send.classList.add('mint');
    });
    $('#rateTags').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || st.sent) return;
      b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
      if (st.rating) $('#mineText').textContent = mineText();
    });
    $('#sendRate').addEventListener('click', function () {
      if (!st.rating || st.sent) return;
      st.sent = true; this.disabled = true;
      $('#mineText').textContent = mineText();
      if (st.theirDone) reveal();
      else $('#sealNote').textContent = 'Enviada. Esperando a que ' + first(picked().p.name) + ' termine de calificar…';
    });
    $('#againBtn').addEventListener('click', function () { st = fresh(); go(0); });

    /* Pasos laterales y reinicio */
    stepBtns.forEach(function (b) { b.addEventListener('click', function () { stopAuto(); go(+b.getAttribute('data-go')); }); });
    $('#demoReset').addEventListener('click', function () { stopAuto(); st = fresh(); go(0); });

    /* Hora real en la barra de estado */
    function clock() { var d = new Date(), h = d.getHours() % 12 || 12, m = d.getMinutes(); $('#phoneTime').textContent = h + ':' + (m < 10 ? '0' : '') + m; }
    clock(); setInterval(clock, 20000);

    /* Piloto automático: un dedo fantasma recorre la demo */
    function script() {
      return [
        ['wait', 500], ['tap', '#catGrid [data-cat="' + st.cat + '"]'], ['wait', 400], ['tap', '#whenSeg [data-mode="urgente"]'], ['wait', 500],
        ['tap', '#quick button:nth-child(1)'], ['wait', 500], ['tap', '.chips[data-q="mat"] [data-v="no"]'], ['wait', 400],
        ['tap', '#reviewBtn'], ['wait', 1400], ['tap', '#publishBtn'], ['wait', 4900],
        ['tap', '#offers .ocard:nth-child(2) button'], ['wait', 1500], ['tap', '#detTabs [data-tab="resenas"]'], ['wait', 1300],
        ['tap', '#detTabs [data-tab="info"]'], ['wait', 700], ['tap', '#hireBtn'], ['wait', 900],
        ['tap', '#payOpts [data-pay="tarjeta"]'], ['wait', 1300], ['tap', '#payBtn'],
        ['tap', '#arrivedBtn'], ['wait', 1300], ['tap', '#codeOk'],
        ['tap', '#doneBtn'], ['wait', 900], ['tap', '#checks li:nth-child(1) button'], ['wait', 400], ['tap', '#checks li:nth-child(3) button'], ['wait', 600],
        ['tap', '#confirmBtn'], ['wait', 1900], ['tap', '#confirmBtn'], ['wait', 900],
        ['tap', '#rateStars [data-v="5"]'], ['wait', 500], ['tap', '#rateTags button:nth-child(1)'], ['wait', 350],
        ['tap', '#rateTags button:nth-child(2)'], ['wait', 600], ['tap', '#sendRate']
      ];
    }
    var SCRIPT = [], autoOn = false, autoIdx = 0, autoT = 0, autoBtn = $('#demoAuto'), ghost = $('#ghost'), screenBox = $('.phone-screen', demoEl);
    function setAutoLabel() { autoBtn.querySelector('span').textContent = autoOn ? 'Detener recorrido' : 'Verlo en automático'; }
    function stopAuto() { autoOn = false; clearTimeout(autoT); ghost.classList.remove('on'); setAutoLabel(); }
    function runAuto() {
      if (!autoOn) return;
      var a = SCRIPT[autoIdx++];
      if (!a) { stopAuto(); return; }
      if (a[0] === 'wait') autoT = setTimeout(runAuto, a[1]);
      else tapOn(a[1], 0);
    }
    function tapOn(sel, tries) {
      if (!autoOn) return;
      var el = $(sel, demoEl), scr = el && el.closest('.scr');
      var ready = el && !el.disabled && el.offsetParent !== null && (!scr || scr.classList.contains('is-on'));
      if (!ready) { if (tries < 60) autoT = setTimeout(function () { tapOn(sel, tries + 1); }, 200); else stopAuto(); return; }
      if (scr) {
        var er0 = el.getBoundingClientRect(), sr = scr.getBoundingClientRect();
        if (er0.bottom > sr.bottom - 12) scr.scrollTop += er0.bottom - sr.bottom + 24;
        else if (er0.top < sr.top + 56) scr.scrollTop -= sr.top + 56 - er0.top;
      }
      var er = el.getBoundingClientRect(), br = screenBox.getBoundingClientRect(), scale = br.width / screenBox.offsetWidth || 1;
      ghost.style.transform = 'translate(' + ((er.left + er.width / 2 - br.left) / scale).toFixed(1) + 'px,' + ((er.top + er.height / 2 - br.top) / scale).toFixed(1) + 'px)';
      ghost.classList.add('on');
      autoT = setTimeout(function () {
        if (!autoOn) return;
        bump(ghost, 'tap');
        el.click();
        autoT = setTimeout(runAuto, 300);
      }, 750);
    }
    function startAuto() {
      autoOn = true; autoIdx = 0; setAutoLabel();
      st = fresh(); SCRIPT = script(); go(0);
      autoT = setTimeout(runAuto, 300);
    }
    autoBtn.addEventListener('click', function () {
      if (autoOn) { stopAuto(); return; }
      if (window.innerWidth <= 980) $('#phone').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      startAuto();
    });
    $('#phone').addEventListener('pointerdown', function (e) { if (e.isTrusted && autoOn) stopAuto(); });

    /* Arranca solo la primera vez que la demo entra en pantalla */
    if (!reduce && 'IntersectionObserver' in window) {
      var touched = false;
      $('#phone').addEventListener('pointerdown', function () { touched = true; });
      var dio = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return;
        dio.disconnect();
        if (!touched && !autoOn) setTimeout(function () { if (!touched && !autoOn && st.stage === 0) startAuto(); }, 900);
      }, { threshold: 0.6 });
      dio.observe($('#phone'));
    }

    go(0);
  })();

  /* ---------- Seguridad: animaciones solo en pantalla ---------- */
  var bento = $('.bento');
  var slot = $('#slot'), slotTimer = 0, slotCur = [6, 1, 4, 9, 2, 7], SLOT_H = 64;
  /* Como en la app: 6 caracteres (letras y números). */
  var SLOT_CH = ['A', '3', 'K', '7', 'P', '2', 'Q', '9', 'M', '4'];
  if (slot) {
    $$('span', slot).forEach(function (c, i) {
      var col = document.createElement('i');
      for (var k = 0; k < 20; k++) { var d = document.createElement('b'); d.textContent = SLOT_CH[k % 10]; col.appendChild(d); }
      col.style.transform = 'translateY(' + (-slotCur[i] * SLOT_H) + 'px)';
      c.appendChild(col);
    });
  }
  function rollSlot() {
    var next = slotCur.map(function () { return Math.floor(Math.random() * 10); });
    $$('span > i', slot).forEach(function (col, i) {
      col.style.transition = 'none';
      col.style.transform = 'translateY(' + (-slotCur[i] * SLOT_H) + 'px)';
      void col.offsetWidth;
      col.style.transition = '';
      col.style.transitionDelay = (i * 0.12) + 's';
      col.style.transform = 'translateY(' + (-(10 + next[i]) * SLOT_H) + 'px)';
    });
    slotCur = next;
  }
  if (bento && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      var on = es[0].isIntersecting;
      bento.classList.toggle('in-view', on && !reduce);
      clearInterval(slotTimer);
      if (on && slot && !reduce) { rollSlot(); slotTimer = setInterval(rollSlot, 3600); }
    }, { threshold: 0.15 }).observe(bento);
  }
  if (reduce) $$('svg.mini-map').forEach(function (svg) { if (svg.pauseAnimations) svg.pauseAnimations(); });
  var gaugeIn = $('#gaugeInput');
  if (gaugeIn) {
    var gaugeUpd = function () {
      var d = +gaugeIn.value;
      $('#gaugeDays').textContent = d;
      $('#gaugeRing').style.strokeDashoffset = (314.16 * (1 - d / 30)).toFixed(1);
      gaugeIn.style.setProperty('--v', ((d - 1) / 29 * 100).toFixed(1) + '%');
      $('#gaugeUntil').textContent = 'Si terminan hoy, cubierto hasta el ' + longDate(addDays(d));
    };
    gaugeIn.addEventListener('input', gaugeUpd);
    gaugeUpd();
  }

  /* ---------- Especialistas: línea de pasos que se llena ---------- */
  var prosSteps = $('#prosSteps');
  if (prosSteps) scrollHooks.push(function () {
    var r = prosSteps.getBoundingClientRect(), vh = window.innerHeight;
    prosSteps.style.setProperty('--p', clamp((vh * 0.92 - r.top) / (vh * 0.45), 0, 1).toFixed(3));
  });

  /* ---------- Descarga: titular en ola, QR y galería con relieve ---------- */
  var storeTitle = $('#store-title');
  if (storeTitle && !reduce) {
    var stText = storeTitle.textContent, stWords = stText.split(' '), stI = 0;
    storeTitle.setAttribute('aria-label', stText);
    storeTitle.textContent = '';
    stWords.forEach(function (word, wi) {
      var w = document.createElement('span'); w.className = 'sw'; w.setAttribute('aria-hidden', 'true');
      word.split('').forEach(function (ch) { var c = document.createElement('span'); c.className = 'ch'; c.textContent = ch; c.style.setProperty('--i', stI++); w.appendChild(c); });
      storeTitle.appendChild(w);
      if (wi < stWords.length - 1) storeTitle.appendChild(document.createTextNode(' '));
    });
  }
  var qrCard = $('#qrCard');
  if (qrCard && typeof window.qrcode === 'function') {
    try {
      var qr = window.qrcode(0, 'M');
      qr.addData(PLAY_LINK); qr.make();
      $('#qr').innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
      qrCard.hidden = false;
    } catch (e) {}
  }
  if (fine && !reduce) $$('.gallery figure').forEach(function (f) {
    f.addEventListener('pointermove', function (e) {
      var r = f.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      f.style.transform = 'perspective(900px) translateY(-14px) rotateX(' + (-y * 8).toFixed(2) + 'deg) rotateY(' + (x * 10).toFixed(2) + 'deg)';
      f.style.setProperty('--gx', ((x + 0.5) * 100).toFixed(1) + '%');
      f.style.setProperty('--gy', ((y + 0.5) * 100).toFixed(1) + '%');
    });
    f.addEventListener('pointerleave', function () { f.style.transform = ''; });
  });

  /* ---------- Preguntas: apertura suave, búsqueda y filtros ---------- */
  var faqItems = $$('.faq-item');
  faqItems.forEach(function (d) {
    var sum = d.querySelector('summary'), ans = d.querySelector('.answer');
    sum.addEventListener('click', function (e) {
      if (reduce || !ans.animate) return;
      e.preventDefault();
      var closing = d._closing;
      if (d._anim) { d._anim.cancel(); d._anim = null; }
      var pb = parseFloat(getComputedStyle(ans).paddingBottom) || 26;
      if (!d.open || closing) {
        d._closing = false; d.open = true;
        var h = ans.offsetHeight;
        d._anim = ans.animate([{ height: '0px', paddingBottom: '0px', opacity: 0 }, { height: h + 'px', paddingBottom: pb + 'px', opacity: 1 }], { duration: 440, easing: 'cubic-bezier(.22,1,.36,1)' });
        d._anim.onfinish = function () { d._anim = null; };
      } else {
        d._closing = true;
        d._anim = ans.animate([{ height: ans.offsetHeight + 'px', paddingBottom: pb + 'px', opacity: 1 }, { height: '0px', paddingBottom: '0px', opacity: 0 }], { duration: 320, easing: 'cubic-bezier(.65,0,.35,1)' });
        d._anim.onfinish = function () { d.open = false; d._closing = false; d._anim = null; };
      }
    });
  });
  var faqSearch = $('#faqSearch'), faqBtns = $$('#faqFilters button'), faqEmpty = $('#faqEmpty'), faqCat = 'all';
  faqItems.forEach(function (d) { d._q = norm(d.textContent); });
  function filterFaq() {
    var toks = norm(faqSearch.value).split(/\s+/).filter(function (t) { return t.length > 1; }), shown = [];
    faqItems.forEach(function (d) {
      var okCat = faqCat === 'all' || (' ' + d.getAttribute('data-cat') + ' ').indexOf(' ' + faqCat + ' ') >= 0;
      var okQ = toks.every(function (t) { return d._q.indexOf(t) >= 0; });
      d.classList.toggle('is-out', !(okCat && okQ));
      if (okCat && okQ) shown.push(d);
    });
    if (toks.length && shown.length <= 3) shown.forEach(function (d) { d.open = true; });
    faqEmpty.hidden = shown.length > 0;
  }
  faqSearch.addEventListener('input', filterFaq);
  faqBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      faqCat = b.getAttribute('data-cat');
      faqBtns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      filterFaq();
    });
  });

  /* ---------- Documentos legales ---------- */
  var modal = $('#legalModal');
  var LEGAL = {
    privacidad: {
      title: 'Aviso de privacidad',
      items: [
        'No necesitas dar tu teléfono ni tu correo a los especialistas: toda la comunicación pasa por el chat de la app.',
        'Tu código de seguridad solo aparece en tu pantalla.',
        'Las reseñas se publican hasta que cliente y especialista ya calificaron.'
      ]
    },
    terminos: {
      title: 'Términos y condiciones',
      items: [
        'Cotizar en la app no te compromete a contratar.',
        'Cada especialista define la garantía de su oferta, hasta un máximo de 30 días.',
        'Si pagas con tarjeta, Acency retiene el pago hasta que confirmas que el servicio quedó como esperabas.',
        'Las reseñas se publican hasta que ambas partes calificaron.'
      ]
    }
  };
  function openLegal(key) {
    var d = LEGAL[key];
    if (!d || !modal) return;
    $('#legalTitle').textContent = d.title;
    var ul = $('#legalList'); ul.innerHTML = '';
    d.items.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
    if (typeof modal.showModal === 'function') { if (!modal.open) modal.showModal(); } else modal.setAttribute('open', '');
  }
  function closeLegal() { if (typeof modal.close === 'function') modal.close(); else modal.removeAttribute('open'); }
  $$('[data-legal]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); openLegal(a.getAttribute('data-legal')); }); });
  if (modal) {
    $$('[data-close]', modal).forEach(function (b) { b.addEventListener('click', closeLegal); });
    modal.addEventListener('click', function (e) { if (e.target === modal) closeLegal(); });
    if (location.hash === '#privacidad' || location.hash === '#terminos') openLegal(location.hash.slice(1));
  }

  /* ---------- Recomendar Acency ---------- */
  var shareBtn = $('#shareBtn');
  if (shareBtn) shareBtn.addEventListener('click', function () {
    var text = 'Pide plomero, electricista y más desde tu celular, con garantía y pago protegido. Descarga Acency:';
    function fallback() {
      copyText(text + ' ' + PLAY_URL, function () { toast('Enlace copiado. Pégalo donde quieras recomendar Acency.'); }, function () { toast('Comparte este enlace: ' + PLAY_URL); });
    }
    if (navigator.share) navigator.share({ title: 'Acency', text: text, url: PLAY_URL }).catch(function (err) { if (!err || err.name !== 'AbortError') fallback(); });
    else fallback();
  });

  /* ---------- Logo gigante del pie que se ilumina bajo el puntero ---------- */
  var mark = $('#footerMark');
  if (mark && fine) $('.footer').addEventListener('pointermove', function (e) {
    var r = mark.getBoundingClientRect();
    mark.style.setProperty('--fx', (e.clientX - r.left) + 'px');
    mark.style.setProperty('--fy', (e.clientY - r.top) + 'px');
  });

  /* ---------- Título de la pestaña cuando te vas ---------- */
  var baseTitle = document.title;
  document.addEventListener('visibilitychange', function () { document.title = document.hidden ? 'Te esperamos · Acency' : baseTitle; });

  var resizeT;
  window.addEventListener('resize', function () { clearTimeout(resizeT); resizeT = setTimeout(function () { if (!reduce) fillTicker(); onScroll(); }, 200); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(onScroll);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
