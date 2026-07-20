/* ==========================================================
   SINGLE PAGE NAVIGATION

   Purpose:
   - Load page content without refreshing index.html
   - Keep the background music playing
   - Keep navigation and music button permanent
========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const app = document.getElementById("app");

  const pageLoader =
    document.getElementById("pageTransitionLoader");

  /*
    Mapping ng URL name papunta sa partial HTML file.
  */
  const pages = {
    home: {
      file: "pages/home.html",
      title: "Home | Rhaf & Jen"
    },

    sponsors: {
      file: "pages/sponsors.html",
      title: "Sponsors | Rhaf & Jen"
    },

    location: {
      file: "pages/location.html",
      title: "Location | Rhaf & Jen"
    },

    attire: {
      file: "pages/attire.html",
      title: "Theme & Attire | Rhaf & Jen"
    },

    gifts: {
      file: "pages/gift-guide.html",
      title: "Gift Guide | Rhaf & Jen"
    },

    faq: {
      file: "pages/faq.html",
      title: "FAQ | Rhaf & Jen"
    },

    contact: {
      file: "pages/contact.html",
      title: "Contact | Rhaf & Jen"
    },

    rsvp: {
      file: "pages/rsvp.html",
      title: "RSVP | Rhaf & Jen"
    },

    prenup: {
      file: "pages/prenup.html",
      title: "Prenup | Rhaf & Jen"
    }
  };

  let currentPage = null;

  /*
    Show transparent page transition loader.
  */
  function showLoader() {
    if (!pageLoader) {
      return;
    }

    pageLoader.classList.add("is-visible");
    pageLoader.setAttribute("aria-hidden", "false");
  }

  /*
    Hide transparent page transition loader.
  */
  function hideLoader() {
    if (!pageLoader) {
      return;
    }

    pageLoader.classList.remove("is-visible");
    pageLoader.setAttribute("aria-hidden", "true");
  }

  /*
    Determine page name from URL.

    Examples:
    index.html?page=rsvp
    index.html?page=location
  */
  function getPageFromUrl() {
    const urlParameters =
      new URLSearchParams(window.location.search);

    const requestedPage =
      urlParameters.get("page");

    if (
      requestedPage &&
      pages[requestedPage]
    ) {
      return requestedPage;
    }

    return "home";
  }

  /*
    Run page-specific JavaScript after the HTML
    has been placed inside #app.
  */
  function initializePage(pageName) {
    document.body.dataset.currentPage = pageName;

    /*
      Home slideshow and countdown.
    */
    if (
      pageName === "home" &&
      typeof window.initializeHomePage === "function"
    ) {
      window.initializeHomePage();
    }

    /*
      RSVP form behavior.
    */
    if (
      pageName === "rsvp" &&
      typeof window.initializeRsvpPage === "function"
    ) {
      window.initializeRsvpPage();
    }
  }

  /*
    Load a partial HTML file and place it inside #app.
  */
  async function loadPage(
    pageName,
    options = {}
  ) {
    const {
      updateHistory = true,
      showTransition = true
    } = options;

    const pageConfig =
      pages[pageName] || pages.home;

    if (
      pageName === currentPage
    ) {
      return;
    }

    if (showTransition) {
      showLoader();
    }

    try {
      const response = await fetch(
        pageConfig.file,
        {
          cache: "no-cache"
        }
      );

      if (!response.ok) {
        throw new Error(
          `Unable to load ${pageConfig.file}`
        );
      }

      const html =
        await response.text();

      /*
        Place the new page content inside #app.

        The audio element remains untouched because
        it is outside #app.
      */
      app.innerHTML = html;

      currentPage = pageName;

      document.title =
        pageConfig.title;

      initializePage(pageName);

      /*
        Update the browser URL without reloading.
      */
      if (updateHistory) {
        const newUrl =
          pageName === "home"
            ? "index.html"
            : `index.html?page=${pageName}`;

        window.history.pushState(
          {
            page: pageName
          },
          "",
          newUrl
        );
      }

      /*
        Return to the top after changing pages.
      */
      window.scrollTo({
        top: 0,
        behavior: "instant"
      });
    } catch (error) {
      console.error(
        "Page loading error:",
        error
      );

      app.innerHTML = `
        <main class="page-load-error">
          <h1>Unable to load the page</h1>
          <p>Please refresh the website and try again.</p>
        </main>
      `;
    } finally {
      window.setTimeout(
        hideLoader,
        300
      );
    }
  }

  /*
    Intercept navigation links.

    The links should use data-page attributes.
  */
  document.addEventListener(
    "click",
    function (event) {
      const pageLink =
        event.target.closest("[data-page]");

      if (!pageLink) {
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

  /*
    Browser Back and Forward buttons.
  */
  window.addEventListener(
    "popstate",
    function () {
      loadPage(
        getPageFromUrl(),
        {
          updateHistory: false
        }
      );
    }
  );

  /*
    Initial page load.
  */
  loadPage(
    getPageFromUrl(),
    {
      updateHistory: false,
      showTransition: false
    }
  );
});