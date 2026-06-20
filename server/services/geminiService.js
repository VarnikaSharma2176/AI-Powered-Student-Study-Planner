import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateAIResponse = async (prompt) => {
  try {
    // Debug: Check whether the API key is loaded
    console.log("Gemini Key:", process.env.GEMINI_API_KEY);

    // Create Gemini client after environment variables are loaded
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Select Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // Generate response
    const result = await model.generateContent(prompt);

    // Return AI text
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate AI response.");
  }
};