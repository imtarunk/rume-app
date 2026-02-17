
const fs = require('fs');
const path = require('path');

const pdfParseIndex = path.join(__dirname, 'node_modules', 'pdf-parse', 'index.js');

if (fs.existsSync(pdfParseIndex)) {
    let content = fs.readFileSync(pdfParseIndex, 'utf8');
    // Replace the debug mode check
    content = content.replace('let isDebugMode = !module.parent;', 'let isDebugMode = false;');
    fs.writeFileSync(pdfParseIndex, content);
    console.log('Patched pdf-parse/index.js');
} else {
    console.log('pdf-parse/index.js not found');
}
