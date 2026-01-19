import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';

const subjectSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    category_id: z.number().int().optional(),
});

export const getSubjects = async (req: Request, res: Response) => {
    try {
        const subjects = await prisma.subject.findMany({
            include: { category: true },
        });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
};

export const createSubject = async (req: Request, res: Response) => {
    try {
        const { name, category_id } = subjectSchema.parse(req.body);

        const existing = await prisma.subject.findUnique({
            where: { name },
        });

        if (existing) {
            return res.status(400).json({ error: 'Subject already exists' });
        }

        const subject = await prisma.subject.create({
            data: {
                name,
                category_id: category_id || null,
            },
            include: { category: true },
        });

        res.status(201).json(subject);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Failed to create subject' });
    }
};

export const updateSubject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, category_id } = subjectSchema.parse(req.body);

        const subject = await prisma.subject.update({
            where: { id: parseInt(id as string) },
            data: {
                name,
                category_id: category_id || null,
            },
            include: { category: true },
        });

        res.json(subject);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update subject' });
    }
};

export const deleteSubject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.subject.delete({
            where: { id: parseInt(id as string) },
        });

        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete subject' });
    }
};
