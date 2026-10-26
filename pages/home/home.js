/* SPA home module: one photo manifest, lazy gallery, randomized slideshow. */
let homeSlideshowInterval = null;
let homeVisibilityHandler = null;
let homeCountdownInterval = null;
let homeGalleryAnimationContext = null;
let homeGalleryRefreshHandler = null;
let homeSession = 0;

const HOME_IMAGE_FOLDER = "images/prenup/";
const HOME_IMAGE_COUNT = 64;
const HOME_SLIDESHOW_DELAY = 5000;
const HOME_WEDDING_DATE = new Date("2027-02-04T15:00:00+08:00").getTime();

function homeImagePath(number) {
  return `${HOME_IMAGE_FOLDER}prenup${number}.webp`;
}

function shuffledPhotoNumbers() {
  const numbers = Array.from({ length: HOME_IMAGE_COUNT }, (_, i) => i + 1);
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
}

window.initializeHomePage = function () {
  window.cleanupHomePage();
  const session = homeSession;
  initializeHomeGallery();
  initializeHeroSlideshow(session);
  initializeWeddingCountdown();
  initializeGalleryParallax();
};

window.cleanupHomePage = function () {
  homeSession++;
  if (homeSlideshowInterval !== null) clearInterval(homeSlideshowInterval);
  if (homeCountdownInterval !== null) clearInterval(homeCountdownInterval);
  homeSlideshowInterval = homeCountdownInterval = null;
  if (homeVisibilityHandler) document.removeEventListener("visibilitychange", homeVisibilityHandler);
  homeVisibilityHandler = null;
  if (homeGalleryRefreshHandler) window.removeEventListener("load", homeGalleryRefreshHandler);
  homeGalleryRefreshHandler = null;
  if (homeGalleryAnimationContext) homeGalleryAnimationContext.revert();
  homeGalleryAnimationContext = null;
};

function initializeHomeGallery() {
  const grid = document.querySelector(".home-gallery-grid");
  if (!grid) return;
  const fragment = document.createDocumentFragment();
  for (let number = 1; number <= HOME_IMAGE_COUNT; number++) {
    const figure = document.createElement("figure");
    figure.className = "home-gallery-item";
    const image = document.createElement("img");
    image.src = homeImagePath(number);
    image.alt = `Rhaf and Jen prenup photo ${number}`;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => { figure.hidden = true; }, { once: true });
    figure.append(image);
    fragment.append(figure);
  }
  grid.replaceChildren(fragment);
}

function initializeHeroSlideshow(session) {
  const slideshow = document.querySelector(".hero-slideshow");
  if (!slideshow) return;
  const order = shuffledPhotoNumbers();
  const slides = [0, 1].map(() => {
    const slide = document.createElement("div");
    slide.className = "hero-slide";
    const image = document.createElement("img");
    image.alt = "";
    image.decoding = "async";
    slide.append(image);
    return slide;
  });
  slideshow.replaceChildren(...slides);
  let activeSlot = 0;
  let nextPhotoIndex = 0;
  let isTransitioning = false;
  let started = false;

  function loadPhoto(slot, photoNumber) {
    return new Promise((resolve) => {
      const image = slides[slot].querySelector("img");
      image.classList.remove("is-loaded");
      const source = homeImagePath(photoNumber);
      const probe = new Image();
      probe.onload = () => {
        if (session !== homeSession) return resolve(false);
        image.src = source;
        image.classList.add("is-loaded");
        resolve(true);
      };
      probe.onerror = () => resolve(false);
      probe.src = source;
    });
  }

  async function loadNextValid(slot) {
    for (let attempt = 0; attempt < HOME_IMAGE_COUNT; attempt++) {
      if (nextPhotoIndex >= order.length) {
        // Shuffle each new cycle; avoid immediately repeating the previous image.
        const previous = order[order.length - 1];
        const nextOrder = shuffledPhotoNumbers();
        if (nextOrder[0] === previous && nextOrder.length > 1) {
          [nextOrder[0], nextOrder[1]] = [nextOrder[1], nextOrder[0]];
        }
        order.splice(0, order.length, ...nextOrder);
        nextPhotoIndex = 0;
      }
      const number = order[nextPhotoIndex++];
      if (await loadPhoto(slot, number)) return true;
      if (session !== homeSession) return false;
    }
    return false;
  }

  async function advance() {
    if (isTransitioning || session !== homeSession || document.hidden) return;
    isTransitioning = true;
    const nextSlot = 1 - activeSlot;
    const loaded = await loadNextValid(nextSlot);
    if (loaded && session === homeSession) {
      slides[nextSlot].classList.add("active");
      slides[activeSlot].classList.remove("active");
      activeSlot = nextSlot;
    }
    isTransitioning = false;
  }

  function start() {
    if (homeSlideshowInterval !== null || document.hidden || !started) return;
    homeSlideshowInterval = window.setInterval(advance, HOME_SLIDESHOW_DELAY);
  }
  function stop() {
    if (homeSlideshowInterval !== null) clearInterval(homeSlideshowInterval);
    homeSlideshowInterval = null;
  }
  homeVisibilityHandler = () => { if (document.hidden) stop(); else start(); };
  document.addEventListener("visibilitychange", homeVisibilityHandler);

  loadNextValid(0).then((loaded) => {
    if (!loaded || session !== homeSession) return;
    slides[0].classList.add("active");
    started = true;
    start();
  });
}

function initializeWeddingCountdown() {
  const fields = ["days", "hours", "minutes", "seconds"].map(id => document.getElementById(id));
  if (fields.some(element => !element)) return;
  function update() {
    if (fields.some(element => !element.isConnected)) {
      clearInterval(homeCountdownInterval);
      homeCountdownInterval = null;
      return;
    }
    const remaining = Math.max(0, HOME_WEDDING_DATE - Date.now());
    const seconds = Math.floor(remaining / 1000);
    const values = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
    fields.forEach((element, index) => { element.textContent = String(values[index]).padStart(index === 0 ? 3 : 2, "0"); });
    if (!remaining) { clearInterval(homeCountdownInterval); homeCountdownInterval = null; }
  }
  update();
  if (HOME_WEDDING_DATE > Date.now()) homeCountdownInterval = setInterval(update, 1000);
}

function initializeGalleryParallax() {
  const gallery = document.querySelector(".home-gallery");
  if (!gallery || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  homeGalleryAnimationContext = gsap.context(() => {
    if (reduceMotion) return;
    gsap.from(".home-gallery-heading", { autoAlpha: 0, y: 35, duration: 1, ease: "power2.out", scrollTrigger: { trigger: ".home-gallery-heading", start: "top 90%", once: true } });
    gsap.utils.toArray(".home-gallery-item", gallery).forEach(item => {
      const image = item.querySelector("img");
      if (!image) return;
      gsap.from(item, { autoAlpha: 0, y: 45, duration: .9, ease: "power2.out", scrollTrigger: { trigger: item, start: "top 95%", once: true } });
      gsap.fromTo(image, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 1.2 } });
    });
  }, gallery);
  // Lazy-loaded images can change masonry height; update trigger positions.
  const grid = gallery.querySelector(".home-gallery-grid");
  if (grid) {
    grid.addEventListener("load", () => ScrollTrigger.refresh(), true);
  }
  ScrollTrigger.refresh();
}
