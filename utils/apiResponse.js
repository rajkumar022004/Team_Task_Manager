export const sendSuccess = (res, { statusCode = 200, message, data, count } = {}) => {
  const response = { success: true };

  if (message) response.message = message;
  if (data !== undefined) response.data = data;
  if (count !== undefined) response.count = count;

  res.status(statusCode).json(response);
};

export const formatErrorResponse = ({
  statusCode,
  message,
  errors = null,
  stack = null,
}) => {
  const response = {
    success: false,
    statusCode,
    message,
  };

  if (errors?.length) {
    response.errors = errors;
  }

  if (stack) {
    response.stack = stack;
  }

  return response;
};
