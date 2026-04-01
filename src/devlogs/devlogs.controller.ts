import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req, ParseIntPipe, UseInterceptors, UploadedFile, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DevlogsService } from './devlogs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { user_role as Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/upload.config';

@Controller(['api/devlogs', 'devlogs'])
export class DevlogsController {
  constructor(private readonly devlogsService: DevlogsService) { }

  @Get()
  async findAll() {
    return this.devlogsService.getProjects();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.devlogsService.getProjectById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DEVELOPER)
  async createProject(@Req() req: any, @Body() body: any) {
    return this.devlogsService.createProject(req.user.sub, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteProject(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const project = await this.devlogsService.getProjectById(id);
    if (!project) throw new NotFoundException('Projekt nem található');
    
    const isAdmin = req.user.role === Role.ADMIN;
    const isOwner = project.developerId === req.user.sub;
    
    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Nincs jogosultságod a projekt törléséhez');
    }
    
    return this.devlogsService.deleteProject(id);
  }

  @Post(':id/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DEVELOPER)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadProjectThumbnail(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new NotFoundException('Kép feltöltése sikertelen');
    return this.devlogsService.updateProjectImagePath(id, file.filename);
  }

  @Post(':projectId/entries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DEVELOPER)
  async createEntry(@Param('projectId', ParseIntPipe) projectId: number, @Body() body: any) {
    return this.devlogsService.createEntry(projectId, body);
  }

  @Delete('entries/:entryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteEntry(@Req() req: any, @Param('entryId', ParseIntPipe) entryId: number) {
    const entry = await this.devlogsService.getEntryById(entryId);
    
    if (!entry) throw new NotFoundException('Bejegyzés nem található');
    
    const isAdmin = req.user.role === Role.ADMIN;
    const isOwner = entry.devproject.developerId === req.user.sub;
    
    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Nincs jogosultságod a bejegyzés törléséhez');
    }
    
    return this.devlogsService.deleteEntry(entryId);
  }

  @Post('entries/:entryId/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DEVELOPER)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadEntryImage(
    @Param('entryId', ParseIntPipe) entryId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new NotFoundException('Kép feltöltése sikertelen');
    }
    return this.devlogsService.updateEntryImagePath(entryId, file.filename);
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  async toggleFavorite(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.devlogsService.toggleFavorite(req.user.sub, id);
  }

  @Post(':id/upvote')
  @UseGuards(JwtAuthGuard)
  async toggleUpvote(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.devlogsService.toggleUpvote(req.user.sub, id);
  }
}
