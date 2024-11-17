import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetDto {
  @ApiProperty()
  ID: string;

  @ApiProperty()
  Brand: string;

  @ApiProperty()
  Model: string;

  @ApiProperty()
  CarInfos: string;

  @ApiProperty()
  ImageUrl: string;

  @ApiProperty()
  Documents: string;

  @ApiProperty()
  OwnerHash: string;

  @ApiProperty()
  OldOwnersHash: string;

  constructor(
    id,
    brand,
    model,
    carInfos,
    imageUrl,
    documents,
    owner,
    oldOwners,
  ) {
    this.ID = id;
    this.Brand = brand;
    this.Model = model;
    this.CarInfos = carInfos;
    this.ImageUrl = imageUrl;
    this.Documents = documents;
    this.OwnerHash = owner;
    this.OldOwnersHash = oldOwners;
  }
}
