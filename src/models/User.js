const db = require('../utils/database');
const { USER_ROLES } = require('../utils/constants');
const { isValidEmail } = require('../utils/helpers');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.role = data.role;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async create(userData) {
    const { email, name, role } = userData;
    
    // Validate input
    if (!email || !name || !role) {
      throw new Error('Email, name, and role are required');
    }
    
    if (!isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    if (!Object.values(USER_ROLES).includes(role)) {
      throw new Error('Invalid user role');
    }

    const sql = `
      INSERT INTO users (email, name, role)
      VALUES (?, ?, ?)
    `;
    
    const result = await db.run(sql, [email, name, role]);
    return await User.findById(result.id);
  }

  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const user = await db.get(sql, [id]);
    return user ? new User(user) : null;
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const user = await db.get(sql, [email]);
    return user ? new User(user) : null;
  }

  static async findAll(limit = 50, offset = 0) {
    const sql = 'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const users = await db.all(sql, [limit, offset]);
    return users.map(user => new User(user));
  }

  static async findByRole(role, limit = 50, offset = 0) {
    const sql = 'SELECT * FROM users WHERE role = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const users = await db.all(sql, [role, limit, offset]);
    return users.map(user => new User(user));
  }

  async update(updateData) {
    const { name, role } = updateData;
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }

    if (role !== undefined) {
      if (!Object.values(USER_ROLES).includes(role)) {
        throw new Error('Invalid user role');
      }
      updates.push('role = ?');
      values.push(role);
    }

    if (updates.length === 0) {
      return this;
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(this.id);

    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await db.run(sql, values);
    
    return await User.findById(this.id);
  }

  async delete() {
    const sql = 'DELETE FROM users WHERE id = ?';
    await db.run(sql, [this.id]);
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = User;
