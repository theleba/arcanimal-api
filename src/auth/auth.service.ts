import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserValidationService } from '../validation/user-validation.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userValidationService: UserValidationService, 
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(password: string, storedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, storedPassword);
}


async validateUser(email: string, password: string): Promise<any> {
  console.log('JWT Secret from env:', process.env.JWT_SECRET);

  const user = await this.userValidationService.findUserByEmail(email);

  if (user && await this.comparePasswords(password, user.password)) {
    const { password, ...result } = user;  
    return result;
  }

  return null;
}

async login(user: any) {
  const payload = { email: user.email, sub: user.id };
  return {
    access_token: this.jwtService.sign(payload),
  };
}

}
