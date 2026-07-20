/* =========================================================
   GLOBAL NAVIGATION — SPA COMPATIBLE

   IMPORTANT:
   The page values must match the keys in app.js.
========================================================= */

const WEDDING_NAVIGATION_ITEMS = [
  {
    page: "home",
    href: "wedding.html",
    icon: "fa-solid fa-house",
    label: "Home",
  },

  {
    page: "sponsors",
    href: "wedding.html?page=sponsors",
    icon: "fa-solid fa-crown",
    label: "Sponsors",
  },

  {
    page: "location",
    href: "wedding.html?page=location",
    icon: "fa-solid fa-location-dot",
    label: "Location",
  },

  {
    page: "rsvp",
    href: "wedding.html?page=rsvp",
    icon: "fa-solid fa-envelope-open-text",
    label: "RSVP",
    featured: true,
  },

  {
    page: "attire",
    href: "wedding.html?page=attire",
    icon: "fa-solid fa-shirt",
    label: "Attire",
  },

  {
    page: "gift",
    href: "wedding.html?page=gift",
    icon: "fa-solid fa-gift",
    label: "Gift",
  },

  {
    page: "contact",
    href: "wedding.html?page=contact",
    icon: "fa-solid fa-phone",
    label: "Contact",
  },
];

document.addEventListener(
  "DOMContentLoaded",
  initializeCommonNavigation
);

function initializeCommonNavigation() {
  const currentPage =
    document.body.dataset.currentPage ||
    "home";

  renderCommonNavigation(currentPage);
}

/*
  Called by app.js every time a new page
  is loaded.
*/
window.updateCommonNavigation =
  function (currentPage) {
    renderCommonNavigation(currentPage);
  };

function renderCommonNavigation(
  currentPage
) {
  let navigationContainer =
    document.getElementById(
      "globalNavigation"
    );

  if (!navigationContainer) {
    navigationContainer =
      document.createElement("div");

    navigationContainer.id =
      "globalNavigation";

    document.body.appendChild(
      navigationContainer
    );
  }

  navigationContainer.innerHTML =
    createNavigationMarkup(currentPage);
}

function createNavigationMarkup(
  currentPage
) {
  const navigationItems =
    WEDDING_NAVIGATION_ITEMS.map(
      function (item) {
        const isActive =
          item.page === currentPage;

        const featuredClass =
          item.featured
            ? " nav-item-featured"
            : "";

        const activeClass =
          isActive
            ? " active"
            : "";

        const ariaCurrent =
          isActive
            ? 'aria-current="page"'
            : "";

        return `
          <a
            class="nav-item${featuredClass}${activeClass}"
            data-page="${item.page}"
            href="${item.href}"
            ${ariaCurrent}
          >
            <span class="nav-icon">
              <i
                class="${item.icon}"
                aria-hidden="true"
              ></i>
            </span>

            <span class="nav-label">
              ${item.label}
            </span>
          </a>
        `;
      }
    ).join("");

  return `
    <nav
      class="bottom-navigation"
      aria-label="Wedding navigation"
    >
      ${navigationItems}
    </nav>
  `;
}