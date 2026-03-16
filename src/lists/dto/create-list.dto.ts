import { IsString, IsInt, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateListDto {
  @ApiProperty({
    description: 'Lista neve',
    example: 'Kedvenc játékaim'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Felhasználó azonosítója',
    example: 1
  })
  @IsInt()
  userId: number;
}
