import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ProfileConfirmationDto {
  // @IsString() @IsNotEmpty() @ApiProperty() email: string;
  @IsString() @IsNotEmpty() @ApiProperty() code: string;
}
