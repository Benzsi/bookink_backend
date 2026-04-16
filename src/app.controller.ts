import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AiService } from './ai/ai.service';
import { AiQueryDto } from './ai/dto/ai-query.dto';

@ApiTags('system')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly aiService: AiService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'API állapotának ellenőrzése' })
  @ApiResponse({ status: 200, description: 'Az API fut és elérhető' })
  getHello() {
    return { message: 'indiebackseat API is running' };
  }

  // Régi endpoint kompatibilitás a frontendhez
  @Post('ai-filter')
  @ApiOperation({ summary: 'Legacy AI keresési endpoint prompt vagy query mezővel' })
  @ApiBody({ type: AiQueryDto })
  @ApiResponse({ status: 200, description: 'AI keresési eredmény vagy hibaobjektum' })
  async aiFilter(@Body() body: AiQueryDto) {
    const input = body.prompt || body.query;
    if (!input || !input.trim()) {
      return { error: 'Üres keresési kérés' };
    }
    try {
      return await this.aiService.searchgames(input.trim());
    } catch (error: any) {
      if (error?.__aiNoKey) {
        return { error: 'AI_NO_KEY', message: 'Nincs megadva Gemini API kulcs!' };
      }
      if (error?.__aiUnavailable) {
        return { error: 'AI_UNAVAILABLE', message: 'Az AI keresés átmenetileg nem elérhető. Próbáld újra később.' };
      }
      return { error: 'AI feldolgozási hiba', details: error?.message };
    }
  }
}

