import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')  
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Log in a user' }) 
  @ApiBody({ description: 'User Login', type: LoginDto })  
  @ApiResponse({ status: 200, description: 'Success', type: TokenDto })  
  @ApiResponse({ status: 401, description: 'Unauthorized' })  
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
