const express = require('express');
const { PERMISSIONS } = require('@appetism/binant-codetest-shared/src/config/constants');
const auth = require('../../middlewares/auth');
const { orderController } = require('../../controllers');

const router = express.Router();

router.route('/').post(auth([PERMISSIONS.MANAGE_ORDERS]), orderController.createOrder);
router
  .route('/:id')
  .get(auth([PERMISSIONS.MANAGE_ORDERS]), orderController.getOrder)
  .patch(auth([PERMISSIONS.MANAGE_ORDERS]), orderController.updateOrder);

module.exports = router;
