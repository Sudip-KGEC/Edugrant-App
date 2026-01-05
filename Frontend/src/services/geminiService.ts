
import axios from 'axios';
import { GeminiHistoryItem } from '../../types';


const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/chat`;
<<<<<<< HEAD

=======
>>>>>>> 9098a4a47adc0fa1d89c2b2b482db2a2ae66b407

export const sendMessageToGemini = async (message: string, history: GeminiHistoryItem[]) => {
  try {
    const response = await axios.post(API_URL, {
      message,
      history, 
    });
    
    return response.data.text;
    
  } catch (error) {
    console.error("API URL being called:", API_URL);
    console.error("Error communicating with Ai Edugrant Assistant:", error);
    throw new Error("Failed to get response");
  }
};
