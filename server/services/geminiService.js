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
    const enhancedPrompt = `
    You are StudyFlow AI Assistant.

    Rules:
    - Use headings.
    - Use bullet points.
    - Use numbered lists where appropriate.
    - Keep paragraphs short.
    - Never return one long block of text.
    - Make answers easy for students to read.

    Student Question:
    ${prompt}
    `;

    const result = await model.generateContent(
      enhancedPrompt
    );

    // Return AI text
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate AI response.");
  }
};