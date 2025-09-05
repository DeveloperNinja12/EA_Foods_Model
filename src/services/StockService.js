const Stock = require('../models/Stock');
const Product = require('../models/Product');
const { STOCK_UPDATE_TYPES } = require('../utils/constants');
const { getCurrentStockUpdateType } = require('../utils/helpers');

class StockService {
  /**
   * Update stock for a product
   */
  static async updateStock(productId, newQuantity, updatedBy, updateType = null) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      let stock = await Stock.findByProductId(productId);
      
      if (!stock) {
        // Create new stock record
        stock = await Stock.create({
          product_id: productId,
          quantity: newQuantity,
          updated_by: updatedBy,
        });
      } else {
        // Update existing stock
        const updateTypeToUse = updateType || getCurrentStockUpdateType();
        await stock.update(newQuantity, updatedBy, updateTypeToUse);
      }

      return stock;
    } catch (error) {
      throw new Error(`Failed to update stock: ${error.message}`);
    }
  }

  /**
   * Get stock for a product
   */
  static async getStockByProductId(productId) {
    try {
      const stock = await Stock.findByProductId(productId);
      if (!stock) {
        return { product_id: productId, quantity: 0 };
      }
      return stock;
    } catch (error) {
      throw new Error(`Failed to get stock: ${error.message}`);
    }
  }

  /**
   * Get all stock with product details
   */
  static async getAllStock(limit = 50, offset = 0) {
    try {
      return await Stock.findAll(limit, offset);
    } catch (error) {
      throw new Error(`Failed to get stock: ${error.message}`);
    }
  }

  /**
   * Get low stock products
   */
  static async getLowStockProducts(threshold = 10) {
    try {
      return await Stock.getLowStock(threshold);
    } catch (error) {
      throw new Error(`Failed to get low stock products: ${error.message}`);
    }
  }

  /**
   * Bulk update stock (for scheduled updates)
   */
  static async bulkUpdateStock(stockUpdates, updatedBy, updateType = 'manual') {
    try {
      const results = [];
      
      for (const update of stockUpdates) {
        const { product_id, quantity } = update;
        const result = await this.updateStock(product_id, quantity, updatedBy, updateType);
        results.push(result);
      }
      
      return results;
    } catch (error) {
      throw new Error(`Failed to bulk update stock: ${error.message}`);
    }
  }

  /**
   * Get stock history for a product
   */
  static async getStockHistory(productId, limit = 50, offset = 0) {
    try {
      return await Stock.getStockHistory(productId, limit, offset);
    } catch (error) {
      throw new Error(`Failed to get stock history: ${error.message}`);
    }
  }

  /**
   * Check stock availability for order items
   */
  static async checkStockAvailability(items) {
    try {
      const availability = [];
      
      for (const item of items) {
        const stock = await Stock.findByProductId(item.product_id);
        const available = stock ? stock.quantity : 0;
        const sufficient = available >= item.quantity;
        
        availability.push({
          product_id: item.product_id,
          requested_quantity: item.quantity,
          available_quantity: available,
          sufficient: sufficient,
        });
      }
      
      return availability;
    } catch (error) {
      throw new Error(`Failed to check stock availability: ${error.message}`);
    }
  }

  /**
   * Get stock statistics
   */
  static async getStockStatistics() {
    try {
      const db = require('../utils/database');
      
      const stats = await db.get(`
        SELECT 
          COUNT(*) as total_products,
          SUM(quantity) as total_quantity,
          AVG(quantity) as average_quantity
        FROM stock s
        JOIN products p ON s.product_id = p.id
        WHERE p.is_active = 1
      `);

      const lowStockCount = await db.get(`
        SELECT COUNT(*) as count
        FROM stock s
        JOIN products p ON s.product_id = p.id
        WHERE p.is_active = 1 AND s.quantity <= 10
      `);

      const outOfStockCount = await db.get(`
        SELECT COUNT(*) as count
        FROM stock s
        JOIN products p ON s.product_id = p.id
        WHERE p.is_active = 1 AND s.quantity = 0
      `);

      return {
        total_products: stats.total_products || 0,
        total_quantity: stats.total_quantity || 0,
        average_quantity: parseFloat(stats.average_quantity || 0),
        low_stock_count: lowStockCount.count || 0,
        out_of_stock_count: outOfStockCount.count || 0,
      };
    } catch (error) {
      throw new Error(`Failed to get stock statistics: ${error.message}`);
    }
  }

  /**
   * Initialize stock for a product
   */
  static async initializeStock(productId, initialQuantity, updatedBy) {
    try {
      const existingStock = await Stock.findByProductId(productId);
      if (existingStock) {
        throw new Error('Stock already exists for this product');
      }

      const stock = await Stock.create({
        product_id: productId,
        quantity: initialQuantity,
        updated_by: updatedBy,
      });

      return stock;
    } catch (error) {
      throw new Error(`Failed to initialize stock: ${error.message}`);
    }
  }
}

module.exports = StockService;
