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

  function commandMenu() {
    var links = [
      { title: 'Install guide', desc: 'Android, Linux, macOS, and Windows setup', href: './install.html', tag: 'setup' },
      { title: 'Sync and backup safety', desc: 'Canonical paths and empty-overwrite blocking', href: './sync.html', tag: 'data' },
      { title: 'Admin and browser proof', desc: 'Verify schema, repair sync, and run real browser proof', href: './admin.html', tag: 'admin' },
      { title: 'Screenshot gallery', desc: 'Real app screenshots from the repo', href: './gallery.html', tag: 'visuals' },
      { title: 'Motion design notes', desc: 'Animation system and reference decisions', href: './motion.html', tag: 'motion' },
      { title: 'Sync system markdown', desc: 'Deep technical sync docs', href: './sync-system.md', tag: 'docs' },
      { title: 'Storage backup markdown', desc: 'Storage backup and cleanup details', href: './storage-backup-system.md', tag: 'docs' },
      { title: 'Supabase connection map', desc: 'Tables, buckets, policies, and callers', href: './supabase-connection-map.md', tag: 'schema' },
      { title: 'GitHub repository', desc: 'Source, issues, workflows, and releases', href: 'https://github.com/Suydev/isotope-code', tag: 'github' },
      { title: 'README', desc: 'Main repository guide', href: 'https://github.com/Suydev/isotope-code/blob/main/README.md', tag: 'github' },
    ];

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'cmd-launch';
    button.setAttribute('aria-haspopup', 'dialog');
    button.innerHTML = '<span>Search docs</span><kbd>Ctrl K</kbd>';

    var backdrop = document.createElement('div');
    backdrop.className = 'cmd-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', 'Search documentation');
    backdrop.innerHTML =
      '<div class="cmd-panel">' +
      '<input class="cmd-search" type="search" autocomplete="off" spellcheck="false" placeholder="Search docs, backups, admin, screenshots...">' +
      '<div class="cmd-list" role="listbox"></div>' +
      '<div class="cmd-help"><span><span class="cmd-kbd">↑↓</span> move</span><span><span class="cmd-kbd">Enter</span> open</span><span><span class="cmd-kbd">Esc</span> close</span></div>' +
      '</div>';

    document.body.appendChild(button);
    document.body.appendChild(backdrop);

    var input = backdrop.querySelector('.cmd-search');
    var list = backdrop.querySelector('.cmd-list');
    var active = 0;

    function score(item, query) {
      if (!query) return true;
      var hay = (item.title + ' ' + item.desc + ' ' + item.tag).toLowerCase();
      return query.toLowerCase().split(/\s+/).every(function (part) { return hay.indexOf(part) >= 0; });
    }

    function render() {
      var query = input.value.trim();
      var visible = links.filter(function (item) { return score(item, query); });
      if (active >= visible.length) active = Math.max(0, visible.length - 1);
      if (!visible.length) {
        list.innerHTML = '<div class="cmd-empty">No matching docs. Try "sync", "install", "admin", or "screenshots".</div>';
        return;
      }
      list.innerHTML = visible.map(function (item, index) {
        return '<a class="cmd-item' + (index === active ? ' is-active' : '') + '" role="option" data-index="' + index + '" href="' + item.href + '">' +
          '<span><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.desc) + '</span></span>' +
          '<em class="cmd-tag">' + escapeHtml(item.tag) + '</em>' +
          '</a>';
      }).join('');
      Array.prototype.slice.call(list.querySelectorAll('.cmd-item')).forEach(function (item) {
        item.addEventListener('mouseenter', function () {
          active = Number(item.dataset.index || 0);
          render();
        }, { once: true });
      });
    }

    function escapeHtml(value) {
      return String(value || '').replace(/[&<>"']/g, function (ch) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
      });
    }

    function open() {
      backdrop.classList.add('is-open');
      document.body.classList.add('cmd-open');
      input.value = '';
      active = 0;
      render();
      setTimeout(function () { input.focus(); }, 20);
    }

    function close() {
      backdrop.classList.remove('is-open');
      document.body.classList.remove('cmd-open');
      button.focus();
    }

    function openActive() {
      var item = list.querySelector('.cmd-item.is-active') || list.querySelector('.cmd-item');
      if (item) window.location.href = item.getAttribute('href');
    }

    button.addEventListener('click', open);
    backdrop.addEventListener('click', function (event) {
      if (event.target === backdrop) close();
    });
    input.addEventListener('input', function () { active = 0; render(); });
    input.addEventListener('keydown', function (event) {
      var count = list.querySelectorAll('.cmd-item').length;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        active = count ? (active + 1) % count : 0;
        render();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        active = count ? (active - 1 + count) % count : 0;
        render();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        openActive();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    });

    document.addEventListener('keydown', function (event) {
      var target = event.target;
      var typing = target && /input|textarea|select/i.test(target.tagName);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        open();
      } else if (!typing && event.key === '/') {
        event.preventDefault();
        open();
      } else if (event.key === 'Escape' && backdrop.classList.contains('is-open')) {
        event.preventDefault();
        close();
      }
    });
  }

  function init() {
    duplicateTicker();
    activeNav();
    reveal();
    imageTilt();
    commandMenu();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
