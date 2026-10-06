/* =========================================================
   SPONSORS PAGE — GSAP SCROLL ANIMATION
   SPA COMPATIBLE
========================================================= */

window.initializeSponsorsPage = function () {
  const sponsorsPage =
    document.querySelector(
      ".sponsors-page"
    );

  if (!sponsorsPage) {
    return;
  }

  if (
    sponsorsPage.dataset.gsapInitialized ===
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

  sponsorsPage.dataset.gsapInitialized =
    "true";

  gsap.registerPlugin(
    ScrollTrigger
  );

  window.sponsorsGsapContext =
    gsap.context(function () {

      /*
       * Hero animation
       */

      const heroTimeline =
        gsap.timeline({
          defaults: {
            ease: "power3.out",
          },
        });

      heroTimeline
        .from(
          ".sponsors-hero .page-hero-overlay",
          {
            opacity: 0,
            duration: 0.8,
          }
        )
        .from(
          ".sponsors-hero .page-hero-content p",
          {
            opacity: 0,
            y: 24,
            duration: 0.65,
          },
          "-=0.4"
        )
        .from(
          ".sponsors-hero .page-hero-content h1",
          {
            opacity: 0,
            y: 38,
            scale: 0.94,
            duration: 0.85,
          },
          "-=0.4"
        );

      /*
       * Decorative divider
       */

      gsap.from(
        ".sponsors-section-divider",
        {
          opacity: 0,
          scale: 0,
          rotation: -90,
          duration: 0.7,
          ease: "back.out(1.8)",

          scrollTrigger: {
            trigger:
              ".sponsors-section-divider",

            start: "top 90%",

            once: true,
          },
        }
      );

      /*
       * Animate each Sponsors card
       */

      const cards =
        gsap.utils.toArray(
          ".sponsors-card"
        );

      cards.forEach(
        function (card, cardIndex) {
          const cardTimeline =
            gsap.timeline({
              scrollTrigger: {
                trigger: card,

                start: "top 84%",

                once: true,
              },
            });

          /*
           * Main card entrance
           */

          cardTimeline.from(
            card,
            {
              opacity: 0,
              y: 70,
              scale: 0.96,

              duration: 0.9,

              ease: "power3.out",
            }
          );

          /*
           * Icon
           */

          const icon =
            card.querySelector(
              ".sponsors-card-icon"
            );

          if (icon) {
            cardTimeline.from(
              icon,
              {
                opacity: 0,
                scale: 0.35,
                rotation: -25,

                duration: 0.65,

                ease:
                  "back.out(1.7)",
              },
              "-=0.55"
            );
          }

          /*
           * Label and heading
           */

          const headings =
            card.querySelectorAll(
              [
                ".sponsors-card-label",
                ".sponsors-card-title",
              ].join(",")
            );

          if (headings.length) {
            cardTimeline.from(
              headings,
              {
                opacity: 0,
                y: 20,

                duration: 0.55,

                stagger: 0.12,

                ease: "power2.out",
              },
              "-=0.42"
            );
          }

          /*
           * Principal Sponsor names
           */

          const principalNames =
            card.querySelectorAll(
              ".sponsors-name-list > p"
            );

          if (
            principalNames.length
          ) {
            cardTimeline.from(
              principalNames,
              {
                opacity: 0,

                x:
                  cardIndex % 2 === 0
                    ? -28
                    : 28,

                duration: 0.5,

                stagger: 0.09,

                ease: "power2.out",
              },
              "-=0.25"
            );
          }

          /*
           * Secondary Sponsor and Bearer items
           */

          const secondaryItems =
            card.querySelectorAll(
              ".secondary-sponsor-item"
            );

          if (
            secondaryItems.length
          ) {
            cardTimeline.from(
              secondaryItems,
              {
                opacity: 0,
                y: 26,
                scale: 0.97,

                duration: 0.5,

                stagger: 0.12,

                ease: "power2.out",
              },
              "-=0.25"
            );
          }

          /*
           * Honor Attendants
           */

          const honorAttendants =
            card.querySelectorAll(
              ".honor-attendants-grid .entourage-group"
            );

          if (
            honorAttendants.length
          ) {
            cardTimeline.from(
              honorAttendants,
              {
                opacity: 0,
                y: 25,
                scale: 0.96,

                duration: 0.55,

                stagger: 0.15,

                ease: "power2.out",
              },
              "-=0.25"
            );
          }

          /*
           * Entourage boxes
           */

          const entourageBoxes =
            card.querySelectorAll(
              ".entourage-box-item"
            );

          if (
            entourageBoxes.length
          ) {
            cardTimeline.from(
              entourageBoxes,
              {
                opacity: 0,
                y: 30,
                scale: 0.95,

                duration: 0.6,

                stagger: 0.15,

                ease: "power2.out",
              },
              "-=0.25"
            );
          }

          /*
           * Names inside entourage boxes
           */

          const entourageNames =
            card.querySelectorAll(
              ".entourage-box-content strong"
            );

          if (
            entourageNames.length
          ) {
            cardTimeline.from(
              entourageNames,
              {
                opacity: 0,
                x: -15,

                duration: 0.4,

                stagger: 0.07,

                ease: "power2.out",
              },
              "-=0.3"
            );
          }
        }
      );

      /*
       * Hero parallax while scrolling
       */

      gsap.to(
        ".sponsors-hero",
        {
          backgroundPosition:
            "center 52%",

          ease: "none",

          scrollTrigger: {
            trigger:
              ".sponsors-hero",

            start: "top top",
            end: "bottom top",

            scrub: 1,
          },
        }
      );

    }, sponsorsPage);

  /*
   * Refresh after SPA rendering
   */

  requestAnimationFrame(
    function () {
      requestAnimationFrame(
        function () {
          ScrollTrigger.refresh();
        }
      );
    }
  );
};

/* =========================================================
   CLEANUP BEFORE LEAVING THE PAGE
========================================================= */

window.cleanupSponsorsPage = function () {
  if (
    window.sponsorsGsapContext
  ) {
    window.sponsorsGsapContext.revert();

    window.sponsorsGsapContext =
      null;
  }

  if (
    typeof window.ScrollTrigger !==
    "undefined"
  ) {
    ScrollTrigger
      .getAll()
      .forEach(
        function (trigger) {
          const triggerElement =
            trigger.trigger;

          if (
            triggerElement &&
            triggerElement.closest &&
            triggerElement.closest(
              ".sponsors-page"
            )
          ) {
            trigger.kill();
          }
        }
      );
  }
};