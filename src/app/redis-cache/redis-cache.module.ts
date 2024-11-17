import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisCacheService } from './redis-cache.service';
import { RedisCacheController } from './redis-cache.controller';

@Module({
  imports :[
    RedisModule.forRoot({
      config: {
        host: 'localhost', // Adresse de votre serveur Redis
        port: 6379,        // Port de votre serveur Redis
      },
    }),
  ],
  controllers: [RedisCacheController],
  providers: [RedisCacheService]
})
export class RedisCacheModule {}
