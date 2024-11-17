import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { BlockchainApiService } from './blockchain-api.service';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeController,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CteateCarByOwnerDto } from './dto/create-car-by-owner-dto';
import { CarService } from '../car/car.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateUserProfileDto } from '../users/dto/user-dto';
import { Request } from 'express';
@ApiExcludeController()
@Controller('blockchain-api')
@ApiTags('Mobile operations')
export class BlockchainApiController {
  constructor(
    private readonly blockchainApiService: BlockchainApiService,
    private readonly carService: CarService,
  ) {}

  @Post('/user/code')
  //@ApiParam({ name: 'org', required: true, type: 'string' })
  async createNewUserProfileTMP(
    @Req() req: Request,
    @Body() createUserProfileDto: CreateUserProfileDto,
  ) {
    const res = await this.blockchainApiService.createNewUserCompte(req);
    return res;
  }

  @Post('/user/confirmation/:code')
  @ApiParam({ name: 'code', required: true, type: 'string' })
  async createNewUserProfileOfficialy(
    @Req() req: Request,
    @Param('code') code: string,
  ) {
    const res = await this.blockchainApiService.confirmationCreationProfile(
      req,
    );
    return res;
  }

  @Post('/addCar/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  createNewCarbyOwner(
    @Param('org') org,
    @Body() cteateCarByOwnerDto: CteateCarByOwnerDto,
  ) {
    return this.blockchainApiService.createNewCarforOwner(
      org,
      cteateCarByOwnerDto,
    );
  }

  @Patch('addCarPictures/:org/:carId')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  @ApiParam({ name: 'carId', required: true, type: 'string' })
  @ApiParam({ name: 'email', required: true, type: 'string' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'carPictures', maxCount: 10 }]),
  ) // Ajustez le maxCount selon vos besoins
  @ApiBody({
    description: "Car's pictures",
    schema: {
      type: 'object',
      properties: {
        carPictures: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async addPicturesToCar(
    @Param('org') org: string,
    @Param('carId') carId: string,
    @Param('email') email: string,
    @UploadedFiles() files: { carPictures?: Express.Multer.File[] }, // Utilisez un objet pour gérer les fichiers par nom de champ
  ) {
    const carPictures = files.carPictures || [];
    return await this.blockchainApiService.addPicturesToCar(
      org,
      carId,
      email,
      carPictures,
    );
  }

  @Patch('addFilesTocar/:org/:idCar/:email')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  @ApiParam({ name: 'idCar', required: true, type: 'string' })
  @ApiParam({ name: 'email', required: true, type: 'string' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'carDoc1', maxCount: 1 },
      { name: 'carDoc2', maxCount: 1 },
      { name: 'carDoc3', maxCount: 1 },
      { name: 'carDoc4', maxCount: 1 },
    ]),
  )
  @ApiBody({
    description: "Car's documents",
    schema: {
      type: 'object',
      properties: {
        carDoc1: {
          type: 'string',
          format: 'binary',
        },
        carDoc2: {
          type: 'string',
          format: 'binary',
        },
        carDoc3: {
          type: 'string',
          format: 'binary',
        },
        carDoc4: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  addDocumentsToCar(
    @Param('org') org: string,
    @Param('idCar') idCar: string,
    @Param('email') email: string,
    @UploadedFiles()
    files: {
      carDoc1?: Express.Multer.File[];
      carDoc2?: Express.Multer.File[];
      carDoc3?: Express.Multer.File[];
      carDoc4?: Express.Multer.File[];
    },
  ) {
    return this.blockchainApiService.addDocumentsToCar(
      org,
      idCar,
      email,
      files,
    );
  }

  @Get('/allCars/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  getAllCars(@Param('org') org: string) {
    return this.carService.allCars(org);
  }

  @Get('/allOwnerCars/:org/:email')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  @ApiParam({ name: 'email', required: true, type: 'string' })
  async getAllCarsForOwner(
    @Param('org') org: string,
    @Param('email') email: string,
  ) {
    return await this.carService.allCarsForOneOwner(org, email);
  }

  @Get('/getOneCar/:org/:carId')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  @ApiParam({ name: 'carId', required: true, type: 'string' })
  async getCarById(@Param('org') org: string, @Param('carId') carId: string) {
    return await this.carService.findCarByID(org, carId);
  }
  @Get('/deletecar/:org/:carId')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  @ApiParam({ name: 'carId', required: true, type: 'string' })
  async deleteCar(@Param('org') org: string, @Param('carId') carId: string) {
    return await this.carService.removeCar(org, carId);
  }

  @Get('/transferCar/:org/:carId/:emailFrom/:emailTo')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  @ApiParam({ name: 'carId', required: true, type: 'string' })
  @ApiParam({ name: 'emailFrom', required: true, type: 'string' })
  @ApiParam({ name: 'emailTo', required: true, type: 'string' })
  async transfertCar(
    @Param('org') org: string,
    @Param('emailFrom') emailFrom: string,
    @Param('carId') carId: string,
    @Param('emailTo') emailTo: string,
  ) {
    return await this.blockchainApiService.transferCar(
      org,
      emailFrom,
      carId,
      emailTo,
    );
  }
}
