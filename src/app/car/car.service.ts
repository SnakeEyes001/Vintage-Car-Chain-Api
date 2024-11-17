import { Injectable } from '@nestjs/common';
import { CarInfos, CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InteractionService } from '../interaction/interaction.service';
import { CreateAssetDto } from '../interaction/dto/create-asset-dto';
import { HashService } from '../hash/hash.service';
import { IpfsService } from '../ipfs/ipfs.service';
import { UpdateAssetDto } from '../interaction/dto/update-asset-dto';
import { JsonContains, Repository } from 'typeorm';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
@Injectable()
export class CarService {
  constructor(
    private interactionService: InteractionService,
    private ipfsService: IpfsService,
    private usersService: UsersService,
    private hashService: HashService, //private rediscacheService: RedisCacheService
  ) {}

  async createCar(org: string, createCarDto: CreateCarDto): Promise<any> {
    try {
      const newAsset = new CreateAssetDto(
        createCarDto.ID,
        createCarDto.brand,
        createCarDto.model,
        JSON.stringify(createCarDto.carInfos),
        createCarDto.imageUrl,
        JSON.stringify(createCarDto.documents),
        createCarDto.owner,
        JSON.stringify(createCarDto.oldOwners),
      );
      return await this.interactionService.createAsset(org, newAsset);
    } catch (error) {
      console.log("That's the erroir", error);
    }
  }

  async addDocumentsToCar(org: string, carId: string, files: any) {
    try {
      const car = await this.interactionService.getAssetById(org, carId);
      // Car json
      const carJson = JSON.parse(car);
      const carDocumentJson = JSON.parse(carJson.Documents);
      console.log('car :', carJson);

      //extract the files data
      const doc1Data = files.cidDoc1;
      const doc2Data = files.cidDoc2;
      const doc3Data = files.cidDoc3;
      const doc4Data = files.cidDoc4;

      //Call IPFS service
      const cidDoc1 = await this.ipfsService.uploadFile(doc1Data);
      console.log('cid1 :', cidDoc1);
      const cidDoc2 = await this.ipfsService.uploadFile(doc2Data);
      console.log('cid2 :', cidDoc2);
      const cidDoc3 = await this.ipfsService.uploadFile(doc3Data);
      console.log('cid3 :', cidDoc3);
      const cidDoc4 = await this.ipfsService.uploadFile(doc4Data);
      console.log('cid4 :', cidDoc4);

      //Affect the cid of documetns
      carDocumentJson.cidDoc1 = cidDoc1;
      carDocumentJson.cidDoc2 = cidDoc2;
      carDocumentJson.cidDoc3 = cidDoc3;
      carDocumentJson.cidDoc4 = cidDoc4;
      //reviens au string format
      const carDocsString = JSON.stringify(carDocumentJson);
      carJson.Documents = carDocsString;
      console.log('icii', carJson.OldOwnersHash);
      const updatedAsset = new UpdateAssetDto(
        carId,
        carJson.Brand,
        carJson.Model,
        carJson.CarInfos,
        carJson.ImageUrl,
        carDocsString,
        carJson.Owner,
        carJson.OldOwners,
      );
      console.log('updatedAsset ==> ', updatedAsset);
      const res = await this.interactionService.updateAsset(org, updatedAsset);
      return res;
    } catch (error) {
      console.log('error :', error);
    }
  }

  //la fonction liee a car service
  async addPicturesToCar(
    org: string,
    carId: string,
    pictures: Express.Multer.File[],
  ) {
    try {
      const car = await this.interactionService.getAssetById(org, carId);
      const carJson = JSON.parse(car);
      const updatedAsset = new UpdateAssetDto(
        carJson.ID,
        carJson.Brand,
        carJson.Model,
        carJson.CarInfos,
        pictures,
        carJson.Documents,
        carJson.OwnerHash,
        carJson.OldOwnersHash,
      );
      return await this.interactionService.updateAsset(org, updatedAsset);
    } catch (error) {}
  }

  //c'est la methode qui sera liee a l'aure service blockchain
  async addCarPictures(org: string, carId: string, pictures: string) {
    try {
      const car = await this.interactionService.getAssetById(org, carId);
      const carJson = JSON.parse(car);
      //console.log('carJson :', carJson);
      //carJson.imageUrl = pictures;
      const updatedAsset = new UpdateAssetDto(
        carJson.ID,
        carJson.Brand,
        carJson.Model,
        carJson.CarInfos,
        pictures,
        carJson.Documents,
        carJson.Owner,
        carJson.OldOwners,
      );
      return await this.interactionService.updateAsset(org, updatedAsset);
    } catch (error) {
      console.log('error :', error);
    }
  }

  async allCars(org: string) {
    try {
      const res = await this.interactionService.getAllAssets(org);
      return res;
    } catch (error) {
      console.log('error :', error);
    }
  }

  async allCarsForOneOwner(org: string, email: string) {
    try {
      const userProfile = await this.usersService.findOne(email);
      const allCars = await this.allCars(org);
      const allCarsJson = JSON.parse(allCars);
      const listCarsForOwner = [];
      if (userProfile) {
        for (let i = 0; i < allCarsJson.length; i++) {
          console.log('allcars :', allCarsJson[i]);
          //const hashCalcule = await this.hashService.generateHashForUser(`${userProfile.userId}-@-${userProfile.email}`)
          const hashCompare = await this.hashService.compareHash(
            email,
            allCarsJson[i].Owner,
          );
          console.log('hashCompare :', hashCompare);
          if (hashCompare === true) {
            listCarsForOwner.push(allCarsJson[i]);
          }
        }
        return listCarsForOwner;
      } else {
        return ' This user is not a car owner !';
      }
    } catch (error) {
      console.log('error :', error);
    }
  }

  async findCarByID(org: string, id: string) {
    try {
      const res = await this.interactionService.getAssetById(org, id);
      console.log('res :', res);
      return res;
    } catch (error) {
      console.log('error :', error);
    }
  }

  async removeCar(org: string, id: string) {
    try {
      const res = await this.interactionService.deleteAsset(org, id);
      console.log('res :', res);
      return res;
    } catch (error) {
      console.log('error :', error);
    }
  }

  async transferCar(org: string, owner: string, carId: string) {
    try {
      //const car = await this.ca
      const res = await this.interactionService.transferAsset(
        org,
        owner,
        carId,
      );
      console.log('res :', res);
      return res;
    } catch (error) {
      console.log('error :', error);
    }
  }
}
