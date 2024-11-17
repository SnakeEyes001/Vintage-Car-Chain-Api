import { ApiProperty } from "@nestjs/swagger";

export class CreateRedisCacheDto {
    @ApiProperty()
    key: string;
  
    @ApiProperty()
    data: string;
}
