import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { HashService } from './hash.service';
import { ApiExcludeController, ApiParam, ApiTags } from '@nestjs/swagger';
//import { EnryptingData } from './models/encrypt-data';
@ApiExcludeController()
@Controller('hash')
@ApiTags('Data hash')
export class HashController {
  constructor(private readonly hashService: HashService) {}

  @Get('/hash/:email')
  @ApiParam({ name: 'email', required: true, type: 'string' })
  //@ApiParam({ name: 'password', required: true, type: 'string' })
  generateHash(@Param('email') email) {
    return this.hashService.generateHashForUser(email);
  }

  @Get('/isMatch/:email/:hash')
  @ApiParam({ name: 'email', required: true, type: 'string' })
  @ApiParam({ name: 'hash', required: true, type: 'string' })
  isMatch(@Param('hash') hash, @Param('email') email) {
    return this.hashService.compareHash(email, hash);
  }

  @Post('/encrypting')
  @ApiParam({ name: 'data', required: true, type: 'string' })
  @ApiParam({ name: 'key', required: true, type: 'string' })
  encryptingData(@Req() req: Request, @Param('data') data: string) {
    return true; //this.hashService.encryptData(req);
  }
}
