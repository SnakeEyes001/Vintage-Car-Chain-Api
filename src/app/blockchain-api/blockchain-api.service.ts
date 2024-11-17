import { Injectable } from '@nestjs/common';
import { CarService } from '../car/car.service';
import { HashService } from '../hash/hash.service';
import { CteateCarByOwnerDto } from './dto/create-car-by-owner-dto';
import { CreateCarDto } from '../car/dto/create-car.dto';
//import { file } from 'googleapis/build/src/apis/file';
import { UsersService } from '../users/users.service';
import { CreateUserProfileDto } from '../users/dto/user-dto';
import { UserSessionService } from '../user-session/user-session.service';
import { Request } from 'express';
import { SendEmailService } from '../send-email/send-email.service';
import * as crypto from 'crypto';
import { PasswordService } from '../password/password.service';
import { LoginToAccount } from './models/login-to-account';
import { AuthService } from '../auth/auth.service';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { IpfsService } from '../ipfs/ipfs.service';
import { UpdateAssetDto } from '../interaction/dto/update-asset-dto';
import { InteractionService } from '../interaction/interaction.service';

@Injectable()
export class BlockchainApiService {
  constructor(
    private hashService: HashService,
    private carService: CarService,
    private usersService: UsersService,
    private userSessionService: UserSessionService,
    private sendEmailService: SendEmailService,
    private passwordService: PasswordService,
    private authService: AuthService,
    private redisCacheService: RedisCacheService,
    private ipfsService: IpfsService,
    private interactionService: InteractionService,
  ) {}

  generateConfirmationCode(): string {
    return crypto.randomBytes(3).toString('hex'); // Génère un code hexadécimal de 6 caractères
  }

  async createNewUserCompte(req: Request): Promise<any> {
    try {
      const body = req.body;

      const code = this.generateConfirmationCode();
      this.userSessionService.setSession(req, 'user', body);
      this.userSessionService.setSession(req, 'code', code);

      //req.session['user']=body;
      //req.session['code']=code;
      //this.userSessionService.setSession(req ,'user',body);
      //this.userSessionService.setSession(req ,'code',code);

      //send confirmation code to user
      const requestConfirmation =
        await this.sendEmailService.sendRequestConfirmationToUser(
          body.email,
          body.lastName,
          code,
        );

      return 'You will receive a mail with a confirmation code, please confirme to create the account.';
    } catch (Error) {
      console.error('error', Error);
    }
  }

  async confirmationCreationProfile(req: Request) {
    try {
      const codeFromRequest = req.params.code;

      const userFromSession = this.userSessionService.getSession(req, 'user'); //req.session['user'];
      const codeFromSession = this.userSessionService.getSession(req, 'code'); //req.session['code'];
      if (codeFromRequest === codeFromSession) {
        const passAleatoire = await this.passwordService.generatePassword();
        //const newUserHash = await this.hashService.generateHashForUser(userFromSession);
        //userFromSession.hash = newUserHash;
        const result = await this.usersService.createUserProfile(
          userFromSession,
        );
        const notification = await this.sendEmailService.sendNotificationToUser(
          userFromSession.email,
          userFromSession.lastName,
          passAleatoire,
        );
        return {
          result: result,
          notification: notification,
        };
      } else {
        return "Le code que vous avez entrer n'est pas valide"!;
      }
    } catch (error) {
      console.log('error :', error);
    }
  }

  async logInToAccount(req: Request): Promise<any> {
    try {
      const { email, passowrd } = req.body;
      const result = await this.authService.verificationLogin(email);
      return result;
    } catch (Error) {
      console.error('error', Error);
    }
  }

  async createNewCarforOwner(
    org: string,
    createCarByOwnerDto: CteateCarByOwnerDto,
  ) {
    try {
      const userProfile = await this.usersService.findOne(
        createCarByOwnerDto.ownerEmail,
      );
      //const concatStrings = `${userHash}-@-${createCarByOwnerDto.ownerEmail}`;
      const hashOwner = await this.hashService.generateHashForUser(
        createCarByOwnerDto.ownerEmail,
      );
      const allUsers = await this.usersService.getAllUsers();
      let attributedCarID = null;
      const lastCarID = await this.redisCacheService.getVariable('carID');
      const lastCarIdNumber = parseInt(lastCarID);
      if (lastCarIdNumber) {
        attributedCarID = lastCarIdNumber + 1;
      } else {
        attributedCarID = 1;
      }
      await this.redisCacheService.setVariable('carID', attributedCarID);
      console.log('carId', lastCarID);

      const newCar = new CreateCarDto(
        attributedCarID,
        createCarByOwnerDto.brand,
        createCarByOwnerDto.model,
        createCarByOwnerDto.carInfos,
        createCarByOwnerDto.imageUrl,
        createCarByOwnerDto.documents,
        hashOwner,
        createCarByOwnerDto.oldOwners,
      );
      const savedCar = await this.carService.createCar(org, newCar);
      return savedCar;
    } catch (Error) {
      console.error('error', Error);
    }
  }

  async addPicturesToCar(
    org: string,
    carId: string,
    email: string,
    files: any,
  ) {
    try {
      const userProfile = await this.usersService.findOne(email);
      if (userProfile) {
        const listPicturesHash = [];
        for (let i = 0; i < files.length; i++) {
          const res = await this.ipfsService.uploadFile(files[i]);
          listPicturesHash.push(res);
        }
        console.log('pictures', listPicturesHash);
        const listString = JSON.stringify(listPicturesHash);
        const res = await this.carService.addCarPictures(
          org,
          carId,
          listString,
        );
        return res;
      } else {
        return 'You are not the owner !, Run !';
      }
    } catch (Error) {
      console.error('error', Error);
    }
  }

  async addDocumentsToCar(
    org: string,
    carId: string,
    email: string,
    files: any,
  ) {
    try {
      const userProfile = await this.usersService.findOne(email);
      //if (userProfile) {
      const res = await this.carService.addDocumentsToCar(org, carId, files);
      return res;
      // } else {
      //return 'user email invalide !';
      //}
    } catch (error) {
      console.log('error :', error);
    }
  }

  async allCars(org: string) {
    try {
      const allCars = await this.carService.allCars(org);
      if (allCars) {
        return allCars;
      } else {
        return "Il n'y a pas de voiture enregistes";
      }
    } catch (Error) {
      console.error('error', Error);
    }
  }

  async allCarsForOneOwner(org: string, email: string) {
    const carForOwner = await this.carService.allCarsForOneOwner(org, email);
    return carForOwner;
  }
  catch(Error) {
    console.error('error', Error);
  }

  async findCarByID(org: string, id: string) {
    try {
      const res = await this.carService.findCarByID(org, id);
      console.log('res :', res);
      return res;
    } catch (error) {
      console.log('error :', error);
    }
  }

  async removeCar(org: string, id: string) {
    try {
      const res = await this.carService.removeCar(org, id);
      console.log('res :', res);
      return res;
    } catch (error) {
      console.log('error :', error);
    }
  }

  async transferCar(
    org: string,
    emailFrom: string,
    carId: string,
    emailTo: string,
  ) {
    try {
      const car = await this.carService.findCarByID(org, carId);
      const oldOwnersTab = JSON.parse(car.OldOwners);
      const OldOwnerHash = car.Owner;
      const compareHash = await this.hashService.compareHash(
        emailFrom,
        OldOwnerHash,
      );
      //if (compareHash) {
      oldOwnersTab.push(OldOwnerHash);
      car.OldOwners = oldOwnersTab;
      const allCars = await this.allCars(org);
      const allCarsJson = JSON.parse(allCars);
      let newOwner = null;
      for (const car in allCarsJson) {
        const compare = await this.hashService.compareHash(
          emailTo,
          allCarsJson[car].Owner,
        );
        if (compare) {
          newOwner = allCarsJson[car].Owner;
        }
      }
      car.Owner = newOwner;
      const transferResult = await this.carService.transferCar(
        org,
        newOwner,
        carId,
      );
      const updatedAsset = new UpdateAssetDto(
        car.ID,
        car.Brand,
        car.Model,
        car.CarInfos,
        car.ImageUrl,
        car.Documents,
        car.Owner,
        JSON.stringify(car.OldOwners),
      );
      const res = await this.interactionService.updateAsset(org, updatedAsset);
      return res;
    } catch (error) {
      console.log('error :', error);
    }
  }
}
