// Customer authentication (frontend-only, localStorage)

import * as storage from './storage.js';

export const registerCustomer = (data) => {
  const customers = storage.getCustomers();
  const email = String(data.email || '').trim().toLowerCase();
  const username = String(data.username || '').trim().toLowerCase();

  // uniqueness checks
  if (customers.some((c) => String(c.email || '').toLowerCase() === email)) {
    return { success: false, message: 'Email is already registered.' };
  }
  if (customers.some((c) => String(c.username || '').toLowerCase() === username)) {
    return { success: false, message: 'Username is already taken.' };
  }

  const customer = {
    id: generateCustomerId(),
    fullName: String(data.fullName || '').trim(),
    email: String(data.email || '').trim(),
    username: String(data.username || '').trim(),
    phone: String(data.phone || '').trim(),
    password: String(data.password || ''),
    createdAt: new Date().toISOString(),
  };

  customers.push(customer);
  storage.setCustomers(customers);
  return { success: true, customer: sanitize(customer) };
};

export const loginCustomer = (identifier, password, remember = false) => {
  const customer = storage.findCustomerByEmailOrUsername(identifier);
  if (!customer) {
    return { success: false, message: 'No account found with that email or username.' };
  }
  if (customer.password !== String(password || '')) {
    return { success: false, message: 'Incorrect password.' };
  }
  const sessionCustomer = sanitize(customer);
  storage.setCurrentCustomer(sessionCustomer);
  // remember me: store a flag (demo only)
  try {
    if (remember) localStorage.setItem('remember_me', '1');
    else localStorage.removeItem('remember_me');
  } catch (e) {}
  return { success: true, customer: sessionCustomer };
};

export const logoutCustomer = () => {
  storage.clearCurrentCustomer();
  try { localStorage.removeItem('remember_me'); } catch (e) {}
};

export const getCurrentCustomer = () => storage.getCurrentCustomer();

export const isAuthenticated = () => {
  const c = storage.getCurrentCustomer();
  return !!c && !!c.id;
};

export const requireAuth = (redirectBack = true) => {
  if (isAuthenticated()) return true;
  const here = window.location.pathname + window.location.search;
  const loginUrl = isPagesDir() ? 'login.html' : 'pages/login.html';
  const target = redirectBack ? `${loginUrl}?redirect=${encodeURIComponent(here)}` : loginUrl;
  window.location.href = target;
  return false;
};

export const updateCustomer = (id, updates) => {
  const customers = storage.getCustomers();
  const idx = customers.findIndex((c) => c.id === id);
  if (idx === -1) return { success: false, message: 'Customer not found.' };

  // uniqueness checks for email/username if changed
  const newEmail = updates.email ? String(updates.email).trim().toLowerCase() : null;
  const newUsername = updates.username ? String(updates.username).trim().toLowerCase() : null;

  if (newEmail && customers.some((c, i) => i !== idx && String(c.email || '').toLowerCase() === newEmail)) {
    return { success: false, message: 'Email is already in use.' };
  }
  if (newUsername && customers.some((c, i) => i !== idx && String(c.username || '').toLowerCase() === newUsername)) {
    return { success: false, message: 'Username is already in use.' };
  }

  const c = customers[idx];
  if (updates.fullName !== undefined) c.fullName = String(updates.fullName).trim();
  if (updates.email !== undefined) c.email = String(updates.email).trim();
  if (updates.username !== undefined) c.username = String(updates.username).trim();
  if (updates.phone !== undefined) c.phone = String(updates.phone).trim();
  if (updates.password !== undefined && updates.password !== '') {
    // verify current password if provided
    if (updates.currentPassword && c.password !== updates.currentPassword) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    c.password = String(updates.password);
  }

  customers[idx] = c;
  storage.setCustomers(customers);

  // update session if same user
  const current = storage.getCurrentCustomer();
  if (current && current.id === id) {
    storage.setCurrentCustomer(sanitize(c));
  }
  return { success: true, customer: sanitize(c) };
};

// helpers
function generateCustomerId() {
  return 'cust_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

function sanitize(c) {
  if (!c) return null;
  const { password, ...rest } = c;
  return rest;
}

function isPagesDir() {
  return window.location.pathname.includes('/pages/');
}
