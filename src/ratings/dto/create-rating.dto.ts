import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({
    description: 'játék azonosítója',
    example: 1
  })
  @IsInt()
  gameId: number;

  @ApiProperty({
    description: 'Értékelés (1-5 skálán)',
    minimum: 1,
    maximum: 5,
    example: 4
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}

