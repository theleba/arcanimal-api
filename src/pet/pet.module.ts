import { Module } from '@nestjs/common';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';
import { PrismaService } from 'prisma/prisma.service';
import { ImagesService } from 'src/images/images.service';

@Module({
  controllers: [PetController],
  providers: [ImagesService, PetService, PrismaService]
})
export class PetModule {}
