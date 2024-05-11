import { Module } from '@nestjs/common';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';
import { PrismaService } from 'prisma/prisma.service';
import { FileService } from 'src/file/file.service';

@Module({
  controllers: [PetController],
  providers: [FileService, PetService, PrismaService]
})
export class PetModule {}
