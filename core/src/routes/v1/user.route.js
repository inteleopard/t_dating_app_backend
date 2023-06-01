const express = require('express');
const validate = require('@appetism/binant-codetest-shared/src/middlewares/validate');
const auth = require('../../middlewares/auth');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/me')
  .get(auth(), userController.getCurrentUser)
  .patch(auth(), validate(userValidation.updateMe), userController.updateMe)
  .delete(auth(), userController.deleteMe);

module.exports = router;
