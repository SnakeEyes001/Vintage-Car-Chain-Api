'use strict';

const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {
  // Initialisation du ledger avec des valeurs par défaut (optionnel)
  async InitLedger(ctx) {
    // Initialisation des compteurs
    await ctx.stub.putState('userCounter', Buffer.from('0'));
    await ctx.stub.putState('assetCounter', Buffer.from('0'));

    const assets = [];
    const users = [];

    for (const asset of assets) {
      asset.docType = 'asset';
      await ctx.stub.putState(
        asset.ID,
        Buffer.from(stringify(sortKeysRecursive(asset))),
      );
    }

    for (const user of users) {
      user.docType = 'user';
      await ctx.stub.putState(
        user.ID,
        Buffer.from(stringify(sortKeysRecursive(user))),
      );
    }
  }

  // Fonction interne pour récupérer et incrémenter un compteur
  async _getAndIncrementCounter(ctx, key) {
    const counterBytes = await ctx.stub.getState(key);
    const counter =
      counterBytes && counterBytes.length > 0
        ? parseInt(counterBytes.toString())
        : 0;
    const newCounter = counter + 1;
    await ctx.stub.putState(key, Buffer.from(newCounter.toString()));
    return newCounter;
  }

  // Génération automatique d'un ID utilisateur unique
  async GenerateUserId(ctx) {
    const userCounter = await this._getAndIncrementCounter(ctx, 'userCounter');
    return `USER${userCounter}`;
  }

  // Génération automatique d'un ID actif unique
  async GenerateAssetId(ctx) {
    const assetCounter = await this._getAndIncrementCounter(
      ctx,
      'assetCounter',
    );
    return `ASSET${assetCounter}`;
  }

  // Création d'un utilisateur
  async CreateUser(ctx, userHash) {
    const clientMSPID = ctx.clientIdentity.getMSPID();
    if (clientMSPID !== 'Org1MSP') {
      throw new Error(
        "Seuls les utilisateurs de l'organisation Org1 peuvent créer un profil utilisateur.",
      );
    }

    const userId = await this.GenerateUserId(ctx);

    const user = {
      ID: userId,
      UserHash: userHash,
      docType: 'user',
    };

    await ctx.stub.putState(
      userId,
      Buffer.from(stringify(sortKeysRecursive(user))),
    );
    return JSON.stringify(user);
  }

  // Vérification de l'existence d'un utilisateur
  async UserExists(ctx, userId) {
    const userJSON = await ctx.stub.getState(userId);
    return userJSON && userJSON.length > 0;
  }

  // Lecture des informations d'un utilisateur
  async ReadUser(ctx, userId) {
    const userJSON = await ctx.stub.getState(userId);
    if (!userJSON || userJSON.length === 0) {
      throw new Error(`L'utilisateur ${userId} n'existe pas`);
    }
    return userJSON.toString();
  }

  // Création d'un actif
  async CreateAsset(
    ctx,
    brand,
    model,
    carInfos,
    imageUrl,
    documents,
    owner,
    userHash,
  ) {
    const clientMSPID = ctx.clientIdentity.getMSPID();
    if (clientMSPID !== 'Org1MSP') {
      throw new Error(
        'Seuls les collectionneurs (Org1) peuvent créer un actif.',
      );
    }

    if (!brand || !model || !carInfos || !documents) {
      throw new Error(
        "Les champs 'brand', 'model', 'carInfos', et 'documents' sont obligatoires.",
      );
    }

    try {
      carInfos = JSON.parse(carInfos);
      documents = JSON.parse(documents);
    } catch (err) {
      throw new Error(
        "Les champs 'carInfos' et 'documents' doivent être des objets JSON valides.",
      );
    }

    const assetId = await this.GenerateAssetId(ctx);

    const asset = {
      ID: assetId,
      Brand: brand,
      Model: model,
      CarInfos: carInfos,
      ImageUrl: imageUrl,
      Documents: documents,
      Owner: userHash,
      OldOwners: [],
      TransferRequests: [],
      docType: 'asset',
    };

    await ctx.stub.putState(
      assetId,
      Buffer.from(stringify(sortKeysRecursive(asset))),
    );
    return JSON.stringify(asset);
  }

  // Mise à jour d'un actif existant (accessible uniquement par Org1)
  async UpdateAsset(
    ctx,
    id,
    brand,
    model,
    carInfos,
    imageUrl,
    documents,
    owner,
    userHash,
  ) {
    const clientMSPID = ctx.clientIdentity.getMSPID();
    if (clientMSPID !== 'Org1MSP') {
      throw new Error(
        'Seuls les collectionneurs (Org1) peuvent mettre à jour un actif.',
      );
    }

    const exists = await this.AssetExists(ctx, id);
    if (!exists) {
      throw new Error(`L'actif ${id} n'existe pas`);
    }

    try {
      carInfos = JSON.parse(carInfos);
      documents = JSON.parse(documents);
    } catch (err) {
      throw new Error(
        "Les champs 'carInfos' et 'documents' doivent être des objets JSON valides.",
      );
    }

    const asset = {
      ID: id,
      Brand: brand,
      Model: model,
      CarInfos: carInfos,
      ImageUrl: imageUrl,
      Documents: documents,
      Owner: owner,
      OldOwners: [],
      TransferRequests: [],
      docType: 'asset',
    };

    await ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(asset))),
    );
    return JSON.stringify(asset);
  }

  // Vérification de l'existence d'un actif
  async AssetExists(ctx, id) {
    const assetJSON = await ctx.stub.getState(id);
    return assetJSON && assetJSON.length > 0;
  }

  // Approbation finale par le propriétaire
  async ApproveTransferByOwner(ctx, id, approverUserHash, requestIndex) {
    const clientMSPID = ctx.clientIdentity.getMSPID();
    if (clientMSPID !== 'Org1MSP') {
      throw new Error(
        'Seuls les collectionneurs (Org1) peuvent approuver le transfert final.',
      );
    }

    const assetString = await this.ReadAsset(ctx, id);
    const asset = JSON.parse(assetString);

    if (requestIndex < 0 || requestIndex >= asset.TransferRequests.length) {
      throw new Error(
        `Demande de transfert non trouvée à l'index ${requestIndex}`,
      );
    }

    const request = asset.TransferRequests[requestIndex];
    if (request.Status !== 'pending_approval_by_owner') {
      throw new Error(
        "La demande de transfert n'est pas en attente de validation par le propriétaire.",
      );
    }

    asset.OldOwners.push({ Owner: asset.Owner, UserHash: asset.UserHash });
    asset.Owner = request.NewOwner;
    asset.UserHash = approverUserHash;
    request.Status = 'approved';

    await ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(asset))),
    );

    return `Transfert de propriété pour l'actif ${id} approuvé. Nouveau propriétaire : ${asset.Owner}`;
  }

  // Rejet de la demande par le centre
  async RejectTransferByCenter(ctx, id, requestIndex) {
    const clientMSPID = ctx.clientIdentity.getMSPID();
    if (clientMSPID !== 'Org2MSP') {
      throw new Error(
        'Seuls les centres de cartes grises (Org2) peuvent rejeter la demande de transfert.',
      );
    }

    const assetString = await this.ReadAsset(ctx, id);
    const asset = JSON.parse(assetString);

    if (requestIndex < 0 || requestIndex >= asset.TransferRequests.length) {
      throw new Error(
        `Demande de transfert non trouvée à l'index ${requestIndex}`,
      );
    }

    const request = asset.TransferRequests[requestIndex];
    if (request.Status !== 'pending_approval_by_center') {
      throw new Error(
        "La demande de transfert n'est pas en attente de validation par le centre.",
      );
    }

    request.Status = 'rejected';

    await ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(asset))),
    );

    return `Demande de transfert ${requestIndex} pour l'actif ${id} rejetée par le centre.`;
  }

  // Lecture de toutes les demandes de transfert
  async GetAllRequests(ctx) {
    const query = { selector: { docType: 'request' } };
    const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    return JSON.stringify(await this._getAllResults(iterator));
  }

  // Lecture des demandes de transfert d'un utilisateur
  async GetRequestsByUser(ctx, userHash) {
    const query = {
      selector: { RequesterUserHash: userHash, docType: 'request' },
    };
    const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    return JSON.stringify(await this._getAllResults(iterator));
  }

  // Récupérer les actifs par utilisateur
  async GetAssetsByUserHash(ctx, userHash) {
    const query = { selector: { Owner: userHash, docType: 'asset' } };
    const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    return JSON.stringify(await this._getAllResults(iterator));
  }

  // Fonction utilitaire pour récupérer tous les résultats d'un itérateur
  async _getAllResults(iterator) {
    const results = [];
    let result = await iterator.next();
    while (!result.done) {
      const strValue = result.value.value.toString('utf8');
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.error(err);
        record = strValue;
      }
      results.push(record);
      result = await iterator.next();
    }
    iterator.close();
    return results;
  }
}

module.exports = AssetTransfer;
