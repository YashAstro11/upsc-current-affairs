import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function summarizeNewsForUPSC(rawText: string) {
  const prompt = `
    You are an expert UPSC CSE tutor. Given the following news article, extract the most important information for a UPSC aspirant.
    
    Format your response EXACTLY as a JSON object matching this TypeScript interface:
    {
      "category": string, // One of: "Polity", "Economy", "Environment", "Science & Tech", "International Relations", "Geography", "Government Schemes"
      "title": string, // A short, catchy title
      "whyInNews": string, // 1-2 sentences on why this is in the news today
      "summary": string, // A concise 2-3 sentence explanation of the topic
      "prelimsFacts": string[], // 3-4 bullet points of hard facts for prelims
      "staticConnection": string, // e.g. "Economy → Monetary Policy → Repo Rate"
      "importance": "High" | "Medium" | "Low"
    }

    Raw News Text:
    ${rawText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    const cleanText = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error summarizing with Gemini:", error);
    return null;
  }
}

export async function generateMCQForUPSC(topicSummary: string) {
  const prompt = `
    You are an expert UPSC CSE tutor. Given the following topic summary, generate a multiple choice question suitable for the UPSC Prelims exam.
    
    Format your response EXACTLY as a JSON object matching this TypeScript interface:
    {
      "category": string, // Same category as the topic
      "question": string, // The MCQ question
      "options": string[], // Exactly 4 options
      "answer": number, // The index of the correct option (0-3)
      "explanation": string // 1-2 sentences explaining why the answer is correct
    }

    Topic Summary:
    ${topicSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    const cleanText = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error generating MCQ with Gemini:", error);
    return null;
  }
}
