const Joi = require('joi');
const {
  config: {
    constants: { CURRENCIES },
  },
} = require('@appetism/binant-codetest-shared');
const { objectId } = require('@appetism/binant-codetest-shared/src/utils/customValidation');

const createEvent = {
  body: Joi.object().keys({
    description: Joi.string(),
    seats: Joi.number(),
    address: Joi.string(),
    amount: Joi.number(),
    currency: Joi.string().valid(...Object.values(CURRENCIES)),
    date: Joi.date(),
  }),
};

const updateEvent = {
  ...createEvent,
  params: Joi.object().keys({
    eventId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createEvent,
  updateEvent,
};
