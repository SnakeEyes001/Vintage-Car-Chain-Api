import { ApiProperty } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */
export class LogInDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
