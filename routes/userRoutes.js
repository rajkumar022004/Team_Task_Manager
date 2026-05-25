import express from 'express';
import { getMembers } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/members', authorize('admin'), getMembers);

export default router;
