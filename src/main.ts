import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ErrorMiddleware } from './common/middlewares/error.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new ErrorMiddleware());
  // app.use(
  //   session({
  //     secret: 'hieu',
  //     saveUninitialized: false,
  //     resave: false,
  //     cookie: {
  //       maxAge: 60000,
  //     },
  //   }),
  // );
  // app.use(passport.initialize());
  // app.use(passport.session());
  app.useWebSocketAdapter(new IoAdapter(app));
  // app.use('/auth/google', createProxyMiddleware({
  //   target: 'http://localhost:3500',
  //   changeOrigin: true,
  // }));
  const config = new DocumentBuilder()
    .setTitle('TravelVietNam')
    .setDescription('The TravelVietNam API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', 
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  await app.listen(3500);
}
bootstrap();
