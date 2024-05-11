import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {

    const server = express(); 
  server.use('/uploads', express.static(join(__dirname, '..', 'uploads'))); 

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server)); 

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
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
