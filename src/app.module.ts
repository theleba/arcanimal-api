import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaService } from 'prisma/prisma.service';
import { PetController } from './pet/pet.controller';
import { ShelterController } from './shelter/shelter.controller';
import { PetService } from './pet/pet.service';
import { ShelterService } from './shelter/shelter.service';
import { ImagesService } from './images/images.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
  ],
  controllers: [UserController, PetController, ShelterController],
  providers: [UserService, PetService, ShelterService, PrismaService, ImagesService] ,
})
export class AppModule {}
