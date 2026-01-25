import { IsString, IsOptional, MinLength } from 'class-validator';
import { Role } from 'generated/prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @IsOptional()
  role?: Role;
}

