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

  // Felhasználó listáinak lekérése játék adatokkal
  async getUserLists(userId: number) {
    this.logger.log(`Fetching lists for user with id: ${userId}`);
    const results = await this.prisma.gamelist.findMany({
      where: { userId },
      include: {
        gamelistitem: {
          include: {
            game: {
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
            gamelistitemgallery: true,
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
      items: list.gamelistitem.map(item => ({
        ...item,
        gallery: item.gamelistitemgallery
      }))
    }));
  }

  // Új lista létrehozása
  async createList(userId: number, createListDto: CreateListDto) {
    this.logger.log(`Attempting to create a new list for user ${userId}...`);
    this.logger.log(`Received data: ${JSON.stringify(createListDto)}`);
    const { name } = createListDto;

    try {
      const newList = await this.prisma.gamelist.create({
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

    const list = await this.prisma.gamelist.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException('Lista nem található');
    }

    return this.prisma.gamelist.update({
      where: { id: listId },
      data: { 
        name,
        updatedAt: new Date(),
      },
    });
  }

  // Lista képének frissítése
  async updateListImagePath(listId: number, imagePath: string) {
    const list = await this.prisma.gamelist.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException('Lista nem található');
    }

    return this.prisma.gamelist.update({
      where: { id: listId },
      data: { 
        imagePath,
        updatedAt: new Date(),
      },
    });
  }

  async addGalleryItem(listId: number, gameId: number, filePath: string, fileType: string) {
    const item = await this.prisma.gamelistitem.findUnique({
      where: {
        gameListId_gameId: {
          gameListId: listId,
          gameId: gameId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Játék nem található ebben a listában');
    }

    return this.prisma.gamelistitemgallery.create({
      data: {
        gameListItemId: item.id,
        filePath: filePath,
        fileType: fileType,
      },
    });
  }

  // játék hozzáadása listához
  async addgameToList(listId: number, gameId: number) {
    // Ellenőrizzük, hogy létezik-e a lista
    const list = await this.prisma.gamelist.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException('Lista nem található');
    }

    // Ellenőrizzük, hogy létezik-e a játék
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException('játék nem található');
    }

    // Ellenőrizzük, hogy már benne van-e
    const existing = await this.prisma.gamelistitem.findUnique({
      where: {
        gameListId_gameId: {
          gameListId: listId,
          gameId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Ez a játék már szerepel a listában');
    }

    return this.prisma.gamelistitem.create({
      data: {
        gameListId: listId,
        gameId,
      },
      include: {
        game: {
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

  // játék eltávolítása listáról
  async removegameFromList(listId: number, gameId: number) {
    const item = await this.prisma.gamelistitem.findUnique({
      where: {
        gameListId_gameId: {
          gameListId: listId,
          gameId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('A játék nem található a listában');
    }

    return this.prisma.gamelistitem.delete({
      where: {
        gameListId_gameId: {
          gameListId: listId,
          gameId,
        },
      },
    });
  }

  // Lista törlése
  async deleteList(listId: number) {
    const list = await this.prisma.gamelist.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException('Lista nem található');
    }

    return this.prisma.gamelist.delete({
      where: { id: listId },
    });
  }

  async deleteGalleryItem(itemId: number) {
    const galleryItem = await this.prisma.gamelistitemgallery.findUnique({
      where: { id: itemId },
    });

    if (!galleryItem) {
      throw new NotFoundException('Galéria elem nem található');
    }

    // Törlés az adatbázisból
    await this.prisma.gamelistitemgallery.delete({
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
  async toggleSpecialList(userId: number, gameId: number, listName: string) {
    // 1. Find or create the list
    let list = await this.prisma.gamelist.findFirst({
      where: { userId, name: listName },
    });

    if (!list) {
      list = await this.prisma.gamelist.create({
        data: {
          name: listName,
          userId,
          updatedAt: new Date(),
        },
      });
    }

    // 2. Check if the game is already in the list
    const existing = await this.prisma.gamelistitem.findUnique({
      where: {
        gameListId_gameId: {
          gameListId: list.id,
          gameId,
        },
      },
    });

    if (existing) {
      // Remove it
      await this.prisma.gamelistitem.delete({
        where: { id: existing.id },
      });
      return { added: false, listId: list.id };
    } else {
      // Add it
      await this.prisma.gamelistitem.create({
        data: {
          gameListId: list.id,
          gameId,
        },
      });
      return { added: true, listId: list.id };
    }
  }
}

