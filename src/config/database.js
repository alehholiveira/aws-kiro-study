require('dotenv').config();

const { Sequelize } = require('sequelize');

// Determine which database to use based on NODE_ENV
const dbName = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_DB_NAME 
  : process.env.DB_NAME;

// Create Sequelize instance with environment-based configuration
const sequelize = new Sequelize(
  dbName,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    
    // Connection pool configuration
    pool: {
      max: 10,          // Maximum number of connections in pool
      min: 0,           // Minimum number of connections in pool
      acquire: 30000,   // Maximum time (ms) to try to get connection before throwing error
      idle: 10000       // Maximum time (ms) a connection can be idle before being released
    },
    
    // Logging configuration
    logging: process.env.NODE_ENV === 'development' 
      ? console.log 
      : false,          // Disable logging in production and test environments
    
    // Additional options
    define: {
      timestamps: true,     // Automatically add createdAt and updatedAt fields
      underscored: false,   // Use camelCase for automatically added attributes
      freezeTableName: true // Prevent Sequelize from pluralizing table names
    }
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection
};
