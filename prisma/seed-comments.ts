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
      sequenceNumber: 1,
      content: 'A Hollow Knight a legjobb indie játék amit valaha játszottam. A világ felépítése, a boss harcok és a hangulat egyedülállóan gyönyörű. Órányi felfedezés vár mindenkire!'
    },
    {
      sequenceNumber: 2,
      content: 'A Stardew Valley egy igazi lelki feltöltődés. Egyetlen fejlesztő hozta létre, mégis annyi tartalom van benne, hogy hetekig nem tudtam letenni. Co-op módban barátokkal különösen élvezetes.'
    },
    {
      sequenceNumber: 3,
      content: 'A Celeste nem csak egy platformer, hanem egy mélyen érzelmes történet a szorongásról és az önelfogadásról. A pixelgrafika és a zene tökéletes összhangban van.'
    },
    {
      sequenceNumber: 4,
      content: 'Az Among Us egyszerű koncepció, mégis végtelen szórakozást nyújt. Baráti társaságban órákon át nevettünk – és gyanakodtunk egymásra.'
    },
    {
      sequenceNumber: 5,
      content: 'A Hades a roguelite műfaj új csúcsa. Minden halál után egyre erősebb leszel, és a sztori is folytatódik. Zagreus karaktere és a görög mitológia brilliánsan van feldolgozva.'
    },
    {
      sequenceNumber: 6,
      content: 'Az Undertale megváltoztatta azt, ahogyan a játékokra tekintek. Az irónia, a humor, az érzelem és a meta-elemek csodálatosan olvadnak össze. Nem megölni is egy opció – és ez mindent megváltoztat.'
    },
    {
      sequenceNumber: 7,
      content: 'A Cuphead vizuálisan lenyűgöző – mintha egy 1930-as évekbeli rajzfilmbe kerültél volna. A bosszantóan nehéz boss harcok ellenére teljesen addiktív.'
    },
    {
      sequenceNumber: 8,
      content: 'A Limbo atmoszférája felülmúlhatatlan. Fekete-fehér képi világa és néma hangulata más játékoknál sosem látott szorongást ad. Rövid, de feledhetetlen élmény.'
    },
    {
      sequenceNumber: 9,
      content: 'Az Ori and the Blind Forest a legszebb indie játék amit valaha láttam. A zenéje és a grafika együtt szinte síratott meg. Tökéletes platformer és megható történet egyszerre.'
    },
    {
      sequenceNumber: 10,
      content: 'A Terraria egyike a leghosszabb módon játszható indie játékoknak. Barátokkal együtt egyszerűen végtelen – építs, ásj, harcolj főnökök ellen és fedezz fel minden zugot!'
    }
  ];

  const adminUser = await prisma.user.findUnique({
    where: { username: 'admin' },
    select: { id: true },
  });

  if (!adminUser) {
    throw new Error('Admin user nem található a komment seed futtatásához.');
  }

  const books = await prisma.book.findMany({
    select: { id: true, sequenceNumber: true },
  });

  const bookIdBySequence = new Map(books.map((book) => [book.sequenceNumber, book.id]));

  // Létező kommentek törlése
  await prisma.comment.deleteMany();

  // Új kommentek létrehozása
  for (const comment of comments) {
    const bookId = bookIdBySequence.get(comment.sequenceNumber);

    if (!bookId) {
      throw new Error(`Nem található játék a következő sequenceNumber értékkel: ${comment.sequenceNumber}`);
    }

    await prisma.comment.create({
      data: {
        userId: adminUser.id,
        bookId,
        content: comment.content,
        updatedAt: new Date(),
      },
    });
  }

  console.log('Komment adatok sikeresen feltöltve!');
}
