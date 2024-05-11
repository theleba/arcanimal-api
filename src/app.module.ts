import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaService } from 'prisma/prisma.service';
import { PetController } from './pet/pet.controller';
import { ShelterController } from './shelter/shelter.controller';
import { PetService } from './pet/pet.service';
import { ShelterService } from './shelter/shelter.service';

@Module({
  imports: [],
  controllers: [UserController, PetController, ShelterController],
  providers: [UserService, PetService, ShelterService, PrismaService] ,
})
export class AppModule {}
