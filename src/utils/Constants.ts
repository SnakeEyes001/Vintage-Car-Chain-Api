import * as fs from 'fs';
import * as path from 'path';

export enum ChannelConfig {
  channelName = 'mychannel',
  chaincodeName = 'basic',
}

export enum Config {
  channelName = 'mychannel',
  chaincodeName = 'basic',
}

export enum MspOrgs {
  MspOrg1 = 'Org1MSP',
  MspOrg2 = 'Org2MSP',
}

export enum Organization {
  Org1 = 'org1',
  Org2 = 'org2',
}

export enum Department {
  Department1 = 'department1',
  Department2 = 'department2',
  Department3 = 'department3',
}

export enum OrganizationUsers {
  org1UserId = 'appOrg1User',
  org2UserId = 'appOrg2User',
}

export enum CAHostName {
  caHostNameOrg1 = 'ca.org1.example.com',
  caHostNameOrg2 = 'ca.org2.example.com',
}

export const walletBasePath = path.resolve('src', 'wallet');

export enum functionNames {
  InitLedger = 'InitLedger',
  GetAllAssets = 'GetAllAssets',
  getAssetById = 'ReadAsset',
  CreateAsset = 'CreateAsset',
  AssetExists = 'AssetExists',
  UpdateAsset = 'UpdateAsset',
  DeleteAsset = 'DeleteAsset',
  TransferAsset = 'TransferAsset',
}

export enum UserChaincodeFunctions {
  InitUsersLedger = 'InitUsersLedger',
  GetAllUsers = 'GetAllUsers',
  GetAssetById = 'ReadUser',
  CreateUser = 'CreateUser',
  UserExists = 'UserExists',
  UpdateUser = 'UpdateUser',
  DeleteUser = 'DeleteUser',
}

export const hashPassword = 'cathmeifyoucanmotherfucker';
