import { Injectable, NotFoundException, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListsService {
  private readonly logger = new Logger(ListsService.name);

  constructor(private prisma: PrismaService) {}

  // Felhasználó listáinak lekérése könyv adatokkal
  async getUserLists(userId: number) {
    this.logger.log(`Fetching lists for user with id: ${userId}`);
    const results = await this.prisma.booklist.findMany({
      where: { userId },
      include: {
        booklistitem: {
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
                lyricNote: true,
              },
            },
            booklistitemgallery: true,
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

    // Map keys to match what the frontend expects (items and gallery)
    return results.map(list => ({
      ...list,
      items: list.booklistitem.map(item => ({
        ...item,
        gallery: item.booklistitemgallery
      }))
    }));
  }

  // Új lista létrehozása
  async createList(userId: number, createListDto: CreateListDto) {
    this.logger.log(`Attempting to create a new list for user ${userId}...`);
    this.logger.log(`Received data: ${JSON.stringify(createListDto)}`);
    const { name } = createListDto;

    try {
      const newList = await this.prisma.booklist.create({
        data: {
          name,
          userId,
          updatedAt: new Date(),
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

    const list = await this.prisma.booklist.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException('Lista nem található');
    }

    return this.prisma.booklist.update({
      where: { id: listId },
      data: { 
        name,
        updatedAt: new Date(),
      },
    });
  }

  // Lista képének frissítése
  async updateListImagePath(listId: number, imagePath: string) {
    const list = await this.prisma.booklist.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException('Lista nem található');
    }

    return this.prisma.booklist.update({
      where: { id: listId },
      data: { 
        imagePath,
        updatedAt: new Date(),
      },
    });
  }

  async addGalleryItem(listId: number, bookId: number, filePath: string, fileType: string) {
    const item = await this.prisma.booklistitem.findUnique({
      where: {
        bookListId_bookId: {
          bookListId: listId,
          bookId: bookId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Játék nem található ebben a listában');
    }

    return this.prisma.booklistitemgallery.create({
      data: {
        bookListItemId: item.id,
        filePath: filePath,
        fileType: fileType,
      },
    });
  }

  // Könyv hozzáadása listához
  async addBookToList(listId: number, bookId: number) {
    // Ellenőrizzük, hogy létezik-e a lista
    const list = await this.prisma.booklist.findUnique({
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
    const existing = await this.prisma.booklistitem.findUnique({
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

    return this.prisma.booklistitem.create({
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
    const item = await this.prisma.booklistitem.findUnique({
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

    return this.prisma.booklistitem.delete({
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
    const list = await this.prisma.booklist.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException('Lista nem található');
    }

    return this.prisma.booklist.delete({
      where: { id: listId },
    });
  }

  async deleteGalleryItem(itemId: number) {
    const galleryItem = await this.prisma.booklistitemgallery.findUnique({
      where: { id: itemId },
    });

    if (!galleryItem) {
      throw new NotFoundException('Galéria elem nem található');
    }

    // Törlés az adatbázisból
    await this.prisma.booklistitemgallery.delete({
      where: { id: itemId },
    });

    // Törlés a fájlrendszerből
    const filePath = path.join(process.cwd(), 'public', 'uploads', galleryItem.filePath);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        this.logger.error(`Nem sikerült a fájl törlése: ${filePath}`, err);
      }
    }

    return { success: true };
  }
  async toggleSpecialList(userId: number, bookId: number, listName: string) {
    // 1. Find or create the list
    let list = await this.prisma.booklist.findFirst({
      where: { userId, name: listName },
    });

    if (!list) {
      list = await this.prisma.booklist.create({
        data: {
          name: listName,
          userId,
          updatedAt: new Date(),
        },
      });
    }

    // 2. Check if the book is already in the list
    const existing = await this.prisma.booklistitem.findUnique({
      where: {
        bookListId_bookId: {
          bookListId: list.id,
          bookId,
        },
      },
    });

    if (existing) {
      // Remove it
      await this.prisma.booklistitem.delete({
        where: { id: existing.id },
      });
      return { added: false, listId: list.id };
    } else {
      // Add it
      await this.prisma.booklistitem.create({
        data: {
          bookListId: list.id,
          bookId,
        },
      });
      return { added: true, listId: list.id };
    }
  }
}
