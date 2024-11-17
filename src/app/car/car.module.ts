import { Global, Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { InteractionModule } from '../interaction/interaction.module';
import { InteractionService } from '../interaction/interaction.service';
import { AdminOprService } from '../admin-opr/admin-opr.service';
import { AdminOprModule } from '../admin-opr/admin-opr.module';
import { HashModule } from '../hash/hash.module';
import { SendEmailModule } from '../send-email/send-email.module';
import { IpfsModule } from '../ipfs/ipfs.module';
import { IpfsService } from '../ipfs/ipfs.service';
import { SendEmailService } from '../send-email/send-email.service';
import { HashService } from '../hash/hash.service';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { PasswordModule } from '../password/password.module';
import { PasswordService } from '../password/password.service';
@Global()
@Module({
  imports: [
    InteractionModule,
    AdminOprModule,
    HashModule,
    SendEmailModule,
    IpfsModule,
    RedisCacheModule,
    UsersModule,
    PasswordModule
  ],
  controllers: [CarController],
  providers: [
    CarService,
    InteractionService,
    AdminOprService,
    HashService,
    SendEmailService,
    IpfsService,
    RedisCacheService,
    UsersService,
    PasswordService
  ],
})
export class CarModule {}
