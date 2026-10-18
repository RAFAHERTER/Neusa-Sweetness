const WHATSAPP_NUMBER = "";
const INSTAGRAM_PROFILE = "https://www.instagram.com/SeuPerfilAqui";
const DOCERIA_NOME = "NeusaSweetness";

const produtos = [
  {
    id: 1,
    nome: "Brigadeiro Tradicional",
    descricao: "O clássico brigadeiro de chocolate, com sabor intenso e textura cremosa.",
    preco: "",
    imagem: "",
    categoria: "Clássico",
    badge: "",
  },
  {
    id: 2,
    nome: "Brigadeiro Tradicional com Uva",
    descricao: "A combinação do brigadeiro de chocolate com o frescor e a suculência da uva.",
    preco: "",
    imagem: "",
    categoria: "Frutas",
    badge: "",
  },
  {
    id: 3,
    nome: "Brigadeiro de Chocolate com Café",
    descricao: "Chocolate e café em uma combinação marcante, aromática e equilibrada.",
    preco: "",
    imagem: "",
    categoria: "Especial",
    badge: "",
  },
  {
    id: 4,
    nome: "Brigadeiro de Castanha de Caju",
    descricao: "Um brigadeiro artesanal com o sabor característico e a textura da castanha de caju.",
    preco: "",
    imagem: "",
    categoria: "Nobre",
    badge: "",
  },
  {
    id: 5,
    nome: "Brigadeiro de Ninho com Nutella",
    descricao: "A suavidade do leite em pó combinada com o sabor marcante do creme de avelã com cacau.",
    preco: "",
    imagem: "",
    categoria: "Avelã",
    badge: "",
  },
  {
    id: 6,
    nome: "Brigadeiro de Queijo Gorgonzola com Geleia de Amora",
    descricao: "Uma combinação agridoce e surpreendente, que equilibra o sabor intenso do gorgonzola com a doçura frutada da geleia de amora.",
    preco: "",
    imagem: "",
    categoria: "Especial",
    badge: "Agridoce",
  },
];

function buildWhatsAppLink(message = "") {
  if (!WHATSAPP_NUMBER) {
    console.warn(
      "Configure a constante WHATSAPP_NUMBER em script.js antes de usar os links do WhatsApp."
    );
    return "#contato";
  }

  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function renderProducts() {
  const productGrid = document.getElementById("product-grid");

  if (!productGrid) {
    return;
  }

  productGrid.innerHTML = produtos
    .map((produto) => {
      const priceLabel = produto.preco ? `R$ ${produto.preco}` : "Consulte o valor";
      const message = `Olá! Gostaria de saber o valor e a disponibilidade do ${produto.nome}.`;
      const href = buildWhatsAppLink(message);
      const hasNumber = Boolean(WHATSAPP_NUMBER);
      const badgeMarkup = produto.badge ? `<span class="chip">${produto.badge}</span>` : "";
      const imageMarkup = produto.imagem
        ? `<img src="${produto.imagem}" alt="${produto.nome}" loading="lazy" />`
        : `<div class="product-image-placeholder variant-${produto.id}"><span>${produto.nome}</span></div>`;

      return `
        <article class="product-card">
          <div class="product-image">
            ${imageMarkup}
          </div>

          <div class="product-body">
            <div class="product-header">
              <div>
                <p class="product-category">${produto.categoria}</p>
                <h3 class="product-name">${produto.nome}</h3>
              </div>
              ${badgeMarkup}
            </div>

            <p class="product-description">${produto.descricao}</p>

            <div class="product-footer">
              <span class="product-price">${priceLabel}</span>
              <a
                class="product-action ${hasNumber ? "" : "is-disabled"}"
                href="${href}"
                target="${hasNumber ? "_blank" : "_self"}"
                rel="${hasNumber ? "noopener noreferrer" : ""}"
                aria-label="Pedir ${produto.nome} pelo WhatsApp"
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

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setWhatsAppLinksFromButton(button) {
  const message = "Olá! Gostaria de conhecer os sabores e fazer meu pedido.";
  const targetLink = buildWhatsAppLink(message);

  if (!WHATSAPP_NUMBER) {
    button.classList.add("is-disabled");
    button.setAttribute("aria-disabled", "true");
    button.setAttribute("href", "#contato");
    return;
  }

  button.href = targetLink;
  button.setAttribute("target", "_blank");
  button.setAttribute("rel", "noopener noreferrer");
}

function setupExternalLinks() {
  const instagramLinks = document.querySelectorAll('a[href="https://www.instagram.com/SeuPerfilAqui"]');

  instagramLinks.forEach((link) => {
    link.href = INSTAGRAM_PROFILE;
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  const whatsappButtons = document.querySelectorAll(
    ".header-button, .primary-button, .secondary-button, .floating-whatsapp"
  );

  whatsappButtons.forEach((button) => {
    if (button.id === "floating-whatsapp") {
      setWhatsAppLinksFromButton(button);
      return;
    }

    const href = button.getAttribute("href");
    if (href === "#contato") {
      setWhatsAppLinksFromButton(button);
    }
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
  setupExternalLinks();
  setCurrentYear();
});
