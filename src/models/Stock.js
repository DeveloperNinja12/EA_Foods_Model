const db = require('../utils/database');

class Stock {
  constructor(data) {
    this.id = data.id;
    this.product_id = data.product_id;
    this.quantity = data.quantity;
    this.updated_at = data.updated_at;
    this.updated_by = data.updated_by;
  }

  static async create(stockData) {
    const { product_id, quantity, updated_by } = stockData;
    
    // Validate input
    if (!product_id || quantity === undefined || !updated_by) {
      throw new Error('Product ID, quantity, and updated_by are required');
    }
    
    if (quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    const sql = `
      INSERT INTO stock (product_id, quantity, updated_by)
      VALUES (?, ?, ?)
    `;
    
    const result = await db.run(sql, [product_id, quantity, updated_by]);
    return await Stock.findById(result.id);
  }

  static async findById(id) {
    const sql = 'SELECT * FROM stock WHERE id = ?';
    const stock = await db.get(sql, [id]);
    return stock ? new Stock(stock) : null;
  }

  static async findByProductId(product_id) {
    const sql = 'SELECT * FROM stock WHERE product_id = ?';
    const stock = await db.get(sql, [product_id]);
    return stock ? new Stock(stock) : null;
  }

  static async findAll(limit = 50, offset = 0) {
    const sql = `
      SELECT s.*, p.name as product_name, p.price, p.category
      FROM stock s
      JOIN products p ON s.product_id = p.id
      WHERE p.is_active = 1
      ORDER BY s.updated_at DESC
      LIMIT ? OFFSET ?
    `;
    const stocks = await db.all(sql, [limit, offset]);
    return stocks.map(stock => ({
      id: stock.id,
      product_id: stock.product_id,
      product_name: stock.product_name,
      price: stock.price,
      category: stock.category,
      quantity: stock.quantity,
      updated_at: stock.updated_at,
      updated_by: stock.updated_by,
    }));
  }

  static async getLowStock(threshold = 10) {
    const sql = `
      SELECT s.*, p.name as product_name, p.price, p.category
      FROM stock s
      JOIN products p ON s.product_id = p.id
      WHERE p.is_active = 1 AND s.quantity <= ?
      ORDER BY s.quantity ASC
    `;
    const stocks = await db.all(sql, [threshold]);
    return stocks.map(stock => ({
      id: stock.id,
      product_id: stock.product_id,
      product_name: stock.product_name,
      price: stock.price,
      category: stock.category,
      quantity: stock.quantity,
      updated_at: stock.updated_at,
      updated_by: stock.updated_by,
    }));
  }

  async update(newQuantity, updated_by, updateType = 'manual') {
    if (newQuantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    const oldQuantity = this.quantity;
    
    // Update stock
    const sql = 'UPDATE stock SET quantity = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ? WHERE id = ?';
    await db.run(sql, [newQuantity, updated_by, this.id]);
    
    // Log the update
    await this.logStockUpdate(oldQuantity, newQuantity, updated_by, updateType);
    
    // Update the current object
    this.quantity = newQuantity;
    this.updated_by = updated_by;
    
    return this;
  }

  async logStockUpdate(oldQuantity, newQuantity, updated_by, updateType) {
    const sql = `
      INSERT INTO stock_updates (product_id, old_quantity, new_quantity, updated_by, update_type)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.run(sql, [this.product_id, oldQuantity, newQuantity, updated_by, updateType]);
  }

  static async getStockHistory(product_id, limit = 50, offset = 0) {
    const sql = `
      SELECT su.*, u.name as updated_by_name, p.name as product_name
      FROM stock_updates su
      JOIN users u ON su.updated_by = u.id
      JOIN products p ON su.product_id = p.id
      WHERE su.product_id = ?
      ORDER BY su.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const updates = await db.all(sql, [product_id, limit, offset]);
    return updates.map(update => ({
      id: update.id,
      product_id: update.product_id,
      product_name: update.product_name,
      old_quantity: update.old_quantity,
      new_quantity: update.new_quantity,
      updated_by: update.updated_by,
      updated_by_name: update.updated_by_name,
      update_type: update.update_type,
      created_at: update.created_at,
    }));
  }

  async delete() {
    const sql = 'DELETE FROM stock WHERE id = ?';
    await db.run(sql, [this.id]);
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      product_id: this.product_id,
      quantity: this.quantity,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
    };
  }
}

module.exports = Stock;
