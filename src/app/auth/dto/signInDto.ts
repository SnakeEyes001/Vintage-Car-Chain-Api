import { ApiProperty } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */
export class SignInDto {
  
  @ApiProperty()
  username: string;

  @ApiProperty()
  orgname: string;

  @ApiProperty()
  email: string;
}
