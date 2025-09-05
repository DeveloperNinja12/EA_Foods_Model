const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/utils/database');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';

describe('EA Foods Pre-Order API Integration Tests', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.close();
  });

  describe('Health Check', () => {
    test('GET /health should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('EA Foods Pre-Order API');
    });
  });

  describe('API Documentation', () => {
    test('GET /api should return API documentation', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.endpoints).toBeDefined();
    });
  });

  describe('Products API', () => {
    test('GET /api/products should return products list', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/products/categories should return categories', async () => {
      const response = await request(app)
        .get('/api/products/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Orders API', () => {
    test('GET /api/orders/delivery-slots should return delivery slots', async () => {
      const response = await request(app)
        .get('/api/orders/delivery-slots')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Authentication', () => {
    test('POST /api/orders should require authentication', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          delivery_slot: 'morning',
          items: [{ product_id: 1, quantity: 2 }]
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Authentication required');
    });

    test('POST /api/orders should work with proper headers', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('x-user-role', 'customer')
        .set('x-user-id', '2')
        .send({
          delivery_slot: 'morning',
          items: [{ product_id: 1, quantity: 2 }]
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.order_number).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('GET /api/nonexistent should return 404', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    test('POST /api/orders with invalid data should return 400', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('x-user-role', 'customer')
        .set('x-user-id', '2')
        .send({
          delivery_slot: 'invalid_slot',
          items: []
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
