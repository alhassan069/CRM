const jwt = require('jsonwebtoken');
const { User } = require('../../models');

const createTestUser = async (role = 'admin') => {
  const user = await User.create({
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    role
  });
  return user;
};

const generateTestToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );
};

module.exports = {
  createTestUser,
  generateTestToken
}; 