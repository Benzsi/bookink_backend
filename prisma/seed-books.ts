import { PrismaClient, Genre, LiteraryForm } from '@prisma/client';

const prisma = new PrismaClient();

type BookData = {
  sequenceNumber: number;
  title: string;
  author: string;
  coverUrl: string;
  commentId: number;
  genre: Genre;
  literaryForm: LiteraryForm;
  lyricNote: string;
};

const books: BookData[] = [
  {
    sequenceNumber: 1,
    title: 'Biblia',
    author: 'Ismeretlen',
    coverUrl: 'https://covers.openlibrary.org/b/olid/OL27448W-L.jpg',
    commentId: 1001,
    genre: Genre.VALLÁSI_IRAT,
    literaryForm: LiteraryForm.EPIKA,
    lyricNote: 'Ősi szavak, melyek csendben formálták az emberi lelket.',
  },
  {
    sequenceNumber: 2,
    title: 'Korán',
    author: 'Ismeretlen',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780199535958-L.jpg',
    commentId: 1002,
    genre: Genre.VALLÁSI_IRAT,
    literaryForm: LiteraryForm.EPIKA,
    lyricNote: 'A hit ritmusa, mely a sivatag csendjéből szól.',
  },
  {
    sequenceNumber: 3,
    title: 'Iliász',
    author: 'Homérosz',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/0140449191-L.jpg',
    commentId: 1003,
    genre: Genre.EPOSZ,
    literaryForm: LiteraryForm.EPIKA,
    lyricNote: 'Vér és dicsőség zeng a hősök árnyékában.',
  },
  {
    sequenceNumber: 4,
    title: 'Odüsszeia',
    author: 'Homérosz',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/0140268863-L.jpg',
    commentId: 1004,
    genre: Genre.EPOSZ,
    literaryForm: LiteraryForm.EPIKA,
    lyricNote: 'Egy hosszú út, ahol az otthon emléke világít.',
  },
  {
    sequenceNumber: 5,
    title: 'Isteni színjáték',
    author: 'Dante Alighieri',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/0142437220-L.jpg',
    commentId: 1005,
    genre: Genre.EPOSZ,
    literaryForm: LiteraryForm.EPIKA,
    lyricNote: 'Pokol, purgatórium, menny – és egy emberi lélek.',
  },
  {
    sequenceNumber: 6,
    title: 'Don Quijote',
    author: 'Miguel de Cervantes',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/0060934344-L.jpg',
    commentId: 1006,
    genre: Genre.REGÉNY,
    literaryForm: LiteraryForm.EPIKA,
    lyricNote: 'Egy álmodozó lovag harca a világ józanságával.',
  },
  {
    sequenceNumber: 7,
    title: 'Hamlet',
    author: 'William Shakespeare',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/0743477111-L.jpg',
    commentId: 1007,
    genre: Genre.TRAGÉDIA,
    literaryForm: LiteraryForm.DRÁMA,
    lyricNote: 'Gondolat és kétség között vergődő királyfi.',
  },
  {
    sequenceNumber: 8,
    title: 'Rómeó és Júlia',
    author: 'William Shakespeare',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/0743477111-L.jpg',
    commentId: 1008,
    genre: Genre.TRAGÉDIA,
    literaryForm: LiteraryForm.DRÁMA,
    lyricNote: 'Szerelem, mely gyorsabban él, mint ameddig tarthatna.',
  },
  {
    sequenceNumber: 9,
    title: 'Macbeth',
    author: 'William Shakespeare',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/0743477103-L.jpg',
    commentId: 1009,
    genre: Genre.TRAGÉDIA,
    literaryForm: LiteraryForm.DRÁMA,
    lyricNote: 'A hatalom suttogása vért hagy maga után.',
  },
  {
    sequenceNumber: 10,
    title: 'Szentivánéji álom',
    author: 'William Shakespeare',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/074347754X-L.jpg',
    commentId: 1010,
    genre: Genre.VÍGJÁTÉK,
    literaryForm: LiteraryForm.DRÁMA,
    lyricNote: 'Tündérek játéka, ahol az álmok összekeverednek.',
  },
  {
    sequenceNumber: 11,
    title: 'Büszkeség és balítélet',
    author: 'Jane Austen',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/0141439513-L.jpg',
    commentId: 1011,
    genre: Genre.REGÉNY,
    literaryForm: LiteraryForm.EPIKA,
    lyricNote: 'Szív és ész finom tánca egy csésze tea mellett.',
  },
];

async function main() {
  console.log('Könyv adatok feltöltése megkezdődött...');

  for (const book of books) {
    await prisma.book.upsert({
      where: { sequenceNumber: book.sequenceNumber },
      update: book,
      create: book,
    });
  }

  console.log('✓ Könyv adatok sikeresen feltöltve!');
  await prisma.$disconnect();
}

void main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
