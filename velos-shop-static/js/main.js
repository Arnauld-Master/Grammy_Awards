(function(){
  function renderFeatured() {
    const container = document.getElementById('featured-grid');
    if (!container || !Array.isArray(window.BIKES)) return;
    const featured = window.BIKES.slice(0, 4);
    container.innerHTML = featured.map(ShopUtils.renderBikeCard).join('');
    container.classList.add('grid');
    // set grid spans responsively
    Array.from(container.children).forEach(card => card.style.gridColumn = 'span 3');

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-add]');
      if (!btn) return;
      const id = btn.getAttribute('data-add');
      ShopUtils.addToCart(id, 1);
      btn.textContent = 'Ajouté !';
      setTimeout(() => btn.textContent = 'Ajouter', 900);
    });
  }

  document.addEventListener('DOMContentLoaded', renderFeatured);
})();