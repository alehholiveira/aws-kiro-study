#!/usr/bin/env node

/**
 * Database Sync Script
 * 
 * This script synchronizes Sequelize models with the database.
 * It creates or updates tables based on model definitions.
 * 
 * Usage:
 *   node scripts/sync-db.js [--force]
 * 
 * Options:
 *   --force  Drop existing tables before recreating (WARNING: destroys data)
 */

require('dotenv').config();
const { sequelize, Winner, Match } = require('../src/models');

async function syncDatabase() {
  const forceSync = process.argv.includes('--force');
  
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    console.log(`\nSyncing models with database${forceSync ? ' (FORCE MODE - will drop existing tables)' : ''}...`);
    
    // Sync all models
    await sequelize.sync({ force: forceSync });
    
    console.log('\n✓ Database sync completed successfully!');
    console.log('\nSynced models:');
    console.log('  - Winner');
    console.log('  - Match');
    
    if (forceSync) {
      console.log('\n⚠ WARNING: All existing data has been deleted due to --force flag');
    }
    
  } catch (error) {
    console.error('\n✗ Database sync failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the sync
syncDatabase();
