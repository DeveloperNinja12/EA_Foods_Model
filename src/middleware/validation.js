const { body, param, query, validationResult } = require('express-validator');
const { USER_ROLES, DELIVERY_SLOTS } = require('../utils/constants');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

/**
 * User validation rules
 */
const validateUser = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('role')
    .isIn(Object.values(USER_ROLES))
    .withMessage(`Role must be one of: ${Object.values(USER_ROLES).join(', ')}`),
  handleValidationErrors,
];

/**
 * Product validation rules
 */
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category must be between 2 and 100 characters'),
  handleValidationErrors,
];

/**
 * Order validation rules (user_id comes from auth middleware)
 */
const validateOrder = [
  body('delivery_date')
    .optional()
    .isISO8601()
    .withMessage('Delivery date must be a valid date'),
  body('delivery_slot')
    .isIn(Object.values(DELIVERY_SLOTS))
    .withMessage(`Delivery slot must be one of: ${Object.values(DELIVERY_SLOTS).join(', ')}`),
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.product_id')
    .isInt({ min: 1 })
    .withMessage('Valid product ID is required for each item'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1 for each item'),
  handleValidationErrors,
];

/**
 * Stock update validation rules (updated_by comes from auth middleware)
 */
const validateStockUpdate = [
  body('product_id')
    .isInt({ min: 1 })
    .withMessage('Valid product ID is required'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  handleValidationErrors,
];

/**
 * ID parameter validation
 */
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid ID is required'),
  handleValidationErrors,
];

/**
 * Pagination validation
 */
const validatePagination = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
  handleValidationErrors,
];

/**
 * Search validation
 */
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  handleValidationErrors,
];

module.exports = {
  validateUser,
  validateProduct,
  validateOrder,
  validateStockUpdate,
  validateId,
  validatePagination,
  validateSearch,
  handleValidationErrors,
};
