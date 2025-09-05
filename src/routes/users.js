const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { validateUser, validateId, validatePagination } = require('../middleware/validation');
const { requireAdminAccess } = require('../middleware/auth');

// Create user (admin only)
router.post('/', requireAdminAccess, validateUser, UserController.createUser);

// Get all users (admin only)
router.get('/', requireAdminAccess, validatePagination, UserController.getAllUsers);

// Get user statistics (admin only)
router.get('/statistics', requireAdminAccess, UserController.getUserStatistics);

// Get users by role (admin only)
router.get('/role/:role', requireAdminAccess, validatePagination, UserController.getUsersByRole);

// Get user by ID (admin only)
router.get('/:id', requireAdminAccess, validateId, UserController.getUserById);

// Update user (admin only)
router.put('/:id', requireAdminAccess, validateId, validateUser, UserController.updateUser);

// Delete user (admin only)
router.delete('/:id', requireAdminAccess, validateId, UserController.deleteUser);

module.exports = router;
