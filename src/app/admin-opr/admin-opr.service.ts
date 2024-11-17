import { Injectable } from '@nestjs/common';
import * as FabricCAServices from 'fabric-ca-client';
import { Gateway, GatewayOptions, Wallets } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';
import { buildCAClient, enrollAdmin } from '../../utils/CAUtil';
import {
  CAHostName,
  ChannelConfig,
  Config,
  MspOrgs,
  OrganizationUsers,
  walletBasePath,
} from 'src/utils/Constants';
import { buildWallet, prettyJSONString } from 'src/utils/AppUtil';
import { registerAndEnrollUser } from 'src/utils/CAUtil';

@Injectable()
export class AdminOprService {
  getCCPOrg = (org: string): Record<string, any> => {
    console.log('org', org);
    // load the common connection configuration file
    let ccpPath = null;
    org === 'Org1'
      ? (ccpPath = path.resolve(
          'src',
          'organizations',
          'peerOrganizations',
          'org1.example.com',
          'connection-org1.json',
        ))
      : null;
    org === 'Org2'
      ? (ccpPath = path.resolve(
          'src',
          'organizations',
          'peerOrganizations',
          'org2.example.com',
          'connection-org2.json',
        ))
      : null;
    const fileExists = fs.existsSync(ccpPath);
    if (!fileExists) {
      throw new Error(`no such file or directory: ${ccpPath}`);
    }
    const contents = fs.readFileSync(ccpPath, 'utf8');
    // build a JSON object from the file contents
    const ccp = JSON.parse(contents);
    console.log(`Loaded the network configuration located at ${ccpPath}`);
    return ccp;
  };

  getCAForOrg = (org: string) => {
    let hostName = null;
    const ccp = this.getCCPOrg(org);
    if (org == 'Org1') {
      hostName = CAHostName.caHostNameOrg1;
    }
    if (org == 'Org2') {
      hostName = CAHostName.caHostNameOrg2;
    }
    const ca = buildCAClient(ccp, hostName);
    return ca;
  };

  createWalletForOrg = async (org: string) => {
    const res = await buildWallet(walletBasePath, org);
    return res;
  };

  createAdminForOrg = async (): Promise<string | Record<string, any>> => {
    try {
      let msp = null;
      let wallet = null;
      let adminOrg1 = null;
      let adminOrg2 = null;

      const caClientOrg1 = this.getCAForOrg('Org1');
      const caClientOrg2 = this.getCAForOrg('Org2');

      if (caClientOrg1) {
        wallet = await buildWallet(walletBasePath, 'Org1');
        msp = MspOrgs.MspOrg1;
        adminOrg1 = await enrollAdmin(caClientOrg1, wallet, msp);
      }
      if (caClientOrg2) {
        wallet = await buildWallet(walletBasePath, 'Org2');
        msp = MspOrgs.MspOrg2;
        adminOrg2 = await enrollAdmin(caClientOrg2, wallet, msp);
      }

      const result = {
        admin1: adminOrg1,
        admin2: adminOrg2,
      };

      // Retourner le résultat au format JSON ou comme une chaîne
      return process.env.RETURN_AS_STRING === 'true'
        ? JSON.stringify(result)
        : result;
    } catch (error) {
      console.log('error :', error);
      return JSON.stringify({ error: error.message });
    }
  };

  createUserForOrg = async (): Promise<string | Record<string, any>> => {
    try {
      const caClient1 = this.getCAForOrg('Org1');
      const caClient2 = this.getCAForOrg('Org2');
      let wallet = null;
      let userOrg1 = null;
      let userOrg2 = null;

      if (caClient1) {
        wallet = await buildWallet(walletBasePath, 'Org1');
        userOrg1 = await registerAndEnrollUser(
          caClient1,
          wallet,
          MspOrgs.MspOrg1,
          OrganizationUsers.org1UserId,
          'org1.department1',
        );
      }

      if (caClient2) {
        wallet = await buildWallet(walletBasePath, 'Org2');
        userOrg2 = await registerAndEnrollUser(
          caClient2,
          wallet,
          MspOrgs.MspOrg2,
          OrganizationUsers.org2UserId,
          'org2.department1',
        );
      }

      const result = {
        userOrg1,
        userOrg2,
      };

      // Retourner le résultat en JSON ou en string JSON
      return process.env.RETURN_AS_STRING === 'true'
        ? JSON.stringify(result)
        : result;
    } catch (error) {
      console.log('error :', error);
      return JSON.stringify({ error: error.message });
    }
  };

  // Récupérer l'admin et la liste des utilisateurs d'une organisation
  async getAdminAndUsersByOrg(org: string): Promise<any> {
    try {
      let orgMSP = null;
      let wallet = null;
      if (org === 'Org1') {
        orgMSP = MspOrgs.MspOrg1;
        wallet = await buildWallet(walletBasePath, org);
      }

      if (org === 'Org2') {
        orgMSP = MspOrgs.MspOrg2;
        wallet = await buildWallet(walletBasePath, org);
      }

      // L'identité de l'administrateur est basée sur le walle
      const adminIdentity = await wallet.get(`${orgMSP}_admin`);

      if (!adminIdentity) {
        throw new Error(
          `L'administrateur pour l'organisation ${orgMSP} n'existe pas`,
        );
      }

      const adminId = `${orgMSP}_admin`;

      // Récupérer les utilisateurs via la chaîne
      const contract = await this.getCarChainCodeForOrg(org);
      const result = contract.evaluateTransaction('GetUsersByOrg', orgMSP);
      const users = JSON.parse(result.toString());

      return {
        admin: adminId,
        users,
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des utilisateurs et admin pour ${org}: ${error.message}`,
      );
    }
  }

  // Consuming GetAllUsers
  async getAllUsers(org: string): Promise<string> {
    try {
      const contract = await this.getCarChainCodeForOrg(org);
      const result = contract.evaluateTransaction('GetAllUsers');
      return JSON.parse(result.toString());
    } catch (error) {
      throw new Error(`Error fetching all users: ${error.message}`);
    }
  }

  // Consuming GetUsersByOrg
  async getUsersByOrg(org: string): Promise<string> {
    try {
      let orgMSP = null;
      if (org === 'Org1') orgMSP = MspOrgs.MspOrg1;
      if (org === 'Org2') orgMSP = MspOrgs.MspOrg2;

      const contract = await this.getCarChainCodeForOrg(org);
      const result = contract.evaluateTransaction('GetUsersByOrg', orgMSP);
      return JSON.parse(result.toString());
    } catch (error) {
      throw new Error(
        `Error fetching users for organization ${org}: ${error.message}`,
      );
    }
  }

  generateRandomId(length) {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';

    for (let i = 0; i < length; i++) {
      randomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return randomId;
  }

  async createGetWayForOrgUser(org: string) {
    let _identity = null;
    if (org == 'Org1') {
      _identity = OrganizationUsers.org1UserId;
      const wallet = await buildWallet(walletBasePath, org);
      //const wallet = walletBasePath+org+userEmail
      // Create a new gateway instance for interacting with the fabric network.
      // In a real application this would be done as the backend server session is setup for
      // a user that has been verified.
      const getWay = new Gateway();

      const gatewayOpts: GatewayOptions = {
        wallet,
        identity: _identity,
        discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
      };
      return { getWay: getWay, gatewayOpts: gatewayOpts };
    }
    if (org == 'Org2') {
      _identity = OrganizationUsers.org2UserId;
      const wallet = await buildWallet(walletBasePath, org);

      // Create a new gateway instance for interacting with the fabric network.
      // In a real application this would be done as the backend server session is setup for
      // a user that has been verified.
      const getWay = new Gateway();

      const gatewayOpts: GatewayOptions = {
        wallet,
        identity: _identity,
        discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
      };
      return { getWay: getWay, gatewayOpts: gatewayOpts };
    }
  }
  async getChainCodeForOrgUser(org: string) {
    const ccp = this.getCCPOrg(org);
    const way = await this.createGetWayForOrgUser(org);

    // setup the gateway instance
    // The user will now be able to create connections to the fabric network and be able to
    // submit transactions and query. All transactions submitted by this gateway will be
    // signed by this user using the credentials stored in the wallet.
    await way.getWay.connect(ccp, way.gatewayOpts);

    // Build a network instance based on the channel where the smart contract is deployed
    const network = await way.getWay.getNetwork(ChannelConfig.channelName);

    // Get the contract from the network.
    const contract = network.getContract(ChannelConfig.chaincodeName);
    //console.log('contract :', contract);

    return contract;
  }

  async getCarChainCodeForOrgUser(org: string) {
    const ccp = this.getCCPOrg(org);
    const way = await this.createGetWayForOrgUser(org);

    // setup the gateway instance
    // The user will now be able to create connections to the fabric network and be able to
    // submit transactions and query. All transactions submitted by this gateway will be
    // signed by this user using the credentials stored in the wallet.
    await way.getWay.connect(ccp, way.gatewayOpts);

    // Build a network instance based on the channel where the smart contract is deployed
    const network = await way.getWay.getNetwork(Config.channelName);

    // Get the contract from the network.
    const contract = network.getContract(Config.chaincodeName);
    //console.log('contract :', contract);

    return contract;
  }

  async getCarChainCodeForOrg(org: string) {
    const ccp = this.getCCPOrg(org);
    const way = await this.createGetWayForOrgUser(org);

    // setup the gateway instance
    // The user will now be able to create connections to the fabric network and be able to
    // submit transactions and query. All transactions submitted by this gateway will be
    // signed by this user using the credentials stored in the wallet.
    await way.getWay.connect(ccp, way.gatewayOpts);

    // Build a network instance based on the channel where the smart contract is deployed
    const network = await way.getWay.getNetwork(Config.channelName);

    // Get the contract from the network.
    const contract = network.getContract(Config.chaincodeName);
    //console.log('contract :', contract);

    return contract;
  }
}
