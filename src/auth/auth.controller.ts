import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ description: 'User Login', type: LoginDto })
  @ApiResponse({ status: 200, description: 'Success', type: TokenDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  async refresh(@Body() body: { refresh_token: string }) {
    const refreshToken = await this.authService.findRefreshToken(
      body.refresh_token,
    );
    if (!refreshToken) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.authService.findUserById(refreshToken.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = this.authService.generateAccessToken(user);

    const userResponse = { ...user };
    delete userResponse.password;

    return {
      access_token: accessToken,
      ...userResponse,
    };
  }
}
