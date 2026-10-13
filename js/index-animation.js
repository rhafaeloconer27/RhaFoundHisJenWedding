document.addEventListener('DOMContentLoaded', () => {
  const weddingLoader =
    document.getElementById(
      'weddingLoader'
    );

  const invitationEntryGate =
    document.getElementById(
      'invitationEntryGate'
    );

  const invitationIntro =
    document.getElementById(
      'invitationIntro'
    );

  const openInvitationButton =
    document.getElementById(
      'openInvitationButton'
    );

    const openWeddingPagesButton =
  document.getElementById(
    'openWeddingPagesButton'
  );


  const reducedMotionQuery =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );


  let longScrollInitialized =
    false;


  gsap.registerPlugin(
    ScrollTrigger
  );

  /* =========================================================
   PREPARE INTRO MESSAGE

   Keep the first content hidden until
   the wedding invitation has been opened.
========================================================= */

function prepareIntroMessage() {

  /*
   * Card starts hidden.
   */
  gsap.set(
    '.intro-message-card',
    {
      autoAlpha:
        0,

      y:
        70,

      scale:
        0.94,
    }
  );


  /*
   * Message paragraphs start hidden.
   */
  gsap.set(
    '.intro-message-text',
    {
      autoAlpha:
        0,

      y:
        25,
    }
  );


  /*
   * Closing / signature / scroll indicator.
   */
  gsap.set(
    [
      '.intro-message-closing',

      '.intro-message-signature',

      '.intro-scroll-lottie',
    ],
    {
      autoAlpha:
        0,

      y:
        20,
    }
  );

}


/*
 * Do this immediately.
 *
 * The loader and invitation cover are
 * above the content, so the user won't
 * see these hidden states.
 */
prepareIntroMessage();

  /* =========================================================
     INITIAL PAGE STATE
  ========================================================= */

  if (
    'scrollRestoration' in
    history
  ) {
    history.scrollRestoration =
      'manual';
  }


  window.scrollTo(
    0,
    0
  );


  /*
   * Lock the page while:
   *
   * 1. Lottie loader is showing
   * 2. Wedding invitation gate is showing
   */
  document.body.classList.add(
    'loading-active',
    'invitation-gate-active'
  );


  /*
   * The long-scroll invitation should not
   * be interactive before opening the seal.
   */
  if (
    invitationIntro
  ) {
    invitationIntro.setAttribute(
      'aria-hidden',
      'true'
    );

    invitationIntro.setAttribute(
      'inert',
      ''
    );
  }


  /* =========================================================
     INITIAL LOADING SCREEN
  ========================================================= */

  window.addEventListener(
    'load',
    () => {

      /*
       * Fallback:
       * If loader is missing,
       * immediately show invitation.
       */
      if (
        !weddingLoader
      ) {
        document.body.classList.remove(
          'loading-active'
        );

        showInvitationEntry();

        return;
      }


      const loaderTimeline =
        gsap.timeline({
          delay:
            2.5,

          onComplete:
            () => {

              gsap.set(
                weddingLoader,
                {
                  display:
                    'none',
                }
              );


              document.body.classList.remove(
                'loading-active'
              );


              /*
               * After rings loader:
               *
               * SHOW WEDDING INVITATION ONLY.
               */
              showInvitationEntry();

            },
        });


      loaderTimeline

        .to(
          '.wedding-loader-content',
          {
            autoAlpha:
              0,

            y:
              -10,

            scale:
              0.97,

            duration:
              0.8,

            ease:
              'power2.inOut',
          }
        )

        .to(
          weddingLoader,
          {
            autoAlpha:
              0,

            duration:
              1.1,

            ease:
              'power2.inOut',
          },

          '-=0.65'
        );

    }
  );


 /* =========================================================
   SHOW WEDDING INVITATION ENTRY

   Wedding cover must be completely static.
   No ScrollTrigger.
   No entrance animation.
========================================================= */

function showInvitationEntry() {

  if (
    !invitationEntryGate
  ) {

    console.error(
      'Invitation entry gate was not found.'
    );

    return;

  }


  /*
   * Always stay at the very top.
   */
  window.scrollTo(
    0,
    0
  );


  /*
   * Show the gate immediately.
   */
  gsap.set(
    invitationEntryGate,
    {
      display:
        'flex',

      autoAlpha:
        1,
    }
  );


  /*
   * New video-style cover.
   *
   * Static until the user
   * clicks the wax seal.
   */
  gsap.set(
    '.video-invitation-wrap',
    {
      autoAlpha:
        1,

      x:
        0,

      y:
        0,

      scale:
        1,

      rotation:
        0,
    }
  );
  }


 /* =========================================================
   ENTER LONG-SCROLL INVITATION

   Start long-scroll BEFORE the envelope disappears
   so there is no blank screen between them.
========================================================= */

function enterInvitationScroll() {

  /* =====================================================
     ENABLE LONG-SCROLL CONTENT FIRST
  ===================================================== */

  if (
    invitationIntro
  ) {

    invitationIntro.removeAttribute(
      'inert'
    );


    invitationIntro.setAttribute(
      'aria-hidden',
      'false'
    );

  }


  /*
   * Make sure the page is at
   * the Intro Message.
   */
  window.scrollTo({
    top:
      0,

    left:
      0,

    behavior:
      'auto',
  });


  /* =====================================================
     START LONG-SCROLL ANIMATIONS NOW

     This is deliberately BEFORE
     fading the envelope away.
  ===================================================== */

  initializeLongScroll();


  requestAnimationFrame(
    () => {

      ScrollTrigger.refresh();

    }
  );


  /* =====================================================
     FALLBACK
  ===================================================== */

  if (
    !invitationEntryGate
  ) {

    document.body.classList.remove(
      'loading-active',
      'invitation-gate-active'
    );


    return;

  }


  /* =====================================================
     REDUCED MOTION
  ===================================================== */

  if (
    reducedMotionQuery.matches
  ) {

    gsap.set(
      invitationEntryGate,
      {
        display:
          'none',

        autoAlpha:
          0,
      }
    );


    document.body.classList.remove(
      'loading-active',
      'invitation-gate-active'
    );


    return;

  }


  /* =====================================================
     CROSSFADE

     Intro Message is already animating underneath.
     We simply fade the complete envelope away.
  ===================================================== */

  gsap.to(
    invitationEntryGate,
    {
      autoAlpha:
        0,

      duration:
        0.45,

      ease:
        'power2.inOut',


      onComplete:
        () => {

          invitationEntryGate.style.display =
            'none';


          /*
           * Enable scrolling only once
           * the entry cover is gone.
           */
          document.body.classList.remove(
            'loading-active',
            'invitation-gate-active'
          );

        },
    }
  );

}
/* =========================================================
   OPEN WEDDING INVITATION

   Preserve envelope-opening animation.

   Long-scroll is visible underneath
   while the envelope opens.
========================================================= */

if (
  openInvitationButton
) {

  openInvitationButton.addEventListener(
    'click',
    () => {

        window.startWeddingMusic?.({
  restart: true,
});


      /*
       * Prevent double click.
       */
      openInvitationButton.disabled =
        true;


      const cover =
        document.getElementById(
          'invitationCover'
        );


      if (
        !cover
      ) {

        prepareLongScrollBehindEnvelope();

        finishInvitationOpening();

        return;

      }


      const topPaper =
        cover.querySelector(
          '.video-envelope-top'
        );


      const bottomPaper =
        cover.querySelector(
          '.video-envelope-bottom'
        );


      const rightEnvelope =
        cover.querySelector(
          '.video-envelope-right'
        );


      /* =====================================================
         PREPARE LONG-SCROLL FIRST

         This replaces the plain background
         underneath the envelope.
      ===================================================== */

      prepareLongScrollBehindEnvelope();


      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      if (
        reducedMotionQuery.matches
      ) {

        gsap.set(
          [
            topPaper,
            bottomPaper,
            rightEnvelope,
          ],
          {
            autoAlpha:
              0,
          }
        );


        finishInvitationOpening();


        return;

      }


      /* =====================================================
         ENVELOPE OPENING ANIMATION
      ===================================================== */

      const openTimeline =
        gsap.timeline({

          onComplete:
            () => {

              /*
               * Envelope animation is complete.
               *
               * Long-scroll is already underneath,
               * so just remove the envelope layer.
               */
              finishInvitationOpening();

            },

        });


      /* =====================================================
         SEAL PRESS
      ===================================================== */

      openTimeline

        .to(
          openInvitationButton,
          {
            scale:
              1.08,

            duration:
              0.18,

            ease:
              'power2.out',
          }
        )

        .to(
          openInvitationButton,
          {
            scale:
              0.96,

            duration:
              0.16,

            ease:
              'power2.inOut',
          }
        );


      /* =====================================================
         BLACK FLAP + SEAL MOVE RIGHT
      ===================================================== */

      if (
        rightEnvelope
      ) {

        openTimeline.to(
          rightEnvelope,
          {
            xPercent:
              112,

            yPercent:
              5,

            rotation:
              5,

            duration:
              1.15,

            ease:
              'power3.inOut',
          }
        );

      }


      /* =====================================================
         TOP ENVELOPE PIECE
      ===================================================== */

      if (
        topPaper
      ) {

        openTimeline.to(
          topPaper,
          {
            xPercent:
              -105,

            yPercent:
              -28,

            rotation:
              -7,

            duration:
              1.25,

            ease:
              'power3.inOut',
          },

          '-=0.92'
        );

      }


      /* =====================================================
         BOTTOM ENVELOPE PIECE
      ===================================================== */

      if (
        bottomPaper
      ) {

        openTimeline.to(
          bottomPaper,
          {
            xPercent:
              -105,

            yPercent:
              30,

            rotation:
              7,

            duration:
              1.25,

            ease:
              'power3.inOut',
          },

          '<'
        );

      }

    },
    {
      once:
        true,
    }
  );

}

/* =========================================================
   PREPARE LONG-SCROLL BEHIND ENVELOPE

   The envelope remains visible on top,
   but the Intro Message is prepared underneath.
========================================================= */

function prepareLongScrollBehindEnvelope() {

  /* =====================================================
     ENABLE LONG-SCROLL CONTENT
  ===================================================== */

  if (
    invitationIntro
  ) {

    invitationIntro.removeAttribute(
      'inert'
    );


    invitationIntro.setAttribute(
      'aria-hidden',
      'false'
    );

  }


  /*
   * Make sure we're positioned
   * at the Intro Message.
   */
  window.scrollTo({
    top:
      0,

    left:
      0,

    behavior:
      'auto',
  });


  /*
   * Start the Intro Message and
   * other long-scroll setup now.
   *
   * It will be underneath the
   * opening envelope.
   */
  initializeLongScroll();


  requestAnimationFrame(
    () => {

      ScrollTrigger.refresh();

    }
  );

}


/* =========================================================
   FINISH ENVELOPE OPENING
========================================================= */

function finishInvitationOpening() {

  /*
   * Envelope pieces have already
   * animated out of view.
   *
   * Remove the entry layer instantly.
   */
  if (
    invitationEntryGate
  ) {

    gsap.set(
      invitationEntryGate,
      {
        display:
          'none',

        autoAlpha:
          0,
      }
    );

  }


  /*
   * Now allow normal scrolling.
   */
  document.body.classList.remove(
    'loading-active',
    'invitation-gate-active'
  );


  requestAnimationFrame(
    () => {

      ScrollTrigger.refresh();

    }
  );

}
   

  /* =========================================================
     LONG-SCROLL INITIALIZATION
  ========================================================= */

  function initializeLongScroll() {

    /*
     * Never initialize twice.
     */
    if (
      longScrollInitialized
    ) {

      return;

    }


    longScrollInitialized =
      true;


    /*
     * Scratch interaction is still
     * needed even with reduced motion.
     */
    initScratchDate();


    /* =====================================================
       REDUCED MOTION
    ===================================================== */

    if (
      reducedMotionQuery.matches
    ) {

      showLongScrollWithoutMotion();

      return;

    }


    /* =====================================================
       NORMAL SCROLL ANIMATIONS
    ===================================================== */

    initMessageAnimations();

    initScriptureAnimations();

    initScratchAnimations();

    initLocationAnimations();

    initAttireAnimations();

    initGiftAnimations();

    initRsvpAnimations();

  }


  /* =========================================================
     SHARED SCROLL ANIMATION
  ========================================================= */

  function animateOnce(
    target,
    animationOptions = {}
  ) {

    const targets =
      gsap.utils.toArray(
        target
      );


    /*
     * Prevent GSAP warnings if an
     * optional element doesn't exist.
     */
    if (
      !targets.length
    ) {

      return;

    }


    const {
      scrollTrigger:
        scrollTriggerOptions = {},

      ...animation
    } =
      animationOptions;


    gsap.from(
      targets,
      {
        opacity:
          0,

        y:
          60,

        scale:
          0.97,

        duration:
          1,

        ease:
          'power3.out',

        clearProps:
          'transform',

        ...animation,


        scrollTrigger:
          {
            trigger:
              scrollTriggerOptions.trigger ||
              targets[0],

            start:
              'top 82%',

            once:
              true,

            ...scrollTriggerOptions,
          },
      }
    );

  }


  /* =========================================================
   MESSAGE SECTION

   This is the FIRST content after opening
   the wedding invitation.

   It should animate immediately,
   NOT wait for scrolling.
========================================================= */

function initMessageAnimations() {

  /*
   * Reduced-motion users:
   * just show everything.
   */
  if (
    reducedMotionQuery.matches
  ) {

    gsap.set(
      [
        '.intro-message-card',

        '.intro-message-text',

        '.intro-message-closing',

        '.intro-message-signature',

        '.intro-scroll-lottie',
      ],
      {
        autoAlpha:
          1,

        x:
          0,

        y:
          0,

        scale:
          1,
      }
    );


    return;

  }


  const messageTimeline =
    gsap.timeline();


  /* =====================================================
     CARD
  ===================================================== */

  messageTimeline.to(
    '.intro-message-card',
    {
      autoAlpha:
        1,

      y:
        0,

      scale:
        1,

      duration:
        1.05,

      ease:
        'power3.out',

      clearProps:
        'transform',
    }
  );


  /* =====================================================
     MESSAGE PARAGRAPHS
  ===================================================== */

  messageTimeline.to(
    '.intro-message-text',
    {
      autoAlpha:
        1,

      y:
        0,

      duration:
        0.7,

      stagger:
        0.18,

      ease:
        'power2.out',
    },

    '-=0.65'
  );


  /* =====================================================
     CLOSING + SIGNATURE + SCROLL LOTTIE
  ===================================================== */

  messageTimeline.to(
    [
      '.intro-message-closing',

      '.intro-message-signature',

      '.intro-scroll-lottie',
    ],
    {
      autoAlpha:
        1,

      y:
        0,

      duration:
        0.7,

      stagger:
        0.15,

      ease:
        'power2.out',
    },

    '-=0.25'
  );

  }


  /* =========================================================
     SCRIPTURE SECTION
  ========================================================= */

  function initScriptureAnimations() {

    animateOnce(
      '.intro-scripture-label',
      {
        y:
          25,

        duration:
          0.7,
      }
    );


    animateOnce(
      '.intro-scripture-card',
      {
        y:
          75,

        scale:
          0.94,

        duration:
          1.1,


        scrollTrigger:
          {
            trigger:
              '.intro-scripture-section',

            start:
              'top 78%',
          },
      }
    );


    gsap.from(
      [
        '.intro-scripture-mark',

        '.intro-scripture-quote',

        '.intro-scripture-divider',

        '.intro-scripture-reference',
      ],
      {
        opacity:
          0,

        y:
          25,

        duration:
          0.8,

        stagger:
          0.16,

        ease:
          'power2.out',


        scrollTrigger:
          {
            trigger:
              '.intro-scripture-card',

            start:
              'top 70%',

            once:
              true,
          },
      }
    );

  }


  /* =========================================================
     SCRATCH DATE — SCROLL ANIMATIONS
  ========================================================= */

  function initScratchAnimations() {

    animateOnce(
      '.intro-scratch-label',
      {
        y:
          25,

        duration:
          0.7,
      }
    );


    animateOnce(
      '.scratch-date-circles',
      {
        y:
          60,

        scale:
          0.94,

        duration:
          1.1,


        scrollTrigger:
          {
            trigger:
              '.intro-scratch-section',

            start:
              'top 78%',
          },
      }
    );

  }


  /* =========================================================
     SCRATCH DATE — INTERACTION
  ========================================================= */

  function initScratchDate() {

    const scratchCanvases =
      document.querySelectorAll(
        '.scratch-circle-canvas'
      );


    const scratchDateComplete =
      document.getElementById(
        'scratchDateComplete'
      );


    const saveTheDateAnimation =
      document.getElementById(
        'saveTheDateAnimation'
      );


    const revealedScratchItems =
      new Set();


    scratchCanvases.forEach(
      (canvas) => {

        const circle =
          canvas.closest(
            '.scratch-circle'
          );


        const scratchId =
          canvas.dataset.scratchId;


        if (
          !circle ||
          !scratchId
        ) {

          return;

        }


        const ctx =
          canvas.getContext(
            '2d'
          );


        if (
          !ctx
        ) {

          return;

        }


        let scratching =
          false;


        let revealed =
          false;


        let gradientShift =
          0;


        const scratchRadius =
          20;


        const scratchedPoints =
          [];


        /* =================================================
           SETUP CANVAS
        ================================================= */

        function setupCanvas() {

          const rect =
            circle.getBoundingClientRect();


          const dpr =
            window.devicePixelRatio ||
            1;


          canvas.width =
            Math.round(
              rect.width *
              dpr
            );


          canvas.height =
            Math.round(
              rect.height *
              dpr
            );


          ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
          );


          drawScratchSurface();

        }


        /* =================================================
           DRAW SCRATCH SURFACE
        ================================================= */

        function drawScratchSurface() {

          if (
            revealed
          ) {

            return;

          }


          const rect =
            circle.getBoundingClientRect();


          ctx.clearRect(
            0,
            0,
            rect.width,
            rect.height
          );


          /*
           * Moving silver gradient.
           */
          const shift =
            gradientShift *
            rect.width *
            0.45;


          const gradient =
            ctx.createLinearGradient(
              -rect.width *
                0.35 +
                shift,

              0,

              rect.width *
                1.25 +
                shift,

              rect.height
            );


          gradient.addColorStop(
            0,
            '#fafafa'
          );


          gradient.addColorStop(
            0.22,
            '#eeeeee'
          );


          gradient.addColorStop(
            0.48,
            '#dddddd'
          );


          gradient.addColorStop(
            0.72,
            '#cccccc'
          );


          gradient.addColorStop(
            1,
            '#b8b8b8'
          );


          ctx.globalCompositeOperation =
            'source-over';


          ctx.fillStyle =
            gradient;


          /*
           * Circular coating.
           */
          ctx.beginPath();


          ctx.arc(
            rect.width /
              2,

            rect.height /
              2,

            rect.width /
              2,

            0,

            Math.PI *
              2
          );


          ctx.fill();


          /*
           * Restore scratched points after
           * gradient is redrawn.
           */
          ctx.globalCompositeOperation =
            'destination-out';


          scratchedPoints.forEach(
            (point) => {

              ctx.beginPath();


              ctx.arc(
                point.x,
                point.y,
                scratchRadius,
                0,
                Math.PI *
                  2
              );


              ctx.fill();

            }
          );


          ctx.globalCompositeOperation =
            'source-over';

        }


        /* =================================================
           POINTER POSITION
        ================================================= */

        function getPosition(
          event
        ) {

          const rect =
            canvas.getBoundingClientRect();


          return {
            x:
              event.clientX -
              rect.left,

            y:
              event.clientY -
              rect.top,
          };

        }


        /* =================================================
           SCRATCH
        ================================================= */

        function scratchAt(
          x,
          y
        ) {

          scratchedPoints.push({
            x:
              x,

            y:
              y,
          });


          ctx.globalCompositeOperation =
            'destination-out';


          ctx.beginPath();


          ctx.arc(
            x,
            y,
            scratchRadius,
            0,
            Math.PI *
              2
          );


          ctx.fill();


          ctx.globalCompositeOperation =
            'source-over';

        }


        /* =================================================
           CHECK SCRATCH %
        ================================================= */

        function checkPercentage() {

          if (
            revealed
          ) {

            return;

          }


          const image =
            ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );


          const dpr =
            window.devicePixelRatio ||
            1;


          const centerX =
            canvas.width /
            2;


          const centerY =
            canvas.height /
            2;


          const radius =
            canvas.width /
            2;


          let cleared =
            0;


          let checked =
            0;


          const step =
            8 *
            dpr;


          for (
            let y = 0;

            y <
            canvas.height;

            y +=
              step
          ) {

            for (
              let x = 0;

              x <
              canvas.width;

              x +=
                step
            ) {

              const dx =
                x -
                centerX;


              const dy =
                y -
                centerY;


              /*
               * Ignore pixels outside
               * circular scratch area.
               */
              if (
                dx *
                  dx +
                  dy *
                  dy >
                radius *
                  radius
              ) {

                continue;

              }


              const index =
                (
                  Math.floor(
                    y
                  ) *
                    canvas.width +
                  Math.floor(
                    x
                  )
                ) *
                  4 +
                3;


              checked++;


              if (
                image.data[
                  index
                ] <
                40
              ) {

                cleared++;

              }

            }

          }


          if (
            !checked
          ) {

            return;

          }


          const percentage =
            cleared /
            checked;


          /*
           * Reveal at 60%.
           */
          if (
            percentage >=
            0.6
          ) {

            revealCircle();

          }

        }


        /* =================================================
           REVEAL CIRCLE
        ================================================= */

        function revealCircle() {

          if (
            revealed
          ) {

            return;

          }


          revealed =
            true;


          scratching =
            false;


          revealedScratchItems.add(
            scratchId
          );


          if (
            reducedMotionQuery.matches
          ) {

            gsap.set(
              canvas,
              {
                opacity:
                  0,
              }
            );


            canvas.style.pointerEvents =
              'none';

          } else {

            gsap.to(
              canvas,
              {
                opacity:
                  0,

                scale:
                  1.08,

                duration:
                  0.65,

                ease:
                  'power2.out',


                onComplete:
                  () => {

                    canvas.style.pointerEvents =
                      'none';

                  },
              }
            );

          }


          const value =
            circle.querySelector(
              '.scratch-circle-value'
            );


          if (
            value &&
            !reducedMotionQuery.matches
          ) {

            gsap.from(
              value,
              {
                opacity:
                  0,

                scale:
                  0.65,

                duration:
                  0.75,

                ease:
                  'back.out(1.8)',
              }
            );

          }


          /* ===============================================
             ALL THREE REVEALED
          =============================================== */

          if (
            revealedScratchItems.size ===
              scratchCanvases.length &&
            scratchDateComplete
          ) {

            revealCompletedScratchDate(
              scratchDateComplete,
              saveTheDateAnimation
            );

          }

        }


        /* =================================================
           POINTER DOWN
        ================================================= */

        canvas.addEventListener(
          'pointerdown',
          (event) => {

            if (
              revealed
            ) {

              return;

            }


            scratching =
              true;


            canvas.setPointerCapture(
              event.pointerId
            );


            const point =
              getPosition(
                event
              );


            scratchAt(
              point.x,
              point.y
            );

          }
        );


        /* =================================================
           POINTER MOVE
        ================================================= */

        canvas.addEventListener(
          'pointermove',
          (event) => {

            if (
              !scratching ||
              revealed
            ) {

              return;

            }


            const point =
              getPosition(
                event
              );


            scratchAt(
              point.x,
              point.y
            );


            checkPercentage();

          }
        );


        /* =================================================
           POINTER UP
        ================================================= */

        canvas.addEventListener(
          'pointerup',
          (event) => {

            if (
              !scratching
            ) {

              return;

            }


            scratching =
              false;


            try {

              canvas.releasePointerCapture(
                event.pointerId
              );

            } catch {

              /*
               * Ignore if pointer capture
               * is already released.
               */

            }


            checkPercentage();

          }
        );


        /* =================================================
           POINTER CANCEL
        ================================================= */

        canvas.addEventListener(
          'pointercancel',
          () => {

            scratching =
              false;

          }
        );


        /* =================================================
           INITIAL DRAW
        ================================================= */

        setupCanvas();


        /* =================================================
           MOVING GRADIENT
        ================================================= */

        if (
          !reducedMotionQuery.matches
        ) {

          ScrollTrigger.create({
            trigger:
              '.intro-scratch-section',

            start:
              'top bottom',

            end:
              'bottom top',

            scrub:
              true,


            onUpdate:
              (self) => {

                if (
                  revealed
                ) {

                  return;

                }


                gradientShift =
                  self.progress;


                drawScratchSurface();

              },
          });

        }


        /* =================================================
           RESIZE
        ================================================= */

        window.addEventListener(
          'resize',
          () => {

            if (
              !revealed
            ) {

              setupCanvas();

            }

          }
        );

      }
    );

  }


  /* =========================================================
     SCRATCH COMPLETE
  ========================================================= */

  function revealCompletedScratchDate(
    scratchDateComplete,
    saveTheDateAnimation
  ) {

    scratchDateComplete.classList.add(
      'is-visible'
    );


    /*
     * Restart Save The Date Lottie.
     */
    if (
      saveTheDateAnimation
    ) {

      try {

        saveTheDateAnimation.stop();

        saveTheDateAnimation.seek(
          0
        );

      } catch {

        /*
         * Lottie may not be ready yet.
         */

      }

    }


    /* =====================================================
       REDUCED MOTION
    ===================================================== */

    if (
      reducedMotionQuery.matches
    ) {

      gsap.set(
        [
          scratchDateComplete,

          '.scratch-save-date-animation',

          '#scratchDateComplete > span',

          '#scratchDateComplete > small',

          '#scratchDateComplete .intro-scratch-subtext',
        ],
        {
          opacity:
            1,

          x:
            0,

          y:
            0,

          scale:
            1,
        }
      );


      try {

        saveTheDateAnimation?.play();

      } catch {

        /*
         * Ignore player errors.
         */

      }


      return;

    }


    /* =====================================================
       NORMAL REVEAL
    ===================================================== */

    const revealTimeline =
      gsap.timeline({
        defaults:
          {
            ease:
              'power3.out',
          },
      });


    revealTimeline.fromTo(
      scratchDateComplete,
      {
        opacity:
          0,

        y:
          24,
      },
      {
        opacity:
          1,

        y:
          0,

        duration:
          0.7,
      }
    );


    revealTimeline.fromTo(
      '.scratch-save-date-animation',
      {
        opacity:
          0,

        y:
          18,

        scale:
          0.92,
      },
      {
        opacity:
          1,

        y:
          0,

        scale:
          1,

        duration:
          0.9,

        ease:
          'back.out(1.25)',


        onStart:
          () => {

            try {

              saveTheDateAnimation?.play();

            } catch {

              /*
               * Ignore player errors.
               */

            }

          },
      },

      '-=0.3'
    );


    revealTimeline.fromTo(
      '#scratchDateComplete > span',
      {
        opacity:
          0,

        scale:
          0.6,
      },
      {
        opacity:
          1,

        scale:
          1,

        duration:
          0.45,

        ease:
          'back.out(1.7)',
      },

      '-=0.35'
    );


    /*
     * Supports either your newer
     * .intro-scratch-subtext or
     * the older <small>.
     */
    const scratchSubtext =
      document.querySelector(
        '#scratchDateComplete .intro-scratch-subtext'
      ) ||
      document.querySelector(
        '#scratchDateComplete > small'
      );


    if (
      scratchSubtext
    ) {

      revealTimeline.fromTo(
        scratchSubtext,
        {
          opacity:
            0,

          y:
            10,
        },
        {
          opacity:
            1,

          y:
            0,

          duration:
            0.55,
        },

        '-=0.2'
      );

    }

  }


  /* =========================================================
     LOCATION SECTION
  ========================================================= */

  function initLocationAnimations() {

    animateOnce(
      '.intro-location-heading',
      {
        y:
          25,

        duration:
          0.7,


        scrollTrigger:
          {
            trigger:
              '.intro-location-section',

            start:
              'top 82%',
          },
      }
    );


    animateOnce(
      '.intro-location-card',
      {
        y:
          70,

        scale:
          0.94,

        duration:
          1.05,


        scrollTrigger:
          {
            trigger:
              '.intro-location-section',

            start:
              'top 76%',
          },
      }
    );


    gsap.from(
      [
        '.intro-location-icon',

        '.intro-location-label',

        '.intro-location-name',

        '.intro-location-address',

        '.intro-location-divider',
      ],
      {
        opacity:
          0,

        y:
          18,

        duration:
          0.55,

        stagger:
          0.1,

        ease:
          'power2.out',


        scrollTrigger:
          {
            trigger:
              '.intro-location-card',

            start:
              'top 72%',

            once:
              true,
          },
      }
    );


    gsap.from(
      '.intro-location-detail',
      {
        opacity:
          0,

        x:
          -25,

        duration:
          0.55,

        stagger:
          0.12,

        ease:
          'power2.out',


        scrollTrigger:
          {
            trigger:
              '.intro-location-details',

            start:
              'top 82%',

            once:
              true,
          },
      }
    );


    gsap.from(
      '.intro-location-map',
      {
        opacity:
          0,

        y:
          35,

        scale:
          0.96,

        duration:
          0.8,

        ease:
          'power3.out',


        scrollTrigger:
          {
            trigger:
              '.intro-location-map',

            start:
              'top 85%',

            once:
              true,
          },
      }
    );


    gsap.from(
      '.intro-location-map-button',
      {
        opacity:
          0,

        y:
          20,

        scale:
          0.96,

        duration:
          0.65,

        ease:
          'back.out(1.4)',


        scrollTrigger:
          {
            trigger:
              '.intro-location-map-button',

            start:
              'top 90%',

            once:
              true,
          },
      }
    );

  }


  /* =========================================================
     ATTIRE SECTION
  ========================================================= */

  function initAttireAnimations() {

    animateOnce(
      '.intro-attire-heading',
      {
        y:
          25,

        duration:
          0.7,


        scrollTrigger:
          {
            trigger:
              '.intro-attire-section',

            start:
              'top 82%',
          },
      }
    );


    animateOnce(
      '.intro-attire-card',
      {
        y:
          70,

        scale:
          0.94,

        duration:
          1.05,


        scrollTrigger:
          {
            trigger:
              '.intro-attire-section',

            start:
              'top 76%',
          },
      }
    );


    gsap.from(
      [
        '.intro-attire-icon',

        '.intro-attire-eyebrow',

        '.intro-attire-title',

        '.intro-attire-description',
      ],
      {
        opacity:
          0,

        y:
          18,

        duration:
          0.55,

        stagger:
          0.1,

        ease:
          'power2.out',


        scrollTrigger:
          {
            trigger:
              '.intro-attire-card',

            start:
              'top 72%',

            once:
              true,
          },
      }
    );


    gsap.from(
      '.intro-attire-guideline',
      {
        opacity:
          0,

        y:
          25,

        scale:
          0.96,

        duration:
          0.55,

        stagger:
          0.14,

        ease:
          'power2.out',


        scrollTrigger:
          {
            trigger:
              '.intro-attire-guidelines',

            start:
              'top 84%',

            once:
              true,
          },
      }
    );


    gsap.from(
      '.intro-attire-color-option',
      {
        opacity:
          0,

        y:
          20,

        scale:
          0.75,

        duration:
          0.45,

        stagger:
          0.08,

        ease:
          'back.out(1.5)',


        scrollTrigger:
          {
            trigger:
              '.intro-attire-colors',

            start:
              'top 85%',

            once:
              true,
          },
      }
    );


    gsap.from(
      '.intro-attire-reminder',
      {
        opacity:
          0,

        y:
          22,

        scale:
          0.97,

        duration:
          0.6,

        ease:
          'power2.out',


        scrollTrigger:
          {
            trigger:
              '.intro-attire-reminder',

            start:
              'top 90%',

            once:
              true,
          },
      }
    );

  }


  /* =========================================================
     GIFT GUIDE SECTION
  ========================================================= */

  function initGiftAnimations() {

    animateOnce(
      '.intro-gift-heading',
      {
        y:
          25,

        duration:
          0.7,


        scrollTrigger:
          {
            trigger:
              '.intro-gift-section',

            start:
              'top 82%',
          },
      }
    );


    animateOnce(
      '.intro-gift-card',
      {
        y:
          70,

        scale:
          0.94,

        duration:
          1.05,


        scrollTrigger:
          {
            trigger:
              '.intro-gift-section',

            start:
              'top 76%',
          },
      }
    );


    /* =====================================================
       MAIN ICON
    ===================================================== */

    gsap.from(
      '.intro-gift-icon',
      {
        opacity:
          0,

        scale:
          0.3,

        rotation:
          -25,

        duration:
          0.65,

        ease:
          'back.out(1.8)',


        scrollTrigger:
          {
            trigger:
              '.intro-gift-card',

            start:
              'top 72%',

            once:
              true,
          },
      }
    );


    /* =====================================================
       TITLE
    ===================================================== */

    gsap.from(
      [
        '.intro-gift-label',

        '.intro-gift-title',
      ],
      {
        opacity:
          0,

        y:
          20,

        duration:
          0.55,

        stagger:
          0.12,

        ease:
          'power2.out',


        scrollTrigger:
          {
            trigger:
              '.intro-gift-card',

            start:
              'top 72%',

            once:
              true,
          },
      }
    );


    /* =====================================================
       MESSAGE
    ===================================================== */

    gsap.from(
      '.intro-gift-message p',
      {
        opacity:
          0,

        y:
          22,

        duration:
          0.6,

        stagger:
          0.15,

        ease:
          'power2.out',


        scrollTrigger:
          {
            trigger:
              '.intro-gift-message',

            start:
              'top 84%',

            once:
              true,
          },
      }
    );


    /* =====================================================
       DIVIDER
    ===================================================== */

    gsap.from(
      '.intro-gift-divider',
      {
        opacity:
          0,

        scaleX:
          0,

        transformOrigin:
          'center',

        duration:
          0.7,

        ease:
          'power3.out',


        scrollTrigger:
          {
            trigger:
              '.intro-gift-divider',

            start:
              'top 88%',

            once:
              true,
          },
      }
    );


    /* =====================================================
       THANK YOU / SIGNATURE
    ===================================================== */

    gsap.from(
      [
        '.intro-gift-thank-you',

        '.intro-gift-signature',
      ],
      {
        opacity:
          0,

        y:
          18,

        duration:
          0.55,

        stagger:
          0.15,

        ease:
          'power2.out',


        scrollTrigger:
          {
            trigger:
              '.intro-gift-thank-you',

            start:
              'top 88%',

            once:
              true,
          },
      }
    );


    /* =====================================================
       REMINDER
    ===================================================== */

    animateOnce(
      '.intro-gift-reminder',
      {
        y:
          40,

        scale:
          0.96,

        duration:
          0.8,


        scrollTrigger:
          {
            trigger:
              '.intro-gift-reminder',

            start:
              'top 90%',
          },
      }
    );

  }


/* ==========================================================
   CONTINUE TO OUR WEDDING — PAGE FLIP
========================================================== */

if (openWeddingPagesButton) {
  openWeddingPagesButton.addEventListener(
    "click",
    async () => {
      if (openWeddingPagesButton.disabled) return;

      openWeddingPagesButton.disabled = true;

      try {
        if (typeof window.startWeddingSpa !== "function") {
          throw new Error("Wedding SPA router is unavailable.");
        }

        await window.startWeddingSpa("home");
      } catch (error) {
        console.error("Unable to open Wedding Home:", error);
      } finally {
        openWeddingPagesButton.disabled = false;
      }
    }
  );
}


/* =========================================================
   BACK BUTTON RESET

   Important for browser back / BFCache.
========================================================= */

window.addEventListener(
  'pageshow',
  () => {

    if (
      openWeddingPagesButton
    ) {

      openWeddingPagesButton.disabled =
        false;


      gsap.set(
        openWeddingPagesButton,
        {
          clearProps:
            'transform',
        }
      );

    }


    /*
     * Restore sections in case the user
     * returns using the browser Back button.
     */
    gsap.set(
      [
        '.intro-rsvp-section',
        '.intro-wedding-pages-section',
      ],
      {
        autoAlpha:
          1,

        y:
          0,

        scale:
          1,

        clearProps:
          'opacity,visibility,transform',
      }
    );

  }
);

  /* =========================================================
     RSVP SECTION
  ========================================================= */

  function initRsvpAnimations() {

    animateOnce(
      '.intro-rsvp-header',
      {
        y:
          35,

        duration:
          0.8,


        scrollTrigger:
          {
            trigger:
              '.intro-rsvp-section',

            start:
              'top 80%',
          },
      }
    );


    animateOnce(
      '.intro-rsvp-search-card',
      {
        y:
          55,

        scale:
          0.96,

        duration:
          0.9,


        scrollTrigger:
          {
            trigger:
              '.intro-rsvp-search-card',

            start:
              'top 88%',
          },
      }
    );

  }




  /* =========================================================
     REDUCED MOTION
  ========================================================= */

  function showLongScrollWithoutMotion() {

    gsap.set(
      [
        '.intro-message-label',

        '.intro-message-card',

        '.intro-message-text',

        '.intro-message-closing',

        '.intro-message-signature',

        '.intro-scroll-lottie',


        '.intro-scripture-label',

        '.intro-scripture-card',

        '.intro-scripture-mark',

        '.intro-scripture-quote',

        '.intro-scripture-divider',

        '.intro-scripture-reference',


        '.intro-scratch-label',

        '.scratch-date-circles',


        '.intro-location-heading',

        '.intro-location-card',

        '.intro-location-icon',

        '.intro-location-label',

        '.intro-location-name',

        '.intro-location-address',

        '.intro-location-divider',

        '.intro-location-detail',

        '.intro-location-map',

        '.intro-location-map-button',


        '.intro-attire-heading',

        '.intro-attire-card',

        '.intro-attire-icon',

        '.intro-attire-eyebrow',

        '.intro-attire-title',

        '.intro-attire-description',

        '.intro-attire-guideline',

        '.intro-attire-color-option',

        '.intro-attire-reminder',


        '.intro-gift-heading',

        '.intro-gift-card',

        '.intro-gift-icon',

        '.intro-gift-label',

        '.intro-gift-title',

        '.intro-gift-message p',

        '.intro-gift-divider',

        '.intro-gift-thank-you',

        '.intro-gift-signature',

        '.intro-gift-reminder',


        '.intro-rsvp-header',

        '.intro-rsvp-search-card',
      ],
      {
        opacity:
          1,

        x:
          0,

        y:
          0,

        scale:
          1,

        rotation:
          0,

        rotationX:
          0,
      }
    );

  }

});