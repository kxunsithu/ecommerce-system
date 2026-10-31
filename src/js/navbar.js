// Responsive navigation bar

import { isAuthenticated, getCurrentCustomer, logoutCustomer } from './auth.js';
import * as storage from './storage.js';
import { refreshIcons } from './utils.js';

const isPages = () => window.location.pathname.includes('/pages/');

const root = () => (isPages() ? '../' : '');

export const renderNavbar = (containerSelector = '#navbar') => {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const authed = isAuthenticated();
  const customer = getCurrentCustomer();
  const cartCount = authed ? getCartCount(customer.id) : 0;

  const home = root() + 'index.html';
  const products = root() + 'pages/products.html';
  const cart = root() + 'pages/cart.html';
  const orders = root() + 'pages/orders.html';
  const profile = root() + 'pages/profile.html';
  const login = root() + 'pages/login.html';
  const register = root() + 'pages/register.html';
  const about = root() + 'pages/about.html';
  const contact = root() + 'pages/contact.html';

  container.innerHTML = `
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <a href="${home}" class="flex items-center gap-2 font-bold text-xl text-blue-600">
            <i data-lucide="shopping-bag" class="w-6 h-6"></i>
            <span>ShopEase</span>
          </a>

          <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <a href="${home}" class="hover:text-blue-600 transition">Home</a>
            <a href="${products}" class="hover:text-blue-600 transition">Products</a>
            <a href="${about}" class="hover:text-blue-600 transition">About</a>
            <a href="${contact}" class="hover:text-blue-600 transition">Contact</a>
          </nav>

          <div class="flex items-center gap-3">
            ${authed ? `
              <a href="${cart}" class="relative p-2 text-gray-700 hover:text-blue-600 transition" aria-label="Cart">
                <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                <span id="cart-count" class="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">${cartCount}</span>
              </a>
              <div class="hidden md:flex items-center gap-3">
                <a href="${profile}" class="text-sm font-medium text-gray-700 hover:text-blue-600 transition flex items-center gap-1">
                  <i data-lucide="user" class="w-4 h-4"></i> ${escapeHtml(customer.fullName || customer.username)}
                </a>
                <button id="logout-btn" class="text-sm font-medium text-red-600 hover:text-red-700 transition">Logout</button>
              </div>
            ` : `
              <a href="${login}" class="text-sm font-medium text-gray-700 hover:text-blue-600 transition">Login</a>
              <a href="${register}" class="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Register</a>
            `}
            <button id="mobile-menu-btn" class="md:hidden p-2 text-gray-700" aria-label="Menu">
              <i data-lucide="menu" class="w-5 h-5"></i>
            </button>
          </div>
        </div>

        <div id="mobile-menu" class="mobile-menu md:hidden">
          <div class="flex flex-col gap-2 pb-4 text-sm font-medium text-gray-700">
            <a href="${home}" class="py-2 hover:text-blue-600">Home</a>
            <a href="${products}" class="py-2 hover:text-blue-600">Products</a>
            <a href="${about}" class="py-2 hover:text-blue-600">About</a>
            <a href="${contact}" class="py-2 hover:text-blue-600">Contact</a>
            ${authed ? `
              <a href="${cart}" class="py-2 hover:text-blue-600">Cart (${cartCount})</a>
              <a href="${orders}" class="py-2 hover:text-blue-600">Orders</a>
              <a href="${profile}" class="py-2 hover:text-blue-600">Profile</a>
              <button id="mobile-logout-btn" class="text-left py-2 text-red-600">Logout</button>
            ` : `
              <a href="${login}" class="py-2 hover:text-blue-600">Login</a>
              <a href="${register}" class="py-2 hover:text-blue-600">Register</a>
            `}
          </div>
        </div>
      </div>
    </header>
  `;

  // wire up
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logoutCustomer();
      window.location.href = root() + 'index.html';
    });
  }
  const mobileLogout = document.getElementById('mobile-logout-btn');
  if (mobileLogout) {
    mobileLogout.addEventListener('click', () => {
      logoutCustomer();
      window.location.href = root() + 'index.html';
    });
  }

  refreshIcons();
};

export const updateCartCount = () => {
  const customer = getCurrentCustomer();
  if (!customer) return;
  const count = getCartCount(customer.id);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = count;
};

function getCartCount(customerId) {
  const items = storage.getCart(customerId);
  return items.reduce((sum, it) => sum + (it.quantity || 0), 0);
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
