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
    const slides = Array.from(carousel.children).filter((child) =>
      child.matches("img, [data-carousel-slide]"),
    );
    const prevButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");

    if (!slides.length) {
      prevButton?.setAttribute("hidden", "true");
      nextButton?.setAttribute("hidden", "true");
      return;
    }

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === 0);
    });

    if (slides.length <= 1) {
      prevButton?.setAttribute("hidden", "true");
      nextButton?.setAttribute("hidden", "true");
      return;
    }

    let currentIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
    if (currentIndex < 0) {
      currentIndex = 0;
      slides[0].classList.add("is-active");
    }

    const showImage = (nextIndex) => {
      currentIndex = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, index) => {
        slide.classList.toggle("is-active", index === currentIndex);
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

function setupCart() {
  const cart = new Map();
  const cartItemsElement = document.getElementById("cart-items");
  const cartEmptyMessage = document.getElementById("cart-empty");
  const cartTotalElement = document.getElementById("cart-total");
  const checkoutLink = document.getElementById("cart-checkout");

  if (!cartItemsElement || !cartEmptyMessage || !cartTotalElement || !(checkoutLink instanceof HTMLAnchorElement)) {
    return;
  }

  document.querySelectorAll(".cart-add-controls").forEach((controls) => {
    const name = controls.closest(".product-card")?.querySelector("h3")?.textContent.trim();
    if (!name) {
      return;
    }

    controls.querySelector(".quantity-control")?.setAttribute("aria-label", `Quantidade de ${name}`);
    controls.querySelector("[data-quantity-decrease]")?.setAttribute("aria-label", `Diminuir quantidade de ${name}`);
    controls.querySelector("[data-quantity-increase]")?.setAttribute("aria-label", `Aumentar quantidade de ${name}`);
  });

  const getValidQuantity = (input) => {
    input.setCustomValidity("");
    const quantity = Number(input.value);
    if (!input.checkValidity() || !Number.isSafeInteger(quantity) || quantity < 1) {
      input.setCustomValidity("Informe uma quantidade inteira positiva.");
      input.reportValidity();
      input.focus();
      return null;
    }

    input.setCustomValidity("");
    return quantity;
  };

  const createCartButton = (text, label, action, itemName, className = "") => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.setAttribute("aria-label", label);
    button.dataset[action] = "";
    button.dataset.cartItem = itemName;
    if (className) {
      button.className = className;
    }
    return button;
  };

  const renderCart = () => {
    let totalQuantity = 0;
    const orderLines = Array.from(cart, ([name, quantity]) => `• ${name}: ${quantity}`);

    cartItemsElement.replaceChildren();
    cart.forEach((quantity, name) => {
      totalQuantity += quantity;

      const item = document.createElement("li");
      item.className = "cart-item";

      const itemName = document.createElement("span");
      itemName.className = "cart-item-name";
      itemName.textContent = name;

      const actions = document.createElement("div");
      actions.className = "cart-item-actions";
      const decreaseButton = createCartButton("−", `Diminuir ${name}`, "cartLineDecrease", name);
      decreaseButton.disabled = quantity <= 1;

      const quantityText = document.createElement("span");
      quantityText.textContent = String(quantity);
      quantityText.setAttribute("aria-label", `${quantity} unidades`);

      const increaseButton = createCartButton("+", `Aumentar ${name}`, "cartLineIncrease", name);
      increaseButton.disabled = quantity >= Number.MAX_SAFE_INTEGER;
      const removeButton = createCartButton("Remover", `Remover ${name} do carrinho`, "cartLineRemove", name, "cart-item-remove");

      actions.append(decreaseButton, quantityText, increaseButton, removeButton);
      item.append(itemName, actions);
      cartItemsElement.append(item);
    });

    cartItemsElement.hidden = cart.size === 0;
    cartEmptyMessage.hidden = cart.size > 0;
    cartTotalElement.textContent = String(totalQuantity);
    document.querySelectorAll("[data-cart-count]").forEach((count) => {
      count.textContent = String(totalQuantity);
    });

    if (cart.size > 0) {
      const message = [
        "Olá! Gostaria de fazer este pedido:",
        "",
        ...orderLines,
        "",
        "Pode me informar os valores e a disponibilidade?",
      ].join("\n");
      checkoutLink.href = buildWhatsAppLink(message);
      checkoutLink.removeAttribute("aria-disabled");
      checkoutLink.removeAttribute("tabindex");
    } else {
      checkoutLink.href = "#";
      checkoutLink.setAttribute("aria-disabled", "true");
      checkoutLink.tabIndex = -1;
    }
  };

  document.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement && event.target.matches("[data-item-quantity]")) {
      event.target.setCustomValidity("");
    }
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const decreaseProductButton = event.target.closest("[data-quantity-decrease]");
    const increaseProductButton = event.target.closest("[data-quantity-increase]");
    const productQuantityButton = decreaseProductButton || increaseProductButton;

    if (productQuantityButton) {
      const input = productQuantityButton.closest(".cart-add-controls")?.querySelector("[data-item-quantity]");
      if (input instanceof HTMLInputElement) {
        const currentQuantity = Number(input.value);
        const nextQuantity = Number.isSafeInteger(currentQuantity) && currentQuantity >= 1 ? currentQuantity : 1;
        input.value = String(
          increaseProductButton && nextQuantity < Number.MAX_SAFE_INTEGER
            ? nextQuantity + 1
            : decreaseProductButton && nextQuantity > 1
              ? nextQuantity - 1
              : nextQuantity,
        );
        input.setCustomValidity("");
      }
      return;
    }

    const addButton = event.target.closest("[data-cart-add]");
    if (addButton) {
      const card = addButton.closest(".product-card");
      const name = card?.querySelector("h3")?.textContent.trim();
      const input = card?.querySelector("[data-item-quantity]");

      if (!name || !(input instanceof HTMLInputElement)) {
        return;
      }

      const quantity = getValidQuantity(input);
      if (quantity === null) {
        return;
      }

      const updatedQuantity = (cart.get(name) || 0) + quantity;
      const currentTotal = Array.from(cart.values()).reduce((total, itemQuantity) => total + itemQuantity, 0);
      if (!Number.isSafeInteger(updatedQuantity) || !Number.isSafeInteger(currentTotal + quantity)) {
        input.setCustomValidity("A quantidade total excede o limite permitido.");
        input.reportValidity();
        input.focus();
        return;
      }

      cart.set(name, updatedQuantity);
      input.value = "1";
      renderCart();
      return;
    }

    const lineDecreaseButton = event.target.closest("[data-cart-line-decrease]");
    const lineIncreaseButton = event.target.closest("[data-cart-line-increase]");
    const lineRemoveButton = event.target.closest("[data-cart-line-remove]");
    const lineButton = lineDecreaseButton || lineIncreaseButton || lineRemoveButton;

    if (lineButton) {
      const name = lineButton.dataset.cartItem;
      const quantity = name ? cart.get(name) : undefined;
      if (!name || quantity === undefined) {
        return;
      }

      if (lineRemoveButton || (lineDecreaseButton && quantity <= 1)) {
        cart.delete(name);
      } else if (lineDecreaseButton) {
        cart.set(name, quantity - 1);
      } else if (lineIncreaseButton && quantity < Number.MAX_SAFE_INTEGER) {
        cart.set(name, quantity + 1);
      }
      renderCart();
    }
  });

  checkoutLink.addEventListener("click", (event) => {
    if (cart.size === 0) {
      event.preventDefault();
    }
  });

  renderCart();
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
  setupCart();
  setupWhatsAppLinks();
  setCurrentYear();
});
