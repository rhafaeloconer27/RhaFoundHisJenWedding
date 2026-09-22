document.addEventListener('DOMContentLoaded', () => {
  const weddingLoader = document.getElementById('weddingLoader');
  const invitationIntro = document.getElementById('invitationIntro');
  const openInvitationButton = document.getElementById(
    'openInvitationButton'
  );

  gsap.registerPlugin(ScrollTrigger);

  document.body.classList.add('loading-active');

  /*
   * Initial loading screen
   */
  window.addEventListener('load', () => {
  if (!weddingLoader) {
    document.body.classList.remove('loading-active');
    return;
  }

  const loaderTimeline = gsap.timeline({
    delay: 2.5,

    onComplete: () => {
      gsap.set(weddingLoader, {
        display: 'none',
      });

      document.body.classList.remove('loading-active');
      ScrollTrigger.refresh();
    },
  });

  loaderTimeline
    .to('.wedding-loader-content', {
      autoAlpha: 0,
      y: -10,
      scale: 0.97,
      duration: 0.8,
      ease: 'power2.inOut',
    })
    .to(
      weddingLoader,
      {
        autoAlpha: 0,
        duration: 1.1,
        ease: 'power2.inOut',
      },
      '-=0.65'
    );
});

  /*
   * Helper function:
   * Animates an element only once when it enters the viewport.
   */
  function animateOnce(element, animationOptions = {}) {
    if (!element) {
      return;
    }

    gsap.from(element, {
      opacity: 0,
      y: 60,
      scale: 0.97,
      duration: 1,
      ease: 'power3.out',
      clearProps: 'transform',
      ...animationOptions,

      scrollTrigger: {
        trigger: element,
        start: 'top 82%',
        once: true,
        ...animationOptions.scrollTrigger,
      },
    });
  }

  /*
   * Message section
   */
  animateOnce('.intro-message-label', {
    y: 25,
    duration: 0.7,
  });

  animateOnce('.intro-message-card', {
    y: 70,
    scale: 0.94,
    duration: 1.1,
    scrollTrigger: {
      trigger: '.intro-message-section',
      start: 'top 75%',
      once: true,
    },
  });

  gsap.from('.intro-message-text', {
    opacity: 0,
    y: 25,
    duration: 0.7,
    stagger: 0.18,
    ease: 'power2.out',

    scrollTrigger: {
      trigger: '.intro-message-card',
      start: 'top 70%',
      once: true,
    },
  });

  gsap.from(
    [
      '.intro-message-closing',
      '.intro-message-signature',
      '.intro-scroll-lottie',
    ],
    {
      opacity: 0,
      y: 20,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',

      scrollTrigger: {
        trigger: '.intro-message-card',
        start: 'center 75%',
        once: true,
      },
    }
  );

  /*
   * Scripture section
   */
  animateOnce('.intro-scripture-label', {
    y: 25,
    duration: 0.7,
  });

  animateOnce('.intro-scripture-card', {
    y: 75,
    scale: 0.94,
    duration: 1.1,
    scrollTrigger: {
      trigger: '.intro-scripture-section',
      start: 'top 78%',
      once: true,
    },
  });

  gsap.from(
    [
      '.intro-scripture-mark',
      '.intro-scripture-quote',
      '.intro-scripture-divider',
      '.intro-scripture-reference',
    ],
    {
      opacity: 0,
      y: 25,
      duration: 0.8,
      stagger: 0.16,
      ease: 'power2.out',

      scrollTrigger: {
        trigger: '.intro-scripture-card',
        start: 'top 70%',
        once: true,
      },
    }
  );

  /*
 * Scratch date section
 */
animateOnce('.intro-scratch-label', {
  y: 25,
  duration: 0.7,
});

animateOnce('.scratch-date-circles', {
  y: 60,
  scale: 0.94,
  duration: 1.1,

  scrollTrigger: {
    trigger: '.intro-scratch-section',
    start: 'top 78%',
    once: true,
  },
});

  /*
 * Three-circle scratch date
 */
const scratchCanvases =
  document.querySelectorAll(
    '.scratch-circle-canvas'
  );

const scratchDateComplete =
  document.getElementById(
    'scratchDateComplete'
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
      canvas.getContext('2d');

    let scratching = false;
    let revealed = false;

    const scratchRadius = 5;

    const scratchedPoints = [];

let gradientShift = 0;


    /*
     * Draw scratch coating
     */
    function setupCanvas() {
  const rect =
    circle.getBoundingClientRect();

  const dpr =
    window.devicePixelRatio || 1;

  canvas.width =
    Math.round(
      rect.width * dpr
    );

  canvas.height =
    Math.round(
      rect.height * dpr
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

function drawScratchSurface() {
  if (revealed) {
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
   * Moving silver → dark gray gradient
   */
  const shift =
    gradientShift *
    rect.width *
    0.45;
  const gradient =
    ctx.createLinearGradient(
      -rect.width * 0.35 + shift,
      0,
      rect.width * 1.25 + shift,
      rect.height
    );

  gradient.addColorStop(
    0,
    '#f1f1f1'
  );

  gradient.addColorStop(
    0.22,
    '#d1d1d1'
  );

  gradient.addColorStop(
    0.48,
    '#a4a4a4'
  );

  gradient.addColorStop(
    0.72,
    '#707070'
  );

  gradient.addColorStop(
    1,
    '#3d3d3d'
  );

  ctx.globalCompositeOperation =
    'source-over';

  ctx.fillStyle =
    gradient;

  /*
   * Only draw the circular coating.
   */
  ctx.beginPath();

  ctx.arc(
    rect.width / 2,
    rect.height / 2,
    rect.width / 2,
    0,
    Math.PI * 2
  );

  ctx.fill();

  /*
   * Restore all scratches after
   * redrawing the moving gradient.
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
        Math.PI * 2
      );

      ctx.fill();
    }
  );

  ctx.globalCompositeOperation =
    'source-over';
}
    


   function getPosition(event) {
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


    function scratchAt(
  x,
  y
) {
  scratchedPoints.push({
    x,
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
    Math.PI * 2
  );

  ctx.fill();

  ctx.globalCompositeOperation =
    'source-over';
}


    /*
     * Calculate scratched area
     */
    function checkPercentage() {
  if (revealed) {
    return;
  }

  const image = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const dpr =
    window.devicePixelRatio || 1;

  const centerX =
    canvas.width / 2;

  const centerY =
    canvas.height / 2;

  const radius =
    canvas.width / 2;

  let cleared = 0;
  let checked = 0;

  const step = 8 * dpr;

  for (
    let y = 0;
    y < canvas.height;
    y += step
  ) {
    for (
      let x = 0;
      x < canvas.width;
      x += step
    ) {
      const dx =
        x - centerX;

      const dy =
        y - centerY;

      /*
       * Ignore pixels outside
       * the circular scratch area.
       */
      if (
        dx * dx + dy * dy >
        radius * radius
      ) {
        continue;
      }

      const index =
        (
          Math.floor(y) *
          canvas.width +
          Math.floor(x)
        ) * 4 + 3;

      checked++;

      if (
        image.data[index] <
        40
      ) {
        cleared++;
      }
    }
  }

  if (!checked) {
    return;
  }

  const percentage =
    cleared / checked;

  if (
    percentage >= 0.4
  ) {
    revealCircle();
  }
}


    /*
     * Reveal this specific circle
     */
    function revealCircle() {

      if (revealed) {
        return;
      }

      revealed = true;
      scratching = false;

      revealedScratchItems.add(
        scratchId
      );

      gsap.to(
        canvas,
        {
          opacity: 0,
          scale: 1.08,

          duration: 0.65,

          ease:
            'power2.out',

          onComplete: () => {

            canvas.style
              .pointerEvents =
              'none';
          },
        }
      );


      /*
       * Small reveal animation
       */
      const value =
        circle.querySelector(
          '.scratch-circle-value'
        );

      if (value) {

        gsap.from(
          value,
          {
            opacity: 0,
            scale: 0.65,

            duration: 0.75,

            ease:
              'back.out(1.8)',
          }
        );
      }


      /*
       * All three revealed
       */
      if (
        revealedScratchItems.size ===
        scratchCanvases.length
      ) {

        scratchDateComplete
          ?.classList.add(
            'is-visible'
          );

        gsap.from(
          scratchDateComplete,
          {
            opacity: 0,
            y: 18,

            duration: 0.9,

            ease:
              'power3.out',
          }
        );
      }
    }


    canvas.addEventListener(
      'pointerdown',
      (event) => {

        if (revealed) {
          return;
        }

        scratching = true;

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


    canvas.addEventListener(
  'pointermove',
  (event) => {
    if (!scratching || revealed) {
      return;
    }

    const point = getPosition(event);

    scratchAt(
      point.x,
      point.y
    );

    checkPercentage();
  }
);

    canvas.addEventListener(
      'pointerup',
      (event) => {

        if (!scratching) {
          return;
        }

        scratching = false;

        try {

          canvas.releasePointerCapture(
            event.pointerId
          );

        } catch {
          // ignore
        }

        checkPercentage();
      }
    );


    canvas.addEventListener(
      'pointercancel',
      () => {
        scratching = false;
      }
    );


    setupCanvas();

    ScrollTrigger.create({
  trigger:
    '.intro-scratch-section',

  start:
    'top bottom',

  end:
    'bottom top',

  scrub: true,

  onUpdate: (self) => {
    if (revealed) {
      return;
    }

    gradientShift =
      self.progress;

    drawScratchSurface();
  },
});


    window.addEventListener(
      'resize',
      () => {

        if (!revealed) {
          setupCanvas();
        }

      }
    );

  }
);

  /*
   * Invitation cover section
   */
  animateOnce('.intro-cover-section .intro-label', {
    y: 25,
    duration: 0.7,
  });

  animateOnce('.invitation-cover', {
    y: 90,
    scale: 0.9,
    rotationX: 8,
    transformOrigin: 'center bottom',
    duration: 1.2,
    ease: 'power3.out',

    scrollTrigger: {
      trigger: '.intro-cover-section',
      start: 'top 75%',
      once: true,
    },
  });

  animateOnce('.intro-open-note', {
    y: 20,
    duration: 0.7,

    scrollTrigger: {
      trigger: '.invitation-cover',
      start: 'center 70%',
      once: true,
    },
  });

  /*
   * Open invitation animation
   */
  /*
 * Open invitation animation
 */
if (openInvitationButton) {
  openInvitationButton.addEventListener(
    'click',
    () => {
      openInvitationButton.disabled = true;

      /*
       * Stop the CSS floating animation before GSAP
       * controls the seal transform.
       */
      gsap.set(openInvitationButton, {
        animation: 'none',
      });

      const openTimeline = gsap.timeline({
        onComplete: () => {
          window.location.href = 'wedding.html?page=home';
        },
      });

      openTimeline
        .to(openInvitationButton, {
          scale: 1.15,
          rotation: -8,
          duration: 0.25,
          ease: 'power2.out',
        })
        .to(openInvitationButton, {
          scale: 0,
          rotation: 25,
          opacity: 0,
          duration: 0.45,
          ease: 'back.in(1.8)',
        })
        .to(
          '.cover-title',
          {
            opacity: 0,
            y: -25,
            duration: 0.45,
            ease: 'power2.in',
          },
          '-=0.35'
        )
        .to(
          '.cover-panel-left',
          {
            xPercent: -105,
            rotationY: -12,
            duration: 1.2,
            ease: 'power3.inOut',
          },
          '-=0.05'
        )
        .to(
          '.cover-panel-right',
          {
            xPercent: 105,
            rotationY: 12,
            duration: 1.2,
            ease: 'power3.inOut',
          },
          '<'
        )
        .from(
          '.reveal-small',
          {
            opacity: 0,
            y: 15,
            duration: 0.5,
          },
          '-=0.55'
        )
        .from(
          '.reveal-content h1',
          {
            opacity: 0,
            y: 30,
            scale: 0.9,
            duration: 0.8,
            ease: 'back.out(1.4)',
          },
          '-=0.3'
        )
        .from(
          [
            '.reveal-invites',
            '.reveal-date',
            '.reveal-content .reveal-divider',
          ],
          {
            opacity: 0,
            y: 15,
            duration: 0.55,
            stagger: 0.12,
            ease: 'power2.out',
          },
          '-=0.35'
        )
        .to({}, {
          duration: 1,
        });
    },
    {
      once: true,
    }
  );
}

  /*
   * Disable animations for users who prefer reduced motion.
   */
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  if (reducedMotion.matches) {
    ScrollTrigger.getAll().forEach((trigger) => {
      trigger.kill();
    });

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
    '.scratch-date-complete',

    '.intro-cover-section .intro-label',
    '.invitation-cover',
    '.intro-open-note',
  ],
  {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    rotationX: 0,
  }
);
  }
});