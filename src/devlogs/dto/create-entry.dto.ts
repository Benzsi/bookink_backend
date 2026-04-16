import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEntryDto {
  @ApiProperty({ description: 'A bejegyzés címe', example: 'Hatékonyság optimalizálása' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'A bejegyzés tartalma', example: 'A technikai csapat jelenleg a többszáz hajót számláló űrcsaták optimalizálásán fáradozik...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'A bejegyzéshez tartozó kép (opcionális)', example: 'http://localhost:3000/dev_covers/scifi_war_1.png' })
  @IsOptional()
  @IsString()
  imagePath?: string;
}
