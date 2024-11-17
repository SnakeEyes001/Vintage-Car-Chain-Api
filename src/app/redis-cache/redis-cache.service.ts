import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name);

  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async setVariable(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
    this.logger.log(`Set key ${key} with value ${value}`);
  }

  async getVariable(key: string): Promise<string> {
    const value = await this.redis.get(key);
    this.logger.log(`Get key ${key} with value ${value}`);
    return value;
  }

  async getAllKeysAndValues(): Promise<Record<string, string>> {
    try {
      const keys = await this.redis.keys('*');
      this.logger.log(`Found keys: ${keys.join(', ')}`);
      
      if (keys.length === 0) {
        this.logger.log('No keys found');
        return {};
      }

      const values = await Promise.all(keys.map(key => this.redis.get(key)));
      this.logger.log(`Values: ${values.join(', ')}`);

      return keys.reduce((acc, key, index) => {
        acc[key] = values[index];
        return acc;
      }, {} as Record<string, string>);
    } catch (error) {
      this.logger.error('Error retrieving all keys and values', error);
      throw error;
    }
  }

  async deleteVariable(key: string): Promise<void> {
    await this.redis.del(key);
    this.logger.log(`Deleted key ${key}`);
  }
}
