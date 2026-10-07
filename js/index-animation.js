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

      canvas.getContext('2d');

    let scratching = false;

    let revealed = false;

    const scratchRadius = 20;

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

    percentage >= 0.6

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
        revealedScratchItems.size === scratchCanvases.length &&
        scratchDateComplete
      ) {
        scratchDateComplete.classList.add('is-visible');

        if (saveTheDateAnimation) {
          saveTheDateAnimation.stop();
          saveTheDateAnimation.seek(0);
        }

        const revealTimeline = gsap.timeline({
          defaults: {
            ease: 'power3.out',
          },
        });

        revealTimeline.fromTo(
          scratchDateComplete,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7 }
        );

        revealTimeline.fromTo(
          '.scratch-save-date-animation',
          { opacity: 0, y: 18, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'back.out(1.25)',
            onStart: () => saveTheDateAnimation?.play(),
          },
          '-=0.3'
        );

        revealTimeline.fromTo(
          '#scratchDateComplete > span',
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.7)' },
          '-=0.35'
        );

        revealTimeline.fromTo(
          '#scratchDateComplete > small',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.55 },
          '-=0.2'
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

  /* =========================================================

   LOCATION SECTION

========================================================= */

animateOnce(

  ".intro-location-heading",

  {

    y: 25,

    duration: 0.7,

    scrollTrigger: {

      trigger:

        ".intro-location-section",

      start:

        "top 82%",

      once: true,

    },

  }

);

animateOnce(

  ".intro-location-card",

  {

    y: 70,

    scale: 0.94,

    duration: 1.05,

    scrollTrigger: {

      trigger:

        ".intro-location-section",

      start:

        "top 76%",

      once: true,

    },

  }

);

gsap.from(

  [

    ".intro-location-icon",

    ".intro-location-label",

    ".intro-location-name",

    ".intro-location-address",

    ".intro-location-divider",

  ],

  {

    opacity: 0,

    y: 18,

    duration: 0.55,

    stagger: 0.1,

    ease:

      "power2.out",

    scrollTrigger: {

      trigger:

        ".intro-location-card",

      start:

        "top 72%",

      once: true,

    },

  }

);

gsap.from(

  ".intro-location-detail",

  {

    opacity: 0,

    x: -25,

    duration: 0.55,

    stagger: 0.12,

    ease:

      "power2.out",

    scrollTrigger: {

      trigger:

        ".intro-location-details",

      start:

        "top 82%",

      once: true,

    },

  }

);

gsap.from(

  ".intro-location-map",

  {

    opacity: 0,

    y: 35,

    scale: 0.96,

    duration: 0.8,

    ease:

      "power3.out",

    scrollTrigger: {

      trigger:

        ".intro-location-map",

      start:

        "top 85%",

      once: true,

    },

  }

);

gsap.from(

  ".intro-location-map-button",

  {

    opacity: 0,

    y: 20,

    scale: 0.96,

    duration: 0.65,

    ease:

      "back.out(1.4)",

    scrollTrigger: {

      trigger:

        ".intro-location-map-button",

      start:

        "top 90%",

      once: true,

    },

  }

);

/* =========================================================

   GUEST ATTIRE SECTION

========================================================= */

animateOnce(

  ".intro-attire-heading",

  {

    y: 25,

    duration: 0.7,

    scrollTrigger: {

      trigger:

        ".intro-attire-section",

      start:

        "top 82%",

      once: true,

    },

  }

);

animateOnce(

  ".intro-attire-card",

  {

    y: 70,

    scale: 0.94,

    duration: 1.05,

    scrollTrigger: {

      trigger:

        ".intro-attire-section",

      start:

        "top 76%",

      once: true,

    },

  }

);

gsap.from(

  [

    ".intro-attire-icon",

    ".intro-attire-eyebrow",

    ".intro-attire-title",

    ".intro-attire-description",

  ],

  {

    opacity: 0,

    y: 18,

    duration: 0.55,

    stagger: 0.1,

    ease:

      "power2.out",

    scrollTrigger: {

      trigger:

        ".intro-attire-card",

      start:

        "top 72%",

      once: true,

    },

  }

);

gsap.from(

  ".intro-attire-guideline",

  {

    opacity: 0,

    y: 25,

    scale: 0.96,

    duration: 0.55,

    stagger: 0.14,

    ease:

      "power2.out",

    scrollTrigger: {

      trigger:

        ".intro-attire-guidelines",

      start:

        "top 84%",

      once: true,

    },

  }

);

gsap.from(

  ".intro-attire-color-option",

  {

    opacity: 0,

    y: 20,

    scale: 0.75,

    duration: 0.45,

    stagger: 0.08,

    ease:

      "back.out(1.5)",

    scrollTrigger: {

      trigger:

        ".intro-attire-colors",

      start:

        "top 85%",

      once: true,

    },

  }

);

gsap.from(

  ".intro-attire-reminder",

  {

    opacity: 0,

    y: 22,

    scale: 0.97,

    duration: 0.6,

    ease:

      "power2.out",

    scrollTrigger: {

      trigger:

        ".intro-attire-reminder",

      start:

        "top 90%",

      once: true,

    },

  }

);

/* =========================================================

   GIFT GUIDE SECTION

========================================================= */

animateOnce(

  ".intro-gift-heading",

  {

    y: 25,

    duration: 0.7,

    scrollTrigger: {

      trigger:

        ".intro-gift-section",

      start:

        "top 82%",

      once: true,

    },

  }

);

animateOnce(

  ".intro-gift-card",

  {

    y: 70,

    scale: 0.94,

    duration: 1.05,

    scrollTrigger: {

      trigger:

        ".intro-gift-section",

      start:

        "top 76%",

      once: true,

    },

  }

);

/* MAIN ICON */

gsap.from(

  ".intro-gift-icon",

  {

    opacity: 0,

    scale: 0.3,

    rotation: -25,

    duration: 0.65,

    ease:

      "back.out(1.8)",

    scrollTrigger: {

      trigger:

        ".intro-gift-card",

      start:

        "top 72%",

      once: true,

    },

  }

);

/* TITLE */

gsap.from(

  [

    ".intro-gift-label",

    ".intro-gift-title",

  ],

  {

    opacity: 0,

    y: 20,

    duration: 0.55,

    stagger: 0.12,

    ease:

      "power2.out",

    scrollTrigger: {

      trigger:

        ".intro-gift-card",

      start:

        "top 72%",

      once: true,

    },

  }

);

/* MESSAGE PARAGRAPHS */

gsap.from(

  ".intro-gift-message p",

  {

    opacity: 0,

    y: 22,

    duration: 0.6,

    stagger: 0.15,

    ease:

      "power2.out",

    scrollTrigger: {

      trigger:

        ".intro-gift-message",

      start:

        "top 84%",

      once: true,

    },

  }

);

/* DIVIDER */

gsap.from(

  ".intro-gift-divider",

  {

    opacity: 0,

    scaleX: 0,

    transformOrigin:

      "center",

    duration: 0.7,

    ease:

      "power3.out",

    scrollTrigger: {

      trigger:

        ".intro-gift-divider",

      start:

        "top 88%",

      once: true,

    },

  }

);

/* THANK YOU / SIGNATURE */

gsap.from(

  [

    ".intro-gift-thank-you",

    ".intro-gift-signature",

  ],

  {

    opacity: 0,

    y: 18,

    duration: 0.55,

    stagger: 0.15,

    ease:

      "power2.out",

    scrollTrigger: {

      trigger:

        ".intro-gift-thank-you",

      start:

        "top 88%",

      once: true,

    },

  }

);

/* REMINDER CARD */

animateOnce(

  ".intro-gift-reminder",

  {

    y: 40,

    scale: 0.96,

    duration: 0.8,

    scrollTrigger: {

      trigger:

        ".intro-gift-reminder",

      start:

        "top 90%",

      once: true,

    },

  }

);

/* =========================================================

   RSVP SECTION

========================================================= */

animateOnce(

  ".intro-rsvp-header",

  {

    y: 35,

    duration: 0.8,

    scrollTrigger: {

      trigger:

        ".intro-rsvp-section",

      start:

        "top 80%",

      once: true,

    },

  }

);

animateOnce(

  ".intro-rsvp-search-card",

  {

    y: 55,

    scale: 0.96,

    duration: 0.9,

    scrollTrigger: {

      trigger:

        ".intro-rsvp-search-card",

      start:

        "top 88%",

      once: true,

    },

  }

);

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
