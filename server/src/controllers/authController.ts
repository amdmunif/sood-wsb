import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../utils/prisma';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
});

const generateTokens = (user: any) => {
    const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' } // 1 day for simplicity in dev
    );
    return { accessToken };
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const { accessToken } = generateTokens(user);

        res.json({
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                pkbm_id: user.pkbm_id,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Login failed' });
    }
};

export const getMe = async (req: Request, res: Response) => {
    // Configured middleware should populate req.user
    const userId = (req as any).user?.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                pkbm_id: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
