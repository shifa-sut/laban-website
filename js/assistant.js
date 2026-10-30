/* =====================================================================
   The Laban Spot — floating WhatsApp assistant (LaBu the panda)
   Says "Hey! How can I help you?" shortly after the site opens, then only
   a couple more times while the visitor stays (or when they hover the
   panda), and waves now and then. Clicking opens WhatsApp.
   The intro (js/loader.js) calls window.labanPal.arrive() when the running
   panda lands here; on visits without the intro it starts by itself.
   ===================================================================== */
(function () {
  'use strict';
  var pal = document.getElementById('pal');
  if (!pal) return;
  var root = document.documentElement, btn = pal.querySelector('.pal__btn');
  var talks = 0, MAX_TALKS = 3, hideT = 0, started = false;

  function talk(ms) {
    clearTimeout(hideT);
    pal.classList.add('is-talking'); wave();
    hideT = setTimeout(function () { pal.classList.remove('is-talking'); }, ms || 5000);
  }
  function wave() {
    pal.classList.remove('is-waving'); void pal.offsetWidth; pal.classList.add('is-waving');
    setTimeout(function () { pal.classList.remove('is-waving'); }, 1500);
  }
  function start(delay) {
    if (started) return; started = true;
    root.classList.remove('pal-wait');
    setTimeout(function () { talks++; talk(5500); }, delay == null ? 900 : delay);
    // a gentle reminder now and then — at most twice more, never while the visitor is busy typing
    var iv = setInterval(function () {
      if (talks >= MAX_TALKS) { clearInterval(iv); return; }
      var a = document.activeElement;
      if (document.hidden || (a && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) || document.getElementById('sheet') && !document.getElementById('sheet').hidden) return;
      talks++; talk(4500);
    }, 45000);
  }
  btn.addEventListener('mouseenter', function () { talk(3500); });
  btn.addEventListener('focus', function () { talk(3500); });
  btn.addEventListener('mouseleave', function () { clearTimeout(hideT); hideT = setTimeout(function () { pal.classList.remove('is-talking'); }, 800); });

  window.labanPal = { arrive: function () { start(500); }, el: pal };

  // no intro this visit (already seen, or reduced motion) → start on our own
  function maybeStart() {
    if (!document.getElementById('loader') || !root.classList.contains('pal-wait')) start(1500);
    else setTimeout(maybeStart, 400);
  }
  if (!root.classList.contains('pal-wait')) start(1500); else setTimeout(maybeStart, 9000);
})();
