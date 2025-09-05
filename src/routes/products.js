const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { validateProduct, validateId, validatePagination, validateSearch } = require('../middleware/validation');
const { requireAdminAccess, requireAuth } = require('../middleware/auth');

// Create product (admin only)
router.post('/', requireAdminAccess, validateProduct, ProductController.createProduct);

// Get all products (public)
router.get('/', validatePagination, ProductController.getAllProducts);

// Get product categories (public)
router.get('/categories', ProductController.getCategories);

// Search products (public)
router.get('/search', validateSearch, ProductController.searchProducts);

// Get products by category (public)
router.get('/category/:category', validatePagination, ProductController.getProductsByCategory);

// Get product by ID (public)
router.get('/:id', validateId, ProductController.getProductById);

// Update product (admin only)
router.put('/:id', requireAdminAccess, validateId, validateProduct, ProductController.updateProduct);

// Delete product (admin only)
router.delete('/:id', requireAdminAccess, validateId, ProductController.deleteProduct);

module.exports = router;
