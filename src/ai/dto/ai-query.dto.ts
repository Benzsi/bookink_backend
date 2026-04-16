import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AiQueryDto {
  @ApiPropertyOptional({
    description: 'Régi frontend kompatibilitási mező',
    example: 'metroidvania hangulatú indie játékok',
  })
  @IsOptional()
  @IsString()
  prompt?: string;

  @ApiPropertyOptional({
    description: 'Keresési lekérdezés',
    example: 'régi klasszikus indie játékok',
  })
  @IsOptional()
  @IsString()
  query?: string;
}