import { ApiProperty } from '@nestjs/swagger';

export class Documents {
  @ApiProperty()
  cidDoc1: string;

  @ApiProperty()
  cidDoc2: string;

  @ApiProperty()
  cidDoc3: string;

  @ApiProperty()
  cidDoc4: string;
}

export class CarInfos {
  @ApiProperty()
  year: string;

  @ApiProperty()
  engine: string;

  @ApiProperty()
  power: string;

  @ApiProperty()
  top_speed: string;

  @ApiProperty()
  acceleration: string;

  @ApiProperty()
  transmission: string;

  @ApiProperty()
  production: string;

  @ApiProperty()
  current_price: string;

  @ApiProperty()
  history: string;
}

export class CreateCarDto {
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
    this.brand = brand;
    this.model = model;
    this.carInfos = carInfos;
    this.imageUrl = imageUrl;
    this.documents = documents;
    this.owner = owner;
    this.oldOwners = oldOwners;
  }
}
