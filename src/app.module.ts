import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { UserEntity } from './app/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashModule } from './app/hash/hash.module';
import { AdminOprModule } from './app/admin-opr/admin-opr.module';
import { SendEmailModule } from './app/send-email/send-email.module';
import { IpfsModule } from './app/ipfs/ipfs.module';
import * as dotenv from 'dotenv';
//import { SessionModule } from 'nestjs-session';
import { UserSessionModule } from './app/user-session/user-session.module';
import { PasswordModule } from './app/password/password.module';

import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
//import { UserModule } from './user/user.module';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
//import { RedisCache } from './app/redis-cache/entities/redis-cache.entity';
import { CreateRedisCacheDto } from './app/redis-cache/dto/create-redis-cache.dto';
import { RedisCacheModule } from './app/redis-cache/redis-cache.module';
import { BlockchainModule } from './app/blockchain/blockchain.module';
//import { RedisClient } from 'redis';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Rend les variables accessibles globalement
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, // Utilisation des variables d'environnement
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserEntity],
      synchronize: true,
    }),

    /* ConfigModule.forRoot(), // Assurez-vous que ConfigModule est correctement configuré
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        url: configService.get<string>('REDIS_URL'),
        password: configService.get<string>('REDIS_PASSWORD'),
      }),
      inject: [ConfigService],
    }), */

    AdminOprModule,
    AuthModule,
    UsersModule,
    HashModule,
    SendEmailModule,
    IpfsModule,
    UserSessionModule,
    PasswordModule,
    SendEmailModule,
    RedisCacheModule,
    BlockchainModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
