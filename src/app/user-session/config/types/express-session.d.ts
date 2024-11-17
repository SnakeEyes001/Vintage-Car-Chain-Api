// types/express-session.d.ts
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    [key: string]: any;
  }
}

declare module 'express' {
  interface Request {
    session: session.Session & Partial<session.SessionData>;
  }
}
