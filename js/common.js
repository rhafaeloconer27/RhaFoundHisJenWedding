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
  page: "faq",
  href: "wedding.html?page=faq",
  icon: "fa-solid fa-circle-question",
  label: "FAQ",
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

  let navigationResizeObserver = null;

function renderCommonNavigation(currentPage) {
  let container = document.getElementById("globalNavigation");

  if (!container) {
    container = document.createElement("div");
    container.id = "globalNavigation";
    document.body.appendChild(container);
  }

  if (navigationResizeObserver) {
    navigationResizeObserver.disconnect();
    navigationResizeObserver = null;
  }

  container.innerHTML = createNavigationMarkup(currentPage);

  const nav = container.querySelector(".curved-nav");

  if (!nav) return;

const updateShape = () => {
  const width = nav.clientWidth;
  const height = nav.clientHeight;

  if (!width || !height) return;

  const count = WEDDING_NAVIGATION_ITEMS.length;

  const index = Math.max(
    WEDDING_NAVIGATION_ITEMS.findIndex(
      (item) => item.page === currentPage
    ),
    0
  );

  const slotWidth = width / count;
  const center = slotWidth * (index + 0.5);

  // Match active circle size from CSS
  const circleSize = Math.min(
    window.innerWidth <= 480 ? 46 : 54,
    slotWidth * 0.9
  );

  const radius = circleSize / 2;

  const notchDepth = 25;
  const shoulder = Math.min(12, slotWidth * 0.16);

  // Pill-shaped outer corners
  const corner = height / 2;

  const start = center - radius - shoulder;
  const end = center + radius + shoulder;

  // The notch must remain within the top edge.
  // It cannot overlap the rounded end caps.
  const safeStart = Math.max(
  corner - 8,
  start
);

const safeEnd = Math.min(
  width - corner + 8,
  end
);

  const isFirst = index === 0;
  const isLast = index === count - 1;

  let path = "";

  // LEFT CORNER
  if (isFirst) {
    // Start from left side and merge into the notch
    path = `
  M 0 ${corner}

  Q 0 4
    ${safeStart} 0
`;
  } else {
    // Normal rounded left corner
    path = `
      M ${corner} 0
      H ${safeStart}
    `;
  }

  // ACTIVE NOTCH
  path += `
    C ${center - radius} 0,
      ${center - radius} ${notchDepth},
      ${center} ${notchDepth}

    C ${center + radius} ${notchDepth},
      ${center + radius} 0,
      ${safeEnd} 0
  `;

  // RIGHT CORNER
  if (isLast) {
   path += `
  Q ${width} 4
    ${width} ${corner}
`;
  } else {
    path += `
      H ${width - corner}

      A ${corner} ${corner}
        0 0 1
        ${width} ${corner}
    `;
  }

  // BOTTOM CURVES
  path += `
    V ${height - corner}

    A ${corner} ${corner}
      0 0 1
      ${width - corner} ${height}

    H ${corner}

    A ${corner} ${corner}
      0 0 1
      0 ${height - corner}

    V ${corner}

    ${isFirst ? "" : `
      A ${corner} ${corner}
        0 0 1
        ${corner} 0
    `}

    Z
  `;

  const svg = nav.querySelector(
    ".nav-background-svg"
  );

  const shape = nav.querySelector(
    ".nav-background-path"
  );

  if (!svg || !shape) return;

  svg.setAttribute(
    "viewBox",
    `0 0 ${width} ${height}`
  );

  shape.setAttribute("d", path);
};



  updateShape();

  if (typeof ResizeObserver !== "undefined") {
    navigationResizeObserver = new ResizeObserver(updateShape);
    navigationResizeObserver.observe(nav);
  } else {
    window.addEventListener("resize", updateShape, { once: true });
  }
}



function createNavigationMarkup(currentPage) {

  const navigationItems = WEDDING_NAVIGATION_ITEMS.map((item) => {
    const isActive = item.page === currentPage;

    return `
      <a
        class="nav-item ${isActive ? "active" : ""}"
        data-page="${item.page}"
        href="${item.href}"
        ${isActive ? 'aria-current="page"' : ""}
      >
        <span class="nav-icon">
          <i class="${item.icon}" aria-hidden="true"></i>
        </span>

        <span class="nav-label">${item.label}</span>
      </a>
    `;
  }).join("");

  return `
    <nav
      class="bottom-navigation curved-nav"
      aria-label="Wedding navigation"
      style="
        --nav-count: ${WEDDING_NAVIGATION_ITEMS.length};
      "
    >
      <div class="nav-background" aria-hidden="true">
        <svg
          class="nav-background-svg"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path class="nav-background-path"></path>
        </svg>
      </div>

      ${navigationItems}
    </nav>
  `;
}
