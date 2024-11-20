import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signInDto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async verificationLogin(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (user?.email !== email || user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.email, id: user.password };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
