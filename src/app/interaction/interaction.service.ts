import { Injectable } from '@nestjs/common';
import { prettyJSONString } from 'src/utils/AppUtil';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserChaincodeFunctions, functionNames } from 'src/utils/Constants';
// ESM
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { parse, stringify, toJSON, fromJSON } from 'flatted';
import { AdminOprService } from '../admin-opr/admin-opr.service';
import { CreateAssetDto } from './dto/create-asset-dto';
import { UpdateCarDto } from '../car/dto/update-car.dto';
import { UpdateAssetDto } from './dto/update-asset-dto';
import { AssetDto } from './dto/asset';

@Injectable()
export class InteractionService {
  constructor(private adminOprService: AdminOprService) {}

  async InitLedger(org: string) {
    const contract = await this.adminOprService.getChainCodeForOrgUser(org);
    console.log('contract :', contract);
    console.log(
      '\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger',
    );
    const res = await contract.submitTransaction('InitLedger');
    console.log('*** Result: committed');

    return res;
  }

  async getAllAssets(org: string) {
    const contract = await this.adminOprService.getChainCodeForOrgUser(org);
    // Let's try a query type operation (function).
    // This will be sent to just one peer and the results will be shown.
    console.log(
      '\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger',
    );
    const result = await contract.evaluateTransaction('GetAllAssets');
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return prettyJSONString(result.toString());
  }

  async createAsset(org: string, createAssetDto: CreateAssetDto) {
    const contract = await this.adminOprService.getChainCodeForOrgUser(org);
    // Now let's try to submit a transaction.
    // This will be sent to both peers and if both peers endorse the transaction, the endorsed proposal will be sent
    // to the orderer to be committed by each of the peer's to the channel ledger.
    console.log(
      '\n--> Submit Transaction: CreateAsset, creates new asset with ID, color, owner, size, and appraisedValue arguments',
    );
    const res = await contract.submitTransaction(
      functionNames.CreateAsset,
      createAssetDto.ID,
      createAssetDto.Brand,
      createAssetDto.Model,
      createAssetDto.CarInfos,
      createAssetDto.ImageUrl,
      createAssetDto.Documents,
      createAssetDto.OwnerHash,
      createAssetDto.OldOwnersHash,
    );
    console.log('*** Result: committed');
    return res;
  }

  async getAssetById(org: string, assetId: string) :Promise<any> {
    const contract = await this.adminOprService.getChainCodeForOrgUser(org);
    console.log(
      '\n--> Evaluate Transaction: ReadAsset, function returns an asset with a given assetID',
    );
    const result = await contract.evaluateTransaction(
      functionNames.getAssetById,
      assetId,
    );
    console.log(`*** Result: ${JSON.parse(JSON.stringify(result.toString()))}`);

    return JSON.parse(JSON.stringify(result.toString()))
  }

  async assetExist(org: string, assetId = 'asset1') {
    const contract = await this.adminOprService.getChainCodeForOrgUser(org);
    console.log(
      '\n--> Evaluate Transaction: AssetExists, function returns "true" if an asset with given assetID exist',
    );
    const result = await contract.evaluateTransaction(
      functionNames.AssetExists,
      assetId,
    );
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return prettyJSONString(result.toString());
  }

  async deleteAsset(org: string, assetId: string) {
    const contract = await this.adminOprService.getChainCodeForOrgUser(org);
    console.log(
      '\n--> Evaluate Transaction: AssetExists, function returns "true" if an asset with given assetID exist',
    );
    const result = await contract.submitTransaction(
      functionNames.DeleteAsset,
      assetId,
    );
    // Recréer le Buffer à partir du tableau 'data'
    const buffer = Buffer.from(result.buffer);
  
    // Conversion du Buffer en chaîne de caractères
    const str = buffer.toString()
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return str; //prettyJSONString(result.toString());
  }
  //stlsca.org1.example.com-cert
  async updateAsset(org: string, updateAssetDto: UpdateAssetDto) {
    try {
      const contract = await this.adminOprService.getChainCodeForOrgUser(org);
      console.log(
        '\n--> Submit Transaction: UpdateAsset asset.',
      );

      const result = await contract.submitTransaction(
        functionNames.UpdateAsset,
        updateAssetDto.ID,
        updateAssetDto.Brand,
        updateAssetDto.Model,
        updateAssetDto.CarInfos,
        updateAssetDto.ImageUrl,
        updateAssetDto.Documents,
        updateAssetDto.OwnerHash,
        updateAssetDto.OldOwnersHash,
      );
      console.log('*** Result: committed');
      return prettyJSONString(result.toString());
    } catch (error) {
      console.log('error :', error);
    }
  }

  async transferAsset(org: string, owner: string, assetId: string) {
    const contract = await this.adminOprService.getChainCodeForOrgUser(org);
    console.log(
      '\n--> Submit Transaction: TransferAsset asset1, transfer to new owner of Tom',
    );
    const result = await contract.submitTransaction(
      functionNames.TransferAsset,
      assetId,
      owner,
    );
    console.log('*** Result: committed');
    return JSON.parse(JSON.stringify(result.toString()));
  }
}
