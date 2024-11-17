import { ApiProperty } from "@nestjs/swagger";
import { CarInfos, Documents } from "src/app/car/dto/create-car.dto";

export class CteateCarByOwnerDto {
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
    ownerEmail: string;
  
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
        this.ownerEmail = owner;
        this.oldOwners = oldOwners;
      } 
}
