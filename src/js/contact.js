// Contact page logic

import { showToast } from './toast.js';
import { isValidEmail } from './utils.js';

const init = () => {
  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('c-name').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const message = document.getElementById('c-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showToast('Invalid email', 'error');
      return;
    }
    showToast('Message sent! (Demo only)', 'success');
    document.getElementById('contact-form').reset();
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
