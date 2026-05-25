import { formatErrorResponse } from '../utils/apiResponse.js';

const DUPLICATE_KEY_CODE = 11000;

const getDuplicateFieldMessage = (keyValue = {}) => {
  const field = Object.keys(keyValue)[0];

  if (field === 'email') {
    return 'Email is already registered';
  }

  const label = field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Resource';
  return `${label} already exists`;
};

const formatMongooseValidationErrors = (err) =>
  Object.values(err.errors).map((error) => ({
    field: error.path,
    message: error.message,
  }));

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || res.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  if (err.name === 'SyntaxError' && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ${err.path || 'resource'} ID`;
    errors = [{ field: err.path || 'id', message }];
  }

  if (err.name === 'ValidationError' && !err.statusCode) {
    statusCode = 400;
    errors = formatMongooseValidationErrors(err);
    message =
      errors.length === 1
        ? errors[0].message
        : 'Validation failed. Please check your input.';
  }

  if (err.code === DUPLICATE_KEY_CODE) {
    statusCode = 409;
    message = getDuplicateFieldMessage(err.keyValue);
    errors = Object.entries(err.keyValue || {}).map(([field, value]) => ({
      field,
      message: getDuplicateFieldMessage({ [field]: value }),
      value,
    }));
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  if (err.message?.includes('not allowed by CORS')) {
    statusCode = 403;
    message = 'CORS policy: origin not allowed';
  }

  if (!err.isOperational && statusCode === 500) {
    message = 'Internal Server Error';
    errors = null;
  }

  if (statusCode === 200) {
    statusCode = 500;
  }

  res.status(statusCode).json(
    formatErrorResponse({
      statusCode,
      message,
      errors,
      stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    })
  );
};

export default errorHandler;
