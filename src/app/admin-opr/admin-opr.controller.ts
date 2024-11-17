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
import { ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('admin-opr')
@ApiTags('Admin routes')
export class AdminOprController {
  constructor(private readonly adminOprService: AdminOprService) {}
  @ApiParam({ name: 'org', required: true, type: 'string' })
  @Get('/ccp/:org')
  getCcpOrg(@Param('org') org: string) {
    console.log('org1', org);
    return this.adminOprService.getCCPOrg(org);
  }

  @Get('/ca-client/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  getCaClient(@Param('org') org) {
    console.log('org1', org);
    return this.adminOprService.getCAForOrg(org);
  }

  @Get('/wallet/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  createWalletForOrg(@Param('org') org) {
    return this.adminOprService.createWalletForOrg(org);
  }

  @Get('/createadmin/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  async createAdminForOrg(@Param('org') org) {
    const admin = await this.adminOprService.createAdminForOrg(org);
    return JSON.stringify(admin);
  }

  @Get('/registerUser/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  async createUserForOrg(@Param('org') org) {
    const user = await this.adminOprService.createUserForOrg(org);
    return JSON.stringify(user);
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

  @Get('/getwayOrgUser/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  getWayForOrgUser(@Param('org') org) {
    return this.adminOprService.createGetWayForOrgUser(org);
  }
  @Get('/chaincodeOrgUser/:org')
  @ApiParam({ name: 'org', required: true, type: 'string' })
  getChaincodeForOrgUser(@Param('org') org) {
    return this.adminOprService.createGetWayForOrgUser(org);
  }
}
