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
      console.log(`🤖 Próbálkozás: ${modelName}`);
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
    console.log('🤖 AI könyvajánlás megkezdődött:', userQuery);

    const bookList = books.map(b => ({
      id: b.id,
      title: b.title,
      author: b.author,
      genre: b.genre,
      literaryForm: b.literaryForm,
      pageCount: b.pageCount,
      lyricNote: b.lyricNote || '',
    }));

    const prompt = `Te egy intelligens könyvajánló asszisztens vagy, aki széles irodalmi tudással rendelkezik.

Az alábbiakban megkapod az elérhető könyvek listáját JSON formátumban. A felhasználó bármit beírhat – szereplő nevét, hangulatot, korszakot, témát, jellemzőt, stílust stb.

A feladatod: saját irodalmi tudásodat felhasználva döntsd el, melyik könyvek illenek a leíráshoz. Ne csak a megadott adatmezőkre hagyatkozz – használd azt, amit a szerzőkről, művekről, korszakokról, szereplőkről globálisan tudsz.

=== ELÉRHETŐ KÖNYVEK ===
${JSON.stringify(bookList, null, 2)}

=== FELHASZNÁLÓ KÉRÉSE ===
"${userQuery}"

=== GONDOLKODÁS MÓDJA ===
Először értsd meg, mit keres a felhasználó, majd kösd össze a könyvekkel az általános tudásod alapján:
- Szereplő neve (pl. "Ophelia", "Akhilleusz", "Hamlet", "Odüsszeusz", "Jób") → melyik műből való? Keresd meg azt a könyvet a listában!
- Korszak ("régi", "ókori", "antik", "középkori") → nézd meg a szerzők korát a tudásod alapján
- Téma ("háború", "szeretet", "utazás", "bosszú", "hatalom") → melyik könyvek szólnak erről?
- Hangulat ("szomorú", "hős", "misztikus", "romantikus", "sötét") → melyik könyvek hangulatára illik?
- Szerző neve → direkten szűrj rá az author mezőre
- Cím részlete → direkten szűrj rá a title mezőre

FONTOS SZABÁLYOK:
1. Ha a felhasználó egy szereplő nevét írja be, kösd össze azzal a művel, amelyből a szereplő származik!
2. Ha viszont a kérés teljesen értelmetlen (véletlenszerű karakterek, pl. "asdfgh", "qqqqq"), adj vissza üres tömböt [].
3. Ha van bármilyen értelmes irodalmi kapcsolat – legyen az közvetett is –, add vissza az illő könyvek ID-jait!

CSAK JSON tömböt adj vissza, semmi más! Példa: [1, 3, 7]`;

    const text = await generateWithFallback(prompt);
    console.log('AI válasz (nyers):', text);

    const cleanJson = text.replace(/```json|```/g, "").trim();
    const recommendedIds: number[] = JSON.parse(cleanJson);

    console.log('✅ Ajánlott könyv ID-k:', recommendedIds);
    return recommendedIds;
  } catch (error) {
    console.error('❌ AI feldolgozás hiba:', error);
    throw error;
  }
};