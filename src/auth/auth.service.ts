import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcryptjs';

import { UserValidationService } from '../validation/user-validation.service';
import { PrismaService } from 'prisma/prisma.service';
import { LoginResponse } from './interface/login.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userValidationService: UserValidationService,
    private jwtService: JwtService,
    private prisma: PrismaService,
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

  async comparePasswords(
    password: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, storedPassword);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userValidationService.findUserByEmail(email);
    const validPassword = await this.comparePasswords(password, user.password);

    if (!user || !validPassword) return null;
    const { password: _, ...result } = user;
    return result;
  }

  async generateRefreshToken(userId: number) {
    const sevenDays = 60 * 60 * 24 * 7;
    const refreshToken = this.jwtService.sign(
      { userId },
      { expiresIn: sevenDays },
    );

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiryDate: new Date(Date.now() + sevenDays * 1000),
      },
    });

    return refreshToken;
  }

  async findRefreshToken(token: string) {
    return await this.prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async login({ email, password }: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const { password: _, ...userResponse } = user;

    const { id: sub } = user;
    const [token, refreshToken] = await Promise.all([
      this.createToken(email, sub),
      this.generateRefreshToken(sub),
    ]);

    return {
      access_token: token,
      refresh_token: refreshToken,
      ...userResponse,
    };
  }

  private async createToken(email: string, sub: number): Promise<string> {
    return this.jwtService.sign({ email, sub });
  }
}
