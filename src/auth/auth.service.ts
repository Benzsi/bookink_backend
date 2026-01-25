import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { User } from 'generated/prisma/client';

type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  private sanitizeUser(user: User): SafeUser {
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async register(dto: RegisterDto): Promise<SafeUser> {
    const existing = await this.usersService.findByUsername(dto.username);
    if (existing) {
      throw new ConflictException('A felhasználónév már foglalt');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.createUser({
      username: dto.username,
      passwordHash,
    });

    return this.sanitizeUser(user);
  }

  async login(dto: LoginDto): Promise<SafeUser> {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedException('Hibás felhasználónév vagy jelszó');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Hibás felhasználónév vagy jelszó');
    }

    return this.sanitizeUser(user);
  }
}
