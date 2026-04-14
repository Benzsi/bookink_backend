import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Patch, UseGuards, Request, NotFoundException, BadRequestException } from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/upload.config';

@Controller('api/lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}


  @Get(':userId')
  getUserLists(@Param('userId', ParseIntPipe) userId: number) {
    return this.listsService.getUserLists(userId);
  }

  @Post(':userId')
  createList(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createListDto: CreateListDto,
  ) {
    return this.listsService.createList(userId, createListDto);
  }

  @Patch(':listId')
  updateList(
    @Param('listId', ParseIntPipe) listId: number,
    @Body() updateListDto: UpdateListDto,
  ) {
    return this.listsService.updateList(listId, updateListDto);
  }

  @Post(':listId/games')
  addgameToList(
    @Param('listId', ParseIntPipe) listId: number,
    @Body('gameId', ParseIntPipe) gameId: number,
  ) {
    return this.listsService.addgameToList(listId, gameId);
  }

  @Delete(':listId/games/:gameId')
  removegameFromList(
    @Param('listId', ParseIntPipe) listId: number,
    @Param('gameId', ParseIntPipe) gameId: number,
  ) {
    return this.listsService.removegameFromList(listId, gameId);
  }

  @Delete(':listId')
  deleteList(@Param('listId', ParseIntPipe) listId: number) {
    return this.listsService.deleteList(listId);
  }

  @Post(':listId/upload')
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
  async deleteGalleryItem(@Param('id') id: string) {
    return this.listsService.deleteGalleryItem(Number(id));
  }
  @Post(':userId/toggle-special')
  async toggleSpecialList(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('gameId', ParseIntPipe) gameId: number,
    @Body('listName') listName: string,
  ) {
    return this.listsService.toggleSpecialList(userId, gameId, listName);
  }
}

