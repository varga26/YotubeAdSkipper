// config.js

// Import Sequelize ORM
import { Sequelize } from 'sequelize';
// Import the AdSegment model factory
import AdSegmentModel from './model.js';

// Create a Sequelize instance (connecting to SQLite)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './ads.db',     // Database file location
  logging: false           // Disable SQL logging in the console
});

// Initialize the model by passing the Sequelize instance
const AdSegment = AdSegmentModel(sequelize);

/**
 * Function to initialize and sync the database
 * - Authenticates the DB connection
 * - Creates the table if it doesn't exist
 */
async function initializeDatabase() {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('[DB] Connection has been established successfully.');
    
    // Sync models (creates tables if missing)
    await sequelize.sync();
    console.log('[DB] Database synchronized.');
  } catch (error) {
    // Log connection or synchronization errors
    console.error('[DB] Unable to connect to the database:', error);
  }
}

// Export initialized objects
export { sequelize, AdSegment, initializeDatabase };
