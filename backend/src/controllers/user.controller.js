const db = require('../models');
const User = db.users;
const Role = db.roles;

// Get all users (for admins)
exports.getAllUsers = async (req, res) => {
  try {
    // Only admins can get all users
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    
    const users = await User.findAll({
      attributes: ['id', 'username', 'name', 'email', 'role_id'],
      include: [{
        model: Role,
        attributes: ['name']
      }]
    });
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Regular users can only get their own profile, admins can get any
    if (req.userRole !== 'admin' && req.userId !== parseInt(userId)) {
      return res.status(403).json({ message: 'Access denied. You can only view your own profile.' });
    }
    
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'name', 'email', 'role_id'],
      include: [{
        model: Role,
        attributes: ['name']
      }]
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'username', 'name', 'email', 'role_id'],
      include: [{
        model: Role,
        attributes: ['name']
      }]
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
  }
}; 