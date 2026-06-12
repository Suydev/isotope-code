(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function reveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!items.length) return;

    items.forEach(function (item, index) {
      if (!item.style.getPropertyValue('--i')) item.style.setProperty('--i', String(index % 8));
    });

    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (item) { item.classList.add('is-visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    items.forEach(function (item) { obs.observe(item); });
  }

  function duplicateTicker() {
    document.querySelectorAll('.ticker-track').forEach(function (track) {
      if (track.dataset.ready === 'true') return;
      track.dataset.ready = 'true';
      track.innerHTML += track.innerHTML;
    });
  }

  function activeNav() {
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if ((path === 'index.html' && href === './') || href.endsWith(path)) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function imageTilt() {
    if (reduce) return;
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        var x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
        var y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
        card.style.transform = 'perspective(900px) rotateY(' + x.toFixed(2) + 'deg) rotateX(' + y.toFixed(2) + 'deg) translateY(-4px)';
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
      });
    });
  }

  function init() {
    duplicateTicker();
    activeNav();
    reveal();
    imageTilt();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
