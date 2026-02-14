import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Book } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<any[]> {
    const books = await this.prisma.book.findMany({
      orderBy: { sequenceNumber: 'asc' },
      include: {
        ratings: true,
      },
    });

    // Számoljuk ki az átlag ratinget minden könyvhöz
    return books.map(book => {
      const ratings = book.ratings;
      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      return {
        ...book,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings: ratings.length,
        ratings: undefined, // Ne küldjük vissza az összes rating objektumot
      };
    });
  }

  async findById(id: number): Promise<any> {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        ratings: true,
      },
    });

    if (!book) return null;

    const ratings = book.ratings;
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    return {
      ...book,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length,
      ratings: undefined,
    };
  }

  async findBySequenceNumber(sequenceNumber: number): Promise<any> {
    const book = await this.prisma.book.findUnique({
      where: { sequenceNumber },
      include: {
        ratings: true,
      },
    });

    if (!book) return null;

    const ratings = book.ratings;
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    return {
      ...book,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length,
      ratings: undefined,
    };
  }
}
