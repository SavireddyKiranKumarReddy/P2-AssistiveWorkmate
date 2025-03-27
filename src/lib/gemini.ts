import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDNv1KoRyLApPgGya_GxRb9vrg6o7EZ_hM';
const genAI = new GoogleGenerativeAI(API_KEY);

export async function getGeminiResponse(prompt: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    throw new Error('Failed to get AI response');
  }
}