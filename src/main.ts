import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import * as path from 'path';

async function bootstrap() {


  const app = await NestFactory.create(AppModule);
  app.use('/uploads', express.static('/usr/src/app/uploads'));
  
  app.use(bodyParser.json({ limit: '50mb' }));  
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

   app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true, 
    transform: true, 
    disableErrorMessages: false,
    validationError: { target: false }
  }));


  const config = new DocumentBuilder()
    .setTitle('Arcanimal API')
    .setDescription('API para a plataforma Arcanimal')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
  swaggerOptions: {
    authAction: {
      BearerAuth: {
        name: 'Bearer',
        schema: {
          type: 'http',
          in: 'header',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        value: 'Bearer <JWT>',
      },
    },
  },
});

  await app.listen(3000);
}

bootstrap();
