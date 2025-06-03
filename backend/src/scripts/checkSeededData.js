require('dotenv').config();
const db = require('../models');

/**
 * Script to check if data was properly seeded in the database
 */
const checkSeededData = async () => {
  try {
    console.log('Checking seeded data...');
    
    // Check roles
    const roles = await db.roles.findAll();
    console.log('\n=== Roles ===');
    console.log(JSON.stringify(roles.map(role => role.toJSON()), null, 2));
    
    // Check lead statuses
    const leadStatuses = await db.leadStatuses.findAll();
    console.log('\n=== Lead Statuses ===');
    console.log(JSON.stringify(leadStatuses.map(status => status.toJSON()), null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking seeded data:', error);
    process.exit(1);
  }
};

checkSeededData(); 