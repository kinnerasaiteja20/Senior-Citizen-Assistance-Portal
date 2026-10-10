import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'btech_senior_citizen_portal_jwt_secret_2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'senior' | 'volunteer' | 'admin';
    name: string;
  };
}

export function generateToken(payload: { id: string; email: string; role: string; name: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await db.users.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User account not found.' });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Account has been suspended by administration.' });
    }
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };
    next();
  } catch (err: any) {
    return res.status(403).json({ error: 'Invalid or expired authentication token.' });
  }
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Permission denied. Required role: ${allowedRoles.join(' or ')}`,
      });
    }
    next();
  };
}
