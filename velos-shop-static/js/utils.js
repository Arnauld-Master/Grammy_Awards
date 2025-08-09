(function(){
  const CURRENCY = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
  const CART_KEY = 'velos_cart_v1';

  function formatPrice(euros) { return CURRENCY.format(euros); }
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
  }
  function setCart(items) { localStorage.setItem(CART_KEY, JSON.stringify(items)); updateCartCount(); }
  function updateCartCount() {
    const count = getCart().reduce((sum, it) => sum + it.quantity, 0);
    const el = document.getElementById('nav-cart-count');
    if (el) el.textContent = String(count);
  }
  function addToCart(productId, quantity = 1) {
    const items = getCart();
    const idx = items.findIndex(i => i.productId === productId);
    if (idx >= 0) items[idx].quantity += quantity; else items.push({ productId, quantity });
    setCart(items);
  }
  function removeFromCart(productId) {
    const items = getCart().filter(i => i.productId !== productId);
    setCart(items);
  }
  function updateQuantity(productId, quantity) {
    const items = getCart().map(i => i.productId === productId ? { ...i, quantity } : i).filter(i => i.quantity > 0);
    setCart(items);
  }
  function clearCart() { setCart([]); }
  function getProductById(id) { return (window.BIKES || []).find(p => p.id === id); }

  function renderBikeCard(bike) {
    return `
      <article class="card">
        <img class="card-media" src="${bike.image}" alt="${bike.name}" loading="lazy" />
        <div class="card-body">
          <h3 class="card-title">${bike.name}</h3>
          <p class="card-desc">${bike.description}</p>
          <div class="card-row">
            <div>
              <div class="price">${formatPrice(bike.price)}</div>
              <div class="rating">★ ${bike.rating.toFixed(1)}</div>
            </div>
            <button class="btn btn-primary" data-add="${bike.id}">Ajouter</button>
          </div>
        </div>
      </article>`;
  }

  function mountYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
  }

  window.ShopUtils = {
    formatPrice,
    getCart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getProductById,
    renderBikeCard,
    updateCartCount,
    mountYear,
  };

  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    mountYear();
  });
})();