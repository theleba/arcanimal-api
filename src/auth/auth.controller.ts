
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
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
		const user = await this.authService.validateUser(loginDto.email, loginDto.password);
		if (!user) {
			throw new UnauthorizedException('Invalid email or password');
		}
		return this.authService.login(user);
	}

}
