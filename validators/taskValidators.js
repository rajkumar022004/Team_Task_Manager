import { body } from 'express-validator';
import { TASK_STATUSES } from '../models/Task.js';
import checkAllowedFields from '../middleware/checkAllowedFields.js';
import { mongoIdParam } from './commonValidators.js';

export const createTaskAllowedFields = [
  'title',
  'description',
  'assignedTo',
  'project',
  'status',
  'deadline',
];

export const adminUpdateAllowedFields = [
  'title',
  'description',
  'assignedTo',
  'project',
  'status',
  'deadline',
];

export const memberUpdateAllowedFields = ['status'];

export const taskIdValidation = mongoIdParam('id', 'task ID');

export const createTaskValidation = [
  checkAllowedFields(createTaskAllowedFields),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description').optional().trim().isString().withMessage('Description must be a string'),
  body('assignedTo')
    .notEmpty()
    .withMessage('assignedTo is required')
    .isMongoId()
    .withMessage('assignedTo must be a valid user ID'),
  body('project')
    .notEmpty()
    .withMessage('project is required')
    .isMongoId()
    .withMessage('project must be a valid project ID'),
  body('status')
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),
  body('deadline')
    .optional({ values: 'null' })
    .isISO8601()
    .withMessage('deadline must be a valid date'),
];

export const adminUpdateValidation = [
  ...taskIdValidation,
  checkAllowedFields(adminUpdateAllowedFields),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().isString().withMessage('Description must be a string'),
  body('assignedTo').optional().isMongoId().withMessage('assignedTo must be a valid user ID'),
  body('project').optional().isMongoId().withMessage('project must be a valid project ID'),
  body('status')
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),
  body('deadline')
    .optional({ values: 'null' })
    .isISO8601()
    .withMessage('deadline must be a valid date'),
];

export const memberUpdateValidation = [
  ...taskIdValidation,
  checkAllowedFields(memberUpdateAllowedFields),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),
];
