const User = require('../models/User');
const { USER_ROLES } = require('../utils/constants');

class UserController {
  /**
   * Create a new user
   */
  static async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user.toJSON(),
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.json({
        success: true,
        data: user.toJSON(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get all users
   */
  static async getAllUsers(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      
      const users = await User.findAll(limit, offset);
      
      res.json({
        success: true,
        data: users.map(user => user.toJSON()),
        pagination: {
          limit,
          offset,
          count: users.length,
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
   * Get users by role
   */
  static async getUsersByRole(req, res) {
    try {
      const { role } = req.params;
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      if (!Object.values(USER_ROLES).includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role',
        });
      }

      const users = await User.findByRole(role, limit, offset);
      
      res.json({
        success: true,
        data: users.map(user => user.toJSON()),
        pagination: {
          limit,
          offset,
          count: users.length,
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
   * Update user
   */
  static async updateUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const updatedUser = await user.update(req.body);
      
      res.json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser.toJSON(),
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      await user.delete();
      
      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStatistics(req, res) {
    try {
      const db = require('../utils/database');
      
      const stats = await db.all(`
        SELECT 
          role,
          COUNT(*) as count
        FROM users 
        GROUP BY role
      `);

      const totalUsers = await db.get('SELECT COUNT(*) as count FROM users');

      res.json({
        success: true,
        data: {
          total_users: totalUsers.count,
          by_role: stats.map(stat => ({
            role: stat.role,
            count: stat.count,
          })),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = UserController;
