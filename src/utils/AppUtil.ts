/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wallet, Wallets } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';
import { walletBasePath } from './Constants';

//const walletPath = 'src/wallet'; //path.join(__dirname, 'wallet');
//'C:\\Users\\User\\Desktop\\ProjetX\\hyper-leadger-getway\\src'; //

const buildCCPOrg1 = (): Record<string, any> => {
  // load the common connection configuration file
  const ccpPath = path.resolve(
    'src',
    'organizations',
    'peerOrganizations',
    'org1.example.com',
    'connection-org1.json',
  );
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

const buildCCPOrg2 = (): Record<string, any> => {
  // load the common connection configuration file
  const ccpPath = path.resolve(
    'src',
    'organizations',
    'peerOrganizations',
    'org2.example.com',
    'connection-org2.json',
  );
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

const buildWallet = async (
  walletPath: string,
  org: string,
): Promise<Wallet> => {
  // Create a new  wallet : Note that wallet is for managing identities.
  let wallet: Wallet;
  try {
    if (walletPath) {
      const pth = path.resolve(
        walletPath,org
      );
      wallet = await Wallets.newFileSystemWallet(pth);
      console.log(`Built a file system wallet at ${pth}`);
    } else {
      wallet = await Wallets.newInMemoryWallet();
      console.log('Built an in memory wallet');
    }
    return wallet;
  } catch (error) {
    console.log('error', error);
  }
};

const prettyJSONString = (inputString: string): string => {
  if (inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
  } else {
    return inputString;
  }
};

export { buildCCPOrg1, buildCCPOrg2, buildWallet, prettyJSONString };
