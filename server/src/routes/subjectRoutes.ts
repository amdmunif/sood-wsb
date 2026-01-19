import { Router } from 'express';
import {
    createSubject,
    deleteSubject,
    getSubjects,
    updateSubject,
} from '../controllers/subjectController';

const router = Router();

router.get('/', getSubjects);
router.post('/', createSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

export default router;
