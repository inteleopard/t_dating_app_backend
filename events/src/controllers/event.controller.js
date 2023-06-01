const httpStatus = require('http-status');
const {
  utils: { catchAsync, pick },
  config: {
    constants: { EVENT_PAST },
  },
} = require('@appetism/binant-codetest-shared');
const eventService = require('../services/event.service');

const getEvents = catchAsync(async (req, res) => {
  const options = pick(req.query, ['limit', 'page', 'sort']);
  const filter = pick(req.query, ['active']);

  filter.date = req.query.when === EVENT_PAST ? { $lt: new Date() } : { $gte: new Date() };

  const result = await eventService.queryEvents(filter, options);
  res.send(result);
});

const getEvent = catchAsync(async (req, res) => {
  const event = await eventService.getEventById(req.params.eventId);
  res.status(event ? httpStatus.OK : httpStatus.NOT_FOUND).send(event);
});

const createEvent = catchAsync(async (req, res) => {
  const event = await eventService.createEvent(req.body);
  res.status(httpStatus.CREATED).send(event);
});

const updateEventById = catchAsync(async (req, res) => {
  const event = await eventService.getEventById(req.params.eventId);
  if (!event) {
    return res.status(httpStatus.NOT_FOUND).send();
  }

  await eventService.updateEvent(event, req.body);
  res.status(httpStatus.OK).send();
});

const deleteEvent = catchAsync(async (req, res) => {
  await eventService.deleteEventById(req.params.eventId);
  res.status(httpStatus.OK).send();
});

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEventById,
  deleteEvent,
};
