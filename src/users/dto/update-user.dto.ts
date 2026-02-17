import { IsString, IsOptional, MinLength, IsEmail } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Felhasználónév',
    example: 'updateduser',
    minLength: 3
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @ApiPropertyOptional({
    description: 'Email cím',
    example: 'updated@example.com'
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Felhasználói szerepkör',
    enum: Role,
    example: Role.ADMIN
  })
  @IsOptional()
  role?: Role;
}

