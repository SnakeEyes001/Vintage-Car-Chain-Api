import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { CarInfos, Documents } from '../models/model';

export class CreateAssetDto {
  @IsString() @IsNotEmpty() @ApiProperty() email: string;
  @IsString() @IsNotEmpty() @ApiProperty() brand: string;
  @IsString() @IsNotEmpty() @ApiProperty() model: string;
  @IsString() @IsNotEmpty() @ApiProperty() carInfos: CarInfos;
  @IsString() @IsNotEmpty() @ApiProperty() imageUrl: string;
  @IsString() @IsNotEmpty() @ApiProperty() documents: Documents;
  @IsString() @IsNotEmpty() @ApiProperty() owner: string;
  //IsString() @IsNotEmpty() oldOwners: string;
  //IsString() @IsNotEmpty() owner: string;

  //@IsString() @IsNotEmpty() @ApiProperty() userHash: string;
}
