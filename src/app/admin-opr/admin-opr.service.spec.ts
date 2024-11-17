import { Test, TestingModule } from '@nestjs/testing';
import { AdminOprService } from './admin-opr.service';

describe('AdminOprService', () => {
  let service: AdminOprService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminOprService],
    }).compile();

    service = module.get<AdminOprService>(AdminOprService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
