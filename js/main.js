/* ═══════════════════════════════════════════
   ESEN SOFRASI — scroll koreografisi
   GSAP + ScrollTrigger + Lenis
   ═══════════════════════════════════════════ */

document.body.classList.add('is-loading');
gsap.registerPlugin(ScrollTrigger);

const mq = window.matchMedia('(max-width: 760px)');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── küçük yardımcılar ───────────────────── */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/** Bir elementin metnini karakterlere böler (GSAP SplitText yerine) */
function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  return [...text].map(c => {
    const s = document.createElement('span');
    s.className = 'ch';
    s.textContent = c === ' ' ? ' ' : c;
    el.appendChild(s);
    return s;
  });
}

/** Metni kelimelere böler */
function splitWords(el) {
  const words = el.textContent.split(/\s+/);
  el.textContent = '';
  return words.map((w, i) => {
    const s = document.createElement('span');
    s.className = 'w';
    s.textContent = w;
    el.appendChild(s);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    return s;
  });
}

/* ═══════════ LENIS SMOOTH SCROLL ═══════════ */
let lenis = null;
if (!reduce) {
  lenis = new Lenis({
    duration: 1.15,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* menü linkleri */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = id === '#top' ? 0 : $(id);
    if (!target && target !== 0) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else window.scrollTo({ top: target === 0 ? 0 : target.offsetTop, behavior: 'smooth' });
  });
});

/* ═══════════ PRELOADER ═══════════ */
function runPreloader() {
  const pre  = $('#preload');
  const fill = $('#preloadFill');
  const pct  = $('#preloadPct');
  const state = { v: 0 };

  // Kritik medya yüklenene kadar 0→92, sonra hızla 100.
  const critical = ['assets/img/poster-sis-kebap.jpg', 'assets/img/kuzu-sis.jpg'];
  let settled = false;
  Promise.race([
    Promise.all(critical.map(src => new Promise(res => {
      const i = new Image(); i.onload = i.onerror = res; i.src = src;
    }))),
    new Promise(res => setTimeout(res, 2600))
  ]).then(() => { settled = true; });

  const tl = gsap.timeline();
  tl.to(state, {
    v: 92, duration: 1.5, ease: 'power1.inOut',
    onUpdate: () => {
      fill.style.width = state.v + '%';
      pct.textContent = Math.round(state.v);
    }
  });
  tl.to(state, {
    v: 100, duration: 0.5, ease: 'power2.out',
    onStart: function () { if (!settled) this.pause(), waitThen(this); },
    onUpdate: () => {
      fill.style.width = state.v + '%';
      pct.textContent = Math.round(state.v);
    }
  });
  tl.to('.preload__inner', { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' }, '+=0.15');
  tl.to(pre, {
    yPercent: -100, duration: 1.05, ease: 'expo.inOut',
    onComplete: () => {
      pre.remove();
      document.body.classList.remove('is-loading');
      ScrollTrigger.refresh();
    }
  }, '-=0.1');
  tl.add(heroIntro, '-=0.55');

  function waitThen(tween) {
    const id = setInterval(() => {
      if (settled) { clearInterval(id); tween.resume(); }
    }, 100);
  }
}

/* ═══════════ HERO ═══════════ */
let heroIntro = () => {};
function setupHero() {
  const chars = $$('.hero__title [data-split]').flatMap(splitChars);
  gsap.set(chars, { yPercent: 118, opacity: 0, rotateX: -55 });
  gsap.set('#heroSerif', { yPercent: 112 });
  gsap.set('.hero .eyebrow, .hero__sub, .rating, .scrollcue', { opacity: 0, y: 26 });

  heroIntro = () => {
    const tl = gsap.timeline();
    tl.to('.hero .eyebrow', { opacity: 1, y: 0, duration: .8, ease: 'power3.out' })
      .to(chars, {
        yPercent: 0, opacity: 1, rotateX: 0,
        duration: 1.25, ease: 'expo.out', stagger: 0.035
      }, '-=0.5')
      .to('#heroSerif', { yPercent: 0, duration: 1.35, ease: 'expo.out' }, '-=1.0')
      .to('.hero__sub', { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }, '-=0.75')
      .to('.rating', { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, '-=0.65')
      .to('.scrollcue', { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, '-=0.7');
  };

  // scroll ile hero derinliğe gömülür
  if (reduce) return;
  gsap.to('#heroMedia', {
    yPercent: 16, scale: 1.14, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero__content', {
    yPercent: -34, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '70% top', scrub: true }
  });
  gsap.to('.hero__meta', {
    opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '35% top', scrub: true }
  });
}

/* ═══════════ NAV ═══════════ */
function setupNav() {
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: self => $('#nav').classList.toggle('is-stuck', self.scroll() > 80)
  });
}

/* ═══════════ MANİFESTO — kelime kelime yanma ═══════════ */
function setupManifesto() {
  const h = $('[data-reveal]');
  if (!h) return;
  const words = splitWords(h);
  gsap.to(words, {
    color: '#F3ECE1',
    ease: 'none',
    stagger: 0.35,
    scrollTrigger: {
      trigger: h,
      // yanma, yazı tam ekranın ortasına geldiğinde bitsin
      start: 'top 82%',
      end: 'top 35%',
      scrub: reduce ? false : 0.4
    }
  });
}

/* ═══════════ SCRUB — scroll ateşi çeviriyor ═══════════ */
function setupScrub() {
  const v = $('#scrubVideo');
  const fill = $('#scrubFill');
  const steps = $$('.step');
  if (!v) return;

  v.pause();
  let dur = 0;
  const readDur = () => { dur = v.duration || 0; ScrollTrigger.refresh(); };
  if (v.readyState >= 1) readDur();
  v.addEventListener('loadedmetadata', readDur, { once: true });

  // adımlar
  gsap.set(steps, { opacity: 0, y: 40, filter: 'blur(6px)' });

  const st = ScrollTrigger.create({
    trigger: '.scrub',
    start: 'top top',
    end: '+=320%',
    pin: '.scrub__stage',
    scrub: true,
    onUpdate: self => {
      const p = self.progress;
      if (dur) v.currentTime = Math.min(dur - 0.05, p * dur);
      fill.style.width = (p * 100).toFixed(1) + '%';

      // 4 adım, her biri %25'lik dilim
      const seg = 1 / steps.length;
      steps.forEach((el, i) => {
        const local = (p - i * seg) / seg;           // 0..1 aralığı
        let o = 0, y = 40, b = 6;
        if (local > -0.35 && local < 1.35) {
          const eased = Math.max(0, 1 - Math.abs(local - 0.5) * 2.4);
          o = eased;
          y = (0.5 - local) * 70;
          b = (1 - eased) * 8;
        }
        el.style.opacity = o;
        el.style.transform = `translate(0, calc(-50% + ${y}px))`;
        el.style.filter = `blur(${b}px)`;
      });
    }
  });

  // video görünürken kaynağı zorla yükle
  ScrollTrigger.create({
    trigger: '.scrub', start: 'top bottom', end: 'bottom top',
    onEnter: () => v.load()
  });

  return st;
}

/* ═══════════ 3D MENÜ HALKASI ═══════════ */
function setupRing() {
  const ring = $('#ring');
  if (!ring) return;
  const cards = $$('.card', ring);
  const n = cards.length;
  const step = 360 / n;

  let small = mq.matches;

  function layout() {
    small = mq.matches;
    const cw = small ? Math.min(226, window.innerWidth * 0.58) : Math.min(300, window.innerWidth * 0.21);
    // kart, başlık ve alt notla çakışmasın diye yüksekliği görünür alana da bağlı
    const ch = Math.min(cw * (small ? 1.52 : 1.32), window.innerHeight * (small ? 0.6 : 0.56));
    // dar ekranda yarıçap küçük tutuluyor: öndeki kart ekranı doldursun,
    // iki kart arasındayken ortada boşluk kalmasın
    const radius = (cw / 2) / Math.tan(Math.PI / n) * (small ? 0.95 : 1.28);

    ring.style.setProperty('--cw', cw + 'px');
    ring.style.setProperty('--chh', ch + 'px');
    ring.dataset.radius = radius;

    cards.forEach((c, i) => {
      c.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`;
    });
  }
  layout();
  window.addEventListener('resize', () => { layout(); ScrollTrigger.refresh(); });

  const state = { rot: 0 };
  const applyDepth = () => {
    ring.style.transform = `rotateX(-3deg) rotateY(${state.rot}deg)`;
    cards.forEach((c, i) => {
      // kartın kameraya göre açısı
      let a = ((i * step + state.rot) % 360 + 360) % 360;
      if (a > 180) a -= 360;
      const raw = Math.max(0, Math.cos(a * Math.PI / 180));    // 1 = tam karşı
      // dar ekranda kartlar üst üste bindiği için düşüş daha sert
      const face = small ? Math.pow(raw, 3) : raw;
      c.style.opacity = (0.16 + face * 0.84).toFixed(3);
      c.style.filter = `blur(${((1 - face) * 3.4).toFixed(2)}px) brightness(${(0.45 + face * 0.55).toFixed(2)})`;
      c.style.zIndex = Math.round(face * 100);
    });
  };
  applyDepth();

  gsap.to(state, {
    rot: -360 * (n - 1) / n,
    ease: 'none',
    onUpdate: applyDepth,
    scrollTrigger: {
      trigger: '.menu',
      start: 'top top',
      end: '+=' + (n * (mq.matches ? 48 : 58)) + '%',
      pin: '.menu__stage',
      scrub: reduce ? false : 0.6
    }
  });

  // başlık hafif yukarı kayar
  gsap.fromTo('.menu__head', { y: 30, opacity: 0 }, {
    y: 0, opacity: 1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.menu', start: 'top 65%' }
  });
}

/* ═══════════ RAKAMLAR ═══════════ */
function setupStats() {
  $$('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.dec || '0', 10);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.8, ease: 'power2.out',
      onUpdate: () => {
        el.textContent = dec
          ? obj.v.toFixed(dec).replace('.', ',')
          : Math.round(obj.v).toLocaleString('tr-TR');
      },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
}

/* ═══════════ YATAY GALERİ ═══════════ */
function setupGallery() {
  const track = $('#galTrack');
  if (!track) return;

  const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 40);

  gsap.to(track, {
    x: () => -dist(),
    ease: 'none',
    scrollTrigger: {
      trigger: '.gallery',
      start: 'top top',
      end: () => '+=' + dist(),
      pin: '.gallery__stage',
      scrub: reduce ? false : 0.5,
      invalidateOnRefresh: true
    }
  });
}

/* ═══════════ PARALAKS + GENEL GİRİŞLER ═══════════ */
function setupReveals() {
  $$('[data-parallax] video').forEach(v => {
    const amt = parseFloat(v.parentElement.dataset.parallax) * 100;
    gsap.fromTo(v, { yPercent: -amt / 2 }, {
      yPercent: amt / 2, ease: 'none',
      scrollTrigger: { trigger: v.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  $$('[data-fade]').forEach(el => {
    if (el.closest('.hero')) return;                 // hero kendi zamanlamasında
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
}

/* ═══════════ VİDEO GÜÇ TASARRUFU ═══════════ */
function setupVideoIO() {
  const vids = $$('video:not(#scrubVideo):not(.preload__vid)');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) { v.play().catch(() => {}); }
      else v.pause();
    });
  }, { rootMargin: '200px' });
  vids.forEach(v => io.observe(v));
}

/* ═══════════ BAŞLAT ═══════════ */
$('#year').textContent = new Date().getFullYear();

setupHero();
setupNav();
setupManifesto();
setupScrub();
setupRing();
setupStats();
setupGallery();
setupReveals();
setupVideoIO();
runPreloader();

window.addEventListener('load', () => ScrollTrigger.refresh());
