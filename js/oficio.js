/* Páginas de oficio, 404 y regreso de Stripe: enlace a Google Play con la fuente
   del anuncio, medición de Google Ads (configurada en js/anuncios.js) y barra
   fija de descarga en celular. Misma lógica que el <script> del inicio. */
(function () {
  'use strict';
  var PLAY_URL = 'https://play.google.com/store/apps/details?id=com.servicios.acency';
  var cfg = window.ACENCY_ADS || {}, ADS_ID = cfg.id || '', ADS_LABEL = cfg.label || '';
  var qs = new URLSearchParams(location.search);
  var pagina = document.body.getAttribute('data-oficio') || 'web';

  /* La fuente del anuncio viaja a Google Play en `referrer` (Play Console la muestra
     en Adquisición). utm_content = la página de oficio desde donde se instaló. */
  var PLAY_LINK = (function () {
    var keep = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid'], ref = [];
    keep.forEach(function (k) { var v = qs.get(k); if (v) ref.push(k + '=' + encodeURIComponent(v.slice(0, 100))); });
    if (!qs.get('utm_source')) ref.unshift('utm_source=' + (qs.get('gclid') || qs.get('gbraid') || qs.get('wbraid') ? 'google' : 'acency_web'), 'utm_medium=' + (qs.get('gclid') ? 'cpc' : 'landing'));
    if (!qs.get('utm_content')) ref.push('utm_content=' + encodeURIComponent(pagina));
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
    var zona = a.closest('[id]');
    window.dataLayer.push({ event: 'clic_google_play', ubicacion: pagina + ':' + (zona ? zona.id : '') });
    if (ADS_ID && ADS_LABEL) gtag('event', 'conversion', { send_to: ADS_ID + '/' + ADS_LABEL });
  });

  /* Barra fija: aparece al dejar atrás el inicio y se esconde en el cierre y el pie */
  var dock = document.getElementById('dock'), hero = document.querySelector('.o-hero');
  var fin = [document.getElementById('final'), document.querySelector('.foot')].filter(Boolean);
  if (dock && hero && 'IntersectionObserver' in window) {
    var heroVisible = true, finVisible = {};
    var sync = function () {
      var algunFin = Object.keys(finVisible).some(function (k) { return finVisible[k]; });
      dock.classList.toggle('show', !heroVisible && !algunFin);
    };
    new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; sync(); }).observe(hero);
    fin.forEach(function (el, i) {
      new IntersectionObserver(function (en) { finVisible[i] = en[0].isIntersecting; sync(); }).observe(el);
    });
  }
})();
