import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddBookToListDto {
  @ApiProperty({
    description: 'Könyv azonosítója',
    example: 1
  })
  @IsInt()
  bookId: number;
}
