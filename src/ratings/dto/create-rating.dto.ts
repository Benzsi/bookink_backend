import { IsInt, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  bookId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
