import { IsString, IsNotEmpty, MinLength, IsOptional, IsEmail } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Felhasználónév',
    example: 'newuser',
    minLength: 3
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'Email cím',
    example: 'newuser@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Jelszó',
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'Felhasználói szerepkör',
    enum: Role,
    example: Role.USER
  })
  @IsOptional()
  role?: Role;
}
