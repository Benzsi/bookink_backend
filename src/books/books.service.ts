import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Book } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Book[]> {
    return this.prisma.book.findMany({
      orderBy: { sequenceNumber: 'asc' },
    });
  }

  async findById(id: number): Promise<Book | null> {
    return this.prisma.book.findUnique({
      where: { id },
    });
  }

  async findBySequenceNumber(sequenceNumber: number): Promise<Book | null> {
    return this.prisma.book.findUnique({
      where: { sequenceNumber },
    });
  }
}
