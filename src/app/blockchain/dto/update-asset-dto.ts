import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateAssetDto {
  @IsString() @IsNotEmpty() @ApiProperty() id: string;
  @IsString() @IsNotEmpty() @ApiProperty() brand: string;
  @IsString() @IsNotEmpty() @ApiProperty() model: string;
  @IsString() @IsNotEmpty() @ApiProperty() carInfos: string;
  @IsString() @IsNotEmpty() @ApiProperty() imageUrl: string;
  @IsString() @IsNotEmpty() @ApiProperty() documents: string;
  @IsString() @IsNotEmpty() @ApiProperty() owner: string;
  @IsString() @IsNotEmpty() @ApiProperty() userHash: string;
}
