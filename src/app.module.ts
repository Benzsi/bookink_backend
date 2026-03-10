import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { existsSync } from 'fs';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { RatingsModule } from './ratings/ratings.module';
import { CommentsModule } from './comments/comments.module';
import { AiModule } from './ai/ai.module';
import { AiService } from './ai/ai.service';
import { PrismaService } from './prisma.service';

const publicPathCandidates = [
  join(__dirname, '..', 'public'),
  join(process.cwd(), 'public'),
  join(process.cwd(), 'bookink_backend', 'public'),
];
const publicPath =
  publicPathCandidates.find((candidate) => existsSync(candidate)) ||
  publicPathCandidates[0];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: publicPath,
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
