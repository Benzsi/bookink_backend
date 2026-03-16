import { RatingsService } from './ratings.service';

type RatingRecord = {
  id: number;
  userId: number;
  bookId: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
};

describe('RatingsService', () => {
  let service: RatingsService;
  let ratingsStore: RatingRecord[];
  let prismaMock: any;

  const buildBookPayload = (bookId: number) => ({
    id: bookId,
    title: `Book ${bookId}`,
  });

  beforeEach(() => {
    ratingsStore = [];

    const tx = {
      book: {
        findUnique: jest.fn(async ({ where }: any) => {
          if (where.id === 9999) {
            return null;
          }

          return buildBookPayload(where.id);
        }),
      },
      rating: {
        findUnique: jest.fn(async ({ where }: any) => {
          const { userId, bookId } = where.userId_bookId;
          return ratingsStore.find((item) => item.userId === userId && item.bookId === bookId) ?? null;
        }),
        create: jest.fn(async ({ data, include }: any) => {
          const duplicate = ratingsStore.find(
            (item) => item.userId === data.userId && item.bookId === data.bookId,
          );

          if (duplicate) {
            const error = new Error('Unique constraint failed') as any;
            error.code = 'P2002';
            error.clientVersion = 'test';
            error.name = 'PrismaClientKnownRequestError';
            throw error;
          }

          const now = new Date();
          const created: RatingRecord = {
            id: ratingsStore.length + 1,
            userId: data.userId,
            bookId: data.bookId,
            rating: data.rating,
            createdAt: now,
            updatedAt: now,
          };

          ratingsStore.push(created);

          if (include?.book?.select) {
            return {
              ...created,
              book: buildBookPayload(data.bookId),
            };
          }

          return created;
        }),
        update: jest.fn(async ({ where, data, include }: any) => {
          const { userId, bookId } = where.userId_bookId;
          const idx = ratingsStore.findIndex((item) => item.userId === userId && item.bookId === bookId);

          if (idx < 0) {
            throw new Error('Rating not found');
          }

          ratingsStore[idx] = {
            ...ratingsStore[idx],
            rating: data.rating,
            updatedAt: new Date(),
          };

          if (include?.book?.select) {
            return {
              ...ratingsStore[idx],
              book: buildBookPayload(bookId),
            };
          }

          return ratingsStore[idx];
        }),
      },
    };

    prismaMock = {
      $transaction: jest.fn(async (callback: any) => callback(tx)),
      rating: {
        aggregate: jest.fn(async ({ where }: any) => {
          const filtered = ratingsStore.filter((item) => item.bookId === where.bookId);
          const total = filtered.length;
          const avg =
            total === 0 ? null : filtered.reduce((acc, item) => acc + item.rating, 0) / total;

          return {
            _avg: { rating: avg },
            _count: { _all: total },
          };
        }),
      },
    };

    service = new RatingsService(prismaMock);
  });

  it('new rating increments totalRatings', async () => {
    const result = await service.createOrUpdateRating(1, { bookId: 10, rating: 5 });

    expect(result.action).toBe('create');

    const summary = await service.getBookRatings(10);

    expect(summary).toEqual({
      bookId: 10,
      averageRating: 5,
      totalRatings: 1,
    });
  });

  it('rerating by same user does not increment totalRatings, only average can change', async () => {
    const first = await service.createOrUpdateRating(1, { bookId: 10, rating: 5 });
    const second = await service.createOrUpdateRating(1, { bookId: 10, rating: 3 });

    expect(first.action).toBe('create');
    expect(second.action).toBe('update');

    const summary = await service.getBookRatings(10);

    expect(summary).toEqual({
      bookId: 10,
      averageRating: 3,
      totalRatings: 1,
    });
  });

  it('multiple users return correct average and count', async () => {
    await service.createOrUpdateRating(1, { bookId: 10, rating: 5 });
    await service.createOrUpdateRating(2, { bookId: 10, rating: 2 });
    await service.createOrUpdateRating(3, { bookId: 10, rating: 4 });

    const summary = await service.getBookRatings(10);

    expect(summary).toEqual({
      bookId: 10,
      averageRating: 3.7,
      totalRatings: 3,
    });
  });
});
