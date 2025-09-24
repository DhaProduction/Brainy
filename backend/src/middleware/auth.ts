import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';

export interface AuthUser {
  userId: string;
  organisationId: string;
  role: 'owner' | 'admin' | 'member';
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthUser;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Missing authentication token' });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AuthUser;
    req.auth = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireRole(roles: AuthUser['role'][]): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    return next();
  };
}
