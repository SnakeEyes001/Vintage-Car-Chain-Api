import { ApiProperty } from "@nestjs/swagger";
import { CarInfos, Documents } from "src/app/car/dto/create-car.dto";

export class LoginToAccount{
    @ApiProperty()
    accountHash: string;

    @ApiProperty()
    password: string;
}
