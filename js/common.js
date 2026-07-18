const WEDDING_NAVIGATION_ITEMS = [
  {
    page: "home",
    href: "home.html",
    icon: "fa-solid fa-house",
    label: "Home",
  },
  {
    page: "sponsors",
    href: "sponsors.html",
    icon: "fa-solid fa-crown",
    label: "Sponsors",
  },
  {
    page: "location",
    href: "location.html",
    icon: "fa-solid fa-location-dot",
    label: "Location",
  },
  {
    page: "rsvp",
    href: "rsvp.html",
    icon: "fa-solid fa-envelope-open-text",
    label: "RSVP",
    featured: true,
  },
  {
    page: "attire",
    href: "attire.html",
    icon: "fa-solid fa-shirt",
    label: "Attire",
  },
  {
    page: "gift",
    href: "gift-guide.html",
    icon: "fa-solid fa-gift",
    label: "Gift",
  },
  {
    page: "contact",
    href: "contact.html",
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
    document.body.dataset.currentPage || "";

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

function createNavigationMarkup(currentPage) {
  const navigationItems =
    WEDDING_NAVIGATION_ITEMS.map(
      function (item) {
        const isActive =
          item.page === currentPage;

        const featuredClass =
          item.featured
            ? " nav-item-featured"
            : "";

        return `
          <a
            class="nav-item${featuredClass}${isActive ? " active" : ""}"
            data-page="${item.page}"
            href="${item.href}"
            ${isActive ? 'aria-current="page"' : ""}
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
