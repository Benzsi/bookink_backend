import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Összes felhasználó lekérése' })
  @ApiResponse({ status: 200, description: 'Felhasználók listája sikeresen lekérve' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Felhasználó lekérése ID alapján' })
  @ApiParam({ name: 'id', description: 'Felhasználó azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'Felhasználó sikeresen lekérve' })
  @ApiResponse({ status: 404, description: 'Felhasználó nem található' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Post()
  @ApiOperation({ summary: 'Új felhasználó létrehozása' })
  @ApiResponse({ status: 201, description: 'Felhasználó sikeresen létrehozva' })
  @ApiResponse({ status: 409, description: 'A felhasználónév vagy email már létezik' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() dto: CreateUserDto) {
    const existing = await this.usersService.findByUsername(dto.username);
    if (existing) {
      throw new ConflictException('Username already taken');
    }
    const existingEmail = await this.usersService.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('Email already taken');
    }
    return this.usersService.createUserWithPassword(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Felhasználó adatainak frissítése' })
  @ApiParam({ name: 'id', description: 'Felhasználó azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'Felhasználó sikeresen frissítve' })
  @ApiResponse({ status: 404, description: 'Felhasználó nem található' })
  @ApiResponse({ status: 409, description: 'A felhasználónév vagy email már létezik' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (dto.username) {
      const existing = await this.usersService.findByUsername(dto.username);
      if (existing && existing.id !== id) {
        throw new ConflictException('Username already taken');
      }
    }

    if (dto.email) {
      const existingEmail = await this.usersService.findByEmail(dto.email);
      if (existingEmail && existingEmail.id !== id) {
        throw new ConflictException('Email already taken');
      }
    }

    return this.usersService.updateUser(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Felhasználó törlése' })
  @ApiParam({ name: 'id', description: 'Felhasználó azonosítója', type: Number })
  @ApiResponse({ status: 200, description: 'Felhasználó sikeresen törölve' })
  @ApiResponse({ status: 404, description: 'Felhasználó nem található' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.usersService.deleteUser(id);
  }
}
