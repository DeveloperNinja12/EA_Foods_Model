const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { validateOrder, validateId, validatePagination } = require('../middleware/validation');
const { requireOrderAccess, requireAdminAccess, requireAuth } = require('../middleware/auth');

// Create order (customers, TSUs, SRs)
router.post('/', requireOrderAccess, validateOrder, OrderController.createOrder);

// Get available delivery slots (public)
router.get('/delivery-slots', OrderController.getAvailableDeliverySlots);

// Get order statistics (admin only)
router.get('/statistics', requireAdminAccess, OrderController.getOrderStatistics);

// Get all orders (admin only)
router.get('/', requireAdminAccess, validatePagination, OrderController.getAllOrders);

// Get orders by status (admin only)
router.get('/status/:status', requireAdminAccess, validatePagination, OrderController.getOrdersByStatus);

// Get orders by user ID (authenticated users can see their own, admin can see any)
router.get('/user/:userId?', requireAuth, validatePagination, OrderController.getOrdersByUserId);

// Get order by ID (authenticated users)
router.get('/:id', requireAuth, validateId, OrderController.getOrderById);

// Update order status (admin only)
router.put('/:id/status', requireAdminAccess, validateId, OrderController.updateOrderStatus);

// Cancel order (authenticated users)
router.put('/:id/cancel', requireAuth, validateId, OrderController.cancelOrder);

module.exports = router;
