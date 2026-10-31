// Products page logic

import * as api from './api.js';
import { renderProductGrid } from './product-card.js';
import { showLoading, showError, debounce } from './utils.js';

let allProducts = [];
let categories = [];

const grid = () => document.getElementById('product-grid');
const searchInput = () => document.getElementById('search-input');
const categoryFilter = () => document.getElementById('category-filter');
const sortFilter = () => document.getElementById('sort-filter');

const load = async () => {
  const g = grid();
  showLoading(g, 'Loading products...');
  try {
    const [rawProducts, rawCats] = await Promise.all([api.getProducts(), api.getCategories()]);
    allProducts = api.normalizeProducts(rawProducts);
    categories = rawCats || [];

    // populate category filter
    const cf = categoryFilter();
    if (cf) {
      categories.forEach((c) => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c.charAt(0).toUpperCase() + c.slice(1);
        cf.appendChild(opt);
      });
    }

    // preselect category from URL
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category');
    if (catParam && cf) cf.value = catParam;

    applyFilters();
  } catch (e) {
    showError(g, 'Failed to load products.');
  }
};

const applyFilters = () => {
  const g = grid();
  let list = [...allProducts];

  const q = (searchInput()?.value || '').trim().toLowerCase();
  if (q) {
    list = list.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  const cat = categoryFilter()?.value || '';
  if (cat) {
    list = list.filter((p) => p.category === cat);
  }

  const sort = sortFilter()?.value || '';
  switch (sort) {
    case 'price-asc': list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'rating-desc': list.sort((a, b) => b.rating - a.rating); break;
    case 'name-asc': list.sort((a, b) => a.title.localeCompare(b.title)); break;
  }

  renderProductGrid(g, list);
};

const init = () => {
  load();
  const debounced = debounce(applyFilters, 250);
  searchInput()?.addEventListener('input', debounced);
  categoryFilter()?.addEventListener('change', applyFilters);
  sortFilter()?.addEventListener('change', applyFilters);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
