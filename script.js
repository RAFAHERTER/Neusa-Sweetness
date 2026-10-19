const WHATSAPP_NUMBER = "5519993492366";

const produtos = [
  {
    id: 1,
    nome: "Brigadeiro Tradicional",
    descricao: "O clássico brigadeiro de chocolate, com sabor intenso e textura cremosa.",
    preco: "",
    imagem: "",
    categoria: "Clássicos",
    badge: "",
  },
  {
    id: 2,
    nome: "Brigadeiro Tradicional com Uva",
    descricao: "A combinação do brigadeiro de chocolate com o frescor e a suculência da uva.",
    preco: "",
    imagem: "",
    categoria: "Clássicos",
    badge: "",
  },
  {
    id: 3,
    nome: "Brigadeiro de Chocolate com Café",
    descricao: "Chocolate e café em uma combinação marcante, aromática e equilibrada.",
    preco: "",
    imagem: "",
    categoria: "Com café",
    badge: "",
  },
  {
    id: 4,
    nome: "Brigadeiro de Castanha de Caju",
    descricao: "Um brigadeiro artesanal com o sabor característico e a textura da castanha de caju.",
    preco: "",
    imagem: "",
    categoria: "Premium",
    badge: "",
  },
  {
    id: 5,
    nome: "Brigadeiro de Ninho com Nutella",
    descricao: "A suavidade do leite em pó combinada com o sabor marcante do creme de avelã com cacau.",
    preco: "",
    imagem: "",
    categoria: "Premium",
    badge: "",
  },
  {
    id: 6,
    nome: "Brigadeiro de Queijo Gorgonzola com Geleia de Amora",
    descricao: "Uma combinação agridoce e surpreendente, que equilibra o sabor intenso do gorgonzola com a doçura frutada da geleia de amora.",
    preco: "",
    imagem: "",
    categoria: "Premium",
    badge: "Agridoce",
  },
];

function buildWhatsAppLink(message = "") {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function escapeHTML(texto) {
  return String(texto).replace(/[&<>"']/g, (caractere) => {
    const entidades = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entidades[caractere];
  });
}

function renderProducts() {
  const productGrid = document.getElementById("product-grid");

  if (!productGrid) {
    return;
  }

  productGrid.innerHTML = produtos
    .map((produto) => {
      const priceMarkup = produto.preco
        ? `<span class="product-price">R$ ${escapeHTML(produto.preco)}</span>`
        : "";
      const message = `Olá! Gostaria de saber o valor e a disponibilidade do ${produto.nome}.`;
      const href = buildWhatsAppLink(message);
      const badgeMarkup = produto.badge
        ? `<span class="chip">${escapeHTML(produto.badge)}</span>`
        : "";
      const imageMarkup = produto.imagem
        ? `<img src="${escapeHTML(produto.imagem)}" alt="${escapeHTML(produto.nome)}" loading="lazy" width="600" height="600" />`
        : `<div class="product-image-placeholder variant-${produto.id}"><span>${escapeHTML(produto.nome)}</span></div>`;

      return `
        <article class="product-card">
          <div class="product-image">
            ${imageMarkup}
          </div>

          <div class="product-body">
            <div class="product-header">
              <div>
                <p class="product-category">${escapeHTML(produto.categoria)}</p>
                <h3 class="product-name">${escapeHTML(produto.nome)}</h3>
              </div>
              ${badgeMarkup}
            </div>

            <p class="product-description">${escapeHTML(produto.descricao)}</p>

            <div class="product-footer">
              ${priceMarkup}
              <a
                class="product-action"
                href="${href}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pedir ${escapeHTML(produto.nome)} pelo WhatsApp"
              >
                Pedir pelo WhatsApp
              </a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
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

function setCurrentYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupNavigation();
  setupWhatsAppLinks();
  setCurrentYear();
});
