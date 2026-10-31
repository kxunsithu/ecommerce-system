// Reusable toast notifications

let container = null;

const ensureContainer = () => {
  if (container && document.body.contains(container)) return container;
  container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
};

const ICONS = {
  success: 'check-circle',
  error: 'x-circle',
  warning: 'alert-triangle',
  info: 'info',
};

export const showToast = (message, type = 'info', duration = 3000) => {
  const c = ensureContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = ICONS[type] || 'info';
  toast.innerHTML = `
    <i data-lucide="${icon}" class="w-5 h-5 flex-shrink-0 mt-0.5"></i>
    <span class="flex-1">${escapeHtmlSafe(message)}</span>
  `;
  c.appendChild(toast);
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
  const remove = () => {
    toast.classList.add('toast-hide');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 260);
  };
  if (duration > 0) setTimeout(remove, duration);
  toast.addEventListener('click', remove);
  return toast;
};

// avoid circular import of utils escapeHtml
function escapeHtmlSafe(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const success = (msg, dur) => showToast(msg, 'success', dur);
export const error = (msg, dur) => showToast(msg, 'error', dur);
export const warning = (msg, dur) => showToast(msg, 'warning', dur);
export const info = (msg, dur) => showToast(msg, 'info', dur);

export default { showToast, success, error, warning, info };
