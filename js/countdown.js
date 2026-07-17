const WEDDING_DATE = new Date("2027-02-04T15:00:00+08:00");

document.addEventListener("DOMContentLoaded", initializeCountdown);

function initializeCountdown() {
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const currentDate = new Date();
  const difference = WEDDING_DATE.getTime() - currentDate.getTime();

  if (difference <= 0) {
    showWeddingDay();
    return;
  }

  const countdown = calculateCountdown(difference);

  updateElement("days", countdown.days, 3);
  updateElement("hours", countdown.hours, 2);
  updateElement("minutes", countdown.minutes, 2);
  updateElement("seconds", countdown.seconds, 2);
}

function calculateCountdown(difference) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(difference / day),
    hours: Math.floor((difference % day) / hour),
    minutes: Math.floor((difference % hour) / minute),
    seconds: Math.floor((difference % minute) / second)
  };
}

function updateElement(elementId, value, length) {
  const element = document.getElementById(elementId);

  if (!element) {
    return;
  }

  element.textContent = String(value).padStart(length, "0");
}

function showWeddingDay() {
  updateElement("days", 0, 3);
  updateElement("hours", 0, 2);
  updateElement("minutes", 0, 2);
  updateElement("seconds", 0, 2);

  const message = document.getElementById("countdownMessage");

  if (message) {
    message.textContent = "Today is our wedding day!";
  }
}
