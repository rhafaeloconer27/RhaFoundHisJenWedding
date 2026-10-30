/* Shared wedding navigation. Page keys match js/app.js. */
const WEDDING_NAVIGATION_ITEMS = [
  { page: "home", icon: "fa-images", label: "Prenup" },
  { page: "sponsors", icon: "fa-crown", label: "Sponsors" },
  { page: "location", icon: "fa-location-dot", label: "Location" },
  { page: "attire", icon: "fa-shirt", label: "Attire" },
  { page: "gift", icon: "fa-gift", label: "Gift" },
  { page: "faq", icon: "fa-circle-question", label: "FAQ" },
];

(() => {
  let nav, svg, shape, wrapper, toggle, links = [];
  let currentPage = "home";
  let observer, frameId = 0;

  function markup() {
    const items = WEDDING_NAVIGATION_ITEMS.map(({ page, icon, label }) => `
      <a class="nav-item" href="${page === "home" ? "wedding.html" : `wedding.html?page=${page}`}" data-page="${page}">
        <span class="nav-icon"><i class="fa-solid ${icon}" aria-hidden="true"></i></span>
        <span class="nav-label">${label}</span>
      </a>`).join("");
    return `<div class="wedding-nav-wrapper is-collapsed">
      <nav id="weddingCurvedNav" class="bottom-navigation curved-nav" aria-label="Wedding navigation" style="--nav-count: ${WEDDING_NAVIGATION_ITEMS.length}">
        <div class="nav-background" aria-hidden="true"><svg class="nav-background-svg" preserveAspectRatio="none" aria-hidden="true"><path class="nav-background-path"></path></svg></div>
        ${items}
      </nav>
      <button
  type="button"
  class="wedding-nav-toggle"
  aria-label="Expand navigation"
  aria-controls="weddingCurvedNav"
  aria-expanded="false"
>
  <lottie-player
    id="navCollapseAnimation"
    src="images/navCollapse.json"
    background="transparent"
    speed="1"
    autoplay
    loop
    aria-hidden="true"
  ></lottie-player>
</button>
    </div>`;
  }

  function setExpanded(expanded) {
    if (!wrapper) return;
    wrapper.classList.toggle("is-expanded", expanded);
    wrapper.classList.toggle("is-collapsed", !expanded);
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.setAttribute("aria-label", expanded ? "Navigation expanded" : "Expand navigation");
    nav.inert = !expanded;
    if (expanded) scheduleShapeUpdate();
  }

  function ensureNavigation() {
    let container = document.getElementById("globalNavigation");
    if (!container) {
      container = document.createElement("div");
      container.id = "globalNavigation";
      document.body.append(container);
    }
    // Keep fixed-position elements out of transformed/animated SPA shells.
    if (container.parentElement !== document.body) document.body.append(container);
    if (nav && container.contains(nav)) return true;
    observer?.disconnect();
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    container.innerHTML = markup();
    wrapper = container.querySelector(".wedding-nav-wrapper");
    toggle = container.querySelector(".wedding-nav-toggle");
    nav = container.querySelector(".curved-nav");
    svg = nav.querySelector(".nav-background-svg");
    shape = nav.querySelector(".nav-background-path");
    links = [...nav.querySelectorAll(".nav-item")];
    setExpanded(false);
    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      setExpanded(true);
    });
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(scheduleShapeUpdate);
      observer.observe(nav);
    }
    return true;
  }

  // One global listener, even if the SPA navigation is recreated.
  document.addEventListener("pointerdown", (event) => {
    if (wrapper?.classList.contains("is-expanded") && !nav.contains(event.target)) {
      setExpanded(false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && wrapper?.classList.contains("is-expanded")) {
      setExpanded(false);
      toggle.focus();
    }
  });

  function updateShape() {
    if (!nav || !svg || !shape) return;
    const width = nav.clientWidth, height = nav.clientHeight;
    if (!width || !height) return;
    const count = WEDDING_NAVIGATION_ITEMS.length;
    const index = Math.max(0, WEDDING_NAVIGATION_ITEMS.findIndex(({ page }) => page === currentPage));
    const slot = width / count, center = slot * (index + .5);
    const radius = Math.min(window.innerWidth <= 480 ? 46 : 54, slot * .9) / 2;
    const shoulder = Math.min(12, slot * .16), corner = height / 2;
    const start = Math.max(corner - 8, center - radius - shoulder);
    const end = Math.min(width - corner + 8, center + radius + shoulder);
    const depth = 25, first = index === 0, last = index === count - 1;
    const path = [
      first ? `M 0 ${corner} Q 0 4 ${start} 0` : `M ${corner} 0 H ${start}`,
      `C ${center - radius} 0 ${center - radius} ${depth} ${center} ${depth}`,
      `C ${center + radius} ${depth} ${center + radius} 0 ${end} 0`,
      last ? `Q ${width} 4 ${width} ${corner}` : `H ${width - corner} A ${corner} ${corner} 0 0 1 ${width} ${corner}`,
      `V ${height - corner}`, `A ${corner} ${corner} 0 0 1 ${width - corner} ${height}`,
      `H ${corner}`, `A ${corner} ${corner} 0 0 1 0 ${height - corner}`, `V ${corner}`,
      first ? "" : `A ${corner} ${corner} 0 0 1 ${corner} 0`, "Z"
    ].join(" ");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    shape.setAttribute("d", path);
  }

  function scheduleShapeUpdate() {
    if (frameId) return;
    frameId = requestAnimationFrame(() => { frameId = 0; updateShape(); });
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

  window.updateCommonNavigation = renderCommonNavigation;
  window.addEventListener("resize", scheduleShapeUpdate, { passive: true });
  function initialize() { renderCommonNavigation(document.body.dataset.currentPage || "home"); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
