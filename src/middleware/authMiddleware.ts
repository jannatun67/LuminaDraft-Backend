import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';
import User from '../models/User';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ success: false, error: 'No token provided' });
      return;
    }
    const decoded = await admin.auth().verifyIdToken(token);

    const dbUser = await User.findOne({ uid: decoded.uid }).select('role isActive');

    (req as any).user = {
      uid: decoded.uid,
      email: decoded.email ?? '',
      role: dbUser?.role ?? 'User',
      isActive: dbUser?.isActive ?? true,
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;
  if (!user || !['Admin', 'Manager'].includes(user.role)) {
    res.status(403).json({ success: false, error: 'Admin access required' });
    return;
  }
  next();
};
