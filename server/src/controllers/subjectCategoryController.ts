import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';

const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

export const getSubjectCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.subjectCategory.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

export const createSubjectCategory = async (req: Request, res: Response) => {
    try {
        const { name } = categorySchema.parse(req.body);

        // Check duplicate
        const existing = await prisma.subjectCategory.findUnique({
            where: { name },
        });

        if (existing) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        const category = await prisma.subjectCategory.create({
            data: { name },
        });

        res.status(201).json(category);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to create category' });
    }
};

export const updateSubjectCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = categorySchema.parse(req.body);

        const category = await prisma.subjectCategory.update({
            where: { id: parseInt(id) },
            data: { name },
        });

        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
};

export const deleteSubjectCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.subjectCategory.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
