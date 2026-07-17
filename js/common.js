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
let musicButton = null;

function initializeBackgroundMusic() {
  bgMusic = document.getElementById("bgMusic");
  musicButton = document.getElementById("musicButton");

  if (!bgMusic || !musicButton) {
    return;
  }

  bgMusic.loop = true;
  bgMusic.volume = 0.5;

  restoreMusicState();
  updateMusicButton();

  bgMusic.play().catch(function () {
    document.addEventListener(
      "click",
      function playMusicAfterFirstInteraction(event) {
        if (event.target.closest("#musicButton")) {
          return;
        }

        playMusic();
      },
      { once: true }
    );
  });

  musicButton.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (bgMusic.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });

  bgMusic.addEventListener("play", function () {
    updateMusicButton();
    saveMusicState();
  });

  bgMusic.addEventListener("pause", function () {
    updateMusicButton();
    saveMusicState();
  });

  bgMusic.addEventListener("timeupdate", function () {
    saveMusicState();
  });

  window.addEventListener("beforeunload", function () {
    saveMusicState();
  });
}

function playMusic() {
  if (!bgMusic) {
    return;
  }

  bgMusic
    .play()
    .then(function () {
      updateMusicButton();
      saveMusicState();
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
  updateMusicButton();
  saveMusicState();
}

function updateMusicButton() {
  if (!bgMusic || !musicButton) {
    return;
  }

  if (bgMusic.paused) {
    musicButton.textContent = "🔇";
    musicButton.setAttribute(
      "aria-label",
      "Play background music"
    );
    musicButton.setAttribute(
      "title",
      "Play background music"
    );
  } else {
    musicButton.textContent = "🔊";
    musicButton.setAttribute(
      "aria-label",
      "Pause background music"
    );
    musicButton.setAttribute(
      "title",
      "Pause background music"
    );
  }
}

function saveMusicState() {
  if (!bgMusic) {
    return;
  }

  localStorage.setItem(
    "weddingMusicTime",
    String(bgMusic.currentTime || 0)
  );

  localStorage.setItem(
    "weddingMusicPaused",
    String(bgMusic.paused)
  );
}

function restoreMusicState() {
  if (!bgMusic) {
    return;
  }

  const savedTime = Number(
    localStorage.getItem("weddingMusicTime")
  );

  const savedPaused =
    localStorage.getItem("weddingMusicPaused");

  if (Number.isFinite(savedTime) && savedTime > 0) {
    bgMusic.currentTime = savedTime;
  }

  if (savedPaused === "true") {
    bgMusic.pause();
  }
}
