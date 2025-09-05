const Product = require('../models/Product');

class ProductController {
  /**
   * Create a new product
   */
  static async createProduct(req, res) {
    try {
      const product = await Product.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product.toJSON(),
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get product by ID
   */
  static async getProductById(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      res.json({
        success: true,
        data: product.toJSON(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get all products
   */
  static async getAllProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      const activeOnly = req.query.active !== 'false';
      
      const products = await Product.findAll(limit, offset, activeOnly);
      
      res.json({
        success: true,
        data: products.map(product => product.toJSON()),
        pagination: {
          limit,
          offset,
          count: products.length,
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
   * Get products by category
   */
  static async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const products = await Product.findByCategory(category, limit, offset);
      
      res.json({
        success: true,
        data: products.map(product => product.toJSON()),
        pagination: {
          limit,
          offset,
          count: products.length,
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
   * Search products
   */
  static async searchProducts(req, res) {
    try {
      const { q } = req.query;
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
      }

      const products = await Product.search(q, limit, offset);
      
      res.json({
        success: true,
        data: products.map(product => product.toJSON()),
        pagination: {
          limit,
          offset,
          count: products.length,
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
   * Update product
   */
  static async updateProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      const updatedProduct = await product.update(req.body);
      
      res.json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct.toJSON(),
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Delete product (soft delete)
   */
  static async deleteProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      const deletedProduct = await product.delete();
      
      res.json({
        success: true,
        message: 'Product deleted successfully',
        data: deletedProduct.toJSON(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get product categories
   */
  static async getCategories(req, res) {
    try {
      const db = require('../utils/database');
      
      const categories = await db.all(`
        SELECT DISTINCT category, COUNT(*) as product_count
        FROM products 
        WHERE is_active = 1
        GROUP BY category
        ORDER BY category
      `);

      res.json({
        success: true,
        data: categories.map(cat => ({
          category: cat.category,
          product_count: cat.product_count,
        })),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = ProductController;
