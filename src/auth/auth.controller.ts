import { Body, Controller, HttpCode, HttpStatus, Post, Get, Delete, UseGuards, Req, Res, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SteamAuthGuard } from './steam-auth.guard';

@ApiTags('auth')
@Controller(['api/auth', 'auth'])
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Új felhasználó regisztrálása' })
  @ApiResponse({ status: 201, description: 'Sikeres regisztráció' })
  @ApiResponse({ status: 400, description: 'Hibás adatok' })
  @ApiResponse({ status: 409, description: 'A felhasználónév vagy email már létezik' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return { message: 'Sikeres regisztráció', user: result.user, token: result.token };
  }


  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bejelentkezés' })
  @ApiResponse({ status: 200, description: 'Sikeres bejelentkezés' })
  @ApiResponse({ status: 401, description: 'Hibás felhasználónév vagy jelszó' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return { message: 'Sikeres bejelentkezés', user: result.user, token: result.token };
  }

  @Get('steam/check-key')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Ellenőrzi, hogy be van-e állítva a Steam API kulcs' })
  checkSteamKey() {
    if (!process.env.STEAM_API_KEY || process.env.STEAM_API_KEY === 'A_TE_STEAM_API_KULCSOD') {
      return { hasKey: false };
    }
    return { hasKey: true };
  }

  @Get('steam')
  @UseGuards(JwtAuthGuard, SteamAuthGuard)
  @ApiOperation({ summary: 'Steam fiók csatolása (átirányítás)' })
  steamAuth() {
    // Ebbe a metódusba már nem jutunk el, mert a SteamAuthGuard átirányít a Steamre
  }

  @Delete('steam')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Steam fiók leválasztása' })
  @ApiResponse({ status: 200, description: 'Sikeres leválasztás' })
  async unlinkSteam(@Req() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.authService.unlinkSteam(userId);
  }

  @Get('steam/return')
  @UseGuards(AuthGuard('steam'))
  @ApiOperation({ summary: 'Steam visszatérési URL' })
  steamAuthReturn(@Req() req: Request, @Res() res: Response) {
    // Sikeres csatolás
    res.redirect('http://localhost:5173/profile?steam_linked=success'); // Vite default port
  }

  @Get('steam/achievements/:appId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lekéri a Steam achievementeket a megadott játékhoz (on-demand), napi 1-szer max API hívással' })
  @ApiResponse({ status: 200, description: 'Sikeres lekérés (élő vagy gyorsítótárazott adat)' })
  @ApiResponse({ status: 401, description: 'Nincs Steam csatolva a fiókhoz, vagy jogosulatlan hívás' })
  async getGameAchievements(@Req() req: any, @Param('appId') appId: string) {
    // A JwtAuthGuard biztosítja a req.user létezését
    const userId = req.user.sub || req.user.id;
    return this.authService.getSteamAchievements(userId, appId);
  }

  @Get('steam/achievementsBygame/:gameId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lekéri a Steam achievementeket a megadott BELSŐ adatbázis játék ID-hez' })
  @ApiResponse({ status: 200, description: 'Sikeres lekérés' })
  async getGameAchievementsBygame(@Req() req: any, @Param('gameId', ParseIntPipe) gameId: number) {
    const userId = req.user.sub || req.user.id;
    return this.authService.getSteamAchievementsBygameId(userId, gameId);
  }
}

