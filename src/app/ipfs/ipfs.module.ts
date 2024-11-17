import { Global, Module } from '@nestjs/common';
import { IpfsService } from './ipfs.service';
import { IpfsController } from './ipfs.controller';
@Global()
@Module({
  controllers: [IpfsController],
  providers: [IpfsService],
})
export class IpfsModule {}
