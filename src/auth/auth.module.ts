import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserValidationService } from 'src/validation/user-validation.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: process.env.JWT_EXPIRE },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, UserValidationService, PrismaService, JwtStrategy],
	exports: [AuthService, UserValidationService, JwtModule]
})

export class AuthModule { }
