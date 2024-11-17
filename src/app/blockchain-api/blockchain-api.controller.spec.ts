import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainApiController } from './blockchain-api.controller';
import { BlockchainApiService } from './blockchain-api.service';

describe('BlockchainApiController', () => {
  let controller: BlockchainApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockchainApiController],
      providers: [BlockchainApiService],
    }).compile();

    controller = module.get<BlockchainApiController>(BlockchainApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
