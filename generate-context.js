const fs = require('fs');
const path = require('path');

const EXCLUDED_DIRS = new Set(['node_modules', '.git', '.turbo', 'dist', 'build', '.next', 'coverage', '.cache', 'public', '.swc']);
const EXCLUDED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.pdf', '.zip', '.mp4', '.webm', '.map','.tsbuildinfo','.gitignore']);
const MAX_FILE_SIZE = 1024 * 1024 * 2; // 2MB

function walkDir(dir, callback) {
  try {
    fs.readdirSync(dir).forEach(f => {
      let dirPath = path.join(dir, f);
      try {
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
          if (!EXCLUDED_DIRS.has(f)) walkDir(dirPath, callback);
        } else {
          if (!EXCLUDED_EXTENSIONS.has(path.extname(f).toLowerCase()) && f !== 'pnpm-lock.yaml' && f !== 'context.md' && f !== 'package-lock.json' && f !== 'yarn.lock' && f !== '.env' && f !== '.gitignore') {
            callback(dirPath);
          }
        }
      } catch(e) {
        // Skip files that can't be stat'd
      }
    });
  } catch (e) {
    // Skip dirs that can't be read
  }
}

const outputFile = path.join(__dirname, 'context.md');
if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);

const writeStream = fs.createWriteStream(outputFile, { flags: 'a' });

walkDir(__dirname, (filePath) => {
    try {
        const stats = fs.statSync(filePath);
        if (stats.size > MAX_FILE_SIZE) return;

        const relativePath = path.relative(__dirname, filePath).replace(/\\/g, '/');
        // skip the script itself
        if (relativePath === 'generate-context.js') return;

        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Skip binary or minified files disguised as text
        if (content.indexOf('\0') !== -1 || (content.length > 50000 && content.split('\n').length < 10)) {
            return;
        }

        const ext = path.extname(filePath).slice(1);
        writeStream.write(`\n\n## ${relativePath}\n\n\`\`\`${ext}\n${content}\n\`\`\`\n`);
    } catch (e) {
        console.error(`Error reading ${filePath}: ${e.message}`);
    }
});

writeStream.end();
writeStream.on('finish', () => {
    console.log('Successfully created context.md');
});
