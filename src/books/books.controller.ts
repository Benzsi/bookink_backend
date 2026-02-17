import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BooksService } from './books.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('books')
@Controller(['api/books', 'books'])
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Összes könyv lekérése' })
  @ApiResponse({ status: 200, description: 'Könyvek listája sikeresen lekérve' })
  async findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Könyv lekérése ID alapján' })
  @ApiParam({ name: 'id', description: 'Könyv azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'Könyv sikeresen lekérve' })
  @ApiResponse({ status: 404, description: 'Könyv nem található' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findById(id);
  }

  @Get('sequence/:sequenceNumber')
  @ApiOperation({ summary: 'Könyv lekérése sorszám alapján' })
  @ApiParam({ name: 'sequenceNumber', description: 'Könyv sorszáma', type: Number })
  @ApiResponse({ status: 200, description: 'Könyv sikeresen lekérve' })
  @ApiResponse({ status: 404, description: 'Könyv nem található' })
  async findBySequenceNumber(
    @Param('sequenceNumber', ParseIntPipe) sequenceNumber: number,
  ) {
    return this.booksService.findBySequenceNumber(sequenceNumber);
  }
}
