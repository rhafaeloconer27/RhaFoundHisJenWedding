/* ==========================================================
   SINGLE PAGE APPLICATION NAVIGATION

   PURPOSE:
   - Load page partials without refreshing wedding.html
   - Keep background music playing continuously
   - Keep navigation and music button permanent
========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const app = document.getElementById("app");

  const pageLoader =
    document.getElementById("pageTransitionLoader");

  /*
    IMPORTANT:
    The keys here must match data-page values
    inside common.js.
  */
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

  /*
    Stop when app container is missing.

    This prevents errors if app.js is accidentally
    loaded in index.html.
  */
  if (!app) {
    return;
  }

  /* ========================================================
     LOADER
  ======================================================== */

  function showLoader() {
    if (!pageLoader) {
      return;
    }

    pageLoader.classList.add("is-visible");

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

  /* ========================================================
     URL
  ======================================================== */

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

  /* ========================================================
     PAGE CLEANUP
  ======================================================== */

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

  /* ========================================================
     PAGE INITIALIZATION
  ======================================================== */

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

    /*
      Update active item in global navigation.
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

  /* ========================================================
     LOAD PAGE
  ======================================================== */

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

    if (showTransition) {
      showLoader();
    }

    try {
      const response = await fetch(
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
        Stop timers and events from the current page
        before replacing its HTML.
      */
      cleanupCurrentPage();

      /*
        Only #app changes.

        Audio, music button and navigation remain
        outside #app, so they are not recreated.
      */
      app.innerHTML = html;

      currentPage = pageName;

      document.title =
        pageConfig.title;

      initializePage(pageName);

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
    } catch (error) {
      console.error(
        "Page loading error:",
        error
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

      const retryButton =
        document.getElementById(
          "retryPageButton"
        );

      retryButton?.addEventListener(
        "click",
        function () {
          navigationInProgress = false;

          loadPage(pageName, {
            updateHistory: false,
          });
        }
      );
    } finally {
      navigationInProgress = false;

      window.setTimeout(
        hideLoader,
        300
      );
    }
  }

  /* ========================================================
     NAVIGATION LINK CLICKS
  ======================================================== */

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
        Preserve middle-click, Ctrl+Click,
        Command+Click and Shift+Click.
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

  /* ========================================================
     BROWSER BACK AND FORWARD
  ======================================================== */

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

  /* ========================================================
     INITIAL PAGE
  ======================================================== */

  loadPage(
    getPageFromUrl(),
    {
      updateHistory: false,
      showTransition: false,
    }
  );
});