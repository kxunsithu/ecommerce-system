// Login page logic

import { loginCustomer, isAuthenticated } from './auth.js';
import { showToast } from './toast.js';
import { getQueryParam } from './utils.js';

const init = () => {
  // redirect if already logged in
  if (isAuthenticated()) {
    const redir = getQueryParam('redirect');
    window.location.href = redir ? decodeURIComponent(redir) : '../index.html';
    return;
  }

  document.getElementById('forgot-pw')?.addEventListener('click', () => {
    showToast('Password recovery is unavailable without a backend. This is a demo.', 'info', 5000);
  });

  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('login-id').value.trim();
    const pw = document.getElementById('login-password').value;
    const remember = document.getElementById('remember-me').checked;

    if (!id || !pw) {
      showToast('Please enter your credentials', 'error');
      return;
    }

    const res = loginCustomer(id, pw, remember);
    if (res.success) {
      showToast('Login successful', 'success');
      const redir = getQueryParam('redirect');
      setTimeout(() => {
        if (redir) window.location.href = decodeURIComponent(redir);
        else window.location.href = '../index.html';
      }, 600);
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
