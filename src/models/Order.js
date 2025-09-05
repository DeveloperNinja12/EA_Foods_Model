const db = require('../utils/database');
const { ORDER_STATUS, DELIVERY_SLOTS } = require('../utils/constants');
const { generateOrderNumber, isValidDeliveryDate } = require('../utils/helpers');

class Order {
  constructor(data) {
    this.id = data.id;
    this.order_number = data.order_number;
    this.user_id = data.user_id;
    this.delivery_date = data.delivery_date;
    this.delivery_slot = data.delivery_slot;
    this.status = data.status;
    this.total_amount = data.total_amount;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async create(orderData) {
    const { user_id, delivery_date, delivery_slot, items } = orderData;
    
    // Validate input
    if (!user_id || !delivery_date || !delivery_slot || !items || items.length === 0) {
      throw new Error('User ID, delivery date, delivery slot, and items are required');
    }
    
    if (!Object.values(DELIVERY_SLOTS).includes(delivery_slot)) {
      throw new Error('Invalid delivery slot');
    }
    
    if (!isValidDeliveryDate(delivery_date)) {
      throw new Error('Invalid delivery date');
    }

    // Check stock availability
    await Order.validateStockAvailability(items);

    // Calculate total amount
    const totalAmount = await Order.calculateTotalAmount(items);

    // Generate order number
    const order_number = generateOrderNumber();

    // Start transaction
    const sql = `
      INSERT INTO orders (order_number, user_id, delivery_date, delivery_slot, total_amount)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await db.run(sql, [order_number, user_id, delivery_date, delivery_slot, totalAmount]);
    const orderId = result.id;

    // Add order items
    for (const item of items) {
      await Order.addOrderItem(orderId, item);
    }

    // Update stock
    await Order.updateStockForOrder(items);

    return await Order.findById(orderId);
  }

  static async validateStockAvailability(items) {
    for (const item of items) {
      const stock = await db.get('SELECT quantity FROM stock WHERE product_id = ?', [item.product_id]);
      if (!stock || stock.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ID ${item.product_id}`);
      }
    }
  }

  static async calculateTotalAmount(items) {
    let total = 0;
    for (const item of items) {
      const product = await db.get('SELECT price FROM products WHERE id = ?', [item.product_id]);
      if (!product) {
        throw new Error(`Product not found: ${item.product_id}`);
      }
      total += product.price * item.quantity;
    }
    return total;
  }

  static async addOrderItem(orderId, item) {
    const { product_id, quantity } = item;
    const product = await db.get('SELECT price FROM products WHERE id = ?', [product_id]);
    
    const sql = `
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const unitPrice = product.price;
    const totalPrice = unitPrice * quantity;
    
    await db.run(sql, [orderId, product_id, quantity, unitPrice, totalPrice]);
  }

  static async updateStockForOrder(items) {
    for (const item of items) {
      const sql = 'UPDATE stock SET quantity = quantity - ? WHERE product_id = ?';
      await db.run(sql, [item.quantity, item.product_id]);
    }
  }

  static async findById(id) {
    const sql = 'SELECT * FROM orders WHERE id = ?';
    const order = await db.get(sql, [id]);
    return order ? new Order(order) : null;
  }

  static async findByOrderNumber(order_number) {
    const sql = 'SELECT * FROM orders WHERE order_number = ?';
    const order = await db.get(sql, [order_number]);
    return order ? new Order(order) : null;
  }

  static async findByUserId(user_id, limit = 50, offset = 0) {
    const sql = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const orders = await db.all(sql, [user_id, limit, offset]);
    return orders.map(order => new Order(order));
  }

  static async findAll(limit = 50, offset = 0) {
    const sql = `
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const orders = await db.all(sql, [limit, offset]);
    return orders.map(order => ({
      id: order.id,
      order_number: order.order_number,
      user_id: order.user_id,
      user_name: order.user_name,
      user_email: order.user_email,
      delivery_date: order.delivery_date,
      delivery_slot: order.delivery_slot,
      status: order.status,
      total_amount: order.total_amount,
      created_at: order.created_at,
      updated_at: order.updated_at,
    }));
  }

  static async findByStatus(status, limit = 50, offset = 0) {
    const sql = `
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.status = ?
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const orders = await db.all(sql, [status, limit, offset]);
    return orders.map(order => ({
      id: order.id,
      order_number: order.order_number,
      user_id: order.user_id,
      user_name: order.user_name,
      user_email: order.user_email,
      delivery_date: order.delivery_date,
      delivery_slot: order.delivery_slot,
      status: order.status,
      total_amount: order.total_amount,
      created_at: order.created_at,
      updated_at: order.updated_at,
    }));
  }

  static async getOrderItems(orderId) {
    const sql = `
      SELECT oi.*, p.name as product_name, p.category
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;
    const items = await db.all(sql, [orderId]);
    return items.map(item => ({
      id: item.id,
      product_id: item.product_id,
      product_name: item.product_name,
      category: item.category,
      quantity: item.quantity,
      unit_price: parseFloat(item.unit_price),
      total_price: parseFloat(item.total_price),
    }));
  }

  async updateStatus(newStatus) {
    if (!Object.values(ORDER_STATUS).includes(newStatus)) {
      throw new Error('Invalid order status');
    }

    const sql = 'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await db.run(sql, [newStatus, this.id]);
    
    this.status = newStatus;
    return this;
  }

  async cancel() {
    if (this.status === ORDER_STATUS.DELIVERED) {
      throw new Error('Cannot cancel a delivered order');
    }

    // Restore stock
    const items = await Order.getOrderItems(this.id);
    for (const item of items) {
      const sql = 'UPDATE stock SET quantity = quantity + ? WHERE product_id = ?';
      await db.run(sql, [item.quantity, item.product_id]);
    }

    return await this.updateStatus(ORDER_STATUS.CANCELLED);
  }

  async toJSON() {
    const items = await Order.getOrderItems(this.id);
    return {
      id: this.id,
      order_number: this.order_number,
      user_id: this.user_id,
      delivery_date: this.delivery_date,
      delivery_slot: this.delivery_slot,
      status: this.status,
      total_amount: parseFloat(this.total_amount),
      items,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Order;
