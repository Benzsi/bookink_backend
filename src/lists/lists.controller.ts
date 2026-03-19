import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Patch, UseGuards, Request } from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

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

  @Post(':listId/books')
  addBookToList(
    @Param('listId', ParseIntPipe) listId: number,
    @Body('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.listsService.addBookToList(listId, bookId);
  }

  @Delete(':listId/books/:bookId')
  removeBookFromList(
    @Param('listId', ParseIntPipe) listId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.listsService.removeBookFromList(listId, bookId);
  }

  @Delete(':listId')
  deleteList(@Param('listId', ParseIntPipe) listId: number) {
    return this.listsService.deleteList(listId);
  }
}
