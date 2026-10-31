// Footer component

const isPages = () => window.location.pathname.includes('/pages/');
const root = () => (isPages() ? '../' : '');

export const renderFooter = (containerSelector = '#footer') => {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const home = root() + 'index.html';
  const products = root() + 'pages/products.html';
  const about = root() + 'pages/about.html';
  const contact = root() + 'pages/contact.html';

  container.innerHTML = `
    <footer class="bg-gray-900 dark:bg-black text-gray-300 dark:text-gray-400 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <i data-lucide="shopping-bag" class="w-6 h-6 text-blue-400 dark:text-blue-300"></i>
              <span>ShopEase</span>
            </div>
            <p class="text-sm text-gray-400 dark:text-gray-500">Your one-stop shop for quality products at great prices.</p>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-3">Quick Links</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="${home}" class="hover:text-white transition">Home</a></li>
              <li><a href="${products}" class="hover:text-white transition">Products</a></li>
              <li><a href="${about}" class="hover:text-white transition">About</a></li>
              <li><a href="${contact}" class="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-3">Customer</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="${root()}pages/login.html" class="hover:text-white transition">Login</a></li>
              <li><a href="${root()}pages/register.html" class="hover:text-white transition">Register</a></li>
              <li><a href="${root()}pages/cart.html" class="hover:text-white transition">Cart</a></li>
              <li><a href="${root()}pages/orders.html" class="hover:text-white transition">Orders</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-3">Contact</h4>
            <ul class="space-y-2 text-sm text-gray-400 dark:text-gray-500">
              <li class="flex items-center gap-2"><i data-lucide="mail" class="w-4 h-4"></i> support@shopease.com</li>
              <li class="flex items-center gap-2"><i data-lucide="phone" class="w-4 h-4"></i> +1 (555) 123-4567</li>
              <li class="flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4"></i> 123 Market St, City</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 dark:border-gray-600 mt-8 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © ${new Date().getFullYear()} ShopEase. All rights reserved. Demo project using Fake Store API.
        </div>
      </div>
    </footer>
  `;

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};
