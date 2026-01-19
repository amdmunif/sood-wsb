import { Router } from 'express';
import {
    createSubjectCategory,
    deleteSubjectCategory,
    getSubjectCategories,
    updateSubjectCategory,
} from '../controllers/subjectCategoryController';

const router = Router();

router.get('/', getSubjectCategories);
router.post('/', createSubjectCategory);
router.put('/:id', updateSubjectCategory);
router.delete('/:id', deleteSubjectCategory);

export default router;
