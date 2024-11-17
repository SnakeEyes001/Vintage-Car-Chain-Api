import { Global, Module } from '@nestjs/common';
import { BlockchainApiService } from './blockchain-api.service';
import { BlockchainApiController } from './blockchain-api.controller';
import { HashModule } from '../hash/hash.module';
import { HashService } from '../hash/hash.service';
import { CarModule } from '../car/car.module';
import { CarService } from '../car/car.service';
import { InteractionService } from '../interaction/interaction.service';
import { IpfsService } from '../ipfs/ipfs.service';
import { AdminOprService } from '../admin-opr/admin-opr.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { UserEntity } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from '../password/entities/password.entity';
import { PasswordModule } from '../password/password.module';
import { PasswordService } from '../password/password.service';
import { UserSessionModule } from '../user-session/user-session.module';
import { UserSessionService } from '../user-session/user-session.service';
import { SendEmailModule } from '../send-email/send-email.module';
import { SendEmailService } from '../send-email/send-email.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    HashModule,
    CarModule,
    UsersModule,
    PasswordModule,
    UserSessionModule,
    SendEmailModule,
    AuthModule,
    RedisCacheModule
  ],
  controllers: [BlockchainApiController],
  providers: [BlockchainApiService,CarService, PasswordService,
    HashService,InteractionService,IpfsService, AdminOprService, UsersService,UserSessionService,
    SendEmailService, AuthService, RedisCacheService]
})
export class BlockchainApiModule {}
