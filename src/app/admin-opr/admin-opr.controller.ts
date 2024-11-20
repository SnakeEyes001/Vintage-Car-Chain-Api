import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AdminOprService } from './admin-opr.service';
import { ApiExcludeEndpoint, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('admin-opr')
@ApiTags('Admin Endpoints')
export class AdminOprController {
  constructor(private readonly adminOprService: AdminOprService) {}

  @ApiExcludeEndpoint()
  @ApiParam({ name: 'org', required: true, type: 'string' })
  @Get('/ccp/:org')
  getCcpOrg(@Param('org') org: string) {
    console.log('org1', org);
    return this.adminOprService.getCCPOrg(org);
  }

  @ApiExcludeEndpoint()
  @Get('/ca-client/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  getCaClient(@Param('org') org) {
    console.log('org1', org);
    return this.adminOprService.getCAForOrg(org);
  }

  @ApiExcludeEndpoint()
  @Get('/wallet/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  createWalletForOrg(@Param('org') org) {
    return this.adminOprService.createWalletForOrg(org);
  }

  @Get('/createadmins')
  // @ApiParam({ name: 'org', required: true, type: 'string' }) // Si ce paramètre n'est pas nécessaire ici, commentez-le ou supprimez-le.
  async createAdminsForOrganization() {
    try {
      const admins = await this.adminOprService.createAdminForOrg();
      // Retourne directement l'objet JSON, inutile d'appeler `JSON.parse` si `createAdminForOrg` retourne déjà un objet.
      return admins;
    } catch (error) {
      // Gère les erreurs de manière explicite
      console.error('Error in createAdminsForOrganization:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('/registerusers')
  //@ApiParam({ name: 'org', required: true, type: 'string' })
  async createUserForOrganization() {
    const users = await this.adminOprService.createUserForOrg();
    return users; //JSON.stringify(user);
  }

  // Endpoint to get users by organization
  /*   @Get('users/user/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  async getUsersByOrg(@Query('org') org: string) {
    try {
      return await this.adminOprService.getUsersByOrg(org);
    } catch (error) {
      return { error: error.message };
    }
  } */

  @ApiExcludeEndpoint()
  @Get('/getwayOrgUser/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  getWayForOrgUser(@Param('org') org) {
    return this.adminOprService.createGetWayForOrgUser(org);
  }

  @ApiExcludeEndpoint()
  @Get('/chaincodeOrgUser/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  getChaincodeForOrgUser(@Param('org') org) {
    return this.adminOprService.createGetWayForOrgUser(org);
  }
}
