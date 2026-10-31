// Cart page logic

import { requireAuth, getCurrentCustomer } from './auth.js';
import * as storage from './storage.js';
import { formatCurrency, escapeHtml } from './utils.js';
import { showToast } from './toast.js';

const container = () => document.getElementById('cart-content');

const render = () => {
  const c = container();
  if (!c) return;
  const cust = getCurrentCustomer();
  if (!cust) return;
  const cart = storage.getCart(cust.id);

  if (!cart || cart.length === 0) {
    c.innerHTML = `
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <i data-lucide="shopping-cart" class="w-16 h-16 mx-auto text-gray-300 mb-4"></i>
        <h2 class="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p class="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <a href="../pages/products.html" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Continue Shopping</a>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0);

  c.innerHTML = `
    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-4">
        ${cart.map((it) => `
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center">
            <img src="${escapeHtml(it.image)}" alt="${escapeHtml(it.title)}" class="w-20 h-20 object-contain bg-gray-50 rounded" />
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-800 line-clamp-2">${escapeHtml(it.title)}</h3>
              <p class="text-blue-600 font-bold mt-1">${formatCurrency(it.price)}</p>
            </div>
            <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button class="qty-dec px-3 py-1 hover:bg-gray-100" data-id="${it.id}">-</button>
              <span class="px-3 py-1 border-x border-gray-200">${it.quantity}</span>
              <button class="qty-inc px-3 py-1 hover:bg-gray-100" data-id="${it.id}">+</button>
            </div>
            <div class="text-right w-24">
              <p class="font-bold">${formatCurrency(it.price * it.quantity)}</p>
              <button class="remove-btn text-red-500 text-xs mt-1 hover:text-red-700" data-id="${it.id}">Remove</button>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
        <h2 class="text-lg font-bold mb-4">Order Summary</h2>
        <div class="flex justify-between mb-2 text-sm"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
        <div class="flex justify-between mb-4 text-sm"><span>Shipping</span><span>Free</span></div>
        <div class="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg mb-6">
          <span>Total</span><span class="text-blue-600">${formatCurrency(subtotal)}</span>
        </div>
        <a href="../pages/checkout.html" class="block text-center bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition">Proceed to Checkout</a>
        <a href="../pages/products.html" class="block text-center mt-3 text-blue-600 text-sm hover:underline">Continue Shopping</a>
      </div>
    </div>
  `;

  // wire events
  c.querySelectorAll('.qty-dec').forEach((btn) => {
    btn.addEventListener('click', () => changeQty(btn.dataset.id, -1));
  });
  c.querySelectorAll('.qty-inc').forEach((btn) => {
    btn.addEventListener('click', () => changeQty(btn.dataset.id, 1));
  });
  c.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', () => removeItem(btn.dataset.id));
  });

  if (window.lucide) window.lucide.createIcons();
};

const changeQty = (id, delta) => {
  const cust = getCurrentCustomer();
  if (!cust) return;
  const cart = storage.getCart(cust.id);
  const item = cart.find((it) => it.id == id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) item.quantity = 1;
  storage.setCart(cust.id, cart);
  render();
  updateNavCount(cust.id);
};

const removeItem = (id) => {
  const cust = getCurrentCustomer();
  if (!cust) return;
  let cart = storage.getCart(cust.id);
  cart = cart.filter((it) => it.id != id);
  storage.setCart(cust.id, cart);
  showToast('Item removed', 'info');
  render();
  updateNavCount(cust.id);
};

const updateNavCount = (customerId) => {
  const cart = storage.getCart(customerId);
  const total = cart.reduce((s, it) => s + it.quantity, 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = total;
};

const init = () => {
  if (!requireAuth()) return;
  render();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
