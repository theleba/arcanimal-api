import { Module } from '@nestjs/common';
import { ShelterController } from './shelter.controller';
import { ShelterService } from './shelter.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ShelterController],
  providers: [ShelterService, PrismaService]
})
export class ShelterModule {}
