const User = require('../../../src/models/User');
const db = require('../../../src/utils/database');
const { USER_ROLES } = require('../../../src/utils/constants');

describe('User Model', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    // Clean up users table before each test
    await db.run('DELETE FROM users');
  });

  describe('create', () => {
    test('should create a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        role: USER_ROLES.CUSTOMER,
      };

      const user = await User.create(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.role).toBe(userData.role);
      expect(user.id).toBeDefined();
    });

    test('should throw error for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        name: 'Test User',
        role: USER_ROLES.CUSTOMER,
      };

      await expect(User.create(userData)).rejects.toThrow('Invalid email format');
    });

    test('should throw error for invalid role', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        role: 'invalid_role',
      };

      await expect(User.create(userData)).rejects.toThrow('Invalid user role');
    });

    test('should throw error for missing required fields', async () => {
      const userData = {
        email: 'test@example.com',
        // missing name and role
      };

      await expect(User.create(userData)).rejects.toThrow('Email, name, and role are required');
    });
  });

  describe('findById', () => {
    test('should find user by ID', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        role: USER_ROLES.CUSTOMER,
      };

      const createdUser = await User.create(userData);
      const foundUser = await User.findById(createdUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(createdUser.id);
      expect(foundUser.email).toBe(userData.email);
    });

    test('should return null for non-existent user', async () => {
      const user = await User.findById(99999);
      expect(user).toBeNull();
    });
  });

  describe('findByEmail', () => {
    test('should find user by email', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        role: USER_ROLES.CUSTOMER,
      };

      await User.create(userData);
      const foundUser = await User.findByEmail(userData.email);

      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe(userData.email);
    });

    test('should return null for non-existent email', async () => {
      const user = await User.findByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });

  describe('update', () => {
    test('should update user data', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        role: USER_ROLES.CUSTOMER,
      };

      const user = await User.create(userData);
      const updatedUser = await user.update({ name: 'Updated Name' });

      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.email).toBe(userData.email); // unchanged
    });

    test('should throw error for invalid role update', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        role: USER_ROLES.CUSTOMER,
      };

      const user = await User.create(userData);

      await expect(user.update({ role: 'invalid_role' })).rejects.toThrow('Invalid user role');
    });
  });

  describe('toJSON', () => {
    test('should return user data as JSON', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        role: USER_ROLES.CUSTOMER,
      };

      const user = await User.create(userData);
      const json = user.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('email');
      expect(json).toHaveProperty('name');
      expect(json).toHaveProperty('role');
      expect(json).toHaveProperty('created_at');
      expect(json).toHaveProperty('updated_at');
    });
  });
});
