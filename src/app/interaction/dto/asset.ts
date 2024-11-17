import { ApiProperty } from '@nestjs/swagger';

export class AssetDto {
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
}
