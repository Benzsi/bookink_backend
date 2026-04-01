import { IsString, IsOptional, MinLength, IsEmail } from 'class-validator';
import { user_role } from '@prisma/client';
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
    enum: user_role,
    example: user_role.ADMIN
  })
  @IsOptional()
  role?: user_role;
}

