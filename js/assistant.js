/* =====================================================================
   The Laban Spot — floating WhatsApp assistant (LaBu the panda)
   LaBu stays in the bottom-right corner on every section, waving with his
   left hand, with "Hey! How can I help you?" shown above him. Tapping the
   panda or the bubble opens WhatsApp (+91 79940 59711).
   The loading screen (js/loader.js) calls window.labanPal.arrive() when it
   finishes; on visits without the loading screen it starts by itself.
   ===================================================================== */
(function () {
  'use strict';
  var pal = document.getElementById('pal');
  if (!pal) return;
  var root = document.documentElement, started = false;
  function start(delay) {
    if (started) return; started = true;
    root.classList.remove('pal-wait');
    setTimeout(function () { pal.classList.add('is-talking'); }, delay == null ? 700 : delay);
  }
  window.labanPal = { arrive: function () { start(500); }, el: pal };
  function maybeStart() {
    if (!document.getElementById('loader') || !root.classList.contains('pal-wait')) start(800);
    else setTimeout(maybeStart, 400);
  }
  if (!root.classList.contains('pal-wait')) start(800); else setTimeout(maybeStart, 9000);
})();
