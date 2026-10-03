/**
 * EstateVision 3D — Bespoke Motion Engine
 *
 * Design principles applied:
 * ─ Spring physics with velocity tracking (not fixed linear easing)
 * ─ Magnetic hover on nav elements (emilkowalski/skills pattern)
 * ─ Clip-path reveals instead of generic y+opacity (anti-slop)
 * ─ Deliberate timing offsets — no uniform stagger
 * ─ Reduced motion respects prefers-reduced-motion
 * ─ Ambient glow: three-point tracking with thermal drift
 */

const AnimationEngine = (function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    if (!prefersReducedMotion) {
      setupHeroEntrance();
      setup3DScrollPinning();
      setupSectionReveals();
      setupSpringCardTilt();
      setupMagneticNavHover();
      setupAmbientGlowFollower();
    }

    setupMetricCounters();
    setupHeaderScrollState();
  }

  /* ── Hero Entrance — staggered with deliberate non-uniform offsets ─────── */
  function setupHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // Nav drops in sharp — fastest element
    tl.from('.site-header', { y: -60, opacity: 0, duration: 0.7, delay: 0.05 })

    // Hero tag: clip from left → right, not generic opacity+y
    .from('.hero-narrative .section-tag, .hero-narrative .badge-pill', {
      clipPath: 'inset(0 100% 0 0)',
      opacity: 0,
      duration: 0.55,
      ease: 'expo.out'
    }, '-=0.3')

    // Title: character-level reveal via clip — premium pattern
    .from('.hero-title', {
      clipPath: 'inset(0 0 100% 0)',
      y: 16,
      opacity: 0,
      duration: 0.72,
      ease: 'expo.out'
    }, '-=0.35')

    .from('.hero-description', {
      opacity: 0,
      y: 14,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.42')

    .from('.hero-cta-group', {
      opacity: 0,
      y: 12,
      duration: 0.55,
      ease: 'power3.out'
    }, '-=0.45')

    .from('.hero-metrics-strip', {
      opacity: 0,
      y: 18,
      duration: 0.65,
      ease: 'power3.out'
    }, '-=0.48')

    // Viewport: scale from slightly smaller + slight rotation
    .from('.viewport-frame', {
      opacity: 0,
      scale: 0.92,
      rotate: -1.2,
      duration: 1.1,
      ease: 'expo.out'
    }, '-=0.95');
  }

  /* ── Metric Counters ────────────────────────────────────────────────────── */
  function setupMetricCounters() {
    const metricNumbers = document.querySelectorAll('.metric-number');
    metricNumbers.forEach(el => {
      const targetStr = el.textContent.trim();
      if (targetStr.includes('$1.4B+')) {
        animateValue(el, 0, 1.4, 1800, v => `$${v.toFixed(1)}B+`);
      } else if (targetStr.includes('100%')) {
        animateValue(el, 0, 100, 1600, v => `${Math.round(v)}%`);
      } else if (targetStr.includes('60 FPS')) {
        animateValue(el, 0, 60, 1400, v => `${Math.round(v)} FPS`);
      }
    });
  }

  function animateValue(obj, start, end, duration, formatter) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4); // ease-out-quart
      obj.textContent = formatter(start + (end - start) * easeProgress);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ── 3D Scroll Sync ─────────────────────────────────────────────────────── */
  function setup3DScrollPinning() {
    if (typeof ScrollTrigger === 'undefined') return;
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: '+=110%',
      scrub: 1.2,
      onUpdate: (self) => {
        if (window.ThreeScene && window.ThreeScene.getModelGroup) {
          const g = window.ThreeScene.getModelGroup();
          if (g) {
            g.rotation.y = self.progress * Math.PI * 1.2;
            g.position.y = -self.progress * 0.35;
          }
        }
      }
    });
  }

  /* ── Section Reveals — clip-path based, not uniform y+opacity ──────────── */
  function setupSectionReveals() {
    if (typeof ScrollTrigger === 'undefined') return;

    // Architecture cards: each enters with different clip direction
    const specCards = document.querySelectorAll('.spec-card');
    specCards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 82%' },
        clipPath: 'inset(30% 0 0 0)',
        opacity: 0,
        y: 24,
        duration: 0.75,
        // Non-uniform stagger: 0, 80ms, 140ms — not even 0.18s each
        delay: [0, 0.08, 0.14][i] || 0.14,
        ease: 'expo.out'
      });
    });

    // Calculator: slides in from slightly below
    gsap.from('.calculator-card', {
      scrollTrigger: { trigger: '.calculator-section', start: 'top 72%' },
      y: 50,
      opacity: 0,
      duration: 1.0,
      ease: 'expo.out'
    });

    // Contact card: clip from bottom
    gsap.from('.contact-card', {
      scrollTrigger: { trigger: '.contact-section', start: 'top 75%' },
      clipPath: 'inset(0 0 30% 0)',
      opacity: 0,
      y: 30,
      duration: 0.85,
      ease: 'expo.out'
    });
  }

  /* ── Spring Card Tilt — velocity-tracked, not fixed 7deg ───────────────── */
  function setupSpringCardTilt() {
    const containers = [
      document.getElementById('propertiesGrid'),
      document.querySelector('.specs-grid')
    ];

    containers.forEach(container => {
      if (!container) return;

      // Per-card state for spring simulation
      const cardStates = new WeakMap();

      container.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.property-card, .spec-card');
        if (!card) return;

        if (!cardStates.has(card)) {
          cardStates.set(card, { vx: 0, vy: 0, px: 0, py: 0 });
        }

        const rect = card.getBoundingClientRect();
        const nx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
        const ny = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);

        const state = cardStates.get(card);
        // Track velocity for spring overshoot
        state.vx += (nx - state.px) * 0.35;
        state.vy += (ny - state.py) * 0.35;
        state.vx *= 0.72; // damping
        state.vy *= 0.72;
        state.px = nx + state.vx;
        state.py = ny + state.vy;

        // Max tilt is 9deg on spec-cards, 6deg on property cards
        const maxTilt = card.classList.contains('spec-card') ? 9 : 6;
        const tiltX = -(state.py * maxTilt).toFixed(2);
        const tiltY =  (state.px * maxTilt).toFixed(2);

        card.style.transform = `perspective(1100px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(12px)`;
      });

      container.addEventListener('mouseleave', (e) => {
        const card = e.target.closest('.property-card, .spec-card');
        if (card) {
          // Spring back with ease
          card.style.transition = 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)';
          card.style.transform = '';
          setTimeout(() => { card.style.transition = ''; }, 600);
        }
      }, true);
    });
  }

  /* ── Magnetic Hover on Nav Links & Buttons ───────────────────────────────── */
  function setupMagneticNavHover(container = document) {
    if (prefersReducedMotion) return;
    const targets = container.querySelectorAll('.nav-link, .btn-primary, .btn-secondary');

    targets.forEach(el => {
      if (el.dataset.magneticActive) return;
      el.dataset.magneticActive = 'true';

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) * 0.28;
        const dy = (e.clientY - cy) * 0.28;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.48s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.transform = '';
        setTimeout(() => { el.style.transition = ''; }, 500);
      });
    });
  }

  /* ── Ambient Glow Follower — three-point thermal tracking ──────────────── */
  function setupAmbientGlowFollower() {
    const mesh = document.getElementById('ambientGlowMesh');
    if (!mesh) return;

    let tx = 50, ty = 50, cx = 50, cy = 50;
    let isTicking = false;
    // Thermal drift: second point drifts opposite + offset
    let driftPhase = 0;

    window.addEventListener('mousemove', (e) => {
      tx = (e.clientX / window.innerWidth)  * 100;
      ty = (e.clientY / window.innerHeight) * 100;
      if (!isTicking) { isTicking = true; requestAnimationFrame(tick); }
    }, { passive: true });

    function tick() {
      // Lerp with different speeds for warm vs cool gradient
      cx += (tx - cx) * 0.055;
      cy += (ty - cy) * 0.055;
      driftPhase += 0.008;

      // Third point: slow drift — not linked to cursor
      const wx = 50 + Math.sin(driftPhase) * 25;
      const wy = 50 + Math.cos(driftPhase * 0.7) * 20;

      mesh.style.background = `
        radial-gradient(ellipse 55% 40% at ${cx.toFixed(1)}% ${cy.toFixed(1)}%,
          rgba(212, 169, 22, 0.055) 0%, transparent 60%),
        radial-gradient(ellipse 42% 32% at ${(100 - cx * 0.7).toFixed(1)}% ${(100 - cy * 0.7).toFixed(1)}%,
          rgba(0, 238, 255, 0.035) 0%, transparent 55%),
        radial-gradient(ellipse 30% 25% at ${wx.toFixed(1)}% ${wy.toFixed(1)}%,
          rgba(212, 169, 22, 0.025) 0%, transparent 50%)
      `;

      if (Math.abs(tx - cx) > 0.08 || Math.abs(ty - cy) > 0.08) {
        requestAnimationFrame(tick);
      } else {
        isTicking = false;
      }
    }
  }

  /* ── Header Scroll State ────────────────────────────────────────────────── */
  function setupHeaderScrollState() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  return { init, setupMagneticNavHover };
})();

window.AnimationEngine = AnimationEngine;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AnimationEngine.init());
} else {
  AnimationEngine.init();
}

