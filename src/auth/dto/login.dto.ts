import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Felhasználónév',
    example: 'admin',
    minLength: 3,
    maxLength: 32
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(32)
  username!: string;

  @ApiProperty({
    description: 'Jelszó',
    example: 'admin123',
    minLength: 4,
    maxLength: 64
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(64)
  password!: string;
}
