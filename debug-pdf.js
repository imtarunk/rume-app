
const { PDFParse } = require('pdf-parse');

console.log('PDFParse is:', PDFParse);
try {
    const instance = new PDFParse();
    console.log('new PDFParse() worked', instance);
} catch (e) {
    console.log('new PDFParse() failed', e.message);
}

try {
    const result = PDFParse(Buffer.from('test'));
    console.log('PDFParse() worked', result);
} catch (e) {
    console.log('PDFParse() failed', e.message);
}
