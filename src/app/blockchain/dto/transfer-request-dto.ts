import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class TransferRequestDto {
  @IsString() @IsNotEmpty() @ApiProperty() id: string;
  @IsString() @IsNotEmpty() @ApiProperty() requesterUserHash: string;
  @IsString() @IsNotEmpty() @ApiProperty() newOwner: string;
  @IsString() @IsNotEmpty() timestamp = new Date().toISOString();
}
