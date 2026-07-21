document.addEventListener('DOMContentLoaded', () => {
  const weddingLoader = document.getElementById('weddingLoader');
  const invitationIntro = document.getElementById('invitationIntro');
  const openInvitationButton = document.getElementById(
    'openInvitationButton'
  );

  gsap.registerPlugin(ScrollTrigger);

  document.body.classList.add('loading-active');

  /*
   * Initial loading screen
   */
  window.addEventListener('load', () => {
    const loaderTimeline = gsap.timeline({
      onComplete: () => {
        weddingLoader?.classList.add('loader-hidden');
        document.body.classList.remove('loading-active');

        /*
         * Refresh after loader disappears so ScrollTrigger
         * can calculate the correct element positions.
         */
        ScrollTrigger.refresh();
      },
    });

    loaderTimeline
      .to('.wedding-loader-content', {
        opacity: 0,
        y: -15,
        duration: 0.5,
        ease: 'power2.in',
        delay: 0.6,
      })
      .to(
        weddingLoader,
        {
          opacity: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
          duration: 0.7,
          ease: 'power2.out',
        },
        '-=0.1'
      );
  });

  /*
   * Helper function:
   * Animates an element only once when it enters the viewport.
   */
  function animateOnce(element, animationOptions = {}) {
    if (!element) {
      return;
    }

    gsap.from(element, {
      opacity: 0,
      y: 60,
      scale: 0.97,
      duration: 1,
      ease: 'power3.out',
      clearProps: 'transform',
      ...animationOptions,

      scrollTrigger: {
        trigger: element,
        start: 'top 82%',
        once: true,
        ...animationOptions.scrollTrigger,
      },
    });
  }

  /*
   * Message section
   */
  animateOnce('.intro-message-label', {
    y: 25,
    duration: 0.7,
  });

  animateOnce('.intro-message-card', {
    y: 70,
    scale: 0.94,
    duration: 1.1,
    scrollTrigger: {
      trigger: '.intro-message-section',
      start: 'top 75%',
      once: true,
    },
  });

  gsap.from('.intro-message-text', {
    opacity: 0,
    y: 25,
    duration: 0.7,
    stagger: 0.18,
    ease: 'power2.out',

    scrollTrigger: {
      trigger: '.intro-message-card',
      start: 'top 70%',
      once: true,
    },
  });

  gsap.from(
    [
      '.intro-message-closing',
      '.intro-message-signature',
      '.intro-scroll-note',
    ],
    {
      opacity: 0,
      y: 20,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',

      scrollTrigger: {
        trigger: '.intro-message-card',
        start: 'center 75%',
        once: true,
      },
    }
  );

  /*
   * Scripture section
   */
  animateOnce('.intro-scripture-label', {
    y: 25,
    duration: 0.7,
  });

  animateOnce('.intro-scripture-card', {
    y: 75,
    scale: 0.94,
    duration: 1.1,
    scrollTrigger: {
      trigger: '.intro-scripture-section',
      start: 'top 78%',
      once: true,
    },
  });

  gsap.from(
    [
      '.intro-scripture-mark',
      '.intro-scripture-quote',
      '.intro-scripture-divider',
      '.intro-scripture-reference',
    ],
    {
      opacity: 0,
      y: 25,
      duration: 0.8,
      stagger: 0.16,
      ease: 'power2.out',

      scrollTrigger: {
        trigger: '.intro-scripture-card',
        start: 'top 70%',
        once: true,
      },
    }
  );

  /*
   * Invitation cover section
   */
  animateOnce('.intro-cover-section .intro-label', {
    y: 25,
    duration: 0.7,
  });

  animateOnce('.invitation-cover', {
    y: 90,
    scale: 0.9,
    rotationX: 8,
    transformOrigin: 'center bottom',
    duration: 1.2,
    ease: 'power3.out',

    scrollTrigger: {
      trigger: '.intro-cover-section',
      start: 'top 75%',
      once: true,
    },
  });

  animateOnce('.intro-open-note', {
    y: 20,
    duration: 0.7,

    scrollTrigger: {
      trigger: '.invitation-cover',
      start: 'center 70%',
      once: true,
    },
  });

  /*
   * Open invitation animation
   */
  /*
 * Open invitation animation
 */
if (openInvitationButton) {
  openInvitationButton.addEventListener(
    'click',
    () => {
      openInvitationButton.disabled = true;

      /*
       * Stop the CSS floating animation before GSAP
       * controls the seal transform.
       */
      gsap.set(openInvitationButton, {
        animation: 'none',
      });

      const openTimeline = gsap.timeline({
        onComplete: () => {
          window.location.href = 'wedding.html?page=home';
        },
      });

      openTimeline
        .to(openInvitationButton, {
          scale: 1.15,
          rotation: -8,
          duration: 0.25,
          ease: 'power2.out',
        })
        .to(openInvitationButton, {
          scale: 0,
          rotation: 25,
          opacity: 0,
          duration: 0.45,
          ease: 'back.in(1.8)',
        })
        .to(
          '.cover-title',
          {
            opacity: 0,
            y: -25,
            duration: 0.45,
            ease: 'power2.in',
          },
          '-=0.35'
        )
        .to(
          '.cover-panel-left',
          {
            xPercent: -105,
            rotationY: -12,
            duration: 1.2,
            ease: 'power3.inOut',
          },
          '-=0.05'
        )
        .to(
          '.cover-panel-right',
          {
            xPercent: 105,
            rotationY: 12,
            duration: 1.2,
            ease: 'power3.inOut',
          },
          '<'
        )
        .from(
          '.reveal-small',
          {
            opacity: 0,
            y: 15,
            duration: 0.5,
          },
          '-=0.55'
        )
        .from(
          '.reveal-content h1',
          {
            opacity: 0,
            y: 30,
            scale: 0.9,
            duration: 0.8,
            ease: 'back.out(1.4)',
          },
          '-=0.3'
        )
        .from(
          [
            '.reveal-invites',
            '.reveal-date',
            '.reveal-content .reveal-divider',
          ],
          {
            opacity: 0,
            y: 15,
            duration: 0.55,
            stagger: 0.12,
            ease: 'power2.out',
          },
          '-=0.35'
        )
        .to({}, {
          duration: 1,
        });
    },
    {
      once: true,
    }
  );
}

  /*
   * Disable animations for users who prefer reduced motion.
   */
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  if (reducedMotion.matches) {
    ScrollTrigger.getAll().forEach((trigger) => {
      trigger.kill();
    });

    gsap.set(
      [
        '.intro-message-label',
        '.intro-message-card',
        '.intro-message-text',
        '.intro-message-closing',
        '.intro-message-signature',
        '.intro-scroll-note',
        '.intro-scripture-label',
        '.intro-scripture-card',
        '.intro-scripture-mark',
        '.intro-scripture-quote',
        '.intro-scripture-divider',
        '.intro-scripture-reference',
        '.intro-cover-section .intro-label',
        '.invitation-cover',
        '.intro-open-note',
      ],
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        rotationX: 0,
      }
    );
  }
});