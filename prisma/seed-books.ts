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
  pageCount: number;
};

const books: BookData[] = [
  {
    sequenceNumber: 1,
    title: 'Hollow Knight',
    author: 'Team Cherry',
    coverUrl: 'http://localhost:3000/covers/game-01-hollow-knight.jpg',
    commentId: 1001,
    genre: Genre.ADVENTURE,
    literaryForm: LiteraryForm.SINGLE_PLAYER,
    lyricNote: 'Sötét katakombák mélyén egy apró lovag keresi az igazságot.',
    pageCount: 2017,
  },
  {
    sequenceNumber: 2,
    title: 'Stardew Valley',
    author: 'ConcernedApe',
    coverUrl: 'http://localhost:3000/covers/game-02-stardew-valley.jpg',
    commentId: 1002,
    genre: Genre.SANDBOX,
    literaryForm: LiteraryForm.CO_OP,
    lyricNote: 'Hagyd el a várost – a farm és a természet visszavár.',
    pageCount: 2016,
  },
  {
    sequenceNumber: 3,
    title: 'Celeste',
    author: 'Maddy Thorson & Noel Berry',
    coverUrl: 'http://localhost:3000/covers/game-03-celeste.jpg',
    commentId: 1003,
    genre: Genre.PLATFORMER,
    literaryForm: LiteraryForm.SINGLE_PLAYER,
    lyricNote: 'Egy hegy, ezer bukás – és a belső démonok legyőzése.',
    pageCount: 2018,
  },
  {
    sequenceNumber: 4,
    title: 'Among Us',
    author: 'InnerSloth',
    coverUrl: 'http://localhost:3000/covers/game-04-among-us.jpg',
    commentId: 1004,
    genre: Genre.PUZZLE,
    literaryForm: LiteraryForm.MULTIPLAYER,
    lyricNote: 'Az áruló közöttünk van – de ki az?',
    pageCount: 2018,
  },
  {
    sequenceNumber: 5,
    title: 'Hades',
    author: 'Supergiant Games',
    coverUrl: 'http://localhost:3000/covers/game-05-hades.jpg',
    commentId: 1005,
    genre: Genre.ACTION,
    literaryForm: LiteraryForm.SINGLE_PLAYER,
    lyricNote: 'Zagreus minden halállal közelebb kerül a napfényhez.',
    pageCount: 2020,
  },
  {
    sequenceNumber: 6,
    title: 'Undertale',
    author: 'Toby Fox',
    coverUrl: 'http://localhost:3000/covers/game-06-undertale.jpg',
    commentId: 1006,
    genre: Genre.RPG,
    literaryForm: LiteraryForm.SINGLE_PLAYER,
    lyricNote: 'Senkit sem kell megölnöd – ez a te döntésed.',
    pageCount: 2015,
  },
  {
    sequenceNumber: 7,
    title: 'Cuphead',
    author: 'Studio MDHR',
    coverUrl: 'http://localhost:3000/covers/game-07-cuphead.jpg',
    commentId: 1007,
    genre: Genre.ACTION,
    literaryForm: LiteraryForm.CO_OP,
    lyricNote: 'Az ördöggel kötött adósság – rajzfilmbe álmodva.',
    pageCount: 2017,
  },
  {
    sequenceNumber: 8,
    title: 'Limbo',
    author: 'Playdead',
    coverUrl: 'http://localhost:3000/covers/game-08-limbo.jpg',
    commentId: 1008,
    genre: Genre.HORROR,
    literaryForm: LiteraryForm.SINGLE_PLAYER,
    lyricNote: 'Szürke sötétség és csend – ahol a félelem lakik.',
    pageCount: 2010,
  },
  {
    sequenceNumber: 9,
    title: 'Ori and the Blind Forest',
    author: 'Moon Studios',
    coverUrl: 'http://localhost:3000/covers/game-09-ori-blind-forest.jpg',
    commentId: 1009,
    genre: Genre.ADVENTURE,
    literaryForm: LiteraryForm.SINGLE_PLAYER,
    lyricNote: 'Egy erdő lelke keres utat haza a fény felé.',
    pageCount: 2015,
  },
  {
    sequenceNumber: 10,
    title: 'Terraria',
    author: 'Re-Logic',
    coverUrl: 'http://localhost:3000/covers/game-10-terraria.jpg',
    commentId: 1010,
    genre: Genre.SANDBOX,
    literaryForm: LiteraryForm.MULTIPLAYER,
    lyricNote: 'Ásni, építeni, harcolni – végtelen világ vár.',
    pageCount: 2011,
  },
  {
    sequenceNumber: 11,
    title: 'Little Nightmares',
    author: 'Tarsier Studios',
    coverUrl: 'http://localhost:3000/covers/game-11-little-nightmares.jpg',
    commentId: 1011,
    genre: Genre.HORROR,
    literaryForm: LiteraryForm.SINGLE_PLAYER,
    lyricNote: 'Egy kis lány menekül egy világ elől, ahol minden torz.',
    pageCount: 2017,
  },
];

export async function seedBooks() {
  console.log('Játék adatok feltöltése megkezdődött...');

  for (const book of books) {
    await prisma.book.upsert({
      where: { sequenceNumber: book.sequenceNumber },
      update: book,
      create: book,
    });
  }

  console.log('Játék adatok sikeresen feltöltve!');
}

const isDirectExecution = (process.argv[1] || '').includes('seed-books.ts');

if (isDirectExecution) {
  void seedBooks()
    .catch((error) => {
      console.error('Hiba történt a játékok seedelése közben:', error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
