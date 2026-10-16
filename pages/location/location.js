
/* ==========================================================
   LOCATION PAGE — GSAP ANIMATIONS
   SPA COMPATIBLE
========================================================== */

window.initializeLocationPage = function () {
  const page = document.querySelector(".location-page");

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

  // Remove any previous context before initialization.
  window.locationGsapContext?.revert();

  window.locationGsapContext = gsap.context(() => {

    if (reduceMotion) return;

    /* ======================================================
       HERO ENTRANCE
    ====================================================== */

    gsap.timeline({
      defaults: { ease: "power3.out" }
    })
      .from(".location-hero .page-hero-overlay", {
        opacity: 0,
        duration: 0.8
      })
      .from(".location-hero .page-hero-content p", {
        opacity: 0,
        y: 22,
        duration: 0.6
      }, "-=0.4")
      .from(".location-hero .page-hero-content h1", {
        opacity: 0,
        y: 38,
        scale: 0.94,
        duration: 0.85
      }, "-=0.35");

    /* ======================================================
       LOCATION CARD
    ====================================================== */

    const card = page.querySelector(".location-card");

    if (card) {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 84%",
          once: true
        }
      });

      timeline
        .from(card, {
          opacity: 0,
          y: 70,
          scale: 0.96,
          duration: 0.9,
          ease: "power3.out"
        })
        .from(".location-icon", {
          opacity: 0,
          scale: 0.35,
          rotation: -30,
          duration: 0.65,
          ease: "back.out(1.8)"
        }, "-=0.55")
        .from([
          ".location-label",
          ".location-name",
          ".location-address"
        ], {
          opacity: 0,
          y: 20,
          duration: 0.55,
          stagger: 0.12,
          ease: "power2.out"
        }, "-=0.4")
        .from(".location-divider", {
          opacity: 0,
          scaleX: 0,
          transformOrigin: "center",
          duration: 0.55
        }, "-=0.25")
        .from(".location-detail-item", {
          opacity: 0,
          x: -28,
          duration: 0.55,
          stagger: 0.14
        }, "-=0.2")
        .from(".location-map-container", {
          opacity: 0,
          y: 35,
          scale: 0.95,
          duration: 0.75
        }, "-=0.15")
        .from(".location-map-button", {
          opacity: 0,
          y: 22,
          scale: 0.96,
          duration: 0.6,
          ease: "back.out(1.4)"
        }, "-=0.25");
    }

    /* ======================================================
       HERO PARALLAX
    ====================================================== */

    gsap.to(".location-hero", {
      backgroundPosition: "center 55%",
      ease: "none",

      scrollTrigger: {
        trigger: ".location-hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    /* ======================================================
       MAP LABEL FLOAT
    ====================================================== */

    gsap.to(".location-map-open-label", {
      y: -5,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

  }, page);

  page.dataset.gsapInitialized = "true";

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

window.cleanupLocationPage = function () {
  window.locationGsapContext?.revert();
  window.locationGsapContext = null;

  const page = document.querySelector(".location-page");

  if (page) {
    delete page.dataset.gsapInitialized;
  }
};
