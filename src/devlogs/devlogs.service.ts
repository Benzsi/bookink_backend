import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DevlogsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(userId: number, data: { name: string; category: string; description: string; imageUrl?: string }) {
    return this.prisma.devProject.create({
      data: {
        name: data.name,
        category: data.category,
        description: data.description,
        imageUrl: data.imageUrl,
        developerId: userId,
      },
    });
  }

  async getProjects() {
    return this.prisma.devProject.findMany({
      include: {
        developer: {
          select: { username: true },
        },
        _count: {
          select: { entries: true },
        },
      },
    });
  }

  async getProjectById(id: number) {
    return this.prisma.devProject.findUnique({
      where: { id },
      include: {
        developer: {
          select: { username: true },
        },
        entries: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async createEntry(projectId: number, data: { title: string; content: string }) {
    return this.prisma.devLogEntry.create({
      data: {
        title: data.title,
        content: data.content,
        projectId: projectId,
      },
    });
  }
}
