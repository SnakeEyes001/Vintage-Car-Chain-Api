import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserSessionService } from './user-session.service';
import { ApiExcludeController, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiExcludeController()
@ApiTags('User Session')
@Controller('session')
export class UserSessionController {
  constructor(private readonly sessionService: UserSessionService) {}

  @Post('set/:key/:value')
  @ApiParam({ name: 'key', required: true, type: 'string' })
  @ApiParam({ name: 'value', required: true, type: 'string' })
  setSessionValue(
    @Req() req: Request,
    @Param('key') key: string,
    @Param('value') value: string,
    @Res() res: Response,
  ): void {
    const userSession = this.sessionService.setSession(req, key, value);
    res.send({
      session: userSession,
      message: `Session value set for key: ${key}`,
    });
  }

  @Get('get/:key')
  @ApiParam({ name: 'key', required: true, type: 'string' })
  getSessionValue(
    @Req() req: Request,
    @Param('key') key: string,
    @Res() res: Response,
  ): void {
    const value = this.sessionService.getSession(req, key);
    res.send(value ? { key, value } : { message: 'Key not found in session' });
  }

  @Delete('del/:key')
  @ApiParam({ name: 'key', required: true, type: 'string' })
  deleteSessionValue(
    @Req() req: Request,
    @Param('key') key: string,
    @Res() res: Response,
  ): void {
    const result = this.sessionService.deleteSession(req, key);
    res.send({ result: result, message: `Session key deleted: ${key}` });
  }

  @Delete('clear')
  clearSession(@Req() req: Request, @Res() res: Response): void {
    const result = this.sessionService.clearSession(req);
    res.send({ result: result, message: 'Session cleared' });
  }
}
