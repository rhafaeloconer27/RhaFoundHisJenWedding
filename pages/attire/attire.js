
/* ==========================================================
   ATTIRE PAGE — GSAP ANIMATIONS
   SPA COMPATIBLE
========================================================== */

window.initializeAttirePage = function () {
  const page = document.querySelector(".attire-page");

  if (!page || page.dataset.gsapInitialized === "true") return;

  if (!window.gsap || !window.ScrollTrigger) {
    console.warn("GSAP or ScrollTrigger is not loaded.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  window.attireGsapContext?.revert();

  window.attireGsapContext = gsap.context(() => {
    if (reduceMotion) return;

    // Shared animation configurations.
    const fadeUp = {
      opacity: 0,
      y: 20,
      duration: 0.55,
      ease: "power2.out"
    };

    const cardReveal = {
      opacity: 0,
      y: 70,
      scale: 0.96,
      duration: 0.9,
      ease: "power3.out"
    };

    const iconReveal = {
      opacity: 0,
      scale: 0.35,
      rotation: -25,
      duration: 0.65,
      ease: "back.out(1.8)"
    };

    // Animate only when matching elements exist.
    const animate = (timeline, container, selector, vars, position) => {
      const elements = container.querySelectorAll(selector);

      if (elements.length) {
        timeline.from(elements, vars, position);
      }

      return timeline;
    };

    /* ======================================================
       HERO
    ====================================================== */

    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".attire-hero .page-hero-overlay", {
        opacity: 0,
        duration: 0.8
      })
      .from(".attire-hero .page-hero-content p", {
        opacity: 0,
        y: 22,
        duration: 0.6
      }, "-=0.4")
      .from(".attire-hero .page-hero-content h1", {
        opacity: 0,
        y: 38,
        scale: 0.94,
        duration: 0.85
      }, "-=0.35");

    /* ======================================================
       HERO PARALLAX
    ====================================================== */

    gsap.to(".attire-hero", {
      backgroundPosition: "center 52%",
      ease: "none",
      scrollTrigger: {
        trigger: ".attire-hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    /* ======================================================
       INTRO CARD
    ====================================================== */

    const intro = page.querySelector(".attire-intro-card");

    if (intro) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: intro,
          start: "top 84%",
          once: true
        }
      });

      tl.from(intro, cardReveal);

      animate(tl, intro, ".attire-card-icon", iconReveal, "-=0.55");

      animate(
        tl,
        intro,
        ".attire-eyebrow, h2, .attire-intro-text",
        { ...fadeUp, stagger: 0.12 },
        "-=0.4"
      );

      animate(
        tl,
        intro,
        ".attire-palette",
        {
          opacity: 0,
          scaleX: 0,
          transformOrigin: "center",
          duration: 0.7,
          ease: "power3.out"
        },
        "-=0.2"
      );

      animate(
        tl,
        intro,
        ".attire-color",
        {
          opacity: 0,
          scaleY: 0,
          transformOrigin: "bottom",
          duration: 0.45,
          stagger: 0.08,
          ease: "power2.out"
        },
        "-=0.4"
      );

      animate(
        tl,
        intro,
        ".attire-palette-note",
        { ...fadeUp, y: 12, duration: 0.45 },
        "-=0.2"
      );
    }

    /* ======================================================
       CATEGORY CARDS
    ====================================================== */

    page.querySelectorAll(".attire-category-card").forEach((card, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 84%",
          once: true
        }
      });

      tl.from(card, cardReveal);

      animate(tl, card, ".attire-card-icon", iconReveal, "-=0.55");

      animate(
        tl,
        card,
        [
          ".attire-category-header .attire-eyebrow",
          ".attire-category-header h2",
          ".attire-category-header > p",
          ".guest-attire-card > .attire-eyebrow",
          ".guest-attire-card > h2",
          ".guest-attire-description"
        ].join(", "),
        { ...fadeUp, stagger: 0.12 },
        "-=0.4"
      );

      // Outfit cards.
      animate(
        tl,
        card,
        ".attire-outfit-card",
        {
          opacity: 0,
          y: 35,
          scale: 0.95,
          duration: 0.7,
          stagger: 0.16,
          ease: "power3.out"
        },
        "-=0.25"
      );

      // Outfit images.
      animate(
        tl,
        card,
        ".attire-image-frame img",
        {
          opacity: 0,
          y: 25,
          scale: 0.92,
          duration: 0.65,
          stagger: 0.12,
          ease: "power2.out"
        },
        "-=0.45"
      );

      // Outfit descriptions.
      animate(
        tl,
        card,
        ".attire-role, .attire-outfit-content h3, .attire-outfit-content p",
        { ...fadeUp, y: 16, duration: 0.45, stagger: 0.08 },
        "-=0.35"
      );

      // Guest attire guidelines.
      animate(
        tl,
        card,
        ".guest-attire-item",
        {
          opacity: 0,
          x: index % 2 === 0 ? -25 : 25,
          duration: 0.55,
          stagger: 0.14,
          ease: "power2.out"
        },
        "-=0.2"
      );

      // Recommended colors.
      if (card.querySelector(".guest-color-option")) {
        animate(
          tl,
          card,
          ".guest-color-theme h3",
          { ...fadeUp, y: 15, duration: 0.45 },
          "-=0.15"
        );

        animate(
          tl,
          card,
          ".guest-color-option",
          {
            opacity: 0,
            y: 20,
            scale: 0.75,
            duration: 0.45,
            stagger: 0.08,
            ease: "back.out(1.5)"
          },
          "-=0.2"
        );
      }

      // Reminder.
      animate(
        tl,
        card,
        ".attire-reminder",
        {
          opacity: 0,
          y: 24,
          scale: 0.97,
          duration: 0.55,
          ease: "power2.out"
        },
        "-=0.15"
      );
    });

    /* ======================================================
       SUBTLE COLOR SWATCH FLOAT
    ====================================================== */

    gsap.to(".guest-swatch", {
      y: -4,
      duration: 1.4,
      stagger: 0.12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

  }, page);

  page.dataset.gsapInitialized = "true";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (page.isConnected) ScrollTrigger.refresh();
    });
  });
};

/* ==========================================================
   SPA CLEANUP
========================================================== */

window.cleanupAttirePage = function () {
  window.attireGsapContext?.revert();
  window.attireGsapContext = null;

  const page = document.querySelector(".attire-page");

  if (page) {
    delete page.dataset.gsapInitialized;
  }
};
