require('dotenv').config();
const db = require('../models');

/**
 * Script to validate all models
 * This script checks if all models are properly defined and can be loaded
 */

const validateModels = async () => {
  try {
    console.log('Validating models...');
    
    // Check if all models are loaded correctly
    const models = [
      { name: 'User', model: db.users },
      { name: 'Role', model: db.roles },
      { name: 'Lead', model: db.leads },
      { name: 'LeadStatus', model: db.leadStatuses },
      { name: 'Activity', model: db.activities },
      { name: 'Task', model: db.tasks }
    ];
    
    // Check each model
    for (const { name, model } of models) {
      if (!model) {
        console.error(`❌ ${name} model is not properly loaded`);
        continue;
      }
      
      console.log(`✅ ${name} model is properly defined`);
      console.log(`   Table name: ${model.tableName}`);
      console.log(`   Attributes: ${Object.keys(model.rawAttributes).join(', ')}`);
      console.log('');
    }
    
    // Test database connection
    await db.sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error validating models:', error);
    process.exit(1);
  }
};

validateModels(); 