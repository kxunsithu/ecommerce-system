// Checkout page logic

import { requireAuth, getCurrentCustomer } from './auth.js';
import * as storage from './storage.js';
import { formatCurrency, escapeHtml, isValidEmail, isValidPhone } from './utils.js';
import { showToast } from './toast.js';
import { generateOrderNumber } from './utils.js';

const container = () => document.getElementById('checkout-content');

const render = () => {
  const c = container();
  if (!c) return;
  const cust = getCurrentCustomer();
  if (!cust) return;
  const cart = storage.getCart(cust.id);

  if (!cart || cart.length === 0) {
    c.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
        <h2 class="text-xl font-semibold mb-2">Your cart is empty</h2>
        <a href="../pages/products.html" class="inline-block bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition">Shop Now</a>
      </div>
    `;
    return;
  }

  const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0);

  c.innerHTML = `
    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- Customer info -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 class="text-lg font-bold mb-4">Customer Information</h2>
          <form id="checkout-form" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Full Name *</label>
                <input id="co-name" type="text" value="${escapeHtml(cust.fullName || '')}" class="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Email *</label>
                <input id="co-email" type="email" value="${escapeHtml(cust.email || '')}" class="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg" />
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Phone Number *</label>
                <input id="co-phone" type="tel" value="${escapeHtml(cust.phone || '')}" class="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Delivery Address *</label>
                <input id="co-address" type="text" placeholder="Street, City, Country" class="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg" />
              </div>
            </div>

            <h2 class="text-lg font-bold mt-6 mb-4">Payment Method</h2>
            <div class="space-y-2">
              <label class="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-300 dark:hover:border-blue-700">
                <input type="radio" name="payment" value="Cash on Delivery" checked class="accent-blue-600" />
                <span>Cash on Delivery</span>
              </label>
              <label class="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-300 dark:hover:border-blue-700">
                <input type="radio" name="payment" value="Manual Mobile Payment" class="accent-blue-600" />
                <span>Manual Mobile Payment</span>
              </label>
            </div>

            <button type="submit" class="w-full bg-blue-600 dark:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition mt-6">Place Order</button>
          </form>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-fit">
        <h2 class="text-lg font-bold mb-4">Order Summary</h2>
        <div class="space-y-3 mb-4 max-h-64 overflow-y-auto">
          ${cart.map((it) => `
            <div class="flex items-center gap-3">
              <img src="${escapeHtml(it.image)}" alt="${escapeHtml(it.title)}" class="w-12 h-12 object-contain bg-gray-50 dark:bg-gray-900 rounded" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium line-clamp-1">${escapeHtml(it.title)}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">x${it.quantity}</p>
              </div>
              <span class="text-sm font-semibold">${formatCurrency(it.price * it.quantity)}</span>
            </div>
          `).join('')}
        </div>
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-sm">
          <div class="flex justify-between"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
          <div class="flex justify-between"><span>Shipping</span><span>Free</span></div>
          <div class="flex justify-between font-bold text-lg pt-2"><span>Total</span><span class="text-blue-600 dark:text-blue-400">${formatCurrency(subtotal)}</span></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    placeOrder();
  });
};

const placeOrder = () => {
  const cust = getCurrentCustomer();
  if (!cust) return;
  const cart = storage.getCart(cust.id);
  if (!cart || cart.length === 0) {
    showToast('Cart is empty', 'error');
    return;
  }

  const name = document.getElementById('co-name').value.trim();
  const email = document.getElementById('co-email').value.trim();
  const phone = document.getElementById('co-phone').value.trim();
  const address = document.getElementById('co-address').value.trim();
  const payment = document.querySelector('input[name="payment"]:checked')?.value || 'Cash on Delivery';

  // validation
  if (!name || !email || !phone || !address) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  if (!isValidEmail(email)) {
    showToast('Invalid email address', 'error');
    return;
  }
  if (!isValidPhone(phone)) {
    showToast('Invalid phone number', 'error');
    return;
  }

  const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0);

  const orderNo = generateOrderNumber();
  const order = {
    id: orderNo,
    orderNumber: orderNo,
    customerId: cust.id,
    customerInfo: { fullName: name, email, phone, address },
    items: cart.map((it) => ({
      id: it.id,
      title: it.title,
      price: it.price,
      image: it.image,
      quantity: it.quantity,
      subtotal: it.price * it.quantity,
    })),
    subtotal,
    total: subtotal,
    paymentMethod: payment,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  storage.addOrder(cust.id, order);
  storage.clearCart(cust.id);

  // store last order number for success page
  try { sessionStorage.setItem('last_order_number', order.orderNumber); } catch (e) {}

  showToast('Order placed successfully!', 'success');
  window.location.href = `../pages/order-success.html?order=${encodeURIComponent(order.orderNumber)}`;
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
