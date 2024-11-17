import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';
import { PasswordService } from '../password/password.service';
import { Password } from '../password/entities/password.entity';

@Injectable()
export class SendEmailService {
  constructor(  
    private  mailerService: MailerService,
    //private  usersService: UsersService,
    //private  passwordService: PasswordService, 
    ) {}


  async sendRequestConfirmationToUser(email: string, lastname:string, confirmationCode:string) {
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

  async sendNotificationToUser(email: string, lastname:string, password:string ) {
    //const user = this.usersService.findOne(email);
    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to VintageCar App! Confirm your Email by the code.',
      template: './responseconfirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        lastname: lastname,
        password: password,
      },
    });
  }
  
}
