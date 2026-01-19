import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';

const studentSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    nik: z.string().length(16, 'NIK must be 16 characters').regex(/^\d+$/, 'NIK must be numeric').optional().nullable(),
    pkbm_id: z.number().int(),
});

export const getStudents = async (req: Request, res: Response) => {
    try {
        const students = await prisma.student.findMany({
            include: { pkbm: true },
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch students' });
    }
};

export const createStudent = async (req: Request, res: Response) => {
    try {
        const { name, email, nik, pkbm_id } = studentSchema.parse(req.body);

        // Check duplicate Email
        const existingEmail = await prisma.student.findUnique({
            where: { email },
        });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Check duplicate NIK (only if provided)
        if (nik) {
            const existingNik = await prisma.student.findUnique({
                where: { nik },
            });
            if (existingNik) {
                return res.status(400).json({ error: 'NIK already registered' });
            }
        }

        const student = await prisma.student.create({
            data: {
                name,
                email,
                nik: nik || null,
                pkbm_id,
            },
            include: { pkbm: true },
        });

        res.status(201).json(student);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Failed to create student' });
    }
};

export const updateStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, nik, pkbm_id } = studentSchema.parse(req.body);

        const student = await prisma.student.update({
            where: { id: parseInt(id as string) },
            data: {
                name,
                email,
                nik: nik || null,
                pkbm_id,
            },
            include: { pkbm: true },
        });

        res.json(student);
    } catch (error) {
        // Handle generic or specific Prisma errors
        res.status(500).json({ error: 'Failed to update student' });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.student.delete({
            where: { id: parseInt(id as string) },
        });

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete student' });
    }
};
