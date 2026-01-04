
import axios from 'axios';
import { GeminiHistoryItem } from '../types';


const API_URL = 'http://localhost:5000/api/chat'; 

export const sendMessageToGemini = async (message: string, history: GeminiHistoryItem[]) => {
  try {
    const response = await axios.post(API_URL, {
      message,
      history, 
    });
    
    return response.data.text;
  } catch (error) {
    console.error("Error communicating with Ai Edugrant Assistant:", error);
    throw new Error("Failed to get response");
  }
};