/* =========================================================
   LOCATION PAGE — GSAP SCROLL ANIMATION
   SPA COMPATIBLE
========================================================= */

window.initializeLocationPage = function () {
  const locationPage =
    document.querySelector(".location-page");

  if (!locationPage) {
    return;
  }

  if (
    locationPage.dataset.gsapInitialized ===
    "true"
  ) {
    return;
  }

  if (
    typeof window.gsap === "undefined" ||
    typeof window.ScrollTrigger ===
      "undefined"
  ) {
    console.warn(
      "GSAP or ScrollTrigger is not loaded."
    );

    return;
  }

  locationPage.dataset.gsapInitialized =
    "true";

  gsap.registerPlugin(ScrollTrigger);

  window.locationGsapContext =
    gsap.context(function () {
      /* =====================================================
         HERO ENTRANCE
      ===================================================== */

      const heroTimeline =
        gsap.timeline({
          defaults: {
            ease: "power3.out",
          },
        });

      heroTimeline
        .from(
          ".location-hero .page-hero-overlay",
          {
            opacity: 0,
            duration: 0.8,
          }
        )
        .from(
          ".location-hero .page-hero-content p",
          {
            opacity: 0,
            y: 22,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          ".location-hero .page-hero-content h1",
          {
            opacity: 0,
            y: 38,
            scale: 0.94,
            duration: 0.85,
          },
          "-=0.35"
        );

      /* =====================================================
         LOCATION CARD
      ===================================================== */

      const locationCard =
        document.querySelector(
          ".location-card"
        );

      if (locationCard) {
        const cardTimeline =
          gsap.timeline({
            scrollTrigger: {
              trigger: locationCard,
              start: "top 84%",
              once: true,
            },
          });

        cardTimeline
          .from(locationCard, {
            opacity: 0,
            y: 70,
            scale: 0.96,
            duration: 0.9,
            ease: "power3.out",
          })

          .from(
            ".location-icon",
            {
              opacity: 0,
              scale: 0.35,
              rotation: -30,
              duration: 0.65,
              ease: "back.out(1.8)",
            },
            "-=0.55"
          )

          .from(
            [
              ".location-label",
              ".location-name",
              ".location-address",
            ],
            {
              opacity: 0,
              y: 20,
              duration: 0.55,
              stagger: 0.12,
              ease: "power2.out",
            },
            "-=0.4"
          )

          .from(
            ".location-divider",
            {
              opacity: 0,
              scaleX: 0,
              transformOrigin: "center",
              duration: 0.55,
              ease: "power2.out",
            },
            "-=0.25"
          );

        /* ===================================================
           DATE AND TIME DETAILS
        =================================================== */

        const detailItems =
          locationCard.querySelectorAll(
            ".location-detail-item"
          );

        if (detailItems.length) {
          cardTimeline.from(
            detailItems,
            {
              opacity: 0,
              x: -28,
              duration: 0.55,
              stagger: 0.14,
              ease: "power2.out",
            },
            "-=0.2"
          );
        }

        /* ===================================================
           MAP PREVIEW
        =================================================== */

        const mapContainer =
          locationCard.querySelector(
            ".location-map-container"
          );

        if (mapContainer) {
          cardTimeline.from(
            mapContainer,
            {
              opacity: 0,
              y: 35,
              scale: 0.95,
              duration: 0.75,
              ease: "power3.out",
            },
            "-=0.15"
          );
        }

        /* ===================================================
           GOOGLE MAP BUTTON
        =================================================== */

        const mapButton =
          locationCard.querySelector(
            ".location-map-button"
          );

        if (mapButton) {
          cardTimeline.from(
            mapButton,
            {
              opacity: 0,
              y: 22,
              scale: 0.96,
              duration: 0.6,
              ease: "back.out(1.4)",
            },
            "-=0.25"
          );
        }
      }

      /* =====================================================
         HERO PARALLAX
      ===================================================== */

      gsap.to(".location-hero", {
        backgroundPosition: "center 55%",
        ease: "none",

        scrollTrigger: {
          trigger: ".location-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      /* =====================================================
         MAP LABEL FLOAT EFFECT
      ===================================================== */

      gsap.to(".location-map-open-label", {
        y: -5,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, locationPage);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      ScrollTrigger.refresh();
    });
  });
};

/* =========================================================
   CLEANUP BEFORE LEAVING LOCATION PAGE
========================================================= */

window.cleanupLocationPage = function () {
  if (window.locationGsapContext) {
    window.locationGsapContext.revert();

    window.locationGsapContext = null;
  }

  if (
    typeof window.ScrollTrigger !==
    "undefined"
  ) {
    ScrollTrigger
      .getAll()
      .forEach(function (trigger) {
        const triggerElement =
          trigger.trigger;

        if (
          triggerElement &&
          triggerElement.closest &&
          triggerElement.closest(
            ".location-page"
          )
        ) {
          trigger.kill();
        }
      });
  }
};