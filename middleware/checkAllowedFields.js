import ApiError from '../utils/ApiError.js';

const checkAllowedFields =
  (allowedFields = []) =>
  (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return next();
    }

    const unknownFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (unknownFields.length > 0) {
      return next(
        new ApiError(400, 'Request contains invalid fields', [
          {
            field: unknownFields.join(', '),
            message: `Unknown field(s): ${unknownFields.join(', ')}`,
          },
        ])
      );
    }

    next();
  };

export default checkAllowedFields;
