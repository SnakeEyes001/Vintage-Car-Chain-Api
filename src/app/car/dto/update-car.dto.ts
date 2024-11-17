import { PartialType } from '@nestjs/mapped-types';
import { CarInfos, CreateCarDto, Documents } from './create-car.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCarDto {
  //xtends PartialType(CreateCarDto)
  @ApiProperty()
  ID: string;

  @ApiProperty()
  brand: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  carInfos: CarInfos;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  documents: Documents;

  @ApiProperty()
  owner: string;

  @ApiProperty()
  oldOwners: [];
}
