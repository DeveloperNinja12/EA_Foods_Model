const StockService = require('../services/StockService');

class StockController {
  /**
   * Update stock for a product
   */
  static async updateStock(req, res) {
    try {
      const { product_id, quantity } = req.body;
      const updatedBy = req.user.id; // From auth middleware

      const stock = await StockService.updateStock(product_id, quantity, updatedBy);
      
      res.json({
        success: true,
        message: 'Stock updated successfully',
        data: stock,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get stock by product ID
   */
  static async getStockByProductId(req, res) {
    try {
      const productId = req.params.id;
      const stock = await StockService.getStockByProductId(productId);
      
      res.json({
        success: true,
        data: stock,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get all stock
   */
  static async getAllStock(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const stock = await StockService.getAllStock(limit, offset);
      
      res.json({
        success: true,
        data: stock,
        pagination: {
          limit,
          offset,
          count: stock.length,
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
   * Get low stock products
   */
  static async getLowStockProducts(req, res) {
    try {
      const threshold = parseInt(req.query.threshold) || 10;
      const products = await StockService.getLowStockProducts(threshold);
      
      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Bulk update stock
   */
  static async bulkUpdateStock(req, res) {
    try {
      const { stock_updates } = req.body;
      const updatedBy = req.user.id; // From auth middleware

      if (!Array.isArray(stock_updates) || stock_updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock updates array is required',
        });
      }

      const results = await StockService.bulkUpdateStock(stock_updates, updatedBy);
      
      res.json({
        success: true,
        message: 'Stock updated successfully',
        data: results,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get stock history for a product
   */
  static async getStockHistory(req, res) {
    try {
      const productId = req.params.id;
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const history = await StockService.getStockHistory(productId, limit, offset);
      
      res.json({
        success: true,
        data: history,
        pagination: {
          limit,
          offset,
          count: history.length,
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
   * Check stock availability
   */
  static async checkStockAvailability(req, res) {
    try {
      const { items } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Items array is required',
        });
      }

      const availability = await StockService.checkStockAvailability(items);
      
      res.json({
        success: true,
        data: availability,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get stock statistics
   */
  static async getStockStatistics(req, res) {
    try {
      const stats = await StockService.getStockStatistics();
      
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
   * Initialize stock for a product
   */
  static async initializeStock(req, res) {
    try {
      const { product_id, initial_quantity } = req.body;
      const updatedBy = req.user.id; // From auth middleware

      const stock = await StockService.initializeStock(product_id, initial_quantity, updatedBy);
      
      res.status(201).json({
        success: true,
        message: 'Stock initialized successfully',
        data: stock,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = StockController;
