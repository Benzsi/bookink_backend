import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListsService {
  private readonly logger = new Logger(ListsService.name);

  constructor(private prisma: PrismaService) {}

  // Felhasználó listáinak lekérése könyv adatokkal
  async getUserLists(userId: number) {
    this.logger.log(`Fetching lists for user with id: ${userId}`);
    return this.prisma.bookList.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                coverUrl: true,
                genre: true,
                literaryForm: true,
                sequenceNumber: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Új lista létrehozása
  async createList(userId: number, createListDto: CreateListDto) {
    this.logger.log(`Attempting to create a new list for user ${userId}...`);
    this.logger.log(`Received data: ${JSON.stringify(createListDto)}`);
    const { name } = createListDto;

    try {
      const newList = await this.prisma.bookList.create({
        data: {
          name,
          userId,
        },
      });
      this.logger.log(`Successfully created new list with id: ${newList.id}`);
      return newList;
    } catch (error) {
      this.logger.error('Failed to create new list', error.stack);
      throw error;
    }
  }

  // Lista nevének frissítése
  async updateList(listId: number, updateListDto: UpdateListDto) {
    const { name } = updateListDto;

    const list = await this.prisma.bookList.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException('Lista nem található');
    }

    return this.prisma.bookList.update({
      where: { id: listId },
      data: { name },
    });
  }

  // Könyv hozzáadása listához
  async addBookToList(listId: number, bookId: number) {
    // Ellenőrizzük, hogy létezik-e a lista
    const list = await this.prisma.bookList.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException('Lista nem található');
    }

    // Ellenőrizzük, hogy létezik-e a könyv
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Könyv nem található');
    }

    // Ellenőrizzük, hogy már benne van-e
    const existing = await this.prisma.bookListItem.findUnique({
      where: {
        bookListId_bookId: {
          bookListId: listId,
          bookId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Ez a könyv már szerepel a listában');
    }

    return this.prisma.bookListItem.create({
      data: {
        bookListId: listId,
        bookId,
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            coverUrl: true,
            genre: true,
            literaryForm: true,
          },
        },
      },
    });
  }

  // Könyv eltávolítása listáról
  async removeBookFromList(listId: number, bookId: number) {
    const item = await this.prisma.bookListItem.findUnique({
      where: {
        bookListId_bookId: {
          bookListId: listId,
          bookId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('A könyv nem található a listában');
    }

    return this.prisma.bookListItem.delete({
      where: {
        bookListId_bookId: {
          bookListId: listId,
          bookId,
        },
      },
    });
  }

  // Lista törlése
  async deleteList(listId: number) {
    const list = await this.prisma.bookList.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException('Lista nem található');
    }

    return this.prisma.bookList.delete({
      where: { id: listId },
    });
  }
}
