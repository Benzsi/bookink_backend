import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';

type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  private sanitizeUser(user: User): SafeUser {
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async register(dto: RegisterDto): Promise<SafeUser> {
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

    return this.sanitizeUser(user);
  }

  async login(dto: LoginDto): Promise<SafeUser> {
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

    return this.sanitizeUser(user);
  }
}