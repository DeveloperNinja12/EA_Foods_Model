const OrderService = require('../services/OrderService');
const { DELIVERY_SLOTS } = require('../utils/constants');

class OrderController {
  /**
   * Create a new order
   */
  static async createOrder(req, res) {
    try {
      const orderData = {
        ...req.body,
        user_id: req.user.id, // From auth middleware
      };

      const order = await OrderService.createOrder(orderData);
      
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(req, res) {
    try {
      const order = await OrderService.getOrderById(req.params.id);
      
      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get orders by user ID
   */
  static async getOrdersByUserId(req, res) {
    try {
      const userId = req.user.role === 'ops_manager' ? req.params.userId : req.user.id;
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const orders = await OrderService.getOrdersByUserId(userId, limit, offset);
      
      res.json({
        success: true,
        data: orders,
        pagination: {
          limit,
          offset,
          count: orders.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get all orders (admin only)
   */
  static async getAllOrders(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const orders = await OrderService.getAllOrders(limit, offset);
      
      res.json({
        success: true,
        data: orders,
        pagination: {
          limit,
          offset,
          count: orders.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Update order status (admin only)
   */
  static async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      const order = await OrderService.updateOrderStatus(req.params.id, status);
      
      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Cancel order
   */
  static async cancelOrder(req, res) {
    try {
      const order = await OrderService.cancelOrder(req.params.id);
      
      res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get orders by status
   */
  static async getOrdersByStatus(req, res) {
    try {
      const { status } = req.params;
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const orders = await OrderService.getOrdersByStatus(status, limit, offset);
      
      res.json({
        success: true,
        data: orders,
        pagination: {
          limit,
          offset,
          count: orders.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get order statistics
   */
  static async getOrderStatistics(req, res) {
    try {
      const stats = await OrderService.getOrderStatistics();
      
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get available delivery slots
   */
  static async getAvailableDeliverySlots(req, res) {
    try {
      const { date } = req.query;
      const slots = await OrderService.getAvailableDeliverySlots(date);
      
      res.json({
        success: true,
        data: slots,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = OrderController;
