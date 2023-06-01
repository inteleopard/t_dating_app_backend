const _ = require('lodash');
const Order = require('@appetism/binant-codetest-shared/src/models/order.model');

/**
 * Create order
 * @param body {Object} - order body
 * @returns {Promise<Order>}
 */
const createOrder = async (body) => {
  return Order.create(body);
};

const updateOrder = async (order, body) => {
  _.merge(order, body);
  await order.save();

  return order;
};

/**
 * Update order by id
 * @param orderId {ObjectId} - order id
 * @param body {Object} - order body
 * @returns {Promise<Order>}
 */
const updateOrderById = async (orderId, body) => {
  return Order.findByIdAndUpdate(orderId, body);
};

const findAndUpdateOrder = async (filter, body) => {
  return Order.findOneAndUpdate(filter, body);
};

/**
 * Get order by id
 * @param orderId {ObjectId} - order id
 * @returns {Promise<Order>}
 */
const getOrderById = async (orderId) => {
  return Order.findById(orderId);
};

module.exports = {
  createOrder,
  updateOrder,
  getOrderById,
  updateOrderById,
  findAndUpdateOrder,
};
