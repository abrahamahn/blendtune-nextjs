// src\shared\config\loadEnv.js
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

/**
 * Loads environment-specific configuration file
 * @param {string} env - Environment type (development/production)
 */
function loadEnvFile(env) {
  // Construct path to environment-specific .env file
  const filePath = path.resolve(__dirname, `.env.${env}`);
  
  try {
    // Check if environment file exists
    if (fs.existsSync(filePath)) {
      // Load environment variables from the specific file
      dotenv.config({ path: filePath });
      console.log(`Loaded environment variables from ${filePath}`);
    } else {
      console.warn(`No .env.${env} file found`);
    }
  } catch (error) {
    console.error(`Error loading environment file: ${error.message}`);
  }
}

// Determine and load appropriate environment configuration
const currentEnv = process.env.NODE_ENV || 'development';
loadEnvFile(currentEnv);