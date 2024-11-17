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
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeController,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

@ApiExcludeController()
@Controller('car')
@ApiTags('Cars operations')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post('addCar/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  @ApiBody({
    type: CreateCarDto,
  })
  create(@Param('org') org: string, @Body() createCarDto: CreateCarDto) {
    return this.carService.createCar(org, createCarDto);
  }

  @Patch('addPicturesToCar/:org/:idCar')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  @ApiParam({ name: 'idCar', required: true, type: 'string' })
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
    @Param('idCar') idCar: string,
    @UploadedFiles() files: { carPicture?: Express.Multer.File[] }, // Utilisez un objet pour gérer les fichiers par nom de champ
  ) {
    const carPictures = files.carPicture || [];
    return this.carService.addPicturesToCar(org, idCar, carPictures);
  }

  @Patch('addFilesTocar/:org/:idCar')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  @ApiParam({ name: 'idCar', required: true, type: 'string' })
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
  addFilesToCar(
    @Param('org') org: string,
    @Param('idCar') idCar: string,
    @UploadedFiles()
    files: {
      carDoc1?: Express.Multer.File[];
      carDoc2?: Express.Multer.File[];
      carDoc3?: Express.Multer.File[];
      carDoc4?: Express.Multer.File[];
    },
  ) {
    return this.carService.addDocumentsToCar(org, idCar, files);
  }

  /* @ApiBody({
    description: "Car's pictures and information",
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        carPicture: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        carDoc1: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        carDoc2: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        carDoc3: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        carDoc4: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Patch('addFiles/:id/:org/:email')
  updateCar(
    @Param('org') org: string,
    @UploadedFiles()
    files: {
      carPicture?: Express.Multer.File;
      carDoc1?: Express.Multer.File;
      carDoc2?: Express.Multer.File;
      carDoc3?: Express.Multer.File;
      carDoc4?: Express.Multer.File;
    },
  ) {
    //return this.carService.updateCar(org, updateCarDto);
  } */

  @Get('/all/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  allCars(@Param('org') org) {
    return this.carService.allCars(org);
  }

  @Get(':org/:id')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  getCarById(@Param('org') org: string, @Param('id') id: string) {
    return this.carService.findCarByID(org, id);
  }

  @Delete(':org/:id')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  removceCarById(@Param('org') org: string, @Param('id') id: string) {
    return this.carService.removeCar(org, id);
  }
}
