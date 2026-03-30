import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.AI_API_KEY;

if (!apiKey) {
  console.error('❌ AI_API_KEY nincs beállítva az .env fájlban!');
}

const genAI = new GoogleGenerativeAI(apiKey || "");

const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-pro",
];

const generateWithFallback = async (prompt: string): Promise<string> => {
  for (const modelName of MODELS) {
    try {
      console.log(`🤖AI Próbálkozás: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      console.log(`✅ Sikeres model: ${modelName}`);
      return result.response.text();
    } catch (error: any) {
      const is429 = error?.message?.includes('429');
      const is404 = error?.message?.includes('404');
      if (is429 || is404) {
        console.warn(`⚠️ ${modelName} nem elérhető (${is429 ? 'kvóta' : 'nem található'}), következő...`);
        continue;
      }
      throw error;
    }
  }
  throw new Error('Minden AI modell kvótája kimerült. Próbáld újra később.');
};

export const recommendBooksWithAI = async (userQuery: string, books: any[]): Promise<number[]> => {
  try {
    console.log('🤖 AI játékajánlás megkezdődött:', userQuery);

    const bookList = books.map(b => ({
      id: b.id,
      title: b.title,
      developer: b.author,
      genre: b.genre,
      gameType: b.literaryForm,
      releaseYear: b.pageCount,
      tagline: b.lyricNote || '',
    }));

    const prompt = `Te egy intelligens indie játékajánló asszisztens vagy, aki széleskörű tudással rendelkezik az indie játékok világában.

Az alábbiakban megkapod az elérhető indie játékok listáját JSON formátumban. A felhasználó bármit beírhat – hangulatot, műfajt, fejlesztőt, játékmechanikát, szereplőt, témát stb.

A feladatod: saját tudásodat felhasználva döntsd el, melyik játékok illenek a leíráshoz. Ne csak a megadott adatmezőkre hagyatkozz – használd azt, amit a fejlesztőkről, játékokról, műfajokról globálisan tudsz.

=== ELÉRHETŐ INDIE JÁTÉKOK ===
${JSON.stringify(bookList, null, 2)}

=== FELHASZNÁLÓ KÉRÉSE ===
"${userQuery}"

=== GONDOLKODÁS MÓDJA ===
Először értsd meg, mit keres a felhasználó, majd kösd össze a játékokkal az általános tudásod alapján:
- Szereplő neve (pl. "Zagreus", "Six", "Ori", "Six") → melyik játékból való? Keresd meg azt a játékot a listában!
- Műfaj ("platformer", "horror", "rpg", "sandbox", "roguelite") → nézd meg a genre mezőt
- Játékmód ("co-op", "multiplayer", "egyjátékos") → nézd meg a gameType mezőt
- Hangulat ("szomorú", "sötét", "aranyos", "nehéz", "relaxáló") → melyik játékok hangulatára illik?
- Fejlesztő neve → direkten szűrj rá a developer mezőre
- Cím részlete → direkten szűrj rá a title mezőre
- Megjelenési év / korszak → nézd meg a releaseYear mezőt

FONTOS SZABÁLYOK:
1. Ha a felhasználó egy szereplő nevét írja be, kösd össze azzal a játékkal, amelyből a szereplő származik!
2. Ha viszont a kérés teljesen értelmetlen (véletlenszerű karakterek, pl. "asdfgh", "qqqqq"), adj vissza üres tömböt [].
3. Ha van bármilyen értelmes kapcsolat – legyen az közvetett is –, add vissza az illő játékok ID-jait!

CSAK JSON tömböt adj vissza, semmi más! Példa: [1, 3, 7]`;

    const text = await generateWithFallback(prompt);
    console.log('AI válasz (nyers):', text);

    const cleanJson = text.replace(/```json|```/g, "").trim();
    const recommendedIds: number[] = JSON.parse(cleanJson);

    console.log('✅ Ajánlott játék ID-k:', recommendedIds);
    return recommendedIds;
  } catch (error) {
    console.error('❌ AI feldolgozás hiba:', error);
    throw error;
  }
};