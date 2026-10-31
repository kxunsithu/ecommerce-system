// Profile page logic

import { requireAuth, getCurrentCustomer, updateCustomer } from './auth.js';
import { showToast } from './toast.js';
import { isValidEmail, isValidPhone, escapeHtml, formatDate } from './utils.js';

const container = () => document.getElementById('profile-content');

const render = () => {
  const c = container();
  if (!c) return;
  const cust = getCurrentCustomer();
  if (!cust) return;

  c.innerHTML = `
    <div class="grid md:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center h-fit">
        <div class="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-2xl font-bold mb-3">
          ${(cust.fullName || cust.username || '?').charAt(0).toUpperCase()}
        </div>
        <h2 class="font-bold text-lg">${escapeHtml(cust.fullName)}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">@${escapeHtml(cust.username)}</p>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">Member since ${formatDate(cust.createdAt)}</p>
      </div>

      <div class="md:col-span-2 space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 class="text-lg font-bold mb-4">Account Information</h2>
          <form id="profile-form" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Full Name</label>
              <input id="pf-name" type="text" value="${escapeHtml(cust.fullName || '')}" class="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input id="pf-email" type="email" value="${escapeHtml(cust.email || '')}" class="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Username</label>
              <input id="pf-username" type="text" value="${escapeHtml(cust.username || '')}" class="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Phone Number</label>
              <input id="pf-phone" type="tel" value="${escapeHtml(cust.phone || '')}" class="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg" />
            </div>
            <button type="submit" class="bg-blue-600 dark:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition">Save Changes</button>
          </form>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 class="text-lg font-bold mb-4">Change Password</h2>
          <form id="password-form" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Current Password</label>
              <input id="cp-current" type="password" class="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">New Password</label>
              <input id="cp-new" type="password" class="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Confirm New Password</label>
              <input id="cp-confirm" type="password" class="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg" />
            </div>
            <button type="submit" class="bg-blue-600 dark:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  `;

  document.getElementById('profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const cust = getCurrentCustomer();
    const fullName = document.getElementById('pf-name').value.trim();
    const email = document.getElementById('pf-email').value.trim();
    const username = document.getElementById('pf-username').value.trim();
    const phone = document.getElementById('pf-phone').value.trim();

    if (!fullName || !email || !username) {
      showToast('Required fields missing', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showToast('Invalid email', 'error');
      return;
    }
    if (phone && !isValidPhone(phone)) {
      showToast('Invalid phone', 'error');
      return;
    }

    const res = updateCustomer(cust.id, { fullName, email, username, phone });
    if (res.success) {
      showToast('Profile updated', 'success');
      render();
    } else {
      showToast(res.message, 'error');
    }
  });

  document.getElementById('password-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const cust = getCurrentCustomer();
    const current = document.getElementById('cp-current').value;
    const newPw = document.getElementById('cp-new').value;
    const confirm = document.getElementById('cp-confirm').value;

    if (!current || !newPw || !confirm) {
      showToast('All fields required', 'error');
      return;
    }
    if (newPw.length < 6) {
      showToast('New password must be at least 6 chars', 'error');
      return;
    }
    if (newPw !== confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }

    const res = updateCustomer(cust.id, { password: newPw, currentPassword: current });
    if (res.success) {
      showToast('Password changed', 'success');
      document.getElementById('password-form').reset();
    } else {
      showToast(res.message, 'error');
    }
  });
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
