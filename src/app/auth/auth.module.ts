import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/constant';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashService } from '../hash/hash.service';
import { PasswordModule } from '../password/password.module';
import { PasswordService } from '../password/password.service';

@Global()
@Module({
  imports: [
    UsersModule,
    PasswordModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60000s' },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService,HashService, UsersService,UserEntity, PasswordService],
  exports: [AuthService],
})
export class AuthModule {}
