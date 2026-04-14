import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AiService } from './ai/ai.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly aiService: AiService,
  ) {}

  @Get()
  getHello() {
    return { message: 'indiebackseat API is running' };
  }

  // Régi endpoint kompatibilitás a frontendhez
  @Post('ai-filter')
  async aiFilter(@Body() body: { prompt?: string; query?: string }) {
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

