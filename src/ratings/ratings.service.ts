import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdateRating(userId: number, createRatingDto: CreateRatingDto) {
    const { bookId, rating } = createRatingDto;

    // Ellenőrizzük, hogy létezik-e a könyv
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Könyv nem található');
    }

    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Az értékelés 1 és 5 között kell legyen');
    }

    // Upsert - létrehoz vagy frissít
    return this.prisma.rating.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      update: {
        rating,
      },
      create: {
        userId,
        bookId,
        rating,
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async getUserRating(userId: number, bookId: number) {
    return this.prisma.rating.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });
  }

  async getUserRatings(userId: number) {
    return this.prisma.rating.findMany({
      where: { userId },
      include: {
        book: {
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

  async getBookRatings(bookId: number) {
    const ratings = await this.prisma.rating.findMany({
      where: { bookId },
    });

    if (ratings.length === 0) {
      return {
        bookId,
        averageRating: 0,
        totalRatings: 0,
      };
    }

    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / ratings.length;

    return {
      bookId,
      averageRating: Math.round(average * 10) / 10, // 1 tizedesjegy
      totalRatings: ratings.length,
    };
  }

  async deleteRating(userId: number, bookId: number) {
    try {
      return await this.prisma.rating.delete({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Értékelés nem található');
    }
  }
}
