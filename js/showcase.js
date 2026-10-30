/* =====================================================================
   The Laban Spot — Salankatia product reveal
   When the section comes into view: the cup rises in, the supplied
   pistachio / chocolate pieces fall from above and settle around it, the
   name, description and flavours appear on the left, then each ingredient
   appears on the right with a line drawn to it on the cup. The cup keeps
   moving slowly in a small circle. Leaving the section resets everything,
   so it plays from the start on the next visit.
   ===================================================================== */
(function () {
  'use strict';
  var sec = document.getElementById('featured'), stage = document.getElementById('salStage');
  if (!sec || !stage) return;
  var D = window.LABAN || {}, IMG = 'assets/images/salankatia/';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- background: mirror the Menu's background at the Menu's size ---------- */
  var menu = document.getElementById('menu');
  function sizeBg() { if (menu) sec.style.setProperty('--menu-h', menu.offsetHeight + 'px'); }

  /* ---------- flavours (from the menu data) ---------- */
  var THUMB = { 'Nutella + Pistachio': 'nutella-pistachio', 'Pistachio + Lotus': 'pistachio-lotus', 'Lotus': 'lotus', 'Mango': 'mango', 'Nutella + Lotus': 'nutella-lotus', 'Pistachio': 'pistachio' };
  var range = (D.MENU || []).filter(function (m) { return m.id === 'salankatia'; })[0];
  var flav = range ? range.flavours.map(function (f) { return f.n; }) : Object.keys(THUMB);
  document.getElementById('salFlavours').innerHTML = flav.map(function (n, i) {
    var pic = THUMB[n] ? '<img src="' + IMG + 'flavour-' + THUMB[n] + '.webp" alt="" width="160" height="160" loading="lazy">'
      : '<span class="sal__fx"><img src="' + IMG + 'icon-chocolate.png" alt="" width="64" height="64"></span>';
    return '<li style="--i:' + i + '">' + pic + '<span>' + n + '</span></li>';
  }).join('');
  [].forEach.call(sec.querySelectorAll('.sal__ing'), function (el, i) { el.style.setProperty('--i', i); });
  [].forEach.call(sec.querySelectorAll('.sal__pin'), function (el, i) { el.style.setProperty('--i', i); });

  /* ---------- falling pieces, cut from the supplied sprinkle image ---------- */
  // [x, y, w, h] of each piece in sprinkles.webp (1536 × 1024)
  var BITS = [[782,276,168,187],[625,167,137,171],[948,237,164,157],[868,568,162,165],[754,476,127,162],[776,832,130,144],[826,29,142,144],[564,523,149,125],[691,680,133,125],[1027,431,124,109],[438,412,116,130],[564,333,112,91],[983,739,90,96],[590,797,105,86],[525,102,75,81],[605,25,72,89],[457,299,83,82],[862,765,64,69],[899,180,73,60],[920,453,48,49],[957,864,51,46],[745,145,45,49],[996,407,45,45],[524,240,48,40],[733,335,45,48],[732,415,46,38],[776,198,38,43],[708,475,43,39]];
  var fall = document.getElementById('salFall');
  fall.innerHTML = BITS.map(function (b, i) { return '<span class="sal__bit" data-i="' + i + '"></span>'; }).join('');
  var bits = [].slice.call(fall.children);
  // where each piece ends up, as fractions of the fall area (which is 1.6× the cup width and reaches well above it):
  // most settle in a loose halo over the cup, a few drop onto the dessert and melt away.
  var rnd = (function (s) { return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })(7);
  var SLOTS = [], n = BITS.length;
  for (var k = 0; k < n; k++) SLOTS.push(k);
  var PLAN = BITS.map(function (b, i) {
    if (i % 5 === 4) return { x: .4 + rnd() * .2, y: .52 + rnd() * .06, into: true };
    var slot = (i * 11) % n, t = slot / (n - 1);                    // spread big and small pieces along the arc
    var ang = Math.PI * (1.06 + t * .66) + (rnd() - .5) * .12;      // arc over the cup, left to right
    var rad = .7 + rnd() * .32;
    return { x: .5 + Math.cos(ang) * .46 * rad, y: .5 + Math.sin(ang) * .5 * rad, into: false };
  });
  var anims = [];
  function placeBits(play) {
    anims.forEach(function (a) { try { a.cancel(); } catch (e) {} }); anims = [];
    var W = stage.offsetWidth, fw = fall.offsetWidth, fh = fall.offsetHeight;
    var s = W / (innerWidth < 900 ? 1350 : 1250);
    bits.forEach(function (el, i) {
      var b = BITS[i], p = PLAN[i], w = b[2] * s, h = b[3] * s;
      el.style.width = w + 'px'; el.style.height = h + 'px';
      el.style.backgroundImage = 'url(' + IMG + 'sprinkles.webp)';
      el.style.backgroundSize = (1536 * s) + 'px ' + (1024 * s) + 'px';
      el.style.backgroundPosition = (-b[0] * s) + 'px ' + (-b[1] * s) + 'px';
      var x1 = p.x * fw - w / 2, y1 = p.y * fh - h / 2, r1 = (rnd() - .5) * 50;
      if (!play || reduce || !el.animate) {
        el.style.opacity = p.into ? 0 : 1; el.style.transform = 'translate(' + x1 + 'px,' + y1 + 'px) rotate(' + r1 + 'deg)'; return;
      }
      el.style.opacity = 0;
      var x0 = x1 + (rnd() - .5) * 60, y0 = -h - 40 - rnd() * fh * .3, r0 = r1 + (rnd() - .5) * 200;
      var dur = 1500 + rnd() * 900, delay = 900 + i * 70;
      var fallA = el.animate([
        { transform: 'translate(' + x0 + 'px,' + y0 + 'px) rotate(' + r0 + 'deg)', opacity: 0 },
        { opacity: 1, offset: .18 },
        { transform: 'translate(' + x1 + 'px,' + y1 + 'px) rotate(' + r1 + 'deg)', opacity: p.into ? .9 : 1, offset: p.into ? .85 : 1 }
      ].concat(p.into ? [{ transform: 'translate(' + x1 + 'px,' + (y1 + 10) + 'px) rotate(' + r1 + 'deg) scale(.6)', opacity: 0 }] : []),
        { duration: dur, delay: delay, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'forwards' });
      anims.push(fallA);
      if (!p.into) {
        // after landing, drift gently
        var bob = el.animate([
          { transform: 'translate(' + x1 + 'px,' + y1 + 'px) rotate(' + r1 + 'deg)', opacity: 1 },
          { transform: 'translate(' + x1 + 'px,' + (y1 - 7 - rnd() * 6) + 'px) rotate(' + (r1 + 6) + 'deg)', opacity: 1 }
        ], { duration: 2600 + rnd() * 1800, delay: delay + dur, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' });
        anims.push(bob);
      }
    });
  }

  /* ---------- connecting lines (desktop) ---------- */
  var svg = document.getElementById('salLines'), NS = 'http://www.w3.org/2000/svg';
  var ings = [].slice.call(sec.querySelectorAll('.sal__ing')), pins = {};
  [].forEach.call(sec.querySelectorAll('.sal__pin'), function (p) { pins[p.dataset.for] = p; });
  var lines = ings.map(function (el, i) {
    var path = document.createElementNS(NS, 'path'); path.setAttribute('pathLength', '1');
    path.style.strokeDasharray = '1'; path.style.strokeDashoffset = '1';
    var dot = document.createElementNS(NS, 'circle'); dot.setAttribute('r', '3.5'); dot.style.opacity = 0;
    svg.appendChild(path); svg.appendChild(dot);
    return { el: el, pin: pins[el.dataset.for], path: path, dot: dot, i: i };
  });
  function drawLines() {
    if (getComputedStyle(svg).display === 'none') return;
    var R = sec.getBoundingClientRect();
    lines.forEach(function (l) {
      var a = l.el.querySelector('.sal__icon').getBoundingClientRect(), b = l.pin.getBoundingClientRect();
      var x0 = a.left - R.left - 10, y0 = a.top + a.height / 2 - R.top, x1 = b.left + b.width / 2 - R.left, y1 = b.top + b.height / 2 - R.top;
      // reference-style leader: a straight run out of the cup, a sharp elbow, then level to the label
      var ex = x1 + Math.min(Math.abs(y0 - y1), (x0 - x1) * .4) * 1.0;
      l.path.setAttribute('d', 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' L' + ex.toFixed(1) + ' ' + y0.toFixed(1) + ' L' + x0.toFixed(1) + ' ' + y0.toFixed(1));
      l.dot.setAttribute('cx', x0.toFixed(1)); l.dot.setAttribute('cy', y0.toFixed(1));
    });
  }
  function lineState(on) {
    lines.forEach(function (l) {
      var d = (2.75 + l.i * .55) + 's';
      l.path.style.transition = on && !reduce ? 'stroke-dashoffset .9s cubic-bezier(.22,1,.36,1) ' + d : 'none';
      l.dot.style.transition = on && !reduce ? 'opacity .4s ease ' + d : 'none';
      l.path.style.strokeDashoffset = on ? '0' : '1'; l.dot.style.opacity = on ? 1 : 0;
    });
  }

  /* ---------- run / reset ---------- */
  var visible = false, raf = 0;
  function loop() { drawLines(); raf = visible ? requestAnimationFrame(loop) : 0; }
  function enter() {
    if (sec.classList.contains('is-in')) return;
    sizeBg(); sec.classList.add('is-in'); placeBits(true); lineState(true);
  }
  function reset() { sec.classList.remove('is-in'); placeBits(false); bits.forEach(function (el) { el.style.opacity = 0; }); lineState(false); }

  sizeBg(); placeBits(false); bits.forEach(function (el) { el.style.opacity = 0; }); lineState(false);
  if (reduce) { sec.classList.add('is-in'); placeBits(false); lineState(true); }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      var e = es[0];
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
      if (reduce) return;
      if (e.intersectionRatio >= .35) enter();
      else if (!e.isIntersecting) reset();
    }, { threshold: [0, .35, .6] }).observe(sec);
  } else { visible = true; enter(); loop(); }

  var rt;
  addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { sizeBg(); if (sec.classList.contains('is-in')) placeBits(false); drawLines(); }, 150);
  });
  addEventListener('load', function () { sizeBg(); drawLines(); });
})();
