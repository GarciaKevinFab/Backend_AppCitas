import express from 'express';
import { getSpecialties, getRecommendation } from '../controllers/specialtyController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/specialties', getSpecialties);
router.post('/recommendation', authMiddleware, getRecommendation);

export default router;
