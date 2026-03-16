import {
  Controller,
  Get,
  Post,
  Put,
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

  private extractUserId(req: any): number {
    const rawHeaderUserId = req?.headers?.['x-user-id'];
    const headerUserId = Array.isArray(rawHeaderUserId)
      ? rawHeaderUserId[0]
      : rawHeaderUserId;

    const candidateValues = [
      req?.user?.id,
      req?.body?.userId,
      req?.query?.userId,
      req?.params?.userId,
      headerUserId,
    ];

    for (const value of candidateValues) {
      const parsed = Number(value);
      if (Number.isInteger(parsed) && parsed > 0) {
        return parsed;
      }
    }

    // Temporary dev fallback until JWT auth is enabled across endpoints.
    return 1;
  }

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
    const userId = this.extractUserId(req);
    return this.ratingsService.createOrUpdateRating(userId, createRatingDto);
  }

  @Put('book/:bookId')
  @ApiOperation({ summary: 'Meglevo ertekeles atirasa (upsert logikaval)' })
  @ApiParam({ name: 'bookId', description: 'Konyv azonositoja', type: Number })
  @ApiResponse({ status: 200, description: 'Ertekeles sikeresen frissitve' })
  @ApiResponse({ status: 400, description: 'Hibas adatok' })
  async updateRating(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Request() req,
    @Body('rating', ParseIntPipe) rating: number,
  ) {
    const userId = this.extractUserId(req);
    return this.ratingsService.createOrUpdateRating(userId, { bookId, rating });
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
    const userId = this.extractUserId(req);
    return this.ratingsService.deleteRating(userId, bookId);
  }
}
