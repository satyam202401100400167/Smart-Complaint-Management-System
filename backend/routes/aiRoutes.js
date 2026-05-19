import express from 'express';
import { analyze, chat } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';
import { analyzeValidation, chatValidation } from '../validators/complaintValidator.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', analyzeValidation, validate, analyze);
router.post('/chat', chatValidation, validate, chat);

export default router;
