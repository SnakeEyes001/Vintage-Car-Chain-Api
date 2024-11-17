import { Global, Module } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { InteractionController } from './interaction.controller';
import { AdminOprService } from '../admin-opr/admin-opr.service';
@Global()
@Module({
  controllers: [InteractionController],
  providers: [InteractionService, AdminOprService],
})
export class InteractionModule {}
