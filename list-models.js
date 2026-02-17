
require('dotenv').config({ path: '.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Error: GEMINI_API_KEY is not set');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log('Fetching available models...');
        // Note: listModels might not be directly exposed on the instance in older/newer versions, 
        // but let's try to access it via the API directly if the SDK doesn't make it obvious, 
        // or just use a known working model if I can find one. 
        // The SDK *does* seem to wrap HTTP endpoints. 
        // Actually, the SDK doesn't expose listModels on the client instance directly in some versions.
        // Let's us a simple fetch to the API endpoint to list models.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        console.log('Available models:');
        if (data.models) {
            data.models.forEach(model => {
                if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${model.name} (${model.displayName})`);
                }
            });
        } else {
            console.log('No models found in response:', data);
        }

    } catch (error) {
        console.error('Error listing models:', error.message);
    }
}

listModels();
