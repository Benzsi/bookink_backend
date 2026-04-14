export class Comment {
  id: number;
  content: string;
  userId: number;
  gameId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial?: Partial<Comment>) {
    Object.assign(this, partial);
  }
}

