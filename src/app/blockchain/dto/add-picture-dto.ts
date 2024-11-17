import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { CarInfos, Documents } from '../models/model';

export class AddPictureDto {
  @IsString() @IsNotEmpty() @ApiProperty() email: string;
  @IsString() @IsNotEmpty() @ApiProperty() assetId: string;
  @IsString() @IsNotEmpty() brand: string;
  @IsString() @IsNotEmpty() model: string;
  @IsString() @IsNotEmpty() carInfos: CarInfos;
  @IsString() @IsNotEmpty() @ApiProperty() imageUrl: string;
  @IsString() @IsNotEmpty() documents: Documents;
  @IsString() @IsNotEmpty() owner: string;
  //@IsString() @IsNotEmpty() @ApiProperty() userHash: string;
}
