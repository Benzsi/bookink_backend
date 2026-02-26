export class Comment {
  id: number;
  content: string;
  userId: number;
  bookId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial?: Partial<Comment>) {
    Object.assign(this, partial);
  }
}
