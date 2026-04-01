import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DevlogsService {
  constructor(private readonly prisma: PrismaService) { }

  async createProject(userId: number, data: { name: string; genre: string; literaryForm: string; description: string; imagePath?: string }) {
    return this.prisma.devproject.create({
      data: {
        name: data.name,
        genre: data.genre as any,
        literaryForm: data.literaryForm as any,
        description: data.description,
        imagePath: data.imagePath,
        developerId: userId,
        updatedAt: new Date(),
      },
    });
  }

  async getProjects() {
    const projects = await this.prisma.devproject.findMany({
      include: {
        user: {
          select: { username: true },
        },
        _count: {
          select: { devlogentry: true, favorites: true, upvotes: true },
        },
      },
    });

    // Support both 'user' (Home.tsx) and 'developer' (DevLogs.tsx)
    return projects.map(p => ({
      ...p,
      developer: p.user
    }));
  }

  async getProjectById(id: number) {
    const project = await this.prisma.devproject.findUnique({
      where: { id },
      include: {
        user: {
          select: { username: true },
        },
        devlogentry: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) return null;

    return {
      ...project,
      developer: project.user
    };
  }

  async createEntry(projectId: number, data: { title: string; content: string; imagePath?: string }) {
    return this.prisma.devlogentry.create({
      data: {
        title: data.title,
        content: data.content,
        projectId: projectId,
        imagePath: data.imagePath,
        updatedAt: new Date(),
      },
    });
  }

  async updateEntryImagePath(entryId: number, imagePath: string) {
    return this.prisma.devlogentry.update({
      where: { id: entryId },
      data: { imagePath, updatedAt: new Date() },
    });
  }

  async updateProjectImagePath(projectId: number, imagePath: string) {
    return this.prisma.devproject.update({
      where: { id: projectId },
      data: { imagePath, updatedAt: new Date() },
    });
  }

  async deleteProject(id: number) {
    return this.prisma.devproject.delete({
      where: { id },
    });
  }

  async deleteEntry(id: number) {
    return this.prisma.devlogentry.delete({
      where: { id },
    });
  }

  async getEntryById(id: number) {
    return this.prisma.devlogentry.findUnique({
      where: { id },
      include: { devproject: true },
    });
  }

  async toggleFavorite(userId: number, projectId: number) {
    const favorite = await this.prisma.devprojectfavorite.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    if (favorite) {
      await this.prisma.devprojectfavorite.delete({
        where: { id: favorite.id },
      });
      return { favorited: false };
    } else {
      await this.prisma.devprojectfavorite.create({
        data: { userId, projectId },
      });
      return { favorited: true };
    }
  }

  async toggleUpvote(userId: number, projectId: number) {
    const upvote = await this.prisma.devprojectupvote.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    if (upvote) {
      await this.prisma.devprojectupvote.delete({
        where: { id: upvote.id },
      });
      return { upvoted: false };
    } else {
      await this.prisma.devprojectupvote.create({
        data: { userId, projectId },
      });
      return { upvoted: true };
    }
  }
}
