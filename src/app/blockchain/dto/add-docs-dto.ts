import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddDocumentsToAssetDto {
  @IsString() @IsNotEmpty() @ApiProperty() email: string;
  @IsString() @IsNotEmpty() @ApiProperty() assetId: string;
  @IsString() @IsNotEmpty() brand: string;
  @IsString() @IsNotEmpty() model: string;
  @IsString() @IsNotEmpty() carInfos: string;
  @IsString() @IsNotEmpty() imageUrl: string;
  @IsString() @IsNotEmpty() @ApiProperty() documents: string;
  @IsString() @IsNotEmpty() owner: string;
}
