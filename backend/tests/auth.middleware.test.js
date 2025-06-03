const jwt = require('jsonwebtoken');
const { verifyToken, isAdmin, isRep, isAuthenticated } = require('../src/middlewares/auth.middleware');

// Mock JWT secret
process.env.JWT_SECRET = 'test_jwt_secret';

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('verifyToken', () => {
    test('should return 401 if no token is provided', () => {
      verifyToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 401 if token is invalid', () => {
      req.headers.authorization = 'Bearer invalid_token';
      verifyToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should call next() if token is valid', () => {
      const token = jwt.sign({ id: 1, username: 'test', role: 'admin' }, process.env.JWT_SECRET);
      req.headers.authorization = `Bearer ${token}`;
      verifyToken(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.userId).toBe(1);
      expect(req.userRole).toBe('admin');
    });
  });

  describe('isAdmin', () => {
    test('should return 403 if user is not admin', () => {
      req.userRole = 'rep';
      isAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Require Admin Role!' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should call next() if user is admin', () => {
      req.userRole = 'admin';
      isAdmin(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('isRep', () => {
    test('should return 403 if user is not rep', () => {
      req.userRole = 'admin';
      isRep(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Require Sales Rep Role!' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should call next() if user is rep', () => {
      req.userRole = 'rep';
      isRep(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('isAuthenticated', () => {
    test('should return 403 if user has invalid role', () => {
      req.userRole = 'invalid';
      isAuthenticated(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid role' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should call next() if user is admin', () => {
      req.userRole = 'admin';
      isAuthenticated(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('should call next() if user is rep', () => {
      req.userRole = 'rep';
      isAuthenticated(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
}); 