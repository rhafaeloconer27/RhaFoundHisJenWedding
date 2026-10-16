/* ==========================================================
   RHAF & JEN — SPA ROUTER

   Shared by index.html and wedding.html.
   Keeps music alive while switching pages, loads each page's
   CSS/JS, supports browser history, and preserves the
   invitation-to-home page-flip transition.
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (!app) {
    console.error('SPA initialization failed: "#app" was not found.');
    return;
  }

  const body = document.body;
  const root = document.documentElement;
  const pageLoader = document.getElementById("pageTransitionLoader");
  const pageLoaderMessage = document.getElementById("pageLoaderMessage");
  const pageLoaderAnimation = document.getElementById("pageLoaderAnimation");
  const spaShell = document.getElementById("weddingSpaShell");
  const isInvitationHost = body.classList.contains("invitation-intro-body");

  // Keep route names consistent with common.js and data-page links.
  const pages = {
    invitation: { title: "Invitation | Rhaf & Jen" },
    home: {
      file: "pages/home/home.html",
      css: "pages/home/home.css",
      js: "pages/home/home.js",
      title: "Home | Rhaf & Jen",
      hook: "Home",
    },
    sponsors: {
      file: "pages/sponsors/sponsors.html",
      css: "pages/sponsors/sponsors.css",
      js: "pages/sponsors/sponsors.js",
      title: "Sponsors | Rhaf & Jen",
      hook: "Sponsors",
    },
    location: {
      file: "pages/location/location.html",
      css: "pages/location/location.css",
      js: "pages/location/location.js",
      title: "Location | Rhaf & Jen",
      hook: "Location",
    },
    rsvp: {
      file: "pages/rsvp/rsvp.html",
      css: "pages/rsvp/rsvp.css",
      js: "pages/rsvp/rsvp.js",
      title: "RSVP | Rhaf & Jen",
      hook: "Rsvp",
    },
    attire: {
      file: "pages/attire/attire.html",
      css: "pages/attire/attire.css",
      js: "pages/attire/attire.js",
      title: "Theme & Attire | Rhaf & Jen",
      hook: "Attire",
    },
    gift: {
      file: "pages/gift/gift.html",
      css: "pages/gift/gift.css",
      title: "Gift Guide | Rhaf & Jen",
    },
    faq: {
      file: "pages/faq/faq.html",
      css: "pages/faq/faq.css",
      js: "pages/faq/faq.js",
      title: "FAQ | Rhaf & Jen",
      hook: "Faq",
    },
    prenup: { file: "pages/prenup.html", title: "Prenup | Rhaf & Jen" },
  };

  const defaultAnimationSelectors = [
    ".hero-content",
    ".hero-countdown",
    ".page-hero-content",
    ".rsvp-section > *",
    ".gift-section > *",
  ];
  const ownScrollAnimationPages = new Set(["sponsors", "location", "attire", "faq"]);
  const sectionAnimationSelectors = {
    sponsors: [".sponsors-section > *"],
    location: [".location-section > *"],
    attire: [".attire-section > *", ".attire-poster > *"],
    faq: [".faq-section > *"],
  };

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  let currentPage = isInvitationHost ? "invitation" : null;
  let navigationInProgress = false;
  let queuedNavigation = null;
  let initialLoadCompleted = false;
  let invitationScrollY = 0;
  let activeStylesheet = null;
  let revealTimer = null;
  let animationTimer = null;
  let directEntryTimer = null;
  let revealVersion = 0;
  let navigationVersion = 0;
  const loadedScripts = new Map();

  // --- Loader ----------------------------------------------------
  function setLoaderVisible(visible, message = "Loading...") {
    app.setAttribute("aria-busy", String(visible));
    if (pageLoaderMessage && visible) pageLoaderMessage.textContent = message;

    pageLoader?.classList.toggle("is-visible", visible);
    pageLoader?.setAttribute("aria-hidden", String(!visible));
    body.classList.toggle("page-transition-active", visible);

    if (visible) pageLoaderAnimation?.play?.();
    else if (root.classList.contains("wedding-direct-entry") && !directEntryTimer) {
      // The page-flip entry has its own animation; release its
      // temporary scroll/pointer lock only after it has finished.
      directEntryTimer = window.setTimeout(() => {
        root.classList.remove("wedding-direct-entry");
        root.style.overflow = "";
        body.style.overflow = "";
        try {
          sessionStorage.removeItem("weddingDirectEntry");
        } catch (_) {
          // Storage can be disabled by the browser.
        }
        directEntryTimer = null;
      }, 1000);
    }
  }

  function clearRevealTimers() {
    revealVersion++;
    if (revealTimer !== null) window.clearTimeout(revealTimer);
    if (animationTimer !== null) window.clearTimeout(animationTimer);
    revealTimer = null;
    animationTimer = null;
  }

  // --- Scroll / ScrollTrigger -----------------------------------
  function resetPageScroll() {
    // style.css uses smooth scrolling: override it synchronously
    // during the programmatic top reset.
    const rootBehavior = root.style.scrollBehavior;
    const bodyBehavior = body.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    body.style.scrollBehavior = "auto";

    window.scrollTo(0, 0);
    if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
    const pageContainer = app.querySelector(".page-container");
    if (pageContainer) pageContainer.scrollTop = 0;

    root.style.scrollBehavior = rootBehavior;
    body.style.scrollBehavior = bodyBehavior;
  }

  function refreshScrollTrigger() {
    if (!window.ScrollTrigger) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => window.ScrollTrigger.refresh(true));
    });
  }

  // --- Home image readiness -------------------------------------
  function markImageReady(image) {
    image.classList.add("is-loaded");
  }

  function waitForImage(image, timeoutMs = 10000) {
    if (!image) return Promise.resolve();
    if (image.complete) {
      markImageReady(image);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let timeoutId;
      const finish = () => {
        window.clearTimeout(timeoutId);
        image.removeEventListener("load", finish);
        image.removeEventListener("error", finish);
        markImageReady(image);
        resolve();
      };
      image.addEventListener("load", finish, { once: true });
      image.addEventListener("error", finish, { once: true });
      timeoutId = window.setTimeout(finish, timeoutMs);
    });
  }

  async function waitForPageAssets(pageName) {
    if (pageName !== "home") return;
    if (pageLoaderMessage) pageLoaderMessage.textContent = "Preparing your photos...";

    const firstImage = app.querySelector(".hero-slide.active img, .hero-slide img");
    await waitForImage(firstImage);

    app.querySelectorAll(".hero-slide img").forEach((image) => {
      if (image.complete) markImageReady(image);
      else {
        image.addEventListener("load", () => markImageReady(image), { once: true });
        image.addEventListener("error", () => markImageReady(image), { once: true });
      }
    });
  }

  // --- Default page-entry animations ----------------------------
  function getAnimatedElements(pageName) {
    const selectors = [...defaultAnimationSelectors];
    if (!ownScrollAnimationPages.has(pageName)) {
      selectors.push(".content-section > *");
    }
    for (const [section, sectionSelectors] of Object.entries(sectionAnimationSelectors)) {
      if (pageName !== section) selectors.push(...sectionSelectors);
    }

    return [...new Set(selectors.flatMap((selector) =>
      Array.from(app.querySelectorAll(selector))
    ))];
  }

  function preparePageAnimation(pageName) {
    const elements = getAnimatedElements(pageName);
    elements.forEach((element, index) => {
      element.classList.remove("page-content-visible");
      element.classList.add("page-content-animate");
      element.style.setProperty("--page-animation-delay", `${Math.min(index * 70, 420)}ms`);
    });
    return elements;
  }

  function playPageAnimation(elements) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        elements.forEach((element) => {
          if (element.isConnected) element.classList.add("page-content-visible");
        });
      });
    });
  }

  // --- URLs and page hooks --------------------------------------
  function getPageFromUrl() {
    const requested = new URLSearchParams(location.search).get("page");
    if (requested && Object.hasOwn(pages, requested)) return requested;

    const isIndexUrl = /(?:\/|\/index\.html)$/i.test(location.pathname);
    return isInvitationHost && isIndexUrl ? "invitation" : "home";
  }

  function createPageUrl(pageName) {
    if (pageName === "invitation") return "index.html";
    return pageName === "home"
      ? "wedding.html"
      : `wedding.html?page=${encodeURIComponent(pageName)}`;
  }

  function callPageHook(action, pageName) {
    const hook = pages[pageName]?.hook;
    const fn = hook && window[`${action}${hook}Page`];
    if (typeof fn === "function") fn();
  }

  function initializePage(pageName) {
    body.dataset.currentPage = pageName;
    callPageHook("initialize", pageName);
    window.updateCommonNavigation?.(pageName);
  }

  // --- Page-specific asset loading ------------------------------
  function loadPageStylesheet(href) {
    if (!href) {
      activeStylesheet?.remove();
      activeStylesheet = null;
      return Promise.resolve();
    }
    if (activeStylesheet?.dataset.href === href) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.href = href;
      link.dataset.pageStyle = "true";
      link.media = "not all"; // Keep the page covered until the new CSS is ready.

      link.addEventListener("load", () => {
        link.media = "all";
        activeStylesheet?.remove();
        activeStylesheet = link;
        resolve();
      }, { once: true });
      link.addEventListener("error", () => {
        link.remove();
        reject(new Error(`Unable to load stylesheet: ${href}`));
      }, { once: true });
      document.head.appendChild(link);
    });
  }

  function loadPageScript(src) {
    if (!src) return Promise.resolve();
    if (loadedScripts.has(src)) return loadedScripts.get(src);

    const promise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.dataset.pageScript = "true";
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", () => {
        script.remove();
        loadedScripts.delete(src); // Permit retries when a download fails.
        reject(new Error(`Unable to load script: ${src}`));
      }, { once: true });
      document.body.appendChild(script);
    });

    loadedScripts.set(src, promise);
    return promise;
  }

  // --- Invitation / SPA layout ----------------------------------
  function showInvitation({ updateHistory }) {
    if (!isInvitationHost) {
      location.href = "index.html";
      return;
    }

    const version = ++navigationVersion;
    clearRevealTimers();
    callPageHook("cleanup", currentPage);
    currentPage = "invitation";
    initialLoadCompleted = true;
    document.title = pages.invitation.title;
    body.dataset.currentPage = "invitation";
    body.classList.remove("wedding-spa-active", "spa-initializing", "page-transition-active");
    body.classList.add("invitation-intro-body");
    spaShell?.setAttribute("aria-hidden", "true");

    const continueButton = document.getElementById("openWeddingPagesButton");
    if (continueButton) continueButton.disabled = false;
    window.gsap?.set?.(
      [".intro-rsvp-section", ".intro-wedding-pages-section"],
      { clearProps: "opacity,visibility,transform" }
    );

    setLoaderVisible(false);
    if (updateHistory) history.pushState({ page: "invitation" }, "", createPageUrl("invitation"));
    requestAnimationFrame(() => {
      if (version !== navigationVersion) return;
      window.scrollTo({ top: invitationScrollY, behavior: "auto" });
      refreshScrollTrigger();
    });
  }

  function activateSpaLayout() {
    if (!isInvitationHost) return;
    if (currentPage === "invitation") invitationScrollY = window.scrollY;

    body.classList.add("wedding-spa-active");
    body.classList.remove("invitation-intro-body", "loading-active", "invitation-gate-active");
    spaShell?.setAttribute("aria-hidden", "false");
  }

  // --- SPA navigation -------------------------------------------
  function revealPage(elements) {
    const directEntry = root.classList.contains("wedding-direct-entry");
    app.setAttribute("aria-busy", "false");
    body.classList.remove("spa-initializing");
    initialLoadCompleted = true;

    clearRevealTimers();
    const version = revealVersion;
    requestAnimationFrame(() => {
      if (version !== revealVersion) return;
      revealTimer = window.setTimeout(() => {
        if (version !== revealVersion) return;
        revealTimer = null;
        setLoaderVisible(false);
        animationTimer = window.setTimeout(() => {
          if (version !== revealVersion) return;
          animationTimer = null;
          if (!directEntry) playPageAnimation(elements);
          refreshScrollTrigger();
        }, 150);
      }, 250);
    });
  }

  async function loadPage(requestedPageName, options = {}) {
    const { updateHistory = true, showTransition = true } = options;
    const pageName = Object.hasOwn(pages, requestedPageName) ? requestedPageName : "home";

    // Serializing loads avoids two pages/stylesheets racing each other.
    if (navigationInProgress) {
      queuedNavigation = { pageName, options };
      return false;
    }
    if (pageName === currentPage) return true;
    if (pageName === "invitation") {
      showInvitation({ updateHistory });
      return true;
    }

    navigationInProgress = true;
    const version = ++navigationVersion;
    clearRevealTimers();
    activateSpaLayout();
    if (showTransition) setLoaderVisible(true,
      initialLoadCompleted ? "Loading..." : "Loading wedding page...");

    let mountedNewPage = false;
    try {
      const config = pages[pageName];
      const response = await fetch(config.file, { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}: Unable to load ${config.file}`);
      const html = await response.text();

      callPageHook("cleanup", currentPage);
      app.innerHTML = html;
      mountedNewPage = true;
      resetPageScroll();

      await loadPageStylesheet(config.css);
      await loadPageScript(config.js);

      currentPage = pageName;
      document.title = config.title;
      resetPageScroll(); // Before initializing GSAP ScrollTriggers.
      const elements = preparePageAnimation(pageName);
      await waitForPageAssets(pageName);
      initializePage(pageName);

      if (updateHistory) history.pushState({ page: pageName }, "", createPageUrl(pageName));
      revealPage(elements);

      // A second reset after layout/animation setup keeps new pages at the top.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (version === navigationVersion && currentPage === pageName) resetPageScroll();
      }));
      return true;
    } catch (error) {
      console.error("Page loading error:", error);
      if (mountedNewPage) {
        try { callPageHook("cleanup", currentPage); } catch (cleanupError) {
          console.warn("Page cleanup failed:", cleanupError);
        }
      }
      currentPage = null; // Allow the same page to be retried.
      body.classList.remove("spa-initializing");
      app.setAttribute("aria-busy", "false");
      app.innerHTML = `
        <main class="page-load-error" role="alert">
          <h1>Unable to load the page</h1>
          <p>Please check your connection and try again.</p>
          <button type="button" id="retryPageButton">Try again</button>
        </main>`;
      setLoaderVisible(false);
      app.querySelector("#retryPageButton")?.addEventListener("click", () => {
        void loadPage(pageName, { updateHistory: false });
      }, { once: true });
      return false;
    } finally {
      navigationInProgress = false;
      if (queuedNavigation) {
        const next = queuedNavigation;
        queuedNavigation = null;
        if (next.pageName !== currentPage) void loadPage(next.pageName, next.options);
      }
    }
  }

  // --- Index invitation page flip -------------------------------
  async function flipInvitationToHome() {
    if (window.weddingFlipInProgress) return false;
    window.weddingFlipInProgress = true;

    const invitation = document.getElementById("invitationIntro");
    if (!invitation || !spaShell || !window.gsap) {
      window.weddingFlipInProgress = false;
      return loadPage("home", { showTransition: false });
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stage = document.createElement("div");
    stage.className = "wedding-flip-stage";
    stage.innerHTML = '<div class="wedding-flip-cover"><div class="wedding-flip-cover-inner"></div></div>';
    const cover = stage.querySelector(".wedding-flip-cover");
    const coverInner = stage.querySelector(".wedding-flip-cover-inner");

    // Keep the visible portion of the invitation steady during the flip.
    const clone = invitation.cloneNode(true);
    clone.removeAttribute("id");
    clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
    Object.assign(clone.style, {
      position: "absolute",
      left: "0",
      top: `${-window.scrollY}px`,
      width: "100%",
      pointerEvents: "none",
    });
    coverInner.appendChild(clone);
    document.body.appendChild(stage);
    body.classList.add("wedding-flip-active");

    try {
      root.classList.remove("wedding-direct-entry");
      try { sessionStorage.removeItem("weddingDirectEntry"); } catch (_) { /* Optional. */ }
      const loaded = await loadPage("home", { showTransition: false });
      if (!loaded) return false;

      spaShell.hidden = false;
      spaShell.inert = false;
      body.classList.add("wedding-spa-active");
      app.style.visibility = "visible";
      app.style.opacity = "1";

      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (!app.querySelector(".wedding-hero")) {
        throw new Error("Wedding Home content was not loaded.");
      }

      window.gsap.set(cover, {
        rotationY: 0,
        transformPerspective: 1800,
        transformOrigin: "left center",
      });
      if (!reduceMotion) {
        await new Promise((resolve) => window.gsap.to(cover, {
          rotationY: -105,
          opacity: 1,
          duration: 1.1,
          ease: "power3.inOut",
          onComplete: resolve,
        }));
      }
      return true;
    } catch (error) {
      console.error("Wedding flip failed:", error);
      return false;
    } finally {
      stage.remove();
      body.classList.remove("wedding-flip-active");
      window.weddingFlipInProgress = false;
    }
  }

  window.startWeddingSpa = (pageName = "home") => {
    return pageName === "home" && body.classList.contains("invitation-intro-body")
      ? flipInvitationToHome()
      : loadPage(pageName);
  };

  // --- Events ----------------------------------------------------
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest("a[data-page]");
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
        link.hasAttribute("download") || (link.target && link.target !== "_self")) return;

    const pageName = link.dataset.page;
    if (!Object.hasOwn(pages, pageName)) return;
    event.preventDefault();
    void loadPage(pageName);
  });

  window.addEventListener("popstate", () => {
    void loadPage(getPageFromUrl(), { updateHistory: false });
  });
  window.addEventListener("pageshow", refreshScrollTrigger);
  window.addEventListener("resize", refreshScrollTrigger, { passive: true });
  window.addEventListener("orientationchange", () => {
    window.setTimeout(refreshScrollTrigger, 250);
  });

  // --- Initial route ---------------------------------------------
  if (isInvitationHost) body.dataset.currentPage = "invitation";
  const initialPage = getPageFromUrl();
  if (!isInvitationHost || initialPage !== "invitation") {
    void loadPage(initialPage, { updateHistory: false });
  }
});
