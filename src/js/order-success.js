// Order success page logic

import { requireAuth, getCurrentCustomer } from './auth.js';
import * as storage from './storage.js';
import { formatCurrency, escapeHtml, getQueryParam, formatDate } from './utils.js';

const container = () => document.getElementById('success-content');

const init = () => {
  if (!requireAuth()) return;
  const c = container();
  if (!c) return;
  const cust = getCurrentCustomer();
  const orderNo = getQueryParam('order') || (sessionStorage.getItem('last_order_number') || '');
  const order = orderNo ? storage.getOrderById(cust.id, orderNo) : null;

  if (!order) {
    c.innerHTML = `
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <i data-lucide="check-circle" class="w-16 h-16 mx-auto text-green-500 mb-4"></i>
        <h2 class="text-2xl font-bold mb-2">Order Placed</h2>
        <p class="text-gray-500 mb-6">Your order has been placed successfully.</p>
        <a href="../pages/products.html" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Continue Shopping</a>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  c.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center mb-6">
      <i data-lucide="check-circle" class="w-20 h-20 mx-auto text-green-500 mb-4"></i>
      <h1 class="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
      <p class="text-gray-500 mb-6">Thank you for your purchase. Your order has been received.</p>
      <div class="inline-block bg-gray-50 rounded-lg px-6 py-3 mb-6">
        <p class="text-sm text-gray-500">Order Number</p>
        <p class="text-xl font-bold text-blue-600">${escapeHtml(order.orderNumber)}</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <a href="../pages/order-details.html?id=${encodeURIComponent(order.orderNumber)}" class="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition">View Order</a>
        <a href="../pages/products.html" class="border border-gray-200 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition">Continue Shopping</a>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-bold mb-4">Order Details</h2>
      <div class="grid md:grid-cols-2 gap-4 text-sm mb-4">
        <div><span class="text-gray-500">Order Date:</span> ${formatDate(order.createdAt)}</div>
        <div><span class="text-gray-500">Payment:</span> ${escapeHtml(order.paymentMethod)}</div>
        <div><span class="text-gray-500">Status:</span> ${escapeHtml(order.status)}</div>
        <div><span class="text-gray-500">Total:</span> <span class="font-bold text-blue-600">${formatCurrency(order.total)}</span></div>
      </div>
      <div class="border-t border-gray-200 pt-4 space-y-3">
        ${order.items.map((it) => `
          <div class="flex items-center gap-3">
            <img src="${escapeHtml(it.image)}" alt="${escapeHtml(it.title)}" class="w-12 h-12 object-contain bg-gray-50 rounded" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium line-clamp-1">${escapeHtml(it.title)}</p>
              <p class="text-xs text-gray-500">${formatCurrency(it.price)} x ${it.quantity}</p>
            </div>
            <span class="text-sm font-semibold">${formatCurrency(it.subtotal)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
