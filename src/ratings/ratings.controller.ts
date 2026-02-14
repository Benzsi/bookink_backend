import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('api/ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  // Értékelés hozzáadása/frissítése
  @Post()
  async createOrUpdateRating(
    @Request() req,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    // TODO: Add JWT Guard when ready
    // For now, use a mock userId or get from request
    const userId = req.body.userId || 1; // Átmeneti megoldás
    return this.ratingsService.createOrUpdateRating(userId, createRatingDto);
  }

  // User saját értékelései
  @Get('user/:userId')
  async getUserRatings(@Param('userId', ParseIntPipe) userId: number) {
    return this.ratingsService.getUserRatings(userId);
  }

  // User adott könyvre vonatkozó értékelése
  @Get('user/:userId/book/:bookId')
  async getUserRating(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.ratingsService.getUserRating(userId, bookId);
  }

  // Könyv összes értékelése (átlag)
  @Get('book/:bookId')
  async getBookRatings(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.ratingsService.getBookRatings(bookId);
  }

  // Értékelés törlése
  @Delete('book/:bookId')
  async deleteRating(@Request() req, @Param('bookId', ParseIntPipe) bookId: number) {
    const userId = req.body.userId || 1; // Átmeneti megoldás
    return this.ratingsService.deleteRating(userId, bookId);
  }
}
