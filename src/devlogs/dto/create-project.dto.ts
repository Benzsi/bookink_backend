import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';
import { devproject_genre, devproject_literaryForm } from '@prisma/client';

export class CreateProjectDto {
  @ApiProperty({ description: 'A projekt neve', example: 'Odyssey 2142: Nova Strike' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'A projekt leírása', example: 'Egy hibrid sci-fi játék, amely keveri a nagyszabású űrstratégiát a belső nézetű (FPS) felfedezéssel és taktikával.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: devproject_genre, description: 'A játék műfaja', example: devproject_genre.ACTION })
  @IsEnum(devproject_genre)
  genre: devproject_genre;

  @ApiProperty({ enum: devproject_literaryForm, description: 'A játék formátuma', example: devproject_literaryForm.MULTIPLAYER })
  @IsEnum(devproject_literaryForm)
  literaryForm: devproject_literaryForm;

  @ApiPropertyOptional({ description: 'Kép URL-je (opcionális)', example: 'http://localhost:3000/dev_covers/scifi_war_logo.png' })
  @IsOptional()
  @IsString()
  imagePath?: string;
}

export class UpdateProgressDto {
  @ApiProperty({ description: 'A projekt készültségi foka (0-100)', example: 35, minimum: 0, maximum: 100 })
  @IsInt()
  @Min(0)
  @Max(100)
  progress: number;
}
