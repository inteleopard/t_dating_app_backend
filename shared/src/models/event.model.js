const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const { toJSON } = require('./plugins');
const { CURRENCIES, ORDER_STATUS } = require('../config/constants');

const eventSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    seats: Number,
    address: String,
    amount: Number,
    currency: {
      type: String,
      enum: Object.values(CURRENCIES),
      default: CURRENCIES.USD,
    },
    date: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

eventSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'event',
  justOne: false,
  match: { status: ORDER_STATUS.SUCCESS },
});

// add plugin that converts mongoose to json
eventSchema.plugin(toJSON);
eventSchema.plugin(paginate);

/**
 * @typedef Event
 */
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
