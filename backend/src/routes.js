const path = require('path');
const fs = require('fs');

const ROOT_PATH = process.env.ROOT_PATH || '../../../';
const FRONTEND_BUILD_PATH = path.resolve(__dirname, ROOT_PATH, 'frontend', 'dist');

// Validate frontend build directory exists
if (!fs.existsSync(FRONTEND_BUILD_PATH)) {
  const errorMsg = `Frontend build directory not found: ${FRONTEND_BUILD_PATH}`;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(errorMsg);
  } else {
    console.warn(`Warning: ${errorMsg}`);
  }
}

/**
 * Application route configuration
 */
module.exports = {
  app: {
    frontend: '/',
  },
  fs: {
    frontend: FRONTEND_BUILD_PATH,
  }
};