const {
  generateOrderNumber,
  isAfterCutoff,
  getNextDeliveryDate,
  isValidDeliveryDate,
  isValidEmail,
  calculateTotalWithTax,
} = require('../../../src/utils/helpers');

describe('Helper Functions', () => {
  describe('generateOrderNumber', () => {
    test('should generate a unique order number', () => {
      const orderNumber = generateOrderNumber();
      
      expect(orderNumber).toMatch(/^EA-\d{14}-[A-Z0-9]{4}$/);
      expect(orderNumber).toContain('EA-');
    });

    test('should generate different order numbers', () => {
      const orderNumber1 = generateOrderNumber();
      const orderNumber2 = generateOrderNumber();
      
      expect(orderNumber1).not.toBe(orderNumber2);
    });
  });

  describe('isAfterCutoff', () => {
    test('should return boolean', () => {
      const result = isAfterCutoff();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getNextDeliveryDate', () => {
    test('should return a valid date string', () => {
      const date = getNextDeliveryDate();
      
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(date)).toBeInstanceOf(Date);
    });
  });

  describe('isValidDeliveryDate', () => {
    test('should validate future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateString = futureDate.toISOString().split('T')[0];
      
      expect(isValidDeliveryDate(dateString)).toBe(true);
    });

    test('should reject past dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const dateString = pastDate.toISOString().split('T')[0];
      
      expect(isValidDeliveryDate(dateString)).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    test('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    test('should reject invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('calculateTotalWithTax', () => {
    test('should calculate tax correctly', () => {
      const subtotal = 100;
      const result = calculateTotalWithTax(subtotal);
      
      expect(result.subtotal).toBe(100);
      expect(result.tax).toBe(8); // 8% tax
      expect(result.total).toBe(108);
    });

    test('should handle zero subtotal', () => {
      const result = calculateTotalWithTax(0);
      
      expect(result.subtotal).toBe(0);
      expect(result.tax).toBe(0);
      expect(result.total).toBe(0);
    });

    test('should handle decimal subtotals', () => {
      const subtotal = 10.50;
      const result = calculateTotalWithTax(subtotal);
      
      expect(result.subtotal).toBe(10.50);
      expect(result.tax).toBe(0.84);
      expect(result.total).toBe(11.34);
    });
  });
});
