import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UserSessionService {

  
  setSession(req: Request, key: string, value: any): void {
    req.session[key] = value;
  }

  getSession(req: Request, key: string): any {
    return req.session[key];
  }

  deleteSession(req: Request, key: string): void {
    delete req.session[key];
  }

  clearSession(req: Request): void {
    req.session.destroy((err) => {
      if (err) {
        console.error('Failed to destroy session', err);
      }
    });
  }
}
