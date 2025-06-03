const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock the models and controllers
jest.mock('../src/models', () => {
  const mockUser = {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn()
  };
  
  const mockRole = {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn()
  };
  
  return {
    user: mockUser,
    role: mockRole,
    sequelize: {
      close: jest.fn()
    }
  };
});

const app = require('../src/app');
const db = require('../src/models');

// Mock data
const testUser = {
  id: 1,
  username: 'testuser',
  password: 'password123',
  password_hash: bcrypt.hashSync('password123', 10),
  name: 'Test User',
  email: 'test@example.com',
  role: { name: 'admin' }
};

// Mock JWT secret
process.env.JWT_SECRET = 'test_jwt_secret';

describe('Authentication API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      // Mock the user.findOne method to return the test user
      db.user.findOne.mockResolvedValue(testUser);
      
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('username', testUser.username);
      expect(res.body).toHaveProperty('name', testUser.name);
    });

    test('should not login with invalid password', async () => {
      // Mock the user.findOne method to return the test user
      db.user.findOne.mockResolvedValue(testUser);
      
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    test('should not login with non-existent username', async () => {
      // Mock the user.findOne method to return null (user not found)
      db.user.findOne.mockResolvedValue(null);
      
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistentuser',
          password: testUser.password
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    test('should require username and password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/logout', () => {
    test('should successfully logout', async () => {
      const res = await request(app)
        .post('/api/auth/logout');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Logout successful');
    });
  });
}); 