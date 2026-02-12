import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';

type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private sanitizeUser(user: User): SafeUser {
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async register(dto: RegisterDto): Promise<{ user: SafeUser; token: string }> {
    const existingUser = await this.usersService.findByUsername(dto.username);
    if (existingUser) {
      throw new ConflictException('A felhasználónév már foglalt');
    }

    const existingEmail = await this.usersService.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('Ez az email már regisztrálva van');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.createUser({
      username: dto.username,
      email: dto.email,
      passwordHash,
    });

    const safeUser = this.sanitizeUser(user);
    const token = this.jwtService.sign({ sub: user.id, username: user.username });

    return { user: safeUser, token };
  }

  async login(dto: LoginDto): Promise<{ user: SafeUser; token: string }> {
    // Ellenőrizzük, hogy email cím-e a bemenet
    const isEmail = dto.username.includes('@');
    
    let user: User | null;
    if (isEmail) {
      user = await this.usersService.findByEmail(dto.username);
    } else {
      user = await this.usersService.findByUsername(dto.username);
    }

    if (!user) {
      throw new UnauthorizedException('Hibás felhasználónév/email vagy jelszó');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Hibás felhasználónév/email vagy jelszó');
    }

    const safeUser = this.sanitizeUser(user);
    const token = this.jwtService.sign({ sub: user.id, username: user.username });

    return { user: safeUser, token };
  }
}
