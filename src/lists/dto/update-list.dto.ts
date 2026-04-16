import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateListDto {
  @ApiProperty({
    description: 'A frissített lista neve',
    example: 'Jelenlegi kedvenceim',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
