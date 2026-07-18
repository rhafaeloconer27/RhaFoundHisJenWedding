const MUSIC_TIME_KEY = "weddingMusicTime";

let bgMusic = null;
let musicButton = null;
let musicStateSaveTimer = null;
let firstInteractionHandlerAdded = false;

document.addEventListener(
  "DOMContentLoaded",
  initializeGlobalMusic
);

function initializeGlobalMusic() {
  createMusicElements();

  bgMusic = document.getElementById("bgMusic");
  musicButton = document.getElementById("musicButton");

  if (!bgMusic || !musicButton) {
    return;
  }

  bgMusic.loop = true;
  bgMusic.volume = 1.0;

  attachMusicEvents();
  restoreMusicTime();

  /*
    Default behavior:
    laging attempt mag-play sa bawat page load/reload.
  */
  attemptAutomaticPlayback();
}

/* =========================================
   CREATE MUSIC ELEMENTS
========================================= */

function createMusicElements() {
  if (!document.getElementById("bgMusic")) {
    const audio = document.createElement("audio");

    audio.id = "bgMusic";
    audio.loop = true;
    audio.preload = "auto";

    const source = document.createElement("source");

    source.src = "music/goodnessofGod.mp3";
    source.type = "audio/mpeg";

    audio.appendChild(source);
    document.body.appendChild(audio);
  }

  if (!document.getElementById("musicButton")) {
    const button = document.createElement("button");

    button.id = "musicButton";
    button.className = "music-button";
    button.type = "button";

    /*
      Initial visual state ay playing,
      dahil default natin ay mag-autoplay.
    */
    button.innerHTML =
  '<i class="fa-solid fa-volume-high"></i>';

    button.setAttribute(
      "aria-label",
      "Mute background music"
    );

    button.setAttribute(
      "title",
      "Mute background music"
    );

    document.body.appendChild(button);
  }
}

/* =========================================
   EVENTS
========================================= */

function attachMusicEvents() {
  musicButton.addEventListener(
    "click",
    toggleMusic
  );

  bgMusic.addEventListener(
    "play",
    updateMusicButton
  );

  bgMusic.addEventListener(
    "pause",
    updateMusicButton
  );

  bgMusic.addEventListener(
    "timeupdate",
    scheduleMusicTimeSave
  );

  window.addEventListener(
    "beforeunload",
    saveMusicTime
  );

  document.addEventListener(
    "visibilitychange",
    function () {
      saveMusicTime();
    }
  );
}

/* =========================================
   PLAY / PAUSE
========================================= */

async function toggleMusic() {
  if (!bgMusic) {
    return;
  }

  if (bgMusic.paused) {
    await playMusic();
  } else {
    pauseMusic();
  }
}

async function attemptAutomaticPlayback() {
  if (!bgMusic) {
    return;
  }

  try {
    await bgMusic.play();

    updateMusicButton();
  } catch (error) {
    /*
      Kapag binlock ng browser ang autoplay,
      tutugtog ito sa unang click/tap ng user.
    */
    updateMusicButton();
    addFirstInteractionPlayback();
  }
}

async function playMusic() {
  if (!bgMusic) {
    return;
  }

  try {
    await bgMusic.play();

    updateMusicButton();
  } catch (error) {
    console.warn(
      "Music playback was blocked:",
      error
    );

    addFirstInteractionPlayback();
  }
}

function pauseMusic() {
  if (!bgMusic) {
    return;
  }

  bgMusic.pause();
  updateMusicButton();
}

/* =========================================
   AUTOPLAY FALLBACK
========================================= */

function addFirstInteractionPlayback() {
  if (firstInteractionHandlerAdded) {
    return;
  }

  firstInteractionHandlerAdded = true;

  document.addEventListener(
    "pointerdown",
    playMusicAfterFirstInteraction,
    {
      once: true,
      capture: true,
    }
  );
}

async function playMusicAfterFirstInteraction(event) {
  firstInteractionHandlerAdded = false;

  /*
    Kapag music button mismo ang pinindot,
    toggleMusic ang bahala.
  */
  if (
    event.target instanceof Element &&
    event.target.closest("#musicButton")
  ) {
    return;
  }

  await playMusic();
}

/* =========================================
   BUTTON STATE
========================================= */

function updateMusicButton() {
  if (!bgMusic || !musicButton) {
    return;
  }

  const isPlaying =
    !bgMusic.paused;

  musicButton.innerHTML = isPlaying
    ? '<i class="fa-solid fa-volume-high"></i>'
    : '<i class="fa-solid fa-volume-xmark"></i>';

  const label = isPlaying
    ? "Mute background music"
    : "Play background music";

  musicButton.setAttribute(
    "aria-label",
    label
  );

  musicButton.setAttribute(
    "title",
    label
  );

  musicButton.classList.toggle(
    "playing",
    isPlaying
  );
}

/* =========================================
   SAVE CURRENT MUSIC TIME
========================================= */

function scheduleMusicTimeSave() {
  if (musicStateSaveTimer !== null) {
    return;
  }

  musicStateSaveTimer = window.setTimeout(
    function () {
      saveMusicTime();
      musicStateSaveTimer = null;
    },
    1000
  );
}

function saveMusicTime() {
  if (!bgMusic) {
    return;
  }

  try {
    localStorage.setItem(
      MUSIC_TIME_KEY,
      String(bgMusic.currentTime || 0)
    );
  } catch (error) {
    console.warn(
      "Unable to save music time:",
      error
    );
  }
}

/* =========================================
   RESTORE CURRENT MUSIC TIME
========================================= */

function restoreMusicTime() {
  if (!bgMusic) {
    return;
  }

  try {
    const savedTime = Number(
      localStorage.getItem(MUSIC_TIME_KEY)
    );

    if (
      !Number.isFinite(savedTime) ||
      savedTime <= 0
    ) {
      return;
    }

    const applySavedTime = function () {
      if (
        Number.isFinite(bgMusic.duration) &&
        bgMusic.duration > 0
      ) {
        bgMusic.currentTime =
          savedTime % bgMusic.duration;
      } else {
        bgMusic.currentTime = savedTime;
      }
    };

    if (bgMusic.readyState >= 1) {
      applySavedTime();
    } else {
      bgMusic.addEventListener(
        "loadedmetadata",
        applySavedTime,
        {
          once: true,
        }
      );
    }
  } catch (error) {
    console.warn(
      "Unable to restore music time:",
      error
    );
  }
}
