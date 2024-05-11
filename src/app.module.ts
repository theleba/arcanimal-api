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
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UserModule } from './user/user.module';
import { PetModule } from './pet/pet.module';
import { ShelterModule } from './shelter/shelter.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { LocalStrategy } from './auth/strategies/local.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    AuthModule,
    UserModule,
    PetModule,
    ShelterModule
  ],
  controllers: [],
  providers: [ PrismaService, JwtStrategy, LocalStrategy] ,
})
export class AppModule {}
