import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Frissített komment tartalom',
    example: 'Ahogy újra gondoltam, ez még jobb könyv, mint először gondoltam!',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  content?: string;
}