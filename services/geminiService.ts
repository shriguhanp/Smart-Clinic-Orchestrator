
import { GoogleGenAI, Type } from "@google/genai";
import { RiskCategory, AIAnalysisResponse } from "../types";

export const analyzeSymptoms = async (
  symptoms: string, 
  age: number, 
  chronicConditions: string[]
): Promise<AIAnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze the following patient data for medical triage. 
  Patient Age: ${age}
  Chronic Conditions: ${chronicConditions.join(', ')}
  Reported Symptoms: ${symptoms}
  
  Provide a severity score (1-10, where 10 is critical) and a risk category (HIGH, MEDIUM, LOW).
  Also provide a brief reasoning for this assessment.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severityScore: { type: Type.NUMBER, description: "A score from 1 to 10." },
            riskCategory: { type: Type.STRING, enum: Object.values(RiskCategory), description: "Triage category." },
            reasoning: { type: Type.STRING, description: "Brief explanation of the risk assessment." }
          },
          required: ["severityScore", "riskCategory", "reasoning"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      severityScore: result.severityScore || 1,
      riskCategory: result.riskCategory || RiskCategory.LOW,
      reasoning: result.reasoning || "Automatic assessment completed."
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    // Fallback logic
    return {
      severityScore: symptoms.toLowerCase().includes('chest pain') ? 9 : 3,
      riskCategory: symptoms.toLowerCase().includes('chest pain') ? RiskCategory.HIGH : RiskCategory.LOW,
      reasoning: "Preliminary assessment based on keyword matching (AI connection issue)."
    };
  }
};
