/* =========================================================
   GLOBAL MUSIC — SPA COMPATIBLE

   CHANGES:
   - Isang beses lang ini-initialize.
   - Hindi na nire-recreate sa bawat SPA navigation.
   - Hindi na kailangang mag-save ng currentTime habang
     nagpapalit lang ng SPA page.
   - May localStorage pa rin para sa refresh/reopen.
========================================================= */

const MUSIC_TIME_KEY =
  "weddingMusicTime";

const MUSIC_PLAYING_KEY =
  "weddingMusicPlaying";

let bgMusic = null;
let musicButton = null;
let musicStateSaveTimer = null;
let firstInteractionHandlerAdded = false;
let globalMusicInitialized = false;

document.addEventListener(
  "DOMContentLoaded",
  initializeGlobalMusic
);

function initializeGlobalMusic() {
  /*
    Prevent duplicate initialization.
  */
  if (globalMusicInitialized) {
    return;
  }

  globalMusicInitialized = true;

  createMusicElements();

  bgMusic =
    document.getElementById("bgMusic");

  musicButton =
    document.getElementById("musicButton");

  if (!bgMusic || !musicButton) {
    return;
  }

  bgMusic.loop = true;
  bgMusic.volume = 1;

  attachMusicEvents();
  restoreMusicTime();
  updateMusicButton();

  const wasPlaying =
    localStorage.getItem(
      MUSIC_PLAYING_KEY
    ) !== "false";

  /*
    Default:
    attempt autoplay unless the user previously paused it.
  */
  if (wasPlaying) {
    attemptAutomaticPlayback();
  }
}

/* =========================================================
   CREATE PERMANENT MUSIC ELEMENTS
========================================================= */

function createMusicElements() {
  if (!document.getElementById("bgMusic")) {
    const audio =
      document.createElement("audio");

    audio.id = "bgMusic";
    audio.loop = true;
    audio.preload = "auto";

    const source =
      document.createElement("source");

    source.src =
      "music/goodnessofGod.mp3";

    source.type = "audio/mpeg";

    audio.appendChild(source);
    document.body.appendChild(audio);
  }

  if (
    !document.getElementById(
      "musicButton"
    )
  ) {
    const button =
      document.createElement("button");

    button.id = "musicButton";
    button.className = "music-button";
    button.type = "button";

    button.innerHTML =
      '<i class="fa-solid fa-volume-high" aria-hidden="true"></i>';

    button.setAttribute(
      "aria-label",
      "Pause background music"
    );

    button.setAttribute(
      "title",
      "Pause background music"
    );

    document.body.appendChild(button);
  }
}

/* =========================================================
   EVENTS
========================================================= */

function attachMusicEvents() {
  musicButton.addEventListener(
    "click",
    toggleMusic
  );

  bgMusic.addEventListener(
    "play",
    function () {
      localStorage.setItem(
        MUSIC_PLAYING_KEY,
        "true"
      );

      updateMusicButton();
    }
  );

  bgMusic.addEventListener(
    "pause",
    function () {
      localStorage.setItem(
        MUSIC_PLAYING_KEY,
        "false"
      );

      updateMusicButton();
      saveMusicTime();
    }
  );

  bgMusic.addEventListener(
    "timeupdate",
    scheduleMusicTimeSave
  );

  /*
    pagehide is more reliable than beforeunload,
    especially on mobile browsers.
  */
  window.addEventListener(
    "pagehide",
    saveMusicTime
  );

  document.addEventListener(
    "visibilitychange",
    function () {
      if (document.hidden) {
        saveMusicTime();
      }
    }
  );
}

/* =========================================================
   PLAY / PAUSE
========================================================= */

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
  } catch (error) {
    /*
      Browser blocked autoplay.
      Start after the first valid interaction.
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
}

/* =========================================================
   AUTOPLAY FALLBACK
========================================================= */

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

async function playMusicAfterFirstInteraction(
  event
) {
  firstInteractionHandlerAdded = false;

  /*
    Kapag music button ang pinindot,
    toggleMusic ang hahawak nito.
  */
  if (
    event.target instanceof Element &&
    event.target.closest("#musicButton")
  ) {
    return;
  }

  /*
    Huwag awtomatikong i-play kapag pinause
    mismo ng user noong nakaraan.
  */
  const userPausedMusic =
    localStorage.getItem(
      MUSIC_PLAYING_KEY
    ) === "false";

  if (userPausedMusic) {
    return;
  }

  await playMusic();
}

/* =========================================================
   MUSIC BUTTON STATE
========================================================= */

function updateMusicButton() {
  if (!bgMusic || !musicButton) {
    return;
  }

  const isPlaying =
    !bgMusic.paused;

  musicButton.innerHTML = isPlaying
    ? '<i class="fa-solid fa-volume-high" aria-hidden="true"></i>'
    : '<i class="fa-solid fa-volume-xmark" aria-hidden="true"></i>';

  const label = isPlaying
    ? "Pause background music"
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

/* =========================================================
   SAVE CURRENT MUSIC TIME
========================================================= */

function scheduleMusicTimeSave() {
  if (musicStateSaveTimer !== null) {
    return;
  }

  musicStateSaveTimer =
    window.setTimeout(
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

/* =========================================================
   RESTORE CURRENT MUSIC TIME
========================================================= */

function restoreMusicTime() {
  if (!bgMusic) {
    return;
  }

  try {
    const savedTime = Number(
      localStorage.getItem(
        MUSIC_TIME_KEY
      )
    );

    if (
      !Number.isFinite(savedTime) ||
      savedTime <= 0
    ) {
      return;
    }

    function applySavedTime() {
      if (
        Number.isFinite(bgMusic.duration) &&
        bgMusic.duration > 0
      ) {
        bgMusic.currentTime =
          savedTime % bgMusic.duration;
      } else {
        bgMusic.currentTime =
          savedTime;
      }
    }

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