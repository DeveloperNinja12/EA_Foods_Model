const { USER_ROLES } = require('../utils/constants');

/**
 * Simple role-based authorization middleware
 * In a real application, this would use JWT tokens or session management
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    // For demo purposes, we'll use a simple header-based approach
    // In production, this would be proper JWT authentication
    const userRole = req.headers['x-user-role'];
    const userId = req.headers['x-user-id'];

    if (!userRole || !userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide x-user-role and x-user-id headers.',
      });
    }

    if (!Object.values(USER_ROLES).includes(userRole)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid user role',
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    // Add user info to request
    req.user = {
      id: parseInt(userId),
      role: userRole,
    };

    next();
  };
};

/**
 * Require customer role
 */
const requireCustomer = requireRole([USER_ROLES.CUSTOMER]);

/**
 * Require TSU role
 */
const requireTSU = requireRole([USER_ROLES.TSU]);

/**
 * Require SR role
 */
const requireSR = requireRole([USER_ROLES.SR]);

/**
 * Require Ops Manager role
 */
const requireOpsManager = requireRole([USER_ROLES.OPS_MANAGER]);

/**
 * Require any authenticated user
 */
const requireAuth = requireRole(Object.values(USER_ROLES));

/**
 * Require customer, TSU, or SR roles (order placement)
 */
const requireOrderAccess = requireRole([
  USER_ROLES.CUSTOMER,
  USER_ROLES.TSU,
  USER_ROLES.SR,
]);

/**
 * Require ops manager or admin access
 */
const requireAdminAccess = requireRole([
  USER_ROLES.OPS_MANAGER,
]);

module.exports = {
  requireRole,
  requireCustomer,
  requireTSU,
  requireSR,
  requireOpsManager,
  requireAuth,
  requireOrderAccess,
  requireAdminAccess,
};
