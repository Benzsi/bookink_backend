import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('ai')
@Controller(['api/ai', 'ai'])
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('search')
  @ApiOperation({ summary: 'Természetes nyelvű könyvajánlás AI segítségével' })
  @ApiBody({ schema: { example: { query: 'régi klasszikus könyvek' } } })
  @ApiResponse({ status: 200, description: 'Ajánlott könyvek listája' })
  async searchBooks(@Body('query') query: string) {
    if (!query || !query.trim()) {
      throw new BadRequestException('A query mező kötelező');
    }
    try {
      return await this.aiService.searchBooks(query.trim());
    } catch (error: any) {
      if (error?.__aiUnavailable) {
        return { error: 'AI_UNAVAILABLE', message: 'Az AI keresés átmenetileg nem elérhető. Próbáld újra később.' };
      }
      return { error: 'AI feldolgozási hiba', details: error?.message };
    }
  }

  // Régi endpoint kompatibilitás (frontend /ai-filter + prompt paramétert használ)
  @Post('filter')
  async aiFilter(@Body() body: { prompt?: string; query?: string }) {
    const input = body.prompt || body.query;
    if (!input || !input.trim()) {
      throw new BadRequestException('Üres keresési kérés');
    }
    return this.aiService.searchBooks(input.trim());
  }
}
