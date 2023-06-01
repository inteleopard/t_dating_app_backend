const Joi = require('joi');
const { GENDERS } = require('@appetism/binant-codetest-shared/src/config/constants');
const { password, objectId } = require('@appetism/binant-codetest-shared/src/utils/customValidation');

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      birthDate: Joi.date(),
      gender: Joi.string().valid(...GENDERS),
    })
    .min(1),
};

const { params, ...updateMe } = updateUser;

module.exports = {
  getUser,
  updateUser,
  updateMe,
};
