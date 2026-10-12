/* ==========================================================
   RHAF & JEN — GLOBAL WEDDING MUSIC

   Used by:
   - index.html
   - wedding.html

   FLOW:
   1. Index loads silently.
   2. Clicking the wax seal starts music.
   3. Playback position is saved before wedding.html.
   4. wedding.html restores the same position.
   5. SPA navigation keeps the same audio element alive.
========================================================== */


/* ==========================================================
   STORAGE KEYS

   sessionStorage is intentional.

   It survives index.html -> wedding.html navigation,
   but starts fresh when a completely new browser session
   is opened.
========================================================== */

const MUSIC_TIME_KEY =
  "weddingMusicTime";

const MUSIC_PLAYING_KEY =
  "weddingMusicPlaying";

const MUSIC_STARTED_KEY =
  "weddingMusicStarted";


/* ==========================================================
   STATE
========================================================== */

let bgMusic =
  null;

let musicButton =
  null;

let musicStateSaveTimer =
  null;

let firstInteractionHandlerAdded =
  false;

let globalMusicInitialized =
  false;

let isInvitationIndex =
  false;


/* ==========================================================
   INITIALIZE
========================================================== */

document.addEventListener(
  "DOMContentLoaded",
  initializeGlobalMusic
);


async function initializeGlobalMusic() {

  if (
    globalMusicInitialized
  ) {

    return;

  }


  globalMusicInitialized =
    true;


  /*
   * Detect index.html by the wax seal.
   */
  isInvitationIndex =
    Boolean(
      document.getElementById(
        "openInvitationButton"
      )
    );


  createMusicElements();


  bgMusic =
    document.getElementById(
      "bgMusic"
    );


  musicButton =
    document.getElementById(
      "musicButton"
    );


  if (
    !bgMusic ||
    !musicButton
  ) {

    return;

  }


  bgMusic.loop =
    true;


  bgMusic.volume =
    1;


  attachMusicEvents();


  /*
   * Restore timestamp before attempting
   * to continue playback.
   */
  await restoreMusicTime();


  updateMusicButton();


  const musicStarted =
    getMusicState(
      MUSIC_STARTED_KEY
    ) === "true";


  const shouldPlay =
    getMusicState(
      MUSIC_PLAYING_KEY
    ) === "true";


  /* ========================================================
     INDEX.HTML
  ======================================================== */

  if (
    isInvitationIndex
  ) {

    /*
     * Before opening the envelope:
     * no music and no music button.
     */
    if (
      !musicStarted
    ) {

      setMusicButtonVisible(
        false
      );


      return;

    }


    /*
     * Useful if the browser restores
     * index.html using the Back button.
     */
    setMusicButtonVisible(
      true
    );


   const isInvitationIndex =
  Boolean(
    document.getElementById(
      "openInvitationButton"
    )
  );


/*
 * index.html:
 * music must start ONLY from the seal.
 */
if (
  isInvitationIndex
) {

  if (
    musicButton
  ) {

    musicButton.style.display =
      "none";

  }


  return;

}


/*
 * Direct visit to wedding.html.
 */
if (
  shouldPlay
) {

  attemptAutomaticPlayback();

}


    return;

  }


  /* ========================================================
     WEDDING.HTML
  ======================================================== */

  setMusicButtonVisible(
    true
  );


  /*
   * Only resume automatically when music
   * had already been started from the seal.
   */
  if (
    musicStarted &&
    shouldPlay
  ) {

    attemptAutomaticPlayback();

  }

}


/* ==========================================================
   CREATE AUDIO + MUSIC BUTTON
========================================================== */

function createMusicElements() {

  /* ========================================================
     AUDIO
  ======================================================== */

  if (
    !document.getElementById(
      "bgMusic"
    )
  ) {

    const audio =
      document.createElement(
        "audio"
      );


    audio.id =
      "bgMusic";


    audio.loop =
      true;


    audio.preload =
      "auto";


    const source =
      document.createElement(
        "source"
      );


    source.src =
      "music/goodnessofGod.mp3";


    source.type =
      "audio/mpeg";


    audio.appendChild(
      source
    );


    document.body.appendChild(
      audio
    );

  }


  /* ========================================================
     MUSIC BUTTON
  ======================================================== */

  if (
    !document.getElementById(
      "musicButton"
    )
  ) {

    const button =
      document.createElement(
        "button"
      );


    button.id =
      "musicButton";


    button.className =
      "music-button";


    button.type =
      "button";


    button.innerHTML = `
      <i
        class="fa-solid fa-volume-xmark"
        aria-hidden="true"
      ></i>
    `;


    button.setAttribute(
      "aria-label",
      "Play background music"
    );


    button.setAttribute(
      "title",
      "Play background music"
    );


    document.body.appendChild(
      button
    );

  }

}


/* ==========================================================
   START MUSIC FROM WAX SEAL

   IMPORTANT:
   Call this DIRECTLY inside the seal click event.
   That means audio.play() receives a genuine
   user gesture and browsers are much more likely
   to allow it.
========================================================== */

async function startWeddingMusic(
  {
    restart =
      false,
  } = {}
) {

  if (
    !bgMusic
  ) {

    return;

  }


  setMusicState(
    MUSIC_STARTED_KEY,
    "true"
  );


  setMusicState(
    MUSIC_PLAYING_KEY,
    "true"
  );


  setMusicButtonVisible(
    true
  );


  /*
   * Opening the invitation starts
   * the soundtrack from the beginning.
   */
  if (
    restart
  ) {

    try {

      bgMusic.currentTime =
        0;

    } catch {

      // Metadata may not be available yet.

    }


    setMusicState(
      MUSIC_TIME_KEY,
      "0"
    );

  }


  await playMusic();

}


/*
 * Expose to index-animation.js
 */
window.startWeddingMusic =
  startWeddingMusic;


/* ==========================================================
   EVENTS
========================================================== */

function attachMusicEvents() {

  musicButton.addEventListener(
    "click",
    toggleMusic
  );


  bgMusic.addEventListener(
    "play",
    function () {

      setMusicState(
        MUSIC_STARTED_KEY,
        "true"
      );


      setMusicState(
        MUSIC_PLAYING_KEY,
        "true"
      );


      updateMusicButton();

    }
  );


  bgMusic.addEventListener(
    "pause",
    function () {

      updateMusicButton();

      saveMusicTime();

    }
  );


  bgMusic.addEventListener(
    "timeupdate",
    scheduleMusicTimeSave
  );


  /*
   * Most important event for:
   *
   * index.html -> wedding.html
   */
  window.addEventListener(
    "pagehide",
    saveMusicTime
  );


  window.addEventListener(
    "beforeunload",
    saveMusicTime
  );


  document.addEventListener(
    "visibilitychange",
    function () {

      if (
        document.hidden
      ) {

        saveMusicTime();

      }

    }
  );

}


/* ==========================================================
   PLAY / PAUSE
========================================================== */

async function toggleMusic() {

  if (
    !bgMusic
  ) {

    return;

  }


  if (
    bgMusic.paused
  ) {

    setMusicState(
      MUSIC_STARTED_KEY,
      "true"
    );


    setMusicState(
      MUSIC_PLAYING_KEY,
      "true"
    );


    await playMusic();

  } else {

    setMusicState(
      MUSIC_PLAYING_KEY,
      "false"
    );


    pauseMusic();

  }

}


/* ==========================================================
   PLAY
========================================================== */

async function playMusic() {

  if (
    !bgMusic
  ) {

    return;

  }


  try {

    await bgMusic.play();

  } catch (error) {

    console.warn(
      "Music playback was blocked:",
      error
    );


    updateMusicButton();


    /*
     * Safari / some mobile browsers may
     * require another interaction after
     * a full document navigation.
     */
    addFirstInteractionPlayback();

  }

}

/* =========================================================
   START WEDDING MUSIC FROM SEAL

   The seal click is a real user gesture,
   so browser autoplay restrictions are avoided.
========================================================= */

window.startWeddingMusic =
  async function () {

    if (
      !bgMusic
    ) {

      return;

    }


    /*
     * Start from beginning only when
     * opening the invitation.
     */
    try {

      bgMusic.currentTime =
        0;

    } catch {

      // Metadata may still be loading.

    }


    localStorage.setItem(
      MUSIC_PLAYING_KEY,
      "true"
    );


    if (
      musicButton
    ) {

      musicButton.style.display =
        "";

    }


    await playMusic();

  };


/* ==========================================================
   PAUSE
========================================================== */

function pauseMusic() {

  if (
    !bgMusic
  ) {

    return;

  }


  bgMusic.pause();


  saveMusicTime();

}


/* ==========================================================
   TRY TO RESUME AFTER WEDDING.HTML LOADS
========================================================== */

async function attemptAutomaticPlayback() {

  if (
    !bgMusic
  ) {

    return;

  }


  try {

    await bgMusic.play();

  } catch {

    /*
     * Browser did not allow automatic
     * resume after document navigation.
     *
     * Resume on the next user interaction.
     */
    updateMusicButton();

    addFirstInteractionPlayback();

  }

}


/* ==========================================================
   AUTOPLAY FALLBACK
========================================================== */

function addFirstInteractionPlayback() {

  if (
    firstInteractionHandlerAdded
  ) {

    return;

  }


  firstInteractionHandlerAdded =
    true;


  document.addEventListener(
    "pointerdown",
    playMusicAfterFirstInteraction,
    {
      once:
        true,

      capture:
        true,
    }
  );

}


async function playMusicAfterFirstInteraction(
  event
) {

  firstInteractionHandlerAdded =
    false;


  /*
   * Let the normal music button handler
   * control button clicks.
   */
  if (
    event.target instanceof Element &&
    event.target.closest(
      "#musicButton"
    )
  ) {

    return;

  }


  const shouldPlay =
    getMusicState(
      MUSIC_PLAYING_KEY
    ) === "true";


  if (
    !shouldPlay
  ) {

    return;

  }


  await playMusic();

}


/* ==========================================================
   MUSIC BUTTON
========================================================== */

function setMusicButtonVisible(
  visible
) {

  if (
    !musicButton
  ) {

    return;

  }


  if (
    visible
  ) {

    musicButton.style.display =
      "";

  } else {

    musicButton.style.display =
      "none";

  }

}


function updateMusicButton() {

  if (
    !bgMusic ||
    !musicButton
  ) {

    return;

  }


  const isPlaying =
    !bgMusic.paused;


  musicButton.innerHTML =
    isPlaying
      ? `
        <i
          class="fa-solid fa-volume-high"
          aria-hidden="true"
        ></i>
      `
      : `
        <i
          class="fa-solid fa-volume-xmark"
          aria-hidden="true"
        ></i>
      `;


  const label =
    isPlaying
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


/* ==========================================================
   SAVE MUSIC TIME
========================================================== */

function scheduleMusicTimeSave() {

  if (
    musicStateSaveTimer !==
    null
  ) {

    return;

  }


  musicStateSaveTimer =
    window.setTimeout(
      function () {

        saveMusicTime();


        musicStateSaveTimer =
          null;

      },

      500
    );

}


function saveMusicTime() {

  if (
    !bgMusic
  ) {

    return;

  }


  const currentTime =
    Number(
      bgMusic.currentTime ||
      0
    );


  if (
    !Number.isFinite(
      currentTime
    )
  ) {

    return;

  }


  setMusicState(
    MUSIC_TIME_KEY,
    String(
      currentTime
    )
  );

}


/*
 * Expose this so index-animation.js
 * can save immediately before leaving.
 */
window.saveWeddingMusicState =
  saveMusicTime;


/* ==========================================================
   RESTORE MUSIC POSITION
========================================================== */

function restoreMusicTime() {

  if (
    !bgMusic
  ) {

    return Promise.resolve();

  }


  const savedTime =
    Number(
      getMusicState(
        MUSIC_TIME_KEY
      )
    );


  if (
    !Number.isFinite(
      savedTime
    ) ||
    savedTime <= 0
  ) {

    return Promise.resolve();

  }


  return new Promise(
    function (
      resolve
    ) {

      let resolved =
        false;


      const finish =
        () => {

          if (
            resolved
          ) {

            return;

          }


          resolved =
            true;


          resolve();

        };


      const applySavedTime =
        () => {

          try {

            if (
              Number.isFinite(
                bgMusic.duration
              ) &&
              bgMusic.duration > 0
            ) {

              bgMusic.currentTime =
                savedTime %
                bgMusic.duration;

            } else {

              bgMusic.currentTime =
                savedTime;

            }

          } catch {

            // Ignore seek failure.

          }


          finish();

        };


      if (
        bgMusic.readyState >=
        1
      ) {

        applySavedTime();

        return;

      }


      bgMusic.addEventListener(
        "loadedmetadata",
        applySavedTime,
        {
          once:
            true,
        }
      );


      /*
       * Don't block initialization forever
       * if metadata loads slowly.
       */
      window.setTimeout(
        finish,
        1500
      );

    }
  );

}


/* ==========================================================
   STORAGE HELPERS
========================================================== */

function setMusicState(
  key,
  value
) {

  try {

    sessionStorage.setItem(
      key,
      value
    );

  } catch {

    // Storage unavailable.

  }

}


function getMusicState(
  key
) {

  try {

    return sessionStorage.getItem(
      key
    );

  } catch {

    return null;

  }

}