document.addEventListener("DOMContentLoaded", initializeCommonNavigation);

function initializeCommonNavigation() {
  const currentPage = document.body.dataset.currentPage;
  const navigationItems = document.querySelectorAll(".nav-item");

  navigationItems.forEach(function (item) {
    if (item.dataset.page === currentPage) {
      item.classList.add("active");
    }
  });
}
