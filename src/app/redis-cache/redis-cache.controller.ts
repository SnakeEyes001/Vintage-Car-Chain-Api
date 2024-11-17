import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import { CreateRedisCacheDto } from './dto/create-redis-cache.dto';
import { ApiBody, ApiExcludeController } from '@nestjs/swagger';
@ApiExcludeController()
@Controller('redis-cache')
export class RedisCacheController {
  constructor(private readonly redisCacheService: RedisCacheService) {}
  @Post()
  @ApiBody({
    type: CreateRedisCacheDto,
  })
  async setVariable(@Body() createRedisCacheDto: CreateRedisCacheDto) {
    return await this.redisCacheService.setVariable(
      createRedisCacheDto.key,
      createRedisCacheDto.data,
    );
  }

  @Get(':key')
  async getVariable(@Param('key') key: string) {
    return await this.redisCacheService.getVariable(key);
  }

  @Get('allcache')
  async getAllKeysAndValues() {
    return await this.redisCacheService.getAllKeysAndValues();
  }

  @Delete(':key')
  async deleteVariable(@Param('key') key: string) {
    await this.redisCacheService.deleteVariable(key);
    return { message: `Key ${key} deleted` };
  }
}
