import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  addProjectMembers,
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import {
  createProjectValidation,
  addMembersValidation,
  projectIdValidation,
} from '../validators/projectValidators.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getProjects)
  .post(authorize('admin'), createProjectValidation, validate, createProject);

router.route('/:id').get(projectIdValidation, validate, getProjectById);

router.put(
  '/:id/members',
  authorize('admin'),
  addMembersValidation,
  validate,
  addProjectMembers
);

export default router;
