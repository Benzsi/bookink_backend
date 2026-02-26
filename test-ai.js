const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyA6lGpUuHa9qlchWxXJL9yce4rMK-I1pLk";
const genAI = new GoogleGenerativeAI(apiKey);

async function testAI() {
  try {
    console.log("🤖 AI test indítása...");
    
    // List available models
    console.log("\n📋 Elérhető modellek lekérése...");
    try {
      const models = await genAI.listModels();
      console.log("Elérhető modellek:");
      for (const model of models) {
        console.log("  -", model.name);
      }
    } catch (e) {
      console.log("Modellek listázása nem sikerült, próbáljunk `gemini-pro`-val...");
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt = `Json csak!
    {"genre": "eposz", "author": "Homérosz", "searchTerm": "Iliász"}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ AI válasz:", text);
  } catch (error) {
    console.error("❌ Hiba:", error.message);
  }
}

testAI();
