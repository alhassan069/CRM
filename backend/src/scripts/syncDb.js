require('dotenv').config();
const { syncDatabase } = require('../utils/dbSync');

/**
 * Script to sync database and seed initial data
 * Usage: node src/scripts/syncDb.js [--force]
 * 
 * --force: Drop and recreate all tables (WARNING: This will delete all data)
 */

const run = async () => {
  try {
    // Check if --force flag is provided
    const forceSync = process.argv.includes('--force');
    
    if (forceSync) {
      console.warn('WARNING: Running with --force will drop all tables and delete all data!');
      console.warn('You have 5 seconds to abort (CTRL+C)...');
      
      // Wait 5 seconds before proceeding
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    console.log(`Starting database sync${forceSync ? ' with force option' : ''}...`);
    
    // Run the sync
    const result = await syncDatabase(forceSync);
    
    if (result) {
      console.log('Database sync completed successfully.');
    } else {
      console.error('Database sync failed.');
      process.exit(1);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error during database sync:', error);
    process.exit(1);
  }
};

run(); 