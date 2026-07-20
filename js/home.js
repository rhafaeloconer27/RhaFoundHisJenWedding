/* =========================================================
   HOME PAGE SCRIPT — SPA COMPATIBLE

   CHANGES:
   - Tinanggal ang DOMContentLoaded initialization.
   - Ginawang global function ang initializeHomePage().
   - Nililinis ang lumang intervals bago gumawa ng bago.
   - Safe kapag aalis at babalik sa Home page.
========================================================= */

let homeSlideshowTimer = null;
let homeCountdownTimer = null;
let homeVisibilityHandler = null;

/*
  Tatawagin ito ng app.js pagkatapos ma-load
  ang pages/home.html sa loob ng #app.
*/
window.initializeHomePage = function () {
  cleanupHomePage();

  initializeHeroSlideshow();
  initializeWeddingCountdown();
};

/*
  Tatawagin ito bago lumipat sa ibang page.

  Mahalaga ito para hindi manatiling tumatakbo
  ang slideshow at countdown sa background.
*/
window.cleanupHomePage = function () {
  if (homeSlideshowTimer !== null) {
    window.clearInterval(homeSlideshowTimer);
    homeSlideshowTimer = null;
  }

  if (homeCountdownTimer !== null) {
    window.clearInterval(homeCountdownTimer);
    homeCountdownTimer = null;
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
   HERO BACKGROUND SLIDESHOW
========================================================= */

function initializeHeroSlideshow() {
  const slides =
    document.querySelectorAll(".hero-slide");

  if (slides.length === 0) {
    return;
  }

  let currentSlideIndex = 0;
  const slideDuration = 5000;

  function showSlide(index) {
    slides.forEach(function (slide) {
      slide.classList.remove("active");
    });

    currentSlideIndex =
      (index + slides.length) % slides.length;

    slides[currentSlideIndex].classList.add(
      "active"
    );
  }

  function showNextSlide() {
    showSlide(currentSlideIndex + 1);
  }

  function stopSlideshow() {
    if (homeSlideshowTimer === null) {
      return;
    }

    window.clearInterval(
      homeSlideshowTimer
    );

    homeSlideshowTimer = null;
  }

  function startSlideshow() {
    stopSlideshow();

    /*
      Hindi kailangan ng timer kapag isang image lang.
    */
    if (slides.length <= 1) {
      return;
    }

    homeSlideshowTimer =
      window.setInterval(
        showNextSlide,
        slideDuration
      );
  }

  showSlide(0);
  startSlideshow();

  /*
    NEW:
    Naka-reference ang handler para matanggal
    sa cleanupHomePage().
  */
  homeVisibilityHandler = function () {
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

  /*
    February 4, 2027
    3:00 PM Philippine time
  */
  const weddingDate = new Date(
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
    /*
      Kapag wala na ang countdown elements,
      ibig sabihin umalis na sa Home page.
    */
    if (
      !document.getElementById("days") ||
      !document.getElementById("hours") ||
      !document.getElementById("minutes") ||
      !document.getElementById("seconds")
    ) {
      if (homeCountdownTimer !== null) {
        window.clearInterval(
          homeCountdownTimer
        );

        homeCountdownTimer = null;
      }

      return;
    }

    const currentTime = Date.now();

    const remainingTime =
      weddingDate - currentTime;

    if (remainingTime <= 0) {
      daysElement.textContent = "000";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";

      if (homeCountdownTimer !== null) {
        window.clearInterval(
          homeCountdownTimer
        );

        homeCountdownTimer = null;
      }

      return;
    }

    const millisecondsPerSecond = 1000;

    const millisecondsPerMinute =
      millisecondsPerSecond * 60;

    const millisecondsPerHour =
      millisecondsPerMinute * 60;

    const millisecondsPerDay =
      millisecondsPerHour * 24;

    const days = Math.floor(
      remainingTime / millisecondsPerDay
    );

    const hours = Math.floor(
      (
        remainingTime %
        millisecondsPerDay
      ) / millisecondsPerHour
    );

    const minutes = Math.floor(
      (
        remainingTime %
        millisecondsPerHour
      ) / millisecondsPerMinute
    );

    const seconds = Math.floor(
      (
        remainingTime %
        millisecondsPerMinute
      ) / millisecondsPerSecond
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

  homeCountdownTimer =
    window.setInterval(
      updateCountdown,
      1000
    );
}