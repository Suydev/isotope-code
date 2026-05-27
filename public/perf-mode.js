(function () {
  'use strict';

  var STORAGE_KEY = 'isotope-perf-mode';
  var VALID = ['liquid', 'glass', 'potato'];
  var MODES = [
    { id: 'liquid', label: 'Liquid Glass', icon: '✦', sub: 'Full effects' },
    { id: 'glass',  label: 'Glassmorphism', icon: '◈', sub: 'Balanced' },
    { id: 'potato', label: 'Potato Mode',   icon: '⚡', sub: 'Max performance' },
  ];

  var saved;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  var current = VALID.indexOf(saved) !== -1 ? saved : 'liquid';

  document.documentElement.setAttribute('data-perf', current);

  function applyMode(id) {
    current = id;
    document.documentElement.setAttribute('data-perf', id);
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) {}
    refresh();
  }

  var btns = [];
  function refresh() {
    btns.forEach(function (b) {
      var on = b.getAttribute('data-mode') === current;
      b.style.background   = on ? 'rgba(249,115,22,0.18)' : 'rgba(255,255,255,0.04)';
      b.style.borderColor  = on ? 'rgba(249,115,22,0.50)' : 'rgba(255,255,255,0.08)';
      b.style.color        = on ? '#fff' : 'rgba(255,255,255,0.55)';
    });
  }

  function buildUI() {
    if (document.getElementById('__perf_mode__')) return;

    var wrap = document.createElement('div');
    wrap.id = '__perf_mode__';
    wrap.setAttribute('style', [
      'position:fixed', 'bottom:84px', 'left:14px',
      'z-index:2147483600',
      'font-family:system-ui,-apple-system,sans-serif',
    ].join(';'));

    var panel = document.createElement('div');
    panel.setAttribute('style', [
      'position:absolute', 'bottom:44px', 'left:0',
      'background:rgba(8,8,14,0.90)',
      'backdrop-filter:blur(28px) saturate(1.6)',
      '-webkit-backdrop-filter:blur(28px) saturate(1.6)',
      'border:1px solid rgba(255,255,255,0.10)',
      'border-radius:18px',
      'box-shadow:0 12px 40px rgba(0,0,0,0.6),0 0 0 1px rgba(249,115,22,0.06)',
      'padding:8px',
      'display:none',
      'flex-direction:column',
      'gap:3px',
      'min-width:172px',
      'overflow:hidden',
    ].join(';'));

    var hdr = document.createElement('div');
    hdr.textContent = 'DISPLAY MODE';
    hdr.setAttribute('style', [
      'font-size:9px', 'letter-spacing:0.10em',
      'color:rgba(255,255,255,0.28)',
      'padding:4px 8px 8px',
      'font-weight:700',
      'border-bottom:1px solid rgba(255,255,255,0.07)',
      'margin-bottom:3px',
    ].join(';'));
    panel.appendChild(hdr);

    MODES.forEach(function (m) {
      var b = document.createElement('button');
      b.setAttribute('data-mode', m.id);
      b.innerHTML = [
        '<span style="font-size:15px;width:24px;text-align:center;flex-shrink:0;line-height:1">' + m.icon + '</span>',
        '<span style="display:flex;flex-direction:column;gap:1px;text-align:left">',
        '  <span style="font-size:12px;font-weight:600;line-height:1.3">' + m.label + '</span>',
        '  <span style="font-size:9.5px;color:rgba(255,255,255,0.36);line-height:1.2">' + m.sub + '</span>',
        '</span>',
      ].join('');
      b.setAttribute('style', [
        'display:flex', 'align-items:center', 'gap:9px',
        'padding:7px 9px', 'border-radius:11px',
        'border:1px solid rgba(255,255,255,0.08)',
        'cursor:pointer',
        'transition:background 0.15s ease,border-color 0.15s ease',
        '-webkit-tap-highlight-color:transparent',
        'width:100%',
        'box-sizing:border-box',
      ].join(';'));
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        applyMode(m.id);
        setTimeout(close, 100);
      });
      btns.push(b);
      panel.appendChild(b);
    });

    var tog = document.createElement('button');
    tog.title = 'Display Mode';
    tog.setAttribute('aria-label', 'Display Mode');
    tog.innerHTML = '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 1a6.5 6.5 0 1 0 0 13A6.5 6.5 0 0 0 7.5 1Zm0 11.5A5 5 0 1 1 7.5 2.5a5 5 0 0 1 0 10Z" fill="currentColor"/><circle cx="7.5" cy="7.5" r="2" fill="currentColor"/></svg>';
    tog.setAttribute('style', [
      'width:34px', 'height:34px', 'border-radius:50%',
      'background:rgba(10,10,14,0.80)',
      'backdrop-filter:blur(20px)', '-webkit-backdrop-filter:blur(20px)',
      'border:1px solid rgba(249,115,22,0.30)',
      'box-shadow:0 0 12px rgba(249,115,22,0.14),0 4px 14px rgba(0,0,0,0.4)',
      'cursor:pointer',
      'display:flex', 'align-items:center', 'justify-content:center',
      'color:rgba(249,115,22,0.85)',
      'transition:transform 0.22s cubic-bezier(0.22,1,0.36,1),box-shadow 0.22s ease',
      '-webkit-tap-highlight-color:transparent',
    ].join(';'));

    wrap.appendChild(panel);
    wrap.appendChild(tog);
    document.body.appendChild(wrap);

    var isOpen = false;

    function close() {
      isOpen = false;
      panel.style.display = 'none';
      tog.style.transform = '';
      tog.style.boxShadow = '0 0 12px rgba(249,115,22,0.14),0 4px 14px rgba(0,0,0,0.4)';
    }

    tog.addEventListener('click', function (e) {
      e.stopPropagation();
      isOpen = !isOpen;
      panel.style.display = isOpen ? 'flex' : 'none';
      tog.style.transform  = isOpen ? 'rotate(180deg) scale(1.08)' : '';
      tog.style.boxShadow  = isOpen
        ? '0 0 22px rgba(249,115,22,0.38),0 4px 20px rgba(0,0,0,0.5)'
        : '0 0 12px rgba(249,115,22,0.14),0 4px 14px rgba(0,0,0,0.4)';
    });

    document.addEventListener('click', function () { if (isOpen) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) close(); });

    refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
