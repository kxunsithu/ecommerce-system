// Register page logic

import { registerCustomer, isAuthenticated } from './auth.js';
import { showToast } from './toast.js';
import { isValidEmail, isValidPhone } from './utils.js';

const init = () => {
  if (isAuthenticated()) {
    window.location.href = '../index.html';
    return;
  }

  document.getElementById('register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    // validation
    if (!fullName || !email || !username || !phone || !password || !confirm) {
      showToast('All fields are required', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showToast('Invalid email format', 'error');
      return;
    }
    if (!isValidPhone(phone)) {
      showToast('Invalid phone number', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (password !== confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }

    const res = registerCustomer({ fullName, email, username, phone, password });
    if (res.success) {
      showToast('Registration successful! Please login.', 'success');
      setTimeout(() => { window.location.href = './login.html'; }, 800);
    } else {
      showToast(res.message, 'error');
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
