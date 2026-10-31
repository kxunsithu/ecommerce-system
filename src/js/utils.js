// Common helper functions

export const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return `$${num.toFixed(2)}`;
};

export const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const generateId = () => {
  return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
};

export const generateOrderNumber = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `ORD-${y}${m}${d}-${rand}`;
};

export const escapeHtml = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
};

export const isValidPhone = (phone) => {
  if (!phone) return false;
  const digits = String(phone).replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

export const getQueryParam = (name) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
};

export const redirect = (path) => {
  window.location.href = path;
};

export const goBackOr = (fallback) => {
  if (window.history.length > 1) window.history.back();
  else window.location.href = fallback;
};

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const renderStars = (rating) => {
  const r = Math.round(Number(rating) || 0);
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= r) html += '<i data-lucide="star" class="w-4 h-4 star-filled fill-current"></i>';
    else html += '<i data-lucide="star" class="w-4 h-4 star-empty"></i>';
  }
  return html;
};

export const refreshIcons = () => {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

export const showLoading = (container, message = 'Loading...') => {
  if (!container) return;
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center py-16 text-gray-500">
      <div class="spinner mb-4"></div>
      <p class="text-sm">${escapeHtml(message)}</p>
    </div>
  `;
};

export const showError = (container, message = 'Something went wrong.') => {
  if (!container) return;
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center py-16 text-red-500">
      <i data-lucide="alert-circle" class="w-10 h-10 mb-3"></i>
      <p class="text-sm text-center">${escapeHtml(message)}</p>
    </div>
  `;
  refreshIcons();
};

export const showEmpty = (container, message = 'No items found.', icon = 'inbox') => {
  if (!container) return;
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center py-16 text-gray-400">
      <i data-lucide="${icon}" class="w-12 h-12 mb-3"></i>
      <p class="text-sm text-center">${escapeHtml(message)}</p>
    </div>
  `;
  refreshIcons();
};

export const relativePath = (fromPages = false) => {
  return fromPages ? '../' : '';
};
