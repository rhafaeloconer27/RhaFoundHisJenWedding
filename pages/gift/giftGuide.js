/* Gift Guide — Lottie, GSAP reveals, full-screen QR popup; SPA safe. */
(() => {
  let page = null;
  let context = null;
  let modal = null;
  let listeners = null;
  let previousOverflow = "";
  let previousFocus = null;

  const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setupModal(root, signal) {
    const popup = root.querySelector("#giftQrModal");
    if (!popup) return;
    const panel = popup.querySelector(".gift-qr-modal-content");
    const image = popup.querySelector("#giftQrModalImage");
    const heading = popup.querySelector("#giftQrModalTitle");
    const closeButton = popup.querySelector(".gift-qr-close");
    if (!panel || !image || !heading || !closeButton) return;

    // Fixed positioning must not be inside the SPA's transformed/clipped containers.
    document.body.appendChild(popup);
    modal = popup;
    let closing = false;

    function finishClose() {
      popup.hidden = true;
      popup.setAttribute("aria-hidden", "true");
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("gift-qr-modal-open");
      window.gsap?.set([popup, panel], { clearProps: "all" });
      closing = false;
      if (previousFocus?.isConnected) previousFocus.focus();
      previousFocus = null;
    }

    function open(button) {
      if (!popup.hidden || closing) return;
      previousFocus = button;
      heading.textContent = button.dataset.qrTitle || "QR Code";
      image.src = button.dataset.qrSrc;
      image.alt = `${heading.textContent} QR code`;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      document.body.classList.add("gift-qr-modal-open");
      popup.hidden = false;
      popup.setAttribute("aria-hidden", "false");
      if (window.gsap && !reducedMotion()) {
        gsap.killTweensOf([popup, panel]);
        gsap.fromTo(popup, { autoAlpha: 0 }, { autoAlpha: 1, duration: .25 });
        gsap.fromTo(panel, { autoAlpha: 0, y: 30, scale: .9 },
          { autoAlpha: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.5)" });
      }
      closeButton.focus();
    }

    function close() {
      if (popup.hidden || closing) return;
      closing = true;
      if (window.gsap && !reducedMotion()) {
        gsap.killTweensOf([popup, panel]);
        gsap.to(panel, { autoAlpha: 0, y: 15, scale: .96, duration: .2 });
        gsap.to(popup, { autoAlpha: 0, duration: .23, onComplete: finishClose });
      } else finishClose();
    }

    root.querySelectorAll(".gift-qr-button").forEach(button => {
      button.addEventListener("click", () => open(button), { signal });
    });
    closeButton.addEventListener("click", close, { signal });
    popup.addEventListener("click", event => {
      if (event.target === popup) close();
    }, { signal });
    document.addEventListener("keydown", event => {
      if (popup.hidden) return;
      if (event.key === "Escape") { event.preventDefault(); close(); }
      // The close button is the modal's only interactive control.
      if (event.key === "Tab") { event.preventDefault(); closeButton.focus(); }
    }, { signal });
  }

  function setupAnimations(root) {
    if (!window.gsap || !window.ScrollTrigger) {
      console.warn("Gift Guide: GSAP / ScrollTrigger not loaded.");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    context = gsap.context(() => {
      if (reducedMotion()) return;

      const hero = gsap.timeline({ defaults: { ease: "power3.out" } });
      hero.from(".gift-hero-lottie-circle", { autoAlpha: 0, y: 65, scale: .88, duration: 1.1 })
        .from(".gift-page-header p", { autoAlpha: 0, y: 25, duration: .65 }, "-=.5")
        .from(".gift-page-header h1", { autoAlpha: 0, y: 38, scale: .94, duration: .85 }, "-=.4");

      function reveal(selector, opts = {}) {
        const element = root.querySelector(selector);
        if (!element) return;
        gsap.from(element, {
          autoAlpha: 0, y: 40, duration: .85, ease: "power3.out", ...opts,
          scrollTrigger: { trigger: element, start: "top 85%", once: true }
        });
      }

      const card = root.querySelector(".gift-card");
      if (card) {
        const tl = gsap.timeline({
          scrollTrigger: {
  trigger: card,
  start: "top 90%",
  once: true,
  invalidateOnRefresh: true
}
        });
        tl.from(card, { autoAlpha: 0, y: 65, scale: .96, duration: .9, ease: "power3.out" })
          .from(card.querySelector(".gift-card-icon"), { autoAlpha: 0, scale: .35, rotation: -20, duration: .65, ease: "back.out(1.8)" }, "-=.5")
          .from(card.querySelectorAll(".gift-card-label, .gift-card-title"), { autoAlpha: 0, y: 18, stagger: .12, duration: .55 }, "-=.35")
          .from(card.querySelectorAll(".gift-message p"), { autoAlpha: 0, y: 20, stagger: .17, duration: .65 }, "-=.2")
          .from(card.querySelector(".gift-divider"), { autoAlpha: 0, scaleX: .5, duration: .55 }, "-=.15")
          .from(card.querySelectorAll(".gift-thank-you, .gift-signature"), { autoAlpha: 0, y: 18, stagger: .12, duration: .6 }, "-=.2");
      }

      reveal(".gift-reminder-card", { scale: .97 });
      reveal(".gift-payment-heading");
      root.querySelectorAll(".gift-payment-card").forEach((item, index) => {
        gsap.from(item, {
          autoAlpha: 0, y: 65, x: index % 2 ? 20 : -20, scale: .94,
          duration: .95, ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 88%", once: true }
        });
      });
    }, root);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (root.isConnected) ScrollTrigger.refresh();
    }));
  }

  window.initializeGiftGuidePage = function () {
    const root = document.querySelector(".gift-page");
    if (!root) return;
    if (root === page) {
      if (!context && window.gsap && window.ScrollTrigger) setupAnimations(root);
      return;
    }
    if (page) window.cleanupGiftGuidePage();
    page = root;
    listeners = new AbortController();
    setupModal(root, listeners.signal);
    setupAnimations(root);
    const player = root.querySelector("#giftMoneyLottie");
    if (player) {
      const start = () => {
        if (page !== root || !root.isConnected) return;
        if (reducedMotion()) player.stop?.(); else player.play?.();
      };
      if (customElements.get("lottie-player")) start();
      else customElements.whenDefined("lottie-player").then(start);
    }
  };

  window.cleanupGiftGuidePage = function () {
    listeners?.abort();
    listeners = null;
    page?.querySelector("#giftMoneyLottie")?.stop?.();
    context?.revert();
    context = null;
    if (modal) {
      window.gsap?.killTweensOf([modal, modal.querySelector(".gift-qr-modal-content")]);
      modal.remove();
      modal = null;
    }
    if (document.body.classList.contains("gift-qr-modal-open")) {
      document.body.style.overflow = previousOverflow;
    }
    document.body.classList.remove("gift-qr-modal-open");
    previousFocus = null;
    page = null;
  };
})();
