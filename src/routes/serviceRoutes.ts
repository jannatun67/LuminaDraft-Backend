import express from 'express';
import { getServices, getServiceById, getCategories } from '../controllers/serviceController';

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/categories', getCategories);
router.get('/:id', getServiceById);

// Protected routes (add auth middleware when needed)
// router.post('/', authMiddleware, createService);
// router.put('/:id', authMiddleware, updateService);
// router.delete('/:id', authMiddleware, deleteService);

export default router;