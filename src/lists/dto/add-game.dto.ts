import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddgameToListDto {
  @ApiProperty({
    description: 'játék azonosítója',
    example: 1
  })
  @IsInt()
  gameId: number;
}

