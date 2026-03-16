import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';

@Controller('api/lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get('user/:userId')
  getUserLists(@Param('userId', ParseIntPipe) userId: number) {
    return this.listsService.getUserLists(userId);
  }

  @Post()
  createList(@Body() createListDto: CreateListDto) {
    return this.listsService.createList(createListDto);
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
