import { Test, TestingModule } from '@nestjs/testing';
import { AdminOprController } from './admin-opr.controller';
import { AdminOprService } from './admin-opr.service';

describe('AdminOprController', () => {
  let controller: AdminOprController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminOprController],
      providers: [AdminOprService],
    }).compile();

    controller = module.get<AdminOprController>(AdminOprController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
