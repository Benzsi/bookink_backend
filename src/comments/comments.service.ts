import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(userId: number, createCommentDto: CreateCommentDto) {
    const { bookId, content } = createCommentDto;

    // Ellenőrizzük, hogy létezik-e a könyv
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Könyv nem található');
    }

    return this.prisma.comment.create({
      data: {
        userId,
        bookId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async updateComment(commentId: number, userId: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Komment nem található');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('Csak a saját kommentedet frissítheted');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: updateCommentDto,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Komment nem található');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('Csak a saját kommentedet törölheted');
    }

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }

  async getBookComments(bookId: number) {
    return this.prisma.comment.findMany({
      where: { bookId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUserComments(userId: number) {
    return this.prisma.comment.findMany({
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
        createdAt: 'desc',
      },
    });
  }

  async getComment(commentId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Komment nem található');
    }

    return comment;
  }
}