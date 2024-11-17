import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { ApiExcludeController, ApiParam, ApiTags } from '@nestjs/swagger';
import { log } from 'console';
@ApiExcludeController()
@Controller('send-email')
@ApiTags('Sending Emails')
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}

  /*  @Get('/:email')
  @ApiParam({ name: 'email', required: true, type: 'string' })
  //@ApiParam({ name: 'subject', required: true, type: 'string' })
  setLedager(@Param('email') email) {
    console.log(email);
    return await this.sendEmailService.sendUserConfirmation(email);
  } */
}
