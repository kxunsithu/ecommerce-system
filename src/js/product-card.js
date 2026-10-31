// Reusable product card component

import { formatCurrency, renderStars, escapeHtml } from './utils.js';
import { isAuthenticated, getCurrentCustomer } from './auth.js';
import * as api from './api.js';
import * as storage from './storage.js';
import { showToast } from './toast.js';

const isPages = () => window.location.pathname.includes('/pages/');
const root = () => (isPages() ? '../' : '');

export const createProductCard = (product) => {
  const p = product;
  const detailsUrl = `${root()}pages/product-details.html?id=${encodeURIComponent(p.id)}`;
  const image = p.image || 'https://via.placeholder.com/300';

  const card = document.createElement('div');
  card.className = 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden card-hover flex flex-col';
  card.innerHTML = `
    <a href="${detailsUrl}" class="block bg-gray-50 p-4 h-48 flex items-center justify-center">
      <img src="${escapeHtml(image)}" alt="${escapeHtml(p.title)}" class="max-h-40 object-contain" loading="lazy" />
    </a>
    <div class="p-4 flex flex-col flex-1">
      <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">${escapeHtml(p.category)}</p>
      <h3 class="font-semibold text-gray-800 text-sm line-clamp-2 mb-2 flex-1">
        <a href="${detailsUrl}" class="hover:text-blue-600">${escapeHtml(p.title)}</a>
      </h3>
      <div class="flex items-center gap-1 mb-2">${renderStars(p.rating)}</div>
      <div class="flex items-center justify-between mt-auto">
        <span class="font-bold text-blue-600">${formatCurrency(p.price)}</span>
        <div class="flex items-center gap-2">
          <a href="${detailsUrl}" class="text-xs text-gray-600 hover:text-blue-600">View</a>
          <button class="add-to-cart-btn bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition" data-id="${p.id}">
            <i data-lucide="plus" class="w-3 h-3 inline"></i> Cart
          </button>
        </div>
      </div>
    </div>
  `;

  const btn = card.querySelector('.add-to-cart-btn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleAddToCart(p.id);
    });
  }
  return card;
};

const handleAddToCart = async (productId) => {
  if (!isAuthenticated()) {
    const here = window.location.pathname + window.location.search;
    const loginUrl = isPages() ? 'login.html' : 'pages/login.html';
    window.location.href = `${loginUrl}?redirect=${encodeURIComponent(here)}`;
    return;
  }
  try {
    const raw = await api.getProductById(productId);
    const p = api.normalizeProduct(raw);
    const cust = getCurrentCustomer();
    if (!cust) return;
    const cart = storage.getCart(cust.id);
    const existing = cart.find((it) => it.id === p.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image,
        quantity: 1,
      });
    }
    storage.setCart(cust.id, cart);
    showToast('Added to cart', 'success');
    // update navbar count
    const countEl = document.getElementById('cart-count');
    if (countEl) {
      const total = cart.reduce((s, it) => s + it.quantity, 0);
      // total across cart already includes; but navbar shows all items
      const all = storage.getCart(cust.id).reduce((s, it) => s + it.quantity, 0);
      countEl.textContent = all;
    }
  } catch (e) {
    showToast('Failed to add to cart', 'error');
  }
};

export const renderProductGrid = (container, products) => {
  if (!container) return;
  container.innerHTML = '';
  if (!products || products.length === 0) {
    container.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
        <i data-lucide="inbox" class="w-12 h-12 mb-3"></i>
        <p class="text-sm">No products found.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }
  products.forEach((p) => {
    container.appendChild(createProductCard(p));
  });
  if (window.lucide) window.lucide.createIcons();
};
