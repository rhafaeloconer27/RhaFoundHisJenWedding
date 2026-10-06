/* =========================================================
   FAQ PAGE — GSAP SCROLL ANIMATION
   SPA COMPATIBLE
========================================================= */

window.initializeFaqPage = function () {
  const faqPage =
    document.querySelector(".faq-page");

  if (!faqPage) {
    return;
  }

  if (
    faqPage.dataset.gsapInitialized ===
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

  faqPage.dataset.gsapInitialized =
    "true";

  gsap.registerPlugin(ScrollTrigger);

  window.faqGsapContext =
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
          ".faq-hero .page-hero-overlay",
          {
            opacity: 0,
            duration: 0.8,
          }
        )
        .from(
          ".faq-hero .page-hero-content p",
          {
            opacity: 0,
            y: 22,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          ".faq-hero .page-hero-content h1",
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
        ".faq-hero",
        {
          backgroundPosition:
            "center 55%",

          ease: "none",

          scrollTrigger: {
            trigger:
              ".faq-hero",

            start:
              "top top",

            end:
              "bottom top",

            scrub: 1,
          },
        }
      );

      /* =====================================================
         INTRO CARD
      ===================================================== */

      const introCard =
        document.querySelector(
          ".faq-intro-card"
        );

      if (introCard) {
        const introTimeline =
          gsap.timeline({
            scrollTrigger: {
              trigger: introCard,
              start: "top 85%",
              once: true,
            },
          });

        introTimeline
          .from(
            introCard,
            {
              opacity: 0,
              y: 65,
              scale: 0.96,
              duration: 0.9,
              ease: "power3.out",
            }
          )
          .from(
            introCard.querySelector(
              ".faq-icon"
            ),
            {
              opacity: 0,
              scale: 0.3,
              rotation: -25,
              duration: 0.65,
              ease: "back.out(1.8)",
            },
            "-=0.55"
          )
          .from(
            introCard.querySelectorAll(
              [
                ".faq-label",
                ".faq-title",
                ".faq-description",
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
          );
      }

      /* =====================================================
         FAQ CARDS
      ===================================================== */

      const faqCards =
        gsap.utils.toArray(
          ".faq-card"
        );

      faqCards.forEach(
        function (card, index) {
          const cardIcon =
            card.querySelector(
              ".faq-card-icon"
            );

          const cardTitle =
            card.querySelector(
              ".faq-card-content h3"
            );

          const cardBody =
            card.querySelectorAll(
              [
                ".faq-card-content > p",
                ".faq-address",
                ".faq-color-list",
                ".faq-reminder-list",
              ].join(",")
            );

          const cardTimeline =
            gsap.timeline({
              scrollTrigger: {
                trigger: card,
                start: "top 86%",
                once: true,
              },
            });

          cardTimeline.from(
            card,
            {
              opacity: 0,
              y: 55,
              x:
                index % 2 === 0
                  ? -18
                  : 18,
              scale: 0.97,
              duration: 0.75,
              ease: "power3.out",
            }
          );

          if (cardIcon) {
            cardTimeline.from(
              cardIcon,
              {
                opacity: 0,
                scale: 0.35,
                rotation:
                  index % 2 === 0
                    ? -20
                    : 20,
                duration: 0.55,
                ease: "back.out(1.7)",
              },
              "-=0.42"
            );
          }

          if (cardTitle) {
            cardTimeline.from(
              cardTitle,
              {
                opacity: 0,
                y: 14,
                duration: 0.45,
                ease: "power2.out",
              },
              "-=0.32"
            );
          }

          if (cardBody.length) {
            cardTimeline.from(
              cardBody,
              {
                opacity: 0,
                y: 14,
                duration: 0.48,
                stagger: 0.09,
                ease: "power2.out",
              },
              "-=0.28"
            );
          }

          const colorItems =
            card.querySelectorAll(
              ".faq-color-list span"
            );

          if (colorItems.length) {
            cardTimeline.from(
              colorItems,
              {
                opacity: 0,
                y: 10,
                scale: 0.75,
                duration: 0.38,
                stagger: 0.07,
                ease: "back.out(1.5)",
              },
              "-=0.2"
            );
          }

          const reminderItems =
            card.querySelectorAll(
              ".faq-reminder-list li"
            );

          if (reminderItems.length) {
            cardTimeline.from(
              reminderItems,
              {
                opacity: 0,
                x: -18,
                duration: 0.4,
                stagger: 0.1,
                ease: "power2.out",
              },
              "-=0.25"
            );
          }
        }
      );

      /* =====================================================
         FINAL NOTE CARD
      ===================================================== */

      const noteCard =
        document.querySelector(
          ".faq-note-card"
        );

      if (noteCard) {
        const noteTimeline =
          gsap.timeline({
            scrollTrigger: {
              trigger: noteCard,
              start: "top 88%",
              once: true,
            },
          });

        noteTimeline
          .from(
            noteCard,
            {
              opacity: 0,
              y: 45,
              scale: 0.97,
              duration: 0.7,
              ease: "power3.out",
            }
          )
          .from(
            noteCard.querySelector("i"),
            {
              opacity: 0,
              scale: 0.3,
              rotation: -20,
              duration: 0.5,
              ease: "back.out(1.7)",
            },
            "-=0.4"
          )
          .from(
            noteCard.querySelector("p"),
            {
              opacity: 0,
              y: 12,
              duration: 0.45,
              ease: "power2.out",
            },
            "-=0.25"
          );
      }

      /* =====================================================
         SUBTLE ICON FLOAT
      ===================================================== */

      gsap.to(
        ".faq-intro-card .faq-icon",
        {
          y: -5,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }
      );

    }, faqPage);

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
   CLEANUP BEFORE LEAVING FAQ PAGE
========================================================= */

window.cleanupFaqPage = function () {
  if (window.faqGsapContext) {
    window.faqGsapContext.revert();

    window.faqGsapContext = null;
  }

  const faqPage =
    document.querySelector(
      ".faq-page"
    );

  if (faqPage) {
    delete faqPage.dataset.gsapInitialized;
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
              ".faq-page"
            )
          ) {
            trigger.kill();
          }
        }
      );
  }
};