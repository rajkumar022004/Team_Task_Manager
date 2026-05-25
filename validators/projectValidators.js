import { body } from 'express-validator';
import checkAllowedFields from '../middleware/checkAllowedFields.js';
import { mongoIdParam } from './commonValidators.js';

export const createProjectAllowedFields = ['title', 'description', 'members'];
export const addMembersAllowedFields = ['members'];

export const createProjectValidation = [
  checkAllowedFields(createProjectAllowedFields),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description').optional().trim().isString().withMessage('Description must be a string'),
  body('members')
    .optional()
    .isArray()
    .withMessage('Members must be an array of user IDs'),
  body('members.*')
    .optional()
    .isMongoId()
    .withMessage('Each member must be a valid user ID'),
];

export const addMembersValidation = [
  ...mongoIdParam('id', 'project ID'),
  checkAllowedFields(addMembersAllowedFields),
  body('members')
    .isArray({ min: 1 })
    .withMessage('Members array is required and must not be empty'),
  body('members.*').isMongoId().withMessage('Each member must be a valid user ID'),
];

export const projectIdValidation = mongoIdParam('id', 'project ID');
