const _ = require('lodash');
const {
  models: { Event },
} = require('@appetism/binant-codetest-shared');

const queryEvents = async (filter = {}, options = {}) => {
  const enhancedOptions = {
    populate: [{ path: 'orders', select: 'user -event' }],
    sort: 'date',
    ...options,
  };

  return Event.paginate(filter, enhancedOptions);
};

const getEventById = async (eventId) => {
  return Event.findById(eventId).populate({
    path: 'orders',
    select: 'user -event',
    populate: {
      path: 'user',
      select: 'id name birthDate',
    },
  });
};

const createEvent = async (body) => {
  return Event.create(body);
};

const updateEvent = async (event, body) => {
  _.merge(event, body);

  await event.save();
  return event;
};

const deleteEventById = async (eventId) => {
  return Event.findByIdAndDelete(eventId);
};

const exitAllEvents = async (userId) => {
  // todo update all events orders made from this user to ORDER_STATUS.REFUND_PENDING
};

module.exports = {
  queryEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEventById,
  exitAllEvents,
};
