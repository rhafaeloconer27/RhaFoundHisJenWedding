document.addEventListener("DOMContentLoaded", function () {
  initializeHeroSlideshow();
  initializeWeddingCountdown();
});

/* =========================================
   HERO BACKGROUND SLIDESHOW
========================================= */

function initializeHeroSlideshow() {
  const slides =
    document.querySelectorAll(".hero-slide");

  if (slides.length <= 1) {
    return;
  }

  let currentSlideIndex = 0;
  let slideshowTimer = null;

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

  function startSlideshow() {
    stopSlideshow();

    slideshowTimer = window.setInterval(
      showNextSlide,
      slideDuration
    );
  }

  function stopSlideshow() {
    if (slideshowTimer === null) {
      return;
    }

    window.clearInterval(slideshowTimer);
    slideshowTimer = null;
  }

  showSlide(0);
  startSlideshow();

  document.addEventListener(
    "visibilitychange",
    function () {
      if (document.hidden) {
        stopSlideshow();
      } else {
        startSlideshow();
      }
    }
  );
}

/* =========================================
   WEDDING COUNTDOWN
========================================= */

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

  let countdownTimer = null;

  function formatNumber(value, minimumLength) {
    return String(value).padStart(
      minimumLength,
      "0"
    );
  }

  function updateCountdown() {
    const currentTime = Date.now();
    const remainingTime =
      weddingDate - currentTime;

    if (remainingTime <= 0) {
      daysElement.textContent = "000";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";

      if (countdownTimer !== null) {
        window.clearInterval(countdownTimer);
        countdownTimer = null;
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

  countdownTimer = window.setInterval(
    updateCountdown,
    1000
  );
}
