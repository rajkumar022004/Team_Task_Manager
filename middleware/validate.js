import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

const formatValidationErrors = (errors) =>
  errors.map((err) => ({
    field: err.path === '' ? err.type : err.path,
    message: err.msg,
    ...(err.value !== undefined && { value: err.value }),
  }));

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = formatValidationErrors(result.array());
    const message =
      errors.length === 1
        ? errors[0].message
        : 'Validation failed. Please check your input.';
    return next(new ApiError(400, message, errors));
  }

  next();
};

export default validate;
