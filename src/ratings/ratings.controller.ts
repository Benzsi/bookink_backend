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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('ratings')
@Controller('api/ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  // Értékelés hozzáadása/frissítése
  @Post()
  @ApiOperation({ summary: 'Értékelés hozzáadása vagy frissítése' })
  @ApiResponse({ status: 201, description: 'Értékelés sikeresen létrehozva/frissítve' })
  @ApiResponse({ status: 400, description: 'Hibás adatok' })
  @ApiResponse({ status: 404, description: 'Könyv nem található' })
  @ApiBody({ type: CreateRatingDto })
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
  @ApiOperation({ summary: 'Felhasználó összes értékelésének lekérése' })
  @ApiParam({ name: 'userId', description: 'Felhasználó azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'Értékelések sikeresen lekérve' })
  @ApiResponse({ status: 404, description: 'Felhasználó nem található' })
  async getUserRatings(@Param('userId', ParseIntPipe) userId: number) {
    return this.ratingsService.getUserRatings(userId);
  }

  // User adott könyvre vonatkozó értékelése
  @Get('user/:userId/book/:bookId')
  @ApiOperation({ summary: 'Felhasználó egy könyvre vonatkozó értékelésének lekérése' })
  @ApiParam({ name: 'userId', description: 'Felhasználó azonosítója', type: Number })
  @ApiParam({ name: 'bookId', description: 'Könyv azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'Értékelés sikeresen lekérve' })
  @ApiResponse({ status: 404, description: 'Értékelés nem található' })
  async getUserRating(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.ratingsService.getUserRating(userId, bookId);
  }

  // Könyv összes értékelése (átlag)
  @Get('book/:bookId')
  @ApiOperation({ summary: 'Könyv összes értékelésének és átlagának lekérése' })
  @ApiParam({ name: 'bookId', description: 'Könyv azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'Értékelések és átlag sikeresen lekérve' })
  @ApiResponse({ status: 404, description: 'Könyv nem található' })
  async getBookRatings(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.ratingsService.getBookRatings(bookId);
  }

  // Értékelés törlése
  @Delete('book/:bookId')
  @ApiOperation({ summary: 'Értékelés törlése' })
  @ApiParam({ name: 'bookId', description: 'Könyv azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'Értékelés sikeresen törölve' })
  @ApiResponse({ status: 404, description: 'Értékelés nem található' })
  async deleteRating(@Request() req, @Param('bookId', ParseIntPipe) bookId: number) {
    const userId = req.body.userId || 1; // Átmeneti megoldás
    return this.ratingsService.deleteRating(userId, bookId);
  }
}
