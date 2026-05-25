import { param } from 'express-validator';

export const mongoIdParam = (paramName = 'id', label = 'ID') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${label}`),
];
