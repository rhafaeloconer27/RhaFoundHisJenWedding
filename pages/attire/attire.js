/* Attire page animations — SPA safe */
window.initializeAttirePage = function () {
  const page = document.querySelector('.attire-page');
  if (!page || page.dataset.gsapInitialized === 'true') return;
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  window.attireGsapContext?.revert();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.attireGsapContext = gsap.context(() => {
    if (reducedMotion) return;

    const reveal = (element, from, trigger = element) => {
      if (!element) return;
      gsap.from(element, {
        ...from,
        scrollTrigger: { trigger, start: 'top 85%', once: true }
      });
    };

    // Poster and page title.
    const hero = gsap.timeline({ defaults: { ease: 'power3.out' } });
    hero.from('.attire-hero-image', { autoAlpha: 0, y: 65, scale: 0.88, duration: 1.1 })
      .from('.attire-page-header p', { autoAlpha: 0, y: 25, duration: 0.65 }, '-=0.5')
      .from('.attire-page-header h1', { autoAlpha: 0, y: 38, scale: 0.94, duration: 0.85 }, '-=0.4');

    // Color story and palette.
    const intro = page.querySelector('.attire-intro-card');
    if (intro) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: intro, start: 'top 84%', once: true } });
      tl.from(intro, { autoAlpha: 0, y: 70, scale: 0.96, duration: 0.9, ease: 'power3.out' })
        .from(intro.querySelector('.attire-card-icon'), { autoAlpha: 0, scale: 0.35, rotation: -25, duration: 0.65, ease: 'back.out(1.8)' }, '-=0.55')
        .from(intro.querySelectorAll('.attire-eyebrow, h2, .attire-intro-text'), { autoAlpha: 0, y: 20, stagger: 0.12, duration: 0.55 }, '-=0.4')
        .from(intro.querySelectorAll('.attire-palette .guest-color-option'), { autoAlpha: 0, y: 20, scale: 0.75, stagger: 0.1, duration: 0.55, ease: 'back.out(1.5)' }, '-=0.2');
    }

    // Guest information and entourage heading cards.
    page.querySelectorAll('.attire-category-card').forEach(card => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 84%', once: true } });
      tl.from(card, { autoAlpha: 0, y: 70, scale: 0.96, duration: 0.9, ease: 'power3.out' });
      const icon = card.querySelector('.attire-card-icon');
      if (icon) tl.from(icon, { autoAlpha: 0, scale: 0.35, rotation: -25, duration: 0.65, ease: 'back.out(1.8)' }, '-=0.55');
      const headings = card.querySelectorAll('.attire-eyebrow, h2, .attire-category-header > p, .guest-attire-description');
      if (headings.length) tl.from(headings, { autoAlpha: 0, y: 20, duration: 0.55, stagger: 0.12 }, '-=0.4');
      const guidelines = card.querySelectorAll('.guest-attire-item');
      if (guidelines.length) tl.from(guidelines, { autoAlpha: 0, y: 20, duration: 0.55, stagger: 0.14 }, '-=0.2');
      const reminder = card.querySelector('.attire-reminder');
      if (reminder) tl.from(reminder, { autoAlpha: 0, y: 24, duration: 0.55 }, '-=0.15');
    });

    // Guest fashion image.
    reveal(page.querySelector('.attire-guest-showcase-image'), {
      y: 45, scale: 1.04, duration: 1.1, ease: 'power3.out'
    });

    // Entourage description cards, then their separate images.
    page.querySelectorAll('.entourage-group').forEach((group, index) => {
      reveal(group.querySelector('.entourage-description-card'), {
        autoAlpha: 0, y: 30, duration: 0.75, ease: 'power3.out'
      });
      reveal(group.querySelector('.entourage-image-showcase img'), {
        autoAlpha: 0,
        y: 45,
        scale: 0.96,
        duration: 1.2,
        ease: 'power3.out'
      });
    });

    // Continuous gentle palette float.
    const swatches = page.querySelectorAll('.guest-swatch');
    if (swatches.length) gsap.to(swatches, {
      y: -4, duration: 1.4, stagger: 0.12, repeat: -1,
      yoyo: true, ease: 'sine.inOut', delay: 1.5
    });
  }, page);

  page.dataset.gsapInitialized = 'true';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (page.isConnected) ScrollTrigger.refresh();
  }));
};

window.cleanupAttirePage = function () {
  window.attireGsapContext?.revert();
  window.attireGsapContext = null;
  const page = document.querySelector('.attire-page');
  if (page) delete page.dataset.gsapInitialized;
};
