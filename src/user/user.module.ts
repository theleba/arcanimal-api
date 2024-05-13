import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';  
import { EmailModule } from '../mail/mail.module';  

@Module({
	imports: [AuthModule, EmailModule],  
	controllers: [UserController],
	providers: [UserService, PrismaService],
	exports: [UserService]
})

export class UserModule {}
