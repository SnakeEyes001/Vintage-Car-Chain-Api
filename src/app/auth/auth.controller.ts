import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signInDto';
import {
  ApiBody,
  ApiExcludeController,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
@ApiExcludeController()
@Controller('auth')
@ApiTags('Authentification')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('getTokenForUser')
  @ApiBody({ type: SignInDto })
  getTokenForUser(@Body() signInDto: SignInDto) {
    //return this.authService.signIn(signInDto);
  }
}
