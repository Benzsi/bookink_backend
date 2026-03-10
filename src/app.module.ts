import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { RatingsModule } from './ratings/ratings.module';
import { CommentsModule } from './comments/comments.module';
import { AiModule } from './ai/ai.module';
import { AiService } from './ai/ai.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    BooksModule,
    RatingsModule,
    CommentsModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService, AiService, PrismaService],
})
export class AppModule {}
