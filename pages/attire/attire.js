/* =========================================================
   ATTIRE PAGE — GSAP SCROLL ANIMATION
   SPA COMPATIBLE
========================================================= */

window.initializeAttirePage = function () {
  const attirePage =
    document.querySelector(".attire-page");

  if (!attirePage) {
    return;
  }

  if (
    attirePage.dataset.gsapInitialized ===
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

  attirePage.dataset.gsapInitialized =
    "true";

  gsap.registerPlugin(ScrollTrigger);

  window.attireGsapContext =
    gsap.context(function () {

      /* =====================================================
         HERO ANIMATION
      ===================================================== */

      const heroTimeline =
        gsap.timeline({
          defaults: {
            ease: "power3.out",
          },
        });

      heroTimeline
        .from(
          ".attire-hero .page-hero-overlay",
          {
            opacity: 0,
            duration: 0.8,
          }
        )
        .from(
          ".attire-hero .page-hero-content p",
          {
            opacity: 0,
            y: 22,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          ".attire-hero .page-hero-content h1",
          {
            opacity: 0,
            y: 38,
            scale: 0.94,
            duration: 0.85,
          },
          "-=0.35"
        );

      /* =====================================================
         HERO PARALLAX
      ===================================================== */

      gsap.to(
        ".attire-hero",
        {
          backgroundPosition:
            "center 52%",

          ease: "none",

          scrollTrigger: {
            trigger:
              ".attire-hero",

            start: "top top",
            end: "bottom top",

            scrub: 1,
          },
        }
      );

      /* =====================================================
         INTRO CARD
      ===================================================== */

      const introCard =
        document.querySelector(
          ".attire-intro-card"
        );

      if (introCard) {
        const introTimeline =
          gsap.timeline({
            scrollTrigger: {
              trigger: introCard,
              start: "top 84%",
              once: true,
            },
          });

        introTimeline
          .from(
            introCard,
            {
              opacity: 0,
              y: 70,
              scale: 0.96,
              duration: 0.9,
              ease: "power3.out",
            }
          )
          .from(
            introCard.querySelector(
              ".attire-card-icon"
            ),
            {
              opacity: 0,
              scale: 0.35,
              rotation: -25,
              duration: 0.65,
              ease: "back.out(1.8)",
            },
            "-=0.55"
          )
          .from(
            introCard.querySelectorAll(
              [
                ".attire-eyebrow",
                "h2",
                ".attire-intro-text",
              ].join(",")
            ),
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
            introCard.querySelector(
              ".attire-palette"
            ),
            {
              opacity: 0,
              scaleX: 0,
              transformOrigin: "center",
              duration: 0.7,
              ease: "power3.out",
            },
            "-=0.2"
          )
          .from(
            introCard.querySelectorAll(
              ".attire-color"
            ),
            {
              opacity: 0,
              scaleY: 0,
              transformOrigin: "bottom",
              duration: 0.45,
              stagger: 0.08,
              ease: "power2.out",
            },
            "-=0.4"
          )
          .from(
            introCard.querySelector(
              ".attire-palette-note"
            ),
            {
              opacity: 0,
              y: 12,
              duration: 0.45,
              ease: "power2.out",
            },
            "-=0.2"
          );
      }

      /* =====================================================
         CATEGORY CARDS
      ===================================================== */

      const categoryCards =
        gsap.utils.toArray(
          ".attire-category-card"
        );

      categoryCards.forEach(
        function (card, cardIndex) {
          const cardTimeline =
            gsap.timeline({
              scrollTrigger: {
                trigger: card,
                start: "top 84%",
                once: true,
              },
            });

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

          const cardIcon =
            card.querySelector(
              ".attire-card-icon"
            );

          if (cardIcon) {
            cardTimeline.from(
              cardIcon,
              {
                opacity: 0,
                scale: 0.35,
                rotation: -25,
                duration: 0.65,
                ease: "back.out(1.8)",
              },
              "-=0.55"
            );
          }

          const headingElements =
            card.querySelectorAll(
              [
                ".attire-category-header .attire-eyebrow",
                ".attire-category-header h2",
                ".attire-category-header > p",
                ".guest-attire-card > .attire-eyebrow",
                ".guest-attire-card > h2",
                ".guest-attire-description",
              ].join(",")
            );

          if (headingElements.length) {
            cardTimeline.from(
              headingElements,
              {
                opacity: 0,
                y: 20,
                duration: 0.55,
                stagger: 0.12,
                ease: "power2.out",
              },
              "-=0.4"
            );
          }

          /* =================================================
             OUTFIT CARDS
          ================================================= */

          const outfitCards =
            card.querySelectorAll(
              ".attire-outfit-card"
            );

          if (outfitCards.length) {
            cardTimeline.from(
              outfitCards,
              {
                opacity: 0,
                y: 35,
                scale: 0.95,
                duration: 0.7,
                stagger: 0.16,
                ease: "power3.out",
              },
              "-=0.25"
            );
          }

          /* =================================================
             OUTFIT IMAGES
          ================================================= */

          const outfitImages =
            card.querySelectorAll(
              ".attire-image-frame img"
            );

          if (outfitImages.length) {
            cardTimeline.from(
              outfitImages,
              {
                opacity: 0,
                y: 25,
                scale: 0.92,
                duration: 0.65,
                stagger: 0.12,
                ease: "power2.out",
              },
              "-=0.45"
            );
          }

          /* =================================================
             OUTFIT TEXT
          ================================================= */

          const outfitContent =
            card.querySelectorAll(
              [
                ".attire-role",
                ".attire-outfit-content h3",
                ".attire-outfit-content p",
              ].join(",")
            );

          if (outfitContent.length) {
            cardTimeline.from(
              outfitContent,
              {
                opacity: 0,
                y: 16,
                duration: 0.45,
                stagger: 0.08,
                ease: "power2.out",
              },
              "-=0.35"
            );
          }

          /* =================================================
             GUEST ATTIRE GUIDELINES
          ================================================= */

          const guestGuidelines =
            card.querySelectorAll(
              ".guest-attire-item"
            );

          if (guestGuidelines.length) {
            cardTimeline.from(
              guestGuidelines,
              {
                opacity: 0,
                x:
                  cardIndex % 2 === 0
                    ? -25
                    : 25,
                duration: 0.55,
                stagger: 0.14,
                ease: "power2.out",
              },
              "-=0.2"
            );
          }

          /* =================================================
             COLOR SWATCHES
          ================================================= */

          const colorOptions =
            card.querySelectorAll(
              ".guest-color-option"
            );

          if (colorOptions.length) {
            cardTimeline.from(
              ".guest-color-theme h3",
              {
                opacity: 0,
                y: 15,
                duration: 0.45,
                ease: "power2.out",
              },
              "-=0.15"
            );

            cardTimeline.from(
              colorOptions,
              {
                opacity: 0,
                y: 20,
                scale: 0.75,
                duration: 0.45,
                stagger: 0.08,
                ease: "back.out(1.5)",
              },
              "-=0.2"
            );
          }

          /* =================================================
             REMINDER
          ================================================= */

          const reminder =
            card.querySelector(
              ".attire-reminder"
            );

          if (reminder) {
            cardTimeline.from(
              reminder,
              {
                opacity: 0,
                y: 24,
                scale: 0.97,
                duration: 0.55,
                ease: "power2.out",
              },
              "-=0.15"
            );
          }
        }
      );

      /* =====================================================
         SUBTLE SWATCH FLOAT
      ===================================================== */

      gsap.to(
        ".guest-swatch",
        {
          y: -4,
          duration: 1.4,
          stagger: {
            each: 0.12,
            repeat: -1,
            yoyo: true,
          },
          ease: "sine.inOut",
        }
      );

    }, attirePage);

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
   CLEANUP BEFORE LEAVING ATTIRE PAGE
========================================================= */

window.cleanupAttirePage = function () {
  if (window.attireGsapContext) {
    window.attireGsapContext.revert();

    window.attireGsapContext =
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
              ".attire-page"
            )
          ) {
            trigger.kill();
          }
        }
      );
  }
};