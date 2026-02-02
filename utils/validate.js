const checkAsync = require('../utils/checkAsync');

/**
 * Middleware to validate request data using Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} source - Where to get the data from (body, params, query)
 */
const validate = (schema, source = 'body') => {
  return checkAsync(async (req, res, next) => {
    const data = req[source];
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        errors: errors,
      });
    }

    // Replace req[source] with validated and sanitized value
    req[source] = value;
    next();
  });
};

module.exports = validate;
