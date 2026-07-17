document.addEventListener("DOMContentLoaded", function () {
  initializeCommonNavigation();
  initializeBackgroundMusic();
});

function initializeCommonNavigation() {
  const currentPage = document.body.dataset.currentPage;
  const navigationItems = document.querySelectorAll(".nav-item");

  navigationItems.forEach(function (item) {
    if (item.dataset.page === currentPage) {
      item.classList.add("active");
    }
  });
}

let bgMusic = null;

function initializeBackgroundMusic() {
  bgMusic = document.getElementById("bgMusic");

  const musicButton = document.getElementById("musicButton");

  if (!bgMusic || !musicButton) {
    return;
  }

  musicButton.addEventListener("click", function () {
    if (bgMusic.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });
}

function playMusic() {
  if (!bgMusic) {
    return;
  }

  bgMusic
    .play()
    .then(function () {
      const musicButton = document.getElementById("musicButton");

      if (musicButton) {
        musicButton.textContent = "🔊";
        musicButton.setAttribute("aria-label", "Pause background music");
      }
    })
    .catch(function (error) {
      console.error("Unable to play background music:", error);
    });
}

function pauseMusic() {
  if (!bgMusic) {
    return;
  }

  bgMusic.pause();

  const musicButton = document.getElementById("musicButton");

  if (musicButton) {
    musicButton.textContent = "🔇";
    musicButton.setAttribute("aria-label", "Play background music");
  }
}
