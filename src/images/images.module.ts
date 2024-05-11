import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [ImagesService, PrismaService]
})
export class ImagesModule {}
