import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { recommendBooksWithAI } from '../aiService';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async searchBooks(query: string) {
    const books = await this.prisma.book.findMany({
      include: { ratings: true },
    });

    const booksWithRatings = books.map(book => {
      const ratings = book.ratings;
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;
      return {
        ...book,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings: ratings.length,
        ratings: undefined,
      };
    });

    try {
      const recommendedIds = await recommendBooksWithAI(query, booksWithRatings);
      return booksWithRatings.filter(b => recommendedIds.includes(b.id));
    } catch (error: any) {
      if (error?.__aiNoKey) {
        throw error;
      }
      console.warn('⚠️ AI nem elérhető, szöveges játék-keresés indul...');
      // Gyors szöveges keresés cím/fejlesztő alapján (AI nélkül is működik)
      const textResults = this.textFallbackSearch(query, booksWithRatings);
      if (textResults.length > 0) return textResults;
      // Ha szöveg alapján sem találtunk → AI szükséges
      throw { __aiUnavailable: true, message: error?.message };
    }
  }

  private textFallbackSearch(query: string, books: any[]): any[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return books.filter(b =>
      b.title?.toLowerCase().includes(q) ||
      b.author?.toLowerCase().includes(q) ||
      b.lyricNote?.toLowerCase().includes(q)
    );
  }
}
