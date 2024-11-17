import { Injectable } from '@nestjs/common';
import * as securePassword from 'secure-random-password';

@Injectable()
export class PasswordService {
  generatePassword(): string {
    return securePassword.randomPassword({
      length: 20,  // longueur du mot de passe
      characters: [
        securePassword.lower,
        securePassword.upper,
        securePassword.digits,
        securePassword.symbols,
      ],
    });
  }
}
