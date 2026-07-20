document.addEventListener(
  "DOMContentLoaded",
  function () {
    const loader =
      document.getElementById(
        "weddingLoader"
      );

    const invitationIntro =
      document.getElementById(
        "invitationIntro"
      );

    const openSealButton =
      document.getElementById(
        "openInvitationButton"
      );

    /*
      Stop when this is not the intro page.
    */
    if (
      !loader ||
      !invitationIntro ||
      !openSealButton ||
      typeof gsap === "undefined"
    ) {
      return;
    }

    let isOpening = false;

    /* ======================================================
       INITIAL STATE
    ====================================================== */

    gsap.set(
      invitationIntro,
      {
        autoAlpha: 0,
      }
    );

    gsap.set(
      ".invitation-stage",
      {
        y: 40,
        opacity: 0,
      }
    );

    gsap.set(
      ".invitation-cover",
      {
        scale: 0.94,
      }
    );

    /* ======================================================
       INTRO LOADER
    ====================================================== */

    const loadingTimeline =
      gsap.timeline({
        defaults: {
          ease: "power2.out",
        },
      });

    loadingTimeline
      .from(
        ".loader-rings",
        {
          scale: 0.5,
          opacity: 0,
          duration: 0.7,
        }
      )
      .from(
        ".loader-names",
        {
          y: 20,
          opacity: 0,
          duration: 0.7,
        },
        "-=0.35"
      )
      .from(
        ".loader-message",
        {
          y: 10,
          opacity: 0,
          duration: 0.5,
        },
        "-=0.25"
      )
      .to(
        {},
        {
          duration: 0.7,
        }
      )
      .to(
        loader,
        {
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.inOut",
        }
      )
      .to(
        invitationIntro,
        {
          autoAlpha: 1,
          duration: 0.7,
        },
        "-=0.35"
      )
      .to(
        ".invitation-stage",
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
        },
        "-=0.5"
      )
      .to(
        ".invitation-cover",
        {
          scale: 1,
          duration: 1,
          ease: "back.out(1.3)",
        },
        "-=0.8"
      )
      .set(
        loader,
        {
          display: "none",
        }
      );

    /* ======================================================
       OPEN INVITATION
    ====================================================== */

    function openInvitation() {
      if (isOpening) {
        return;
      }

      isOpening = true;
      openSealButton.disabled = true;

      const openTimeline =
        gsap.timeline({
          defaults: {
            ease: "power3.inOut",
          },

          onComplete: function () {
            /*
              IMPORTANT CHANGE:

              Open the permanent SPA shell,
              not pages/home.html and not home.html.
            */
            window.location.href =
              "wedding.html";
          },
        });

      openTimeline
        .to(
          ".gsap-wax-seal",
          {
            scale: 0.88,
            duration: 0.15,
            ease: "power2.in",
          }
        )
        .to(
          ".gsap-wax-seal",
          {
            scale: 1.35,
            opacity: 0,
            rotation: 12,
            duration: 0.45,
            ease: "back.in(1.7)",
          }
        )
        .to(
          ".cover-title",
          {
            opacity: 0,
            y: -15,
            duration: 0.4,
          },
          "-=0.3"
        )
        .to(
          ".cover-panel-left",
          {
            xPercent: -102,
            rotationY: -8,
            duration: 1.15,
          },
          "-=0.1"
        )
        .to(
          ".cover-panel-right",
          {
            xPercent: 102,
            rotationY: 8,
            duration: 1.15,
          },
          "<"
        )
        .fromTo(
          ".reveal-photo",
          {
            scale: 1.15,
          },
          {
            scale: 1,
            duration: 1.6,
            ease: "power2.out",
          },
          "-=0.95"
        )
        .from(
          ".reveal-content > *",
          {
            y: 24,
            opacity: 0,
            duration: 0.65,
            stagger: 0.14,
            ease: "power2.out",
          },
          "-=1.15"
        )
        .to(
          ".intro-label",
          {
            opacity: 0,
            y: 12,
            duration: 0.45,
          },
          "-=1"
        )
        .to(
          {},
          {
            duration: 0.65,
          }
        )
        .to(
          ".invitation-cover",
          {
            scale: 1.08,
            duration: 0.8,
            ease: "power2.inOut",
          }
        )
        .to(
          ".invitation-intro",
          {
            opacity: 0,
            duration: 0.65,
            ease: "power2.in",
          },
          "-=0.3"
        );
    }

    openSealButton.addEventListener(
      "click",
      openInvitation
    );
  }
);