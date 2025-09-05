const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const { CUTOFF_TIME } = require('./constants');

/**
 * Generate a unique order number
 */
function generateOrderNumber() {
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `EA-${timestamp}-${random}`;
}

/**
 * Check if current time is after cutoff time
 */
function isAfterCutoff() {
  const now = moment();
  const cutoff = moment(CUTOFF_TIME, 'HH:mm');
  return now.isAfter(cutoff);
}

/**
 * Get the next available delivery date
 * If after cutoff time, return date + 2 days, otherwise + 1 day
 */
function getNextDeliveryDate() {
  const now = moment();
  const cutoff = moment(CUTOFF_TIME, 'HH:mm');
  
  if (now.isAfter(cutoff)) {
    // After cutoff, delivery is +2 days
    return now.add(2, 'days').format('YYYY-MM-DD');
  } else {
    // Before cutoff, delivery is +1 day
    return now.add(1, 'day').format('YYYY-MM-DD');
  }
}

/**
 * Validate delivery date
 */
function isValidDeliveryDate(date) {
  const deliveryDate = moment(date);
  const nextAvailable = moment(getNextDeliveryDate());
  return deliveryDate.isSameOrAfter(nextAvailable);
}

/**
 * Check if it's time for stock update
 */
function isStockUpdateTime() {
  const now = moment();
  const currentTime = now.format('HH:mm');
  const stockUpdateTimes = ['08:00', '18:00'];
  
  return stockUpdateTimes.includes(currentTime);
}

/**
 * Get current stock update type based on time
 */
function getCurrentStockUpdateType() {
  const now = moment();
  const currentTime = now.format('HH:mm');
  
  if (currentTime === '08:00') {
    return 'morning';
  } else if (currentTime === '18:00') {
    return 'evening';
  }
  return 'manual';
}

/**
 * Format currency
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Calculate total with tax (assuming 8% tax rate)
 */
function calculateTotalWithTax(subtotal) {
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  return {
    subtotal,
    tax,
    total: subtotal + tax,
  };
}

module.exports = {
  generateOrderNumber,
  isAfterCutoff,
  getNextDeliveryDate,
  isValidDeliveryDate,
  isStockUpdateTime,
  getCurrentStockUpdateType,
  formatCurrency,
  isValidEmail,
  calculateTotalWithTax,
};
