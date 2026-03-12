const fs = require('fs');
const path = require('path');

const stripComments = (code) => {
  return code.replace(/("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`|\/\*[\s\S]*?\*\/|\/\/.*)/g, (match) => {
    if (match.startsWith('//') || match.startsWith('/*')) {
      return '';
    }
    return match;
  });
};

const filePath = process.argv[2];
if (!filePath) {
  process.exit(1);
}

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const stripped = stripComments(content);
  fs.writeFileSync(filePath, stripped, 'utf8');
  console.log(`Processed: ${filePath}`);
} catch (err) {
  console.error(`Error processing ${filePath}: ${err.message}`);
}
