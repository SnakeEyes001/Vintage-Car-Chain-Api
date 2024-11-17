import { ApiProperty } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */
export class CreateProfileDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  birthDay: string;

  @ApiProperty()
  adress: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  //@ApiProperty()
  //hash: string;
}
