import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.AI_API_KEY;

if (!apiKey) {
  console.error('❌ AI_API_KEY nincs beállítva az .env fájlban!');
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const parseFilterWithAI = async (userInput: string) => {
  try {
    console.log('🤖 AI keresés megkezdődött:', userInput);
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt = `
    Te egy könyvkereső asszisztens vagy. A feladatod, hogy a felhasználó kéréséből kinyerj paramétereket JSON formátumban.
    Csak a tiszta JSON objektumot add vissza, semmi más!
    
    FONTOS! Ha az irodalmi formát említik:
    - "eposz" vagy "epika" -> "EPIKA"
    - "líra" -> "LÍRA"
    - "dráma" vagy "drámacikk" -> "DRÁMA"
    
    Elérhető mezők a könyvekből:
    - title (cím)
    - author (szerző)
    - genre (műfaj)
    - literaryForm (irodalmi forma: EPIKA, LÍRA, DRÁMA) - NAGYBETŰVEL!
    - lyricNote (jellemzés)
    
    Válaszolj CSAK JSON-nal! Csak azokat a mezőket add be, amelyeket a felhasználó megemlített!
    Normalizáld az irodalmi formákat NAGYBETŰRE (EPIKA, LÍRA, DRÁMA)!
    
    Felhasználó kérése: "${userInput}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('AI válasz (nyers):', text);
    
    // JSON kinyerése (néha az AI markdown-ba teszi)
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJson);
    
    console.log('✅ AI feldolgozás sikeres:', parsed);
    return parsed;
  } catch (error) {
    console.error('❌ AI feldolgozás hiba:', error);
    throw error;
  }
};