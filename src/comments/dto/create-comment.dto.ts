import { IsString, IsInt, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Komment tartalma',
    example: 'Ez egy fantasztikus könyv! Nagyon élveztem az olvasását.'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;

  @ApiProperty({
    description: 'Könyv azonosítója',
    example: 1
  })
  @IsInt()
  bookId: number;
}