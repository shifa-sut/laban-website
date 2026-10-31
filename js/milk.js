/* =====================================================================
   The Laban Spot — milk wave transition between the hero and Our Story
   Scrolling out of the hero, a white milky wave rises from the bottom of
   the screen until the whole screen is milk white, then fades into Our
   Story (which has the same milk-white background). Tied to scroll only.
   ===================================================================== */
(function () {
  'use strict';
  var box = document.getElementById('milk'), track = document.getElementById('entranceTrack'), story = document.getElementById('story');
  if (!box || !track || !story || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var body = box.firstElementChild, s0 = 0, s1 = 1, sF = 1.5, s2 = 2, vh = innerHeight, ticking = false;
  function measure() {
    vh = innerHeight;
    var tTop = track.getBoundingClientRect().top + scrollY, tH = track.offsetHeight;
    var sTop = story.getBoundingClientRect().top + scrollY;
    s0 = tTop + (tH - vh) * .66;     // the wave starts rising over the shop while the walk-in is still playing
    s1 = tTop + (tH - vh) * .9;      // ...and covers the whole screen right as the hero hands over
    sF = sTop - vh * .35;            // stays milk white until Our Story arrives,
    s2 = sTop + vh * .12;            // ...then melts away into it
  }
  var ease = function (x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
  function render() {
    ticking = false;
    var y = scrollY, on = y > s0 - 2 && y < s2;
    box.classList.toggle('is-on', on);
    if (!on) return;
    var p = ease(Math.max(0, Math.min(1, (y - s0) / Math.max(1, s1 - s0))));
    body.style.transform = 'translate3d(0,' + ((1 - p) * vh - p * 170).toFixed(1) + 'px,0)';
    box.style.opacity = y > sF ? Math.max(0, 1 - (y - sF) / Math.max(1, s2 - sF)).toFixed(3) : 1;
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(render); } }
  measure(); render();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', function () { measure(); render(); });
  addEventListener('load', function () { measure(); render(); });
})();
