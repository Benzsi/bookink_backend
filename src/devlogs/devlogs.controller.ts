import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req, ParseIntPipe, UseInterceptors, UploadedFile, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DevlogsService } from './devlogs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { user_role as Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/upload.config';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateProjectDto, UpdateProgressDto } from './dto/create-project.dto';
import { CreateEntryDto } from './dto/create-entry.dto';

@ApiTags('devlogs')
@Controller(['api/devlogs', 'devlogs'])
export class DevlogsController {
  constructor(private readonly devlogsService: DevlogsService) { }

  @Get()
  @ApiOperation({ summary: 'Lekéri az összes devlog projektet' })
  @ApiResponse({ status: 200, description: 'Sikeres lekérés.' })
  async findAll() {
    return this.devlogsService.getProjects();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lekér egy adott devlog projektet ID alapján' })
  @ApiParam({ name: 'id', description: 'A projekt egyedi azonosítója' })
  @ApiResponse({ status: 200, description: 'Sikeres lekérés.' })
  @ApiResponse({ status: 404, description: 'A projekt nem található.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.devlogsService.getProjectById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DEVELOPER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Új devlog projekt létrehozása (csak Fejlesztőknek)' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ status: 201, description: 'Sikeresen létrehozva.' })
  async createProject(@Req() req: any, @Body() body: CreateProjectDto) {
    return this.devlogsService.createProject(req.user.sub, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Devlog projekt törlése (Adminoknak vagy a sajátját)' })
  @ApiParam({ name: 'id', description: 'A törlendő projekt azonosítója' })
  @ApiResponse({ status: 200, description: 'Sikeres törlés.' })
  @ApiResponse({ status: 403, description: 'Nincs jogosultságod.' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kép feltöltése a devlog projekthez' })
  @ApiParam({ name: 'id', description: 'A projekt azonosítója' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'A feltöltendő kép (PNG/JPG)' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Sikeres képfeltöltés.' })
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
  @ApiParam({ name: 'id', description: 'A projekt azonosítója' })
  @ApiBody({ type: UpdateProgressDto })
  @ApiResponse({ status: 200, description: 'Sikeres frissítés.' })
  @ApiResponse({ status: 403, description: 'Csak a saját projekted módosíthatod.' })
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
  @ApiOperation({ summary: 'Új bejegyzés hozzáadása egy devlog projekthez' })
  @ApiParam({ name: 'projectId', description: 'A projekt azonosítója' })
  @ApiBody({ type: CreateEntryDto })
  @ApiResponse({ status: 201, description: 'Bejegyzés sikeresen létrehozva.' })
  async createEntry(@Param('projectId', ParseIntPipe) projectId: number, @Body() body: CreateEntryDto) {
    return this.devlogsService.createEntry(projectId, body);
  }

  @Delete('entries/:entryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bejegyzés törlése egy devlog projektből' })
  @ApiParam({ name: 'entryId', description: 'A bejegyzés azonosítója' })
  @ApiResponse({ status: 200, description: 'Sikeres törlés.' })
  @ApiResponse({ status: 403, description: 'Nincs jogosultságod.' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kép feltöltése egy devlog bejegyzéshez' })
  @ApiParam({ name: 'entryId', description: 'A bejegyzés azonosítója' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'A feltöltendő kép (PNG/JPG)' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Sikeres képfeltöltés.' })
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
  @ApiOperation({ summary: 'Devlog kedvencekhez adása / eltávolítása (Like)' })
  @ApiParam({ name: 'id', description: 'A projekt azonosítója' })
  @ApiResponse({ status: 200, description: 'Sikeres művelet.' })
  async toggleFavorite(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.devlogsService.toggleFavorite(req.user.sub, id);
  }

  @Post(':id/wishlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Devlog kívánságlistához adása / eltávolítása (Upvote)' })
  @ApiParam({ name: 'id', description: 'A projekt azonosítója' })
  @ApiResponse({ status: 200, description: 'Sikeres művelet.' })
  async toggleWishlist(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.devlogsService.toggleWishlist(req.user.sub, id);
  }

  @Get('user/:userId/lists')
  @ApiOperation({ summary: 'Egy felhasználó kedvelt és felpontozott (wishlist) devlogjainak lekérése' })
  @ApiParam({ name: 'userId', description: 'A felhasználó azonosítója' })
  @ApiResponse({ status: 200, description: 'Sikeres lekérés.' })
  async getUserProjectLists(@Param('userId', ParseIntPipe) userId: number) {
    return this.devlogsService.getUserProjectLists(userId);
  }
}
