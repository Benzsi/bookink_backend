import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller(['api/auth', 'auth'])
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
