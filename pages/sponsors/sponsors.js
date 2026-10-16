
/* ==========================================================
   SPONSORS PAGE — GSAP ANIMATIONS
   SPA COMPATIBLE
========================================================== */

window.initializeSponsorsPage = function () {
  const page = document.querySelector(".sponsors-page");

  if (!page || page.dataset.gsapInitialized === "true") {
    return;
  }

  if (!window.gsap || !window.ScrollTrigger) {
    console.warn("GSAP or ScrollTrigger is not loaded.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  window.sponsorsGsapContext?.revert();

  window.sponsorsGsapContext = gsap.context(() => {
    if (reduceMotion) return;

    const cards = gsap.utils.toArray(
      page.querySelectorAll(".sponsors-card")
    );

    cards.forEach((card, index) => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 84%",
          once: true
        }
      });

      // Main card entrance
      timeline.from(card, {
        opacity: 0,
        y: 70,
        scale: 0.96,
        duration: 0.9,
        ease: "power3.out"
      });

      // Card icon
      timeline.from(
        card.querySelector(".sponsors-card-icon"),
        {
          opacity: 0,
          scale: 0.35,
          rotation: -25,
          duration: 0.65,
          ease: "back.out(1.7)"
        },
        "-=0.55"
      );

      // Card label and heading
      timeline.from(
        card.querySelectorAll(
          ".sponsors-card-label, .sponsors-card-title"
        ),
        {
          opacity: 0,
          y: 20,
          duration: 0.55,
          stagger: 0.12,
          ease: "power2.out"
        },
        "-=0.42"
      );

      // Animate principal sponsor names
      const principalNames = card.querySelectorAll(
        ".sponsors-name-list > p"
      );

      if (principalNames.length) {
        timeline.from(principalNames, {
          opacity: 0,
          x: index % 2 === 0 ? -28 : 28,
          duration: 0.5,
          stagger: 0.09,
          ease: "power2.out"
        }, "-=0.25");
      }

      // Animate secondary sponsors, bearers and honor attendants
      const groupItems = card.querySelectorAll(
        ".secondary-sponsor-item, .entourage-group, .entourage-box-item"
      );

      if (groupItems.length) {
        timeline.from(groupItems, {
          opacity: 0,
          y: 28,
          scale: 0.96,
          duration: 0.55,
          stagger: 0.12,
          ease: "power2.out"
        }, "-=0.25");
      }

      // Animate entourage names
      const entourageNames = card.querySelectorAll(
        ".entourage-box-content strong"
      );

      if (entourageNames.length) {
        timeline.from(entourageNames, {
          opacity: 0,
          x: -15,
          duration: 0.4,
          stagger: 0.07,
          ease: "power2.out"
        }, "-=0.3");
      }
    });
  }, page);

  page.dataset.gsapInitialized = "true";

  // Refresh ScrollTrigger after SPA rendering
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (page.isConnected) {
        ScrollTrigger.refresh();
      }
    });
  });
};

/* ==========================================================
   CLEANUP BEFORE SPA NAVIGATION
========================================================== */

window.cleanupSponsorsPage = function () {
  window.sponsorsGsapContext?.revert();
  window.sponsorsGsapContext = null;

  const page = document.querySelector(".sponsors-page");

  if (page) {
    delete page.dataset.gsapInitialized;
  }
};
