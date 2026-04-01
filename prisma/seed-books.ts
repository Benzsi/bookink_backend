import { PrismaClient, book_genre, book_literaryForm } from '@prisma/client';

const prisma = new PrismaClient();

type BookData = {
  sequenceNumber: number;
  title: string;
  author: string;
  coverUrl: string;
  commentId: number;
  genre: book_genre;
  literaryForm: book_literaryForm;
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
    genre: book_genre.ADVENTURE,
    literaryForm: book_literaryForm.SINGLE_PLAYER,
    lyricNote: 'Sötét katakombák mélyén egy apró lovag keresi az igazságot.',
    pageCount: 2017,
  },
  {
    sequenceNumber: 2,
    title: 'Stardew Valley',
    author: 'ConcernedApe',
    coverUrl: 'http://localhost:3000/covers/game-02-stardew-valley.jpg',
    commentId: 1002,
    genre: book_genre.SANDBOX,
    literaryForm: book_literaryForm.CO_OP,
    lyricNote: 'Hagyd el a várost – a farm és a természet visszavár.',
    pageCount: 2016,
  },
  {
    sequenceNumber: 3,
    title: 'Celeste',
    author: 'Maddy Thorson & Noel Berry',
    coverUrl: 'http://localhost:3000/covers/game-03-celeste.jpg',
    commentId: 1003,
    genre: book_genre.PLATFORMER,
    literaryForm: book_literaryForm.SINGLE_PLAYER,
    lyricNote: 'Egy hegy, ezer bukás – és a belső démonok legyőzése.',
    pageCount: 2018,
  },
  {
    sequenceNumber: 4,
    title: 'Among Us',
    author: 'InnerSloth',
    coverUrl: 'http://localhost:3000/covers/game-04-among-us.jpg',
    commentId: 1004,
    genre: book_genre.PUZZLE,
    literaryForm: book_literaryForm.MULTIPLAYER,
    lyricNote: 'Az áruló közöttünk van – de ki az?',
    pageCount: 2018,
  },
  {
    sequenceNumber: 5,
    title: 'Hades',
    author: 'Supergiant Games',
    coverUrl: 'http://localhost:3000/covers/game-05-hades.jpg',
    commentId: 1005,
    genre: book_genre.ACTION,
    literaryForm: book_literaryForm.SINGLE_PLAYER,
    lyricNote: 'Zagreus minden halállal közelebb kerül a napfényhez.',
    pageCount: 2020,
  },
  {
    sequenceNumber: 6,
    title: 'Undertale',
    author: 'Toby Fox',
    coverUrl: 'http://localhost:3000/covers/game-06-undertale.jpg',
    commentId: 1006,
    genre: book_genre.RPG,
    literaryForm: book_literaryForm.SINGLE_PLAYER,
    lyricNote: 'Senkit sem kell megölnöd – ez a te döntésed.',
    pageCount: 2015,
  },
  {
    sequenceNumber: 7,
    title: 'Cuphead',
    author: 'Studio MDHR',
    coverUrl: 'http://localhost:3000/covers/game-07-cuphead.jpg',
    commentId: 1007,
    genre: book_genre.ACTION,
    literaryForm: book_literaryForm.CO_OP,
    lyricNote: 'Az ördöggel kötött adósság – rajzfilmbe álmodva.',
    pageCount: 2017,
  },
  {
    sequenceNumber: 8,
    title: 'Limbo',
    author: 'Playdead',
    coverUrl: 'http://localhost:3000/covers/game-08-limbo.jpg',
    commentId: 1008,
    genre: book_genre.HORROR,
    literaryForm: book_literaryForm.SINGLE_PLAYER,
    lyricNote: 'Szürke sötétség és csend – ahol a félelem lakik.',
    pageCount: 2010,
  },
  {
    sequenceNumber: 9,
    title: 'Ori and the Blind Forest',
    author: 'Moon Studios',
    coverUrl: 'http://localhost:3000/covers/game-09-ori-blind-forest.jpg',
    commentId: 1009,
    genre: book_genre.ADVENTURE,
    literaryForm: book_literaryForm.SINGLE_PLAYER,
    lyricNote: 'Egy erdő lelke keres utat haza a fény felé.',
    pageCount: 2015,
  },
  {
    sequenceNumber: 10,
    title: 'Terraria',
    author: 'Re-Logic',
    coverUrl: 'http://localhost:3000/covers/game-10-terraria.jpg',
    commentId: 1010,
    genre: book_genre.SANDBOX,
    literaryForm: book_literaryForm.MULTIPLAYER,
    lyricNote: 'Ásni, építeni, harcolni – végtelen világ vár.',
    pageCount: 2011,
  },
  {
    sequenceNumber: 11,
    title: 'Little Nightmares',
    author: 'Tarsier Studios',
    coverUrl: 'http://localhost:3000/covers/game-11-little-nightmares.jpg',
    commentId: 1011,
    genre: book_genre.HORROR,
    literaryForm: book_literaryForm.SINGLE_PLAYER,
    lyricNote: 'Egy kis lány menekül egy világ elől, ahol minden torz.',
    pageCount: 2017,
  },
  {
    sequenceNumber: 12,
    title: 'Dead Cells',
    author: 'Motion Twin',
    coverUrl: 'http://localhost:3000/covers/game-12-dead-cells.jpg',
    commentId: 1012,
    genre: book_genre.ACTION,
    literaryForm: book_literaryForm.SINGLE_PLAYER,
    lyricNote: 'Fegyverkezz fel, halj meg, tanulj belőle – és kezdd újra.',
    pageCount: 2018,
  },
  {
    sequenceNumber: 13,
    title: 'Slay the Spire',
    author: 'Mega Crit',
    coverUrl: 'http://localhost:3000/covers/game-13-slay-the-spire.jpg',
    commentId: 1013,
    genre: book_genre.RPG,
    literaryForm: book_literaryForm.SINGLE_PLAYER,
    lyricNote: 'Építs paklit, mássz meg a tornyot, és küzdj meg a szívvel.',
    pageCount: 2017,
  },
  {
    sequenceNumber: 14,
    title: 'Outer Wilds',
    author: 'Mobius Digital',
    coverUrl: 'http://localhost:3000/covers/game-14-outer-wilds.jpg',
    commentId: 1014,
    genre: book_genre.ADVENTURE,
    literaryForm: book_literaryForm.SINGLE_PLAYER,
    lyricNote: 'A nap hamarosan felrobban – fejtsd meg a rejtélyt az időhurokban.',
    pageCount: 2019,
  },
  {
    sequenceNumber: 15,
    title: 'Into the Breach',
    author: 'Subset Games',
    coverUrl: 'http://localhost:3000/covers/game-15-into-the-breach.jpg',
    commentId: 1015,
    genre: book_genre.PUZZLE,
    literaryForm: book_literaryForm.SINGLE_PLAYER,
    lyricNote: 'Óriás robotok az időutazók kezében – védd meg a megmaradt jövőt.',
    pageCount: 2018,
  },
  {
    sequenceNumber: 16,
    title: 'Disco Elysium',
    author: 'ZA/UM',
    coverUrl: 'http://localhost:3000/covers/game-16-disco-elysium.jpg',
    commentId: 1016,
    genre: book_genre.RPG,
    literaryForm: book_literaryForm.SINGLE_PLAYER,
    lyricNote: 'Egy amnéziás nyomozó elmélkedik Revachol mocskos utcáin.',
    pageCount: 2019,
  },
  {
    sequenceNumber: 17,
    title: 'The Binding of Isaac',
    author: 'Edmund McMillen',
    coverUrl: 'http://localhost:3000/covers/game-17-binding-of-isaac.jpg',
    commentId: 1017,
    genre: book_genre.ACTION,
    literaryForm: book_literaryForm.SINGLE_PLAYER,
    lyricNote: 'Anya hangokat hall, Isaac pedig a pincébe menekül a könnyek között.',
    pageCount: 2011,
  },
  {
    sequenceNumber: 18,
    title: 'Vampire Survivors',
    author: 'poncle',
    coverUrl: 'http://localhost:3000/covers/game-18-vampire-survivors.jpg',
    commentId: 1018,
    genre: book_genre.ACTION,
    literaryForm: book_literaryForm.SINGLE_PLAYER,
    lyricNote: 'Légy a golyózápor puszta jelenléteddel – amíg az Éjszaka engedi.',
    pageCount: 2022,
  },
  {
    sequenceNumber: 19,
    title: 'Cult of the Lamb',
    author: 'Massive Monster',
    coverUrl: 'http://localhost:3000/covers/game-19-cult-of-the-lamb.jpg',
    commentId: 1019,
    genre: book_genre.ACTION,
    literaryForm: book_literaryForm.SINGLE_PLAYER,
    lyricNote: 'Alapíts szektát egy ősi isten nevében – áldozd fel a hitetleneket.',
    pageCount: 2022,
  },
  {
    sequenceNumber: 20,
    title: 'Hotline Miami',
    author: 'Dennaton Games',
    coverUrl: 'http://localhost:3000/covers/game-20-hotline-miami.jpg',
    commentId: 1020,
    genre: book_genre.ACTION,
    literaryForm: book_literaryForm.SINGLE_PLAYER,
    lyricNote: 'Szereted bántani az embereket? Lépj be a neonfényes vérengzésbe.',
    pageCount: 2012,
  },
];

export async function seedBooks() {
  console.log('Játék adatok feltöltése megkezdődött...');

  for (const book of books) {
    await prisma.book.upsert({
      where: { sequenceNumber: book.sequenceNumber },
      update: { ...book, updatedAt: new Date() },
      create: { ...book, updatedAt: new Date() },
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
