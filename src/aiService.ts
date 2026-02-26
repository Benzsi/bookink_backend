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

    const prompt = `Te egy könyvkereső asszisztens vagy egy könyvkeresési rendszerben. A felhasználó természetes nyelvű kéréseket fog beírni, és a feladatod, hogy kinyerj releváns szűrési paramétereket JSON formátumban.

=== ALAPSZABÁLYOK ===
1. CSAK JSON objektumot adj vissza! Semmi más, semmi magyarázat!
2. Normalizáld az irodalmi formákat NAGY BETŰRE: EPIKA, LÍRA, DRÁMA
3. Csak azokat a mezőket add meg, amelyeket a felhasználó valójában megemlített!
4. Kerüld az üres stringeket és null értékeket

=== IRODALMI FORMÁK NORMALIZÁLÁSA ===
Ha a felhasználó "eposz", "epikus", "epopeosz" vagy "epika"-t mond → EPIKA
Ha a felhasználó "líra", "költészet", "vers", "lírikai" vagy "dalok"-at mond → LÍRA
Ha a felhasználó "dráma", "tragédia", "komédia", "farsang" vagy "darab"-ot mond → DRÁMA

=== ELÉRHETŐ MEZŐK A KÖNYVEKBŐL ===
- title: A könyv címe (ha a felhasználó konkrét címüt mond)
- author: A szerző neve (ha a felhasználó szerző után keres)
- genre: A műfaj (pl.: VALLÁSI_IRAT, EPOSZ, REGÉNY, FANTÁZIA, stb.)
- literaryForm: Az irodalmi forma - CSAK: EPIKA, LÍRA, DRÁMA (NAGYBETŰVEL!)
- lyricNote: A könyv jellemzése/lírája (leírás kereséshez)

=== RÉSZLETES PÉLDÁK ===

PÉLDA 1: Egyszerű szerző keresés
Felhasználó: "Homérosz könyveit keresem"
Válasz: {"author": "Homérosz"}

PÉLDA 2: Irodalmi forma keresés
Felhasználó: "Epikus költemények"
Válasz: {"literaryForm": "EPIKA"}

PÉLDA 3: Kombinált keresés
Felhasználó: "Dante tragikus drámái"
Válasz: {"author": "Dante", "literaryForm": "DRÁMA"}

PÉLDA 4: Műfaj keresés
Felhasználó: "Vallási irodalom"
Válasz: {"genre": "VALLÁSI_IRAT"}

PÉLDA 5: Cím keresés
Felhasználó: "Divina Commedia"
Válasz: {"title": "Commedia"}

PÉLDA 6: Csak egy szó
Felhasználó: "Biblia"
Válasz: {"title": "Biblia"}

PÉLDA 7: Költészet/vers
Felhasználó: "Vers gyűjtemények"
Válasz: {"literaryForm": "LÍRA"}

PÉLDA 8: Összetett keresés
Felhasználó: "Középkori epikai művek"
Válasz: {"literaryForm": "EPIKA", "genre": "EPOSZ"}

=== INTELLIGENS ÉRTELMEZÉS ===
- Ha csak egy szócsoport van (pl. "biblia", "Homérosz"), próbálkozz meg azt értelmezni a kontextusban
- Ha a név szerepel, az általában szerző vagy cím
- Az irodalmi forma önmagában specifikus, ezért azt szigorúan kezelj (CSAK EPIKA, LÍRA, DRÁMA)
- Ha bizonytalan vagy egy mezőről, hagyd ki!

=== SZÜKSÉGES FORMÁTUM ===
CSAK JSON OBJEKTUM! Nincs szöveg, nincs magyarázat, nincs markdown!
Pl. helyes válaszok: {"author": "Homérosz"} vagy {"literaryForm": "EPIKA"} vagy {"author": "Dante", "literaryForm": "DRÁMA"}

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