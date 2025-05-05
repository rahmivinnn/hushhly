import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m'
  },

  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m'
  }
};

// Log with colors
function log(message, color = colors.fg.white) {
  console.log(`${color}${message}${colors.reset}`);
}

// Log success message
function success(message) {
  log(`✅ ${message}`, colors.fg.green);
}

// Log error message
function error(message) {
  log(`❌ ${message}`, colors.fg.red);
}

// Log info message
function info(message) {
  log(`ℹ️ ${message}`, colors.fg.cyan);
}

// Log warning message
function warning(message) {
  log(`⚠️ ${message}`, colors.fg.yellow);
}

// Ensure the dist directory exists
function ensureDistDirectory() {
  info('Ensuring dist directory exists...');
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  success('Dist directory ready');
}

// Copy necessary files to dist
function copyFilesToDist() {
  info('Copying necessary files to dist...');

  // Copy _redirects file
  if (fs.existsSync(path.join('public', '_redirects'))) {
    fs.copyFileSync(
      path.join('public', '_redirects'),
      path.join('dist', '_redirects')
    );
    success('Copied _redirects file');
  } else {
    warning('_redirects file not found in public directory');

    // Create _redirects file if it doesn't exist
    fs.writeFileSync(
      path.join('dist', '_redirects'),
      '/* /index.html 200\\n/assets/* /assets/:splat 200\\n/favicon.ico /favicon.ico 200'
    );
    success('Created _redirects file in dist');
  }

  // Copy 200.html file (fallback for Vercel)
  if (fs.existsSync(path.join('public', '200.html'))) {
    fs.copyFileSync(
      path.join('public', '200.html'),
      path.join('dist', '200.html')
    );
    success('Copied 200.html file');
  } else {
    warning('200.html file not found in public directory');
  }

  // Copy index.html to 200.html if 200.html doesn't exist
  if (fs.existsSync(path.join('dist', 'index.html')) && !fs.existsSync(path.join('dist', '200.html'))) {
    fs.copyFileSync(
      path.join('dist', 'index.html'),
      path.join('dist', '200.html')
    );
    success('Copied index.html to 200.html');
  }
}

// Create Vercel-specific configuration
function createVercelConfig() {
  info('Creating Vercel-specific configuration...');

  // Create _routes.json file for Vercel
  const routesContent = {
    "version": 1,
    "routes": [
      {
        "src": "^/assets/(.*)",
        "dest": "/assets/$1"
      },
      {
        "src": "^/favicon.ico",
        "dest": "/favicon.ico"
      },
      {
        "src": "^/(.*)",
        "dest": "/index.html"
      }
    ]
  };

  fs.writeFileSync(
    path.join('dist', '_routes.json'),
    JSON.stringify(routesContent, null, 2)
  );
  success('Created _routes.json file for Vercel');
}

// Run the build process
function runBuild() {
  try {
    info('Running build process...');
    execSync('npm run build', { stdio: 'inherit' });
    success('Build completed successfully');
    return true;
  } catch (err) {
    error('Build failed');
    console.error(err);
    return false;
  }
}

// Main function
function main() {
  log('🚀 Starting build and deploy preparation...', colors.fg.magenta);

  // Run the build
  const buildSuccess = runBuild();
  if (!buildSuccess) {
    error('Build failed, stopping deployment preparation');
    process.exit(1);
  }

  // Ensure dist directory exists
  ensureDistDirectory();

  // Copy necessary files
  copyFilesToDist();

  // Create Vercel configuration
  createVercelConfig();

  log('🎉 Build and deploy preparation completed successfully!', colors.fg.magenta);
  info('You can now deploy to Vercel with: vercel --prod');
}

// Run the main function
main();

// Export for ES modules
export default main;
