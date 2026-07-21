/* ==========================================================
   SINGLE PAGE APPLICATION NAVIGATION

   PURPOSE:
   - Load page partials without refreshing wedding.html
   - Keep the background music playing
   - Show the loader until important assets are ready
   - Animate page content after every page transition
========================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const app =
      document.getElementById("app");

    const pageLoader =
      document.getElementById(
        "pageTransitionLoader"
      );

    const pageLoaderMessage =
      document.getElementById(
        "pageLoaderMessage"
      );

    /* ======================================================
       PAGE CONFIGURATION

       The keys here must match the data-page values
       used in common.js.
    ====================================================== */

    const pages = {
      home: {
        file: "pages/home.html",
        title: "Home | Rhaf & Jen",
      },

      sponsors: {
        file: "pages/sponsors.html",
        title: "Sponsors | Rhaf & Jen",
      },

      location: {
        file: "pages/location.html",
        title: "Location | Rhaf & Jen",
      },

      rsvp: {
        file: "pages/rsvp.html",
        title: "RSVP | Rhaf & Jen",
      },

      attire: {
        file: "pages/attire.html",
        title: "Theme & Attire | Rhaf & Jen",
      },

      gift: {
        file: "pages/gift-guide.html",
        title: "Gift Guide | Rhaf & Jen",
      },

      faq: {
        file: "pages/faq.html",
        title: "FAQ | Rhaf & Jen",
      },

      contact: {
        file: "pages/contact.html",
        title: "Contact | Rhaf & Jen",
      },

      prenup: {
        file: "pages/prenup.html",
        title: "Prenup | Rhaf & Jen",
      },
    };

    let currentPage = null;
    let navigationInProgress = false;
    let initialLoadCompleted = false;

    if (!app) {
      console.error(
        'SPA initialization failed: "#app" was not found.'
      );

      return;
    }

    /* ======================================================
       LOADER
    ====================================================== */

    function setLoaderMessage(message) {
      if (!pageLoaderMessage) {
        return;
      }

      pageLoaderMessage.textContent =
        message;
    }

    function showLoader(
      message = "Loading..."
    ) {
      setLoaderMessage(message);

      app.setAttribute(
        "aria-busy",
        "true"
      );

      if (!pageLoader) {
        return;
      }

      pageLoader.classList.add(
        "is-visible"
      );

      pageLoader.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.classList.add(
        "page-transition-active"
      );
    }

    function hideLoader() {
      if (!pageLoader) {
        return;
      }

      pageLoader.classList.remove(
        "is-visible"
      );

      pageLoader.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.classList.remove(
        "page-transition-active"
      );
    }

    /* ======================================================
       IMAGE WAITING

       Wait for a specific image to finish loading.

       A timeout is included so the page will not remain
       stuck on the loader when an image fails to load.
    ====================================================== */

    function waitForImage(
      image,
      timeout = 10000
    ) {
      return new Promise(function (resolve) {
        if (!image) {
          resolve();

          return;
        }

        if (
          image.complete &&
          image.naturalWidth > 0
        ) {
          image.classList.add(
            "is-loaded"
          );

          resolve();

          return;
        }

        let completed = false;
        let timeoutId = null;

        function finish() {
          if (completed) {
            return;
          }

          completed = true;

          if (timeoutId !== null) {
            window.clearTimeout(
              timeoutId
            );
          }

          image.classList.add(
            "is-loaded"
          );

          image.removeEventListener(
            "load",
            finish
          );

          image.removeEventListener(
            "error",
            finish
          );

          resolve();
        }

        image.addEventListener(
          "load",
          finish,
          {
            once: true,
          }
        );

        image.addEventListener(
          "error",
          finish,
          {
            once: true,
          }
        );

        timeoutId =
          window.setTimeout(
            finish,
            timeout
          );
      });
    }

    /*
      Marks the remaining Home slideshow images
      as visible once each image finishes loading.
    */

    function markRemainingImagesWhenLoaded() {
      const images =
        document.querySelectorAll(
          ".hero-slide img"
        );

      images.forEach(function (image) {
        if (
          image.complete &&
          image.naturalWidth > 0
        ) {
          image.classList.add(
            "is-loaded"
          );

          return;
        }

        image.addEventListener(
          "load",
          function () {
            image.classList.add(
              "is-loaded"
            );
          },
          {
            once: true,
          }
        );

        /*
          Avoid permanently hiding a broken image.
        */

        image.addEventListener(
          "error",
          function () {
            image.classList.add(
              "is-loaded"
            );
          },
          {
            once: true,
          }
        );
      });
    }

    /*
      Wait for important page assets.

      Currently, Home waits for the first slideshow image.
      Other pages can be added here later when necessary.
    */

    async function waitForPageAssets(
      pageName
    ) {
      if (pageName !== "home") {
        return;
      }

      setLoaderMessage(
        "Preparing your photos..."
      );

      const firstHomeImage =
        document.querySelector(
          ".hero-slide.active img"
        ) ||
        document.querySelector(
          ".hero-slide img"
        );

      await waitForImage(
        firstHomeImage
      );

      markRemainingImagesWhenLoaded();
    }

    /* ======================================================
       PAGE CONTENT ANIMATION

       Runs every time a page partial is loaded.
    ====================================================== */

    function getAnimatedPageElements() {
      const selectors = [
        /*
          Home page
        */
        ".hero-content",
        ".hero-countdown",

        /*
          Shared page hero
        */
        ".page-hero-content",

        /*
          General content sections
        */
        ".content-section > *",

        /*
          Page-specific containers
        */
        ".sponsors-section > *",
        ".location-section > *",
        ".rsvp-section > *",
        ".attire-section > *",
        ".attire-poster > *",
        ".gift-section > *",
        ".contact-section > *",
      ];

      const elements =
        selectors.flatMap(
          function (selector) {
            return Array.from(
              app.querySelectorAll(
                selector
              )
            );
          }
        );

      /*
        Remove duplicated elements in case they match
        more than one selector.
      */

      return Array.from(
        new Set(elements)
      );
    }

    function preparePageContentAnimation() {
      const animatedElements =
        getAnimatedPageElements();

      animatedElements.forEach(
        function (element, index) {
          element.classList.remove(
            "page-content-visible"
          );

          element.classList.add(
            "page-content-animate"
          );

          /*
            Maximum delay is limited so pages with many cards
            do not take too long to finish animating.
          */

          const delay =
            Math.min(
              index * 70,
              420
            );

          element.style.setProperty(
            "--page-animation-delay",
            `${delay}ms`
          );
        }
      );
    }

    function playPageContentAnimation() {
      const animatedElements =
        getAnimatedPageElements();

      if (!animatedElements.length) {
        return;
      }

      /*
        Two animation frames ensure that the browser first
        applies the hidden state before starting the animation.
      */

      window.requestAnimationFrame(
        function () {
          window.requestAnimationFrame(
            function () {
              animatedElements.forEach(
                function (element) {
                  element.classList.add(
                    "page-content-visible"
                  );
                }
              );
            }
          );
        }
      );
    }

    /* ======================================================
       PAGE REVEAL

       Hide the loader first, then animate the content.
    ====================================================== */

    function revealLoadedPage() {
      app.setAttribute(
        "aria-busy",
        "false"
      );

      document.body.classList.remove(
        "spa-initializing"
      );

      initialLoadCompleted = true;

      window.requestAnimationFrame(
        function () {
          window.setTimeout(
            function () {
              hideLoader();

              /*
                Start shortly after the loader begins fading.
              */

              window.setTimeout(
                playPageContentAnimation,
                80
              );
            },
            250
          );
        }
      );
    }

    /* ======================================================
       URL HANDLING
    ====================================================== */

    function getPageFromUrl() {
      const parameters =
        new URLSearchParams(
          window.location.search
        );

      const requestedPage =
        parameters.get("page");

      if (
        requestedPage &&
        Object.prototype.hasOwnProperty.call(
          pages,
          requestedPage
        )
      ) {
        return requestedPage;
      }

      return "home";
    }

    function createPageUrl(pageName) {
      if (pageName === "home") {
        return "wedding.html";
      }

      return `wedding.html?page=${encodeURIComponent(
        pageName
      )}`;
    }

    /* ======================================================
       PAGE CLEANUP

       Stop page-specific timers and handlers before
       replacing the current HTML.
    ====================================================== */

    function cleanupCurrentPage() {
      if (
        currentPage === "home" &&
        typeof window.cleanupHomePage ===
          "function"
      ) {
        window.cleanupHomePage();
      }

      if (
        currentPage === "rsvp" &&
        typeof window.cleanupRsvpPage ===
          "function"
      ) {
        window.cleanupRsvpPage();
      }
    }

    /* ======================================================
       PAGE INITIALIZATION
    ====================================================== */

    function initializePage(pageName) {
      document.body.dataset.currentPage =
        pageName;

      /*
        Home slideshow and countdown.
      */

      if (
        pageName === "home" &&
        typeof window.initializeHomePage ===
          "function"
      ) {
        window.initializeHomePage();
      }

      /*
        RSVP form events.
      */

      if (
        pageName === "rsvp" &&
        typeof window.initializeRsvpPage ===
          "function"
      ) {
        window.initializeRsvpPage();
      }

      /*
        Update active navigation item.
      */

      if (
        typeof window.updateCommonNavigation ===
        "function"
      ) {
        window.updateCommonNavigation(
          pageName
        );
      }
    }

    /* ======================================================
       LOAD PAGE
    ====================================================== */

    async function loadPage(
      requestedPageName,
      options = {}
    ) {
      const {
        updateHistory = true,
        showTransition = true,
      } = options;

      const pageName =
        pages[requestedPageName]
          ? requestedPageName
          : "home";

      const pageConfig =
        pages[pageName];

      /*
        Prevent loading the current page again and prevent
        simultaneous navigation requests.
      */

      if (
        pageName === currentPage ||
        navigationInProgress
      ) {
        return;
      }

      navigationInProgress = true;

      if (
        showTransition ||
        !initialLoadCompleted
      ) {
        showLoader(
          initialLoadCompleted
            ? "Loading..."
            : "Loading invitation..."
        );
      }

      try {
        const response =
          await fetch(
            pageConfig.file,
            {
              cache: "no-cache",
            }
          );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: Unable to load ${pageConfig.file}`
          );
        }

        const html =
          await response.text();

        /*
          Stop timers and listeners from the current page.
        */

        cleanupCurrentPage();

        /*
          Insert the new page partial.
        */

        app.innerHTML = html;

        currentPage = pageName;

        document.title =
          pageConfig.title;

        /*
          Initialize page-specific JavaScript and navigation.
        */

        initializePage(pageName);

        /*
          Prepare the elements in their hidden animation state.
        */

        preparePageContentAnimation();

        /*
          Wait until important page assets are ready.
        */

        await waitForPageAssets(
          pageName
        );

        /*
          Update the browser URL without refreshing.
        */

        if (updateHistory) {
          window.history.pushState(
            {
              page: pageName,
            },
            "",
            createPageUrl(pageName)
          );
        }

        /*
          Return to the top of the new page.
        */

        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto",
        });

        /*
          Reveal the page and start the content animation.
        */

        revealLoadedPage();
      } catch (error) {
        console.error(
          "Page loading error:",
          error
        );

        document.body.classList.remove(
          "spa-initializing"
        );

        app.setAttribute(
          "aria-busy",
          "false"
        );

        app.innerHTML = `
          <main class="page-load-error">
            <h1>Unable to load the page</h1>

            <p>
              Please check your connection and try again.
            </p>

            <button
              type="button"
              id="retryPageButton"
            >
              Try again
            </button>
          </main>
        `;

        hideLoader();

        const retryButton =
          document.getElementById(
            "retryPageButton"
          );

        retryButton?.addEventListener(
          "click",
          function () {
            navigationInProgress =
              false;

            loadPage(
              pageName,
              {
                updateHistory: false,
              }
            );
          }
        );
      } finally {
        navigationInProgress = false;
      }
    }

    /* ======================================================
       NAVIGATION LINK HANDLING
    ====================================================== */

    document.addEventListener(
      "click",
      function (event) {
        const pageLink =
          event.target.closest(
            "a[data-page]"
          );

        if (!pageLink) {
          return;
        }

        /*
          Allow Ctrl+Click, Cmd+Click, Shift+Click,
          middle-click, and other modified clicks.
        */

        if (
          event.button !== 0 ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        const pageName =
          pageLink.dataset.page;

        if (!pages[pageName]) {
          return;
        }

        event.preventDefault();

        loadPage(pageName);
      }
    );

    /* ======================================================
       BROWSER BACK AND FORWARD
    ====================================================== */

    window.addEventListener(
      "popstate",
      function () {
        loadPage(
          getPageFromUrl(),
          {
            updateHistory: false,
          }
        );
      }
    );

    /* ======================================================
       INITIAL PAGE LOAD

       The loader is already visible in wedding.html.
    ====================================================== */

    loadPage(
      getPageFromUrl(),
      {
        updateHistory: false,
        showTransition: true,
      }
    );
  }
);