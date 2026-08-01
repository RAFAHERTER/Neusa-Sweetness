const produtos = [
  { id:1, nome:'Brigadeiro Tradicional', emoji:'🍫', categoria:'classico', preco:4.5, desc:'O clássico infalível com granulado de chocolate. Irresistível!', bg:'radial-gradient(135deg,#f5e6c8,#b5600b)' },
  { id:2, nome:'Brigadeiro de Leite Ninho', emoji:'🤍', categoria:'classico', preco:5.0, desc:'Cremoso, suave e envolvente. Feito com leite Ninho granulado.', bg:'radial-gradient(135deg,#fdf5e6,#d4a574)' },
  { id:3, nome:'Brigadeiro de Nutella', emoji:'🌰', categoria:'gourmet', preco:6.5, desc:'Cobertura generosa de Nutella com avelãs caramelizadas. Pura indulgência!', bg:'radial-gradient(135deg,#d4a574,#7a3a00)', novo:true },
  { id:4, nome:'Brigadeiro de Pistache', emoji:'🍃', categoria:'gourmet', preco:7.0, desc:'Pasta de pistache iraniano importado com raspas de limão siciliano.', bg:'radial-gradient(135deg,#d4ed92,#3d8b3d)', novo:true },
  { id:5, nome:'Brigadeiro de Morango', emoji:'🍓', categoria:'fruta', preco:5.5, desc:'Recheado com geleia de morango artesanal e cobertura de chocolate branco.', bg:'radial-gradient(135deg,#fde8d8,#c0392b)' },
  { id:6, nome:'Brigadeiro de Maracujá', emoji:'🌟', categoria:'fruta', preco:5.5, desc:'Combinação perfeita do azedinho do maracujá com o doce do chocolate.', bg:'radial-gradient(135deg,#fff9c4,#e8860a)' },
  { id:7, nome:'Brigadeiro Oreo', emoji:'⚫', categoria:'especial', preco:6.0, desc:'Com pedacinhos de biscoito Oreo por dentro e por fora. Crocante e delicioso!', bg:'radial-gradient(135deg,#888,#111)' },
  { id:8, nome:'Brigadeiro de Limão', emoji:'🍋', categoria:'fruta', preco:5.5, desc:'Leve, refrescante e delicioso. Com raspas de limão siciliano.', bg:'radial-gradient(135deg,#e8f5c0,#7dbb38)' },
  { id:9, nome:'Brigadeiro Churros', emoji:'🥐', categoria:'especial', preco:6.0, desc:'Recheio de doce de leite com cobertura de canela e açúcar. Sensação!', bg:'radial-gradient(135deg,#f5d5a0,#a0651a)', novo:true },
  { id:10, nome:'Brigadeiro de Amendoim', emoji:'🥜', categoria:'classico', preco:5.0, desc:'Crocante e cremoso com pasta de amendoim artesanal. Viciante!', bg:'radial-gradient(135deg,#f0d5a0,#9b6a3a)' },
  { id:11, nome:'Brigadeiro Belga', emoji:'✨', categoria:'gourmet', preco:8.0, desc:'Feito com chocolate belga 70% cacau. A versão mais premium da casa.', bg:'radial-gradient(135deg,#6a3a1a,#1a0800)', novo:true },
  { id:12, nome:'Brigadeiro Coco', emoji:'🥥', categoria:'classico', preco:4.5, desc:'Suave e aromático, com coco ralado natural fresco. Clássico de festa!', bg:'radial-gradient(135deg,#f0f0f0,#c8b490)' },
];

let cart = {};

function getTotal() {
  return Object.values(cart).reduce((sum, item) => sum + item.preco * item.qty, 0);
}

function getTotalQty() {
  return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
}

function updateCartUI() {
  const totalQty = getTotalQty();
  const countEl = document.getElementById('cartCount');
  countEl.textContent = totalQty;
  countEl.style.display = totalQty > 0 ? 'flex' : 'none';

  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');

  if (totalQty === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🍫</div>
        <p>Seu carrinho está vazio.<br>Escolha os brigadeiros no cardápio!</p>
      </div>`;
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'block';
  totalEl.textContent = 'R$ ' + getTotal().toFixed(2).replace('.', ',');

  itemsEl.innerHTML = Object.values(cart).map(item => `
    <div class="cart-item">
      <div class="ci-emoji">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.nome}</div>
        <div class="ci-price">R$ ${item.preco.toFixed(2).replace('.', ',')} cada</div>
      </div>
      <div class="ci-controls">
        <button class="ci-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="ci-qty">${item.qty}</span>
        <button class="ci-btn" onclick="changeQty(${item.id}, +1)">+</button>
      </div>
    </div>
  `).join('');
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  updateCartUI();
}

function addToCart(id) {
  const prod = produtos.find(p => p.id === id);
  if (!prod) return;
  if (cart[id]) {
    cart[id].qty++;
  } else {
    cart[id] = { ...prod, qty: 1 };
  }
  updateCartUI();
  showToast(`${prod.emoji} ${prod.nome} adicionado!`);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function openCart() {
  document.getElementById('cartPanel').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderProdutos(filter = 'todos') {
  const grid = document.getElementById('produtosGrid');
  grid.innerHTML = '';
  const filtered = filter === 'todos' ? produtos : produtos.filter(p => p.categoria === filter);
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'produto-card fade-in';
    card.innerHTML = `
      <div class="card-img" style="background:${p.bg}">
        <span style="filter:drop-shadow(0 2px 8px rgba(0,0,0,.3))">${p.emoji}</span>
        ${p.novo ? '<div class="card-badge-novo">Novo</div>' : ''}
      </div>
      <div class="card-body">
        <div class="card-category">${{classico:'Clássico', gourmet:'Gourmet', fruta:'Frutas', especial:'Especial'}[p.categoria]}</div>
        <div class="card-name">${p.nome}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-footer">
          <div class="card-price">R$ ${p.preco.toFixed(2).replace('.', ',')} <small>/ unid.</small></div>
          <button class="add-btn" onclick="addToCart(${p.id})" aria-label="Adicionar ao carrinho">+</button>
        </div>
      </div>`;
    grid.appendChild(card);
    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('visible')));
  });
}

document.querySelectorAll('.filtro-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProdutos(btn.dataset.filter);
  });
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (getTotalQty() === 0) return;
  const items = Object.values(cart).map(i => `${i.qty}x ${i.nome} (R$${(i.preco * i.qty).toFixed(2).replace('.', ',')})`).join('\n');
  const total = getTotal().toFixed(2).replace('.', ',');
  const msg = `Olá! Gostaria de fazer um pedido:\n\n${items}\n\n*Total: R$ ${total}*\n\nPode me confirmar disponibilidade?`;
  window.open(`https://wa.me/5519999999999?text=${encodeURIComponent(msg)}`, '_blank');
});

document.getElementById('cartFab').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);

document.getElementById('pedidoForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const tipo = document.getElementById('tipoPedido').value;
  const quantidade = document.getElementById('quantidade').value;
  const entrega = document.getElementById('entrega').value;
  const mensagem = document.getElementById('mensagem').value.trim();

  const msg = `Olá! Recebi um pedido pelo site 🎉\n\n👤 *Nome:* ${nome}\n📱 *WhatsApp:* ${telefone}\n🎂 *Tipo:* ${tipo}\n📦 *Quantidade:* ${quantidade} unidades\n🚗 *Entrega:* ${entrega}\n💬 *Detalhes:* ${mensagem || 'Não informado'}`;
  window.open(`https://wa.me/5519999999999?text=${encodeURIComponent(msg)}`, '_blank');

  document.getElementById('pedidoForm').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
});

window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 30);
});

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

renderProdutos();

const cardObserver = new MutationObserver(() => {
  document.querySelectorAll('.produto-card.fade-in:not([data-obs])').forEach(el => {
    el.dataset.obs = '1';
    observer.observe(el);
  });
});

cardObserver.observe(document.getElementById('produtosGrid'), { childList: true });
 