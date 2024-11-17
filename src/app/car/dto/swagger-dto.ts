import { ApiProperty } from '@nestjs/swagger';
import { CarInfos } from './create-car.dto';

export class addNewCar {
    @ApiProperty()
    ID: string;
  
    @ApiProperty()
    brand: string;
  
    @ApiProperty()
    model: string;
  
    @ApiProperty()
    carInfos: CarInfos;
}