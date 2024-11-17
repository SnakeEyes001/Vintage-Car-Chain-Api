import { Injectable } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/user-dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { HashService } from '../hash/hash.service';
import { PasswordService } from '../password/password.service';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailService } from '../send-email/send-email.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userProfileRepo: Repository<UserEntity>,
    //private hashService: HashService,
    private passwordService: PasswordService,
    //private mailerService: MailerService,
    private sendEmailService: SendEmailService,
  ) {}

  async findOne(email: string): Promise<UserEntity> {
    const user = await this.userProfileRepo.findOne({ where: { email } });
    return user;
  }

  async createUserProfile(userProfileDto: CreateUserProfileDto) {
    try {
      const user = new UserEntity();
      user.firstName = userProfileDto?.firstName;
      user.lastName = userProfileDto?.lastName;
      (user.birthDay = userProfileDto?.birthDay),
        (user.adress = userProfileDto?.adress);
      user.phone = userProfileDto?.phone;
      user.email = userProfileDto?.email;
      user.password = userProfileDto?.password;

      //sauvgarde user in BD
      const result = await this.userProfileRepo.save(user);
      return result;
    } catch (error) {
      console.log('error :', error);
    }
  }

  async confirmationCreateProfile(code: string) {
    try {
      //utilisation du cache
      //const cachedUser = await this.cacheService.get('user');
      //console.log('cachedUser :', cachedUser);
      const passAleatoire = await this.passwordService.generatePassword();

      //sauvgarde user in BD
      //const result = await this.userProfileRepo.save(cachedUser);
      //console.log('res', result);
      //const sendCofirmationCode = await this.sendEmailService.sendNotificationToUser(cachedUser.email, cachedUser.lastName, passAleatoire);
      return true;
    } catch (error) {
      console.log('error :', error);
    }
  }

  async getAllUsers() {
    try {
      const result = await this.userProfileRepo.find();
      console.log('res', result);
      return result;
    } catch (error) {
      console.log('error :', error);
    }
  }

  /*  async login(email: string, passowrd: string) {
    try {
      const userHash = await this.hashService.generateHash(email);
      const isMatch = await this.hashService.compareHash(email, userHash);
      const user = await this.userProfileRepo.findOne({ where: { email } });
      if (user && isMatch && user.password === passowrd) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('error :', error);
    }
  } */
}
