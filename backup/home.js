/* =========================================================
   HOME PAGE — SPA COMPATIBLE

   Works with:
   .hero-slideshow
   .hero-slide
========================================================= */

let homeSlideshowInterval = null;
let homeVisibilityHandler = null;
let homeCountdownInterval = null;

/*
  Called by app.js after pages/home.html
  is inserted into #app.
*/
window.initializeHomePage = function () {
  window.cleanupHomePage();

  initializeHeroSlideshow();
  initializeWeddingCountdown();
};

/*
  Called before leaving Home.
*/
window.cleanupHomePage = function () {
  if (homeSlideshowInterval !== null) {
    window.clearInterval(
      homeSlideshowInterval
    );

    homeSlideshowInterval = null;
  }

  if (homeCountdownInterval !== null) {
    window.clearInterval(
      homeCountdownInterval
    );

    homeCountdownInterval = null;
  }

  if (homeVisibilityHandler) {
    document.removeEventListener(
      "visibilitychange",
      homeVisibilityHandler
    );

    homeVisibilityHandler = null;
  }
};

/* =========================================================
   HERO SLIDESHOW
========================================================= */

function initializeHeroSlideshow() {
  const slideshow =
    document.querySelector(
      ".hero-slideshow"
    );

  if (!slideshow) {
    return;
  }

  const slides =
    Array.from(
      slideshow.querySelectorAll(
        ".hero-slide"
      )
    );

  if (slides.length === 0) {
    return;
  }

  let currentSlideIndex = 0;

  const slideshowDelay = 5000;

  function showSlide(index) {
    currentSlideIndex =
      (index + slides.length) %
      slides.length;

    slides.forEach(
      function (slide, slideIndex) {
        slide.classList.toggle(
          "active",
          slideIndex === currentSlideIndex
        );
      }
    );
  }

  function showNextSlide() {
    showSlide(
      currentSlideIndex + 1
    );
  }

  function stopSlideshow() {
    if (
      homeSlideshowInterval === null
    ) {
      return;
    }

    window.clearInterval(
      homeSlideshowInterval
    );

    homeSlideshowInterval = null;
  }

  function startSlideshow() {
    stopSlideshow();

    if (slides.length <= 1) {
      return;
    }

    homeSlideshowInterval =
      window.setInterval(
        showNextSlide,
        slideshowDelay
      );
  }

  /*
    Ensure all images become visible after loading.
  */
  slides.forEach(function (slide) {
    const image =
      slide.querySelector("img");

    if (!image) {
      return;
    }

    function markImageLoaded() {
      image.classList.add(
        "is-loaded"
      );
    }

    if (
      image.complete &&
      image.naturalWidth > 0
    ) {
      markImageLoaded();
    } else {
      image.addEventListener(
        "load",
        markImageLoaded,
        {
          once: true,
        }
      );

      image.addEventListener(
        "error",
        markImageLoaded,
        {
          once: true,
        }
      );
    }
  });

  showSlide(0);
  startSlideshow();

  homeVisibilityHandler =
    function () {
      if (document.hidden) {
        stopSlideshow();
      } else {
        startSlideshow();
      }
    };

  document.addEventListener(
    "visibilitychange",
    homeVisibilityHandler
  );
}

/* =========================================================
   WEDDING COUNTDOWN
========================================================= */

function initializeWeddingCountdown() {
  const daysElement =
    document.getElementById("days");

  const hoursElement =
    document.getElementById("hours");

  const minutesElement =
    document.getElementById("minutes");

  const secondsElement =
    document.getElementById("seconds");

  if (
    !daysElement ||
    !hoursElement ||
    !minutesElement ||
    !secondsElement
  ) {
    return;
  }

  const weddingDate =
    new Date(
      "2027-02-04T15:00:00+08:00"
    ).getTime();

  function formatNumber(
    value,
    minimumLength
  ) {
    return String(value).padStart(
      minimumLength,
      "0"
    );
  }

  function updateCountdown() {
    if (
      !daysElement.isConnected ||
      !hoursElement.isConnected ||
      !minutesElement.isConnected ||
      !secondsElement.isConnected
    ) {
      if (
        homeCountdownInterval !== null
      ) {
        window.clearInterval(
          homeCountdownInterval
        );

        homeCountdownInterval = null;
      }

      return;
    }

    const remainingTime =
      weddingDate - Date.now();

    if (remainingTime <= 0) {
      daysElement.textContent = "000";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";

      if (
        homeCountdownInterval !== null
      ) {
        window.clearInterval(
          homeCountdownInterval
        );

        homeCountdownInterval = null;
      }

      return;
    }

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days =
      Math.floor(
        remainingTime / day
      );

    const hours =
      Math.floor(
        (remainingTime % day) / hour
      );

    const minutes =
      Math.floor(
        (remainingTime % hour) /
          minute
      );

    const seconds =
      Math.floor(
        (remainingTime % minute) /
          second
      );

    daysElement.textContent =
      formatNumber(days, 3);

    hoursElement.textContent =
      formatNumber(hours, 2);

    minutesElement.textContent =
      formatNumber(minutes, 2);

    secondsElement.textContent =
      formatNumber(seconds, 2);
  }

  updateCountdown();

  homeCountdownInterval =
    window.setInterval(
      updateCountdown,
      1000
    );
}