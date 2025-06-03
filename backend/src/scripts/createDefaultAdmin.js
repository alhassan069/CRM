const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.users;
const Role = db.roles;

/**
 * Creates a default admin user if no admin exists in the system
 * @param {Object} adminData - Optional admin user data
 * @returns {Promise<Object|null>} - Created admin user or null if admin already exists
 */
async function createDefaultAdmin(adminData = {}) {
  try {
    // First, ensure the roles exist
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    
    if (!adminRole) {
      console.log('Admin role not found. Creating roles...');
      await Role.bulkCreate([
        { name: 'admin' },
        { name: 'rep' }
      ]);
      console.log('Roles created successfully');
    }
    
    // Get the admin role ID (after creation if needed)
    const role = await Role.findOne({ where: { name: 'admin' } });
    
    if (!role) {
      throw new Error('Failed to find or create admin role');
    }
    
    // Check if any admin user exists
    const adminExists = await User.findOne({
      where: { role_id: role.id }
    });
    
    if (adminExists) {
      console.log('Admin user already exists, skipping creation');
      return null;
    }
    
    // Set default admin data if not provided
    const defaultAdmin = {
      username: adminData.username || 'admin',
      password: adminData.password || 'admin123',
      name: adminData.name || 'Default Admin',
      email: adminData.email || 'admin@example.com',
    };
    
    // Create the admin user
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(defaultAdmin.password, salt);
    
    const newAdmin = await User.create({
      username: defaultAdmin.username,
      password_hash: hashedPassword,
      name: defaultAdmin.name,
      email: defaultAdmin.email,
      role_id: role.id
    });
    
    console.log(`Default admin created: ${defaultAdmin.username}`);
    return newAdmin;
  } catch (error) {
    console.error('Error creating default admin:', error);
    throw error;
  }
}

// If this script is run directly (not imported)
if (require.main === module) {
  createDefaultAdmin()
    .then(() => {
      console.log('Default admin creation process completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Failed to create default admin:', error);
      process.exit(1);
    });
}

module.exports = createDefaultAdmin; 