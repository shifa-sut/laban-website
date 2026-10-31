/* =====================================================================
   The Laban Spot — site behaviour (no external libraries)
   ===================================================================== */
(function () {
  'use strict';
  var D = window.LABAN || {};
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  var seg = function (t, a, b) { return clamp((t - a) / (b - a), 0, 1); };
  var eIO = function (x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var IMG = 'assets/images/';
  /* Motion (motion.dev, the Framer Motion engine for plain HTML) — loaded from
     jsDelivr in index.html. If it is missing, the CSS animations take over. */
  var M = (!reduce && window.Motion && typeof Motion.animate === 'function' && typeof Motion.inView === 'function') ? Motion : null;
  if (M) root.classList.add('motion');
  var EASE = [.22, 1, .36, 1];
  function mAnimate(el, kf, opt) { try { return M.animate(el, kf, opt); } catch (e) { return null; } }
  function afterAnim(ctrl, fn, ms) { var done = false, go = function () { if (!done) { done = true; fn(); } }; setTimeout(go, ms); try { var pr = ctrl && (ctrl.finished || ctrl); if (pr && pr.then) pr.then(go, go); } catch (e) {} }
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var waLink = function (text) { return 'https://wa.me/' + (D.phoneRaw || '917994059711') + (text ? '?text=' + encodeURIComponent(text) : ''); };

  $('#yr').textContent = new Date().getFullYear();

  /* ---------------- marquee ---------------- */
  var row = (D.MENU || []).map(function (m) { return '<span class="marquee__item">' + m.name + '<i></i></span>'; }).join('') + '<span class="marquee__item">A new item every month<i></i></span>';
  $('#marqueeTrack').innerHTML = row + row;

  /* ---------------- nav ---------------- */
  var nav = $('#nav'), burger = $('#burger'), menu = $('#mobileMenu');
  function setMenu(open) {
    menu.hidden = !open; root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(menu.hidden); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  addEventListener('resize', function () { if (innerWidth >= 1100 && !menu.hidden) setMenu(false); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); closeSheet(); closeLightbox(); } });
  var links = $$('.nav__links a');
  var activeIO = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); }); }); }, { rootMargin: '-45% 0px -50% 0px' });
  ['story', 'menu', 'new', 'franchise', 'outlets', 'contact'].forEach(function (id) { var el = document.getElementById(id); if (el) activeIO.observe(el); });

  /* ---------------- reveal on view ---------------- */
  var revIO = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); revIO.unobserve(en.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: .01 });
  function watch(scope) {
    $$('[data-reveal]', scope).forEach(function (el) {
      if (el.dataset.watched) return; el.dataset.watched = '1';
      if (reduce) { el.classList.add('in'); return; }
      // CSS transitions only: smooth and identical on every device (see .js [data-reveal] in style.css)
      revIO.observe(el);
    });
  }

  /* counters */
  var cntIO = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return; cntIO.unobserve(en.target);
      var el = en.target, n = +el.dataset.count, t0 = performance.now();
      if (reduce || n < 2) return;
      (function step(now) { var p = clamp((now - t0) / 1400, 0, 1); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(t0);
    });
  }, { threshold: .6 });
  $$('[data-count]').forEach(function (el) { cntIO.observe(el); });

  /* =================================================================
     Explore our menu — tiles + detail sheet
     ================================================================= */
  var MENU = D.MENU || [];
  // one clear, transparent image per range: the full cup, tray, bottles or box, nothing cropped
  var COVER = { salankatia: 'cutouts/salankatia-nutella-pistachio-top.webp', koushri: 'cutouts/koushri-nutella-hazelnut.webp', qashtuta: 'cutouts/qashtuta-mango-strawberry.webp',
    bambooza: 'cutouts/bambooza-nutella.webp', heba: 'cutouts/heba-cake-tray.webp', aseera: 'cutouts/aseera-trio-bottles.webp', cheesebomb: 'cutouts/cheese-bomb-box.webp' };
  var list = $('#menuList'), feat = $('#menuFeature'), featImg = $('#featImg'), featBody = $('#featBody'), cur = -1;
  function countText(m) { return m.flavours.length > 1 ? [m.flavours.length, 'flavours'] : [1, m.pack]; }
  list.innerHTML = MENU.map(function (m, i) {
    var c = countText(m);
    return '<button type="button" class="pick" role="tab" aria-selected="false" data-i="' + i + '" data-reveal style="--d:' + (i * .05) + 's">' +
      '<span class="pick__img"><img src="' + IMG + COVER[m.id] + '" alt="" loading="lazy"></span>' +
      '<span class="pick__body"><span class="pick__name">' + m.name + '</span><span class="pick__meta">' + (c[0] > 1 ? c[0] + ' flavours' : c[1]) + '</span></span></button>';
  }).join('');
  watch(list);

  function fillFeature(i) {
    var m = MENU[i], c = countText(m);
    featImg.src = IMG + COVER[m.id]; featImg.alt = m.name + (m.flavours.length > 1 ? '' : ' ' + m.flavours[0].n);
    $('#featAr').textContent = m.ar || ''; $('#featName').textContent = m.name;
    $('#featCount').textContent = c[0] > 1 ? c[0] : ''; $('#featCountLabel').textContent = c[0] > 1 ? 'flavours' : c[1];
    $('#featDesc').textContent = m.note || ('Served in a ' + m.pack.toLowerCase() + '.' + (m.flavours.length > 1 ? ' Choose from ' + m.flavours.length + ' flavours.' : ''));
    $('#featChips').innerHTML = m.flavours.map(function (f) { return '<li>' + f.n + '</li>'; }).join('');
    $('#featIndex').textContent = String(i + 1).padStart(2, '0') + ' / ' + String(MENU.length).padStart(2, '0');
  }
  function select(i, focus) {
    i = (i + MENU.length) % MENU.length; if (i === cur) return;
    var first = cur < 0; cur = i;
    $$('.pick', list).forEach(function (b) { var on = +b.dataset.i === i; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); });
    if (focus) list.querySelector('[data-i="' + i + '"]').focus();
    if (first || reduce) { fillFeature(i); return; }
    feat.classList.add('is-switching');
    setTimeout(function () {
      fillFeature(i);
      var done = function () { requestAnimationFrame(function () { feat.classList.remove('is-switching'); }); };
      if (featImg.complete) done(); else { featImg.onload = done; featImg.onerror = done; }
    }, 260);
  }
  list.addEventListener('click', function (e) { var b = e.target.closest('.pick'); if (b) select(+b.dataset.i); });
  list.addEventListener('keydown', function (e) {
    if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].indexOf(e.key) < 0) return;
    e.preventDefault(); select(cur + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1), true);
  });
  $('#featPrev').addEventListener('click', function () { select(cur - 1); });
  $('#featNext').addEventListener('click', function () { select(cur + 1); });
  $('#featGo').addEventListener('click', function () { openSheet(cur); });
  select(0);

  var sheet = $('#sheet'), sImg = $('#sheetImg'), sChips = $('#sheetChips'), sheetState = { r: 0, f: 0 }, sheetReturn = null;
  function flavourImage(m, f) {
    var fl = m.flavours[f], P = IMG + 'products/';
    if (fl && fl.img) return { src: P + fl.img, cap: '', alt: m.name + ' ' + fl.n };
    if (fl && fl.poster) return { src: P + fl.poster, cap: '', alt: m.name + ' ' + fl.n };
    if (m.rangeImg) return { src: P + m.rangeImg, cap: m.name, alt: m.name };
    // no photo of this flavour yet: show the range's own photo (the printed menu card shows prices, so it is not used)
    return { src: IMG + (COVER[m.id] || 'products/' + (m.rangeImg || '')), cap: 'Photo of ' + fl.n + ' coming soon', alt: m.name };
  }
  function firstImg(m) { for (var i = 0; i < m.flavours.length; i++) if (m.flavours[i].img || m.flavours[i].poster) return i; return 0; }
  function setSheetImage(m, f, animate) {
    var v = flavourImage(m, f);
    var apply = function () { sImg.src = v.src; sImg.alt = v.alt; $('#sheetCap').textContent = v.cap; };
    if (!animate || reduce) { apply(); return; }
    if (M) {
      afterAnim(mAnimate(sImg, { opacity: [1, 0] }, { duration: .18 }), function () {
        apply(); var show = function () { mAnimate(sImg, { opacity: [0, 1], transform: ['scale(.97)', 'scale(1)'] }, { duration: .45, ease: EASE }); };
        if (sImg.complete) show(); else sImg.onload = show;
      }, 260);
      return;
    }
    sImg.classList.add('is-swapping');
    setTimeout(function () { apply(); var done = function () { sImg.classList.remove('is-swapping'); }; if (sImg.complete) requestAnimationFrame(done); else sImg.onload = done; }, 220);
  }
  function openSheet(r) {
    var m = MENU[r]; if (!m) return; sheetReturn = document.activeElement;
    var f = firstImg(m); sheetState = { r: r, f: f };
    $('#sheetName').textContent = m.name; $('#sheetAr').textContent = m.ar || '';
    $('#sheetPack').textContent = m.flavours.length > 1 ? m.flavours.length + ' flavours' : '';
    $('#sheetNote').textContent = m.note || '';
    sChips.innerHTML = (m.flavours.length > 1 || m.flavours[0].n !== m.name) ? m.flavours.map(function (fl, i) { return '<li><button type="button" class="chip" aria-pressed="' + (i === f) + '" data-f="' + i + '">' + fl.n + '</button></li>'; }).join('') : '';
    $('#sheetOrder').href = waLink('Hi The Laban Spot! I would like to know about ' + m.name + '.');
    setSheetImage(m, f, false);
    sheet.hidden = false; document.body.style.overflow = 'hidden'; $('.sheet__close').focus();
    if (M) { mAnimate($('.sheet__scrim'), { opacity: [0, 1] }, { duration: .3 }); mAnimate($('.sheet__panel'), { opacity: [0, 1], transform: ['translateY(40px) scale(.98)', 'translateY(0px) scale(1)'] }, { duration: .55, ease: EASE }); }
  }
  var closing = false;
  function closeSheet() {
    if (sheet.hidden || closing) return;
    var hide = function () { closing = false; sheet.hidden = true; document.body.style.overflow = ''; sheetReturn && sheetReturn.focus(); };
    if (!M) { hide(); return; }
    closing = true; mAnimate($('.sheet__scrim'), { opacity: 0 }, { duration: .25 });
    afterAnim(mAnimate($('.sheet__panel'), { opacity: 0, transform: 'translateY(30px) scale(.98)' }, { duration: .25, ease: EASE }), hide, 320);
  }
  window.labanOpenSheet = openSheet;   // used by the featured Salankatia showcase
  sheet.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeSheet(); });
  sChips.addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return; var f = +b.dataset.f, m = MENU[sheetState.r];
    $$('.chip', sChips).forEach(function (c) { c.setAttribute('aria-pressed', c === b); });
    if (f === sheetState.f) return; var same = flavourImage(m, f).src === flavourImage(m, sheetState.f).src; sheetState.f = f;
    if (!same) setSheetImage(m, f, true);
    $('#sheetOrder').href = waLink('Hi The Laban Spot! I would like to know about ' + m.name + ' ' + m.flavours[f].n + '.');
  });

  /* =================================================================
     Signature creations — horizontal gallery
     ================================================================= */
  var SIG = D.SIGNATURES || [];
  var rail = $('#galleryRail'), gallery = $('#signatures'), track = $('#galleryTrack'), gBar = $('#galleryBar');
  rail.innerHTML = SIG.map(function (s, i) {
    return '<article class="g-card"><figure class="ph"><img src="' + IMG + 'products/' + s.img + '" alt="' + s.range + ' ' + s.n + ' poster" width="1200" height="1501" loading="lazy"></figure>' +
      '<p>' + s.range + '</p><h3>' + s.n + '</h3></article>';
  }).join('');
  var pinMQ = matchMedia('(min-width:900px) and (min-height:600px)');
  var gDist = 0;
  function layoutGallery() {
    var pin = pinMQ.matches && !reduce;
    gallery.classList.toggle('is-pinned', pin);
    if (pin) { rail.style.transform = ''; gDist = Math.max(0, rail.scrollWidth - innerWidth); track.style.height = (innerHeight + gDist) + 'px'; }
    else { track.style.height = ''; rail.style.transform = ''; gDist = 0; }
  }
  rail.addEventListener('scroll', function () { if (!gallery.classList.contains('is-pinned')) gBar.style.transform = 'scaleX(' + (.1 + .9 * rail.scrollLeft / Math.max(1, rail.scrollWidth - rail.clientWidth)) + ')'; }, { passive: true });

  /* =================================================================
     What's new — editorial rows
     ================================================================= */
  // rendered by js/whatsnew.js (scroll showcase)

  /* =================================================================
     Reviews (real guests only — js/data.js)
     ================================================================= */
  var REV = D.REVIEWS || [], rb = $('#reviewsBody'), ri = 0;
  function showReview() {
    var r = REV[ri];
    rb.innerHTML = '<figure class="review"><blockquote>“' + esc(r.text) + '”</blockquote><cite>' + esc(r.name) + (r.source ? ' · ' + esc(r.source) : '') + '</cite></figure>' +
      (REV.length > 1 ? '<div class="reviews__nav"><button type="button" data-d="-1" aria-label="Previous review">‹</button><span class="reviews__count">' + String(ri + 1).padStart(2, '0') + ' / ' + String(REV.length).padStart(2, '0') + '</span><button type="button" data-d="1" aria-label="Next review">›</button></div>' : '');
  }
  if (REV.length) { showReview(); rb.addEventListener('click', function (e) { var b = e.target.closest('[data-d]'); if (b) { ri = (ri + (+b.dataset.d) + REV.length) % REV.length; showReview(); } }); }
  else rb.innerHTML = '<div class="reviews__empty"><p>Tasted something you loved?</p><p>Tell us on Instagram or WhatsApp. We will share real reviews from our guests here.</p><div class="acts"><a class="btn btn--sm" href="' + D.instagram + '" target="_blank" rel="noopener">Instagram</a><a class="btn btn--sm btn--ghost" href="' + waLink('Hi The Laban Spot! Here is my review: ') + '" target="_blank" rel="noopener">WhatsApp</a></div></div>';

  /* =================================================================
     Outlets
     ================================================================= */
  // Outlets are written straight into index.html (Kerala, Tamil Nadu, Karnataka).

  /* =================================================================
     Forms → WhatsApp
     ================================================================= */
  // open WhatsApp in a new tab; if the browser blocks the new tab, go there in this tab instead
  function openWa(url) {
    var w = null; try { w = window.open(url, '_blank'); } catch (e) {}
    if (w) { try { w.opener = null; } catch (e) {} } else location.href = url;
  }
  function validate(form) {
    var ok = true;
    $$('[required]', form).forEach(function (inp) {
      var err = inp.parentElement.querySelector('.err'), msg = '';
      if (!inp.value.trim()) msg = 'Please fill this in.';
      else if (inp.type === 'tel' && inp.value.replace(/\D/g, '').length < 10) msg = 'Enter a 10-digit phone number.';
      if (err) err.textContent = msg; if (msg) ok = false;
    });
    if (!ok) { var bad = $('.err:not(:empty)', form); bad && bad.parentElement.querySelector('input,textarea').focus(); }
    return ok;
  }
  var fForm = $('#franchiseForm');
  fForm.addEventListener('submit', function (e) {
    e.preventDefault(); if (!validate(fForm)) return;
    var d = Object.fromEntries(new FormData(fForm));
    $('#waSend').href = waLink("Hi The Laban Spot! I'd like to enquire about a franchise.\n\nName: " + d.name + '\nPhone: ' + d.phone + '\nCity: ' + d.city + '\nPreferred outlet: ' + d.model + (d.message ? '\nMessage: ' + d.message : ''));
    $('#formWrap').hidden = true; $('#formDone').hidden = false; $('#waSend').focus();
    openWa($('#waSend').href);          // straight to WhatsApp with the details filled in; the button stays as a backup
  });
  $('#formBack').addEventListener('click', function () { $('#formWrap').hidden = false; $('#formDone').hidden = true; });
  var cForm = $('#contactForm');
  cForm.addEventListener('submit', function (e) {
    e.preventDefault(); if (!validate(cForm)) return;
    var d = Object.fromEntries(new FormData(cForm)), a = $('#contactWa');
    a.href = waLink('Hi The Laban Spot! This is ' + d.name + '.\n\n' + d.message); a.hidden = false; a.focus();
    openWa(a.href);
  });
  $$('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1600); };
      var sel = function () { var a = b.parentElement.querySelector('a'), r = document.createRange(); r.selectNodeContents(a); var s = getSelection(); s.removeAllRanges(); s.addRange(r); };
      try { navigator.clipboard.writeText(b.dataset.copy).then(done, sel); } catch (e) { sel(); }
    });
  });

  /* =================================================================
     Menu card lightbox
     ================================================================= */
  var LB = [{ src: IMG + 'menu/menu-page-1.jpg', cap: 'Menu card · Salankatia, Koushri, Heba Cake' }, { src: IMG + 'menu/menu-page-2.jpg', cap: 'Menu card · Qashtuta, Bambooza, Aseera, Cheese Bomb' }, { src: IMG + 'menu/menu-full.jpg', cap: 'The full menu on one page' }];
  var lb = $('#lightbox'), lbImg = $('#lightboxImg'), lbIdx = 0, lbReturn = null;
  function showLB(i) { lbIdx = (i + LB.length) % LB.length; lbImg.src = LB[lbIdx].src; lbImg.alt = LB[lbIdx].cap; $('#lightboxCap').textContent = LB[lbIdx].cap + ' (' + (lbIdx + 1) + ' of ' + LB.length + ')'; }
  function closeLightbox() { if (lb.hidden) return; lb.hidden = true; document.body.style.overflow = ''; lbReturn && lbReturn.focus(); }
  $$('[data-lightbox]').forEach(function (b) { b.addEventListener('click', function () { lbReturn = b; showLB(+b.dataset.lightbox); lb.hidden = false; document.body.style.overflow = 'hidden'; $('.lightbox__close').focus(); }); });
  $('.lightbox__close').addEventListener('click', closeLightbox);
  $('.lightbox__prev').addEventListener('click', function () { showLB(lbIdx - 1); });
  $('.lightbox__next').addEventListener('click', function () { showLB(lbIdx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') showLB(lbIdx + 1); if (e.key === 'ArrowLeft') showLB(lbIdx - 1); });
  var lbX = null; lb.addEventListener('touchstart', function (e) { lbX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { if (lbX === null) return; var dx = e.changedTouches[0].clientX - lbX; if (Math.abs(dx) > 50) showLB(lbIdx + (dx < 0 ? 1 : -1)); lbX = null; });

  /* =================================================================
     Scroll engine: shop entrance + gallery scrub + nav state
     ================================================================= */
  /* ---------- shop entrance: scroll position drives the video ---------- */
  var ent = $('.entrance'), entTrack = $('#entranceTrack'), video = $('#entranceVideo'), frameEl = $('#entranceFrame');
  var fade = $('#entranceFade'), eBar = $('#entranceBar'), cue = $('#scrollCue');
  var heroCopy = $('#entranceCopy'), inside = $('#entranceInside'), shade = $('#entranceShade');
  // scroll timeline (share of the pinned scroll):
  //   0–.22 intro copy lifts away · 0–.88 walk-in video · .90–1 settle into the next section
  //   "You're in · Pull up a chair." shows while the camera passes through the doors (see VARIANTS.door)
  var VIDEO_END = .88, HAND_OFF = .90;
  var vDur = 0, vCur = 0, vTarget = 0, vReady = false, heroRunning = false;
  // two versions of the walk-in, each at its native resolution:
  // landscape for desktops, laptops and landscape tablets; 9:16 portrait for phones and portrait tablets
  var VARIANTS = {
    // door: [fade in from, fully in, start fading out, gone] as a share of each video's length,
    // matched to the moment that video's camera passes through the entrance
    landscape: { src: 'assets/video/shop-entrance-landscape.mp4', poster: 'assets/video/shop-entrance-poster.jpg', aspect: 16 / 9, door: [.28, .37, .54, .63] },
    portrait: { src: 'assets/video/shop-entrance-portrait.mp4', poster: 'assets/video/shop-entrance-poster-portrait.jpg', aspect: 9 / 16, door: [.48, .56, .70, .79] }
  };
  var portraitMQ = window.matchMedia('(orientation: portrait)');
  var variant = null, loadToken = 0, blobs = {};
  window.labanHero = { ready: false };
  function heroReady() { if (!window.labanHero.ready) { window.labanHero.ready = true; window.dispatchEvent(new Event('laban:heroready')); } }

  // the frame is full screen in CSS (object-fit: cover keeps proportions); only the poster follows the variant
  function layoutFrame() { var v = VARIANTS[variant] || VARIANTS.landscape; video.poster = v.poster; }

  function loadVariant(name) {
    if (name === variant) return;
    var prevP = vDur ? vCur / vDur : 0;
    variant = name; vReady = false; vDur = 0; ent.classList.remove('is-video');
    layoutFrame();
    if (reduce) { heroReady(); return; }      // reduced motion: keep the still first frame
    var v = VARIANTS[name], token = ++loadToken;
    video.poster = v.poster;
    function useSrc(url) {
      if (token !== loadToken) return;
      video.src = url; video.preload = 'auto';
      video.addEventListener('loadeddata', function () {
        if (token !== loadToken) return;
        vDur = video.duration || 0; vReady = true; video.pause();
        vCur = prevP * vDur;
        try { video.currentTime = Math.min(vCur, Math.max(0, vDur - .05)); } catch (e) {}
        ent.classList.add('is-video'); heroReady(); kickHero();
      }, { once: true });
      video.addEventListener('error', heroReady, { once: true });
      video.load();
    }
    // fetch the whole file into memory so scrubbing never waits on the network
    if (blobs[name]) useSrc(blobs[name]);
    else if (window.fetch && location.protocol !== 'file:') {
      fetch(v.src).then(function (r) { if (!r.ok) throw 0; return r.blob(); })
        .then(function (b) { blobs[name] = URL.createObjectURL(b); useSrc(blobs[name]); })
        .catch(function () { useSrc(v.src); });
    } else useSrc(v.src);
  }
  function pickVariant() { loadVariant(portraitMQ.matches ? 'portrait' : 'landscape'); }
  pickVariant();
  setTimeout(heroReady, 8000);                // never hold the loader longer than this
  var onOrient = function () { pickVariant(); layoutFrame(); kickHero(); };
  if (portraitMQ.addEventListener) portraitMQ.addEventListener('change', onOrient); else if (portraitMQ.addListener) portraitMQ.addListener(onOrient);
  var heroResizeT;
  addEventListener('resize', function () { clearTimeout(heroResizeT); heroResizeT = setTimeout(function () { layoutFrame(); kickHero(); }, 60); });

  video.addEventListener('play', function () { video.pause(); });   // scroll is the only way it moves
  // iOS Safari only paints seeks after one muted play; do it silently on first touch
  if (/iP(hone|ad|od)/.test(navigator.userAgent)) addEventListener('touchstart', function unlock() {
    removeEventListener('touchstart', unlock); var pr = video.play(); if (pr && pr.then) pr.then(function () { video.pause(); }, function () {});
  }, { passive: true });

  function progress(el) { var r = el.getBoundingClientRect(), h = r.height - innerHeight; return h <= 0 ? (r.top < 0 ? 1 : 0) : clamp(-r.top / h, 0, 1); }
  function heroFrame() {
    var r = ent.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= innerHeight) { heroRunning = false; return; }
    var p = progress(entTrack);
    ent.classList.toggle('is-moving', p > .01);
    eBar.style.transform = 'scaleX(' + seg(p, 0, VIDEO_END).toFixed(4) + ')';
    // when the whole shop starts in view, grow gently to full screen during the first half of the walk-in
    // intro copy lifts away as you start walking in (approved timing)
    var out = seg(p, .02, .22);
    heroCopy.style.opacity = (1 - out).toFixed(3);
    heroCopy.style.transform = out > 0 ? 'translate3d(0,' + (-out * 60).toFixed(1) + 'px,0)' : '';
    heroCopy.style.visibility = out >= 1 ? 'hidden' : '';
    // "You're in · Pull up a chair." while the camera passes through the doors, then on into the shop
    var door = (VARIANTS[variant] || VARIANTS.landscape).door, vf = seg(p, 0, VIDEO_END);
    var inn = eIO(seg(vf, door[0], door[1])), innOut = eIO(seg(vf, door[2], door[3])), vis = inn * (1 - innOut);
    inside.style.opacity = vis.toFixed(3);
    inside.style.transform = 'translate3d(0,' + ((1 - inn) * 24 - innOut * 24).toFixed(1) + 'px,0)';
    shade.style.opacity = (1 - .5 * seg(p, .15, .3) + .4 * vis).toFixed(3);
    // hand-off: settle into the next section's colour
    fade.style.setProperty('--out', eIO(seg(p, HAND_OFF, 1)).toFixed(3));
    // video time follows scroll, eased so fast flicks still look smooth
    if (vReady && vDur) {
      vTarget = seg(p, 0, VIDEO_END) * (vDur - .05);
      var diff = vTarget - vCur;
      vCur = Math.abs(diff) < .002 ? vTarget : vCur + diff * .22;
      if (!video.seeking && Math.abs(video.currentTime - vCur) > .02) {
        try { if (video.fastSeek && Math.abs(diff) > 1) video.fastSeek(vCur); else video.currentTime = vCur; } catch (e) {}
      }
      if (Math.abs(diff) > .002 || video.seeking) { requestAnimationFrame(heroFrame); return; }
    }
    heroRunning = false;
  }
  function kickHero() { if (!heroRunning && !reduce) { heroRunning = true; requestAnimationFrame(heroFrame); } }

  function update() {
    ticking = false;
    var y = scrollY, heroEnd = (entTrack.offsetHeight - innerHeight) * (HAND_OFF + .04);
    nav.classList.toggle('is-solid', y > heroEnd);
    root.classList.toggle('at-top', y < heroEnd);
    if (reduce) return;
    kickHero();

    // --- gallery scrub
    if (gallery.classList.contains('is-pinned')) {
      var gr = track.getBoundingClientRect();
      if (gr.top < innerHeight && gr.bottom > 0) {
        var gp = clamp(-gr.top / Math.max(1, gr.height - innerHeight), 0, 1);
        rail.style.transform = 'translate3d(' + (-gp * gDist).toFixed(1) + 'px,0,0)';
        gBar.style.transform = 'scaleX(' + (.1 + .9 * gp) + ')';
      }
    }
  }
  var ticking = false;
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  addEventListener('scroll', onScroll, { passive: true });
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { layoutGallery(); update(); }, 120); });
  (pinMQ.addEventListener ? pinMQ.addEventListener('change', layoutGallery) : pinMQ.addListener(layoutGallery));
  addEventListener('load', function () { layoutGallery(); update(); });
  layoutGallery(); update();

  watch(document);
})();
