import { Injectable } from '@nestjs/common';
import { DEFAULT_FACTORY_CLASS_METHOD_KEY } from '@nestjs/common/module-utils/constants';
import * as bcrypt from 'bcrypt';
import { hashPassword } from 'src/utils/Constants';
import { UsersService } from '../users/users.service';
import * as CryptoJS from 'crypto-js';
import { Request } from 'express';
@Injectable()
export class HashService {
  constructor() {} //private usersService : UsersService,

  async generateHashForUser(data: string) {
    //const saltOrRounds = 10;
    const salt = await bcrypt.genSalt();
    const password = data;
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async compareHash(data: string, hash: string) {
    const isMatch = await bcrypt.compare(data, hash);
    if (isMatch) {
      return true;
    } else {
      return false;
    }
  }

  // Exemple de chiffrement AES
  encryptData(req: Request): string {
    const { params } = req;
    return CryptoJS.AES.encrypt(
      params.data,
      process.env.ENCRYPTING_KEY,
    ).toString();
  }

  // Exemple de déchiffrement AES
  decryptData(ciphertext: string, key: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
