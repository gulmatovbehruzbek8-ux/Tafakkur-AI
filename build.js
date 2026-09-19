const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('[build.js] Installing frontend dependencies...');
execSync('npm install --include=dev', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

console.log('[build.js] Building Next.js application...');
execSync('npm run build', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

console.log('[build.js] Syncing .next build artifacts to root...');
const frontendNext = path.join(__dirname, 'frontend', '.next');
const rootNext = path.join(__dirname, '.next');
if (fs.existsSync(frontendNext)) {
  fs.cpSync(frontendNext, rootNext, { recursive: true });
}
console.log('[build.js] Build completed successfully!');
