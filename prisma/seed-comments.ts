import { PrismaClient } from '@prisma/client';

//TODO:
//Több komment és legyen random hogy melyikhez mennyi jelenik meg!
//Egy könyvhöz 0-5 komment legyen random, és legyen egy random user aki írta a kommentet.
//Lehessen likeolni a kommenteket, de ez majd később elég, most csak a kommentek létrehozása a cél.

const prisma = new PrismaClient();

export async function seedComments() {
  console.log('4. Kommentek generálása...');

  const comments = [
    {
      userId: 1,
      bookId: 1,
      content: 'A Hollow Knight a legjobb indie játék amit valaha játszottam. A világ felépítése, a boss harcok és a hangulat egyedülállóan gyönyörű. Órányi felfedezés vár mindenkire!'
    },
    {
      userId: 1,
      bookId: 2,
      content: 'A Stardew Valley egy igazi lelki feltöltődés. Egyetlen fejlesztő hozta létre, mégis annyi tartalom van benne, hogy hetekig nem tudtam letenni. Co-op módban barátokkal különösen élvezetes.'
    },
    {
      userId: 1,
      bookId: 3,
      content: 'A Celeste nem csak egy platformer, hanem egy mélyen érzelmes történet a szorongásról és az önelfogadásról. A pixelgrafika és a zene tökéletes összhangban van.'
    },
    {
      userId: 1,
      bookId: 4,
      content: 'Az Among Us egyszerű koncepció, mégis végtelen szórakozást nyújt. Baráti társaságban órákon át nevettünk – és gyanakodtunk egymásra.'
    },
    {
      userId: 1,
      bookId: 5,
      content: 'A Hades a roguelite műfaj új csúcsa. Minden halál után egyre erősebb leszel, és a sztori is folytatódik. Zagreus karaktere és a görög mitológia brilliánsan van feldolgozva.'
    },
    {
      userId: 1,
      bookId: 6,
      content: 'Az Undertale megváltoztatta azt, ahogyan a játékokra tekintek. Az irónia, a humor, az érzelem és a meta-elemek csodálatosan olvadnak össze. Nem megölni is egy opció – és ez mindent megváltoztat.'
    },
    {
      userId: 1,
      bookId: 7,
      content: 'A Cuphead vizuálisan lenyűgöző – mintha egy 1930-as évekbeli rajzfilmbe kerültél volna. A bosszantóan nehéz boss harcok ellenére teljesen addiktív.'
    },
    {
      userId: 1,
      bookId: 8,
      content: 'A Limbo atmoszférája felülmúlhatatlan. Fekete-fehér képi világa és néma hangulata más játékoknál sosem látott szorongást ad. Rövid, de feledhetetlen élmény.'
    },
    {
      userId: 1,
      bookId: 9,
      content: 'Az Ori and the Blind Forest a legszebb indie játék amit valaha láttam. A zenéje és a grafika együtt szinte síratott meg. Tökéletes platformer és megható történet egyszerre.'
    },
    {
      userId: 1,
      bookId: 10,
      content: 'A Terraria egyike a leghosszabb módon játszható indie játékoknak. Barátokkal együtt egyszerűen végtelen – építs, ásj, harcolj főnökök ellen és fedezz fel minden zugot!'
    }
  ];

  // Létező kommentek törlése
  await prisma.comment.deleteMany();

  // Új kommentek létrehozása
  for (const comment of comments) {
    await prisma.comment.create({
      data: comment,
    });
  }

  console.log('Komment adatok sikeresen feltöltve!');
}
