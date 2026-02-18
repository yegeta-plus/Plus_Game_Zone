
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types.ts";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (transactions: Transaction[]) => {
  const transactionSummary = transactions.map(t => 
    `${t.type}: ${t.amount} ETB via ${t.method} for ${t.note}`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a financial advisor for 'Plus Game Zone', an Ethiopian gaming and entertainment business. Analyze these transactions and provide 3 brief, actionable insights in English. Focus on savings, Equb participation, or digital wallet usage. 
      Transactions:
      ${transactionSummary}`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "No insights available at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Insights are currently unavailable.";
  }
};

export const generateGamingImage = async (quoteText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `A high-quality, cinematic digital art illustration for a gaming wallpaper. Concept: ${quoteText}. Style: futuristic arcade, neon indigo lighting, detailed characters.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};

export const getDetailedBusinessReport = async (transactions: Transaction[]) => {
  const summary = transactions.slice(0, 30).map(t => `${t.date}: ${t.type} ${t.amount} ETB (${t.note})`).join('\n');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a deep financial analysis for 'Plus Game Zone', a premier entertainment venue in Ethiopia. 
      Provide:
      1. Business Health Score (1-100)
      2. Performance Summary for Plus Game Zone
      3. LATE INCOME WARNINGS: Predict if any regular income streams look like they might be late.
      4. Risk Assessment.

      Data:
      ${summary}`,
    });
    return response.text || "Unable to generate report.";
  } catch (error) {
    console.error("Business Report Error:", error);
    return "Analysis failed.";
  }
};

export const parseSmsToTransaction = async (smsText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Parse this Ethiopian bank/wallet SMS for 'Plus Game Zone' into a JSON object. 
      SMS: "${smsText}"
      Response must be strictly valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            method: { type: Type.STRING, description: "CASH, TELEBIRR, CBE, or EBIRR" },
            type: { type: Type.STRING, description: "INCOME or EXPENSE" },
            vendor: { type: Type.STRING },
            reference: { type: Type.STRING },
          },
          required: ["amount", "method", "type"]
        }
      }
    });
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("SMS Parsing Error:", error);
    return null;
  }
};

export const parseReceiptImage = async (base64Image: string) => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { 
        parts: [
          imagePart, 
          { text: "Analyze this receipt or bank screenshot for 'Plus Game Zone'. Extract: amount (number), method (CBE, TELEBIRR, or CASH), type (INCOME or EXPENSE), and vendor name. Return JSON." }
        ] 
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            method: { type: Type.STRING },
            type: { type: Type.STRING },
            vendor: { type: Type.STRING },
            note: { type: Type.STRING }
          },
          required: ["amount", "method", "type"]
        }
      }
    });
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("Vision Parsing Error:", error);
    return null;
  }
};
