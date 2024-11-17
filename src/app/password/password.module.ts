import { Global, Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
@Global()
@Module({
  controllers: [PasswordController],
  providers: [PasswordService]
})
export class PasswordModule {}
