import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req, ParseIntPipe, UseInterceptors, UploadedFile, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DevlogsService } from './devlogs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { user_role as Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/upload.config';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto, UpdateProgressDto } from './dto/create-project.dto';
import { CreateEntryDto } from './dto/create-entry.dto';

@ApiTags('devlogs')
@Controller(['api/devlogs', 'devlogs'])
export class DevlogsController {
  constructor(private readonly devlogsService: DevlogsService) { }

  @Get()
  @ApiOperation({ summary: 'Összes fejlesztői projekt lekérése' })
  @ApiResponse({ status: 200, description: 'A projektek sikeresen lekérve' })
  async findAll() {
    return this.devlogsService.getProjects();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fejlesztői projekt lekérése azonosító alapján' })
  @ApiParam({ name: 'id', description: 'A projekt azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'A projekt sikeresen lekérve' })
  @ApiResponse({ status: 404, description: 'A projekt nem található' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.devlogsService.getProjectById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DEVELOPER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Új fejlesztői projekt létrehozása' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ status: 201, description: 'A projekt sikeresen létrejött' })
  async createProject(@Req() req: any, @Body() body: CreateProjectDto) {
    return this.devlogsService.createProject(req.user.sub, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fejlesztői projekt törlése' })
  @ApiParam({ name: 'id', description: 'A projekt azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'A projekt sikeresen törölve' })
  @ApiResponse({ status: 403, description: 'Nincs jogosultság a projekt törléséhez' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Projekt thumbnail feltöltése' })
  @ApiParam({ name: 'id', description: 'A projekt azonosítója', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'A projekt képe sikeresen feltöltve' })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadProjectThumbnail(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new NotFoundException('Kép feltöltése sikertelen');
    return this.devlogsService.updateProjectImagePath(id, file.filename);
  }

  @Post(':id/progress')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DEVELOPER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'A projekt készültségi fokának frissítése' })
  @ApiParam({ name: 'id', description: 'A projekt azonosítója', type: Number })
  @ApiBody({ type: UpdateProgressDto })
  @ApiResponse({ status: 200, description: 'A készültségi állapot sikeresen frissítve' })
  @ApiResponse({ status: 403, description: 'Csak a saját projekted módosíthatod' })
  async updateProgress(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() body: UpdateProgressDto) {
    const progress = body.progress;
    const project = await this.devlogsService.getProjectById(id);
    if (!project) throw new NotFoundException('Projekt nem található');
    if (project.developerId !== req.user.sub) {
      throw new ForbiddenException('Csak a saját projekted haladását módosíthatod');
    }
    return this.devlogsService.updateProjectProgress(id, progress);
  }

  @Post(':projectId/entries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DEVELOPER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Új devlog bejegyzés létrehozása' })
  @ApiParam({ name: 'projectId', description: 'A projekt azonosítója', type: Number })
  @ApiBody({ type: CreateEntryDto })
  @ApiResponse({ status: 201, description: 'A bejegyzés sikeresen létrejött' })
  async createEntry(@Param('projectId', ParseIntPipe) projectId: number, @Body() body: CreateEntryDto) {
    return this.devlogsService.createEntry(projectId, body);
  }

  @Delete('entries/:entryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Devlog bejegyzés törlése' })
  @ApiParam({ name: 'entryId', description: 'A bejegyzés azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'A bejegyzés sikeresen törölve' })
  @ApiResponse({ status: 403, description: 'Nincs jogosultság a bejegyzés törléséhez' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Devlog bejegyzés képének feltöltése' })
  @ApiParam({ name: 'entryId', description: 'A bejegyzés azonosítója', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'A bejegyzés képe sikeresen feltöltve' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Projekt kedvencek közé helyezése vagy eltávolítása' })
  @ApiParam({ name: 'id', description: 'A projekt azonosítója', type: Number })
  @ApiResponse({ status: 201, description: 'A kedvenc állapot sikeresen frissítve' })
  async toggleFavorite(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.devlogsService.toggleFavorite(req.user.sub, id);
  }

  @Post(':id/wishlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Projekt wishlist állapotának ki- vagy bekapcsolása' })
  @ApiParam({ name: 'id', description: 'A projekt azonosítója', type: Number })
  @ApiResponse({ status: 201, description: 'A wishlist állapot sikeresen frissítve' })
  async toggleWishlist(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.devlogsService.toggleWishlist(req.user.sub, id);
  }

  @Get('user/:userId/lists')
  @ApiOperation({ summary: 'Felhasználó virtuális devlog listáinak lekérése' })
  @ApiParam({ name: 'userId', description: 'A felhasználó azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'A virtuális listák sikeresen lekérve' })
  async getUserProjectLists(@Param('userId', ParseIntPipe) userId: number) {
    return this.devlogsService.getUserProjectLists(userId);
  }
}
