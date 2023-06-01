const mongoose = require('mongoose');
const { ORDER_STATUS, CURRENCIES } = require('../config/constants');
const { toJSON } = require('./plugins');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Event',
  },
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    required: true,
  },
  currency: {
    type: String,
    enum: Object.values(CURRENCIES),
    default: CURRENCIES.USD,
  },
  amount: {
    type: Number,
  },
});

orderSchema.plugin(toJSON);

/**
 * @typedef Order
 */
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
