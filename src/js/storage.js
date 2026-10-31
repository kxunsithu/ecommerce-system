// Centralized localStorage operations

const KEYS = {
  customers: 'customers',
  currentCustomer: 'current_customer',
  customerCarts: 'customer_carts',
  customerOrders: 'customer_orders',
};

const safeParse = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse localStorage key', key, e);
    return fallback;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Failed to set localStorage key', key, e);
    return false;
  }
};

// Customers
export const getCustomers = () => safeParse(KEYS.customers, []);
export const setCustomers = (customers) => safeSet(KEYS.customers, customers);

export const findCustomerByEmailOrUsername = (identifier) => {
  const customers = getCustomers();
  const id = String(identifier || '').trim().toLowerCase();
  return customers.find((c) =>
    String(c.email || '').toLowerCase() === id ||
    String(c.username || '').toLowerCase() === id
  );
};

export const getCustomerById = (id) => {
  const customers = getCustomers();
  return customers.find((c) => c.id === id) || null;
};

// Current customer
export const getCurrentCustomer = () => safeParse(KEYS.currentCustomer, null);
export const setCurrentCustomer = (customer) => {
  if (customer === null) {
    localStorage.removeItem(KEYS.currentCustomer);
    return true;
  }
  return safeSet(KEYS.currentCustomer, customer);
};
export const clearCurrentCustomer = () => localStorage.removeItem(KEYS.currentCustomer);

// Carts (grouped by customer id)
export const getCarts = () => safeParse(KEYS.customerCarts, {});
export const setCarts = (carts) => safeSet(KEYS.customerCarts, carts);

export const getCart = (customerId) => {
  if (!customerId) return [];
  const carts = getCarts();
  const cart = carts[customerId];
  return Array.isArray(cart) ? cart : [];
};

export const setCart = (customerId, items) => {
  if (!customerId) return false;
  const carts = getCarts();
  carts[customerId] = Array.isArray(items) ? items : [];
  return setCarts(carts);
};

export const clearCart = (customerId) => setCart(customerId, []);

// Orders (grouped by customer id)
export const getOrdersMap = () => safeParse(KEYS.customerOrders, {});
export const setOrdersMap = (map) => safeSet(KEYS.customerOrders, map);

export const getOrders = (customerId) => {
  if (!customerId) return [];
  const map = getOrdersMap();
  const orders = map[customerId];
  return Array.isArray(orders) ? orders : [];
};

export const setOrders = (customerId, orders) => {
  if (!customerId) return false;
  const map = getOrdersMap();
  map[customerId] = Array.isArray(orders) ? orders : [];
  return setOrdersMap(map);
};

export const addOrder = (customerId, order) => {
  const orders = getOrders(customerId);
  orders.unshift(order);
  return setOrders(customerId, orders);
};

export const getOrderById = (customerId, orderId) => {
  const orders = getOrders(customerId);
  return orders.find((o) => o.id === orderId || o.orderNumber === orderId) || null;
};

export const exportAll = () => ({
  customers: getCustomers(),
  currentCustomer: getCurrentCustomer(),
  carts: getCarts(),
  orders: getOrdersMap(),
});

export const resetAll = () => {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
};
