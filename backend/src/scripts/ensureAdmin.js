#!/usr/bin/env node

/**
 * Script to ensure an admin user exists in the database
 * Can be run directly: node ensureAdmin.js
 * Optional arguments: --username=admin --password=secure123 --name="Admin User" --email=admin@example.com
 */

const dotenv = require('dotenv');
const createDefaultAdmin = require('./createDefaultAdmin');
const { syncDatabase } = require('../utils/dbSync');

// Load environment variables
dotenv.config();

// Parse command line arguments
function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      if (key && value) {
        args[key] = value;
      }
    }
  });
  return args;
}

async function main() {
  try {
    console.log('Ensuring database connection...');
    await syncDatabase(false);
    
    console.log('Checking for admin user...');
    const args = parseArgs();
    
    const adminData = {
      username: args.username,
      password: args.password,
      name: args.name,
      email: args.email
    };
    
    // Only include properties that were actually provided
    Object.keys(adminData).forEach(key => {
      if (adminData[key] === undefined) {
        delete adminData[key];
      }
    });
    
    const result = await createDefaultAdmin(adminData);
    
    if (result) {
      console.log(`Admin user created successfully: ${result.username}`);
    } else {
      console.log('Admin user already exists, no action taken');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error ensuring admin exists:', error);
    process.exit(1);
  }
}

// Run the script
main(); 