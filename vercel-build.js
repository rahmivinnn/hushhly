// vercel-build.js
const fs = require('fs');
const path = require('path');

// Ensure the dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// Copy _redirects file to dist
fs.copyFileSync(
  path.join(__dirname, 'public', '_redirects'),
  path.join(__dirname, 'dist', '_redirects')
);

// Create a Vercel-specific _routes.json file
const routesContent = {
  "version": 1,
  "routes": [
    {
      "src": "^/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "^/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "^/favicon.ico",
      "dest": "/favicon.ico"
    },
    {
      "src": "^/manifest.json",
      "dest": "/manifest.json"
    },
    {
      "src": "^/(.*)",
      "dest": "/index.html"
    }
  ]
};

fs.writeFileSync(
  path.join(__dirname, 'dist', '_routes.json'),
  JSON.stringify(routesContent, null, 2)
);

console.log('Vercel build configuration completed');
