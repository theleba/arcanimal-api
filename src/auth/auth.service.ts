import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserValidationService } from '../validation/user-validation.service';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
	constructor(
		private userValidationService: UserValidationService, 
		private jwtService: JwtService,
		private prisma: PrismaService

	) {}

	public async findUserById(userId: number) {
        return this.userValidationService.findUserById(userId);
    }

	public generateAccessToken(user: any): string {
        const payload = { email: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }

	async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt();
		return bcrypt.hash(password, salt);
	}

  async comparePasswords(password: string, storedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, storedPassword);
  }

	async validateUser(email: string, password: string): Promise<any> {

    const user = await this.userValidationService.findUserByEmail(email);

    if (user && await this.comparePasswords(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

	async generateRefreshToken(userId: number) {
        const expiresIn = 60 * 60 * 24 * 7; 
        const refreshToken = this.jwtService.sign({ userId }, { expiresIn });
        
        await this.prisma.refreshToken.create({
            data: {
                userId,
                token: refreshToken,
                expiryDate: new Date(Date.now() + expiresIn * 1000)
            }
        });

        return refreshToken;
    }

	async findRefreshToken(token: string) {
        return await this.prisma.refreshToken.findUnique({
            where: { token }
        });
    }

	async login(user: any) {
		const userResponse = {...user}
		delete userResponse.password;
		const payload = { email: user.email, sub: user.id };
		return {
			access_token: this.jwtService.sign(payload),
			refresh_token: this.generateRefreshToken(user.id),
			...userResponse
		};
	}

}
