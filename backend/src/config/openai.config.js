require('dotenv').config();

module.exports = {
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4-turbo',
  temperature: 0.5,
  maxTokens: 1500
}; 