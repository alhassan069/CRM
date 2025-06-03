const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.user;
const Role = db.role;

// Function to seed roles
async function seedRoles() {
  try {
    // Check if roles already exist
    const roleCount = await Role.count();
    if (roleCount === 0) {
      // Create roles
      await Role.bulkCreate([
        { name: 'admin' },
        { name: 'rep' }
      ]);
      console.log('Roles seeded successfully');
    } else {
      console.log('Roles already exist, skipping seeding');
    }
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
}

// Function to seed users
async function seedUsers() {
  try {
    // Check if users already exist
    const userCount = await User.count();
    if (userCount === 0) {
      // Get role IDs
      const adminRole = await Role.findOne({ where: { name: 'admin' } });
      const repRole = await Role.findOne({ where: { name: 'rep' } });

      if (!adminRole || !repRole) {
        console.error('Roles not found. Please seed roles first.');
        return;
      }

      // Create users
      await User.bulkCreate([
        {
          username: 'admin',
          password_hash: bcrypt.hashSync('admin123', 10),
          name: 'Admin User',
          email: 'admin@example.com',
          role_id: adminRole.id
        },
        {
          username: 'salesrep',
          password_hash: bcrypt.hashSync('salesrep123', 10),
          name: 'Sales Rep',
          email: 'salesrep@example.com',
          role_id: repRole.id
        }
      ]);
      console.log('Users seeded successfully');
    } else {
      console.log('Users already exist, skipping seeding');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

// Main function to run seeding
async function seed() {
  try {
    await seedRoles();
    await seedUsers();
    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seed function
seed(); 