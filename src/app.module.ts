import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PetModule } from './pet/pet.module';
import { ShelterModule } from './shelter/shelter.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { EmailService } from './mail/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    AuthModule,
    UserModule,
    PetModule,
    ShelterModule,
    
  ],
  controllers: [],
  providers: [ PrismaService, JwtStrategy, LocalStrategy, EmailService] ,
})
export class AppModule {}
