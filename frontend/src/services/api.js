import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to set auth headers
export const setAuthHeaders = (userId, userRole) => {
  api.defaults.headers['x-user-id'] = userId;
  api.defaults.headers['x-user-role'] = userRole;
};

// Helper function to clear auth headers
export const clearAuthHeaders = () => {
  delete api.defaults.headers['x-user-id'];
  delete api.defaults.headers['x-user-role'];
};

// Products API
export const productsAPI = {
  // Get all products (public)
  getAllProducts: (limit = 20, offset = 0) => 
    api.get(`/products?limit=${limit}&offset=${offset}`),
  
  // Get product by ID (public)
  getProductById: (id) => 
    api.get(`/products/${id}`),
  
  // Get product categories (public)
  getCategories: () => 
    api.get('/products/categories'),
  
  // Search products (public)
  searchProducts: (query, limit = 20, offset = 0) => 
    api.get(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`),
  
  // Get products by category (public)
  getProductsByCategory: (category, limit = 20, offset = 0) => 
    api.get(`/products/category/${encodeURIComponent(category)}?limit=${limit}&offset=${offset}`),
};

// Orders API
export const ordersAPI = {
  // Get available delivery slots (public)
  getAvailableDeliverySlots: () => 
    api.get('/orders/delivery-slots'),
  
  // Create order (requires auth)
  createOrder: (orderData) => 
    api.post('/orders', orderData),
  
  // Get orders by user ID (requires auth)
  getOrdersByUserId: (userId, limit = 20, offset = 0) => 
    api.get(`/orders/user/${userId}?limit=${limit}&offset=${offset}`),
  
  // Get order by ID (requires auth)
  getOrderById: (id) => 
    api.get(`/orders/${id}`),
  
  // Cancel order (requires auth)
  cancelOrder: (id) => 
    api.put(`/orders/${id}/cancel`),
};

// Health check
export const healthAPI = {
  check: () => 
    axios.get('http://localhost:3000/health'),
};

export default api;
