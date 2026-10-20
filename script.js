const WHATSAPP_NUMBER = "5519993492366";

function buildWhatsAppLink(message = "") {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function setupNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (!navToggle || !mainNav) {
    return;
  }

  const closeMenu = (returnFocus = false) => {
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu");

    if (returnFocus) {
      navToggle.focus();
    }
  };

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
      closeMenu(true);
    }
  });

  document.addEventListener("click", (event) => {
    if (
      mainNav.classList.contains("is-open") &&
      event.target instanceof Node &&
      !mainNav.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });
}

function setupWhatsAppLinks() {
  const defaultMessage = "Olá! Gostaria de conhecer os sabores e fazer meu pedido.";

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    const message = link.dataset.whatsappMessage || defaultMessage;
    link.href = buildWhatsAppLink(message);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
}

function setupMediaCarousels() {
  document.querySelectorAll(".media-carousel").forEach((carousel) => {
    const images = Array.from(carousel.querySelectorAll("img"));
    const prevButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");

    if (!images.length) {
      prevButton?.setAttribute("hidden", "true");
      nextButton?.setAttribute("hidden", "true");
      return;
    }

    images.forEach((image, index) => {
      image.classList.toggle("is-active", index === 0);
    });

    if (images.length <= 1) {
      prevButton?.setAttribute("hidden", "true");
      nextButton?.setAttribute("hidden", "true");
      return;
    }

    let currentIndex = images.findIndex((image) => image.classList.contains("is-active"));
    if (currentIndex < 0) {
      currentIndex = 0;
      images[0].classList.add("is-active");
    }

    const showImage = (nextIndex) => {
      currentIndex = (nextIndex + images.length) % images.length;
      images.forEach((image, index) => {
        image.classList.toggle("is-active", index === currentIndex);
      });
    };

    prevButton?.removeAttribute("hidden");
    nextButton?.removeAttribute("hidden");
    prevButton?.addEventListener("click", () => {
      showImage(currentIndex - 1);
    });
    nextButton?.addEventListener("click", () => {
      showImage(currentIndex + 1);
    });
  });
}

function setCurrentYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupMediaCarousels();
  setupWhatsAppLinks();
  setCurrentYear();
});
