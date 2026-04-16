import { RatingsService } from './ratings.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

type RatingRecord = {
  id: number;
  userId: number;
  gameId: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
};

describe('RatingsService', () => {
  let service: RatingsService;
  let ratingsStore: RatingRecord[];
  let prismaMock: any;

  const buildgamePayload = (gameId: number) => ({
    id: gameId,
    title: `game ${gameId}`,
  });

  beforeEach(() => {
    ratingsStore = [];

    const tx = {
      user: {
        findUnique: jest.fn(async ({ where }: any) => {
          if (where?.id) {
            return { id: where.id };
          }

          if (where?.username === 'admin') {
            return { id: 1 };
          }

          return null;
        }),
      },
      game: {
        findUnique: jest.fn(async ({ where }: any) => {
          if (where.id === 9999) {
            return null;
          }

          return buildgamePayload(where.id);
        }),
      },
      rating: {
        findUnique: jest.fn(async ({ where }: any) => {
          const { userId, gameId } = where.userId_gameId;
          return ratingsStore.find((item) => item.userId === userId && item.gameId === gameId) ?? null;
        }),
        create: jest.fn(async ({ data, include }: any) => {
          const duplicate = ratingsStore.find(
            (item) => item.userId === data.userId && item.gameId === data.gameId,
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
            gameId: data.gameId,
            rating: data.rating,
            createdAt: now,
            updatedAt: now,
          };

          ratingsStore.push(created);

          if (include?.game?.select) {
            return {
              ...created,
              game: buildgamePayload(data.gameId),
            };
          }

          return created;
        }),
        update: jest.fn(async ({ where, data, include }: any) => {
          const { userId, gameId } = where.userId_gameId;
          const idx = ratingsStore.findIndex((item) => item.userId === userId && item.gameId === gameId);

          if (idx < 0) {
            throw new Error('Rating not found');
          }

          ratingsStore[idx] = {
            ...ratingsStore[idx],
            rating: data.rating,
            updatedAt: new Date(),
          };

          if (include?.game?.select) {
            return {
              ...ratingsStore[idx],
              game: buildgamePayload(gameId),
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
          const filtered = ratingsStore.filter((item) => item.gameId === where.gameId);
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
    const result = await service.createOrUpdateRating(1, { gameId: 10, rating: 5 });

    expect(result.action).toBe('create');

    const summary = await service.getgameRatings(10);

    expect(summary).toEqual({
      gameId: 10,
      averageRating: 5,
      totalRatings: 1,
    });
  });

  it('rerating by same user does not increment totalRatings, only average can change', async () => {
    const first = await service.createOrUpdateRating(1, { gameId: 10, rating: 5 });
    const second = await service.createOrUpdateRating(1, { gameId: 10, rating: 3 });

    expect(first.action).toBe('create');
    expect(second.action).toBe('update');

    const summary = await service.getgameRatings(10);

    expect(summary).toEqual({
      gameId: 10,
      averageRating: 3,
      totalRatings: 1,
    });
  });

  it('multiple users return correct average and count', async () => {
    await service.createOrUpdateRating(1, { gameId: 10, rating: 5 });
    await service.createOrUpdateRating(2, { gameId: 10, rating: 2 });
    await service.createOrUpdateRating(3, { gameId: 10, rating: 4 });

    const summary = await service.getgameRatings(10);

    expect(summary).toEqual({
      gameId: 10,
      averageRating: 3.7,
      totalRatings: 3,
    });
  });
});

