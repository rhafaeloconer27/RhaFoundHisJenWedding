/* Shared wedding navigation. Page keys must match js/app.js. */
const WEDDING_NAVIGATION_ITEMS = [
  { page: "home", icon: "fa-house", label: "Home" },
  { page: "sponsors", icon: "fa-crown", label: "Sponsors" },
  { page: "location", icon: "fa-location-dot", label: "Location" },
  { page: "attire", icon: "fa-shirt", label: "Attire" },
  { page: "gift", icon: "fa-gift", label: "Gift" },
  { page: "faq", icon: "fa-circle-question", label: "FAQ" },
];

(() => {
  let nav = null;
  let svg = null;
  let shape = null;
  let links = [];
  let currentPage = "home";
  let resizeObserver = null;
  let frameId = 0;

  function createNavigationMarkup() {
    const items = WEDDING_NAVIGATION_ITEMS.map(({ page, icon, label }) => {
      const href = page === "home" ? "wedding.html" : `wedding.html?page=${page}`;
      return `
        <a class="nav-item" href="${href}" data-page="${page}">
          <span class="nav-icon"><i class="fa-solid ${icon}" aria-hidden="true"></i></span>
          <span class="nav-label">${label}</span>
        </a>`;
    }).join("");

    return `
      <nav class="bottom-navigation curved-nav" aria-label="Wedding navigation"
           style="--nav-count: ${WEDDING_NAVIGATION_ITEMS.length}">
        <div class="nav-background" aria-hidden="true">
          <svg class="nav-background-svg" preserveAspectRatio="none" aria-hidden="true">
            <path class="nav-background-path"></path>
          </svg>
        </div>
        ${items}
      </nav>`;
  }

  function ensureNavigation() {
    let container = document.getElementById("globalNavigation");
    if (!container) {
      container = document.createElement("div");
      container.id = "globalNavigation";
      document.body.appendChild(container);
    }

    // Rebuild only if another script replaced or removed the navigation.
    if (nav && container.contains(nav)) return true;

    resizeObserver?.disconnect();
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;

    container.innerHTML = createNavigationMarkup();
    nav = container.querySelector(".curved-nav");
    svg = nav?.querySelector(".nav-background-svg");
    shape = nav?.querySelector(".nav-background-path");
    links = nav ? [...nav.querySelectorAll(".nav-item")] : [];

    if (nav && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(scheduleShapeUpdate);
      resizeObserver.observe(nav);
    }

    return Boolean(nav && svg && shape);
  }

  function updateShape() {
    if (!nav || !svg || !shape) return;

    const width = nav.clientWidth;
    const height = nav.clientHeight;
    if (!width || !height) return; // Hidden SPA shell: redraw when visible.

    const count = WEDDING_NAVIGATION_ITEMS.length;
    const index = Math.max(0, WEDDING_NAVIGATION_ITEMS.findIndex(
      ({ page }) => page === currentPage
    ));
    const slot = width / count;
    const center = slot * (index + 0.5);
    const radius = Math.min(window.innerWidth <= 480 ? 46 : 54, slot * 0.9) / 2;
    const shoulder = Math.min(12, slot * 0.16);
    const corner = height / 2;
    const start = Math.max(corner - 8, center - radius - shoulder);
    const end = Math.min(width - corner + 8, center + radius + shoulder);
    const depth = 25;
    const first = index === 0;
    const last = index === count - 1;

    // Preserve the original SVG notch and rounded end-cap geometry.
    const path = [
      first ? `M 0 ${corner} Q 0 4 ${start} 0` : `M ${corner} 0 H ${start}`,
      `C ${center - radius} 0 ${center - radius} ${depth} ${center} ${depth}`,
      `C ${center + radius} ${depth} ${center + radius} 0 ${end} 0`,
      last ? `Q ${width} 4 ${width} ${corner}` : `H ${width - corner} A ${corner} ${corner} 0 0 1 ${width} ${corner}`,
      `V ${height - corner}`,
      `A ${corner} ${corner} 0 0 1 ${width - corner} ${height}`,
      `H ${corner}`,
      `A ${corner} ${corner} 0 0 1 0 ${height - corner}`,
      `V ${corner}`,
      first ? "" : `A ${corner} ${corner} 0 0 1 ${corner} 0`,
      "Z",
    ].join(" ");

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    shape.setAttribute("d", path);
  }

  function scheduleShapeUpdate() {
    if (frameId) return;
    frameId = requestAnimationFrame(() => {
      frameId = 0;
      updateShape();
    });
  }

  function renderCommonNavigation(pageName = "home") {
    currentPage = pageName;
    if (!ensureNavigation()) return;

    for (const link of links) {
      const active = link.dataset.page === currentPage;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }

    updateShape();
  }

  // app.js calls this after each SPA page change.
  window.updateCommonNavigation = renderCommonNavigation;
  window.addEventListener("resize", scheduleShapeUpdate, { passive: true });

  function initialize() {
    renderCommonNavigation(document.body.dataset.currentPage || "home");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
