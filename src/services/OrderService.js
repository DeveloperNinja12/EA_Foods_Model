const Order = require('../models/Order');
const Stock = require('../models/Stock');
const { ORDER_STATUS, DELIVERY_SLOTS } = require('../utils/constants');
const { getNextDeliveryDate, isAfterCutoff } = require('../utils/helpers');

class OrderService {
  /**
   * Create a new order with validation
   */
  static async createOrder(orderData) {
    try {
      // Validate delivery date
      if (!orderData.delivery_date) {
        orderData.delivery_date = getNextDeliveryDate();
      }

      // Validate delivery slot
      if (!Object.values(DELIVERY_SLOTS).includes(orderData.delivery_slot)) {
        throw new Error('Invalid delivery slot');
      }

      // Check if order is after cutoff time
      if (isAfterCutoff() && !orderData.force_after_cutoff) {
        throw new Error('Orders after 6:00 PM will be delivered in 2 days. Please confirm.');
      }

      const order = await Order.create(orderData);
      return await order.toJSON();
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  /**
   * Get order by ID with items
   */
  static async getOrderById(orderId) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      return await order.toJSON();
    } catch (error) {
      throw new Error(`Failed to get order: ${error.message}`);
    }
  }

  /**
   * Get orders by user ID
   */
  static async getOrdersByUserId(userId, limit = 50, offset = 0) {
    try {
      const orders = await Order.findByUserId(userId, limit, offset);
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const orderObj = new Order(order);
          return await orderObj.toJSON();
        })
      );
      return ordersWithItems;
    } catch (error) {
      throw new Error(`Failed to get user orders: ${error.message}`);
    }
  }

  /**
   * Get all orders with pagination
   */
  static async getAllOrders(limit = 50, offset = 0) {
    try {
      return await Order.findAll(limit, offset);
    } catch (error) {
      throw new Error(`Failed to get orders: ${error.message}`);
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(orderId, newStatus) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      await order.updateStatus(newStatus);
      return await order.toJSON();
    } catch (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }

  /**
   * Cancel order
   */
  static async cancelOrder(orderId) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      await order.cancel();
      return await order.toJSON();
    } catch (error) {
      throw new Error(`Failed to cancel order: ${error.message}`);
    }
  }

  /**
   * Get orders by status
   */
  static async getOrdersByStatus(status, limit = 50, offset = 0) {
    try {
      return await Order.findByStatus(status, limit, offset);
    } catch (error) {
      throw new Error(`Failed to get orders by status: ${error.message}`);
    }
  }

  /**
   * Get order statistics
   */
  static async getOrderStatistics() {
    try {
      const db = require('../utils/database');
      
      const stats = await db.all(`
        SELECT 
          status,
          COUNT(*) as count,
          SUM(total_amount) as total_amount
        FROM orders 
        GROUP BY status
      `);

      const totalOrders = await db.get('SELECT COUNT(*) as count FROM orders');
      const totalRevenue = await db.get('SELECT SUM(total_amount) as total FROM orders WHERE status != ?', [ORDER_STATUS.CANCELLED]);

      return {
        total_orders: totalOrders.count,
        total_revenue: totalRevenue.total || 0,
        by_status: stats.map(stat => ({
          status: stat.status,
          count: stat.count,
          total_amount: parseFloat(stat.total_amount || 0),
        })),
      };
    } catch (error) {
      throw new Error(`Failed to get order statistics: ${error.message}`);
    }
  }

  /**
   * Get available delivery slots for a date
   */
  static async getAvailableDeliverySlots(date) {
    try {
      const slots = Object.values(DELIVERY_SLOTS);
      return slots.map(slot => ({
        slot,
        available: true, // In a real system, this would check capacity
        time_range: this.getSlotTimeRange(slot),
      }));
    } catch (error) {
      throw new Error(`Failed to get delivery slots: ${error.message}`);
    }
  }

  /**
   * Get slot time range
   */
  static getSlotTimeRange(slot) {
    const timeRanges = {
      [DELIVERY_SLOTS.MORNING]: '8:00 AM - 11:00 AM',
      [DELIVERY_SLOTS.AFTERNOON]: '12:00 PM - 3:00 PM',
      [DELIVERY_SLOTS.EVENING]: '4:00 PM - 7:00 PM',
    };
    return timeRanges[slot];
  }
}

module.exports = OrderService;
