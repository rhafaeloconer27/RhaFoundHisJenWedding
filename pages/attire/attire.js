
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

    /* ======================================================
       SHARED ANIMATION CONFIGURATIONS
    ====================================================== */

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

    const colorReveal = {
      opacity: 0,
      y: 20,
      scale: 0.75,
      duration: 0.55,
      stagger: 0.1,
      ease: "back.out(1.5)"
    };

    /* ======================================================
       ANIMATION HELPER
    ====================================================== */

    const animate = (
      timeline,
      container,
      selector,
      vars,
      position
    ) => {
      const elements = container.querySelectorAll(selector);

      if (elements.length) {
        timeline.from(elements, vars, position);
      }

      return timeline;
    };

    /* ======================================================
       ATTIRE POSTER + HEADER ENTRANCE
    ====================================================== */

    const heroTimeline = gsap.timeline({
      defaults: {
        ease: "power3.out"
      }
    });

    animate(
      heroTimeline,
      page,
      ".attire-hero-image",
      {
        opacity: 0,
        y: 65,
        scale: 0.88,
        duration: 1.1,
        ease: "power3.out"
      }
    );

    animate(
      heroTimeline,
      page,
      ".attire-page-header p",
      {
        opacity: 0,
        y: 25,
        duration: 0.65
      },
      "-=0.5"
    );

    animate(
      heroTimeline,
      page,
      ".attire-page-header h1",
      {
        opacity: 0,
        y: 38,
        scale: 0.94,
        duration: 0.85
      },
      "-=0.4"
    );

    /* ======================================================
       INTRO CARD — WEDDING COLOR STORY
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

      // Reveal intro card.
      tl.from(intro, { ...cardReveal });

      // Reveal icon.
      animate(
        tl,
        intro,
        ".attire-card-icon",
        iconReveal,
        "-=0.55"
      );

      // Reveal heading and description.
      animate(
        tl,
        intro,
        ".attire-eyebrow, h2, .attire-intro-text",
        {
          ...fadeUp,
          stagger: 0.12
        },
        "-=0.4"
      );

      /* ==================================================
         CIRCULAR WEDDING COLOR PALETTE
      ================================================== */

      animate(
        tl,
        intro,
        ".attire-palette .guest-color-option",
        { ...colorReveal },
        "-=0.2"
      );
    }


    
    /* ======================================================
       GUEST ATTIRE SHOWCASE — SCROLL ANIMATION

       - Gentle upward entrance
       - Subtle zoom-out
       - No blur
       - No opacity fade
       - Plays once
    ====================================================== */

    const guestShowcase = page.querySelector(
      ".attire-guest-showcase"
    );

    if (guestShowcase) {
      const guestImage = guestShowcase.querySelector(
        ".attire-guest-showcase-image"
      );

      if (guestImage) {
        gsap.fromTo(
          guestImage,
          {
            y: 45,
            scale: 1.04
          },
          {
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: guestShowcase,
              start: "top 85%",
              once: true
            }
          }
        );
      }
    }


    /* ======================================================
       CATEGORY CARDS
    ====================================================== */

    page.querySelectorAll(".attire-category-card").forEach(
      (card, index) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 84%",
            once: true
          }
        });

        // Reveal category card.
        tl.from(card, { ...cardReveal });

        // Reveal card icon.
        animate(
          tl,
          card,
          ".attire-card-icon",
          iconReveal,
          "-=0.55"
        );

        // Reveal headings and descriptions.
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
          {
            ...fadeUp,
            stagger: 0.12
          },
          "-=0.4"
        );

        /* ==================================================
           OUTFIT CARDS
        ================================================== */

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

        /* ==================================================
           OUTFIT IMAGES
        ================================================== */

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

        /* ==================================================
           OUTFIT DESCRIPTIONS
        ================================================== */

        animate(
          tl,
          card,
          ".attire-role, .attire-outfit-content h3, .attire-outfit-content p",
          {
            ...fadeUp,
            y: 16,
            duration: 0.45,
            stagger: 0.08
          },
          "-=0.35"
        );

        /* ==================================================
           GUEST ATTIRE GUIDELINES
        ================================================== */

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

        /* ==================================================
           GUEST RECOMMENDED COLORS
        ================================================== */

        if (card.querySelector(".guest-color-option")) {
          // Reveal recommended colors heading.
          animate(
            tl,
            card,
            ".guest-color-theme h3",
            {
              ...fadeUp,
              y: 15,
              duration: 0.45
            },
            "-=0.15"
          );

          // Reveal each grayscale circle.
          animate(
            tl,
            card,
            ".guest-color-option",
            { ...colorReveal },
            "-=0.2"
          );
        }

        /* ==================================================
           GUEST REMINDER
        ================================================== */

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
      }
    );

    /* ======================================================
       SUBTLE COLOR SWATCH FLOAT
       APPLIES TO BOTH CIRCULAR PALETTES
    ====================================================== */

    const swatches = page.querySelectorAll(".guest-swatch");

    if (swatches.length) {
      gsap.to(swatches, {
        y: -4,
        duration: 1.4,
        stagger: 0.12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5
      });
    }

  }, page);

  /* ======================================================
     MARK PAGE AS INITIALIZED
  ====================================================== */

  page.dataset.gsapInitialized = "true";

  /* ======================================================
     REFRESH SCROLLTRIGGER
  ====================================================== */

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (page.isConnected) {
        ScrollTrigger.refresh();
      }
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
