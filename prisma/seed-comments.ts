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
      content: 'Fantasztikus mű! Dante útirajza a pokol, purgatórium és paradicsom világán keresztül páratlan élmény. A középkori világkép és a keresztény teológia mesteriesen fonódik össze ebben a nagy eposzban.'
    },
    {
      userId: 1,
      bookId: 2,
      content: 'Homérosz klasszikus eposza ma is lenyűgöző. Odüsszeusz hazatérésének története nemcsak kalandregény, hanem az emberi kitartás és bölcsesség dicsőítése is.'
    },
    {
      userId: 1,
      bookId: 3,
      content: 'Mikszáth mesterműve a magyar irodalom egyik legszórakoztatóbb darabja. A magyar társadalom kritikája humor köntösében - zseniális!'
    },
    {
      userId: 1,
      bookId: 4,
      content: 'Szophóklész tragédiája időtlen remekművet. Oidipusz sorsa a végzet és az emberi akarat összeütközésének megrendítő példája.'
    },
    {
      userId: 1,
      bookId: 5,
      content: 'Molière vígjátéka szellemes és mély egyszerre. Tartuffe alakja a képmutatás örök szimbólumává vált - ma is aktuális.'
    },
    {
      userId: 1,
      bookId: 6,
      content: 'Vörösmarty eposzának nyelvi szépsége és hazaszeretete megható. Zalán futása a magyar nemzeti irodalom alapköve.'
    },
    {
      userId: 1,
      bookId: 7,
      content: 'Arany János balladái a magyar költészet csúcspontjai. A történelem és a népi hagyományok páratlan szintézise.'
    },
    {
      userId: 1,
      bookId: 8,
      content: 'Petőfi Sándor lírája örökké friss és őszinte. A természet és a szerelem költője - egyszerű, mégis zseniális.'
    },
    {
      userId: 1,
      bookId: 9,
      content: 'Ady Endre forradalmian új hangot hozott a magyar irodalomba. Versei mélyen személyesek, mégis uniwersálisak.'
    },
    {
      userId: 1,
      bookId: 10,
      content: 'József Attila költészete a modern kor szorongásait és reményeit fogalmazza meg páratlan erővel és szépséggel.'
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
