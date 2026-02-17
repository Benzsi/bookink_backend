import { IsNotEmpty, IsString, MaxLength, MinLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Felhasználónév',
    example: 'johndoe',
    minLength: 3,
    maxLength: 32
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(32)
  username!: string;

  @ApiProperty({
    description: 'Email cím',
    example: 'johndoe@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'Jelszó',
    example: 'password123',
    minLength: 4,
    maxLength: 64
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(64)
  password!: string;
}
