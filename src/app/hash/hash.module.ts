import { Global, Module } from '@nestjs/common';
import { HashService } from './hash.service';
import { HashController } from './hash.controller';
import { UsersModule } from '../users/users.module';
@Global()
@Module({
  imports:[UsersModule],
  controllers: [HashController],
  providers: [HashService]
})
export class HashModule {}
