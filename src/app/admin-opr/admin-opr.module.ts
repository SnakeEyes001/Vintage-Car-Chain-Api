import { Global, Module } from '@nestjs/common';
import { AdminOprService } from './admin-opr.service';
import { AdminOprController } from './admin-opr.controller';
@Global()
@Module({
  controllers: [AdminOprController],
  providers: [AdminOprService],
})
export class AdminOprModule {}
