
require('dotenv').config({ path: '.env' }); // Load .env file
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Error: GEMINI_API_KEY is not set in .env');
        return;
    }

    console.log('API Keyfound:', apiKey.substring(0, 5) + '...');
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTest = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];

    for (const modelName of modelsToTest) {
        console.log(`\nTesting model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Hello');
            const response = await result.response;
            console.log(`Success with ${modelName}:`, response.text().substring(0, 50) + '...');
            return; // Exit on first success
        } catch (error) {
            console.error(`Failed with ${modelName}:`, error.message);
            if (error.message.includes('404')) {
                console.log('  -> 404 indicates model not found or API key has no access.');
            }
        }
    }
}

testGemini();
