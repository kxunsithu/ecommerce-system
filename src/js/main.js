// Shared bootstrap for all pages
import { renderNavbar } from './navbar.js';
import { renderFooter } from './footer.js';
import { refreshIcons } from './utils.js';

export const initShared = () => {
  renderNavbar();
  renderFooter();
  refreshIcons();
};

// Auto-init when imported
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShared);
} else {
  initShared();
}
