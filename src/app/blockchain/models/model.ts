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
