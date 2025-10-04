const fs = require('fs');
const path = require('path');
const { parse } = require('../src/lib/parser.js');

const files = [
  // Test fixtures
  '../test/__fixtures__/valid-complete.ini',
  '../test/__fixtures__/valid-simple.ini',
  '../test/__fixtures__/valid-multiline.ini',
  '../test/__fixtures__/valid-global-keys.ini',
  '../test/__fixtures__/valid-simple.config',
  '../test/__fixtures__/valid-simple.properties',
  '../test/__fixtures__/empty.ini',
  '../test/__fixtures__/edge-cases.ini'
];

console.log('='.repeat(80));
console.log('PARSING ALL EXAMPLE FILES');
console.log('='.repeat(80));
console.log();

files.forEach((filename) => {
  const filePath = path.join(__dirname, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filename}`);
    console.log();
    return;
  }

  console.log(`📄 FILE: ${filename}`);
  console.log('-'.repeat(80));

  const content = fs.readFileSync(filePath, 'utf8');
  const result = parse(content);

  console.log(JSON.stringify(result, null, 2));
  console.log();
  console.log('='.repeat(80));
  console.log();
});

console.log('✅ All files parsed successfully!');
