import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Patch, BadRequestException } from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/upload.config';
import { AddgameToListDto } from './dto/add-game.dto';
import { ToggleSpecialListDto } from './dto/toggle-special-list.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('lists')
@Controller('api/lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}


  @Get(':userId')
  @ApiOperation({ summary: 'Egy felhasználó összes játéklistájának lekérése' })
  @ApiParam({ name: 'userId', description: 'A felhasználó azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'A listák sikeresen lekérve' })
  getUserLists(@Param('userId', ParseIntPipe) userId: number) {
    return this.listsService.getUserLists(userId);
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Új játéklista létrehozása' })
  @ApiParam({ name: 'userId', description: 'A felhasználó azonosítója', type: Number })
  @ApiBody({ type: CreateListDto })
  @ApiResponse({ status: 201, description: 'A lista sikeresen létrejött' })
  createList(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createListDto: CreateListDto,
  ) {
    return this.listsService.createList(userId, createListDto);
  }

  @Patch(':listId')
  @ApiOperation({ summary: 'Meglévő lista frissítése' })
  @ApiParam({ name: 'listId', description: 'A lista azonosítója', type: Number })
  @ApiBody({ type: UpdateListDto })
  @ApiResponse({ status: 200, description: 'A lista sikeresen frissítve' })
  updateList(
    @Param('listId', ParseIntPipe) listId: number,
    @Body() updateListDto: UpdateListDto,
  ) {
    return this.listsService.updateList(listId, updateListDto);
  }

  @Post(':listId/games')
  @ApiOperation({ summary: 'Játék hozzáadása egy listához' })
  @ApiParam({ name: 'listId', description: 'A lista azonosítója', type: Number })
  @ApiBody({ type: AddgameToListDto })
  @ApiResponse({ status: 201, description: 'A játék sikeresen hozzáadva a listához' })
  addgameToList(
    @Param('listId', ParseIntPipe) listId: number,
    @Body('gameId', ParseIntPipe) gameId: number,
  ) {
    return this.listsService.addgameToList(listId, gameId);
  }

  @Delete(':listId/games/:gameId')
  @ApiOperation({ summary: 'Játék eltávolítása egy listából' })
  @ApiParam({ name: 'listId', description: 'A lista azonosítója', type: Number })
  @ApiParam({ name: 'gameId', description: 'A játék azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'A játék sikeresen eltávolítva a listából' })
  removegameFromList(
    @Param('listId', ParseIntPipe) listId: number,
    @Param('gameId', ParseIntPipe) gameId: number,
  ) {
    return this.listsService.removegameFromList(listId, gameId);
  }

  @Delete(':listId')
  @ApiOperation({ summary: 'Lista törlése' })
  @ApiParam({ name: 'listId', description: 'A lista azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'A lista sikeresen törölve' })
  deleteList(@Param('listId', ParseIntPipe) listId: number) {
    return this.listsService.deleteList(listId);
  }

  @Post(':listId/upload')
  @ApiOperation({ summary: 'Lista borítóképének feltöltése' })
  @ApiParam({ name: 'listId', description: 'A lista azonosítója', type: Number })
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
  @ApiResponse({ status: 201, description: 'A lista képe sikeresen feltöltve' })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadListImage(
    @Param('listId') listId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Fájl feltöltése kötelező');
    }
    return this.listsService.updateListImagePath(Number(listId), file.filename);
  }

  @Post(':listId/games/:gameId/gallery')
  @ApiOperation({ summary: 'Galériaelem feltöltése egy listában szereplő játékhoz' })
  @ApiParam({ name: 'listId', description: 'A lista azonosítója', type: Number })
  @ApiParam({ name: 'gameId', description: 'A játék azonosítója', type: Number })
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
  @ApiResponse({ status: 201, description: 'A galériaelem sikeresen feltöltve' })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadgameItemGallery(
    @Param('listId') listId: string,
    @Param('gameId') gameId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Fájl feltöltése kötelező');
    }
    const fileType = file.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE';
    return this.listsService.addGalleryItem(
      Number(listId),
      Number(gameId),
      file.filename,
      fileType,
    );
  }

  @Delete('gallery/:id')
  @ApiOperation({ summary: 'Galériaelem törlése' })
  @ApiParam({ name: 'id', description: 'A galériaelem azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'A galériaelem sikeresen törölve' })
  async deleteGalleryItem(@Param('id') id: string) {
    return this.listsService.deleteGalleryItem(Number(id));
  }

  @Post(':userId/toggle-special')
  @ApiOperation({ summary: 'Speciális lista elemének ki- és bekapcsolása' })
  @ApiParam({ name: 'userId', description: 'A felhasználó azonosítója', type: Number })
  @ApiBody({ type: ToggleSpecialListDto })
  @ApiResponse({ status: 201, description: 'A speciális lista állapota sikeresen frissítve' })
  async toggleSpecialList(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('gameId', ParseIntPipe) gameId: number,
    @Body('listName') listName: string,
  ) {
    return this.listsService.toggleSpecialList(userId, gameId, listName);
  }
}

