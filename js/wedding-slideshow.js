document.addEventListener("DOMContentLoaded", () => {
    const slideshow = document.querySelector(".wedding-slideshow");

    if (!slideshow) {
        return;
    }

    const slides = Array.from(
        slideshow.querySelectorAll(".wedding-slide")
    );

    const dots = Array.from(
        slideshow.querySelectorAll(".slideshow-dot")
    );

    const previousButton = slideshow.querySelector(
        ".slideshow-previous"
    );

    const nextButton = slideshow.querySelector(
        ".slideshow-next"
    );

    if (!slides.length) {
        return;
    }

    let currentSlide = 0;
    let slideshowInterval = null;

    const slideshowDelay = 5000;

    function showSlide(index) {
        currentSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle(
                "active",
                slideIndex === currentSlide
            );
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle(
                "active",
                dotIndex === currentSlide
            );
        });
    }

    function showNextSlide() {
        showSlide(currentSlide + 1);
    }

    function showPreviousSlide() {
        showSlide(currentSlide - 1);
    }

    function startSlideshow() {
        stopSlideshow();

        slideshowInterval = window.setInterval(
            showNextSlide,
            slideshowDelay
        );
    }

    function stopSlideshow() {
        if (slideshowInterval) {
            window.clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
    }

    function restartSlideshow() {
        stopSlideshow();
        startSlideshow();
    }

    previousButton?.addEventListener("click", () => {
        showPreviousSlide();
        restartSlideshow();
    });

    nextButton?.addEventListener("click", () => {
        showNextSlide();
        restartSlideshow();
    });

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            const slideIndex = Number(dot.dataset.slide);

            if (Number.isNaN(slideIndex)) {
                return;
            }

            showSlide(slideIndex);
            restartSlideshow();
        });
    });

    slideshow.addEventListener("mouseenter", stopSlideshow);
    slideshow.addEventListener("mouseleave", startSlideshow);

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopSlideshow();
        } else {
            startSlideshow();
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    slideshow.addEventListener(
        "touchstart",
        (event) => {
            touchStartX = event.changedTouches[0].screenX;
        },
        { passive: true }
    );

    slideshow.addEventListener(
        "touchend",
        (event) => {
            touchEndX = event.changedTouches[0].screenX;

            const swipeDistance = touchStartX - touchEndX;
            const minimumSwipeDistance = 50;

            if (Math.abs(swipeDistance) < minimumSwipeDistance) {
                return;
            }

            if (swipeDistance > 0) {
                showNextSlide();
            } else {
                showPreviousSlide();
            }

            restartSlideshow();
        },
        { passive: true }
    );

    showSlide(0);
    startSlideshow();
});
