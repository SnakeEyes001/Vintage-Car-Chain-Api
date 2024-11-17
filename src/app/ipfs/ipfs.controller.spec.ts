import { Test, TestingModule } from '@nestjs/testing';
import { IpfsController } from './ipfs.controller';
import { IpfsService } from './ipfs.service';

describe('IpfsController', () => {
  let controller: IpfsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IpfsController],
      providers: [IpfsService],
    }).compile();

    controller = module.get<IpfsController>(IpfsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
