import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        role: string;
    };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        (req as AuthRequest).user = user;
        next();
    });
};
