(function(){
  const state = { q: '', category: '', sort: '' };

  function applyFilters(products) {
    let list = products;
    if (state.q) {
      const q = state.q.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (state.category) list = list.filter(p => p.category === state.category);
    switch (state.sort) {
      case 'price-asc': list = [...list].sort((a,b) => a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a,b) => b.price - a.price); break;
      case 'rating-desc': list = [...list].sort((a,b) => b.rating - a.rating); break;
      default: break;
    }
    return list;
  }

  function render() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    const products = applyFilters(window.BIKES || []);
    grid.innerHTML = products.map(ShopUtils.renderBikeCard).join('');
    Array.from(grid.children).forEach(card => card.style.gridColumn = 'span 3');
  }

  function bindFilters() {
    const search = document.getElementById('search');
    const category = document.getElementById('category');
    const sort = document.getElementById('sort');
    if (search) search.addEventListener('input', () => { state.q = search.value.trim(); render(); });
    if (category) category.addEventListener('change', () => { state.category = category.value; render(); });
    if (sort) sort.addEventListener('change', () => { state.sort = sort.value; render(); });
  }

  function bindAddToCart() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-add]');
      if (!btn) return;
      const id = btn.getAttribute('data-add');
      ShopUtils.addToCart(id, 1);
      btn.textContent = 'Ajouté !';
      setTimeout(() => btn.textContent = 'Ajouter', 900);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindFilters();
    render();
    bindAddToCart();
  });
})();