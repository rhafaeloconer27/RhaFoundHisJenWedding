/**
 * RHAF & JEN — INVITATION ANIMATIONS
 * Handles the opening cover, scratch-to-reveal date, scroll animations,
 * and transition to the wedding SPA. The RSVP submission logic lives elsewhere.
 */
document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector) => document.querySelector(selector);
  const getElements = (targets) => (Array.isArray(targets) ? targets : [targets])
    .flatMap((target) => typeof target === 'string'
      ? [...document.querySelectorAll(target)]
      : target ? [target] : []);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const weddingLoader = $('#weddingLoader');
  const invitationEntryGate = $('#invitationEntryGate');
  const invitationIntro = $('#invitationIntro');
  const openInvitationButton = $('#openInvitationButton');
  const openWeddingPagesButton = $('#openWeddingPagesButton');
  let longScrollInitialized = false;

  gsap.registerPlugin(ScrollTrigger);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  document.body.classList.add('loading-active', 'invitation-gate-active');
  invitationIntro?.setAttribute('aria-hidden', 'true');
  invitationIntro?.setAttribute('inert', '');

  // Prepare the opening message before the envelope becomes visible.
  gsap.set('.intro-message-card', { autoAlpha: 0, y: 70, scale: 0.94 });
  gsap.set('.intro-message-text', { autoAlpha: 0, y: 25 });
  gsap.set(
    ['.intro-message-closing', '.intro-message-signature', '.intro-scroll-lottie'],
    { autoAlpha: 0, y: 20 }
  );

  function refreshScrollTriggers() {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  function unlockInvitation() {
    document.body.classList.remove('loading-active', 'invitation-gate-active');
  }

  function showInvitationEntry() {
    if (!invitationEntryGate) {
      console.error('Invitation entry gate was not found.');
      return;
    }

    window.scrollTo(0, 0);
    gsap.set(invitationEntryGate, { display: 'flex', autoAlpha: 1 });
    gsap.set('.video-invitation-wrap', {
      autoAlpha: 1, x: 0, y: 0, scale: 1, rotation: 0,
    });
  }

  // Preserve the original ring-loader timing and crossfade.
  window.addEventListener('load', () => {
    if (!weddingLoader) {
      document.body.classList.remove('loading-active');
      showInvitationEntry();
      return;
    }

    gsap.timeline({
      delay: 2.5,
      onComplete: () => {
        gsap.set(weddingLoader, { display: 'none' });
        document.body.classList.remove('loading-active');
        showInvitationEntry();
      },
    })
      .to('.wedding-loader-content', {
        autoAlpha: 0, y: -10, scale: 0.97,
        duration: 0.8, ease: 'power2.inOut',
      })
      .to(weddingLoader, {
        autoAlpha: 0, duration: 1.1, ease: 'power2.inOut',
      }, '-=0.65');
  });

  function prepareLongScrollBehindEnvelope() {
    // The content must be ready before the envelope moves away.
    invitationIntro?.removeAttribute('inert');
    invitationIntro?.setAttribute('aria-hidden', 'false');
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    initializeLongScroll();
    refreshScrollTriggers();
  }

  function finishInvitationOpening() {
    if (invitationEntryGate) {
      gsap.set(invitationEntryGate, { display: 'none', autoAlpha: 0 });
    }
    unlockInvitation();
    refreshScrollTriggers();
  }

  // Wax-seal interaction: real user click also unlocks music playback.
  openInvitationButton?.addEventListener('click', () => {
    window.startWeddingMusic?.({ restart: true });
    openInvitationButton.disabled = true;

    const cover = $('#invitationCover');
    prepareLongScrollBehindEnvelope();

    if (!cover) {
      finishInvitationOpening();
      return;
    }

    const rightEnvelope = cover.querySelector('.video-envelope-right');
    const topPaper = cover.querySelector('.video-envelope-top');
    const bottomPaper = cover.querySelector('.video-envelope-bottom');

    if (reducedMotion.matches) {
      gsap.set([rightEnvelope, topPaper, bottomPaper].filter(Boolean), {
        autoAlpha: 0,
      });
      finishInvitationOpening();
      return;
    }

    const timeline = gsap.timeline({ onComplete: finishInvitationOpening });
    timeline
      .to(openInvitationButton, {
        scale: 1.08, duration: 0.18, ease: 'power2.out',
      })
      .to(openInvitationButton, {
        scale: 0.96, duration: 0.16, ease: 'power2.inOut',
      });

    if (rightEnvelope) {
      timeline.to(rightEnvelope, {
        xPercent: 112, yPercent: 5, rotation: 5,
        duration: 1.15, ease: 'power3.inOut',
      });
    }
    if (topPaper) {
      timeline.to(topPaper, {
        xPercent: -105, yPercent: -28, rotation: -7,
        duration: 1.25, ease: 'power3.inOut',
      }, '-=0.92');
    }
    if (bottomPaper) {
      timeline.to(bottomPaper, {
        xPercent: -105, yPercent: 30, rotation: 7,
        duration: 1.25, ease: 'power3.inOut',
      }, '<');
    }
  }, { once: true });

  /** Run a GSAP animation only when both the elements and trigger exist. */
  function fromOnScroll(target, options, triggerOptions = {}) {
    const elements = getElements(target);
    if (!elements.length) return;

    const { trigger = elements[0], start = 'top 82%', ...rest } = triggerOptions;
    const triggerElement = typeof trigger === 'string' ? $(trigger) : trigger;
    if (!triggerElement) return;

    gsap.from(elements, {
      ...options,
      scrollTrigger: { trigger: triggerElement, start, once: true, ...rest },
    });
  }

  function animateOnce(target, animationOptions = {}) {
    const { scrollTrigger = {}, ...animation } = animationOptions;
    fromOnScroll(target, {
      opacity: 0, y: 60, scale: 0.97, duration: 1,
      ease: 'power3.out', clearProps: 'transform', ...animation,
    }, scrollTrigger);
  }

  function initializeLongScroll() {
    if (longScrollInitialized) return;
    longScrollInitialized = true;

    // Scratch interaction must also work for reduced-motion visitors.
    initScratchDate();
    if (reducedMotion.matches) {
      showLongScrollWithoutMotion();
      return;
    }

    initMessageAnimations();
    initScriptureAnimations();
    initScratchAnimations();
    initLocationAnimations();
    initAttireAnimations();
    initGiftAnimations();
    initRsvpAnimations();
  }

  function initMessageAnimations() {
    gsap.timeline()
      .to('.intro-message-card', {
        autoAlpha: 1, y: 0, scale: 1,
        duration: 1.05, ease: 'power3.out', clearProps: 'transform',
      })
      .to('.intro-message-text', {
        autoAlpha: 1, y: 0, duration: 0.7,
        stagger: 0.18, ease: 'power2.out',
      }, '-=0.65')
      .to(['.intro-message-closing', '.intro-message-signature', '.intro-scroll-lottie'], {
        autoAlpha: 1, y: 0, duration: 0.7,
        stagger: 0.15, ease: 'power2.out',
      }, '-=0.25');
  }

  function initScriptureAnimations() {
    animateOnce('.intro-scripture-label', { y: 25, duration: 0.7 });
    animateOnce('.intro-scripture-card', {
      y: 75, scale: 0.94, duration: 1.1,
      scrollTrigger: { trigger: '.intro-scripture-section', start: 'top 78%' },
    });
    fromOnScroll(
      ['.intro-scripture-mark', '.intro-scripture-quote',
        '.intro-scripture-divider', '.intro-scripture-reference'],
      { opacity: 0, y: 25, duration: 0.8, stagger: 0.16, ease: 'power2.out' },
      { trigger: '.intro-scripture-card', start: 'top 70%' }
    );
  }

  function initScratchAnimations() {
    animateOnce('.intro-scratch-label', { y: 25, duration: 0.7 });
    animateOnce('.intro-calendar-icon', { y: 25, duration: 0.7 });
    animateOnce('.scratch-date-circles', {
      y: 60, scale: 0.94, duration: 1.1,
      scrollTrigger: { trigger: '.intro-scratch-section', start: 'top 78%' },
    });
  }

  function initScratchDate() {
    const canvases = document.querySelectorAll('.scratch-circle-canvas');
    if (!canvases.length) return;

    const completedElement = $('#scratchDateComplete');
    const completionLottie = $('#saveTheDateAnimation');
    const revealedIds = new Set();
    const scratchSurfaces = [];
    const brushRadius = 20;

    canvases.forEach((canvas) => {
      const circle = canvas.closest('.scratch-circle');
      const id = canvas.dataset.scratchId;
      const ctx = canvas.getContext('2d');
      if (!circle || !id || !ctx) return;

      const scratchedPoints = [];
      let isDrawing = false;
      let isRevealed = false;
      let gradientShift = 0;
      let scheduledCheck = 0;

      function eraseAt(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      function drawScratchSurface() {
        if (isRevealed) return;
        const { width, height } = circle.getBoundingClientRect();
        if (!width || !height) return;

        ctx.clearRect(0, 0, width, height);
        const shift = gradientShift * width * 0.45;
        const gradient = ctx.createLinearGradient(
          -width * 0.35 + shift, 0, width * 1.25 + shift, height
        );
        [
          [0, '#fafafa'], [0.22, '#eeeeee'], [0.48, '#dddddd'],
          [0.72, '#cccccc'], [1, '#b8b8b8'],
        ].forEach(([stop, color]) => gradient.addColorStop(stop, color));

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Points are normalized so existing scratches survive screen resizing.
        ctx.globalCompositeOperation = 'destination-out';
        scratchedPoints.forEach(({ x, y }) => eraseAt(x * width, y * height));
        ctx.globalCompositeOperation = 'source-over';
      }

      function resizeCanvas() {
        if (isRevealed) return;
        const { width, height } = circle.getBoundingClientRect();
        if (!width || !height) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawScratchSurface();
      }

      function getPoint(event) {
        const rect = canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
      }

      function scratchAt({ x, y }) {
        const { width, height } = canvas.getBoundingClientRect();
        if (!width || !height) return;
        scratchedPoints.push({ x: x / width, y: y / height });
        ctx.globalCompositeOperation = 'destination-out';
        eraseAt(x, y);
        ctx.globalCompositeOperation = 'source-over';
      }

      function checkPercentage() {
        if (isRevealed || !canvas.width || !canvas.height) return;
        const { width, height } = canvas;
        const pixels = ctx.getImageData(0, 0, width, height).data;
        const centerX = width / 2;
        const centerY = height / 2;
        const radiusSq = centerX * centerX;
        const step = Math.max(1, Math.round(8 * (window.devicePixelRatio || 1)));
        let sampled = 0;
        let transparent = 0;

        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            const dx = x - centerX;
            const dy = y - centerY;
            if (dx * dx + dy * dy > radiusSq) continue;
            sampled++;
            if (pixels[(y * width + x) * 4 + 3] < 40) transparent++;
          }
        }

        if (sampled && transparent / sampled >= 0.6) revealCircle();
      }

      // Read back pixels at most once per animation frame (not every pointer event).
      function schedulePercentageCheck() {
        if (scheduledCheck || isRevealed) return;
        scheduledCheck = requestAnimationFrame(() => {
          scheduledCheck = 0;
          checkPercentage();
        });
      }

      function revealCircle() {
        if (isRevealed) return;
        isRevealed = true;
        isDrawing = false;
        revealedIds.add(id);
        if (scheduledCheck) cancelAnimationFrame(scheduledCheck);

        if (reducedMotion.matches) {
          gsap.set(canvas, { opacity: 0 });
          canvas.style.pointerEvents = 'none';
        } else {
          gsap.to(canvas, {
            opacity: 0, scale: 1.08, duration: 0.65, ease: 'power2.out',
            onComplete: () => { canvas.style.pointerEvents = 'none'; },
          });
        }

        const value = circle.querySelector('.scratch-circle-value');
        if (value && !reducedMotion.matches) {
          gsap.from(value, {
            opacity: 0, scale: 0.65, duration: 0.75, ease: 'back.out(1.8)',
          });
        }

        if (revealedIds.size === canvases.length && completedElement) {
          revealCompletedScratchDate(completedElement, completionLottie);
        }
      }

      canvas.addEventListener('pointerdown', (event) => {
        if (isRevealed) return;
        isDrawing = true;
        canvas.setPointerCapture?.(event.pointerId);
        scratchAt(getPoint(event));
      });
      canvas.addEventListener('pointermove', (event) => {
        if (!isDrawing || isRevealed) return;
        scratchAt(getPoint(event));
        schedulePercentageCheck();
      });
      canvas.addEventListener('pointerup', (event) => {
        if (!isDrawing) return;
        isDrawing = false;
        try { canvas.releasePointerCapture?.(event.pointerId); } catch { /* Already released. */ }
        checkPercentage();
      });
      canvas.addEventListener('pointercancel', () => { isDrawing = false; });

      resizeCanvas();
      scratchSurfaces.push({
        resize: resizeCanvas,
        update: (progress) => {
          if (isRevealed) return;
          gradientShift = progress;
          drawScratchSurface();
        },
      });
    });

    // One resize listener and one scroll trigger for all scratch canvases.
    window.addEventListener('resize', () => scratchSurfaces.forEach((s) => s.resize()));
    if (!reducedMotion.matches && scratchSurfaces.length) {
      ScrollTrigger.create({
        trigger: '.intro-scratch-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => scratchSurfaces.forEach((s) => s.update(self.progress)),
      });
    }
  }

  function revealCompletedScratchDate(element, lottie) {
    element.classList.add('is-visible');
    try { lottie?.stop(); lottie?.seek(0); } catch { /* Player may not be ready. */ }

    if (reducedMotion.matches) {
      gsap.set(getElements([
        element, '.scratch-save-date-animation',
        '#scratchDateComplete > span', '#scratchDateComplete > small',
        '#scratchDateComplete .intro-scratch-subtext',
      ]), { opacity: 1, x: 0, y: 0, scale: 1 });
      try { lottie?.play(); } catch { /* Player may not be ready. */ }
      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    timeline.fromTo(element,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7 }
    );
    timeline.fromTo('.scratch-save-date-animation',
      { opacity: 0, y: 18, scale: 0.92 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.25)',
        onStart: () => { try { lottie?.play(); } catch { /* Ignore player errors. */ } },
      }, '-=0.3'
    );

    // Support both the older span and the current paragraph-based layout.
    if ($('#scratchDateComplete > span')) {
      timeline.fromTo('#scratchDateComplete > span',
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.7)' },
        '-=0.35'
      );
    }
    const subtext = $('#scratchDateComplete .intro-scratch-subtext') ||
      $('#scratchDateComplete > small');
    if (subtext) {
      timeline.fromTo(subtext,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.55 }, '-=0.2'
      );
    }
  }

  function initSectionIntro(section) {
    animateOnce(`.intro-${section}-heading`, {
      y: 25, duration: 0.7,
      scrollTrigger: { trigger: `.intro-${section}-section`, start: 'top 82%' },
    });
    animateOnce(`.intro-${section}-card`, {
      y: 70, scale: 0.94, duration: 1.05,
      scrollTrigger: { trigger: `.intro-${section}-section`, start: 'top 76%' },
    });
  }

  function initLocationAnimations() {
    initSectionIntro('location');
    fromOnScroll(
      ['.intro-location-icon', '.intro-location-label', '.intro-location-name',
        '.intro-location-address', '.intro-location-divider'],
      { opacity: 0, y: 18, duration: 0.55, stagger: 0.1, ease: 'power2.out' },
      { trigger: '.intro-location-card', start: 'top 72%' }
    );
    fromOnScroll('.intro-location-detail', {
      opacity: 0, x: -25, duration: 0.55, stagger: 0.12, ease: 'power2.out',
    }, { trigger: '.intro-location-details', start: 'top 82%' });
    fromOnScroll('.intro-location-map', {
      opacity: 0, y: 35, scale: 0.96, duration: 0.8, ease: 'power3.out',
    }, { trigger: '.intro-location-map', start: 'top 85%' });
    fromOnScroll('.intro-location-map-button', {
      opacity: 0, y: 20, scale: 0.96, duration: 0.65, ease: 'back.out(1.4)',
    }, { trigger: '.intro-location-map-button', start: 'top 90%' });
  }

  function initAttireAnimations() {
    initSectionIntro('attire');
    fromOnScroll(
      ['.intro-attire-icon', '.intro-attire-eyebrow',
        '.intro-attire-title', '.intro-attire-description'],
      { opacity: 0, y: 18, duration: 0.55, stagger: 0.1, ease: 'power2.out' },
      { trigger: '.intro-attire-card', start: 'top 72%' }
    );
    fromOnScroll('.intro-attire-guideline', {
      opacity: 0, y: 25, scale: 0.96, duration: 0.55,
      stagger: 0.14, ease: 'power2.out',
    }, { trigger: '.intro-attire-guidelines', start: 'top 84%' });
    fromOnScroll('.intro-attire-color-option', {
      opacity: 0, y: 20, scale: 0.75, duration: 0.45,
      stagger: 0.08, ease: 'back.out(1.5)',
    }, { trigger: '.intro-attire-colors', start: 'top 85%' });
    fromOnScroll('.intro-attire-reminder', {
      opacity: 0, y: 22, scale: 0.97, duration: 0.6, ease: 'power2.out',
    }, { trigger: '.intro-attire-reminder', start: 'top 90%' });
  }

  function initGiftAnimations() {
    initSectionIntro('gift');
    fromOnScroll('.intro-gift-icon', {
      opacity: 0, scale: 0.3, rotation: -25,
      duration: 0.65, ease: 'back.out(1.8)',
    }, { trigger: '.intro-gift-card', start: 'top 72%' });
    fromOnScroll(['.intro-gift-label', '.intro-gift-title'], {
      opacity: 0, y: 20, duration: 0.55, stagger: 0.12, ease: 'power2.out',
    }, { trigger: '.intro-gift-card', start: 'top 72%' });
    fromOnScroll('.intro-gift-message p', {
      opacity: 0, y: 22, duration: 0.6, stagger: 0.15, ease: 'power2.out',
    }, { trigger: '.intro-gift-message', start: 'top 84%' });
    fromOnScroll('.intro-gift-divider', {
      opacity: 0, scaleX: 0, transformOrigin: 'center',
      duration: 0.7, ease: 'power3.out',
    }, { trigger: '.intro-gift-divider', start: 'top 88%' });
    fromOnScroll(
      ['.intro-gift-thank-you', '.intro-gift-signature', '.intro-message-signature-name'],
      { opacity: 0, y: 18, duration: 0.55, stagger: 0.15, ease: 'power2.out' },
      { trigger: '.intro-gift-thank-you', start: 'top 88%' }
    );
    animateOnce('.intro-gift-reminder', {
      y: 40, scale: 0.96, duration: 0.8,
      scrollTrigger: { trigger: '.intro-gift-reminder', start: 'top 90%' },
    });
  }

  function initRsvpAnimations() {
    animateOnce('.intro-rsvp-header', {
      y: 35, duration: 0.8,
      scrollTrigger: { trigger: '.intro-rsvp-section', start: 'top 80%' },
    });
    animateOnce('.intro-rsvp-search-card', {
      y: 55, scale: 0.96, duration: 0.9,
      scrollTrigger: { trigger: '.intro-rsvp-search-card', start: 'top 88%' },
    });
  }

  function showLongScrollWithoutMotion() {
    const elements = getElements([
      '.intro-message-label', '.intro-message-card', '.intro-message-text',
      '.intro-message-closing', '.intro-message-signature', '.intro-scroll-lottie',
      '.intro-scripture-label', '.intro-scripture-card', '.intro-scripture-mark',
      '.intro-scripture-quote', '.intro-scripture-divider', '.intro-scripture-reference',
      '.intro-scratch-label', '.intro-calendar-icon', '.scratch-date-circles',
      '.intro-location-heading', '.intro-location-card', '.intro-location-icon',
      '.intro-location-label', '.intro-location-name', '.intro-location-address',
      '.intro-location-divider', '.intro-location-detail', '.intro-location-map',
      '.intro-location-map-button', '.intro-attire-heading', '.intro-attire-card',
      '.intro-attire-icon', '.intro-attire-eyebrow', '.intro-attire-title',
      '.intro-attire-description', '.intro-attire-guideline',
      '.intro-attire-color-option', '.intro-attire-reminder',
      '.intro-gift-heading', '.intro-gift-card', '.intro-gift-icon',
      '.intro-gift-label', '.intro-gift-title', '.intro-gift-message p',
      '.intro-gift-divider', '.intro-gift-thank-you', '.intro-gift-signature',
      '.intro-message-signature-name', '.intro-gift-reminder',
      '.intro-rsvp-header', '.intro-rsvp-search-card',
    ]);
    if (elements.length) {
      gsap.set(elements, { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0, rotationX: 0 });
    }
  }

  // Ask guests to confirm their RSVP before opening the wedding SPA.
  const rsvpReminder = $('#weddingRsvpReminder');
  const rsvpYesButton = $('#weddingRsvpYesButton');
  const rsvpNoButton = $('#weddingRsvpNoButton');
  const rsvpReminderError = $('#weddingRsvpReminderError');
  const rsvpSection = $('#introRsvpSection');
  const rsvpSearchInput = $('#introRsvpSearch');
  let rsvpFocusTimer = null;

  function setRsvpReminderVisible(visible, restoreFocus = false) {
    if (!rsvpReminder) return;
    rsvpReminder.hidden = !visible;
    openWeddingPagesButton?.setAttribute('aria-expanded', String(visible));
    if (visible) {
      if (rsvpReminderError) {
        rsvpReminderError.hidden = true;
        rsvpReminderError.textContent = '';
      }
      rsvpYesButton?.focus();
    } else if (restoreFocus) {
      openWeddingPagesButton?.focus();
    }
  }

  openWeddingPagesButton?.addEventListener('click', () => {
    if (openWeddingPagesButton.disabled || !rsvpReminder) return;
    setRsvpReminderVisible(rsvpReminder.hidden);
  });

  rsvpYesButton?.addEventListener('click', async () => {
    if (openWeddingPagesButton.disabled) return;
    // setRsvpReminderVisible(false);
    openWeddingPagesButton.disabled = true;
    try {
      if (typeof window.startWeddingSpa !== 'function') {
        throw new Error('Wedding SPA router is unavailable.');
      }
      const result = await window.startWeddingSpa('home');
      if (result === false) throw new Error('Unable to load Wedding Home.');
    } catch (error) {
      console.error('Unable to open Wedding Home:', error);
      setRsvpReminderVisible(true);
      if (rsvpReminderError) {
        rsvpReminderError.textContent = 'Unable to open the wedding pages. Please try again.';
        rsvpReminderError.hidden = false;
      }
    } finally {
      openWeddingPagesButton.disabled = false;
    }
  });

  rsvpNoButton?.addEventListener('click', () => {
    setRsvpReminderVisible(false);
    if (!rsvpSection) return;

    // The existing RSVP guest-search form stays unchanged.
    rsvpSection.scrollIntoView({
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
      block: 'start',
    });
    window.clearTimeout(rsvpFocusTimer);
    rsvpFocusTimer = window.setTimeout(() => {
      rsvpSearchInput?.focus({ preventScroll: true });
      rsvpFocusTimer = null;
    }, reducedMotion.matches ? 0 : 550);
  });

  // A non-modal dialog should close when the visitor clicks elsewhere.
  document.addEventListener('pointerdown', (event) => {
    if (!rsvpReminder || rsvpReminder.hidden) return;
    if (rsvpReminder.contains(event.target) || openWeddingPagesButton?.contains(event.target)) return;
    setRsvpReminderVisible(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !rsvpReminder || rsvpReminder.hidden) return;
    event.preventDefault();
    setRsvpReminderVisible(false, true);
  });

  // Browser Back / BFCache: restore the continue button and invitation sections.
  window.addEventListener('pageshow', () => {
    setRsvpReminderVisible(false);
    window.clearTimeout(rsvpFocusTimer);
    if (openWeddingPagesButton) {
      openWeddingPagesButton.disabled = false;
      gsap.set(openWeddingPagesButton, { clearProps: 'transform' });
    }
    gsap.set(['.intro-rsvp-section', '.intro-wedding-pages-section'], {
      autoAlpha: 1, y: 0, scale: 1,
      clearProps: 'opacity,visibility,transform',
    });
  });
});
