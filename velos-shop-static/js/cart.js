(function(){
  function computeTotals(items) {
    const enriched = items.map(i => ({ ...i, product: ShopUtils.getProductById(i.productId) })).filter(i => i.product);
    const subtotal = enriched.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    return { enriched, subtotal };
  }

  function renderCart() {
    const items = ShopUtils.getCart();
    const empty = document.getElementById('cart-empty');
    const content = document.getElementById('cart-content');
    const list = document.getElementById('cart-items');

    if (items.length === 0) {
      empty.classList.remove('hidden');
      content.classList.add('hidden');
      return;
    }

    empty.classList.add('hidden');
    content.classList.remove('hidden');

    const { enriched, subtotal } = computeTotals(items);
    list.innerHTML = enriched.map(({ productId, quantity, product }) => `
      <div class="cart-item" data-id="${productId}">
        <img src="${product.image}" alt="${product.name}" />
        <div>
          <p class="title">${product.name}</p>
          <p class="meta">${ShopUtils.formatPrice(product.price)} • ${product.category.toUpperCase()} • ★ ${product.rating.toFixed(1)}</p>
          <button class="btn danger" data-remove>Retirer</button>
        </div>
        <div class="qty">
          <button class="btn" data-dec>-</button>
          <input type="number" min="1" value="${quantity}" />
          <button class="btn" data-inc>+</button>
        </div>
      </div>
    `).join('');

    document.getElementById('subtotal').textContent = ShopUtils.formatPrice(subtotal);
    document.getElementById('shipping').textContent = subtotal >= 1000 ? 'Offerte' : ShopUtils.formatPrice(25);
    const total = subtotal + (subtotal >= 1000 ? 0 : 25);
    document.getElementById('total').textContent = ShopUtils.formatPrice(total);
  }

  function bindCartActions() {
    const list = document.getElementById('cart-items');
    list.addEventListener('click', (e) => {
      const item = e.target.closest('.cart-item');
      if (!item) return;
      const id = item.getAttribute('data-id');
      if (e.target.matches('[data-remove]')) {
        ShopUtils.removeFromCart(id); renderCart(); return;
      }
      if (e.target.matches('[data-inc]')) {
        const current = Number(item.querySelector('input').value) || 1;
        ShopUtils.updateQuantity(id, current + 1); renderCart(); return;
      }
      if (e.target.matches('[data-dec]')) {
        const current = Number(item.querySelector('input').value) || 1;
        ShopUtils.updateQuantity(id, Math.max(1, current - 1)); renderCart(); return;
      }
    });

    list.addEventListener('change', (e) => {
      const item = e.target.closest('.cart-item');
      if (!item) return;
      if (e.target.matches('input[type="number"]')) {
        const id = item.getAttribute('data-id');
        const val = Math.max(1, Number(e.target.value) || 1);
        ShopUtils.updateQuantity(id, val); renderCart();
      }
    });

    document.getElementById('clear-cart').addEventListener('click', () => {
      if (confirm('Voulez-vous vider le panier ?')) { ShopUtils.clearCart(); renderCart(); }
    });

    document.getElementById('checkout').addEventListener('click', () => {
      alert('Merci ! Ceci est une démo. La finalisation de commande nécessite un backend.');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    bindCartActions();
  });
})();