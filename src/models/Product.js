const db = require('../utils/database');

class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.category = data.category;
    this.is_active = data.is_active;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async create(productData) {
    const { name, description, price, category } = productData;
    
    // Validate input
    if (!name || !price || !category) {
      throw new Error('Name, price, and category are required');
    }
    
    if (price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    const sql = `
      INSERT INTO products (name, description, price, category)
      VALUES (?, ?, ?, ?)
    `;
    
    const result = await db.run(sql, [name, description, price, category]);
    return await Product.findById(result.id);
  }

  static async findById(id) {
    const sql = 'SELECT * FROM products WHERE id = ?';
    const product = await db.get(sql, [id]);
    return product ? new Product(product) : null;
  }

  static async findAll(limit = 50, offset = 0, activeOnly = true) {
    let sql = 'SELECT * FROM products';
    const params = [];
    
    if (activeOnly) {
      sql += ' WHERE is_active = 1';
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const products = await db.all(sql, params);
    return products.map(product => new Product(product));
  }

  static async findByCategory(category, limit = 50, offset = 0) {
    const sql = 'SELECT * FROM products WHERE category = ? AND is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const products = await db.all(sql, [category, limit, offset]);
    return products.map(product => new Product(product));
  }

  static async search(query, limit = 50, offset = 0) {
    const sql = `
      SELECT * FROM products 
      WHERE (name LIKE ? OR description LIKE ?) AND is_active = 1 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    const searchTerm = `%${query}%`;
    const products = await db.all(sql, [searchTerm, searchTerm, limit, offset]);
    return products.map(product => new Product(product));
  }

  async update(updateData) {
    const { name, description, price, category, is_active } = updateData;
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }

    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }

    if (price !== undefined) {
      if (price <= 0) {
        throw new Error('Price must be greater than 0');
      }
      updates.push('price = ?');
      values.push(price);
    }

    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }

    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active ? 1 : 0);
    }

    if (updates.length === 0) {
      return this;
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(this.id);

    const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
    await db.run(sql, values);
    
    return await Product.findById(this.id);
  }

  async delete() {
    const sql = 'UPDATE products SET is_active = 0 WHERE id = ?';
    await db.run(sql, [this.id]);
    return await Product.findById(this.id);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: parseFloat(this.price),
      category: this.category,
      is_active: Boolean(this.is_active),
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Product;
