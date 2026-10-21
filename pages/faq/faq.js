/* FAQ Page — Lottie hero and GSAP scroll animations; SPA compatible. */
(() => {
  let page = null;
  let context = null;
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setupAnimations(root) {
    if (!window.gsap || !window.ScrollTrigger) {
      console.warn('FAQ: GSAP or ScrollTrigger is not loaded.');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    context = gsap.context(() => {
      if (reducedMotion()) return;
      const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTimeline
        .from('.faq-hero-lottie-circle', { autoAlpha: 0, y: 65, scale: .88, duration: 1.1 })
        .from('.faq-page-header p', { autoAlpha: 0, y: 25, duration: .65 }, '-=.5')
        .from('.faq-page-header h1', { autoAlpha: 0, y: 38, scale: .94, duration: .85 }, '-=.4');

      const introCard = root.querySelector('.faq-intro-card');
      if (introCard) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: introCard, start: 'top 85%', once: true } });
        tl.from(introCard, { autoAlpha: 0, y: 65, scale: .96, duration: .9, ease: 'power3.out' });
        const icon = introCard.querySelector('.faq-icon');
        if (icon) tl.from(icon, { autoAlpha: 0, scale: .3, rotation: -25, duration: .65, ease: 'back.out(1.8)' }, '-=.55');
        tl.from(introCard.querySelectorAll('.faq-label, .faq-title, .faq-description'), {
          autoAlpha: 0, y: 20, duration: .55, stagger: .12, ease: 'power2.out'
        }, '-=.4');
      }

      root.querySelectorAll('.faq-card').forEach((card, index) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 86%', once: true } });
        tl.from(card, { autoAlpha: 0, y: 55, x: index % 2 ? 18 : -18, scale: .97, duration: .75, ease: 'power3.out' });
        const icon = card.querySelector('.faq-card-icon');
        const title = card.querySelector('.faq-card-content h3');
        const body = card.querySelectorAll('.faq-card-content > p, .faq-address, .faq-color-list, .faq-reminder-list');
        if (icon) tl.from(icon, { autoAlpha: 0, scale: .35, rotation: index % 2 ? 20 : -20, duration: .55, ease: 'back.out(1.7)' }, '-=.42');
        if (title) tl.from(title, { autoAlpha: 0, y: 14, duration: .45, ease: 'power2.out' }, '-=.32');
        if (body.length) tl.from(body, { autoAlpha: 0, y: 14, duration: .48, stagger: .09, ease: 'power2.out' }, '-=.28');
        const colors = card.querySelectorAll('.faq-color-list span');
        if (colors.length) tl.from(colors, { autoAlpha: 0, y: 10, scale: .75, duration: .38, stagger: .07, ease: 'back.out(1.5)' }, '-=.2');
        const reminders = card.querySelectorAll('.faq-reminder-list li');
        if (reminders.length) tl.from(reminders, { autoAlpha: 0, x: -18, duration: .4, stagger: .1, ease: 'power2.out' }, '-=.25');
      });

      const note = root.querySelector('.faq-note-card');
      if (note) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: note, start: 'top 88%', once: true } });
        tl.from(note, { autoAlpha: 0, y: 45, scale: .97, duration: .7, ease: 'power3.out' });
        const icon = note.querySelector('i');
        const message = note.querySelector('p');
        if (icon) tl.from(icon, { autoAlpha: 0, scale: .3, rotation: -20, duration: .5, ease: 'back.out(1.7)' }, '-=.4');
        if (message) tl.from(message, { autoAlpha: 0, y: 12, duration: .45, ease: 'power2.out' }, '-=.25');
      }
      const introIcon = root.querySelector('.faq-intro-card .faq-icon');
      if (introIcon) gsap.to(introIcon, { y: -5, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, root);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (root.isConnected) ScrollTrigger.refresh();
    }));
  }

  function setupLottie(root) {
    const player = root.querySelector('#faqLottie');
    if (!player) return;
    const start = () => {
      if (page !== root || !root.isConnected) return;
      if (reducedMotion()) player.stop?.(); else player.play?.();
    };
    if (customElements.get('lottie-player')) start();
    else customElements.whenDefined('lottie-player').then(start);
  }

  window.initializeFaqPage = function () {
    const root = document.querySelector('.faq-page');
    if (!root) return;
    if (page === root) {
      if (!context && window.gsap && window.ScrollTrigger) setupAnimations(root);
      return;
    }
    if (page) window.cleanupFaqPage();
    page = root;
    setupAnimations(root);
    setupLottie(root);
  };

  window.cleanupFaqPage = function () {
    page?.querySelector('#faqLottie')?.stop?.();
    context?.revert();
    context = null;
    page = null;
  };
})();
