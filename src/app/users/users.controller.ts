import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUserProfileDto } from './dto/user-dto';
//import { get } from 'http';

@Controller('users')
@ApiTags('Users operations')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/newuser')
  async createNewProfile(@Body() createUserProfileDto: CreateUserProfileDto) {
    try {
      const res = await this.usersService.createUserProfile(
        createUserProfileDto,
      );
      return res;
    } catch (error) {
      console.log('error :', error);
    }
  }

  @Get('/confirmation/:code')
  async confirmationInscription(@Param('code') code:string) {
    try {
      const res = await this.usersService.confirmationCreateProfile(code);
      return res;
    } catch (error) {
      console.log('error :', error);
    }
  }

  @Get('/allusers')
  async getUsers() {
    try {
      const res = await this.usersService.getAllUsers();
      return res;
    } catch (error) {
      console.log('error :', error);
    }
  }

  @Get('/getone/:email')
  @ApiParam({ name: 'email', required: true, type: 'string' })
  async getOneByEmail(@Param('email') email: string) {
    try {
      const res = await this.usersService.findOne(email);
      return res;
    } catch (error) {
      console.log('error :', error);
    }
  }

 /*  @Get('/login/:email/:password')
  @ApiParam({ name: 'email', required: true, type: 'string' })
  @ApiParam({ name: 'password', required: true, type: 'string' })
  async login(@Param('email') email, @Param('password') password) {
    try {
      const res = await this.usersService.login(email, password);
      return res;
    } catch (error) {
      console.log('error :', error);
    }
  } */
}
