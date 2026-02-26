import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { parseFilterWithAI } from './aiService';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return { message: 'Bookink API is running' };
  }

  @Post('ai-filter')
  async aiFilter(@Body() body: { prompt: string }) {
    console.log('📝 AI filter kérés érkezett:', body.prompt);
    
    if (!body.prompt || body.prompt.trim() === '') {
      return { error: 'Üres keresési kérés' };
    }
    
    try {
      const filters = await parseFilterWithAI(body.prompt);
      console.log('✅ Szűrők visszaadva:', filters);
      return filters;
    } catch (error: any) {
      console.error('❌ AI feldolgozás hiba az app.controller-ben:', error?.message || error);
      return { 
        error: 'AI feldolgozási hiba', 
        details: error?.message || 'Ismeretlen hiba',
        hint: 'Ellenőrizd az API key-t az .env fájlban'
      };
    }
  }
}
