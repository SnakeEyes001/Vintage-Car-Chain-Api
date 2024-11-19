import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RequestDto {
  @IsString() @IsNotEmpty() @ApiProperty() email_to: string;
  //@IsString() @IsNotEmpty() @ApiProperty() receipientHash: string;
  @IsString() @IsNotEmpty() @ApiProperty() request_ID: string;
  @IsString() @IsNotEmpty() @ApiProperty() asset_ID: string;
  @IsString() @IsNotEmpty() @ApiProperty() requester: string;
  @IsString() @IsNotEmpty() @ApiProperty() newOwner: string;
  @IsString() @IsNotEmpty() @ApiProperty() status: string;
  @IsString() @IsNotEmpty() @ApiProperty() timestamp: string;
}
