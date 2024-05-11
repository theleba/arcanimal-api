import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserValidationService } from 'src/validation/user-validation.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' }
    }),
  ],
  providers: [AuthService, UserValidationService, PrismaService],
  exports: [AuthService, UserValidationService]
})
export class AuthModule {}
