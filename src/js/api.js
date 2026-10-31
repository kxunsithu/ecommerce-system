// Fake Store API integration

const BASE_URL = 'https://fakestoreapi.com';

const handleResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`API request failed (${response.status}): ${text || response.statusText}`);
  }
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

const request = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  return handleResponse(res);
};

export const getProducts = async (limit = null, sort = null) => {
  let path = '/products';
  const params = [];
  if (limit) params.push(`limit=${encodeURIComponent(limit)}`);
  if (sort) params.push(`sort=${encodeURIComponent(sort)}`);
  if (params.length) path += `?${params.join('&')}`;
  return request(path);
};

export const getProductById = async (id) => {
  if (!id) throw new Error('Product id is required');
  return request(`/products/${encodeURIComponent(id)}`);
};

export const getCategories = async () => {
  return request('/products/categories');
};

export const getProductsByCategory = async (category) => {
  if (!category) throw new Error('Category is required');
  return request(`/products/category/${encodeURIComponent(category)}`);
};

export const getLimitedProducts = async (limit = 8) => {
  return getProducts(limit);
};

export const getSortedProducts = async (sort = 'desc') => {
  return getProducts(null, sort);
};

// Normalize product data to a consistent shape
export const normalizeProduct = (p) => {
  if (!p) return null;
  return {
    id: p.id,
    title: p.title || 'Untitled Product',
    price: Number(p.price) || 0,
    description: p.description || '',
    category: p.category || 'uncategorized',
    image: p.image || '',
    rating: p.rating ? (p.rating.rate ?? 0) : (p.rate ?? 0),
    ratingCount: p.rating ? (p.rating.count ?? 0) : (p.count ?? 0),
  };
};

export const normalizeProducts = (list) => {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeProduct).filter(Boolean);
};
