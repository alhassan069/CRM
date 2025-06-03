const db = require('../models');

/**
 * Synchronize database and create initial data
 */
const syncDatabase = async (force = false) => {
  try {
    // Sync all models with database
    await db.sequelize.sync({ force });
    console.log('Database synchronized successfully.');
    
    // If force is true, seed initial data
    if (force) {
      await seedRoles();
    }
    
    return true;
  } catch (error) {
    console.error('Failed to sync database:', error);
    return false;
  }
};

/**
 * Seed roles table with initial values
 */
const seedRoles = async () => {
  try {
    // Create roles
    await db.roles.bulkCreate([
      { name: 'rep' },
      { name: 'admin' }
    ]);
    console.log('Roles seeded successfully.');
    
    // Create lead statuses
    await db.leadStatuses.bulkCreate([
      { label: 'New Lead', level: 1 },
      { label: 'Contacted - No Response', level: 2 },
      { label: 'Contacted - Not Interested', level: 2 },
      { label: 'Contacted - Follow Up Needed', level: 2 },
      { label: 'Contacted - Interested', level: 2 },
      { label: 'Demo Scheduled', level: 3 },
      { label: 'Post-Demo Follow-up', level: 4 },
      { label: 'Objections Being Addressed', level: 4 },
      { label: 'Verbal Commitment', level: 4 },
      { label: 'CONVERTED - Committed', level: 5 },
      { label: 'Lost', level: 6 }
    ]);
    console.log('Lead statuses seeded successfully.');
    
    return true;
  } catch (error) {
    console.error('Failed to seed initial data:', error);
    return false;
  }
};

module.exports = {
  syncDatabase
}; 