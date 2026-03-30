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

  async getBookComments(bookId: number, viewerId?: number) {
    const comments = await this.prisma.comment.findMany({
      where: { bookId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        votes: viewerId ? {
          where: { userId: viewerId },
          select: { isLike: true }
        } : false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Map each comment to include a simple userVote field: 1 for like, -1 for dislike, 0 for none
    return comments.map(comment => {
      let userVote = 0;
      if (viewerId && (comment as any).votes && (comment as any).votes.length > 0) {
        userVote = (comment as any).votes[0].isLike ? 1 : -1;
      }
      
      const { votes, ...rest } = comment as any;
      return {
        ...rest,
        userVote
      };
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

  async voteComment(commentId: number, userId: number, isLike: boolean | null) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Komment nem található');
    }

    const existingVote = await this.prisma.commentVote.findUnique({
      where: { userId_commentId: { userId, commentId } }
    });

    // Ha isLike === null, VAGY ugyanazt küldi ami már el volt mentve, akkor töröljük a szavazatát
    if (isLike === null || (existingVote && existingVote.isLike === isLike)) {
      await this.prisma.commentVote.deleteMany({
        where: { commentId, userId },
      });
    } else {
      // Különben létrehozzuk vagy frissítjük a szavazatot
      await this.prisma.commentVote.upsert({
        where: { userId_commentId: { userId, commentId } },
        update: { isLike },
        create: { userId, commentId, isLike },
      });
    }

    const likes = await this.prisma.commentVote.count({
      where: { commentId, isLike: true },
    });
    const dislikes = await this.prisma.commentVote.count({
      where: { commentId, isLike: false },
    });

    const updatedComment = await this.prisma.comment.update({
      where: { id: commentId },
      data: { likes, dislikes },
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

    // Determine the current user's vote state
    const vote = await this.prisma.commentVote.findUnique({
      where: { userId_commentId: { userId, commentId } }
    });
    
    return {
      ...updatedComment,
      userVote: vote ? (vote.isLike ? 1 : -1) : 0
    };
  }
}