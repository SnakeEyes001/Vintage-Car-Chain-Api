import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString() @IsNotEmpty() @ApiProperty() userId: string;
  @IsString() @IsNotEmpty() @ApiProperty() userHash: string;
}
