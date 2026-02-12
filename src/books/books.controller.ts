import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller(['api/books', 'books'])
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findById(id);
  }

  @Get('sequence/:sequenceNumber')
  async findBySequenceNumber(
    @Param('sequenceNumber', ParseIntPipe) sequenceNumber: number,
  ) {
    return this.booksService.findBySequenceNumber(sequenceNumber);
  }
}
