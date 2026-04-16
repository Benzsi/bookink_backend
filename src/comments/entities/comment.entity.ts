import { ApiProperty } from '@nestjs/swagger';

export class Comment {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Nagyon erős atmoszféra és zene.' })
  content!: string;

  @ApiProperty({ example: 12 })
  userId!: number;

  @ApiProperty({ example: 4 })
  gameId!: number;

  @ApiProperty({ example: '2026-04-16T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-16T10:30:00.000Z' })
  updatedAt!: Date;

  constructor(partial?: Partial<Comment>) {
    Object.assign(this, partial);
  }
}

