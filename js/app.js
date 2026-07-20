/* ==========================================================
   SINGLE PAGE APPLICATION NAVIGATION

   PURPOSE:
   - Load page partials without refreshing wedding.html
   - Keep the background music playing
   - Show the loader until the first important image is ready
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

       Wait for the first Home slideshow image before
       showing the Home content.
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

        function finish() {
          if (completed) {
            return;
          }

          completed = true;

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

        window.setTimeout(
          finish,
          timeout
        );
      });
    }

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
      });
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

      /*
        The first image is ready, so Home can be shown.
        Other slideshow images may continue loading behind it.
      */
      markRemainingImagesWhenLoaded();
    }

    /* ======================================================
       INITIAL PAGE REVEAL
    ====================================================== */

    function revealInitialPage() {
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
            hideLoader,
            250
          );
        }
      );
    }

    /* ======================================================
       URL
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
       CLEANUP
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

        cleanupCurrentPage();

        app.innerHTML = html;

        currentPage = pageName;

        document.title =
          pageConfig.title;

        initializePage(pageName);

        /*
          Wait until the first slideshow image is ready.
        */
        await waitForPageAssets(
          pageName
        );

        if (updateHistory) {
          window.history.pushState(
            {
              page: pageName,
            },
            "",
            createPageUrl(pageName)
          );
        }

        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto",
        });

        if (!initialLoadCompleted) {
          revealInitialPage();
        } else {
          app.setAttribute(
            "aria-busy",
            "false"
          );

          window.setTimeout(
            hideLoader,
            250
          );
        }
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

        loadPage(pageName);
      }
    );

    /* ======================================================
       BACK AND FORWARD
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
       INITIAL LOAD

       Loader is already visible from the HTML.
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