const httpStatus = require('http-status');
const catchAsync = require('@appetism/binant-codetest-shared/src/utils/catchAsync');
const { orderService } = require('../services');

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.status(httpStatus.CREATED).send(order);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  res.status(order ? httpStatus.OK : httpStatus.NOT_FOUND).send(order);
});

const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  if (!order) {
    return res.status(httpStatus.NOT_FOUND).send();
  }

  await orderService.updateOrder(order, req.body);
  res.status(httpStatus.OK).send();
});

module.exports = {
  createOrder,
  getOrder,
  updateOrder,
};
