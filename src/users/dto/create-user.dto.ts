import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { Role } from 'generated/prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  role?: Role;
}
