const express = require('express');
const router = express.Router();
const StockController = require('../controllers/StockController');
const { validateStockUpdate, validateId, validatePagination } = require('../middleware/validation');
const { requireAdminAccess, requireAuth } = require('../middleware/auth');

// Initialize stock for a product (admin only)
router.post('/initialize', requireAdminAccess, StockController.initializeStock);

// Update stock for a product (admin only)
router.put('/update', requireAdminAccess, validateStockUpdate, StockController.updateStock);

// Bulk update stock (admin only)
router.put('/bulk-update', requireAdminAccess, StockController.bulkUpdateStock);

// Check stock availability (authenticated users)
router.post('/check-availability', requireAuth, StockController.checkStockAvailability);

// Get stock statistics (admin only)
router.get('/statistics', requireAdminAccess, StockController.getStockStatistics);

// Get low stock products (admin only)
router.get('/low-stock', requireAdminAccess, StockController.getLowStockProducts);

// Get all stock (admin only)
router.get('/', requireAdminAccess, validatePagination, StockController.getAllStock);

// Get stock by product ID (authenticated users)
router.get('/product/:id', requireAuth, validateId, StockController.getStockByProductId);

// Get stock history for a product (admin only)
router.get('/product/:id/history', requireAdminAccess, validateId, validatePagination, StockController.getStockHistory);

module.exports = router;
