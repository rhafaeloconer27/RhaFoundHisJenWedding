/* ==========================================================
   SINGLE PAGE APPLICATION NAVIGATION

   PURPOSE:
   - Load page partials without refreshing wedding.html
   - Keep background music playing
   - Show the loader until important assets are ready
   - Animate page content after every page transition
   - Initialize and clean up page-specific scripts
========================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const app =
      document.getElementById(
        "app"
      );

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
        title:
          "Theme & Attire | Rhaf & Jen",
      },

      gift: {
        file:
          "pages/gift-guide.html",

        title:
          "Gift Guide | Rhaf & Jen",
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

    let navigationInProgress =
      false;

    let initialLoadCompleted =
      false;

    if (!app) {
      console.error(
        'SPA initialization failed: "#app" was not found.'
      );

      return;
    }

    /* ======================================================
       LOADER
    ====================================================== */

    function setLoaderMessage(
      message
    ) {
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

      const animation =
        document.getElementById(
          "pageLoaderAnimation"
        );

      animation?.play?.();
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

      const animation =
        document.getElementById(
          "pageLoaderAnimation"
        );

      window.setTimeout(
        function () {
          animation?.pause?.();
        },
        500
      );
    }

    /* ======================================================
       IMAGE WAITING
    ====================================================== */

    function waitForImage(
      image,
      timeout = 10000
    ) {
      return new Promise(
        function (resolve) {
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

            if (
              timeoutId !== null
            ) {
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
        }
      );
    }

    function markRemainingImagesWhenLoaded() {
      const images =
        document.querySelectorAll(
          ".hero-slide img"
        );

      images.forEach(
        function (image) {
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
        }
      );
    }

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
       DEFAULT CSS PAGE CONTENT ANIMATION
    ====================================================== */

    function getAnimatedPageElements(
      pageName
    ) {
      const selectors = [
        ".hero-content",
        ".hero-countdown",
        ".page-hero-content",
        ".rsvp-section > *",
        ".gift-section > *",
      ];

      /*
       * These pages have their own GSAP
       * ScrollTrigger animations.
       *
       * Do not apply the default CSS animation
       * to their content cards.
       */
      if (
        pageName !== "sponsors" &&
        pageName !== "location" &&
        pageName !== "attire" &&
        pageName !== "faq"
      ) {
        selectors.push(
          ".content-section > *"
        );
      }

      if (
        pageName !== "sponsors"
      ) {
        selectors.push(
          ".sponsors-section > *"
        );
      }

      if (
        pageName !== "location"
      ) {
        selectors.push(
          ".location-section > *"
        );
      }

      if (
        pageName !== "attire"
      ) {
        selectors.push(
          ".attire-section > *",
          ".attire-poster > *"
        );
      }

      if (
        pageName !== "faq"
      ) {
        selectors.push(
          ".faq-section > *"
        );
      }

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

      return Array.from(
        new Set(elements)
      );
    }

    function preparePageContentAnimation(
      pageName
    ) {
      const animatedElements =
        getAnimatedPageElements(
          pageName
        );

      animatedElements.forEach(
        function (
          element,
          index
        ) {
          element.classList.remove(
            "page-content-visible"
          );

          element.classList.add(
            "page-content-animate"
          );

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

    function playPageContentAnimation(
      pageName
    ) {
      const animatedElements =
        getAnimatedPageElements(
          pageName
        );

      if (
        !animatedElements.length
      ) {
        return;
      }

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
       SCROLLTRIGGER REFRESH
    ====================================================== */

    function refreshScrollTrigger() {
      if (
        typeof window.ScrollTrigger ===
        "undefined"
      ) {
        return;
      }

      window.requestAnimationFrame(
        function () {
          window.requestAnimationFrame(
            function () {
              window.ScrollTrigger.refresh(
                true
              );
            }
          );
        }
      );
    }

    /* ======================================================
       PAGE REVEAL
    ====================================================== */

    function revealLoadedPage(
      pageName
    ) {
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
               * Wait until the loader is hidden
               * and body scrolling is restored.
               */
              window.setTimeout(
                function () {
                  playPageContentAnimation(
                    pageName
                  );

                  /*
                   * Refresh all GSAP ScrollTriggers.
                   *
                   * This supports:
                   * - Sponsors
                   * - Location
                   * - Attire
                   * - FAQ
                   * - future pages using ScrollTrigger
                   */
                  refreshScrollTrigger();
                },
                150
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
        Object.prototype
          .hasOwnProperty.call(
            pages,
            requestedPage
          )
      ) {
        return requestedPage;
      }

      return "home";
    }

    function createPageUrl(
      pageName
    ) {
      if (
        pageName === "home"
      ) {
        return "wedding.html";
      }

      return `wedding.html?page=${encodeURIComponent(
        pageName
      )}`;
    }

    /* ======================================================
       PAGE CLEANUP
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

      if (
        currentPage === "sponsors" &&
        typeof window.cleanupSponsorsPage ===
          "function"
      ) {
        window.cleanupSponsorsPage();
      }

      if (
        currentPage === "location" &&
        typeof window.cleanupLocationPage ===
          "function"
      ) {
        window.cleanupLocationPage();
      }

      if (
        currentPage === "attire" &&
        typeof window.cleanupAttirePage ===
          "function"
      ) {
        window.cleanupAttirePage();
      }

      if (
        currentPage === "faq" &&
        typeof window.cleanupFaqPage ===
          "function"
      ) {
        window.cleanupFaqPage();
      }
    }

    /* ======================================================
       PAGE INITIALIZATION
    ====================================================== */

    function initializePage(
      pageName
    ) {
      document.body.dataset.currentPage =
        pageName;

      if (
        pageName === "home" &&
        typeof window.initializeHomePage ===
          "function"
      ) {
        window.initializeHomePage();
      }

      if (
        pageName === "rsvp" &&
        typeof window.initializeRsvpPage ===
          "function"
      ) {
        window.initializeRsvpPage();
      }

      if (
        pageName === "sponsors" &&
        typeof window.initializeSponsorsPage ===
          "function"
      ) {
        window.initializeSponsorsPage();
      }

      if (
        pageName === "location" &&
        typeof window.initializeLocationPage ===
          "function"
      ) {
        window.initializeLocationPage();
      }

      if (
        pageName === "attire" &&
        typeof window.initializeAttirePage ===
          "function"
      ) {
        window.initializeAttirePage();
      }

      if (
        pageName === "faq" &&
        typeof window.initializeFaqPage ===
          "function"
      ) {
        window.initializeFaqPage();
      }

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
         * Remove page-specific listeners,
         * GSAP contexts, intervals, and timers
         * from the old page.
         */
        cleanupCurrentPage();

        /*
         * Insert the new page partial.
         */
        app.innerHTML = html;

        currentPage =
          pageName;

        document.title =
          pageConfig.title;

        /*
         * Reset the browser scroll position
         * before creating ScrollTriggers.
         */
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto",
        });

        /*
         * Prepare default CSS animation classes.
         *
         * Pages with their own GSAP scroll animation
         * are excluded in getAnimatedPageElements().
         */
        preparePageContentAnimation(
          pageName
        );

        /*
         * Wait for important assets before page
         * initialization.
         */
        await waitForPageAssets(
          pageName
        );

        /*
         * Initialize the page after:
         * - HTML insertion
         * - scroll reset
         * - important assets are ready
         */
        initializePage(
          pageName
        );

        if (updateHistory) {
          window.history.pushState(
            {
              page: pageName,
            },
            "",
            createPageUrl(
              pageName
            )
          );
        }

        revealLoadedPage(
          pageName
        );
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

            <h1>
              Unable to load the page
            </h1>

            <p>
              Please check your connection
              and try again.
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
                updateHistory:
                  false,
              }
            );
          }
        );
      } finally {
        navigationInProgress =
          false;
      }
    }

    /* ======================================================
       NAVIGATION
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

        loadPage(
          pageName
        );
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
            updateHistory:
              false,
          }
        );
      }
    );

    /* ======================================================
       PAGE RESTORE / RESIZE SUPPORT
    ====================================================== */

    window.addEventListener(
      "pageshow",
      function () {
        refreshScrollTrigger();
      }
    );

    window.addEventListener(
      "resize",
      function () {
        refreshScrollTrigger();
      }
    );

    window.addEventListener(
      "orientationchange",
      function () {
        window.setTimeout(
          refreshScrollTrigger,
          250
        );
      }
    );

    /* ======================================================
       INITIAL LOAD
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