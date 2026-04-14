import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdateRating(userId: number, createRatingDto: CreateRatingDto) {
    const { gameId, rating } = createRatingDto;

    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Az értékelés 1 és 5 között kell legyen');
    }

    return this.prisma.$transaction(
      async (tx) => {
        let effectiveUserId = userId;

        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { id: true },
        });

        if (!user) {
          const adminUser = await tx.user.findUnique({
            where: { username: 'admin' },
            select: { id: true },
          });

          if (!adminUser) {
            throw new NotFoundException('Felhasználó nem található');
          }

          effectiveUserId = adminUser.id;
        }

        const game = await tx.game.findUnique({
          where: { id: gameId },
        });

        if (!game) {
          throw new NotFoundException('játék nem található');
        }

        const existingRating = await tx.rating.findUnique({
          where: {
            userId_gameId: {
              userId: effectiveUserId,
              gameId,
            },
          },
        });

        if (existingRating) {
          const updatedRating = await tx.rating.update({
            where: {
              userId_gameId: {
                userId: effectiveUserId,
                gameId,
              },
            },
            data: {
              rating,
              updatedAt: new Date(),
            },
            include: {
              game: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          });

          return {
            action: 'update' as const,
            rating: updatedRating,
          };
        }

        try {
          const createdRating = await tx.rating.create({
            data: {
              userId: effectiveUserId,
              gameId,
              rating,
              updatedAt: new Date(),
            },
            include: {
              game: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          });

          return {
            action: 'create' as const,
            rating: createdRating,
          };
        } catch (error) {
          // Race condition: párhuzamos create esetén unique violation után update-re váltunk.
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            const updatedRating = await tx.rating.update({
              where: {
                userId_gameId: {
                  userId: effectiveUserId,
                  gameId,
                },
              },
              data: {
                rating,
                updatedAt: new Date(),
              },
              include: {
                game: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            });

            return {
              action: 'update' as const,
              rating: updatedRating,
            };
          }

          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
            throw new BadRequestException('Érvénytelen felhasználó vagy játék azonosító');
          }

          throw error;
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  async getUserRating(userId: number, gameId: number) {
    return this.prisma.rating.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });
  }

  async getUserRatings(userId: number) {
    return this.prisma.rating.findMany({
      where: { userId },
      include: {
        game: {
          select: {
            id: true,
            title: true,
            author: true,
            coverUrl: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async getgameRatings(gameId: number) {
    const ratingSummary = await this.prisma.rating.aggregate({
      where: { gameId },
      _avg: {
        rating: true,
      },
      _count: {
        _all: true,
      },
    });

    const totalRatings = ratingSummary._count._all ?? 0;
    const averageRating = ratingSummary._avg.rating ?? 0;

    if (totalRatings === 0) {
      return {
        gameId,
        averageRating: 0,
        totalRatings: 0,
      };
    }

    return {
      gameId,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings,
    };
  }

  async deleteRating(userId: number, gameId: number) {
    try {
      return await this.prisma.rating.delete({
        where: {
          userId_gameId: {
            userId,
            gameId,
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Értékelés nem található');
    }
  }
}

