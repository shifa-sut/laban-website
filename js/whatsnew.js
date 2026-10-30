/* =====================================================================
   The Laban Spot — What's New scroll showcase
   The section pins to the screen while you scroll through three products.
   Each scroll step swings the current box out to the lower left, swings
   the next one in from the lower right, rolls the product name along the
   coloured panel and blends every colour to the next product's packaging.
   ===================================================================== */
(function () {
  'use strict';
  var D = window.LABAN || {}, P = (D.NEW || []).slice(0, 3);
  var sec = document.getElementById('new'), track = document.getElementById('newTrack');
  if (!sec || !track || !P.length) return;
  var IMG = 'assets/images/';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var N = P.length;
  var clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var wa = function (t) { return 'https://wa.me/' + (D.phoneRaw || '917994059711') + '?text=' + encodeURIComponent(t); };

  /* ---------- build ---------- */
  document.getElementById('newProducts').innerHTML = P.map(function (p, i) {
    return '<figure class="new__product" data-i="' + i + '"><img src="' + IMG + 'cutouts/' + p.cut + '" alt="' + esc(p.name) + ' from The Laban Spot"' + (i ? ' loading="eager"' : '') + ' decoding="async"></figure>';
  }).join('');
  document.getElementById('newItems').innerHTML = P.map(function (p, i) {
    return '<article class="new__item" data-i="' + i + '"' + (i ? ' aria-hidden="true"' : '') + '>' +
      (p.ar ? '<span class="new__ar" lang="ar" dir="rtl">' + p.ar + '</span>' : '') +
      '<h3>' + (p.lead ? esc(p.lead) + ' ' : '') + '<em>' + esc(p.accent) + '</em></h3>' +
      (p.tag ? '<span class="new__tag">' + esc(p.tag) + '</span>' : '') +
      '<p>' + esc(p.text) + '</p>' +
      '<div class="new__ctas"><a class="btn new__btn" href="' + wa('Hi The Laban Spot! I would like to know more about ' + p.name + '.') + '" target="_blank" rel="noopener"' + (i ? ' tabindex="-1"' : '') + '>Ask about it</a>' +
      '<a class="btn new__btn--ghost" href="#franchise"' + (i ? ' tabindex="-1"' : '') + '>Own a Laban Spot</a></div></article>';
  }).join('');
  var roll = P.map(function (p) { return '<span>' + esc(p.name) + '</span>'; }).join('');
  document.getElementById('newPill').innerHTML = roll;
  document.getElementById('newGiant').innerHTML = P.map(function (p) { return '<span><i>' + esc(p.name) + '</i></span>'; }).join('');
  document.getElementById('newThumbs').innerHTML = P.map(function (p, i) {
    return '<button type="button" class="new__thumb" data-i="' + i + '" aria-label="Show ' + esc(p.name) + '" aria-pressed="' + (i === 0) + '"><img src="' + IMG + 'cutouts/' + p.cut + '" alt=""></button>';
  }).join('') + '<span class="new__count" id="newCount">01 / ' + String(N).padStart(2, '0') + '</span>';

  var prods = [].slice.call(sec.querySelectorAll('.new__product')), items = [].slice.call(sec.querySelectorAll('.new__item'));
  var thumbs = [].slice.call(sec.querySelectorAll('.new__thumb')), count = document.getElementById('newCount');
  var pill = document.getElementById('newPill'), giant = document.getElementById('newGiant');

  /* ---------- colour helpers ---------- */
  function parse(c) {
    var m = c.match(/^#([0-9a-f]{6})$/i);
    if (m) { var n = parseInt(m[1], 16); return [n >> 16 & 255, n >> 8 & 255, n & 255, 1]; }
    m = c.match(/rgba?\(([^)]+)\)/); var v = m[1].split(',').map(parseFloat); return [v[0], v[1], v[2], v[3] == null ? 1 : v[3]];
  }
  var KEYS = ['bg', 'panel', 'ring', 'accent', 'pill', 'pillText', 'stroke'];
  var COL = P.map(function (p) { var o = {}; KEYS.forEach(function (k) { o[k] = parse(p.colors[k]); }); return o; });
  function mix(a, b, t) { return 'rgba(' + [0, 1, 2].map(function (j) { return Math.round(a[j] + (b[j] - a[j]) * t); }).join(',') + ',' + (+(a[3] + (b[3] - a[3]) * t).toFixed(3)) + ')'; }

  /* ---------- scroll → progress (holds on each product, eased swaps) ---------- */
  var smooth = function (x) { return x * x * x * (x * (x * 6 - 15) + 10); };
  function target() {
    var r = track.getBoundingClientRect(), span = Math.max(1, r.height - innerHeight);
    var s = clamp(-r.top / span, 0, 1) * (N - 1), i = Math.min(Math.floor(s), N - 2), f = s - i;
    if (N < 2) return 0;
    return i + smooth(clamp((f - .2) / .6, 0, 1));
  }

  var cur = 0, want = 0, running = false, active = -1, mobile = false;
  var stage = document.getElementById('newStage'), copy = sec.querySelector('.new__copy');
  function layout() {
    mobile = innerWidth < 900;
    if (mobile) { var v = copy.getBoundingClientRect().bottom - stage.getBoundingClientRect().top + 14; stage.style.setProperty('--vtop', Math.round(v) + 'px'); }
    else stage.style.removeProperty('--vtop');
    fitGiant();
  }
  // the big outlined name runs up the coloured panel: make it exactly as long as the panel
  // and shrink any name that would not fit, so every product name is always shown in full
  function fitGiant() {
    var panel = sec.querySelector('.new__panel'), box = giant.parentElement;
    var L = panel.clientHeight; if (!L) return;
    box.style.setProperty('--gl', L + 'px');
    [].forEach.call(giant.children, function (sp) {
      sp.style.fontSize = '';
      var cs = getComputedStyle(sp), base = parseFloat(cs.fontSize), pad = parseFloat(cs.paddingLeft) || 0;
      var w = sp.firstChild.offsetWidth, avail = L - pad - Math.max(16, L * .05);
      var size = w > avail ? base * avail / w : base;
      if (w > avail) sp.style.fontSize = size.toFixed(1) + 'px';
      // a thin outline only reads well at large sizes; smaller names switch to soft solid letters
      sp.classList.toggle('is-solid', size < 90);
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitGiant(); });
  function render(p) {
    var i0 = Math.floor(p), i1 = Math.min(i0 + 1, N - 1), f = p - i0, a = COL[i0], b = COL[i1];
    KEYS.forEach(function (k) { sec.style.setProperty('--nw-' + k, mix(a[k], b[k], f)); });
    var W = innerWidth, H = innerHeight;
    prods.forEach(function (el, i) {
      var t = p - i, x, y, rot, o = 1;
      if (Math.abs(t) >= 1) { el.style.visibility = 'hidden'; return; }
      el.style.visibility = 'visible';
      if (reduce) { el.style.transform = 'translate(-50%,-50%)'; el.style.opacity = clamp(1 - Math.abs(t) * 2, 0, 1); return; }
      if (t < 0) { var e = -t; x = e * (mobile ? .55 : .3) * W; y = e * (mobile ? .55 : .85) * H; rot = e * 30; }
      else { x = -t * (mobile ? .6 : .34) * W; y = t * (mobile ? .55 : .9) * H; rot = -t * 40; }
      el.style.opacity = o;
      el.style.transform = 'translate(-50%,-50%) translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + rot.toFixed(2) + 'deg)';
      el.style.zIndex = t < 0 ? 2 : 1;
    });
    items.forEach(function (el, i) {
      var t = p - i, o = clamp(1 - Math.abs(t) * 2.2, 0, 1);
      el.style.opacity = o;
      el.style.transform = reduce ? '' : 'translate3d(0,' + (-t * 36).toFixed(1) + 'px,0)';
      el.style.visibility = o > .01 ? 'visible' : 'hidden';
    });
    pill.style.transform = 'translate3d(' + (-p * 100 / N).toFixed(3) + '%,0,0)';
    giant.style.transform = 'translate3d(' + (-p * 100 / N).toFixed(3) + '%,0,0)';
    var now = Math.round(p);
    if (now !== active) {
      active = now;
      items.forEach(function (el, i) {
        var on = i === now; el.setAttribute('aria-hidden', on ? 'false' : 'true');
        [].forEach.call(el.querySelectorAll('a'), function (a) { if (on) a.removeAttribute('tabindex'); else a.setAttribute('tabindex', '-1'); });
      });
      thumbs.forEach(function (t, i) { t.setAttribute('aria-pressed', i === now); });
      count.textContent = String(now + 1).padStart(2, '0') + ' / ' + String(N).padStart(2, '0');
    }
  }
  function frame() {
    var d = want - cur;
    cur = Math.abs(d) < .0006 ? want : cur + d * (reduce ? 1 : .14);
    render(cur);
    if (cur !== want) requestAnimationFrame(frame); else running = false;
  }
  function onScroll() { want = target(); if (!running) { running = true; requestAnimationFrame(frame); } }

  thumbs.forEach(function (t) {
    t.addEventListener('click', function () {
      var i = +t.dataset.i, r = track.getBoundingClientRect(), span = r.height - innerHeight;
      var top = scrollY + r.top + span * (N > 1 ? i / (N - 1) : 0);
      scrollTo({ top: Math.round(top), behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  layout();
  addEventListener('load', function () { layout(); render(cur); });
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', function () { layout(); want = target(); cur = want; render(cur); });
  want = cur = target(); render(cur);
})();
