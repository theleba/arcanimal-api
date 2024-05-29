import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const logger: Logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);
  app.use('/uploads', express.static('/usr/src/app/uploads'));

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      validationError: { target: false },
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Arcanimal API')
    .setDescription('API para a plataforma Arcanimal')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'BearerAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const port: number = +process.env.PORT || 8000;

  await app.listen(port);
  logger.log(`Application is running on port: ${port}`);
}

bootstrap();
