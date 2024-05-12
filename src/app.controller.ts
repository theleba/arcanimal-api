import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('protected')
export class AppController {
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProtectedResource() {
    return { message: "You have access to the protected resource" };
  }
}
