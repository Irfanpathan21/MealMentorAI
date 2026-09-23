import { AzureOpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Azure OpenAI client configuration.
 * Uses GPT-4o for vision (food analysis) and chat (dietitian).
 * Uses text-embedding-ada-002 for vector embeddings.
 */
const client = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview',
});

// Deployment names
export const DEPLOYMENT_GPT4O = process.env.AZURE_OPENAI_DEPLOYMENT_GPT4O || 'gpt-4o';
export const DEPLOYMENT_EMBEDDING = process.env.AZURE_OPENAI_DEPLOYMENT_EMBEDDING || 'text-embedding-ada-002';

export default client;
