import {
  Controller,
  Post,
  Get,
  Query,
  Param,
  Body,
  Req,
  Patch,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { BlockchainService } from './blockchain.service'; // Assurez-vous d'importer le service correctement
import { CreateUserDto } from './dto/create-user-dto';
import { CreateAssetDto } from './dto/create-asset-dto';
//import { AddDocumentsToAssetDto, UpdateAssetDto } from './dto/add-docs-dto';
import { TransferRequestDto } from './dto/transfer-request-dto';
import { Request } from 'express';
import { CreateProfileDto } from './dto/create-profile-dto';
import { ProfileConfirmationDto } from './dto/profile-confirmation-dto';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { LogInDto } from './dto/login-dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AddPictureDto } from './dto/add-picture-dto';
import { AddDocumentsToAssetDto } from './dto/add-docs-dto';

@Controller('Blockchain-api')
@ApiTags('Fabric Operations')
// Vous pouvez personnaliser le préfixe si nécessaire
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post('init')
  async initLedger() {
    try {
      const result = await this.blockchainService.initLedger();
      return { success: true, data: result };
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation du livre de comptes :",
        error,
      );
      return {
        success: false,
        error: "Échec de l'initialisation du livre de comptes",
        details: error.message,
      };
    }
  }

  // Just for Org1
  @Post('user/register')
  async createUser(
    @Req() req: Request,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    try {
      const result = await this.blockchainService.createUserTMP(req);
      return { success: true, data: result };
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur :", error);
      return {
        success: false,
        error: "Échec de la création de l'utilisateur",
        details: error.message,
      };
    }
  }

  // Just for Org1
  @Post('user/confirmation')
  async ProfileConfirmation(
    @Req() req: Request,
    @Body() profileConfirmationDto: ProfileConfirmationDto,
  ) {
    try {
      const result = await this.blockchainService.createFinalProfile(req);
      return { success: true, data: result };
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur :", error);
      return {
        success: false,
        error: "Échec de la création de l'utilisateur",
        details: error.message,
      };
    }
  }

  // LogIn to application and get token
  @Post('user/login')
  async LogInToApp(@Req() req: Request, @Body() logInDto: LogInDto) {
    try {
      const result = await this.blockchainService.logInToApp(req);
      return { success: true, data: result };
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'authentification :",
        error,
      );
      return {
        success: false,
        error: "Échec de l'authentification",
        details: error.message,
      };
    }
  }

  // Endpoint to get all users
  @Get('users/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  async getAllUsers(@Param('org') org) {
    try {
      const res = await this.blockchainService.getAllUsers(org);
      return res;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('user/exists/:userId')
  async userExists(@Query('org') org: string, @Param('userId') userId: string) {
    try {
      const result = await this.blockchainService.userExists(org, userId);
      return { success: true, data: result };
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'existence de l'utilisateur :",
        error,
      );
      return {
        success: false,
        error: "Échec de la vérification de l'existence de l'utilisateur",
        details: error.message,
      };
    }
  }

  @Get('user/:userId')
  async readUser(@Query('org') org: string, @Param('userId') userId: string) {
    try {
      const result = await this.blockchainService.readUser(org, userId);
      return { success: true, data: result };
    } catch (error) {
      console.error("Erreur lors de la lecture de l'utilisateur :", error);
      return {
        success: false,
        error: "Échec de la lecture de l'utilisateur",
        details: error.message,
      };
    }
  }

  // Just for Org1
  @Post('asset/create')
  async createAsset(
    @Req() req: Request,
    //@Query('org') org: string,
    @Body() createAssetDto: CreateAssetDto,
  ) {
    try {
      const result = await this.blockchainService.createAsset(createAssetDto);
      return { success: true, data: result };
    } catch (error) {
      console.error("Erreur lors de la création de l'actif :", error);
      return {
        success: false,
        error: "Échec de la création de l'actif",
        details: error.message,
      };
    }
  }

  // Just for Org1
  /*   @Post('asset/update')
  async updateAsset(
    @Req() req: Request,
    //@Query('org') org: string,
    @Body() updateAssetDto: UpdateAssetDto,
  ) {
    try {
      const result = await this.blockchainService.updateAsset(updateAssetDto);
      return { success: true, data: result };
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'actif :", error);
      return {
        success: false,
        error: "Échec de la mise à jour de l'actif",
        details: error.message,
      };
    }
  } */

  @Patch('addpictures/:carId')
  //@ApiParam({ name: 'org', required: true, type: 'string' })
  @ApiParam({ name: 'carId', required: true, type: 'string' })
  //@ApiParam({ name: 'email', required: true, type: 'string' })
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
    @Req() req: Request,
    @Body() addPictureDto: AddPictureDto,
    @UploadedFiles() files: { carPictures?: Express.Multer.File[] }, // Utilisez un objet pour gérer les fichiers par nom de champ
  ) {
    const carPictures = files.carPictures || [];
    return await this.blockchainService.AddPictureToAsset(addPictureDto);
  }

  @Patch('addfiles/:idCar')
  //@ApiParam({ name: 'org', required: true, type: 'string' })
  @ApiParam({ name: 'idCar', required: true, type: 'string' })
  //@ApiParam({ name: 'email', required: true, type: 'string' })
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
    @Req() req,
    @Param('idCar') idCar: string,
    @Body() addDocumentsToAssetDto: AddDocumentsToAssetDto,
    @UploadedFiles()
    files: {
      carDoc1?: Express.Multer.File[];
      carDoc2?: Express.Multer.File[];
      carDoc3?: Express.Multer.File[];
      carDoc4?: Express.Multer.File[];
    },
  ) {
    return this.blockchainService.addDocumentsToCar(
      addDocumentsToAssetDto,
      files,
    );
  }

  @Post('transfer/request/:org')
  async requestTransfer(
    @Req() req: Request,
    @Query('org') org: string,
    @Body() transferRequestDto: TransferRequestDto,
  ) {
    try {
      const result = await this.blockchainService.requestTransfer(
        org,
        transferRequestDto,
      );
      return result; //{ success: true, data: result };
    } catch (error) {
      console.error('Erreur lors de la demande de transfert :', error);
      return {
        success: false,
        error: 'Échec de la demande de transfert',
        details: error.message,
      };
    }
  }

  @Post('transfer/approve-center/:id')
  async approveTransferByCenter(
    @Req() req: Request,
    @Query('org') org: string,
    @Param('id') id: string,
    //@Body('requestIndex') requestIndex: any,
  ) {
    try {
      const result = await this.blockchainService.approveTransferByCenter(
        org,
        id,
        req,
      );
      return true; //{ success: true, data: result };
    } catch (error) {
      console.error(
        "Erreur lors de l'approbation du transfert par le centre :",
        error,
      );
      return {
        success: false,
        error: "Échec de l'approbation du transfert par le centre",
        details: error.message,
      };
    }
  }

  @Post('transfer/approve-owner/:id')
  async approveTransferByOwner(
    @Req() req: Request,
    @Query('org') org: string,
    @Query('approverUserHash') approverUserHash: string,
    @Param('id') id: string,
    //@Body() body: { approverUserHash: string; requestIndex: string },
  ) {
    try {
      const result = await this.blockchainService.approveTransferByOwner(
        org,
        id,
        approverUserHash,
      );
      return { success: true, data: result };
    } catch (error) {
      console.error(
        "Erreur lors de l'approbation du transfert par le propriétaire :",
        error,
      );
      return {
        success: false,
        error: "Échec de l'approbation du transfert par le propriétaire",
        details: error.message,
      };
    }
  }

  @Post('transfer/reject/:id')
  async rejectTransferByCenter(
    @Req() req: Request,
    @Query('org') org: string,
    @Param('id') id: string,
    @Body('requestIndex') requestIndex: number,
  ) {
    try {
      const result = await this.blockchainService.rejectTransferByCenter(
        org,
        id,
        requestIndex,
      );
      return { success: true, data: result };
    } catch (error) {
      console.error('Erreur lors du rejet du transfert par le centre :', error);
      return {
        success: false,
        error: 'Échec du rejet du transfert par le centre',
        details: error.message,
      };
    }
  }

  @Get('asset/:id')
  async readAsset(@Query('org') org: string, @Param('id') id: string) {
    try {
      const result = await this.blockchainService.readAsset(org, id);
      return { success: true, data: result };
    } catch (error) {
      console.error("Erreur lors de la lecture de l'actif :", error);
      return {
        success: false,
        error: "Échec de la lecture de l'actif",
        details: error.message,
      };
    }
  }

  @Get('asset-exists/:id')
  async assetExists(@Query('org') org: string, @Param('id') id: string) {
    try {
      const result = await this.blockchainService.assetExists(org, id);
      return { success: true, data: result };
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'existence de l'actif :",
        error,
      );
      return {
        success: false,
        error: "Échec de la vérification de l'existence de l'actif",
        details: error.message,
      };
    }
  }

  @Get('assets/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  async getAllAssets(@Param('org') org: string) {
    try {
      const result = await this.blockchainService.getAllAssets(org);
      return { success: true, data: result };
    } catch (error) {
      console.error(
        'Erreur lors de la récupération de tous les actifs :',
        error,
      );
      return {
        success: false,
        error: 'Échec de la récupération des actifs',
        details: error.message,
      };
    }
  }

  @Get('requests/:org')
  async getAllRequests(@Query('org') org: string) {
    try {
      const result = await this.blockchainService.getAllRequests(org);
      return { success: true, data: result };
    } catch (error) {
      console.error(
        'Erreur lors de la récupération de toutes les demandes :',
        error,
      );
      return {
        success: false,
        error: 'Échec de la récupération des demandes',
        details: error.message,
      };
    }
  }

  @Get('requests/user/:userHash')
  async getRequestsByUser(
    @Query('org') org: string,
    @Param('userHash') userHash: string,
  ) {
    try {
      const result = await this.blockchainService.getRequestsByUser(
        org,
        userHash,
      );
      return { success: true, data: result };
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des demandes par utilisateur :',
        error,
      );
      return {
        success: false,
        error: 'Échec de la récupération des demandes par utilisateur',
        details: error.message,
      };
    }
  }
}
