// Order details page logic

import { requireAuth, getCurrentCustomer } from './auth.js';
import * as storage from './storage.js';
import { formatCurrency, escapeHtml, formatDate, getQueryParam } from './utils.js';

const container = () => document.getElementById('order-detail-content');

const init = () => {
  if (!requireAuth()) return;
  const c = container();
  if (!c) return;
  const cust = getCurrentCustomer();
  const id = getQueryParam('id');
  const order = id ? storage.getOrderById(cust.id, id) : null;

  if (!order) {
    c.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
        <i data-lucide="alert-circle" class="w-16 h-16 mx-auto text-red-400 dark:text-red-300 mb-4"></i>
        <h2 class="text-xl font-semibold mb-2">Order not found</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">We couldn't find that order.</p>
        <a href="../pages/orders.html" class="inline-block bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition">Back to Orders</a>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  c.innerHTML = `
    <div class="mb-4">
      <a href="../pages/orders.html" class="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Orders</a>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 class="text-2xl font-bold">Order ${escapeHtml(order.orderNumber)}</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm">${formatDate(order.createdAt)}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-sm bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 w-fit">${escapeHtml(order.status)}</span>
      </div>

      <div class="grid md:grid-cols-2 gap-6 border-t border-gray-100 dark:border-gray-700 pt-4">
        <div>
          <h3 class="font-semibold mb-2">Customer Information</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">${escapeHtml(order.customerInfo.fullName)}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">${escapeHtml(order.customerInfo.email)}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">${escapeHtml(order.customerInfo.phone)}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">${escapeHtml(order.customerInfo.address)}</p>
        </div>
        <div>
          <h3 class="font-semibold mb-2">Payment</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">${escapeHtml(order.paymentMethod)}</p>
          <h3 class="font-semibold mt-4 mb-2">Totals</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">Subtotal: ${formatCurrency(order.subtotal)}</p>
          <p class="text-sm font-bold text-blue-600 dark:text-blue-400">Total: ${formatCurrency(order.total)}</p>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <h2 class="text-lg font-bold mb-4">Ordered Items</h2>
      <div class="space-y-4">
        ${order.items.map((it) => `
          <div class="flex items-center gap-4 border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
            <img src="${escapeHtml(it.image)}" alt="${escapeHtml(it.title)}" class="w-16 h-16 object-contain bg-gray-50 dark:bg-gray-900 rounded" />
            <div class="flex-1 min-w-0">
              <p class="font-medium">${escapeHtml(it.title)}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">${formatCurrency(it.price)} x ${it.quantity}</p>
            </div>
            <span class="font-semibold">${formatCurrency(it.subtotal)}</span>
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
