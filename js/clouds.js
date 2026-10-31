/* =====================================================================
   The Laban Spot — cloud transition between the hero and Our Story
   As the visitor scrolls out of the hero, three layers of soft clouds rise
   up through the screen (the nearer ones a little faster), cover the hero
   completely, then keep rising and clear away to reveal Our Story.
   Tied directly to scroll position — no automatic playback, nothing to wait for.
   ===================================================================== */
(function () {
  'use strict';
  var box = document.getElementById('clouds'), track = document.getElementById('entranceTrack'), story = document.getElementById('story');
  if (!box || !track || !story || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var L = [].slice.call(box.children);
  // per layer: [start offset, end offset] as fractions of the layer height, sideways drift (vw)
  var CFG = [[.16, .86, -2], [.2, .9, 2.5], [.26, .98, -3.5]];
  var s0 = 0, s1 = 1, vh = innerHeight, lh = 2.4 * innerHeight, ticking = false, ready = false;
  function measure() {
    vh = innerHeight; lh = L[0].offsetHeight || 2.4 * vh;
    var tTop = track.getBoundingClientRect().top + scrollY, tH = track.offsetHeight;
    var sTop = story.getBoundingClientRect().top + scrollY;
    s0 = tTop + (tH - vh) * .8;          // clouds start rising near the end of the hero walk-in
    s1 = sTop + vh * .05;                // ...and have cleared just as Our Story reaches the top
  }
  var ease = function (x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
  function render() {
    ticking = false;
    var p = (scrollY - s0) / Math.max(1, s1 - s0);
    var on = p > -0.02 && p < 1.02;
    box.classList.toggle('is-on', on);
    if (!on) return;
    if (!ready) { ready = true; box.classList.add('is-ready'); }
    var e = ease(Math.max(0, Math.min(1, p)));
    L.forEach(function (el, i) {
      var c = CFG[i];
      // layer top edge enters at the bottom of the screen, its bottom edge leaves past the top
      var y0 = vh - c[0] * lh, y1 = -c[1] * lh;
      var y = y0 + (y1 - y0) * e, x = c[2] * (e - .5);
      el.style.transform = 'translate3d(' + x.toFixed(2) + 'vw,' + y.toFixed(1) + 'px,0)';
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(render); } }
  measure(); render();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', function () { measure(); render(); });
  addEventListener('load', function () { measure(); render(); });
  // preload the cloud pictures once the page has settled, so they are ready before the hero ends
  addEventListener('load', function () { setTimeout(function () { ready = true; box.classList.add('is-ready'); }, 1200); });
})();
