import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';
import { PasswordService } from '../password/password.service';
import { Password } from '../password/entities/password.entity';
import { RequestDto } from './dto/request-dto';

@Injectable()
export class SendEmailService {
  constructor(
    private mailerService: MailerService, //private  usersService: UsersService, //private  passwordService: PasswordService,
  ) {}

  async sendRequestConfirmationToUser(
    email: string,
    lastname: string,
    confirmationCode: string,
  ) {
    //const user = this.usersService.findOne(email);
    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to VintageCar App! Confirm your Email by the code.',
      template: './requestconfirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        lastname: lastname,
        code: confirmationCode,
      },
    });
  }

  async sendNotificationToUser(
    email: string,
    lastname: string,
    password: string,
  ) {
    //const user = this.usersService.findOne(email);
    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to VintageCar App!',
      template: './responseconfirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        lastname: lastname,
        password: password,
      },
    });
  }

  async NotifOldOwnerToCenter(requestDto: RequestDto) {
    //const user = this.usersService.findOne(email);
    await this.mailerService.sendMail({
      to: requestDto.email_to,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to VintageCar App, Notification !',
      template: './old-owner-to-center.hbs', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        request_ID: requestDto.request_ID,
        requester: requestDto.requester,
        asset_ID: requestDto.asset_ID,
        newOwner: requestDto.newOwner,
        status: requestDto.status,
        timestamp: requestDto.timestamp,
      },
    });
  }

  async NotifOldOwnerToNewOwner(requestDto: RequestDto) {
    //const user = this.usersService.findOne(email);
    await this.mailerService.sendMail({
      to: requestDto.email_to,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to VintageCar App, Notification !',
      template: './old-owner-to-new-owner', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        request_ID: requestDto.request_ID,
        requester: requestDto.requester,
        asset_ID: requestDto.asset_ID,
        newOwner: requestDto.newOwner,
        status: requestDto.status,
        timestamp: requestDto.timestamp,
      },
    });
  }

  async NotifCenterToOldOwner(requestDto: RequestDto) {
    //const user = this.usersService.findOne(email);
    await this.mailerService.sendMail({
      to: requestDto.email_to,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to VintageCar App, Notification !',
      template: './center-to-old-owner', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        request_ID: requestDto.request_ID,
        requester: requestDto.requester,
        asset_ID: requestDto.asset_ID,
        newOwner: requestDto.newOwner,
        status: requestDto.status,
        timestamp: requestDto.timestamp,
      },
    });
  }

  async NotifCenterToNewOwner(requestDto: RequestDto) {
    //const user = this.usersService.findOne(email);
    await this.mailerService.sendMail({
      to: requestDto.email_to,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to VintageCar App, Notification !',
      template: './center-to-new-owner', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        request_ID: requestDto.request_ID,
        requester: requestDto.requester,
        asset_ID: requestDto.asset_ID,
        newOwner: requestDto.newOwner,
        status: requestDto.status,
        timestamp: requestDto.timestamp,
      },
    });
  }

  async NotifApprouveFromOldOwnerToCenter(requestDto: RequestDto) {
    //const user = this.usersService.findOne(email);
    await this.mailerService.sendMail({
      to: requestDto.email_to,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to VintageCar App, Notification !',
      template: './approver-to-center', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        request_ID: requestDto.request_ID,
        requester: requestDto.requester,
        asset_ID: requestDto.asset_ID,
        newOwner: requestDto.newOwner,
        status: requestDto.status,
        timestamp: requestDto.timestamp,
      },
    });
  }

  async NotifApprouveFromOldOwnerNewOwner(requestDto: RequestDto) {
    //const user = this.usersService.findOne(email);
    await this.mailerService.sendMail({
      to: requestDto.email_to,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to VintageCar App, Notification !',
      template: './approver-to-new-owner', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        request_ID: requestDto.request_ID,
        requester: requestDto.requester,
        asset_ID: requestDto.asset_ID,
        newOwner: requestDto.newOwner,
        status: requestDto.status,
        timestamp: requestDto.timestamp,
      },
    });
  }
}
