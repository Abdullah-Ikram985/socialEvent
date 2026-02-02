const Joi = require('joi');

const sendMessageSchema = Joi.object({
  content: Joi.string().trim().required().max(5000).messages({
    'string.empty': 'Message content is required',
    'string.max': 'Message cannot be more than 5000 characters',
    'any.required': 'Message content is required',
  }),
});

module.exports = sendMessageSchema;
