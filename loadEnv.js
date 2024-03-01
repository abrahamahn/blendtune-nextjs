const fs = require('fs');
const path = require('path');

function loadEnvFile(env) {
  const filePath = path.resolve(__dirname, `.env.${env}`);
  if (fs.existsSync(filePath)) {
    require('dotenv').config({ path: filePath });
    console.log(`Loaded environment variables from ${filePath}`);
  } else {
    console.warn(`No .env.${env} file found`);
  }
}

if (process.env.NODE_ENV === 'production') {
  loadEnvFile('production');
} else {
  loadEnvFile('development');
}
