import { Controller, Get } from '@nestjs/common';
import { PasswordService } from './password.service';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
@ApiExcludeController()
@ApiTags('User Session')
@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Get('generate')
  generatePassword(): string {
    return this.passwordService.generatePassword();
  }
}
