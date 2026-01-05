import { Request, Response } from 'express';
import { GoogleGenAI } from "@google/genai";
import Scholarship from '../models/Scholarship'; 

export const chatWithAI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const scholarshipData = await Scholarship.find({}).limit(10).select('name amount deadline category gpaRequirement degreeLevel description');
    
    const context = scholarshipData.map(s => (
      `Name: ${s.name}, Amount: ${s.amount}, Category: ${s.category}, GPA Req: ${s.gpaRequirement}, Level: ${s.degreeLevel}, Deadline: ${s.deadline}`
    )).join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...history, 
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `You are the Edugrant Assistant. Use the following scholarship data to help students. 
        If a student mentions their GPA, compare it against the "GPA Req". 
        If they ask for specific categories, filter the list below.
        
        DATA:
        ${context}
        
        Keep answers helpful and formatted in simple markdown if listing scholarships.`,
      }
    });

    const botReply = response.text; 

    res.status(200).json({ text: botReply });

  } catch (error: any) {
    console.error("AI Controller Error:", error);
    if (error.status === 429) {
          res.status(429).json({ 
                error: "Rate limit exceeded. Please wait a moment before trying again." 
            });
        }
      res.status(500).json({ error: "Internal Server Error" });
    
  }
};