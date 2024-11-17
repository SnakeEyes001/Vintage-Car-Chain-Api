import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { HashService } from '../hash/hash.service';
import { PasswordModule } from '../password/password.module';
import { PasswordService } from '../password/password.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), PasswordModule],
  controllers: [UsersController],
  providers: [UsersService, HashService, PasswordService],
  exports: [UsersService, TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule {}
