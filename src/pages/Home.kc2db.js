import { getSecret } from 'wix-secrets-backend';

// Function to securely retrieve the ChatGPT API key from the Secrets Manager
export async function getChatGPTApiKey() {
    try {
        // 'chatGPT' is the secret key name you configured
        return await getSecret('chatGPT');
    } catch (error) {
        console.error('Error retrieving ChatGPT API key:', error);
        throw new Error('ChatGPT API key retrieval failed');
    }
}

// Function to send a request to ChatGPT's API using the securely stored API key
export async function sendChatGPTRequest(prompt) {
    try {
        // Retrieve the API key securely
        const apiKey = await getChatGPTApiKey();
        
        // Define the ChatGPT API endpoint (using OpenAI's completions endpoint as an example)
        const apiUrl = 'https://api.openai.com/v1/completions';
        
        // Prepare the request payload
        const requestData = {
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 50
        };
        
        // Send the API request using fetch (backend fetch is available in Wix)
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            console.error('ChatGPT API error:', response.status, response.statusText);
            throw new Error('ChatGPT API request failed');
        }
        
        const data = await response.json();
        console.log('ChatGPT API response:', data);
        return data;
    } catch (error) {
        console.error('Error in sendChatGPTRequest:', error);
        throw error;
    }
}