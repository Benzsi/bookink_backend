import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { game } from '@prisma/client';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<any[]> {
    const games = await this.prisma.game.findMany({
      orderBy: { sequenceNumber: 'asc' },
      include: {
        ratings: true,
      },
    });

    // Számoljuk ki az átlag ratinget minden játékhöz
    return games.map(game => {
      const ratings = game.ratings;
      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      return {
        ...game,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings: ratings.length,
        ratings: undefined, // Ne küldjük vissza az összes rating objektumot
      };
    });
  }

  async findById(id: number): Promise<any> {
    const game = await this.prisma.game.findUnique({
      where: { id },
      include: {
        ratings: true,
      },
    });

    if (!game) return null;

    const ratings = game.ratings;
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    return {
      ...game,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length,
      ratings: undefined,
    };
  }

  async findBySequenceNumber(sequenceNumber: number): Promise<any> {
    const game = await this.prisma.game.findUnique({
      where: { sequenceNumber },
      include: {
        ratings: true,
      },
    });

    if (!game) return null;

    const ratings = game.ratings;
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    return {
      ...game,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length,
      ratings: undefined,
    };
  }
}

