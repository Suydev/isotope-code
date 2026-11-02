/* ============================================================================
   dom.js — tiny helpers. No framework; the preview must work from file://.

   THE ONE RULE: a control is created by `btn()`/`chip()`/`tile()` etc., which
   all emit `data-act`. `app.js` delegates every click to PV.act(). There is no
   path by which a control can exist without a declared action — which is the
   structural fix for "the button clicks and nothing happens".
   ========================================================================= */

(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* Encode a JS value for embedding in an HTML attribute. */
  function arg(v) {
    if (v == null) return '';
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    return esc(JSON.stringify(v));
  }

  function attrs(o) {
    return Object.keys(o).filter(function (k) {
      return o[k] !== null && o[k] !== undefined && o[k] !== false;
    }).map(function (k) { return esc(k) + '="' + esc(o[k]) + '"'; }).join(' ');
  }

  /* ── Controls. Every one carries data-act. ───────────────────────────── */

  function btn(label, act, a, opt) {
    opt = opt || {};
    return '<button class="btn ' + (opt.cls || '') + '" ' +
      'data-act="' + esc(act) + '"' + (a !== undefined && a !== null ? ' data-arg="' + arg(a) + '"' : '') + ' ' +
      attrs({
        type: opt.type || 'button',
        'aria-label': opt.aria,
        'aria-pressed': opt.pressed,
        'aria-selected': opt.selected,
        'aria-haspopup': opt.haspopup,
        'aria-expanded': opt.expanded,
        disabled: opt.disabled || null,
      }) + '>' + (opt.glyph ? '<span aria-hidden="true">' + esc(opt.glyph) + '</span>' : '') + esc(label) + '</button>';
  }

  function iconBtn(glyph, act, a, opt) {
    opt = opt || {};
    return '<button class="iconbtn ' + (opt.cls || '') + '" ' +
      'data-act="' + esc(act) + '"' + (a !== undefined && a !== null ? ' data-arg="' + arg(a) + '"' : '') + ' ' +
      attrs({
        type: 'button',
        'aria-label': opt.aria || glyph,
        'aria-pressed': opt.pressed,
        'aria-expanded': opt.expanded,
        title: opt.aria || glyph,
        disabled: opt.disabled || null,
      }) + '><span aria-hidden="true">' + esc(glyph) + '</span></button>';
  }

  function tab(label, act, a, selected) {
    return '<button class="tab" role="tab" aria-selected="' + (selected ? 'true' : 'false') + '" ' +
      'data-act="' + esc(act) + '"' + (a !== undefined && a !== null ? ' data-arg="' + arg(a) + '"' : '') + '>' +
      esc(label) + '</button>';
  }

  function chip(label, act, a, pressed) {
    return '<button class="chip" aria-pressed="' + (pressed ? 'true' : 'false') + '" ' +
      'data-act="' + esc(act) + '"' + (a !== undefined && a !== null ? ' data-arg="' + arg(a) + '"' : '') + '>' +
      esc(label) + '</button>';
  }

  function toggle(aria, act, a, on) {
    return '<button class="switch" role="switch" aria-checked="' + (on ? 'true' : 'false') + '" ' +
      'aria-label="' + esc(aria) + '" data-act="' + esc(act) + '"' +
      (a !== undefined && a !== null ? ' data-arg="' + arg(a) + '"' : '') + '></button>';
  }

  function field(label, html, hint) {
    return '<div class="field"><label class="label">' + esc(label) + '</label>' + html +
      (hint ? '<span class="hint">' + esc(hint) + '</span>' : '') + '</div>';
  }

  function bar(pct) {
    var p = Math.max(0, Math.min(100, Math.round(pct || 0)));
    return '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + p + '">' +
      '<div class="bar__fill" style="width:' + p + '%"></div></div>';
  }

  function ring(pct, size, stroke, color) {
    size = size || 96; stroke = stroke || 8;
    var r = (size - stroke) / 2;
    var c = 2 * Math.PI * r;
    var p = Math.max(0, Math.min(100, pct || 0));
    var off = c - (c * p / 100);
    return '<svg class="ring" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true">' +
      '<circle class="ring__track" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '"/>' +
      '<circle class="ring__value" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '"' +
        (color ? ' stroke="' + color + '"' : '') + ' stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + off.toFixed(2) + '"/>' +
      '</svg>';
  }

  function meter(value, unit) {
    return '<div class="meter"><span class="meter__val">' + esc(value) + '</span>' +
      (unit ? '<span class="meter__unit">' + esc(unit) + '</span>' : '') + '</div>';
  }

  function sample(text) { return '<span class="sample" title="Synthetic figure">sample</span>'; }

  function badge(text, brand) {
    return '<span class="badge' + (brand ? ' badge--brand' : '') + '">' + esc(text) + '</span>';
  }

  function card(inner, cls) { return '<div class="card ' + (cls || '') + '">' + inner + '</div>'; }

  function tile(name, value, meta, act, a) {
    return '<button class="tile" data-act="' + esc(act) + '"' +
      (a !== undefined && a !== null ? ' data-arg="' + arg(a) + '"' : '') + '>' +
      '<div class="tile__row"><span class="tile__name">' + esc(name) + '</span>' +
      '<span class="tile__val">' + esc(value) + '</span></div>' +
      '<div class="tile__meta">' + esc(meta) + '</div></button>';
  }

  function empty(glyph, title, body, cta) {
    return '<div class="empty"><div class="empty__glyph" aria-hidden="true">' + esc(glyph) + '</div>' +
      '<h2 class="empty__title">' + esc(title) + '</h2>' +
      '<p class="empty__body">' + esc(body) + '</p>' + (cta || '') + '</div>';
  }

  function sparkline(values, w, h) {
    w = w || 220; h = h || 44;
    var max = Math.max.apply(null, values) || 1;
    var step = values.length > 1 ? w / (values.length - 1) : w;
    var pts = values.map(function (v, i) {
      return (i * step).toFixed(1) + ',' + (h - (v / max) * (h - 4) - 2).toFixed(1);
    }).join(' ');
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' +
      '<polyline points="' + pts + '" fill="none" stroke="var(--brand-500)" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  global.D = { esc: esc, arg: arg, attrs: attrs, btn: btn, iconBtn: iconBtn, tab: tab,
               chip: chip, toggle: toggle, field: field, bar: bar, ring: ring, meter: meter,
               sample: sample, badge: badge, card: card, tile: tile, empty: empty,
               sparkline: sparkline };
})(window);