import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GamesService } from './games.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('games')
@Controller(['api/games', 'games'])
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @ApiOperation({ summary: 'Összes játék lekérése' })
  @ApiResponse({ status: 200, description: 'játékok listája sikeresen lekérve' })
  async findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'játék lekérése ID alapján' })
  @ApiParam({ name: 'id', description: 'játék azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'játék sikeresen lekérve' })
  @ApiResponse({ status: 404, description: 'játék nem található' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.findById(id);
  }

  @Get('sequence/:sequenceNumber')
  @ApiOperation({ summary: 'játék lekérése sorszám alapján' })
  @ApiParam({ name: 'sequenceNumber', description: 'játék sorszáma', type: Number })
  @ApiResponse({ status: 200, description: 'játék sikeresen lekérve' })
  @ApiResponse({ status: 404, description: 'játék nem található' })
  async findBySequenceNumber(
    @Param('sequenceNumber', ParseIntPipe) sequenceNumber: number,
  ) {
    return this.gamesService.findBySequenceNumber(sequenceNumber);
  }
}
