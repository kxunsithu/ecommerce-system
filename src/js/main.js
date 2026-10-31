// Shared bootstrap for all pages
import { renderNavbar } from './navbar.js';
import { renderFooter } from './footer.js';
import { refreshIcons } from './utils.js';
import { initTheme } from './theme.js';

// Apply theme as early as possible
initTheme();

export const initShared = () => {
  renderNavbar();
  renderFooter();
  refreshIcons();
  initTheme();
};

// Auto-init when imported
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShared);
} else {
  initShared();
}
