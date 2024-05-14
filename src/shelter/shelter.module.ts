import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ShelterCsvParser } from './shelter-csv-parser';
import { ShelterController } from './shelter.controller';
import { ShelterService } from './shelter.service';

@Module({
  controllers: [ShelterController],
  providers: [ShelterService, PrismaService, ShelterCsvParser],
  exports: [ShelterService, ShelterCsvParser],
})
export class ShelterModule {}
