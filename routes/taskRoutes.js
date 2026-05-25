import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import runValidation from '../middleware/runValidation.js';
import {
  createTaskValidation,
  adminUpdateValidation,
  memberUpdateValidation,
  taskIdValidation,
} from '../validators/taskValidators.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(authorize('admin'), createTaskValidation, validate, createTask);

router
  .route('/:id')
  .put((req, res, next) => {
    const rules =
      req.user.role === 'admin' ? adminUpdateValidation : memberUpdateValidation;
    runValidation(rules)(req, res, next);
  }, updateTask)
  .delete(authorize('admin'), taskIdValidation, validate, deleteTask);

export default router;
