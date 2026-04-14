import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { existsSync } from 'fs';
import { static as expressStatic } from 'express';
import session = require('express-session');
import passport = require('passport');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  const publicPathCandidates = [
    join(__dirname, '..', 'public'),
    join(process.cwd(), 'public'),
    join(process.cwd(), 'indiebackseat_backend', 'public'),
  ];
  const publicPath =
    publicPathCandidates.find((candidate) => existsSync(candidate)) ||
    publicPathCandidates[0];

  app.useStaticAssets(publicPath);
  app.use('/covers', expressStatic(join(publicPath, 'covers')));
  app.use('/dev_covers', expressStatic(join(publicPath, 'dev_covers')));
  app.use(expressStatic(publicPath));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.use(session({
    secret: process.env.SESSION_SECRET || 'titkos_session_kulcs',
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(new ValidationPipe());

  // Swagger konfigurálása
  const config = new DocumentBuilder()
    .setTitle('indiebackseat API')
    .setDescription('A indiebackseat játék- és értékeléskezelő alkalmazás API dokumentációja')
    .setVersion('1.0')
    .addTag('auth', 'Autentikációs végpontok')
    .addTag('users', 'Felhasználó kezelés')
    .addTag('games', 'játékek kezelése')
    .addTag('ratings', 'Értékelések kezelése')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

