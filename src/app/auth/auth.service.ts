import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signInDto';
import {Request} from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async verificationLogin(email:string) {
    const user = await this.usersService.findOne(email);
    if (user?.email !== email) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.email, id:user.userId };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
