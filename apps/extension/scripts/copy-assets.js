import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Create dist directory if it doesn't exist
const distDir = join(root, 'dist');
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Copy manifest.json
copyFileSync(
  join(root, 'manifest.json'),
  join(distDir, 'manifest.json')
);

// Copy public folder contents
const publicDir = join(root, 'public');

// Copy all public assets
try {
  const entries = readdirSync(publicDir, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(publicDir, entry.name);
    const destPath = join(distDir, entry.name);
    
    if (entry.isDirectory()) {
      if (!existsSync(destPath)) {
        mkdirSync(destPath, { recursive: true });
      }
      // Copy all files in the directory
      const files = readdirSync(srcPath);
      for (const file of files) {
        copyFileSync(join(srcPath, file), join(destPath, file));
      }
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
  
  console.log('✓ Assets copied successfully');
} catch (err) {
  console.error('Error copying assets:', err);
  process.exit(1);
}


