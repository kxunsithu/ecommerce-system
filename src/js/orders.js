// Orders page logic (list + handles order-details via query param? separate page)

import { requireAuth, getCurrentCustomer } from './auth.js';
import * as storage from './storage.js';
import { formatCurrency, escapeHtml, formatDate, getQueryParam } from './utils.js';

const container = () => document.getElementById('orders-content');

const renderList = () => {
  const c = container();
  if (!c) return;
  const cust = getCurrentCustomer();
  const orders = storage.getOrders(cust.id);

  if (!orders || orders.length === 0) {
    c.innerHTML = `
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <i data-lucide="package" class="w-16 h-16 mx-auto text-gray-300 mb-4"></i>
        <h2 class="text-xl font-semibold mb-2">No orders yet</h2>
        <p class="text-gray-500 mb-6">You haven't placed any orders.</p>
        <a href="../pages/products.html" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Start Shopping</a>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  c.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-600">
            <tr>
              <th class="text-left px-4 py-3">Order Number</th>
              <th class="text-left px-4 py-3">Date</th>
              <th class="text-left px-4 py-3">Payment</th>
              <th class="text-left px-4 py-3">Status</th>
              <th class="text-right px-4 py-3">Total</th>
              <th class="text-right px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map((o) => `
              <tr class="border-t border-gray-100">
                <td class="px-4 py-3 font-medium text-blue-600">${escapeHtml(o.orderNumber)}</td>
                <td class="px-4 py-3 text-gray-500">${formatDate(o.createdAt)}</td>
                <td class="px-4 py-3">${escapeHtml(o.paymentMethod)}</td>
                <td class="px-4 py-3"><span class="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">${escapeHtml(o.status)}</span></td>
                <td class="px-4 py-3 text-right font-semibold">${formatCurrency(o.total)}</td>
                <td class="px-4 py-3 text-right">
                  <a href="../pages/order-details.html?id=${encodeURIComponent(o.orderNumber)}" class="text-blue-600 hover:underline">View Details</a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

const init = () => {
  if (!requireAuth()) return;
  renderList();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
