// Product details page logic

import * as api from './api.js';
import { formatCurrency, renderStars, escapeHtml, getQueryParam, showLoading, showError } from './utils.js';
import { renderProductGrid } from './product-card.js';
import { isAuthenticated, getCurrentCustomer } from './auth.js';
import * as storage from './storage.js';
import { showToast } from './toast.js';

const detailContainer = () => document.getElementById('product-detail');
const relatedContainer = () => document.getElementById('related');

let currentProduct = null;
let qty = 1;

const renderDetail = (p) => {
  const c = detailContainer();
  if (!c) return;
  c.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 grid md:grid-cols-2 gap-8">
      <div class="bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center p-6">
        <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" class="max-h-80 object-contain" />
      </div>
      <div>
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">${escapeHtml(p.category)}</p>
        <h1 class="text-2xl font-bold mb-3">${escapeHtml(p.title)}</h1>
        <div class="flex items-center gap-2 mb-3">
          ${renderStars(p.rating)}
          <span class="text-sm text-gray-500 dark:text-gray-400">(${p.ratingCount} reviews)</span>
        </div>
        <p class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">${formatCurrency(p.price)}</p>
        <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">${escapeHtml(p.description)}</p>

        <div class="flex items-center gap-3 mb-6">
          <span class="text-sm font-medium">Quantity:</span>
          <div class="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button id="qty-dec" class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">-</button>
            <span id="qty-val" class="px-4 py-2 border-x border-gray-200 dark:border-gray-700">${qty}</span>
            <button id="qty-inc" class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">+</button>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button id="add-to-cart-btn" class="flex-1 bg-blue-600 dark:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition flex items-center justify-center gap-2">
            <i data-lucide="shopping-cart" class="w-5 h-5"></i> Add to Cart
          </button>
          <a href="../pages/products.html" class="flex-1 text-center border border-gray-200 dark:border-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition">Continue Shopping</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById('qty-dec')?.addEventListener('click', () => {
    if (qty > 1) { qty--; updateQty(); }
  });
  document.getElementById('qty-inc')?.addEventListener('click', () => {
    qty++; updateQty();
  });
  document.getElementById('add-to-cart-btn')?.addEventListener('click', addToCart);

  if (window.lucide) window.lucide.createIcons();
};

const updateQty = () => {
  const el = document.getElementById('qty-val');
  if (el) el.textContent = qty;
};

const addToCart = async () => {
  if (!isAuthenticated()) {
    const here = window.location.pathname + window.location.search;
    window.location.href = `../pages/login.html?redirect=${encodeURIComponent(here)}`;
    return;
  }
  const cust = getCurrentCustomer();
  if (!cust || !currentProduct) return;
  const cart = storage.getCart(cust.id);
  const existing = cart.find((it) => it.id === currentProduct.id);
  if (existing) existing.quantity += qty;
  else cart.push({ id: currentProduct.id, title: currentProduct.title, price: currentProduct.price, image: currentProduct.image, quantity: qty });
  storage.setCart(cust.id, cart);
  showToast('Added to cart', 'success');
  qty = 1; updateQty();
};

const load = async () => {
  const id = getQueryParam('id');
  const c = detailContainer();
  if (!id) {
    if (c) c.innerHTML = '<p class="text-red-500 dark:text-red-400">Missing product id.</p>';
    return;
  }
  showLoading(c, 'Loading product...');
  try {
    const raw = await api.getProductById(id);
    currentProduct = api.normalizeProduct(raw);
    renderDetail(currentProduct);

    // related products: same category, exclude current
    const related = relatedContainer();
    showLoading(related, 'Loading related...');
    try {
      const catRaw = await api.getProductsByCategory(currentProduct.category);
      const relatedProducts = api.normalizeProducts(catRaw).filter((p) => p.id !== currentProduct.id).slice(0, 4);
      renderProductGrid(related, relatedProducts);
    } catch (e) {
      showError(related, 'Failed to load related products.');
    }
  } catch (e) {
    showError(c, 'Failed to load product.');
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', load);
} else {
  load();
}
