import { Test, TestingModule } from '@nestjs/testing';
import { RedisCacheController } from './redis-cache.controller';
import { RedisCacheService } from './redis-cache.service';

describe('RedisCacheController', () => {
  let controller: RedisCacheController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedisCacheController],
      providers: [RedisCacheService],
    }).compile();

    controller = module.get<RedisCacheController>(RedisCacheController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
