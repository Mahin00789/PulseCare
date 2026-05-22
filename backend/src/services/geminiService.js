const { GoogleGenAI } = require("@google/genai");

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_actual_api_key_here' || apiKey === '') {
    console.warn("WARNING: GEMINI_API_KEY is not set. Using mock AI response for demonstration.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Analyzes symptoms using Gemini AI and returns structured data
 * @param {Object} patientData - { symptoms, age, gender, duration, severityLevel }
 * @returns {Promise<Object>}
 */
const analyzeSymptomsWithAI = async (patientData) => {
  const ai = getGeminiClient();
  
  if (!ai) {
    // Return a mock response if no API key is provided
    return new Promise(resolve => {
      setTimeout(() => {
        const isSevere = patientData.severityLevel === 'Severe' || patientData.severityLevel === 'Emergency' || patientData.symptoms.toLowerCase().includes('chest');
        resolve({
          possibleConditions: [
            { condition: isSevere ? "Acute Myocardial Infarction" : "Viral URI", confidence: "High", description: isSevere ? "Heart attack symptoms." : "Common cold symptoms." },
            { condition: isSevere ? "Angina Pectoris" : "Allergic Rhinitis", confidence: "Medium", description: isSevere ? "Reduced blood flow to heart." : "Allergies." }
          ],
          severityClassification: isSevere ? "Emergency" : "Mild",
          precautions: isSevere ? ["Call emergency services immediately", "Do not drive yourself"] : ["Rest and hydrate", "Monitor symptoms"],
          recommendedSpecialist: isSevere ? "Cardiologist" : "General Physician",
          requiresImmediateAttention: isSevere
        });
      }, 1500);
    });
  }

  const prompt = `
You are an advanced medical AI symptom checker. Analyze the following patient data and provide a structured JSON response. Do NOT include markdown code blocks like \`\`\`json in your response, just return the raw JSON object.

Patient Data:
- Symptoms: ${patientData.symptoms}
- Age: ${patientData.age}
- Gender: ${patientData.gender}
- Duration of symptoms: ${patientData.duration}
- Self-reported Severity: ${patientData.severityLevel}

Your task is to provide an assessment.
Determine if the symptoms indicate an emergency (e.g., chest pain, breathing difficulty, unconsciousness, stroke-like symptoms).

Respond EXACTLY with this JSON structure:
{
  "possibleConditions": [
    { "condition": "Name of condition", "confidence": "High/Medium/Low", "description": "Brief description" }
  ],
  "severityClassification": "Mild" | "Moderate" | "Severe" | "Emergency",
  "precautions": ["precaution 1", "precaution 2"],
  "recommendedSpecialist": "General Physician" | "Cardiologist" | "Neurologist" | "Pulmonologist" | "Orthopedist" | etc.,
  "requiresImmediateAttention": true/false
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text;
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze symptoms with AI.");
  }
};

module.exports = {
  analyzeSymptomsWithAI
};
