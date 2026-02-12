#!/usr/bin/env node

/**
 * Database Seed Script
 * 
 * This script seeds the database with initial World Cup data from JSON files.
 * It loads winners and matches data and inserts them into the database.
 * 
 * Usage:
 *   node scripts/seed-db.js [--clear]
 * 
 * Options:
 *   --clear  Clear existing data before seeding
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sequelize, Winner, Match } = require('../src/models');

async function seedDatabase() {
  const clearData = process.argv.includes('--clear');
  
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Clear existing data if requested
    if (clearData) {
      console.log('\nClearing existing data...');
      await Match.destroy({ where: {}, truncate: true });
      await Winner.destroy({ where: {}, truncate: true });
      console.log('✓ Existing data cleared');
    }
    
    // Load JSON data files
    console.log('\nLoading seed data from JSON files...');
    const winnersPath = path.join(__dirname, '../data/winners.json');
    const matchesPath = path.join(__dirname, '../data/matches.json');
    
    if (!fs.existsSync(winnersPath)) {
      throw new Error(`Winners data file not found: ${winnersPath}`);
    }
    if (!fs.existsSync(matchesPath)) {
      throw new Error(`Matches data file not found: ${matchesPath}`);
    }
    
    const winnersData = JSON.parse(fs.readFileSync(winnersPath, 'utf8'));
    const matchesData = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));
    
    console.log(`  - Loaded ${winnersData.length} winners`);
    console.log(`  - Loaded ${matchesData.length} matches`);
    
    // Seed winners
    console.log('\nSeeding winners...');
    for (const winner of winnersData) {
      await Winner.findOrCreate({
        where: { year: winner.year },
        defaults: winner
      });
    }
    console.log(`✓ Seeded ${winnersData.length} World Cup winners (1950-2022)`);
    
    // Seed matches
    console.log('\nSeeding matches...');
    let matchCount = 0;
    for (const match of matchesData) {
      const [instance, created] = await Match.findOrCreate({
        where: {
          year: match.year,
          date: match.date,
          team1: match.team1,
          team2: match.team2
        },
        defaults: match
      });
      if (created) matchCount++;
    }
    console.log(`✓ Seeded ${matchCount} historical World Cup matches`);
    
    // Display summary
    const totalWinners = await Winner.count();
    const totalMatches = await Match.count();
    
    console.log('\n=== Database Seed Summary ===');
    console.log(`Total Winners in database: ${totalWinners}`);
    console.log(`Total Matches in database: ${totalMatches}`);
    console.log('\n✓ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('\n✗ Database seeding failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the seed
seedDatabase();
