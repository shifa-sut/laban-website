/* =====================================================================
   The Laban Spot — loading screen
   One continuous white line draws a takeaway cup on Laban Spot blue. How
   much of the line is drawn follows the page's real loading progress
   (images, the hero video and the window load event); when the cup is
   complete a soft glint flows along the line, then the homepage opens.
   When everything is ready the screen fades into the homepage and the
   panda shows up as the floating WhatsApp assistant (js/assistant.js).
   Shown once per browser session.
   ===================================================================== */
(function () {
  'use strict';
  var root = document.documentElement, el = document.getElementById('loader');
  if (!el || el.hidden) { root.classList.remove('is-loading', 'pal-wait'); root.classList.add('is-ready'); return; }

  var bar = document.getElementById('ldBar'), line = document.getElementById('ldLine'), pct = document.getElementById('ldPct'), ld = el.querySelector('.ld');

  var finished = false;
  function done() {
    if (finished) return; finished = true;
    try { sessionStorage.setItem('labanLoaded', '1'); } catch (e) {}
    root.classList.remove('is-loading'); root.classList.add('is-ready');
    el.classList.add('is-done');
    root.classList.remove('pal-wait');
    if (window.labanPal) window.labanPal.arrive();
    setTimeout(function () { el.remove(); }, 900);
  }
  el.querySelector('.loader__skip').addEventListener('click', done);
  addEventListener('keydown', function (e) { if (e.key === 'Escape') done(); });

  /* ---------- real progress ---------- */
  var loaded = document.readyState === 'complete';
  addEventListener('load', function () { loaded = true; });
  function realProgress() {
    var imgs = [].filter.call(document.images, function (i) { return !i.closest('#loader') && i.loading !== 'lazy'; });
    var ok = imgs.filter(function (i) { return i.complete; }).length;
    var pImg = imgs.length ? ok / imgs.length : 1;
    var hero = window.labanHero ? (window.labanHero.ready ? 1 : .4) : 1;
    var p = .1 + .45 * pImg + .25 * hero + (loaded ? .2 : 0);
    if (document.readyState !== 'loading') p = Math.max(p, .3);
    return Math.min(1, p);
  }

  var MIN_TIME = 2.8, MAX_TIME = 9;     // long enough to watch the cup being drawn, never longer than needed
  var shown = 0, t0 = null, last = 0, fullAt = null;
  function frame(now) {
    if (finished) return;
    if (t0 === null) { t0 = now; last = now; }
    var t = (now - t0) / 1000, dt = Math.min(.05, (now - last) / 1000); last = now;

    // bar: follow the real progress smoothly, but pace it so it never jumps to 100% instantly
    var target = realProgress();
    if (t > MAX_TIME) target = 1;
    var cap = Math.min(1, t / MIN_TIME);                     // at most as far as the minimum time allows
    target = Math.min(target, Math.max(cap, .02));
    shown += (target - shown) * Math.min(1, dt * 2.6);
    if (target >= 1 && shown > .995) shown = 1;
    line.style.strokeDashoffset = (1 - shown).toFixed(4);
    pct.textContent = Math.round(shown * 100);
    bar.setAttribute('aria-valuenow', Math.round(shown * 100));

    if (shown >= 1 && fullAt === null) { fullAt = t; ld.classList.add('is-flowing'); }
    if (fullAt !== null && t - fullAt > 1.3) { done(); return; }   // let the finished cup shine for a moment
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
