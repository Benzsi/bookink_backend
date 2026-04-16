import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ToggleSpecialListDto {
  @ApiProperty({
    description: 'A játék azonosítója',
    example: 1,
  })
  @IsInt()
  gameId: number;

  @ApiProperty({
    description: 'A speciális lista neve',
    example: 'Kedvencek',
  })
  @IsString()
  @IsNotEmpty()
  listName: string;
}