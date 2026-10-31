// Homepage logic

import * as api from './api.js';
import { renderProductGrid } from './product-card.js';
import { showLoading, showError, escapeHtml } from './utils.js';

const isPages = false;
const root = '';

const init = async () => {
  // Categories
  const catContainer = document.getElementById('categories');
  if (catContainer) {
    showLoading(catContainer, 'Loading categories...');
    try {
      const cats = await api.getCategories();
      catContainer.innerHTML = '';
      const icons = ['laptop', 'gem', 'shirt', 'sparkles'];
      cats.forEach((c, i) => {
        const a = document.createElement('a');
        a.href = `./pages/products.html?category=${encodeURIComponent(c)}`;
        a.className = 'bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center hover:border-blue-300 hover:shadow-md transition capitalize font-medium';
        a.innerHTML = `<i data-lucide="${icons[i % icons.length]}" class="w-6 h-6 mx-auto text-blue-600 mb-2"></i><div>${escapeHtml(c)}</div>`;
        catContainer.appendChild(a);
      });
      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      showError(catContainer, 'Failed to load categories.');
    }
  }

  // Featured products (limit 8)
  const featured = document.getElementById('featured');
  if (featured) {
    showLoading(featured, 'Loading products...');
    try {
      const raw = await api.getLimitedProducts(8);
      const products = api.normalizeProducts(raw);
      renderProductGrid(featured, products);
    } catch (e) {
      showError(featured, 'Failed to load products.');
    }
  }

  // Latest products (sort desc, limit 4)
  const latest = document.getElementById('latest');
  if (latest) {
    showLoading(latest, 'Loading products...');
    try {
      const raw = await api.getSortedProducts('desc');
      const products = api.normalizeProducts(raw).slice(0, 4);
      renderProductGrid(latest, products);
    } catch (e) {
      showError(latest, 'Failed to load products.');
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
