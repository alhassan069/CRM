const authService = require('../src/services/auth.service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock JWT secret
process.env.JWT_SECRET = 'test_jwt_secret';

describe('Auth Service', () => {
  describe('hashPassword', () => {
    test('should hash a password', () => {
      const password = 'password123';
      const hash = authService.hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(bcrypt.compareSync(password, hash)).toBe(true);
    });
  });

  describe('verifyPassword', () => {
    test('should return true for correct password', () => {
      const password = 'password123';
      const hash = bcrypt.hashSync(password, 10);
      
      expect(authService.verifyPassword(password, hash)).toBe(true);
    });

    test('should return false for incorrect password', () => {
      const password = 'password123';
      const wrongPassword = 'wrongpassword';
      const hash = bcrypt.hashSync(password, 10);
      
      expect(authService.verifyPassword(wrongPassword, hash)).toBe(false);
    });
  });

  describe('generateToken', () => {
    test('should generate a valid JWT token', () => {
      const userData = { id: 1, username: 'test', role: 'admin' };
      const token = authService.generateToken(userData);
      
      expect(token).toBeDefined();
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(userData.id);
      expect(decoded.username).toBe(userData.username);
      expect(decoded.role).toBe(userData.role);
    });
  });

  describe('verifyToken', () => {
    test('should verify a valid token', () => {
      const userData = { id: 1, username: 'test', role: 'admin' };
      const token = jwt.sign(userData, process.env.JWT_SECRET);
      
      const decoded = authService.verifyToken(token);
      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(userData.id);
      expect(decoded.username).toBe(userData.username);
      expect(decoded.role).toBe(userData.role);
    });

    test('should return null for invalid token', () => {
      const decoded = authService.verifyToken('invalid_token');
      expect(decoded).toBeNull();
    });
  });
}); 