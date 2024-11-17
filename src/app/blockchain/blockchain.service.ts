import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as crypto from 'crypto';
import { AdminOprService } from '../admin-opr/admin-opr.service';
import { CreateUserDto } from './dto/create-user-dto';
import { CreateAssetDto } from './dto/create-asset-dto';
import { AddDocumentsToAssetDto } from './dto/add-docs-dto';
import { TransferRequestDto } from './dto/transfer-request-dto';
import { UsersService } from '../users/users.service';
import { UserSessionService } from '../user-session/user-session.service';
import { SendEmailService } from '../send-email/send-email.service';
import { PasswordService } from '../password/password.service';
import { HashService } from '../hash/hash.service';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { MspOrgs, walletBasePath } from 'src/utils/Constants';
import { buildWallet } from 'src/utils/AppUtil';
import { parse } from 'path';
import { AuthService } from '../auth/auth.service';
import { AddPictureDto } from './dto/add-picture-dto';
import { IpfsService } from '../ipfs/ipfs.service';

@Injectable()
export class BlockchainService {
  private contractOrg1;
  private contractOrg2;

  constructor(
    private adminOprService: AdminOprService,
    private usersService: UsersService,
    private userSessionService: UserSessionService,
    private sendEmailService: SendEmailService,
    private passwordService: PasswordService,
    private hashService: HashService,
    private redisCacheService: RedisCacheService,
    private authService: AuthService,
    private ipfsService: IpfsService,
  ) {
    //this.contractOrg1 = this.adminOprService.getChainCodeForOrgUser('Org1');
    //this.contractOrg2 = this.adminOprService.getChainCodeForOrgUser('Org2');
  }

  generateConfirmationCode(): string {
    return crypto.randomBytes(3).toString('hex'); // Génère un code hexadécimal de 6 caractères
  }
  private async getContract(org: string) {
    const contract = await this.adminOprService.getChainCodeForOrgUser(org);
    if (org === 'Org1') {
      this.contractOrg1 = contract;
    }
    if (org === 'Org2') {
      this.contractOrg2 = contract;
    }

    return contract; //org === 'Org1' ? this.contractOrg1 : this.contractOrg2;
  }

  async initLedger() {
    try {
      const contract = await this.getContract('Org1');

      // Soumission de la transaction pour initialiser le registre
      const result = await contract.submitTransaction('InitLedger');

      // Décodage du résultat si le retour est un Buffer
      const decodedResult = result
        ? result.toString('utf8')
        : 'Registre initialisé avec succès';

      return {
        message: 'Initialisation du registre réussie',
        data: decodedResult,
      };
    } catch (error) {
      console.error('Erreur lors de l’initialisation du registre :', error);
      return {
        error: "Échec de l'initialisation du registre",
        details: error.message,
      };
    }
  }

  //Seuls les utilisateurs de l'organisation Org1 peuvent créer un profil utilisateur.
  async createUserTMP(req: Request) {
    try {
      const body = req.body;
      //console.log('body', body);

      const code = this.generateConfirmationCode();
      this.userSessionService.setSession(req, 'user', body);
      this.userSessionService.setSession(req, 'code', code);

      //send confirmation code to user
      const requestConfirmation =
        await this.sendEmailService.sendRequestConfirmationToUser(
          body.email,
          body.lastName,
          code,
        );

      return {
        res: requestConfirmation,
        message:
          'You will receive a mail with a confirmation code, please confirme to create the account.',
      };
    } catch (error) {
      console.error('Erreur lors de la création de l’utilisateur :', error);
      return {
        error: "Impossible de créer l'utilisateur",
        details: error.message,
      };
    }
  }

  //Seuls les utilisateurs de l'organisation Org1 peuvent créer un profil utilisateur.
  async createFinalProfile(req: Request) {
    try {
      const codeFromRequest = req.body.code;
      //console.log('code request :', codeFromRequest);

      const userFromSession = this.userSessionService.getSession(req, 'user');
      const codeFromSession = this.userSessionService.getSession(req, 'code');
      //console.log('code session :', codeFromSession);
      if (codeFromRequest === codeFromSession) {
        const passAleatoire = await this.passwordService.generatePassword();

        const notification = await this.sendEmailService.sendNotificationToUser(
          userFromSession.email,
          userFromSession.lastName,
          passAleatoire,
        );
        //Enregitrement dans la base de donnes
        const userBD = await this.usersService.createUserProfile(
          userFromSession,
        );
        //Generate user hash
        const userHash = await this.hashService.generateHashForUser(
          userFromSession.email,
        );

        const contract = await this.getContract('Org1');
        //const { email, password } = userFromSession;

        // Vérification des paramètres avant d'envoyer la transaction
        //if (!userId || !userHash) {
        //throw new Error('userId et userHash doivent être fournis.');
        //}

        // Soumission de la transaction
        const result = await contract.submitTransaction('CreateUser', userHash);
        const jsonString = result.toString('utf8');
        // Décodage du résultat si nécessaire (si renvoyé sous forme de Buffer ou de JSON)
        const decodedResult = result
          ? result.toString('utf8')
          : 'Transaction réussie sans résultat supplémentaire';
        //const jsonString = buffer.toString('utf8');
        return {
          message: 'Utilisateur créé avec succès',
          data: JSON.parse(decodedResult),
          result: JSON.parse(jsonString),
          //notification: notification,
        };
      } else {
        return "Le code que vous avez entrer n'est pas valide"!;
      }
    } catch (error) {
      console.log('error :', error);
    }
  }

  async logInToApp(req: Request): Promise<any> {
    try {
      const { email, passowrd } = req.body;
      const result = await this.authService.verificationLogin(email);
      return result;
    } catch (Error) {
      console.error('error', Error);
    }
  }

  // Récupérer l'admin et la liste des utilisateurs d'une organisation
  async getAllUsers(org: string): Promise<any> {
    try {
      /*    let orgMSP = null;
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

      const adminId = `${orgMSP}_admin`; */

      // Récupérer les utilisateurs via la chaîne
      const contract = await this.adminOprService.getCarChainCodeForOrg(org);
      const result = await contract.evaluateTransaction('GetAllUsers');
      const jsonString = result.toString('utf8');

      //const users = typeof result === 'string' ? JSON.parse(result.toString()) : result;

      return JSON.parse(jsonString);
    } catch (error) {
      console.log('error :', error);
      /*  throw new Error(
        `Erreur lors de la récupération des utilisateurs et admin pour ${org}: ${error.message}`,
      ); */
    }
  }

  async userExists(org: string, userId: string) {
    try {
      const contract = await this.getContract(org);

      // Évaluation de la transaction pour vérifier l'existence de l'utilisateur
      const result = await contract.evaluateTransaction('UserExists', userId);

      // Décodage du résultat pour un format lisible (assumant un résultat sous forme de Buffer booléen)
      const exists = result.toString('utf8') === 'true';

      return { userId, exists };
    } catch (error) {
      console.error(
        'Erreur lors de la vérification de l’existence de l’utilisateur :',
        error,
      );
      return {
        error: "Échec de la vérification de l'existence de l'utilisateur",
        details: error.message,
      };
    }
  }

  async readUser(org: string, userId: string) {
    try {
      const contract = await this.getContract(org);

      // Évaluation de la transaction pour lire les informations de l'utilisateur
      const result = await contract.evaluateTransaction('ReadUser', userId);

      // Décodage de la réponse en JSON pour un format plus lisible
      const userData = JSON.parse(result.toString('utf8'));

      return { userId, userData };
    } catch (error) {
      console.error(
        'Erreur lors de la lecture des informations de l’utilisateur :',
        error,
      );
      return {
        error: "Échec de la lecture des informations de l'utilisateur",
        details: error.message,
      };
    }
  }

  //'Seuls les collectionneurs (Org1) peuvent créer un actif.'
  async createAsset(createAssetDto: CreateAssetDto) {
    try {
      const contract = await this.getContract('Org1');
      const { email, brand, model, carInfos, imageUrl, documents, owner } =
        createAssetDto;
      const profile = await this.usersService.findOne(email);

      const allUsers = await this.getAllUsers('Org1');
      for (let user in allUsers) {
        const hash = allUsers[user].UserHash;
        const compareHash = await this.hashService.compareHash(
          profile.email,
          hash,
        );
        if (compareHash) {
          console.log('res :', 1);
          // Soumission de la transaction pour créer un actif avec les informations fournies
          const result = await contract.submitTransaction(
            'CreateAsset',
            brand,
            model,
            JSON.stringify(carInfos), // Assurer que carInfos est en format JSON string si nécessaire
            imageUrl,
            JSON.stringify(documents), // Assurer que documents est en format JSON string si nécessaire
            owner,
          );
          console.log('res :', result);

          // Décoder le résultat pour vérifier la création
          const assetData = JSON.parse(result.toString('utf8'));

          return { success: true, data: assetData };
        }
      }
    } catch (error) {
      console.error('Erreur lors de la création de l’actif :', error);
      return {
        error: "Échec de la création de l'actif",
        details: error.message,
      };
    }
  }

  async AddPictureToAsset(addPictureDto: AddPictureDto) {
    try {
      const contract = await this.getContract('Org1');
      const asset = await this.readAsset('Org1', addPictureDto.assetId);
      // Décodage de la réponse en JSON pour un format plus lisible
      const assetData = JSON.parse(asset.toString());

      if (assetData) {
        const { assetId, brand, model, carInfos, imageUrl, documents, owner } =
          addPictureDto;
        // Soumission de la transaction pour mettre à jour l'actif avec les informations fournies
        const result = await contract.submitTransaction(
          'UpdateAsset',
          assetId,
          brand,
          model,
          JSON.stringify(carInfos), // Encodage JSON pour les objets complexes
          imageUrl,
          JSON.stringify(documents), // Encodage JSON pour les documents
          owner,
        );

        // Décoder le résultat pour vérifier la mise à jour
        const updatedAssetData = JSON.parse(result.toString('utf8'));

        return { success: true, updatedAssetData };
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l’actif :', error);
      return {
        error: "Échec de la mise à jour de l'actif",
        details: error.message,
      };
    }
  }

  async addDocumentsToCar(
    addDocumentsToAssetDto: AddDocumentsToAssetDto,
    files: any,
  ) {
    try {
      const contract = await this.getContract('Org1');
      const asset = await this.readAsset(
        'Org1',
        addDocumentsToAssetDto.assetId,
      );
      // Décodage de la réponse en JSON pour un format plus lisible
      const assetData = JSON.parse(asset.toString());
      const { assetId, brand, model, carInfos, imageUrl, documents, owner } =
        addDocumentsToAssetDto;

      if (assetData) {
        // asset json
        //const assetJson = JSON.parse(assetData);
        const assetDocumentJson = JSON.parse(documents);

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
        assetDocumentJson.cidDoc1 = cidDoc1;
        assetDocumentJson.cidDoc2 = cidDoc2;
        assetDocumentJson.cidDoc3 = cidDoc3;
        assetDocumentJson.cidDoc4 = cidDoc4;
        //reviens au string format
        const carDocsString = JSON.stringify(assetDocumentJson);
        assetData.Documents = carDocsString;

        // Soumission de la transaction pour mettre à jour l'actif avec les informations fournies
        const result = await contract.submitTransaction(
          'UpdateAsset',
          assetId,
          brand,
          model,
          JSON.stringify(carInfos), // Encodage JSON pour les objets complexes
          imageUrl,
          JSON.stringify(documents), // Encodage JSON pour les documents
          owner,
        );
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l’actif :', error);
      return {
        error: "Échec de la mise à jour de l'actif",
        details: error.message,
      };
    }
  }

  async requestTransfer(org: string, transferRequestDto: TransferRequestDto) {
    try {
      const contract = await this.getContract(org);
      const { id, requesterUserHash, newOwner } = transferRequestDto;
      const timestamp = new Date();
      const timestampStr = timestamp.toString();
      // Soumission de la transaction pour demander le transfert
      const result = await contract.submitTransaction(
        'RequestTransfer',
        id,
        requesterUserHash,
        newOwner,
        timestampStr,
      );
      //console.log('res :', result);
      const requestData = JSON.parse(result.toString('utf8'));
      // Vérification si la transaction a réussi (optionnel, selon la logique de votre blockchain)
      return { success: true, result: requestData };
    } catch (error) {
      console.error('Erreur lors de la demande de transfert :', error);
      return {
        error: 'Échec de la demande de transfert',
        details: error.message,
      };
    }
  }

  async approveTransferByCenter(org: string, id: string, req: Request) {
    try {
      const contract = await this.getContract(org);
      //const { requestIndex } = req.body;
      //const inndexInt = parseInt(requestIndex);

      // Soumission de la transaction pour approuver le transfert
      const result = await contract.submitTransaction(
        'ApproveTransferByCenter',
        id,
      );
      //console.log('res :', result);
      const resData = JSON.parse(result.toString('utf8'));
      // Si nécessaire, retourner le résultat ou un message de succès
      return {
        success: true,
        message: 'Transfert approuvé avec succès',
        result: resData,
      };
    } catch (error) {
      console.error("Erreur lors de l'approbation du transfert :", error);
      return {
        error: "Échec de l'approbation du transfert",
        details: error.message,
      };
    }
  }

  async approveTransferByOwner(
    org: string,
    id: string,
    approverUserHash: string,
  ) {
    try {
      const contract = await this.getContract(org);

      // Soumission de la transaction pour approuver le transfert par le propriétaire
      const result = await contract.submitTransaction(
        'ApproveTransferByOwner',
        id,
        approverUserHash,
      );
      //const resData = JSON.parse(result.toString('utf8'));
      // Si nécessaire, retourner le résultat ou un message de succès
      return {
        success: true,
        message: 'Transfert approuvé par le propriétaire avec succès',
        result: result,
      };
    } catch (error) {
      console.error(
        "Erreur lors de l'approbation du transfert par le propriétaire :",
        error,
      );
      return {
        error: "Échec de l'approbation du transfert par le propriétaire",
        details: error.message,
      };
    }
  }

  async rejectTransferByCenter(org: string, id: string, requestIndex: number) {
    try {
      const contract = await this.getContract(org);

      // Soumission de la transaction pour rejeter le transfert par le centre
      const result = await contract.submitTransaction(
        'RejectTransferByCenter',
        id,
        requestIndex.toString(),
      );

      // Si nécessaire, retourner le résultat ou un message de succès
      return {
        success: true,
        message: 'Transfert rejeté par le centre avec succès',
        transactionId: result.toString('utf8'),
      };
    } catch (error) {
      console.error('Erreur lors du rejet du transfert par le centre :', error);
      return {
        error: 'Échec du rejet du transfert par le centre',
        details: error.message,
      };
    }
  }

  async readAsset(org: string, id: string) {
    try {
      const contract = await this.getContract(org);

      // Évaluation de la transaction pour lire l'actif
      const result = await contract.evaluateTransaction('ReadAsset', id);

      // Conversion du résultat en chaîne de caractères
      const assetData = Buffer.from(result).toString('utf8');

      // Retourner les données de l'actif
      return { success: true, assetData: assetData };
    } catch (error) {
      console.error("Erreur lors de la lecture de l'actif :", error);

      // Retourner un objet d'erreur structuré
      return {
        success: false,
        error: "Échec de la lecture de l'actif",
        details: error.message,
      };
    }
  }

  async assetExists(org: string, id: string) {
    try {
      const contract = await this.getContract(org);

      // Évaluation de la transaction pour vérifier l'existence de l'actif
      const result = await contract.evaluateTransaction('AssetExists', id);

      // Conversion du résultat en chaîne de caractères
      const assetExists = result.toString() === 'true'; // On s'assure que le résultat est bien un booléen sous forme de chaîne

      // Retourner un objet indiquant si l'actif existe ou non
      return { success: true, assetExists: assetExists };
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'existence de l'actif :",
        error,
      );

      // Retourner un objet d'erreur structuré
      return {
        success: false,
        error: "Échec de la vérification de l'existence de l'actif",
        details: error.message,
      };
    }
  }

  async getAllAssets(org: string) {
    try {
      // Récupérer les utilisateurs via la chaîne
      const contract = await this.getContract(org);
      const result = await contract.evaluateTransaction('GetAllAssets');
      console.log('result :', result);
      const jsonString = result.toString('utf8');

      //const users = typeof result === 'string' ? JSON.parse(result.toString()) : result;

      return JSON.parse(jsonString);
      //const contract = await this.getContract(org);
      //const res = await contract.evaluateTransaction('GetAllAssets');
      //console.log('res :', res);
      // Vérifier que res est bien un Buffer avant de le convertir
      /* if (Buffer.isBuffer(res)) {
        const ListAllAsset = JSON.parse(res.toString('utf8')); // Parse en JSON directement
        return ListAllAsset;
      } else {
        throw new Error(
          "La réponse n'est pas un Buffer, impossible de traiter les données.",
        );
      } */
    } catch (error) {
      console.error('Erreur lors de la récupération des actifs :', error);
      return { error: 'Impossible de récupérer les actifs.' };
    }
  }

  async getAllRequests(org: string) {
    try {
      const contract = await this.getContract(org);
      const res = await contract.evaluateTransaction('GetAllRequests');
      const jsonString = res.toString('utf8');

      //const users = typeof result === 'string' ? JSON.parse(result.toString()) : result;

      return JSON.parse(jsonString);

      // Vérification que res est bien un Buffer avant de le convertir
      /*   if (Buffer.isBuffer(res)) {
        const ListAllRequests = JSON.parse(res.toString('utf8')); // Parse directement en JSON
        return ListAllRequests;
      } else {
        throw new Error(
          "La réponse n'est pas un Buffer, impossible de traiter les données.",
        );
      } */
    } catch (error) {
      console.error('Erreur lors de la récupération des requêtes :', error);
      return { error: 'Impossible de récupérer les requêtes.' };
    }
  }

  async getRequestsByUser(org: string, userHash: string) {
    try {
      const contract = await this.getContract(org);

      // Évaluation de la transaction pour récupérer les demandes par utilisateur
      const result = await contract.evaluateTransaction(
        'GetRequestsByUser',
        userHash,
      );

      // Conversion du résultat en chaîne de caractères (ou en format approprié)
      const requestsData = Buffer.from(result).toString('utf8');

      // Retourner les données des demandes
      return { success: true, requestsData: requestsData };
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des demandes par utilisateur :',
        error,
      );

      // Retourner un objet d'erreur structuré
      return {
        success: false,
        error: 'Échec de la récupération des demandes',
        details: error.message,
      };
    }
  }
}
